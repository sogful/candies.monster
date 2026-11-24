import "/assets/static/dependencies/fflate.js";
import {inspectsymbols} from "./symbols.js";
import {extractstrings} from "./strings.js";
import {debugsymbols} from "./reports.js";

self.addEventListener("message", async event => {
    const {kind, bytes, filename, minimum} = event.data;
    try {
        if (kind === "symbolmatches") {
            const reports = (await inspectsymbols(bytes, filename)).filter(report => report.entries.length);
            self.postMessage({result: {symbols: !!reports.length, debug: reports.some(debugsymbols)}});
        } else {
            const result = kind === "symbols" ? await inspectsymbols(bytes, filename) : extractstrings(bytes, filename, minimum);
            self.postMessage({result});
        }
    } catch (error) {
        self.postMessage({error: error?.message || String(error)});
    }
});
