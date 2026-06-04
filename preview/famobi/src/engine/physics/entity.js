  class GameObject {
    constructor() {
      this.alpha = 1;
      this.rotation = 0;
      this.Hm = this.Im = 1;
      this.x = this.y = 0;
    }
    update() {}
    M() {}
  }
  GameObject.i = true;
  Object.assign(GameObject.prototype, {
    l: GameObject
  });
  class Entity {
    constructor() {
      this.Dj = 1;
      this.x = this.y = this.rotation = 0;
      this.visible = true;
      this.sa = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
    }
    pe() {
      this.sa.A = this.x + this.ea.A;
      this.sa.D = this.y + this.ea.D;
      this.sa.B = this.x + this.ea.B;
      this.sa.G = this.y + this.ea.G;
    }
    M() {}
    YD(a) {
      this.pb = a;
    }
    update(a) {
      if (this.pb != null) {
        this.pb.update(a);
        this.x = this.pb.g.x;
        this.y = this.pb.g.y;
        this.rotation = this.pb.angle;
      }
    }
    RQ(a, b) {
      let c = this.sa;
      let d = this.sa;
      return Rect.lk(a, b, this.sa.A, this.sa.D, c.B - c.A, d.G - d.D);
    }
    iR(a, b, c, d) {
      let e = this.sa.A;
      let f = this.sa.D;
      let g = this.ea;
      let h = this.ea;
      return Rect.Ew(a, b, c, d, e, f, e + (g.B - g.A), f + (h.G - h.D));
    }
    static yo(a, b) {
      return AABBTest.test(a.sa, b.sa);
    }
  }
  Entity.i = true;
  Object.assign(Entity.prototype, {
    l: Entity
  });
  class AnchoredEntity extends Entity {
    constructor() {
      super();
      this.constraint = null;
      this.vg = 0;
      this.NB = false;
      this.Gc = null;
      this.Rw = 0;
      this.Gn = this.ca = null;
    }
  }
  AnchoredEntity.i = true;
  AnchoredEntity.s = Entity;
  Object.assign(AnchoredEntity.prototype, {
    l: AnchoredEntity
  });
  class ParticleEmitter extends GameObject {
    constructor(a) {
      super();
      this.y = this.x = 0;
      this.Im = this.Hm = 1;
      this.rotation = 0;
      this.gj = [];
      this.Zh = [];
      this.Kx = a;
      this.ac = [];
      this.active = false;
      this.Kq = this.duration = 0;
      this.Kb = new Vec2(0, 0);
      this.cD = new Vec2(0, 0);
      this.Xv = this.Xc = this.wx = this.size = this.lD = this.fs = this.HE = this.$s = this.yp = this.speed = this.wn = this.angle = 0;
      this.aj = new RGBA(0, 0, 0, 0);
      this.Ws = new RGBA(0, 0, 0, 0);
      this.ei = new RGBA(0, 0, 0, 0);
      this.Nq = new RGBA(0, 0, 0, 0);
      this.xs = this.Fm = this.xl = this.Lq = 0;
      this.gj = [];
      this.Zh = [];
      this.Ki = 0;
      this.HC = null;
    }
    Fz() {
      if (this.ac.length != this.Kx) {
        var a = new ParticleData();
        this.qh(a);
        this.ac.push(a);
      }
    }
    qh(a) {
      a.g.x = this.x + this.cD.x * X.Ac();
      a.g.y = this.y + this.cD.y * X.Ac();
      a.bj.Pb(a.g);
      var b = (this.angle + this.wn * X.Ac()) * DEG2RAD;
      b = new Vec2(Math.cos(b), Math.sin(b));
      b.multiply(this.speed + this.yp * X.Ac());
      a.dir = b;
      a.fs = this.fs + this.lD * X.Ac();
      a.$s = this.$s + this.HE * X.Ac();
      a.Fr = a.Xc = this.Xc + this.Xv * X.Ac();
      b = new RGBA(this.aj.r + this.Ws.r * X.Ac(), this.aj.ue + this.Ws.ue * X.Ac(), this.aj.b + this.Ws.b * X.Ac(), this.aj.a + this.Ws.a * X.Ac());
      let c = new RGBA(this.ei.r + this.Nq.r * X.Ac(), this.ei.ue + this.Nq.ue * X.Ac(), this.ei.b + this.Nq.b * X.Ac(), this.ei.a + this.Nq.a * X.Ac());
      a.color = b;
      a.bi.r = (c.r - b.r) / a.Xc;
      a.bi.ue = (c.ue - b.ue) / a.Xc;
      a.bi.b = (c.b - b.b) / a.Xc;
      a.bi.a = (c.a - b.a) / a.Xc;
      a.size = this.size + this.wx * X.Ac();
    }
    update(a) {
      super.update(a);
      if (this.HC == null || this.ac.length != 0 || this.active) {
        if (this.active && this.Lq != 0) {
          var b = 1 / this.Lq;
          for (this.xl += a; this.ac.length < this.Kx && this.xl > b;) {
            this.Fz();
            this.xl -= b;
          }
          this.Kq += a;
          if (this.duration != -1 && this.duration < this.Kq) {
            this.KS();
          }
        }
        for (this.Ki = 0; this.Ki < this.ac.length;) {
          b = this.ac[this.Ki];
          if (b.Xc > 0) {
            this.oT(b, a);
            b.color.r += b.bi.r * a;
            b.color.ue += b.bi.ue * a;
            b.color.b += b.bi.b * a;
            b.color.a += b.bi.a * a;
            b.Xc -= a;
            this.Kh(b, this.Ki, a);
            this.Ki++;
          } else {
            this.Fg(this.Ki);
          }
        }
      } else {
        this.HC(this);
      }
    }
    oT(a, b) {
      if (a.g.x != 0 || a.g.y != 0) {
        var c = a.g.Zb();
        c.normalize();
      } else {
        c = new Vec2(0, 0);
      }
      let d = c.Zb();
      c.multiply(a.fs);
      let e = d.x;
      d.x = -d.y;
      d.y = e;
      d.multiply(a.$s);
      c = Vec2.tb(c, d);
      c.add(this.Kb);
      c.multiply(b);
      a.dir.add(c);
      c.Pb(a.dir);
      c.multiply(b);
      a.g.add(c);
    }
    Kh(a) {
      this.gj[this.Ki] = new PointWithSize(a.g.x, a.g.y, a.size);
      this.Zh[this.Ki] = a.color;
    }
    Fg(a) {
      this.ac.splice(a, 1);
    }
    Qm(a) {
      if (this.ac.length > 0) {
        while (this.ac.length > 0) {
          this.Fg(0);
        }
      }
      this.ac = [];
      let b = 0;
      while (b < a) {
        ++b;
        this.Fz();
      }
      this.active = true;
    }
    KS() {
      this.active = false;
      this.Kq = this.duration;
      this.xl = 0;
    }
    M() {}
  }
  ParticleEmitter.i = true;
  ParticleEmitter.s = GameObject;
  Object.assign(ParticleEmitter.prototype, {
    l: ParticleEmitter
  });
  class AnimatedNineSlice extends GameObject {
    constructor(a, b, c, d, e) {
      super();
      this.j = new Container();
      a.ma(0).P(this.j.u);
      this.j.Wd(3);
      this.j.L(false);
      this.frames = [];
      a = [];
      for (var f = 0; f < d;) {
        ++f;
        a.push(0);
      }
      this.Va = a;
      for (a = 0; a < d;) {
        f = a++;
        let g = this.xM(b, c);
        this.j.appendChild(g);
        this.frames.push(g);
        this.Va[f] = 1 / d * f;
      }
      this.delay = 0.3;
      this.EO = e;
    }
    free() {
      this.j.free();
      this.j = null;
    }
    xM(a, b) {
      let c = new Container();
      let d = a / 2;
      let e = b / 2;
      var f = new Sprite(c, Resources.Kd, Keys.eI);
      f.setUniformScale(0.25);
      var g = new Sprite(c, Resources.Kd, Keys.fI);
      g.setUniformScale(0.25);
      g.setX(a - g.getWidth());
      var h = new Sprite(c, Resources.Kd, Keys.dI);
      h.setUniformScale(0.25);
      h.setX(a - h.getWidth());
      h.setY(b - h.getHeight());
      h = new Sprite(c, Resources.Kd, Keys.cI);
      h.setUniformScale(0.25);
      h.setY(b - h.getHeight());
      let m = new Sprite(c, Resources.Kd, Keys.Ny);
      m.setX(f.getX() + f.getWidth());
      m.setScaleX((g.getX() - f.getWidth()) / m.X.x);
      m.setScaleY(0.25);
      g = new Sprite(c, Resources.Kd, Keys.Ny);
      g.setScaleX(m.Ra);
      g.setScaleY(0.25);
      g.setX(f.getX() + f.getWidth());
      g.setY(b - g.getHeight());
      b = new Sprite(c, Resources.Kd, Keys.Oy);
      b.setY(f.getHeight());
      b.setScaleX(0.25);
      b.setScaleY((h.getY() - f.getHeight()) / b.X.y);
      f = new Sprite(c, Resources.Kd, Keys.Oy);
      f.setScaleX(0.25);
      f.setScaleY(b.ed);
      f.setX(a - f.getWidth());
      f.setY(b.getY());
      for (a = 0; a < 8;) {
        f = a++;
        b = c.nb(f);
        b.setX(b.getX() - d);
        f = c.nb(f);
        f.setY(f.getY() - e);
      }
      c.setX(d);
      c.setY(e);
      return c;
    }
    update(a) {
      this.delay -= a;
      if (!(this.delay > 0) && this.j != null) {
        super.update(a);
        this.j.L(true);
        for (var b = 0, c = this.frames.length; b < c;) {
          var d = b++;
          this.Va[d] += a;
          if (this.Va[d] > 1) {
            this.Va[d] -= this.Va[d];
          }
          let e = this.frames[d];
          d = this.Va[d];
          e.W(remap(d, 0, 1, 1, 0));
          e.setUniformScale(remap(d, 0, 1, 0.89, 1.1));
          if (this.EO) {
            e.setUniformScale(remap(d, 0, 1, 0.89, 1.1));
          } else {
            e.setUniformScale(remap(d, 0, 1, 1.1, 0.89));
          }
        }
      }
    }
  }
  AnimatedNineSlice.i = true;
  AnimatedNineSlice.s = GameObject;
  Object.assign(AnimatedNineSlice.prototype, {
    l: AnimatedNineSlice
  });

  class TouchableEntity extends Entity {
    constructor() {
      super();
      new Rect(-1, -1, -1, -1);
      this.cM = this.state = 0;
    }
    Ak(a) {
      this.state = a;
    }
    vw(a, b) {
      if (this.state == 0 && this.Ql(a, b)) {
        this.Ak(1);
        return true;
      } else {
        return false;
      }
    }
    sQ(a, b) {
      if (this.state == 1 && (this.Ak(0), this.Ql(a, b))) {
        if (this.sw != null) {
          this.sw(this.cM);
        }
        return true;
      } else {
        return false;
      }
    }
    Ql(a, b) {
      return PointInCircle.Cx(a, b, this.x, this.y, 20);
    }
  }
  TouchableEntity.i = true;
  TouchableEntity.s = Entity;
  Object.assign(TouchableEntity.prototype, {
    l: TouchableEntity
  });
  class GameItemSwitcher extends Entity {
    constructor(a) {
      super();
      this.S = a;
      this.Pv = this.Br = false;
      this.jq = this.Gq = 0;
    }
    CO(a, b, c, d, e, f, g) {
      this.YL = d;
      this.iO = c;
      this.dD = b | 1;
      this.gr = 1;
      this.oB = e;
      this.pB = f;
      this.nB = g;
      this.x = a.x;
      this.y = a.y;
      this.time = X.gi();
      this.zf = new Container();
      this.zf.setX(this.x);
      this.zf.setY(this.y);
      this.S.ma(5).P(this.zf.u);
      this.Po = new PollenEmitter(this.S, 7);
      this.Po.x = this.x;
      this.Po.y = this.y;
      this.zv = new Sprite(this.zf, Resources.de, Keys.pH);
      this.zv.setUniformScale(0.4);
      this.zv.center();
      this.Av = new Sprite(this.zf, Resources.de, Keys.qH);
      this.Av.center();
      this.Av.setUniformScale(0.4);
      this.fd = this.cc = this.ca = null;
      this.mg = true;
    }
    update(a) {
      super.update(a);
      if (this.Br) {
        this.Gq += a;
        var b = Math.min(1, this.Gq / 0.16);
        this.zf.W(1 - b);
        if (b == 1) {
          this.zf.L(false);
          this.Br = false;
        }
      }
      if (this.Pv) {
        this.jq += a;
        b = Math.min(1, this.jq / 0.36);
        this.zf.W(b);
        if (b == 1) {
          this.Pv = false;
        }
      }
      this.time += a;
      this.zv.setY(remap(Math.sin(this.time * 5), -1, 1, 0, -5));
      this.Av.setY(remap(Math.sin(this.time * 5 + 0.05), -1, 1, 0, -3));
      if (this.cc != null && this.cc.kb != null && this.cc.kb.yc != -1 && !this.cc.Pl()) {
        this.mg = true;
        this.Si(1);
      }
      this.Po.update(a);
    }
    M() {
      super.M();
      this.Po.M();
      this.zf.setX(this.x);
      this.zf.setX(this.x);
    }
    Si(a) {
      if ((a & this.dD) != 0) {
        if (this.gr == 1) {
          this.Br = true;
          this.Gq = 0;
        }
        this.gr = a;
        if (this.ca != null) {
          if (this.ca.Pl()) {
            this.uD();
          } else {
            this.ca.Jo();
            this.ca.bs = true;
          }
        }
        if (this.cc != null) {
          a = this.cc.kb;
          if (a != null) {
            a.bh = 0.36;
          }
          if (this.cc.Pl()) {
            this.wD();
          } else {
            this.cc.Jo();
          }
        }
        if (this.fd != null) {
          if (this.fd.Pl()) {
            this.tD();
          } else {
            this.fd.Jo();
          }
        }
        switch (this.gr) {
          case 1:
            this.Pv = true;
            this.Br = false;
            this.zf.L(true);
            this.jq = 0;
            break;
          case 2:
            this.ca = new Bee(this);
            this.ca.x = this.x;
            this.ca.y = this.y;
            this.ca.Io();
            this.oB.push(this.ca);
            break;
          case 4:
            this.cc = new CandyVariant(this);
            this.cc.x = this.x;
            this.cc.y = this.y;
            this.cc.Zf = false;
            this.cc.mc = null;
            this.cc.setRadius(this.iO);
            this.cc.Io();
            this.cc.mu();
            this.pB.push(this.cc);
            break;
          case 8:
            this.fd = new BouncerFace(this, this.x, this.y, 1, this.YL);
            this.fd.mu();
            this.fd.Io();
            this.nB.push(this.fd);
        }
        this.Po.Qm(7);
        SoundFx.play(SoundFx.ghost_puff);
      }
    }
    vR() {
      let a = this.gr;
      do {
        a <<= 1;
        if (a == 32) {
          a = 2;
        }
      } while ((a & this.dD) == 0);
      this.Si(a);
    }
    vw(a, b) {
      a -= this.x;
      b -= this.y;
      if (this.mg && Math.sqrt(a * a + b * b) < 40) {
        this.vR();
        return true;
      } else {
        return false;
      }
    }
    uD() {
      if (this.ca != null) {
        Std.remove(this.oB, this.ca);
        this.ca.free();
        this.ca = null;
      }
    }
    wD() {
      if (this.cc != null) {
        this.cc.free();
        Std.remove(this.pB, this.cc);
        this.cc = null;
      }
    }
    tD() {
      if (this.fd != null) {
        Std.remove(this.nB, this.fd);
        this.fd.free();
        this.fd = null;
      }
    }
  }
  GameItemSwitcher.i = true;
  GameItemSwitcher.s = Entity;
  Object.assign(GameItemSwitcher.prototype, {
    l: GameItemSwitcher
  });

  class WorldScale {}
  WorldScale.i = true;
