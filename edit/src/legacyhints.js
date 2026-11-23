import {loadobjects, writetable, recordtext, storestring, getint, intwidth, putint} from "./plist.js";

const phases = ["down", "move", "up"];
const maxpoints = 4096;
const classname = "TouchRecord";
const arrayclass = "NSMutableArray";

export function legacyhintname(path) {
    const parts = /(?:^|\/)hint_p(\d+)_l(\d+)_([\d]+(?:\.\d+)?)\.dat$/i.exec(path);
    if (!parts) return null;
    return {box: Number(parts[1]) + 1, level: Number(parts[2]) + 1, scale: Number(parts[3])};
}

function malformed() {
    return new Error("This file does not use the supported Cut the Rope touch archive.");
}

function dictionary(records, record) {
    if (record?.kind !== 13) throw malformed();
    const result = new Map();
    for (let index = 0; index < record.length; index++) {
        const key = recordtext(records[record.links[index]]);
        if (!key || result.has(key)) throw malformed();
        result.set(key, records[record.links[record.length + index]]);
    }
    return result;
}

function numeric(record) {
    if (!record?.raw || ![1, 2].includes(record.kind)) throw malformed();
    const width = 2 ** (record.raw[0] & 15);
    if (record.kind === 1) return getint(record.raw, 1, width);
    const view = new DataView(record.raw.buffer, record.raw.byteOffset, record.raw.byteLength);
    if (width === 4) return view.getFloat32(1);
    if (width === 8) return view.getFloat64(1);
    throw malformed();
}

function validpoint({time, pointer, phase, x, y, address}) {
    return Number.isFinite(time) && time >= 0 && Number.isSafeInteger(pointer) && pointer >= 0 && pointer <= 0xffffffff
        && phases.includes(phase) && Number.isFinite(x) && Number.isFinite(y)
        && (address === undefined || Number.isSafeInteger(address) && address >= 0 && address <= 0xffffffff);
}

export function decodelegacyhint(bytes) {
    if (bytes.length > 8 * 1024 * 1024) throw malformed();
    const {records, root} = loadobjects(bytes);
    const archive = dictionary(records, records[root]);
    if (recordtext(archive.get("$archiver")) !== "NSKeyedArchiver") throw malformed();
    const objects = archive.get("$objects");
    if (objects?.kind !== 10) throw malformed();

    function dereference(uid) {
        if (uid?.kind !== 8) throw malformed();
        const offset = getint(uid.raw, 1, 1 + (uid.raw[0] & 15));
        const target = records[objects.links[offset]];
        if (!target) throw malformed();
        return target;
    }

    function type(record) {
        const cls = dictionary(records, dereference(record.get("$class")));
        return recordtext(cls.get("$classname"));
    }

    const top = dictionary(records, archive.get("$top"));
    const container = dictionary(records, dereference(top.get("root")));
    const touches = container.get("NS.objects");
    if (type(container) !== arrayclass || touches?.kind !== 10 || touches.links.length > maxpoints) throw malformed();
    const events = touches.links.map(id => {
        const record = dictionary(records, dereference(records[id]));
        if (type(record) !== classname || record.size !== 7) throw malformed();
        const read = key => numeric(dereference(record.get(key)));
        const point = {
            time: read("time"), pointer: read("index"), phase: phases[read("type")],
            x: read("x"), y: read("y"), address: read("uitouchAdress")
        };
        if (!validpoint(point)) throw malformed();
        return point;
    });
    return {events};
}

/*//////////////////////////////////////////////////////////////////////*/

function plistbuilder() {
    const table = [];
    const strings = new Map();
    const reference = value => ({kind: "uid", value});
    const decimal = value => ({kind: "real", value});

    function insert(value) {
        let record;
        if (typeof value === "string") {
            if (strings.has(value)) return strings.get(value);
            const raw = storestring(value);
            strings.set(value, table.length);
            record = {kind: raw[0] >> 4, raw};
        } else if (typeof value === "number" || value.kind === "uid") {
            const uid = typeof value !== "number";
            const number = uid ? value.value : value;
            const width = intwidth(number);
            const kind = uid ? 8 : 1;
            const raw = new Uint8Array(width + 1);
            raw[0] = uid ? 0x80 | (width - 1) : 0x10 | Math.log2(width);
            putint(raw, 1, width, number);
            record = {kind, raw};
        } else if (value.kind === "real") {
            const raw = new Uint8Array(9);
            raw[0] = 0x23;
            new DataView(raw.buffer).setFloat64(1, value.value);
            record = {kind: 2, raw};
        } else if (Array.isArray(value)) {
            record = {kind: 10, length: value.length, links: value.map(insert)};
        } else {
            const keys = Object.keys(value);
            record = {kind: 13, length: keys.length, links: [...keys.map(insert), ...keys.map(key => insert(value[key]))]};
        }
        return table.push(record) - 1;
    }

    function finish(archive) {
        const root = insert(archive);
        return writetable(table, root);
    }

    return {reference, decimal, finish};
}

export function encodelegacyhint({events}) {
    if (!Array.isArray(events) || events.length > maxpoints || events.some(point => !point || !validpoint(point))) {
        throw new Error("Check the touch coordinates, time, and phase.");
    }
    const {reference, decimal, finish} = plistbuilder();
    const items = [];
    const collection = {"$class": reference(2), "NS.objects": items};
    const objects = [
        "$null", collection,
        {"$classes": [arrayclass, "NSArray", "NSObject"], "$classname": arrayclass},
        {"$classes": [classname, "NSObject"], "$classname": classname}
    ];
    const add = value => reference(objects.push(value) - 1);
    const addresses = new Map();
    for (const {time, pointer, phase, x, y, address} of events) {
        const fallback = addresses.get(pointer) ?? Math.min(pointer + 1, 0xffffffff);
        const actual = address ?? fallback;
        if (phase === "up") addresses.delete(pointer);
        else addresses.set(pointer, actual);
        items.push(add({
            "$class": reference(3), index: add(pointer), type: add(phases.indexOf(phase)),
            time: add(decimal(time)), uitouchAdress: add(actual), x: add(decimal(x)), y: add(decimal(y))
        }));
    }
    return finish({"$archiver": "NSKeyedArchiver", "$version": 100000, "$objects": objects, "$top": {root: reference(1)}});
}
