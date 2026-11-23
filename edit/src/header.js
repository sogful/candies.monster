import {dropdown} from "/assets/static/js/controls/dropdown.js";

const androidversions = [
    "1.0", "1.1", "1.5", "1.6", "2.0", "2.0.1", "2.1", "2.2", "2.3", "2.3.3",
    "3.0", "3.1", "3.2", "4.0", "4.0.3", "4.1", "4.2", "4.3", "4.4", "4.4W",
    "5.0", "5.1", "6.0", "7.0", "7.1", "8.0", "8.1", "9", "10", "11", "12",
    "12L", "13", "14", "15", "16", "17"
];
const fieldnames = {
    title: "Display name", package: "Package identifier", version: "Version", build: "Build number",
    minimum: "Minimum iOS version", minsdk: "Minimum Android version", targetsdk: "Target Android version"
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

function sdkfield(name, value) {
    const label = document.createElement("div");
    label.className = "headerfield headersdk";
    const caption = document.createElement("span");
    caption.textContent = name === "minsdk" ? "Min:" : "Target:";
    const input = document.createElement("select");
    input.name = name;
    input.title = fieldnames[name];
    input.append(...androidversions.map((version, index) => new Option("Android " + version + "+", String(index + 1))));
    if (![...input.options].some(option => option.value === value)) {
        input.add(new Option(value ? "API " + value : "Not set", value), 0);
    }
    input.value = value;
    label.append(caption, input);
    const control = dropdown(input).querySelector(".dropdownbutton");
    control.removeAttribute("aria-label");
    control.title = fieldnames[name];
    return {label, input};
}

/*//////////////////////////////////////////////////////////////////////*/

export function packageheader(root, {change, icon, reset, export: save}) {
    root.innerHTML = `
        <div class="headerart">
            <img class="headerappicon" alt="" hidden>
            <button class="headerpickicon clickable" type="button" title="Change icon">
                <img src="/assets/images/icons/edit.svg" alt="Change icon" draggable="false">
            </button>
            <button class="headerreseticon clickable" type="button" title="Reset icon" hidden>
                <img src="/assets/images/icons/x.svg" alt="Reset icon" draggable="false">
            </button>
            <input class="headericoninput" type="file" accept="image/*" hidden>
        </div>
        <div class="headerapp"></div>
        <div class="headeridentifier"></div>
        <div class="headerplatform"></div>
        <button class="buttonart green headerexport clickable" type="button" disabled>Export</button>
    `;
    const art = root.querySelector(".headerart");
    const image = root.querySelector(".headerappicon");
    const pickicon = root.querySelector(".headerpickicon");
    const reseticon = root.querySelector(".headerreseticon");
    const iconinput = root.querySelector(".headericoninput");
    const app = root.querySelector(".headerapp");
    const identifier = root.querySelector(".headeridentifier");
    const platform = root.querySelector(".headerplatform");
    const exportbutton = root.querySelector(".headerexport");
    const fields = new Map();
    let pkg;
    let iconurl = "";
    let canchangeicon = false;

    function showicon(preview, modified = false) {
        if (iconurl) URL.revokeObjectURL(iconurl);
        iconurl = preview ? URL.createObjectURL(preview) : "";
        if (iconurl) image.src = iconurl;
        else image.removeAttribute("src");
        art.hidden = !canchangeicon && !iconurl;
        image.hidden = !iconurl;
        reseticon.hidden = !modified || !canchangeicon;
    }

    function clear() {
        root.querySelector(".dropdownbutton[aria-expanded='true']")?.click();
        pkg = undefined;
        canchangeicon = false;
        showicon(null);
        fields.clear();
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
            const {label, input} = name === "minsdk" || name === "targetsdk"
                ? sdkfield(name, original) : textfield(name, value, placeholder);
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
            const open = document.createElement("span");
            open.textContent = "(";
            const close = document.createElement("span");
            close.textContent = ")";
            version.append(open);
            add(version, "build", "Build");
            version.append(close);
        }
        app.append(version);
        add(identifier, "package", "Package identifier");
        add(platform, "minsdk");
        add(platform, "targetsdk");
        add(platform, "minimum", "Minimum iOS version");
        platform.hidden = !platform.childElementCount;
        sync({working: false, canexport: false});
    }

    function sync({working, canexport}) {
        for (const {input, editable} of fields.values()) input.disabled = working || !editable;
        pickicon.disabled = working || !canchangeicon;
        reseticon.disabled = working || !canchangeicon;
        exportbutton.disabled = working || !canexport;
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
        if (event.target.matches(".headerfield input")) change();
    });
    root.addEventListener("change", event => {
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

    return {load, showicon, edits, sync, clear};
}
