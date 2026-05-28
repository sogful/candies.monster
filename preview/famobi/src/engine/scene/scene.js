  class SceneState extends Node {
    constructor() {
      super();
      this.name = this.getName();
      this.sharedState = {};
      this.caller = null;
      this.lifecycle = "New";
      this.setLifecycle("New");
      this.node = new SceneRoot();
      this.node.visibility = 1;
      this.wrapper = null;
    }
    isRunning() {
      return this.lifecycle == "Running";
    }
    // push - replace this scene with `a`, marking `this` as the caller
    // so the new scene can find its way back via pop.
    push(a) {
      this.director.push(a, this, false);
    }
    // pushOver - modal-style push: `this` stays mounted underneath
    // `a` (used for pause / results overlays).
    pushOver(a) {
      this.director.push(a, this, true);
    }
    pop(a) {
      let b = this;
      if (a != null) {
        let c = this.iterator();
        while (c.top > 0) {
          let d = c.stack[--c.top];
          c.push(d);
          if (StdString.isType(d, a)) {
            b = d;
          }
        }
      }
      this.director.pop(b);
    }
    replacesPrevious() {
      return true;
    }
    getPreloads() {
      return [];
    }
    preloadSet() {
      let a = [];
      let b = 0;
      let c = this.getPreloads();
      while (b < c.length) {
        let d = c[b];
        ++b;
        if ((!Loader.isAudioResource(d) || Loader.getAudioExt() != null) && !Loader.isLoaded(d)) {
          a.push(d);
        }
      }
      return a;
    }
    makeLoader(a) {
      return new ScenePreloadState(this, a);
    }
    bootMode() {
      return 0;
    }
    getTransitionDuration() {
      return 0;
    }
    dispose() {
      super.dispose();
      this.setLifecycle("Destroyed");
      if (this.node != null) {
        this.node.free();
      }
      this.node = null;
    }
    update(a) {
      super.update(a);
      this.node.tickAnims(a);
    }
    render(a) {
      super.render(a);
      this.node.updateTransforms();
      this.node.collectRenderStates();
      this.app.renderer.drawScene(this.node);
    }
    init() {}
    onShown() {}
    start() {}
    onStop() {}
    layout() {}
    transitionIn(a) {
      this.setFadeAlpha(Easing.quadOut()(a));
    }
    transitionOut(a) {
      this.setFadeAlpha(1 - a);
    }
    setLifecycle(a) {
      switch (a) {
        case "Created":
          this.node.visibility = 0;
          this.setFadeAlpha(0);
          break;
        case "Stopped":
          this.node.visibility = 1;
      }
      this.lifecycle = a;
    }
    setFadeAlpha(a) {
      this.fadeState().setAlpha(a);
    }
    fadeState() {
      let a = this.node.getRenderState(5);
      if (a == null) {
        a = new AlphaState(0);
      }
      this.node.setRenderState(a);
      return a;
    }
    previousScene() {
      if (this.wrapper.parent instanceof SceneDirector) {
        return null;
      } else {
        return this.wrapper.parent.scene;
      }
    }
    getName() {
      return "SceneState";
    }
  }
  SceneState.i = true;
  SceneState.s = Node;
  Object.assign(SceneState.prototype, {
    l: SceneState
  });
  class Scene extends SceneState {
    constructor() {
      super();
      this.buttons = [null];
      this.pointer = new ButtonInputState();
      this.cursor = this.fade = this.designSize = this.viewportBounds = this.layout = null;
    }
    createTexture(a) {
      if (Resources.textureCache[a] != null) {
        return Resources.textureCache[a];
      }
      let b = this.app.createTexture(a, 8);
      return Resources.textureCache[a] = b;
    }
    release(a) {
      let b = Resources.textureCache[a];
      if (b != null) {
        Application.instance.renderer.release(b);
        Application.instance.freeTexture(a);
        Resources.textureCache[a] = null;
      }
    }
    addBackButton() {
      let a = ButtonBase.create(null, Keys.tK, Keys.uK);
      this.node.appendChild(a.container.node);
      this.buttons[0] = a;
    }
    setSize(a, b) {
      this.designSize = new Vec4(a, b, 0, 1);
      this.layout = new Container("fix");
      this.node.appendChild(this.layout.node);
    }
    addCursor() {
      if (Resources.cursor == null) {
        Resources.cursor = this.createTexture(Loader.menuShadow);
      }
      this.cursor = new Sprite(null, Resources.cursor);
      this.node.appendChild(this.cursor.node);
      this.cursor.setRotation(X.randRange(0, 360));
    }
    addBackground() {
      this.background = new Sprite(null, Resources.background);
      this.node.appendChild(this.background.node);
    }
    loadTextures() {
      if (Loader.isLoaded(Loader.fontImg)) {
        Resources.ki = this.createTexture(Loader.fontImg);
        var a = Resources.langIndex(Save.language, Save.language);
        Resources.ic = Resources.ki.children[a];
        Resources.ji = Resources.ki.children[a + 1];
      }
      if (Loader.isLoaded(Loader.loaderImg)) {
        Resources.Yl = this.createTexture(Loader.loaderImg);
      }
      a = WebApplication.xmasMode ? Loader.menuBgXmas : Loader.menuBg;
      if (Loader.isLoaded(a)) {
        Resources.background = this.createTexture(a);
      }
      if (Loader.isLoaded(Loader.menuUi)) {
        Resources.Wa = this.createTexture(Loader.menuUi);
      }
      if (Loader.isLoaded(Loader.menuCut)) {
        Resources.yc = this.createTexture(Loader.menuCut);
      }
    }
    makeLoader(a) {
      return new BubbleLoadingOverlay(this, a);
    }
    init() {
      this.loadTextures();
      if (Scene.Zt == null) {
        Scene.Zt = new ColorRectShape(null, new Vec4(0, 0, 0, 1));
        this.director.front.appendChild(Scene.Zt.node);
      }
      this.fade = Scene.Zt;
    }
    onShown() {
      super.onShown();
      this.layout();
    }
    layout() {
      var a = this.director.getWidth();
      var b = this.director.getHeight();
      let c = this.director.viewportRect();
      if (this.designSize != null) {
        this.viewportBounds = c.fitAspect(this.designSize.x / this.designSize.y);
        this.layout.setX(this.viewportBounds.left);
        this.layout.setY(this.viewportBounds.top);
        var d = this.viewportBounds;
        this.layout.setUniformScale((d.right - d.left) / this.designSize.x);
      }
      if (this.salute != null) {
        this.salute.setX(this.director.getWidth() - this.salute.getWidth());
        this.salute.setY(this.director.getHeight() - this.salute.getHeight());
      }
      d = this.buttons[0];
      if (d != null) {
        var e = c.fitAspect(this.designSize.x / this.designSize.y);
        d.container.setUniformScale((e.right - e.left) * 0.2 / d.sourceSize.x);
        d.setX(10);
        d.setY(this.director.getHeight() - d.container.getHeight() - 10);
      }
      if (this.background != null) {
        e = Resources.background.size;
        d = a / e.x;
        e = b / e.y;
        this.isPortrait = d > e;
        this.background.setUniformScale(Math.max(d, e));
        this.background.setX(this.director.getWidth() / 2);
        d = this.background;
        d.setX(d.getX() - this.background.getWidth() / 2);
        this.background.setY(0);
      }
      if (this.cursor != null) {
        this.cursor.center();
        this.cursor.setOriginXY(new Vec4((c.left + c.right) / 2, (c.top + c.bottom) / 2, 0, 1));
        this.cursor.setUniformScale((c.right - c.left) / 260);
        a = Math.max(a, b) / 2;
        a = Math.sqrt(a * 2 * a) * 2 / Resources.cursor.size.x;
        if (this.cursor.scaleX < a) {
          this.cursor.setUniformScale(a);
        }
        a = 1 / this.director.aspectRatio();
        if (a < 1) {
          b = this.cursor;
          b.setUniformScale(b.scaleX * a);
        }
        a = this.cursor;
        a.setUniformScale(a.scaleX * 2);
      }
    }
    update(a) {
      super.update(a);
      if (this.isRunning()) {
        this.pointer.resetHover();
        this.syncPointer();
        this.handleInput(a);
        this.pointer.endFrame();
        let b = 0;
        let c = this.buttons;
        while (b < c.length) {
          let d = c[b];
          ++b;
          if (d != null) {
            d.update(a);
          }
        }
      }
      if (this.cursor != null) {
        a = this.cursor;
        a.setRotation(a.rotation + 0.1);
      }
    }
    getTransitionDuration() {
      return 0.5;
    }
    transitionIn(a) {
      this.fade.setAlpha(1 - a);
    }
    transitionOut(a) {
      this.fade.setAlpha(a);
    }
    syncPointer() {
      var a = this.app.pointer();
      this.pointer.pressed = a.justPressed(0);
      this.pointer.released = a.justReleased(0);
      a = a.position[0];
      var b = a.x;
      var c = a.y;
      a = this.app.renderer.camera;
      let d = this.app.window.viewportRect();
      b = -1 + (b - d.x) * 2 / d.w;
      c = -1 + (d.y - c) * 2 / d.h;
      a = a.screenToWorldM;
      a = new Vec4(a.m11 * b + a.m12 * c + a.m14, a.m21 * b + a.m22 * c + a.m24, 0, 1);
      if (a != null) {
        b = this.pointer.pos;
        b.x = a.x;
        b.y = a.y;
      }
    }
    hideButtons() {
      let a = 0;
      let b = this.buttons;
      while (a < b.length) {
        let c = b[a];
        ++a;
        if (c != null) {
          c.container.setVisible(false);
        }
      }
    }
    showButtons() {
      let a = 0;
      let b = this.buttons;
      while (a < b.length) {
        let c = b[a];
        ++a;
        if (c != null) {
          c.container.setVisible(true);
        }
      }
    }
    handleInput() {}
    consumeClick(a) {
      let b = this.buttons[a];
      if (b == null || this.lifecycle != "Running" || b.selectedFlag || !b.isVisible()) {
        return false;
      }
      let c = false;
      if (a == 0) {
        var d = this.app.isWebOS ? 461 : -1;
        d = this.app.keyboard().justPressed(d);
      } else {
        d = false;
      }
      if (this.pointer.poll(a, b) || d) {
        b.select();
        c = true;
      }
      b.applyHover(this.pointer.isHovered(a));
      b.setActive(this.pointer.isActive(a));
      if (c) {
        SoundFx.play(SoundFx.button);
      }
      return c;
    }
    setFadeAlpha() {}
    // tr - localized string lookup with optional positional args. Thin
    // wrapper over Strings.get; scene subclasses call `this.tr("KEY")`
    // to fetch a translated UI label.
    tr(a, ...b) {
      return Strings.get(a, b.length > 0 ? b.slice() : null);
    }
    trAll(...a) {
      let b = [];
      let c = 0;
      while (c < a.length) {
        b.push(Strings.get(a[c++]));
      }
      return b;
    }
    startMenuMusic() {
      this.app.audio.stop(WebApplication.gameMusicId);
      this.playMusicLoop(WebApplication.menuMusicId);
    }
    startGameMusic() {
      this.app.audio.stop(WebApplication.menuMusicId);
      this.playMusicLoop(WebApplication.gameMusicId);
    }
    playMusicLoop(a) {
      let b = this.app.audio;
      b.setMusicVolume(Save.musicOn ? 1 : 0);
      if (!b.isPlaying(a)) {
        b.play(a, true);
        this.app.Nu = a;
      }
    }
    stopAllMusic() {
      let a = this.app.audio;
      if (a.isPlaying(WebApplication.menuMusicId)) {
        a.fadeStop(WebApplication.menuMusicId, 0.5, true);
      }
      if (a.isPlaying(WebApplication.gameMusicId)) {
        a.fadeStop(WebApplication.gameMusicId, 0.5, true);
      }
    }
    playSalute() {
      let a = this;
      if (Audio.isRunning() && !Scene.salutePlayed && Loader.isLoaded(Loader.menuSalute)) {
        this.salute = new Sprite(null, this.createTexture(Loader.menuSalute), "0000");
        this.salute.setUniformScale(this.app.window.bp);
        if (!this.app.isMobile) {
          this.salute.setUniformScale(this.app.window.pixelRatio());
        }
        this.director.front.appendChild(this.salute.node);
        this.salute.anim().play(Keys.range(null, 0, 53, 30)).onComplete(function () {
          a.salute.free();
          a.salute = null;
          a.release(Loader.menuSalute);
        });
        SoundFx.play(SoundFx.salute);
        Scene.salutePlayed = true;
        this.layout();
      }
    }
    releaseAllTextures() {
      let a = 0;
      while (a < 17) {
        let b = a++;
        this.release([194, 189, 184, 179, 174, 169, 164, 158, 153, 148, 143, 138, 133, 128, 123, 118, 113][b]);
        this.release([196, 191, 186, 181, 176, 171, 166, 161, 155, 150, 145, 140, 135, 130, 125, 120, 115][b]);
        this.release([198, 193, 188, 183, 178, 173, 168, 163, 157, 152, 147, 142, 137, 132, 127, 122, 117][b]);
      }
      Resources.wq = null;
      Resources.xj = null;
      Resources.uu = null;
      this.release(Loader.objBubble);
      Resources.ca = null;
      this.release(Loader.objSpikes);
      Resources.Dd = null;
      this.release(Loader.objPump);
      Resources.wm = null;
      this.release(Loader.objSpider);
      Resources.mc = null;
      this.release(Loader.objElectro);
      Resources.ce = null;
      this.release(Loader.objSock);
      Resources.Dk = null;
      this.release(Loader.objBouncer);
      Resources.fd = null;
      this.release(Loader.objGravity);
      Resources.Kb = null;
      this.release(Loader.objGravity);
      Resources.gl = null;
      this.release(Loader.objVinyl);
      Resources.Tc = null;
      this.release(Loader.objSteam);
      Resources.Kk = null;
      this.release(Loader.objLantern);
      Resources.Ai = null;
      this.release(Loader.objGap);
      Resources.wf = null;
      this.release(Loader.objLighter);
      Resources.Ef = null;
      this.release(Loader.objTransporter);
      Resources.Rc = null;
      this.release(Loader.objLighter);
      Resources.Ef = null;
      this.release(Loader.char3);
      Resources.ml = null;
    }
    releaseBoxTextures(a) {
      function b(d) {
        return (BOX_OBJECT_FLAGS[a - 1] & d) == 0;
      }
      let c = a - 1;
      this.release([194, 189, 184, 179, 174, 169, 164, 158, 153, 148, 143, 138, 133, 128, 123, 118, 113][c]);
      this.release([196, 191, 186, 181, 176, 171, 166, 161, 155, 150, 145, 140, 135, 130, 125, 120, 115][c]);
      this.release([198, 193, 188, 183, 178, 173, 168, 163, 157, 152, 147, 142, 137, 132, 127, 122, 117][c]);
      Resources.wq = null;
      Resources.xj = null;
      Resources.uu = null;
      if (Resources.ca != null && b(1)) {
        this.release(Loader.objBubble);
        Resources.ca = null;
      }
      if (Resources.Dd != null && b(2)) {
        this.release(Loader.objSpikes);
        Resources.Dd = null;
      }
      if (Resources.wm != null && b(4)) {
        this.release(Loader.objPump);
        Resources.wm = null;
      }
      if (Resources.mc != null && b(8)) {
        this.release(Loader.objSpider);
        Resources.mc = null;
      }
      if (Resources.ce != null && b(64)) {
        this.release(Loader.objElectro);
        Resources.ce = null;
      }
      if (Resources.Dk != null && b(128)) {
        this.release(Loader.objSock);
        Resources.Dk = null;
      }
      if (Resources.fd != null && b(512)) {
        this.release(Loader.objBouncer);
        Resources.fd = null;
      }
      if (Resources.Kb != null && b(2048)) {
        this.release(Loader.objGravity);
        Resources.Kb = null;
      }
      if (Resources.gl != null && b(4096)) {
        this.release(Loader.objGravity);
        Resources.gl = null;
      }
      if (Resources.Tc != null && b(16384)) {
        this.release(Loader.objVinyl);
        Resources.Tc = null;
      }
      if (Resources.Kk != null && b(65536)) {
        this.release(Loader.objSteam);
        Resources.Kk = null;
      }
      if (Resources.Ai != null && b(131072)) {
        this.release(Loader.objLantern);
        Resources.Ai = null;
      }
      if (Resources.wf != null && b(262144)) {
        this.release(Loader.objGap);
        Resources.wf = null;
      }
      if (Resources.Ef != null && b(524288)) {
        this.release(Loader.objLighter);
        Resources.Ef = null;
      }
      if (Resources.Rc != null && b(1048576)) {
        this.release(Loader.objTransporter);
        Resources.Rc = null;
      }
      if (Resources.Ef != null && b(524288)) {
        this.release(Loader.objLighter);
        Resources.Ef = null;
        this.release(Loader.char3);
        Resources.ml = null;
      }
    }
    getName() {
      return "AbstractScene";
    }
  }
  Scene.i = true;
  Scene.s = SceneState;
  Object.assign(Scene.prototype, {
    l: Scene
  });
  class SceneWrapper extends Node {
    constructor(a) {
      super();
      this.scene = a;
      a.wrapper = this;
      a.pausedUpdate = true;
      a.hiddenRender = true;
      this.addChild(a);
    }
    update(a) {
      switch (this.scene.lifecycle) {
        case "Paused":
        case "Running":
        case "Started":
          break;
        default:
          return;
      }
      if (this.app.window.lostContextFlag) {
        this.scene.layout();
      }
      this.scene.update(a);
      this.scene.lateUpdate(a);
      super.update(a);
    }
    render(a) {
      if (this.scene.ticked) {
        switch (this.scene.lifecycle) {
          case "Paused":
          case "Running":
          case "Started":
            this.scene.render(a);
        }
      }
      super.render(a);
    }
  }
  SceneWrapper.i = true;
  SceneWrapper.s = Node;
  Object.assign(SceneWrapper.prototype, {
    l: SceneWrapper
  });
  class SceneTransition extends Node {
    constructor(a, b) {
      super();
      this.from = a;
      this.to = b;
      this.state = 0;
    }
    forEachAncestorScene(a, b) {
      for (a = a.wrapper.parent; a != null && !(a instanceof SceneDirector);) {
        b(a.scene);
        a = a.parent;
      }
    }
    topWrapperFor(a) {
      if (a.wrapper.parent == a.director) {
        return a;
      }
      let b = a.wrapper.parent;
      while (b != null) {
        if (b.parent == a.director) {
          return b.scene;
        }
        b = b.parent;
      }
      return null;
    }
    bootMode(a) {
      if (a.app.config.bootDelay) {
        return a.bootMode();
      } else {
        return 0;
      }
    }
    getTransitionDuration(a, b) {
      if (a.app.config.transition) {
        return a.getTransitionDuration(b);
      } else {
        return 0;
      }
    }
    setState(a) {
      this.state = a;
      this.time = 0;
    }
  }
  SceneTransition.i = true;
  SceneTransition.s = Node;
  Object.assign(SceneTransition.prototype, {
    l: SceneTransition
  });

  class ScenePreloadState extends SceneState {
    constructor(a, b) {
      super();
      this.onDoneCb = b;
      this.preloadIds = a.preloadSet();
      this.loadProgress = this.app.load(this.preloadIds);
    }
    percent() {
      return this.loadProgress.percent();
    }
    update(a) {
      super.update(a);
      if (this.loadProgress.isDone() && this.lifecycle == "Running") {
        this.onPreloadDone();
      }
    }
    replacesPrevious() {
      return false;
    }
    onPreloadDone() {
      this.director.addChild(new TransitionPopBack(this, false, this.onDoneCb));
    }
    getName() {
      return "LoadingOverlay";
    }
  }
  ScenePreloadState.i = true;
  ScenePreloadState.s = SceneState;
  Object.assign(ScenePreloadState.prototype, {
    l: ScenePreloadState
  });

  class BubbleLoadingOverlay extends ScenePreloadState {
    constructor(a, b) {
      super(a, b);
    }
    init() {
      super.init();
      Resources.Yl = Application.instance.createTexture(Loader.loaderImg, 8);
      this.bubble = new Container();
      this.node.appendChild(this.bubble.node);
      let a = new Sprite(null, Resources.Yl.children[0], "bubble");
      let b = Math.min(this.director.getWidth(), this.director.getHeight()) / a.size.x * 0.25;
      this.bubble.setUniformScale(b);
      this.bubble.appendChild(a);
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
      this.pushedNext = this.percentCache = 0;
      this.phaseX = Math.random() * PI * 2;
      this.phaseY = Math.random() * PI * 2;
      this.speedX = Math.random() * 0.1 - 0.05;
      this.speedY = Math.random() * 0.1 - 0.05;
    }
    update(a) {
      super.update(a);
      this.time += a;
      this.bubble.setX(this.director.getWidth() / 2);
      this.bubble.setY(this.director.getHeight() / 2);
      var b = Math.cos(this.phaseX) * 50;
      a = Math.sin(this.phaseY) * 50;
      this.phaseX += this.speedX;
      this.phaseY += this.speedY;
      let c = this.bubble;
      c.setX(c.getX() + b);
      b = this.bubble;
      b.setY(b.getY() + a);
      // Loading overlay used to crawl a fake % counter (5 per frame)
      // and then sit on 100% for an extra half-second before dismissing.
      // Now: show real progress directly. The parent's update() handles
      // the actual dismissal via `gx()` once the overlay is fully
      // pushed in (De == "Running") AND loading is done - see
      // ScenePreloadState.update. We no longer override gx() to a
      // no-op, so the inherited TransitionPopBack fires automatically.
      this.percentCache = this.percent() | 0;
      this.text.setText("" + this.percentCache + "%");
    }
    getTransitionDuration() {
      return 0.25;
    }
    getName() {
      return "LoadingOverlay";
    }
  }
  BubbleLoadingOverlay.i = true;
  BubbleLoadingOverlay.s = ScenePreloadState;
  Object.assign(BubbleLoadingOverlay.prototype, {
    l: BubbleLoadingOverlay
  });
