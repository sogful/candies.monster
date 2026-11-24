import {readentry} from "./package.js";

export {debugsymbols} from "./reports.js";

export function sourcepriority(file, executable) {
    if (/\.(?:debug|sym|dwarf)(?:\.zst)?$/i.test(file.path) || /\/(?:DWARF|Symbols)\//i.test(file.path)) return 0;
    if (file.path === executable || /(?:^|\/)libctr[^/]*\.so$/i.test(file.path)) return 1;
    if (/\.(?:so|dylib|macho)$/i.test(file.path)) return 2;
    return 3;
}

export function symbolfiles(files, executable) {
    return files.filter(file => file.path === executable || /\.(?:so(?:\.\d+)?|dylib|macho|dex|debug|sym|map)$/i.test(file.path)
        || /(?:^|\/)(?:SymbolMap(?:-32|-64)?|DWARF\/[^/]+|[^/]+\.framework\/[^/.]+)$/i.test(file.path))
        .sort((a, b) => sourcepriority(a, executable) - sourcepriority(b, executable));
}

export async function readsymbols(file, kind = "symbols") {
    const bytes = await readentry(file.entry);
    const worker = new Worker(new URL("./analysis.js", import.meta.url), {type: "module"});
    let timer;
    try {
        return await new Promise((resolve, reject) => {
            timer = setTimeout(() => reject(new Error("Reading symbols took longer than 60 seconds.")), 60000);
            worker.onmessage = ({data}) => {
                if (data.error) reject(new Error(data.error));
                else resolve(data.result);
            };
            worker.onerror = event => reject(new Error(event.message || "Could not read symbols."));
            worker.postMessage({kind, bytes, filename: file.path}, [bytes.buffer]);
        });
    } finally {
        clearTimeout(timer);
        worker.terminate();
    }
}
