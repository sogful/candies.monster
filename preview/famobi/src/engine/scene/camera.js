  class LevelCamera {
    constructor() {
      this.Kb = new Vec4(0.5, 0.5, 0, 1);
      this.g = new Vec4(0, 0, 0, 1);
      this.Ok = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
      this.Ab = new Camera();
    }
    PO(a, b) {
      var c = Application.instance.window;
      var d = c.V.viewport;
      var e = c.Hc.x;
      var f = c.Hc.y;
      c = d.x * e | 0;
      let g = d.y * f | 0;
      e = d.w * e | 0;
      d = d.J * f | 0;
      let h = this.Ab.pk;
      let m = 1 / (h.m41 * a + h.m42 * b + h.m43 * 0 + h.m44);
      let n = e / 2;
      f = d / 2;
      let q = (h.m11 * a + h.m12 * b + h.m13 * 0 + h.m14) * m;
      a = (h.m21 * a + h.m22 * b + h.m23 * 0 + h.m24) * m;
      b = n * q + a * 0 + (n + c);
      a = q * 0 + -f * a + (f + g);
      if (b + 400 < 0 || a + 400 < 0 || b - 200 > c + e || a - 200 > g + d) {
        return false;
      } else {
        return true;
      }
    }
    MN(a, b) {
      let c = Application.instance.window.lo();
      a = this.Ab.rF(new Vec4(a, b, 0, 1), c);
      return Math.min(a.y, c.y + c.J - a.y);
    }
    NN(a, b) {
      let c = Application.instance.window.lo();
      a = this.Ab.rF(new Vec4(a, b, 0, 1), c);
      return Math.min(a.x, c.x + c.w - a.x);
    }
    update() {
      var a = Application.instance.window.pi();
      var b = this.Ok;
      var c = this.Ok;
      c = Math.min(a.x / (b.B - b.A), a.y / (c.G - c.D));
      this.Ab.Lb(new Vec4(a.x, a.y, 0, 1));
      this.Ab.qS(c);
      this.Ab.centerPivot();
      var d = b = this.Ok;
      d = new Bounds(0, 0, a.x, a.y).hi((b.B - b.A) / (d.G - d.D));
      b = (a.x - (d.B - d.A)) / c / 2;
      a = (a.y - (d.G - d.D)) / c / 2;
      c = this.Ab;
      d = c.position;
      d.x = this.g.x + (b + (-b - b) * this.Kb.x);
      d.y = this.g.y + (a + (-a - a) * this.Kb.y);
      c.Sr();
    }
  }
  LevelCamera.i = true;
  Object.assign(LevelCamera.prototype, {
    l: LevelCamera
  });
