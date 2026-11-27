import {packagekey, shareheading} from "../links.js";
import {downloadattribute, downloadidentity, orbitdescription, renderdownloads, secondarydownload} from "./downloads.js";
import {hasdownload, resolveiconpath, resolveiconsrcset, resolverawiconpath, resolveversionlabel} from "./load.js";
import {platformbadges, releaseplatform} from "./platforms.js";

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
        const key = downloadidentity(download);
        const urls = download.urls || [download.url];
        if (!seen.has(key)) seen.set(key, {...download, urls: [...urls]});
        else {
            const existing = seen.get(key);
            existing.urls = [...new Set([...existing.urls, ...urls])];
            existing.arch ||= download.arch;
            existing.size ||= download.size;
            for (const field of ["note", "label", "flags"]) {
                const separator = field === "flags" ? " " : "; ";
                existing[field] = Array.from(new Set([existing[field], download[field]].filter(Boolean))).join(separator);
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
            const response = await fetch("/assets/static/data/versions/legacy.json");
            if (!response.ok) throw new Error(`data/legacy.json: HTTP ${response.status}`);
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

export function packageheader(game, index, pkg) {
    const value = key => Array.isArray(game[key]) ? game[key][index] : game[key];
    const header = document.createElement("div");
    header.className = "gameinfo";
    header.dataset.routepackage = packagekey(game, index);
    const name = document.createElement("div");
    name.className = "gamename";
    name.textContent = value("name");
    name.classList.toggle("unknowntitle", name.textContent === "[unknown title]");
    shareheading(name, game, index);
    header.appendChild(name);
    const internal = value("internal");
    if (pkg || internal) {
        const identifier = document.createElement("div");
        identifier.className = "package";
        identifier.textContent = pkg || "";
        if (internal) {
            const alias = document.createElement("span");
            alias.className = "internalname";
            if (pkg) alias.append(" (");
            internal.split(" / ").forEach((entry, index) => {
                if (index) alias.append(" / ");
                const speculated = entry.endsWith("?");
                const code = speculated ? entry.slice(0, -1) : entry;
                alias.append(code);
                if (speculated) {
                    const mark = document.createElement("sup");
                    mark.textContent = "?";
                    mark.title = `Zeptolab's BMS feeder doesn't return a package list for ${code}, this is merely speculation.`;
                    alias.append(mark);
                }
            });
            if (pkg) alias.append(")");
            identifier.append(alias);
        }
        header.appendChild(identifier);
    }
    const summary = game.available === false ? value("description") : orbitdescription(value("description"), game.circle);
    const evidence = value("evidence");
    const hassource = /^https?:\/\//i.test(evidence || "");
    if (summary || hassource) {
        const description = document.createElement("div");
        description.className = "description";
        description.textContent = summary;
        if (hassource) {
            const source = document.createElement("a");
            source.className = "descriptionsource clickable";
            source.href = evidence;
            source.target = "_blank";
            source.rel = "noopener";
            source.textContent = "(source)";
            if (summary) description.append("\u00a0");
            description.append(source);
        }
        header.appendChild(description);
    }
    const strip = packageiconhtml(game, index);
    if (strip) header.insertAdjacentHTML("beforeend", strip);
    return header;
}

export function versionpanel(version, fallback, legacy, game, index) {
    const panel = document.createElement("div");
    panel.className = "versionpanel";
    const release = game.platform === "other" ? releaseplatform(version.version) : {label: version.version, icons: []};
    panel.classList.toggle("otherrelease", release.icons.length > 0);
    panel.dataset.routepackage = packagekey(game, index);
    panel.dataset.version = version.version;
    panel.classList.toggle("unavailable", version.unavailable);
    const historical = !version.icon && legacy;
    const source = version.icon || (historical && legacyicons?.[version.version]) || fallback || "ctr/free";
    const icon = resolveiconpath(source, iconpixels(50));
    const srcset = resolveiconsrcset(source, iconpixels(50));
    const badges = platformbadges(release.icons);
    const title = downloadattribute(version.version);
    const label = downloadattribute(release.label);
    const details = orbitdescription(version.details, game.circle);
    panel.innerHTML = `
        <div class="versionidentity" style="--platformbadges:${release.icons.length}">
        <a class="versionicon clickable" href="${downloadattribute(resolverawiconpath(source))}" target="_blank" rel="noopener" title="${title}" aria-label="open original icon for ${title}">
            <img src="${icon}" srcset="${srcset}" alt="" draggable="false" loading="lazy" decoding="async" width="60" height="60"${historical ? ` data-legacyversion="${version.version}"` : ""}>
            ${badges}
        </a>
            <div class="version" style="--versionlength:${release.label.length || 1}">${label}</div>
        </div>
        <div class="versioninfo">
            ${details && !version.downloads.length ? `<div class="details">${downloadattribute(details)}</div>` : ""}
            <div class="versionbuttons">${renderdownloads(version.downloads, version.version, version.details, game)}</div>
        </div>
    `;
    shareheading(panel.querySelector(".versionidentity"), game, index, version.version);
    const content = document.createElement("div");
    content.className = "versioncontent";
    content.dataset.routepackage = panel.dataset.routepackage;
    content.dataset.version = panel.dataset.version;
    content.append(...panel.childNodes);
    panel.appendChild(content);
    return panel;
}

function showversions(screen, loadid, alreadyshown, iscurrent, containerscroll) {
    document.querySelector("#versionscreen").classList.add("active");
    document.querySelector(".backbutton").classList.add("active");
    screen.classList.add("slideleft");
    if (!alreadyshown) requestAnimationFrame(() => {if (iscurrent(loadid)) containerscroll()});
}

function versionempty() {
    const empty = document.createElement("div");
    empty.className = "versionstatus versionempty";
    const image = document.createElement("img");
    image.src = "/assets/images/omnom/404/sad-still.webp";
    image.alt = "";
    image.draggable = false;
    empty.append(image, "no versions available :(");
    return empty;
}

export async function loadversions(packages, game, loadid, alreadyshown, cache, iscurrent, containerscroll, screen) {
    if (!iscurrent(loadid)) return;
    const list = document.querySelector("#versionslist");
    const info = document.querySelector("#gameinfo");
    if (lastview?.game === game && lastview.cache === cache && lastview.complete) {
        updatelegacyicons(list);
        showversions(screen, loadid, alreadyshown, iscurrent, containerscroll);
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
                if (sections[index].versions.length > 1 || sections[index + 1].versions.length > 1) continue;
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
        let shown = false;
        for (const section of sections) {
            for (let offset = 0; offset < section.versions.length; offset += 32) {
                if (!iscurrent(loadid)) return;
                const batch = document.createDocumentFragment();
                section.versions.slice(offset, offset + 32).forEach(version => {
                    batch.appendChild(versionpanel(version, section.fallback, packagelist.includes("com.zeptolab.ctr.ads"), game, section.index));
                });
                section.target.appendChild(batch);
                if (!shown) {
                    showversions(screen, loadid, alreadyshown, iscurrent, containerscroll);
                    shown = true;
                }
                if (offset + 32 < section.versions.length) await new Promise(resolve => setTimeout(resolve, 0));
            }
            if (grouped && !section.versions.length) section.target.appendChild(versionempty());
        }
        if (!iscurrent(loadid)) return;
        if (!grouped && !sections[0].versions.length) list.appendChild(versionempty());
        if (!shown) showversions(screen, loadid, alreadyshown, iscurrent, containerscroll);
        view.complete = true;
    } catch (error) {
        if (!iscurrent(loadid)) return;
        console.error("Unable to show game versions", error);
        const message = document.createElement("div");
        message.className = "versionstatus";
        message.setAttribute("role", "alert");
        message.textContent = "showing versions failed?! please report this to cv";
        list.replaceChildren(message);
        showversions(screen, loadid, alreadyshown, iscurrent, containerscroll);
    }
}
