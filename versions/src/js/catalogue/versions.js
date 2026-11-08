import {packagekey, shareheading} from "../links.js";
import {downloadattribute, renderdownloads, secondarydownload} from "./downloads.js";
import {hasdownload, resolveiconpath, resolveiconsrcset, resolverawiconpath, resolveversionlabel} from "./load.js";

/*//////////////////////////////////////////////////////////////////////*/

const debugshowleaks = true;
const debugshowapks = false;
const prepared = new WeakMap();
let lastview = null;
let legacyicons = null;
let legacypromise = null;

function packageiconhtml(game, index) {
    const list = game.pkgIconsList;
    const urls = list && (list[index] ?? list[0]);
    if (!urls || urls.length < 2) return "";
    return `<div class="packageicons">${urls.map(url => `<a class="clickable" href="${downloadattribute(resolverawiconpath(url))}" target="_blank" rel="noopener" aria-label="open original icon"><img src="${downloadattribute(resolveiconpath(url, iconpixels(32)))}" alt="" draggable="false" loading="lazy" decoding="async" width="32" height="32"></a>`).join("")}</div>`;
}

function iconpixels(size) {
    return size * (window.devicePixelRatio || 1) * (window.visualViewport?.scale || 1);
}

function isdownloadbuttonvisible(download) {
    if (download.arch && download.size) {
        if (download.url.includes("cdn.candies.monster/leaks/") && !debugshowleaks) return false;
        if (download.url.includes("cdn.candies.monster/apks/") && !debugshowapks && download.kind !== "archive") return false;
    }
    return true;
}

function uniquedownloads(downloads) {
    const seen = new Map();
    for (const download of downloads || []) {
        if (!download?.url) continue;
        const iscdn = (download.arch && download.size) || download.url.includes("cdn.candies.monster");
        const sourcekey = iscdn ? `${download.url}|${download.arch || ""}|${download.size || ""}` : download.url;
        const key = `${download.kind || "app"}|${sourcekey}`;
        if (!seen.has(key)) seen.set(key, {...download});
        else {
            const existing = seen.get(key);
            for (const field of ["note", "label"]) {
                existing[field] = Array.from(new Set([existing[field], download[field]].filter(Boolean))).join("; ");
            }
        }
    }
    return Array.from(seen.values());
}

/*//////////////////////////////////////////////////////////////////////*/

export function versionsfor(cache, key) {
    if (!prepared.has(cache)) prepared.set(cache, new Map());
    const packages = prepared.get(cache);
    if (packages.has(key)) return packages.get(key);
    const merged = new Map();
    for (const item of cache.get(key) || []) {
        const version = resolveversionlabel(item.version);
        const normalized = version.toLowerCase();
        if (!merged.has(normalized)) {
            merged.set(normalized, {...item, version});
        } else {
            const existing = merged.get(normalized);
            const oldcount = (existing.downloads || []).length;
            const newcount = (item.downloads || []).length;
            existing.downloads = uniquedownloads([...(existing.downloads || []), ...(item.downloads || [])]);
            if (newcount > oldcount) {
                if (item.icon) existing.icon = item.icon;
                if (item.details) existing.details = item.details;
            }
        }
    }
    const versions = Array.from(merged.values()).map(version => ({
        ...version,
        recordonly: !version.downloads?.length,
        unavailable: !hasdownload(version.downloads),
        downloads: uniquedownloads(version.downloads).filter(isdownloadbuttonvisible)
            .sort((first, second) => Number(secondarydownload(first)) - Number(secondarydownload(second))),
        order: version.version.replace(/^v/i, "").split(".").map(value => parseInt(value) || 0)
    })).filter(version => version.downloads.length || version.recordonly);
    versions.sort((first, second) => {
        for (let index = 0; index < Math.max(first.order.length, second.order.length); index++) {
            const difference = (second.order[index] || 0) - (first.order[index] || 0);
            if (difference) return difference;
        }
        return 0;
    });
    packages.set(key, versions);
    return versions;
}

function loadlegacyicons() {
    if (legacyicons) return Promise.resolve(legacyicons);
    if (!legacypromise) {
        legacypromise = (async () => {
            const response = await fetch("old/versions.json");
            if (!response.ok) throw new Error(`old/versions.json: HTTP ${response.status}`);
            const legacy = await response.json();
            legacyicons = Object.fromEntries(legacy.filter(item => item?.version && item.icon).map(item => [String(item.version), item.icon]));
            return legacyicons;
        })().catch(error => {
            console.warn("unable to load legacy version icons?!", error);
            return {};
        }).finally(() => {
            legacypromise = null;
        });
    }
    return legacypromise;
}

function updatelegacyicons(list) {
    if (!legacyicons) return;
    list.querySelectorAll("[data-legacyversion]").forEach(image => {
        const icon = legacyicons[image.dataset.legacyversion];
        if (icon) {
            image.srcset = resolveiconsrcset(icon);
            image.src = resolveiconpath(icon);
            image.closest(".versionicon").href = resolverawiconpath(icon);
        }
    });
}

/*//////////////////////////////////////////////////////////////////////*/

export function packageheader(game, index, pkg, icons = true) {
    const value = key => Array.isArray(game[key]) ? game[key][index] : game[key];
    const header = document.createElement("div");
    header.className = "gameinfo";
    header.dataset.routepackage = packagekey(game, index);
    const name = document.createElement("div");
    name.className = "gamename";
    name.textContent = value("name");
    shareheading(name, game, index);
    header.appendChild(name);
    if (pkg != null && String(pkg).trim()) {
        const identifier = document.createElement("div");
        identifier.className = "package";
        identifier.textContent = pkg;
        header.appendChild(identifier);
    }
    if (value("description")) {
        const description = document.createElement("div");
        description.className = "description";
        description.textContent = value("description");
        header.appendChild(description);
    }
    const strip = icons ? packageiconhtml(game, index) : "";
    if (strip) header.insertAdjacentHTML("beforeend", strip);
    return header;
}

export function versionpanel(version, fallback, legacy, game, index) {
    const panel = document.createElement("div");
    panel.className = "versionpanel";
    panel.dataset.routepackage = packagekey(game, index);
    panel.dataset.version = version.version;
    panel.classList.toggle("unavailable", version.unavailable);
    const historical = !version.icon && legacy;
    const source = version.icon || (historical && legacyicons?.[version.version]) || fallback || "ctr/free";
    const icon = resolveiconpath(source, iconpixels(50));
    const srcset = resolveiconsrcset(source, iconpixels(50));
    panel.innerHTML = `
        <a class="versionicon clickable" href="${downloadattribute(resolverawiconpath(source))}" target="_blank" rel="noopener" aria-label="open original icon for ${downloadattribute(version.version)}">
            <img src="${icon}" srcset="${srcset}" alt="" draggable="false" loading="lazy" decoding="async" width="60" height="60"${historical ? ` data-legacyversion="${version.version}"` : ""}>
        </a>
        <div class="versioninfo">
            <div class="version">${downloadattribute(version.version)}</div>
            ${version.details && !version.downloads.length ? `<div class="details">${downloadattribute(version.details)}</div>` : ""}
            <div class="versionbuttons">${renderdownloads(version.downloads, version.version, version.details)}</div>
        </div>
    `;
    shareheading(panel.querySelector(".version"), game, index, version.version);
    const content = document.createElement("div");
    content.className = "versioncontent";
    content.dataset.routepackage = panel.dataset.routepackage;
    content.dataset.version = panel.dataset.version;
    content.append(...panel.childNodes);
    panel.appendChild(content);
    return panel;
}

function showversions(game, loadid, alreadyshown, iscurrent, containerscroll) {
    document.querySelector("#versionscreen").classList.add("active");
    document.querySelector(".backbutton").classList.add("active");
    document.querySelector(game.iosstuff ? "#gamescreenios" : "#gamescreen").classList.add("slideleft");
    if (!alreadyshown) requestAnimationFrame(() => {if (iscurrent(loadid)) containerscroll(game)});
}

export async function loadversions(packages, game, loadid, alreadyshown, cache, iscurrent, containerscroll) {
    if (!iscurrent(loadid)) return;
    const list = document.querySelector("#versionslist");
    const info = document.querySelector("#gameinfo");
    if (lastview?.game === game && lastview.cache === cache && lastview.complete) {
        updatelegacyicons(list);
        showversions(game, loadid, alreadyshown, iscurrent, containerscroll);
        return;
    }
    const view = {game, cache, complete: false};
    lastview = view;
    try {
        const packagelist = Array.isArray(packages) ? packages : [packages];
        const grouped = packagelist.length > 1;
        list.classList.toggle("multipackage", grouped);
        info.replaceChildren();
        info.dataset.routepackage = packagekey(game);
        info.style.display = grouped ? "none" : "";
        if (!grouped) {
            const header = packageheader(game, 0, packagelist[0]);
            info.append(...header.childNodes);
        }
        list.replaceChildren();
        document.querySelector("#versionscreen").scrollTop = 0;
        const fragment = document.createDocumentFragment();
        const sections = packagelist.map((pkg, index) => {
            const key = Array.isArray(game.verkey) ? game.verkey[index] ?? pkg : index === 0 ? game.verkey ?? pkg : pkg;
            const versions = versionsfor(cache, key);
            let target = list;
            if (grouped) {
                const column = document.createElement("div");
                column.className = "packagecolumn";
                column.appendChild(packageheader(game, index, pkg));
                target = document.createElement("div");
                target.className = "packageversions";
                column.appendChild(target);
                fragment.appendChild(column);
            }
            return {pkg, index, versions, target, fallback: Array.isArray(game.icon) ? game.icon[index] || game.icon[0] : game.icon};
        });
        if (grouped) {
            for (let index = 0; index + 1 < sections.length; index++) {
                if (sections[index].versions.length !== 1 || sections[index + 1].versions.length !== 1) continue;
                const first = sections[index].target.parentElement;
                const second = sections[index + 1].target.parentElement;
                const pair = document.createElement("div");
                pair.className = "packagepair";
                fragment.insertBefore(pair, first);
                pair.append(first, second);
                index++;
            }
            list.appendChild(fragment);
        }
        const needslegacy = packagelist.includes("com.zeptolab.ctr.ads") && sections.some(section => section.versions.some(version => !version.icon));
        if (needslegacy && !legacyicons) {
            void loadlegacyicons().then(() => {if (iscurrent(loadid)) updatelegacyicons(list)});
        }
        let visible = 0;
        let shown = false;
        for (const section of sections) {
            for (let offset = 0; offset < section.versions.length; offset += 32) {
                if (!iscurrent(loadid)) return;
                const batch = document.createDocumentFragment();
                section.versions.slice(offset, offset + 32).forEach(version => {
                    batch.appendChild(versionpanel(version, section.fallback, packagelist.includes("com.zeptolab.ctr.ads"), game, section.index));
                    visible++;
                });
                section.target.appendChild(batch);
                if (!shown) {
                    showversions(game, loadid, alreadyshown, iscurrent, containerscroll);
                    shown = true;
                }
                if (offset + 32 < section.versions.length) await new Promise(resolve => setTimeout(resolve, 0));
            }
        }
        if (!iscurrent(loadid)) return;
        if (!visible) {
            const empty = document.createElement("div");
            empty.className = "versionstatus";
            empty.textContent = "no versions for this game?! i usually add some, please report this to cv";
            list.appendChild(empty);
        }
        if (!shown) showversions(game, loadid, alreadyshown, iscurrent, containerscroll);
        view.complete = true;
    } catch (error) {
        if (!iscurrent(loadid)) return;
        console.error("Unable to show game versions", error);
        const message = document.createElement("div");
        message.className = "versionstatus";
        message.setAttribute("role", "alert");
        message.textContent = "showing versions failed?! please report this to cv";
        list.replaceChildren(message);
        showversions(game, loadid, alreadyshown, iscurrent, containerscroll);
    }
}
