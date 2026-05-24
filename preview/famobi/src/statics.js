  // --------------------------------------------------------------------
  // statics.js — runtime bootstrap. Runs ONCE, after every class has been
  // declared (see manifest.json — this file is the last part inside the
  // IIFE). Three things happen here:
  //
  //   1. Host detection + tiny interop shims (performance.now, etc.).
  //   2. Initial values for every class-level field the game expects to
  //      exist before any constructor runs (TYPE tags, lookup tables,
  //      default save state, ...).
  //   3. Asset manifests + the named-id constants that scenes reference
  //      to pick out specific assets from the manifest by position.
  //
  // Most of the obfuscated two-letter names below are still here (e.g.
  // `WebApplication.ds`, `Scene.salutePlayed`); they're consumed from many other
  // call sites and renaming them is a separate pass. Inline comments
  // explain each block's purpose so a human can skim.
  //
  // Sprite-key constants previously lived here too (`Keys.*`, ~260
  // lines) — they're now in `src/keys.js`, which is concatenated
  // immediately before this file.
  // --------------------------------------------------------------------

  // --- Host detection + interop shims ---------------------------------
  host.zt |= 0;
  if (typeof performance != "undefined" && typeof performance.now == "function") {
    Std.now = performance.now.bind(performance);
  }
  // Older Edge / pre-2015 browsers don't have String.fromCodePoint.
  if (String.fromCodePoint == null) {
    String.fromCodePoint = function (a) {
      if (a < 65536) {
        return String.fromCharCode(a);
      } else {
        return String.fromCharCode((a >> 10) + 55232) + String.fromCharCode((a & 1023) + 56320);
      }
    };
  }
  // Haxe's runtime type tags. `i` marks "is interface", `l` marks the
  // class on its prototype; both used by the reflection helpers in
  // runtime/haxe/std.js.
  Object.defineProperty(String.prototype, "__class__", { value: String, enumerable: false, writable: true });
  String.i = true;
  Array.i = true;
  Date.prototype.l = Date;
  Date.i = "Date";
  var vO2 = {};
  var vO3 = {};
  var vNumber = Number;
  var vBoolean = Boolean;
  var vO4 = {};
  var vO5 = {};
  StdString.xL = {}.toString;

  // --- Locales + per-box bitmasks -------------------------------------
  // LANGUAGES — language list (matches assets/fonts/font-<lang>.{png,dat}).
  var LANGUAGES = "en de fr ru nl br it es ko ja".split(" ");
  // BOX_STAR_THRESHOLDS — per-box "stars needed" thresholds. Indexed by box-1 (0..16).
  //       Used by the season unlock logic in seasons.js.
  var BOX_STAR_THRESHOLDS = [0, 30, 80, 170, 230, 0, 40, 90, 150, 200, 0, 40, 90, 150, 200, 270, 350];
  // BOX_OBJECT_FLAGS — per-box bitmask of which game-object kinds are used. Each
  //       bit corresponds to one game-object type (rope, star, candy,
  //       etc.); LevelScene.getPreloads() ANDs against this to decide
  //       which obj_* sprite sheet to preload for the active box.
  var BOX_OBJECT_FLAGS = [3, 31, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 19351, 64407, 123823, 260791, 375463, 633511, 1117095];

  // --- WebApplication boot flags --------------------------------------
  WebApplication.ds                = false; // (unknown — still obfuscated; one reader in level.js)
  WebApplication.xmasMode          = false; // SDK.hasFeature("xmas")
  WebApplication.magnetEnabled     = true;
  WebApplication.magnetRefill      = 1;     // refill count after rewarded ad (unused; Mf=Infinity)
  WebApplication.telekinesisEnabled = true;
  WebApplication.telekinesisRefill = 1;     // unused; Mf=Infinity
  WebApplication.externalPause     = true;  // host owns pause button
  WebApplication.externalMute      = false; // host owns mute button
  WebApplication.menuMusicId       = 0;     // points at audio/menu_music{_xmas}.ogg
  WebApplication.gameMusicId       = 0;     // points at audio/game_music{_xmas}.ogg

  // --- Scene-tree + scene-state defaults ------------------------------
  Node.qw = new ArrayList(4096, null, true);
  Scene.salutePlayed         = false;  // first-clear celebration anim has fired
  MenuScene.freshBoot        = true;   // MenuScene.start() hasn't run yet
  LevelScene.freshBoot       = true;   // first-level preload delay still pending
  LevelScene.pendingLevelJump = -1;    // != -1: jump to this level index next frame
  LevelScene.pendingRestart  = false;
  LevelScene.ev              = false;  // (unknown - triggers JC() with am-temp swap)
  LevelScene.isPlaying       = false;  // mirrors `state == 1` for outside-of-scene checks
  LevelScene.am              = -1;     // (unknown - hit-counter target during ev)
  var gameReadyFired = false;          // one-shot, gates SDK.gameReady() in menu.start
  var audioDisabled  = false;          // SDK.onRequest("disableAudio") flipped
  var gameplayPaused = false;          // SDK.onRequest("pauseGameplay") flipped

  // --- LevelState defaults --------------------------------------------
  LevelState.season = 1;  // 1..3
  LevelState.box    = 1;
  LevelState.level  = 1;

  WorldScale.scale    = 1.2;   // physics-units-to-world scale factor
  Save.persistEnabled = true;  // gates Save.flush() writing to localStorage

  // --- SoundFx ids — these MUST match audio/sfx/manifest.json ---------
  // Every SoundFx.<key> is a numeric id passed to SoundFx.play(...).
  // The same id is the key the mixer registers each .ogg under (loaded
  // individually now; see Application.loadSfxBundle in lifecycle.js).
  SoundFx.win = 1001;
  SoundFx.wheel = 1002;
  SoundFx.transporter_move = 1003;
  SoundFx.transporter_drop = 1004;
  SoundFx.teleport = 1005;
  SoundFx.steam_start_2 = 1006;
  SoundFx.steam_start = 1007;
  SoundFx.steam_end = 1008;
  SoundFx.star_light02 = 1009;
  SoundFx.star_light01 = 1010;
  SoundFx.star_1 = 1013;
  SoundFx.sp_telekinesis = 1014;
  SoundFx.sp_field_bounce = 1015;
  SoundFx.sp_field = 1016;
  SoundFx.sp_cloverleaf = 1017;
  SoundFx.spike_rotate_out = 1018;
  SoundFx.spike_rotate_in = 1019;
  SoundFx.spider_win = 1020;
  SoundFx.spider_fall = 1021;
  SoundFx.spider_activate = 1022;
  SoundFx.scratch_out = 1023;
  SoundFx.scratch_in = 1024;
  SoundFx.salute = 1025;
  SoundFx.rope_get = 1026;
  SoundFx.pump_4 = 1031;
  SoundFx.mouse_tap = 1036;
  SoundFx.mouse_rustle = 1037;
  SoundFx.monster_sad = 1042;
  SoundFx.monster_open = 1043;
  SoundFx.monster_close = 1044;
  SoundFx.monster_chewing = 1045;
  SoundFx.magnet_idle = 1046;
  SoundFx.magnet_attract = 1047;
  SoundFx.lantern_teleport_out = 1048;
  SoundFx.lantern_teleport_in = 1049;
  SoundFx.gravity_on = 1050;
  SoundFx.gravity_off = 1051;
  SoundFx.ghost_puff = 1052;
  SoundFx.electric = 1053;
  SoundFx.candy_link = 1058;
  SoundFx.candy_break = 1059;
  SoundFx.buzz = 1060;
  SoundFx.button = 1061;
  SoundFx.bubble_break = 1062;
  SoundFx.bubble = 1063;
  SoundFx.bouncer = 1064;
  // --- Build / version ------------------------------------------------
  Resources.bm = [];
  Build.VERSION = new SemVer("1.6.20");
  Build.FG = "v1.6.20 2025-05-28 16:27:50 Generated by Haxe 4.3.4 polygonal";

  // --- Geometry / colour / time defaults ------------------------------
  RGBA.CS = new RGBA(1, 1, 1, 1);
  RGBA.yT = RGBA.CS;
  Rect.oy = 1; Rect.py = 2; Rect.ny = 4; Rect.qy = 8;
  FixedTimestep.Rk = 0.016666666666666666; // 1/60s
  Vec2.BL = [];
  Vec2.CL = [];

  // --- SDK runtime state ----------------------------------------------
  SDK.forceUnmuted = false;
  SDK.lastPreloadProgress = -1;

  // --- Pre-built animation timelines (Keys.Pa returns an interned key
  // for "frames 0..N at <fps>fps"). These are reused across many sprite
  // instances rather than re-instantiated per use.
  var vLN01 = 0.1;
  var STAR_IDLE_BLUE_ANIM = Keys.Pa(Keys.qI, 0, 17, 20);
  var vLN10 = 10;
  var X1_ANIM = Keys.Pa(Keys.UG, 0, 4, 25);
  var X2_ANIM = Keys.Pa(Keys.WG, 0, 4, 25);
  var MOUSE_ANIM_A = InternKey.create("" + Keys.Vp + "@20,0-2");
  var MOUSE_ANIM_B = InternKey.create("" + Keys.Vp + "@20,3,4,8");
  var MOUSE_ANIM_C = InternKey.create("" + Keys.Vp + "@20,2,6,7,11");
  var MOUSE_ANIM_D = InternKey.create("" + Keys.Vp + "@20,8,9,10,11");
  var v153 = null;
  var EYES_ANIM = InternKey.create("" + Keys.lH + "@20,0-8");

  // --- Character (Om Nom) animation + hitbox config -------------------
  Character.UI = Keys.Pa(Keys.$G, 0, 11, 20);
  Character.iy = Rect.Gm(new Rect(48, 48, 152, 152));
  Character.BF = -17;
  Character.AF = 20;

  // --- Candy / bubble / particle -------------------------------------
  CandyCutAnim.gy = new Rect(142, 157, 112, 104);
  CandyCutAnim.Sp = Rect.Gm(CandyCutAnim.gy);
  var v155 = Keys.Pa(null, 8, 17, 15);
  var v156 = InternKey.create("18@3,18");
  var v157 = Keys.Pa(null, 21, 25, 20);
  BubbleAnim.uF = Keys.Pa(Keys.YG, 0, 13, 20);
  CandyPiece.ky = Rect.Gm(new Rect(155, 176, 88, 76));
  PathResolver.Ey = 100;
  var BEE_ANIM = Keys.Pa(Keys.IG, 1, 3, 33);
  var v159 = null, v160 = null, v161 = null, v162 = null;
  var FIREFLY_ANIM = Keys.Pa(Keys.PH, 0, 39, 20);

  BoxLevelData.aw = [];

  // --- OmNom ----------------------------------------------------------
  OmNom.jK = Rect.Gm(new Rect(264, 350, 108, 2));
  OmNom.Iy = 80;
  var OM_NOM_ANIMS = [
    Keys.Pa(Keys.LF, 0, 18, 20),  // idle
    Keys.Pa(Keys.JF, 0, 24, 20),  // idle2
    Keys.Pa(Keys.KF, 0, 15, 20),  // idle3
    Keys.Pa(Keys.MF, 0, 19, 20),  // excited
    Keys.Pa(Keys.PF, 0, 26, 20),  // puzzled
    Keys.Pa(Keys.HF, 0, 12, 20),  // fail
    Keys.Pa(Keys.ly, 0, 3, 20),   // mouth_close
    Keys.Pa(Keys.OF, 0, 8, 20),   // mouth_open
    Keys.Pa(Keys.ly, 0, 3, 20),   // mouth_close (again — different state)
    Keys.Pa(Keys.GF, 0, 8, 20),   // chew
    Keys.Pa(Keys.NF, 0, 29, 20),  // greeting
    Keys.Pa(Keys.QF, 0, 6, 20),   // sleeping
    Keys.Pa(Keys.RF, 0, 15, 20),  // super_in
    Keys.Pa(Keys.TF, 0, 8, 10),   // super_loop
    Keys.Pa(Keys.SF, 0, 8, 20)    // super_loop_active
  ];
  var OM_NOM_BLINK_ANIM = InternKey.create("" + Keys.FF + "@20,0,1,0,1"); // blink
  var OM_NOM_ZZZ_ANIM = InternKey.create("" + Keys.my + "@30,0-36,0x15"); // zzz
  var OM_NOM_ZZZ_ANIM_REV = InternKey.create("" + Keys.my + "@30,0x15,0-36");

  // --- Pump / Sock / Star --------------------------------------------
  Pump.zF = Keys.Pa(null, 1, 5, 20);
  Pump.Vy = Rect.Gm(new Rect(300, 300, 175, 175));
  Sock.Yy = 56;
  Sock.wJ = 6;
  Sock.Sk = 16;
  Sock.xJ = -6.4;
  var v167 = InternKey.create("@20,2,3,3,4");
  var v168 = InternKey.create("0-4@20,5@0.4,6@20");
  var v169 = Keys.Pa(null, 7, 10, 10);
  var v170 = Keys.Pa(null, 1, 4, 20);
  Star.bg = 16.8;
  Star.iK = Rect.Gm(new Rect(70, 64, 82, 82));
  var STAR_IDLE_ANIM = Keys.Pa(Keys.rI, 0, 17, 20); // star idle
  var STAR_IDLE_OFF_ANIM = Keys.Pa(Keys.tI, 0, 17, 20); // star idle_off
  var STAR_LIGHT_UP_ANIM = Keys.Pa(Keys.xI, 0, 5, 20);  // star light_up
  var STAR_LIGHT_DOWN_ANIM = Keys.Pa(Keys.vI, 0, 5, 20);  // star light_down
  var STAR_DISAPPEAR_ANIM = Keys.Pa(Keys.lI, 0, 12, 20); // star disappear
  var PARTICLE_1_ANIM = Keys.Pa(Keys.CI, 0, 10, 20); // particle_1
  var PARTICLE_2_ANIM = Keys.Pa(Keys.DI, 0, 10, 20); // particle_2
  var PARTICLE_3_ANIM = Keys.Pa(Keys.EI, 0, 10, 20); // particle_3

  ConveyorItem.zL = 0;
  var DIGIT_FRAME_0 = Keys.HI, DIGIT_FRAME_1 = Keys.II, DIGIT_FRAME_2 = Keys.JI, DIGIT_FRAME_3 = Keys.KI;
  var DIGIT_FRAME_4 = Keys.LI, DIGIT_FRAME_5 = Keys.MI, DIGIT_FRAME_6 = Keys.NI, DIGIT_FRAME_7 = Keys.OI;

  // --- LevelController tuning -----------------------------------------
  LevelController.Yp = 36;
  LevelController.DF = 120;
  LevelController.CF = 240;
  LevelController.kK = 110;
  LevelController.mn = 1.2000000000000002;
  LevelController.Ty = 0.9;
  LevelController.Hj = true;

  var vLN023 = 0;
  var vLN024 = 0;
  Texture.WP = 1;

  // --- Anim / draw-effect TYPE tags -----------------------------------
  // Every effect / scene-node class carries a numeric TYPE used by
  // the renderer to pair effects with their GL programs (and by the
  // scene tree for cheap typeof tests). See ya()/typeId() overrides.
  AnimComponent.ty = 0;
  AnimComponent.$F = 3;
  AnimComponent.TYPE = 103;
  AnimController.TYPE     = 303;
  AnimSequenceCtl.TYPE    = 403;
  TweenTrack.TYPE         = 203;
  DrawEffect.TYPE         = 105;
  TextDrawEffect.TYPE     = 505;
  GradientLineEffect.TYPE = 705;
  TextGridEffect.TYPE     = 1805;
  ColorRectEffect.TYPE    = 1205;
  ClearEffect.TYPE        = 305;
  MultiLineEffect.WF      = 4.800000000000001;
  MultiLineEffect.TYPE    = 1105;
  DashedCircleEffect.TYPE = 605;
  SpriteShapeEffect.TYPE  = 1705;
  ShapePath.TYPE          = 1005;
  RingDrawEffect.TYPE     = 905;
  TextureDrawEffect.TYPE  = 205;
  MeshDrawEffect.TYPE     = 405;
  ParallaxDrawEffect.TYPE = 1605;
  SolidColorEffect.TYPE   = 1405;
  GradientEffect.TYPE     = 1505;

  // --- Hex lookup table (256-entry cached byte-to-string) -------------
  (function () {
    HexLookup.Dy = Array(256);
    let a = 0;
    while (a < 256) {
      let b = a++;
      HexLookup.Dy[b] = StringUtil.oO(b);
    }
    return null;
  })(this);
  var vLS000000 = "#000000";

  // --- More TYPE tags / GL constants ----------------------------------
  ShapePathBounds.TYPE = 1305;
  GLAttribSentinel.SI = -1;
  GLTypeSize.dA = [1, 1, 2, 2, 4];
  GLProgram.RE = new Float32Array(16);
  VertexBuffer.hO = [5120, 5121, 5122, 5123, 5126];
  WebGLRenderer.nq = [0, 1, 774, 775, 770, 771, 772, 773];
  WebGLRenderer.JM = [512, 513, 514, 515, 516, 517, 518, 519];
  NoopEffect.TYPE         = 2005;
  MeshDataEffect.TYPE     = 1905;
  CustomShaderEffect.TYPE = 805;
  GLTiledTextureProgram.sL = [[0, 1, 1, 1, 0, 0, 1, 0], [1, 1, 0, 1, 1, 0, 0, 0]];

  // Bounds + Scene-node TYPE tags
  ShapeBounds.TYPE        = 102;
  BoxBounds.Fd = new Vec4(0, 0, 0, 1);
  BoxBounds.TYPE          = 302;
  BoxShapeBounds.TYPE     = 402;
  PolygonShapeBounds.TYPE = 202;
  CircleBounds.TYPE       = 502;
  ColorTransformState.next = 0;
  SceneNode.count         = 0;
  SceneNode.HM            = 202;
  SceneNode.IM            = 0;
  SceneNode.TYPE          = 101;
  SceneGroup.count        = 0;
  SceneGroup.TYPE         = 201;
  MeshNode.TYPE           = 601;
  ClipState.next          = 0;
  BufferNode.TYPE         = 501;
  SceneRoot.count         = 0;
  SceneRoot.TYPE          = 301;
  SpriteNode.TYPE         = 401;
  NodeTreeUtil.yx = new Stack();
  NodeTreeUtil.DS = new Stack();
  DisplayBase.count       = 0;
  DisplayBase.TYPE        = 104;
  Sprite.TYPE             = 304;
  Container.TYPE          = 204;
  TextNode.TYPE           = 404;

  // --- Base64 + reinterpret helpers -----------------------------------
  Base64.UF = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  Base64.jy = Bytes.EC(Base64.UF);
  Float64Cast.Ev = new DataView(new ArrayBuffer(8));

  // --- Keyboard map + math constants ----------------------------------
  var KEYBOARD_CODES = null; // populated by buildKeyboardCodeTable() in helpers.js
  var EPSILON        = 0.000001;
  var RAD2DEG = 57.29577951308232;     // 180/π — radians→degrees
  var DEG2RAD = 0.0174532925199432;   // π/180 — degrees→radians
  var PI  = 3.141592653589793;    // π
  var HALF_PI = 1.5707963267948966;   // π/2
  var TWO_PI  = 6.283185307179586;    // 2π
  var vInfinity            = Infinity;
  var vNegInfinity                 = -Infinity;
  var INT16_MIN                 = -32768;
  var INT32_MAX        = 2147483647;
  var FLOAT_MAX             = 3.4e+38;
  var FLOAT_MIN                 = -3.4e+38;
  TouchState.aq = INT16_MIN;
  var X = new MathRandom();

  // --- HUD assets -----------------------------------------------------
  var HUD_STAR_ANIM = Keys.Pa(Keys.MK, 0, 10, 25); // hud_star
  var HUD_STAR_FRAME_0 = Keys.LK;                     // hud_star/0000
  var vA6 = [0, 5, 6, 7, 8];
  LevelDot.zE = [Keys.PK, Keys.QK, Keys.RK, Keys.SK, Keys.NK];

  // --- Physics gravity ------------------------------------------------
  PhysicsConfig.Et = 784;                       // px/s² (≈ 9.8 m/s² × ~80px/m)
  PhysicsConfig.wy = PhysicsConfig.Et;
  PhysicsConfig.current = new Vec2(0, PhysicsConfig.Et);

  ScriptLoader.cA = 0;
  MD5.yG = "0123456789abcdef".split("");

  Loader.ib();

  // --------------------------------------------------------------------
  // Asset manifest
  //
  // Three parallel arrays drive every fetch:
  //
  //   Loader.Ce — path TEMPLATES (with {image}, {audio}, {language},
  //               {resolution} placeholders the loader substitutes).
  //               INDEXED by all the `Loader.<X> = <number>` constants
  //               at the bottom of this file, so order MUST stay stable.
  //
  //   Loader.bA — "path:byteSize" pairs for the size hints used by the
  //               loading-progress UI.
  //
  //   Loader.zQ — subset of paths that have a 2x variant (used by
  //               Loader.HN/Loader.ni to pick `-2x` on Hi-DPI).
  //
  // Audio sound-sprite handling lives in Application.loadSfxBundle
  // (lifecycle.js); the old SPR-sprite sound.{ogg,aac} is gone.
  // --------------------------------------------------------------------
  Loader.Rp = "assets";
  Loader.MAX = 204;
  Loader.YQ = [50, 51, 52];

  // The paths/sizes were originally serialised as a single space-
  // separated string; expanded to one entry per line for readability.
  // `.split(" ")` is gone — these are plain arrays now.
  Loader.bA = [
    // videos
    "static/video/outro_portrait.mp4:606240",
    "static/video/outro_landscape.mp4:707037",
    "static/video/intro_portrait.mp4:254354",
    "static/video/intro_landscape.mp4:364300",
    // strings
    "static/strings.json:47035",
    // pics
    "images/pics/thumbs.png:83668",       "images/pics/thumbs.json:4819",
    "images/pics/thumbs-2x.png:280525",   "images/pics/thumbs-2x.json:4868",
    "images/pics/pic_21.jpg:151191",      "images/pics/pic_20.jpg:149085",
    "images/pics/pic_19.jpg:87608",       "images/pics/pic_18.jpg:91082",
    "images/pics/pic_17.jpg:106541",      "images/pics/pic_16.jpg:80658",
    "images/pics/pic_15.jpg:64604",       "images/pics/pic_14.jpg:88490",
    "images/pics/pic_13.jpg:119028",      "images/pics/pic_12.jpg:95377",
    "images/pics/pic_11.jpg:95431",       "images/pics/pic_10.jpg:107394",
    "images/pics/pic_09.jpg:94226",       "images/pics/pic_08.jpg:94333",
    "images/pics/pic_07.jpg:111936",      "images/pics/pic_06.jpg:79570",
    "images/pics/pic_05.jpg:85850",       "images/pics/pic_04.jpg:84859",
    "images/pics/pic_03.jpg:81184",       "images/pics/pic_02.jpg:113893",
    "images/pics/pic_01.jpg:119921",
    "images/pics/missing.png:154822",
    "images/pics/bg_xmas.jpg:259306",     "images/pics/bg.jpg:152419",
    // menu
    "images/menu/ui.png:396375",          "images/menu/ui.json:24561",
    "images/menu/shadow.png:15280",
    "images/menu/seasons.png:153688",     "images/menu/seasons.json:1527",
    "images/menu/season3.png:231313",     "images/menu/season3.json:3097",
    "images/menu/season2.png:231231",     "images/menu/season2.json:2700",
    "images/menu/season1.png:250245",     "images/menu/season1.json:2699",
    "images/menu/salute.png:32002",       "images/menu/salute.json:10858",
    "images/menu/salute-2x.png:92937",    "images/menu/salute-2x.json:11193",
    "images/menu/cut.png:18928",          "images/menu/cut.json:1097",
    "images/menu/cut-2x.png:60604",       "images/menu/cut-2x.json:1107",
    "images/menu/bg_xmas.jpg:126904",
    "images/menu/bg2_xmas.png:155196",    "images/menu/bg2.png:247796",
    "images/menu/bg.jpg:90340",
    // loader splash
    "images/loader_bg.jpg:22263", "images/loader.png:16984", "images/loader.dat:440",
    // language fonts
    "fonts/font-ru.png:68946",  "fonts/font-ru.dat:6169",
    "fonts/font-nl.png:48288",  "fonts/font-nl.dat:5609",
    "fonts/font-ko.png:163320", "fonts/font-ko.dat:14969",
    "fonts/font-ja.png:211458", "fonts/font-ja.dat:21469",
    "fonts/font-it.png:48936",  "fonts/font-it.dat:5549",
    "fonts/font-fr.png:50257",  "fonts/font-fr.dat:5729",
    "fonts/font-es.png:50586",  "fonts/font-es.dat:5709",
    "fonts/font-en.png:48296",  "fonts/font-en.dat:5589",
    "fonts/font-de.png:51771",  "fonts/font-de.dat:5729",
    "fonts/font-br.png:53145",  "fonts/font-br.dat:5849",
    // in-game sprite sheets (1x + 2x)
    "images/game/tut.png:27759", "images/game/tut.json:2291",
    "images/game/obj_vinyl.png:34111",     "images/game/obj_vinyl.json:1497",
    "images/game/obj_vinyl-2x.png:62064",  "images/game/obj_vinyl-2x.json:1523",
    "images/game/obj_transporter.png:1535","images/game/obj_transporter.json:1844",
    "images/game/obj_steam.png:9200",      "images/game/obj_steam.json:7334",
    "images/game/obj_steam-2x.png:21885",  "images/game/obj_steam-2x.json:7380",
    "images/game/obj_star.png:116319",     "images/game/obj_star.json:24293",
    "images/game/obj_star-2x.png:354592",  "images/game/obj_star-2x.json:24689",
    "images/game/obj_spikes.png:5674",     "images/game/obj_spikes.json:1081",
    "images/game/obj_spikes-2x.png:17960", "images/game/obj_spikes-2x.json:1083",
    "images/game/obj_spider.png:8232",     "images/game/obj_spider.json:2813",
    "images/game/obj_spider-2x.png:24082", "images/game/obj_spider-2x.json:2868",
    "images/game/obj_sp.png:24382",        "images/game/obj_sp.json:2637",
    "images/game/obj_sp-2x.png:82882",     "images/game/obj_sp-2x.json:2661",
    "images/game/obj_sock.png:12333",      "images/game/obj_sock.json:1287",
    "images/game/obj_sock-2x.png:35190",   "images/game/obj_sock-2x.json:1299",
    "images/game/obj_pump.png:10250",      "images/game/obj_pump.json:2081",
    "images/game/obj_pump-2x.png:29141",   "images/game/obj_pump-2x.json:2085",
    "images/game/obj_lighter.png:17490",   "images/game/obj_lighter.json:8776",
    "images/game/obj_lighter-2x.png:56932","images/game/obj_lighter-2x.json:8867",
    "images/game/obj_lantern.png:15236",   "images/game/obj_lantern.json:1912",
    "images/game/obj_lantern-2x.png:42472","images/game/obj_lantern-2x.json:1943",
    "images/game/obj_hook.png:12919",      "images/game/obj_hook.json:3405",
    "images/game/obj_hook-2x.png:37297",   "images/game/obj_hook-2x.json:3473",
    "images/game/obj_gravity.png:5221",    "images/game/obj_gravity.json:726",
    "images/game/obj_gravity-2x.png:14510","images/game/obj_gravity-2x.json:731",
    "images/game/obj_ghost.png:5670",      "images/game/obj_ghost.json:1697",
    "images/game/obj_ghost-2x.png:12807",  "images/game/obj_ghost-2x.json:1711",
    "images/game/obj_gap.png:16814",       "images/game/obj_gap.json:4839",
    "images/game/obj_gap-2x.png:47790",    "images/game/obj_gap-2x.json:4898",
    "images/game/obj_electro.png:8545",    "images/game/obj_electro.json:1288",
    "images/game/obj_electro-2x.png:30475","images/game/obj_electro-2x.json:1299",
    "images/game/obj_candy4.png:71722",    "images/game/obj_candy4.json:5300",
    "images/game/obj_candy4-2x.png:206179","images/game/obj_candy4-2x.json:5405",
    "images/game/obj_candy3.png:72274",    "images/game/obj_candy3.json:5298",
    "images/game/obj_candy3-2x.png:208381","images/game/obj_candy3-2x.json:5405",
    "images/game/obj_candy2.png:75319",    "images/game/obj_candy2.json:5308",
    "images/game/obj_candy2-2x.png:222774","images/game/obj_candy2-2x.json:5417",
    "images/game/obj_candy1.png:81126",    "images/game/obj_candy1.json:5309",
    "images/game/obj_candy1-2x.png:234543","images/game/obj_candy1-2x.json:5431",
    "images/game/obj_candy0.png:74349",    "images/game/obj_candy0.json:5308",
    "images/game/obj_candy0-2x.png:212961","images/game/obj_candy0-2x.json:5416",
    "images/game/obj_bubble.png:37007",    "images/game/obj_bubble.json:6254",
    "images/game/obj_bubble-2x.png:107943","images/game/obj_bubble-2x.json:6344",
    "images/game/obj_bouncer.png:15871",   "images/game/obj_bouncer.json:2285",
    "images/game/obj_bouncer-2x.png:42679","images/game/obj_bouncer-2x.json:2311",
    "images/game/obj_blades.png:11087",    "images/game/obj_blades.json:1849",
    "images/game/obj_blades-2x.png:26077", "images/game/obj_blades-2x.json:1874",
    "images/game/obj_bee.png:3255",        "images/game/obj_bee.json:1289",
    "images/game/obj_bee-2x.png:8439",     "images/game/obj_bee-2x.json:1297",
    "images/game/char3.png:125467",        "images/game/char3.json:16103",
    "images/game/char3-2x.png:370734",     "images/game/char3-2x.json:16192",
    "images/game/char2.png:156278",        "images/game/char2.json:18737",
    "images/game/char2-2x.png:339748",     "images/game/char2-2x.json:18905",
    "images/game/char1.png:145178",        "images/game/char1.json:17289",
    "images/game/char1-2x.png:306027",     "images/game/char1-2x.json:17381",
    // boxes — order is high → low (17 -> 1), matching Loader.Ce below
    "images/boxes/17mechanicalbox/support.png:20935", "static/boxes/17mechanicalbox/maps.json:32447",
    "images/boxes/17mechanicalbox/cover.png:94067",   "images/boxes/17mechanicalbox/cover.json:721",
    "images/boxes/17mechanicalbox/bg.jpg:192584",
    "images/boxes/16pillowbox/support.png:20889",     "static/boxes/16pillowbox/maps.json:34665",
    "images/boxes/16pillowbox/cover.png:111821",      "images/boxes/16pillowbox/cover.json:721",
    "images/boxes/16pillowbox/bg.jpg:166366",
    "images/boxes/15cheesebox/support.png:19248",     "static/boxes/15cheesebox/maps.json:27278",
    "images/boxes/15cheesebox/cover.png:121680",      "images/boxes/15cheesebox/cover.json:721",
    "images/boxes/15cheesebox/bg.jpg:80627",
    "images/boxes/14lanternbox/support.png:22796",    "static/boxes/14lanternbox/maps.json:22757",
    "images/boxes/14lanternbox/cover.png:117995",     "images/boxes/14lanternbox/cover.json:721",
    "images/boxes/14lanternbox/bg.jpg:193042",
    "images/boxes/13steambox/support.png:14277",      "static/boxes/13steambox/maps.json:22768",
    "images/boxes/13steambox/cover.png:102039",       "images/boxes/13steambox/cover.json:721",
    "images/boxes/13steambox/bg.jpg:130490",
    "images/boxes/12spookybox/support.png:27855",     "static/boxes/12spookybox/maps.json:27095",
    "images/boxes/12spookybox/cover.png:163397",      "images/boxes/12spookybox/cover.json:721",
    "images/boxes/12spookybox/bg.jpg:161968",
    "images/boxes/11djbox/support.png:20124",         "static/boxes/11djbox/maps.json:28386",
    "images/boxes/11djbox/cover.png:147733",          "images/boxes/11djbox/cover.json:721",
    "images/boxes/11djbox/bg.jpg:318137",
    "images/boxes/10buzzbox/support.png:10900",       "static/boxes/10buzzbox/maps.json:28775",
    "images/boxes/10buzzbox/cover.png:142967",        "images/boxes/10buzzbox/cover.json:721",
    "images/boxes/10buzzbox/bg.jpg:291192",
    "images/boxes/9toolbox/support.png:18151",        "static/boxes/9toolbox/maps.json:27367",
    "images/boxes/9toolbox/cover.png:127769",         "images/boxes/9toolbox/cover.json:721",
    "images/boxes/9toolbox/bg.jpg:290591",
    "images/boxes/8cosmicbox/support.png:17382",      "static/boxes/8cosmicbox/maps.json:30526",
    "images/boxes/8cosmicbox/earth.png:37193",
    "images/boxes/8cosmicbox/cover.png:154083",       "images/boxes/8cosmicbox/cover.json:721",
    "images/boxes/8cosmicbox/bg.jpg:261876",
    "images/boxes/7giftbox/support.png:17646",        "static/boxes/7giftbox/maps.json:28759",
    "images/boxes/7giftbox/cover.png:176165",         "images/boxes/7giftbox/cover.json:721",
    "images/boxes/7giftbox/bg.jpg:276708",
    "images/boxes/6toybox/support.png:24856",         "static/boxes/6toybox/maps.json:23787",
    "images/boxes/6toybox/cover.png:191492",          "images/boxes/6toybox/cover.json:721",
    "images/boxes/6toybox/bg.jpg:302842",
    "images/boxes/5valentinebox/support.png:19451",   "static/boxes/5valentinebox/maps.json:28121",
    "images/boxes/5valentinebox/cover.png:112297",    "images/boxes/5valentinebox/cover.json:721",
    "images/boxes/5valentinebox/bg.jpg:327075",
    "images/boxes/4magicbox/support.png:23898",       "static/boxes/4magicbox/maps.json:28874",
    "images/boxes/4magicbox/cover.png:174462",        "images/boxes/4magicbox/cover.json:721",
    "images/boxes/4magicbox/bg.jpg:297536",
    "images/boxes/3foilbox/support.png:21077",        "static/boxes/3foilbox/maps.json:28624",
    "images/boxes/3foilbox/cover.png:144475",         "images/boxes/3foilbox/cover.json:721",
    "images/boxes/3foilbox/bg.jpg:271789",
    "images/boxes/2fabricbox/support.png:23502",      "static/boxes/2fabricbox/maps.json:28645",
    "images/boxes/2fabricbox/cover.png:141431",       "images/boxes/2fabricbox/cover.json:721",
    "images/boxes/2fabricbox/bg.jpg:292429",
    "images/boxes/1cardboardbox/support.png:12953",   "static/boxes/1cardboardbox/maps.json:53856",
    "images/boxes/1cardboardbox/cover.png:178457",    "images/boxes/1cardboardbox/cover.json:721",
    "images/boxes/1cardboardbox/bg.jpg:224627",
    // music
    "audio/menu_music_xmas.ogg:435372",
    "audio/menu_music.ogg:431450",
    "audio/game_music_xmas.ogg:872474",
    "audio/game_music.ogg:509573"
  ];

  Loader.Ce = [
    // videos
    "static/video/outro_portrait.mp4",
    "static/video/outro_landscape.mp4",
    "static/video/intro_portrait.mp4",
    "static/video/intro_landscape.mp4",
    "static/strings.json",
    // pics
    "images/pics/thumbs{resolution}.{image}",
    "images/pics/thumbs{resolution}.json",
    "images/pics/pic_21.jpg", "images/pics/pic_20.jpg", "images/pics/pic_19.jpg",
    "images/pics/pic_18.jpg", "images/pics/pic_17.jpg", "images/pics/pic_16.jpg",
    "images/pics/pic_15.jpg", "images/pics/pic_14.jpg", "images/pics/pic_13.jpg",
    "images/pics/pic_12.jpg", "images/pics/pic_11.jpg", "images/pics/pic_10.jpg",
    "images/pics/pic_09.jpg", "images/pics/pic_08.jpg", "images/pics/pic_07.jpg",
    "images/pics/pic_06.jpg", "images/pics/pic_05.jpg", "images/pics/pic_04.jpg",
    "images/pics/pic_03.jpg", "images/pics/pic_02.jpg", "images/pics/pic_01.jpg",
    "images/pics/missing.{image}",
    "images/pics/bg_xmas.jpg", "images/pics/bg.jpg",
    // menu
    "images/menu/ui.{image}", "images/menu/ui.json",
    "images/menu/shadow.{image}",
    "images/menu/seasons.{image}", "images/menu/seasons.json",
    "images/menu/season3.{image}", "images/menu/season3.json",
    "images/menu/season2.{image}", "images/menu/season2.json",
    "images/menu/season1.{image}", "images/menu/season1.json",
    "images/menu/salute{resolution}.{image}", "images/menu/salute{resolution}.json",
    "images/menu/cut{resolution}.{image}",    "images/menu/cut{resolution}.json",
    "images/menu/bg_xmas.jpg",
    "images/menu/bg2_xmas.{image}", "images/menu/bg2.{image}",
    "images/menu/bg.jpg",
    // loader splash
    "images/loader_bg.jpg", "images/loader.{image}", "images/loader.dat",
    // language fonts
    "fonts/font{language}.{image}", "fonts/font{language}.dat",
    // in-game sprite sheets
    "images/game/tut.{image}", "images/game/tut.json",
    "images/game/obj_vinyl{resolution}.{image}",  "images/game/obj_vinyl{resolution}.json",
    "images/game/obj_transporter.{image}",        "images/game/obj_transporter.json",
    "images/game/obj_steam{resolution}.{image}",  "images/game/obj_steam{resolution}.json",
    "images/game/obj_star{resolution}.{image}",   "images/game/obj_star{resolution}.json",
    "images/game/obj_spikes{resolution}.{image}", "images/game/obj_spikes{resolution}.json",
    "images/game/obj_spider{resolution}.{image}", "images/game/obj_spider{resolution}.json",
    "images/game/obj_sp{resolution}.{image}",     "images/game/obj_sp{resolution}.json",
    "images/game/obj_sock{resolution}.{image}",   "images/game/obj_sock{resolution}.json",
    "images/game/obj_pump{resolution}.{image}",   "images/game/obj_pump{resolution}.json",
    "images/game/obj_lighter{resolution}.{image}","images/game/obj_lighter{resolution}.json",
    "images/game/obj_lantern{resolution}.{image}","images/game/obj_lantern{resolution}.json",
    "images/game/obj_hook{resolution}.{image}",   "images/game/obj_hook{resolution}.json",
    "images/game/obj_gravity{resolution}.{image}","images/game/obj_gravity{resolution}.json",
    "images/game/obj_ghost{resolution}.{image}",  "images/game/obj_ghost{resolution}.json",
    "images/game/obj_gap{resolution}.{image}",    "images/game/obj_gap{resolution}.json",
    "images/game/obj_electro{resolution}.{image}","images/game/obj_electro{resolution}.json",
    "images/game/obj_candy4{resolution}.{image}", "images/game/obj_candy4{resolution}.json",
    "images/game/obj_candy3{resolution}.{image}", "images/game/obj_candy3{resolution}.json",
    "images/game/obj_candy2{resolution}.{image}", "images/game/obj_candy2{resolution}.json",
    "images/game/obj_candy1{resolution}.{image}", "images/game/obj_candy1{resolution}.json",
    "images/game/obj_candy0{resolution}.{image}", "images/game/obj_candy0{resolution}.json",
    "images/game/obj_bubble{resolution}.{image}", "images/game/obj_bubble{resolution}.json",
    "images/game/obj_bouncer{resolution}.{image}","images/game/obj_bouncer{resolution}.json",
    "images/game/obj_blades{resolution}.{image}", "images/game/obj_blades{resolution}.json",
    "images/game/obj_bee{resolution}.{image}",    "images/game/obj_bee{resolution}.json",
    "images/game/char3{resolution}.{image}",      "images/game/char3{resolution}.json",
    "images/game/char2{resolution}.{image}",      "images/game/char2{resolution}.json",
    "images/game/char1{resolution}.{image}",      "images/game/char1{resolution}.json",
    // boxes — high-to-low order. Several Loader.<X> constants below
    // index into specific positions here (see scene.js Mp() arrays).
    "images/boxes/17mechanicalbox/support.{image}", "static/boxes/17mechanicalbox/maps.json",
    "images/boxes/17mechanicalbox/cover.{image}",   "images/boxes/17mechanicalbox/cover.json",
    "images/boxes/17mechanicalbox/bg.jpg",
    "images/boxes/16pillowbox/support.{image}",     "static/boxes/16pillowbox/maps.json",
    "images/boxes/16pillowbox/cover.{image}",       "images/boxes/16pillowbox/cover.json",
    "images/boxes/16pillowbox/bg.jpg",
    "images/boxes/15cheesebox/support.{image}",     "static/boxes/15cheesebox/maps.json",
    "images/boxes/15cheesebox/cover.{image}",       "images/boxes/15cheesebox/cover.json",
    "images/boxes/15cheesebox/bg.jpg",
    "images/boxes/14lanternbox/support.{image}",    "static/boxes/14lanternbox/maps.json",
    "images/boxes/14lanternbox/cover.{image}",      "images/boxes/14lanternbox/cover.json",
    "images/boxes/14lanternbox/bg.jpg",
    "images/boxes/13steambox/support.{image}",      "static/boxes/13steambox/maps.json",
    "images/boxes/13steambox/cover.{image}",        "images/boxes/13steambox/cover.json",
    "images/boxes/13steambox/bg.jpg",
    "images/boxes/12spookybox/support.{image}",     "static/boxes/12spookybox/maps.json",
    "images/boxes/12spookybox/cover.{image}",       "images/boxes/12spookybox/cover.json",
    "images/boxes/12spookybox/bg.jpg",
    "images/boxes/11djbox/support.{image}",         "static/boxes/11djbox/maps.json",
    "images/boxes/11djbox/cover.{image}",           "images/boxes/11djbox/cover.json",
    "images/boxes/11djbox/bg.jpg",
    "images/boxes/10buzzbox/support.{image}",       "static/boxes/10buzzbox/maps.json",
    "images/boxes/10buzzbox/cover.{image}",         "images/boxes/10buzzbox/cover.json",
    "images/boxes/10buzzbox/bg.jpg",
    "images/boxes/9toolbox/support.{image}",        "static/boxes/9toolbox/maps.json",
    "images/boxes/9toolbox/cover.{image}",          "images/boxes/9toolbox/cover.json",
    "images/boxes/9toolbox/bg.jpg",
    "images/boxes/8cosmicbox/support.{image}",      "static/boxes/8cosmicbox/maps.json",
    "images/boxes/8cosmicbox/earth.{image}",
    "images/boxes/8cosmicbox/cover.{image}",        "images/boxes/8cosmicbox/cover.json",
    "images/boxes/8cosmicbox/bg.jpg",
    "images/boxes/7giftbox/support.{image}",        "static/boxes/7giftbox/maps.json",
    "images/boxes/7giftbox/cover.{image}",          "images/boxes/7giftbox/cover.json",
    "images/boxes/7giftbox/bg.jpg",
    "images/boxes/6toybox/support.{image}",         "static/boxes/6toybox/maps.json",
    "images/boxes/6toybox/cover.{image}",           "images/boxes/6toybox/cover.json",
    "images/boxes/6toybox/bg.jpg",
    "images/boxes/5valentinebox/support.{image}",   "static/boxes/5valentinebox/maps.json",
    "images/boxes/5valentinebox/cover.{image}",     "images/boxes/5valentinebox/cover.json",
    "images/boxes/5valentinebox/bg.jpg",
    "images/boxes/4magicbox/support.{image}",       "static/boxes/4magicbox/maps.json",
    "images/boxes/4magicbox/cover.{image}",         "images/boxes/4magicbox/cover.json",
    "images/boxes/4magicbox/bg.jpg",
    "images/boxes/3foilbox/support.{image}",        "static/boxes/3foilbox/maps.json",
    "images/boxes/3foilbox/cover.{image}",          "images/boxes/3foilbox/cover.json",
    "images/boxes/3foilbox/bg.jpg",
    "images/boxes/2fabricbox/support.{image}",      "static/boxes/2fabricbox/maps.json",
    "images/boxes/2fabricbox/cover.{image}",        "images/boxes/2fabricbox/cover.json",
    "images/boxes/2fabricbox/bg.jpg",
    "images/boxes/1cardboardbox/support.{image}",   "static/boxes/1cardboardbox/maps.json",
    "images/boxes/1cardboardbox/cover.{image}",     "images/boxes/1cardboardbox/cover.json",
    "images/boxes/1cardboardbox/bg.jpg",
    // music (indices 199..202 — see Loader.menuMusicXmas/xF/wF/vF below)
    "audio/menu_music_xmas.ogg",
    "audio/menu_music.ogg",
    "audio/game_music_xmas.ogg",
    "audio/game_music.ogg"
  ];

  // Hi-DPI candidates (each has a `<base>.png` + `<base>-2x.png` pair).
  Loader.zQ = [
    "images/pics/thumbs.png", "images/pics/thumbs.json",
    "images/menu/salute.png", "images/menu/salute.json",
    "images/menu/cut.png",    "images/menu/cut.json",
    "images/game/obj_vinyl.png",     "images/game/obj_vinyl.json",
    "images/game/obj_steam.png",     "images/game/obj_steam.json",
    "images/game/obj_star.png",      "images/game/obj_star.json",
    "images/game/obj_spikes.png",    "images/game/obj_spikes.json",
    "images/game/obj_spider.png",    "images/game/obj_spider.json",
    "images/game/obj_sp.png",        "images/game/obj_sp.json",
    "images/game/obj_sock.png",      "images/game/obj_sock.json",
    "images/game/obj_pump.png",      "images/game/obj_pump.json",
    "images/game/obj_lighter.png",   "images/game/obj_lighter.json",
    "images/game/obj_lantern.png",   "images/game/obj_lantern.json",
    "images/game/obj_hook.png",      "images/game/obj_hook.json",
    "images/game/obj_gravity.png",   "images/game/obj_gravity.json",
    "images/game/obj_ghost.png",     "images/game/obj_ghost.json",
    "images/game/obj_gap.png",       "images/game/obj_gap.json",
    "images/game/obj_electro.png",   "images/game/obj_electro.json",
    "images/game/obj_candy4.png",    "images/game/obj_candy4.json",
    "images/game/obj_candy3.png",    "images/game/obj_candy3.json",
    "images/game/obj_candy2.png",    "images/game/obj_candy2.json",
    "images/game/obj_candy1.png",    "images/game/obj_candy1.json",
    "images/game/obj_candy0.png",    "images/game/obj_candy0.json",
    "images/game/obj_bubble.png",    "images/game/obj_bubble.json",
    "images/game/obj_bouncer.png",   "images/game/obj_bouncer.json",
    "images/game/obj_blades.png",    "images/game/obj_blades.json",
    "images/game/obj_bee.png",       "images/game/obj_bee.json",
    "images/game/char3.png",         "images/game/char3.json",
    "images/game/char2.png",         "images/game/char2.json",
    "images/game/char1.png",         "images/game/char1.json"
  ];

  Loader.rO = [];

  // Loader.KP — per-asset MAX SCALE for the {resolution} substitution.
  //             `1` means only a 1x exists; `2` means a 2x is on disk.
  //             Index matches Loader.Ce positionally.
  Loader.KP = [
    1, 1, 1, 1, 1, 2, 2, 1, 1, 1,   //  0..9
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   // 10..19
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   // 20..29
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   // 30..39
    1, 1, 2, 2, 2, 2, 1, 1, 1, 1,   // 40..49
    1, 1, 1, 1, 1, 1, 1, 2, 2, 1,   // 50..59
    1, 2, 2, 2, 2, 2, 2, 2, 2, 2,   // 60..69
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2,   // 70..79
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2,   // 80..89
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2,   // 90..99
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2,   //100..109
    2, 2, 2, 1, 1, 1, 1, 1, 1, 1,   //110..119
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   //120..129
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   //130..139
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   //140..149
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   //150..159
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   //160..169
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   //170..179
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   //180..189
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   //190..199
    1, 1, 1                          //200..202
  ];

  // --- Named Loader ids -----------------------------------------------
  // Aliases for specific entries in Loader.Ce — scenes pass these to
  // `Loader.ob/get/yb/etc.` instead of bare numbers. Keep in sync if
  // Loader.Ce order changes.
  Loader.outroPortraitVid = 0;   // outro_portrait.mp4
  Loader.outroLandscapeVid = 1;   // outro_landscape.mp4
  Loader.introPortraitVid = 2;   // intro_portrait.mp4
  Loader.introLandscapeVid = 3;   // intro_landscape.mp4
  Loader.strings = 4;   // strings.json
  Loader.picThumbs = 5;   // pics/thumbs
  Loader.picThumbsJson = 6;   // pics/thumbs.json
  Loader.picMissing = 28;  // pics/missing
  Loader.picsBgXmas = 29;  // pics/bg_xmas
  Loader.picsBg = 30;  // pics/bg
  Loader.menuUi = 31;  // menu/ui
  Loader.menuUiJson = 32;  // menu/ui.json
  Loader.menuShadow = 33;  // menu/shadow
  Loader.menuSeasons = 34;  // menu/seasons
  Loader.menuSeasonsJson = 35;
  Loader.menuSeason3 = 36;  // menu/season3
  Loader.menuSeason3Json = 37;
  Loader.menuSeason2 = 38;  // menu/season2
  Loader.menuSeason2Json = 39;
  Loader.menuSeason1 = 40;  // menu/season1
  Loader.menuSeason1Json = 41;
  Loader.menuSalute = 42;  // menu/salute
  Loader.menuSaluteJson = 43;
  Loader.menuCut = 44;
  Loader.menuCutJson = 45;
  Loader.menuBgXmas = 46;  // menu/cut
  Loader.menuBg2Xmas = 47;
  Loader.menuBg2 = 48;  // menu/bg_xmas
  Loader.menuBg = 49;  // menu/bg2_xmas
  Loader.loaderBg = 50;  // menu/bg2 / loader_bg.jpg
  Loader.loaderImg = 51;  // loader.png
  Loader.fontImg = 53;  // font (language-keyed)
  Loader.fontDat = 54;
  Loader.gameTut = 55;  // game/tut
  Loader.gameTutJson = 56;
  Loader.objVinyl = 57;  // obj_vinyl
  Loader.objVinylJson = 58;
  Loader.objTransporter = 59;  // obj_transporter
  Loader.objTransporterJson = 60;
  Loader.objSteam = 61;  // obj_steam
  Loader.objSteamJson = 62;
  Loader.objStar = 63;  // obj_star
  Loader.objStarJson = 64;
  Loader.objSpikes = 65;  // obj_spikes
  Loader.objSpikesJson = 66;
  Loader.objSpider = 67;  // obj_spider
  Loader.objSpiderJson = 68;
  Loader.objSp = 69;  // obj_sp
  Loader.objSpJson = 70;
  Loader.objSock = 71;  // obj_sock
  Loader.objSockJson = 72;
  Loader.objPump = 73;  // obj_pump
  Loader.objPumpJson = 74;
  Loader.objLighter = 75;  // obj_lighter
  Loader.objLighterJson = 76;
  Loader.objLantern = 77;  // obj_lantern
  Loader.objLanternJson = 78;
  Loader.objHook = 79;  // obj_hook
  Loader.objHookJson = 80;
  Loader.objGravity = 81;  // obj_gravity
  Loader.objGravityJson = 82;
  Loader.objGhost = 83;  // obj_ghost
  Loader.objGhostJson = 84;
  Loader.objGap = 85;  // obj_gap
  Loader.objGapJson = 86;
  Loader.objElectro = 87;  // obj_electro
  Loader.objElectroJson = 88;
  Loader.objBubble = 99;  // obj_candy0
  Loader.objBubbleJson = 100;
  Loader.objBouncer = 101; // obj_bubble
  Loader.objBouncerJson = 102;
  Loader.objBlades = 103; // obj_bouncer
  Loader.objBladesJson = 104;
  Loader.objBee = 105; // obj_blades
  Loader.objBeeJson = 106;
  Loader.char3 = 107; // obj_bee
  Loader.char3Json = 108;
  Loader.char2 = 109; // char3
  Loader.char2Json = 110;
  Loader.char1 = 111; // char2
  Loader.char1Json = 112;
  Loader.box8Earth = 160; // (one of the boxNN entries)
  Loader.menuMusicXmas = 199; // audio/menu_music_xmas.ogg
  Loader.menuMusic = 200; // audio/menu_music.ogg
  Loader.gameMusicXmas = 201; // audio/game_music_xmas.ogg
  Loader.gameMusic = 202; // audio/game_music.ogg

  Audio.events = new EventEmitter();
  WebAudioInstance.MA = true;
  // initial powerup count
  AdPowerupButtonA.Mf = Infinity;
  AdPowerupButtonB.Mf = Infinity;

  // per-bit set-mask lookup (1<<n - 1, with -1 for the all-bits case)
  BitMaskTable.zG = [
    0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191,
    16383, 32767, 65535, 131071, 262143, 524287, 1048575, 2097151,
    4194303, 8388607, 16777215, 33554431, 67108863, 134217727,
    268435455, 536870911, 1073741823, 2147483647, -1
  ];
