  class Mat4 {
    constructor(a, b, c, d, e, f, g, h, m, n, q, p, v, u, A, D) {
      this.m11 = a;
      this.m12 = b;
      this.m13 = c;
      this.m14 = d;
      this.m21 = e;
      this.m22 = f;
      this.m23 = g;
      this.m24 = h;
      this.m31 = m;
      this.m32 = n;
      this.m33 = q;
      this.m34 = p;
      this.m41 = v;
      this.m42 = u;
      this.m43 = A;
      this.m44 = D;
    }
  }
  Mat4.i = true;
  Object.assign(Mat4.prototype, {
    l: Mat4
  });
  class TransformStack {
    constructor() {
      this.Wm = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.hD = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.pk = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    pT() {
      let a = this.hD;
      let b = this.Wm;
      this.pk = new Mat4(a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * b.m31 + a.m14 * b.m41, a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * b.m32 + a.m14 * b.m42, a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * b.m33 + a.m14 * b.m43, a.m11 * b.m14 + a.m12 * b.m24 + a.m13 * b.m34 + a.m14 * b.m44, a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * b.m31 + a.m24 * b.m41, a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * b.m32 + a.m24 * b.m42, a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * b.m33 + a.m24 * b.m43, a.m21 * b.m14 + a.m22 * b.m24 + a.m23 * b.m34 + a.m24 * b.m44, a.m31 * b.m11 + a.m32 * b.m21 + a.m33 * b.m31 + a.m34 * b.m41, a.m31 * b.m12 + a.m32 * b.m22 + a.m33 * b.m32 + a.m34 * b.m42, a.m31 * b.m13 + a.m32 * b.m23 + a.m33 * b.m33 + a.m34 * b.m43, a.m31 * b.m14 + a.m32 * b.m24 + a.m33 * b.m34 + a.m34 * b.m44, a.m41 * b.m11 + a.m42 * b.m21 + a.m43 * b.m31 + a.m44 * b.m41, a.m41 * b.m12 + a.m42 * b.m22 + a.m43 * b.m32 + a.m44 * b.m42, a.m41 * b.m13 + a.m42 * b.m23 + a.m43 * b.m33 + a.m44 * b.m43, a.m41 * b.m14 + a.m42 * b.m24 + a.m43 * b.m34 + a.m44 * b.m44);
    }
    rF(a, b) {
      var c = this.pk;
      let d = a.x;
      let e = a.y;
      let f = a.z;
      let g = a.w;
      let h = 1 / (c.m41 * d + c.m42 * e + c.m43 * f + c.m44 * g);
      a = b.w / 2;
      let m = b.J / 2;
      let n = (c.m11 * d + c.m12 * e + c.m13 * f + c.m14 * g) * h;
      c = (c.m21 * d + c.m22 * e + c.m23 * f + c.m24 * g) * h;
      return new Vec4(a * n + c * 0 + (a + b.x), n * 0 + -m * c + (m + b.y), 0, 1);
    }
  }
  TransformStack.i = true;
  Object.assign(TransformStack.prototype, {
    l: TransformStack
  });
  class ColorTransform {
    constructor() {
      this.hint = 0;
      this.offset = new Vec4(0, 0, 0, 0);
      this.$b = new Vec4(1, 1, 1, 1);
    }
    set(a) {
      var b = this.$b;
      var c = a.$b;
      b.x = c.x;
      b.y = c.y;
      b.z = c.z;
      b.w = c.w;
      b = this.offset;
      c = a.offset;
      b.x = c.x;
      b.y = c.y;
      b.z = c.z;
      b.w = c.w;
      this.hint = a.hint;
    }
    Vw(a) {
      if (a >= 0) {
        this.$b.x = 1 - a;
        this.$b.y = 1 - a;
        this.$b.z = 1 - a;
        this.offset.x = a;
        this.offset.y = a;
        this.offset.z = a;
      } else {
        this.$b.x = a + 1;
        this.$b.y = a + 1;
        this.$b.z = a + 1;
        this.offset.x = 0;
        this.offset.y = 0;
        this.offset.z = 0;
      }
      this.$b.w = 1;
      this.offset.w = 0;
      this.hint = 2;
      return this;
    }
    concat(a) {
      if (this.hint == 1 && a.hint == 1) {
        this.$b.w *= a.$b.w;
        return this;
      }
      let b = this.offset;
      let c = this.$b;
      let d = a.$b;
      a = a.offset;
      c.x *= d.x;
      c.y *= d.y;
      c.z *= d.z;
      c.w *= d.w;
      b.x = d.x * b.x + a.x;
      b.y = d.y * b.y + a.y;
      b.z = d.z * b.z + a.z;
      b.w = d.w * b.w + a.w;
      this.hint = 0;
      return this;
    }
  }
  ColorTransform.i = true;
  Object.assign(ColorTransform.prototype, {
    l: ColorTransform
  });
  class ColorTransformState extends RenderState {
    constructor(a) {
      super(2);
      this.transform = new ColorTransform();
      if (a != null) {
        this.transform.set(a);
      }
      this.collapsed = null;
      this.cb = ColorTransformState.next++;
    }
    set(a) {
      a.Xw(this);
    }
    collapse(a) {
      if (a.Ga == 1) {
        return this;
      }
      if (this.collapsed == null) {
        this.collapsed = new ColorTransformState();
      }
      let b = this.collapsed.transform;
      b.set(a.top().transform);
      let c = a.Ga - 2;
      while (c > -1) {
        b.concat(a.N[c--].transform);
      }
      return this.collapsed;
    }
  }
  ColorTransformState.i = true;
  ColorTransformState.s = RenderState;
  Object.assign(ColorTransformState.prototype, {
    l: ColorTransformState
  });
