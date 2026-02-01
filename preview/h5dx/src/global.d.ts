import type { LevelJson } from "@/types/json";

declare global {
    interface Window {
        __CTR_CUSTOM_LEVEL__?: LevelJson;
    }
}

export {};

















