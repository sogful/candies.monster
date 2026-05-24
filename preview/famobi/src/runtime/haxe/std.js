  class PlatformBack {
    static back() {
      window.webOSSystem.platformBack();
    }
  }
  PlatformBack.i = true;
  class Build {}
  Build.i = true;
  class Std {
    static Eu(a, b) {
      a = a.charCodeAt(b);
      if (a == a) {
        return a;
      }
    }
    static substr(a, b, c) {
      if (c == null) {
        c = a.length;
      } else if (c < 0) {
        if (b == 0) {
          c = a.length + c;
        } else {
          return "";
        }
      }
      return a.substr(b, c);
    }
    static remove(a, b) {
      b = a.indexOf(b);
      if (b == -1) {
        return false;
      }
      a.splice(b, 1);
      return true;
    }
    static now() {
      return Date.now();
    }
  }
  Std.i = true;
  class IntIter {
    constructor(a, b) {
      this.min = a;
      this.max = b;
    }
    fb() {
      return this.min < this.max;
    }
    next() {
      return this.min++;
    }
  }
  IntIter.i = true;
  Object.assign(IntIter.prototype, {
    l: IntIter
  });
  class Lambda {
    static Ej(a, b) {
      for (a = getIterator(a); a.fb();) {
        if (b(a.next())) {
          return true;
        }
      }
      return false;
    }
    static zi(a, b) {
      for (a = getIterator(a); a.fb();) {
        b(a.next());
      }
    }
    static count(a, b) {
      let c = 0;
      if (b == null) {
        for (b = getIterator(a); b.fb();) {
          b.next();
          ++c;
        }
      } else {
        for (a = getIterator(a); a.fb();) {
          if (b(a.next())) {
            ++c;
          }
        }
      }
      return c;
    }
    static find(a, b) {
      for (a = getIterator(a); a.fb();) {
        let c = a.next();
        if (b(c)) {
          return c;
        }
      }
      return null;
    }
  }
  Lambda.i = true;
  class ObjectAccess {
    static vf(a, b) {
      try {
        return a[b];
      } catch (c) {
        return null;
      }
    }
    static jN(a) {
      let b = [];
      if (a != null) {
        let d = Object.prototype.hasOwnProperty;
        for (var c in a) {
          if (c != "__id__" && c != "hx__closures__" && d.call(a, c)) {
            b.push(c);
          }
        }
      }
      return b;
    }
  }
  ObjectAccess.i = true;
  class Construct {
    static qA(a) {
      return new (Function.prototype.bind.apply(a, [null].concat([])))();
    }
  }
  Construct.i = true;
  class DelayedCall {
    constructor(a) {
      let b = this;
      this.id = setInterval(function () {
        b.Hg();
      }, a);
    }
    stop() {
      if (this.id != null) {
        clearInterval(this.id);
        this.id = null;
      }
    }
    Hg() {}
    static delay(a, b) {
      let c = new DelayedCall(b);
      c.Hg = function () {
        c.stop();
        a();
      };
      return c;
    }
  }
  DelayedCall.i = true;
  Object.assign(DelayedCall.prototype, {
    l: DelayedCall
  });
  class StdString {
    static AN(a) {
      if (a == null) {
        return null;
      }
      if (a instanceof Array) {
        return Array;
      }
      let b = a.l;
      if (b != null) {
        return b;
      }
      a = StdString.wz(a);
      if (a != null) {
        return StdString.wL(a);
      } else {
        return null;
      }
    }
    static on(a, b) {
      if (a == null) {
        return "null";
      }
      if (b.length >= 5) {
        return "<...>";
      }
      var c = typeof a;
      if (c == "function" && (a.i || a.uz)) {
        c = "object";
      }
      switch (c) {
        case "function":
          return "<function>";
        case "object":
          if (a.nn) {
            var d = v9[a.nn].sz[a.$t];
            c = d.Az;
            if (d.vL) {
              b += "\t";
              var e = [];
              var f = 0;
              for (d = d.vL; f < d.length;) {
                let g = d[f];
                f += 1;
                e.push(StdString.on(a[g], b));
              }
              return c + "(" + e.join(",") + ")";
            }
            return c;
          }
          if (a instanceof Array) {
            c = "[";
            b += "\t";
            e = 0;
            for (f = a.length; e < f;) {
              d = e++;
              c += (d > 0 ? "," : "") + StdString.on(a[d], b);
            }
            return c + "]";
          }
          try {
            e = a.toString;
          } catch (g) {
            return "???";
          }
          if (e != null && e != Object.toString && typeof e == "function" && (c = a.toString(), c != "[object Object]")) {
            return c;
          }
          c = "{\n";
          b += "\t";
          e = a.hasOwnProperty != null;
          f = null;
          for (f in a) {
            if ((!e || !!a.hasOwnProperty(f)) && f != "prototype" && f != "__class__" && f != "__super__" && f != "__interfaces__" && f != "__properties__") {
              if (c.length != 2) {
                c += ", \n";
              }
              c += b + f + " : " + StdString.on(a[f], b);
            }
          }
          b = b.substring(1);
          return c + ("\n" + b + "}");
        case "string":
          return a;
        default:
          return String(a);
      }
    }
    static vz(a, b) {
      while (true) {
        if (a == null) {
          return false;
        }
        if (a == b) {
          return true;
        }
        let c = a.Ib;
        if (c != null && (a.s == null || a.s.Ib != c)) {
          let d = 0;
          let e = c.length;
          while (d < e) {
            let f = c[d++];
            if (f == b || StdString.vz(f, b)) {
              return true;
            }
          }
        }
        a = a.s;
      }
    }
    static Xt(a, b) {
      if (b == null) {
        return false;
      }
      switch (b) {
        case Array:
          return a instanceof Array;
        case vBoolean:
          return typeof a == "boolean";
        case vO3:
          return a != null;
        case vNumber:
          return typeof a == "number";
        case vO2:
          if (typeof a == "number") {
            return (a | 0) === a;
          } else {
            return false;
          }
        case String:
          return typeof a == "string";
        default:
          if (a != null) {
            if (typeof b == "function") {
              if (StdString.tL(a, b)) {
                return true;
              }
            } else if (typeof b == "object" && StdString.uL(b) && a instanceof b) {
              return true;
            }
          } else {
            return false;
          }
          if (b == vO4 && a.i != null || b == vO5 && a.uz != null) {
            return true;
          } else if (a.nn != null) {
            return v9[a.nn] == b;
          } else {
            return false;
          }
      }
    }
    static tL(a, b) {
      if (a instanceof b) {
        return true;
      } else if (b.Je) {
        return StdString.vz(StdString.AN(a), b);
      } else {
        return false;
      }
    }
    static wz(a) {
      a = StdString.xL.call(a).slice(8, -1);
      if (a == "Object" || a == "Function" || a == "Math" || a == "JSON") {
        return null;
      } else {
        return a;
      }
    }
    static uL(a) {
      return StdString.wz(a) != null;
    }
    static wL(a) {
      return host[a];
    }
  }
  StdString.i = true;
  class Coord {
    constructor(a, b) {
      if (b == null) {
        b = 0;
      }
      if (a == null) {
        a = 0;
      }
      this.x = a;
      this.y = b;
    }
  }
  Coord.i = true;
  Object.assign(Coord.prototype, {
    l: Coord
  });
  class Numeric {
    static Ed(a) {
      return StdString.on(a, "");
    }
    static parseInt(a) {
      a = parseInt(a);
      if (isNaN(a)) {
        return null;
      } else {
        return a;
      }
    }
  }
  Numeric.i = true;
  class StringUtil {
    static Dr(a, b) {
      a = Std.Eu(a, b);
      if (a > 8 && a < 14) {
        return true;
      } else {
        return a == 32;
      }
    }
    static AP(a) {
      var b;
      let c = "";
      for (b = 4 - a.length; c.length < b;) {
        c += "0";
      }
      return c + (a == null ? "null" : "" + a);
    }
    static oO(a) {
      let b = "";
      do {
        b = "0123456789ABCDEF".charAt(a & 15) + b;
        a >>>= 4;
      } while (a > 0);
      while (b.length < 2) {
        b = "0" + b;
      }
      return b;
    }
  }
  StringUtil.i = true;
  class SemVer {
    constructor(a) {
      let b = new EReg("^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$", "");
      if (b.match(a)) {
        this.EP = Numeric.parseInt(b.Zc(1));
        this.MP = Numeric.parseInt(b.Zc(2));
        this.Zr = Numeric.parseInt(b.Zc(3));
        this.fD = b.Zc(4);
        this.$z = b.Zc(5);
      } else {
        throw 23;
      }
    }
    toString() {
      let a = this.EP + "." + this.MP + "." + this.Zr;
      if (this.fD != null) {
        a += "-" + this.fD;
      }
      if (this.$z != null) {
        a += "+" + this.$z;
      }
      return a;
    }
  }
  SemVer.i = true;
  Object.assign(SemVer.prototype, {
    l: SemVer
  });

  class Comparator {
    static mM(a, b) {
      a = a.toLowerCase();
      b = b.toLowerCase();
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    }
  }
  Comparator.i = true;

  class MathUtil {
    static LD(a, b) {
      return a < 0 == b < 0;
    }
    static FA(a, b, c) {
      return Math.max(Math.min(a, c), b);
    }
    static fp(a, b) {
      return Math.floor(Math.random() * (b - a + 1) + a);
    }
    static eR() {
      return Math.random() > 0.5;
    }
    static aP(a, b, c, d, e, f, g, h) {
      let m = e - a + g - c;
      let n = f - b + h - d;
      a = c - a;
      b = d - b;
      e = g - e;
      f = h - f;
      h = Math.abs(b * e - f * a);
      if (Math.abs(e * n - f * m) <= h) {
        return Math.abs(a * n - b * m) <= h;
      } else {
        return false;
      }
    }
  }
  MathUtil.i = true;
  class Triple3 {
    constructor(a, b, c) {
      this.yr = a;
      this.Sn = b;
      this.bt = c;
    }
  }
  Triple3.i = true;
  Object.assign(Triple3.prototype, {
    l: Triple3
  });

  class RandomGen {
    constructor(a) {
      this.jS(a);
    }
    jS(a) {
      this.seed = a;
    }
    ym() {
      return this.gi() < 0.5;
    }
    xh(a, b) {
      a -= 0.4999;
      return Math.round(a + (b + 0.4999 - a) * this.gi());
    }
    Yn(a, b) {
      return a + (b - a) * this.gi();
    }
    BA(a) {
      return this.Yn(-a, a);
    }
    Ac() {
      return this.gi() - this.gi();
    }
  }
  RandomGen.i = true;
  Object.assign(RandomGen.prototype, {
    l: RandomGen
  });
  class MathRandom extends RandomGen {
    constructor() {
      super(0);
    }
    gi() {
      return Math.random();
    }
  }
  MathRandom.i = true;
  MathRandom.s = RandomGen;
  Object.assign(MathRandom.prototype, {
    l: MathRandom
  });
