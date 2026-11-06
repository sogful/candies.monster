import {decode, encode, join} from "./textures.js";

self.addEventListener("message", async event => {
    const {id, parts, reverse} = event.data;
    try {
        const bytes = join(parts.map(part => new Uint8Array(part)));
        const result = reverse ? await encode(bytes) : await decode(bytes);
        self.postMessage({id, bytes: result.buffer}, [result.buffer]);
    } catch (error) {
        self.postMessage({id, error: error.message || String(error)});
    }
});
