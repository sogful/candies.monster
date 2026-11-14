import {filterscroll} from "./filterscroll.js";
import {tagcontent} from "./tags.js";
import {matches} from "./searchmatch.js";
import {featuretypes} from "./features.js";
import {profile} from "./creator.js";
import {recentplays} from "./recently.js";
import {candyfilters} from "./candylist/filters.js";

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
    const creator = document.createElement("button");
    creator.type = "button";
    creator.className = "creatorsearch clickable";
    creator.setAttribute("aria-label", "Search creators only");
    creator.setAttribute("aria-pressed", "false");
    const account = document.createElement("img");
    account.src = "/assets/images/icons/user.svg";
    account.alt = "";
    creator.append(account);
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
    let lastrow = "tags";
    let signature;
    const candy = candyfilters(() => {lastrow = "candy"; apply()});
    for (const [key, label] of [["recent", "Recent"], ["rating", "Liked"], ["plays", "Popular"], ["played", "Played"]]) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "levelsort clickable";
        button.dataset.order = key;
        if (key === "played") {button.title = "Recently played"; button.setAttribute("aria-label", "Recently played")}
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
    const playedbutton = sorts.querySelector("[data-order=played]");
    playedbutton.classList.add("leveltag");
    playedbutton.textContent = "Recently played";
    options.append(playedbutton);
    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "leveltag filterreset clickable";
    reset.setAttribute("aria-label", "Reset filters");
    reset.title = "Reset filters";
    const reseticon = document.createElement("img");
    reseticon.src = "/assets/images/icons/x.svg";
    reseticon.alt = "";
    reset.append(reseticon);
    reset.hidden = true;
    reset.addEventListener("click", () => {
        search.value = "";
        order = "recent";
        selected.clear();
        chosen.clear();
        candy.reset();
        authorid = "";
        creator.setAttribute("aria-pressed", "false");
        apply();
    });
    const featurerow = document.createElement("div");
    featurerow.className = "featureoptions";
    featurerow.setAttribute("aria-label", "Filter by features");
    for (const [key, label] of Object.entries(featuretypes)) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "leveltag clickable";
        button.dataset.feature = key;
        button.textContent = label;
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => {
            if (chosen.has(key)) chosen.delete(key);
            else chosen.add(key);
            lastrow = "features";
            apply();
        });
        featurerow.append(button);
    }
    const lower = document.createElement("div");
    lower.className = "featurebar";
    lower.append(featurerow);
    const tagrow = document.createElement("div");
    tagrow.className = "tagbar";
    tagrow.append(options, reset);
    const header = document.createElement("section");
    header.className = "creatorprofile";
    header.hidden = true;
    bar.append(header, top, tagrow, lower, candy.element);
    let routed = location.search;

    function readroute() {
        const query = new URLSearchParams(location.search);
        search.value = query.get("search") || "";
        order = ({liked: "rating", popular: "plays", played: "played"})[query.get("sort")] || "recent";
        creator.setAttribute("aria-pressed", String(query.get("creator") === "1"));
        selected.clear();
        for (const id of (query.get("tags") || "").split(",")) if (/^\d{1,22}$/.test(id)) selected.add(id);
        authorid = /^\d{17,22}$/.test(query.get("author") || "") ? query.get("author") : "";
        chosen.clear();
        for (const key of (query.get("features") || "").split(",")) if (Object.prototype.hasOwnProperty.call(featuretypes, key)) chosen.add(key);
        candy.read(query);
        routed = location.search;
    }
    readroute();
    filterscroll(options);
    filterscroll(featurerow);
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
        playedbutton.setAttribute("aria-pressed", String(order === "played"));
        for (const button of options.querySelectorAll("[data-tag]")) button.setAttribute("aria-pressed", String(selected.has(button.dataset.tag)));
        if (header.dataset.creator !== authorid) {header.dataset.creator = authorid; profile(header, authorid, entries)}
        for (const button of featurerow.children) button.setAttribute("aria-pressed", String(chosen.has(button.dataset.feature)));
        candy.update();
        reset.hidden = !authorid && !chosen.size && !search.value && order === "recent" && !selected.size && !candy.active && creator.getAttribute("aria-pressed") !== "true";
        const rows = {tags: tagrow, features: lower, candy: candy.element};
        const active = [selected.size ? "tags" : "", chosen.size ? "features" : "", candy.active ? "candy" : ""].filter(Boolean);
        const placement = active.includes(lastrow) ? lastrow : active.at(-1) || "tags";
        rows[placement].append(reset);
        for (const row of Object.values(rows)) row.classList.toggle("hasreset", !reset.hidden && row === rows[placement]);
        options.hidden = false;
        clear.hidden = !search.value;
        const played = recentplays();
        const result = entries.filter(entry => {
            if (entry.duplicateof || authorid && entry.creatorid !== authorid) return false;
            if (!candy.matches(entry)) return false;
            if (![...chosen].every(key => (entry.notable || []).includes(key))) return false;
            if (order === "played" && !played[entry.id]) return false;
            const text = creator.getAttribute("aria-pressed") === "true" ? entry.creator : entry.title;
            return matches(search.value, text) && [...selected].every(id => (entry.tags || []).some(tag => tag.id === id));
        });
        result.sort((first, second) => (order === "played" ? played[second.id] - played[first.id] : order === "recent" ? 0 : (Number(second[order]) || 0) - (Number(first[order]) || 0)) || recent(first, second));
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
        selected.add(id);
        lastrow = "tags";
        button.setAttribute("aria-pressed", "true");
        button.scrollIntoView({block: "nearest", inline: "nearest"});
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
        order = "recent";
        const url = new URL(location.href);
        url.hash = "";
        history.pushState(null, "", url);
        apply();
        window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    search.addEventListener("input", () => apply(true, false, true));
    document.addEventListener("levelpagechange", () => {routed = location.search});
    window.addEventListener("popstate", () => {
        if (routed === location.search) return;
        readroute();
        apply(false, true);
    });
    document.addEventListener("levelplayed", () => {if (order === "played") apply(false, true)});
    document.addEventListener("keydown", event => {
        if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey || event.target?.isContentEditable || event.target?.closest?.("input,textarea,select")) return;
        if (document.documentElement.matches(".gameopen,.gameloading,.previewopen,.documentopen")) return;
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
    return {
        setentries(data) {
            entries = data;
            candy.setentries(data);
            const all = new Map();
            for (const entry of data) for (const tag of entry.tags || []) if (tag.id && tag.name) all.set(tag.id, tag);
            options.replaceChildren(playedbutton);
            options.hidden = false;
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
                    lastrow = "tags";
                    button.setAttribute("aria-pressed", String(selected.has(tag.id)));
                    apply();
                });
                options.append(button);
            }
            apply(false, true);
        }
    };
}
