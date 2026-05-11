(function() {
    function parsecsv(text) {
        const rows = [];
        let row = [];
        let cell = "";
        let inquotes = false;
        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            if (inquotes) {
                if (ch === '"') {
                    if (text[i + 1] === '"') {cell += '"'; i++;}
                    else {inquotes = false;}
                } else {cell += ch;}
            } else if (ch === '"') {
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

    function resolveiconpath(p) {
        const value = cleanvalue(p);
        if (!value) return "";
        if (value.startsWith("/")) return value;
        if (value.startsWith("http://") || value.startsWith("https://")) return value;
        if (value.startsWith("assets/images/gameicons/")) return `/${value}`;
        if (value.includes("/")) return value;
        return `/assets/images/gameicons/${value}`;
    }

    function resolvepackageicon(pkg, filename) {
        const f = cleanvalue(filename);
        if (!f || !pkg) return "";
        if (/^https?:\/\//i.test(f)) return f;
        if (f.startsWith("/")) return f;
        if (f.toLowerCase().endsWith(".png") && !f.includes("/")) {
            return `icons/${pkg}/${f}`;
        }
        return "";
    }

    function resolvegameicon(pkg, p) {
        const value = cleanvalue(p);
        if (!value) return "";
        if (value.startsWith("icons/")) return value;
        if (value.startsWith("/")) return value;
        if (value.startsWith("http://") || value.startsWith("https://")) return value;
        if (value.toLowerCase().endsWith(".png") && !value.includes("/")) {
            return `icons/${pkg}/${value}`;
        }
        return resolveiconpath(value);
    }

    function parsepackageiconcolumns(line, pkg) {
        const out = [];
        for (let i = 5; i < line.length; i++) {
            const v = cleanvalue(line[i]);
            if (!v) continue;
            if (!v.toLowerCase().endsWith(".png")) continue;
            const url = resolvepackageicon(pkg, v);
            if (url) out.push(url);
        }
        return out;
    }

    function appendtogroup(basegame, entry, line) {
        if (!Array.isArray(basegame.name)) {
            basegame.name = [basegame.name];
            basegame.package = [basegame.package];
            basegame.icon = [basegame.icon];
            basegame.description = [basegame.description];
        }
        basegame.name.push(entry.name);
        basegame.package.push(entry.package);
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

            if (!c0 && !c1 && !c2 && !c3 && !c4 && !c5 && !c6) continue;

            // title, package, icon, description, importance, additional icons
            if (c0) {
                const grouped = c0.startsWith("+ ");
                const gameimp = parseInt(c4, 10);
                const pkg = c1;
                const extras = parsepackageiconcolumns(line, pkg);
                const entry = {
                    name: grouped ? c0.slice(2).trim() : c0,
                    package: pkg,
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
                bypackage.set(pkg, bypackage.get(pkg) || []);
                continue;
            }

            if (!currentgame || !currentgame.package) continue;
            const versions = bypackage.get(currentgame.package) || [];

            // [blank], version, icon, download link, [blank], arch, size
            if (c1) {
                const normalizedversion = /^v/i.test(c1) ? c1 : `v${c1}`;
                let entry = versions.find(v => (v.version || "").toLowerCase() === normalizedversion.toLowerCase());
                if (!entry) {
                    entry = {version: normalizedversion, icon: resolveiconpath(c2), details: "", downloads: []};
                    versions.push(entry);
                } else {
                    if (!entry.icon && c2) entry.icon = resolveiconpath(c2);
                }
                bypackage.set(currentgame.package, versions);
                currentversion = entry;

                const rowimportance = parseInt(c4, 10);
                if (!Number.isNaN(rowimportance)) {
                    const lastgroup = parsedgames[parsedgames.length - 1];
                    if (lastgroup && typeof lastgroup.importance === "number") {
                        lastgroup.importance = Math.max(lastgroup.importance, rowimportance);
                    }
                }
                if (c3) {
                    currentversion.downloads.push({url: c3, arch: c5, size: c6});
                }
                continue;
            }
            if (currentversion && c3) {
                currentversion.downloads.push({url: c3, arch: c5, size: c6});
            }
        }
        return {games: parsedgames, versionscache: bypackage};
    }

    window.csvthing = {
        parsegamescsv, resolveiconpath,
        resolvegameicon, resolvepackageicon
    };
    
})();
