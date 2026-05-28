  class LoadingScene extends Scene {
    constructor() {
      super();
    }
    init() {
      super.init();
      this.background = new Sprite(null, this.createTexture(Loader.loaderBg));
      this.node.appendChild(this.background.node);
      this.setSize(750, 750);
      var a = "logo";
      if (Loader.getLanguage() == "ru") {
        a = "logo_ru";
      }
      this.logo = new Sprite(this.layout, Resources.Yl.children[0], a);
      this.logo.center();
      this.logo.setX(375);
      this.logo.setY(200);
      this.bubble = new Container();
      this.bubble.setX(375);
      this.bubble.setY(400);
      this.layout.appendChild(this.bubble);
      a = new Sprite(this.bubble, Resources.Yl.children[0], "bubble");
      a.center();
      this.text = new TextNode(this.bubble, Resources.Yl.children[1]);
      this.text.setText("100%");
      this.text.setBoxSize(a.size.x, a.size.y);
      this.text.setAlign(0, 0);
      this.text.autoFit(false);
      this.text.setText("0%");
      this.text.setX(-a.size.x / 2);
      this.text.setY(-a.size.y / 2);
      this.text.setFontSize(this.text.getFontSize() * 0.7);
      this.loadProgress = this.app.preloadAssets(this.director.sharedState.sceneToLoad);
      this.pushedNext = this.percentCache = 0;
      this.phaseX = Math.random() * PI * 2;
      this.phaseY = Math.random() * PI * 2;
      this.speedX = Math.random() * 0.1 - 0.05;
      this.speedY = Math.random() * 0.1 - 0.05;
    }
    layout() {
      super.layout();
      if (this.director.aspectRatio() > 1) {
        this.background.setRotation(0);
        this.background.setX(0);
        this.background.setWidth(this.director.getWidth());
        this.background.setHeight(this.director.getHeight());
      } else {
        this.background.setRotation(90);
        this.background.setX(this.director.getWidth());
        this.background.setWidth(this.director.getHeight());
        this.background.setHeight(this.director.getWidth());
      }
    }
    dispose() {
      this.release(Loader.loaderBg);
      super.dispose();
    }
    update(a) {
      super.update(a);
      this.layout();
      this.bubble.setX(375);
      this.bubble.setY(400);
      var b = Math.cos(this.phaseX) * 50;
      a = Math.sin(this.phaseY) * 50;
      this.phaseX += this.speedX;
      this.phaseY += this.speedY;
      let c = this.bubble;
      c.setX(c.getX() + b);
      b = this.bubble;
      b.setY(b.getY() + a);
      // Same drop-the-fake-progress treatment as BubbleLoadingOverlay.
      // The `De == "Running"` guard is critical: gk() pushes a new
      // scene, and if it fires while this LoadingScene is still being
      // pushed in (De == "Created" / "Started"), the in-flight
      // TransitionPushOver calls transitionIn on an already-disposed
      // scene whose `node` has been nulled, producing
      // `Cannot read properties of null (reading 'li')`.
      this.percentCache = this.loadProgress.percent() | 0;
      this.onProgressChanged(this.percentCache);
      this.text.setText("" + this.percentCache + "%");
      if (this.loadProgress.isDone() && this.lifecycle == "Running" && this.pushedNext == 0) {
        this.pushedNext++;
        this.goToNextScene();
      }
    }
    onProgressChanged() {}
    goToNextScene() {
      this.push(this.director.sharedState.sceneToLoad);
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
    onProgressChanged(a) {
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
