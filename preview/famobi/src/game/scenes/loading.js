  class LoadingScene extends Scene {
    constructor() {
      super();
    }
    init() {
      super.init();
      this.th = new Sprite(null, this.createTexture(Loader.loaderBg));
      this.node.P(this.th.u);
      this.Ke(750, 750);
      var a = "logo";
      if (Loader.qv() == "ru") {
        a = "logo_ru";
      }
      this.we = new Sprite(this.ra, Resources.Yl.children[0], a);
      this.we.center();
      this.we.setX(375);
      this.we.setY(200);
      this.ca = new Container();
      this.ca.setX(375);
      this.ca.setY(400);
      this.ra.appendChild(this.ca);
      a = new Sprite(this.ca, Resources.Yl.children[0], "bubble");
      a.center();
      this.text = new TextNode(this.ca, Resources.Yl.children[1]);
      this.text.setText("100%");
      this.text.setBoxSize(a.X.x, a.X.y);
      this.text.setAlign(0, 0);
      this.text.setMultiline(false);
      this.text.setText("0%");
      this.text.setX(-a.X.x / 2);
      this.text.setY(-a.X.y / 2);
      this.text.setFontSize(this.text.$q() * 0.7);
      this.Zl = this.O.Xl(this.fa.Ha.sceneToLoad);
      this.ak = this.wd = 0;
      this.tj = Math.random() * PI * 2;
      this.uj = Math.random() * PI * 2;
      this.Ek = Math.random() * 0.1 - 0.05;
      this.Fk = Math.random() * 0.1 - 0.05;
    }
    layout() {
      super.layout();
      if (this.fa.Se() > 1) {
        this.th.la(0);
        this.th.setX(0);
        this.th.px(this.fa.getWidth());
        this.th.nx(this.fa.getHeight());
      } else {
        this.th.la(90);
        this.th.setX(this.fa.getWidth());
        this.th.px(this.fa.getHeight());
        this.th.nx(this.fa.getWidth());
      }
    }
    dispose() {
      this.ia(Loader.loaderBg);
      super.dispose();
    }
    update(a) {
      super.update(a);
      this.layout();
      this.ca.setX(375);
      this.ca.setY(400);
      var b = Math.cos(this.tj) * 50;
      a = Math.sin(this.uj) * 50;
      this.tj += this.Ek;
      this.uj += this.Fk;
      let c = this.ca;
      c.setX(c.getX() + b);
      b = this.ca;
      b.setY(b.getY() + a);
      // Same drop-the-fake-progress treatment as BubbleLoadingOverlay.
      // The `De == "Running"` guard is critical: gk() pushes a new
      // scene, and if it fires while this LoadingScene is still being
      // pushed in (De == "Created" / "Started"), the in-flight
      // TransitionPushOver calls transitionIn on an already-disposed
      // scene whose `node` has been nulled, producing
      // `Cannot read properties of null (reading 'li')`.
      this.wd = this.Zl.er() | 0;
      this.aE(this.wd);
      this.text.setText("" + this.wd + "%");
      if (this.Zl.xv() && this.De == "Running" && this.ak == 0) {
        this.ak++;
        this.gk();
      }
    }
    aE() {}
    gk() {
      this.$(this.fa.Ha.sceneToLoad);
    }
    getTransitionDuration(a) {
      if (a == null) {
        return 0;
      } else {
        return 0.5;
      }
    }
    getName() {
      return "LoadingScene";
    }
  }
  LoadingScene.i = true;
  LoadingScene.s = Scene;
  Object.assign(LoadingScene.prototype, {
    l: LoadingScene
  });
  class CTRCLoadingScene extends LoadingScene {
    constructor() {
      super();
    }
    aE(a) {
      SDK.setPreloadProgress(a);
    }
    getName() {
      return "CTRCLoadingScene";
    }
  }
  CTRCLoadingScene.i = true;
  CTRCLoadingScene.s = LoadingScene;
  Object.assign(CTRCLoadingScene.prototype, {
    l: CTRCLoadingScene
  });
