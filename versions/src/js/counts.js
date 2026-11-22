import {hasdownload} from "./catalogue/load.js";
import {layers, platformlabels} from "./layers.js";

const platforms = new Map();

/*//////////////////////////////////////////////////////////////////////*/

function titlekey(game) {
    const title = [game.name].flat()[0].normalize("NFKC").toLowerCase().trim();
    const system = game.system && ` (${game.system.toLowerCase()})`;
    return system && title.endsWith(system) ? title.slice(0, -system.length) : title;
}

function display(element, entries, count) {
    if (!element) return;
    if (entries.includes(undefined)) element.textContent = "...";
    else if (entries.includes(null)) element.textContent = "unavailable";
    else element.textContent = count(entries).toLocaleString();
}

function unique(entries, key) {
    return new Set(entries.flatMap(entry => [...entry[key]])).size;
}

function missing(entries) {
    return entries.reduce((total, entry) => total + entry.missing, 0);
}

export function updatecounts(layer, name, cache, games = []) {
    let available = 0;
    let absent = 0;
    const symbols = new Set();
    const links = new Set();
    if (cache) {
        for (const versions of cache.values()) {
            for (const version of versions) {
                if (hasdownload(version.downloads)) available++;
                else absent++;
                for (const download of version.downloads) {
                    if (!download.url) continue;
                    if (download.kind === "symbols") symbols.add(download.url);
                    else if (hasdownload([download])) links.add(download.url);
                }
            }
        }
    }
    const element = document.querySelector(`[data-counts="${layer}"] .${name}count`);
    if (element) element.textContent = cache ? available : "unavailable";
    const titles = new Set(games.filter(game => game.available).map(titlekey));
    platforms.set(layer + "/" + name, cache ? {missing: absent, symbols, links, titles} : null);
    const groups = new Map(layers.map(({name}) => [name, Object.keys(platformlabels).map(platform => platforms.get(name + "/" + platform))]));
    for (const [group, entries] of groups) {
        display(document.querySelector(`[data-counts="${group}"] .gamecount`), entries, values => unique(values, "titles"));
    }
    const entries = [...groups.values()].flat();
    display(document.querySelector(".downloadcount"), entries, values => unique(values, "links"));
    display(document.querySelector(".symbolcount"), entries, values => unique(values, "symbols"));
    display(document.querySelector(".missingcount"), entries, missing);
}
