  class BMFont {
    constructor() {
      this.UO = [];
      this.$g = [];
    }
  }
  BMFont.i = true;
  Object.assign(BMFont.prototype, {
    l: BMFont
  });
  class BMFontGlyph {
    constructor(a, b, c, d, e, f, g, h) {
      this.id = a;
      this.x = b;
      this.y = c;
      this.width = d;
      this.height = e;
      this.ey = f;
      this.AT = g;
      this.sF = h;
    }
  }
  BMFontGlyph.i = true;
  Object.assign(BMFontGlyph.prototype, {
    l: BMFontGlyph
  });
  class BMFontKerning {
    constructor(a, b, c) {
      this.first = a;
      this.second = b;
      this.amount = c;
    }
  }
  BMFontKerning.i = true;
  Object.assign(BMFontKerning.prototype, {
    l: BMFontKerning
  });
  class Padding4 {
    constructor(a, b, c, d) {
      this.mT = a;
      this.right = b;
      this.QM = c;
      this.left = d;
    }
  }
  Padding4.i = true;
  Object.assign(Padding4.prototype, {
    l: Padding4
  });
  class BMFontInfo {
    constructor(a, b) {
      this.size = a;
      this.padding = b;
    }
  }
  BMFontInfo.i = true;
  Object.assign(BMFontInfo.prototype, {
    l: BMFontInfo
  });
  class BMFontCommon {
    constructor(a, b, c, d) {
      this.lineHeight = a;
      this.vj = b;
      this.FR = c;
      this.ER = d;
    }
  }
  BMFontCommon.i = true;
  Object.assign(BMFontCommon.prototype, {
    l: BMFontCommon
  });
  class BMFontParser {
    constructor() {}
    zm(a) {
      let b = new BMFont();
      a = new BytesReader(a);
      var c = a.ta();
      var d = a.ta();
      var e = a.ta();
      if (c != 66 || d != 77 || e != 70) {
        throw 6;
      }
      if (a.ta() != 3) {
        throw 7;
      }
      a.ta();
      c = a.Eg();
      d = a.kc();
      a.ta();
      a.ta();
      a.zd();
      a.ta();
      e = a.ta();
      var f = a.ta();
      var g = a.ta();
      var h = a.ta();
      a.ta();
      a.ta();
      a.ta();
      a.hs(c - 14);
      b.info = new BMFontInfo(Math.abs(d), new Padding4(e, f, g, h));
      a.ta();
      a.Eg();
      c = Math.max(a.zd(), b.info.size) | 0;
      d = a.zd();
      e = a.zd();
      f = a.zd();
      a.zd();
      a.ta();
      a.ta();
      a.ta();
      a.ta();
      a.ta();
      b.yq = new BMFontCommon(c, d, e, f);
      a.ta();
      c = a.Eg();
      d = a.g;
      a.pD();
      d = a.g - d;
      for (c -= d; c > 0;) {
        a.pD();
        c -= d;
      }
      a.ta();
      c = a.Eg() / 20 | 0;
      for (d = 0; d < c;) {
        ++d;
        e = a.Eg();
        f = a.zd();
        g = a.zd();
        h = a.zd();
        let m = a.zd();
        let n = a.kc();
        let q = a.kc();
        let p = a.kc();
        a.ta();
        a.ta();
        b.$g.push(new BMFontGlyph(e, f, g, h, m, n, q, p));
      }
      if (a.g == a.UE) {
        return b;
      }
      a.ta();
      for (a.Eg(); a.g < a.UE;) {
        c = a.Eg();
        d = a.Eg();
        e = a.kc();
        b.UO.push(new BMFontKerning(c, d, e));
      }
      return b;
    }
  }
  BMFontParser.i = true;
  Object.assign(BMFontParser.prototype, {
    l: BMFontParser
  });
  class BMFontConvert {
    static SA(a) {
      var b = 0;
      for (var c = 0, d = a.$g; c < d.length;) {
        b = Math.max(b, d[c++].id + 1);
      }
      c = Array(b);
      for (d = 0; d < b;) {
        c[d++] = null;
      }
      b = 0;
      for (d = a.$g; b < d.length;) {
        let e = d[b];
        ++b;
        c[e.id] = e;
      }
      return new BMFontAtlas(c, a.info.size, a.yq.lineHeight, a.yq.vj, a.$g[0].sF, a.yq.FR, a.yq.ER, [a.info.padding.mT, a.info.padding.right, a.info.padding.QM, a.info.padding.left]);
    }
    static Gl(a) {
      let b = [];
      let c = 0;
      for (a = a.$g; c < a.length;) {
        let d = a[c];
        ++c;
        let e = d.id;
        b.push(new TextureFrame(e, String.fromCodePoint(e), new Size(d.width, d.height), new TexRect(d.x, d.y, d.width, d.height), false, null));
      }
      return b;
    }
  }
  BMFontConvert.i = true;
  class BMFontAtlas {
    constructor(a, b, c, d, e, f, g, h) {
      this.nA = a;
      this.ss = b;
      this.lineHeight = c;
      this.vj = d;
      this.HA = e;
      this.padding = h;
      this.Tv = new HashMap();
      this.$B = new HashMap();
    }
  }
  BMFontAtlas.i = true;
  Object.assign(BMFontAtlas.prototype, {
    l: BMFontAtlas
  });

  class TextLayout {
    constructor() {
      this.cursor = new Vec4(0, 0, 0, 1);
      this.$g = new ArrayList(32);
      this.nw = 1;
      this.gb = new Bounds(0, 0, 0, 0);
      this.Te = new ArrayList(256);
    }
    free() {
      this.$g.cv();
      this.$g = null;
    }
    shape(a, b) {
      if (b == null) {
        b = false;
      }
      let c = this.gb;
      c.A = c.D = vInfinity;
      c.B = c.G = vNegInfinity;
      var d = a.text;
      if (d != null) {
        var e = d.length;
        if (e != null) {
          d = this.Te;
          if (!b) {
            d.reserve(e * 5);
            d.clear();
          }
          var f = a.charset;
          e = a.fontSize / f.ss * a.Hb.$e;
          f = f.lineHeight * e + a.ZB * e;
          var g = a.Sj;
          var h = a.size.x;
          var m = a.Sj;
          var n = this.cursor;
          n.x = g;
          n.y = g;
          n = !b && a.Wg != null;
          var q = !b && a.bl != null;
          this.nw = 1;
          if (a.multiline) {
            b = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
            let v = 0;
            let u = a.Dx.length;
            let A = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
            let D = 0;
            let B = 0;
            while (v < u) {
              let K = a.Dx[v++];
              var p = this.RA(K.text, a);
              this.cursor.x -= p.N[0].ey * e;
              let E = d.ba;
              this.print(p, a, b);
              p = d.ba;
              let v61 = b.B > h - m;
              if (v61 && b.B - b.A < h - m * 2) {
                if (n) {
                  this.Wg(a, A, D, B);
                  c.add(A);
                }
                d.trim(E);
                D = B = E;
                A.A = A.D = vInfinity;
                A.B = A.G = vNegInfinity;
                --v;
              } else {
                A.add(b);
                B = p;
                if (K.Vz && n) {
                  this.Wg(a, A, D, p);
                  c.add(A);
                  A.A = A.D = vInfinity;
                  A.B = A.G = vNegInfinity;
                  D = p;
                }
              }
              if (v61 || K.Vz) {
                this.cursor.x = g;
                this.cursor.y += f;
                this.nw++;
              }
            }
            if (n) {
              this.Wg(a, A, D, B);
              c.add(A);
            }
          } else {
            f = this.RA(a.text, a);
            if (f.ba == 0) {
              return;
            }
            this.cursor.x -= f.N[0].ey * e;
            this.print(f, a, c, b);
            if (n) {
              this.Wg(a, c, 0, d.ba);
            }
          }
          if (q) {
            this.bl(a, c, 0, d.ba);
          }
        }
      }
    }
    Wg(a, b, c, d) {
      let e = a.Sj;
      let f = a.size.x - e * 2;
      for (a = a.Wg < 0 ? -b.A + e : a.Wg == 0 ? f / 2 - (b.A + b.B) / 2 + e : f - b.B + e; c < d;) {
        this.Te.N[c + 1] += a;
        c += 5;
      }
      d = b.A + a;
      c = b.B - b.A;
      b.A = d;
      b.B = d + c;
    }
    bl(a, b) {
      var c = a.Sj;
      var d = a.size.y - c * 2;
      a = a.bl < 0 ? -b.D + c : a.bl == 0 ? d / 2 - (b.D + b.G) / 2 + c : d - b.G + c;
      c = 0;
      for (d = this.Te.ba / 5 | 0; c < d;) {
        this.Te.N[c++ * 5 + 2] += a;
      }
      a = b.D + a;
      c = b.G - b.D;
      b.D = a;
      b.G = a + c;
    }
    print(a, b, c, d) {
      if (d == null) {
        d = false;
      }
      c.A = c.D = vInfinity;
      c.B = c.G = vNegInfinity;
      let e = b.charset;
      let f = b.fontSize / e.ss * b.Hb.$e;
      let g = b.ZE * f;
      let h = 0;
      let m = a.ba;
      for (var n = 0; h < m;) {
        var q = a.N[h++];
        var p = this.cursor.x + q.ey * f;
        var v = this.cursor.y + q.AT * f;
        let A = q.width * f;
        let D = q.height * f;
        let B = 0;
        if (b.Tv) {
          n = e.Tv.J[q.id << 16 | n];
          if (n != null) {
            B = n;
          }
          B *= f;
          n = q.id;
          p += B;
        }
        if (!d) {
          var u = this.Te;
          u.N[u.ba++] = q.id;
          u = this.Te;
          u.N[u.ba++] = p;
          u = this.Te;
          u.N[u.ba++] = v;
          u = this.Te;
          u.N[u.ba++] = A;
          u = this.Te;
          u.N[u.ba++] = D;
        }
        if (q.id > 32) {
          u = p;
          if (u < c.A) {
            c.A = u;
          }
          if (u > c.B) {
            c.B = u;
          }
          if (v < c.D) {
            c.D = v;
          }
          if (v > c.G) {
            c.G = v;
          }
          p += A;
          v += D;
          if (p < c.A) {
            c.A = p;
          }
          if (p > c.B) {
            c.B = p;
          }
          if (v < c.D) {
            c.D = v;
          }
          if (v > c.G) {
            c.G = v;
          }
        }
        q = q.sF;
        if (b.mA > 0) {
          q = b.mA;
        }
        this.cursor.x += q * f + B + g;
      }
    }
    RA(a, b) {
      let c = a.length;
      let d = this.$g;
      d.clear();
      d.reserve(c);
      var e = b.charset;
      let f = e.nA;
      e = e.$B;
      b = b.qR;
      let g;
      g = 1;
      var h = a.charCodeAt(0);
      if (h >= 32) {
        if (f[h] == null) {
          h = b;
        }
        var m = f[h];
        d.N[d.ba++] = m;
      }
      while (g < c) {
        m = a.charCodeAt(g++);
        if (m < 32) {
          h = m;
        } else {
          if (f[m] == null) {
            m = b;
          }
          if (e != null) {
            h = e.J[h << 16 | m];
            if (h != null) {
              --d.ba;
              m = h;
            }
          }
          h = f[m];
          d.N[d.ba++] = h;
          h = m;
        }
      }
      return d;
    }
  }
  TextLayout.i = true;
  Object.assign(TextLayout.prototype, {
    l: TextLayout
  });

  class TextRun {
    constructor(a, b) {
      this.text = a;
      this.Vz = b;
    }
  }
  TextRun.i = true;
  Object.assign(TextRun.prototype, {
    l: TextRun
  });
