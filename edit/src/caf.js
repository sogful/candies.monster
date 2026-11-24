const byteslimit = 128 * 1024 * 1024;
const packetframes = 64;
const channelbytes = 34;
const steps = [
    7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45,
    50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130, 143, 157, 173, 190, 209, 230, 253,
    279, 307, 337, 371, 408, 449, 494, 544, 598, 658, 724, 796, 876, 963, 1060, 1166,
    1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428,
    4871, 5358, 5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899, 15289,
    16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767
];
const adjustments = [-1, -1, -1, -1, 2, 4, 6, 8];

function tag(view, at) {
    return String.fromCharCode(view.getUint8(at), view.getUint8(at + 1), view.getUint8(at + 2), view.getUint8(at + 3));
}

function writetag(view, at, value) {
    for (let index = 0; index < 4; index++) view.setUint8(at + index, value.charCodeAt(index));
}

function cafview(bytes) {
    return bytes instanceof Uint8Array ? new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength) : new DataView(bytes);
}

function source(bytes) {
    const view = cafview(bytes);
    if (view.byteLength < 8 || tag(view, 0) !== "caff" || view.getUint16(4) !== 1) {
        throw new Error("Expected a version 1 CAF audio file.");
    }
    let description;
    let data;
    let table;
    for (let offset = 8; offset < view.byteLength;) {
        if (offset + 12 > view.byteLength) throw new Error("The CAF chunk header is truncated.");
        const kind = tag(view, offset);
        const bytecount = view.getBigInt64(offset + 4);
        const start = offset + 12;
        const length = bytecount === -1n && kind === "data" ? view.byteLength - start : Number(bytecount);
        if (length < 0 || length > view.byteLength - start) throw new Error("The CAF chunk is truncated.");
        if (kind === "desc" && length === 32 && !description) description = start;
        if (kind === "pakt" && length >= 24 && !table) table = start;
        if (kind === "data" && length >= 4 && !data) data = {start: start + 4, length: length - 4};
        offset = start + length;
    }
    if (!description || !data) throw new Error("The CAF audio description or data is missing.");
    const rate = view.getFloat64(description);
    const format = tag(view, description + 8);
    const flags = view.getUint32(description + 12);
    const bytesperpacket = view.getUint32(description + 16);
    const framesperpacket = view.getUint32(description + 20);
    const channels = view.getUint32(description + 24);
    const bits = view.getUint32(description + 28);
    const ima = format === "ima4" && !flags && bytesperpacket === channels * channelbytes && framesperpacket === packetframes;
    const pcm = format === "lpcm" && bits === 16 && flags <= 2 && flags !== 1 && bytesperpacket === channels * 2 && framesperpacket === 1;
    if ((!ima && !pcm) || !Number.isInteger(rate) || rate < 1 || rate > 192000 || channels < 1 || channels > 8) {
        throw new Error("This CAF file does not use supported IMA4 or 16-bit PCM audio.");
    }
    if (data.length % bytesperpacket) throw new Error("The CAF audio ends in an incomplete packet.");
    const capacity = data.length / bytesperpacket * framesperpacket;
    const frames = table ? Number(view.getBigInt64(table + 8)) : capacity;
    const priming = table ? view.getInt32(table + 16) : 0;
    if (frames < 0 || priming < 0 || frames + priming > capacity || frames * channels * 2 >= byteslimit) {
        throw new Error("The CAF frame count is invalid or too large to preview.");
    }
    return {view, data, format, flags, rate, channels, frames, priming, capacity, bytesperpacket, framesperpacket, bits};
}

/*//////////////////////////////////////////////////////////////////////*/

function bounded(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

function expand(state, code) {
    const step = steps[state.index];
    const delta = (step >> 3) + (code & 4 ? step : 0)
        + (code & 2 ? step >> 1 : 0) + (code & 1 ? step >> 2 : 0);
    state.sample = bounded(state.sample + (code & 8 ? -delta : delta), -32768, 32767);
    state.index = bounded(state.index + adjustments[code & 7], 0, steps.length - 1);
    return state.sample;
}

function decodeima(info, output) {
    const states = Array.from({length: info.channels}, () => ({sample: 0, index: 0}));
    for (let packet = 0; packet < info.capacity; packet += packetframes) {
        for (const [channel, state] of states.entries()) {
            const start = info.data.start + (packet / packetframes * info.channels + channel) * channelbytes;
            const header = info.view.getInt16(start);
            const predictor = header & ~127;
            const index = header & 127;
            if (index >= steps.length) throw new Error("The CAF IMA4 packet has an invalid step index.");
            if (state.index !== index || Math.abs(state.sample - predictor) > 127) {
                state.index = index;
                state.sample = predictor;
            }
            for (let frame = 0; frame < packetframes; frame++) {
                const value = info.view.getUint8(start + 2 + (frame >> 1));
                const sample = expand(state, frame % 2 ? value >> 4 : value & 15);
                const position = packet + frame - info.priming;
                if (position >= 0 && position < info.frames) {
                    output.setInt16(44 + (position * info.channels + channel) * 2, sample, true);
                }
            }
        }
    }
}

export function decodecaf(bytes) {
    const info = source(bytes);
    const {frames, rate, channels, priming} = info;
    const payloadlength = frames * channels * 2;
    const wav = new Uint8Array(44 + payloadlength);
    const output = cafview(wav);
    writetag(output, 0, "RIFF");
    output.setUint32(4, wav.length - 8, true);
    writetag(output, 8, "WAVE");
    writetag(output, 12, "fmt ");
    output.setUint32(16, 16, true);
    output.setUint16(20, 1, true);
    output.setUint16(22, channels, true);
    output.setUint32(24, rate, true);
    output.setUint32(28, rate * channels * 2, true);
    output.setUint16(32, channels * 2, true);
    output.setUint16(34, 16, true);
    writetag(output, 36, "data");
    output.setUint32(40, payloadlength, true);
    if (info.format === "ima4") decodeima(info, output);
    else {
        const start = info.data.start + priming * channels * 2;
        if (info.flags & 2) wav.set(new Uint8Array(info.view.buffer, info.view.byteOffset + start, payloadlength), 44);
        else {
            for (let offset = 0; offset < payloadlength; offset += 2) {
                output.setInt16(44 + offset, info.view.getInt16(start + offset), true);
            }
        }
    }
    return wav;
}

/*//////////////////////////////////////////////////////////////////////*/

function compress(state, sample) {
    const difference = sample - state.sample;
    const step = steps[state.index];
    let remaining = Math.abs(difference);
    let code = difference < 0 ? 8 : 0;
    for (let bit = 0; bit < 3; bit++) {
        const increment = step >> bit;
        if (remaining >= increment) {
            code |= 4 >> bit;
            remaining -= increment;
        }
    }
    expand(state, code);
    return code;
}

function writeima(view, start, info, frames, sample) {
    const states = Array.from({length: info.channels}, (_, channel) => ({sample: sample(channel, 0) & ~127, index: 0}));
    for (let packet = 0; packet < frames; packet += packetframes) {
        for (const [channel, state] of states.entries()) {
            const offset = start + (packet / packetframes * info.channels + channel) * channelbytes;
            view.setInt16(offset, (state.sample & ~127) | state.index);
            for (let frame = 0; frame < packetframes; frame += 2) {
                const position = packet + frame;
                const first = compress(state, sample(channel, Math.min(position, frames - 1)));
                const next = compress(state, sample(channel, Math.min(position + 1, frames - 1)));
                view.setUint8(offset + 2 + (frame >> 1), first | (next << 4));
            }
        }
    }
}

function chunk(view, offset, kind, length) {
    writetag(view, offset, kind);
    view.setBigInt64(offset + 4, BigInt(length));
    return offset + 12;
}

function makecaf(info, frames, sample) {
    const packets = Math.ceil(frames / info.framesperpacket);
    const datalength = packets * info.bytesperpacket;
    if (datalength >= byteslimit || !frames) throw new Error("The imported audio has an unsupported length.");
    const ima = info.format === "ima4";
    const output = new Uint8Array(68 + datalength + (ima ? 36 : 0));
    const view = cafview(output);
    writetag(view, 0, "caff");
    view.setUint16(4, 1);
    const desc = chunk(view, 8, "desc", 32);
    view.setFloat64(desc, info.rate);
    writetag(view, desc + 8, info.format);
    view.setUint32(desc + 12, info.flags);
    view.setUint32(desc + 16, info.bytesperpacket);
    view.setUint32(desc + 20, info.framesperpacket);
    view.setUint32(desc + 24, info.channels);
    view.setUint32(desc + 28, info.bits);
    if (ima) {
        const table = chunk(view, 52, "pakt", 24);
        view.setBigInt64(table + 8, BigInt(frames));
        view.setUint32(table + 20, packets * packetframes - frames);
    }
    const start = chunk(view, ima ? 88 : 52, "data", datalength + 4) + 4;
    if (ima) writeima(view, start, info, frames, sample);
    else {
        for (let frame = 0; frame < frames; frame++) {
            for (let channel = 0; channel < info.channels; channel++) {
                view.setInt16(start + (frame * info.channels + channel) * 2, sample(channel, frame), Boolean(info.flags & 2));
            }
        }
    }
    return output;
}

export async function replacecaf(file, original) {
    const info = source(original);
    if (file.size < 4 || file.size >= byteslimit) throw new Error("The imported audio is empty or exceeds 128 MB.");
    let input = await file.arrayBuffer();
    if (tag(new DataView(input), 0) === "caff") {
        const imported = source(input);
        if (imported.format === info.format && imported.flags === info.flags && imported.rate === info.rate && imported.channels === info.channels) {
            return new Uint8Array(input);
        }
        input = decodecaf(input).buffer;
    }
    const offline = globalThis.OfflineAudioContext ?? globalThis.webkitOfflineAudioContext;
    if (!offline) throw new Error("This browser does not support audio conversion.");
    let audio;
    try {
        audio = await new offline(info.channels, 1, info.rate).decodeAudioData(input);
    } catch {
        throw new Error("The browser could not decode the imported audio.");
    }
    if (audio.length * Math.max(info.channels, audio.numberOfChannels) * 2 >= byteslimit) {
        throw new Error("The imported audio is too long.");
    }
    if (audio.numberOfChannels !== info.channels) {
        const context = new offline(info.channels, audio.length, info.rate);
        const input = context.createBufferSource();
        input.buffer = audio;
        input.connect(context.destination);
        input.start();
        audio = await context.startRendering();
    }
    const channels = Array.from({length: info.channels}, (_, index) => audio.getChannelData(index));
    return makecaf(info, audio.length, (channel, frame) => bounded(Math.round(channels[channel][frame] * 32768), -32768, 32767));
}
