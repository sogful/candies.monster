import App from "@/app";
import platform from "@/config/platforms/platform-web";
import "@/game/CTRRootController";
import SoundMgr from "@/game/CTRSoundMgr";
import CTRSettings from "@/game/CTRSettings";
import QueryStrings from "@/ui/QueryStrings";

const hasCustomLevel = typeof window !== "undefined" && Boolean(window.__CTR_CUSTOM_LEVEL__);

if (hasCustomLevel) {
    CTRSettings.showMenu = false;
    // Use box 1 for custom levels (box 0 has unique theming that doesn't work with custom levels)
    QueryStrings.box = 1;
    QueryStrings.level = 1;
}

if (QueryStrings.disableMusic) {
    SoundMgr.setForceMusicOff(true);
}

window.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    event.stopPropagation();
});

const boot = (): void => {
    if (!platform.meetsRequirements()) {
        return;
    }

    App.domReady();
    App.run();
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
    boot();
}
