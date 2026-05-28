  class BMFont {
    constructor() {
      this.kerningPairs = [];
      this.glyphs = [];
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
      this.xOffset = f;
      this.yOffset = g;
      this.xAdvance = h;
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
      this.top = a;
      this.right = b;
      this.bottom = c;
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
      this.base = b;
      this.scaleW = c;
      this.scaleH = d;
    }
  }
  BMFontCommon.i = true;
  Object.assign(BMFontCommon.prototype, {
    l: BMFontCommon
  });
  class BMFontParser {
    constructor() {}
    readBytes(a) {
      let b = new BMFont();
      a = new BytesReader(a);
      var c = a.readByte();
      var d = a.readByte();
      var e = a.readByte();
      if (c != 66 || d != 77 || e != 70) {
        throw 6;
      }
      if (a.readByte() != 3) {
        throw 7;
      }
      a.readByte();
      c = a.readInt32();
      d = a.readInt16();
      a.readByte();
      a.readByte();
      a.readUInt16();
      a.readByte();
      e = a.readByte();
      var f = a.readByte();
      var g = a.readByte();
      var h = a.readByte();
      a.readByte();
      a.readByte();
      a.readByte();
      a.readString(c - 14);
      b.info = new BMFontInfo(Math.abs(d), new Padding4(e, f, g, h));
      a.readByte();
      a.readInt32();
      c = Math.max(a.readUInt16(), b.info.size) | 0;
      d = a.readUInt16();
      e = a.readUInt16();
      f = a.readUInt16();
      a.readUInt16();
      a.readByte();
      a.readByte();
      a.readByte();
      a.readByte();
      a.readByte();
      b.common = new BMFontCommon(c, d, e, f);
      a.readByte();
      c = a.readInt32();
      d = a.pos;
      a.readCString();
      d = a.pos - d;
      for (c -= d; c > 0;) {
        a.readCString();
        c -= d;
      }
      a.readByte();
      c = a.readInt32() / 20 | 0;
      for (d = 0; d < c;) {
        ++d;
        e = a.readInt32();
        f = a.readUInt16();
        g = a.readUInt16();
        h = a.readUInt16();
        let m = a.readUInt16();
        let n = a.readInt16();
        let q = a.readInt16();
        let p = a.readInt16();
        a.readByte();
        a.readByte();
        b.glyphs.push(new BMFontGlyph(e, f, g, h, m, n, q, p));
      }
      if (a.pos == a.end) {
        return b;
      }
      a.readByte();
      for (a.readInt32(); a.pos < a.end;) {
        c = a.readInt32();
        d = a.readInt32();
        e = a.readInt16();
        b.kerningPairs.push(new BMFontKerning(c, d, e));
      }
      return b;
    }
  }
  BMFontParser.i = true;
  Object.assign(BMFontParser.prototype, {
    l: BMFontParser
  });
  class BMFontConvert {
    static buildAtlas(a) {
      var b = 0;
      for (var c = 0, d = a.glyphs; c < d.length;) {
        b = Math.max(b, d[c++].id + 1);
      }
      c = Array(b);
      for (d = 0; d < b;) {
        c[d++] = null;
      }
      b = 0;
      for (d = a.glyphs; b < d.length;) {
        let e = d[b];
        ++b;
        c[e.id] = e;
      }
      return new BMFontAtlas(c, a.info.size, a.common.lineHeight, a.common.base, a.glyphs[0].xAdvance, a.common.FR, a.common.ER, [a.info.padding.top, a.info.padding.right, a.info.padding.bottom, a.info.padding.left]);
    }
    static flatten(a) {
      let b = [];
      let c = 0;
      for (a = a.glyphs; c < a.length;) {
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
      this.glyphsById = a;
      this.fontSize = b;
      this.lineHeight = c;
      this.base = d;
      this.defaultAdvance = e;
      this.padding = h;
      this.kerning = new HashMap();
      this.ligatures = new HashMap();
    }
  }
  BMFontAtlas.i = true;
  Object.assign(BMFontAtlas.prototype, {
    l: BMFontAtlas
  });

  class TextLayout {
    constructor() {
      this.cursor = new Vec4(0, 0, 0, 1);
      this.glyphs = new ArrayList(32);
      this.lineCount = 1;
      this.bounds = new Bounds(0, 0, 0, 0);
      this.vertices = new ArrayList(256);
    }
    free() {
      this.glyphs.freeNative();
      this.glyphs = null;
    }
    shape(a, b) {
      if (b == null) {
        b = false;
      }
      let c = this.bounds;
      c.left = c.top = vInfinity;
      c.right = c.bottom = vNegInfinity;
      var d = a.text;
      if (d != null) {
        var e = d.length;
        if (e != null) {
          d = this.vertices;
          if (!b) {
            d.reserve(e * 5);
            d.clear();
          }
          var f = a.charset;
          e = a.fontSize / f.fontSize * a.Hb.scale;
          f = f.lineHeight * e + a.yOffsetPerLine * e;
          var g = a.padding;
          var h = a.size.x;
          var m = a.padding;
          var n = this.cursor;
          n.x = g;
          n.y = g;
          n = !b && a.alignH != null;
          var q = !b && a.alignV != null;
          this.lineCount = 1;
          if (a.multiline) {
            b = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
            let v = 0;
            let u = a.Dx.length;
            let A = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
            let D = 0;
            let B = 0;
            while (v < u) {
              let K = a.Dx[v++];
              var p = this.shapeLine(K.text, a);
              this.cursor.x -= p.array[0].xOffset * e;
              let E = d.count;
              this.print(p, a, b);
              p = d.count;
              let v61 = b.right > h - m;
              if (v61 && b.right - b.left < h - m * 2) {
                if (n) {
                  this.applyAlignH(a, A, D, B);
                  c.add(A);
                }
                d.trim(E);
                D = B = E;
                A.left = A.top = vInfinity;
                A.right = A.bottom = vNegInfinity;
                --v;
              } else {
                A.add(b);
                B = p;
                if (K.hardBreak && n) {
                  this.applyAlignH(a, A, D, p);
                  c.add(A);
                  A.left = A.top = vInfinity;
                  A.right = A.bottom = vNegInfinity;
                  D = p;
                }
              }
              if (v61 || K.hardBreak) {
                this.cursor.x = g;
                this.cursor.y += f;
                this.lineCount++;
              }
            }
            if (n) {
              this.applyAlignH(a, A, D, B);
              c.add(A);
            }
          } else {
            f = this.shapeLine(a.text, a);
            if (f.count == 0) {
              return;
            }
            this.cursor.x -= f.array[0].xOffset * e;
            this.print(f, a, c, b);
            if (n) {
              this.applyAlignH(a, c, 0, d.count);
            }
          }
          if (q) {
            this.applyAlignV(a, c, 0, d.count);
          }
        }
      }
    }
    Wg(a, b, c, d) {
      let e = a.padding;
      let f = a.size.x - e * 2;
      for (a = a.alignH < 0 ? -b.left + e : a.alignH == 0 ? f / 2 - (b.left + b.right) / 2 + e : f - b.right + e; c < d;) {
        this.vertices.array[c + 1] += a;
        c += 5;
      }
      d = b.left + a;
      c = b.right - b.left;
      b.left = d;
      b.right = d + c;
    }
    bl(a, b) {
      var c = a.padding;
      var d = a.size.y - c * 2;
      a = a.alignV < 0 ? -b.top + c : a.alignV == 0 ? d / 2 - (b.top + b.bottom) / 2 + c : d - b.bottom + c;
      c = 0;
      for (d = this.vertices.count / 5 | 0; c < d;) {
        this.vertices.array[c++ * 5 + 2] += a;
      }
      a = b.top + a;
      c = b.bottom - b.top;
      b.top = a;
      b.bottom = a + c;
    }
    print(a, b, c, d) {
      if (d == null) {
        d = false;
      }
      c.left = c.top = vInfinity;
      c.right = c.bottom = vNegInfinity;
      let e = b.charset;
      let f = b.fontSize / e.fontSize * b.Hb.scale;
      let g = b.ZE * f;
      let h = 0;
      let m = a.count;
      for (var n = 0; h < m;) {
        var q = a.array[h++];
        var p = this.cursor.x + q.xOffset * f;
        var v = this.cursor.y + q.yOffset * f;
        let A = q.width * f;
        let D = q.height * f;
        let B = 0;
        if (b.kerning) {
          n = e.kerning.map[q.id << 16 | n];
          if (n != null) {
            B = n;
          }
          B *= f;
          n = q.id;
          p += B;
        }
        if (!d) {
          var u = this.vertices;
          u.array[u.count++] = q.id;
          u = this.vertices;
          u.array[u.count++] = p;
          u = this.vertices;
          u.array[u.count++] = v;
          u = this.vertices;
          u.array[u.count++] = A;
          u = this.vertices;
          u.array[u.count++] = D;
        }
        if (q.id > 32) {
          u = p;
          if (u < c.left) {
            c.left = u;
          }
          if (u > c.right) {
            c.right = u;
          }
          if (v < c.top) {
            c.top = v;
          }
          if (v > c.bottom) {
            c.bottom = v;
          }
          p += A;
          v += D;
          if (p < c.left) {
            c.left = p;
          }
          if (p > c.right) {
            c.right = p;
          }
          if (v < c.top) {
            c.top = v;
          }
          if (v > c.bottom) {
            c.bottom = v;
          }
        }
        q = q.xAdvance;
        if (b.mA > 0) {
          q = b.mA;
        }
        this.cursor.x += q * f + B + g;
      }
    }
    shapeLine(a, b) {
      let c = a.length;
      let d = this.glyphs;
      d.clear();
      d.reserve(c);
      var e = b.charset;
      let f = e.glyphsById;
      e = e.ligatures;
      b = b.qR;
      let g;
      g = 1;
      var h = a.charCodeAt(0);
      if (h >= 32) {
        if (f[h] == null) {
          h = b;
        }
        var m = f[h];
        d.array[d.count++] = m;
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
            h = e.map[h << 16 | m];
            if (h != null) {
              --d.count;
              m = h;
            }
          }
          h = f[m];
          d.array[d.count++] = h;
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
      this.hardBreak = b;
    }
  }
  TextRun.i = true;
  Object.assign(TextRun.prototype, {
    l: TextRun
  });
