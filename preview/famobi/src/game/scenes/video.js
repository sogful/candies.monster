  class VideoScene extends Scene {
    constructor() {
      super();
      this.uo = new EReg("(iPad|iPhone)", "g").match(host.navigator.platform);
      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        this.uo = true;
      }
    }
    getTransitionDuration() {
      return 0;
    }
    start() {
      super.start();
      this.O.window.canvas.style.visibility = "hidden";
      this.O.Sa.Sf(0);
      this.ae = window.document.createElement("div");
      this.ae.style.display = "flex";
      this.ae.style.position = "fixed";
      this.ae.style.left = "0px";
      this.ae.style.top = "0px";
      this.ae.style.width = "100%";
      this.ae.style.height = "100%";
      this.ae.style.justifyContent = "center";
      this.ae.style.alignItems = "center";
      window.document.body.appendChild(this.ae);
      try {
        this.video = window.document.createElement("video");
        this.ae.appendChild(this.video);
        this.video.muted = this.Qv();
        this.video.autoplay = true;
        this.video.controls = false;
        this.video.poster = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        this.video.playsInline = true;
        this.video.addEventListener("ended", cachedBind(this, this.ended));
        this.video.addEventListener("mousedown", cachedBind(this, this.Mr));
        this.video.addEventListener("touchend", cachedBind(this, this.WE));
        this.url = WebApplication.ds ? URL.createObjectURL(this.getData()) : Loader.ni(this.getPreloads()[0]);
        this.video.src = this.url;
        this.video.style.width = "100%";
        this.video.style.height = "100%";
        this.video.style.bottom = "0";
        this.video.style.left = "0";
        this.video.style.objectFit = "contain";
        this.video.style.background = "black";
      } catch (b) {
        this.ended();
      }
      let a = this;
      this.lT = this.O.window.addListener(1, function () {
        try {
          if (!a.Wj()) {
            a.video.muted = false;
          }
        } catch (b) {}
      });
      this.kT = this.O.window.addListener(2, function () {
        try {
          a.video.muted = true;
        } catch (b) {}
      });
    }
    Oc() {
      super.Oc();
      this.kT();
      this.lT();
    }
    Mr() {
      if (!this.Wj()) {
        this.video.muted = false;
      }
    }
    WE() {
      if (!this.Wj()) {
        this.video.muted = false;
      }
    }
    ended() {
      this.ae.removeChild(this.video);
      window.document.body.removeChild(this.ae);
      this.O.window.canvas.style.visibility = "";
      this.video.removeEventListener("ended", cachedBind(this, this.ended));
      this.video.removeEventListener("mousedown", cachedBind(this, this.Mr));
      this.video.removeEventListener("touchend", cachedBind(this, this.WE));
      URL.revokeObjectURL(this.url);
      this.LC();
    }
    Wj() {
      return Save.Ec == 0;
    }
    Qv() {
      if (this.uo) {
        return true;
      } else {
        return this.Wj();
      }
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
      setTimeout(function () { self.LC(); }, 0);
    }
    Oc() {
      // VideoScene.Oc() tears down event listeners we never registered,
      // so override with a no-op to avoid touching `this.kT` / `this.lT`.
    }
    LC() {
      LevelState.zk(1);
      LevelState.Ui(1);
      LevelState.sp(1);
      this.gk();
    }
    gk() {
      this.$(LevelScene);
    }
    init() {
      super.init();
      this.Uq();
    }
    start() {
      super.start();
      this.O.Xl(LevelScene);
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
  class CTRCIntroVideoScene extends IntroVideoScene {
    constructor() {
      super();
    }
    TP() {
      try {
        this.video.muted = true;
      } catch (a) {}
    }
    jT() {
      try {
        if (!this.Wj()) {
          this.video.muted = false;
        }
      } catch (a) {}
    }
    gk() {
      let a = this;
      let b = CTRCLevelScene;
      SDK.trackLevelStart(currentLevelId(), function () {
        a.$(b);
      });
    }
    Qv() {
      if (super.Qv()) {
        return true;
      } else {
        return audioDisabled;
      }
    }
    Wj() {
      if (super.Wj()) {
        return true;
      } else {
        return audioDisabled;
      }
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
  class OutroVideoScene extends VideoScene {
    constructor() {
      super();
    }
    replacesPrevious() {
      return false;
    }
    getData() {
      let a = Loader.data.J[Loader.outroPortraitVid];
      return a ?? Loader.data.J[Loader.outroLandscapeVid];
    }
    getPreloads() {
      return [this.O.window.bo() > 1 ? Loader.outroLandscapeVid : Loader.outroPortraitVid];
    }
    LC() {
      this.Kf();
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
