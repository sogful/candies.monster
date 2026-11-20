const endpoint = "https://bugreport.candies.monster/report";
const reported = new Set();

export function diagnostic(message) {
    if (typeof message !== "string") return "";
    const lines = message.slice(0, 8192).trim().split(/\r?\n/);
    const event = lines[0].match(/^ctrdx-(?:frame-error|frame-request-error|context-lost|startup-error):/)?.[0];
    const type = lines[0].match(/^(?:ctrdx-[a-z-]+:\s*)?((?:(?:System|Microsoft|CutTheRopeDX)\.)[\w.]{1,90}Exception|(?:Type|Range|Reference|Runtime|Syntax|Network|Abort)?Error)(?=[:\s]|$)/)?.[1];
    const asset = lines[0].match(/(?:\basset: |^.*?\bContent ')((?:images|fonts|audio|sounds)\/[\w/-]{1,100}\.(?:webp|png|json|ttf|otf|mp3|opus|ogg|wav))(?=['\s]|$)/i)?.[1];
    if (!event && !type && !asset) return "Cut the Rope DX runtime failure";

    const frames = lines.map(line => line.match(/^\s*at ((?:CutTheRopeDX|System|Microsoft)\.[\w.`+<>]{1,150})(?=[(\s]|$)/)?.[1]).filter(Boolean).slice(0, 8);
    const summary = [event, type, asset ? "asset: " + asset : ""].filter(Boolean).join(" ");
    return [summary, ...frames.map(frame => "at " + frame)].join("\n");
}

/*//////////////////////////////////////////////////////////////////////*/

export function reportcrash(message) {
    if (location.origin !== "https://candies.monster") return;
    const detail = diagnostic(message);
    if (!detail || reported.has(detail) || reported.size >= 4) return;
    reported.add(detail);
    void fetch(endpoint, {
        method: "POST", body: detail, keepalive: true,
        credentials: "omit", referrerPolicy: "no-referrer"
    }).catch(() => {});
}
