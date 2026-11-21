const endpoint = "https://bugreport.candies.monster/report";
const reported = new Set();
const reasons = [
    ["module load failed", /failed to fetch dynamically imported module|importing a module script failed|error loading dynamically imported module|failed to load module script/i],
    ["network fetch failed", /^(?:failed to fetch|load failed|network request failed|networkerror when attempting to fetch resource)\b/i],
    ["asset preload failed", /^could not (?:preload (?:audio )?content|load customization content)/i],
    ["asset catalog unavailable", /^could not load the asset catalog\b/i],
    ["metadata bundle unavailable", /^could not load the tier-0 bundle\b/i],
    ["asset missing from cache", /^content '[^']+' is absent\b/i],
    ["webgl context creation failed", /^could not create the game thread's webgl context\b/i],
    ["audio decode failed", /^could not decode audio\b/i],
    ["out of memory", /\bout of memory\b/i],
    ["read from undefined", /cannot read propert(?:y|ies) of undefined|^undefined is not an object\b/i],
    ["read from null", /cannot read propert(?:y|ies) of null|^null is not an object\b/i],
    ["value is not callable", /\bis not a function\b/i],
    ["operation aborted", /^(?:the operation was aborted|the user aborted a request)\b/i]
];
const knownreasons = new Set([...reasons.map(([label]) => label), "webgl unavailable", "webgl context lost", "asset request failed", "asset response invalid"]);
const fields = {
    phase: ["loading", "gameplay"],
    stage: ["runtime", "metadata", "images", "sounds"],
    quality: ["High", "Medium", "Low"]
};
const framepath = /(?:^|[\s(@])(?:https:\/\/candies\.monster)?(\/preview\/dx\/dist\/wwwroot\/(?:(?:main|index|audio|fetch|glcontext|host-events|launch-options|loading-progress|log|playtest|previewerrors|runtime-mode|storage|video)\.(?:js|html)|_framework\/dotnet(?:\.(?:native|runtime)(?:\.[a-z0-9]{10})?)?\.js):\d{1,6}:\d{1,7})\)?\s*$/;

export function diagnostic(message, context = {}) {
    if (typeof message !== "string") return "";
    const [first, ...lines] = message.slice(0, 8192).trim().split(/\r?\n/);
    if (!first) return "";
    const event = first.match(/^(?:ctrdx-(?:frame-error|frame-request-error|context-lost|startup-error)|boot-error|unsupported-error):/)?.[0];
    const detail = first.slice(event?.length || 0).trim().replace(/^Uncaught(?: \(in promise\))? /, "");
    const match = detail.match(/^(?:(?:Error|RuntimeError):\s+)?((?:(?:System|Microsoft|CutTheRopeDX)\.)[\w.]{1,90}Exception|(?:Type|Range|Reference|Runtime|Syntax|Network|Abort|Compile|Link|Security|NotSupported|QuotaExceeded)?Error)(?=[:\s]|$)/);
    const type = match?.[1];
    const explanation = detail.slice(match?.[0].length || 0).replace(/^:\s*/, "").trim();
    const asset = detail.match(/(?:\basset: |\b(?:audio )?content '|\bload customization content )((?:images|fonts|audio|sounds)\/[\w/-]{1,100}\.(?:webp|png|json|ttf|otf|mp3|opus|ogg|wav))(?=['\s]|\.$|$)/i)?.[1];
    const carried = lines.find(line => line.startsWith("reason: "))?.slice(8);
    const reason = event === "ctrdx-context-lost:" ? "webgl context lost" : event === "unsupported-error:" ? "webgl unavailable"
        : knownreasons.has(carried) ? carried : reasons.find(([, pattern]) => pattern.test(explanation))?.[0];
    const summary = [event, type, asset ? "asset: " + asset : ""].filter(Boolean).join(" ") || "Cut the Rope DX runtime failure";
    const output = [summary];
    if (reason) output.push("reason: " + reason);
    if (asset && reason === "asset request failed") {
        const status = lines.find(line => /^status: [45][0-9]{2}$/.test(line));
        if (status) output.push(status);
    }
    for (const [name, allowed] of Object.entries(fields)) {
        const prefix = name + ": ";
        const value = context[name] || lines.find(line => line.startsWith(prefix))?.slice(prefix.length);
        if (allowed.includes(value)) output.push(prefix + value);
    }
    const frames = new Set();
    for (const line of lines) {
        const frame = line.match(/^\s*at ((?:CutTheRopeDX|System|Microsoft)\.[\w.`+<>]{1,150})(?=[(\s]|$)/)?.[1] || line.match(framepath)?.[1];
        if (frame) frames.add(frame);
        if (frames.size === 8) break;
    }
    return [...output, ...Array.from(frames, frame => "at " + frame)].join("\n");
}

/*//////////////////////////////////////////////////////////////////////*/

export function reportcrash(message, context) {
    if (location.origin !== "https://candies.monster") return;
    const detail = diagnostic(message, context);
    if (!detail || reported.has(detail) || reported.size >= 4) return;
    reported.add(detail);
    void fetch(endpoint, {
        method: "POST", body: detail, keepalive: true,
        credentials: "omit", referrerPolicy: "no-referrer"
    }).catch(() => {});
}
