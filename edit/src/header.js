import {dropdown} from "/assets/static/js/controls/dropdown.js";

const androidversions = [
    "1.0", "1.1", "1.5", "1.6", "2.0", "2.0.1", "2.1", "2.2", "2.3", "2.3.3",
    "3.0", "3.1", "3.2", "4.0", "4.0.3", "4.1", "4.2", "4.3", "4.4", "4.4W",
    "5.0", "5.1", "6.0", "7.0", "7.1", "8.0", "8.1", "9", "10", "11", "12",
    "12L", "13", "14", "15", "16", "17"
];
const iosversions = [
    "1.0", "1.1", "2.0", "2.1", "2.2", "3.0", "3.1", "3.2", "4.0", "4.1", "4.2", "4.3",
    "5.0", "5.1", "6.0", "6.1", "7.0", "7.1", "8.0", "8.1", "8.2", "8.3", "8.4",
    "9.0", "9.1", "9.2", "9.3", "10.0", "10.1", "10.2", "10.3", "11.0", "11.1", "11.2", "11.3", "11.4",
    "12.0", "12.1", "12.2", "12.3", "12.4", "12.5", "13.0", "13.1", "13.2", "13.3", "13.4", "13.5", "13.6", "13.7",
    "14.0", "14.1", "14.2", "14.3", "14.4", "14.5", "14.6", "14.7", "14.8",
    "15.0", "15.1", "15.2", "15.3", "15.4", "15.5", "15.6", "15.7", "15.8",
    "16.0", "16.1", "16.2", "16.3", "16.4", "16.5", "16.6", "16.7",
    "17.0", "17.1", "17.2", "17.3", "17.4", "17.5", "17.6", "17.7",
    "18.0", "18.1", "18.2", "18.3", "18.4", "18.5", "18.6", "18.7",
    "26.0", "26.1", "26.2", "26.3", "26.4", "26.5", "26.6"
];
const fieldnames = {
    title: "Display name", package: "Package identifier", version: "Version", build: "Build number",
    minimum: "Min iOS version", minsdk: "Min Android version", targetsdk: "Target Android version"
};

function textfield(name, value, placeholder = "") {
    const label = document.createElement("label");
    label.className = "headerfield header" + name;
    const caption = document.createElement("span");
    caption.className = "headercaption";
    caption.textContent = fieldnames[name];
    const input = document.createElement("input");
    input.type = "text";
    input.name = name;
    input.value = value;
    input.placeholder = placeholder;
    input.spellcheck = false;
    input.autocomplete = "off";
    label.append(caption, input);
    return {label, input};
}

function sdkfield(name, original, value) {
    const ios = name === "minimum";
    const label = document.createElement("div");
    label.className = "headerfield headersdk";
    const caption = document.createElement("span");
    caption.textContent = fieldnames[name];
    const input = document.createElement("select");
    input.name = name;
    input.title = fieldnames[name];
    const versions = ios ? iosversions : androidversions;
    input.append(...versions.map((version, index) => new Option(version, ios ? version : String(index + 1))));
    for (const extra of new Set([original, value])) {
        if (![...input.options].some(option => option.value === extra)) {
            input.add(new Option(extra ? ios ? extra : "API " + extra : "Not set", extra), 0);
        }
    }
    input.value = value;
    label.append(caption, input);
    const control = dropdown(input, {menuclass: "headersdkmenu", grid: true}).querySelector(".dropdownbutton");
    control.removeAttribute("aria-label");
    control.title = fieldnames[name];
    return {label, input};
}

/*//////////////////////////////////////////////////////////////////////*/

export function packageheader(root, {change, icon, reset, export: save, previous, next, close, downloadicons}) {
    root.innerHTML = `
        <div class="headerart">
            <img class="headerappicon" alt="" hidden>
            <button class="headerpickicon clickable" type="button" title="Change icon">
                <img src="/assets/images/icons/edit.svg" alt="Change icon" draggable="false">
            </button>
            <button class="headerdownloadicon clickable" type="button" title="Download app icons" hidden>
                <img src="/assets/images/icons/download.svg" alt="Download app icons" draggable="false">
            </button>
            <button class="headerreseticon clickable" type="button" title="Reset icon" hidden>
                <img src="/assets/images/icons/x.svg" alt="Reset icon" draggable="false">
            </button>
            <input class="headericoninput" type="file" accept="image/*" hidden>
        </div>
        <div class="headerapp"></div>
        <div class="headeridentifier"></div>
        <div class="headerplatform"></div>
        <button class="buttonart headerexport clickable" type="button" disabled>Export</button>
        <button class="popupclose headerclose clickable" type="button" title="Close package editor">
            <img src="/assets/images/icons/x.svg" alt="Close package editor" width="16" height="16" draggable="false">
        </button>
        <button class="headerarrow headerprevious clickable" type="button" hidden>
            <img src="/assets/images/buttons/back.png" alt="Previous package" width="18" height="18" draggable="false">
        </button>
        <button class="headerarrow headernext clickable" type="button" hidden>
            <img src="/assets/images/buttons/back.png" alt="Next package" width="18" height="18" draggable="false">
        </button>
    `;
    const art = root.querySelector(".headerart");
    const image = root.querySelector(".headerappicon");
    const pickicon = root.querySelector(".headerpickicon");
    const geticons = root.querySelector(".headerdownloadicon");
    const reseticon = root.querySelector(".headerreseticon");
    const iconinput = root.querySelector(".headericoninput");
    const app = root.querySelector(".headerapp");
    const identifier = root.querySelector(".headeridentifier");
    const platform = root.querySelector(".headerplatform");
    const exportbutton = root.querySelector(".headerexport");
    const closebutton = root.querySelector(".headerclose");
    const previousbutton = root.querySelector(".headerprevious");
    const nextbutton = root.querySelector(".headernext");
    const fields = new Map();
    let pkg;
    let buildgroup;
    let iconurl = "";
    let canchangeicon = false;

    function showicon(preview, modified = false) {
        if (iconurl) URL.revokeObjectURL(iconurl);
        iconurl = preview ? URL.createObjectURL(preview) : "";
        if (iconurl) image.src = iconurl;
        else image.removeAttribute("src");
        art.hidden = !canchangeicon && !iconurl;
        image.hidden = !iconurl;
        geticons.hidden = !canchangeicon && !iconurl;
        reseticon.hidden = !modified || !canchangeicon;
    }

    function clear() {
        root.querySelector(".dropdownbutton[aria-expanded='true']")?.click();
        pkg = undefined;
        canchangeicon = false;
        showicon(null);
        fields.clear();
        buildgroup = undefined;
        app.replaceChildren();
        identifier.replaceChildren();
        platform.replaceChildren();
        exportbutton.disabled = true;
    }

    function load(next, preview, values = {}, modified = false) {
        clear();
        pkg = next;
        const {metadata} = pkg;
        const apks = Boolean(pkg.zip.file("toc.pb"));
        canchangeicon = pkg.parts.some(part => part.metadata.iconpaths?.length);
        pickicon.hidden = !canchangeicon;
        showicon(preview, modified);

        function add(container, name, placeholder) {
            if (!(name in metadata || metadata.fields?.[name])) return;
            const original = String(metadata[name] ?? "");
            const value = String(values[name] ?? original);
            const editable = !apks && Boolean(metadata.fields?.[name]);
            const {label, input} = name === "minimum" || name === "minsdk" || name === "targetsdk"
                ? sdkfield(name, original, value) : textfield(name, value, placeholder);
            input.value = value;
            input.disabled = !editable;
            container.append(label);
            fields.set(name, {input, original, editable});
        }

        add(app, "title", metadata.title || metadata.package || "Display name");
        const version = document.createElement("div");
        version.className = "headerversiongroup";
        add(version, "version", "Version");
        if ("build" in metadata || metadata.fields?.build) {
            buildgroup = document.createElement("span");
            buildgroup.className = "headerbuildgroup";
            const open = document.createElement("span");
            open.textContent = "(";
            const close = document.createElement("span");
            close.textContent = ")";
            buildgroup.append(open);
            add(buildgroup, "build", "Build");
            buildgroup.append(close);
            version.append(buildgroup);
            refreshbuild();
        }
        app.append(version);
        add(identifier, "package", "Package identifier");
        add(platform, "minsdk");
        add(platform, "targetsdk");
        add(platform, "minimum");
        platform.hidden = !platform.childElementCount;
        sync({working: false, canexport: true});
    }

    function refreshbuild() {
        if (!buildgroup) return;
        const build = fields.get("build").input.value.trim();
        buildgroup.hidden = !build || build === fields.get("version")?.input.value.trim();
    }

    function sync({working, canexport, previous: hasprevious, next: hasnext, multiple}) {
        for (const {input, editable} of fields.values()) input.disabled = working || !editable;
        pickicon.disabled = working || !canchangeicon;
        geticons.disabled = working || geticons.hidden;
        reseticon.disabled = working || !canchangeicon;
        exportbutton.disabled = working || !canexport;
        closebutton.disabled = working || !pkg;
        previousbutton.hidden = nextbutton.hidden = !multiple;
        previousbutton.disabled = working || !hasprevious;
        nextbutton.disabled = working || !hasnext;
    }

    function edits() {
        const changed = {};
        if (!pkg) return changed;
        for (const [name, {input, original, editable}] of fields) {
            if (!editable) continue;
            const value = input.value.trim();
            if (value !== original.trim()) changed[name] = value;
        }
        return changed;
    }

    root.addEventListener("input", event => {
        if (!event.target.matches(".headerfield input")) return;
        if (event.target.matches(".headerversion input")) refreshbuild();
        change();
    });
    root.addEventListener("change", event => {
        if (event.target.matches(".headerbuild input")) refreshbuild();
        if (event.target.matches(".headersdk select")) change();
    });
    pickicon.addEventListener("click", () => iconinput.click());
    iconinput.addEventListener("change", () => {
        const file = iconinput.files[0];
        iconinput.value = "";
        if (file) icon(file);
    });
    reseticon.addEventListener("click", reset);
    exportbutton.addEventListener("click", save);
    closebutton.addEventListener("click", () => close(closebutton));
    previousbutton.addEventListener("click", previous);
    nextbutton.addEventListener("click", next);
    geticons.addEventListener("click", downloadicons);

    return {load, showicon, edits, sync, clear};
}
