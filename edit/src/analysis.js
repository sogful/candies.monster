import "/assets/static/dependencies/fflate.js";
import {inspectsymbols} from "./symbols.js";
import {extractstrings} from "./strings.js";

self.addEventListener("message", async event => {
    const {kind, bytes, filename, minimum} = event.data;
    try {
        const result = kind === "symbols" ? await inspectsymbols(bytes, filename) : extractstrings(bytes, filename, minimum);
        self.postMessage({result});
    } catch (error) {
        self.postMessage({error: error?.message || String(error)});
    }
});
