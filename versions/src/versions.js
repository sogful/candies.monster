import {resolveiconpath, resolveiconsrcset, resolveversionlabel} from "./load.js";

/*//////////////////////////////////////////////////////////////////////*/

const debugshowleaks = true;
const debugshowapks = false;
const buttonmap = [
    {domain: "apkmirror.com", icon: "apkmirror.png"},
    {domain: "apkpure.com", icon: "apkpure.png"},
    {domain: "apkpure.net", icon: "apkpure.png"},
    {domain: "uptodown.com", icon: "uptodown.png"},
    {domain: "pdalife.to", icon: "pdalife.png"},
    {domain: "apkbe.com", icon: "apkbe.png"},
    {domain: "downzen.com", icon: "downzen.png"},

    {domain: "mega.io", icon: "mega.png"},
    {domain: "mega.nz", icon: "mega.png"},
    {domain: "mediafire.com", icon: "mediafire.png"},
    {domain: "archive.org", icon: "internetarchive.png"},

    // i know this is dumb but i haven't seen anyone besides me and blue putting this many apks and ipas onto github
    {domain: "github.com", icon: "ctrhome.png"},
    {domain: "githubusercontent.com", icon: "ctrhome.png"},
    {domain: "github.io", icon: "ctrhome.png"}
];
const prepared = new WeakMap();
let lastview = null;
let legacyicons = null;
let legacypromise = null;

function packageiconhtml(game, index) {
    const list = game.pkgIconsList;
    const urls = list && (list[index] ?? list[0]);
    if (!urls?.length) return "";
    return `<div class="packageicons">${urls.map(url => `<img src="${url}" alt="" draggable="false" loading="lazy" decoding="async" width="32" height="32">`).join("")}</div>`;
}

function isdownloadbuttonvisible(download) {
    if (download.arch && download.size) {
        if (download.url.includes("cdn.candies.monster/leaks/") && !debugshowleaks) return false;
        if (download.url.includes("cdn.candies.monster/apks/") && !debugshowapks && download.kind !== "archive") return false;
    }
    return true;
}

function downloadattribute(value) {
    return String(value || "").replaceAll("&", "&amp;").replaceAll("\"", "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function renderdownloadbutton(download) {
    if (download.kind === "symbols") {
        const label = downloadattribute(download.label || "debug symbols");
        const details = downloadattribute([download.label || "debug symbols", download.arch, download.size].filter(Boolean).join(" | "));
        return `<a href="${download.url}" target="_blank" rel="noopener" class="clickable cdnbutton" aria-label="symbols: ${details}" title="${details}">
            <img src="/assets/images/dlbuttons/symbols.png" alt="" draggable="false" loading="lazy" decoding="async">
            <div class="cdntext"><div>symbols</div><div>${label}</div></div>
        </a>`;
    }
    if (download.arch && download.size) {
        return `<a href="${download.url}" target="_blank" class="clickable cdnbutton">
            <img src="/assets/images/dlbuttons/cdn.png" draggable="false" loading="lazy" decoding="async">
            <div class="cdntext"><div>${download.arch}</div><div>${download.size}</div></div>
        </a>`;
    }
    const button = download.button || buttonmap.find(item => download.url.includes(item.domain))?.icon || "other.png";
    const label = download.label ? ` title="${downloadattribute(download.label)}" aria-label="${downloadattribute(download.label)}"` : "";
    return `<a href="${download.url}" target="_blank" class="clickable"${label}>
        <img src="/assets/images/dlbuttons/${button}" alt="${button.replace(/\.[^.]+$/, "")}" draggable="false" loading="lazy" decoding="async">
    </a>`;
}

function uniquedownloads(downloads) {
    const seen = new Set();
    return (downloads || []).filter(download => {
        if (!download?.url) return false;
        const iscdn = (download.arch && download.size) || download.url.includes("cdn.candies.monster");
        const sourcekey = iscdn ? `${download.url}|${download.arch || ""}|${download.size || ""}` : download.url;
        const key = `${download.kind || "app"}|${sourcekey}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

/*//////////////////////////////////////////////////////////////////////*/

function versionsfor(cache, key) {
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
        downloads: uniquedownloads(version.downloads).filter(isdownloadbuttonvisible),
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
            console.warn("Unable to load legacy version icons", error);
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
        }
    });
}

/*//////////////////////////////////////////////////////////////////////*/

function packageheader(game, index, pkg) {
    const value = key => Array.isArray(game[key]) ? game[key][index] : game[key];
    const header = document.createElement("div");
    header.className = "gameinfo";
    const name = document.createElement("div");
    name.className = "gamename";
    name.textContent = value("name");
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
    const strip = packageiconhtml(game, index);
    if (strip) header.insertAdjacentHTML("beforeend", strip);
    return header;
}

function versionpanel(version, fallback, legacy) {
    const panel = document.createElement("div");
    panel.className = "versionpanel";
    const historical = !version.icon && legacy;
    const source = version.icon || (historical && legacyicons?.[version.version]) || fallback || "ctr/free";
    const icon = resolveiconpath(source);
    const srcset = resolveiconsrcset(source);
    panel.innerHTML = `
        <div class="versionicon">
            <img src="${icon}" srcset="${srcset}" alt="" draggable="false" loading="lazy" decoding="async" width="60" height="60"${historical ? ` data-legacyversion="${version.version}"` : ""}>
        </div>
        <div class="versioninfo">
            <div class="version">${version.version}</div>
            ${version.details ? `<div class="details">${version.details}</div>` : ""}
            <div class="versionbuttons">${version.downloads.map(renderdownloadbutton).join("")}</div>
        </div>
    `;
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
            return {pkg, versions, target, fallback: Array.isArray(game.icon) ? game.icon[index] || game.icon[0] : game.icon};
        });
        if (grouped) list.appendChild(fragment);
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
                    batch.appendChild(versionpanel(version, section.fallback, packagelist.includes("com.zeptolab.ctr.ads")));
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
            empty.textContent = "No versions found for this game.";
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
        message.textContent = "Unable to show versions for this game.";
        list.replaceChildren(message);
        showversions(game, loadid, alreadyshown, iscurrent, containerscroll);
    }
}
