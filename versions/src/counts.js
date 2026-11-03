import {hasdownload} from "./load.js";

const platforms = new Map();

/*//////////////////////////////////////////////////////////////////////*/

export function updatecounts(name, cache) {
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
    platforms.set(name, cache ? {available, missing, symbols} : null);
    for (const name of ["ios", "android"]) {
        const element = document.querySelector(`.${name}count`);
        if (element) element.textContent = platforms.has(name) ? platforms.get(name)?.available ?? "unavailable" : "...";
    }
    const ios = platforms.get("ios");
    const android = platforms.get("android");
    const symbolcount = document.querySelector(".symbolcount");
    const missingcount = document.querySelector(".missingcount");
    if (symbolcount) symbolcount.textContent = ios && android ? new Set([...ios.symbols, ...android.symbols]).size : "...";
    if (missingcount) missingcount.textContent = ios && android ? ios.missing + android.missing : "...";
}
