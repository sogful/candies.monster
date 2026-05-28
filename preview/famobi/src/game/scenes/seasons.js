  class SelectSeasonScene extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      return [Loader.fontDat, Loader.fontImg, Loader.menuBg, Loader.menuShadow, Loader.menuUi, Loader.menuUiJson, Loader.strings, Loader.menuSeasons, Loader.menuSeasonsJson, WebApplication.menuMusicId];
    }
    init() {
      super.init();
      this.release(Loader.menuSeason1);
      this.release(Loader.menuSeason2);
      this.release(Loader.menuSeason3);
      this.releaseAllTextures();
      this.addBackground();
      this.setSize(600, 900);
      this.addCursor();
      this.addBackButton();
      Resources.Ig = this.createTexture(Loader.menuSeasons);
      this.seasonScale = 750 / Resources.Ig.frames.findByName(Keys.Pt).sourceSize.x;
      this.offsetY = 150;
      this.seasonStride = Resources.Ig.frames.findByName(Keys.Pt).sourceSize.y * 0.7;
      this.seasons = [];
      let a = 0;
      while (a < 3) {
        var b = a++;
        let c = new Container(null, this.layout);
        new Sprite(c, Resources.Ig, Keys.Pt);
        new Sprite(c, Resources.Ig, [Keys.rJ, Keys.sJ, Keys.tJ][b]);
        c.center();
        c.setUniformScale(this.seasonScale);
        c.setX(300);
        c.setY(this.offsetY + b * this.seasonStride);
        this.seasons.push(c);
        let d = new TextNode(c, Resources.ic);
        d.setX(312);
        d.setY(140);
        d.setFontSize(70);
        d.setAlign(0);
        d.setBoxSize(400, 100);
        d.setText(this.tr("SEASON_NO", Numeric.toStr(b + 1)));
        b = ButtonBase.create(Resources.Ig, Keys.uJ, Keys.vJ);
        b.setX(512);
        b.setY(285);
        b.container.center();
        c.appendChild(b.container);
        this.buttons.push(b);
        this.addChild(b);
      }
      this.buttons[1].focus();
    }
    start() {
      super.start();
      this.startMenuMusic();
      this.playSalute();
    }
    layout() {
      super.layout();
      let a = Math.min(Math.max(0, this.app.window.aspectRatio() - 1), 0.2);
      let b = 0;
      while (b < 3) {
        let c = b++;
        this.seasons[c].setUniformScale(this.seasonScale + a);
        this.seasons[c].setY(this.offsetY + c * (this.seasonStride + a * 150));
      }
    }
    onStop() {
      super.onStop();
      Resources.Ig = null;
      this.release(Loader.menuSeasons);
    }
    handleInput() {
      if (this.consumeClick(0)) {
        Save.flush();
        this.releaseBoxTextures(LevelState.box);
        this.backToMenu();
      } else {
        for (var a = 1; a < 4;) {
          let b = a++;
          if (this.consumeClick(b)) {
            this.selectSeason(b);
          }
        }
      }
    }
    selectSeason(a) {
      if (a != LevelState.season) {
        this.release([40, 38, 36][LevelState.season - 1]);
        Resources.Yb = null;
      }
      LevelState.setSeason(a);
      this.releaseBoxTextures(LevelState.box);
      switch (a) {
        case 1:
          LevelState.setBox(1);
          break;
        case 2:
          LevelState.setBox(6);
          break;
        case 3:
          LevelState.setBox(11);
      }
      this.push(this.seasonScenes()[a - 1]);
    }
    seasonScenes() {
      return [Season1Scene, Season2Scene, Season3Scene];
    }
    backToMenu() {
      this.push(MenuScene);
    }
    getName() {
      return "SelectSeasonScene";
    }
  }
  SelectSeasonScene.i = true;
  SelectSeasonScene.s = Scene;
  Object.assign(SelectSeasonScene.prototype, {
    l: SelectSeasonScene
  });
  class CTRCSelectSeasonScene extends SelectSeasonScene {
    constructor() {
      super();
    }
    hB() {
      return [CTRCSeason1Scene, CTRCSeason2Scene, CTRCSeason3Scene];
    }
    backToSeasonSelect() {
      this.push(CTRCMenuScene);
    }
    getName() {
      return "CTRCSelectSeasonScene";
    }
  }
  CTRCSelectSeasonScene.i = true;
  CTRCSelectSeasonScene.s = SelectSeasonScene;
  Object.assign(CTRCSelectSeasonScene.prototype, {
    l: CTRCSelectSeasonScene
  });
  class SelectBoxScene extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      return [Loader.fontDat, Loader.fontImg, Loader.menuBg, Loader.menuShadow, Loader.menuUi, Loader.menuUiJson, Loader.strings, WebApplication.menuMusicId];
    }
    init() {
      super.init();
      this.boxIdx = LevelState.box;
      if (this.boxIdx > 10) {
        this.boxIdx -= 10;
      } else if (this.boxIdx > 5) {
        this.boxIdx -= 5;
      }
      this.state = 0;
      this.addBackground();
      this.addCursor();
      this.setSize(650, 650);
      this.boxContainer = new Container(null, this.layout);
      this.boxContainer.setX(75);
      this.boxContainer.setY(75);
      this.offsetX = this.boxContainer.getX();
      this.advance = 500;
      var a = this.seasonLabels();
      var b = this.seasonKeys();
      switch (LevelState.season) {
        case 2:
          var c = 5;
          break;
        case 3:
          c = 7;
          break;
        default:
          c = 5;
      }
      this.visibleBoxes = c;
      this.bgRects = [];
      for (var d = c = 0, e = this.visibleBoxes; d < e;) {
        ++d;
        var f = new Sprite(this.boxContainer);
        f.setColor(new Vec4(0.17647058823529413, 0.17647058823529413, 0.20784313725490197, 1), 300, 300);
        f.setX(100 + c);
        f.setY(150);
        this.bgRects.push(f);
        c += this.advance;
      }
      this.omNom = new Sprite(this.boxContainer, Resources.Yb, Keys.$I);
      this.clipPath = new Bounds(0, 0, 177, 182);
      this.boxes = [];
      e = this.visibleBoxes;
      this.totalBoxes = e += LevelState.season < 3 ? 1 : 0;
      for (d = c = 0; d < e;) {
        f = d++;
        var g = this.boxFor(f);
        let q = new Container(null, this.boxContainer);
        this.boxes.push(q);
        let p = f == this.visibleBoxes;
        q.setX(c);
        var h = null;
        if (p && LevelState.season < 3) {
          h = new Container(null, q);
          new Sprite(h, Resources.Yb, b[f]);
        } else {
          new Sprite(q, Resources.Yb, b[f]);
          var m = new Sprite(q, Resources.Yb, b[f]);
          m.setOrigin(m.size.x, 0);
          m.setScaleX(-1);
        }
        if (!p && LevelState.isBoxLocked(g)) {
          m = new Container(null, q);
          m.setName("lock");
          new Sprite(m, Resources.Yb, Keys.Ot);
          var n = new Sprite(m, Resources.Yb, Keys.Ot);
          n.setOrigin(n.size.x, 0);
          n.setScaleX(-1);
          m.center();
          n = Resources.Yb.frames.findByName(Keys.Ot).sourceSize;
          m.setX(m.getX() + n.x);
          m.setY(m.getY() + n.y / 2);
          if (LevelState.starsNeededForBox(g) > 0) {
            m = new Sprite(q, Resources.Wa, Keys.Tt);
            m.setX(260);
            m.setY(320);
            m.setUniformScale(0.7);
            n = new TextNode(q, Resources.ic);
            n.setBoxSize(80, m.getHeight());
            n.setAlign(1, 0);
            n.setLineHeightOffset(-3);
            n.setText(Numeric.toStr(BOX_STAR_THRESHOLDS[g - 1]));
            n.setFontSize((m.getHeight() | 0) * 1.2);
            n.setX(m.getX() - 80);
            n.setY(m.getY());
          }
          if (LevelState.season == 3 && f == this.visibleBoxes - 1) {
            new Sprite(q, Resources.Yb, Keys.qJ);
            m = new TextNode(q, Resources.ic);
            m.setText(this.tr("MECH_HARDEST"));
            m.setBoxSize(184, 60);
            m.setFontSize(36);
            m.setAlign(0);
            m.setX(253);
            m.setY(425);
            m.setRotation(-16);
          }
        }
        if (!p && LevelState.boxStars(g) == 75) {
          new Sprite(q, Resources.Yb, Keys.dJ);
        }
        if (p && LevelState.season < 3) {
          g = new TextNode(h, Resources.ic);
          g.setBoxSize(300, 100);
          g.setX(100);
          g.setY(206);
          g.setText(a[f]);
          g.setFontSize(60);
          g.setMultiline(true);
          g.setYOffsetPerLine(-40);
          g.setAlign(0, 0);
          h.centerOrigin();
          h.setRotation(15);
        } else {
          h = new TextNode(q, Resources.ic);
          h.setBoxSize(400, 200);
          h.setX(56);
          h.setText(a[f]);
          h.setFontSize(70);
          h.setMultiline(true);
          h.setAlign(0);
          h.setYOffsetPerLine(-30);
          h.shape();
          h.setY(h.lineCount() == 1 ? 110 : 90);
        }
        c += this.advance;
      }
      this.arrows = [];
      for (a = 0; a < 2;) {
        ++a;
        b = new Sprite(null, Resources.Wa, Keys.mz);
        b.center();
        this.layout.appendChild(b);
        this.arrows.push(b);
      }
      this.addBackButton();
      this.scoreLabel = this.add(ScoreLabel);
      a = LevelState.seasonStars();
      this.scoreLabel.setText(a == null ? "null" : "" + a);
      this.hitArea = new HitTestRect(this.layout.node, new Bounds(145, 145, 505, 505));
      this.updateArrows();
      this.canScroll = true;
      this.scrolling = false;
      this.firstFrame = true;
    }
    goToLevelSelect() {
      this.push(SelectLevelScene);
    }
    updateArrows() {
      if (this.boxIdx > 1) {
        this.arrows[0].setFrame(Keys.mz);
        this.arrows[0].setBlendMode(1);
      } else {
        this.arrows[0].setFrame(Keys.cL);
        this.arrows[0].setBlendMode(2);
      }
      if (this.boxIdx == this.totalBoxes) {
        this.arrows[1].setFrame(Keys.aL);
        this.arrows[1].setBlendMode(2);
      } else {
        this.arrows[1].setFrame(Keys.bL);
        this.arrows[1].setBlendMode(1);
      }
      this.arrows[0].setUniformScale(1);
      this.arrows[1].setUniformScale(1);
    }
    scrollLeft() {
      this.scrollDir = -1;
      this.updateLockState();
      this.setState(1);
      this.scrollTargetX = -(this.boxIdx - 1) * this.advance;
      this.x1 = this.scrollTargetX - this.advance * this.scrollDir;
      this.scrollTargetX += this.offsetX;
      this.x1 += this.offsetX;
      this.canScroll = this.boxIdx != this.totalBoxes || LevelState.season == 3;
      this.boxIdx--;
      this.updateArrows();
      this.arrows[0].setUniformScale(0.9);
    }
    scrollRight() {
      this.scrollDir = 1;
      this.updateLockState();
      this.setState(1);
      this.scrollTargetX = -(this.boxIdx - 1) * this.advance;
      this.x1 = this.scrollTargetX - this.advance * this.scrollDir;
      this.scrollTargetX += this.offsetX;
      this.x1 += this.offsetX;
      this.canScroll = this.boxIdx != this.visibleBoxes;
      this.boxIdx++;
      this.updateArrows();
      this.arrows[1].setUniformScale(0.9);
    }
    update(a) {
      super.update(a);
      if (this.lifecycle == "Running") {
        var b = this.app.pointer().justPressed(0);
        a = this.app.pointer().justReleased(0);
        switch (this.state) {
          case 0:
            if (this.time > (this.firstFrame ? 1 : 0) && !this.scrolling) {
              this.scrolling = true;
              this.firstFrame = false;
              this.jumpToBox();
            }
            if (this.dragActive) {
              var c = this.app.pointer().position[0];
              this.dragDeltaX = c.x - this.dragStartPos.x;
              if (Math.abs(c.y - this.dragStartPos.y) < 50) {
                if (this.dragDeltaX < -100 && this.boxIdx < this.totalBoxes) {
                  this.dragActive = false;
                  this.scrollRight();
                }
                if (this.dragDeltaX > 100 && this.boxIdx > 1) {
                  this.dragActive = false;
                  this.scrollLeft();
                }
              }
            }
            c = this.hitArea.hitTest(this.pointer.pos);
            var d = this.arrows[0].hitTest(this.pointer.pos);
            let e = this.arrows[1].hitTest(this.pointer.pos);
            if (b) {
              this.buttons[0].blur();
              this.canScrollLeft = this.boxIdx > 1 && d;
              this.canScrollRight = this.boxIdx < this.totalBoxes && e;
              this.canSelectBox = this.boxIdx <= this.totalBoxes && c;
              this.dragActive = true;
              b = this.pointer.pos;
              this.dragStartPos = new Vec4(b.x, b.y, 0, 1);
              this.dragDeltaX = 0;
            }
            if (a) {
              if (this.canScrollLeft && d) {
                this.scrollLeft();
                SoundFx.play(SoundFx.button);
              }
              if (this.canScrollRight && e) {
                this.scrollRight();
                SoundFx.play(SoundFx.button);
              }
              this.dragActive = this.canScrollRight = this.canScrollLeft = false;
              if (this.canSelectBox && c && Math.abs(this.dragDeltaX) < 10) {
                SoundFx.play(SoundFx.button);
                if (this.boxIdx > this.visibleBoxes) {
                  if (this.lockReached()) {
                    this.setState(4);
                  }
                } else {
                  a = this.boxFor(this.boxIdx - 1);
                  if (LevelState.isBoxLocked(a)) {
                    this.sharedState.starCount = LevelState.starsNeededForBox(a);
                    this.pushOver(MissingStarsPopup);
                  } else {
                    if (LevelState.box != a) {
                      this.releaseBoxTextures(LevelState.box);
                    }
                    LevelState.setBox(a);
                    this.goToLevelSelect();
                    this.setState(4);
                  }
                }
              }
            }
            break;
          case 1:
            c = this.boxFor(this.boxIdx - 1);
            if (!(c <= 17) || !LevelState.isBoxLocked(c) || !LevelState.canUnlockBox(c)) {
              c = this.arrows[0].hitTest(this.pointer.pos);
              d = this.arrows[1].hitTest(this.pointer.pos);
              if (b) {
                this.canScrollLeft = this.boxIdx > 1 && c;
                this.canScrollRight = this.boxIdx < this.totalBoxes && d;
              }
              if (a) {
                if (this.canScrollLeft && c) {
                  this.omNom.setX(-(this.x1 - this.offsetX));
                  this.scrollLeft();
                  SoundFx.play(SoundFx.button);
                }
                if (this.canScrollRight && d) {
                  this.omNom.setX(-(this.x1 - this.offsetX));
                  this.scrollRight();
                  SoundFx.play(SoundFx.button);
                }
                this.canScrollRight = this.canScrollLeft = false;
              }
            }
            a = this.progress(0.2);
            b = this.scrollTargetX;
            this.boxContainer.setX(b + (this.x1 - b) * Easing.quadOut()(a));
            b = -(this.boxContainer.getX() - this.offsetX);
            if (this.canScroll) {
              this.omNom.setX(b);
              b = b + this.scrollTargetX - this.offsetX;
              if (this.scrollDir > 0) {
                if (b > this.advance / 2) {
                  c = this.clipPath;
                  b = this.advance - b;
                  d = c.right - c.left;
                  c.left = b;
                  c.right = b + d;
                } else {
                  c = this.clipPath;
                  b = -b;
                  d = c.right - c.left;
                  c.left = b;
                  c.right = b + d;
                }
              } else {
                b = -b;
                if (b > this.advance / 2) {
                  c = this.clipPath;
                  b = -this.advance + b;
                  d = c.right - c.left;
                  c.left = b;
                  c.right = b + d;
                } else {
                  c = this.clipPath;
                  d = c.right - c.left;
                  c.left = b;
                  c.right = b + d;
                }
              }
              this.omNom.setClipBounds(this.clipPath);
            } else {
              this.omNom.setClipBounds(null);
            }
            if (a == 1) {
              this.scrolling = false;
              this.setState(2);
              this.updateArrows();
            }
            break;
          case 2:
            a = this.boxFor(this.boxIdx - 1);
            if (LevelState.isBoxLocked(a) && LevelState.canUnlockBox(a)) {
              this.jumpToBox();
              this.setState(3);
              this.boxes[this.boxIdx - 1].childByName("lock").moveToTop();
              SoundFx.play(SoundFx.star_1);
              b = new PuffEffect();
              c = this.viewportBounds;
              b.container.setX((c.left + c.right) / 2);
              d = c = this.viewportBounds;
              b.container.setY((c.top + c.bottom) / 2 + (d.bottom - d.top) * 0.15);
              this.addChild(b);
              this.node.appendChild(b.container.node);
              LevelState.unlockBox(a);
            } else {
              this.setState(0);
            }
            break;
          case 3:
            a = this.boxes[this.boxIdx - 1].childByName("lock");
            b = this.progress(1.5);
            a.setUniformScale(1 + b * 0.5);
            a.setAlpha(1 - b);
            a.setColorTransform(new ColorTransform().brightness(-b * 0.5));
            if (b == 1) {
              this.setState(0);
            }
        }
      }
    }
    setState(a) {
      this.state = a;
      this.time = 0;
    }
    jumpToBox() {
      this.boxBounceAnim = this.addChild(new BounceAnim(this.boxes[this.boxIdx - 1]));
      this.omNomBounceAnim = this.addChild(new BounceAnim(this.omNom));
    }
    updateLockState() {
      if (this.boxBounceAnim != null) {
        this.boxBounceAnim.dispose();
        this.omNomBounceAnim.dispose();
        this.omNomBounceAnim = this.boxBounceAnim = null;
      }
    }
    boxFor(a) {
      a += 1;
      if (LevelState.season == 2) {
        a += 5;
      }
      if (LevelState.season == 3) {
        a += 10;
      }
      return a;
    }
    lockReached() {
      return false;
    }
    getTransitionDuration(a) {
      if (a != null && a instanceof MissingStarsPopup) {
        return 1.5;
      } else {
        return super.getTransitionDuration(a);
      }
    }
    start() {
      super.start();
      this.startMenuMusic();
      this.release(Loader.menuBg2);
      Resources.we = null;
      Resources.Sz = null;
      if (this.caller != null && this.caller.sharedState.boxComplete && LevelState.box != 17) {
        this.scrollRight();
      }
    }
    layout() {
      super.layout();
      this.updateLockState();
      this.advance = 500;
      let a = this.director.aspectRatio();
      if (!(a < 0.6)) {
        this.advance *= Math.min(1.5, remap(a, 0.6, 2, 1, 1.2));
      }
      var b = 0;
      for (var c = 0, d = this.bgRects; c < d.length;) {
        let e = d[c];
        ++c;
        e.setX(100 + b);
        e.setAlpha(0.5);
        b += this.advance;
      }
      c = b = 0;
      for (d = this.boxes; c < d.length;) {
        d[c++].setX(b);
        b += this.advance;
      }
      this.boxContainer.setX(-(this.boxIdx - 1) * this.advance + this.offsetX);
      if (this.canScroll) {
        this.omNom.setX(-(this.boxContainer.getX() - this.offsetX));
        this.setState(0);
      }
      b = this.arrows[0];
      c = this.arrows[1];
      if (a > 0.7) {
        b.setX(50);
        b.setY(325);
        c.setX(600);
        c.setY(325);
      } else {
        b.setX(250);
        b.setY(650);
        c.setX(400);
        c.setY(650);
      }
      this.findNode(ScoreLabel, this).layout();
    }
    handleInput() {
      if (this.consumeClick(0)) {
        this.backToSeasonSelect();
      }
    }
    backToSeasonSelect() {
      this.push(SelectSeasonScene);
    }
    getName() {
      return "SelectBoxScene";
    }
  }
  SelectBoxScene.i = true;
  SelectBoxScene.s = Scene;
  Object.assign(SelectBoxScene.prototype, {
    l: SelectBoxScene
  });
  class Season1Scene extends SelectBoxScene {
    constructor() {
      super();
    }
    getPreloads() {
      return super.getPreloads().concat([Loader.menuSeason1, Loader.menuSeason1Json]);
    }
    loadTextures() {
      super.loadTextures();
      Resources.Yb = this.createTexture(Loader.menuSeason1);
    }
    lockReached() {
      this.push(Season2Scene);
      return true;
    }
    seasonLabels() {
      let a = this.trAll("BOX1_LABEL", "BOX2_LABEL", "BOX3_LABEL", "BOX4_LABEL", "BOX5_LABEL", "NEXT_SEASON");
      let b = 0;
      while (b < 5) {
        let c = b++;
        a[c] = c + 1 + ". " + a[c];
      }
      return a;
    }
    seasonKeys() {
      return [Keys.VI, Keys.WI, Keys.XI, Keys.YI, Keys.ZI, Keys.Xy];
    }
    getName() {
      return "Season1Scene";
    }
  }
  Season1Scene.i = true;
  Season1Scene.s = SelectBoxScene;
  Object.assign(Season1Scene.prototype, {
    l: Season1Scene
  });
  class CTRCSeason1Scene extends Season1Scene {
    constructor() {
      super();
    }
    lockReached() {
      this.push(CTRCSeason2Scene);
      return true;
    }
    backToSeasonSelect() {
      this.push(CTRCSelectSeasonScene);
    }
    goToLevelSelect() {
      this.push(CTRCSelectLevelScene);
    }
    getName() {
      return "CTRCSeason1Scene";
    }
  }
  CTRCSeason1Scene.i = true;
  CTRCSeason1Scene.s = Season1Scene;
  Object.assign(CTRCSeason1Scene.prototype, {
    l: CTRCSeason1Scene
  });
  class Season2Scene extends SelectBoxScene {
    constructor() {
      super();
    }
    getPreloads() {
      return super.getPreloads().concat([Loader.menuSeason2, Loader.menuSeason2Json]);
    }
    init() {
      if (this.caller != null && this.caller instanceof Season1Scene) {
        LevelState.setSeason(2);
        this.releaseBoxTextures(LevelState.box);
        LevelState.setBox(6);
      }
      super.init();
    }
    start() {
      super.start();
      this.release(40);
    }
    loadTextures() {
      super.loadTextures();
      Resources.Yb = this.createTexture(Loader.menuSeason2);
    }
    lockReached() {
      this.push(Season3Scene);
      return true;
    }
    seasonLabels() {
      let a = this.trAll("BOX6_LABEL", "BOX7_LABEL", "BOX8_LABEL", "BOX9_LABEL", "BOX10_LABEL", "NEXT_SEASON");
      let b = 0;
      while (b < 5) {
        let c = b++;
        a[c] = c + 1 + 5 + ". " + a[c];
      }
      return a;
    }
    seasonKeys() {
      return [Keys.fJ, Keys.gJ, Keys.hJ, Keys.iJ, Keys.eJ, Keys.Xy];
    }
    getName() {
      return "Season2Scene";
    }
  }
  Season2Scene.i = true;
  Season2Scene.s = SelectBoxScene;
  Object.assign(Season2Scene.prototype, {
    l: Season2Scene
  });
  class CTRCSeason2Scene extends Season2Scene {
    constructor() {
      super();
    }
    lockReached() {
      this.push(CTRCSeason3Scene);
      return true;
    }
    backToSeasonSelect() {
      this.push(CTRCSelectSeasonScene);
    }
    goToLevelSelect() {
      this.push(CTRCSelectLevelScene);
    }
    getName() {
      return "CTRCSeason2Scene";
    }
  }
  CTRCSeason2Scene.i = true;
  CTRCSeason2Scene.s = Season2Scene;
  Object.assign(CTRCSeason2Scene.prototype, {
    l: CTRCSeason2Scene
  });
  class Season3Scene extends SelectBoxScene {
    constructor() {
      super();
    }
    getPreloads() {
      return super.getPreloads().concat([Loader.menuSeason3, Loader.menuSeason3Json]);
    }
    init() {
      if (this.caller != null && this.caller instanceof Season2Scene) {
        LevelState.setSeason(3);
        this.releaseBoxTextures(LevelState.box);
        LevelState.setBox(11);
      }
      super.init();
    }
    start() {
      super.start();
      this.release(38);
    }
    loadTextures() {
      super.loadTextures();
      Resources.Yb = this.createTexture(Loader.menuSeason3);
    }
    seasonLabels() {
      let a = this.trAll("BOX11_LABEL", "BOX12_LABEL", "BOX13_LABEL", "BOX14_LABEL", "BOX15_LABEL", "BOX16_LABEL", "BOX17_LABEL");
      let b = 0;
      while (b < 7) {
        let c = b++;
        a[c] = c + 1 + 10 + ". " + a[c];
      }
      return a.slice(0, 7);
    }
    seasonKeys() {
      return [Keys.jJ, Keys.kJ, Keys.lJ, Keys.mJ, Keys.nJ, Keys.oJ, Keys.pJ].slice(0, 7);
    }
    getName() {
      return "Season3Scene";
    }
  }
  Season3Scene.i = true;
  Season3Scene.s = SelectBoxScene;
  Object.assign(Season3Scene.prototype, {
    l: Season3Scene
  });
  class CTRCSeason3Scene extends Season3Scene {
    constructor() {
      super();
    }
    backToSeasonSelect() {
      this.push(CTRCSelectSeasonScene);
    }
    goToLevelSelect() {
      this.push(CTRCSelectLevelScene);
    }
    getName() {
      return "CTRCSeason3Scene";
    }
  }
  CTRCSeason3Scene.i = true;
  CTRCSeason3Scene.s = Season3Scene;
  Object.assign(CTRCSeason3Scene.prototype, {
    l: CTRCSeason3Scene
  });
