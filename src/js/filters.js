import {tagcontent} from "./tags.js";
import {matches} from "./searchmatch.js";

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
    search.setAttribute("aria-label", "Search level titles");
    const field = document.createElement("div");
    field.className = "levelsearchfield";
    const icon = document.createElement("img");
    icon.src = "/assets/images/icons/search.png";
    icon.alt = "";
    const clear = document.createElement("button");
    clear.type = "button";
    clear.className = "levelclear clickable";
    clear.setAttribute("aria-label", "Clear search");
    clear.hidden = true;
    const cross = document.createElement("img");
    cross.src = "/assets/images/icons/x.png";
    cross.alt = "";
    clear.append(cross);
    field.append(icon, search, clear);
    const creator = document.createElement("button");
    creator.type = "button";
    creator.className = "creatorsearch clickable";
    creator.setAttribute("aria-label", "Search creators only");
    creator.setAttribute("aria-pressed", "false");
    const account = document.createElement("img");
    account.src = "/assets/images/icons/user.png";
    account.alt = "";
    creator.append(account);
    creator.addEventListener("click", () => {
        const active = creator.getAttribute("aria-pressed") !== "true";
        creator.setAttribute("aria-pressed", String(active));
        search.placeholder = active ? "Search creators" : "Search levels";
        search.setAttribute("aria-label", search.placeholder);
        apply();
    });
    clear.addEventListener("click", () => {
        search.value = "";
        apply();
        search.focus({preventScroll: true});
    });
    const sorts = document.createElement("div");
    sorts.className = "levelsorts";
    sorts.setAttribute("aria-label", "Sort levels");
    let order = "recent";
    let entries = [];
    const selected = new Set();
    for (const [key, label] of [["recent", "Recent"], ["rating", "Liked"], ["plays", "Popular"]]) {
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
    const top = document.createElement("div");
    top.className = "filtertop";
    field.append(creator);
    top.append(field, sorts);
    const options = document.createElement("div");
    options.className = "tagoptions";
    options.setAttribute("aria-label", "Filter by tags");
    bar.append(top, options);
    let drag = null;
    let ignoreclick = false;
    options.addEventListener("pointerdown", event => {
        if (event.button !== 0 || event.pointerType === "touch") return;
        drag = {id: event.pointerId, start: event.clientX, scroll: options.scrollLeft, moved: false};
        ignoreclick = false;
    });
    options.addEventListener("pointermove", event => {
        if (!drag || event.pointerId !== drag.id) return;
        const distance = event.clientX - drag.start;
        if (!drag.moved && Math.abs(distance) < 5) return;
        if (!drag.moved) {
            drag.moved = true;
            options.setPointerCapture(event.pointerId);
            options.classList.add("tagdragging");
        }
        options.scrollLeft = drag.scroll - distance;
        event.preventDefault();
    });
    function released(event) {
        if (!drag || event.pointerId !== drag.id) return;
        ignoreclick = drag.moved;
        drag = null;
        options.classList.remove("tagdragging");
        if (options.hasPointerCapture(event.pointerId)) options.releasePointerCapture(event.pointerId);
    }
    options.addEventListener("pointerup", released);
    options.addEventListener("pointercancel", released);
    options.addEventListener("lostpointercapture", released);
    options.addEventListener("click", event => {
        if (!ignoreclick) return;
        ignoreclick = false;
        event.preventDefault();
        event.stopPropagation();
    }, true);
    options.addEventListener("wheel", event => {
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        const distance = delta * (event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? options.clientWidth : 1);
        const previous = options.scrollLeft;
        options.scrollLeft += distance;
        if (options.scrollLeft !== previous) event.preventDefault();
    }, {passive: false});
    const main = document.querySelector(".levelcontent > .main");
    main.prepend(bar);
    function measure() {
        main.style.setProperty("--filterheight", Math.ceil(bar.getBoundingClientRect().height) + "px");
    }
    if (window.ResizeObserver) new ResizeObserver(measure).observe(bar);
    else window.addEventListener("resize", measure, {passive: true});
    measure();

    function apply() {
        clear.hidden = !search.value;
        const result = entries.filter(entry => {
            const text = creator.getAttribute("aria-pressed") === "true" ? entry.creator : entry.title;
            return matches(search.value, text) && [...selected].every(id => (entry.tags || []).some(tag => tag.id === id));
        });
        result.sort((first, second) => (order === "recent" ? 0 : (Number(second[order]) || 0) - (Number(first[order]) || 0)) || recent(first, second));
        changed(result);
    }

    document.addEventListener("leveltagfilter", event => {
        const id = String(event.detail?.id || event.detail || "");
        const button = [...options.children].find(control => control.dataset.tag === id);
        if (!button) return;
        selected.add(id);
        button.setAttribute("aria-pressed", "true");
        button.scrollIntoView({block: "nearest", inline: "nearest"});
        apply();
    });

    search.addEventListener("input", apply);
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
            options.hidden = !all.size;
            for (const id of selected) if (!all.has(id)) selected.delete(id);
            for (const tag of [...all.values()].sort((first, second) => first.name.localeCompare(second.name))) {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "leveltag clickable";
                button.dataset.tag = tag.id;
                button.setAttribute("aria-pressed", String(selected.has(tag.id)));
                button.append(tagcontent(tag));
                button.addEventListener("click", () => {
                    if (selected.has(tag.id)) selected.delete(tag.id);
                    else selected.add(tag.id);
                    button.setAttribute("aria-pressed", String(selected.has(tag.id)));
                    apply();
                });
                options.append(button);
            }
            apply();
        }
    };
}
