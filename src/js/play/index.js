import {createcontroller} from "/preview/src/game.js";
import {source} from "../source.js";
import {loading} from "./loading.js";
import {played} from "../statistics.js";
import {crash} from "./errors.js";
import {rememberlevel} from "../recently.js";

export function player() {
    const root = document.documentElement;
    const progress = loading();
    const frame = document.createElement("iframe");
    frame.className = "levelgame";
    frame.title = "Cut the Rope DX";
    frame.allow = "autoplay; fullscreen";
    frame.src = "about:blank";
    frame.inert = true;
    frame.setAttribute("aria-hidden", "true");
    document.body.append(frame);
    let sequence = 0;
    let control = null;
    let status = null;
    let timeout;
    let selected = null;

    function stop(focus = false) {
        sequence++;
        clearTimeout(timeout);
        game.close();
        root.classList.remove("gameloading", "gameopen");
        document.dispatchEvent(new Event("gameviewchange"));
        frame.inert = true;
        frame.setAttribute("aria-hidden", "true");
        progress.stop();
        if (focus && control?.isConnected) control.focus({preventScroll: true});
        control = status = selected = null;
    }

    function fail(error) {
        const message = status;
        const title = selected ? selected.title + " by " + selected.creator : "";
        stop();
        if (message?.isConnected) message.textContent = "game could not load. try again.";
        if (typeof error === "string" && error) crash(error, title);
    }

    function watch() {
        clearTimeout(timeout);
        timeout = setTimeout(fail, 180000);
    }

    const game = createcontroller({
        frame, onerror: fail, ontoolong: fail,
        onclose: () => stop(true),
        onprogress(value) {
            if (!root.classList.contains("gameloading")) return;
            const stage = {runtime: "game", metadata: "level", images: "images", sounds: "audio"}[value.stage] || "preparing game";
            const counts = Number.isFinite(value.loaded) && value.total > 0 ? ` ${value.loaded}/${value.total}` : "";
            progress.update(value.percent, stage + counts);
            watch();
        },
        onreload() {
            if (!selected || !control) return;
            root.classList.remove("gameopen");
            root.classList.add("gameloading");
            frame.inert = true;
            frame.setAttribute("aria-hidden", "true");
            progress.start(control);
            document.dispatchEvent(new Event("gameviewchange"));
            watch();
        },
        onready() {
            if (!root.classList.contains("gameloading")) return;
            clearTimeout(timeout);
            const entry = selected;
            if (entry) rememberlevel(entry);
            if (entry) void played(entry).then(() => document.dispatchEvent(new CustomEvent("levelstatistics", {detail: entry}))).catch(() => {});
            progress.update(100, "ready");
            root.classList.add("gameopen");
            root.classList.remove("gameloading");
            document.dispatchEvent(new Event("gameviewchange"));
            progress.stop();
            frame.inert = false;
            frame.removeAttribute("aria-hidden");
            frame.contentWindow.document.querySelector("canvas")?.focus({preventScroll: true});
        }
    });

    async function open(entry, button, message) {
        if (root.classList.contains("gameloading")) {progress.press(); return}
        stop();
        const current = sequence;
        selected = entry;
        control = button;
        status = message;
        status.textContent = "";
        root.classList.add("gameloading");
        document.dispatchEvent(new Event("gameviewchange"));
        progress.start(button);
        watch();
        try {
            const xml = await source(entry.file);
            if (current !== sequence) return;
            await game.open("dx", {xml, view: "level"});
        } catch {
            if (current === sequence) fail();
        }
    }

    window.addEventListener("hashchange", () => stop());
    window.addEventListener("popstate", () => stop());
    document.addEventListener("homeviewchange", () => stop());
    window.addEventListener("pagehide", () => stop());
    document.addEventListener("keydown", event => {
        if (event.key !== "Escape" || !root.classList.contains("gameloading")) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        stop(true);
    }, true);
    return {open, stop};
}
