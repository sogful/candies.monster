  class Gap extends Entity {
    constructor(a, b) {
      super();
      this.S = a;
      this.ae = b;
      this.Xe = [];
      this.hm = [];
    }
    BO(a, b, c, d) {
      function e(g, h) {
        return new AnimFrameRef(new Vec2(g.x, g.y), h);
      }
      this.j = new Container();
      this.S.ma(5).P(this.j.u);
      this.qo = new Sprite(null, Resources.wf, Keys.jH);
      this.qo.setUniformScale(0.4);
      this.qo.center();
      this.S.ma(0).P(this.qo.u);
      this.x = a.x;
      this.y = a.y;
      this.pC = b;
      this.Z = c;
      this.JL = d;
      this.elapsedTime = 0;
      this.isActive = false;
      b = new Vec2(0, 0);
      a = this.pC * DEG2RAD;
      c = new Vec2(0, -27.200000000000003);
      d = new Vec2(0, -33.6);
      let f = new Vec2(0, -28);
      this.Xe[0] = Vec2.tb(b, new Vec2(0, -4.4).rotate(a));
      this.Xe[1] = Vec2.tb(b, c.rotate(a));
      this.Xe[2] = Vec2.tb(b, d.rotate(a));
      this.Xe[3] = Vec2.tb(b, f.rotate(a));
      c = new Vec2(0, -43.2);
      d = new Vec2(0, -9.200000000000001);
      this.hm[0] = Vec2.tb(b, new Vec2(0, -36.4).rotate(a));
      this.hm[1] = Vec2.tb(b, c.rotate(a));
      this.hm[2] = Vec2.tb(b, d.rotate(a));
      b = new Vec2(0, 0);
      d = new Vec2(0, 5.400000000000001);
      c = new Vec2(0, -4.799999999999997);
      d.rotate(a);
      c.rotate(a);
      a = Vec2.tb(b, d);
      b = Vec2.tb(b, c);
      if (v153 == null) {
        c = new AnimTimeline();
        c.setScale(0.4, 0.4, 0, 100);
        c.Ch(0, 0, 0, 100);
        c.setScale(0.45999999999999996, 0.34, 0.05);
        c.Ch(a.x, a.y, 0.05);
        c.setScale(0.34, 0.45999999999999996, 0.1);
        c.Ch(b.x, b.y, 0.1);
        c.setScale(0.4, 0.4, 0.15);
        c.Ch(0, 0, 0.15);
        v153 = c;
      }
      this.Jz = new AnimSequence([e(this.Xe[0], 0, 100), e(this.Xe[1], 0.05, 100), e(this.Xe[2], 0.1, 100), e(this.Xe[3], 0.15)], 1);
      this.SL = new AnimSequence([e(this.hm[0], 0, 100), e(this.hm[1], 0.05, 100), e(this.hm[2], 0.1, 100)], 1);
    }
    eC(a, b) {
      this.j.appendChild(a);
      this.xf = a;
      this.da = b;
      this.Zq().L(false);
      if (this.da != null) {
        this.da.g.x = this.x + this.Xe[3].x;
        this.da.g.y = this.y + this.Xe[3].y;
        this.da.ha.x = this.da.g.x;
        this.da.ha.y = this.da.g.y;
        this.su(this.Jz);
        this.Lj().pa().play(MOUSE_ANIM_B).Be(cachedBind(this, this.Tr));
      } else {
        this.Lj().pa().play(MOUSE_ANIM_A).Be(cachedBind(this, this.Tr));
      }
      a.center();
      SoundFx.play(SoundFx.mouse_rustle);
    }
    gC() {
      this.elapsedTime = 0;
      this.isActive = false;
      this.Zq().L(false);
      if (this.da != null) {
        this.Lj().pa().play(MOUSE_ANIM_D).Be(cachedBind(this, this.Tr));
        this.su(this.SL);
      } else {
        this.Lj().pa().play(MOUSE_ANIM_C).Be(cachedBind(this, this.Tr));
      }
    }
    Lj() {
      return this.xf.nb(0);
    }
    Zq() {
      return this.xf.nb(1);
    }
    su(a) {
      this.tq = new BezierMover(this, this.da);
      this.tq.play(a);
    }
    yu(a) {
      return Vec2.nd(this.x, this.y, a.g.x, a.g.y) < this.Z;
    }
    Du(a) {
      this.da = a;
      a.Vn = true;
      a.g.x = this.x + this.Xe[3].x;
      a.g.y = this.y + this.Xe[3].y;
      a.ha.x = a.g.x;
      a.ha.y = a.g.y;
      a.xd = new Vec2(0, 0);
      a.sb = new Vec2(0, 0);
      this.Lj().Fb(Keys.oH);
      this.Qo = new SpriteAnimator(this.Lj());
      this.Qo.play(v153);
      this.su(this.Jz);
    }
    kR() {
      this.da.Vn = false;
      this.da = null;
      this.gC();
      SoundFx.play(SoundFx.mouse_tap);
    }
    yi() {
      return this.da != null;
    }
    update(a) {
      super.update(a);
      if (this.tq != null) {
        this.tq.tickAnims(a);
      }
      if (this.isActive) {
        this.elapsedTime += a;
        if (this.elapsedTime >= this.JL && (this.Qo == null || !this.Qo.Dc())) {
          this.gC();
        }
      }
    }
    M() {
      super.M();
      this.j.setX(this.x);
      this.j.setY(this.y);
      this.qo.setX(this.x);
      this.qo.setY(this.y);
      if (this.xf != null) {
        this.xf.la(this.pC);
      }
    }
    jk(a, b) {
      a = Vec2.nd(this.x, this.y, a, b);
      b = this.Qo != null && this.Qo.Dc();
      if (a < this.Z) {
        return !b;
      } else {
        return false;
      }
    }
    Tr(a) {
      switch (a) {
        case MOUSE_ANIM_A:
          this.elapsedTime = 0;
          this.isActive = true;
          if (X.ym()) {
            this.Lj().Fb(Keys.mH);
            this.Zq().L(true);
            this.Zq().pa().play(EYES_ANIM);
          }
          break;
        case MOUSE_ANIM_B:
          this.elapsedTime = 0;
          this.isActive = true;
          break;
        case MOUSE_ANIM_C:
        case MOUSE_ANIM_D:
          this.xf.remove();
          this.xf = null;
          this.ae.tN();
      }
    }
  }
  Gap.i = true;
  Gap.s = Entity;
  Object.assign(Gap.prototype, {
    l: Gap
  });
  class LighterEntity extends AnchoredEntity {
    constructor(a, b) {
      super();
      this.cC = b;
      this.vg = 0;
      var c = CandyCutAnim.Sp.w / 2;
      let d = CandyCutAnim.Sp.J / 2;
      c = this.ea = new Bounds(0 - c, 0 - d, c, d);
      this.sa = new Bounds(c.A, c.D, c.B, c.G);
      this.j = new Container();
      this.j.setUniformScale(0.4);
      a.ma(9).P(this.j.u);
      this.qc = new Sprite(this.j, Resources.Ef, Keys.QH);
      this.qc.W(0.4);
      this.qc.center();
      this.qc.setUniformScale(b * 2 / this.qc.X.x * 1.5 / 0.4);
      this.qc.Wd(3);
      new Sprite(this.j, Resources.Ef, Keys.OH).center();
      new Sprite(this.j, Resources.Ef, Keys.RH).center();
      this.Xa = new Sprite(this.j, Resources.Ef);
      this.Xa.pa().loop(FIREFLY_ANIM);
      this.Xa.center();
      this.ca = null;
      this.Gn = new BubbleAnim(a);
      this.Gc = null;
    }
    update(a) {
      super.update(a);
      this.sa.A = this.x + this.ea.A;
      this.sa.D = this.y + this.ea.D;
      this.sa.B = this.x + this.ea.B;
      this.sa.G = this.y + this.ea.G;
    }
    M() {
      super.M();
      this.x = this.constraint.g.x;
      this.y = this.constraint.g.y;
      this.j.L(this.Gc == null);
      this.j.setX(this.x);
      this.j.setY(this.y);
      this.j.la(this.rotation);
      this.Gn.setX(this.x);
      this.Gn.setY(this.y);
    }
  }
  LighterEntity.i = true;
  LighterEntity.s = AnchoredEntity;
  Object.assign(LighterEntity.prototype, {
    l: LighterEntity
  });
  class Pump extends MovingEntity {
    constructor(a) {
      super();
      this.U = new Sprite(null, Resources.wm, Keys.SH);
      this.U.center();
      this.U.setUniformScale(0.4);
      a.ma(5).P(this.U.u);
      a = Pump.Vy.w / 2;
      let b = Pump.Vy.J / 2;
      this.ea = new Bounds(0 - a, 0 - b, a, b);
      this.angle = 0;
      this.Gb = Vec2.sc();
      this.Xb = Vec2.sc();
      this.VE = this.Gp = 0;
      this.Fq = [];
    }
    dN(a) {
      a = new DirectionalSpray(a, this.angle * RAD2DEG - 90);
      let b = new Vec2(this.x + 40, this.y);
      b.$a(this.angle - Math.PI / 2, this.x, this.y);
      a.x = b.x;
      a.y = b.y;
      a.Qm(5);
      this.Fq.push(a);
    }
    Hd() {
      var a = this.ea;
      a = (a.B - a.A) / 2;
      this.Gb.x = this.x - a;
      this.Xb.x = this.x + a;
      this.Gb.y = this.Xb.y = this.y;
      this.angle = this.rotation * DEG2RAD;
      this.Gb.$a(this.angle, this.x, this.y);
      this.Xb.$a(this.angle, this.x, this.y);
    }
    update(a) {
      super.update(a);
      this.pe();
      let b = 0;
      let c = this.Fq;
      while (b < c.length) {
        let d = c[b];
        ++b;
        if (d.ac.length == 0) {
          Std.remove(this.Fq, d);
          break;
        }
        d.update(a);
      }
    }
    M() {
      super.M();
      this.U.setX(this.x);
      this.U.setY(this.y);
      this.U.la(this.rotation);
      this.U.setUniformScale(this.Dj * 0.4);
      let a = 0;
      let b = this.Fq;
      while (a < b.length) {
        b[a++].M();
      }
    }
    tg() {
      let a = this.ea;
      let b = this.ea;
      return new Vec2((a.B - a.A) * 1.2, (b.G - b.D) * 1.2);
    }
    Kj() {
      let a = new Vec2(0.8, -1.2000000000000002);
      a.rotate(this.rotation * DEG2RAD);
      return Vec2.tb(new Vec2(this.x, this.y), a);
    }
    Jg(a) {
      super.Jg(a);
      let b = new Vec2(0.8, -1.2000000000000002);
      b.rotate(this.rotation * DEG2RAD);
      super.Jg(Vec2.Ia(a, b));
    }
  }
  Pump.i = true;
  Pump.s = MovingEntity;
  Object.assign(Pump.prototype, {
    l: Pump
  });
  class Vinyl extends Entity {
    constructor(a) {
      super();
      this.S = a;
      this.j = new Container();
      a.ma(0).P(this.j.u);
      this.kg = [];
      this.ah = [];
      this.xx = -1;
      this.Do = Vec2.UP();
      this.Tc = new Sprite(this.j, Resources.Tc, Keys.RI);
      this.Tc.center();
      this.Ts = new SceneGroup();
      this.Ts.Rf(new RingDrawEffect());
      this.j.node.P(this.Ts);
      this.xp = new SceneGroup();
      this.xp.Rf(new RingDrawEffect());
      a.ma(13).P(this.xp);
      this.mF = new Sprite(this.j, Resources.Tc, Keys.Sy);
      this.mF.center();
      this.Vx = new Sprite(this.j, Resources.Tc, Keys.Sy);
      this.Vx.setScaleX(-1);
      this.Vx.center();
      this.Ux = new Sprite(this.j, Resources.Tc, Keys.Ry);
      this.Ux.center();
      this.Qp = new Sprite(this.j, Resources.Tc, Keys.Ry);
      this.Qp.setScaleX(-1);
      this.Qp.center();
      this.ij = new Sprite(this.j, Resources.Tc, Keys.Py);
      this.ij.center();
      this.ij.la(90);
      this.wt = new Sprite(this.j, Resources.Tc, Keys.Py);
      this.wt.center();
      this.wt.la(-90);
      this.Pk = new Sprite(this.j, Resources.Tc, Keys.Qy);
      this.Pk.center();
      this.Pk.la(90);
      this.Pk.L(false);
      this.Qk = new Sprite(this.j, Resources.Tc, Keys.Qy);
      this.Qk.center();
      this.Qk.la(-90);
      this.Qk.L(false);
      this.lF = new Sprite(this.j, Resources.Tc, Keys.QI);
      this.lF.center();
    }
    free() {
      this.kg = this.ah = null;
      this.j.free();
      this.S = this.j = null;
    }
    Lb(a) {
      this.size = a;
      var b = this.size / 216;
      this.j.setUniformScale(0.4);
      this.Tc.setUniformScale(b);
      this.Ux.setUniformScale(b);
      this.Qp.setScaleX(-b);
      this.Qp.setScaleY(b);
      a = b >= 0.4 ? b : 0.4;
      this.mF.setUniformScale(a);
      this.Vx.setUniformScale(-a);
      b = b >= 0.75 ? b : 0.75;
      this.ij.setUniformScale(b);
      this.wt.setUniformScale(b);
      this.Pk.setUniformScale(b);
      this.Qk.setUniformScale(b);
      this.lF.setUniformScale(1 - (1 - a) * 0.5);
      this.Fh = this.size;
      a = this.Ts.effect;
      a.Z = this.Tc.getWidth() / 2;
      a.lineWidth = b * 10;
      a = this.size / this.j.Ra - this.ij.getWidth() / 2 * 0.76;
      this.ij.setX(this.Pk.setX(-a));
      this.wt.setX(this.Qk.setX(a));
    }
    nO() {
      return !this.ij.ri();
    }
    QR(a) {
      this.ij.L(!a);
    }
    KO() {
      return this.Pk.ri();
    }
    UD(a) {
      this.Pk.L(a);
    }
    RO() {
      return this.Qk.ri();
    }
    VD(a) {
      this.Qk.L(a);
    }
    uM() {
      let a = this.ah.length;
      let b;
      let c = 0;
      while (c < a) {
        b = this.ah[c++];
        if (b != this && this.vM(b)) {
          return true;
        }
      }
      return false;
    }
    M() {
      super.M();
      this.j.setX(this.x);
      this.j.setY(this.y);
      this.j.la(this.rotation);
      this.Ux.la(-this.rotation);
      this.Qp.la(-this.rotation);
      this.Ts.Ne = this.RO() || this.KO() ? 2 : 1;
      let a = this.ah.length;
      var b;
      let c = this.ah.indexOf(this);
      for (b = 0; b < a;) {
        this.ah[b++].xp.Ne = 1;
      }
      let d = 0;
      while (d < a) {
        b = this.ah[d++];
        if (b != this && b.uM() && this.ah.indexOf(b) < c) {
          b.VM(this.x, this.y, this.Fh, b.x, b.y, b.Fh);
        }
      }
    }
    VM(a, b, c, d, e, f) {
      this.xp.Ne = 1;
      let g = Vec2.nd(a, b, d, e);
      if (!(g >= c + f) && !(c >= g + f)) {
        new Vec2(a - d, b - e).angle();
        a = this.xp;
        a.Ne = 2;
        b = a.Db;
        b.translate.x = this.x;
        b.translate.y = this.y;
        b.K = b.K & -2 | 496;
        b = a.Db;
        b.scale.x = b.scale.y = this.j.Ra;
        b.K = b.K & -2 | 500;
        a = a.effect;
        a.Z = this.Tc.getWidth() / 2;
        a.Gr = 0.2;
        a.lineWidth = this.ij.Ra * 6;
      }
    }
    vM(a) {
      if (this.x == a.x && this.y == a.y && this.size == a.size) {
        return false;
      }
      let b = this.kg.length;
      let c = 0;
      while (c < b) {
        if (a.kg.indexOf(this.kg[c++]) >= 0) {
          return true;
        }
      }
      return false;
    }
  }
  Vinyl.i = true;
  Vinyl.s = Entity;
  Object.assign(Vinyl.prototype, {
    l: Vinyl
  });
  class Sock extends MovingEntity {
    constructor(a, b) {
      super();
      this.S = a;
      this.group = b;
      this.angle = 0;
      this.Gb = new Vec2(0, 0);
      this.Xb = new Vec2(0, 0);
      this.Vc = new Vec2(0, 0);
      this.qd = new Vec2(0, 0);
      this.state = this.xr = 0;
      this.j = new Container();
      a.ma(5).P(this.j.u);
      this.ur = new Sprite(this.j, Resources.Dk, b == 0 ? Keys.My : Keys.TH);
      this.ur.setUniformScale(0.4);
      this.ur.center();
      this.ur.setY(30);
      this.ur.la(this.angle);
      this.qc = new Sprite(this.j, Resources.Dk, Keys.UH);
      this.qc.setUniformScale(0.4);
      this.qc.center();
      this.qc.tS(new Vec4(this.qc.Rg, this.qc.Sg + 15, 0, 1));
      this.qc.L(false);
    }
    Hd() {
      this.Gb.x = this.x - Sock.Yy / 2;
      this.Xb.x = this.x + Sock.Yy / 2;
      this.Gb.y = this.Xb.y = this.y;
      this.Vc.x = this.Gb.x;
      this.qd.x = this.Xb.x;
      this.Vc.y = this.qd.y = this.y + Sock.wJ;
      this.angle = this.rotation * DEG2RAD;
      this.Gb.$a(this.angle, this.x, this.y);
      this.Xb.$a(this.angle, this.x, this.y);
      this.Vc.$a(this.angle, this.x, this.y);
      this.qd.$a(this.angle, this.x, this.y);
    }
    update(a) {
      super.update(a);
      if (this.pb != null) {
        this.Hd();
      }
    }
    M() {
      if (this.qc.ri()) {
        if (!this.qc.pa().Dc(v167)) {
          this.qc.L(false);
        }
      }
      super.M();
      this.j.setX(this.x);
      this.j.setY(this.y);
      this.j.setUniformScale(this.Dj);
      this.j.la(this.rotation);
    }
    tg() {
      let a = Resources.Dk.hc.yf(Keys.My).Od;
      return new Vec2(a.w * 0.27999999999999997, a.J * 0.27999999999999997);
    }
    Kj() {
      let a = new Vec2(-1.2000000000000002, 10);
      a.rotate(this.rotation * DEG2RAD);
      return Vec2.tb(new Vec2(this.x, this.y), a);
    }
    Jg(a) {
      let b = new Vec2(-1.2000000000000002, 10);
      b.rotate(this.rotation * DEG2RAD);
      super.Jg(Vec2.Ia(a, b));
    }
  }
  Sock.i = true;
  Sock.s = MovingEntity;
  Object.assign(Sock.prototype, {
    l: Sock
  });
  class SawBlade extends MovingEntity {
    constructor(a, b, c, d, e, f) {
      super();
      this.S = a;
      this.width = d;
      this.T = f != -1 ? new Sprite(null, Resources.gl, [Keys.OG, Keys.PG, Keys.QG, Keys.SG][d - 1]) : new Sprite(null, Resources.Dd, [Keys.YH, Keys.ZH, Keys.$H, Keys.aI][d - 1]);
      this.x = b;
      this.y = c;
      a.ma(5).P(this.T.u);
      this.T.setUniformScale(0.4);
      this.T.center();
      this.T.setX(b);
      this.T.setY(c);
      this.T.la(e);
      this.Gb = Vec2.sc();
      this.Xb = Vec2.sc();
      this.Vc = Vec2.sc();
      this.qd = Vec2.sc();
      this.ce = false;
      this.FC = this.TC = this.IB = 0;
      this.wl = false;
      this.tf = 0;
      if (f > 0) {
        this.Gg = new SawBladeButton(a, b, c, f);
        this.Gg.sw = cachedBind(this, this.Rr);
      }
      this.Us = false;
      this.wQ = this.rotation = e;
      this.oS(f);
      this.Hd();
      this.ht = -1;
      this.ws = null;
      this.vr = this.xB = 0;
    }
    Hd() {
      let a = this.ce ? this.width - 160 : this.T.X.x * 0.4;
      a /= 2;
      this.Gb.x = this.x - a;
      this.Xb.x = this.x + a;
      this.Gb.y = this.Xb.y = this.y - 5;
      this.Vc.x = this.Gb.x;
      this.qd.x = this.Xb.x;
      this.Vc.y = this.qd.y = this.y + 5;
      this.angle = this.rotation * DEG2RAD;
      this.Gb.$a(this.angle, this.x, this.y);
      this.Xb.$a(this.angle, this.x, this.y);
      this.Vc.$a(this.angle, this.x, this.y);
      this.qd.$a(this.angle, this.x, this.y);
    }
    dT() {
      this.wl = true;
      this.T.pa().loop(v170);
      this.tf = this.TC;
      SoundFx.play(SoundFx.electric, true);
      this.T.Jm();
    }
    bF() {
      this.wl = false;
      this.tf = this.FC;
      this.T.pa().stop();
      this.T.Uf(Resources.ce, Keys.iH);
      this.T.center();
      SoundFx.stop(SoundFx.electric);
    }
    update(a) {
      super.update(a);
      if (this.pb != null) {
        this.Hd();
      }
      if (this.ce) {
        if (this.wl) {
          this.tf = PathResolver.dk(this.tf, 0, 1, a);
          if (this.tf == 0) {
            this.bF();
          }
        } else {
          this.tf = PathResolver.dk(this.tf, 0, 1, a);
          if (this.tf == 0) {
            this.dT();
          }
        }
      }
      var b = this.Gg;
      if (b != null) {
        b.update(a);
      }
      if (this.ws != null) {
        this.Pw += a;
        b = Math.min(1, this.Pw / this.ws);
        let c = Easing.poly(100)(b);
        let d = this.yR;
        this.rotation = d + (this.zR - d) * c;
        this.Hd();
        if (b == 1) {
          this.ws = null;
        }
      }
      if (this.Md != null) {
        this.Md.update(a);
      }
      this.vr += a;
      if (this.vr > 1) {
        this.xB = this.vr = 0;
      }
    }
    oS(a) {
      this.TE = a;
    }
    BR() {
      this.Us = !this.Us;
      let a = this.wQ + (this.Us ? 90 : 0);
      this.Pw = 0;
      this.ws = Math.abs(a - this.rotation) / 90 * 0.3;
      this.yR = this.rotation;
      this.zR = a;
      this.Gg.U.setScaleX(-this.Gg.U.Ra);
    }
    DQ() {
      if (!this.ce) {
        this.Md = new AnimatedNineSlice(this.S, Vec2.nd(this.Gb.x, this.Gb.y, this.Xb.x, this.Xb.y), Vec2.nd(this.Gb.x, this.Gb.y, this.Vc.x, this.Vc.y) * 4, 3, true);
        this.Md.j.center();
        this.Md.j.la(this.rotation);
      }
    }
    JS() {
      if (this.Md != null) {
        this.Md.free();
        this.Md = null;
      }
    }
    Rr(a) {
      if (a == 0 && this.OC != null) {
        this.OC(this.TE);
      }
      if (this.Us) {
        SoundFx.play(SoundFx.spike_rotate_in);
      } else {
        SoundFx.play(SoundFx.spike_rotate_out);
      }
    }
    M() {
      super.M();
      this.T.setX(this.x);
      this.T.setY(this.y);
      this.T.la(this.rotation);
      if (this.Gg != null) {
        this.Gg.U.la(this.rotation);
      }
      if (this.Md != null) {
        this.Md.j.setX(this.x);
        this.Md.j.setY(this.y);
        this.Md.j.la(this.rotation);
      }
    }
  }
  SawBlade.i = true;
  SawBlade.s = MovingEntity;
  Object.assign(SawBlade.prototype, {
    l: SawBlade
  });
  class SteamGenerator extends MovingEntity {
    constructor(a) {
      super();
      this.S = a;
      this.wh = [];
    }
    AO(a, b, c) {
      this.x = a;
      this.y = b;
      this.rotation = c;
      this.uc = 0;
      this.ge = new HashMap();
      this.Ee = 0;
      this.j = new Container();
      this.S.ma(5).P(this.j.u);
      this.Jp = new Sprite(this.j, Resources.Kk, Keys.FI);
      this.Jp.center();
      this.Jp.setY(27);
      this.Jp.setUniformScale(0.4);
      this.Op = new Sprite(this.j, Resources.Kk, Keys.GI);
      this.Op.setUniformScale(0.4);
      this.Op.center();
      this.Op.setY(27);
      this.st = this.rt = 0;
      this.AE = new Container(null, this.j);
      this.BE = new Container(null, this.j);
      this.Hz();
    }
    VA() {
      let a = 0;
      switch (this.Ee) {
        case 0:
          a = 32.9;
          break;
        case 1:
          a = 94;
          break;
        case 2:
          a = 141;
      }
      return a * 1.2;
    }
    BN() {
      let a = this.VA();
      return a += Math.sin(this.uc * 6);
    }
    M() {
      super.M();
      this.j.setX(this.x);
      this.j.setY(this.y);
      this.j.la(this.rotation);
      this.Op.la(this.rt);
      this.j.setUniformScale(this.Dj);
    }
    update(a) {
      super.update(a);
      for (var b = 0, c = this.wh.length; b < c;) {
        if (this.wh[b].T == null) {
          --c;
          if (c > 0) {
            this.wh[b] = this.wh[this.wh.length - 1];
          }
          this.wh.pop();
        } else {
          ++b;
        }
      }
      b = 0;
      for (c = this.wh; b < c.length;) {
        c[b++].update(a);
      }
      this.uc += a;
      this.rt += (this.st - this.rt) * 0.05;
      if (this.Sl()) {
        for (b = this.ge.keys(); b.fb();) {
          c = b.next();
          let d = this.ge.J[c];
          d.bt += a;
          if (d.bt >= 0.5) {
            if (Vec2.nd(d.yr.x, d.yr.y, d.Sn.x, d.Sn.y) < 1) {
              this.ww();
            }
            this.ge.remove(c);
          }
        }
      }
    }
    aO() {
      let a = new Vec2(this.x, this.y);
      if (this.Sl()) {
        return a;
      }
      let b = new Vec2(0, 27);
      b.rotate(this.rotation * DEG2RAD);
      return Vec2.tb(a, b);
    }
    jk(a, b, c) {
      let d = this.aO();
      if (Vec2.Ia(new Vec2(a, b), d).Rb() < 30) {
        if (this.Sl()) {
          this.ge.J[c] = new Triple3(new Vec2(a, b), new Vec2(a, b), 0);
        } else {
          this.ww();
          return true;
        }
      }
      return false;
    }
    rQ(a, b, c) {
      if (this.ge.J.hasOwnProperty(c)) {
        this.ge.J[c].Sn = new Vec2(a, b);
      }
      return false;
    }
    tQ(a) {
      if (this.ge.J.hasOwnProperty(a)) {
        let b = this.ge.J[a];
        if (b.bt <= 0.5 && Vec2.nd(b.yr.x, b.yr.y, b.Sn.x, b.Sn.y) <= 1) {
          this.ww();
        }
        this.ge.remove(a);
      }
      return false;
    }
    ww() {
      let a = 0;
      switch (this.Ee) {
        case 0:
          this.Ee++;
          a = 0;
          SoundFx.play(SoundFx.steam_start_2);
          break;
        case 1:
          this.Ee++;
          a = 0;
          SoundFx.play(SoundFx.steam_start);
          break;
        case 2:
          this.Ee = 0;
          a = 1;
          SoundFx.play(SoundFx.steam_end);
      }
      this.Hz();
      switch (a) {
        case 0:
          this.st += 180;
          break;
        case 1:
          this.st = 0;
      }
    }
    Hz() {
      for (var a = this.uc = 0, b = this.wh; a < b.length;) {
        b[a++].iN();
      }
      if (this.Ee != 3) {
        a = 7;
        if (this.Ee == 1) {
          a = 14;
        }
        if (this.Ee == 2) {
          a = 20;
        }
        b = 0;
        for (var c = a; b < c;) {
          let e = b++;
          var d = null;
          switch (e % 3) {
            case 0:
              d = PARTICLE_1_ANIM;
              break;
            case 1:
              d = PARTICLE_2_ANIM;
              break;
            case 2:
              d = PARTICLE_3_ANIM;
          }
          let f = -this.VA();
          f *= 1 + X.Ac() * 0.1;
          if (this.Ee == 1 && (e % 3 == 1 || e % 3 == 2)) {
            f *= 0.95;
          }
          if (this.Ee == 2 && (e % 3 == 1 || e % 3 == 2)) {
            f *= 0.94;
          }
          let g = 1;
          if (e % 3 == 0) {
            g = 0;
          } else if (e % 3 == 1) {
            g = this.Ee;
          } else if (e % 3 == 2) {
            g = -this.Ee;
          }
          let h = new AnimTimeline();
          h.Ch(5, 0, 0, 100);
          h.Ch(5 + g, f, 0.6);
          h.vc(0.4, 0);
          h.vc(0.6000000000000001, 0.6);
          d = new SteamPuff(e * 0.6 / a, d, h);
          this.wh.push(d);
          (e % 3 == 0 ? this.AE : this.BE).appendChild(d.T);
        }
      }
    }
    Jg(a) {
      this.Jp.setY(3);
      this.Op.setY(3);
      this.AE.setY(-27);
      this.BE.setY(-27);
      super.Jg(a);
    }
    Yq() {
      return this.Jp.getWidth() * 0.3;
    }
    tg() {
      return new Vec2(40, 56);
    }
  }
  SteamGenerator.i = true;
  SteamGenerator.s = MovingEntity;
  Object.assign(SteamGenerator.prototype, {
    l: SteamGenerator
  });
  class Transporter extends Entity {
    constructor(a, b, c) {
      super();
      this.width = a;
      this.height = b;
      new Vec2(0, 0);
      this.j = new Container();
      this.je = [];
      this.offset = 0;
      this.$r = Resources.Rc.hc.yf(DIGIT_FRAME_4).ec.x;
      switch (c) {
        case -1:
          a = DIGIT_FRAME_6;
          break;
        case 1:
          a = DIGIT_FRAME_5;
          break;
        default:
          a = DIGIT_FRAME_4;
      }
      this.xw = a;
    }
    M() {
      super.M();
      var a = this.$r * 0.4;
      if (this.je[0] == null) {
        this.je[0] = new Sprite(this.j, Resources.Rc, this.xw);
      }
      this.je[0].L(true);
      var b = 1;
      var c = this.je[0];
      var d = Math.max(this.offset - (this.offset / a | 0) * a, 0);
      c.setX(0);
      c.setScaleX(d / this.$r);
      for (c.setScaleY(this.height / c.X.y); d + a <= this.width;) {
        if (this.je[b] == null) {
          this.je[b] = new Sprite(this.j, Resources.Rc, this.xw);
        }
        this.je[b].L(true);
        c = this.je[b++];
        c.setScaleX(0.4);
        c.setScaleY(this.height / c.X.y);
        c.setX(d);
        d += c.getWidth();
      }
      a = this.width - d;
      if (this.je[b] == null) {
        this.je[b] = new Sprite(this.j, Resources.Rc, this.xw);
      }
      this.je[b].L(true);
      c = this.je[b++];
      c.setX(this.width - a);
      c.setScaleX(a / this.$r);
      c.setScaleY(this.height / c.X.y);
      for (c = this.je.length; b < c;) {
        this.je[b++].L(false);
      }
    }
    move(a) {
      this.offset += a;
      for (a = this.$r * 0.4; this.offset > this.width;) {
        this.offset -= a;
      }
      while (this.offset < 0) {
        this.offset += a;
      }
    }
  }
  Transporter.i = true;
  Transporter.s = Entity;
  Object.assign(Transporter.prototype, {
    l: Transporter
  });
  class TutText extends TimedFader {
    constructor(a) {
      a = new Sprite(null, Resources.eT, Keys.jj(Keys.lK, a));
      a.setUniformScale(0.4);
      super(a);
      this.zi = 0;
    }
    Ji(a) {
      this.rotation = a.angle ?? 0;
      let b = a.path;
      let c = LevelController.mn;
      if (b != null) {
        let d = PathResolver.Ey;
        if (b.charAt(0) == "R") {
          d = Math.round(Numeric.parseInt(Std.substr(b, 2, null)) * 3 / 2 + 1);
        }
        a = new PathState(d, a.moveSpeed * c, a.rotateSpeed);
        a.angle = this.rotation;
        a.$D(b, this.x, this.y);
        this.YD(a);
        a.start();
      }
    }
    update(a) {
      if (this.Cd == 2) {
        this.time += a;
        switch (this.state) {
          case 1:
            a = Math.min(this.time / 1, 1);
            this.T.W(a);
            if (a == 1) {
              this.Ie = this.x;
              this.setState(2);
            }
            break;
          case 2:
            a = Math.min(this.time / 1, 1);
            this.x = this.Ie + (this.Ie + (LevelController.kK + 40) * WorldScale.scale) * a;
            if (a == 1) {
              this.setState(3);
            }
            break;
          case 3:
            a = Math.min(this.time / 0.5, 1);
            this.T.W(1 - a);
            if (a == 1) {
              if (++this.zi == 2) {
                this.T.L(false);
                this.setState(0);
              } else {
                this.x = this.Ie;
                this.setState(1);
              }
            }
        }
      } else {
        if (this.pb != null) {
          this.pb.update(a);
          this.x = this.pb.g.x;
          this.y = this.pb.g.y;
          this.rotation = this.pb.angle;
        }
        super.update(a);
      }
    }
  }
  TutText.i = true;
  TutText.s = TimedFader;
  Object.assign(TutText.prototype, {
    l: TutText
  });

  class Bouncer extends MovingEntity {
    constructor(a, b, c, d, e) {
      super();
      this.angle = 0;
      this.Gb = Vec2.sc();
      this.Xb = Vec2.sc();
      this.Vc = Vec2.sc();
      this.qd = Vec2.sc();
      this.ct = -1;
      this.xo = new Vec2(0, 0);
      this.Ck = false;
      this.j = new Container();
      a.ma(5).P(this.j.u);
      this.T = new Sprite(this.j);
      this.T.Uf(Resources.fd, d == 1 ? Keys.TG : Keys.VG);
      this.T.setUniformScale(0.4);
      this.T.center();
      this.rotation = e;
      this.x = b;
      this.y = c;
      this.w = d;
      this.es = new Vec2(b, c);
      a = (d == 1 ? 194 : 302) * 0.4 / 2;
      d = (d == 1 ? 127 : 123) * 0.4 / 2;
      d = this.ea = new Bounds(0 - a, 0 - d, a, d);
      this.sa = new Bounds(d.A, d.D, d.B, d.G);
      this.Hd();
    }
    oA() {
      this.es.x = this.x;
      this.es.y = this.y;
    }
    BQ() {
      let a = this.w == 1 ? X1_ANIM : X2_ANIM;
      this.T.pa().play(a);
    }
    Hd() {
      var a = this.ea;
      a = a.B - a.A;
      this.Gb.x = this.x - a / 2;
      this.Xb.x = this.x + a / 2;
      this.Gb.y = this.Xb.y = this.y - vLN10 / 2;
      this.Vc.x = this.Gb.x;
      this.qd.x = this.Xb.x;
      this.Vc.y = this.qd.y = this.y + vLN10 / 2;
      this.angle = this.rotation * DEG2RAD;
      this.Gb.$a(this.angle, this.x, this.y);
      this.Xb.$a(this.angle, this.x, this.y);
      this.Vc.$a(this.angle, this.x, this.y);
      this.qd.$a(this.angle, this.x, this.y);
    }
    update(a) {
      super.update(a);
      if (this.pb != null) {
        this.Hd();
      }
    }
    M() {
      super.M();
      this.j.setX(this.x);
      this.j.setY(this.y);
      this.T.setUniformScale(this.Dj * 0.4);
      this.j.la(this.rotation);
    }
    tg() {
      let a = this.ea;
      let b = this.ea;
      return new Vec2(a.B - a.A, b.G - b.D);
    }
    Jg(a) {
      let b = new Vec2(this.x, this.y);
      if (!(Vec2.Ia(a, b).io() < 0.000001)) {
        if (this.ct >= 0.001 && this.ct <= 0.1) {
          this.xo = Vec2.bq(Vec2.Ia(a, b), this.ct);
          if (this.xo.io() > 40000) {
            this.xo = Vec2.Ob(Vec2.cq(this.xo), 200);
          }
        } else {
          this.xo = new Vec2(0, 0);
        }
        this.ct = 0;
        this.es = b.Zb();
        this.x = a.x;
        this.y = a.y;
        this.Hd();
      }
    }
    NC() {
      this.oA();
    }
  }
  Bouncer.i = true;
  Bouncer.s = MovingEntity;
  Object.assign(Bouncer.prototype, {
    l: Bouncer
  });
  class Spider extends Node {
    constructor() {
      super();
      this.U = new Sprite(null, Resources.mc, Keys.VH);
      this.U.setUniformScale(0.4);
      this.U.center();
      this.cl = this.Ym = this.by = this.xu = this.state = 0;
    }
    dispose() {
      super.dispose();
      this.U.free();
    }
    start() {
      let a = this;
      this.U.pa().play(v168).Be(function () {
        a.U.pa().play(v169);
        a.state = 1;
      });
    }
    bM() {
      this.xu = 1;
      this.y = this.U.getY();
      this.U.pa().stop();
      this.U.Fb(Keys.WH);
      this.cl = X.BA(3);
      this.time = 0;
    }
    cc() {
      this.by = 1;
      this.y = this.U.getY();
      this.U.pa().stop();
      this.U.Fb(Keys.XH);
      this.U.la(0);
      this.time = 0;
    }
    update(a) {
      super.update(a);
      a = this.parent;
      switch (this.xu) {
        case 1:
          var b = this.jb(0.5);
          this.U.setY(this.y - Easing.poly(100)(b) * 50);
          let c = this.U;
          c.la(c.Zd + this.cl);
          if (b == 1) {
            this.xu++;
            this.time = 0;
          }
          break;
        case 2:
          b = this.U;
          b.setY(b.getY() + this.Ym);
          b = this.U;
          b.la(b.Zd + this.cl);
          this.Ym += 0.4;
          if (this.time > 1.5) {
            b = this.U;
            b.W(b.Uc * 0.9);
          }
          if (this.time > 2) {
            this.dispose();
          }
      }
      switch (this.by) {
        case 1:
          b = this.jb(0.5);
          this.U.setY(this.y - Easing.poly(100)(b) * 50);
          a.I.x = this.U.getX();
          a.I.y = this.U.getY() - 15;
          a.I.M();
          if (b == 1) {
            this.by++;
            this.time = 0;
          }
          break;
        case 2:
          a = this.U;
          a.setY(a.getY() + this.Ym);
          this.Ym += 0.4;
          a = this.parent;
          a.I.x = this.U.getX();
          a.I.y = this.U.getY() - 15;
          a.I.M();
          if (this.time > 1.5) {
            a = this.U;
            a.W(a.Uc * 0.9);
          }
          if (this.time > 2) {
            this.dispose();
          }
      }
    }
  }
  Spider.i = true;
  Spider.s = Node;
  Object.assign(Spider.prototype, {
    l: Spider
  });

  class BouncerFace extends Bouncer {
    constructor(a, b, c, d, e) {
      super(a.S, b, c, d, e);
      this.de = a;
      this.alpha = 1;
      this.state = 0;
    }
    Io() {
      if (this.state != 1) {
        this.state = 1;
        this.time = 0;
      }
    }
    Jo() {
      if (this.state != -1) {
        this.state = -1;
        this.time = 0;
      }
    }
    Pl() {
      return this.state < 0;
    }
    mu() {
      function a(c, d) {
        c = new Sprite(d, Resources.de, Keys.jj(Keys.Wp, c));
        c.center();
        return c;
      }
      this.Hu = new Container(null, this.j);
      this.Hu.Es();
      this.pA = new Container(null, this.j);
      this.fc = [];
      if (BouncerFace.An == null) {
        BouncerFace.An = AnimTimeline.parse("0,s.27<x-34.<y7.33<,.35,s.22>x-35.>y6.33>,.7,s.16<x-36.<y5.33<,1.04,s.22>x-35.>y6.33>,1.4,s.27x-34.y7.33");
      }
      var b = new SpriteAnimator(a(2, this.Hu));
      b.loop(BouncerFace.An);
      this.fc.push(b);
      if (BouncerFace.zn == null) {
        BouncerFace.zn = AnimTimeline.parse("0,s.36<x32.9<y6.61<,.39,s.32>x31.9>y5.61>,.78,s.27<x30.9<y4.61<,1.17,s.32>x31.9>y5.61>,1.56,s.36x32.9y6.61");
      }
      b = new SpriteAnimator(a(2, this.Hu));
      b.loop(BouncerFace.zn);
      this.fc.push(b);
      if (BouncerFace.Xh == null) {
        BouncerFace.Xh = AnimTimeline.parse("0,s.44<x23<y26<,.45,s.4>x22>y25>,.9,s.36<x21<y24<,1.35,s.4>x22>y25>,1.8,s.44x23y26");
      }
      b = new SpriteAnimator(a(3, this.pA));
      b.loop(BouncerFace.Xh);
      this.fc.push(b);
      if (BouncerFace.Wh == null) {
        BouncerFace.Wh = AnimTimeline.parse("0,s.44<x-23<y28<,.5,s.4>x-22>y27>,1,s.36<x-21<y26<,1.5,s.4>x-22>y27>,2,s.44x-23y28");
      }
      b = new SpriteAnimator(a(4, this.pA));
      b.loop(BouncerFace.Wh);
      this.fc.push(b);
    }
    free() {
      this.j.free();
      this.T = this.j = null;
    }
    update(a) {
      super.update(a);
      if (this.state > 0) {
        this.time += a;
        let b = Math.min(1, this.time / 0.36);
        this.alpha = b;
        if (b == 1) {
          this.state = 0;
        }
      }
      if (this.state < 0) {
        this.time += a;
        a = Math.min(1, this.time / 0.16);
        this.alpha = 1 - a;
        if (a == 1) {
          this.state = 0;
          this.de.tD();
        }
      }
    }
    M() {
      super.M();
      this.j.W(this.alpha);
    }
  }
  BouncerFace.i = true;
  BouncerFace.s = Bouncer;
  Object.assign(BouncerFace.prototype, {
    l: BouncerFace
  });
  class ToggleButton extends TouchableEntity {
    constructor(a, b, c) {
      super();
      this.x = b;
      this.y = c;
      this.U = new Sprite(null, Resources.Kb, Keys.Ky);
      this.U.setUniformScale(0.4);
      this.U.center();
      this.U.setX(b);
      this.U.setY(c);
      this.Z = 40;
      a.ma(5).P(this.U.u);
      this.Sv = false;
    }
    Ql(a, b) {
      return PointInCircle.Cx(a, b, this.x, this.y, this.Z);
    }
    toggle() {
      this.Sv = !this.Sv;
      this.U.Fb(this.Sv ? Keys.rH : Keys.Ky);
    }
    M() {
      super.M();
      this.U.setX(this.x);
      this.U.setY(this.y);
    }
  }
  ToggleButton.i = true;
  ToggleButton.s = TouchableEntity;
  Object.assign(ToggleButton.prototype, {
    l: ToggleButton
  });

  class LanternEye extends MovingEntity {
    constructor(a) {
      super();
      this.S = a;
      this.active = false;
      this.lp = this.Jn = this.gp = this.ao = 0;
      this.Yu = null;
    }
    zO(a, b) {
      LanternEye.Eh = null;
      this.x = a;
      this.y = b;
      this.Xj = 0;
      if (v159 == null) {
        a = v159 = new AnimTimeline();
        a.setScale(0.5599999999999999, 0.4, 0, 100);
        a.La(0.7, 0);
        a.setScale(0.42000000000000004, 0.52, 0.5);
        a.La(1, 0.5);
      }
      this.j = new Container();
      this.S.ma(5).P(this.j.u);
      this.Gj = new Sprite(this.j, Resources.Ai, Keys.GH);
      this.Gj.center();
      this.Gj.W(0);
      this.Yu = new SpriteAnimator(this.Gj);
      this.wr = new Sprite(this.j, Resources.Ai, Keys.IH);
      this.wr.center();
      this.wr.setUniformScale(0.4);
      this.Zk = new Sprite(this.j, Resources.Ai, Keys.HH);
      this.Zk.center();
      this.Zk.setUniformScale(0.4);
      this.Zk.W(0);
      this.Zk.setY(1);
      this.I = new Sprite(this.j, Resources.Ai, [Keys.JH, Keys.KH, Keys.LH, Keys.MH, Keys.NH][Save.me]);
      this.I.center();
      this.I.setUniformScale(0.4);
      this.I.W(0);
      if (v160 == null) {
        a = v160 = new AnimTimeline();
        a.La(0, 0);
        a.La(1, 0.2);
        a.gq(0.4, 0.4, 0);
        a.gq(0.4, 0.32000000000000006, 0.07);
        a.gq(0.34, 0.42000000000000004, 0.05);
        a.gq(0.4, 0.4, 0.05);
        a.lu(-4, 0);
        a.lu(0, 0.1);
        a.lu(-1, 0.05);
        a = v161 = new AnimTimeline();
        a.tn(0.4, 0.35, -100);
        a.tn(0.37200000000000005, 0.35, 100);
        a.tn(0.34800000000000003, 0.35, -100);
        a.tn(0.37200000000000005, 0.35, 100);
        a.tn(0.4, 0);
        a = v162 = new AnimTimeline();
        a.La(1, 0);
        a.La(0.6, 0.06);
        a.La(0, 0.1);
        a.setScale(0.4, 0.4, 0);
        a.setScale(0.45999999999999996, 0.32000000000000006, 0.06);
        a.setScale(0.4, 0.4, 0.1);
        a.Ch(0, 0, 0, 100);
        a.Ch(0, -4, 0.06, -100);
        a.Ch(0, 4, 0.1);
      }
      this.Au = new SpriteAnimator(this.I);
    }
    update(a) {
      this.ha = new Vec2(this.x, this.y);
      super.update(a);
      if (LanternEye.Eh != null) {
        LanternEye.Eh.g = new Vec2(this.x, this.y);
        LanternEye.Eh.ha = new Vec2(this.x, this.y);
        if (this.Xj != 1) {
          this.Xj = 1;
        }
      }
      if (this.gp > 0) {
        this.gp -= a;
        if (this.gp < 0) {
          LanternEye.Eh.Vn = false;
          LanternEye.Eh.g = new Vec2(this.x, this.y);
          LanternEye.Eh.ha = this.ha.Zb();
          LanternEye.Eh = null;
        }
      }
      if (this.ao > 0) {
        this.ao -= a;
        if (this.ao <= 0) {
          this.Yu.loop(v159, true);
        }
      }
      if (this.Jn > 0) {
        this.Jn -= a;
        if (this.Jn <= 0) {
          this.Au.loop(v161);
        }
      }
      if (this.lp > 0) {
        this.lp -= a;
        if (this.lp <= 0) {
          this.Xj = 0;
        }
      }
    }
    M() {
      super.M();
      this.j.setX(this.x);
      this.j.setY(this.y);
    }
    jk(a, b) {
      if (this.Xj == 1 && Vec2.nd(a, b, this.x, this.y) < 35 && LanternEye.Eh != null) {
        this.DO();
        return true;
      } else {
        return false;
      }
    }
    jA(a) {
      SoundFx.play(SoundFx.lantern_teleport_in);
      LanternEye.Eh = a;
      a.Vn = true;
      a.g = a.ha = new Vec2(this.x, this.y);
      a = this.S.Ul;
      let b = 0;
      while (b < a.length) {
        let c = a[b];
        ++b;
        c.Xj = 1;
        c.wr.tween().alpha(0, 0.3);
        c.Zk.tween().alpha(1, 0.3);
        c.Au.play(v160);
        c.Gj.setScaleX(0.5599999999999999);
        c.Gj.setScaleY(0.4);
        c.Gj.W(0.7);
        c.ao = Math.random() * 0.4;
        c.Jn = 0.2;
      }
    }
    DO() {
      SoundFx.play(SoundFx.lantern_teleport_out);
      let a = this.S.Ul;
      let b = 0;
      while (b < a.length) {
        let c = a[b];
        ++b;
        c.wr.tween().alpha(1, 0.3);
        c.Zk.tween().alpha(0, 0.3);
        c.Au.play(v162);
        c.Yu.stop();
        c.Gj.W(0);
        c.lp = 0.5;
        c.Xj = 0;
      }
      this.gp = 0.01;
    }
  }
  LanternEye.i = true;
  LanternEye.s = MovingEntity;
  Object.assign(LanternEye.prototype, {
    l: LanternEye
  });
  class SawBladeButton extends TouchableEntity {
    constructor(a, b, c, d) {
      super();
      this.x = b;
      this.y = c;
      this.OE = d;
      this.U = new Sprite(null, Resources.gl, this.YA());
      this.U.setUniformScale(0.4);
      this.U.center();
      this.U.setX(b);
      this.U.setY(c);
      this.Z = 20;
      a.ma(5).P(this.U.u);
    }
    Ak(a) {
      super.Ak(a);
      this.U.Fb(this.YA());
    }
    YA() {
      if (this.state == 0) {
        if (this.OE == 1) {
          return Keys.KG;
        } else {
          return Keys.MG;
        }
      } else if (this.OE == 1) {
        return Keys.LG;
      } else {
        return Keys.NG;
      }
    }
    Ql(a, b) {
      return PointInCircle.Cx(a, b, this.x, this.y, this.Z);
    }
  }
  SawBladeButton.i = true;
  SawBladeButton.s = TouchableEntity;
  Object.assign(SawBladeButton.prototype, {
    l: SawBladeButton
  });
  class ConveyorBelt extends Entity {
    constructor(a) {
      super();
      this.S = a;
      this.kF = 10;
      this.offset = 0;
      this.id = -1;
      this.ze = false;
      this.Pr = this.ys = this.Pe = 0;
      this.dir = new Vec2(0, 0);
      this.active = false;
      this.jm = -1;
      this.ha = new Vec2(0, 0);
      this.Hp = null;
      this.$d = new OrderedMap();
      this.pq = [];
      this.node = new Container();
      a.ma(4).P(this.node.u);
      this.j = new Container();
      this.node.appendChild(this.j);
    }
    update(a) {
      super.update(a);
      if (!this.ze) {
        this.Pe = a * this.kF * 10;
        this.offset += this.Pe;
        this.offset = this.$v(this.offset, this.width);
      }
      this.active = Math.abs(this.Pe) > 0.001;
      if (this.ze && this.active) {
        this.Pr += Math.abs(this.Pe);
        if (this.Pr >= 15) {
          this.OQ();
          this.Pr = 0;
        }
      }
      this.hN();
      let b = null;
      let c = null;
      var d = this.$d;
      for (var e = d.keys(); e.fb();) {
        var f = e.next();
        var g = d.get(f);
        if (g.Jj) {
          continue;
        }
        let A = g.offset + this.Pe;
        let D = true;
        if (A >= this.width) {
          A -= this.width;
        } else if (A <= 0) {
          A += this.width;
        } else {
          D = false;
        }
        var h = f.tg();
        var m = f.Kj();
        var n = new Vec2(h.x * this.dir.x, h.y * this.dir.y).Rb() / 2;
        var q = 1;
        var p = A;
        if (A < n) {
          q = 0.5 + A * 0.5 / n;
          b = f;
          p = n * q;
        } else if (this.width - A < n) {
          q = 0.5 + (this.width - A) * 0.5 / n;
          c = f;
          p = this.width - n * q;
        }
        n = this.$d;
        let B = n.keys();
        while (B.fb()) {
          var v = B.next();
          var u = n.get(v);
          if (v != f && !u.Jj && q == 1) {
            u = u.offset - g.offset;
            if (Vec2.tb(h, v.tg()).io() * 0.25 > u * u) {
              if (Math.abs(u) < 0.001) {
                v = this.pq.indexOf(v) - this.pq.indexOf(v);
                u = (v > 0 ? 1 : v < 0 ? -1 : 0) * 600;
              } else if (Math.abs(u) < 600) {
                u = (u > 0 ? 1 : u < 0 ? -1 : 0) * 600;
              }
              A -= u * a;
            }
          }
        }
        f.NR(new Vec2(q, q));
        h = new Vec2(this.x + this.dir.x * p - m.x, this.y + this.dir.y * p - m.y);
        if (g.kA) {
          p = new Vec2(this.dir.y, -this.dir.x);
          m = Vec2.yz(h, p) / this.dir.Rb();
          p = new Vec2(p.x * m, p.y * m);
          m = a * 800;
          if (p.io() >= m * m) {
            q = p.Rb();
            p.multiply((q - m) / q);
          } else {
            g.kA = false;
          }
          h.Ax(p);
          f.Jg(Vec2.tb(f.Kj(), h));
        } else {
          f.Jg(Vec2.tb(new Vec2(this.x, this.y), Vec2.Ob(this.dir, p)));
        }
        g.tC = A;
        if (D) {
          f.NC();
          SoundFx.play(SoundFx.transporter_drop);
        }
      }
      this.Hp.move(this.Pe);
      for (d = this.$d.iterator(); d.fb();) {
        e = d.next();
        e.offset = this.$v(e.tC, this.width);
      }
      if (this.ze) {
        this.Pe = 0;
      }
      if (this.jm == -1) {
        if (b != null && c != null) {
          d = this.$d;
          e = d.keys();
          while (e.fb()) {
            f = e.next();
            g = d.get(f);
            if (!g.Jj) {
              if (f == b) {
                g.offset += a * 1500;
              }
              if (f == c) {
                g.offset -= a * 1500;
              }
            }
          }
        } else if (b != null) {
          this.Pe = a * 1500;
        } else if (c != null) {
          this.Pe = a * -1500;
        }
      }
    }
    M() {
      this.j.setX(this.x);
      this.j.setY(this.y);
      this.j.setPivot(0, this.height / 2);
      this.j.setOrigin(0, this.height / 2);
      this.j.la(this.rotation);
      this.Hp.M();
    }
    gt(a, b, c) {
      let d = false;
      if (!this.ze) {
        return false;
      }
      a = this.ut(new Vec2(a, b));
      if (a.x >= 0 && a.x <= this.width && -this.height * 0.5 <= a.y && a.y <= this.height * 0.5) {
        this.jm = c;
        this.ha.Pb(a);
        d = true;
      }
      return d;
    }
    Mx(a, b, c) {
      a = false;
      if (!this.ze) {
        return false;
      }
      if (this.jm == c) {
        this.jm = -1;
        this.Pe = 0;
        for (c = this.$d.keys(); c.fb();) {
          a = c.next();
          if (this.$d.J[a.jf].Jj) {
            this.$d.remove(a);
          }
        }
        a = true;
      }
      return a;
    }
    Lx(a, b, c) {
      let d = false;
      if (this.S.jr != -1 || !Application.instance.hd().zo(0) || !this.ze) {
        return false;
      }
      if (this.jm == c) {
        a = this.ut(new Vec2(a, b));
        this.Pe = a.x - this.ha.x;
        this.offset += this.Pe;
        this.offset = this.$v(this.offset, this.width);
        this.ha.Pb(a);
        d = true;
      }
      return d;
    }
    contains(a) {
      a = this.ut(a);
      if (a.x >= 0 && a.x <= this.width && -this.height * 0.5 <= a.y) {
        return a.y <= this.height * 0.5;
      } else {
        return false;
      }
    }
    ut(a) {
      var b = this.ys - Math.PI * 0.5;
      let c = new Vec2(this.dir.x, this.dir.y);
      b = new Vec2(Math.cos(b), Math.sin(b));
      return new Vec2(c.x * (a.x - this.x) + c.y * (a.y - this.y), b.x * (a.x - this.x) + b.y * (a.y - this.y));
    }
    pM(a, b) {
      a = this.ut(a);
      return !(a.x < -b) && !(a.x > this.width + b) && !(a.y < -this.height * 0.5 - b) && !(a.y > this.height * 0.5 + b);
    }
    bind(a) {
      this.XL(a);
    }
    gT(a) {
      let b = this.$d;
      let c = b.keys();
      while (c.fb()) {
        let d = c.next();
        let e = b.get(d);
        if (d == a) {
          e.Jj = true;
          d.lx(-1);
          break;
        }
      }
      a.lx(-1);
    }
    Mv(a) {
      return this.$d.J.Wk[a.jf] != null;
    }
    remove(a) {
      this.$d.remove(a);
    }
    GO(a) {
      a = this.$d.J[a.jf];
      if (a != null) {
        return a.Jj;
      } else {
        return false;
      }
    }
    isActive() {
      return this.active;
    }
    $v(a, b) {
      let c = b - 0;
      if (a > b) {
        a -= c;
      }
      if (a < 0) {
        a += c;
      }
      return a;
    }
    XL(a) {
      var b = a.Kj();
      b = new Vec2(b.x - this.x, b.y - this.y);
      this.$d.set(a, new ConveyorItem(Math.max(Math.min(b.x * this.dir.x + b.y * this.dir.y, this.width), 0)));
      this.pq.push(a);
      a.lx(this.id);
    }
    xO(a, b, c, d, e, f, g, h) {
      this.jm = -1;
      this.id = a;
      this.x = b;
      this.y = c;
      this.width = d;
      this.height = e;
      this.rotation = f;
      this.ze = g;
      this.ys = f * DEG2RAD;
      this.dir = new Vec2(Math.cos(this.ys), Math.sin(this.ys));
      this.kF = h;
      this.node = new Container();
      a = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_2);
      a.setScaleX(d / a.X.x);
      a.setScaleY((e - 10) / a.getHeight());
      a = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_0);
      a.setScaleX(0.4);
      a.setScaleY((e - 10) / a.getHeight());
      a.setX(-6);
      a.setY(5);
      a = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_0);
      a.setScaleX(0.4);
      a.setScaleY((e - 10) / a.getHeight());
      a.setX(d - a.getWidth() + 6);
      a.setY(5);
      a = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_3);
      a.setScaleX(d / a.getWidth());
      a.setScaleY(-0.4);
      a.setY(a.getHeight());
      a = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_3);
      a.setScaleX(d / a.getWidth());
      a.setScaleY(0.4);
      a.setY(e - a.getHeight());
      a = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_1);
      a.setUniformScale(0.4);
      a.setX(-6);
      a.setY(e - a.getHeight());
      a = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_1);
      a.setScaleX(0.4);
      a.setScaleY(-0.4);
      a.setX(-6);
      a.setY(a.getHeight());
      a = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_1);
      a.setUniformScale(-0.4);
      a.setX(d + 6);
      a.setY(a.getHeight());
      a = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_1);
      a.setScaleX(-0.4);
      a.setScaleY(0.4);
      a.setX(d + 6);
      a.setY(e - a.getHeight());
      a = 0;
      if (!g) {
        a = h > 0 ? 1 : -1;
      }
      this.Hp = new Transporter(d - 2, e - 10, a);
      this.Hp.j.setY(5);
      this.j.appendChild(this.Hp.j);
      g = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_7);
      g.setScaleX(0.4);
      g.setScaleY((e - 10) / g.X.y);
      g.setY(5);
      g = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_7);
      g.setScaleX(-0.4);
      g.setScaleY((e - 10) / g.X.y);
      g.setX(d);
      g.setY(5);
    }
    hN() {
      let a = [];
      var b = this.$d;
      for (var c = b.keys(); c.fb();) {
        let d = c.next();
        if (b.get(d).Jj && !this.contains(d.Kj())) {
          a.push(d);
        }
      }
      for (b = 0; b < a.length;) {
        c = a[b];
        ++b;
        this.$d.remove(c);
        Std.remove(this.pq, c);
      }
    }
    OQ() {
      SoundFx.play([1057, 1056, 1055, 1054][X.xh(0, 3)]);
    }
    static create(a, b, c, d, e, f, g, h, m) {
      a = new ConveyorBelt(a);
      a.xO(b, c, d, e, f, g, h, m);
      return a;
    }
  }
  ConveyorBelt.i = true;
  ConveyorBelt.s = Entity;
  Object.assign(ConveyorBelt.prototype, {
    l: ConveyorBelt
  });

  class SteamPuff {
    constructor(a, b, c) {
      this.state = 0;
      this.time = a;
      this.Xa = b;
      this.track = c;
      this.T = new Sprite(null, Resources.Kk);
      this.T.L(false);
      this.Uv = new SpriteAnimator(this.T);
    }
    iN() {
      if (this.state != 2) {
        this.state = 2;
      }
    }
    update(a) {
      switch (this.state) {
        case 0:
          this.time -= a;
          if (this.time > 0) {
            break;
          }
          this.T.Fb(this.Xa.data[0]);
          this.T.pa().play(this.Xa);
          this.T.L(true);
          this.T.center();
          this.Uv.loop(this.track);
          this.state = 1;
          this.time = 0;
          break;
        case 1:
          this.time += a;
          if (this.time >= 0.6) {
            this.T.pa().stop();
            this.Uv.stop();
            this.time = this.state = 0;
          }
          break;
        case 2:
          a = this.T;
          a.W(a.Uc * 0.95);
          if (this.T.Uc < 0.05) {
            this.T.free();
            this.Uv.dispose();
            this.T = this.track = this.Xa = null;
            this.state = 3;
          }
      }
    }
  }
  SteamPuff.i = true;
  Object.assign(SteamPuff.prototype, {
    l: SteamPuff
  });
  class ConveyorItem {
    constructor(a) {
      this.Jj = false;
      this.kA = true;
      this.tC = this.offset = a;
      this.index = ConveyorItem.zL++;
    }
  }
  ConveyorItem.i = true;
  Object.assign(ConveyorItem.prototype, {
    l: ConveyorItem
  });

  class ConveyorBeltMgr {
    constructor(a) {
      this.ge = new HashMap();
      this.Dw = false;
      this.list = [];
      this.S = a;
    }
    count() {
      return this.list.length;
    }
    bind(a) {
      let b = 0;
      let c = this.list;
      while (b < c.length) {
        let d = c[b];
        ++b;
        if (d.contains(new Vec2(a.x, a.y))) {
          d.bind(a);
        }
      }
    }
    push(a) {
      this.list.push(a);
    }
    iterator() {
      return new ArrayIter(this.list);
    }
    fl(a) {
      let b = 0;
      while (b < a.length) {
        this.bind(a[b++]);
      }
    }
    oM(a) {
      var b = null;
      let c = [];
      for (var d = this.iterator(); d.fb();) {
        var e = d.next();
        if (e.pM(a.Kj(), a.Yq())) {
          c.push(e);
        }
        if (e.Mv(a)) {
          b = e;
        }
      }
      if (b != null && b.ze) {
        for (d = 0; d < c.length;) {
          e = c[d];
          ++d;
          if (e.ze && e.isActive()) {
            this.rD(e, a);
            return;
          }
        }
        if (b.ze) {
          for (b = 0; b < c.length;) {
            d = c[b];
            ++b;
            if (!d.ze) {
              this.rD(d, a);
            }
          }
        }
      }
    }
    nl(a) {
      let b = 0;
      while (b < a.length) {
        this.oM(a[b++]);
      }
    }
    remove(a) {
      let b = 0;
      let c = this.list;
      while (b < c.length) {
        c[b++].remove(a);
      }
    }
    qD() {
      var a = this.count() - 1;
      let b = a;
      while (a >= 0) {
        if (this.list[a].ze && this.list[a].isActive()) {
          let c = a;
          while (c < b) {
            this.EE(c, c + 1);
            ++c;
          }
          --b;
        }
        --a;
      }
      this.SP();
    }
    update(a) {
      let b = 0;
      let c = this.list;
      while (b < c.length) {
        c[b++].update(a);
      }
      if (this.Dw) {
        this.qD();
        this.Dw = false;
      }
    }
    sR() {
      this.Dw = true;
    }
    gt(a, b, c) {
      let d = this.count() - 1;
      while (d >= 0) {
        let e = this.list[d];
        if (e != null && e.gt(a, b, c)) {
          this.ge.J[c] = new Vec2(a, b);
          return true;
        }
        --d;
      }
      return false;
    }
    Mx(a, b, c) {
      let d = this.count() - 1;
      while (d >= 0) {
        let e = this.list[d];
        if (e != null && e.Mx(a, b, c)) {
          this.ge.remove(c);
          return true;
        }
        --d;
      }
      return false;
    }
    Lx(a, b, c) {
      var d = this.ge.J[c];
      if (d != null) {
        var e = Vec2.Ia(new Vec2(a, b), d);
        if (e.io() < 4) {
          return false;
        }
        e = Vec2.cq(e);
        let f = -1;
        let g = null;
        let h = 0;
        let m = this.list;
        while (h < m.length) {
          let n = m[h];
          ++h;
          if (n.contains(d)) {
            let q = Math.abs(Vec2.yz(e, n.dir));
            if (q >= f) {
              f = q;
              g = n;
            }
          }
        }
        if (g != null) {
          g.gt(d.x, d.y, c);
        }
        this.ge.remove(c);
      }
      for (d = this.count() - 1; d >= 0;) {
        if (this.list[d].Lx(a, b, c)) {
          this.sR();
          return true;
        }
        --d;
      }
      return false;
    }
    rD(a, b) {
      if (!a.Mv(b) || a.GO(b)) {
        for (var c = 0, d = this.list; c < d.length;) {
          let e = d[c];
          ++c;
          if (e.Mv(b)) {
            e.gT(b);
          }
        }
        a.bind(b);
        SoundFx.play(SoundFx.transporter_move);
      }
    }
    SP() {
      var a = this.count() - 1;
      let b = a;
      while (a >= 0) {
        if (!this.list[a].ze) {
          let c = a;
          while (c < b) {
            this.EE(c, c + 1);
            ++c;
          }
          --b;
        }
        --a;
      }
    }
    EE(a, b) {
      let c = this.list[a];
      this.list[a] = this.list[b];
      this.list[b] = c;
      this.S.ma(4).NS(a, b);
    }
  }
  ConveyorBeltMgr.i = true;
  Object.assign(ConveyorBeltMgr.prototype, {
    l: ConveyorBeltMgr
  });
