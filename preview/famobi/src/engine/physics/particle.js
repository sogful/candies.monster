  class PointLink {
    constructor(a, b, c) {
      this.Cj = a;
      this.zh = b;
      this.type = c;
    }
  }
  PointLink.i = true;
  Object.assign(PointLink.prototype, {
    l: PointLink
  });
  class Particle {
    constructor() {
      this.Vn = false;
      this.Ng(1);
      this.ts();
    }
    Ng(a) {
      this.weight = a;
      this.zr = 1 / a;
      this.Kb = new Vec2(0, PhysicsConfig.wy * a);
    }
    ts() {
      this.sb = Vec2.sc();
      this.a = Vec2.sc();
      this.g = Vec2.sc();
      this.xd = Vec2.sc();
      this.ft = Vec2.sc();
    }
    Vh(a, b) {
      if (!a.TO()) {
        this.g.add(Vec2.Ob(a, b / 1));
      }
    }
  }
  Particle.i = true;
  Object.assign(Particle.prototype, {
    l: Particle
  });
  class VerletPoint extends Particle {
    constructor() {
      super();
      this.ha = new Vec2(INT32_MAX, INT32_MAX);
      this.vh = new Vec2(-1, -1);
      this.jg = [];
      this.ft = Vec2.sc();
      this.ts();
    }
    ts() {
      super.ts();
      this.ha = new Vec2(INT32_MAX, INT32_MAX);
      this.ha.x = INT32_MAX;
      this.ha.y = INT32_MAX;
      this.vD();
    }
    vD() {
      this.jg = [];
    }
    al(a, b, c) {
      this.jg.push(new PointLink(a, b, c));
    }
    mR(a) {
      this.jg.splice(a, 1);
    }
    lO(a) {
      let b = this.jg;
      let c = b.length;
      let d = 0;
      while (d < c) {
        if (b[d++].Cj == a) {
          return true;
        }
      }
      return false;
    }
    vq(a, b) {
      let c = this.jg;
      let d = c.length;
      let e = 0;
      while (e < d) {
        let f = c[e++];
        if (f.Cj == a) {
          f.zh = b;
          break;
        }
      }
    }
    lA(a, b, c) {
      let d = this.jg;
      let e = d.length;
      let f = 0;
      while (f < e) {
        let g = d[f++];
        if (g.Cj == a) {
          g.Cj = b;
          g.zh = c;
          break;
        }
      }
    }
    zh(a) {
      let b = this.jg;
      let c = b.length;
      let d = 0;
      while (d < c) {
        let e = b[d++];
        if (e.Cj == a) {
          return e.zh;
        }
      }
      return -1;
    }
    update(a) {
      if (a != 0) {
        var b = this.ft;
        var c = PhysicsConfig.current;
        if (this.Vn) {
          b.x = 0;
          b.y = 0;
        } else if (c.y != 0 || c.x != 0) {
          b.x = c.x;
          b.y = c.y;
        } else {
          b.x = this.Kb.x * this.zr;
          b.y = this.Kb.y * this.zr;
        }
        b = a / 1 * a;
        this.a.x = this.ft.x * b;
        this.a.y = this.ft.y * b;
        if (this.ha.x == INT32_MAX) {
          this.ha.x = this.g.x;
          this.ha.y = this.g.y;
        }
        this.xd.x = this.g.x - this.ha.x + this.a.x;
        this.xd.y = this.g.y - this.ha.y + this.a.y;
        if (a > 0) {
          a = 1 / a;
          this.sb.x = this.xd.x * a;
          this.sb.y = this.xd.y * a;
        }
        this.ha.x = this.g.x;
        this.ha.y = this.g.y;
        this.g.x += this.xd.x;
        this.g.y += this.xd.y;
      }
    }
    As() {
      var a = this.vh;
      let b = this.g;
      let c = this.zr;
      let d;
      let e = 0;
      let f = 0;
      if (a.x != -1) {
        b.x = a.x;
        b.y = a.y;
      } else {
        a = this.jg;
        for (var g = a.length, h = 0; h < g;) {
          var m = a[h++];
          var n = m.Cj;
          let u = n.g;
          var q = u.x - b.x;
          d = u.y - b.y;
          if (q == 0 && d == 0) {
            d = q = 1;
          }
          var p = Math.sqrt(q * q + d * d);
          var v = m.zh;
          m = m.type;
          if (m == 1) {
            if (p <= v) {
              continue;
            }
          } else if (m == 2 && p >= v) {
            continue;
          }
          m = n.vh.x == -1;
          n = n.zr;
          p = (p - v) / ((p > 1 ? p : 1) * (c + n));
          if (m) {
            e = q;
            f = d;
          }
          v = c * p;
          q *= v;
          d *= v;
          b.x += q;
          b.y += d;
          if (m) {
            q = n * p;
            u.x -= e * q;
            u.y -= f * q;
          }
        }
      }
    }
  }
  VerletPoint.i = true;
  VerletPoint.s = Particle;
  Object.assign(VerletPoint.prototype, {
    l: VerletPoint
  });
  class PhysicsConfig {
    static toggle() {
      PhysicsConfig.current.y = -PhysicsConfig.current.y;
    }
    static NO() {
      if (PhysicsConfig.current.y == PhysicsConfig.wy) {
        return PhysicsConfig.current.x == 0;
      } else {
        return false;
      }
    }
    static reset() {
      PhysicsConfig.current.x = 0;
      PhysicsConfig.current.y = PhysicsConfig.Et;
    }
  }
  PhysicsConfig.i = true;

  class SmokeEmitter extends ParticleEmitter {
    constructor(a, b) {
      super(b);
      this.S = a;
      this.wb = [];
      this.angle = 0;
      this.wn = 50;
      this.Xc = 0.5;
      this.Xv = 0.3;
      this.duration = 1.5;
      this.speed = 80;
      this.yp = 10;
    }
    free() {
      let a = 0;
      let b = this.wb;
      while (a < b.length) {
        b[a++].free();
      }
    }
    qh(a) {
      super.qh(a);
      a = new Sprite(null, Resources.Kd, Keys.hI);
      a.center();
      a.setUniformScale(0.2 + Math.random() * 0.1);
      this.S.ma(5).P(a.u);
      a.Wd(3);
      this.wb.push(a);
    }
    Kh(a, b, c) {
      a.g.add(Vec2.Ob(a.dir, c));
      super.Kh(a, b, c);
    }
    Fg(a) {
      super.Fg(a);
      let b = this.wb[a];
      this.wb.splice(a, 1);
      b.free();
    }
    M() {
      super.M();
      let a = 0;
      let b = this.ac.length;
      while (a < b) {
        var c = a++;
        let d = this.ac[c];
        c = this.wb[c];
        c.setX(d.g.x);
        c.setY(d.g.y);
        c.la(d.angle);
        c.W(d.Xc / d.Fr);
      }
    }
    update(a) {
      super.update(a);
      a = 0;
      let b = this.ac.length;
      while (a < b) {
        let c = this.ac[a++];
        c.angle = 52 + Math.atan2(c.dir.y, c.dir.x) * RAD2DEG;
      }
    }
  }
  SmokeEmitter.i = true;
  SmokeEmitter.s = ParticleEmitter;
  Object.assign(SmokeEmitter.prototype, {
    l: SmokeEmitter
  });

  class PollenEmitter extends ParticleEmitter {
    constructor(a, b) {
      super(b);
      this.S = a;
      this.wb = [];
      this.size = 0.6;
      this.wx = 0.2;
      this.angle = X.gi() * 360;
      this.wn = 15;
      this.xs = 30;
      this.Xc = 0.8;
      this.Xv = 0.3;
      this.duration = 1.5;
      this.speed = 140;
      this.yp = 35;
    }
    Qm(a) {
      super.Qm(a);
    }
    qh(a) {
      super.qh(a);
      this.angle += 360 / this.Kx;
      let b = this.size + X.Ac() * this.wx;
      let c = Keys.jj(Keys.Wp, X.xh(0, 2));
      let d = Resources.de.hc.yf(c).ec;
      a.width = d.x * b;
      a.height = d.y * b;
      a.Eq = this.Fm + this.xs * X.Ac();
      a = new Sprite(null, Resources.de, c);
      a.center();
      this.S.ma(5).P(a.u);
      this.wb.push(a);
    }
    Kh(a, b, c) {
      a.angle += a.Eq * c;
      super.Kh(a, b, c);
    }
    Fg(a) {
      super.Fg(a);
      let b = this.wb[a];
      this.wb.splice(a, 1);
      b.free();
    }
    M() {
      super.M();
      let a = 0;
      let b = this.ac.length;
      while (a < b) {
        var c = a++;
        let d = this.ac[c];
        c = this.wb[c];
        c.la(d.angle);
        c.setUniformScale(d.width / c.X.x * 0.4);
        c.setX(d.g.x);
        c.setY(d.g.y);
        c.W(d.alpha);
      }
    }
    update(a) {
      super.update(a);
      a = 0;
      let b = this.ac.length;
      while (a < b) {
        let c = this.ac[a++];
        if (c.Xc > 0) {
          if (c.Xc < c.Fr * 0.7) {
            c.alpha = c.Xc / (c.Fr * 0.7);
          }
          c.dir.x *= 0.9;
          c.dir.y *= 0.9;
          c.width *= 1.015;
          c.height *= 1.015;
        }
      }
    }
  }
  PollenEmitter.i = true;
  PollenEmitter.s = ParticleEmitter;
  Object.assign(PollenEmitter.prototype, {
    l: PollenEmitter
  });
  class DirectionalSpray extends ParticleEmitter {
    constructor(a, b) {
      super(5);
      this.S = a;
      this.angle = b;
      this.wn = 10;
      this.speed = 500;
      this.yp = 100;
      this.Xc = 0.6;
      this.size = 12;
      this.Lq = 100;
      this.aj.r = 1;
      this.aj.ue = 1;
      this.aj.b = 1;
      this.aj.a = 0.6;
      this.ei.r = 1;
      this.ei.ue = 1;
      this.ei.b = 1;
      this.ei.a = 0;
      this.wb = [];
    }
    qh(a) {
      super.qh(a);
      a = new Sprite(null, Resources.wm, Keys.VC(6 + X.xh(0, 2)));
      a.setUniformScale(0.4);
      a.center();
      a.Wd(3);
      this.S.ma(5).P(a.u);
      this.wb.push(a);
    }
    Kh(a, b, c) {
      super.Kh(a, b, c);
      a.dir.multiply(0.9);
      b = Vec2.Ob(a.dir, c);
      b.add(this.Kb);
      a.g.add(b);
    }
    Fg(a) {
      super.Fg(a);
      let b = this.wb[a];
      this.wb.splice(a, 1);
      b.free();
    }
    M() {
      super.M();
      let a = 0;
      let b = this.ac.length;
      while (a < b) {
        var c = a++;
        let d = this.ac[c];
        c = this.wb[c];
        c.setX(d.g.x);
        c.setY(d.g.y);
        c.W(d.color.a);
      }
    }
  }
  DirectionalSpray.i = true;
  DirectionalSpray.s = ParticleEmitter;
  Object.assign(DirectionalSpray.prototype, {
    l: DirectionalSpray
  });

  class SwarmManager extends GameObject {
    constructor(a) {
      super();
      this.zw = [];
      this.bD = new Container();
      a.ma(0).P(this.bD.u);
    }
    NL(a, b) {
      var c = [0.3, 0.3, 0.5, 0.5, 0.6];
      var d = c = c[MathUtil.fp(0, c.length - 1)];
      if (MathUtil.eR()) {
        c *= 1 + MathUtil.fp(0, 1) / 10;
      } else {
        d *= 1 + MathUtil.fp(0, 1) / 10;
      }
      let e = Math.min(1 - c, 1 - d);
      let f = Math.random();
      let g = new SwarmParticle();
      this.bD.appendChild(g.U);
      g.yQ = b;
      g.x = a.x;
      g.y = a.y;
      g.Ys = e + c;
      g.Zs = e + d;
      g.Hm = g.Ys * f;
      g.Im = g.Zs * f;
      g.Oq = c;
      g.Pq = d;
      g.Mq = 0.3;
      g.zx = 1;
      g.alpha = f * 0.7 + 0.3;
      this.zw.push(g);
    }
    DA(a, b, c) {
      let d = c.pb.path[a];
      b = Vec2.Ia(c.pb.path[b], d);
      c = b.Rb();
      if (!(c < EPSILON)) {
        c = Math.floor(c / 17.6);
        b.normalize();
        for (var e = 0; e <= c;) {
          var f = Vec2.tb(d, Vec2.Ob(b, e * 17.6));
          f.x += MathUtil.fp(-1.6, 1.6);
          f.y += MathUtil.fp(-1.6, 1.6);
          this.NL(f, a);
          ++e;
        }
      }
    }
    update(a) {
      super.update(a);
      let b = 0;
      let c = this.zw;
      while (b < c.length) {
        let e = c[b];
        ++b;
        var d = PathResolver.ek(e.Hm, e.Oq, 1, a);
        e.Hm = d.value;
        if (d.sk) {
          d = e.Ys;
          e.Ys = e.Oq;
          e.Oq = d;
        }
        d = PathResolver.ek(e.Im, e.Pq, 1, a);
        e.Im = d.value;
        if (d.sk) {
          d = e.Zs;
          e.Zs = e.Pq;
          e.Pq = d;
        }
        d = PathResolver.ek(e.alpha, e.Mq, 1, a);
        e.alpha = d.value;
        if (d.sk) {
          d = e.zx;
          e.zx = e.Mq;
          e.Mq = d;
        }
      }
    }
    M() {
      let a = 0;
      let b = this.zw;
      while (a < b.length) {
        let c = b[a];
        ++a;
        c.U.gS(c.x, c.y, c.Hm * 0.4, c.Im * 0.4);
        c.U.W(c.alpha);
      }
    }
  }
  SwarmManager.i = true;
  SwarmManager.s = GameObject;
  Object.assign(SwarmManager.prototype, {
    l: SwarmManager
  });
  class SwarmParticle {
    constructor() {
      this.Hm = this.Ys = this.Oq = this.Im = this.Zs = this.Pq = this.alpha = this.zx = this.Mq = 1;
      this.yQ = this.x = this.y = 0;
      this.U = new Sprite(null, Resources.Ld, Keys.JG);
      this.U.center();
    }
  }
  SwarmParticle.i = true;
  Object.assign(SwarmParticle.prototype, {
    l: SwarmParticle
  });

  class ParticleData {
    constructor() {
      this.bj = new Vec2(0, 0);
      this.g = new Vec2(0, 0);
      this.dir = new Vec2(0, 0);
      this.$s = this.fs = 0;
      this.color = new RGBA(0, 0, 0, 0);
      this.bi = new RGBA(0, 0, 0, 0);
      this.angle = this.Eq = this.Fr = this.Xc = this.size = 0;
      this.scale = this.alpha = 1;
      this.height = this.width = 0;
    }
  }
  ParticleData.i = true;
  Object.assign(ParticleData.prototype, {
    l: ParticleData
  });
  class PointWithSize {
    constructor(a, b, c) {
      this.x = a;
      this.y = b;
      this.size = c;
    }
  }
  PointWithSize.i = true;
  Object.assign(PointWithSize.prototype, {
    l: PointWithSize
  });
