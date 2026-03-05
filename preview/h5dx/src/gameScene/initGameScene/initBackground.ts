import BackgroundTileMap from "@/visual/BackgroundTileMap";
import TileMap from "@/visual/TileMap";
import LevelState from "@/game/LevelState";
import ResourceMgr from "@/resources/ResourceMgr";
import Log from "@/utils/Log";
import edition from "@/config/editions/net-edition";
import * as GameSceneConstants from "@/gameScene/constants";
import ResourceId from "@/resources/ResourceId";
import { getIsXmas } from "@/utils/SpecialEvents";
import QueryStrings from "@/ui/QueryStrings";
import type GameSceneInit from "../init";

let currentPack = -1;

export function initBackground(this: GameSceneInit): boolean {
    const resolveBackgroundId = (): number | null => {
        const override = QueryStrings.background;
        if (override != null) {
            switch (override) {
                case 1: return ResourceId.IMG_BGR_01_P1;
                case 2: return ResourceId.IMG_BGR_02_P1;
                case 3: return ResourceId.IMG_BGR_03_P1;
                case 4: return ResourceId.IMG_BGR_04_P1;
                case 5: return ResourceId.IMG_BGR_05_P1;
                case 6: return ResourceId.IMG_BGR_06_P1;
                case 7: return ResourceId.IMG_BGR_07_P1;
                case 8: return ResourceId.IMG_BGR_08_P1;
                case 9: return ResourceId.IMG_BGR_09_P1;
                case 10: return ResourceId.IMG_BGR_10_P1;
                case 11: return ResourceId.IMG_BGR_11_P1;
                case 16: return ResourceId.IMG_BGR_XMAS;
                default:
                    break;
            }
        }

        const baseId = edition.levelBackgroundIds[LevelState.pack] ?? null;
        if (getIsXmas()) {
            return ResourceId.IMG_BGR_XMAS;
        }
        return baseId;
    };

    const overlayId = edition.levelOverlayIds[LevelState.pack];
    const bgrID = resolveBackgroundId();

    if (bgrID == null) {
        return false;
    }

    const applyBackgroundToCanvas = (): boolean => {
        const canvasBackground = document.getElementById("c");
        const image = this.bgTexture?.image;
        const imageSrc = this.bgTexture?.imageSrc;
        const backgroundSource =
            typeof imageSrc === "string"
                ? imageSrc
                : image instanceof HTMLImageElement
                  ? image.src
                  : "";

        if (!canvasBackground) {
            return false;
        }
        canvasBackground.style.background = backgroundSource ? `url('${backgroundSource}')` : "";
        canvasBackground.style.display = "block";
        return true;
    };

    if (currentPack != LevelState.pack) {
        this.bgTexture = ResourceMgr.getTexture(bgrID) ?? null;
        if (!applyBackgroundToCanvas()) {
            return false;
        }
        currentPack = LevelState.pack;
    } else {
        this.bgTexture = ResourceMgr.getTexture(bgrID) ?? null;
        if (!applyBackgroundToCanvas()) {
            return false;
        }
    }

    this.overlayTexture = overlayId ? (ResourceMgr.getTexture(overlayId) ?? null) : this.bgTexture;

    this.back = new BackgroundTileMap(1, 1);
    this.back.setRepeatHorizontally(TileMap.RepeatType.NONE);
    this.back.setRepeatVertically(TileMap.RepeatType.ALL);
    const bgTexture = this.bgTexture;
    if (!bgTexture) {
        Log.alert(`Background texture ${bgrID} failed to load`);
        return false;
    }
    this.back.addTile(bgTexture, GameSceneConstants.IMG_BGR_01_bgr);
    this.back.fill(0, 0, 1, 1, 0);

    return true;
}
