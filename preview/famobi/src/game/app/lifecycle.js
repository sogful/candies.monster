  class Application {
    constructor() {
      this.tampered = null;
      this.postFrameCallbacks = [];
      this.scenes = [];
      this.releasedImages = [];
      this.images = new HashMap();
      this.bootCallback = null;
      this.fps = new FpsMeter();
      this.save = null;
      this.scriptLoader = new ScriptLoader();
      this.director = null;
      this.audio = new NullAudioMixer();
      this.window = this.renderer = null;
      this.timestep = new FixedTimestep();
      this.mainLoop = new MainLoop();
      Application.instance = this;
    }
    init(a, b) {
      this.config = a;
      this.bootCallback = b;
      host.console.info("%c" + a.title.toUpperCase() + " %c" + Build.BUILD_STAMP, "font-weight:bold;", null);
      if (a.allowZoom) {
        window.addEventListener("error", cachedBind(this, this.onCrash));
        window.addEventListener("unhandledrejection", cachedBind(this, this.onCrash));
      }
      this.isMobile = this.detectMobile();
      this.isWebOS = window.navigator.userAgent.indexOf("Web0S") != -1;
      Loader.setMaxResolution(a.pixelRatio);
      a.language = Loader.setLanguage(a.language);
      this.mainLoop.tick = cachedBind(this, this.tickFrame);
      this.window = new Viewport(a.Cu);
      if (a.useWebGL && this.window.install(a.glOptions)) {
        this.renderer = new WebGLRenderer();
      }
      if (this.renderer == null) {
        this.window.initContext(a.glOptions);
        this.renderer = new CanvasRenderer();
        a.useWebGL = false;
      }
      if (this.renderer != null) {
        this.renderer.attachWindow(this.window);
        this.window.addListener(2, cachedBind(this, this.audioOnBlur));
        this.window.addListener(1, cachedBind(this, this.audioOnFocus));
        this.window.update();
        this.bootSetup();
        this.scriptLoader.version = Build.VERSION.toString();
        this.scriptLoader.maxConcurrent = a.maxConcurrent;
        this.director = new SceneDirector(this);
        this.showBadge();
        this.save = this.createSave();
        var c = this;
        this.testAvif().then(function (d) {
          if (d) {
            Loader.selectImageFormat();
          }
        }).then(function () {
          c.preload();
        });
      }
    }
    isWebView() {
      let a = window.navigator.userAgent.toLowerCase();
      return new EReg("(WebView|(iPhone|iPod|iPad)(?!.*Safari)|Android.*(;wv)|Linux; U; Android)", "ig").match(a);
    }
    preload() {
      function a(f, g, h) {
        let m = b.createImageLoader();
        m.name = Loader.getUrl(f);
        if (b.images.map.hasOwnProperty(f)) {
          b.releasedImages.push(b.images.map[f]);
        }
        b.images.map[f] = m;
        m.load(g, function () {
          if (Loader.filterImageRes().includes(f)) {
            let n = new FileReader();
            n.onload = function (q) {
              Loader.setMetadata(f, new DataReader(q.target.result));
              h(m.data);
            };
            n.onerror = function () {
              throw 2;
            };
            n.readAsArrayBuffer(g);
          } else {
            h(m.data);
          }
        });
      }
      let b = this;
      for (var c = 0; c < Loader.MAX;) {
        var d = c++;
        if (Loader.isImageResource(d)) {
          Loader.setDecoder(d, a);
        }
      }
      if (Loader.filterLanguageRes().length > 0) {
        this.load(Loader.filterLanguageRes(), null, cachedBind(this, this.startLoop));
      } else {
        this.startLoop();
      }
      if (this.config.fullscreen) {
        let f = window.document.querySelectorAll("meta[data-hash]").item(0).dataset.hash;
        c = window.document.querySelectorAll("script[src]");
        d = null;
        let g = 0;
        let h = c.length;
        while (g < h && (d = c.item(g++), !new EReg(this.config.title, "i").match(d.src)));
        if (d != null) {
          var e = new XMLHttpRequest();
          e.open("GET", d.src);
          e.responseType = "arraybuffer";
          e.onreadystatechange = function () {
            if (e.readyState == 4 && e.status == 200) {
              try {
                window.crypto.subtle.digest("SHA-256", e.response).then(function (m) {
                  m = btoa(String.fromCharCode.apply(null, new Uint8Array(m)));
                  b.tampered = m != f;
                }).catch(function () {});
              } catch (m) {}
            }
          };
          e.send();
        }
      }
    }
    startLoop() {
      let a = this;
      DelayedCall.delay(function () {
        a.mainLoop.start();
        a.bootCallback(a);
      }, 1);
    }
    preloadAssets(a) {
      a = Object.create(a.prototype);
      a.app = this;
      a.caller = a;
      return this.load(a.getPreloads(), null, undefined);
    }
    load(a, b, c) {
      let d = [];
      let e = [];
      let f = 0;
      let g = 0;
      while (g < a.length) {
        var h = a[g];
        ++g;
        if (!Loader.isAudioResource(h) || Loader.audioFormats() != null && Loader.getAudioExt() != null) {
          f += 1;
          Loader.onceLoaded(h, function (m) {
            --f;
            if (b != null) {
              b(m);
            }
            if (c != null && f == 0) {
              c();
            }
          });
          h = Loader.getUrl(h);
          if (this.scriptLoader.load(h)) {
            e.push(h);
          }
        }
      }
      while (d.length > 0) {
        this.scriptLoader.reprioritize(d.pop());
      }
      return new LoadProgress(this.scriptLoader, e);
    }
    getImage(a) {
      return this.images.map[a];
    }
    createImageLoader() {
      return new ImageLoader(this.config.crossOrigin, this.config.useWebGL);
    }
    freeTexture(a) {
      this.getImage(a).dispose();
      this.images.remove(a);
      Loader.purge(a);
    }
    freeReleasedImages() {
      let a = 0;
      let b = this.releasedImages;
      while (a < b.length) {
        b[a++].dispose();
      }
      this.releasedImages = [];
    }
    createTexture(a, b, c) {
      function d(n) {
        if (n.bytes[0] == 84 && n.bytes[1] == 80 && n.bytes[2] == 83) {
          n = new SheetParser().parseBinary(n);
          return new FrameCollection(SheetConvert.flatten(n), n.meta.scale);
        }
        if (n.bytes[0] == 66 && n.bytes[1] == 77 && n.bytes[2] == 70) {
          n = new BMFontParser().readBytes(n);
          return new FrameCollection(BMFontConvert.flatten(n), 1, BMFontConvert.buildAtlas(n));
        }
        throw 3;
      }
      if (c == null) {
        c = false;
      }
      if (b == null) {
        b = 0;
      }
      var e = Loader.getUrl(a);
      for (var f = 0, g = this.renderer.listTextures(); f < g.length;) {
        var h = g[f];
        ++f;
        if (h.name == e) {
          return h;
        }
      }
      f = this.getImage(a);
      g = Loader.getMetadata(a);
      let m = null;
      if (g == null) {
        h = Loader.idForExt(a, "dat");
        if (h != -1) {
          g = new DataReader(Loader.data.map[h]);
          if (g.data == null) {
            g = null;
          }
        } else {
          h = Loader.idForExt(a, "dat", true);
          if (h != -1) {
            g = new DataReader(Loader.data.map[h]);
          }
        }
      }
      if (g == null) {
        h = Loader.idForExt(a, "tps");
        if (h != -1) {
          try {
            m = d(Loader.getBytes(h));
          } catch (n) {}
        }
        if (m == null) {
          h = Loader.idForExt(a, "json");
          if (h != -1) {
            h = Loader.getText(h);
            h = new SheetParser().parseJson(h);
            m = new FrameCollection(SheetConvert.flatten(h), h.meta.scale);
          }
        }
        if (m == null) {
          h = Loader.idForExt(a, "dat");
          if (h != -1) {
            h = Loader.getBytes(h);
            h = new SheetParser().parseBinary(h);
            m = new FrameCollection(SheetConvert.flatten(h), h.meta.scale);
          }
        }
        if (m == null) {
          h = Loader.idForExt(a, "fnt");
          if (h != -1) {
            h = Loader.getBytes(h);
            h = new BMFontParser().readBytes(h);
            m = new FrameCollection(BMFontConvert.flatten(h), 1, BMFontConvert.buildAtlas(h));
          }
        }
      }
      h = null;
      if (g == null) {
        h = this.renderer.createTexture(f, b, m, e);
      } else {
        g = g.entries;
        if (g.length == 1 || Lambda.exists(g, function (n) {
          return n.name != null;
        })) {
          h = this.renderer.createTexture(f, b, d(g[0].data), e);
          b = 1;
          e = g.length;
          while (b < e) {
            f = b++;
            this.renderer.addTextureFrame(h, d(g[f].data), g[f].name);
          }
        } else {
          h = this.renderer.createTexture(f, b, null, e);
          b = 0;
          e = g.length;
          while (b < e) {
            this.renderer.addTextureFrame(h, d(g[b++].data), null);
          }
        }
      }
      if (c) {
        h.scale = 1 / Loader.getResolutionLevel(a);
      }
      return h;
    }
    tickFrame(a) {
      this.window.update();
      if (this.config.fixedTimestep) {
        let b = this.timestep;
        let c = cachedBind(this, this.update);
        b.elapsedTime += a;
        b.accum += a * b.scale;
        if (b.accum > 0.25) {
          b.accum = 0.25;
        }
        while (b.accum >= FixedTimestep.STEP) {
          c(FixedTimestep.STEP);
          b.accum -= FixedTimestep.STEP;
        }
        this.render(b.accum / FixedTimestep.STEP);
      } else {
        this.update(a);
        this.render(1);
      }
      for (this.fps.update(a); this.postFrameCallbacks.length > 0;) {
        this.postFrameCallbacks.pop()();
      }
    }
    update(a) {
      let b = 0;
      let c = this.scenes;
      while (b < c.length) {
        let d = c[b];
        ++b;
        if (d != null) {
          d.state.update(a);
        }
      }
      this.renderer.beginFrame();
      this.renderer.resetViewport();
      this.gameLoop();
      this.director.update(a);
      this.renderer.endFrame();
    }
    render(a) {
      if (this.renderer.beginFrame()) {
        this.renderer.resetViewport();
        this.renderer.clear();
        this.director.render(a);
        this.renderer.resetViewport();
        this.renderer.endFrame();
      }
    }
    gameLoop() {
      if (this.config.useCanvas) {
        var a = this.window;
        a = a.canvasSize.x / a.canvasSize.y;
        var b = this.window.canvasSize;
        var c = b.x;
        b = b.y;
        if (a > 2.5) {
          a = b / c * 2.5;
          c = (1 - a) / 2;
          this.renderer.setViewport(c, 0, c + a, 1);
        } else if (a < 0.4) {
          a = c / b / 0.4;
          c = (1 - a) / 2;
          this.renderer.setViewport(0, c, 1, c + a);
        }
      }
    }
    bootSetup() {
      if (this.config.audio && Audio.isSupported()) {
        if (this.audio != null && this.audio instanceof WebAudioMixer) {
          var a = this.audio.Yg;
          var b = this.audio.names;
          this.audio.free();
          Audio.init();
          this.audio = new WebAudioMixer();
          this.audio.Yg = a;
          this.audio.names = b;
        } else {
          a = this.config.bootCallback;
          var c = a ?? Audio.bestFormat();
          if (Lambda.exists(Loader.audioFormats(), function (f) {
            return f == c;
          })) {
            Loader.setAudioExt(c);
          }
          b = Loader.allUrls();
          a = [];
          for (var d = 0; d < b.length;) {
            let f = b[d];
            ++d;
            if (new EReg("audio", "").match(f)) {
              a.push(f);
            }
          }
          if (a.length != 0) {
            Audio.init();
            if (Audio.isSupported()) {
              this.audio = new WebAudioMixer();
            }
            var e = this;
            // Music tracks go through the normal `ls()` path (one file =
            // one buffer). The legacy SPR sprite branch is gone: SFX now
            // live as individual files under assets/audio/sfx/, loaded by
            // `loadSfxBundle()` after music registration completes.
            b = function (f, g, h) {
              e.audio.loadSample(f, g, Loader.isMusic(f), h);
            };
            for (d = 0; d < a.length;) {
              Loader.setDecoder(Loader.idByName(a[d++]), b);
            }
            this.loadSfxBundle();
          }
        }
      }
    }
    loadSfxBundle() {
      // SFX used to be packed into a single SPR-headered sound.ogg sprite
      // and sliced by the mixer's `ms()`. Now each SFX is a standalone
      // .ogg under assets/audio/sfx/, with a manifest.json giving the
      // (id, name) mapping so we can register each by its numeric id
      // (1001..1064) - those ids match the SoundFx.* constants in
      // statics.js, so callers like `SoundFx.play(SoundFx.button)` keep
      // working without changes.
      var mixer = this.audio;
      if (mixer == null) return;
      fetch("assets/audio/sfx/manifest.json").then(function (Resources) { return Resources.json(); }).then(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          (function (entry) {
            fetch("assets/audio/sfx/" + entry.name + ".ogg")
              .then(function (Resources) { return Resources.arrayBuffer(); })
              .then(function (buf) {
                mixer.names[entry.id] = entry.name;
                mixer.loadSample(entry.id, buf, false, function () {});
              });
          })(entries[i]);
        }
      });
    }
    createSave() {
      return new NullSave();
    }
    getScene(a) {
      return this.scenes[a];
    }
    registerScene(a) {
      return this.scenes[a.typeId()] = a;
    }
    mouseDevice() {
      let a = this.getScene(1);
      return a ?? this.registerScene(new MouseInputDevice(this.window.canvas));
    }
    mouseState() {
      return this.mouseDevice().state;
    }
    keyboardDevice() {
      let a = this.getScene(0);
      return a ?? this.registerScene(new KeyboardInputDevice());
    }
    keyboard() {
      return this.keyboardDevice().state;
    }
    touchDevice() {
      let a = this.getScene(3);
      return a ?? this.registerScene(new TouchInputDevice(this.window.canvas));
    }
    pointer() {
      return this.touchDevice().state;
    }
    createStorage(a) {
      return new LocalStorageStore(a);
    }
    showBadge() {
      // was a 10s bottom-left version badge. kept the no-op so the caller
      // chain stays the same.
    }
    audioOnFocus() {
      this.audio.setMasterVolume(1, 0);
    }
    audioOnBlur() {
      this.audio.setMasterVolume(0, 0);
    }
    detectMobile() {
      try {
        return navigator.userAgentData.mobile;
      } catch (a) {
        if (new EReg("Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini", "i").match(host.navigator.userAgent) || typeof window.orientation !== "undefined" || "onTouchstart" in window || navigator.maxTouchPoints > 0) {
          return true;
        } else {
          return window.matchMedia("(any-pointer:coarse)").matches;
        }
      }
    }
    reload() {
      window.location.reload();
    }
    testAvif() {
      if (this.config.testAvif) {
        return new Promise(function (a) {
          let b = new Image();
          b.onerror = function () {
            b.onload = null;
            b.onerror = null;
            a(false);
          };
          b.onload = function () {
            b.onload = null;
            b.onerror = null;
            a(true);
          };
          b.src = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=";
        });
      } else {
        return Promise.resolve(false);
      }
    }
    browserLanguage() {
      return host.navigator.language;
    }
    onCrash(a) {
      if (a.type != "unhandledrejection" && (a != null ? a.error : null) != null && a.error.stack != null) {
        Numeric.toStr(a.error.stack);
      }
      if (this.mainLoop != null) {
        this.mainLoop.stop();
      }
      host.console.log("" + this.config.title + " CRASHED 💀");
      window.removeEventListener("error", cachedBind(this, this.onCrash));
      window.removeEventListener("unhandledrejection", cachedBind(this, this.onCrash));
    }
  }
  Application.i = true;
  Object.assign(Application.prototype, {
    l: Application
  });
  class WebApplication extends Application {
    constructor(a) {
      super();
      this.init(new AppConfig("Ctrr", true, a ?? "en", null, null, null, null, {
        alpha: false,
        depth: false,
        antialias: true,
        stencil: true
      }, false, null, true, null, null, null, null, false, null, null, null, null, false, null), cachedBind(this, this.tick));
    }
    onCrash(a) {
      super.onCrash(a);
      if (this.isWebOS) {
        this.reload();
      }
    }
    getNavigatorLanguage() {
      return host.navigator.language;
    }
    createSave() {
      return new Save(this.createStorage(this.config.title));
    }
    preload() {
      super.preload();
      WebApplication.assetsDownloaded = !this.isWebView() && !this.isWebOS;
      if (this.isWebOS) {
        Loader.setMaxResolution(1);
      } else if (this.isMobile && this.window.pixelRatio() <= 2 && this.window.canvasSize.x < 1000) {
        Loader.setMaxResolution(1);
      } else {
        Loader.setMaxResolution(2);
      }
    }
    pickResolution() {
      if (this.isWebOS) {
        if (this.window.canvasSize.x > 5000) {
          return 4;
        } else if (this.window.canvasSize.x > 3000) {
          return 2;
        } else {
          return 1;
        }
      } else if (this.isMobile && this.window.pixelRatio() > 2) {
        return 2;
      } else {
        return 1;
      }
    }
    tick() {
      window.document.body.addEventListener("touchcancel", function (b) {
        b.preventDefault();
      }, {
        passive: false
      });
      window.document.body.addEventListener("touchend", function (b) {
        b.preventDefault();
      }, {
        passive: false
      });
      window.document.body.addEventListener("touchstart", function (b) {
        b.preventDefault();
      }, {
        passive: false
      });
      this.renderer.setClearColor(new Vec4(0, 0, 0, 1));
      FixedTimestep.STEP = 0.016;
      this.renderer.disableDepthTest();
      this.window.setResolution(this.pickResolution());
      this.touchDevice().setMaxTouches(5);
      if (this.config.useWebGL) {
        this.renderer.registerProgram(new GLTiledTextureProgram());
        this.renderer.registerProgram(new GLTextureProgram());
        this.renderer.registerProgram(new GLSolidColorProgram());
        this.renderer.registerProgram(new GLClearProgram());
        this.renderer.registerProgram(new GLMultiLineProgram());
        this.renderer.registerProgram(new GLGradientLineProgram());
        this.renderer.registerProgram(new GLDashedCircleProgram());
        this.renderer.registerProgram(new GLCircleStrokeProgram());
      } else {
        this.renderer.registerProgram(new RepeatPatternDraw());
        this.renderer.registerProgram(new CanvasTextRenderer());
        this.renderer.registerProgram(new CanvasSolidColorRenderer());
        this.renderer.registerProgram(new CanvasClearRenderer());
        this.renderer.registerProgram(new CanvasPathRenderer());
        this.renderer.registerProgram(new CanvasMultiLineRenderer());
        this.renderer.registerProgram(new CanvasGradientLineRenderer());
        this.renderer.registerProgram(new CanvasDashedCircleRenderer());
        this.renderer.registerProgram(new CanvasCircleStrokeRenderer());
      }
      WebApplication.menuMusicId = WebApplication.xmasMode ? Loader.menuMusicXmas : Loader.menuMusic;
      WebApplication.gameMusicId = WebApplication.xmasMode ? Loader.gameMusicXmas : Loader.gameMusic;
      let a = this;
      this.save.load(function () {
        if (Save.language == null && (Save.setLanguage(a.config.language), a.isWebOS)) {
          let b = Std.substr(a.getNavigatorLanguage().toLowerCase(), 0, 2);
          if (new EReg("(" + LANGUAGES.join("|") + ")", "").match(b)) {
            Save.setLanguage(b);
          }
        }
        a.setLanguage(Save.language);
        a.startMainScene();
      });
    }
    setLanguage(a) {
      Loader.setLanguage(a);
    }
    startMainScene() {
      this.director.sharedState.sceneToLoad = MenuScene;
      Audio.addListener("EContextBroken", cachedBind(this, this.onAudioContextBroken));
      this.currentMusicId = -1;
      let a = this;
      Audio.addListener("EContextResumed", function () {
        if (!a.audio.isPlaying(a.currentMusicId)) {
          a.audio.play(a.currentMusicId, true, true);
        }
      });
      this.director.push(LoadingScene);
    }
  }
  WebApplication.i = true;
  WebApplication.s = Application;
  Object.assign(WebApplication.prototype, {
    l: WebApplication
  });
  class SDKApplication extends WebApplication {
    constructor(a) {
      super(a);
      WebApplication.externalPause = SDK.hasFeature("external_pause") == 0;
      WebApplication.externalMute = SDK.hasFeature("external_mute") == 0;
      WebApplication.xmasMode = SDK.hasFeature("xmas") == 1;
      WebApplication.magnetEnabled = SDK.hasFeature("rewarded");
      WebApplication.telekinesisEnabled = SDK.hasFeature("rewarded");
    }
    createSave() {
      let a = new Save(new PortalLocalStorage(Application.instance.config.title));
      if (SDK.hasFeature("force_english")) {
        Save.setLanguage("en");
      }
      return a;
    }
    tick(a) {
      this.updateInsets();
      SDK.onInsetsChange(cachedBind(this, this.updateInsets));
      let b = this;
      SDK.onRequest("enableAudio", function () {
        audioDisabled = false;
        b.audio.setMasterVolume(1);
        try {
          let c = b.director;
          let d = c.findNode(CTRCIntroVideoScene, c);
          if (d != null) {
            d.onEnableAudio();
          }
        } catch (c) {}
      });
      SDK.onRequest("disableAudio", function () {
        audioDisabled = true;
        b.audio.setMasterVolume(0);
        try {
          let c = b.director;
          let d = c.findNode(CTRCIntroVideoScene, c);
          if (d != null) {
            d.onDisableAudio();
          }
        } catch (c) {}
      });
      SDK.onRequest("pauseGameplay", function () {
        gameplayPaused = true;
        b.touchDevice().enabled = false;
        b.mainLoop.stop();
      });
      SDK.onRequest("resumeGameplay", function () {
        gameplayPaused = false;
        b.touchDevice().enabled = true;
        b.pointer().reset();
        b.mainLoop.start();
      });
      SDK.setPauseRequestHandler(function () {
        SDK.adShowing = true;
        b.audio.setMasterVolume(0);
        b.touchDevice().enabled = false;
        b.mainLoop.stop();
      });
      SDK.setResumeRequestHandler(function () {
        SDK.adShowing = false;
        if (!audioDisabled) {
          b.audio.setMasterVolume(1);
        }
        if (!gameplayPaused) {
          b.touchDevice().enabled = true;
          b.pointer().reset();
          b.mainLoop.start();
        }
      });
      super.tick(a);
    }
    setLanguage(a) {
      if (SDK.hasFeature("force_english")) {
        Save.setLanguage("en");
        super.setLanguage("en");
      } else {
        super.setLanguage(a);
      }
    }
    startMainScene() {
      // preview bridge: skip the main menu and load straight into the level
      // scene when a custom level is parked on window.customleveldata.
      this.director.sharedState.sceneToLoad = window.customleveldata != null ? CTRCLevelScene : CTRCMenuScene;
      this.director.push(CTRCLoadingScene);
    }
    audioOnFocus() {
      if (!SDK.adShowing && !audioDisabled) {
        this.audio.setMasterVolume(SDK.getVolume());
      }
    }
    showBadge() {
      if (SDK.hasFeature("version")) {
        super.showBadge();
      }
    }
    updateInsets() {
      let a = SDK.getInsets();
      let b = this.window.canvas.style;
      b.top = "" + a.top + "px";
      b.left = "" + a.left + "px";
      b.width = "calc(100% - " + (a.right + a.left) + "px)";
      b.height = "calc(100% - " + (a.bottom + a.t) + "px)";
    }
  }
  SDKApplication.i = true;
  SDKApplication.s = WebApplication;
  Object.assign(SDKApplication.prototype, {
    l: SDKApplication
  });
  class Entry {
    static main(a) {
      new SDKApplication(a);
    }
  }
  globalScope.Ctrr.main = Entry.main;
  Entry.i = true;
  Math.i = true;
  class AppConfig {
    constructor(a, b, c, d, e, f, g, h, m, n, q, p, v, u, A, D, B, K, E, p18, p19, V) {
      this.allowZoom = false;
      this.useCanvas = true;
      this.disableMipmap = false;
      this.fixedTimestep = this.testAvif = this.audio = this.bootDelay = this.transition = this.crossOrigin = true;
      this.fullscreen = false;
      this.bootCallback = this.glOptions = null;
      this.maxConcurrent = 4;
      this.canvasId = null;
      this.pixelRatio = 1;
      this.language = "en";
      this.title = a;
      this.useWebGL = b;
      if (c != null) {
        this.language = c;
      }
      if (d != null) {
        this.pixelRatio = d;
      }
      if (e != null) {
        this.canvasId = e;
      }
      if (f != null) {
        this.maxConcurrent = f;
      }
      if (g != null) {
        this.bootCallback = g;
      }
      if (h != null) {
        this.glOptions = h;
      }
      if (m != null) {
        this.fullscreen = m;
      }
      if (n != null) {
        this.fixedTimestep = n;
      }
      if (q != null) {
        this.testAvif = q;
      }
      if (p != null) {
        this.audio = p;
      }
      if (v != null) {
        this.bootDelay = v;
      }
      if (u != null) {
        this.transition = u;
      }
      if (A != null) {
        this.crossOrigin = A;
      }
      if (E != null) {
        this.disableMipmap = E;
      }
      if (p19 != null) {
        this.useCanvas = p19;
      }
      if (V != null) {
        this.allowZoom = V;
      }
    }
  }
  AppConfig.i = true;
  Object.assign(AppConfig.prototype, {
    l: AppConfig
  });
