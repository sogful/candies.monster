import {contestfilters} from "./contests.js";
import {tagcontent, featurecontent, tagdata, tagid, filtertag, sorttags, featuretypes} from "../catalogue/metadata.js";
import {matches} from "./controls.js";
import {profile} from "../catalogue/creator.js";
import {recentplays} from "../catalogue/storage.js";
import {candyfilters} from "../candylist/filters.js";
import {popup} from "../popup.js";

function recent(first, second) {
    const difference = Date.parse(second.created || "") - Date.parse(first.created || "");
    if (Number.isFinite(difference) && difference) return difference;
    const left = String(first.id || "");
    const right = String(second.id || "");
    return right.length - left.length || right.localeCompare(left);
}

/*//////////////////////////////////////////////////////////////////////*/

function iconbutton(classname, icon, label) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filtericon ${classname} clickable`;
    button.setAttribute("aria-label", label);
    const image = document.createElement("img");
    image.src = `/assets/images/icons/${icon}.svg`;
    image.alt = "";
    button.append(image);
    return button;
}

function filtersection(title, options) {
    const section = document.createElement("section");
    section.className = "filtersection";
    const heading = document.createElement("h2");
    heading.textContent = title;
    section.append(heading, options);
    return section;
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
    icon.src = "/assets/images/icons/search.svg";
    icon.alt = "";
    const clear = document.createElement("button");
    clear.type = "button";
    clear.className = "levelclear clickable";
    clear.setAttribute("aria-label", "Clear search");
    clear.hidden = true;
    const cross = document.createElement("img");
    cross.src = "/assets/images/icons/x.svg";
    cross.alt = "";
    clear.append(cross);
    field.append(icon, search, clear);
    const creator = iconbutton("creatorsearch", "user", "Search creators only");
    creator.setAttribute("aria-pressed", "false");
    creator.addEventListener("click", () => {
        const active = creator.getAttribute("aria-pressed") !== "true";
        creator.setAttribute("aria-pressed", String(active));
        search.placeholder = active ? "Search creators" : "Search levels";
        search.setAttribute("aria-label", search.placeholder);
        apply(true, false, false, !search.value.trim());
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
    const chosen = new Set();
    let authorid = "";
    let profilereturn = "";
    let signature;
    const candy = candyfilters(apply);
    const contests = contestfilters(apply);
    const unavailable = new Set();
    for (const [key, label, artwork] of [
        ["recent", "Newest", "icons/upload.svg"],
        ["rating", "Liked", "level/star.webp"],
        ["plays", "Popular", "buttons/playcount.svg"],
        ["played", "Recents"]
    ]) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "levelsort clickable";
        button.dataset.order = key;
        button.title = key === "played" ? "Recently played" : label;
        button.setAttribute("aria-label", button.title);
        const caption = document.createElement("span");
        caption.textContent = label;
        if (artwork) {
            const icon = document.createElement("img");
            icon.src = "/assets/images/" + artwork;
            icon.alt = "";
            button.append(icon);
        }
        button.append(caption);
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
    const tags = iconbutton("tagsbutton", "tags", "Tags and filters");
    tags.title = "Tags";
    tags.setAttribute("aria-haspopup", "dialog");
    tags.setAttribute("aria-expanded", "false");
    field.append(creator);
    top.append(field, tags, sorts);
    const options = document.createElement("div");
    options.className = "filteroptions tagoptions";
    const reset = iconbutton("filterreset", "x", "Reset filters");
    reset.title = "Reset filters";
    reset.hidden = true;
    reset.addEventListener("click", () => {
        search.value = "";
        order = "recent";
        selected.clear();
        chosen.clear();
        candy.reset();
        contests.reset();
        creator.setAttribute("aria-pressed", "false");
        apply();
        reset.closest("dialog")?.querySelector(".membershipclose").focus({preventScroll: true});
    });
    const featurerow = document.createElement("div");
    featurerow.className = "filteroptions featureoptions";
    for (const [key, label] of Object.entries(featuretypes)) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "leveltag clickable";
        button.dataset.feature = key;
        button.append(featurecontent(key, label));
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => {
            if (chosen.has(key)) chosen.delete(key);
            else chosen.add(key);
            apply();
        });
        featurerow.append(button);
    }
    const list = document.createElement("div");
    list.className = "filterlist";
    list.append(
        filtersection("Tags", options),
        filtersection("Features", featurerow),
        filtersection("Candylist", candy.element),
        filtersection("Contests", contests.element)
    );
    tags.addEventListener("click", () => {
        const {dialog, actions, open} = popup(tags, "Filters");
        dialog.classList.add("filterdialog");
        actions.append(reset, list);
        open();
    });
    const header = document.createElement("section");
    header.className = "creatorprofile";
    header.hidden = true;
    bar.append(top, header);
    let routed = location.search;

    function readroute() {
        const query = new URLSearchParams(location.search);
        search.value = query.get("search") || "";
        order = ({liked: "rating", popular: "plays", played: "played"})[query.get("sort")] || "recent";
        creator.setAttribute("aria-pressed", String(query.get("creator") === "1"));
        selected.clear();
        for (const id of (query.get("tags") || "").split(",")) if (/^\d{1,22}$/.test(id)) selected.add(tagid(id));
        authorid = /^\d{17,22}$/.test(query.get("author") || "") ? query.get("author") : "";
        chosen.clear();
        for (const key of (query.get("features") || "").split(",")) if (Object.prototype.hasOwnProperty.call(featuretypes, key)) chosen.add(key);
        candy.read(query);
        contests.read(query);
        routed = location.search;
    }
    readroute();
    const main = document.querySelector(".levelcontent > .main");
    main.prepend(bar);
    function measure() {
        main.style.setProperty("--filterheight", Math.ceil(bar.getBoundingClientRect().height) + "px");
    }
    if (window.ResizeObserver) {
        const observer = new ResizeObserver(measure);
        for (const element of [bar, field, sorts]) observer.observe(element);
    }
    else window.addEventListener("resize", measure, {passive: true});
    measure();

    function apply(write = true, restore = false, replace = false, preserve = false) {
        const beforepage = new URLSearchParams(location.search).get("page");
        if (write) {
            const url = new URL(location.href);
            for (const key of ["search", "sort", "tags", "creator", "features", "author", "revision"]) url.searchParams.delete(key);
            if (!preserve) url.searchParams.delete("page");
            candy.write(url);
            contests.write(url);
            if (search.value) url.searchParams.set("search", search.value);
            if (authorid) url.searchParams.set("author", authorid);
            if (chosen.size) url.searchParams.set("features", [...chosen].sort().join(","));
            if (order !== "recent") url.searchParams.set("sort", ({rating: "liked", plays: "popular", played: "played"})[order]);
            if (selected.size) url.searchParams.set("tags", [...selected].sort().join(","));
            if (creator.getAttribute("aria-pressed") === "true") url.searchParams.set("creator", "1");
            if (url.href !== location.href) history[replace ? "replaceState" : "pushState"](null, "", url);
            routed = location.search;
        }
        search.placeholder = creator.getAttribute("aria-pressed") === "true" ? "Search creators" : "Search levels";
        search.setAttribute("aria-label", search.placeholder);
        for (const button of sorts.children) button.setAttribute("aria-pressed", String(button.dataset.order === order));
        for (const button of options.querySelectorAll("[data-tag]")) button.setAttribute("aria-pressed", String(selected.has(button.dataset.tag)));
        if (header.dataset.creator !== authorid) {header.dataset.creator = authorid; profile(header, authorid, entries)}
        for (const button of featurerow.children) button.setAttribute("aria-pressed", String(chosen.has(button.dataset.feature)));
        candy.update();
        contests.update();
        const count = selected.size + chosen.size + contests.count + candy.count;
        reset.hidden = !count && order === "recent" && creator.getAttribute("aria-pressed") !== "true";
        tags.classList.toggle("filteractive", count > 0);
        tags.setAttribute("aria-label", count ? `Tags and filters (${count} selected)` : "Tags and filters");
        clear.hidden = !search.value;
        const played = recentplays();
        const result = entries.filter(entry => {
            if (entry.duplicateof || authorid && entry.creatorid !== authorid) return false;
            if (!candy.matches(entry) || !contests.matches(entry)) return false;
            if (entry.engine && !search.value.trim() && !authorid && ![...selected].some(id => unavailable.has(id))) return false;
            if (![...chosen].every(key => (entry.notable || []).includes(key))) return false;
            if (order === "played" && !played[entry.id]) return false;
            const text = creator.getAttribute("aria-pressed") === "true" ? entry.creator : entry.title;
            return matches(search.value, text) && [...selected].every(id => (entry.tags || []).some(tag => tag.id === id));
        });
        result.sort((first, second) => (order === "played" ? played[second.id] - played[first.id] : order === "recent" ? 0 : (Number(second[order]) || 0) - (Number(first[order]) || 0)) || recent(first, second));
        document.dispatchEvent(new CustomEvent("levelfiltercount", {detail: count}));
        const next = result.map(entry => entry.id).join(",");
        if (signature !== next || restore || beforepage !== new URLSearchParams(location.search).get("page")) {
            signature = next;
            changed(result, {restore});
        }
    }

    document.addEventListener("leveltagfilter", event => {
        const id = String(event.detail?.id || event.detail || "");
        const button = [...options.children].find(control => control.dataset.tag === id);
        if (!button) return;
        selected.add(tagid(id));
        button.setAttribute("aria-pressed", "true");
        apply();
    });

    document.addEventListener("levelprofileback", () => {
        if (profilereturn) {
            history.pushState(null, "", profilereturn);
            profilereturn = "";
            readroute();
            apply(false, true);
            window.dispatchEvent(new HashChangeEvent("hashchange"));
        } else {authorid = ""; apply()}
    });
    document.addEventListener("levelcreator", event => {
        const id = String(event.detail || "");
        if (!/^\d{17,22}$/.test(id)) return;
        if (!authorid) profilereturn = location.pathname + location.search + location.hash;
        authorid = id;
        search.value = "";
        selected.clear();
        chosen.clear();
        candy.reset();
        contests.reset();
        order = "recent";
        const url = new URL(location.href);
        url.hash = "";
        history.pushState(null, "", url);
        apply();
        window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    search.addEventListener("input", () => apply(true, false, true));
    document.addEventListener("levelpagechange", () => {routed = location.search});
    document.addEventListener("levelbrowserrestore", () => {readroute(); apply(false, true)});
    window.addEventListener("popstate", () => {
        if (/^#(?:level\/)?\d+$/.test(location.hash)) return;
        if (routed === location.search) return;
        readroute();
        apply(false, true);
    });
    document.addEventListener("levelplayed", () => {if (order === "played") apply(false, true)});
    document.addEventListener("keydown", event => {
        if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey || event.target?.isContentEditable || event.target?.closest?.("input,textarea,select")) return;
        if (document.documentElement.matches(".gameopen,.gameloading,.previewopen,.documentopen")) return;
        if (document.querySelector(".filterdialog[open]")) return;
        event.preventDefault();
        if (location.hash) {
            history.pushState(null, "", location.pathname + location.search);
            window.dispatchEvent(new HashChangeEvent("hashchange"));
        }
        search.focus({preventScroll: true});
    });
    search.addEventListener("keydown", event => {
        if (event.key !== "Escape" || !search.value) return;
        event.stopPropagation();
        search.value = "";
        apply();
    });
    function rendertags(data) {
        const all = new Map(data.filter(tag => tag.id && tag.name && filtertag(tag)).map(tag => [tag.id, tag]));
        options.replaceChildren();
        for (const tag of sorttags([...all.values()]).sort((first, second) => Number(unavailable.has(first.id)) - Number(unavailable.has(second.id)))) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "leveltag clickable";
            button.dataset.tag = tag.id;
            button.classList.toggle("unsupportedtag", unavailable.has(tag.id));
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
    }
    tagdata.then(data => {
        if (!entries.length) rendertags(data.tags || []);
        for (const button of featurerow.children) {
            button.replaceChildren(featurecontent(button.dataset.feature, featuretypes[button.dataset.feature]));
        }
    });

    return {
        setentries(data) {
            entries = data;
            const ids = [...selected].map(tagid);
            selected.clear();
            for (const id of ids) selected.add(tagid(id));
            unavailable.clear();
            const bytag = new Map();
            for (const entry of data) for (const tag of entry.tags || []) {
                if (!bytag.has(tag.id)) bytag.set(tag.id, []);
                bytag.get(tag.id).push(entry);
                if (/^(?:magic|modded|cut the rope 2)$/i.test(tag.name)) unavailable.add(tag.id);
            }
            for (const [id, levels] of bytag) if (levels.every(entry => entry.engine)) unavailable.add(id);
            candy.setentries(data);
            rendertags(data.flatMap(entry => entry.tags || []));
            apply(false, true);
        }
    };
}
