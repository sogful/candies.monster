import "/assets/static/js/buttons/index.js";
import {dropdown} from "/assets/static/js/controls/dropdown.js";
import {popup} from "/src/js/browser/popup.js";
import {exportpackage, openpackage, packageentries, packageicon, readentry, replacementkey, resizeicon} from "./package.js";
import {assetoutput, assettext, editasset, importasset, levelcatalog, packageassets, unitypackage} from "./cuttherope.js";
import {readreport, reportblob} from "./reports.js";
import {packageheader} from "./header.js";
import {clearlevel, renderlevel} from "./levelview.js";
import {levelart, levelpicker} from "./levelpicker.js";
import {spritebrowser} from "./spritebrowser.js";
import {resizablecolumns} from "./columns.js";
import {encodehintlevels} from "./hints.js";
import {decodelegacyhint, encodelegacyhint, legacyhintname} from "./legacyhints.js";
import {translation} from "./gamestrings.js";
import {previewtexture, replacetexture, texturename, textures} from "./sprites.js";

const find = selector => document.querySelector(selector);
const dropoverlay = find(".drag");
const editor = find(".editor");
const back = find(".pageback");
const picker = find(".pick");
const packageinput = find(".packageinput");
const previouspackage = find(".packageprevious");
const nextpackage = find(".packagenext");
const toolbuttons = [...document.querySelectorAll(".tool")];
const filelist = find(".filelist");
const formats = find(".reportformat");
const stringselect = find(".stringselect");
const localeselect = find(".localeselect");
const levelview = find(".levelview");
const spriteimage = find(".spriteimage");
const pagecount = 100;
const toolpanels = {symbols: ".analysis", levels: ".levelpanel", stringsgame: ".stringspanel", sprites: ".spritepanel"};

let sessions = [];
let current = -1;
let state;
let tool;
let working = false;
let report = [];
let reportname = "";
let resultpage = 0;
let stringmodel;
let spriteurl = "";
const pendingfiles = [];
let shownlevel;

for (const select of [filelist, formats, stringselect, localeselect]) dropdown(select);
const levelnav = levelpicker(find(".levelpicker"), level => {
    if (!level) {
        clearlevel(levelview);
        levelview.hidden = true;
        find(".levelfooter").hidden = true;
        shownlevel = undefined;
        synccontrols();
    } else void run(() => drawlevel(level));
});
const spritefiles = spritebrowser(find(".spritebrowser"), () => void run(drawsprite), () => clearsearch(".filtersprites"));
spritefiles.view("grid");
resizablecolumns(find(".resulttable"), [16, 20, 64]);
resizablecolumns(find(".stringtable"), [34, 66]);

const header = packageheader(find(".editorheader"), {
    change() {
        state.session.metadata = header.edits();
        synccontrols();
    },
    icon: file => void run(async () => {
        const preview = await resizeicon(file, 192, 192);
        Object.assign(state.session, {icon: file, preview});
        header.showicon(preview, true);
    }),
    reset() {
        Object.assign(state.session, {icon: null, preview: null});
        header.showicon(state.originalicon, false);
        synccontrols();
    },
    export: () => void run(exportchanges)
});

/*//////////////////////////////////////////////////////////////////////*/

function message(value = "") {
    const intake = !find(".intake").hidden;
    find(".pickprompt").hidden = intake && !!value;
    find(".pickprogress").hidden = !intake || !value;
    find(".pickprogress").textContent = intake ? value : "";
    find(".status").textContent = intake ? "" : value;
}

function displayerror(value = "") {
    const error = find(".error");
    error.textContent = value;
    error.hidden = !value;
}

async function run(task) {
    if (working) return;
    working = true;
    displayerror();
    synccontrols();
    try {
        await task();
    } catch (failure) {
        displayerror(failure?.message || String(failure));
    } finally {
        working = false;
        message();
        synccontrols();
        if (pendingfiles.length) startopening(pendingfiles.splice(0));
    }
}

function download(blob, name) {
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function options(select, rows, preferred = select.value) {
    select.replaceChildren(...rows.map(([label, value, secondary]) => {
        const option = new Option(label, value);
        if (secondary) option.dataset.secondary = "";
        return option;
    }));
    select.value = rows.some(row => row[1] === preferred) ? preferred : rows[0]?.[1] ?? "";
}

function availability(direction) {
    for (let index = current + direction; index >= 0 && index < sessions.length; index += direction) {
        if (!sessions[index].unreadable) return index;
    }
    return -1;
}

function unsaved(session) {
    const {saved, icon, replacements, strings, hints, metadata} = session;
    return !!(strings.size || hints.size || icon !== saved.icon || JSON.stringify(metadata) !== saved.metadata
        || replacements.size !== saved.replacements.size
        || [...replacements].some(([key, value]) => saved.replacements.get(key) !== value));
}

function synccontrols() {
    picker.disabled = working;
    find(".editorbody").inert = working;
    for (const button of toolbuttons) button.disabled = working;
    for (const control of [filelist, stringselect, localeselect]) control.disabled = working;
    for (const control of document.querySelectorAll(".importreport, .importlevel, .importsprite, .exportsprite, .resetsprite, .filterstrings, .filtersprites")) control.disabled = working;
    find(".downloadresults").disabled = working || !report.length;
    find(".importlevel").disabled = working || !shownlevel;
    find(".exportlevel").disabled = working || !shownlevel;
    find(".exportsprite").disabled = working || spriteimage.hidden;
    find(".importsprite").disabled = working || spriteimage.hidden;
    for (const control of document.querySelectorAll(".stringtable textarea")) control.readOnly = working;
    const showarrows = current >= 0 && sessions.filter(session => !session.unreadable).length > 1;
    previouspackage.hidden = nextpackage.hidden = !showarrows;
    previouspackage.disabled = working || availability(-1) < 0;
    nextpackage.disabled = working || availability(1) < 0;
    header.sync({working, canexport: !!state});
}

/*//////////////////////////////////////////////////////////////////////*/

function readable(value) {
    return value.replace(/(\d+)_(\d+)$/g, "$1 × $2").replace(/[_-]+/g, " ")
        .replace(/\b[a-z]/g, letter => letter.toUpperCase()).trim();
}

function distinctlabels(items, label) {
    const counts = new Map();
    return items.map((item, index) => {
        const name = label(item);
        const count = 1 + (counts.get(name) ?? 0);
        counts.set(name, count);
        return [count === 1 ? name : name + " " + count, String(index)];
    });
}

function sourcepriority(file, executable) {
    if (/\.(?:debug|sym|dwarf)(?:\.zst)?$/i.test(file.path) || /\/(?:DWARF|Symbols)\//i.test(file.path)) return 0;
    if (file.path === executable || /(?:^|\/)libctr[^/]*\.so$/i.test(file.path)) return 1;
    if (/\.(?:so|dylib|macho)$/i.test(file.path)) return 2;
    return 3;
}

function symbolfiles(files, executable) {
    return files.filter(file => file.path === executable || /\.(?:so(?:\.\d+)?|dylib|macho|dex|debug|sym|map)$/i.test(file.path)
        || /(?:^|\/)(?:SymbolMap(?:-32|-64)?|DWARF\/[^/]+|[^/]+\.framework\/[^/.]+)$/i.test(file.path))
        .sort((a, b) => sourcepriority(a, executable) - sourcepriority(b, executable));
}

function reportpriority(item) {
    if (!item.entries.length) return 4;
    if (/DWARF|STABS|Breakpad|debug/i.test(item.format)) return 0;
    if (/\.symtab|nlist/i.test(item.format)) return 1;
    if (/\.dynsym|export/i.test(item.format)) return 2;
    return 3;
}

function symbollabel(file) {
    if (file.path === state.pkg.metadata.executable) return "App executable";
    const arch = /\/(arm64-v8a|armeabi-v7a|armeabi|x86_64|x86)\//.exec(file.path)?.[1];
    const name = file.path.split("/").at(-1);
    return name.replace(/(?:^lib|\.(?:so|dylib)$)/g, "") + (arch ? " · " + arch : "");
}

function toolavailable(name) {
    return name === "levels" ? state.levels.length
        : name === "stringsgame" ? state.strings.length
        : name === "sprites" ? state.sprites.length : true;
}

async function showtool(name, preferences = {}) {
    tool = name;
    state.session.preferences.tool = tool;
    clearlevel(levelview);
    levelview.hidden = true;
    find(".levelfooter").hidden = true;
    shownlevel = undefined;
    clearsprite();
    stringmodel = undefined;
    for (const button of toolbuttons) {
        const active = button.dataset.tool === tool;
        button.setAttribute("aria-pressed", String(active));
        button.classList.toggle("gold", active);
    }
    for (const [entry, selector] of Object.entries(toolpanels)) find(selector).hidden = entry !== tool;
    const pages = find(toolpanels[tool] + " .pages");
    if (pages) pages.hidden = true;
    resultpage = 0;
    if (tool === "levels") {
        const choice = levelnav.load(state.levels, state.pkg.metadata.package, preferences.level, state.boxart);
        if (choice) await drawlevel(choice);
    } else if (tool === "stringsgame") {
        options(stringselect, distinctlabels(state.strings, stringlabel), preferences.strings);
        clearsearch(".filterstrings");
        await loadstrings(preferences.locale);
    } else if (tool === "sprites") {
        clearsearch(".filtersprites");
        spritefiles.load(state.sprites, preferences.sprite);
        if (selectedsprite()) await drawsprite();
    } else {
        const labels = distinctlabels(state.symbols, symbollabel);
        options(filelist, labels.map(([label, index]) => [
            label, index, sourcepriority(state.symbols[Number(index)], state.pkg.metadata.executable) >= 2
        ]), preferences.symbols);
        resetresults();
        if (filelist.value) await extracts();
    }
}

function pageitems(rows) {
    const last = Math.max(0, Math.ceil(rows.length / pagecount) - 1);
    resultpage = Math.min(last, Math.max(0, resultpage));
    const pager = find(toolpanels[tool] + " .pages");
    pager.hidden = !last;
    pager.querySelector(".previous").disabled = resultpage === 0;
    pager.querySelector(".next").disabled = resultpage === last;
    pager.querySelector(".pagetext").textContent = (resultpage + 1) + " / " + (last + 1);
    find(toolpanels[tool] + " .tablewrap")?.scrollTo(0, 0);
    return rows.slice(resultpage * pagecount, (resultpage + 1) * pagecount);
}

/*//////////////////////////////////////////////////////////////////////*/

function resetresults(value = "") {
    report = [];
    reportname = "";
    resultpage = 0;
    clearsearch(".filterresults");
    find(".filterresults").closest(".editorsearch").hidden = true;
    find(".formatslabel").hidden = true;
    find(".analysis .tablewrap").hidden = true;
    find(".analysis .pages").hidden = true;
    find(".resultstatus").textContent = value;
    find(".resulttable tbody").replaceChildren();
}

async function extracts() {
    resetresults();
    const file = state.symbols[Number(filelist.value)];
    if (!file) return;
    message("Reading symbols");
    const bytes = await readentry(file.entry);
    const worker = new Worker(new URL("./analysis.js", import.meta.url), {type: "module"});
    try {
        const result = await new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error("Reading symbols took longer than 60 seconds.")), 60000);
            worker.onmessage = ({data}) => {
                clearTimeout(timer);
                if (data.error) reject(new Error(data.error));
                else resolve(data.result);
            };
            worker.onerror = event => {clearTimeout(timer); reject(new Error(event.message || "Could not read symbols."))};
            worker.postMessage({kind: "symbols", bytes, filename: file.path}, [bytes.buffer]);
        });
        showreport(result, file.path.split("/").at(-1));
    } finally {
        worker.terminate();
    }
}

function showreport(reports, name) {
    report = [...reports].sort((a, b) => reportpriority(a) - reportpriority(b));
    reportname = name;
    if (!report.length) return resetresults("No supported symbol tables were found.");
    options(formats, report.map((item, index) => [
        [item.format, item.architecture].filter(Boolean).join(" · "), String(index),
        reportpriority(item) > reportpriority(report[0]) || reportpriority(item) >= 2
    ]), "0");
    formats.value = String(Math.max(0, report.findIndex(item => item.entries.length)));
    find(".formatslabel").hidden = report.length < 2;
    find(".filterresults").closest(".editorsearch").hidden = false;
    renderresults();
}

function renderresults() {
    const active = report[Number(formats.value)];
    if (!active) return;
    const query = find(".filterresults").value.trim().toLowerCase();
    const rows = query ? active.entries.filter(item => [item.name, item.address, item.type].some(value => String(value ?? "").toLowerCase().includes(query))) : active.entries;
    const fragment = document.createDocumentFragment();
    for (const entry of pageitems(rows)) {
        const row = document.createElement("tr");
        for (const value of [entry.address, entry.type, entry.name]) {
            const cell = document.createElement("td");
            cell.textContent = value ?? "";
            row.append(cell);
        }
        fragment.append(row);
    }
    find(".resulttable tbody").replaceChildren(fragment);
    find(".analysis .tablewrap").hidden = !rows.length;
    const count = query ? rows.length.toLocaleString() + " of " + active.entries.length.toLocaleString() : active.entries.length.toLocaleString();
    find(".resultstatus").textContent = [active.format, active.architecture, count + " symbols", ...active.notes].filter(Boolean).join(" · ");
}

/*//////////////////////////////////////////////////////////////////////*/

async function hintdata(level) {
    if (!level.numbered) return null;
    const first = state.assets.find(item => item.category === "hints" && item.scope === level.item.scope)
        || state.assets.find(item => item.category === "hints");
    if (!first) return null;
    const key = replacementkey(first);
    const {hints, replacements} = state.session;
    if (hints.has(key)) return {key, records: hints.get(key)};
    if (!state.hintcache.has(key)) {
        state.hintcache.set(key, JSON.parse(await assettext(first, replacements)));
    }
    return {key, records: state.hintcache.get(key)};
}

function changehints(data, level, replays) {
    const {box, level: number} = level;
    let record = data.records.find(record => record.box === box && record.level === number);
    if (!record) {
        record = {box, level: number, replays};
        const last = data.records.at(-1);
        const incomplete = last?.replays.some(replay => replay.expected > replay.events.length);
        data.records.splice(data.records.length - Number(!!incomplete), 0, record);
    } else record.replays = replays;
    state.session.hints.set(data.key, data.records);
    synccontrols();
}

async function legacyreplays(level) {
    const entries = state.legacy.filter(item => item.scope === level.item.scope && item.box === level.box && item.level === level.level);
    entries.sort((a, b) => a.scale - b.scale);
    const {replacements} = state.session;
    const replays = [];
    for (const item of entries) {
        const key = replacementkey(item);
        const bytes = replacements.get(key) ?? await readentry(item.entry);
        replays.push({...decodelegacyhint(bytes), label: item.scale + "×"});
    }
    return {entries, replays};
}

async function drawlevel(level = levelnav.selection()) {
    clearlevel(levelview);
    shownlevel = undefined;
    levelview.hidden = !level;
    find(".levelfooter").hidden = !level;
    if (!level) return;
    const xml = await assettext(level.item, state.session.replacements);
    const options = {xml, box: level.box ?? 1, packageid: state.pkg.metadata.package, boxart: state.boxart};
    try {
        const data = await hintdata(level);
        const matching = data?.records.find(record => record.box === level.box && record.level === level.level);
        const legacy = matching ? null : await legacyreplays(level);
        if (legacy?.replays.length) {
            options.hint = {replays: legacy.replays};
            options.onhintchange = (replays, index) => {
                const source = legacy.entries[index];
                if (!source) return;
                state.session.replacements.set(replacementkey(source), encodelegacyhint(replays[index]));
                synccontrols();
            };
        } else if (data) {
            options.hint = matching;
            options.onhintchange = replays => changehints(data, level, replays);
        }
    } catch (error) {
        displayerror(error.message);
    }
    if (options.onhintchange) {
        const fairy = state.sprites.find(item => /(?:^|\/)hint_firefly_480_800\./i.test(item.path))
            || state.sprites.find(item => /(?:^|\/)hint_firefly_hd\.png$/i.test(item.path))
            || state.sprites.find(item => /(?:^|\/)hint_firefly[^/]*\.(?:png|raw)(?:\.zst)?$/i.test(item.path));
        if (fairy) {
            state.fairy ??= previewtexture(fairy).then(value => value.arrayBuffer()).then(bytes => new Uint8Array(bytes)).catch(() => null);
            options.fairy = await state.fairy;
        }
    }
    await renderlevel(levelview, options);
    shownlevel = {level, xml};
}

/*//////////////////////////////////////////////////////////////////////*/

function stringlabel(item) {
    const name = item.path.split("/").at(-1).replace(/\.[^.]+$/, "");
    const locale = /(?:^|\/)([\w-]+)\.lproj\//i.exec(item.path)?.[1];
    const group = /SLAwards\.bundle/i.test(item.path) ? "Awards"
        : /^menu[_-]?strings$/i.test(name) ? "Menu" : readable(name);
    return group + (locale ? " · " + languagename(locale) : "");
}

function languagename(code) {
    if (!code) return "Default";
    try {
        return new Intl.DisplayNames(["en"], {type: "language"}).of(code === "br" ? "pt-BR" : code) || code;
    } catch {return code}
}

async function loadstrings(preferred) {
    const item = state.strings[Number(stringselect.value)];
    stringmodel = undefined;
    const body = find(".stringtable tbody");
    body.replaceChildren();
    find(".stringspanel .pages").hidden = true;
    if (!item) return;
    const key = replacementkey(item);
    const draft = state.session.strings.get(key);
    if (draft) {
        stringmodel = {...draft, key};
    } else {
        const text = await assettext(item, state.session.replacements);
        stringmodel = {key, model: translation(text, item.path), textformat: item.textformat};
    }
    options(localeselect, stringmodel.model.locales.map(locale => [languagename(locale), locale]), preferred);
    find(".translationlanguage").hidden = stringmodel.model.locales.length < 2;
    resultpage = 0;
    renderstrings();
}

function renderstrings() {
    if (!stringmodel) return;
    const query = find(".filterstrings").value.trim().toLowerCase();
    const rows = stringmodel.model.rows.filter(row =>
        row.locale === localeselect.value && (!query || row.key.toLowerCase().includes(query) || row.read().toLowerCase().includes(query)));
    const fragment = document.createDocumentFragment();
    for (const entry of pageitems(rows)) {
        const row = document.createElement("tr");
        const key = document.createElement("td");
        const value = document.createElement("td");
        const field = document.createElement("textarea");
        key.textContent = entry.key;
        field.rows = 1;
        field.title = entry.key;
        field.value = entry.read();
        field.addEventListener("input", () => {
            entry.write(field.value);
            state.session.strings.set(stringmodel.key, stringmodel);
            synccontrols();
        });
        value.append(field);
        row.append(key, value);
        fragment.append(row);
    }
    find(".stringtable tbody").replaceChildren(fragment);
}

/*//////////////////////////////////////////////////////////////////////*/

function clearsprite() {
    if (spriteurl) URL.revokeObjectURL(spriteurl);
    spriteurl = "";
    spriteimage.hidden = true;
    spriteimage.removeAttribute("src");
}

function selectedsprite() {
    return state.sprites[spritefiles.selection()];
}

async function drawsprite() {
    clearsprite();
    find(".resetsprite").hidden = true;
    const sprite = selectedsprite();
    if (!sprite) return;
    const {replacements} = state.session;
    const blob = await previewtexture(sprite, replacements);
    spriteimage.alt = sprite.label;
    spriteurl = URL.createObjectURL(blob);
    spriteimage.src = spriteurl;
    spriteimage.hidden = false;
    find(".resetsprite").hidden = !sprite.parts.some(part => replacements.has(replacementkey(part)));
}

/*//////////////////////////////////////////////////////////////////////*/

async function exportchanges() {
    const {pkg, assets, session} = state;
    const {metadata, icon, strings, hints} = session;
    const changes = new Map(session.replacements);
    for (const item of assets) {
        const key = replacementkey(item);
        if (strings.has(key)) {
            const draft = strings.get(key);
            changes.set(key, editasset({...item, textformat: draft.textformat}, draft.model.serialize()));
        }
        if (hints.has(key)) changes.set(key, encodehintlevels(hints.get(key)));
    }
    const edited = changes.size || icon || Object.keys(metadata).length;
    if (edited) message("Preparing export");
    const blob = edited ? await exportpackage(pkg.file, metadata, icon, changes, message) : pkg.file;
    download(blob, edited ? pkg.file.name.replace(/\.[^.]+$/, "") + "-edited." + pkg.extension : pkg.file.name);
    session.saved = {metadata: JSON.stringify(metadata), icon, replacements: new Map(changes)};
    session.replacements = changes;
    strings.clear();
    hints.clear();
}

function savepreferences() {
    if (!state) return;
    state.session.preferences = {
        tool, level: levelnav.selection()?.index,
        strings: stringselect.value, locale: localeselect.value, sprite: spritefiles.selection(), symbols: filelist.value
    };
}

async function loadpackage(index) {
    const session = sessions[index];
    const suffix = sessions.length > 1 ? " " + (index + 1) + " of " + sessions.length : "";
    const progress = status => message(/^\d/.test(status) ? "Loading package" + suffix + " · " + status : status);
    message("Loading package" + suffix);
    let pkg;
    try {pkg = await openpackage(session.file, progress)}
    catch (error) {
        session.unreadable = true;
        throw new Error(session.file.name + ": " + error.message);
    }
    savepreferences();
    const files = packageentries(pkg);
    const unity = unitypackage(files);
    const assets = unity ? [] : packageassets(pkg, files);
    const hidelevels = /(?:^|\.)(?:ctr2|ctrm|ctrmagic|cuttherope2|cuttheropemagic)(?:\.|$)/i.test(pkg.metadata.package)
        || /^cut the rope(?:\s*:\s*|\s+)(?:2|magic)(?:\b|$)/i.test(pkg.metadata.title || "");
    const originalicon = await packageicon(pkg).catch(() => null);
    state = {
        pkg, session, assets, originalicon, hintcache: new Map(),
        levels: hidelevels ? [] : await levelcatalog(assets), sprites: unity ? [] : textures(files, pkg),
        strings: assets.filter(item => item.category === "stringsgame").sort((a, b) => stringlabel(a).localeCompare(stringlabel(b))),
        symbols: unity ? [] : symbolfiles(files, pkg.metadata.executable),
        legacy: unity ? [] : files.flatMap(file => {
            const name = legacyhintname(file.path);
            return name ? [{...file, ...name}] : [];
        })
    };
    state.boxart = levelart(pkg.metadata.package, state.sprites, () => session.replacements);
    current = index;
    editor.hidden = false;
    find(".intake").hidden = true;
    back.querySelector("img").alt = "Back to package selection";
    header.load(pkg, session.preview ?? originalicon, session.metadata, !!session.icon);
    find(".editorbody").hidden = unity;
    find(".unitymessage").hidden = !unity;
    if (unity) {
        levelnav.clear();
        clearlevel(levelview);
        spritefiles.clear();
        clearsprite();
        shownlevel = undefined;
        stringmodel = undefined;
        resetresults();
        return;
    }
    for (const button of toolbuttons) button.hidden = !toolavailable(button.dataset.tool);
    const preferences = session.preferences;
    const preferred = preferences.tool && toolavailable(preferences.tool) ? preferences.tool : toolbuttons.find(button => !button.hidden).dataset.tool;
    await showtool(preferred, preferences);
}

function startopening(files) {
    if (!files.length) return;
    if (working) {
        pendingfiles.push(...files);
        return;
    }
    const start = sessions.length;
    sessions.push(...files.map(file => ({
        file, metadata: {}, icon: null, preview: null, preferences: {}, replacements: new Map(),
        strings: new Map(), hints: new Map(), saved: {metadata: "{}", icon: null, replacements: new Map()}
    })));
    void run(async () => {
        let failure;
        for (let index = start; index < sessions.length; index++) {
            try {await loadpackage(index); return}
            catch (error) {
                if (!sessions[index].unreadable) throw error;
                failure = error;
            }
        }
        if (!state) sessions = [];
        throw failure;
    });
}

async function switchpackage(direction) {
    let index = availability(direction);
    let failure;
    while (index >= 0 && index < sessions.length) {
        if (!sessions[index].unreadable) {
            try {await loadpackage(index); return}
            catch (error) {
                if (!sessions[index].unreadable) throw error;
                failure = error;
            }
        }
        index += direction;
    }
    if (failure) throw failure;
}

function closepackage() {
    sessions = [];
    current = -1;
    state = undefined;
    tool = undefined;
    header.clear();
    levelnav.clear();
    spritefiles.clear();
    clearlevel(levelview);
    clearsprite();
    shownlevel = undefined;
    stringmodel = undefined;
    find(".stringtable tbody").replaceChildren();
    resetresults();
    displayerror();
    back.querySelector("img").alt = "Back";
    editor.hidden = true;
    find(".intake").hidden = false;
    synccontrols();
    picker.focus();
}

function backdialog() {
    const {actions, open, close} = popup(back, "Discard unsaved changes?");
    for (const [label, action] of [["Keep editing", close], ["Discard changes", () => {close(); closepackage()}]]) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "membershipbutton descbutton clickable";
        button.textContent = label;
        button.addEventListener("click", action);
        actions.append(button);
    }
    open();
}

function press() {
    const sound = find(".click");
    sound.currentTime = 0;
    void sound.play().catch(() => {});
}

/*//////////////////////////////////////////////////////////////////////*/

back.addEventListener("click", event => {
    if (!state && !working || event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (working) return;
    press();
    if (sessions.some(unsaved)) backdialog();
    else closepackage();
}, {capture: true});

document.addEventListener("click", event => {
    const control = event.target.closest("button, a[href]");
    if (control && control !== back && !control.disabled && control.getAttribute("aria-disabled") !== "true") press();
}, {capture: true});
window.addEventListener("beforeunload", event => {
    if (!sessions.some(unsaved)) return;
    event.preventDefault();
    event.returnValue = true;
});

picker.addEventListener("click", () => packageinput.click());
packageinput.addEventListener("change", () => {
    const files = [...packageinput.files];
    packageinput.value = "";
    startopening(files);
});
previouspackage.addEventListener("click", () => void run(() => switchpackage(-1)));
nextpackage.addEventListener("click", () => void run(() => switchpackage(1)));
for (const button of toolbuttons) {
    button.addEventListener("click", () => {
        if (tool === button.dataset.tool) return;
        savepreferences();
        void run(() => showtool(button.dataset.tool, state.session.preferences));
    });
}

filelist.addEventListener("change", () => void run(extracts));
find(".importreport").addEventListener("click", () => find(".reportinput").click());
find(".reportinput").addEventListener("change", event => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    void run(async () => {
        const fresh = await readreport("symbols", file);
        resetresults();
        showreport(fresh, file.name.replace(/(?:\.symbols)?\.(?:json|tsv)$/i, ""));
    });
});
find(".downloadresults").addEventListener("click", () => {
    if (report.length) download(reportblob("symbols", report), reportname + ".symbols.json");
});

function filterresults() {
    resultpage = 0;
    renderresults();
}
formats.addEventListener("change", filterresults);
find(".filterresults").addEventListener("input", filterresults);
for (const button of document.querySelectorAll(".pages button")) {
    button.addEventListener("click", () => {
        resultpage += button.classList.contains("previous") ? -1 : 1;
        if (tool === "symbols") renderresults();
        else if (tool === "stringsgame") renderstrings();
    });
}

find(".importlevel").addEventListener("click", () => find(".levelinput").click());
find(".levelinput").addEventListener("change", event => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file || !shownlevel) return;
    void run(async () => {
        const {item} = shownlevel.level;
        const xml = await importasset(item, file);
        const document = new DOMParser().parseFromString(xml, "application/xml");
        if (document.documentElement.localName !== "map") throw new Error("Choose a level XML file with a map element.");
        state.session.replacements.set(replacementkey(item), editasset(item, xml));
        await drawlevel();
    });
});
find(".exportlevel").addEventListener("click", () => void run(() => {
    if (!shownlevel) return;
    const {blob, name} = assetoutput(shownlevel.level.item, shownlevel.xml);
    download(blob, name);
}));

stringselect.addEventListener("change", () => void run(() => loadstrings()));
for (const [control, event] of [[localeselect, "change"], [find(".filterstrings"), "input"]]) {
    control.addEventListener(event, () => {resultpage = 0; renderstrings()});
}

for (const mode of ["grid", "list"]) {
    const button = find(".sprite" + mode);
    button.addEventListener("click", () => {
        spritefiles.view(mode);
        for (const name of ["grid", "list"]) {
            const control = find(".sprite" + name);
            control.classList.toggle("gold", mode === name);
            control.setAttribute("aria-pressed", String(mode === name));
        }
    });
}
find(".spritegrid").classList.add("gold");
find(".filtersprites").addEventListener("input", event => spritefiles.search(event.target.value));
find(".importsprite").addEventListener("click", () => find(".spriteinput").click());
find(".spriteinput").addEventListener("change", event => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file || !selectedsprite()) return;
    void run(async () => {
        for (const [key, bytes] of await replacetexture(selectedsprite(), file)) state.session.replacements.set(key, bytes);
        await drawsprite();
    });
});
find(".exportsprite").addEventListener("click", () => void run(async () => {
    const item = selectedsprite();
    if (item) download(await previewtexture(item, state.session.replacements), texturename(item));
}));
find(".resetsprite").addEventListener("click", () => void run(async () => {
    for (const part of selectedsprite().parts) state.session.replacements.delete(replacementkey(part));
    await drawsprite();
}));

function clearsearch(selector) {
    const input = find(selector);
    input.value = "";
    input.closest(".editorsearch").querySelector(".searchclear").hidden = true;
}

for (const search of document.querySelectorAll(".editorsearch")) {
    const input = search.querySelector(".archivequery");
    const clear = search.querySelector(".searchclear");
    input.addEventListener("input", () => {clear.hidden = !input.value});
    clear.addEventListener("click", () => {
        input.value = "";
        input.dispatchEvent(new Event("input", {bubbles: true}));
        input.focus();
    });
}

function showdrag(event) {
    if (!event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
    dropoverlay.classList.add("visible");
}

document.addEventListener("dragenter", showdrag);
document.addEventListener("dragover", showdrag);
document.addEventListener("dragleave", event => {
    if (!event.relatedTarget && (event.target === document || event.target === document.documentElement
        || event.clientX <= 0 || event.clientY <= 0 || event.clientX >= innerWidth || event.clientY >= innerHeight)) {
        dropoverlay.classList.remove("visible");
    }
});
document.addEventListener("drop", event => {
    if (!event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
    dropoverlay.classList.remove("visible");
    startopening([...event.dataTransfer.files]);
});
