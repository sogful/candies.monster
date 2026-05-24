  class RenderState {
    constructor(a) {
      this.type = a;
      this.cb = 0;
      this.Xr = null;
    }
    set() {}
    collapse() {
      return this;
    }
  }
  RenderState.i = true;
  Object.assign(RenderState.prototype, {
    l: RenderState
  });
  class ClipState extends RenderState {
    constructor() {
      super(1);
      this.va = null;
      this.FO = false;
      this.Gu = null;
      this.cb = ClipState.next++;
    }
    set(a) {
      a.hx(this);
    }
    fS(a) {
      let b = a.A;
      let c = a.D;
      let d = a.B - a.A;
      a = a.G - a.D;
      this.Gu = [new Vec4(b, c, 0, 1), new Vec4(b, c + a, 0, 1), new Vec4(b + d, c + a, 0, 1), new Vec4(b + d, c, 0, 1)];
    }
  }
  ClipState.i = true;
  ClipState.s = RenderState;
  Object.assign(ClipState.prototype, {
    l: ClipState
  });
  class AlphaState extends RenderState {
    constructor(a) {
      super(5);
      this.Xk = 1;
      this.collapsed = null;
      this.bf(a);
    }
    bf(a) {
      this.Xk = a < 0 ? 0 : a > 1 ? 1 : a;
      this.cb = this.Xk * 65535 | 0;
    }
    set(a) {
      a.jx(this);
    }
    collapse(a) {
      if (a.Ga == 1) {
        return this;
      }
      let b = a.top().Xk;
      let c = a.Ga - 2;
      while (c > -1) {
        b *= a.N[c--].Xk;
      }
      if (this.collapsed == null) {
        this.collapsed = new AlphaState(b);
      } else {
        this.collapsed.bf(b);
      }
      return this.collapsed;
    }
  }
  AlphaState.i = true;
  AlphaState.s = RenderState;
  Object.assign(AlphaState.prototype, {
    l: AlphaState
  });

  class BlendModeState extends RenderState {
    constructor(a, b) {
      if (b == null) {
        b = true;
      }
      super(0);
      this.Zg = a;
      this.cb = this.cb & -16 | a;
      this.QQ = b;
      this.cb &= -65537;
      if (b) {
        this.cb |= 65536;
      }
      this.blendEquation = 1;
      this.cb = this.cb & -61441 | 4096;
      this.wA = this.kE = 0;
    }
    set(a) {
      a.Uw(this);
    }
  }
  BlendModeState.i = true;
  BlendModeState.s = RenderState;
  Object.assign(BlendModeState.prototype, {
    l: BlendModeState
  });
  class ScissorState extends RenderState {
    constructor(a, b) {
      if (b == null) {
        b = 1;
      }
      super(4);
      this.zz = b;
      this.rn = a;
      this.mx(a);
      this.sS(b);
    }
    mx(a) {
      this.cb &= -257;
      if (a) {
        this.cb |= 256;
      }
      this.rn = a;
    }
    sS(a) {
      this.cb = this.cb & -256 | 1 << a;
      this.zz = a;
    }
    set(a) {
      a.PD(this);
    }
  }
  ScissorState.i = true;
  ScissorState.s = RenderState;
  Object.assign(ScissorState.prototype, {
    l: ScissorState
  });
  class DepthTestState extends RenderState {
    constructor(a, b) {
      if (b == null) {
        b = true;
      }
      super(3);
      this.rn = a;
      this.yL = b;
      this.mx(a);
      this.rS(b);
    }
    rS(a) {
      this.cb = (this.cb &= -3) | (a ? 2 : 0);
    }
    mx(a) {
      this.cb = (this.cb &= -2) | (a ? 1 : 0);
      this.rn = a;
    }
    set(a) {
      a.QD(this);
    }
  }
  DepthTestState.i = true;
  DepthTestState.s = RenderState;
  Object.assign(DepthTestState.prototype, {
    l: DepthTestState
  });
  class PassThroughState extends RenderState {
    constructor() {
      super(3);
    }
    set() {}
  }
  PassThroughState.i = true;
  PassThroughState.s = RenderState;
  Object.assign(PassThroughState.prototype, {
    l: PassThroughState
  });

  class StateNode {
    constructor(a) {
      this.state = a;
    }
  }
  StateNode.i = true;
  Object.assign(StateNode.prototype, {
    l: StateNode
  });
  class SceneTransform {
    constructor() {
      this.qB = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.Ue = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.K = 15;
      this.scale = new Vec4(1, 1, 1, 1);
      this.translate = new Vec4(0, 0, 0, 1);
      this.matrix = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    set(a) {
      var b = this.translate;
      var c = a.translate;
      b.x = c.x;
      b.y = c.y;
      b.z = c.z;
      b = this.scale;
      c = a.scale;
      b.x = c.x;
      b.y = c.y;
      b.z = c.z;
      b = this.matrix;
      c = a.matrix;
      b.m11 = c.m11;
      b.m12 = c.m12;
      b.m13 = c.m13;
      b.m21 = c.m21;
      b.m22 = c.m22;
      b.m23 = c.m23;
      b.m31 = c.m31;
      b.m32 = c.m32;
      b.m33 = c.m33;
      this.K = a.K | 240;
    }
    Tw(a) {
      this.translate.x = a.translate.x;
      this.translate.y = a.translate.y;
      this.scale.x = a.scale.x;
      this.scale.y = a.scale.y;
      let b = this.matrix;
      let c = a.matrix;
      b.m11 = c.m11;
      b.m12 = c.m12;
      b.m21 = c.m21;
      b.m22 = c.m22;
      this.K = a.K | 240;
    }
    RD() {
      let a = this.matrix;
      a.m11 = 1;
      a.m12 = 0;
      a.m21 = 0;
      a.m22 = 1;
      this.K |= 506;
    }
    PN() {
      let a;
      let b;
      if ((this.K & 8) > 0) {
        a = Math.abs(this.scale.x);
        b = Math.abs(this.scale.y);
        var c = Math.abs(this.scale.z);
      } else {
        c = this.matrix;
        a = Math.abs(c.m11) + Math.abs(c.m12) + Math.abs(c.m13);
        b = Math.abs(c.m21) + Math.abs(c.m22) + Math.abs(c.m23);
        c = Math.abs(c.m31) + Math.abs(c.m32) + Math.abs(c.m33);
      }
      return Math.max(Math.max(a, b), c);
    }
    bE(a, b) {
      let c = a.K;
      let d = b.K;
      if ((c & 1) > 0) {
        this.set(b);
      } else if ((d & 1) > 0) {
        this.set(a);
      } else if ((c & 12) == 12 && (d & 8) > 0) {
        if ((c & 2) > 0) {
          let f = b.matrix;
          let g = this.matrix;
          g.m11 = f.m11;
          g.m12 = f.m12;
          g.m13 = f.m13;
          g.m21 = f.m21;
          g.m22 = f.m22;
          g.m23 = f.m23;
          g.m31 = f.m31;
          g.m32 = f.m32;
          g.m33 = f.m33;
        } else if ((d & 2) > 0) {
          let f = a.matrix;
          let g = this.matrix;
          g.m11 = f.m11;
          g.m12 = f.m12;
          g.m13 = f.m13;
          g.m21 = f.m21;
          g.m22 = f.m22;
          g.m23 = f.m23;
          g.m31 = f.m31;
          g.m32 = f.m32;
          g.m33 = f.m33;
        } else {
          let f = a.matrix;
          let g = b.matrix;
          let h = g.m11;
          let m = g.m12;
          let n = g.m13;
          let q = g.m21;
          let p = g.m22;
          let v = g.m23;
          let u = g.m31;
          let A = g.m32;
          let D = g.m33;
          let B = f.m11 * m + f.m12 * p + f.m13 * A;
          let K = f.m11 * n + f.m12 * v + f.m13 * D;
          let E = f.m21 * m + f.m22 * p + f.m23 * A;
          let v88 = f.m21 * n + f.m22 * v + f.m23 * D;
          let v89 = f.m31 * m + f.m32 * p + f.m33 * A;
          let V = f.m31 * n + f.m32 * v + f.m33 * D;
          let v90 = this.matrix;
          v90.m11 = f.m11 * h + f.m12 * q + f.m13 * u;
          v90.m12 = B;
          v90.m13 = K;
          v90.m21 = f.m21 * h + f.m22 * q + f.m23 * u;
          v90.m22 = E;
          v90.m23 = v88;
          v90.m31 = f.m31 * h + f.m32 * q + f.m33 * u;
          v90.m32 = v89;
          v90.m33 = V;
        }
        this.K = this.K & -4 | 248;
        let e = a.scale.x;
        if ((c & 2) > 0) {
          let f = a.scale.x;
          let g = b.translate;
          let h = a.translate;
          this.translate.x = g.x * f + h.x;
          this.translate.y = g.y * f + h.y;
          this.translate.z = g.z * f + h.z;
        } else {
          let f = a.scale.x;
          let g = a.matrix;
          let h = b.translate;
          let m = h.x;
          let n = h.y;
          let q = h.z;
          let p = a.translate;
          this.translate.x = (g.m11 * m + g.m12 * n + g.m13 * q) * f + p.x;
          this.translate.y = (g.m21 * m + g.m22 * n + g.m23 * q) * f + p.y;
          this.translate.z = (g.m31 * m + g.m32 * n + g.m33 * q) * f + p.z;
        }
        this.K = this.K & -2 | 240;
        if ((d & 4) > 0) {
          this.scale.x = this.scale.y = this.scale.z = e * b.scale.x;
          this.K = this.K & -2 | 244;
        } else {
          let f = b.scale;
          this.scale.x = f.x * e;
          this.scale.y = f.y * e;
          this.scale.z = f.z * e;
          this.K = this.K & -6 | 240;
        }
      } else {
        if ((c & 8) > 0 && (d & 8) > 0) {
          let e = a.matrix;
          let f = a.scale;
          let g = f.x;
          let h = f.y;
          let m = f.z;
          let n = e.m11 * g;
          let q = e.m12 * h;
          let p = e.m13 * m;
          let v = e.m21 * g;
          let u = e.m22 * h;
          let A = e.m23 * m;
          let D = e.m31 * g;
          let B = e.m32 * h;
          let K = e.m33 * m;
          let E = b.matrix;
          let v91 = b.scale;
          let v92 = v91.x;
          let V = v91.y;
          let v93 = v91.z;
          let v94 = E.m11 * v92;
          let v95 = E.m12 * V;
          let v96 = E.m13 * v93;
          let v97 = E.m21 * v92;
          let v98 = E.m22 * V;
          let v99 = E.m23 * v93;
          let v100 = E.m31 * v92;
          let v101 = E.m32 * V;
          let v102 = E.m33 * v93;
          let v103 = this.matrix;
          v103.m11 = n * v94 + q * v97 + p * v100;
          v103.m12 = n * v95 + q * v98 + p * v101;
          v103.m13 = n * v96 + q * v99 + p * v102;
          v103.m21 = v * v94 + u * v97 + A * v100;
          v103.m22 = v * v95 + u * v98 + A * v101;
          v103.m23 = v * v96 + u * v99 + A * v102;
          v103.m31 = D * v94 + B * v97 + K * v100;
          v103.m32 = D * v95 + B * v98 + K * v101;
          v103.m33 = D * v96 + B * v99 + K * v102;
          this.K = 240;
          let v104 = b.translate;
          let v105 = v104.x;
          let v106 = v104.y;
          let v107 = v104.z;
          let v108 = a.translate;
          this.translate.x = n * v105 + q * v106 + p * v107 + v108.x;
          this.translate.y = v * v105 + u * v106 + A * v107 + v108.y;
          this.translate.z = D * v105 + B * v106 + K * v107 + v108.z;
        } else if ((c & 8) > 0) {
          let e = a.matrix;
          let f = a.scale;
          let g = f.x;
          let h = f.y;
          let m = f.z;
          let n = e.m11 * g;
          let q = e.m12 * h;
          let p = e.m13 * m;
          let v = e.m21 * g;
          let u = e.m22 * h;
          let A = e.m23 * m;
          let D = e.m31 * g;
          let B = e.m32 * h;
          let K = e.m33 * m;
          let E = b.matrix;
          let v109 = E.m11;
          let v110 = E.m12;
          let V = E.m13;
          let v111 = E.m21;
          let v112 = E.m22;
          let v113 = E.m23;
          let v114 = E.m31;
          let v115 = E.m32;
          let v116 = E.m33;
          let v117 = this.matrix;
          v117.m11 = n * v109 + q * v111 + p * v114;
          v117.m12 = n * v110 + q * v112 + p * v115;
          v117.m13 = n * V + q * v113 + p * v116;
          v117.m21 = v * v109 + u * v111 + A * v114;
          v117.m22 = v * v110 + u * v112 + A * v115;
          v117.m23 = v * V + u * v113 + A * v116;
          v117.m31 = D * v109 + B * v111 + K * v114;
          v117.m32 = D * v110 + B * v112 + K * v115;
          v117.m33 = D * V + B * v113 + K * v116;
          this.K = 240;
          let v118 = b.translate;
          let v119 = v118.x;
          let v120 = v118.y;
          let v121 = v118.z;
          let v122 = a.translate;
          this.translate.x = n * v119 + q * v120 + p * v121 + v122.x;
          this.translate.y = v * v119 + u * v120 + A * v121 + v122.y;
          this.translate.z = D * v119 + B * v120 + K * v121 + v122.z;
        } else if ((d & 8) > 0) {
          let e = a.matrix;
          let f = b.matrix;
          let g = b.scale;
          let h = g.x;
          let m = g.y;
          let n = g.z;
          let q = f.m11 * h;
          let p = f.m12 * m;
          let v = f.m13 * n;
          let u = f.m21 * h;
          let A = f.m22 * m;
          let D = f.m23 * n;
          let B = f.m31 * h;
          let K = f.m32 * m;
          let E = f.m33 * n;
          let v123 = e.m11 * p + e.m12 * A + e.m13 * K;
          let v124 = e.m11 * v + e.m12 * D + e.m13 * E;
          let V = e.m21 * p + e.m22 * A + e.m23 * K;
          let v125 = e.m21 * v + e.m22 * D + e.m23 * E;
          let v126 = e.m31 * p + e.m32 * A + e.m33 * K;
          let v127 = e.m31 * v + e.m32 * D + e.m33 * E;
          let v128 = this.matrix;
          v128.m11 = e.m11 * q + e.m12 * u + e.m13 * B;
          v128.m12 = v123;
          v128.m13 = v124;
          v128.m21 = e.m21 * q + e.m22 * u + e.m23 * B;
          v128.m22 = V;
          v128.m23 = v125;
          v128.m31 = e.m31 * q + e.m32 * u + e.m33 * B;
          v128.m32 = v126;
          v128.m33 = v127;
          this.K = 240;
          let v129 = b.translate;
          let v130 = v129.x;
          let v131 = v129.y;
          let v132 = v129.z;
          let v133 = a.translate;
          this.translate.x = e.m11 * v130 + e.m12 * v131 + e.m13 * v132 + v133.x;
          this.translate.y = e.m21 * v130 + e.m22 * v131 + e.m23 * v132 + v133.y;
          this.translate.z = e.m31 * v130 + e.m32 * v131 + e.m33 * v132 + v133.z;
        } else {
          let e = a.matrix;
          let f = b.matrix;
          let g = f.m11;
          let h = f.m12;
          let m = f.m13;
          let n = f.m21;
          let q = f.m22;
          let p = f.m23;
          let v = f.m31;
          let u = f.m32;
          let A = f.m33;
          let D = e.m11 * h + e.m12 * q + e.m13 * u;
          let B = e.m11 * m + e.m12 * p + e.m13 * A;
          let K = e.m21 * h + e.m22 * q + e.m23 * u;
          let E = e.m21 * m + e.m22 * p + e.m23 * A;
          let v134 = e.m31 * h + e.m32 * q + e.m33 * u;
          let v135 = e.m31 * m + e.m32 * p + e.m33 * A;
          let V = this.matrix;
          V.m11 = e.m11 * g + e.m12 * n + e.m13 * v;
          V.m12 = D;
          V.m13 = B;
          V.m21 = e.m21 * g + e.m22 * n + e.m23 * v;
          V.m22 = K;
          V.m23 = E;
          V.m31 = e.m31 * g + e.m32 * n + e.m33 * v;
          V.m32 = v134;
          V.m33 = v135;
          this.K = 240;
          let v136 = b.translate;
          let v137 = v136.x;
          let v138 = v136.y;
          let v139 = v136.z;
          let v140 = a.translate;
          this.translate.x = e.m11 * v137 + e.m12 * v138 + e.m13 * v139 + v140.x;
          this.translate.y = e.m21 * v137 + e.m22 * v138 + e.m23 * v139 + v140.y;
          this.translate.z = e.m31 * v137 + e.m32 * v138 + e.m33 * v139 + v140.z;
        }
        this.K = this.K & -2 | 240;
      }
    }
    cE(a, b) {
      var c = a.K;
      var d = b.K;
      if ((c & 1) > 0) {
        this.Tw(b);
      } else if ((d & 1) > 0) {
        this.Tw(a);
      } else if ((c & 12) == 12 && (d & 8) > 0) {
        if ((c & 2) > 0) {
          var e = b.matrix;
          var f = this.matrix;
          f.m11 = e.m11;
          f.m12 = e.m12;
          f.m21 = e.m21;
          f.m22 = e.m22;
        } else if ((d & 2) > 0) {
          e = a.matrix;
          f = this.matrix;
          f.m11 = e.m11;
          f.m12 = e.m12;
          f.m21 = e.m21;
          f.m22 = e.m22;
        } else {
          e = a.matrix;
          var g = b.matrix;
          f = g.m11;
          var h = g.m12;
          var m = g.m21;
          var n = g.m22;
          g = e.m11 * h + e.m12 * n;
          h = e.m21 * h + e.m22 * n;
          n = this.matrix;
          n.m11 = e.m11 * f + e.m12 * m;
          n.m12 = g;
          n.m21 = e.m21 * f + e.m22 * m;
          n.m22 = h;
        }
        this.K = this.K & -4 | 504;
        e = a.scale.x;
        if ((c & 2) > 0) {
          c = a.scale.x;
          f = b.translate;
          a = a.translate;
          this.translate.x = f.x * c + a.x;
          this.translate.y = f.y * c + a.y;
        } else {
          c = a.scale.x;
          f = a.matrix;
          g = b.translate;
          m = g.x;
          g = g.y;
          a = a.translate;
          this.translate.x = (f.m11 * m + f.m12 * g) * c + a.x;
          this.translate.y = (f.m21 * m + f.m22 * g) * c + a.y;
        }
        this.K = this.K & -2 | 496;
        if ((d & 4) > 0) {
          this.scale.x = this.scale.y = e * b.scale.x;
          this.K = this.K & -2 | 500;
        } else {
          a = b.scale;
          this.scale.x = a.x * e;
          this.scale.y = a.y * e;
          this.K = this.K & -6 | 496;
        }
      } else {
        if ((c & 8) > 0 && (d & 8) > 0) {
          f = a.matrix;
          d = a.scale;
          e = d.x;
          m = d.y;
          d = f.m11 * e;
          c = f.m12 * m;
          e *= f.m21;
          f = f.m22 * m;
          h = b.matrix;
          m = b.scale;
          n = m.x;
          var q = m.y;
          m = h.m11 * n;
          g = h.m12 * q;
          n *= h.m21;
          h = h.m22 * q;
          q = this.matrix;
          q.m11 = d * m + c * n;
          q.m12 = d * g + c * h;
          q.m21 = e * m + f * n;
          q.m22 = e * g + f * h;
          this.K = this.K & -16 | 496;
          m = b.translate;
          b = m.x;
          m = m.y;
          a = a.translate;
          this.translate.x = d * b + c * m + a.x;
          this.translate.y = e * b + f * m + a.y;
        } else if ((c & 8) > 0) {
          f = a.matrix;
          d = a.scale;
          e = d.x;
          m = d.y;
          d = f.m11 * e;
          c = f.m12 * m;
          e *= f.m21;
          f = f.m22 * m;
          n = b.matrix;
          m = n.m11;
          g = n.m12;
          h = n.m21;
          n = n.m22;
          q = this.matrix;
          q.m11 = d * m + c * h;
          q.m12 = d * g + c * n;
          q.m21 = e * m + f * h;
          q.m22 = e * g + f * n;
          this.K = this.K & -16 | 496;
          m = b.translate;
          b = m.x;
          m = m.y;
          a = a.translate;
          this.translate.x = d * b + c * m + a.x;
          this.translate.y = e * b + f * m + a.y;
        } else if ((d & 8) > 0) {
          d = a.matrix;
          m = b.matrix;
          c = b.scale;
          e = c.x;
          g = c.y;
          c = m.m11 * e;
          f = m.m12 * g;
          e *= m.m21;
          g *= m.m22;
          m = d.m11 * f + d.m12 * g;
          f = d.m21 * f + d.m22 * g;
          g = this.matrix;
          g.m11 = d.m11 * c + d.m12 * e;
          g.m12 = m;
          g.m21 = d.m21 * c + d.m22 * e;
          g.m22 = f;
          this.K = this.K & -16 | 496;
          c = b.translate;
          b = c.x;
          c = c.y;
          a = a.translate;
          this.translate.x = d.m11 * b + d.m12 * c + a.x;
          this.translate.y = d.m21 * b + d.m22 * c + a.y;
        } else {
          d = a.matrix;
          f = b.matrix;
          c = f.m11;
          m = f.m12;
          e = f.m21;
          g = f.m22;
          f = d.m11 * m + d.m12 * g;
          m = d.m21 * m + d.m22 * g;
          g = this.matrix;
          g.m11 = d.m11 * c + d.m12 * e;
          g.m12 = f;
          g.m21 = d.m21 * c + d.m22 * e;
          g.m22 = m;
          this.K = this.K & -16 | 496;
          c = b.translate;
          b = c.x;
          c = c.y;
          a = a.translate;
          this.translate.x = d.m11 * b + d.m12 * c + a.x;
          this.translate.y = d.m21 * b + d.m22 * c + a.y;
        }
        this.K = this.K & -2 | 496;
      }
    }
    UL(a, b) {
      if ((this.K & 16) > 0) {
        this.nt();
      }
      let c = this.Ue;
      let d = a.x;
      let e = a.y;
      a = a.z;
      b.x = c.m11 * d + c.m12 * e + c.m13 * a + c.m14;
      b.y = c.m21 * d + c.m22 * e + c.m23 * a + c.m24;
      b.z = c.m31 * d + c.m32 * e + c.m33 * a + c.m34;
      return b;
    }
    Jb(a, b) {
      if ((this.K & 64) > 0) {
        this.Tm();
      }
      let c = this.Ue;
      let d = c.m21 * a.x + c.m22 * a.y + c.m24;
      b.x = c.m11 * a.x + c.m12 * a.y + c.m14;
      b.y = d;
      return b;
    }
    gg(a, b) {
      if ((this.K & 128) > 0) {
        this.nT();
      }
      let c = this.qB;
      let d = c.m21 * a.x + c.m22 * a.y + c.m24;
      b.x = c.m11 * a.x + c.m12 * a.y + c.m14;
      b.y = d;
      return b;
    }
    nt() {
      let a = this.Ue;
      if ((this.K & 1) > 0) {
        a.m11 = 1;
        a.m12 = 0;
        a.m13 = 0;
        a.m21 = 0;
        a.m22 = 1;
        a.m23 = 0;
        a.m31 = 0;
        a.m32 = 0;
        a.m33 = 1;
        a.m14 = 0;
        a.m24 = 0;
        a.m34 = 0;
      } else {
        var b = this.matrix;
        if ((this.K & 8) > 0) {
          let c = this.scale.x;
          let d = this.scale.y;
          let e = this.scale.z;
          a.m11 = b.m11 * c;
          a.m12 = b.m12 * d;
          a.m13 = b.m13 * e;
          a.m21 = b.m21 * c;
          a.m22 = b.m22 * d;
          a.m23 = b.m23 * e;
          a.m31 = b.m31 * c;
          a.m32 = b.m32 * d;
          a.m33 = b.m33 * e;
        } else {
          a.m11 = b.m11;
          a.m12 = b.m12;
          a.m13 = b.m13;
          a.m21 = b.m21;
          a.m22 = b.m22;
          a.m23 = b.m23;
          a.m31 = b.m31;
          a.m32 = b.m32;
          a.m33 = b.m33;
        }
        b = this.translate;
        a.m14 = b.x;
        a.m24 = b.y;
        a.m34 = b.z;
      }
      this.K &= -81;
    }
    Tm() {
      let a = this.Ue;
      if ((this.K & 1) > 0) {
        a.m11 = 1;
        a.m12 = 0;
        a.m21 = 0;
        a.m22 = 1;
        a.m14 = 0;
        a.m24 = 0;
      } else {
        let c = this.matrix;
        if ((this.K & 8) > 0) {
          var b = this.scale;
          let d = b.x;
          b = b.y;
          a.m11 = c.m11 * d;
          a.m12 = c.m12 * b;
          a.m21 = c.m21 * d;
          a.m22 = c.m22 * b;
        } else {
          a.m11 = c.m11;
          a.m12 = c.m12;
          a.m21 = c.m21;
          a.m22 = c.m22;
        }
        a.m14 = this.translate.x;
        a.m24 = this.translate.y;
      }
      this.K &= -65;
    }
    nT() {
      let a = this.qB;
      var b = this.matrix;
      if ((this.K & 1) > 0) {
        a.m11 = 1;
        a.m12 = 0;
        a.m21 = 0;
        a.m22 = 1;
        a.m14 = 0;
        a.m24 = 0;
      } else {
        if ((this.K & 8) > 0) {
          if ((this.K & 12) == 12) {
            var c = 1 / this.scale.x;
            var d = b.m12 * c;
            a.m11 = b.m11 * c;
            a.m12 = b.m21 * c;
            a.m21 = d;
            a.m22 = b.m22 * c;
          } else {
            c = this.scale;
            var e = c.x;
            var f = c.y;
            c = b.m11 * e;
            d = b.m12 * f;
            e *= b.m21;
            b = b.m22 * f;
            f = 1 / (c * b - d * e);
            a.m11 = b * f;
            a.m12 = -d * f;
            a.m21 = -e * f;
            a.m22 = c * f;
          }
        } else {
          if ((this.K & 64) > 0) {
            this.Tm();
          }
          b = this.Ue;
          c = 1 / (b.m11 * b.m22 - b.m12 * b.m21);
          d = b.m11 * c;
          a.m11 = b.m22 * c;
          a.m12 = -b.m12 * c;
          a.m21 = -b.m21 * c;
          a.m22 = d;
        }
        a.m14 = -(a.m11 * this.translate.x + a.m12 * this.translate.y);
        a.m24 = -(a.m21 * this.translate.x + a.m22 * this.translate.y);
      }
      this.K &= -129;
    }
  }
  SceneTransform.i = true;
  Object.assign(SceneTransform.prototype, {
    l: SceneTransform
  });
