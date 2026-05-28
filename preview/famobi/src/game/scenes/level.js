  class SelectLevelScene extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      let a = [Loader.fontDat, Loader.fontImg, Loader.menuShadow, Loader.menuUi, Loader.menuUiJson, Loader.menuCut, Loader.menuCutJson, Loader.menuShadow, Loader.strings, WebApplication.menuMusicId];
      let b = LevelState.box - 1;
      a.push([195, 190, 185, 180, 175, 170, 165, 159, 154, 149, 144, 139, 134, 129, 124, 119, 114][b]);
      a.push([196, 191, 186, 181, 176, 171, 166, 161, 155, 150, 145, 140, 135, 130, 125, 120, 115][b]);
      a.push([197, 192, 187, 182, 177, 172, 167, 162, 156, 151, 146, 141, 136, 131, 126, 121, 116][b]);
      return a;
    }
    startLevel(a) {
      this.commitLevel(a);
    }
    commitLevel(a) {
      LevelState.setLevel(a);
      SoundFx.play(SoundFx.button);
      this.state = 1;
      this.time = 0;
    }
    init() {
      super.init();
      this.fade.setVisible(true);
      if (LevelCurtain.instance != null) {
        LevelCurtain.instance.dispose();
      }
      this.curtain = this.add(LevelCurtain);
      this.director.back.appendChild(this.curtain.node);
      this.state = 0;
      this.addCursor();
      this.addBackButton();
      var a = 20;
      if (LevelState.levelBlueStarCollected()) {
        a = 0;
      }
      this.gridContainer = new Container();
      var b = Resources.Wa.frames.findByName(Keys.$p).sourceSize;
      let c = b.x - a;
      let d = b.y;
      let e = 1;
      this.grid = new Grid2D(5, 5);
      let f = this;
      this.grid.forEach(function (g, h, m) {
        e += 1;
        g = new LevelDot(e - 1);
        f.gridContainer.appendChild(g.container);
        g.container.setX(h * c);
        g.container.setY(m * d);
        return g;
      });
      this.gridContainer.setX(-5);
      this.size = new Size(c * 5, d * 5);
      this.setSize(this.size.x, this.size.y);
      this.layout.appendChild(this.gridContainer);
      for (a = this.grid.iterator(); a.hasNext();) {
        b = a.next();
        if (LevelState.isCleared(b.index)) {
          b.setStars(LevelState.levelStars(b.index), LevelState.levelBlueStarCollected(b.index));
        }
      }
      for (a = this.grid.iterator(); a.hasNext();) {
        b = a.next();
        if (LevelState.levelStars(b.index) < 3) {
          b.focus();
          this.focusedDot = b;
          break;
        }
      }
      if (this.focusedDot == null) {
        a = this.grid;
        this.focusedDot = a.array[a.cols * 0];
      }
      this.focusedDot.focus();
      this.scoreLabel = this.add(ScoreLabel);
      a = LevelState.boxStars();
      this.scoreLabel.setText(Numeric.toStr(a == 0 ? 0 : a));
      this.startMenuMusic();
    }
    start() {
      super.start();
      this.app.audio.setMusicVolume(Save.musicOn ? 1 : 0);
    }
    dispose() {
      super.dispose();
      this.curtain = null;
    }
    loadTextures() {
      super.loadTextures();
      Resources.xj = this.createTexture([196, 191, 186, 181, 176, 171, 166, 161, 155, 150, 145, 140, 135, 130, 125, 120, 115][LevelState.box - 1]);
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 0:
          if (this.app.pointer().hovered(0)) {
            for (var b = this.grid.iterator(); b.hasNext();) {
              a = b.next();
              if (a.hitTest(this.pointer.pos)) {
                b = this.focusedDot;
                if (b != null) {
                  b.blur();
                }
                this.focusedDot = a;
                this.focusedDot.focus();
                break;
              }
            }
          }
          if (this.app.pointer().justPressed(0)) {
            for (a = this.grid.iterator(); a.hasNext();) {
              b = a.next();
              if (b.hitTest(this.pointer.pos)) {
                this.pressedDot = b;
                break;
              }
            }
          }
          if (this.app.pointer().justReleased(0) && this.pressedDot != null && this.pressedDot.hitTest(this.pointer.pos)) {
            this.startLevel(this.pressedDot.index);
          }
          if (this.focusedDot != null) {
            a = new Coord();
            b = this.grid;
            var c = this.focusedDot.index - 1;
            a.y = c / b.cols | 0;
            a.x = c % b.cols;
            b = this.grid;
            c = this.focusedDot.index - 1;
            a.y = c / b.cols | 0;
            a.x = c % b.cols;
          }
          break;
        case 1:
          a = this.progress(0.3);
          this.fadeState().setAlpha(1 - a);
          if (a == 1) {
            this.stopAllMusic();
            this.curtain.playCloseAnim();
            this.state = 2;
          }
          break;
        case 2:
          if (this.curtain.state == 0) {
            this.state = 3;
            this.curtain.remove();
            this.goToNextScene();
          }
      }
    }
    transitionOut(a, b) {
      if (b instanceof LevelScene) {
        if (a == 0) {
          this.director.back.removeChild(this.curtain.node);
          this.director.front.appendChild(this.curtain.node);
        }
      } else {
        super.transitionOut(a, b);
        if (a == 1 && b instanceof SelectBoxScene) {
          this.curtain.dispose();
        }
      }
    }
    layout() {
      this.designSize.y = this.size.y;
      this.gridContainer.setY(0);
      let a = this.director.aspectRatio();
      if (!this.app.isMobile && a > 0.7) {
        this.designSize.y += 400;
        this.gridContainer.setY(200);
      }
      super.layout();
      this.curtain.layout();
      this.findNode(ScoreLabel, this).layout();
    }
    handleInput() {
      if (this.consumeClick(0)) {
        this.backToBoxSelect();
      }
    }
    backToBoxSelect() {
      switch (LevelState.season) {
        case 1:
          this.push(Season1Scene);
          break;
        case 2:
          this.push(Season2Scene);
          break;
        case 3:
          this.push(Season3Scene);
      }
    }
    goToNextScene() {
      this.push(LevelScene);
    }
    getName() {
      return "SelectLevelScene";
    }
  }
  SelectLevelScene.i = true;
  SelectLevelScene.s = Scene;
  Object.assign(SelectLevelScene.prototype, {
    l: SelectLevelScene
  });
  class CTRCSelectLevelScene extends SelectLevelScene {
    constructor() {
      super();
    }
    startLevel(a) {
      LevelState.setLevel(a);
      let b = this;
      SDK.trackLevelStart(currentLevelId(), function () {
        SDK.showInterstitialAd("button:levelselection:level", function () {
          b.commitLevel(a);
        });
      });
    }
    goToNextScene() {
      this.push(CTRCLevelScene);
    }
    backToBoxSelect() {
      switch (LevelState.season) {
        case 1:
          this.push(CTRCSeason1Scene);
          break;
        case 2:
          this.push(CTRCSeason2Scene);
          break;
        case 3:
          this.push(CTRCSeason3Scene);
      }
    }
    getName() {
      return "CTRCSelectLevelScene";
    }
  }
  CTRCSelectLevelScene.i = true;
  CTRCSelectLevelScene.s = SelectLevelScene;
  Object.assign(CTRCSelectLevelScene.prototype, {
    l: CTRCSelectLevelScene
  });
  class LevelScene extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      // preview bridge: when a custom level is active, force every object
      // preload on so the level can use objects that the current box's
      // BOX_OBJECT_FLAGS bitmask wouldn't normally whitelist.
      let _customlevel = window.customleveldata != null;
      function a(d) {
        if (_customlevel) return true;
        return (BOX_OBJECT_FLAGS[c] & d) > 0;
      }
      let b = [Loader.fontDat, Loader.fontImg, Loader.menuUi, Loader.menuUiJson, Loader.menuCut, Loader.menuCutJson, Loader.strings, Loader.char1, Loader.char1Json, Loader.char2, Loader.char2Json, Loader.objHook, Loader.objHookJson, Loader.objStar, Loader.objStarJson, Loader.gameTut, Loader.gameTutJson, WebApplication.gameMusicId];
      b.push([97, 95, 93, 91, 89][Save.skin]);
      b.push([98, 96, 94, 92, 90][Save.skin]);
      let c = LevelState.box - 1;
      if (a(1)) {
        b.push(Loader.objBubble);
        b.push(Loader.objBubbleJson);
      }
      if (a(2)) {
        b.push(Loader.objSpikes);
        b.push(Loader.objSpikesJson);
      }
      if (a(4)) {
        b.push(Loader.objPump);
        b.push(Loader.objPumpJson);
      }
      if (a(8)) {
        b.push(Loader.objSpider);
        b.push(Loader.objSpiderJson);
      }
      if (a(64)) {
        b.push(Loader.objElectro);
        b.push(Loader.objElectroJson);
      }
      if (a(128)) {
        b.push(Loader.objSock);
        b.push(Loader.objSockJson);
      }
      if (a(512)) {
        b.push(Loader.objBouncer);
        b.push(Loader.objBouncerJson);
      }
      if (a(2048)) {
        b.push(Loader.objGravity);
        b.push(Loader.objGravityJson);
      }
      if (a(4096)) {
        b.push(Loader.objBlades);
        b.push(Loader.objBladesJson);
      }
      if (a(8192)) {
        b.push(Loader.objBee);
        b.push(Loader.objBeeJson);
      }
      if (a(16384)) {
        b.push(Loader.objVinyl);
        b.push(Loader.objVinylJson);
      }
      if (a(32768)) {
        b.push(Loader.objGhost);
        b.push(Loader.objGhostJson);
      }
      if (a(65536)) {
        b.push(Loader.objSteam);
        b.push(Loader.objSteamJson);
      }
      if (a(131072)) {
        b.push(Loader.objLantern);
        b.push(Loader.objLanternJson);
      }
      if (a(262144)) {
        b.push(Loader.objGap);
        b.push(Loader.objGapJson);
      }
      if (a(524288) || WebApplication.telekinesisEnabled) {
        b.push(Loader.objLighter);
        b.push(Loader.objLighterJson);
        b.push(Loader.char3);
        b.push(Loader.char3Json);
      }
      if (a(1048576)) {
        b.push(Loader.objTransporter);
        b.push(Loader.objTransporterJson);
      }
      if (WebApplication.telekinesisEnabled) {
        b.push(Loader.objSp);
        b.push(Loader.objSpJson);
      }
      b.push([194, 189, 184, 179, 174, 169, 164, 158, 153, 148, 143, 138, 133, 128, 123, 118, 113][c]);
      b.push([195, 190, 185, 180, 175, 170, 165, 159, 154, 149, 144, 139, 134, 129, 124, 119, 114][c]);
      b.push([196, 191, 186, 181, 176, 171, 166, 161, 155, 150, 145, 140, 135, 130, 125, 120, 115][c]);
      b.push([197, 192, 187, 182, 177, 172, 167, 162, 156, 151, 146, 141, 136, 131, 126, 121, 116][c]);
      b.push([198, 193, 188, 183, 178, 173, 168, 163, 157, 152, 147, 142, 137, 132, 127, 122, 117][c]);
      if (LevelState.box == 8) {
        b.push(Loader.box8Earth);
      }
      return b;
    }
    bootMode() {
      if (LevelScene.freshBoot) {
        return 1;
      } else {
        return 0;
      }
    }
    init() {
      super.init();
      LevelScene.pendingLevelJump = -1;
      LevelScene.pendingRestart = false;
      LevelScene.forceFailNext = false;
      this.failCount = 0;
      this.isWebOSHD = this.app.isWebOS && this.app.window.canvasSize.x == 1920;
      this.fade.setVisible(false);
      this.whiteFade = new ColorRectShape(null, new Vec4(1, 1, 1, 1));
      this.controller = new LevelController(this);
      var a = ButtonBase.create(null, Keys.AK, Keys.BK);
      this.buttons.push(a);
      this.node.appendChild(a.container.node);
      a = ButtonBase.create(null, Keys.CK, Keys.DK);
      this.buttons.push(a);
      this.node.appendChild(a.container.node);
      if (WebApplication.externalMute) {
        a = ButtonBase.create(null, Keys.zK, Keys.yK, Keys.ez);
        a.icon.setVisible(!Save.musicOn);
        this.buttons.push(a);
        this.node.appendChild(a.container.node);
        a = ButtonBase.create(null, Keys.FK, Keys.EK, Keys.ez);
        a.icon.setVisible(!Save.sfxOn);
        this.buttons.push(a);
        this.node.appendChild(a.container.node);
      }
      if (WebApplication.magnetEnabled) {
        this.addMagnetButton();
      }
      if (WebApplication.telekinesisEnabled) {
        this.addTelekinesisButton();
      }
      this.setButtonsEnabled(false);
      this.scoreLabel = new Container();
      this.node.appendChild(this.scoreLabel.node);
      for (a = 0; a < 3;) {
        ++a;
        new Sprite(this.scoreLabel, Resources.Wa, HUD_STAR_FRAME_0).center();
      }
      a = this.scoreLabel.childAt(0).getWidth();
      var b = this.scoreLabel.childAt(0);
      b.setX(b.getX() - a);
      b = this.scoreLabel.childAt(2);
      b.setX(b.getX() + a);
      a = this.app.isWebOS ? this.isWebOSHD ? 40 : 80 : 60;
      this.levelText = new Container();
      b = new TextNode(this.levelText, Resources.ic);
      b.setBoxSize(200, a);
      b.setText(this.tr("LEVEL"));
      b.autoFit();
      b = new TextNode(this.levelText, Resources.ic);
      b.setY(a * 0.9);
      b.setBoxSize(200, a);
      this.setLevelText();
      this.node.appendChild(this.levelText.node);
      this.starsCollected = this.state = this.starsAnimTime = this.starsAnimState = 0;
      this.timerOn = this.bonusCollected = false;
    }
    onStop() {
      super.onStop();
      if (this.curtain != null) {
        this.curtain.remove();
      }
      let a = 0;
      let b = [27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7];
      while (a < b.length) {
        this.release(b[a++]);
      }
    }
    loadTextures() {
      super.loadTextures();
      let a = LevelState.box - 1;
      if (Resources.skinAtlas == null) {
        Resources.skinAtlas = this.createTexture([97, 95, 93, 91, 89][Save.skin]);
        Resources.Fu = this.createTexture(Loader.char1);
        Resources.iM = this.createTexture(Loader.char2);
        Resources.eT = this.createTexture(Loader.gameTut);
        Resources.Oa = this.createTexture(Loader.objStar);
        Resources.ph = this.createTexture(Loader.objHook);
      }
      if (Resources.ca == null && Loader.isLoaded(Loader.objBubble)) {
        Resources.ca = this.createTexture(Loader.objBubble);
      }
      if (Resources.Dd == null && Loader.isLoaded(Loader.objSpikes)) {
        Resources.Dd = this.createTexture(Loader.objSpikes);
      }
      if (Resources.wm == null && Loader.isLoaded(Loader.objPump)) {
        Resources.wm = this.createTexture(Loader.objPump);
      }
      if (Resources.mc == null && Loader.isLoaded(Loader.objSpider)) {
        Resources.mc = this.createTexture(Loader.objSpider);
      }
      if (Resources.ce == null && Loader.isLoaded(Loader.objElectro)) {
        Resources.ce = this.createTexture(Loader.objElectro);
      }
      if (Resources.Dk == null && Loader.isLoaded(Loader.objSock)) {
        Resources.Dk = this.createTexture(Loader.objSock);
      }
      if (Resources.fd == null && Loader.isLoaded(Loader.objBouncer)) {
        Resources.fd = this.createTexture(Loader.objBouncer);
      }
      if (Resources.Kb == null && Loader.isLoaded(Loader.objGravity)) {
        Resources.Kb = this.createTexture(Loader.objGravity);
        if (LevelState.box == 8) {
          Resources.Xn = this.createTexture(Loader.box8Earth);
        }
      }
      if (Resources.gl == null && Loader.isLoaded(Loader.objBlades)) {
        Resources.gl = this.createTexture(Loader.objBlades);
      }
      if (Resources.Ld == null && Loader.isLoaded(Loader.objBee)) {
        Resources.Ld = this.createTexture(Loader.objBee);
      }
      if (Resources.Tc == null && Loader.isLoaded(Loader.objVinyl)) {
        Resources.Tc = this.createTexture(Loader.objVinyl);
      }
      if (Resources.de == null && Loader.isLoaded(Loader.objGhost)) {
        Resources.de = this.createTexture(Loader.objGhost);
      }
      if (Resources.Kk == null && Loader.isLoaded(Loader.objSteam)) {
        Resources.Kk = this.createTexture(Loader.objSteam);
      }
      if (Resources.Ai == null && Loader.isLoaded(Loader.objLantern)) {
        Resources.Ai = this.createTexture(Loader.objLantern);
      }
      if (Resources.wf == null && Loader.isLoaded(Loader.objGap)) {
        Resources.wf = this.createTexture(Loader.objGap);
      }
      if (Resources.Ef == null && Loader.isLoaded(Loader.objLighter)) {
        Resources.Ef = this.createTexture(Loader.objLighter);
      }
      if (Resources.Rc == null && Loader.isLoaded(Loader.objTransporter)) {
        Resources.Rc = this.createTexture(Loader.objTransporter);
      }
      if (Resources.Kd == null && Loader.isLoaded(Loader.objSp)) {
        Resources.Kd = this.createTexture(Loader.objSp);
      }
      if (Resources.ml == null && Loader.isLoaded(Loader.char3)) {
        Resources.ml = this.createTexture(Loader.char3);
      }
      if (Resources.wq == null) {
        Resources.wq = this.createTexture([194, 189, 184, 179, 174, 169, 164, 158, 153, 148, 143, 138, 133, 128, 123, 118, 113][a]);
        Resources.xj = this.createTexture([196, 191, 186, 181, 176, 171, 166, 161, 155, 150, 145, 140, 135, 130, 125, 120, 115][a]);
        Resources.uu = this.createTexture([198, 193, 188, 183, 178, 173, 168, 163, 157, 152, 147, 142, 137, 132, 127, 122, 117][a]);
      }
    }
    start() {
      super.start();
      LevelScene.freshBoot = false;
      let a = this;
      switch (this.state) {
        case 0:
          this.startGameMusic();
          this.controller.show();
          this.curtain = LevelCurtain.instance;
          if (this.curtain == null) {
            this.setButtonsEnabled(true);
            this.setState(1);
            break;
          }
          this.addChild(this.curtain);
          this.curtain.setOnCloseDone(function () {
            a.curtain.dispose();
            a.setButtonsEnabled(true);
          });
          this.resetStars();
          this.setState(1);
          break;
        case 4:
          this.setPaused(true);
          this.setState(1);
          this.buttons[1].setSelected(false);
          break;
        case 9:
          this.controller.dispose();
          this.controller = new LevelController(this);
          this.controller.show();
          this.controller.update(0.016666666666666666);
          this.curtain.setOnCloseDone(function () {
            a.curtain.dispose();
            a.setButtonsEnabled(true);
          });
          this.setState(1);
          this.setButtonsEnabled(false);
          this.resetStars();
          this.setLevelText();
          this.resetLevelText();
      }
    }
    onStarCollected(a) {
      this.scoreLabel.childAt(a - 1).anim().play(HUD_STAR_ANIM);
      this.starsCollected++;
    }
    onBonusCollected() {
      this.bonusCollected = true;
      new Sprite(this.scoreLabel, Resources.Wa, HUD_STAR_FRAME_0).center();
      let a = this.scoreLabel.childAt(0).getWidth();
      let b = a * -1.5;
      let c = 0;
      while (c < 4) {
        this.scoreLabel.childAt(c++).setX(b);
        b += a;
      }
      this.scoreLabel.childAt(3).anim().play(HUD_STAR_ANIM);
    }
    onLevelWon() {
      this.setButtonsEnabled(false);
      this.resetPowerups();
      this.timerOn = false;
    }
    onLevelWonRecord() {
      LevelState.recordCleared(Math.max(LevelState.levelStars(), this.starsCollected), this.bonusCollected);
      SoundFx.fadeOut(SoundFx.monster_chewing);
      this.setState(5);
      this.addCurtain();
    }
    onLevelWonAlt() {
      this.setButtonsEnabled(false);
      this.resetPowerups();
      this.timerOn = false;
    }
    onFailEvent() {
      if (this.state == 1) {
        if (LevelScene.MAX_FAILS != -1 && (this.failCount++, this.failCount == LevelScene.MAX_FAILS)) {
          this.failCount = 0;
          let a = 1;
          let b = this.buttons.length;
          while (a < b) {
            this.buttons[a++].setSelected(true);
          }
          // preview bridge: skip the curtain (box-closing) fail animation
          // in custom-level mode so CD()->Of() can run the white-fade
          // restart while state is still 1 (Of() guards on state == 1).
          if (window.customleveldata == null) {
            this.setState(6);
            this.addCurtain();
          }
        }
        this.onFail();
      }
    }
    addCurtain() {
      this.curtain = this.add(LevelCurtain);
      this.curtain.markReady();
      this.node.appendChild(this.curtain.node);
      this.curtain.playOpenAnim();
    }
    addMagnetButton() {
      this.magnetButton = new AdPowerupButtonA();
      this.buttons.push(this.magnetButton);
      this.node.appendChild(this.magnetButton.container.node);
    }
    addTelekinesisButton() {
      this.telekinesisButton = new AdPowerupButtonB();
      this.buttons.push(this.telekinesisButton);
      this.node.appendChild(this.telekinesisButton.container.node);
    }
    resetPowerups() {
      if (WebApplication.magnetEnabled) {
        this.magnetButton.reset();
      }
      if (WebApplication.telekinesisEnabled) {
        this.telekinesisButton.reset();
      }
    }
    setButtonsEnabled(a) {
      let b = 1;
      let c = this.buttons.length;
      while (b < c) {
        this.buttons[b++].setSelected(a ? false : true);
      }
    }
    onFail() {
      this.restartFlow();
    }
    restartFlow() {
      if (this.state == 1 && !this.controller.restarting) {
        this.controller.restarting = true;
        this.resetStars();
        this.node.appendChild(this.whiteFade.node);
        this.whiteFade.setAlpha(0);
        this.setButtonsEnabled(false);
        this.resetPowerups();
        this.setState(2);
      }
    }
    openPauseMenu() {
      this.pushOver(PauseScene);
    }
    setState(a) {
      this.state = a;
      this.time = 0;
      if (a == 1) {
        this.timerOn = true;
        this.candyChewTimer = 0;
      }
    }
    resetStars() {
      this.bonusCollected = false;
      this.starsCollected = 0;
      if (this.scoreLabel.childCount() == 4) {
        this.scoreLabel.childAt(3).free();
      }
      var a = this.scoreLabel.childAt(0).getWidth();
      this.scoreLabel.childAt(0).setX(-a);
      this.scoreLabel.childAt(1).setX(0);
      this.scoreLabel.childAt(2).setX(a);
      for (a = 0; a < 3;) {
        this.scoreLabel.childAt(a++).setFrame(HUD_STAR_FRAME_0);
      }
    }
    resetLevelText() {
      this.starsAnimTime = this.starsAnimState = 0;
      this.levelText.setVisible(true);
    }
    setLevelText() {
      let a = this.levelText.childAt(1);
      a.setFontSize(100);
      a.setText("" + LevelState.box + " - " + LevelState.level);
      a.autoFit();
    }
    setPaused(a) {
      this.scoreLabel.setVisible(a);
      this.buttons[1].setVisible(a);
      this.buttons[2].setVisible(a);
      if (a && !WebApplication.externalPause) {
        this.buttons[1].setVisible(a);
      }
      if (WebApplication.externalMute) {
        this.buttons[3].setVisible(a);
        this.buttons[4].setVisible(a);
      }
      if (WebApplication.magnetEnabled) {
        this.magnetButton.setVisible(a);
      }
      if (WebApplication.telekinesisEnabled) {
        this.telekinesisButton.setVisible(a);
      }
    }
    update(a) {
      super.update(a);
      this.starsAnimTime += a;
      switch (this.starsAnimState) {
        case 0:
          var b = Math.min(this.starsAnimTime / 0.5, 1);
          if (b == 1) {
            this.starsAnimState = 1;
            this.starsAnimTime = 0;
          }
          this.levelText.setAlpha(Easing.quadOut()(b));
          break;
        case 1:
          if (this.starsAnimTime > 1) {
            this.starsAnimState = 2;
            this.starsAnimTime = 0;
          }
          break;
        case 2:
          b = Math.min(this.starsAnimTime / 0.5, 1);
          if (b == 1) {
            this.starsAnimState = 3;
            this.levelText.setVisible(false);
          }
          this.levelText.setAlpha(Easing.quadOut()(1 - b));
      }
      LevelScene.isPlaying = this.state == 1;
      switch (this.state) {
        case 1:
          this.clearPointer();
          this.controller.update(a);
          this.updateAdPolling(a);
          if (LevelScene.pendingLevelJump != -1) {
            SoundFx.stop(SoundFx.monster_chewing);
            this.timerOn = false;
            this.resetPowerups();
            this.setButtonsEnabled(false);
            a = LevelState.fromGlobalIndex(LevelScene.pendingLevelJump);
            this.sharedState.box = a[0];
            this.sharedState.level = a[1];
            LevelScene.pendingLevelJump = -1;
            this.warpToLevel();
            this.state = 9;
          }
          if (LevelScene.pendingRestart) {
            LevelScene.pendingRestart = false;
            SoundFx.stop(SoundFx.monster_chewing);
            this.timerOn = false;
            this.resetPowerups();
            this.setButtonsEnabled(false);
            this.addCurtain();
            this.setState(8);
          }
          if (LevelScene.forceFailNext) {
            LevelScene.forceFailNext = false;
            a = LevelScene.MAX_FAILS;
            LevelScene.MAX_FAILS = 1;
            this.failCount = 0;
            this.onFailEvent();
            LevelScene.MAX_FAILS = a;
          }
          break;
        case 2:
          a = this.progress(window.customleveldata != null ? 0.2 : 0.2);
          this.whiteFade.setAlpha(a);
          if (a == 1) {
            this.controller.dispose();
            this.controller = new LevelController(this);
            this.controller.show();
            this.setState(3);
          }
          break;
        case 3:
          this.controller.update(a);
          a = this.progress(window.customleveldata != null ? 0.2 : 0.2);
          this.whiteFade.setAlpha(1 - a);
          if (a == 1) {
            this.node.removeChild(this.whiteFade.node);
            this.setState(1);
            this.setButtonsEnabled(true);
            this.resetLevelText();
          }
          break;
        case 4:
          this.controller.update(0);
          break;
        case 5:
          this.controller.update(a);
          if (this.curtain.state == 7) {
            this.curtain.state = 0;
            this.state = 9;
            this.showLevelCleared();
          }
          break;
        case 6:
          this.controller.update(a);
          if (this.curtain.state == 7) {
            this.state = 9;
            this.sharedState.count = this.failCount;
            this.showLevelLost();
          }
          break;
        case 7:
          this.controller.update(a);
          break;
        case 8:
          this.controller.update(a);
          if (this.curtain.state == 7) {
            this.curtain.state = 0;
            this.state = 9;
            this.push(MenuScene);
          }
      }
    }
    iq(a) {
      super.lateUpdate(a);
      this.resize();
    }
    handleInput() {
      if (this.state != 7) {
        // preview hotkeys (ported from h5dx gameflow.ts): R=restart,
        // M=mute music, Space=toggle gravity (only when the level has a
        // gravity switch). Escape is folded into the pause check below.
        if (this.state == 1) {
          let _kb = this.app.keyboard();
          if (_kb.justPressed(114)) {
            this.restart();
          } else if (_kb.justPressed(109)) {
            Save.musicOn = !Save.musicOn;
            Save.flush();
            this.app.audio.setMusicVolume(Save.musicOn ? 1 : 0);
            if (this.buttons[3] && this.buttons[3].icon) {
              this.buttons[3].icon.setVisible(!Save.musicOn);
            }
          } else if (_kb.justPressed(32) && this.controller != null && this.controller.gravityButton != null) {
            this.controller.gravityButton.toggle();
            this.controller.onGravityClick(0);
          }
        }

        var a = this.app.keyboard().justPressed(112);
        if (this.app.keyboard().justPressed(173) || this.app.keyboard().justPressed(461) || this.app.keyboard().justPressed(156)) {
          a = true;
        }
        if (WebApplication.externalPause && (this.consumeClick(1) || a)) {
          if (this.state != 1) {
            this.buttons[1].setSelected(false);
            return;
          }
          SoundFx.setVolume(SoundFx.monster_chewing, 0);
          this.controller.resetInput();
          this.clearPointer();
          this.setPaused(false);
          this.setState(4);
          this.pause();
        }
        if (this.consumeClick(2)) {
          this.restart();
        }
        if (WebApplication.externalMute) {
          if (this.consumeClick(3)) {
            this.toggleMusic(this.buttons[3]);
          }
          if (this.consumeClick(4)) {
            this.toggleSfx(this.buttons[4]);
          }
        }
        if (!this.controller.magnetActive && !this.controller.telekinesisActive) {
          if (WebApplication.magnetEnabled && this.consumeClick(WebApplication.externalMute ? 5 : 3)) {
            if (AdPowerupButtonA.COOLDOWN == 0) {
              this.showMagnetAd();
            } else {
              this.magnetButton.use();
              if (WebApplication.telekinesisEnabled) {
                this.telekinesisButton.pm = true;
              }
              this.controller.activateMagnet();
              if (!Save.magnetUsed) {
                Save.magnetUsed = true;
                Save.flush();
                a = new LevelToast(Strings.get("MAGNET_TIP"));
                this.node.appendChild(a.container.node);
                this.addChild(a);
              }
            }
          }
          if (WebApplication.telekinesisEnabled && this.consumeClick(WebApplication.externalMute ? 6 : 4)) {
            if (AdPowerupButtonB.COOLDOWN == 0) {
              this.showTelekinesisAd();
            } else {
              this.telekinesisButton.use();
              if (WebApplication.magnetEnabled) {
                this.magnetButton.pm = true;
              }
              this.controller.activateTelekinesis();
              if (!Save.telekinesisUsed) {
                Save.telekinesisUsed = true;
                Save.flush();
                a = new LevelToast(Strings.get("ANTIMAGNET_TIP"));
                this.node.appendChild(a.container.node);
                this.addChild(a);
              }
            }
          }
        }
      }
    }
    transitionOut(a, b) {
      if (b instanceof SelectBoxScene) {
        this.fade.setVisible(true);
        if (a == 1 && b instanceof SelectBoxScene) {
          LevelCurtain.instance.dispose();
        }
      }
      if (b instanceof MenuScene) {
        this.fade.setVisible(true);
        if (a == 1 && b instanceof MenuScene) {
          LevelCurtain.instance.dispose();
        }
      }
      if (b instanceof WarpScene) {
        this.fade.setVisible(true);
      }
      super.transitionOut(a, b);
    }
    getTransitionDuration(a) {
      if (a instanceof PauseScene) {
        return 0;
      } else {
        return super.getTransitionDuration(a);
      }
    }
    render(a) {
      if (this.state != 0) {
        let b = this.controller;
        if (b != null) {
          b.render(a);
        }
      }
      super.render(a);
    }
    updateAdPolling(a) {
      if (!!this.timerOn && (!!WebApplication.magnetEnabled || !!WebApplication.telekinesisEnabled) && !this.controller.magnetActive && !this.controller.telekinesisActive) {
        this.candyChewTimer += a;
        if (this.candyChewTimer >= 1) {
          this.candyChewTimer = 0;
          a = this.hasAd();
          if (WebApplication.magnetEnabled) {
            this.magnetButton.setHasAd(a);
          }
          if (WebApplication.telekinesisEnabled) {
            this.telekinesisButton.setHasAd(a);
          }
        }
      }
    }
    hasAd() {
      return true;
    }
    resize() {
      var a = this.app.window.viewportRect();
      var b = window.devicePixelRatio;
      var c = b < 1 ? 1 : b > 2 ? 2 : b;
      var d = this.app.window.bp;
      var e = this.director.aspectRatio();
      b = e > 1;
      c = c <= 1 ? 0.05 : c <= 1.25 ? 0.06 : 0.07;
      if (this.app.isMobile) {
        c = (c = Math.min(a.w, a.h) <= 800 && Math.max(a.w, a.h) <= 1280 && d <= 2) ? 0.08 : 0.04;
      }
      if (this.app.isWebOS) {
        c = 0.04;
      }
      c = Math.max(a.w, a.h) * c * d;
      if (!this.app.isMobile) {
        if (c < 70) {
          c = 70;
        }
      }
      if (b) {
        c *= 0.9;
      }
      let f = 30;
      var g = 0;
      if (this.app.isWebOS) {
        g = d * 25;
        f = 60;
      }
      this.scoreLabel.setUniformScale(c / 150);
      var h = 0;
      if (this.app.isWebOS) {
        h = 20;
      }
      this.scoreLabel.setX(a.w / 2);
      var m = this.app.isWebOS ? this.isWebOSHD ? 0.75 : 1.4 : 1;
      var n = this.buttons[1];
      if (WebApplication.externalPause) {
        n.container.setUniformScale(c / n.sourceSize.y * m);
        n.alignRight(a.w - h - g);
        n.setY(0);
      } else {
        n.setVisible(false);
      }
      d = this.buttons[2];
      d.container.setUniformScale(c / d.sourceSize.y * m);
      if (WebApplication.externalPause) {
        d.alignRight(n.getX() - h);
      } else {
        d.alignRight(a.w - h);
      }
      d.setY(0);
      n = null;
      if (WebApplication.externalMute) {
        var q = this.buttons[3];
        q.container.setUniformScale(c / q.sourceSize.y * m);
        q.alignRight(d.getX() - h);
        q.setY(0);
        n = this.buttons[4];
        n.container.setUniformScale(c / n.sourceSize.y * m);
        n.alignRight(q.getX() - h);
        n.setY(0);
      }
      if (WebApplication.magnetEnabled) {
        q = c / this.magnetButton.sourceSize.y * m;
        this.magnetButton.setX(g);
        this.magnetButton.container.setUniformScale(q);
      }
      if (WebApplication.telekinesisEnabled) {
        this.telekinesisButton.container.setUniformScale(c / this.magnetButton.sourceSize.y * m);
        if (WebApplication.magnetEnabled) {
          this.telekinesisButton.setX(this.magnetButton.getX() + this.magnetButton.getWidth() + h);
        } else {
          this.telekinesisButton.setX(g);
        }
      }
      h = 1;
      for (m = this.buttons.length; h < m;) {
        this.buttons[h++].container.setY(g);
      }
      this.scoreLabel.setY(d.getY() + d.getHeight() / 2);
      if (e < 0.8) {
        e = WebApplication.magnetEnabled && WebApplication.telekinesisEnabled ? this.telekinesisButton.rightEdge() : WebApplication.magnetEnabled ? this.magnetButton.rightEdge() : WebApplication.telekinesisEnabled ? this.telekinesisButton.rightEdge() : 0;
        g = WebApplication.externalMute ? n.getX() : d.getX();
        this.scoreLabel.setX(e + (g - e) / 2);
        if (g - e < this.scoreLabel.getWidth()) {
          e = this.scoreLabel;
          e.setY(e.getY() + this.scoreLabel.getHeight() * 1.25);
        }
      }
      this.levelText.setUniformScale(c / 100);
      this.levelText.setX(f);
      this.levelText.setY(a.h - this.levelText.getHeight() * 1.1 - f);
      if (this.app.isMobile && b) {
        a = this.levelText;
        a.setX(a.getX() + 20);
        a = this.levelText;
        a.setY(a.getY() - 20);
      }
    }
    showMagnetAd() {
      this.setState(7);
      DelayedCall.delay(cachedBind(this, this.afterMagnetAdShown), 1000);
    }
    useMagnet() {
      this.magnetButton.fill(WebApplication.magnetRefill);
      SoundFx.play(SoundFx.pump_4);
      this.controller.resetInput();
      this.setState(1);
    }
    onMagnetAdReject() {
      this.controller.resetInput();
      this.magnetButton.reject();
      this.setState(1);
    }
    showTelekinesisAd() {
      this.setState(7);
      DelayedCall.delay(cachedBind(this, this.afterTelekinesisAdShown), 1000);
    }
    useTelekinesis() {
      this.telekinesisButton.fill(WebApplication.telekinesisRefill);
      SoundFx.play(SoundFx.pump_4);
      this.controller.resetInput();
      this.setState(1);
    }
    onTelekinesisAdReject() {
      this.controller.resetInput();
      this.telekinesisButton.reject();
      this.setState(1);
    }
    pause() {
      this.openPauseMenu();
    }
    warpToLevel() {
      this.push(WarpScene);
    }
    toggleMusic(a) {
      Save.musicOn = !Save.musicOn;
      Save.flush();
      a.icon.setVisible(!Save.musicOn);
      a.setSelected(false);
      a.ke = 0;
      this.app.audio.setMusicVolume(Save.musicOn ? 1 : 0);
    }
    toggleSfx(a) {
      Save.sfxOn = !Save.sfxOn;
      Save.flush();
      a.icon.setVisible(!Save.sfxOn);
      a.setSelected(false);
      a.ke = 0;
    }
    restart() {
      this.restartFlow();
    }
    clearPointer() {
      let a = this.app.pointer();
      let b = this.app.touchDevice();
      let c = 0;
      let d = vA6;
      while (c < d.length) {
        let f = d[c];
        ++c;
        var e = a.position[f];
        e = new Size(e.x, e.y);
        let g = b.slotForId(f);
        if (a.justPressed(f)) {
          this.controller.onTouchPress(e, g);
        }
        if (a.hovered(f)) {
          this.controller.onTouchMove(e, g);
        }
        if (a.justReleased(f)) {
          this.controller.onTouchRelease(e, g);
        }
      }
    }
    showLevelCleared() {
      this.sharedState.stars = this.starsCollected;
      this.sharedState.blueStar = this.bonusCollected;
      this.pushOver(LevelClearedOverlay);
    }
    showLevelLost() {
      this.pushOver(LevelLostOverlay);
    }
    getName() {
      return "LevelScene";
    }
  }
  LevelScene.i = true;
  LevelScene.s = Scene;
  Object.assign(LevelScene.prototype, {
    l: LevelScene
  });
  class CTRCLevelScene extends LevelScene {
    constructor() {
      super();
      LevelScene.MAX_FAILS = 1;
      this.adPlayed = false;
    }
    hasAd() {
      return SDK.hasRewardedAd();
    }
    showMagnetAd() {
      this.setState(7);
      SDK.trackDesignEvent("game:powerup:magnet:rewarded");
      let a = this;
      SDK.showRewardedAd(function (b) {
        if (b) {
          a.useMagnet();
        } else {
          a.onMagnetAdReject();
        }
      });
    }
    showTelekinesisAd() {
      this.setState(7);
      SDK.trackDesignEvent("game:powerup:telekinesis:rewarded");
      let a = this;
      SDK.showRewardedAd(function (b) {
        if (b) {
          a.useTelekinesis();
        } else {
          a.onTelekinesisAdReject();
        }
      });
    }
    onLevelWon() {
      if (LevelState.level == 25 && Save.cleared[LevelState.box - 1][LevelState.level] == null) {
        let a = Strings.get("BOX1_LABEL BOX2_LABEL BOX3_LABEL BOX4_LABEL BOX5_LABEL BOX6_LABEL BOX7_LABEL BOX8_LABEL BOX9_LABEL BOX10_LABEL BOX11_LABEL BOX12_LABEL BOX13_LABEL BOX14_LABEL BOX15_LABEL BOX16_LABEL BOX17_LABEL".split(" ")[LevelState.box - 1]);
        SDK.trackEvent("EVENT_CUSTOM", {
          eventName: "BOX_CLEARED",
          boxId: LevelState.box,
          boxName: a
        });
      }
      this.adPlayed = true;
      super.onLevelWon();
    }
    toggleSfx(a) {
      super.toggleSfx(a);
      SDK.trackVolumeChange(Save.musicOn ? 1 : 0, Save.sfxOn ? 1 : 0);
    }
    toggleMusic(a) {
      super.toggleMusic(a);
      SDK.trackVolumeChange(Save.musicOn ? 1 : 0, Save.sfxOn ? 1 : 0);
    }
    pause() {
      let a = this;
      SDK.trackPause(function () {
        SDK.showInterstitialAd("button:level:pause", cachedBind(a, a.tx));
      });
    }
    openPauseMenu() {
      this.pushOver(CTRCPauseScene);
    }
    restart() {
      let a = this;
      SDK.trackLevelRestart(currentLevelId(), function () {
        a.setPaused(false);
        SDK.showInterstitialAd("button:level:restart", function () {
          a.setPaused(true);
          a.restartFlow();
        });
      });
    }
    onFail() {
      // preview bridge: skip SDK tracking / interstitial in custom-level
      // mode so the white-fade restart runs immediately.
      if (window.customleveldata != null) {
        this.restartFlow();
        return;
      }
      let a = this;
      SDK.trackLevelEnd(LevelState.totalStars(), "fail", function () {
        SDK.trackLevelFail("dead", currentLevelId(), function () {
          SDK.showInterstitialAd("break:fail", cachedBind(a, a.Of));
        });
      }, function () {
        a.restartFlow();
      });
    }
    warpToLevel() {
      this.push(CTRCWarpScene);
    }
    onStarCollected(a) {
      super.onStarCollected(a);
      SDK.trackLiveScore(a);
    }
    showLevelCleared() {
      this.sharedState.stars = this.starsCollected;
      this.sharedState.blueStar = this.bonusCollected;
      this.pushOver(CTRCLevelClearedOverlay);
    }
    addCurtain() {
      let a = this;
      if (this.state == 5 && this.adPlayed) {
        SDK.trackLevelEnd(LevelState.totalStars(), "success", function () {
          a.Ox = false;
          a.addCurtain();
        }, function () {});
      } else {
        super.addCurtain();
      }
    }
    showLevelLost() {
      // preview bridge: in custom-level mode, skip the fail overlay and just
      // trigger the white-fade restart flow directly (durations bumped to
      // 0.5s by the patched case 2 / case 3 in LevelScene.update).
      if (window.customleveldata != null) {
        this.restartFlow();
        return;
      }
      this.pushOver(CTRCLevelLostOverlay);
    }
    getName() {
      return "CTRCLevelScene";
    }
  }
  CTRCLevelScene.i = true;
  CTRCLevelScene.s = LevelScene;
  Object.assign(CTRCLevelScene.prototype, {
    l: CTRCLevelScene
  });

  class LevelState {
    static reset() {
      LevelState.season = 1;
      LevelState.box = 1;
      LevelState.level = 1;
    }
    static fromGlobalIndex(a) {
      return [1 + ((a - 1) / 25 | 0), (a - 1) % 25 + 1];
    }
    static setSeason(a) {
      LevelState.season = a;
    }
    static setBox(a) {
      LevelState.box = a;
    }
    static setLevel(a) {
      LevelState.level = a;
    }
    static recordCleared(a, b) {
      let c = LevelState.box - 1;
      let d = LevelState.level - 1;
      Save.levelStars[c][d] = a;
      Save.blueStars[c][d] = b ? 1 : 0;
      if (d < 25) {
        Save.cleared[c][d + 1] = true;
      }
      Save.flush();
    }
    static pictureCount() {
      return Save.pictures.length;
    }
    static hasPicture(a) {
      return Save.pictures.includes("" + LevelMath.seasonForBox(a) + "-" + LevelMath.globalIndex(a));
    }
    static currentLevelHasPicture() {
      switch (LevelState.box) {
        case 1:
          return [-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1][LevelState.level] == 1;
        case 2:
          return [-1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0][LevelState.level] == 1;
        default:
          return false;
      }
    }
    static tryUnlockPicture() {
      if (!LevelState.currentLevelHasPicture() || Save.pictures.includes("" + LevelState.box + "-" + LevelState.level)) {
        return false;
      }
      Save.pictures.push("" + LevelState.box + "-" + LevelState.level);
      Save.pictureBadgeCount++;
      Save.flush();
      return true;
    }
    static isCleared(a) {
      return Save.cleared[LevelState.box - 1][a - 1];
    }
    static isBoxLocked(a) {
      return Save.locked[a - 1];
    }
    static canUnlockBox(a) {
      return LevelState.starsNeededForBox(a) <= 0;
    }
    static unlockBox(a) {
      Save.locked[a - 1] = false;
      Save.cleared[a - 1][0] = true;
      Save.flush();
    }
    static starsNeededForBox(a) {
      --a;
      return BOX_STAR_THRESHOLDS[a] - LevelState.seasonStars();
    }
    static isLastLevel() {
      return LevelState.level == 25;
    }
    static goToNextLevel() {
      LevelState.setLevel(LevelState.level + 1);
    }
    static totalStars() {
      let a = 0;
      let b = LevelState.season;
      let c = 0;
      while (c < 3) {
        LevelState.season = c++ + 1;
        a += LevelState.seasonStars();
      }
      LevelState.season = b;
      return a;
    }
    static seasonStars() {
      var a = 0;
      var b = 0;
      let c = 0;
      switch (LevelState.season) {
        case 1:
          a = 0;
          b = 5;
          break;
        case 2:
          a = 5;
          b = 10;
          break;
        case 3:
          a = 10;
          b = 17;
      }
      while (a < b) {
        let d = a++;
        let e = 0;
        while (e < 25) {
          let f = e++;
          c += Save.levelStars[d][f];
          c += Save.blueStars[d][f];
        }
      }
      return c;
    }
    static allLevelsCleared() {
      let a = 0;
      while (a < 17) {
        let b = a++;
        let c = 0;
        while (c < 25) {
          if (!Save.cleared[b][c++]) {
            return false;
          }
        }
      }
      return true;
    }
    static boxStars(a) {
      if (a == null) {
        a = LevelState.box;
      }
      let b = 0;
      let c = 0;
      while (c < 25) {
        let d = c++;
        b += Save.levelStars[a - 1][d];
        b += Save.blueStars[a - 1][d];
      }
      return b;
    }
    static levelStars(a) {
      if (a == null) {
        a = LevelState.level;
      }
      return Save.levelStars[LevelState.box - 1][a - 1];
    }
    static levelBlueStarCollected(a) {
      if (a == null) {
        a = LevelState.level;
      }
      return Save.blueStars[LevelState.box - 1][a - 1] > 0;
    }
  }
  LevelState.i = true;
