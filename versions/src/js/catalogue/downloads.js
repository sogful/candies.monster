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
    const mirror = downloadbuttons.mirrors.find(item => download.url.startsWith(item.prefix) && download.url.includes(item.contains));
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

function renderdownloadbutton(download, version, description) {
    const button = downloadbutton(download);
    let hostname = "";
    try {hostname = new URL(download.url).hostname} catch {}
    const source = hostname || "Download";
    const note = [...new Set([description, download.kind === "symbols" ? "" : download.label, download.note].filter(Boolean))].join("\n");
    const information = {
        version, size: downloadsize(download.size), arch: downloadarch(download.arch), note,
        symbols: download.kind === "symbols" ? (download.label || "symbols").replace(/^\((.*)\)$/, "$1") : "",
        warning: button === downloadbuttons.fallback ? "this version is from an unpopular source" : ""
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
