import platform from "@/config/platforms/platform-web";
import BoxManager from "@/ui/BoxManager";
import ScoreManager from "@/ui/ScoreManager";
import Dialogs from "@/ui/Dialogs";
import VideoManager from "@/ui/VideoManager";
import RootController from "@/game/CTRRootController";
import panelManager from "@/ui/PanelManager";
import PanelId from "@/ui/PanelId";

import type { LevelWonInfo } from "@/ui/InterfaceManager/gameFlow";

interface ResultsManager {
    isInLevelSelectMode: boolean;
    gameFlow: {
        _openLevel: (level: number, isRestart?: boolean, isSkip?: boolean) => void;
    };
    _MIN_FPS: number;
}

/**
 * Base class for handling level results
 */
export default class ResultsHandler {
    private manager: ResultsManager;

    constructor(manager: ResultsManager) {
        this.manager = manager;
    }

    /**
     * Handles level won event
     * @param info - Level completion info
     */
    onLevelWon(info: LevelWonInfo): void {
        const stars = info.stars;
        const score = info.score;

        // TODO: right now boxIndex is zero based and levelIndex starts at 1?
        const boxIndex = BoxManager.currentBoxIndex;
        const levelIndex = BoxManager.currentLevelIndex;

        // Update score of the current level if there is a best result
        ScoreManager.setScore(boxIndex, levelIndex - 1, score, false);
        ScoreManager.setStars(boxIndex, levelIndex - 1, stars, false);

        // unlock next level
        const levelCount = ScoreManager.levelCount(boxIndex);
        if (levelCount != null && levelCount > levelIndex && BoxManager.isNextLevelPlayable()) {
            ScoreManager.setStars(boxIndex, levelIndex, 0, false);
        }

        this.manager.isInLevelSelectMode = false;
        
        // Level restart is now handled by GameController.onLevelWon()
        // No need to show level complete screen or handle restart here

        // events that occur after completing the first level
        if (boxIndex === 0 && levelIndex === 1) {
            /*if (analytics.onFirstLevelComplete) {
                analytics.onFirstLevelComplete(info.fps);
            }*/

            // tell the user if the fps was low on the first level
            if (
                info.fps != null &&
                info.fps < this.manager._MIN_FPS &&
                !platform.disableSlowWarning
            ) {
                setTimeout(() => {
                    Dialogs.showSlowComputerPopup();
                }, 3000);
            }
            VideoManager.removeIntroVideo();
        }
    }
}
