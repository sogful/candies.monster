import edition from "@/config/editions/net-edition";
import resolution from "@/resolution";
import platform from "@/config/platforms/platform-web";
import ScoreManager from "@/ui/ScoreManager";
import BoxManager from "@/ui/BoxManager";
import PanelId from "@/ui/PanelId";
import panelManager from "@/ui/PanelManager";
import Text from "@/visual/Text";
import PointerCapture from "@/utils/PointerCapture";
import settings from "@/game/CTRSettings";
import SoundMgr from "@/game/CTRSoundMgr";
import ResourceId from "@/resources/ResourceId";
import RootController from "@/game/CTRRootController";
import VideoManager from "@/ui/VideoManager";
import PubSub from "@/utils/PubSub";
import Lang from "@/resources/Lang";
import LangId from "@/resources/LangId";
import MenuStringId from "@/resources/MenuStringId";
import Alignment from "@/core/Alignment";
import GameBorder from "@/ui/GameBorder";
import Doors from "@/Doors";
import Dialogs from "@/ui/Dialogs";
import { getDefaultBoxIndex, startSnow, stopSnow } from "@/ui/InterfaceManager/constants";
import { getIsXmas, setXmasOverride } from "@/utils/SpecialEvents";
import {
    addClass,
    append,
    empty,
    fadeOut,
    hide,
    hover,
    on,
    removeClass,
    stopAnimations,
} from "@/utils/domHelpers";
import type { PanelIdType, PanelWithLifecycle } from "@/ui/types/panelTypes";
import skinSelectionView from "@/ui/InterfaceManager/skinSelection";

interface GameFlowForPanelInit {
    noMenuStartLevel: (boxIndex: number, levelIndex: number) => void;
    _openLevel: (levelIndex: number, restart?: boolean, skipLocked?: boolean) => void;
    _openLevelMenu: () => void;
    _closeLevelMenu: () => void;
    _closeLevel: () => void;
    _notifyBeginTransition: (duration: number, reason: string) => void;
    _completeBox: () => void;
    closeBox: () => void;
    tapeBox: () => void;
}

interface PanelInitializerManager {
    gameFlow: GameFlowForPanelInit;
    useHDVersion: boolean;
    isInLevelSelectMode: boolean;
    isInMenuSelectMode: boolean;
    isTransitionActive: boolean;
    _signedIn: boolean;
    _updateSignInControls: () => void;
    _updateMiniSoundButton: (doToggle: boolean, buttonId: string, msgId: string) => void;
    _showMiniOptionMessage: (msgId: string, messageText: string, delayDuration: number) => void;
    _setImageBigText: (selector: string, menuStringId: number) => void;
    optionsReturnPanelId: PanelIdType;
    shouldReopenLevelMenuAfterOptions: boolean;
}

/**
 * Base class for panel initialization
 */
export default class PanelInitializer {
    private readonly manager: PanelInitializerManager;

    constructor(manager: PanelInitializerManager) {
        this.manager = manager;
    }

    /**
     * Initializes a panel
     * @param panelId - The ID of the panel to initialize
     */
    onInitializePanel(panelId: PanelIdType): void {
        const manager = this.manager;
        const { gameFlow } = manager;
        const panel = panelManager.getPanelById(panelId) as PanelWithLifecycle | null;
        const soundBtn = document.getElementById("soundBtn");
        const musicBtn = document.getElementById("musicBtn");
                const xmasToggleBtn = document.getElementById("xmasToggleBtn");
        const backBtn = document.getElementById("optionsBack");
        const optionsTitle = document.getElementById("optionsTitle");
        const optionMsg = document.getElementById("optionMsg");
        const langElement = document.getElementById("lang");
        const menuCandySkin = document.getElementById("menuCandySkin");

        switch (panelId) {
            case PanelId.MENU: {
                skinSelectionView.updateMenuCandySkin();

                if (menuCandySkin) {
                    menuCandySkin.classList.add("ctrPointer");
                    menuCandySkin.addEventListener("click", () => {
                        SoundMgr.playSound(ResourceId.SND_TAP);
                        skinSelectionView.markCandyAsChanged();
                        panelManager.showPanel(PanelId.SKIN_SELECT);
                    });
                }

                // initialize the MENU panel
                on("#playBtn", "click", () => {
                    SoundMgr.playSound(ResourceId.SND_TAP);

                    /*if (analytics.onPlayClicked) {
                        analytics.onPlayClicked();
                    }*/

                    VideoManager.playIntroVideo(() => {
                        const firstLevelStars = ScoreManager.getStars(getDefaultBoxIndex(), 0) || 0;
                        if (firstLevelStars === 0) {
                            // start the first level immediately for the default box
                            gameFlow.noMenuStartLevel(getDefaultBoxIndex(), 0);
                        } else {
                            const nextPanelId = edition.disableBoxMenu
                                ? PanelId.LEVELS
                                : PanelId.BOXES;
                            panelManager.showPanel(nextPanelId, true);
                        }
                    });
                });

                on("#optionsBtn", "click", () => {
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    manager.optionsReturnPanelId = PanelId.MENU;
                    manager.shouldReopenLevelMenuAfterOptions = false;
                    // see if there is a custom settings panel we should trigger
                    if (platform.customOptions) {
                        PubSub.publish(PubSub.ChannelId.ShowOptions);
                    } else {
                        panelManager.showPanel(PanelId.OPTIONS);
                    }
                });

                on("#achievementsBtn", "click", () => {
                    if (!manager._signedIn) {
                        return;
                    }
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    panelManager.showPanel(PanelId.ACHIEVEMENTS);
                });
                manager._updateSignInControls();

                on("#leaderboardsBtn", "click", () => {
                    if (!manager._signedIn) {
                        return;
                    }
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    panelManager.showPanel(PanelId.LEADERBOARDS);
                });
                manager._updateSignInControls();

                // mini options panel
                manager._updateMiniSoundButton(false, "optionSound", "");
                on("#optionSound", "click", () => {
                    manager._updateMiniSoundButton(true, "optionSound", "optionMsg");
                });

                let hdtoggle: "optionSd" | "optionHd";
                if (manager.useHDVersion) {
                    addClass("#optionHd", "activeResolution");
                    addClass("#optionSd", "inActiveResolution");
                    addClass("#optionSd", "ctrPointer");
                    hover(
                        "#optionSd",
                        () => {
                            manager._showMiniOptionMessage(
                                "optionMsg",
                                Lang.menuText(MenuStringId.RELOAD_SD),
                                4000
                            );
                        },
                        () => {
                            if (optionMsg) {
                                stopAnimations(optionMsg);
                                fadeOut(optionMsg, 500);
                            }
                        }
                    );
                    hdtoggle = "optionSd";
                } else {
                    addClass("#optionSd", "activeResolution");
                    addClass("#optionHd", "inActiveResolution");
                    addClass("#optionHd", "ctrPointer");
                    hover(
                        "#optionHd",
                        () => {
                            manager._showMiniOptionMessage(
                                "optionMsg",
                                Lang.menuText(MenuStringId.RELOAD_HD),
                                4000
                            );
                        },
                        () => {
                            if (optionMsg) {
                                stopAnimations(optionMsg);
                                fadeOut(optionMsg, 500);
                            }
                        }
                    );
                    hdtoggle = "optionHd";
                }

                on(`#${hdtoggle}`, "click", () => {
                    settings.setIsHD(!manager.useHDVersion);
                    window.location.reload();
                });

                // handle language changes
                PubSub.subscribe(PubSub.ChannelId.LanguageChanged, () => {
                    manager._setImageBigText("#playBtn img", MenuStringId.PLAY);
                    manager._setImageBigText("#optionsBtn img", MenuStringId.OPTIONS);

                    Text.drawBig({
                        text: Lang.menuText(MenuStringId.LEADERBOARDS),
                        imgParentId: "leaderboardsBtn",
                        scale: 0.8 * resolution.UI_TEXT_SCALE,
                    });

                    Text.drawBig({
                        text: Lang.menuText(MenuStringId.ACHIEVEMENTS),
                        imgParentId: "achievementsBtn",
                        scale: 0.8 * resolution.UI_TEXT_SCALE,
                    });
                });

                break;
            }

            case PanelId.BOXES: {
                // initialize the BOXES panel
                // handles clicking on the circular back button
                on("#boxBack", "click", () => {
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    panelManager.showPanel(PanelId.MENU);
                });

                panel?.init?.(manager);

                break;
            }

            case PanelId.PASSWORD: {
                on("#boxEnterCodeButton", "click", () => {
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    panelManager.showPanel(PanelId.PASSWORD);
                });

                on("#codeBack", "click", () => {
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    panelManager.showPanel(PanelId.BOXES);
                });

                panel?.init?.(manager);

                break;
            }

            case PanelId.LEVELS: {
                // initialize the LEVELS panel
                on("#levelBack", "click", () => {
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    const targetPanelId = edition.disableBoxMenu ? PanelId.MENU : PanelId.BOXES;
                    panelManager.showPanel(targetPanelId);
                });

                // render the canvas all the way closed
                Doors.renderDoors(true, 0.0);
                panel?.init?.(manager);

                break;
            }

            case PanelId.GAME: {
                on("#gameRestartBtn", "click", () => {
                    if (manager.isTransitionActive) return;
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    gameFlow._openLevel(BoxManager.currentLevelIndex, true);
                });

                on("#gameMenuBtn", "click", () => {
                    if (manager.isTransitionActive) return;
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    gameFlow._openLevelMenu();
                });

                break;
            }

            case PanelId.GAMEMENU: {
                on("#continueBtn", "click", () => {
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    gameFlow._closeLevelMenu();
                    RootController.resumeLevel();
                });

                on("#settingsBtn", "click", () => {
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    manager.optionsReturnPanelId = PanelId.GAMEMENU;
                    manager.shouldReopenLevelMenuAfterOptions = true;
                    panelManager.showPanel(PanelId.OPTIONS);
                });

                // mini options panel
                manager._updateMiniSoundButton(false, "gameSound", "");

                on("#gameSound", "click", () => {
                    manager._updateMiniSoundButton(true, "gameSound", "gameMsg");
                });

                // language changes
                PubSub.subscribe(PubSub.ChannelId.LanguageChanged, () => {
                    manager._setImageBigText("#continueBtn img", MenuStringId.CONTINUE);
                    manager._setImageBigText("#settingsBtn img", MenuStringId.SETTINGS);
                });

                break;
            }

            case PanelId.LEVELCOMPLETE: {
                on("#nextBtn", "click", () => {
                    if (manager.isTransitionActive) return;
                    gameFlow._notifyBeginTransition(1000, "next level");
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    if (BoxManager.isNextLevelPlayable()) {
                        gameFlow._openLevel(BoxManager.currentLevelIndex + 1);
                    } else {
                        gameFlow._completeBox();
                    }
                });

                on("#replayBtn", "click", () => {
                    if (manager.isTransitionActive) return;
                    gameFlow._notifyBeginTransition(1000, "replay");
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    gameFlow._openLevel(BoxManager.currentLevelIndex);
                });

                on("#lrMenuBtn", "click", () => {
                    if (manager.isTransitionActive) return;
                    gameFlow._notifyBeginTransition(1000, "level menu");
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    manager.isInLevelSelectMode = true;
                    manager.isInMenuSelectMode = false;
                    gameFlow.tapeBox();
                });

                PubSub.subscribe(PubSub.ChannelId.LanguageChanged, () => {
                    manager._setImageBigText("#nextBtn img", MenuStringId.NEXT);
                    manager._setImageBigText("#replayBtn img", MenuStringId.REPLAY);
                    manager._setImageBigText("#lrMenuBtn img", MenuStringId.MENU);
                    Text.drawSmall({
                        text: Lang.menuText(MenuStringId.FINAL_SCORE),
                        imgId: "resultTickerMessage",
                        scaleToUI: true,
                        canvas: true,
                    });
                });

                break;
            }

            case PanelId.GAMECOMPLETE: {
                on("#gameCompleteBack", "click", () => {
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    panelManager.showPanel(PanelId.MENU);
                    GameBorder.hide();
                });

                /*on("#finalShareBtn", "click", () => {
                    const possibleStars = BoxManager.possibleStars();
                    const totalStars = ScoreManager.totalStars();
                    SocialHelper.postToFeed(
                        platform.getGameCompleteShareText(totalStars, possibleStars),
                        SocialHelper.siteDescription,
                        `${platform.getScoreImageBaseUrl()}score${totalStars}.png`,
                        () => true
                    );
                });*/

                break;
            }

            case PanelId.OPTIONS: {
                // hide it to save space
                if (optionsTitle) {
                    optionsTitle.style.display = "none";
                }
                
                // sound effects
                const updateSoundOption = platform.updateSoundOption;

                const onSoundButtonChange = () => {
                    const isSoundOn = !settings.getSoundEnabled();
                    SoundMgr.setSoundEnabled(isSoundOn);
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    updateSoundOption(soundBtn, isSoundOn);
                    manager._updateMiniSoundButton(false, "gameSound", "");
                    manager._updateMiniSoundButton(false, "optionSound", "");
                };
                platform.setSoundButtonChange(soundBtn, onSoundButtonChange);

                // game music
                const updateMusicOption = platform.updateMusicOption;

                const onMusicButtonChange = () => {
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    const isMusicOn = !settings.getMusicEnabled();
                    SoundMgr.setMusicEnabled(isMusicOn);
                    updateMusicOption(musicBtn, isMusicOn);
                    manager._updateMiniSoundButton(false, "gameSound", "");
                    manager._updateMiniSoundButton(false, "optionSound", "");
                };
                platform.setMusicButtonChange(musicBtn, onMusicButtonChange);

                // change language
                const updateLangOption = platform.updateLangSetting;
                platform.setLangOptionClick((langParam: number | null) => {
                    SoundMgr.playSound(ResourceId.SND_TAP);

                    // if not specified we'll assume that we should advance to
                    // the next language (so we cycle through as user clicks)
                    let newLangId: number;
                    if (langParam == null) {
                        const languages = edition.languages;
                        if (languages.length === 0) {
                            return;
                        }
                        const currentIndex = languages.indexOf(settings.getLangId());
                        const nextIndex = (currentIndex + 1) % languages.length;
                        const resolvedIndex = nextIndex < 0 ? 0 : nextIndex;
                        const fallbackLang = languages[resolvedIndex] ?? languages[0];
                        if (fallbackLang == null) {
                            return;
                        }
                        newLangId = fallbackLang;
                    } else {
                        newLangId = langParam;
                    }
                    settings.setLangId(newLangId);

                    // send the notification that language has changed
                    PubSub.publish(PubSub.ChannelId.LanguageChanged);
                });

                // click or drag to cut
                const updateCutOption = platform.updateCutSetting;
                platform.setCutOptionClick(() => {
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    const isClickToCut = !settings.getClickToCut();
                    settings.setClickToCut(isClickToCut);
                    updateCutOption(isClickToCut);
                });

                const updateXmasButtonText = () => {
                    if (!xmasToggleBtn) return;
                    const isXmas = getIsXmas();
                    const textId = isXmas ? MenuStringId.XMAS_MODE_ON : MenuStringId.XMAS_MODE_OFF;
                    manager._setImageBigText("#xmasToggleBtn img", textId);
                };

                xmasToggleBtn?.addEventListener("click", () => {
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    const currentState = getIsXmas();
                    setXmasOverride(!currentState);
                    updateXmasButtonText();
                    
                    const newState = getIsXmas();
                    if (newState) {
                        startSnow();
                        document.body.classList.add("is-xmas");
                    } else {
                        stopSnow();
                        document.body.classList.remove("is-xmas");
                    }
                    PubSub.publish(PubSub.ChannelId.XmasChanged, newState);
                });

                updateXmasButtonText();

                backBtn?.addEventListener("click", () => {
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    const returnPanelId = manager.optionsReturnPanelId ?? PanelId.MENU;
                    panelManager.showPanel(returnPanelId);
                    if (
                        manager.shouldReopenLevelMenuAfterOptions &&
                        returnPanelId === PanelId.GAMEMENU
                    ) {
                        requestAnimationFrame(() => {
                            gameFlow._openLevelMenu();
                        });
                    }
                    manager.optionsReturnPanelId = PanelId.MENU;
                    manager.shouldReopenLevelMenuAfterOptions = false;
                });

                // hide the language if not supported by the edition
                platform.toggleLangUI(!edition.disableLanguageOption);

                // update options menu when the language changes
                const refreshOptionsButtons = () => {
                    updateSoundOption(soundBtn, settings.getSoundEnabled());
                    updateMusicOption(musicBtn, settings.getMusicEnabled());
                    updateLangOption();
                    updateCutOption(settings.getClickToCut());

                    // apply a lang-{code} class to a language layer for css styles
                    const langId = settings.getLangId();

                    if (langElement) {
                        removeClass(
                            langElement,
                            "lang-system lang-en lang-de lang-ru lang-fr lang-ca lang-br lang-es lang-it lang-nl lang-ko lang-ja lang-zh"
                        );
                        addClass(langElement, `lang-${LangId.toCountryCode(langId)}`);
                        if (langId >= 4 && langId <= 9) {
                            addClass(langElement, "lang-system");
                        }
                    }
                };

                PubSub.subscribe(PubSub.ChannelId.LanguageChanged, refreshOptionsButtons);
                PubSub.subscribe(PubSub.ChannelId.ShowOptionsPage, refreshOptionsButtons);

                break;
            }

            case PanelId.SKIN_SELECT: {
                skinSelectionView.init();
                break;
            }

            case PanelId.LEADERBOARDS: {
                on("#leaderboardBack", "click", () => {
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    panelManager.showPanel(PanelId.MENU);
                });

                break;
            }

            case PanelId.ACHIEVEMENTS: {
                on("#achievementsBack", "click", () => {
                    SoundMgr.playSound(ResourceId.SND_TAP);
                    panelManager.showPanel(PanelId.MENU);
                });

                break;
            }
        }
    }
}
