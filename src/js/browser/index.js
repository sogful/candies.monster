import {spinner} from "/assets/static/js/images/spinner.js";
import {pagegestures} from "./pages.js";
import {leveldetails} from "./detail/index.js";
import {thumbnail, clearthumbnails, warmthumbnails} from "./renderer/index.js";
import {morestuff} from "../site/rope/index.js";
import {catalogue} from "./catalogue/index.js";
import {creatorlink} from "./catalogue/creator.js";
import {filters} from "./filters/index.js";
import {prefetch} from "./renderer/cache.js";
import {tags} from "./catalogue/metadata.js";
import {readposition, storeposition} from "./catalogue/storage.js";
import {offline} from "./catalogue/offline.js";

morestuff();

let list = document.querySelector(".levels");
const pagehost = list.parentElement;
let sizeobserver = null;
let dimensions = "";
const previous = document.querySelector(".previous");
const next = document.querySelector(".next");
const neighbors = new Map();
const building = new Map();
let pagegeometry = null;
const gestures = pagegestures(list, previous, next, {
    neighbors() {return neighbors.values()},
    position(distance) {
        for (const adjacent of neighbors.values()) placepage(adjacent, distance);
    },
    prepare(offset) {return neighbor(page + offset)},
    discard(adjacent) {placepage(adjacent)},
    commit(offset, adjacent, silent) {
        if (!silent) {
            const sound = document.querySelector(".click");
            if (sound) {sound.currentTime = 0; void sound.play().catch(() => {})}
        }
        saveposition();
        const saved = list;
        saved.dataset.page = String(page);
        saved.classList.add("pagepreview");
        saved.inert = true;
        saved.setAttribute("aria-hidden", "true");
        neighbors.set(page, saved);
        neighbors.delete(Number(adjacent.dataset.page));
        sizeobserver?.unobserve(saved);
        list = adjacent;
        list.classList.remove("pagepreview");
        list.inert = false;
        list.removeAttribute("aria-hidden");
        for (const property of ["left", "top", "width", "height", "transform"]) list.style.removeProperty(property);
        gestures.setlist(list);
        sizeobserver?.observe(list);
        showpage(page + offset, "push", true);
    }
});
const pagination = document.createElement("span");
pagination.className = "levelpagination";
pagination.setAttribute("role", "status");
previous.after(pagination);
const pagecount = document.createElement("span");
const filtercount = document.createElement("small");
filtercount.className = "levelfiltercount";
filtercount.hidden = true;
pagination.append(pagecount, filtercount);
document.addEventListener("levelfiltercount", event => {
    filtercount.hidden = !event.detail;
    filtercount.textContent = "(" + event.detail + (event.detail === 1 ? " filter)" : " filters)");
});
let pagesize = 1;
const detail = leveldetails();
let entries = [];
let visible = [];
let page = 0;
let positionkey = "";
let definitions = null;
let loading = null;
let active = null;
let neighborversion = 0;
const tooltip = document.createElement("div");
tooltip.className = "tooltip";
tooltip.hidden = true;
document.body.appendChild(tooltip);
const search = filters((result, {restore = false} = {}) => {
    saveposition();
    visible = result.filter(entry => !entry.duplicateof);
    const saved = restore ? readposition() : {page: 0, scroll: 0};
    showpage(saved.page, false);
    list.scrollTop = saved.scroll;
});

/*//////////////////////////////////////////////////////////////////////*/

function element(tag, classname, text) {
    const node = document.createElement(tag);
    node.className = classname;
    if (text !== undefined) node.textContent = text;
    return node;
}

function picture(source, classname, alternative = "") {
    const node = element("img", classname);
    node.src = source;
    node.alt = alternative;
    node.draggable = false;
    node.loading = "lazy";
    node.decoding = "async";
    return node;
}

function createlevel(entry) {
    const card = element("article", "level clickable");
    card.dataset.level = String(entry.id ?? entries.indexOf(entry) + 1);
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", "open " + entry.title);
    const header = element("div", "header");
    header.append(element("p", "title", entry.title), creatorlink(entry, "creator"));
    const footer = element("div", "footer");
    const rating = element("div", "rating");
    rating.append(element("p", "", String(entry.rating ?? 0)), picture("/assets/images/level/star.webp", "staricon", "stars"));
    const plays = element("div", "cardplays");
    plays.append(element("p", "", String(entry.plays ?? 0)), picture("/assets/images/buttons/playcount.svg", "playcounticon", "plays"));
    const features = element("div", "features");
    for (const name of entry.features || []) {
        if (!/^[a-z]+$/.test(name)) continue;
        features.append(picture(`/assets/images/objects/${name}.png`, name, name));
    }
    if (features.children.length > 4) {
        const more = element("button", "morefeatures clickable", "show more");
        more.type = "button";
        more.setAttribute("aria-expanded", "false");
        features.append(more);
    }
    footer.append(rating, plays, features);
    const labels = element("div", "cardtags");
    tags(entry, labels, true);
    const loading = element("div", "cardloading");
    spinner(loading, "Loading level preview");
    card.append(thumbnail(entry), loading);
    card.append(footer, header, labels);
    return card;
}

function fitcards(container = list) {
    const cards = container.matches(".level") ? [container] : [...container.querySelectorAll(".level")];
    for (const card of cards) card.querySelector(".title").style.fontSize = "";
    const records = cards.map(card => {
        const title = card.querySelector(".title");
        const creator = card.querySelector(".creator").getBoundingClientRect().height;
        const tags = card.querySelector(".cardtags").getBoundingClientRect().height;
        const available = Math.max(18, Math.min(card.clientHeight * 0.55, card.clientHeight - creator - tags - 12));
        return {title, available, low: 7, high: Number.parseFloat(getComputedStyle(title).fontSize) || 18};
    }).filter(record => record.title.scrollHeight > record.available);
    for (let step = 0; step < 7; step++) {
        for (const record of records) record.title.style.fontSize = (record.low + record.high) / 2 + "px";
        for (const record of records) {
            const size = (record.low + record.high) / 2;
            if (record.title.scrollHeight > record.available) record.high = size;
            else record.low = size;
        }
    }
    for (const record of records) record.title.style.fontSize = Math.floor(record.low * 2) / 2 + "px";
}

function saveposition() {
    if (positionkey) storeposition(positionkey, page, list.scrollTop);
}

pagehost.addEventListener("scroll", event => {if (event.target === list) saveposition()}, {passive: true, capture: true});
window.addEventListener("pagehide", saveposition, {capture: true});

function pagecontent(number) {
    const content = document.createDocumentFragment();
    for (const entry of visible.slice(number * pagesize, (number + 1) * pagesize)) content.append(createlevel(entry));
    if (!visible.length) {
        const empty = element("div", "levelempty");
        empty.append(picture("/assets/images/omnom/404/404.gif", "", ""), element("p", "levelnotice", entries.length ? "no results :(" : "no levels yet"));
        content.append(empty);
    }
    return content;
}

function placepage(adjacent, distance = 0) {
    pagegeometry ||= measurepage();
    adjacent.style.setProperty("--columns", pagegeometry.columns);
    adjacent.style.left = pagegeometry.left + "px";
    adjacent.style.top = pagegeometry.top + "px";
    adjacent.style.width = pagegeometry.width + "px";
    adjacent.style.height = pagegeometry.height + "px";
    adjacent.dataset.offset = String(Number(adjacent.dataset.page) - page);
    adjacent.style.transform = `translate3d(${Number(adjacent.dataset.offset) * pagegeometry.pitch + distance}px,0,0)`;
}

function measurepage() {
    return {columns: getComputedStyle(list).getPropertyValue("--columns"), left: list.offsetLeft, top: list.offsetTop, width: list.clientWidth, height: list.clientHeight, pitch: list.parentElement.clientWidth};
}

function pagebox(number) {
    const adjacent = element("div", "levels pagepreview");
    adjacent.dataset.page = String(number);
    adjacent.inert = true;
    adjacent.setAttribute("aria-hidden", "true");
    list.after(adjacent);
    placepage(adjacent);
    return adjacent;
}

function buildpage(adjacent, all = false) {
    const queue = building.get(adjacent);
    if (!queue || !adjacent.isConnected) {building.delete(adjacent); return}
    do {
        const entry = queue.shift();
        if (!entry) break;
        const card = createlevel(entry);
        adjacent.append(card);
    } while (all && queue.length);
    if (!queue.length) {
        fitcards(adjacent);
        warmthumbnails(adjacent);
        building.delete(adjacent);
        delete adjacent.dataset.building;
        return;
    }
    const next = () => buildpage(adjacent);
    if (window.requestIdleCallback) requestIdleCallback(next, {timeout: 500});
    else setTimeout(next, 16);
}

function neighbor(number, incremental = false) {
    if (number < 0 || number * pagesize >= visible.length) return null;
    let adjacent = neighbors.get(number);
    if (!adjacent) {
        adjacent = pagebox(number);
        neighbors.set(number, adjacent);
        adjacent.dataset.building = "true";
        building.set(adjacent, visible.slice(number * pagesize, (number + 1) * pagesize));
        buildpage(adjacent, !incremental);
    }
    if (!incremental && building.has(adjacent)) buildpage(adjacent, true);
    placepage(adjacent);
    return adjacent;
}

function clearneighbors() {
    neighborversion++;
    for (const adjacent of neighbors.values()) {clearthumbnails(adjacent); adjacent.remove()}
    neighbors.clear();
    building.clear();
}

function nearby(defer = false) {
    for (const [number, adjacent] of neighbors) {
        if (Math.abs(number - page) !== 1) {building.delete(adjacent); clearthumbnails(adjacent); adjacent.remove(); neighbors.delete(number)}
    }
    for (const adjacent of neighbors.values()) placepage(adjacent);
    const version = ++neighborversion;
    const create = () => {
        if (version !== neighborversion) return;
        neighbor(page - 1, defer);
        neighbor(page + 1, defer);
    };
    if (!defer) {create(); return}
    requestAnimationFrame(() => requestAnimationFrame(() => {
        if (window.requestIdleCallback) requestIdleCallback(create, {timeout: 500});
        else setTimeout(create, 0);
    }));
}

/*//////////////////////////////////////////////////////////////////////*/

function showpage(number, write = "push", content) {
    gestures.reset();
    if (!content) {clearneighbors(); saveposition()}
    const pages = Math.max(1, Math.ceil(visible.length / pagesize));
    page = Math.max(0, Math.min(number, pages - 1));
    if (write) {
        const url = new URL(location.href);
        if (page) url.searchParams.set("page", String(page + 1));
        else url.searchParams.delete("page");
        if (url.href !== location.href) history[write === "replace" ? "replaceState" : "pushState"](null, "", url);
    }
    positionkey = location.pathname + location.search;
    document.dispatchEvent(new Event("levelpagechange"));
    hide();
    if (!content) {clearthumbnails(list); list.replaceChildren(pagecontent(page))}
    if (!content) fitcards();
    nearby(Boolean(content));
    if (!content) list.scrollTop = 0;
    list.setAttribute("aria-label", `levels, page ${page + 1} of ${pages}`);
    previous.disabled = page === 0;
    next.disabled = page >= pages - 1;
    previous.hidden = previous.disabled;
    next.hidden = next.disabled;
    pagecount.textContent = `${visible.length ? page + 1 : 0} of ${visible.length ? pages : 0} (${visible.length} levels)`;
    if (!content) {
        const box = list.querySelector(".levelbg")?.getBoundingClientRect();
        prefetch([...visible.slice(Math.max(0, page - 1) * pagesize, page * pagesize), ...visible.slice((page + 1) * pagesize, (page + 2) * pagesize)], box?.width, box?.height);
    }
}

function layout() {
    const width = list.clientWidth;
    const height = list.clientHeight;
    if (!width || !height) return;
    const signature = [width, height, innerWidth].join(":");
    if (signature === dimensions) return;
    dimensions = signature;
    const gap = Number.parseFloat(getComputedStyle(list).columnGap) || 0;
    const targetwidth = Number.parseFloat(getComputedStyle(list).getPropertyValue("--cardwidth")) || 260;
    const columns = innerWidth < 320 ? 1 : Math.max(2, Math.floor((width + gap) / targetwidth));
    const cardwidth = (width - gap * (columns - 1)) / columns;
    const rows = Math.max(1, Math.floor((height - 12 + gap) / (cardwidth * 9 / 16 + gap)));
    const capacity = rows * columns;
    list.style.setProperty("--columns", String(columns));
    pagegeometry = measurepage();
    if (capacity === pagesize) {
        fitcards();
        for (const adjacent of neighbors.values()) {placepage(adjacent); fitcards(adjacent)}
        return;
    }
    const first = page * pagesize;
    pagesize = capacity;
    if (entries.length) showpage(Math.floor(first / pagesize), "replace");
}

if (window.ResizeObserver) {sizeobserver = new ResizeObserver(layout); sizeobserver.observe(list)}
window.addEventListener("resize", layout, {passive: true});
layout();
document.fonts?.ready.then(() => {
    fitcards();
    for (const adjacent of neighbors.values()) fitcards(adjacent);
});

/*//////////////////////////////////////////////////////////////////////*/

for (const [control, offset, sprite] of [[previous, -1, "up"], [next, 1, "down"]]) {
    const arrow = control.querySelector(".arrow");
    function release() {arrow.src = `/assets/images/buttons/${sprite}.png`}
    control.addEventListener("click", event => {
        const sound = document.querySelector(".click");
        if (sound) {
            event.soundplayed = true;
            sound.currentTime = 0;
            void sound.play().catch(() => {});
        }
        gestures.turn(offset, true);
    });
    control.addEventListener("pointerdown", event => {
        if (event.button !== 0 || control.disabled) return;
        control.setPointerCapture(event.pointerId);
        arrow.src = `/assets/images/buttons/${sprite}active.png`;
    });
    control.addEventListener("pointerup", release);
    control.addEventListener("pointercancel", release);
    control.addEventListener("lostpointercapture", release);
}

let syncing = false;
async function loadcatalogue() {
    if (syncing) return;
    syncing = true;
    try {
        const data = await catalogue();
        if (!Array.isArray(data)) throw new Error("Invalid level data");
        entries = data.filter(entry => !(entry.tags || []).some(tag =>
            tag.id === "1515043686046498997" || /pudding\s*monsters/i.test(tag.name || "")
        ));
        detail.setentries(entries);
        search.setentries(entries);
    } catch {
        if (!entries.length) list.replaceChildren(element("p", "levelnotice", offline() ? "connect to download levels" : "levels could not be loaded"));
    } finally {
        syncing = false;
        list.setAttribute("aria-busy", "false");
    }
}

void loadcatalogue();
window.addEventListener("online", () => {void loadcatalogue()});

/*//////////////////////////////////////////////////////////////////////*/

pagehost.addEventListener("click", event => {
    if (!list.contains(event.target)) return;
    const card = event.target.closest(".level");
    if (!card || event.target.closest(".features,.leveltag,.creatorlink") || !getSelection().isCollapsed) return;
    saveposition();
    detail.open(card.dataset.level);
});

pagehost.addEventListener("keydown", event => {
    if (!list.contains(event.target)) return;
    if (!event.target.matches(".level") || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    saveposition();
    detail.open(event.target.dataset.level);
});

pagehost.addEventListener("keydown", event => {
    if (!list.contains(event.target)) return;
    const more = event.target.closest(".morefeatures");
    if (!more || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    more.click();
});

function loadfeatures() {
    if (!loading) {
        loading = fetch(new URL("../../../assets/static/data/levels/tooltips.json", import.meta.url)).then(response => {
            if (!response.ok) throw new Error("Feature descriptions unavailable");
            return response.json();
        }).then(data => {
            definitions = data;
            return data;
        }).catch(error => {
            loading = null;
            throw error;
        });
    }
    return loading;
}

async function showtooltip(element) {
    const request = active = element;
    try {
        const data = definitions || await loadfeatures();
        if (active !== request || !element.isConnected) return;
        const entry = data.find(item => element.matches(item.selector));
        if (!entry) return;
        tooltip.innerHTML = `<div class="tooltiptitle">${entry.title}</div><div class="tooltipdesc">${entry.description}</div>${entry.footer ? `<div class="tooltipfooter">${entry.footer}</div>` : ""}`;
        const bubble = tooltip.querySelector(".greatness");
        if (bubble) bubble.textContent = "Bable";
        tooltip.hidden = false;
        const anchor = element.getBoundingClientRect();
        const box = tooltip.getBoundingClientRect();
        tooltip.style.left = `${Math.max(8, Math.min(innerWidth - box.width - 8, anchor.left + anchor.width / 2 - box.width / 2))}px`;
        const above = anchor.top - box.height - 10;
        tooltip.style.top = `${Math.max(8, Math.min(innerHeight - box.height - 8, above >= 8 ? above : anchor.bottom + 10))}px`;
    } catch {active = null}
}

function hide() {
    active = null;
    tooltip.hidden = true;
}

document.addEventListener("click", event => {
    const more = event.target.closest(".morefeatures");
    if (more) {
        event.preventDefault();
        more.closest(".features").classList.add("expanded");
        more.setAttribute("aria-expanded", "true");
    }
    const feature = event.target.closest(".features img");
    if (feature) {
        if (active === feature) hide();
        else void showtooltip(feature);
    } else if (!tooltip.contains(event.target)) hide();
    for (const features of document.querySelectorAll(".features.expanded")) {
        if (features.contains(event.target)) continue;
        features.classList.remove("expanded");
        features.querySelector(".morefeatures").setAttribute("aria-expanded", "false");
    }
});

document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    hide();
    for (const features of document.querySelectorAll(".features.expanded")) {
        features.classList.remove("expanded");
        features.querySelector(".morefeatures").setAttribute("aria-expanded", "false");
    }
});
pagehost.addEventListener("scroll", event => {if (event.target === list) hide()}, {passive: true, capture: true});
window.addEventListener("resize", hide, {passive: true});
