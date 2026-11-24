const maxsize = 128 * 1024 * 1024;
const videotypes = new Map([["avc1", "H.264"], ["avc3", "H.264"], ["mp4v", "MPEG-4 Part 2"]]);
const audiotypes = new Map([["mp4a", "AAC"]]);

function tag(view, offset) {
    return String.fromCharCode(view.getUint8(offset), view.getUint8(offset + 1), view.getUint8(offset + 2), view.getUint8(offset + 3));
}

function boxes(view, start, end) {
    const result = [];
    while (start < end) {
        if (end - start < 8) throw new Error("The MP4 box header is incomplete.");
        const type = tag(view, start + 4);
        let width = 8;
        let size = view.getUint32(start);
        if (size === 1) {
            if (end - start < 16) throw new Error("The MP4 box header is incomplete.");
            width = 16;
            size = Number(view.getBigUint64(start + 8));
        } else if (!size) size = end - start;
        if (!Number.isSafeInteger(size) || size < width || size > end - start) throw new Error("The MP4 box size is invalid.");
        result.push({type, start: start + width, end: start + size});
        start += size;
    }
    return result;
}

function children(view, parent, type) {
    return parent && boxes(view, parent.start, parent.end).find(box => box.type === type);
}

export function mp4tracks(bytes) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const root = boxes(view, 0, view.byteLength);
    const movie = root.find(box => box.type === "moov");
    if (!movie || !root.some(box => box.type === "ftyp") || !root.some(box => box.type === "mdat" && box.end > box.start)) {
        throw new Error("Choose an MP4 with a movie header and media data.");
    }
    const video = new Set();
    const audio = new Set();
    for (const track of boxes(view, movie.start, movie.end).filter(box => box.type === "trak")) {
        const media = children(view, track, "mdia");
        const handler = children(view, media, "hdlr");
        if (!handler || handler.end - handler.start < 12) continue;
        const kind = tag(view, handler.start + 8);
        if (kind !== "vide" && kind !== "soun") continue;
        const table = children(view, children(view, media, "minf"), "stbl");
        const descriptions = children(view, table, "stsd");
        if (!descriptions || descriptions.end - descriptions.start < 8) throw new Error("The MP4 track has no sample descriptions.");
        const samples = boxes(view, descriptions.start + 8, descriptions.end);
        if (samples.length !== view.getUint32(descriptions.start + 4)) throw new Error("The MP4 sample descriptions are incomplete.");
        for (const sample of samples) {
            if (kind === "vide") {
                if (sample.type !== "jpeg" && sample.type !== "png ") video.add(videotypes.get(sample.type) ?? sample.type);
            } else audio.add(audiotypes.get(sample.type) ?? sample.type);
        }
    }
    if (!video.size) throw new Error("The MP4 has no video track.");
    return {video, audio};
}

export async function replacemp4(file, original) {
    if (file.size < 8 || file.size > maxsize) throw new Error("Choose an MP4 smaller than 128 MB.");
    const expected = mp4tracks(original);
    const bytes = new Uint8Array(await file.arrayBuffer());
    const imported = mp4tracks(bytes);
    if ([...imported.video].some(codec => !expected.video.has(codec)) || [...imported.audio].some(codec => !expected.audio.has(codec))) {
        const video = [...expected.video].join(" or ") + " video";
        const audio = expected.audio.size ? " and " + [...expected.audio].join(" or ") + " audio if present" : "";
        throw new Error("Choose an MP4 with " + video + audio + ".");
    }
    return bytes;
}
