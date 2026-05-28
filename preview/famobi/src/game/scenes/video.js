  // VideoScene - DOM-overlay video player. Hides the WebGL canvas,
  // attaches a <video> element sized to the viewport, and listens for
  // tap-to-unmute (iOS / Safari force the video to start muted because
  // it's autoplayed). uo = "needs forced mute on start" (iOS Safari).
  // Subclasses (IntroVideoScene, OutroVideoScene) supply the data and
  // override onVideoEnd() with the post-video action.
  class VideoScene extends Scene {
    constructor() {
      super();
      this.forceMute = new EReg("(iPad|iPhone)", "g").match(host.navigator.platform);
      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        this.forceMute = true;
      }
    }
    getTransitionDuration() {
      return 0;
    }
    start() {
      super.start();
      this.app.window.canvas.style.visibility = "hidden";
      this.app.audio.setMusicVolume(0);
      // wrapper element so the <video> can centre with flex.
      this.wrapperEl = window.document.createElement("div");
      this.wrapperEl.style.display = "flex";
      this.wrapperEl.style.position = "fixed";
      this.wrapperEl.style.left = "0px";
      this.wrapperEl.style.top = "0px";
      this.wrapperEl.style.width = "100%";
      this.wrapperEl.style.height = "100%";
      this.wrapperEl.style.justifyContent = "center";
      this.wrapperEl.style.alignItems = "center";
      window.document.body.appendChild(this.wrapperEl);
      try {
        this.video = window.document.createElement("video");
        this.wrapperEl.appendChild(this.video);
        this.video.muted = this.shouldStartMuted();
        this.video.autoplay = true;
        this.video.controls = false;
        // transparent gif placeholder so the poster image doesn't
        // flash a default thumbnail before playback starts.
        this.video.poster = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        this.video.playsInline = true;
        this.video.addEventListener("ended", cachedBind(this, this.ended));
        this.video.addEventListener("mousedown", cachedBind(this, this.onClick));
        this.video.addEventListener("touchend", cachedBind(this, this.onTap));
        // ds = "is downloaded asset" - in that case the video data
        // lives in the loader cache; convert to a blob URL. Otherwise
        // fall through to Loader.getUrl() for a direct URL.
        this.url = WebApplication.assetsDownloaded ? URL.createObjectURL(this.getData()) : Loader.getUrl(this.getPreloads()[0]);
        this.video.src = this.url;
        this.video.style.width = "100%";
        this.video.style.height = "100%";
        this.video.style.bottom = "0";
        this.video.style.left = "0";
        this.video.style.objectFit = "contain";
        this.video.style.background = "black";
      } catch (_) {
        this.ended();
      }
      // window focus / blur callbacks: unmute on focus return,
      // re-mute when the tab loses focus (so background tabs don't
      // bleed audio).
      let self = this;
      this.focusListener = this.app.window.addListener(1, function () {
        try {
          if (!self.musicMuted()) {
            self.video.muted = false;
          }
        } catch (_) {}
      });
      this.blurListener = this.app.window.addListener(2, function () {
        try {
          self.video.muted = true;
        } catch (_) {}
      });
    }
    onStop() {
      super.onStop();
      this.blurListener();
      this.focusListener();
    }
    onClick() {
      if (!this.musicMuted()) this.video.muted = false;
    }
    onTap() {
      if (!this.musicMuted()) this.video.muted = false;
    }
    ended() {
      this.wrapperEl.removeChild(this.video);
      window.document.body.removeChild(this.wrapperEl);
      this.app.window.canvas.style.visibility = "";
      this.video.removeEventListener("ended", cachedBind(this, this.ended));
      this.video.removeEventListener("mousedown", cachedBind(this, this.onClick));
      this.video.removeEventListener("touchend", cachedBind(this, this.onTap));
      URL.revokeObjectURL(this.url);
      this.onVideoEnd();
    }
    musicMuted() {
      return Save.musicOn == 0;
    }
    // Qv - "should start muted?". Always true on iOS Safari; otherwise
    // mirrors the user's current music-mute setting.
    shouldStartMuted() {
      if (this.forceMute) return true;
      return this.musicMuted();
    }
    getName() {
      return "VideoScene";
    }
  }
  VideoScene.i = true;
  VideoScene.s = Scene;
  Object.assign(VideoScene.prototype, {
    l: VideoScene
  });

  // IntroVideoScene - intentionally a no-op skin in the public build:
  // the intro mp4s are not shipped, so we shortcut straight to the
  // first level instead of producing a 404 video element.
  class IntroVideoScene extends VideoScene {
    constructor() {
      super();
    }
    getPreloads() {
      // The intro video assets (res/video/intro_*.mp4) are not shipped
      // with the public game build, so we don't preload anything here.
      return [];
    }
    getData() {
      return null;
    }
    start() {
      // Skip the cinematic intro entirely - schedule the post-video
      // transition immediately. We deliberately don't call super.start()
      // because it would build a `<video>` element pointing at a 404.
      let self = this;
      setTimeout(function () { self.onVideoEnd(); }, 0);
    }
    onStop() {
      // VideoScene.onStop() tears down event listeners we never registered,
      // so override with a no-op to avoid touching `this.kT` / `this.lT`.
    }
    onVideoEnd() {
      LevelState.setSeason(1);
      LevelState.setBox(1);
      LevelState.setLevel(1);
      this.goToNextScene();
    }
    goToNextScene() {
      this.push(LevelScene);
    }
    init() {
      super.init();
      this.stopAllMusic();
    }
    start() {
      super.start();
      this.app.preloadAssets(LevelScene);
    }
    getName() {
      return "IntroVideoScene";
    }
  }
  IntroVideoScene.i = true;
  IntroVideoScene.s = VideoScene;
  Object.assign(IntroVideoScene.prototype, {
    l: IntroVideoScene
  });

  // CTRCIntroVideoScene - portal variant. TP/jT are SDK callbacks
  // (T = "track"; the SDK requests these on ad-show / ad-hide). gk
  // funnels through SDK.trackLevelStart before pushing the level.
  // The audioDisabled global propagates the portal's mute override
  // into the mute checks.
  class CTRCIntroVideoScene extends IntroVideoScene {
    constructor() {
      super();
    }
    onDisableAudio() {
      try { this.video.muted = true } catch (_) {}
    }
    onEnableAudio() {
      try {
        if (!this.musicMuted()) this.video.muted = false;
      } catch (_) {}
    }
    goToNextScene() {
      let self = this;
      let target = CTRCLevelScene;
      SDK.trackLevelStart(currentLevelId(), function () {
        self.push(target);
      });
    }
    shouldStartMuted() {
      if (super.shouldStartMuted()) return true;
      return audioDisabled;
    }
    musicMuted() {
      if (super.musicMuted()) return true;
      return audioDisabled;
    }
    getName() {
      return "CTRCIntroVideoScene";
    }
  }
  CTRCIntroVideoScene.i = true;
  CTRCIntroVideoScene.s = IntroVideoScene;
  Object.assign(CTRCIntroVideoScene.prototype, {
    l: CTRCIntroVideoScene
  });

  // OutroVideoScene - end-of-game cinematic. Picks landscape vs
  // portrait based on the viewport aspect ratio. onVideoEnd() pops back to
  // whoever pushed this scene (the cleared-overlay) instead of
  // navigating forward.
  class OutroVideoScene extends VideoScene {
    constructor() {
      super();
    }
    replacesPrevious() {
      return false;
    }
    getData() {
      let portrait = Loader.data.map[Loader.outroPortraitVid];
      return portrait ?? Loader.data.map[Loader.outroLandscapeVid];
    }
    getPreloads() {
      return [this.app.window.aspectRatio() > 1 ? Loader.outroLandscapeVid : Loader.outroPortraitVid];
    }
    onVideoEnd() {
      this.pop();
    }
    getName() {
      return "OutroVideoScene";
    }
  }
  OutroVideoScene.i = true;
  OutroVideoScene.s = VideoScene;
  Object.assign(OutroVideoScene.prototype, {
    l: OutroVideoScene
  });
