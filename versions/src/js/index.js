import {parsegamescsv, hasdownload, resolveiconpath, resolveiconsrcset} from "./catalogue/load.js";
import {loadcataloguedata} from "./catalogue/data.js";
import {loadversions} from "./catalogue/versions.js";
import {packcircle} from "./packing.js";
import {updatecounts} from "./counts.js";
import {startsearch} from "./search.js";
import {preparekeys, packagekey, gameroute, readhash, revealroute, startlinks} from "./links.js";
import {startlayers} from "./layers.js";
import "/assets/static/js/images/favicon.js";
import "./quality.js";

/*//////////////////////////////////////////////////////////////////////*/

const layers = startlayers();
const platforms = layers.groups.flatMap(group => group.platforms);
const elements = new WeakMap();
let activeplatform = platforms[0];
let currentgame = null;
let currentloadid = 0;
let resizeframe = 0;
let navigation = 0;
let scrolltarget = null;
let search = null;

document.body.classList.add("archivepage");
document.querySelector(".loading")?.remove();
layers.show(activeplatform.layer);

function getplatform(layer, name) {
    return platforms.find(platform => platform.layer === layer && platform.name === name) || platforms[0];
}

function platformstatus(platform, failed = false) {
    const status = document.createElement("div");
    status.className = "platformstatus";
    const message = document.createElement("p");
    message.setAttribute("role", failed ? "alert" : "status");
    // message.textContent = failed ? `Unable to load ${platform.label} games.` : `Loading ${platform.label} games...`;
    status.appendChild(message);
    if (failed) {
        const retry = document.createElement("button");
        retry.className = "retryplatform clickable";
        retry.type = "button";
        retry.dataset.platform = platform.name;
        retry.textContent = "Retry";
        status.appendChild(retry);
    }
    platform.circle.replaceChildren(status);
}

function platformfailure(platform, error) {
    platform.text = null;
    platform.games = null;
    platform.nodes = null;
    platform.stamp = null;
    platform.error = error;
    if (platform.layer === "omnom") updatecounts(platform.name, null);
    console.error(`Unable to load ${platform.url}`, error);
    if (platform === activeplatform) platformstatus(platform, true);
}

function prepareplatform(platform) {
    if (platform.games || platform.text == null) return;
    const parsed = parsegamescsv(platform.text);
    if (!parsed.games.length && platform.layer === "omnom") throw new Error(`No games in ${platform.url}`);
    platform.games = parsed.games.map(game => ({...game, layer: platform.layer, iosstuff: platform.name === "ios"}));
    platform.games.sort((first, second) => {
        const importance = second.importance - first.importance;
        if (importance) return importance;
        const firstkey = JSON.stringify([first.package, first.name]);
        const secondkey = JSON.stringify([second.package, second.name]);
        return firstkey < secondkey ? -1 : firstkey > secondkey ? 1 : 0;
    });
    preparekeys(platform.games);
    platform.cache = parsed.versionscache;
    platform.games.forEach(game => {
        const key = game.verkey ?? game.package;
        const keys = Array.isArray(key) ? key : [key];
        game.available = keys.some(value => (platform.cache.get(value) || []).some(version => hasdownload(version.downloads)));
    });
    if (platform.layer === "omnom") updatecounts(platform.name, platform.cache);
    platform.text = null;
}

function mountplatform(platform) {
    prepareplatform(platform);
    if (!platform.games) return;
    if (!platform.nodes) {
        if (!platform.games.length) {
            const empty = document.createElement("p");
            empty.className = "layerempty";
            empty.textContent = "no versions yet";
            platform.circle.replaceChildren(empty);
            return;
        }
        const fragment = document.createDocumentFragment();
        platform.nodes = platform.games.map((game, index) => {
            const icon = document.createElement("div");
            icon.className = "gameicon clickable";
            const key = game.verkey ?? game.package;
            icon.classList.toggle("unavailable", !game.available);
            icon.dataset.gameid = Array.isArray(key) ? key[0] : key;
            const image = document.createElement("img");
            image.loading = "lazy";
            image.decoding = "async";
            image.fetchPriority = index === 0 ? "high" : "low";
            image.draggable = false;
            image.alt = Array.isArray(game.name) ? game.name[0] : game.name;
            image.addEventListener("error", () => {
                image.dataset.source = "unknown/default";
                updateicon(image, image.getBoundingClientRect().width);
            }, {once: true});
            const source = (Array.isArray(game.icon) ? game.icon[0] : game.icon) || "unknown/default";
            image.dataset.source = source;
            icon.appendChild(image);
            elements.set(icon, game);
            fragment.appendChild(icon);
            return icon;
        });
        platform.circle.replaceChildren(fragment);
        platform.circle.classList.remove("rendering");
    }
    layoutplatform(platform);
    if (platform === activeplatform) {
        platform.nodes.forEach(node => updateicon(node.querySelector("img"), parseFloat(node.style.width)));
    }
}

function fetchplatform(platform) {
    if (platform.promise) return platform.promise;
    if (platform.games || platform.text != null) {
        try {
            if (platform === activeplatform) mountplatform(platform);
        } catch (error) {
            platformfailure(platform, error);
        }
        return Promise.resolve();
    }
    if (platform === activeplatform) platformstatus(platform);
    platform.promise = (async () => {
        const [response] = await Promise.all([fetch(platform.url), loadcataloguedata()]);
        if (!response.ok) throw new Error(`${platform.url}: HTTP ${response.status}`);
        platform.text = await response.text();
        platform.error = null;
        if (platform === activeplatform) mountplatform(platform);
        else {
            const prepare = () => {
                try {
                    prepareplatform(platform);
                } catch (error) {
                    platformfailure(platform, error);
                }
            };
            if ("requestIdleCallback" in window) requestIdleCallback(prepare, {timeout: 1500});
            else setTimeout(prepare, 0);
        }
    })().catch(error => platformfailure(platform, error)).finally(() => {
        platform.promise = null;
    });
    return platform.promise;
}

/*//////////////////////////////////////////////////////////////////////*/

function updateicon(image, size) {
    const pixels = size * (window.devicePixelRatio || 1) * (window.visualViewport?.scale || 1);
    const source = resolveiconpath(image.dataset.source, pixels);
    if (image.getAttribute("src") === source) return;
    image.srcset = resolveiconsrcset(image.dataset.source, pixels);
    image.src = source;
}

function layoutplatform(platform) {
    if (!platform.nodes) return;
    const mobile = window.innerWidth <= 650;
    const bounds = platform.circle.getBoundingClientRect();
    const width = bounds.width || Math.min(window.innerWidth * 0.9, 800);
    const style = getComputedStyle(platform.screen);
    const height = Math.max(1, platform.screen.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom));
    const stamp = `${width},${height},${mobile}`;
    if (platform.stamp === stamp) return;
    platform.stamp = stamp;
    const nodes = [...platform.nodes];
    if (mobile) nodes.sort((first, second) => Number(elements.get(second).available) - Number(elements.get(first).available));
    nodes.forEach((node, index) => {
        if (platform.circle.children[index] !== node) platform.circle.insertBefore(node, platform.circle.children[index] || null);
    });
    /*
    if (mobile) {
        const size = Math.min(80, Math.max(50, 50 + 30 * ((window.innerWidth - 220) / 380)));
        platform.nodes.forEach(node => {
            node.removeAttribute("style");
            updateicon(node.querySelector("img"), size);
        });
        return;
    }
    */
    const packed = packcircle(nodes.map(node => elements.get(node)), width, height);
    platform.circle.style.setProperty("--circleheight", `${packed.height}px`);
    nodes.forEach((node, index) => {
        const position = packed.positions[index];
        node.style.width = `${position.size}px`;
        node.style.height = `${position.size}px`;
        node.style.left = `${position.left}px`;
        node.style.top = `${position.top}px`;
        node.style.position = "absolute";
        if (platform === activeplatform) updateicon(node.querySelector("img"), position.size);
    });
}

/*//////////////////////////////////////////////////////////////////////*/

function containerscroll() {
    activeplatform.container.scrollTo({left: activeplatform.screen.offsetLeft, behavior: "instant"});
}

function activateplatform(platform, scroll = true, write = true, animate = false) {
    if (currentgame) return;
    const changed = activeplatform.layer !== platform.layer;
    activeplatform = platform;
    if (changed) layers.show(platform.layer, animate);
    if (write) {
        navigation++;
        document.documentElement.classList.remove("routepending");
        links.write({platform: platform.name, layer: platform.layer});
    }
    document.querySelector("#navios").style.display = platform.name === "ios" ? "none" : "flex";
    document.querySelector("#navandroid").style.display = platform.name === "ios" ? "flex" : "none";
    void fetchplatform(platform);
    const offset = platform.screen.offsetLeft;
    scrolltarget = scroll && Math.abs(platform.container.scrollLeft - offset) > 1 ? platform : null;
    if (changed || scroll) platform.container.scrollTo({left: offset, behavior: changed ? "instant" : "smooth"});
}

async function selectgame(game, write = true) {
    search?.hide(false);
    if (write) {navigation++; document.documentElement.classList.remove("routepending"); links.write(gameroute(game))}
    const loadid = ++currentloadid;
    const platform = getplatform(game.layer, game.iosstuff ? "ios" : "android");
    activeplatform = platform;
    currentgame = game;
    document.body.classList.add("gameopen");
    const alreadyshown = document.querySelector("#versionscreen").classList.contains("active");
    const packages = Array.isArray(game.package) ? game.package : [game.package];
    await loadversions(packages, game, loadid, alreadyshown, platform.cache, id => id === currentloadid, containerscroll, platform.screen);
}

function goback(write = true) {
    if (write) {navigation++; document.documentElement.classList.remove("routepending")}
    currentloadid++;
    const game = currentgame;
    platforms.forEach(platform => platform.screen.classList.remove("slideleft"));
    document.querySelector("#versionscreen").classList.remove("active");
    document.querySelector(".backbutton").classList.remove("active");
    currentgame = null;
    activateplatform(activeplatform, false, false);
    if (write) links.write({platform: activeplatform.name, layer: activeplatform.layer});
    layoutplatform(activeplatform);
    if (game) containerscroll();
    document.body.classList.remove("gameopen");
}

document.addEventListener("click", event => {
    const control = event.target.closest?.(".clickable, .scrollnav");
    if (!control) return;
    const sound = document.querySelector(".click");
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }
    if (control.classList.contains("gameicon")) {
        const game = elements.get(control);
        if (game) void selectgame(game);
    } else if (control.classList.contains("backbutton")) {
        event.preventDefault();
        if (search.shown) search.hide();
        else goback();
    } else if (control.classList.contains("retryplatform")) {
        const platform = getplatform(activeplatform.layer, control.dataset.platform);
        if (platform) void fetchplatform(platform).then(() => links.restore(true));
    } else if (control.classList.contains("scrollnav")) {
        activateplatform(getplatform(activeplatform.layer, control.id === "navios" ? "ios" : "android"));
    } else if (control.classList.contains("layerarrow")) {
        document.querySelector(".archiveinfo").open = false;
        activateplatform(getplatform(control.dataset.layer, activeplatform.name), true, true, true);
    }
});

for (const group of layers.groups) {
    const container = group.container;
    function scrollplatform(event) {
        if (currentgame || search?.shown || activeplatform.layer !== group.name) return;
        if (event.type === "scrollend") scrolltarget = null;
        if (scrolltarget) {
            if (Math.abs(container.scrollLeft - scrolltarget.screen.offsetLeft) < 1) scrolltarget = null;
            return;
        }
        const platform = group.platforms[container.scrollLeft >= group.platforms[1].screen.offsetLeft / 2 ? 1 : 0];
        if (platform !== activeplatform) activateplatform(platform, false);
    }
    container.addEventListener("scroll", scrollplatform, {passive: true});
    container.addEventListener("scrollend", scrollplatform, {passive: true});
}

function schedulelayout() {
    if (resizeframe) return;
    resizeframe = requestAnimationFrame(() => {
        resizeframe = 0;
        if (!currentgame) platforms.forEach(layoutplatform);
        containerscroll();
    });
}

window.addEventListener("resize", schedulelayout);
window.addEventListener("resize", () => layers.show(activeplatform.layer), {passive: true});
const boundsobserver = new ResizeObserver(schedulelayout);
platforms.forEach(platform => boundsobserver.observe(platform.circle));

async function restoreview(route) {
    const request = ++navigation;
    search?.hide(false);
    document.documentElement.classList.add("routepending");
    try {
        if (currentgame) goback(false);
        const platform = getplatform(route.layer, route.platform);
        activateplatform(platform, false, false);
        await fetchplatform(platform);
        if (request !== navigation) return;
        prepareplatform(platform);
        if (route.search && !route.game) {
            containerscroll();
            document.documentElement.classList.remove("routepending");
            await search.restore(route.search);
            return;
        }
        let game = platform.games?.find(item => item.routekey === route.game);
        if (!game && route.game) {
            game = platform.games?.find(item => (Array.isArray(item.package) ? item.package : [item.package]).includes(route.game));
            if (game) {
                const index = (Array.isArray(game.package) ? game.package : [game.package]).indexOf(route.game);
                route = {...route, game: game.routekey, package: route.package || (index ? packagekey(game, index) : "")};
            }
        }
        if (game) {
            await selectgame(game, false);
            if (request !== navigation) return;
            containerscroll();
            await revealroute(game, route, () => request === navigation);
        } else {
            containerscroll();
        }
        if (request !== navigation) return;
        document.querySelector(".archiveinfo").open = route.info;
    } finally {
        if (request === navigation) document.documentElement.classList.remove("routepending");
    }
}

const links = startlinks(restoreview);
search = startsearch({
    platforms,
    selected: () => activeplatform.name,
    select: name => {
        activateplatform(getplatform(activeplatform.layer, name), false, false);
        containerscroll();
    },
    ready: async () => {
        const selected = platforms.filter(platform => platform.name === activeplatform.name);
        await Promise.all(selected.map(fetchplatform));
        selected.forEach(prepareplatform);
        if (!selected.some(platform => platform.games)) throw selected[0].error;
        return selected;
    },
    close: () => {
        navigation++;
        document.documentElement.classList.remove("routepending");
        if (currentgame) goback(false);
    },
    write: (query, replace) => links.write({platform: activeplatform.name, layer: activeplatform.layer, search: query}, replace),
    open: async route => {links.write(route); await restoreview(route)}
});
const initial = new URL(location.href);
const prefill = initial.searchParams.get("search");
if (prefill !== null) {
    initial.searchParams.delete("search");
    history.replaceState(null, "", initial);
    if (!readhash().game) links.write({...readhash(), search: prefill}, true);
} else if (!location.hash) links.write({platform: "android"}, true);
if (readhash().game) document.documentElement.classList.add("routepending");
layers.groups[0].platforms.forEach(platform => {void fetchplatform(platform)});
void links.restore(true);
