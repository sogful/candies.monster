import {dropdown} from "/assets/static/js/controls/dropdown.js";
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
    const camera = mediaview(find(".spriteview"));
    const player = mediaplayer(find(".mediapreview"), {press, rotate: camera.rotate});
    const framepicker = find(".splitpicker");
    const frameselect = find(".splitselect");
    const fileinput = find(".spriteinput");
    const replace = find(".importsprite");
    const reset = find(".resetsprite");
    const save = find(".exportsprite");
    dropdown(frameselect);
    let item;
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
        framepicker.hidden = reset.hidden = true;
        frameselect.replaceChildren();
    }

    function setframes(found) {
        frames = found;
        framepicker.hidden = !frames.length;
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
        const editable = item?.kind === "image" && !selectedframe()?.inferred || iscaf() || ismp4();
        replace.hidden = !editable;
        replace.disabled = working || !editable || !url;
        save.disabled = working || !url;
        reset.disabled = working;
        frameselect.disabled = working;
        fileinput.accept = iscaf() ? "audio/*,.caf" : ismp4() ? "video/mp4,.mp4" : "image/*";
    }

    async function blob(source) {
        const {replacements} = current();
        if (iscaf()) return new Blob([decodecaf(await readmedia(item, replacements))], {type: "audio/wav"});
        const native = source ?? await previewmedia(item, replacements);
        const frame = selectedframe();
        return frame ? rendersplit(native, frame, replacements) : native;
    }

    async function preview(source) {
        clearpreview();
        if (!item) return;
        const image = await blob(source);
        const element = elements[item.kind];
        element.title = item.label;
        if (item.kind === "image") element.alt = selectedframe()?.name || item.label;
        url = URL.createObjectURL(image);
        element.src = url;
        element.hidden = false;
        if (element instanceof HTMLMediaElement) player.show(element);
        const {replacements} = current();
        reset.hidden = !item.parts.some(part => replacements.has(replacementkey(part)));
    }

    async function draw() {
        const {selected, entries, replacements} = current();
        let source;
        if (selected !== item) {
            clear();
            item = selected;
            if (item?.kind === "image") {
                source = await previewmedia(item, replacements);
                setframes(await findtextureframes(item, entries, replacements, source).catch(() => []));
            }
        }
        await preview(source);
    }

    frameselect.addEventListener("change", () => void run(preview));
    replace.addEventListener("click", () => fileinput.click());
    fileinput.addEventListener("change", () => {
        const file = fileinput.files[0];
        fileinput.value = "";
        if (!file || !item) return;
        void run(async () => {
            const {replacements} = current();
            const frame = selectedframe();
            if (frame?.inferred) return;
            if (iscaf()) replacements.set(replacementkey(item), await replacecaf(file, await readmedia(item)));
            else if (ismp4()) replacements.set(replacementkey(item), await replacemp4(file, await readmedia(item)));
            else {
                const changes = frame ? await replacesplit(item, replacements, frame, file) : await replacetexture(item, file);
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
        const framebase = frame?.inferred ? "" : frame?.name?.split(/[\\/]/).at(-1)?.replace(/\.[^.]+$/, "");
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
