  class MenuScene extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      let a = [Loader.fontDat, Loader.fontImg, Loader.menuShadow, Loader.menuUi, Loader.menuUiJson, Loader.strings, Loader.menuSalute, Loader.menuSaluteJson, WebApplication.menuMusicId];
      if (WebApplication.xmasMode) {
        a.push(Loader.menuBgXmas);
        a.push(Loader.menuBg2Xmas);
      } else {
        a.push(Loader.menuBg);
        a.push(Loader.menuBg2);
      }
      // Intro video preload removed - the .mp4 files are not shipped, so
      // requesting them at menu init triggers a 404 that stalls the loader.
      // The original line was:
      //   if (LevelState.totalStars() == 0) {
      //     a.push(this.app.window.aspectRatio() > 1 ? Loader.introLandscapeVid : Loader.introPortraitVid);
      //   }
      return a;
    }
    getTransitionDuration(a) {
      if (a instanceof IntroVideoScene) {
        return 0;
      } else {
        return super.getTransitionDuration(a);
      }
    }
    transitionIn(a, b) {
      if (b == null) {
        this.fade.setAlpha(1 - a);
      } else {
        super.transitionIn(a, b);
      }
    }
    addBackground() {
      super.addBackground();
      this.bgFront = new Sprite(null, Resources.Sz);
      this.node.appendChild(this.bgFront.node);
    }
    loadTextures() {
      super.loadTextures();
      let a = WebApplication.xmasMode ? Loader.menuBg2Xmas : Loader.menuBg2;
      if (Loader.isLoaded(a)) {
        Resources.Sz = this.createTexture(a);
      }
    }
    init() {
      super.init();
      this.addBackground();
      this.addCursor();
      this.setSize(600, 900);
      this.leftSilhouette = new Sprite(null, Resources.Wa, Keys.rL);
      this.rightSilhouette = new Sprite(null, Resources.Wa, Keys.JK);
      this.node.appendChild(this.leftSilhouette.node);
      this.node.appendChild(this.rightSilhouette.node);
      this.titleContainer = new Container(null, this.layout);
      this.titleContainer.setX(303);
      this.titleContainer.setY(220);
      this.titleContainer.setUniformScale(0.9);
      if (WebApplication.xmasMode) {
        var a = new Sprite(this.titleContainer, Resources.Wa, Keys.pL);
        a.setX(-230);
        a.setY(-275);
      }
      new Sprite(this.titleContainer, Resources.Wa, Loader.getLanguage() == "ru" ? Keys.UK : Keys.TK).center();
      if (WebApplication.xmasMode) {
        a = new Sprite(this.titleContainer, Resources.Wa, Keys.qL);
        a.setX(-230);
        a.setY(-275);
      }
      this.skinPreview = new Sprite(this.layout, Resources.Wa);
      this.skinPreview.setX(378);
      this.skinPreview.setY(364);
      this.updateSkinPreview();
      this.skinPreview.center();
      this.skinCycleTimer = 0;
      a = LabelledButton.create(this.tr("PLAY"));
      a.setX(65);
      a.setY(500);
      this.layout.appendChild(a.container);
      this.buttons.push(a);
      this.addChild(a);
      a.focus();
      a = ButtonBase.create(null, Keys.Uk, Keys.Vk, Keys.KK);
      a.setX(309);
      a.setY(617);
      this.layout.appendChild(a.container);
      this.buttons.push(a);
      this.addChild(a);
      a = new AlbumButton();
      a.setX(129);
      a.setY(617);
      this.layout.appendChild(a.container);
      this.buttons.push(a);
      this.addChild(a);
      let b = this;
      Audio.once("EContextResumed", function () {
        if (!b.app.audio.isPlaying(WebApplication.menuMusicId)) {
          b.startMenuMusic();
        }
      });
    }
    start() {
      super.start();
      MenuScene.freshBoot = false;
      this.startMenuMusic();
      this.eD();
      if (Save.hint == 1 && X.bool() && LevelState.totalStars() > 3 && this.time > 3) {
        this.addChild(new HintPointerAnim());
      }
      this.release([97, 95, 93, 91, 89][Save.skin]);
      Resources.skinAtlas = null;
      this.playSalute();
      this.resize();
    }
    resize() {
      var a = 0;
      this.designSize.y = 900;
      var b = 0.9;
      var c = this.director.aspectRatio();
      if (c > 1) {
        if (c > 2) {
          c = 2;
        }
        this.designSize.y = remap(c, 1, 2, 900, 650);
        a = remap(c, 1, 2, 0, -80);
        b = remap(c, 1, 2, 0.9, 0.8);
      }
      super.layout();
      this.buttons[1].setY(500 + a);
      this.buttons[2].setY(617 + a);
      this.buttons[3].setY(617 + a);
      this.titleContainer.setUniformScale(b);
      if (WebApplication.xmasMode) {
        this.skinPreview.setX(378);
        this.skinPreview.setY(370);
        if (c > 1.1) {
          a = remap(c, 1.1, 2, 0, 1);
          b = this.skinPreview;
          b.setX(b.getX() - a * 10);
          b = this.skinPreview;
          b.setY(b.getY() - a * 15);
        }
        if (c > 0.6) {
          a = this.skinPreview;
          a.setX(a.getX() - 8);
        }
      } else {
        this.skinPreview.setX(378);
        this.skinPreview.setY(370);
        if (Loader.getLanguage() != "ru") {
          a = this.skinPreview;
          a.setX(a.getX() + 3);
          a = this.skinPreview;
          a.setY(a.getY() + 6);
        }
        if (c > 1.1) {
          a = remap(c, 1.1, 2, 0, 1);
          b = this.skinPreview;
          b.setX(b.getX() - a * 8);
          b = this.skinPreview;
          b.setY(b.getY() - a * 7);
        }
      }
      if (WebApplication.xmasMode && c > 0.6) {
        c = this.titleContainer;
        c.setUniformScale(c.scaleX * 0.85);
      }
      b = this.director.viewportRect();
      c = this.background.getWidth() / this.bgFront.size.x;
      this.bgFront.setUniformScale(c);
      this.bgFront.setX((b.left + b.right) / 2);
      c = this.bgFront;
      c.setX(c.getX() - this.bgFront.getWidth() / 2);
      this.bgFront.setY(this.background.getHeight() - this.bgFront.getHeight());
      if (this.isPortrait) {
        this.bgFront.setY(b.bottom - b.top - this.bgFront.getHeight());
        c = this.bgFront;
        c.setY(c.getY() + this.director.aspectRatio() * this.bgFront.getHeight() * 0.3);
      }
      c = (b.right - b.left) / 2;
      a = 0.2;
      var d = this.director.aspectRatio();
      if (d > 1) {
        a = 0.2 + (d - 1);
        if (a > 0.3) {
          a = 0.3;
        }
      }
      a = new Bounds(0, 0, c, (b.bottom - b.top) * a);
      b = b.bottom;
      let e = a.bottom - a.top;
      a.bottom = b;
      a.top = b - e;
      this.leftButtonsRect = a.fitAspect(1);
      b = d > 1 ? 0.6 : 0.4;
      d = this.leftButtonsRect;
      this.leftSilhouette.setUniformScale((d.right - d.left) * b / this.leftSilhouette.size.x);
      d = this.leftButtonsRect;
      this.leftSilhouette.setX((d.left + d.right) / 2 - this.leftSilhouette.getWidth() / 2);
      this.leftSilhouette.setY(this.leftButtonsRect.bottom - this.leftSilhouette.getHeight() * 1.1);
      this.leftSilhouette.setAlpha(0.5);
      d = a.right - a.left;
      a.left = c;
      a.right = c + d;
      c = this.rightButtonsRect = a.fitAspect(1);
      this.rightSilhouette.setUniformScale((c.right - c.left) * b / this.rightSilhouette.size.x);
      c = this.rightButtonsRect;
      this.rightSilhouette.setX((c.left + c.right) / 2 - this.rightSilhouette.getWidth() / 2);
      this.rightSilhouette.setY(this.rightButtonsRect.bottom - this.rightSilhouette.getHeight() * 1.1);
      this.rightSilhouette.setAlpha(0.5);
    }
    update(a) {
      super.update(a);
      this.resize();
      if (this.findNode(HintPointerAnim, this) == null) {
        this.skinCycleTimer -= a;
        if (this.skinCycleTimer <= 0 && this.app.pointer().justPressed(0) && this.skinPreview.hitTest(this.pointer.pos)) {
          Save.skin = this.nextSkinIndex();
          Save.hint = 0;
          this.updateSkinPreview();
          this.animateSkinPreview();
          SoundFx.play(SoundFx.button);
          Save.flush();
          this.skinCycleTimer = 0.25;
        }
      }
    }
    render(a) {
      super.render(a);
    }
    handleInput() {
      if (this.app.keyboard().justPressed(461)) {
        try {
          PlatformBack.back();
        } catch (a) {}
      }
      if (this.consumeClick(1)) {
        this.play();
      }
      if (this.consumeClick(2)) {
        this.gotoOptions();
      }
      if (this.consumeClick(3)) {
        this.gotoPictures();
      }
    }
    play() {
      if (LevelState.totalStars() == 0) {
        if (this.canPlayIntro()) {
          this.push(IntroVideoScene);
        } else {
          this.push(LevelScene);
        }
      } else {
        this.push(SelectSeasonScene);
      }
    }
    canPlayIntro() {
      return !this.app.isWebView();
    }
    gotoOptions() {
      this.push(OptionsScene);
    }
    gotoPictures() {
      this.push(PicturesScene);
    }
    updateSkinPreview() {
      this.skinPreview.setFrame(Keys.indexed(Keys.IK, Save.skin));
      switch (Save.skin) {
        case 0:
        case 1:
          this.skinPreview.moveToBottom();
          break;
        case 2:
          this.skinPreview.moveToTop();
      }
    }
    nextSkinIndex() {
      let a = Save.skin;
      if (WebApplication.xmasMode) {
        switch (a) {
          case 3:
            a = 4;
            break;
          case 4:
            a = 3;
        }
      } else {
        switch (a) {
          case 0:
            a = 1;
            break;
          case 1:
            a = 2;
            break;
          case 2:
            a = 0;
        }
      }
      return a;
    }
    animateSkinPreview() {
      this.skinPreview.setUniformScale(0.95);
      this.skinPreview.tween().stopAll();
      this.skinPreview.tween().scale(1, 1, Easing.elasticOut(0.1, 0.5));
    }
    eD() {
      if (Save.levelStars[0][0] == 0) {
        if (this.canPlayIntro() && WebApplication.assetsDownloaded) {
          this.app.preloadAssets(IntroVideoScene);
        }
      } else {
        this.app.preloadAssets(SelectSeasonScene);
      }
    }
    getName() {
      return "MenuScene";
    }
  }
  MenuScene.i = true;
  MenuScene.s = Scene;
  Object.assign(MenuScene.prototype, {
    l: MenuScene
  });
  class CTRCMenuScene extends MenuScene {
    constructor() {
      super();
    }
    init() {
      super.init();
      if (!SDK.hasFeature("credits")) {
        this.Mh.setVisible(false);
        this.gh.setVisible(false);
      }
    }
    start() {
      super.start();
      if (!gameReadyFired) {
        gameReadyFired = true;
        SDK.gameReady();
      }
    }
    play() {
      let a = this;
      SDK.showInterstitialAd("button:main:start", function () {
        if (LevelState.totalStars() == 0) {
          if (a.canPlayIntro()) {
            a.push(CTRCIntroVideoScene);
          } else {
            let b = CTRCLevelScene;
            SDK.trackLevelStart(currentLevelId(), function () {
              a.push(b);
            });
          }
        } else {
          a.push(CTRCSelectSeasonScene);
        }
      });
    }
    gotoOptions() {
      this.push(CTRCOptionsScene);
    }
    eD() {
      if (Save.levelStars[0][0] == 0) {
        if (this.canPlayIntro() && WebApplication.assetsDownloaded) {
          this.app.preloadAssets(CTRCIntroVideoScene);
        }
      } else {
        this.app.preloadAssets(CTRCSelectSeasonScene);
      }
    }
    gotoPictures() {
      this.push(CTRCPicturesScene);
    }
    canPlayIntro() {
      if (SDK.hasFeature("intro")) {
        return super.canPlayIntro();
      } else {
        return false;
      }
    }
    getName() {
      return "CTRCMenuScene";
    }
  }
  CTRCMenuScene.i = true;
  CTRCMenuScene.s = MenuScene;
  Object.assign(CTRCMenuScene.prototype, {
    l: CTRCMenuScene
  });
  class OptionsScene extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      return [Loader.fontDat, Loader.fontImg, Loader.menuBg, Loader.menuShadow, Loader.menuUi, Loader.menuUiJson, Loader.strings, WebApplication.menuMusicId];
    }
    init() {
      super.init();
      this.addBackground();
      this.addCursor();
      this.setSize(600, 900);
      this.addBackButton();
      var a = ButtonBase.create(null, Keys.Rt, Keys.St, Keys.mL);
      a.setX(65);
      a.setY(303);
      this.layout.appendChild(a.container);
      this.buttons.push(a);
      this.addChild(a);
      a = ButtonBase.create(null, Keys.Rt, Keys.St, Keys.$K);
      a.setX(311.5);
      a.setY(303);
      this.layout.appendChild(a.container);
      this.buttons.push(a);
      this.addChild(a);
      this.checks = [];
      this.checks[1] = new Sprite(this.layout, Resources.Wa, Keys.pz);
      this.checks[1].setX(65);
      this.checks[1].setY(303);
      this.checks[1].setVisible(false);
      this.checks[2] = new Sprite(this.layout, Resources.Wa, Keys.pz);
      this.checks[2].setX(311.5);
      this.checks[2].setY(303);
      this.checks[2].setVisible(false);
      this.setToggle(1, Save.sfxOn);
      this.setToggle(2, Save.musicOn);
      a = LabelledButton.create(this.tr("LANGUAGE"));
      a.setX(65);
      a.setY(420);
      this.layout.appendChild(a.container);
      this.buttons.push(a);
      this.addChild(a);
      a.focus();
      a = LabelledButton.create(this.tr("RESET"));
      a.setX(65);
      a.setY(537);
      this.layout.appendChild(a.container);
      this.buttons.push(a);
      this.addChild(a);
    }
    start() {
      super.start();
      this.startMenuMusic();
      this.savedLang = Save.language;
      this.langIdx = LANGUAGES.indexOf(this.savedLang);
    }
    layout() {
      let a = this.director.aspectRatio();
      let b = 0;
      this.designSize.y = 900;
      if (a > 1.25) {
        this.designSize.y = 650;
        b = 1 / a * -350;
        if (this.app.isWebOS) {
          b *= 2;
        }
      }
      super.layout();
      this.layout.setY(this.viewportBounds.top + b);
    }
    onStop() {
      super.onStop();
      if (this.savedLang != Save.language) {
        this.app.renderer.release(Resources.ki);
        Resources.textureCache[Loader.fontImg] = null;
        Resources.ki = this.createTexture(Loader.fontImg);
        let a = Resources.langIndex(Save.language, Save.language);
        Resources.ic = Resources.ki.children[a];
        Resources.ji = Resources.ki.children[a + 1];
        this.app.freeReleasedImages();
      }
    }
    handleInput() {
      if (this.consumeClick(0)) {
        Save.flush();
        this.saveAndBack();
      }
      if (this.consumeClick(1)) {
        this.toggleSfx();
      }
      if (this.consumeClick(2)) {
        this.toggleMusic();
      }
      if (this.consumeClick(3)) {
        var a = this.langIdx + 1;
        let b = LANGUAGES.length;
        a %= b;
        if (a < 0) {
          a += b;
        }
        this.langIdx = a;
        Save.setLanguage(LANGUAGES[this.langIdx]);
        Loader.setLanguage(Save.language);
        a = Resources.langIndex(this.savedLang, Save.language);
        Resources.ic = Resources.ki.children[a];
        Resources.ji = Resources.ki.children[a + 1];
        this.buttons[3].refreshFont();
        this.buttons[4].refreshFont();
        this.buttons[3].setSelected(false);
        this.buttons[3].ke = 0;
        this.buttons[3].setLabel(this.tr("LANGUAGE"));
        this.buttons[4].setLabel(this.tr("RESET"));
      }
      if (this.consumeClick(4)) {
        this.resetScene();
      }
    }
    $(a) {
      if (this.savedLang != Save.language) {
        Loader.purge(Loader.fontImg);
        Loader.purge(Loader.fontDat);
      }
      super.push(a);
    }
    resetScene() {
      this.push(ResetScene);
    }
    toggleSfx() {
      Save.sfxOn = !Save.sfxOn;
      this.setToggle(1, Save.sfxOn);
      this.buttons[1].setSelected(false);
      this.buttons[1].ke = 0;
      Save.flush();
    }
    toggleMusic() {
      Save.musicOn = !Save.musicOn;
      if (Save.musicOn) {
        this.app.audio.setMusicVolume(1);
      } else {
        this.app.audio.setMusicVolume(0);
      }
      this.setToggle(2, Save.musicOn);
      this.buttons[2].setSelected(false);
      this.buttons[2].ke = 0;
      Save.flush();
    }
    saveAndBack() {
      this.push(MenuScene);
    }
    setToggle(a, b) {
      let c = this.buttons[a];
      let d = c.icon;
      if (b) {
        d.setColorTransform(null);
      } else {
        d.setColorTransform(new ColorTransform().brightness(-0.5));
      }
      c.icon.setAlpha(b ? 1 : 0.5);
      this.checks[a].setVisible(!b);
    }
    getName() {
      return "OptionsScene";
    }
  }
  OptionsScene.i = true;
  OptionsScene.s = Scene;
  Object.assign(OptionsScene.prototype, {
    l: OptionsScene
  });
  class CTRCOptionsScene extends OptionsScene {
    constructor() {
      super();
    }
    init() {
      super.init();
      if (SDK.hasFeature("external_mute")) {
        this.buttons[1].setVisible(false);
        this.buttons[2].setVisible(false);
      }
      if (SDK.hasFeature("force_english")) {
        this.buttons[3].setVisible(false);
        let a = this.buttons[4].container;
        a.setY(a.getY() - 117);
      }
    }
    Vb() {
      this.push(CTRCMenuScene);
    }
    rE() {
      this.push(CTRCResetScene);
    }
    toggleSfx() {
      super.toggleSfx();
      SDK.trackVolumeChange(Save.musicOn ? 1 : 0, Save.sfxOn ? 1 : 0);
    }
    toggleMusic() {
      super.toggleMusic();
      SDK.trackVolumeChange(Save.musicOn ? 1 : 0, Save.sfxOn ? 1 : 0);
    }
    getName() {
      return "CTRCOptionsScene";
    }
  }
  CTRCOptionsScene.i = true;
  CTRCOptionsScene.s = OptionsScene;
  Object.assign(CTRCOptionsScene.prototype, {
    l: CTRCOptionsScene
  });
  class ResetScene extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      return [Loader.fontDat, Loader.fontImg, Loader.menuBg, Loader.menuShadow, Loader.menuUi, Loader.menuUiJson, Loader.strings];
    }
    init() {
      super.init();
      this.addBackground();
      this.addCursor();
      this.setSize(600, 900);
      this.addBackButton();
      var a = new TextNode(this.layout, Resources.ic);
      a.setX(20);
      a.setY(100);
      a.setFontSize(50);
      a.setMultiline(true);
      a.setAlign(0);
      a.setBoxSize(560, 200);
      a.setText(this.tr("RESET_TEXT"));
      a = new TextNode(this.layout, Resources.ji);
      a.setText(this.tr("RESET_HOLD_TEXT"));
      a.setFontSize(40);
      a.setMultiline(true);
      a.setAlign(0);
      a.setBoxSize(560, 100);
      a.setX(20);
      a.setY(225);
      a = LabelledButton.create(this.tr("YES"));
      a.setX(65);
      a.setY(383);
      this.layout.appendChild(a.container);
      this.buttons.push(a);
      this.addChild(a);
      a.focus();
      a = LabelledButton.create(this.tr("NO"));
      a.setX(65);
      a.setY(500);
      this.layout.appendChild(a.container);
      this.buttons.push(a);
      this.addChild(a);
      this.blink = this.state = 0;
    }
    layout() {
      let a = this.director.aspectRatio();
      let b = 0;
      this.designSize.y = 900;
      if (a > 1.25) {
        this.designSize.y = 650;
        b = 1 / a * -100;
      }
      super.layout();
      this.layout.setY(this.viewportBounds.top + b);
    }
    update(a) {
      super.update(a);
      this.app.keyboard();
      if (this.state == 2) {
        if (!(this.time < 0.1)) {
          this.buttons[1].$w((this.blink & 1) == 0);
          this.blink++;
          this.time = 0;
          if (this.blink == 10) {
            this.state = 3;
            this.gotoMenu();
          }
        }
      } else if (this.pointer.isHovered(1) && this.app.pointer().moved(0)) {
        switch (this.state) {
          case 0:
            this.time = 0;
            this.state = 1;
            break;
          case 1:
            if (this.time > 3) {
              a = Save.language;
              Save.instance.reset();
              Save.setLanguage(a);
              Save.flush();
              LevelState.reset();
              this.state = 2;
              this.blink = this.time = 0;
              this.buttons[1].blur();
            }
        }
      }
    }
    handleInput() {
      if (this.consumeClick(0)) {
        this.gotoMenu();
      }
      if (this.state != 2 && this.consumeClick(1)) {
        this.time = this.state = 0;
        this.buttons[1].setSelected(false);
        this.buttons[1].ke = 0;
      }
      if (this.consumeClick(2)) {
        this.Vb();
      }
    }
    gotoMenu() {
      this.push(MenuScene);
    }
    Vb() {
      this.push(OptionsScene);
    }
    getName() {
      return "ResetScene";
    }
  }
  ResetScene.i = true;
  ResetScene.s = Scene;
  Object.assign(ResetScene.prototype, {
    l: ResetScene
  });
  class CTRCResetScene extends ResetScene {
    constructor() {
      super();
    }
    Vb() {
      this.push(CTRCOptionsScene);
    }
    gotoMenu() {
      this.push(CTRCMenuScene);
    }
    getName() {
      return "CTRCResetScene";
    }
  }
  CTRCResetScene.i = true;
  CTRCResetScene.s = ResetScene;
  Object.assign(CTRCResetScene.prototype, {
    l: CTRCResetScene
  });

  class PauseScene extends Scene {
    constructor() {
      super();
    }
    init() {
      super.init();
      this.dimmer = new ColorRectShape(null, new Vec4(0, 0, 0, 1));
      this.dimmer.setAlpha(0.5);
      this.node.appendChild(this.dimmer.node);
      this.setSize(550, 550);
      var a = ButtonBase.create(null, Keys.hz, Keys.iz, Keys.VK);
      this.buttons.push(a);
      // preview bridge: skip the back-to-menu button in custom-level mode.
      // we still push it into buttons[] to keep the resume button at index 2
      // (Pd() does hb(2) for resume), but don't attach to the scene so it's
      // invisible and hb(1) won't fire.
      if (window.customleveldata == null) {
        a.setX(133.5);
        a.setY(200);
        this.layout.appendChild(a.container);
        this.addChild(a);
      }
      a = ButtonBase.create(null, Keys.hz, Keys.iz, Keys.eL);
      this.buttons.push(a);
      // preview bridge: continue button centered (midpoint of the original
      // two-button row) when the back-to-menu button is hidden.
      a.setX(window.customleveldata != null ? 213.5 : 293.5);
      a.setY(200);
      this.layout.appendChild(a.container);
      this.addChild(a);
      a.focus();
      this.state = 0;
      this.app.audio.setMusicVolume(0);
      SoundFx.stop(SoundFx.electric);
      SoundFx.stop(SoundFx.monster_chewing);
    }
    transitionOut() {}
    getTransitionDuration(a) {
      if (a instanceof SelectLevelScene) {
        return super.getTransitionDuration(a);
      } else {
        return 0;
      }
    }
    handleInput() {
      if (this.state == 0) {
        if (this.consumeClick(1)) {
          this.onQuitButton();
        }
        var a = false;
        if (this.app.keyboard().justPressed(415)) {
          a = true;
        }
        if (this.app.keyboard().justPressed(461) || this.app.keyboard().justPressed(156) || this.app.keyboard().justPressed(112)) {
          this.onResumeButton();
        } else if (this.consumeClick(2) || a) {
          this.onResumeButton();
        }
      }
    }
    onQuitButton() {
      this.quitWithCurtain();
    }
    onResumeButton() {
      this.resume();
    }
    resume() {
      this.app.audio.setMusicVolume(Save.musicOn ? 1 : 0);
      SoundFx.setVolume(SoundFx.monster_chewing, 1);
      this.pop();
    }
    quitWithCurtain() {
      SoundFx.stop(SoundFx.monster_chewing);
      this.curtain = this.add(LevelCurtain);
      this.node.appendChild(this.curtain.node);
      this.curtain.markReady();
      this.curtain.skipClose();
      this.state = 1;
    }
    pushLevelSelect() {
      this.push(SelectLevelScene);
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 1:
          if (this.curtain.state == 7) {
            this.curtain.state = 0;
            this.curtain.playOpenAnim();
            this.state = 2;
          }
          break;
        case 2:
          if (this.curtain.state == 0) {
            this.state = 3;
            this.pushLevelSelect();
          }
      }
    }
    replacesPrevious() {
      return false;
    }
    getName() {
      return "PauseOverlay";
    }
  }
  PauseScene.i = true;
  PauseScene.s = Scene;
  Object.assign(PauseScene.prototype, {
    l: PauseScene
  });
  class CTRCPauseScene extends PauseScene {
    constructor() {
      super();
    }
    onResumeButton() {
      SDK.trackResume(cachedBind(this, this.resume));
    }
    onQuitButton() {
      let a = this;
      SDK.trackLevelFail("quit", currentLevelId(), function () {
        SDK.showInterstitialAd("button:pause:quit", cachedBind(a, a.quitWithCurtain));
      });
    }
    pushLevelSelect() {
      this.push(CTRCSelectLevelScene);
    }
    getName() {
      return "CTRCPauseOverlay";
    }
  }
  CTRCPauseScene.i = true;
  CTRCPauseScene.s = PauseScene;
  Object.assign(CTRCPauseScene.prototype, {
    l: CTRCPauseScene
  });
