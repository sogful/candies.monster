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
                const versions = versionsfor(platform.cache, key).map(version => ({
                    version,
                    text: text([heading, version.version, version.details, ...version.downloads.flatMap(download => Object.values(download))])
                }));
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
        const versions = record.versions.filter(version => matches(version.text)).map(item => item.version);
        if (heading) games.add(record.game);
        if (heading || versions.length) results.push({record, versions});
    }
    return {results, games};
}
