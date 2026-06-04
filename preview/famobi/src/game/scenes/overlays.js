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
      this.Ke(600, 900);
      var a = this.caller.Ha.stars;
      this.Ic = this.caller.Ha.blueStar;
      var b = this.cr("LEVEL_CLEARED1", "LEVEL_CLEARED2", "LEVEL_CLEARED3", "LEVEL_CLEARED4")[a];
      var c = new TextNode(this.ra, Resources.ic);
      c.setBoxSize(600, 60);
      c.setText(b);
      c.setAlign(0);
      c.setMultiline();
      c.setY(140);
      b = [];
      for (c = 0; c < 4;) {
        ++c;
        b.push(new Sprite(this.ra, Resources.Wa, Keys.oL));
      }
      this.ab = b;
      b = 0;
      for (c = this.ab; b < c.length;) {
        c[b++].center();
      }
      if (this.Ic) {
        this.IE = [0.9, 1, 1, 0.9];
        this.ab[0].setX(142);
        this.ab[0].setY(337);
        this.ab[1].setX(244);
        this.ab[1].setY(316);
        this.ab[2].setX(360);
        this.ab[2].setY(316);
        this.ab[3].setX(461);
        this.ab[3].setY(337);
      } else {
        this.IE = [0.9, 1, 0.9];
        this.ab[0].setX(180);
        this.ab[0].setY(291);
        this.ab[1].setX(300);
        this.ab[1].setY(273);
        this.ab[2].setX(420);
        this.ab[2].setY(291);
      }
      for (b = 0; b < 4;) {
        c = b++;
        this.ab[c].W(0);
        this.ab[c].setUniformScale(0);
      }
      for (b = 0; b < a;) {
        this.ab[b++].Fb(Keys.nL);
      }
      if (this.Ic) {
        this.ab[3].Fb(Keys.pK);
      }
      a = new Sprite(this.ra, Resources.Wa, Keys.WK);
      a.setX(190);
      a.setY(400);
      this.av = LevelState.mO();
      a = new AlbumButton();
      a.setX(59);
      a.setY(640);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a = ButtonBase.create(null, Keys.Uk, Keys.Vk, Keys.lz);
      a.setX(219);
      a.setY(640);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a = ButtonBase.create(null, Keys.Uk, Keys.Vk, Keys.oz);
      a.setX(379);
      a.setY(640);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a = ButtonBase.create(null, Keys.Rt, Keys.St, Keys.dL);
      a.setX(188.5);
      a.setY(750);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a.focus();
      if (LevelState.box == 17 && LevelState.level == 25) {
        a.L(false);
      }
      if (this.av) {
        this.setState(0);
      } else {
        this.setState(1);
      }
    }
    start() {
      super.start();
      if (this.caller instanceof LevelScene && (SoundFx.play(SoundFx.win), LevelState.QL() && LevelState.box == 17 && LevelState.level == 25)) {
        this.Dg(OutroVideoScene);
        return;
      }
      if (this.caller instanceof OutroVideoScene) {
        Save.Dl = true;
        Save.flush();
        this.setState(7);
      } else if (this.caller instanceof PictureRevealScene) {
        this.setState(1);
      } else if (this.av) {
        this.av = false;
        this.Ha.pictureIndex = null;
        this.Ha.available = true;
        this.Ha.ui = true;
        this.Dg(PictureRevealScene);
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
          this.Rs(1);
          this.Rs(2);
          this.Rs(3);
          if (this.Ic) this.Rs(4);
          this.oa(new BounceAnim(this.buttons[4].j, 2));
          this.setState(7);
          break;
        case 8:
          a = this.jb(0.3);
          this.mi().bf(1 - a);
          if (a == 1) {
            this.Uq();
            LevelCurtain.instance.nu();
            this.setState(9);
          }
          break;
        case 9:
          if (LevelCurtain.instance.state == 0) {
            this.setState(10);
            this.Vb();
          }
      }
    }
    transitionIn(a) {
      this.mi().bf(a);
    }
    transitionOut(a) {
      this.mi().bf(1 - a);
    }
    Pd() {
      if (this.state != 0 && !(this.state > 7)) {
        if (this.hb(1)) {
          this.vp();
        }
        if (this.hb(2)) {
          this.ip();
        }
        if (this.hb(3)) {
          this.jp();
        }
        if (this.hb(4)) {
          if (LevelState.hl()) {
            if (LevelState.hl()) {
              this.Ha.boxComplete = true;
              this.uC();
            } else {
              this.time = 0;
            }
          } else {
            LevelState.nS();
            this.wC();
          }
        }
      }
    }
    vp() {
      this.$(PicturesScene);
    }
    Rs(a) {
      --a;
      this.ab[a].tween().alpha(1, 0.3);
      this.ab[a].tween().scale(this.IE[a], 0.3, Easing.backOut(0.1));
    }
    uC() {
      if (LevelState.season == 1) {
        this.$(Season1Scene);
      } else if (LevelState.season == 2) {
        this.$(Season2Scene);
      } else if (LevelState.season == 3) {
        this.$(Season3Scene);
      }
    }
    wC() {
      this.Kf();
    }
    jp() {
      this.Of();
    }
    ip() {
      this.ep();
    }
    ep() {
      this.setState(8);
    }
    Of() {
      this.Ha.restart = true;
      this.Kf();
    }
    setState(a) {
      this.state = a;
      this.time = 0;
    }
    Vb() {
      if (LevelState.hl()) {
        this.Ha.boxComplete = true;
        if (LevelState.season == 1) {
          this.$(Season1Scene);
        } else if (LevelState.season == 2) {
          this.$(Season2Scene);
        } else if (LevelState.season == 3) {
          this.$(Season3Scene);
        }
      } else {
        this.$(SelectLevelScene);
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
      // Was: this.Jl() - hid every button on entry so the (removed)
      // state-6 -> 1s DelayedCall -> trackLevelSuccess -> interstitial
      // -> wS() chain could reveal them after the ad. With ads and
      // analytics stripped and the state machine collapsed straight
      // to state 7, that reveal never fired, leaving the buttons
      // permanently hidden. Just keep them visible from the start.
    }
    jp() {
      this.Jl();
      let a = this;
      SDK.trackLevelRestart(currentLevelId(), function () {
        SDK.showInterstitialAd("button:results:restart", cachedBind(a, a.Of));
      });
    }
    uC() {
      if (LevelState.season == 1) {
        this.$(CTRCSeason1Scene);
      } else if (LevelState.season == 2) {
        this.$(CTRCSeason2Scene);
      } else if (LevelState.season == 3) {
        this.$(CTRCSeason3Scene);
      }
    }
    wC() {
      this.Jl();
      let a = this;
      SDK.showInterstitialAd("button:results:next", function () {
        SDK.trackLevelStart(currentLevelId(), function () {
          a.Kf(null);
        });
      });
    }
    ip() {
      this.Jl();
      SDK.showInterstitialAd("button:results:quit", cachedBind(this, this.ep));
    }
    Vb() {
      if (LevelState.hl()) {
        this.Ha.boxComplete = true;
        if (LevelState.season == 1) {
          this.$(CTRCSeason1Scene);
        } else if (LevelState.season == 2) {
          this.$(CTRCSeason2Scene);
        } else if (LevelState.season == 3) {
          this.$(CTRCSeason3Scene);
        }
      } else {
        this.$(CTRCSelectLevelScene);
      }
    }
    vp() {
      this.$(CTRCPicturesScene);
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
      this.Ke(600, 900);
      var a = this.yb("LEVEL_FAILED");
      var b = new TextNode(this.ra, Resources.ic);
      b.setBoxSize(600, 160);
      b.Tf(true);
      b.setFontSize(60);
      b.setText(a);
      b.setAlign(0);
      b.setY(140);
      a = this.caller.Ha.count;
      b = 0;
      if (a > 3) {
        b = 1;
      }
      if (a > 5) {
        b = 2;
      }
      a = new Sprite(this.ra, Resources.Wa, [Keys.XK, Keys.YK, Keys.ZK][b]);
      a.setX(190);
      a.setY(320);
      a = ButtonBase.create(null, Keys.Uk, Keys.Vk, Keys.lz);
      a.setX(139);
      a.setY(560);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a = ButtonBase.create(null, Keys.Uk, Keys.Vk, Keys.oz);
      a.setX(299);
      a.setY(560);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
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
          a = this.jb(0.3);
          this.mi().bf(1 - a);
          if (a == 1) {
            this.Uq();
            LevelCurtain.instance.nu();
            this.setState(2);
          }
          break;
        case 2:
          if (LevelCurtain.instance.state == 0) {
            this.setState(3);
            this.Vb();
          }
      }
    }
    transitionIn(a) {
      this.mi().bf(a);
    }
    transitionOut(a) {
      this.mi().bf(1 - a);
    }
    Pd() {
      if (!(this.state > 0)) {
        if (this.hb(1)) {
          this.ip();
        }
        if (this.hb(2)) {
          this.jp();
        }
      }
    }
    jp() {
      this.Of();
    }
    ip() {
      this.ep();
    }
    ep() {
      this.setState(1);
      this.time = 0;
    }
    Of() {
      this.Ha.restart = true;
      this.Kf();
    }
    setState(a) {
      this.state = a;
    }
    Vb() {
      if (LevelState.hl()) {
        this.Ha.boxComplete = true;
        if (LevelState.season == 1) {
          this.$(Season1Scene);
        } else if (LevelState.season == 2) {
          this.$(Season2Scene);
        } else if (LevelState.season == 3) {
          this.$(Season3Scene);
        }
      } else {
        this.$(SelectLevelScene);
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
    jp() {
      this.Jl();
      let a = this;
      SDK.trackLevelRestart(currentLevelId(), function () {
        SDK.showInterstitialAd("button:results:restart", cachedBind(a, a.Of));
      });
    }
    ip() {
      this.Jl();
      SDK.showInterstitialAd("button:failed:quit", cachedBind(this, this.ep));
    }
    Vb() {
      if (LevelState.hl()) {
        this.Ha.boxComplete = true;
        if (LevelState.season == 1) {
          this.$(CTRCSeason1Scene);
        } else if (LevelState.season == 2) {
          this.$(CTRCSeason2Scene);
        } else if (LevelState.season == 3) {
          this.$(CTRCSeason3Scene);
        }
      } else {
        this.$(CTRCSelectLevelScene);
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
      this.Xd = new Container();
      var a = new Sprite(this.Xd, Resources.Wa, Keys.nz);
      var b = new Sprite(this.Xd, Resources.Wa, Keys.jL);
      var c = new Sprite(this.Xd, Resources.Wa, Keys.fL);
      b.nx(500);
      b.setY(a.X.y - 1);
      c.setY(b.getY() + 500 - 1);
      this.Xd.center();
      a = ButtonBase.create(null, Keys.gL, Keys.hL, Keys.iL);
      this.buttons.push(a);
      a.setX(680);
      a.setY(-20);
      this.Xd.appendChild(a.j);
      this.oa(a);
      b = new TextNode(this.Xd, Resources.ic);
      b.setText(Strings.get("CANT_UNLOCK_TEXT1"));
      b.setX(20);
      b.setY(60);
      b.setAlign(0);
      b.setBoxSize(760, 100);
      b.setFontSize(80);
      a = new TextNode(this.Xd, Resources.ic);
      a.setText(Numeric.Ed(this.caller.Ha.starCount));
      a.setX(20);
      a.setY(b.getY() + 90);
      a.setAlign(0);
      a.setBoxSize(760, 100);
      a.setFontSize(80);
      b = new Sprite(this.Xd, Resources.Wa, Keys.Tt);
      c = a.Re();
      b.setUniformScale(0.8);
      b.setX(c.B);
      b.setY((c.D + c.G) / 2 - b.getHeight() / 2);
      b = new TextNode(this.Xd, Resources.ic);
      b.setText(Strings.get("CANT_UNLOCK_TEXT2"));
      b.setX(20);
      b.setY(a.getY() + 90);
      b.setAlign(0);
      b.setBoxSize(760, 100);
      b.setFontSize(80);
      a = new TextNode(this.Xd, Resources.ji);
      a.setText(Strings.get("CANT_UNLOCK_TEXT3"));
      a.setX(20);
      a.setY(b.getY() + 90 + 40);
      a.setAlign(0);
      a.Tf(true);
      a.setBoxSize(760, 140);
      a.setFontSize(60);
      this.node.P(this.Xd.u);
    }
    getTransitionDuration() {
      return 0.5;
    }
    transitionOut(a) {
      a = Easing.quadOut()(1 - a);
      let b = this.node.Db;
      b.scale.x = b.scale.y = 0.001 + a;
      b.K = b.K & -2 | 500;
    }
    transitionIn(a) {
      a = Easing.elasticOut(0.5, 0.5)(a);
      let b = this.node.Db;
      b.scale.x = b.scale.y = 0.001 + a;
      b.K = b.K & -2 | 500;
    }
    Pd() {
      if (this.O.lh().Nb(461)) {
        this.Kf();
      }
      if (this.hb(1)) {
        this.Kf();
      }
    }
    layout() {
      super.layout();
      let a = this.fa.dr().hi(1);
      var b = this.node.Db;
      b.translate.x = (a.A + a.B) / 2;
      b.translate.y = (a.D + a.G) / 2;
      b.K = b.K & -2 | 496;
      if (this.fa.Se() > 1) {
        this.Xd.setUniformScale(1);
        b = this.Xd.getHeight();
        this.Xd.setUniformScale((a.G - a.D) / b * 0.75);
      } else {
        b = 1.1;
        let c = 1 / this.fa.Se();
        if (c < 1) {
          b = c * 1.1;
        }
        this.Xd.setUniformScale((a.B - a.A) / (Resources.Wa.hc.yf(Keys.nz).ec.x * b));
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
