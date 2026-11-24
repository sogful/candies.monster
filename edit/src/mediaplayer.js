function clock(seconds) {
    const time = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    return Math.floor(time / 60) + ":" + String(time % 60).padStart(2, "0");
}

export function mediaplayer(root) {
    const find = selector => root.querySelector(selector);
    const controls = find(".mediacontrols");
    const play = find(".mediaplay");
    const playicon = play.querySelector("img");
    const loop = find(".medialoop");
    const fullscreen = find(".mediafullscreen");
    const fullscreenicon = fullscreen.querySelector("img");
    const seek = find(".mediaseek");
    const progress = find(".mediaprogress");
    const time = find(".mediatime");
    const error = find(".mediaplayerror");
    let active;

    function message(value = "") {
        error.textContent = value;
        error.hidden = !value;
    }

    function sync() {
        if (!active) return;
        const duration = active.duration;
        const playable = Number.isFinite(duration) && duration > 0;
        const position = playable ? Math.min(1, active.currentTime / duration) : 0;
        seek.disabled = !playable;
        seek.value = String(Math.round(position * 1000));
        progress.style.setProperty("--mediaprogress", 100 * position + "%");
        time.textContent = clock(active.currentTime) + " / " + clock(duration);
        const paused = active.paused || active.ended;
        playicon.src = paused ? "/assets/images/icons/play.svg" : "/assets/images/icons/pause.png";
        playicon.alt = paused ? "Play" : "Pause";
        loop.setAttribute("aria-pressed", String(active.loop));
    }

    for (const item of root.querySelectorAll("audio,video")) {
        for (const name of ["loadedmetadata", "durationchange", "timeupdate", "play", "pause", "ended", "emptied"]) {
            item.addEventListener(name, () => {if (active === item) sync()});
        }
        item.addEventListener("error", () => {
            if (active === item && item.hasAttribute("src")) message("The browser could not play this file.");
        });
    }

    play.addEventListener("click", () => {
        const item = active;
        if (!item) return;
        if (!item.paused) item.pause();
        else {
            message();
            const source = item.src;
            void item.play().catch(error => {
                if (active === item && item.src === source && error.name !== "AbortError") {
                    message("The browser could not play this file.");
                }
            });
        }
    });

    seek.addEventListener("input", () => {
        if (!active || seek.disabled) return;
        active.currentTime = Number(seek.value) * active.duration / 1000;
        sync();
    });

    loop.addEventListener("click", () => {
        if (!active) return;
        active.loop = !active.loop;
        sync();
    });

    fullscreen.addEventListener("click", () => {
        const pending = document.fullscreenElement === root ? document.exitFullscreen() : root.requestFullscreen();
        void pending.catch(() => message("Fullscreen is unavailable."));
    });
    document.addEventListener("fullscreenchange", () => {
        fullscreenicon.alt = document.fullscreenElement === root ? "Exit fullscreen" : "Fullscreen";
    });

    return {
        show(item) {
            active = item;
            controls.hidden = false;
            fullscreen.hidden = item.tagName !== "VIDEO" || !root.requestFullscreen;
            sync();
        },
        clear() {
            active = undefined;
            controls.hidden = true;
            message();
            if (document.fullscreenElement === root) void document.exitFullscreen().catch(() => {});
        }
    };
}
