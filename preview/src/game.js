import {createsession} from "./playtest.js";

/*//////////////////////////////////////////////////////////////////////*/

export function createcontroller({frame, onerror, onclose, ontoolong, onprogress = () => {}, onready = () => {}, onaction = () => {}}) {
    const session = createsession({onerror, onclose});
    let sequence = 0;
    let nonce = null;
    let runtime = false;
    let level = false;
    let ready = false;
    let editor = false;
    const keys = new Set(["KeyQ", "Escape", "KeyP", "KeyM", "KeyR", "Space", "Enter", "ArrowLeft", "ArrowRight"]);
    const held = new Set();

    function forward(event, down) {
        if (!nonce || !frame.classList.contains("active") || !keys.has(event.code)
            || event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
        const target = event.target;
        if (target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName)) return;
        if (typeof frame.contentWindow.ctrdxPreviewKey !== "function") return;
        event.preventDefault();
        if (down) held.add(event.code);
        else held.delete(event.code);
        frame.contentWindow.ctrdxPreviewKey(event.code, down);
    }

    function release() {
        for (const code of held) frame.contentWindow.ctrdxPreviewKey?.(code, false);
        held.clear();
    }

    window.addEventListener("keydown", (event) => forward(event, true));
    window.addEventListener("keyup", (event) => forward(event, false));
    window.addEventListener("blur", release);

    function close() {
        release();
        sequence++;
        session.close();
        nonce = null;
        runtime = level = ready = false;
        editor = false;
        frame.classList.remove("active");
        frame.src = "about:blank";
    }

    async function open(game, {xml, base64, nomusic, candy, jolly, background, view}) {
        close();
        const current = sequence;
        const sources = {
            dx: "/preview/dx/dist/wwwroot/index.html",
            h5dx: "/preview/h5dx/dist/index.html",
            famobi: "/preview/famobi/index.html",
        };
        if (!sources[game]) throw new Error("Unknown preview version.");
        const url = new URL(sources[game], location.origin);
        if (game === "dx") {
            nonce = session.start(xml);
            url.searchParams.set("playtest", nonce);
        } else {
            url.searchParams.set("data", base64);
        }
        if (nomusic) url.searchParams.set("nomusic", "");
        if (candy) url.searchParams.set("candy", candy);
        if (jolly) url.searchParams.set("jolly", "");
        if (background != null) url.searchParams.set("background", String(background));
        editor = view === "editor";
        if (["level", "editor"].includes(view)) url.searchParams.set("view", view);
        url.searchParams.set("_", Date.now().toString());
        if (game !== "dx" && new TextEncoder().encode(url.href).length > 16384) {
            ontoolong();
            return;
        }
        if (game !== "dx") {
            try {
                const response = await fetch(url, {cache: "no-store", credentials: "same-origin"});
                if (current !== sequence) return;
                if (response.status === 414 || response.status === 431) {
                    ontoolong();
                    return;
                }
            } catch {}
        }
        if (current !== sequence) return;
        frame.src = url.href;
        frame.classList.add("active");
    }

    window.addEventListener("message", (event) => {
        if (event.origin !== location.origin || event.source !== frame.contentWindow
            || !nonce || event.data?.nonce !== nonce) return;
        const data = event.data;
        if (data.type === "ctrdx-exit") onclose();
        else if (data.type === "ctrdx-editor-action" && editor && ["version", "edit"].includes(data.action)) onaction(data.action);
        else if (data.type === "ctrdx-error") onerror("Game could not load.");
        else if (data.type === "ctrdx-progress" && Number.isFinite(data.percent)) {
            onprogress({percent: Math.max(0, Math.min(99, data.percent)), stage: String(data.stage || ""), loaded: data.loaded, total: data.total});
        } else if (data.type === "ctrdx-runtime-ready") runtime = true;
        else if (data.type === "ctrdx-level-ready") level = true;
        if (runtime && level && !ready) {
            ready = true;
            onready();
        }
    });
    window.addEventListener("pagehide", (event) => {
        if (!event.persisted) session.close();
    });

    return {open, close};
}
