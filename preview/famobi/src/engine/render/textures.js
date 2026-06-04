  class TextureFrame {
    constructor(a, b, c, d, e, f) {
      this.id = a;
      this.name = b;
      this.ec = c;
      this.Od = d;
      this.Ip = e;
      this.mt = f;
    }
    clone() {
      let a = this.ec;
      let b = this.Od;
      if (this.mt != null) {
        var c = this.mt;
        c = new Size(c.x, c.y);
      } else {
        c = null;
      }
      return new TextureFrame(this.id, this.name, new Size(a.x, a.y), new TexRect(b.x, b.y, b.w, b.J), this.Ip, c);
    }
  }
  TextureFrame.i = true;
  Object.assign(TextureFrame.prototype, {
    l: TextureFrame
  });
  class TexRect {
    constructor(a, b, c, d) {
      this.x = a;
      this.y = b;
      this.w = c;
      this.J = d;
    }
  }
  TexRect.i = true;
  Object.assign(TexRect.prototype, {
    l: TexRect
  });
  class RepeatPatternDraw extends C227 {
    constructor() {
      super();
    }
    M(a) {
      var b = a.effect;
      let c = a.V;
      var d = a.va;
      var e = b.Hb;
      if (e.fr()) {
        c.SD((e.flags & 8) > 0);
        a = e.image.data;
        var f = d.size;
        var g = f.x;
        f = f.y;
        c.xk(d.Fa);
        d = b.Ep;
        var h = d.x;
        var m = d.y;
        var n = d.w;
        var q = d.J;
        var p = c.globalAlpha;
        if ((c.od & 4) > 0) {
          a = c.Lz(a, h, m, n, q);
          h = m = 0;
        }
        if ((c.od & 1) > 0 && c.Zg == 0) {
          a = c.Kz(a, h, m, n, q);
          h = m = 0;
          p = 1;
        }
        d = 1 / c.Ab.Wm.m11 * c.TL;
        if (b.Am == 1 && b.hp == 1 && b.offsetX == 0 && b.offsetY == 0) {
          c.La(p);
          c.drawImage(a, h, m, n, q, 0 - d, 0 - d, g + d * 2, f + d * 2);
        } else {
          var v = 0;
          var u = b.offsetX;
          var A = b.offsetY;
          if (u != 0) {
            v = 1;
          }
          if (A != 0) {
            v |= 2;
          }
          if (b.Am != 1) {
            v |= 4;
          }
          if (b.hp != 1) {
            v |= 8;
          }
          if (v == 1) {
            u %= 1;
            if (u < 0) {
              ++u;
            }
            e = n * u;
            b = g * u;
            c.drawImage(a, h + e, m, n - e, q, 0 - d, 0 - d, g - b + d * 2, f + d * 2);
            c.drawImage(a, h, m, e, q, g - e - d, 0 - d, b + d * 2, f + d * 2);
          } else if (v == 2) {
            A %= 1;
            if (A < 0) {
              ++A;
            }
            e = q * A;
            b = f * A;
            c.drawImage(a, h, m + e, n, q - e, 0 - d, 0 - d, g + d * 2, f - b + d * 2);
            c.drawImage(a, h, m, n, e, 0 - d, f - e - d, g + d * 2, b + d * 2);
          } else {
            c.La(p);
            h = e.size.x;
            m = e.size.y;
            g = b.Am;
            var D = b.hp;
            f = c.bb;
            f.save();
            n = new Path2D();
            n.rect(0, 0, h, m);
            f.clip(n);
            h = e.size.x;
            m = e.size.y;
            n = h / g;
            q = m / D;
            u = 1 / g;
            A = 1 / D;
            p = b.offsetX;
            var B = b.offsetY;
            b = p % 1;
            if (b < 0) {
              ++b;
            }
            b = -b;
            var K = B % 1;
            if (K < 0) {
              ++K;
            }
            K = -K;
            var E;
            v = n + d * 2;
            var v76 = q + d * 2;
            if ((e.flags & 4) > 0) {
              e = ((B | 0) & 1) == 1 ? 1 : -1;
              if (B >= 0) {
                e *= -1;
              }
              B = K * q;
              D = K / D;
              while (D < 1) {
                K = D + A;
                let v77 = ((p | 0) & 1) == 1 ? -1 : 1;
                if (p >= 0) {
                  v77 *= -1;
                }
                D = b * n;
                for (E = b / g; E < 1;) {
                  E += u;
                  f.save();
                  f.scale(v77, e);
                  if (v77 > 0) {
                    if (e > 0) {
                      c.drawImage(a, 0, 0, h, m, D - d, B - d, v, v76);
                    } else {
                      c.drawImage(a, 0, 0, h, m, D - d, -B - q - d, v, v76);
                    }
                  } else if (e > 0) {
                    c.drawImage(a, 0, 0, h, m, -D - n - d, B - d, v, v76);
                  } else {
                    c.drawImage(a, 0, 0, h, m, -D - n - d, -B - q - d, v, v76);
                  }
                  f.restore();
                  v77 = -v77;
                  D += n;
                }
                e = -e;
                B += q;
                D = K;
              }
            } else {
              B = K * q;
              D = K / D;
              while (D < 1) {
                K = D + A;
                D = b * n;
                for (E = b / g; E < 1;) {
                  E += u;
                  c.drawImage(a, 0, 0, h, m, D - d, B - d, n + d * 2, q + d * 2);
                  D += n;
                }
                B += q;
                D = K;
              }
            }
            f.restore();
          }
        }
      }
    }
    Bc() {
      return 205;
    }
    kh() {
      return 401;
    }
  }
  RepeatPatternDraw.i = true;
  RepeatPatternDraw.s = C227;
  Object.assign(RepeatPatternDraw.prototype, {
    l: RepeatPatternDraw
  });

  class ImageAsset {
    constructor() {
      this.loaded = false;
      this.size = new Size(0, 0);
      this.name = this.data = null;
    }
  }
  ImageAsset.i = true;
  Object.assign(ImageAsset.prototype, {
    l: ImageAsset
  });
  class Texture {
    constructor(a, b) {
      this.Td = 0;
      this.$e = 1;
      this.children = [];
      this.parent = null;
      this.name = "?";
      this.size = new Size(0, 0);
      this.image = this.hc = null;
      this.id = Texture.WP++;
      this.V = a;
      this.flags = b;
    }
    fr() {
      if (this.image != null) {
        return this.image.loaded;
      } else {
        return false;
      }
    }
    free() {
      if (this.V != null) {
        var a = this.hc;
        if (a != null) {
          a.free();
        }
        a = 0;
        for (var b = this.children; a < b.length;) {
          b[a++].free();
        }
        this.V = this.parent = this.hc = this.image = this.children = null;
      }
    }
    ax(a) {
      if (this.image != null) {
        this.image.Px();
        this.Td++;
      }
      this.image = a;
      var b = this.size;
      a = a.size;
      b.x = a.x;
      b.y = a.y;
      b = 0;
      for (a = this.children; b < a.length;) {
        let c = a[b];
        ++b;
        c.image = this.image;
        let d = c.size;
        let e = this.size;
        d.x = e.x;
        d.y = e.y;
        c.Td = this.Td;
      }
    }
    IR(a) {
      this.hc = a;
      this.$e = 1 / a.scale;
    }
    oa(a, b) {
      a.parent = this;
      this.children.push(a);
      a.hc = b;
      a.image = this.image;
      b = a.size;
      let c = this.size;
      b.x = c.x;
      b.y = c.y;
      a.Td = this.Td;
      a.$e = this.$e;
    }
  }
  Texture.i = true;
  Object.assign(Texture.prototype, {
    l: Texture
  });
  class FrameCollection {
    constructor(a, b, c) {
      if (b == null) {
        b = 1;
      }
      this.bv = new KeyTable();
      this.frames = a.slice();
      this.scale = b;
      this.Np = c;
      b = [];
      for (c = 0; c < a.length;) {
        b.push(a[c++].id);
      }
      b.sort(function (d, e) {
        return d - e;
      });
      b = b[b.length - 1];
      this.Bl = Array(b);
      for (c = 0; c < b;) {
        this.Bl[c++] = null;
      }
      for (b = 0; b < a.length;) {
        c = a[b];
        ++b;
        this.Bl[c.id] = c;
        this.bv.J[c.name] = c;
      }
    }
    free() {
      this.Np = this.frames = this.bv = this.Bl = null;
    }
    EN(a) {
      return this.Bl[a];
    }
    yf(a) {
      return this.bv.J[a];
    }
    offset(a, b) {
      let c = 0;
      let d = this.frames;
      while (c < d.length) {
        let e = d[c];
        ++c;
        e.Od.x += a;
        e.Od.y += b;
      }
    }
    clone() {
      let a = [];
      let b = 0;
      let c = this.frames;
      while (b < c.length) {
        a.push(c[b++].clone());
      }
      return new FrameCollection(a, this.scale, this.Np);
    }
  }
  FrameCollection.i = true;
  Object.assign(FrameCollection.prototype, {
    l: FrameCollection
  });
  class ImageLoader extends ImageAsset {
    constructor(a, b) {
      if (b == null) {
        b = false;
      }
      if (a == null) {
        a = true;
      }
      super();
      this.uT = a;
      this.flipY = b;
    }
    load(a, b, c) {
      let d = this;
      this.decode(a, c).then(function (e) {
        d.data = e;
        let f = d.size;
        f.x = e.width;
        f.y = e.height;
        d.loaded = true;
        b();
      }).catch(function () {});
    }
    Px() {
      if (this.loaded) {
        try {
          if (this.data instanceof HTMLImageElement) {
            this.data.src = "data:image/gif;base64,vmwareR0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
          } else if (this.data instanceof HTMLCanvasElement) {
            this.data.width = 1;
            this.data.height = 1;
          } else if (this.data instanceof ImageBitmap) {
            this.data.close();
          }
        } catch (a) {}
        this.loaded = false;
        this.data = null;
      }
    }
    decode(a, b) {
      let c = this;
      if (typeof a == "string") {
        if (b == null) {
          b = "image/png";
        }
        a = a.replace(RegExp("\\s+", "g"), "");
        return this.decode(new Blob([new Uint8Array(Base64.decode(a).b.aM)], {
          type: b
        }));
      } else if (a instanceof HTMLImageElement) {
        return Promise.resolve(a);
      } else if (a instanceof HTMLCanvasElement) {
        return Promise.resolve(a);
      } else if (this.uT) {
        if (window.createImageBitmap == null) {
          return this.dt(a);
        } else if (typeof a == "string") {
          return this.dt(a).then(function (d) {
            return c.SE(d);
          });
        } else {
          return this.SE(a).then(null, function () {
            return c.dt(a);
          });
        }
      } else {
        return this.dt(a);
      }
    }
    dt(a) {
      return new Promise(function (b, c) {
        let d = window.document.createElement("img");
        d.addEventListener("load", function () {
          b(d);
        });
        d.addEventListener("error", function (e) {
          c(e);
        });
        if (typeof a == "string") {
          debugger;
          d.src = a;
        } else {
          d.src = URL.createObjectURL(a);
        }
      });
    }
    SE(a) {
      return window.createImageBitmap(a, {
        imageOrientation: this.flipY ? "flipY" : "none",
        premultiplyAlpha: "default"
      });
    }
  }
  ImageLoader.i = true;
  ImageLoader.s = ImageAsset;
  Object.assign(ImageLoader.prototype, {
    l: ImageLoader
  });
  class TextureWrapper extends Texture {
    constructor(a, b) {
      super(a, b);
    }
  }
  TextureWrapper.i = true;
  TextureWrapper.s = Texture;
  Object.assign(TextureWrapper.prototype, {
    l: TextureWrapper
  });
  class WebGLTexture extends TextureWrapper {
    constructor(a, b) {
      super(a, b);
      this.handle = null;
      this.R = a.R;
    }
    free() {
      if (this.parent == null) {
        this.R.deleteTexture(this.handle);
      }
      this.R = this.handle = null;
      super.free();
    }
    ax(a) {
      super.ax(a);
      if (this.handle != null) {
        if (this.parent == null) {
          this.R.deleteTexture(this.handle);
        }
        this.handle = null;
      }
      if (this.handle == null) {
        this.handle = this.R.createTexture();
      }
      this.R.bindTexture(3553, this.handle);
      try {
        var b = a.data instanceof ImageBitmap;
      } catch (d) {
        b = false;
      }
      if (!b) {
        this.R.pixelStorei(37441, 1);
      }
      this.R.pixelStorei(37440, 1);
      b = (this.flags & 2) > 0 ? (this.flags & 4) > 0 ? 33648 : 10497 : 33071;
      let c = (this.flags & 8) > 0 ? 9729 : 9728;
      this.R.texParameteri(3553, 10242, b);
      this.R.texParameteri(3553, 10243, b);
      this.R.texParameteri(3553, 10241, c);
      this.R.texParameteri(3553, 10240, c);
      this.R.texImage2D(3553, 0, 6408, 6408, 5121, a.data);
      if ((this.flags & 240) > 0) {
        a = 9984;
        if ((this.flags & 32) > 0) {
          a = 9985;
        }
        if ((this.flags & 64) > 0) {
          a = 9986;
        }
        if ((this.flags & 128) > 0) {
          a = 9987;
        }
        this.R.texParameteri(3553, 10241, a);
        this.R.generateMipmap(3553);
      }
      a = 0;
      for (b = this.children; a < b.length;) {
        b[a++].handle = this.handle;
      }
      this.R.bindTexture(3553, null);
    }
    oa(a, b) {
      super.oa(a, b);
      a.handle = this.handle;
    }
  }
  WebGLTexture.i = true;
  WebGLTexture.s = TextureWrapper;
  Object.assign(WebGLTexture.prototype, {
    l: WebGLTexture
  });
