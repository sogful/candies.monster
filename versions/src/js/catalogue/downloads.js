import "./popover.js";
import {downloadbuttons} from "./data.js";

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
    if (downloadbuttons.universal.every(arch => architectures.has(arch))) return "universal";
    return [...new Set([...architectures].filter(Boolean).map(arch => downloadbuttons.architectures[arch] || arch))].join(",");
}

function downloadbutton(download) {
    const url = download.url.toLowerCase();
    const mirror = downloadbuttons.mirrors.find(item => url.startsWith(item.prefix) && url.includes(item.contains));
    if (download.kind !== "symbols" && mirror) return mirror.button;
    if (download.kind === "symbols") return downloadbuttons.symbols;
    if (download.button) return download.button;
    let hostname = "";
    try {hostname = new URL(download.url).hostname.toLowerCase()} catch {}
    const match = downloadbuttons.domains.find(item => hostname === item.domain || hostname.endsWith(`.${item.domain}`));
    return match ? `${match.icon}.webp` : downloadbuttons.fallback;
}

export function secondarydownload(download) {
    return downloadbuttons.secondary.includes(downloadbutton(download));
}

/*//////////////////////////////////////////////////////////////////////*/

export function orbitdescription(value, circle) {
    if (!value) return "";
    const label = circle === "zeptoapp" ? /\bzeptoapp\b/gi : circle === "teraleak" ? /\b(?:testflight|teraleak)\b/gi : null;
    return label ? value.replace(label, "").replace(/[ \t]{2,}/g, " ").trim() : value;
}

function renderdownloadbutton(download, version, description, game) {
    const button = downloadbutton(download);
    let hostname = "";
    try {hostname = new URL(download.url).hostname} catch {}
    const source = hostname || "Download";
    const zeptoapp = download.flags?.split(/\s+/).includes("zeptoapp") ? "zeptoapp" : "";
    const notes = [zeptoapp, description, download.kind === "symbols" ? "" : download.label, download.note]
        .map(value => orbitdescription(value, game.circle));
    const note = [...new Set(notes.filter(Boolean))].join("\n");
    const other = game.platform === "other";
    const warning = button === downloadbuttons.fallback && (other || !["store", "play"].includes(download.kind))
        ? `this ${other ? "game" : "version"} is from an unpopular source`
        : "";
    const information = {
        version, size: downloadsize(download.size), arch: downloadarch(download.arch), note,
        symbols: download.kind === "symbols" ? (download.label || "symbols").replace(/^\((.*)\)$/, "$1") : "",
        warning
    };
    const metadata = Object.entries(information).filter(([, value]) => value).map(([key, value]) => `data-download${key}="${downloadattribute(value)}"`).join(" ");
    const compact = secondarydownload(download) ? " smallsource" : "";
    return `<a class="downloadbutton clickable${compact}" href="${downloadattribute(download.url)}" target="_blank" rel="noopener" aria-label="${downloadattribute(`${source} ${version}`)}" aria-haspopup="dialog" ${metadata}>
        <img src="/assets/images/buttons/download/${downloadattribute(button)}" alt="" draggable="false" loading="lazy" decoding="async" width="24" height="24">
    </a>`;
}

export function renderdownloads(downloads, version, description, game) {
    return downloads.map(download => renderdownloadbutton(download, version, description, game)).join("");
}
