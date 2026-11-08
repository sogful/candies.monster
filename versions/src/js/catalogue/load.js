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
    return (downloads || []).some(download => cleanvalue(download?.url) && download.kind !== "symbols");
}

function resolveiconpath(p, size = 64) {
    const value = cleanvalue(p);
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    const base = "/assets/images/gameicons/";
    if (value.startsWith("/") && !value.startsWith(base)) return value;
    const relative = value.replace(/^\/?assets\/images\/gameicons\//, "");
    const key = relative.replace(/\/(?:64|128|256)\.webp$|\/raw\.(?:png|jpe?g|webp)$/i, "");
    return `${base}${key}/${size > 128.5 ? 256 : size > 64.5 ? 128 : 64}.webp`;
}

function resolveiconsrcset(p, size = 64) {
    if (!cleanvalue(p)) return "";
    return `${resolveiconpath(p, size)} 1x`;
}

function resolverawiconpath(p) {
    const value = cleanvalue(p);
    if (!value || /^https?:\/\//i.test(value)) return value;
    const base = "/assets/images/gameicons/";
    if (value.startsWith("/") && !value.startsWith(base)) return value;
    const relative = value.replace(/^\/?assets\/images\/gameicons\//, "");
    const key = relative.replace(/\/(?:64|128|256)\.webp$|\/raw\.(?:png|jpe?g|webp)$/i, "");
    return `${base}${key}/raw.${rawicons[key] || "png"}`;
}

function resolveversionlabel(value) {
    const label = cleanvalue(value);
    return /^v?\d/i.test(label) ? `v${label.replace(/^v/i, "")}` : label;
}

function resolvepackageicon(pkg, filename) {
    const f = cleanvalue(filename);
    if (!f || !pkg) return "";
    if (/\.(png|jpe?g|webp)$/i.test(f) && (f.startsWith("/assets/images/gameicons/") || /^https?:\/\//i.test(f))) return f;
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
    }
    basegame.name.push(entry.name);
    basegame.package.push(entry.package);
    basegame.verkey.push(entry.verkey);
    basegame.icon.push(entry.icon);
    basegame.description.push(entry.description);
    const extras = parsepackageiconcolumns(line, entry.package);
    if (!basegame.pkgIconsList) basegame.pkgIconsList = [];
    basegame.pkgIconsList.push(extras);
}

function parsegamescsv(text) {
    const rows = parsecsv(text);
    if (rows.length === 0) return {games: [], versionscache: new Map()};

    const parsedgames = [];
    const bypackage = new Map();
    let currentgame = null;
    let currentversion = null;

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

        if (!c0 && !c1 && !c2 && !c3 && !c4 && !c5 && !c6) continue;
        if (c0) {
            const grouped = c0.startsWith("+ ");
            const gameimp = parseInt(c4, 10);
            const pkg = c1;
            let verkey = pkg || `__empty_${r}`;
            if (bypackage.has(verkey)) verkey = `${verkey}#${r}`;
            const extras = parsepackageiconcolumns(line, pkg);
            const entry = {
                name: grouped ? c0.slice(2).trim() : c0,
                package: pkg,
                verkey: verkey,
                icon: resolvegameicon(pkg, c2),
                importance: Number.isNaN(gameimp) ? 0 : gameimp,
                description: c3,
                pkgIconsList: grouped ? null : [extras]
            };
            if (grouped && parsedgames.length > 0) {
                const base = parsedgames[parsedgames.length - 1];
                appendtogroup(base, entry, line);
                base.importance = Math.max(base.importance || 0, entry.importance);
                currentgame = entry;
            } else {
                parsedgames.push(entry);
                currentgame = entry;
            }
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
                const lastgroup = parsedgames[parsedgames.length - 1];
                if (lastgroup && typeof lastgroup.importance === "number") {
                    lastgroup.importance = Math.max(lastgroup.importance, rowimportance);
                }
            }
            if (c3) {
                currentversion.downloads.push({url: c3, arch: c5, size: c6, kind, label, note});
            }
            continue;
        }
        if (currentversion && c3) {
            currentversion.downloads.push({url: c3, arch: c5, size: c6, kind, label, note});
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
