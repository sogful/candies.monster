  class Rect {
    constructor(a, b, c, d) {
      this.x = a;
      this.y = b;
      this.w = c;
      this.J = d;
    }
    static Zb(a) {
      return new Rect(a.x, a.y, a.w, a.J);
    }
    static Gm(a) {
      return new Rect(a.x * 0.4, a.y * 0.4, a.w * 0.4, a.J * 0.4);
    }
    static Ew(a, b, c, d, e, f, g, h) {
      return !(a > g) && !(c < e) && !(b > h) && !(d < f);
    }
    static lk(a, b, c, d, e, f) {
      if (a >= c && a < c + e && b >= d) {
        return b < d + f;
      } else {
        return false;
      }
    }
    static tt(a, b, c, d, e) {
      return (e.x < a ? Rect.oy : 0) + (e.x > c ? Rect.py : 0) + (e.y < b ? Rect.ny : 0) + (e.y > d ? Rect.qy : 0);
    }
    static $j(a, b, c, d, e, f, g, h) {
      let m = new Vec2(a, b);
      let n = new Vec2(c, d);
      let q;
      g = e + g;
      let p = f + h;
      let v = Rect.tt(e, f, g, p, m);
      let u = Rect.tt(e, f, g, p, n);
      while (v != 0 || u != 0) {
        if ((v & u) != 0) {
          return false;
        }
        if (v != 0) {
          h = v;
          q = m;
        } else {
          h = u;
          q = n;
        }
        if ((h & Rect.oy) > 0) {
          q.y += (b - d) * (e - q.x) / (a - c);
          q.x = e;
        } else if ((h & Rect.py) != 0) {
          q.y += (b - d) * (g - q.x) / (a - c);
          q.x = g;
        }
        if ((h & Rect.ny) > 0) {
          q.x += (a - c) * (f - q.y) / (b - d);
          q.y = f;
        } else if ((h & Rect.qy) != 0) {
          q.x += (a - c) * (p - q.y) / (b - d);
          q.y = p;
        }
        if (h == v) {
          v = Rect.tt(e, f, g, p, m);
        } else {
          u = Rect.tt(e, f, g, p, n);
        }
      }
      return true;
    }
  }
  Rect.i = true;
  Object.assign(Rect.prototype, {
    l: Rect
  });
  class Bounds {
    constructor(a, b, c, d) {
      this.A = a;
      this.D = b;
      this.B = c;
      this.G = d;
    }
    add(a) {
      if (a.A < this.A) {
        this.A = a.A;
      }
      if (a.B > this.B) {
        this.B = a.B;
      }
      if (a.D < this.D) {
        this.D = a.D;
      }
      if (a.G > this.G) {
        this.G = a.G;
      }
    }
    ku(a) {
      let b = a.x;
      if (b < this.A) {
        this.A = b;
      }
      if (b > this.B) {
        this.B = b;
      }
      a = a.y;
      if (a < this.D) {
        this.D = a;
      }
      if (a > this.G) {
        this.G = a;
      }
    }
    scale(a, b) {
      if (b) {
        b = (this.B - this.A) / 2;
        let c = this.A + b;
        this.A = c - b * a;
        this.B = c + b * a;
        b = (this.G - this.D) / 2;
        c = this.D + b;
        this.D = c - b * a;
        this.G = c + b * a;
      } else {
        this.A *= a;
        this.D *= a;
        this.B *= a;
        this.G *= a;
      }
    }
    hi(a) {
      var b = this.B - this.A;
      let c = this.G - this.D;
      var d = b / a;
      let e = c / 1;
      if (d <= e) {
        b = this.D + (c - d) / 2;
        return new Bounds(this.A, b, this.B, b + d);
      }
      d = a * e;
      b = this.A + (b - d) / 2;
      return new Bounds(b, this.D, b + d, this.G);
    }
  }
  Bounds.i = true;
  Object.assign(Bounds.prototype, {
    l: Bounds
  });
  class Size {
    constructor(a, b) {
      this.x = a;
      this.y = b;
    }
  }
  Size.i = true;
  Object.assign(Size.prototype, {
    l: Size
  });

  class BoundsLite {
    constructor(a, b, c, d) {
      this.A = a;
      this.D = b;
      this.B = c;
      this.G = d;
    }
  }
  BoundsLite.i = true;
  Object.assign(BoundsLite.prototype, {
    l: BoundsLite
  });
  class PointInRect {
    static RS(a, b, c, d) {
      if (a >= 0 && a <= c && b >= 0) {
        return b <= d;
      } else {
        return false;
      }
    }
  }
  PointInRect.i = true;
  class PointInCircle {
    static Cx(a, b, c, d, e) {
      a -= c;
      b -= d;
      return a * a + b * b < e * e;
    }
  }
  PointInCircle.i = true;

  class AABBTest {
    static test(a, b) {
      if (a.A >= b.B) {
        return false;
      } else if (a.B <= b.A) {
        return false;
      } else if (a.D >= b.G) {
        return false;
      } else if (a.G <= b.D) {
        return false;
      } else {
        return true;
      }
    }
  }
  AABBTest.i = true;
