import {replacementkey} from "./package.js";
import {previewtexture} from "./sprites.js";

const experiments = ["Getting Started", "Shooting the Candy", "Sticky Steps", "Rocket Science",
    "Bath Time", "Handy Candy", "Ant Hill", "Bamboo Chutes"];
const original = ["Cardboard Box", "Fabric Box", "Foil Box", "Magic Box", "Valentine Box", "Toy Box",
    "Gift Box", "Cosmic Box", "Toolbox", "Buzz Box", "DJ Box", "Spooky Box", "Steam Box", "Lantern Box",
    "Cheese Box", "Pillow Box", "Mechanical Box"];
const timetravel = [
    ["The Middle Ages", "medieval"], ["The Renaissance", "renaissance"], ["Pirate Ship", "pirate"],
    ["Ancient Egypt", "egypt"], ["Ancient Greece", "greece"], ["The Stone Age", "dinosaurs"],
    ["Disco Era", "disco"], ["Wild West", "western"], ["Asian Dynasty", "china"],
    ["Industrial Age", "industrial"], ["The Future", "future"], ["Parallel Universe", "paradox"]
];
const tileatlas = "/preview/dx/dist/wwwroot/content/images";
const backgroundroot = tileatlas + "/backgrounds";

export function levelgame(packageid) {
    const id = String(packageid).toLowerCase();
    if (/timetravel|\.ctrtt(?:[._]|$)/.test(id)) return "timetravel";
    if (/ctrexperiments|\.ctrexp(?:[._]|$)/.test(id)) return "experiments";
    if (/cuttheropexmas|\.ctrxmas(?:[._]|$)|\.holiday(?:[._]|$)/.test(id)) return "holiday";
    return "original";
}

function title(game, box) {
    if (box === null) return "Levels";
    const name = game === "timetravel" ? timetravel[box - 1]?.[0]
        : game === "experiments" ? experiments[box - 1]
            : game === "holiday" ? "Holiday Gift" : original[box - 1];
    return name ?? "Box " + box;
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

export function levelart(packageid, sprites, replacements) {
    const game = levelgame(packageid);
    const cache = new Map();
    return async (box, cover = false) => {
        if (game === "original" && !cover) return null;
        const prefix = boxstem(game, box);
        if (!prefix) return null;
        const candidates = sprites.map(item => ({item, stem: spritebase(item.path)}))
            .filter(({stem}) => stem === prefix || stem.startsWith(prefix + "_"))
            .filter(({stem}) => game !== "original" || stem.startsWith(prefix + "_cover"))
            .filter(({stem}) => stem.slice(prefix.length).split("_").every(part =>
                !part || /^(?:\d+(?:x\d+)?|cover|p1|hd|pad|ipad|iphone5|retina)$/.test(part)));
        candidates.sort((a, b) => {
            const difference = cover
                ? Number(b.stem.includes("_cover")) - Number(a.stem.includes("_cover"))
                : Number(a.stem.includes("_cover")) - Number(b.stem.includes("_cover"));
            return difference || b.item.size - a.item.size;
        });
        for (const {item} of candidates) {
            const changed = replacements();
            const current = item.parts.map(part => changed.get(replacementkey(part)));
            const saved = cache.get(item);
            if (saved && current.every((part, index) => part === saved.parts[index])) {
                const blob = await saved.image;
                if (blob) return blob;
                continue;
            }
            const image = previewtexture(item, changed).catch(() => null);
            if (cache.size >= 10) cache.delete(cache.keys().next().value);
            cache.set(item, {parts: current, image});
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
    const node = element("button", classname, label);
    node.type = "button";
    return node;
}

function arrow(label, next = false) {
    const node = button("levelpickarrow" + (next ? " levelpicknext" : ""));
    const icon = element("img", "levelpickarrowicon");
    icon.alt = label;
    icon.src = "/assets/images/buttons/back.png";
    icon.draggable = false;
    node.append(icon);
    return node;
}

export function levelpicker(root, change) {
    let packages = [];
    let boxindex = 0;
    let active = null;
    let packageid = "";
    let readart;
    let generation = 0;
    const urls = new Set();

    function begin(view) {
        generation++;
        for (const url of urls) URL.revokeObjectURL(url);
        urls.clear();
        root.dataset.view = view;
        root.replaceChildren();
    }

    function decorate(box, image) {
        if (!readart) return;
        const revision = generation;
        void readart(box, true).then(blob => {
            if (!blob || generation !== revision) return;
            const url = URL.createObjectURL(blob);
            urls.add(url);
            image.src = url;
            image.hidden = false;
        }).catch(() => {});
    }

    function imagefor(box) {
        const image = element("img", "levelpickart");
        image.alt = "";
        image.draggable = false;
        const fallback = staticboxcover(packageid, box);
        if (fallback) image.src = fallback;
        else image.hidden = true;
        decorate(box, image);
        return image;
    }

    function header(label, backlabel, action) {
        const bar = element("header", "levelpickheader");
        const back = arrow(backlabel);
        back.addEventListener("click", action);
        bar.append(back, element("span", "levelpicktitle", label));
        root.append(bar);
        return back;
    }

    function showboxes(focus = false) {
        active = null;
        begin("boxes");
        if (!packages.length) return;
        const previous = arrow("Previous box");
        const next = arrow("Next box", true);
        previous.disabled = boxindex === 0;
        next.disabled = boxindex === packages.length - 1;
        previous.hidden = next.hidden = packages.length < 2;
        const row = element("div", "levelpickstrip");
        let center;
        for (const offset of [-1, 0, 1]) {
            const entry = packages[boxindex + offset];
            if (!entry) {
                row.append(element("span", "levelpackspace"));
                continue;
            }
            const name = title(levelgame(packageid), entry.box);
            const card = button("levelpack");
            card.dataset.position = String(offset);
            const label = entry.box === null ? name : entry.box + ". " + name;
            card.append(imagefor(entry.box), element("span", "levelpacklabel", label));
            card.addEventListener("click", () => {
                boxindex += offset;
                showlevels(true);
            });
            row.append(card);
            if (!offset) center = card;
        }
        const frame = element("div", "levelpickframes");
        frame.append(previous, row, next);
        root.append(frame);
        if (focus) center?.focus({preventScroll: true});
        let start;
        let lastswipe = -Infinity;
        row.addEventListener("pointerdown", event => {
            if (event.pointerType === "touch") start = event.clientX;
        });
        row.addEventListener("pointerup", event => {
            const origin = start;
            start = undefined;
            if (origin === undefined || Math.abs(event.clientX - origin) < 42) return;
            lastswipe = performance.now();
            move(event.clientX < origin ? 1 : -1, false);
        });
        row.addEventListener("pointercancel", () => {start = undefined});
        row.addEventListener("click", event => {
            if (performance.now() - lastswipe > 350) return;
            event.stopPropagation();
            event.preventDefault();
        }, true);
        const move = (step, focus = true) => {
            const nextindex = boxindex + step;
            if (!packages[nextindex]) return;
            boxindex = nextindex;
            showboxes(focus);
        };
        previous.addEventListener("click", () => move(-1));
        next.addEventListener("click", () => move(1));
        frame.addEventListener("keydown", event => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            move(event.key === "ArrowRight" ? 1 : -1);
        });
    }

    function showlevels(focus = false) {
        const previous = active;
        const entry = packages[boxindex];
        active = null;
        begin("levels");
        const back = header(title(levelgame(packageid), entry.box), "Back to boxes", () => showboxes(true));
        const panel = element("div", "levelpickpanel");
        if (entry.box !== null) panel.append(imagefor(entry.box));
        const grid = element("div", "levelpickgrid");
        let activebutton;
        for (const level of entry.levels) {
            const tile = button("levelpicktile", String(level.level));
            tile.title = "Level " + level.level;
            tile.addEventListener("click", () => showlevel(level, true));
            if (level === previous) activebutton = tile;
            grid.append(tile);
        }
        panel.append(grid);
        root.append(panel);
        if (previous) change(null);
        if (focus) (activebutton ?? back).focus({preventScroll: true});
    }

    function showlevel(level, focus = false) {
        active = level;
        begin("selected");
        const pack = title(levelgame(packageid), level.box);
        const back = header(level.box === null ? "Level " + level.level : pack + " · Level " + level.level, "Back to levels", () => showlevels(true));
        if (focus) {
            back.focus({preventScroll: true});
            change(level);
        }
    }

    return {
        load(levels, id, selectedIndex, art) {
            packageid = id;
            readart = art;
            packages = [...Map.groupBy(levels, level => level.box)].map(([box, levels]) => ({box, levels}));
            const selected = levels.find(level => String(level.index) === String(selectedIndex));
            boxindex = selected ? packages.findIndex(entry => entry.box === selected.box) : 0;
            if (selected) showlevel(selected);
            else showboxes();
            return active;
        },
        selection: () => active,
        clear() {
            packages = [];
            active = null;
            readart = undefined;
            begin("");
        }
    };
}
