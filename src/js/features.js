import {enabled, number} from "./renderer/data.js";

export function features(map, container) {
    const settings = map.settings || {};
    const objects = map.objects || [];
    const labels = [];
    if (number(settings.globalGravityX) !== 0 || number(settings.globalGravityY, 784) !== 784) labels.push("Different gravity");
    if (objects.some(item => enabled(item.isdriven))) labels.push("Flying candy");
    if (map.water > 0) labels.push("Water");
    if (map.split) labels.push("Split candy");
    if (map.night) labels.push("Night");
    if (enabled(settings.candiesConnected)) labels.push("Connected candies");
    if (objects.some(item => item.type === "pauseswitcher")) labels.push("Time freeze");
    container.replaceChildren();
    for (const label of labels) {
        const item = document.createElement("span");
        item.className = "levelfeature";
        item.textContent = label;
        container.append(item);
    }
    container.hidden = !labels.length;
}
