import {resolveiconpath} from "./load.js";

/*//////////////////////////////////////////////////////////////////////*/

const debugshowleaks = true;
const debugshowapks = false;
const buttonmap = [
    {domain: "apkmirror.com", icon: "apkmirror.png"},
    {domain: "apkpure.com", icon: "apkpure.png"},
    {domain: "uptodown.com", icon: "uptodown.png"},
    {domain: "pdalife.to", icon: "pdalife.png"},
    {domain: "archive.org", icon: "internetarchive.png"},
    {domain: "github.com", icon: "ctrhome.png"},
    {domain: "githubusercontent.com", icon: "ctrhome.png"},
    {domain: "github.io", icon: "ctrhome.png"}
];

function packageiconhtml(game, pkgindex) {
    const list = game.pkgIconsList;
    if (!list || !list.length) return "";
    const urls = list[pkgindex] != null ? list[pkgindex] : list[0];
    if (!urls || !urls.length) return "";
    return `<div class="packageicons">${urls.map(u =>
        `<img src="${u}" alt="" draggable="false">`
    ).join("")}</div>`;
}

function autobutton(url) {
    for (let i = 0; i < buttonmap.length; i++) {
        if (url.includes(buttonmap[i].domain))
            return buttonmap[i].icon;
    } return "other.png";
}

function isdownloadbuttonvisible(d) {
    const iscdn = (d.arch && d.size) || (d.url && d.url.includes("cdn.candies.monster"));
    if (iscdn && d.arch && d.size) {
        const isleaks = d.url && d.url.includes("cdn.candies.monster/leaks/");
        const isapks = d.url && d.url.includes("cdn.candies.monster/apks/");
        if (isleaks && !debugshowleaks) {return false}
        if (isapks && !debugshowapks) {return false}
    }
    return true;
}

function renderdownloadbutton(d) {
    const iscdn = (d.arch && d.size) || (d.url && d.url.includes("cdn.candies.monster"));
    if (iscdn && d.arch && d.size) {
        const isleaks = d.url && d.url.includes("cdn.candies.monster/leaks/");
        const isapks = d.url && d.url.includes("cdn.candies.monster/apks/");
        if (isleaks && !debugshowleaks) {return ""}
        if (isapks && !debugshowapks) {return ""}
        
        return `<a href="${d.url}" target="_blank" class="clickable cdnbutton">
            <img src="/assets/images/dlbuttons/cdn.png" draggable="false">
            <div class="cdntext">
                <div>${d.arch}</div>
                <div>${d.size}</div>
            </div>
        </a>`;
    }
    const button = d.button || autobutton(d.url);
    const label = button.replace(/\.[^.]+$/, "");
    return `<a href="${d.url}" target="_blank" class="clickable">
        <img src="/assets/images/dlbuttons/${button}" alt="${label}" draggable="false">
    </a>`;
}

/*//////////////////////////////////////////////////////////////////////*/

let legacyctriconmap = null;
async function loadlegacyctricons() {
    if (legacyctriconmap) return legacyctriconmap;
    try {
        const res = await fetch("old/versions.json");
        const legacy = await res.json();
        const m = {};
        legacy.forEach(en => {
            if (en && en.version && en.icon) {m[String(en.version)] = en.icon}
        });
        legacyctriconmap = m;
    } catch (e) {legacyctriconmap = {}}
    return legacyctriconmap;
}

function parseversion(s) {
    const v = s.replace(/^v/, "");
    return v.split(".").map(n => parseInt(n) || 0);
}

export async function loadversions(packages, game, loadid, alreadyshown, vcache, iscurrent, containerscroll) {
    if (!iscurrent(loadid)) {return}
    const vs = document.querySelector("#versionscreen");
    
    try {
        const gi = document.querySelector("#gameinfo");
        const packagelist = Array.isArray(packages) ? packages : [packages];
        const cachekeys = packagelist.map((pkg, i) => {
            const vk = game.verkey;
            if (vk == null) return pkg;
            if (Array.isArray(vk)) return vk[i] != null ? vk[i] : pkg;
            return i === 0 ? vk : pkg;
        });
        const ismultipackage = Array.isArray(packages) && packages.length > 1;
        const showprimarypackage = packagelist[0] != null && String(packagelist[0]).trim() !== "";
        if (ismultipackage) {
            gi.innerHTML = "";
            gi.style.display = "none";
        } else {
            gi.style.display = "";
            gi.innerHTML = `
                <div class="gamename">${game.name}</div>
                ${showprimarypackage ? `<div class="package">${packagelist[0]}</div>` : ""}
                ${game.description ? `<div class="description">${game.description}</div>` : ""}
                ${packageiconhtml(game, 0)}
            `;
        }
        const vl = document.querySelector("#versionslist");

        const versionsbypackage = new Map();
        
        for (let i = 0; i < packagelist.length; i++) {
            const ckey = cachekeys[i];
            const vlist = vcache.get(ckey) || [];
            vlist.forEach(ver => {
                if (ver.version && !ver.version.startsWith("v") && !ver.version.startsWith("V")) {
                    ver.version = "v" + ver.version;
                }
            });
            versionsbypackage.set(ckey, vlist);
        }
        if (!iscurrent(loadid)) {return}
        
        const hasversions = Array.from(versionsbypackage.values()).some(vlist => vlist.length > 0);
        if (!hasversions) {
            vl.innerHTML = `<div style="color: white; -webkit-text-stroke: 0.125em black; text-shadow: 0 0.1em 0 black;">No versions found for this game.</div>`;
            if (iscurrent(loadid)) {
                const gsid3 = game && game.iosstuff ? "gamescreenios" : "gamescreen";
                const gs = document.querySelector(`#${gsid3}`);
                const bb = document.querySelector(".backbutton");
                vs.classList.add("active");
                bb.classList.add("active");
                if (gs) gs.classList.add("slideleft");
            }
            return;
        }
        versionsbypackage.forEach((vlist, pkg) => {
            const versionmap = new Map();
            vlist.forEach(ver => {
                const versionkey = (ver.version || "").toLowerCase();
                if (versionmap.has(versionkey)) {
                    const existing = versionmap.get(versionkey);
                    const alldownloads = [...(existing.downloads || []), ...(ver.downloads || [])];
                    const unq = [];
                    const seen = new Set();
                    alldownloads.forEach(d => {
                        if (!d || !d.url) return;
                        const iscdn = (d.arch && d.size) || (d.url && d.url.includes("cdn.candies.monster"));
                        let key = d.url;
                        if (iscdn) {key = `${d.url}|${d.arch || ""}|${d.size || ""}`}
                        if (seen.has(key)) return;
                        seen.add(key);
                        unq.push(d);
                    });
                    const existingcount = (existing.downloads || []).length;
                    const newcount = (ver.downloads || []).length;
                    existing.downloads = unq;
                    if (newcount > existingcount) {
                        if (ver.icon) existing.icon = ver.icon;
                        if (ver.details) existing.details = ver.details;
                    }
                } else {versionmap.set(versionkey, {...ver})}
            });
            const merged = Array.from(versionmap.values());
            merged.sort((a, b) => {
                const av = parseversion(a.version);
                const bv = parseversion(b.version);
                for (let i = 0; i < Math.max(av.length, bv.length); i++) {
                    const an = av[i] || 0;
                    const bn = bv[i] || 0;
                    if (bn !== an) return bn - an;
                }
                return 0;
            }); versionsbypackage.set(pkg, merged);
        });
        let ctmap = null;
        if (packagelist.includes("com.zeptolab.ctr.ads")) {
            ctmap = await loadlegacyctricons();
        }
        if (!iscurrent(loadid)) {return}
        vl.innerHTML = "";
        if (!iscurrent(loadid)) {return}
        
        if (packagelist.length > 1) {
            vl.classList.add("multipackage");
            packagelist.forEach((pkg, index) => {
                const ckey = cachekeys[index];
                const vlist = versionsbypackage.get(ckey) || [];
                const column = document.createElement("div");
                column.className = "packagecolumn";
                
                const packagename = Array.isArray(game.name) ? game.name[index] : game.name;
                const packageicon = Array.isArray(game.icon) ? game.icon[index] : game.icon;
                const packagedesc = Array.isArray(game.description) ? game.description[index] : game.description;

                const header = document.createElement("div");
                header.className = "gameinfo";
                const nameelem = document.createElement("div");
                nameelem.className = "gamename";
                nameelem.textContent = packagename;
                header.appendChild(nameelem);
                if (pkg != null && String(pkg).trim() !== "") {
                    const packageelem = document.createElement("div");
                    packageelem.className = "package";
                    packageelem.textContent = pkg;
                    header.appendChild(packageelem);
                }
                if (packagedesc) {
                    const descelem = document.createElement("div");
                    descelem.className = "description";
                    descelem.textContent = packagedesc;
                    header.appendChild(descelem);
                }
                const strip = packageiconhtml(game, index);
                if (strip) header.insertAdjacentHTML("beforeend", strip);
                column.appendChild(header);

                const versioncontainer = document.createElement("div");
                versioncontainer.className = "packageversions";
                
                vlist.forEach(ver => {
                    const unq = []; const seen = new Set();
                    (ver.downloads || []).forEach(d => {
                        if (!d || !d.url) return;
                        const iscdn = (d.arch && d.size) || (d.url && d.url.includes("cdn.candies.monster"));
                        let key = d.url;
                        if (iscdn) {key = `${d.url}|${d.arch || ""}|${d.size || ""}`}
                        if (seen.has(key)) return;
                        seen.add(key);
                        unq.push(d);
                    });
                    
                    const visibledownloads = unq.filter(d => isdownloadbuttonvisible(d));
                    if (visibledownloads.length === 0) return;
                    
                    const pn = document.createElement("div");
                    pn.className = "versionpanel";
                    let iconp = null;
                    if (ver.icon) {iconp = ver.icon}
                    else if (ctmap && ctmap[ver.version]) {iconp = ctmap[ver.version]}
                    else if (packageicon) {iconp = packageicon}
                    else if (game && game.icon) {iconp = Array.isArray(game.icon) ? game.icon[0] : game.icon}
                    else {iconp = "/assets/images/gameicons/free.webp"}
                    iconp = resolveiconpath(iconp);
                    pn.innerHTML = `
                        <div class="versionicon">
                            <img src="${iconp}" draggable="false">
                        </div>
                        <div class="versioninfo">
                            <div class="version">${ver.version}</div>
                            ${ver.details ? `<div class="details">${ver.details}</div>` : ""}
                            <div class="versionbuttons">
                                ${visibledownloads.map(d => renderdownloadbutton(d)).join("")}
                            </div>
                        </div>
                    `;
                    versioncontainer.appendChild(pn);
                });
                
                column.appendChild(versioncontainer);
                vl.appendChild(column);
            });
        } else {
            vl.classList.remove("multipackage");
            const vlist = versionsbypackage.get(cachekeys[0]) || [];
            
            vlist.forEach(ver => {
                const unq = []; const seen = new Set();
                (ver.downloads || []).forEach(d => {
                    if (!d || !d.url) return;
                    const iscdn = (d.arch && d.size) || (d.url && d.url.includes("cdn.candies.monster"));
                    let key = d.url;
                    if (iscdn) {key = `${d.url}|${d.arch || ""}|${d.size || ""}`}
                    if (seen.has(key)) return;
                    seen.add(key);
                    unq.push(d);
                });

                const visibledownloads = unq.filter(d => isdownloadbuttonvisible(d));
                if (visibledownloads.length === 0) return;
                
                const pn = document.createElement("div");
                pn.className = "versionpanel";
                let iconp = null;
                if (ver.icon) {iconp = ver.icon}
                else if (ctmap && ctmap[ver.version]) {iconp = ctmap[ver.version]}
                else if (game && game.icon) {iconp = game.icon}
                else {iconp = "/assets/images/gameicons/free.webp"}
                iconp = resolveiconpath(iconp);
                pn.innerHTML = `
                    <div class="versionicon">
                        <img src="${iconp}" draggable="false">
                    </div>
                    <div class="versioninfo">
                        <div class="version">${ver.version}</div>
                        ${ver.details ? `<div class="details">${ver.details}</div>` : ""}
                        <div class="versionbuttons">
                            ${visibledownloads.map(d => renderdownloadbutton(d)).join("")}
                        </div>
                    </div>
                `;
                vl.appendChild(pn);
            });
        }
        if (!iscurrent(loadid)) {return}

        const gsid4 = game && game.iosstuff ? "gamescreenios" : "gamescreen";
        const gs = document.querySelector(`#${gsid4}`);
        const bb = document.querySelector(".backbutton");
        vs.classList.add("active");
        bb.classList.add("active");
        if (gs) gs.classList.add("slideleft");
        if (!alreadyshown) {
            requestAnimationFrame(() => {
                if (iscurrent(loadid)) {
                    containerscroll(game);
                }
            });
        }
        
        document.querySelectorAll(".clickable").forEach(function(e) {
            e.addEventListener("click", function() {
                document.querySelector(".click").currentTime = 0;
                document.querySelector(".click").play();
            });
        });
    } catch (e) {
        if (!iscurrent(loadid)) {return}
        const vl = document.querySelector("#versionslist");
        const vs = document.querySelector("#versionscreen");
        const gsid2 = game && game.iosstuff ? "gamescreenios" : "gamescreen";
        const gs = document.querySelector(`#${gsid2}`);
        const bb = document.querySelector(".backbutton");
        vl.innerHTML = `<div style="color: white; -webkit-text-stroke: 0.125em black; text-shadow: 0 0.1em 0 black;">No versions found for this game.</div>`;
        vs.classList.add("active");
        bb.classList.add("active");
        if (gs) gs.classList.add("slideleft");
    }
}
