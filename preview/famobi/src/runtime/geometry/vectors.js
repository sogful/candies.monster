  // RGBA - 32-bit colour with r, g, b, a channels in 0..1.
  class RGBA {
    constructor(r, g, b, a) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    }
    clone() {
      return new RGBA(this.r, this.g, this.b, this.a);
    }
  }
  RGBA.i = true;
  Object.assign(RGBA.prototype, {
    l: RGBA
  });

  // Vec2 - 2-d vector. Instance methods mutate in place; statics
  // return new vectors.
  class Vec2 {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    add(v) {
      this.x += v.x;
      this.y += v.y;
    }
    sub(v) {
      this.x -= v.x;
      this.y -= v.y;
    }
    multiply(s) {
      this.x *= s;
      this.y *= s;
    }
    div(s) {
      this.x /= s;
      this.y /= s;
    }
    distTo(v) {
      let dx = this.x - v.x;
      let dy = this.y - v.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y;
    }
    isZero() {
      if (this.x == 0) return this.y == 0;
      return false;
    }
    equals(v) {
      if (this.x == v.x) return this.y == v.y;
      return false;
    }
    normalize() {
      this.multiply(1 / this.length());
    }
    angle() {
      return Math.atan(this.y / this.x);
    }
    // direction - full-circle angle (Math.atan2). Distinct from angle()
    // which is Math.atan(y/x) and only covers half the plane.
    direction() {
      return Math.atan2(this.y, this.x);
    }
    clone() {
      return new Vec2(this.x, this.y);
    }
    copyFrom(v) {
      this.x = v.x;
      this.y = v.y;
    }
    // rotate around origin by `rad` radians.
    rotate(rad) {
      let c = Math.cos(rad);
      let s = Math.sin(rad);
      let newY = this.x * s + this.y * c;
      this.x = this.x * c - this.y * s;
      this.y = newY;
      return this;
    }
    // $a - rotate around pivot (px, py).
    rotateAround(rad, px, py) {
      this.x -= px;
      this.y -= py;
      this.rotate(rad);
      this.x += px;
      this.y += py;
    }
    static zero() {
      return new Vec2(0, 0);
    }
    static MAX() {
      return new Vec2(2147483647, 2147483647);
    }
    static sum(a, b) {
      return new Vec2(a.x + b.x, a.y + b.y);
    }
    static diff(a, b) {
      return new Vec2(a.x - b.x, a.y - b.y);
    }
    static scaled(v, s) {
      return new Vec2(v.x * s, v.y * s);
    }
    static divided(v, s) {
      return new Vec2(v.x / s, v.y / s);
    }
    static distance(x1, y1, x2, y2) {
      x1 -= x2;
      y1 -= y2;
      return Math.sqrt(x1 * x1 + y1 * y1);
    }
    static dot(a, b) {
      return a.x * b.x + a.y * b.y;
    }
    // perpCCW / perpCW - perpendicular variants (counter-clockwise /
    // clockwise).
    static perpCCW(v) {
      return new Vec2(-v.y, v.x);
    }
    static perpCW(v) {
      return new Vec2(v.y, -v.x);
    }
    static normalized(v) {
      return Vec2.scaled(v, 1 / v.length());
    }
    // bezier / bezierInto - de Casteljau evaluation of a Bezier control
    // polygon at parameter t. bezier allocates; bezierInto writes into
    // the supplied out vec.
    static bezier(controls, t) {
      let out = new Vec2(0, 0);
      Vec2.bezierInto(controls, t, out);
      return out;
    }
    static bezierInto(controls, t, out) {
      let n = controls.length;
      if (n <= 1) {
        out.x = out.y = 0;
      } else {
        let xs = Vec2.BEZIER_XS;
        let ys = Vec2.BEZIER_YS;
        let oneMinusT = 1 - t;
        for (let i = 0; i < n;) {
          let k = i++;
          let p = controls[k];
          xs[k] = p.x;
          ys[k] = p.y;
        }
        // collapse the polygon one level at a time
        for (let level = n - 1; level > 0;) {
          let i = 0;
          for (let j = 1; i < level;) {
            xs[i] = xs[i] * oneMinusT + xs[j] * t;
            ys[i] = ys[i] * oneMinusT + ys[j] * t;
            ++i;
            ++j;
          }
          --level;
        }
        out.x = xs[0];
        out.y = ys[0];
      }
    }
    static fromAngle(angle) {
      return new Vec2(Math.cos(angle), Math.sin(angle));
    }
  }
  Vec2.i = true;
  Object.assign(Vec2.prototype, {
    l: Vec2
  });

  // Vec4 - 4-element vector (homogeneous coords / colour quad). Used
  // mainly as a point with w=1 in 2-d scene math.
  class Vec4 {
    constructor(x, y, z, w) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    }
  }
  Vec4.i = true;
  Object.assign(Vec4.prototype, {
    l: Vec4
  });

  class Vec4Clone {
    static clone(v) {
      return new Vec4(v.x, v.y, v.z, v.w);
    }
  }
