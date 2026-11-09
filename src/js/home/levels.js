import {leveldetails} from "./leveldetail.js";

const list = document.querySelector(".levels");
const advert = document.querySelector(".morestuff");
const ads = Array.from(advert.querySelectorAll(".carousel a"));
const previous = document.querySelector(".previous");
const next = document.querySelector(".next");
const pagesize = 10;
const detail = leveldetails();
let entries = [];
let page = 0;
let adindex = 0;
let definitions = null;
let loading = null;
let active = null;
const tooltip = document.createElement("div");
tooltip.className = "tooltip";
tooltip.hidden = true;
document.body.appendChild(tooltip);

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
    header.append(element("p", "title", entry.title), element("p", "creator", `by ${entry.creator}`));
    const footer = element("div", "footer");
    const rating = element("div", "rating");
    rating.append(element("p", "", String(entry.rating)), picture("/assets/images/stars/star1.png", "", "stars"));
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
    footer.append(rating, features);
    if (entry.background) card.append(picture(entry.background, "levelbg"));
    card.append(header, footer);
    return card;
}

function showpage(number) {
    const pages = Math.max(1, Math.ceil(entries.length / pagesize));
    page = Math.max(0, Math.min(number, pages - 1));
    hide();
    const content = document.createDocumentFragment();
    for (const entry of entries.slice(page * pagesize, (page + 1) * pagesize)) content.append(createlevel(entry));
    if (!entries.length) content.append(element("p", "levelnotice", "no levels yet"));
    list.replaceChildren(content);
    list.scrollTop = 0;
    list.setAttribute("aria-label", `levels, page ${page + 1} of ${pages}`);
    previous.disabled = page === 0;
    next.disabled = page >= pages - 1;
}

for (const [control, offset, sprite] of [[previous, -1, "up"], [next, 1, "down"]]) {
    const arrow = control.querySelector(".arrow");
    function release() {arrow.src = `/assets/images/buttons/${sprite}.png`}
    control.addEventListener("click", () => showpage(page + offset));
    control.addEventListener("pointerdown", event => {
        if (event.button !== 0 || control.disabled) return;
        control.setPointerCapture(event.pointerId);
        arrow.src = `/assets/images/buttons/${sprite}active.png`;
    });
    control.addEventListener("pointerup", release);
    control.addEventListener("pointercancel", release);
    control.addEventListener("lostpointercapture", release);
}

fetch(new URL("../../data/test.json", import.meta.url)).then(response => {
    if (!response.ok) throw new Error("Levels unavailable");
    return response.json();
}).then(data => {
    if (!Array.isArray(data)) throw new Error("Invalid level data");
    entries = data;
    detail.setentries(data);
    showpage(0);
}).catch(() => {
    list.replaceChildren(element("p", "levelnotice", "levels could not be loaded"));
}).finally(() => list.setAttribute("aria-busy", "false"));

/*//////////////////////////////////////////////////////////////////////*/

list.addEventListener("click", event => {
    const card = event.target.closest(".level");
    if (!card || event.target.closest(".features")) return;
    detail.open(card.dataset.level);
});

list.addEventListener("keydown", event => {
    if (!event.target.matches(".level") || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    detail.open(event.target.dataset.level);
});

list.addEventListener("keydown", event => {
    const more = event.target.closest(".morefeatures");
    if (!more || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    more.click();
});

function showad(change) {
    adindex = (adindex + change + ads.length) % ads.length;
    ads.forEach((link, index) => {link.hidden = index !== adindex});
}

document.querySelector(".adleft").addEventListener("click", () => showad(-1));
document.querySelector(".adright").addEventListener("click", () => showad(1));
document.querySelector(".adclose").addEventListener("click", () => {advert.open = false});

/*//////////////////////////////////////////////////////////////////////*/

function loadfeatures() {
    if (!loading) {
        loading = fetch(new URL("../../data/features.json", import.meta.url)).then(response => {
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
    if (advert.open && !advert.contains(event.target)) advert.open = false;
});

document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    hide();
    for (const features of document.querySelectorAll(".features.expanded")) {
        features.classList.remove("expanded");
        features.querySelector(".morefeatures").setAttribute("aria-expanded", "false");
    }
    advert.open = false;
});
list.addEventListener("scroll", hide, {passive: true});
window.addEventListener("resize", hide, {passive: true});
