import {candycontent, tagdata} from "../catalogue/metadata.js";
import {filterscroll} from "../filters/controls.js";

export function candyfilters(changed) {
    const element = document.createElement("div");
    element.className = "candybar";
    const options = document.createElement("div");
    options.className = "candyoptions";
    const label = document.createElement("button");
    label.type = "button";
    label.className = "candylabel leveltag clickable";
    label.textContent = "Candylist";
    label.setAttribute("aria-label", "Show Candylist levels");
    const selected = new Set();
    let active = false;
    options.append(label);
    element.append(options);
    filterscroll(options);
    function update() {
        label.setAttribute("aria-pressed", String(active));
        for (const button of options.querySelectorAll("[data-candy]")) button.setAttribute("aria-pressed", String(selected.has(button.dataset.candy)));
    }
    label.addEventListener("click", () => {active = !active; if (!active) selected.clear(); changed()});
    document.addEventListener("candyfilter", event => {
        active = true;
        selected.add(event.detail);
        history.pushState(null, "", location.pathname + location.search);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
        changed();
    });
    function rendertags(names) {
        const offset = options.scrollLeft;
        options.replaceChildren(label);
        const tags = new Set(names);
        for (const tag of [...tags].sort()) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "leveltag clickable";
            button.dataset.candy = tag;
            button.append(candycontent(tag));
            button.addEventListener("click", () => {
                if (selected.has(tag)) selected.delete(tag);
                else selected.add(tag);
                active = true;
                changed();
            });
            options.append(button);
        }
        options.scrollLeft = offset;
        update();
    }
    let loaded = false;
    tagdata.then(data => {if (!loaded) rendertags(data.candylist || [])});
    return {
        element,
        get active() {return active || selected.size > 0},
        update,
        reset() {active = false; selected.clear()},
        read(query) {
            active = query.get("candylist") === "1";
            selected.clear();
            for (const tag of (query.get("candy") || "").split(",")) if (/^[a-z]+$/.test(tag)) selected.add(tag);
        },
        write(url) {
            url.searchParams.delete("candylist");
            url.searchParams.delete("candy");
            if (active || selected.size) url.searchParams.set("candylist", "1");
            if (selected.size) url.searchParams.set("candy", [...selected].sort().join(","));
        },
        matches(entry) {
            return !active && !selected.size || (entry.candylist || []).some(row => [...selected].every(tag => row.tags.includes(tag)));
        },
        setentries(entries) {
            loaded = true;
            rendertags(entries.flatMap(entry => (entry.candylist || []).flatMap(row => row.tags || [])));
            update();
        }
    };
}
