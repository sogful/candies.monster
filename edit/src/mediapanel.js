import {replacementkey} from "./package.js";
import {mediaplayer} from "./mediaplayer.js";
import {mediaview} from "./mediaview.js";
import {decodecaf, replacecaf} from "./caf.js";
import {replacemp4} from "./video.js";
import {previewmedia, readmedia, replacetexture, texturename} from "./sprites.js";
import {findtextureframes} from "./splitfinder.js";
import {rendersplit} from "./spritesplits.js";

export function mediapanel(root, {current, run, download, refresh, press}) {
    const find = selector => root.querySelector(selector);
    const elements = {image: find(".spriteimage"), audio: find(".spriteaudio"), video: find(".spritevideo")};
    const camera = mediaview(find(".spriteview"));
    const player = mediaplayer(find(".mediapreview"), {press, rotate: camera.rotate});
    const stage = find(".texturestage");
    const overlay = find(".textureframes");
    const outlines = find(".textureoutlines");
    const fileinput = find(".spriteinput");
    const replace = find(".importsprite");
    const reset = find(".resetsprite");
    const save = find(".exportsprite");
    let item;
    let frames = [];
    let atlas;
    let url = "";

    function clearpreview() {
        player.clear();
        camera.reset();
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
            button.title = `Download sprite #${idx} (x${x}, y${y}, ${w}x${h})`;
            Object.assign(button.style, {
                left: percent(x, width), top: percent(y, height),
                width: percent(w, width), height: percent(h, height)
            });
            button.addEventListener("click", () => void run(async () => {
                const sheet = texturename(item).replace(/\.[^.]+$/, "").replace(/[^\w-]+/g, "_");
                const sprite = await rendersplit(atlas, frame, current().replacements);
                download(sprite, `${sheet} - #${idx} x${x}y${y} ${w}x${h}.png`);
            }));
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
        fileinput.accept = iscaf() ? "audio/*,.caf" : ismp4() ? "video/mp4,.mp4" : "image/*";
    }

    async function blob() {
        const {replacements} = current();
        if (iscaf()) return new Blob([decodecaf(await readmedia(item, replacements))], {type: "audio/wav"});
        return previewmedia(item, replacements);
    }

    async function preview() {
        clearpreview();
        if (!item) return;
        const source = await blob();
        const element = elements[item.kind];
        element.title = item.label;
        url = URL.createObjectURL(source);
        element.src = url;
        element.hidden = false;
        const {entries, replacements} = current();
        if (item.kind === "image") {
            element.alt = item.label;
            await element.decode();
            atlas = source;
            frames = await findtextureframes(item, entries, replacements, source).catch(() => []);
            setframes();
            stage.hidden = false;
        } else player.show(element);
        reset.hidden = !item.parts.some(part => replacements.has(replacementkey(part)));
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
