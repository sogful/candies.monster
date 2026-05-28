  class PicturesScene extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      return [Loader.picThumbs, Loader.picThumbsJson, WebApplication.xmasMode ? Loader.picsBgXmas : Loader.picsBg];
    }
    addBackground() {
      this.background = new Sprite(null, this.createTexture(WebApplication.xmasMode ? Loader.picsBgXmas : Loader.picsBg));
      this.node.appendChild(this.background.node);
    }
    loadTextures() {
      super.loadTextures();
      this.thumbTexture = this.createTexture(Loader.picThumbs);
    }
    init() {
      super.init();
      Save.pictureBadgeCount = 0;
      Save.flush();
      this.addBackground();
      this.setSize(600, 900);
      this.buildThumbs();
      this.addCursor();
      var a = new TextNode(this.layout, Resources.ic);
      a.setBoxSize(600, 60);
      a.setText(this.tr("OMNOM_DRAWINGS"));
      a.setAlign(0);
      a.autoFit();
      a.setY(20);
      a = new TextNode(this.layout, Resources.ji);
      a.setBoxSize(600, 40);
      a.setText(this.tr("DRAWINGS_TOTAL", Numeric.toStr(LevelState.pictureCount())));
      a.setAlign(0);
      a.autoFit();
      a.setY(80);
      this.addBackButton();
      this.artistSprite = new Sprite(null, this.thumbTexture, "artist");
      this.scroll = new HorizontalScroller(this.thumbsContainer, 0, 600, 0);
      this.scroll.offsetX = this.thumbsWidth / 2;
      this.time = this.state = 0;
    }
    start() {
      super.start();
      if (this.artistSprite.node.parent == null) {
        this.director.front.appendChild(this.artistSprite.node);
      }
    }
    layout() {
      super.layout();
      let a = this.cursor;
      a.setUniformScale(a.scaleX * 1.1);
    }
    onStop() {
      super.onStop();
      this.release(Loader.picThumbs);
      this.release(Loader.picsBg);
    }
    buildThumbs() {
      this.thumbsContainer = new Container("thumbs", this.layout);
      this.thumbsContainer.setY(0);
      for (var a = [0.77, -2.45, 470, 695, 0.85, 0.2, 854, 627, 0.86, 0.2, 1260, 647, 0.78, 1, 1630, 663, 0.86, 4.7, 2057, 642, 0.8, -2, 2477, 722, 0.8, -5, 2924, 602, 0.77, 0, 459, 1161, 0.85, -0.48, 854, 1147, 0.78, 5.11, 1253, 1137, 0.82, 0.11, 1680, 1147, 0.7, 0, 2121, 1188, 0.75, 1, 2526, 1264, 0.75, -2, 2933, 1162, 0.71, -3, 700, 1635, 0.66, -0.31, 1091, 1611, 0.66, 0.51, 1481, 1606, 0.7, 6.66, 1832, 1665, 0.66, 0, 2172, 1627, 0.65, -5, 2586, 1680, 0.75, -2, 2855, 1624], b = 0; b < a.length;) {
        var c = a[b++] * 0.8 * 1.5;
        let e = a[b++];
        let f = a[b++] * 0.8 / 2 - 90;
        let g = a[b++] * 0.8 / 2;
        let h = b >> 2;
        var d = undefined;
        if (LevelState.hasPicture(h)) {
          d = "pics/";
          if (h < 10) {
            d = "pics/0";
          }
          d += h;
        } else {
          d = "missing";
        }
        d = new Sprite(this.thumbsContainer, this.thumbTexture, d);
        d.setName(h == null ? "null" : "" + h);
        d.center();
        d.setUniformScale(c);
        d.setRotation(e);
        d.setX(f);
        d.setY(g);
      }
      a = this.thumbsContainer.boundingBox();
      this.thumbsWidth = a.right - a.left;
      a = this.thumbsContainer.getWidth();
      for (b = this.thumbsContainer.iterator(); b.hasNext();) {
        c = b.next();
        c.setX(c.getX() - a / 2);
      }
    }
    update(a) {
      super.update(a);
      if (this.director.getWidth() / this.layout.scaleX - this.thumbsWidth < -50) {
        this.scroll.update(a);
      } else {
        this.thumbsContainer.setX(300);
      }
      this.artistSprite.setX(this.director.getWidth() - this.artistSprite.getWidth());
      switch (this.state) {
        case 0:
          a = this.progress(0.2);
          this.artistSprite.setY(this.director.getHeight() - this.artistSprite.getHeight() * a);
          if (a == 1) {
            this.state = 1;
          }
          break;
        case 1:
          this.artistSprite.setY(this.director.getHeight() - this.artistSprite.getHeight());
          break;
        case 2:
          a = this.progress(0.2);
          this.artistSprite.setY(this.director.getHeight() - this.artistSprite.getHeight() * (1 - a));
          if (a == 1) {
            this.artistSprite.setVisible(false);
            this.state = 3;
            this.onAnimEnd();
          }
      }
      if (this.lifecycle == "Running") {
        a = this.app.pointer();
        if (a.justPressed(0)) {
          this.pressX = a.position[0].x;
        }
        if (!!a.justReleased(0) && !(Math.abs(a.position[0].x - this.pressX) > 5)) {
          a = new GrowableList();
          if (this.thumbsContainer.hitTest(this.pointer.pos, a)) {
            a = Numeric.parseInt(a.get(0).name);
            this.sharedState.pictureIndex = a;
            this.sharedState.available = LevelState.hasPicture(a);
            this.sharedState.ui = false;
            this.pushOver(PictureRevealScene);
          }
        }
      }
    }
    handleInput() {
      if (this.consumeClick(0)) {
        this.state = 2;
        this.time = 0;
      }
    }
    onAnimEnd() {
      this.push(MenuScene);
    }
    getName() {
      return "PicturesScene";
    }
  }
  PicturesScene.i = true;
  PicturesScene.s = Scene;
  Object.assign(PicturesScene.prototype, {
    l: PicturesScene
  });
  class CTRCPicturesScene extends PicturesScene {
    constructor() {
      super();
    }
    onAnimEnd() {
      this.push(CTRCMenuScene);
    }
    getName() {
      return "CTRCPicturesScene";
    }
  }
  CTRCPicturesScene.i = true;
  CTRCPicturesScene.s = PicturesScene;
  Object.assign(CTRCPicturesScene.prototype, {
    l: CTRCPicturesScene
  });
  class WarpScene extends Scene {
    constructor() {
      super();
    }
    start() {
      super.start();
      var a = this.caller.sharedState.box;
      if (a != LevelState.box) {
        this.releaseAllTextures();
      }
      LevelState.setBox(a);
      a = this.caller.sharedState.level;
      LevelState.setLevel(a);
      if (a <= 5) {
        LevelState.setSeason(1);
      } else if (a > 5 && a < 10) {
        LevelState.setSeason(2);
      } else {
        LevelState.setSeason(3);
      }
      this.startLevel();
    }
    startLevel() {
      this.push(LevelScene);
    }
    getName() {
      return "WarpScene";
    }
  }
  WarpScene.i = true;
  WarpScene.s = Scene;
  Object.assign(WarpScene.prototype, {
    l: WarpScene
  });
  class CTRCWarpScene extends WarpScene {
    constructor() {
      super();
    }
    startLevel() {
      this.push(CTRCLevelScene);
    }
    getName() {
      return "CTRCWarpScene";
    }
  }
  CTRCWarpScene.i = true;
  CTRCWarpScene.s = WarpScene;
  Object.assign(CTRCWarpScene.prototype, {
    l: CTRCWarpScene
  });

  class PictureRevealScene extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      let a = [Loader.picMissing];
      a.push([27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7][this.pictureIndex() - 1]);
      return a;
    }
    transitionIn() {}
    transitionOut() {}
    getTransitionDuration() {
      return 0;
    }
    replacesPrevious() {
      return false;
    }
    init() {
      super.init();
      var a = this.pictureIndex();
      this.fadeOverlay = new ColorRectShape(null, new Vec4(0, 0, 0, 1));
      this.fadeOverlay.setAlpha(0);
      this.node.appendChild(this.fadeOverlay.node);
      var b = this.caller.sharedState.ui;
      var c = b ? 1350 : 1200;
      this.setSize(800, c);
      this.container = new Container(null, this.layout);
      this.container.setX(400);
      this.container.setY(c / 2);
      this.container.setUniformScale(0);
      this.container.setVisible(false);
      c = this.createTexture(Loader.picMissing);
      new Sprite(this.container, c).center();
      if (this.caller.sharedState.available) {
        this.pictureTexture = [27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7][a - 1];
        a = new Sprite(this.container, this.createTexture(this.pictureTexture));
        a.center();
        a.setX(-1);
        a.setY(-14);
      } else {
        c = LevelMath.globalIndex(a);
        a = this.boxLabelForPicture(a);
        a = this.tr("COMPLETE_BOXNAME", c == null ? "null" : "" + c, a);
        c = new TextNode(this.container, Resources.ji);
        c.setBoxSize(400, 400);
        c.autoFit(true);
        c.setFontSize(50);
        c.setText(a);
        c.setAlign(0);
        c.setX(-200);
        c.setY(-100);
      }
      if (b) {
        b = LabelledButton.create(this.tr("COLLECT_DRAWING"));
        b.container.setUniformScale(1.25);
        this.container.appendChild(b.container);
        b.setX(-293.75);
        b.setY(500);
        this.buttons.push(b);
        this.addChild(b);
        b.focus();
        b = new Sprite(this.container, Resources.Wa, Keys.nK);
        b.center();
        b.setX(0);
        b.setY(-570);
        b = this.tr("DRAWING_FOUND");
        a = new TextNode(this.container, Resources.ic);
        a.setBoxSize(600, 160);
        a.setFontSize(80);
        a.setText(b);
        a.setAlign(0);
        a.setX(-300);
        a.setY(-615);
      }
      this.time = this.state = 0;
    }
    onStop() {
      super.onStop();
      this.release(Loader.picMissing);
      this.release(this.pictureTexture);
    }
    handleInput(a) {
      super.handleInput(a);
      if (this.state == 1 && this.consumeClick(1)) {
        this.state = 2;
        this.time = 0;
      }
    }
    start() {
      super.start();
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 0:
          a = this.progress(0.5);
          this.container.setUniformScale(Easing.backOut()(a));
          this.container.setVisible(true);
          this.fadeOverlay.setAlpha(a * 0.4);
          if (a == 1) {
            this.state = 1;
          }
          break;
        case 1:
          if (this.caller.sharedState.ui) {
            break;
          }
          if (this.app.pointer().justPressed(0)) {
            this.state = 2;
            this.time = 0;
          }
          break;
        case 2:
          a = this.progress(0.25);
          this.container.setUniformScale(1 - Easing.quadOut()(a));
          this.fadeOverlay.setAlpha((1 - a) * 0.4);
          if (a == 1) {
            this.state = 3;
            this.pop();
          }
      }
    }
    pictureIndex() {
      let a = this.caller.sharedState.pictureIndex;
      if (a == null) {
        a = LevelMath.boxLevelFromGlobal(LevelState.box, LevelState.level);
      }
      return a;
    }
    boxLabelForPicture(a) {
      if (a <= 17) {
        return this.tr("BOX1_LABEL");
      } else {
        return this.tr("BOX2_LABEL");
      }
    }
    getName() {
      return "PicturePopup";
    }
  }
  PictureRevealScene.i = true;
  PictureRevealScene.s = Scene;
  Object.assign(PictureRevealScene.prototype, {
    l: PictureRevealScene
  });
