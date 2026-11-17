import {spinner} from "/assets/static/js/images/spinner.js";
import {pagegestures} from "./pages.js";
import {leveldetails} from "./detail/index.js";
import {thumbnail, clearthumbnails} from "./renderer/index.js";
import {morestuff} from "../site/rope/index.js";
import {catalogue} from "./catalogue/index.js";
import {creatorlink} from "./catalogue/creator.js";
import {filters} from "./filters/index.js";
import {prefetch} from "./renderer/cache.js";
import {tags} from "./catalogue/metadata.js";
import {readposition, storeposition} from "./catalogue/storage.js";

morestuff();

const list = document.querySelector(".levels");
const previous = document.querySelector(".previous");
const next = document.querySelector(".next");
const gestures = pagegestures(list, previous, next, {
    prepare(offset) {
        const adjacent = document.createElement("div");
        adjacent.className = "levels pagepreview";
        adjacent.inert = true;
        adjacent.setAttribute("aria-hidden", "true");
        adjacent.style.setProperty("--columns", getComputedStyle(list).getPropertyValue("--columns"));
        adjacent.style.left = list.offsetLeft + "px";
        adjacent.style.top = list.offsetTop + "px";
        adjacent.style.width = list.clientWidth + "px";
        adjacent.style.height = list.clientHeight + "px";
        adjacent.append(pagecontent(page + offset));
        list.after(adjacent);
        fitcards(adjacent);
        return adjacent;
    },
    discard(adjacent) {
        clearthumbnails(adjacent);
        adjacent.remove();
    },
    commit(offset, adjacent, silent) {
        if (!silent) {
            const sound = document.querySelector(".click");
            if (sound) {sound.currentTime = 0; void sound.play().catch(() => {})}
        }
        const content = document.createDocumentFragment();
        content.append(...adjacent.childNodes);
        adjacent.remove();
        showpage(page + offset, "push", content);
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
    tags(entry, labels);
    const loading = element("div", "cardloading");
    spinner(loading, "Loading level preview");
    card.append(thumbnail(entry), loading);
    card.append(footer, header, labels);
    return card;
}

function fitcard(card) {
    const title = card.querySelector(".title");
    title.style.fontSize = "";
    const base = Number.parseFloat(getComputedStyle(title).fontSize) || 18;
    const creator = card.querySelector(".creator").getBoundingClientRect().height;
    const tags = card.querySelector(".cardtags").getBoundingClientRect().height;
    const available = Math.max(18, Math.min(card.clientHeight * 0.55, card.clientHeight - creator - tags - 12));
    if (title.scrollHeight <= available) return;
    let low = 7;
    let high = base;
    for (let step = 0; step < 7; step++) {
        const size = (low + high) / 2;
        title.style.fontSize = size + "px";
        if (title.scrollHeight > available) high = size;
        else low = size;
    }
    title.style.fontSize = Math.floor(low * 2) / 2 + "px";
}

function fitcards(container = list) {
    for (const card of container.querySelectorAll(".level")) fitcard(card);
}

function saveposition() {
    if (positionkey) storeposition(positionkey, page, list.scrollTop);
}

list.addEventListener("scroll", saveposition, {passive: true});
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

function showpage(number, write = "push", content) {
    gestures.reset();
    saveposition();
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
    clearthumbnails(list);
    list.replaceChildren(content || pagecontent(page));
    fitcards();
    list.scrollTop = 0;
    list.setAttribute("aria-label", `levels, page ${page + 1} of ${pages}`);
    previous.disabled = page === 0;
    next.disabled = page >= pages - 1;
    previous.hidden = previous.disabled;
    next.hidden = next.disabled;
    pagecount.textContent = `${visible.length ? page + 1 : 0} of ${visible.length ? pages : 0} (${visible.length} levels)`;
    const box = list.querySelector(".levelbg")?.getBoundingClientRect();
    prefetch(visible.slice((page + 1) * pagesize, (page + 2) * pagesize), box?.width, box?.height);
}

function layout() {
    const width = list.clientWidth;
    const height = list.clientHeight;
    if (!width || !height) return;
    const gap = Number.parseFloat(getComputedStyle(list).columnGap) || 0;
    const columns = innerWidth < 320 ? 1 : Math.max(2, Math.floor((width + gap) / 260));
    const cardwidth = (width - gap * (columns - 1)) / columns;
    const rows = Math.max(1, Math.floor((height - 12 + gap) / (cardwidth * 9 / 16 + gap)));
    const capacity = rows * columns;
    list.style.setProperty("--columns", String(columns));
    if (capacity === pagesize) {fitcards(); return}
    const first = page * pagesize;
    pagesize = capacity;
    if (entries.length) showpage(Math.floor(first / pagesize), "replace");
}

if (window.ResizeObserver) new ResizeObserver(layout).observe(list);
window.addEventListener("resize", layout, {passive: true});
layout();
document.fonts?.ready.then(() => fitcards());

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

catalogue().then(data => {
    if (!Array.isArray(data)) throw new Error("Invalid level data");
    entries = data.filter(entry => !(entry.tags || []).some(tag =>
        tag.id === "1515043686046498997" || /pudding\s*monsters/i.test(tag.name || "")
    ));
    detail.setentries(entries);
    search.setentries(entries);
}).catch(() => {
    list.replaceChildren(element("p", "levelnotice", "levels could not be loaded"));
}).finally(() => list.setAttribute("aria-busy", "false"));

/*//////////////////////////////////////////////////////////////////////*/

list.addEventListener("click", event => {
    const card = event.target.closest(".level");
    if (!card || event.target.closest(".features,.leveltag,.creatorlink") || !getSelection().isCollapsed) return;
    saveposition();
    detail.open(card.dataset.level);
});

list.addEventListener("keydown", event => {
    if (!event.target.matches(".level") || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    saveposition();
    detail.open(event.target.dataset.level);
});

list.addEventListener("keydown", event => {
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
list.addEventListener("scroll", hide, {passive: true});
window.addEventListener("resize", hide, {passive: true});
