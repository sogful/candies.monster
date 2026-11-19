import {resolveversionlabel} from "./load.js";

const platforms = [
    ["Windows / PS3", ["windows", "playstation"]],
    ["Windows Phone", ["windows"]],
    ["Windows Store", ["windows"]],
    ["Windows Steam", ["steam"]],
    ["Windows 8.1", ["windows"]],
    ["Windows 8", ["windows"]],
    ["Windows", ["windows"]],
    ["macOS / Apple TV", ["apple", "tv"]],
    ["macOS", ["apple"]],
    ["Apple TV", ["tv"]],
    ["Linux", ["linux"]],
    ["Nintendo 3DS", ["ds"]],
    ["Nintendo DSi", ["ds"]],
    ["Nintendo DS", ["ds"]],
    ["Nintendo Switch", ["switch"]],
    ["Wii U", ["wii"]],
    ["PS Vita", ["playstation"]],
    ["PSP", ["playstation"]],
    ["BlackBerry", ["blackberry"]],
    ["Symbian", ["phone"]],
    ["Firefox OS", ["firefox"]],
    ["Chrome", ["chrome"]],
    ["Minecraft Bedrock", ["minecraft"]],
    ["Roblox", ["roblox"]],
    ["Web", ["web"]],
    ["Source", ["source"]]
];

/*//////////////////////////////////////////////////////////////////////*/

export function releaseplatform(version) {
    const platform = platforms.find(([name]) => version === name || version.startsWith(name + " "));
    if (!platform) return {label: version, icons: []};
    const [name, icons] = platform;
    return {label: resolveversionlabel(version.slice(name.length)), icons};
}
