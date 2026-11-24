import {dropdown} from "/assets/static/js/controls/dropdown.js";
import {replacementkey} from "./package.js";
import {mediaview} from "./mediaview.js";
import {decodecaf, replacecaf} from "./caf.js";
import {previewmedia, readmedia, replacetexture, texturename} from "./sprites.js";

export function mediapanel(root, {current, run, download, refresh}) {
    const find = selector => root.querySelector(selector);
    const elements = {image: find(".spriteimage"), audio: find(".spriteaudio"), video: find(".spritevideo")};
    const camera = mediaview(find(".spriteview"));
    const framepicker = find(".splitpicker");
    const frameselect = find(".splitselect");
    const rotate = find(".rotatevideo");
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
        camera.reset();
        if (url) URL.revokeObjectURL(url);
        url = "";
        for (const element of Object.values(elements)) {
            if (element instanceof HTMLMediaElement) element.pause();
            element.hidden = true;
            element.removeAttribute("src");
        }
    }

    function clear() {
        clearpreview();
        item = undefined;
        frames = [];
        framepicker.hidden = rotate.hidden = reset.hidden = true;
        frameselect.replaceChildren();
    }

    function selectedframe() {
        return frameselect.value === "" ? undefined : frames[Number(frameselect.value)];
    }

    function iscaf() {
        return item?.kind === "audio" && /\.caf$/i.test(item.path);
    }

    function sync(working) {
        const editable = item?.kind === "image" || iscaf();
        replace.hidden = !editable;
        replace.disabled = working || !editable || !url;
        save.disabled = working || !url;
        reset.disabled = working;
        rotate.disabled = working;
        frameselect.disabled = working;
        fileinput.accept = iscaf() ? "audio/*,.caf" : "image/*";
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
                if (splittools) frames = await splittools.findsplits(item, entries, replacements).catch(() => []);
            }
            framepicker.hidden = !frames.length;
            if (frames.length) {
                frameselect.replaceChildren(new Option("Entire texture", ""), ...frames.map((frame, index) =>
                    new Option(frame.name || "Frame " + (index + 1), String(index))));
                frameselect.value = "";
            }
        }
        await preview();
    }

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
