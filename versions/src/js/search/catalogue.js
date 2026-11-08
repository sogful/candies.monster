import {versionsfor} from "../catalogue/versions.js";

/*//////////////////////////////////////////////////////////////////////*/

const indexes = new WeakMap();

function values(value) {
    return Array.isArray(value) ? value : [value];
}

function text(values) {
    return values.filter(value => value != null).join(" ").normalize("NFKC").toLowerCase();
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
                    const downloads = version.downloads.map(download => ({download, text: text(Object.values(download))}));
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
    const terms = text([query]).trim().split(/\s+/).filter(Boolean);
    const matches = value => terms.every(term => value.includes(term));
    const games = new Set();
    const results = [];
    for (const record of records) {
        const heading = matches(record.heading);
        const versions = record.versions.filter(version => matches(version.text)).map(item => {
            const required = terms.filter(term => !item.common.includes(term));
            const downloads = new Set(item.downloads.filter(download => required.some(term => download.text.includes(term))).map(item => item.download));
            return {
                version: item.version,
                details: matches(text([item.version.details])),
                downloads: downloads.size ? downloads : null
            };
        });
        if (heading) games.add(record.game);
        if (heading || versions.length) results.push({
            record, versions,
            package: matches(text([record.package])),
            description: matches(text([record.description]))
        });
    }
    return {results, games};
}
