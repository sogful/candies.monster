import {contestfilters} from "./contests.js";
import {filterscroll} from "./controls.js";
import {tagcontent, featurecontent, tagdata, tagid, filtertag, sorttags} from "../catalogue/metadata.js";
import {matches} from "./controls.js";
import {featuretypes} from "../catalogue/metadata.js";
import {profile} from "../catalogue/creator.js";
import {recentplays} from "../catalogue/storage.js";
import {candyfilters} from "../candylist/filters.js";

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
    const contests = contestfilters(() => {lastrow = "contests"; apply()});
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
    field.append(creator);
    top.append(field, sorts);
    const options = document.createElement("div");
    options.className = "tagoptions";
    options.setAttribute("aria-label", "Filter by tags");
    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "leveltag filterreset clickable";
    reset.setAttribute("aria-label", "Reset filters");
    reset.title = "Reset filters";
    const reseticon = document.createElement("img");
    reseticon.src = "/assets/images/buttons/xbutton.png";
    reseticon.alt = "";
    reset.append(reseticon);
    reset.hidden = true;
    reset.addEventListener("click", () => {
        search.value = "";
        order = "recent";
        selected.clear();
        chosen.clear();
        candy.reset();
        contests.reset();
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
        button.append(featurecontent(key, label));
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
    bar.append(header, top, tagrow, lower, candy.element, contests.element);
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
        reset.hidden = !authorid && !chosen.size && !search.value && order === "recent" && !selected.size && !candy.active && !contests.count && creator.getAttribute("aria-pressed") !== "true";
        const rows = {tags: tagrow, features: lower, candy: candy.element, contests: contests.element};
        const active = [selected.size ? "tags" : "", chosen.size ? "features" : "", candy.active ? "candy" : "", contests.count ? "contests" : ""].filter(Boolean);
        for (const [key, row] of Object.entries(rows)) {
            let control = row.querySelector(":scope > .filterreset");
            if (!control) {
                control = reset.cloneNode(true);
                control.addEventListener("click", () => reset.click());
                row.append(control);
            }
            control.hidden = !active.includes(key) && !(key === "tags" && !active.length && !reset.hidden);
            row.classList.toggle("hasreset", !control.hidden);
        }
        options.hidden = false;
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
        const count = selected.size + chosen.size + contests.count + candy.count;
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
        const offset = options.scrollLeft;
        const all = new Map(data.filter(tag => tag.id && tag.name && filtertag(tag)).map(tag => [tag.id, tag]));
        options.replaceChildren();
        options.hidden = false;
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
                lastrow = "tags";
                button.setAttribute("aria-pressed", String(selected.has(tag.id)));
                apply();
            });
            options.append(button);
        }
        options.scrollLeft = offset;
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
