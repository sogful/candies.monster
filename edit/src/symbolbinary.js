const textdecoder = new TextDecoder();

export const maxentries = 1000000;

export class binary {
    constructor(bytes, little) {
        this.bytes = bytes;
        this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        this.little = little;
    }

    range(offset, size) {
        if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) ||
            offset < 0 || size < 0 || offset > this.bytes.length - size) {
            throw new Error("A symbol table points outside its file.");
        }
        return this.bytes.subarray(offset, offset + size);
    }

    u16(offset) { return this.view.getUint16(offset, this.little); }
    u32(offset) { return this.view.getUint32(offset, this.little); }
    u64(offset) { return this.view.getBigUint64(offset, this.little); }

    address(offset, wide) {
        return wide ? this.u64(offset) : BigInt(this.u32(offset));
    }

    offset(offset, wide) {
        return Number(this.address(offset, wide));
    }

    name(offset, end = this.bytes.length) {
        if (offset < 0 || offset >= end || end > this.bytes.length) return "";
        let stop = offset;
        const limit = Math.min(end, offset + 16384);
        while (stop < limit && this.bytes[stop]) stop++;
        return textdecoder.decode(this.bytes.subarray(offset, stop));
    }
}

export function hex(value) {
    return "0x" + value.toString(16);
}

export function report(format, architecture, entries = [], notes = []) {
    return {format, architecture, entries, notes};
}

export function table(view, offset, count, stride, minimum) {
    if (stride < minimum || count > maxentries) throw new Error("The symbol table size is invalid.");
    return view.range(offset, count * stride);
}
