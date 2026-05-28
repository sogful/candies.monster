  class LevelClearedOverlay extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      return [Loader.fontDat, Loader.fontImg, Loader.menuBg, Loader.menuUi, Loader.menuUiJson];
    }
    replacesPrevious() {
      return false;
    }
    init() {
      super.init();
      this.setSize(600, 900);
      var a = this.caller.sharedState.stars;
      this.bonusStar = this.caller.sharedState.blueStar;
      var b = this.trAll("LEVEL_CLEARED1", "LEVEL_CLEARED2", "LEVEL_CLEARED3", "LEVEL_CLEARED4")[a];
      var c = new TextNode(this.layout, Resources.ic);
      c.setBoxSize(600, 60);
      c.setText(b);
      c.setAlign(0);
      c.autoFit();
      c.setY(140);
      b = [];
      for (c = 0; c < 4;) {
        ++c;
        b.push(new Sprite(this.layout, Resources.Wa, Keys.oL));
      }
      this.stars = b;
      b = 0;
      for (c = this.stars; b < c.length;) {
        c[b++].center();
      }
      if (this.bonusStar) {
        this.starScales = [0.9, 1, 1, 0.9];
        this.stars[0].setX(142);
        this.stars[0].setY(337);
        this.stars[1].setX(244);
        this.stars[1].setY(316);
        this.stars[2].setX(360);
        this.stars[2].setY(316);
        this.stars[3].setX(461);
        this.stars[3].setY(337);
      } else {
        this.starScales = [0.9, 1, 0.9];
        this.stars[0].setX(180);
        this.stars[0].setY(291);
        this.stars[1].setX(300);
        this.stars[1].setY(273);
        this.stars[2].setX(420);
        this.stars[2].setY(291);
      }
      for (b = 0; b < 4;) {
        c = b++;
        this.stars[c].setAlpha(0);
        this.stars[c].setUniformScale(0);
      }
      for (b = 0; b < a;) {
        this.stars[b++].setFrame(Keys.nL);
      }
      if (this.bonusStar) {
        this.stars[3].setFrame(Keys.pK);
      }
      a = new Sprite(this.layout, Resources.Wa, Keys.WK);
      a.setX(190);
      a.setY(400);
      this.pictureUnlocked = LevelState.tryUnlockPicture();
      // preview bridge: in custom-level mode the level is locked to one,
      // so the album/quit/next-level buttons make no sense - show only
      // restart, centered in the first row. buttons[] still receives all
      // four so Pd()'s hb(1..4) indices stay aligned.
      let _customlevel = window.customleveldata != null;
      a = new AlbumButton();
      a.setX(59);
      a.setY(640);
      if (!_customlevel) {
        this.layout.appendChild(a.container);
        this.addChild(a);
      }
      this.buttons.push(a);
      a = ButtonBase.create(null, Keys.Uk, Keys.Vk, Keys.lz);
      a.setX(219);
      a.setY(640);
      if (!_customlevel) {
        this.layout.appendChild(a.container);
        this.addChild(a);
      }
      this.buttons.push(a);
      a = ButtonBase.create(null, Keys.Uk, Keys.Vk, Keys.oz);
      a.setX(_customlevel ? 300 : 379);
      a.setY(640);
      this.layout.appendChild(a.container);
      this.buttons.push(a);
      this.addChild(a);
      a = ButtonBase.create(null, Keys.Rt, Keys.St, Keys.dL);
      a.setX(188.5);
      a.setY(750);
      if (!_customlevel) {
        this.layout.appendChild(a.container);
        this.addChild(a);
      }
      this.buttons.push(a);
      // focus restart in custom-level mode (buttons[3]) since the
      // next-level button (buttons[4]) is hidden.
      if (_customlevel) {
        this.buttons[3].focus();
      } else {
        a.focus();
      }
      if (LevelState.box == 17 && LevelState.level == 25) {
        a.setVisible(false);
      }
      if (this.pictureUnlocked) {
        this.setState(0);
      } else {
        this.setState(1);
      }
    }
    start() {
      super.start();
      if (this.caller instanceof LevelScene && (SoundFx.play(SoundFx.win), LevelState.allLevelsCleared() && LevelState.box == 17 && LevelState.level == 25)) {
        this.pushOver(OutroVideoScene);
        return;
      }
      if (this.caller instanceof OutroVideoScene) {
        Save.gameWon = true;
        Save.flush();
        this.setState(7);
      } else if (this.caller instanceof PictureRevealScene) {
        this.setState(1);
      } else if (this.pictureUnlocked) {
        this.pictureUnlocked = false;
        this.sharedState.pictureIndex = null;
        this.sharedState.available = true;
        this.sharedState.ui = true;
        this.pushOver(PictureRevealScene);
      }
    }
    layout() {
      super.layout();
      let a = LevelCurtain.instance;
      if (a != null) {
        a.layout();
      }
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 1:
          // Pop every star in at once instead of one-per-quarter-second,
          // then go straight to state 7 (interactive, button bounces).
          // The original "stagger 0.25s × 4 + wait 1s before bounce"
          // sequence was ~2.25s of dead time on top of the scene fade.
          this.animateStarIn(1);
          this.animateStarIn(2);
          this.animateStarIn(3);
          if (this.bonusStar) this.animateStarIn(4);
          this.addChild(new BounceAnim(this.buttons[4].container, 2));
          this.setState(7);
          break;
        case 8:
          a = this.progress(0.3);
          this.fadeState().setAlpha(1 - a);
          if (a == 1) {
            this.stopAllMusic();
            LevelCurtain.instance.playCloseAnim();
            this.setState(9);
          }
          break;
        case 9:
          if (LevelCurtain.instance.state == 0) {
            this.setState(10);
            this.onBackOrNext();
          }
      }
    }
    transitionIn(a) {
      this.fadeState().setAlpha(a);
    }
    transitionOut(a) {
      this.fadeState().setAlpha(1 - a);
    }
    handleInput() {
      if (this.state != 0 && !(this.state > 7)) {
        if (this.consumeClick(1)) {
          this.goToPictures();
        }
        if (this.consumeClick(2)) {
          this.onContinueButton();
        }
        if (this.consumeClick(3)) {
          this.onRestartButton();
        }
        if (this.consumeClick(4)) {
          if (LevelState.isLastLevel()) {
            if (LevelState.isLastLevel()) {
              this.sharedState.boxComplete = true;
              this.goToBoxSelect();
            } else {
              this.time = 0;
            }
          } else {
            LevelState.goToNextLevel();
            this.popBack();
          }
        }
      }
    }
    goToPictures() {
      this.push(PicturesScene);
    }
    animateStarIn(a) {
      --a;
      this.stars[a].tween().alpha(1, 0.3);
      this.stars[a].tween().scale(this.starScales[a], 0.3, Easing.backOut(0.1));
    }
    goToBoxSelect() {
      if (LevelState.season == 1) {
        this.push(Season1Scene);
      } else if (LevelState.season == 2) {
        this.push(Season2Scene);
      } else if (LevelState.season == 3) {
        this.push(Season3Scene);
      }
    }
    popBack() {
      this.pop();
    }
    onRestartButton() {
      this.restartFlow();
    }
    onContinueButton() {
      this.startContinueTransition();
    }
    startContinueTransition() {
      this.setState(8);
    }
    restartFlow() {
      this.sharedState.restart = true;
      this.pop();
    }
    setState(a) {
      this.state = a;
      this.time = 0;
    }
    onBackOrNext() {
      if (LevelState.isLastLevel()) {
        this.sharedState.boxComplete = true;
        if (LevelState.season == 1) {
          this.push(Season1Scene);
        } else if (LevelState.season == 2) {
          this.push(Season2Scene);
        } else if (LevelState.season == 3) {
          this.push(Season3Scene);
        }
      } else {
        this.push(SelectLevelScene);
      }
    }
    getName() {
      return "LevelClearedOverlay";
    }
  }
  LevelClearedOverlay.i = true;
  LevelClearedOverlay.s = Scene;
  Object.assign(LevelClearedOverlay.prototype, {
    l: LevelClearedOverlay
  });
  class CTRCLevelClearedOverlay extends LevelClearedOverlay {
    constructor() {
      super();
    }
    init() {
      super.init();
      // Was: this.hideButtons() - hid every button on entry so the (removed)
      // state-6 -> 1s DelayedCall -> trackLevelSuccess -> interstitial
      // -> wS() chain could reveal them after the ad. With ads and
      // analytics stripped and the state machine collapsed straight
      // to state 7, that reveal never fired, leaving the buttons
      // permanently hidden. Just keep them visible from the start.
    }
    onRestartButton() {
      // preview bridge: skip the SDK tracking/interstitial chain in
      // custom-level mode so restart fires immediately.
      if (window.customleveldata != null) {
        this.restartFlow();
        return;
      }
      this.hideButtons();
      let a = this;
      SDK.trackLevelRestart(currentLevelId(), function () {
        SDK.showInterstitialAd("button:results:restart", cachedBind(a, a.Of));
      });
    }
    goToBoxSelect() {
      if (LevelState.season == 1) {
        this.push(CTRCSeason1Scene);
      } else if (LevelState.season == 2) {
        this.push(CTRCSeason2Scene);
      } else if (LevelState.season == 3) {
        this.push(CTRCSeason3Scene);
      }
    }
    popBack() {
      this.hideButtons();
      let a = this;
      SDK.showInterstitialAd("button:results:next", function () {
        SDK.trackLevelStart(currentLevelId(), function () {
          a.pop(null);
        });
      });
    }
    onContinueButton() {
      this.hideButtons();
      SDK.showInterstitialAd("button:results:quit", cachedBind(this, this.ep));
    }
    onBackOrNext() {
      if (LevelState.isLastLevel()) {
        this.sharedState.boxComplete = true;
        if (LevelState.season == 1) {
          this.push(CTRCSeason1Scene);
        } else if (LevelState.season == 2) {
          this.push(CTRCSeason2Scene);
        } else if (LevelState.season == 3) {
          this.push(CTRCSeason3Scene);
        }
      } else {
        this.push(CTRCSelectLevelScene);
      }
    }
    goToPictures() {
      this.push(CTRCPicturesScene);
    }
    getName() {
      return "CTRCLevelClearedOverlay";
    }
  }
  CTRCLevelClearedOverlay.i = true;
  CTRCLevelClearedOverlay.s = LevelClearedOverlay;
  Object.assign(CTRCLevelClearedOverlay.prototype, {
    l: CTRCLevelClearedOverlay
  });
  class LevelLostOverlay extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      return [Loader.fontDat, Loader.fontImg, Loader.menuBg, Loader.menuUi, Loader.menuUiJson];
    }
    replacesPrevious() {
      return false;
    }
    init() {
      super.init();
      this.setSize(600, 900);
      var a = this.tr("LEVEL_FAILED");
      var b = new TextNode(this.layout, Resources.ic);
      b.setBoxSize(600, 160);
      b.setMultiline(true);
      b.setFontSize(60);
      b.setText(a);
      b.setAlign(0);
      b.setY(140);
      a = this.caller.sharedState.count;
      b = 0;
      if (a > 3) {
        b = 1;
      }
      if (a > 5) {
        b = 2;
      }
      a = new Sprite(this.layout, Resources.Wa, [Keys.XK, Keys.YK, Keys.ZK][b]);
      a.setX(190);
      a.setY(320);
      a = ButtonBase.create(null, Keys.Uk, Keys.Vk, Keys.lz);
      a.setX(139);
      a.setY(560);
      this.layout.appendChild(a.container);
      this.buttons.push(a);
      this.addChild(a);
      a = ButtonBase.create(null, Keys.Uk, Keys.Vk, Keys.oz);
      a.setX(299);
      a.setY(560);
      this.layout.appendChild(a.container);
      this.buttons.push(a);
      this.addChild(a);
      a.focus();
      this.state = 0;
    }
    layout() {
      super.layout();
      let a = LevelCurtain.instance;
      if (a != null) {
        a.layout();
      }
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 1:
          a = this.progress(0.3);
          this.fadeState().setAlpha(1 - a);
          if (a == 1) {
            this.stopAllMusic();
            LevelCurtain.instance.playCloseAnim();
            this.setState(2);
          }
          break;
        case 2:
          if (LevelCurtain.instance.state == 0) {
            this.setState(3);
            this.onBackOrNext();
          }
      }
    }
    transitionIn(a) {
      this.fadeState().setAlpha(a);
    }
    transitionOut(a) {
      this.fadeState().setAlpha(1 - a);
    }
    handleInput() {
      if (!(this.state > 0)) {
        if (this.consumeClick(1)) {
          this.onContinueButton();
        }
        if (this.consumeClick(2)) {
          this.onRestartButton();
        }
      }
    }
    onRestartButton() {
      this.restartFlow();
    }
    onContinueButton() {
      this.startContinueTransition();
    }
    startContinueTransition() {
      this.setState(1);
      this.time = 0;
    }
    restartFlow() {
      this.sharedState.restart = true;
      this.pop();
    }
    setState(a) {
      this.state = a;
    }
    onBackOrNext() {
      if (LevelState.isLastLevel()) {
        this.sharedState.boxComplete = true;
        if (LevelState.season == 1) {
          this.push(Season1Scene);
        } else if (LevelState.season == 2) {
          this.push(Season2Scene);
        } else if (LevelState.season == 3) {
          this.push(Season3Scene);
        }
      } else {
        this.push(SelectLevelScene);
      }
    }
    getName() {
      return "LevelLostOverlay";
    }
  }
  LevelLostOverlay.i = true;
  LevelLostOverlay.s = Scene;
  Object.assign(LevelLostOverlay.prototype, {
    l: LevelLostOverlay
  });
  class CTRCLevelLostOverlay extends LevelLostOverlay {
    constructor() {
      super();
    }
    onRestartButton() {
      // preview bridge: skip the SDK tracking/interstitial chain in
      // custom-level mode so restart fires immediately.
      if (window.customleveldata != null) {
        this.restartFlow();
        return;
      }
      this.hideButtons();
      let a = this;
      SDK.trackLevelRestart(currentLevelId(), function () {
        SDK.showInterstitialAd("button:results:restart", cachedBind(a, a.Of));
      });
    }
    onContinueButton() {
      this.hideButtons();
      SDK.showInterstitialAd("button:failed:quit", cachedBind(this, this.ep));
    }
    onBackOrNext() {
      if (LevelState.isLastLevel()) {
        this.sharedState.boxComplete = true;
        if (LevelState.season == 1) {
          this.push(CTRCSeason1Scene);
        } else if (LevelState.season == 2) {
          this.push(CTRCSeason2Scene);
        } else if (LevelState.season == 3) {
          this.push(CTRCSeason3Scene);
        }
      } else {
        this.push(CTRCSelectLevelScene);
      }
    }
    getName() {
      return "CTRCLevelLostOverlay";
    }
  }
  CTRCLevelLostOverlay.i = true;
  CTRCLevelLostOverlay.s = LevelLostOverlay;
  Object.assign(CTRCLevelLostOverlay.prototype, {
    l: CTRCLevelLostOverlay
  });

  class MissingStarsPopup extends Scene {
    constructor() {
      super();
    }
    init() {
      super.init();
      this.popupBg = new Container();
      var a = new Sprite(this.popupBg, Resources.Wa, Keys.nz);
      var b = new Sprite(this.popupBg, Resources.Wa, Keys.jL);
      var c = new Sprite(this.popupBg, Resources.Wa, Keys.fL);
      b.setHeight(500);
      b.setY(a.size.y - 1);
      c.setY(b.getY() + 500 - 1);
      this.popupBg.center();
      a = ButtonBase.create(null, Keys.gL, Keys.hL, Keys.iL);
      this.buttons.push(a);
      a.setX(680);
      a.setY(-20);
      this.popupBg.appendChild(a.container);
      this.addChild(a);
      b = new TextNode(this.popupBg, Resources.ic);
      b.setText(Strings.get("CANT_UNLOCK_TEXT1"));
      b.setX(20);
      b.setY(60);
      b.setAlign(0);
      b.setBoxSize(760, 100);
      b.setFontSize(80);
      a = new TextNode(this.popupBg, Resources.ic);
      a.setText(Numeric.toStr(this.caller.sharedState.starCount));
      a.setX(20);
      a.setY(b.getY() + 90);
      a.setAlign(0);
      a.setBoxSize(760, 100);
      a.setFontSize(80);
      b = new Sprite(this.popupBg, Resources.Wa, Keys.Tt);
      c = a.boundingBox();
      b.setUniformScale(0.8);
      b.setX(c.right);
      b.setY((c.top + c.bottom) / 2 - b.getHeight() / 2);
      b = new TextNode(this.popupBg, Resources.ic);
      b.setText(Strings.get("CANT_UNLOCK_TEXT2"));
      b.setX(20);
      b.setY(a.getY() + 90);
      b.setAlign(0);
      b.setBoxSize(760, 100);
      b.setFontSize(80);
      a = new TextNode(this.popupBg, Resources.ji);
      a.setText(Strings.get("CANT_UNLOCK_TEXT3"));
      a.setX(20);
      a.setY(b.getY() + 90 + 40);
      a.setAlign(0);
      a.setMultiline(true);
      a.setBoxSize(760, 140);
      a.setFontSize(60);
      this.node.appendChild(this.popupBg.node);
    }
    getTransitionDuration() {
      return 0.5;
    }
    transitionOut(a) {
      a = Easing.quadOut()(1 - a);
      let b = this.node.localT;
      b.scale.x = b.scale.y = 0.001 + a;
      b.K = b.K & -2 | 500;
    }
    transitionIn(a) {
      a = Easing.elasticOut(0.5, 0.5)(a);
      let b = this.node.localT;
      b.scale.x = b.scale.y = 0.001 + a;
      b.K = b.K & -2 | 500;
    }
    handleInput() {
      if (this.app.keyboard().justPressed(461)) {
        this.pop();
      }
      if (this.consumeClick(1)) {
        this.pop();
      }
    }
    layout() {
      super.layout();
      let a = this.director.viewportRect().fitAspect(1);
      var b = this.node.localT;
      b.translate.x = (a.left + a.right) / 2;
      b.translate.y = (a.top + a.bottom) / 2;
      b.K = b.K & -2 | 496;
      if (this.director.aspectRatio() > 1) {
        this.popupBg.setUniformScale(1);
        b = this.popupBg.getHeight();
        this.popupBg.setUniformScale((a.bottom - a.top) / b * 0.75);
      } else {
        b = 1.1;
        let c = 1 / this.director.aspectRatio();
        if (c < 1) {
          b = c * 1.1;
        }
        this.popupBg.setUniformScale((a.right - a.left) / (Resources.Wa.frames.findByName(Keys.nz).sourceSize.x * b));
      }
    }
    replacesPrevious() {
      return false;
    }
    getName() {
      return "MissingStarsPopup";
    }
  }
  MissingStarsPopup.i = true;
  MissingStarsPopup.s = Scene;
  Object.assign(MissingStarsPopup.prototype, {
    l: MissingStarsPopup
  });
