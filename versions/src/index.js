import {parsegamescsv, hasdownload, resolveiconpath, resolveiconsrcset} from "./load.js";
import {loadversions} from "./versions.js";
import {packcircle} from "./packing.js";
import {updatecounts} from "./counts.js";
import "/assets/static/favicon.js";

/*//////////////////////////////////////////////////////////////////////*/

const platforms = [
    {name: "android", label: "Android", url: "android.csv", circle: document.querySelector("#gamecircle"), screen: document.querySelector("#gamescreen")},
    {name: "ios", label: "iOS", url: "ios.csv", circle: document.querySelector("#gamecircle-ios"), screen: document.querySelector("#gamescreenios")}
];
const container = document.querySelector(".container");
const elements = new WeakMap();
let activeplatform = platforms[0];
let currentgame = null;
let currentloadid = 0;
let resizeframe = 0;

document.querySelector(".loading")?.remove();

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
    updatecounts(platform.name, null);
    console.error(`Unable to load ${platform.url}`, error);
    if (platform === activeplatform) platformstatus(platform, true);
}

function prepareplatform(platform) {
    if (platform.games || platform.text == null) return;
    const parsed = parsegamescsv(platform.text);
    if (!parsed.games.length) throw new Error(`No games in ${platform.url}`);
    platform.games = parsed.games.map(game => ({...game, iosstuff: platform.name === "ios"}));
    platform.games.sort((first, second) => second.importance - first.importance);
    platform.cache = parsed.versionscache;
    platform.games.forEach(game => {
        const key = game.verkey ?? game.package;
        const keys = Array.isArray(key) ? key : [key];
        game.available = keys.some(value => (platform.cache.get(value) || []).some(version => hasdownload(version.downloads)));
    });
    updatecounts(platform.name, platform.cache);
    platform.text = null;
}

function mountplatform(platform) {
    prepareplatform(platform);
    if (!platform.games) return;
    if (!platform.nodes) {
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
        const response = await fetch(platform.url);
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
    const source = resolveiconpath(image.dataset.source, size);
    if (image.getAttribute("src") === source) return;
    image.srcset = resolveiconsrcset(image.dataset.source, size);
    image.src = source;
}

function layoutplatform(platform) {
    if (!platform.nodes) return;
    const mobile = window.innerWidth <= 650;
    const bounds = platform.circle.getBoundingClientRect();
    const width = bounds.width || Math.min(window.innerWidth * 0.9, 800);
    const stamp = `${width},${mobile}`;
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
    const packed = packcircle(nodes.map(node => elements.get(node)), width);
    platform.circle.style.setProperty("--circleheight", `${packed.height}px`);
    nodes.forEach((node, index) => {
        const position = packed.positions[index];
        node.style.width = `${position.size}px`;
        node.style.height = `${position.size}px`;
        node.style.left = `${position.left}px`;
        node.style.top = `${position.top}px`;
        node.style.position = "absolute";
        updateicon(node.querySelector("img"), position.size);
    });
}

/*//////////////////////////////////////////////////////////////////////*/

function containerscroll(game) {
    const platform = platforms[game?.iosstuff ? 1 : 0];
    container.scrollTo({left: platform.screen.offsetLeft, behavior: "instant"});
}

function activateplatform(platform, scroll = true) {
    if (currentgame) return;
    activeplatform = platform;
    document.querySelector("#navios").style.display = platform.name === "ios" ? "none" : "flex";
    document.querySelector("#navandroid").style.display = platform.name === "ios" ? "flex" : "none";
    void fetchplatform(platform);
    if (scroll) container.scrollTo({left: platform.screen.offsetLeft, behavior: "smooth"});
}

async function selectgame(game) {
    const loadid = ++currentloadid;
    const platform = platforms[game.iosstuff ? 1 : 0];
    activeplatform = platform;
    currentgame = game;
    document.body.classList.add("gameopen");
    const alreadyshown = document.querySelector("#versionscreen").classList.contains("active");
    const packages = Array.isArray(game.package) ? game.package : [game.package];
    await loadversions(packages, game, loadid, alreadyshown, platform.cache, id => id === currentloadid, containerscroll);
}

function goback() {
    currentloadid++;
    const game = currentgame;
    platforms.forEach(platform => platform.screen.classList.remove("slideleft"));
    document.querySelector("#versionscreen").classList.remove("active");
    document.querySelector(".backbutton").classList.remove("active");
    currentgame = null;
    activateplatform(game ? platforms[game.iosstuff ? 1 : 0] : activeplatform, false);
    layoutplatform(activeplatform);
    if (game) containerscroll(game);
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
        goback();
    } else if (control.classList.contains("retryplatform")) {
        const platform = platforms.find(item => item.name === control.dataset.platform);
        if (platform) void fetchplatform(platform);
    } else if (control.classList.contains("scrollnav")) {
        activateplatform(platforms[control.id === "navios" ? 1 : 0]);
    }
});

container.addEventListener("scroll", () => {
    if (currentgame) return;
    const platform = platforms[container.scrollLeft >= platforms[1].screen.offsetLeft / 2 ? 1 : 0];
    if (platform !== activeplatform) activateplatform(platform, false);
}, {passive: true});

window.addEventListener("resize", () => {
    if (resizeframe) return;
    resizeframe = requestAnimationFrame(() => {
        resizeframe = 0;
        if (!currentgame) layoutplatform(activeplatform);
        container.scrollTo({left: activeplatform.screen.offsetLeft, behavior: "instant"});
    });
});

platforms.forEach(platform => {void fetchplatform(platform)});
