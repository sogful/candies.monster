import {parsegamescsv, resolveiconpath} from "./load.js";
import {loadversions} from "./versions.js";

/*//////////////////////////////////////////////////////////////////////*/
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
function hideloading() {
    const loading = document.querySelector(".loading");
    if (loading) {
        loading.style.opacity = "0";
        loading.style.pointerEvents = "none";
    }
}
if (document.readyState === "complete") hideloading();
else window.addEventListener("load", hideloading);
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

function containerscroll(game) {
    const cont = document.querySelector(".container");
    if (!cont) return;
    const id = game && game.iosstuff ? "gamescreenios" : "gamescreen";
    const gs = document.querySelector(`#${id}`);
    if (!gs) return;
    cont.scrollTo({left: gs.offsetLeft, behavior: "smooth"});
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
        const parsed = parsegamescsv(text);
        games = parsed.games;
        versionscache = parsed.versionscache;
        requestAnimationFrame(() => {setTimeout(() => {rendergamecircle()}, 50)});
    } catch (e) {}
    try {
        const res2 = await fetch("ios.csv");
        const text2 = await res2.text();
        const parsed2 = parsegamescsv(text2);
        iosgames = parsed2.games.map(g => ({...g, iosstuff: true}));
        iosversionscache = parsed2.versionscache;
        requestAnimationFrame(() => {setTimeout(() => {rendergamecircle(true)}, 80)});
    } catch (e) {}
}
function rendergamecircle(isios) {
    const circleid = isios ? "gamecircle-ios" : "gamecircle";
    const gamelist = isios ? iosgames : games;
    const circle = document.querySelector(`#${circleid}`);
    if (!circle) return;
    circle.classList.add("rendering");
    circle.innerHTML = "";
    const sorted = [...gamelist].sort((a, b) => b.importance - a.importance);
    const tinyscreen = window.innerWidth < 650;
    
    if (tinyscreen) {
        sorted.forEach((g) => {
            const ic = document.createElement("div");
            ic.className = "gameicon clickable";
            ic.dataset.gameid = (() => {
                const vk = g.verkey;
                if (vk != null) return Array.isArray(vk) ? vk[0] : vk;
                return Array.isArray(g.package) ? g.package[0] : g.package;
            })();
            const im = document.createElement("img");
            im.src = resolveiconpath(Array.isArray(g.icon) ? g.icon[0] : g.icon);
            im.draggable = false;
            im.onerror = function() {this.src = "/assets/images/gameicons/idk.webp"};
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
            ic.dataset.gameid = (() => {
                const vk = g.verkey;
                if (vk != null) return Array.isArray(vk) ? vk[0] : vk;
                return Array.isArray(g.package) ? g.package[0] : g.package;
            })();
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
            ic.style.position = "absolute";
            placed.push({x: x + sz / 2, y: y + sz / 2, size: sz});
            const im = document.createElement("img");
            im.src = resolveiconpath(Array.isArray(g.icon) ? g.icon[0] : g.icon);
            im.draggable = false;
            im.onerror = function() {this.src = "/assets/images/gameicons/idk.webp"};
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
    const vs = document.querySelector("#versionscreen");
    
    const alreadyshown = vs.classList.contains("active");
    
    const packages = Array.isArray(g.package) ? g.package : [g.package];
    const vcache = g.iosstuff ? iosversionscache : versionscache;
    await loadversions(packages, g, thisloadid, alreadyshown, vcache, (id) => id === currentloadid, containerscroll);
}

function goback() {
    currentloadid++;
    const gsid = currentgame && currentgame.iosstuff ? "gamescreenios" : "gamescreen";
    const gs = document.querySelector(`#${gsid}`);
    const vs = document.querySelector("#versionscreen");
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
    const navios = document.querySelector("#navios");
    const navand = document.querySelector("#navandroid");
    const gsios = document.querySelector("#gamescreenios");
    const gs = document.querySelector("#gamescreen");
    const cont = document.querySelector(".container");
    if (navios && gsios && cont) {
        navios.addEventListener("click", () => {
            const c = document.querySelector(".click");
            if (c) {c.currentTime = 0; c.play().catch(() => {})}
            cont.scrollTo({left: gsios.offsetLeft, behavior: "smooth"});
            navios.style.display = "none";
            if (navand) navand.style.display = "flex";
        });
    }
    if (navand && gs && cont) {
        navand.addEventListener("click", () => {
            const c = document.querySelector(".click");
            if (c) {c.currentTime = 0; c.play().catch(() => {})}
            cont.scrollTo({left: gs.offsetLeft, behavior: "smooth"});
            navand.style.display = "none";
            if (navios) navios.style.display = "flex";
        });
    }
}

if (document.readyState === "loading") {document.addEventListener("DOMContentLoaded", () => {setupbackbutton(); setupscrollnav()})}
else {setupbackbutton(); setupscrollnav()}
loadgames();

let resizet;
let currentlaymode = window.innerWidth < 650 ? "mobile" : "desktop";

window.addEventListener("resize", () => {
    clearTimeout(resizet);
    const laymode = window.innerWidth < 650 ? "mobile" : "desktop";
    const loading = document.querySelector(".loading");
    const gamecircle = document.querySelector("#gamecircle");
    
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
