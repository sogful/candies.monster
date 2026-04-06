import ResourceId from "@/resources/ResourceId";
import QueryStrings from "@/ui/QueryStrings";

function getCandyResourceId(): number | null {
    if (QueryStrings.candy != null) {
        const candyNum = QueryStrings.candy;
        if (candyNum >= 1 && candyNum <= 53) {
            if (candyNum === 1) {
                return ResourceId.IMG_OBJ_CANDY_01;
            } else if (candyNum === 52) {
                return ResourceId.IMG_OBJ_CANDY_52;
            } else if (candyNum === 53) {
                return ResourceId.IMG_OBJ_CANDY_PADDINGTON;
            } else {
                return (ResourceId.IMG_OBJ_CANDY_02 as number) + (candyNum - 2);
            }
        }
    }
    return null;
}

class ResourcePacks {
    // --- Menu sounds ---
    static StandardMenuSounds = [
        ResourceId.SND_BUTTON,
        ResourceId.SND_TAP,
    ];

    // --- Time Travel edition menu sounds ---
    static TimeMenuSounds = [
        ResourceId.SND_BUTTON,
        ResourceId.SND_TAP,
    ];

    // --- Standard game images ---
    static StandardGameImages = (() => {
        const base = [
            ResourceId.IMG_CHAR_ANIMATIONS,
            ResourceId.IMG_CHAR_ANIMATIONS2,
            ResourceId.IMG_CHAR_ANIMATIONS3,
            ResourceId.IMG_CHAR_ANIMATIONS_SLEEPING,
            ResourceId.IMG_CHAR_GREETINGS_XMAS,
            ResourceId.IMG_CHAR_IDLE_XMAS,
            ResourceId.IMG_XMAS_LIGHTS,
            ResourceId.IMG_OBJ_HOOK_01,
            ResourceId.IMG_OBJ_HOOK_02,
            ResourceId.IMG_OBJ_HOOK_AUTO,
            ResourceId.IMG_OBJ_CANDY_01,
            ResourceId.IMG_OBJ_BOUNCER_01,
            ResourceId.IMG_OBJ_BOUNCER_02,
            ResourceId.IMG_OBJ_BUBBLE_ATTACHED,
            ResourceId.IMG_OBJ_BUBBLE_FLIGHT,
            ResourceId.IMG_OBJ_BUBBLE_POP,
            ResourceId.IMG_OBJ_PUMP,
            ResourceId.IMG_OBJ_GAP,
            ResourceId.IMG_OBJ_SPIDER,
            ResourceId.IMG_OBJ_SPIKES_01,
            ResourceId.IMG_OBJ_SPIKES_02,
            ResourceId.IMG_OBJ_SPIKES_03,
            ResourceId.IMG_OBJ_SPIKES_04,
            ResourceId.IMG_OBJ_STAR_IDLE,
            ResourceId.IMG_OBJ_STAR_NIGHT,
            ResourceId.IMG_OBJ_STAR_DISAPPEAR,
            ResourceId.IMG_HUD_STAR,
            ResourceId.IMG_TUTORIAL_SIGNS,
            ResourceId.IMG_DRAWING_HIDDEN,
            ResourceId.IMG_CHAR_SUPPORTS,
            ResourceId.IMG_CHAR_SUPPORTS_XMAS,
            ResourceId.IMG_OBJ_CANDY_PADDINGTON,
            ResourceId.IMG_SNOWFLAKES,
            ResourceId.IMG_CONFETTI_PARTICLES,
            ResourceId.IMG_OBJ_GHOST,
            ResourceId.IMG_OBJ_PIPE,
            ResourceId.IMG_OBJ_LANTERN,
            ResourceId.IMG_OBJ_LIGHTER,
            ResourceId.IMG_OBJ_TRANSPORTER,
        ];
        
        const candyResId = getCandyResourceId();
        if (candyResId != null && !base.includes(candyResId)) {
            base.push(candyResId);
        }
        
        return base;
    })();

    // -- Game resources for Round 5 promo --
    static Round5AdditionalGameImages = [ResourceId.IMG_OBJ_BEE_HD, ResourceId.IMG_OBJ_POLLEN_HD];

    // -- Sound resources for Round 5 promo --
    static Round5AdditionalSounds = [
        ResourceId.SND_BUZZ,
        ResourceId.SND_GRAVITY_OFF,
        ResourceId.SND_GRAVITY_ON,
    ];

    // -- Time Travel edition images --
    static TimeEditionAdditionalGameImages = [
        ResourceId.IMG_OBJ_SOCKS,
        ResourceId.IMG_OBJ_HOOK_MOVABLE,
        ResourceId.IMG_OBJ_ROTATABLE_SPIKES_01,
        ResourceId.IMG_OBJ_ROTATABLE_SPIKES_02,
        ResourceId.IMG_OBJ_ROTATABLE_SPIKES_03,
        ResourceId.IMG_OBJ_ROTATABLE_SPIKES_04,
        ResourceId.IMG_OBJ_ROTATABLE_SPIKES_BUTTON,
    ];

    // -- Time Travel edition sounds --
    static TimeEditionAdditionalSounds = [
        ResourceId.SND_SPIKE_ROTATE_IN,
        ResourceId.SND_SPIKE_ROTATE_OUT,
        ResourceId.SND_TELEPORT,
        ResourceId.SND_CANDY_HIT,
        ResourceId.SND_PREHISTORIC_MONSTER_CHEWING,
        ResourceId.SND_PREHISTORIC_MONSTER_OPEN,
        ResourceId.SND_PREHISTORIC_MONSTER_CLOSE,
        ResourceId.SND_PREHISTORIC_MONSTER_SAD,
    ];

    // -- Full game images --
    static FullGameAdditionalGameImages = [
        ResourceId.IMG_OBJ_HOOK_MOVABLE,
        ResourceId.IMG_OBJ_HOOK_REGULATED,
        ResourceId.IMG_OBJ_ELECTRODES,
        ResourceId.IMG_OBJ_SOCKS,
        ResourceId.IMG_OBJ_ROTATABLE_SPIKES_01,
        ResourceId.IMG_OBJ_ROTATABLE_SPIKES_02,
        ResourceId.IMG_OBJ_ROTATABLE_SPIKES_03,
        ResourceId.IMG_OBJ_ROTATABLE_SPIKES_04,
        ResourceId.IMG_OBJ_ROTATABLE_SPIKES_BUTTON,
        ResourceId.IMG_OBJ_BEE_HD,
        ResourceId.IMG_OBJ_POLLEN_HD,
        ResourceId.IMG_OBJ_VINIL,
        ResourceId.IMG_OBJ_SOCKS_XMAS,
        ResourceId.IMG_CHAR_ANIMATION_PADDINGTON,
    ];

    // --- Game images for Chrome extension ---
    static ChromeLiteAdditionalGameImages = [
        ResourceId.IMG_OBJ_SOCKS,
        ResourceId.IMG_OBJ_HOOK_MOVABLE,
        ResourceId.IMG_OBJ_ELECTRODES,
    ];

    // --- Game sounds for Chrome extension ---
    static ChromeLiteAdditionalGameSounds = [ResourceId.SND_TELEPORT, ResourceId.SND_ELECTRIC];

    // --- Fonts ---
    static StandardFonts = [
        ResourceId.FNT_SMALL_FONT,
        ResourceId.FNT_BIG_FONT,
        ResourceId.FNT_FONT_NUMBERS_BIG,
    ];

    // --- Game sounds ---
    static StandardGameSounds = [
        ResourceId.SND_GAME_MUSIC,
        ResourceId.SND_GAME_MUSIC_XMAS,
        ResourceId.SND_BOUNCER,
        ResourceId.SND_BUBBLE,
        ResourceId.SND_BUBBLE_BREAK,
        ResourceId.SND_CANDY_BREAK,
        ResourceId.SND_CANDY_LINK,
        ResourceId.SND_MONSTER_CHEWING,
        ResourceId.SND_MONSTER_CLOSE,
        ResourceId.SND_MONSTER_OPEN,
        ResourceId.SND_MONSTER_SAD,
        ResourceId.SND_MONSTER_SLEEP_1,
        ResourceId.SND_MONSTER_SLEEP_2,
        ResourceId.SND_MONSTER_SLEEP_3,
        ResourceId.SND_PUMP_1,
        ResourceId.SND_PUMP_2,
        ResourceId.SND_PUMP_3,
        ResourceId.SND_PUMP_4,
        ResourceId.SND_ROPE_BLEAK_1,
        ResourceId.SND_ROPE_BLEAK_2,
        ResourceId.SND_ROPE_BLEAK_3,
        ResourceId.SND_ROPE_BLEAK_4,
        ResourceId.SND_ROPE_GET,
        ResourceId.SND_SPIDER_ACTIVATE,
        ResourceId.SND_SPIDER_FALL,
        ResourceId.SND_SPIDER_WIN,
        ResourceId.SND_STAR_1,
        ResourceId.SND_STAR_2,
        ResourceId.SND_STAR_3,
        ResourceId.SND_STAR_LIGHT_1,
        ResourceId.SND_STAR_LIGHT_2,
        ResourceId.SND_WIN,
        ResourceId.SND_GHOST_PUFF,
        ResourceId.SND_STEAM_START,
        ResourceId.SND_STEAM_START2,
        ResourceId.SND_STEAM_END,
        ResourceId.SND_LANTERN_TELEPORT_IN,
        ResourceId.SND_LANTERN_TELEPORT_OUT,
        ResourceId.SND_MOUSE_RUSTLE,
        ResourceId.SND_MOUSE_TAP,
        ResourceId.SND_MOUSE_IDLE,
        ResourceId.SND_TRANSPORTER_MOVE,
        ResourceId.SND_TRANSPORTER_DROP,
        ResourceId.SND_CONV01,
        ResourceId.SND_CONV02,
        ResourceId.SND_CONV03,
        ResourceId.SND_CONV04,
    ];

    // -- Sound resources for full version --
    static FullGameAdditionalSounds = [
        ResourceId.SND_ELECTRIC,
        ResourceId.SND_GRAVITY_OFF,
        ResourceId.SND_GRAVITY_ON,
        ResourceId.SND_RING,
        ResourceId.SND_WHEEL,
        ResourceId.SND_SPIKE_ROTATE_IN,
        ResourceId.SND_SPIKE_ROTATE_OUT,
        ResourceId.SND_SCRATCH_IN,
        ResourceId.SND_SCRATCH_OUT,
        ResourceId.SND_BUZZ,
        ResourceId.SND_TELEPORT,
        ResourceId.SND_XMAS_BELL,
        ResourceId.SND_TELEPORT_XMAS,
    ];

    // --- Game UI ---
    static StandardMenuImageFilenames = [
        "bBtn_bgd.png",
        "boxcutter.png",
        "buttonsprite.png",
        "fb.png",
        "fBtn_bgd.png",
        "flags.png",
        "lBtn_bgd.png",
        "leveltape_left.png",
        "leveltape_right.png",
        "mBtn_bgd.png",
        "options_stars_bgd.png",
        "options_stars_bgd_small.png",
        "sBtn_bgd.png",
        "shadow.png",
        "taperoll.png",
    ];

    // -- Hidden drawings --
    static DrawingMenuImageFilenames = ["drawing-bg.png"];

    // -- Web edition images --
    static NetDesignResolutionImageNames = [
        "android.png",
        "box.png",
        "comic.png",
        "facebook.png",
        "footer_dot.png",
        "footer_finger.png",
        "full_version_bg.png",
        "full_version_text.png",
        "game_bg.png",
        "ipad.png",
        "iphone.png",
        "more_close.png",
        "more_text.png",
        "more_wallpaper.png",
        "more_window_bg.png",
        "more.png",
        "papercraft.png",
        "privacy.png",
        "shop_over.png",
        "shop.png",
        "terms.png",
        "twitter.png",
        "video_bg.png",
        "youtube.png",
        "zepto.png",
        "zeptologo.png",
    ];
}

export default ResourcePacks;
