  class GLTypeSize {
    static bytesPerComponent(a) {
      return GLTypeSize.SIZES[a >> 2];
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
      this.components = a % 4 + 1;
      this.byteSize = this.components * GLTypeSize.SIZES[a >> 2];
      this.offset = 0;
      this.normalized = false;
    }
  }
  VertexAttribute.i = true;
  Object.assign(VertexAttribute.prototype, {
    l: VertexAttribute
  });
  class C185 {
    constructor(a, b, c) {
      this.usage = c;
      this.maxCount = a;
      this.stride = b;
      this.byteSize = a * b;
      this.dirty = true;
    }
    resize(a) {
      if (a > this.maxCount) {
        this.maxCount = a;
        this.dirty = true;
        this.byteSize = a * this.stride;
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
      super(b, c.stride, d);
      this.format = c;
      this.gl = a;
      this.handle = a.createBuffer();
      this.data = new ArrayBuffer(this.byteSize);
      this.views = [];
      this.createViews();
    }
    free() {
      this.gl.deleteBuffer(this.handle);
      this.data = this.views = this.gl = this.handle = null;
    }
    resize(a) {
      if (super.resize(a)) {
        this.data = new ArrayBuffer(this.byteSize);
        this.createViews();
        return true;
      } else {
        return false;
      }
    }
    viewForType(a) {
      return this.views[a >> 2];
    }
    bind() {
      let a = this.gl;
      a.bindBuffer(34962, this.handle);
      let b = this.format.stride;
      var c = this.format.attributes;
      let d = c.array;
      let e = 0;
      for (c = c.count; e < c;) {
        let f = d[e++];
        if (f.location != -1) {
          a.enableVertexAttribArray(f.location);
          a.vertexAttribPointer(f.location, f.components, VertexBuffer.GL_TYPES[f.type >> 2], f.normalized, b, f.offset);
        }
      }
      if (this.dirty) {
        a.bufferData(34962, this.data, 35040 + this.usage * 4);
        this.dirty = false;
      }
    }
    writerFor(a) {
      var b = 0;
      if (b == null) {
        b = 0;
      }
      return new VertexBufferWriter(this, a, b);
    }
    createWriters() {
      var a = [];
      let b = Array(this.format.maxLocation + 1);
      for (var c = 0, d = b.length; c < d;) {
        b[c++] = null;
      }
      if (a.length == 0) {
        for (a = this.format.iterator(); a.hasNext();) {
          c = a.next();
          if (c.location != -1) {
            b[c.location] = this.writerFor(c.location);
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
      this.dirty = true;
      if (c == 0) {
        c = b.length;
      }
      var d = this.format.get(a);
      a = d.components;
      var e = GLTypeSize.bytesPerComponent(d.type);
      let f = this.format.stride / e | 0;
      e = d.offset / e | 0;
      d = this.viewForType(d.type);
      let g = 0;
      while (g < c) {
        d[e + (g / a | 0) * f + g % a] = b[g];
        ++g;
      }
    }
    createViews() {
      let a = this.data;
      this.views = [new Int8Array(a), new Uint8Array(a), new Int16Array(a), new Uint16Array(a), new Float32Array(a), new Uint32Array(a)];
    }
  }
  VertexBuffer.i = true;
  VertexBuffer.s = C185;
  Object.assign(VertexBuffer.prototype, {
    l: VertexBuffer
  });
  class VertexBufferWriter {
    constructor(a, b, c) {
      this.buffer = a;
      let d = a.format;
      b = d.get(b);
      this.view = a.viewForType(b.type);
      a = GLTypeSize.bytesPerComponent(b.type);
      this.stride = d.stride / a | 0;
      this.start = this.g = (b.offset / a | 0) + c * this.stride;
      this.buffer.dirty = true;
    }
    writeTriangle3(a, b) {
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
      this.stride = this.maxLocation = 0;
      this.attributes = new ArrayList(a);
      this.attributes.init(a, null);
    }
    get(a) {
      return this.attributes.array[a];
    }
    iterator() {
      return this.attributes.iterator();
    }
    addAttribute(a, b, c, d) {
      if (d == null) {
        d = false;
      }
      if (c == null) {
        c = -1;
      }
      b = new VertexAttribute(b, a, c);
      this.maxLocation = Math.max(this.maxLocation, a);
      b.normalized = d;
      if (a == -1) {
        this.attributes.pushBack(b);
      } else {
        this.attributes.array[a] = b;
      }
      this.stride += b.byteSize;
    }
    seal() {
      this.attributes.pack();
      let a = this.attributes.count;
      let b = 1;
      while (b < a) {
        let c = this.attributes.array[b - 1];
        this.attributes.array[b].offset = c.offset + c.byteSize;
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
      this.tmpDir = new Vec4(0, 0, 0, 1);
      this.tmpNorm = new Vec4(0, 0, 0, 1);
      this.tmpAvg = new Vec4(0, 0, 0, 1);
      this.tmpOut = new Vec4(0, 0, 0, 1);
    }
    build(a, b) {
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
        this.tmpOut = new Vec4(v / u, n / u, 0, 1);
        if (e == null) {
          e = this.tmpOut;
          e = new Vec4(-e.y, e.x, 0, 1);
        }
        if (m == 1) {
          c(e, 1);
        }
        if (p == null) {
          e = this.tmpOut;
          e = new Vec4(-e.y, e.x, 0, 1);
          c(e, 1);
        } else {
          m = p.x - q.x;
          q = p.y - q.y;
          p = Math.sqrt(m * m + q * q);
          this.tmpAvg = new Vec4(m / p, q / p, 0, 1);
          q = d(this.tmpNorm, this.tmpDir, this.tmpOut, this.tmpAvg, 1);
          c(this.tmpDir, q);
        }
      }
      if (b && a.length > 2) {
        e = a[g - 2];
        b = a[0];
        a = a[1];
        h = b.x - e.x;
        e = b.y - e.y;
        q = Math.sqrt(h * h + e * e);
        this.tmpOut = new Vec4(h / q, e / q, 0, 1);
        h = a.x - b.x;
        a = a.y - b.y;
        b = Math.sqrt(h * h + a * a);
        this.tmpAvg = new Vec4(h / b, a / b, 0, 1);
        a = d(this.tmpNorm, this.tmpDir, this.tmpOut, this.tmpAvg, 1);
        f[0] = this.tmpDir.x;
        f[1] = this.tmpDir.y;
        f[2] = a;
        f[g * 3 - 3] = this.tmpDir.x;
        f[g * 3 - 2] = this.tmpDir.y;
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
    static reset(a) {
      let b = 0;
      let c = a.length;
      while (b < c) {
        let d = a[b++];
        if (d != null) {
          d.g = d.start;
          d.buffer.dirty = true;
        }
      }
    }
  }

  class GLAttribSentinel {}
