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
    if (layer !== "omnom") return;

    platforms.set(name, cache ? {missing, symbols} : null);
    const ios = platforms.get("ios");
    const android = platforms.get("android");
    const symbolcount = document.querySelector(".symbolcount");
    const missingcount = document.querySelector(".missingcount");
    if (symbolcount) symbolcount.textContent = ios && android ? new Set([...ios.symbols, ...android.symbols]).size : "...";
    if (missingcount) missingcount.textContent = ios && android ? ios.missing + android.missing : "...";
}
