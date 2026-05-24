  class Application {
    constructor() {
      this.PS = null;
      this.LA = [];
      this.Jv = [];
      this.Jw = [];
      this.images = new HashMap();
      this.IC = null;
      this.rN = new FpsMeter();
      this.save = null;
      this.Fo = new ScriptLoader();
      this.fa = null;
      this.Sa = new NullAudioMixer();
      this.window = this.V = null;
      this.VS = new FixedTimestep();
      this.df = new MainLoop();
      Application.instance = this;
    }
    ib(a, b) {
      this.config = a;
      this.IC = b;
      host.console.info("%c" + a.title.toUpperCase() + " %c" + Build.FG, "font-weight:bold;", null);
      if (a.mB) {
        window.addEventListener("error", cachedBind(this, this.Ae));
        window.addEventListener("unhandledrejection", cachedBind(this, this.Ae));
      }
      this.Vj = this.SS();
      this.jd = window.navigator.userAgent.indexOf("Web0S") != -1;
      Loader.Ls(a.DB);
      a.language = Loader.Wi(a.language);
      this.df.Hg = cachedBind(this, this.DP);
      this.window = new Viewport(a.Cu);
      if (a.oo && this.window.yO(a.Hw)) {
        this.V = new WebGLRenderer();
      }
      if (this.V == null) {
        this.window.sO(a.Hw);
        this.V = new CanvasRenderer();
        a.oo = false;
      }
      if (this.V != null) {
        this.V.tp(this.window);
        this.window.addListener(2, cachedBind(this, this.dQ));
        this.window.addListener(1, cachedBind(this, this.QC));
        this.window.update();
        this.EB();
        this.Fo.version = Build.VERSION.toString();
        this.Fo.Wo = a.Wo;
        this.fa = new SceneDirector(this);
        this.vx();
        this.save = this.vv();
        var c = this;
        this.LS().then(function (d) {
          if (d) {
            Loader.RR();
          }
        }).then(function () {
          c.preload();
        });
      }
    }
    SB() {
      let a = window.navigator.userAgent.toLowerCase();
      return new EReg("(WebView|(iPhone|iPod|iPad)(?!.*Safari)|Android.*(;wv)|Linux; U; Android)", "ig").match(a);
    }
    preload() {
      function a(f, g, h) {
        let m = b.yM();
        m.name = Loader.ni(f);
        if (b.images.J.hasOwnProperty(f)) {
          b.Jw.push(b.images.J[f]);
        }
        b.images.J[f] = m;
        m.load(g, function () {
          if (Loader.GN().includes(f)) {
            let n = new FileReader();
            n.onload = function (q) {
              Loader.VR(f, new DataReader(q.target.result));
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
        if (Loader.JO(d)) {
          Loader.Cz(d, a);
        }
      }
      if (Loader.fB().length > 0) {
        this.load(Loader.fB(), null, cachedBind(this, this.MC));
      } else {
        this.MC();
      }
      if (this.config.FE) {
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
                  b.PS = m != f;
                }).catch(function () {});
              } catch (m) {}
            }
          };
          e.send();
        }
      }
    }
    MC() {
      let a = this;
      DelayedCall.delay(function () {
        a.df.start();
        a.IC(a);
      }, 1);
    }
    Xl(a) {
      a = Object.create(a.prototype);
      a.O = this;
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
        if (!Loader.Lv(h) || Loader.Xq() != null && Loader.OA() != null) {
          f += 1;
          Loader.aQ(h, function (m) {
            --f;
            if (b != null) {
              b(m);
            }
            if (c != null && f == 0) {
              c();
            }
          });
          h = Loader.ni(h);
          if (this.Fo.load(h)) {
            e.push(h);
          }
        }
      }
      while (d.length > 0) {
        this.Fo.$Q(d.pop());
      }
      return new LoadProgress(this.Fo, e);
    }
    $A(a) {
      return this.images.J[a];
    }
    yM() {
      return new ImageLoader(this.config.CB, this.config.oo);
    }
    NM(a) {
      this.$A(a).Px();
      this.images.remove(a);
      Loader.ps(a);
    }
    OM() {
      let a = 0;
      let b = this.Jw;
      while (a < b.length) {
        b[a++].Px();
      }
      this.Jw = [];
    }
    createTexture(a, b, c) {
      function d(n) {
        if (n.b[0] == 84 && n.b[1] == 80 && n.b[2] == 83) {
          n = new SheetParser().nD(n);
          return new FrameCollection(SheetConvert.Gl(n), n.em.scale);
        }
        if (n.b[0] == 66 && n.b[1] == 77 && n.b[2] == 70) {
          n = new BMFontParser().zm(n);
          return new FrameCollection(BMFontConvert.Gl(n), 1, BMFontConvert.SA(n));
        }
        throw 3;
      }
      if (c == null) {
        c = false;
      }
      if (b == null) {
        b = 0;
      }
      var e = Loader.ni(a);
      for (var f = 0, g = this.V.$N(); f < g.length;) {
        var h = g[f];
        ++f;
        if (h.name == e) {
          return h;
        }
      }
      f = this.$A(a);
      g = Loader.LN(a);
      let m = null;
      if (g == null) {
        h = Loader.Hl(a, "dat");
        if (h != -1) {
          g = new DataReader(Loader.data.J[h]);
          if (g.data == null) {
            g = null;
          }
        } else {
          h = Loader.Hl(a, "dat", true);
          if (h != -1) {
            g = new DataReader(Loader.data.J[h]);
          }
        }
      }
      if (g == null) {
        h = Loader.Hl(a, "tps");
        if (h != -1) {
          try {
            m = d(Loader.eo(h));
          } catch (n) {}
        }
        if (m == null) {
          h = Loader.Hl(a, "json");
          if (h != -1) {
            h = Loader.yb(h);
            h = new SheetParser().hR(h);
            m = new FrameCollection(SheetConvert.Gl(h), h.em.scale);
          }
        }
        if (m == null) {
          h = Loader.Hl(a, "dat");
          if (h != -1) {
            h = Loader.eo(h);
            h = new SheetParser().nD(h);
            m = new FrameCollection(SheetConvert.Gl(h), h.em.scale);
          }
        }
        if (m == null) {
          h = Loader.Hl(a, "fnt");
          if (h != -1) {
            h = Loader.eo(h);
            h = new BMFontParser().zm(h);
            m = new FrameCollection(BMFontConvert.Gl(h), 1, BMFontConvert.SA(h));
          }
        }
      }
      h = null;
      if (g == null) {
        h = this.V.createTexture(f, b, m, e);
      } else {
        g = g.oq;
        if (g.length == 1 || Lambda.Ej(g, function (n) {
          return n.name != null;
        })) {
          h = this.V.createTexture(f, b, d(g[0].data), e);
          b = 1;
          e = g.length;
          while (b < e) {
            f = b++;
            this.V.rA(h, d(g[f].data), g[f].name);
          }
        } else {
          h = this.V.createTexture(f, b, null, e);
          b = 0;
          e = g.length;
          while (b < e) {
            this.V.rA(h, d(g[b++].data), null);
          }
        }
      }
      if (c) {
        h.$e = 1 / Loader.HN(a);
      }
      return h;
    }
    DP(a) {
      this.window.update();
      if (this.config.GA) {
        let b = this.VS;
        let c = cachedBind(this, this.update);
        b.elapsedTime += a;
        b.Th += a * b.Hx;
        if (b.Th > 0.25) {
          b.Th = 0.25;
        }
        while (b.Th >= FixedTimestep.Rk) {
          c(FixedTimestep.Rk);
          b.Th -= FixedTimestep.Rk;
        }
        this.render(b.Th / FixedTimestep.Rk);
      } else {
        this.update(a);
        this.render(1);
      }
      for (this.rN.update(a); this.LA.length > 0;) {
        this.LA.pop()();
      }
    }
    update(a) {
      let b = 0;
      let c = this.Jv;
      while (b < c.length) {
        let d = c[b];
        ++b;
        if (d != null) {
          d.state.update(a);
        }
      }
      this.V.Gi();
      this.V.Bm();
      this.$O();
      this.fa.update(a);
      this.V.fi();
    }
    render(a) {
      if (this.V.Gi()) {
        this.V.Bm();
        this.V.clear();
        this.fa.render(a);
        this.V.Bm();
        this.V.fi();
      }
    }
    $O() {
      if (this.config.aC) {
        var a = this.window;
        a = a.Hc.x / a.Hc.y;
        var b = this.window.Hc;
        var c = b.x;
        b = b.y;
        if (a > 2.5) {
          a = b / c * 2.5;
          c = (1 - a) / 2;
          this.V.Bk(c, 0, c + a, 1);
        } else if (a < 0.4) {
          a = c / b / 0.4;
          c = (1 - a) / 2;
          this.V.Bk(0, c, 1, c + a);
        }
      }
    }
    EB() {
      if (this.config.audio && Audio.MB()) {
        if (this.Sa != null && this.Sa instanceof WebAudioMixer) {
          var a = this.Sa.Yg;
          var b = this.Sa.names;
          this.Sa.free();
          Audio.ib();
          this.Sa = new WebAudioMixer();
          this.Sa.Yg = a;
          this.Sa.names = b;
        } else {
          a = this.config.Nz;
          var c = a ?? Audio.LM();
          if (Lambda.Ej(Loader.Xq(), function (f) {
            return f == c;
          })) {
            Loader.JR(c);
          }
          b = Loader.TN();
          a = [];
          for (var d = 0; d < b.length;) {
            let f = b[d];
            ++d;
            if (new EReg("audio", "").match(f)) {
              a.push(f);
            }
          }
          if (a.length != 0) {
            Audio.ib();
            if (Audio.MB()) {
              this.Sa = new WebAudioMixer();
            }
            var e = this;
            // Music tracks go through the normal `ls()` path (one file =
            // one buffer). The legacy SPR sprite branch is gone: SFX now
            // live as individual files under assets/audio/sfx/, loaded by
            // `loadSfxBundle()` after music registration completes.
            b = function (f, g, h) {
              e.Sa.ls(f, g, Loader.ug(f), h);
            };
            for (d = 0; d < a.length;) {
              Loader.Cz(Loader.rg(a[d++]), b);
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
      var mixer = this.Sa;
      if (mixer == null) return;
      fetch("assets/audio/sfx/manifest.json").then(function (Resources) { return Resources.json(); }).then(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          (function (entry) {
            fetch("assets/audio/sfx/" + entry.name + ".ogg")
              .then(function (Resources) { return Resources.arrayBuffer(); })
              .then(function (buf) {
                mixer.names[entry.id] = entry.name;
                mixer.ls(entry.id, buf, false, function () {});
              });
          })(entries[i]);
        }
      });
    }
    vv() {
      return new NullSave();
    }
    pv(a) {
      return this.Jv[a];
    }
    ju(a) {
      return this.Jv[a.nv()] = a;
    }
    fO() {
      let a = this.pv(1);
      return a ?? this.ju(new MouseInputDevice(this.window.canvas));
    }
    gO() {
      return this.fO().state;
    }
    eO() {
      let a = this.pv(0);
      return a ?? this.ju(new KeyboardInputDevice());
    }
    lh() {
      return this.eO().state;
    }
    Qj() {
      let a = this.pv(3);
      return a ?? this.ju(new TouchInputDevice(this.window.canvas));
    }
    hd() {
      return this.Qj().state;
    }
    AM(a) {
      return new LocalStorageStore(a);
    }
    vx() {
      // was a 10s bottom-left version badge. kept the no-op so the caller
      // chain stays the same.
    }
    QC() {
      this.Sa.Lg(1, 0);
    }
    dQ() {
      this.Sa.Lg(0, 0);
    }
    SS() {
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
    LS() {
      if (this.config.Oz) {
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
    IN() {
      return host.navigator.language;
    }
    Ae(a) {
      if (a.type != "unhandledrejection" && (a != null ? a.error : null) != null && a.error.stack != null) {
        Numeric.Ed(a.error.stack);
      }
      if (this.df != null) {
        this.df.stop();
      }
      host.console.log("" + this.config.title + " CRASHED 💀");
      window.removeEventListener("error", cachedBind(this, this.Ae));
      window.removeEventListener("unhandledrejection", cachedBind(this, this.Ae));
    }
  }
  Application.i = true;
  Object.assign(Application.prototype, {
    l: Application
  });
  class WebApplication extends Application {
    constructor(a) {
      super();
      this.ib(new AppConfig("Ctrr", true, a ?? "en", null, null, null, null, {
        alpha: false,
        depth: false,
        antialias: true,
        stencil: true
      }, false, null, true, null, null, null, null, false, null, null, null, null, false, null), cachedBind(this, this.Hg));
    }
    Ae(a) {
      super.Ae(a);
      if (this.jd) {
        this.reload();
      }
    }
    vv() {
      return new Save(this.AM(this.config.title));
    }
    preload() {
      super.preload();
      WebApplication.ds = !this.SB() && !this.jd;
      if (this.jd) {
        Loader.Ls(1);
      } else if (this.Vj && this.window.Pj() <= 2 && this.window.Hc.x < 1000) {
        Loader.Ls(1);
      } else {
        Loader.Ls(2);
      }
    }
    UN() {
      if (this.jd) {
        if (this.window.Hc.x > 5000) {
          return 4;
        } else if (this.window.Hc.x > 3000) {
          return 2;
        } else {
          return 1;
        }
      } else if (this.Vj && this.window.Pj() > 2) {
        return 2;
      } else {
        return 1;
      }
    }
    Hg() {
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
      this.V.MR(new Vec4(0, 0, 0, 1));
      FixedTimestep.Rk = 0.016;
      this.V.MM();
      this.window.aS(this.UN());
      this.Qj().XD(5);
      if (this.config.oo) {
        this.V.md(new GLTiledTextureProgram());
        this.V.md(new GLTextureProgram());
        this.V.md(new GLSolidColorProgram());
        this.V.md(new GLClearProgram());
        this.V.md(new GLMultiLineProgram());
        this.V.md(new GLGradientLineProgram());
        this.V.md(new GLDashedCircleProgram());
        this.V.md(new GLCircleStrokeProgram());
      } else {
        this.V.md(new RepeatPatternDraw());
        this.V.md(new CanvasTextRenderer());
        this.V.md(new CanvasSolidColorRenderer());
        this.V.md(new CanvasClearRenderer());
        this.V.md(new CanvasPathRenderer());
        this.V.md(new CanvasMultiLineRenderer());
        this.V.md(new CanvasGradientLineRenderer());
        this.V.md(new CanvasDashedCircleRenderer());
        this.V.md(new CanvasCircleStrokeRenderer());
      }
      WebApplication.menuMusicId = WebApplication.xmasMode ? Loader.menuMusicXmas : Loader.menuMusic;
      WebApplication.gameMusicId = WebApplication.xmasMode ? Loader.gameMusicXmas : Loader.gameMusic;
      let a = this;
      this.save.load(function () {
        if (Save.language == null && (Save.Yi(a.config.language), a.jd)) {
          let b = Std.substr(a.IN().toLowerCase(), 0, 2);
          if (new EReg("(" + LANGUAGES.join("|") + ")", "").match(b)) {
            Save.Yi(b);
          }
        }
        a.Wi(Save.language);
        a.tE();
      });
    }
    Wi(a) {
      Loader.Wi(a);
    }
    tE() {
      this.fa.Ha.sceneToLoad = MenuScene;
      Audio.addListener("EContextBroken", cachedBind(this, this.EB));
      this.Nu = -1;
      let a = this;
      Audio.addListener("EContextResumed", function () {
        if (!a.Sa.Dc(a.Nu)) {
          a.Sa.play(a.Nu, true, true);
        }
      });
      this.fa.hq(LoadingScene);
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
    vv() {
      let a = new Save(new PortalLocalStorage(Application.instance.config.title));
      if (SDK.hasFeature("force_english")) {
        Save.Yi("en");
      }
      return a;
    }
    Hg(a) {
      this.hF();
      SDK.onInsetsChange(cachedBind(this, this.hF));
      let b = this;
      SDK.onRequest("enableAudio", function () {
        audioDisabled = false;
        b.Sa.Lg(1);
        try {
          let c = b.fa;
          let d = c.$n(CTRCIntroVideoScene, c);
          if (d != null) {
            d.jT();
          }
        } catch (c) {}
      });
      SDK.onRequest("disableAudio", function () {
        audioDisabled = true;
        b.Sa.Lg(0);
        try {
          let c = b.fa;
          let d = c.$n(CTRCIntroVideoScene, c);
          if (d != null) {
            d.TP();
          }
        } catch (c) {}
      });
      SDK.onRequest("pauseGameplay", function () {
        gameplayPaused = true;
        b.Qj().enabled = false;
        b.df.stop();
      });
      SDK.onRequest("resumeGameplay", function () {
        gameplayPaused = false;
        b.Qj().enabled = true;
        b.hd().reset();
        b.df.start();
      });
      SDK.setPauseRequestHandler(function () {
        SDK.adShowing = true;
        b.Sa.Lg(0);
        b.Qj().enabled = false;
        b.df.stop();
      });
      SDK.setResumeRequestHandler(function () {
        SDK.adShowing = false;
        if (!audioDisabled) {
          b.Sa.Lg(1);
        }
        if (!gameplayPaused) {
          b.Qj().enabled = true;
          b.hd().reset();
          b.df.start();
        }
      });
      super.Hg(a);
    }
    Wi(a) {
      if (SDK.hasFeature("force_english")) {
        Save.Yi("en");
        super.Wi("en");
      } else {
        super.Wi(a);
      }
    }
    tE() {
      // preview bridge: skip the main menu and load straight into the level
      // scene when a custom level is parked on window.customleveldata.
      this.fa.Ha.sceneToLoad = window.customleveldata != null ? CTRCLevelScene : CTRCMenuScene;
      this.fa.hq(CTRCLoadingScene);
    }
    QC() {
      if (!SDK.adShowing && !audioDisabled) {
        this.Sa.Lg(SDK.getVolume());
      }
    }
    vx() {
      if (SDK.hasFeature("version")) {
        super.vx();
      }
    }
    hF() {
      let a = SDK.getInsets();
      let b = this.window.canvas.style;
      b.top = "" + a.t + "px";
      b.left = "" + a.VB + "px";
      b.width = "calc(100% - " + (a.r + a.VB) + "px)";
      b.height = "calc(100% - " + (a.b + a.t) + "px)";
    }
  }
  SDKApplication.i = true;
  SDKApplication.s = WebApplication;
  Object.assign(SDKApplication.prototype, {
    l: SDKApplication
  });
  class Entry {
    static CP(a) {
      new SDKApplication(a);
    }
  }
  globalScope.Ctrr.main = Entry.CP;
  Entry.i = true;
  Math.i = true;
  class AppConfig {
    constructor(a, b, c, d, e, f, g, h, m, n, q, p, v, u, A, D, B, K, E, p18, p19, V) {
      this.mB = false;
      this.aC = true;
      this.Fx = false;
      this.GA = this.Oz = this.audio = this.nF = this.transition = this.CB = true;
      this.FE = false;
      this.Nz = this.Hw = null;
      this.Wo = 4;
      this.Cu = null;
      this.DB = 1;
      this.language = "en";
      this.title = a;
      this.oo = b;
      if (c != null) {
        this.language = c;
      }
      if (d != null) {
        this.DB = d;
      }
      if (e != null) {
        this.Cu = e;
      }
      if (f != null) {
        this.Wo = f;
      }
      if (g != null) {
        this.Nz = g;
      }
      if (h != null) {
        this.Hw = h;
      }
      if (m != null) {
        this.FE = m;
      }
      if (n != null) {
        this.GA = n;
      }
      if (q != null) {
        this.Oz = q;
      }
      if (p != null) {
        this.audio = p;
      }
      if (v != null) {
        this.nF = v;
      }
      if (u != null) {
        this.transition = u;
      }
      if (A != null) {
        this.CB = A;
      }
      if (E != null) {
        this.Fx = E;
      }
      if (p19 != null) {
        this.aC = p19;
      }
      if (V != null) {
        this.mB = V;
      }
    }
  }
  AppConfig.i = true;
  Object.assign(AppConfig.prototype, {
    l: AppConfig
  });
