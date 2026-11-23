import {binary, hex, maxentries, report} from "./symbolbinary.js";

const names = {
    0x05: "parameter", 0x0a: "label", 0x0d: "member", 0x1d: "inlined function", 0x27: "constant",
    0x28: "enumerator", 0x2e: "function", 0x34: "variable", 0x3f: "procedure", 0x48: "call site"
};
const referenceforms = new Set([0x10, 0x11, 0x12, 0x13, 0x14, 0x15]);
const stringindexforms = new Set([0x1a, 0x25, 0x26, 0x27, 0x28, 0x1f02]);
const addressindexforms = new Set([0x1b, 0x29, 0x2a, 0x2b, 0x2c, 0x1f01]);

class cursor {
    constructor(bytes, little, offset, end = bytes.length) {
        this.reader = new binary(bytes, little);
        this.offset = offset;
        this.end = end;
    }

    take(length) {
        if (!Number.isSafeInteger(length) || length < 0 || this.offset > this.end - length) {
            throw new Error("Truncated DWARF field.");
        }
        const offset = this.offset;
        this.reader.range(offset, length);
        this.offset += length;
        return offset;
    }

    integer(length) {
        const at = this.take(length);
        if (length === 1) return BigInt(this.reader.bytes[at]);
        if (length === 2) return BigInt(this.reader.u16(at));
        if (length === 4) return BigInt(this.reader.u32(at));
        if (length === 8) return this.reader.u64(at);
        const bytes = this.reader.bytes.subarray(at, at + length);
        let value = 0n;
        for (let index = 0; index < length; index++) {
            value = value * 256n + BigInt(bytes[this.reader.little ? length - index - 1 : index]);
        }
        return value;
    }

    number(length) {
        return Number(this.integer(length));
    }

    leb(signed = false) {
        let value = 0n;
        for (let shift = 0n; shift <= 63n; shift += 7n) {
            const byte = this.number(1);
            value |= BigInt(byte & 127) << shift;
            if (!(byte & 128)) {
                return signed && (byte & 64) ? value - (1n << (shift + 7n)) : value;
            }
        }
        throw new Error("Invalid DWARF LEB128 field.");
    }

    string() {
        let end = this.offset;
        while (end < this.end && this.reader.bytes[end]) end++;
        if (end === this.end) throw new Error("Unterminated DWARF string.");
        const at = this.take(end - this.offset + 1);
        return this.reader.name(at, end);
    }
}

function abbreviations(bytes, offset, little) {
    const input = new cursor(bytes, little, offset);
    const map = new Map();
    for (;;) {
        const code = Number(input.leb());
        if (!code) return map;
        if (map.size >= 65536 || map.has(code)) throw new Error("Invalid DWARF abbreviations.");
        const tag = Number(input.leb());
        const children = input.number(1) !== 0;
        const attributes = [];
        for (;;) {
            const name = Number(input.leb());
            const form = Number(input.leb());
            if (!name && !form) break;
            if (!name || !form || attributes.length >= 256) throw new Error("Invalid DWARF abbreviation attributes.");
            attributes.push({name, form, constant: form === 0x21 ? input.leb(true) : undefined});
        }
        map.set(code, {tag, children, attributes});
    }
}

function field(input, form, unit, constant) {
    if (form === 0x16) {
        form = Number(input.leb());
        if (form === 0x16 || form === 0x21) throw new Error("Invalid indirect DWARF form.");
    }
    let value;
    switch (form) {
    case 0x01: value = input.integer(unit.address); break;
    case 0x03: input.take(input.number(2)); break;
    case 0x04: input.take(input.number(4)); break;
    case 0x05: case 0x12: case 0x26: case 0x2a: value = input.integer(2); break;
    case 0x06: case 0x13: case 0x1c: case 0x28: case 0x2c: value = input.integer(4); break;
    case 0x07: case 0x14: case 0x20: case 0x24: value = input.integer(8); break;
    case 0x08: value = input.string(); break;
    case 0x09: case 0x18: input.take(Number(input.leb())); break;
    case 0x0a: input.take(input.number(1)); break;
    case 0x0b: case 0x0c: case 0x11: case 0x25: case 0x29: value = input.integer(1); break;
    case 0x0d: value = input.leb(true); break;
    case 0x0e: case 0x17: case 0x1d: case 0x1f: case 0x1f20: case 0x1f21: value = input.integer(unit.offset); break;
    case 0x0f: case 0x15: case 0x1a: case 0x1b: case 0x22: case 0x23: case 0x1f01: case 0x1f02: value = input.leb(); break;
    case 0x10: value = input.integer(unit.version === 2 ? unit.address : unit.offset); break;
    case 0x19: value = 1n; break;
    case 0x1e: input.take(16); break;
    case 0x21: value = constant; break;
    case 0x27: case 0x2b: value = input.integer(3); break;
    default: throw new Error("Unsupported DWARF form " + hex(form) + ".");
    }
    return {form, value};
}

function sectionname(sections, key, at, little) {
    const bytes = sections.get(key);
    if (!bytes) return "";
    return new binary(bytes, little).name(Number(at));
}

function stringvalue(sections, unit, item, little) {
    if (!item) return "";
    const {form, value} = item;
    if (typeof value === "string") return value;
    if (form === 0x0e) return sectionname(sections, "debug_str", value, little);
    if (form === 0x1f) return sectionname(sections, "debug_line_str", value, little);
    if (stringindexforms.has(form)) {
        const offsets = sections.get("debug_str_offsets") || sections.get("debug_str_offs");
        const at = unit.stringbase + Number(value) * unit.offset;
        if (offsets && at + unit.offset <= offsets.length && at >= 0) {
            const offset = new cursor(offsets, little, at).integer(unit.offset);
            return sectionname(sections, "debug_str", offset, little);
        }
    }
    return "";
}

function addressvalue(sections, unit, item, little) {
    if (!item) return "";
    if (item.form === 0x01) return hex(item.value);
    if (addressindexforms.has(item.form)) {
        const bytes = sections.get("debug_addr");
        const at = unit.addressbase + Number(item.value) * unit.address;
        if (bytes && at >= 0 && at <= bytes.length - unit.address) return hex(new cursor(bytes, little, at).integer(unit.address));
    }
    return "";
}

function readunit(input, unit) {
    unit.version = input.number(2);
    if (unit.version < 2 || unit.version > 5) throw new Error("Unsupported DWARF version " + unit.version + ".");
    let offset;
    if (unit.version === 5) {
        const type = input.number(1);
        unit.address = input.number(1);
        offset = input.number(unit.offset);
        if (type === 2 || type === 6) input.take(8 + unit.offset);
        if (type === 4 || type === 5) input.take(8);
    } else {
        offset = input.number(unit.offset);
        unit.address = input.number(1);
    }
    if (![1, 2, 4, 8].includes(unit.address)) throw new Error("Invalid DWARF address size.");
    return offset;
}

/*//////////////////////////////////////////////////////////////////////*/

export function dwarfsymbols(sections, little, architecture, notes = []) {
    const info = sections.get("debug_info");
    const abbrev = sections.get("debug_abbrev");
    if (!info || !abbrev) {
        return report("DWARF", architecture, [], [...notes, "No complete DWARF information and abbreviation sections were found."]);
    }
    const units = new cursor(info, little, 0);
    const tables = new Map();
    const records = new Map();
    let failures = 0;
    while (units.offset < units.end && records.size < maxentries) {
        const start = units.offset;
        let end;
        try {
            let length = units.number(4);
            const wide = length === 0xffffffff;
            if (wide) length = units.number(8);
            if (!length) continue;
            end = units.offset + length;
            if (!Number.isSafeInteger(end) || end > units.end) throw new Error("Truncated DWARF compilation unit.");
            const input = new cursor(info, little, units.offset, end);
            const unit = {start, offset: wide ? 8 : 4, stringbase: 0, addressbase: 0};
            const aboffset = readunit(input, unit);
            if (!tables.has(aboffset)) tables.set(aboffset, abbreviations(abbrev, aboffset, little));
            const declarations = tables.get(aboffset);
            while (input.offset < end && records.size < maxentries) {
                const position = input.offset;
                const code = Number(input.leb());
                if (!code) continue;
                const declaration = declarations.get(code);
                if (!declaration) throw new Error("Unknown DWARF abbreviation.");
                const record = {unit, tag: declaration.tag};
                for (const attribute of declaration.attributes) {
                    const value = field(input, attribute.form, unit, attribute.constant);
                    switch (attribute.name) {
                    case 0x03: record.name = value; break;
                    case 0x11: record.address = value; break;
                    case 0x31: case 0x47: case 0x7f:
                        if (referenceforms.has(value.form)) record.reference = Number(value.value) + (value.form === 0x10 ? 0 : unit.start);
                        break;
                    case 0x6e: case 0x2007: record.linkage = value; break;
                    case 0x72: unit.stringbase = Number(value.value); break;
                    case 0x73: case 0x2133: unit.addressbase = Number(value.value); break;
                    }
                }
                if (names[record.tag] && (record.name || record.linkage || record.reference !== undefined)) {
                    records.set(position, record);
                }
            }
        } catch (error) {
            failures++;
            if (failures <= 3) notes.push(error.message);
            if (!Number.isSafeInteger(end) || end > units.end || end <= start) break;
        }
        units.offset = end;
    }
    if (records.size >= maxentries) notes.push("DWARF extraction reached the symbol limit.");
    if (failures > 3) notes.push(`${failures} DWARF compilation units could not be read completely.`);
    const entries = [];
    for (const record of records.values()) {
        const type = names[record.tag];
        if (!type) continue;
        let current = record;
        let name = "";
        let display = "";
        for (let index = 0; current && index < 8 && !name; index++) {
            name = stringvalue(sections, current.unit, current.linkage, little);
            display ||= stringvalue(sections, current.unit, current.name, little);
            current = records.get(current.reference);
        }
        name ||= display;
        if (!name) continue;
        entries.push({name, address: addressvalue(sections, record.unit, record.address, little), type});
    }
    return report("DWARF", architecture, entries, notes);
}
