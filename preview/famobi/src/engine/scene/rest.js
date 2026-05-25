  class LevelController extends Node {
    constructor(a) {
      super();
      this.Fi = a;
      this.vA = this.oa(new Node());
      this.Zi = new SceneRoot();
      this.YB = [];
      for (a = 0; a < 14;) {
        let b = new SceneRoot();
        this.YB[a++] = b;
        this.Zi.P(b);
      }
      this.Bb = new LevelCamera();
      this.ga = WorldScale.scale;
      this.Ap = 0;
      this.AS = Vec2.sc();
      this.Fj = [];
      for (a = 0; a < 5;) {
        this.Fj[a++] = [];
      }
      this.uA = new SceneGroup();
      this.uA.Rf(new MultiLineEffect(this.Fj));
      this.ma(13).P(this.uA);
      this.Tl = this.dl = this.Co = this.Bo = 0;
      this.Bu = [];
      this.Ml();
    }
    GL() {
      this.Rl = true;
      this.Ff = new ThreeStarsCollect();
      this.ma(8).P(this.Ff.j.u);
    }
    HL() {
      this.tl = new ScreenFade(this);
      this.Md = new AnimatedNineSlice(this, this.Ag, this.zg, 4, false);
      this.fg = new MagnetEffect(this, new Vec2(this.Ka.x, this.Ka.y - 30), new Vec2(0, 0));
      this.Cn = new MagnetGlowFlash(this, this.I);
      this.xn = 0;
      this.Ve = true;
      this.Ka.IQ();
      this.Ic.hT();
      for (var a = 0, b = this.Dd; a < b.length;) {
        var c = b[a];
        ++a;
        if (c != null && (!c.ce || !!c.wl)) {
          c.DQ();
        }
      }
      a = 0;
      for (b = this.Lc; a < b.length;) {
        c = b[a];
        ++a;
        if (c.ve) {
          if (c.Hh) {
            this.zp(c);
            c.Hh = false;
          } else {
            c.ve = false;
            c.mc.dispose();
            c.mc = null;
          }
        }
      }
      if (this.$c) {
        this.Ka.Lm(true);
        a = 0;
        b = this.ab;
        while (a < b.length) {
          b[a++].Lm(true);
        }
      }
    }
    FM() {
      this.tl.free();
      this.Cn.free();
      this.Md.free();
      this.fg.free();
      let a = 0;
      let b = this.Dd;
      while (a < b.length) {
        b[a++].JS();
      }
    }
    Dv(a, b, c) {
      if (!a.Ck) {
        a.Ck = true;
        var d = a.rotation * DEG2RAD;
        var e = Vec2.Ia(b.ha, b.g);
        var f = b.ha;
        f = new Vec2(f.x, f.y);
        f.$a(-d, a.x, a.y);
        f = f.y < a.y;
        e = Math.max(e.Rb() * 40, 300) * (f ? -1 : 1);
        e = Vec2.Ob(Vec2.au(Vec2.KA(d)), e);
        var g = b.g;
        g = new Vec2(g.x, g.y);
        g.$a(-d, a.x, a.y);
        b.g = g;
        g = b.ha;
        g = new Vec2(g.x, g.y);
        g.$a(-d, a.x, a.y);
        b.ha = g;
        b.ha.y = b.g.y;
        g = b.g;
        g = new Vec2(g.x, g.y);
        g.$a(d, a.x, a.y);
        b.g = g;
        g = b.ha;
        g = new Vec2(g.x, g.y);
        g.$a(d, a.x, a.y);
        b.ha = g;
        b.Vh(e, c);
        c = d * -180 / Math.PI + 90;
        if (!f) {
          c += 180;
        }
        b = b.g;
        d = new Vec2(Star.bg, 0);
        d.rotate(-c);
        b = Vec2.tb(b, d);
        if (a.xB < 2) {
          SoundFx.play(SoundFx.sp_field_bounce);
          this.Cn.IA(b, c);
        }
      }
    }
    Cv(a) {
      let b = Star.bg;
      let c = 0;
      let d = this.Ag;
      let e = this.zg;
      let f = a.g.x < b || a.g.x > d - b;
      let g = a.g.y < b || a.g.y > e - b;
      if (f && Math.abs(Math.min(a.g.x, d - a.g.x)) > 0 || g && Math.abs(Math.min(a.g.y, e - a.g.y)) > 0) {
        let h = Vec2.Ia(a.g, a.ha);
        a.ha = a.g;
        let m = null;
        if (f) {
          if (a.g.x < b) {
            h.x = Math.abs(h.x);
            c = 0;
            m = new Vec2(b, a.g.y);
          } else {
            h.x = -Math.abs(h.x);
            c = 180;
            m = new Vec2(d - b, a.g.y);
          }
          if (Math.abs(h.x) < 3) {
            h.x = (a.g.x < b ? 1 : -1) * 3;
          }
        }
        if (g) {
          if (a.g.y < b) {
            h.y = Math.abs(h.y);
            c = -90;
            m = new Vec2(a.g.x, b);
          } else {
            h.y = -Math.abs(h.y);
            c = 90;
            m = new Vec2(a.g.x, e - b);
          }
          if (Math.abs(h.y) < 3) {
            h.y = (a.g.y < b ? 1 : -1) * 3;
          }
          if (h.Rb() < 5) {
            h.normalize();
            h = Vec2.Ob(h, 5);
          }
        }
        a.g = Vec2.tb(a.g, h);
        if (a.g.x < b) {
          a.g.x = b;
        } else if (a.g.x > d - b) {
          a.g.x = d - b;
        }
        if (a.g.y < b) {
          a.g.y = b;
        } else if (a.g.y > e - b) {
          a.g.y = e - b;
        }
        this.Cn.IA(m, c);
      }
    }
    Ml() {
      for (var a = 0; a < 5;) {
        this.Fj[a++] = [];
      }
      this.ci = Array(5);
      this.bj = Array(5);
      this.nk = Array(5);
      for (a = 0; a < 5;) {
        let b = a++;
        this.ci[b] = false;
        this.bj[b] = Vec2.sc();
        this.nk[b] = Vec2.sc();
      }
    }
    ma(a) {
      return this.YB[a];
    }
    zu() {
      let a = this.vA.Me;
      while (a != null) {
        let b = a.Y;
        a.dispose();
        a = b;
      }
    }
    delay(a, b) {
      a = new DelayedCallback(a, b);
      this.vA.oa(a);
    }
    dispose() {
      SoundFx.stop(SoundFx.monster_chewing);
      SoundFx.stop(SoundFx.sp_telekinesis);
      this.Zi.free();
      super.dispose();
    }
    show() {
      this.Tl = this.dl = 0;
      this.zu();
      this.Rd = null;
      this.jr = -1;
      this.Aa = 2;
      this.Li = 0;
      SoundFx.stop(SoundFx.electric);
      SoundFx.stop(SoundFx.magnet_idle);
      this.Lc = [];
      this.Dd = [];
      this.ab = [];
      this.bubbles = [];
      this.Ri = [];
      this.Gh = [];
      this.Kp = [];
      this.Lp = [];
      this.wj = [];
      this.Vd = [];
      this.Af = [];
      this.ej = [];
      this.Ul = [];
      this.nc = new ConveyorBeltMgr(this);
      this.se = new CharacterController(this);
      this.rc = [];
      this.um = null;
      this.sh = false;
      this.da = new VerletPoint();
      this.da.Ng(1);
      this.xa = new VerletPoint();
      this.xa.Ng(1);
      this.Ja = new VerletPoint();
      this.Ja.Ng(1);
      this.yj = new BubbleAnim(this);
      var a = BoxLevelData.get();
      this.qu = new LevelBackground(this);
      this.I = new CandyCutAnim(this);
      this.I.constraint = this.da;
      this.pP(a);
      a = this.Vd.length;
      let b;
      let c = 0;
      while (c < a) {
        b = this.Vd[c++];
        b.Vr = -1;
        b.ah = this.Vd;
      }
      this.Ap = 0;
      this.pc = this.xc = this.gd = null;
      this.iw = false;
      this.tc = this.Aa != 2;
      this.vE = this.Nr = this.ld = this.kd = false;
      this.time = this.GR = this.op = 0;
      this.si = true;
      PhysicsConfig.reset();
      this.di = this.dl > 0 ? 0 : 0.3;
      this.nc.fl(this.ab);
      this.nc.fl(this.Gh);
      this.nc.fl(this.bubbles);
      this.nc.fl(this.ej);
      this.nc.fl(this.Ri);
      this.nc.fl(this.wj);
      this.nc.qD();
      this.hg = false;
      this.HS();
    }
    pP(a) {
      function b(g, h) {
        let m = 0;
        let n = g.length;
        while (m < n) {
          let q = g[m++];
          let p = 0;
          let v = q.length;
          while (p < v) {
            h(q[p++]);
          }
        }
      }
      let c = [];
      let d = 0;
      let e = ObjectAccess.jN(a);
      while (d < e.length) {
        c.push(ObjectAccess.vf(a, e[d++]));
      }
      let f = this;
      b(c, function (g) {
        switch (g.name) {
          case 0:
            f.qP(g);
            break;
          case 1:
            f.hP(g);
            break;
          case 50:
            f.fP(g);
            break;
          case 51:
            f.gP(g);
            break;
          case 52:
            f.eP(g);
            break;
          case 134:
            f.oP(g);
        }
      });
      b(c, function (g) {
        switch (g.name) {
          case 2:
            f.Ka = new OmNom(f, g);
            f.iA = false;
            f.kr = LevelController.Hj ? 2 : -1;
            f.sq = 1;
            LevelController.Hj = false;
            break;
          case 3:
            f.vP(g);
            break;
          case 4:
            f.zP(g);
            break;
          case 5:
          case 6:
          case 7:
          case 8:
          case 9:
          case 10:
          case 11:
          case 12:
          case 13:
          case 14:
            f.yP(g);
            break;
          case 53:
            f.lP(g);
            break;
          case 54:
            f.dP(g);
            break;
          case 55:
            f.rP(g);
            break;
          case 56:
            f.tP(g);
            break;
          case 57:
          case 58:
          case 59:
          case 60:
          case 80:
            f.uP(g);
            break;
          case 81:
          case 82:
            f.cP(g);
            break;
          case 100:
            f.kP(g);
            break;
          case 120:
            f.sP(g);
            break;
          case 130:
            f.jP(g);
            break;
          case 131:
            f.wP(g);
            break;
          case 132:
            f.nP(g);
            break;
          case 133:
            f.iP(g);
            break;
          case 135:
            f.xP(g);
            break;
          case 300:
            f.mP(g);
        }
      });
    }
    qP(a) {
      this.Ag = a.width * this.ga | 0;
      this.zg = a.height * this.ga | 0;
      var b = a.view;
      if (b != null) {
        var c = b.x;
        let d = b.y;
        b = new Bounds(c, d, c + b.width, d + b.height);
        b.scale(this.ga, false);
        c = this.Bb.Ok;
        c.A = b.A;
        c.D = b.D;
        c.B = b.B;
        c.G = b.G;
        c = this.Bb.g;
        c.x = (b.A + b.B) / 2;
        c.y = (b.D + b.G) / 2;
      } else {
        // preview bridge: when a custom level declares dimensions larger
        // than the canonical 320x480, the engine would fit the whole
        // level into the viewport and shrink everything. clamp the camera
        // bounds (and recenter) so the camera renders at the normal
        // scale; oversized object positions just clip off-screen rather
        // than triggering a global zoom-out.
        let _maxW = window.customleveldata != null ? Math.min(this.Ag, 320 * this.ga) : this.Ag;
        let _maxH = window.customleveldata != null ? Math.min(this.zg, 480 * this.ga) : this.zg;
        b = this.Bb.Ok;
        b.A = 0;
        b.D = 0;
        b.B = _maxW;
        b.G = _maxH;
        b = this.Bb.g;
        b.x = _maxW / 2;
        b.y = _maxH / 2;
      }
      this.ie = new Vec4(0, 0, 0, 1);
      if (a.scrollX != null) {
        this.ie.x = a.scrollX;
      }
      if (a.scrollY != null) {
        this.ie.y = a.scrollY;
      }
      if (LevelState.box == 8) {
        this.qu.xS();
      }
    }
    hP(a) {
      this.Cd = a.special;
      this.Em = a.ropePhysicsSpeed;
      this.$c = a.nightLevel;
      this.Aa = a.twoParts ? 0 : 2;
      this.Em *= LevelController.Ty;
      if (this.Aa != 2) {
        this.zj = new BubbleAnim(this);
        this.Aj = new BubbleAnim(this);
      }
    }
    kP(a) {
      var b = a.x * this.ga;
      let c = a.y * this.ga;
      let d = a.length * this.ga;
      var e = a.radius;
      var f = a.wheel;
      var g = a.moveLength != null ? a.moveLength * this.ga : -1;
      let h = a.moveVertical;
      let m = a.moveOffset != null ? a.moveOffset * this.ga : 0;
      var n = a.spider;
      var q = a.part == "L";
      let p = a.hidePath;
      var v = a.bindBulb;
      let u = new Candy(this);
      u.x = b;
      u.y = c;
      u.Zf = f;
      u.lS(n);
      u.Ji(a);
      if (e != -1) {
        e *= this.ga;
      }
      if (e == -1) {
        f = this.da;
        if (v) {
          q = 0;
          v = this.rc;
          while (q < v.length) {
            n = v[q];
            ++q;
            if (n != null) {
              f = n.constraint;
            }
          }
        } else if (this.Aa != 2) {
          f = q ? this.xa : this.Ja;
        }
        b = new Rope(this.ma(6), null, b, c, f, f.g.x, f.g.y, d);
        b.Jc.vh.Pb(b.Jc.g);
        u.eE(b);
        this.yn();
      }
      u.setRadius(e);
      u.WR(g, h, m);
      if (u.pb != null && (u.KR(), !p)) {
        a = a.path[0] == "R";
        if (this.um == null) {
          this.um = new SwarmManager(this);
        }
        e = 0;
        for (g = u.pb.path.length - 1; e < g;) {
          if (!a || e % 3 == 0) {
            this.um.DA(e, e + 1, u);
          }
          ++e;
        }
        if (u.pb.path.length > 2) {
          this.um.DA(0, u.pb.path.length - 1, u);
        }
      }
      this.Lc.push(u);
    }
    fP(a) {
      this.xa.g.x = a.x * this.ga;
      this.xa.g.y = a.y * this.ga;
      this.Ma = new CandyPiece(this, Keys.fH);
      this.Ma.x = this.xa.g.x;
      this.Ma.y = this.xa.g.y;
      this.Ma.constraint = this.xa;
    }
    gP(a) {
      this.Ja.g.x = a.x * this.ga;
      this.Ja.g.y = a.y * this.ga;
      this.Na = new CandyPiece(this, Keys.gH);
      this.Na.x = this.Ja.g.x;
      this.Na.y = this.Ja.g.y;
      this.Na.constraint = this.Ja;
    }
    eP(a) {
      this.da.g.x = a.x * this.ga;
      this.da.g.y = a.y * this.ga;
    }
    oP(a) {
      let b = new VerletPoint();
      b.Ng(1);
      b.g.x = a.x * this.ga;
      b.g.y = a.y * this.ga;
      a = new LighterEntity(this, a.litRadius * this.ga);
      a.x = b.g.x;
      a.y = b.g.y;
      a.constraint = b;
      this.rc.push(a);
    }
    lP(a) {
      this.Rd = new ToggleButton(this, a.x * this.ga, a.y * this.ga);
      this.Rd.sw = cachedBind(this, this.Rr);
    }
    vP(a) {
      let b = new Star(this);
      b.x = a.x * this.ga;
      b.y = a.y * this.ga;
      b.timeout = a.timeout;
      if (a.timeout != -1) {
        b.setTimeout();
      }
      b.Ji(a);
      b.update(0);
      this.ab.push(b);
    }
    mP(a) {
      this.Ic = new BonusStar(this);
      this.Ic.x = a.x * this.ga;
      this.Ic.y = a.y * this.ga;
      this.Ic.update(0);
    }
    zP(a) {
      if (!this.mE(a) && a.text != null && a.text != "") {
        var b = Math.ceil(a.width * this.ga);
        b = new TutorialHintText(Strings.get(a.text), b);
        b.x = a.x * this.ga;
        b.y = a.y * this.ga;
        this.ma(2).P(b.T.u);
        a = a.special;
        b.Cd = a ?? 0;
        if (b.Cd == 0) {
          b.show();
        }
        this.Lp.push(b);
      }
    }
    yP(a) {
      if (!this.mE(a)) {
        var b = new TutText(a.name - 5);
        b.T.center();
        b.x = a.x * this.ga;
        b.y = a.y * this.ga;
        var c = a.angle;
        b.rotation = c ?? 0;
        c = a.special;
        b.Cd = c ?? 0;
        b.Ji(a);
        a = 2;
        if (b.Cd == 2 || this.Cd == 5) {
          a = 13;
        }
        this.ma(a).P(b.T.u);
        if (b.Cd == 0 || b.Cd == 2) {
          b.show();
        }
        this.Kp.push(b);
      }
    }
    dP(a) {
      let b = new Character(this);
      b.x = a.x * this.ga;
      b.y = a.y * this.ga;
      this.bubbles.push(b);
    }
    rP(a) {
      let b = new Pump(this);
      b.angle = a.angle;
      b.x = a.x * this.ga;
      b.y = a.y * this.ga;
      b.rotation = a.angle + 90;
      b.Hd();
      this.Ri.push(b);
    }
    tP(a) {
      let b = new Sock(this, a.group);
      b.x = a.x * this.ga;
      b.y = a.y * this.ga;
      b.Ji(a);
      b.rotation += 90;
      if (b.pb != null) {
        b.pb.angle += 90;
      }
      b.Hd();
      this.Gh.push(b);
    }
    uP(a) {
      var b = a.x * this.ga;
      let c = a.y * this.ga;
      let d = a.size;
      let e = parseFloat(a.angle);
      if (a.toggled == 0) {
        var f = -1;
      } else {
        f = a.toggled;
        f = f ?? -1;
      }
      b = new SawBlade(this, b, c, d, e ?? 0, f);
      b.Ji(a);
      if (f != -1) {
        b.OC = cachedBind(this, this.AR);
      }
      if (a.name == 80) {
        b.ce = true;
        b.IB = a.initialDelay;
        b.TC = a.onTime;
        b.FC = a.offTime;
        b.tf = 0;
        b.bF();
        b.tf += b.IB;
        b.Hd();
      } else {
        b.ce = false;
      }
      this.Dd.push(b);
    }
    sP(a) {
      let b = a.x * this.ga;
      let c = a.y * this.ga;
      let d = a.size * this.ga;
      var e = Numeric.parseInt(a.handleAngle);
      e = e ?? 0;
      let f = e * DEG2RAD;
      let g = a.oneHandle;
      let h = new Vinyl(this);
      h.TB = a.size;
      h.x = b;
      h.y = c;
      h.rotation = e;
      h.mr = new Vec2(h.x - h.TB * this.ga, h.y);
      h.mr.$a(f, h.x, h.y);
      h.nr = new Vec2(h.x + h.TB * this.ga, h.y);
      h.nr.$a(f, h.x, h.y);
      h.Lb(d);
      h.QR(g);
      this.Vd.push(h);
    }
    cP(a) {
      let b = new Bouncer(this, a.x * this.ga, a.y * this.ga, a.size, a.angle);
      b.Ji(a);
      this.wj.push(b);
    }
    jP(a) {
      let b = a.x * this.ga;
      let c = a.y * this.ga;
      let d = a.radius;
      let e = a.angle;
      let f = a.grab;
      let g = a.bubble;
      a = a.bouncer;
      let h = new GameItemSwitcher(this);
      h.CO(new Vec2(b, c), (a ? 8 : 0) | (g ? 2 : 0) | (f ? 4 : 0), d, e, this.bubbles, this.Lc, this.wj);
      this.Af.push(h);
      this.yj.Cb = new BeeAnims();
      if (this.Aa != 2) {
        this.zj.Cb = new BeeAnims();
        this.Aj.Cb = new BeeAnims();
      }
    }
    wP(a) {
      let b = a.x * this.ga;
      let c = a.y * this.ga;
      a = a.angle;
      let d = new SteamGenerator(this);
      d.AO(b, c, a);
      this.ej.push(d);
    }
    nP(a) {
      let b = a.x * this.ga;
      let c = a.y * this.ga;
      let d = a.candyCaptured;
      let e = new LanternEye(this);
      e.zO(b, c);
      this.Ul.push(e);
      e.Ji(a);
      if (d) {
        this.sh = true;
        this.I.j.W(0);
        e.jA(this.da);
      }
    }
    iP(a) {
      let b = a.x * this.ga;
      let c = a.y * this.ga;
      let d = a.angle;
      let e = a.radius;
      let f = a.activeTime;
      a = a.index;
      let g = new Gap(this, this.se);
      g.index = a;
      g.BO(new Vec2(b, c), d, e, f);
      this.se.oa(g, a);
    }
    xP(a) {
      var b = a.x * this.ga;
      let c = a.y * this.ga;
      let d = a.angle;
      let e = a.width * this.ga;
      let f = a.length * this.ga;
      let g = a.velocity * this.ga;
      let h = a.direction == "forward" ? 1 : -1;
      a = a.type == "manual";
      b = ConveyorBelt.create(this, this.nc.count(), b, c, f, e, -d, a, g * h);
      this.nc.push(b);
    }
    yn() {
      this.dl += 1;
    }
    Nv(a, b, c, d) {
      if (Rect.lk(b.x, b.y, a.x - 34, a.y - 34, 68, 68)) {
        if (c != null) {
          this.vm(a.x, a.y);
          this.Un();
          b = 0;
          for (var e = this.Af; b < e.length;) {
            var f = e[b];
            ++b;
            if (f != null && f.ca == c) {
              f.mg = true;
              f.Si(1);
            }
          }
        }
        d.show();
        c = false;
        b = 0;
        for (e = this.Af; b < e.length;) {
          f = e[b];
          ++b;
          if (f != null && f.ca == a) {
            f.mg = false;
            c = true;
          }
        }
        if (c) {
          d.yS();
        }
        SoundFx.play(SoundFx.bubble);
        a.pop();
        this.yn();
        return true;
      }
      return false;
    }
    Rm(a, b) {
      if (!this.vE) {
        b.x = a.g.x;
        b.y = a.g.y;
        b.pe();
      }
    }
    bN(a, b, c, d) {
      this.Rm(this.da, a);
      if (Entity.yo(a, c)) {
        c.PQ();
        SoundFx.play(SoundFx.monster_chewing, true);
        if (b != null) {
          this.mk(b, false);
        }
        this.tk(d != null);
        a.oe = false;
        a.j.tween().tF(c.x, c.y + 10);
        a.j.tween().alpha(0, 0.1);
        a.j.tween().scale(0, 0.1, null, null, function () {
          a.free();
        });
        return true;
      } else {
        return false;
      }
    }
    KE(a) {
      if (a != null && a.Gc != null) {
        var b = a.constraint;
        a.Gc.qc.L(true);
        a.Gc.qc.pa().play(v167);
        var c = new Vec2(0, Sock.xJ);
        c.rotate(a.Gc.rotation * DEG2RAD);
        b.g.x = a.Gc.x;
        b.g.y = a.Gc.y;
        b.g.add(c);
        b.ha.Pb(b.g);
        b.sb.x = 0;
        b.sb.y = -1;
        b.sb.rotate(a.Gc.rotation * DEG2RAD);
        b.sb.multiply(a.Rw);
        b.xd.Pb(b.sb);
        b.xd.xA(60);
        b.ha.Pb(b.g);
        b.ha.Ax(b.xd);
        a.Gc = null;
      }
    }
    tk(a) {
      let b = 0;
      let c = this.Lc.length;
      while (b < c) {
        let d = this.Lc[b++];
        let e = d.kb;
        if (e != null && (e.Mb == this.da || e.Mb == this.xa && a || e.Mb == this.Ja && !a)) {
          if (e.yc == -1) {
            e.Fs(e.za.length - 2);
            this.Un();
          } else {
            e.Fv = true;
          }
          if (d.ve && d.Hh) {
            this.zp(d);
          }
        }
      }
    }
    jR(a) {
      if (a != null) {
        for (var b = 0, c = this.Lc; b < c.length;) {
          let d = c[b];
          ++b;
          if (d == null) {
            continue;
          }
          let e = d.kb;
          if (e != null && e.Mb == a.constraint) {
            if (e.yc == -1) {
              e.Fs(e.za.length - 2);
            } else {
              e.Fv = true;
            }
            if (d.ve && d.Hh) {
              this.zp(d);
            }
          }
        }
      }
    }
    Un() {
      --this.dl;
      this.Tl = 0;
    }
    fM() {
      this.Gx = Math.max(0, 30 - this.op) * 100;
      this.Gx = this.Gx / 10 * 10;
      this.GS = this.Ap * 1000;
      this.GR = Math.ceil(this.Gx + this.GS);
    }
    Dl() {
      if (this.gd != null) {
        this.mk(this.gd, false);
      }
      this.fM();
      this.tk(false);
      this.zu();
      let a = SoundFx.electric;
      this.delay(function () {
        SoundFx.stop(a);
      }, 1.5);
      this.Fi.tw();
      this.delay((v10 = this.Fi, cachedBind(v10, v10.fQ)), 1.8);
      this.se.ZO();
      if (this.Rl) {
        this.Ff.free();
        this.Ff = null;
      }
      if (this.Ve) {
        this.FM();
        this.Ve = false;
      }
    }
    fv() {
      if (!this.Cm) {
        this.Ka.EQ();
        SoundFx.play(SoundFx.monster_sad);
        if (this.Rl) {
          this.Ff.free();
          this.Ff = null;
        }
        this.zu();
        this.Fi.eQ();
        this.delay((v10 = this.Fi, cachedBind(v10, v10.JC)), 1);
      }
    }
    rr(a, b, c, d) {
      if (c.iR(a.x - 249.60000000000002, a.y - 249.60000000000002, a.x + 249.60000000000002, a.y + 249.60000000000002)) {
        var e = new Vec2(0, 0);
        let h = new Vec2(0, 0);
        c = new Vec2(c.x, c.y);
        var f = a.ea;
        f = f.B - f.A;
        var g = a.ea;
        g = g.G - g.D;
        e.x = a.x - f / 2;
        h.x = a.x + f / 2;
        e.y = h.y = a.y;
        if (a.angle != 0) {
          c.$a(-a.angle, a.x, a.y);
        }
        if (c.y < e.y && Rect.Ew(c.x - f / 2, c.y - g / 2, c.x + f / 2, c.y + g / 2, e.x, e.y - 249.60000000000002, h.x, h.y)) {
          e = new Vec2(0, -((249.60000000000002 - (e.y - c.y)) * 499.20000000000005 / 249.60000000000002));
          e.rotate(a.angle);
          b.Vh(e, d);
        }
      }
    }
    pr(a, b, c) {
      if (!a.Ck && a.j != null) {
        var d = Vec2.Ia(b.ha, b.g);
        var e = b.ha.Zb();
        e.$a(-a.angle, a.x, a.y);
        d = Math.max(d.Rb() * 40, 336) * (e.y < a.y ? -1 : 1);
        e = Vec2.au(Vec2.KA(a.angle));
        e.multiply(d);
        b.g.$a(-a.angle, a.x, a.y);
        b.ha.$a(-a.angle, a.x, a.y);
        b.ha.y = b.g.y;
        b.g.$a(a.angle, a.x, a.y);
        b.ha.$a(a.angle, a.x, a.y);
        b.Vh(e, c);
        a.BQ();
        SoundFx.play(SoundFx.bouncer);
      }
    }
    uQ(a, b) {
      a.U.pa().play(Pump.zF);
      SoundFx.play([1035, 1034, 1033, 1032][X.xh(0, 3)]);
      a.dN(this);
      if (!this.tc) {
        this.rr(a, this.da, this.I, b);
      }
      if (this.Aa != 2) {
        if (!this.kd) {
          this.rr(a, this.xa, this.Ma, b);
        }
        if (!this.ld) {
          this.rr(a, this.Ja, this.Na, b);
        }
      }
      let c = 0;
      let d = this.rc;
      while (c < d.length) {
        let e = d[c];
        ++c;
        this.rr(a, e.constraint, e, b);
      }
    }
    vQ(a, b) {
      function c(u, A, D) {
        var B = 0;
        if (a.rotation == 0 && (q.Rd == null || q.Rd != null && q.si) || a.rotation == 180 && q.Rd != null && !q.si) {
          B = a.x - A.x;
          B = Math.abs(B) > 2.5 ? -D.x / f + B * 0.25 : Math.abs(D.x) < 1 ? -D.x : -D.x / f;
        }
        let K = -34 / u.weight;
        if (a.rotation != 0 && (q.Rd == null || q.Rd != null && q.si) || a.rotation != 180 && q.Rd != null && !q.si) {
          f *= 15;
          K = a.rotation == 90 || a.rotation == 270 ? K / 4 : K / 2;
        }
        D = new Vec2(B, -D.y / f + K);
        A = a.y - A.y;
        if (A > h + 17.5) {
          D.multiply(Math.exp((A - (h + 17.5)) * -2));
        }
        D.rotate(g);
        u.Vh(D, b);
      }
      function d() {
        let u = 0;
        let A = q.wj;
        while (u < A.length) {
          let D = A[u];
          ++u;
          if (D != null) {
            D.Ck = false;
          }
        }
      }
      function e(u, A, D) {
        A.$a(-g, a.x, a.y);
        D.rotate(-g);
        return Rect.Ew(A.x - 17.5, A.y - 8.75, A.x + 17.5, A.y + 17.5, m.x, m.y, n.x, n.y);
      }
      let f = 5;
      let g = a.rotation * DEG2RAD;
      let h = a.BN();
      let m = new Vec2(a.x - 5, a.y - h - 1);
      let n = new Vec2(a.x + 5, a.y - 17.5);
      let q = this;
      if (this.Aa == 2) {
        var p = this.da.g.Zb();
        var v = this.da.sb.Zb();
        if (e(this.da, p, v)) {
          d();
          c(this.da, p, v);
        }
      } else {
        p = this.xa.g.Zb();
        v = this.xa.sb.Zb();
        if (e(this.xa, p, v)) {
          d();
          c(this.xa, p, v);
        }
        p = this.Ja.g.Zb();
        v = this.Ja.sb.Zb();
        if (e(this.Ja, p, v)) {
          d();
          c(this.Ja, p, v);
        }
      }
      p = 0;
      for (v = this.rc; p < v.length;) {
        let u = v[p];
        ++p;
        let A = u.constraint.g.Zb();
        let D = u.constraint.sb.Zb();
        if (e(u.constraint, A, D)) {
          d();
          c(u.constraint, A, D);
        }
      }
    }
    yc(a, b, c) {
      let d = 0;
      let e = this.Lc.length;
      while (d < e) {
        let f = this.Lc[d++];
        let g = f.kb;
        if (g == null || g.yc != -1) {
          continue;
        }
        let h = g.za.length - 1;
        let m = 0;
        while (m < h) {
          let n = m++;
          let q = g.za[n];
          let p = g.za[n + 1];
          if (f.Zf && Rect.$j(a.x, a.y, b.x, b.y, f.x - 44, f.y - 44, 88, 88) ? 0 : MathUtil.aP(a.x, a.y, b.x, b.y, q.g.x, q.g.y, p.g.x, p.g.y)) {
            if (f.ve && f.Hh) {
              this.zp(f);
            }
            SoundFx.play([1030, 1029, 1028, 1027][g.Fw]);
            g.Fs(n);
            this.Un();
            if (c) {
              g.bh = 0;
              g.Gw(n);
            }
            return 1;
          }
        }
      }
      return 0;
    }
    zp(a) {
      SoundFx.play(SoundFx.spider_fall);
      a.ve = false;
      a.mc.bM();
    }
    ES(a) {
      SoundFx.play(SoundFx.spider_win);
      let b = 0;
      let c = this.Lc;
      while (b < c.length) {
        let d = c[b];
        ++b;
        let e = d.kb;
        if (e != null && e.Mb == this.da) {
          if (e.yc != -1) {
            d.Qu();
          } else {
            e.Fs(e.za.length - 2);
            this.Un();
            e.Al = false;
          }
          if (d.ve && d.Hh && a != d) {
            this.zp(d);
          }
        }
      }
      a.ve = false;
      this.tc = this.vE = true;
      a.mc.cc();
      if (!this.Cm) {
        this.delay(cachedBind(this, this.fv), 2);
      }
    }
    mk(a, b) {
      for (var c = 0, d = this.Af; c < d.length;) {
        var e = d[c];
        ++c;
        if (e != null) {
          if (e.ca == a) {
            e.mg = true;
            e.Si(1);
          }
          if (this.gd == a && this.lE && e.ca == this.pc) {
            e.mg = true;
            e.Si(1);
            this.pc = null;
            this.lE = false;
          }
        }
      }
      c = 0;
      for (d = this.rc; c < d.length;) {
        e = d[c];
        ++c;
        if (e.ca != null && e.ca == a) {
          e.ca = null;
          e.Gn.oh();
          this.vm(e.x, e.y);
          return;
        }
      }
      if (this.Aa != 2) {
        if (b) {
          this.xc = null;
          this.zj.oh();
          this.vm(this.Ma.x, this.Ma.y);
        } else {
          this.pc = null;
          this.Aj.oh();
          this.vm(this.Na.x, this.Na.y);
        }
      } else {
        this.gd = null;
        this.yj.oh();
        this.vm(this.I.x, this.I.y);
      }
      this.Un();
    }
    vm(a, b) {
      SoundFx.play(SoundFx.bubble_break);
      let c = new Sprite(null, Resources.ca, Keys.ZG);
      c.setX(a);
      c.setY(b);
      c.center();
      c.setUniformScale(0.4);
      this.Zi.P(c.u);
      c.pa().play(Character.UI).Be(function () {
        c.free();
      });
    }
    qr(a, b, c, d) {
      if (Rect.lk(c, d, b.g.x - 24, b.g.y - 24, 60, 60)) {
        this.mk(a, b == this.xa);
        return true;
      } else {
        return false;
      }
    }
    Sw(a) {
      var b = this.O.window;
      var c = b.V.viewport;
      var d = b.Hc.x;
      b = b.Hc.y;
      d = -1 + (a.x - (c.x * d | 0)) * 2 / (c.w * d | 0);
      a = -1 + ((c.y * b | 0) - a.y) * 2 / (c.J * b | 0);
      c = this.Bb.Ab.Kv;
      return new Vec4(c.m11 * d + c.m12 * a + c.m14, c.m21 * d + c.m22 * a + c.m24, 0, 1);
    }
    WS(a, b) {
      var c = this.Sw(a);
      a = c.x;
      c = c.y;
      if (this.Ll) {
        this.CA = true;
      } else if (!(b >= 5)) {
        if (this.Rd != null && this.Rd.Ql(a, c)) {
          this.jr = b;
        } else if ((!this.se.yi() || !this.se.jk(a, c, b)) && (this.gd == null || !this.qr(this.gd, this.da, a, c)) && (this.Aa == 2 || (this.xc == null || !this.qr(this.xc, this.xa, a, c)) && (this.pc == null || !this.qr(this.pc, this.Ja, a, c)))) {
          for (var d = 0, e = this.rc; d < e.length;) {
            var f = e[d];
            ++d;
            if (f.ca != null && this.qr(f.ca, f.constraint, a, c)) {
              return;
            }
          }
          d = new Vec2(a, c);
          if (!this.ci[b]) {
            this.bj[b].Pb(d);
            this.nk[b].Pb(d);
          }
          d = 0;
          for (e = this.Dd; d < e.length;) {
            f = e[d];
            ++d;
            if (f.Gg != null && f.ht == -1 && f.Gg.vw(a, c)) {
              f.ht = b;
              return;
            }
          }
          d = false;
          e = 0;
          for (f = this.Ri; e < f.length;) {
            var g = f[e];
            ++e;
            if (g.RQ(a, c)) {
              g.Gp = 0.05;
              g.VE = b;
              if (!g.Sl()) {
                d = true;
              }
              break;
            }
          }
          if (!d) {
            d = 0;
            for (e = this.ej; d < e.length;) {
              if (e[d++].jk(a, c, b)) {
                return;
              }
            }
            var h = this;
            d = 0;
            for (e = this.Ul; d < e.length;) {
              f = e[d];
              ++d;
              if (f != null && f.jk(a, c, b)) {
                this.delay(function () {
                  h.sh = false;
                  h.I.oe = true;
                  h.I.j.W(1);
                  h.I.j.setUniformScale(0.71);
                }, 0.1);
                return;
              }
            }
            var m = 0;
            for (d = this.Vd.length; m < d;) {
              e = this.Vd[m];
              f = Vec2.nd(a, c, e.mr.x, e.mr.y);
              g = Vec2.nd(a, c, e.nr.x, e.nr.y);
              if (f < LevelController.Yp && !e.nO() || g < LevelController.Yp) {
                for (m += 1; m < d;) {
                  ++m;
                }
                e.Do.x = a;
                e.Do.y = c;
                e.Vr = b;
                if (f < LevelController.Yp) {
                  e.UD(true);
                }
                if (g < LevelController.Yp) {
                  e.VD(true);
                }
                return;
              }
              ++m;
            }
            d = 0;
            for (e = this.Lc; d < e.length;) {
              f = e[d];
              ++d;
              if (f.Zf && Rect.lk(a, c, f.x - 44, f.y - 44, 88, 88)) {
                f.kO(a, c);
                f.Xm = b;
                return;
              }
              if (f.Hf > 0 && Rect.lk(a, c, f.x - 26, f.y - 26, 52, 52)) {
                f.im = b;
                return;
              }
            }
            d = 0;
            for (e = this.Af; d < e.length;) {
              f = e[d];
              ++d;
              if (f != null && f.vw(a, c)) {
                return;
              }
            }
            if (!this.nc.gt(a, c, b)) {
              this.ci[b] = true;
            }
          }
        }
      }
    }
    YS(a, b) {
      var c = this.Sw(a);
      a = c.x;
      c = c.y;
      if (!this.Ll) {
        this.ci[b] = false;
        if (this.Rd != null && this.jr == b) {
          if (this.Rd.Ql(a, c)) {
            this.Rd.toggle();
            if (LevelState.box == 8) {
              this.qu.pN();
            }
            this.Rr(0);
          }
          this.jr = -1;
        }
        for (var d = 0, e = this.Dd; d < e.length;) {
          var f = e[d];
          ++d;
          if (f.Gg != null && f.ht == b && (f.ht = -1, f.Gg.sQ(a, c))) {
            return;
          }
        }
        d = 0;
        for (e = this.Vd; d < e.length;) {
          f = e[d];
          ++d;
          if (f.Vr == b) {
            f.Vr = -1;
            f.xx = -1;
            f.UD(false);
            f.VD(false);
          }
        }
        d = 0;
        for (e = this.ej; d < e.length;) {
          if (e[d++].tQ(b)) {
            return;
          }
        }
        d = 0;
        for (e = this.Lc; d < e.length;) {
          f = e[d];
          ++d;
          if (f.Zf && f.Xm == b) {
            f.Xm = -1;
          }
          if (f.Hf > 0 && f.im == b) {
            f.im = -1;
          }
        }
        if (b == 0 && this.Ve) {
          this.Ka.HQ();
          this.fg.TD(false);
        }
        this.nc.Mx(a, c, b);
      }
    }
    XS(a, b) {
      a = this.Sw(a);
      var c = a.x;
      var d = a.y;
      if (!this.Ll && !(b >= 5)) {
        a = new Vec2(c, d);
        if (this.bj[b].sf(a) > 10) {
          for (var e = 0, f = this.Ri; e < f.length;) {
            var g = f[e];
            ++e;
            if (g.VE == b && g.Gp != 0) {
              g.Gp = 0;
            }
          }
        }
        this.AS.Pb(a);
        f = 0;
        for (g = this.Vd; f < g.length;) {
          e = g[f];
          ++f;
          if (e.Vr == b) {
            b = new Vec2(e.x, e.y);
            if (b.sf(a) < e.Fh / 10) {
              e.Do.Pb(a);
            }
            c = Vec2.Ia(e.Do, b);
            c = Vec2.Ia(a, b).km() - c.km();
            if (c > Math.PI) {
              c -= Math.PI * 2;
            } else if (c < -Math.PI) {
              c += Math.PI * 2;
            }
            e.mr.$a(c, e.x, e.y);
            e.nr.$a(c, e.x, e.y);
            e.rotation += c * RAD2DEG;
            d = c > 0 ? SoundFx.scratch_in : SoundFx.scratch_out;
            if (Math.abs(c) < 0.07) {
              d = -1;
            }
            if (e.xx != d && d != -1) {
              SoundFx.play(d);
              e.xx = d;
            }
            d = 0;
            for (f = this.Lc; d < f.length;) {
              g = f[d];
              ++d;
              var h = new Vec2(g.x, g.y);
              if (h.sf(b) <= e.Fh + this.ga * 5) {
                h.$a(c, e.x, e.y);
                g.x = h.x;
                g.y = h.y;
                if (g.kb != null) {
                  g.kb.Jc.g.Pb(h);
                  g.kb.Jc.vh.Pb(h);
                }
              }
            }
            d = 0;
            for (f = this.Ri; d < f.length;) {
              g = f[d];
              ++d;
              h = new Vec2(g.x, g.y);
              if (h.sf(b) <= e.Fh + this.ga * 5) {
                h.$a(c, e.x, e.y);
                g.x = h.x;
                g.y = h.y;
                g.rotation += c * RAD2DEG;
                g.Hd();
              }
            }
            d = 0;
            for (f = this.bubbles; d < f.length;) {
              g = f[d];
              ++d;
              h = new Vec2(g.x, g.y);
              if (h.sf(b) <= e.Fh + this.ga * 10 && g != this.gd && g != this.pc && g != this.xc) {
                h.$a(c, e.x, e.y);
                g.x = h.x;
                g.y = h.y;
              }
            }
            if (Rect.lk(this.Ka.x, this.Ka.y, e.x - e.size, e.y - e.size, e.size * 2, e.size * 2)) {
              b = new Vec2(this.Ka.x, this.Ka.y);
              b.$a(c, e.x, e.y);
              this.Ka.x = b.x;
              this.Ka.y = b.y;
            }
            e.Do.Pb(a);
            return;
          }
        }
        e = 0;
        for (f = this.ej; e < f.length;) {
          if (f[e++].rQ(c, d, b)) {
            return;
          }
        }
        f = 0;
        for (g = this.Lc; f < g.length;) {
          e = g[f];
          ++f;
          if (e != null) {
            if (e.Zf && e.Xm == b) {
              e.jO(a);
              return;
            }
            if (e.Hf > 0 && e.im == b) {
              if (e.jw) {
                e.y = MathUtil.FA(a.y, e.gm, e.dm);
              } else {
                e.x = MathUtil.FA(a.x, e.gm, e.dm);
              }
              if (e.kb != null) {
                a = e.kb.Jc;
                a.g.x = a.vh.x = e.x;
                a.g.y = a.vh.y = e.y;
              }
              return;
            }
          }
        }
        e = false;
        if (this.nc.Lx(c, d, b)) {
          e = true;
        }
        if (this.ci[b]) {
          c = new Vec2(0, 0);
          f = new ColoredSegment(Vec2.tb(this.bj[b], c), Vec2.tb(a, c), 5, 5, RGBA.yT.Zb());
          c = this.Fj[b];
          d = 0;
          if (!e) {
            c.push(f);
            e = 0;
            while (e < c.length) {
              f = c[e];
              ++e;
              d += this.yc(f.start, f.end, false);
            }
          }
          this.nk[b].Pb(this.bj[b]);
          this.bj[b].Pb(a);
        }
      }
    }
    HS() {
      this.Ah = new Vec4(0, 0, 0, 1);
      this.Qf = new Vec4(0, 0, 0, 1);
      this.Mc = new Vec4(0, 0, 0, 1);
      this.jl = 0;
      var a = this.Bb.Ok;
      var b = this.Ah;
      b.x = (a.A + a.B) / 2;
      b.y = (a.D + a.G) / 2;
      if (this.ie.x != 0 || this.ie.y != 0) {
        this.jl = 1;
      }
      if (this.ie.x > 0) {
        b = this.Qf;
        b.x = (a.A + a.B) / 2 + (a.B - a.A);
        b.y = (a.D + a.G) / 2;
      } else if (this.ie.x < 0) {
        b = this.Qf;
        b.x = (a.A + a.B) / 2 - (a.B - a.A);
        b.y = (a.D + a.G) / 2;
      }
      if (this.ie.y > 0) {
        b = this.Qf;
        var c = this.Ah;
        b.x = c.x + 0;
        b.y = c.y + (a.G - a.D);
      } else if (this.ie.y < 0) {
        b = this.Qf;
        c = this.Ah;
        b.x = c.x - 0;
        b.y = c.y - (a.G - a.D);
      }
      if (this.jl == 1) {
        this.Ds = -0.5;
        this.Ll = true;
        a = this.Bb.g;
        b = this.Ah;
        a.x = b.x;
        a.y = b.y;
      }
      this.Bb.update();
      this.Wr = this.Aa != 2 ? this.Ni(this.xa) || this.Ni(this.Ja) : this.Ni(this.da);
      if (this.$c) {
        a = 0;
        b = this.rc;
        while (a < b.length) {
          if (this.Ni(b[a++].constraint)) {
            this.Wr = true;
            break;
          }
        }
      }
    }
    Ni(a) {
      return !this.Bb.PO(a.g.x, a.g.y);
    }
    mE(a) {
      return Save.language != a.locale;
    }
    Rr() {
      PhysicsConfig.toggle();
      this.si = PhysicsConfig.NO();
      SoundFx.play(this.si ? SoundFx.gravity_off : SoundFx.gravity_on);
    }
    AR(a) {
      let b = 0;
      let c = this.Dd;
      while (b < c.length) {
        let d = c[b];
        ++b;
        if (d.TE == a) {
          d.BR();
        }
      }
    }
    rB(a, b, c) {
      let d = Vec2.Ia(a.g, b.g).Rb();
      if (d < c) {
        if (c - d < 1000 / (a.sb.Rb() + b.sb.Rb()) * 2) {
          var e = Math.acos(Vec2.cq(a.g.x > b.g.x ? Vec2.Ia(a.g, b.g) : Vec2.Ia(b.g, a.g)).x);
          var f = Math.abs((c - d) / 2 * Math.cos(e));
          c = Math.abs((c - d) / 2 * Math.sin(e));
          if (a.g.x <= b.g.x) {
            a.g.x -= f;
            b.g.x += f;
          } else {
            b.g.x -= f;
            a.g.x += f;
          }
          if (a.g.y <= b.g.y) {
            a.g.y -= c;
            b.g.y += c;
          } else {
            b.g.y -= c;
            a.g.y += c;
          }
        } else {
          var g = Vec2.Ia(b.g, a.g);
          var h = -g.y;
          var m = g.x;
          f = (a.sb.x * g.x + a.sb.y * g.y) / c;
          e = (a.sb.x * h + a.sb.y * m) / c;
          h = (b.sb.x * h + a.sb.x * m) / c;
          m = f;
          f = (b.sb.x * g.x + a.sb.x * g.y) / c;
          let n = g.x / c;
          g = g.y / c;
          a.sb = new Vec2(f * n - e * g, f * g + e * n);
          b.sb = new Vec2(m * n - h * g, m * g + h * n);
          e = Math.acos(Vec2.cq(a.g.x > b.g.x ? Vec2.Ia(a.g, b.g) : Vec2.Ia(b.g, a.g)).x);
          f = Math.abs((c - d) / 2 * Math.cos(e));
          c = Math.abs((c - d) / 2 * Math.sin(e));
          if (a.g.x <= b.g.x) {
            a.g.x -= f;
            b.g.x += f;
          } else {
            b.g.x -= f;
            a.g.x += f;
          }
          if (a.g.y <= b.g.y) {
            a.g.y -= c;
            b.g.y += c;
          } else {
            b.g.y -= c;
            a.g.y += c;
          }
          a.xd = Vec2.bq(a.sb, 60);
          a.ha = Vec2.Ia(a.g, a.xd);
          b.xd = Vec2.bq(b.sb, 60);
          b.ha = Vec2.Ia(b.g, b.xd);
        }
      }
    }
    aF(a) {
      if (this.Cd == a) {
        for (var b = this.Cd = 0, c = this.Lp; b < c.length;) {
          var d = c[b];
          ++b;
          if (d != null) {
            if (d.Cd == a) {
              d.show();
            } else {
              d.oh();
            }
          }
        }
        b = 0;
        for (c = this.Kp; b < c.length;) {
          d = c[b];
          ++b;
          if (d != null) {
            if (d.Cd == a) {
              d.show();
            } else {
              d.oh();
            }
          }
        }
      }
    }
    update(a) {
      function b(w) {
        w.Vh(new Vec2(-w.sb.x / v46, -w.sb.y / v46 + v45), a);
      }
      function c(w, H, I) {
        let R = H.x;
        H = H.y;
        let L = w.Gb;
        let N = w.Xb;
        let O = w.Vc;
        w = w.qd;
        if (Rect.$j(L.x + R, L.y + H, N.x + R, N.y + H, I.g.x - 16, I.g.y - 16, 32, 32)) {
          return true;
        } else {
          return Rect.$j(O.x + R, O.y + H, w.x + R, w.y + H, I.g.x - 16, I.g.y - 16, 32, 32);
        }
      }
      function d(w, H) {
        if (Rect.$j(w.Gb.x, w.Gb.y, w.Xb.x, w.Xb.y, H.g.x - 6, H.g.y - 6, 12, 12)) {
          return true;
        } else {
          return Rect.$j(w.Vc.x, w.Vc.y, w.qd.x, w.qd.y, H.g.x - 6, H.g.y - 6, 12, 12);
        }
      }
      super.update(a);
      let e = 0;
      let f = this.Bu;
      while (e < f.length) {
        f[e++].update(a);
      }
      let g = this.um;
      if (g != null) {
        g.update(a);
      }
      let h = 0;
      while (h < 5) {
        let w = this.Fj[h++];
        let H = w.length;
        let I = 0;
        while (I < H) {
          let R = w[I];
          let L = PathResolver.ek(R.color.a, 0, 10, a);
          R.color.a = L.value;
          if (L.sk) {
            w.splice(I, 1);
            --H;
          } else {
            ++I;
          }
        }
      }
      if (this.dl == 0) {
        this.Tl += a;
        if (this.Tl > 30) {
          this.Tl = 0;
        }
      }
      let m = this.Ag / this.zg;
      let n = this.O.window.lo();
      let q = n.w / n.J;
      let p = m > 1 && q > 1 && q > m;
      switch (this.jl) {
        case 0:
          this.op += a;
          break;
        case 1:
          this.Ds += a * (this.CA ? 3 : 1);
          let w = 0;
          if (this.Ds >= 0) {
            w = Math.min(1, this.Ds / 2);
          }
          let H = Easing.quadInOut()(w);
          let I = this.Ah;
          let R = this.Qf;
          let L = new Vec4(I.x + (R.x - I.x) * H, I.y + (R.y - I.y) * H, 0, 1);
          if (p) {
            L = new Vec4(this.Ag / 2, this.zg / 2, 0, 1);
            w = 1;
            this.Bb.Kb.x = 0.5;
            this.Bb.Kb.y = 0.5;
          } else {
            if (this.ie.x > 0) {
              this.Bb.Kb.x = H;
            }
            if (this.ie.x < 0) {
              this.Bb.Kb.x = 1 - H;
            }
            if (this.ie.y > 0) {
              this.Bb.Kb.y = H;
            }
            if (this.ie.y < 0) {
              this.Bb.Kb.y = 1 - H;
            }
          }
          let N = this.Bb.g;
          N.x = L.x;
          N.y = L.y;
          if (w == 1) {
            this.CA = this.Ll = false;
            this.jl = 2;
            this.ii = 0;
            let G = this.Mc;
            G.x = this.Qf.x;
            G.y = this.Qf.y;
          }
          break;
        case 2:
          this.op += a;
          let O = this.Aa != 2 ? this.xa : this.da;
          this.ii += 0.05;
          if (this.ii > 1) {
            this.ii = 1;
          }
          if (p) {
            let G = this.Bb.Kb;
            G.x = 0.5;
            G.y = 0.5;
            let T = this.Bb.g;
            T.x = this.Ag / 2;
            T.y = this.zg / 2;
          } else {
            if (this.ie.x != 0) {
              let G = this.Bb.NN(O.g.x, O.g.y);
              if (G < 100) {
                G = 100;
              } else if (G > 300) {
                G = 300;
              }
              if (G <= 100) {
                this.ii = 1;
              }
              this.Mc.x += (O.g.x - this.Mc.x) * remap(G, 100, 300, 0.5, 0.1) * this.ii;
              let T = Math.min(this.Ah.x, this.Qf.x);
              let v12 = Math.max(this.Ah.x, this.Qf.x);
              if (this.Mc.x < T) {
                this.Mc.x = T;
              }
              if (this.Mc.x > v12) {
                this.Mc.x = v12;
              }
              this.Bb.g.x = this.Mc.x;
              this.Bb.Kb.x = remap(this.Mc.x, T, v12, 0, 1);
            }
            if (this.ie.y != 0) {
              let G = this.Bb.MN(O.g.x, O.g.y);
              if (G <= 100) {
                this.ii = 1;
              }
              if (G < 100) {
                G = 100;
              } else if (G > 300) {
                G = 300;
              }
              this.Mc.y += (O.g.y - this.Mc.y) * remap(G, 100, 300, 0.5, 0.1) * this.ii;
              let T = Math.min(this.Ah.y, this.Qf.y);
              let v13 = Math.max(this.Ah.y, this.Qf.y);
              if (this.Mc.y < T) {
                this.Mc.y = T;
              }
              if (this.Mc.y > v13) {
                this.Mc.y = v13;
              }
              this.Bb.g.y = this.Mc.y;
              this.Bb.Kb.y = remap(this.Mc.y, T, v13, 0, 1);
            }
          }
      }
      this.Bb.update();
      let v = this.Lc.length;
      let u = this;
      if (v > 0) {
        let w = false;
        let H = false;
        let I = false;
        let R = 0;
        let L = this.rc;
        while (R < L.length) {
          L[R++].NB = true;
        }
        let N = 0;
        while (N < v) {
          let O = this.Lc[N++];
          if (O == null) {
            continue;
          }
          O.update(a);
          let G = O.kb;
          if (this.se.yi() && G != null && G.yc == -1) {
            this.tk(true);
          } else {
            if (O.pb != null && G != null) {
              G.Jc.g.x = O.x;
              G.Jc.g.y = O.y;
              G.Jc.vh.Pb(G.Jc.g);
            }
            if (G != null) {
              if (G.yc != -1 && G.bh == 0) {
                O.Qu();
                continue;
              }
              G.update(a * this.Em);
              if (O.ve) {
                if (this.jl != 1 && !this.Ll) {
                  O.rT(a);
                }
                if (O.Gk == -1) {
                  this.ES(O);
                }
              }
            }
            if (O.Z != -1 && O.kb == null) {
              let T = function (W, p20) {
                if (new Vec2(p20.x, p20.y).sf(W.g) <= p20.Z + Star.bg) {
                  W = new Rope(u.ma(6), null, p20.x, p20.y, W, W.g.x, W.g.y, p20.Z + Star.bg);
                  W.Jc.vh.Pb(W.Jc.g);
                  p20.po = true;
                  p20.eE(W);
                  SoundFx.play(SoundFx.rope_get);
                  if (p20.pb != null) {
                    SoundFx.play(SoundFx.buzz);
                  }
                  return true;
                } else {
                  return false;
                }
              };
              if (this.Aa != 2) {
                if (!this.kd) {
                  if (T(this.xa, O)) {
                    this.yn();
                  }
                }
                if (!this.ld && O.kb == null) {
                  if (T(this.Ja, O)) {
                    this.yn();
                  }
                }
              } else if (T(this.da, O)) {
                this.yn();
              }
              let vLN04 = 0;
              let v14 = this.rc;
              while (vLN04 < v14.length) {
                T(v14[vLN04++].constraint, O);
              }
            }
            if (G != null) {
              let T = G.za[G.za.length - 1];
              let v15 = false;
              if (!w) {
                if (this.Aa != 2) {
                  if (T != this.xa || this.kd || H) {
                    if (T == this.Ja && !this.ld && !I) {
                      v15 = true;
                    }
                  } else {
                    v15 = true;
                  }
                } else if (!this.tc && !w) {
                  v15 = true;
                }
              }
              if (G.Fw != 0 && G.yc == -1 && v15) {
                let v16 = Vec2.Ia(G.Jc.g, T.g).km() * RAD2DEG;
                if (this.Aa != 2) {
                  let W = T == this.xa ? this.Ma : this.Na;
                  if (!G.Mn) {
                    G.rh = W.rotation - v16;
                  }
                  if (T == this.xa) {
                    this.Bo = v16 + G.rh - W.rotation;
                    H = true;
                  } else {
                    this.Co = v16 + G.rh - W.rotation;
                    I = true;
                  }
                  this.I.rotation = v16 + G.rh;
                  W.rotation = v16 + G.rh;
                } else {
                  if (!G.Mn) {
                    G.rh = this.I.rotation - v16;
                  }
                  this.I.vg = v16 + G.rh - this.I.rotation;
                  this.I.rotation = v16 + G.rh;
                  w = true;
                }
                G.Mn = true;
              } else {
                G.Mn = false;
              }
            }
          }
        }
        if (this.Aa != 2) {
          if (!H && !this.kd) {
            this.Ma.rotation += Math.min(5, this.Bo);
            this.Bo *= 0.98;
          }
          if (!I && !this.ld) {
            this.Na.rotation += Math.min(5, this.Co);
            this.Co *= 0.98;
          }
        } else if (!w && !this.tc) {
          this.I.rotation += Math.min(5, this.I.vg);
          this.I.vg *= 0.98;
        }
      }
      let A = 0;
      let D = this.rc;
      while (A < D.length) {
        let w = D[A];
        ++A;
        if (!w.NB) {
          w.rotation += Math.min(5, w.vg);
          w.vg *= 0.98;
        }
      }
      if (this.$c) {
        let w = 0;
        let H = this.rc;
        while (w < H.length) {
          let L = H[w];
          ++w;
          let N = L.constraint;
          if (!this.Ve) {
            if (Vec2.nd(N.g.x, N.g.y, this.Ka.x, this.Ka.y) < L.cC) {
              this.Ka.Lm(true);
            } else {
              this.Ka.Lm(false);
            }
            let O = 0;
            let G = this.ab;
            while (O < G.length) {
              let T = G[O];
              ++O;
              T.Lm(Vec2.nd(N.g.x, N.g.y, T.x, T.y) < L.cC);
            }
          }
        }
        let I = 0;
        let R = this.rc;
        while (I < R.length) {
          let L = R[I];
          ++I;
          if (L.Gc != null) {
            continue;
          }
          let N = Star.bg * 2;
          if (this.Aa == 2) {
            if (!this.tc && this.I.Gc == null) {
              this.rB(L.constraint, this.da, N);
            }
          }
          let O = 0;
          let G = this.rc;
          while (O < G.length) {
            let T = G[O];
            ++O;
            if (L != T && T.Gc == null) {
              this.rB(L.constraint, T.constraint, N);
            }
          }
        }
      }
      if (a > 0) {
        let w = a;
        while (w >= 0) {
          w -= 0.01;
          this.nc.update(Math.min(0.01, w));
          this.nc.nl(this.bubbles);
          this.nc.nl(this.ab);
          this.nc.nl(this.wj);
          this.nc.nl(this.Gh);
          this.nc.nl(this.ej);
          this.nc.nl(this.Ri);
        }
      }
      if (!this.tc) {
        this.I.update(a);
        this.di -= a;
        if (this.di <= 0) {
          if (!this.se.yi()) {
            this.da.update(a * this.Em);
          }
        }
      }
      if (this.Aa != 2) {
        let w = a * this.Em;
        this.di -= a;
        this.Ma.update(a);
        if (this.di <= 0) {
          this.xa.update(w);
        }
        this.Na.update(a);
        if (this.di <= 0) {
          this.Ja.update(w);
        }
        if (this.Aa == 1) {
          let H = 0;
          while (H < 30) {
            ++H;
            this.xa.As();
            this.Ja.As();
          }
        }
        if (this.Li > 0) {
          let H = PathResolver.ek(this.Li, 0, 200, a);
          this.Li = H.value;
          if (H.sk) {
            SoundFx.play(SoundFx.candy_link);
            this.Aa = 2;
            this.tc = false;
            this.ld = this.kd = true;
            let I = false;
            let R = false;
            let L = 0;
            let N = this.Af;
            while (L < N.length) {
              let v17 = N[L];
              ++L;
              if (v17 != null) {
                if (this.xc != null && v17.ca == this.xc) {
                  I = true;
                }
                if (this.pc != null && v17.ca == this.pc) {
                  R = true;
                }
              }
            }
            if (this.xc != null && this.pc != null && I && R) {
              this.lE = true;
            } else if (this.xc == null || !I) {
              if (this.pc == null || !R) {
                if (this.xc != null || this.pc != null) {
                  let vLN05 = 0;
                  let v18 = this.Af;
                  while (vLN05 < v18.length) {
                    let v19 = v18[vLN05];
                    ++vLN05;
                    if (v19 != null) {
                      if (this.xc != null && v19.ca == this.xc) {
                        v19.mg = true;
                        v19.Si(1);
                      }
                      if (this.pc != null && v19.ca == this.pc) {
                        v19.mg = true;
                        v19.Si(1);
                      }
                    }
                  }
                }
              }
            }
            if (this.xc != null || this.pc != null) {
              this.gd = this.xc ?? this.pc;
              this.yj.show();
              this.zj.oh();
              this.Aj.oh();
            }
            this.Co = this.Bo = this.I.vg = 0;
            this.da.g.x = this.xa.g.x;
            this.da.g.y = this.xa.g.y;
            this.I.x = this.da.g.x;
            this.I.y = this.da.g.y;
            let O = Vec2.Ia(this.xa.g, this.xa.ha);
            let G = Vec2.Ia(this.Ja.g, this.Ja.ha);
            let T = new Vec2((O.x + G.x) / 2, (O.y + G.y) / 2);
            this.da.ha.Pb(this.da.g);
            this.da.ha.Ax(T);
            let vLN06 = 0;
            let v20 = this.Lc;
            while (vLN06 < v20.length) {
              let v21 = v20[vLN06++].kb;
              if (v21 != null && v21.yc != v21.za.length - 3 && (v21.Mb == this.xa || v21.Mb == this.Ja)) {
                let v22 = v21.za[v21.za.length - 2];
                let v23 = v21.Mb.zh(v22);
                this.da.al(v22, v23, 0);
                v21.Mb = this.da;
                v21.za[v21.za.length - 1] = this.da;
                v21.rh = 0;
                v21.Mn = false;
              }
            }
            this.Ma.T.free();
            this.Na.T.free();
            let W = new Sprite(null, Resources.I, Keys.hH);
            this.ma(11).P(W.u);
            W.setX(this.I.x);
            W.setY(this.I.y);
            W.center();
            W.pa().WC(v157);
          } else {
            this.xa.vq(this.Ja, this.Li);
            this.Ja.vq(this.xa, this.Li);
          }
        }
        if (!this.kd && !this.ld && this.Aa == 0) {
          this.Rm(this.xa, this.Ma);
          this.Rm(this.Ja, this.Na);
          if (Entity.yo(this.Ma, this.Na)) {
            this.Aa = 1;
            this.Li = this.xa.g.sf(this.Ja.g);
            this.xa.al(this.Ja, this.Li, 1);
            this.Ja.al(this.xa, this.Li, 1);
          }
        }
      }
      let B = 0;
      let K = this.rc;
      while (B < K.length) {
        let w = K[B];
        ++B;
        w.update(a);
        w.constraint.update(a * this.Em);
        let H = 0;
        while (H < 30) {
          ++H;
          w.constraint.As();
        }
      }
      this.Ka.update(a);
      if (this.kr >= 0) {
        this.kr -= a;
        if (this.kr < 0 && !this.$c) {
          this.Ka.JQ();
        }
      }
      if (this.sq >= 0) {
        this.sq -= a;
        if (this.sq < 0) {
          this.I.CQ();
        }
      }
      if (!this.Ll) {
        let w = 0;
        let H = this.ab;
        while (w < H.length) {
          let I = H[w];
          ++w;
          I.update(a);
          let R = [];
          if (this.tc) {
            if (this.Aa != 2) {
              if (this.Ma != null) {
                R.push(this.Ma);
              }
              if (this.Na != null) {
                R.push(this.Na);
              }
            }
          } else {
            R.push(this.I);
          }
          if (this.Rl && !this.sh && !I.MO) {
            let L = 0;
            while (L < R.length) {
              let N = R[L];
              ++L;
              let O = N.x - I.x;
              let G = N.y - I.y;
              if (Math.sqrt(O * O + G * G) < 95) {
                I.pb = I.pb != null ? SeekerPath.HB(N, I.pb.g) : SeekerPath.HB(N, new Vec2(I.x, I.y));
                I.MO = true;
                SoundFx.play(SoundFx.magnet_attract);
              }
            }
          }
          if (I.timeout > 0 && I.time == 0) {
            this.nc.remove(I);
            Std.remove(this.ab, I);
            let L = I.j;
            L.nb(0).tween().alpha(0, 0.25);
            L.nb(1).tween().scale(0, 0.25);
            L.nb(2).tween().scale(0, 0.25, null, null, cachedBind(I, I.free));
            break;
          } else {
            let L = false;
            if (this.Aa != 2) {
              this.Rm(this.xa, this.Ma);
              this.Rm(this.Ja, this.Na);
              L = Entity.yo(this.Ma, I) && !this.kd || Entity.yo(this.Na, I) && !this.ld;
            } else {
              this.Rm(this.da, this.I);
              L = Entity.yo(this.I, I) && !this.tc;
            }
            if ((!this.$c || !I.fe) && !!this.$c) {
              L = false;
            }
            if (L) {
              this.I.XC();
              this.Ap++;
              this.Fi.uw(this.Ap);
              let N = new Sprite(null, Resources.Oa, Keys.kI);
              N.setX(I.x);
              N.setY(I.y);
              N.setUniformScale(0.4);
              N.pa().WC(STAR_DISAPPEAR_ANIM);
              N.center();
              this.Zi.P(N.u);
              I.free();
              this.nc.remove(I);
              Std.remove(this.ab, I);
              SoundFx.play([1013, 1012, 1011][this.Ap - 1]);
              if (this.Ka.IO()) {
                this.Ka.YC();
              }
              break;
            }
          }
        }
      }
      let E = 0;
      let v24 = this.bubbles;
      while (E < v24.length) {
        let w = v24[E];
        ++E;
        w.update(a);
        if (!w.bs) {
          if (this.Aa != 2) {
            if (!this.kd && this.Nv(w, this.Ma, this.xc, this.zj)) {
              this.xc = w;
              break;
            }
            if (!this.ld && this.Nv(w, this.Na, this.pc, this.Aj)) {
              this.pc = w;
              break;
            }
          } else if (!this.tc && this.Nv(w, this.I, this.gd, this.yj)) {
            this.gd = w;
            break;
          }
        }
        let H = 0;
        let I = this.rc;
        while (H < I.length) {
          let R = I[H];
          ++H;
          if (!w.bs && Rect.lk(R.x, R.y, w.x - 34, w.y - 34, 68, 68)) {
            let L = false;
            let N = 0;
            let O = this.Af;
            while (N < O.length) {
              let G = O[N];
              ++N;
              if (G.ca == w) {
                G.mg = false;
                L = true;
              }
            }
            if (R.ca == null || !L) {
              if (R.ca != null) {
                this.vm(w.x, w.y);
                let G = 0;
                let T = this.Af;
                while (G < T.length) {
                  let v25 = T[G];
                  ++G;
                  if (v25.ca == R.ca) {
                    v25.mg = true;
                    v25.Si(1);
                  }
                }
                R.ca = null;
              }
              R.ca = w;
              R.Gn.show();
              SoundFx.play(SoundFx.bubble);
              w.pop();
            }
          }
        }
        if (!w.qF) {
          let R = this.Vd.length;
          let L = 0;
          while (L < R) {
            let N = this.Vd[L++];
            if (Vec2.nd(w.x, w.y, N.x, N.y) < N.Fh) {
              w.qF = true;
            }
          }
        }
      }
      let vLN07 = 0;
      let V = this.Lp;
      while (vLN07 < V.length) {
        V[vLN07++].update(a);
      }
      let vLN08 = 0;
      let v26 = this.Kp;
      while (vLN08 < v26.length) {
        v26[vLN08++].update(a);
      }
      let v27 = -1;
      let vLN09 = 0;
      let v28 = this.Vd.length;
      while (vLN09 < v28) {
        let w = this.Vd[vLN09];
        let H = 0;
        while (H < v) {
          let L = this.Lc[H++];
          let N = w.kg.indexOf(L);
          if (Vec2.nd(L.x, L.y, w.x, w.y) <= w.Fh + this.ga * 5) {
            if (N < 0) {
              w.kg.push(L);
            }
          } else if (N >= 0) {
            Std.remove(w.kg, L);
          }
        }
        let I = this.bubbles.length;
        let R = 0;
        while (R < I) {
          let L = this.bubbles[R++];
          let N = w.kg.indexOf(L);
          if (Vec2.nd(L.x, L.y, w.x, w.y) <= w.Fh + this.ga * 10) {
            if (N < 0) {
              w.kg.push(L);
            }
          } else if (N >= 0) {
            Std.remove(w.kg, L);
          }
        }
        if (w.ET) {
          v27 = vLN09;
        }
        w.update(a);
        ++vLN09;
      }
      if (v27 >= 0) {
        this.Vd[v27].free();
        this.Vd.splice(v27, 1);
      }
      let vLN010 = 0;
      let v29 = this.Gh;
      while (vLN010 < v29.length) {
        let w = v29[vLN010];
        ++vLN010;
        w.update(a);
        let H = PathResolver.ek(w.xr, 0, 1, a);
        w.xr = H.value;
        if (H.sk) {
          w.state = 0;
        }
        let I = w.rotation;
        w.rotation = 0;
        w.Hd();
        w.rotation = I;
        w.Hd();
        let R = function (G) {
          let T = Sock.Sk * 2;
          return Rect.$j(w.Gb.x, w.Gb.y, w.Xb.x, w.Xb.y, G.g.x - Sock.Sk, G.g.y - Sock.Sk, T, T);
        };
        let L = function (G) {
          let T = Sock.Sk * 2;
          return Rect.$j(w.Vc.x, w.Vc.y, w.qd.x, w.qd.y, G.g.x - Sock.Sk, G.g.y - Sock.Sk, T, T);
        };
        if (w.state != 0) {
          continue;
        }
        if (this.Aa == 2 && this.I.Gc == null) {
          let G = this.da.xd.Zb();
          G.rotate(-I * DEG2RAD);
          if (G.y >= 0 && (R(this.da) || L(this.da))) {
            let T = 0;
            let v30 = this.Gh.length;
            while (T < v30) {
              let v31 = this.Gh[T++];
              if (v31 != w && v31.group == w.group) {
                v31.state = 1;
                v31.xr = 0.8;
                this.tk(false);
                this.I.Rw = this.da.sb.Rb() * 0.9 * LevelController.Ty;
                this.I.Gc = v31;
                w.qc.L(true);
                w.qc.pa().play(v167);
                SoundFx.play(SoundFx.teleport);
                let W = this;
                let v32 = this.I;
                this.delay(function () {
                  W.KE(v32);
                }, 0.1);
                break;
              }
            }
          }
        }
        let N = 0;
        let O = this.rc;
        while (N < O.length) {
          let G = O[N];
          ++N;
          if (G.Gc != null) {
            continue;
          }
          let T = G.constraint.xd.Zb();
          T.rotate(-I * DEG2RAD);
          if (T.y >= 0 && R(G.constraint) || L(G.constraint)) {
            let vLN011 = 0;
            let v33 = this.Gh.length;
            while (vLN011 < v33) {
              let W = this.Gh[vLN011++];
              if (W != w && W.group == w.group) {
                W.state = 1;
                W.xr = 0.8;
                this.jR(G);
                G.Rw = G.constraint.sb.Rb() * 0.9;
                G.Gc = W;
                w.qc.L(true);
                w.qc.pa().play(v167);
                SoundFx.play(SoundFx.teleport);
                let vThis2 = this;
                let vG = G;
                this.delay(function () {
                  vThis2.KE(vG);
                }, 0.1);
                break;
              }
            }
          }
        }
      }
      let vLN012 = 0;
      let v34 = this.Af;
      while (vLN012 < v34.length) {
        v34[vLN012++].update(a);
      }
      let vLN013 = 0;
      let v35 = this.Ri;
      while (vLN013 < v35.length) {
        let w = v35[vLN013];
        ++vLN013;
        w.update(a);
        let H = PathResolver.ek(w.Gp, 0, 1, a);
        w.Gp = H.value;
        if (H.sk) {
          this.uQ(w, a);
        }
      }
      let vLN014 = 0;
      let v36 = this.ej;
      while (vLN014 < v36.length) {
        let w = v36[vLN014];
        ++vLN014;
        if (w != null) {
          w.update(a);
          if (w.Ee != 3) {
            this.vQ(w, a);
          }
        }
      }
      let vLN015 = 0;
      let v37 = this.Ul;
      while (vLN015 < v37.length) {
        let w = v37[vLN015];
        ++vLN015;
        if (w != null && (w.update(a), !this.sh && w.Xj == 0 && Vec2.nd(this.da.g.x, this.da.g.y, w.x, w.y) < 32)) {
          this.sh = true;
          this.I.oe = false;
          this.I.j.tween().scale(0.3, 0.1);
          this.I.j.tween().alpha(0, 0.1);
          this.I.j.tween().tF(w.x, w.y);
          this.tk(false);
          if (this.gd != null) {
            this.mk(this.gd, false);
          }
          let H = this.da;
          let I = w;
          this.delay(function () {
            I.jA(H);
          }, 0.05);
          this.aF(3);
        }
      }
      let vLN016 = 0;
      let v38 = this.Dd;
      while (vLN016 < v38.length) {
        v38[vLN016++].update(a);
      }
      if (this.Ve && !this.sh) {
        let w = 0;
        let H = this.Dd;
        while (w < H.length) {
          let I = H[w];
          ++w;
          let R = false;
          if (!I.ce || I.wl) {
            if (this.Aa != 2) {
              if (R = !this.kd && d(I, this.xa)) {
                this.Dv(I, this.Ma.constraint, a);
              }
              if (R = !this.ld && d(I, this.Ja)) {
                this.Dv(I, this.Na.constraint, a);
              }
            } else if (R = !this.tc && d(I, this.da)) {
              this.Dv(I, this.I.constraint, a);
            }
            if (!R) {
              I.Ck = false;
            }
          }
        }
      } else if (!this.sh) {
        let w = 0;
        let H = this.Dd;
        while (w < H.length) {
          let I = H[w];
          ++w;
          if (!I.ce || I.wl) {
            let R = false;
            let L = false;
            if (this.Aa != 2) {
              if (R = !this.kd && d(I, this.xa)) {
                L = true;
              } else {
                R = !this.ld && d(I, this.Ja);
              }
            } else {
              R = !this.tc && d(I, this.da);
            }
            if (R) {
              if (this.Aa != 2) {
                if (L) {
                  if (this.xc != null) {
                    this.mk(this.xc, true);
                  }
                } else if (this.pc != null) {
                  this.mk(this.pc, false);
                }
              } else if (this.gd != null) {
                this.mk(this.gd, false);
              }
              let N = new CandyShatterParticles(this, 5);
              this.Bu.push(N);
              if (this.Rd != null && !this.si) {
                N.Kb.y = -500;
                N.angle = 90;
              }
              if (this.Aa != 2) {
                if (L) {
                  N.x = this.Ma.x;
                  N.y = this.Ma.y;
                  this.kd = true;
                } else {
                  N.x = this.Na.x;
                  N.y = this.Na.y;
                  this.ld = true;
                }
              } else {
                N.x = this.I.x;
                N.y = this.I.y;
                this.tc = true;
                this.I.free();
              }
              N.Qm(5);
              SoundFx.play(SoundFx.candy_break);
              this.tk(L);
              if (this.Cm) {
                return;
              }
              this.delay(cachedBind(this, this.fv), 0.3);
              return;
            }
          }
        }
      }
      let vLN017 = 0;
      let v39 = this.wj;
      while (vLN017 < v39.length) {
        let w = v39[vLN017];
        ++vLN017;
        w.update(a);
        let H = Vec2.Ia(new Vec2(w.x, w.y), w.es);
        let I = H.Rb();
        let R = 1;
        let L = new Vec2(0, 0);
        if (I >= 1) {
          R = I | 0;
          L = Vec2.bq(H, R);
        }
        let N = new Vec2(0, 0);
        let O = false;
        let G = false;
        if (this.Aa != 2) {
          O = false;
          let W = 0;
          let vR = R;
          while (W < vR) {
            let v40 = Vec2.Ob(L, W++);
            if (O = O || c(w, v40, this.xa)) {
              N = v40.Zb();
              break;
            }
          }
          if (O = O && !this.kd) {
            G = true;
          } else {
            O = false;
            let vLN018 = 0;
            let vR2 = R;
            while (vLN018 < vR2) {
              let v41 = Vec2.Ob(L, vLN018++);
              if (O = O || c(w, v41, this.Ja)) {
                N = v41.Zb();
                break;
              }
            }
            O = O && !this.ld;
          }
        } else {
          O = false;
          let W = 0;
          let vR3 = R;
          while (W < vR3) {
            let v42 = Vec2.Ob(L, W++);
            if (O = O || c(w, v42, this.da)) {
              N = v42.Zb();
            }
          }
          O = O && !this.tc;
        }
        let T = function (W) {
          W.g.x += H.x - N.x;
          W.g.y += H.y - N.y;
          W.ha.x += H.x - N.x;
          W.ha.y += H.y - N.y;
        };
        if (O) {
          if (this.Aa != 2) {
            if (G) {
              T(this.xa);
              this.pr(w, this.xa, a);
            } else {
              T(this.Ja);
              this.pr(w, this.Ja, a);
            }
          } else {
            T(this.da);
            this.pr(w, this.da, a);
          }
        } else {
          w.Ck = false;
        }
        O = false;
        let vLN019 = 0;
        let v43 = this.rc;
        while (vLN019 < v43.length) {
          let W = v43[vLN019];
          ++vLN019;
          O = false;
          let vLN020 = 0;
          let vR4 = R;
          while (vLN020 < vR4) {
            let v44 = vLN020++;
            O = O || c(w, Vec2.Ob(L, v44), W.constraint);
          }
          if (O) {
            T(W.constraint);
            this.pr(w, W.constraint, a);
          } else {
            w.Ck = false;
          }
        }
        w.oA();
      }
      this.se.update(a);
      if (!this.se.yi() && this.se.yu(this.da)) {
        this.se.Du(this.da);
        this.tk(true);
        this.I.vg = 0;
        this.aF(4);
      }
      this.Ic.update(a);
      if (!this.hg && this.I.Gc == null && this.Ve) {
        if (this.Aa != 2) {
          if (!this.kd) {
            let w = this.Ma.constraint.g.x - this.Ic.x;
            let H = this.Ma.constraint.g.y - this.Ic.y;
            if (Math.sqrt(w * w + H * H) <= Star.bg * 2) {
              this.Ic.Iu();
              this.Fi.rw();
              this.hg = true;
            }
          }
          if (!this.ld) {
            let w = this.Na.constraint.g.x - this.Ic.x;
            let H = this.Na.constraint.g.y - this.Ic.y;
            if (Math.sqrt(w * w + H * H) <= Star.bg * 2) {
              this.Ic.Iu();
              this.hg = true;
              this.Fi.rw();
            }
          }
        } else {
          let w = this.I.constraint.g.x - this.Ic.x;
          let H = this.I.constraint.g.y - this.Ic.y;
          if (Math.sqrt(w * w + H * H) <= Star.bg * 2) {
            this.Ic.Iu();
            this.Fi.rw();
            this.hg = true;
          }
        }
      }
      let v45 = Character.BF * (this.Rd == null || this.si ? 1 : -1);
      let v46 = Character.AF;
      if (this.Aa == 0) {
        if (this.xc != null) {
          b(this.xa);
        }
        if (this.pc != null) {
          b(this.Ja);
        }
      }
      if (this.Aa == 1) {
        if (this.xc != null || this.pc != null) {
          b(this.xa);
          b(this.Ja);
        }
      } else if (this.gd != null && !this.se.yi()) {
        b(this.da);
      }
      let vLN021 = 0;
      let v47 = this.rc;
      while (vLN021 < v47.length) {
        let w = v47[vLN021];
        ++vLN021;
        if (w.ca != null) {
          b(w.constraint);
        }
      }
      let v48;
      if (!this.tc && !this.Nr) {
        if (this.iw) {
          if (this.Ro > 0) {
            this.Ro = PathResolver.dk(this.Ro, 0, 1, a);
            if (this.Ro <= 0) {
              v48 = new Vec2(this.Ka.x, this.Ka.y);
              if (this.da.g.sf(v48) > OmNom.Iy) {
                this.iw = false;
                this.Ka.MQ();
                SoundFx.play(SoundFx.monster_close);
              } else {
                this.Ro = 1;
              }
            }
          }
        } else {
          let w = true;
          if (this.sh) {
            w = false;
          } else if (this.$c && !this.Ka.fe) {
            w = false;
          }
          if (w) {
            v48 = new Vec2(this.Ka.x, this.Ka.y);
            if (this.da.g.sf(v48) < OmNom.Iy) {
              this.iw = true;
              this.Ka.NQ();
              SoundFx.play(SoundFx.monster_open);
              this.Ro = 1;
            }
          }
        }
        if (!this.Cm && !this.iA && (!this.$c || this.$c && this.Ka.fe) && this.bN(this.I, this.gd, this.Ka, this.da)) {
          this.tc = this.iA = true;
          this.Dl();
          return;
        }
      }
      if (this.Ve) {
        if (this.Aa != 2) {
          this.Cv(this.Ma.constraint);
          this.Cv(this.Na.constraint);
        } else {
          this.Cv(this.I.constraint);
        }
        this.xn += a;
        if (this.ci[0] && (this.fg.isActive || (this.Ka.GQ(), this.fg.TD(true)), this.xn > 0.3)) {
          let w = new Vec2(this.nk[0].x, this.nk[0].y);
          let H;
          H = this.xn < 0.15 ? (this.xn - 0.3) / 0.15 * 70 : 70;
          let I = this.fg.Qi.x;
          let R = this.fg.Qi.y;
          let L;
          let N;
          if (this.Aa == 2) {
            L = I - this.I.constraint.g.x;
            N = R - this.I.constraint.g.y;
            let O = Math.sqrt(L * L + N * N);
            let G = Vec2.Ia(this.I.constraint.g, w);
            G.normalize();
            if (O <= 200) {
              H *= 1 - O * 0.005;
              this.I.constraint.Vh(Vec2.Ob(G, H), a);
            }
          } else {
            L = I - this.Ma.constraint.g.x;
            N = R - this.Ma.constraint.g.y;
            let O = Math.sqrt(L * L + N * N);
            L = I - this.Na.constraint.g.x;
            N = R - this.Na.constraint.g.y;
            let G = Math.sqrt(L * L + N * N);
            let T = Vec2.Ia(this.Ma.constraint.g, w);
            T.normalize();
            let v49 = Vec2.Ia(this.Na.constraint.g, w);
            v49.normalize();
            if (O <= 200) {
              this.Ma.constraint.Vh(Vec2.Ob(T, H * (1 - O * 0.005)), a);
            }
            if (G <= 200) {
              this.Na.constraint.Vh(Vec2.Ob(v49, H * (1 - G * 0.005)), a);
            }
          }
        }
        if (this.ci[0]) {
          if (this.Aa == 2) {
            let w = Vec2.Ia(this.I.constraint.g, this.I.constraint.ha);
            if (w.Rb() > 3) {
              w.normalize();
              this.I.constraint.g = Vec2.tb(this.I.constraint.ha, Vec2.Ob(w, 3));
            }
          } else {
            let w = Vec2.Ia(this.Ma.constraint.g, this.Ma.constraint.ha);
            if (w.Rb() > 3) {
              w.normalize();
              this.Ma.constraint.g = Vec2.tb(this.Ma.constraint.ha, Vec2.Ob(w, 3));
            }
            let H = Vec2.Ia(this.Na.constraint.g, this.Na.constraint.ha);
            if (H.Rb() > 3) {
              H.normalize();
              this.Na.constraint.g = Vec2.tb(this.Na.constraint.ha, Vec2.Ob(H, 3));
            }
          }
        }
      }
      let v50 = this.Aa == 2 && this.Ni(this.da) && !this.tc;
      let v51 = this.Aa != 2 && !this.kd && this.Ni(this.xa);
      let v52 = this.Aa != 2 && !this.ld && this.Ni(this.Ja);
      let v53 = this.$c;
      let vA2 = [];
      if (this.Ve) {
        v53 = false;
      }
      if (!this.Nr) {
        let w = 0;
        let H = this.rc;
        while (w < H.length) {
          let I = H[w];
          ++w;
          if (!this.Ni(I.constraint)) {
            v53 = false;
            break;
          }
          if (this.Ve) {
            vA2.push(I);
          }
        }
      }
      let vLN022 = 0;
      while (vLN022 < vA2.length) {
        Std.remove(this.rc, vA2[vLN022++]);
      }
      if (!!this.Wr && !v50 && !v51 && !v52 && !v53) {
        this.Wr = false;
      }
      if (LevelState.box == 13 && LevelState.level == 22) {
        v52 = false;
      }
      if (this.jl != 1 && !this.Wr && (v50 || v51 || v52 || v53)) {
        let w = false;
        if (this.Aa == 2 && this.tc || this.Aa != 2 && (this.kd || this.ld) || this.Nr) {
          w = true;
        }
        if (v50) {
          this.tc = true;
        }
        if (v51) {
          this.kd = true;
        }
        if (v52) {
          this.ld = true;
        }
        if (v53) {
          this.Nr = true;
        }
        if (!this.Cm && !w) {
          this.fv();
        }
      }
      if (this.Cd == 1 && !this.tc && this.gd != null && this.I.y < LevelController.DF && this.I.x > LevelController.CF) {
        let w = this.Cd = 0;
        let H = this.Lp;
        while (w < H.length) {
          let L = H[w];
          ++w;
          if (L.Cd == 1) {
            L.show();
          }
        }
        let I = 0;
        let R = this.Kp;
        while (I < R.length) {
          let L = R[I];
          ++I;
          if (L.Cd == 1) {
            L.show();
          }
        }
      }
      this.qu.update();
      this.Zi.tickAnims(a);
      if (this.Ff != null) {
        this.Ff.update(a);
      }
      if (this.fg != null) {
        if (this.ci[0]) {
          this.fg.Qi = new Vec2(this.nk[0].x, this.nk[0].y);
        }
        this.fg.update(a);
        this.Md.update(a);
        this.Cn.update(a);
      }
    }
    render() {
      for (var a = 0, b = this.Bu; a < b.length;) {
        b[a++].M();
      }
      a = this.um;
      if (a != null) {
        a.M();
      }
      this.Ka.M();
      a = 0;
      for (b = this.Vd; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.bubbles; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.Ri; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.Dd; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.wj; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.Gh; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.Lc; a < b.length;) {
        b[a++].RM();
      }
      a = 0;
      for (b = this.Lc; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.ab; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.Af; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.ej; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.Ul; a < b.length;) {
        b[a++].M();
      }
      for (a = this.nc.iterator(); a.fb();) {
        a.next().M();
      }
      this.Ic.M();
      if (this.Ve) {
        this.fg.M();
        this.Md.M();
        this.Cn.M();
      }
      this.se.M();
      if (!this.tc) {
        if (this.I.Gc == null) {
          this.I.x = this.da.g.x;
          this.I.y = this.da.g.y;
          this.I.visible = true;
        } else {
          this.I.visible = false;
        }
        if (this.Rl && !this.sh && this.Ff != null) {
          this.Ff.x = this.I.x;
          this.Ff.y = this.I.y;
          this.Ff.M();
        }
      }
      if (this.yj != null) {
        this.yj.setX(this.I.x);
        this.yj.setY(this.I.y);
      }
      if (this.Aa != 2) {
        if (this.kd) {
          this.Ma.T.L(false);
        } else {
          this.Ma.x = this.xa.g.x;
          this.Ma.y = this.xa.g.y;
          this.Ma.M();
        }
        if (this.zj != null) {
          this.zj.setX(this.Ma.x);
          this.zj.setY(this.Ma.y);
        }
        if (this.ld) {
          this.Na.T.L(false);
        } else {
          this.Na.x = this.Ja.g.x;
          this.Na.y = this.Ja.g.y;
          this.Na.M();
        }
        if (this.Aj != null) {
          this.Aj.setX(this.Na.x);
          this.Aj.setY(this.Na.y);
        }
        this.I.visible = false;
      } else if (this.I.Gc == null) {
        this.I.visible = true;
      }
      this.I.M();
      a = 0;
      for (b = this.rc; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.Lp; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.Kp; a < b.length;) {
        b[a++].M();
      }
      this.Zi.Gd();
      this.Zi.Um();
      this.O.V.cR(this.Bb.Ab);
      this.O.V.Iq(this.Zi);
      this.O.V.WQ();
    }
  }
  LevelController.i = true;
  LevelController.s = Node;
  Object.assign(LevelController.prototype, {
    l: LevelController
  });
