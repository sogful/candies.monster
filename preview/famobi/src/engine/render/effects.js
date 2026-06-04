  class DrawEffect {
    constructor() {
      this.type = this.typeId();
      this.enabled = true;
      this.va = null;
      this.cb = 0;
    }
    free() {
      this.va = null;
    }
    update() {}
    Dh(a) {
      this.va = a;
    }
    typeId() {
      return 105;
    }
  }
  DrawEffect.i = true;
  DrawEffect.Ib = [C180];
  Object.assign(DrawEffect.prototype, {
    l: DrawEffect
  });
  class RingDrawEffect extends DrawEffect {
    constructor() {
      super();
      this.Z = 0;
      this.color = new Vec4(1, 1, 1, 1);
      this.lineWidth = 6;
      this.Gr = 1;
    }
    typeId() {
      return 905;
    }
  }
  RingDrawEffect.i = true;
  RingDrawEffect.s = DrawEffect;
  Object.assign(RingDrawEffect.prototype, {
    l: RingDrawEffect
  });
  class TextureDrawEffect extends DrawEffect {
    constructor(a, b) {
      super();
      this.Hb = null;
      this.Ep = new TexRect(0, 0, 0, 0);
      this.frame = null;
      this.hp = this.Am = 1;
      this.Td = this.K = this.offsetY = this.offsetX = 0;
      this.Uf(a, b);
    }
    XR(a) {
      this.offsetX = 0;
      this.offsetY = a;
      this.K = a == 0 ? this.K & -3 : this.K | 2;
    }
    Uf(a, b) {
      this.Hb = a;
      if (b != null) {
        this.Zw(b);
      } else {
        b = this.Ep;
        let c = a.size.x;
        let d = a.size.y;
        b.x = 0;
        b.y = 0;
        b.w = c;
        b.J = d;
        this.frame = null;
      }
      this.cb = a.id;
    }
    Zw(a) {
      a = this.Hb.hc.yf(a);
      if (this.frame == null || a.id != this.frame.id) {
        this.frame = a;
        a = this.Ep;
        let b = this.frame.Od;
        a.x = b.x;
        a.y = b.y;
        a.w = b.w;
        a.J = b.J;
      }
      return this.frame;
    }
    qp(a) {
      if (this.frame == null || this.frame.id != a) {
        this.frame = this.Hb.hc.EN(a);
        a = this.Ep;
        let b = this.frame.Od;
        a.x = b.x;
        a.y = b.y;
        a.w = b.w;
        a.J = b.J;
      }
    }
    update() {
      if (this.Hb.Td > this.Td) {
        this.Td = this.Hb.Td;
        if (this.frame == null) {
          this.Uf(this.Hb);
        } else {
          let a = this.frame;
          this.frame = null;
          this.qp(a.id);
        }
        if (this.va.Xo != null) {
          this.va.Xo();
        }
      }
    }
    free() {
      super.free();
      this.Hb = null;
    }
    typeId() {
      return 205;
    }
  }
  TextureDrawEffect.i = true;
  TextureDrawEffect.s = DrawEffect;
  Object.assign(TextureDrawEffect.prototype, {
    l: TextureDrawEffect
  });
  class MeshDrawEffect extends DrawEffect {
    constructor(a) {
      super();
      this.Hb = a;
      this.js = null;
    }
    free() {
      super.free();
      this.Hb = null;
    }
    typeId() {
      return 405;
    }
  }
  MeshDrawEffect.i = true;
  MeshDrawEffect.s = DrawEffect;
  Object.assign(MeshDrawEffect.prototype, {
    l: MeshDrawEffect
  });
  class ParallaxDrawEffect extends DrawEffect {
    constructor(a, b) {
      super();
      this.Yr = new Vec4(1, 1, 0, 1);
      this.vk = new Vec4(0, 0, 0, 1);
      a.zi(function () {});
      this.Jr = new Size(a.Tb * b, a.Yc * b);
    }
    free() {
      super.free();
    }
    Dh(a) {
      super.Dh(a);
      a.Lb(this.Jr.x, this.Jr.y);
      a.Sc();
    }
    update(a) {
      var b = a.Ab;
      var c = b.position.y;
      b = b.position.x - a.rf.Fa.translate.x;
      var d = c - a.rf.Fa.translate.y;
      c = this.vk;
      c.x = b * (1 - this.Yr.x);
      c.y = d * (1 - this.Yr.y);
      b = a.rf;
      b.Lb(this.Jr.x, this.Jr.y);
      d = (1 - this.Yr.x) * c.x * 2;
      a = (1 - this.Yr.y) * c.y * 2;
      b.ea.C.x = d;
      b.ea.C.y = a;
      c = b.ea.gb;
      let e = c.B - c.A;
      c.A = d;
      c.B = d + e;
      c = b.ea.gb;
      b = c.G - c.D;
      c.D = a;
      c.G = a + b;
    }
    typeId() {
      return 1605;
    }
  }
  ParallaxDrawEffect.i = true;
  ParallaxDrawEffect.s = DrawEffect;
  Object.assign(ParallaxDrawEffect.prototype, {
    l: ParallaxDrawEffect
  });
  class SolidColorEffect extends DrawEffect {
    constructor(a) {
      if (a == null) {
        a = 1;
      }
      super();
      this.flags = a;
      this.color = new Vec4(0, 0, 0, 1);
    }
    typeId() {
      return 1405;
    }
  }
  SolidColorEffect.i = true;
  SolidColorEffect.s = DrawEffect;
  Object.assign(SolidColorEffect.prototype, {
    l: SolidColorEffect
  });
  class ShapePath extends DrawEffect {
    constructor() {
      super();
      this.precision = 0.2;
      this.AQ = false;
      new Bounds(0, 0, 1024, 1024);
      this.sM = false;
      this.Ku = 0;
      this.qM = 256;
      this.Ju = Array(this.qM);
      this.EM = 1024;
      this.data = Array(this.EM);
      this.lineWidth = this.Gr = 1;
      this.fillColor = 0;
      this.cursor = new Vec4(0, 0, 0, 1);
      this.Fd = [];
      this.to = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
      this.clear();
    }
    free() {
      this.Fd = this.Ju = this.data = null;
      super.free();
    }
    Dh(a) {
      super.Dh(a);
      if (this.sM) {
        this.tM();
      }
    }
    clear() {
      this.Ku = 0;
      let a = this.to;
      a.A = a.D = vInfinity;
      a.B = a.G = vNegInfinity;
    }
    tM() {
      let a = vInfinity;
      let b = vNegInfinity;
      let c = vInfinity;
      let d = vNegInfinity;
      let e = this.to;
      let f = this.data;
      let g = this.Ju;
      let h = 0;
      let m = 0;
      let n = this.Ku;
      while (h < n) {
        var q = g[h++];
        switch (q) {
          case 1:
          case 2:
          case 3:
            q = f[m];
            let p = f[m + 1];
            if (q < a) {
              a = q;
            }
            if (q > b) {
              b = q;
            }
            if (p < c) {
              c = p;
            }
            if (p > d) {
              d = p;
            }
            m += 2;
            break;
          case 4:
            m += 3;
            break;
          case 5:
            m += 2;
            break;
          case 6:
          case 7:
          case 8:
            break;
          default:
            e.A = a;
            e.D = c;
            e.B = b;
            e.G = d;
            m = this.Gz(q, m, f);
            a = e.A;
            c = e.D;
            b = e.B;
            d = e.G;
        }
      }
      e.A = a;
      e.D = c;
      e.B = b;
      e.G = d;
      if (this.va != null) {
        this.Sc();
      }
    }
    Gz() {
      return 0;
    }
    Sc() {
      let a = this.to;
      var b = this.va.ea;
      b.C.x = (a.A + a.B) / 2;
      b.C.y = (a.D + a.G) / 2;
      let c = (a.B - a.A) / 2;
      let d = (a.G - a.D) / 2;
      b.Z = Math.sqrt(c * c + d * d);
      if (b.type == 302) {
        b = b.gb;
        b.A = a.A;
        b.D = a.D;
        b.B = a.B;
        b.G = a.G;
      }
      this.va.Sc();
    }
    typeId() {
      return 1005;
    }
  }
  ShapePath.i = true;
  ShapePath.s = DrawEffect;
  Object.assign(ShapePath.prototype, {
    l: ShapePath
  });

  class GradientEffect extends ShapePath {
    constructor() {
      super();
      let a = [];
      let b = 0;
      while (b < 4) {
        ++b;
        a.push(new Vec4(0, 0, 0, 1));
      }
      this.MD = [];
    }
    typeId() {
      return 1505;
    }
  }
  GradientEffect.i = true;
  GradientEffect.s = ShapePath;
  Object.assign(GradientEffect.prototype, {
    l: GradientEffect
  });

  class TextDrawEffect extends DrawEffect {
    constructor(a) {
      super();
      this.Hb = a;
      this.NE = a.$e;
      this.charset = a.hc.Np;
      this.text = null;
      this.clip = false;
      this.fontSize = this.charset.ss;
      this.mC = 4;
      this.JP = 512;
      this.size = new Vec4(100, 100, 0, 1);
      this.Tv = true;
      this.$B = false;
      this.qR = 32;
      this.ZE = this.ZB = 0;
      this.Sj = 2;
      this.bl = this.Wg = null;
      this.mA = 0;
      this.Ze = true;
      this.overflow = false;
      this.Og = new TextLayout();
      this.multiline = false;
      this.Td = 0;
    }
    Dh(a) {
      super.Dh(a);
      a.Lb(this.size.x, this.size.y);
    }
    setText(a) {
      if (this.text != a) {
        this.text = a;
        if (this.multiline) {
          this.Wz();
        }
        this.Ze = true;
      }
    }
    $q() {
      return this.fontSize;
    }
    kp() {
      this.fontSize = this.charset.ss;
    }
    setFontSize(a) {
      var b;
      if (b != null) {
        if (b < 4) {
          b = 4;
        }
        this.mC = b;
      }
      b = this.mC;
      let c = this.JP;
      a = a < b ? b : a > c ? c : a;
      if (a != this.fontSize) {
        this.fontSize = a;
        this.Ze = true;
      }
    }
    ZN() {
      let a = this.size;
      return new Vec4(a.x, a.y, 0, 1);
    }
    setBoxSize(a, b) {
      if (this.size.x != a || this.size.y != b) {
        this.size.x = a;
        this.size.y = b;
        this.va.Lb(this.size.x, this.size.y);
        this.Ze = true;
      }
    }
    uv() {
      return this.Og.nw;
    }
    Is(a) {
      this.ZB = a;
      this.Ze = true;
    }
    kx(a) {
      this.ZE = a;
      this.Ze = true;
    }
    setAlign(a, b) {
      this.Wg = a;
      this.bl = b;
      this.Ze = true;
    }
    nN(a) {
      if (a == null) {
        a = true;
      }
      if (this.text != null) {
        var b = this.Sj * 2;
        var c = this.size.x - b;
        var d = this.size.y - b;
        this.kp();
        b = d / this.charset.vj;
        this.Og.shape(this, true);
        var e = this.Og.gb;
        c = Math.min(c / (e.B - e.A), d / (e.G - e.D));
        if (a) {
          c = Math.min(b, c);
        }
        this.fontSize *= c;
        this.shape();
      }
    }
    Tf(a) {
      if ((this.multiline = a) && this.qq == null) {
        this.UR(new TokenParser());
      }
    }
    UR(a) {
      this.qq = a;
      if (this.text != null) {
        this.Wz();
      }
      this.Ze = true;
    }
    shape() {
      this.Og.shape(this, false);
      let a = this.Og.gb;
      this.overflow = a.B - a.A > this.size.x - this.Sj * 2;
      this.Ze = false;
    }
    update() {
      if (this.Hb.Td > this.Td) {
        this.Td = this.Hb.Td;
        this.charset = this.Hb.hc.Np;
        let a = this.Hb.$e;
        this.fontSize *= this.NE / a;
        this.NE = a;
        if (this.va.Xo != null) {
          this.va.Xo();
        }
        this.Ze = true;
      }
      if (this.Ze) {
        this.Ze = false;
        this.shape();
      }
    }
    free() {
      super.free();
      this.Hb = null;
      this.Og.free();
      this.Og = null;
    }
    Wz() {
      this.qq.mS(this.text);
      this.Dx = [];
      let a = 0;
      let b = this.qq.vC();
      while (b != null) {
        this.Dx.push(new TextRun(this.text.substring(a, b.position), b.required));
        a = b.position;
        b = this.qq.vC();
      }
    }
    typeId() {
      return 505;
    }
  }
  TextDrawEffect.i = true;
  TextDrawEffect.s = DrawEffect;
  Object.assign(TextDrawEffect.prototype, {
    l: TextDrawEffect
  });
  class GradientLineEffect extends DrawEffect {
    constructor() {
      super();
      this.points = [];
      this.Zh = [];
      this.vn = [];
      this.Z = 10;
    }
    free() {
      super.free();
      this.vn = this.Zh = this.points = null;
    }
    OR() {
      this.points = [];
      this.Zh = [];
      this.vn = [];
    }
    typeId() {
      return 705;
    }
  }
  GradientLineEffect.i = true;
  GradientLineEffect.s = DrawEffect;
  Object.assign(GradientLineEffect.prototype, {
    l: GradientLineEffect
  });
  class ClearEffect extends DrawEffect {
    constructor(a) {
      super();
      this.color = a;
      this.js = null;
    }
    typeId() {
      return 305;
    }
  }
  ClearEffect.i = true;
  ClearEffect.s = DrawEffect;
  Object.assign(ClearEffect.prototype, {
    l: ClearEffect
  });
  class MultiLineEffect extends DrawEffect {
    constructor(a) {
      super();
      this.Fj = a;
      this.lt = [];
    }
    update(a) {
      super.update(a);
      this.lt = [];
      for (a = 0; a < 5;) {
        var b = this.Fj[a++];
        var c = b.length;
        if (c == 0) {
          continue;
        }
        let q = 1;
        var d = undefined;
        var e = [];
        var f = 0;
        for (var g = 0; g < c;) {
          var h = g++;
          d = b[h];
          if (h == 0) {
            e[f++] = d.start;
          }
          e[f++] = d.end;
        }
        b = c * 2;
        c = [];
        f = 1 / b;
        for (g = 0;;) {
          if (g > 1) {
            g = 1;
          }
          d = Vec2.eM(e, g);
          c.push(d);
          if (g == 1) {
            break;
          }
          g += f;
        }
        e = MultiLineEffect.WF / b;
        d = [];
        f = 0;
        for (g = b - 1; f < g;) {
          var m = q;
          h = f == b - 1 ? 1 : q + e;
          let p = c[f];
          let v = c[f + 1];
          var n = Vec2.Ia(v, p);
          n.normalize();
          let u = Vec2.AL(n);
          n = Vec2.au(n);
          let A = Vec2.tb(p, Vec2.Ob(n, m));
          d.push(Vec2.tb(p, Vec2.Ob(u, m)));
          d.push(A);
          m = Vec2.tb(v, Vec2.Ob(n, h));
          d.push(Vec2.tb(v, Vec2.Ob(u, h)));
          d.push(m);
          q += e;
          ++f;
        }
        this.lt.push(d);
      }
    }
    typeId() {
      return 1105;
    }
  }
  MultiLineEffect.i = true;
  MultiLineEffect.s = DrawEffect;
  Object.assign(MultiLineEffect.prototype, {
    l: MultiLineEffect
  });
  class DashedCircleEffect extends DrawEffect {
    constructor() {
      super();
      this.C = new Vec4(0, 0, 0, 1);
      this.Z = 0;
      this.color = new Vec4(0, 0, 0, 0);
      this.Uo = 0;
      this.lineWidth = 1.5;
      this.update(null);
    }
    update() {
      this.Uo = Math.max(16, Math.round(this.Z / 0.8));
      if (this.Uo % 2 != 0) {
        this.Uo++;
      }
    }
    typeId() {
      return 605;
    }
  }
  DashedCircleEffect.i = true;
  DashedCircleEffect.s = DrawEffect;
  Object.assign(DashedCircleEffect.prototype, {
    l: DashedCircleEffect
  });

  class TextGridEffect extends DrawEffect {
    constructor(a, b, c) {
      super();
      this.Hb = a;
      this.charset = a.hc.Np;
      a = [9633, 65533, 63];
      let d = 0;
      while (d < 3) {
        let e = d++;
        if (this.charset.nA[a[e]] != null) {
          break;
        }
      }
      this.grid = null;
      this.fillColor = -1;
      this.gw = this.fw = 0;
      this.Lb(b, c, false);
    }
    Lb(a, b, c) {
      if (c) {
        a = a / this.charset.HA | 0;
        b = b / this.charset.lineHeight | 0;
        this.Lb(a, b, false);
      } else {
        if (this.fw > 0 && a > this.fw) {
          a = this.fw;
        }
        if (this.gw > 0 && b > this.gw) {
          b = this.gw;
        }
        if (this.grid == null || a != this.grid.Tb || b != this.grid.Yc) {
          if (this.grid == null) {
            this.grid = new Grid2D(a, b);
          } else {
            this.grid.resize(a, b);
          }
          this.grid.forEach(function (d, e, f) {
            if (d == null) {
              return new GridCell(e, f);
            } else {
              return d;
            }
          });
          if (this.va != null) {
            this.Sc();
          }
        }
      }
    }
    Dh(a) {
      super.Dh(a);
      this.Sc();
    }
    Sc() {
      this.va.Lb(this.charset.HA * this.grid.Tb, this.charset.lineHeight * this.grid.Yc);
      this.va.Sc();
    }
    typeId() {
      return 1805;
    }
  }
  TextGridEffect.i = true;
  TextGridEffect.s = DrawEffect;
  Object.assign(TextGridEffect.prototype, {
    l: TextGridEffect
  });
  class ColorRectEffect extends DrawEffect {
    constructor(a) {
      super();
      this.color = Vec4Clone.clone(a);
    }
    typeId() {
      return 1205;
    }
  }
  ColorRectEffect.i = true;
  ColorRectEffect.s = DrawEffect;
  Object.assign(ColorRectEffect.prototype, {
    l: ColorRectEffect
  });
  class SpriteShapeEffect extends DrawEffect {
    constructor(a, b) {
      super();
      this.Hb = a;
      this.shape = b;
      this.ac = [];
    }
    typeId() {
      return 1705;
    }
  }
  SpriteShapeEffect.i = true;
  SpriteShapeEffect.s = DrawEffect;
  Object.assign(SpriteShapeEffect.prototype, {
    l: SpriteShapeEffect
  });
  class ShapePathBounds extends ShapePath {
    constructor() {
      super();
    }
    Gz(a, b, c) {
      var d = this.to;
      let e = d.A;
      let f = d.D;
      let g = d.B;
      d = d.G;
      switch (a) {
        case 10:
          var h = c[b];
          a = c[b + 1];
          var m = c[b + 2];
          c = c[b + 3];
          if (h < e) {
            e = h;
          }
          if (h > g) {
            g = h;
          }
          if (a < f) {
            f = a;
          }
          if (a > d) {
            d = a;
          }
          h += m;
          c = a + c;
          if (h < e) {
            e = h;
          }
          if (h > g) {
            g = h;
          }
          if (c < f) {
            f = c;
          }
          if (c > d) {
            d = c;
          }
          b += 4;
          break;
        case 11:
          h = c[b];
          a = c[b + 1];
          m = c[b + 2];
          c = c[b + 3];
          if (h < e) {
            e = h;
          }
          if (h > g) {
            g = h;
          }
          if (a < f) {
            f = a;
          }
          if (a > d) {
            d = a;
          }
          h += m;
          c = a + c;
          if (h < e) {
            e = h;
          }
          if (h > g) {
            g = h;
          }
          if (c < f) {
            f = c;
          }
          if (c > d) {
            d = c;
          }
          b += 5;
          break;
        case 12:
          a = c[b];
          h = c[b + 1];
          if (a < e) {
            e = a;
          }
          if (a > g) {
            g = a;
          }
          if (h < f) {
            f = h;
          }
          if (h > d) {
            d = h;
          }
          a = c[b + 2];
          c = c[b + 3];
          if (a < e) {
            e = a;
          }
          if (a > g) {
            g = a;
          }
          if (c < f) {
            f = c;
          }
          if (c > d) {
            d = c;
          }
          b += 4;
          break;
        case 13:
          a = c[b];
          h = c[b + 1];
          if (a < e) {
            e = a;
          }
          if (a > g) {
            g = a;
          }
          if (h < f) {
            f = h;
          }
          if (h > d) {
            d = h;
          }
          a = c[b + 2];
          h = c[b + 3];
          if (a < e) {
            e = a;
          }
          if (a > g) {
            g = a;
          }
          if (h < f) {
            f = h;
          }
          if (h > d) {
            d = h;
          }
          a = c[b + 4];
          c = c[b + 5];
          if (a < e) {
            e = a;
          }
          if (a > g) {
            g = a;
          }
          if (c < f) {
            f = c;
          }
          if (c > d) {
            d = c;
          }
          b += 6;
          break;
        case 14:
          h = c[b];
          a = c[b + 1];
          c = c[b + 2];
          m = h - c;
          var n = a - c;
          if (m < e) {
            e = m;
          }
          if (m > g) {
            g = m;
          }
          if (n < f) {
            f = n;
          }
          if (n > d) {
            d = n;
          }
          h += c;
          c = a + c;
          if (h < e) {
            e = h;
          }
          if (h > g) {
            g = h;
          }
          if (c < f) {
            f = c;
          }
          if (c > d) {
            d = c;
          }
          b += 5;
          break;
        case 15:
          h = c[b];
          a = c[b + 1];
          c = Math.max(c[b + 2], c[b + 3]);
          m = h - c;
          n = a - c;
          if (m < e) {
            e = m;
          }
          if (m > g) {
            g = m;
          }
          if (n < f) {
            f = n;
          }
          if (n > d) {
            d = n;
          }
          h += c;
          c = a + c;
          if (h < e) {
            e = h;
          }
          if (h > g) {
            g = h;
          }
          if (c < f) {
            f = c;
          }
          if (c > d) {
            d = c;
          }
          b += 8;
          break;
        case 16:
          ++b;
          break;
        case 17:
          b += 1 + (c[b] | 0);
      }
      c = this.to;
      c.A = e;
      c.D = f;
      c.B = g;
      c.G = d;
      return b;
    }
    typeId() {
      return 1305;
    }
  }
  ShapePathBounds.i = true;
  ShapePathBounds.s = ShapePath;
  Object.assign(ShapePathBounds.prototype, {
    l: ShapePathBounds
  });
  class NoopEffect extends DrawEffect {
    constructor() {
      super();
    }
    typeId() {
      return 2005;
    }
  }
  NoopEffect.i = true;
  NoopEffect.s = DrawEffect;
  Object.assign(NoopEffect.prototype, {
    l: NoopEffect
  });
  class MeshDataEffect extends DrawEffect {
    constructor() {
      super();
      new MeshData(null, null, null, null);
      new MeshVertices(null, null, null, null, null);
      this.gv = new MeshGeometry(null, null, null);
    }
    typeId() {
      return 1905;
    }
  }
  MeshDataEffect.i = true;
  MeshDataEffect.s = DrawEffect;
  Object.assign(MeshDataEffect.prototype, {
    l: MeshDataEffect
  });
  class CustomShaderEffect extends DrawEffect {
    constructor(a) {
      super();
      this.Pi = a;
    }
    free() {}
    typeId() {
      return 805;
    }
  }
  CustomShaderEffect.i = true;
  CustomShaderEffect.s = DrawEffect;
  Object.assign(CustomShaderEffect.prototype, {
    l: CustomShaderEffect
  });

  class MeshGeometry {
    constructor() {
      new Vec4(0, 0, 0, 1);
      new Vec4(0, 0, -1, 1);
      new Vec4(0, 0, 0, 1);
    }
  }
  MeshGeometry.i = true;
  Object.assign(MeshGeometry.prototype, {
    l: MeshGeometry
  });
  class MeshVertices {
    constructor() {
      new Vec4(1, 0, 0, 1);
      new Vec4(HALF_PI, 0, 1, 1);
      new Vec4(1, 1, 1, 1);
      new Vec4(1, 1, 1, 1);
      new Vec4(1, 1, 1, 1);
    }
  }
  MeshVertices.i = true;
  Object.assign(MeshVertices.prototype, {
    l: MeshVertices
  });
  class MeshData {
    constructor() {
      new Vec4(0, 0, 0, 1);
      new Vec4(0, 0, 0, 1);
      new Vec4(0, 0, 0, 1);
      new Vec4(0, 0, 0, 1);
    }
  }
  MeshData.i = true;
  Object.assign(MeshData.prototype, {
    l: MeshData
  });

  class GridCell {
    constructor(a, b) {
      this.x = a;
      this.y = b;
      this.code = 0;
    }
  }
  GridCell.i = true;
  Object.assign(GridCell.prototype, {
    l: GridCell
  });
