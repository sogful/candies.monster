import {layers, platformlabels} from "./layers.js";

function platformname(name) {
    return Object.prototype.hasOwnProperty.call(platformlabels, name) ? name : "android";
}

function values(value) {
    return Array.isArray(value) ? value : [value];
}

function basekey(game) {
    return values(game.package)[0] || `~${values(game.name)[0]}`;
}

export function preparekeys(games) {
    for (const game of games) {
        const key = basekey(game);
        game.routekey ||= games.filter(other => basekey(other) === key).length > 1 ? `${key}~${values(game.name)[0]}` : key;
    }
}

function packagevariant(description) {
    if (/tvos|apple tv/i.test(description)) return "tvos";
    if (/testflight/i.test(description)) return "testflight";
    return "release";
}

export function packagekey(game, index = 0) {
    const route = game.packageroutes?.[index];
    if (route) return route;
    const packages = values(game.package);
    const names = values(game.name);
    const descriptions = values(game.description);
    const name = names[index] || "";
    const key = packages[index] || `~${name}`;
    if (packages.filter(pkg => pkg === packages[index]).length < 2) return key;
    const variant = packagevariant(descriptions[index] || "");
    const matches = packages.filter((pkg, position) => pkg === packages[index] && packagevariant(descriptions[position] || "") === variant);
    return matches.length === 1 ? `${key}~${variant}` : `${key}~${name}~${descriptions[index] || ""}`;
}

export function gameroute(game, index = 0, version = "") {
    return {
        platform: game.platform,
        layer: game.layer,
        game: game.routekey || basekey(game),
        package: index ? packagekey(game, index) : "",
        version,
        info: false
    };
}

export function routehash(route) {
    const query = new URLSearchParams();
    if (route.package) query.set("package", route.package);
    if (route.version) query.set("version", route.version);
    if (route.info) query.set("info", "1");
    if (route.search) query.set("search", route.search);
    if (route.room) query.set("room", "1");
    const layer = route.layer && route.layer !== "omnom" ? `${route.layer}/` : "";
    const path = `#${layer}${platformname(route.platform)}${route.game ? `/${encodeURIComponent(route.game)}` : ""}`;
    return query.size ? `${path}?${query}` : path;
}

export function readhash(hash = location.hash) {
    try {
        const [path, query] = hash.slice(1).split("?");
        const parts = path.split("/");
        const parameters = new URLSearchParams(query);
        const layer = layers.find(item => item.name === parts[0])?.name;
        if (layer) parts.shift();
        const [platform, game = ""] = parts;
        const legacy = layers.find(item => item.name === parameters.get("layer"))?.name;
        const selected = layer || legacy || "omnom";
        const key = decodeURIComponent(game);
        const moved = selected === "zeptolab" && platform === "android" && key === "com.zeptolab.sweetharvest";
        const version = parameters.get("version") || "";
        const gamehouse = platform === "other" && key === "cut-the-rope" && version === "Windows (2012)";
        return {platform: platformname(platform), layer: moved ? "omnom" : selected, moved: moved || gamehouse,
            game: key, package: parameters.get("package") || "", version: gamehouse ? "Windows GameHouse 1.0.0.24" : version,
            info: parameters.get("info") === "1", search: parameters.get("search") || "",
            room: selected === "fangames" && platform === "ios" && !game && parameters.get("room") === "1"};
    } catch {
        return {platform: "android", layer: "omnom", game: "", package: "", version: "", info: false};
    }
}

/*//////////////////////////////////////////////////////////////////////*/

export function shareheading(heading, game, index = 0, version = "") {
    heading.classList.add("sharetitle");
    const link = document.createElement("a");
    link.className = "sharelink clickable";
    link.href = routehash(gameroute(game, index, version));
    link.title = "Copy link";
    link.setAttribute("aria-label", "Copy link");
    link.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" stroke="#000" stroke-width="0.8" paint-order="stroke fill" transform="rotate(45 12 12)" d="M3.9 12a3.1 3.1 0 0 1 3.1-3.1h4V7H7a5 5 0 0 0 0 10h4v-1.9H7A3.1 3.1 0 0 1 3.9 12M8 13h8v-2H8zm9-6h-4v1.9h4a3.1 3.1 0 0 1 0 6.2h-4V17h4a5 5 0 0 0 0-10"/></svg>`;
    heading.appendChild(link);
}

async function copylink(url) {
    try {
        await navigator.clipboard.writeText(url);
    } catch {
        const previous = document.activeElement;
        const field = document.createElement("textarea");
        field.className = "copyfield";
        field.value = url;
        field.readOnly = true;
        document.body.appendChild(field);
        let copied = false;
        try {
            field.select();
            copied = document.execCommand("copy");
        } finally {
            field.remove();
            previous?.focus({preventScroll: true});
        }
        if (!copied) throw new Error("Unable to copy link");
    }
}

export async function revealroute(game, route, iscurrent) {
    await document.fonts.ready;
    if (!iscurrent()) return;
    const key = route.package || packagekey(game);
    const screen = document.querySelector(".versionscreen");
    const candidates = [...screen.querySelectorAll(route.version ? ".versionpanel" : ".gameinfo")]
        .filter(node => node.getClientRects().length && node.dataset.routepackage === key);
    let target = candidates.find(node => !route.version || node.dataset.version === route.version);
    if (!target && route.platform === "other" && route.version) {
        let version = route.version;
        if (version === "Web (WebAssembly)" || (version === "Web" && route.game === "pudding-monsters")) version = "Web (WASM)";
        else if (version === "Web" && route.game === "cut-the-rope-time-travel") version = "Web (Famobi)";
        target = candidates.find(node => node.dataset.version === version || node.dataset.version.startsWith(version + " "));
    }
    if (!target) return;
    const flash = (route.version && target.querySelector(".versioncontent")) || target;
    screen.scrollTop += flash.getBoundingClientRect().top - screen.getBoundingClientRect().top - 16;
    flash.classList.remove("routeflash");
    void flash.offsetWidth;
    flash.classList.add("routeflash");
    flash.addEventListener("animationend", () => flash.classList.remove("routeflash"), {once: true});
}

/*//////////////////////////////////////////////////////////////////////*/

export function startlinks(openroute) {
    let requested = null;
    function write(route, replace = false) {
        const hash = routehash(route);
        requested = hash;
        if (hash !== location.hash) history[replace ? "replaceState" : "pushState"](null, "", hash);
    }
    async function restore(force = false) {
        if (!force && requested === location.hash) return;
        const route = readhash();
        if (route.moved || /[?&]layer=/.test(location.hash)) write(route, true);
        else requested = location.hash;
        await openroute(route);
    }
    window.addEventListener("hashchange", () => {void restore()});
    window.addEventListener("popstate", () => {void restore()});
    document.querySelector(".archiveinfo").addEventListener("toggle", event => {
        write({...readhash(), info: event.target.open});
    });
    document.addEventListener("click", async event => {
        const link = event.target.closest?.(".sharelink");
        if (!link) return;
        event.preventDefault();
        try {
            await copylink(link.href);
            link.title = "Link copied";
            link.setAttribute("aria-label", "Link copied");
        } catch {
            link.title = "Unable to copy link";
            link.setAttribute("aria-label", "Unable to copy link");
        }
    });
    return {write, restore};
}
