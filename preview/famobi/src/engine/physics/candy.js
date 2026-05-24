  class Candy extends MovingEntity {
    constructor(a) {
      super();
      this.S = a;
      this.kb = null;
      this.Zf = false;
      this.Xm = -1;
      this.Er = Vec2.sc();
      this.Hf = 0;
      this.jw = false;
      this.So = 0;
      this.nh = this.Sd = null;
      this.dm = this.gm = this.im = 0;
      this.Hh = this.ve = false;
      this.mc = null;
      this.Gk = 0;
      this.po = this.Zx = this.Ps = false;
      this.gs = 0.8;
      this.Z = 0;
    }
    XN(a, b, c) {
      a = Vec2.Ia(a, c);
      return (Vec2.Ia(b, c).km() - a.km()) * RAD2DEG;
    }
    kO(a, b) {
      this.Er.x = a;
      this.Er.y = b;
    }
    jO(a) {
      SoundFx.play(SoundFx.wheel);
      let b = this.XN(this.Er, a, new Vec2(this.x, this.y));
      if (b > 180) {
        b -= 360;
      } else if (b < -180) {
        b += 360;
      }
      var c = this.yt;
      c.la(c.Zd + b);
      c = this.ay;
      c.la(c.Zd + b);
      c = this.$x;
      c.la(c.Zd + b);
      b = b > 0 ? Math.min(Math.max(1, b), 2.25) : Math.max(Math.min(-1, b), -2.25);
      if (this.kb != null) {
        if (b > 0) {
          if (this.kb.Rb() < 660) {
            this.kb.dc(b);
          }
        } else if (b != 0 && this.kb.za.length > 3) {
          this.kb.xR(-b);
        }
        this.Zx = true;
      }
      this.Er.Pb(a);
    }
    update(a) {
      super.update(a);
      if (this.po) {
        this.gs -= a * 1.5;
        if (this.gs <= 0) {
          this.Z = -1;
          this.po = false;
        }
      }
      if (this.Ld != null) {
        let b = Vec2.Ia(this.pb.path[this.pb.Xf], this.pb.g);
        let c = 0;
        if (Math.abs(b.x) > 15) {
          c = b.x > 0 ? 10 : -10;
        }
        this.Ld.la(PathResolver.dk(this.Ld.Zd, c, 60, a));
      }
      if (this.Zf && this.Zx && this.kb != null) {
        a = this.kb.Rb() * 0.7;
        if (a == 0) {
          this.yt.setUniformScale(0.001);
        } else {
          this.yt.setUniformScale(Math.max(0, Math.min(1.2, 1 - a / 784)) * 0.4);
        }
      }
    }
    rT(a) {
      if (this.ve && this.Ps) {
        this.Ps = false;
        this.Hh = true;
        SoundFx.play(SoundFx.spider_activate);
        this.mc.start();
      }
      if (this.ve && this.Hh) {
        if (this.mc.state != 0) {
          this.Gk += a * 46.800000000000004;
        }
        a = 0;
        let c = false;
        if (this.kb != null) {
          var b = this.kb.Tu;
          let d = b.length;
          let e = 0;
          while (e < d) {
            let f = e++;
            let g = b[f];
            let h = b[f + 1];
            let m = Math.max(28, g.sf(h));
            if (this.Gk >= a && (this.Gk < a + m || f > d - 3)) {
              b = Vec2.Ia(h, g);
              b.multiply((this.Gk - a) / m);
              this.mc.U.setX(g.x + b.x);
              this.mc.U.setY(g.y + b.y);
              if (f > d - 3) {
                c = true;
              }
              if (this.mc.state != 0) {
                this.mc.U.la(b.km() * RAD2DEG + 270);
              }
              break;
            } else {
              a += m;
            }
          }
        }
        if (c) {
          this.Gk = -1;
        }
      }
    }
    RM() {
      if (this.Hf > 0) {
        this.back.L(false);
        this.Sd.L(true);
      } else {
        this.back.setX(this.x);
        this.back.setY(this.y);
        this.back.L(true);
        if (this.Sd != null) {
          this.Sd.L(false);
        }
      }
      if (this.Z != -1 || this.po) {
        this.YM(this.x, this.y, this.Z != -1 ? this.Z : this.gD);
      }
    }
    YM(a, b, c) {
      this.Yh.color.x = 0.2;
      this.Yh.color.y = 0.5;
      this.Yh.color.z = 0.9;
      this.Yh.color.w = this.gs;
      let d = this.Yh.C;
      d.x = a;
      d.y = b;
      this.Yh.Z = c;
    }
    M() {
      if (this.Zf) {
        this.$x.L(this.Xm != -1);
        this.ay.L(this.Xm == -1);
      }
      if (this.Ld != null) {
        this.Ld.setX(this.x);
        this.Ld.setY(this.y);
      }
      if (this.kb != null) {
        this.kb.M();
      }
      if (this.Hf <= 0) {
        this.front.setX(this.x);
        this.front.setY(this.y);
        this.front.L(true);
      } else {
        this.front.L(false);
        if (this.im != -1) {
          this.nh.Fb(Keys.BH);
        } else {
          this.nh.Fb(Keys.Ly);
        }
        this.nh.setX(this.x);
        this.nh.setY(this.y);
      }
    }
    eE(a) {
      this.kb = a;
      this.gD = this.Z;
      this.Z = -1;
      if (this.ve) {
        this.Ps = true;
      }
    }
    setRadius(a) {
      this.gD = this.Z;
      this.Z = a;
      var b = this.S.ma(3);
      var c = this.S.ma(8);
      if (a == -1 || a == -2) {
        a = X.ym() ? [Keys.uH, Keys.vH] : [Keys.zH, Keys.AH];
        this.back = new Sprite(null, Resources.ph, a[0]);
        this.back.setUniformScale(0.4);
        this.back.center();
        this.front = new Sprite(null, Resources.ph, a[1]);
        this.front.center();
        this.front.setUniformScale(0.4);
        b.P(this.back.u);
        c.P(this.front.u);
      } else {
        this.back = new Sprite(null, Resources.ph, Keys.sH);
        this.back.center();
        this.back.setUniformScale(0.4);
        this.front = new Sprite(null, Resources.ph, Keys.tH);
        this.front.center();
        this.front.setUniformScale(0.5);
        b.P(this.back.u);
        c.P(this.front.u);
        this.po = false;
        this.Yh = new DashedCircleEffect();
        this.xq = new SceneGroup();
        this.xq.Rf(this.Yh);
        c.P(this.xq);
      }
      let d = this;
      if (this.Zf) {
        b = function (e) {
          e = new Sprite(null, Resources.ph, e);
          e.center();
          e.setX(d.x);
          e.setY(d.y);
          e.setUniformScale(0.4);
          return e;
        };
        c = b(Keys.DH);
        this.S.ma(3).P(c.u);
        this.yt = b(Keys.EH);
        this.S.ma(8).P(this.yt.u);
        this.$x = b(Keys.CH);
        this.S.ma(8).P(this.$x.u);
        this.ay = b(Keys.FH);
        this.S.ma(8).P(this.ay.u);
        this.Zx = true;
      }
    }
    WR(a, b, c) {
      this.Hf = a;
      this.jw = b;
      this.So = c;
      if (this.Hf > 0) {
        this.Sd = new Container();
        a = new Sprite(this.Sd, Resources.ph, Keys.wH);
        a.setX(-63);
        new Sprite(this.Sd, Resources.ph, Keys.yH).setX(this.Hf / 0.4 - 13);
        b = new Sprite(this.Sd, Resources.ph, Keys.xH);
        b.setX(-63 + a.getWidth());
        b.px(this.Hf / 0.4 - 13);
        this.Sd.setUniformScale(0.4);
        this.Sd.center();
        this.S.ma(5).P(this.Sd.u);
        this.nh = new Sprite(null, Resources.ph, Keys.Ly);
        this.nh.center();
        this.nh.setUniformScale(0.4);
        this.S.ma(8).P(this.nh.u);
        if (this.jw) {
          this.gm = this.y - this.So;
          this.dm = this.y + (this.Hf - this.So);
          a = (this.gm + this.dm) / 2;
          this.Sd.setX(this.x);
          this.Sd.setY(a);
          this.Sd.la(90);
          this.nh.la(90);
        } else {
          this.gm = this.x - this.So;
          this.dm = this.x + (this.Hf - this.So);
          this.Sd.setX((this.gm + this.dm) / 2);
          this.Sd.setY(this.y);
        }
      }
      this.im = -1;
    }
    KR() {
      this.Ld = new Container();
      this.Ld.setUniformScale(0.3076923076923077);
      var a = new Sprite(this.Ld, Resources.Ld, Keys.GG);
      a.center();
      a.setX(a.getX() - 6);
      a.setY(a.getY() - 54);
      this.S.ma(8).P(this.Ld.u);
      a = new Sprite(this.Ld, Resources.Ld, Keys.HG);
      a.center();
      a.setX(-6);
      a.setY(-54);
      a.pa().loop(BEE_ANIM);
      a.pa().Cw();
    }
    lS(a) {
      this.ve = a;
      this.Hh = this.Ps = false;
      if (a) {
        this.mc = new Spider();
        this.mc.U.setX(this.x);
        this.mc.U.setY(this.y);
        this.S.oa(this.mc);
        this.S.ma(10).P(this.mc.U.u);
      }
    }
    Qu() {
      this.kb = null;
    }
  }
  Candy.i = true;
  Candy.s = MovingEntity;
  Object.assign(Candy.prototype, {
    l: Candy
  });
  class CandyVariant extends Candy {
    constructor(a) {
      super(a.S);
      this.de = a;
      this.fc = [];
    }
    Pl() {
      return this.state < 0;
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
    mu() {
      function a(d) {
        d = new Sprite(b.Cb, Resources.de, Keys.jj(Keys.Wp, d));
        d.center();
        return d;
      }
      this.Cb = new Container();
      this.S.ma(5).P(this.Cb.u);
      let b = this;
      if (CandyVariant.Yz == null) {
        CandyVariant.Yz = AnimTimeline.parse("0,s.17<x-26<y3<,.65,s.18>x-25>y2>,1.3,s.2<x-24<y1<,1.95,s.18>x-25>y2>,2.6,s.17x-26y3");
      }
      var c = new SpriteAnimator(a(1));
      c.loop(CandyVariant.Yz);
      this.fc.push(c);
      if (CandyVariant.Xh == null) {
        CandyVariant.Xh = AnimTimeline.parse("0,s.36<x23<y14<,.45,s.32>x22>y13>,.9,s.27<x21<y12<,1.35,s.32>x22>y13>,1.8,s.36x23y14");
      }
      c = new SpriteAnimator(a(2));
      c.loop(CandyVariant.Xh);
      this.fc.push(c);
      if (CandyVariant.Wh == null) {
        CandyVariant.Wh = AnimTimeline.parse("0,s.44<x-3<y25<,.5,s.4>x-2>y24>,1,s.36<x-1<y23<,1.5,s.4>x-2>y24>,2,s.44x-3y25");
      }
      c = new SpriteAnimator(a(4));
      c.loop(CandyVariant.Wh);
      this.fc.push(c);
    }
    free() {
      if (this.kb != null) {
        this.kb.Gw(0);
        this.kb.free();
      }
      this.Qu();
      this.Cb.free();
      this.Cb = null;
      this.back.free();
      this.front.free();
      this.xq.free();
      this.front = this.back = this.S = this.xq = null;
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
      if (this.state < 0 && this.state != -2) {
        this.time += a;
        a = Math.min(1, this.time / 0.16);
        this.alpha = 1 - a;
        if (a == 1) {
          this.state = -2;
          this.de.wD();
        }
      }
    }
    M() {
      super.M();
      this.Cb.setX(this.x);
      this.Cb.setY(this.y);
      this.Cb.W(this.alpha);
      this.back.W(this.alpha);
      this.front.W(this.alpha);
      this.Yh.color.w = this.alpha;
    }
  }
  CandyVariant.i = true;
  CandyVariant.s = Candy;
  Object.assign(CandyVariant.prototype, {
    l: CandyVariant
  });

  class CandyCutAnim extends AnchoredEntity {
    constructor(a) {
      super();
      this.S = a;
      var b = CandyCutAnim.Sp.w;
      var c = b / 2;
      let d = CandyCutAnim.Sp.J / 2;
      c = this.ea = new Bounds(0 - c, 0 - d, c, d);
      this.sa = new Bounds(c.A, c.D, c.B, c.G);
      this.j = new Container();
      a.ma(9).P(this.j.u);
      a = new Sprite(null, Resources.I, Keys.cH);
      a.center();
      this.j.appendChild(a);
      b /= a.X.x;
      b *= a.X.x / CandyCutAnim.gy.w;
      a.setUniformScale(b);
      a = new Sprite(null, Resources.I, Keys.dH);
      a.center();
      a.setUniformScale(b);
      this.j.appendChild(a);
      a = new Sprite(null, Resources.I, Keys.eH);
      a.center();
      a.setUniformScale(b);
      this.j.appendChild(a);
      a = new Sprite(null, Resources.I, v155.data[0]);
      a.center();
      a.setUniformScale(b);
      this.j.appendChild(a);
      this.j.setUniformScale(0.71);
      this.oe = true;
    }
    CQ() {
      if (this.j != null) {
        var a = this.j.nb(3);
        a.L(true);
        a.pa().play(v155).Be(function () {
          a.L(false);
        });
      }
    }
    XC() {
      if (this.j != null) {
        var a = this.j.nb(3);
        a.L(true);
        a.W(1);
        a.pa().play(v156);
        a.tween().alpha(0, 0.2, null, null, function () {
          a.L(false);
        });
      }
    }
    free() {
      this.j.free();
      this.j = null;
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
      if (this.j != null) {
        if (this.oe) {
          this.j.setX(this.x);
          this.j.setY(this.y);
        }
        this.j.la(this.rotation);
        this.j.L(this.visible);
      }
    }
  }
  CandyCutAnim.i = true;
  CandyCutAnim.s = AnchoredEntity;
  Object.assign(CandyCutAnim.prototype, {
    l: CandyCutAnim
  });
  class CandyShatterParticles extends ParticleEmitter {
    constructor(a, b) {
      super(b);
      this.S = a;
      this.duration = 2;
      this.Kb.x = 0;
      this.Kb.y = 500;
      this.angle = -90;
      this.wn = 50;
      this.speed = 150;
      this.yp = 70;
      this.HE = this.lD = 1;
      this.Xc = 2;
      this.size = 1;
      this.Lq = 100;
      this.Fm = 0;
      this.xs = 600;
      this.wb = [];
    }
    qh(a) {
      super.qh(a);
      a.Eq = DEG2RAD * (this.Fm + this.xs * X.Ac());
      a = new Sprite(null, Resources.I, Keys.jj("", X.xh(3, 7)));
      a.center();
      a.setUniformScale(this.size * 0.4);
      this.S.ma(5).P(a.u);
      this.wb.push(a);
    }
    Kh(a, b, c) {
      a.angle += a.Eq * c;
      super.Kh(a, b, c);
    }
    Fg(a) {
      super.Fg(a);
      this.wb.splice(a, 1);
    }
    M() {
      super.M();
      let a = 0;
      let b = this.ac.length;
      while (a < b) {
        var c = a++;
        let d = this.ac[c];
        c = this.wb[c];
        c.la(d.angle * RAD2DEG);
        c.setX(d.g.x);
        c.setY(d.g.y);
      }
    }
  }
  CandyShatterParticles.i = true;
  CandyShatterParticles.s = ParticleEmitter;
  Object.assign(CandyShatterParticles.prototype, {
    l: CandyShatterParticles
  });
  class CandyPiece extends AnchoredEntity {
    constructor(a, b) {
      super();
      this.S = a;
      this.T = new Sprite(null, Resources.I, b);
      this.T.center();
      this.T.setUniformScale(0.284);
      a.ma(9).P(this.T.u);
      a = CandyPiece.ky.w / 2;
      b = CandyPiece.ky.J / 2;
      a = this.ea = new Bounds(0 - a, 0 - b, a, b);
      this.sa = new Bounds(a.A, a.D, a.B, a.G);
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
      if (this.T != null) {
        this.T.setX(this.x);
        this.T.setY(this.y);
        this.T.la(this.rotation);
      }
    }
  }
  CandyPiece.i = true;
  CandyPiece.s = AnchoredEntity;
  Object.assign(CandyPiece.prototype, {
    l: CandyPiece
  });

  class BubbleAnim {
    constructor(a) {
      this.S = a;
      this.T = new Sprite();
      this.T.L(false);
    }
    setX(a) {
      this.T.setX(a);
      if (this.Cb != null) {
        this.Cb.j.setX(a);
      }
      return a;
    }
    setY(a) {
      this.T.setY(a);
      if (this.Cb != null) {
        this.Cb.j.setY(a);
      }
    }
    oh() {
      this.T.remove();
      if (this.Cb != null) {
        this.Cb.j.remove();
      }
    }
    show() {
      this.T.Uf(Resources.ca, Keys.XG);
      this.T.center();
      this.T.setUniformScale(0.4);
      if (this.T.u.parent == null) {
        this.S.ma(9).P(this.T.u);
      }
      this.T.pa().loop(BubbleAnim.uF);
      this.T.L(true);
    }
    yS() {
      if (this.Cb != null && this.Cb.j.node.parent == null) {
        this.S.ma(9).P(this.Cb.j.u);
      }
    }
  }
  BubbleAnim.i = true;
  Object.assign(BubbleAnim.prototype, {
    l: BubbleAnim
  });
