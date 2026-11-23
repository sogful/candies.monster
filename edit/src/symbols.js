import {binary, hex, maxentries, report, table} from "./symbolbinary.js";
import {dwarfsymbols} from "./dwarfsymbols.js";

const elfarch = {3: "x86", 8: "mips", 20: "ppc", 21: "ppc64", 40: "arm", 62: "x86_64", 183: "arm64", 243: "risc-v"};
const elftypes = ["", "object", "function", "section", "file", "common", "thread-local"];
const macharch = {7: "x86", 12: "arm", 18: "ppc", 16777223: "x86_64", 16777228: "arm64", 33554444: "arm64_32", 16777234: "ppc64"};
const armarch = {6: "armv6", 9: "armv7", 11: "armv7s", 12: "armv7k", 14: "armv6-m", 15: "armv7-m", 16: "armv7e-m"};
const stabtypes = {0x20: "global", 0x24: "function", 0x26: "static", 0x28: "local common", 0x40: "register", 0x44: "source line", 0x64: "source file", 0x66: "object file", 0x80: "local", 0x82: "include", 0x84: "include file", 0xa0: "parameter", 0xc0: "block start", 0xe0: "block end", 0xe2: "common start", 0xe4: "common end"};
const absoluterelocations = {
    3: {1: 4}, 8: {2: 4, 18: 8}, 20: {1: 4}, 21: {1: 4, 38: 8}, 40: {2: 4},
    62: {1: 8, 10: 4, 11: 4}, 183: {257: 8, 258: 4, 259: 2}, 243: {1: 4, 2: 8}
};

function elfdebug(view, section, wide, legacy) {
    const bytes = view.range(section.offset, section.size);
    const header = legacy ? 12 : wide ? 24 : 12;
    const unpack = globalThis.fflate?.unzlibSync;
    if (!unpack) throw new Error("Zlib decoding is unavailable.");
    if (bytes.length < header) throw new Error("The compression header is incomplete.");
    let length;
    if (legacy) {
        const compressed = new binary(bytes, false);
        if (compressed.name(0, 4) !== "ZLIB") throw new Error("Unsupported GNU compression.");
        length = compressed.offset(4, true);
    } else {
        if (view.u32(section.offset) !== 1) throw new Error("Unsupported ELF compression.");
        length = view.offset(section.offset + (wide ? 8 : 4), wide);
    }
    if (!Number.isSafeInteger(length) || length > 128 * 1024 * 1024) throw new Error("The uncompressed section is too large.");
    const output = unpack(bytes.subarray(header), {out: new Uint8Array(length)});
    if (output.length !== length) throw new Error("The uncompressed section length differs from its header.");
    return output;
}

function relocateddebug(view, contents, relocations, sections, wide, machine, notes) {
    if (!relocations?.length) return contents;
    const output = new binary(contents.slice(), view.little);
    let unsupported = false;
    for (const relocation of relocations) {
        const symbols = sections[relocation.link];
        const explicit = relocation.type === 4;
        const width = wide ? 8 : 4;
        const stride = relocation.stride || (explicit ? 3 : 2) * width;
        table(view, relocation.offset, Math.floor(relocation.size / stride), stride, (explicit ? 3 : 2) * width);
        if (!symbols?.stride) throw new Error("A DWARF relocation has no symbol table.");
        for (let at = relocation.offset; at <= relocation.offset + relocation.size - stride; at += stride) {
            const reference = view.address(at + width, wide);
            const type = Number(reference & (wide ? 0xffffffffn : 0xffn));
            const size = absoluterelocations[machine]?.[type];
            if (!size) {
                unsupported ||= Boolean(type);
                continue;
            }
            const offset = view.offset(at, wide);
            const index = Number(reference >> (wide ? 32n : 8n));
            const entry = index * symbols.stride;
            if (entry >= symbols.size) throw new Error("Invalid DWARF relocation symbol index.");
            const value = view.address(symbols.offset + entry + (wide ? 8 : 4), wide);
            output.range(offset, size);
            const addend = explicit ? BigInt.asIntN(width * 8, view.address(at + 2 * width, wide))
                : size === 2 ? BigInt(output.u16(offset)) : output.address(offset, size === 8);
            const address = BigInt.asUintN(size * 8, value + addend);
            if (size === 2) output.view.setUint16(offset, Number(address), view.little);
            if (size === 4) output.view.setUint32(offset, Number(address), view.little);
            if (size === 8) output.view.setBigUint64(offset, address, view.little);
        }
    }
    if (unsupported && !notes.includes("Some DWARF relocations are unsupported.")) notes.push("Some DWARF relocations are unsupported.");
    return output.bytes;
}

function elfnames(view, symbols, strings, wide, architecture, format) {
    const length = Math.floor(symbols.size / symbols.stride);
    table(view, symbols.offset, length, symbols.stride, wide ? 24 : 16);
    view.range(strings.offset, strings.size);
    const entries = [];
    for (let index = 0; index < length; index++) {
        const offset = symbols.offset + index * symbols.stride;
        const name = view.name(strings.offset + view.u32(offset), strings.offset + strings.size);
        if (!name) continue;
        const info = view.bytes[offset + (wide ? 4 : 12)];
        const section = view.u16(offset + (wide ? 6 : 14));
        const value = view.address(offset + (wide ? 8 : 4), wide);
        const size = view.offset(offset + (wide ? 16 : 8), wide);
        const binding = ["local", "global", "weak"][info >>> 4];
        const type = [section === 0 && "undefined", binding, elftypes[info & 15] || (info & 15 ? "type " + (info & 15) : "")].filter(Boolean).join(" ");
        entries.push({name, address: section ? hex(value) : "", type, size});
    }
    return report(format, architecture, entries);
}

function elfstabs(view, section, strings, architecture) {
    const stride = section.stride || 12;
    const length = Math.floor(section.size / stride);
    table(view, section.offset, length, stride, 12);
    view.range(strings.offset, strings.size);
    const entries = [];
    let base = 0;
    let nextbase = 0;
    for (let index = 0; index < length; index++) {
        const at = section.offset + index * stride;
        const type = view.bytes[at + 4];
        const value = view.u32(at + 8);
        if (!type) {
            base = nextbase;
            nextbase += value;
            continue;
        }
        const name = view.name(strings.offset + base + view.u32(at), strings.offset + strings.size);
        if (name) entries.push({name, address: value ? hex(value) : "", type: stabtypes[type] || hex(type)});
    }
    return report("STABS", architecture, entries);
}

function elf(bytes) {
    const wide = bytes[4] === 2;
    if (![1, 2].includes(bytes[4]) || ![1, 2].includes(bytes[5])) throw new Error("Unsupported ELF word size or byte order.");
    const view = new binary(bytes, bytes[5] === 1);
    view.range(0, wide ? 64 : 52);
    const machine = view.u16(18);
    const architecture = elfarch[machine] || "ELF " + machine;
    const offset = view.offset(wide ? 40 : 32, wide);
    const stride = view.u16(wide ? 58 : 46);
    let count = view.u16(wide ? 60 : 48);
    let nameindex = view.u16(wide ? 62 : 50);
    const entries = [];
    if (!offset) return elfdynamic(view, wide, architecture);
    table(view, offset, 1, stride, wide ? 64 : 40);
    if (!count) count = view.offset(offset + (wide ? 32 : 20), wide);
    if (nameindex === 0xffff) nameindex = view.u32(offset + (wide ? 40 : 24));
    table(view, offset, count, stride, wide ? 64 : 40);
    for (let index = 0; index < count; index++) {
        const at = offset + index * stride;
        entries.push({
            name: view.u32(at), type: view.u32(at + 4), flags: view.address(at + 8, wide),
            offset: view.offset(at + (wide ? 24 : 16), wide),
            size: view.offset(at + (wide ? 32 : 20), wide), link: view.u32(at + (wide ? 40 : 24)),
            target: view.u32(at + (wide ? 44 : 28)),
            stride: view.offset(at + (wide ? 56 : 36), wide)
        });
    }
    const nametable = entries[nameindex];
    const names = new Map();
    const results = [];
    for (const entry of entries) {
        const name = nametable ? view.name(nametable.offset + entry.name, nametable.offset + nametable.size) : "";
        if (name) names.set(name, entry);
        if (entry.type === 2 || entry.type === 11) {
            const strings = entries[entry.link];
            if (strings && entry.stride) {
                results.push(elfnames(view, entry, strings, wide, architecture, entry.type === 2 ? "ELF .symtab" : "ELF .dynsym"));
            }
        }
    }
    if (names.has(".stab") && names.has(".stabstr")) results.push(elfstabs(view, names.get(".stab"), names.get(".stabstr"), architecture));
    const sections = new Map();
    const relocations = new Map();
    const notes = [];
    if (view.u16(16) === 1) {
        for (const entry of entries) {
            if (![4, 9].includes(entry.type) || !entries[entry.target]) continue;
            const target = entries[entry.target];
            if (!relocations.has(target)) relocations.set(target, []);
            relocations.get(target).push(entry);
        }
    }
    for (const [name, section] of names) {
        if (!/^\.z?debug_/.test(name) || section.type === 8) continue;
        const legacy = name.startsWith(".zdebug_");
        try {
            const contents = legacy || section.flags & 0x800n
                ? elfdebug(view, section, wide, legacy)
                : view.range(section.offset, section.size);
            sections.set(name.slice(legacy ? 2 : 1), relocateddebug(view, contents, relocations.get(section), entries, wide, machine, notes));
        } catch (error) {
            notes.push(name + ": " + error.message);
        }
    }
    if (sections.size || notes.length) results.push(dwarfsymbols(sections, view.little, architecture, notes));
    return results.length ? results : elfdynamic(view, wide, architecture);
}

/*//////////////////////////////////////////////////////////////////////*/

function elfdynamic(view, wide, architecture) {
    const headeroffset = view.offset(wide ? 32 : 28, wide);
    const stride = view.u16(wide ? 54 : 42);
    const count = view.u16(wide ? 56 : 44);
    if (!count || !headeroffset) return [report("ELF", architecture)];
    table(view, headeroffset, count, stride, wide ? 56 : 32);
    const loads = [];
    let dynamic;
    for (let index = 0; index < count; index++) {
        const at = headeroffset + index * stride;
        const type = view.u32(at);
        const item = {
            offset: view.offset(at + (wide ? 8 : 4), wide),
            address: view.address(at + (wide ? 16 : 8), wide),
            size: view.offset(at + (wide ? 32 : 16), wide)
        };
        if (type === 1) loads.push(item);
        if (type === 2) dynamic = item;
    }
    if (!dynamic) return [report("ELF", architecture)];
    const values = new Map();
    const step = wide ? 16 : 8;
    view.range(dynamic.offset, dynamic.size);
    for (let at = dynamic.offset; at + step <= dynamic.offset + dynamic.size; at += step) {
        const tag = view.offset(at, wide);
        if (!tag) break;
        values.set(tag, view.address(at + step / 2, wide));
    }
    const fileoffset = tag => {
        const address = values.get(tag);
        if (address === undefined) return null;
        const segment = loads.find(item => address >= item.address && address - item.address < BigInt(item.size));
        return segment ? segment.offset + Number(address - segment.address) : null;
    };
    const symbols = fileoffset(6);
    const strings = fileoffset(5);
    const hash = fileoffset(4);
    const gnuhash = fileoffset(0x6ffffef5);
    const symbolstride = Number(values.get(11) || 0);
    const stringsize = Number(values.get(10) || 0);
    if (symbols === null || strings === null || !symbolstride || !stringsize) return [report("ELF", architecture)];
    const length = hash !== null ? view.u32(hash + 4) : gnuhash !== null ? gnucount(view, gnuhash, wide) : Math.floor((strings - symbols) / symbolstride);
    if (!(length > 0)) return [report("ELF", architecture)];
    return [elfnames(view, {offset: symbols, size: length * symbolstride, stride: symbolstride}, {offset: strings, size: stringsize}, wide, architecture, "ELF .dynsym")];
}

function gnucount(view, offset, wide) {
    const count = view.u32(offset);
    const first = view.u32(offset + 4);
    const bloom = view.u32(offset + 8);
    const buckets = offset + 16 + bloom * (wide ? 8 : 4);
    table(view, buckets, count, 4, 4);
    let index = 0;
    for (let bucket = 0; bucket < count; bucket++) index = Math.max(index, view.u32(buckets + bucket * 4));
    if (index < first) return first;
    const chains = buckets + 4 * count;
    while (index < maxentries) {
        if (view.u32(chains + (index++ - first) * 4) & 1) return index;
    }
    throw new Error("The GNU hash chain is too large.");
}

/*//////////////////////////////////////////////////////////////////////*/

function machonames(view, command, wide, architecture) {
    const offset = view.u32(command + 8);
    const count = view.u32(command + 12);
    const strings = view.u32(command + 16);
    const length = view.u32(command + 20);
    const stride = wide ? 16 : 12;
    table(view, offset, count, stride, stride);
    view.range(strings, length);
    const stabs = [];
    const symbols = [];
    for (let index = 0; index < count; index++) {
        const at = offset + index * stride;
        const nameindex = view.u32(at);
        const type = view.bytes[at + 4];
        const stab = type & 0xe0;
        const value = view.address(at + 8, wide);
        const description = view.u16(at + 6);
        const name = nameindex ? view.name(strings + nameindex, strings + length) : "";
        if (!name && !stab) continue;
        const kind = type & 0x0e;
        const label = stab ? stabtypes[type] || hex(type) : ({0: "undefined", 2: "absolute", 10: "indirect", 12: "undefined", 14: "section"}[kind] || hex(type));
        const entry = {name, address: kind || stab ? hex(value) : "", type: label + (!stab && type & 1 ? " external" : "")};
        if (stab && description) entry.description = description;
        (stab ? stabs : symbols).push(entry);
    }
    return [report("Mach-O nlist", architecture, symbols), ...(stabs.length ? [report("STABS", architecture, stabs)] : [])];
}

function machoexports(view, offset, length, architecture, imagebase) {
    const bytes = view.range(offset, length);
    const entries = [];
    const notes = [];
    const visited = new Set();
    const queue = [[0, ""]];
    let total = 0;
    try {
        while (queue.length && total++ < maxentries) {
            const [start, prefix] = queue.pop();
            const key = start + ":" + prefix;
            if (visited.has(key)) continue;
            visited.add(key);
            let at = start;
            const leb = () => {
                let value = 0n;
                for (let shift = 0n; shift <= 63n && at < bytes.length; shift += 7n) {
                    const byte = bytes[at++];
                    value |= BigInt(byte & 127) << shift;
                    if (!(byte & 128)) return value;
                }
                throw new Error("Invalid Mach-O export offset.");
            };
            const terminal = Number(leb());
            const end = at + terminal;
            if (end >= bytes.length) throw new Error("The Mach-O export trie is truncated.");
            if (terminal) {
                const flags = leb();
                const reexport = Boolean(flags & 8n);
                const base = (flags & 3n) === 2n ? 0n : imagebase;
                const address = reexport ? "" : hex(base + leb());
                if (at > end) throw new Error("Invalid Mach-O export record.");
                entries.push({name: prefix, address, type: reexport ? "re-export" : "export"});
            }
            at = end;
            const children = bytes[at++];
            for (let child = 0; child < children; child++) {
                const edge = at;
                while (at < bytes.length && bytes[at]) at++;
                if (at >= bytes.length || at - edge > 16384) throw new Error("Invalid Mach-O export name.");
                const name = prefix + view.name(offset + edge, offset + at);
                at++;
                const next = Number(leb());
                if (name.length > 16384 || next >= bytes.length) throw new Error("Invalid Mach-O export node.");
                if (queue.length >= maxentries) throw new Error("The Mach-O export trie is too large.");
                queue.push([next, name]);
            }
        }
    } catch (error) {
        notes.push(error.message);
    }
    return report("Mach-O exports", architecture, entries, notes);
}

function machoslice(bytes, magic) {
    const wide = magic === 0xfeedfacf || magic === 0xcffaedfe;
    const view = new binary(bytes, magic === 0xcefaedfe || magic === 0xcffaedfe);
    const header = wide ? 32 : 28;
    view.range(0, header);
    const cpu = view.u32(4);
    const subtype = view.u32(8) & 0xffffff;
    const architecture = (cpu === 12 && armarch[subtype]) || macharch[cpu] || "Mach-O " + cpu;
    const count = view.u32(16);
    const length = view.u32(20);
    view.range(header, length);
    if (count > length / 8) throw new Error("Invalid Mach-O load command count.");
    const results = [];
    const sections = new Map();
    let imagebase = 0n;
    let exports;
    let command = header;
    for (let index = 0; index < count; index++) {
        const type = view.u32(command);
        const size = view.u32(command + 4);
        if (size < 8 || command + size > header + length) throw new Error("Invalid Mach-O load command size.");
        if (type === 2 && size >= 24) results.push(...machonames(view, command, wide, architecture));
        if (type === 0x80000033 && size >= 16) exports = [view.u32(command + 8), view.u32(command + 12)];
        if (!exports && (type === 0x22 || type === 0x80000022) && size >= 48) exports = [view.u32(command + 40), view.u32(command + 44)];
        if (type === 1 || type === 0x19) {
            const widecommand = type === 0x19;
            const base = widecommand ? 72 : 56;
            const stride = widecommand ? 80 : 68;
            const segment = size >= base ? view.name(command + 8, command + 24) : "";
            if (segment === "__TEXT") imagebase = view.address(command + 24, widecommand);
            if (segment === "__DWARF") {
                const sectioncount = view.u32(command + (widecommand ? 64 : 48));
                if (sectioncount > (size - base) / stride) throw new Error("Invalid Mach-O debug section count.");
                for (let section = 0; section < sectioncount; section++) {
                    const at = command + base + section * stride;
                    const name = view.name(at, at + 16);
                    if (!name.startsWith("__debug_")) continue;
                    sections.set(name.slice(2), view.range(view.u32(at + (widecommand ? 48 : 40)), view.offset(at + (widecommand ? 40 : 36), widecommand)));
                }
            }
        }
        command += size;
    }
    if (exports?.[1]) results.push(machoexports(view, ...exports, architecture, imagebase));
    if (sections.size) results.push(dwarfsymbols(sections, view.little, architecture));
    return results.length ? results : [report("Mach-O", architecture)];
}

function machofat(bytes, magic) {
    const wide = magic === 0xcafebabf || magic === 0xbfbafeca;
    const view = new binary(bytes, magic === 0xbebafeca || magic === 0xbfbafeca);
    const count = view.u32(4);
    const stride = wide ? 32 : 20;
    if (count > 64) throw new Error("Too many Mach-O architecture slices.");
    table(view, 8, count, stride, stride);
    const results = [];
    for (let index = 0; index < count; index++) {
        const at = 8 + index * stride;
        const slice = view.range(view.offset(at + 8, wide), view.offset(at + (wide ? 16 : 12), wide));
        if (slice.length < 4) throw new Error("Incomplete Mach-O slice.");
        const marker = new binary(slice, false).u32(0);
        if (!machomagic.includes(marker)) throw new Error("Unrecognized Mach-O slice.");
        results.push(...machoslice(slice, marker));
    }
    return results;
}

/*//////////////////////////////////////////////////////////////////////*/

function dex(bytes) {
    const view = new binary(bytes, true);
    view.range(0, 112);
    if (view.u32(40) !== 0x12345678) throw new Error("Unsupported DEX byte order.");
    const strings = view.u32(56);
    const stringoffset = view.u32(60);
    const types = view.u32(64);
    const typeoffset = view.u32(68);
    const protocount = view.u32(72);
    const protooffset = view.u32(76);
    const fields = view.u32(80);
    const fieldoffset = view.u32(84);
    const methods = view.u32(88);
    const methodoffset = view.u32(92);
    table(view, stringoffset, strings, 4, 4);
    table(view, typeoffset, types, 4, 4);
    table(view, protooffset, protocount, 12, 12);
    table(view, fieldoffset, fields, 8, 8);
    table(view, methodoffset, methods, 8, 8);
    const names = new Map();
    const name = index => {
        if (index >= strings) throw new Error("Invalid DEX string index.");
        if (!names.has(index)) {
            let offset = view.u32(stringoffset + 4 * index);
            for (let count = 0; count < 5; count++) {
                view.range(offset, 1);
                if (!(bytes[offset++] & 128)) break;
            }
            names.set(index, view.name(offset));
        }
        return names.get(index);
    };
    const typename = index => {
        if (index >= types) throw new Error("Invalid DEX type index.");
        return name(view.u32(typeoffset + 4 * index));
    };
    const out = [];
    for (let index = 0; index < fields; index++) {
        const at = fieldoffset + index * 8;
        out.push({name: typename(view.u16(at)) + "->" + name(view.u32(at + 4)) + ":" + typename(view.u16(at + 2)), address: "", type: "field"});
    }
    for (let index = 0; index < methods; index++) {
        const at = methodoffset + index * 8;
        const protoindex = view.u16(at + 2);
        if (protoindex >= protocount) throw new Error("Invalid DEX method prototype.");
        const proto = protooffset + protoindex * 12;
        const parameters = view.u32(proto + 8);
        const count = parameters ? view.u32(parameters) : 0;
        if (count > 1024) throw new Error("DEX method has too many parameters.");
        if (parameters) view.range(parameters + 4, count * 2);
        const argumentslist = [];
        for (let parameter = 0; parameter < count; parameter++) argumentslist.push(typename(view.u16(parameters + 4 + parameter * 2)));
        const signature = "(" + argumentslist.join("") + ")" + typename(view.u32(proto + 4));
        out.push({name: typename(view.u16(at)) + "->" + name(view.u32(at + 4)) + signature, address: "", type: "method"});
    }
    return [report("DEX", "Dalvik", out)];
}

/*//////////////////////////////////////////////////////////////////////*/

function unity(bytes, filename) {
    const view = new binary(bytes, true);
    const architecture = /-64$/i.test(filename) ? "arm64" : "arm";
    const count = view.u32(0);
    table(view, 4, count, 12, 12);
    if (4 + count * 12 !== bytes.length) throw new Error("Unexpected length for the Unity address map.");
    const entries = [];
    for (let index = 0; index < count; index++) {
        const at = 4 + index * 12;
        entries.push({name: "", address: hex(view.u64(at)), type: "function range", size: view.u32(at + 8)});
    }
    return [report("Unity address map", architecture, entries, ["The Unity map stores addresses and lengths without symbol names."])];
}

function textsymbols(bytes) {
    const text = new TextDecoder().decode(bytes);
    if (!text.startsWith("MODULE ")) return [];
    const architecture = text.split(/\s+/, 4)[2] || "";
    const entries = [];
    for (const line of text.split(/\r?\n/)) {
        const fn = line.match(/^(?:FUNC|PUBLIC) (?:m )?([\da-f]+) (.+)$/i);
        if (!fn) continue;
        const record = fn[2].match(line.startsWith("FUNC") ? /^([\da-f]+) [\da-f]+ (.+)$/i : /^[\da-f]+ (.+)$/i);
        if (!record) continue;
        entries.push({name: record.at(-1), address: "0x" + fn[1], type: line.startsWith("FUNC") ? "function" : "public", ...(line.startsWith("FUNC") ? {size: Number.parseInt(record[1], 16)} : {})});
    }
    return [report("Breakpad", architecture, entries)];
}

const machomagic = [0xfeedface, 0xfeedfacf, 0xcefaedfe, 0xcffaedfe];
const fatmagic = [0xcafebabe, 0xcafebabf, 0xbebafeca, 0xbfbafeca];

export function inspectsymbols(input, filename = "") {
    const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
    if (bytes.length < 4) return [];
    const magic = new binary(bytes, false).u32(0);
    if (magic === 0x7f454c46) return elf(bytes);
    if (machomagic.includes(magic)) return machoslice(bytes, magic);
    if (fatmagic.includes(magic) && bytes.length >= 8 && !/\.class$/i.test(filename)) {
        const view = new binary(bytes, magic === 0xbebafeca || magic === 0xbfbafeca);
        const count = view.u32(4);
        if (/\.macho$/i.test(filename) || count > 0 && count <= 64) return machofat(bytes, magic);
    }
    if (magic === 0x6465780a) return dex(bytes);
    if (/(?:^|\/)SymbolMap(?:-32|-64)?$/i.test(filename)) return unity(bytes, filename);
    if (magic === 0x4d4f4455) return textsymbols(bytes);
    return [];
}
