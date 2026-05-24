  class SelectSeasonScene extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      return [Loader.fontDat, Loader.fontImg, Loader.menuBg, Loader.menuShadow, Loader.menuUi, Loader.menuUiJson, Loader.strings, Loader.menuSeasons, Loader.menuSeasonsJson, WebApplication.menuMusicId];
    }
    init() {
      super.init();
      this.ia(Loader.menuSeason1);
      this.ia(Loader.menuSeason2);
      this.ia(Loader.menuSeason3);
      this.eF();
      this.Vg();
      this.Ke(600, 900);
      this.sj();
      this.$k();
      Resources.Ig = this.createTexture(Loader.menuSeasons);
      this.Qz = 750 / Resources.Ig.hc.yf(Keys.Pt).ec.x;
      this.offsetY = 150;
      this.CE = Resources.Ig.hc.yf(Keys.Pt).ec.y * 0.7;
      this.Ig = [];
      let a = 0;
      while (a < 3) {
        var b = a++;
        let c = new Container(null, this.ra);
        new Sprite(c, Resources.Ig, Keys.Pt);
        new Sprite(c, Resources.Ig, [Keys.rJ, Keys.sJ, Keys.tJ][b]);
        c.center();
        c.setUniformScale(this.Qz);
        c.setX(300);
        c.setY(this.offsetY + b * this.CE);
        this.Ig.push(c);
        let d = new TextNode(c, Resources.ic);
        d.setX(312);
        d.setY(140);
        d.setFontSize(70);
        d.setAlign(0);
        d.setBoxSize(400, 100);
        d.setText(this.yb("SEASON_NO", Numeric.Ed(b + 1)));
        b = ButtonBase.create(Resources.Ig, Keys.uJ, Keys.vJ);
        b.setX(512);
        b.setY(285);
        b.j.center();
        c.appendChild(b.j);
        this.buttons.push(b);
        this.oa(b);
      }
      this.buttons[1].focus();
    }
    start() {
      super.start();
      this.sm();
      this.JD();
    }
    layout() {
      super.layout();
      let a = Math.min(Math.max(0, this.O.window.bo() - 1), 0.2);
      let b = 0;
      while (b < 3) {
        let c = b++;
        this.Ig[c].setUniformScale(this.Qz + a);
        this.Ig[c].setY(this.offsetY + c * (this.CE + a * 150));
      }
    }
    Oc() {
      super.Oc();
      Resources.Ig = null;
      this.ia(Loader.menuSeasons);
    }
    Pd() {
      if (this.hb(0)) {
        Save.flush();
        this.Mp(LevelState.box);
        this.Vb();
      } else {
        for (var a = 1; a < 4;) {
          let b = a++;
          if (this.hb(b)) {
            this.fN(b);
          }
        }
      }
    }
    fN(a) {
      if (a != LevelState.season) {
        this.ia([40, 38, 36][LevelState.season - 1]);
        Resources.Yb = null;
      }
      LevelState.zk(a);
      this.Mp(LevelState.box);
      switch (a) {
        case 1:
          LevelState.Ui(1);
          break;
        case 2:
          LevelState.Ui(6);
          break;
        case 3:
          LevelState.Ui(11);
      }
      this.$(this.hB()[a - 1]);
    }
    hB() {
      return [Season1Scene, Season2Scene, Season3Scene];
    }
    Vb() {
      this.$(MenuScene);
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
    Vb() {
      this.$(CTRCMenuScene);
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
      this.ub = LevelState.box;
      if (this.ub > 10) {
        this.ub -= 10;
      } else if (this.ub > 5) {
        this.ub -= 5;
      }
      this.state = 0;
      this.Vg();
      this.sj();
      this.Ke(650, 650);
      this.Yb = new Container(null, this.ra);
      this.Yb.setX(75);
      this.Yb.setY(75);
      this.offsetX = this.Yb.getX();
      this.advance = 500;
      var a = this.kv();
      var b = this.jv();
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
      this.il = c;
      this.Tz = [];
      for (var d = c = 0, e = this.il; d < e;) {
        ++d;
        var f = new Sprite(this.Yb);
        f.setColor(new Vec4(0.17647058823529413, 0.17647058823529413, 0.20784313725490197, 1), 300, 300);
        f.setX(100 + c);
        f.setY(150);
        this.Tz.push(f);
        c += this.advance;
      }
      this.Ka = new Sprite(this.Yb, Resources.Yb, Keys.$I);
      this.clipPath = new Bounds(0, 0, 177, 182);
      this.Fn = [];
      e = this.il;
      this.rm = e += LevelState.season < 3 ? 1 : 0;
      for (d = c = 0; d < e;) {
        f = d++;
        var g = this.Ir(f);
        let q = new Container(null, this.Yb);
        this.Fn.push(q);
        let p = f == this.il;
        q.setX(c);
        var h = null;
        if (p && LevelState.season < 3) {
          h = new Container(null, q);
          new Sprite(h, Resources.Yb, b[f]);
        } else {
          new Sprite(q, Resources.Yb, b[f]);
          var m = new Sprite(q, Resources.Yb, b[f]);
          m.setOrigin(m.X.x, 0);
          m.setScaleX(-1);
        }
        if (!p && LevelState.Ar(g)) {
          m = new Container(null, q);
          m.ox("lock");
          new Sprite(m, Resources.Yb, Keys.Ot);
          var n = new Sprite(m, Resources.Yb, Keys.Ot);
          n.setOrigin(n.X.x, 0);
          n.setScaleX(-1);
          m.center();
          n = Resources.Yb.hc.yf(Keys.Ot).ec;
          m.setX(m.getX() + n.x);
          m.setY(m.getY() + n.y / 2);
          if (LevelState.tv(g) > 0) {
            m = new Sprite(q, Resources.Wa, Keys.Tt);
            m.setX(260);
            m.setY(320);
            m.setUniformScale(0.7);
            n = new TextNode(q, Resources.ic);
            n.setBoxSize(80, m.getHeight());
            n.setAlign(1, 0);
            n.kx(-3);
            n.setText(Numeric.Ed(BOX_STAR_THRESHOLDS[g - 1]));
            n.setFontSize((m.getHeight() | 0) * 1.2);
            n.setX(m.getX() - 80);
            n.setY(m.getY());
          }
          if (LevelState.season == 3 && f == this.il - 1) {
            new Sprite(q, Resources.Yb, Keys.qJ);
            m = new TextNode(q, Resources.ic);
            m.setText(this.yb("MECH_HARDEST"));
            m.setBoxSize(184, 60);
            m.setFontSize(36);
            m.setAlign(0);
            m.setX(253);
            m.setY(425);
            m.la(-16);
          }
        }
        if (!p && LevelState.QA(g) == 75) {
          new Sprite(q, Resources.Yb, Keys.dJ);
        }
        if (p && LevelState.season < 3) {
          g = new TextNode(h, Resources.ic);
          g.setBoxSize(300, 100);
          g.setX(100);
          g.setY(206);
          g.setText(a[f]);
          g.setFontSize(60);
          g.Tf(true);
          g.Is(-40);
          g.setAlign(0, 0);
          h.centerOrigin();
          h.la(15);
        } else {
          h = new TextNode(q, Resources.ic);
          h.setBoxSize(400, 200);
          h.setX(56);
          h.setText(a[f]);
          h.setFontSize(70);
          h.Tf(true);
          h.setAlign(0);
          h.Is(-30);
          h.shape();
          h.setY(h.uv() == 1 ? 110 : 90);
        }
        c += this.advance;
      }
      this.Qc = [];
      for (a = 0; a < 2;) {
        ++a;
        b = new Sprite(null, Resources.Wa, Keys.mz);
        b.center();
        this.ra.appendChild(b);
        this.Qc.push(b);
      }
      this.$k();
      this.vb = this.add(ScoreLabel);
      a = LevelState.wv();
      this.vb.setText(a == null ? "null" : "" + a);
      this.ZL = new HitTestRect(this.ra.node, new Bounds(145, 145, 505, 505));
      this.pt();
      this.kq = true;
      this.tu = false;
      this.EA = true;
    }
    Qq() {
      this.$(SelectLevelScene);
    }
    pt() {
      if (this.ub > 1) {
        this.Qc[0].Fb(Keys.mz);
        this.Qc[0].Wd(1);
      } else {
        this.Qc[0].Fb(Keys.cL);
        this.Qc[0].Wd(2);
      }
      if (this.ub == this.rm) {
        this.Qc[1].Fb(Keys.aL);
        this.Qc[1].Wd(2);
      } else {
        this.Qc[1].Fb(Keys.bL);
        this.Qc[1].Wd(1);
      }
      this.Qc[0].setUniformScale(1);
      this.Qc[1].setUniformScale(1);
    }
    ux() {
      this.Cs = -1;
      this.hu();
      this.setState(1);
      this.Ie = -(this.ub - 1) * this.advance;
      this.x1 = this.Ie - this.advance * this.Cs;
      this.Ie += this.offsetX;
      this.x1 += this.offsetX;
      this.kq = this.ub != this.rm || LevelState.season == 3;
      this.ub--;
      this.pt();
      this.Qc[0].setUniformScale(0.9);
    }
    Qs() {
      this.Cs = 1;
      this.hu();
      this.setState(1);
      this.Ie = -(this.ub - 1) * this.advance;
      this.x1 = this.Ie - this.advance * this.Cs;
      this.Ie += this.offsetX;
      this.x1 += this.offsetX;
      this.kq = this.ub != this.il;
      this.ub++;
      this.pt();
      this.Qc[1].setUniformScale(0.9);
    }
    update(a) {
      super.update(a);
      if (this.De == "Running") {
        var b = this.O.hd().Nb(0);
        a = this.O.hd().qe(0);
        switch (this.state) {
          case 0:
            if (this.time > (this.EA ? 1 : 0) && !this.tu) {
              this.tu = true;
              this.EA = false;
              this.Uz();
            }
            if (this.Hq) {
              var c = this.O.hd().position[0];
              this.ng = c.x - this.yA.x;
              if (Math.abs(c.y - this.yA.y) < 50) {
                if (this.ng < -100 && this.ub < this.rm) {
                  this.Hq = false;
                  this.Qs();
                }
                if (this.ng > 100 && this.ub > 1) {
                  this.Hq = false;
                  this.ux();
                }
              }
            }
            c = this.ZL.Ub(this.pointer.pos);
            var d = this.Qc[0].Ub(this.pointer.pos);
            let e = this.Qc[1].Ub(this.pointer.pos);
            if (b) {
              this.buttons[0].blur();
              this.cp = this.ub > 1 && d;
              this.To = this.ub < this.rm && e;
              this.$L = this.ub <= this.rm && c;
              this.Hq = true;
              b = this.pointer.pos;
              this.yA = new Vec4(b.x, b.y, 0, 1);
              this.ng = 0;
            }
            if (a) {
              if (this.cp && d) {
                this.ux();
                SoundFx.play(SoundFx.button);
              }
              if (this.To && e) {
                this.Qs();
                SoundFx.play(SoundFx.button);
              }
              this.Hq = this.To = this.cp = false;
              if (this.$L && c && Math.abs(this.ng) < 10) {
                SoundFx.play(SoundFx.button);
                if (this.ub > this.il) {
                  if (this.Zo()) {
                    this.setState(4);
                  }
                } else {
                  a = this.Ir(this.ub - 1);
                  if (LevelState.Ar(a)) {
                    this.Ha.starCount = LevelState.tv(a);
                    this.Dg(MissingStarsPopup);
                  } else {
                    if (LevelState.box != a) {
                      this.Mp(LevelState.box);
                    }
                    LevelState.Ui(a);
                    this.Qq();
                    this.setState(4);
                  }
                }
              }
            }
            break;
          case 1:
            c = this.Ir(this.ub - 1);
            if (!(c <= 17) || !LevelState.Ar(c) || !LevelState.hA(c)) {
              c = this.Qc[0].Ub(this.pointer.pos);
              d = this.Qc[1].Ub(this.pointer.pos);
              if (b) {
                this.cp = this.ub > 1 && c;
                this.To = this.ub < this.rm && d;
              }
              if (a) {
                if (this.cp && c) {
                  this.Ka.setX(-(this.x1 - this.offsetX));
                  this.ux();
                  SoundFx.play(SoundFx.button);
                }
                if (this.To && d) {
                  this.Ka.setX(-(this.x1 - this.offsetX));
                  this.Qs();
                  SoundFx.play(SoundFx.button);
                }
                this.To = this.cp = false;
              }
            }
            a = this.jb(0.2);
            b = this.Ie;
            this.Yb.setX(b + (this.x1 - b) * Easing.quadOut()(a));
            b = -(this.Yb.getX() - this.offsetX);
            if (this.kq) {
              this.Ka.setX(b);
              b = b + this.Ie - this.offsetX;
              if (this.Cs > 0) {
                if (b > this.advance / 2) {
                  c = this.clipPath;
                  b = this.advance - b;
                  d = c.B - c.A;
                  c.A = b;
                  c.B = b + d;
                } else {
                  c = this.clipPath;
                  b = -b;
                  d = c.B - c.A;
                  c.A = b;
                  c.B = b + d;
                }
              } else {
                b = -b;
                if (b > this.advance / 2) {
                  c = this.clipPath;
                  b = -this.advance + b;
                  d = c.B - c.A;
                  c.A = b;
                  c.B = b + d;
                } else {
                  c = this.clipPath;
                  d = c.B - c.A;
                  c.A = b;
                  c.B = b + d;
                }
              }
              this.Ka.jE(this.clipPath);
            } else {
              this.Ka.jE(null);
            }
            if (a == 1) {
              this.tu = false;
              this.setState(2);
              this.pt();
            }
            break;
          case 2:
            a = this.Ir(this.ub - 1);
            if (LevelState.Ar(a) && LevelState.hA(a)) {
              this.Uz();
              this.setState(3);
              this.Fn[this.ub - 1].fo("lock").Jm();
              SoundFx.play(SoundFx.star_1);
              b = new PuffEffect();
              c = this.ih;
              b.j.setX((c.A + c.B) / 2);
              d = c = this.ih;
              b.j.setY((c.D + c.G) / 2 + (d.G - d.D) * 0.15);
              this.oa(b);
              this.node.P(b.j.u);
              LevelState.iT(a);
            } else {
              this.setState(0);
            }
            break;
          case 3:
            a = this.Fn[this.ub - 1].fo("lock");
            b = this.jb(1.5);
            a.setUniformScale(1 + b * 0.5);
            a.W(1 - b);
            a.pp(new ColorTransform().Vw(-b * 0.5));
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
    Uz() {
      this.vu = this.oa(new BounceAnim(this.Fn[this.ub - 1]));
      this.GC = this.oa(new BounceAnim(this.Ka));
    }
    hu() {
      if (this.vu != null) {
        this.vu.dispose();
        this.GC.dispose();
        this.GC = this.vu = null;
      }
    }
    Ir(a) {
      a += 1;
      if (LevelState.season == 2) {
        a += 5;
      }
      if (LevelState.season == 3) {
        a += 10;
      }
      return a;
    }
    Zo() {
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
      this.sm();
      this.ia(Loader.menuBg2);
      Resources.we = null;
      Resources.Sz = null;
      if (this.caller != null && this.caller.Ha.boxComplete && LevelState.box != 17) {
        this.Qs();
      }
    }
    layout() {
      super.layout();
      this.hu();
      this.advance = 500;
      let a = this.fa.Se();
      if (!(a < 0.6)) {
        this.advance *= Math.min(1.5, remap(a, 0.6, 2, 1, 1.2));
      }
      var b = 0;
      for (var c = 0, d = this.Tz; c < d.length;) {
        let e = d[c];
        ++c;
        e.setX(100 + b);
        e.W(0.5);
        b += this.advance;
      }
      c = b = 0;
      for (d = this.Fn; c < d.length;) {
        d[c++].setX(b);
        b += this.advance;
      }
      this.Yb.setX(-(this.ub - 1) * this.advance + this.offsetX);
      if (this.kq) {
        this.Ka.setX(-(this.Yb.getX() - this.offsetX));
        this.setState(0);
      }
      b = this.Qc[0];
      c = this.Qc[1];
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
      this.$n(ScoreLabel, this).layout();
    }
    Pd() {
      if (this.hb(0)) {
        this.Vb();
      }
    }
    Vb() {
      this.$(SelectSeasonScene);
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
    Nd() {
      super.Nd();
      Resources.Yb = this.createTexture(Loader.menuSeason1);
    }
    Zo() {
      this.$(Season2Scene);
      return true;
    }
    kv() {
      let a = this.cr("BOX1_LABEL", "BOX2_LABEL", "BOX3_LABEL", "BOX4_LABEL", "BOX5_LABEL", "NEXT_SEASON");
      let b = 0;
      while (b < 5) {
        let c = b++;
        a[c] = c + 1 + ". " + a[c];
      }
      return a;
    }
    jv() {
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
    Zo() {
      this.$(CTRCSeason2Scene);
      return true;
    }
    Vb() {
      this.$(CTRCSelectSeasonScene);
    }
    Qq() {
      this.$(CTRCSelectLevelScene);
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
        LevelState.zk(2);
        this.Mp(LevelState.box);
        LevelState.Ui(6);
      }
      super.init();
    }
    start() {
      super.start();
      this.ia(40);
    }
    Nd() {
      super.Nd();
      Resources.Yb = this.createTexture(Loader.menuSeason2);
    }
    Zo() {
      this.$(Season3Scene);
      return true;
    }
    kv() {
      let a = this.cr("BOX6_LABEL", "BOX7_LABEL", "BOX8_LABEL", "BOX9_LABEL", "BOX10_LABEL", "NEXT_SEASON");
      let b = 0;
      while (b < 5) {
        let c = b++;
        a[c] = c + 1 + 5 + ". " + a[c];
      }
      return a;
    }
    jv() {
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
    Zo() {
      this.$(CTRCSeason3Scene);
      return true;
    }
    Vb() {
      this.$(CTRCSelectSeasonScene);
    }
    Qq() {
      this.$(CTRCSelectLevelScene);
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
        LevelState.zk(3);
        this.Mp(LevelState.box);
        LevelState.Ui(11);
      }
      super.init();
    }
    start() {
      super.start();
      this.ia(38);
    }
    Nd() {
      super.Nd();
      Resources.Yb = this.createTexture(Loader.menuSeason3);
    }
    kv() {
      let a = this.cr("BOX11_LABEL", "BOX12_LABEL", "BOX13_LABEL", "BOX14_LABEL", "BOX15_LABEL", "BOX16_LABEL", "BOX17_LABEL");
      let b = 0;
      while (b < 7) {
        let c = b++;
        a[c] = c + 1 + 10 + ". " + a[c];
      }
      return a.slice(0, 7);
    }
    jv() {
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
    Vb() {
      this.$(CTRCSelectSeasonScene);
    }
    Qq() {
      this.$(CTRCSelectLevelScene);
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
