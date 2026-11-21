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
    if (download.kind === "torrent") return downloadbuttons.torrent;
    if (download.button) return download.button;
    let hostname = "";
    try {hostname = new URL(download.url).hostname.toLowerCase()} catch {}
    const match = downloadbuttons.domains.find(item => hostname === item.domain || hostname.endsWith(`.${item.domain}`));
    return match ? `${match.icon}.webp` : downloadbuttons.fallback;
}

export function secondarydownload(download) {
    return downloadbuttons.secondary.includes(downloadbutton(download));
}

export function downloadidentity(download) {
    let url = download.url;
    try {url = new URL(url).href} catch {}
    const file = downloadbuttons.files?.[download.url];
    const type = ["symbols", "evidence"].includes(download.kind) ? download.kind : "file";
    return file ? `${type}|${downloadbutton(download)}|${file}` : `${type}|${url}`;
}

/*//////////////////////////////////////////////////////////////////////*/

export function orbitdescription(value, circle) {
    if (!value) return "";
    if (/^play$/i.test(value.trim())) return "";
    const label = circle === "zeptoapp" ? /\bzeptoapp\b/gi : circle === "teraleak" ? /\b(?:testflight|teraleak)\b/gi : null;
    return label ? value.replace(label, "").replace(/[ \t]{2,}/g, " ").trim() : value;
}

function downloadnote(value, game, symbols) {
    return orbitdescription(value, game.circle).split(/\s*[,;\n]\s*/)
        .filter(part => part && !/^play$/i.test(part) &&
            (symbols || !/^(?:(?:debug|native)\s+)?symbols?(?:\s+(?:in|included|reported|present|available|found)\b[^\n]*|\s*\([^)]*\))?$/i.test(part)))
        .join(", ");
}

function renderdownloadbutton(download, version, description, game) {
    const button = downloadbutton(download);
    const magnet = download.url.startsWith("magnet:");
    let hostname = "";
    try {hostname = new URL(download.url).hostname} catch {}
    const source = magnet ? "Magnet link" : hostname || "Download";
    const zeptoapp = download.flags?.split(/\s+/).includes("zeptoapp") ? "zeptoapp" : "";
    const symbols = download.kind === "symbols";
    const notes = [zeptoapp, description, symbols ? "" : download.label, download.note]
        .map(value => downloadnote(value, game, symbols));
    const note = [...new Set(notes.filter(Boolean))].join("\n");
    const other = game.platform === "other";
    const warning = button === downloadbuttons.fallback && (other || !["store", "play"].includes(download.kind))
        ? `this ${other ? "game" : "version"} is from an unpopular source`
        : "";
    const information = {
        version, size: downloadsize(download.size), arch: downloadarch(download.arch), note,
        symbols: symbols ? (download.label || "symbols").replace(/^\((.*)\)$/, "$1") : "",
        urls: download.urls?.length > 1 ? JSON.stringify(download.urls) : "",
        topic: download.topic || "",
        warning
    };
    const metadata = Object.entries(information).filter(([, value]) => value).map(([key, value]) => `data-download${key}="${downloadattribute(value)}"`).join(" ");
    const compact = secondarydownload(download) ? " smallsource" : "";
    return `<a class="downloadbutton clickable${compact}" href="${downloadattribute(download.url)}"${magnet ? "" : ' target="_blank"'} rel="noopener" aria-label="${downloadattribute(`${source} ${version}`)}" aria-haspopup="dialog" ${metadata}>
        <img src="/assets/images/buttons/download/${downloadattribute(button)}" alt="" draggable="false" loading="lazy" decoding="async" width="24" height="24">
    </a>`;
}

export function renderdownloads(downloads, version, description, game) {
    return downloads.map(download => renderdownloadbutton(download, version, description, game)).join("");
}
