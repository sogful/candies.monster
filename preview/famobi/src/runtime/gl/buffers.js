  class GLTypeSize {
    static UA(a) {
      return GLTypeSize.dA[a >> 2];
    }
  }
  class ShaderAttribute {
    constructor(a, b, c, d, e) {
      this.location = a;
      this.name = b;
      this.normalize = c;
      this.type = d;
      this.usage = e;
    }
  }
  ShaderAttribute.i = true;
  Object.assign(ShaderAttribute.prototype, {
    l: ShaderAttribute
  });
  class VertexAttribute {
    constructor(a, b, c) {
      this.type = a;
      this.location = b;
      this.usage = c;
      this.kw = a % 4 + 1;
      this.lm = this.kw * GLTypeSize.dA[a >> 2];
      this.offset = 0;
      this.AC = false;
    }
  }
  VertexAttribute.i = true;
  Object.assign(VertexAttribute.prototype, {
    l: VertexAttribute
  });
  class C185 {
    constructor(a, b, c) {
      this.tT = c;
      this.CC = a;
      this.cN = b;
      this.lm = a * b;
      this.eh = true;
    }
    resize(a) {
      if (a > this.CC) {
        this.CC = a;
        this.eh = true;
        this.lm = a * this.cN;
        return true;
      } else {
        return false;
      }
    }
  }
  C185.i = true;
  Object.assign(C185.prototype, {
    l: C185
  });

  class VertexBuffer extends C185 {
    constructor(a, b, c, d) {
      super(b, c.Vm, d);
      this.format = c;
      this.R = a;
      this.wu = a.createBuffer();
      this.data = new ArrayBuffer(this.lm);
      this.hj = [];
      this.GB();
    }
    free() {
      this.R.deleteBuffer(this.wu);
      this.data = this.hj = this.R = this.wu = null;
    }
    resize(a) {
      if (super.resize(a)) {
        this.data = new ArrayBuffer(this.lm);
        this.GB();
        return true;
      } else {
        return false;
      }
    }
    iB(a) {
      return this.hj[a >> 2];
    }
    bind() {
      let a = this.R;
      a.bindBuffer(34962, this.wu);
      let b = this.format.Vm;
      var c = this.format.attributes;
      let d = c.N;
      let e = 0;
      for (c = c.ba; e < c;) {
        let f = d[e++];
        if (f.location != -1) {
          a.enableVertexAttribArray(f.location);
          a.vertexAttribPointer(f.location, f.kw, VertexBuffer.hO[f.type >> 2], f.AC, b, f.offset);
        }
      }
      if (this.eh) {
        a.bufferData(34962, this.data, 35040 + this.tT * 4);
        this.eh = false;
      }
    }
    uN(a) {
      var b = 0;
      if (b == null) {
        b = 0;
      }
      return new VertexBufferWriter(this, a, b);
    }
    NA() {
      var a = [];
      let b = Array(this.format.ew + 1);
      for (var c = 0, d = b.length; c < d;) {
        b[c++] = null;
      }
      if (a.length == 0) {
        for (a = this.format.iterator(); a.fb();) {
          c = a.next();
          if (c.location != -1) {
            b[c.location] = this.uN(c.location);
          }
        }
      } else {
        for (c = 0; c < a.length;) {
          d = a[c++];
          b[d] = new VertexBufferWriter(this, d, 0);
        }
      }
      return b;
    }
    setData(a, b, c) {
      if (c == null) {
        c = 0;
      }
      this.eh = true;
      if (c == 0) {
        c = b.length;
      }
      var d = this.format.get(a);
      a = d.kw;
      var e = GLTypeSize.UA(d.type);
      let f = this.format.Vm / e | 0;
      e = d.offset / e | 0;
      d = this.iB(d.type);
      let g = 0;
      while (g < c) {
        d[e + (g / a | 0) * f + g % a] = b[g];
        ++g;
      }
    }
    GB() {
      let a = this.data;
      this.hj = [new Int8Array(a), new Uint8Array(a), new Int16Array(a), new Uint16Array(a), new Float32Array(a), new Uint32Array(a)];
    }
  }
  VertexBuffer.i = true;
  VertexBuffer.s = C185;
  Object.assign(VertexBuffer.prototype, {
    l: VertexBuffer
  });
  class VertexBufferWriter {
    constructor(a, b, c) {
      this.mb = a;
      let d = a.format;
      b = d.get(b);
      this.view = a.iB(b.type);
      a = GLTypeSize.UA(b.type);
      this.stride = d.Vm / a | 0;
      this.start = this.g = (b.offset / a | 0) + c * this.stride;
      this.mb.eh = true;
    }
    gE(a, b) {
      let c = this.view;
      let d = this.g;
      let e = this.stride;
      c[d + e * 0] = 0;
      c[d + e * 0 + 1] = 1;
      c[d + e] = 1;
      c[d + e + 1] = a;
      c[d + e * 2] = b;
      c[d + e * 2 + 1] = 0;
      this.g = d + e * 3;
    }
  }
  VertexBufferWriter.i = true;
  Object.assign(VertexBufferWriter.prototype, {
    l: VertexBufferWriter
  });
  class VertexFormat {
    constructor(a) {
      this.Vm = this.ew = 0;
      this.attributes = new ArrayList(a);
      this.attributes.ib(a, null);
    }
    get(a) {
      return this.attributes.N[a];
    }
    iterator() {
      return this.attributes.iterator();
    }
    KL(a, b, c, d) {
      if (d == null) {
        d = false;
      }
      if (c == null) {
        c = -1;
      }
      b = new VertexAttribute(b, a, c);
      this.ew = Math.max(this.ew, a);
      b.AC = d;
      if (a == -1) {
        this.attributes.pushBack(b);
      } else {
        this.attributes.N[a] = b;
      }
      this.Vm += b.lm;
    }
    seal() {
      this.attributes.pack();
      let a = this.attributes.ba;
      let b = 1;
      while (b < a) {
        let c = this.attributes.N[b - 1];
        this.attributes.N[b].offset = c.offset + c.lm;
        ++b;
      }
    }
  }
  VertexFormat.i = true;
  Object.assign(VertexFormat.prototype, {
    l: VertexFormat
  });
  class LineNormalBuilder {
    constructor() {
      this.ck = new Vec4(0, 0, 0, 1);
      this.GE = new Vec4(0, 0, 0, 1);
      this.Hr = new Vec4(0, 0, 0, 1);
      this.Wl = new Vec4(0, 0, 0, 1);
    }
    On(a, b) {
      function c(v, u) {
        f.push(v.x);
        f.push(v.y);
        f.push(u);
      }
      function d(v, u, A, D, B) {
        v.x = A.x + D.x;
        v.y = A.y + D.y;
        D = Math.sqrt(v.x * v.x + v.y * v.y);
        if (D > 0) {
          v.x /= D;
          v.y /= D;
        } else {
          v.x = 0;
          v.y = 0;
        }
        D = v.x;
        u.x = -v.y;
        u.y = D;
        return B / (u.x * -A.y + u.y * A.x);
      }
      var e = null;
      let f = [];
      if (b) {
        a = a.slice();
        var g = a[0];
        a.push(new Vec4(g.x, g.y, 0, 1));
      }
      g = a.length;
      for (var h = 1; h < g;) {
        var m = h++;
        var n = a[m - 1];
        var q = a[m];
        var p = m < a.length - 1 ? a[m + 1] : null;
        let v = q.x - n.x;
        n = q.y - n.y;
        let u = Math.sqrt(v * v + n * n);
        this.Wl = new Vec4(v / u, n / u, 0, 1);
        if (e == null) {
          e = this.Wl;
          e = new Vec4(-e.y, e.x, 0, 1);
        }
        if (m == 1) {
          c(e, 1);
        }
        if (p == null) {
          e = this.Wl;
          e = new Vec4(-e.y, e.x, 0, 1);
          c(e, 1);
        } else {
          m = p.x - q.x;
          q = p.y - q.y;
          p = Math.sqrt(m * m + q * q);
          this.Hr = new Vec4(m / p, q / p, 0, 1);
          q = d(this.GE, this.ck, this.Wl, this.Hr, 1);
          c(this.ck, q);
        }
      }
      if (b && a.length > 2) {
        e = a[g - 2];
        b = a[0];
        a = a[1];
        h = b.x - e.x;
        e = b.y - e.y;
        q = Math.sqrt(h * h + e * e);
        this.Wl = new Vec4(h / q, e / q, 0, 1);
        h = a.x - b.x;
        a = a.y - b.y;
        b = Math.sqrt(h * h + a * a);
        this.Hr = new Vec4(h / b, a / b, 0, 1);
        a = d(this.GE, this.ck, this.Wl, this.Hr, 1);
        f[0] = this.ck.x;
        f[1] = this.ck.y;
        f[2] = a;
        f[g * 3 - 3] = this.ck.x;
        f[g * 3 - 2] = this.ck.y;
        f[g * 3 - 1] = a;
        f.pop();
        f.pop();
        f.pop();
      }
      return f;
    }
  }
  LineNormalBuilder.i = true;
  Object.assign(LineNormalBuilder.prototype, {
    l: LineNormalBuilder
  });

  class VertexBufferReset {
    static Ow(a) {
      let b = 0;
      let c = a.length;
      while (b < c) {
        let d = a[b++];
        if (d != null) {
          d.g = d.start;
          d.mb.eh = true;
        }
      }
    }
  }

  class GLAttribSentinel {}
