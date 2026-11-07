import "./popover.js";

/*//////////////////////////////////////////////////////////////////////*/

const buttonmap = [
    {domain: "cdn.candies.monster", icon: "cdn"},
    {domain: "apkmirror.com", icon: "apkmirror"},
    {domain: "apkpure.com", icon: "apkpure"},
    {domain: "apkpure.net", icon: "apkpure"},
    {domain: "uptodown.com", icon: "uptodown"},
    {domain: "pdalife.to", icon: "pdalife"},
    {domain: "pdalife.com", icon: "pdalife"},
    {domain: "4pda.to", icon: "4pda"},
    {domain: "4pda.ru", icon: "4pda"},
    {domain: "drive.google.com", icon: "googledrive"},
    {domain: "drive.usercontent.google.com", icon: "googledrive"},
    {domain: "drive.googleusercontent.com", icon: "googledrive"},
    {domain: "apkbe.com", icon: "apkbe"},
    {domain: "downzen.com", icon: "downzen"},
    {domain: "mega.io", icon: "mega"},
    {domain: "mega.nz", icon: "mega"},
    {domain: "mediafire.com", icon: "mediafire"},
    {domain: "archive.org", icon: "internetarchive"},
    {domain: "github.com", icon: "ctrhome"},
    {domain: "githubusercontent.com", icon: "ctrhome"},
    {domain: "github.io", icon: "ctrhome"}
];
const sourcenames = {
    cdn: "candies.monster", apkmirror: "APKMirror", apkpure: "APKPure",
    uptodown: "Uptodown", pdalife: "PDA Life", "4pda": "4PDA",
    googledrive: "Google Drive", apkbe: "APKBE", downzen: "Downzen",
    mega: "MEGA", mediafire: "MediaFire", internetarchive: "Internet Archive",
    ctrhome: "Cut the Rope Home", symbols: "Debug symbols"
};

/*//////////////////////////////////////////////////////////////////////*/

export function downloadattribute(value) {
    return String(value || "").replaceAll("&", "&amp;").replaceAll("\"", "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function downloadsize(value) {
    const match = String(value || "").trim().match(/^(\d+(?:\.\d+)?)\s*mb$/i);
    return match ? `${(Math.round(Number(match[1]) * 10) / 10).toFixed(1)}mb` : value;
}

function downloadarch(value) {
    const architectures = new Set(String(value || "").toLowerCase().split(/[,;\s/]+/));
    if (["armeabi-v7a", "arm64-v8a", "x86", "x86_64"].every(arch => architectures.has(arch))) return "universal";
    const aliases = {"armeabi": "arm", "armeabi-v7a": "arm", "arm32": "arm", "armv7": "arm", "arm64-v8a": "arm64", "aarch64": "arm64", "x86_64": "x64", "arm64-v8": "arm64"};
    return [...new Set([...architectures].filter(Boolean).map(arch => aliases[arch] || arch))].join(",");
}

function downloadbutton(download) {
    if (download.kind !== "symbols" && download.url.startsWith("https://cdn.candies.monster/apks/") && download.url.includes("/4pda/")) return "4pda.webp";
    if (download.kind === "symbols") return "symbols.webp";
    if (download.button) return download.button;
    let hostname = "";
    try {hostname = new URL(download.url).hostname.toLowerCase()} catch {}
    const match = buttonmap.find(item => hostname === item.domain || hostname.endsWith(`.${item.domain}`));
    return `${match?.icon || "other"}.webp`;
}

export function secondarydownload(download) {
    return ["other.webp", "pdalife.webp", "symbols.webp"].includes(downloadbutton(download));
}

/*//////////////////////////////////////////////////////////////////////*/

function renderdownloadbutton(download, version, description) {
    const button = downloadbutton(download);
    const name = button.replace(/\.[^.]+$/, "");
    let hostname = "";
    try {hostname = new URL(download.url).hostname} catch {}
    const source = sourcenames[name] || hostname || "Download";
    const note = [...new Set([description, download.kind === "symbols" ? "" : download.label, download.note].filter(Boolean))].join("\n");
    const information = {
        version, source, size: downloadsize(download.size), arch: downloadarch(download.arch), note,
        symbols: download.kind === "symbols" ? (download.label || "symbols").replace(/^\((.*)\)$/, "$1") : "",
        warning: button === "other.webp" ? "⚠️ this version is from an unpopular source" : ""
    };
    const metadata = Object.entries(information).filter(([, value]) => value).map(([key, value]) => `data-download${key}="${downloadattribute(value)}"`).join(" ");
    const compact = secondarydownload(download) ? " smallsource" : "";
    return `<a class="downloadbutton clickable${compact}" href="${downloadattribute(download.url)}" target="_blank" rel="noopener" aria-label="${downloadattribute(`${source} ${version}`)}" aria-haspopup="dialog" ${metadata}>
        <img src="/assets/images/downloadbuttons/${downloadattribute(button)}" alt="" draggable="false" loading="lazy" decoding="async" width="24" height="24">
    </a>`;
}

export function renderdownloads(downloads, version, description = "") {
    return downloads.map(download => renderdownloadbutton(download, version, description)).join("");
}
