const sources = new Map();

async function read(file) {
    const response = await fetch(file);
    if (!response.ok) throw new Error("Level unavailable");
    const limit = 2 * 1024 * 1024;
    if (Number(response.headers.get("Content-Length")) > limit) throw new Error("Level too large");
    const reader = response.body.getReader();
    const chunks = [];
    let length = 0;
    try {
        while (true) {
            const {done, value} = await reader.read();
            if (done) break;
            length += value.length;
            if (length > limit) throw new Error("Level too large");
            chunks.push(value);
        }
    } catch (error) {
        await reader.cancel();
        throw error;
    } finally {reader.releaseLock()}
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.length;
    }
    let text = new TextDecoder().decode(bytes).trim();
    if (text.startsWith("{") || text.startsWith("[")) {
        await import("/assets/static/conversion.js");
        text = window.ctrconversion.jsonleveltoxml(JSON.parse(text));
    }
    const parsed = new DOMParser().parseFromString(text, "application/xml");
    if (parsed.querySelector("parsererror") || parsed.documentElement.localName !== "map") throw new Error("Invalid level");
    return text;
}

/*//////////////////////////////////////////////////////////////////////*/

export function source(file) {
    if (!sources.has(file)) {
        sources.set(file, read(file).catch(error => {
            sources.delete(file);
            throw error;
        }));
        if (sources.size > 40) sources.delete(sources.keys().next().value);
    }
    return sources.get(file);
}
