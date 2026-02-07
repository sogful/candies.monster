import edition from "@/config/editions/net-edition";
import ResourceId from "@/resources/ResourceId";
import SnowfallOverlay from "@/ui/SnowfallOverlay";
import { getIsXmas } from "@/utils/SpecialEvents";

const customMenuMusic = edition.menuMusicId;
const resolvedMenuMusicId =
    typeof customMenuMusic === "number"
        ? customMenuMusic
        : typeof customMenuMusic === "string"
          ? ResourceId[customMenuMusic as keyof typeof ResourceId]
          : undefined;

export const getMenuMusicId = () => {
    const isXmas = getIsXmas();
    return (
        resolvedMenuMusicId ?? (isXmas ? ResourceId.SND_GAME_MUSIC_XMAS : ResourceId.SND_GAME_MUSIC)
    );
};

export const MENU_MUSIC_ID = getMenuMusicId();

export const IS_MSIE_BROWSER = /MSIE|Trident/.test(window.navigator.userAgent);

export const startSnow = () => {
    SnowfallOverlay.start();
};

export const stopSnow = () => {
    SnowfallOverlay.stop();
};

// Helper function to get the default box index based on holiday period
// During Christmas season (Dec/Jan), default to Holiday Gift Box (index 0)
// Otherwise, default to Cardboard Box (index 1)
export const getDefaultBoxIndex = () => {
    return getIsXmas() ? 0 : 1;
};
