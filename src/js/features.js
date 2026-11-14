import {enabled, number} from "./renderer/data.js";
import {featurecontent} from "./tags.js";

export const featuretypes = {
    gravity: "Different gravity", flying: "Flying candy", water: "Water",
    split: "Split candy", night: "Night", connected: "Connected candies", timefreeze: "Time freeze"
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
    for (const key of keys) {
        const item = document.createElement("span");
        item.className = "leveltag";
        item.append(featurecontent(key, featuretypes[key]));
        container.append(item);
    }
    container.hidden = !keys.length;
}
