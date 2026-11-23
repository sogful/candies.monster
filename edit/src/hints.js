const headerbytes = 12;
const eventheaderbytes = 8;
const touchbytes = 16;
const uintmax = 0xffffffff;
const phases = ["down", "move", "up"];

function malformed() {
    return new Error("This hints file does not use the supported Cut the Rope replay format.");
}

export function decodehints(bytes) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let offset = 0;

    function integer() {
        if (offset + 4 > bytes.length) throw malformed();
        const value = view.getUint32(offset, true);
        offset += 4;
        return value;
    }

    function decimal() {
        if (offset + 4 > bytes.length) throw malformed();
        const value = view.getFloat32(offset, true);
        if (!Number.isFinite(value)) throw malformed();
        offset += 4;
        return value;
    }

    const count = integer();
    if (count > (bytes.length - 4) / headerbytes) throw malformed();
    const levels = [];
    for (let index = 0; index < count; index++) {
        const box = integer() + 1;
        const level = integer() + 1;
        const replaycount = integer();
        if (replaycount > (bytes.length - offset) / 4) throw malformed();
        const replays = [];
        for (let record = 0; record < replaycount; record++) {
            const eventcount = integer();
            const events = [];
            while (events.length < eventcount && offset < bytes.length) {
                const time = decimal();
                const touchcount = integer();
                if (time < 0 || !touchcount || touchcount > (bytes.length - offset) / touchbytes) throw malformed();
                const touches = [];
                for (let position = 0; position < touchcount; position++) {
                    const pointer = integer();
                    const phase = phases[integer()];
                    if (!phase) throw malformed();
                    const x = decimal();
                    const y = decimal();
                    touches.push({pointer, phase, x, y});
                }
                events.push(touchcount === 1 ? {time, ...touches[0]} : {time, touches});
            }
            const incomplete = events.length < eventcount;
            if (incomplete && (index !== count - 1 || record !== replaycount - 1 || !events.length)) {
                throw malformed();
            }
            replays.push(incomplete ? {expected: eventcount, events} : {events});
        }
        levels.push({box, level, replays});
    }
    if (offset !== bytes.length) throw malformed();
    return formatlevels(levels);
}

function formatlevels(levels) {
    const decimal = value => Object.is(value, -0) ? "-0" : value;
    const touch = ({pointer, phase, x, y}) => `"pointer":${pointer}, "phase":"${phase}", "x":${decimal(x)}, "y":${decimal(y)}`;
    const rows = levels.map(({box, level, replays}) => {
        const records = replays.map(({events, expected}) => {
            const header = expected === undefined ? "" : `"expected":${expected}, `;
            const eventrows = events.map(event => {
                const details = event.touches ? `"touches":[${event.touches.map(point => `{${touch(point)}}`).join(", ")}]` : touch(event);
                return `        {"time":${decimal(event.time)}, ${details}}`;
            });
            return `      {${header}"events": [\n${eventrows.join(",\n")}\n      ]}`;
        });
        return `  {"box":${box}, "level":${level}, "replays": [\n${records.join(",\n")}\n  ]}`;
    });
    return `[\n${rows.join(",\n")}\n]\n`;
}

/*//////////////////////////////////////////////////////////////////////*/

function uint(value) {
    return Number.isInteger(value) && value >= 0 && value <= uintmax;
}

function float(value) {
    return typeof value === "number" && Number.isFinite(Math.fround(value));
}

function eventtouches(event) {
    return event.touches ?? [event];
}

export function encodehints(text) {
    let levels;
    try {
        levels = JSON.parse(text);
    } catch {
        throw new Error("Enter valid JSON for the hints.");
    }
    return encodehintlevels(levels);
}

export function encodehintlevels(levels) {
    if (!Array.isArray(levels)) throw new Error("Enter a list of levels for the hints.");

    let size = 4;
    for (const [index, item] of levels.entries()) {
        if (!item || !uint(item.box - 1) || !uint(item.level - 1) || typeof item.box !== "number"
            || typeof item.level !== "number" || !Array.isArray(item.replays)) {
            throw new Error(`Enter a box, level, and replay list for hint ${index + 1}.`);
        }
        size += headerbytes;
        for (const [record, replay] of item.replays.entries()) {
            if (!Array.isArray(replay?.events)) throw new Error(`Enter an event list for box ${item.box}, level ${item.level}.`);
            const {events, expected} = replay;
            if (expected !== undefined && (!uint(expected) || expected < events.length ||
                expected > events.length && (index !== levels.length - 1 || record !== item.replays.length - 1 || !events.length))) {
                throw new Error("The incomplete replay must be last. Its expected event count must include all recorded events.");
            }
            size += 4;
            for (const event of events) {
                const touches = event && eventtouches(event);
                if (!event || !float(event.time) || event.time < 0 || !Array.isArray(touches) || !touches.length ||
                    touches.some(point => !point || !uint(point.pointer) || !phases.includes(point.phase) || !float(point.x) || !float(point.y))) {
                    throw new Error(`Check the event time, pointer, phase, and coordinates for box ${item.box}, level ${item.level}.`);
                }
                size += eventheaderbytes + touches.length * touchbytes;
            }
        }
    }

    const bytes = new Uint8Array(size);
    const view = new DataView(bytes.buffer);
    let offset = 0;

    function integer(value) {
        view.setUint32(offset, value, true);
        offset += 4;
    }

    function decimal(value) {
        view.setFloat32(offset, value, true);
        offset += 4;
    }

    integer(levels.length);
    for (const {box, level, replays} of levels) {
        integer(box - 1);
        integer(level - 1);
        integer(replays.length);
        for (const {events, expected} of replays) {
            integer(expected ?? events.length);
            for (const event of events) {
                decimal(event.time);
                const touches = eventtouches(event);
                integer(touches.length);
                for (const {pointer, phase, x, y} of touches) {
                    integer(pointer);
                    integer(phases.indexOf(phase));
                    decimal(x);
                    decimal(y);
                }
            }
        }
    }
    return bytes;
}
