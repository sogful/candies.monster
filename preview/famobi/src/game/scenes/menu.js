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
      //   if (LevelState.Nj() == 0) {
      //     a.push(this.O.window.bo() > 1 ? Loader.introLandscapeVid : Loader.introPortraitVid);
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
        this.fh.W(1 - a);
      } else {
        super.transitionIn(a, b);
      }
    }
    Vg() {
      super.Vg();
      this.Pc = new Sprite(null, Resources.Sz);
      this.node.P(this.Pc.u);
    }
    Nd() {
      super.Nd();
      let a = WebApplication.xmasMode ? Loader.menuBg2Xmas : Loader.menuBg2;
      if (Loader.ob(a)) {
        Resources.Sz = this.createTexture(a);
      }
    }
    init() {
      super.init();
      this.Vg();
      this.sj();
      this.Ke(600, 900);
      this.Mh = new Sprite(null, Resources.Wa, Keys.rL);
      this.gh = new Sprite(null, Resources.Wa, Keys.JK);
      this.node.P(this.Mh.u);
      this.node.P(this.gh.u);
      this.we = new Container(null, this.ra);
      this.we.setX(303);
      this.we.setY(220);
      this.we.setUniformScale(0.9);
      if (WebApplication.xmasMode) {
        var a = new Sprite(this.we, Resources.Wa, Keys.pL);
        a.setX(-230);
        a.setY(-275);
      }
      new Sprite(this.we, Resources.Wa, Loader.qv() == "ru" ? Keys.UK : Keys.TK).center();
      if (WebApplication.xmasMode) {
        a = new Sprite(this.we, Resources.Wa, Keys.qL);
        a.setX(-230);
        a.setY(-275);
      }
      this.I = new Sprite(this.ra, Resources.Wa);
      this.I.setX(378);
      this.I.setY(364);
      this.fF();
      this.I.center();
      this.uq = 0;
      a = LabelledButton.ol(this.yb("PLAY"));
      a.setX(65);
      a.setY(500);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a.focus();
      a = ButtonBase.create(null, Keys.Uk, Keys.Vk, Keys.KK);
      a.setX(309);
      a.setY(617);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a = new AlbumButton();
      a.setX(129);
      a.setY(617);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      let b = this;
      Audio.once("EContextResumed", function () {
        if (!b.O.Sa.Dc(WebApplication.menuMusicId)) {
          b.sm();
        }
      });
    }
    start() {
      super.start();
      MenuScene.freshBoot = false;
      this.sm();
      this.eD();
      if (Save.hint == 1 && X.ym() && LevelState.Nj() > 3 && this.time > 3) {
        this.oa(new HintPointerAnim());
      }
      this.ia([97, 95, 93, 91, 89][Save.me]);
      Resources.I = null;
      this.JD();
      this.resize();
    }
    resize() {
      var a = 0;
      this.rd.y = 900;
      var b = 0.9;
      var c = this.fa.Se();
      if (c > 1) {
        if (c > 2) {
          c = 2;
        }
        this.rd.y = remap(c, 1, 2, 900, 650);
        a = remap(c, 1, 2, 0, -80);
        b = remap(c, 1, 2, 0.9, 0.8);
      }
      super.layout();
      this.buttons[1].setY(500 + a);
      this.buttons[2].setY(617 + a);
      this.buttons[3].setY(617 + a);
      this.we.setUniformScale(b);
      if (WebApplication.xmasMode) {
        this.I.setX(378);
        this.I.setY(370);
        if (c > 1.1) {
          a = remap(c, 1.1, 2, 0, 1);
          b = this.I;
          b.setX(b.getX() - a * 10);
          b = this.I;
          b.setY(b.getY() - a * 15);
        }
        if (c > 0.6) {
          a = this.I;
          a.setX(a.getX() - 8);
        }
      } else {
        this.I.setX(378);
        this.I.setY(370);
        if (Loader.qv() != "ru") {
          a = this.I;
          a.setX(a.getX() + 3);
          a = this.I;
          a.setY(a.getY() + 6);
        }
        if (c > 1.1) {
          a = remap(c, 1.1, 2, 0, 1);
          b = this.I;
          b.setX(b.getX() - a * 8);
          b = this.I;
          b.setY(b.getY() - a * 7);
        }
      }
      if (WebApplication.xmasMode && c > 0.6) {
        c = this.we;
        c.setUniformScale(c.Ra * 0.85);
      }
      b = this.fa.dr();
      c = this.Ea.getWidth() / this.Pc.X.x;
      this.Pc.setUniformScale(c);
      this.Pc.setX((b.A + b.B) / 2);
      c = this.Pc;
      c.setX(c.getX() - this.Pc.getWidth() / 2);
      this.Pc.setY(this.Ea.getHeight() - this.Pc.getHeight());
      if (this.oN) {
        this.Pc.setY(b.G - b.D - this.Pc.getHeight());
        c = this.Pc;
        c.setY(c.getY() + this.fa.Se() * this.Pc.getHeight() * 0.3);
      }
      c = (b.B - b.A) / 2;
      a = 0.2;
      var d = this.fa.Se();
      if (d > 1) {
        a = 0.2 + (d - 1);
        if (a > 0.3) {
          a = 0.3;
        }
      }
      a = new Bounds(0, 0, c, (b.G - b.D) * a);
      b = b.G;
      let e = a.G - a.D;
      a.G = b;
      a.D = b - e;
      this.Yv = a.hi(1);
      b = d > 1 ? 0.6 : 0.4;
      d = this.Yv;
      this.Mh.setUniformScale((d.B - d.A) * b / this.Mh.X.x);
      d = this.Yv;
      this.Mh.setX((d.A + d.B) / 2 - this.Mh.getWidth() / 2);
      this.Mh.setY(this.Yv.G - this.Mh.getHeight() * 1.1);
      this.Mh.W(0.5);
      d = a.B - a.A;
      a.A = c;
      a.B = c + d;
      c = this.Zv = a.hi(1);
      this.gh.setUniformScale((c.B - c.A) * b / this.gh.X.x);
      c = this.Zv;
      this.gh.setX((c.A + c.B) / 2 - this.gh.getWidth() / 2);
      this.gh.setY(this.Zv.G - this.gh.getHeight() * 1.1);
      this.gh.W(0.5);
    }
    update(a) {
      super.update(a);
      this.resize();
      if (this.$n(HintPointerAnim, this) == null) {
        this.uq -= a;
        if (this.uq <= 0 && this.O.hd().Nb(0) && this.I.Ub(this.pointer.pos)) {
          Save.me = this.VP();
          Save.hint = 0;
          this.fF();
          this.fC();
          SoundFx.play(SoundFx.button);
          Save.flush();
          this.uq = 0.25;
        }
      }
    }
    render(a) {
      super.render(a);
    }
    Pd() {
      if (this.O.lh().Nb(461)) {
        try {
          PlatformBack.back();
        } catch (a) {}
      }
      if (this.hb(1)) {
        this.play();
      }
      if (this.hb(2)) {
        this.qE();
      }
      if (this.hb(3)) {
        this.vp();
      }
    }
    play() {
      if (LevelState.Nj() == 0) {
        if (this.Nm()) {
          this.$(IntroVideoScene);
        } else {
          this.$(LevelScene);
        }
      } else {
        this.$(SelectSeasonScene);
      }
    }
    Nm() {
      return !this.O.SB();
    }
    qE() {
      this.$(OptionsScene);
    }
    vp() {
      this.$(PicturesScene);
    }
    fF() {
      this.I.Fb(Keys.jj(Keys.IK, Save.me));
      switch (Save.me) {
        case 0:
        case 1:
          this.I.Es();
          break;
        case 2:
          this.I.Jm();
      }
    }
    VP() {
      let a = Save.me;
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
    fC() {
      this.I.setUniformScale(0.95);
      this.I.tween().IS();
      this.I.tween().scale(1, 1, Easing.elasticOut(0.1, 0.5));
    }
    eD() {
      if (Save.wg[0][0] == 0) {
        if (this.Nm() && WebApplication.ds) {
          this.O.Xl(IntroVideoScene);
        }
      } else {
        this.O.Xl(SelectSeasonScene);
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
        this.Mh.L(false);
        this.gh.L(false);
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
        if (LevelState.Nj() == 0) {
          if (a.Nm()) {
            a.$(CTRCIntroVideoScene);
          } else {
            let b = CTRCLevelScene;
            SDK.trackLevelStart(currentLevelId(), function () {
              a.$(b);
            });
          }
        } else {
          a.$(CTRCSelectSeasonScene);
        }
      });
    }
    qE() {
      this.$(CTRCOptionsScene);
    }
    eD() {
      if (Save.wg[0][0] == 0) {
        if (this.Nm() && WebApplication.ds) {
          this.O.Xl(CTRCIntroVideoScene);
        }
      } else {
        this.O.Xl(CTRCSelectSeasonScene);
      }
    }
    vp() {
      this.$(CTRCPicturesScene);
    }
    Nm() {
      if (SDK.hasFeature("intro")) {
        return super.Nm();
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
      this.Vg();
      this.sj();
      this.Ke(600, 900);
      this.$k();
      var a = ButtonBase.create(null, Keys.Rt, Keys.St, Keys.mL);
      a.setX(65);
      a.setY(303);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a = ButtonBase.create(null, Keys.Rt, Keys.St, Keys.$K);
      a.setX(311.5);
      a.setY(303);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      this.x = [];
      this.x[1] = new Sprite(this.ra, Resources.Wa, Keys.pz);
      this.x[1].setX(65);
      this.x[1].setY(303);
      this.x[1].L(false);
      this.x[2] = new Sprite(this.ra, Resources.Wa, Keys.pz);
      this.x[2].setX(311.5);
      this.x[2].setY(303);
      this.x[2].L(false);
      this.et(1, Save.Bd);
      this.et(2, Save.Ec);
      a = LabelledButton.ol(this.yb("LANGUAGE"));
      a.setX(65);
      a.setY(420);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a.focus();
      a = LabelledButton.ol(this.yb("RESET"));
      a.setX(65);
      a.setY(537);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
    }
    start() {
      super.start();
      this.sm();
      this.Cq = Save.language;
      this.Vv = LANGUAGES.indexOf(this.Cq);
    }
    layout() {
      let a = this.fa.Se();
      let b = 0;
      this.rd.y = 900;
      if (a > 1.25) {
        this.rd.y = 650;
        b = 1 / a * -350;
        if (this.O.jd) {
          b *= 2;
        }
      }
      super.layout();
      this.ra.setY(this.ih.D + b);
    }
    Oc() {
      super.Oc();
      if (this.Cq != Save.language) {
        this.O.V.ia(Resources.ki);
        Resources.bm[Loader.fontImg] = null;
        Resources.ki = this.createTexture(Loader.fontImg);
        let a = Resources.ov(Save.language, Save.language);
        Resources.ic = Resources.ki.children[a];
        Resources.ji = Resources.ki.children[a + 1];
        this.O.OM();
      }
    }
    Pd() {
      if (this.hb(0)) {
        Save.flush();
        this.Vb();
      }
      if (this.hb(1)) {
        this.Mk();
      }
      if (this.hb(2)) {
        this.Lk();
      }
      if (this.hb(3)) {
        var a = this.Vv + 1;
        let b = LANGUAGES.length;
        a %= b;
        if (a < 0) {
          a += b;
        }
        this.Vv = a;
        Save.Yi(LANGUAGES[this.Vv]);
        Loader.Wi(Save.language);
        a = Resources.ov(this.Cq, Save.language);
        Resources.ic = Resources.ki.children[a];
        Resources.ji = Resources.ki.children[a + 1];
        this.buttons[3].iF();
        this.buttons[4].iF();
        this.buttons[3].Ad(false);
        this.buttons[3].ke = 0;
        this.buttons[3].WD(this.yb("LANGUAGE"));
        this.buttons[4].WD(this.yb("RESET"));
      }
      if (this.hb(4)) {
        this.rE();
      }
    }
    $(a) {
      if (this.Cq != Save.language) {
        Loader.ps(Loader.fontImg);
        Loader.ps(Loader.fontDat);
      }
      super.$(a);
    }
    rE() {
      this.$(ResetScene);
    }
    Mk() {
      Save.Bd = !Save.Bd;
      this.et(1, Save.Bd);
      this.buttons[1].Ad(false);
      this.buttons[1].ke = 0;
      Save.flush();
    }
    Lk() {
      Save.Ec = !Save.Ec;
      if (Save.Ec) {
        this.O.Sa.Sf(1);
      } else {
        this.O.Sa.Sf(0);
      }
      this.et(2, Save.Ec);
      this.buttons[2].Ad(false);
      this.buttons[2].ke = 0;
      Save.flush();
    }
    Vb() {
      this.$(MenuScene);
    }
    et(a, b) {
      let c = this.buttons[a];
      let d = c.icon;
      if (b) {
        d.pp(null);
      } else {
        d.pp(new ColorTransform().Vw(-0.5));
      }
      c.icon.W(b ? 1 : 0.5);
      this.x[a].L(!b);
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
        this.buttons[1].L(false);
        this.buttons[2].L(false);
      }
      if (SDK.hasFeature("force_english")) {
        this.buttons[3].L(false);
        let a = this.buttons[4].j;
        a.setY(a.getY() - 117);
      }
    }
    Vb() {
      this.$(CTRCMenuScene);
    }
    rE() {
      this.$(CTRCResetScene);
    }
    Mk() {
      super.Mk();
      SDK.trackVolumeChange(Save.Ec ? 1 : 0, Save.Bd ? 1 : 0);
    }
    Lk() {
      super.Lk();
      SDK.trackVolumeChange(Save.Ec ? 1 : 0, Save.Bd ? 1 : 0);
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
      this.Vg();
      this.sj();
      this.Ke(600, 900);
      this.$k();
      var a = new TextNode(this.ra, Resources.ic);
      a.setX(20);
      a.setY(100);
      a.setFontSize(50);
      a.Tf(true);
      a.setAlign(0);
      a.setBoxSize(560, 200);
      a.setText(this.yb("RESET_TEXT"));
      a = new TextNode(this.ra, Resources.ji);
      a.setText(this.yb("RESET_HOLD_TEXT"));
      a.setFontSize(40);
      a.Tf(true);
      a.setAlign(0);
      a.setBoxSize(560, 100);
      a.setX(20);
      a.setY(225);
      a = LabelledButton.ol(this.yb("YES"));
      a.setX(65);
      a.setY(383);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a.focus();
      a = LabelledButton.ol(this.yb("NO"));
      a.setX(65);
      a.setY(500);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      this.blink = this.state = 0;
    }
    layout() {
      let a = this.fa.Se();
      let b = 0;
      this.rd.y = 900;
      if (a > 1.25) {
        this.rd.y = 650;
        b = 1 / a * -100;
      }
      super.layout();
      this.ra.setY(this.ih.D + b);
    }
    update(a) {
      super.update(a);
      this.O.lh();
      if (this.state == 2) {
        if (!(this.time < 0.1)) {
          this.buttons[1].$w((this.blink & 1) == 0);
          this.blink++;
          this.time = 0;
          if (this.blink == 10) {
            this.state = 3;
            this.pu();
          }
        }
      } else if (this.pointer.isHovered(1) && this.O.hd().zo(0)) {
        switch (this.state) {
          case 0:
            this.time = 0;
            this.state = 1;
            break;
          case 1:
            if (this.time > 3) {
              a = Save.language;
              Save.instance.reset();
              Save.Yi(a);
              Save.flush();
              LevelState.reset();
              this.state = 2;
              this.blink = this.time = 0;
              this.buttons[1].blur();
            }
        }
      }
    }
    Pd() {
      if (this.hb(0)) {
        this.pu();
      }
      if (this.state != 2 && this.hb(1)) {
        this.time = this.state = 0;
        this.buttons[1].Ad(false);
        this.buttons[1].ke = 0;
      }
      if (this.hb(2)) {
        this.Vb();
      }
    }
    pu() {
      this.$(MenuScene);
    }
    Vb() {
      this.$(OptionsScene);
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
      this.$(CTRCOptionsScene);
    }
    pu() {
      this.$(CTRCMenuScene);
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
      this.Pc = new ColorRectShape(null, new Vec4(0, 0, 0, 1));
      this.Pc.W(0.5);
      this.node.P(this.Pc.u);
      this.Ke(550, 550);
      var a = ButtonBase.create(null, Keys.hz, Keys.iz, Keys.VK);
      this.buttons.push(a);
      a.setX(133.5);
      a.setY(200);
      this.ra.appendChild(a.j);
      this.oa(a);
      a = ButtonBase.create(null, Keys.hz, Keys.iz, Keys.eL);
      this.buttons.push(a);
      a.setX(293.5);
      a.setY(200);
      this.ra.appendChild(a.j);
      this.oa(a);
      a.focus();
      this.state = 0;
      this.O.Sa.Sf(0);
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
    Pd() {
      if (this.state == 0) {
        if (this.hb(1)) {
          this.AD();
        }
        var a = false;
        if (this.O.lh().Nb(415)) {
          a = true;
        }
        if (this.O.lh().Nb(461)) {
          this.Kw();
        } else if (this.hb(2) || a) {
          this.Kw();
        }
      }
    }
    AD() {
      this.kD();
    }
    Kw() {
      this.GD();
    }
    GD() {
      this.O.Sa.Sf(Save.Ec ? 1 : 0);
      SoundFx.Xi(SoundFx.monster_chewing, 1);
      this.Kf();
    }
    kD() {
      SoundFx.stop(SoundFx.monster_chewing);
      this.Ya = this.add(LevelCurtain);
      this.node.P(this.Ya.node);
      this.Ya.ZD();
      this.Ya.JA();
      this.state = 1;
    }
    uE() {
      this.$(SelectLevelScene);
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 1:
          if (this.Ya.state == 7) {
            this.Ya.state = 0;
            this.Ya.nu();
            this.state = 2;
          }
          break;
        case 2:
          if (this.Ya.state == 0) {
            this.state = 3;
            this.uE();
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
    Kw() {
      SDK.trackResume(cachedBind(this, this.GD));
    }
    AD() {
      let a = this;
      SDK.trackLevelFail("quit", currentLevelId(), function () {
        SDK.showInterstitialAd("button:pause:quit", cachedBind(a, a.kD));
      });
    }
    uE() {
      this.$(CTRCSelectLevelScene);
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
