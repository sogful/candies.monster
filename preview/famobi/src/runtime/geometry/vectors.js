  class RGBA {
    constructor(a, b, c, d) {
      this.r = a;
      this.ue = b;
      this.b = c;
      this.a = d;
    }
    Zb() {
      return new RGBA(this.r, this.ue, this.b, this.a);
    }
  }
  RGBA.i = true;
  Object.assign(RGBA.prototype, {
    l: RGBA
  });
  class Vec2 {
    constructor(a, b) {
      this.x = a;
      this.y = b;
    }
    add(a) {
      this.x += a.x;
      this.y += a.y;
    }
    Ax(a) {
      this.x -= a.x;
      this.y -= a.y;
    }
    multiply(a) {
      this.x *= a;
      this.y *= a;
    }
    xA(a) {
      this.x /= a;
      this.y /= a;
    }
    sf(a) {
      let b = this.x - a.x;
      a = this.y - a.y;
      return Math.sqrt(b * b + a * a);
    }
    Rb() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    io() {
      return this.x * this.x + this.y * this.y;
    }
    TO() {
      if (this.x == 0) {
        return this.y == 0;
      } else {
        return false;
      }
    }
    gN(a) {
      if (this.x == a.x) {
        return this.y == a.y;
      } else {
        return false;
      }
    }
    normalize() {
      this.multiply(1 / this.Rb());
    }
    angle() {
      return Math.atan(this.y / this.x);
    }
    km() {
      return Math.atan2(this.y, this.x);
    }
    Zb() {
      return new Vec2(this.x, this.y);
    }
    Pb(a) {
      this.x = a.x;
      this.y = a.y;
    }
    rotate(a) {
      let b = Math.cos(a);
      a = Math.sin(a);
      let c = this.x * a + this.y * b;
      this.x = this.x * b - this.y * a;
      this.y = c;
      return this;
    }
    $a(a, b, c) {
      this.x -= b;
      this.y -= c;
      this.rotate(a);
      this.x += b;
      this.y += c;
    }
    static sc() {
      return new Vec2(0, 0);
    }
    static UP() {
      return new Vec2(2147483647, 2147483647);
    }
    static tb(a, b) {
      return new Vec2(a.x + b.x, a.y + b.y);
    }
    static Ia(a, b) {
      return new Vec2(a.x - b.x, a.y - b.y);
    }
    static Ob(a, b) {
      return new Vec2(a.x * b, a.y * b);
    }
    static bq(a, b) {
      return new Vec2(a.x / b, a.y / b);
    }
    static nd(a, b, c, d) {
      a -= c;
      b -= d;
      return Math.sqrt(a * a + b * b);
    }
    static yz(a, b) {
      return a.x * b.x + a.y * b.y;
    }
    static au(a) {
      return new Vec2(-a.y, a.x);
    }
    static AL(a) {
      return new Vec2(a.y, -a.x);
    }
    static cq(a) {
      return Vec2.Ob(a, 1 / a.Rb());
    }
    static eM(a, b) {
      let c = new Vec2(0, 0);
      Vec2.OD(a, b, c);
      return c;
    }
    static OD(a, b, c) {
      var d = a.length;
      if (d <= 1) {
        c.x = c.y = 0;
      } else {
        var e = Vec2.BL;
        var f = Vec2.CL;
        var g = 1 - b;
        for (var h = 0; h < d;) {
          let m = h++;
          let n = a[m];
          e[m] = n.x;
          f[m] = n.y;
        }
        for (a = d - 1; a > 0;) {
          d = 0;
          for (h = 1; d < a;) {
            e[d] = e[d] * g + e[h] * b;
            f[d] = f[d] * g + f[h] * b;
            ++d;
            ++h;
          }
          --a;
        }
        c.x = e[0];
        c.y = f[0];
      }
    }
    static KA(a) {
      return new Vec2(Math.cos(a), Math.sin(a));
    }
  }
  Vec2.i = true;
  Object.assign(Vec2.prototype, {
    l: Vec2
  });
  class Vec4 {
    constructor(a, b, c, d) {
      this.x = a;
      this.y = b;
      this.z = c;
      this.w = d;
    }
  }
  Vec4.i = true;
  Object.assign(Vec4.prototype, {
    l: Vec4
  });

  class Vec4Clone {
    static clone(a) {
      return new Vec4(a.x, a.y, a.z, a.w);
    }
  }
