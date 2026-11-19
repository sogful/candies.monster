import {versionsfor} from "./catalogue/versions.js";

/*//////////////////////////////////////////////////////////////////////*/

const indexes = new WeakMap();

function values(value) {
    return Array.isArray(value) ? value : [value];
}

function text(values) {
    return values.filter(value => value != null).join(" ").normalize("NFKC").toLowerCase();
}

export function downloadflags(download) {
    const flags = new Set((download.flags || "").toLowerCase().split(/\s+/));
    if (/\bteraleak\b|\/leaks\/teraleak\//i.test(text([download.label, download.note, download.url]))) flags.add("teraleak");
    if (/\bzeptoapp\b|\/leaks\/zeptoapp\//i.test(text([download.label, download.note, download.url]))) flags.add("zeptoapp");
    if (/\bunlocked\b|\bunlock(?:s|ing)? all\b|\b(?:free|unlimited|infinite) (?:money|coins|currency|gems)\b/i.test(text([download.label, download.note]))) flags.add("unlocked");
    return flags;
}

function searchbranches(query) {
    return text([query]).trim().split(/\s+or\s+/).map(branch => {
        const terms = [];
        const flags = [];
        for (const token of branch.split(/\s+/).filter(Boolean)) {
            const flag = token.match(/^is(teraleak|zeptoapp|unlocked):true$/);
            if (flag) flags.push(flag[1]);
            else terms.push(token);
        }
        return {terms, flags};
    }).filter(branch => branch.terms.length || branch.flags.length);
}

export function searchindex(platforms) {
    return platforms.flatMap(platform => {
        if (!platform.cache || !platform.games) return [];
        if (!indexes.has(platform.cache)) {
            const records = platform.games.flatMap(game => values(game.package).map((pkg, index) => {
                const value = name => values(game[name])[index] || "";
                const name = value("name");
                const description = value("description");
                const key = value("verkey") || pkg;
                const heading = text([name, pkg, description]);
                const versions = versionsfor(platform.cache, key).map(version => {
                    const common = text([heading, version.version, version.details]);
                    const downloads = version.downloads.map(download => ({download, text: text(Object.values(download)), flags: downloadflags(download)}));
                    return {version, common, downloads, text: text([common, ...downloads.map(download => download.text)])};
                });
                return {game, index, platform: platform.name, name, package: pkg, description, heading, versions};
            }));
            indexes.set(platform.cache, records);
        }
        return indexes.get(platform.cache);
    });
}

export function findresults(records, query) {
    const branches = searchbranches(query);
    const matches = (branch, value) => branch.terms.every(term => value.includes(term));
    const headingmatches = value => branches.some(branch => !branch.flags.length && matches(branch, value));
    const detailmatches = value => branches.some(branch => branch.terms.length && matches(branch, text([value])));
    const games = new Set();
    const results = [];
    for (const record of records) {
        const heading = headingmatches(record.heading);
        const versions = record.versions.flatMap(item => {
            let found = false;
            let all = false;
            const downloads = new Set();
            for (const branch of branches) {
                if (!matches(branch, item.text)) continue;
                const required = branch.terms.filter(term => !item.common.includes(term));
                if (!branch.flags.length) {
                    found = true;
                    all ||= !required.length;
                }
                for (const download of item.downloads) {
                    if (!branch.flags.every(flag => download.flags.has(flag))) continue;
                    if (branch.flags.length && !required.every(term => download.text.includes(term))) continue;
                    if (!branch.flags.length && !required.some(term => download.text.includes(term))) continue;
                    downloads.add(download.download);
                    found = true;
                }
            }
            if (!found) return [];
            return {
                version: item.version,
                details: detailmatches(item.version.details),
                downloads: !all && downloads.size ? downloads : null
            };
        });
        if (!heading && !versions.length) continue;
        games.add(record.game);
        results.push({
            record, versions,
            description: detailmatches(record.description)
        });
    }
    return {results, games};
}
