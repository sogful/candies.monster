import {dropdown} from "/assets/static/js/controls/dropdown.js";
import {replacementkey} from "./package.js";
import {mediaplayer} from "./mediaplayer.js";
import {mediaview} from "./mediaview.js";
import {decodecaf, replacecaf} from "./caf.js";
import {replacemp4} from "./video.js";
import {previewmedia, readmedia, replacetexture, texturename} from "./sprites.js";

export function mediapanel(root, {current, run, download, refresh}) {
    const find = selector => root.querySelector(selector);
    const elements = {image: find(".spriteimage"), audio: find(".spriteaudio"), video: find(".spritevideo")};
    const camera = mediaview(find(".spriteview"));
    const player = mediaplayer(find(".mediapreview"));
    const framepicker = find(".splitpicker");
    const frameselect = find(".splitselect");
    const rotate = find(".rotatevideo");
    const atlasbutton = find(".splitxml");
    const atlasinput = find(".splitxmlinput");
    const manual = new WeakMap();
    const fileinput = find(".spriteinput");
    const replace = find(".importsprite");
    const reset = find(".resetsprite");
    const save = find(".exportsprite");
    dropdown(frameselect);
    let item;
    let splittools;
    let frames = [];
    let url = "";

    function clearpreview() {
        player.clear();
        camera.reset();
        if (url) URL.revokeObjectURL(url);
        url = "";
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
        frames = [];
        framepicker.hidden = rotate.hidden = reset.hidden = atlasbutton.hidden = true;
        frameselect.replaceChildren();
    }

    function setframes(found) {
        frames = found;
        framepicker.hidden = !frames.length;
        atlasbutton.hidden = !!frames.length || !splittools || item?.kind !== "image";
        if (!frames.length) return;
        frameselect.replaceChildren(new Option("Entire texture", ""), ...frames.map((frame, index) =>
            new Option(frame.name || "Frame " + (index + 1), String(index))));
        frameselect.value = "";
    }

    function selectedframe() {
        return frameselect.value === "" ? undefined : frames[Number(frameselect.value)];
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
        rotate.disabled = atlasbutton.disabled = working;
        frameselect.disabled = working;
        fileinput.accept = iscaf() ? "audio/*,.caf" : ismp4() ? "video/mp4,.mp4" : "image/*";
    }

    async function blob() {
        const {replacements} = current();
        if (iscaf()) return new Blob([decodecaf(await readmedia(item, replacements))], {type: "audio/wav"});
        const native = await previewmedia(item, replacements);
        const frame = selectedframe();
        return frame ? splittools.rendersplit(native, frame, replacements) : native;
    }

    async function preview() {
        clearpreview();
        if (!item) return;
        const image = await blob();
        const element = elements[item.kind];
        element.title = item.label;
        if (item.kind === "image") element.alt = selectedframe()?.name || item.label;
        url = URL.createObjectURL(image);
        element.src = url;
        element.hidden = false;
        if (element instanceof HTMLMediaElement) player.show(element);
        const {replacements} = current();
        reset.hidden = !item.parts.some(part => replacements.has(replacementkey(part)));
        rotate.hidden = item.kind !== "video";
    }

    async function draw() {
        const {selected, entries, replacements} = current();
        if (selected !== item) {
            clear();
            item = selected;
            if (item?.kind === "image") {
                splittools ??= await import("./spritesplits.js").catch(() => null);
                if (splittools) setframes(manual.get(item) ?? await splittools.findsplits(item, entries, replacements).catch(() => []));
            }
        }
        await preview();
    }

    atlasbutton.addEventListener("click", () => atlasinput.click());
    atlasinput.addEventListener("change", () => {
        const file = atlasinput.files[0];
        atlasinput.value = "";
        if (!file || !item || !splittools) return;
        void run(async () => {
            if (file.size > 1024 * 1024) throw new Error("Choose an atlas XML file smaller than 1 MB.");
            const {entries, replacements} = current();
            const found = await splittools.findsplits(item, entries, replacements, await file.text());
            if (!found.length) throw new Error("The atlas XML has no matching frames for this texture.");
            manual.set(item, found);
            setframes(found);
        });
    });

    frameselect.addEventListener("change", () => void run(preview));
    rotate.addEventListener("click", () => camera.rotate());
    replace.addEventListener("click", () => fileinput.click());
    fileinput.addEventListener("change", () => {
        const file = fileinput.files[0];
        fileinput.value = "";
        if (!file || !item) return;
        void run(async () => {
            const {replacements} = current();
            const frame = selectedframe();
            if (iscaf()) replacements.set(replacementkey(item), await replacecaf(file, await readmedia(item)));
            else if (ismp4()) replacements.set(replacementkey(item), await replacemp4(file, await readmedia(item)));
            else {
                const changes = frame ? await splittools.replacesplit(item, replacements, frame, file) : await replacetexture(item, file);
                for (const [key, bytes] of changes) replacements.set(key, bytes);
            }
            refresh();
            await preview();
        });
    });

    save.addEventListener("click", () => void run(async () => {
        if (!item) return;
        const frame = selectedframe();
        const name = texturename(item);
        const framebase = frame?.name?.split(/[\\/]/).at(-1)?.replace(/\.[^.]+$/, "");
        const stem = name.replace(/\.[^.]+$/, "");
        const filename = iscaf() ? stem + ".wav" : frame ? (framebase || stem + "-" + (Number(frameselect.value) + 1)) + ".png" : name;
        download(await blob(), filename);
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
