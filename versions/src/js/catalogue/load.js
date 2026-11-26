import {rawicons} from "./data.js";

/*//////////////////////////////////////////////////////////////////////*/

function parsecsv(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let inquotes = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (inquotes) {
            if (ch === "\"") {
                if (text[i + 1] === "\"") {cell += "\""; i++;}
                else {inquotes = false;}
            } else {cell += ch;}
        } else if (ch === "\"") {
            inquotes = true;
        } else if (ch === ",") {
            row.push(cell);
            cell = "";
        } else if (ch === "\n") {
            row.push(cell);
            rows.push(row);
            row = [];
            cell = "";
        } else if (ch !== "\r") {
            cell += ch;
        }
    }
    if (cell.length > 0 || row.length > 0) {
        row.push(cell);
        rows.push(row);
    }
    return rows;
}

function cleanvalue(v) {
    return (v || "").trim();
}

function hasdownload(downloads) {
    return (downloads || []).some(download => cleanvalue(download?.url) && !["symbols", "evidence"].includes(download.kind));
}

const iconbase = "/assets/images/icons/";

function iconkey(value) {
    if (value.startsWith("/") && !value.startsWith(`${iconbase}games/`) &&
        !value.startsWith(`${iconbase}fangames/`)) return "";
    return value.replace(/^\/?assets\/images\/icons\/(?:games\/)?/, "")
        .replace(/^fan\//, "fangames/")
        .replace(/\/(?:64|128|256)\.webp$|\/raw\.(?:png|jpe?g|webp)$/i, "");
}

function iconfolder(key) {
    return key.startsWith("fangames/") ? `${iconbase}${key}` : `${iconbase}games/${key}`;
}

function resolveiconpath(p, size = 64) {
    const value = cleanvalue(p);
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    const key = iconkey(value);
    return key ? `${iconfolder(key)}/${size > 128.5 ? 256 : size > 64.5 ? 128 : 64}.webp` : value;
}

function resolveiconsrcset(p, size = 64) {
    if (!cleanvalue(p)) return "";
    return `${resolveiconpath(p, size)} 1x`;
}

function resolverawiconpath(p) {
    const value = cleanvalue(p);
    if (!value || /^https?:\/\//i.test(value)) return value;
    const key = iconkey(value);
    return key ? `${iconfolder(key)}/raw.${rawicons[key] || "png"}` : value;
}

function resolveversionlabel(value) {
    const label = cleanvalue(value);
    return /^v?\d/i.test(label) ? `v${label.replace(/^v/i, "")}` : label;
}

function resolvepackageicon(pkg, filename) {
    const f = cleanvalue(filename);
    if (!f || !pkg) return "";
    if (/\.(png|jpe?g|webp)$/i.test(f) && (f.startsWith(`${iconbase}games/`) ||
        f.startsWith(`${iconbase}fangames/`) || /^https?:\/\//i.test(f))) return f;
    return "";
}

function resolvegameicon(pkg, p) {
    return resolveiconpath(p);
}

function parsepackageiconcolumns(line, pkg) {
    const out = [];
    for (let i = 5; i < line.length; i++) {
        const v = cleanvalue(line[i]);
        if (!v) continue;
        const url = resolvepackageicon(pkg, v);
        if (url && !out.includes(url)) out.push(url);
    }
    return out;
}

function appendtogroup(basegame, entry, line) {
    if (!Array.isArray(basegame.name)) {
        basegame.name = [basegame.name];
        basegame.package = [basegame.package];
        basegame.verkey = [basegame.verkey];
        basegame.icon = [basegame.icon];
        basegame.description = [basegame.description];
        basegame.internal = [basegame.internal];
        basegame.evidence = [basegame.evidence];
        basegame.packageroutes = [""];
    }
    basegame.name.push(entry.name);
    basegame.package.push(entry.package);
    basegame.verkey.push(entry.verkey);
    basegame.icon.push(entry.icon);
    basegame.description.push(entry.description);
    basegame.internal.push(entry.internal);
    basegame.evidence.push(entry.evidence);
    basegame.packageroutes.push(entry.routekey);
    const extras = parsepackageiconcolumns(line, entry.package);
    if (!basegame.pkgIconsList) basegame.pkgIconsList = [];
    basegame.pkgIconsList.push(extras);
}

function releasechannel(pkg, description) {
    if (/\b(?:android|fire) tv\b/i.test(description)) return "androidtv";
    if (/(?:^|\.)tiertwo(?:\.|$)/i.test(pkg) || /^tiertwo\b/i.test(description)) return "tiertwo";
    if (/(?:^|\.)amazon(?:\.|$)/i.test(pkg) || /^amazon\b/i.test(description)) return "amazon";
    return "";
}

function parsegamescsv(text, separateandroid = false) {
    const rows = parsecsv(text);
    if (rows.length === 0) return {games: [], versionscache: new Map()};

    const parsedgames = [];
    const bypackage = new Map();
    let currentgame = null;
    let currentversion = null;
    let currentgroup = null;
    const family = new Map();

    for (let r = 0; r < rows.length; r++) {
        const line = rows[r];

        const c0 = cleanvalue(line[0]);
        const c1 = cleanvalue(line[1]);
        const c2 = cleanvalue(line[2]);
        const c3 = cleanvalue(line[3]);
        const c4 = cleanvalue(line[4]);
        const c5 = cleanvalue(line[5]);
        const c6 = cleanvalue(line[6]);

        if (r === 0 && c0 === "game" && c1 === "package/version") continue;

        const kind = cleanvalue(line[7]);
        const label = cleanvalue(line[8]);
        const note = cleanvalue(line[9]);
        const flags = cleanvalue(line[10]);
        const topic = kind === "torrent" && /^https:\/\/rutracker\.org\/forum\/viewtopic\.php\?t=\d+$/.test(line[11]) ? line[11] : "";

        if (!c0 && !c1 && !c2 && !c3 && !c4 && !c5 && !c6) continue;
        if (c0) {
            const grouped = c0.startsWith("+ ");
            const gameimp = parseInt(c4, 10);
            const pkg = c1;
            const channel = separateandroid ? releasechannel(pkg, c3) : "";
            if (!grouped) family.clear();
            const base = family.get(channel);
            let verkey = pkg || `__empty_${r}`;
            if (bypackage.has(verkey)) verkey = `${verkey}#${r}`;
            const extras = parsepackageiconcolumns(line, pkg);
            const route = line.find((value, index) => index >= 5 && value.startsWith("route="));
            const legacy = line.find((value, index) => index >= 5 && value.startsWith("legacyroute="));
            const system = line.find((value, index) => index >= 5 && value.startsWith("system="));
            const internal = line.find((value, index) => index >= 5 && value.startsWith("internal="));
            const evidence = line.find((value, index) => index >= 5 && value.startsWith("evidence="));
            const entry = {
                routekey: route?.slice(6).trim() || "",
                legacyroute: legacy?.slice(12).trim() || "",
                system: system?.slice(7).trim() || "",
                internal: internal?.slice(9).trim() || "",
                evidence: evidence?.slice(9).trim() || "",
                name: grouped ? c0.slice(2).trim() : c0,
                package: pkg,
                verkey: verkey,
                icon: resolvegameicon(pkg, c2),
                importance: Number.isNaN(gameimp) ? 0 : gameimp,
                description: c3,
                channel, pkgIconsList: base ? null : [extras]
            };
            if (base) {
                appendtogroup(base, entry, line);
                base.importance = Math.max(base.importance || 0, entry.importance);
            } else {
                parsedgames.push(entry);
                family.set(channel, entry);
            }
            currentgroup = base || entry;
            currentgame = entry;
            bypackage.set(verkey, []);
            currentversion = null;
            continue;
        }

        if (!currentgame) continue;
        const vk = currentgame.verkey;
        const versions = bypackage.get(vk) || [];
        if (c1) {
            const normalizedversion = resolveversionlabel(c1);
            let entry = versions.find(v => (v.version || "").toLowerCase() === normalizedversion.toLowerCase());
            if (!entry) {
                entry = {version: normalizedversion, icon: resolveiconpath(c2), details: "", downloads: []};
                versions.push(entry);
            } else {
                if (!entry.icon && c2) entry.icon = resolveiconpath(c2);
            }
            bypackage.set(vk, versions);
            currentversion = entry;

            const rowimportance = parseInt(c4, 10);
            if (!Number.isNaN(rowimportance)) {
                currentgroup.importance = Math.max(currentgroup.importance, rowimportance);
            }
            if (c3) {
                currentversion.downloads.push({url: c3, arch: c5, size: c6, kind, label, note, flags, topic});
            }
            continue;
        }
        if (currentversion && c3) {
            currentversion.downloads.push({url: c3, arch: c5, size: c6, kind, label, note, flags, topic});
        }
    }
    return {games: parsedgames, versionscache: bypackage};
}

window.csvthing = {
    parsegamescsv, hasdownload, resolveiconpath, resolveiconsrcset, resolverawiconpath, resolveversionlabel,
    resolvegameicon, resolvepackageicon
};

/*//////////////////////////////////////////////////////////////////////*/

export {parsegamescsv, hasdownload, resolveiconpath, resolveiconsrcset, resolverawiconpath, resolveversionlabel, resolvegameicon, resolvepackageicon};
