import {filterscroll} from "../filters/controls.js";

export const tagdata = fetch("/assets/static/data/levels/tags.json").then(response => {
    if (!response.ok) throw new Error("Tags unavailable");
    return response.json();
}).catch(() => ({tags: [], features: {}}));

let tagicons = {};
let tagnames = {};
let aliases = {};
let definitions = new Map();
tagdata.then(data => {
    tagicons = data.features || {};
    tagnames = data.icons || {};
    aliases = data.aliases || {};
    definitions = new Map((data.tags || []).map(tag => [tag.id, tag]));
});

export function tagid(id) {return aliases[id] || id}

const hiddenfilters = new Set(["denied", "finalist", "invalid submission", "will be on the mod", "winner"]);
const tagorder = ["cut the rope", "experiments", "time travel", "cut the rope dx", "cut the rope 2", "magic", "modded", "quality level", "kaizo", "troll", "uses bugs", "night level", "garbage"];

export function filtertag(tag) {return !hiddenfilters.has(tag.name.toLowerCase())}

export function sorttags(tags) {
    return [...tags].sort((first, second) => {
        const left = tagorder.indexOf(first.name.toLowerCase());
        const right = tagorder.indexOf(second.name.toLowerCase());
        return (left < 0 ? 100 : left) - (right < 0 ? 100 : right) || first.name.localeCompare(second.name);
    });
}

export function canonicaltags(tags) {
    return sorttags([...new Map(tags.map(tag => {
        const id = tagid(tag.id);
        return [id, definitions.get(id) || {...tag, id}];
    })).values()]);
}

export function featurecontent(key, name) {
    return tagcontent({name, icon: tagicons[key]});
}

export function candycontent(name) {
    return tagcontent({name: name[0].toUpperCase() + name.slice(1)});
}

/*//////////////////////////////////////////////////////////////////////*/

export function tagcontent(tag) {
    const content = document.createDocumentFragment();
    const emoji = tag.emoji;
    const icon = tag.icon || (!emoji?.id && !emoji?.name ? tagnames[(tag.name || "").toLowerCase()] : "");
    if (icon?.startsWith("/")) {
        const image = document.createElement("img");
        image.className = "tagemoji";
        image.src = icon;
        image.alt = "";
        image.draggable = false;
        content.append(image);
    } else if (icon) {
        const span = document.createElement("span");
        span.className = "tagemoji";
        span.textContent = icon;
        content.append(span);
    } else if (emoji?.id && /^\d{17,22}$/.test(emoji.id)) {
        const image = document.createElement("img");
        image.className = "tagemoji";
        image.src = "https://cdn.discordapp.com/emojis/" + emoji.id + ".webp?size=32";
        image.alt = emoji.name || "";
        image.draggable = false;
        content.append(image);
    } else if (emoji?.name) {
        const image = document.createElement("span");
        image.className = "tagemoji";
        image.textContent = emoji.name;
        content.append(image);
    }
    const name = document.createElement("span");
    name.textContent = tag.name || "";
    content.append(name);
    return content;
}

export function tags(entry, container) {
    container.replaceChildren();
    for (const tag of sorttags(entry.tags || [])) {
        const item = document.createElement("button");
        item.className = "leveltag clickable";
        item.type = "button";
        item.append(tagcontent(tag));
        item.addEventListener("click", () => {
            history.pushState(null, "", location.pathname + location.search);
            window.dispatchEvent(new HashChangeEvent("hashchange"));
            document.dispatchEvent(new CustomEvent("leveltagfilter", {detail: {id: tag.id, selected: true}}));
        });
        container.append(item);
    }
    container.hidden = !container.childElementCount;
    if (!container.dataset.scroller) {filterscroll(container); container.dataset.scroller = "true"}
}

/*//////////////////////////////////////////////////////////////////////*/

import {enabled, number} from "/src/js/browser/renderer/data.js";

export const featuretypes = {
    gravity: "Custom gravity", water: "Water", night: "Night",
    flying: "Flying candy", split: "Split candy", connected: "Connected candies", timefreeze: "Time freeze"
};

export function featurekeys(map) {
    const settings = map.settings || {};
    const objects = map.objects || [];
    const keys = [];
    if (number(settings.globalGravityX) !== 0 || number(settings.globalGravityY, 784) !== 784) keys.push("gravity");
    if (objects.some(item => enabled(item.isdriven))) keys.push("flying");
    if (map.water > 0) keys.push("water");
    if (map.split) keys.push("split");
    if (map.night) keys.push("night");
    if (enabled(settings.candiesConnected)) keys.push("connected");
    if (objects.some(item => item.type === "pauseswitcher")) keys.push("timefreeze");
    return keys;
}

/*//////////////////////////////////////////////////////////////////////*/

export function features(map, container) {
    const keys = featurekeys(map);
    container.replaceChildren();
    for (const key of Object.keys(featuretypes).filter(key => keys.includes(key))) {
        const item = document.createElement("span");
        item.className = "leveltag";
        item.append(featurecontent(key, featuretypes[key]));
        container.append(item);
    }
    container.hidden = !keys.length;
    if (!container.dataset.scroller) {filterscroll(container); container.dataset.scroller = "true"}
}


const scenery = new Map();
let tagbackdrops = {};
tagdata.then(data => {tagbackdrops = data.backdrops || {}});

export function fallback(entry) {
    if (entry.engine === "Cut the Rope: Time Travel") return tagbackdrops["time travel"]?.[0] || "/assets/images/music/bgs/cardboard.webp";
    if (!/^Cut the Rope(?:: Magic| 2)$/.test(entry.engine || "")) return "/assets/images/bgs/rainbowtiny.webp";
    if (scenery.has(entry.id)) return scenery.get(entry.id);
    const key = entry.engine === "Cut the Rope: Magic" ? "magic" : "cut the rope 2";
    const choices = tagbackdrops[key] || [];
    const image = choices[Math.floor(Math.random() * choices.length)] || "/assets/images/music/bgs/cardboard.webp";
    scenery.set(entry.id, image);
    return image;
}
