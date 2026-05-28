  class PlatformBack {
    static back() {
      window.webOSSystem.platformBack();
    }
  }
  PlatformBack.i = true;
  class Build {}
  Build.i = true;
  class Std {
    // charCode - fast charCodeAt, returns undefined when out of range
    // (charCodeAt returns NaN and NaN != NaN, so the inner check
    // discards undefined results). Mirrors Haxe's StringTools.fastCodeAt.
    static charCode(a, b) {
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
    hasNext() {
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
  // Lambda - generic iterable helpers. Mirrors Haxe's haxe.ds.Lambda.
  class Lambda {
    // exists - true if any element of `a` satisfies predicate `b`.
    static exists(a, b) {
      for (a = getIterator(a); a.hasNext();) {
        if (b(a.next())) {
          return true;
        }
      }
      return false;
    }
    // forEach - call `b` once per element of `a`.
    static forEach(a, b) {
      for (a = getIterator(a); a.hasNext();) {
        b(a.next());
      }
    }
    static count(a, b) {
      let c = 0;
      if (b == null) {
        for (b = getIterator(a); b.hasNext();) {
          b.next();
          ++c;
        }
      } else {
        for (a = getIterator(a); a.hasNext();) {
          if (b(a.next())) {
            ++c;
          }
        }
      }
      return c;
    }
    static find(a, b) {
      for (a = getIterator(a); a.hasNext();) {
        let c = a.next();
        if (b(c)) {
          return c;
        }
      }
      return null;
    }
  }
  Lambda.i = true;
  // ObjectAccess - dynamic property helpers shared by Haxe's
  // Reflect.field / Reflect.fields.
  class ObjectAccess {
    // getField - exception-swallowing a[b], returns null on failure.
    static getField(a, b) {
      try {
        return a[b];
      } catch (c) {
        return null;
      }
    }
    // getKeys - own property keys, skipping Haxe-internal bookkeeping
    // (__id__, hx__closures__).
    static getKeys(a) {
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
  // Construct - thin wrapper for Haxe's no-arg `Type.createInstance`.
  class Construct {
    static create(a) {
      return new (Function.prototype.bind.apply(a, [null].concat([])))();
    }
  }
  Construct.i = true;
  class DelayedCall {
    constructor(a) {
      let b = this;
      this.id = setInterval(function () {
        b.tick();
      }, a);
    }
    stop() {
      if (this.id != null) {
        clearInterval(this.id);
        this.id = null;
      }
    }
    tick() {}
    static delay(a, b) {
      let c = new DelayedCall(b);
      c.tick = function () {
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
    static getClass(a) {
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
      a = StdString.tagName(a);
      if (a != null) {
        return StdString.getGlobal(a);
      } else {
        return null;
      }
    }
    // serialize - recursive value-to-string. `b` is the current indent
    // depth (length used as a recursion guard; bails at depth 5 with
    // "<...>"). Powers Haxe's Std.string + the toString shim wired up
    // in helpers.js.
    static serialize(a, b) {
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
                e.push(StdString.serialize(a[g], b));
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
              c += (d > 0 ? "," : "") + StdString.serialize(a[d], b);
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
              c += b + f + " : " + StdString.serialize(a[f], b);
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
    static extendsOrImplements(a, b) {
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
            if (f == b || StdString.extendsOrImplements(f, b)) {
              return true;
            }
          }
        }
        a = a.s;
      }
    }
    // isType - Haxe's Std.is / Std.isOfType. `b` is one of the
    // sentinel ctor refs (Array, vBoolean, vNumber, vO2/3/4/5,
    // String) or an arbitrary class. Handles interface implements
    // (`Ib`), prototype chains, and the abstract-friendly `nn`
    // lookup.
    static isType(a, b) {
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
              if (StdString.isInstance(a, b)) {
                return true;
              }
            } else if (typeof b == "object" && StdString.isClass(b) && a instanceof b) {
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
    static isInstance(a, b) {
      if (a instanceof b) {
        return true;
      } else if (b.Je) {
        return StdString.extendsOrImplements(StdString.getClass(a), b);
      } else {
        return false;
      }
    }
    static tagName(a) {
      a = StdString.objectToString.call(a).slice(8, -1);
      if (a == "Object" || a == "Function" || a == "Math" || a == "JSON") {
        return null;
      } else {
        return a;
      }
    }
    static isClass(a) {
      return StdString.tagName(a) != null;
    }
    static getGlobal(a) {
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
    // toStr - format a number as a string (delegates to StdString.on).
    static toStr(a) {
      return StdString.serialize(a, "");
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
    // isWhitespace - char at index `b` of `a` is whitespace
    // (chars 9..13 or space). Mirrors Haxe's StringTools.isSpace.
    static isWhitespace(a, b) {
      a = Std.charCode(a, b);
      if (a > 8 && a < 14) {
        return true;
      } else {
        return a == 32;
      }
    }
    // padNumber4 - left-pad `a` with zeros to length 4. Returns
    // "null0" for null input (matches Haxe behaviour).
    static padNumber4(a) {
      var b;
      let c = "";
      for (b = 4 - a.length; c.length < b;) {
        c += "0";
      }
      return c + (a == null ? "null" : "" + a);
    }
    // toHex - lowercase-free uppercase hex string, min 2 chars.
    static toHex(a) {
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
        this.major = Numeric.parseInt(b.matched(1));
        this.minor = Numeric.parseInt(b.matched(2));
        this.patch = Numeric.parseInt(b.matched(3));
        this.prerelease = b.matched(4);
        this.build = b.matched(5);
      } else {
        throw 23;
      }
    }
    toString() {
      let a = this.major + "." + this.minor + "." + this.patch;
      if (this.prerelease != null) {
        a += "-" + this.prerelease;
      }
      if (this.build != null) {
        a += "+" + this.build;
      }
      return a;
    }
  }
  SemVer.i = true;
  Object.assign(SemVer.prototype, {
    l: SemVer
  });

  class Comparator {
    // compareLower - case-insensitive lexical comparator returning
    // -1/0/1, suitable for Array.prototype.sort.
    static compareLower(a, b) {
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
    // sameSign - true if a and b have the same sign (both >= 0 or
    // both < 0).
    static sameSign(a, b) {
      return a < 0 == b < 0;
    }
    // clamp - constrain a into [b, c]. (Note: the original arg order
    // is value, min, max despite the cryptic name.)
    static clamp(a, b, c) {
      return Math.max(Math.min(a, c), b);
    }
    // randInt - uniformly random integer in [a..b] inclusive.
    static randInt(a, b) {
      return Math.floor(Math.random() * (b - a + 1) + a);
    }
    static randBool() {
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
      this.startPos = a;
      this.currentPos = b;
      this.time = c;
    }
  }
  Triple3.i = true;
  Object.assign(Triple3.prototype, {
    l: Triple3
  });

  // RandomGen - base RNG. Subclasses override `next()` with their PRNG
  // of choice (MathRandom uses Math.random). Higher-level helpers are
  // shared on the base.
  class RandomGen {
    constructor(seed) {
      this.setSeed(seed);
    }
    setSeed(seed) {
      this.seed = seed;
    }
    // bool - coin flip (50/50).
    bool() {
      return this.next() < 0.5;
    }
    // randInt - integer in [a..b] inclusive.
    randInt(a, b) {
      a -= 0.4999;
      return Math.round(a + (b + 0.4999 - a) * this.next());
    }
    // randRange - float in [a, b).
    randRange(a, b) {
      return a + (b - a) * this.next();
    }
    // randSigned - float in [-a, a).
    randSigned(a) {
      return this.randRange(-a, a);
    }
    // randCentered - sum of two independent samples in [-1, 1]
    // (triangular distribution centred on 0, used for jitter).
    randCentered() {
      return this.next() - this.next();
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
    next() {
      return Math.random();
    }
  }
  MathRandom.i = true;
  MathRandom.s = RandomGen;
  Object.assign(MathRandom.prototype, {
    l: MathRandom
  });
