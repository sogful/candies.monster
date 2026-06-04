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
    DD(a) {
      this.PC(a);
    }
    PC(a) {
      LevelState.sp(a);
      SoundFx.play(SoundFx.button);
      this.state = 1;
      this.time = 0;
    }
    init() {
      super.init();
      this.fh.L(true);
      if (LevelCurtain.instance != null) {
        LevelCurtain.instance.dispose();
      }
      this.Ya = this.add(LevelCurtain);
      this.fa.back.P(this.Ya.node);
      this.state = 0;
      this.sj();
      this.$k();
      var a = 20;
      if (LevelState.uB()) {
        a = 0;
      }
      this.vo = new Container();
      var b = Resources.Wa.hc.yf(Keys.$p).ec;
      let c = b.x - a;
      let d = b.y;
      let e = 1;
      this.vi = new Grid2D(5, 5);
      let f = this;
      this.vi.forEach(function (g, h, m) {
        e += 1;
        g = new LevelDot(e - 1);
        f.vo.appendChild(g.j);
        g.j.setX(h * c);
        g.j.setY(m * d);
        return g;
      });
      this.vo.setX(-5);
      this.size = new Size(c * 5, d * 5);
      this.Ke(this.size.x, this.size.y);
      this.ra.appendChild(this.vo);
      for (a = this.vi.iterator(); a.fb();) {
        b = a.next();
        if (LevelState.LO(b.Ci)) {
          b.bS(LevelState.sv(b.Ci), LevelState.uB(b.Ci));
        }
      }
      for (a = this.vi.iterator(); a.fb();) {
        b = a.next();
        if (LevelState.sv(b.Ci) < 3) {
          b.focus();
          this.jh = b;
          break;
        }
      }
      if (this.jh == null) {
        a = this.vi;
        this.jh = a.N[a.Tb * 0];
      }
      this.jh.focus();
      this.vb = this.add(ScoreLabel);
      a = LevelState.QA();
      this.vb.setText(Numeric.Ed(a == 0 ? 0 : a));
      this.sm();
    }
    start() {
      super.start();
      this.O.Sa.Sf(Save.Ec ? 1 : 0);
    }
    dispose() {
      super.dispose();
      this.Ya = null;
    }
    Nd() {
      super.Nd();
      Resources.xj = this.createTexture([196, 191, 186, 181, 176, 171, 166, 161, 155, 150, 145, 140, 135, 130, 125, 120, 115][LevelState.box - 1]);
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 0:
          if (this.O.hd().oF(0)) {
            for (var b = this.vi.iterator(); b.fb();) {
              a = b.next();
              if (a.Ub(this.pointer.pos)) {
                b = this.jh;
                if (b != null) {
                  b.blur();
                }
                this.jh = a;
                this.jh.focus();
                break;
              }
            }
          }
          if (this.O.hd().Nb(0)) {
            for (a = this.vi.iterator(); a.fb();) {
              b = a.next();
              if (b.Ub(this.pointer.pos)) {
                this.Gv = b;
                break;
              }
            }
          }
          if (this.O.hd().qe(0) && this.Gv != null && this.Gv.Ub(this.pointer.pos)) {
            this.DD(this.Gv.Ci);
          }
          if (this.jh != null) {
            a = new Coord();
            b = this.vi;
            var c = this.jh.Ci - 1;
            a.y = c / b.Tb | 0;
            a.x = c % b.Tb;
            b = this.vi;
            c = this.jh.Ci - 1;
            a.y = c / b.Tb | 0;
            a.x = c % b.Tb;
          }
          break;
        case 1:
          a = this.jb(0.3);
          this.mi().bf(1 - a);
          if (a == 1) {
            this.Uq();
            this.Ya.DM();
            this.state = 2;
          }
          break;
        case 2:
          if (this.Ya.state == 0) {
            this.state = 3;
            this.Ya.remove();
            this.gk();
          }
      }
    }
    transitionOut(a, b) {
      if (b instanceof LevelScene) {
        if (a == 0) {
          this.fa.back.removeChild(this.Ya.node);
          this.fa.front.P(this.Ya.node);
        }
      } else {
        super.transitionOut(a, b);
        if (a == 1 && b instanceof SelectBoxScene) {
          this.Ya.dispose();
        }
      }
    }
    layout() {
      this.rd.y = this.size.y;
      this.vo.setY(0);
      let a = this.fa.Se();
      if (!this.O.Vj && a > 0.7) {
        this.rd.y += 400;
        this.vo.setY(200);
      }
      super.layout();
      this.Ya.layout();
      this.$n(ScoreLabel, this).layout();
    }
    Pd() {
      if (this.hb(0)) {
        this.Vb();
      }
    }
    Vb() {
      switch (LevelState.season) {
        case 1:
          this.$(Season1Scene);
          break;
        case 2:
          this.$(Season2Scene);
          break;
        case 3:
          this.$(Season3Scene);
      }
    }
    gk() {
      this.$(LevelScene);
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
    DD(a) {
      LevelState.sp(a);
      let b = this;
      SDK.trackLevelStart(currentLevelId(), function () {
        SDK.showInterstitialAd("button:levelselection:level", function () {
          b.PC(a);
        });
      });
    }
    gk() {
      this.$(CTRCLevelScene);
    }
    Vb() {
      switch (LevelState.season) {
        case 1:
          this.$(CTRCSeason1Scene);
          break;
        case 2:
          this.$(CTRCSeason2Scene);
          break;
        case 3:
          this.$(CTRCSeason3Scene);
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
      b.push([97, 95, 93, 91, 89][Save.me]);
      b.push([98, 96, 94, 92, 90][Save.me]);
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
    Oj() {
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
      LevelScene.ev = false;
      this.Go = 0;
      this.Sm = this.O.jd && this.O.window.Hc.x == 1920;
      this.fh.L(false);
      this.np = new ColorRectShape(null, new Vec4(1, 1, 1, 1));
      this.S = new LevelController(this);
      var a = ButtonBase.create(null, Keys.AK, Keys.BK);
      this.buttons.push(a);
      this.node.P(a.j.u);
      a = ButtonBase.create(null, Keys.CK, Keys.DK);
      this.buttons.push(a);
      this.node.P(a.j.u);
      if (WebApplication.externalMute) {
        a = ButtonBase.create(null, Keys.zK, Keys.yK, Keys.ez);
        a.icon.L(!Save.Ec);
        this.buttons.push(a);
        this.node.P(a.j.u);
        a = ButtonBase.create(null, Keys.FK, Keys.EK, Keys.ez);
        a.icon.L(!Save.Bd);
        this.buttons.push(a);
        this.node.P(a.j.u);
      }
      if (WebApplication.magnetEnabled) {
        this.tO();
      }
      if (WebApplication.telekinesisEnabled) {
        this.wO();
      }
      this.uf(false);
      this.vb = new Container();
      this.node.P(this.vb.u);
      for (a = 0; a < 3;) {
        ++a;
        new Sprite(this.vb, Resources.Wa, HUD_STAR_FRAME_0).center();
      }
      a = this.vb.nb(0).getWidth();
      var b = this.vb.nb(0);
      b.setX(b.getX() - a);
      b = this.vb.nb(2);
      b.setX(b.getX() + a);
      a = this.O.jd ? this.Sm ? 40 : 80 : 60;
      this.ee = new Container();
      b = new TextNode(this.ee, Resources.ic);
      b.setBoxSize(200, a);
      b.setText(this.yb("LEVEL"));
      b.setMultiline();
      b = new TextNode(this.ee, Resources.ic);
      b.setY(a * 0.9);
      b.setBoxSize(200, a);
      this.gF();
      this.node.P(this.ee.u);
      this.Vo = this.state = this.ti = this.so = 0;
      this.tm = this.hg = false;
    }
    Oc() {
      super.Oc();
      if (this.Ya != null) {
        this.Ya.remove();
      }
      let a = 0;
      let b = [27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7];
      while (a < b.length) {
        this.ia(b[a++]);
      }
    }
    Nd() {
      super.Nd();
      let a = LevelState.box - 1;
      if (Resources.I == null) {
        Resources.I = this.createTexture([97, 95, 93, 91, 89][Save.me]);
        Resources.Fu = this.createTexture(Loader.char1);
        Resources.iM = this.createTexture(Loader.char2);
        Resources.eT = this.createTexture(Loader.gameTut);
        Resources.Oa = this.createTexture(Loader.objStar);
        Resources.ph = this.createTexture(Loader.objHook);
      }
      if (Resources.ca == null && Loader.ob(Loader.objBubble)) {
        Resources.ca = this.createTexture(Loader.objBubble);
      }
      if (Resources.Dd == null && Loader.ob(Loader.objSpikes)) {
        Resources.Dd = this.createTexture(Loader.objSpikes);
      }
      if (Resources.wm == null && Loader.ob(Loader.objPump)) {
        Resources.wm = this.createTexture(Loader.objPump);
      }
      if (Resources.mc == null && Loader.ob(Loader.objSpider)) {
        Resources.mc = this.createTexture(Loader.objSpider);
      }
      if (Resources.ce == null && Loader.ob(Loader.objElectro)) {
        Resources.ce = this.createTexture(Loader.objElectro);
      }
      if (Resources.Dk == null && Loader.ob(Loader.objSock)) {
        Resources.Dk = this.createTexture(Loader.objSock);
      }
      if (Resources.fd == null && Loader.ob(Loader.objBouncer)) {
        Resources.fd = this.createTexture(Loader.objBouncer);
      }
      if (Resources.Kb == null && Loader.ob(Loader.objGravity)) {
        Resources.Kb = this.createTexture(Loader.objGravity);
        if (LevelState.box == 8) {
          Resources.Xn = this.createTexture(Loader.box8Earth);
        }
      }
      if (Resources.gl == null && Loader.ob(Loader.objBlades)) {
        Resources.gl = this.createTexture(Loader.objBlades);
      }
      if (Resources.Ld == null && Loader.ob(Loader.objBee)) {
        Resources.Ld = this.createTexture(Loader.objBee);
      }
      if (Resources.Tc == null && Loader.ob(Loader.objVinyl)) {
        Resources.Tc = this.createTexture(Loader.objVinyl);
      }
      if (Resources.de == null && Loader.ob(Loader.objGhost)) {
        Resources.de = this.createTexture(Loader.objGhost);
      }
      if (Resources.Kk == null && Loader.ob(Loader.objSteam)) {
        Resources.Kk = this.createTexture(Loader.objSteam);
      }
      if (Resources.Ai == null && Loader.ob(Loader.objLantern)) {
        Resources.Ai = this.createTexture(Loader.objLantern);
      }
      if (Resources.wf == null && Loader.ob(Loader.objGap)) {
        Resources.wf = this.createTexture(Loader.objGap);
      }
      if (Resources.Ef == null && Loader.ob(Loader.objLighter)) {
        Resources.Ef = this.createTexture(Loader.objLighter);
      }
      if (Resources.Rc == null && Loader.ob(Loader.objTransporter)) {
        Resources.Rc = this.createTexture(Loader.objTransporter);
      }
      if (Resources.Kd == null && Loader.ob(Loader.objSp)) {
        Resources.Kd = this.createTexture(Loader.objSp);
      }
      if (Resources.ml == null && Loader.ob(Loader.char3)) {
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
          this.FQ();
          this.S.show();
          this.Ya = LevelCurtain.instance;
          if (this.Ya == null) {
            this.uf(true);
            this.setState(1);
            break;
          }
          this.oa(this.Ya);
          this.Ya.dF(function () {
            a.Ya.dispose();
            a.uf(true);
          });
          this.Lw();
          this.setState(1);
          break;
        case 4:
          this.Hs(true);
          this.setState(1);
          this.buttons[1].Ad(false);
          break;
        case 9:
          this.S.dispose();
          this.S = new LevelController(this);
          this.S.show();
          this.S.update(0.016666666666666666);
          this.Ya.dF(function () {
            a.Ya.dispose();
            a.uf(true);
          });
          this.setState(1);
          this.uf(false);
          this.Lw();
          this.gF();
          this.oE();
      }
    }
    uw(a) {
      this.vb.nb(a - 1).pa().play(HUD_STAR_ANIM);
      this.Vo++;
    }
    rw() {
      this.hg = true;
      new Sprite(this.vb, Resources.Wa, HUD_STAR_FRAME_0).center();
      let a = this.vb.nb(0).getWidth();
      let b = a * -1.5;
      let c = 0;
      while (c < 4) {
        this.vb.nb(c++).setX(b);
        b += a;
      }
      this.vb.nb(3).pa().play(HUD_STAR_ANIM);
    }
    tw() {
      this.uf(false);
      this.mp();
      this.tm = false;
    }
    fQ() {
      LevelState.TR(Math.max(LevelState.sv(), this.Vo), this.hg);
      SoundFx.Zn(SoundFx.monster_chewing);
      this.setState(5);
      this.zl();
    }
    eQ() {
      this.uf(false);
      this.mp();
      this.tm = false;
    }
    JC() {
      if (this.state == 1) {
        if (LevelScene.am != -1 && (this.Go++, this.Go == LevelScene.am)) {
          this.Go = 0;
          let a = 1;
          let b = this.buttons.length;
          while (a < b) {
            this.buttons[a++].Ad(true);
          }
          // preview bridge: skip the curtain (box-closing) fail animation
          // in custom-level mode so CD()->Of() can run the white-fade
          // restart while state is still 1 (Of() guards on state == 1).
          if (window.customleveldata == null) {
            this.setState(6);
            this.zl();
          }
        }
        this.CD();
      }
    }
    zl() {
      this.Ya = this.add(LevelCurtain);
      this.Ya.ZD();
      this.node.P(this.Ya.node);
      this.Ya.JA();
    }
    tO() {
      this.td = new AdPowerupButtonA();
      this.buttons.push(this.td);
      this.node.P(this.td.j.u);
    }
    wO() {
      this.ne = new AdPowerupButtonB();
      this.buttons.push(this.ne);
      this.node.P(this.ne.j.u);
    }
    mp() {
      if (WebApplication.magnetEnabled) {
        this.td.reset();
      }
      if (WebApplication.telekinesisEnabled) {
        this.ne.reset();
      }
    }
    uf(a) {
      let b = 1;
      let c = this.buttons.length;
      while (b < c) {
        this.buttons[b++].Ad(a ? false : true);
      }
    }
    CD() {
      this.Of();
    }
    Of() {
      if (this.state == 1 && !this.S.Cm) {
        this.S.Cm = true;
        this.Lw();
        this.node.P(this.np.u);
        this.np.W(0);
        this.uf(false);
        this.mp();
        this.setState(2);
      }
    }
    tx() {
      this.Dg(PauseScene);
    }
    setState(a) {
      this.state = a;
      this.time = 0;
      if (a == 1) {
        this.tm = true;
        this.vs = 0;
      }
    }
    Lw() {
      this.hg = false;
      this.Vo = 0;
      if (this.vb.Mj() == 4) {
        this.vb.nb(3).free();
      }
      var a = this.vb.nb(0).getWidth();
      this.vb.nb(0).setX(-a);
      this.vb.nb(1).setX(0);
      this.vb.nb(2).setX(a);
      for (a = 0; a < 3;) {
        this.vb.nb(a++).Fb(HUD_STAR_FRAME_0);
      }
    }
    oE() {
      this.ti = this.so = 0;
      this.ee.L(true);
    }
    gF() {
      let a = this.ee.nb(1);
      a.setFontSize(100);
      a.setText("" + LevelState.box + " - " + LevelState.level);
      a.setMultiline();
    }
    Hs(a) {
      this.vb.L(a);
      this.buttons[1].L(a);
      this.buttons[2].L(a);
      if (a && !WebApplication.externalPause) {
        this.buttons[1].L(a);
      }
      if (WebApplication.externalMute) {
        this.buttons[3].L(a);
        this.buttons[4].L(a);
      }
      if (WebApplication.magnetEnabled) {
        this.td.L(a);
      }
      if (WebApplication.telekinesisEnabled) {
        this.ne.L(a);
      }
    }
    update(a) {
      super.update(a);
      this.ti += a;
      switch (this.so) {
        case 0:
          var b = Math.min(this.ti / 0.5, 1);
          if (b == 1) {
            this.so = 1;
            this.ti = 0;
          }
          this.ee.W(Easing.quadOut()(b));
          break;
        case 1:
          if (this.ti > 1) {
            this.so = 2;
            this.ti = 0;
          }
          break;
        case 2:
          b = Math.min(this.ti / 0.5, 1);
          if (b == 1) {
            this.so = 3;
            this.ee.L(false);
          }
          this.ee.W(Easing.quadOut()(1 - b));
      }
      LevelScene.isPlaying = this.state == 1;
      switch (this.state) {
        case 1:
          this.sB();
          this.S.update(a);
          this.VQ(a);
          if (LevelScene.pendingLevelJump != -1) {
            SoundFx.stop(SoundFx.monster_chewing);
            this.tm = false;
            this.mp();
            this.uf(false);
            a = LevelState.xN(LevelScene.pendingLevelJump);
            this.Ha.box = a[0];
            this.Ha.level = a[1];
            LevelScene.pendingLevelJump = -1;
            this.FD();
            this.state = 9;
          }
          if (LevelScene.pendingRestart) {
            LevelScene.pendingRestart = false;
            SoundFx.stop(SoundFx.monster_chewing);
            this.tm = false;
            this.mp();
            this.uf(false);
            this.zl();
            this.setState(8);
          }
          if (LevelScene.ev) {
            LevelScene.ev = false;
            a = LevelScene.am;
            LevelScene.am = 1;
            this.Go = 0;
            this.JC();
            LevelScene.am = a;
          }
          break;
        case 2:
          a = this.jb(window.customleveldata != null ? 0.25 : 0.15);
          this.np.W(a);
          if (a == 1) {
            this.S.dispose();
            this.S = new LevelController(this);
            this.S.show();
            this.setState(3);
          }
          break;
        case 3:
          this.S.update(a);
          a = this.jb(window.customleveldata != null ? 0.5 : 0.2);
          this.np.W(1 - a);
          if (a == 1) {
            this.node.removeChild(this.np.u);
            this.setState(1);
            this.uf(true);
            this.oE();
          }
          break;
        case 4:
          this.S.update(0);
          break;
        case 5:
          this.S.update(a);
          if (this.Ya.state == 7) {
            this.Ya.state = 0;
            this.state = 9;
            this.nE();
          }
          break;
        case 6:
          this.S.update(a);
          if (this.Ya.state == 7) {
            this.state = 9;
            this.Ha.count = this.Go;
            this.pE();
          }
          break;
        case 7:
          this.S.update(a);
          break;
        case 8:
          this.S.update(a);
          if (this.Ya.state == 7) {
            this.Ya.state = 0;
            this.state = 9;
            this.$(MenuScene);
          }
      }
    }
    iq(a) {
      super.iq(a);
      this.resize();
    }
    Pd() {
      if (this.state != 7) {
        var a = this.O.lh().Nb(112);
        if (this.O.lh().Nb(173) || this.O.lh().Nb(461)) {
          a = true;
        }
        if (WebApplication.externalPause && (this.hb(1) || a)) {
          if (this.state != 1) {
            this.buttons[1].Ad(false);
            return;
          }
          SoundFx.Xi(SoundFx.monster_chewing, 0);
          this.S.Ml();
          this.sB();
          this.Hs(false);
          this.setState(4);
          this.zD();
        }
        if (this.hb(2)) {
          this.BD();
        }
        if (WebApplication.externalMute) {
          if (this.hb(3)) {
            this.Lk(this.buttons[3]);
          }
          if (this.hb(4)) {
            this.Mk(this.buttons[4]);
          }
        }
        if (!this.S.Rl && !this.S.Ve) {
          if (WebApplication.magnetEnabled && this.hb(WebApplication.externalMute ? 5 : 3)) {
            if (AdPowerupButtonA.Mf == 0) {
              this.yD();
            } else {
              this.td.use();
              if (WebApplication.telekinesisEnabled) {
                this.ne.pm = true;
              }
              this.S.GL();
              if (!Save.Ho) {
                Save.Ho = true;
                Save.flush();
                a = new LevelToast(Strings.get("MAGNET_TIP"));
                this.node.P(a.j.u);
                this.oa(a);
              }
            }
          }
          if (WebApplication.telekinesisEnabled && this.hb(WebApplication.externalMute ? 6 : 4)) {
            if (AdPowerupButtonB.Mf == 0) {
              this.ED();
            } else {
              this.ne.use();
              if (WebApplication.magnetEnabled) {
                this.td.pm = true;
              }
              this.S.HL();
              if (!Save.Dp) {
                Save.Dp = true;
                Save.flush();
                a = new LevelToast(Strings.get("ANTIMAGNET_TIP"));
                this.node.P(a.j.u);
                this.oa(a);
              }
            }
          }
        }
      }
    }
    transitionOut(a, b) {
      if (b instanceof SelectBoxScene) {
        this.fh.L(true);
        if (a == 1 && b instanceof SelectBoxScene) {
          LevelCurtain.instance.dispose();
        }
      }
      if (b instanceof MenuScene) {
        this.fh.L(true);
        if (a == 1 && b instanceof MenuScene) {
          LevelCurtain.instance.dispose();
        }
      }
      if (b instanceof WarpScene) {
        this.fh.L(true);
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
        let b = this.S;
        if (b != null) {
          b.render(a);
        }
      }
      super.render(a);
    }
    VQ(a) {
      if (!!this.tm && (!!WebApplication.magnetEnabled || !!WebApplication.telekinesisEnabled) && !this.S.Rl && !this.S.Ve) {
        this.vs += a;
        if (this.vs >= 1) {
          this.vs = 0;
          a = this.tr();
          if (WebApplication.magnetEnabled) {
            this.td.ND(a);
          }
          if (WebApplication.telekinesisEnabled) {
            this.ne.ND(a);
          }
        }
      }
    }
    tr() {
      return true;
    }
    resize() {
      var a = this.O.window.lo();
      var b = window.devicePixelRatio;
      var c = b < 1 ? 1 : b > 2 ? 2 : b;
      var d = this.O.window.bp;
      var e = this.fa.Se();
      b = e > 1;
      c = c <= 1 ? 0.05 : c <= 1.25 ? 0.06 : 0.07;
      if (this.O.Vj) {
        c = (c = Math.min(a.w, a.J) <= 800 && Math.max(a.w, a.J) <= 1280 && d <= 2) ? 0.08 : 0.04;
      }
      if (this.O.jd) {
        c = 0.04;
      }
      c = Math.max(a.w, a.J) * c * d;
      if (!this.O.Vj) {
        if (c < 70) {
          c = 70;
        }
      }
      if (b) {
        c *= 0.9;
      }
      let f = 30;
      var g = 0;
      if (this.O.jd) {
        g = d * 25;
        f = 60;
      }
      this.vb.setUniformScale(c / 150);
      var h = 0;
      if (this.O.jd) {
        h = 20;
      }
      this.vb.setX(a.w / 2);
      var m = this.O.jd ? this.Sm ? 0.75 : 1.4 : 1;
      var n = this.buttons[1];
      if (WebApplication.externalPause) {
        n.j.setUniformScale(c / n.ec.y * m);
        n.up(a.w - h - g);
        n.setY(0);
      } else {
        n.L(false);
      }
      d = this.buttons[2];
      d.j.setUniformScale(c / d.ec.y * m);
      if (WebApplication.externalPause) {
        d.up(n.getX() - h);
      } else {
        d.up(a.w - h);
      }
      d.setY(0);
      n = null;
      if (WebApplication.externalMute) {
        var q = this.buttons[3];
        q.j.setUniformScale(c / q.ec.y * m);
        q.up(d.getX() - h);
        q.setY(0);
        n = this.buttons[4];
        n.j.setUniformScale(c / n.ec.y * m);
        n.up(q.getX() - h);
        n.setY(0);
      }
      if (WebApplication.magnetEnabled) {
        q = c / this.td.ec.y * m;
        this.td.setX(g);
        this.td.j.setUniformScale(q);
      }
      if (WebApplication.telekinesisEnabled) {
        this.ne.j.setUniformScale(c / this.td.ec.y * m);
        if (WebApplication.magnetEnabled) {
          this.ne.setX(this.td.getX() + this.td.getWidth() + h);
        } else {
          this.ne.setX(g);
        }
      }
      h = 1;
      for (m = this.buttons.length; h < m;) {
        this.buttons[h++].j.setY(g);
      }
      this.vb.setY(d.getY() + d.getHeight() / 2);
      if (e < 0.8) {
        e = WebApplication.magnetEnabled && WebApplication.telekinesisEnabled ? this.ne.yv() : WebApplication.magnetEnabled ? this.td.yv() : WebApplication.telekinesisEnabled ? this.ne.yv() : 0;
        g = WebApplication.externalMute ? n.getX() : d.getX();
        this.vb.setX(e + (g - e) / 2);
        if (g - e < this.vb.getWidth()) {
          e = this.vb;
          e.setY(e.getY() + this.vb.getHeight() * 1.25);
        }
      }
      this.ee.setUniformScale(c / 100);
      this.ee.setX(f);
      this.ee.setY(a.J - this.ee.getHeight() * 1.1 - f);
      if (this.O.Vj && b) {
        a = this.ee;
        a.setX(a.getX() + 20);
        a = this.ee;
        a.setY(a.getY() - 20);
      }
    }
    yD() {
      this.setState(7);
      DelayedCall.delay(cachedBind(this, this.KC), 1000);
    }
    KC() {
      this.td.fill(WebApplication.magnetRefill);
      SoundFx.play(SoundFx.pump_4);
      this.S.Ml();
      this.setState(1);
    }
    iQ() {
      this.S.Ml();
      this.td.reject();
      this.setState(1);
    }
    ED() {
      this.setState(7);
      DelayedCall.delay(cachedBind(this, this.RC), 1000);
    }
    RC() {
      this.ne.fill(WebApplication.telekinesisRefill);
      SoundFx.play(SoundFx.pump_4);
      this.S.Ml();
      this.setState(1);
    }
    qQ() {
      this.S.Ml();
      this.ne.reject();
      this.setState(1);
    }
    zD() {
      this.tx();
    }
    FD() {
      this.$(WarpScene);
    }
    Lk(a) {
      Save.Ec = !Save.Ec;
      Save.flush();
      a.icon.L(!Save.Ec);
      a.Ad(false);
      a.ke = 0;
      this.O.Sa.Sf(Save.Ec ? 1 : 0);
    }
    Mk(a) {
      Save.Bd = !Save.Bd;
      Save.flush();
      a.icon.L(!Save.Bd);
      a.Ad(false);
      a.ke = 0;
    }
    BD() {
      this.Of();
    }
    sB() {
      let a = this.O.hd();
      let b = this.O.Qj();
      let c = 0;
      let d = vA6;
      while (c < d.length) {
        let f = d[c];
        ++c;
        var e = a.position[f];
        e = new Size(e.x, e.y);
        let g = b.bO(f);
        if (a.Nb(f)) {
          this.S.WS(e, g);
        }
        if (a.oF(f)) {
          this.S.XS(e, g);
        }
        if (a.qe(f)) {
          this.S.YS(e, g);
        }
      }
    }
    nE() {
      this.Ha.stars = this.Vo;
      this.Ha.blueStar = this.hg;
      this.Dg(LevelClearedOverlay);
    }
    pE() {
      this.Dg(LevelLostOverlay);
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
      LevelScene.am = 1;
      this.Ox = false;
    }
    tr() {
      return SDK.hasRewardedAd();
    }
    yD() {
      this.setState(7);
      SDK.trackDesignEvent("game:powerup:magnet:rewarded");
      let a = this;
      SDK.showRewardedAd(function (b) {
        if (b) {
          a.KC();
        } else {
          a.iQ();
        }
      });
    }
    ED() {
      this.setState(7);
      SDK.trackDesignEvent("game:powerup:telekinesis:rewarded");
      let a = this;
      SDK.showRewardedAd(function (b) {
        if (b) {
          a.RC();
        } else {
          a.qQ();
        }
      });
    }
    tw() {
      if (LevelState.level == 25 && Save.Df[LevelState.box - 1][LevelState.level] == null) {
        let a = Strings.get("BOX1_LABEL BOX2_LABEL BOX3_LABEL BOX4_LABEL BOX5_LABEL BOX6_LABEL BOX7_LABEL BOX8_LABEL BOX9_LABEL BOX10_LABEL BOX11_LABEL BOX12_LABEL BOX13_LABEL BOX14_LABEL BOX15_LABEL BOX16_LABEL BOX17_LABEL".split(" ")[LevelState.box - 1]);
        SDK.trackEvent("EVENT_CUSTOM", {
          eventName: "BOX_CLEARED",
          boxId: LevelState.box,
          boxName: a
        });
      }
      this.Ox = true;
      super.tw();
    }
    Mk(a) {
      super.Mk(a);
      SDK.trackVolumeChange(Save.Ec ? 1 : 0, Save.Bd ? 1 : 0);
    }
    Lk(a) {
      super.Lk(a);
      SDK.trackVolumeChange(Save.Ec ? 1 : 0, Save.Bd ? 1 : 0);
    }
    zD() {
      let a = this;
      SDK.trackPause(function () {
        SDK.showInterstitialAd("button:level:pause", cachedBind(a, a.tx));
      });
    }
    tx() {
      this.Dg(CTRCPauseScene);
    }
    BD() {
      let a = this;
      SDK.trackLevelRestart(currentLevelId(), function () {
        a.Hs(false);
        SDK.showInterstitialAd("button:level:restart", function () {
          a.Hs(true);
          a.Of();
        });
      });
    }
    CD() {
      // preview bridge: skip SDK tracking / interstitial in custom-level
      // mode so the white-fade restart runs immediately.
      if (window.customleveldata != null) {
        this.Of();
        return;
      }
      let a = this;
      SDK.trackLevelEnd(LevelState.Nj(), "fail", function () {
        SDK.trackLevelFail("dead", currentLevelId(), function () {
          SDK.showInterstitialAd("break:fail", cachedBind(a, a.Of));
        });
      }, function () {
        a.Of();
      });
    }
    FD() {
      this.$(CTRCWarpScene);
    }
    uw(a) {
      super.uw(a);
      SDK.trackLiveScore(a);
    }
    nE() {
      this.Ha.stars = this.Vo;
      this.Ha.blueStar = this.hg;
      this.Dg(CTRCLevelClearedOverlay);
    }
    zl() {
      let a = this;
      if (this.state == 5 && this.Ox) {
        SDK.trackLevelEnd(LevelState.Nj(), "success", function () {
          a.Ox = false;
          a.zl();
        }, function () {});
      } else {
        super.zl();
      }
    }
    pE() {
      // preview bridge: in custom-level mode, skip the fail overlay and just
      // trigger the white-fade restart flow directly (durations bumped to
      // 0.5s by the patched case 2 / case 3 in LevelScene.update).
      if (window.customleveldata != null) {
        this.Of();
        return;
      }
      this.Dg(CTRCLevelLostOverlay);
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
    static xN(a) {
      return [1 + ((a - 1) / 25 | 0), (a - 1) % 25 + 1];
    }
    static zk(a) {
      LevelState.season = a;
    }
    static Ui(a) {
      LevelState.box = a;
    }
    static sp(a) {
      LevelState.level = a;
    }
    static TR(a, b) {
      let c = LevelState.box - 1;
      let d = LevelState.level - 1;
      Save.wg[c][d] = a;
      Save.ig[c][d] = b ? 1 : 0;
      if (d < 25) {
        Save.Df[c][d + 1] = true;
      }
      Save.flush();
    }
    static QN() {
      return Save.Mi.length;
    }
    static QB(a) {
      return Save.Mi.includes("" + LevelMath.PA(a) + "-" + LevelMath.rv(a));
    }
    static OO() {
      switch (LevelState.box) {
        case 1:
          return [-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1][LevelState.level] == 1;
        case 2:
          return [-1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0][LevelState.level] == 1;
        default:
          return false;
      }
    }
    static mO() {
      if (!LevelState.OO() || Save.Mi.includes("" + LevelState.box + "-" + LevelState.level)) {
        return false;
      }
      Save.Mi.push("" + LevelState.box + "-" + LevelState.level);
      Save.kk++;
      Save.flush();
      return true;
    }
    static LO(a) {
      return Save.Df[LevelState.box - 1][a - 1];
    }
    static Ar(a) {
      return Save.locked[a - 1];
    }
    static hA(a) {
      return LevelState.tv(a) <= 0;
    }
    static iT(a) {
      Save.locked[a - 1] = false;
      Save.Df[a - 1][0] = true;
      Save.flush();
    }
    static tv(a) {
      --a;
      return BOX_STAR_THRESHOLDS[a] - LevelState.wv();
    }
    static hl() {
      return LevelState.level == 25;
    }
    static nS() {
      LevelState.sp(LevelState.level + 1);
    }
    static Nj() {
      let a = 0;
      let b = LevelState.season;
      let c = 0;
      while (c < 3) {
        LevelState.season = c++ + 1;
        a += LevelState.wv();
      }
      LevelState.season = b;
      return a;
    }
    static wv() {
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
          c += Save.wg[d][f];
          c += Save.ig[d][f];
        }
      }
      return c;
    }
    static QL() {
      let a = 0;
      while (a < 17) {
        let b = a++;
        let c = 0;
        while (c < 25) {
          if (!Save.Df[b][c++]) {
            return false;
          }
        }
      }
      return true;
    }
    static QA(a) {
      if (a == null) {
        a = LevelState.box;
      }
      let b = 0;
      let c = 0;
      while (c < 25) {
        let d = c++;
        b += Save.wg[a - 1][d];
        b += Save.ig[a - 1][d];
      }
      return b;
    }
    static sv(a) {
      if (a == null) {
        a = LevelState.level;
      }
      return Save.wg[LevelState.box - 1][a - 1];
    }
    static uB(a) {
      if (a == null) {
        a = LevelState.level;
      }
      return Save.ig[LevelState.box - 1][a - 1] > 0;
    }
  }
  LevelState.i = true;
