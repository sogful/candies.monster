import {languageflag, languagename} from "./src/flags.js";
import {distinctfiles, loadbatch, storebatch, storebatchedits} from "./src/batch.js";
import "/assets/static/js/buttons/index.js";
import {dropdown} from "/assets/static/js/controls/dropdown.js";
import {popup} from "/src/js/browser/popup.js";
import {exportpackage, openpackage, packageentries, packageicon, packageicons, readentry, replacementkey, resizeicon} from "./src/package.js";
import {assetoutput, assettext, editasset, importasset, levelcatalog, packageassets, unitypackage} from "./src/cuttherope.js";
import {readreport, reportblob} from "./src/reports.js";
import {packageheader} from "./src/header.js";
import {quickactions} from "./src/quickactions.js";
import {debugsymbols, readsymbols, sourcepriority, symbolfiles} from "./src/symbolreports.js";
import {clearlevel, renderlevel} from "./src/levelview.js";
import {levelart, levelpicker} from "./src/levelpicker.js";
import {spritebrowser} from "./src/spritebrowser.js";
import {mediapanel} from "./src/mediapanel.js";
import {overlayreserve, resizablecolumns} from "./src/columns.js";
import {encodehintlevels} from "./src/hints.js";
import {decodelegacyhint, legacyhintname} from "./src/legacyhints.js";
import {translation} from "./src/gamestrings.js";
import {mediaentries, textures} from "./src/sprites.js";

const find = selector => document.querySelector(selector);
const dropoverlay = find(".drag");
const editor = find(".editor");
const back = find(".pageback");
const picker = find(".pick");
const packageinput = find(".packageinput");

const toolbuttons = [...document.querySelectorAll(".tool")];
const filelist = find(".filelist");
const formats = find(".reportformat");
const stringselect = find(".stringselect");
const localeselect = find(".localeselect");
const levelview = find(".levelview");
const pagecount = 100;
const toolpanels = {symbols: ".analysis", levels: ".levelpanel", strings: ".stringspanel", sprites: ".spritepanel"};

let sessions = [];
let current = -1;
let state;
let tool;
let working = false;
let departing = false;
let batchwrite = Promise.resolve("");
let report = [];
let reportname = "";
let resultpage = 0;
let stringmodel;
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
const spritefiles = spritebrowser(find(".spritebrowser"), () => void run(media.draw), () => clearsearch(".filtersprites"),
    item => item.parts?.some(part => state?.session.replacements.has(replacementkey(part))));
const media = mediapanel(find(".spritepanel"), {
    current: () => ({selected: selectedsprite(), entries: state.files, replacements: state.session.replacements}),
    run, download, press, refresh: () => spritefiles.refresh()
});
const refreshfooters = overlayreserve(find(".editorcontent"));
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
    previous: () => void run(() => switchpackage(-1)),
    next: () => void run(() => switchpackage(1)),
    close: button => {
        if (sessions.some(unsaved)) backdialog(button ?? find(".headerclose"));
        else closepackage();
    },
    downloadicons: () => void run(async () => {
        const {pkg, session} = state;
        download(await packageicons(pkg, session.icon), pkg.file.name.replace(/\.[^.]+$/, "") + "-icons.zip");
    }),
    export: () => void run(exportchanges)
});
const syncquickactions = quickactions(find(".editorheader"), {
    sessions: () => sessions, run, message, download,
    packageinfo: session => state?.session === session ? {pkg: state.pkg, entries: state.files} : undefined,
    save: async () => {
        savepreferences();
        try {
            const id = await batchwrite;
            if (!id || !await storebatchedits(sessions, current, id)) await storebatch(sessions, current);
        }
        catch {throw new Error("The browser could not save this batch for reload.")}
    },
    leave() {
        departing = true;
        location.assign("/");
    }
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
        refreshfooters();
        updateurl();
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
    return !!(strings.size || session.restoredstrings.size || hints.size || icon !== saved.icon || JSON.stringify(metadata) !== saved.metadata
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
    media.sync(working);
    syncquickactions(working);
    for (const control of document.querySelectorAll(".stringtable textarea")) control.readOnly = working;
    header.sync({
        working, canexport: !!state, multiple: current >= 0 && sessions.filter(session => !session.unreadable).length > 1,
        previous: availability(-1) >= 0, next: availability(1) >= 0
    });
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

function reportpriority(item) {
    if (!item.entries.length) return 4;
    if (debugsymbols(item)) return 0;
    if (/\.symtab|nlist/i.test(item.format)) return 1;
    if (/\.dynsym|export/i.test(item.format)) return 2;
    return 3;
}

function symbollabel(file) {
    if (file.path === state.pkg.metadata.executable) return "App executable";
    const arch = /\/(arm64-v8a|armeabi-v7a|armeabi|x86_64|x86)\//.exec(file.path)?.[1];
    const name = file.path.split("/").at(-1);
    return name.replace(/(?:^lib|\.(?:so|dylib)$)/g, "") + (arch ? " (" + arch + ")" : "");
}

function toolavailable(name) {
    if (!Object.hasOwn(toolpanels, name)) return false;
    return name === "levels" ? state.levels.length
        : name === "strings" ? state.strings.length
        : name === "sprites" ? state.media.length : state.symbols.length;
}

async function showtool(name, preferences = {}) {
    tool = name;
    const restore = preferences.tool === tool;
    clearlevel(levelview);
    levelview.hidden = true;
    find(".levelfooter").hidden = true;
    shownlevel = undefined;
    media.clear();
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
        const choice = levelnav.load(state.levels, state.pkg.metadata.package, preferences.level, state.boxart, level => state.session.hintlevels.has(level.index) || state.session.replacements.has(replacementkey(level.item)));
        if (choice) await drawlevel(choice);
    } else if (tool === "strings") {
        options(stringselect, distinctlabels(state.strings, stringlabel), preferences.strings);
        for (const option of stringselect.options) {
            const key = replacementkey(state.strings[Number(option.value)]);
            option.toggleAttribute("data-modified", !!state.session.stringchanges.get(key)?.size);
        }
        clearsearch(".filterstrings");
        await loadstrings(preferences.locale);
    } else if (tool === "sprites") {
        clearsearch(".filtersprites");
        spritefiles.load(state.media, preferences.sprite, preferences.media);
        if (selectedsprite()) await media.draw();
    } else {
        const labels = distinctlabels(state.symbols, symbollabel);
        options(filelist, labels.map(([label, index]) => [
            label, index, sourcepriority(state.symbols[Number(index)], state.pkg.metadata.executable) >= 2
        ]), preferences.symbols);
        resetresults();
        if (filelist.value) await extracts(preferences.format);
    }
    if (restore) {
        const search = find(toolpanels[tool] + " .editorsearch input");
        if (search && preferences.search) {
            search.value = preferences.search;
            search.dispatchEvent(new Event("input"));
        }
        resultpage = Number(preferences.page) || 0;
        if (tool === "symbols") renderresults();
        if (tool === "strings") renderstrings();
    }
}

function pageitems(rows) {
    const last = Math.max(0, Math.ceil(rows.length / pagecount) - 1);
    resultpage = Math.min(last, Math.max(0, resultpage));
    const pager = find(toolpanels[tool] + " .pages");
    pager.hidden = !last;
    refreshfooters();
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

async function extracts(preferred) {
    resetresults();
    const file = state.symbols[Number(filelist.value)];
    if (!file) return;
    message("Reading symbols");
    showreport(await readsymbols(file), file.path.split("/").at(-1), preferred);
}

function showreport(reports, name, preferred) {
    report = [...reports].sort((a, b) => reportpriority(a) - reportpriority(b));
    reportname = name;
    if (!report.length) return resetresults("No supported symbol tables were found.");
    options(formats, report.map((item, index) => [
        item.format + (item.architecture ? " (" + item.architecture + ")" : ""), String(index),
        reportpriority(item) > reportpriority(report[0]) || reportpriority(item) >= 2
    ]), "0");
    formats.value = preferred && report[Number(preferred)]?.entries.length ? preferred : String(Math.max(0, report.findIndex(item => item.entries.length)));
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
    find(".resultstatus").textContent = active.format + " (" + [active.architecture, count + " symbols"].filter(Boolean).join(", ") + ")" + (active.notes.length ? " " + active.notes.join(" ") : "");
}

/*//////////////////////////////////////////////////////////////////////*/

async function hintdata(level) {
    if (!level.numbered) return null;
    const first = state.assets.find(item => item.category === "hints" && item.scope === level.item.scope)
        || state.assets.find(item => item.category === "hints");
    if (!first) return null;
    const key = replacementkey(first);
    const {hints, replacements} = state.session;
    if (hints.has(key)) return hints.get(key);
    if (!state.hintcache.has(key)) {
        state.hintcache.set(key, JSON.parse(await assettext(first, replacements)));
    }
    return state.hintcache.get(key);
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
    return replays;
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
        const records = await hintdata(level);
        const matching = records?.find(record => record.box === level.box && record.level === level.level);
        options.replays = matching?.replays.some(replay => replay.events.length) ? matching.replays : await legacyreplays(level);
    } catch (error) {
        displayerror(error.message);
    }
    await renderlevel(levelview, options);
    shownlevel = {level, xml};
}

/*//////////////////////////////////////////////////////////////////////*/

function stringlabel(item) {
    const name = item.path.split("/").at(-1).replace(/\.[^.]+$/, "");
    const group = /SLAwards\.bundle/i.test(item.path) ? "Awards"
        : /^menu[_-]?strings$/i.test(name) ? "Menu" : readable(name);
    return group;
}

function clearflags() {
    find(".stringflag").replaceChildren();
    find(".stringflag").hidden = true;
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
        const restored = state.session.restoredstrings.get(key);
        const text = restored?.text ?? await assettext(item, state.session.replacements);
        stringmodel = {key, model: translation(text, item.path), textformat: restored?.textformat ?? item.textformat};
    }
    const {stringoriginals, stringchanges} = state.session;
    if (!stringoriginals.has(key)) stringoriginals.set(key, stringmodel.model.rows.map(row => row.read()));
    stringmodel.originals = stringoriginals.get(key);
    stringmodel.changes = stringchanges.get(key) ?? new Set();
    stringchanges.set(key, stringmodel.changes);
    const locales = stringmodel.model.locales;
    options(localeselect, locales.map(locale => [languagename(locale), locale]), preferred);
    const marker = find(".stringflag");
    marker.replaceChildren();
    marker.hidden = locales.length !== 1;
    find(".translationlanguage").hidden = locales.length < 2;
    const filelocale = /(?:^|\/)([\w-]+)\.lproj\//i.exec(item.path)?.[1]
        ?? /gl_wp_string_([a-z]+(?:_[a-z]+)?)\.xml$/i.exec(item.path)?.[1].toLowerCase().replace("_latam", "-419").replace("_", "-")
        ?? "";
    for (const option of localeselect.options) {
        const locale = option.value || filelocale;
        const url = languageflag(locale);
        if (url) option.dataset.flag = url;
    }
    if (!marker.hidden) {
        const option = localeselect.options[0];
        marker.title = languagename(option.value || filelocale);
        if (option.dataset.flag) {
            const image = document.createElement("img");
            image.className = "flagart";
            image.alt = marker.title;
            image.src = option.dataset.flag;
            marker.append(image);
        } else marker.textContent = "(" + marker.title + ")";
    }
    resultpage = 0;
    renderstrings();
}

function renderstrings() {
    if (!stringmodel) return;
    const query = find(".filterstrings").value.trim().toLowerCase();
    const rows = stringmodel.model.rows.map((entry, index) => ({entry, index})).filter(({entry}) =>
        entry.locale === localeselect.value && (!query || entry.key.toLowerCase().includes(query) || entry.read().toLowerCase().includes(query)));
    const fragment = document.createDocumentFragment();
    for (const {entry, index} of pageitems(rows)) {
        const row = document.createElement("tr");
        const key = document.createElement("td");
        const value = document.createElement("td");
        const field = document.createElement("textarea");
        key.textContent = entry.key;
        field.rows = 1;
        field.title = entry.key;
        field.value = entry.read();
        row.classList.toggle("modifiedentry", stringmodel.changes.has(index));
        field.addEventListener("input", () => {
            entry.write(field.value);
            const changed = field.value !== stringmodel.originals[index];
            if (changed) stringmodel.changes.add(index);
            else stringmodel.changes.delete(index);
            row.classList.toggle("modifiedentry", changed);
            stringselect.selectedOptions[0]?.toggleAttribute("data-modified", !!stringmodel.changes.size);
            state.session.strings.set(stringmodel.key, stringmodel);
            state.session.restoredstrings.delete(stringmodel.key);
            synccontrols();
        });
        value.append(field);
        row.append(key, value);
        fragment.append(row);
    }
    find(".stringtable tbody").replaceChildren(fragment);
}

/*//////////////////////////////////////////////////////////////////////*/

function selectedsprite() {
    return state?.media[spritefiles.selection()];
}

/*//////////////////////////////////////////////////////////////////////*/

async function exportchanges() {
    const {pkg, assets, session} = state;
    const {metadata, icon, strings, restoredstrings, hints} = session;
    const changes = new Map(session.replacements);
    for (const item of assets) {
        const key = replacementkey(item);
        if (strings.has(key)) {
            const draft = strings.get(key);
            changes.set(key, editasset({...item, textformat: draft.textformat}, draft.model.serialize()));
        } else if (restoredstrings.has(key)) {
            const draft = restoredstrings.get(key);
            changes.set(key, editasset({...item, textformat: draft.textformat}, draft.text));
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
    restoredstrings.clear();
    hints.clear();
}

const viewkeys = ["tool", "level", "strings", "locale", "sprite", "symbols", "format", "media", "page", "search"];

const itemkeys = {levels: "level", strings: "strings", sprites: "sprite", symbols: "symbols"};

function urlpreferences() {
    const params = new URLSearchParams(location.search);
    const view = Object.fromEntries(viewkeys.filter(key => params.has(key)).map(key => [key, params.get(key)]));
    if (view.tool === "stringsgame") view.tool = "strings";
    if (params.has("item") && Object.hasOwn(itemkeys, view.tool)) view[itemkeys[view.tool]] = params.get("item");
    return view;
}

function savepreferences() {
    if (!state || !tool || find(".editorbody").hidden) return;
    const search = find(toolpanels[tool] + " .editorsearch input");
    state.session.preferences = {
        tool, level: levelnav.selection()?.index, strings: stringselect.value, locale: localeselect.value,
        sprite: spritefiles.selection(), symbols: filelist.value, format: formats.value, media: spritefiles.category(),
        page: resultpage || undefined, search: search?.value
    };
}

function updateurl() {
    const url = new URL(location.href);
    savepreferences();
    const view = state && !find(".editorbody").hidden ? state.session.preferences : {};
    for (const key of [...viewkeys, "item", "app"]) url.searchParams.delete(key);
    if (state && current > 0) url.searchParams.set("app", String(current + 1));
    if (view.tool) {
        url.searchParams.set("tool", view.tool);
        const key = itemkeys[view.tool];
        const item = view[key];
        if (item !== undefined && item !== "" && item !== -1) url.searchParams.set("item", item);
        const extras = view.tool === "strings" ? ["locale"] : view.tool === "sprites" ? ["media"] : view.tool === "symbols" ? ["format"] : [];
        for (const name of [...extras, "search", "page"]) {
            const value = view[name];
            if (!value || name === "format" && value === "0" || name === "media" && value === "image") continue;
            url.searchParams.set(name, value);
        }
    }
    if (url.href !== location.href) history.replaceState(history.state, "", url);
}

function rememberbatch(active = current) {
    batchwrite = storebatch(sessions, active).catch(() => {
        displayerror("The browser could not save this batch for reload.");
        return "";
    });
}

async function loadpackage(index, opened) {
    const session = sessions[index];
    const suffix = sessions.length > 1 ? " " + (index + 1) + " of " + sessions.length : "";
    const progress = status => message(/^\d/.test(status) ? "Loading package" + suffix + " (" + status + ")" : status);
    message("Loading package" + suffix);
    let pkg;
    try {pkg = await openpackage(session.file, progress)}
    catch (error) {
        session.unreadable = true;
        throw new Error(session.file.name + ": " + error.message);
    }
    savepreferences();
    opened?.(index);
    clearflags();
    const files = packageentries(pkg);
    const unity = unitypackage(files);
    const assets = unity ? [] : packageassets(pkg, files);
    const hidelevels = /(?:^|\.)(?:ctr2|ctrm|ctrmagic|cuttherope2|cuttheropemagic)(?:\.|$)/i.test(pkg.metadata.package)
        || /^cut the rope(?:\s*:\s*|\s+)(?:2|magic)(?:\b|$)/i.test(pkg.metadata.title || "");
    const originalicon = await packageicon(pkg).catch(() => null);
    state = {
        pkg, session, assets, files, originalicon, hintcache: new Map(),
        levels: hidelevels ? [] : await levelcatalog(assets), sprites: unity ? [] : textures(files, pkg),
        strings: assets.filter(item => item.category === "stringsgame").sort((a, b) => stringlabel(a).localeCompare(stringlabel(b))),
        symbols: unity ? [] : symbolfiles(files, pkg.metadata.executable),
        legacy: unity ? [] : files.flatMap(file => {
            const name = legacyhintname(file.path);
            return name ? [{...file, ...name}] : [];
        })
    };
    state.media = unity ? [] : mediaentries(files, pkg, state.sprites);
    state.boxart = levelart(pkg.metadata.package, state.sprites, () => session.replacements, files);
    current = index;
    editor.hidden = false;
    find(".intake").hidden = true;
    back.querySelector("img").alt = "Back to package selection";
    header.load(pkg, session.preview ?? originalicon, session.metadata, !!session.icon);
    for (const button of toolbuttons) button.hidden = !toolavailable(button.dataset.tool);
    const firsttool = toolbuttons.find(button => !button.hidden)?.dataset.tool;
    find(".editorbody").hidden = !firsttool;
    find(".unitymessage").hidden = !unity;
    if (!firsttool) {
        tool = undefined;
        levelnav.clear();
        clearlevel(levelview);
        spritefiles.clear();
        media.clear();
        shownlevel = undefined;
        stringmodel = undefined;
        resetresults();
        return;
    }
    const preferences = session.preferences;
    const preferred = toolavailable(preferences.tool) ? preferences.tool : firsttool;
    await showtool(preferred, preferences);
}

function createfiles(files) {
    return files.map(file => ({
        file, metadata: {}, icon: null, preview: null, preferences: {}, replacements: new Map(),
        strings: new Map(), restoredstrings: new Map(), hints: new Map(), hintlevels: new Set(),
        stringoriginals: new Map(), stringchanges: new Map(), saved: {metadata: "{}", icon: null, replacements: new Map()}
    }));
}

function startopening(files) {
    if (!files.length) return;
    if (working) {
        pendingfiles.push(...files);
        return;
    }
    void run(async () => {
        const incoming = await distinctfiles(files, sessions.filter(session => !session.unreadable).map(session => session.file));
        const start = sessions.length;
        sessions.push(...createfiles(incoming));
        if (start === 0 && sessions.length) sessions[0].preferences = urlpreferences();
        let failure;
        for (let index = start; index < sessions.length; index++) {
            try {
                await loadpackage(index, rememberbatch);
                return;
            } catch (error) {
                if (!sessions[index].unreadable) throw error;
                failure = error;
            }
        }
        sessions.length = start;
        if (failure) throw failure;
    });
}

async function resumebatch() {
    const view = urlpreferences();
    const app = Number(new URLSearchParams(location.search).get("app"));
    let batch;
    try {batch = await loadbatch()}
    catch {return}
    const stored = Array.isArray(batch) ? createfiles(batch) : batch?.sessions?.map(session => ({...session, strings: new Map()}));
    if (!stored?.length || working || state) return;
    const index = Number.isInteger(app) && app > 0 && app <= stored.length ? app - 1
        : !Object.keys(view).length && stored[batch?.active] ? batch.active : 0;
    sessions = stored;
    if (batch?.id) batchwrite = Promise.resolve(batch.id);
    if (Object.keys(view).length) sessions[index].preferences = view;
    await run(async () => {
        const migrate = batch?.id ? undefined : rememberbatch;
        try {await loadpackage(index, migrate)}
        catch (failure) {
            if (!sessions[index].unreadable) throw failure;
            const fallback = sessions.findIndex(session => !session.unreadable);
            if (fallback < 0) throw failure;
            await loadpackage(fallback, migrate);
        }
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
    clearflags();
    sessions = [];
    current = -1;
    state = undefined;
    tool = undefined;
    header.clear();
    levelnav.clear();
    spritefiles.clear();
    clearlevel(levelview);
    media.clear();
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
    updateurl();
    void rememberbatch();
}

function backdialog(trigger) {
    const {actions, open, close} = popup(trigger, "Discard unsaved changes?");
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
    if (sessions.some(unsaved)) backdialog(back);
    else closepackage();
}, {capture: true});

document.addEventListener("click", event => {
    const control = event.target.closest("button, a[href]");
    if (control && control !== back && !control.matches(".mediaplay") && !control.disabled && control.getAttribute("aria-disabled") !== "true") press();
}, {capture: true});
window.addEventListener("beforeunload", event => {
    if (departing || !sessions.some(unsaved)) return;
    event.preventDefault();
    event.returnValue = true;
});
window.addEventListener("pageshow", () => {departing = false});

picker.addEventListener("click", () => packageinput.click());
packageinput.addEventListener("change", () => {
    const files = [...packageinput.files];
    packageinput.value = "";
    startopening(files);
});
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
        else if (tool === "strings") renderstrings();
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
        levelnav.refresh?.();
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

find(".filtersprites").addEventListener("input", event => spritefiles.search(event.target.value));
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

for (const event of ["input", "change", "click"]) {
    find(".editorbody").addEventListener(event, () => {
        if (!working) updateurl();
    });
}
void resumebatch();
