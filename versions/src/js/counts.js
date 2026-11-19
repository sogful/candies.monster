import {hasdownload} from "./catalogue/load.js";

const platforms = new Map();

/*//////////////////////////////////////////////////////////////////////*/

export function updatecounts(layer, name, cache) {
    let available = 0;
    let missing = 0;
    const symbols = new Set();
    if (cache) {
        for (const versions of cache.values()) {
            for (const version of versions) {
                if (hasdownload(version.downloads)) available++;
                else missing++;
                for (const download of version.downloads) {
                    if (download.kind === "symbols" && download.url) symbols.add(download.url);
                }
            }
        }
    }
    const element = document.querySelector(`[data-counts="${layer}"] .${name}count`);
    if (element) element.textContent = cache ? available : "unavailable";
    platforms.set(layer + "/" + name, cache ? {missing, symbols} : null);
    const ios = platforms.get("omnom/ios");
    const android = platforms.get("omnom/android");
    const symbolcount = document.querySelector(".symbolcount");
    const missingcount = document.querySelector(".missingcount");
    if (symbolcount) symbolcount.textContent = ios && android ? new Set([...platforms.values()].flatMap(item => item ? [...item.symbols] : [])).size : "...";
    if (missingcount) missingcount.textContent = ios && android ? ios.missing + android.missing : "...";
}
