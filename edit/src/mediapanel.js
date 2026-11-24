import {replacementkey} from "./package.js";
import {mediaplayer} from "./mediaplayer.js";
import {mediaview} from "./mediaview.js";
import {decodecaf, replacecaf} from "./caf.js";
import {replacemp4} from "./video.js";
import {previewmedia, readmedia, replacetexture, texturename} from "./sprites.js";
import {findtextureframes} from "./splitfinder.js";
import {rendersplit, replacesplit} from "./spritesplits.js";

export function mediapanel(root, {current, run, download, refresh, press}) {
    const find = selector => root.querySelector(selector);
    const elements = {image: find(".spriteimage"), audio: find(".spriteaudio"), video: find(".spritevideo")};
    const view = find(".spriteview");
    const camera = mediaview(view, positionactions);
    const player = mediaplayer(find(".mediapreview"), {press, rotate: camera.rotate});
    const stage = find(".texturestage");
    const overlay = find(".textureframes");
    const outlines = find(".textureoutlines");
    const actions = find(".spriteframeactions");
    const framereplace = find(".importframe");
    const frameinput = find(".spriteframeinput");
    const frameexport = find(".exportframe");
    const fileinput = find(".spriteinput");
    const replace = find(".importsprite");
    const reset = find(".resetsprite");
    const save = find(".exportsprite");
    const footer = find(".panelfooter");
    let item;
    let frames = [];
    let selected = -1;
    let atlas;
    let url = "";

    function positionactions() {
        if (actions.hidden) return;
        const frame = overlay.children[selected].getBoundingClientRect();
        const bounds = view.getBoundingClientRect();
        const footerbox = footer.getBoundingClientRect();
        const bottom = footerbox.height ? Math.min(bounds.bottom, footerbox.top) : bounds.bottom;
        const width = actions.offsetWidth;
        const height = actions.offsetHeight;
        if (!width || !height) return;
        const scale = Math.min(Number(view.style.getPropertyValue("--media-scale")) || 1,
            Math.max(0, bounds.width - 6) / width, Math.max(0, bottom - bounds.top - 6) / height);
        actions.style.setProperty("--frame-action-scale", String(scale));
        actions.style.visibility = frame.right <= bounds.left || frame.left >= bounds.right ||
            frame.bottom <= bounds.top || frame.top >= bounds.bottom ? "hidden" : "";
        const left = (frame.left + frame.right - width * scale) / 2;
        const maxy = Math.max(3, bottom - bounds.top - height * scale - 3);
        const top = frame.bottom + 3;
        const y = top + height * scale <= bottom ? top : frame.top - height * scale - 3;
        actions.style.left = Math.max(3, Math.min(bounds.width - width * scale - 3, left - bounds.left)) + "px";
        actions.style.top = Math.max(3, Math.min(maxy, y - bounds.top)) + "px";
    }

    const resize = new ResizeObserver(positionactions);
    for (const target of [view, stage, footer]) resize.observe(target);

    function selectframe(index) {
        overlay.children[selected]?.setAttribute("aria-pressed", "false");
        selected = frames[index] ? index : -1;
        overlay.children[selected]?.setAttribute("aria-pressed", "true");
        actions.hidden = selected === -1;
        positionactions();
    }

    function clearpreview(resetzoom = true) {
        player.clear();
        selectframe(-1);
        if (resetzoom) camera.reset();
        if (url) URL.revokeObjectURL(url);
        url = "";
        atlas = undefined;
        frames = [];
        stage.hidden = outlines.hidden = true;
        overlay.replaceChildren();
        for (const element of Object.values(elements)) {
            if (element instanceof HTMLMediaElement) element.pause();
            element.hidden = true;
            if (element.hasAttribute("src")) {
                element.removeAttribute("src");
                if (element instanceof HTMLMediaElement) element.load();
            }
        }
    }

    function clear() {
        clearpreview();
        item = undefined;
        reset.hidden = true;
    }

    function setframes() {
        const {naturalWidth: width, naturalHeight: height} = elements.image;
        stage.style.setProperty("--texture-width", width + "px");
        stage.style.setProperty("--texture-ratio", String(width / height));
        const percent = (value, extent) => (100 * value / extent) + "%";
        for (const [index, frame] of frames.entries()) {
            const {x, y, w, h, idx = index} = frame;
            const button = document.createElement("button");
            button.type = "button";
            button.className = "spriteframe";
            button.title = `Sprite #${idx} (x${x}, y${y}, ${w}x${h})`;
            button.setAttribute("aria-pressed", "false");
            Object.assign(button.style, {
                left: percent(x, width), top: percent(y, height),
                width: percent(w, width), height: percent(h, height)
            });
            button.addEventListener("click", () => selectframe(selected === index ? -1 : index));
            overlay.append(button);
        }
        outlines.hidden = !frames.length;
    }

    function iscaf() {
        return item?.kind === "audio" && /\.caf$/i.test(item.path);
    }

    function ismp4() {
        return item?.kind === "video" && /\.mp4$/i.test(item.path);
    }

    function sync(working) {
        const editable = item?.kind === "image" || iscaf() || ismp4();
        replace.hidden = !editable;
        replace.disabled = working || !editable || !url;
        save.disabled = working || !url;
        reset.disabled = working;
        outlines.disabled = working;
        framereplace.disabled = frameexport.disabled = working;
        fileinput.accept = iscaf() ? "audio/*,.caf" : ismp4() ? "video/mp4,.mp4" : "image/*";
    }

    async function blob() {
        const {replacements} = current();
        if (iscaf()) return new Blob([decodecaf(await readmedia(item, replacements))], {type: "audio/wav"});
        return previewmedia(item, replacements);
    }

    async function preview(keepframe = false) {
        const index = keepframe ? selected : -1;
        const layout = keepframe ? frames : undefined;
        clearpreview(!keepframe);
        if (!item) return;
        const source = await blob();
        const element = elements[item.kind];
        element.title = item.label;
        url = URL.createObjectURL(source);
        element.src = url;
        element.hidden = false;
        const {entries, replacements} = current();
        const modified = item.parts.some(part => replacements.has(replacementkey(part)));
        if (item.kind === "image") {
            element.alt = item.label;
            await element.decode();
            atlas = source;
            frames = layout ?? await findtextureframes(item, entries, undefined, modified ? undefined : source).catch(() => []);
            setframes();
            stage.hidden = false;
            selectframe(index);
        } else player.show(element);
        reset.hidden = !modified;
    }

    async function draw() {
        item = current().selected;
        reset.hidden = true;
        await preview();
    }

    outlines.addEventListener("click", () => {
        const hidden = overlay.classList.toggle("nooutlines");
        outlines.setAttribute("aria-pressed", String(!hidden));
    });
    framereplace.addEventListener("click", () => frameinput.click());
    frameinput.addEventListener("change", () => {
        const file = frameinput.files[0];
        frameinput.value = "";
        const frame = frames[selected];
        if (!file || !frame) return;
        void run(async () => {
            const {replacements} = current();
            const changes = await replacesplit(item, replacements, frame, file);
            for (const [key, bytes] of changes) replacements.set(key, bytes);
            refresh();
            await preview(true);
        });
    });
    frameexport.addEventListener("click", () => void run(async () => {
        const frame = frames[selected];
        if (!frame) return;
        const {x, y, w, h, idx = selected} = frame;
        const sheet = texturename(item).replace(/\.[^.]+$/, "").replace(/[^\w-]+/g, "_");
        const sprite = await rendersplit(atlas, frame, current().replacements);
        download(sprite, `${sheet} - #${idx} x${x}y${y} ${w}x${h}.png`);
    }));
    replace.addEventListener("click", () => fileinput.click());
    fileinput.addEventListener("change", () => {
        const file = fileinput.files[0];
        fileinput.value = "";
        if (!file || !item) return;
        void run(async () => {
            const {replacements} = current();
            if (iscaf()) replacements.set(replacementkey(item), await replacecaf(file, await readmedia(item)));
            else if (ismp4()) replacements.set(replacementkey(item), await replacemp4(file, await readmedia(item)));
            else {
                const changes = await replacetexture(item, file);
                for (const [key, bytes] of changes) replacements.set(key, bytes);
            }
            refresh();
            await preview();
        });
    });

    save.addEventListener("click", () => void run(async () => {
        if (!item) return;
        const name = texturename(item);
        const filename = iscaf() ? name.replace(/\.[^.]+$/, ".wav") : name;
        download(atlas ?? await blob(), filename);
    }));

    reset.addEventListener("click", () => void run(async () => {
        const {replacements} = current();
        const parts = [...item.parts, ...frames.flatMap(frame => frame.alpha?.parts ?? [])];
        for (const part of parts) replacements.delete(replacementkey(part));
        refresh();
        await preview();
    }));

    return {clear, draw, sync};
}
