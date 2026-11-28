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

function downloaddomain(url) {
    let hostname;
    try {hostname = new URL(url).hostname.toLowerCase()}
    catch {return}
    return downloadbuttons.domains.find(item => hostname === item.domain || hostname.endsWith(`.${item.domain}`));
}

function downloadbutton(download) {
    const url = download.url.toLowerCase();
    const mirror = downloadbuttons.mirrors.find(item => url.startsWith(item.prefix) && url.includes(item.contains));
    if (download.kind !== "symbols" && mirror) return mirror.button;
    if (download.kind === "symbols") return downloadbuttons.symbols;
    if (download.kind === "torrent") return downloadbuttons.torrent;
    if (download.button) return download.button;
    const match = downloaddomain(download.url);
    return match ? `${match.icon}.webp` : downloadbuttons.fallback;
}

export function secondarydownload(download, button = downloadbutton(download)) {
    return downloadbuttons.secondary.includes(button) || Boolean(downloaddomain(download.url)?.compact);
}

export function downloadidentity(download) {
    let url = download.url;
    try {url = new URL(url).href} catch {}
    const file = downloadbuttons.files?.[download.url];
    const type = ["symbols", "evidence"].includes(download.kind) ? download.kind : "file";
    return file ? `${type}|${downloadbutton(download)}|${file}` : `${type}|${url}`;
}

/*//////////////////////////////////////////////////////////////////////*/

const orbitlabels = {
    zeptoapp: /\bzeptoapp\b/gi,
    teraleak: /\b(?:testflight|teraleak)\b/gi,
    androidtv: /^android\s+tv\b/i,
    tiertwo: /^tiertwo\b/i,
    amazon: /^amazon(?:\s+app\s?store)?\b/i
};

export function orbitdescription(value, circle) {
    const text = String(value || "").trim();
    if (/^play$/i.test(text)) return "";
    const label = orbitlabels[circle];
    if (!label) return text;
    const summary = text.replace(label, "");
    if (summary === text) return text;
    return summary
        .replace(/\(\s*\)/g, "")
        .replace(/^[\s,:-]+|[\s,:-]+$/g, "")
        .replace(/(?:^|\s+)edition$/i, "")
        .replace(/^\(([^()]*)\)$/, "$1")
        .replace(/[ \t]{2,}/g, " ");
}

function labelkey(value) {
    return value.toLowerCase().replace(/[.\s_-]+/g, "");
}

function implicitdownloadlabels(download, button, url) {
    const host = url?.hostname || "";
    const site = button === downloadbuttons.fallback ? "" : button.replace(/\.webp$/, "");
    const path = url?.pathname.replace(/\/(?:file|download)\/?$/i, "") || "";
    const extension = path.match(/\.((?:tar\.)?[a-z\d]+)$/i)?.[1];
    const torrentformat = url?.searchParams.get("dn")?.match(/\[(ns[pz]|xc[iz])\]/i)?.[1];
    const labels = [host, host.replace(/^www\./i, ""), host.split(".").at(-2), site, extension, torrentformat, "play"];
    if (download.kind === "torrent") labels.push("torrent");
    return new Set(labels.filter(Boolean).map(labelkey));
}

function downloadnote(value, game, symbols, implicit) {
    return orbitdescription(value, game.circle).split(/\s*[,;\n]\s*/)
        .filter(part => {
            const label = part.replace(/^(?:archived |archive mirror of the )/i, "");
            if (!part || implicit.has(labelkey(label))) return false;
            return symbols || !/^(?:(?:debug|native)\s+)?symbols?(?:\s+(?:in|included|reported|present|available|found)\b[^\n]*|\s*\([^)]*\))?$/i.test(part);
        })
        .join(", ");
}

function renderdownloadbutton(download, version, description, game) {
    const button = downloadbutton(download);
    const magnet = download.url.startsWith("magnet:");
    let url;
    try {url = new URL(download.url)} catch {}
    const source = magnet ? "Magnet link" : url?.hostname || "Download";
    const zeptoapp = download.flags?.split(/\s+/).includes("zeptoapp") ? "zeptoapp" : "";
    const symbols = download.kind === "symbols";
    const variant = symbols ? "" : [download.note, download.label, description]
        .map(value => value?.match(/(?:^|[,;/]\s*)(rc|dev|ptc)(?=$|[\s,;/])/i)?.[1].toLowerCase())
        .find(Boolean);
    const implicit = implicitdownloadlabels(download, button, url);
    const notes = [zeptoapp, description, symbols ? "" : download.label, download.note]
        .map(value => downloadnote(value, game, symbols, implicit));
    const note = [...new Set(notes.filter(Boolean))].join("\n");
    const other = game.platform === "other";
    const warning = button === downloadbuttons.fallback && download.kind !== "store" && (other || download.kind !== "play")
        ? `this ${other ? "game" : "version"} is from a non-trusted source`
        : "";
    const information = {
        version, size: downloadsize(download.size), arch: downloadarch(download.arch), note,
        symbols: symbols ? (download.label || "symbols").replace(/^\((.*)\)$/, "$1") : "",
        urls: download.urls?.length > 1 ? JSON.stringify(download.urls) : "",
        topic: download.topic || "",
        warning
    };
    const metadata = Object.entries(information).filter(([, value]) => value).map(([key, value]) => `data-download${key}="${downloadattribute(value)}"`).join(" ");
    const compact = secondarydownload(download, button) ? " smallsource" : "";
    return `<a class="downloadbutton clickable${compact}${variant ? " labeleddownload" : ""}" href="${downloadattribute(download.url)}"${magnet ? "" : ' target="_blank"'} rel="noopener" aria-label="${downloadattribute([source, version, variant].filter(Boolean).join(" "))}" aria-haspopup="dialog" ${metadata}>
        <img src="/assets/images/buttons/download/${downloadattribute(button)}" alt="" draggable="false" loading="lazy" decoding="async" width="24" height="24">
        ${variant ? `<span class="downloadvariant">${variant}</span>` : ""}
    </a>`;
}

export function renderdownloads(downloads, version, description, game) {
    return downloads.map(download => renderdownloadbutton(download, version, description, game)).join("");
}
