import {tagcontent} from "./tags.js";

function normalized(value) {
    return String(value || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}

function recent(first, second) {
    const difference = Date.parse(second.created || "") - Date.parse(first.created || "");
    if (Number.isFinite(difference) && difference) return difference;
    const left = String(first.id || "");
    const right = String(second.id || "");
    return right.length - left.length || right.localeCompare(left);
}

/*//////////////////////////////////////////////////////////////////////*/

export function filters(changed) {
    const bar = document.createElement("div");
    bar.className = "levelfilters";
    const search = document.createElement("input");
    search.className = "levelsearch";
    search.type = "search";
    search.placeholder = "Search levels";
    search.setAttribute("aria-label", "Search titles, creators and descriptions");
    const sorts = document.createElement("div");
    sorts.className = "levelsorts";
    sorts.setAttribute("aria-label", "Sort levels");
    let order = "recent";
    let entries = [];
    const selected = new Set();
    for (const [key, label] of [["recent", "Recent"], ["rating", "Most starred"], ["plays", "Most played"]]) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "levelsort clickable";
        button.textContent = label;
        button.setAttribute("aria-pressed", String(key === order));
        button.addEventListener("click", () => {
            order = key;
            for (const control of sorts.children) control.setAttribute("aria-pressed", String(control === button));
            apply();
        });
        sorts.append(button);
    }
    const choices = document.createElement("details");
    choices.className = "levelfiltertags";
    const summary = document.createElement("summary");
    summary.className = "tagtoggle clickable";
    summary.textContent = "Tags";
    const options = document.createElement("div");
    options.className = "tagoptions";
    choices.append(summary, options);
    bar.append(search, sorts, choices);
    const main = document.querySelector(".levelcontent > .main");
    main.prepend(bar);
    function measure() {
        main.style.setProperty("--filterheight", Math.ceil(bar.getBoundingClientRect().height) + "px");
    }
    if (window.ResizeObserver) new ResizeObserver(measure).observe(bar);
    else window.addEventListener("resize", measure, {passive: true});
    measure();

    function apply() {
        const words = normalized(search.value).trim().split(/\s+/).filter(Boolean);
        const result = entries.filter(entry => {
            const text = normalized([entry.title, entry.creator, entry.description].join(" "));
            return words.every(word => text.includes(word)) && [...selected].every(id => (entry.tags || []).some(tag => tag.id === id));
        });
        result.sort((first, second) => (order === "recent" ? 0 : (Number(second[order]) || 0) - (Number(first[order]) || 0)) || recent(first, second));
        changed(result);
    }

    search.addEventListener("input", apply);
    document.addEventListener("pointerdown", event => {
        if (!choices.contains(event.target)) choices.open = false;
    });
    search.addEventListener("keydown", event => {
        if (event.key !== "Escape" || !search.value) return;
        event.stopPropagation();
        search.value = "";
        apply();
    });
    return {
        setentries(data) {
            entries = data;
            const all = new Map();
            for (const entry of data) for (const tag of entry.tags || []) if (tag.id && tag.name) all.set(tag.id, tag);
            options.replaceChildren();
            choices.hidden = !all.size;
            for (const tag of [...all.values()].sort((first, second) => first.name.localeCompare(second.name))) {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "leveltag clickable";
                button.setAttribute("aria-pressed", String(selected.has(tag.id)));
                button.append(tagcontent(tag));
                button.addEventListener("click", () => {
                    if (selected.has(tag.id)) selected.delete(tag.id);
                    else selected.add(tag.id);
                    button.setAttribute("aria-pressed", String(selected.has(tag.id)));
                    summary.textContent = selected.size ? "Tags (" + selected.size + ")" : "Tags";
                    apply();
                });
                options.append(button);
            }
            apply();
        }
    };
}
