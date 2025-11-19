import TextImage from "@/visual/TextImage";
import Alignment from "@/core/Alignment";
import Timeline from "@/visual/Timeline";
import KeyFrame from "@/visual/KeyFrame";
import RGBAColor from "@/core/RGBAColor";
import ResourceId from "@/resources/ResourceId";
import LevelState from "@/game/LevelState";
import Lang from "@/resources/Lang";
import MenuStringId from "@/resources/MenuStringId";
import resolution from "@/resolution";
import type GameSceneInit from "../init";

export function initLevelLabel(this: GameSceneInit): void {
    // Don't show level label for custom levels
    // Level label disabled for preview version
    if (this.clickToCut) {
        this.resetBungeeHighlight();
    }
}
