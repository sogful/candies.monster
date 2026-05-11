// animated favicon
(function() {
    let spritejson = null; let sheetloaded = false;
    let favicons = []; let index = 0; const delay = 300;
    let sheetimg = null;

    fetch("/assets/images/icon.json")
        .then(response => response.json()).then(data => {
            spritejson = data.frames; sheetimg = new Image();
            sheetimg.onload = () => {
                sheetloaded = true;
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                favicons = spritejson.map(frame => {
                    canvas.width = frame.frame.w;
                    canvas.height = frame.frame.h;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(
                        sheetimg,
                        frame.frame.x, frame.frame.y, frame.frame.w, frame.frame.h,
                        0, 0, frame.frame.w, frame.frame.h
                    ); return canvas.toDataURL("image/png");
                }); favicongif();
            }; sheetimg.src = "/assets/images/icon.webp";
        });
    function favicongif() {
        if (!sheetloaded || favicons.length === 0) {setTimeout(favicongif, 50); return}
        const link = document.querySelector("link[rel='icon']") || document.createElement("link");
        link.rel = "icon"; link.href = favicons[index];
        document.head.appendChild(link);
        index = (index + 1) % favicons.length;
        setTimeout(favicongif, delay);
    }
})();

// loading
window.addEventListener("load", function() {
    var loading = document.querySelector(".loading");
    if (loading) {
        loading.style.opacity = "0";
        loading.style.pointerEvents = "none";
    }
});

// click sfx
document.querySelectorAll(".clickable").forEach(function(element) {
    if (element.classList.contains("backbutton")) return;
    element.addEventListener("click", function() {
        const clicksfx = document.querySelector(".click");
        if (clicksfx) {
            clicksfx.currentTime = 0;
            clicksfx.play().catch(() => {});
        }
    });
});

/*//////////////////////////////////////////////////////////////////////*/

const DEBUGshowleaks = true;
const DEBUGshowapks = false;

// these mappings are handy
const buttonmap = [
    {domain: "apkmirror.com", icon: "apkmirror.png"},
    {domain: "apkpure.com", icon: "apkpure.png"},
    {domain: "uptodown.com", icon: "uptodown.png"},
    {domain: "apkcombo.com", icon: "apkcombo.png"},
    {domain: "pdalife.to", icon: "pdalife.png"},
    {domain: "archive.org", icon: "internetarchive.png"}
];

function packageiconhtml(game, pkgIndex) {
    const list = game.pkgIconsList;
    if (!list || !list.length) return "";
    const urls = list[pkgIndex] != null ? list[pkgIndex] : list[0];
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
        if (isleaks && !DEBUGshowleaks) {return false}
        if (isapks && !DEBUGshowapks) {return false}
    }
    return true;
}

function renderdownloadbutton(d) {
    const iscdn = (d.arch && d.size) || (d.url && d.url.includes("cdn.candies.monster"));
    if (iscdn && d.arch && d.size) {
        const isleaks = d.url && d.url.includes("cdn.candies.monster/leaks/");
        const isapks = d.url && d.url.includes("cdn.candies.monster/apks/");
        if (isleaks && !DEBUGshowleaks) {return ""}
        if (isapks && !DEBUGshowapks) {return ""}
        
        return `<a href="${d.url}" target="_blank" class="clickable cdnbutton">
            <img src="/assets/images/dlbuttons/cdn.png" draggable="false">
            <div class="cdntext">
                <div>${d.arch}</div>
                <div>${d.size}</div>
            </div>
        </a>`;
    }
    const button = d.button || autobutton(d.url);
    return `<a href="${d.url}" target="_blank" class="clickable">
        <img src="/assets/images/dlbuttons/${button}" draggable="false">
    </a>`;
}

/*//////////////////////////////////////////////////////////////////////*/

function containerscroll(game) {
    const cont = document.querySelector(".container");
    if (!cont) return;
    const id = game && game.iosstuff ? "gamescreenios" : "gamescreen";
    const gs = document.getElementById(id);
    if (!gs) return;
    cont.scrollTo({ left: gs.offsetLeft, behavior: "smooth" });
}

let games = [];
let iosgames = [];
let currentgame = null;
let currentloadid = 0;
let versionscache = new Map();
let iosversionscache = new Map();

async function loadgames() {
    try {
        const res = await fetch("android.csv");
        const text = await res.text();
        const parsed = window.csvthing.parsegamescsv(text);
        games = parsed.games;
        versionscache = parsed.versionscache;
        requestAnimationFrame(() => {setTimeout(() => {rendergamecircle()}, 50)});
    } catch (e) {}
    try {
        const res2 = await fetch("ios.csv");
        const text2 = await res2.text();
        const parsed2 = window.csvthing.parsegamescsv(text2);
        iosgames = parsed2.games.map(g => ({...g, iosstuff: true}));
        iosversionscache = parsed2.versionscache;
        requestAnimationFrame(() => {setTimeout(() => {rendergamecircle(true)}, 80)});
    } catch (e) {}
}

// this whole ordeal might be a little resource intensive,
// but if you're on mobile this will be skipped for a simpler layout instead!
function rendergamecircle(isios) {
    const circleId = isios ? "gamecircle-ios" : "gamecircle";
    const gamelist = isios ? iosgames : games;
    const circle = document.getElementById(circleId);
    if (!circle) return;
    circle.classList.add("rendering");
    circle.innerHTML = "";
    const sorted = [...gamelist].sort((a, b) => b.importance - a.importance);
    const tinyscreen = window.innerWidth < 650;
    
    if (tinyscreen) {
        sorted.forEach((g) => {
            const ic = document.createElement("div");
            ic.className = "gameicon clickable";
            ic.dataset.gameid = Array.isArray(g.package) ? g.package[0] : g.package;
            const im = document.createElement("img");
            im.src = window.csvthing.resolveiconpath(Array.isArray(g.icon) ? g.icon[0] : g.icon);
            im.draggable = false;
            im.onerror = function() {this.src = '/assets/images/gameicons/idk.webp'};
            ic.appendChild(im);
            ic.addEventListener("click", () => {
                const s = document.querySelector(".click");
                if (s) {
                    s.currentTime = 0;
                    s.play().catch(() => {});
                } selectgame(g);
            });
            circle.appendChild(ic);
        });
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                circle.classList.remove("rendering");
            });
        });
    } else {
        const circlerect = circle.getBoundingClientRect();
        const w = circlerect.width > 0 ? circlerect.width : Math.min(window.innerWidth * 0.9, 800);
        const h = circlerect.height > 0 ? circlerect.height : Math.max(Math.min(window.innerHeight * 0.9, 800), 600);
        const cx = w / 2, cy = h / 2;
        const placed = [];
        sorted.forEach((g, i) => {
            const ic = document.createElement("div");
            ic.className = "gameicon clickable";
            ic.dataset.gameid = Array.isArray(g.package) ? g.package[0] : g.package;
            const sz = 50 + (g.importance - 3) * 5.7;
            ic.style.width = `${sz}px`;
            ic.style.height = `${sz}px`;
            let x, y;
            if (i === 0) {
                x = cx - sz / 2;
                y = cy - sz / 2;
            } else {
                const maximp = sorted[0].importance;
                const minimp = sorted[sorted.length - 1].importance;
                const imgrange = maximp - minimp;
                let normimp;
                if (imgrange <= 0) {
                    const denom = Math.max(1, sorted.length - 1);
                    normimp = 1 - (i / denom);
                } else {
                    normimp = (g.importance - minimp) / imgrange;
                }
                const saferad = Math.min(w, h) * 0.4;
                const minrad = sz * 0.65;
                const maxrad = Math.min(sz * 2, saferad);
                const rad = minrad + (1 - normimp) * (maxrad - minrad);
                const gold = Math.PI * (3 - Math.sqrt(5));
                const ang = (i - 1) * gold;
                let tx = cx + Math.cos(ang) * rad;
                let ty = cy + Math.sin(ang) * rad;
                let ov = true, att = 0, maxatt = 50, pad = 12;
                while (ov && att < maxatt) {
                    ov = false;
                    for (const pl of placed) {
                        const dx = tx - pl.x, dy = ty - pl.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const mindist = (sz + pl.size) / 2 + pad;
                        if (dist < mindist) {
                            ov = true;
                            if (dist > 0) {
                                const pdist = (mindist - dist) + 1;
                                const pang = Math.atan2(dy, dx);
                                tx += Math.cos(pang) * pdist;
                                ty += Math.sin(pang) * pdist;
                            } else {
                                const ran = Math.random() * Math.PI * 2;
                                tx += Math.cos(ran) * (mindist + 1);
                                ty += Math.sin(ran) * (mindist + 1);
                            }
                            const half = sz / 2;
                            tx = Math.max(half, Math.min(w - half, tx));
                            ty = Math.max(half, Math.min(h - half, ty));
                            break;
                        }
                    } att++;
                }
                if (ov) {
                    const pad = 12;
                    const maxsr = Math.min(w, h) * 0.5;
                    const rstep = sz * 0.4;
                    const astep = Math.PI / 12;
                    outer:
                    for (let r = minrad; r <= maxsr; r += rstep) {
                        for (let a = 0; a < Math.PI * 2; a += astep) {
                            const cx2 = cx + Math.cos(a) * r;
                            const cy2 = cy + Math.sin(a) * r;
                            let cov = false;
                            for (const pl of placed) {
                                const dx = cx2 - pl.x, dy = cy2 - pl.y;
                                const dist = Math.sqrt(dx * dx + dy * dy);
                                const mindist = (sz + pl.size) / 2 + pad;
                                if (dist < mindist) {cov = true; break}
                            }
                            if (!cov) {
                                tx = cx2;
                                ty = cy2;
                                ov = false;
                                break outer;
                            }
                        }
                    }
                } x = tx - sz / 2; y = ty - sz / 2;
            }
            x = Math.max(0, Math.min(w - sz, x));
            y = Math.max(0, Math.min(h - sz, y));
            ic.style.left = `${x}px`;
            ic.style.top = `${y}px`;
            ic.style.position = 'absolute';
            placed.push({ x: x + sz / 2, y: y + sz / 2, size: sz });
            const im = document.createElement("img");
            im.src = window.csvthing.resolveiconpath(Array.isArray(g.icon) ? g.icon[0] : g.icon);
            im.draggable = false;
            im.onerror = function() {this.src = '/assets/images/gameicons/idk.webp'};
            ic.appendChild(im);
            ic.addEventListener("click", () => {
                const s = document.querySelector(".click");
                if (s) {
                    s.currentTime = 0;
                    s.play().catch(() => {});
                } selectgame(g);
            }); circle.appendChild(ic);
        });
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                circle.classList.remove("rendering");
            });
        });
    }
}

async function selectgame(g) {
    currentloadid++;
    const thisloadid = currentloadid;
    
    currentgame = g;
    const gsid = g.iosstuff ? "gamescreenios" : "gamescreen";
    const gs = document.getElementById(gsid);
    const vs = document.getElementById("versionscreen");
    const vl = document.getElementById("versionslist");
    const bb = document.querySelector(".backbutton");
    
    const alreadyshown = vs.classList.contains("active");
    
        const packages = Array.isArray(g.package) ? g.package : [g.package];
        const vcache = g.iosstuff ? iosversionscache : versionscache;
        await loadversions(packages, g, thisloadid, alreadyshown, vcache);
}

let legacyctriconmap = null;
async function loadlegacyctricons() {
    if (legacyctriconmap) return legacyctriconmap;
    try {
        const res = await fetch("versions.json");
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
    let v = s.replace(/^v/, '');
    const p = v.split('.');
    // VERY GOOD SOLUTION 🤑🤑🤑🤑🤑🤑🤑
    // if (p.length > 0 && !p[0].includes('3') && parseInt(p[0]) > 10) {v = '3.' + v}
    return v.split('.').map(n => parseInt(n) || 0);
}

async function loadversions(packages, game, loadid, alreadyshown, vcache) {
    if (!vcache) vcache = versionscache;
    if (loadid !== currentloadid) {return}
    const vs = document.getElementById("versionscreen");
    
    try {
        const gi = document.getElementById("gameinfo");
        const packageStr = Array.isArray(packages) ? packages.join(", ") : packages;
        const isMultiPackage = Array.isArray(packages) && packages.length > 1;
        if (isMultiPackage) {
            gi.innerHTML = '';
            gi.style.display = 'none';
        } else {
            gi.style.display = '';
            // parts of the overlay thing can be rearranged here 
            gi.innerHTML = `
                <div class="gamename">${game.name}</div>
                <div class="package">${packageStr}</div>
                ${game.description ? `<div class="description">${game.description}</div>` : ''}
                ${packageiconhtml(game, 0)}
            `;
        }
        const vl = document.getElementById("versionslist");

        const packagelist = Array.isArray(packages) ? packages : [packages];
        const versionsbypackage = new Map();
        
        for (const pkg of packagelist) {
            const vlist = vcache.get(pkg) || [];
            vlist.forEach(ver => {
                if (ver.version && !ver.version.startsWith('v') && !ver.version.startsWith('V')) {
                    ver.version = 'v' + ver.version;
                }
            });
            versionsbypackage.set(pkg, vlist);
        }
        if (loadid !== currentloadid) {return}
        
        const hasversions = Array.from(versionsbypackage.values()).some(vlist => vlist.length > 0);
        if (!hasversions) {
            vl.innerHTML = `<div style="color: white; -webkit-text-stroke: 0.125em black; text-shadow: 0 0.1em 0 black;">No versions found for this game.</div>`;
            if (loadid === currentloadid) {
                const gsid3 = game && game.iosstuff ? "gamescreenios" : "gamescreen";
                const gs = document.getElementById(gsid3);
                const bb = document.querySelector(".backbutton");
                vs.classList.add("active");
                bb.classList.add("active");
                if (gs) gs.classList.add("slideleft");
            }
            return;
        }
        
        // merge dupe versions
        versionsbypackage.forEach((vlist, pkg) => {
            const versionMap = new Map();
            vlist.forEach(ver => {
                const versionkey = (ver.version || '').toLowerCase();
                if (versionMap.has(versionkey)) {
                    const existing = versionMap.get(versionkey);
                    const alldownloads = [...(existing.downloads || []), ...(ver.downloads || [])];
                    const unq = [];
                    const seen = new Set();
                    alldownloads.forEach(d => {
                        if (!d || !d.url) return;
                        const iscdn = (d.arch && d.size) || (d.url && d.url.includes("cdn.candies.monster"));
                        let key = d.url;
                        if (iscdn) {key = `${d.url}|${d.arch || ''}|${d.size || ''}`}
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
                } else {versionMap.set(versionkey, {...ver})}
            });
            const merged = Array.from(versionMap.values());
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
        if (loadid !== currentloadid) {return}
        vl.innerHTML = "";
        if (loadid !== currentloadid) {return}
        
        if (packagelist.length > 1) {
            vl.classList.add("multipackage");
            
            // additional arrangement for multiple game groups
            packagelist.forEach((pkg, index) => {
                const vlist = versionsbypackage.get(pkg) || [];
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
                const packageelem = document.createElement("div");
                packageelem.className = "package";
                packageelem.textContent = pkg;
                header.appendChild(packageelem);
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
                        if (iscdn) {key = `${d.url}|${d.arch || ''}|${d.size || ''}`}
                        if (seen.has(key)) return;
                        seen.add(key);
                        unq.push(d);
                    });
                    
                    const visibledownloads = unq.filter(d => isdownloadbuttonvisible(d));
                    if (visibledownloads.length === 0) return;
                    
                    const pn = document.createElement("div");
                    pn.className = "versionpanel";
                    let iconp = null;
                    if (ctmap && ctmap[ver.version]) {iconp = ctmap[ver.version]}
                    else if (ver.icon) {iconp = ver.icon}
                    else if (packageicon) {iconp = packageicon}
                    else if (game && game.icon) {iconp = Array.isArray(game.icon) ? game.icon[0] : game.icon}
                    else {iconp = "/assets/images/gameicons/free.webp"}
                    iconp = window.csvthing.resolveiconpath(iconp);
                    pn.innerHTML = `
                        <div class="versionicon">
                            <img src="${iconp}" draggable="false">
                        </div>
                        <div class="versioninfo">
                            <div class="version">${ver.version}</div>
                            ${ver.details ? `<div class="details">${ver.details}</div>` : ''}
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
            const vlist = versionsbypackage.get(packagelist[0]) || [];
            
            vlist.forEach(ver => {
                const unq = []; const seen = new Set();
                (ver.downloads || []).forEach(d => {
                    if (!d || !d.url) return;
                    const iscdn = (d.arch && d.size) || (d.url && d.url.includes("cdn.candies.monster"));
                    let key = d.url;
                    if (iscdn) {key = `${d.url}|${d.arch || ''}|${d.size || ''}`}
                    if (seen.has(key)) return;
                    seen.add(key);
                    unq.push(d);
                });

                const visibledownloads = unq.filter(d => isdownloadbuttonvisible(d));
                if (visibledownloads.length === 0) return;
                
                const pn = document.createElement("div");
                pn.className = "versionpanel";
                let iconp = null;
                if (ctmap && ctmap[ver.version]) {iconp = ctmap[ver.version]}
                else if (ver.icon) {iconp = ver.icon}
                else if (game && game.icon) {iconp = game.icon}
                else {iconp = "/assets/images/gameicons/free.webp"}
                iconp = window.csvthing.resolveiconpath(iconp);
                pn.innerHTML = `
                    <div class="versionicon">
                        <img src="${iconp}" draggable="false">
                    </div>
                    <div class="versioninfo">
                        <div class="version">${ver.version}</div>
                        ${ver.details ? `<div class="details">${ver.details}</div>` : ''}
                        <div class="versionbuttons">
                            ${visibledownloads.map(d => renderdownloadbutton(d)).join("")}
                        </div>
                    </div>
                `;
                vl.appendChild(pn);
            });
        }
        if (loadid !== currentloadid) {return}

        const gsid4 = game && game.iosstuff ? "gamescreenios" : "gamescreen";
        const gs = document.getElementById(gsid4);
        const bb = document.querySelector(".backbutton");
        vs.classList.add("active");
        bb.classList.add("active");
        if (gs) gs.classList.add("slideleft");
        if (!alreadyshown) {
            requestAnimationFrame(() => {
                if (loadid === currentloadid) {
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
        if (loadid !== currentloadid) {return}
        const vl = document.getElementById("versionslist");
        const vs = document.getElementById("versionscreen");
        const gsid2 = game && game.iosstuff ? "gamescreenios" : "gamescreen";
        const gs = document.getElementById(gsid2);
        const bb = document.querySelector(".backbutton");
        vl.innerHTML = `<div style="color: white; -webkit-text-stroke: 0.125em black; text-shadow: 0 0.1em 0 black;">No versions found for this game.</div>`;
        vs.classList.add("active");
        bb.classList.add("active");
        if (gs) gs.classList.add("slideleft");
    }
}

function goback() {
    currentloadid++;
    const gsid = currentgame && currentgame.iosstuff ? "gamescreenios" : "gamescreen";
    const gs = document.getElementById(gsid);
    const vs = document.getElementById("versionscreen");
    const bb = document.querySelector(".backbutton");
    const cg = currentgame;
    if (gs) gs.classList.remove("slideleft");
    vs.classList.remove("active");
    bb.classList.remove("active");
    currentgame = null;
    if (cg) containerscroll(cg);
}

function setupbackbutton() {
    const bb = document.querySelector(".backbutton");
    if (bb) {
        bb.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            const c = document.querySelector(".click");
            if (c) {c.currentTime = 0; c.play().catch(() => {})} goback();
        });
    }
}

function setupscrollnav() {
    const navios = document.getElementById("navios");
    const navand = document.getElementById("navandroid");
    const gsios = document.getElementById("gamescreenios");
    const gs = document.getElementById("gamescreen");
    const cont = document.querySelector(".container");
    if (navios && gsios && cont) {
        navios.addEventListener("click", () => {
            const c = document.querySelector(".click");
            if (c) {c.currentTime = 0; c.play().catch(() => {})}
            cont.scrollTo({ left: gsios.offsetLeft, behavior: "smooth" });
            navios.style.display = "none";
            if (navand) navand.style.display = "flex";
        });
    }
    if (navand && gs && cont) {
        navand.addEventListener("click", () => {
            const c = document.querySelector(".click");
            if (c) {c.currentTime = 0; c.play().catch(() => {})}
            cont.scrollTo({ left: gs.offsetLeft, behavior: "smooth" });
            navand.style.display = "none";
            if (navios) navios.style.display = "flex";
        });
    }
}

if (document.readyState === 'loading') {document.addEventListener('DOMContentLoaded', () => {setupbackbutton(); setupscrollnav()})}
else {setupbackbutton(); setupscrollnav()}
loadgames();

let resizet;
let currentlaymode = window.innerWidth < 650 ? 'mobile' : 'desktop';

window.addEventListener("resize", () => {
    clearTimeout(resizet);
    const laymode = window.innerWidth < 650 ? 'mobile' : 'desktop';
    const loading = document.querySelector(".loading");
    const gamecircle = document.getElementById("gamecircle");
    
    if (laymode !== currentlaymode && !currentgame && loading && gamecircle) {
        loading.style.opacity = "1";
        loading.style.pointerEvents = "auto";
        gamecircle.style.visibility = "hidden";
    }
    
    resizet = setTimeout(() => {
        if (!currentgame) {
            rendergamecircle();
            rendergamecircle(true);
            currentlaymode = laymode;
            if (loading && gamecircle) {
                setTimeout(() => {
                    loading.style.opacity = "0";
                    loading.style.pointerEvents = "none";
                    gamecircle.style.visibility = "";
                }, 750);
            }
        } else if (loading && gamecircle) {
            loading.style.opacity = "0";
            loading.style.pointerEvents = "none";
            gamecircle.style.visibility = "";
        }
    }, 250);
});
window.addEventListener("load", () => {
    requestAnimationFrame(() => {
        setTimeout(() => {
            if (!currentgame && games.length > 0) {rendergamecircle()}
            if (!currentgame && iosgames.length > 0) {rendergamecircle(true)}
        }, 150);
    });
});