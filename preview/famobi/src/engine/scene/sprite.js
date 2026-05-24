  class Sprite extends DisplayBase {
    constructor(a, b, c) {
      super(new SpriteNode(a != null ? a.node : null));
      this.He = new Bounds(0, 0, 0, 0);
      this.qf = this.Dq = null;
      this.X = new Vec4(0, 0, 0, 1);
      if (b != null) {
        this.Uf(b, c);
      }
      DisplayBase.count++;
    }
    free() {
      if (this.u != null) {
        this.u.free();
        this.X = this.qf = this.Dq = this.He = null;
        super.free();
      }
    }
    getWidth() {
      if ((this.flags & 1) == 0) {
        return this.X.x * Math.abs(this.Ra);
      }
      var a = this.X.x * Math.abs(this.Ra) / 2;
      let b = this.X.y * Math.abs(this.ed) / 2;
      let c = -Math.sin(this.cg);
      let d = Math.cos(this.cg);
      let e;
      if (d > 0) {
        e = -(d * a);
        a *= d;
      } else {
        e = d * a;
        a = -(d * a);
      }
      if (c > 0) {
        e -= c * b;
        a += c * b;
      } else {
        e += c * b;
        a -= c * b;
      }
      return a - e;
    }
    px(a) {
      this.setScaleX(a / this.X.x);
    }
    getHeight() {
      if ((this.flags & 1) == 0) {
        return this.X.y * Math.abs(this.ed);
      }
      var a = this.X.x * Math.abs(this.Ra) / 2;
      let b = this.X.y * Math.abs(this.ed) / 2;
      let c = Math.sin(this.cg);
      let d = Math.cos(this.cg);
      let e;
      if (c > 0) {
        e = -(c * a);
        a *= c;
      } else {
        e = c * a;
        a = -(c * a);
      }
      if (d > 0) {
        e -= d * b;
        a += d * b;
      } else {
        e += d * b;
        a -= d * b;
      }
      return a - e;
    }
    nx(a) {
      this.setScaleY(a / this.X.y);
    }
    centerPivot() {
      this.setPivot(this.X.x / 2, this.X.y / 2);
    }
    centerOrigin() {
      this.setOrigin(this.X.x / 2, this.X.y / 2);
    }
    setPivot(a, b) {
      if (a != null && a >= 0 && a <= 1) {
        a *= this.X.x;
      }
      if (b != null && b >= 0 && b <= 1) {
        b *= this.X.y;
      }
      super.setPivot(a, b);
    }
    setOrigin(a, b) {
      if (a != null && a >= 0 && a <= 1) {
        a *= this.X.x;
      }
      if (b != null && b >= 0 && b <= 1) {
        b *= this.X.y;
      }
      super.setOrigin(a, b);
    }
    Uf(a, b) {
      if (this.Dq != a) {
        this.Dq = a;
        this.qf = null;
        var c = this.u;
        c.Xo = cachedBind(this, this.SC);
        c.Rf(new TextureDrawEffect(a));
        this.SC();
        this.oc();
      }
      if (b != null) {
        this.qp(b);
      }
    }
    SC() {
      var a = this.Dq;
      let b = this.X;
      b.x = a.size.x * a.$e;
      b.y = a.size.y * a.$e;
      this.u.Lb(this.X.x, this.X.y);
      a = this.qf;
      if (a != null) {
        this.qf = null;
        this.qp(a);
      }
    }
    Fb(a) {
      if (this.qf != a) {
        this.qf = a;
        var b = this.u;
        var c = b.effect;
        var d = c.Zw(a);
        c = c.Hb.$e;
        a = this.He;
        var e = this.X;
        e.x = d.ec.x * c;
        e.y = d.ec.y * c;
        if (d.Ip) {
          e = d.mt;
          d = d.Od;
          let f = e.x * c;
          e = e.y * c;
          a.A = f;
          a.D = e;
          a.B = f + d.w;
          a.G = e + d.J;
          b.Lb(d.w * c, d.J * c);
        } else {
          b.Lb(this.X.x, this.X.y);
          a.A = 0;
          a.D = 0;
          a.B = 0;
          a.G = 0;
        }
        this.oc();
      }
    }
    qp(a) {
      if (this.qf != a) {
        this.qf = a;
        var b = this.u;
        var c = b.effect;
        var d = c.Zw(a);
        c = c.Hb.$e;
        a = this.He;
        var e = this.X;
        e.x = d.ec.x * c;
        e.y = d.ec.y * c;
        if (d.Ip) {
          e = d.mt;
          d = d.Od;
          let f = e.x * c;
          e = e.y * c;
          a.A = f;
          a.D = e;
          a.B = f + d.w;
          a.G = e + d.J;
          b.Lb(d.w * c, d.J * c);
        } else {
          b.Lb(this.X.x, this.X.y);
          a.A = 0;
          a.D = 0;
          a.B = 0;
          a.G = 0;
        }
        this.oc();
      }
    }
    pa() {
      return new InternKey(this);
    }
    setColor(a, b, c) {
      let d = this.X;
      d.x = b;
      d.y = c;
      b = this.u;
      b.Lb(this.X.x, this.X.y);
      b.Sc();
      this.u.Rf(new ColorRectEffect(a));
      return this;
    }
    Ub(a, b) {
      if (!this.ri()) {
        return false;
      }
      NodeTreeUtil.Yf(this.u);
      this.u.pe();
      return this.u.Ub(a, b);
    }
    Re(a, b) {
      if (b == null) {
        b = true;
      }
      let c = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
      if (this.X.x == 0) {
        return c;
      }
      if (a == this) {
        c.A = 0;
        c.D = 0;
        c.B = this.X.x;
        c.G = this.X.y;
        return c;
      }
      var d = this.He.A;
      var e = this.He.D;
      let f = this.u;
      var g = f.size;
      let h = g.x;
      g = g.y;
      var m = this.He;
      if (m = m.B - m.A > 0) {
        var n = this.He;
        var q = n.B - n.A;
        n.A = 0;
        n.B = q;
        n = this.He;
        q = n.G - n.D;
        n.D = 0;
        n.G = q;
        f.Lb(this.X.x, this.X.y);
        this.oc();
        this.u.Gd(false, false);
      }
      if (b) {
        NodeTreeUtil.Yf(this.u);
        if (a != null && !NodeTreeUtil.Ov(this.u.parent, a.u)) {
          NodeTreeUtil.Yf(a.u);
        }
      }
      this.u.Fl(a == null ? this.u.gB() : a.u, c);
      if (m) {
        a = this.He;
        b = a.B - a.A;
        a.A = d;
        a.B = d + b;
        d = this.He;
        a = d.G - d.D;
        d.D = e;
        d.G = e + a;
        e = f.size;
        e.x = h;
        e.y = g;
        f.Sc();
        this.oc();
        this.u.Gd(false, false);
      }
      return c;
    }
    Jx(a) {
      let b = this.He;
      var c = b.A;
      let d = b.D;
      var e = b.B - b.A > 0;
      if (e) {
        var f = b.B - b.A;
        b.A = 0;
        b.B = f;
        f = b.G - b.D;
        b.D = 0;
        b.G = f;
        this.oc();
        this.u.Gd(false, false);
      }
      a = super.Jx(a);
      if (e) {
        e = b.B - b.A;
        b.A = c;
        b.B = c + e;
        c = b.G - b.D;
        b.D = d;
        b.G = d + c;
        this.oc();
        this.u.Gd(false, false);
      }
      return a;
    }
    Ix(a) {
      let b = this.He;
      var c = b.A;
      let d = b.D;
      var e = b.B - b.A > 0;
      if (e) {
        var f = b.B - b.A;
        b.A = 0;
        b.B = f;
        f = b.G - b.D;
        b.D = 0;
        b.G = f;
        this.oc();
        this.u.Gd(false, false);
      }
      a = super.Ix(a);
      if (e) {
        e = b.B - b.A;
        b.A = c;
        b.B = c + e;
        c = b.G - b.D;
        b.D = d;
        b.G = d + c;
        this.oc();
        this.u.Gd(false, false);
      }
      return a;
    }
    Jm() {
      if (this.mh() != null) {
        this.mh().Jm(this);
      } else if (this.u.parent != null) {
        this.u.parent.bx(this.u);
      }
    }
    Es() {
      if (this.mh() != null) {
        this.mh().Es(this);
      } else if (this.u.parent != null) {
        this.u.parent.Yw(this.u);
      }
    }
    SR(a) {
      this.u.effect.XR(a);
    }
    oc() {
      let a = this.u.Db;
      let b = this.Tg;
      let c = this.Ug;
      var d = this.He;
      let e = d.A;
      d = d.D;
      let f = this.Rg;
      let g = this.Sg;
      let h = this.pn - e;
      let m = this.qn - d;
      let n = this.dg;
      var q = this.eg;
      var p = this.flags;
      if ((p & 1) > 0) {
        let u = Math.sin(this.cg);
        let A = Math.cos(this.cg);
        var v = a.matrix;
        let D = a.matrix;
        D.m11 = A;
        D.m12 = -u;
        D.m13 = v.m13;
        D.m21 = u;
        D.m22 = A;
        D.m23 = v.m23;
        D.m31 = v.m31;
        D.m32 = v.m32;
        D.m33 = v.m33;
        a.K = a.K & -4 | 248;
        if ((p & 4) > 0) {
          a.scale.x = 1;
          a.scale.y = 1;
          a.K |= 500;
          a.translate.x = -(h * A) + m * u + h + b - f + e;
          a.translate.y = -(h * u) - m * A + m + c - g + d;
        } else if ((p & 2) > 0) {
          q = n * h;
          p = n * m;
          a.scale.x = a.scale.y = n;
          a.K = a.K & -2 | 500;
          a.translate.x = -(q * A) + p * u + h + b - f + e;
          a.translate.y = -(q * u) - p * A + m + c - g + d;
        } else {
          p = n * h;
          v = q * m;
          a.scale.x = n;
          a.scale.y = q;
          a.K = a.K & -6 | 496;
          a.translate.x = -(p * A) + v * u + h + b - f + e;
          a.translate.y = -(p * u) - v * A + m + c - g + d;
        }
      } else if ((p & 4) > 0) {
        a.scale.x = 1;
        a.scale.y = 1;
        a.K |= 500;
        a.translate.x = b - f + e;
        a.translate.y = c - g + d;
      } else if ((p & 2) > 0) {
        a.scale.x = a.scale.y = n;
        a.K = a.K & -2 | 500;
        a.translate.x = -(n * h) + h + b - f + e;
        a.translate.y = -(n * m) + m + c - g + d;
      } else {
        a.scale.x = n;
        a.scale.y = q;
        a.K = a.K & -6 | 496;
        a.translate.x = -(n * h) + h + b - f + e;
        a.translate.y = -(q * m) + m + c - g + d;
      }
      a.K = a.K & -2 | 496;
    }
    typeId() {
      return 304;
    }
  }
  Sprite.i = true;
  Sprite.s = DisplayBase;
  Object.assign(Sprite.prototype, {
    l: Sprite
  });
  class Container extends DisplayBase {
    constructor(a, b) {
      super(new SceneRoot(b != null ? b.node : null, null, 512));
      this.node = this.u;
      this.u.name = a;
    }
    free() {
      if (this.node != null) {
        this.node.free();
        this.node = null;
        super.free();
      }
    }
    appendChild(a) {
      this.node.P(a.u);
    }
    Mj() {
      return this.node.Mj();
    }
    nb(a) {
      return this.node.nb(a).Xg;
    }
    Ww(a, b) {
      this.node.Ww(a.u, b);
    }
    fo(a) {
      a = this.node.fo(a);
      if (a != null) {
        return a.Xg;
      } else {
        return null;
      }
    }
    Jm(a) {
      if (a == null) {
        if (this.mh() != null) {
          this.node.parent.bx(this.u);
        }
      } else {
        this.node.bx(a.u);
      }
    }
    Es(a) {
      if (a == null) {
        if (this.mh() != null) {
          this.node.parent.Yw(this.u);
        }
      } else {
        this.node.Yw(a.u);
      }
    }
    iterator() {
      let a = this.node.children;
      return {
        fb: function () {
          return a != null;
        },
        next: function () {
          let b = a.Xg;
          a = a.Y;
          return b;
        }
      };
    }
    Ub(a, b) {
      NodeTreeUtil.Yf(this.u);
      this.u.Gd(false, true);
      return this.node.Ub(a, b);
    }
    Re(a, b) {
      if (b == null) {
        b = true;
      }
      if (b) {
        this.u.Gd(false, false);
        NodeTreeUtil.Yf(this.u);
        if (a != null && !NodeTreeUtil.Ov(this.u, a.u)) {
          NodeTreeUtil.Yf(a.u);
        }
        b = false;
      }
      let c = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
      let d = this.node.children;
      while (d != null) {
        let e = d.Xg;
        if (e != null && e instanceof DisplayBase) {
          c.add(e.Re(a, b));
        }
        d = d.Y;
      }
      return c;
    }
    getWidth() {
      let a = this.Re(this.mh());
      return a.B - a.A;
    }
    getHeight() {
      let a = this.Re(this.mh());
      return a.G - a.D;
    }
    centerOrigin() {
      if (this.Mj() != 0) {
        var a = this.Re(this);
        this.setOrigin((a.A + a.B) / 2, (a.D + a.G) / 2);
      }
    }
    centerPivot() {
      if (this.Mj() != 0) {
        var a = this.Re(this);
        this.setPivot((a.A + a.B) / 2, (a.D + a.G) / 2);
      }
    }
    typeId() {
      return 204;
    }
  }
  Container.i = true;
  Container.s = DisplayBase;
  Object.assign(Container.prototype, {
    l: Container
  });
