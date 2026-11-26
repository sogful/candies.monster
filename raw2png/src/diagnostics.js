const endpoint = "https://bugreport.candies.monster/raw2png";
const reported = new Set();
const stages = ["selection", "zip setup", "reading files", "decoding raw", "encoding png", "saving output"];
const reasons = [
    ["missing input", /^(?:no textures|no texture files|no \.raw|the first (?:\.raw|texture) part is missing)/i],
    ["texture too large", /^texture exceeds|oversized texture dimensions/i],
    ["incomplete header", /^incomplete (?:compressed )?texture header/i],
    ["unknown texture format", /^unrecognized texture format/i],
    ["unsupported pixel format", /^unsupported (?:optimized png )?pixel format/i],
    ["invalid texture dimensions", /texture dimensions/i],
    ["incomplete texture data", /^(?:missing texture parts|incomplete texture|incomplete decompressed texture)/i],
    ["invalid pixel data length", /^(?:decompressed data exceeds|unexpected bytes after)/i],
    ["zstd decompression failed", /\bzstd\b|\bzstandard\b/i],
    ["invalid png data", /^(?:incomplete png chunk|invalid png row filter)/i],
    ["worker timed out", /^conversion (?:timed out|exceeded the 60-second time limit)/i],
    ["worker failed", /^texture worker failed|\b(?:OffscreenCanvas|CompressionStream|DecompressionStream|createImageBitmap) is not (?:defined|a function)\b/i],
    ["zip support unavailable", /^could not load zip support/i],
    ["browser could not read input", /^(?:the requested file could not be read|could not read the file)/i]
];
const summaries = new Set([...reasons.map(([label]) => label), "unexpected error"]);
const reportable = new Set(["worker timed out", "worker failed", "zip support unavailable"]);

export function rawdiagnostic(message) {
    const [title, stageline, reasonline, ...extra] = message.split("\n");
    const stage = stageline?.replace(/^stage: /, "");
    const reason = reasonline?.replace(/^reason: /, "");
    if (title !== "raw2png error" || extra.length || stageline !== "stage: " + stage ||
        reasonline !== "reason: " + reason || !stages.includes(stage) || !summaries.has(reason)) return "";
    return message;
}

/*//////////////////////////////////////////////////////////////////////*/

export function reporterror(stage, message) {
    if (location.origin !== "https://candies.monster") return;
    const reason = reasons.find(([, pattern]) => pattern.test(message))?.[0];
    if (!reportable.has(reason)) return;
    const detail = rawdiagnostic(`raw2png error\nstage: ${stage}\nreason: ${reason}`);
    if (!detail || reported.has(detail) || reported.size >= 4) return;
    reported.add(detail);
    void fetch(endpoint, {
        method: "POST", body: detail, keepalive: true,
        credentials: "omit", referrerPolicy: "no-referrer"
    }).catch(() => {});
}
