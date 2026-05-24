  class Renderer {
    constructor(a) {
      this.name = a;
      this.info = new RendererInfo(this);
      this.rf = null;
      this.IP = 256;
      this.YO = 0.001;
      this.Ab = this.Wb = null;
      this.gA = [];
      this.clearColor = new Vec4(0, 0, 0, 1);
      this.sA = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.CM = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.viewport = new TexRect(0, 0, 1, 1);
      this.Jq = Array(1056);
      this.vl = Array(1056);
      this.wT = true;
      this.rs = Array(7);
      this.dh = Array(7);
      this.un = BitMaskTable.zG[7];
      this.od = 0;
      this.Ex = [];
      this.Wx = new ArrayList();
      this.dh[0] = new BlendModeState(1, true);
      this.dh[1] = new ClipState();
      this.dh[2] = new ColorTransformState();
      this.dh[3] = new DepthTestState(true, true);
      this.dh[4] = new ScissorState(false, 1);
      this.dh[5] = new AlphaState(1);
      this.dh[6] = new PassThroughState();
    }
    tp(a) {
      if (this.Wb != null) {
        this.Wb.dE(null);
      }
      this.Wb = a;
      this.Wb.dE(this);
    }
    MR(a) {
      let b = this.clearColor;
      b.x = a.x;
      b.y = a.y;
      b.z = a.z;
      b.w = a.w;
    }
    wk(a) {
      this.Ab = a;
    }
    cR(a) {
      this.gA.push(this.Ab);
      this.wk(a);
    }
    WQ() {
      this.wk(this.gA.pop());
    }
    Bm() {
      this.Bk(0, 0, 1, 1);
    }
    Bk(a, b, c, d) {
      let e = this.viewport;
      e.x = a;
      e.y = b;
      e.w = c - a;
      e.J = d - b;
    }
    Gi() {
      if (this.Wb == null || this.Wb.getContext() == null || this.Wb.size.x * this.Wb.size.y == 0) {
        return false;
      }
      this.uR();
      return true;
    }
    fi() {}
    Iq(a) {
      let b = this.Wx;
      b.clear();
      b.reserve(SceneNode.count);
      NodeTreeUtil.CN(a, b);
      if (b.ba > 0) {
        this.Uu(b);
      }
    }
    clear() {}
    uR() {
      this.od = 0;
      let a = this.un;
      let b = 0;
      while (b < 7) {
        let c = b++;
        this.rs[c] = this.dh[c];
        if ((a & 1 << c) != 0) {
          this.rs[c].set(this);
        }
      }
    }
    Uu(a) {
      let b = a.N;
      let c = 0;
      for (a = a.ba; c < a;) {
        this.ul(b[c++]);
      }
    }
    ul(a) {
      let b = a.effect;
      if (b != null && b.enabled && a.Ne != 1) {
        this.rf = a;
        this.Bh(a);
        this.Wn(b);
      }
    }
    $N() {
      return this.Ex.slice();
    }
    createTexture(a, b, c, d) {
      if (b == null) {
        b = 0;
      }
      b = this.Iv(b);
      this.Ex.push(b);
      b.name = d;
      b.ax(a);
      if (c != null) {
        b.IR(c);
      }
      return b;
    }
    rA(a, b, c) {
      let d = this.Iv(a.flags);
      d.name = c == null ? "-" : c;
      a.oa(d, b.clone());
      if (c != null) {
        a = a.hc.yf(c);
        d.hc.offset(a.Od.x, a.Od.y);
      }
    }
    ia(a) {
      a.free();
      Std.remove(this.Ex, a);
    }
    WA(a, b) {
      a = (b / 100 | 0) * 32 + (a / 100 | 0);
      b = this.Jq[a];
      if (b != null && !this.vl[a]) {
        this.vl[a] = true;
        b.ib(this);
      }
      return b;
    }
    XA(a, b) {
      a = 512 + (b / 100 | 0) * 32 + (a / 100 | 0);
      b = this.Jq[a];
      if (b != null && !this.vl[a]) {
        this.vl[a] = true;
        b.ib(this);
      }
      return b;
    }
    md(a) {
      var b;
      if (b == null) {
        b = false;
      }
      let c = a.AA / 100 | 0;
      var d = a.Xx / 100 | 0;
      d = (b ? 1 : 0) * 512 + d * 32 + c;
      this.Jq[d] = a;
      let e = a.Xx == 201;
      if (e) {
        let f = 0;
        while (f < 16) {
          d = f++ + 1;
          d = (b ? 1 : 0) * 512 + d * 32 + c;
          this.Jq[d] = a;
        }
      }
      if (this.wT && (a.ib(this), this.vl[d] = true, e)) {
        for (a = 0; a < 16;) {
          d = a++ + 1;
          d = (b ? 1 : 0) * 512 + d * 32 + c;
          this.vl[d] = true;
        }
      }
    }
    MM() {
      this.un &= -9;
    }
    ko(a) {
      let b = this.sA;
      let c = this.Ab.pk;
      if ((a.K & 240) > 0) {
        a.nt();
      }
      var d = a.Ue;
      a = d.m11;
      var e = d.m12;
      var f = d.m13;
      var g = d.m14;
      let h = d.m21;
      let m = d.m22;
      let n = d.m23;
      let q = d.m24;
      let p = d.m31;
      let v = d.m32;
      let u = d.m33;
      let A = d.m34;
      let D = d.m41;
      let B = d.m42;
      let K = d.m43;
      let E = d.m44;
      d = c.m11 * e + c.m12 * m + c.m13 * v + c.m14 * B;
      let v54 = c.m11 * f + c.m12 * n + c.m13 * u + c.m14 * K;
      let v55 = c.m11 * g + c.m12 * q + c.m13 * A + c.m14 * E;
      let V = c.m21 * e + c.m22 * m + c.m23 * v + c.m24 * B;
      let v56 = c.m21 * f + c.m22 * n + c.m23 * u + c.m24 * K;
      let v57 = c.m21 * g + c.m22 * q + c.m23 * A + c.m24 * E;
      let v58 = c.m31 * e + c.m32 * m + c.m33 * v + c.m34 * B;
      let v59 = c.m31 * f + c.m32 * n + c.m33 * u + c.m34 * K;
      let v60 = c.m31 * g + c.m32 * q + c.m33 * A + c.m34 * E;
      e = c.m41 * e + c.m42 * m + c.m43 * v + c.m44 * B;
      f = c.m41 * f + c.m42 * n + c.m43 * u + c.m44 * K;
      g = c.m41 * g + c.m42 * q + c.m43 * A + c.m44 * E;
      b.m11 = c.m11 * a + c.m12 * h + c.m13 * p + c.m14 * D;
      b.m12 = d;
      b.m13 = v54;
      b.m14 = v55;
      b.m21 = c.m21 * a + c.m22 * h + c.m23 * p + c.m24 * D;
      b.m22 = V;
      b.m23 = v56;
      b.m24 = v57;
      b.m31 = c.m31 * a + c.m32 * h + c.m33 * p + c.m34 * D;
      b.m32 = v58;
      b.m33 = v59;
      b.m34 = v60;
      b.m41 = c.m41 * a + c.m42 * h + c.m43 * p + c.m44 * D;
      b.m42 = e;
      b.m43 = f;
      b.m44 = g;
      return b;
    }
    oi(a) {
      if ((a.K & 64) > 0) {
        a.Tm();
      }
      var b = a.Ue;
      a = b.m11;
      var c = b.m12;
      var d = b.m14;
      let e = b.m21;
      let f = b.m22;
      let g = b.m24;
      b = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      let h = this.Ab.pk;
      let m = h.m11 * c + h.m12 * f;
      let n = h.m11 * d + h.m12 * g + h.m14;
      c = h.m21 * c + h.m22 * f;
      d = h.m21 * d + h.m22 * g + h.m24;
      b.m11 = h.m11 * a + h.m12 * e;
      b.m12 = m;
      b.m14 = n;
      b.m21 = h.m21 * a + h.m22 * e;
      b.m22 = c;
      b.m24 = d;
      return b;
    }
    Wn(a) {
      a.update(this);
      let b = this.WA(a.type, this.rf.type);
      if (b != null) {
        this.info.effect = a;
        this.info.va = this.rf;
        b.M(this.info);
      }
    }
    li(a) {
      return this.rs[a];
    }
    Bh(a) {
      if (this.un != 0) {
        var b = this.rs;
        for (var c = 0, d = this.un, e = this.od; c < 7;) {
          if ((d & 1 << c) == 0) {
            ++c;
            continue;
          }
          let f = a.Jk[c];
          if (f != null) {
            if (f.cb != b[c].cb) {
              b[c] = f;
              e |= 1 << c;
              f.set(this);
            }
          } else if ((e & 1 << c) > 0) {
            f = this.dh[c];
            b[c] = f;
            f.set(this);
            e &= ~(1 << c);
          }
          ++c;
        }
        this.od = e;
      }
    }
    jx() {}
    QD() {}
    PD() {}
    Uw() {}
    Xw() {}
    hx() {}
    jB(a) {
      return a.Db.translate.z * -0.001;
    }
  }
  Renderer.i = true;
  Object.assign(Renderer.prototype, {
    l: Renderer
  });
  class CanvasRenderer extends Renderer {
    constructor() {
      function a() {
        let c = window.document.createElement("canvas").getContext("2d", {
          alpha: true,
          willReadFrequently: true
        });
        c.canvas.width = 1024;
        c.canvas.height = 1024;
        return c;
      }
      super("2d");
      this.TL = 0;
      this.bb = this.context = null;
      this.ai = new ColorTransform();
      this.globalAlpha = 1;
      this.Kr = this.Zg = null;
      this.LB = false;
      this.Bj = 0;
      this.Tx = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.globalCompositeOperation = null;
      var b = this.rM = Array(5);
      b[0] = "source-over";
      b[1] = "source-over";
      b[2] = "multiply";
      b[3] = "lighter";
      b[4] = "screen";
      this.Lu = [null];
      for (b = 0; b < 3;) {
        ++b;
        let c = a();
        this.Lu.push(c);
      }
      this.GP = a();
      new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
    }
    tp(a) {
      super.tp(a);
      this.context = a.getContext();
      this.Lu[0] = this.context;
    }
    clear(a) {
      super.clear();
      if (a == null) {
        a = this.clearColor;
      }
      var b = this.Wb;
      let c = this.viewport;
      let d = b.size.x * c.x | 0;
      let e = b.size.y * c.y | 0;
      let f = b.size.x * c.w | 0;
      b = b.size.y * c.J | 0;
      this.clearRect(d, e, f, b);
      if (a.w != 0) {
        this.Vi("rgba(" + ((a.x * 255 | 0) & 255) + "," + ((a.y * 255 | 0) & 255) + "," + ((a.z * 255 | 0) & 255) + "," + a.w.toFixed(2) + ")");
        this.fillRect(d, e, f, b);
      }
    }
    Gi() {
      if (!super.Gi()) {
        return false;
      }
      this.bb = this.context;
      try {
        this.context.reset();
      } catch (a) {}
      this.bb.fillStyle = "#000000";
      this.globalAlpha = 1;
      this.Bm();
      this.context.save();
      this.Qx();
      return true;
    }
    fi() {
      for (super.fi(); this.Bj > 0;) {
        this.bb.restore();
        this.Bj--;
      }
      this.context.restore();
    }
    Bk(a, b, c, d) {
      super.Bk(a, b, c, d);
      for (this.Qx(); this.Bj > 0;) {
        this.bb.restore();
        this.Bj--;
      }
      this.resetTransform();
      if (a != 0 || b != 0 || c != 1 || d != 1) {
        a = new Path2D();
        b = this.Wb;
        c = this.viewport;
        a.rect(b.size.x * c.x | 0, b.size.y * c.y | 0, b.size.x * c.w | 0, b.size.y * c.J | 0);
        this.bb.save();
        this.bb.clip(a);
        this.Bj++;
      }
    }
    wk(a) {
      super.wk(a);
      this.Qx();
    }
    ul(a) {
      var b = a.effect;
      if (b != null && b.enabled && a.Ne != 1) {
        if ((a.flags & 4) > 0) {
          this.rf = a;
          a = this.globalAlpha;
          this.globalAlpha = 0.75;
          this.Wn(b);
          this.globalAlpha = a;
        } else {
          this.rf = a;
          this.Bh(a);
          if (this.Kr == null) {
            this.Wn(b);
          } else {
            this.WA(a.effect.type, a.type);
            a = this.Wb.size.x;
            var c = this.Wb.size.y;
            this.bb = this.GP;
            this.ex(a, c);
            this.Wn(b);
            this.Km(this.LB ? "destination-out" : "destination-in");
            b = this.od;
            this.od = 0;
            var d = this.rf;
            this.rf = this.Kr;
            this.Wn(this.Kr.effect);
            this.od = b;
            this.rf = d;
            b = this.bb.canvas;
            this.bb = this.context;
            this.Km("source-over");
            this.resetTransform();
            this.bb.drawImage(b, 0, 0, a, c, 0, 0, a, c);
          }
        }
      }
    }
    ko(a) {
      if ((a.K & 240) > 0) {
        a.nt();
      }
      var b = a.Ue;
      a = b.m11;
      let c = b.m12;
      let d = b.m13;
      let e = b.m14;
      let f = b.m21;
      let g = b.m22;
      let h = b.m23;
      let m = b.m24;
      let n = b.m31;
      let q = b.m32;
      let p = b.m33;
      let v = b.m34;
      let u = b.m41;
      let A = b.m42;
      let D = b.m43;
      b = b.m44;
      var B = this.Ab.pk;
      let K = this.sA;
      let E = this.Tx;
      let v62 = E.m11 * B.m11 + E.m12 * B.m21 + E.m13 * B.m31 + E.m14 * B.m41;
      let v63 = E.m11 * B.m12 + E.m12 * B.m22 + E.m13 * B.m32 + E.m14 * B.m42;
      let V = E.m11 * B.m13 + E.m12 * B.m23 + E.m13 * B.m33 + E.m14 * B.m43;
      let v64 = E.m11 * B.m14 + E.m12 * B.m24 + E.m13 * B.m34 + E.m14 * B.m44;
      let v65 = E.m21 * B.m11 + E.m22 * B.m21 + E.m23 * B.m31 + E.m24 * B.m41;
      let v66 = E.m21 * B.m12 + E.m22 * B.m22 + E.m23 * B.m32 + E.m24 * B.m42;
      let v67 = E.m21 * B.m13 + E.m22 * B.m23 + E.m23 * B.m33 + E.m24 * B.m43;
      let v68 = E.m21 * B.m14 + E.m22 * B.m24 + E.m23 * B.m34 + E.m24 * B.m44;
      let v69 = E.m31 * B.m11 + E.m32 * B.m21 + E.m33 * B.m31 + E.m34 * B.m41;
      let v70 = E.m31 * B.m12 + E.m32 * B.m22 + E.m33 * B.m32 + E.m34 * B.m42;
      let v71 = E.m31 * B.m13 + E.m32 * B.m23 + E.m33 * B.m33 + E.m34 * B.m43;
      let v72 = E.m31 * B.m14 + E.m32 * B.m24 + E.m33 * B.m34 + E.m34 * B.m44;
      let v73 = E.m41 * B.m11 + E.m42 * B.m21 + E.m43 * B.m31 + E.m44 * B.m41;
      let v74 = E.m41 * B.m12 + E.m42 * B.m22 + E.m43 * B.m32 + E.m44 * B.m42;
      let v75 = E.m41 * B.m13 + E.m42 * B.m23 + E.m43 * B.m33 + E.m44 * B.m43;
      B = E.m41 * B.m14 + E.m42 * B.m24 + E.m43 * B.m34 + E.m44 * B.m44;
      K.m11 = v62 * a + v63 * f + V * n + v64 * u;
      K.m12 = v62 * c + v63 * g + V * q + v64 * A;
      K.m13 = v62 * d + v63 * h + V * p + v64 * D;
      K.m14 = v62 * e + v63 * m + V * v + v64 * b;
      K.m21 = v65 * a + v66 * f + v67 * n + v68 * u;
      K.m22 = v65 * c + v66 * g + v67 * q + v68 * A;
      K.m23 = v65 * d + v66 * h + v67 * p + v68 * D;
      K.m24 = v65 * e + v66 * m + v67 * v + v68 * b;
      K.m31 = v69 * a + v70 * f + v71 * n + v72 * u;
      K.m32 = v69 * c + v70 * g + v71 * q + v72 * A;
      K.m33 = v69 * d + v70 * h + v71 * p + v72 * D;
      K.m34 = v69 * e + v70 * m + v71 * v + v72 * b;
      K.m41 = v73 * a + v74 * f + v75 * n + B * u;
      K.m42 = v73 * c + v74 * g + v75 * q + B * A;
      K.m43 = v73 * d + v74 * h + v75 * p + B * D;
      K.m44 = v73 * e + v74 * m + v75 * v + B * b;
      return K;
    }
    oi(a) {
      if ((a.K & 64) > 0) {
        a.Tm();
      }
      var b = a.Ue;
      a = b.m11;
      let c = b.m12;
      var d = b.m14;
      let e = b.m21;
      let f = b.m22;
      let g = b.m24;
      b = this.CM;
      let h = this.Tx;
      let m = this.Ab.pk;
      let n = h.m11 * m.m11 + h.m12 * m.m21;
      let q = h.m11 * m.m12 + h.m12 * m.m22;
      let p = h.m21 * m.m11 + h.m22 * m.m21;
      let v = h.m21 * m.m12 + h.m22 * m.m22;
      let u = n * d + q * g + (h.m11 * m.m14 + h.m12 * m.m24 + h.m14);
      d = p * d + v * g + (h.m21 * m.m14 + h.m22 * m.m24 + h.m24);
      b.m11 = n * a + q * e;
      b.m12 = n * c + q * f;
      b.m14 = u;
      b.m21 = p * a + v * e;
      b.m22 = p * c + v * f;
      b.m24 = d;
      return b;
    }
    jx(a) {
      this.La(a.Xk);
    }
    Uw(a) {
      this.Zg = a.Zg;
      this.context.globalCompositeOperation = this.rM[this.Zg];
    }
    Xw(a) {
      this.ai = a.transform;
    }
    hx(a) {
      this.Kr = a.va;
      this.LB = a.FO;
      let b = a.Gu;
      if (b != null) {
        this.bb.save();
        this.resetTransform();
        this.Bj++;
        a = this.oi(a.Xr.Fa);
        let e = new Path2D();
        var c = b[0];
        var d = new Vec4(a.m11 * c.x + a.m12 * c.y + a.m14, a.m21 * c.x + a.m22 * c.y + a.m24, 0, 1);
        e.moveTo(d.x, d.y);
        for (c = 1; c < b.length;) {
          d = b[c++];
          let f = a;
          d = new Vec4(f.m11 * d.x + f.m12 * d.y + f.m14, f.m21 * d.x + f.m22 * d.y + f.m24, 0, 1);
          e.lineTo(d.x, d.y);
        }
        e.closePath();
        this.bb.clip(e);
      } else if (this.Bj > 0) {
        this.bb.restore();
      }
    }
    Qx() {
      let a = this.Wb;
      let b = this.viewport;
      let c = (a.size.x * b.w | 0) / 2;
      let d = (a.size.y * b.J | 0) / 2;
      if (this.Wb.BS) {
        c |= 0;
        d |= 0;
      }
      let e = this.Tx;
      e.m11 = c;
      e.m12 = 0;
      e.m13 = 0;
      e.m14 = c + (a.size.x * b.x | 0);
      e.m21 = 0;
      e.m22 = -d;
      e.m23 = 0;
      e.m24 = d + (a.size.y * b.y | 0);
    }
    Iv(a) {
      return new TextureWrapper(this, a);
    }
    La(a) {
      this.globalAlpha = a;
      this.context.globalAlpha = a;
    }
    rp(a) {
      this.bb = this.Lu[a];
    }
    ex(a, b) {
      let c = this.bb.canvas;
      let d = c.width;
      let e = c.height;
      let f = false;
      let g = this.Wb.size;
      if (d > g.x || e > g.y) {
        c.width = g.x;
        c.height = g.y;
      }
      if (d < a || e < b) {
        f = true;
      } else {
        try {
          this.bb.reset();
        } catch (h) {
          f = true;
        }
      }
      if (f) {
        c.width = a;
        c.height = b;
      }
    }
    drawImage(a, b, c, d, e, f, g, h, m) {
      this.bb.drawImage(a, b, c, d, e, f, g, h, m);
    }
    Vi(a) {
      this.bb.fillStyle = a;
    }
    fE(a) {
      this.bb.strokeStyle = a;
    }
    Km(a) {
      let b = this.bb;
      if (b.globalCompositeOperation != a) {
        b.globalCompositeOperation = a;
      }
    }
    resetTransform() {
      this.bb.setTransform(1, 0, 0, 1, 0, 0);
    }
    xk(a) {
      a = this.oi(a);
      this.bb.setTransform(a.m11, a.m21, a.m12, a.m22, a.m14, a.m24);
    }
    clearRect(a, b, c, d) {
      this.bb.clearRect(a, b, c, d);
    }
    fillRect(a, b, c, d) {
      this.bb.fillRect(a, b, c, d);
    }
    Lz(a, b, c, d, e) {
      this.bb.globalAlpha = 1;
      var f = this.li(2);
      this.rp(1);
      this.ex(d, e);
      this.Km("copy");
      var g = f.transform;
      var h = g.$b;
      f = g.offset;
      switch (g.hint) {
        case 0:
          this.drawImage(a, b, c, d, e, 0, 0, d, e);
          this.PL(this.bb, g, d, e);
          break;
        case 1:
          this.bb.globalAlpha = g.$b.w;
          this.drawImage(a, b, c, d, e, 0, 0, d, e);
          break;
        case 2:
          var m = 1 - h.x;
          f = f.x == 0 ? h = g = 0 : h = g = 1;
          this.Vi("rgba(" + ((g * 255 | 0) & 255) + "," + ((h * 255 | 0) & 255) + "," + ((f * 255 | 0) & 255) + "," + m.toFixed(2) + ")");
          this.fillRect(0, 0, d, e);
          this.Km("destination-atop");
          this.drawImage(a, b, c, d, e, 0, 0, d, e);
          break;
        case 3:
          m = 1 - h.x;
          g = f.x / m;
          h = f.y / m;
          f = f.z / m;
          this.Vi("rgba(" + ((g * 255 | 0) & 255) + "," + ((h * 255 | 0) & 255) + "," + ((f * 255 | 0) & 255) + "," + m.toFixed(2) + ")");
          this.fillRect(0, 0, d, e);
          this.Km("destination-atop");
          this.drawImage(a, b, c, d, e, 0, 0, d, e);
      }
      a = this.bb.canvas;
      this.rp(0);
      return a;
    }
    Kz(a, b, c, d, e) {
      this.rp(2);
      this.ex(d, e);
      this.Vi(vLS000000);
      this.fillRect(0, 0, d, e);
      this.bb.globalAlpha = this.globalAlpha;
      this.Km("screen");
      this.drawImage(a, b, c, d, e, 0, 0, d, e);
      this.fillRect(0, 0, d, e);
      a = this.bb.canvas;
      this.rp(0);
      return a;
    }
    PL(a, b, c, d) {
      c = a.getImageData(0, 0, c, d);
      d = c.data;
      let e = 0;
      let f = d.length;
      var g = b.$b;
      var h = b.offset;
      b = g.x;
      let m = g.y;
      let n = g.z;
      g = g.w;
      let q = h.x;
      let p = h.y;
      let v = h.z;
      h = h.w;
      let u;
      while (e < f) {
        u = d[e + 3];
        d[e] = (d[e] / u * b + q) * 255;
        ++e;
        d[e] = (d[e] / u * m + p) * 255;
        ++e;
        d[e] = (d[e] / u * n + v) * 255;
        ++e;
        d[e] = (u / 255 * g + h) * 255;
        ++e;
      }
      a.putImageData(c, 0, 0);
    }
    SD(a) {
      this.bb.imageSmoothingEnabled = a;
    }
  }
  CanvasRenderer.i = true;
  CanvasRenderer.s = Renderer;
  Object.assign(CanvasRenderer.prototype, {
    l: CanvasRenderer
  });
  class WebGLRenderer extends Renderer {
    constructor() {
      super("webgl");
      this.R = null;
      this.ql = 1;
      this.ai = new ColorTransform();
      this.iu = this.stencilMask = this.tA = null;
      this.BM = new ArrayList();
    }
    tp(a) {
      super.tp(a);
      this.R = a.getContext();
      this.Bm();
    }
    clear(a) {
      super.clear();
      if (a == null) {
        a = this.clearColor;
      }
      this.R.clearColor(a.x, a.y, a.z, a.w);
      this.R.clear(17664);
    }
    Gi() {
      if (!super.Gi() || this.R == null) {
        return false;
      }
      this.Bm();
      return true;
    }
    fi() {
      super.fi();
    }
    Bk(a, b, c, d) {
      super.Bk(a, b, c, d);
      if (a == 0 && b == 0 && c == 1 && d == 1) {
        this.R.viewport(0, 0, this.Wb.size.x, this.Wb.size.y);
        this.R.disable(3089);
      } else {
        d = this.Wb;
        var e = this.viewport;
        a = d.size.x * e.x | 0;
        b = d.size.x * e.w | 0;
        c = d.size.y * e.J | 0;
        d = (this.Wb.size.y | 0) - c - (d.size.y * e.y | 0);
        this.R.viewport(a, d, b, c);
        this.R.enable(3089);
        this.R.scissor(a, d, b, c);
      }
    }
    jx(a) {
      this.ql = a.Xk;
    }
    QD(a) {
      if (a.rn) {
        this.R.enable(2884);
        this.R.frontFace(a.yL ? 2305 : 2304);
        this.R.cullFace(1029);
      } else {
        this.R.disable(2884);
      }
    }
    PD(a) {
      if (a.rn) {
        this.R.enable(2929);
        this.R.depthFunc(WebGLRenderer.JM[a.zz]);
      } else {
        this.R.disable(2929);
        this.R.depthFunc(513);
      }
    }
    Uw(a) {
      let b = 0;
      let c = 0;
      if (a.QQ) {
        switch (a.Zg) {
          case 0:
            b = 1;
            c = 0;
            break;
          case 1:
            b = 1;
            c = 771;
            break;
          case 2:
            b = 774;
            c = 771;
            break;
          case 3:
            b = 770;
            c = 772;
            break;
          case 4:
            b = 1;
            c = 769;
            break;
          case 5:
            b = WebGLRenderer.nq[a.kE];
            c = WebGLRenderer.nq[a.wA];
        }
      } else {
        switch (a.Zg) {
          case 0:
            b = 1;
            c = 0;
            break;
          case 1:
            b = 770;
            c = 771;
            break;
          case 2:
            b = 774;
            c = 771;
            break;
          case 3:
            c = b = 1;
            break;
          case 4:
            b = 770;
            c = 1;
            break;
          case 5:
            b = WebGLRenderer.nq[a.kE];
            c = WebGLRenderer.nq[a.wA];
        }
      }
      this.R.enable(3042);
      this.R.blendFunc(b, c);
      let d;
      switch (a.blendEquation) {
        case 1:
          d = 32774;
          break;
        case 2:
          d = 32778;
          break;
        case 3:
          d = 32779;
      }
      this.R.blendEquation(d);
    }
    Xw(a) {
      this.ai = a.transform;
    }
    hx(a) {
      a = a.Gu;
      if (this.iu != null && a == null) {
        this.R.disable(2960);
      }
      if (this.iu == null && a != null) {
        this.R.clearStencil(0);
        this.R.enable(2960);
        if (this.stencilMask == null) {
          this.stencilMask = new GLFillProgram(this);
        }
        this.stencilMask.ZM(a);
      }
      this.iu = a;
    }
    Uu(a) {
      if (this.IP == 0) {
        super.Uu(a);
      } else {
        var b = a.iterator();
        var c = b.N[b.xe++];
        var d = this.BM;
        d.reserve(a.ba);
        d.clear();
        var e = d.N[d.ba++] = c;
        a = c.hr;
        var f = c.effect;
        f.update(this);
        this.info.effect = f;
        for (this.info.Rz = d; b.xe < b.yg;) {
          c = b.N[b.xe++];
          c.effect.update(this);
          let g = f.type == c.effect.type;
          if (g = (g = (g = (g = g && f.cb == c.effect.cb) && (a & 3) == (c.hr & 3)) && ((a & 1) > 0 ? e.Jk[0].cb == c.Jk[0].cb : true)) && ((a & 2) > 0 ? e.Jk[1].cb == c.Jk[1].cb : true)) {
            d.N[d.ba++] = c;
          } else {
            if (d.ba == 1) {
              this.ul(d.front());
            } else {
              a = d.N[0];
              a = this.XA(a.effect.type, a.type);
              if (a != null) {
                a.M(this.info);
              } else {
                a = d.N;
                f = 0;
                e = d.ba;
                while (f < e) {
                  this.ul(a[f++]);
                }
              }
            }
            d.clear();
            e = d.N[d.ba++] = c;
            a = c.hr;
            f = c.effect;
            f.update(this);
            this.info.effect = f;
            this.info.Rz = d;
          }
        }
        if (d.ba > 0) {
          if (d.ba == 1) {
            this.ul(d.front());
          } else {
            b = d.N[0];
            b = this.XA(b.effect.type, b.type);
            if (b != null) {
              b.M(this.info);
            } else {
              b = d.N;
              c = 0;
              d = d.ba;
              while (c < d) {
                this.ul(b[c++]);
              }
            }
          }
        }
      }
    }
    Iv(a) {
      return new WebGLTexture(this, a);
    }
  }
  WebGLRenderer.i = true;
  WebGLRenderer.s = Renderer;
  Object.assign(WebGLRenderer.prototype, {
    l: WebGLRenderer
  });

  class C226 {}
  C226.i = true;
  C226.Je = true;
  Object.assign(C226.prototype, {
    l: C226
  });
  class C227 {
    constructor() {
      this.Xx = this.kh();
      this.AA = this.Bc();
    }
    ib() {}
    kh() {
      return 201;
    }
    Bc() {
      throw 8;
    }
  }
  C227.i = true;
  C227.Ib = [C226];
  Object.assign(C227.prototype, {
    l: C227
  });

  class CanvasGradientLineRenderer extends C227 {
    constructor() {
      super();
    }
    M(a) {
      var b = a.V;
      let c = a.effect;
      this.$h = a.V.Wb.getContext();
      this.$h.lineWidth = 1;
      b.xk(a.va.Fa);
      a = 0;
      for (b = c.points.length; a < b;) {
        var d = a++;
        this.$h.globalAlpha = c.vn[d];
        this.$h.lineWidth = c.Z * 2;
        let f = new Path2D();
        let g = c.points[d];
        d = c.Zh[d];
        let h = 0;
        let m = g.length;
        while (h < m) {
          let n = h++;
          var e = d[n];
          this.$h.strokeStyle = "rgba(" + ((e.x * 255 | 0) & 255) + "," + ((e.y * 255 | 0) & 255) + "," + ((e.z * 255 | 0) & 255) + "," + e.w.toFixed(2) + ")";
          e = g[n].x;
          let q = g[n].y;
          if (n == 0) {
            f.moveTo(e, q);
          } else {
            f.lineTo(e, q);
          }
        }
        this.$h.stroke(f);
      }
    }
    Bc() {
      return 705;
    }
  }
  CanvasGradientLineRenderer.i = true;
  CanvasGradientLineRenderer.s = C227;
  Object.assign(CanvasGradientLineRenderer.prototype, {
    l: CanvasGradientLineRenderer
  });
  class CanvasSolidColorRenderer extends C227 {
    constructor() {
      super();
    }
    M(a) {
      let b = a.V;
      var c = a.effect;
      var d = a.va;
      b.xk(a.va.Fa);
      a = c.color;
      if ((b.od & 4) > 0) {
        var e = b.ai;
        c = c.color;
        a = e.$b;
        let f = e.offset;
        e = c.x * a.x + f.x;
        let g = c.y * a.y + f.y;
        let h = c.z * a.z + f.z;
        c = c.w * a.w + f.w;
        a = new Vec4(e < 0 ? 0 : e > 1 ? 1 : e, g < 0 ? 0 : g > 1 ? 1 : g, h < 0 ? 0 : h > 1 ? 1 : h, c < 0 ? 0 : c > 1 ? 1 : c);
      }
      b.La(b.globalAlpha);
      b.Vi("rgba(" + ((a.x * 255 | 0) & 255) + "," + ((a.y * 255 | 0) & 255) + "," + ((a.z * 255 | 0) & 255) + "," + a.w.toFixed(2) + ")");
      d = d.size;
      b.fillRect(0, 0, d.x, d.y);
    }
    Bc() {
      return 1205;
    }
    kh() {
      return 401;
    }
  }
  CanvasSolidColorRenderer.i = true;
  CanvasSolidColorRenderer.s = C227;
  Object.assign(CanvasSolidColorRenderer.prototype, {
    l: CanvasSolidColorRenderer
  });
  class CanvasClearRenderer extends C227 {
    constructor() {
      super();
    }
    M(a) {
      let b = a.V;
      var c = a.effect;
      var d = b.Wb.size;
      a = d.x;
      d = d.y;
      b.resetTransform();
      b.La(b.globalAlpha);
      let e = 0;
      let f = 0;
      let g = c.js;
      if (g != null) {
        e = g.A;
        f = g.D;
        a = g.B - g.A;
        d = g.G - g.D;
      }
      c = c.color;
      b.Vi("rgba(" + ((c.x * 255 | 0) & 255) + "," + ((c.y * 255 | 0) & 255) + "," + ((c.z * 255 | 0) & 255) + "," + c.w.toFixed(2) + ")");
      b.fillRect(e, f, a, d);
    }
    Bc() {
      return 305;
    }
  }
  CanvasClearRenderer.i = true;
  CanvasClearRenderer.s = C227;
  Object.assign(CanvasClearRenderer.prototype, {
    l: CanvasClearRenderer
  });
  class CanvasMultiLineRenderer extends C227 {
    constructor() {
      super();
    }
    ib(a) {
      super.ib(a);
    }
    M(a) {
      let b = a.V;
      var c = a.effect;
      this.$h = a.V.Wb.getContext();
      b.xk(a.va.Fa);
      a = 0;
      for (c = c.lt; a < c.length;) {
        this.kN(c[a++]);
      }
    }
    kN(a) {
      let b = a[0];
      if (a.length != 0) {
        var c = new Path2D();
        c.moveTo(b.x, b.y);
        for (var d = 1, e = a.length; d < e;) {
          b = a[d];
          c.lineTo(b.x, b.y);
          d += 2;
        }
        for (d = a.length - 2; d >= 0;) {
          b = a[d];
          c.lineTo(b.x, b.y);
          d -= 2;
        }
        c.closePath();
        this.$h.fillStyle = "#ffffffff";
        this.$h.fill(c);
      }
    }
    Bc() {
      return 1105;
    }
  }
  CanvasMultiLineRenderer.i = true;
  CanvasMultiLineRenderer.s = C227;
  Object.assign(CanvasMultiLineRenderer.prototype, {
    l: CanvasMultiLineRenderer
  });
  class CanvasDashedCircleRenderer extends C227 {
    constructor() {
      super();
    }
    M(a) {
      var b = a.effect;
      a.V.xk(a.va.Fa);
      a = a.V.Wb.getContext();
      a.lineWidth = b.lineWidth;
      a.globalAlpha = 1;
      var c = b.color;
      a.strokeStyle = "rgba(" + ((c.x * 255 | 0) & 255) + "," + ((c.y * 255 | 0) & 255) + "," + ((c.z * 255 | 0) & 255) + "," + c.w.toFixed(2) + ")";
      c = b.Uo;
      let d = Math.PI * 2;
      let e = d / c;
      let f = b.C.x;
      let g = b.C.y;
      b = b.Z;
      let h = 0;
      while (h < c) {
        var m = h++;
        if ((m & 1) != 1) {
          m = m / c * d;
          a.beginPath();
          a.arc(f, g, b, m, m + e, false);
          a.stroke();
          a.closePath();
        }
      }
    }
    Bc() {
      return 605;
    }
  }
  CanvasDashedCircleRenderer.i = true;
  CanvasDashedCircleRenderer.s = C227;
  Object.assign(CanvasDashedCircleRenderer.prototype, {
    l: CanvasDashedCircleRenderer
  });
  class CanvasCircleStrokeRenderer extends C227 {
    constructor() {
      super();
    }
    M(a) {
      let b = a.effect;
      a.V.xk(a.va.Fa);
      a = a.V.Wb.getContext();
      a.lineWidth = b.lineWidth;
      a.globalAlpha = b.Gr;
      a.strokeStyle = "#ffffff";
      a.beginPath();
      a.arc(0, 0, b.Z + b.lineWidth / 2, 0, Math.PI * 2, false);
      a.stroke();
      a.closePath();
    }
    Bc() {
      return 905;
    }
  }
  CanvasCircleStrokeRenderer.i = true;
  CanvasCircleStrokeRenderer.s = C227;
  Object.assign(CanvasCircleStrokeRenderer.prototype, {
    l: CanvasCircleStrokeRenderer
  });

  class CanvasTextRenderer extends C227 {
    constructor() {
      super();
    }
    M(a) {
      let b = a.V;
      let c = a.effect;
      var d = c.Hb;
      if (d.fr()) {
        var e = d.image.data;
        var f = d.size.x;
        var g = d.size.y;
        var h = b.globalAlpha;
        b.SD((d.flags & 8) > 0);
        if ((b.od & 4) > 0) {
          e = b.Lz(e, 0, 0, f, g);
        }
        if ((b.od & 1) > 0 && b.Zg == 0) {
          e = b.Kz(e, 0, 0, f, g);
          h = 1;
        }
        b.La(h);
        b.rp(0);
        b.xk(a.va.Fa);
        g = c.Og.Te;
        a = c.Hb.hc.Bl;
        d = g.N;
        f = 0;
        g = (g.ba / 5 | 0) * 5;
        h = c.size;
        var m = h.x;
        var n = h.y;
        h = c.Sj;
        var q = m - h;
        var p = n - h;
        var v = null;
        if (c.clip) {
          v = b.bb;
          v.save();
          v.rect(h, h, m - h * 2, n - h * 2);
          v.clip();
        }
        for (m = c.multiline; f < g;) {
          var u = d[f++];
          n = d[f++];
          let A = d[f++];
          let D = d[f++];
          let B = f++;
          u = a[u].Od;
          if (m) {
            if (A > p) {
              break;
            }
          } else if (n > q) {
            break;
          }
          if (n + D > h) {
            b.drawImage(e, u.x, u.y, u.w, u.J, n, A, D, d[B]);
          }
        }
        if (c.clip) {
          v.restore();
        }
      }
    }
    Bc() {
      return 505;
    }
    kh() {
      return 401;
    }
  }
  CanvasTextRenderer.i = true;
  CanvasTextRenderer.s = C227;
  Object.assign(CanvasTextRenderer.prototype, {
    l: CanvasTextRenderer
  });
  class CanvasPathRenderer extends C227 {
    constructor() {
      super();
      this.HR = new Vec4(0, 0, 0, 0);
      this.zS = false;
    }
    M(a) {
      var b = a.effect;
      let c = a.V;
      let d = (c.od & 1) > 0 && c.Zg == 0 ? 1 : 0;
      let e = (c.od & 4) > 0 ? c.ai : null;
      let f = b.AQ;
      let g = false;
      let h = false;
      let m = false;
      let n = 0;
      let q = b.Ju;
      let p = b.data;
      let v = 0;
      let u = 0;
      let A;
      b = b.Ku;
      if (b != 0) {
        var D = c.bb;
        if (this.zS) {
          c.resetTransform();
        } else {
          a = c.oi(a.va.Fa);
          D.setTransform(a.m11, a.m21, a.m12, a.m22, a.m14, a.m24);
        }
        a = false;
        for (var B = new Path2D(); v < b;) {
          switch (q[v++]) {
            case 1:
              var K = p[u++];
              A = p[u++];
              B.moveTo(K, A);
              break;
            case 2:
              K = p[u++];
              A = p[u++];
              B.lineTo(K, A);
              break;
            case 3:
              u++;
              u++;
              B.closePath();
              break;
            case 4:
              c.fE(this.TA(p[u++], Math.min(p[u++] + d, 1), e));
              n = p[u++] | 0;
              D.lineWidth = n;
              m = h == 0;
              g = true;
              break;
            case 5:
              c.Vi(this.TA(p[u++], Math.min(p[u++] + d, 1), e));
              m = g;
              h = true;
              break;
            case 6:
              g = false;
              c.fE(vLS000000);
              D.lineWidth = 1;
              break;
            case 7:
              h = false;
              c.Vi(vLS000000);
              break;
            case 8:
              K = g && f && (n & 1) == 1;
              if (a) {
                if (!K) {
                  D.translate(-0.5, -0.5);
                  a = false;
                }
              } else if (K) {
                D.translate(0.5, 0.5);
                a = true;
              }
              if (g && h) {
                if (m) {
                  D.stroke(B);
                  D.fill(B);
                } else {
                  D.fill(B);
                  D.stroke(B);
                }
              } else if (g) {
                D.stroke(B);
              } else if (h) {
                D.fill(B);
              }
              if (v < b - 1) {
                B = new Path2D();
              }
              break;
            default:
              u = 0;
          }
        }
      }
    }
    Bc() {
      return 1005;
    }
    TA(a, b, c) {
      if (c != null) {
        var d = this.HR;
        d.x = (a >> 16 & 255) / 255;
        d.y = (a >> 8 & 255) / 255;
        d.z = (a & 255) / 255;
        d.w = b;
        a = c.$b;
        c = c.offset;
        let e = d;
        d = e.x * a.x + c.x;
        b = e.y * a.y + c.y;
        let f = e.z * a.z + c.z;
        a = e.w * a.w + c.w;
        d = new Vec4(d < 0 ? 0 : d > 1 ? 1 : d, b < 0 ? 0 : b > 1 ? 1 : b, f < 0 ? 0 : f > 1 ? 1 : f, a < 0 ? 0 : a > 1 ? 1 : a);
        return "rgba(" + ((d.x * 255 | 0) & 255) + "," + ((d.y * 255 | 0) & 255) + "," + ((d.z * 255 | 0) & 255) + "," + d.w.toFixed(2) + ")";
      }
      a |= (b * 255 | 0) << 24;
      c = HexLookup.Dy;
      return "#" + c[a >> 16 & 255] + c[a >> 8 & 255] + c[a & 255] + c[a >>> 24];
    }
  }
  CanvasPathRenderer.i = true;
  CanvasPathRenderer.s = C227;
  Object.assign(CanvasPathRenderer.prototype, {
    l: CanvasPathRenderer
  });

  class HexLookup {}
