export function encodeurl(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    let base64 = btoa(bin);
    base64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    return base64;
}

/*//////////////////////////////////////////////////////////////////////*/

export function decodebase64utf8(str) {
    let cleaned = str.replace(/\s/g, "");
    let urlsafecleaned = cleaned.replace(/-/g, "+").replace(/_/g, "/");
    while (urlsafecleaned.length % 4 !== 0) {
        urlsafecleaned += "=";
    }

    function base64tobytes(b64) {
        const binarystring = atob(b64);
        const bytes = new Uint8Array(binarystring.length);
        for (let i = 0; i < binarystring.length; i++) {
            bytes[i] = binarystring.charCodeAt(i);
        }
        return bytes;
    }
    function trydecode(b64) {
        let bytes = base64tobytes(b64);
        if (bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b) {
            if (typeof fflate === "undefined") {
                throw new Error("gzip data detected but fflate.js isn't loaded..");
            }
            try {
                bytes = fflate.decompressSync(bytes);
            } catch (decomperror) {
                throw new Error(`gzip decompression failed?! ${decomperror.message || decomperror}`);
            }
        }
        const decoder = new TextDecoder("utf-8");
        let decoded = decoder.decode(bytes);
        decoded = decoded.trim();
        if (decoded.charCodeAt(0) === 0xFEFF) {decoded = decoded.slice(1)}
        return decoded;
    }

    try {
        return trydecode(urlsafecleaned);
    } catch (e) {
        try {
            let standardcleaned = cleaned;
            while (standardcleaned.length % 4 !== 0) {
                standardcleaned += "=";
            }
            return trydecode(standardcleaned);
        } catch (e2) {
            throw new Error("invalid base64 string :(");
        }
    }
}

/*//////////////////////////////////////////////////////////////////////*/

export function analyzexml(xml) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "text/xml");
        const objectslayer = doc.querySelector("layer[name='Objects']");
        const objectcount = objectslayer ? objectslayer.children.length : 0;
        return {charcount: xml.length, objectcount, gzippedbytes: null};
    } catch (error) {
        console.warn("analysis error:", error);
        return {charcount: xml.length, objectcount: 0, gzippedbytes: null};
    }
}

/*//////////////////////////////////////////////////////////////////////*/

export async function calculategzipped(xml) {
    try {
        const encoder = new TextEncoder();
        const inputbytes = encoder.encode(xml);

        if (typeof fflate !== "undefined" && typeof fflate.gzipSync === "function") {
            const compressed = fflate.gzipSync(inputbytes);
            return compressed.length;
        }

        if (typeof CompressionStream !== "function") {return null}
        const cs = new CompressionStream("gzip");
        const writer = cs.writable.getWriter();
        await writer.write(inputbytes);
        await writer.close();
        const chunks = [];
        const reader = cs.readable.getReader();
        while (true) {
            const {done, value} = await reader.read();
            if (done) break;
            if (value) chunks.push(value);
        }
        let totallength = 0;
        for (const chunk of chunks) {totallength += chunk.byteLength}
        return totallength;
    } catch (error) {return null}
}

/*//////////////////////////////////////////////////////////////////////*/

export function normalizetoxml(text) {
    let t = (text || "").trim();
    if (!t) return t;
    const fromjson = (str) => {
        const obj = JSON.parse(str);
        if (window.ctrconversion?.jsonleveltoxml) {
            return window.ctrconversion.jsonleveltoxml(obj);
        }
        return str;
    };
    if (t[0] === "<") return t;
    if (t[0] === "{" || t[0] === "[") {
        try {return fromjson(t)} catch (_) {return t}
    }
    try {
        const decoded = decodebase64utf8(t).trim();
        if (decoded[0] === "{" || decoded[0] === "[") {
            try {return fromjson(decoded)} catch (_) {return decoded}
        }
        return decoded;
    } catch (_) {return t}
}
