import {replacementkey} from "./package.js";
import {previewtexture} from "./sprites.js";
import {findsplits, rendersplit} from "./spritesplits.js";

const experiments = ["Getting Started", "Shooting the Candy", "Sticky Steps", "Rocket Science",
    "Bath Time", "Handy Candy", "Ant Hill", "Bamboo Chutes"];
const holiday = ["Holiday Gift"];
const original = ["Cardboard Box", "Fabric Box", "Foil Box", "Magic Box", "Valentine Box", "Toy Box",
    "Gift Box", "Cosmic Box", "Toolbox", "Buzz Box", "DJ Box", "Spooky Box", "Steam Box", "Lantern Box",
    "Cheese Box", "Pillow Box", "Mechanical Box"];
const holecolors = ["#462500", "#273400", "#2c2d36", "#1f2a54", "#451f32", "#4b2100", "#541600",
    "#00334e", "#620000", "#422800", "#002f5a", "#003a00", "#3f2a00", "#590c00", "#382d00",
    "#252068", "#37263e"];
const timetravel = [
    ["The Middle Ages", "medieval"], ["The Renaissance", "renaissance"], ["Pirate Ship", "pirate"],
    ["Ancient Egypt", "egypt"], ["Ancient Greece", "greece"], ["The Stone Age", "dinosaurs"],
    ["Disco Era", "disco"], ["Wild West", "western"], ["Asian Dynasty", "china"],
    ["Industrial Age", "industrial"], ["The Future", "future"], ["Parallel Universe", "paradox"]
];
const tileatlas = "/preview/dx/dist/wwwroot/content/images";
const backgroundroot = tileatlas + "/backgrounds";
const coverwidths = [0.947253, 0.953506, 0.948718, 0.958457, 0.949413, 0.953229, 0.949265,
    0.949413, 0.953229, 0.953368, 0.953506, 0.953506, 0.953506, 0.953506, 0.953506, 0.953506, 0.953506];
const artrows = {original: 5, experiments: 2, timetravel: 3, holiday: 1};

export function levelgame(packageid) {
    const id = String(packageid).toLowerCase();
    if (/timetravel|\.ctrtt(?:[._]|$)/.test(id)) return "timetravel";
    if (/ctrexperiments|\.ctrexp(?:[._]|$)/.test(id)) return "experiments";
    if (/cuttheropexmas|\.ctrxmas(?:[._]|$)|\.holiday(?:[._]|$)/.test(id)) return "holiday";
    return "original";
}

function title(game, box) {
    if (box === null) return "Levels";
    const names = game === "experiments" ? experiments : game === "holiday" ? holiday : original;
    const name = game === "timetravel" ? timetravel[box - 1]?.[0] : names[box - 1];
    return name ?? "???";
}

function boxstem(game, box) {
    if (game === "timetravel") {
        const name = timetravel[box - 1]?.[1];
        return name && "bgr_" + name;
    }
    const number = game === "holiday" ? 1 : box;
    return number > 0 ? "bgr_" + String(number).padStart(2, "0") : undefined;
}

function spritebase(path) {
    return path.toLowerCase().split("/").at(-1).replace(/\.(?:raw(?:\.zst)?|png|jpe?g|webp)$/i, "");
}

export function levelart(packageid, sprites, replacements, files) {
    const game = levelgame(packageid);
    const cache = new Map();
    return async (box, cover = false) => {
        const prefix = boxstem(game, box);
        if (!prefix) return null;
        const candidates = sprites.map(item => ({item, stem: spritebase(item.path), size: item.parts.reduce((total, part) => total + part.size, 0)}))
            .filter(({stem}) => stem === prefix || stem.startsWith(prefix + "_"))
            .filter(({stem}) => stem.slice(prefix.length).split("_").every(part =>
                !part || /^(?:\d+(?:x\d+)?|cover|p1|hd|ipad|iphone5|retina)$/.test(part)))
            .filter(({stem}) => !cover || game !== "original" && game !== "holiday" || stem.includes("_cover"));
        candidates.sort((a, b) => {
            const difference = cover
                ? Number(b.stem.includes("_cover")) - Number(a.stem.includes("_cover"))
                : Number(a.stem.includes("_cover")) - Number(b.stem.includes("_cover"));
            const variant = !cover ? Number(/ipad|retina/.test(a.stem)) - Number(/ipad|retina/.test(b.stem)) : 0;
            return difference || variant || b.size - a.size;
        });
        for (const {item} of candidates) {
            const changed = replacements();
            const current = item.parts.map(part => changed.get(replacementkey(part)));
            const key = (cover ? "cover:" : "game:") + replacementkey(item);
            const saved = cache.get(key);
            if (saved && current.every((part, index) => part === saved.parts[index])) {
                const blob = await saved.image;
                if (blob) return blob;
                continue;
            }
            const image = (async () => {
                const blob = await previewtexture(item, changed);
                const frames = await findsplits(item, files, changed, blob).catch(() => []);
                if (!cover) return !item.path.toLowerCase().includes("_cover")
                    ? {blob, frames, path: item.path} : null;
                if (frames[0]) return rendersplit(blob, frames[0], changed);
                if (game === "original" || game === "holiday") return null;
                return blob;
            })().catch(() => null);
            if (cache.size >= 10) cache.delete(cache.keys().next().value);
            cache.set(key, {parts: current, image});
            const blob = await image;
            if (blob) return blob;
        }
        return null;
    };
}

export function staticboxcover(packageid, box) {
    const game = levelgame(packageid);
    if (game === "holiday") return backgroundroot + "/bgr_xmas.webp";
    if (game !== "original" || box === null || box < 1 || box > original.length) return "";
    return tileatlas + "/bgr_" + String(box).padStart(2, "0") + "_cover.webp";
}

/*//////////////////////////////////////////////////////////////////////*/

function element(tag, classname, label = "") {
    const node = document.createElement(tag);
    node.className = classname;
    if (label) node.textContent = label;
    return node;
}

function button(classname, label = "") {
    const node = element("button", classname + " clickable", label);
    node.type = "button";
    return node;
}

function arrow(label, next = false) {
    const node = button("levelpickarrow " + (next ? "levelpicknext" : "levelpickprevious"));
    const icon = element("img", "levelpickarrowicon");
    icon.alt = label;
    icon.src = "art/levels/arrow.webp";
    icon.draggable = false;
    node.append(icon);
    return node;
}

function backbutton(label, action) {
    const back = button("levelpickback");
    back.title = label;
    back.addEventListener("click", action);
    return back;
}

function dragscroll(scroller, horizontal, settle) {
    const offset = horizontal ? "scrollLeft" : "scrollTop";
    let drag;
    let suppressclick = false;

    scroller.addEventListener("pointerdown", event => {
        if (!event.isPrimary || event.button !== 0) return;
        suppressclick = false;
        drag = {id: event.pointerId, x: event.clientX, y: event.clientY, start: scroller[offset], active: false};
    });
    scroller.addEventListener("pointermove", event => {
        if (drag?.id !== event.pointerId) return;
        const x = event.clientX - drag.x;
        const y = event.clientY - drag.y;
        if (!drag.active) {
            if (Math.max(Math.abs(x), Math.abs(y)) < 6) return;
            drag.active = suppressclick = true;
            scroller.setPointerCapture(event.pointerId);
            scroller.classList.add("levelpickdragging");
        }
        event.preventDefault();
        scroller[offset] = drag.start - (horizontal ? x : y);
    });
    function finish(event) {
        if (drag?.id !== event.pointerId) return;
        const {active} = drag;
        drag = undefined;
        if (!active) return;
        settle?.();
        scroller.classList.remove("levelpickdragging");
    }
    scroller.addEventListener("pointerup", finish);
    scroller.addEventListener("pointercancel", finish);
    scroller.addEventListener("pointerleave", event => {
        if (!drag?.active) finish(event);
    });
    scroller.addEventListener("lostpointercapture", event => {
        if (event.target === scroller) finish(event);
    });
    scroller.addEventListener("click", event => {
        if (!suppressclick || !event.detail) return;
        suppressclick = false;
        event.preventDefault();
        event.stopPropagation();
    }, true);
}

function packart(game, box) {
    const index = box - 1;
    const count = game === "holiday" ? 1 : game === "timetravel" ? timetravel.length
        : game === "experiments" ? experiments.length : original.length;
    if (box === null || index < 0 || index >= count) return null;
    const art = element("span", "levelpackart");
    const rows = artrows[game];
    const x = index % 4 * 100 / 3;
    const y = rows < 2 ? 0 : Math.floor(index / 4) * 100 / (rows - 1);
    art.style.backgroundImage = `url("art/levels/${game}.webp")`;
    art.style.backgroundSize = "400% " + rows * 100 + "%";
    art.style.backgroundPosition = x + "% " + y + "%";
    return art;
}

export function levelpicker(root, change) {
    let packages = [];
    let boxindex = 0;
    let active = null;
    let packageid = "";
    let readart;
    let modified;
    const marks = new Map();
    let generation = 0;
    const urls = new Set();

    function begin(view) {
        generation++;
        for (const url of urls) URL.revokeObjectURL(url);
        urls.clear();
        marks.clear();
        root.dataset.view = view;
        root.replaceChildren();
    }

    function refresh() {
        for (const [node, levels] of marks) node.classList.toggle("modifiedentry", !!modified && levels.some(modified));
    }

    function backdrop(box, game) {
        const twin = game === "original" || game === "holiday";
        const backdrop = element("div", "levelpickbackdrop" + (twin ? "" : " levelpicksingle"));
        const fallback = staticboxcover(packageid, box);
        const images = Array.from({length: twin ? 2 : 1}, () => {
            const half = element("span", "levelpickhalf");
            const image = element("img", "levelpickart");
            image.alt = "";
            image.draggable = false;
            image.hidden = !fallback;
            if (fallback) image.src = fallback;
            half.append(image);
            backdrop.append(half);
            return image;
        });
        if (game === "original" && coverwidths[box - 1]) backdrop.style.setProperty("--coverwidth", coverwidths[box - 1]);
        if (!readart || box === null) return backdrop;
        const revision = generation;
        void readart(box, true).then(blob => {
            if (!blob || generation !== revision) return;
            const url = URL.createObjectURL(blob);
            urls.add(url);
            backdrop.style.removeProperty("--coverwidth");
            for (const image of images) {
                image.src = url;
                image.hidden = false;
            }
        }).catch(() => {});
        return backdrop;
    }

    function header(label, backlabel, action) {
        const bar = element("header", "levelpickheader");
        const back = backbutton(backlabel, action);
        bar.append(back, element("span", "levelpicktitle", label));
        root.append(bar);
        return back;
    }

    function showboxes(focus = false) {
        active = null;
        begin("boxes");
        if (!packages.length) return;
        const game = levelgame(packageid);
        root.dataset.game = game;
        const previous = arrow("Previous box");
        const next = arrow("Next box", true);
        previous.hidden = next.hidden = packages.length < 2;
        const row = element("div", "levelpickstrip");
        const cards = packages.map((entry, index) => {
            const name = title(game, entry.box);
            const card = button("levelpack");
            const label = entry.box === null ? name : entry.box + ". " + name;
            const art = name === "???" ? element("span", "levelpackart levelpackcomingsoon") : packart(game, entry.box);
            const color = game === "original" && holecolors[entry.box - 1];
            if (color) {
                const peek = element("span", "levelpackpeek");
                peek.style.backgroundColor = color;
                peek.style.setProperty("--peek-index", index);
                const monster = element("img", "levelpackmonster");
                monster.src = "/edit/art/levels/omnom.webp";
                monster.alt = "";
                monster.draggable = false;
                peek.append(monster);
                card.append(peek);
            }
            if (art) card.append(art);
            const caption = element("span", "levelpacklabel");
            caption.append(element("span", "levelpacktext", label));
            card.append(caption);
            card.addEventListener("click", () => {
                boxindex = index;
                showlevels(true);
            });
            marks.set(card, entry.levels);
            return card;
        });
        row.append(...cards);
        const frame = element("div", "levelpickframes");
        frame.append(previous, row, next);
        root.append(frame);
        refresh();
        const position = index => cards[index].offsetLeft - cards[0].offsetLeft;
        const scroll = (index, behavior = "instant") => row.scrollTo({left: position(index), behavior});
        const update = () => {
            const step = position(Math.min(1, cards.length - 1));
            boxindex = step ? Math.max(0, Math.min(cards.length - 1, Math.round(row.scrollLeft / step))) : 0;
            row.style.setProperty("--peek-scroll", row.scrollLeft + "px");
            previous.disabled = boxindex === 0;
            next.disabled = boxindex === cards.length - 1;
        };
        const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
        const move = (step, withfocus = false) => {
            const index = Math.min(cards.length - 1, Math.max(0, boxindex + step));
            scroll(index, behavior);
            if (withfocus) cards[index].focus({preventScroll: true});
        };
        scroll(boxindex);
        update();
        dragscroll(row, true, () => {
            update();
            scroll(boxindex, behavior);
        });
        row.addEventListener("scroll", update, {passive:true});
        row.addEventListener("wheel", event => {
            if (Math.abs(event.deltaX) >= Math.abs(event.deltaY) || cards.length < 2) return;
            event.preventDefault();
            move(Math.sign(event.deltaY));
        }, {passive:false});
        previous.addEventListener("click", () => move(-1));
        next.addEventListener("click", () => move(1));
        frame.addEventListener("keydown", event => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            move(event.key === "ArrowRight" ? 1 : -1, true);
        });
        if (focus) cards[boxindex]?.focus({preventScroll: true});
    }

    function showlevels(focus = false) {
        const previous = active;
        const entry = packages[boxindex];
        active = null;
        begin("levels");
        const game = levelgame(packageid);
        const panel = element("div", "levelpickpanel");
        const back = backbutton("Back to boxes", () => showboxes(true));
        panel.append(backdrop(entry.box, game), back);
        const scroll = element("div", "levelpickscroll");
        const grid = element("div", "levelpickgrid");
        grid.dataset.columns = entry.levels.length <= 9 ? "3" : entry.levels.length <= 12 ? "4" : "5";
        let activebutton;
        for (const level of entry.levels) {
            const tile = button("levelpicktile");
            tile.append(element("span", "levelpicknumber", String(level.level)));
            tile.title = "Level " + level.level;
            tile.addEventListener("click", () => showlevel(level, true));
            if (level === previous) activebutton = tile;
            marks.set(tile, [level]);
            grid.append(tile);
        }
        scroll.append(grid);
        dragscroll(scroll, false);
        panel.append(scroll);
        root.append(panel);
        refresh();
        if (previous) change(null);
        if (focus) (activebutton ?? back).focus({preventScroll: true});
    }

    function showlevel(level, focus = false) {
        active = level;
        begin("selected");
        const label = level.box === null ? String(level.level) : level.box + "-" + level.level;
        const back = header(label, "Back to levels", () => showlevels(true));
        if (focus) {
            back.focus({preventScroll: true});
            change(level);
        }
    }

    return {
        load(levels, id, selectedIndex, art, ismodified) {
            packageid = id;
            readart = art;
            modified = ismodified;
            packages = [...Map.groupBy(levels, level => level.box)].map(([box, levels]) => ({box, levels}));
            const selected = levels.find(level => String(level.index) === String(selectedIndex));
            boxindex = selected ? packages.findIndex(entry => entry.box === selected.box) : 0;
            if (selected) showlevel(selected);
            else showboxes();
            return active;
        },
        selection: () => active,
        refresh,
        clear() {
            packages = [];
            active = null;
            readart = undefined;
            modified = undefined;
            begin("");
        }
    };
}
