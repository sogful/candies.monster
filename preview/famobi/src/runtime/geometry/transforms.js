  // Mat4 - row-major 4x4 matrix. mNM = row N, col M (1-indexed).
  // Defaults are written explicitly because the engine constructs
  // matrices in tight loops where avoiding default-value lookups
  // matters.
  class Mat4 {
    constructor(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
      this.m11 = m11; this.m12 = m12; this.m13 = m13; this.m14 = m14;
      this.m21 = m21; this.m22 = m22; this.m23 = m23; this.m24 = m24;
      this.m31 = m31; this.m32 = m32; this.m33 = m33; this.m34 = m34;
      this.m41 = m41; this.m42 = m42; this.m43 = m43; this.m44 = m44;
    }
  }
  Mat4.i = true;
  Object.assign(Mat4.prototype, {
    l: Mat4
  });

  // TransformStack - per-node transform state. localM = this node's
  // local matrix, parentM = parent's accumulated world matrix at the
  // time recomputeWorld() runs, worldM = cached parentM * localM.
  // projectPoint() pushes a point through worldM into viewport pixels.
  class TransformStack {
    constructor() {
      this.localM = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.parentM = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.worldM = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    // recomputeWorld - worldM = parentM * localM.
    recomputeWorld() {
      let a = this.parentM;
      let b = this.localM;
      this.worldM = new Mat4(
        a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * b.m31 + a.m14 * b.m41,
        a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * b.m32 + a.m14 * b.m42,
        a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * b.m33 + a.m14 * b.m43,
        a.m11 * b.m14 + a.m12 * b.m24 + a.m13 * b.m34 + a.m14 * b.m44,
        a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * b.m31 + a.m24 * b.m41,
        a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * b.m32 + a.m24 * b.m42,
        a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * b.m33 + a.m24 * b.m43,
        a.m21 * b.m14 + a.m22 * b.m24 + a.m23 * b.m34 + a.m24 * b.m44,
        a.m31 * b.m11 + a.m32 * b.m21 + a.m33 * b.m31 + a.m34 * b.m41,
        a.m31 * b.m12 + a.m32 * b.m22 + a.m33 * b.m32 + a.m34 * b.m42,
        a.m31 * b.m13 + a.m32 * b.m23 + a.m33 * b.m33 + a.m34 * b.m43,
        a.m31 * b.m14 + a.m32 * b.m24 + a.m33 * b.m34 + a.m34 * b.m44,
        a.m41 * b.m11 + a.m42 * b.m21 + a.m43 * b.m31 + a.m44 * b.m41,
        a.m41 * b.m12 + a.m42 * b.m22 + a.m43 * b.m32 + a.m44 * b.m42,
        a.m41 * b.m13 + a.m42 * b.m23 + a.m43 * b.m33 + a.m44 * b.m43,
        a.m41 * b.m14 + a.m42 * b.m24 + a.m43 * b.m34 + a.m44 * b.m44
      );
    }
    // projectPoint - push Vec4 `point` through worldM and map into a
    // Rect `viewport` (.x/.y origin, .w/.h size). Returns a Vec4 with
    // z=0, w=1 ready to feed straight into screen-space code.
    projectPoint(point, viewport) {
      let m = this.worldM;
      let x = point.x;
      let y = point.y;
      let z = point.z;
      let w = point.w;
      let invW = 1 / (m.m41 * x + m.m42 * y + m.m43 * z + m.m44 * w);
      let halfW = viewport.w / 2;
      let halfH = viewport.h / 2;
      let nx = (m.m11 * x + m.m12 * y + m.m13 * z + m.m14 * w) * invW;
      let ny = (m.m21 * x + m.m22 * y + m.m23 * z + m.m24 * w) * invW;
      return new Vec4(halfW * nx + ny * 0 + (halfW + viewport.x),
                      nx * 0 + -halfH * ny + (halfH + viewport.y),
                      0, 1);
    }
  }
  TransformStack.i = true;
  Object.assign(TransformStack.prototype, {
    l: TransformStack
  });

  // ColorTransform - per-node colour tint (multiply `$b` + add
  // `offset`). hint is a fast-path flag: 1 = alpha-only multiply
  // (most common during fades), 2 = brightness ramp set by Vw,
  // 0 = arbitrary.
  class ColorTransform {
    constructor() {
      this.hint = 0;
      this.offset = new Vec4(0, 0, 0, 0);
      this.mul = new Vec4(1, 1, 1, 1);
    }
    set(other) {
      let mulHere = this.mul;
      let mulOther = other.mul;
      mulHere.x = mulOther.x;
      mulHere.y = mulOther.y;
      mulHere.z = mulOther.z;
      mulHere.w = mulOther.w;
      let offHere = this.offset;
      let offOther = other.offset;
      offHere.x = offOther.x;
      offHere.y = offOther.y;
      offHere.z = offOther.z;
      offHere.w = offOther.w;
      this.hint = other.hint;
    }
    // Vw - brightness ramp. Positive `b` brightens toward white,
    // negative `b` darkens toward black, ±1 are full extremes.
    brightness(b) {
      if (b >= 0) {
        this.mul.x = 1 - b;
        this.mul.y = 1 - b;
        this.mul.z = 1 - b;
        this.offset.x = b;
        this.offset.y = b;
        this.offset.z = b;
      } else {
        this.mul.x = b + 1;
        this.mul.y = b + 1;
        this.mul.z = b + 1;
        this.offset.x = 0;
        this.offset.y = 0;
        this.offset.z = 0;
      }
      this.mul.w = 1;
      this.offset.w = 0;
      this.hint = 2;
      return this;
    }
    // concat - left-multiply this transform by `other`. Fast path
    // for alpha-only x alpha-only stays alpha-only.
    concat(other) {
      if (this.hint == 1 && other.hint == 1) {
        this.mul.w *= other.mul.w;
        return this;
      }
      let off = this.offset;
      let mul = this.mul;
      let mulOther = other.mul;
      let offOther = other.offset;
      mul.x *= mulOther.x;
      mul.y *= mulOther.y;
      mul.z *= mulOther.z;
      mul.w *= mulOther.w;
      off.x = mulOther.x * off.x + offOther.x;
      off.y = mulOther.y * off.y + offOther.y;
      off.z = mulOther.z * off.z + offOther.z;
      off.w = mulOther.w * off.w + offOther.w;
      this.hint = 0;
      return this;
    }
  }
  ColorTransform.i = true;
  Object.assign(ColorTransform.prototype, {
    l: ColorTransform
  });

  // ColorTransformState - RenderState entry. collapse() folds an entire
  // bucket (Stack of stacked transforms) into a single equivalent
  // transform so the GPU only sees one upload per draw.
  class ColorTransformState extends RenderState {
    constructor(other) {
      super(2);
      this.transform = new ColorTransform();
      if (other != null) {
        this.transform.set(other);
      }
      this.collapsed = null;
      this.key = ColorTransformState.next++;
    }
    set(renderer) {
      renderer.applyColorTransform(this);
    }
    collapse(stack) {
      if (stack.count == 1) return this;
      if (this.collapsed == null) {
        this.collapsed = new ColorTransformState();
      }
      let acc = this.collapsed.transform;
      acc.set(stack.top().transform);
      let i = stack.count - 2;
      while (i > -1) {
        acc.concat(stack.array[i--].transform);
      }
      return this.collapsed;
    }
  }
  ColorTransformState.i = true;
  ColorTransformState.s = RenderState;
  Object.assign(ColorTransformState.prototype, {
    l: ColorTransformState
  });
