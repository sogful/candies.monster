import edition from "@/config/editions/net-edition";
import JsonLoader from "@/resources/JsonLoader";
import type { LevelJson } from "@/types/json";

const CUSTOM_LEVEL_CACHE_KEY = "level-01-01";

const getCustomLevel = (): LevelJson | null => {
    if (typeof window !== "undefined" && window.__CTR_CUSTOM_LEVEL__) {
        return window.__CTR_CUSTOM_LEVEL__;
    }
    return null;
};

class LevelState {
    static loadedMap: LevelJson | null = null;

    static pack = 0;

    static level = 0;

    static survival = false;

    static loadLevel(pack: number, level: number) {
        LevelState.pack = pack - 1;
        LevelState.level = level - 1;

        // Check for custom level first
        const customLevel = getCustomLevel();
        if (customLevel) {
            // For custom levels, load directly from cache or window
            const cachedLevel = JsonLoader.getJson(CUSTOM_LEVEL_CACHE_KEY) as LevelJson | undefined;
            LevelState.loadedMap = cachedLevel || customLevel;
            return;
        }

        // Fall back to normal box/level loading
        const box = edition.boxes[LevelState.pack];
        if (!box) {
            throw new Error(`Box not found for pack index ${LevelState.pack}`);
        }
        LevelState.loadedMap = box.levels[LevelState.level] ?? null;
    }
}

export default LevelState;
