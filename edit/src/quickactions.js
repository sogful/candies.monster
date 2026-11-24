import {popup} from "/src/js/browser/popup.js";
import {openpackage, packageentries, readentry, replacementkey} from "./package.js";
import {editasset, packageassets} from "./cuttherope.js";

import {debugsymbols, readsymbols, symbolfiles} from "./symbolreports.js";

function uniquesegment(name, used) {
    let result = name;
    let number = 2;
    while (used.has(result.toLowerCase())) result = name + " (" + number++ + ")";
    used.add(result.toLowerCase());
    return result;
}

function entrypath(pkg, file) {
    const part = pkg.parts[file.scope]?.name;
    return part ? part + "/" + file.path : file.path;
}

async function stringbytes(file, session) {
    const key = replacementkey(file);
    const draft = session.strings.get(key);
    if (draft) return editasset({...file, textformat: draft.textformat}, draft.model.serialize());
    const restored = session.restoredstrings?.get(key);
    if (restored) return editasset({...file, textformat: restored.textformat}, restored.text);
    return session.replacements.get(key) ?? await readentry(file.entry);
}

const actions = [
    ["strings", "Extract all strings", "No game strings were found."],
    ["debug-symbols", "Extract debug symbols", "No debug symbols were found."],
    ["symbols", "Extract all symbols", "No symbols were found."]
];
const concurrentlimit = 160 * 1024 * 1024;

async function sources(session, prepared) {
    const pkg = prepared?.pkg ?? await openpackage(session.file);
    const entries = prepared?.entries ?? packageentries(pkg);
    return {
        pkg,
        strings: packageassets(pkg, entries).filter(file => file.category === "stringsgame"),
        symbols: symbolfiles(entries, pkg.metadata.executable)
    };
}

async function matchingreports(file) {
    return (await readsymbols(file)).filter(report => report.entries.length);
}

async function extract(mode, sessions, message, download, packageinfo) {
    const zip = new globalThis.JSZip();
    const folders = new Set();
    const failures = [];
    let count = 0;
    for (const [index, session] of sessions.entries()) {
        const name = session.file.name.replace(/[\\/:]/g, "_");
        message("Extracting " + name + " (" + (index + 1) + " of " + sessions.length + ")");
        const folder = uniquesegment(name, folders);
        try {
            const {pkg, strings, symbols} = await sources(session, packageinfo(session));
            const files = mode === "strings" ? strings : symbols;
            for (const file of files) {
                try {
                    const path = folder + "/" + entrypath(pkg, file);
                    if (mode === "strings") zip.file(path, await stringbytes(file, session));
                    else {
                        const all = await matchingreports(file);
                        const reports = mode === "debug-symbols" ? all.filter(debugsymbols) : all;
                        if (!reports.length) continue;
                        zip.file(path + ".symbols.json", JSON.stringify({kind: "symbols", version: 1, reports}, null, 2));
                    }
                    count++;
                } catch (error) {
                    failures.push(name + "/" + entrypath(pkg, file) + " (" + error.message + ")");
                }
            }
        } catch (error) {
            failures.push(name + " (" + error.message + ")");
        }
    }
    if (!count) {
        const empty = actions.find(([kind]) => kind === mode)[2];
        throw new Error(failures.length ? empty + " " + failures[0] : empty);
    }
    if (failures.length) zip.file("Skipped files.txt", failures.join("\n"));
    message("Preparing download");
    download(await zip.generateAsync({type: "blob", compression: "DEFLATE"}), mode + ".zip");
}

/*//////////////////////////////////////////////////////////////////////*/

const explosionart = "/assets/images/edit/explosion.gif";
const explosionsound = "/assets/audio/edit/explosion.wav";

async function explode(save, leave, sound) {
    const image = document.createElement("img");
    image.className = "editorexplosion";
    image.alt = "";
    image.src = explosionart;
    document.body.append(image);
    sound.currentTime = 0;
    void sound.play().catch(() => {});
    const cleanup = () => {
        image.remove();
        sound.pause();
    };
    try {
        await Promise.all([save(), new Promise(resolve => setTimeout(resolve, 750))]);
    } catch (error) {
        cleanup();
        throw error;
    }
    window.addEventListener("pagehide", cleanup, {once: true});
    leave();
}

export function quickactions(header, {sessions, run, message, download, save, leave, packageinfo}) {
    const sound = new Audio(explosionsound);
    sound.preload = "auto";
    const cached = new WeakMap();
    let scanning = false;
    let scheduled = false;
    let shown;
    const slot = document.createElement("div");
    slot.className = "headerquickslot";
    const next = header.querySelector(".headernext");
    const button = document.createElement("button");
    button.className = "headerquick buttonart green clickable";
    button.type = "button";
    button.textContent = "Quick actions";
    button.setAttribute("aria-expanded", "false");
    next.before(slot);
    slot.append(button, next);

    function showcounts() {
        if (!shown?.dialog.open) return;
        for (const [mode, label] of actions) {
            const values = shown.batch.map(session => cached.get(session)?.[mode]);
            if (values.some(value => value === undefined)) continue;
            const count = values.reduce((sum, value) => sum + value, 0);
            const item = shown.buttons.get(mode);
            item.textContent = label + " (" + count.toLocaleString() + ")";
            item.title = count.toLocaleString() + (count === 1 ? " matching file" : " matching files");
            item.disabled = count === 0;
        }
    }

    async function countpackage(session) {
        const files = await sources(session, packageinfo(session)).catch(() => null);
        const counts = {strings: files?.strings.length ?? 0, symbols: 0, "debug-symbols": 0};
        cached.set(session, {strings: counts.strings});
        showcounts();
        for (const file of files?.symbols ?? []) {
            if (!sessions().includes(session)) break;
            const result = await readsymbols(file, "symbolmatches").catch(() => null);
            if (result?.symbols) counts.symbols++;
            if (result?.debug) counts["debug-symbols"]++;
        }
        cached.set(session, counts);
        showcounts();
    }

    async function preload() {
        if (scanning || button.disabled) return;
        scanning = true;
        try {
            while (!button.disabled) {
                const [first, second] = sessions().filter(session => !cached.has(session));
                if (!first) break;
                const parallel = second && first.file.size + second.file.size <= concurrentlimit;
                await Promise.all((parallel ? [first, second] : [first]).map(countpackage));
            }
        } finally {
            scanning = false;
        }
    }

    button.addEventListener("click", () => {
        const menu = popup(button, "What would you like to do for all imported games?");
        menu.dialog.classList.add("quickactionmenu");
        const batch = [...sessions()];
        const buttons = new Map();
        for (const [mode, label, action] of [
            ...actions.map(([mode, label]) => [mode, label, () => extract(mode, batch, message, download, packageinfo)]),
            ["", "Destroy everything!!!", () => explode(save, leave, sound)]
        ]) {
            const item = document.createElement("button");
            item.className = "membershipbutton descbutton clickable";
            item.type = "button";
            item.textContent = mode ? label + " (...)" : label;
            item.addEventListener("click", () => {
                menu.close();
                void run(action);
            });
            if (mode) buttons.set(mode, item);
            menu.actions.append(item);
        }
        shown = {dialog: menu.dialog, batch, buttons};
        menu.dialog.addEventListener("close", () => {
            if (shown?.dialog === menu.dialog) shown = undefined;
        }, {once: true});
        menu.open();
        showcounts();
        void preload();
    });
    return working => {
        button.disabled = working;
        if (working || scanning || scheduled || sessions().every(session => cached.has(session))) return;
        scheduled = true;
        const prepare = () => {
            scheduled = false;
            void preload();
        };
        if (window.requestIdleCallback) window.requestIdleCallback(prepare, {timeout: 250});
        else setTimeout(prepare, 0);
    };
}
