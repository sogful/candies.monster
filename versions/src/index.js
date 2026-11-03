import {parsegamescsv, hasdownload, resolveiconpath, resolveiconsrcset} from "./load.js";
import {loadversions} from "./versions.js";
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
            const keys = Array.isArray(key) ? key : [key];
            const available = keys.some(value => (platform.cache.get(value) || []).some(version => hasdownload(version.downloads)));
            icon.classList.toggle("unavailable", !available);
            icon.dataset.gameid = Array.isArray(key) ? key[0] : key;
            const image = document.createElement("img");
            image.loading = "lazy";
            image.decoding = "async";
            image.fetchPriority = index === 0 ? "high" : "low";
            image.draggable = false;
            image.alt = Array.isArray(game.name) ? game.name[0] : game.name;
            image.addEventListener("error", () => {
                image.srcset = resolveiconsrcset("unknown/default");
                image.src = resolveiconpath("unknown/default");
            }, {once: true});
            const source = (Array.isArray(game.icon) ? game.icon[0] : game.icon) || "unknown/default";
            image.srcset = resolveiconsrcset(source);
            image.src = resolveiconpath(source);
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

function packcircle(games, width, height) {
    const placed = [];
    const centerx = width / 2;
    const centery = height / 2;
    const importance = games.length ? games[0].importance - games[games.length - 1].importance : 0;

    for (let index = 0; index < games.length; index++) {
        const game = games[index];
        const size = 50 + (game.importance - 3) * 5.7;
        let x = centerx - size / 2;
        let y = centery - size / 2;
        if (index) {
            const weight = importance > 0 ? (game.importance - games[games.length - 1].importance) / importance : 1 - index / Math.max(1, games.length - 1);
            const minimum = size * 0.65;
            const maximumradius = Math.min(size * 2, Math.min(width, height) * 0.4);
            const radius = minimum + (1 - weight) * (maximumradius - minimum);
            const angle = (index - 1) * Math.PI * (3 - Math.sqrt(5));
            let targetx = centerx + Math.cos(angle) * radius;
            let targety = centery + Math.sin(angle) * radius;
            let overlapping = true;
            let attempt = 0;
            while (overlapping && attempt < 50) {
                overlapping = false;
                for (const other of placed) {
                    const differencex = targetx - other.x;
                    const differencey = targety - other.y;
                    const squared = differencex * differencex + differencey * differencey;
                    const distance = (size + other.size) / 2 + 12;
                    if (squared < distance * distance) {
                        overlapping = true;
                        if (squared > 0) {
                            const actual = Math.sqrt(squared);
                            const push = distance - actual + 1;
                            const direction = Math.atan2(differencey, differencex);
                            targetx += Math.cos(direction) * push;
                            targety += Math.sin(direction) * push;
                        } else {
                            const direction = Math.random() * Math.PI * 2;
                            targetx += Math.cos(direction) * (distance + 1);
                            targety += Math.sin(direction) * (distance + 1);
                        }
                        targetx = Math.max(size / 2, Math.min(width - size / 2, targetx));
                        targety = Math.max(size / 2, Math.min(height - size / 2, targety));
                        break;
                    }
                }
                attempt++;
            }
            if (overlapping) {
                outer:
                for (let radius = minimum; radius <= Math.min(width, height) * 0.5; radius += size * 0.4) {
                    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
                        const candidatex = centerx + Math.cos(angle) * radius;
                        const candidatey = centery + Math.sin(angle) * radius;
                        let colliding = false;
                        for (const other of placed) {
                            const differencex = candidatex - other.x;
                            const differencey = candidatey - other.y;
                            const distance = (size + other.size) / 2 + 12;
                            if (differencex * differencex + differencey * differencey < distance * distance) {
                                colliding = true;
                                break;
                            }
                        }
                        if (!colliding) {
                            targetx = candidatex;
                            targety = candidatey;
                            break outer;
                        }
                    }
                }
            }
            x = targetx - size / 2;
            y = targety - size / 2;
        }
        x = Math.max(0, Math.min(width - size, x));
        y = Math.max(0, Math.min(height - size, y));
        const item = {x: x + size / 2, y: y + size / 2, size, index, left: x, top: y};
        placed.push(item);
    }
    return placed;
}

function layoutplatform(platform) {
    if (!platform.nodes) return;
    const mobile = window.innerWidth < 650;
    const bounds = platform.circle.getBoundingClientRect();
    const width = bounds.width || Math.min(window.innerWidth * 0.9, 800);
    const height = bounds.height || Math.max(Math.min(window.innerHeight * 0.9, 800), 600);
    const stamp = mobile ? "mobile" : `${width},${height}`;
    if (platform.stamp === stamp) return;
    platform.stamp = stamp;
    if (mobile) {
        platform.nodes.forEach(node => node.removeAttribute("style"));
        return;
    }
    const positions = packcircle(platform.games, width, height);
    platform.nodes.forEach((node, index) => {
        const position = positions[index];
        node.style.width = `${position.size}px`;
        node.style.height = `${position.size}px`;
        node.style.left = `${position.left}px`;
        node.style.top = `${position.top}px`;
        node.style.position = "absolute";
    });
}

/*//////////////////////////////////////////////////////////////////////*/

function containerscroll(game) {
    const platform = platforms[game?.iosstuff ? 1 : 0];
    container.scrollTo({left: platform.screen.offsetLeft, behavior: "smooth"});
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
    });
});

platforms.forEach(platform => {void fetchplatform(platform)});
