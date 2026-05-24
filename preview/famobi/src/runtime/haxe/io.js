  class Bytes {
    constructor(a) {
      this.length = a.byteLength;
      this.b = new Uint8Array(a);
      this.b.aM = a;
      a.qO = this;
      a.bA = this.b;
    }
    yb(a, b, c) {
      if (a < 0 || b < 0 || a + b > this.length) {
        throw 12;
      }
      if (c == null) {
        c = v141.Ut;
      }
      let d = "";
      let e = this.b;
      let f = a;
      a += b;
      switch (c.$t) {
        case 0:
          while (f < a) {
            c = e[f++];
            if (c < 128) {
              if (c == 0) {
                break;
              }
              d += String.fromCodePoint(c);
            } else if (c < 224) {
              c = (c & 63) << 6 | e[f++] & 127;
              d += String.fromCodePoint(c);
            } else if (c < 240) {
              c = (c & 31) << 12 | (e[f++] & 127) << 6 | e[f++] & 127;
              d += String.fromCodePoint(c);
            } else {
              c = (c & 15) << 18 | (e[f++] & 127) << 12 | (e[f++] & 127) << 6 | e[f++] & 127;
              d += String.fromCodePoint(c);
            }
          }
          break;
        case 1:
          while (f < a) {
            c = e[f++] | e[f++] << 8;
            d += String.fromCodePoint(c);
          }
      }
      return d;
    }
    toString() {
      return this.yb(0, this.length);
    }
    static EC(a) {
      if (v141.Wy == undefined) {
        var b = new Uint8Array(a.length << 1);
        for (var c = 0, d = a.length; c < d;) {
          let e = c++;
          let f = a.charCodeAt(e);
          b[e << 1] = f & 255;
          b[e << 1 | 1] = f >> 8;
        }
        return new Bytes(b.buffer);
      }
      b = [];
      for (c = 0; c < a.length;) {
        d = a.charCodeAt(c++);
        if (d >= 55296 && d <= 56319) {
          d = d - 55232 << 10 | a.charCodeAt(c++) & 1023;
        }
        if (d <= 127) {
          b.push(d);
        } else {
          if (d <= 2047) {
            b.push(d >> 6 | 192);
          } else {
            if (d <= 65535) {
              b.push(d >> 12 | 224);
            } else {
              b.push(d >> 18 | 240);
              b.push(d >> 12 & 63 | 128);
            }
            b.push(d >> 6 & 63 | 128);
          }
          b.push(d & 63 | 128);
        }
      }
      return new Bytes(new Uint8Array(b).buffer);
    }
    static hk(a) {
      let b = a.qO;
      return b ?? new Bytes(a);
    }
  }
  Bytes.i = true;
  Object.assign(Bytes.prototype, {
    l: Bytes
  });
  var v141 = v9["haxe.io.Encoding"] = {
    uz: true,
    sz: null,
    Ut: {
      Az: "UTF8",
      $t: 0,
      nn: "haxe.io.Encoding",
      toString: numToString
    },
    Wy: {
      Az: "RawNative",
      $t: 1,
      nn: "haxe.io.Encoding",
      toString: numToString
    }
  };
  v141.sz = [v141.Ut, v141.Wy];
  class Base64 {
    static encode(a, b) {
      if (b == null) {
        b = true;
      }
      let c = new BaseN(Base64.jy).eN(a).toString();
      if (b) {
        switch (a.length % 3) {
          case 1:
            c += "==";
            break;
          case 2:
            c += "=";
        }
      }
      return c;
    }
    static decode(a, b) {
      if (b == null) {
        b = true;
      }
      if (b) {
        while (Std.Eu(a, a.length - 1) == 61) {
          a = Std.substr(a, 0, -1);
        }
      }
      return new BaseN(Base64.jy).GM(Bytes.EC(a));
    }
  }
  Base64.i = true;
  class BaseN {
    constructor(a) {
      let b = a.length;
      let c = 1;
      while (b > 1 << c) {
        ++c;
      }
      if (c > 8 || b != 1 << c) {
        throw 13;
      }
      this.vj = a;
      this.rC = c;
    }
    eN(a) {
      let b = this.rC;
      let c = this.vj;
      let d = a.length * 8 / b | 0;
      let e = new Bytes(new ArrayBuffer(d + (a.length * 8 % b == 0 ? 0 : 1)));
      let f = 0;
      let g = 0;
      let h = (1 << b) - 1;
      let m = 0;
      let n = 0;
      while (n < d) {
        while (g < b) {
          g += 8;
          f <<= 8;
          f |= a.b[m++];
        }
        g -= b;
        e.b[n++] = c.b[f >> g & h];
      }
      if (g > 0) {
        e.b[n++] = c.b[f << b - g & h];
      }
      return e;
    }
    vO() {
      let a = [];
      for (var b = 0; b < 256;) {
        a[b++] = -1;
      }
      b = 0;
      let c = this.vj.length;
      while (b < c) {
        let d = b++;
        a[this.vj.b[d]] = d;
      }
      this.JE = a;
    }
    GM(a) {
      let b = this.rC;
      if (this.JE == null) {
        this.vO();
      }
      let c = this.JE;
      let d = a.length * b >> 3;
      let e = new Bytes(new ArrayBuffer(d));
      let f = 0;
      let g = 0;
      let h = 0;
      let m = 0;
      while (m < d) {
        while (g < 8) {
          g += b;
          f <<= b;
          let n = c[a.b[h++]];
          if (n == -1) {
            throw 14;
          }
          f |= n;
        }
        g -= 8;
        e.b[m++] = f >> g & 255;
      }
      return e;
    }
  }
  BaseN.i = true;
  Object.assign(BaseN.prototype, {
    l: BaseN
  });

  class BinaryReader {
    ta() {
      throw 26;
    }
    zm(a, b, c) {
      let d = c;
      let e = a.b;
      if (b < 0 || c < 0 || b + c > a.length) {
        throw 15;
      }
      try {
        while (d > 0) {
          e[b] = this.ta();
          ++b;
          --d;
        }
      } catch (f) {
        if (!(haxe.Exception.CT(f).FT() instanceof haxe.DT.BT)) {
          throw f;
        }
      }
      return c - d;
    }
    gR(a, b) {
      var c = 0;
      for (; b > 0;) {
        let d = this.zm(a, c, b);
        if (d == 0) {
          throw 16;
        }
        c += d;
        b -= d;
      }
    }
    pD() {
      let a = new BytesBuilder();
      let b;
      while (true) {
        b = this.ta();
        if (b == 0) {
          break;
        }
        a.LL(b);
      }
      a.eo();
    }
    fR() {
      let a = this.Eg();
      let b = this.Eg();
      if (this.mq) {
        return Float64Cast.zB(b, a);
      } else {
        return Float64Cast.zB(a, b);
      }
    }
    kc() {
      var a = this.ta();
      let b = this.ta();
      a = this.mq ? b | a << 8 : a | b << 8;
      if ((a & 32768) != 0) {
        return a - 65536;
      } else {
        return a;
      }
    }
    zd() {
      let a = this.ta();
      let b = this.ta();
      if (this.mq) {
        return b | a << 8;
      } else {
        return a | b << 8;
      }
    }
    oD() {
      let a = this.ta();
      let b = this.ta();
      let c = this.ta();
      if (this.mq) {
        return c | b << 8 | a << 16;
      } else {
        return a | b << 8 | c << 16;
      }
    }
    Eg() {
      let a = this.ta();
      let b = this.ta();
      let c = this.ta();
      let d = this.ta();
      if (this.mq) {
        return d | c << 8 | b << 16 | a << 24;
      } else {
        return a | b << 8 | c << 16 | d << 24;
      }
    }
    hs(a, b) {
      let c = new Bytes(new ArrayBuffer(a));
      this.gR(c, a);
      return c.yb(0, a, b);
    }
  }
  BinaryReader.i = true;
  Object.assign(BinaryReader.prototype, {
    l: BinaryReader
  });
  class BytesReader extends BinaryReader {
    constructor(a, b, c) {
      super();
      if (b == null) {
        b = 0;
      }
      if (c == null) {
        c = a.length - b;
      }
      if (b < 0 || c < 0 || b + c > a.length) {
        throw 17;
      }
      this.b = a.b;
      this.g = b;
      this.UE = this.Yj = c;
    }
    ta() {
      if (this.Yj == 0) {
        throw 18;
      }
      this.Yj--;
      return this.b[this.g++];
    }
    zm(a, b, c) {
      if (b < 0 || c < 0 || b + c > a.length) {
        throw 19;
      }
      if (this.Yj == 0 && c > 0) {
        throw 20;
      }
      if (this.Yj < c) {
        c = this.Yj;
      }
      let d = this.b;
      a = a.b;
      let e = 0;
      let f = c;
      while (e < f) {
        let g = e++;
        a[b + g] = d[this.g + g];
      }
      this.g += c;
      this.Yj -= c;
      return c;
    }
  }
  BytesReader.i = true;
  BytesReader.s = BinaryReader;
  Object.assign(BytesReader.prototype, {
    l: BytesReader
  });
  class Float64Cast {
    static zB(a, b) {
      Float64Cast.Ev.setInt32(0, a, true);
      Float64Cast.Ev.setInt32(4, b, true);
      return Float64Cast.Ev.getFloat64(0, true);
    }
  }
  Float64Cast.i = true;

  class BytesBuilder {
    constructor() {
      this.size = this.g = 0;
    }
    LL(a) {
      if (this.g == this.size) {
        this.grow(1);
      }
      this.view.setUint8(this.g++, a);
    }
    grow(a) {
      var b = this.g + a;
      for (a = this.size == 0 ? 16 : this.size; a < b;) {
        a = a * 3 >> 1;
      }
      b = new ArrayBuffer(a);
      let c = new Uint8Array(b);
      if (this.size > 0) {
        c.set(this.fT);
      }
      this.size = a;
      this.buffer = b;
      this.fT = c;
      this.view = new DataView(this.buffer);
    }
    eo() {
      if (this.size == 0) {
        return new Bytes(new ArrayBuffer(0));
      }
      let a = new Bytes(this.buffer);
      a.length = this.g;
      return a;
    }
  }
  BytesBuilder.i = true;
  Object.assign(BytesBuilder.prototype, {
    l: BytesBuilder
  });
  class MD5 {
    static encode(a) {
      var b = a.length;
      let c = [1732584193, -271733879, -1732584194, 271733878];
      let d = 64;
      let e = a.length;
      var f = [];
      for (; d <= e;) {
        var g = a.substring(d - 64, d);
        let h = 0;
        while (h < 64) {
          f[h >> 2] = g.charCodeAt(h) + (g.charCodeAt(h + 1) << 8) + (g.charCodeAt(h + 2) << 16) + (g.charCodeAt(h + 3) << 24);
          h += 4;
        }
        MD5.hw(c, f);
        d += 64;
      }
      a = a.substring(d - 64);
      f = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      d = 0;
      for (e = a.length; d < e;) {
        f[d >> 2] |= a.charCodeAt(d) << (d % 4 << 3);
        ++d;
      }
      f[d >> 2] |= 128 << (d % 4 << 3);
      if (d > 55) {
        MD5.hw(c, f);
        d = 0;
        while (d < 16) {
          f[d] = 0;
          ++d;
        }
      }
      f[14] = b * 8;
      MD5.hw(c, f);
      b = MD5.yG;
      f = "";
      d = 0;
      for (e = c.length; d < e;) {
        a = 0;
        g = c[d++];
        while (a < 4) {
          f += b[g >> (a << 3) + 4 & 15] + b[g >> (a << 3) & 15];
          ++a;
        }
      }
      return f;
    }
    static hw(a, b) {
      let c = a[0];
      let d = a[1];
      let e = a[2];
      let f = a[3];
      let g = (c + (d & e | ~d & f) & -1) + (b[0] + -680876936 & -1) & -1;
      c = (g << 7 | g >>> 25) + d & -1;
      g = (f + (c & d | ~c & e) & -1) + (b[1] + -389564586 & -1) & -1;
      f = (g << 12 | g >>> 20) + c & -1;
      g = (e + (f & c | ~f & d) & -1) + (b[2] + 606105819 & -1) & -1;
      e = (g << 17 | g >>> 15) + f & -1;
      g = (d + (e & f | ~e & c) & -1) + (b[3] + -1044525330 & -1) & -1;
      d = (g << 22 | g >>> 10) + e & -1;
      g = (c + (d & e | ~d & f) & -1) + (b[4] + -176418897 & -1) & -1;
      c = (g << 7 | g >>> 25) + d & -1;
      g = (f + (c & d | ~c & e) & -1) + (b[5] + 1200080426 & -1) & -1;
      f = (g << 12 | g >>> 20) + c & -1;
      g = (e + (f & c | ~f & d) & -1) + (b[6] + -1473231341 & -1) & -1;
      e = (g << 17 | g >>> 15) + f & -1;
      g = (d + (e & f | ~e & c) & -1) + (b[7] + -45705983 & -1) & -1;
      d = (g << 22 | g >>> 10) + e & -1;
      g = (c + (d & e | ~d & f) & -1) + (b[8] + 1770035416 & -1) & -1;
      c = (g << 7 | g >>> 25) + d & -1;
      g = (f + (c & d | ~c & e) & -1) + (b[9] + -1958414417 & -1) & -1;
      f = (g << 12 | g >>> 20) + c & -1;
      g = (e + (f & c | ~f & d) & -1) + (b[10] + -42063 & -1) & -1;
      e = (g << 17 | g >>> 15) + f & -1;
      g = (d + (e & f | ~e & c) & -1) + (b[11] + -1990404162 & -1) & -1;
      d = (g << 22 | g >>> 10) + e & -1;
      g = (c + (d & e | ~d & f) & -1) + (b[12] + 1804603682 & -1) & -1;
      c = (g << 7 | g >>> 25) + d & -1;
      g = (f + (c & d | ~c & e) & -1) + (b[13] + -40341101 & -1) & -1;
      f = (g << 12 | g >>> 20) + c & -1;
      g = (e + (f & c | ~f & d) & -1) + (b[14] + -1502002290 & -1) & -1;
      e = (g << 17 | g >>> 15) + f & -1;
      g = (d + (e & f | ~e & c) & -1) + (b[15] + 1236535329 & -1) & -1;
      d = (g << 22 | g >>> 10) + e & -1;
      g = (c + (d & f | e & ~f) & -1) + (b[1] + -165796510 & -1) & -1;
      c = (g << 5 | g >>> 27) + d & -1;
      g = (f + (c & e | d & ~e) & -1) + (b[6] + -1069501632 & -1) & -1;
      f = (g << 9 | g >>> 23) + c & -1;
      g = (e + (f & d | c & ~d) & -1) + (b[11] + 643717713 & -1) & -1;
      e = (g << 14 | g >>> 18) + f & -1;
      g = (d + (e & c | f & ~c) & -1) + (b[0] + -373897302 & -1) & -1;
      d = (g << 20 | g >>> 12) + e & -1;
      g = (c + (d & f | e & ~f) & -1) + (b[5] + -701558691 & -1) & -1;
      c = (g << 5 | g >>> 27) + d & -1;
      g = (f + (c & e | d & ~e) & -1) + (b[10] + 38016083 & -1) & -1;
      f = (g << 9 | g >>> 23) + c & -1;
      g = (e + (f & d | c & ~d) & -1) + (b[15] + -660478335 & -1) & -1;
      e = (g << 14 | g >>> 18) + f & -1;
      g = (d + (e & c | f & ~c) & -1) + (b[4] + -405537848 & -1) & -1;
      d = (g << 20 | g >>> 12) + e & -1;
      g = (c + (d & f | e & ~f) & -1) + (b[9] + 568446438 & -1) & -1;
      c = (g << 5 | g >>> 27) + d & -1;
      g = (f + (c & e | d & ~e) & -1) + (b[14] + -1019803690 & -1) & -1;
      f = (g << 9 | g >>> 23) + c & -1;
      g = (e + (f & d | c & ~d) & -1) + (b[3] + -187363961 & -1) & -1;
      e = (g << 14 | g >>> 18) + f & -1;
      g = (d + (e & c | f & ~c) & -1) + (b[8] + 1163531501 & -1) & -1;
      d = (g << 20 | g >>> 12) + e & -1;
      g = (c + (d & f | e & ~f) & -1) + (b[13] + -1444681467 & -1) & -1;
      c = (g << 5 | g >>> 27) + d & -1;
      g = (f + (c & e | d & ~e) & -1) + (b[2] + -51403784 & -1) & -1;
      f = (g << 9 | g >>> 23) + c & -1;
      g = (e + (f & d | c & ~d) & -1) + (b[7] + 1735328473 & -1) & -1;
      e = (g << 14 | g >>> 18) + f & -1;
      g = (d + (e & c | f & ~c) & -1) + (b[12] + -1926607734 & -1) & -1;
      d = (g << 20 | g >>> 12) + e & -1;
      g = (c + (d ^ e ^ f) & -1) + (b[5] + -378558 & -1) & -1;
      c = (g << 4 | g >>> 28) + d & -1;
      g = (f + (c ^ d ^ e) & -1) + (b[8] + -2022574463 & -1) & -1;
      f = (g << 11 | g >>> 21) + c & -1;
      g = (e + (f ^ c ^ d) & -1) + (b[11] + 1839030562 & -1) & -1;
      e = (g << 16 | g >>> 16) + f & -1;
      g = (d + (e ^ f ^ c) & -1) + (b[14] + -35309556 & -1) & -1;
      d = (g << 23 | g >>> 9) + e & -1;
      g = (c + (d ^ e ^ f) & -1) + (b[1] + -1530992060 & -1) & -1;
      c = (g << 4 | g >>> 28) + d & -1;
      g = (f + (c ^ d ^ e) & -1) + (b[4] + 1272893353 & -1) & -1;
      f = (g << 11 | g >>> 21) + c & -1;
      g = (e + (f ^ c ^ d) & -1) + (b[7] + -155497632 & -1) & -1;
      e = (g << 16 | g >>> 16) + f & -1;
      g = (d + (e ^ f ^ c) & -1) + (b[10] + -1094730640 & -1) & -1;
      d = (g << 23 | g >>> 9) + e & -1;
      g = (c + (d ^ e ^ f) & -1) + (b[13] + 681279174 & -1) & -1;
      c = (g << 4 | g >>> 28) + d & -1;
      g = (f + (c ^ d ^ e) & -1) + (b[0] + -358537222 & -1) & -1;
      f = (g << 11 | g >>> 21) + c & -1;
      g = (e + (f ^ c ^ d) & -1) + (b[3] + -722521979 & -1) & -1;
      e = (g << 16 | g >>> 16) + f & -1;
      g = (d + (e ^ f ^ c) & -1) + (b[6] + 76029189 & -1) & -1;
      d = (g << 23 | g >>> 9) + e & -1;
      g = (c + (d ^ e ^ f) & -1) + (b[9] + -640364487 & -1) & -1;
      c = (g << 4 | g >>> 28) + d & -1;
      g = (f + (c ^ d ^ e) & -1) + (b[12] + -421815835 & -1) & -1;
      f = (g << 11 | g >>> 21) + c & -1;
      g = (e + (f ^ c ^ d) & -1) + (b[15] + 530742520 & -1) & -1;
      e = (g << 16 | g >>> 16) + f & -1;
      g = (d + (e ^ f ^ c) & -1) + (b[2] + -995338651 & -1) & -1;
      d = (g << 23 | g >>> 9) + e & -1;
      g = (c + (e ^ (d | ~f)) & -1) + (b[0] + -198630844 & -1) & -1;
      c = (g << 6 | g >>> 26) + d & -1;
      g = (f + (d ^ (c | ~e)) & -1) + (b[7] + 1126891415 & -1) & -1;
      f = (g << 10 | g >>> 22) + c & -1;
      g = (e + (c ^ (f | ~d)) & -1) + (b[14] + -1416354905 & -1) & -1;
      e = (g << 15 | g >>> 17) + f & -1;
      g = (d + (f ^ (e | ~c)) & -1) + (b[5] + -57434055 & -1) & -1;
      d = (g << 21 | g >>> 11) + e & -1;
      g = (c + (e ^ (d | ~f)) & -1) + (b[12] + 1700485571 & -1) & -1;
      c = (g << 6 | g >>> 26) + d & -1;
      g = (f + (d ^ (c | ~e)) & -1) + (b[3] + -1894986606 & -1) & -1;
      f = (g << 10 | g >>> 22) + c & -1;
      g = (e + (c ^ (f | ~d)) & -1) + (b[10] + -1051523 & -1) & -1;
      e = (g << 15 | g >>> 17) + f & -1;
      g = (d + (f ^ (e | ~c)) & -1) + (b[1] + -2054922799 & -1) & -1;
      d = (g << 21 | g >>> 11) + e & -1;
      g = (c + (e ^ (d | ~f)) & -1) + (b[8] + 1873313359 & -1) & -1;
      c = (g << 6 | g >>> 26) + d & -1;
      g = (f + (d ^ (c | ~e)) & -1) + (b[15] + -30611744 & -1) & -1;
      f = (g << 10 | g >>> 22) + c & -1;
      g = (e + (c ^ (f | ~d)) & -1) + (b[6] + -1560198380 & -1) & -1;
      e = (g << 15 | g >>> 17) + f & -1;
      g = (d + (f ^ (e | ~c)) & -1) + (b[13] + 1309151649 & -1) & -1;
      d = (g << 21 | g >>> 11) + e & -1;
      g = (c + (e ^ (d | ~f)) & -1) + (b[4] + -145523070 & -1) & -1;
      c = (g << 6 | g >>> 26) + d & -1;
      g = (f + (d ^ (c | ~e)) & -1) + (b[11] + -1120210379 & -1) & -1;
      f = (g << 10 | g >>> 22) + c & -1;
      g = (e + (c ^ (f | ~d)) & -1) + (b[2] + 718787259 & -1) & -1;
      e = (g << 15 | g >>> 17) + f & -1;
      g = (d + (f ^ (e | ~c)) & -1) + (b[9] + -343485551 & -1) & -1;
      a[0] = c + a[0] & -1;
      a[1] = ((g << 21 | g >>> 11) + e & -1) + a[1] & -1;
      a[2] = e + a[2] & -1;
      a[3] = f + a[3] & -1;
    }
  }
  MD5.i = true;

  class BitMaskTable {}
  BitMaskTable.i = true;
