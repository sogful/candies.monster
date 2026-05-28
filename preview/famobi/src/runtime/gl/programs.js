  class GLProgram {
    constructor() {
      this.handle = this.gl = this.renderer = null;
      this.buffers = [];
      this.attributes = [];
    }
    init(a) {
      this.renderer = a;
      this.gl = this.renderer.gl;
      if (this.createProgram()) {
        this.setupUniforms();
      }
    }
    use() {
      if (this.renderer.currentProgram != this) {
        this.renderer.currentProgram = this;
        this.gl.useProgram(this.handle);
      }
    }
    drawArrays(a, b, c) {
      if (c == null) {
        c = 0;
      }
      if (a != 0) {
        for (var d = 0, e = this.buffers; d < e.length;) {
          e[d++].bind();
        }
        this.gl.drawArrays(b, c, a);
      }
    }
    defineAttribute(a, b) {
      var c;
      var d;
      if (d == null) {
        d = false;
      }
      if (c == null) {
        c = -1;
      }
      if (a == -1) {
        this.attributes.push(new ShaderAttribute(a, null, false, b, c));
      } else {
        var e = Lambda.find(this.attributes, function (f) {
          return f.location == a;
        });
        e.type = b;
        e.usage = c;
        e.normalize = d;
      }
    }
    createVertexBuffer(a, b) {
      var c = 0;
      for (var d = 0, e = this.attributes; d < e.length;) {
        var f = e[d];
        ++d;
        if (f.location > c) {
          c = f.location;
        }
      }
      c = new VertexFormat(c + 1);
      d = 0;
      for (e = this.attributes; d < e.length;) {
        f = e[d];
        ++d;
        c.addAttribute(f.location, f.type, f.usage, f.normalize);
      }
      c.seal();
      a = new VertexBuffer(this.gl, a, c, b);
      this.buffers.push(a);
      return a;
    }
    createProgram() {
      let a = this.gl;
      let b = this.compileShader(35633, this.getVertexSource());
      let c = this.compileShader(35632, this.getFragmentSource());
      this.handle = a.createProgram();
      a.attachShader(this.handle, b);
      a.attachShader(this.handle, c);
      a.linkProgram(this.handle);
      return true;
    }
    compileShader(a, b) {
      let c = this.gl;
      a = this.gl.createShader(a);
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
    getAttribLocation(a) {
      return this.gl.getAttribLocation(this.handle, a);
    }
    getUniformLocation(a) {
      return this.gl.getUniformLocation(this.handle, a);
    }
    uniformMat4(a, b) {
      let c = GLProgram.MAT_SCRATCH;
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
      this.gl.uniformMatrix4fv(a, false, GLProgram.MAT_SCRATCH);
    }
    bindTextureUniform(a, b) {
      this.gl.activeTexture(33984);
      this.gl.bindTexture(3553, b);
      this.gl.uniform1i(a, 0);
    }
    setupUniforms() {}
  }
  GLProgram.i = true;
  Object.assign(GLProgram.prototype, {
    l: GLProgram
  });
  class GLFillProgram extends GLProgram {
    constructor(a) {
      super();
      this.init(a);
      this.defineAttribute(this.aPos, 17);
      this.vertexBuffer = this.createVertexBuffer(4, 2);
      this.vertexBuffer.setData(this.aPos, [0, 1, 1, 1, 0, 0, 1, 0]);
      this.flatVerts = [];
    }
    uploadStencil(a) {
      this.use();
      var b = this.renderer.compute2DTransform(this.renderer.getRenderState(1).owner.worldT);
      this.uniformMat4(this.uMatrix, b);
      for (this.gl.uniform4f(this.uColor, 0, 0, 0, 0); this.flatVerts.length > 0;) {
        this.flatVerts.pop();
      }
      for (b = 0; b < a.length;) {
        let c = a[b];
        ++b;
        this.flatVerts.push(c.x);
        this.flatVerts.push(c.y);
      }
      this.vertexBuffer.resize(this.flatVerts.length);
      this.vertexBuffer.setData(this.aPos, this.flatVerts);
      this.renderer.gl.stencilFunc(519, 1, 255);
      this.renderer.gl.stencilOp(7680, 7680, 7681);
      this.drawArrays(a.length, 6);
      this.renderer.gl.stencilFunc(514, 1, 255);
    }
    getVertexSource() {
      return "uniform mat4 u_m;attribute vec2 a_f;void main(){gl_Position=u_m*vec4(a_f,0,1);}";
    }
    getFragmentSource() {
      return "precision mediump float;uniform vec4 u_c;void main(){gl_FragColor=u_c;}";
    }
    setupUniforms() {
      this.aPos = this.getAttribLocation("a_f");
      this.attributes.push(new ShaderAttribute(this.aPos, "a_f", false, -1, -1));
      this.uMatrix = this.getUniformLocation("u_m");
      this.uColor = this.getUniformLocation("u_c");
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
      this.visualType = this.getVisualType();
      this.effectType = this.getEffectType();
    }
    getVisualType() {
      return 201;
    }
    getEffectType() {
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
      this.vertexViews = this.vertexBuffer = null;
      this.size = 0;
    }
    init(a) {
      super.init(a);
      this.defineAttribute(this.aPos, 17);
      this.defineAttribute(this.aTexCoord, 13);
      this.defineAttribute(GLAttribSentinel.LOCATION, 7);
      this.vertexBuffer = this.createVertexBuffer(600, 2);
    }
    render(a) {
      this.use();
      var b = a.renderer;
      let c = a.effect;
      var d = c.texture;
      if (d.isReady()) {
        var e = c.layout.vertices;
        var f = e.count / 5 | 0;
        if (f != 0) {
          if (f > this.size) {
            this.size = f;
            this.vertexBuffer.resize(f * 6);
            this.vertexViews = this.vertexBuffer.createWriters();
          }
          a = b.compute2DTransform(a.visual.worldT);
          this.uniformMat4(this.uMatrix, a);
          this.bindTextureUniform(this.uImage, d.handle);
          a = d.size;
          this.gl.uniform2f(this.uTextureSize, a.x, a.y);
          a = this.vertexViews[this.aPos];
          var g = this.vertexViews[this.aTexCoord];
          if (c.clip) {
            this.gl.uniform1f(this.uAlpha, 0);
            this.gl.uniform1i(this.uTransformColors, false);
            VertexBufferReset.reset(this.vertexViews);
            this.gl.enable(2960);
            this.gl.stencilFunc(519, 1, 255);
            this.gl.stencilOp(7680, 7680, 7681);
            var h = c.getSize();
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
            g.writeTriangle3(0, 0);
            g.writeTriangle3(1, 1);
            this.gl.uniform1f(this.uAlpha, 0);
            this.drawArrays(6, 4);
            this.gl.stencilFunc(514, 1, 255);
          }
          VertexBufferReset.reset(this.vertexViews);
          this.gl.uniform1f(this.uAlpha, b.currentAlpha);
          b = (b.renderFlags & 4) > 0 ? b.colorTransformValue : null;
          this.gl.uniform1i(this.uTransformColors, b != null);
          if (b != null) {
            m = b.mul;
            this.gl.uniform4f(this.uColorMultiplier, m.x, m.y, m.z, m.w);
            b = b.offset;
            this.gl.uniform4f(this.uColorOffset, b.x, b.y, b.z, b.w);
          } else {
            this.gl.uniform4f(this.uColorMultiplier, 1, 1, 1, 1);
            b = new Vec4(0, 0, 0, 0);
            this.gl.uniform4f(this.uColorOffset, b.x, b.y, b.z, b.w);
          }
          d = d.frames.byId;
          e = e.array;
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
            p = d[v].uvOffset;
            h = p.x;
            n = p.y;
            q = h + p.w;
            p = n + p.h;
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
            this.gl.disable(2960);
          }
        }
      }
    }
    getEffectType() {
      return 505;
    }
    getVisualType() {
      return 401;
    }
    getVertexSource() {
      return "attribute vec4 a_position;\nattribute vec2 a_tcoord;\n\nvarying vec2 v_tcoord;\n\nuniform vec2 u_textureSize;\nuniform mat4 u_matrix;\n\nvoid main()\n{\n\tgl_Position = u_matrix * a_position;\n\tv_tcoord = vec2(a_tcoord.x, u_textureSize.y - a_tcoord.y) / u_textureSize;  \n}";
    }
    getFragmentSource() {
      return "precision mediump float;\n\nuniform sampler2D u_image;\nuniform bool u_transformColors;\nuniform vec4 u_colorMultiplier;\nuniform vec4 u_colorOffset;\nuniform float u_alpha;\n\nvarying vec2 v_tcoord;\n\nvoid main()\n{\n\tvec4 color = texture2D(u_image, v_tcoord);\n\tif (u_transformColors)\n\t{\n\t\tfloat a = color.a;\n\t\tfloat r = color.r / (a + 1e-6);\n\t\tfloat g = color.g / (a + 1e-6);\n\t\tfloat b = color.b / (a + 1e-6);\n\t\tr = r * u_colorMultiplier.r + u_colorOffset.r;\n\t\tg = g * u_colorMultiplier.g + u_colorOffset.g;\n\t\tb = b * u_colorMultiplier.b + u_colorOffset.b;\n\t\ta = a * u_colorMultiplier.a + u_colorOffset.a;\n\t\tcolor = vec4(r * a, g * a, b * a, a);\n\t}\n\tgl_FragColor = color * u_alpha;\n}";
    }
    setupUniforms() {
      this.aPos = this.getAttribLocation("a_position");
      this.attributes.push(new ShaderAttribute(this.aPos, "a_position", false, -1, -1));
      this.aTexCoord = this.getAttribLocation("a_tcoord");
      this.attributes.push(new ShaderAttribute(this.aTexCoord, "a_tcoord", false, -1, -1));
      this.uTextureSize = this.getUniformLocation("u_textureSize");
      this.uMatrix = this.getUniformLocation("u_matrix");
      this.uImage = this.getUniformLocation("u_image");
      this.uTransformColors = this.getUniformLocation("u_transformColors");
      this.uColorMultiplier = this.getUniformLocation("u_colorMultiplier");
      this.uColorOffset = this.getUniformLocation("u_colorOffset");
      this.uAlpha = this.getUniformLocation("u_alpha");
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
      this.vertexBuffer = null;
    }
    init(a) {
      super.init(a);
      this.defineAttribute(this.aVertexPos, 17);
      this.defineAttribute(this.aVertexColor, 18);
      this.vertexBuffer = this.createVertexBuffer(32, 2);
    }
    render(a) {
      this.use();
      let b = a.effect;
      a = a.renderer.computeClipMatrix(a.visual.worldT);
      this.uniformMat4(this.uCamera, a);
      this.gl.uniform1f(this.uZNDC, 0);
      a = b.radius;
      let c = 0;
      let d = b.points.length;
      while (c < d) {
        let e = c++;
        this.gl.uniform1f(this.uAlpha, b.alphas[e]);
        this.drawSegment(b.points[e], b.colorLists[e], a);
      }
    }
    $M(a, b, c) {
      a = this.buildVerts(a, c, false);
      for (var d = 0, e = a.length; d < e;) {
        a[d] += c / 2;
        d += 2;
      }
      this.vertexBuffer.resize(a.length);
      this.vertexBuffer.setData(this.aVertexPos, a);
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
      this.vertexBuffer.setData(this.aVertexColor, c);
      this.drawArrays(a.length, 4);
    }
    getEffectType() {
      return 705;
    }
    buildVerts(a, b, c) {
      let d = new LineNormalBuilder().build(a, c);
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
    setupUniforms() {
      this.aVertexPos = this.getAttribLocation("a_vertexPosition");
      this.attributes.push(new ShaderAttribute(this.aVertexPos, "a_vertexPosition", false, -1, -1));
      this.aVertexColor = this.getAttribLocation("a_vertexColor");
      this.attributes.push(new ShaderAttribute(this.aVertexColor, "a_vertexColor", false, -1, -1));
      this.uZNDC = this.getUniformLocation("u_zNDC");
      this.uCamera = this.getUniformLocation("u_camera");
      this.uAlpha = this.getUniformLocation("u_alpha");
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
      this.vertexBuffer = null;
    }
    init(a) {
      super.init(a);
      this.defineAttribute(this.aPos, 17);
      this.vertexBuffer = this.createVertexBuffer(600, 2);
      this.vertexBuffer = this.createVertexBuffer(4, 2);
      this.vertexBuffer.setData(this.aPos, [0, 1, 1, 1, 0, 0, 1, 0]);
    }
    render(a) {
      this.use();
      var b = a.visual;
      var c = a.effect.color;
      let d = c.w;
      this.gl.uniform4f(this.uColorDL, c.x * d, c.y * d, c.z * d, d);
      a = a.renderer;
      c = a.compute2DTransform(b.worldT);
      this.uniformMat4(this.uMatrix, c);
      this.gl.uniform1f(this.uAlpha, a.currentAlpha);
      c = b.size;
      this.gl.uniform2f(this.uSize, c.x, c.y);
      this.gl.uniform1f(this.uZNDC, a.depthOf(b));
      b = (a.renderFlags & 4) > 0 ? a.colorTransformValue : null;
      if (b != null) {
        a = b.mul;
        this.gl.uniform4f(this.uColorMultiplier, a.x, a.y, a.z, a.w);
        b = b.offset;
        this.gl.uniform4f(this.uColorOffset, b.x, b.y, b.z, b.w);
      } else {
        this.gl.uniform4f(this.uColorMultiplier, 1, 1, 1, 1);
        b = new Vec4(0, 0, 0, 0);
        this.gl.uniform4f(this.uColorOffset, b.x, b.y, b.z, b.w);
      }
      this.drawArrays(4, 5);
    }
    getEffectType() {
      return 1205;
    }
    getVisualType() {
      return 401;
    }
    getVertexSource() {
      return "uniform mat4 u_matrix;\nuniform vec2 u_size;\nuniform float u_zNDC;\n\nattribute vec2 a_position;\n\nvoid main()\n{\n\tgl_Position = u_matrix * vec4(a_position * u_size, u_zNDC, 1.0);\n}";
    }
    getFragmentSource() {
      return "precision mediump float;\n\nuniform float u_alpha;\nuniform vec4 u_Color;\nuniform vec4 u_colorMultiplier;\nuniform vec4 u_colorOffset;\n\nvoid main()\n{\n\tvec4 color = u_Color;\n\tfloat alpha = color.a;\n\tcolor = vec4(color.rgb / alpha, alpha) * u_colorMultiplier + u_colorOffset;\n\tcolor = vec4(color.rgb * color.a, color.a);\n\tgl_FragColor = color * u_alpha;\n}";
    }
    setupUniforms() {
      this.aPos = this.getAttribLocation("a_position");
      this.attributes.push(new ShaderAttribute(this.aPos, "a_position", false, -1, -1));
      this.uMatrix = this.getUniformLocation("u_matrix");
      this.uSize = this.getUniformLocation("u_size");
      this.uZNDC = this.getUniformLocation("u_zNDC");
      this.uAlpha = this.getUniformLocation("u_alpha");
      this.uColorDL = this.getUniformLocation("u_Color");
      this.uColorMultiplier = this.getUniformLocation("u_colorMultiplier");
      this.uColorOffset = this.getUniformLocation("u_colorOffset");
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
      this.vertexViews = this.vertexBuffer = null;
    }
    init(a) {
      super.init(a);
      this.defineAttribute(this.aModelPos, 17);
      this.vertexBuffer = this.createVertexBuffer(4, 1);
      this.vertexViews = this.vertexBuffer.createWriters();
    }
    render(a) {
      this.use();
      var b = a.renderer;
      var c = a.effect;
      if (!(b.currentAlpha < b.alphaEpsilon)) {
        this.gl.uniform1f(this.uZNDC, 0);
        var d = 0;
        var e = 0;
        var f = 1;
        var g = 1;
        var h = c.color;
        var m = h.w;
        this.gl.uniform4f(this.uColor, h.x * m, h.y * m, h.z * m, m);
        this.gl.uniform1f(this.uAlpha, b.currentAlpha);
        if (c.js != null) {
          g = a.renderer.window.size;
          c = c.js;
          d = c.left / g.x;
          e = c.top / g.y;
          f = (c.right - c.left) / g.x;
          g = (c.bottom - c.top) / g.y;
        }
        e = 1 - g - e;
        VertexBufferReset.reset(this.vertexViews);
        c = this.vertexViews[this.aModelPos];
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
    getEffectType() {
      return 305;
    }
    getVertexSource() {
      return "precision mediump float;\n\nuniform float u_zNDC;\n\nattribute vec2 a_modelPosition;\n\nvoid main()\n{\n\tgl_Position.xy = 2.0 * a_modelPosition - 1.0;\n\tgl_Position.z = u_zNDC;\n\tgl_Position.w = 1.0;\n}";
    }
    getFragmentSource() {
      return "precision mediump float;\n\nuniform vec4 u_color;\nuniform float u_alpha;\n\nvoid main()\n{\n\tgl_FragColor = u_color * u_alpha;\n}";
    }
    setupUniforms() {
      this.aModelPos = this.getAttribLocation("a_modelPosition");
      this.attributes.push(new ShaderAttribute(this.aModelPos, "a_modelPosition", false, -1, -1));
      this.uZNDC = this.getUniformLocation("u_zNDC");
      this.uColor = this.getUniformLocation("u_color");
      this.uAlpha = this.getUniformLocation("u_alpha");
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
      this.vertexBuffer = null;
      this.flatVerts = [];
    }
    init(a) {
      super.init(a);
      this.defineAttribute(this.aVertexPos, 17);
      this.vertexBuffer = this.createVertexBuffer(32, 2);
    }
    render(a) {
      this.use();
      var b = a.effect;
      a = a.renderer.computeClipMatrix(a.visual.worldT);
      this.uniformMat4(this.uCamera, a);
      this.gl.uniform4f(this.uColor, 1, 1, 1, 1);
      a = 0;
      for (b = b.lt; a < b.length;) {
        let c = b[a];
        ++a;
        this.vertexBuffer.resize(c.length);
        let d = 0;
        let e = 0;
        while (e < c.length) {
          let f = c[e];
          ++e;
          this.flatVerts[d++] = f.x;
          this.flatVerts[d++] = f.y;
        }
        this.vertexBuffer.setData(this.aVertexPos, this.flatVerts, d);
        this.drawArrays(c.length, 5);
      }
    }
    getEffectType() {
      return 1105;
    }
    getVertexSource() {
      return "attribute vec2 a_vertexPosition;\n\nuniform mat4 u_camera;\n\nvoid main()\n{\n\tgl_Position = u_camera * vec4(a_vertexPosition, 0.0, 1.0);\n}";
    }
    getFragmentSource() {
      return "precision mediump float;\n\nuniform vec4 u_color;\n\nvoid main()\n{\n\tgl_FragColor = vec4(u_color.rgb * u_color.a, u_color.a);\n}";
    }
    setupUniforms() {
      this.aVertexPos = this.getAttribLocation("a_vertexPosition");
      this.attributes.push(new ShaderAttribute(this.aVertexPos, "a_vertexPosition", false, -1, -1));
      this.uCamera = this.getUniformLocation("u_camera");
      this.uColor = this.getUniformLocation("u_color");
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
      this.vertexBuffer = null;
      this.batchedItems = [];
      this.batchSize = 0;
    }
    init(a) {
      super.init(a);
      this.defineAttribute(this.aVertexPos, 17);
      this.vertexBuffer = this.createVertexBuffer(32, 1);
    }
    render(a) {
      this.use();
      var b = a.effect;
      a = a.renderer.computeClipMatrix(a.visual.worldT);
      this.uniformMat4(this.uCamera, a);
      a = b.color;
      this.gl.uniform4f(this.uColor, a.x, a.y, a.z, a.w);
      this.buildVerts(b);
      b = this.batchSize >> 1;
      this.vertexBuffer.resize(b);
      this.vertexBuffer.setData(this.aVertexPos, this.batchedItems, this.batchSize);
      this.drawArrays(b, 4);
    }
    buildVerts(a) {
      this.batchSize = 0;
      let b = a.Uo;
      let c = Math.PI * 2;
      let d = c / b * a.radius * 0.5;
      let e = 0;
      while (e < b) {
        var f = e++;
        if ((f & 1) == 1) {
          continue;
        }
        f = f / b * c;
        var g = a.C;
        var h = a.radius;
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
        let D = this.batchSize;
        this.batchedItems[D++] = q;
        this.batchedItems[D++] = v;
        this.batchedItems[D++] = f - h + n;
        this.batchedItems[D++] = g - p + m;
        this.batchedItems[D++] = u;
        this.batchedItems[D++] = A;
        this.batchedItems[D++] = q;
        this.batchedItems[D++] = v;
        this.batchedItems[D++] = u;
        this.batchedItems[D++] = A;
        this.batchedItems[D++] = f + h - n;
        this.batchedItems[D++] = g + p - m;
        this.batchSize = D;
      }
    }
    getEffectType() {
      return 605;
    }
    getVertexSource() {
      return "attribute vec2 a_vertexPosition;\n\nuniform mat4 u_camera;\n\nvoid main()\n{\n\tgl_Position = u_camera * vec4(a_vertexPosition, 0.0, 1.0);\n}";
    }
    getFragmentSource() {
      return "precision mediump float;\n\nuniform vec4 u_color;\n\nvoid main()\n{\n\tgl_FragColor = vec4(u_color.rgb * u_color.a, u_color.a);\n}";
    }
    setupUniforms() {
      this.aVertexPos = this.getAttribLocation("a_vertexPosition");
      this.attributes.push(new ShaderAttribute(this.aVertexPos, "a_vertexPosition", false, -1, -1));
      this.uCamera = this.getUniformLocation("u_camera");
      this.uColor = this.getUniformLocation("u_color");
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
      this.vertexBuffer = null;
      this.batchedItems = [];
      this.batchSize = 0;
      this.batchPoints = Array(256);
      this.batchAlphas = Array(256);
    }
    init(a) {
      super.init(a);
      this.defineAttribute(this.aVertexPos, 17);
      this.vertexBuffer = this.createVertexBuffer(32, 1);
    }
    render(a) {
      this.use();
      var b = a.effect;
      a = a.renderer.computeClipMatrix(a.visual.worldT);
      this.uniformMat4(this.uCamera, a);
      this.gl.uniform4f(this.uColor, b.color.x, b.color.y, b.color.z, b.opacity);
      this.buildVerts(b);
      b = this.batchSize >> 1;
      this.vertexBuffer.resize(b);
      this.vertexBuffer.setData(this.aVertexPos, this.batchedItems, this.batchSize);
      this.drawArrays(b, 4);
    }
    buildVerts(a) {
      this.batchSize = 0;
      var b = a.radius;
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
        this.batchAlphas[e] = m * b;
        this.batchAlphas[e + 1] = h * b;
        this.batchPoints[e] = m * (b + a.lineWidth);
        this.batchPoints[e + 1] = h * (b + a.lineWidth);
        e += 2;
      }
      a = 0;
      for (b = 1; a < c;) {
        d = this.batchSize;
        this.batchedItems[d++] = this.batchAlphas[a * 2];
        this.batchedItems[d++] = this.batchAlphas[a * 2 + 1];
        this.batchedItems[d++] = this.batchAlphas[b * 2];
        this.batchedItems[d++] = this.batchAlphas[b * 2 + 1];
        this.batchedItems[d++] = this.batchPoints[b * 2];
        this.batchedItems[d++] = this.batchPoints[b * 2 + 1];
        this.batchedItems[d++] = this.batchAlphas[a * 2];
        this.batchedItems[d++] = this.batchAlphas[a * 2 + 1];
        this.batchedItems[d++] = this.batchPoints[b * 2];
        this.batchedItems[d++] = this.batchPoints[b * 2 + 1];
        this.batchedItems[d++] = this.batchPoints[a * 2];
        this.batchedItems[d++] = this.batchPoints[a * 2 + 1];
        this.batchSize = d;
        ++a;
        ++b;
        if (b == c) {
          b = 0;
        }
      }
    }
    getEffectType() {
      return 905;
    }
    getVertexSource() {
      return "attribute vec2 a_vertexPosition;\n\nuniform mat4 u_camera;\n\nvoid main()\n{\n\tgl_Position = u_camera * vec4(a_vertexPosition, 0.0, 1.0);\n}";
    }
    getFragmentSource() {
      return "precision mediump float;\n\nuniform vec4 u_color;\n\nvoid main()\n{\n\tgl_FragColor = vec4(u_color.rgb * u_color.a, u_color.a);\n}";
    }
    setupUniforms() {
      this.aVertexPos = this.getAttribLocation("a_vertexPosition");
      this.attributes.push(new ShaderAttribute(this.aVertexPos, "a_vertexPosition", false, -1, -1));
      this.uCamera = this.getUniformLocation("u_camera");
      this.uColor = this.getUniformLocation("u_color");
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
      this.vertexBuffer = null;
    }
    init(a) {
      super.init(a);
      this.defineAttribute(this.aPos, 17);
      this.defineAttribute(this.aTexCoord, 17);
      this.vertexBuffer = this.createVertexBuffer(4, 2);
    }
    render(a) {
      this.use();
      var b = a.renderer;
      var c = a.visual;
      var d = a.effect;
      var e = d.texture;
      if (e.isReady()) {
        var f = d.uvRect;
        a = f.x + d.offsetX * f.w;
        var g = f.y + d.offsetY * f.h;
        var h = a + d.scaleX * f.w;
        var m = g + d.scaleY * f.h;
        this.bindTextureUniform(this.uImage, e.handle);
        e = e.size;
        this.gl.uniform2f(this.uTextureSize, e.x, e.y);
        e = b.compute2DTransform(c.worldT);
        this.uniformMat4(this.uMatrix, e);
        this.gl.uniform1f(this.uAlpha, b.currentAlpha);
        e = c.size;
        this.gl.uniform2f(this.uSize, e.x, e.y);
        this.gl.uniform1f(this.uZNDC, b.depthOf(c));
        b = (b.renderFlags & 4) > 0 ? b.colorTransformValue : null;
        if (b != null) {
          c = b.mul;
          this.gl.uniform4f(this.uColorMultiplier, c.x, c.y, c.z, c.w);
          b = b.offset;
          this.gl.uniform4f(this.uColorOffset, b.x, b.y, b.z, b.w);
        } else {
          this.gl.uniform4f(this.uColorMultiplier, 1, 1, 1, 1);
          b = new Vec4(0, 0, 0, 0);
          this.gl.uniform4f(this.uColorOffset, b.x, b.y, b.z, b.w);
        }
        c = 0;
        b = d.offsetY;
        if (d.offsetX != 0) {
          c = 1;
        }
        if (b != 0) {
          c |= 2;
        }
        if (d.scaleX != 1) {
          c |= 4;
        }
        if (d.scaleY != 1) {
          c |= 8;
        }
        if (c == 2) {
          b %= 1;
          if (b < 0) {
            ++b;
          }
          a = f.x + d.offsetX * f.w;
          h = a + d.scaleX * f.w;
          g = f.y + f.h * b;
          m = f.y + f.h;
          d = this.vertexBuffer.views[4];
          d[0] = 0;
          d[1] = 1 - b;
          d[4] = 1;
          d[5] = 1 - b;
          d[8] = 0;
          d[9] = 0;
          d[12] = 1;
          d[13] = 0;
          d = this.vertexBuffer.views[4];
          d[2] = a;
          d[3] = m;
          d[6] = h;
          d[7] = m;
          d[10] = a;
          d[11] = g;
          d[14] = h;
          d[15] = g;
          this.vertexBuffer.dirty = true;
          this.drawArrays(4, 5);
          g = f.y;
          m = f.h * b;
          f = this.vertexBuffer.views[4];
          f[0] = 0;
          f[1] = 1;
          f[4] = 1;
          f[5] = 1;
          f[8] = 0;
          f[9] = 1 - b;
          f[12] = 1;
          f[13] = 1 - b;
          this.vertexBuffer.dirty = true;
          f = this.vertexBuffer.views[4];
          f[2] = a;
          f[3] = m;
          f[6] = h;
          f[7] = m;
          f[10] = a;
          f[11] = g;
          f[14] = h;
          f[15] = g;
        } else {
          this.vertexBuffer.setData(this.aPos, GLTiledTextureProgram.PATTERNS[0]);
          f = this.vertexBuffer.views[4];
          f[2] = a;
          f[3] = m;
          f[6] = h;
          f[7] = m;
          f[10] = a;
          f[11] = g;
          f[14] = h;
          f[15] = g;
        }
        this.vertexBuffer.dirty = true;
        this.drawArrays(4, 5);
      }
    }
    getEffectType() {
      return 205;
    }
    getVisualType() {
      return 401;
    }
    getVertexSource() {
      return "attribute vec2 a_position;\nattribute vec2 a_tcoord;\n\nuniform mat4 u_matrix;\nuniform vec2 u_size;\nuniform vec2 u_textureSize;\nuniform float u_zNDC;\n\nvarying vec2 v_tcoord;\n\nvoid main()\n{\n\tgl_Position = u_matrix * vec4(a_position * u_size, u_zNDC, 1.0);\n\tv_tcoord = vec2(a_tcoord.x, u_textureSize.y - a_tcoord.y) / u_textureSize;  \n}";
    }
    getFragmentSource() {
      return "precision mediump float;\n\nuniform sampler2D u_image;\nuniform float u_alpha;\nuniform vec4 u_colorMultiplier;\nuniform vec4 u_colorOffset;\n\nvarying vec2 v_tcoord;\n\nvoid main()\n{\n\tvec4 color = texture2D(u_image, v_tcoord);\n\tfloat alpha = color.a;\n\tcolor = vec4(color.rgb / (alpha + 0.001), alpha) * u_colorMultiplier + u_colorOffset;\n\tcolor = vec4(color.rgb * color.a, color.a);\n\tgl_FragColor = color * u_alpha;\n}";
    }
    setupUniforms() {
      this.aPos = this.getAttribLocation("a_position");
      this.attributes.push(new ShaderAttribute(this.aPos, "a_position", false, -1, -1));
      this.aTexCoord = this.getAttribLocation("a_tcoord");
      this.attributes.push(new ShaderAttribute(this.aTexCoord, "a_tcoord", false, -1, -1));
      this.uMatrix = this.getUniformLocation("u_matrix");
      this.uSize = this.getUniformLocation("u_size");
      this.uTextureSize = this.getUniformLocation("u_textureSize");
      this.uZNDC = this.getUniformLocation("u_zNDC");
      this.uImage = this.getUniformLocation("u_image");
      this.uAlpha = this.getUniformLocation("u_alpha");
      this.uColorMultiplier = this.getUniformLocation("u_colorMultiplier");
      this.uColorOffset = this.getUniformLocation("u_colorOffset");
    }
  }
  GLTiledTextureProgram.i = true;
  GLTiledTextureProgram.s = C251;
  Object.assign(GLTiledTextureProgram.prototype, {
    l: GLTiledTextureProgram
  });
