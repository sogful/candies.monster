  class GLProgram {
    constructor() {
      this.Pi = this.R = this.V = null;
      this.Zz = [];
      this.pd = [];
    }
    ib(a) {
      this.V = a;
      this.R = this.V.R;
      if (this.createProgram()) {
        this.Kg();
      }
    }
    use() {
      if (this.V.tA != this) {
        this.V.tA = this;
        this.R.useProgram(this.Pi);
      }
    }
    drawArrays(a, b, c) {
      if (c == null) {
        c = 0;
      }
      if (a != 0) {
        for (var d = 0, e = this.Zz; d < e.length;) {
          e[d++].bind();
        }
        this.R.drawArrays(b, c, a);
      }
    }
    te(a, b) {
      var c;
      var d;
      if (d == null) {
        d = false;
      }
      if (c == null) {
        c = -1;
      }
      if (a == -1) {
        this.pd.push(new ShaderAttribute(a, null, false, b, c));
      } else {
        var e = Lambda.find(this.pd, function (f) {
          return f.location == a;
        });
        e.type = b;
        e.usage = c;
        e.normalize = d;
      }
    }
    lg(a, b) {
      var c = 0;
      for (var d = 0, e = this.pd; d < e.length;) {
        var f = e[d];
        ++d;
        if (f.location > c) {
          c = f.location;
        }
      }
      c = new VertexFormat(c + 1);
      d = 0;
      for (e = this.pd; d < e.length;) {
        f = e[d];
        ++d;
        c.KL(f.location, f.type, f.usage, f.normalize);
      }
      c.seal();
      a = new VertexBuffer(this.R, a, c, b);
      this.Zz.push(a);
      return a;
    }
    createProgram() {
      let a = this.R;
      let b = this.dC(35633, this.getVertexSource());
      let c = this.dC(35632, this.getFragmentSource());
      this.Pi = a.createProgram();
      a.attachShader(this.Pi, b);
      a.attachShader(this.Pi, c);
      a.linkProgram(this.Pi);
      return true;
    }
    dC(a, b) {
      let c = this.R;
      a = this.R.createShader(a);
      c.shaderSource(a, b);
      c.compileShader(a);
      return a;
    }
    getVertexSource() {
      return null;
    }
    getFragmentSource() {
      return null;
    }
    Qe(a) {
      return this.R.getAttribLocation(this.Pi, a);
    }
    getUniformLocation(a) {
      return this.R.getUniformLocation(this.Pi, a);
    }
    fj(a, b) {
      let c = GLProgram.RE;
      c[0] = b.m11;
      c[4] = b.m12;
      c[8] = b.m13;
      c[12] = b.m14;
      c[1] = b.m21;
      c[5] = b.m22;
      c[9] = b.m23;
      c[13] = b.m24;
      c[2] = b.m31;
      c[6] = b.m32;
      c[10] = b.m33;
      c[14] = b.m34;
      c[3] = b.m41;
      c[7] = b.m42;
      c[11] = b.m43;
      c[15] = b.m44;
      this.R.uniformMatrix4fv(a, false, GLProgram.RE);
    }
    cF(a, b) {
      this.R.activeTexture(33984);
      this.R.bindTexture(3553, b);
      this.R.uniform1i(a, 0);
    }
    Kg() {}
  }
  GLProgram.i = true;
  Object.assign(GLProgram.prototype, {
    l: GLProgram
  });
  class GLFillProgram extends GLProgram {
    constructor(a) {
      super();
      this.ib(a);
      this.te(this.eq, 17);
      this.Ca = this.lg(4, 2);
      this.Ca.setData(this.eq, [0, 1, 1, 1, 0, 0, 1, 0]);
      this.Fd = [];
    }
    ZM(a) {
      this.use();
      var b = this.V.oi(this.V.li(1).Xr.Fa);
      this.fj(this.FL, b);
      for (this.R.uniform4f(this.EL, 0, 0, 0, 0); this.Fd.length > 0;) {
        this.Fd.pop();
      }
      for (b = 0; b < a.length;) {
        let c = a[b];
        ++b;
        this.Fd.push(c.x);
        this.Fd.push(c.y);
      }
      this.Ca.resize(this.Fd.length);
      this.Ca.setData(this.eq, this.Fd);
      this.V.R.stencilFunc(519, 1, 255);
      this.V.R.stencilOp(7680, 7680, 7681);
      this.drawArrays(a.length, 6);
      this.V.R.stencilFunc(514, 1, 255);
    }
    getVertexSource() {
      return "uniform mat4 u_m;attribute vec2 a_f;void main(){gl_Position=u_m*vec4(a_f,0,1);}";
    }
    getFragmentSource() {
      return "precision mediump float;uniform vec4 u_c;void main(){gl_FragColor=u_c;}";
    }
    Kg() {
      this.eq = this.Qe("a_f");
      this.pd.push(new ShaderAttribute(this.eq, "a_f", false, -1, -1));
      this.FL = this.getUniformLocation("u_m");
      this.EL = this.getUniformLocation("u_c");
    }
  }
  GLFillProgram.i = true;
  GLFillProgram.s = GLProgram;
  Object.assign(GLFillProgram.prototype, {
    l: GLFillProgram
  });
  class C251 extends GLProgram {
    constructor() {
      super();
      this.Xx = this.kh();
      this.AA = this.Bc();
    }
    kh() {
      return 201;
    }
    Bc() {
      throw 9;
    }
  }
  C251.i = true;
  C251.Ib = [C226];
  C251.s = GLProgram;
  Object.assign(C251.prototype, {
    l: C251
  });

  class GLTextureProgram extends C251 {
    constructor() {
      super();
      this.Lh = this.Ca = null;
      this.size = 0;
    }
    ib(a) {
      super.ib(a);
      this.te(this.lf, 17);
      this.te(this.Yk, 13);
      this.te(GLAttribSentinel.SI, 7);
      this.Ca = this.lg(600, 2);
    }
    M(a) {
      this.use();
      var b = a.V;
      let c = a.effect;
      var d = c.Hb;
      if (d.fr()) {
        var e = c.Og.Te;
        var f = e.ba / 5 | 0;
        if (f != 0) {
          if (f > this.size) {
            this.size = f;
            this.Ca.resize(f * 6);
            this.Lh = this.Ca.NA();
          }
          a = b.oi(a.va.Fa);
          this.fj(this.sn, a);
          this.cF(this.bu, d.handle);
          a = d.size;
          this.R.uniform2f(this.du, a.x, a.y);
          a = this.Lh[this.lf];
          var g = this.Lh[this.Yk];
          if (c.clip) {
            this.R.uniform1f(this.kf, 0);
            this.R.uniform1i(this.Bz, false);
            VertexBufferReset.Ow(this.Lh);
            this.R.enable(2960);
            this.R.stencilFunc(519, 1, 255);
            this.R.stencilOp(7680, 7680, 7681);
            var h = c.ZN();
            var m = h.x;
            h = h.y;
            var n = a.view;
            var q = a.g;
            var p = a.stride;
            n[q] = 0;
            n[q + 1] = h;
            q += p;
            n[q] = m;
            n[q + 1] = 0;
            q += p;
            n[q] = 0;
            n[q + 1] = 0;
            a.g = q + p;
            n = a.view;
            q = a.g;
            p = a.stride;
            n[q] = 0;
            n[q + 1] = h;
            q += p;
            n[q] = m;
            n[q + 1] = h;
            q += p;
            n[q] = m;
            n[q + 1] = 0;
            a.g = q + p;
            g.gE(0, 0);
            g.gE(1, 1);
            this.R.uniform1f(this.kf, 0);
            this.drawArrays(6, 4);
            this.R.stencilFunc(514, 1, 255);
          }
          VertexBufferReset.Ow(this.Lh);
          this.R.uniform1f(this.kf, b.ql);
          b = (b.od & 4) > 0 ? b.ai : null;
          this.R.uniform1i(this.Bz, b != null);
          if (b != null) {
            m = b.$b;
            this.R.uniform4f(this.Rh, m.x, m.y, m.z, m.w);
            b = b.offset;
            this.R.uniform4f(this.Sh, b.x, b.y, b.z, b.w);
          } else {
            this.R.uniform4f(this.Rh, 1, 1, 1, 1);
            b = new Vec4(0, 0, 0, 0);
            this.R.uniform4f(this.Sh, b.x, b.y, b.z, b.w);
          }
          d = d.hc.Bl;
          e = e.N;
          b = 0;
          for (m = f * 5; b < m;) {
            var v = e[b++];
            h = e[b++];
            n = e[b++];
            q = h + e[b++];
            p = n + e[b++];
            var u = a.view;
            var A = a.g;
            var D = a.stride;
            u[A] = h;
            u[A + 1] = p;
            A += D;
            u[A] = q;
            u[A + 1] = n;
            A += D;
            u[A] = h;
            u[A + 1] = n;
            a.g = A + D;
            u = a.view;
            A = a.g;
            D = a.stride;
            u[A] = h;
            u[A + 1] = p;
            A += D;
            u[A] = q;
            u[A + 1] = p;
            A += D;
            u[A] = q;
            u[A + 1] = n;
            a.g = A + D;
            p = d[v].Od;
            h = p.x;
            n = p.y;
            q = h + p.w;
            p = n + p.J;
            v = g.view;
            u = g.g;
            A = g.stride;
            v[u + A * 0] = h;
            v[u + A * 0 + 1] = p;
            v[u + A] = q;
            v[u + A + 1] = n;
            v[u + A * 2] = h;
            v[u + A * 2 + 1] = n;
            g.g = u + A * 3;
            v = g.view;
            u = g.g;
            A = g.stride;
            v[u + A * 0] = h;
            v[u + A * 0 + 1] = p;
            v[u + A] = q;
            v[u + A + 1] = p;
            v[u + A * 2] = q;
            v[u + A * 2 + 1] = n;
            g.g = u + A * 3;
          }
          this.drawArrays(f * 6, 4);
          if (c.clip) {
            this.R.disable(2960);
          }
        }
      }
    }
    Bc() {
      return 505;
    }
    kh() {
      return 401;
    }
    getVertexSource() {
      return "attribute vec4 a_position;\nattribute vec2 a_tcoord;\n\nvarying vec2 v_tcoord;\n\nuniform vec2 u_textureSize;\nuniform mat4 u_matrix;\n\nvoid main()\n{\n\tgl_Position = u_matrix * a_position;\n\tv_tcoord = vec2(a_tcoord.x, u_textureSize.y - a_tcoord.y) / u_textureSize;  \n}";
    }
    getFragmentSource() {
      return "precision mediump float;\n\nuniform sampler2D u_image;\nuniform bool u_transformColors;\nuniform vec4 u_colorMultiplier;\nuniform vec4 u_colorOffset;\nuniform float u_alpha;\n\nvarying vec2 v_tcoord;\n\nvoid main()\n{\n\tvec4 color = texture2D(u_image, v_tcoord);\n\tif (u_transformColors)\n\t{\n\t\tfloat a = color.a;\n\t\tfloat r = color.r / (a + 1e-6);\n\t\tfloat g = color.g / (a + 1e-6);\n\t\tfloat b = color.b / (a + 1e-6);\n\t\tr = r * u_colorMultiplier.r + u_colorOffset.r;\n\t\tg = g * u_colorMultiplier.g + u_colorOffset.g;\n\t\tb = b * u_colorMultiplier.b + u_colorOffset.b;\n\t\ta = a * u_colorMultiplier.a + u_colorOffset.a;\n\t\tcolor = vec4(r * a, g * a, b * a, a);\n\t}\n\tgl_FragColor = color * u_alpha;\n}";
    }
    Kg() {
      this.lf = this.Qe("a_position");
      this.pd.push(new ShaderAttribute(this.lf, "a_position", false, -1, -1));
      this.Yk = this.Qe("a_tcoord");
      this.pd.push(new ShaderAttribute(this.Yk, "a_tcoord", false, -1, -1));
      this.du = this.getUniformLocation("u_textureSize");
      this.sn = this.getUniformLocation("u_matrix");
      this.bu = this.getUniformLocation("u_image");
      this.Bz = this.getUniformLocation("u_transformColors");
      this.Rh = this.getUniformLocation("u_colorMultiplier");
      this.Sh = this.getUniformLocation("u_colorOffset");
      this.kf = this.getUniformLocation("u_alpha");
    }
  }
  GLTextureProgram.i = true;
  GLTextureProgram.s = C251;
  Object.assign(GLTextureProgram.prototype, {
    l: GLTextureProgram
  });
  class GLGradientLineProgram extends C251 {
    constructor() {
      super();
      this.Ca = null;
    }
    ib(a) {
      super.ib(a);
      this.te(this.Jd, 17);
      this.te(this.gu, 18);
      this.Ca = this.lg(32, 2);
    }
    M(a) {
      this.use();
      let b = a.effect;
      a = a.V.ko(a.va.Fa);
      this.fj(this.mj, a);
      this.R.uniform1f(this.oj, 0);
      a = b.Z;
      let c = 0;
      let d = b.points.length;
      while (c < d) {
        let e = c++;
        this.R.uniform1f(this.kf, b.vn[e]);
        this.$M(b.points[e], b.Zh[e], a);
      }
    }
    $M(a, b, c) {
      a = this.Hn(a, c, false);
      for (var d = 0, e = a.length; d < e;) {
        a[d] += c / 2;
        d += 2;
      }
      this.Ca.resize(a.length);
      this.Ca.setData(this.Jd, a);
      c = [];
      for (d = 0; d < b.length;) {
        e = b[d];
        ++d;
        c.push(e.x);
        c.push(e.y);
        c.push(e.z);
        c.push(e.x);
        c.push(e.y);
        c.push(e.z);
        c.push(e.x);
        c.push(e.y);
        c.push(e.z);
        c.push(e.x);
        c.push(e.y);
        c.push(e.z);
        c.push(e.x);
        c.push(e.y);
        c.push(e.z);
        c.push(e.x);
        c.push(e.y);
        c.push(e.z);
      }
      this.Ca.setData(this.gu, c);
      this.drawArrays(a.length, 4);
    }
    Bc() {
      return 705;
    }
    Hn(a, b, c) {
      let d = new LineNormalBuilder().On(a, c);
      let e = a.length;
      if (e == 0) {
        return [];
      }
      a = a.slice();
      if (c) {
        a.push(a[0]);
        d.push(d[0]);
        d.push(d[1]);
        d.push(d[2]);
        ++e;
      }
      c = [];
      let f = 0;
      let g = 1;
      while (g < e) {
        var h = a[f];
        var m = a[g];
        var n = f * 3;
        var q = d[n++];
        let p = d[n++];
        n = Math.min(2, d[n++]);
        n *= b;
        let v = h.x + q * n;
        let u = h.y + p * n;
        let A = h.x - q * n;
        h = h.y - p * n;
        n = g * 3;
        q = d[n++];
        p = d[n++];
        n = Math.min(2, d[n++]);
        n *= b;
        let D = m.x + q * n;
        let B = m.y + p * n;
        q = m.x - q * n;
        m = m.y - p * n;
        c.push(D);
        c.push(B);
        c.push(A);
        c.push(h);
        c.push(v);
        c.push(u);
        c.push(D);
        c.push(B);
        c.push(q);
        c.push(m);
        c.push(A);
        c.push(h);
        ++f;
        ++g;
      }
      return c;
    }
    getVertexSource() {
      return "attribute vec2 a_vertexPosition;\nattribute vec3 a_vertexColor;\n\nvarying vec3 v_vertexColor;\n\nuniform float u_zNDC;\nuniform mat4 u_camera;\n\nvoid main()\n{\n\tv_vertexColor = a_vertexColor;\n\tgl_Position = u_camera * vec4(a_vertexPosition, u_zNDC, 1.0);\n}";
    }
    getFragmentSource() {
      return "precision mediump float;\n\nvarying vec3 v_vertexColor;\n\nuniform float u_alpha;\n\nvoid main()\n{\n\tgl_FragColor = vec4(v_vertexColor * u_alpha, u_alpha);\n}";
    }
    Kg() {
      this.Jd = this.Qe("a_vertexPosition");
      this.pd.push(new ShaderAttribute(this.Jd, "a_vertexPosition", false, -1, -1));
      this.gu = this.Qe("a_vertexColor");
      this.pd.push(new ShaderAttribute(this.gu, "a_vertexColor", false, -1, -1));
      this.oj = this.getUniformLocation("u_zNDC");
      this.mj = this.getUniformLocation("u_camera");
      this.kf = this.getUniformLocation("u_alpha");
    }
  }
  GLGradientLineProgram.i = true;
  GLGradientLineProgram.s = C251;
  Object.assign(GLGradientLineProgram.prototype, {
    l: GLGradientLineProgram
  });
  class GLSolidColorProgram extends C251 {
    constructor() {
      super();
      this.Ca = null;
    }
    ib(a) {
      super.ib(a);
      this.te(this.lf, 17);
      this.Ca = this.lg(600, 2);
      this.Ca = this.lg(4, 2);
      this.Ca.setData(this.lf, [0, 1, 1, 1, 0, 0, 1, 0]);
    }
    M(a) {
      this.use();
      var b = a.va;
      var c = a.effect.color;
      let d = c.w;
      this.R.uniform4f(this.DL, c.x * d, c.y * d, c.z * d, d);
      a = a.V;
      c = a.oi(b.Fa);
      this.fj(this.sn, c);
      this.R.uniform1f(this.kf, a.ql);
      c = b.size;
      this.R.uniform2f(this.cu, c.x, c.y);
      this.R.uniform1f(this.oj, a.jB(b));
      b = (a.od & 4) > 0 ? a.ai : null;
      if (b != null) {
        a = b.$b;
        this.R.uniform4f(this.Rh, a.x, a.y, a.z, a.w);
        b = b.offset;
        this.R.uniform4f(this.Sh, b.x, b.y, b.z, b.w);
      } else {
        this.R.uniform4f(this.Rh, 1, 1, 1, 1);
        b = new Vec4(0, 0, 0, 0);
        this.R.uniform4f(this.Sh, b.x, b.y, b.z, b.w);
      }
      this.drawArrays(4, 5);
    }
    Bc() {
      return 1205;
    }
    kh() {
      return 401;
    }
    getVertexSource() {
      return "uniform mat4 u_matrix;\nuniform vec2 u_size;\nuniform float u_zNDC;\n\nattribute vec2 a_position;\n\nvoid main()\n{\n\tgl_Position = u_matrix * vec4(a_position * u_size, u_zNDC, 1.0);\n}";
    }
    getFragmentSource() {
      return "precision mediump float;\n\nuniform float u_alpha;\nuniform vec4 u_Color;\nuniform vec4 u_colorMultiplier;\nuniform vec4 u_colorOffset;\n\nvoid main()\n{\n\tvec4 color = u_Color;\n\tfloat alpha = color.a;\n\tcolor = vec4(color.rgb / alpha, alpha) * u_colorMultiplier + u_colorOffset;\n\tcolor = vec4(color.rgb * color.a, color.a);\n\tgl_FragColor = color * u_alpha;\n}";
    }
    Kg() {
      this.lf = this.Qe("a_position");
      this.pd.push(new ShaderAttribute(this.lf, "a_position", false, -1, -1));
      this.sn = this.getUniformLocation("u_matrix");
      this.cu = this.getUniformLocation("u_size");
      this.oj = this.getUniformLocation("u_zNDC");
      this.kf = this.getUniformLocation("u_alpha");
      this.DL = this.getUniformLocation("u_Color");
      this.Rh = this.getUniformLocation("u_colorMultiplier");
      this.Sh = this.getUniformLocation("u_colorOffset");
    }
  }
  GLSolidColorProgram.i = true;
  GLSolidColorProgram.s = C251;
  Object.assign(GLSolidColorProgram.prototype, {
    l: GLSolidColorProgram
  });
  class GLClearProgram extends C251 {
    constructor() {
      super();
      this.Lh = this.Ca = null;
    }
    ib(a) {
      super.ib(a);
      this.te(this.fu, 17);
      this.Ca = this.lg(4, 1);
      this.Lh = this.Ca.NA();
    }
    M(a) {
      this.use();
      var b = a.V;
      var c = a.effect;
      if (!(b.ql < b.YO)) {
        this.R.uniform1f(this.oj, 0);
        var d = 0;
        var e = 0;
        var f = 1;
        var g = 1;
        var h = c.color;
        var m = h.w;
        this.R.uniform4f(this.nj, h.x * m, h.y * m, h.z * m, m);
        this.R.uniform1f(this.kf, b.ql);
        if (c.js != null) {
          g = a.V.Wb.size;
          c = c.js;
          d = c.A / g.x;
          e = c.D / g.y;
          f = (c.B - c.A) / g.x;
          g = (c.G - c.D) / g.y;
        }
        e = 1 - g - e;
        VertexBufferReset.Ow(this.Lh);
        c = this.Lh[this.fu];
        a = c.view;
        b = c.g;
        h = c.stride;
        a[b] = d;
        a[b + 1] = e;
        b += h;
        a[b] = d + f;
        a[b + 1] = e;
        b += h;
        a[b] = d;
        a[b + 1] = e + g;
        b += h;
        a[b] = d + f;
        a[b + 1] = e + g;
        c.g = b + h;
        this.drawArrays(4, 5);
      }
    }
    Bc() {
      return 305;
    }
    getVertexSource() {
      return "precision mediump float;\n\nuniform float u_zNDC;\n\nattribute vec2 a_modelPosition;\n\nvoid main()\n{\n\tgl_Position.xy = 2.0 * a_modelPosition - 1.0;\n\tgl_Position.z = u_zNDC;\n\tgl_Position.w = 1.0;\n}";
    }
    getFragmentSource() {
      return "precision mediump float;\n\nuniform vec4 u_color;\nuniform float u_alpha;\n\nvoid main()\n{\n\tgl_FragColor = u_color * u_alpha;\n}";
    }
    Kg() {
      this.fu = this.Qe("a_modelPosition");
      this.pd.push(new ShaderAttribute(this.fu, "a_modelPosition", false, -1, -1));
      this.oj = this.getUniformLocation("u_zNDC");
      this.nj = this.getUniformLocation("u_color");
      this.kf = this.getUniformLocation("u_alpha");
    }
  }
  GLClearProgram.i = true;
  GLClearProgram.s = C251;
  Object.assign(GLClearProgram.prototype, {
    l: GLClearProgram
  });
  class GLMultiLineProgram extends C251 {
    constructor() {
      super();
      this.Ca = null;
      this.Fd = [];
    }
    ib(a) {
      super.ib(a);
      this.te(this.Jd, 17);
      this.Ca = this.lg(32, 2);
    }
    M(a) {
      this.use();
      var b = a.effect;
      a = a.V.ko(a.va.Fa);
      this.fj(this.mj, a);
      this.R.uniform4f(this.nj, 1, 1, 1, 1);
      a = 0;
      for (b = b.lt; a < b.length;) {
        let c = b[a];
        ++a;
        this.Ca.resize(c.length);
        let d = 0;
        let e = 0;
        while (e < c.length) {
          let f = c[e];
          ++e;
          this.Fd[d++] = f.x;
          this.Fd[d++] = f.y;
        }
        this.Ca.setData(this.Jd, this.Fd, d);
        this.drawArrays(c.length, 5);
      }
    }
    Bc() {
      return 1105;
    }
    getVertexSource() {
      return "attribute vec2 a_vertexPosition;\n\nuniform mat4 u_camera;\n\nvoid main()\n{\n\tgl_Position = u_camera * vec4(a_vertexPosition, 0.0, 1.0);\n}";
    }
    getFragmentSource() {
      return "precision mediump float;\n\nuniform vec4 u_color;\n\nvoid main()\n{\n\tgl_FragColor = vec4(u_color.rgb * u_color.a, u_color.a);\n}";
    }
    Kg() {
      this.Jd = this.Qe("a_vertexPosition");
      this.pd.push(new ShaderAttribute(this.Jd, "a_vertexPosition", false, -1, -1));
      this.mj = this.getUniformLocation("u_camera");
      this.nj = this.getUniformLocation("u_color");
    }
  }
  GLMultiLineProgram.i = true;
  GLMultiLineProgram.s = C251;
  Object.assign(GLMultiLineProgram.prototype, {
    l: GLMultiLineProgram
  });

  class GLDashedCircleProgram extends C251 {
    constructor() {
      super();
      this.Ca = null;
      this.mb = [];
      this.nf = 0;
    }
    ib(a) {
      super.ib(a);
      this.te(this.Jd, 17);
      this.Ca = this.lg(32, 1);
    }
    M(a) {
      this.use();
      var b = a.effect;
      a = a.V.ko(a.va.Fa);
      this.fj(this.mj, a);
      a = b.color;
      this.R.uniform4f(this.nj, a.x, a.y, a.z, a.w);
      this.Hn(b);
      b = this.nf >> 1;
      this.Ca.resize(b);
      this.Ca.setData(this.Jd, this.mb, this.nf);
      this.drawArrays(b, 4);
    }
    Hn(a) {
      this.nf = 0;
      let b = a.Uo;
      let c = Math.PI * 2;
      let d = c / b * a.Z * 0.5;
      let e = 0;
      while (e < b) {
        var f = e++;
        if ((f & 1) == 1) {
          continue;
        }
        f = f / b * c;
        var g = a.C;
        var h = a.Z;
        var m = a.lineWidth / 2;
        var n = Math.cos(f);
        var q = Math.sin(f);
        f = g.x + n * h;
        g = g.y + q * h;
        h = -q * d;
        let p = n * d;
        n *= m;
        m *= q;
        q = f + h + n;
        let v = g + p + m;
        let u = f - h - n;
        let A = g - p - m;
        let D = this.nf;
        this.mb[D++] = q;
        this.mb[D++] = v;
        this.mb[D++] = f - h + n;
        this.mb[D++] = g - p + m;
        this.mb[D++] = u;
        this.mb[D++] = A;
        this.mb[D++] = q;
        this.mb[D++] = v;
        this.mb[D++] = u;
        this.mb[D++] = A;
        this.mb[D++] = f + h - n;
        this.mb[D++] = g + p - m;
        this.nf = D;
      }
    }
    Bc() {
      return 605;
    }
    getVertexSource() {
      return "attribute vec2 a_vertexPosition;\n\nuniform mat4 u_camera;\n\nvoid main()\n{\n\tgl_Position = u_camera * vec4(a_vertexPosition, 0.0, 1.0);\n}";
    }
    getFragmentSource() {
      return "precision mediump float;\n\nuniform vec4 u_color;\n\nvoid main()\n{\n\tgl_FragColor = vec4(u_color.rgb * u_color.a, u_color.a);\n}";
    }
    Kg() {
      this.Jd = this.Qe("a_vertexPosition");
      this.pd.push(new ShaderAttribute(this.Jd, "a_vertexPosition", false, -1, -1));
      this.mj = this.getUniformLocation("u_camera");
      this.nj = this.getUniformLocation("u_color");
    }
  }
  GLDashedCircleProgram.i = true;
  GLDashedCircleProgram.s = C251;
  Object.assign(GLDashedCircleProgram.prototype, {
    l: GLDashedCircleProgram
  });
  class GLCircleStrokeProgram extends C251 {
    constructor() {
      super();
      this.Ca = null;
      this.mb = [];
      this.nf = 0;
      this.wi = Array(256);
      this.Ii = Array(256);
    }
    ib(a) {
      super.ib(a);
      this.te(this.Jd, 17);
      this.Ca = this.lg(32, 1);
    }
    M(a) {
      this.use();
      var b = a.effect;
      a = a.V.ko(a.va.Fa);
      this.fj(this.mj, a);
      this.R.uniform4f(this.nj, b.color.x, b.color.y, b.color.z, b.Gr);
      this.Hn(b);
      b = this.nf >> 1;
      this.Ca.resize(b);
      this.Ca.setData(this.Jd, this.mb, this.nf);
      this.drawArrays(b, 4);
    }
    Hn(a) {
      this.nf = 0;
      var b = a.Z;
      let c = (HALF_PI / (Math.acos(1 - 0.25 / b) * 2) - 1 | 0) << 2;
      if (c > 128) {
        c = 128;
      }
      var d = Math.PI * 2;
      let e = 0;
      let f = 0;
      let g = c;
      while (f < g) {
        var h = f++ / c * d;
        let m = Math.cos(h);
        h = Math.sin(h);
        this.Ii[e] = m * b;
        this.Ii[e + 1] = h * b;
        this.wi[e] = m * (b + a.lineWidth);
        this.wi[e + 1] = h * (b + a.lineWidth);
        e += 2;
      }
      a = 0;
      for (b = 1; a < c;) {
        d = this.nf;
        this.mb[d++] = this.Ii[a * 2];
        this.mb[d++] = this.Ii[a * 2 + 1];
        this.mb[d++] = this.Ii[b * 2];
        this.mb[d++] = this.Ii[b * 2 + 1];
        this.mb[d++] = this.wi[b * 2];
        this.mb[d++] = this.wi[b * 2 + 1];
        this.mb[d++] = this.Ii[a * 2];
        this.mb[d++] = this.Ii[a * 2 + 1];
        this.mb[d++] = this.wi[b * 2];
        this.mb[d++] = this.wi[b * 2 + 1];
        this.mb[d++] = this.wi[a * 2];
        this.mb[d++] = this.wi[a * 2 + 1];
        this.nf = d;
        ++a;
        ++b;
        if (b == c) {
          b = 0;
        }
      }
    }
    Bc() {
      return 905;
    }
    getVertexSource() {
      return "attribute vec2 a_vertexPosition;\n\nuniform mat4 u_camera;\n\nvoid main()\n{\n\tgl_Position = u_camera * vec4(a_vertexPosition, 0.0, 1.0);\n}";
    }
    getFragmentSource() {
      return "precision mediump float;\n\nuniform vec4 u_color;\n\nvoid main()\n{\n\tgl_FragColor = vec4(u_color.rgb * u_color.a, u_color.a);\n}";
    }
    Kg() {
      this.Jd = this.Qe("a_vertexPosition");
      this.pd.push(new ShaderAttribute(this.Jd, "a_vertexPosition", false, -1, -1));
      this.mj = this.getUniformLocation("u_camera");
      this.nj = this.getUniformLocation("u_color");
    }
  }
  GLCircleStrokeProgram.i = true;
  GLCircleStrokeProgram.s = C251;
  Object.assign(GLCircleStrokeProgram.prototype, {
    l: GLCircleStrokeProgram
  });
  class GLTiledTextureProgram extends C251 {
    constructor() {
      super();
      this.Ca = null;
    }
    ib(a) {
      super.ib(a);
      this.te(this.lf, 17);
      this.te(this.Yk, 17);
      this.Ca = this.lg(4, 2);
    }
    M(a) {
      this.use();
      var b = a.V;
      var c = a.va;
      var d = a.effect;
      var e = d.Hb;
      if (e.fr()) {
        var f = d.Ep;
        a = f.x + d.offsetX * f.w;
        var g = f.y + d.offsetY * f.J;
        var h = a + d.Am * f.w;
        var m = g + d.hp * f.J;
        this.cF(this.bu, e.handle);
        e = e.size;
        this.R.uniform2f(this.du, e.x, e.y);
        e = b.oi(c.Fa);
        this.fj(this.sn, e);
        this.R.uniform1f(this.kf, b.ql);
        e = c.size;
        this.R.uniform2f(this.cu, e.x, e.y);
        this.R.uniform1f(this.oj, b.jB(c));
        b = (b.od & 4) > 0 ? b.ai : null;
        if (b != null) {
          c = b.$b;
          this.R.uniform4f(this.Rh, c.x, c.y, c.z, c.w);
          b = b.offset;
          this.R.uniform4f(this.Sh, b.x, b.y, b.z, b.w);
        } else {
          this.R.uniform4f(this.Rh, 1, 1, 1, 1);
          b = new Vec4(0, 0, 0, 0);
          this.R.uniform4f(this.Sh, b.x, b.y, b.z, b.w);
        }
        c = 0;
        b = d.offsetY;
        if (d.offsetX != 0) {
          c = 1;
        }
        if (b != 0) {
          c |= 2;
        }
        if (d.Am != 1) {
          c |= 4;
        }
        if (d.hp != 1) {
          c |= 8;
        }
        if (c == 2) {
          b %= 1;
          if (b < 0) {
            ++b;
          }
          a = f.x + d.offsetX * f.w;
          h = a + d.Am * f.w;
          g = f.y + f.J * b;
          m = f.y + f.J;
          d = this.Ca.hj[4];
          d[0] = 0;
          d[1] = 1 - b;
          d[4] = 1;
          d[5] = 1 - b;
          d[8] = 0;
          d[9] = 0;
          d[12] = 1;
          d[13] = 0;
          d = this.Ca.hj[4];
          d[2] = a;
          d[3] = m;
          d[6] = h;
          d[7] = m;
          d[10] = a;
          d[11] = g;
          d[14] = h;
          d[15] = g;
          this.Ca.eh = true;
          this.drawArrays(4, 5);
          g = f.y;
          m = f.J * b;
          f = this.Ca.hj[4];
          f[0] = 0;
          f[1] = 1;
          f[4] = 1;
          f[5] = 1;
          f[8] = 0;
          f[9] = 1 - b;
          f[12] = 1;
          f[13] = 1 - b;
          this.Ca.eh = true;
          f = this.Ca.hj[4];
          f[2] = a;
          f[3] = m;
          f[6] = h;
          f[7] = m;
          f[10] = a;
          f[11] = g;
          f[14] = h;
          f[15] = g;
        } else {
          this.Ca.setData(this.lf, GLTiledTextureProgram.sL[0]);
          f = this.Ca.hj[4];
          f[2] = a;
          f[3] = m;
          f[6] = h;
          f[7] = m;
          f[10] = a;
          f[11] = g;
          f[14] = h;
          f[15] = g;
        }
        this.Ca.eh = true;
        this.drawArrays(4, 5);
      }
    }
    Bc() {
      return 205;
    }
    kh() {
      return 401;
    }
    getVertexSource() {
      return "attribute vec2 a_position;\nattribute vec2 a_tcoord;\n\nuniform mat4 u_matrix;\nuniform vec2 u_size;\nuniform vec2 u_textureSize;\nuniform float u_zNDC;\n\nvarying vec2 v_tcoord;\n\nvoid main()\n{\n\tgl_Position = u_matrix * vec4(a_position * u_size, u_zNDC, 1.0);\n\tv_tcoord = vec2(a_tcoord.x, u_textureSize.y - a_tcoord.y) / u_textureSize;  \n}";
    }
    getFragmentSource() {
      return "precision mediump float;\n\nuniform sampler2D u_image;\nuniform float u_alpha;\nuniform vec4 u_colorMultiplier;\nuniform vec4 u_colorOffset;\n\nvarying vec2 v_tcoord;\n\nvoid main()\n{\n\tvec4 color = texture2D(u_image, v_tcoord);\n\tfloat alpha = color.a;\n\tcolor = vec4(color.rgb / (alpha + 0.001), alpha) * u_colorMultiplier + u_colorOffset;\n\tcolor = vec4(color.rgb * color.a, color.a);\n\tgl_FragColor = color * u_alpha;\n}";
    }
    Kg() {
      this.lf = this.Qe("a_position");
      this.pd.push(new ShaderAttribute(this.lf, "a_position", false, -1, -1));
      this.Yk = this.Qe("a_tcoord");
      this.pd.push(new ShaderAttribute(this.Yk, "a_tcoord", false, -1, -1));
      this.sn = this.getUniformLocation("u_matrix");
      this.cu = this.getUniformLocation("u_size");
      this.du = this.getUniformLocation("u_textureSize");
      this.oj = this.getUniformLocation("u_zNDC");
      this.bu = this.getUniformLocation("u_image");
      this.kf = this.getUniformLocation("u_alpha");
      this.Rh = this.getUniformLocation("u_colorMultiplier");
      this.Sh = this.getUniformLocation("u_colorOffset");
    }
  }
  GLTiledTextureProgram.i = true;
  GLTiledTextureProgram.s = C251;
  Object.assign(GLTiledTextureProgram.prototype, {
    l: GLTiledTextureProgram
  });
