import {createsession} from "./playtest.js";

/*//////////////////////////////////////////////////////////////////////*/

export function createcontroller({frame, onerror, onclose, ontoolong}) {
    const session = createsession({onerror, onclose});
    let sequence = 0;
    let nonce = null;
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
        frame.classList.remove("active");
        frame.src = "about:blank";
    }

    async function open(game, {xml, base64, nomusic, candy, jolly, background}) {
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
        if (event.origin === location.origin && event.source === frame.contentWindow
            && event.data?.type === "ctrdx-exit" && nonce && event.data.nonce === nonce) {
            onclose();
        }
    });
    window.addEventListener("pagehide", (event) => {
        if (!event.persisted) session.close();
    });

    return {open, close};
}
