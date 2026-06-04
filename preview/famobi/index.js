var v2 = typeof Object.defineProperties == "function" ? Object.defineProperty : function (p2, p3, p4) {
  if (p2 == Array.prototype || p2 == Object.prototype) {
    return p2;
  }
  p2[p3] = p4.value;
  return p2;
};
function f2(p5) {
  p5 = [typeof globalThis == "object" && globalThis, p5, typeof window == "object" && window, typeof self == "object" && self, typeof global == "object" && global];
  for (var vLN0 = 0; vLN0 < p5.length; ++vLN0) {
    var v3 = p5[vLN0];
    if (v3 && v3.Math == Math) {
      return v3;
    }
  }
  throw Error("Cannot find global object");
}
var vF2 = f2(this);
function f3(p6, p7) {
  if (p7) {
    a: {
      var vVF2 = vF2;
      p6 = p6.split(".");
      for (var vLN02 = 0; vLN02 < p6.length - 1; vLN02++) {
        var v4 = p6[vLN02];
        if (!(v4 in vVF2)) {
          break a;
        }
        vVF2 = vVF2[v4];
      }
      p6 = p6[p6.length - 1];
      vLN02 = vVF2[p6];
      p7 = p7(vLN02);
      if (p7 != vLN02 && p7 != null) {
        v2(vVF2, p6, {
          configurable: true,
          writable: true,
          value: p7
        });
      }
    }
  }
}
f3("Array.prototype.includes", function (p8) {
  if (p8) {
    return p8;
  } else {
    return function (p9, p10) {
      var vThis = this;
      if (vThis instanceof String) {
        vThis = String(vThis);
      }
      var v5 = vThis.length;
      p10 = p10 || 0;
      for (p10 < 0 && (p10 = Math.max(p10 + v5, 0)); p10 < v5; p10++) {
        var v6 = vThis[p10];
        if (v6 === p9 || Object.is(v6, p9)) {
          return true;
        }
      }
      return false;
    };
  }
});
function f4(p11, p12) {
  if (p11 instanceof String) {
    p11 += "";
  }
  var vLN03 = 0;
  var v7 = false;
  var vO = {
    next: function () {
      if (!v7 && vLN03 < p11.length) {
        var v8 = vLN03++;
        return {
          value: p12(v8, p11[v8]),
          done: false
        };
      }
      v7 = true;
      return {
        done: true,
        value: undefined
      };
    }
  };
  vO[Symbol.iterator] = function () {
    return vO;
  };
  return vO;
}
f3("Array.prototype.values", function (p13) {
  if (p13) {
    return p13;
  } else {
    return function () {
      return f4(this, function (p14, p15) {
        return p15;
      });
    };
  }
});
(function (globalScope, host) {
  // --------------------------------------------------------------------
  // helpers.js — small free-standing functions shared across the engine.
  //
  // These are the f5..f10 + P() functions Haxe emits at the top of the
  // generated IIFE. They've been renamed to something pronounceable;
  // call sites were updated in bulk.
  // --------------------------------------------------------------------

  // numToString — Haxe's "use my toString()" trampoline; bound onto
  // Number.prototype so `(123).toString()` reaches Haxe's StdString.on().
  function numToString() {
    return StdString.on(this, "");
  }

  // currentLevelId — short string id of the active level, used as the
  // analytics event payload (e.g. "level42" for box 2 / level 17).
  function currentLevelId() {
    return "level" + ((LevelState.box - 1) * 25 + LevelState.level);
  }

  // buildKeyboardCodeTable — populates the global `KEYBOARD_CODES` KeyTable that
  // maps `KeyboardEvent.code` strings ("Space", "KeyA", "ArrowUp", ...)
  // to the Haxe-internal numeric keycodes used by KeyboardInputDevice.
  // Called once during boot.
  function buildKeyboardCodeTable() {
    function set(code, value) { KEYBOARD_CODES.J[code] = value; }
    KEYBOARD_CODES = new KeyTable();
    set("Space", 32);
    set("Space", 32);
    set("Quote", 39);
    set("Comma", 44);
    set("Minus", 45);
    set("Period", 46);
    set("Slash", 47);
    for (var i = 0; i < 10; i++) set("Digit" + String.fromCodePoint(48 + i), 48 + i);
    set("Semicolon", 59);
    set("Equal", 61);
    set("BracketLeft", 91);
    set("Backslash", 92);
    set("BracketRight", 93);
    set("Backquote", 96);
    for (i = 0; i < 26; i++) set("Key" + String.fromCodePoint(65 + i), 97 + i);
    for (i = 0; i < 12; i++) set("F" + (i + 1), 121 + i);
    set("ArrowUp", 133);
    set("ArrowLeft", 134);
    set("ArrowRight", 135);
    set("ArrowDown", 136);
    for (i = 0; i < 10; i++) set("EKeyNumpad" + i, 137 + i);
    set("NumpadAdd", 147);
    set("NumpadDecimal", 148);
    set("NumpadMultiply", 149);
    set("NumpadSubtract", 150);
    set("NumpadEqual", 151);
    set("NumpadComma", 152);
    set("NumpadEnter", 153);
    set("NumpadDivide", 154);
    set("NumLock", 155);
    set("Escape", 156);
    set("Backspace", 157);
    set("Tab", 158);
    set("Enter", 159);
    set("ControlLeft", 160);
    set("ControlRight", 161);
    set("ShiftLeft", 162);
    set("ShiftRight", 163);
    set("AltLeft", 164);
    set("AltRight", 165);
    set("PageUp", 166);
    set("PageDown", 167);
    set("Insert", 168);
    set("Delete", 169);
    set("Home", 170);
    set("End", 171);
    set("CapsLock", 172);
    set("Pause", 173);
    set("ScrollLock", 174);
    set("PrintScreen", 175);
  }

  // absLessThan — |a| < b, branchless-ish. Used in float equality checks.
  function absLessThan(a, b) {
    if (a > 0) return a < b;
    return -a < b;
  }

  // remap — linearly remap `a` from the range [b..c] into [d..e].
  function remap(a, b, c, d, e) {
    return d + (a - b) / (c - b) * (e - d);
  }

  // getIterator — coerce a value (Array or anything with .iterator()) to
  // an iterator. Haxe's generic `for-in` calls this.
  function getIterator(a) {
    if (a instanceof Array) return new ArrayIter(a);
    return a.iterator();
  }

  // cachedBind — memoised `fn.bind(obj)` so repeat callbacks share the
  // same bound function (otherwise Haxe-style `P(this, this.foo)` calls
  // inside every frame would allocate a fresh closure each time and
  // break listener removal). The cache key is a per-method id stamped
  // onto the function object the first time we see it.
  function cachedBind(obj, fn) {
    if (fn == null) return null;
    if (fn.jf == null) fn.jf = host.zt++;
    var cached;
    if (obj.Hv == null) obj.Hv = {};
    else cached = obj.Hv[fn.jf];
    if (cached == null) {
      cached = fn.bind(obj);
      obj.Hv[fn.jf] = cached;
    }
    return cached;
  }

  // Public namespace + Haxe-internal slot bookkeeping.
  globalScope.Ctrr = globalScope.Ctrr || {};
  var v9 = v9 || {};
  var v10;
  // EReg - Haxe's `EReg` regular-expression wrapper.
  //
  // Haxe normalises regex flags (it does not grok the JS-only `u` flag) and
  // stores the last match result on the underlying RegExp object as `bk`
  // (matched array) + `ID` (the input string). Methods:
  //
  //   match(s)  → boolean, also stashes result for Zc/HP
  //   Zc(i)     → captured group i  (throws 0 if no match)
  //   HP()      → "matchedRight": substring AFTER the match
  //                                (throws 1 if no match)
  //
  // Originally minified as `C2` (and `ma` in ctrrold.js).
  class EReg {
    constructor(a, b) {
      this.r = new RegExp(a, b.split("u").join(""));
    }
    match(a) {
      if (this.r.global) {
        this.r.lastIndex = 0;
      }
      this.r.bk = this.r.exec(a);
      this.r.ID = a;
      return this.r.bk != null;
    }
    Zc(a) {
      if (this.r.bk != null && a >= 0 && a < this.r.bk.length) {
        return this.r.bk[a];
      }
      throw 0;
    }
    HP() {
      if (this.r.bk == null) {
        throw 1;
      }
      let a = this.r.bk.index + this.r.bk[0].length;
      return Std.substr(this.r.ID, a, this.r.ID.length - a);
    }
  }
  EReg.i = true;
  Object.assign(EReg.prototype, {
    l: EReg
  });
  // SDK - Famobi CTRC portal bridge.
  //
  // Every call into the host portal goes through here. The portal exposes
  // `window.CTRC` (insets / ads / volume / feature flags / lifecycle) and
  // `window.CTRC_analytics.trackEvent(name, params)`. With the public
  // game files alone these globals do not exist - they come from the portal
  // bundle. See `../../../sdk.js` for the in-tree placeholder
  // that lets the game launch standalone.
  //
  // Originally minified as `M`. Static methods are still in their cryptic
  // two-letter form (`RN`, `ns`, `Ge`, ...); future passes should rename them.
  // Likely mapping:
  //
  //    RN  → getInsets             ns  → onRequest
  //    jQ  → onInsetsChange        cf  → showInterstitialAd
  //    kQ  → setPauseRequestHandler tr  → hasRewardedAd
  //    nQ  → setResumeRequestHandler sE → showRewardedAd
  //    DN  → getVolume             eS  → setPreloadProgress
  //    sN  → gameReady             Ge  → trackEvent (internal)
  //    it  → trackLevelStart       Nx  → trackLevelRestart
  //    ZS  → trackLevelSuccess     YE  → trackLevelFail
  //    XE  → trackLevelEnd         $S  → trackLiveScore
  //    aT  → trackPause            bT  → trackResume
  //    jt  → trackVolumeChange     sC  → trackDesignEvent
  //
  // Static state:
  //    Ol  - true while an ad is being shown (used by the game to gate
  //          input and pause the loop)
  //    gM  - "force unmuted" override; if true, getVolume returns 1
  //          regardless of what the portal says
  //    WB  - last value sent to setPreloadProgress, so we do not spam
  //          identical updates
  // SDK - was the Famobi CTRC portal bridge. Ads and analytics are
  // stripped: showInterstitialAd / showRewardedAd / hasRewardedAd /
  // adShowing are stubs (no-ops, "no ad available"), and every
  // track* method is a no-op that immediately invokes its callback.
  // Powerups are infinite (see statics.js + buttons.js), so the
  // "needs ad" branches that called these are unreachable anyway.
  //
  // The remaining methods (getInsets, onInsetsChange, set*Handler,
  // onRequest, getVolume, setPreloadProgress, gameReady, hasFeature)
  // still forward to window.CTRC; the in-tree stub at ctrc-sdk-stub.js
  // satisfies them.
  class SDK {
    static getInsets() {
      let a = window.CTRC.getOffsets();
      return new Insets(ObjectAccess.vf(a, "left"), ObjectAccess.vf(a, "right"), ObjectAccess.vf(a, "top"), ObjectAccess.vf(a, "bottom"));
    }
    static onInsetsChange(a) {
      window.CTRC.onOffsetChange(a);
    }
    static setPauseRequestHandler(a) {
      window.CTRC_onPauseRequested = a;
    }
    static setResumeRequestHandler(a) {
      window.CTRC_onResumeRequested = a;
    }
    static onRequest(a, b) {
      window.CTRC.onRequest(a, b);
    }
    static showInterstitialAd(a, b) {
      b();
    }
    static hasRewardedAd() {
      return false;
    }
    static showRewardedAd(a) {
      a(false);
    }
    static getVolume() {
      let a = window.CTRC.getVolume();
      if (SDK.forceUnmuted) {
        a = 1;
      }
      return a;
    }
    static setPreloadProgress(a) {
      if (SDK.lastPreloadProgress != a) {
        SDK.lastPreloadProgress = a;
        try {
          window.CTRC.setPreloadProgress(a);
        } catch (b) {}
      }
    }
    static gameReady() {
      try {
        window.CTRC.gameReady();
      } catch (a) {}
    }
    static hasFeature(a) {
      try {
        return window.CTRC.hasFeature(a);
      } catch (b) {
        return false;
      }
    }
    static trackLevelStart(a, b)         { b(); }
    static trackLevelRestart(a, b)       { b(); }
    static trackLevelSuccess(a, b, c, d) { d(); }
    static trackLevelFail(a, b, c)       { c(); }
    static trackLevelEnd(a, b, c, d)     { c(); }
    static trackLiveScore(a)             {}
    static trackPause(a)                 { a(); }
    static trackResume(a)                { a(); }
    static trackVolumeChange(a, b)       {}
    static trackDesignEvent(a)           {}
    static trackEvent(a, b)              { return Promise.resolve(null); }
  }
  SDK.i = true;
  class Keys {
    static VC(a) {
      return StringUtil.AP(a == null ? "null" : "" + a);
    }
    static jj(a, b) {
      return a + Keys.VC(b);
    }
    static Pa(a, b, c, d) {
      return InternKey.create((a == null ? "" : a + ",") + b + "-" + c + "@" + d);
    }
  }
  Keys.i = true;
  class Resources {
    static ov(a, b) {
      let c = LANGUAGES.slice();
      c.sort(Comparator.mM);
      c.splice(c.indexOf(a), 0, a);
      return c.indexOf(b);
    }
  }
  Resources.i = true;
  class ScriptLoader {
    constructor() {
      this.nC = this.kC = 0;
      this.$l = [];
      this.yd = new PriorityQueue();
      this.version = null;
      this.DC = this.lw = 0;
      this.Wo = 1;
    }
    load(a) {
      if (this.PB(a) || this.Rv(a) || this.Tj(a)) {
        return false;
      }
      this.lw++;
      a = new ScriptDownload(a, this);
      a.priority = this.nC--;
      if (this.$l.length == this.Wo) {
        this.yd.enqueue(a);
        return true;
      }
      this.$l.push(a);
      a.load();
      return true;
    }
    stop() {
      this.yd.clear();
    }
    $Q(a) {
      if (this.PB(a) && !this.Rv(a) && !this.Tj(a)) {
        var b = Lambda.find(this.yd, function (c) {
          return c.Nk.url.indexOf(a) > -1;
        });
        if (b != null) {
          this.yd.rR(b, ++this.kC);
        }
      }
    }
    jo(a) {
      if (this.lw == 0) {
        return 1;
      }
      if (a == null) {
        return this.DC / this.lw;
      }
      let b = this;
      return Lambda.count(a, function (c) {
        return b.Rv(c);
      }) / a.length;
    }
    PB(a) {
      function b(c) {
        return c.Nk.url.indexOf(a) > -1;
      }
      if (this.yd == null) {
        return false;
      } else {
        return Lambda.count(this.yd, b) + Lambda.count(this.$l, b) > 0;
      }
    }
    mQ(a) {
      Std.remove(this.$l, a);
      this.DC++;
      if (this.yd.ba == 0 && this.$l.length == 0) {
        this.nC = this.kC = 0;
      }
      let b = Loader.rg(a.Nk.url);
      if (b >= 0) {
        Loader.setData(b, a.Nk.data);
      }
      if (this.yd.ba > 0) {
        a = this.yd.KM();
        this.$l.push(a);
        a.load();
      }
    }
    lQ() {
      this.stop();
    }
    Rv(a) {
      return Loader.ob(Loader.rg(a));
    }
    Tj(a) {
      return Loader.Tj(Loader.rg(a));
    }
  }
  ScriptLoader.i = true;
  Object.assign(ScriptLoader.prototype, {
    l: ScriptLoader
  });
  class DataReader {
    constructor(a) {
      this.oq = [];
      this.data = null;
      var b = new Uint8Array(a);
      var c = b.byteLength;
      if (b[c - 1] == 69) {
        var d = b[c - 6] | b[c - 5] << 8 | b[c - 4] << 16;
        var e = a.slice(c - (d + 6), c - 6);
        if ((b[c - 3] & 1) > 0) {
          a = Bytes.hk(a.slice(0, a.byteLength - (d + 6)));
          b = MD5.encode(Base64.encode(a));
          a = [];
          for (c = 0; c < 32;) {
            a.push(Std.Eu(b, c++));
          }
          b = new Uint8Array(e);
          c = 0;
          for (d = e.byteLength; c < d;) {
            var f = c++;
            b[f] ^= a[f & 31];
          }
        }
        this.data = Bytes.hk(e);
        e = new BytesReader(this.data);
        a = e.ta();
        for (b = 0; b < a;) {
          ++b;
          d = e.ta();
          f = e.ta();
          c = null;
          let g = e.zd();
          if (g > 0) {
            c = e.hs(g, v141.Ut);
          }
          if (d == 0) {
            d = e.zd();
            f = new Bytes(new ArrayBuffer(d));
            e.zm(f, 0, d);
            this.oq.push(new NamedDataEntry(c, f, null));
          } else {
            this.oq.push(new NamedDataEntry(c, this.oq[f].data, f));
          }
        }
      }
    }
  }
  DataReader.i = true;
  Object.assign(DataReader.prototype, {
    l: DataReader
  });
  class Loader {
    static ib() {
      Loader.data = new HashMap();
      Loader.em = new HashMap();
      Loader.fA = [];
      Loader.us = 1;
      Loader.language = "en";
      Loader.wo = "png";
      Loader.el = null;
      Loader.Qw = new KeyTable();
      Loader.Pu = new HashMap();
      Loader.decoding = new HashMap();
      Loader.rq = null;
      Loader.hh = new HashMap();
      Loader.hh.J[0] = ["wav", "ogg", "aac"];
      Loader.hh.J[2] = ["png", "jpg"];
      Loader.hh.J[3] = ["txt", "json", "tmj", "tsj"];
      Loader.hh.J[1] = ["dat", "tps", "fnt", "zst"];
      Loader.hh.J[4] = ["mp4"];
    }
    static Ls(a) {
      Loader.us = a;
    }
    static qv() {
      return Loader.language;
    }
    static Wi(a) {
      var b;
      if (b == null) {
        b = false;
      }
      if (a == null) {
        a = "en";
      }
      a = a.toLowerCase();
      var c = Loader.hv();
      if (c.length > 0 && !Lambda.Ej(c, function (d) {
        return d == a;
      })) {
        a = "en";
      }
      if (b && a != Loader.language) {
        b = 0;
        c = Loader.Ce;
        while (b < c.length) {
          let d = c[b];
          ++b;
          if (new EReg("{language}", "").match(d)) {
            Loader.rg(d);
            Loader.ps(Loader.rg(d));
          }
        }
      }
      Loader.language = a;
      return Loader.language;
    }
    static RR() {
      // was: Loader.wo = "avif"; - switched to png everywhere
    }
    static HN(a) {
      var b = new RegExp("^(" + Loader.Rp + "/)", "");
      a = Loader.ni(a).replace(b, "");
      b = new EReg("-(\\d)x", "");
      if (b.match(a)) {
        return Numeric.parseInt(b.Zc(1));
      } else {
        return 1;
      }
    }
    static KN(a) {
      return Loader.KP[a];
    }
    static OA() {
      return Loader.el;
    }
    static JR(a) {
      Loader.el = a;
    }
    static getType(a) {
      let b = 0;
      while (b < 5) {
        let c = b++;
        if (new EReg("\\.(" + Loader.hh.J[c].join("|") + ")", "mi").match(a)) {
          return c;
        }
      }
      throw 21;
    }
    static ni(a) {
      let b = Loader.Ce[a];
      if (b == null) {
        return null;
      }
      let c = new EReg("{(?:language|image|audio|resolution)}", "");
      if (c.match(b)) {
        c = new EReg("{language}", "");
        if (c.match(b) && Loader.language != null) {
          b = b.replace(c.r, "-" + Loader.language);
        }
        c = new EReg("{image}", "g");
        if (c.match(b) && Loader.wo != null) {
          b = b.replace(c.r, Loader.wo);
        }
        c = new EReg("{audio}", "g");
        if (c.match(b) && Loader.el != null) {
          b = b.replace(c.r, Loader.el);
        }
        c = new EReg("{resolution}", "g");
        if (c.match(b) && Loader.us != null) {
          b = Loader.us == 1 ? b.replace(c.r, "") : b.replace(c.r, "-" + Math.min(Loader.KN(a), Loader.us) + "x");
        }
      }
      return "" + Loader.Rp + "/" + b;
    }
    static TN() {
      var a;
      if (a == null) {
        a = Loader.FN();
      }
      let b = [];
      let c = 0;
      while (c < a.length) {
        let d = Loader.ni(a[c++]);
        if (d != null) {
          b.push(d);
        }
      }
      return b;
    }
    static FN() {
      let a = [];
      let b = 0;
      let c = Loader.MAX;
      while (b < c) {
        a.push(b++);
      }
      return a;
    }
    static iterator() {
      return new AssetIdIter();
    }
    static fB() {
      let a = Loader.YQ;
      let b = [];
      let c = 0;
      while (c < a.length) {
        let d = a[c];
        ++c;
        if (Loader.LE(d)) {
          b.push(d);
        }
      }
      return b;
    }
    static GN() {
      let a = Loader.rO;
      let b = [];
      let c = 0;
      while (c < a.length) {
        let d = a[c];
        ++c;
        if (Loader.LE(d)) {
          b.push(d);
        }
      }
      return b;
    }
    static Hl(a, b, c) {
      if (c == null) {
        c = false;
      }
      let d = RegExp("\\.(\\w+)$", "");
      a = Loader.ni(a).replace(d, "." + b);
      if (c) {
        a = a.replace(RegExp("\\.p\\.", ""), ".");
      }
      return Loader.rg(a);
    }
    static rg(a) {
      function b(d, e) {
        a = a.replace(new RegExp(d, ""), e);
      }
      if (Object.prototype.hasOwnProperty.call(Loader.Qw.J, a)) {
        return Numeric.parseInt(Loader.Qw.J[a]);
      }
      b("^(" + Loader.Rp + "/)(.*)", "$2");
      var c = Loader.Ce.indexOf(a);
      if (c != -1) {
        return c;
      }
      c = Loader.hv();
      if (c.length > 0) {
        b("-(" + c.join("|") + ")", "{language}");
      }
      if (Loader.zQ.includes(a)) {
        b("(\\.\\w+)$", "{resolution}$1");
      } else {
        b("[\\/-][124]x", "{resolution}");
      }
      c = Loader.Ce.indexOf(a);
      if (c != -1) {
        return c;
      }
      if (new EReg("(" + Loader.hh.J[2].join("|") + ")", "g").match(a)) {
        c = Loader.wN();
        if (c.length > 0) {
          b("(.*?)\\.(" + c.join("|") + ")$", "$1.{image}");
          b("((" + c.join("|") + ")\\/)", "{image}/");
        }
      } else if (new EReg("(" + Loader.hh.J[0].join("|") + ")", "g").match(a)) {
        c = Loader.Xq();
        if (c.length > 0) {
          b("(.*?)\\.(" + c.join("|") + ")$", "$1.{audio}");
          b("((" + c.join("|") + ")\\/)", "{audio}/");
        }
      }
      return Loader.Ce.indexOf(a);
    }
    static yb(a) {
      a = Loader.data.J[a];
      if (typeof a == "string") {
        return a;
      }
      if (a instanceof ArrayBuffer) {
        if ("TextDecoder" in window) {
          a = new DataView(a);
          return new TextDecoder("utf-8").decode(a);
        }
        a = Bytes.hk(a);
        return a.yb(0, a.length);
      }
      return null;
    }
    static eo(a) {
      return Bytes.hk(Loader.data.J[a]);
    }
    static zN(a) {
      if (Loader.rq == null) {
        Loader.rq = new KeyTable();
        let b = 0;
        let c = Loader.bA;
        while (b < c.length) {
          let d = c[b++].split(":");
          Loader.rq.J[Loader.Rp + "/" + d[0]] = Numeric.parseInt(d[1]);
        }
      }
      return Loader.rq.J[a];
    }
    static LE(a) {
      if (Loader.Lv(a)) {
        if (Loader.el == null) {
          return false;
        } else {
          return Lambda.Ej(Loader.Xq(), function (b) {
            return b == Loader.el;
          });
        }
      } else {
        return true;
      }
    }
    static setData(a, b) {
      if (Loader.Pu.J.hasOwnProperty(a) && Loader.decoding.J[a] == 0) {
        Loader.decoding.J[a] = 1;
        Loader.Pu.J[a](a, b, function (c) {
          Loader.decoding.J[a] = 2;
          Loader.setData(a, c);
        });
      } else {
        Loader.data.J[a] = b;
        b = Loader.fA;
        let c = b.length;
        while (--c > -1) {
          if (b[c].id == a) {
            let d = b[c];
            b[c] = b[b.length - 1];
            b.pop();
            d.fire();
          }
        }
      }
    }
    static ob(a) {
      return Loader.data.J[a] != null;
    }
    static ps(a) {
      Loader.data.J[a] = null;
      Loader.data.remove(a);
      Loader.decoding.J[a] = 0;
    }
    static VR(a, b) {
      Loader.em.J[a] = b;
    }
    static LN(a) {
      return Loader.em.J[a];
    }
    static Lv(a) {
      if (a > 1000) {
        a = Loader.Qw.J[a == null ? "null" : "" + a];
        return new EReg("(ogg|aac|mp3|wav)$", "").match(a);
      } else {
        return new EReg("{audio}", "").match(Loader.Ce[a]);
      }
    }
    static ug(a) {
      return new EReg("music", "").match(Loader.Ce[a]);
    }
    static JO(a) {
      a = Loader.Ce[a];
      let b = new EReg("{image}", "g");
      if (b.match(a) && Loader.wo != null) {
        a = a.replace(b.r, Loader.wo);
      }
      return new EReg("\\.(" + Loader.hh.J[2].join("|") + ")$", "").match(a);
    }
    static Tj(a) {
      return Loader.decoding.J[a] == 1;
    }
    static aQ(a, b) {
      if (Loader.ni(a) != null) {
        if (Loader.ob(a)) {
          b(a);
        } else {
          Loader.fA.push(new AsyncCallback(a, b));
        }
      }
    }
    static Cz(a, b) {
      Loader.Pu.J[a] = b;
      Loader.decoding.J[a] = 0;
    }
    static Xq() {
      return ["ogg", "aac"].slice();
    }
    static wN() {
      return ["png", "jpg"].slice();
    }
    static hv() {
      return "ru nl ko ja it fr es en de br".split(" ").slice();
    }
  }
  Loader.i = true;

  class C91 {}
  C91.i = true;
  C91.Je = true;
  Object.assign(C91.prototype, {
    l: C91
  });
  class ScriptDownload {
    constructor(a, b) {
      this.Nk = new AssetXHR(a, b.version);
      this.yd = b;
    }
    load() {
      let a = this;
      this.Nk.load(function () {
        ScriptLoader.cA += Loader.zN(a.Nk.url);
        a.yd.mQ(a);
        a.free();
      }, function () {
        a.yd.lQ();
        a.free();
      });
    }
    free() {
      this.yd = null;
      this.Nk.free();
    }
  }
  ScriptDownload.i = true;
  ScriptDownload.Ib = [C91];
  Object.assign(ScriptDownload.prototype, {
    l: ScriptDownload
  });
  class NamedDataEntry {
    constructor(a, b, c) {
      this.name = a;
      this.data = b;
      this.ks = c;
    }
  }
  NamedDataEntry.i = true;
  Object.assign(NamedDataEntry.prototype, {
    l: NamedDataEntry
  });
  class AssetIdIter {
    constructor() {
      this.yB = 0;
    }
    fb() {
      return this.yB < Loader.MAX;
    }
    next() {
      return this.yB++;
    }
  }
  AssetIdIter.i = true;
  Object.assign(AssetIdIter.prototype, {
    l: AssetIdIter
  });
  class AssetXHR {
    constructor(a, b) {
      this.mm = this.Ae = null;
      this.progress = 0;
      this.data = null;
      this.url = a;
      this.version = b;
    }
    free() {
      this.Ae = this.mm = this.data = null;
    }
    load(a, b) {
      this.mm = a;
      this.Ae = b;
      let c;
      switch (Loader.getType(this.url)) {
        case 0:
          c = "arraybuffer";
          break;
        case 1:
          c = "arraybuffer";
          break;
        case 2:
          c = "blob";
          break;
        case 3:
          c = "text";
          break;
        case 4:
          c = "blob";
      }
      let d = this;
      this.zT(this.url, c, function (e) {
        d.Hi(e);
      });
    }
    zT(a, b, c) {
      let d = new XMLHttpRequest();
      let e = this;
      d.onerror = function () {
        if (e.Ae != null) {
          e.Ae();
        }
        d.onerror = d.onload = d.onprogress = null;
      };
      d.onload = function () {
        e.progress = 1;
        if (d.status == 404) {
          if (e.Ae != null) {
            e.Ae();
          }
        } else {
          var f = d.response;
          d.onerror = d.onload = d.onprogress = null;
          c(f);
        }
      };
      d.onprogress = function (f) {
        if (f.total > 0) {
          e.progress = f.loaded / f.total;
        }
      };
      try {
        d.open("GET", this.version != null ? "" + a + "?v=" + this.version : a, true);
        d.responseType = b;
        d.send();
      } catch (f) {}
    }
    Hi(a) {
      this.data = a;
      this.mm();
      this.mm = null;
    }
  }
  AssetXHR.i = true;
  Object.assign(AssetXHR.prototype, {
    l: AssetXHR
  });
  class LevelMath {
    static PA(a) {
      if (a <= 17) {
        return 1;
      } else {
        return 2;
      }
    }
    static rv(a) {
      switch (a) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 3:
          return 3;
        case 4:
          return 4;
        case 5:
          return 5;
        case 6:
          return 6;
        case 7:
          return 7;
        case 8:
          return 8;
        case 9:
          return 9;
        case 10:
          return 10;
        case 11:
          return 12;
        case 12:
          return 14;
        case 13:
          return 15;
        case 14:
          return 17;
        case 15:
          return 20;
        case 16:
          return 23;
        case 17:
          return 25;
        case 18:
          return 1;
        case 19:
          return 4;
        case 20:
          return 7;
        case 21:
          return 10;
        default:
          return -1;
      }
    }
    static br(a, b) {
      switch (a) {
        case 1:
          switch (b) {
            case 1:
              return 1;
            case 2:
              return 2;
            case 3:
              return 3;
            case 4:
              return 4;
            case 5:
              return 5;
            case 6:
              return 6;
            case 7:
              return 7;
            case 8:
              return 8;
            case 9:
              return 9;
            case 10:
              return 10;
            case 12:
              return 11;
            case 14:
              return 12;
            case 15:
              return 13;
            case 17:
              return 14;
            case 20:
              return 15;
            case 23:
              return 16;
            case 25:
              return 17;
            default:
              return -1;
          }
        case 2:
          switch (b) {
            case 1:
              return 18;
            case 4:
              return 19;
            case 7:
              return 20;
            case 10:
              return 21;
            default:
              return -1;
          }
        default:
          return -1;
      }
    }
  }
  LevelMath.i = true;
  class Strings {
    static get(a, b) {
      if (Strings.ud == null) {
        Strings.ud = JSON.parse(Loader.yb(Loader.strings));
      }
      var c = ObjectAccess.vf(Strings.ud, a);
      if (c == null || Save.language == null) {
        return a;
      }
      if (Object.prototype.hasOwnProperty.call(c, Save.language)) {
        a = ObjectAccess.vf(c, Save.language);
        if (b != null) {
          c = 0;
          let d = b.length;
          while (c < d) {
            a = a.replace(RegExp("::\\w+::", ""), b[c++]);
          }
        }
        return a;
      }
      return ObjectAccess.vf(c, "en");
    }
  }

  class BoxLevelData {
    static get() {
      let a = LevelState.box;
      let b = LevelState.level;
      // preview bridge: override any requested box/level with the
      // custom level data parked by customlevel.js
      if (window.customleveldata != null) {
        return window.customleveldata;
      }
      if (BoxLevelData.aw[a] == null) {
        let c = Loader.yb([195, 190, 185, 180, 175, 170, 165, 159, 154, 149, 144, 139, 134, 129, 124, 119, 114][a - 1]);
        BoxLevelData.aw[a] = JSON.parse(c);
      }
      return BoxLevelData.aw[a][b - 1];
    }
  }
  BoxLevelData.i = true;
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
  class SpriteSheet {
    constructor(a, b) {
      this.frames = a;
      this.em = b;
    }
  }
  SpriteSheet.i = true;
  Object.assign(SpriteSheet.prototype, {
    l: SpriteSheet
  });
  class SpriteSheetFrame {
    constructor(a, b, c, d, e) {
      this.filename = a;
      this.frame = b;
      this.wE = c;
      this.ec = d;
      this.Ip = e;
    }
  }
  SpriteSheetFrame.i = true;
  Object.assign(SpriteSheetFrame.prototype, {
    l: SpriteSheetFrame
  });
  class SheetMeta {
    constructor(a, b, c) {
      this.width = a;
      this.height = b;
      this.scale = c;
    }
  }
  SheetMeta.i = true;
  Object.assign(SheetMeta.prototype, {
    l: SheetMeta
  });
  class SheetParser {
    constructor() {}
    hR(a) {
      var b = JSON.parse(a);
      a = [];
      let c = 0;
      let d = b.frames;
      while (c < d.length) {
        let e = d[c];
        ++c;
        let f = e.frame;
        let g = e.spriteSourceSize;
        let h = e.sourceSize;
        a.push(new SpriteSheetFrame(e.filename, new TexRect(f.x, f.y, f.w, f.h), new TexRect(g.x, g.y, g.w, g.h), new Size(h.w, h.h), e.trimmed));
      }
      b = b.meta;
      return new SpriteSheet(a, new SheetMeta(b.size.w, b.size.h, parseFloat(b.scale)));
    }
    nD(a) {
      function b(h) {
        return new SpriteSheetFrame(h, new TexRect(c.kc(), c.kc(), c.kc(), c.kc()), new TexRect(c.kc(), c.kc(), c.kc(), c.kc()), new Size(c.kc(), c.kc()), c.ta() == 1);
      }
      let c = new BytesReader(a);
      c.ta();
      c.ta();
      c.ta();
      a = new SheetMeta(c.kc(), c.kc(), c.fR());
      let d = [];
      let e = c.kc();
      let f = 0;
      while (f < e) {
        var g = c.hs(c.kc());
        d.push(b(g));
        ++f;
      }
      e = c.kc();
      for (f = 0; f < e;) {
        g = c.kc();
        let h = c.hs(c.kc());
        let m = 0;
        while (m < g) {
          let n = "" + (m + 1);
          while (n.length < 4) {
            n = "0" + n;
          }
          d.push(b(h + n));
          ++m;
        }
        ++f;
      }
      return new SpriteSheet(d, a);
    }
  }
  SheetParser.i = true;
  Object.assign(SheetParser.prototype, {
    l: SheetParser
  });
  class SheetConvert {
    static Gl(a) {
      let b = 0;
      let c = [];
      let d = 0;
      for (a = a.frames; d < a.length;) {
        let e = a[d];
        ++d;
        c.push(new TextureFrame(b++, e.filename, e.ec, e.frame, e.Ip, new Size(e.wE.x, e.wE.y)));
      }
      return c;
    }
  }
  SheetConvert.i = true;
  class Application {
    constructor() {
      this.PS = null;
      this.LA = [];
      this.Jv = [];
      this.Jw = [];
      this.images = new HashMap();
      this.IC = null;
      this.rN = new FpsMeter();
      this.save = null;
      this.Fo = new ScriptLoader();
      this.fa = null;
      this.Sa = new NullAudioMixer();
      this.window = this.V = null;
      this.VS = new FixedTimestep();
      this.df = new MainLoop();
      Application.instance = this;
    }
    ib(a, b) {
      this.config = a;
      this.IC = b;
      host.console.info("%c" + a.title.toUpperCase() + " %c" + Build.FG, "font-weight:bold;", null);
      if (a.mB) {
        window.addEventListener("error", cachedBind(this, this.Ae));
        window.addEventListener("unhandledrejection", cachedBind(this, this.Ae));
      }
      this.Vj = this.SS();
      this.jd = window.navigator.userAgent.indexOf("Web0S") != -1;
      Loader.Ls(a.DB);
      a.language = Loader.Wi(a.language);
      this.df.Hg = cachedBind(this, this.DP);
      this.window = new Viewport(a.Cu);
      if (a.oo && this.window.yO(a.Hw)) {
        this.V = new WebGLRenderer();
      }
      if (this.V == null) {
        this.window.sO(a.Hw);
        this.V = new CanvasRenderer();
        a.oo = false;
      }
      if (this.V != null) {
        this.V.tp(this.window);
        this.window.addListener(2, cachedBind(this, this.dQ));
        this.window.addListener(1, cachedBind(this, this.QC));
        this.window.update();
        this.EB();
        this.Fo.version = Build.VERSION.toString();
        this.Fo.Wo = a.Wo;
        this.fa = new SceneDirector(this);
        this.vx();
        this.save = this.vv();
        var c = this;
        this.LS().then(function (d) {
          if (d) {
            Loader.RR();
          }
        }).then(function () {
          c.preload();
        });
      }
    }
    SB() {
      let a = window.navigator.userAgent.toLowerCase();
      return new EReg("(WebView|(iPhone|iPod|iPad)(?!.*Safari)|Android.*(;wv)|Linux; U; Android)", "ig").match(a);
    }
    preload() {
      function a(f, g, h) {
        let m = b.yM();
        m.name = Loader.ni(f);
        if (b.images.J.hasOwnProperty(f)) {
          b.Jw.push(b.images.J[f]);
        }
        b.images.J[f] = m;
        m.load(g, function () {
          if (Loader.GN().includes(f)) {
            let n = new FileReader();
            n.onload = function (q) {
              Loader.VR(f, new DataReader(q.target.result));
              h(m.data);
            };
            n.onerror = function () {
              throw 2;
            };
            n.readAsArrayBuffer(g);
          } else {
            h(m.data);
          }
        });
      }
      let b = this;
      for (var c = 0; c < Loader.MAX;) {
        var d = c++;
        if (Loader.JO(d)) {
          Loader.Cz(d, a);
        }
      }
      if (Loader.fB().length > 0) {
        this.load(Loader.fB(), null, cachedBind(this, this.MC));
      } else {
        this.MC();
      }
      if (this.config.FE) {
        let f = window.document.querySelectorAll("meta[data-hash]").item(0).dataset.hash;
        c = window.document.querySelectorAll("script[src]");
        d = null;
        let g = 0;
        let h = c.length;
        while (g < h && (d = c.item(g++), !new EReg(this.config.title, "i").match(d.src)));
        if (d != null) {
          var e = new XMLHttpRequest();
          e.open("GET", d.src);
          e.responseType = "arraybuffer";
          e.onreadystatechange = function () {
            if (e.readyState == 4 && e.status == 200) {
              try {
                window.crypto.subtle.digest("SHA-256", e.response).then(function (m) {
                  m = btoa(String.fromCharCode.apply(null, new Uint8Array(m)));
                  b.PS = m != f;
                }).catch(function () {});
              } catch (m) {}
            }
          };
          e.send();
        }
      }
    }
    MC() {
      let a = this;
      DelayedCall.delay(function () {
        a.df.start();
        a.IC(a);
      }, 1);
    }
    Xl(a) {
      a = Object.create(a.prototype);
      a.O = this;
      a.caller = a;
      return this.load(a.getPreloads(), null, undefined);
    }
    load(a, b, c) {
      let d = [];
      let e = [];
      let f = 0;
      let g = 0;
      while (g < a.length) {
        var h = a[g];
        ++g;
        if (!Loader.Lv(h) || Loader.Xq() != null && Loader.OA() != null) {
          f += 1;
          Loader.aQ(h, function (m) {
            --f;
            if (b != null) {
              b(m);
            }
            if (c != null && f == 0) {
              c();
            }
          });
          h = Loader.ni(h);
          if (this.Fo.load(h)) {
            e.push(h);
          }
        }
      }
      while (d.length > 0) {
        this.Fo.$Q(d.pop());
      }
      return new LoadProgress(this.Fo, e);
    }
    $A(a) {
      return this.images.J[a];
    }
    yM() {
      return new ImageLoader(this.config.CB, this.config.oo);
    }
    NM(a) {
      this.$A(a).Px();
      this.images.remove(a);
      Loader.ps(a);
    }
    OM() {
      let a = 0;
      let b = this.Jw;
      while (a < b.length) {
        b[a++].Px();
      }
      this.Jw = [];
    }
    createTexture(a, b, c) {
      function d(n) {
        if (n.b[0] == 84 && n.b[1] == 80 && n.b[2] == 83) {
          n = new SheetParser().nD(n);
          return new FrameCollection(SheetConvert.Gl(n), n.em.scale);
        }
        if (n.b[0] == 66 && n.b[1] == 77 && n.b[2] == 70) {
          n = new BMFontParser().zm(n);
          return new FrameCollection(BMFontConvert.Gl(n), 1, BMFontConvert.SA(n));
        }
        throw 3;
      }
      if (c == null) {
        c = false;
      }
      if (b == null) {
        b = 0;
      }
      var e = Loader.ni(a);
      for (var f = 0, g = this.V.$N(); f < g.length;) {
        var h = g[f];
        ++f;
        if (h.name == e) {
          return h;
        }
      }
      f = this.$A(a);
      g = Loader.LN(a);
      let m = null;
      if (g == null) {
        h = Loader.Hl(a, "dat");
        if (h != -1) {
          g = new DataReader(Loader.data.J[h]);
          if (g.data == null) {
            g = null;
          }
        } else {
          h = Loader.Hl(a, "dat", true);
          if (h != -1) {
            g = new DataReader(Loader.data.J[h]);
          }
        }
      }
      if (g == null) {
        h = Loader.Hl(a, "tps");
        if (h != -1) {
          try {
            m = d(Loader.eo(h));
          } catch (n) {}
        }
        if (m == null) {
          h = Loader.Hl(a, "json");
          if (h != -1) {
            h = Loader.yb(h);
            h = new SheetParser().hR(h);
            m = new FrameCollection(SheetConvert.Gl(h), h.em.scale);
          }
        }
        if (m == null) {
          h = Loader.Hl(a, "dat");
          if (h != -1) {
            h = Loader.eo(h);
            h = new SheetParser().nD(h);
            m = new FrameCollection(SheetConvert.Gl(h), h.em.scale);
          }
        }
        if (m == null) {
          h = Loader.Hl(a, "fnt");
          if (h != -1) {
            h = Loader.eo(h);
            h = new BMFontParser().zm(h);
            m = new FrameCollection(BMFontConvert.Gl(h), 1, BMFontConvert.SA(h));
          }
        }
      }
      h = null;
      if (g == null) {
        h = this.V.createTexture(f, b, m, e);
      } else {
        g = g.oq;
        if (g.length == 1 || Lambda.Ej(g, function (n) {
          return n.name != null;
        })) {
          h = this.V.createTexture(f, b, d(g[0].data), e);
          b = 1;
          e = g.length;
          while (b < e) {
            f = b++;
            this.V.rA(h, d(g[f].data), g[f].name);
          }
        } else {
          h = this.V.createTexture(f, b, null, e);
          b = 0;
          e = g.length;
          while (b < e) {
            this.V.rA(h, d(g[b++].data), null);
          }
        }
      }
      if (c) {
        h.$e = 1 / Loader.HN(a);
      }
      return h;
    }
    DP(a) {
      this.window.update();
      if (this.config.GA) {
        let b = this.VS;
        let c = cachedBind(this, this.update);
        b.elapsedTime += a;
        b.Th += a * b.Hx;
        if (b.Th > 0.25) {
          b.Th = 0.25;
        }
        while (b.Th >= FixedTimestep.Rk) {
          c(FixedTimestep.Rk);
          b.Th -= FixedTimestep.Rk;
        }
        this.render(b.Th / FixedTimestep.Rk);
      } else {
        this.update(a);
        this.render(1);
      }
      for (this.rN.update(a); this.LA.length > 0;) {
        this.LA.pop()();
      }
    }
    update(a) {
      let b = 0;
      let c = this.Jv;
      while (b < c.length) {
        let d = c[b];
        ++b;
        if (d != null) {
          d.state.update(a);
        }
      }
      this.V.Gi();
      this.V.Bm();
      this.$O();
      this.fa.update(a);
      this.V.fi();
    }
    render(a) {
      if (this.V.Gi()) {
        this.V.Bm();
        this.V.clear();
        this.fa.render(a);
        this.V.Bm();
        this.V.fi();
      }
    }
    $O() {
      if (this.config.aC) {
        var a = this.window;
        a = a.Hc.x / a.Hc.y;
        var b = this.window.Hc;
        var c = b.x;
        b = b.y;
        if (a > 2.5) {
          a = b / c * 2.5;
          c = (1 - a) / 2;
          this.V.Bk(c, 0, c + a, 1);
        } else if (a < 0.4) {
          a = c / b / 0.4;
          c = (1 - a) / 2;
          this.V.Bk(0, c, 1, c + a);
        }
      }
    }
    EB() {
      if (this.config.audio && Audio.MB()) {
        if (this.Sa != null && this.Sa instanceof WebAudioMixer) {
          var a = this.Sa.Yg;
          var b = this.Sa.names;
          this.Sa.free();
          Audio.ib();
          this.Sa = new WebAudioMixer();
          this.Sa.Yg = a;
          this.Sa.names = b;
        } else {
          a = this.config.Nz;
          var c = a ?? Audio.LM();
          if (Lambda.Ej(Loader.Xq(), function (f) {
            return f == c;
          })) {
            Loader.JR(c);
          }
          b = Loader.TN();
          a = [];
          for (var d = 0; d < b.length;) {
            let f = b[d];
            ++d;
            if (new EReg("audio", "").match(f)) {
              a.push(f);
            }
          }
          if (a.length != 0) {
            Audio.ib();
            if (Audio.MB()) {
              this.Sa = new WebAudioMixer();
            }
            var e = this;
            // Music tracks go through the normal `ls()` path (one file =
            // one buffer). The legacy SPR sprite branch is gone: SFX now
            // live as individual files under assets/audio/sfx/, loaded by
            // `loadSfxBundle()` after music registration completes.
            b = function (f, g, h) {
              e.Sa.ls(f, g, Loader.ug(f), h);
            };
            for (d = 0; d < a.length;) {
              Loader.Cz(Loader.rg(a[d++]), b);
            }
            this.loadSfxBundle();
          }
        }
      }
    }
    loadSfxBundle() {
      // SFX used to be packed into a single SPR-headered sound.ogg sprite
      // and sliced by the mixer's `ms()`. Now each SFX is a standalone
      // .ogg under assets/audio/sfx/, with a manifest.json giving the
      // (id, name) mapping so we can register each by its numeric id
      // (1001..1064) - those ids match the SoundFx.* constants in
      // statics.js, so callers like `SoundFx.play(SoundFx.button)` keep
      // working without changes.
      var mixer = this.Sa;
      if (mixer == null) return;
      fetch("assets/audio/sfx/manifest.json").then(function (Resources) { return Resources.json(); }).then(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          (function (entry) {
            fetch("assets/audio/sfx/" + entry.name + ".ogg")
              .then(function (Resources) { return Resources.arrayBuffer(); })
              .then(function (buf) {
                mixer.names[entry.id] = entry.name;
                mixer.ls(entry.id, buf, false, function () {});
              });
          })(entries[i]);
        }
      });
    }
    vv() {
      return new NullSave();
    }
    pv(a) {
      return this.Jv[a];
    }
    ju(a) {
      return this.Jv[a.nv()] = a;
    }
    fO() {
      let a = this.pv(1);
      return a ?? this.ju(new MouseInputDevice(this.window.canvas));
    }
    gO() {
      return this.fO().state;
    }
    eO() {
      let a = this.pv(0);
      return a ?? this.ju(new KeyboardInputDevice());
    }
    lh() {
      return this.eO().state;
    }
    Qj() {
      let a = this.pv(3);
      return a ?? this.ju(new TouchInputDevice(this.window.canvas));
    }
    hd() {
      return this.Qj().state;
    }
    AM(a) {
      return new LocalStorageStore(a);
    }
    vx() {
      // was a 10s bottom-left version badge. kept the no-op so the caller
      // chain stays the same.
    }
    QC() {
      this.Sa.Lg(1, 0);
    }
    dQ() {
      this.Sa.Lg(0, 0);
    }
    SS() {
      try {
        return navigator.userAgentData.mobile;
      } catch (a) {
        if (new EReg("Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini", "i").match(host.navigator.userAgent) || typeof window.orientation !== "undefined" || "onTouchstart" in window || navigator.maxTouchPoints > 0) {
          return true;
        } else {
          return window.matchMedia("(any-pointer:coarse)").matches;
        }
      }
    }
    reload() {
      window.location.reload();
    }
    LS() {
      if (this.config.Oz) {
        return new Promise(function (a) {
          let b = new Image();
          b.onerror = function () {
            b.onload = null;
            b.onerror = null;
            a(false);
          };
          b.onload = function () {
            b.onload = null;
            b.onerror = null;
            a(true);
          };
          b.src = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=";
        });
      } else {
        return Promise.resolve(false);
      }
    }
    IN() {
      return host.navigator.language;
    }
    Ae(a) {
      if (a.type != "unhandledrejection" && (a != null ? a.error : null) != null && a.error.stack != null) {
        Numeric.Ed(a.error.stack);
      }
      if (this.df != null) {
        this.df.stop();
      }
      host.console.log("" + this.config.title + " CRASHED 💀");
      window.removeEventListener("error", cachedBind(this, this.Ae));
      window.removeEventListener("unhandledrejection", cachedBind(this, this.Ae));
    }
  }
  Application.i = true;
  Object.assign(Application.prototype, {
    l: Application
  });
  class WebApplication extends Application {
    constructor(a) {
      super();
      this.ib(new AppConfig("Ctrr", true, a ?? "en", null, null, null, null, {
        alpha: false,
        depth: false,
        antialias: true,
        stencil: true
      }, false, null, true, null, null, null, null, false, null, null, null, null, false, null), cachedBind(this, this.Hg));
    }
    Ae(a) {
      super.Ae(a);
      if (this.jd) {
        this.reload();
      }
    }
    vv() {
      return new Save(this.AM(this.config.title));
    }
    preload() {
      super.preload();
      WebApplication.ds = !this.SB() && !this.jd;
      if (this.jd) {
        Loader.Ls(1);
      } else if (this.Vj && this.window.Pj() <= 2 && this.window.Hc.x < 1000) {
        Loader.Ls(1);
      } else {
        Loader.Ls(2);
      }
    }
    UN() {
      if (this.jd) {
        if (this.window.Hc.x > 5000) {
          return 4;
        } else if (this.window.Hc.x > 3000) {
          return 2;
        } else {
          return 1;
        }
      } else if (this.Vj && this.window.Pj() > 2) {
        return 2;
      } else {
        return 1;
      }
    }
    Hg() {
      window.document.body.addEventListener("touchcancel", function (b) {
        b.preventDefault();
      }, {
        passive: false
      });
      window.document.body.addEventListener("touchend", function (b) {
        b.preventDefault();
      }, {
        passive: false
      });
      window.document.body.addEventListener("touchstart", function (b) {
        b.preventDefault();
      }, {
        passive: false
      });
      this.V.MR(new Vec4(0, 0, 0, 1));
      FixedTimestep.Rk = 0.016;
      this.V.MM();
      this.window.aS(this.UN());
      this.Qj().XD(5);
      if (this.config.oo) {
        this.V.md(new GLTiledTextureProgram());
        this.V.md(new GLTextureProgram());
        this.V.md(new GLSolidColorProgram());
        this.V.md(new GLClearProgram());
        this.V.md(new GLMultiLineProgram());
        this.V.md(new GLGradientLineProgram());
        this.V.md(new GLDashedCircleProgram());
        this.V.md(new GLCircleStrokeProgram());
      } else {
        this.V.md(new RepeatPatternDraw());
        this.V.md(new CanvasTextRenderer());
        this.V.md(new CanvasSolidColorRenderer());
        this.V.md(new CanvasClearRenderer());
        this.V.md(new CanvasPathRenderer());
        this.V.md(new CanvasMultiLineRenderer());
        this.V.md(new CanvasGradientLineRenderer());
        this.V.md(new CanvasDashedCircleRenderer());
        this.V.md(new CanvasCircleStrokeRenderer());
      }
      WebApplication.menuMusicId = WebApplication.xmasMode ? Loader.menuMusicXmas : Loader.menuMusic;
      WebApplication.gameMusicId = WebApplication.xmasMode ? Loader.gameMusicXmas : Loader.gameMusic;
      let a = this;
      this.save.load(function () {
        if (Save.language == null && (Save.Yi(a.config.language), a.jd)) {
          let b = Std.substr(a.IN().toLowerCase(), 0, 2);
          if (new EReg("(" + LANGUAGES.join("|") + ")", "").match(b)) {
            Save.Yi(b);
          }
        }
        a.Wi(Save.language);
        a.tE();
      });
    }
    Wi(a) {
      Loader.Wi(a);
    }
    tE() {
      this.fa.Ha.sceneToLoad = MenuScene;
      Audio.addListener("EContextBroken", cachedBind(this, this.EB));
      this.Nu = -1;
      let a = this;
      Audio.addListener("EContextResumed", function () {
        if (!a.Sa.Dc(a.Nu)) {
          a.Sa.play(a.Nu, true, true);
        }
      });
      this.fa.hq(LoadingScene);
    }
  }
  WebApplication.i = true;
  WebApplication.s = Application;
  Object.assign(WebApplication.prototype, {
    l: WebApplication
  });
  class SDKApplication extends WebApplication {
    constructor(a) {
      super(a);
      WebApplication.externalPause = SDK.hasFeature("external_pause") == 0;
      WebApplication.externalMute = SDK.hasFeature("external_mute") == 0;
      WebApplication.xmasMode = SDK.hasFeature("xmas") == 1;
      WebApplication.magnetEnabled = SDK.hasFeature("rewarded");
      WebApplication.telekinesisEnabled = SDK.hasFeature("rewarded");
    }
    vv() {
      let a = new Save(new PortalLocalStorage(Application.instance.config.title));
      if (SDK.hasFeature("force_english")) {
        Save.Yi("en");
      }
      return a;
    }
    Hg(a) {
      this.hF();
      SDK.onInsetsChange(cachedBind(this, this.hF));
      let b = this;
      SDK.onRequest("enableAudio", function () {
        audioDisabled = false;
        b.Sa.Lg(1);
        try {
          let c = b.fa;
          let d = c.$n(CTRCIntroVideoScene, c);
          if (d != null) {
            d.jT();
          }
        } catch (c) {}
      });
      SDK.onRequest("disableAudio", function () {
        audioDisabled = true;
        b.Sa.Lg(0);
        try {
          let c = b.fa;
          let d = c.$n(CTRCIntroVideoScene, c);
          if (d != null) {
            d.TP();
          }
        } catch (c) {}
      });
      SDK.onRequest("pauseGameplay", function () {
        gameplayPaused = true;
        b.Qj().enabled = false;
        b.df.stop();
      });
      SDK.onRequest("resumeGameplay", function () {
        gameplayPaused = false;
        b.Qj().enabled = true;
        b.hd().reset();
        b.df.start();
      });
      SDK.setPauseRequestHandler(function () {
        SDK.adShowing = true;
        b.Sa.Lg(0);
        b.Qj().enabled = false;
        b.df.stop();
      });
      SDK.setResumeRequestHandler(function () {
        SDK.adShowing = false;
        if (!audioDisabled) {
          b.Sa.Lg(1);
        }
        if (!gameplayPaused) {
          b.Qj().enabled = true;
          b.hd().reset();
          b.df.start();
        }
      });
      super.Hg(a);
    }
    Wi(a) {
      if (SDK.hasFeature("force_english")) {
        Save.Yi("en");
        super.Wi("en");
      } else {
        super.Wi(a);
      }
    }
    tE() {
      // preview bridge: skip the main menu and load straight into the level
      // scene when a custom level is parked on window.customleveldata.
      this.fa.Ha.sceneToLoad = window.customleveldata != null ? CTRCLevelScene : CTRCMenuScene;
      this.fa.hq(CTRCLoadingScene);
    }
    QC() {
      if (!SDK.adShowing && !audioDisabled) {
        this.Sa.Lg(SDK.getVolume());
      }
    }
    vx() {
      if (SDK.hasFeature("version")) {
        super.vx();
      }
    }
    hF() {
      let a = SDK.getInsets();
      let b = this.window.canvas.style;
      b.top = "" + a.t + "px";
      b.left = "" + a.VB + "px";
      b.width = "calc(100% - " + (a.r + a.VB) + "px)";
      b.height = "calc(100% - " + (a.b + a.t) + "px)";
    }
  }
  SDKApplication.i = true;
  SDKApplication.s = WebApplication;
  Object.assign(SDKApplication.prototype, {
    l: SDKApplication
  });
  class Entry {
    static CP(a) {
      new SDKApplication(a);
    }
  }
  globalScope.Ctrr.main = Entry.CP;
  Entry.i = true;
  Math.i = true;
  class AppConfig {
    constructor(a, b, c, d, e, f, g, h, m, n, q, p, v, u, A, D, B, K, E, p18, p19, V) {
      this.mB = false;
      this.aC = true;
      this.Fx = false;
      this.GA = this.Oz = this.audio = this.nF = this.transition = this.CB = true;
      this.FE = false;
      this.Nz = this.Hw = null;
      this.Wo = 4;
      this.Cu = null;
      this.DB = 1;
      this.language = "en";
      this.title = a;
      this.oo = b;
      if (c != null) {
        this.language = c;
      }
      if (d != null) {
        this.DB = d;
      }
      if (e != null) {
        this.Cu = e;
      }
      if (f != null) {
        this.Wo = f;
      }
      if (g != null) {
        this.Nz = g;
      }
      if (h != null) {
        this.Hw = h;
      }
      if (m != null) {
        this.FE = m;
      }
      if (n != null) {
        this.GA = n;
      }
      if (q != null) {
        this.Oz = q;
      }
      if (p != null) {
        this.audio = p;
      }
      if (v != null) {
        this.nF = v;
      }
      if (u != null) {
        this.transition = u;
      }
      if (A != null) {
        this.CB = A;
      }
      if (E != null) {
        this.Fx = E;
      }
      if (p19 != null) {
        this.aC = p19;
      }
      if (V != null) {
        this.mB = V;
      }
    }
  }
  AppConfig.i = true;
  Object.assign(AppConfig.prototype, {
    l: AppConfig
  });
  class SaveBase {
    constructor(a) {
      this.storage = a;
      this.CR = this.RB = false;
      this.version = this.ho();
      this.reset();
    }
    load(a) {
      let b = this;
      this.storage.load(function (c) {
        let d = false;
        try {
          if (c != null) {
            b.parse(c);
            if (b.version > b.ho()) {
              throw 4;
            }
            for (c = false; b.version < b.ho();) {
              b.Zr(b.version + 1);
              b.version++;
              c = true;
            }
            if (c) {
              b.save(a);
              return;
            }
          } else {
            d = true;
          }
        } catch (e) {
          d = true;
        }
        if (d) {
          b.reset();
          b.save(a);
        } else {
          a();
        }
      });
    }
    save(a) {
      this.RB = true;
      let b = this;
      this.storage.save(this.stringify(), function (c) {
        b.RB = false;
        b.CR = c == 0;
        a();
      });
    }
  }
  SaveBase.i = true;
  Object.assign(SaveBase.prototype, {
    l: SaveBase
  });
  class Save extends SaveBase {
    constructor(a) {
      super(a);
      Save.instance = this;
      this.reset();
    }
    reset() {
      this.version = this.ho();
      Save.Ec = true;
      Save.Bd = true;
      Save.Yi(null);
      Save.me = WebApplication.xmasMode ? 3 : 0;
      Save.hint = 1;
      Save.Dl = false;
      Save.wg = [];
      Save.ig = [];
      Save.Df = [];
      Save.locked = [];
      Save.Ho = false;
      Save.Dp = false;
      Save.Mi = [];
      Save.kk = 0;
      let a = 1;
      while (a <= 17) {
        this.FB(a, a != 1 && a != 6 && a != 11);
        ++a;
      }
    }
    parse(a) {
      a = JSON.parse(a);
      this.version = a.v;
      Save.Ec = a.music;
      Save.Bd = a.sound;
      Save.Yi(a.language);
      Save.wg = a.levelStars;
      Save.Df = a.levelCleared;
      Save.locked = a.locked;
      if (this.version >= 2) {
        Save.hint = a.hint;
        Save.me = a.skin;
        Save.Dl = a.gameWon;
      }
      Save.me = WebApplication.xmasMode ? 3 : Save.me;
      if (this.version >= 3) {
        Save.ig = a.blueStars;
        Save.Ho = a.magnetUsed;
        Save.Dp = a.levelCleared;
        Save.Mi = a.pictures;
        Save.kk = a.picturesBadgeCounter;
      }
    }
    stringify() {
      let a = {
        v: this.version,
        music: Save.Ec,
        sound: Save.Bd,
        language: Save.language,
        levelStars: Save.wg,
        blueStars: Save.ig,
        levelCleared: Save.Df,
        locked: Save.locked,
        hint: Save.hint,
        skin: WebApplication.xmasMode ? 0 : Save.me,
        gameWon: Save.Dl,
        magnetUsed: Save.Ho,
        telekinesisUsed: Save.Dp,
        pictures: Save.Mi,
        picturesBadgeCounter: Save.kk
      };
      return JSON.stringify(a);
    }
    Zr(a) {
      switch (a) {
        case 2:
          Save.hint = 1;
          Save.me = 0;
          Save.Dl = false;
          for (a = 3; a <= 17;) {
            this.FB(a, a != 6 && a != 11);
            ++a;
          }
          break;
        case 3:
          for (a = 0; a < 17;) {
            Save.ig[a] = [];
            for (var b = 0; b < 25;) {
              Save.ig[a][b++] = 0;
            }
            ++a;
          }
          Save.Ho = false;
          Save.Dp = false;
          Save.Mi = [];
          Save.kk = 0;
          for (a = 1; a < 22;) {
            var c = a++;
            b = LevelMath.PA(c);
            c = LevelMath.rv(c);
            if (Save.Df[b - 1][c - 1]) {
              Save.Mi.push("" + b + "-" + c);
              Save.kk++;
            }
          }
      }
    }
    ho() {
      return 3;
    }
    FB(a, b) {
      if (b == null) {
        b = true;
      }
      --a;
      Save.locked[a] = b;
      Save.wg[a] = [];
      Save.Df[a] = [];
      let c = 0;
      while (c < 25) {
        let d = c++;
        Save.wg[a][d] = 0;
        Save.Df[a][d] = false;
      }
      if (!b) {
        Save.Df[a][0] = true;
      }
      Save.ig[a] = [];
      for (b = 0; b < 25;) {
        Save.ig[a][b++] = 0;
      }
    }
    static Yi(a) {
      if (!Lambda.Ej(Loader.hv(), function (b) {
        return b == a;
      })) {
        a = "en";
      }
      Save.language = a;
    }
    static flush() {
      if (Save.persistEnabled) {
        Save.instance.save(function () {});
      }
    }
  }
  Save.i = true;
  Save.s = SaveBase;
  Object.assign(Save.prototype, {
    l: Save
  });
  class C64 {}
  C64.i = true;
  C64.Je = true;
  Object.assign(C64.prototype, {
    l: C64
  });

  class LocalStorageStore {
    constructor(a) {
      this.key = a;
    }
    load(a) {
      try {
        let b = StorageProvider.tryGet().getItem(this.key);
        if (a != null) {
          a(b);
        }
        return b;
      } catch (b) {
        if (a != null) {
          a(null);
        }
        return null;
      }
    }
    save(a, b) {
      try {
        StorageProvider.tryGet().setItem(this.key, a);
        if (b != null) {
          b(true);
        }
      } catch (c) {
        if (b != null) {
          b(false);
        }
      }
    }
  }
  LocalStorageStore.i = true;
  LocalStorageStore.Ib = [C64];
  Object.assign(LocalStorageStore.prototype, {
    l: LocalStorageStore
  });

  class NullSave extends SaveBase {
    constructor() {
      super(null);
    }
    stringify() {
      return "";
    }
    parse() {}
    reset() {}
    ho() {
      return 1;
    }
    Zr() {}
  }
  NullSave.i = true;
  NullSave.s = SaveBase;
  Object.assign(NullSave.prototype, {
    l: NullSave
  });
  class PortalLocalStorage {
    constructor(a) {
      this.storage = null;
      this.key = a;
      this.storage = window.CTRC.localStorage;
    }
    load(a) {
      let b = this.storage.getItem(this.key);
      if (a != null) {
        a(b);
      }
      return b;
    }
    save(a, b) {
      this.storage.setItem(this.key, a);
      if (b != null) {
        b(true);
      }
    }
  }
  PortalLocalStorage.i = true;
  PortalLocalStorage.Ib = [C64];
  Object.assign(PortalLocalStorage.prototype, {
    l: PortalLocalStorage
  });
  class FpsMeter {
    constructor() {
      this.current = 60;
      let a = [];
      let b = 0;
      while (b < 60) {
        ++b;
        a.push(0);
      }
      this.values = a;
      this.time = this.mw = 0;
    }
    update(a) {
      this.time += a;
      if (this.time > 1) {
        this.current = Math.min(this.mw, 60);
        this.values[this.current - 1]++;
        this.mw = 0;
        --this.time;
      }
      this.mw++;
    }
  }
  FpsMeter.i = true;
  Object.assign(FpsMeter.prototype, {
    l: FpsMeter
  });
  class LoadProgress {
    constructor(a, b) {
      this.yd = a;
      this.Ce = b;
    }
    er() {
      if (this.Ce.length == 0) {
        return 100;
      }
      let a = Math.round(this.yd.jo(this.Ce) * 100);
      if (this.Tj()) {
        --a;
      }
      if (a < 0) {
        a = 0;
      }
      return a;
    }
    xv() {
      if (this.Ce.length != 0) {
        if (this.yd.jo() == 1) {
          return !this.Tj();
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
    Tj() {
      let a = 0;
      let b = this.Ce;
      while (a < b.length) {
        if (!Loader.ob(Loader.rg(b[a++]))) {
          return true;
        }
      }
      return false;
    }
  }
  LoadProgress.i = true;
  Object.assign(LoadProgress.prototype, {
    l: LoadProgress
  });
  class FixedTimestep {
    constructor() {
      this.Th = FixedTimestep.Rk;
      this.elapsedTime = 0;
      this.Hx = 1;
    }
  }
  FixedTimestep.i = true;
  Object.assign(FixedTimestep.prototype, {
    l: FixedTimestep
  });
  class MainLoop {
    constructor() {
      this.elapsedTime = 0;
      this.zs = false;
      this.handle = -1;
      this.now = 0;
      this.Zu = true;
      this.startTime = 0;
    }
    Hg() {}
    start() {
      if (!this.zs) {
        this.stop();
        this.zs = true;
        var a = null;
        v10 = window;
        var b = cachedBind(v10, v10.requestAnimationFrame);
        var c = this;
        a = function (d) {
          c.handle = b(a);
          if (c.Zu) {
            c.startTime = d;
            c.now = d;
            c.Zu = false;
          } else {
            let e = d - c.now;
            c.now = d;
            c.elapsedTime = (d - c.startTime) / 1000;
            c.Hg(e / 1000);
          }
        };
        this.handle = b(a);
      }
    }
    stop() {
      if (this.zs) {
        this.Zu = true;
        if (!(this.handle < 0)) {
          window.cancelAnimationFrame(this.handle);
          this.handle = -1;
          this.zs = false;
        }
      }
    }
  }
  MainLoop.i = true;
  Object.assign(MainLoop.prototype, {
    l: MainLoop
  });
  class Insets {
    constructor(a, b, c, d) {
      this.VB = a;
      this.r = b;
      this.t = c;
      this.b = d;
    }
  }
  Insets.i = true;
  Object.assign(Insets.prototype, {
    l: Insets
  });
  class C173 {
    constructor() {
      this.size = new Size(0, 0);
      this.V = null;
    }
    dE(a) {
      this.V = a;
    }
    LR(a, b) {
      let c = this.size;
      c.x = a;
      c.y = b;
    }
  }
  C173.i = true;
  Object.assign(C173.prototype, {
    l: C173
  });
  class C174 extends C173 {
    constructor() {
      super();
      this.Hc = new Size(0, 0);
      this.events = new EventEmitter();
      this.visible = true;
      this.Nw = this.Vq = false;
    }
    addListener(a, b) {
      return this.events.addListener(a, b);
    }
    lo() {
      let a = this.V.viewport;
      let b = this.Hc.x;
      let c = this.Hc.y;
      return new TexRect(a.x * b | 0, a.y * c | 0, a.w * b | 0, a.J * c | 0);
    }
    pi() {
      let a = this.V.viewport;
      return new Size(this.Hc.x * a.w | 0, this.Hc.y * a.J | 0);
    }
  }
  C174.i = true;
  C174.s = C173;
  Object.assign(C174.prototype, {
    l: C174
  });

  class Viewport extends C174 {
    constructor(a) {
      super();
      this.Cu = a;
      this.context = null;
      this.Vq = false;
      this.bP = [];
      this.uo = new EReg("(iPad|iPhone)", "g").match(host.navigator.platform);
      this.Rn = new Size(-1, -1);
      this.Mw = this.Ou = null;
      this.vS();
      this.bp = 1;
      this.rj();
      if (a != null) {
        this.canvas = window.document.getElementById(a);
        if (this.canvas == null) {
          this.canvas = window.document.createElement("canvas");
          this.canvas.id = a;
          window.document.body.appendChild(this.canvas);
        }
      } else {
        this.canvas = window.document.createElement("canvas");
        this.canvas.id = "gfx";
        this.canvas.style.position = "absolute";
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.canvas.style.touchAction = "none";
        this.canvas.style.userSelect = "none";
        this.canvas.style.outline = "none";
        this.canvas.style.setProperty("-webkit-user-select", "none");
        this.canvas.style.zIndex = "0";
        window.document.body.appendChild(this.canvas);
        this.canvas.tabIndex = 1;
        this.canvas.focus();
      }
    }
    Pj() {
      return window.devicePixelRatio;
    }
    vS() {
      if (this.Mw != null) {
        this.Mw.disconnect();
        this.Mw = null;
      }
      this.BS = false;
    }
    sO(a) {
      if (a == null) {
        a = {
          willReadFrequently: false
        };
      }
      this.context = this.canvas.getContext("2d", a);
      this.canvas.addEventListener("contextlost", function () {});
      this.canvas.addEventListener("contextrestored", function () {});
    }
    yO(a) {
      function b() {
        try {
          e.events.emit(6);
        } catch (f) {}
      }
      function c(f) {
        f.preventDefault();
      }
      function d(f) {
        console.log(f.statusMessage || "Unknown error");
      }
      let e = this;
      this.addDomListener(this.canvas, "webglcontextcreationerror", d);
      this.addDomListener(this.canvas, "webglcontextlost", c);
      this.addDomListener(this.canvas, "webglcontextrestored", b);
      try {
        if (a == null) {
          a = {
            stencil: true
          };
        }
        if ((this.context = this.canvas.getContext("webgl", a)) && this.context instanceof WebGLRenderingContext) {
          return true;
        }
      } catch (f) {
        this.context = null;
      }
      this.canvas.removeEventListener("webglcontextcreationerror", d);
      this.canvas.removeEventListener("webglcontextlost", c);
      this.canvas.removeEventListener("webglcontextrestored", b);
      return false;
    }
    bo() {
      let a = this.pi();
      return a.x / a.y;
    }
    getContext() {
      return this.context;
    }
    aS(a) {
      this.Rn = new Size(-1, -1);
      this.bp = a;
      this.update();
    }
    update() {
      this.Nw = false;
      var a = this.canvas.clientWidth;
      var b = this.canvas.clientHeight;
      if (a != 0 && b != 0 && (this.Ou != null && (a = this.Ou.x, b = this.Ou.y), this.Rn.x != a || this.Rn.y != b)) {
        var c = this.Rn;
        c.x = a;
        c.y = b;
        this.Hc.x = a * this.Pj() | 0;
        this.Hc.y = b * this.Pj() | 0;
        b = this.bp == 0 ? this.Pj() : this.bp;
        a = this.Hc.x / b | 0;
        b = this.Hc.y / b | 0;
        this.canvas.width = a;
        this.canvas.height = b;
        this.LR(a, b);
        this.Nw = true;
        this.events.emit(0);
      }
    }
    HO() {
      try {
        if (this.uo) {
          return false;
        } else {
          return document.fullscreenEnabled;
        }
      } catch (a) {
        return false;
      }
    }
    rj() {
      this.addDomListener(window, "contextmenu", function (b) {
        b.preventDefault();
      });
      window.oncontextmenu = function () {
        return false;
      };
      let a = this;
      this.addDomListener(window.document, "visibilitychange", function () {
        a.visible = window.document.visibilityState == "visible";
        a.events.emit(a.visible ? 1 : 2);
      });
      if (this.HO()) {
        this.addDomListener(window.document, "fullscreenchange", function () {
          a.Vq = document.Vq;
          a.events.emit(a.Vq ? 3 : 4);
        });
      }
      if (this.uo) {
        this.addDomListener(window, "orientationchange", function () {
          a.events.emit(5);
          setInterval(function () {
            window.scrollTo(0, 1);
          }, 1);
        });
      } else {
        try {
          window.screen.orientation.onchange = function () {
            a.events.emit(5);
            setTimeout(function () {
              let b = a.Rn;
              b.x = 0;
              b.y = 0;
            }, 1000);
          };
        } catch (b) {}
      }
    }
    addDomListener(a, b, c) {
      let d = {
        target: a,
        type: b,
        listener: c
      };
      this.bP.push(d);
      a.addEventListener(b, c);
    }
  }
  Viewport.i = true;
  Viewport.s = C174;
  Object.assign(Viewport.prototype, {
    l: Viewport
  });
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
  class C5 {}
  C5.i = true;
  C5.Je = true;
  class C180 {}
  C180.i = true;
  C180.Je = true;
  class MotionBase {
    constructor() {
      this.controllers = null;
      this.wM = true;
    }
    free() {
      let a = this.controllers;
      let b;
      while (a != null) {
        b = a.next;
        a.free();
        a = b;
      }
    }
    lq(a) {
      if (this.controllers != null) {
        a.next = this.controllers;
      }
      this.controllers = a;
      a.object = this;
    }
    detach(a) {
      if (this.controllers == a) {
        this.controllers = this.controllers.next;
      } else {
        let b = this.controllers;
        while (b.next != a) {
          b = b.next;
        }
        b.next = a.next;
      }
      a.next = null;
      a.object = null;
    }
    lN() {
      let a = this.controllers;
      while (a != null) {
        if (a.type == 303) {
          return a;
        }
        a = a.next;
      }
      return null;
    }
    tickAnims(a) {
      if (this.controllers == null || !this.wM) {
        return false;
      }
      let b = false;
      let c = this.controllers;
      let d;
      while (c != null) {
        d = c.next;
        if (c.update(a)) {
          b = true;
        }
        c = d;
      }
      return b;
    }
  }
  MotionBase.i = true;
  Object.assign(MotionBase.prototype, {
    l: MotionBase
  });
  class SceneNode extends MotionBase {
    constructor(a, b) {
      super();
      this.type = this.typeId();
      this.flags = b | 32 | SceneNode.IM;
      this.Y = this.parent = this.name = null;
      this.Db = new SceneTransform();
      this.Fa = new SceneTransform();
      this.Ne = 0;
      this.sa = this.Mu(a);
      this.key = UidGen.next();
      this.Qd = this.Xg = null;
      SceneNode.count++;
    }
    free() {
      if (!((this.flags & 16) > 0)) {
        super.free();
        if (this.parent != null) {
          this.parent.removeChild(this);
        }
        this.sa = this.Fa = this.Db = null;
        for (var a = this.Qd; a != null;) {
          a.state.Xr = null;
          a = a.next;
        }
        this.lR();
        this.flags = 16;
        SceneNode.count--;
      }
    }
    gB() {
      let a = this;
      while (a.parent != null) {
        a = a.parent;
      }
      return a;
    }
    Gd(a, b) {
      if (b == null) {
        b = true;
      }
      if (a == null) {
        a = true;
      }
      this.Rx(b);
      if (b) {
        this.pe();
        if (a) {
          this.iD();
        }
      }
    }
    Rx() {
      if (!((this.flags & 64) > 0)) {
        if ((this.flags & 512) > 0) {
          if (this.parent != null) {
            this.Fa.cE(this.parent.Fa, this.Db);
          } else {
            this.Fa.Tw(this.Db);
          }
        } else if (this.parent != null) {
          this.Fa.bE(this.parent.Fa, this.Db);
        } else {
          this.Fa.set(this.Db);
        }
      }
    }
    pe() {}
    iD() {
      if (this.parent != null) {
        this.parent.pe();
        this.parent.iD();
      }
    }
    Um(a) {
      var b = a == null;
      if (b) {
        a = RenderStateCollector.bR(this);
      } else {
        let c = this.Qd;
        while (c != null) {
          let d = a[c.state.type];
          let e = c.state;
          if (d.Ga == d.eb) {
            d.grow();
          }
          d.N[d.Ga++] = e;
          c = c.next;
        }
      }
      this.jD(a);
      if (b) {
        RenderStateCollector.kM();
      } else {
        for (b = this.Qd; b != null;) {
          --a[b.state.type].Ga;
          b = b.next;
        }
      }
      this.flags &= -33;
    }
    li(a) {
      let b = this.Qd;
      while (b != null) {
        if (b.state.type == a) {
          return b.state;
        }
        b = b.next;
      }
      return null;
    }
    Bh(a) {
      a.Xr = this;
      this.flags |= 32;
      if (this.Qd == null) {
        this.Qd = new StateNode(a);
      } else {
        for (var b = this.Qd; b != null;) {
          if (b.state.type == a.type) {
            b.state = a;
            return;
          }
          b = b.next;
        }
        b = new StateNode(a);
        b.next = this.Qd;
        this.Qd = b;
      }
    }
    qs(a) {
      let b = this.Qd;
      let c = null;
      while (b != null) {
        if (b.state.type == a) {
          if (c != null) {
            c.next = b.next;
          } else {
            this.Qd = b.next;
          }
          b.next = null;
          this.flags |= 32;
          break;
        }
        c = b;
        b = b.next;
      }
    }
    lR() {
      let a = this.Qd;
      let b;
      if (a != null) {
        this.flags |= 32;
      }
      while (a != null) {
        b = a.next;
        a.next = null;
        a = b;
      }
      this.Qd = null;
    }
    dR(a) {
      let b = this.Qd;
      while (b != null) {
        let c = a[b.state.type];
        let d = b.state;
        if (c.Ga == c.eb) {
          c.grow();
        }
        c.N[c.Ga++] = d;
        b = b.next;
      }
    }
    Mu(a) {
      if (a == null) {
        a = SceneNode.HM;
      }
      if (a == null) {
        throw 10;
      }
      switch (a) {
        case 202:
          return new PolygonShapeBounds();
        case 302:
          return new BoxBounds();
        default:
          throw 11;
      }
    }
    typeId() {
      return 101;
    }
  }
  SceneNode.i = true;
  SceneNode.Ib = [C180, C5];
  SceneNode.s = MotionBase;
  Object.assign(SceneNode.prototype, {
    l: SceneNode
  });
  class SceneGroup extends SceneNode {
    constructor(a, b) {
      super(b, 2);
      this.ea = this.Mu(b);
      this.Jk = Array(7);
      if (a != null) {
        a.P(this);
      }
      this.hr = 0;
      this.effect = this.Xo = null;
      SceneGroup.count++;
    }
    free() {
      if (!((this.flags & 16) > 0)) {
        if (this.effect != null) {
          this.effect.free();
        }
        this.effect = null;
        this.ea.free();
        this.Jk = this.ea = null;
        super.free();
        SceneGroup.count--;
      }
    }
    Rf(a) {
      this.effect = a;
      this.effect.Dh(this);
    }
    Sc() {}
    Ub(a, b) {
      if (!this.sa.contains(a)) {
        return false;
      }
      if (b != null) {
        b.add(this);
      }
      return true;
    }
    Fl(a, b) {
      return b;
    }
    pe() {
      if (!((this.flags & 128) > 0)) {
        this.ea.kt(this.Fa, this.sa);
        super.pe();
      }
    }
    jD(a) {
      let b = 0;
      let c = this.Jk;
      let d = 0;
      let e = 0;
      while (e < a.length) {
        var f = a[e];
        ++e;
        if (f.Ga == 0) {
          c[d] = null;
        } else {
          f = f.N[f.Ga - 1].collapse(f);
          c[d] = f;
          b |= 1 << f.type;
        }
        ++d;
      }
      this.hr = b;
    }
    typeId() {
      return 201;
    }
  }
  SceneGroup.i = true;
  SceneGroup.s = SceneNode;
  Object.assign(SceneGroup.prototype, {
    l: SceneGroup
  });
  class MeshNode extends SceneGroup {
    constructor(a, b, c, d) {
      super(c, d);
      this.size = new Vec4(1, 1, 0, 1);
      this.min = new Vec4(0, 0, 0, 1);
      this.max = new Vec4(1, 1, 0, 1);
      this.cols = a;
      this.rows = b;
      this.FP();
      this.Sc();
    }
    FP() {
      this.pw = (this.cols + 1) * (this.rows + 1);
      this.gj = new ArrayList(this.pw);
      for (var a = 0, b = this.pw; a < b;) {
        ++a;
        this.gj.pushBack(new Vec4(0, 0, 0, 1));
      }
      a = this.cols + 1;
      b = this.rows + 1;
      let c = 0;
      let d;
      while (c < b) {
        for (d = 0; d < a;) {
          var e = this.gj.N[c * a + d];
          e.x = this.min.x + d / (a - 1) * this.max.x;
          e.y = this.min.y + c / (b - 1) * this.max.y;
          ++d;
        }
        ++c;
      }
      this.YP = (this.cols * 2 + 2) * this.rows + (this.rows - 1) * 2;
      this.indices = new Uint8Array(this.YP);
      --b;
      for (c = e = 0; c < b;) {
        for (d = 0; d < a;) {
          this.indices[e++] = c * a + d;
          this.indices[e++] = c * a + a + d;
          ++d;
        }
        if (c < b - 1) {
          this.indices[e++] = (c + 1) * a + (a - 1);
          this.indices[e++] = (c + 1) * a;
        }
        ++c;
      }
    }
    Sc() {
      super.Sc();
    }
    typeId() {
      return 601;
    }
  }
  MeshNode.i = true;
  MeshNode.s = SceneGroup;
  Object.assign(MeshNode.prototype, {
    l: MeshNode
  });
  class BufferNode extends SceneGroup {
    constructor(a, b) {
      super(a, 402);
      this.gv = b;
      this.Sc();
      this.AB = this.jF = null;
    }
    free() {
      this.gv = null;
      var a = this.jF;
      if (a != null) {
        a.free();
      }
      a = this.AB;
      if (a != null) {
        a.free();
      }
      this.AB = this.jF = null;
      super.free();
    }
    Mu() {
      return new CircleBounds();
    }
    Ub() {
      return false;
    }
    Sc() {
      let a = this.gv.getData(0);
      this.ea.Pn(a);
    }
    typeId() {
      return 501;
    }
  }
  BufferNode.i = true;
  BufferNode.s = SceneGroup;
  Object.assign(BufferNode.prototype, {
    l: BufferNode
  });
  class SceneRoot extends SceneNode {
    constructor(a, b, c) {
      if (c == null) {
        c = 0;
      }
      super(b, c | 1);
      this.children = null;
      if (a != null) {
        a.P(this);
      }
      SceneRoot.count++;
    }
    free() {
      if (!((this.flags & 16) > 0)) {
        for (var a = this.children; a != null;) {
          let b = a.Y;
          if (a.Xg != null) {
            a.Xg.free();
          } else {
            a.free();
          }
          a = b;
        }
        super.free();
        SceneRoot.count--;
      }
    }
    Fl(a, b) {
      return NodeTreeUtil.Fl(this, a, b);
    }
    Ub(a, b) {
      let c = false;
      if (this.sa.contains(a)) {
        let d = this.children;
        while (d != null) {
          if (d.Ub(a, b)) {
            c = true;
          }
          d = d.Y;
        }
      }
      return c;
    }
    tickAnims(a) {
      let b = super.tickAnims(a);
      let c = this.children;
      let d;
      while (c != null) {
        d = c.Y;
        if (c.tickAnims(a)) {
          b = true;
        }
        c = d;
      }
      return b;
    }
    P(a) {
      if (this.children == null) {
        this.children = a;
        a.Y = null;
      } else {
        let b = this.children;
        while (b.Y != null) {
          b = b.Y;
        }
        b.Y = a;
      }
      a.parent = this;
    }
    Mj() {
      let a = 0;
      let b = this.children;
      while (b != null) {
        ++a;
        b = b.Y;
      }
      return a;
    }
    ML(a, b) {
      if (b == 0) {
        a.Y = this.children;
        this.children = a;
      } else {
        let c = this.children;
        let d = 0;
        for (--b; d < b;) {
          ++d;
          c = c.Y;
        }
        a.Y = c.Y;
        c.Y = a;
      }
      a.parent = this;
    }
    removeChild(a) {
      if (this.children == a) {
        this.children = a.Y;
      } else {
        let b = this.children;
        while (b.Y != a) {
          b = b.Y;
        }
        b.Y = a.Y;
      }
      a.Y = null;
      a.parent = null;
      return this;
    }
    nb(a) {
      let b = this.children;
      let c = 0;
      while (c <= a) {
        if (c == a) {
          return b;
        }
        b = b.Y;
        ++c;
      }
      return null;
    }
    Ww(a, b) {
      this.removeChild(a);
      this.ML(a, b);
    }
    fo(a) {
      let b = this.children;
      while (b != null) {
        if (b.name == a) {
          return b;
        }
        b = b.Y;
      }
      return null;
    }
    MS(a, b) {
      let c = null;
      let d = null;
      for (var e = 0, f = this.children; e < 2 && f != null;) {
        if (f.Y == a) {
          c = f;
          ++e;
        } else if (f.Y == b) {
          d = f;
          ++e;
        }
        f = f.Y;
      }
      e = a.Y;
      f = b.Y;
      a.Y = null;
      b.Y = null;
      if (e == b) {
        if (c != null) {
          c.Y = b;
        } else {
          this.children = b;
        }
        b.Y = a;
        a.Y = f;
      } else if (f == a) {
        if (d != null) {
          d.Y = a;
        } else {
          this.children = a;
        }
        a.Y = b;
        b.Y = e;
      } else {
        if (c != null) {
          c.Y = b;
        } else {
          this.children = b;
        }
        b.Y = e;
        if (d != null) {
          d.Y = a;
        } else {
          this.children = a;
        }
        a.Y = f;
      }
    }
    NS(a, b) {
      this.MS(this.nb(a), this.nb(b));
    }
    Yw(a) {
      if (this.children != a) {
        for (var b = this.children; b.Y != a;) {
          b = b.Y;
        }
        b.Y = a.Y;
        a.Y = this.children;
        this.children = a;
      }
    }
    bx(a) {
      if (a.Y != null) {
        var b = this.children;
        if (b == a) {
          while (b.Y != null) {
            b = b.Y;
          }
          b.Y = a;
          this.children = a.Y;
        } else {
          while (b.Y != a) {
            b = b.Y;
          }
          for (b = b.Y = a.Y; b.Y != null;) {
            b = b.Y;
          }
          b.Y = a;
        }
        a.Y = null;
      }
    }
    Rx(a) {
      super.Rx(a);
      let b = this.children;
      while (b != null) {
        b.Gd(false, a);
        b = b.Y;
      }
    }
    pe() {
      if (!((this.flags & 128) > 0) && this.children != null) {
        var a = this.children;
        this.sa.from(a.sa);
        for (a = a.Y; a != null;) {
          this.sa.lr(a.sa);
          a = a.Y;
        }
        super.pe();
      }
    }
    jD(a) {
      let b = this.children;
      while (b != null) {
        b.Um(a);
        b = b.Y;
      }
    }
    typeId() {
      return 301;
    }
  }
  SceneRoot.i = true;
  SceneRoot.s = SceneNode;
  Object.assign(SceneRoot.prototype, {
    l: SceneRoot
  });
  class SpriteNode extends SceneGroup {
    constructor(a) {
      super(a, 302);
      this.flags |= 512;
      this.size = new Vec4(1, 1, 0, 1);
      this.Sc();
    }
    Lb(a, b) {
      let c = this.size;
      c.x = a;
      c.y = b;
      this.Sc();
    }
    Ub(a, b) {
      if (!this.sa.contains(a)) {
        return false;
      }
      a = this.Fa.gg(a, new Vec4(0, 0, 0, 1));
      if (PointInRect.RS(a.x, a.y, this.size.x, this.size.y)) {
        if (b != null) {
          b.add(this);
        }
        return true;
      } else {
        return false;
      }
    }
    Fl(a, b) {
      let c = new Vec4(0, 0, 0, 1);
      let d = FLOAT_MAX;
      let e = FLOAT_MAX;
      let f = FLOAT_MIN;
      let g = FLOAT_MIN;
      let h = this.size.x;
      let m = this.size.y;
      if (a == this) {
        e = d = 0;
        f = h;
        g = m;
      } else {
        if (a == this.parent) {
          var n = this.Db;
          c.x = 0;
          c.y = 0;
          n.Jb(c, c);
          if (c.x < d) {
            d = c.x;
          }
          if (c.x > f) {
            f = c.x;
          }
          if (c.y < e) {
            e = c.y;
          }
          if (c.y > g) {
            g = c.y;
          }
          c.x = h;
          c.y = 0;
          n.Jb(c, c);
          if (c.x < d) {
            d = c.x;
          }
          if (c.x > f) {
            f = c.x;
          }
          if (c.y < e) {
            e = c.y;
          }
          if (c.y > g) {
            g = c.y;
          }
          c.x = h;
          c.y = m;
          n.Jb(c, c);
          if (c.x < d) {
            d = c.x;
          }
          if (c.x > f) {
            f = c.x;
          }
          if (c.y < e) {
            e = c.y;
          }
          if (c.y > g) {
            g = c.y;
          }
          c.x = 0;
          c.y = m;
          n.Jb(c, c);
        } else if (a.parent == null) {
          n = this.Fa;
          c.x = 0;
          c.y = 0;
          n.Jb(c, c);
          if (c.x < d) {
            d = c.x;
          }
          if (c.x > f) {
            f = c.x;
          }
          if (c.y < e) {
            e = c.y;
          }
          if (c.y > g) {
            g = c.y;
          }
          c.x = h;
          c.y = 0;
          n.Jb(c, c);
          if (c.x < d) {
            d = c.x;
          }
          if (c.x > f) {
            f = c.x;
          }
          if (c.y < e) {
            e = c.y;
          }
          if (c.y > g) {
            g = c.y;
          }
          c.x = h;
          c.y = m;
          n.Jb(c, c);
          if (c.x < d) {
            d = c.x;
          }
          if (c.x > f) {
            f = c.x;
          }
          if (c.y < e) {
            e = c.y;
          }
          if (c.y > g) {
            g = c.y;
          }
          c.x = 0;
          c.y = m;
          n.Jb(c, c);
        } else {
          n = this.Fa;
          a = a.Fa;
          c.x = 0;
          c.y = 0;
          n.Jb(c, c);
          a.gg(c, c);
          if (c.x < d) {
            d = c.x;
          }
          if (c.x > f) {
            f = c.x;
          }
          if (c.y < e) {
            e = c.y;
          }
          if (c.y > g) {
            g = c.y;
          }
          c.x = h;
          c.y = 0;
          n.Jb(c, c);
          a.gg(c, c);
          if (c.x < d) {
            d = c.x;
          }
          if (c.x > f) {
            f = c.x;
          }
          if (c.y < e) {
            e = c.y;
          }
          if (c.y > g) {
            g = c.y;
          }
          c.x = h;
          c.y = m;
          n.Jb(c, c);
          a.gg(c, c);
          if (c.x < d) {
            d = c.x;
          }
          if (c.x > f) {
            f = c.x;
          }
          if (c.y < e) {
            e = c.y;
          }
          if (c.y > g) {
            g = c.y;
          }
          c.x = 0;
          c.y = m;
          n.Jb(c, c);
          a.gg(c, c);
        }
        if (c.x < d) {
          d = c.x;
        }
        if (c.x > f) {
          f = c.x;
        }
        if (c.y < e) {
          e = c.y;
        }
        if (c.y > g) {
          g = c.y;
        }
      }
      if (b == null) {
        b = new Bounds(d, e, f, g);
      } else {
        b.A = d;
        b.D = e;
        b.B = f;
        b.G = g;
      }
      return b;
    }
    Sc() {
      super.Sc();
      var a = this.size.x / 2;
      let b = this.size.y / 2;
      this.ea.C.x = a;
      this.ea.C.y = b;
      this.ea.Z = Math.sqrt(a * a + b * b);
      if (this.ea.type == 302) {
        a = this.ea.gb;
        a.A = 0;
        a.D = 0;
        a.B = this.size.x;
        a.G = this.size.y;
      }
    }
    typeId() {
      return 401;
    }
  }
  SpriteNode.i = true;
  SpriteNode.s = SceneGroup;
  Object.assign(SpriteNode.prototype, {
    l: SpriteNode
  });
  class C295 {}
  C295.i = true;
  C295.Je = true;
  Object.assign(C295.prototype, {
    l: C295
  });

  class DisplayBase {
    constructor(a) {
      DisplayBase.count++;
      this.u = a;
      a.Xg = this;
      this.VL = this.typeId();
      this.flags = 6;
      this.eg = this.ed = this.dg = this.Ra = 1;
      this.qn = this.pn = this.Sg = this.Rg = this.Ug = this.Tg = this.cg = this.Zd = 0;
      this.Uc = 1;
      this.eu = true;
    }
    free() {
      this.u = null;
      DisplayBase.count--;
    }
    remove() {
      let a = this.u.parent;
      if (a != null) {
        a.removeChild(this.u);
      }
    }
    mh() {
      var a = this.u.parent;
      if (a != null && (a = a.Xg, a != null && a.VL == 204)) {
        return a;
      } else {
        return null;
      }
    }
    ox(a) {
      this.u.name = a;
    }
    W(a) {
      a = a < 0 ? 0 : a > 1 ? 1 : a;
      if (this.Uc != a) {
        this.Uc = a;
        let b = this.u;
        if (a < 1) {
          let c = b.li(5);
          if (c == null) {
            b.Bh(new AlphaState(this.Uc));
          } else {
            c.bf(a);
          }
        } else {
          b.qs(5);
        }
        b.flags |= 32;
      }
    }
    ri() {
      return this.eu;
    }
    L(a) {
      if (this.eu != a) {
        this.eu = a;
        this.u.Ne = a ? 0 : 1;
      }
    }
    setScaleX(a) {
      if (this.Ra != a) {
        this.dg = this.Ra = a;
        if (absLessThan(a, 0.001)) {
          this.dg = (a >= 0 ? 1 : -1) * 0.001;
        }
        if (a == 1 && this.ed == 1) {
          this.flags = this.flags & -3 | 4;
          a = this.u.Db;
          a.scale.x = 1;
          a.scale.y = 1;
          a.K |= 500;
        } else {
          this.flags &= -7;
        }
        this.oc();
      }
    }
    setScaleY(a) {
      if (this.ed != a) {
        this.eg = this.ed = a;
        if (absLessThan(a, 0.001)) {
          this.eg = (a >= 0 ? 1 : -1) * 0.001;
        }
        if (a == 1 && this.Ra == 1) {
          this.flags = this.flags & -3 | 4;
          a = this.u.Db;
          a.scale.x = 1;
          a.scale.y = 1;
          a.K |= 500;
        } else {
          this.flags &= -7;
        }
        this.oc();
      }
    }
    setUniformScale(a) {
      if (this.Ra != a || this.ed != a) {
        this.Ra = this.ed = a;
        if (absLessThan(a, 0.001)) {
          this.dg = this.eg = (a >= 0 ? 1 : -1) * 0.001;
        } else {
          this.dg = this.eg = a;
        }
        this.flags |= 2;
        if (a == 1) {
          a = this.u.Db;
          a.scale.x = 1;
          a.scale.y = 1;
          a.K |= 500;
          this.flags |= 4;
        } else {
          this.flags &= -5;
        }
        this.oc();
      }
    }
    setScale(a, b) {
      if (this.Ra != a || this.ed != b) {
        if (a == 1 && b == 1) {
          this.flags = this.flags & -3 | 4;
          let c = this.u.Db;
          c.scale.x = 1;
          c.scale.y = 1;
          c.K |= 500;
        } else {
          this.flags = a == b ? (this.flags &= -5) | 2 : this.flags & -7;
        }
        this.Ra = this.dg = a;
        this.ed = this.eg = b;
        if (absLessThan(a, 0.001)) {
          this.dg = (a >= 0 ? 1 : -1) * 0.001;
        }
        if (absLessThan(b, 0.001)) {
          this.eg = (b >= 0 ? 1 : -1) * 0.001;
        }
        this.oc();
      }
    }
    la(a) {
      if (this.Zd != a) {
        this.Zd = a;
        let b;
        b = a % 360;
        if (b < 0) {
          b += 360;
        }
        this.cg = b * DEG2RAD;
        if (a == 0) {
          this.flags &= -2;
          this.u.Db.RD();
        } else {
          this.flags |= 1;
        }
        this.oc();
      }
    }
    getX() {
      return this.Tg;
    }
    setX(a) {
      if (this.Tg != a) {
        this.Tg = a;
        this.oc();
      }
      return a;
    }
    getY() {
      return this.Ug;
    }
    setY(a) {
      if (this.Ug != a) {
        this.Ug = a;
        this.oc();
      }
    }
    uS(a) {
      if (this.Tg != a.x || this.Ug != a.y) {
        this.Tg = a.x;
        this.Ug = a.y;
        this.oc();
      }
    }
    gS(a, b, c, d) {
      let e = false;
      if (this.Tg != a || this.Ug != b) {
        this.Tg = a;
        this.Ug = b;
        e = true;
      }
      if (this.Zd != 0) {
        a = this.Zd = 0;
        if (a < 0) {
          a += 360;
        }
        this.cg = a * DEG2RAD;
        this.flags &= -2;
        this.u.Db.RD();
        e = true;
      }
      if (this.Ra != c || this.ed != d) {
        this.dg = c;
        if (absLessThan(c, 0.001)) {
          this.dg = (c >= 0 ? 1 : -1) * 0.001;
        }
        this.eg = d;
        if (absLessThan(d, 0.001)) {
          this.eg = (d >= 0 ? 1 : -1) * 0.001;
        }
        if (c == d) {
          if (c == 1) {
            this.flags = this.flags & -3 | 4;
            c = this.u.Db;
            c.scale.x = 1;
            c.scale.y = 1;
            c.K |= 500;
          } else {
            this.flags = this.flags & -5 | 2;
          }
        } else {
          this.flags &= -7;
        }
        e = true;
      }
      if (e) {
        this.oc();
      }
    }
    tS(a) {
      let b = a.x;
      a = a.y;
      if (b == null) {
        b = this.Rg;
      }
      if (a == null) {
        a = this.Sg;
      }
      if (this.Rg != b || this.Sg != a) {
        this.Rg = b;
        this.Sg = a;
        this.oc();
      }
    }
    setPivot(a, b) {
      if (a == null) {
        a = this.Rg;
      }
      if (b == null) {
        b = this.Sg;
      }
      if (this.Rg != a || this.Sg != b) {
        this.Rg = a;
        this.Sg = b;
        this.oc();
      }
    }
    setOrigin(a, b) {
      if (a == null) {
        a = this.pn;
      }
      if (b == null) {
        b = this.qn;
      }
      if (this.pn != a || this.qn != b) {
        this.pn = a;
        this.qn = b;
        this.oc();
      }
    }
    center() {
      this.centerPivot();
      this.centerOrigin();
    }
    update(a) {
      this.u.tickAnims(a);
      this.u.Gd();
      this.u.Um();
    }
    Jx(a) {
      NodeTreeUtil.Yf(this.u);
      return this.u.Fa.Jb(a, new Vec4(0, 0, 0, 1));
    }
    Ix(a) {
      NodeTreeUtil.Yf(this.u);
      return this.u.Fa.gg(a, new Vec4(0, 0, 0, 1));
    }
    tween() {
      return new SpriteTween(this);
    }
    Wd(a) {
      if (a == null) {
        this.u.qs(0);
      } else {
        this.u.Bh(new BlendModeState(a, false));
      }
    }
    pp(a) {
      var b = this.u.li(2);
      if (a != null) {
        if (b == null) {
          b = new ColorTransformState();
          this.u.Bh(b);
        }
        b = b.transform;
        var c = b.$b;
        var d = a.$b;
        c.x = d.x;
        c.y = d.y;
        c.z = d.z;
        c.w = d.w;
        c = b.offset;
        d = a.offset;
        c.x = d.x;
        c.y = d.y;
        c.z = d.z;
        c.w = d.w;
        b.hint = a.hint;
      } else if (b != null) {
        this.u.qs(2);
      }
    }
    jE(a) {
      let b = this.u.li(1);
      if (a != null) {
        if (b == null) {
          b = new ClipState();
          this.u.Bh(b);
        }
        b.fS(a);
      } else if (b != null) {
        this.u.qs(1);
      }
    }
    oc() {
      let a = this.u.Db;
      let b = this.Tg;
      let c = this.Ug;
      let d = this.Rg;
      let e = this.Sg;
      let f = this.pn;
      let g = this.qn;
      let h = this.dg;
      var m = this.eg;
      var n = this.flags;
      if ((n & 1) > 0) {
        let p = Math.sin(this.cg);
        let v = Math.cos(this.cg);
        var q = a.matrix;
        q.m11 = v;
        q.m12 = -p;
        q.m21 = p;
        q.m22 = v;
        a.K = a.K & -4 | 504;
        if ((n & 4) > 0) {
          a.translate.x = -(f * v) + g * p + f + b - d;
          a.translate.y = -(f * p) - g * v + g + c - e;
        } else if ((n & 2) > 0) {
          m = h * f;
          n = h * g;
          a.scale.x = a.scale.y = h;
          a.K = a.K & -2 | 500;
          a.translate.x = -(m * v) + n * p + f + b - d;
          a.translate.y = -(m * p) - n * v + g + c - e;
        } else {
          n = h * f;
          q = m * g;
          a.scale.x = h;
          a.scale.y = m;
          a.K = a.K & -6 | 496;
          a.translate.x = -(n * v) + q * p + f + b - d;
          a.translate.y = -(n * p) - q * v + g + c - e;
        }
      } else if ((n & 4) > 0) {
        a.translate.x = b - d;
        a.translate.y = c - e;
      } else if ((n & 2) > 0) {
        a.scale.x = a.scale.y = h;
        a.K = a.K & -2 | 500;
        a.translate.x = -(h * f) + f + b - d;
        a.translate.y = -(h * g) + g + c - e;
      } else {
        a.scale.x = h;
        a.scale.y = m;
        a.K = a.K & -6 | 496;
        a.translate.x = -(h * f) + f + b - d;
        a.translate.y = -(m * g) + g + c - e;
      }
      a.K = a.K & -2 | 496;
    }
    typeId() {
      return 104;
    }
  }
  DisplayBase.i = true;
  DisplayBase.Ib = [C180, C295];
  Object.assign(DisplayBase.prototype, {
    l: DisplayBase
  });

  class MeshBuffer {
    constructor() {
      this.pw = 0;
      this.gj = Array(6);
      let a = 0;
      while (a < 6) {
        this.gj[a++] = [];
      }
    }
    getData(a) {
      return this.gj[a];
    }
  }
  MeshBuffer.i = true;
  Object.assign(MeshBuffer.prototype, {
    l: MeshBuffer
  });

  class ShapeBounds {
    constructor() {
      this.type = this.typeId();
      this.C = new Vec4(0, 0, 0, 1);
      this.Z = 0;
    }
    free() {
      this.C = null;
    }
    Pn() {}
    from() {}
    typeId() {
      return 102;
    }
  }
  ShapeBounds.i = true;
  ShapeBounds.Ib = [C180];
  Object.assign(ShapeBounds.prototype, {
    l: ShapeBounds
  });
  class BoxBounds extends ShapeBounds {
    constructor() {
      super();
      this.gb = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
    }
    free() {
      this.gb = null;
      super.free();
    }
    Pn(a) {
      var b = this.gb;
      b.A = b.D = vInfinity;
      b.B = b.G = vNegInfinity;
      b = a.length >> 1;
      let c = 0;
      while (c < b) {
        let d = c++;
        this.gb.ku(new Vec4(a[d << 1], a[(d << 1) + 1], 0, 1));
      }
    }
    contains(a) {
      let b = this.gb;
      let c = a.x;
      a = a.y;
      if (c >= b.A && c <= b.B && a >= b.D) {
        return a <= b.G;
      } else {
        return false;
      }
    }
    lr(a) {
      switch (a.type) {
        case 202:
          var b = a.C;
          a = a.Z;
          this.gb.ku(new Vec4(b.x - a, b.y - a, 0, 1));
          this.gb.ku(new Vec4(b.x + a, b.y + a, 0, 1));
          break;
        case 302:
          this.gb.add(a.gb);
      }
      b = this.gb;
      b = (b.B - b.A) / 2;
      a = this.gb;
      a = (a.G - a.D) / 2;
      this.C.x = this.gb.A + b;
      this.C.y = this.gb.D + a;
      this.Z = Math.sqrt(b * b + a * a);
    }
    from(a) {
      let b = a.C;
      let c = a.Z;
      switch (a.type) {
        case 202:
          this.gb.A = b.x - c;
          this.gb.D = b.y - c;
          this.gb.B = b.x + c;
          this.gb.G = b.y + c;
          break;
        case 302:
          var d = this.gb;
          a = a.gb;
          d.A = a.A;
          d.D = a.D;
          d.B = a.B;
          d.G = a.G;
      }
      d = this.C;
      d.x = b.x;
      d.y = b.y;
      d.z = b.z;
      this.Z = c;
    }
    kt(a, b) {
      var c = this.C;
      var d = b.C;
      if ((a.K & 64) > 0) {
        a.Tm();
      }
      var e = a.Ue;
      var f = e.m21 * c.x + e.m22 * c.y + e.m24;
      d.x = e.m11 * c.x + e.m12 * c.y + e.m14;
      d.y = f;
      b.Z = ((a.K & 8) > 0 ? Math.max(Math.abs(a.scale.x), Math.abs(a.scale.y)) : Math.max(Math.abs(a.matrix.m11) + Math.abs(a.matrix.m12), Math.abs(a.matrix.m21) + Math.abs(a.matrix.m22))) * this.Z;
      b = b.gb;
      c = this.gb;
      d = c.B - c.A;
      c = this.gb;
      c = c.G - c.D;
      f = e = BoxBounds.Fd;
      var g = this.gb;
      var h = this.gb;
      f.x = (g.A + g.B) / 2;
      f.y = (h.D + h.G) / 2;
      a.Jb(e, e);
      b.A = e.x;
      b.D = e.y;
      b.B = e.x;
      b.G = e.y;
      if ((a.K & 8) > 0) {
        h = a.matrix;
        e = h.m11;
        f = h.m12;
        g = h.m21;
        h = h.m22;
        a = a.scale;
        d = d * a.x * 0.5;
        a = c * a.y * 0.5;
        if (e > 0) {
          b.A -= e * d;
          b.B += e * d;
        } else {
          b.A += e * d;
          b.B -= e * d;
        }
        if (f > 0) {
          b.A -= f * a;
          b.B += f * a;
        } else {
          b.A += f * a;
          b.B -= f * a;
        }
        if (g > 0) {
          b.D -= g * d;
          b.G += g * d;
        } else {
          b.D += g * d;
          b.G -= g * d;
        }
        if (h > 0) {
          b.D -= h * a;
          b.G += h * a;
        } else {
          b.D += h * a;
          b.G -= h * a;
        }
      } else {
        g = a.matrix;
        e = g.m11;
        f = g.m12;
        h = Math.sqrt(e * e + f * f);
        a = h * d * 0.5;
        c = (e * g.m22 - f * g.m21) / h * c * 0.5;
        e = Math.atan2(f, e);
        d = Math.cos(e);
        e = Math.sin(e);
        if (d > 0) {
          b.A -= d * a;
          b.B += d * a;
        } else {
          b.A += d * a;
          b.B -= d * a;
        }
        if (e > 0) {
          b.A -= e * c;
          b.B += e * c;
        } else {
          b.A += e * c;
          b.B -= e * c;
        }
        if (-e > 0) {
          b.D -= -e * a;
          b.G += -e * a;
        } else {
          b.D += -e * a;
          b.G -= -e * a;
        }
        if (d > 0) {
          b.D -= d * c;
          b.G += d * c;
        } else {
          b.D += d * c;
          b.G -= d * c;
        }
      }
    }
    typeId() {
      return 302;
    }
  }
  BoxBounds.i = true;
  BoxBounds.s = ShapeBounds;
  Object.assign(BoxBounds.prototype, {
    l: BoxBounds
  });
  class CircleBounds extends ShapeBounds {
    constructor() {
      super();
    }
    Pn(a) {
      let b = 0;
      let c = 0;
      let d = 0;
      let e = a.length;
      for (var f = 0; f < e;) {
        b += a[f++];
        c += a[f++];
        d += a[f++];
      }
      f = e / 3 | 0;
      b /= f;
      c /= f;
      d /= f;
      let g = 0;
      for (f = 0; f < e;) {
        var h = a[f++] - b;
        let m = a[f++] - c;
        let n = a[f++] - d;
        h = h * h + m * m + n * n;
        if (h > g) {
          g = h;
        }
      }
      this.Z = Math.sqrt(g);
      a = this.C;
      a.x = b;
      a.y = c;
      a.z = d;
    }
    contains(a) {
      let b = a.x - this.C.x;
      let c = a.y - this.C.y;
      a = a.z - this.C.z;
      return b * b + c * c + a * a <= this.Z * this.Z;
    }
    lr(a) {
      var b = a.Z;
      if (b != 0) {
        var c = this.Z;
        if (c == 0) {
          this.Z = a.Z;
          b = this.C;
          c = a.C;
          b.x = c.x;
          b.y = c.y;
          b.z = c.z;
        } else {
          var d = this.C;
          var e = a.C;
          var f = e.x - d.x;
          var g = e.y - d.y;
          e = e.z - d.z;
          var h = f * f + g * g + e * e;
          var m = b - c;
          if (m * m >= h) {
            if (m >= 0) {
              this.Z = a.Z;
              b = this.C;
              c = a.C;
              b.x = c.x;
              b.y = c.y;
              b.z = c.z;
            }
          } else {
            a = Math.sqrt(h);
            if (a > 0) {
              m = (a + m) / (a * 2);
              h = this.C;
              h.x = d.x + f * m;
              h.y = d.y + g * m;
              h.z = d.z + e * m;
            }
            this.Z = (a + c + b) / 2;
          }
        }
      }
    }
    from(a) {
      this.C.x = a.C.x;
      this.C.y = a.C.y;
      this.Z = a.Z;
    }
    kt(a, b) {
      b.C = a.UL(this.C, b.C);
      b.Z = a.PN() * this.Z;
    }
    typeId() {
      return 502;
    }
  }
  CircleBounds.i = true;
  CircleBounds.s = ShapeBounds;
  Object.assign(CircleBounds.prototype, {
    l: CircleBounds
  });

  class TextNode extends DisplayBase {
    constructor(a, b) {
      a = new SpriteNode(a != null ? a.node : null);
      super(a);
      this.effect = new TextDrawEffect(b);
      a.Rf(this.effect);
      b = this.effect.size;
      a.Lb(b.x, b.y);
    }
    free() {
      if (this.u != null) {
        this.u.free();
        this.Hb = this.effect = null;
        super.free();
      }
    }
    Uf(a) {
      this.effect.free();
      this.effect = new TextDrawEffect(a);
      a = this.u;
      a.Rf(this.effect);
      let b = this.effect.size;
      a.Lb(b.x, b.y);
    }
    setMultiline(a) {
      if (a == null) {
        a = true;
      }
      if (this.effect.Ze) {
        this.effect.shape();
      }
      this.effect.nN(a);
    }
    shape() {
      this.effect.shape();
    }
    setBoxSize(a, b) {
      this.effect.setBoxSize(a, b);
      this.u.Lb(a, b);
    }
    setText(a) {
      this.effect.setText(a);
    }
    setAlign(a, b) {
      this.effect.setAlign(a, b);
    }
    $q() {
      return this.effect.$q();
    }
    setFontSize(a) {
      this.effect.setFontSize(a);
    }
    uv() {
      return this.effect.uv();
    }
    kp() {
      this.effect.kp();
    }
    kx(a) {
      this.effect.kx(a);
    }
    Is(a) {
      this.effect.Is(a);
    }
    Tf(a) {
      this.effect.Tf(a);
    }
    Re(a, b) {
      if (b == null) {
        b = true;
      }
      this.shape();
      var c = this.effect.Og.gb;
      c = new Bounds(c.A, c.D, c.B, c.G);
      if (c.A >= c.B || c.D >= c.G || a == this) {
        return c;
      }
      if (b) {
        NodeTreeUtil.Yf(this.u);
        if (a != null && !NodeTreeUtil.Ov(this.u, a.u)) {
          NodeTreeUtil.Yf(a.u);
        }
      }
      return NodeTreeUtil.cT(this.u, a == null ? this.u.gB() : a.u, c);
    }
    centerOrigin() {
      let a = this.Re(this);
      if (a.A >= a.B || a.D >= a.G) {
        this.setOrigin(0, 0);
      } else {
        this.setOrigin((a.A + a.B) / 2, (a.D + a.G) / 2);
      }
    }
    centerPivot() {
      let a = this.Re(this);
      if (a.A >= a.B || a.D >= a.G) {
        this.setPivot(0, 0);
      } else {
        this.setPivot((a.A + a.B) / 2, (a.D + a.G) / 2);
      }
    }
    getWidth() {
      let a = this.Re(this.mh());
      return a.B - a.A;
    }
    setScaleX() {
      throw 24;
    }
    setScaleY() {
      throw 25;
    }
    typeId() {
      return 404;
    }
  }
  TextNode.i = true;
  TextNode.s = DisplayBase;
  Object.assign(TextNode.prototype, {
    l: TextNode
  });
  class BoxShapeBounds extends ShapeBounds {
    constructor() {
      super();
      this.box = new BoundsLite(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
    }
    free() {
      this.box = null;
      super.free();
    }
    Pn(a) {
      var b = this.box;
      b.A = b.D = vInfinity;
      b.B = b.G = vNegInfinity;
      a = a.length >> 1;
      for (b = 0; b < a;) {
        ++b;
      }
    }
    contains() {
      return false;
    }
    lr() {}
    from() {}
    kt(a, b) {
      var c = this.C;
      var d = b.C;
      if ((a.K & 16) > 0) {
        a.nt();
      }
      var e = a.Ue;
      let f = c.x;
      let g = c.y;
      c = c.z;
      d.x = e.m11 * f + e.m12 * g + e.m13 * c + e.m14;
      d.y = e.m21 * f + e.m22 * g + e.m23 * c + e.m24;
      d.z = e.m31 * f + e.m32 * g + e.m33 * c + e.m34;
      if ((a.K & 8) > 0) {
        d = Math.abs(a.scale.x);
        e = Math.abs(a.scale.y);
        a = Math.abs(a.scale.z);
      } else {
        a = a.matrix;
        d = Math.abs(a.m11) + Math.abs(a.m12) + Math.abs(a.m13);
        e = Math.abs(a.m21) + Math.abs(a.m22) + Math.abs(a.m23);
        a = Math.abs(a.m31) + Math.abs(a.m32) + Math.abs(a.m33);
      }
      b.Z = Math.max(Math.max(d, e), a) * this.Z;
    }
    typeId() {
      return 402;
    }
  }
  BoxShapeBounds.i = true;
  BoxShapeBounds.s = ShapeBounds;
  Object.assign(BoxShapeBounds.prototype, {
    l: BoxShapeBounds
  });
  class PolygonShapeBounds extends ShapeBounds {
    constructor() {
      super();
    }
    Pn(a) {
      let b = a.length >> 1;
      var c = 0;
      var d = 0;
      for (var e = 0; e < b;) {
        var f = e++;
        c += a[f << 1];
        d += a[(f << 1) + 1];
      }
      c = this.C.x = c / b;
      d = this.C.y = d / b;
      for (e = this.Z = 0; e < b;) {
        var g = e++;
        f = a[g << 1] - c;
        g = a[(g << 1) + 1] - d;
        this.Z = Math.max(f * f + g * g, this.Z);
      }
      this.Z = Math.sqrt(this.Z);
    }
    contains(a) {
      let b = a.x - this.C.x;
      a = a.y - this.C.y;
      return b * b + a * a <= this.Z * this.Z;
    }
    lr(a) {
      if (a.Z != 0) {
        if (this.Z == 0) {
          this.Z = a.Z;
          this.C.x = a.C.x;
          this.C.y = a.C.y;
        } else {
          var b = a.C.x - this.C.x;
          var c = a.C.y - this.C.y;
          var d = a.Z - this.Z;
          var e = b * b + c * c;
          if (d * d >= e) {
            if (d >= 0) {
              this.from(a);
            }
          } else {
            d = Math.sqrt(e);
            e = (d + a.Z - this.Z) / (d * 2);
            this.C.x += e * b;
            this.C.y += e * c;
            this.Z = (d + this.Z + a.Z) / 2;
          }
        }
      }
    }
    from(a) {
      this.C.x = a.C.x;
      this.C.y = a.C.y;
      this.Z = a.Z;
    }
    kt(a, b) {
      var c = this.C;
      var d = b.C;
      if ((a.K & 64) > 0) {
        a.Tm();
      }
      let e = a.Ue;
      let f = e.m21 * c.x + e.m22 * c.y + e.m24;
      d.x = e.m11 * c.x + e.m12 * c.y + e.m14;
      d.y = f;
      if ((a.K & 8) > 0) {
        c = Math.abs(a.scale.x);
        d = Math.abs(a.scale.y);
        a = Math.abs(a.scale.z);
      } else {
        a = a.matrix;
        c = Math.abs(a.m11) + Math.abs(a.m12) + Math.abs(a.m13);
        d = Math.abs(a.m21) + Math.abs(a.m22) + Math.abs(a.m23);
        a = Math.abs(a.m31) + Math.abs(a.m32) + Math.abs(a.m33);
      }
      b.Z = Math.max(Math.max(c, d), a) * this.Z;
    }
    typeId() {
      return 202;
    }
  }
  PolygonShapeBounds.i = true;
  PolygonShapeBounds.s = ShapeBounds;
  Object.assign(PolygonShapeBounds.prototype, {
    l: PolygonShapeBounds
  });

  class ColorRectShape {
    constructor(a, b) {
      this.u = this.va = new SceneGroup();
      this.u.Xg = this;
      this.va.Bh(new AlphaState(1));
      if (a != null) {
        this.va.Rf(new MeshDrawEffect(a));
      } else {
        this.va.Rf(new ClearEffect(b));
      }
    }
    W(a) {
      this.va.li(5).bf(a);
    }
    L(a) {
      this.va.Ne = a ? 2 : 1;
    }
    free() {
      this.va.free();
      this.u = this.va = null;
    }
  }
  ColorRectShape.i = true;
  ColorRectShape.Ib = [C295];
  Object.assign(ColorRectShape.prototype, {
    l: ColorRectShape
  });
  class C6 {}
  C6.i = true;
  C6.Je = true;
  C6.Ib = [C5];
  class C7 {}
  C7.i = true;
  C7.Je = true;
  C7.Ib = [C6];
  class ArrayList {
    constructor(a, b, c) {
      if (a == null) {
        a = 2;
      }
      this.sd = null;
      this.ba = 0;
      this.Dm = false;
      this.Rj = -2;
      this.cm = a < 2 ? 2 : a;
      if (b != null && b.length > 0) {
        this.ba = b.length;
        this.N = b.slice(0, b.length);
        this.eb = this.ba;
      } else {
        this.eb = this.cm;
        this.N = Array(this.eb);
      }
      if (c) {
        this.Rj = 0;
      }
    }
    pushBack(a) {
      if (this.ba == this.eb) {
        this.grow();
      }
      this.N[this.ba++] = a;
    }
    front() {
      return this.N[0];
    }
    swapPop(a) {
      let b = this.N;
      b[a] = b[--this.ba];
    }
    trim(a) {
      this.ba = a;
      return this;
    }
    indexOf(a) {
      if (this.ba == 0) {
        return -1;
      }
      let b = 0;
      let c = -1;
      let d = this.ba - 1;
      let e = this.N;
      do {
        if (e[b] == a) {
          c = b;
          break;
        }
      } while (b++ < d);
      return c;
    }
    reserve(a) {
      if (a > this.eb) {
        this.eb = a;
        this.resizeContainer(a);
      }
    }
    ib(a, b) {
      this.reserve(a);
      this.ba = a;
      let c = this.N;
      let d = 0;
      while (d < a) {
        c[d++] = b;
      }
    }
    pack() {
      if (this.eb > this.cm) {
        var a = this.cm;
        var b = this.ba;
        this.eb = a > b ? a : b;
        this.resizeContainer(this.eb);
      } else {
        a = this.N;
        b = this.ba;
        let c = this.eb;
        while (b < c) {
          a[b++] = null;
        }
      }
    }
    grow() {
      this.eb = GrowStrategy.On(this.Rj, this.eb);
      this.resizeContainer(this.eb);
    }
    resizeContainer(a) {
      a = Array(a);
      NativeArray.Bn(this.N, 0, a, this.ba);
      this.N = a;
    }
    cv() {
      NativeArray.Or(this.N);
      this.N = null;
      if (this.sd != null) {
        this.sd.cv();
        this.sd = null;
      }
    }
    clear(a) {
      if (a == null) {
        a = false;
      }
      if (a) {
        NativeArray.Or(this.N);
      }
      this.ba = 0;
    }
    iterator() {
      if (this.Dm) {
        if (this.sd == null) {
          this.sd = new ArrayListIter(this);
        } else {
          let a = this.sd;
          a.N = a.ye.N;
          a.yg = a.ye.ba;
          a.xe = 0;
        }
        return this.sd;
      }
      return new ArrayListIter(this);
    }
  }
  ArrayList.i = true;
  ArrayList.Ib = [C7];
  Object.assign(ArrayList.prototype, {
    l: ArrayList
  });
  class Grid2D {
    constructor(a, b, c) {
      this.sd = null;
      this.Dm = false;
      if (c != null) {
        this.Tb = a;
        this.Yc = b;
        a = this.N = Array(this.Tb * this.Yc);
        b = 0;
        let d = this.Tb * this.Yc;
        while (b < d) {
          let e = b++;
          a[e] = c[e];
        }
      } else {
        this.Tb = a;
        this.Yc = b;
        this.N = Array(this.Tb * this.Yc);
      }
    }
    forEach(a) {
      let b = this.N;
      let c = this.Tb;
      let d = 0;
      let e = this.Tb * this.Yc;
      while (d < e) {
        let f = d++;
        b[f] = a(b[f], f % c, f / c | 0);
      }
      return this;
    }
    zi(a) {
      let b = this.N;
      let c = 0;
      let d = this.Tb * this.Yc;
      while (c < d) {
        a(b[c++]);
      }
      return this;
    }
    resize(a, b) {
      if (a == this.Tb && b == this.Yc) {
        return this;
      }
      let c = this.N;
      this.N = Array(a * b);
      if (a == this.Tb) {
        NativeArray.Bn(c, 0, this.N, this.Tb * (b < this.Yc ? b : this.Yc));
        this.Tb = a;
        this.Yc = b;
        return this;
      }
      let d = a < this.Tb ? a : this.Tb;
      let e;
      let f = this.N;
      let g = 0;
      let h = b < this.Yc ? b : this.Yc;
      while (g < h) {
        var m = g++;
        e = m * a;
        m *= this.Tb;
        let n = 0;
        let q = d;
        while (n < q) {
          let p = n++;
          f[e + p] = c[m + p];
        }
      }
      this.Tb = a;
      this.Yc = b;
      return this;
    }
    iterator() {
      if (this.Dm) {
        if (this.sd == null) {
          this.sd = new Grid2DIter(this);
        } else {
          let a = this.sd;
          a.N = a.ye.N;
          let b = a.ye;
          a.yg = b.Tb * b.Yc;
          a.xe = 0;
        }
        return this.sd;
      }
      return new Grid2DIter(this);
    }
  }
  Grid2D.i = true;
  Grid2D.Ib = [C6];
  Object.assign(Grid2D.prototype, {
    l: Grid2D
  });
  class C83 {}
  C83.i = true;
  C83.Je = true;
  Object.assign(C83.prototype, {
    l: C83
  });
  class Grid2DIter {
    constructor(a) {
      this.ye = a;
      this.N = this.ye.N;
      a = this.ye;
      this.yg = a.Tb * a.Yc;
      this.xe = 0;
    }
    fb() {
      return this.xe < this.yg;
    }
    next() {
      return this.N[this.xe++];
    }
  }
  Grid2DIter.i = true;
  Grid2DIter.Ib = [C83];
  Object.assign(Grid2DIter.prototype, {
    l: Grid2DIter
  });
  class C88 {}
  C88.i = true;
  C88.Je = true;
  C88.Ib = [C6];
  class Stack {
    constructor(a, b, c) {
      if (a == null) {
        a = 16;
      }
      this.Ga = 0;
      this.Rj = -2;
      this.eb = this.cm = a < 1 ? 1 : a;
      if (b != null) {
        a = this.Ga = b.length;
        var d = this.eb;
        this.eb = a > d ? a : d;
      }
      this.N = Array(this.eb);
      if (b != null) {
        a = this.N;
        d = 0;
        let e = this.Ga;
        while (d < e) {
          let f = d++;
          a[f] = b[f];
        }
      }
      if (c) {
        this.Rj = 0;
      }
    }
    reserve(a) {
      if (a > this.eb) {
        this.eb = a;
        this.resizeContainer(a);
      }
    }
    top() {
      return this.N[this.Ga - 1];
    }
    clear(a) {
      if (a == null) {
        a = false;
      }
      if (a) {
        NativeArray.Or(this.N);
      }
      this.Ga = 0;
    }
    grow() {
      this.eb = GrowStrategy.On(this.Rj, this.eb);
      this.resizeContainer(this.eb);
    }
    resizeContainer(a) {
      a = Array(a);
      NativeArray.Bn(this.N, 0, a, this.Ga);
      this.N = a;
    }
  }
  Stack.i = true;
  Stack.Ib = [C88];
  Object.assign(Stack.prototype, {
    l: Stack
  });
  class C87 {}
  C87.i = true;
  C87.Je = true;
  C87.Ib = [C6];
  class PriorityQueue {
    constructor(a, b, c) {
      if (b == null) {
        b = false;
      }
      if (a == null) {
        a = 1;
      }
      this.sd = null;
      this.ba = 0;
      this.Dm = false;
      this.Rj = -2;
      this.cm = a < 1 ? 1 : a;
      this.eb = a;
      this.xg = b;
      if (c != null) {
        a = this.ba = c.length;
        b = this.eb;
        this.eb = a > b ? a : b;
      }
      this.N = Array(this.eb + 1);
      this.N[0] = null;
      if (c != null) {
        a = this.N;
        b = 1;
        let d = this.ba + 1;
        while (b < d) {
          let e = b++;
          a[e] = c[e - 1];
        }
        this.pR();
      }
    }
    enqueue(a) {
      if (this.ba == this.eb) {
        this.grow();
      }
      this.N[++this.ba] = a;
      a = a.g = this.ba;
      let b = this.N;
      let c = a >> 1;
      let d = b[a];
      let e = d.priority;
      if (this.xg) {
        while (c > 0) {
          var f = b[c];
          if (e - f.priority < 0) {
            b[a] = f;
            f.g = a;
            a = c;
            c >>= 1;
          } else {
            break;
          }
        }
      } else {
        while (c > 0) {
          f = b[c];
          if (e - f.priority > 0) {
            b[a] = f;
            f.g = a;
            a = c;
            c >>= 1;
          } else {
            break;
          }
        }
      }
      b[a] = d;
      d.g = a;
    }
    KM() {
      var a = this.N;
      let b = a[1];
      b.g = -1;
      a[1] = a[this.ba];
      a = 1;
      let c = this.N;
      let d = 2;
      let e;
      let f = c[1];
      let g = f.priority;
      if (this.xg) {
        while (d < this.ba) {
          if (d < this.ba - 1 && c[d].priority - c[d + 1].priority > 0) {
            ++d;
          }
          e = c[d];
          if (g - e.priority > 0) {
            c[a] = e;
            e.g = a;
            a = f.g = d;
            d <<= 1;
          } else {
            break;
          }
        }
      } else {
        while (d < this.ba) {
          if (d < this.ba - 1 && c[d].priority - c[d + 1].priority < 0) {
            ++d;
          }
          e = c[d];
          if (g - e.priority < 0) {
            c[a] = e;
            e.g = a;
            a = f.g = d;
            d <<= 1;
          } else {
            break;
          }
        }
      }
      c[a] = f;
      f.g = a;
      this.ba--;
      return b;
    }
    rR(a, b) {
      var c = a.priority;
      if (c != b) {
        a.priority = b;
        a = a.g;
        if (this.xg) {
          if (b < c) {
            b = a;
            c = this.N;
            var d = a >> 1;
            a = c[a];
            var e = a.priority;
            if (this.xg) {
              while (d > 0) {
                var f = c[d];
                if (e - f.priority < 0) {
                  c[b] = f;
                  f.g = b;
                  b = d;
                  d >>= 1;
                } else {
                  break;
                }
              }
            } else {
              while (d > 0) {
                f = c[d];
                if (e - f.priority > 0) {
                  c[b] = f;
                  f.g = b;
                  b = d;
                  d >>= 1;
                } else {
                  break;
                }
              }
            }
            c[b] = a;
            a.g = b;
          } else {
            b = a;
            c = this.N;
            d = a << 1;
            e = c[a];
            f = e.priority;
            if (this.xg) {
              while (d < this.ba) {
                if (d < this.ba - 1 && c[d].priority - c[d + 1].priority > 0) {
                  ++d;
                }
                a = c[d];
                if (f - a.priority > 0) {
                  c[b] = a;
                  a.g = b;
                  b = e.g = d;
                  d <<= 1;
                } else {
                  break;
                }
              }
            } else {
              while (d < this.ba) {
                if (d < this.ba - 1 && c[d].priority - c[d + 1].priority < 0) {
                  ++d;
                }
                a = c[d];
                if (f - a.priority < 0) {
                  c[b] = a;
                  a.g = b;
                  b = e.g = d;
                  d <<= 1;
                } else {
                  break;
                }
              }
            }
            c[b] = e;
            e.g = b;
            a = this.ba;
            b = this.N;
            c = a >> 1;
            d = b[a];
            e = d.priority;
            if (this.xg) {
              while (c > 0) {
                f = b[c];
                if (e - f.priority < 0) {
                  b[a] = f;
                  f.g = a;
                  a = c;
                  c >>= 1;
                } else {
                  break;
                }
              }
            } else {
              while (c > 0) {
                f = b[c];
                if (e - f.priority > 0) {
                  b[a] = f;
                  f.g = a;
                  a = c;
                  c >>= 1;
                } else {
                  break;
                }
              }
            }
            b[a] = d;
            d.g = a;
          }
        } else if (b > c) {
          b = a;
          c = this.N;
          d = a >> 1;
          a = c[a];
          e = a.priority;
          if (this.xg) {
            while (d > 0) {
              f = c[d];
              if (e - f.priority < 0) {
                c[b] = f;
                f.g = b;
                b = d;
                d >>= 1;
              } else {
                break;
              }
            }
          } else {
            while (d > 0) {
              f = c[d];
              if (e - f.priority > 0) {
                c[b] = f;
                f.g = b;
                b = d;
                d >>= 1;
              } else {
                break;
              }
            }
          }
          c[b] = a;
          a.g = b;
        } else {
          b = a;
          c = this.N;
          d = a << 1;
          e = c[a];
          f = e.priority;
          if (this.xg) {
            while (d < this.ba) {
              if (d < this.ba - 1 && c[d].priority - c[d + 1].priority > 0) {
                ++d;
              }
              a = c[d];
              if (f - a.priority > 0) {
                c[b] = a;
                a.g = b;
                b = e.g = d;
                d <<= 1;
              } else {
                break;
              }
            }
          } else {
            while (d < this.ba) {
              if (d < this.ba - 1 && c[d].priority - c[d + 1].priority < 0) {
                ++d;
              }
              a = c[d];
              if (f - a.priority < 0) {
                c[b] = a;
                a.g = b;
                b = e.g = d;
                d <<= 1;
              } else {
                break;
              }
            }
          }
          c[b] = e;
          e.g = b;
          a = this.ba;
          b = this.N;
          c = a >> 1;
          d = b[a];
          e = d.priority;
          if (this.xg) {
            while (c > 0) {
              f = b[c];
              if (e - f.priority < 0) {
                b[a] = f;
                f.g = a;
                a = c;
                c >>= 1;
              } else {
                break;
              }
            }
          } else {
            while (c > 0) {
              f = b[c];
              if (e - f.priority > 0) {
                b[a] = f;
                f.g = a;
                a = c;
                c >>= 1;
              } else {
                break;
              }
            }
          }
          b[a] = d;
          d.g = a;
        }
      }
    }
    clear(a) {
      if (a == null) {
        a = false;
      }
      if (a) {
        NativeArray.Or(this.N);
      }
      this.ba = 0;
    }
    iterator() {
      if (this.Dm) {
        if (this.sd == null) {
          return new ArrayReverseIter(this);
        }
        this.sd.reset();
        return this.sd;
      }
      return new ArrayReverseIter(this);
    }
    pR() {
      let a = this.ba >> 1;
      while (a >= 1) {
        this.vB(a, this.ba);
        --a;
      }
    }
    vB(a, b) {
      let c = this.N;
      var d = a << 1;
      var e = d + 1;
      let f = a;
      if (this.xg) {
        if (d <= b && c[d].priority - c[a].priority < 0) {
          f = d;
        }
        if (d + 1 <= b && c[d + 1].priority - c[f].priority < 0) {
          f = e;
        }
      } else {
        if (d <= b && c[d].priority - c[a].priority > 0) {
          f = d;
        }
        if (d + 1 <= b && c[d + 1].priority - c[f].priority > 0) {
          f = e;
        }
      }
      if (f != a) {
        d = c[f];
        e = c[a];
        c[f] = e;
        c[a] = d;
        a = d.g;
        d.g = e.g;
        e.g = a;
        this.vB(f, b);
      }
    }
    grow() {
      this.eb = GrowStrategy.On(this.Rj, this.eb);
      this.resizeContainer(this.eb);
    }
    resizeContainer(a) {
      a = Array(a + 1);
      NativeArray.Bn(this.N, 0, a, this.ba + 1);
      this.N = a;
    }
  }
  PriorityQueue.i = true;
  PriorityQueue.Ib = [C87];
  Object.assign(PriorityQueue.prototype, {
    l: PriorityQueue
  });
  class NativeArray {
    static Bn(a, b, c, d) {
      if (d > 0) {
        if (a == c) {
          if (b < 0) {
            c = b + d;
            b = 0 + d;
            for (var e = 0; e < d;) {
              ++e;
              --c;
              --b;
              a[b] = a[c];
            }
          } else if (b > 0) {
            c = b;
            e = b = 0;
            while (e < d) {
              ++e;
              a[b] = a[c];
              ++c;
              ++b;
            }
          }
        } else if (b == 0) {
          for (b = 0; b < d;) {
            e = b++;
            c[e] = a[e];
          }
        } else if (b == 0) {
          for (b = 0; b < d;) {
            e = b++;
            c[0 + e] = a[e];
          }
        } else {
          for (e = 0; e < d;) {
            let f = e++;
            c[f] = a[b + f];
          }
        }
      }
    }
    static Or(a) {
      var b;
      var c;
      if (c == null) {
        c = 0;
      }
      if (b == null) {
        b = 0;
      }
      let d = b;
      for (b = c <= 0 ? a.length : b + c; d < b;) {
        a[d++] = null;
      }
    }
    static WL(a, b, c) {
      let d = 0;
      let e;
      let f = c + 1;
      while (d < f) {
        e = d + (f - d >> 1);
        if (a[e] < b) {
          d = e + 1;
        } else {
          f = e;
        }
      }
      if (d <= c && a[d] == b) {
        return d;
      } else {
        return ~d;
      }
    }
  }
  NativeArray.i = true;
  class GrowableList {
    constructor() {
      this.list = [];
      this.size = 0;
    }
    add(a) {
      this.list[this.size++] = a;
    }
    get(a) {
      return this.list[a];
    }
  }
  GrowableList.i = true;
  Object.assign(GrowableList.prototype, {
    l: GrowableList
  });
  class C306 {}
  C306.i = true;
  C306.Je = true;
  Object.assign(C306.prototype, {
    l: C306
  });

  class HashMap {
    constructor() {
      this.J = {};
    }
    get(a) {
      return this.J[a];
    }
    remove(a) {
      if (!this.J.hasOwnProperty(a)) {
        return false;
      }
      delete this.J[a];
      return true;
    }
    keys() {
      let a = [];
      for (var b in this.J) {
        if (this.J.hasOwnProperty(b)) {
          a.push(+b);
        }
      }
      return new ArrayIter(a);
    }
    iterator() {
      return {
        ks: this.J,
        Ao: this.keys(),
        fb: function () {
          return this.Ao.fb();
        },
        next: function () {
          let a = this.Ao.next();
          return this.ks[a];
        }
      };
    }
  }
  HashMap.i = true;
  HashMap.Ib = [C306];
  Object.assign(HashMap.prototype, {
    l: HashMap
  });
  class KeyTable {
    constructor() {
      this.J = Object.create(null);
    }
    get(a) {
      return this.J[a];
    }
    keys() {
      return new ObjectIter(this.J);
    }
  }
  KeyTable.i = true;
  KeyTable.Ib = [C306];
  Object.assign(KeyTable.prototype, {
    l: KeyTable
  });
  class ArrayIter {
    constructor(a) {
      this.current = 0;
      this.Mz = a;
    }
    fb() {
      return this.current < this.Mz.length;
    }
    next() {
      return this.Mz[this.current++];
    }
  }
  ArrayIter.i = true;
  Object.assign(ArrayIter.prototype, {
    l: ArrayIter
  });
  class ArrayListIter {
    constructor(a) {
      this.ye = a;
      this.N = this.ye.N;
      this.yg = this.ye.ba;
      this.xe = 0;
    }
    cv() {
      this.N = this.ye = null;
    }
    fb() {
      return this.xe < this.yg;
    }
    next() {
      return this.N[this.xe++];
    }
  }
  ArrayListIter.i = true;
  ArrayListIter.Ib = [C83];
  Object.assign(ArrayListIter.prototype, {
    l: ArrayListIter
  });
  class UidGen {
    static next() {
      if (UidGen.xz == null) {
        UidGen.xz = 0;
      }
      return UidGen.xz++;
    }
  }
  UidGen.i = true;
  class GrowStrategy {
    static On(a, b) {
      if (a > 0) {
        b += a;
      } else {
        switch (a) {
          case -3:
            b <<= 1;
            break;
          case -2:
            b = (b * 3 >> 1) + 1;
            break;
          case -1:
            a = b + 1;
            b = (a >> 3) + (a < 9 ? 3 : 6);
            b += a;
            break;
          case 0:
            throw 5;
        }
      }
      return b;
    }
  }
  GrowStrategy.i = true;

  class NodeTreeIter {
    constructor(a) {
      this.top = 0;
      this.stack = [];
      this.push(a);
    }
    fb() {
      return this.top > 0;
    }
    next() {
      let a = this.stack[--this.top];
      this.push(a);
      return a;
    }
    push(a) {
      for (a = a.Me; a != null;) {
        this.stack[this.top++] = a;
        a = a.Y;
      }
    }
  }
  NodeTreeIter.i = true;
  Object.assign(NodeTreeIter.prototype, {
    l: NodeTreeIter
  });

  class ArrayReverseIter {
    constructor(a) {
      this.ye = a;
      this.reset();
    }
    reset() {
      this.xe = 0;
      this.yg = this.ye.ba;
      this.N = Array(this.yg);
      NativeArray.Bn(this.ye.N, 1, this.N, this.yg);
      return this;
    }
    fb() {
      return this.xe < this.yg;
    }
    next() {
      return this.N[this.xe++];
    }
  }
  ArrayReverseIter.i = true;
  ArrayReverseIter.Ib = [C83];
  Object.assign(ArrayReverseIter.prototype, {
    l: ArrayReverseIter
  });

  class OrderedMap {
    constructor() {
      this.J = {
        Wk: {}
      };
    }
    set(a, b) {
      let c = a.jf;
      if (c == null) {
        c = a.jf = host.zt++;
      }
      this.J[c] = b;
      this.J.Wk[c] = a;
    }
    get(a) {
      return this.J[a.jf];
    }
    remove(a) {
      a = a.jf;
      if (this.J.Wk[a] == null) {
        return false;
      }
      delete this.J[a];
      delete this.J.Wk[a];
      return true;
    }
    keys() {
      let a = [];
      for (var b in this.J.Wk) {
        if (this.J.hasOwnProperty(b)) {
          a.push(this.J.Wk[b]);
        }
      }
      return new ArrayIter(a);
    }
    iterator() {
      return {
        ks: this.J,
        Ao: this.keys(),
        fb: function () {
          return this.Ao.fb();
        },
        next: function () {
          let a = this.Ao.next();
          return this.ks[a.jf];
        }
      };
    }
  }
  OrderedMap.i = true;
  OrderedMap.Ib = [C306];
  Object.assign(OrderedMap.prototype, {
    l: OrderedMap
  });

  class ObjectIter {
    constructor(a) {
      this.J = a;
      this.keys = Object.keys(a);
      this.length = this.keys.length;
      this.current = 0;
    }
    fb() {
      return this.current < this.length;
    }
    next() {
      return this.keys[this.current++];
    }
  }
  ObjectIter.i = true;
  Object.assign(ObjectIter.prototype, {
    l: ObjectIter
  });
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
class StorageProvider {
    static tryGet() {
      try {
        let a = window.localStorage;
        a.getItem("");
        if (a.length == 0) {
          let b = "_hx_" + Math.random();
          a.setItem(b, b);
          a.removeItem(b);
        }
        return a;
      } catch (a) {
        return null;
      }
    }
  }
  StorageProvider.i = true;

  class EventEmitter {
    constructor() {
      this.listeners = [];
      this.stack = [];
      this.stackMax = this.stackTop = 0;
    }
    addListener(a, b) {
      this.listeners.push(new EmitterListener(a, b));
      let c = this;
      return function () {
        c.removeListener(a, b);
      };
    }
    once(a, b) {
      this.addListener(a, b);
      this.listeners[this.listeners.length - 1].flags = 3;
    }
    removeListener(a, b) {
      let c = this.listeners;
      let d = 0;
      let e = c.length;
      while (d < e) {
        let f = c[d];
        if (f.type == a && f.listener == b) {
          f.flags = 0;
          c[d] = c[e - 1];
          c.pop();
          break;
        }
        ++d;
      }
    }
    emit(a, b) {
      var c = this.listeners;
      let d = c.length;
      let e = this.stack;
      let f = this.stackTop;
      let g = 0;
      let h = d;
      while (g < h) {
        e[f++] = c[g++];
      }
      if (f > this.stackMax) {
        this.stackMax = f;
      }
      for (this.stackTop = f; d > 0;) {
        c = e[--f];
        e[f] = null;
        if (c.type == a && c.flags > 0) {
          c.listener.apply(null, b);
          if (c.flags == 3) {
            c.flags = 0;
          }
        }
        --d;
      }
    }
  }
  EventEmitter.i = true;
  Object.assign(EventEmitter.prototype, {
    l: EventEmitter
  });

  class EventListenerRecord {
    constructor(a, b, c) {
      this.type = a;
      this.callback = b;
      this.once = c;
      this.next = null;
    }
  }
  EventListenerRecord.i = true;
  Object.assign(EventListenerRecord.prototype, {
    l: EventListenerRecord
  });

  class EmitterListener {
    constructor(a, b) {
      this.type = a;
      this.listener = b;
      this.flags = 1;
    }
  }
  EmitterListener.i = true;
  Object.assign(EmitterListener.prototype, {
    l: EmitterListener
  });

  class AsyncCallback {
    constructor(a, b) {
      this.id = a;
      this.callback = b;
    }
    fire() {
      this.callback(this.id);
      this.callback = null;
    }
  }
  AsyncCallback.i = true;
  Object.assign(AsyncCallback.prototype, {
    l: AsyncCallback
  });
  class Node {
    constructor() {
      this.O = Application.instance;
      this.listener = null;
      this.Sx = false;
      this.parent = this.Me = this.Y = null;
      this.zC = this.yC = false;
      this.name = null;
      this.time = 0;
      Node.qw.pushBack(this);
    }
    dispose() {
      if (this.O != null) {
        for (var a = this.Me; a != null;) {
          var b = a.Y;
          a.dispose();
          a = b;
        }
        if (this.parent != null) {
          this.remove();
        }
        for (a = this.listener; a != null;) {
          b = a.next;
          a.callback = null;
          a.next = null;
          a = b;
        }
        this.O = this.listener = null;
        Node.qw.swapPop(Node.qw.indexOf(this));
      }
    }
    remove() {
      if (this.parent != null) {
        Node.removeChild(this);
      }
    }
    iterator() {
      return new NodeTreeIter(this);
    }
    oa(a) {
      return this.appendChild(a);
    }
    add(a) {
      return this.appendChild(Construct.qA(a));
    }
    update(a) {
      if (this.O != null) {
        this.Sx = true;
        for (var b = this.Me, c; b != null;) {
          c = b.Y;
          if (!b.zC && b.O != null) {
            b.update(a);
            b.iq(a);
            b.time += a;
          }
          b = c;
        }
        this.time += a;
      }
    }
    iq() {}
    render(a) {
      if (this.O != null && this.Sx != 0) {
        for (var b = this.Me, c; b != null;) {
          c = b.Y;
          if (!b.yC && b.O != null) {
            b.render(a);
          }
          b = c;
        }
      }
    }
    Qr() {}
    jb(a) {
      return Math.min(1, this.time / a);
    }
    $n(a, b) {
      for (var c = this.parent; c != null;) {
        if (StdString.Xt(c, a)) {
          return c;
        }
        c = c.parent;
      }
      c = 1;
      let d = [this];
      while (c > 0) {
        let e = d[--c];
        let f = e.Me;
        while (f != null) {
          d[c++] = f;
          f = f.Y;
        }
        if (e != b && StdString.Xt(e, a)) {
          return e;
        }
      }
      return null;
    }
    appendChild(a) {
      a.parent = this;
      var b = this.Me;
      if (b != null) {
        while (b.Y != null) {
          b = b.Y;
        }
        b.Y = a;
      } else {
        this.Me = a;
      }
      a.Qr();
      return a;
    }
    static removeChild(a) {
      if (a == null || a.parent == null) {
        return false;
      }
      var b = a.parent;
      if (a == b.Me) {
        b.Me = a.Y;
      } else {
        for (b = b.Me; b != null;) {
          if (b.Y == a) {
            b.Y = a.Y;
            break;
          }
          b = b.Y;
        }
      }
      a.parent = a.Y = null;
      return true;
    }
  }
  Node.i = true;
  Object.assign(Node.prototype, {
    l: Node
  });
  class NodeTreeUtil {
    static Ov(a, b) {
      for (a = a.parent; a != null;) {
        if (a == b) {
          return true;
        }
        a = a.parent;
      }
      return false;
    }
    static Yf(a) {
      let b = NodeTreeUtil.yx;
      b.clear();
      for (b.reserve(SceneNode.count); a != null;) {
        b.N[b.Ga++] = a;
        a = a.parent;
      }
      a = b.N[--b.Ga];
      for (a.Fa.set(a.Db); b.Ga > 0;) {
        let c = b.N[--b.Ga];
        if ((c.flags & 64) <= 0) {
          if ((c.flags & 512) > 0) {
            c.Fa.cE(a.Fa, c.Db);
          } else {
            c.Fa.bE(a.Fa, c.Db);
          }
        }
        a = c;
      }
    }
    static CN(a, b) {
      let c = NodeTreeUtil.DS;
      c.reserve(SceneNode.count);
      var d = NodeTreeUtil.yx;
      d.reserve(SceneNode.count);
      d.clear();
      for (d.N[d.Ga++] = a; d.Ga > 0;) {
        a = d.N[--d.Ga];
        if (a.Ne != 1) {
          if ((a.flags & 2) > 0) {
            if (a.effect != null) {
              c.N[c.Ga++] = a;
            }
          } else if ((a.flags & 1) > 0) {
            for (a = a.children; a != null;) {
              d.N[d.Ga++] = a;
              a = a.Y;
            }
          }
        }
      }
      b.clear();
      b.reserve(c.Ga);
      d = 0;
      for (a = c.Ga; d < a;) {
        ++d;
        let e = c.N[--c.Ga];
        b.N[b.ba++] = e;
      }
    }
    static Fl(a, b, c) {
      let d = FLOAT_MAX;
      let e = FLOAT_MAX;
      let f = FLOAT_MIN;
      let g = FLOAT_MIN;
      let h = NodeTreeUtil.yx;
      h.reserve(SceneNode.count);
      h.clear();
      for (h.N[h.Ga++] = a; h.Ga > 0;) {
        a = h.N[--h.Ga];
        if ((a.flags & 2) > 0) {
          a.Fl(b, c);
          if (c.A < d) {
            d = c.A;
          }
          if (c.D < e) {
            e = c.D;
          }
          if (c.B > f) {
            f = c.B;
          }
          if (c.G > g) {
            g = c.G;
          }
        } else if ((a.flags & 1) > 0) {
          for (a = a.children; a != null;) {
            h.N[h.Ga++] = a;
            a = a.Y;
          }
        }
      }
      c.A = d;
      c.D = e;
      c.B = f;
      c.G = g;
      return c;
    }
    static cT(a, b, c) {
      let d = c.A;
      let e = c.D;
      let f = c.B;
      let g = c.G;
      let h = FLOAT_MAX;
      let m = FLOAT_MAX;
      let n = FLOAT_MIN;
      let q = FLOAT_MIN;
      let p = new Vec4(0, 0, 0, 1);
      if (b == a) {
        h = c.A;
        m = c.D;
        n = c.B;
        q = c.G;
      } else {
        if (b == a.parent) {
          b = a.Db;
          p.x = d;
          p.y = e;
          b.Jb(p, p);
          if (p.x < h) {
            h = p.x;
          }
          if (p.x > n) {
            n = p.x;
          }
          if (p.y < m) {
            m = p.y;
          }
          if (p.y > q) {
            q = p.y;
          }
          p.x = f;
          p.y = e;
          b.Jb(p, p);
          if (p.x < h) {
            h = p.x;
          }
          if (p.x > n) {
            n = p.x;
          }
          if (p.y < m) {
            m = p.y;
          }
          if (p.y > q) {
            q = p.y;
          }
          p.x = f;
          p.y = g;
          b.Jb(p, p);
          if (p.x < h) {
            h = p.x;
          }
          if (p.x > n) {
            n = p.x;
          }
          if (p.y < m) {
            m = p.y;
          }
          if (p.y > q) {
            q = p.y;
          }
          p.x = d;
          p.y = g;
          b.Jb(p, p);
        } else if (b.parent == null) {
          b = a.Fa;
          p.x = d;
          p.y = e;
          b.Jb(p, p);
          if (p.x < h) {
            h = p.x;
          }
          if (p.x > n) {
            n = p.x;
          }
          if (p.y < m) {
            m = p.y;
          }
          if (p.y > q) {
            q = p.y;
          }
          p.x = f;
          p.y = e;
          b.Jb(p, p);
          if (p.x < h) {
            h = p.x;
          }
          if (p.x > n) {
            n = p.x;
          }
          if (p.y < m) {
            m = p.y;
          }
          if (p.y > q) {
            q = p.y;
          }
          p.x = f;
          p.y = g;
          b.Jb(p, p);
          if (p.x < h) {
            h = p.x;
          }
          if (p.x > n) {
            n = p.x;
          }
          if (p.y < m) {
            m = p.y;
          }
          if (p.y > q) {
            q = p.y;
          }
          p.x = d;
          p.y = g;
          b.Jb(p, p);
        } else {
          a = a.Fa;
          b = b.Fa;
          p.x = d;
          p.y = e;
          a.Jb(p, p);
          b.gg(p, p);
          if (p.x < h) {
            h = p.x;
          }
          if (p.x > n) {
            n = p.x;
          }
          if (p.y < m) {
            m = p.y;
          }
          if (p.y > q) {
            q = p.y;
          }
          p.x = f;
          p.y = e;
          a.Jb(p, p);
          b.gg(p, p);
          if (p.x < h) {
            h = p.x;
          }
          if (p.x > n) {
            n = p.x;
          }
          if (p.y < m) {
            m = p.y;
          }
          if (p.y > q) {
            q = p.y;
          }
          p.x = f;
          p.y = g;
          a.Jb(p, p);
          b.gg(p, p);
          if (p.x < h) {
            h = p.x;
          }
          if (p.x > n) {
            n = p.x;
          }
          if (p.y < m) {
            m = p.y;
          }
          if (p.y > q) {
            q = p.y;
          }
          p.x = d;
          p.y = g;
          a.Jb(p, p);
          b.gg(p, p);
        }
        if (p.x < h) {
          h = p.x;
        }
        if (p.x > n) {
          n = p.x;
        }
        if (p.y < m) {
          m = p.y;
        }
        if (p.y > q) {
          q = p.y;
        }
      }
      return new Bounds(h, m, n, q);
    }
  }
  NodeTreeUtil.i = true;

  class DelayedCallback extends Node {
    constructor(a, b) {
      super();
      this.f = a;
      this.t = b;
    }
    update(a) {
      this.t -= a;
      if (!(this.t > 0)) {
        this.f();
        this.f = null;
        this.dispose();
      }
    }
  }
  DelayedCallback.i = true;
  DelayedCallback.s = Node;
  Object.assign(DelayedCallback.prototype, {
    l: DelayedCallback
  });
  class SceneState extends Node {
    constructor() {
      super();
      this.name = this.getName();
      this.Ha = {};
      this.caller = null;
      this.De = "New";
      this.xb("New");
      this.node = new SceneRoot();
      this.node.Ne = 1;
      this.ud = null;
    }
    dO() {
      return this.De == "Running";
    }
    $(a) {
      this.fa.hq(a, this, false);
    }
    Dg(a) {
      this.fa.hq(a, this, true);
    }
    Kf(a) {
      let b = this;
      if (a != null) {
        let c = this.iterator();
        while (c.top > 0) {
          let d = c.stack[--c.top];
          c.push(d);
          if (StdString.Xt(d, a)) {
            b = d;
          }
        }
      }
      this.fa.Kf(b);
    }
    replacesPrevious() {
      return true;
    }
    getPreloads() {
      return [];
    }
    eB() {
      let a = [];
      let b = 0;
      let c = this.getPreloads();
      while (b < c.length) {
        let d = c[b];
        ++b;
        if ((!Loader.Lv(d) || Loader.OA() != null) && !Loader.ob(d)) {
          a.push(d);
        }
      }
      return a;
    }
    aB(a) {
      return new ScenePreloadState(this, a);
    }
    Oj() {
      return 0;
    }
    getTransitionDuration() {
      return 0;
    }
    dispose() {
      super.dispose();
      this.xb("Destroyed");
      if (this.node != null) {
        this.node.free();
      }
      this.node = null;
    }
    update(a) {
      super.update(a);
      this.node.tickAnims(a);
    }
    render(a) {
      super.render(a);
      this.node.Gd();
      this.node.Um();
      this.O.V.Iq(this.node);
    }
    init() {}
    onShown() {}
    start() {}
    Oc() {}
    layout() {}
    transitionIn(a) {
      this.Ks(Easing.quadOut()(a));
    }
    transitionOut(a) {
      this.Ks(1 - a);
    }
    xb(a) {
      switch (a) {
        case "Created":
          this.node.Ne = 0;
          this.Ks(0);
          break;
        case "Stopped":
          this.node.Ne = 1;
      }
      this.De = a;
    }
    Ks(a) {
      this.mi().bf(a);
    }
    mi() {
      let a = this.node.li(5);
      if (a == null) {
        a = new AlphaState(0);
      }
      this.node.Bh(a);
      return a;
    }
    SN() {
      if (this.ud.parent instanceof SceneDirector) {
        return null;
      } else {
        return this.ud.parent.Pf;
      }
    }
    getName() {
      return "SceneState";
    }
  }
  SceneState.i = true;
  SceneState.s = Node;
  Object.assign(SceneState.prototype, {
    l: SceneState
  });
  class Scene extends SceneState {
    constructor() {
      super();
      this.buttons = [null];
      this.pointer = new ButtonInputState();
      this.cd = this.fh = this.rd = this.ih = this.ra = null;
    }
    createTexture(a) {
      if (Resources.bm[a] != null) {
        return Resources.bm[a];
      }
      let b = this.O.createTexture(a, 8);
      return Resources.bm[a] = b;
    }
    ia(a) {
      let b = Resources.bm[a];
      if (b != null) {
        Application.instance.V.ia(b);
        Application.instance.NM(a);
        Resources.bm[a] = null;
      }
    }
    $k() {
      let a = ButtonBase.create(null, Keys.tK, Keys.uK);
      this.node.P(a.j.u);
      this.buttons[0] = a;
    }
    Ke(a, b) {
      this.rd = new Vec4(a, b, 0, 1);
      this.ra = new Container("fix");
      this.node.P(this.ra.u);
    }
    sj() {
      if (Resources.cd == null) {
        Resources.cd = this.createTexture(Loader.menuShadow);
      }
      this.cd = new Sprite(null, Resources.cd);
      this.node.P(this.cd.u);
      this.cd.la(X.Yn(0, 360));
    }
    Vg() {
      this.Ea = new Sprite(null, Resources.Ea);
      this.node.P(this.Ea.u);
    }
    Nd() {
      if (Loader.ob(Loader.fontImg)) {
        Resources.ki = this.createTexture(Loader.fontImg);
        var a = Resources.ov(Save.language, Save.language);
        Resources.ic = Resources.ki.children[a];
        Resources.ji = Resources.ki.children[a + 1];
      }
      if (Loader.ob(Loader.loaderImg)) {
        Resources.Yl = this.createTexture(Loader.loaderImg);
      }
      a = WebApplication.xmasMode ? Loader.menuBgXmas : Loader.menuBg;
      if (Loader.ob(a)) {
        Resources.Ea = this.createTexture(a);
      }
      if (Loader.ob(Loader.menuUi)) {
        Resources.Wa = this.createTexture(Loader.menuUi);
      }
      if (Loader.ob(Loader.menuCut)) {
        Resources.yc = this.createTexture(Loader.menuCut);
      }
    }
    aB(a) {
      return new BubbleLoadingOverlay(this, a);
    }
    init() {
      this.Nd();
      if (Scene.Zt == null) {
        Scene.Zt = new ColorRectShape(null, new Vec4(0, 0, 0, 1));
        this.fa.front.P(Scene.Zt.u);
      }
      this.fh = Scene.Zt;
    }
    onShown() {
      super.onShown();
      this.layout();
    }
    layout() {
      var a = this.fa.getWidth();
      var b = this.fa.getHeight();
      let c = this.fa.dr();
      if (this.rd != null) {
        this.ih = c.hi(this.rd.x / this.rd.y);
        this.ra.setX(this.ih.A);
        this.ra.setY(this.ih.D);
        var d = this.ih;
        this.ra.setUniformScale((d.B - d.A) / this.rd.x);
      }
      if (this.If != null) {
        this.If.setX(this.fa.getWidth() - this.If.getWidth());
        this.If.setY(this.fa.getHeight() - this.If.getHeight());
      }
      d = this.buttons[0];
      if (d != null) {
        var e = c.hi(this.rd.x / this.rd.y);
        d.j.setUniformScale((e.B - e.A) * 0.2 / d.ec.x);
        d.setX(10);
        d.setY(this.fa.getHeight() - d.j.getHeight() - 10);
      }
      if (this.Ea != null) {
        e = Resources.Ea.size;
        d = a / e.x;
        e = b / e.y;
        this.oN = d > e;
        this.Ea.setUniformScale(Math.max(d, e));
        this.Ea.setX(this.fa.getWidth() / 2);
        d = this.Ea;
        d.setX(d.getX() - this.Ea.getWidth() / 2);
        this.Ea.setY(0);
      }
      if (this.cd != null) {
        this.cd.center();
        this.cd.uS(new Vec4((c.A + c.B) / 2, (c.D + c.G) / 2, 0, 1));
        this.cd.setUniformScale((c.B - c.A) / 260);
        a = Math.max(a, b) / 2;
        a = Math.sqrt(a * 2 * a) * 2 / Resources.cd.size.x;
        if (this.cd.Ra < a) {
          this.cd.setUniformScale(a);
        }
        a = 1 / this.fa.Se();
        if (a < 1) {
          b = this.cd;
          b.setUniformScale(b.Ra * a);
        }
        a = this.cd;
        a.setUniformScale(a.Ra * 2);
      }
    }
    update(a) {
      super.update(a);
      if (this.dO()) {
        this.pointer.resetHover();
        this.PR();
        this.Pd(a);
        this.pointer.fi();
        let b = 0;
        let c = this.buttons;
        while (b < c.length) {
          let d = c[b];
          ++b;
          if (d != null) {
            d.update(a);
          }
        }
      }
      if (this.cd != null) {
        a = this.cd;
        a.la(a.Zd + 0.1);
      }
    }
    getTransitionDuration() {
      return 0.5;
    }
    transitionIn(a) {
      this.fh.W(1 - a);
    }
    transitionOut(a) {
      this.fh.W(a);
    }
    PR() {
      var a = this.O.hd();
      this.pointer.pressed = a.Nb(0);
      this.pointer.released = a.qe(0);
      a = a.position[0];
      var b = a.x;
      var c = a.y;
      a = this.O.V.Ab;
      let d = this.O.window.lo();
      b = -1 + (b - d.x) * 2 / d.w;
      c = -1 + (d.y - c) * 2 / d.J;
      a = a.Kv;
      a = new Vec4(a.m11 * b + a.m12 * c + a.m14, a.m21 * b + a.m22 * c + a.m24, 0, 1);
      if (a != null) {
        b = this.pointer.pos;
        b.x = a.x;
        b.y = a.y;
      }
    }
    Jl() {
      let a = 0;
      let b = this.buttons;
      while (a < b.length) {
        let c = b[a];
        ++a;
        if (c != null) {
          c.j.L(false);
        }
      }
    }
    wS() {
      let a = 0;
      let b = this.buttons;
      while (a < b.length) {
        let c = b[a];
        ++a;
        if (c != null) {
          c.j.L(true);
        }
      }
    }
    Pd() {}
    hb(a) {
      let b = this.buttons[a];
      if (b == null || this.De != "Running" || b.SO || !b.ri()) {
        return false;
      }
      let c = false;
      if (a == 0) {
        var d = this.O.jd ? 461 : -1;
        d = this.O.lh().Nb(d);
      } else {
        d = false;
      }
      if (this.pointer.poll(a, b) || d) {
        b.select();
        c = true;
      }
      b.$w(this.pointer.isHovered(a));
      b.setActive(this.pointer.isActive(a));
      if (c) {
        SoundFx.play(SoundFx.button);
      }
      return c;
    }
    Ks() {}
    yb(a, ...b) {
      return Strings.get(a, b.length > 0 ? b.slice() : null);
    }
    cr(...a) {
      let b = [];
      let c = 0;
      while (c < a.length) {
        b.push(Strings.get(a[c++]));
      }
      return b;
    }
    sm() {
      this.O.Sa.stop(WebApplication.gameMusicId);
      this.ZC(WebApplication.menuMusicId);
    }
    FQ() {
      this.O.Sa.stop(WebApplication.menuMusicId);
      this.ZC(WebApplication.gameMusicId);
    }
    ZC(a) {
      let b = this.O.Sa;
      b.Sf(Save.Ec ? 1 : 0);
      if (!b.Dc(a)) {
        b.play(a, true);
        this.O.Nu = a;
      }
    }
    Uq() {
      let a = this.O.Sa;
      if (a.Dc(WebApplication.menuMusicId)) {
        a.Zn(WebApplication.menuMusicId, 0.5, true);
      }
      if (a.Dc(WebApplication.gameMusicId)) {
        a.Zn(WebApplication.gameMusicId, 0.5, true);
      }
    }
    JD() {
      let a = this;
      if (Audio.no() && !Scene.salutePlayed && Loader.ob(Loader.menuSalute)) {
        this.If = new Sprite(null, this.createTexture(Loader.menuSalute), "0000");
        this.If.setUniformScale(this.O.window.bp);
        if (!this.O.Vj) {
          this.If.setUniformScale(this.O.window.Pj());
        }
        this.fa.front.P(this.If.u);
        this.If.pa().play(Keys.Pa(null, 0, 53, 30)).Be(function () {
          a.If.free();
          a.If = null;
          a.ia(Loader.menuSalute);
        });
        SoundFx.play(SoundFx.salute);
        Scene.salutePlayed = true;
        this.layout();
      }
    }
    eF() {
      let a = 0;
      while (a < 17) {
        let b = a++;
        this.ia([194, 189, 184, 179, 174, 169, 164, 158, 153, 148, 143, 138, 133, 128, 123, 118, 113][b]);
        this.ia([196, 191, 186, 181, 176, 171, 166, 161, 155, 150, 145, 140, 135, 130, 125, 120, 115][b]);
        this.ia([198, 193, 188, 183, 178, 173, 168, 163, 157, 152, 147, 142, 137, 132, 127, 122, 117][b]);
      }
      Resources.wq = null;
      Resources.xj = null;
      Resources.uu = null;
      this.ia(Loader.objBubble);
      Resources.ca = null;
      this.ia(Loader.objSpikes);
      Resources.Dd = null;
      this.ia(Loader.objPump);
      Resources.wm = null;
      this.ia(Loader.objSpider);
      Resources.mc = null;
      this.ia(Loader.objElectro);
      Resources.ce = null;
      this.ia(Loader.objSock);
      Resources.Dk = null;
      this.ia(Loader.objBouncer);
      Resources.fd = null;
      this.ia(Loader.objGravity);
      Resources.Kb = null;
      this.ia(Loader.objGravity);
      Resources.gl = null;
      this.ia(Loader.objVinyl);
      Resources.Tc = null;
      this.ia(Loader.objSteam);
      Resources.Kk = null;
      this.ia(Loader.objLantern);
      Resources.Ai = null;
      this.ia(Loader.objGap);
      Resources.wf = null;
      this.ia(Loader.objLighter);
      Resources.Ef = null;
      this.ia(Loader.objTransporter);
      Resources.Rc = null;
      this.ia(Loader.objLighter);
      Resources.Ef = null;
      this.ia(Loader.char3);
      Resources.ml = null;
    }
    Mp(a) {
      function b(d) {
        return (BOX_OBJECT_FLAGS[a - 1] & d) == 0;
      }
      let c = a - 1;
      this.ia([194, 189, 184, 179, 174, 169, 164, 158, 153, 148, 143, 138, 133, 128, 123, 118, 113][c]);
      this.ia([196, 191, 186, 181, 176, 171, 166, 161, 155, 150, 145, 140, 135, 130, 125, 120, 115][c]);
      this.ia([198, 193, 188, 183, 178, 173, 168, 163, 157, 152, 147, 142, 137, 132, 127, 122, 117][c]);
      Resources.wq = null;
      Resources.xj = null;
      Resources.uu = null;
      if (Resources.ca != null && b(1)) {
        this.ia(Loader.objBubble);
        Resources.ca = null;
      }
      if (Resources.Dd != null && b(2)) {
        this.ia(Loader.objSpikes);
        Resources.Dd = null;
      }
      if (Resources.wm != null && b(4)) {
        this.ia(Loader.objPump);
        Resources.wm = null;
      }
      if (Resources.mc != null && b(8)) {
        this.ia(Loader.objSpider);
        Resources.mc = null;
      }
      if (Resources.ce != null && b(64)) {
        this.ia(Loader.objElectro);
        Resources.ce = null;
      }
      if (Resources.Dk != null && b(128)) {
        this.ia(Loader.objSock);
        Resources.Dk = null;
      }
      if (Resources.fd != null && b(512)) {
        this.ia(Loader.objBouncer);
        Resources.fd = null;
      }
      if (Resources.Kb != null && b(2048)) {
        this.ia(Loader.objGravity);
        Resources.Kb = null;
      }
      if (Resources.gl != null && b(4096)) {
        this.ia(Loader.objGravity);
        Resources.gl = null;
      }
      if (Resources.Tc != null && b(16384)) {
        this.ia(Loader.objVinyl);
        Resources.Tc = null;
      }
      if (Resources.Kk != null && b(65536)) {
        this.ia(Loader.objSteam);
        Resources.Kk = null;
      }
      if (Resources.Ai != null && b(131072)) {
        this.ia(Loader.objLantern);
        Resources.Ai = null;
      }
      if (Resources.wf != null && b(262144)) {
        this.ia(Loader.objGap);
        Resources.wf = null;
      }
      if (Resources.Ef != null && b(524288)) {
        this.ia(Loader.objLighter);
        Resources.Ef = null;
      }
      if (Resources.Rc != null && b(1048576)) {
        this.ia(Loader.objTransporter);
        Resources.Rc = null;
      }
      if (Resources.Ef != null && b(524288)) {
        this.ia(Loader.objLighter);
        Resources.Ef = null;
        this.ia(Loader.char3);
        Resources.ml = null;
      }
    }
    getName() {
      return "AbstractScene";
    }
  }
  Scene.i = true;
  Scene.s = SceneState;
  Object.assign(Scene.prototype, {
    l: Scene
  });
  class SceneWrapper extends Node {
    constructor(a) {
      super();
      this.Pf = a;
      a.ud = this;
      a.zC = true;
      a.yC = true;
      this.oa(a);
    }
    update(a) {
      switch (this.Pf.De) {
        case "Paused":
        case "Running":
        case "Started":
          break;
        default:
          return;
      }
      if (this.O.window.Nw) {
        this.Pf.layout();
      }
      this.Pf.update(a);
      this.Pf.iq(a);
      super.update(a);
    }
    render(a) {
      if (this.Pf.Sx) {
        switch (this.Pf.De) {
          case "Paused":
          case "Running":
          case "Started":
            this.Pf.render(a);
        }
      }
      super.render(a);
    }
  }
  SceneWrapper.i = true;
  SceneWrapper.s = Node;
  Object.assign(SceneWrapper.prototype, {
    l: SceneWrapper
  });
  class SceneTransition extends Node {
    constructor(a, b) {
      super();
      this.a = a;
      this.b = b;
      this.state = 0;
    }
    qN(a, b) {
      for (a = a.ud.parent; a != null && !(a instanceof SceneDirector);) {
        b(a.Pf);
        a = a.parent;
      }
    }
    Il(a) {
      if (a.ud.parent == a.fa) {
        return a;
      }
      let b = a.ud.parent;
      while (b != null) {
        if (b.parent == a.fa) {
          return b.Pf;
        }
        b = b.parent;
      }
      return null;
    }
    Oj(a) {
      if (a.O.config.nF) {
        return a.Oj();
      } else {
        return 0;
      }
    }
    getTransitionDuration(a, b) {
      if (a.O.config.transition) {
        return a.getTransitionDuration(b);
      } else {
        return 0;
      }
    }
    setState(a) {
      this.state = a;
      this.time = 0;
    }
  }
  SceneTransition.i = true;
  SceneTransition.s = Node;
  Object.assign(SceneTransition.prototype, {
    l: SceneTransition
  });

  class ScenePreloadState extends SceneState {
    constructor(a, b) {
      super();
      this.mm = b;
      this.NP = a.eB();
      this.Zl = this.O.load(this.NP);
    }
    er() {
      return this.Zl.er();
    }
    update(a) {
      super.update(a);
      if (this.Zl.xv() && this.De == "Running") {
        this.gx();
      }
    }
    replacesPrevious() {
      return false;
    }
    gx() {
      this.fa.oa(new TransitionPopBack(this, false, this.mm));
    }
    getName() {
      return "LoadingOverlay";
    }
  }
  ScenePreloadState.i = true;
  ScenePreloadState.s = SceneState;
  Object.assign(ScenePreloadState.prototype, {
    l: ScenePreloadState
  });

  class BubbleLoadingOverlay extends ScenePreloadState {
    constructor(a, b) {
      super(a, b);
    }
    init() {
      super.init();
      Resources.Yl = Application.instance.createTexture(Loader.loaderImg, 8);
      this.ca = new Container();
      this.node.P(this.ca.u);
      let a = new Sprite(null, Resources.Yl.children[0], "bubble");
      let b = Math.min(this.fa.getWidth(), this.fa.getHeight()) / a.X.x * 0.25;
      this.ca.setUniformScale(b);
      this.ca.appendChild(a);
      a.center();
      this.text = new TextNode(this.ca, Resources.Yl.children[1]);
      this.text.setText("100%");
      this.text.setBoxSize(a.X.x, a.X.y);
      this.text.setAlign(0, 0);
      this.text.setMultiline(false);
      this.text.setText("0%");
      this.text.setX(-a.X.x / 2);
      this.text.setY(-a.X.y / 2);
      this.text.setFontSize(this.text.$q() * 0.7);
      this.ak = this.wd = 0;
      this.tj = Math.random() * PI * 2;
      this.uj = Math.random() * PI * 2;
      this.Ek = Math.random() * 0.1 - 0.05;
      this.Fk = Math.random() * 0.1 - 0.05;
    }
    update(a) {
      super.update(a);
      this.time += a;
      this.ca.setX(this.fa.getWidth() / 2);
      this.ca.setY(this.fa.getHeight() / 2);
      var b = Math.cos(this.tj) * 50;
      a = Math.sin(this.uj) * 50;
      this.tj += this.Ek;
      this.uj += this.Fk;
      let c = this.ca;
      c.setX(c.getX() + b);
      b = this.ca;
      b.setY(b.getY() + a);
      // Loading overlay used to crawl a fake % counter (5 per frame)
      // and then sit on 100% for an extra half-second before dismissing.
      // Now: show real progress directly. The parent's update() handles
      // the actual dismissal via `gx()` once the overlay is fully
      // pushed in (De == "Running") AND loading is done - see
      // ScenePreloadState.update. We no longer override gx() to a
      // no-op, so the inherited TransitionPopBack fires automatically.
      this.wd = this.er() | 0;
      this.text.setText("" + this.wd + "%");
    }
    getTransitionDuration() {
      return 0.25;
    }
    getName() {
      return "LoadingOverlay";
    }
  }
  BubbleLoadingOverlay.i = true;
  BubbleLoadingOverlay.s = ScenePreloadState;
  Object.assign(BubbleLoadingOverlay.prototype, {
    l: BubbleLoadingOverlay
  });
  class SceneDirector extends Node {
    constructor(a) {
      super();
      this.O = a;
      this.Ha = {};
      this.back = new SceneRoot();
      this.front = new SceneRoot();
      this.Ab = new Camera();
    }
    getWidth() {
      return this.O.window.pi().x;
    }
    getHeight() {
      return this.O.window.pi().y;
    }
    lB() {
      return this.O.window.pi();
    }
    dr() {
      let a = this.O.window.pi();
      return new Bounds(0, 0, a.x, a.y);
    }
    Se() {
      return this.O.window.bo();
    }
    update(a) {
      this.Ab.Lb(new Vec4(this.getWidth(), this.getHeight(), 0, 1));
      this.O.V.wk(this.Ab);
      this.back.tickAnims(a);
      super.update(a);
      this.front.tickAnims(a);
    }
    render(a) {
      let b = this.O.V;
      this.Ab.Lb(new Vec4(this.getWidth(), this.getHeight(), 0, 1));
      b.wk(this.Ab);
      this.back.Gd();
      this.back.Um();
      b.Iq(this.back);
      super.render(a);
      this.front.Gd();
      this.front.Um();
      b.Iq(this.front);
    }
    hq(a, b, c) {
      function d() {
        if (c) {
          b.ud.oa(new SceneWrapper(e));
          return g.oa(new TransitionPushOver(b, e));
        }
        let h = new SceneWrapper(e);
        g.oa(h);
        if (f == null) {
          return g.oa(new TransitionPush(e));
        } else {
          return g.oa(new TransitionReplace(b, e));
        }
      }
      let e = Construct.qA(a);
      e.fa = this;
      e.O = this.O;
      e.caller = b;
      if (b == null) {
        e.Ha = this.Ha;
      }
      let f = this.mN();
      let g = this;
      if (e.eB().length > 0) {
        a = e.aB(d);
        a.fa = this;
        a.O = this.O;
        // Skip the bubble loading overlay entirely if every preload
        // was already cached. eB() drops fully-loaded ids, but if any
        // remain unfetched ScriptDownload still hits the network. In
        // the common warmed-up case xv() reports done at construction
        // and the only thing the overlay would contribute is a ~0.5s
        // fade in + fade out - which is exactly what looks "fake".
        if (a.Zl != null && a.Zl.xv()) {
          d();
        } else {
          let h = new SceneWrapper(a);
          if (f == null) {
            this.oa(h);
            this.oa(new TransitionPush(a));
          } else {
            b.ud.oa(h);
            this.oa(new TransitionPushOver(b, a));
          }
        }
      } else {
        d();
      }
    }
    Kf(a) {
      if ((a.ud.parent instanceof SceneDirector ? null : a.ud.parent) == null) {
        this.oa(new TransitionExit(a));
      } else {
        a.ud.parent.Pf.caller = a;
        this.oa(new TransitionPopBack(a));
      }
    }
    mN() {
      let a = this.Me;
      while (a != null) {
        if (a instanceof SceneWrapper) {
          return a;
        }
        a = a.Y;
      }
      return null;
    }
  }
  SceneDirector.i = true;
  SceneDirector.s = Node;
  Object.assign(SceneDirector.prototype, {
    l: SceneDirector
  });
  class RenderState {
    constructor(a) {
      this.type = a;
      this.cb = 0;
      this.Xr = null;
    }
    set() {}
    collapse() {
      return this;
    }
  }
  RenderState.i = true;
  Object.assign(RenderState.prototype, {
    l: RenderState
  });
  class ClipState extends RenderState {
    constructor() {
      super(1);
      this.va = null;
      this.FO = false;
      this.Gu = null;
      this.cb = ClipState.next++;
    }
    set(a) {
      a.hx(this);
    }
    fS(a) {
      let b = a.A;
      let c = a.D;
      let d = a.B - a.A;
      a = a.G - a.D;
      this.Gu = [new Vec4(b, c, 0, 1), new Vec4(b, c + a, 0, 1), new Vec4(b + d, c + a, 0, 1), new Vec4(b + d, c, 0, 1)];
    }
  }
  ClipState.i = true;
  ClipState.s = RenderState;
  Object.assign(ClipState.prototype, {
    l: ClipState
  });
  class AlphaState extends RenderState {
    constructor(a) {
      super(5);
      this.Xk = 1;
      this.collapsed = null;
      this.bf(a);
    }
    bf(a) {
      this.Xk = a < 0 ? 0 : a > 1 ? 1 : a;
      this.cb = this.Xk * 65535 | 0;
    }
    set(a) {
      a.jx(this);
    }
    collapse(a) {
      if (a.Ga == 1) {
        return this;
      }
      let b = a.top().Xk;
      let c = a.Ga - 2;
      while (c > -1) {
        b *= a.N[c--].Xk;
      }
      if (this.collapsed == null) {
        this.collapsed = new AlphaState(b);
      } else {
        this.collapsed.bf(b);
      }
      return this.collapsed;
    }
  }
  AlphaState.i = true;
  AlphaState.s = RenderState;
  Object.assign(AlphaState.prototype, {
    l: AlphaState
  });

  class BlendModeState extends RenderState {
    constructor(a, b) {
      if (b == null) {
        b = true;
      }
      super(0);
      this.Zg = a;
      this.cb = this.cb & -16 | a;
      this.QQ = b;
      this.cb &= -65537;
      if (b) {
        this.cb |= 65536;
      }
      this.blendEquation = 1;
      this.cb = this.cb & -61441 | 4096;
      this.wA = this.kE = 0;
    }
    set(a) {
      a.Uw(this);
    }
  }
  BlendModeState.i = true;
  BlendModeState.s = RenderState;
  Object.assign(BlendModeState.prototype, {
    l: BlendModeState
  });
  class ScissorState extends RenderState {
    constructor(a, b) {
      if (b == null) {
        b = 1;
      }
      super(4);
      this.zz = b;
      this.rn = a;
      this.mx(a);
      this.sS(b);
    }
    mx(a) {
      this.cb &= -257;
      if (a) {
        this.cb |= 256;
      }
      this.rn = a;
    }
    sS(a) {
      this.cb = this.cb & -256 | 1 << a;
      this.zz = a;
    }
    set(a) {
      a.PD(this);
    }
  }
  ScissorState.i = true;
  ScissorState.s = RenderState;
  Object.assign(ScissorState.prototype, {
    l: ScissorState
  });
  class DepthTestState extends RenderState {
    constructor(a, b) {
      if (b == null) {
        b = true;
      }
      super(3);
      this.rn = a;
      this.yL = b;
      this.mx(a);
      this.rS(b);
    }
    rS(a) {
      this.cb = (this.cb &= -3) | (a ? 2 : 0);
    }
    mx(a) {
      this.cb = (this.cb &= -2) | (a ? 1 : 0);
      this.rn = a;
    }
    set(a) {
      a.QD(this);
    }
  }
  DepthTestState.i = true;
  DepthTestState.s = RenderState;
  Object.assign(DepthTestState.prototype, {
    l: DepthTestState
  });
  class PassThroughState extends RenderState {
    constructor() {
      super(3);
    }
    set() {}
  }
  PassThroughState.i = true;
  PassThroughState.s = RenderState;
  Object.assign(PassThroughState.prototype, {
    l: PassThroughState
  });

  class StateNode {
    constructor(a) {
      this.state = a;
    }
  }
  StateNode.i = true;
  Object.assign(StateNode.prototype, {
    l: StateNode
  });
  class SceneTransform {
    constructor() {
      this.qB = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.Ue = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.K = 15;
      this.scale = new Vec4(1, 1, 1, 1);
      this.translate = new Vec4(0, 0, 0, 1);
      this.matrix = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    set(a) {
      var b = this.translate;
      var c = a.translate;
      b.x = c.x;
      b.y = c.y;
      b.z = c.z;
      b = this.scale;
      c = a.scale;
      b.x = c.x;
      b.y = c.y;
      b.z = c.z;
      b = this.matrix;
      c = a.matrix;
      b.m11 = c.m11;
      b.m12 = c.m12;
      b.m13 = c.m13;
      b.m21 = c.m21;
      b.m22 = c.m22;
      b.m23 = c.m23;
      b.m31 = c.m31;
      b.m32 = c.m32;
      b.m33 = c.m33;
      this.K = a.K | 240;
    }
    Tw(a) {
      this.translate.x = a.translate.x;
      this.translate.y = a.translate.y;
      this.scale.x = a.scale.x;
      this.scale.y = a.scale.y;
      let b = this.matrix;
      let c = a.matrix;
      b.m11 = c.m11;
      b.m12 = c.m12;
      b.m21 = c.m21;
      b.m22 = c.m22;
      this.K = a.K | 240;
    }
    RD() {
      let a = this.matrix;
      a.m11 = 1;
      a.m12 = 0;
      a.m21 = 0;
      a.m22 = 1;
      this.K |= 506;
    }
    PN() {
      let a;
      let b;
      if ((this.K & 8) > 0) {
        a = Math.abs(this.scale.x);
        b = Math.abs(this.scale.y);
        var c = Math.abs(this.scale.z);
      } else {
        c = this.matrix;
        a = Math.abs(c.m11) + Math.abs(c.m12) + Math.abs(c.m13);
        b = Math.abs(c.m21) + Math.abs(c.m22) + Math.abs(c.m23);
        c = Math.abs(c.m31) + Math.abs(c.m32) + Math.abs(c.m33);
      }
      return Math.max(Math.max(a, b), c);
    }
    bE(a, b) {
      let c = a.K;
      let d = b.K;
      if ((c & 1) > 0) {
        this.set(b);
      } else if ((d & 1) > 0) {
        this.set(a);
      } else if ((c & 12) == 12 && (d & 8) > 0) {
        if ((c & 2) > 0) {
          let f = b.matrix;
          let g = this.matrix;
          g.m11 = f.m11;
          g.m12 = f.m12;
          g.m13 = f.m13;
          g.m21 = f.m21;
          g.m22 = f.m22;
          g.m23 = f.m23;
          g.m31 = f.m31;
          g.m32 = f.m32;
          g.m33 = f.m33;
        } else if ((d & 2) > 0) {
          let f = a.matrix;
          let g = this.matrix;
          g.m11 = f.m11;
          g.m12 = f.m12;
          g.m13 = f.m13;
          g.m21 = f.m21;
          g.m22 = f.m22;
          g.m23 = f.m23;
          g.m31 = f.m31;
          g.m32 = f.m32;
          g.m33 = f.m33;
        } else {
          let f = a.matrix;
          let g = b.matrix;
          let h = g.m11;
          let m = g.m12;
          let n = g.m13;
          let q = g.m21;
          let p = g.m22;
          let v = g.m23;
          let u = g.m31;
          let A = g.m32;
          let D = g.m33;
          let B = f.m11 * m + f.m12 * p + f.m13 * A;
          let K = f.m11 * n + f.m12 * v + f.m13 * D;
          let E = f.m21 * m + f.m22 * p + f.m23 * A;
          let v88 = f.m21 * n + f.m22 * v + f.m23 * D;
          let v89 = f.m31 * m + f.m32 * p + f.m33 * A;
          let V = f.m31 * n + f.m32 * v + f.m33 * D;
          let v90 = this.matrix;
          v90.m11 = f.m11 * h + f.m12 * q + f.m13 * u;
          v90.m12 = B;
          v90.m13 = K;
          v90.m21 = f.m21 * h + f.m22 * q + f.m23 * u;
          v90.m22 = E;
          v90.m23 = v88;
          v90.m31 = f.m31 * h + f.m32 * q + f.m33 * u;
          v90.m32 = v89;
          v90.m33 = V;
        }
        this.K = this.K & -4 | 248;
        let e = a.scale.x;
        if ((c & 2) > 0) {
          let f = a.scale.x;
          let g = b.translate;
          let h = a.translate;
          this.translate.x = g.x * f + h.x;
          this.translate.y = g.y * f + h.y;
          this.translate.z = g.z * f + h.z;
        } else {
          let f = a.scale.x;
          let g = a.matrix;
          let h = b.translate;
          let m = h.x;
          let n = h.y;
          let q = h.z;
          let p = a.translate;
          this.translate.x = (g.m11 * m + g.m12 * n + g.m13 * q) * f + p.x;
          this.translate.y = (g.m21 * m + g.m22 * n + g.m23 * q) * f + p.y;
          this.translate.z = (g.m31 * m + g.m32 * n + g.m33 * q) * f + p.z;
        }
        this.K = this.K & -2 | 240;
        if ((d & 4) > 0) {
          this.scale.x = this.scale.y = this.scale.z = e * b.scale.x;
          this.K = this.K & -2 | 244;
        } else {
          let f = b.scale;
          this.scale.x = f.x * e;
          this.scale.y = f.y * e;
          this.scale.z = f.z * e;
          this.K = this.K & -6 | 240;
        }
      } else {
        if ((c & 8) > 0 && (d & 8) > 0) {
          let e = a.matrix;
          let f = a.scale;
          let g = f.x;
          let h = f.y;
          let m = f.z;
          let n = e.m11 * g;
          let q = e.m12 * h;
          let p = e.m13 * m;
          let v = e.m21 * g;
          let u = e.m22 * h;
          let A = e.m23 * m;
          let D = e.m31 * g;
          let B = e.m32 * h;
          let K = e.m33 * m;
          let E = b.matrix;
          let v91 = b.scale;
          let v92 = v91.x;
          let V = v91.y;
          let v93 = v91.z;
          let v94 = E.m11 * v92;
          let v95 = E.m12 * V;
          let v96 = E.m13 * v93;
          let v97 = E.m21 * v92;
          let v98 = E.m22 * V;
          let v99 = E.m23 * v93;
          let v100 = E.m31 * v92;
          let v101 = E.m32 * V;
          let v102 = E.m33 * v93;
          let v103 = this.matrix;
          v103.m11 = n * v94 + q * v97 + p * v100;
          v103.m12 = n * v95 + q * v98 + p * v101;
          v103.m13 = n * v96 + q * v99 + p * v102;
          v103.m21 = v * v94 + u * v97 + A * v100;
          v103.m22 = v * v95 + u * v98 + A * v101;
          v103.m23 = v * v96 + u * v99 + A * v102;
          v103.m31 = D * v94 + B * v97 + K * v100;
          v103.m32 = D * v95 + B * v98 + K * v101;
          v103.m33 = D * v96 + B * v99 + K * v102;
          this.K = 240;
          let v104 = b.translate;
          let v105 = v104.x;
          let v106 = v104.y;
          let v107 = v104.z;
          let v108 = a.translate;
          this.translate.x = n * v105 + q * v106 + p * v107 + v108.x;
          this.translate.y = v * v105 + u * v106 + A * v107 + v108.y;
          this.translate.z = D * v105 + B * v106 + K * v107 + v108.z;
        } else if ((c & 8) > 0) {
          let e = a.matrix;
          let f = a.scale;
          let g = f.x;
          let h = f.y;
          let m = f.z;
          let n = e.m11 * g;
          let q = e.m12 * h;
          let p = e.m13 * m;
          let v = e.m21 * g;
          let u = e.m22 * h;
          let A = e.m23 * m;
          let D = e.m31 * g;
          let B = e.m32 * h;
          let K = e.m33 * m;
          let E = b.matrix;
          let v109 = E.m11;
          let v110 = E.m12;
          let V = E.m13;
          let v111 = E.m21;
          let v112 = E.m22;
          let v113 = E.m23;
          let v114 = E.m31;
          let v115 = E.m32;
          let v116 = E.m33;
          let v117 = this.matrix;
          v117.m11 = n * v109 + q * v111 + p * v114;
          v117.m12 = n * v110 + q * v112 + p * v115;
          v117.m13 = n * V + q * v113 + p * v116;
          v117.m21 = v * v109 + u * v111 + A * v114;
          v117.m22 = v * v110 + u * v112 + A * v115;
          v117.m23 = v * V + u * v113 + A * v116;
          v117.m31 = D * v109 + B * v111 + K * v114;
          v117.m32 = D * v110 + B * v112 + K * v115;
          v117.m33 = D * V + B * v113 + K * v116;
          this.K = 240;
          let v118 = b.translate;
          let v119 = v118.x;
          let v120 = v118.y;
          let v121 = v118.z;
          let v122 = a.translate;
          this.translate.x = n * v119 + q * v120 + p * v121 + v122.x;
          this.translate.y = v * v119 + u * v120 + A * v121 + v122.y;
          this.translate.z = D * v119 + B * v120 + K * v121 + v122.z;
        } else if ((d & 8) > 0) {
          let e = a.matrix;
          let f = b.matrix;
          let g = b.scale;
          let h = g.x;
          let m = g.y;
          let n = g.z;
          let q = f.m11 * h;
          let p = f.m12 * m;
          let v = f.m13 * n;
          let u = f.m21 * h;
          let A = f.m22 * m;
          let D = f.m23 * n;
          let B = f.m31 * h;
          let K = f.m32 * m;
          let E = f.m33 * n;
          let v123 = e.m11 * p + e.m12 * A + e.m13 * K;
          let v124 = e.m11 * v + e.m12 * D + e.m13 * E;
          let V = e.m21 * p + e.m22 * A + e.m23 * K;
          let v125 = e.m21 * v + e.m22 * D + e.m23 * E;
          let v126 = e.m31 * p + e.m32 * A + e.m33 * K;
          let v127 = e.m31 * v + e.m32 * D + e.m33 * E;
          let v128 = this.matrix;
          v128.m11 = e.m11 * q + e.m12 * u + e.m13 * B;
          v128.m12 = v123;
          v128.m13 = v124;
          v128.m21 = e.m21 * q + e.m22 * u + e.m23 * B;
          v128.m22 = V;
          v128.m23 = v125;
          v128.m31 = e.m31 * q + e.m32 * u + e.m33 * B;
          v128.m32 = v126;
          v128.m33 = v127;
          this.K = 240;
          let v129 = b.translate;
          let v130 = v129.x;
          let v131 = v129.y;
          let v132 = v129.z;
          let v133 = a.translate;
          this.translate.x = e.m11 * v130 + e.m12 * v131 + e.m13 * v132 + v133.x;
          this.translate.y = e.m21 * v130 + e.m22 * v131 + e.m23 * v132 + v133.y;
          this.translate.z = e.m31 * v130 + e.m32 * v131 + e.m33 * v132 + v133.z;
        } else {
          let e = a.matrix;
          let f = b.matrix;
          let g = f.m11;
          let h = f.m12;
          let m = f.m13;
          let n = f.m21;
          let q = f.m22;
          let p = f.m23;
          let v = f.m31;
          let u = f.m32;
          let A = f.m33;
          let D = e.m11 * h + e.m12 * q + e.m13 * u;
          let B = e.m11 * m + e.m12 * p + e.m13 * A;
          let K = e.m21 * h + e.m22 * q + e.m23 * u;
          let E = e.m21 * m + e.m22 * p + e.m23 * A;
          let v134 = e.m31 * h + e.m32 * q + e.m33 * u;
          let v135 = e.m31 * m + e.m32 * p + e.m33 * A;
          let V = this.matrix;
          V.m11 = e.m11 * g + e.m12 * n + e.m13 * v;
          V.m12 = D;
          V.m13 = B;
          V.m21 = e.m21 * g + e.m22 * n + e.m23 * v;
          V.m22 = K;
          V.m23 = E;
          V.m31 = e.m31 * g + e.m32 * n + e.m33 * v;
          V.m32 = v134;
          V.m33 = v135;
          this.K = 240;
          let v136 = b.translate;
          let v137 = v136.x;
          let v138 = v136.y;
          let v139 = v136.z;
          let v140 = a.translate;
          this.translate.x = e.m11 * v137 + e.m12 * v138 + e.m13 * v139 + v140.x;
          this.translate.y = e.m21 * v137 + e.m22 * v138 + e.m23 * v139 + v140.y;
          this.translate.z = e.m31 * v137 + e.m32 * v138 + e.m33 * v139 + v140.z;
        }
        this.K = this.K & -2 | 240;
      }
    }
    cE(a, b) {
      var c = a.K;
      var d = b.K;
      if ((c & 1) > 0) {
        this.Tw(b);
      } else if ((d & 1) > 0) {
        this.Tw(a);
      } else if ((c & 12) == 12 && (d & 8) > 0) {
        if ((c & 2) > 0) {
          var e = b.matrix;
          var f = this.matrix;
          f.m11 = e.m11;
          f.m12 = e.m12;
          f.m21 = e.m21;
          f.m22 = e.m22;
        } else if ((d & 2) > 0) {
          e = a.matrix;
          f = this.matrix;
          f.m11 = e.m11;
          f.m12 = e.m12;
          f.m21 = e.m21;
          f.m22 = e.m22;
        } else {
          e = a.matrix;
          var g = b.matrix;
          f = g.m11;
          var h = g.m12;
          var m = g.m21;
          var n = g.m22;
          g = e.m11 * h + e.m12 * n;
          h = e.m21 * h + e.m22 * n;
          n = this.matrix;
          n.m11 = e.m11 * f + e.m12 * m;
          n.m12 = g;
          n.m21 = e.m21 * f + e.m22 * m;
          n.m22 = h;
        }
        this.K = this.K & -4 | 504;
        e = a.scale.x;
        if ((c & 2) > 0) {
          c = a.scale.x;
          f = b.translate;
          a = a.translate;
          this.translate.x = f.x * c + a.x;
          this.translate.y = f.y * c + a.y;
        } else {
          c = a.scale.x;
          f = a.matrix;
          g = b.translate;
          m = g.x;
          g = g.y;
          a = a.translate;
          this.translate.x = (f.m11 * m + f.m12 * g) * c + a.x;
          this.translate.y = (f.m21 * m + f.m22 * g) * c + a.y;
        }
        this.K = this.K & -2 | 496;
        if ((d & 4) > 0) {
          this.scale.x = this.scale.y = e * b.scale.x;
          this.K = this.K & -2 | 500;
        } else {
          a = b.scale;
          this.scale.x = a.x * e;
          this.scale.y = a.y * e;
          this.K = this.K & -6 | 496;
        }
      } else {
        if ((c & 8) > 0 && (d & 8) > 0) {
          f = a.matrix;
          d = a.scale;
          e = d.x;
          m = d.y;
          d = f.m11 * e;
          c = f.m12 * m;
          e *= f.m21;
          f = f.m22 * m;
          h = b.matrix;
          m = b.scale;
          n = m.x;
          var q = m.y;
          m = h.m11 * n;
          g = h.m12 * q;
          n *= h.m21;
          h = h.m22 * q;
          q = this.matrix;
          q.m11 = d * m + c * n;
          q.m12 = d * g + c * h;
          q.m21 = e * m + f * n;
          q.m22 = e * g + f * h;
          this.K = this.K & -16 | 496;
          m = b.translate;
          b = m.x;
          m = m.y;
          a = a.translate;
          this.translate.x = d * b + c * m + a.x;
          this.translate.y = e * b + f * m + a.y;
        } else if ((c & 8) > 0) {
          f = a.matrix;
          d = a.scale;
          e = d.x;
          m = d.y;
          d = f.m11 * e;
          c = f.m12 * m;
          e *= f.m21;
          f = f.m22 * m;
          n = b.matrix;
          m = n.m11;
          g = n.m12;
          h = n.m21;
          n = n.m22;
          q = this.matrix;
          q.m11 = d * m + c * h;
          q.m12 = d * g + c * n;
          q.m21 = e * m + f * h;
          q.m22 = e * g + f * n;
          this.K = this.K & -16 | 496;
          m = b.translate;
          b = m.x;
          m = m.y;
          a = a.translate;
          this.translate.x = d * b + c * m + a.x;
          this.translate.y = e * b + f * m + a.y;
        } else if ((d & 8) > 0) {
          d = a.matrix;
          m = b.matrix;
          c = b.scale;
          e = c.x;
          g = c.y;
          c = m.m11 * e;
          f = m.m12 * g;
          e *= m.m21;
          g *= m.m22;
          m = d.m11 * f + d.m12 * g;
          f = d.m21 * f + d.m22 * g;
          g = this.matrix;
          g.m11 = d.m11 * c + d.m12 * e;
          g.m12 = m;
          g.m21 = d.m21 * c + d.m22 * e;
          g.m22 = f;
          this.K = this.K & -16 | 496;
          c = b.translate;
          b = c.x;
          c = c.y;
          a = a.translate;
          this.translate.x = d.m11 * b + d.m12 * c + a.x;
          this.translate.y = d.m21 * b + d.m22 * c + a.y;
        } else {
          d = a.matrix;
          f = b.matrix;
          c = f.m11;
          m = f.m12;
          e = f.m21;
          g = f.m22;
          f = d.m11 * m + d.m12 * g;
          m = d.m21 * m + d.m22 * g;
          g = this.matrix;
          g.m11 = d.m11 * c + d.m12 * e;
          g.m12 = f;
          g.m21 = d.m21 * c + d.m22 * e;
          g.m22 = m;
          this.K = this.K & -16 | 496;
          c = b.translate;
          b = c.x;
          c = c.y;
          a = a.translate;
          this.translate.x = d.m11 * b + d.m12 * c + a.x;
          this.translate.y = d.m21 * b + d.m22 * c + a.y;
        }
        this.K = this.K & -2 | 496;
      }
    }
    UL(a, b) {
      if ((this.K & 16) > 0) {
        this.nt();
      }
      let c = this.Ue;
      let d = a.x;
      let e = a.y;
      a = a.z;
      b.x = c.m11 * d + c.m12 * e + c.m13 * a + c.m14;
      b.y = c.m21 * d + c.m22 * e + c.m23 * a + c.m24;
      b.z = c.m31 * d + c.m32 * e + c.m33 * a + c.m34;
      return b;
    }
    Jb(a, b) {
      if ((this.K & 64) > 0) {
        this.Tm();
      }
      let c = this.Ue;
      let d = c.m21 * a.x + c.m22 * a.y + c.m24;
      b.x = c.m11 * a.x + c.m12 * a.y + c.m14;
      b.y = d;
      return b;
    }
    gg(a, b) {
      if ((this.K & 128) > 0) {
        this.nT();
      }
      let c = this.qB;
      let d = c.m21 * a.x + c.m22 * a.y + c.m24;
      b.x = c.m11 * a.x + c.m12 * a.y + c.m14;
      b.y = d;
      return b;
    }
    nt() {
      let a = this.Ue;
      if ((this.K & 1) > 0) {
        a.m11 = 1;
        a.m12 = 0;
        a.m13 = 0;
        a.m21 = 0;
        a.m22 = 1;
        a.m23 = 0;
        a.m31 = 0;
        a.m32 = 0;
        a.m33 = 1;
        a.m14 = 0;
        a.m24 = 0;
        a.m34 = 0;
      } else {
        var b = this.matrix;
        if ((this.K & 8) > 0) {
          let c = this.scale.x;
          let d = this.scale.y;
          let e = this.scale.z;
          a.m11 = b.m11 * c;
          a.m12 = b.m12 * d;
          a.m13 = b.m13 * e;
          a.m21 = b.m21 * c;
          a.m22 = b.m22 * d;
          a.m23 = b.m23 * e;
          a.m31 = b.m31 * c;
          a.m32 = b.m32 * d;
          a.m33 = b.m33 * e;
        } else {
          a.m11 = b.m11;
          a.m12 = b.m12;
          a.m13 = b.m13;
          a.m21 = b.m21;
          a.m22 = b.m22;
          a.m23 = b.m23;
          a.m31 = b.m31;
          a.m32 = b.m32;
          a.m33 = b.m33;
        }
        b = this.translate;
        a.m14 = b.x;
        a.m24 = b.y;
        a.m34 = b.z;
      }
      this.K &= -81;
    }
    Tm() {
      let a = this.Ue;
      if ((this.K & 1) > 0) {
        a.m11 = 1;
        a.m12 = 0;
        a.m21 = 0;
        a.m22 = 1;
        a.m14 = 0;
        a.m24 = 0;
      } else {
        let c = this.matrix;
        if ((this.K & 8) > 0) {
          var b = this.scale;
          let d = b.x;
          b = b.y;
          a.m11 = c.m11 * d;
          a.m12 = c.m12 * b;
          a.m21 = c.m21 * d;
          a.m22 = c.m22 * b;
        } else {
          a.m11 = c.m11;
          a.m12 = c.m12;
          a.m21 = c.m21;
          a.m22 = c.m22;
        }
        a.m14 = this.translate.x;
        a.m24 = this.translate.y;
      }
      this.K &= -65;
    }
    nT() {
      let a = this.qB;
      var b = this.matrix;
      if ((this.K & 1) > 0) {
        a.m11 = 1;
        a.m12 = 0;
        a.m21 = 0;
        a.m22 = 1;
        a.m14 = 0;
        a.m24 = 0;
      } else {
        if ((this.K & 8) > 0) {
          if ((this.K & 12) == 12) {
            var c = 1 / this.scale.x;
            var d = b.m12 * c;
            a.m11 = b.m11 * c;
            a.m12 = b.m21 * c;
            a.m21 = d;
            a.m22 = b.m22 * c;
          } else {
            c = this.scale;
            var e = c.x;
            var f = c.y;
            c = b.m11 * e;
            d = b.m12 * f;
            e *= b.m21;
            b = b.m22 * f;
            f = 1 / (c * b - d * e);
            a.m11 = b * f;
            a.m12 = -d * f;
            a.m21 = -e * f;
            a.m22 = c * f;
          }
        } else {
          if ((this.K & 64) > 0) {
            this.Tm();
          }
          b = this.Ue;
          c = 1 / (b.m11 * b.m22 - b.m12 * b.m21);
          d = b.m11 * c;
          a.m11 = b.m22 * c;
          a.m12 = -b.m12 * c;
          a.m21 = -b.m21 * c;
          a.m22 = d;
        }
        a.m14 = -(a.m11 * this.translate.x + a.m12 * this.translate.y);
        a.m24 = -(a.m21 * this.translate.x + a.m22 * this.translate.y);
      }
      this.K &= -129;
    }
  }
  SceneTransform.i = true;
  Object.assign(SceneTransform.prototype, {
    l: SceneTransform
  });
  class Sprite extends DisplayBase {
    constructor(a, b, c) {
      super(new SpriteNode(a != null ? a.node : null));
      this.He = new Bounds(0, 0, 0, 0);
      this.qf = this.Dq = null;
      this.X = new Vec4(0, 0, 0, 1);
      if (b != null) {
        this.Uf(b, c);
      }
      DisplayBase.count++;
    }
    free() {
      if (this.u != null) {
        this.u.free();
        this.X = this.qf = this.Dq = this.He = null;
        super.free();
      }
    }
    getWidth() {
      if ((this.flags & 1) == 0) {
        return this.X.x * Math.abs(this.Ra);
      }
      var a = this.X.x * Math.abs(this.Ra) / 2;
      let b = this.X.y * Math.abs(this.ed) / 2;
      let c = -Math.sin(this.cg);
      let d = Math.cos(this.cg);
      let e;
      if (d > 0) {
        e = -(d * a);
        a *= d;
      } else {
        e = d * a;
        a = -(d * a);
      }
      if (c > 0) {
        e -= c * b;
        a += c * b;
      } else {
        e += c * b;
        a -= c * b;
      }
      return a - e;
    }
    px(a) {
      this.setScaleX(a / this.X.x);
    }
    getHeight() {
      if ((this.flags & 1) == 0) {
        return this.X.y * Math.abs(this.ed);
      }
      var a = this.X.x * Math.abs(this.Ra) / 2;
      let b = this.X.y * Math.abs(this.ed) / 2;
      let c = Math.sin(this.cg);
      let d = Math.cos(this.cg);
      let e;
      if (c > 0) {
        e = -(c * a);
        a *= c;
      } else {
        e = c * a;
        a = -(c * a);
      }
      if (d > 0) {
        e -= d * b;
        a += d * b;
      } else {
        e += d * b;
        a -= d * b;
      }
      return a - e;
    }
    nx(a) {
      this.setScaleY(a / this.X.y);
    }
    centerPivot() {
      this.setPivot(this.X.x / 2, this.X.y / 2);
    }
    centerOrigin() {
      this.setOrigin(this.X.x / 2, this.X.y / 2);
    }
    setPivot(a, b) {
      if (a != null && a >= 0 && a <= 1) {
        a *= this.X.x;
      }
      if (b != null && b >= 0 && b <= 1) {
        b *= this.X.y;
      }
      super.setPivot(a, b);
    }
    setOrigin(a, b) {
      if (a != null && a >= 0 && a <= 1) {
        a *= this.X.x;
      }
      if (b != null && b >= 0 && b <= 1) {
        b *= this.X.y;
      }
      super.setOrigin(a, b);
    }
    Uf(a, b) {
      if (this.Dq != a) {
        this.Dq = a;
        this.qf = null;
        var c = this.u;
        c.Xo = cachedBind(this, this.SC);
        c.Rf(new TextureDrawEffect(a));
        this.SC();
        this.oc();
      }
      if (b != null) {
        this.qp(b);
      }
    }
    SC() {
      var a = this.Dq;
      let b = this.X;
      b.x = a.size.x * a.$e;
      b.y = a.size.y * a.$e;
      this.u.Lb(this.X.x, this.X.y);
      a = this.qf;
      if (a != null) {
        this.qf = null;
        this.qp(a);
      }
    }
    Fb(a) {
      if (this.qf != a) {
        this.qf = a;
        var b = this.u;
        var c = b.effect;
        var d = c.Zw(a);
        c = c.Hb.$e;
        a = this.He;
        var e = this.X;
        e.x = d.ec.x * c;
        e.y = d.ec.y * c;
        if (d.Ip) {
          e = d.mt;
          d = d.Od;
          let f = e.x * c;
          e = e.y * c;
          a.A = f;
          a.D = e;
          a.B = f + d.w;
          a.G = e + d.J;
          b.Lb(d.w * c, d.J * c);
        } else {
          b.Lb(this.X.x, this.X.y);
          a.A = 0;
          a.D = 0;
          a.B = 0;
          a.G = 0;
        }
        this.oc();
      }
    }
    qp(a) {
      if (this.qf != a) {
        this.qf = a;
        var b = this.u;
        var c = b.effect;
        var d = c.Zw(a);
        c = c.Hb.$e;
        a = this.He;
        var e = this.X;
        e.x = d.ec.x * c;
        e.y = d.ec.y * c;
        if (d.Ip) {
          e = d.mt;
          d = d.Od;
          let f = e.x * c;
          e = e.y * c;
          a.A = f;
          a.D = e;
          a.B = f + d.w;
          a.G = e + d.J;
          b.Lb(d.w * c, d.J * c);
        } else {
          b.Lb(this.X.x, this.X.y);
          a.A = 0;
          a.D = 0;
          a.B = 0;
          a.G = 0;
        }
        this.oc();
      }
    }
    pa() {
      return new InternKey(this);
    }
    setColor(a, b, c) {
      let d = this.X;
      d.x = b;
      d.y = c;
      b = this.u;
      b.Lb(this.X.x, this.X.y);
      b.Sc();
      this.u.Rf(new ColorRectEffect(a));
      return this;
    }
    Ub(a, b) {
      if (!this.ri()) {
        return false;
      }
      NodeTreeUtil.Yf(this.u);
      this.u.pe();
      return this.u.Ub(a, b);
    }
    Re(a, b) {
      if (b == null) {
        b = true;
      }
      let c = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
      if (this.X.x == 0) {
        return c;
      }
      if (a == this) {
        c.A = 0;
        c.D = 0;
        c.B = this.X.x;
        c.G = this.X.y;
        return c;
      }
      var d = this.He.A;
      var e = this.He.D;
      let f = this.u;
      var g = f.size;
      let h = g.x;
      g = g.y;
      var m = this.He;
      if (m = m.B - m.A > 0) {
        var n = this.He;
        var q = n.B - n.A;
        n.A = 0;
        n.B = q;
        n = this.He;
        q = n.G - n.D;
        n.D = 0;
        n.G = q;
        f.Lb(this.X.x, this.X.y);
        this.oc();
        this.u.Gd(false, false);
      }
      if (b) {
        NodeTreeUtil.Yf(this.u);
        if (a != null && !NodeTreeUtil.Ov(this.u.parent, a.u)) {
          NodeTreeUtil.Yf(a.u);
        }
      }
      this.u.Fl(a == null ? this.u.gB() : a.u, c);
      if (m) {
        a = this.He;
        b = a.B - a.A;
        a.A = d;
        a.B = d + b;
        d = this.He;
        a = d.G - d.D;
        d.D = e;
        d.G = e + a;
        e = f.size;
        e.x = h;
        e.y = g;
        f.Sc();
        this.oc();
        this.u.Gd(false, false);
      }
      return c;
    }
    Jx(a) {
      let b = this.He;
      var c = b.A;
      let d = b.D;
      var e = b.B - b.A > 0;
      if (e) {
        var f = b.B - b.A;
        b.A = 0;
        b.B = f;
        f = b.G - b.D;
        b.D = 0;
        b.G = f;
        this.oc();
        this.u.Gd(false, false);
      }
      a = super.Jx(a);
      if (e) {
        e = b.B - b.A;
        b.A = c;
        b.B = c + e;
        c = b.G - b.D;
        b.D = d;
        b.G = d + c;
        this.oc();
        this.u.Gd(false, false);
      }
      return a;
    }
    Ix(a) {
      let b = this.He;
      var c = b.A;
      let d = b.D;
      var e = b.B - b.A > 0;
      if (e) {
        var f = b.B - b.A;
        b.A = 0;
        b.B = f;
        f = b.G - b.D;
        b.D = 0;
        b.G = f;
        this.oc();
        this.u.Gd(false, false);
      }
      a = super.Ix(a);
      if (e) {
        e = b.B - b.A;
        b.A = c;
        b.B = c + e;
        c = b.G - b.D;
        b.D = d;
        b.G = d + c;
        this.oc();
        this.u.Gd(false, false);
      }
      return a;
    }
    Jm() {
      if (this.mh() != null) {
        this.mh().Jm(this);
      } else if (this.u.parent != null) {
        this.u.parent.bx(this.u);
      }
    }
    Es() {
      if (this.mh() != null) {
        this.mh().Es(this);
      } else if (this.u.parent != null) {
        this.u.parent.Yw(this.u);
      }
    }
    SR(a) {
      this.u.effect.XR(a);
    }
    oc() {
      let a = this.u.Db;
      let b = this.Tg;
      let c = this.Ug;
      var d = this.He;
      let e = d.A;
      d = d.D;
      let f = this.Rg;
      let g = this.Sg;
      let h = this.pn - e;
      let m = this.qn - d;
      let n = this.dg;
      var q = this.eg;
      var p = this.flags;
      if ((p & 1) > 0) {
        let u = Math.sin(this.cg);
        let A = Math.cos(this.cg);
        var v = a.matrix;
        let D = a.matrix;
        D.m11 = A;
        D.m12 = -u;
        D.m13 = v.m13;
        D.m21 = u;
        D.m22 = A;
        D.m23 = v.m23;
        D.m31 = v.m31;
        D.m32 = v.m32;
        D.m33 = v.m33;
        a.K = a.K & -4 | 248;
        if ((p & 4) > 0) {
          a.scale.x = 1;
          a.scale.y = 1;
          a.K |= 500;
          a.translate.x = -(h * A) + m * u + h + b - f + e;
          a.translate.y = -(h * u) - m * A + m + c - g + d;
        } else if ((p & 2) > 0) {
          q = n * h;
          p = n * m;
          a.scale.x = a.scale.y = n;
          a.K = a.K & -2 | 500;
          a.translate.x = -(q * A) + p * u + h + b - f + e;
          a.translate.y = -(q * u) - p * A + m + c - g + d;
        } else {
          p = n * h;
          v = q * m;
          a.scale.x = n;
          a.scale.y = q;
          a.K = a.K & -6 | 496;
          a.translate.x = -(p * A) + v * u + h + b - f + e;
          a.translate.y = -(p * u) - v * A + m + c - g + d;
        }
      } else if ((p & 4) > 0) {
        a.scale.x = 1;
        a.scale.y = 1;
        a.K |= 500;
        a.translate.x = b - f + e;
        a.translate.y = c - g + d;
      } else if ((p & 2) > 0) {
        a.scale.x = a.scale.y = n;
        a.K = a.K & -2 | 500;
        a.translate.x = -(n * h) + h + b - f + e;
        a.translate.y = -(n * m) + m + c - g + d;
      } else {
        a.scale.x = n;
        a.scale.y = q;
        a.K = a.K & -6 | 496;
        a.translate.x = -(n * h) + h + b - f + e;
        a.translate.y = -(q * m) + m + c - g + d;
      }
      a.K = a.K & -2 | 496;
    }
    typeId() {
      return 304;
    }
  }
  Sprite.i = true;
  Sprite.s = DisplayBase;
  Object.assign(Sprite.prototype, {
    l: Sprite
  });
  class Container extends DisplayBase {
    constructor(a, b) {
      super(new SceneRoot(b != null ? b.node : null, null, 512));
      this.node = this.u;
      this.u.name = a;
    }
    free() {
      if (this.node != null) {
        this.node.free();
        this.node = null;
        super.free();
      }
    }
    appendChild(a) {
      this.node.P(a.u);
    }
    Mj() {
      return this.node.Mj();
    }
    nb(a) {
      return this.node.nb(a).Xg;
    }
    Ww(a, b) {
      this.node.Ww(a.u, b);
    }
    fo(a) {
      a = this.node.fo(a);
      if (a != null) {
        return a.Xg;
      } else {
        return null;
      }
    }
    Jm(a) {
      if (a == null) {
        if (this.mh() != null) {
          this.node.parent.bx(this.u);
        }
      } else {
        this.node.bx(a.u);
      }
    }
    Es(a) {
      if (a == null) {
        if (this.mh() != null) {
          this.node.parent.Yw(this.u);
        }
      } else {
        this.node.Yw(a.u);
      }
    }
    iterator() {
      let a = this.node.children;
      return {
        fb: function () {
          return a != null;
        },
        next: function () {
          let b = a.Xg;
          a = a.Y;
          return b;
        }
      };
    }
    Ub(a, b) {
      NodeTreeUtil.Yf(this.u);
      this.u.Gd(false, true);
      return this.node.Ub(a, b);
    }
    Re(a, b) {
      if (b == null) {
        b = true;
      }
      if (b) {
        this.u.Gd(false, false);
        NodeTreeUtil.Yf(this.u);
        if (a != null && !NodeTreeUtil.Ov(this.u, a.u)) {
          NodeTreeUtil.Yf(a.u);
        }
        b = false;
      }
      let c = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
      let d = this.node.children;
      while (d != null) {
        let e = d.Xg;
        if (e != null && e instanceof DisplayBase) {
          c.add(e.Re(a, b));
        }
        d = d.Y;
      }
      return c;
    }
    getWidth() {
      let a = this.Re(this.mh());
      return a.B - a.A;
    }
    getHeight() {
      let a = this.Re(this.mh());
      return a.G - a.D;
    }
    centerOrigin() {
      if (this.Mj() != 0) {
        var a = this.Re(this);
        this.setOrigin((a.A + a.B) / 2, (a.D + a.G) / 2);
      }
    }
    centerPivot() {
      if (this.Mj() != 0) {
        var a = this.Re(this);
        this.setPivot((a.A + a.B) / 2, (a.D + a.G) / 2);
      }
    }
    typeId() {
      return 204;
    }
  }
  Container.i = true;
  Container.s = DisplayBase;
  Object.assign(Container.prototype, {
    l: Container
  });
  class LoadingScene extends Scene {
    constructor() {
      super();
    }
    init() {
      super.init();
      this.th = new Sprite(null, this.createTexture(Loader.loaderBg));
      this.node.P(this.th.u);
      this.Ke(750, 750);
      var a = "logo";
      if (Loader.qv() == "ru") {
        a = "logo_ru";
      }
      this.we = new Sprite(this.ra, Resources.Yl.children[0], a);
      this.we.center();
      this.we.setX(375);
      this.we.setY(200);
      this.ca = new Container();
      this.ca.setX(375);
      this.ca.setY(400);
      this.ra.appendChild(this.ca);
      a = new Sprite(this.ca, Resources.Yl.children[0], "bubble");
      a.center();
      this.text = new TextNode(this.ca, Resources.Yl.children[1]);
      this.text.setText("100%");
      this.text.setBoxSize(a.X.x, a.X.y);
      this.text.setAlign(0, 0);
      this.text.setMultiline(false);
      this.text.setText("0%");
      this.text.setX(-a.X.x / 2);
      this.text.setY(-a.X.y / 2);
      this.text.setFontSize(this.text.$q() * 0.7);
      this.Zl = this.O.Xl(this.fa.Ha.sceneToLoad);
      this.ak = this.wd = 0;
      this.tj = Math.random() * PI * 2;
      this.uj = Math.random() * PI * 2;
      this.Ek = Math.random() * 0.1 - 0.05;
      this.Fk = Math.random() * 0.1 - 0.05;
    }
    layout() {
      super.layout();
      if (this.fa.Se() > 1) {
        this.th.la(0);
        this.th.setX(0);
        this.th.px(this.fa.getWidth());
        this.th.nx(this.fa.getHeight());
      } else {
        this.th.la(90);
        this.th.setX(this.fa.getWidth());
        this.th.px(this.fa.getHeight());
        this.th.nx(this.fa.getWidth());
      }
    }
    dispose() {
      this.ia(Loader.loaderBg);
      super.dispose();
    }
    update(a) {
      super.update(a);
      this.layout();
      this.ca.setX(375);
      this.ca.setY(400);
      var b = Math.cos(this.tj) * 50;
      a = Math.sin(this.uj) * 50;
      this.tj += this.Ek;
      this.uj += this.Fk;
      let c = this.ca;
      c.setX(c.getX() + b);
      b = this.ca;
      b.setY(b.getY() + a);
      // Same drop-the-fake-progress treatment as BubbleLoadingOverlay.
      // The `De == "Running"` guard is critical: gk() pushes a new
      // scene, and if it fires while this LoadingScene is still being
      // pushed in (De == "Created" / "Started"), the in-flight
      // TransitionPushOver calls transitionIn on an already-disposed
      // scene whose `node` has been nulled, producing
      // `Cannot read properties of null (reading 'li')`.
      this.wd = this.Zl.er() | 0;
      this.aE(this.wd);
      this.text.setText("" + this.wd + "%");
      if (this.Zl.xv() && this.De == "Running" && this.ak == 0) {
        this.ak++;
        this.gk();
      }
    }
    aE() {}
    gk() {
      this.$(this.fa.Ha.sceneToLoad);
    }
    getTransitionDuration(a) {
      if (a == null) {
        return 0;
      } else {
        return 0.5;
      }
    }
    getName() {
      return "LoadingScene";
    }
  }
  LoadingScene.i = true;
  LoadingScene.s = Scene;
  Object.assign(LoadingScene.prototype, {
    l: LoadingScene
  });
  class CTRCLoadingScene extends LoadingScene {
    constructor() {
      super();
    }
    aE(a) {
      SDK.setPreloadProgress(a);
    }
    getName() {
      return "CTRCLoadingScene";
    }
  }
  CTRCLoadingScene.i = true;
  CTRCLoadingScene.s = LoadingScene;
  Object.assign(CTRCLoadingScene.prototype, {
    l: CTRCLoadingScene
  });
  class MenuScene extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      let a = [Loader.fontDat, Loader.fontImg, Loader.menuShadow, Loader.menuUi, Loader.menuUiJson, Loader.strings, Loader.menuSalute, Loader.menuSaluteJson, WebApplication.menuMusicId];
      if (WebApplication.xmasMode) {
        a.push(Loader.menuBgXmas);
        a.push(Loader.menuBg2Xmas);
      } else {
        a.push(Loader.menuBg);
        a.push(Loader.menuBg2);
      }
      // Intro video preload removed - the .mp4 files are not shipped, so
      // requesting them at menu init triggers a 404 that stalls the loader.
      // The original line was:
      //   if (LevelState.Nj() == 0) {
      //     a.push(this.O.window.bo() > 1 ? Loader.introLandscapeVid : Loader.introPortraitVid);
      //   }
      return a;
    }
    getTransitionDuration(a) {
      if (a instanceof IntroVideoScene) {
        return 0;
      } else {
        return super.getTransitionDuration(a);
      }
    }
    transitionIn(a, b) {
      if (b == null) {
        this.fh.W(1 - a);
      } else {
        super.transitionIn(a, b);
      }
    }
    Vg() {
      super.Vg();
      this.Pc = new Sprite(null, Resources.Sz);
      this.node.P(this.Pc.u);
    }
    Nd() {
      super.Nd();
      let a = WebApplication.xmasMode ? Loader.menuBg2Xmas : Loader.menuBg2;
      if (Loader.ob(a)) {
        Resources.Sz = this.createTexture(a);
      }
    }
    init() {
      super.init();
      this.Vg();
      this.sj();
      this.Ke(600, 900);
      this.Mh = new Sprite(null, Resources.Wa, Keys.rL);
      this.gh = new Sprite(null, Resources.Wa, Keys.JK);
      this.node.P(this.Mh.u);
      this.node.P(this.gh.u);
      this.we = new Container(null, this.ra);
      this.we.setX(303);
      this.we.setY(220);
      this.we.setUniformScale(0.9);
      if (WebApplication.xmasMode) {
        var a = new Sprite(this.we, Resources.Wa, Keys.pL);
        a.setX(-230);
        a.setY(-275);
      }
      new Sprite(this.we, Resources.Wa, Loader.qv() == "ru" ? Keys.UK : Keys.TK).center();
      if (WebApplication.xmasMode) {
        a = new Sprite(this.we, Resources.Wa, Keys.qL);
        a.setX(-230);
        a.setY(-275);
      }
      this.I = new Sprite(this.ra, Resources.Wa);
      this.I.setX(378);
      this.I.setY(364);
      this.fF();
      this.I.center();
      this.uq = 0;
      a = LabelledButton.ol(this.yb("PLAY"));
      a.setX(65);
      a.setY(500);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a.focus();
      a = ButtonBase.create(null, Keys.Uk, Keys.Vk, Keys.KK);
      a.setX(309);
      a.setY(617);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a = new AlbumButton();
      a.setX(129);
      a.setY(617);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      let b = this;
      Audio.once("EContextResumed", function () {
        if (!b.O.Sa.Dc(WebApplication.menuMusicId)) {
          b.sm();
        }
      });
    }
    start() {
      super.start();
      MenuScene.freshBoot = false;
      this.sm();
      this.eD();
      if (Save.hint == 1 && X.ym() && LevelState.Nj() > 3 && this.time > 3) {
        this.oa(new HintPointerAnim());
      }
      this.ia([97, 95, 93, 91, 89][Save.me]);
      Resources.I = null;
      this.JD();
      this.resize();
    }
    resize() {
      var a = 0;
      this.rd.y = 900;
      var b = 0.9;
      var c = this.fa.Se();
      if (c > 1) {
        if (c > 2) {
          c = 2;
        }
        this.rd.y = remap(c, 1, 2, 900, 650);
        a = remap(c, 1, 2, 0, -80);
        b = remap(c, 1, 2, 0.9, 0.8);
      }
      super.layout();
      this.buttons[1].setY(500 + a);
      this.buttons[2].setY(617 + a);
      this.buttons[3].setY(617 + a);
      this.we.setUniformScale(b);
      if (WebApplication.xmasMode) {
        this.I.setX(378);
        this.I.setY(370);
        if (c > 1.1) {
          a = remap(c, 1.1, 2, 0, 1);
          b = this.I;
          b.setX(b.getX() - a * 10);
          b = this.I;
          b.setY(b.getY() - a * 15);
        }
        if (c > 0.6) {
          a = this.I;
          a.setX(a.getX() - 8);
        }
      } else {
        this.I.setX(378);
        this.I.setY(370);
        if (Loader.qv() != "ru") {
          a = this.I;
          a.setX(a.getX() + 3);
          a = this.I;
          a.setY(a.getY() + 6);
        }
        if (c > 1.1) {
          a = remap(c, 1.1, 2, 0, 1);
          b = this.I;
          b.setX(b.getX() - a * 8);
          b = this.I;
          b.setY(b.getY() - a * 7);
        }
      }
      if (WebApplication.xmasMode && c > 0.6) {
        c = this.we;
        c.setUniformScale(c.Ra * 0.85);
      }
      b = this.fa.dr();
      c = this.Ea.getWidth() / this.Pc.X.x;
      this.Pc.setUniformScale(c);
      this.Pc.setX((b.A + b.B) / 2);
      c = this.Pc;
      c.setX(c.getX() - this.Pc.getWidth() / 2);
      this.Pc.setY(this.Ea.getHeight() - this.Pc.getHeight());
      if (this.oN) {
        this.Pc.setY(b.G - b.D - this.Pc.getHeight());
        c = this.Pc;
        c.setY(c.getY() + this.fa.Se() * this.Pc.getHeight() * 0.3);
      }
      c = (b.B - b.A) / 2;
      a = 0.2;
      var d = this.fa.Se();
      if (d > 1) {
        a = 0.2 + (d - 1);
        if (a > 0.3) {
          a = 0.3;
        }
      }
      a = new Bounds(0, 0, c, (b.G - b.D) * a);
      b = b.G;
      let e = a.G - a.D;
      a.G = b;
      a.D = b - e;
      this.Yv = a.hi(1);
      b = d > 1 ? 0.6 : 0.4;
      d = this.Yv;
      this.Mh.setUniformScale((d.B - d.A) * b / this.Mh.X.x);
      d = this.Yv;
      this.Mh.setX((d.A + d.B) / 2 - this.Mh.getWidth() / 2);
      this.Mh.setY(this.Yv.G - this.Mh.getHeight() * 1.1);
      this.Mh.W(0.5);
      d = a.B - a.A;
      a.A = c;
      a.B = c + d;
      c = this.Zv = a.hi(1);
      this.gh.setUniformScale((c.B - c.A) * b / this.gh.X.x);
      c = this.Zv;
      this.gh.setX((c.A + c.B) / 2 - this.gh.getWidth() / 2);
      this.gh.setY(this.Zv.G - this.gh.getHeight() * 1.1);
      this.gh.W(0.5);
    }
    update(a) {
      super.update(a);
      this.resize();
      if (this.$n(HintPointerAnim, this) == null) {
        this.uq -= a;
        if (this.uq <= 0 && this.O.hd().Nb(0) && this.I.Ub(this.pointer.pos)) {
          Save.me = this.VP();
          Save.hint = 0;
          this.fF();
          this.fC();
          SoundFx.play(SoundFx.button);
          Save.flush();
          this.uq = 0.25;
        }
      }
    }
    render(a) {
      super.render(a);
    }
    Pd() {
      if (this.O.lh().Nb(461)) {
        try {
          PlatformBack.back();
        } catch (a) {}
      }
      if (this.hb(1)) {
        this.play();
      }
      if (this.hb(2)) {
        this.qE();
      }
      if (this.hb(3)) {
        this.vp();
      }
    }
    play() {
      if (LevelState.Nj() == 0) {
        if (this.Nm()) {
          this.$(IntroVideoScene);
        } else {
          this.$(LevelScene);
        }
      } else {
        this.$(SelectSeasonScene);
      }
    }
    Nm() {
      return !this.O.SB();
    }
    qE() {
      this.$(OptionsScene);
    }
    vp() {
      this.$(PicturesScene);
    }
    fF() {
      this.I.Fb(Keys.jj(Keys.IK, Save.me));
      switch (Save.me) {
        case 0:
        case 1:
          this.I.Es();
          break;
        case 2:
          this.I.Jm();
      }
    }
    VP() {
      let a = Save.me;
      if (WebApplication.xmasMode) {
        switch (a) {
          case 3:
            a = 4;
            break;
          case 4:
            a = 3;
        }
      } else {
        switch (a) {
          case 0:
            a = 1;
            break;
          case 1:
            a = 2;
            break;
          case 2:
            a = 0;
        }
      }
      return a;
    }
    fC() {
      this.I.setUniformScale(0.95);
      this.I.tween().IS();
      this.I.tween().scale(1, 1, Easing.elasticOut(0.1, 0.5));
    }
    eD() {
      if (Save.wg[0][0] == 0) {
        if (this.Nm() && WebApplication.ds) {
          this.O.Xl(IntroVideoScene);
        }
      } else {
        this.O.Xl(SelectSeasonScene);
      }
    }
    getName() {
      return "MenuScene";
    }
  }
  MenuScene.i = true;
  MenuScene.s = Scene;
  Object.assign(MenuScene.prototype, {
    l: MenuScene
  });
  class CTRCMenuScene extends MenuScene {
    constructor() {
      super();
    }
    init() {
      super.init();
      if (!SDK.hasFeature("credits")) {
        this.Mh.L(false);
        this.gh.L(false);
      }
    }
    start() {
      super.start();
      if (!gameReadyFired) {
        gameReadyFired = true;
        SDK.gameReady();
      }
    }
    play() {
      let a = this;
      SDK.showInterstitialAd("button:main:start", function () {
        if (LevelState.Nj() == 0) {
          if (a.Nm()) {
            a.$(CTRCIntroVideoScene);
          } else {
            let b = CTRCLevelScene;
            SDK.trackLevelStart(currentLevelId(), function () {
              a.$(b);
            });
          }
        } else {
          a.$(CTRCSelectSeasonScene);
        }
      });
    }
    qE() {
      this.$(CTRCOptionsScene);
    }
    eD() {
      if (Save.wg[0][0] == 0) {
        if (this.Nm() && WebApplication.ds) {
          this.O.Xl(CTRCIntroVideoScene);
        }
      } else {
        this.O.Xl(CTRCSelectSeasonScene);
      }
    }
    vp() {
      this.$(CTRCPicturesScene);
    }
    Nm() {
      if (SDK.hasFeature("intro")) {
        return super.Nm();
      } else {
        return false;
      }
    }
    getName() {
      return "CTRCMenuScene";
    }
  }
  CTRCMenuScene.i = true;
  CTRCMenuScene.s = MenuScene;
  Object.assign(CTRCMenuScene.prototype, {
    l: CTRCMenuScene
  });
  class OptionsScene extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      return [Loader.fontDat, Loader.fontImg, Loader.menuBg, Loader.menuShadow, Loader.menuUi, Loader.menuUiJson, Loader.strings, WebApplication.menuMusicId];
    }
    init() {
      super.init();
      this.Vg();
      this.sj();
      this.Ke(600, 900);
      this.$k();
      var a = ButtonBase.create(null, Keys.Rt, Keys.St, Keys.mL);
      a.setX(65);
      a.setY(303);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a = ButtonBase.create(null, Keys.Rt, Keys.St, Keys.$K);
      a.setX(311.5);
      a.setY(303);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      this.x = [];
      this.x[1] = new Sprite(this.ra, Resources.Wa, Keys.pz);
      this.x[1].setX(65);
      this.x[1].setY(303);
      this.x[1].L(false);
      this.x[2] = new Sprite(this.ra, Resources.Wa, Keys.pz);
      this.x[2].setX(311.5);
      this.x[2].setY(303);
      this.x[2].L(false);
      this.et(1, Save.Bd);
      this.et(2, Save.Ec);
      a = LabelledButton.ol(this.yb("LANGUAGE"));
      a.setX(65);
      a.setY(420);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a.focus();
      a = LabelledButton.ol(this.yb("RESET"));
      a.setX(65);
      a.setY(537);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
    }
    start() {
      super.start();
      this.sm();
      this.Cq = Save.language;
      this.Vv = LANGUAGES.indexOf(this.Cq);
    }
    layout() {
      let a = this.fa.Se();
      let b = 0;
      this.rd.y = 900;
      if (a > 1.25) {
        this.rd.y = 650;
        b = 1 / a * -350;
        if (this.O.jd) {
          b *= 2;
        }
      }
      super.layout();
      this.ra.setY(this.ih.D + b);
    }
    Oc() {
      super.Oc();
      if (this.Cq != Save.language) {
        this.O.V.ia(Resources.ki);
        Resources.bm[Loader.fontImg] = null;
        Resources.ki = this.createTexture(Loader.fontImg);
        let a = Resources.ov(Save.language, Save.language);
        Resources.ic = Resources.ki.children[a];
        Resources.ji = Resources.ki.children[a + 1];
        this.O.OM();
      }
    }
    Pd() {
      if (this.hb(0)) {
        Save.flush();
        this.Vb();
      }
      if (this.hb(1)) {
        this.Mk();
      }
      if (this.hb(2)) {
        this.Lk();
      }
      if (this.hb(3)) {
        var a = this.Vv + 1;
        let b = LANGUAGES.length;
        a %= b;
        if (a < 0) {
          a += b;
        }
        this.Vv = a;
        Save.Yi(LANGUAGES[this.Vv]);
        Loader.Wi(Save.language);
        a = Resources.ov(this.Cq, Save.language);
        Resources.ic = Resources.ki.children[a];
        Resources.ji = Resources.ki.children[a + 1];
        this.buttons[3].iF();
        this.buttons[4].iF();
        this.buttons[3].Ad(false);
        this.buttons[3].ke = 0;
        this.buttons[3].WD(this.yb("LANGUAGE"));
        this.buttons[4].WD(this.yb("RESET"));
      }
      if (this.hb(4)) {
        this.rE();
      }
    }
    $(a) {
      if (this.Cq != Save.language) {
        Loader.ps(Loader.fontImg);
        Loader.ps(Loader.fontDat);
      }
      super.$(a);
    }
    rE() {
      this.$(ResetScene);
    }
    Mk() {
      Save.Bd = !Save.Bd;
      this.et(1, Save.Bd);
      this.buttons[1].Ad(false);
      this.buttons[1].ke = 0;
      Save.flush();
    }
    Lk() {
      Save.Ec = !Save.Ec;
      if (Save.Ec) {
        this.O.Sa.Sf(1);
      } else {
        this.O.Sa.Sf(0);
      }
      this.et(2, Save.Ec);
      this.buttons[2].Ad(false);
      this.buttons[2].ke = 0;
      Save.flush();
    }
    Vb() {
      this.$(MenuScene);
    }
    et(a, b) {
      let c = this.buttons[a];
      let d = c.icon;
      if (b) {
        d.pp(null);
      } else {
        d.pp(new ColorTransform().Vw(-0.5));
      }
      c.icon.W(b ? 1 : 0.5);
      this.x[a].L(!b);
    }
    getName() {
      return "OptionsScene";
    }
  }
  OptionsScene.i = true;
  OptionsScene.s = Scene;
  Object.assign(OptionsScene.prototype, {
    l: OptionsScene
  });
  class CTRCOptionsScene extends OptionsScene {
    constructor() {
      super();
    }
    init() {
      super.init();
      if (SDK.hasFeature("external_mute")) {
        this.buttons[1].L(false);
        this.buttons[2].L(false);
      }
      if (SDK.hasFeature("force_english")) {
        this.buttons[3].L(false);
        let a = this.buttons[4].j;
        a.setY(a.getY() - 117);
      }
    }
    Vb() {
      this.$(CTRCMenuScene);
    }
    rE() {
      this.$(CTRCResetScene);
    }
    Mk() {
      super.Mk();
      SDK.trackVolumeChange(Save.Ec ? 1 : 0, Save.Bd ? 1 : 0);
    }
    Lk() {
      super.Lk();
      SDK.trackVolumeChange(Save.Ec ? 1 : 0, Save.Bd ? 1 : 0);
    }
    getName() {
      return "CTRCOptionsScene";
    }
  }
  CTRCOptionsScene.i = true;
  CTRCOptionsScene.s = OptionsScene;
  Object.assign(CTRCOptionsScene.prototype, {
    l: CTRCOptionsScene
  });
  class ResetScene extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      return [Loader.fontDat, Loader.fontImg, Loader.menuBg, Loader.menuShadow, Loader.menuUi, Loader.menuUiJson, Loader.strings];
    }
    init() {
      super.init();
      this.Vg();
      this.sj();
      this.Ke(600, 900);
      this.$k();
      var a = new TextNode(this.ra, Resources.ic);
      a.setX(20);
      a.setY(100);
      a.setFontSize(50);
      a.Tf(true);
      a.setAlign(0);
      a.setBoxSize(560, 200);
      a.setText(this.yb("RESET_TEXT"));
      a = new TextNode(this.ra, Resources.ji);
      a.setText(this.yb("RESET_HOLD_TEXT"));
      a.setFontSize(40);
      a.Tf(true);
      a.setAlign(0);
      a.setBoxSize(560, 100);
      a.setX(20);
      a.setY(225);
      a = LabelledButton.ol(this.yb("YES"));
      a.setX(65);
      a.setY(383);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a.focus();
      a = LabelledButton.ol(this.yb("NO"));
      a.setX(65);
      a.setY(500);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      this.blink = this.state = 0;
    }
    layout() {
      let a = this.fa.Se();
      let b = 0;
      this.rd.y = 900;
      if (a > 1.25) {
        this.rd.y = 650;
        b = 1 / a * -100;
      }
      super.layout();
      this.ra.setY(this.ih.D + b);
    }
    update(a) {
      super.update(a);
      this.O.lh();
      if (this.state == 2) {
        if (!(this.time < 0.1)) {
          this.buttons[1].$w((this.blink & 1) == 0);
          this.blink++;
          this.time = 0;
          if (this.blink == 10) {
            this.state = 3;
            this.pu();
          }
        }
      } else if (this.pointer.isHovered(1) && this.O.hd().zo(0)) {
        switch (this.state) {
          case 0:
            this.time = 0;
            this.state = 1;
            break;
          case 1:
            if (this.time > 3) {
              a = Save.language;
              Save.instance.reset();
              Save.Yi(a);
              Save.flush();
              LevelState.reset();
              this.state = 2;
              this.blink = this.time = 0;
              this.buttons[1].blur();
            }
        }
      }
    }
    Pd() {
      if (this.hb(0)) {
        this.pu();
      }
      if (this.state != 2 && this.hb(1)) {
        this.time = this.state = 0;
        this.buttons[1].Ad(false);
        this.buttons[1].ke = 0;
      }
      if (this.hb(2)) {
        this.Vb();
      }
    }
    pu() {
      this.$(MenuScene);
    }
    Vb() {
      this.$(OptionsScene);
    }
    getName() {
      return "ResetScene";
    }
  }
  ResetScene.i = true;
  ResetScene.s = Scene;
  Object.assign(ResetScene.prototype, {
    l: ResetScene
  });
  class CTRCResetScene extends ResetScene {
    constructor() {
      super();
    }
    Vb() {
      this.$(CTRCOptionsScene);
    }
    pu() {
      this.$(CTRCMenuScene);
    }
    getName() {
      return "CTRCResetScene";
    }
  }
  CTRCResetScene.i = true;
  CTRCResetScene.s = ResetScene;
  Object.assign(CTRCResetScene.prototype, {
    l: CTRCResetScene
  });

  class PauseScene extends Scene {
    constructor() {
      super();
    }
    init() {
      super.init();
      this.Pc = new ColorRectShape(null, new Vec4(0, 0, 0, 1));
      this.Pc.W(0.5);
      this.node.P(this.Pc.u);
      this.Ke(550, 550);
      var a = ButtonBase.create(null, Keys.hz, Keys.iz, Keys.VK);
      this.buttons.push(a);
      a.setX(133.5);
      a.setY(200);
      this.ra.appendChild(a.j);
      this.oa(a);
      a = ButtonBase.create(null, Keys.hz, Keys.iz, Keys.eL);
      this.buttons.push(a);
      a.setX(293.5);
      a.setY(200);
      this.ra.appendChild(a.j);
      this.oa(a);
      a.focus();
      this.state = 0;
      this.O.Sa.Sf(0);
      SoundFx.stop(SoundFx.electric);
      SoundFx.stop(SoundFx.monster_chewing);
    }
    transitionOut() {}
    getTransitionDuration(a) {
      if (a instanceof SelectLevelScene) {
        return super.getTransitionDuration(a);
      } else {
        return 0;
      }
    }
    Pd() {
      if (this.state == 0) {
        if (this.hb(1)) {
          this.AD();
        }
        var a = false;
        if (this.O.lh().Nb(415)) {
          a = true;
        }
        if (this.O.lh().Nb(461)) {
          this.Kw();
        } else if (this.hb(2) || a) {
          this.Kw();
        }
      }
    }
    AD() {
      this.kD();
    }
    Kw() {
      this.GD();
    }
    GD() {
      this.O.Sa.Sf(Save.Ec ? 1 : 0);
      SoundFx.Xi(SoundFx.monster_chewing, 1);
      this.Kf();
    }
    kD() {
      SoundFx.stop(SoundFx.monster_chewing);
      this.Ya = this.add(LevelCurtain);
      this.node.P(this.Ya.node);
      this.Ya.ZD();
      this.Ya.JA();
      this.state = 1;
    }
    uE() {
      this.$(SelectLevelScene);
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 1:
          if (this.Ya.state == 7) {
            this.Ya.state = 0;
            this.Ya.nu();
            this.state = 2;
          }
          break;
        case 2:
          if (this.Ya.state == 0) {
            this.state = 3;
            this.uE();
          }
      }
    }
    replacesPrevious() {
      return false;
    }
    getName() {
      return "PauseOverlay";
    }
  }
  PauseScene.i = true;
  PauseScene.s = Scene;
  Object.assign(PauseScene.prototype, {
    l: PauseScene
  });
  class CTRCPauseScene extends PauseScene {
    constructor() {
      super();
    }
    Kw() {
      SDK.trackResume(cachedBind(this, this.GD));
    }
    AD() {
      let a = this;
      SDK.trackLevelFail("quit", currentLevelId(), function () {
        SDK.showInterstitialAd("button:pause:quit", cachedBind(a, a.kD));
      });
    }
    uE() {
      this.$(CTRCSelectLevelScene);
    }
    getName() {
      return "CTRCPauseOverlay";
    }
  }
  CTRCPauseScene.i = true;
  CTRCPauseScene.s = PauseScene;
  Object.assign(CTRCPauseScene.prototype, {
    l: CTRCPauseScene
  });
  class VideoScene extends Scene {
    constructor() {
      super();
      this.uo = new EReg("(iPad|iPhone)", "g").match(host.navigator.platform);
      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        this.uo = true;
      }
    }
    getTransitionDuration() {
      return 0;
    }
    start() {
      super.start();
      this.O.window.canvas.style.visibility = "hidden";
      this.O.Sa.Sf(0);
      this.ae = window.document.createElement("div");
      this.ae.style.display = "flex";
      this.ae.style.position = "fixed";
      this.ae.style.left = "0px";
      this.ae.style.top = "0px";
      this.ae.style.width = "100%";
      this.ae.style.height = "100%";
      this.ae.style.justifyContent = "center";
      this.ae.style.alignItems = "center";
      window.document.body.appendChild(this.ae);
      try {
        this.video = window.document.createElement("video");
        this.ae.appendChild(this.video);
        this.video.muted = this.Qv();
        this.video.autoplay = true;
        this.video.controls = false;
        this.video.poster = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        this.video.playsInline = true;
        this.video.addEventListener("ended", cachedBind(this, this.ended));
        this.video.addEventListener("mousedown", cachedBind(this, this.Mr));
        this.video.addEventListener("touchend", cachedBind(this, this.WE));
        this.url = WebApplication.ds ? URL.createObjectURL(this.getData()) : Loader.ni(this.getPreloads()[0]);
        this.video.src = this.url;
        this.video.style.width = "100%";
        this.video.style.height = "100%";
        this.video.style.bottom = "0";
        this.video.style.left = "0";
        this.video.style.objectFit = "contain";
        this.video.style.background = "black";
      } catch (b) {
        this.ended();
      }
      let a = this;
      this.lT = this.O.window.addListener(1, function () {
        try {
          if (!a.Wj()) {
            a.video.muted = false;
          }
        } catch (b) {}
      });
      this.kT = this.O.window.addListener(2, function () {
        try {
          a.video.muted = true;
        } catch (b) {}
      });
    }
    Oc() {
      super.Oc();
      this.kT();
      this.lT();
    }
    Mr() {
      if (!this.Wj()) {
        this.video.muted = false;
      }
    }
    WE() {
      if (!this.Wj()) {
        this.video.muted = false;
      }
    }
    ended() {
      this.ae.removeChild(this.video);
      window.document.body.removeChild(this.ae);
      this.O.window.canvas.style.visibility = "";
      this.video.removeEventListener("ended", cachedBind(this, this.ended));
      this.video.removeEventListener("mousedown", cachedBind(this, this.Mr));
      this.video.removeEventListener("touchend", cachedBind(this, this.WE));
      URL.revokeObjectURL(this.url);
      this.LC();
    }
    Wj() {
      return Save.Ec == 0;
    }
    Qv() {
      if (this.uo) {
        return true;
      } else {
        return this.Wj();
      }
    }
    getName() {
      return "VideoScene";
    }
  }
  VideoScene.i = true;
  VideoScene.s = Scene;
  Object.assign(VideoScene.prototype, {
    l: VideoScene
  });
  class IntroVideoScene extends VideoScene {
    constructor() {
      super();
    }
    getPreloads() {
      // The intro video assets (res/video/intro_*.mp4) are not shipped
      // with the public game build, so we don't preload anything here.
      return [];
    }
    getData() {
      return null;
    }
    start() {
      // Skip the cinematic intro entirely - schedule the post-video
      // transition immediately. We deliberately don't call super.start()
      // because it would build a `<video>` element pointing at a 404.
      let self = this;
      setTimeout(function () { self.LC(); }, 0);
    }
    Oc() {
      // VideoScene.Oc() tears down event listeners we never registered,
      // so override with a no-op to avoid touching `this.kT` / `this.lT`.
    }
    LC() {
      LevelState.zk(1);
      LevelState.Ui(1);
      LevelState.sp(1);
      this.gk();
    }
    gk() {
      this.$(LevelScene);
    }
    init() {
      super.init();
      this.Uq();
    }
    start() {
      super.start();
      this.O.Xl(LevelScene);
    }
    getName() {
      return "IntroVideoScene";
    }
  }
  IntroVideoScene.i = true;
  IntroVideoScene.s = VideoScene;
  Object.assign(IntroVideoScene.prototype, {
    l: IntroVideoScene
  });
  class CTRCIntroVideoScene extends IntroVideoScene {
    constructor() {
      super();
    }
    TP() {
      try {
        this.video.muted = true;
      } catch (a) {}
    }
    jT() {
      try {
        if (!this.Wj()) {
          this.video.muted = false;
        }
      } catch (a) {}
    }
    gk() {
      let a = this;
      let b = CTRCLevelScene;
      SDK.trackLevelStart(currentLevelId(), function () {
        a.$(b);
      });
    }
    Qv() {
      if (super.Qv()) {
        return true;
      } else {
        return audioDisabled;
      }
    }
    Wj() {
      if (super.Wj()) {
        return true;
      } else {
        return audioDisabled;
      }
    }
    getName() {
      return "CTRCIntroVideoScene";
    }
  }
  CTRCIntroVideoScene.i = true;
  CTRCIntroVideoScene.s = IntroVideoScene;
  Object.assign(CTRCIntroVideoScene.prototype, {
    l: CTRCIntroVideoScene
  });
  class OutroVideoScene extends VideoScene {
    constructor() {
      super();
    }
    replacesPrevious() {
      return false;
    }
    getData() {
      let a = Loader.data.J[Loader.outroPortraitVid];
      return a ?? Loader.data.J[Loader.outroLandscapeVid];
    }
    getPreloads() {
      return [this.O.window.bo() > 1 ? Loader.outroLandscapeVid : Loader.outroPortraitVid];
    }
    LC() {
      this.Kf();
    }
    getName() {
      return "OutroVideoScene";
    }
  }
  OutroVideoScene.i = true;
  OutroVideoScene.s = VideoScene;
  Object.assign(OutroVideoScene.prototype, {
    l: OutroVideoScene
  });
  class SelectSeasonScene extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      return [Loader.fontDat, Loader.fontImg, Loader.menuBg, Loader.menuShadow, Loader.menuUi, Loader.menuUiJson, Loader.strings, Loader.menuSeasons, Loader.menuSeasonsJson, WebApplication.menuMusicId];
    }
    init() {
      super.init();
      this.ia(Loader.menuSeason1);
      this.ia(Loader.menuSeason2);
      this.ia(Loader.menuSeason3);
      this.eF();
      this.Vg();
      this.Ke(600, 900);
      this.sj();
      this.$k();
      Resources.Ig = this.createTexture(Loader.menuSeasons);
      this.Qz = 750 / Resources.Ig.hc.yf(Keys.Pt).ec.x;
      this.offsetY = 150;
      this.CE = Resources.Ig.hc.yf(Keys.Pt).ec.y * 0.7;
      this.Ig = [];
      let a = 0;
      while (a < 3) {
        var b = a++;
        let c = new Container(null, this.ra);
        new Sprite(c, Resources.Ig, Keys.Pt);
        new Sprite(c, Resources.Ig, [Keys.rJ, Keys.sJ, Keys.tJ][b]);
        c.center();
        c.setUniformScale(this.Qz);
        c.setX(300);
        c.setY(this.offsetY + b * this.CE);
        this.Ig.push(c);
        let d = new TextNode(c, Resources.ic);
        d.setX(312);
        d.setY(140);
        d.setFontSize(70);
        d.setAlign(0);
        d.setBoxSize(400, 100);
        d.setText(this.yb("SEASON_NO", Numeric.Ed(b + 1)));
        b = ButtonBase.create(Resources.Ig, Keys.uJ, Keys.vJ);
        b.setX(512);
        b.setY(285);
        b.j.center();
        c.appendChild(b.j);
        this.buttons.push(b);
        this.oa(b);
      }
      this.buttons[1].focus();
    }
    start() {
      super.start();
      this.sm();
      this.JD();
    }
    layout() {
      super.layout();
      let a = Math.min(Math.max(0, this.O.window.bo() - 1), 0.2);
      let b = 0;
      while (b < 3) {
        let c = b++;
        this.Ig[c].setUniformScale(this.Qz + a);
        this.Ig[c].setY(this.offsetY + c * (this.CE + a * 150));
      }
    }
    Oc() {
      super.Oc();
      Resources.Ig = null;
      this.ia(Loader.menuSeasons);
    }
    Pd() {
      if (this.hb(0)) {
        Save.flush();
        this.Mp(LevelState.box);
        this.Vb();
      } else {
        for (var a = 1; a < 4;) {
          let b = a++;
          if (this.hb(b)) {
            this.fN(b);
          }
        }
      }
    }
    fN(a) {
      if (a != LevelState.season) {
        this.ia([40, 38, 36][LevelState.season - 1]);
        Resources.Yb = null;
      }
      LevelState.zk(a);
      this.Mp(LevelState.box);
      switch (a) {
        case 1:
          LevelState.Ui(1);
          break;
        case 2:
          LevelState.Ui(6);
          break;
        case 3:
          LevelState.Ui(11);
      }
      this.$(this.hB()[a - 1]);
    }
    hB() {
      return [Season1Scene, Season2Scene, Season3Scene];
    }
    Vb() {
      this.$(MenuScene);
    }
    getName() {
      return "SelectSeasonScene";
    }
  }
  SelectSeasonScene.i = true;
  SelectSeasonScene.s = Scene;
  Object.assign(SelectSeasonScene.prototype, {
    l: SelectSeasonScene
  });
  class CTRCSelectSeasonScene extends SelectSeasonScene {
    constructor() {
      super();
    }
    hB() {
      return [CTRCSeason1Scene, CTRCSeason2Scene, CTRCSeason3Scene];
    }
    Vb() {
      this.$(CTRCMenuScene);
    }
    getName() {
      return "CTRCSelectSeasonScene";
    }
  }
  CTRCSelectSeasonScene.i = true;
  CTRCSelectSeasonScene.s = SelectSeasonScene;
  Object.assign(CTRCSelectSeasonScene.prototype, {
    l: CTRCSelectSeasonScene
  });
  class SelectBoxScene extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      return [Loader.fontDat, Loader.fontImg, Loader.menuBg, Loader.menuShadow, Loader.menuUi, Loader.menuUiJson, Loader.strings, WebApplication.menuMusicId];
    }
    init() {
      super.init();
      this.ub = LevelState.box;
      if (this.ub > 10) {
        this.ub -= 10;
      } else if (this.ub > 5) {
        this.ub -= 5;
      }
      this.state = 0;
      this.Vg();
      this.sj();
      this.Ke(650, 650);
      this.Yb = new Container(null, this.ra);
      this.Yb.setX(75);
      this.Yb.setY(75);
      this.offsetX = this.Yb.getX();
      this.advance = 500;
      var a = this.kv();
      var b = this.jv();
      switch (LevelState.season) {
        case 2:
          var c = 5;
          break;
        case 3:
          c = 7;
          break;
        default:
          c = 5;
      }
      this.il = c;
      this.Tz = [];
      for (var d = c = 0, e = this.il; d < e;) {
        ++d;
        var f = new Sprite(this.Yb);
        f.setColor(new Vec4(0.17647058823529413, 0.17647058823529413, 0.20784313725490197, 1), 300, 300);
        f.setX(100 + c);
        f.setY(150);
        this.Tz.push(f);
        c += this.advance;
      }
      this.Ka = new Sprite(this.Yb, Resources.Yb, Keys.$I);
      this.clipPath = new Bounds(0, 0, 177, 182);
      this.Fn = [];
      e = this.il;
      this.rm = e += LevelState.season < 3 ? 1 : 0;
      for (d = c = 0; d < e;) {
        f = d++;
        var g = this.Ir(f);
        let q = new Container(null, this.Yb);
        this.Fn.push(q);
        let p = f == this.il;
        q.setX(c);
        var h = null;
        if (p && LevelState.season < 3) {
          h = new Container(null, q);
          new Sprite(h, Resources.Yb, b[f]);
        } else {
          new Sprite(q, Resources.Yb, b[f]);
          var m = new Sprite(q, Resources.Yb, b[f]);
          m.setOrigin(m.X.x, 0);
          m.setScaleX(-1);
        }
        if (!p && LevelState.Ar(g)) {
          m = new Container(null, q);
          m.ox("lock");
          new Sprite(m, Resources.Yb, Keys.Ot);
          var n = new Sprite(m, Resources.Yb, Keys.Ot);
          n.setOrigin(n.X.x, 0);
          n.setScaleX(-1);
          m.center();
          n = Resources.Yb.hc.yf(Keys.Ot).ec;
          m.setX(m.getX() + n.x);
          m.setY(m.getY() + n.y / 2);
          if (LevelState.tv(g) > 0) {
            m = new Sprite(q, Resources.Wa, Keys.Tt);
            m.setX(260);
            m.setY(320);
            m.setUniformScale(0.7);
            n = new TextNode(q, Resources.ic);
            n.setBoxSize(80, m.getHeight());
            n.setAlign(1, 0);
            n.kx(-3);
            n.setText(Numeric.Ed(BOX_STAR_THRESHOLDS[g - 1]));
            n.setFontSize((m.getHeight() | 0) * 1.2);
            n.setX(m.getX() - 80);
            n.setY(m.getY());
          }
          if (LevelState.season == 3 && f == this.il - 1) {
            new Sprite(q, Resources.Yb, Keys.qJ);
            m = new TextNode(q, Resources.ic);
            m.setText(this.yb("MECH_HARDEST"));
            m.setBoxSize(184, 60);
            m.setFontSize(36);
            m.setAlign(0);
            m.setX(253);
            m.setY(425);
            m.la(-16);
          }
        }
        if (!p && LevelState.QA(g) == 75) {
          new Sprite(q, Resources.Yb, Keys.dJ);
        }
        if (p && LevelState.season < 3) {
          g = new TextNode(h, Resources.ic);
          g.setBoxSize(300, 100);
          g.setX(100);
          g.setY(206);
          g.setText(a[f]);
          g.setFontSize(60);
          g.Tf(true);
          g.Is(-40);
          g.setAlign(0, 0);
          h.centerOrigin();
          h.la(15);
        } else {
          h = new TextNode(q, Resources.ic);
          h.setBoxSize(400, 200);
          h.setX(56);
          h.setText(a[f]);
          h.setFontSize(70);
          h.Tf(true);
          h.setAlign(0);
          h.Is(-30);
          h.shape();
          h.setY(h.uv() == 1 ? 110 : 90);
        }
        c += this.advance;
      }
      this.Qc = [];
      for (a = 0; a < 2;) {
        ++a;
        b = new Sprite(null, Resources.Wa, Keys.mz);
        b.center();
        this.ra.appendChild(b);
        this.Qc.push(b);
      }
      this.$k();
      this.vb = this.add(ScoreLabel);
      a = LevelState.wv();
      this.vb.setText(a == null ? "null" : "" + a);
      this.ZL = new HitTestRect(this.ra.node, new Bounds(145, 145, 505, 505));
      this.pt();
      this.kq = true;
      this.tu = false;
      this.EA = true;
    }
    Qq() {
      this.$(SelectLevelScene);
    }
    pt() {
      if (this.ub > 1) {
        this.Qc[0].Fb(Keys.mz);
        this.Qc[0].Wd(1);
      } else {
        this.Qc[0].Fb(Keys.cL);
        this.Qc[0].Wd(2);
      }
      if (this.ub == this.rm) {
        this.Qc[1].Fb(Keys.aL);
        this.Qc[1].Wd(2);
      } else {
        this.Qc[1].Fb(Keys.bL);
        this.Qc[1].Wd(1);
      }
      this.Qc[0].setUniformScale(1);
      this.Qc[1].setUniformScale(1);
    }
    ux() {
      this.Cs = -1;
      this.hu();
      this.setState(1);
      this.Ie = -(this.ub - 1) * this.advance;
      this.x1 = this.Ie - this.advance * this.Cs;
      this.Ie += this.offsetX;
      this.x1 += this.offsetX;
      this.kq = this.ub != this.rm || LevelState.season == 3;
      this.ub--;
      this.pt();
      this.Qc[0].setUniformScale(0.9);
    }
    Qs() {
      this.Cs = 1;
      this.hu();
      this.setState(1);
      this.Ie = -(this.ub - 1) * this.advance;
      this.x1 = this.Ie - this.advance * this.Cs;
      this.Ie += this.offsetX;
      this.x1 += this.offsetX;
      this.kq = this.ub != this.il;
      this.ub++;
      this.pt();
      this.Qc[1].setUniformScale(0.9);
    }
    update(a) {
      super.update(a);
      if (this.De == "Running") {
        var b = this.O.hd().Nb(0);
        a = this.O.hd().qe(0);
        switch (this.state) {
          case 0:
            if (this.time > (this.EA ? 1 : 0) && !this.tu) {
              this.tu = true;
              this.EA = false;
              this.Uz();
            }
            if (this.Hq) {
              var c = this.O.hd().position[0];
              this.ng = c.x - this.yA.x;
              if (Math.abs(c.y - this.yA.y) < 50) {
                if (this.ng < -100 && this.ub < this.rm) {
                  this.Hq = false;
                  this.Qs();
                }
                if (this.ng > 100 && this.ub > 1) {
                  this.Hq = false;
                  this.ux();
                }
              }
            }
            c = this.ZL.Ub(this.pointer.pos);
            var d = this.Qc[0].Ub(this.pointer.pos);
            let e = this.Qc[1].Ub(this.pointer.pos);
            if (b) {
              this.buttons[0].blur();
              this.cp = this.ub > 1 && d;
              this.To = this.ub < this.rm && e;
              this.$L = this.ub <= this.rm && c;
              this.Hq = true;
              b = this.pointer.pos;
              this.yA = new Vec4(b.x, b.y, 0, 1);
              this.ng = 0;
            }
            if (a) {
              if (this.cp && d) {
                this.ux();
                SoundFx.play(SoundFx.button);
              }
              if (this.To && e) {
                this.Qs();
                SoundFx.play(SoundFx.button);
              }
              this.Hq = this.To = this.cp = false;
              if (this.$L && c && Math.abs(this.ng) < 10) {
                SoundFx.play(SoundFx.button);
                if (this.ub > this.il) {
                  if (this.Zo()) {
                    this.setState(4);
                  }
                } else {
                  a = this.Ir(this.ub - 1);
                  if (LevelState.Ar(a)) {
                    this.Ha.starCount = LevelState.tv(a);
                    this.Dg(MissingStarsPopup);
                  } else {
                    if (LevelState.box != a) {
                      this.Mp(LevelState.box);
                    }
                    LevelState.Ui(a);
                    this.Qq();
                    this.setState(4);
                  }
                }
              }
            }
            break;
          case 1:
            c = this.Ir(this.ub - 1);
            if (!(c <= 17) || !LevelState.Ar(c) || !LevelState.hA(c)) {
              c = this.Qc[0].Ub(this.pointer.pos);
              d = this.Qc[1].Ub(this.pointer.pos);
              if (b) {
                this.cp = this.ub > 1 && c;
                this.To = this.ub < this.rm && d;
              }
              if (a) {
                if (this.cp && c) {
                  this.Ka.setX(-(this.x1 - this.offsetX));
                  this.ux();
                  SoundFx.play(SoundFx.button);
                }
                if (this.To && d) {
                  this.Ka.setX(-(this.x1 - this.offsetX));
                  this.Qs();
                  SoundFx.play(SoundFx.button);
                }
                this.To = this.cp = false;
              }
            }
            a = this.jb(0.2);
            b = this.Ie;
            this.Yb.setX(b + (this.x1 - b) * Easing.quadOut()(a));
            b = -(this.Yb.getX() - this.offsetX);
            if (this.kq) {
              this.Ka.setX(b);
              b = b + this.Ie - this.offsetX;
              if (this.Cs > 0) {
                if (b > this.advance / 2) {
                  c = this.clipPath;
                  b = this.advance - b;
                  d = c.B - c.A;
                  c.A = b;
                  c.B = b + d;
                } else {
                  c = this.clipPath;
                  b = -b;
                  d = c.B - c.A;
                  c.A = b;
                  c.B = b + d;
                }
              } else {
                b = -b;
                if (b > this.advance / 2) {
                  c = this.clipPath;
                  b = -this.advance + b;
                  d = c.B - c.A;
                  c.A = b;
                  c.B = b + d;
                } else {
                  c = this.clipPath;
                  d = c.B - c.A;
                  c.A = b;
                  c.B = b + d;
                }
              }
              this.Ka.jE(this.clipPath);
            } else {
              this.Ka.jE(null);
            }
            if (a == 1) {
              this.tu = false;
              this.setState(2);
              this.pt();
            }
            break;
          case 2:
            a = this.Ir(this.ub - 1);
            if (LevelState.Ar(a) && LevelState.hA(a)) {
              this.Uz();
              this.setState(3);
              this.Fn[this.ub - 1].fo("lock").Jm();
              SoundFx.play(SoundFx.star_1);
              b = new PuffEffect();
              c = this.ih;
              b.j.setX((c.A + c.B) / 2);
              d = c = this.ih;
              b.j.setY((c.D + c.G) / 2 + (d.G - d.D) * 0.15);
              this.oa(b);
              this.node.P(b.j.u);
              LevelState.iT(a);
            } else {
              this.setState(0);
            }
            break;
          case 3:
            a = this.Fn[this.ub - 1].fo("lock");
            b = this.jb(1.5);
            a.setUniformScale(1 + b * 0.5);
            a.W(1 - b);
            a.pp(new ColorTransform().Vw(-b * 0.5));
            if (b == 1) {
              this.setState(0);
            }
        }
      }
    }
    setState(a) {
      this.state = a;
      this.time = 0;
    }
    Uz() {
      this.vu = this.oa(new BounceAnim(this.Fn[this.ub - 1]));
      this.GC = this.oa(new BounceAnim(this.Ka));
    }
    hu() {
      if (this.vu != null) {
        this.vu.dispose();
        this.GC.dispose();
        this.GC = this.vu = null;
      }
    }
    Ir(a) {
      a += 1;
      if (LevelState.season == 2) {
        a += 5;
      }
      if (LevelState.season == 3) {
        a += 10;
      }
      return a;
    }
    Zo() {
      return false;
    }
    getTransitionDuration(a) {
      if (a != null && a instanceof MissingStarsPopup) {
        return 1.5;
      } else {
        return super.getTransitionDuration(a);
      }
    }
    start() {
      super.start();
      this.sm();
      this.ia(Loader.menuBg2);
      Resources.we = null;
      Resources.Sz = null;
      if (this.caller != null && this.caller.Ha.boxComplete && LevelState.box != 17) {
        this.Qs();
      }
    }
    layout() {
      super.layout();
      this.hu();
      this.advance = 500;
      let a = this.fa.Se();
      if (!(a < 0.6)) {
        this.advance *= Math.min(1.5, remap(a, 0.6, 2, 1, 1.2));
      }
      var b = 0;
      for (var c = 0, d = this.Tz; c < d.length;) {
        let e = d[c];
        ++c;
        e.setX(100 + b);
        e.W(0.5);
        b += this.advance;
      }
      c = b = 0;
      for (d = this.Fn; c < d.length;) {
        d[c++].setX(b);
        b += this.advance;
      }
      this.Yb.setX(-(this.ub - 1) * this.advance + this.offsetX);
      if (this.kq) {
        this.Ka.setX(-(this.Yb.getX() - this.offsetX));
        this.setState(0);
      }
      b = this.Qc[0];
      c = this.Qc[1];
      if (a > 0.7) {
        b.setX(50);
        b.setY(325);
        c.setX(600);
        c.setY(325);
      } else {
        b.setX(250);
        b.setY(650);
        c.setX(400);
        c.setY(650);
      }
      this.$n(ScoreLabel, this).layout();
    }
    Pd() {
      if (this.hb(0)) {
        this.Vb();
      }
    }
    Vb() {
      this.$(SelectSeasonScene);
    }
    getName() {
      return "SelectBoxScene";
    }
  }
  SelectBoxScene.i = true;
  SelectBoxScene.s = Scene;
  Object.assign(SelectBoxScene.prototype, {
    l: SelectBoxScene
  });
  class Season1Scene extends SelectBoxScene {
    constructor() {
      super();
    }
    getPreloads() {
      return super.getPreloads().concat([Loader.menuSeason1, Loader.menuSeason1Json]);
    }
    Nd() {
      super.Nd();
      Resources.Yb = this.createTexture(Loader.menuSeason1);
    }
    Zo() {
      this.$(Season2Scene);
      return true;
    }
    kv() {
      let a = this.cr("BOX1_LABEL", "BOX2_LABEL", "BOX3_LABEL", "BOX4_LABEL", "BOX5_LABEL", "NEXT_SEASON");
      let b = 0;
      while (b < 5) {
        let c = b++;
        a[c] = c + 1 + ". " + a[c];
      }
      return a;
    }
    jv() {
      return [Keys.VI, Keys.WI, Keys.XI, Keys.YI, Keys.ZI, Keys.Xy];
    }
    getName() {
      return "Season1Scene";
    }
  }
  Season1Scene.i = true;
  Season1Scene.s = SelectBoxScene;
  Object.assign(Season1Scene.prototype, {
    l: Season1Scene
  });
  class CTRCSeason1Scene extends Season1Scene {
    constructor() {
      super();
    }
    Zo() {
      this.$(CTRCSeason2Scene);
      return true;
    }
    Vb() {
      this.$(CTRCSelectSeasonScene);
    }
    Qq() {
      this.$(CTRCSelectLevelScene);
    }
    getName() {
      return "CTRCSeason1Scene";
    }
  }
  CTRCSeason1Scene.i = true;
  CTRCSeason1Scene.s = Season1Scene;
  Object.assign(CTRCSeason1Scene.prototype, {
    l: CTRCSeason1Scene
  });
  class Season2Scene extends SelectBoxScene {
    constructor() {
      super();
    }
    getPreloads() {
      return super.getPreloads().concat([Loader.menuSeason2, Loader.menuSeason2Json]);
    }
    init() {
      if (this.caller != null && this.caller instanceof Season1Scene) {
        LevelState.zk(2);
        this.Mp(LevelState.box);
        LevelState.Ui(6);
      }
      super.init();
    }
    start() {
      super.start();
      this.ia(40);
    }
    Nd() {
      super.Nd();
      Resources.Yb = this.createTexture(Loader.menuSeason2);
    }
    Zo() {
      this.$(Season3Scene);
      return true;
    }
    kv() {
      let a = this.cr("BOX6_LABEL", "BOX7_LABEL", "BOX8_LABEL", "BOX9_LABEL", "BOX10_LABEL", "NEXT_SEASON");
      let b = 0;
      while (b < 5) {
        let c = b++;
        a[c] = c + 1 + 5 + ". " + a[c];
      }
      return a;
    }
    jv() {
      return [Keys.fJ, Keys.gJ, Keys.hJ, Keys.iJ, Keys.eJ, Keys.Xy];
    }
    getName() {
      return "Season2Scene";
    }
  }
  Season2Scene.i = true;
  Season2Scene.s = SelectBoxScene;
  Object.assign(Season2Scene.prototype, {
    l: Season2Scene
  });
  class CTRCSeason2Scene extends Season2Scene {
    constructor() {
      super();
    }
    Zo() {
      this.$(CTRCSeason3Scene);
      return true;
    }
    Vb() {
      this.$(CTRCSelectSeasonScene);
    }
    Qq() {
      this.$(CTRCSelectLevelScene);
    }
    getName() {
      return "CTRCSeason2Scene";
    }
  }
  CTRCSeason2Scene.i = true;
  CTRCSeason2Scene.s = Season2Scene;
  Object.assign(CTRCSeason2Scene.prototype, {
    l: CTRCSeason2Scene
  });
  class Season3Scene extends SelectBoxScene {
    constructor() {
      super();
    }
    getPreloads() {
      return super.getPreloads().concat([Loader.menuSeason3, Loader.menuSeason3Json]);
    }
    init() {
      if (this.caller != null && this.caller instanceof Season2Scene) {
        LevelState.zk(3);
        this.Mp(LevelState.box);
        LevelState.Ui(11);
      }
      super.init();
    }
    start() {
      super.start();
      this.ia(38);
    }
    Nd() {
      super.Nd();
      Resources.Yb = this.createTexture(Loader.menuSeason3);
    }
    kv() {
      let a = this.cr("BOX11_LABEL", "BOX12_LABEL", "BOX13_LABEL", "BOX14_LABEL", "BOX15_LABEL", "BOX16_LABEL", "BOX17_LABEL");
      let b = 0;
      while (b < 7) {
        let c = b++;
        a[c] = c + 1 + 10 + ". " + a[c];
      }
      return a.slice(0, 7);
    }
    jv() {
      return [Keys.jJ, Keys.kJ, Keys.lJ, Keys.mJ, Keys.nJ, Keys.oJ, Keys.pJ].slice(0, 7);
    }
    getName() {
      return "Season3Scene";
    }
  }
  Season3Scene.i = true;
  Season3Scene.s = SelectBoxScene;
  Object.assign(Season3Scene.prototype, {
    l: Season3Scene
  });
  class CTRCSeason3Scene extends Season3Scene {
    constructor() {
      super();
    }
    Vb() {
      this.$(CTRCSelectSeasonScene);
    }
    Qq() {
      this.$(CTRCSelectLevelScene);
    }
    getName() {
      return "CTRCSeason3Scene";
    }
  }
  CTRCSeason3Scene.i = true;
  CTRCSeason3Scene.s = Season3Scene;
  Object.assign(CTRCSeason3Scene.prototype, {
    l: CTRCSeason3Scene
  });
  class SelectLevelScene extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      let a = [Loader.fontDat, Loader.fontImg, Loader.menuShadow, Loader.menuUi, Loader.menuUiJson, Loader.menuCut, Loader.menuCutJson, Loader.menuShadow, Loader.strings, WebApplication.menuMusicId];
      let b = LevelState.box - 1;
      a.push([195, 190, 185, 180, 175, 170, 165, 159, 154, 149, 144, 139, 134, 129, 124, 119, 114][b]);
      a.push([196, 191, 186, 181, 176, 171, 166, 161, 155, 150, 145, 140, 135, 130, 125, 120, 115][b]);
      a.push([197, 192, 187, 182, 177, 172, 167, 162, 156, 151, 146, 141, 136, 131, 126, 121, 116][b]);
      return a;
    }
    DD(a) {
      this.PC(a);
    }
    PC(a) {
      LevelState.sp(a);
      SoundFx.play(SoundFx.button);
      this.state = 1;
      this.time = 0;
    }
    init() {
      super.init();
      this.fh.L(true);
      if (LevelCurtain.instance != null) {
        LevelCurtain.instance.dispose();
      }
      this.Ya = this.add(LevelCurtain);
      this.fa.back.P(this.Ya.node);
      this.state = 0;
      this.sj();
      this.$k();
      var a = 20;
      if (LevelState.uB()) {
        a = 0;
      }
      this.vo = new Container();
      var b = Resources.Wa.hc.yf(Keys.$p).ec;
      let c = b.x - a;
      let d = b.y;
      let e = 1;
      this.vi = new Grid2D(5, 5);
      let f = this;
      this.vi.forEach(function (g, h, m) {
        e += 1;
        g = new LevelDot(e - 1);
        f.vo.appendChild(g.j);
        g.j.setX(h * c);
        g.j.setY(m * d);
        return g;
      });
      this.vo.setX(-5);
      this.size = new Size(c * 5, d * 5);
      this.Ke(this.size.x, this.size.y);
      this.ra.appendChild(this.vo);
      for (a = this.vi.iterator(); a.fb();) {
        b = a.next();
        if (LevelState.LO(b.Ci)) {
          b.bS(LevelState.sv(b.Ci), LevelState.uB(b.Ci));
        }
      }
      for (a = this.vi.iterator(); a.fb();) {
        b = a.next();
        if (LevelState.sv(b.Ci) < 3) {
          b.focus();
          this.jh = b;
          break;
        }
      }
      if (this.jh == null) {
        a = this.vi;
        this.jh = a.N[a.Tb * 0];
      }
      this.jh.focus();
      this.vb = this.add(ScoreLabel);
      a = LevelState.QA();
      this.vb.setText(Numeric.Ed(a == 0 ? 0 : a));
      this.sm();
    }
    start() {
      super.start();
      this.O.Sa.Sf(Save.Ec ? 1 : 0);
    }
    dispose() {
      super.dispose();
      this.Ya = null;
    }
    Nd() {
      super.Nd();
      Resources.xj = this.createTexture([196, 191, 186, 181, 176, 171, 166, 161, 155, 150, 145, 140, 135, 130, 125, 120, 115][LevelState.box - 1]);
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 0:
          if (this.O.hd().oF(0)) {
            for (var b = this.vi.iterator(); b.fb();) {
              a = b.next();
              if (a.Ub(this.pointer.pos)) {
                b = this.jh;
                if (b != null) {
                  b.blur();
                }
                this.jh = a;
                this.jh.focus();
                break;
              }
            }
          }
          if (this.O.hd().Nb(0)) {
            for (a = this.vi.iterator(); a.fb();) {
              b = a.next();
              if (b.Ub(this.pointer.pos)) {
                this.Gv = b;
                break;
              }
            }
          }
          if (this.O.hd().qe(0) && this.Gv != null && this.Gv.Ub(this.pointer.pos)) {
            this.DD(this.Gv.Ci);
          }
          if (this.jh != null) {
            a = new Coord();
            b = this.vi;
            var c = this.jh.Ci - 1;
            a.y = c / b.Tb | 0;
            a.x = c % b.Tb;
            b = this.vi;
            c = this.jh.Ci - 1;
            a.y = c / b.Tb | 0;
            a.x = c % b.Tb;
          }
          break;
        case 1:
          a = this.jb(0.3);
          this.mi().bf(1 - a);
          if (a == 1) {
            this.Uq();
            this.Ya.DM();
            this.state = 2;
          }
          break;
        case 2:
          if (this.Ya.state == 0) {
            this.state = 3;
            this.Ya.remove();
            this.gk();
          }
      }
    }
    transitionOut(a, b) {
      if (b instanceof LevelScene) {
        if (a == 0) {
          this.fa.back.removeChild(this.Ya.node);
          this.fa.front.P(this.Ya.node);
        }
      } else {
        super.transitionOut(a, b);
        if (a == 1 && b instanceof SelectBoxScene) {
          this.Ya.dispose();
        }
      }
    }
    layout() {
      this.rd.y = this.size.y;
      this.vo.setY(0);
      let a = this.fa.Se();
      if (!this.O.Vj && a > 0.7) {
        this.rd.y += 400;
        this.vo.setY(200);
      }
      super.layout();
      this.Ya.layout();
      this.$n(ScoreLabel, this).layout();
    }
    Pd() {
      if (this.hb(0)) {
        this.Vb();
      }
    }
    Vb() {
      switch (LevelState.season) {
        case 1:
          this.$(Season1Scene);
          break;
        case 2:
          this.$(Season2Scene);
          break;
        case 3:
          this.$(Season3Scene);
      }
    }
    gk() {
      this.$(LevelScene);
    }
    getName() {
      return "SelectLevelScene";
    }
  }
  SelectLevelScene.i = true;
  SelectLevelScene.s = Scene;
  Object.assign(SelectLevelScene.prototype, {
    l: SelectLevelScene
  });
  class CTRCSelectLevelScene extends SelectLevelScene {
    constructor() {
      super();
    }
    DD(a) {
      LevelState.sp(a);
      let b = this;
      SDK.trackLevelStart(currentLevelId(), function () {
        SDK.showInterstitialAd("button:levelselection:level", function () {
          b.PC(a);
        });
      });
    }
    gk() {
      this.$(CTRCLevelScene);
    }
    Vb() {
      switch (LevelState.season) {
        case 1:
          this.$(CTRCSeason1Scene);
          break;
        case 2:
          this.$(CTRCSeason2Scene);
          break;
        case 3:
          this.$(CTRCSeason3Scene);
      }
    }
    getName() {
      return "CTRCSelectLevelScene";
    }
  }
  CTRCSelectLevelScene.i = true;
  CTRCSelectLevelScene.s = SelectLevelScene;
  Object.assign(CTRCSelectLevelScene.prototype, {
    l: CTRCSelectLevelScene
  });
  class LevelScene extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      // preview bridge: when a custom level is active, force every object
      // preload on so the level can use objects that the current box's
      // BOX_OBJECT_FLAGS bitmask wouldn't normally whitelist.
      let _customlevel = window.customleveldata != null;
      function a(d) {
        if (_customlevel) return true;
        return (BOX_OBJECT_FLAGS[c] & d) > 0;
      }
      let b = [Loader.fontDat, Loader.fontImg, Loader.menuUi, Loader.menuUiJson, Loader.menuCut, Loader.menuCutJson, Loader.strings, Loader.char1, Loader.char1Json, Loader.char2, Loader.char2Json, Loader.objHook, Loader.objHookJson, Loader.objStar, Loader.objStarJson, Loader.gameTut, Loader.gameTutJson, WebApplication.gameMusicId];
      b.push([97, 95, 93, 91, 89][Save.me]);
      b.push([98, 96, 94, 92, 90][Save.me]);
      let c = LevelState.box - 1;
      if (a(1)) {
        b.push(Loader.objBubble);
        b.push(Loader.objBubbleJson);
      }
      if (a(2)) {
        b.push(Loader.objSpikes);
        b.push(Loader.objSpikesJson);
      }
      if (a(4)) {
        b.push(Loader.objPump);
        b.push(Loader.objPumpJson);
      }
      if (a(8)) {
        b.push(Loader.objSpider);
        b.push(Loader.objSpiderJson);
      }
      if (a(64)) {
        b.push(Loader.objElectro);
        b.push(Loader.objElectroJson);
      }
      if (a(128)) {
        b.push(Loader.objSock);
        b.push(Loader.objSockJson);
      }
      if (a(512)) {
        b.push(Loader.objBouncer);
        b.push(Loader.objBouncerJson);
      }
      if (a(2048)) {
        b.push(Loader.objGravity);
        b.push(Loader.objGravityJson);
      }
      if (a(4096)) {
        b.push(Loader.objBlades);
        b.push(Loader.objBladesJson);
      }
      if (a(8192)) {
        b.push(Loader.objBee);
        b.push(Loader.objBeeJson);
      }
      if (a(16384)) {
        b.push(Loader.objVinyl);
        b.push(Loader.objVinylJson);
      }
      if (a(32768)) {
        b.push(Loader.objGhost);
        b.push(Loader.objGhostJson);
      }
      if (a(65536)) {
        b.push(Loader.objSteam);
        b.push(Loader.objSteamJson);
      }
      if (a(131072)) {
        b.push(Loader.objLantern);
        b.push(Loader.objLanternJson);
      }
      if (a(262144)) {
        b.push(Loader.objGap);
        b.push(Loader.objGapJson);
      }
      if (a(524288) || WebApplication.telekinesisEnabled) {
        b.push(Loader.objLighter);
        b.push(Loader.objLighterJson);
        b.push(Loader.char3);
        b.push(Loader.char3Json);
      }
      if (a(1048576)) {
        b.push(Loader.objTransporter);
        b.push(Loader.objTransporterJson);
      }
      if (WebApplication.telekinesisEnabled) {
        b.push(Loader.objSp);
        b.push(Loader.objSpJson);
      }
      b.push([194, 189, 184, 179, 174, 169, 164, 158, 153, 148, 143, 138, 133, 128, 123, 118, 113][c]);
      b.push([195, 190, 185, 180, 175, 170, 165, 159, 154, 149, 144, 139, 134, 129, 124, 119, 114][c]);
      b.push([196, 191, 186, 181, 176, 171, 166, 161, 155, 150, 145, 140, 135, 130, 125, 120, 115][c]);
      b.push([197, 192, 187, 182, 177, 172, 167, 162, 156, 151, 146, 141, 136, 131, 126, 121, 116][c]);
      b.push([198, 193, 188, 183, 178, 173, 168, 163, 157, 152, 147, 142, 137, 132, 127, 122, 117][c]);
      if (LevelState.box == 8) {
        b.push(Loader.box8Earth);
      }
      return b;
    }
    Oj() {
      if (LevelScene.freshBoot) {
        return 1;
      } else {
        return 0;
      }
    }
    init() {
      super.init();
      LevelScene.pendingLevelJump = -1;
      LevelScene.pendingRestart = false;
      LevelScene.ev = false;
      this.Go = 0;
      this.Sm = this.O.jd && this.O.window.Hc.x == 1920;
      this.fh.L(false);
      this.np = new ColorRectShape(null, new Vec4(1, 1, 1, 1));
      this.S = new LevelController(this);
      var a = ButtonBase.create(null, Keys.AK, Keys.BK);
      this.buttons.push(a);
      this.node.P(a.j.u);
      a = ButtonBase.create(null, Keys.CK, Keys.DK);
      this.buttons.push(a);
      this.node.P(a.j.u);
      if (WebApplication.externalMute) {
        a = ButtonBase.create(null, Keys.zK, Keys.yK, Keys.ez);
        a.icon.L(!Save.Ec);
        this.buttons.push(a);
        this.node.P(a.j.u);
        a = ButtonBase.create(null, Keys.FK, Keys.EK, Keys.ez);
        a.icon.L(!Save.Bd);
        this.buttons.push(a);
        this.node.P(a.j.u);
      }
      if (WebApplication.magnetEnabled) {
        this.tO();
      }
      if (WebApplication.telekinesisEnabled) {
        this.wO();
      }
      this.uf(false);
      this.vb = new Container();
      this.node.P(this.vb.u);
      for (a = 0; a < 3;) {
        ++a;
        new Sprite(this.vb, Resources.Wa, HUD_STAR_FRAME_0).center();
      }
      a = this.vb.nb(0).getWidth();
      var b = this.vb.nb(0);
      b.setX(b.getX() - a);
      b = this.vb.nb(2);
      b.setX(b.getX() + a);
      a = this.O.jd ? this.Sm ? 40 : 80 : 60;
      this.ee = new Container();
      b = new TextNode(this.ee, Resources.ic);
      b.setBoxSize(200, a);
      b.setText(this.yb("LEVEL"));
      b.setMultiline();
      b = new TextNode(this.ee, Resources.ic);
      b.setY(a * 0.9);
      b.setBoxSize(200, a);
      this.gF();
      this.node.P(this.ee.u);
      this.Vo = this.state = this.ti = this.so = 0;
      this.tm = this.hg = false;
    }
    Oc() {
      super.Oc();
      if (this.Ya != null) {
        this.Ya.remove();
      }
      let a = 0;
      let b = [27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7];
      while (a < b.length) {
        this.ia(b[a++]);
      }
    }
    Nd() {
      super.Nd();
      let a = LevelState.box - 1;
      if (Resources.I == null) {
        Resources.I = this.createTexture([97, 95, 93, 91, 89][Save.me]);
        Resources.Fu = this.createTexture(Loader.char1);
        Resources.iM = this.createTexture(Loader.char2);
        Resources.eT = this.createTexture(Loader.gameTut);
        Resources.Oa = this.createTexture(Loader.objStar);
        Resources.ph = this.createTexture(Loader.objHook);
      }
      if (Resources.ca == null && Loader.ob(Loader.objBubble)) {
        Resources.ca = this.createTexture(Loader.objBubble);
      }
      if (Resources.Dd == null && Loader.ob(Loader.objSpikes)) {
        Resources.Dd = this.createTexture(Loader.objSpikes);
      }
      if (Resources.wm == null && Loader.ob(Loader.objPump)) {
        Resources.wm = this.createTexture(Loader.objPump);
      }
      if (Resources.mc == null && Loader.ob(Loader.objSpider)) {
        Resources.mc = this.createTexture(Loader.objSpider);
      }
      if (Resources.ce == null && Loader.ob(Loader.objElectro)) {
        Resources.ce = this.createTexture(Loader.objElectro);
      }
      if (Resources.Dk == null && Loader.ob(Loader.objSock)) {
        Resources.Dk = this.createTexture(Loader.objSock);
      }
      if (Resources.fd == null && Loader.ob(Loader.objBouncer)) {
        Resources.fd = this.createTexture(Loader.objBouncer);
      }
      if (Resources.Kb == null && Loader.ob(Loader.objGravity)) {
        Resources.Kb = this.createTexture(Loader.objGravity);
        if (LevelState.box == 8) {
          Resources.Xn = this.createTexture(Loader.box8Earth);
        }
      }
      if (Resources.gl == null && Loader.ob(Loader.objBlades)) {
        Resources.gl = this.createTexture(Loader.objBlades);
      }
      if (Resources.Ld == null && Loader.ob(Loader.objBee)) {
        Resources.Ld = this.createTexture(Loader.objBee);
      }
      if (Resources.Tc == null && Loader.ob(Loader.objVinyl)) {
        Resources.Tc = this.createTexture(Loader.objVinyl);
      }
      if (Resources.de == null && Loader.ob(Loader.objGhost)) {
        Resources.de = this.createTexture(Loader.objGhost);
      }
      if (Resources.Kk == null && Loader.ob(Loader.objSteam)) {
        Resources.Kk = this.createTexture(Loader.objSteam);
      }
      if (Resources.Ai == null && Loader.ob(Loader.objLantern)) {
        Resources.Ai = this.createTexture(Loader.objLantern);
      }
      if (Resources.wf == null && Loader.ob(Loader.objGap)) {
        Resources.wf = this.createTexture(Loader.objGap);
      }
      if (Resources.Ef == null && Loader.ob(Loader.objLighter)) {
        Resources.Ef = this.createTexture(Loader.objLighter);
      }
      if (Resources.Rc == null && Loader.ob(Loader.objTransporter)) {
        Resources.Rc = this.createTexture(Loader.objTransporter);
      }
      if (Resources.Kd == null && Loader.ob(Loader.objSp)) {
        Resources.Kd = this.createTexture(Loader.objSp);
      }
      if (Resources.ml == null && Loader.ob(Loader.char3)) {
        Resources.ml = this.createTexture(Loader.char3);
      }
      if (Resources.wq == null) {
        Resources.wq = this.createTexture([194, 189, 184, 179, 174, 169, 164, 158, 153, 148, 143, 138, 133, 128, 123, 118, 113][a]);
        Resources.xj = this.createTexture([196, 191, 186, 181, 176, 171, 166, 161, 155, 150, 145, 140, 135, 130, 125, 120, 115][a]);
        Resources.uu = this.createTexture([198, 193, 188, 183, 178, 173, 168, 163, 157, 152, 147, 142, 137, 132, 127, 122, 117][a]);
      }
    }
    start() {
      super.start();
      LevelScene.freshBoot = false;
      let a = this;
      switch (this.state) {
        case 0:
          this.FQ();
          this.S.show();
          this.Ya = LevelCurtain.instance;
          if (this.Ya == null) {
            this.uf(true);
            this.setState(1);
            break;
          }
          this.oa(this.Ya);
          this.Ya.dF(function () {
            a.Ya.dispose();
            a.uf(true);
          });
          this.Lw();
          this.setState(1);
          break;
        case 4:
          this.Hs(true);
          this.setState(1);
          this.buttons[1].Ad(false);
          break;
        case 9:
          this.S.dispose();
          this.S = new LevelController(this);
          this.S.show();
          this.S.update(0.016666666666666666);
          this.Ya.dF(function () {
            a.Ya.dispose();
            a.uf(true);
          });
          this.setState(1);
          this.uf(false);
          this.Lw();
          this.gF();
          this.oE();
      }
    }
    uw(a) {
      this.vb.nb(a - 1).pa().play(HUD_STAR_ANIM);
      this.Vo++;
    }
    rw() {
      this.hg = true;
      new Sprite(this.vb, Resources.Wa, HUD_STAR_FRAME_0).center();
      let a = this.vb.nb(0).getWidth();
      let b = a * -1.5;
      let c = 0;
      while (c < 4) {
        this.vb.nb(c++).setX(b);
        b += a;
      }
      this.vb.nb(3).pa().play(HUD_STAR_ANIM);
    }
    tw() {
      this.uf(false);
      this.mp();
      this.tm = false;
    }
    fQ() {
      LevelState.TR(Math.max(LevelState.sv(), this.Vo), this.hg);
      SoundFx.Zn(SoundFx.monster_chewing);
      this.setState(5);
      this.zl();
    }
    eQ() {
      this.uf(false);
      this.mp();
      this.tm = false;
    }
    JC() {
      if (this.state == 1) {
        if (LevelScene.am != -1 && (this.Go++, this.Go == LevelScene.am)) {
          this.Go = 0;
          let a = 1;
          let b = this.buttons.length;
          while (a < b) {
            this.buttons[a++].Ad(true);
          }
          // preview bridge: skip the curtain (box-closing) fail animation
          // in custom-level mode so CD()->Of() can run the white-fade
          // restart while state is still 1 (Of() guards on state == 1).
          if (window.customleveldata == null) {
            this.setState(6);
            this.zl();
          }
        }
        this.CD();
      }
    }
    zl() {
      this.Ya = this.add(LevelCurtain);
      this.Ya.ZD();
      this.node.P(this.Ya.node);
      this.Ya.JA();
    }
    tO() {
      this.td = new AdPowerupButtonA();
      this.buttons.push(this.td);
      this.node.P(this.td.j.u);
    }
    wO() {
      this.ne = new AdPowerupButtonB();
      this.buttons.push(this.ne);
      this.node.P(this.ne.j.u);
    }
    mp() {
      if (WebApplication.magnetEnabled) {
        this.td.reset();
      }
      if (WebApplication.telekinesisEnabled) {
        this.ne.reset();
      }
    }
    uf(a) {
      let b = 1;
      let c = this.buttons.length;
      while (b < c) {
        this.buttons[b++].Ad(a ? false : true);
      }
    }
    CD() {
      this.Of();
    }
    Of() {
      if (this.state == 1 && !this.S.Cm) {
        this.S.Cm = true;
        this.Lw();
        this.node.P(this.np.u);
        this.np.W(0);
        this.uf(false);
        this.mp();
        this.setState(2);
      }
    }
    tx() {
      this.Dg(PauseScene);
    }
    setState(a) {
      this.state = a;
      this.time = 0;
      if (a == 1) {
        this.tm = true;
        this.vs = 0;
      }
    }
    Lw() {
      this.hg = false;
      this.Vo = 0;
      if (this.vb.Mj() == 4) {
        this.vb.nb(3).free();
      }
      var a = this.vb.nb(0).getWidth();
      this.vb.nb(0).setX(-a);
      this.vb.nb(1).setX(0);
      this.vb.nb(2).setX(a);
      for (a = 0; a < 3;) {
        this.vb.nb(a++).Fb(HUD_STAR_FRAME_0);
      }
    }
    oE() {
      this.ti = this.so = 0;
      this.ee.L(true);
    }
    gF() {
      let a = this.ee.nb(1);
      a.setFontSize(100);
      a.setText("" + LevelState.box + " - " + LevelState.level);
      a.setMultiline();
    }
    Hs(a) {
      this.vb.L(a);
      this.buttons[1].L(a);
      this.buttons[2].L(a);
      if (a && !WebApplication.externalPause) {
        this.buttons[1].L(a);
      }
      if (WebApplication.externalMute) {
        this.buttons[3].L(a);
        this.buttons[4].L(a);
      }
      if (WebApplication.magnetEnabled) {
        this.td.L(a);
      }
      if (WebApplication.telekinesisEnabled) {
        this.ne.L(a);
      }
    }
    update(a) {
      super.update(a);
      this.ti += a;
      switch (this.so) {
        case 0:
          var b = Math.min(this.ti / 0.5, 1);
          if (b == 1) {
            this.so = 1;
            this.ti = 0;
          }
          this.ee.W(Easing.quadOut()(b));
          break;
        case 1:
          if (this.ti > 1) {
            this.so = 2;
            this.ti = 0;
          }
          break;
        case 2:
          b = Math.min(this.ti / 0.5, 1);
          if (b == 1) {
            this.so = 3;
            this.ee.L(false);
          }
          this.ee.W(Easing.quadOut()(1 - b));
      }
      LevelScene.isPlaying = this.state == 1;
      switch (this.state) {
        case 1:
          this.sB();
          this.S.update(a);
          this.VQ(a);
          if (LevelScene.pendingLevelJump != -1) {
            SoundFx.stop(SoundFx.monster_chewing);
            this.tm = false;
            this.mp();
            this.uf(false);
            a = LevelState.xN(LevelScene.pendingLevelJump);
            this.Ha.box = a[0];
            this.Ha.level = a[1];
            LevelScene.pendingLevelJump = -1;
            this.FD();
            this.state = 9;
          }
          if (LevelScene.pendingRestart) {
            LevelScene.pendingRestart = false;
            SoundFx.stop(SoundFx.monster_chewing);
            this.tm = false;
            this.mp();
            this.uf(false);
            this.zl();
            this.setState(8);
          }
          if (LevelScene.ev) {
            LevelScene.ev = false;
            a = LevelScene.am;
            LevelScene.am = 1;
            this.Go = 0;
            this.JC();
            LevelScene.am = a;
          }
          break;
        case 2:
          a = this.jb(window.customleveldata != null ? 0.25 : 0.15);
          this.np.W(a);
          if (a == 1) {
            this.S.dispose();
            this.S = new LevelController(this);
            this.S.show();
            this.setState(3);
          }
          break;
        case 3:
          this.S.update(a);
          a = this.jb(window.customleveldata != null ? 0.5 : 0.2);
          this.np.W(1 - a);
          if (a == 1) {
            this.node.removeChild(this.np.u);
            this.setState(1);
            this.uf(true);
            this.oE();
          }
          break;
        case 4:
          this.S.update(0);
          break;
        case 5:
          this.S.update(a);
          if (this.Ya.state == 7) {
            this.Ya.state = 0;
            this.state = 9;
            this.nE();
          }
          break;
        case 6:
          this.S.update(a);
          if (this.Ya.state == 7) {
            this.state = 9;
            this.Ha.count = this.Go;
            this.pE();
          }
          break;
        case 7:
          this.S.update(a);
          break;
        case 8:
          this.S.update(a);
          if (this.Ya.state == 7) {
            this.Ya.state = 0;
            this.state = 9;
            this.$(MenuScene);
          }
      }
    }
    iq(a) {
      super.iq(a);
      this.resize();
    }
    Pd() {
      if (this.state != 7) {
        var a = this.O.lh().Nb(112);
        if (this.O.lh().Nb(173) || this.O.lh().Nb(461)) {
          a = true;
        }
        if (WebApplication.externalPause && (this.hb(1) || a)) {
          if (this.state != 1) {
            this.buttons[1].Ad(false);
            return;
          }
          SoundFx.Xi(SoundFx.monster_chewing, 0);
          this.S.Ml();
          this.sB();
          this.Hs(false);
          this.setState(4);
          this.zD();
        }
        if (this.hb(2)) {
          this.BD();
        }
        if (WebApplication.externalMute) {
          if (this.hb(3)) {
            this.Lk(this.buttons[3]);
          }
          if (this.hb(4)) {
            this.Mk(this.buttons[4]);
          }
        }
        if (!this.S.Rl && !this.S.Ve) {
          if (WebApplication.magnetEnabled && this.hb(WebApplication.externalMute ? 5 : 3)) {
            if (AdPowerupButtonA.Mf == 0) {
              this.yD();
            } else {
              this.td.use();
              if (WebApplication.telekinesisEnabled) {
                this.ne.pm = true;
              }
              this.S.GL();
              if (!Save.Ho) {
                Save.Ho = true;
                Save.flush();
                a = new LevelToast(Strings.get("MAGNET_TIP"));
                this.node.P(a.j.u);
                this.oa(a);
              }
            }
          }
          if (WebApplication.telekinesisEnabled && this.hb(WebApplication.externalMute ? 6 : 4)) {
            if (AdPowerupButtonB.Mf == 0) {
              this.ED();
            } else {
              this.ne.use();
              if (WebApplication.magnetEnabled) {
                this.td.pm = true;
              }
              this.S.HL();
              if (!Save.Dp) {
                Save.Dp = true;
                Save.flush();
                a = new LevelToast(Strings.get("ANTIMAGNET_TIP"));
                this.node.P(a.j.u);
                this.oa(a);
              }
            }
          }
        }
      }
    }
    transitionOut(a, b) {
      if (b instanceof SelectBoxScene) {
        this.fh.L(true);
        if (a == 1 && b instanceof SelectBoxScene) {
          LevelCurtain.instance.dispose();
        }
      }
      if (b instanceof MenuScene) {
        this.fh.L(true);
        if (a == 1 && b instanceof MenuScene) {
          LevelCurtain.instance.dispose();
        }
      }
      if (b instanceof WarpScene) {
        this.fh.L(true);
      }
      super.transitionOut(a, b);
    }
    getTransitionDuration(a) {
      if (a instanceof PauseScene) {
        return 0;
      } else {
        return super.getTransitionDuration(a);
      }
    }
    render(a) {
      if (this.state != 0) {
        let b = this.S;
        if (b != null) {
          b.render(a);
        }
      }
      super.render(a);
    }
    VQ(a) {
      if (!!this.tm && (!!WebApplication.magnetEnabled || !!WebApplication.telekinesisEnabled) && !this.S.Rl && !this.S.Ve) {
        this.vs += a;
        if (this.vs >= 1) {
          this.vs = 0;
          a = this.tr();
          if (WebApplication.magnetEnabled) {
            this.td.ND(a);
          }
          if (WebApplication.telekinesisEnabled) {
            this.ne.ND(a);
          }
        }
      }
    }
    tr() {
      return true;
    }
    resize() {
      var a = this.O.window.lo();
      var b = window.devicePixelRatio;
      var c = b < 1 ? 1 : b > 2 ? 2 : b;
      var d = this.O.window.bp;
      var e = this.fa.Se();
      b = e > 1;
      c = c <= 1 ? 0.05 : c <= 1.25 ? 0.06 : 0.07;
      if (this.O.Vj) {
        c = (c = Math.min(a.w, a.J) <= 800 && Math.max(a.w, a.J) <= 1280 && d <= 2) ? 0.08 : 0.04;
      }
      if (this.O.jd) {
        c = 0.04;
      }
      c = Math.max(a.w, a.J) * c * d;
      if (!this.O.Vj) {
        if (c < 70) {
          c = 70;
        }
      }
      if (b) {
        c *= 0.9;
      }
      let f = 30;
      var g = 0;
      if (this.O.jd) {
        g = d * 25;
        f = 60;
      }
      this.vb.setUniformScale(c / 150);
      var h = 0;
      if (this.O.jd) {
        h = 20;
      }
      this.vb.setX(a.w / 2);
      var m = this.O.jd ? this.Sm ? 0.75 : 1.4 : 1;
      var n = this.buttons[1];
      if (WebApplication.externalPause) {
        n.j.setUniformScale(c / n.ec.y * m);
        n.up(a.w - h - g);
        n.setY(0);
      } else {
        n.L(false);
      }
      d = this.buttons[2];
      d.j.setUniformScale(c / d.ec.y * m);
      if (WebApplication.externalPause) {
        d.up(n.getX() - h);
      } else {
        d.up(a.w - h);
      }
      d.setY(0);
      n = null;
      if (WebApplication.externalMute) {
        var q = this.buttons[3];
        q.j.setUniformScale(c / q.ec.y * m);
        q.up(d.getX() - h);
        q.setY(0);
        n = this.buttons[4];
        n.j.setUniformScale(c / n.ec.y * m);
        n.up(q.getX() - h);
        n.setY(0);
      }
      if (WebApplication.magnetEnabled) {
        q = c / this.td.ec.y * m;
        this.td.setX(g);
        this.td.j.setUniformScale(q);
      }
      if (WebApplication.telekinesisEnabled) {
        this.ne.j.setUniformScale(c / this.td.ec.y * m);
        if (WebApplication.magnetEnabled) {
          this.ne.setX(this.td.getX() + this.td.getWidth() + h);
        } else {
          this.ne.setX(g);
        }
      }
      h = 1;
      for (m = this.buttons.length; h < m;) {
        this.buttons[h++].j.setY(g);
      }
      this.vb.setY(d.getY() + d.getHeight() / 2);
      if (e < 0.8) {
        e = WebApplication.magnetEnabled && WebApplication.telekinesisEnabled ? this.ne.yv() : WebApplication.magnetEnabled ? this.td.yv() : WebApplication.telekinesisEnabled ? this.ne.yv() : 0;
        g = WebApplication.externalMute ? n.getX() : d.getX();
        this.vb.setX(e + (g - e) / 2);
        if (g - e < this.vb.getWidth()) {
          e = this.vb;
          e.setY(e.getY() + this.vb.getHeight() * 1.25);
        }
      }
      this.ee.setUniformScale(c / 100);
      this.ee.setX(f);
      this.ee.setY(a.J - this.ee.getHeight() * 1.1 - f);
      if (this.O.Vj && b) {
        a = this.ee;
        a.setX(a.getX() + 20);
        a = this.ee;
        a.setY(a.getY() - 20);
      }
    }
    yD() {
      this.setState(7);
      DelayedCall.delay(cachedBind(this, this.KC), 1000);
    }
    KC() {
      this.td.fill(WebApplication.magnetRefill);
      SoundFx.play(SoundFx.pump_4);
      this.S.Ml();
      this.setState(1);
    }
    iQ() {
      this.S.Ml();
      this.td.reject();
      this.setState(1);
    }
    ED() {
      this.setState(7);
      DelayedCall.delay(cachedBind(this, this.RC), 1000);
    }
    RC() {
      this.ne.fill(WebApplication.telekinesisRefill);
      SoundFx.play(SoundFx.pump_4);
      this.S.Ml();
      this.setState(1);
    }
    qQ() {
      this.S.Ml();
      this.ne.reject();
      this.setState(1);
    }
    zD() {
      this.tx();
    }
    FD() {
      this.$(WarpScene);
    }
    Lk(a) {
      Save.Ec = !Save.Ec;
      Save.flush();
      a.icon.L(!Save.Ec);
      a.Ad(false);
      a.ke = 0;
      this.O.Sa.Sf(Save.Ec ? 1 : 0);
    }
    Mk(a) {
      Save.Bd = !Save.Bd;
      Save.flush();
      a.icon.L(!Save.Bd);
      a.Ad(false);
      a.ke = 0;
    }
    BD() {
      this.Of();
    }
    sB() {
      let a = this.O.hd();
      let b = this.O.Qj();
      let c = 0;
      let d = vA6;
      while (c < d.length) {
        let f = d[c];
        ++c;
        var e = a.position[f];
        e = new Size(e.x, e.y);
        let g = b.bO(f);
        if (a.Nb(f)) {
          this.S.WS(e, g);
        }
        if (a.oF(f)) {
          this.S.XS(e, g);
        }
        if (a.qe(f)) {
          this.S.YS(e, g);
        }
      }
    }
    nE() {
      this.Ha.stars = this.Vo;
      this.Ha.blueStar = this.hg;
      this.Dg(LevelClearedOverlay);
    }
    pE() {
      this.Dg(LevelLostOverlay);
    }
    getName() {
      return "LevelScene";
    }
  }
  LevelScene.i = true;
  LevelScene.s = Scene;
  Object.assign(LevelScene.prototype, {
    l: LevelScene
  });
  class CTRCLevelScene extends LevelScene {
    constructor() {
      super();
      LevelScene.am = 1;
      this.Ox = false;
    }
    tr() {
      return SDK.hasRewardedAd();
    }
    yD() {
      this.setState(7);
      SDK.trackDesignEvent("game:powerup:magnet:rewarded");
      let a = this;
      SDK.showRewardedAd(function (b) {
        if (b) {
          a.KC();
        } else {
          a.iQ();
        }
      });
    }
    ED() {
      this.setState(7);
      SDK.trackDesignEvent("game:powerup:telekinesis:rewarded");
      let a = this;
      SDK.showRewardedAd(function (b) {
        if (b) {
          a.RC();
        } else {
          a.qQ();
        }
      });
    }
    tw() {
      if (LevelState.level == 25 && Save.Df[LevelState.box - 1][LevelState.level] == null) {
        let a = Strings.get("BOX1_LABEL BOX2_LABEL BOX3_LABEL BOX4_LABEL BOX5_LABEL BOX6_LABEL BOX7_LABEL BOX8_LABEL BOX9_LABEL BOX10_LABEL BOX11_LABEL BOX12_LABEL BOX13_LABEL BOX14_LABEL BOX15_LABEL BOX16_LABEL BOX17_LABEL".split(" ")[LevelState.box - 1]);
        SDK.trackEvent("EVENT_CUSTOM", {
          eventName: "BOX_CLEARED",
          boxId: LevelState.box,
          boxName: a
        });
      }
      this.Ox = true;
      super.tw();
    }
    Mk(a) {
      super.Mk(a);
      SDK.trackVolumeChange(Save.Ec ? 1 : 0, Save.Bd ? 1 : 0);
    }
    Lk(a) {
      super.Lk(a);
      SDK.trackVolumeChange(Save.Ec ? 1 : 0, Save.Bd ? 1 : 0);
    }
    zD() {
      let a = this;
      SDK.trackPause(function () {
        SDK.showInterstitialAd("button:level:pause", cachedBind(a, a.tx));
      });
    }
    tx() {
      this.Dg(CTRCPauseScene);
    }
    BD() {
      let a = this;
      SDK.trackLevelRestart(currentLevelId(), function () {
        a.Hs(false);
        SDK.showInterstitialAd("button:level:restart", function () {
          a.Hs(true);
          a.Of();
        });
      });
    }
    CD() {
      // preview bridge: skip SDK tracking / interstitial in custom-level
      // mode so the white-fade restart runs immediately.
      if (window.customleveldata != null) {
        this.Of();
        return;
      }
      let a = this;
      SDK.trackLevelEnd(LevelState.Nj(), "fail", function () {
        SDK.trackLevelFail("dead", currentLevelId(), function () {
          SDK.showInterstitialAd("break:fail", cachedBind(a, a.Of));
        });
      }, function () {
        a.Of();
      });
    }
    FD() {
      this.$(CTRCWarpScene);
    }
    uw(a) {
      super.uw(a);
      SDK.trackLiveScore(a);
    }
    nE() {
      this.Ha.stars = this.Vo;
      this.Ha.blueStar = this.hg;
      this.Dg(CTRCLevelClearedOverlay);
    }
    zl() {
      let a = this;
      if (this.state == 5 && this.Ox) {
        SDK.trackLevelEnd(LevelState.Nj(), "success", function () {
          a.Ox = false;
          a.zl();
        }, function () {});
      } else {
        super.zl();
      }
    }
    pE() {
      // preview bridge: in custom-level mode, skip the fail overlay and just
      // trigger the white-fade restart flow directly (durations bumped to
      // 0.5s by the patched case 2 / case 3 in LevelScene.update).
      if (window.customleveldata != null) {
        this.Of();
        return;
      }
      this.Dg(CTRCLevelLostOverlay);
    }
    getName() {
      return "CTRCLevelScene";
    }
  }
  CTRCLevelScene.i = true;
  CTRCLevelScene.s = LevelScene;
  Object.assign(CTRCLevelScene.prototype, {
    l: CTRCLevelScene
  });

  class LevelState {
    static reset() {
      LevelState.season = 1;
      LevelState.box = 1;
      LevelState.level = 1;
    }
    static xN(a) {
      return [1 + ((a - 1) / 25 | 0), (a - 1) % 25 + 1];
    }
    static zk(a) {
      LevelState.season = a;
    }
    static Ui(a) {
      LevelState.box = a;
    }
    static sp(a) {
      LevelState.level = a;
    }
    static TR(a, b) {
      let c = LevelState.box - 1;
      let d = LevelState.level - 1;
      Save.wg[c][d] = a;
      Save.ig[c][d] = b ? 1 : 0;
      if (d < 25) {
        Save.Df[c][d + 1] = true;
      }
      Save.flush();
    }
    static QN() {
      return Save.Mi.length;
    }
    static QB(a) {
      return Save.Mi.includes("" + LevelMath.PA(a) + "-" + LevelMath.rv(a));
    }
    static OO() {
      switch (LevelState.box) {
        case 1:
          return [-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1][LevelState.level] == 1;
        case 2:
          return [-1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0][LevelState.level] == 1;
        default:
          return false;
      }
    }
    static mO() {
      if (!LevelState.OO() || Save.Mi.includes("" + LevelState.box + "-" + LevelState.level)) {
        return false;
      }
      Save.Mi.push("" + LevelState.box + "-" + LevelState.level);
      Save.kk++;
      Save.flush();
      return true;
    }
    static LO(a) {
      return Save.Df[LevelState.box - 1][a - 1];
    }
    static Ar(a) {
      return Save.locked[a - 1];
    }
    static hA(a) {
      return LevelState.tv(a) <= 0;
    }
    static iT(a) {
      Save.locked[a - 1] = false;
      Save.Df[a - 1][0] = true;
      Save.flush();
    }
    static tv(a) {
      --a;
      return BOX_STAR_THRESHOLDS[a] - LevelState.wv();
    }
    static hl() {
      return LevelState.level == 25;
    }
    static nS() {
      LevelState.sp(LevelState.level + 1);
    }
    static Nj() {
      let a = 0;
      let b = LevelState.season;
      let c = 0;
      while (c < 3) {
        LevelState.season = c++ + 1;
        a += LevelState.wv();
      }
      LevelState.season = b;
      return a;
    }
    static wv() {
      var a = 0;
      var b = 0;
      let c = 0;
      switch (LevelState.season) {
        case 1:
          a = 0;
          b = 5;
          break;
        case 2:
          a = 5;
          b = 10;
          break;
        case 3:
          a = 10;
          b = 17;
      }
      while (a < b) {
        let d = a++;
        let e = 0;
        while (e < 25) {
          let f = e++;
          c += Save.wg[d][f];
          c += Save.ig[d][f];
        }
      }
      return c;
    }
    static QL() {
      let a = 0;
      while (a < 17) {
        let b = a++;
        let c = 0;
        while (c < 25) {
          if (!Save.Df[b][c++]) {
            return false;
          }
        }
      }
      return true;
    }
    static QA(a) {
      if (a == null) {
        a = LevelState.box;
      }
      let b = 0;
      let c = 0;
      while (c < 25) {
        let d = c++;
        b += Save.wg[a - 1][d];
        b += Save.ig[a - 1][d];
      }
      return b;
    }
    static sv(a) {
      if (a == null) {
        a = LevelState.level;
      }
      return Save.wg[LevelState.box - 1][a - 1];
    }
    static uB(a) {
      if (a == null) {
        a = LevelState.level;
      }
      return Save.ig[LevelState.box - 1][a - 1] > 0;
    }
  }
  LevelState.i = true;
  class LevelClearedOverlay extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      return [Loader.fontDat, Loader.fontImg, Loader.menuBg, Loader.menuUi, Loader.menuUiJson];
    }
    replacesPrevious() {
      return false;
    }
    init() {
      super.init();
      this.Ke(600, 900);
      var a = this.caller.Ha.stars;
      this.Ic = this.caller.Ha.blueStar;
      var b = this.cr("LEVEL_CLEARED1", "LEVEL_CLEARED2", "LEVEL_CLEARED3", "LEVEL_CLEARED4")[a];
      var c = new TextNode(this.ra, Resources.ic);
      c.setBoxSize(600, 60);
      c.setText(b);
      c.setAlign(0);
      c.setMultiline();
      c.setY(140);
      b = [];
      for (c = 0; c < 4;) {
        ++c;
        b.push(new Sprite(this.ra, Resources.Wa, Keys.oL));
      }
      this.ab = b;
      b = 0;
      for (c = this.ab; b < c.length;) {
        c[b++].center();
      }
      if (this.Ic) {
        this.IE = [0.9, 1, 1, 0.9];
        this.ab[0].setX(142);
        this.ab[0].setY(337);
        this.ab[1].setX(244);
        this.ab[1].setY(316);
        this.ab[2].setX(360);
        this.ab[2].setY(316);
        this.ab[3].setX(461);
        this.ab[3].setY(337);
      } else {
        this.IE = [0.9, 1, 0.9];
        this.ab[0].setX(180);
        this.ab[0].setY(291);
        this.ab[1].setX(300);
        this.ab[1].setY(273);
        this.ab[2].setX(420);
        this.ab[2].setY(291);
      }
      for (b = 0; b < 4;) {
        c = b++;
        this.ab[c].W(0);
        this.ab[c].setUniformScale(0);
      }
      for (b = 0; b < a;) {
        this.ab[b++].Fb(Keys.nL);
      }
      if (this.Ic) {
        this.ab[3].Fb(Keys.pK);
      }
      a = new Sprite(this.ra, Resources.Wa, Keys.WK);
      a.setX(190);
      a.setY(400);
      this.av = LevelState.mO();
      a = new AlbumButton();
      a.setX(59);
      a.setY(640);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a = ButtonBase.create(null, Keys.Uk, Keys.Vk, Keys.lz);
      a.setX(219);
      a.setY(640);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a = ButtonBase.create(null, Keys.Uk, Keys.Vk, Keys.oz);
      a.setX(379);
      a.setY(640);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a = ButtonBase.create(null, Keys.Rt, Keys.St, Keys.dL);
      a.setX(188.5);
      a.setY(750);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a.focus();
      if (LevelState.box == 17 && LevelState.level == 25) {
        a.L(false);
      }
      if (this.av) {
        this.setState(0);
      } else {
        this.setState(1);
      }
    }
    start() {
      super.start();
      if (this.caller instanceof LevelScene && (SoundFx.play(SoundFx.win), LevelState.QL() && LevelState.box == 17 && LevelState.level == 25)) {
        this.Dg(OutroVideoScene);
        return;
      }
      if (this.caller instanceof OutroVideoScene) {
        Save.Dl = true;
        Save.flush();
        this.setState(7);
      } else if (this.caller instanceof PictureRevealScene) {
        this.setState(1);
      } else if (this.av) {
        this.av = false;
        this.Ha.pictureIndex = null;
        this.Ha.available = true;
        this.Ha.ui = true;
        this.Dg(PictureRevealScene);
      }
    }
    layout() {
      super.layout();
      let a = LevelCurtain.instance;
      if (a != null) {
        a.layout();
      }
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 1:
          // Pop every star in at once instead of one-per-quarter-second,
          // then go straight to state 7 (interactive, button bounces).
          // The original "stagger 0.25s × 4 + wait 1s before bounce"
          // sequence was ~2.25s of dead time on top of the scene fade.
          this.Rs(1);
          this.Rs(2);
          this.Rs(3);
          if (this.Ic) this.Rs(4);
          this.oa(new BounceAnim(this.buttons[4].j, 2));
          this.setState(7);
          break;
        case 8:
          a = this.jb(0.3);
          this.mi().bf(1 - a);
          if (a == 1) {
            this.Uq();
            LevelCurtain.instance.nu();
            this.setState(9);
          }
          break;
        case 9:
          if (LevelCurtain.instance.state == 0) {
            this.setState(10);
            this.Vb();
          }
      }
    }
    transitionIn(a) {
      this.mi().bf(a);
    }
    transitionOut(a) {
      this.mi().bf(1 - a);
    }
    Pd() {
      if (this.state != 0 && !(this.state > 7)) {
        if (this.hb(1)) {
          this.vp();
        }
        if (this.hb(2)) {
          this.ip();
        }
        if (this.hb(3)) {
          this.jp();
        }
        if (this.hb(4)) {
          if (LevelState.hl()) {
            if (LevelState.hl()) {
              this.Ha.boxComplete = true;
              this.uC();
            } else {
              this.time = 0;
            }
          } else {
            LevelState.nS();
            this.wC();
          }
        }
      }
    }
    vp() {
      this.$(PicturesScene);
    }
    Rs(a) {
      --a;
      this.ab[a].tween().alpha(1, 0.3);
      this.ab[a].tween().scale(this.IE[a], 0.3, Easing.backOut(0.1));
    }
    uC() {
      if (LevelState.season == 1) {
        this.$(Season1Scene);
      } else if (LevelState.season == 2) {
        this.$(Season2Scene);
      } else if (LevelState.season == 3) {
        this.$(Season3Scene);
      }
    }
    wC() {
      this.Kf();
    }
    jp() {
      this.Of();
    }
    ip() {
      this.ep();
    }
    ep() {
      this.setState(8);
    }
    Of() {
      this.Ha.restart = true;
      this.Kf();
    }
    setState(a) {
      this.state = a;
      this.time = 0;
    }
    Vb() {
      if (LevelState.hl()) {
        this.Ha.boxComplete = true;
        if (LevelState.season == 1) {
          this.$(Season1Scene);
        } else if (LevelState.season == 2) {
          this.$(Season2Scene);
        } else if (LevelState.season == 3) {
          this.$(Season3Scene);
        }
      } else {
        this.$(SelectLevelScene);
      }
    }
    getName() {
      return "LevelClearedOverlay";
    }
  }
  LevelClearedOverlay.i = true;
  LevelClearedOverlay.s = Scene;
  Object.assign(LevelClearedOverlay.prototype, {
    l: LevelClearedOverlay
  });
  class CTRCLevelClearedOverlay extends LevelClearedOverlay {
    constructor() {
      super();
    }
    init() {
      super.init();
      // Was: this.Jl() - hid every button on entry so the (removed)
      // state-6 -> 1s DelayedCall -> trackLevelSuccess -> interstitial
      // -> wS() chain could reveal them after the ad. With ads and
      // analytics stripped and the state machine collapsed straight
      // to state 7, that reveal never fired, leaving the buttons
      // permanently hidden. Just keep them visible from the start.
    }
    jp() {
      this.Jl();
      let a = this;
      SDK.trackLevelRestart(currentLevelId(), function () {
        SDK.showInterstitialAd("button:results:restart", cachedBind(a, a.Of));
      });
    }
    uC() {
      if (LevelState.season == 1) {
        this.$(CTRCSeason1Scene);
      } else if (LevelState.season == 2) {
        this.$(CTRCSeason2Scene);
      } else if (LevelState.season == 3) {
        this.$(CTRCSeason3Scene);
      }
    }
    wC() {
      this.Jl();
      let a = this;
      SDK.showInterstitialAd("button:results:next", function () {
        SDK.trackLevelStart(currentLevelId(), function () {
          a.Kf(null);
        });
      });
    }
    ip() {
      this.Jl();
      SDK.showInterstitialAd("button:results:quit", cachedBind(this, this.ep));
    }
    Vb() {
      if (LevelState.hl()) {
        this.Ha.boxComplete = true;
        if (LevelState.season == 1) {
          this.$(CTRCSeason1Scene);
        } else if (LevelState.season == 2) {
          this.$(CTRCSeason2Scene);
        } else if (LevelState.season == 3) {
          this.$(CTRCSeason3Scene);
        }
      } else {
        this.$(CTRCSelectLevelScene);
      }
    }
    vp() {
      this.$(CTRCPicturesScene);
    }
    getName() {
      return "CTRCLevelClearedOverlay";
    }
  }
  CTRCLevelClearedOverlay.i = true;
  CTRCLevelClearedOverlay.s = LevelClearedOverlay;
  Object.assign(CTRCLevelClearedOverlay.prototype, {
    l: CTRCLevelClearedOverlay
  });
  class LevelLostOverlay extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      return [Loader.fontDat, Loader.fontImg, Loader.menuBg, Loader.menuUi, Loader.menuUiJson];
    }
    replacesPrevious() {
      return false;
    }
    init() {
      super.init();
      this.Ke(600, 900);
      var a = this.yb("LEVEL_FAILED");
      var b = new TextNode(this.ra, Resources.ic);
      b.setBoxSize(600, 160);
      b.Tf(true);
      b.setFontSize(60);
      b.setText(a);
      b.setAlign(0);
      b.setY(140);
      a = this.caller.Ha.count;
      b = 0;
      if (a > 3) {
        b = 1;
      }
      if (a > 5) {
        b = 2;
      }
      a = new Sprite(this.ra, Resources.Wa, [Keys.XK, Keys.YK, Keys.ZK][b]);
      a.setX(190);
      a.setY(320);
      a = ButtonBase.create(null, Keys.Uk, Keys.Vk, Keys.lz);
      a.setX(139);
      a.setY(560);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a = ButtonBase.create(null, Keys.Uk, Keys.Vk, Keys.oz);
      a.setX(299);
      a.setY(560);
      this.ra.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a.focus();
      this.state = 0;
    }
    layout() {
      super.layout();
      let a = LevelCurtain.instance;
      if (a != null) {
        a.layout();
      }
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 1:
          a = this.jb(0.3);
          this.mi().bf(1 - a);
          if (a == 1) {
            this.Uq();
            LevelCurtain.instance.nu();
            this.setState(2);
          }
          break;
        case 2:
          if (LevelCurtain.instance.state == 0) {
            this.setState(3);
            this.Vb();
          }
      }
    }
    transitionIn(a) {
      this.mi().bf(a);
    }
    transitionOut(a) {
      this.mi().bf(1 - a);
    }
    Pd() {
      if (!(this.state > 0)) {
        if (this.hb(1)) {
          this.ip();
        }
        if (this.hb(2)) {
          this.jp();
        }
      }
    }
    jp() {
      this.Of();
    }
    ip() {
      this.ep();
    }
    ep() {
      this.setState(1);
      this.time = 0;
    }
    Of() {
      this.Ha.restart = true;
      this.Kf();
    }
    setState(a) {
      this.state = a;
    }
    Vb() {
      if (LevelState.hl()) {
        this.Ha.boxComplete = true;
        if (LevelState.season == 1) {
          this.$(Season1Scene);
        } else if (LevelState.season == 2) {
          this.$(Season2Scene);
        } else if (LevelState.season == 3) {
          this.$(Season3Scene);
        }
      } else {
        this.$(SelectLevelScene);
      }
    }
    getName() {
      return "LevelLostOverlay";
    }
  }
  LevelLostOverlay.i = true;
  LevelLostOverlay.s = Scene;
  Object.assign(LevelLostOverlay.prototype, {
    l: LevelLostOverlay
  });
  class CTRCLevelLostOverlay extends LevelLostOverlay {
    constructor() {
      super();
    }
    jp() {
      this.Jl();
      let a = this;
      SDK.trackLevelRestart(currentLevelId(), function () {
        SDK.showInterstitialAd("button:results:restart", cachedBind(a, a.Of));
      });
    }
    ip() {
      this.Jl();
      SDK.showInterstitialAd("button:failed:quit", cachedBind(this, this.ep));
    }
    Vb() {
      if (LevelState.hl()) {
        this.Ha.boxComplete = true;
        if (LevelState.season == 1) {
          this.$(CTRCSeason1Scene);
        } else if (LevelState.season == 2) {
          this.$(CTRCSeason2Scene);
        } else if (LevelState.season == 3) {
          this.$(CTRCSeason3Scene);
        }
      } else {
        this.$(CTRCSelectLevelScene);
      }
    }
    getName() {
      return "CTRCLevelLostOverlay";
    }
  }
  CTRCLevelLostOverlay.i = true;
  CTRCLevelLostOverlay.s = LevelLostOverlay;
  Object.assign(CTRCLevelLostOverlay.prototype, {
    l: CTRCLevelLostOverlay
  });

  class MissingStarsPopup extends Scene {
    constructor() {
      super();
    }
    init() {
      super.init();
      this.Xd = new Container();
      var a = new Sprite(this.Xd, Resources.Wa, Keys.nz);
      var b = new Sprite(this.Xd, Resources.Wa, Keys.jL);
      var c = new Sprite(this.Xd, Resources.Wa, Keys.fL);
      b.nx(500);
      b.setY(a.X.y - 1);
      c.setY(b.getY() + 500 - 1);
      this.Xd.center();
      a = ButtonBase.create(null, Keys.gL, Keys.hL, Keys.iL);
      this.buttons.push(a);
      a.setX(680);
      a.setY(-20);
      this.Xd.appendChild(a.j);
      this.oa(a);
      b = new TextNode(this.Xd, Resources.ic);
      b.setText(Strings.get("CANT_UNLOCK_TEXT1"));
      b.setX(20);
      b.setY(60);
      b.setAlign(0);
      b.setBoxSize(760, 100);
      b.setFontSize(80);
      a = new TextNode(this.Xd, Resources.ic);
      a.setText(Numeric.Ed(this.caller.Ha.starCount));
      a.setX(20);
      a.setY(b.getY() + 90);
      a.setAlign(0);
      a.setBoxSize(760, 100);
      a.setFontSize(80);
      b = new Sprite(this.Xd, Resources.Wa, Keys.Tt);
      c = a.Re();
      b.setUniformScale(0.8);
      b.setX(c.B);
      b.setY((c.D + c.G) / 2 - b.getHeight() / 2);
      b = new TextNode(this.Xd, Resources.ic);
      b.setText(Strings.get("CANT_UNLOCK_TEXT2"));
      b.setX(20);
      b.setY(a.getY() + 90);
      b.setAlign(0);
      b.setBoxSize(760, 100);
      b.setFontSize(80);
      a = new TextNode(this.Xd, Resources.ji);
      a.setText(Strings.get("CANT_UNLOCK_TEXT3"));
      a.setX(20);
      a.setY(b.getY() + 90 + 40);
      a.setAlign(0);
      a.Tf(true);
      a.setBoxSize(760, 140);
      a.setFontSize(60);
      this.node.P(this.Xd.u);
    }
    getTransitionDuration() {
      return 0.5;
    }
    transitionOut(a) {
      a = Easing.quadOut()(1 - a);
      let b = this.node.Db;
      b.scale.x = b.scale.y = 0.001 + a;
      b.K = b.K & -2 | 500;
    }
    transitionIn(a) {
      a = Easing.elasticOut(0.5, 0.5)(a);
      let b = this.node.Db;
      b.scale.x = b.scale.y = 0.001 + a;
      b.K = b.K & -2 | 500;
    }
    Pd() {
      if (this.O.lh().Nb(461)) {
        this.Kf();
      }
      if (this.hb(1)) {
        this.Kf();
      }
    }
    layout() {
      super.layout();
      let a = this.fa.dr().hi(1);
      var b = this.node.Db;
      b.translate.x = (a.A + a.B) / 2;
      b.translate.y = (a.D + a.G) / 2;
      b.K = b.K & -2 | 496;
      if (this.fa.Se() > 1) {
        this.Xd.setUniformScale(1);
        b = this.Xd.getHeight();
        this.Xd.setUniformScale((a.G - a.D) / b * 0.75);
      } else {
        b = 1.1;
        let c = 1 / this.fa.Se();
        if (c < 1) {
          b = c * 1.1;
        }
        this.Xd.setUniformScale((a.B - a.A) / (Resources.Wa.hc.yf(Keys.nz).ec.x * b));
      }
    }
    replacesPrevious() {
      return false;
    }
    getName() {
      return "MissingStarsPopup";
    }
  }
  MissingStarsPopup.i = true;
  MissingStarsPopup.s = Scene;
  Object.assign(MissingStarsPopup.prototype, {
    l: MissingStarsPopup
  });
  class PicturesScene extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      return [Loader.picThumbs, Loader.picThumbsJson, WebApplication.xmasMode ? Loader.picsBgXmas : Loader.picsBg];
    }
    Vg() {
      this.Ea = new Sprite(null, this.createTexture(WebApplication.xmasMode ? Loader.picsBgXmas : Loader.picsBg));
      this.node.P(this.Ea.u);
    }
    Nd() {
      super.Nd();
      this.PE = this.createTexture(Loader.picThumbs);
    }
    init() {
      super.init();
      Save.kk = 0;
      Save.flush();
      this.Vg();
      this.Ke(600, 900);
      this.OL();
      this.sj();
      var a = new TextNode(this.ra, Resources.ic);
      a.setBoxSize(600, 60);
      a.setText(this.yb("OMNOM_DRAWINGS"));
      a.setAlign(0);
      a.setMultiline();
      a.setY(20);
      a = new TextNode(this.ra, Resources.ji);
      a.setBoxSize(600, 40);
      a.setText(this.yb("DRAWINGS_TOTAL", Numeric.Ed(LevelState.QN())));
      a.setAlign(0);
      a.setMultiline();
      a.setY(80);
      this.$k();
      this.mf = new Sprite(null, this.PE, "artist");
      this.scroll = new HorizontalScroller(this.cj, 0, 600, 0);
      this.scroll.offsetX = this.QE / 2;
      this.time = this.state = 0;
    }
    start() {
      super.start();
      if (this.mf.u.parent == null) {
        this.fa.front.P(this.mf.u);
      }
    }
    layout() {
      super.layout();
      let a = this.cd;
      a.setUniformScale(a.Ra * 1.1);
    }
    Oc() {
      super.Oc();
      this.ia(Loader.picThumbs);
      this.ia(Loader.picsBg);
    }
    OL() {
      this.cj = new Container("thumbs", this.ra);
      this.cj.setY(0);
      for (var a = [0.77, -2.45, 470, 695, 0.85, 0.2, 854, 627, 0.86, 0.2, 1260, 647, 0.78, 1, 1630, 663, 0.86, 4.7, 2057, 642, 0.8, -2, 2477, 722, 0.8, -5, 2924, 602, 0.77, 0, 459, 1161, 0.85, -0.48, 854, 1147, 0.78, 5.11, 1253, 1137, 0.82, 0.11, 1680, 1147, 0.7, 0, 2121, 1188, 0.75, 1, 2526, 1264, 0.75, -2, 2933, 1162, 0.71, -3, 700, 1635, 0.66, -0.31, 1091, 1611, 0.66, 0.51, 1481, 1606, 0.7, 6.66, 1832, 1665, 0.66, 0, 2172, 1627, 0.65, -5, 2586, 1680, 0.75, -2, 2855, 1624], b = 0; b < a.length;) {
        var c = a[b++] * 0.8 * 1.5;
        let e = a[b++];
        let f = a[b++] * 0.8 / 2 - 90;
        let g = a[b++] * 0.8 / 2;
        let h = b >> 2;
        var d = undefined;
        if (LevelState.QB(h)) {
          d = "pics/";
          if (h < 10) {
            d = "pics/0";
          }
          d += h;
        } else {
          d = "missing";
        }
        d = new Sprite(this.cj, this.PE, d);
        d.ox(h == null ? "null" : "" + h);
        d.center();
        d.setUniformScale(c);
        d.la(e);
        d.setX(f);
        d.setY(g);
      }
      a = this.cj.Re();
      this.QE = a.B - a.A;
      a = this.cj.getWidth();
      for (b = this.cj.iterator(); b.fb();) {
        c = b.next();
        c.setX(c.getX() - a / 2);
      }
    }
    update(a) {
      super.update(a);
      if (this.fa.getWidth() / this.ra.Ra - this.QE < -50) {
        this.scroll.update(a);
      } else {
        this.cj.setX(300);
      }
      this.mf.setX(this.fa.getWidth() - this.mf.getWidth());
      switch (this.state) {
        case 0:
          a = this.jb(0.2);
          this.mf.setY(this.fa.getHeight() - this.mf.getHeight() * a);
          if (a == 1) {
            this.state = 1;
          }
          break;
        case 1:
          this.mf.setY(this.fa.getHeight() - this.mf.getHeight());
          break;
        case 2:
          a = this.jb(0.2);
          this.mf.setY(this.fa.getHeight() - this.mf.getHeight() * (1 - a));
          if (a == 1) {
            this.mf.L(false);
            this.state = 3;
            this.Vb();
          }
      }
      if (this.De == "Running") {
        a = this.O.hd();
        if (a.Nb(0)) {
          this.Ru = a.position[0].x;
        }
        if (!!a.qe(0) && !(Math.abs(a.position[0].x - this.Ru) > 5)) {
          a = new GrowableList();
          if (this.cj.Ub(this.pointer.pos, a)) {
            a = Numeric.parseInt(a.get(0).name);
            this.Ha.pictureIndex = a;
            this.Ha.available = LevelState.QB(a);
            this.Ha.ui = false;
            this.Dg(PictureRevealScene);
          }
        }
      }
    }
    Pd() {
      if (this.hb(0)) {
        this.state = 2;
        this.time = 0;
      }
    }
    Vb() {
      this.$(MenuScene);
    }
    getName() {
      return "PicturesScene";
    }
  }
  PicturesScene.i = true;
  PicturesScene.s = Scene;
  Object.assign(PicturesScene.prototype, {
    l: PicturesScene
  });
  class CTRCPicturesScene extends PicturesScene {
    constructor() {
      super();
    }
    Vb() {
      this.$(CTRCMenuScene);
    }
    getName() {
      return "CTRCPicturesScene";
    }
  }
  CTRCPicturesScene.i = true;
  CTRCPicturesScene.s = PicturesScene;
  Object.assign(CTRCPicturesScene.prototype, {
    l: CTRCPicturesScene
  });
  class WarpScene extends Scene {
    constructor() {
      super();
    }
    start() {
      super.start();
      var a = this.caller.Ha.box;
      if (a != LevelState.box) {
        this.eF();
      }
      LevelState.Ui(a);
      a = this.caller.Ha.level;
      LevelState.sp(a);
      if (a <= 5) {
        LevelState.zk(1);
      } else if (a > 5 && a < 10) {
        LevelState.zk(2);
      } else {
        LevelState.zk(3);
      }
      this.xD();
    }
    xD() {
      this.$(LevelScene);
    }
    getName() {
      return "WarpScene";
    }
  }
  WarpScene.i = true;
  WarpScene.s = Scene;
  Object.assign(WarpScene.prototype, {
    l: WarpScene
  });
  class CTRCWarpScene extends WarpScene {
    constructor() {
      super();
    }
    xD() {
      this.$(CTRCLevelScene);
    }
    getName() {
      return "CTRCWarpScene";
    }
  }
  CTRCWarpScene.i = true;
  CTRCWarpScene.s = WarpScene;
  Object.assign(CTRCWarpScene.prototype, {
    l: CTRCWarpScene
  });

  class PictureRevealScene extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      let a = [Loader.picMissing];
      a.push([27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7][this.br() - 1]);
      return a;
    }
    transitionIn() {}
    transitionOut() {}
    getTransitionDuration() {
      return 0;
    }
    replacesPrevious() {
      return false;
    }
    init() {
      super.init();
      var a = this.br();
      this.tl = new ColorRectShape(null, new Vec4(0, 0, 0, 1));
      this.tl.W(0);
      this.node.P(this.tl.u);
      var b = this.caller.Ha.ui;
      var c = b ? 1350 : 1200;
      this.Ke(800, c);
      this.j = new Container(null, this.ra);
      this.j.setX(400);
      this.j.setY(c / 2);
      this.j.setUniformScale(0);
      this.j.L(false);
      c = this.createTexture(Loader.picMissing);
      new Sprite(this.j, c).center();
      if (this.caller.Ha.available) {
        this.ME = [27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7][a - 1];
        a = new Sprite(this.j, this.createTexture(this.ME));
        a.center();
        a.setX(-1);
        a.setY(-14);
      } else {
        c = LevelMath.rv(a);
        a = this.yN(a);
        a = this.yb("COMPLETE_BOXNAME", c == null ? "null" : "" + c, a);
        c = new TextNode(this.j, Resources.ji);
        c.setBoxSize(400, 400);
        c.Tf(true);
        c.setFontSize(50);
        c.setText(a);
        c.setAlign(0);
        c.setX(-200);
        c.setY(-100);
      }
      if (b) {
        b = LabelledButton.ol(this.yb("COLLECT_DRAWING"));
        b.j.setUniformScale(1.25);
        this.j.appendChild(b.j);
        b.setX(-293.75);
        b.setY(500);
        this.buttons.push(b);
        this.oa(b);
        b.focus();
        b = new Sprite(this.j, Resources.Wa, Keys.nK);
        b.center();
        b.setX(0);
        b.setY(-570);
        b = this.yb("DRAWING_FOUND");
        a = new TextNode(this.j, Resources.ic);
        a.setBoxSize(600, 160);
        a.setFontSize(80);
        a.setText(b);
        a.setAlign(0);
        a.setX(-300);
        a.setY(-615);
      }
      this.time = this.state = 0;
    }
    Oc() {
      super.Oc();
      this.ia(Loader.picMissing);
      this.ia(this.ME);
    }
    Pd(a) {
      super.Pd(a);
      if (this.state == 1 && this.hb(1)) {
        this.state = 2;
        this.time = 0;
      }
    }
    start() {
      super.start();
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 0:
          a = this.jb(0.5);
          this.j.setUniformScale(Easing.backOut()(a));
          this.j.L(true);
          this.tl.W(a * 0.4);
          if (a == 1) {
            this.state = 1;
          }
          break;
        case 1:
          if (this.caller.Ha.ui) {
            break;
          }
          if (this.O.hd().Nb(0)) {
            this.state = 2;
            this.time = 0;
          }
          break;
        case 2:
          a = this.jb(0.25);
          this.j.setUniformScale(1 - Easing.quadOut()(a));
          this.tl.W((1 - a) * 0.4);
          if (a == 1) {
            this.state = 3;
            this.Kf();
          }
      }
    }
    br() {
      let a = this.caller.Ha.pictureIndex;
      if (a == null) {
        a = LevelMath.br(LevelState.box, LevelState.level);
      }
      return a;
    }
    yN(a) {
      if (a <= 17) {
        return this.yb("BOX1_LABEL");
      } else {
        return this.yb("BOX2_LABEL");
      }
    }
    getName() {
      return "PicturePopup";
    }
  }
  PictureRevealScene.i = true;
  PictureRevealScene.s = Scene;
  Object.assign(PictureRevealScene.prototype, {
    l: PictureRevealScene
  });
  class RGBA {
    constructor(a, b, c, d) {
      this.r = a;
      this.ue = b;
      this.b = c;
      this.a = d;
    }
    Zb() {
      return new RGBA(this.r, this.ue, this.b, this.a);
    }
  }
  RGBA.i = true;
  Object.assign(RGBA.prototype, {
    l: RGBA
  });
  class Vec2 {
    constructor(a, b) {
      this.x = a;
      this.y = b;
    }
    add(a) {
      this.x += a.x;
      this.y += a.y;
    }
    Ax(a) {
      this.x -= a.x;
      this.y -= a.y;
    }
    multiply(a) {
      this.x *= a;
      this.y *= a;
    }
    xA(a) {
      this.x /= a;
      this.y /= a;
    }
    sf(a) {
      let b = this.x - a.x;
      a = this.y - a.y;
      return Math.sqrt(b * b + a * a);
    }
    Rb() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    io() {
      return this.x * this.x + this.y * this.y;
    }
    TO() {
      if (this.x == 0) {
        return this.y == 0;
      } else {
        return false;
      }
    }
    gN(a) {
      if (this.x == a.x) {
        return this.y == a.y;
      } else {
        return false;
      }
    }
    normalize() {
      this.multiply(1 / this.Rb());
    }
    angle() {
      return Math.atan(this.y / this.x);
    }
    km() {
      return Math.atan2(this.y, this.x);
    }
    Zb() {
      return new Vec2(this.x, this.y);
    }
    Pb(a) {
      this.x = a.x;
      this.y = a.y;
    }
    rotate(a) {
      let b = Math.cos(a);
      a = Math.sin(a);
      let c = this.x * a + this.y * b;
      this.x = this.x * b - this.y * a;
      this.y = c;
      return this;
    }
    $a(a, b, c) {
      this.x -= b;
      this.y -= c;
      this.rotate(a);
      this.x += b;
      this.y += c;
    }
    static sc() {
      return new Vec2(0, 0);
    }
    static UP() {
      return new Vec2(2147483647, 2147483647);
    }
    static tb(a, b) {
      return new Vec2(a.x + b.x, a.y + b.y);
    }
    static Ia(a, b) {
      return new Vec2(a.x - b.x, a.y - b.y);
    }
    static Ob(a, b) {
      return new Vec2(a.x * b, a.y * b);
    }
    static bq(a, b) {
      return new Vec2(a.x / b, a.y / b);
    }
    static nd(a, b, c, d) {
      a -= c;
      b -= d;
      return Math.sqrt(a * a + b * b);
    }
    static yz(a, b) {
      return a.x * b.x + a.y * b.y;
    }
    static au(a) {
      return new Vec2(-a.y, a.x);
    }
    static AL(a) {
      return new Vec2(a.y, -a.x);
    }
    static cq(a) {
      return Vec2.Ob(a, 1 / a.Rb());
    }
    static eM(a, b) {
      let c = new Vec2(0, 0);
      Vec2.OD(a, b, c);
      return c;
    }
    static OD(a, b, c) {
      var d = a.length;
      if (d <= 1) {
        c.x = c.y = 0;
      } else {
        var e = Vec2.BL;
        var f = Vec2.CL;
        var g = 1 - b;
        for (var h = 0; h < d;) {
          let m = h++;
          let n = a[m];
          e[m] = n.x;
          f[m] = n.y;
        }
        for (a = d - 1; a > 0;) {
          d = 0;
          for (h = 1; d < a;) {
            e[d] = e[d] * g + e[h] * b;
            f[d] = f[d] * g + f[h] * b;
            ++d;
            ++h;
          }
          --a;
        }
        c.x = e[0];
        c.y = f[0];
      }
    }
    static KA(a) {
      return new Vec2(Math.cos(a), Math.sin(a));
    }
  }
  Vec2.i = true;
  Object.assign(Vec2.prototype, {
    l: Vec2
  });
  class Vec4 {
    constructor(a, b, c, d) {
      this.x = a;
      this.y = b;
      this.z = c;
      this.w = d;
    }
  }
  Vec4.i = true;
  Object.assign(Vec4.prototype, {
    l: Vec4
  });

  class Vec4Clone {
    static clone(a) {
      return new Vec4(a.x, a.y, a.z, a.w);
    }
  }
  class Rect {
    constructor(a, b, c, d) {
      this.x = a;
      this.y = b;
      this.w = c;
      this.J = d;
    }
    static Zb(a) {
      return new Rect(a.x, a.y, a.w, a.J);
    }
    static Gm(a) {
      return new Rect(a.x * 0.4, a.y * 0.4, a.w * 0.4, a.J * 0.4);
    }
    static Ew(a, b, c, d, e, f, g, h) {
      return !(a > g) && !(c < e) && !(b > h) && !(d < f);
    }
    static lk(a, b, c, d, e, f) {
      if (a >= c && a < c + e && b >= d) {
        return b < d + f;
      } else {
        return false;
      }
    }
    static tt(a, b, c, d, e) {
      return (e.x < a ? Rect.oy : 0) + (e.x > c ? Rect.py : 0) + (e.y < b ? Rect.ny : 0) + (e.y > d ? Rect.qy : 0);
    }
    static $j(a, b, c, d, e, f, g, h) {
      let m = new Vec2(a, b);
      let n = new Vec2(c, d);
      let q;
      g = e + g;
      let p = f + h;
      let v = Rect.tt(e, f, g, p, m);
      let u = Rect.tt(e, f, g, p, n);
      while (v != 0 || u != 0) {
        if ((v & u) != 0) {
          return false;
        }
        if (v != 0) {
          h = v;
          q = m;
        } else {
          h = u;
          q = n;
        }
        if ((h & Rect.oy) > 0) {
          q.y += (b - d) * (e - q.x) / (a - c);
          q.x = e;
        } else if ((h & Rect.py) != 0) {
          q.y += (b - d) * (g - q.x) / (a - c);
          q.x = g;
        }
        if ((h & Rect.ny) > 0) {
          q.x += (a - c) * (f - q.y) / (b - d);
          q.y = f;
        } else if ((h & Rect.qy) != 0) {
          q.x += (a - c) * (p - q.y) / (b - d);
          q.y = p;
        }
        if (h == v) {
          v = Rect.tt(e, f, g, p, m);
        } else {
          u = Rect.tt(e, f, g, p, n);
        }
      }
      return true;
    }
  }
  Rect.i = true;
  Object.assign(Rect.prototype, {
    l: Rect
  });
  class Bounds {
    constructor(a, b, c, d) {
      this.A = a;
      this.D = b;
      this.B = c;
      this.G = d;
    }
    add(a) {
      if (a.A < this.A) {
        this.A = a.A;
      }
      if (a.B > this.B) {
        this.B = a.B;
      }
      if (a.D < this.D) {
        this.D = a.D;
      }
      if (a.G > this.G) {
        this.G = a.G;
      }
    }
    ku(a) {
      let b = a.x;
      if (b < this.A) {
        this.A = b;
      }
      if (b > this.B) {
        this.B = b;
      }
      a = a.y;
      if (a < this.D) {
        this.D = a;
      }
      if (a > this.G) {
        this.G = a;
      }
    }
    scale(a, b) {
      if (b) {
        b = (this.B - this.A) / 2;
        let c = this.A + b;
        this.A = c - b * a;
        this.B = c + b * a;
        b = (this.G - this.D) / 2;
        c = this.D + b;
        this.D = c - b * a;
        this.G = c + b * a;
      } else {
        this.A *= a;
        this.D *= a;
        this.B *= a;
        this.G *= a;
      }
    }
    hi(a) {
      var b = this.B - this.A;
      let c = this.G - this.D;
      var d = b / a;
      let e = c / 1;
      if (d <= e) {
        b = this.D + (c - d) / 2;
        return new Bounds(this.A, b, this.B, b + d);
      }
      d = a * e;
      b = this.A + (b - d) / 2;
      return new Bounds(b, this.D, b + d, this.G);
    }
  }
  Bounds.i = true;
  Object.assign(Bounds.prototype, {
    l: Bounds
  });
  class Size {
    constructor(a, b) {
      this.x = a;
      this.y = b;
    }
  }
  Size.i = true;
  Object.assign(Size.prototype, {
    l: Size
  });

  class BoundsLite {
    constructor(a, b, c, d) {
      this.A = a;
      this.D = b;
      this.B = c;
      this.G = d;
    }
  }
  BoundsLite.i = true;
  Object.assign(BoundsLite.prototype, {
    l: BoundsLite
  });
  class PointInRect {
    static RS(a, b, c, d) {
      if (a >= 0 && a <= c && b >= 0) {
        return b <= d;
      } else {
        return false;
      }
    }
  }
  PointInRect.i = true;
  class PointInCircle {
    static Cx(a, b, c, d, e) {
      a -= c;
      b -= d;
      return a * a + b * b < e * e;
    }
  }
  PointInCircle.i = true;

  class AABBTest {
    static test(a, b) {
      if (a.A >= b.B) {
        return false;
      } else if (a.B <= b.A) {
        return false;
      } else if (a.D >= b.G) {
        return false;
      } else if (a.G <= b.D) {
        return false;
      } else {
        return true;
      }
    }
  }
  AABBTest.i = true;
  class Mat4 {
    constructor(a, b, c, d, e, f, g, h, m, n, q, p, v, u, A, D) {
      this.m11 = a;
      this.m12 = b;
      this.m13 = c;
      this.m14 = d;
      this.m21 = e;
      this.m22 = f;
      this.m23 = g;
      this.m24 = h;
      this.m31 = m;
      this.m32 = n;
      this.m33 = q;
      this.m34 = p;
      this.m41 = v;
      this.m42 = u;
      this.m43 = A;
      this.m44 = D;
    }
  }
  Mat4.i = true;
  Object.assign(Mat4.prototype, {
    l: Mat4
  });
  class TransformStack {
    constructor() {
      this.Wm = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.hD = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.pk = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    pT() {
      let a = this.hD;
      let b = this.Wm;
      this.pk = new Mat4(a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * b.m31 + a.m14 * b.m41, a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * b.m32 + a.m14 * b.m42, a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * b.m33 + a.m14 * b.m43, a.m11 * b.m14 + a.m12 * b.m24 + a.m13 * b.m34 + a.m14 * b.m44, a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * b.m31 + a.m24 * b.m41, a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * b.m32 + a.m24 * b.m42, a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * b.m33 + a.m24 * b.m43, a.m21 * b.m14 + a.m22 * b.m24 + a.m23 * b.m34 + a.m24 * b.m44, a.m31 * b.m11 + a.m32 * b.m21 + a.m33 * b.m31 + a.m34 * b.m41, a.m31 * b.m12 + a.m32 * b.m22 + a.m33 * b.m32 + a.m34 * b.m42, a.m31 * b.m13 + a.m32 * b.m23 + a.m33 * b.m33 + a.m34 * b.m43, a.m31 * b.m14 + a.m32 * b.m24 + a.m33 * b.m34 + a.m34 * b.m44, a.m41 * b.m11 + a.m42 * b.m21 + a.m43 * b.m31 + a.m44 * b.m41, a.m41 * b.m12 + a.m42 * b.m22 + a.m43 * b.m32 + a.m44 * b.m42, a.m41 * b.m13 + a.m42 * b.m23 + a.m43 * b.m33 + a.m44 * b.m43, a.m41 * b.m14 + a.m42 * b.m24 + a.m43 * b.m34 + a.m44 * b.m44);
    }
    rF(a, b) {
      var c = this.pk;
      let d = a.x;
      let e = a.y;
      let f = a.z;
      let g = a.w;
      let h = 1 / (c.m41 * d + c.m42 * e + c.m43 * f + c.m44 * g);
      a = b.w / 2;
      let m = b.J / 2;
      let n = (c.m11 * d + c.m12 * e + c.m13 * f + c.m14 * g) * h;
      c = (c.m21 * d + c.m22 * e + c.m23 * f + c.m24 * g) * h;
      return new Vec4(a * n + c * 0 + (a + b.x), n * 0 + -m * c + (m + b.y), 0, 1);
    }
  }
  TransformStack.i = true;
  Object.assign(TransformStack.prototype, {
    l: TransformStack
  });
  class ColorTransform {
    constructor() {
      this.hint = 0;
      this.offset = new Vec4(0, 0, 0, 0);
      this.$b = new Vec4(1, 1, 1, 1);
    }
    set(a) {
      var b = this.$b;
      var c = a.$b;
      b.x = c.x;
      b.y = c.y;
      b.z = c.z;
      b.w = c.w;
      b = this.offset;
      c = a.offset;
      b.x = c.x;
      b.y = c.y;
      b.z = c.z;
      b.w = c.w;
      this.hint = a.hint;
    }
    Vw(a) {
      if (a >= 0) {
        this.$b.x = 1 - a;
        this.$b.y = 1 - a;
        this.$b.z = 1 - a;
        this.offset.x = a;
        this.offset.y = a;
        this.offset.z = a;
      } else {
        this.$b.x = a + 1;
        this.$b.y = a + 1;
        this.$b.z = a + 1;
        this.offset.x = 0;
        this.offset.y = 0;
        this.offset.z = 0;
      }
      this.$b.w = 1;
      this.offset.w = 0;
      this.hint = 2;
      return this;
    }
    concat(a) {
      if (this.hint == 1 && a.hint == 1) {
        this.$b.w *= a.$b.w;
        return this;
      }
      let b = this.offset;
      let c = this.$b;
      let d = a.$b;
      a = a.offset;
      c.x *= d.x;
      c.y *= d.y;
      c.z *= d.z;
      c.w *= d.w;
      b.x = d.x * b.x + a.x;
      b.y = d.y * b.y + a.y;
      b.z = d.z * b.z + a.z;
      b.w = d.w * b.w + a.w;
      this.hint = 0;
      return this;
    }
  }
  ColorTransform.i = true;
  Object.assign(ColorTransform.prototype, {
    l: ColorTransform
  });
  class ColorTransformState extends RenderState {
    constructor(a) {
      super(2);
      this.transform = new ColorTransform();
      if (a != null) {
        this.transform.set(a);
      }
      this.collapsed = null;
      this.cb = ColorTransformState.next++;
    }
    set(a) {
      a.Xw(this);
    }
    collapse(a) {
      if (a.Ga == 1) {
        return this;
      }
      if (this.collapsed == null) {
        this.collapsed = new ColorTransformState();
      }
      let b = this.collapsed.transform;
      b.set(a.top().transform);
      let c = a.Ga - 2;
      while (c > -1) {
        b.concat(a.N[c--].transform);
      }
      return this.collapsed;
    }
  }
  ColorTransformState.i = true;
  ColorTransformState.s = RenderState;
  Object.assign(ColorTransformState.prototype, {
    l: ColorTransformState
  });
  class GameObject {
    constructor() {
      this.alpha = 1;
      this.rotation = 0;
      this.Hm = this.Im = 1;
      this.x = this.y = 0;
    }
    update() {}
    M() {}
  }
  GameObject.i = true;
  Object.assign(GameObject.prototype, {
    l: GameObject
  });
  class Entity {
    constructor() {
      this.Dj = 1;
      this.x = this.y = this.rotation = 0;
      this.visible = true;
      this.sa = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
    }
    pe() {
      this.sa.A = this.x + this.ea.A;
      this.sa.D = this.y + this.ea.D;
      this.sa.B = this.x + this.ea.B;
      this.sa.G = this.y + this.ea.G;
    }
    M() {}
    YD(a) {
      this.pb = a;
    }
    update(a) {
      if (this.pb != null) {
        this.pb.update(a);
        this.x = this.pb.g.x;
        this.y = this.pb.g.y;
        this.rotation = this.pb.angle;
      }
    }
    RQ(a, b) {
      let c = this.sa;
      let d = this.sa;
      return Rect.lk(a, b, this.sa.A, this.sa.D, c.B - c.A, d.G - d.D);
    }
    iR(a, b, c, d) {
      let e = this.sa.A;
      let f = this.sa.D;
      let g = this.ea;
      let h = this.ea;
      return Rect.Ew(a, b, c, d, e, f, e + (g.B - g.A), f + (h.G - h.D));
    }
    static yo(a, b) {
      return AABBTest.test(a.sa, b.sa);
    }
  }
  Entity.i = true;
  Object.assign(Entity.prototype, {
    l: Entity
  });
  class AnchoredEntity extends Entity {
    constructor() {
      super();
      this.constraint = null;
      this.vg = 0;
      this.NB = false;
      this.Gc = null;
      this.Rw = 0;
      this.Gn = this.ca = null;
    }
  }
  AnchoredEntity.i = true;
  AnchoredEntity.s = Entity;
  Object.assign(AnchoredEntity.prototype, {
    l: AnchoredEntity
  });
  class ParticleEmitter extends GameObject {
    constructor(a) {
      super();
      this.y = this.x = 0;
      this.Im = this.Hm = 1;
      this.rotation = 0;
      this.gj = [];
      this.Zh = [];
      this.Kx = a;
      this.ac = [];
      this.active = false;
      this.Kq = this.duration = 0;
      this.Kb = new Vec2(0, 0);
      this.cD = new Vec2(0, 0);
      this.Xv = this.Xc = this.wx = this.size = this.lD = this.fs = this.HE = this.$s = this.yp = this.speed = this.wn = this.angle = 0;
      this.aj = new RGBA(0, 0, 0, 0);
      this.Ws = new RGBA(0, 0, 0, 0);
      this.ei = new RGBA(0, 0, 0, 0);
      this.Nq = new RGBA(0, 0, 0, 0);
      this.xs = this.Fm = this.xl = this.Lq = 0;
      this.gj = [];
      this.Zh = [];
      this.Ki = 0;
      this.HC = null;
    }
    Fz() {
      if (this.ac.length != this.Kx) {
        var a = new ParticleData();
        this.qh(a);
        this.ac.push(a);
      }
    }
    qh(a) {
      a.g.x = this.x + this.cD.x * X.Ac();
      a.g.y = this.y + this.cD.y * X.Ac();
      a.bj.Pb(a.g);
      var b = (this.angle + this.wn * X.Ac()) * DEG2RAD;
      b = new Vec2(Math.cos(b), Math.sin(b));
      b.multiply(this.speed + this.yp * X.Ac());
      a.dir = b;
      a.fs = this.fs + this.lD * X.Ac();
      a.$s = this.$s + this.HE * X.Ac();
      a.Fr = a.Xc = this.Xc + this.Xv * X.Ac();
      b = new RGBA(this.aj.r + this.Ws.r * X.Ac(), this.aj.ue + this.Ws.ue * X.Ac(), this.aj.b + this.Ws.b * X.Ac(), this.aj.a + this.Ws.a * X.Ac());
      let c = new RGBA(this.ei.r + this.Nq.r * X.Ac(), this.ei.ue + this.Nq.ue * X.Ac(), this.ei.b + this.Nq.b * X.Ac(), this.ei.a + this.Nq.a * X.Ac());
      a.color = b;
      a.bi.r = (c.r - b.r) / a.Xc;
      a.bi.ue = (c.ue - b.ue) / a.Xc;
      a.bi.b = (c.b - b.b) / a.Xc;
      a.bi.a = (c.a - b.a) / a.Xc;
      a.size = this.size + this.wx * X.Ac();
    }
    update(a) {
      super.update(a);
      if (this.HC == null || this.ac.length != 0 || this.active) {
        if (this.active && this.Lq != 0) {
          var b = 1 / this.Lq;
          for (this.xl += a; this.ac.length < this.Kx && this.xl > b;) {
            this.Fz();
            this.xl -= b;
          }
          this.Kq += a;
          if (this.duration != -1 && this.duration < this.Kq) {
            this.KS();
          }
        }
        for (this.Ki = 0; this.Ki < this.ac.length;) {
          b = this.ac[this.Ki];
          if (b.Xc > 0) {
            this.oT(b, a);
            b.color.r += b.bi.r * a;
            b.color.ue += b.bi.ue * a;
            b.color.b += b.bi.b * a;
            b.color.a += b.bi.a * a;
            b.Xc -= a;
            this.Kh(b, this.Ki, a);
            this.Ki++;
          } else {
            this.Fg(this.Ki);
          }
        }
      } else {
        this.HC(this);
      }
    }
    oT(a, b) {
      if (a.g.x != 0 || a.g.y != 0) {
        var c = a.g.Zb();
        c.normalize();
      } else {
        c = new Vec2(0, 0);
      }
      let d = c.Zb();
      c.multiply(a.fs);
      let e = d.x;
      d.x = -d.y;
      d.y = e;
      d.multiply(a.$s);
      c = Vec2.tb(c, d);
      c.add(this.Kb);
      c.multiply(b);
      a.dir.add(c);
      c.Pb(a.dir);
      c.multiply(b);
      a.g.add(c);
    }
    Kh(a) {
      this.gj[this.Ki] = new PointWithSize(a.g.x, a.g.y, a.size);
      this.Zh[this.Ki] = a.color;
    }
    Fg(a) {
      this.ac.splice(a, 1);
    }
    Qm(a) {
      if (this.ac.length > 0) {
        while (this.ac.length > 0) {
          this.Fg(0);
        }
      }
      this.ac = [];
      let b = 0;
      while (b < a) {
        ++b;
        this.Fz();
      }
      this.active = true;
    }
    KS() {
      this.active = false;
      this.Kq = this.duration;
      this.xl = 0;
    }
    M() {}
  }
  ParticleEmitter.i = true;
  ParticleEmitter.s = GameObject;
  Object.assign(ParticleEmitter.prototype, {
    l: ParticleEmitter
  });
  class AnimatedNineSlice extends GameObject {
    constructor(a, b, c, d, e) {
      super();
      this.j = new Container();
      a.ma(0).P(this.j.u);
      this.j.Wd(3);
      this.j.L(false);
      this.frames = [];
      a = [];
      for (var f = 0; f < d;) {
        ++f;
        a.push(0);
      }
      this.Va = a;
      for (a = 0; a < d;) {
        f = a++;
        let g = this.xM(b, c);
        this.j.appendChild(g);
        this.frames.push(g);
        this.Va[f] = 1 / d * f;
      }
      this.delay = 0.3;
      this.EO = e;
    }
    free() {
      this.j.free();
      this.j = null;
    }
    xM(a, b) {
      let c = new Container();
      let d = a / 2;
      let e = b / 2;
      var f = new Sprite(c, Resources.Kd, Keys.eI);
      f.setUniformScale(0.25);
      var g = new Sprite(c, Resources.Kd, Keys.fI);
      g.setUniformScale(0.25);
      g.setX(a - g.getWidth());
      var h = new Sprite(c, Resources.Kd, Keys.dI);
      h.setUniformScale(0.25);
      h.setX(a - h.getWidth());
      h.setY(b - h.getHeight());
      h = new Sprite(c, Resources.Kd, Keys.cI);
      h.setUniformScale(0.25);
      h.setY(b - h.getHeight());
      let m = new Sprite(c, Resources.Kd, Keys.Ny);
      m.setX(f.getX() + f.getWidth());
      m.setScaleX((g.getX() - f.getWidth()) / m.X.x);
      m.setScaleY(0.25);
      g = new Sprite(c, Resources.Kd, Keys.Ny);
      g.setScaleX(m.Ra);
      g.setScaleY(0.25);
      g.setX(f.getX() + f.getWidth());
      g.setY(b - g.getHeight());
      b = new Sprite(c, Resources.Kd, Keys.Oy);
      b.setY(f.getHeight());
      b.setScaleX(0.25);
      b.setScaleY((h.getY() - f.getHeight()) / b.X.y);
      f = new Sprite(c, Resources.Kd, Keys.Oy);
      f.setScaleX(0.25);
      f.setScaleY(b.ed);
      f.setX(a - f.getWidth());
      f.setY(b.getY());
      for (a = 0; a < 8;) {
        f = a++;
        b = c.nb(f);
        b.setX(b.getX() - d);
        f = c.nb(f);
        f.setY(f.getY() - e);
      }
      c.setX(d);
      c.setY(e);
      return c;
    }
    update(a) {
      this.delay -= a;
      if (!(this.delay > 0) && this.j != null) {
        super.update(a);
        this.j.L(true);
        for (var b = 0, c = this.frames.length; b < c;) {
          var d = b++;
          this.Va[d] += a;
          if (this.Va[d] > 1) {
            this.Va[d] -= this.Va[d];
          }
          let e = this.frames[d];
          d = this.Va[d];
          e.W(remap(d, 0, 1, 1, 0));
          e.setUniformScale(remap(d, 0, 1, 0.89, 1.1));
          if (this.EO) {
            e.setUniformScale(remap(d, 0, 1, 0.89, 1.1));
          } else {
            e.setUniformScale(remap(d, 0, 1, 1.1, 0.89));
          }
        }
      }
    }
  }
  AnimatedNineSlice.i = true;
  AnimatedNineSlice.s = GameObject;
  Object.assign(AnimatedNineSlice.prototype, {
    l: AnimatedNineSlice
  });

  class TouchableEntity extends Entity {
    constructor() {
      super();
      new Rect(-1, -1, -1, -1);
      this.cM = this.state = 0;
    }
    Ak(a) {
      this.state = a;
    }
    vw(a, b) {
      if (this.state == 0 && this.Ql(a, b)) {
        this.Ak(1);
        return true;
      } else {
        return false;
      }
    }
    sQ(a, b) {
      if (this.state == 1 && (this.Ak(0), this.Ql(a, b))) {
        if (this.sw != null) {
          this.sw(this.cM);
        }
        return true;
      } else {
        return false;
      }
    }
    Ql(a, b) {
      return PointInCircle.Cx(a, b, this.x, this.y, 20);
    }
  }
  TouchableEntity.i = true;
  TouchableEntity.s = Entity;
  Object.assign(TouchableEntity.prototype, {
    l: TouchableEntity
  });
  class GameItemSwitcher extends Entity {
    constructor(a) {
      super();
      this.S = a;
      this.Pv = this.Br = false;
      this.jq = this.Gq = 0;
    }
    CO(a, b, c, d, e, f, g) {
      this.YL = d;
      this.iO = c;
      this.dD = b | 1;
      this.gr = 1;
      this.oB = e;
      this.pB = f;
      this.nB = g;
      this.x = a.x;
      this.y = a.y;
      this.time = X.gi();
      this.zf = new Container();
      this.zf.setX(this.x);
      this.zf.setY(this.y);
      this.S.ma(5).P(this.zf.u);
      this.Po = new PollenEmitter(this.S, 7);
      this.Po.x = this.x;
      this.Po.y = this.y;
      this.zv = new Sprite(this.zf, Resources.de, Keys.pH);
      this.zv.setUniformScale(0.4);
      this.zv.center();
      this.Av = new Sprite(this.zf, Resources.de, Keys.qH);
      this.Av.center();
      this.Av.setUniformScale(0.4);
      this.fd = this.cc = this.ca = null;
      this.mg = true;
    }
    update(a) {
      super.update(a);
      if (this.Br) {
        this.Gq += a;
        var b = Math.min(1, this.Gq / 0.16);
        this.zf.W(1 - b);
        if (b == 1) {
          this.zf.L(false);
          this.Br = false;
        }
      }
      if (this.Pv) {
        this.jq += a;
        b = Math.min(1, this.jq / 0.36);
        this.zf.W(b);
        if (b == 1) {
          this.Pv = false;
        }
      }
      this.time += a;
      this.zv.setY(remap(Math.sin(this.time * 5), -1, 1, 0, -5));
      this.Av.setY(remap(Math.sin(this.time * 5 + 0.05), -1, 1, 0, -3));
      if (this.cc != null && this.cc.kb != null && this.cc.kb.yc != -1 && !this.cc.Pl()) {
        this.mg = true;
        this.Si(1);
      }
      this.Po.update(a);
    }
    M() {
      super.M();
      this.Po.M();
      this.zf.setX(this.x);
      this.zf.setX(this.x);
    }
    Si(a) {
      if ((a & this.dD) != 0) {
        if (this.gr == 1) {
          this.Br = true;
          this.Gq = 0;
        }
        this.gr = a;
        if (this.ca != null) {
          if (this.ca.Pl()) {
            this.uD();
          } else {
            this.ca.Jo();
            this.ca.bs = true;
          }
        }
        if (this.cc != null) {
          a = this.cc.kb;
          if (a != null) {
            a.bh = 0.36;
          }
          if (this.cc.Pl()) {
            this.wD();
          } else {
            this.cc.Jo();
          }
        }
        if (this.fd != null) {
          if (this.fd.Pl()) {
            this.tD();
          } else {
            this.fd.Jo();
          }
        }
        switch (this.gr) {
          case 1:
            this.Pv = true;
            this.Br = false;
            this.zf.L(true);
            this.jq = 0;
            break;
          case 2:
            this.ca = new Bee(this);
            this.ca.x = this.x;
            this.ca.y = this.y;
            this.ca.Io();
            this.oB.push(this.ca);
            break;
          case 4:
            this.cc = new CandyVariant(this);
            this.cc.x = this.x;
            this.cc.y = this.y;
            this.cc.Zf = false;
            this.cc.mc = null;
            this.cc.setRadius(this.iO);
            this.cc.Io();
            this.cc.mu();
            this.pB.push(this.cc);
            break;
          case 8:
            this.fd = new BouncerFace(this, this.x, this.y, 1, this.YL);
            this.fd.mu();
            this.fd.Io();
            this.nB.push(this.fd);
        }
        this.Po.Qm(7);
        SoundFx.play(SoundFx.ghost_puff);
      }
    }
    vR() {
      let a = this.gr;
      do {
        a <<= 1;
        if (a == 32) {
          a = 2;
        }
      } while ((a & this.dD) == 0);
      this.Si(a);
    }
    vw(a, b) {
      a -= this.x;
      b -= this.y;
      if (this.mg && Math.sqrt(a * a + b * b) < 40) {
        this.vR();
        return true;
      } else {
        return false;
      }
    }
    uD() {
      if (this.ca != null) {
        Std.remove(this.oB, this.ca);
        this.ca.free();
        this.ca = null;
      }
    }
    wD() {
      if (this.cc != null) {
        this.cc.free();
        Std.remove(this.pB, this.cc);
        this.cc = null;
      }
    }
    tD() {
      if (this.fd != null) {
        Std.remove(this.nB, this.fd);
        this.fd.free();
        this.fd = null;
      }
    }
  }
  GameItemSwitcher.i = true;
  GameItemSwitcher.s = Entity;
  Object.assign(GameItemSwitcher.prototype, {
    l: GameItemSwitcher
  });

  class WorldScale {}
  WorldScale.i = true;
  class MovingEntity extends Entity {
    constructor() {
      super();
      this.$E = -1;
    }
    lx(a) {
      this.$E = a;
    }
    Sl() {
      return this.$E != -1;
    }
    Kj() {
      return new Vec2(this.x, this.y);
    }
    Jg(a) {
      this.x = a.x;
      this.y = a.y;
    }
    tg() {
      return null;
    }
    Yq() {
      let a = this.tg();
      return (a.x + a.y) / 4;
    }
    NR(a) {
      this.Dj = a.x;
    }
    NC() {}
    Ji(a) {
      this.rotation = a.angle ?? 0;
      let b = a.path;
      if (b != null) {
        let c = PathResolver.Ey;
        if (b.charAt(0) == "R") {
          c = Math.round(Numeric.parseInt(Std.substr(b, 2, null)) * 3 / 2 + 1);
        }
        a = new PathState(c, a.moveSpeed * LevelController.mn, a.rotateSpeed);
        a.angle = this.rotation;
        a.$D(b, this.x, this.y);
        this.YD(a);
        a.start();
      }
    }
  }
  MovingEntity.i = true;
  MovingEntity.s = Entity;
  Object.assign(MovingEntity.prototype, {
    l: MovingEntity
  });
  class BezierMover extends MotionBase {
    constructor(a, b) {
      super();
      this.c = new AnimSequenceCtl();
      this.wf = a;
      this.I = b;
    }
    play(a) {
      let b = a.data[0];
      this.set(b.x, b.y);
      this.c.play(a);
      this.c.Yo = cachedBind(this, this.$P);
      this.c.ik = cachedBind(this, this.ik);
      this.lq(this.c);
    }
    ik() {
      this.free();
      this.wf.tq = null;
    }
    $cachedBind(a, b, c) {
      let d = a.x;
      a = a.y;
      this.set(d + (b.x - d) * c, a + (b.y - a) * c);
    }
    set(a, b) {
      this.I.g.x = this.wf.x + a;
      this.I.g.y = this.wf.y + b;
      this.I.ha.x = this.I.g.x;
      this.I.ha.y = this.I.g.y;
    }
  }
  BezierMover.i = true;
  BezierMover.s = MotionBase;
  Object.assign(BezierMover.prototype, {
    l: BezierMover
  });
  class CharacterController {
    constructor(a) {
      this.S = a;
      this.be = null;
      this.Bq = -1;
      this.oC = false;
      this.El = [];
    }
    update(a) {
      let b = 0;
      let c = this.El;
      while (b < c.length) {
        c[b++].update(a);
      }
    }
    M() {
      let a = 0;
      let b = this.El;
      while (a < b.length) {
        b[a++].M();
      }
    }
    yu(a) {
      if (this.be == null) {
        return false;
      } else if (this.be.isActive) {
        return this.be.yu(a);
      } else {
        return false;
      }
    }
    Du(a) {
      if (this.be != null) {
        this.be.Du(a);
      }
    }
    yi() {
      if (this.be == null) {
        return false;
      } else {
        return this.be.yi();
      }
    }
    oa(a, b) {
      this.El.push(a);
      if (b == 1) {
        this.xf = new Container();
        var c = new Sprite(this.xf, Resources.wf, Keys.nH);
        c.setUniformScale(0.4);
        c.center();
        c = new Sprite(this.xf, Resources.wf, Keys.kH);
        c.setUniformScale(0.4);
        c.center();
        a.eC(this.xf, a.da);
        this.be = a;
        this.Bq = b;
      }
    }
    jk(a, b, c) {
      if (this.be == null) {
        return false;
      } else if (this.be.isActive && this.be.yi() && this.be.jk(a, b, c)) {
        this.be.kR();
        return true;
      } else {
        return false;
      }
    }
    tN() {
      if (!this.oC) {
        var a = this;
        var b = Lambda.find(this.El, function (e) {
          return e.index == a.Bq;
        });
        var c = this.Bq + 1;
        if (c == this.El.length + 1) {
          c = 1;
        }
        var d = Lambda.find(this.El, function (e) {
          return e.index == c;
        });
        d.eC(this.xf, b.da);
        b.da = null;
        this.Bq = c;
        this.be = d;
      }
    }
    ZO() {
      this.oC = true;
    }
  }
  CharacterController.i = true;
  Object.assign(CharacterController.prototype, {
    l: CharacterController
  });
  class Character extends MovingEntity {
    constructor(a) {
      super();
      this.bs = false;
      this.j = new Container();
      this.Pm = new Sprite(null, Resources.ca, X.ym() ? Keys.aH : Keys.bH);
      this.Pm.center();
      this.Pm.setUniformScale(0.4);
      this.j.appendChild(this.Pm);
      this.ca = new Sprite(null, Resources.ca, Keys.Jy);
      this.ca.setUniformScale(0.4);
      this.ca.center();
      this.j.appendChild(this.ca);
      a.ma(5).P(this.j.u);
      a = Character.iy.w / 2;
      let b = Character.iy.J / 2;
      a = this.ea = new Bounds(0 - a, 0 - b, a, b);
      this.sa = new Bounds(a.A, a.D, a.B, a.G);
    }
    pop() {
      this.ca.L(false);
      this.bs = true;
    }
    update(a) {
      super.update(a);
      this.pe();
    }
    M() {
      this.Pm.setX(this.x);
      this.Pm.setY(this.y);
      this.ca.setX(this.x);
      this.ca.setY(this.y);
      this.ca.setUniformScale(this.Dj * 0.4);
      if (this.qF || this.Sl()) {
        this.Pm.L(false);
      }
    }
    tg() {
      let a = Resources.ca.hc.yf(Keys.Jy).Od;
      return new Vec2(a.w * 0.4, a.J * 0.4);
    }
  }
  Character.i = true;
  Character.s = MovingEntity;
  Object.assign(Character.prototype, {
    l: Character
  });

  class BeeAnims {
    constructor() {
      function a(d) {
        d = new Sprite(b.j, Resources.de, Keys.jj(Keys.Wp, d));
        d.center();
        return d;
      }
      this.j = new Container();
      this.fc = [];
      let b = this;
      if (BeeAnims.zn == null) {
        BeeAnims.zn = AnimTimeline.parse("0,s.32<x34<y9<,.48,s.31>x33>y8>,.96,s.30<x34<y7<,1.44,s.31>x34>y9>,1.92,s.32x33y8,2.4,x34y9");
      }
      var c = new SpriteAnimator(a(0));
      c.loop(BeeAnims.zn);
      this.fc.push(c);
      if (BeeAnims.An == null) {
        BeeAnims.An = AnimTimeline.parse("-100,s.38>,-99.,s.4<,-99.,s.38>,-98.,s.37,0,sx.37sy.4x26<y23<,.4,x25>y22>,.8,x24<y21<,1.20,x25>y22>,1.6,x26y23");
      }
      c = new SpriteAnimator(a(1));
      c.loop(BeeAnims.An);
      this.fc.push(c);
      if (BeeAnims.Pz == null) {
        BeeAnims.Pz = AnimTimeline.parse("0,s.13<x-34<y4<,.43,s.14>x-35>y3>,.86,s.16<x-36<y2<,1.29,s.14>x-35>y3>,1.72,s.13x-34y4");
      }
      c = new SpriteAnimator(a(1));
      c.loop(BeeAnims.Pz);
      this.fc.push(c);
      if (BeeAnims.Xh == null) {
        BeeAnims.Xh = AnimTimeline.parse("0,s.24<x-30<y17<,.42,s.22>x-29>y16>,.84,s.21<x-28<y15<,1.26,s.22>x-29>y16>,1.68,s.24x-30y17");
      }
      c = new SpriteAnimator(a(0));
      c.loop(BeeAnims.Xh);
      this.fc.push(c);
      if (BeeAnims.Wh == null) {
        BeeAnims.Wh = AnimTimeline.parse("0,s.37<x-2<y31<,.47,s.38>x-3>y32>,.94,s.4<x-4<y33<,1.41,s.38>x-3>y32>,1.88,s.37x-2y31");
      }
      c = a(4);
      c.la(350);
      c = new SpriteAnimator(c);
      c.loop(BeeAnims.Wh);
      this.fc.push(c);
    }
    free() {
      this.j.free();
      this.j = null;
    }
  }
  BeeAnims.i = true;
  Object.assign(BeeAnims.prototype, {
    l: BeeAnims
  });

  class Bee extends Character {
    constructor(a) {
      super(a.S);
      this.de = a;
      this.alpha = 1;
      this.state = 0;
      this.Cb = new BeeAnims();
      this.j.appendChild(this.Cb.j);
    }
    free() {
      this.j.free();
      this.j = null;
      this.Cb.free();
      this.Cb = null;
    }
    Pl() {
      return this.state < 0;
    }
    Io() {
      if (this.state != 1) {
        this.state = 1;
        this.time = 0;
      }
    }
    Jo() {
      if (this.state != -1) {
        this.state = -1;
        this.time = 0;
      }
    }
    pop() {
      super.pop();
      this.Cb.j.L(false);
    }
    update(a) {
      super.update(a);
      if (this.state > 0) {
        this.time += a;
        let b = Math.min(1, this.time / 0.36);
        this.alpha = b;
        if (b == 1) {
          this.state = 0;
        }
      }
      if (this.state < 0) {
        this.time += a;
        a = Math.min(1, this.time / 0.16);
        this.alpha = 1 - a;
        if (a == 1) {
          this.state = 0;
          this.de.uD();
        }
      }
    }
    M() {
      super.M();
      if (this.Cb != null) {
        this.Cb.j.setX(this.x);
        this.Cb.j.setY(this.y);
      }
      this.j.W(this.alpha);
    }
  }
  Bee.i = true;
  Bee.s = Character;
  Object.assign(Bee.prototype, {
    l: Bee
  });
  class OmNom extends Entity {
    constructor(a, b) {
      super();
      this.S = a;
      this.Xa = 0;
      this.Cf = false;
      this.x = b.x * WorldScale.scale;
      this.y = b.y * WorldScale.scale;
      this.BB = X.xh(5, 20);
      this.ru = 3;
      this.Xz = false;
      this.time = 0;
      b = a.ma(1);
      this.Cp = new Sprite(null, Resources.wq);
      this.Cp.center();
      this.Cp.setUniformScale(0.4);
      b.P(this.Cp.u);
      this.Ln = new Container();
      this.Ln.setUniformScale(0.4);
      this.char = new Sprite(this.Ln, Resources.Fu, Keys.IF);
      this.char.center();
      b.P(this.Ln.u);
      this.blink = new Sprite(null, Resources.Fu, Keys.EF);
      this.blink.center();
      this.blink.setUniformScale(0.4);
      this.blink.L(false);
      b.P(this.blink.u);
      var c = Rect.Zb(OmNom.jK);
      c.x -= 128;
      c.y -= 128;
      let d = c.x;
      let e = c.y;
      c = this.ea = new Bounds(d, e, d + c.w, e + c.J);
      this.sa = new Bounds(c.A, c.D, c.B, c.G);
      this.pe();
      this.Cp.setX(this.x + Math.round(vLN023 * 0.4));
      this.Cp.setY(this.y + Math.round(vLN024 * 0.4));
      if (a.$c) {
        this.ff = new Sprite(null, Resources.ml);
        this.ff.setUniformScale(0.4);
        this.ff.pa().loop(OM_NOM_ZZZ_ANIM);
        this.ff.center();
        this.ff.setX(this.x);
        this.ff.setY(this.y);
        b.P(this.ff.u);
        this.gf = new Sprite(null, Resources.ml);
        this.gf.setUniformScale(0.4);
        this.gf.pa().loop(OM_NOM_ZZZ_ANIM_REV);
        this.gf.center();
        this.gf.setX(this.x);
        this.gf.setY(this.y);
        b.P(this.gf.u);
      }
      this.fe = null;
      this.Om = 0;
      this.Ss = -1;
      this.Fc(0);
    }
    JQ() {
      if (!this.Cf && !this.sr) {
        this.Fc(10);
      }
    }
    KQ() {
      if (!this.Cf && this.In()) {
        this.Fc(1);
      }
    }
    LQ() {
      if (!this.Cf && this.In()) {
        this.Fc(2);
      }
    }
    NQ() {
      if (!this.Cf && this.In()) {
        this.Fc(7);
      }
    }
    MQ() {
      if (!this.Cf && this.In()) {
        this.Fc(8);
      }
    }
    EQ() {
      if (!this.Cf) {
        this.Fc(5);
        this.DE();
      }
    }
    PQ() {
      if (!this.Cf) {
        this.Fc(6);
        this.DE();
        this.Cf = true;
      }
    }
    YC() {
      if (!this.Cf && this.In()) {
        this.Fc(3);
      }
    }
    $C() {
      if (!this.Cf) {
        this.Fc(11);
      }
    }
    IQ() {
      this.Fc(12);
      this.sr = true;
      SoundFx.play(SoundFx.sp_field);
      if (this.S.$c) {
        this.ff.L(false);
        this.gf.L(false);
      }
    }
    HQ() {
      if (this.Xa != 12) {
        this.Fc(13);
      }
    }
    GQ() {
      switch (this.Xa) {
        case 7:
        case 8:
        case 14:
          break;
        default:
          this.Fc(14);
      }
    }
    IO() {
      switch (this.Xa) {
        case 0:
        case 1:
        case 2:
          return true;
        default:
          return false;
      }
    }
    Lm(a) {
      if (this.sr) {
        this.fe = true;
      } else if (this.fe != a) {
        let b = this.fe == null;
        this.fe = a;
        if (b) {
          this.$C();
        } else if (a) {
          this.YC();
          this.ff.pa().stop();
          this.ff.L(false);
          this.gf.pa().stop();
          this.gf.L(false);
          SoundFx.stop(this.Ss);
          this.char.setScaleY(1);
        } else if (!this.Cf) {
          this.Om = 0;
          this.$C();
          this.ff.pa().play(OM_NOM_ZZZ_ANIM);
          this.ff.L(true);
          this.gf.pa().play(OM_NOM_ZZZ_ANIM_REV);
          this.gf.L(true);
        }
      }
    }
    In() {
      if (this.S.$c) {
        return this.fe;
      } else {
        return true;
      }
    }
    DE() {
      if (this.S.$c) {
        SoundFx.stop(this.Ss);
        this.ff.L(false);
        this.gf.L(false);
        this.Om = 0;
      }
    }
    Fc(a) {
      switch (a) {
        case 3:
        case 4:
        case 6:
        case 7:
        case 8:
        case 10:
          var b = Resources.iM;
          break;
        case 11:
        case 12:
        case 13:
        case 14:
          b = Resources.ml;
          break;
        default:
          b = Resources.Fu;
      }
      this.char.Uf(b);
      switch (a) {
        case 9:
          b = true;
          break;
        case 13:
        case 14:
          b = true;
          break;
        default:
          b = false;
      }
      this.Xa = a;
      if (b) {
        this.char.pa().loop(OM_NOM_ANIMS[a]);
      } else {
        this.char.pa().play(OM_NOM_ANIMS[a], a == 2 ? 2 : 1).Be(cachedBind(this, this.ZP));
      }
    }
    ZP() {
      let a = this;
      switch (this.Xa) {
        case 0:
          this.ru--;
          if (this.ru == 0) {
            this.blink.L(true);
            this.blink.pa().play(OM_NOM_BLINK_ANIM).Be(function () {
              a.blink.L(false);
            });
            this.ru = 3;
          }
          if (--this.BB == 0) {
            if (X.ym()) {
              this.KQ();
            } else {
              this.LQ();
            }
            this.BB = X.xh(5, 20);
          } else {
            this.Fc(0);
          }
          break;
        case 1:
        case 2:
        case 3:
        case 4:
          this.Fc(0);
          break;
        case 6:
          this.Fc(9);
          break;
        case 8:
          if (this.sr) {
            this.Fc(13);
          } else {
            this.Fc(4);
          }
          break;
        case 10:
          this.Fc(0);
          break;
        case 11:
          this.Xz = true;
          break;
        case 12:
          this.Fc(13);
      }
    }
    update(a) {
      super.update(a);
      this.pe();
      if (this.S.$c && !this.sr) {
        if (this.Xz) {
          let b = remap(Math.sin(this.time * 2), -1, 1, 0.95, 1.05);
          this.char.setOrigin(0, 433);
          this.char.setScaleY(b);
          this.time += a;
        }
        if (!this.fe) {
          this.Om += a;
          if (this.Om > 4) {
            this.Om = 0;
            this.Ss = [1041, 1040, 1039][X.xh(0, 2)];
            SoundFx.play(this.Ss);
          }
        }
      }
    }
    M() {
      super.M();
      this.sa.A = this.x + this.ea.A;
      this.sa.D = this.y + this.ea.D;
      this.sa.B = this.x + this.ea.B;
      this.sa.G = this.y + this.ea.G;
      this.Ln.setX(this.x);
      this.Ln.setY(this.y);
      this.blink.setX(this.x);
      this.blink.setY(this.y);
    }
  }
  OmNom.i = true;
  OmNom.s = Entity;
  Object.assign(OmNom.prototype, {
    l: OmNom
  });
  class RopeBase {
    constructor() {
      this.sD = 1;
      this.za = [];
    }
    Ez(a, b) {
      this.za.splice(b, 0, a);
    }
    Dz(a) {
      this.za.push(a);
    }
    oR(a) {
      this.za.splice(a, 1);
    }
  }
  RopeBase.i = true;
  Object.assign(RopeBase.prototype, {
    l: RopeBase
  });
  class Rope extends RopeBase {
    constructor(a, b, c, d, e, f, g, h) {
      super();
      this.SM = new Vec4(0, 0, 0, 1);
      this.TM = new Vec4(0, 0, 0, 1);
      this.WM = new Vec4(0, 0, 0, 1);
      this.UM = new Vec4(0, 0, 0, 1);
      this.XM = new Vec4(0, 0, 0, 1);
      this.effect = new GradientLineEffect();
      this.effect.Z = 2;
      this.va = new SceneGroup();
      this.va.Rf(this.effect);
      a.P(this.va);
      this.Fw = 0;
      this.sD = 30;
      this.yc = -1;
      this.bh = 0;
      this.wB = false;
      this.Kc = 42;
      this.Jc = b ?? new VerletPoint();
      if (e != null) {
        this.Mb = e;
      } else {
        this.Mb = new VerletPoint();
        this.Mb.Ng(1);
      }
      this.Jc.Ng(0.02);
      this.Jc.g.x = c;
      this.Jc.g.y = d;
      this.Mb.g.x = f;
      this.Mb.g.y = g;
      this.Dz(this.Jc);
      this.Dz(this.Mb);
      this.Mb.al(this.Jc, this.Kc, 0);
      a = Vec2.Ia(this.Mb.g, this.Jc.g);
      a.xA(Math.round(h / this.Kc + 2));
      this.dc(h, a);
      this.Al = false;
      this.rh = -1;
      this.PM = this.Fv = this.Mn = false;
      this.Tu = [];
      this.aA = 3;
    }
    free() {
      this.va.free();
      this.Tu = this.Mb = this.Jc = this.va = null;
    }
    Rb() {
      let a = 0;
      let b = this.za.length;
      if (b > 0) {
        let c = this.za[0].g;
        let d = 1;
        while (d < b) {
          let e = this.za[d++];
          a += c.sf(e.g);
          c = e.g;
        }
      }
      return a;
    }
    dc(a, b) {
      if (b == null) {
        b = Vec2.sc();
      }
      let c = this.za[this.za.length - 2];
      let d = this.Mb.zh(c);
      for (var e; a > 0;) {
        if (a >= this.Kc) {
          c = this.za[this.za.length - 2];
          e = new VerletPoint();
          e.Ng(0.02);
          e.g = Vec2.tb(c.g, b);
          this.Ez(e, this.za.length - 1);
          this.Mb.lA(c, e, d);
          e.al(c, this.Kc, 0);
          a -= this.Kc;
        } else {
          e = a + d;
          if (e > this.Kc) {
            a = this.Kc;
            d = e - this.Kc;
          } else {
            c = this.za[this.za.length - 2];
            this.Mb.vq(c, e);
            a = 0;
          }
        }
      }
    }
    M() {
      this.effect.OR();
      let a = this.za.length;
      var b;
      if (this.yc == -1) {
        var c = Array(a);
        for (b = 0; b < a;) {
          var d = b++;
          c[d] = this.za[d].g;
        }
        this.Su(c);
      } else {
        d = [];
        let e = [];
        let f = false;
        let g = 0;
        while (g < a) {
          let h = g++;
          c = this.za[h];
          let m = true;
          if (h > 0) {
            b = this.za[h - 1];
            if (!c.lO(b)) {
              m = false;
            }
          }
          if (c.vh.x == -1 && !m) {
            f = true;
          }
          if (f) {
            e.push(c.g);
          } else {
            d[h] = c.g;
          }
        }
        if (d.length > 0) {
          this.Su(d);
        }
        if (e.length > 0 && !this.Fv) {
          this.Su(e);
        }
      }
    }
    Su(a) {
      var b = a.length;
      let c = this.Tu;
      if (!(b < 2)) {
        var d = this.yc == -1 || this.Al ? 1 : this.bh / 1.95;
        if (!(d <= 0)) {
          if (d > 1) {
            d = 1;
          }
          var e = a[0];
          var f = a[1];
          var g = e.x - f.x;
          f = e.y - f.y;
          var h = Math.sqrt(g * g + f * f);
          this.Fw = h <= this.Kc + 0.3 ? 0 : h <= this.Kc + 1 ? 1 : h < this.Kc + 4 ? 2 : 3;
          if (!(b < 3)) {
            var m = this.SM;
            var n = this.TM;
            g = this.WM;
            var q = this.UM;
            f = this.XM;
            m.x = 0;
            m.y = 0;
            m.z = 0;
            m.w = d;
            n.x = 0.475;
            n.y = 0.305;
            n.z = 0.185;
            n.w = d;
            g.x = 0.19;
            g.y = 0.122;
            g.z = 0.074;
            g.w = d;
            q.x = 0.6755555555555556;
            q.y = 0.44;
            q.z = 0.27555555555555555;
            q.w = d;
            f.x = 0.304;
            f.y = 0.198;
            f.z = 0.124;
            f.w = d;
            if (this.wB) {
              n.x *= 3;
              n.y *= 3;
              n.z *= 3;
              q.x *= 3;
              q.y *= 3;
              q.z *= 3;
              g.x *= 3;
              g.y *= 3;
              g.z *= 3;
              f.x *= 3;
              f.y *= 3;
              f.z *= 3;
              if (n.x > 1) {
                n.x = 1;
              }
              if (n.y > 1) {
                n.y = 1;
              }
              if (n.z > 1) {
                n.z = 1;
              }
              if (q.x > 1) {
                q.x = 1;
              }
              if (q.y > 1) {
                q.y = 1;
              }
              if (q.z > 1) {
                q.z = 1;
              }
              if (g.x > 1) {
                g.x = 1;
              }
              if (g.y > 1) {
                g.y = 1;
              }
              if (g.z > 1) {
                g.z = 1;
              }
              if (f.x > 1) {
                f.x = 1;
              }
              if (f.y > 1) {
                f.y = 1;
              }
              if (f.z > 1) {
                f.z = 1;
              }
            }
            if (h > this.Kc + 7 && !this.PM) {
              h = h / this.Kc * 2;
              g.x *= h;
              f.x *= h;
              if (g.x > 1) {
                g.x = 1;
              }
              if (f.x > 1) {
                f.x = 1;
              }
            }
            h = false;
            b = (b - 1) * this.aA;
            var p = b - 1;
            m = (n.x - g.x) / p;
            var v = (n.y - g.y) / p;
            n = (n.z - g.z) / p;
            var u = (q.x - f.x) / p;
            var A = (q.y - f.y) / p;
            q = (q.z - f.z) / p;
            p = this.aA - 1;
            var D = p - 1;
            var B = c[0];
            if (B == null) {
              c[0] = e.Zb();
            } else {
              B.x = e.x;
              B.y = e.y;
            }
            for (e = 1; e <= b;) {
              B = e / b;
              var K = c[e];
              if (K == null) {
                K = c[e] = new Vec2(0, 0);
              }
              Vec2.OD(a, B, K);
              B = (e - 1) % p;
              if (B == D || e == b) {
                var E = this.Al ? 16777215 : h ? ((g.z * 255 | 0) & 255) << 16 | ((g.y * 255 | 0) & 255) << 8 | (g.x * 255 | 0) & 255 : ((f.z * 255 | 0) & 255) << 16 | ((f.y * 255 | 0) & 255) << 8 | (f.x * 255 | 0) & 255;
                K = [];
                let vA = [];
                this.effect.points.push(K);
                this.effect.Zh.push(vA);
                this.effect.vn.push(d);
                let v11 = e - B - 1;
                let V = c[v11++];
                K.push(new Vec4(V.x, V.y, 0, 1));
                E = new Vec4((E & 255) / 255, (E >> 8 & 255) / 255, (E >> 16 & 255) / 255, 1);
                for (vA.push(E); v11 <= e;) {
                  V = c[v11];
                  K.push(new Vec4(V.x, V.y, 0, 1));
                  vA.push(E);
                  ++v11;
                }
                h = !h;
                B += 1;
                g.x += m * B;
                g.y += v * B;
                g.z += n * B;
                f.x += u * B;
                f.y += A * B;
                f.z += q * B;
              }
              ++e;
            }
          }
        }
      }
    }
    xR(a) {
      var b = this.za.length;
      for (var c = this.Mb.zh(this.za[b - 2]), d; a > 0;) {
        if (a >= this.Kc) {
          var e = b - 2;
          d = this.za[e];
          this.Mb.lA(d, this.za[b - 3], c);
          this.oR(e);
          --b;
          a -= this.Kc;
        } else {
          e = c - a;
          if (e < 1) {
            a = this.Kc;
            c = this.Kc + e + 1;
          } else {
            d = this.za[b - 2];
            this.Mb.vq(d, e);
            a = 0;
          }
        }
      }
      a = (b - 1) * (this.Kc + 3);
      b = this.Mb.jg;
      c = b.length;
      for (d = 0; d < c;) {
        e = b[d++];
        if (e.type == 1) {
          e.zh = a;
        }
      }
    }
    update(a) {
      if (this.bh > 0) {
        this.bh = PathResolver.dk(this.bh, 0, 1, a);
        if (this.bh < 1.95 && this.Al) {
          this.Gw(this.yc);
        }
      }
      let b = this.za.length;
      var c;
      for (var d = 0; d < b;) {
        c = this.za[d++];
        if (c != this.Mb) {
          c.update(a);
        }
      }
      a = 0;
      for (c = this.sD; a < c;) {
        ++a;
        d = 0;
        while (d < b) {
          this.za[d++].As();
        }
      }
    }
    Gw(a) {
      this.Al = false;
      var b = this.za[a];
      var c = this.za[a + 1];
      if (c == null) {
        b.vD();
      } else {
        var d = c.jg;
        let e = d.length;
        let f = 0;
        while (f < e) {
          let g = f++;
          if (d[g].Cj == b) {
            c.mR(g);
            d = new VerletPoint();
            d.Ng(0.00001);
            d.g.Pb(c.g);
            d.ha.Pb(c.ha);
            this.Ez(d, a + 1);
            d.al(b, this.Kc, 0);
            break;
          }
        }
      }
      a = 0;
      for (b = this.za.length; a < b;) {
        c = this.za[a];
        if (c != this.Mb) {
          c.Ng(0.00001);
        }
        ++a;
      }
    }
    Fs(a) {
      this.yc = a;
      this.bh = 2;
      this.Al = true;
      this.wB = false;
    }
  }
  Rope.i = true;
  Rope.s = RopeBase;
  Object.assign(Rope.prototype, {
    l: Rope
  });

  class ColoredSegment {
    constructor(a, b, c, d, e) {
      this.start = a;
      this.end = b;
      this.color = e;
    }
  }
  ColoredSegment.i = true;
  Object.assign(ColoredSegment.prototype, {
    l: ColoredSegment
  });
  class PathResolver {
    constructor(a, b, c) {
      if (c == null) {
        c = 0;
      }
      if (b == null) {
        b = 0;
      }
      this.Fm = c;
      this.path = [];
      if (a > 0) {
        this.qC = [];
        c = 0;
        while (c < a) {
          this.qC[c++] = b;
        }
      }
      this.g = new Vec2(0, 0);
      this.angle = 0;
      this.reverse = this.paused = false;
      this.Xf = this.qm = 0;
    }
    fq(a) {
      this.path.push(a);
    }
    start() {
      if (this.path.length > 0) {
        this.g.Pb(this.path[0]);
        this.Xf = 1;
        this.eA();
      }
    }
    eA() {
      this.offset = Vec2.Ia(this.path[this.Xf], this.g);
      this.offset.normalize();
      this.offset.multiply(this.qC[this.Xf]);
    }
    update(a) {
      if (!this.paused) {
        if (this.path.length > 0) {
          let b = this.path[this.Xf];
          let c = false;
          if (this.g.gN(b)) {
            c = true;
          } else {
            let d = a;
            if (this.qm != 0) {
              d = a + this.qm;
              this.qm = 0;
            }
            this.g.add(Vec2.Ob(this.offset, d));
            if (!MathUtil.LD(this.offset.x, b.x - this.g.x) || !MathUtil.LD(this.offset.y, b.y - this.g.y)) {
              this.qm = Vec2.Ia(this.g, b).Rb();
              this.qm /= this.offset.Rb();
              this.g.Pb(b);
              c = true;
            }
          }
          if (c) {
            if (this.reverse) {
              this.Xf--;
              if (this.Xf < 0) {
                this.Xf = this.path.length - 1;
              }
            } else {
              this.Xf++;
              if (this.Xf >= this.path.length) {
                this.Xf = 0;
              }
            }
            this.eA();
          }
        }
        if (this.Fm != 0) {
          this.angle += this.Fm * a;
        }
      }
    }
    static dk(a, b, c, d) {
      if (b != a) {
        if (b > a) {
          a += c * d;
          if (a > b) {
            a = b;
          }
        } else {
          a -= c * d;
          if (a < b) {
            a = b;
          }
        }
      }
      return a;
    }
    static ek(a, b, c, d) {
      let e = false;
      if (b != a) {
        if (b > a) {
          a += c * d;
          if (a > b) {
            a = b;
          }
        } else {
          a -= c * d;
          if (a < b) {
            a = b;
          }
        }
        if (b == a) {
          e = true;
        }
      }
      return new PathStep(a, e);
    }
  }
  PathResolver.i = true;
  Object.assign(PathResolver.prototype, {
    l: PathResolver
  });
  class PathState extends PathResolver {
    constructor(a, b, c) {
      super(a, b, c);
    }
    $D(a, b, c) {
      if (a.charAt(0) == "R") {
        var d = Numeric.parseInt(Std.substr(a, 2, null));
        var e = Math.round(d * 3 / 2);
        var f = Math.PI * 2 / e;
        let g = 0;
        d *= LevelController.mn;
        if (a.charAt(1) != "C") {
          f = -f;
        }
        for (a = 0; a < e;) {
          ++a;
          this.fq(new Vec2(b + d * Math.cos(g), c + d * Math.sin(g)));
          g += f;
        }
      } else {
        this.fq(new Vec2(b, c));
        if (a.charAt(a.length - 1) == ",") {
          a = Std.substr(a, 0, a.length - 1);
        }
        d = a.split(",");
        e = d.length;
        f = 0;
        while (f < e) {
          this.fq(new Vec2(b + parseFloat(d[f]) * LevelController.mn, c + parseFloat(d[f + 1]) * LevelController.mn));
          f += 2;
        }
      }
    }
  }
  PathState.i = true;
  PathState.s = PathResolver;
  Object.assign(PathState.prototype, {
    l: PathState
  });

  class SeekerPath extends PathResolver {
    constructor(a, b, c) {
      super(0);
      this.g.x = b.x;
      this.g.y = b.y;
      this.speed = c;
      this.I = a;
    }
    fq() {}
    start() {}
    update(a) {
      let b = this.I.x - this.g.x;
      let c = this.I.y - this.g.y;
      var d = b * b + c * c;
      if (d < 0.000001) {
        this.g.x = this.I.x;
        this.g.y = this.I.y;
      } else {
        d = Math.sqrt(d);
        this.g.x += b / d * this.speed * a;
        this.g.y += c / d * this.speed * a;
        this.speed += a * 50;
      }
    }
    static HB(a, b) {
      return new SeekerPath(a, b, 300);
    }
  }
  SeekerPath.i = true;
  SeekerPath.s = PathResolver;
  Object.assign(SeekerPath.prototype, {
    l: SeekerPath
  });

  class PathStep {
    constructor(a, b) {
      this.value = a;
      this.sk = b;
    }
  }
  PathStep.i = true;
  Object.assign(PathStep.prototype, {
    l: PathStep
  });
  class PointLink {
    constructor(a, b, c) {
      this.Cj = a;
      this.zh = b;
      this.type = c;
    }
  }
  PointLink.i = true;
  Object.assign(PointLink.prototype, {
    l: PointLink
  });
  class Particle {
    constructor() {
      this.Vn = false;
      this.Ng(1);
      this.ts();
    }
    Ng(a) {
      this.weight = a;
      this.zr = 1 / a;
      this.Kb = new Vec2(0, PhysicsConfig.wy * a);
    }
    ts() {
      this.sb = Vec2.sc();
      this.a = Vec2.sc();
      this.g = Vec2.sc();
      this.xd = Vec2.sc();
      this.ft = Vec2.sc();
    }
    Vh(a, b) {
      if (!a.TO()) {
        this.g.add(Vec2.Ob(a, b / 1));
      }
    }
  }
  Particle.i = true;
  Object.assign(Particle.prototype, {
    l: Particle
  });
  class VerletPoint extends Particle {
    constructor() {
      super();
      this.ha = new Vec2(INT32_MAX, INT32_MAX);
      this.vh = new Vec2(-1, -1);
      this.jg = [];
      this.ft = Vec2.sc();
      this.ts();
    }
    ts() {
      super.ts();
      this.ha = new Vec2(INT32_MAX, INT32_MAX);
      this.ha.x = INT32_MAX;
      this.ha.y = INT32_MAX;
      this.vD();
    }
    vD() {
      this.jg = [];
    }
    al(a, b, c) {
      this.jg.push(new PointLink(a, b, c));
    }
    mR(a) {
      this.jg.splice(a, 1);
    }
    lO(a) {
      let b = this.jg;
      let c = b.length;
      let d = 0;
      while (d < c) {
        if (b[d++].Cj == a) {
          return true;
        }
      }
      return false;
    }
    vq(a, b) {
      let c = this.jg;
      let d = c.length;
      let e = 0;
      while (e < d) {
        let f = c[e++];
        if (f.Cj == a) {
          f.zh = b;
          break;
        }
      }
    }
    lA(a, b, c) {
      let d = this.jg;
      let e = d.length;
      let f = 0;
      while (f < e) {
        let g = d[f++];
        if (g.Cj == a) {
          g.Cj = b;
          g.zh = c;
          break;
        }
      }
    }
    zh(a) {
      let b = this.jg;
      let c = b.length;
      let d = 0;
      while (d < c) {
        let e = b[d++];
        if (e.Cj == a) {
          return e.zh;
        }
      }
      return -1;
    }
    update(a) {
      if (a != 0) {
        var b = this.ft;
        var c = PhysicsConfig.current;
        if (this.Vn) {
          b.x = 0;
          b.y = 0;
        } else if (c.y != 0 || c.x != 0) {
          b.x = c.x;
          b.y = c.y;
        } else {
          b.x = this.Kb.x * this.zr;
          b.y = this.Kb.y * this.zr;
        }
        b = a / 1 * a;
        this.a.x = this.ft.x * b;
        this.a.y = this.ft.y * b;
        if (this.ha.x == INT32_MAX) {
          this.ha.x = this.g.x;
          this.ha.y = this.g.y;
        }
        this.xd.x = this.g.x - this.ha.x + this.a.x;
        this.xd.y = this.g.y - this.ha.y + this.a.y;
        if (a > 0) {
          a = 1 / a;
          this.sb.x = this.xd.x * a;
          this.sb.y = this.xd.y * a;
        }
        this.ha.x = this.g.x;
        this.ha.y = this.g.y;
        this.g.x += this.xd.x;
        this.g.y += this.xd.y;
      }
    }
    As() {
      var a = this.vh;
      let b = this.g;
      let c = this.zr;
      let d;
      let e = 0;
      let f = 0;
      if (a.x != -1) {
        b.x = a.x;
        b.y = a.y;
      } else {
        a = this.jg;
        for (var g = a.length, h = 0; h < g;) {
          var m = a[h++];
          var n = m.Cj;
          let u = n.g;
          var q = u.x - b.x;
          d = u.y - b.y;
          if (q == 0 && d == 0) {
            d = q = 1;
          }
          var p = Math.sqrt(q * q + d * d);
          var v = m.zh;
          m = m.type;
          if (m == 1) {
            if (p <= v) {
              continue;
            }
          } else if (m == 2 && p >= v) {
            continue;
          }
          m = n.vh.x == -1;
          n = n.zr;
          p = (p - v) / ((p > 1 ? p : 1) * (c + n));
          if (m) {
            e = q;
            f = d;
          }
          v = c * p;
          q *= v;
          d *= v;
          b.x += q;
          b.y += d;
          if (m) {
            q = n * p;
            u.x -= e * q;
            u.y -= f * q;
          }
        }
      }
    }
  }
  VerletPoint.i = true;
  VerletPoint.s = Particle;
  Object.assign(VerletPoint.prototype, {
    l: VerletPoint
  });
  class PhysicsConfig {
    static toggle() {
      PhysicsConfig.current.y = -PhysicsConfig.current.y;
    }
    static NO() {
      if (PhysicsConfig.current.y == PhysicsConfig.wy) {
        return PhysicsConfig.current.x == 0;
      } else {
        return false;
      }
    }
    static reset() {
      PhysicsConfig.current.x = 0;
      PhysicsConfig.current.y = PhysicsConfig.Et;
    }
  }
  PhysicsConfig.i = true;

  class SmokeEmitter extends ParticleEmitter {
    constructor(a, b) {
      super(b);
      this.S = a;
      this.wb = [];
      this.angle = 0;
      this.wn = 50;
      this.Xc = 0.5;
      this.Xv = 0.3;
      this.duration = 1.5;
      this.speed = 80;
      this.yp = 10;
    }
    free() {
      let a = 0;
      let b = this.wb;
      while (a < b.length) {
        b[a++].free();
      }
    }
    qh(a) {
      super.qh(a);
      a = new Sprite(null, Resources.Kd, Keys.hI);
      a.center();
      a.setUniformScale(0.2 + Math.random() * 0.1);
      this.S.ma(5).P(a.u);
      a.Wd(3);
      this.wb.push(a);
    }
    Kh(a, b, c) {
      a.g.add(Vec2.Ob(a.dir, c));
      super.Kh(a, b, c);
    }
    Fg(a) {
      super.Fg(a);
      let b = this.wb[a];
      this.wb.splice(a, 1);
      b.free();
    }
    M() {
      super.M();
      let a = 0;
      let b = this.ac.length;
      while (a < b) {
        var c = a++;
        let d = this.ac[c];
        c = this.wb[c];
        c.setX(d.g.x);
        c.setY(d.g.y);
        c.la(d.angle);
        c.W(d.Xc / d.Fr);
      }
    }
    update(a) {
      super.update(a);
      a = 0;
      let b = this.ac.length;
      while (a < b) {
        let c = this.ac[a++];
        c.angle = 52 + Math.atan2(c.dir.y, c.dir.x) * RAD2DEG;
      }
    }
  }
  SmokeEmitter.i = true;
  SmokeEmitter.s = ParticleEmitter;
  Object.assign(SmokeEmitter.prototype, {
    l: SmokeEmitter
  });

  class PollenEmitter extends ParticleEmitter {
    constructor(a, b) {
      super(b);
      this.S = a;
      this.wb = [];
      this.size = 0.6;
      this.wx = 0.2;
      this.angle = X.gi() * 360;
      this.wn = 15;
      this.xs = 30;
      this.Xc = 0.8;
      this.Xv = 0.3;
      this.duration = 1.5;
      this.speed = 140;
      this.yp = 35;
    }
    Qm(a) {
      super.Qm(a);
    }
    qh(a) {
      super.qh(a);
      this.angle += 360 / this.Kx;
      let b = this.size + X.Ac() * this.wx;
      let c = Keys.jj(Keys.Wp, X.xh(0, 2));
      let d = Resources.de.hc.yf(c).ec;
      a.width = d.x * b;
      a.height = d.y * b;
      a.Eq = this.Fm + this.xs * X.Ac();
      a = new Sprite(null, Resources.de, c);
      a.center();
      this.S.ma(5).P(a.u);
      this.wb.push(a);
    }
    Kh(a, b, c) {
      a.angle += a.Eq * c;
      super.Kh(a, b, c);
    }
    Fg(a) {
      super.Fg(a);
      let b = this.wb[a];
      this.wb.splice(a, 1);
      b.free();
    }
    M() {
      super.M();
      let a = 0;
      let b = this.ac.length;
      while (a < b) {
        var c = a++;
        let d = this.ac[c];
        c = this.wb[c];
        c.la(d.angle);
        c.setUniformScale(d.width / c.X.x * 0.4);
        c.setX(d.g.x);
        c.setY(d.g.y);
        c.W(d.alpha);
      }
    }
    update(a) {
      super.update(a);
      a = 0;
      let b = this.ac.length;
      while (a < b) {
        let c = this.ac[a++];
        if (c.Xc > 0) {
          if (c.Xc < c.Fr * 0.7) {
            c.alpha = c.Xc / (c.Fr * 0.7);
          }
          c.dir.x *= 0.9;
          c.dir.y *= 0.9;
          c.width *= 1.015;
          c.height *= 1.015;
        }
      }
    }
  }
  PollenEmitter.i = true;
  PollenEmitter.s = ParticleEmitter;
  Object.assign(PollenEmitter.prototype, {
    l: PollenEmitter
  });
  class DirectionalSpray extends ParticleEmitter {
    constructor(a, b) {
      super(5);
      this.S = a;
      this.angle = b;
      this.wn = 10;
      this.speed = 500;
      this.yp = 100;
      this.Xc = 0.6;
      this.size = 12;
      this.Lq = 100;
      this.aj.r = 1;
      this.aj.ue = 1;
      this.aj.b = 1;
      this.aj.a = 0.6;
      this.ei.r = 1;
      this.ei.ue = 1;
      this.ei.b = 1;
      this.ei.a = 0;
      this.wb = [];
    }
    qh(a) {
      super.qh(a);
      a = new Sprite(null, Resources.wm, Keys.VC(6 + X.xh(0, 2)));
      a.setUniformScale(0.4);
      a.center();
      a.Wd(3);
      this.S.ma(5).P(a.u);
      this.wb.push(a);
    }
    Kh(a, b, c) {
      super.Kh(a, b, c);
      a.dir.multiply(0.9);
      b = Vec2.Ob(a.dir, c);
      b.add(this.Kb);
      a.g.add(b);
    }
    Fg(a) {
      super.Fg(a);
      let b = this.wb[a];
      this.wb.splice(a, 1);
      b.free();
    }
    M() {
      super.M();
      let a = 0;
      let b = this.ac.length;
      while (a < b) {
        var c = a++;
        let d = this.ac[c];
        c = this.wb[c];
        c.setX(d.g.x);
        c.setY(d.g.y);
        c.W(d.color.a);
      }
    }
  }
  DirectionalSpray.i = true;
  DirectionalSpray.s = ParticleEmitter;
  Object.assign(DirectionalSpray.prototype, {
    l: DirectionalSpray
  });

  class SwarmManager extends GameObject {
    constructor(a) {
      super();
      this.zw = [];
      this.bD = new Container();
      a.ma(0).P(this.bD.u);
    }
    NL(a, b) {
      var c = [0.3, 0.3, 0.5, 0.5, 0.6];
      var d = c = c[MathUtil.fp(0, c.length - 1)];
      if (MathUtil.eR()) {
        c *= 1 + MathUtil.fp(0, 1) / 10;
      } else {
        d *= 1 + MathUtil.fp(0, 1) / 10;
      }
      let e = Math.min(1 - c, 1 - d);
      let f = Math.random();
      let g = new SwarmParticle();
      this.bD.appendChild(g.U);
      g.yQ = b;
      g.x = a.x;
      g.y = a.y;
      g.Ys = e + c;
      g.Zs = e + d;
      g.Hm = g.Ys * f;
      g.Im = g.Zs * f;
      g.Oq = c;
      g.Pq = d;
      g.Mq = 0.3;
      g.zx = 1;
      g.alpha = f * 0.7 + 0.3;
      this.zw.push(g);
    }
    DA(a, b, c) {
      let d = c.pb.path[a];
      b = Vec2.Ia(c.pb.path[b], d);
      c = b.Rb();
      if (!(c < EPSILON)) {
        c = Math.floor(c / 17.6);
        b.normalize();
        for (var e = 0; e <= c;) {
          var f = Vec2.tb(d, Vec2.Ob(b, e * 17.6));
          f.x += MathUtil.fp(-1.6, 1.6);
          f.y += MathUtil.fp(-1.6, 1.6);
          this.NL(f, a);
          ++e;
        }
      }
    }
    update(a) {
      super.update(a);
      let b = 0;
      let c = this.zw;
      while (b < c.length) {
        let e = c[b];
        ++b;
        var d = PathResolver.ek(e.Hm, e.Oq, 1, a);
        e.Hm = d.value;
        if (d.sk) {
          d = e.Ys;
          e.Ys = e.Oq;
          e.Oq = d;
        }
        d = PathResolver.ek(e.Im, e.Pq, 1, a);
        e.Im = d.value;
        if (d.sk) {
          d = e.Zs;
          e.Zs = e.Pq;
          e.Pq = d;
        }
        d = PathResolver.ek(e.alpha, e.Mq, 1, a);
        e.alpha = d.value;
        if (d.sk) {
          d = e.zx;
          e.zx = e.Mq;
          e.Mq = d;
        }
      }
    }
    M() {
      let a = 0;
      let b = this.zw;
      while (a < b.length) {
        let c = b[a];
        ++a;
        c.U.gS(c.x, c.y, c.Hm * 0.4, c.Im * 0.4);
        c.U.W(c.alpha);
      }
    }
  }
  SwarmManager.i = true;
  SwarmManager.s = GameObject;
  Object.assign(SwarmManager.prototype, {
    l: SwarmManager
  });
  class SwarmParticle {
    constructor() {
      this.Hm = this.Ys = this.Oq = this.Im = this.Zs = this.Pq = this.alpha = this.zx = this.Mq = 1;
      this.yQ = this.x = this.y = 0;
      this.U = new Sprite(null, Resources.Ld, Keys.JG);
      this.U.center();
    }
  }
  SwarmParticle.i = true;
  Object.assign(SwarmParticle.prototype, {
    l: SwarmParticle
  });

  class ParticleData {
    constructor() {
      this.bj = new Vec2(0, 0);
      this.g = new Vec2(0, 0);
      this.dir = new Vec2(0, 0);
      this.$s = this.fs = 0;
      this.color = new RGBA(0, 0, 0, 0);
      this.bi = new RGBA(0, 0, 0, 0);
      this.angle = this.Eq = this.Fr = this.Xc = this.size = 0;
      this.scale = this.alpha = 1;
      this.height = this.width = 0;
    }
  }
  ParticleData.i = true;
  Object.assign(ParticleData.prototype, {
    l: ParticleData
  });
  class PointWithSize {
    constructor(a, b, c) {
      this.x = a;
      this.y = b;
      this.size = c;
    }
  }
  PointWithSize.i = true;
  Object.assign(PointWithSize.prototype, {
    l: PointWithSize
  });
  class LevelBackground {
    constructor(a) {
      this.S = a;
      this.j = new Container();
      this.Ea = new Sprite(this.j);
      a.ma(0).P(this.j.u);
      this.$u = false;
    }
    xS() {
      this.og = new Container();
      this.j.appendChild(this.og);
      this.Xn = new Sprite(this.og, Resources.Xn);
      this.Xn.center();
    }
    pN() {
      this.$u = !this.$u;
      this.Xn.tween().rotation(this.$u ? 180 : 0, 0.3, Easing.poly(100));
    }
    update() {
      let a = Application.instance.window.pi();
      let b = this.S.Ag;
      let c = this.S.zg;
      var d = new Bounds(0, 0, a.x, a.y).hi(this.S.Ag / this.S.zg);
      var e = this.S.Bb.Ab.zoom;
      let f = (a.x - (d.B - d.A)) / e;
      d = (a.y - (d.G - d.D)) / e;
      this.Ea.Uf(Resources.uu);
      this.Ea.center();
      e = false;
      if (a.x / a.y < 1.2) {
        this.Ea.la(0);
        this.Ea.setScaleX((b + f) / this.Ea.X.x);
        this.Ea.setScaleY((c + d) / this.Ea.X.y);
      } else {
        this.Ea.la(90);
        e = true;
        this.Ea.setScaleX((c + d) / this.Ea.X.x);
        this.Ea.setScaleY((b + f) / this.Ea.X.y);
      }
      this.Ea.setX(b / 2);
      this.Ea.setY(c / 2);
      if (this.Xn != null) {
        if (e) {
          this.og.setScaleX(this.Ea.ed);
          this.og.setScaleY(this.Ea.Ra);
          this.og.setX(this.Ea.getX() + this.Ea.ed * 55);
          this.og.setY(this.Ea.getY() + this.Ea.Ra * 10);
        } else {
          this.og.setScaleX(this.Ea.Ra);
          this.og.setScaleY(this.Ea.ed);
          this.og.setX(this.Ea.getX() + this.Ea.Ra * 10);
          this.og.setY(this.Ea.getY() - this.Ea.ed * 40);
        }
      }
    }
  }
  LevelBackground.i = true;
  Object.assign(LevelBackground.prototype, {
    l: LevelBackground
  });
  class PuffEffect extends Node {
    constructor() {
      super();
      this.j = new Container();
      this.wb = [];
      this.Pp = [];
      this.cl = [];
      let a = 0;
      while (a < 10) {
        let c = a++;
        var b = X.Yn(-PI / 2 - PI / 4, -PI / 2 + PI / 4);
        this.Pp[c] = new Vec4(Math.cos(b) * 10, Math.sin(b) * 10, 0, 1);
        b = this.wb[c] = new Sprite(this.j, Resources.Yb, [Keys.aJ, Keys.bJ, Keys.cJ][X.xh(0, 2)]);
        b.center();
        b.setUniformScale(X.Yn(0.75, 2));
        b.la(Math.random() * 360);
        this.cl[c] = X.BA(10);
      }
    }
    dispose() {
      super.dispose();
      this.j.free();
      this.wb = null;
    }
    update(a) {
      super.update(a);
      let b = a = 0;
      while (b < 10) {
        let c = b++;
        this.Pp[c].y += 0.25;
        let d = this.wb[c];
        d.setX(d.getX() + this.Pp[c].x);
        d.setY(d.getY() + this.Pp[c].y);
        d.la(d.Zd + this.cl[c]);
        if (this.time > 3) {
          d.W(d.Uc * 0.95);
          if (d.Uc < 0.05) {
            ++a;
          }
        }
      }
      if (a == 10) {
        this.dispose();
      }
    }
  }
  PuffEffect.i = true;
  PuffEffect.s = Node;
  Object.assign(PuffEffect.prototype, {
    l: PuffEffect
  });
  class BounceAnim extends Node {
    constructor(a, b, c) {
      if (c == null) {
        c = false;
      }
      if (b == null) {
        b = 1;
      }
      super();
      this.T = a;
      this.scale = b;
      this.loop = c;
      this.time = 0;
      a.setScale(1, 1);
      a.centerOrigin();
      this.g = new Vec4(a.getX(), a.getY(), 0, 1);
    }
    dispose() {
      this.T.setScale(1, 1);
      this.T.setX(this.g.x);
      this.T.setY(this.g.y);
      super.dispose();
    }
    update(a) {
      super.update(a);
      a = this.time;
      if (a < 0.1) {
        a = Math.sin(a / 0.1 * (Math.PI / 2)) * 0.05 * this.scale;
        var b = 1 - a;
        a = 1 + a;
      } else if (a < 0.3) {
        b = a - 0.1;
        a = ((b /= 0.09999999999999999) < 1 ? b * 0.055 * b * b : ((b -= 2) * b * b + 2) * 0.055) * this.scale;
        b = 0.95 + a;
        a = 1.05 - a;
      } else if (a < 0.6) {
        a = (a - 0.3) / 0.3 - 1;
        a = (a * a * a + 1) * 0.05 * this.scale;
        b = 1.06 - a;
        a = 0.94 + a;
      } else {
        if (this.loop) {
          if (a > 4) {
            this.time = 0;
          }
        } else {
          this.dispose();
        }
        return;
      }
      this.T.setX(this.g.x + b);
      this.T.setY(this.g.y + a);
      this.T.setScaleX(b);
      this.T.setScaleY(a);
    }
  }
  BounceAnim.i = true;
  BounceAnim.s = Node;
  Object.assign(BounceAnim.prototype, {
    l: BounceAnim
  });
  class LevelCurtain extends Node {
    constructor() {
      super();
      LevelCurtain.instance = this;
      this.Sm = Application.instance.jd && this.O.window.Hc.x == 1920;
      this.state = 0;
      this.j = new Container();
      this.node = new SceneRoot();
      this.node.P(this.j.u);
      this.node.name = "cover";
      this.Pc = new ColorRectShape(null, new Vec4(0, 0, 0, 1));
      this.Pc.W(0.5);
      this.j.node.P(this.Pc.u);
      this.cs = [];
      this.Bs = [1, 1];
      this.le = [new Sprite(this.j, Resources.xj, Keys.vy), new Sprite(this.j, Resources.xj, Keys.vy)];
      this.front = [new Sprite(this.j, Resources.xj, Keys.uy), new Sprite(this.j, Resources.xj, Keys.uy)];
      this.zb = [new Sprite(this.j, Resources.yc, Keys.YF), new Sprite(this.j, Resources.yc, Keys.ZF)];
      this.Qn = null;
      if (Application.instance.config.oo) {
        this.Qn = new ColorTransform();
        this.front[1].pp(this.Qn);
      }
      this.Oe = new Sprite(null, Resources.yc, Keys.VF);
      this.node.P(this.Oe.u);
      let a = Application.instance.jd ? this.Sm ? 1 : 1.5 : 1;
      this.Oe.setPivot(a * 652, a * 577);
      this.rl = new Vec4(0, 0, 0, 1);
      this.Oe.L(false);
      this.Oe.W(0);
      this.Oe.setUniformScale(a);
      this.dc = new Sprite(null, Resources.yc, Keys.XF);
      this.dc.L(false);
      this.dc.W(0);
      this.node.P(this.dc.u);
      this.dc.setOrigin(this.dc.X.x / 2, 0);
      this.dc.setPivot(this.dc.X.x / 2, 0);
      this.uk = new Vec4(0, 0, 0, 1);
      this.le[0].setScaleX(0.001);
      this.le[1].setScaleX(0.001);
      this.front[0].setX(-this.front[0].X.x);
      this.front[1].setScaleX(-1);
      this.zb[0].setPivot(this.zb[0].X.x, 0);
      this.zb[0].setOrigin(this.zb[0].X.x, 0);
      this.node.Gd();
      this.Cr = false;
      this.layout();
    }
    ZD() {
      this.Cr = true;
      this.layout();
    }
    dispose() {
      super.dispose();
      this.node.free();
      this.Ur = null;
      LevelCurtain.instance = null;
    }
    dF(a) {
      this.Ur = a;
      this.time = 0;
      this.state = 5;
    }
    JA() {
      this.time = 0;
      this.le[0].setScaleX(1);
      this.le[1].setScaleX(1);
      this.zb[0].L(false);
      this.zb[1].L(false);
      this.layout();
      this.animate(1);
      this.state = 6;
      SoundFx.stop(SoundFx.electric);
      SoundFx.stop(SoundFx.monster_chewing);
    }
    DM() {
      this.Oe.L(true);
      this.state = 1;
      this.time = 0;
    }
    nu() {
      this.dc.L(true);
      this.state = 3;
      this.time = 0;
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 1:
          a = this.jb(1.5);
          this.Oe.setX(this.rl.x);
          this.Oe.setY(this.rl.y);
          this.Oe.W(Easing.quadOut()(a));
          if (a == 1) {
            this.state = 2;
            this.time = 0;
          }
          break;
        case 2:
          a = this.jb(2);
          this.Oe.setX(this.rl.x);
          this.Oe.setY(this.rl.y * (1 - a));
          if (a == 1) {
            this.state = 0;
            this.Oe.L(false);
          }
          break;
        case 3:
          a = this.jb(1);
          this.dc.W(Easing.quadOut()(a));
          this.dc.setX(this.uk.x);
          this.dc.setY(this.uk.y * 0);
          this.zb[0].L(true);
          this.zb[1].L(true);
          this.zb[0].W(this.dc.Uc);
          this.zb[1].W(this.dc.Uc);
          this.zb[0].setY(-this.zb[0].getHeight() * 0.9);
          this.zb[1].setY(-this.zb[1].getHeight() * 0.9);
          if (a == 1) {
            this.state = 4;
            this.time = 0;
          }
          break;
        case 4:
          a = this.jb(2);
          this.dc.setX(this.uk.x);
          this.dc.setY(this.uk.y * a);
          var b = this.dc.Jx(new Vec4(0, 0, 0, 1));
          b = this.j.Ix(b);
          this.zb[0].setY(Math.min(0, b.y - this.zb[0].getHeight() * 0.9));
          this.zb[1].setY(Math.min(0, b.y - this.zb[1].getHeight() * 0.9));
          if (a == 1) {
            this.state = 0;
            this.dc.L(false);
          }
          break;
        case 5:
          a = this.jb(2);
          this.animate(a);
          if (a == 1) {
            this.Cr = true;
            this.state = 0;
            if (this.Ur != null) {
              this.Ur();
              this.Ur = null;
            }
          }
          break;
        case 6:
          a = this.jb(2);
          this.animate(1 - a);
          if (a == 1) {
            this.Cr = false;
            this.state = 7;
          }
      }
    }
    layout() {
      var a = Application.instance.window.pi();
      this.j.update(0.016666666666666666);
      var b = a.x;
      var c = a.y;
      var d = b;
      var e = c;
      if (Application.instance.window.Pj() > 2) {
        d = b / 2;
        e = c / 2;
        b = this.node.Db;
        b.scale.x = b.scale.y = b.scale.z = 2;
        b.K = b.K & -2 | 244;
      }
      d /= 2;
      this.j.setX(d);
      b = this.front[0];
      b.setScaleX(d / b.X.x);
      b.setX(-b.getWidth());
      this.Bs[0] = b.Ra;
      this.cs[0] = b.getX();
      c = this.front[1];
      c.setScaleX(-d / c.X.x);
      c.setX(c.getWidth());
      this.Bs[1] = -c.Ra;
      this.cs[1] = c.getX();
      this.rl.x = d;
      this.rl.y = e;
      this.uk.x = d;
      this.uk.y = e;
      this.j.setScaleY(e / b.X.y);
      this.node.Gd();
      this.dc.setX(this.uk.x);
      this.animate(this.Cr ? 1 : 0);
      e = this.O.jd ? this.Sm ? 1 : 1.75 : 1;
      this.zb[0].setScaleX(e);
      this.zb[1].setScaleX(e);
      this.dc.setUniformScale(e);
      if (a.x / a.y > 3) {
        a = this.dc;
        a.setUniformScale(a.Ra * 0.75);
        a = this.zb[0];
        a.setScaleX(a.Ra * 0.75);
        a = this.zb[1];
        a.setScaleX(a.Ra * 0.75);
      }
    }
    animate(a) {
      this.front[0].setScaleX((1 - a) * this.Bs[0]);
      this.front[1].setScaleX((-1 + a) * this.Bs[1]);
      this.front[0].setX(this.cs[0] - a * this.le[0].getWidth());
      this.front[1].setX(this.cs[1] + a * this.le[1].getWidth());
      if (this.Qn != null) {
        this.Qn.Vw(-a);
        this.front[1].pp(this.Qn);
      }
      let b = this.O.jd ? this.Sm ? 1 : 1.75 : 1;
      this.le[0].setScaleX(a);
      this.le[0].setX(this.front[0].getX() + this.front[0].getWidth());
      this.le[1].setScaleX(a);
      this.le[1].setX(this.front[1].getX() - this.front[1].getWidth() - this.le[1].getWidth());
      this.zb[0].setScaleX((1 - a) * b);
      this.zb[0].setX(this.le[0].getX());
      this.zb[0].W(1 - a);
      this.zb[1].setScaleX((1 - a) * b);
      this.zb[1].setX(this.le[1].getX() + this.le[1].getWidth());
      this.zb[1].W(1 - a);
      this.Pc.W((1 - a) * 0.5);
    }
  }
  LevelCurtain.i = true;
  LevelCurtain.s = Node;
  Object.assign(LevelCurtain.prototype, {
    l: LevelCurtain
  });

  class TimedFader extends MovingEntity {
    constructor(a) {
      super();
      this.T = a;
      a.W(0);
      this.time = this.state = 0;
    }
    show() {
      this.setState(1);
    }
    oh() {
      this.time = 0;
      this.setState(3);
    }
    update(a) {
      this.time += a;
      switch (this.state) {
        case 1:
          a = Math.min(this.time / 1, 1);
          this.T.W(a);
          if (a == 1) {
            this.setState(2);
          }
          break;
        case 2:
          if (Math.min(this.time / (LevelState.box == 1 && LevelState.level == 1 ? 10 : 5), 1) == 1) {
            this.setState(3);
          }
          break;
        case 3:
          a = Math.min(this.time / 0.5, 1);
          this.T.W(1 - a);
          if (a == 1) {
            this.setState(0);
            this.T.L(false);
          }
      }
    }
    M() {
      this.T.setX(this.x);
      this.T.setY(this.y);
      this.T.la(this.rotation);
    }
    setState(a) {
      this.time = 0;
      this.state = a;
    }
  }
  TimedFader.i = true;
  TimedFader.s = MovingEntity;
  Object.assign(TimedFader.prototype, {
    l: TimedFader
  });
  class TutorialHintText extends TimedFader {
    constructor(a, b) {
      let c = new TextNode(null, Resources.ji);
      c.setText(a);
      c.setBoxSize(b, 512);
      c.setFontSize(26);
      c.setAlign(0);
      c.Tf(true);
      c.Wd(2);
      c.W(0.7);
      super(c);
    }
  }
  TutorialHintText.i = true;
  TutorialHintText.s = TimedFader;
  Object.assign(TutorialHintText.prototype, {
    l: TutorialHintText
  });

  class ScreenFade extends GameObject {
    constructor(a) {
      super();
      this.U = new Sprite();
      this.U.setColor(new Vec4(0.17647058823529413, 0.17647058823529413, 0.17647058823529413, 1), a.Ag, a.zg);
      this.U.W(0);
      let b = new AnimTimeline();
      b.La(0, 0);
      b.La(0, 0.3);
      b.La(0.2, 0.6);
      new SpriteAnimator(this.U).play(b);
      a.ma(0).P(this.U.u);
    }
    free() {
      this.U.free();
    }
  }
  ScreenFade.i = true;
  ScreenFade.s = GameObject;
  Object.assign(ScreenFade.prototype, {
    l: ScreenFade
  });

  class LevelToast extends Node {
    constructor(a) {
      super();
      this.j = new Container();
      this.Nn = new Sprite(this.j);
      this.Nn.setColor(new Vec4(1, 1, 1, 0.5), 400, 100);
      this.Nn.setX(-200);
      this.Nn.setY(-50);
      let b = [1, 1.6, 2, 1.6, 2, 2, 2.2, 2, 1.6, 2, 2, 1, 1.6];
      let c = [603, 20, 350, 27, 38, 60, 471, 68, 306, 71, 197, 104, 622, 110, 144, 131, -44, 133, 544, 136, 307, 151, 409, 156, 61, 157];
      let d = 0;
      let e = 0;
      let f = b.length;
      while (e < f) {
        let g = new Sprite(this.j, Resources.Kd, Keys.iI);
        g.center();
        g.setUniformScale(b[e++] * 0.7);
        g.setX(c[d++] / 600 * 400 - 200);
        g.setY(c[d++] / 187 * 100 - 50);
      }
      this.wc = new TextNode(this.j, Resources.ji);
      this.wc.setText(a);
      this.wc.setBoxSize(500, 100);
      this.wc.setFontSize(40);
      this.wc.setAlign(0, 0);
      this.wc.Tf(true);
      this.wc.setX(this.Nn.getX() - 50);
      this.wc.setY(this.Nn.getY());
      this.state = 0;
    }
    dispose() {
      super.dispose();
      this.j.free();
    }
    update(a) {
      super.update(a);
      a = this.O.fa.dr().hi(0.6666666666666666);
      this.j.setX((a.A + a.B) / 2);
      this.j.setY(a.G - 150);
      this.j.setUniformScale((a.B - a.A) / 600);
      switch (this.state) {
        case 0:
          a = this.jb(0.5);
          let b = Easing.backOut(0.1)(a);
          let c = this.j;
          c.setUniformScale(c.Ra * b);
          this.j.W(a);
          if (a == 1) {
            this.state = 1;
            this.time = 0;
          }
          break;
        case 1:
          if (this.O.hd().Nb(0) && this.time > 2) {
            this.time = 0;
            this.state = 2;
          }
          break;
        case 2:
          a = this.jb(0.25);
          this.j.W(1 - a);
          if (a == 1) {
            this.time = 0;
            this.state++;
          }
          break;
        case 3:
          this.dispose();
      }
    }
  }
  LevelToast.i = true;
  LevelToast.s = Node;
  Object.assign(LevelToast.prototype, {
    l: LevelToast
  });
  class HintPointerAnim extends Node {
    constructor() {
      super();
      this.state = 0;
    }
    Qr() {
      super.Qr();
      let a = this.parent;
      this.Wc = new Sprite(a.ra, Resources.Wa, Keys.kL);
      this.Wc.center();
      this.Wc.setX(378);
      this.Wc.setY(364);
      this.Wc.W(0);
      this.Bf = new Sprite(a.ra, Resources.Wa, Keys.lL);
      this.Bf.setX(368);
      this.Bf.setY(354);
      this.Bf.W(0);
    }
    update(a) {
      super.update(a);
      this.Wc.setUniformScale(remap(Math.sin(this.time * 10), -1, 1, 1, 1.1));
      a = this.parent;
      switch (this.state) {
        case 0:
          if (this.time < 1) {
            break;
          }
          this.time = 0;
          this.state = 1;
          break;
        case 1:
          a = this.jb(0.5);
          this.Wc.W(a);
          this.Bf.W(a);
          this.Bf.setX(428 + Easing.quadOut()(a) * -60);
          this.Bf.setY(414 + Easing.quadOut()(a) * -60);
          if (a == 1) {
            this.time = 0;
            this.state = 2;
          }
          break;
        case 2:
          var b = this.jb(0.25);
          this.Bf.setUniformScale(remap(b, 0, 1, 1, 0.9));
          if (b == 1) {
            this.time = 0;
            this.state = 3;
            a.I.Fb(a.I.qf == Keys.kz ? Keys.jz : Keys.kz);
            a.fC();
          }
          break;
        case 3:
          b = this.jb(0.5);
          this.Bf.setUniformScale(remap(Easing.quadOut()(b), 0, 1, 0.9, 1));
          if (b == 1) {
            this.time = 0;
            this.state = a.I.qf == Keys.jz ? 5 : 4;
          }
          break;
        case 4:
          if (this.time > 1) {
            this.time = 0;
            this.state = 2;
          }
          break;
        case 5:
          a = this.jb(0.5);
          this.Wc.W(1 - a);
          this.Bf.W(1 - a);
          this.Bf.setX(368 + Easing.quadIn()(a) * 60);
          this.Bf.setY(354 + Easing.quadIn()(a) * 60);
          if (a == 1) {
            this.dispose();
          }
      }
    }
  }
  HintPointerAnim.i = true;
  HintPointerAnim.s = Node;
  Object.assign(HintPointerAnim.prototype, {
    l: HintPointerAnim
  });
  class HorizontalScroller extends Node {
    constructor(a, b, c, d) {
      super();
      this.j = a;
      this.min = b;
      this.max = c;
      this.offsetX = d;
      this.vt = this.pg = this.ng = this.vk = 0;
      this.Tn = 0.03;
      this.Dn = this.En = false;
      this.$o = this.ap = 0;
      this.Wv = this.pl = INT16_MIN;
    }
    update() {
      var a = this.O.hd();
      let b = this.O.gO().cO();
      if (b != 0) {
        this.pg += (b > 0 ? 1 : b < 0 ? -1 : 0) * -10;
        this.Tn = 0.05;
        this.Dn = this.En = false;
      } else if (a.Nb(0)) {
        this.ng = 0;
        this.Ru = this.Wv = this.pl = a.position[0].x;
        this.pg = this.vt = 0;
        this.Dn = this.En = false;
        this.Tn = 0.03;
        this.time = 0;
      } else if (a.qe(0)) {
        this.vk += this.ng;
        this.ng = 0;
        this.pg = this.pl - this.Wv;
      } else {
        if (a.zo(0)) {
          this.Wv = this.pl;
          this.pl = a.position[0].x;
          this.ng = this.pl - this.Ru;
        } else {
          if (this.En) {
            if (this.ap * this.ap < 0.001) {
              this.En = false;
            } else {
              this.pg += this.ap * 0.1;
            }
          } else if (this.Dn) {
            if (this.$o * this.$o < 0.001) {
              this.Dn = false;
            } else {
              this.pg -= this.$o * 0.1;
            }
          } else if (this.ap < 0) {
            this.En = true;
            this.Tn = 0.3;
          } else if (this.$o < 0) {
            this.Dn = true;
            this.Tn = 0.3;
          }
          this.vt = (this.vt + this.pg) * (1 - this.Tn);
          this.pg = 0;
          this.vk += this.vt;
        }
        a = this.offsetX + (this.vk + this.ng);
        this.j.setX(a);
        this.ap = this.offsetX - a;
        this.$o = this.max + a - this.offsetX;
      }
    }
  }
  HorizontalScroller.i = true;
  HorizontalScroller.s = Node;
  Object.assign(HorizontalScroller.prototype, {
    l: HorizontalScroller
  });
  class UIWidget extends Node {
    constructor() {
      super();
      this.ec = null;
      this.focused = false;
      this.ke = 0;
      this.j = new Container();
    }
    $w() {}
    setActive(a) {
      this.active = a;
    }
    select() {
      this.Ad(true);
    }
    focus() {
      this.focused = true;
    }
    blur() {
      this.focused = false;
    }
    Ad(a) {
      this.SO = a;
    }
    getX() {
      return this.j.getX();
    }
    setX(a) {
      this.j.setX(a);
      return a;
    }
    getY() {
      return this.j.getY();
    }
    setY(a) {
      this.j.setY(a);
    }
    up(a) {
      this.j.setX(a - this.j.getWidth());
    }
    getHeight() {
      return this.j.getHeight();
    }
    ri() {
      return this.j.ri();
    }
    L(a) {
      this.j.L(a);
    }
  }
  UIWidget.i = true;
  UIWidget.s = Node;
  Object.assign(UIWidget.prototype, {
    l: UIWidget
  });
  class LevelDot extends UIWidget {
    constructor(a) {
      super();
      this.Ci = a;
      this.j = new Container();
      this.icon = new Sprite(this.j, Resources.Wa, Keys.OK);
      this.pO = new HitTestRect(this.j.node, new Bounds(20, 10, 170, 160));
    }
    focus() {}
    blur() {
      super.blur();
      this.icon.Fb(Keys.$p);
    }
    bS(a, b) {
      this.icon.Fb(Keys.$p);
      let c = new TextNode(this.j, Resources.ic);
      c.setBoxSize(this.icon.getWidth(), this.icon.getHeight());
      c.setText(Numeric.Ed(this.Ci));
      c.setAlign(0, 0);
      c.setFontSize(this.icon.getHeight() * 0.5);
      c.setY(c.getY() - 20);
      new Sprite(this.j, Resources.Wa, LevelDot.zE[a]);
      if (b) {
        new Sprite(this.j, Resources.Wa, LevelDot.zE[4]);
      }
    }
    Ub(a) {
      if (this.icon.qf == Keys.$p || this.focused) {
        return this.pO.Ub(a);
      } else {
        return false;
      }
    }
  }
  LevelDot.i = true;
  LevelDot.s = UIWidget;
  Object.assign(LevelDot.prototype, {
    l: LevelDot
  });

  class ScoreLabel extends Node {
    constructor() {
      super();
      this.Oa = new Sprite(null, Resources.Wa, Keys.Tt);
      this.label = new TextNode(null, Resources.ic);
    }
    setText(a) {
      this.label.setText(a);
      this.layout();
    }
    Qr() {
      let a = this.parent;
      a.node.P(this.Oa.u);
      a.node.P(this.label.u);
    }
    layout() {
      var a = this.parent;
      var b = a.fa.getWidth();
      a = Math.min(a.fa.lB().x * 0.1, a.fa.lB().y * 0.1);
      this.Oa.setUniformScale(a / this.Oa.X.x);
      this.Oa.setX(b - this.Oa.getWidth() - 20);
      this.Oa.setY(20);
      b = this.Oa.getHeight() * 0.1;
      this.label.setBoxSize(300, this.Oa.getHeight() - b * 2);
      this.label.setAlign(1, 0);
      this.label.setX(this.Oa.getX() - 300);
      this.label.setY(this.Oa.getY() + b);
      this.label.setMultiline();
    }
  }
  ScoreLabel.i = true;
  ScoreLabel.s = Node;
  Object.assign(ScoreLabel.prototype, {
    l: ScoreLabel
  });

  class HitTestRect {
    constructor(a, b) {
      this.rect = new SpriteNode(a);
      this.rect.Lb(b.B - b.A, b.G - b.D);
      a = this.rect.Db;
      a.translate.x = b.A;
      a.translate.y = b.D;
      a.K = a.K & -2 | 496;
    }
    Ub(a) {
      NodeTreeUtil.Yf(this.rect);
      this.rect.pe();
      return this.rect.Ub(a);
    }
  }
  HitTestRect.i = true;
  Object.assign(HitTestRect.prototype, {
    l: HitTestRect
  });
  class ButtonBase extends UIWidget {
    constructor(a, b, c, d) {
      super();
      this.frame = b;
      this.Kl = c;
      if (a == null) {
        a = Resources.Wa;
      }
      this.T = new Sprite(null, a, this.frame = b);
      this.j.appendChild(this.T);
      this.icon = null;
      if (d != null) {
        this.icon = new Sprite(null, a, d);
        this.icon.centerOrigin();
        this.j.appendChild(this.icon);
      }
      a = this.T.X;
      this.ec = new Vec4(a.x, a.y, 0, 1);
      this.ke = 0;
    }
    reset() {
      this.T.Fb(this.frame);
    }
    $w(a) {
      if (this.focused) {
        a = true;
      }
      if (this.Kl != null) {
        this.j.nb(0).Fb(a ? this.Kl : this.frame);
      }
    }
    update(a) {
      super.update(a);
      if (this.ke > 0) {
        this.ke -= a;
        if (this.ke < 0) {
          this.T.Fb(this.frame);
          this.ke = 0;
        }
      }
    }
    focus() {}
    select() {
      super.select();
      this.ke = 0.2;
    }
    Ub(a) {
      return this.j.Ub(a);
    }
    static create(a, b, c, d) {
      return new ButtonBase(a, b, c, d);
    }
  }
  ButtonBase.i = true;
  ButtonBase.s = UIWidget;
  Object.assign(ButtonBase.prototype, {
    l: ButtonBase
  });
  class AlbumButton extends ButtonBase {
    constructor() {
      super(Resources.Wa, Keys.Uk, Keys.Vk, Keys.mK);
      let a = Save.kk;
      if (a != 0) {
        new Sprite(this.j, Resources.Wa, Keys.oK);
        if (a > 19) {
          a = 19;
        }
        new Sprite(this.j, Resources.Wa, "album/" + a);
      }
    }
  }
  AlbumButton.i = true;
  AlbumButton.s = ButtonBase;
  Object.assign(AlbumButton.prototype, {
    l: AlbumButton
  });

  class AdPowerupButton extends ButtonBase {
    constructor(a, b, c, d) {
      super(a, b, c);
      this.IL = d;
      this.pm = false;
      this.time = Math.random();
      this.setState("ENoAd");
    }
    ND(a) {
      switch (this.state) {
        case "EAd":
          this.setState(a ? "EAd" : "ENoAd");
          break;
        case "ENoAd":
          this.setState(a ? "EAd" : "ENoAd");
      }
    }
    use() {
      // Powerups are infinite (count starts at Infinity from statics.js).
      // Skip the decrement so we never re-enter the "needs ad" path.
      if (isFinite(this.count)) {
        this.count--;
        if (this.count == 0) {
          this.badge.free();
          this.badge = null;
        }
      }
    }
    fill(a) {
      this.count = a;
      this.setState("EFilled");
    }
    reject() {
      this.setState("ENoAd");
    }
    setState(a) {
      if (this.state != a) {
        this.state = a;
        switch (this.state) {
          case "EActive":
            a = new Sprite(null, Resources.Wa, this.IL);
            a.ox("glow");
            let b = new AnimTimeline();
            b.La(0, 0);
            b.La(1, 0.5);
            b.La(0, 1);
            new SpriteAnimator(a).loop(b);
            this.j.appendChild(a);
            if (this.badge != null) {
              this.j.Jm(this.badge);
            }
            break;
          case "EAd":
            this.re = new Sprite(null, Resources.Wa, "ads_icon");
            this.re.setX(120);
            this.re.setY(120);
            this.re.center();
            this.j.appendChild(this.re);
            this.j.W(1);
            this.Ad(false);
            break;
          case "EFilled":
            this.Ad(false);
            if (this.re != null) {
              this.re.free();
              this.re = null;
            }
            this.badge = new TextNode(this.j, Resources.ic);
            this.badge.setBoxSize(60, 60);
            this.badge.setX(105);
            this.badge.setY(70);
            this.badge.kp();
            this.badge.setText(isFinite(this.count) ? Numeric.Ed(this.count) : "∞");
            this.badge.setMultiline(false);
            break;
          case "ENoAd":
            this.j.W(0.5);
            this.Ad(true);
            if (this.re != null) {
              this.re.free();
              this.re = null;
            }
        }
      }
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case "EAd":
          if (this.re != null && this.time > 3 && !this.pm) {
            this.re.setY(100);
            this.re.tween().y(110, 1, Easing.elasticOut());
            this.time = 0;
          }
          this.j.W(this.pm ? 0.5 : 1);
          break;
        case "EFilled":
          this.j.W(this.pm ? 0.5 : 1);
      }
    }
    reset() {
      super.reset();
      let a = this.j.fo("glow");
      if (a != null) {
        a.free();
      }
      this.pm = false;
      switch (this.state) {
        case "EActive":
        case "EAd":
        case "ERequested":
          this.setState("ENoAd");
      }
    }
    select() {
      super.select();
      this.ke = 0;
      switch (this.state) {
        case "EActive":
        case "EAd":
          this.setState("ERequested");
          break;
        case "EFilled":
          this.setState("EActive");
      }
    }
    Ad(a) {
      switch (this.state) {
        case "EActive":
        case "ENoAd":
          a = true;
      }
      super.Ad(a);
    }
    getHeight() {
      return this.T.getHeight();
    }
    yv() {
      return this.j.getX() + this.T.getWidth() * this.j.Ra;
    }
    getWidth() {
      return this.T.getWidth() * this.j.Ra;
    }
  }
  AdPowerupButton.i = true;
  AdPowerupButton.s = ButtonBase;
  Object.assign(AdPowerupButton.prototype, {
    l: AdPowerupButton
  });
  class AdPowerupButtonA extends AdPowerupButton {
    constructor() {
      super(Resources.Wa, Keys.fz, Keys.gz, Keys.vK);
      if (AdPowerupButtonA.Mf > 0) {
        this.fill(AdPowerupButtonA.Mf);
      }
    }
    fill(a) {
      AdPowerupButtonA.Mf = a;
      super.fill(a);
    }
    use() {
      super.use();
      // no Mf-- - infinite powerups (see statics.js)
    }
    setState(a) {
      super.setState(a);
      switch (this.state) {
        case "EActive":
          this.frame = Keys.fz;
          this.Kl = Keys.gz;
          this.T.Fb(this.frame);
          break;
        case "EFilled":
          this.frame = Keys.wK;
          this.Kl = Keys.xK;
          this.T.Fb(this.frame);
      }
    }
  }
  AdPowerupButtonA.i = true;
  AdPowerupButtonA.s = AdPowerupButton;
  Object.assign(AdPowerupButtonA.prototype, {
    l: AdPowerupButtonA
  });
  class AdPowerupButtonB extends AdPowerupButton {
    constructor() {
      super(Resources.Wa, Keys.cz, Keys.dz, Keys.qK);
      if (AdPowerupButtonB.Mf > 0) {
        this.fill(AdPowerupButtonB.Mf);
      }
    }
    fill(a) {
      AdPowerupButtonB.Mf = a;
      super.fill(a);
    }
    use() {
      super.use();
      // no Mf-- - infinite powerups (see statics.js)
    }
    setState(a) {
      super.setState(a);
      switch (this.state) {
        case "EActive":
          this.frame = Keys.cz;
          this.Kl = Keys.dz;
          break;
        case "EFilled":
          this.frame = Keys.rK;
          this.Kl = Keys.sK;
          this.T.Fb(this.frame);
      }
    }
  }
  AdPowerupButtonB.i = true;
  AdPowerupButtonB.s = AdPowerupButton;
  Object.assign(AdPowerupButtonB.prototype, {
    l: AdPowerupButtonB
  });
  class LabelledButton extends ButtonBase {
    constructor(a, b, c) {
      super(null, a, b);
      this.wc = new TextNode(null, Resources.ic);
      this.wc.setBoxSize(this.T.X.x - 80, this.T.X.y - 50);
      this.wc.setX(40);
      this.wc.setY(25);
      this.wc.setText(c);
      this.wc.setAlign(0, 0);
      this.wc.setMultiline(false);
      this.j.appendChild(this.wc);
    }
    iF() {
      this.wc.Uf(Resources.ic);
      this.wc.setBoxSize(this.T.X.x - 80, this.T.X.y - 50);
      this.wc.setAlign(0, 0);
    }
    WD(a) {
      this.wc.kp();
      this.wc.setText(a);
      this.wc.setMultiline();
    }
    static ol(a) {
      return new LabelledButton(Keys.GK, Keys.HK, a);
    }
  }
  LabelledButton.i = true;
  LabelledButton.s = ButtonBase;
  Object.assign(LabelledButton.prototype, {
    l: LabelledButton
  });
  class InternKey {
    constructor(a) {
      this.U = a;
      this.controller = this.mv();
    }
    kB() {
      if (this.controller.Yt) {
        return this.controller.Bg - this.controller.he;
      } else {
        return -1;
      }
    }
    Dc(a) {
      return this.controller.Xa == a;
    }
    play(a, b) {
      this.controller.yh = 0;
      this.controller.Iw = b != null ? b - 1 : 0;
      this.controller.play(a);
      return this;
    }
    WC(a) {
      let b = this;
      this.play(a).Be(function () {
        b.U.free();
      });
    }
    loop(a, b) {
      if (b == null) {
        b = false;
      }
      this.controller.yh = b ? 2 : 1;
      this.controller.play(a);
      return this;
    }
    stop() {
      this.controller.stop();
      return this;
    }
    Be(a) {
      this.controller.ZR(a);
    }
    Cw() {
      this.controller.vd = X.Yn(0, this.kB());
    }
    setTime(a) {
      let b = this.kB();
      this.controller.vd = a < 0 ? 0 : a > b ? b : a;
      return this;
    }
    mv() {
      let a = this.U.u.lN();
      let b = this;
      if (a == null || !a.Iz) {
        a = new AnimController();
        a.YR(function (c, d) {
          b.U.qp(d);
        });
        this.U.u.lq(a);
      }
      return a;
    }
    static create(a) {
      function b(v) {
        if (g.Zc(v) != null) {
          v = Std.substr(g.Zc(v), 1, null);
          e = v.indexOf(".") != -1 ? parseFloat(v) : 1 / Numeric.parseInt(v);
        }
      }
      function c(v) {
        return f + (v < 10 ? "000" : v < 100 ? "00" : "0") + v;
      }
      let d = [];
      let e = 0.03333333333333333;
      let f = "";
      let g = null;
      let h = 0;
      for (a = a.split(","); h < a.length;) {
        var m = a[h];
        ++h;
        g = new EReg("^([a-z][\\w\\/]*)(@[\\d\\.]+)*", "i");
        if (g.match(m)) {
          f = g.Zc(1);
          b(2);
        } else {
          g = new EReg("^(\\d+)-(\\d+)(@[\\d\\.]+)*", "");
          if (g.match(m)) {
            var n = Numeric.parseInt(g.Zc(1));
            var q = Numeric.parseInt(g.Zc(2));
            b(3);
            m = [];
            var p = n;
            if (n > q) {
              while (p >= q) {
                m.push(p--);
              }
            } else {
              while (p <= q) {
                m.push(p++);
              }
            }
            n = [];
            q = 0;
            for (p = m.length; q < p;) {
              ++q;
              n.push(e);
            }
            for (p = q = 0; p < m.length;) {
              d.push(new AnimFrameRef(c(m[p++]), n[q++]));
            }
          } else {
            g = new EReg("^(\\d+)x(\\d+)(@[\\d\\.]+)*", "");
            if (g.match(m)) {
              m = Numeric.parseInt(g.Zc(1));
              n = Numeric.parseInt(g.Zc(2));
              b(3);
              q = 0;
              while (q < n) {
                ++q;
                d.push(new AnimFrameRef(c(m), e));
              }
            } else {
              g = new EReg("^\\d+(@[\\d\\.]+)*(@[\\d\\.]+)*", "");
              if (g.match(m)) {
                b(1);
                d.push(new AnimFrameRef(c(Numeric.parseInt(g.Zc(0))), e));
              }
            }
          }
        }
      }
      return new AnimSequence(d, 0);
    }
  }
  InternKey.i = true;
  Object.assign(InternKey.prototype, {
    l: InternKey
  });
  class AnimFrameRef {
    constructor(a, b) {
      this.data = a;
      this.time = b;
    }
  }
  AnimFrameRef.i = true;
  Object.assign(AnimFrameRef.prototype, {
    l: AnimFrameRef
  });
  class AnimSequence {
    constructor(a, b) {
      this.ef = a.length;
      this.data = Array(this.ef);
      let c = 0;
      while (c < this.ef) {
        this.data[c] = a[c].data;
        ++c;
      }
      switch (b) {
        case 0:
          this.Va = Array(this.ef + 1);
          this.dj = 0;
          this.zq = a[0].time;
          c = 2;
          for (b = a[1].time; c < this.ef;) {
            if (a[c++].time != b) {
              this.zq = 0;
              break;
            }
          }
          for (c = 0; c < this.ef;) {
            this.Va[c] = this.dj;
            this.dj += a[c].time;
            ++c;
          }
          this.Va[c] = this.dj;
          break;
        case 1:
          this.Va = Array(this.ef);
          this.dj = a[this.ef - 1].time;
          this.zq = null;
          c = 0;
          while (c < this.ef) {
            this.Va[c] = a[c].time;
            ++c;
          }
      }
    }
  }
  AnimSequence.i = true;
  Object.assign(AnimSequence.prototype, {
    l: AnimSequence
  });
  class AnimComponent {
    constructor() {
      this.Yt = false;
      this.object = null;
      this.UB = false;
      this.Iz = true;
      this.sl = false;
      this.vd = 0;
      this.Hx = 1;
      this.he = this.Bg = this.uc = 0;
      this.yh = 1;
      this.next = null;
      this.type = this.typeId();
      AnimComponent.ty++;
    }
    Mm(a) {
      this.Yt = a;
    }
    free() {
      if (this.object != null) {
        this.object.detach(this);
        this.object = null;
      }
      this.Iz = false;
      AnimComponent.ty--;
    }
    Bp() {
      if (!this.UB) {
        this.Mm(false);
        this.sl = true;
        this.vd = 0;
      }
    }
    update(a) {
      if (this.Yt) {
        this.vd += a * this.Hx;
        if (this.object == null) {
          return false;
        } else {
          return this.om(this.vd);
        }
      } else if (this.sl) {
        this.vd += a;
        if (this.vd > AnimComponent.$F) {
          this.free();
        }
        return true;
      } else {
        return false;
      }
    }
    lv() {
      var a = this.vd + this.uc;
      if (this.yh == 0) {
        var b = this.he;
        var c = this.Bg;
        if (a < b) {
          return b;
        } else if (a > c) {
          return c;
        } else {
          return a;
        }
      }
      b = this.Bg - this.he;
      if (b > 0) {
        c = (a - this.he) / b;
        a = Math.floor(c);
        c -= a;
        if (this.yh == 1) {
          return this.he + c * b;
        } else if ((a & 1) == 0) {
          return this.he + c * b;
        } else {
          return this.Bg - c * b;
        }
      } else {
        return this.he;
      }
    }
    typeId() {
      return 103;
    }
  }
  AnimComponent.i = true;
  AnimComponent.Ib = [C180];
  Object.assign(AnimComponent.prototype, {
    l: AnimComponent
  });

  class AnimController extends AnimComponent {
    constructor() {
      super();
      this.Xa = null;
      this.frame = -1;
      this.Oo = this.fm = this.Iw = 0;
      this.Bi = -1;
      this.Sq = this.Rq = null;
    }
    free() {
      this.Sq = this.Rq = this.Xa = null;
      super.free();
    }
    play(a, b, c) {
      if (b == null) {
        b = 0;
      }
      this.Xa = a;
      if (c == null) {
        c = a.ef - 1;
      }
      this.fm = b;
      this.Oo = c;
      this.he = a.Va[this.fm];
      this.Bg = a.Va[this.Oo + 1];
      this.vd = this.he;
      this.Mm(true);
      this.sl = false;
      this.frame = -1;
      this.Bi = this.fm;
      this.om(this.vd);
      return this;
    }
    YR(a) {
      this.Rq = a;
    }
    ZR(a) {
      this.Sq = a;
    }
    stop() {
      this.Xa = null;
      this.Mm(false);
      this.Iw = 0;
      this.Bp();
      return this;
    }
    om() {
      var a = this.lv();
      let b;
      let c = this.Xa.ef;
      if (c == 1) {
        b = this.Bi = 0;
      } else if (a >= this.Xa.dj) {
        b = this.Bi = c - 1;
      } else {
        if (this.Xa.zq > 0) {
          b = a / this.Xa.zq | 0;
        } else {
          b = 0;
          let d = this.Xa.Va;
          if (a >= d[this.Bi] && a <= d[this.Bi + 1]) {
            b = this.Bi;
          } else if (c < 16) {
            let e = 0;
            while (e <= c) {
              if (d[e] >= a) {
                b = e - 1;
                break;
              }
              ++e;
            }
          } else {
            b = NativeArray.WL(d, a, c - 1);
            if (b < 0) {
              b = ~b;
              --b;
            }
          }
        }
        this.Bi = b;
      }
      if (b < this.fm) {
        b = this.fm;
      } else if (b > this.Oo) {
        b = this.Oo;
      }
      if (b != this.frame) {
        this.frame = b;
        this.bQ(this.Xa.data[b]);
        if (b >= this.Oo && this.yh == 0) {
          if (--this.Iw > 0) {
            this.vd = this.he;
            this.frame = -1;
            this.Bi = this.fm;
            this.om(this.vd);
          } else {
            this.Bp();
            a = this.Xa;
            this.Xa = null;
            this.cQ(a);
          }
        }
      }
      return true;
    }
    bQ(a) {
      if (this.Rq != null) {
        this.Rq(this.Xa, a, this.frame);
      }
    }
    cQ(a) {
      if (this.Sq != null) {
        this.Sq(a);
      }
    }
    typeId() {
      return 303;
    }
  }
  AnimController.i = true;
  AnimController.s = AnimComponent;
  Object.assign(AnimController.prototype, {
    l: AnimController
  });
  class SpriteAnimator {
    constructor(a) {
      this.U = a;
      this.controllers = Array(6);
      for (a = 0; a < 6;) {
        this.controllers[a++] = null;
      }
    }
    dispose() {
      if (this.controllers != null) {
        for (var a = 0, b = this.controllers; a < b.length;) {
          let c = b[a];
          ++a;
          if (c != null) {
            c.free();
          }
        }
        this.U = this.controllers = null;
      }
    }
    play(a, b) {
      this.start(a, 0, b);
    }
    loop(a, b) {
      if (b == null) {
        b = false;
      }
      this.start(a, b ? 2 : 1);
    }
    Dc() {
      return this.current.Xa != null;
    }
    stop() {
      let a = 0;
      let b = this.controllers;
      while (a < b.length) {
        let c = b[a];
        ++a;
        if (c != null) {
          c.stop();
        }
      }
    }
    start(a, b, c) {
      let d = 0;
      this.current = null;
      let e = 0;
      while (e < 6) {
        let f = e++;
        let g = a.WN();
        if (g[f] == null) {
          continue;
        }
        let h = this.controllers[f];
        if (h == null) {
          h = new AnimSequenceCtl();
          let n;
          switch (f) {
            case 0:
              n = cachedBind(this, this.hS);
              break;
            case 1:
              n = cachedBind(this, this.iS);
              break;
            case 2:
              n = cachedBind(this, this.yk);
              break;
            case 3:
              n = cachedBind(this, this.cS);
              break;
            case 4:
              n = cachedBind(this, this.dS);
              break;
            case 5:
              n = cachedBind(this, this.La);
          }
          h.Yo = n;
          h.UB = true;
          this.U.u.lq(h);
          this.controllers[f] = h;
        }
        let m = g[f].dj;
        if (m > d) {
          d = m;
          this.current = h;
        }
        h.play(g[f], b);
      }
      if (c != null) {
        this.current.ik = function () {
          c(a);
        };
      }
    }
    hS(a, b, c) {
      this.U.setScaleX(this.Nl(a, b, c));
    }
    iS(a, b, c) {
      this.U.setScaleY(this.Nl(a, b, c));
    }
    yk(a, b, c) {
      this.U.la(this.Nl(a, b, c));
    }
    cS(a, b, c) {
      this.U.setX(this.Nl(a, b, c));
    }
    dS(a, b, c) {
      this.U.setY(this.Nl(a, b, c));
    }
    La(a, b, c) {
      this.U.W(this.Nl(a, b, c));
    }
    Nl(a, b, c) {
      c = Easing.poly(a.aN * 100)(c);
      a = a.value;
      return a + (b.value - a) * c;
    }
  }
  SpriteAnimator.i = true;
  Object.assign(SpriteAnimator.prototype, {
    l: SpriteAnimator
  });
  class AnimTimeline {
    constructor() {
      this.fc = null;
      let a = [];
      let b = 0;
      while (b < 6) {
        ++b;
        a.push(0);
      }
      this.Va = a;
      this.frames = [];
    }
    Ms(a, b, c) {
      if (c == null) {
        c = 0;
      }
      this.qj(0, a, b, c);
    }
    Ns(a, b, c) {
      if (c == null) {
        c = 0;
      }
      this.qj(1, a, b, c);
    }
    setScale(a, b, c, d) {
      if (d == null) {
        d = 0;
      }
      this.Ms(a, c, d);
      this.Ns(b, c, d);
    }
    vc(a, b) {
      var c;
      if (c == null) {
        c = 0;
      }
      this.Ms(a, b, c);
      this.Ns(a, b, c);
    }
    yk(a, b, c) {
      if (c == null) {
        c = 0;
      }
      this.qj(2, a, b, c);
    }
    hE(a, b, c) {
      if (c == null) {
        c = 0;
      }
      this.qj(3, a, b, c);
    }
    iE(a, b, c) {
      if (c == null) {
        c = 0;
      }
      this.qj(4, a, b, c);
    }
    Ch(a, b, c, d) {
      if (d == null) {
        d = 0;
      }
      this.hE(a, c, d);
      this.iE(b, c, d);
    }
    La(a, b, c) {
      if (c == null) {
        c = 0;
      }
      this.qj(5, a, b, c);
    }
    gq(a, b, c) {
      var d;
      if (d == null) {
        d = 0;
      }
      let e = this.Va[0];
      this.Ms(a, e, d);
      this.Va[0] += c;
      e = this.Va[1];
      this.Ns(b, e, d);
      this.Va[1] += c;
    }
    tn(a, b, c) {
      if (c == null) {
        c = 0;
      }
      let d = this.Va[0];
      this.Ms(a, d, c);
      this.Va[0] += b;
      d = this.Va[1];
      this.Ns(a, d, c);
      this.Va[1] += b;
    }
    lu(a, b) {
      var c;
      if (c == null) {
        c = 0;
      }
      let d = this.Va[3];
      this.hE(0, d, c);
      this.Va[3] += b;
      d = this.Va[4];
      this.iE(a, d, c);
      this.Va[4] += b;
    }
    qj(a, b, c, d) {
      this.frames.push(new TimelineEvent(a, c, new KeyValueAN(b, d)));
      this.fc = null;
    }
    WN() {
      if (this.fc == null) {
        this.fc = [];
        let d = 0;
        while (d < 6) {
          let e = d++;
          var a = this.frames;
          let f = [];
          for (var b = 0; b < a.length;) {
            var c = a[b];
            ++b;
            if (c.aR == e) {
              f.push(c);
            }
          }
          if (f.length == 0) {
            this.fc[e] = null;
          } else {
            f.sort(function (g, h) {
              return g.time * 100000 - h.time * 100000 | 0;
            });
            if (f[0].time > 0) {
              switch (e) {
                case 0:
                case 1:
                case 5:
                  a = 1;
                  break;
                default:
                  a = 0;
              }
              f.unshift(new TimelineEvent(e, 0, new KeyValueAN(a, 0)));
            }
            a = Array(f.length);
            b = 0;
            for (c = f.length; b < c;) {
              let g = b++;
              let h = f[g];
              a[g] = new AnimFrameRef(h.WO, h.time);
            }
            this.fc[e] = new AnimSequence(a, 1);
          }
        }
      }
      return this.fc;
    }
    static parse(a) {
      a = a.replace(RegExp("\\s", "g"), "");
      let b = new AnimTimeline();
      let c = Object.create(null);
      c.sx = 0;
      c.sy = 1;
      c.r = 2;
      c.x = 3;
      c.y = 4;
      c.a = 5;
      let d = new EReg("(s|p|sx|sy|r|x|y|a)([\\-\\d\\.]+)([<>]*)", "");
      let e = new EReg("([\\d\\.]+)", "");
      a = a.split(",");
      let f = 0;
      let g = a.length;
      let h = -1;
      let m = [];
      while (f < g) {
        var n = a[f++];
        let q = false;
        while (d.match(n)) {
          q = true;
          n = d.Zc(1);
          let p = parseFloat(d.Zc(2));
          let v = d.Zc(3);
          switch (n) {
            case "p":
              m.push(4);
              m.push(3);
              break;
            case "s":
              m.push(1);
              m.push(0);
              break;
            default:
              m.push(c[n]);
          }
          while (m.length > 0) {
            b.qj(m.pop(), p, h, v == "<" ? -100 : v == ">" ? 100 : 0);
          }
          n = d.HP();
        }
        if (!q) {
          e.match(n);
          h = parseFloat(e.Zc(1));
        }
      }
      return b;
    }
  }
  AnimTimeline.i = true;
  Object.assign(AnimTimeline.prototype, {
    l: AnimTimeline
  });

  class AnimSequenceCtl extends AnimComponent {
    constructor() {
      super();
      this.Yo = this.ik = null;
      this.lastIndex = 0;
      this.Xa = null;
    }
    free() {
      this.Yo = this.ik = null;
      super.free();
    }
    play(a, b) {
      if (b == null) {
        b = 0;
      }
      this.Xa = a;
      this.yh = b;
      this.he = this.vd = this.lastIndex = 0;
      this.Bg = a.dj;
      this.Mm(true);
      this.sl = false;
      this.om(0);
    }
    stop() {
      this.ik = null;
      this.Mm(false);
      this.Xa = null;
      this.Bp();
    }
    om(a) {
      var b = this.lv();
      let c = this.Xa.Va;
      let d;
      var e;
      if (b <= c[0]) {
        d = e = this.lastIndex = b = 0;
      } else if (b >= c[this.Xa.ef - 1]) {
        b = 0;
        d = e = this.lastIndex = this.Xa.ef - 1;
      } else if (b > c[this.lastIndex]) {
        for (e = this.lastIndex + 1; b >= c[e];) {
          this.lastIndex = e;
          ++e;
        }
        d = this.lastIndex;
        b = (b - c[d]) / (c[e] - c[d]);
      } else if (b < c[this.lastIndex]) {
        for (e = this.lastIndex - 1; b <= c[e];) {
          this.lastIndex = e;
          --e;
        }
        d = e;
        e = this.lastIndex;
        b = (b - c[d]) / (c[e] - c[d]);
      } else {
        b = 0;
        d = e = this.lastIndex;
      }
      if (this.Yo != null) {
        this.Yo(this.Xa.data[d], this.Xa.data[e], b);
      }
      if (a > this.Bg && this.yh == 0) {
        a = this.ik;
        this.stop();
        if (a != null) {
          a();
        }
      }
      return true;
    }
    typeId() {
      return 403;
    }
  }
  AnimSequenceCtl.i = true;
  AnimSequenceCtl.s = AnimComponent;
  Object.assign(AnimSequenceCtl.prototype, {
    l: AnimSequenceCtl
  });
  class TweenTrack extends AnimComponent {
    constructor() {
      super();
    }
    free() {
      this.uh = this.Cg = this.easing = null;
      super.free();
    }
    Ih(a, b, c, d, e) {
      this.key = a;
      this.FS = b;
      this.zA = c;
      this.easing = e;
      this.he = this.vd = 0;
      this.Bg = d;
      this.Mm(true);
      this.sl = false;
    }
    stop() {
      this.Cg = this.uh = null;
      this.Bp();
    }
    om(a) {
      if (a >= this.Bg && this.yh == 0) {
        this.Bp();
        this.Cg(this.key, this.zA);
        this.uh(this.key);
        return false;
      }
      a = this.FS;
      a += (this.zA - a) * this.easing((this.lv() - this.he) / (this.Bg - this.he));
      this.Cg(this.key, a);
      return true;
    }
    typeId() {
      return 203;
    }
  }
  TweenTrack.i = true;
  TweenTrack.s = AnimComponent;
  Object.assign(TweenTrack.prototype, {
    l: TweenTrack
  });
  class C192 {
    constructor() {}
  }
  C192.i = true;
  Object.assign(C192.prototype, {
    l: C192
  });
  class TokenParser extends C192 {
    constructor() {
      super();
    }
    mS(a) {
      this.Ed = a;
      this.state = StringUtil.Dr(this.Ed, 0) ? 1 : 0;
      this.Vl = this.g = 0;
      this.Wu = this.Ed.length == 0;
    }
    vC() {
      if (this.Wu) {
        return null;
      }
      let a = this.Ed.length;
      let b;
      while (this.g < a) {
        if (b = this.Ed.charAt(this.g) == "\n") {
          this.g++;
          this.Vl = this.g;
          this.state = StringUtil.Dr(this.Ed, 0) ? 1 : 0;
          return {
            position: this.Vl,
            required: this.g != a
          };
        }
        switch (this.state) {
          case 0:
            if (StringUtil.Dr(this.Ed, this.g)) {
              this.state = 1;
            }
            this.g++;
            break;
          case 1:
            if (StringUtil.Dr(this.Ed, this.g)) {
              this.g++;
            } else {
              this.Vl = this.g;
              this.state = 0;
              return {
                position: this.Vl,
                required: false
              };
            }
        }
        if (this.g == a) {
          this.Wu = true;
          this.Vl = this.g;
          return {
            position: this.Vl,
            required: false
          };
        }
      }
      this.Wu = true;
      return null;
    }
  }
  TokenParser.i = true;
  TokenParser.s = C192;
  Object.assign(TokenParser.prototype, {
    l: TokenParser
  });

  class KeyValueAN {
    constructor(a, b) {
      this.value = a;
      this.aN = b;
    }
  }
  KeyValueAN.i = true;
  Object.assign(KeyValueAN.prototype, {
    l: KeyValueAN
  });
  class TimelineEvent {
    constructor(a, b, c) {
      this.aR = a;
      this.time = b;
      this.WO = c;
    }
  }
  TimelineEvent.i = true;
  Object.assign(TimelineEvent.prototype, {
    l: TimelineEvent
  });
  class SpriteTween {
    constructor(a) {
      this.U = a;
      this.channels = 0;
      this.Xu = [];
      this.repeat = 0;
      this.easing = Easing.linear();
    }
    x(a, b, c, d, e) {
      this.Ih(0, a, b, c, d, e);
      return this;
    }
    y(a, b, c, d, e) {
      this.Ih(1, a, b, c, d, e);
      return this;
    }
    tF(a, b) {
      this.Ih(0, a, 0.1, undefined, null);
      this.Ih(1, b, 0.1, undefined, null);
    }
    scale(a, b, c, d, e) {
      this.Ih(4, a, b, c, d, e);
      return this;
    }
    rotation(a, b, c, d, e) {
      this.Ih(5, a, b, c, d, e);
      return this;
    }
    alpha(a, b, c, d, e) {
      this.Ih(6, a, b, c, d, e);
      return this;
    }
    IS() {
      let a = this.U.u.controllers;
      while (a != null) {
        let b = a.next;
        if (a.type == 203) {
          a.stop();
        }
        a = b;
      }
      this.channels = 0;
    }
    Ih(a, b, c, d, e, f) {
      let g;
      switch (a) {
        case 0:
          g = this.U.getX();
          break;
        case 1:
          g = this.U.getY();
          break;
        case 2:
          g = this.U.Ra;
          break;
        case 3:
          g = this.U.ed;
          break;
        case 4:
          g = this.U.Ra;
          break;
        case 5:
          g = this.U.Zd;
          break;
        case 6:
          g = this.U.Uc;
      }
      let h = this.mv(a);
      h.Ih(a, g, b, c, d == null ? Easing.linear() : d);
      h.yh = e == null ? 0 : e;
      this.Xu[a] = f;
      this.channels |= 1 << a;
    }
    mv(a) {
      let b;
      let c = this.U.u.controllers;
      if (c != null) {
        if ((this.channels & 1 << a) > 0) {
          while (c != null) {
            if (c.type == 203 && (b = c, b.key == a)) {
              b.uh = cachedBind(this, this.uh);
              b.Cg = cachedBind(this, this.Cg);
              return b;
            }
            c = c.next;
          }
        } else {
          while (c != null) {
            if (c.type == 203 && c.sl) {
              b = c;
              b.uh = cachedBind(this, this.uh);
              b.Cg = cachedBind(this, this.Cg);
              return b;
            }
            c = c.next;
          }
        }
      }
      b = new TweenTrack();
      b.uh = cachedBind(this, this.uh);
      b.Cg = cachedBind(this, this.Cg);
      this.U.u.lq(b);
      return b;
    }
    Cg(a, b) {
      let c = this.U;
      switch (a) {
        case 0:
          c.setX(b);
          break;
        case 1:
          c.setY(b);
          break;
        case 2:
          c.setScaleX(b);
          break;
        case 3:
          c.setScaleY(b);
          break;
        case 4:
          c.setUniformScale(b);
          break;
        case 5:
          c.la(b);
          break;
        case 6:
          c.W(b);
      }
    }
    uh(a) {
      let b = this.Xu[a];
      if (b != null) {
        this.Xu[a] = null;
        b();
      }
    }
  }
  SpriteTween.i = true;
  Object.assign(SpriteTween.prototype, {
    l: SpriteTween
  });
  class Easing {
    static linear() {
      return function (a) {
        return a;
      };
    }
    static poly(a) {
      let b = (a < -100 ? -100 : a > 100 ? 100 : a) / 100;
      return function (c) {
        if (b == 0) {
          return c;
        } else if (b < 0) {
          return c * (c * -b + 1 + b);
        } else {
          return c * ((2 - c) * b + (1 - b));
        }
      };
    }
    static quadIn() {
      return function (a) {
        return Math.pow(a, 2);
      };
    }
    static quadInOut() {
      return function (a) {
        if ((a *= 2) < 1) {
          return Math.pow(a, 2) * 0.5;
        } else {
          return 1 - Math.abs(Math.pow(2 - a, 2)) * 0.5;
        }
      };
    }
    static quadOut() {
      return function (a) {
        return 1 - Math.pow(1 - a, 2);
      };
    }
    static backOut(a) {
      if (a == null) {
        a = 0.1;
      }
      let b = a * 17.0158;
      return function (c) {
        --c;
        return c * c * ((b + 1) * c + b) + 1;
      };
    }
    static elasticOut(a, b) {
      if (b == null) {
        b = 0.3;
      }
      if (a == null) {
        a = 0;
      }
      let c;
      let d;
      if (a < 1) {
        d = 1;
        c = b * 0.25;
      } else {
        d = a;
        c = b / TWO_PI * Math.asin(1 / d);
      }
      return function (e) {
        return d * Math.pow(2, e * -10) * Math.sin((e - c) * TWO_PI / b) + 1;
      };
    }
  }
  Easing.i = true;
  class Renderer {
    constructor(a) {
      this.name = a;
      this.info = new RendererInfo(this);
      this.rf = null;
      this.IP = 256;
      this.YO = 0.001;
      this.Ab = this.Wb = null;
      this.gA = [];
      this.clearColor = new Vec4(0, 0, 0, 1);
      this.sA = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.CM = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.viewport = new TexRect(0, 0, 1, 1);
      this.Jq = Array(1056);
      this.vl = Array(1056);
      this.wT = true;
      this.rs = Array(7);
      this.dh = Array(7);
      this.un = BitMaskTable.zG[7];
      this.od = 0;
      this.Ex = [];
      this.Wx = new ArrayList();
      this.dh[0] = new BlendModeState(1, true);
      this.dh[1] = new ClipState();
      this.dh[2] = new ColorTransformState();
      this.dh[3] = new DepthTestState(true, true);
      this.dh[4] = new ScissorState(false, 1);
      this.dh[5] = new AlphaState(1);
      this.dh[6] = new PassThroughState();
    }
    tp(a) {
      if (this.Wb != null) {
        this.Wb.dE(null);
      }
      this.Wb = a;
      this.Wb.dE(this);
    }
    MR(a) {
      let b = this.clearColor;
      b.x = a.x;
      b.y = a.y;
      b.z = a.z;
      b.w = a.w;
    }
    wk(a) {
      this.Ab = a;
    }
    cR(a) {
      this.gA.push(this.Ab);
      this.wk(a);
    }
    WQ() {
      this.wk(this.gA.pop());
    }
    Bm() {
      this.Bk(0, 0, 1, 1);
    }
    Bk(a, b, c, d) {
      let e = this.viewport;
      e.x = a;
      e.y = b;
      e.w = c - a;
      e.J = d - b;
    }
    Gi() {
      if (this.Wb == null || this.Wb.getContext() == null || this.Wb.size.x * this.Wb.size.y == 0) {
        return false;
      }
      this.uR();
      return true;
    }
    fi() {}
    Iq(a) {
      let b = this.Wx;
      b.clear();
      b.reserve(SceneNode.count);
      NodeTreeUtil.CN(a, b);
      if (b.ba > 0) {
        this.Uu(b);
      }
    }
    clear() {}
    uR() {
      this.od = 0;
      let a = this.un;
      let b = 0;
      while (b < 7) {
        let c = b++;
        this.rs[c] = this.dh[c];
        if ((a & 1 << c) != 0) {
          this.rs[c].set(this);
        }
      }
    }
    Uu(a) {
      let b = a.N;
      let c = 0;
      for (a = a.ba; c < a;) {
        this.ul(b[c++]);
      }
    }
    ul(a) {
      let b = a.effect;
      if (b != null && b.enabled && a.Ne != 1) {
        this.rf = a;
        this.Bh(a);
        this.Wn(b);
      }
    }
    $N() {
      return this.Ex.slice();
    }
    createTexture(a, b, c, d) {
      if (b == null) {
        b = 0;
      }
      b = this.Iv(b);
      this.Ex.push(b);
      b.name = d;
      b.ax(a);
      if (c != null) {
        b.IR(c);
      }
      return b;
    }
    rA(a, b, c) {
      let d = this.Iv(a.flags);
      d.name = c == null ? "-" : c;
      a.oa(d, b.clone());
      if (c != null) {
        a = a.hc.yf(c);
        d.hc.offset(a.Od.x, a.Od.y);
      }
    }
    ia(a) {
      a.free();
      Std.remove(this.Ex, a);
    }
    WA(a, b) {
      a = (b / 100 | 0) * 32 + (a / 100 | 0);
      b = this.Jq[a];
      if (b != null && !this.vl[a]) {
        this.vl[a] = true;
        b.ib(this);
      }
      return b;
    }
    XA(a, b) {
      a = 512 + (b / 100 | 0) * 32 + (a / 100 | 0);
      b = this.Jq[a];
      if (b != null && !this.vl[a]) {
        this.vl[a] = true;
        b.ib(this);
      }
      return b;
    }
    md(a) {
      var b;
      if (b == null) {
        b = false;
      }
      let c = a.AA / 100 | 0;
      var d = a.Xx / 100 | 0;
      d = (b ? 1 : 0) * 512 + d * 32 + c;
      this.Jq[d] = a;
      let e = a.Xx == 201;
      if (e) {
        let f = 0;
        while (f < 16) {
          d = f++ + 1;
          d = (b ? 1 : 0) * 512 + d * 32 + c;
          this.Jq[d] = a;
        }
      }
      if (this.wT && (a.ib(this), this.vl[d] = true, e)) {
        for (a = 0; a < 16;) {
          d = a++ + 1;
          d = (b ? 1 : 0) * 512 + d * 32 + c;
          this.vl[d] = true;
        }
      }
    }
    MM() {
      this.un &= -9;
    }
    ko(a) {
      let b = this.sA;
      let c = this.Ab.pk;
      if ((a.K & 240) > 0) {
        a.nt();
      }
      var d = a.Ue;
      a = d.m11;
      var e = d.m12;
      var f = d.m13;
      var g = d.m14;
      let h = d.m21;
      let m = d.m22;
      let n = d.m23;
      let q = d.m24;
      let p = d.m31;
      let v = d.m32;
      let u = d.m33;
      let A = d.m34;
      let D = d.m41;
      let B = d.m42;
      let K = d.m43;
      let E = d.m44;
      d = c.m11 * e + c.m12 * m + c.m13 * v + c.m14 * B;
      let v54 = c.m11 * f + c.m12 * n + c.m13 * u + c.m14 * K;
      let v55 = c.m11 * g + c.m12 * q + c.m13 * A + c.m14 * E;
      let V = c.m21 * e + c.m22 * m + c.m23 * v + c.m24 * B;
      let v56 = c.m21 * f + c.m22 * n + c.m23 * u + c.m24 * K;
      let v57 = c.m21 * g + c.m22 * q + c.m23 * A + c.m24 * E;
      let v58 = c.m31 * e + c.m32 * m + c.m33 * v + c.m34 * B;
      let v59 = c.m31 * f + c.m32 * n + c.m33 * u + c.m34 * K;
      let v60 = c.m31 * g + c.m32 * q + c.m33 * A + c.m34 * E;
      e = c.m41 * e + c.m42 * m + c.m43 * v + c.m44 * B;
      f = c.m41 * f + c.m42 * n + c.m43 * u + c.m44 * K;
      g = c.m41 * g + c.m42 * q + c.m43 * A + c.m44 * E;
      b.m11 = c.m11 * a + c.m12 * h + c.m13 * p + c.m14 * D;
      b.m12 = d;
      b.m13 = v54;
      b.m14 = v55;
      b.m21 = c.m21 * a + c.m22 * h + c.m23 * p + c.m24 * D;
      b.m22 = V;
      b.m23 = v56;
      b.m24 = v57;
      b.m31 = c.m31 * a + c.m32 * h + c.m33 * p + c.m34 * D;
      b.m32 = v58;
      b.m33 = v59;
      b.m34 = v60;
      b.m41 = c.m41 * a + c.m42 * h + c.m43 * p + c.m44 * D;
      b.m42 = e;
      b.m43 = f;
      b.m44 = g;
      return b;
    }
    oi(a) {
      if ((a.K & 64) > 0) {
        a.Tm();
      }
      var b = a.Ue;
      a = b.m11;
      var c = b.m12;
      var d = b.m14;
      let e = b.m21;
      let f = b.m22;
      let g = b.m24;
      b = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      let h = this.Ab.pk;
      let m = h.m11 * c + h.m12 * f;
      let n = h.m11 * d + h.m12 * g + h.m14;
      c = h.m21 * c + h.m22 * f;
      d = h.m21 * d + h.m22 * g + h.m24;
      b.m11 = h.m11 * a + h.m12 * e;
      b.m12 = m;
      b.m14 = n;
      b.m21 = h.m21 * a + h.m22 * e;
      b.m22 = c;
      b.m24 = d;
      return b;
    }
    Wn(a) {
      a.update(this);
      let b = this.WA(a.type, this.rf.type);
      if (b != null) {
        this.info.effect = a;
        this.info.va = this.rf;
        b.M(this.info);
      }
    }
    li(a) {
      return this.rs[a];
    }
    Bh(a) {
      if (this.un != 0) {
        var b = this.rs;
        for (var c = 0, d = this.un, e = this.od; c < 7;) {
          if ((d & 1 << c) == 0) {
            ++c;
            continue;
          }
          let f = a.Jk[c];
          if (f != null) {
            if (f.cb != b[c].cb) {
              b[c] = f;
              e |= 1 << c;
              f.set(this);
            }
          } else if ((e & 1 << c) > 0) {
            f = this.dh[c];
            b[c] = f;
            f.set(this);
            e &= ~(1 << c);
          }
          ++c;
        }
        this.od = e;
      }
    }
    jx() {}
    QD() {}
    PD() {}
    Uw() {}
    Xw() {}
    hx() {}
    jB(a) {
      return a.Db.translate.z * -0.001;
    }
  }
  Renderer.i = true;
  Object.assign(Renderer.prototype, {
    l: Renderer
  });
  class CanvasRenderer extends Renderer {
    constructor() {
      function a() {
        let c = window.document.createElement("canvas").getContext("2d", {
          alpha: true,
          willReadFrequently: true
        });
        c.canvas.width = 1024;
        c.canvas.height = 1024;
        return c;
      }
      super("2d");
      this.TL = 0;
      this.bb = this.context = null;
      this.ai = new ColorTransform();
      this.globalAlpha = 1;
      this.Kr = this.Zg = null;
      this.LB = false;
      this.Bj = 0;
      this.Tx = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.globalCompositeOperation = null;
      var b = this.rM = Array(5);
      b[0] = "source-over";
      b[1] = "source-over";
      b[2] = "multiply";
      b[3] = "lighter";
      b[4] = "screen";
      this.Lu = [null];
      for (b = 0; b < 3;) {
        ++b;
        let c = a();
        this.Lu.push(c);
      }
      this.GP = a();
      new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
    }
    tp(a) {
      super.tp(a);
      this.context = a.getContext();
      this.Lu[0] = this.context;
    }
    clear(a) {
      super.clear();
      if (a == null) {
        a = this.clearColor;
      }
      var b = this.Wb;
      let c = this.viewport;
      let d = b.size.x * c.x | 0;
      let e = b.size.y * c.y | 0;
      let f = b.size.x * c.w | 0;
      b = b.size.y * c.J | 0;
      this.clearRect(d, e, f, b);
      if (a.w != 0) {
        this.Vi("rgba(" + ((a.x * 255 | 0) & 255) + "," + ((a.y * 255 | 0) & 255) + "," + ((a.z * 255 | 0) & 255) + "," + a.w.toFixed(2) + ")");
        this.fillRect(d, e, f, b);
      }
    }
    Gi() {
      if (!super.Gi()) {
        return false;
      }
      this.bb = this.context;
      try {
        this.context.reset();
      } catch (a) {}
      this.bb.fillStyle = "#000000";
      this.globalAlpha = 1;
      this.Bm();
      this.context.save();
      this.Qx();
      return true;
    }
    fi() {
      for (super.fi(); this.Bj > 0;) {
        this.bb.restore();
        this.Bj--;
      }
      this.context.restore();
    }
    Bk(a, b, c, d) {
      super.Bk(a, b, c, d);
      for (this.Qx(); this.Bj > 0;) {
        this.bb.restore();
        this.Bj--;
      }
      this.resetTransform();
      if (a != 0 || b != 0 || c != 1 || d != 1) {
        a = new Path2D();
        b = this.Wb;
        c = this.viewport;
        a.rect(b.size.x * c.x | 0, b.size.y * c.y | 0, b.size.x * c.w | 0, b.size.y * c.J | 0);
        this.bb.save();
        this.bb.clip(a);
        this.Bj++;
      }
    }
    wk(a) {
      super.wk(a);
      this.Qx();
    }
    ul(a) {
      var b = a.effect;
      if (b != null && b.enabled && a.Ne != 1) {
        if ((a.flags & 4) > 0) {
          this.rf = a;
          a = this.globalAlpha;
          this.globalAlpha = 0.75;
          this.Wn(b);
          this.globalAlpha = a;
        } else {
          this.rf = a;
          this.Bh(a);
          if (this.Kr == null) {
            this.Wn(b);
          } else {
            this.WA(a.effect.type, a.type);
            a = this.Wb.size.x;
            var c = this.Wb.size.y;
            this.bb = this.GP;
            this.ex(a, c);
            this.Wn(b);
            this.Km(this.LB ? "destination-out" : "destination-in");
            b = this.od;
            this.od = 0;
            var d = this.rf;
            this.rf = this.Kr;
            this.Wn(this.Kr.effect);
            this.od = b;
            this.rf = d;
            b = this.bb.canvas;
            this.bb = this.context;
            this.Km("source-over");
            this.resetTransform();
            this.bb.drawImage(b, 0, 0, a, c, 0, 0, a, c);
          }
        }
      }
    }
    ko(a) {
      if ((a.K & 240) > 0) {
        a.nt();
      }
      var b = a.Ue;
      a = b.m11;
      let c = b.m12;
      let d = b.m13;
      let e = b.m14;
      let f = b.m21;
      let g = b.m22;
      let h = b.m23;
      let m = b.m24;
      let n = b.m31;
      let q = b.m32;
      let p = b.m33;
      let v = b.m34;
      let u = b.m41;
      let A = b.m42;
      let D = b.m43;
      b = b.m44;
      var B = this.Ab.pk;
      let K = this.sA;
      let E = this.Tx;
      let v62 = E.m11 * B.m11 + E.m12 * B.m21 + E.m13 * B.m31 + E.m14 * B.m41;
      let v63 = E.m11 * B.m12 + E.m12 * B.m22 + E.m13 * B.m32 + E.m14 * B.m42;
      let V = E.m11 * B.m13 + E.m12 * B.m23 + E.m13 * B.m33 + E.m14 * B.m43;
      let v64 = E.m11 * B.m14 + E.m12 * B.m24 + E.m13 * B.m34 + E.m14 * B.m44;
      let v65 = E.m21 * B.m11 + E.m22 * B.m21 + E.m23 * B.m31 + E.m24 * B.m41;
      let v66 = E.m21 * B.m12 + E.m22 * B.m22 + E.m23 * B.m32 + E.m24 * B.m42;
      let v67 = E.m21 * B.m13 + E.m22 * B.m23 + E.m23 * B.m33 + E.m24 * B.m43;
      let v68 = E.m21 * B.m14 + E.m22 * B.m24 + E.m23 * B.m34 + E.m24 * B.m44;
      let v69 = E.m31 * B.m11 + E.m32 * B.m21 + E.m33 * B.m31 + E.m34 * B.m41;
      let v70 = E.m31 * B.m12 + E.m32 * B.m22 + E.m33 * B.m32 + E.m34 * B.m42;
      let v71 = E.m31 * B.m13 + E.m32 * B.m23 + E.m33 * B.m33 + E.m34 * B.m43;
      let v72 = E.m31 * B.m14 + E.m32 * B.m24 + E.m33 * B.m34 + E.m34 * B.m44;
      let v73 = E.m41 * B.m11 + E.m42 * B.m21 + E.m43 * B.m31 + E.m44 * B.m41;
      let v74 = E.m41 * B.m12 + E.m42 * B.m22 + E.m43 * B.m32 + E.m44 * B.m42;
      let v75 = E.m41 * B.m13 + E.m42 * B.m23 + E.m43 * B.m33 + E.m44 * B.m43;
      B = E.m41 * B.m14 + E.m42 * B.m24 + E.m43 * B.m34 + E.m44 * B.m44;
      K.m11 = v62 * a + v63 * f + V * n + v64 * u;
      K.m12 = v62 * c + v63 * g + V * q + v64 * A;
      K.m13 = v62 * d + v63 * h + V * p + v64 * D;
      K.m14 = v62 * e + v63 * m + V * v + v64 * b;
      K.m21 = v65 * a + v66 * f + v67 * n + v68 * u;
      K.m22 = v65 * c + v66 * g + v67 * q + v68 * A;
      K.m23 = v65 * d + v66 * h + v67 * p + v68 * D;
      K.m24 = v65 * e + v66 * m + v67 * v + v68 * b;
      K.m31 = v69 * a + v70 * f + v71 * n + v72 * u;
      K.m32 = v69 * c + v70 * g + v71 * q + v72 * A;
      K.m33 = v69 * d + v70 * h + v71 * p + v72 * D;
      K.m34 = v69 * e + v70 * m + v71 * v + v72 * b;
      K.m41 = v73 * a + v74 * f + v75 * n + B * u;
      K.m42 = v73 * c + v74 * g + v75 * q + B * A;
      K.m43 = v73 * d + v74 * h + v75 * p + B * D;
      K.m44 = v73 * e + v74 * m + v75 * v + B * b;
      return K;
    }
    oi(a) {
      if ((a.K & 64) > 0) {
        a.Tm();
      }
      var b = a.Ue;
      a = b.m11;
      let c = b.m12;
      var d = b.m14;
      let e = b.m21;
      let f = b.m22;
      let g = b.m24;
      b = this.CM;
      let h = this.Tx;
      let m = this.Ab.pk;
      let n = h.m11 * m.m11 + h.m12 * m.m21;
      let q = h.m11 * m.m12 + h.m12 * m.m22;
      let p = h.m21 * m.m11 + h.m22 * m.m21;
      let v = h.m21 * m.m12 + h.m22 * m.m22;
      let u = n * d + q * g + (h.m11 * m.m14 + h.m12 * m.m24 + h.m14);
      d = p * d + v * g + (h.m21 * m.m14 + h.m22 * m.m24 + h.m24);
      b.m11 = n * a + q * e;
      b.m12 = n * c + q * f;
      b.m14 = u;
      b.m21 = p * a + v * e;
      b.m22 = p * c + v * f;
      b.m24 = d;
      return b;
    }
    jx(a) {
      this.La(a.Xk);
    }
    Uw(a) {
      this.Zg = a.Zg;
      this.context.globalCompositeOperation = this.rM[this.Zg];
    }
    Xw(a) {
      this.ai = a.transform;
    }
    hx(a) {
      this.Kr = a.va;
      this.LB = a.FO;
      let b = a.Gu;
      if (b != null) {
        this.bb.save();
        this.resetTransform();
        this.Bj++;
        a = this.oi(a.Xr.Fa);
        let e = new Path2D();
        var c = b[0];
        var d = new Vec4(a.m11 * c.x + a.m12 * c.y + a.m14, a.m21 * c.x + a.m22 * c.y + a.m24, 0, 1);
        e.moveTo(d.x, d.y);
        for (c = 1; c < b.length;) {
          d = b[c++];
          let f = a;
          d = new Vec4(f.m11 * d.x + f.m12 * d.y + f.m14, f.m21 * d.x + f.m22 * d.y + f.m24, 0, 1);
          e.lineTo(d.x, d.y);
        }
        e.closePath();
        this.bb.clip(e);
      } else if (this.Bj > 0) {
        this.bb.restore();
      }
    }
    Qx() {
      let a = this.Wb;
      let b = this.viewport;
      let c = (a.size.x * b.w | 0) / 2;
      let d = (a.size.y * b.J | 0) / 2;
      if (this.Wb.BS) {
        c |= 0;
        d |= 0;
      }
      let e = this.Tx;
      e.m11 = c;
      e.m12 = 0;
      e.m13 = 0;
      e.m14 = c + (a.size.x * b.x | 0);
      e.m21 = 0;
      e.m22 = -d;
      e.m23 = 0;
      e.m24 = d + (a.size.y * b.y | 0);
    }
    Iv(a) {
      return new TextureWrapper(this, a);
    }
    La(a) {
      this.globalAlpha = a;
      this.context.globalAlpha = a;
    }
    rp(a) {
      this.bb = this.Lu[a];
    }
    ex(a, b) {
      let c = this.bb.canvas;
      let d = c.width;
      let e = c.height;
      let f = false;
      let g = this.Wb.size;
      if (d > g.x || e > g.y) {
        c.width = g.x;
        c.height = g.y;
      }
      if (d < a || e < b) {
        f = true;
      } else {
        try {
          this.bb.reset();
        } catch (h) {
          f = true;
        }
      }
      if (f) {
        c.width = a;
        c.height = b;
      }
    }
    drawImage(a, b, c, d, e, f, g, h, m) {
      this.bb.drawImage(a, b, c, d, e, f, g, h, m);
    }
    Vi(a) {
      this.bb.fillStyle = a;
    }
    fE(a) {
      this.bb.strokeStyle = a;
    }
    Km(a) {
      let b = this.bb;
      if (b.globalCompositeOperation != a) {
        b.globalCompositeOperation = a;
      }
    }
    resetTransform() {
      this.bb.setTransform(1, 0, 0, 1, 0, 0);
    }
    xk(a) {
      a = this.oi(a);
      this.bb.setTransform(a.m11, a.m21, a.m12, a.m22, a.m14, a.m24);
    }
    clearRect(a, b, c, d) {
      this.bb.clearRect(a, b, c, d);
    }
    fillRect(a, b, c, d) {
      this.bb.fillRect(a, b, c, d);
    }
    Lz(a, b, c, d, e) {
      this.bb.globalAlpha = 1;
      var f = this.li(2);
      this.rp(1);
      this.ex(d, e);
      this.Km("copy");
      var g = f.transform;
      var h = g.$b;
      f = g.offset;
      switch (g.hint) {
        case 0:
          this.drawImage(a, b, c, d, e, 0, 0, d, e);
          this.PL(this.bb, g, d, e);
          break;
        case 1:
          this.bb.globalAlpha = g.$b.w;
          this.drawImage(a, b, c, d, e, 0, 0, d, e);
          break;
        case 2:
          var m = 1 - h.x;
          f = f.x == 0 ? h = g = 0 : h = g = 1;
          this.Vi("rgba(" + ((g * 255 | 0) & 255) + "," + ((h * 255 | 0) & 255) + "," + ((f * 255 | 0) & 255) + "," + m.toFixed(2) + ")");
          this.fillRect(0, 0, d, e);
          this.Km("destination-atop");
          this.drawImage(a, b, c, d, e, 0, 0, d, e);
          break;
        case 3:
          m = 1 - h.x;
          g = f.x / m;
          h = f.y / m;
          f = f.z / m;
          this.Vi("rgba(" + ((g * 255 | 0) & 255) + "," + ((h * 255 | 0) & 255) + "," + ((f * 255 | 0) & 255) + "," + m.toFixed(2) + ")");
          this.fillRect(0, 0, d, e);
          this.Km("destination-atop");
          this.drawImage(a, b, c, d, e, 0, 0, d, e);
      }
      a = this.bb.canvas;
      this.rp(0);
      return a;
    }
    Kz(a, b, c, d, e) {
      this.rp(2);
      this.ex(d, e);
      this.Vi(vLS000000);
      this.fillRect(0, 0, d, e);
      this.bb.globalAlpha = this.globalAlpha;
      this.Km("screen");
      this.drawImage(a, b, c, d, e, 0, 0, d, e);
      this.fillRect(0, 0, d, e);
      a = this.bb.canvas;
      this.rp(0);
      return a;
    }
    PL(a, b, c, d) {
      c = a.getImageData(0, 0, c, d);
      d = c.data;
      let e = 0;
      let f = d.length;
      var g = b.$b;
      var h = b.offset;
      b = g.x;
      let m = g.y;
      let n = g.z;
      g = g.w;
      let q = h.x;
      let p = h.y;
      let v = h.z;
      h = h.w;
      let u;
      while (e < f) {
        u = d[e + 3];
        d[e] = (d[e] / u * b + q) * 255;
        ++e;
        d[e] = (d[e] / u * m + p) * 255;
        ++e;
        d[e] = (d[e] / u * n + v) * 255;
        ++e;
        d[e] = (u / 255 * g + h) * 255;
        ++e;
      }
      a.putImageData(c, 0, 0);
    }
    SD(a) {
      this.bb.imageSmoothingEnabled = a;
    }
  }
  CanvasRenderer.i = true;
  CanvasRenderer.s = Renderer;
  Object.assign(CanvasRenderer.prototype, {
    l: CanvasRenderer
  });
  class WebGLRenderer extends Renderer {
    constructor() {
      super("webgl");
      this.R = null;
      this.ql = 1;
      this.ai = new ColorTransform();
      this.iu = this.stencilMask = this.tA = null;
      this.BM = new ArrayList();
    }
    tp(a) {
      super.tp(a);
      this.R = a.getContext();
      this.Bm();
    }
    clear(a) {
      super.clear();
      if (a == null) {
        a = this.clearColor;
      }
      this.R.clearColor(a.x, a.y, a.z, a.w);
      this.R.clear(17664);
    }
    Gi() {
      if (!super.Gi() || this.R == null) {
        return false;
      }
      this.Bm();
      return true;
    }
    fi() {
      super.fi();
    }
    Bk(a, b, c, d) {
      super.Bk(a, b, c, d);
      if (a == 0 && b == 0 && c == 1 && d == 1) {
        this.R.viewport(0, 0, this.Wb.size.x, this.Wb.size.y);
        this.R.disable(3089);
      } else {
        d = this.Wb;
        var e = this.viewport;
        a = d.size.x * e.x | 0;
        b = d.size.x * e.w | 0;
        c = d.size.y * e.J | 0;
        d = (this.Wb.size.y | 0) - c - (d.size.y * e.y | 0);
        this.R.viewport(a, d, b, c);
        this.R.enable(3089);
        this.R.scissor(a, d, b, c);
      }
    }
    jx(a) {
      this.ql = a.Xk;
    }
    QD(a) {
      if (a.rn) {
        this.R.enable(2884);
        this.R.frontFace(a.yL ? 2305 : 2304);
        this.R.cullFace(1029);
      } else {
        this.R.disable(2884);
      }
    }
    PD(a) {
      if (a.rn) {
        this.R.enable(2929);
        this.R.depthFunc(WebGLRenderer.JM[a.zz]);
      } else {
        this.R.disable(2929);
        this.R.depthFunc(513);
      }
    }
    Uw(a) {
      let b = 0;
      let c = 0;
      if (a.QQ) {
        switch (a.Zg) {
          case 0:
            b = 1;
            c = 0;
            break;
          case 1:
            b = 1;
            c = 771;
            break;
          case 2:
            b = 774;
            c = 771;
            break;
          case 3:
            b = 770;
            c = 772;
            break;
          case 4:
            b = 1;
            c = 769;
            break;
          case 5:
            b = WebGLRenderer.nq[a.kE];
            c = WebGLRenderer.nq[a.wA];
        }
      } else {
        switch (a.Zg) {
          case 0:
            b = 1;
            c = 0;
            break;
          case 1:
            b = 770;
            c = 771;
            break;
          case 2:
            b = 774;
            c = 771;
            break;
          case 3:
            c = b = 1;
            break;
          case 4:
            b = 770;
            c = 1;
            break;
          case 5:
            b = WebGLRenderer.nq[a.kE];
            c = WebGLRenderer.nq[a.wA];
        }
      }
      this.R.enable(3042);
      this.R.blendFunc(b, c);
      let d;
      switch (a.blendEquation) {
        case 1:
          d = 32774;
          break;
        case 2:
          d = 32778;
          break;
        case 3:
          d = 32779;
      }
      this.R.blendEquation(d);
    }
    Xw(a) {
      this.ai = a.transform;
    }
    hx(a) {
      a = a.Gu;
      if (this.iu != null && a == null) {
        this.R.disable(2960);
      }
      if (this.iu == null && a != null) {
        this.R.clearStencil(0);
        this.R.enable(2960);
        if (this.stencilMask == null) {
          this.stencilMask = new GLFillProgram(this);
        }
        this.stencilMask.ZM(a);
      }
      this.iu = a;
    }
    Uu(a) {
      if (this.IP == 0) {
        super.Uu(a);
      } else {
        var b = a.iterator();
        var c = b.N[b.xe++];
        var d = this.BM;
        d.reserve(a.ba);
        d.clear();
        var e = d.N[d.ba++] = c;
        a = c.hr;
        var f = c.effect;
        f.update(this);
        this.info.effect = f;
        for (this.info.Rz = d; b.xe < b.yg;) {
          c = b.N[b.xe++];
          c.effect.update(this);
          let g = f.type == c.effect.type;
          if (g = (g = (g = (g = g && f.cb == c.effect.cb) && (a & 3) == (c.hr & 3)) && ((a & 1) > 0 ? e.Jk[0].cb == c.Jk[0].cb : true)) && ((a & 2) > 0 ? e.Jk[1].cb == c.Jk[1].cb : true)) {
            d.N[d.ba++] = c;
          } else {
            if (d.ba == 1) {
              this.ul(d.front());
            } else {
              a = d.N[0];
              a = this.XA(a.effect.type, a.type);
              if (a != null) {
                a.M(this.info);
              } else {
                a = d.N;
                f = 0;
                e = d.ba;
                while (f < e) {
                  this.ul(a[f++]);
                }
              }
            }
            d.clear();
            e = d.N[d.ba++] = c;
            a = c.hr;
            f = c.effect;
            f.update(this);
            this.info.effect = f;
            this.info.Rz = d;
          }
        }
        if (d.ba > 0) {
          if (d.ba == 1) {
            this.ul(d.front());
          } else {
            b = d.N[0];
            b = this.XA(b.effect.type, b.type);
            if (b != null) {
              b.M(this.info);
            } else {
              b = d.N;
              c = 0;
              d = d.ba;
              while (c < d) {
                this.ul(b[c++]);
              }
            }
          }
        }
      }
    }
    Iv(a) {
      return new WebGLTexture(this, a);
    }
  }
  WebGLRenderer.i = true;
  WebGLRenderer.s = Renderer;
  Object.assign(WebGLRenderer.prototype, {
    l: WebGLRenderer
  });

  class C226 {}
  C226.i = true;
  C226.Je = true;
  Object.assign(C226.prototype, {
    l: C226
  });
  class C227 {
    constructor() {
      this.Xx = this.kh();
      this.AA = this.Bc();
    }
    ib() {}
    kh() {
      return 201;
    }
    Bc() {
      throw 8;
    }
  }
  C227.i = true;
  C227.Ib = [C226];
  Object.assign(C227.prototype, {
    l: C227
  });

  class CanvasGradientLineRenderer extends C227 {
    constructor() {
      super();
    }
    M(a) {
      var b = a.V;
      let c = a.effect;
      this.$h = a.V.Wb.getContext();
      this.$h.lineWidth = 1;
      b.xk(a.va.Fa);
      a = 0;
      for (b = c.points.length; a < b;) {
        var d = a++;
        this.$h.globalAlpha = c.vn[d];
        this.$h.lineWidth = c.Z * 2;
        let f = new Path2D();
        let g = c.points[d];
        d = c.Zh[d];
        let h = 0;
        let m = g.length;
        while (h < m) {
          let n = h++;
          var e = d[n];
          this.$h.strokeStyle = "rgba(" + ((e.x * 255 | 0) & 255) + "," + ((e.y * 255 | 0) & 255) + "," + ((e.z * 255 | 0) & 255) + "," + e.w.toFixed(2) + ")";
          e = g[n].x;
          let q = g[n].y;
          if (n == 0) {
            f.moveTo(e, q);
          } else {
            f.lineTo(e, q);
          }
        }
        this.$h.stroke(f);
      }
    }
    Bc() {
      return 705;
    }
  }
  CanvasGradientLineRenderer.i = true;
  CanvasGradientLineRenderer.s = C227;
  Object.assign(CanvasGradientLineRenderer.prototype, {
    l: CanvasGradientLineRenderer
  });
  class CanvasSolidColorRenderer extends C227 {
    constructor() {
      super();
    }
    M(a) {
      let b = a.V;
      var c = a.effect;
      var d = a.va;
      b.xk(a.va.Fa);
      a = c.color;
      if ((b.od & 4) > 0) {
        var e = b.ai;
        c = c.color;
        a = e.$b;
        let f = e.offset;
        e = c.x * a.x + f.x;
        let g = c.y * a.y + f.y;
        let h = c.z * a.z + f.z;
        c = c.w * a.w + f.w;
        a = new Vec4(e < 0 ? 0 : e > 1 ? 1 : e, g < 0 ? 0 : g > 1 ? 1 : g, h < 0 ? 0 : h > 1 ? 1 : h, c < 0 ? 0 : c > 1 ? 1 : c);
      }
      b.La(b.globalAlpha);
      b.Vi("rgba(" + ((a.x * 255 | 0) & 255) + "," + ((a.y * 255 | 0) & 255) + "," + ((a.z * 255 | 0) & 255) + "," + a.w.toFixed(2) + ")");
      d = d.size;
      b.fillRect(0, 0, d.x, d.y);
    }
    Bc() {
      return 1205;
    }
    kh() {
      return 401;
    }
  }
  CanvasSolidColorRenderer.i = true;
  CanvasSolidColorRenderer.s = C227;
  Object.assign(CanvasSolidColorRenderer.prototype, {
    l: CanvasSolidColorRenderer
  });
  class CanvasClearRenderer extends C227 {
    constructor() {
      super();
    }
    M(a) {
      let b = a.V;
      var c = a.effect;
      var d = b.Wb.size;
      a = d.x;
      d = d.y;
      b.resetTransform();
      b.La(b.globalAlpha);
      let e = 0;
      let f = 0;
      let g = c.js;
      if (g != null) {
        e = g.A;
        f = g.D;
        a = g.B - g.A;
        d = g.G - g.D;
      }
      c = c.color;
      b.Vi("rgba(" + ((c.x * 255 | 0) & 255) + "," + ((c.y * 255 | 0) & 255) + "," + ((c.z * 255 | 0) & 255) + "," + c.w.toFixed(2) + ")");
      b.fillRect(e, f, a, d);
    }
    Bc() {
      return 305;
    }
  }
  CanvasClearRenderer.i = true;
  CanvasClearRenderer.s = C227;
  Object.assign(CanvasClearRenderer.prototype, {
    l: CanvasClearRenderer
  });
  class CanvasMultiLineRenderer extends C227 {
    constructor() {
      super();
    }
    ib(a) {
      super.ib(a);
    }
    M(a) {
      let b = a.V;
      var c = a.effect;
      this.$h = a.V.Wb.getContext();
      b.xk(a.va.Fa);
      a = 0;
      for (c = c.lt; a < c.length;) {
        this.kN(c[a++]);
      }
    }
    kN(a) {
      let b = a[0];
      if (a.length != 0) {
        var c = new Path2D();
        c.moveTo(b.x, b.y);
        for (var d = 1, e = a.length; d < e;) {
          b = a[d];
          c.lineTo(b.x, b.y);
          d += 2;
        }
        for (d = a.length - 2; d >= 0;) {
          b = a[d];
          c.lineTo(b.x, b.y);
          d -= 2;
        }
        c.closePath();
        this.$h.fillStyle = "#ffffffff";
        this.$h.fill(c);
      }
    }
    Bc() {
      return 1105;
    }
  }
  CanvasMultiLineRenderer.i = true;
  CanvasMultiLineRenderer.s = C227;
  Object.assign(CanvasMultiLineRenderer.prototype, {
    l: CanvasMultiLineRenderer
  });
  class CanvasDashedCircleRenderer extends C227 {
    constructor() {
      super();
    }
    M(a) {
      var b = a.effect;
      a.V.xk(a.va.Fa);
      a = a.V.Wb.getContext();
      a.lineWidth = b.lineWidth;
      a.globalAlpha = 1;
      var c = b.color;
      a.strokeStyle = "rgba(" + ((c.x * 255 | 0) & 255) + "," + ((c.y * 255 | 0) & 255) + "," + ((c.z * 255 | 0) & 255) + "," + c.w.toFixed(2) + ")";
      c = b.Uo;
      let d = Math.PI * 2;
      let e = d / c;
      let f = b.C.x;
      let g = b.C.y;
      b = b.Z;
      let h = 0;
      while (h < c) {
        var m = h++;
        if ((m & 1) != 1) {
          m = m / c * d;
          a.beginPath();
          a.arc(f, g, b, m, m + e, false);
          a.stroke();
          a.closePath();
        }
      }
    }
    Bc() {
      return 605;
    }
  }
  CanvasDashedCircleRenderer.i = true;
  CanvasDashedCircleRenderer.s = C227;
  Object.assign(CanvasDashedCircleRenderer.prototype, {
    l: CanvasDashedCircleRenderer
  });
  class CanvasCircleStrokeRenderer extends C227 {
    constructor() {
      super();
    }
    M(a) {
      let b = a.effect;
      a.V.xk(a.va.Fa);
      a = a.V.Wb.getContext();
      a.lineWidth = b.lineWidth;
      a.globalAlpha = b.Gr;
      a.strokeStyle = "#ffffff";
      a.beginPath();
      a.arc(0, 0, b.Z + b.lineWidth / 2, 0, Math.PI * 2, false);
      a.stroke();
      a.closePath();
    }
    Bc() {
      return 905;
    }
  }
  CanvasCircleStrokeRenderer.i = true;
  CanvasCircleStrokeRenderer.s = C227;
  Object.assign(CanvasCircleStrokeRenderer.prototype, {
    l: CanvasCircleStrokeRenderer
  });

  class CanvasTextRenderer extends C227 {
    constructor() {
      super();
    }
    M(a) {
      let b = a.V;
      let c = a.effect;
      var d = c.Hb;
      if (d.fr()) {
        var e = d.image.data;
        var f = d.size.x;
        var g = d.size.y;
        var h = b.globalAlpha;
        b.SD((d.flags & 8) > 0);
        if ((b.od & 4) > 0) {
          e = b.Lz(e, 0, 0, f, g);
        }
        if ((b.od & 1) > 0 && b.Zg == 0) {
          e = b.Kz(e, 0, 0, f, g);
          h = 1;
        }
        b.La(h);
        b.rp(0);
        b.xk(a.va.Fa);
        g = c.Og.Te;
        a = c.Hb.hc.Bl;
        d = g.N;
        f = 0;
        g = (g.ba / 5 | 0) * 5;
        h = c.size;
        var m = h.x;
        var n = h.y;
        h = c.Sj;
        var q = m - h;
        var p = n - h;
        var v = null;
        if (c.clip) {
          v = b.bb;
          v.save();
          v.rect(h, h, m - h * 2, n - h * 2);
          v.clip();
        }
        for (m = c.multiline; f < g;) {
          var u = d[f++];
          n = d[f++];
          let A = d[f++];
          let D = d[f++];
          let B = f++;
          u = a[u].Od;
          if (m) {
            if (A > p) {
              break;
            }
          } else if (n > q) {
            break;
          }
          if (n + D > h) {
            b.drawImage(e, u.x, u.y, u.w, u.J, n, A, D, d[B]);
          }
        }
        if (c.clip) {
          v.restore();
        }
      }
    }
    Bc() {
      return 505;
    }
    kh() {
      return 401;
    }
  }
  CanvasTextRenderer.i = true;
  CanvasTextRenderer.s = C227;
  Object.assign(CanvasTextRenderer.prototype, {
    l: CanvasTextRenderer
  });
  class CanvasPathRenderer extends C227 {
    constructor() {
      super();
      this.HR = new Vec4(0, 0, 0, 0);
      this.zS = false;
    }
    M(a) {
      var b = a.effect;
      let c = a.V;
      let d = (c.od & 1) > 0 && c.Zg == 0 ? 1 : 0;
      let e = (c.od & 4) > 0 ? c.ai : null;
      let f = b.AQ;
      let g = false;
      let h = false;
      let m = false;
      let n = 0;
      let q = b.Ju;
      let p = b.data;
      let v = 0;
      let u = 0;
      let A;
      b = b.Ku;
      if (b != 0) {
        var D = c.bb;
        if (this.zS) {
          c.resetTransform();
        } else {
          a = c.oi(a.va.Fa);
          D.setTransform(a.m11, a.m21, a.m12, a.m22, a.m14, a.m24);
        }
        a = false;
        for (var B = new Path2D(); v < b;) {
          switch (q[v++]) {
            case 1:
              var K = p[u++];
              A = p[u++];
              B.moveTo(K, A);
              break;
            case 2:
              K = p[u++];
              A = p[u++];
              B.lineTo(K, A);
              break;
            case 3:
              u++;
              u++;
              B.closePath();
              break;
            case 4:
              c.fE(this.TA(p[u++], Math.min(p[u++] + d, 1), e));
              n = p[u++] | 0;
              D.lineWidth = n;
              m = h == 0;
              g = true;
              break;
            case 5:
              c.Vi(this.TA(p[u++], Math.min(p[u++] + d, 1), e));
              m = g;
              h = true;
              break;
            case 6:
              g = false;
              c.fE(vLS000000);
              D.lineWidth = 1;
              break;
            case 7:
              h = false;
              c.Vi(vLS000000);
              break;
            case 8:
              K = g && f && (n & 1) == 1;
              if (a) {
                if (!K) {
                  D.translate(-0.5, -0.5);
                  a = false;
                }
              } else if (K) {
                D.translate(0.5, 0.5);
                a = true;
              }
              if (g && h) {
                if (m) {
                  D.stroke(B);
                  D.fill(B);
                } else {
                  D.fill(B);
                  D.stroke(B);
                }
              } else if (g) {
                D.stroke(B);
              } else if (h) {
                D.fill(B);
              }
              if (v < b - 1) {
                B = new Path2D();
              }
              break;
            default:
              u = 0;
          }
        }
      }
    }
    Bc() {
      return 1005;
    }
    TA(a, b, c) {
      if (c != null) {
        var d = this.HR;
        d.x = (a >> 16 & 255) / 255;
        d.y = (a >> 8 & 255) / 255;
        d.z = (a & 255) / 255;
        d.w = b;
        a = c.$b;
        c = c.offset;
        let e = d;
        d = e.x * a.x + c.x;
        b = e.y * a.y + c.y;
        let f = e.z * a.z + c.z;
        a = e.w * a.w + c.w;
        d = new Vec4(d < 0 ? 0 : d > 1 ? 1 : d, b < 0 ? 0 : b > 1 ? 1 : b, f < 0 ? 0 : f > 1 ? 1 : f, a < 0 ? 0 : a > 1 ? 1 : a);
        return "rgba(" + ((d.x * 255 | 0) & 255) + "," + ((d.y * 255 | 0) & 255) + "," + ((d.z * 255 | 0) & 255) + "," + d.w.toFixed(2) + ")";
      }
      a |= (b * 255 | 0) << 24;
      c = HexLookup.Dy;
      return "#" + c[a >> 16 & 255] + c[a >> 8 & 255] + c[a & 255] + c[a >>> 24];
    }
  }
  CanvasPathRenderer.i = true;
  CanvasPathRenderer.s = C227;
  Object.assign(CanvasPathRenderer.prototype, {
    l: CanvasPathRenderer
  });

  class HexLookup {}
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
  class DrawEffect {
    constructor() {
      this.type = this.typeId();
      this.enabled = true;
      this.va = null;
      this.cb = 0;
    }
    free() {
      this.va = null;
    }
    update() {}
    Dh(a) {
      this.va = a;
    }
    typeId() {
      return 105;
    }
  }
  DrawEffect.i = true;
  DrawEffect.Ib = [C180];
  Object.assign(DrawEffect.prototype, {
    l: DrawEffect
  });
  class RingDrawEffect extends DrawEffect {
    constructor() {
      super();
      this.Z = 0;
      this.color = new Vec4(1, 1, 1, 1);
      this.lineWidth = 6;
      this.Gr = 1;
    }
    typeId() {
      return 905;
    }
  }
  RingDrawEffect.i = true;
  RingDrawEffect.s = DrawEffect;
  Object.assign(RingDrawEffect.prototype, {
    l: RingDrawEffect
  });
  class TextureDrawEffect extends DrawEffect {
    constructor(a, b) {
      super();
      this.Hb = null;
      this.Ep = new TexRect(0, 0, 0, 0);
      this.frame = null;
      this.hp = this.Am = 1;
      this.Td = this.K = this.offsetY = this.offsetX = 0;
      this.Uf(a, b);
    }
    XR(a) {
      this.offsetX = 0;
      this.offsetY = a;
      this.K = a == 0 ? this.K & -3 : this.K | 2;
    }
    Uf(a, b) {
      this.Hb = a;
      if (b != null) {
        this.Zw(b);
      } else {
        b = this.Ep;
        let c = a.size.x;
        let d = a.size.y;
        b.x = 0;
        b.y = 0;
        b.w = c;
        b.J = d;
        this.frame = null;
      }
      this.cb = a.id;
    }
    Zw(a) {
      a = this.Hb.hc.yf(a);
      if (this.frame == null || a.id != this.frame.id) {
        this.frame = a;
        a = this.Ep;
        let b = this.frame.Od;
        a.x = b.x;
        a.y = b.y;
        a.w = b.w;
        a.J = b.J;
      }
      return this.frame;
    }
    qp(a) {
      if (this.frame == null || this.frame.id != a) {
        this.frame = this.Hb.hc.EN(a);
        a = this.Ep;
        let b = this.frame.Od;
        a.x = b.x;
        a.y = b.y;
        a.w = b.w;
        a.J = b.J;
      }
    }
    update() {
      if (this.Hb.Td > this.Td) {
        this.Td = this.Hb.Td;
        if (this.frame == null) {
          this.Uf(this.Hb);
        } else {
          let a = this.frame;
          this.frame = null;
          this.qp(a.id);
        }
        if (this.va.Xo != null) {
          this.va.Xo();
        }
      }
    }
    free() {
      super.free();
      this.Hb = null;
    }
    typeId() {
      return 205;
    }
  }
  TextureDrawEffect.i = true;
  TextureDrawEffect.s = DrawEffect;
  Object.assign(TextureDrawEffect.prototype, {
    l: TextureDrawEffect
  });
  class MeshDrawEffect extends DrawEffect {
    constructor(a) {
      super();
      this.Hb = a;
      this.js = null;
    }
    free() {
      super.free();
      this.Hb = null;
    }
    typeId() {
      return 405;
    }
  }
  MeshDrawEffect.i = true;
  MeshDrawEffect.s = DrawEffect;
  Object.assign(MeshDrawEffect.prototype, {
    l: MeshDrawEffect
  });
  class ParallaxDrawEffect extends DrawEffect {
    constructor(a, b) {
      super();
      this.Yr = new Vec4(1, 1, 0, 1);
      this.vk = new Vec4(0, 0, 0, 1);
      a.zi(function () {});
      this.Jr = new Size(a.Tb * b, a.Yc * b);
    }
    free() {
      super.free();
    }
    Dh(a) {
      super.Dh(a);
      a.Lb(this.Jr.x, this.Jr.y);
      a.Sc();
    }
    update(a) {
      var b = a.Ab;
      var c = b.position.y;
      b = b.position.x - a.rf.Fa.translate.x;
      var d = c - a.rf.Fa.translate.y;
      c = this.vk;
      c.x = b * (1 - this.Yr.x);
      c.y = d * (1 - this.Yr.y);
      b = a.rf;
      b.Lb(this.Jr.x, this.Jr.y);
      d = (1 - this.Yr.x) * c.x * 2;
      a = (1 - this.Yr.y) * c.y * 2;
      b.ea.C.x = d;
      b.ea.C.y = a;
      c = b.ea.gb;
      let e = c.B - c.A;
      c.A = d;
      c.B = d + e;
      c = b.ea.gb;
      b = c.G - c.D;
      c.D = a;
      c.G = a + b;
    }
    typeId() {
      return 1605;
    }
  }
  ParallaxDrawEffect.i = true;
  ParallaxDrawEffect.s = DrawEffect;
  Object.assign(ParallaxDrawEffect.prototype, {
    l: ParallaxDrawEffect
  });
  class SolidColorEffect extends DrawEffect {
    constructor(a) {
      if (a == null) {
        a = 1;
      }
      super();
      this.flags = a;
      this.color = new Vec4(0, 0, 0, 1);
    }
    typeId() {
      return 1405;
    }
  }
  SolidColorEffect.i = true;
  SolidColorEffect.s = DrawEffect;
  Object.assign(SolidColorEffect.prototype, {
    l: SolidColorEffect
  });
  class ShapePath extends DrawEffect {
    constructor() {
      super();
      this.precision = 0.2;
      this.AQ = false;
      new Bounds(0, 0, 1024, 1024);
      this.sM = false;
      this.Ku = 0;
      this.qM = 256;
      this.Ju = Array(this.qM);
      this.EM = 1024;
      this.data = Array(this.EM);
      this.lineWidth = this.Gr = 1;
      this.fillColor = 0;
      this.cursor = new Vec4(0, 0, 0, 1);
      this.Fd = [];
      this.to = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
      this.clear();
    }
    free() {
      this.Fd = this.Ju = this.data = null;
      super.free();
    }
    Dh(a) {
      super.Dh(a);
      if (this.sM) {
        this.tM();
      }
    }
    clear() {
      this.Ku = 0;
      let a = this.to;
      a.A = a.D = vInfinity;
      a.B = a.G = vNegInfinity;
    }
    tM() {
      let a = vInfinity;
      let b = vNegInfinity;
      let c = vInfinity;
      let d = vNegInfinity;
      let e = this.to;
      let f = this.data;
      let g = this.Ju;
      let h = 0;
      let m = 0;
      let n = this.Ku;
      while (h < n) {
        var q = g[h++];
        switch (q) {
          case 1:
          case 2:
          case 3:
            q = f[m];
            let p = f[m + 1];
            if (q < a) {
              a = q;
            }
            if (q > b) {
              b = q;
            }
            if (p < c) {
              c = p;
            }
            if (p > d) {
              d = p;
            }
            m += 2;
            break;
          case 4:
            m += 3;
            break;
          case 5:
            m += 2;
            break;
          case 6:
          case 7:
          case 8:
            break;
          default:
            e.A = a;
            e.D = c;
            e.B = b;
            e.G = d;
            m = this.Gz(q, m, f);
            a = e.A;
            c = e.D;
            b = e.B;
            d = e.G;
        }
      }
      e.A = a;
      e.D = c;
      e.B = b;
      e.G = d;
      if (this.va != null) {
        this.Sc();
      }
    }
    Gz() {
      return 0;
    }
    Sc() {
      let a = this.to;
      var b = this.va.ea;
      b.C.x = (a.A + a.B) / 2;
      b.C.y = (a.D + a.G) / 2;
      let c = (a.B - a.A) / 2;
      let d = (a.G - a.D) / 2;
      b.Z = Math.sqrt(c * c + d * d);
      if (b.type == 302) {
        b = b.gb;
        b.A = a.A;
        b.D = a.D;
        b.B = a.B;
        b.G = a.G;
      }
      this.va.Sc();
    }
    typeId() {
      return 1005;
    }
  }
  ShapePath.i = true;
  ShapePath.s = DrawEffect;
  Object.assign(ShapePath.prototype, {
    l: ShapePath
  });

  class GradientEffect extends ShapePath {
    constructor() {
      super();
      let a = [];
      let b = 0;
      while (b < 4) {
        ++b;
        a.push(new Vec4(0, 0, 0, 1));
      }
      this.MD = [];
    }
    typeId() {
      return 1505;
    }
  }
  GradientEffect.i = true;
  GradientEffect.s = ShapePath;
  Object.assign(GradientEffect.prototype, {
    l: GradientEffect
  });

  class TextDrawEffect extends DrawEffect {
    constructor(a) {
      super();
      this.Hb = a;
      this.NE = a.$e;
      this.charset = a.hc.Np;
      this.text = null;
      this.clip = false;
      this.fontSize = this.charset.ss;
      this.mC = 4;
      this.JP = 512;
      this.size = new Vec4(100, 100, 0, 1);
      this.Tv = true;
      this.$B = false;
      this.qR = 32;
      this.ZE = this.ZB = 0;
      this.Sj = 2;
      this.bl = this.Wg = null;
      this.mA = 0;
      this.Ze = true;
      this.overflow = false;
      this.Og = new TextLayout();
      this.multiline = false;
      this.Td = 0;
    }
    Dh(a) {
      super.Dh(a);
      a.Lb(this.size.x, this.size.y);
    }
    setText(a) {
      if (this.text != a) {
        this.text = a;
        if (this.multiline) {
          this.Wz();
        }
        this.Ze = true;
      }
    }
    $q() {
      return this.fontSize;
    }
    kp() {
      this.fontSize = this.charset.ss;
    }
    setFontSize(a) {
      var b;
      if (b != null) {
        if (b < 4) {
          b = 4;
        }
        this.mC = b;
      }
      b = this.mC;
      let c = this.JP;
      a = a < b ? b : a > c ? c : a;
      if (a != this.fontSize) {
        this.fontSize = a;
        this.Ze = true;
      }
    }
    ZN() {
      let a = this.size;
      return new Vec4(a.x, a.y, 0, 1);
    }
    setBoxSize(a, b) {
      if (this.size.x != a || this.size.y != b) {
        this.size.x = a;
        this.size.y = b;
        this.va.Lb(this.size.x, this.size.y);
        this.Ze = true;
      }
    }
    uv() {
      return this.Og.nw;
    }
    Is(a) {
      this.ZB = a;
      this.Ze = true;
    }
    kx(a) {
      this.ZE = a;
      this.Ze = true;
    }
    setAlign(a, b) {
      this.Wg = a;
      this.bl = b;
      this.Ze = true;
    }
    nN(a) {
      if (a == null) {
        a = true;
      }
      if (this.text != null) {
        var b = this.Sj * 2;
        var c = this.size.x - b;
        var d = this.size.y - b;
        this.kp();
        b = d / this.charset.vj;
        this.Og.shape(this, true);
        var e = this.Og.gb;
        c = Math.min(c / (e.B - e.A), d / (e.G - e.D));
        if (a) {
          c = Math.min(b, c);
        }
        this.fontSize *= c;
        this.shape();
      }
    }
    Tf(a) {
      if ((this.multiline = a) && this.qq == null) {
        this.UR(new TokenParser());
      }
    }
    UR(a) {
      this.qq = a;
      if (this.text != null) {
        this.Wz();
      }
      this.Ze = true;
    }
    shape() {
      this.Og.shape(this, false);
      let a = this.Og.gb;
      this.overflow = a.B - a.A > this.size.x - this.Sj * 2;
      this.Ze = false;
    }
    update() {
      if (this.Hb.Td > this.Td) {
        this.Td = this.Hb.Td;
        this.charset = this.Hb.hc.Np;
        let a = this.Hb.$e;
        this.fontSize *= this.NE / a;
        this.NE = a;
        if (this.va.Xo != null) {
          this.va.Xo();
        }
        this.Ze = true;
      }
      if (this.Ze) {
        this.Ze = false;
        this.shape();
      }
    }
    free() {
      super.free();
      this.Hb = null;
      this.Og.free();
      this.Og = null;
    }
    Wz() {
      this.qq.mS(this.text);
      this.Dx = [];
      let a = 0;
      let b = this.qq.vC();
      while (b != null) {
        this.Dx.push(new TextRun(this.text.substring(a, b.position), b.required));
        a = b.position;
        b = this.qq.vC();
      }
    }
    typeId() {
      return 505;
    }
  }
  TextDrawEffect.i = true;
  TextDrawEffect.s = DrawEffect;
  Object.assign(TextDrawEffect.prototype, {
    l: TextDrawEffect
  });
  class GradientLineEffect extends DrawEffect {
    constructor() {
      super();
      this.points = [];
      this.Zh = [];
      this.vn = [];
      this.Z = 10;
    }
    free() {
      super.free();
      this.vn = this.Zh = this.points = null;
    }
    OR() {
      this.points = [];
      this.Zh = [];
      this.vn = [];
    }
    typeId() {
      return 705;
    }
  }
  GradientLineEffect.i = true;
  GradientLineEffect.s = DrawEffect;
  Object.assign(GradientLineEffect.prototype, {
    l: GradientLineEffect
  });
  class ClearEffect extends DrawEffect {
    constructor(a) {
      super();
      this.color = a;
      this.js = null;
    }
    typeId() {
      return 305;
    }
  }
  ClearEffect.i = true;
  ClearEffect.s = DrawEffect;
  Object.assign(ClearEffect.prototype, {
    l: ClearEffect
  });
  class MultiLineEffect extends DrawEffect {
    constructor(a) {
      super();
      this.Fj = a;
      this.lt = [];
    }
    update(a) {
      super.update(a);
      this.lt = [];
      for (a = 0; a < 5;) {
        var b = this.Fj[a++];
        var c = b.length;
        if (c == 0) {
          continue;
        }
        let q = 1;
        var d = undefined;
        var e = [];
        var f = 0;
        for (var g = 0; g < c;) {
          var h = g++;
          d = b[h];
          if (h == 0) {
            e[f++] = d.start;
          }
          e[f++] = d.end;
        }
        b = c * 2;
        c = [];
        f = 1 / b;
        for (g = 0;;) {
          if (g > 1) {
            g = 1;
          }
          d = Vec2.eM(e, g);
          c.push(d);
          if (g == 1) {
            break;
          }
          g += f;
        }
        e = MultiLineEffect.WF / b;
        d = [];
        f = 0;
        for (g = b - 1; f < g;) {
          var m = q;
          h = f == b - 1 ? 1 : q + e;
          let p = c[f];
          let v = c[f + 1];
          var n = Vec2.Ia(v, p);
          n.normalize();
          let u = Vec2.AL(n);
          n = Vec2.au(n);
          let A = Vec2.tb(p, Vec2.Ob(n, m));
          d.push(Vec2.tb(p, Vec2.Ob(u, m)));
          d.push(A);
          m = Vec2.tb(v, Vec2.Ob(n, h));
          d.push(Vec2.tb(v, Vec2.Ob(u, h)));
          d.push(m);
          q += e;
          ++f;
        }
        this.lt.push(d);
      }
    }
    typeId() {
      return 1105;
    }
  }
  MultiLineEffect.i = true;
  MultiLineEffect.s = DrawEffect;
  Object.assign(MultiLineEffect.prototype, {
    l: MultiLineEffect
  });
  class DashedCircleEffect extends DrawEffect {
    constructor() {
      super();
      this.C = new Vec4(0, 0, 0, 1);
      this.Z = 0;
      this.color = new Vec4(0, 0, 0, 0);
      this.Uo = 0;
      this.lineWidth = 1.5;
      this.update(null);
    }
    update() {
      this.Uo = Math.max(16, Math.round(this.Z / 0.8));
      if (this.Uo % 2 != 0) {
        this.Uo++;
      }
    }
    typeId() {
      return 605;
    }
  }
  DashedCircleEffect.i = true;
  DashedCircleEffect.s = DrawEffect;
  Object.assign(DashedCircleEffect.prototype, {
    l: DashedCircleEffect
  });

  class TextGridEffect extends DrawEffect {
    constructor(a, b, c) {
      super();
      this.Hb = a;
      this.charset = a.hc.Np;
      a = [9633, 65533, 63];
      let d = 0;
      while (d < 3) {
        let e = d++;
        if (this.charset.nA[a[e]] != null) {
          break;
        }
      }
      this.grid = null;
      this.fillColor = -1;
      this.gw = this.fw = 0;
      this.Lb(b, c, false);
    }
    Lb(a, b, c) {
      if (c) {
        a = a / this.charset.HA | 0;
        b = b / this.charset.lineHeight | 0;
        this.Lb(a, b, false);
      } else {
        if (this.fw > 0 && a > this.fw) {
          a = this.fw;
        }
        if (this.gw > 0 && b > this.gw) {
          b = this.gw;
        }
        if (this.grid == null || a != this.grid.Tb || b != this.grid.Yc) {
          if (this.grid == null) {
            this.grid = new Grid2D(a, b);
          } else {
            this.grid.resize(a, b);
          }
          this.grid.forEach(function (d, e, f) {
            if (d == null) {
              return new GridCell(e, f);
            } else {
              return d;
            }
          });
          if (this.va != null) {
            this.Sc();
          }
        }
      }
    }
    Dh(a) {
      super.Dh(a);
      this.Sc();
    }
    Sc() {
      this.va.Lb(this.charset.HA * this.grid.Tb, this.charset.lineHeight * this.grid.Yc);
      this.va.Sc();
    }
    typeId() {
      return 1805;
    }
  }
  TextGridEffect.i = true;
  TextGridEffect.s = DrawEffect;
  Object.assign(TextGridEffect.prototype, {
    l: TextGridEffect
  });
  class ColorRectEffect extends DrawEffect {
    constructor(a) {
      super();
      this.color = Vec4Clone.clone(a);
    }
    typeId() {
      return 1205;
    }
  }
  ColorRectEffect.i = true;
  ColorRectEffect.s = DrawEffect;
  Object.assign(ColorRectEffect.prototype, {
    l: ColorRectEffect
  });
  class SpriteShapeEffect extends DrawEffect {
    constructor(a, b) {
      super();
      this.Hb = a;
      this.shape = b;
      this.ac = [];
    }
    typeId() {
      return 1705;
    }
  }
  SpriteShapeEffect.i = true;
  SpriteShapeEffect.s = DrawEffect;
  Object.assign(SpriteShapeEffect.prototype, {
    l: SpriteShapeEffect
  });
  class ShapePathBounds extends ShapePath {
    constructor() {
      super();
    }
    Gz(a, b, c) {
      var d = this.to;
      let e = d.A;
      let f = d.D;
      let g = d.B;
      d = d.G;
      switch (a) {
        case 10:
          var h = c[b];
          a = c[b + 1];
          var m = c[b + 2];
          c = c[b + 3];
          if (h < e) {
            e = h;
          }
          if (h > g) {
            g = h;
          }
          if (a < f) {
            f = a;
          }
          if (a > d) {
            d = a;
          }
          h += m;
          c = a + c;
          if (h < e) {
            e = h;
          }
          if (h > g) {
            g = h;
          }
          if (c < f) {
            f = c;
          }
          if (c > d) {
            d = c;
          }
          b += 4;
          break;
        case 11:
          h = c[b];
          a = c[b + 1];
          m = c[b + 2];
          c = c[b + 3];
          if (h < e) {
            e = h;
          }
          if (h > g) {
            g = h;
          }
          if (a < f) {
            f = a;
          }
          if (a > d) {
            d = a;
          }
          h += m;
          c = a + c;
          if (h < e) {
            e = h;
          }
          if (h > g) {
            g = h;
          }
          if (c < f) {
            f = c;
          }
          if (c > d) {
            d = c;
          }
          b += 5;
          break;
        case 12:
          a = c[b];
          h = c[b + 1];
          if (a < e) {
            e = a;
          }
          if (a > g) {
            g = a;
          }
          if (h < f) {
            f = h;
          }
          if (h > d) {
            d = h;
          }
          a = c[b + 2];
          c = c[b + 3];
          if (a < e) {
            e = a;
          }
          if (a > g) {
            g = a;
          }
          if (c < f) {
            f = c;
          }
          if (c > d) {
            d = c;
          }
          b += 4;
          break;
        case 13:
          a = c[b];
          h = c[b + 1];
          if (a < e) {
            e = a;
          }
          if (a > g) {
            g = a;
          }
          if (h < f) {
            f = h;
          }
          if (h > d) {
            d = h;
          }
          a = c[b + 2];
          h = c[b + 3];
          if (a < e) {
            e = a;
          }
          if (a > g) {
            g = a;
          }
          if (h < f) {
            f = h;
          }
          if (h > d) {
            d = h;
          }
          a = c[b + 4];
          c = c[b + 5];
          if (a < e) {
            e = a;
          }
          if (a > g) {
            g = a;
          }
          if (c < f) {
            f = c;
          }
          if (c > d) {
            d = c;
          }
          b += 6;
          break;
        case 14:
          h = c[b];
          a = c[b + 1];
          c = c[b + 2];
          m = h - c;
          var n = a - c;
          if (m < e) {
            e = m;
          }
          if (m > g) {
            g = m;
          }
          if (n < f) {
            f = n;
          }
          if (n > d) {
            d = n;
          }
          h += c;
          c = a + c;
          if (h < e) {
            e = h;
          }
          if (h > g) {
            g = h;
          }
          if (c < f) {
            f = c;
          }
          if (c > d) {
            d = c;
          }
          b += 5;
          break;
        case 15:
          h = c[b];
          a = c[b + 1];
          c = Math.max(c[b + 2], c[b + 3]);
          m = h - c;
          n = a - c;
          if (m < e) {
            e = m;
          }
          if (m > g) {
            g = m;
          }
          if (n < f) {
            f = n;
          }
          if (n > d) {
            d = n;
          }
          h += c;
          c = a + c;
          if (h < e) {
            e = h;
          }
          if (h > g) {
            g = h;
          }
          if (c < f) {
            f = c;
          }
          if (c > d) {
            d = c;
          }
          b += 8;
          break;
        case 16:
          ++b;
          break;
        case 17:
          b += 1 + (c[b] | 0);
      }
      c = this.to;
      c.A = e;
      c.D = f;
      c.B = g;
      c.G = d;
      return b;
    }
    typeId() {
      return 1305;
    }
  }
  ShapePathBounds.i = true;
  ShapePathBounds.s = ShapePath;
  Object.assign(ShapePathBounds.prototype, {
    l: ShapePathBounds
  });
  class NoopEffect extends DrawEffect {
    constructor() {
      super();
    }
    typeId() {
      return 2005;
    }
  }
  NoopEffect.i = true;
  NoopEffect.s = DrawEffect;
  Object.assign(NoopEffect.prototype, {
    l: NoopEffect
  });
  class MeshDataEffect extends DrawEffect {
    constructor() {
      super();
      new MeshData(null, null, null, null);
      new MeshVertices(null, null, null, null, null);
      this.gv = new MeshGeometry(null, null, null);
    }
    typeId() {
      return 1905;
    }
  }
  MeshDataEffect.i = true;
  MeshDataEffect.s = DrawEffect;
  Object.assign(MeshDataEffect.prototype, {
    l: MeshDataEffect
  });
  class CustomShaderEffect extends DrawEffect {
    constructor(a) {
      super();
      this.Pi = a;
    }
    free() {}
    typeId() {
      return 805;
    }
  }
  CustomShaderEffect.i = true;
  CustomShaderEffect.s = DrawEffect;
  Object.assign(CustomShaderEffect.prototype, {
    l: CustomShaderEffect
  });

  class MeshGeometry {
    constructor() {
      new Vec4(0, 0, 0, 1);
      new Vec4(0, 0, -1, 1);
      new Vec4(0, 0, 0, 1);
    }
  }
  MeshGeometry.i = true;
  Object.assign(MeshGeometry.prototype, {
    l: MeshGeometry
  });
  class MeshVertices {
    constructor() {
      new Vec4(1, 0, 0, 1);
      new Vec4(HALF_PI, 0, 1, 1);
      new Vec4(1, 1, 1, 1);
      new Vec4(1, 1, 1, 1);
      new Vec4(1, 1, 1, 1);
    }
  }
  MeshVertices.i = true;
  Object.assign(MeshVertices.prototype, {
    l: MeshVertices
  });
  class MeshData {
    constructor() {
      new Vec4(0, 0, 0, 1);
      new Vec4(0, 0, 0, 1);
      new Vec4(0, 0, 0, 1);
      new Vec4(0, 0, 0, 1);
    }
  }
  MeshData.i = true;
  Object.assign(MeshData.prototype, {
    l: MeshData
  });

  class GridCell {
    constructor(a, b) {
      this.x = a;
      this.y = b;
      this.code = 0;
    }
  }
  GridCell.i = true;
  Object.assign(GridCell.prototype, {
    l: GridCell
  });
  class Camera extends TransformStack {
    constructor() {
      super();
      this.origin = new Vec4(0, 0, 0, 1);
      this.position = new Vec4(0, 0, 0, 1);
      this.rotation = 0;
      this.zoom = 1;
      this.KB = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.JB = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.Kv = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.size = new Vec4(0, 0, 0, 1);
      this.Lb(new Vec4(1000, 1000, 0, 1));
    }
    qS(a) {
      if (this.zoom != a) {
        this.zoom = a;
        this.Sr();
      }
    }
    centerPivot() {
      let a = this.origin;
      let b = this.size;
      a.x = b.x / 2;
      a.y = b.y / 2;
      this.Sr();
    }
    Lb(a) {
      let b = a.x;
      let c = a.y;
      var d = this.size;
      d.x = a.x;
      d.y = a.y;
      d = this.hD;
      d.m11 = 2 / b;
      d.m12 = 0;
      d.m13 = 0;
      d.m14 = -1;
      d.m21 = 0;
      d.m22 = 2 / c * -1;
      d.m23 = 0;
      d.m24 = 1;
      d.m31 = 0;
      d.m32 = 0;
      d.m33 = -0.001;
      d.m34 = 0;
      d.m41 = 0;
      d.m42 = 0;
      d.m43 = 0;
      d.m44 = 1;
      a = d.m14;
      d = d.m24;
      let e = this.JB;
      e.m11 = b / 2;
      e.m12 = 0;
      e.m13 = 0;
      e.m14 = -e.m11 * a + e.m12 * d;
      e.m21 = 0;
      e.m22 = -c / 2;
      e.m23 = 0;
      e.m24 = -e.m21 * a + e.m22 * d;
      e.m31 = 0;
      e.m32 = 0;
      e.m33 = -1000;
      e.m34 = 0;
      e.m41 = 0;
      e.m42 = 0;
      e.m43 = 0;
      e.m44 = 1;
      this.Sr();
    }
    Sr() {
      var a = this.Wm;
      a.m11 = 1;
      a.m12 = 0;
      a.m13 = 0;
      a.m14 = 0;
      a.m21 = 0;
      a.m22 = 1;
      a.m23 = 0;
      a.m24 = 0;
      a.m31 = 0;
      a.m32 = 0;
      a.m33 = 1;
      a.m34 = 0;
      a.m41 = 0;
      a.m42 = 0;
      a.m43 = 0;
      a.m44 = 1;
      a = this.Wm;
      var b = this.position;
      var c = b.x;
      b = b.y;
      a.m14 += -c;
      a.m24 += -b;
      var d = this.zoom;
      var e = this.zoom;
      a.m11 *= d;
      a.m12 *= d;
      a.m14 *= d;
      a.m21 *= e;
      a.m22 *= e;
      a.m24 *= e;
      e = this.rotation * DEG2RAD;
      d = Math.sin(e);
      e = Math.cos(e);
      var f = a.m11;
      var g = a.m21;
      a.m11 = e * f - d * g;
      a.m21 = d * f + e * g;
      f = a.m12;
      g = a.m22;
      a.m12 = e * f - d * g;
      a.m22 = d * f + e * g;
      f = a.m14;
      g = a.m24;
      a.m14 = e * f - d * g;
      a.m24 = d * f + e * g;
      a.m14 += c;
      a.m24 += b;
      a.m14 += this.origin.x - this.position.x;
      a.m24 += this.origin.y - this.position.y;
      c = this.Wm;
      c.m11 = a.m11;
      c.m12 = a.m12;
      c.m14 = a.m14;
      c.m21 = a.m21;
      c.m22 = a.m22;
      c.m24 = a.m24;
      this.pT();
      a = this.KB;
      var h = this.Wm;
      c = h.m11;
      b = h.m12;
      d = h.m13;
      e = h.m14;
      f = h.m21;
      g = h.m22;
      var m = h.m23;
      var n = h.m24;
      var q = h.m31;
      var p = h.m32;
      var v = h.m33;
      var u = h.m34;
      var A = h.m41;
      var D = h.m42;
      var B = h.m43;
      h = h.m44;
      var K = c * g - b * f;
      let E = c * m - d * f;
      let v78 = c * n - e * f;
      let v79 = b * m - d * g;
      let V = b * n - e * g;
      let v80 = d * n - e * m;
      let v81 = q * D - p * A;
      let v82 = q * B - v * A;
      let v83 = q * h - u * A;
      let v84 = p * B - v * D;
      let v85 = p * h - u * D;
      let v86 = v * h - u * B;
      let v87 = 1 / (K * v86 - E * v85 + v78 * v84 + v79 * v83 - V * v82 + v80 * v81);
      a.m11 = (g * v86 - m * v85 + n * v84) * v87;
      a.m12 = (-b * v86 + d * v85 - e * v84) * v87;
      a.m13 = (D * v80 - B * V + h * v79) * v87;
      a.m14 = (-p * v80 + v * V - u * v79) * v87;
      a.m21 = (-f * v86 + m * v83 - n * v82) * v87;
      a.m22 = (c * v86 - d * v83 + e * v82) * v87;
      a.m23 = (-A * v80 + B * v78 - h * E) * v87;
      a.m24 = (q * v80 - v * v78 + u * E) * v87;
      a.m31 = (f * v85 - g * v83 + n * v81) * v87;
      a.m32 = (-c * v85 + b * v83 - e * v81) * v87;
      a.m33 = (A * V - D * v78 + h * K) * v87;
      a.m34 = (-q * V + p * v78 - u * K) * v87;
      a.m41 = (-f * v84 + g * v82 - m * v81) * v87;
      a.m42 = (c * v84 - b * v82 + d * v81) * v87;
      a.m43 = (-A * v79 + D * E - B * K) * v87;
      a.m44 = (q * v79 - p * E + v * K) * v87;
      a = this.Kv;
      c = this.KB;
      b = this.JB;
      d = c.m11 * b.m12 + c.m12 * b.m22 + c.m13 * b.m32 + c.m14 * b.m42;
      e = c.m11 * b.m13 + c.m12 * b.m23 + c.m13 * b.m33 + c.m14 * b.m43;
      f = c.m11 * b.m14 + c.m12 * b.m24 + c.m13 * b.m34 + c.m14 * b.m44;
      g = c.m21 * b.m11 + c.m22 * b.m21 + c.m23 * b.m31 + c.m24 * b.m41;
      m = c.m21 * b.m12 + c.m22 * b.m22 + c.m23 * b.m32 + c.m24 * b.m42;
      n = c.m21 * b.m13 + c.m22 * b.m23 + c.m23 * b.m33 + c.m24 * b.m43;
      q = c.m21 * b.m14 + c.m22 * b.m24 + c.m23 * b.m34 + c.m24 * b.m44;
      p = c.m31 * b.m11 + c.m32 * b.m21 + c.m33 * b.m31 + c.m34 * b.m41;
      v = c.m31 * b.m12 + c.m32 * b.m22 + c.m33 * b.m32 + c.m34 * b.m42;
      u = c.m31 * b.m13 + c.m32 * b.m23 + c.m33 * b.m33 + c.m34 * b.m43;
      A = c.m31 * b.m14 + c.m32 * b.m24 + c.m33 * b.m34 + c.m34 * b.m44;
      D = c.m41 * b.m11 + c.m42 * b.m21 + c.m43 * b.m31 + c.m44 * b.m41;
      B = c.m41 * b.m12 + c.m42 * b.m22 + c.m43 * b.m32 + c.m44 * b.m42;
      h = c.m41 * b.m13 + c.m42 * b.m23 + c.m43 * b.m33 + c.m44 * b.m43;
      K = c.m41 * b.m14 + c.m42 * b.m24 + c.m43 * b.m34 + c.m44 * b.m44;
      a.m11 = c.m11 * b.m11 + c.m12 * b.m21 + c.m13 * b.m31 + c.m14 * b.m41;
      a.m12 = d;
      a.m13 = e;
      a.m14 = f;
      a.m21 = g;
      a.m22 = m;
      a.m23 = n;
      a.m24 = q;
      a.m31 = p;
      a.m32 = v;
      a.m33 = u;
      a.m34 = A;
      a.m41 = D;
      a.m42 = B;
      a.m43 = h;
      a.m44 = K;
    }
  }
  Camera.i = true;
  Camera.s = TransformStack;
  Object.assign(Camera.prototype, {
    l: Camera
  });
  class RenderQueue {
    constructor() {
      this.Ab = null;
      this.Wx = new ArrayList(1024);
      this.Wx.Dm = true;
      this.stack = new Stack();
      this.Fd = new ArrayList();
    }
    wk(a) {
      this.Ab = a;
    }
  }
  RenderQueue.i = true;
  Object.assign(RenderQueue.prototype, {
    l: RenderQueue
  });
  class RenderStateCollector {
    static kM() {
      let a = 0;
      while (a < 7) {
        RenderStateCollector.Vs[a++].Ga = 0;
      }
    }
    static bR(a) {
      if (RenderStateCollector.Vs == null) {
        RenderStateCollector.uO();
      }
      let b = RenderStateCollector.Vs;
      let c = RenderStateCollector.MD;
      var d = a;
      for (c.clear(); d.parent != null;) {
        var e = d.parent;
        if (c.Ga == c.eb) {
          c.grow();
        }
        c.N[c.Ga++] = e;
        d = d.parent;
      }
      d = 0;
      for (e = c.Ga; d < e;) {
        ++d;
        c.N[--c.Ga].dR(b);
      }
      for (a = a.Qd; a != null;) {
        d = b[a.state.type];
        e = a.state;
        if (d.Ga == d.eb) {
          d.grow();
        }
        d.N[d.Ga++] = e;
        a = a.next;
      }
      c.clear(true);
      return b;
    }
    static uO() {
      RenderStateCollector.Vs = Array(7);
      let a = 0;
      while (a < 7) {
        RenderStateCollector.Vs[a++] = new Stack();
      }
      RenderStateCollector.MD = new Stack(16);
    }
  }
  RenderStateCollector.i = true;

  class RendererInfo {
    constructor(a) {
      this.V = a;
      this.Rz = this.va = this.effect = null;
    }
  }
  RendererInfo.i = true;
  Object.assign(RendererInfo.prototype, {
    l: RendererInfo
  });
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
  class AudioSample {
    constructor(a, b, c) {
      this.id = a;
      this.data = b;
      this.ug = c;
      this.XB = -1;
    }
  }
  AudioSample.i = true;
  Object.assign(AudioSample.prototype, {
    l: AudioSample
  });
  class AudioInstance {
    constructor(a, b) {
      this.volume = 1;
      this.offset = 0;
      this.loop = false;
      this.yw = a;
      this.Le = b;
    }
    free() {
      this.yw = this.Le = null;
      this.Uj = true;
    }
    mo() {
      if (this.Uj) {
        return NaN;
      } else {
        return this.volume;
      }
    }
    Xi(a) {
      if (!this.Uj) {
        this.volume = a;
        this.sT();
      }
    }
    jo() {
      if (this.Uj) {
        return NaN;
      } else {
        return this.VN() / this.data.duration;
      }
    }
  }
  AudioInstance.i = true;
  Object.assign(AudioInstance.prototype, {
    l: AudioInstance
  });
  class WebAudioInstance extends AudioInstance {
    constructor(a, b) {
      super(a, b);
      this.data = b.data;
      this.Lr = null;
    }
    free() {
      if (!this.Uj) {
        var a = this.pf;
        a: while (a != null) {
          let b = a.output;
          switch (a.type) {
            case 0:
              if (this.Dc) {
                this.Dc = false;
                this.pf.stop(0);
              }
              break;
            case 1:
            case 2:
              break;
            default:
              break a;
          }
          Std.remove(a.output.inputs, a);
          a.n.disconnect();
          a.free();
          a = b;
        }
        this.pf = this.data = null;
        a = this.yw;
        super.free();
        a.oQ(this);
      }
    }
    play() {
      if (!this.Uj) {
        this.Dc = true;
        this.pf = new AudioBufferSourceNode();
        var a = this.yw;
        this.pf.connect(this.Le.ug ? a.cB() : a.dB());
        this.startTime = Audio.context.currentTime;
        this.pf.play(this.data, this.loop, this.offset, cachedBind(this, this.onended));
      }
    }
    xm(a, b) {
      if (!this.Uj) {
        var c = this.ZA();
        if (c != null) {
          c.xm(a, b);
        }
        this.volume = a;
        this.Lr = Audio.context.currentTime + b;
      }
    }
    stop(a) {
      if (a == null) {
        a = 0;
      }
      if (!this.Uj && !this.stopped && !!this.Dc) {
        this.stopped = true;
        this.pf.stop(Audio.context.currentTime + a);
      }
    }
    VN() {
      return (this.offset + (Audio.context.currentTime - this.startTime)) % this.data.duration;
    }
    mo() {
      if (this.Lr != null) {
        if (Audio.context.currentTime < this.Lr) {
          return this.pf.get(2).n.gain.value;
        }
        this.Lr = null;
      }
      return this.volume;
    }
    sT() {
      let a = this.ZA();
      if (a != null) {
        a.Gs(this.mo());
      }
    }
    onended() {
      if (this.Dc) {
        this.Dc = false;
        this.free();
      }
    }
    ZA() {
      if (!WebAudioInstance.MA || this.pf == null) {
        return null;
      }
      try {
        let a = this.pf.get(2);
        if (a == null) {
          a = new AudioGainNode();
          let b = this.pf.get(1);
          if (b == null) {
            this.pf.append(a);
          } else {
            b.append(a);
          }
        }
        return a;
      } catch (a) {
        WebAudioInstance.MA = false;
        return null;
      }
    }
  }
  WebAudioInstance.i = true;
  WebAudioInstance.s = AudioInstance;
  Object.assign(WebAudioInstance.prototype, {
    l: WebAudioInstance
  });

  class AudioSliceInfo {
    constructor(a, b, c, d) {
      this.name = a;
      this.id = b;
      this.min = c;
      this.max = d;
    }
  }
  AudioSliceInfo.i = true;
  Object.assign(AudioSliceInfo.prototype, {
    l: AudioSliceInfo
  });
  class SPRSheetParser {
    static tB(a) {
      a = Bytes.hk(a);
      if (a.b[0] == 83 && a.b[1] == 80) {
        return a.b[2] == 82;
      } else {
        return false;
      }
    }
    static nR(a) {
      return a.slice(5 + new BytesReader(Bytes.hk(a), 3).zd());
    }
    static vN(a) {
      if (!SPRSheetParser.tB(a)) {
        throw 22;
      }
      a = new BytesReader(Bytes.hk(a), 5);
      let b = [];
      let c = 0;
      let d = a.zd();
      while (c < d) {
        c++;
        let e = "";
        let f = 0;
        let g = a.zd();
        while (f < g) {
          f++;
          let h = a.ta();
          e += String.fromCodePoint(h);
        }
        b.push(new AudioSliceInfo(e, a.zd(), a.oD(), a.oD()));
      }
      return b;
    }
  }
  SPRSheetParser.i = true;
  class AudioMixerBase {
    constructor() {
      this.TS = 0.05;
      this.enabled = true;
      this.jC = 2;
      this.LP = 16;
      this.iC = this.Uh = 0;
      this.cw = this.bw = this.dw = 1;
      this.hC = 0;
      this.XP = 10000;
      this.dd = [];
      this.Yg = new HashMap();
      this.US = new HashMap();
      this.names = [];
    }
    free() {
      if (this.bw != 1) {
        this.Sf(1);
      }
      if (this.cw != 1) {
        this.ix(1);
      }
      if (this.dw != 1) {
        this.Lg(1);
      }
      if (this.hC != 0) {
        this.Js(0);
      }
      let a = 0;
      let b = this.dd;
      while (a < b.length) {
        b[a++].free();
      }
      this.names = this.Yg = this.dd = null;
    }
    ls() {}
    ms(a) {
      let b = 0;
      while (b < a.length) {
        let c = a[b];
        ++b;
        this.names[c.id] = c.name;
      }
    }
    play() {
      return -1;
    }
    stop(a, b) {
      if (b == null) {
        b = 0;
      }
      if (a < 0) {
        return false;
      }
      if (a < 10000) {
        var c = false;
        let d = 0;
        let e = this.dd;
        let f = [];
        let g = 0;
        while (g < e.length) {
          let h = e[g];
          ++g;
          if (h.Le.id == a) {
            f.push(h);
          }
        }
        while (d < f.length) {
          c = true;
          f[d++].stop(b);
        }
        return c;
      }
      c = Lambda.find(this.dd, function (d) {
        return d.id == a;
      });
      if (c != null) {
        c.stop(b);
        return true;
      } else {
        return false;
      }
    }
    Dc(a) {
      if (a < 0) {
        return false;
      } else if (a < 10000) {
        return Lambda.Ej(this.dd, function (b) {
          return b.Le.id == a;
        });
      } else {
        return Lambda.Ej(this.dd, function (b) {
          return b.id == a;
        });
      }
    }
    rg(a) {
      let b = Lambda.find(this.dd, function (c) {
        return c.Le.id == a;
      });
      if (b != null) {
        return b.id;
      } else {
        return -1;
      }
    }
    YN(a) {
      if (a < 10000) {
        return Lambda.find(this.dd, function (b) {
          return b.Le.id == a;
        });
      } else {
        return Lambda.find(this.dd, function (b) {
          return b.id == a;
        });
      }
    }
    QO(a) {
      return this.Yg.J[a] != null;
    }
    kS(a, b) {
      if (a == null) {
        Lambda.zi(this.dd, function (c) {
          if (!c.Le.ug) {
            c.Xi(b);
          }
        });
      } else {
        Lambda.zi(this.dd, function (c) {
          if (!c.Le.ug && (a < 10000 ? c.Le.id : c.id) == a) {
            c.Xi(b);
          }
        });
      }
    }
    Lg(a) {
      this.dw = a < 0 ? 0 : a > 1 ? 1 : a;
      this.ot();
      this.qt();
    }
    ix(a) {
      this.cw = a < 0 ? 0 : a > 1 ? 1 : a;
      this.qt();
    }
    Sf(a) {
      this.bw = a < 0 ? 0 : a > 1 ? 1 : a;
      this.ot();
    }
    Js(a) {
      this.hC = a < -1 ? -1 : a > 1 ? 1 : a;
    }
    Zn(a, b, c) {
      if (c == null) {
        c = true;
      }
      this.xm(a, 0, b);
      if (c) {
        this.stop(a, b);
      }
    }
    xm(a, b, c) {
      var d;
      if (d == null) {
        d = -1;
      }
      let e = this.YN(a);
      if (e != null && this.Dc(a)) {
        if (d != -1) {
          e.Xi(d);
        }
        a = e.mo() - b;
        if (!(a > 0 ? a < 0.01 : -a < 0.01)) {
          e.xm(b, c);
        }
      }
    }
    tR(a, b, c) {
      if (!this.enabled || !this.QO(a)) {
        return -1;
      }
      if (b && this.Dc(a)) {
        return this.rg(a);
      }
      if (b) {
        c = true;
      }
      if (!c && this.Fx(a)) {
        return -1;
      }
      a = this.ON(this.Yg.J[a].ug, c);
      if (a < 0) {
        return -1;
      } else {
        return a;
      }
    }
    pQ(a) {
      this.dd.push(a);
      if (this.dd.length > this.iC) {
        this.iC = this.dd.length;
      }
    }
    oQ(a) {
      this.Uh &= ~(1 << a.channel);
      Std.remove(this.dd, a);
      if (a.Hi != null) {
        a.Hi();
        a.Hi = null;
      }
    }
    Fx(a) {
      let b = this.Yg.J[a];
      if (b.ug) {
        return false;
      }
      let c = Std.now() / 1000;
      a = this.US.J[a];
      if (a == null) {
        a = this.TS;
      }
      if (c - b.XB < a) {
        return true;
      }
      b.XB = c;
      return false;
    }
    ON(a, b) {
      if (a) {
        for (b = 0; b < this.jC;) {
          if ((this.Uh & 1 << b) == 0) {
            this.Uh |= 1 << b;
            return b;
          }
          ++b;
        }
        return -1;
      }
      a = -1;
      for (var c = this.jC, d = c + this.LP; c < d;) {
        if ((this.Uh & 1 << c) == 0) {
          this.Uh |= 1 << c;
          a = c;
          break;
        }
        ++c;
      }
      if (b && a < 0) {
        b = null;
        c = a = 0;
        for (d = this.dd; c < d.length;) {
          let e = d[c];
          ++c;
          if (!e.Le.ug && !e.loop && e.jo() > a) {
            a = e.jo();
            b = e;
          }
        }
        if (b == null) {
          return -1;
        }
        a = b.channel;
        b.stop();
      }
      return a;
    }
    ot() {
      Lambda.zi(this.dd, function (a) {
        if (a.Le.ug) {
          a.Xi(a.mo());
        }
      });
    }
    qt() {
      Lambda.zi(this.dd, function (a) {
        if (!a.Le.ug) {
          a.Xi(a.mo());
        }
      });
    }
  }
  AudioMixerBase.i = true;
  Object.assign(AudioMixerBase.prototype, {
    l: AudioMixerBase
  });
  class NullAudioMixer extends AudioMixerBase {
    constructor() {
      super();
    }
    ls() {}
    ms() {}
    play() {
      return -1;
    }
    Lg() {}
    Sf() {}
    ix() {}
    Js() {}
    ot() {}
    qt() {}
  }
  NullAudioMixer.i = true;
  NullAudioMixer.s = AudioMixerBase;
  Object.assign(NullAudioMixer.prototype, {
    l: NullAudioMixer
  });
  class WebAudioMixer extends AudioMixerBase {
    constructor() {
      super();
    }
    free() {
      super.free();
      this.Mo = this.Lo = this.No = this.Ko = null;
    }
    ls(a, b, c, d, e) {
      if (c == null) {
        c = false;
      }
      super.ls(a, b, c, d, e);
      let f = this;
      this.decode(b, function (g) {
        if (g == null) {
          d(null);
        } else {
          f.Yg.J[a] = new AudioSample(a, g, c);
          d(g);
        }
      });
    }
    ms(a, b, c) {
      super.ms(a, b, c);
      let d = this;
      this.decode(b, function (e) {
        if (e == null) {
          c(null);
        } else {
          try {
            let f = d.split(e, a);
            let g = 0;
            let h = a.length;
            while (g < h) {
              let m = g++;
              let n = a[m].id;
              d.names[n] = a[m].name;
              d.Yg.J[n] = new AudioSample(n, f[m], false);
            }
            c(e);
          } catch (f) {}
        }
      });
    }
    play(a, b, c, d) {
      if (d == null) {
        d = 0;
      }
      if (c == null) {
        c = false;
      }
      if (b == null) {
        b = false;
      }
      if (Audio.context == null || !Audio.no()) {
        return -1;
      }
      c = this.tR(a, b, c);
      if (c < 0) {
        return -1;
      }
      a = new WebAudioInstance(this, this.Yg.J[a]);
      a.id = this.XP++;
      a.channel = c;
      a.loop = b;
      a.offset = d;
      a.play();
      this.pQ(a);
      return a.id;
    }
    Lg(a, b) {
      if (b == null) {
        b = 0;
      }
      if (Audio.context != null) {
        this.dw = a < 0 ? 0 : a > 1 ? 1 : a;
        var c = this.ar();
        if (b > 0) {
          c.xm(a, b);
        } else {
          c.Gs(a);
        }
      }
    }
    Sf(a) {
      if (Audio.context != null) {
        this.bw = a < 0 ? 0 : a > 1 ? 1 : a;
        this.cB().Gs(a);
      }
    }
    ix(a) {
      if (Audio.context != null) {
        this.cw = a < 0 ? 0 : a > 1 ? 1 : a;
        this.dB().Gs(a);
      }
    }
    Js(a) {
      if (Audio.context != null) {
        super.Js(a);
        this.JN().pS(a);
      }
    }
    ot() {}
    qt() {}
    decode(a, b) {
      new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(2, 13230000, 44100).decodeAudioData(a, function (c) {
        b(c);
      }, function () {
        b(null);
      });
    }
    ar() {
      if (this.Ko == null) {
        this.Ko = new AudioGainNode();
        this.Ko.type = 5;
        this.Ko.connect(new AudioDestinationNode());
      }
      return this.Ko;
    }
    dB() {
      if (this.No == null) {
        this.No = new AudioGainNode();
        this.No.type = 3;
        this.No.connect(this.ar());
      }
      return this.No;
    }
    cB() {
      if (this.Lo == null) {
        this.Lo = new AudioGainNode();
        this.Lo.type = 4;
        this.Lo.connect(this.ar());
      }
      return this.Lo;
    }
    JN() {
      if (this.Mo == null) {
        this.Mo = new AudioPannerNode();
        this.Mo.type = 6;
        this.ar().append(this.Mo);
      }
      return this.Mo;
    }
    zM(a) {
      let b = window.OfflineAudioContext;
      if (b == null) {
        b = window.webkitOfflineAudioContext;
      }
      return new b(2, a * 44100, 44100);
    }
    split(a, b) {
      let c = this.zM(Math.ceil(b[b.length - 1].max * 2 / 1000));
      let d = a.sampleRate;
      let e = [];
      let f = 0;
      let g = b.length;
      if (a.numberOfChannels == 1) {
        var h = a.getChannelData(0);
        for (; f < g;) {
          var m = b[f++];
          a = d / 1000 * m.min | 0;
          var n = d / 1000 * m.max | 0;
          m = c.createBuffer(1, n - a, d);
          a = h.subarray(a, n);
          try {
            m.copyToChannel(a, 0);
          } catch (q) {
            m.getChannelData(0).set(a);
          }
          e.push(m);
        }
      } else {
        h = a.getChannelData(0);
        a = a.getChannelData(1);
        while (f < g) {
          n = b[f++];
          m = d / 1000 * n.min | 0;
          let q = d / 1000 * n.max | 0;
          n = c.createBuffer(2, q - m, d);
          let p = h.subarray(m, q);
          m = a.subarray(m, q);
          try {
            n.copyToChannel(p, 0);
            n.copyToChannel(m, 1);
          } catch (v) {
            n.getChannelData(0).set(p);
            n.getChannelData(1).set(m);
          }
          e.push(n);
        }
      }
      return e;
    }
  }
  WebAudioMixer.i = true;
  WebAudioMixer.s = AudioMixerBase;
  Object.assign(WebAudioMixer.prototype, {
    l: WebAudioMixer
  });
  class Audio {
    static no() {
      if (Audio.context != null) {
        return Audio.context.state == "running";
      } else {
        return false;
      }
    }
    static addListener(a, b) {
      return Audio.events.addListener(a, b);
    }
    static once(a, b) {
      Audio.events.once(a, b);
    }
    static ib() {
      if (Audio.context != null) {
        Audio.lM();
        var a = Audio.df;
        if (a != null) {
          a.stop();
        }
      }
      a = new EReg("(iPad|iPhone)", "g").match(host.navigator.platform);
      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        a = true;
      }
      if (a) {
        Audio.currentTime = null;
        Audio.df = new DelayedCall(1000);
        Audio.df.Hg = function () {
          if (Audio.context != null && Audio.no()) {
            if (Audio.currentTime != null && Audio.currentTime == Audio.context.currentTime) {
              Audio.df.stop();
              Audio.events.emit("EContextBroken");
            }
            Audio.currentTime = Audio.context.currentTime;
          }
        };
      }
      try {
        if (typeof AudioContext !== "undefined") {
          Audio.context = new AudioContext();
        } else if (typeof webkitAudioContext !== "undefined") {
          Audio.context = new webkitAudioContext();
        }
        Audio.context.onstatechange = function () {
          Audio.events.emit(Audio.no() ? "EContextResumed" : "EContextSuspended");
        };
        Audio.events.emit("EContextCreated");
        if (!Audio.no()) {
          Audio.installAutoplayHandlers();
        }
      } catch (b) {
        Audio.context = null;
      }
    }
    static MB() {
      while (true) {
        if (Audio.Yx != null) {
          return Audio.Yx;
        }
        try {
          Audio.Yx = !!window.AudioContext || !!window.webkitAudioContext;
        } catch (a) {
          Audio.Yx = false;
        }
      }
    }
    static LM() {
      // We ship ogg only now (sound sprite was split into individual
      // files under assets/audio/sfx/, plus the music tracks at
      // assets/audio/*.ogg). Skip the canPlayType probe and return "ogg"
      // unconditionally; if a browser can't play ogg vorbis (very rare
      // on the desktop, never on Chrome/Firefox), the user can swap in
      // a transcode later.
      return "ogg";
      // unreachable - keep the original probe body below so the diff
      // stays small and the helpers are still in scope if needed.
      function a(h, m) {
        e[h] = m;
      }
      let b = null;
      try {
        b = typeof Audio !== "undefined" ? new Audio() : null;
      } catch (h) {
        return null;
      }
      if (!b || typeof b.canPlayType !== "function") {
        return null;
      }
      let c = {
        probably: 2,
        maybe: 1,
        "": 0
      };
      let d = null;
      d = function (h) {
        if (h instanceof Array) {
          let m = 0;
          let n = 0;
          while (n < h.length) {
            let q = d(h[n++]);
            if (q > m) {
              m = q;
            }
          }
          return m;
        }
        return ObjectAccess.vf(c, b.canPlayType(h).replace(RegExp("^no$", ""), ""));
      };
      let e = {};
      a("mp3", d("audio/mp3;"));
      a("ogg", d("audio/ogg; codecs=\"vorbis\""));
      a("aac", d("audio/aac;"));
      var f = host.navigator.userAgent;
      if (f.indexOf("OPR") > -1 || f.indexOf("YaBrowser") > -1) {
        e.aac = 0;
      }
      f = 0;
      let g = ["aac", "ogg", "mp3"];
      while (f < g.length) {
        let h = g[f];
        ++f;
        if (ObjectAccess.vf(e, h) > 0) {
          return h;
        }
      }
      return null;
    }
    static lM() {
      try {
        Audio.context.onstatechange = null;
        Audio.context.close();
      } catch (a) {}
      Audio.context = null;
    }
    static UC(a) {
      a.preventDefault();
      if (Audio.context != null && Audio.context.state != "running") {
        Audio.context.resume().then(function () {}, function () {
          Audio.events.emit("EContextResumeRejected");
        });
      }
    }
    static installAutoplayHandlers() {
      window.addEventListener("mouseup", Audio.UC);
      window.addEventListener("touchend", Audio.UC);
    }
  }
  Audio.i = true;

  class SoundFx {
    static play(a, b) {
      if (b == null) {
        b = false;
      }
      if (Save.Bd) {
        Application.instance.Sa.play(a, b);
      }
    }
    static stop(a) {
      Application.instance.Sa.stop(a);
    }
    static Xi(a, b) {
      Application.instance.Sa.kS(a, b);
    }
    static Zn(a) {
      if (Save.Bd) {
        Application.instance.Sa.Zn(a, 1, true);
      }
    }
  }
  SoundFx.i = true;
  class AudioGraphNode {
    constructor(a, b) {
      this.n = a;
      this.type = b;
      this.inputs = [];
      this.output = null;
    }
    get(a) {
      let b = this;
      while (b != null) {
        if (b.type == a) {
          return b;
        }
        b = b.output;
      }
      return null;
    }
    free() {
      this.n = this.output = this.inputs = null;
    }
    connect(a) {
      this.output = a;
      a.inputs.push(this);
      this.n.disconnect();
      this.n.connect(a.n);
    }
    append(a) {
      Std.remove(this.output.inputs, this);
      a.connect(this.output);
      this.connect(a);
    }
  }
  AudioGraphNode.i = true;
  Object.assign(AudioGraphNode.prototype, {
    l: AudioGraphNode
  });
  class AudioGainNode extends AudioGraphNode {
    constructor() {
      super(Audio.context.createGain(), 2);
    }
    Gs(a) {
      this.n.gain.value = a;
    }
    xm(a, b) {
      let c = Audio.context.currentTime;
      let d = this.n;
      d.gain.cancelScheduledValues(0);
      d.gain.linearRampToValueAtTime(a, c + b);
    }
  }
  AudioGainNode.i = true;
  AudioGainNode.s = AudioGraphNode;
  Object.assign(AudioGainNode.prototype, {
    l: AudioGainNode
  });
  class AudioPannerNode extends AudioGraphNode {
    constructor() {
      super(Audio.context.createStereoPanner(), 1);
    }
    pS(a) {
      let b = this.n;
      b.pan.cancelScheduledValues(0);
      b.pan.setTargetAtTime(a, Audio.context.currentTime, 0.005);
    }
  }
  AudioPannerNode.i = true;
  AudioPannerNode.s = AudioGraphNode;
  Object.assign(AudioPannerNode.prototype, {
    l: AudioPannerNode
  });

  class AudioDestinationNode extends AudioGraphNode {
    constructor() {
      super(Audio.context.destination, 8);
    }
  }
  AudioDestinationNode.i = true;
  AudioDestinationNode.s = AudioGraphNode;
  Object.assign(AudioDestinationNode.prototype, {
    l: AudioDestinationNode
  });
  class AudioBufferSourceNode extends AudioGraphNode {
    constructor() {
      super(Audio.context.createBufferSource(), 0);
    }
    free() {
      this.n.onended = null;
      super.free();
    }
    play(a, b, c, d) {
      let e = this.n;
      e.buffer = a;
      e.loop = b;
      e.start(0, c);
      e.onended = d;
    }
    stop(a) {
      if (a == null) {
        a = 0;
      }
      this.n.stop(a);
    }
  }
  AudioBufferSourceNode.i = true;
  AudioBufferSourceNode.s = AudioGraphNode;
  Object.assign(AudioBufferSourceNode.prototype, {
    l: AudioBufferSourceNode
  });
  // ButtonInputState - Scene's single-pointer state machine. Per frame:
  // Scene clears the hover, copies the pointer position into `pos` plus
  // the rising/falling edges into `pressed`/`released`, then calls
  // `poll(id, bounds)` for each registered hit region. The first region
  // that consumes the click returns true; the rest see false.
  //
  // Fields:
  //   pressedId - id of the region under the pointer on press-down, or -1.
  //               Stays latched until release or until the pointer leaves.
  //   hoverId   - id whose bounds the pointer is currently inside.
  //               Cleared every frame, repopulated during poll().
  //   cancelId  - set on press-down if the pointer was OUT of bounds at
  //               press start (id of the would-be active region but with
  //               `pos` outside). Used to suppress the click on release
  //               if the press never actually landed inside.
  //   pos       - pointer position (Vec4, .x/.y meaningful).
  //   pressed / released - set externally each frame by Scene.
  class ButtonInputState {
    constructor() {
      this.cancelId = -1;
      this.pos = new Vec4(0, 0, 0, 1);
      this.hoverId = this.pressedId = -1;
      this.pressed = this.released = false;
    }
    resetHover() {
      this.hoverId = -1;
    }
    fi() {}
    poll(a, b) {
      b = b.Ub(this.pos);
      if (this.pressedId < 0) {
        if (this.pressed) {
          this.cancelId = b ? a : -1;
        }
        if (b) {
          this.hoverId = a;
          if (this.pressed) {
            this.pressedId = a;
          }
        }
      }
      if (this.pressedId == a && (b && (this.hoverId = a), this.released)) {
        b = this.cancelId != a;
        this.cancelId = -1;
        if (b) {
          this.pressedId = -1;
          return this.pressed = this.released = false;
        }
        if (a == this.hoverId) {
          this.pressedId = -1;
          this.pressed = this.released = false;
          return true;
        }
        this.pressedId = -1;
      }
      return false;
    }
    isHovered(a) {
      return a == this.hoverId;
    }
    isActive(a) {
      return a == this.pressedId;
    }
  }
  ButtonInputState.i = true;
  Object.assign(ButtonInputState.prototype, {
    l: ButtonInputState
  });
  class TransitionReplace extends SceneTransition {
    constructor(a, b) {
      super(a, b);
      if (a.De == "Running") {
        a.xb("Paused");
      }
      this.Il(a).transitionOut(0, b);
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 0:
          a = this.jb(this.getTransitionDuration(this.a, this.b) / 2);
          this.Il(this.a).transitionOut(a, this.b);
          if (a == 1) {
            this.setState(1);
          }
          break;
        case 1:
          this.a.xb("Stopped");
          this.a.Oc();
          this.qN(this.a, function (b) {
            if (b.De != "Stopped") {
              b.xb("Stopped");
              b.Oc();
            }
          });
          this.b.xb("Created");
          this.b.init();
          this.b.layout();
          this.setState(2);
          break;
        case 2:
          if (this.time < this.Oj(this.b)) {
            break;
          }
          this.b.xb("Started");
          this.b.onShown();
          this.b.transitionIn(0, this.a);
          this.setState(3);
          break;
        case 3:
          a = this.jb(this.getTransitionDuration(this.a, this.b) / 2);
          this.b.transitionIn(a, this.a);
          if (!(a < 1)) {
            this.b.xb("Running");
            this.b.start();
            this.Il(this.a).ud.dispose();
            this.dispose();
          }
      }
    }
  }
  TransitionReplace.i = true;
  TransitionReplace.s = SceneTransition;
  Object.assign(TransitionReplace.prototype, {
    l: TransitionReplace
  });
  class TransitionCrossfade extends SceneTransition {
    constructor(a, b) {
      super(a, b);
      b.xb("Created");
      b.init();
      b.layout();
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 0:
          if (this.time < this.Oj(this.b)) {
            break;
          }
          this.a.xb("Paused");
          for (a = this.a; a.parent != null && a.parent != this.a.fa;) {
            a = a.parent;
          }
          this.Il(this.a).transitionOut(1, this.b);
          this.b.xb("Started");
          this.b.onShown();
          this.b.transitionIn(0, this.a);
          this.time = 0;
          this.state = 1;
          break;
        case 1:
          a = this.jb(this.getTransitionDuration(this.a, this.b));
          this.Il(this.a).transitionOut(a, this.b);
          this.b.transitionIn(a, this.a);
          if (a == 1) {
            this.a.xb("Stopped");
            this.a.Oc();
            for (a = this.a; a.parent != null && a.parent != this.a.fa;) {
              if (a.De != "Stopped") {
                a.xb("Stopped");
                a.Oc();
              }
              a = a.parent;
            }
            this.Il(this.a).dispose();
            this.b.xb("Running");
            this.b.start();
            this.dispose();
          }
      }
    }
  }
  TransitionCrossfade.i = true;
  TransitionCrossfade.s = SceneTransition;
  Object.assign(TransitionCrossfade.prototype, {
    l: TransitionCrossfade
  });
  class TransitionExit extends SceneTransition {
    constructor(a) {
      super(a, null);
      a.xb("Paused");
      a.transitionOut(1, null);
    }
    update() {
      let a = this.jb(this.getTransitionDuration(this.a, this.b));
      this.a.transitionOut(a, this.b);
      if (!(a < 1)) {
        this.a.xb("Stopped");
        this.a.Oc();
        this.a.dispose();
        this.dispose();
      }
    }
  }
  TransitionExit.i = true;
  TransitionExit.s = SceneTransition;
  Object.assign(TransitionExit.prototype, {
    l: TransitionExit
  });
  class TransitionPopBack extends SceneTransition {
    constructor(a, b, c) {
      if (b == null) {
        b = true;
      }
      let d = a.SN();
      super(a, d);
      this.wR = b;
      this.Hi = c;
      a.xb("Paused");
      a.transitionOut(0, d);
    }
    update(a) {
      super.update(a);
      a = this.jb(this.getTransitionDuration(this.a, this.b));
      this.a.transitionOut(a, this.b);
      if (a == 1) {
        this.a.xb("Stopped");
        this.a.Oc();
        this.a.ud.dispose();
        if (this.wR) {
          if (this.b.De == "Stopped") {
            this.b.xb("Restarted");
          }
          this.b.xb("Running");
          this.b.start();
        }
        this.dispose();
        if (this.Hi != null) {
          this.Hi();
          this.Hi = null;
        }
      }
    }
  }
  TransitionPopBack.i = true;
  TransitionPopBack.s = SceneTransition;
  Object.assign(TransitionPopBack.prototype, {
    l: TransitionPopBack
  });
  class TransitionPushOver extends SceneTransition {
    constructor(a, b) {
      super(a, b);
      b.xb("Created");
      b.init();
      b.layout();
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 0:
          if (this.time < this.Oj(this.b)) {
            break;
          }
          if (this.a.De == "Running") {
            this.a.xb("Paused");
          }
          this.b.xb("Started");
          this.b.onShown();
          this.b.transitionIn(0, this.a);
          this.setState(1);
          break;
        case 1:
          a = this.jb(this.getTransitionDuration(this.a, this.b));
          this.b.transitionIn(a, this.a);
          if (!(a < 1)) {
            if (this.b.replacesPrevious()) {
              this.a.xb("Stopped");
              this.a.Oc();
            }
            this.b.xb("Running");
            this.b.start();
            this.dispose();
          }
      }
    }
  }
  TransitionPushOver.i = true;
  TransitionPushOver.s = SceneTransition;
  Object.assign(TransitionPushOver.prototype, {
    l: TransitionPushOver
  });
  class TransitionPush extends SceneTransition {
    constructor(a) {
      super(null, a);
      a.xb("Created");
      a.init();
      a.layout();
    }
    update() {
      switch (this.state) {
        case 0:
          if (this.time < this.Oj(this.b)) {
            break;
          }
          this.b.xb("Started");
          this.b.onShown();
          this.b.transitionIn(0, this.a);
          this.setState(1);
          break;
        case 1:
          let a = this.jb(this.getTransitionDuration(this.b, this.a));
          this.b.transitionIn(a, this.a);
          if (!(a < 1)) {
            this.b.xb("Running");
            this.b.start();
            this.dispose();
          }
      }
    }
  }
  TransitionPush.i = true;
  TransitionPush.s = SceneTransition;
  Object.assign(TransitionPush.prototype, {
    l: TransitionPush
  });
  class Candy extends MovingEntity {
    constructor(a) {
      super();
      this.S = a;
      this.kb = null;
      this.Zf = false;
      this.Xm = -1;
      this.Er = Vec2.sc();
      this.Hf = 0;
      this.jw = false;
      this.So = 0;
      this.nh = this.Sd = null;
      this.dm = this.gm = this.im = 0;
      this.Hh = this.ve = false;
      this.mc = null;
      this.Gk = 0;
      this.po = this.Zx = this.Ps = false;
      this.gs = 0.8;
      this.Z = 0;
    }
    XN(a, b, c) {
      a = Vec2.Ia(a, c);
      return (Vec2.Ia(b, c).km() - a.km()) * RAD2DEG;
    }
    kO(a, b) {
      this.Er.x = a;
      this.Er.y = b;
    }
    jO(a) {
      SoundFx.play(SoundFx.wheel);
      let b = this.XN(this.Er, a, new Vec2(this.x, this.y));
      if (b > 180) {
        b -= 360;
      } else if (b < -180) {
        b += 360;
      }
      var c = this.yt;
      c.la(c.Zd + b);
      c = this.ay;
      c.la(c.Zd + b);
      c = this.$x;
      c.la(c.Zd + b);
      b = b > 0 ? Math.min(Math.max(1, b), 2.25) : Math.max(Math.min(-1, b), -2.25);
      if (this.kb != null) {
        if (b > 0) {
          if (this.kb.Rb() < 660) {
            this.kb.dc(b);
          }
        } else if (b != 0 && this.kb.za.length > 3) {
          this.kb.xR(-b);
        }
        this.Zx = true;
      }
      this.Er.Pb(a);
    }
    update(a) {
      super.update(a);
      if (this.po) {
        this.gs -= a * 1.5;
        if (this.gs <= 0) {
          this.Z = -1;
          this.po = false;
        }
      }
      if (this.Ld != null) {
        let b = Vec2.Ia(this.pb.path[this.pb.Xf], this.pb.g);
        let c = 0;
        if (Math.abs(b.x) > 15) {
          c = b.x > 0 ? 10 : -10;
        }
        this.Ld.la(PathResolver.dk(this.Ld.Zd, c, 60, a));
      }
      if (this.Zf && this.Zx && this.kb != null) {
        a = this.kb.Rb() * 0.7;
        if (a == 0) {
          this.yt.setUniformScale(0.001);
        } else {
          this.yt.setUniformScale(Math.max(0, Math.min(1.2, 1 - a / 784)) * 0.4);
        }
      }
    }
    rT(a) {
      if (this.ve && this.Ps) {
        this.Ps = false;
        this.Hh = true;
        SoundFx.play(SoundFx.spider_activate);
        this.mc.start();
      }
      if (this.ve && this.Hh) {
        if (this.mc.state != 0) {
          this.Gk += a * 46.800000000000004;
        }
        a = 0;
        let c = false;
        if (this.kb != null) {
          var b = this.kb.Tu;
          let d = b.length;
          let e = 0;
          while (e < d) {
            let f = e++;
            let g = b[f];
            let h = b[f + 1];
            let m = Math.max(28, g.sf(h));
            if (this.Gk >= a && (this.Gk < a + m || f > d - 3)) {
              b = Vec2.Ia(h, g);
              b.multiply((this.Gk - a) / m);
              this.mc.U.setX(g.x + b.x);
              this.mc.U.setY(g.y + b.y);
              if (f > d - 3) {
                c = true;
              }
              if (this.mc.state != 0) {
                this.mc.U.la(b.km() * RAD2DEG + 270);
              }
              break;
            } else {
              a += m;
            }
          }
        }
        if (c) {
          this.Gk = -1;
        }
      }
    }
    RM() {
      if (this.Hf > 0) {
        this.back.L(false);
        this.Sd.L(true);
      } else {
        this.back.setX(this.x);
        this.back.setY(this.y);
        this.back.L(true);
        if (this.Sd != null) {
          this.Sd.L(false);
        }
      }
      if (this.Z != -1 || this.po) {
        this.YM(this.x, this.y, this.Z != -1 ? this.Z : this.gD);
      }
    }
    YM(a, b, c) {
      this.Yh.color.x = 0.2;
      this.Yh.color.y = 0.5;
      this.Yh.color.z = 0.9;
      this.Yh.color.w = this.gs;
      let d = this.Yh.C;
      d.x = a;
      d.y = b;
      this.Yh.Z = c;
    }
    M() {
      if (this.Zf) {
        this.$x.L(this.Xm != -1);
        this.ay.L(this.Xm == -1);
      }
      if (this.Ld != null) {
        this.Ld.setX(this.x);
        this.Ld.setY(this.y);
      }
      if (this.kb != null) {
        this.kb.M();
      }
      if (this.Hf <= 0) {
        this.front.setX(this.x);
        this.front.setY(this.y);
        this.front.L(true);
      } else {
        this.front.L(false);
        if (this.im != -1) {
          this.nh.Fb(Keys.BH);
        } else {
          this.nh.Fb(Keys.Ly);
        }
        this.nh.setX(this.x);
        this.nh.setY(this.y);
      }
    }
    eE(a) {
      this.kb = a;
      this.gD = this.Z;
      this.Z = -1;
      if (this.ve) {
        this.Ps = true;
      }
    }
    setRadius(a) {
      this.gD = this.Z;
      this.Z = a;
      var b = this.S.ma(3);
      var c = this.S.ma(8);
      if (a == -1 || a == -2) {
        a = X.ym() ? [Keys.uH, Keys.vH] : [Keys.zH, Keys.AH];
        this.back = new Sprite(null, Resources.ph, a[0]);
        this.back.setUniformScale(0.4);
        this.back.center();
        this.front = new Sprite(null, Resources.ph, a[1]);
        this.front.center();
        this.front.setUniformScale(0.4);
        b.P(this.back.u);
        c.P(this.front.u);
      } else {
        this.back = new Sprite(null, Resources.ph, Keys.sH);
        this.back.center();
        this.back.setUniformScale(0.4);
        this.front = new Sprite(null, Resources.ph, Keys.tH);
        this.front.center();
        this.front.setUniformScale(0.5);
        b.P(this.back.u);
        c.P(this.front.u);
        this.po = false;
        this.Yh = new DashedCircleEffect();
        this.xq = new SceneGroup();
        this.xq.Rf(this.Yh);
        c.P(this.xq);
      }
      let d = this;
      if (this.Zf) {
        b = function (e) {
          e = new Sprite(null, Resources.ph, e);
          e.center();
          e.setX(d.x);
          e.setY(d.y);
          e.setUniformScale(0.4);
          return e;
        };
        c = b(Keys.DH);
        this.S.ma(3).P(c.u);
        this.yt = b(Keys.EH);
        this.S.ma(8).P(this.yt.u);
        this.$x = b(Keys.CH);
        this.S.ma(8).P(this.$x.u);
        this.ay = b(Keys.FH);
        this.S.ma(8).P(this.ay.u);
        this.Zx = true;
      }
    }
    WR(a, b, c) {
      this.Hf = a;
      this.jw = b;
      this.So = c;
      if (this.Hf > 0) {
        this.Sd = new Container();
        a = new Sprite(this.Sd, Resources.ph, Keys.wH);
        a.setX(-63);
        new Sprite(this.Sd, Resources.ph, Keys.yH).setX(this.Hf / 0.4 - 13);
        b = new Sprite(this.Sd, Resources.ph, Keys.xH);
        b.setX(-63 + a.getWidth());
        b.px(this.Hf / 0.4 - 13);
        this.Sd.setUniformScale(0.4);
        this.Sd.center();
        this.S.ma(5).P(this.Sd.u);
        this.nh = new Sprite(null, Resources.ph, Keys.Ly);
        this.nh.center();
        this.nh.setUniformScale(0.4);
        this.S.ma(8).P(this.nh.u);
        if (this.jw) {
          this.gm = this.y - this.So;
          this.dm = this.y + (this.Hf - this.So);
          a = (this.gm + this.dm) / 2;
          this.Sd.setX(this.x);
          this.Sd.setY(a);
          this.Sd.la(90);
          this.nh.la(90);
        } else {
          this.gm = this.x - this.So;
          this.dm = this.x + (this.Hf - this.So);
          this.Sd.setX((this.gm + this.dm) / 2);
          this.Sd.setY(this.y);
        }
      }
      this.im = -1;
    }
    KR() {
      this.Ld = new Container();
      this.Ld.setUniformScale(0.3076923076923077);
      var a = new Sprite(this.Ld, Resources.Ld, Keys.GG);
      a.center();
      a.setX(a.getX() - 6);
      a.setY(a.getY() - 54);
      this.S.ma(8).P(this.Ld.u);
      a = new Sprite(this.Ld, Resources.Ld, Keys.HG);
      a.center();
      a.setX(-6);
      a.setY(-54);
      a.pa().loop(BEE_ANIM);
      a.pa().Cw();
    }
    lS(a) {
      this.ve = a;
      this.Hh = this.Ps = false;
      if (a) {
        this.mc = new Spider();
        this.mc.U.setX(this.x);
        this.mc.U.setY(this.y);
        this.S.oa(this.mc);
        this.S.ma(10).P(this.mc.U.u);
      }
    }
    Qu() {
      this.kb = null;
    }
  }
  Candy.i = true;
  Candy.s = MovingEntity;
  Object.assign(Candy.prototype, {
    l: Candy
  });
  class CandyVariant extends Candy {
    constructor(a) {
      super(a.S);
      this.de = a;
      this.fc = [];
    }
    Pl() {
      return this.state < 0;
    }
    Io() {
      if (this.state != 1) {
        this.state = 1;
        this.time = 0;
      }
    }
    Jo() {
      if (this.state != -1) {
        this.state = -1;
        this.time = 0;
      }
    }
    mu() {
      function a(d) {
        d = new Sprite(b.Cb, Resources.de, Keys.jj(Keys.Wp, d));
        d.center();
        return d;
      }
      this.Cb = new Container();
      this.S.ma(5).P(this.Cb.u);
      let b = this;
      if (CandyVariant.Yz == null) {
        CandyVariant.Yz = AnimTimeline.parse("0,s.17<x-26<y3<,.65,s.18>x-25>y2>,1.3,s.2<x-24<y1<,1.95,s.18>x-25>y2>,2.6,s.17x-26y3");
      }
      var c = new SpriteAnimator(a(1));
      c.loop(CandyVariant.Yz);
      this.fc.push(c);
      if (CandyVariant.Xh == null) {
        CandyVariant.Xh = AnimTimeline.parse("0,s.36<x23<y14<,.45,s.32>x22>y13>,.9,s.27<x21<y12<,1.35,s.32>x22>y13>,1.8,s.36x23y14");
      }
      c = new SpriteAnimator(a(2));
      c.loop(CandyVariant.Xh);
      this.fc.push(c);
      if (CandyVariant.Wh == null) {
        CandyVariant.Wh = AnimTimeline.parse("0,s.44<x-3<y25<,.5,s.4>x-2>y24>,1,s.36<x-1<y23<,1.5,s.4>x-2>y24>,2,s.44x-3y25");
      }
      c = new SpriteAnimator(a(4));
      c.loop(CandyVariant.Wh);
      this.fc.push(c);
    }
    free() {
      if (this.kb != null) {
        this.kb.Gw(0);
        this.kb.free();
      }
      this.Qu();
      this.Cb.free();
      this.Cb = null;
      this.back.free();
      this.front.free();
      this.xq.free();
      this.front = this.back = this.S = this.xq = null;
    }
    update(a) {
      super.update(a);
      if (this.state > 0) {
        this.time += a;
        let b = Math.min(1, this.time / 0.36);
        this.alpha = b;
        if (b == 1) {
          this.state = 0;
        }
      }
      if (this.state < 0 && this.state != -2) {
        this.time += a;
        a = Math.min(1, this.time / 0.16);
        this.alpha = 1 - a;
        if (a == 1) {
          this.state = -2;
          this.de.wD();
        }
      }
    }
    M() {
      super.M();
      this.Cb.setX(this.x);
      this.Cb.setY(this.y);
      this.Cb.W(this.alpha);
      this.back.W(this.alpha);
      this.front.W(this.alpha);
      this.Yh.color.w = this.alpha;
    }
  }
  CandyVariant.i = true;
  CandyVariant.s = Candy;
  Object.assign(CandyVariant.prototype, {
    l: CandyVariant
  });

  class CandyCutAnim extends AnchoredEntity {
    constructor(a) {
      super();
      this.S = a;
      var b = CandyCutAnim.Sp.w;
      var c = b / 2;
      let d = CandyCutAnim.Sp.J / 2;
      c = this.ea = new Bounds(0 - c, 0 - d, c, d);
      this.sa = new Bounds(c.A, c.D, c.B, c.G);
      this.j = new Container();
      a.ma(9).P(this.j.u);
      a = new Sprite(null, Resources.I, Keys.cH);
      a.center();
      this.j.appendChild(a);
      b /= a.X.x;
      b *= a.X.x / CandyCutAnim.gy.w;
      a.setUniformScale(b);
      a = new Sprite(null, Resources.I, Keys.dH);
      a.center();
      a.setUniformScale(b);
      this.j.appendChild(a);
      a = new Sprite(null, Resources.I, Keys.eH);
      a.center();
      a.setUniformScale(b);
      this.j.appendChild(a);
      a = new Sprite(null, Resources.I, v155.data[0]);
      a.center();
      a.setUniformScale(b);
      this.j.appendChild(a);
      this.j.setUniformScale(0.71);
      this.oe = true;
    }
    CQ() {
      if (this.j != null) {
        var a = this.j.nb(3);
        a.L(true);
        a.pa().play(v155).Be(function () {
          a.L(false);
        });
      }
    }
    XC() {
      if (this.j != null) {
        var a = this.j.nb(3);
        a.L(true);
        a.W(1);
        a.pa().play(v156);
        a.tween().alpha(0, 0.2, null, null, function () {
          a.L(false);
        });
      }
    }
    free() {
      this.j.free();
      this.j = null;
    }
    update(a) {
      super.update(a);
      this.sa.A = this.x + this.ea.A;
      this.sa.D = this.y + this.ea.D;
      this.sa.B = this.x + this.ea.B;
      this.sa.G = this.y + this.ea.G;
    }
    M() {
      super.M();
      if (this.j != null) {
        if (this.oe) {
          this.j.setX(this.x);
          this.j.setY(this.y);
        }
        this.j.la(this.rotation);
        this.j.L(this.visible);
      }
    }
  }
  CandyCutAnim.i = true;
  CandyCutAnim.s = AnchoredEntity;
  Object.assign(CandyCutAnim.prototype, {
    l: CandyCutAnim
  });
  class CandyShatterParticles extends ParticleEmitter {
    constructor(a, b) {
      super(b);
      this.S = a;
      this.duration = 2;
      this.Kb.x = 0;
      this.Kb.y = 500;
      this.angle = -90;
      this.wn = 50;
      this.speed = 150;
      this.yp = 70;
      this.HE = this.lD = 1;
      this.Xc = 2;
      this.size = 1;
      this.Lq = 100;
      this.Fm = 0;
      this.xs = 600;
      this.wb = [];
    }
    qh(a) {
      super.qh(a);
      a.Eq = DEG2RAD * (this.Fm + this.xs * X.Ac());
      a = new Sprite(null, Resources.I, Keys.jj("", X.xh(3, 7)));
      a.center();
      a.setUniformScale(this.size * 0.4);
      this.S.ma(5).P(a.u);
      this.wb.push(a);
    }
    Kh(a, b, c) {
      a.angle += a.Eq * c;
      super.Kh(a, b, c);
    }
    Fg(a) {
      super.Fg(a);
      this.wb.splice(a, 1);
    }
    M() {
      super.M();
      let a = 0;
      let b = this.ac.length;
      while (a < b) {
        var c = a++;
        let d = this.ac[c];
        c = this.wb[c];
        c.la(d.angle * RAD2DEG);
        c.setX(d.g.x);
        c.setY(d.g.y);
      }
    }
  }
  CandyShatterParticles.i = true;
  CandyShatterParticles.s = ParticleEmitter;
  Object.assign(CandyShatterParticles.prototype, {
    l: CandyShatterParticles
  });
  class CandyPiece extends AnchoredEntity {
    constructor(a, b) {
      super();
      this.S = a;
      this.T = new Sprite(null, Resources.I, b);
      this.T.center();
      this.T.setUniformScale(0.284);
      a.ma(9).P(this.T.u);
      a = CandyPiece.ky.w / 2;
      b = CandyPiece.ky.J / 2;
      a = this.ea = new Bounds(0 - a, 0 - b, a, b);
      this.sa = new Bounds(a.A, a.D, a.B, a.G);
    }
    update(a) {
      super.update(a);
      this.sa.A = this.x + this.ea.A;
      this.sa.D = this.y + this.ea.D;
      this.sa.B = this.x + this.ea.B;
      this.sa.G = this.y + this.ea.G;
    }
    M() {
      super.M();
      if (this.T != null) {
        this.T.setX(this.x);
        this.T.setY(this.y);
        this.T.la(this.rotation);
      }
    }
  }
  CandyPiece.i = true;
  CandyPiece.s = AnchoredEntity;
  Object.assign(CandyPiece.prototype, {
    l: CandyPiece
  });

  class BubbleAnim {
    constructor(a) {
      this.S = a;
      this.T = new Sprite();
      this.T.L(false);
    }
    setX(a) {
      this.T.setX(a);
      if (this.Cb != null) {
        this.Cb.j.setX(a);
      }
      return a;
    }
    setY(a) {
      this.T.setY(a);
      if (this.Cb != null) {
        this.Cb.j.setY(a);
      }
    }
    oh() {
      this.T.remove();
      if (this.Cb != null) {
        this.Cb.j.remove();
      }
    }
    show() {
      this.T.Uf(Resources.ca, Keys.XG);
      this.T.center();
      this.T.setUniformScale(0.4);
      if (this.T.u.parent == null) {
        this.S.ma(9).P(this.T.u);
      }
      this.T.pa().loop(BubbleAnim.uF);
      this.T.L(true);
    }
    yS() {
      if (this.Cb != null && this.Cb.j.node.parent == null) {
        this.S.ma(9).P(this.Cb.j.u);
      }
    }
  }
  BubbleAnim.i = true;
  Object.assign(BubbleAnim.prototype, {
    l: BubbleAnim
  });
  class MagnetEffect extends GameObject {
    constructor(a, b, c) {
      super();
      this.hM = b;
      this.Qi = c;
      this.yl = 0;
      this.isActive = false;
      this.j = new Container();
      a.ma(0).P(this.j.u);
      this.qk = new MagnetInner(a.ma(12));
      this.rk = new MagnetOuter(a.ma(12));
      a = new AnimTimeline();
      a.vc(0.27999999999999997, 0);
      a.vc(0.4, 0.5);
      a.vc(0.27999999999999997, 1);
      a.yk(0, 0);
      a.yk(360, 1);
      this.Di = new Sprite(null, Resources.Kd, Keys.gI);
      this.Di.center();
      this.Di.Wd(3);
      this.Di.L(false);
      this.j.appendChild(this.Di);
      new SpriteAnimator(this.Di).loop(a);
    }
    free() {
      this.j.free();
      this.j = null;
      this.qk.free();
      this.rk.free();
      SoundFx.stop(SoundFx.sp_telekinesis);
    }
    TD(a) {
      if (a && !this.isActive) {
        this.rk.reset();
        this.yl = 0;
        this.state = 1;
        SoundFx.play(SoundFx.sp_telekinesis, true);
      }
      if (!a && this.isActive) {
        this.state = 0;
        this.yl = vLN01;
        SoundFx.stop(SoundFx.sp_telekinesis);
      }
      this.qk.Os(a);
      this.rk.Os(a);
      this.Di.L(a);
      this.isActive = a;
    }
    update(a) {
      if (this.j != null && (super.update(a), this.yl = PathResolver.dk(this.yl, this.state == 0 ? 0 : 0.3, 1, a), this.isActive)) {
        let b = this.state == 1 ? this.yl / 0.3 : this.yl / vLN01;
        this.qk.x = this.Qi.x;
        this.qk.y = this.Qi.y;
        this.qk.update(a);
        this.qk.alpha = b;
        this.rk.alpha = b * 0.5;
        this.rk.qT(this.Qi, this.hM);
        this.rk.update(a);
      }
    }
    M() {
      if (this.j != null) {
        super.M();
        if (this.isActive) {
          this.Di.setX(this.Qi.x);
          this.Di.setY(this.Qi.y);
          this.qk.M();
          this.rk.M();
        }
      }
    }
  }
  MagnetEffect.i = true;
  MagnetEffect.s = GameObject;
  Object.assign(MagnetEffect.prototype, {
    l: MagnetEffect
  });
  class MagnetInner extends GameObject {
    constructor(a) {
      super();
      this.j = new Container();
      a.P(this.j.u);
      this.xt = 4;
      this.xT = 2;
      this.pF = [];
      a = 0;
      let b = this.xt;
      while (a < b) {
        ++a;
        let c = new Sprite(this.j, Resources.Kd, Keys.jI);
        c.center();
        c.Wd(3);
        this.pF.push(c);
      }
      this.mD = 1.25;
      this.HD = 2;
      this.RL = 0.7;
      this.uc = 0;
      this.Os(false);
    }
    free() {
      this.j.free();
      this.j = null;
    }
    Os(a) {
      this.j.L(a);
    }
    $R(a) {
      this.uc = a > HALF_PI ? 0 : a;
    }
    update(a) {
      this.$R(this.uc + a / this.xT);
    }
    M() {
      if (this.j != null) {
        var a = Array(4);
        for (var b = 0, c = this.xt; b < c;) {
          var d = b++;
          a[d] = this.uc + d * HALF_PI / this.xt;
        }
        b = 0;
        for (c = this.xt; b < c;) {
          d = b++;
          let e = this.pF[d];
          if (a[d] > HALF_PI) {
            a[d] -= HALF_PI;
          }
          let f = this.RL * Math.cos(a[d]) * this.alpha;
          if (d % 2 != 0) {
            e.la(this.HD * 360 * a[d] / PI);
          } else {
            e.la(-this.HD * 360 * a[d] / PI);
          }
          e.setScaleX(this.mD * Math.sin(a[d]) * 0.4);
          e.setScaleY(this.mD * Math.sin(a[d]) * 0.4);
          e.setX(this.x);
          e.setY(this.y);
          e.W(f);
        }
      }
    }
  }
  MagnetInner.i = true;
  MagnetInner.s = GameObject;
  Object.assign(MagnetInner.prototype, {
    l: MagnetInner
  });
  class MagnetOuter extends GameObject {
    constructor(a) {
      super();
      this.Xs = new Vec2(0, 0);
      this.uc = this.length = 0;
      this.j = new Container();
      a.P(this.j.u);
      this.wb = [];
      for (a = 0; a < 4;) {
        ++a;
        let b = new Sprite(this.j, Resources.Kd, "ray");
        b.Wd(3);
        b.W(0.3);
        b.L(false);
        this.wb.push(b);
      }
    }
    free() {
      this.j.free();
      this.j = null;
    }
    Os(a) {
      if (this.j != null) {
        this.j.L(a);
      }
    }
    qT(a, b) {
      b = Vec2.Ia(b, a);
      this.length = b.Rb();
      this.rotation = Math.atan2(b.y, b.x) * RAD2DEG - 90;
      this.Xs.x = a.x;
      this.Xs.y = a.y;
    }
    reset() {
      this.uc = 0;
    }
    update() {
      this.uc += 0.05;
      let a = 0;
      while (a < 4) {
        this.wb[a++].SR(this.uc);
      }
    }
    M() {
      if (this.j != null) {
        var a = Math.ceil(this.length / (this.wb[0].X.y / 4));
        if (a > 4) {
          a = 4;
        }
        for (var b = 0; b < 4;) {
          this.wb[b++].L(false);
        }
        for (var c = b = 0; c < a;) {
          let d = c++;
          let e = this.wb[d];
          b += e.X.y;
          e.setX(-e.X.x / 2);
          e.setY(d * e.X.y);
          e.L(true);
        }
        this.j.setScaleX(0.27999999999999997);
        this.j.setScaleY(this.length / b);
        this.j.setX(this.Xs.x);
        this.j.setY(this.Xs.y);
        this.j.la(this.rotation);
      }
    }
  }
  MagnetOuter.i = true;
  MagnetOuter.s = GameObject;
  Object.assign(MagnetOuter.prototype, {
    l: MagnetOuter
  });

  class MagnetGlowFlash extends GameObject {
    constructor(a, b) {
      super();
      this.S = a;
      this.I = b;
      this.j = new Container();
      a.ma(0).P(this.j.u);
      this.Nc = new Sprite(this.j, Resources.Kd, Keys.bI);
      this.Nc.center();
      this.Nc.L(false);
      this.Nc.la(0);
      this.Nc.setUniformScale(0.5);
      this.Nc.Wd(4);
      this.uc = this.Aq = 0;
      this.Wf = new SmokeEmitter(a, 10);
    }
    free() {
      this.Nc.free();
      this.Wf.free();
      this.j.free();
      this.j = null;
    }
    IA(a, b) {
      if (!(this.Aq > 0)) {
        this.Aq = 0.064;
        this.Nc.setX(a.x);
        this.Nc.setY(a.y);
        this.Nc.L(true);
        this.Nc.W(1);
        this.Nc.la(90 - b);
        this.uc = 0;
        this.Wf.x = a.x;
        this.Wf.y = a.y;
        this.Wf.angle = -b;
        a = new Vec2(1, 0);
        a.rotate(-b * PI / 180);
        b = Vec2.Ob(a, 15);
        this.Wf.x -= b.x;
        this.Wf.y -= b.y;
        this.Wf.Qm(10);
        this.I.XC();
        SoundFx.play(SoundFx.sp_field_bounce);
      }
    }
    update(a) {
      if (this.j != null) {
        this.Aq -= a;
        this.uc += a * 15;
        if (this.uc >= PI) {
          this.Nc.L(false);
        }
        this.Nc.W(Math.sin(this.uc));
        this.Wf.update(a);
      }
    }
    M() {
      super.M();
      this.Wf.M();
    }
  }
  MagnetGlowFlash.i = true;
  MagnetGlowFlash.s = GameObject;
  Object.assign(MagnetGlowFlash.prototype, {
    l: MagnetGlowFlash
  });
  class BonusStar extends MovingEntity {
    constructor(a) {
      super();
      this.S = a;
      this.Ij = this.time = 0;
      this.j = new Container();
      this.j.setUniformScale(0.4);
      a.ma(11).P(this.j.u);
    }
    hT() {
      this.j.L(true);
      this.Wc = new Sprite(this.j, Resources.Oa, Keys.nI);
      this.Wc.center();
      this.Wc.setUniformScale(0.4);
      var a = new AnimTimeline();
      a.vc(0.01, 0);
      a.vc(1, 0.2);
      a.La(0, 0);
      a.La(1, 0.2);
      new SpriteAnimator(this.Wc).play(a);
      this.Oa = new Sprite(this.j, Resources.Oa, Keys.pI);
      this.Oa.center();
      this.Oa.pa().loop(STAR_IDLE_BLUE_ANIM);
      this.Oa.pa().Cw();
      a = new AnimTimeline();
      a.vc(0, 0);
      a.vc(1, 0.2);
      a.La(0, 0);
      a.La(1, 0.2);
      new SpriteAnimator(this.Oa).play(a);
      this.qx = new Sprite(this.j, Resources.Oa, Keys.yI);
      this.qx.center();
      this.qx.setUniformScale(0.4);
      a = new AnimTimeline();
      a.vc(0.01, 0);
      a.vc(1, 0.205);
      a.vc(1.5, 0.505);
      a.La(0, 0);
      a.La(1, 0.05);
      a.La(1, 0.305);
      a.La(0, 0.505);
      new SpriteAnimator(this.qx).play(a, function () {});
    }
    Iu() {
      this.time = 0;
      this.nM = true;
      SoundFx.play(SoundFx.sp_cloverleaf);
      var a = new AnimTimeline();
      a.La(1, 0);
      a.La(1, 0.05);
      a.La(0, 0.805);
      a.yk(1, 0);
      a.yk(1, 0.05);
      a.yk(360, 0.805);
      a.vc(1, 0);
      a.vc(1, 0.05);
      a.vc(0.01, 0.805);
      new SpriteAnimator(this.Oa).play(a);
      a = new AnimTimeline();
      a.La(1, 0);
      a.La(1, 0.05);
      a.La(0, 0.805);
      a.vc(1, 0);
      a.vc(1, 0.05);
      a.vc(0.01, 0.805);
      new SpriteAnimator(this.Wc).play(a);
      for (a = 0; a < 6;) {
        var b = a++;
        var c = b * TWO_PI / 6;
        let d = new Sprite(this.j, Resources.Oa, Keys.zI);
        d.setUniformScale((b & 1) == 0 ? 0.5 : 1);
        d.center();
        b = Math.cos(c) * Star.bg * 10;
        c = Math.sin(c) * Star.bg * 10;
        d.tween().x(b, 1);
        d.tween().y(c, 1);
        d.tween().scale(0, 1);
        d.tween().alpha(0, 1, Easing.quadIn());
        d.tween().rotation(360, 1);
      }
    }
    free() {
      this.j.free();
      this.j = null;
    }
    update(a) {
      super.update(a);
      if (this.j != null) {
        this.Ij += a;
        var b = Math.sin(this.Ij * 3) * 3;
        for (var c = 0, d = this.j.Mj(); c < d;) {
          this.j.nb(c++).setY(b);
        }
        this.time += a;
        if (this.nM && this.time > 1) {
          this.free();
        }
      }
    }
    tg() {
      let a = this.ea;
      let b = this.ea;
      return new Vec2((a.B - a.A) * 0.9, (b.G - b.D) * 0.9);
    }
    Yq() {
      return 8;
    }
    M() {
      if (this.j != null) {
        super.M();
        this.j.setX(this.x);
        this.j.setY(this.y);
      }
    }
  }
  BonusStar.i = true;
  BonusStar.s = MovingEntity;
  Object.assign(BonusStar.prototype, {
    l: BonusStar
  });
  class Star extends MovingEntity {
    constructor(a) {
      super();
      this.S = a;
      this.fe = null;
      var b = Rect.Zb(Star.iK);
      var c = b.w / 2;
      b = b.J / 2;
      c = this.ea = new Bounds(0 - c, 0 - b, c, b);
      this.sa = new Bounds(c.A, c.D, c.B, c.G);
      this.timeout = 0;
      this.time = X.gi() * 2;
      this.Ij = 0;
      this.j = new Container();
      this.Wc = new Sprite(this.j, Resources.Oa, Keys.mI);
      this.Wc.center();
      this.Wc.setUniformScale(0.4);
      if (a.$c) {
        this.Ik = new Sprite(this.j, Resources.Oa, Keys.sI);
        this.Ik.center();
        this.Ik.setUniformScale(0.4);
      }
      this.Oa = new Sprite(this.j, Resources.Oa, Keys.oI);
      this.Oa.center();
      this.Oa.setUniformScale(0.4);
      this.Oa.setUniformScale(0.4);
      this.Oa.pa().loop(STAR_IDLE_ANIM);
      this.Oa.pa().Cw();
      if (a.$c) {
        this.Ik.pa().loop(STAR_IDLE_OFF_ANIM);
        this.Ik.pa().setTime(0);
        this.Ik.W(0);
        this.Ei = new Sprite(this.j, Resources.Oa, Keys.wI);
        this.Ei.center();
        this.Ei.setUniformScale(0.4);
        this.Ei.L(false);
        this.Ei.Wd(3);
        this.Zj = new Sprite(this.j, Resources.Oa, Keys.uI);
        this.Zj.center();
        this.Zj.setUniformScale(0.4);
        this.Zj.L(false);
      }
      a.ma(11).P(this.j.u);
    }
    Lm(a) {
      let b = this.fe == null;
      if (this.fe != a) {
        if (a) {
          if (!b) {
            this.Ei.L(true);
            this.Ei.pa().play(STAR_LIGHT_UP_ANIM);
            this.Ei.pa().Be(cachedBind(this, this.hQ));
            SoundFx.play(X.ym() ? SoundFx.star_light01 : SoundFx.star_light02);
          }
        } else if (b) {
          this.Wc.W(0);
          this.Oa.W(0);
        } else {
          this.Zj.L(true);
          this.Zj.pa().play(STAR_LIGHT_DOWN_ANIM);
          this.Zj.pa().Be(cachedBind(this, this.gQ));
        }
        this.fe = a;
      }
    }
    free() {
      this.j.free();
    }
    setTimeout() {
      this.time = this.timeout;
      this.Fp = new Sprite(null, Resources.Oa, Keys.AI);
      this.Fp.setUniformScale(0.4);
      this.Fp.center();
      this.j.appendChild(this.Fp);
      this.j.Ww(this.Fp, 0);
    }
    gQ() {
      this.Zj.L(false);
    }
    hQ() {
      this.Ei.L(false);
    }
    update(a) {
      super.update(a);
      this.Ij += a;
      if (this.S.$c) {
        if (this.fe) {
          var b = this.Wc;
          b.W(b.Uc + 0.1);
          b = this.Ik;
          b.W(b.Uc - 0.1);
          b = this.Oa;
          b.W(b.Uc + 0.1);
        } else {
          b = this.Wc;
          b.W(b.Uc - 0.1);
          b = this.Ik;
          b.W(b.Uc + 0.1);
          b = this.Oa;
          b.W(b.Uc - 0.1);
        }
      }
      b = Math.sin(this.Ij * 3) * 3;
      if (this.Sl()) {
        b = 0;
      }
      let c = 0;
      let d = this.j.Mj();
      while (c < d) {
        this.j.nb(c++).setY(b);
      }
      this.sa.A = this.x + this.ea.A;
      this.sa.D = this.y + this.ea.D;
      this.sa.B = this.x + this.ea.B;
      this.sa.G = this.y + this.ea.G;
      if (this.timeout > 0 && this.S.di <= 0) {
        this.Fp.Fb(Keys.jj(Keys.BI, (1 - this.time / this.timeout) * 35 | 0));
        if (this.time > 0) {
          this.time = PathResolver.dk(this.time, 0, 1, a);
        }
      }
    }
    tg() {
      let a = this.ea;
      let b = this.ea;
      return new Vec2((a.B - a.A) * 0.9, (b.G - b.D) * 0.9);
    }
    Yq() {
      return 8;
    }
    M() {
      super.M();
      this.j.setX(this.x);
      this.j.setY(this.y);
      this.j.setUniformScale(this.Dj);
    }
  }
  Star.i = true;
  Star.s = MovingEntity;
  Object.assign(Star.prototype, {
    l: Star
  });

  class ThreeStarsCollect extends GameObject {
    constructor() {
      super();
      this.j = new Container();
      this.j.W(0.75);
      this.fc = [];
      this.ab = [];
      let a = 0;
      while (a < 4) {
        ++a;
        let b = new Sprite(null, Resources.Oa, "star_effect");
        b.center();
        b.Wd(3);
        b.L(false);
        this.ab.push(b);
        this.j.appendChild(b);
      }
      this.j.setUniformScale(0.4);
      this.BC = 0;
      SoundFx.play(SoundFx.magnet_idle, true);
      this.Hk = new AnimTimeline();
      this.Hk.vc(1, 0);
      this.Hk.vc(1, 0);
      this.Hk.vc(0, 2);
      this.Hk.La(0, 0);
      this.Hk.La(1, 1);
      this.Hk.La(0, 2);
      this.time = 1;
    }
    update(a) {
      this.time += a;
      if (this.BC < 4 && this.time > 0.5) {
        this.time = 0;
        var b = this.ab[this.BC++];
        b.L(true);
        new SpriteAnimator(b).loop(this.Hk);
      }
      for (b = 0; b < 4;) {
        let c = this.ab[b++];
        c.la(c.Zd + a * 90);
      }
    }
    M() {
      this.j.setX(this.x);
      this.j.setY(this.y);
    }
    free() {
      SoundFx.stop(SoundFx.magnet_idle);
      this.j.free();
    }
  }
  ThreeStarsCollect.i = true;
  ThreeStarsCollect.s = GameObject;
  Object.assign(ThreeStarsCollect.prototype, {
    l: ThreeStarsCollect
  });
  class Gap extends Entity {
    constructor(a, b) {
      super();
      this.S = a;
      this.ae = b;
      this.Xe = [];
      this.hm = [];
    }
    BO(a, b, c, d) {
      function e(g, h) {
        return new AnimFrameRef(new Vec2(g.x, g.y), h);
      }
      this.j = new Container();
      this.S.ma(5).P(this.j.u);
      this.qo = new Sprite(null, Resources.wf, Keys.jH);
      this.qo.setUniformScale(0.4);
      this.qo.center();
      this.S.ma(0).P(this.qo.u);
      this.x = a.x;
      this.y = a.y;
      this.pC = b;
      this.Z = c;
      this.JL = d;
      this.elapsedTime = 0;
      this.isActive = false;
      b = new Vec2(0, 0);
      a = this.pC * DEG2RAD;
      c = new Vec2(0, -27.200000000000003);
      d = new Vec2(0, -33.6);
      let f = new Vec2(0, -28);
      this.Xe[0] = Vec2.tb(b, new Vec2(0, -4.4).rotate(a));
      this.Xe[1] = Vec2.tb(b, c.rotate(a));
      this.Xe[2] = Vec2.tb(b, d.rotate(a));
      this.Xe[3] = Vec2.tb(b, f.rotate(a));
      c = new Vec2(0, -43.2);
      d = new Vec2(0, -9.200000000000001);
      this.hm[0] = Vec2.tb(b, new Vec2(0, -36.4).rotate(a));
      this.hm[1] = Vec2.tb(b, c.rotate(a));
      this.hm[2] = Vec2.tb(b, d.rotate(a));
      b = new Vec2(0, 0);
      d = new Vec2(0, 5.400000000000001);
      c = new Vec2(0, -4.799999999999997);
      d.rotate(a);
      c.rotate(a);
      a = Vec2.tb(b, d);
      b = Vec2.tb(b, c);
      if (v153 == null) {
        c = new AnimTimeline();
        c.setScale(0.4, 0.4, 0, 100);
        c.Ch(0, 0, 0, 100);
        c.setScale(0.45999999999999996, 0.34, 0.05);
        c.Ch(a.x, a.y, 0.05);
        c.setScale(0.34, 0.45999999999999996, 0.1);
        c.Ch(b.x, b.y, 0.1);
        c.setScale(0.4, 0.4, 0.15);
        c.Ch(0, 0, 0.15);
        v153 = c;
      }
      this.Jz = new AnimSequence([e(this.Xe[0], 0, 100), e(this.Xe[1], 0.05, 100), e(this.Xe[2], 0.1, 100), e(this.Xe[3], 0.15)], 1);
      this.SL = new AnimSequence([e(this.hm[0], 0, 100), e(this.hm[1], 0.05, 100), e(this.hm[2], 0.1, 100)], 1);
    }
    eC(a, b) {
      this.j.appendChild(a);
      this.xf = a;
      this.da = b;
      this.Zq().L(false);
      if (this.da != null) {
        this.da.g.x = this.x + this.Xe[3].x;
        this.da.g.y = this.y + this.Xe[3].y;
        this.da.ha.x = this.da.g.x;
        this.da.ha.y = this.da.g.y;
        this.su(this.Jz);
        this.Lj().pa().play(MOUSE_ANIM_B).Be(cachedBind(this, this.Tr));
      } else {
        this.Lj().pa().play(MOUSE_ANIM_A).Be(cachedBind(this, this.Tr));
      }
      a.center();
      SoundFx.play(SoundFx.mouse_rustle);
    }
    gC() {
      this.elapsedTime = 0;
      this.isActive = false;
      this.Zq().L(false);
      if (this.da != null) {
        this.Lj().pa().play(MOUSE_ANIM_D).Be(cachedBind(this, this.Tr));
        this.su(this.SL);
      } else {
        this.Lj().pa().play(MOUSE_ANIM_C).Be(cachedBind(this, this.Tr));
      }
    }
    Lj() {
      return this.xf.nb(0);
    }
    Zq() {
      return this.xf.nb(1);
    }
    su(a) {
      this.tq = new BezierMover(this, this.da);
      this.tq.play(a);
    }
    yu(a) {
      return Vec2.nd(this.x, this.y, a.g.x, a.g.y) < this.Z;
    }
    Du(a) {
      this.da = a;
      a.Vn = true;
      a.g.x = this.x + this.Xe[3].x;
      a.g.y = this.y + this.Xe[3].y;
      a.ha.x = a.g.x;
      a.ha.y = a.g.y;
      a.xd = new Vec2(0, 0);
      a.sb = new Vec2(0, 0);
      this.Lj().Fb(Keys.oH);
      this.Qo = new SpriteAnimator(this.Lj());
      this.Qo.play(v153);
      this.su(this.Jz);
    }
    kR() {
      this.da.Vn = false;
      this.da = null;
      this.gC();
      SoundFx.play(SoundFx.mouse_tap);
    }
    yi() {
      return this.da != null;
    }
    update(a) {
      super.update(a);
      if (this.tq != null) {
        this.tq.tickAnims(a);
      }
      if (this.isActive) {
        this.elapsedTime += a;
        if (this.elapsedTime >= this.JL && (this.Qo == null || !this.Qo.Dc())) {
          this.gC();
        }
      }
    }
    M() {
      super.M();
      this.j.setX(this.x);
      this.j.setY(this.y);
      this.qo.setX(this.x);
      this.qo.setY(this.y);
      if (this.xf != null) {
        this.xf.la(this.pC);
      }
    }
    jk(a, b) {
      a = Vec2.nd(this.x, this.y, a, b);
      b = this.Qo != null && this.Qo.Dc();
      if (a < this.Z) {
        return !b;
      } else {
        return false;
      }
    }
    Tr(a) {
      switch (a) {
        case MOUSE_ANIM_A:
          this.elapsedTime = 0;
          this.isActive = true;
          if (X.ym()) {
            this.Lj().Fb(Keys.mH);
            this.Zq().L(true);
            this.Zq().pa().play(EYES_ANIM);
          }
          break;
        case MOUSE_ANIM_B:
          this.elapsedTime = 0;
          this.isActive = true;
          break;
        case MOUSE_ANIM_C:
        case MOUSE_ANIM_D:
          this.xf.remove();
          this.xf = null;
          this.ae.tN();
      }
    }
  }
  Gap.i = true;
  Gap.s = Entity;
  Object.assign(Gap.prototype, {
    l: Gap
  });
  class LighterEntity extends AnchoredEntity {
    constructor(a, b) {
      super();
      this.cC = b;
      this.vg = 0;
      var c = CandyCutAnim.Sp.w / 2;
      let d = CandyCutAnim.Sp.J / 2;
      c = this.ea = new Bounds(0 - c, 0 - d, c, d);
      this.sa = new Bounds(c.A, c.D, c.B, c.G);
      this.j = new Container();
      this.j.setUniformScale(0.4);
      a.ma(9).P(this.j.u);
      this.qc = new Sprite(this.j, Resources.Ef, Keys.QH);
      this.qc.W(0.4);
      this.qc.center();
      this.qc.setUniformScale(b * 2 / this.qc.X.x * 1.5 / 0.4);
      this.qc.Wd(3);
      new Sprite(this.j, Resources.Ef, Keys.OH).center();
      new Sprite(this.j, Resources.Ef, Keys.RH).center();
      this.Xa = new Sprite(this.j, Resources.Ef);
      this.Xa.pa().loop(FIREFLY_ANIM);
      this.Xa.center();
      this.ca = null;
      this.Gn = new BubbleAnim(a);
      this.Gc = null;
    }
    update(a) {
      super.update(a);
      this.sa.A = this.x + this.ea.A;
      this.sa.D = this.y + this.ea.D;
      this.sa.B = this.x + this.ea.B;
      this.sa.G = this.y + this.ea.G;
    }
    M() {
      super.M();
      this.x = this.constraint.g.x;
      this.y = this.constraint.g.y;
      this.j.L(this.Gc == null);
      this.j.setX(this.x);
      this.j.setY(this.y);
      this.j.la(this.rotation);
      this.Gn.setX(this.x);
      this.Gn.setY(this.y);
    }
  }
  LighterEntity.i = true;
  LighterEntity.s = AnchoredEntity;
  Object.assign(LighterEntity.prototype, {
    l: LighterEntity
  });
  class Pump extends MovingEntity {
    constructor(a) {
      super();
      this.U = new Sprite(null, Resources.wm, Keys.SH);
      this.U.center();
      this.U.setUniformScale(0.4);
      a.ma(5).P(this.U.u);
      a = Pump.Vy.w / 2;
      let b = Pump.Vy.J / 2;
      this.ea = new Bounds(0 - a, 0 - b, a, b);
      this.angle = 0;
      this.Gb = Vec2.sc();
      this.Xb = Vec2.sc();
      this.VE = this.Gp = 0;
      this.Fq = [];
    }
    dN(a) {
      a = new DirectionalSpray(a, this.angle * RAD2DEG - 90);
      let b = new Vec2(this.x + 40, this.y);
      b.$a(this.angle - Math.PI / 2, this.x, this.y);
      a.x = b.x;
      a.y = b.y;
      a.Qm(5);
      this.Fq.push(a);
    }
    Hd() {
      var a = this.ea;
      a = (a.B - a.A) / 2;
      this.Gb.x = this.x - a;
      this.Xb.x = this.x + a;
      this.Gb.y = this.Xb.y = this.y;
      this.angle = this.rotation * DEG2RAD;
      this.Gb.$a(this.angle, this.x, this.y);
      this.Xb.$a(this.angle, this.x, this.y);
    }
    update(a) {
      super.update(a);
      this.pe();
      let b = 0;
      let c = this.Fq;
      while (b < c.length) {
        let d = c[b];
        ++b;
        if (d.ac.length == 0) {
          Std.remove(this.Fq, d);
          break;
        }
        d.update(a);
      }
    }
    M() {
      super.M();
      this.U.setX(this.x);
      this.U.setY(this.y);
      this.U.la(this.rotation);
      this.U.setUniformScale(this.Dj * 0.4);
      let a = 0;
      let b = this.Fq;
      while (a < b.length) {
        b[a++].M();
      }
    }
    tg() {
      let a = this.ea;
      let b = this.ea;
      return new Vec2((a.B - a.A) * 1.2, (b.G - b.D) * 1.2);
    }
    Kj() {
      let a = new Vec2(0.8, -1.2000000000000002);
      a.rotate(this.rotation * DEG2RAD);
      return Vec2.tb(new Vec2(this.x, this.y), a);
    }
    Jg(a) {
      super.Jg(a);
      let b = new Vec2(0.8, -1.2000000000000002);
      b.rotate(this.rotation * DEG2RAD);
      super.Jg(Vec2.Ia(a, b));
    }
  }
  Pump.i = true;
  Pump.s = MovingEntity;
  Object.assign(Pump.prototype, {
    l: Pump
  });
  class Vinyl extends Entity {
    constructor(a) {
      super();
      this.S = a;
      this.j = new Container();
      a.ma(0).P(this.j.u);
      this.kg = [];
      this.ah = [];
      this.xx = -1;
      this.Do = Vec2.UP();
      this.Tc = new Sprite(this.j, Resources.Tc, Keys.RI);
      this.Tc.center();
      this.Ts = new SceneGroup();
      this.Ts.Rf(new RingDrawEffect());
      this.j.node.P(this.Ts);
      this.xp = new SceneGroup();
      this.xp.Rf(new RingDrawEffect());
      a.ma(13).P(this.xp);
      this.mF = new Sprite(this.j, Resources.Tc, Keys.Sy);
      this.mF.center();
      this.Vx = new Sprite(this.j, Resources.Tc, Keys.Sy);
      this.Vx.setScaleX(-1);
      this.Vx.center();
      this.Ux = new Sprite(this.j, Resources.Tc, Keys.Ry);
      this.Ux.center();
      this.Qp = new Sprite(this.j, Resources.Tc, Keys.Ry);
      this.Qp.setScaleX(-1);
      this.Qp.center();
      this.ij = new Sprite(this.j, Resources.Tc, Keys.Py);
      this.ij.center();
      this.ij.la(90);
      this.wt = new Sprite(this.j, Resources.Tc, Keys.Py);
      this.wt.center();
      this.wt.la(-90);
      this.Pk = new Sprite(this.j, Resources.Tc, Keys.Qy);
      this.Pk.center();
      this.Pk.la(90);
      this.Pk.L(false);
      this.Qk = new Sprite(this.j, Resources.Tc, Keys.Qy);
      this.Qk.center();
      this.Qk.la(-90);
      this.Qk.L(false);
      this.lF = new Sprite(this.j, Resources.Tc, Keys.QI);
      this.lF.center();
    }
    free() {
      this.kg = this.ah = null;
      this.j.free();
      this.S = this.j = null;
    }
    Lb(a) {
      this.size = a;
      var b = this.size / 216;
      this.j.setUniformScale(0.4);
      this.Tc.setUniformScale(b);
      this.Ux.setUniformScale(b);
      this.Qp.setScaleX(-b);
      this.Qp.setScaleY(b);
      a = b >= 0.4 ? b : 0.4;
      this.mF.setUniformScale(a);
      this.Vx.setUniformScale(-a);
      b = b >= 0.75 ? b : 0.75;
      this.ij.setUniformScale(b);
      this.wt.setUniformScale(b);
      this.Pk.setUniformScale(b);
      this.Qk.setUniformScale(b);
      this.lF.setUniformScale(1 - (1 - a) * 0.5);
      this.Fh = this.size;
      a = this.Ts.effect;
      a.Z = this.Tc.getWidth() / 2;
      a.lineWidth = b * 10;
      a = this.size / this.j.Ra - this.ij.getWidth() / 2 * 0.76;
      this.ij.setX(this.Pk.setX(-a));
      this.wt.setX(this.Qk.setX(a));
    }
    nO() {
      return !this.ij.ri();
    }
    QR(a) {
      this.ij.L(!a);
    }
    KO() {
      return this.Pk.ri();
    }
    UD(a) {
      this.Pk.L(a);
    }
    RO() {
      return this.Qk.ri();
    }
    VD(a) {
      this.Qk.L(a);
    }
    uM() {
      let a = this.ah.length;
      let b;
      let c = 0;
      while (c < a) {
        b = this.ah[c++];
        if (b != this && this.vM(b)) {
          return true;
        }
      }
      return false;
    }
    M() {
      super.M();
      this.j.setX(this.x);
      this.j.setY(this.y);
      this.j.la(this.rotation);
      this.Ux.la(-this.rotation);
      this.Qp.la(-this.rotation);
      this.Ts.Ne = this.RO() || this.KO() ? 2 : 1;
      let a = this.ah.length;
      var b;
      let c = this.ah.indexOf(this);
      for (b = 0; b < a;) {
        this.ah[b++].xp.Ne = 1;
      }
      let d = 0;
      while (d < a) {
        b = this.ah[d++];
        if (b != this && b.uM() && this.ah.indexOf(b) < c) {
          b.VM(this.x, this.y, this.Fh, b.x, b.y, b.Fh);
        }
      }
    }
    VM(a, b, c, d, e, f) {
      this.xp.Ne = 1;
      let g = Vec2.nd(a, b, d, e);
      if (!(g >= c + f) && !(c >= g + f)) {
        new Vec2(a - d, b - e).angle();
        a = this.xp;
        a.Ne = 2;
        b = a.Db;
        b.translate.x = this.x;
        b.translate.y = this.y;
        b.K = b.K & -2 | 496;
        b = a.Db;
        b.scale.x = b.scale.y = this.j.Ra;
        b.K = b.K & -2 | 500;
        a = a.effect;
        a.Z = this.Tc.getWidth() / 2;
        a.Gr = 0.2;
        a.lineWidth = this.ij.Ra * 6;
      }
    }
    vM(a) {
      if (this.x == a.x && this.y == a.y && this.size == a.size) {
        return false;
      }
      let b = this.kg.length;
      let c = 0;
      while (c < b) {
        if (a.kg.indexOf(this.kg[c++]) >= 0) {
          return true;
        }
      }
      return false;
    }
  }
  Vinyl.i = true;
  Vinyl.s = Entity;
  Object.assign(Vinyl.prototype, {
    l: Vinyl
  });
  class Sock extends MovingEntity {
    constructor(a, b) {
      super();
      this.S = a;
      this.group = b;
      this.angle = 0;
      this.Gb = new Vec2(0, 0);
      this.Xb = new Vec2(0, 0);
      this.Vc = new Vec2(0, 0);
      this.qd = new Vec2(0, 0);
      this.state = this.xr = 0;
      this.j = new Container();
      a.ma(5).P(this.j.u);
      this.ur = new Sprite(this.j, Resources.Dk, b == 0 ? Keys.My : Keys.TH);
      this.ur.setUniformScale(0.4);
      this.ur.center();
      this.ur.setY(30);
      this.ur.la(this.angle);
      this.qc = new Sprite(this.j, Resources.Dk, Keys.UH);
      this.qc.setUniformScale(0.4);
      this.qc.center();
      this.qc.tS(new Vec4(this.qc.Rg, this.qc.Sg + 15, 0, 1));
      this.qc.L(false);
    }
    Hd() {
      this.Gb.x = this.x - Sock.Yy / 2;
      this.Xb.x = this.x + Sock.Yy / 2;
      this.Gb.y = this.Xb.y = this.y;
      this.Vc.x = this.Gb.x;
      this.qd.x = this.Xb.x;
      this.Vc.y = this.qd.y = this.y + Sock.wJ;
      this.angle = this.rotation * DEG2RAD;
      this.Gb.$a(this.angle, this.x, this.y);
      this.Xb.$a(this.angle, this.x, this.y);
      this.Vc.$a(this.angle, this.x, this.y);
      this.qd.$a(this.angle, this.x, this.y);
    }
    update(a) {
      super.update(a);
      if (this.pb != null) {
        this.Hd();
      }
    }
    M() {
      if (this.qc.ri()) {
        if (!this.qc.pa().Dc(v167)) {
          this.qc.L(false);
        }
      }
      super.M();
      this.j.setX(this.x);
      this.j.setY(this.y);
      this.j.setUniformScale(this.Dj);
      this.j.la(this.rotation);
    }
    tg() {
      let a = Resources.Dk.hc.yf(Keys.My).Od;
      return new Vec2(a.w * 0.27999999999999997, a.J * 0.27999999999999997);
    }
    Kj() {
      let a = new Vec2(-1.2000000000000002, 10);
      a.rotate(this.rotation * DEG2RAD);
      return Vec2.tb(new Vec2(this.x, this.y), a);
    }
    Jg(a) {
      let b = new Vec2(-1.2000000000000002, 10);
      b.rotate(this.rotation * DEG2RAD);
      super.Jg(Vec2.Ia(a, b));
    }
  }
  Sock.i = true;
  Sock.s = MovingEntity;
  Object.assign(Sock.prototype, {
    l: Sock
  });
  class SawBlade extends MovingEntity {
    constructor(a, b, c, d, e, f) {
      super();
      this.S = a;
      this.width = d;
      this.T = f != -1 ? new Sprite(null, Resources.gl, [Keys.OG, Keys.PG, Keys.QG, Keys.SG][d - 1]) : new Sprite(null, Resources.Dd, [Keys.YH, Keys.ZH, Keys.$H, Keys.aI][d - 1]);
      this.x = b;
      this.y = c;
      a.ma(5).P(this.T.u);
      this.T.setUniformScale(0.4);
      this.T.center();
      this.T.setX(b);
      this.T.setY(c);
      this.T.la(e);
      this.Gb = Vec2.sc();
      this.Xb = Vec2.sc();
      this.Vc = Vec2.sc();
      this.qd = Vec2.sc();
      this.ce = false;
      this.FC = this.TC = this.IB = 0;
      this.wl = false;
      this.tf = 0;
      if (f > 0) {
        this.Gg = new SawBladeButton(a, b, c, f);
        this.Gg.sw = cachedBind(this, this.Rr);
      }
      this.Us = false;
      this.wQ = this.rotation = e;
      this.oS(f);
      this.Hd();
      this.ht = -1;
      this.ws = null;
      this.vr = this.xB = 0;
    }
    Hd() {
      let a = this.ce ? this.width - 160 : this.T.X.x * 0.4;
      a /= 2;
      this.Gb.x = this.x - a;
      this.Xb.x = this.x + a;
      this.Gb.y = this.Xb.y = this.y - 5;
      this.Vc.x = this.Gb.x;
      this.qd.x = this.Xb.x;
      this.Vc.y = this.qd.y = this.y + 5;
      this.angle = this.rotation * DEG2RAD;
      this.Gb.$a(this.angle, this.x, this.y);
      this.Xb.$a(this.angle, this.x, this.y);
      this.Vc.$a(this.angle, this.x, this.y);
      this.qd.$a(this.angle, this.x, this.y);
    }
    dT() {
      this.wl = true;
      this.T.pa().loop(v170);
      this.tf = this.TC;
      SoundFx.play(SoundFx.electric, true);
      this.T.Jm();
    }
    bF() {
      this.wl = false;
      this.tf = this.FC;
      this.T.pa().stop();
      this.T.Uf(Resources.ce, Keys.iH);
      this.T.center();
      SoundFx.stop(SoundFx.electric);
    }
    update(a) {
      super.update(a);
      if (this.pb != null) {
        this.Hd();
      }
      if (this.ce) {
        if (this.wl) {
          this.tf = PathResolver.dk(this.tf, 0, 1, a);
          if (this.tf == 0) {
            this.bF();
          }
        } else {
          this.tf = PathResolver.dk(this.tf, 0, 1, a);
          if (this.tf == 0) {
            this.dT();
          }
        }
      }
      var b = this.Gg;
      if (b != null) {
        b.update(a);
      }
      if (this.ws != null) {
        this.Pw += a;
        b = Math.min(1, this.Pw / this.ws);
        let c = Easing.poly(100)(b);
        let d = this.yR;
        this.rotation = d + (this.zR - d) * c;
        this.Hd();
        if (b == 1) {
          this.ws = null;
        }
      }
      if (this.Md != null) {
        this.Md.update(a);
      }
      this.vr += a;
      if (this.vr > 1) {
        this.xB = this.vr = 0;
      }
    }
    oS(a) {
      this.TE = a;
    }
    BR() {
      this.Us = !this.Us;
      let a = this.wQ + (this.Us ? 90 : 0);
      this.Pw = 0;
      this.ws = Math.abs(a - this.rotation) / 90 * 0.3;
      this.yR = this.rotation;
      this.zR = a;
      this.Gg.U.setScaleX(-this.Gg.U.Ra);
    }
    DQ() {
      if (!this.ce) {
        this.Md = new AnimatedNineSlice(this.S, Vec2.nd(this.Gb.x, this.Gb.y, this.Xb.x, this.Xb.y), Vec2.nd(this.Gb.x, this.Gb.y, this.Vc.x, this.Vc.y) * 4, 3, true);
        this.Md.j.center();
        this.Md.j.la(this.rotation);
      }
    }
    JS() {
      if (this.Md != null) {
        this.Md.free();
        this.Md = null;
      }
    }
    Rr(a) {
      if (a == 0 && this.OC != null) {
        this.OC(this.TE);
      }
      if (this.Us) {
        SoundFx.play(SoundFx.spike_rotate_in);
      } else {
        SoundFx.play(SoundFx.spike_rotate_out);
      }
    }
    M() {
      super.M();
      this.T.setX(this.x);
      this.T.setY(this.y);
      this.T.la(this.rotation);
      if (this.Gg != null) {
        this.Gg.U.la(this.rotation);
      }
      if (this.Md != null) {
        this.Md.j.setX(this.x);
        this.Md.j.setY(this.y);
        this.Md.j.la(this.rotation);
      }
    }
  }
  SawBlade.i = true;
  SawBlade.s = MovingEntity;
  Object.assign(SawBlade.prototype, {
    l: SawBlade
  });
  class SteamGenerator extends MovingEntity {
    constructor(a) {
      super();
      this.S = a;
      this.wh = [];
    }
    AO(a, b, c) {
      this.x = a;
      this.y = b;
      this.rotation = c;
      this.uc = 0;
      this.ge = new HashMap();
      this.Ee = 0;
      this.j = new Container();
      this.S.ma(5).P(this.j.u);
      this.Jp = new Sprite(this.j, Resources.Kk, Keys.FI);
      this.Jp.center();
      this.Jp.setY(27);
      this.Jp.setUniformScale(0.4);
      this.Op = new Sprite(this.j, Resources.Kk, Keys.GI);
      this.Op.setUniformScale(0.4);
      this.Op.center();
      this.Op.setY(27);
      this.st = this.rt = 0;
      this.AE = new Container(null, this.j);
      this.BE = new Container(null, this.j);
      this.Hz();
    }
    VA() {
      let a = 0;
      switch (this.Ee) {
        case 0:
          a = 32.9;
          break;
        case 1:
          a = 94;
          break;
        case 2:
          a = 141;
      }
      return a * 1.2;
    }
    BN() {
      let a = this.VA();
      return a += Math.sin(this.uc * 6);
    }
    M() {
      super.M();
      this.j.setX(this.x);
      this.j.setY(this.y);
      this.j.la(this.rotation);
      this.Op.la(this.rt);
      this.j.setUniformScale(this.Dj);
    }
    update(a) {
      super.update(a);
      for (var b = 0, c = this.wh.length; b < c;) {
        if (this.wh[b].T == null) {
          --c;
          if (c > 0) {
            this.wh[b] = this.wh[this.wh.length - 1];
          }
          this.wh.pop();
        } else {
          ++b;
        }
      }
      b = 0;
      for (c = this.wh; b < c.length;) {
        c[b++].update(a);
      }
      this.uc += a;
      this.rt += (this.st - this.rt) * 0.05;
      if (this.Sl()) {
        for (b = this.ge.keys(); b.fb();) {
          c = b.next();
          let d = this.ge.J[c];
          d.bt += a;
          if (d.bt >= 0.5) {
            if (Vec2.nd(d.yr.x, d.yr.y, d.Sn.x, d.Sn.y) < 1) {
              this.ww();
            }
            this.ge.remove(c);
          }
        }
      }
    }
    aO() {
      let a = new Vec2(this.x, this.y);
      if (this.Sl()) {
        return a;
      }
      let b = new Vec2(0, 27);
      b.rotate(this.rotation * DEG2RAD);
      return Vec2.tb(a, b);
    }
    jk(a, b, c) {
      let d = this.aO();
      if (Vec2.Ia(new Vec2(a, b), d).Rb() < 30) {
        if (this.Sl()) {
          this.ge.J[c] = new Triple3(new Vec2(a, b), new Vec2(a, b), 0);
        } else {
          this.ww();
          return true;
        }
      }
      return false;
    }
    rQ(a, b, c) {
      if (this.ge.J.hasOwnProperty(c)) {
        this.ge.J[c].Sn = new Vec2(a, b);
      }
      return false;
    }
    tQ(a) {
      if (this.ge.J.hasOwnProperty(a)) {
        let b = this.ge.J[a];
        if (b.bt <= 0.5 && Vec2.nd(b.yr.x, b.yr.y, b.Sn.x, b.Sn.y) <= 1) {
          this.ww();
        }
        this.ge.remove(a);
      }
      return false;
    }
    ww() {
      let a = 0;
      switch (this.Ee) {
        case 0:
          this.Ee++;
          a = 0;
          SoundFx.play(SoundFx.steam_start_2);
          break;
        case 1:
          this.Ee++;
          a = 0;
          SoundFx.play(SoundFx.steam_start);
          break;
        case 2:
          this.Ee = 0;
          a = 1;
          SoundFx.play(SoundFx.steam_end);
      }
      this.Hz();
      switch (a) {
        case 0:
          this.st += 180;
          break;
        case 1:
          this.st = 0;
      }
    }
    Hz() {
      for (var a = this.uc = 0, b = this.wh; a < b.length;) {
        b[a++].iN();
      }
      if (this.Ee != 3) {
        a = 7;
        if (this.Ee == 1) {
          a = 14;
        }
        if (this.Ee == 2) {
          a = 20;
        }
        b = 0;
        for (var c = a; b < c;) {
          let e = b++;
          var d = null;
          switch (e % 3) {
            case 0:
              d = PARTICLE_1_ANIM;
              break;
            case 1:
              d = PARTICLE_2_ANIM;
              break;
            case 2:
              d = PARTICLE_3_ANIM;
          }
          let f = -this.VA();
          f *= 1 + X.Ac() * 0.1;
          if (this.Ee == 1 && (e % 3 == 1 || e % 3 == 2)) {
            f *= 0.95;
          }
          if (this.Ee == 2 && (e % 3 == 1 || e % 3 == 2)) {
            f *= 0.94;
          }
          let g = 1;
          if (e % 3 == 0) {
            g = 0;
          } else if (e % 3 == 1) {
            g = this.Ee;
          } else if (e % 3 == 2) {
            g = -this.Ee;
          }
          let h = new AnimTimeline();
          h.Ch(5, 0, 0, 100);
          h.Ch(5 + g, f, 0.6);
          h.vc(0.4, 0);
          h.vc(0.6000000000000001, 0.6);
          d = new SteamPuff(e * 0.6 / a, d, h);
          this.wh.push(d);
          (e % 3 == 0 ? this.AE : this.BE).appendChild(d.T);
        }
      }
    }
    Jg(a) {
      this.Jp.setY(3);
      this.Op.setY(3);
      this.AE.setY(-27);
      this.BE.setY(-27);
      super.Jg(a);
    }
    Yq() {
      return this.Jp.getWidth() * 0.3;
    }
    tg() {
      return new Vec2(40, 56);
    }
  }
  SteamGenerator.i = true;
  SteamGenerator.s = MovingEntity;
  Object.assign(SteamGenerator.prototype, {
    l: SteamGenerator
  });
  class Transporter extends Entity {
    constructor(a, b, c) {
      super();
      this.width = a;
      this.height = b;
      new Vec2(0, 0);
      this.j = new Container();
      this.je = [];
      this.offset = 0;
      this.$r = Resources.Rc.hc.yf(DIGIT_FRAME_4).ec.x;
      switch (c) {
        case -1:
          a = DIGIT_FRAME_6;
          break;
        case 1:
          a = DIGIT_FRAME_5;
          break;
        default:
          a = DIGIT_FRAME_4;
      }
      this.xw = a;
    }
    M() {
      super.M();
      var a = this.$r * 0.4;
      if (this.je[0] == null) {
        this.je[0] = new Sprite(this.j, Resources.Rc, this.xw);
      }
      this.je[0].L(true);
      var b = 1;
      var c = this.je[0];
      var d = Math.max(this.offset - (this.offset / a | 0) * a, 0);
      c.setX(0);
      c.setScaleX(d / this.$r);
      for (c.setScaleY(this.height / c.X.y); d + a <= this.width;) {
        if (this.je[b] == null) {
          this.je[b] = new Sprite(this.j, Resources.Rc, this.xw);
        }
        this.je[b].L(true);
        c = this.je[b++];
        c.setScaleX(0.4);
        c.setScaleY(this.height / c.X.y);
        c.setX(d);
        d += c.getWidth();
      }
      a = this.width - d;
      if (this.je[b] == null) {
        this.je[b] = new Sprite(this.j, Resources.Rc, this.xw);
      }
      this.je[b].L(true);
      c = this.je[b++];
      c.setX(this.width - a);
      c.setScaleX(a / this.$r);
      c.setScaleY(this.height / c.X.y);
      for (c = this.je.length; b < c;) {
        this.je[b++].L(false);
      }
    }
    move(a) {
      this.offset += a;
      for (a = this.$r * 0.4; this.offset > this.width;) {
        this.offset -= a;
      }
      while (this.offset < 0) {
        this.offset += a;
      }
    }
  }
  Transporter.i = true;
  Transporter.s = Entity;
  Object.assign(Transporter.prototype, {
    l: Transporter
  });
  class TutText extends TimedFader {
    constructor(a) {
      a = new Sprite(null, Resources.eT, Keys.jj(Keys.lK, a));
      a.setUniformScale(0.4);
      super(a);
      this.zi = 0;
    }
    Ji(a) {
      this.rotation = a.angle ?? 0;
      let b = a.path;
      let c = LevelController.mn;
      if (b != null) {
        let d = PathResolver.Ey;
        if (b.charAt(0) == "R") {
          d = Math.round(Numeric.parseInt(Std.substr(b, 2, null)) * 3 / 2 + 1);
        }
        a = new PathState(d, a.moveSpeed * c, a.rotateSpeed);
        a.angle = this.rotation;
        a.$D(b, this.x, this.y);
        this.YD(a);
        a.start();
      }
    }
    update(a) {
      if (this.Cd == 2) {
        this.time += a;
        switch (this.state) {
          case 1:
            a = Math.min(this.time / 1, 1);
            this.T.W(a);
            if (a == 1) {
              this.Ie = this.x;
              this.setState(2);
            }
            break;
          case 2:
            a = Math.min(this.time / 1, 1);
            this.x = this.Ie + (this.Ie + (LevelController.kK + 40) * WorldScale.scale) * a;
            if (a == 1) {
              this.setState(3);
            }
            break;
          case 3:
            a = Math.min(this.time / 0.5, 1);
            this.T.W(1 - a);
            if (a == 1) {
              if (++this.zi == 2) {
                this.T.L(false);
                this.setState(0);
              } else {
                this.x = this.Ie;
                this.setState(1);
              }
            }
        }
      } else {
        if (this.pb != null) {
          this.pb.update(a);
          this.x = this.pb.g.x;
          this.y = this.pb.g.y;
          this.rotation = this.pb.angle;
        }
        super.update(a);
      }
    }
  }
  TutText.i = true;
  TutText.s = TimedFader;
  Object.assign(TutText.prototype, {
    l: TutText
  });

  class Bouncer extends MovingEntity {
    constructor(a, b, c, d, e) {
      super();
      this.angle = 0;
      this.Gb = Vec2.sc();
      this.Xb = Vec2.sc();
      this.Vc = Vec2.sc();
      this.qd = Vec2.sc();
      this.ct = -1;
      this.xo = new Vec2(0, 0);
      this.Ck = false;
      this.j = new Container();
      a.ma(5).P(this.j.u);
      this.T = new Sprite(this.j);
      this.T.Uf(Resources.fd, d == 1 ? Keys.TG : Keys.VG);
      this.T.setUniformScale(0.4);
      this.T.center();
      this.rotation = e;
      this.x = b;
      this.y = c;
      this.w = d;
      this.es = new Vec2(b, c);
      a = (d == 1 ? 194 : 302) * 0.4 / 2;
      d = (d == 1 ? 127 : 123) * 0.4 / 2;
      d = this.ea = new Bounds(0 - a, 0 - d, a, d);
      this.sa = new Bounds(d.A, d.D, d.B, d.G);
      this.Hd();
    }
    oA() {
      this.es.x = this.x;
      this.es.y = this.y;
    }
    BQ() {
      let a = this.w == 1 ? X1_ANIM : X2_ANIM;
      this.T.pa().play(a);
    }
    Hd() {
      var a = this.ea;
      a = a.B - a.A;
      this.Gb.x = this.x - a / 2;
      this.Xb.x = this.x + a / 2;
      this.Gb.y = this.Xb.y = this.y - vLN10 / 2;
      this.Vc.x = this.Gb.x;
      this.qd.x = this.Xb.x;
      this.Vc.y = this.qd.y = this.y + vLN10 / 2;
      this.angle = this.rotation * DEG2RAD;
      this.Gb.$a(this.angle, this.x, this.y);
      this.Xb.$a(this.angle, this.x, this.y);
      this.Vc.$a(this.angle, this.x, this.y);
      this.qd.$a(this.angle, this.x, this.y);
    }
    update(a) {
      super.update(a);
      if (this.pb != null) {
        this.Hd();
      }
    }
    M() {
      super.M();
      this.j.setX(this.x);
      this.j.setY(this.y);
      this.T.setUniformScale(this.Dj * 0.4);
      this.j.la(this.rotation);
    }
    tg() {
      let a = this.ea;
      let b = this.ea;
      return new Vec2(a.B - a.A, b.G - b.D);
    }
    Jg(a) {
      let b = new Vec2(this.x, this.y);
      if (!(Vec2.Ia(a, b).io() < 0.000001)) {
        if (this.ct >= 0.001 && this.ct <= 0.1) {
          this.xo = Vec2.bq(Vec2.Ia(a, b), this.ct);
          if (this.xo.io() > 40000) {
            this.xo = Vec2.Ob(Vec2.cq(this.xo), 200);
          }
        } else {
          this.xo = new Vec2(0, 0);
        }
        this.ct = 0;
        this.es = b.Zb();
        this.x = a.x;
        this.y = a.y;
        this.Hd();
      }
    }
    NC() {
      this.oA();
    }
  }
  Bouncer.i = true;
  Bouncer.s = MovingEntity;
  Object.assign(Bouncer.prototype, {
    l: Bouncer
  });
  class Spider extends Node {
    constructor() {
      super();
      this.U = new Sprite(null, Resources.mc, Keys.VH);
      this.U.setUniformScale(0.4);
      this.U.center();
      this.cl = this.Ym = this.by = this.xu = this.state = 0;
    }
    dispose() {
      super.dispose();
      this.U.free();
    }
    start() {
      let a = this;
      this.U.pa().play(v168).Be(function () {
        a.U.pa().play(v169);
        a.state = 1;
      });
    }
    bM() {
      this.xu = 1;
      this.y = this.U.getY();
      this.U.pa().stop();
      this.U.Fb(Keys.WH);
      this.cl = X.BA(3);
      this.time = 0;
    }
    cc() {
      this.by = 1;
      this.y = this.U.getY();
      this.U.pa().stop();
      this.U.Fb(Keys.XH);
      this.U.la(0);
      this.time = 0;
    }
    update(a) {
      super.update(a);
      a = this.parent;
      switch (this.xu) {
        case 1:
          var b = this.jb(0.5);
          this.U.setY(this.y - Easing.poly(100)(b) * 50);
          let c = this.U;
          c.la(c.Zd + this.cl);
          if (b == 1) {
            this.xu++;
            this.time = 0;
          }
          break;
        case 2:
          b = this.U;
          b.setY(b.getY() + this.Ym);
          b = this.U;
          b.la(b.Zd + this.cl);
          this.Ym += 0.4;
          if (this.time > 1.5) {
            b = this.U;
            b.W(b.Uc * 0.9);
          }
          if (this.time > 2) {
            this.dispose();
          }
      }
      switch (this.by) {
        case 1:
          b = this.jb(0.5);
          this.U.setY(this.y - Easing.poly(100)(b) * 50);
          a.I.x = this.U.getX();
          a.I.y = this.U.getY() - 15;
          a.I.M();
          if (b == 1) {
            this.by++;
            this.time = 0;
          }
          break;
        case 2:
          a = this.U;
          a.setY(a.getY() + this.Ym);
          this.Ym += 0.4;
          a = this.parent;
          a.I.x = this.U.getX();
          a.I.y = this.U.getY() - 15;
          a.I.M();
          if (this.time > 1.5) {
            a = this.U;
            a.W(a.Uc * 0.9);
          }
          if (this.time > 2) {
            this.dispose();
          }
      }
    }
  }
  Spider.i = true;
  Spider.s = Node;
  Object.assign(Spider.prototype, {
    l: Spider
  });

  class BouncerFace extends Bouncer {
    constructor(a, b, c, d, e) {
      super(a.S, b, c, d, e);
      this.de = a;
      this.alpha = 1;
      this.state = 0;
    }
    Io() {
      if (this.state != 1) {
        this.state = 1;
        this.time = 0;
      }
    }
    Jo() {
      if (this.state != -1) {
        this.state = -1;
        this.time = 0;
      }
    }
    Pl() {
      return this.state < 0;
    }
    mu() {
      function a(c, d) {
        c = new Sprite(d, Resources.de, Keys.jj(Keys.Wp, c));
        c.center();
        return c;
      }
      this.Hu = new Container(null, this.j);
      this.Hu.Es();
      this.pA = new Container(null, this.j);
      this.fc = [];
      if (BouncerFace.An == null) {
        BouncerFace.An = AnimTimeline.parse("0,s.27<x-34.<y7.33<,.35,s.22>x-35.>y6.33>,.7,s.16<x-36.<y5.33<,1.04,s.22>x-35.>y6.33>,1.4,s.27x-34.y7.33");
      }
      var b = new SpriteAnimator(a(2, this.Hu));
      b.loop(BouncerFace.An);
      this.fc.push(b);
      if (BouncerFace.zn == null) {
        BouncerFace.zn = AnimTimeline.parse("0,s.36<x32.9<y6.61<,.39,s.32>x31.9>y5.61>,.78,s.27<x30.9<y4.61<,1.17,s.32>x31.9>y5.61>,1.56,s.36x32.9y6.61");
      }
      b = new SpriteAnimator(a(2, this.Hu));
      b.loop(BouncerFace.zn);
      this.fc.push(b);
      if (BouncerFace.Xh == null) {
        BouncerFace.Xh = AnimTimeline.parse("0,s.44<x23<y26<,.45,s.4>x22>y25>,.9,s.36<x21<y24<,1.35,s.4>x22>y25>,1.8,s.44x23y26");
      }
      b = new SpriteAnimator(a(3, this.pA));
      b.loop(BouncerFace.Xh);
      this.fc.push(b);
      if (BouncerFace.Wh == null) {
        BouncerFace.Wh = AnimTimeline.parse("0,s.44<x-23<y28<,.5,s.4>x-22>y27>,1,s.36<x-21<y26<,1.5,s.4>x-22>y27>,2,s.44x-23y28");
      }
      b = new SpriteAnimator(a(4, this.pA));
      b.loop(BouncerFace.Wh);
      this.fc.push(b);
    }
    free() {
      this.j.free();
      this.T = this.j = null;
    }
    update(a) {
      super.update(a);
      if (this.state > 0) {
        this.time += a;
        let b = Math.min(1, this.time / 0.36);
        this.alpha = b;
        if (b == 1) {
          this.state = 0;
        }
      }
      if (this.state < 0) {
        this.time += a;
        a = Math.min(1, this.time / 0.16);
        this.alpha = 1 - a;
        if (a == 1) {
          this.state = 0;
          this.de.tD();
        }
      }
    }
    M() {
      super.M();
      this.j.W(this.alpha);
    }
  }
  BouncerFace.i = true;
  BouncerFace.s = Bouncer;
  Object.assign(BouncerFace.prototype, {
    l: BouncerFace
  });
  class ToggleButton extends TouchableEntity {
    constructor(a, b, c) {
      super();
      this.x = b;
      this.y = c;
      this.U = new Sprite(null, Resources.Kb, Keys.Ky);
      this.U.setUniformScale(0.4);
      this.U.center();
      this.U.setX(b);
      this.U.setY(c);
      this.Z = 40;
      a.ma(5).P(this.U.u);
      this.Sv = false;
    }
    Ql(a, b) {
      return PointInCircle.Cx(a, b, this.x, this.y, this.Z);
    }
    toggle() {
      this.Sv = !this.Sv;
      this.U.Fb(this.Sv ? Keys.rH : Keys.Ky);
    }
    M() {
      super.M();
      this.U.setX(this.x);
      this.U.setY(this.y);
    }
  }
  ToggleButton.i = true;
  ToggleButton.s = TouchableEntity;
  Object.assign(ToggleButton.prototype, {
    l: ToggleButton
  });

  class LanternEye extends MovingEntity {
    constructor(a) {
      super();
      this.S = a;
      this.active = false;
      this.lp = this.Jn = this.gp = this.ao = 0;
      this.Yu = null;
    }
    zO(a, b) {
      LanternEye.Eh = null;
      this.x = a;
      this.y = b;
      this.Xj = 0;
      if (v159 == null) {
        a = v159 = new AnimTimeline();
        a.setScale(0.5599999999999999, 0.4, 0, 100);
        a.La(0.7, 0);
        a.setScale(0.42000000000000004, 0.52, 0.5);
        a.La(1, 0.5);
      }
      this.j = new Container();
      this.S.ma(5).P(this.j.u);
      this.Gj = new Sprite(this.j, Resources.Ai, Keys.GH);
      this.Gj.center();
      this.Gj.W(0);
      this.Yu = new SpriteAnimator(this.Gj);
      this.wr = new Sprite(this.j, Resources.Ai, Keys.IH);
      this.wr.center();
      this.wr.setUniformScale(0.4);
      this.Zk = new Sprite(this.j, Resources.Ai, Keys.HH);
      this.Zk.center();
      this.Zk.setUniformScale(0.4);
      this.Zk.W(0);
      this.Zk.setY(1);
      this.I = new Sprite(this.j, Resources.Ai, [Keys.JH, Keys.KH, Keys.LH, Keys.MH, Keys.NH][Save.me]);
      this.I.center();
      this.I.setUniformScale(0.4);
      this.I.W(0);
      if (v160 == null) {
        a = v160 = new AnimTimeline();
        a.La(0, 0);
        a.La(1, 0.2);
        a.gq(0.4, 0.4, 0);
        a.gq(0.4, 0.32000000000000006, 0.07);
        a.gq(0.34, 0.42000000000000004, 0.05);
        a.gq(0.4, 0.4, 0.05);
        a.lu(-4, 0);
        a.lu(0, 0.1);
        a.lu(-1, 0.05);
        a = v161 = new AnimTimeline();
        a.tn(0.4, 0.35, -100);
        a.tn(0.37200000000000005, 0.35, 100);
        a.tn(0.34800000000000003, 0.35, -100);
        a.tn(0.37200000000000005, 0.35, 100);
        a.tn(0.4, 0);
        a = v162 = new AnimTimeline();
        a.La(1, 0);
        a.La(0.6, 0.06);
        a.La(0, 0.1);
        a.setScale(0.4, 0.4, 0);
        a.setScale(0.45999999999999996, 0.32000000000000006, 0.06);
        a.setScale(0.4, 0.4, 0.1);
        a.Ch(0, 0, 0, 100);
        a.Ch(0, -4, 0.06, -100);
        a.Ch(0, 4, 0.1);
      }
      this.Au = new SpriteAnimator(this.I);
    }
    update(a) {
      this.ha = new Vec2(this.x, this.y);
      super.update(a);
      if (LanternEye.Eh != null) {
        LanternEye.Eh.g = new Vec2(this.x, this.y);
        LanternEye.Eh.ha = new Vec2(this.x, this.y);
        if (this.Xj != 1) {
          this.Xj = 1;
        }
      }
      if (this.gp > 0) {
        this.gp -= a;
        if (this.gp < 0) {
          LanternEye.Eh.Vn = false;
          LanternEye.Eh.g = new Vec2(this.x, this.y);
          LanternEye.Eh.ha = this.ha.Zb();
          LanternEye.Eh = null;
        }
      }
      if (this.ao > 0) {
        this.ao -= a;
        if (this.ao <= 0) {
          this.Yu.loop(v159, true);
        }
      }
      if (this.Jn > 0) {
        this.Jn -= a;
        if (this.Jn <= 0) {
          this.Au.loop(v161);
        }
      }
      if (this.lp > 0) {
        this.lp -= a;
        if (this.lp <= 0) {
          this.Xj = 0;
        }
      }
    }
    M() {
      super.M();
      this.j.setX(this.x);
      this.j.setY(this.y);
    }
    jk(a, b) {
      if (this.Xj == 1 && Vec2.nd(a, b, this.x, this.y) < 35 && LanternEye.Eh != null) {
        this.DO();
        return true;
      } else {
        return false;
      }
    }
    jA(a) {
      SoundFx.play(SoundFx.lantern_teleport_in);
      LanternEye.Eh = a;
      a.Vn = true;
      a.g = a.ha = new Vec2(this.x, this.y);
      a = this.S.Ul;
      let b = 0;
      while (b < a.length) {
        let c = a[b];
        ++b;
        c.Xj = 1;
        c.wr.tween().alpha(0, 0.3);
        c.Zk.tween().alpha(1, 0.3);
        c.Au.play(v160);
        c.Gj.setScaleX(0.5599999999999999);
        c.Gj.setScaleY(0.4);
        c.Gj.W(0.7);
        c.ao = Math.random() * 0.4;
        c.Jn = 0.2;
      }
    }
    DO() {
      SoundFx.play(SoundFx.lantern_teleport_out);
      let a = this.S.Ul;
      let b = 0;
      while (b < a.length) {
        let c = a[b];
        ++b;
        c.wr.tween().alpha(1, 0.3);
        c.Zk.tween().alpha(0, 0.3);
        c.Au.play(v162);
        c.Yu.stop();
        c.Gj.W(0);
        c.lp = 0.5;
        c.Xj = 0;
      }
      this.gp = 0.01;
    }
  }
  LanternEye.i = true;
  LanternEye.s = MovingEntity;
  Object.assign(LanternEye.prototype, {
    l: LanternEye
  });
  class SawBladeButton extends TouchableEntity {
    constructor(a, b, c, d) {
      super();
      this.x = b;
      this.y = c;
      this.OE = d;
      this.U = new Sprite(null, Resources.gl, this.YA());
      this.U.setUniformScale(0.4);
      this.U.center();
      this.U.setX(b);
      this.U.setY(c);
      this.Z = 20;
      a.ma(5).P(this.U.u);
    }
    Ak(a) {
      super.Ak(a);
      this.U.Fb(this.YA());
    }
    YA() {
      if (this.state == 0) {
        if (this.OE == 1) {
          return Keys.KG;
        } else {
          return Keys.MG;
        }
      } else if (this.OE == 1) {
        return Keys.LG;
      } else {
        return Keys.NG;
      }
    }
    Ql(a, b) {
      return PointInCircle.Cx(a, b, this.x, this.y, this.Z);
    }
  }
  SawBladeButton.i = true;
  SawBladeButton.s = TouchableEntity;
  Object.assign(SawBladeButton.prototype, {
    l: SawBladeButton
  });
  class ConveyorBelt extends Entity {
    constructor(a) {
      super();
      this.S = a;
      this.kF = 10;
      this.offset = 0;
      this.id = -1;
      this.ze = false;
      this.Pr = this.ys = this.Pe = 0;
      this.dir = new Vec2(0, 0);
      this.active = false;
      this.jm = -1;
      this.ha = new Vec2(0, 0);
      this.Hp = null;
      this.$d = new OrderedMap();
      this.pq = [];
      this.node = new Container();
      a.ma(4).P(this.node.u);
      this.j = new Container();
      this.node.appendChild(this.j);
    }
    update(a) {
      super.update(a);
      if (!this.ze) {
        this.Pe = a * this.kF * 10;
        this.offset += this.Pe;
        this.offset = this.$v(this.offset, this.width);
      }
      this.active = Math.abs(this.Pe) > 0.001;
      if (this.ze && this.active) {
        this.Pr += Math.abs(this.Pe);
        if (this.Pr >= 15) {
          this.OQ();
          this.Pr = 0;
        }
      }
      this.hN();
      let b = null;
      let c = null;
      var d = this.$d;
      for (var e = d.keys(); e.fb();) {
        var f = e.next();
        var g = d.get(f);
        if (g.Jj) {
          continue;
        }
        let A = g.offset + this.Pe;
        let D = true;
        if (A >= this.width) {
          A -= this.width;
        } else if (A <= 0) {
          A += this.width;
        } else {
          D = false;
        }
        var h = f.tg();
        var m = f.Kj();
        var n = new Vec2(h.x * this.dir.x, h.y * this.dir.y).Rb() / 2;
        var q = 1;
        var p = A;
        if (A < n) {
          q = 0.5 + A * 0.5 / n;
          b = f;
          p = n * q;
        } else if (this.width - A < n) {
          q = 0.5 + (this.width - A) * 0.5 / n;
          c = f;
          p = this.width - n * q;
        }
        n = this.$d;
        let B = n.keys();
        while (B.fb()) {
          var v = B.next();
          var u = n.get(v);
          if (v != f && !u.Jj && q == 1) {
            u = u.offset - g.offset;
            if (Vec2.tb(h, v.tg()).io() * 0.25 > u * u) {
              if (Math.abs(u) < 0.001) {
                v = this.pq.indexOf(v) - this.pq.indexOf(v);
                u = (v > 0 ? 1 : v < 0 ? -1 : 0) * 600;
              } else if (Math.abs(u) < 600) {
                u = (u > 0 ? 1 : u < 0 ? -1 : 0) * 600;
              }
              A -= u * a;
            }
          }
        }
        f.NR(new Vec2(q, q));
        h = new Vec2(this.x + this.dir.x * p - m.x, this.y + this.dir.y * p - m.y);
        if (g.kA) {
          p = new Vec2(this.dir.y, -this.dir.x);
          m = Vec2.yz(h, p) / this.dir.Rb();
          p = new Vec2(p.x * m, p.y * m);
          m = a * 800;
          if (p.io() >= m * m) {
            q = p.Rb();
            p.multiply((q - m) / q);
          } else {
            g.kA = false;
          }
          h.Ax(p);
          f.Jg(Vec2.tb(f.Kj(), h));
        } else {
          f.Jg(Vec2.tb(new Vec2(this.x, this.y), Vec2.Ob(this.dir, p)));
        }
        g.tC = A;
        if (D) {
          f.NC();
          SoundFx.play(SoundFx.transporter_drop);
        }
      }
      this.Hp.move(this.Pe);
      for (d = this.$d.iterator(); d.fb();) {
        e = d.next();
        e.offset = this.$v(e.tC, this.width);
      }
      if (this.ze) {
        this.Pe = 0;
      }
      if (this.jm == -1) {
        if (b != null && c != null) {
          d = this.$d;
          e = d.keys();
          while (e.fb()) {
            f = e.next();
            g = d.get(f);
            if (!g.Jj) {
              if (f == b) {
                g.offset += a * 1500;
              }
              if (f == c) {
                g.offset -= a * 1500;
              }
            }
          }
        } else if (b != null) {
          this.Pe = a * 1500;
        } else if (c != null) {
          this.Pe = a * -1500;
        }
      }
    }
    M() {
      this.j.setX(this.x);
      this.j.setY(this.y);
      this.j.setPivot(0, this.height / 2);
      this.j.setOrigin(0, this.height / 2);
      this.j.la(this.rotation);
      this.Hp.M();
    }
    gt(a, b, c) {
      let d = false;
      if (!this.ze) {
        return false;
      }
      a = this.ut(new Vec2(a, b));
      if (a.x >= 0 && a.x <= this.width && -this.height * 0.5 <= a.y && a.y <= this.height * 0.5) {
        this.jm = c;
        this.ha.Pb(a);
        d = true;
      }
      return d;
    }
    Mx(a, b, c) {
      a = false;
      if (!this.ze) {
        return false;
      }
      if (this.jm == c) {
        this.jm = -1;
        this.Pe = 0;
        for (c = this.$d.keys(); c.fb();) {
          a = c.next();
          if (this.$d.J[a.jf].Jj) {
            this.$d.remove(a);
          }
        }
        a = true;
      }
      return a;
    }
    Lx(a, b, c) {
      let d = false;
      if (this.S.jr != -1 || !Application.instance.hd().zo(0) || !this.ze) {
        return false;
      }
      if (this.jm == c) {
        a = this.ut(new Vec2(a, b));
        this.Pe = a.x - this.ha.x;
        this.offset += this.Pe;
        this.offset = this.$v(this.offset, this.width);
        this.ha.Pb(a);
        d = true;
      }
      return d;
    }
    contains(a) {
      a = this.ut(a);
      if (a.x >= 0 && a.x <= this.width && -this.height * 0.5 <= a.y) {
        return a.y <= this.height * 0.5;
      } else {
        return false;
      }
    }
    ut(a) {
      var b = this.ys - Math.PI * 0.5;
      let c = new Vec2(this.dir.x, this.dir.y);
      b = new Vec2(Math.cos(b), Math.sin(b));
      return new Vec2(c.x * (a.x - this.x) + c.y * (a.y - this.y), b.x * (a.x - this.x) + b.y * (a.y - this.y));
    }
    pM(a, b) {
      a = this.ut(a);
      return !(a.x < -b) && !(a.x > this.width + b) && !(a.y < -this.height * 0.5 - b) && !(a.y > this.height * 0.5 + b);
    }
    bind(a) {
      this.XL(a);
    }
    gT(a) {
      let b = this.$d;
      let c = b.keys();
      while (c.fb()) {
        let d = c.next();
        let e = b.get(d);
        if (d == a) {
          e.Jj = true;
          d.lx(-1);
          break;
        }
      }
      a.lx(-1);
    }
    Mv(a) {
      return this.$d.J.Wk[a.jf] != null;
    }
    remove(a) {
      this.$d.remove(a);
    }
    GO(a) {
      a = this.$d.J[a.jf];
      if (a != null) {
        return a.Jj;
      } else {
        return false;
      }
    }
    isActive() {
      return this.active;
    }
    $v(a, b) {
      let c = b - 0;
      if (a > b) {
        a -= c;
      }
      if (a < 0) {
        a += c;
      }
      return a;
    }
    XL(a) {
      var b = a.Kj();
      b = new Vec2(b.x - this.x, b.y - this.y);
      this.$d.set(a, new ConveyorItem(Math.max(Math.min(b.x * this.dir.x + b.y * this.dir.y, this.width), 0)));
      this.pq.push(a);
      a.lx(this.id);
    }
    xO(a, b, c, d, e, f, g, h) {
      this.jm = -1;
      this.id = a;
      this.x = b;
      this.y = c;
      this.width = d;
      this.height = e;
      this.rotation = f;
      this.ze = g;
      this.ys = f * DEG2RAD;
      this.dir = new Vec2(Math.cos(this.ys), Math.sin(this.ys));
      this.kF = h;
      this.node = new Container();
      a = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_2);
      a.setScaleX(d / a.X.x);
      a.setScaleY((e - 10) / a.getHeight());
      a = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_0);
      a.setScaleX(0.4);
      a.setScaleY((e - 10) / a.getHeight());
      a.setX(-6);
      a.setY(5);
      a = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_0);
      a.setScaleX(0.4);
      a.setScaleY((e - 10) / a.getHeight());
      a.setX(d - a.getWidth() + 6);
      a.setY(5);
      a = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_3);
      a.setScaleX(d / a.getWidth());
      a.setScaleY(-0.4);
      a.setY(a.getHeight());
      a = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_3);
      a.setScaleX(d / a.getWidth());
      a.setScaleY(0.4);
      a.setY(e - a.getHeight());
      a = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_1);
      a.setUniformScale(0.4);
      a.setX(-6);
      a.setY(e - a.getHeight());
      a = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_1);
      a.setScaleX(0.4);
      a.setScaleY(-0.4);
      a.setX(-6);
      a.setY(a.getHeight());
      a = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_1);
      a.setUniformScale(-0.4);
      a.setX(d + 6);
      a.setY(a.getHeight());
      a = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_1);
      a.setScaleX(-0.4);
      a.setScaleY(0.4);
      a.setX(d + 6);
      a.setY(e - a.getHeight());
      a = 0;
      if (!g) {
        a = h > 0 ? 1 : -1;
      }
      this.Hp = new Transporter(d - 2, e - 10, a);
      this.Hp.j.setY(5);
      this.j.appendChild(this.Hp.j);
      g = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_7);
      g.setScaleX(0.4);
      g.setScaleY((e - 10) / g.X.y);
      g.setY(5);
      g = new Sprite(this.j, Resources.Rc, DIGIT_FRAME_7);
      g.setScaleX(-0.4);
      g.setScaleY((e - 10) / g.X.y);
      g.setX(d);
      g.setY(5);
    }
    hN() {
      let a = [];
      var b = this.$d;
      for (var c = b.keys(); c.fb();) {
        let d = c.next();
        if (b.get(d).Jj && !this.contains(d.Kj())) {
          a.push(d);
        }
      }
      for (b = 0; b < a.length;) {
        c = a[b];
        ++b;
        this.$d.remove(c);
        Std.remove(this.pq, c);
      }
    }
    OQ() {
      SoundFx.play([1057, 1056, 1055, 1054][X.xh(0, 3)]);
    }
    static create(a, b, c, d, e, f, g, h, m) {
      a = new ConveyorBelt(a);
      a.xO(b, c, d, e, f, g, h, m);
      return a;
    }
  }
  ConveyorBelt.i = true;
  ConveyorBelt.s = Entity;
  Object.assign(ConveyorBelt.prototype, {
    l: ConveyorBelt
  });

  class SteamPuff {
    constructor(a, b, c) {
      this.state = 0;
      this.time = a;
      this.Xa = b;
      this.track = c;
      this.T = new Sprite(null, Resources.Kk);
      this.T.L(false);
      this.Uv = new SpriteAnimator(this.T);
    }
    iN() {
      if (this.state != 2) {
        this.state = 2;
      }
    }
    update(a) {
      switch (this.state) {
        case 0:
          this.time -= a;
          if (this.time > 0) {
            break;
          }
          this.T.Fb(this.Xa.data[0]);
          this.T.pa().play(this.Xa);
          this.T.L(true);
          this.T.center();
          this.Uv.loop(this.track);
          this.state = 1;
          this.time = 0;
          break;
        case 1:
          this.time += a;
          if (this.time >= 0.6) {
            this.T.pa().stop();
            this.Uv.stop();
            this.time = this.state = 0;
          }
          break;
        case 2:
          a = this.T;
          a.W(a.Uc * 0.95);
          if (this.T.Uc < 0.05) {
            this.T.free();
            this.Uv.dispose();
            this.T = this.track = this.Xa = null;
            this.state = 3;
          }
      }
    }
  }
  SteamPuff.i = true;
  Object.assign(SteamPuff.prototype, {
    l: SteamPuff
  });
  class ConveyorItem {
    constructor(a) {
      this.Jj = false;
      this.kA = true;
      this.tC = this.offset = a;
      this.index = ConveyorItem.zL++;
    }
  }
  ConveyorItem.i = true;
  Object.assign(ConveyorItem.prototype, {
    l: ConveyorItem
  });

  class ConveyorBeltMgr {
    constructor(a) {
      this.ge = new HashMap();
      this.Dw = false;
      this.list = [];
      this.S = a;
    }
    count() {
      return this.list.length;
    }
    bind(a) {
      let b = 0;
      let c = this.list;
      while (b < c.length) {
        let d = c[b];
        ++b;
        if (d.contains(new Vec2(a.x, a.y))) {
          d.bind(a);
        }
      }
    }
    push(a) {
      this.list.push(a);
    }
    iterator() {
      return new ArrayIter(this.list);
    }
    fl(a) {
      let b = 0;
      while (b < a.length) {
        this.bind(a[b++]);
      }
    }
    oM(a) {
      var b = null;
      let c = [];
      for (var d = this.iterator(); d.fb();) {
        var e = d.next();
        if (e.pM(a.Kj(), a.Yq())) {
          c.push(e);
        }
        if (e.Mv(a)) {
          b = e;
        }
      }
      if (b != null && b.ze) {
        for (d = 0; d < c.length;) {
          e = c[d];
          ++d;
          if (e.ze && e.isActive()) {
            this.rD(e, a);
            return;
          }
        }
        if (b.ze) {
          for (b = 0; b < c.length;) {
            d = c[b];
            ++b;
            if (!d.ze) {
              this.rD(d, a);
            }
          }
        }
      }
    }
    nl(a) {
      let b = 0;
      while (b < a.length) {
        this.oM(a[b++]);
      }
    }
    remove(a) {
      let b = 0;
      let c = this.list;
      while (b < c.length) {
        c[b++].remove(a);
      }
    }
    qD() {
      var a = this.count() - 1;
      let b = a;
      while (a >= 0) {
        if (this.list[a].ze && this.list[a].isActive()) {
          let c = a;
          while (c < b) {
            this.EE(c, c + 1);
            ++c;
          }
          --b;
        }
        --a;
      }
      this.SP();
    }
    update(a) {
      let b = 0;
      let c = this.list;
      while (b < c.length) {
        c[b++].update(a);
      }
      if (this.Dw) {
        this.qD();
        this.Dw = false;
      }
    }
    sR() {
      this.Dw = true;
    }
    gt(a, b, c) {
      let d = this.count() - 1;
      while (d >= 0) {
        let e = this.list[d];
        if (e != null && e.gt(a, b, c)) {
          this.ge.J[c] = new Vec2(a, b);
          return true;
        }
        --d;
      }
      return false;
    }
    Mx(a, b, c) {
      let d = this.count() - 1;
      while (d >= 0) {
        let e = this.list[d];
        if (e != null && e.Mx(a, b, c)) {
          this.ge.remove(c);
          return true;
        }
        --d;
      }
      return false;
    }
    Lx(a, b, c) {
      var d = this.ge.J[c];
      if (d != null) {
        var e = Vec2.Ia(new Vec2(a, b), d);
        if (e.io() < 4) {
          return false;
        }
        e = Vec2.cq(e);
        let f = -1;
        let g = null;
        let h = 0;
        let m = this.list;
        while (h < m.length) {
          let n = m[h];
          ++h;
          if (n.contains(d)) {
            let q = Math.abs(Vec2.yz(e, n.dir));
            if (q >= f) {
              f = q;
              g = n;
            }
          }
        }
        if (g != null) {
          g.gt(d.x, d.y, c);
        }
        this.ge.remove(c);
      }
      for (d = this.count() - 1; d >= 0;) {
        if (this.list[d].Lx(a, b, c)) {
          this.sR();
          return true;
        }
        --d;
      }
      return false;
    }
    rD(a, b) {
      if (!a.Mv(b) || a.GO(b)) {
        for (var c = 0, d = this.list; c < d.length;) {
          let e = d[c];
          ++c;
          if (e.Mv(b)) {
            e.gT(b);
          }
        }
        a.bind(b);
        SoundFx.play(SoundFx.transporter_move);
      }
    }
    SP() {
      var a = this.count() - 1;
      let b = a;
      while (a >= 0) {
        if (!this.list[a].ze) {
          let c = a;
          while (c < b) {
            this.EE(c, c + 1);
            ++c;
          }
          --b;
        }
        --a;
      }
    }
    EE(a, b) {
      let c = this.list[a];
      this.list[a] = this.list[b];
      this.list[b] = c;
      this.S.ma(4).NS(a, b);
    }
  }
  ConveyorBeltMgr.i = true;
  Object.assign(ConveyorBeltMgr.prototype, {
    l: ConveyorBeltMgr
  });
  class LevelController extends Node {
    constructor(a) {
      super();
      this.Fi = a;
      this.vA = this.oa(new Node());
      this.Zi = new SceneRoot();
      this.YB = [];
      for (a = 0; a < 14;) {
        let b = new SceneRoot();
        this.YB[a++] = b;
        this.Zi.P(b);
      }
      this.Bb = new LevelCamera();
      this.ga = WorldScale.scale;
      this.Ap = 0;
      this.AS = Vec2.sc();
      this.Fj = [];
      for (a = 0; a < 5;) {
        this.Fj[a++] = [];
      }
      this.uA = new SceneGroup();
      this.uA.Rf(new MultiLineEffect(this.Fj));
      this.ma(13).P(this.uA);
      this.Tl = this.dl = this.Co = this.Bo = 0;
      this.Bu = [];
      this.Ml();
    }
    GL() {
      this.Rl = true;
      this.Ff = new ThreeStarsCollect();
      this.ma(8).P(this.Ff.j.u);
    }
    HL() {
      this.tl = new ScreenFade(this);
      this.Md = new AnimatedNineSlice(this, this.Ag, this.zg, 4, false);
      this.fg = new MagnetEffect(this, new Vec2(this.Ka.x, this.Ka.y - 30), new Vec2(0, 0));
      this.Cn = new MagnetGlowFlash(this, this.I);
      this.xn = 0;
      this.Ve = true;
      this.Ka.IQ();
      this.Ic.hT();
      for (var a = 0, b = this.Dd; a < b.length;) {
        var c = b[a];
        ++a;
        if (c != null && (!c.ce || !!c.wl)) {
          c.DQ();
        }
      }
      a = 0;
      for (b = this.Lc; a < b.length;) {
        c = b[a];
        ++a;
        if (c.ve) {
          if (c.Hh) {
            this.zp(c);
            c.Hh = false;
          } else {
            c.ve = false;
            c.mc.dispose();
            c.mc = null;
          }
        }
      }
      if (this.$c) {
        this.Ka.Lm(true);
        a = 0;
        b = this.ab;
        while (a < b.length) {
          b[a++].Lm(true);
        }
      }
    }
    FM() {
      this.tl.free();
      this.Cn.free();
      this.Md.free();
      this.fg.free();
      let a = 0;
      let b = this.Dd;
      while (a < b.length) {
        b[a++].JS();
      }
    }
    Dv(a, b, c) {
      if (!a.Ck) {
        a.Ck = true;
        var d = a.rotation * DEG2RAD;
        var e = Vec2.Ia(b.ha, b.g);
        var f = b.ha;
        f = new Vec2(f.x, f.y);
        f.$a(-d, a.x, a.y);
        f = f.y < a.y;
        e = Math.max(e.Rb() * 40, 300) * (f ? -1 : 1);
        e = Vec2.Ob(Vec2.au(Vec2.KA(d)), e);
        var g = b.g;
        g = new Vec2(g.x, g.y);
        g.$a(-d, a.x, a.y);
        b.g = g;
        g = b.ha;
        g = new Vec2(g.x, g.y);
        g.$a(-d, a.x, a.y);
        b.ha = g;
        b.ha.y = b.g.y;
        g = b.g;
        g = new Vec2(g.x, g.y);
        g.$a(d, a.x, a.y);
        b.g = g;
        g = b.ha;
        g = new Vec2(g.x, g.y);
        g.$a(d, a.x, a.y);
        b.ha = g;
        b.Vh(e, c);
        c = d * -180 / Math.PI + 90;
        if (!f) {
          c += 180;
        }
        b = b.g;
        d = new Vec2(Star.bg, 0);
        d.rotate(-c);
        b = Vec2.tb(b, d);
        if (a.xB < 2) {
          SoundFx.play(SoundFx.sp_field_bounce);
          this.Cn.IA(b, c);
        }
      }
    }
    Cv(a) {
      let b = Star.bg;
      let c = 0;
      let d = this.Ag;
      let e = this.zg;
      let f = a.g.x < b || a.g.x > d - b;
      let g = a.g.y < b || a.g.y > e - b;
      if (f && Math.abs(Math.min(a.g.x, d - a.g.x)) > 0 || g && Math.abs(Math.min(a.g.y, e - a.g.y)) > 0) {
        let h = Vec2.Ia(a.g, a.ha);
        a.ha = a.g;
        let m = null;
        if (f) {
          if (a.g.x < b) {
            h.x = Math.abs(h.x);
            c = 0;
            m = new Vec2(b, a.g.y);
          } else {
            h.x = -Math.abs(h.x);
            c = 180;
            m = new Vec2(d - b, a.g.y);
          }
          if (Math.abs(h.x) < 3) {
            h.x = (a.g.x < b ? 1 : -1) * 3;
          }
        }
        if (g) {
          if (a.g.y < b) {
            h.y = Math.abs(h.y);
            c = -90;
            m = new Vec2(a.g.x, b);
          } else {
            h.y = -Math.abs(h.y);
            c = 90;
            m = new Vec2(a.g.x, e - b);
          }
          if (Math.abs(h.y) < 3) {
            h.y = (a.g.y < b ? 1 : -1) * 3;
          }
          if (h.Rb() < 5) {
            h.normalize();
            h = Vec2.Ob(h, 5);
          }
        }
        a.g = Vec2.tb(a.g, h);
        if (a.g.x < b) {
          a.g.x = b;
        } else if (a.g.x > d - b) {
          a.g.x = d - b;
        }
        if (a.g.y < b) {
          a.g.y = b;
        } else if (a.g.y > e - b) {
          a.g.y = e - b;
        }
        this.Cn.IA(m, c);
      }
    }
    Ml() {
      for (var a = 0; a < 5;) {
        this.Fj[a++] = [];
      }
      this.ci = Array(5);
      this.bj = Array(5);
      this.nk = Array(5);
      for (a = 0; a < 5;) {
        let b = a++;
        this.ci[b] = false;
        this.bj[b] = Vec2.sc();
        this.nk[b] = Vec2.sc();
      }
    }
    ma(a) {
      return this.YB[a];
    }
    zu() {
      let a = this.vA.Me;
      while (a != null) {
        let b = a.Y;
        a.dispose();
        a = b;
      }
    }
    delay(a, b) {
      a = new DelayedCallback(a, b);
      this.vA.oa(a);
    }
    dispose() {
      SoundFx.stop(SoundFx.monster_chewing);
      SoundFx.stop(SoundFx.sp_telekinesis);
      this.Zi.free();
      super.dispose();
    }
    show() {
      this.Tl = this.dl = 0;
      this.zu();
      this.Rd = null;
      this.jr = -1;
      this.Aa = 2;
      this.Li = 0;
      SoundFx.stop(SoundFx.electric);
      SoundFx.stop(SoundFx.magnet_idle);
      this.Lc = [];
      this.Dd = [];
      this.ab = [];
      this.bubbles = [];
      this.Ri = [];
      this.Gh = [];
      this.Kp = [];
      this.Lp = [];
      this.wj = [];
      this.Vd = [];
      this.Af = [];
      this.ej = [];
      this.Ul = [];
      this.nc = new ConveyorBeltMgr(this);
      this.se = new CharacterController(this);
      this.rc = [];
      this.um = null;
      this.sh = false;
      this.da = new VerletPoint();
      this.da.Ng(1);
      this.xa = new VerletPoint();
      this.xa.Ng(1);
      this.Ja = new VerletPoint();
      this.Ja.Ng(1);
      this.yj = new BubbleAnim(this);
      var a = BoxLevelData.get();
      this.qu = new LevelBackground(this);
      this.I = new CandyCutAnim(this);
      this.I.constraint = this.da;
      this.pP(a);
      a = this.Vd.length;
      let b;
      let c = 0;
      while (c < a) {
        b = this.Vd[c++];
        b.Vr = -1;
        b.ah = this.Vd;
      }
      this.Ap = 0;
      this.pc = this.xc = this.gd = null;
      this.iw = false;
      this.tc = this.Aa != 2;
      this.vE = this.Nr = this.ld = this.kd = false;
      this.time = this.GR = this.op = 0;
      this.si = true;
      PhysicsConfig.reset();
      this.di = this.dl > 0 ? 0 : 0.3;
      this.nc.fl(this.ab);
      this.nc.fl(this.Gh);
      this.nc.fl(this.bubbles);
      this.nc.fl(this.ej);
      this.nc.fl(this.Ri);
      this.nc.fl(this.wj);
      this.nc.qD();
      this.hg = false;
      this.HS();
    }
    pP(a) {
      function b(g, h) {
        let m = 0;
        let n = g.length;
        while (m < n) {
          let q = g[m++];
          let p = 0;
          let v = q.length;
          while (p < v) {
            h(q[p++]);
          }
        }
      }
      let c = [];
      let d = 0;
      let e = ObjectAccess.jN(a);
      while (d < e.length) {
        c.push(ObjectAccess.vf(a, e[d++]));
      }
      let f = this;
      b(c, function (g) {
        switch (g.name) {
          case 0:
            f.qP(g);
            break;
          case 1:
            f.hP(g);
            break;
          case 50:
            f.fP(g);
            break;
          case 51:
            f.gP(g);
            break;
          case 52:
            f.eP(g);
            break;
          case 134:
            f.oP(g);
        }
      });
      b(c, function (g) {
        switch (g.name) {
          case 2:
            f.Ka = new OmNom(f, g);
            f.iA = false;
            f.kr = LevelController.Hj ? 2 : -1;
            f.sq = 1;
            LevelController.Hj = false;
            break;
          case 3:
            f.vP(g);
            break;
          case 4:
            f.zP(g);
            break;
          case 5:
          case 6:
          case 7:
          case 8:
          case 9:
          case 10:
          case 11:
          case 12:
          case 13:
          case 14:
            f.yP(g);
            break;
          case 53:
            f.lP(g);
            break;
          case 54:
            f.dP(g);
            break;
          case 55:
            f.rP(g);
            break;
          case 56:
            f.tP(g);
            break;
          case 57:
          case 58:
          case 59:
          case 60:
          case 80:
            f.uP(g);
            break;
          case 81:
          case 82:
            f.cP(g);
            break;
          case 100:
            f.kP(g);
            break;
          case 120:
            f.sP(g);
            break;
          case 130:
            f.jP(g);
            break;
          case 131:
            f.wP(g);
            break;
          case 132:
            f.nP(g);
            break;
          case 133:
            f.iP(g);
            break;
          case 135:
            f.xP(g);
            break;
          case 300:
            f.mP(g);
        }
      });
    }
    qP(a) {
      this.Ag = a.width * this.ga | 0;
      this.zg = a.height * this.ga | 0;
      var b = a.view;
      if (b != null) {
        var c = b.x;
        let d = b.y;
        b = new Bounds(c, d, c + b.width, d + b.height);
        b.scale(this.ga, false);
        c = this.Bb.Ok;
        c.A = b.A;
        c.D = b.D;
        c.B = b.B;
        c.G = b.G;
        c = this.Bb.g;
        c.x = (b.A + b.B) / 2;
        c.y = (b.D + b.G) / 2;
      } else {
        b = this.Bb.Ok;
        b.A = 0;
        b.D = 0;
        b.B = this.Ag;
        b.G = this.zg;
        b = this.Bb.g;
        b.x = this.Ag / 2;
        b.y = this.zg / 2;
      }
      this.ie = new Vec4(0, 0, 0, 1);
      if (a.scrollX != null) {
        this.ie.x = a.scrollX;
      }
      if (a.scrollY != null) {
        this.ie.y = a.scrollY;
      }
      if (LevelState.box == 8) {
        this.qu.xS();
      }
    }
    hP(a) {
      this.Cd = a.special;
      this.Em = a.ropePhysicsSpeed;
      this.$c = a.nightLevel;
      this.Aa = a.twoParts ? 0 : 2;
      this.Em *= LevelController.Ty;
      if (this.Aa != 2) {
        this.zj = new BubbleAnim(this);
        this.Aj = new BubbleAnim(this);
      }
    }
    kP(a) {
      var b = a.x * this.ga;
      let c = a.y * this.ga;
      let d = a.length * this.ga;
      var e = a.radius;
      var f = a.wheel;
      var g = a.moveLength != null ? a.moveLength * this.ga : -1;
      let h = a.moveVertical;
      let m = a.moveOffset != null ? a.moveOffset * this.ga : 0;
      var n = a.spider;
      var q = a.part == "L";
      let p = a.hidePath;
      var v = a.bindBulb;
      let u = new Candy(this);
      u.x = b;
      u.y = c;
      u.Zf = f;
      u.lS(n);
      u.Ji(a);
      if (e != -1) {
        e *= this.ga;
      }
      if (e == -1) {
        f = this.da;
        if (v) {
          q = 0;
          v = this.rc;
          while (q < v.length) {
            n = v[q];
            ++q;
            if (n != null) {
              f = n.constraint;
            }
          }
        } else if (this.Aa != 2) {
          f = q ? this.xa : this.Ja;
        }
        b = new Rope(this.ma(6), null, b, c, f, f.g.x, f.g.y, d);
        b.Jc.vh.Pb(b.Jc.g);
        u.eE(b);
        this.yn();
      }
      u.setRadius(e);
      u.WR(g, h, m);
      if (u.pb != null && (u.KR(), !p)) {
        a = a.path[0] == "R";
        if (this.um == null) {
          this.um = new SwarmManager(this);
        }
        e = 0;
        for (g = u.pb.path.length - 1; e < g;) {
          if (!a || e % 3 == 0) {
            this.um.DA(e, e + 1, u);
          }
          ++e;
        }
        if (u.pb.path.length > 2) {
          this.um.DA(0, u.pb.path.length - 1, u);
        }
      }
      this.Lc.push(u);
    }
    fP(a) {
      this.xa.g.x = a.x * this.ga;
      this.xa.g.y = a.y * this.ga;
      this.Ma = new CandyPiece(this, Keys.fH);
      this.Ma.x = this.xa.g.x;
      this.Ma.y = this.xa.g.y;
      this.Ma.constraint = this.xa;
    }
    gP(a) {
      this.Ja.g.x = a.x * this.ga;
      this.Ja.g.y = a.y * this.ga;
      this.Na = new CandyPiece(this, Keys.gH);
      this.Na.x = this.Ja.g.x;
      this.Na.y = this.Ja.g.y;
      this.Na.constraint = this.Ja;
    }
    eP(a) {
      this.da.g.x = a.x * this.ga;
      this.da.g.y = a.y * this.ga;
    }
    oP(a) {
      let b = new VerletPoint();
      b.Ng(1);
      b.g.x = a.x * this.ga;
      b.g.y = a.y * this.ga;
      a = new LighterEntity(this, a.litRadius * this.ga);
      a.x = b.g.x;
      a.y = b.g.y;
      a.constraint = b;
      this.rc.push(a);
    }
    lP(a) {
      this.Rd = new ToggleButton(this, a.x * this.ga, a.y * this.ga);
      this.Rd.sw = cachedBind(this, this.Rr);
    }
    vP(a) {
      let b = new Star(this);
      b.x = a.x * this.ga;
      b.y = a.y * this.ga;
      b.timeout = a.timeout;
      if (a.timeout != -1) {
        b.setTimeout();
      }
      b.Ji(a);
      b.update(0);
      this.ab.push(b);
    }
    mP(a) {
      this.Ic = new BonusStar(this);
      this.Ic.x = a.x * this.ga;
      this.Ic.y = a.y * this.ga;
      this.Ic.update(0);
    }
    zP(a) {
      if (!this.mE(a) && a.text != null && a.text != "") {
        var b = Math.ceil(a.width * this.ga);
        b = new TutorialHintText(Strings.get(a.text), b);
        b.x = a.x * this.ga;
        b.y = a.y * this.ga;
        this.ma(2).P(b.T.u);
        a = a.special;
        b.Cd = a ?? 0;
        if (b.Cd == 0) {
          b.show();
        }
        this.Lp.push(b);
      }
    }
    yP(a) {
      if (!this.mE(a)) {
        var b = new TutText(a.name - 5);
        b.T.center();
        b.x = a.x * this.ga;
        b.y = a.y * this.ga;
        var c = a.angle;
        b.rotation = c ?? 0;
        c = a.special;
        b.Cd = c ?? 0;
        b.Ji(a);
        a = 2;
        if (b.Cd == 2 || this.Cd == 5) {
          a = 13;
        }
        this.ma(a).P(b.T.u);
        if (b.Cd == 0 || b.Cd == 2) {
          b.show();
        }
        this.Kp.push(b);
      }
    }
    dP(a) {
      let b = new Character(this);
      b.x = a.x * this.ga;
      b.y = a.y * this.ga;
      this.bubbles.push(b);
    }
    rP(a) {
      let b = new Pump(this);
      b.angle = a.angle;
      b.x = a.x * this.ga;
      b.y = a.y * this.ga;
      b.rotation = a.angle + 90;
      b.Hd();
      this.Ri.push(b);
    }
    tP(a) {
      let b = new Sock(this, a.group);
      b.x = a.x * this.ga;
      b.y = a.y * this.ga;
      b.Ji(a);
      b.rotation += 90;
      if (b.pb != null) {
        b.pb.angle += 90;
      }
      b.Hd();
      this.Gh.push(b);
    }
    uP(a) {
      var b = a.x * this.ga;
      let c = a.y * this.ga;
      let d = a.size;
      let e = parseFloat(a.angle);
      if (a.toggled == 0) {
        var f = -1;
      } else {
        f = a.toggled;
        f = f ?? -1;
      }
      b = new SawBlade(this, b, c, d, e ?? 0, f);
      b.Ji(a);
      if (f != -1) {
        b.OC = cachedBind(this, this.AR);
      }
      if (a.name == 80) {
        b.ce = true;
        b.IB = a.initialDelay;
        b.TC = a.onTime;
        b.FC = a.offTime;
        b.tf = 0;
        b.bF();
        b.tf += b.IB;
        b.Hd();
      } else {
        b.ce = false;
      }
      this.Dd.push(b);
    }
    sP(a) {
      let b = a.x * this.ga;
      let c = a.y * this.ga;
      let d = a.size * this.ga;
      var e = Numeric.parseInt(a.handleAngle);
      e = e ?? 0;
      let f = e * DEG2RAD;
      let g = a.oneHandle;
      let h = new Vinyl(this);
      h.TB = a.size;
      h.x = b;
      h.y = c;
      h.rotation = e;
      h.mr = new Vec2(h.x - h.TB * this.ga, h.y);
      h.mr.$a(f, h.x, h.y);
      h.nr = new Vec2(h.x + h.TB * this.ga, h.y);
      h.nr.$a(f, h.x, h.y);
      h.Lb(d);
      h.QR(g);
      this.Vd.push(h);
    }
    cP(a) {
      let b = new Bouncer(this, a.x * this.ga, a.y * this.ga, a.size, a.angle);
      b.Ji(a);
      this.wj.push(b);
    }
    jP(a) {
      let b = a.x * this.ga;
      let c = a.y * this.ga;
      let d = a.radius;
      let e = a.angle;
      let f = a.grab;
      let g = a.bubble;
      a = a.bouncer;
      let h = new GameItemSwitcher(this);
      h.CO(new Vec2(b, c), (a ? 8 : 0) | (g ? 2 : 0) | (f ? 4 : 0), d, e, this.bubbles, this.Lc, this.wj);
      this.Af.push(h);
      this.yj.Cb = new BeeAnims();
      if (this.Aa != 2) {
        this.zj.Cb = new BeeAnims();
        this.Aj.Cb = new BeeAnims();
      }
    }
    wP(a) {
      let b = a.x * this.ga;
      let c = a.y * this.ga;
      a = a.angle;
      let d = new SteamGenerator(this);
      d.AO(b, c, a);
      this.ej.push(d);
    }
    nP(a) {
      let b = a.x * this.ga;
      let c = a.y * this.ga;
      let d = a.candyCaptured;
      let e = new LanternEye(this);
      e.zO(b, c);
      this.Ul.push(e);
      e.Ji(a);
      if (d) {
        this.sh = true;
        this.I.j.W(0);
        e.jA(this.da);
      }
    }
    iP(a) {
      let b = a.x * this.ga;
      let c = a.y * this.ga;
      let d = a.angle;
      let e = a.radius;
      let f = a.activeTime;
      a = a.index;
      let g = new Gap(this, this.se);
      g.index = a;
      g.BO(new Vec2(b, c), d, e, f);
      this.se.oa(g, a);
    }
    xP(a) {
      var b = a.x * this.ga;
      let c = a.y * this.ga;
      let d = a.angle;
      let e = a.width * this.ga;
      let f = a.length * this.ga;
      let g = a.velocity * this.ga;
      let h = a.direction == "forward" ? 1 : -1;
      a = a.type == "manual";
      b = ConveyorBelt.create(this, this.nc.count(), b, c, f, e, -d, a, g * h);
      this.nc.push(b);
    }
    yn() {
      this.dl += 1;
    }
    Nv(a, b, c, d) {
      if (Rect.lk(b.x, b.y, a.x - 34, a.y - 34, 68, 68)) {
        if (c != null) {
          this.vm(a.x, a.y);
          this.Un();
          b = 0;
          for (var e = this.Af; b < e.length;) {
            var f = e[b];
            ++b;
            if (f != null && f.ca == c) {
              f.mg = true;
              f.Si(1);
            }
          }
        }
        d.show();
        c = false;
        b = 0;
        for (e = this.Af; b < e.length;) {
          f = e[b];
          ++b;
          if (f != null && f.ca == a) {
            f.mg = false;
            c = true;
          }
        }
        if (c) {
          d.yS();
        }
        SoundFx.play(SoundFx.bubble);
        a.pop();
        this.yn();
        return true;
      }
      return false;
    }
    Rm(a, b) {
      if (!this.vE) {
        b.x = a.g.x;
        b.y = a.g.y;
        b.pe();
      }
    }
    bN(a, b, c, d) {
      this.Rm(this.da, a);
      if (Entity.yo(a, c)) {
        c.PQ();
        SoundFx.play(SoundFx.monster_chewing, true);
        if (b != null) {
          this.mk(b, false);
        }
        this.tk(d != null);
        a.oe = false;
        a.j.tween().tF(c.x, c.y + 10);
        a.j.tween().alpha(0, 0.1);
        a.j.tween().scale(0, 0.1, null, null, function () {
          a.free();
        });
        return true;
      } else {
        return false;
      }
    }
    KE(a) {
      if (a != null && a.Gc != null) {
        var b = a.constraint;
        a.Gc.qc.L(true);
        a.Gc.qc.pa().play(v167);
        var c = new Vec2(0, Sock.xJ);
        c.rotate(a.Gc.rotation * DEG2RAD);
        b.g.x = a.Gc.x;
        b.g.y = a.Gc.y;
        b.g.add(c);
        b.ha.Pb(b.g);
        b.sb.x = 0;
        b.sb.y = -1;
        b.sb.rotate(a.Gc.rotation * DEG2RAD);
        b.sb.multiply(a.Rw);
        b.xd.Pb(b.sb);
        b.xd.xA(60);
        b.ha.Pb(b.g);
        b.ha.Ax(b.xd);
        a.Gc = null;
      }
    }
    tk(a) {
      let b = 0;
      let c = this.Lc.length;
      while (b < c) {
        let d = this.Lc[b++];
        let e = d.kb;
        if (e != null && (e.Mb == this.da || e.Mb == this.xa && a || e.Mb == this.Ja && !a)) {
          if (e.yc == -1) {
            e.Fs(e.za.length - 2);
            this.Un();
          } else {
            e.Fv = true;
          }
          if (d.ve && d.Hh) {
            this.zp(d);
          }
        }
      }
    }
    jR(a) {
      if (a != null) {
        for (var b = 0, c = this.Lc; b < c.length;) {
          let d = c[b];
          ++b;
          if (d == null) {
            continue;
          }
          let e = d.kb;
          if (e != null && e.Mb == a.constraint) {
            if (e.yc == -1) {
              e.Fs(e.za.length - 2);
            } else {
              e.Fv = true;
            }
            if (d.ve && d.Hh) {
              this.zp(d);
            }
          }
        }
      }
    }
    Un() {
      --this.dl;
      this.Tl = 0;
    }
    fM() {
      this.Gx = Math.max(0, 30 - this.op) * 100;
      this.Gx = this.Gx / 10 * 10;
      this.GS = this.Ap * 1000;
      this.GR = Math.ceil(this.Gx + this.GS);
    }
    Dl() {
      if (this.gd != null) {
        this.mk(this.gd, false);
      }
      this.fM();
      this.tk(false);
      this.zu();
      let a = SoundFx.electric;
      this.delay(function () {
        SoundFx.stop(a);
      }, 1.5);
      this.Fi.tw();
      this.delay((v10 = this.Fi, cachedBind(v10, v10.fQ)), 1.8);
      this.se.ZO();
      if (this.Rl) {
        this.Ff.free();
        this.Ff = null;
      }
      if (this.Ve) {
        this.FM();
        this.Ve = false;
      }
    }
    fv() {
      if (!this.Cm) {
        this.Ka.EQ();
        SoundFx.play(SoundFx.monster_sad);
        if (this.Rl) {
          this.Ff.free();
          this.Ff = null;
        }
        this.zu();
        this.Fi.eQ();
        this.delay((v10 = this.Fi, cachedBind(v10, v10.JC)), 1);
      }
    }
    rr(a, b, c, d) {
      if (c.iR(a.x - 249.60000000000002, a.y - 249.60000000000002, a.x + 249.60000000000002, a.y + 249.60000000000002)) {
        var e = new Vec2(0, 0);
        let h = new Vec2(0, 0);
        c = new Vec2(c.x, c.y);
        var f = a.ea;
        f = f.B - f.A;
        var g = a.ea;
        g = g.G - g.D;
        e.x = a.x - f / 2;
        h.x = a.x + f / 2;
        e.y = h.y = a.y;
        if (a.angle != 0) {
          c.$a(-a.angle, a.x, a.y);
        }
        if (c.y < e.y && Rect.Ew(c.x - f / 2, c.y - g / 2, c.x + f / 2, c.y + g / 2, e.x, e.y - 249.60000000000002, h.x, h.y)) {
          e = new Vec2(0, -((249.60000000000002 - (e.y - c.y)) * 499.20000000000005 / 249.60000000000002));
          e.rotate(a.angle);
          b.Vh(e, d);
        }
      }
    }
    pr(a, b, c) {
      if (!a.Ck && a.j != null) {
        var d = Vec2.Ia(b.ha, b.g);
        var e = b.ha.Zb();
        e.$a(-a.angle, a.x, a.y);
        d = Math.max(d.Rb() * 40, 336) * (e.y < a.y ? -1 : 1);
        e = Vec2.au(Vec2.KA(a.angle));
        e.multiply(d);
        b.g.$a(-a.angle, a.x, a.y);
        b.ha.$a(-a.angle, a.x, a.y);
        b.ha.y = b.g.y;
        b.g.$a(a.angle, a.x, a.y);
        b.ha.$a(a.angle, a.x, a.y);
        b.Vh(e, c);
        a.BQ();
        SoundFx.play(SoundFx.bouncer);
      }
    }
    uQ(a, b) {
      a.U.pa().play(Pump.zF);
      SoundFx.play([1035, 1034, 1033, 1032][X.xh(0, 3)]);
      a.dN(this);
      if (!this.tc) {
        this.rr(a, this.da, this.I, b);
      }
      if (this.Aa != 2) {
        if (!this.kd) {
          this.rr(a, this.xa, this.Ma, b);
        }
        if (!this.ld) {
          this.rr(a, this.Ja, this.Na, b);
        }
      }
      let c = 0;
      let d = this.rc;
      while (c < d.length) {
        let e = d[c];
        ++c;
        this.rr(a, e.constraint, e, b);
      }
    }
    vQ(a, b) {
      function c(u, A, D) {
        var B = 0;
        if (a.rotation == 0 && (q.Rd == null || q.Rd != null && q.si) || a.rotation == 180 && q.Rd != null && !q.si) {
          B = a.x - A.x;
          B = Math.abs(B) > 2.5 ? -D.x / f + B * 0.25 : Math.abs(D.x) < 1 ? -D.x : -D.x / f;
        }
        let K = -34 / u.weight;
        if (a.rotation != 0 && (q.Rd == null || q.Rd != null && q.si) || a.rotation != 180 && q.Rd != null && !q.si) {
          f *= 15;
          K = a.rotation == 90 || a.rotation == 270 ? K / 4 : K / 2;
        }
        D = new Vec2(B, -D.y / f + K);
        A = a.y - A.y;
        if (A > h + 17.5) {
          D.multiply(Math.exp((A - (h + 17.5)) * -2));
        }
        D.rotate(g);
        u.Vh(D, b);
      }
      function d() {
        let u = 0;
        let A = q.wj;
        while (u < A.length) {
          let D = A[u];
          ++u;
          if (D != null) {
            D.Ck = false;
          }
        }
      }
      function e(u, A, D) {
        A.$a(-g, a.x, a.y);
        D.rotate(-g);
        return Rect.Ew(A.x - 17.5, A.y - 8.75, A.x + 17.5, A.y + 17.5, m.x, m.y, n.x, n.y);
      }
      let f = 5;
      let g = a.rotation * DEG2RAD;
      let h = a.BN();
      let m = new Vec2(a.x - 5, a.y - h - 1);
      let n = new Vec2(a.x + 5, a.y - 17.5);
      let q = this;
      if (this.Aa == 2) {
        var p = this.da.g.Zb();
        var v = this.da.sb.Zb();
        if (e(this.da, p, v)) {
          d();
          c(this.da, p, v);
        }
      } else {
        p = this.xa.g.Zb();
        v = this.xa.sb.Zb();
        if (e(this.xa, p, v)) {
          d();
          c(this.xa, p, v);
        }
        p = this.Ja.g.Zb();
        v = this.Ja.sb.Zb();
        if (e(this.Ja, p, v)) {
          d();
          c(this.Ja, p, v);
        }
      }
      p = 0;
      for (v = this.rc; p < v.length;) {
        let u = v[p];
        ++p;
        let A = u.constraint.g.Zb();
        let D = u.constraint.sb.Zb();
        if (e(u.constraint, A, D)) {
          d();
          c(u.constraint, A, D);
        }
      }
    }
    yc(a, b, c) {
      let d = 0;
      let e = this.Lc.length;
      while (d < e) {
        let f = this.Lc[d++];
        let g = f.kb;
        if (g == null || g.yc != -1) {
          continue;
        }
        let h = g.za.length - 1;
        let m = 0;
        while (m < h) {
          let n = m++;
          let q = g.za[n];
          let p = g.za[n + 1];
          if (f.Zf && Rect.$j(a.x, a.y, b.x, b.y, f.x - 44, f.y - 44, 88, 88) ? 0 : MathUtil.aP(a.x, a.y, b.x, b.y, q.g.x, q.g.y, p.g.x, p.g.y)) {
            if (f.ve && f.Hh) {
              this.zp(f);
            }
            SoundFx.play([1030, 1029, 1028, 1027][g.Fw]);
            g.Fs(n);
            this.Un();
            if (c) {
              g.bh = 0;
              g.Gw(n);
            }
            return 1;
          }
        }
      }
      return 0;
    }
    zp(a) {
      SoundFx.play(SoundFx.spider_fall);
      a.ve = false;
      a.mc.bM();
    }
    ES(a) {
      SoundFx.play(SoundFx.spider_win);
      let b = 0;
      let c = this.Lc;
      while (b < c.length) {
        let d = c[b];
        ++b;
        let e = d.kb;
        if (e != null && e.Mb == this.da) {
          if (e.yc != -1) {
            d.Qu();
          } else {
            e.Fs(e.za.length - 2);
            this.Un();
            e.Al = false;
          }
          if (d.ve && d.Hh && a != d) {
            this.zp(d);
          }
        }
      }
      a.ve = false;
      this.tc = this.vE = true;
      a.mc.cc();
      if (!this.Cm) {
        this.delay(cachedBind(this, this.fv), 2);
      }
    }
    mk(a, b) {
      for (var c = 0, d = this.Af; c < d.length;) {
        var e = d[c];
        ++c;
        if (e != null) {
          if (e.ca == a) {
            e.mg = true;
            e.Si(1);
          }
          if (this.gd == a && this.lE && e.ca == this.pc) {
            e.mg = true;
            e.Si(1);
            this.pc = null;
            this.lE = false;
          }
        }
      }
      c = 0;
      for (d = this.rc; c < d.length;) {
        e = d[c];
        ++c;
        if (e.ca != null && e.ca == a) {
          e.ca = null;
          e.Gn.oh();
          this.vm(e.x, e.y);
          return;
        }
      }
      if (this.Aa != 2) {
        if (b) {
          this.xc = null;
          this.zj.oh();
          this.vm(this.Ma.x, this.Ma.y);
        } else {
          this.pc = null;
          this.Aj.oh();
          this.vm(this.Na.x, this.Na.y);
        }
      } else {
        this.gd = null;
        this.yj.oh();
        this.vm(this.I.x, this.I.y);
      }
      this.Un();
    }
    vm(a, b) {
      SoundFx.play(SoundFx.bubble_break);
      let c = new Sprite(null, Resources.ca, Keys.ZG);
      c.setX(a);
      c.setY(b);
      c.center();
      c.setUniformScale(0.4);
      this.Zi.P(c.u);
      c.pa().play(Character.UI).Be(function () {
        c.free();
      });
    }
    qr(a, b, c, d) {
      if (Rect.lk(c, d, b.g.x - 24, b.g.y - 24, 60, 60)) {
        this.mk(a, b == this.xa);
        return true;
      } else {
        return false;
      }
    }
    Sw(a) {
      var b = this.O.window;
      var c = b.V.viewport;
      var d = b.Hc.x;
      b = b.Hc.y;
      d = -1 + (a.x - (c.x * d | 0)) * 2 / (c.w * d | 0);
      a = -1 + ((c.y * b | 0) - a.y) * 2 / (c.J * b | 0);
      c = this.Bb.Ab.Kv;
      return new Vec4(c.m11 * d + c.m12 * a + c.m14, c.m21 * d + c.m22 * a + c.m24, 0, 1);
    }
    WS(a, b) {
      var c = this.Sw(a);
      a = c.x;
      c = c.y;
      if (this.Ll) {
        this.CA = true;
      } else if (!(b >= 5)) {
        if (this.Rd != null && this.Rd.Ql(a, c)) {
          this.jr = b;
        } else if ((!this.se.yi() || !this.se.jk(a, c, b)) && (this.gd == null || !this.qr(this.gd, this.da, a, c)) && (this.Aa == 2 || (this.xc == null || !this.qr(this.xc, this.xa, a, c)) && (this.pc == null || !this.qr(this.pc, this.Ja, a, c)))) {
          for (var d = 0, e = this.rc; d < e.length;) {
            var f = e[d];
            ++d;
            if (f.ca != null && this.qr(f.ca, f.constraint, a, c)) {
              return;
            }
          }
          d = new Vec2(a, c);
          if (!this.ci[b]) {
            this.bj[b].Pb(d);
            this.nk[b].Pb(d);
          }
          d = 0;
          for (e = this.Dd; d < e.length;) {
            f = e[d];
            ++d;
            if (f.Gg != null && f.ht == -1 && f.Gg.vw(a, c)) {
              f.ht = b;
              return;
            }
          }
          d = false;
          e = 0;
          for (f = this.Ri; e < f.length;) {
            var g = f[e];
            ++e;
            if (g.RQ(a, c)) {
              g.Gp = 0.05;
              g.VE = b;
              if (!g.Sl()) {
                d = true;
              }
              break;
            }
          }
          if (!d) {
            d = 0;
            for (e = this.ej; d < e.length;) {
              if (e[d++].jk(a, c, b)) {
                return;
              }
            }
            var h = this;
            d = 0;
            for (e = this.Ul; d < e.length;) {
              f = e[d];
              ++d;
              if (f != null && f.jk(a, c, b)) {
                this.delay(function () {
                  h.sh = false;
                  h.I.oe = true;
                  h.I.j.W(1);
                  h.I.j.setUniformScale(0.71);
                }, 0.1);
                return;
              }
            }
            var m = 0;
            for (d = this.Vd.length; m < d;) {
              e = this.Vd[m];
              f = Vec2.nd(a, c, e.mr.x, e.mr.y);
              g = Vec2.nd(a, c, e.nr.x, e.nr.y);
              if (f < LevelController.Yp && !e.nO() || g < LevelController.Yp) {
                for (m += 1; m < d;) {
                  ++m;
                }
                e.Do.x = a;
                e.Do.y = c;
                e.Vr = b;
                if (f < LevelController.Yp) {
                  e.UD(true);
                }
                if (g < LevelController.Yp) {
                  e.VD(true);
                }
                return;
              }
              ++m;
            }
            d = 0;
            for (e = this.Lc; d < e.length;) {
              f = e[d];
              ++d;
              if (f.Zf && Rect.lk(a, c, f.x - 44, f.y - 44, 88, 88)) {
                f.kO(a, c);
                f.Xm = b;
                return;
              }
              if (f.Hf > 0 && Rect.lk(a, c, f.x - 26, f.y - 26, 52, 52)) {
                f.im = b;
                return;
              }
            }
            d = 0;
            for (e = this.Af; d < e.length;) {
              f = e[d];
              ++d;
              if (f != null && f.vw(a, c)) {
                return;
              }
            }
            if (!this.nc.gt(a, c, b)) {
              this.ci[b] = true;
            }
          }
        }
      }
    }
    YS(a, b) {
      var c = this.Sw(a);
      a = c.x;
      c = c.y;
      if (!this.Ll) {
        this.ci[b] = false;
        if (this.Rd != null && this.jr == b) {
          if (this.Rd.Ql(a, c)) {
            this.Rd.toggle();
            if (LevelState.box == 8) {
              this.qu.pN();
            }
            this.Rr(0);
          }
          this.jr = -1;
        }
        for (var d = 0, e = this.Dd; d < e.length;) {
          var f = e[d];
          ++d;
          if (f.Gg != null && f.ht == b && (f.ht = -1, f.Gg.sQ(a, c))) {
            return;
          }
        }
        d = 0;
        for (e = this.Vd; d < e.length;) {
          f = e[d];
          ++d;
          if (f.Vr == b) {
            f.Vr = -1;
            f.xx = -1;
            f.UD(false);
            f.VD(false);
          }
        }
        d = 0;
        for (e = this.ej; d < e.length;) {
          if (e[d++].tQ(b)) {
            return;
          }
        }
        d = 0;
        for (e = this.Lc; d < e.length;) {
          f = e[d];
          ++d;
          if (f.Zf && f.Xm == b) {
            f.Xm = -1;
          }
          if (f.Hf > 0 && f.im == b) {
            f.im = -1;
          }
        }
        if (b == 0 && this.Ve) {
          this.Ka.HQ();
          this.fg.TD(false);
        }
        this.nc.Mx(a, c, b);
      }
    }
    XS(a, b) {
      a = this.Sw(a);
      var c = a.x;
      var d = a.y;
      if (!this.Ll && !(b >= 5)) {
        a = new Vec2(c, d);
        if (this.bj[b].sf(a) > 10) {
          for (var e = 0, f = this.Ri; e < f.length;) {
            var g = f[e];
            ++e;
            if (g.VE == b && g.Gp != 0) {
              g.Gp = 0;
            }
          }
        }
        this.AS.Pb(a);
        f = 0;
        for (g = this.Vd; f < g.length;) {
          e = g[f];
          ++f;
          if (e.Vr == b) {
            b = new Vec2(e.x, e.y);
            if (b.sf(a) < e.Fh / 10) {
              e.Do.Pb(a);
            }
            c = Vec2.Ia(e.Do, b);
            c = Vec2.Ia(a, b).km() - c.km();
            if (c > Math.PI) {
              c -= Math.PI * 2;
            } else if (c < -Math.PI) {
              c += Math.PI * 2;
            }
            e.mr.$a(c, e.x, e.y);
            e.nr.$a(c, e.x, e.y);
            e.rotation += c * RAD2DEG;
            d = c > 0 ? SoundFx.scratch_in : SoundFx.scratch_out;
            if (Math.abs(c) < 0.07) {
              d = -1;
            }
            if (e.xx != d && d != -1) {
              SoundFx.play(d);
              e.xx = d;
            }
            d = 0;
            for (f = this.Lc; d < f.length;) {
              g = f[d];
              ++d;
              var h = new Vec2(g.x, g.y);
              if (h.sf(b) <= e.Fh + this.ga * 5) {
                h.$a(c, e.x, e.y);
                g.x = h.x;
                g.y = h.y;
                if (g.kb != null) {
                  g.kb.Jc.g.Pb(h);
                  g.kb.Jc.vh.Pb(h);
                }
              }
            }
            d = 0;
            for (f = this.Ri; d < f.length;) {
              g = f[d];
              ++d;
              h = new Vec2(g.x, g.y);
              if (h.sf(b) <= e.Fh + this.ga * 5) {
                h.$a(c, e.x, e.y);
                g.x = h.x;
                g.y = h.y;
                g.rotation += c * RAD2DEG;
                g.Hd();
              }
            }
            d = 0;
            for (f = this.bubbles; d < f.length;) {
              g = f[d];
              ++d;
              h = new Vec2(g.x, g.y);
              if (h.sf(b) <= e.Fh + this.ga * 10 && g != this.gd && g != this.pc && g != this.xc) {
                h.$a(c, e.x, e.y);
                g.x = h.x;
                g.y = h.y;
              }
            }
            if (Rect.lk(this.Ka.x, this.Ka.y, e.x - e.size, e.y - e.size, e.size * 2, e.size * 2)) {
              b = new Vec2(this.Ka.x, this.Ka.y);
              b.$a(c, e.x, e.y);
              this.Ka.x = b.x;
              this.Ka.y = b.y;
            }
            e.Do.Pb(a);
            return;
          }
        }
        e = 0;
        for (f = this.ej; e < f.length;) {
          if (f[e++].rQ(c, d, b)) {
            return;
          }
        }
        f = 0;
        for (g = this.Lc; f < g.length;) {
          e = g[f];
          ++f;
          if (e != null) {
            if (e.Zf && e.Xm == b) {
              e.jO(a);
              return;
            }
            if (e.Hf > 0 && e.im == b) {
              if (e.jw) {
                e.y = MathUtil.FA(a.y, e.gm, e.dm);
              } else {
                e.x = MathUtil.FA(a.x, e.gm, e.dm);
              }
              if (e.kb != null) {
                a = e.kb.Jc;
                a.g.x = a.vh.x = e.x;
                a.g.y = a.vh.y = e.y;
              }
              return;
            }
          }
        }
        e = false;
        if (this.nc.Lx(c, d, b)) {
          e = true;
        }
        if (this.ci[b]) {
          c = new Vec2(0, 0);
          f = new ColoredSegment(Vec2.tb(this.bj[b], c), Vec2.tb(a, c), 5, 5, RGBA.yT.Zb());
          c = this.Fj[b];
          d = 0;
          if (!e) {
            c.push(f);
            e = 0;
            while (e < c.length) {
              f = c[e];
              ++e;
              d += this.yc(f.start, f.end, false);
            }
          }
          this.nk[b].Pb(this.bj[b]);
          this.bj[b].Pb(a);
        }
      }
    }
    HS() {
      this.Ah = new Vec4(0, 0, 0, 1);
      this.Qf = new Vec4(0, 0, 0, 1);
      this.Mc = new Vec4(0, 0, 0, 1);
      this.jl = 0;
      var a = this.Bb.Ok;
      var b = this.Ah;
      b.x = (a.A + a.B) / 2;
      b.y = (a.D + a.G) / 2;
      if (this.ie.x != 0 || this.ie.y != 0) {
        this.jl = 1;
      }
      if (this.ie.x > 0) {
        b = this.Qf;
        b.x = (a.A + a.B) / 2 + (a.B - a.A);
        b.y = (a.D + a.G) / 2;
      } else if (this.ie.x < 0) {
        b = this.Qf;
        b.x = (a.A + a.B) / 2 - (a.B - a.A);
        b.y = (a.D + a.G) / 2;
      }
      if (this.ie.y > 0) {
        b = this.Qf;
        var c = this.Ah;
        b.x = c.x + 0;
        b.y = c.y + (a.G - a.D);
      } else if (this.ie.y < 0) {
        b = this.Qf;
        c = this.Ah;
        b.x = c.x - 0;
        b.y = c.y - (a.G - a.D);
      }
      if (this.jl == 1) {
        this.Ds = -0.5;
        this.Ll = true;
        a = this.Bb.g;
        b = this.Ah;
        a.x = b.x;
        a.y = b.y;
      }
      this.Bb.update();
      this.Wr = this.Aa != 2 ? this.Ni(this.xa) || this.Ni(this.Ja) : this.Ni(this.da);
      if (this.$c) {
        a = 0;
        b = this.rc;
        while (a < b.length) {
          if (this.Ni(b[a++].constraint)) {
            this.Wr = true;
            break;
          }
        }
      }
    }
    Ni(a) {
      return !this.Bb.PO(a.g.x, a.g.y);
    }
    mE(a) {
      return Save.language != a.locale;
    }
    Rr() {
      PhysicsConfig.toggle();
      this.si = PhysicsConfig.NO();
      SoundFx.play(this.si ? SoundFx.gravity_off : SoundFx.gravity_on);
    }
    AR(a) {
      let b = 0;
      let c = this.Dd;
      while (b < c.length) {
        let d = c[b];
        ++b;
        if (d.TE == a) {
          d.BR();
        }
      }
    }
    rB(a, b, c) {
      let d = Vec2.Ia(a.g, b.g).Rb();
      if (d < c) {
        if (c - d < 1000 / (a.sb.Rb() + b.sb.Rb()) * 2) {
          var e = Math.acos(Vec2.cq(a.g.x > b.g.x ? Vec2.Ia(a.g, b.g) : Vec2.Ia(b.g, a.g)).x);
          var f = Math.abs((c - d) / 2 * Math.cos(e));
          c = Math.abs((c - d) / 2 * Math.sin(e));
          if (a.g.x <= b.g.x) {
            a.g.x -= f;
            b.g.x += f;
          } else {
            b.g.x -= f;
            a.g.x += f;
          }
          if (a.g.y <= b.g.y) {
            a.g.y -= c;
            b.g.y += c;
          } else {
            b.g.y -= c;
            a.g.y += c;
          }
        } else {
          var g = Vec2.Ia(b.g, a.g);
          var h = -g.y;
          var m = g.x;
          f = (a.sb.x * g.x + a.sb.y * g.y) / c;
          e = (a.sb.x * h + a.sb.y * m) / c;
          h = (b.sb.x * h + a.sb.x * m) / c;
          m = f;
          f = (b.sb.x * g.x + a.sb.x * g.y) / c;
          let n = g.x / c;
          g = g.y / c;
          a.sb = new Vec2(f * n - e * g, f * g + e * n);
          b.sb = new Vec2(m * n - h * g, m * g + h * n);
          e = Math.acos(Vec2.cq(a.g.x > b.g.x ? Vec2.Ia(a.g, b.g) : Vec2.Ia(b.g, a.g)).x);
          f = Math.abs((c - d) / 2 * Math.cos(e));
          c = Math.abs((c - d) / 2 * Math.sin(e));
          if (a.g.x <= b.g.x) {
            a.g.x -= f;
            b.g.x += f;
          } else {
            b.g.x -= f;
            a.g.x += f;
          }
          if (a.g.y <= b.g.y) {
            a.g.y -= c;
            b.g.y += c;
          } else {
            b.g.y -= c;
            a.g.y += c;
          }
          a.xd = Vec2.bq(a.sb, 60);
          a.ha = Vec2.Ia(a.g, a.xd);
          b.xd = Vec2.bq(b.sb, 60);
          b.ha = Vec2.Ia(b.g, b.xd);
        }
      }
    }
    aF(a) {
      if (this.Cd == a) {
        for (var b = this.Cd = 0, c = this.Lp; b < c.length;) {
          var d = c[b];
          ++b;
          if (d != null) {
            if (d.Cd == a) {
              d.show();
            } else {
              d.oh();
            }
          }
        }
        b = 0;
        for (c = this.Kp; b < c.length;) {
          d = c[b];
          ++b;
          if (d != null) {
            if (d.Cd == a) {
              d.show();
            } else {
              d.oh();
            }
          }
        }
      }
    }
    update(a) {
      function b(w) {
        w.Vh(new Vec2(-w.sb.x / v46, -w.sb.y / v46 + v45), a);
      }
      function c(w, H, I) {
        let R = H.x;
        H = H.y;
        let L = w.Gb;
        let N = w.Xb;
        let O = w.Vc;
        w = w.qd;
        if (Rect.$j(L.x + R, L.y + H, N.x + R, N.y + H, I.g.x - 16, I.g.y - 16, 32, 32)) {
          return true;
        } else {
          return Rect.$j(O.x + R, O.y + H, w.x + R, w.y + H, I.g.x - 16, I.g.y - 16, 32, 32);
        }
      }
      function d(w, H) {
        if (Rect.$j(w.Gb.x, w.Gb.y, w.Xb.x, w.Xb.y, H.g.x - 6, H.g.y - 6, 12, 12)) {
          return true;
        } else {
          return Rect.$j(w.Vc.x, w.Vc.y, w.qd.x, w.qd.y, H.g.x - 6, H.g.y - 6, 12, 12);
        }
      }
      super.update(a);
      let e = 0;
      let f = this.Bu;
      while (e < f.length) {
        f[e++].update(a);
      }
      let g = this.um;
      if (g != null) {
        g.update(a);
      }
      let h = 0;
      while (h < 5) {
        let w = this.Fj[h++];
        let H = w.length;
        let I = 0;
        while (I < H) {
          let R = w[I];
          let L = PathResolver.ek(R.color.a, 0, 10, a);
          R.color.a = L.value;
          if (L.sk) {
            w.splice(I, 1);
            --H;
          } else {
            ++I;
          }
        }
      }
      if (this.dl == 0) {
        this.Tl += a;
        if (this.Tl > 30) {
          this.Tl = 0;
        }
      }
      let m = this.Ag / this.zg;
      let n = this.O.window.lo();
      let q = n.w / n.J;
      let p = m > 1 && q > 1 && q > m;
      switch (this.jl) {
        case 0:
          this.op += a;
          break;
        case 1:
          this.Ds += a * (this.CA ? 3 : 1);
          let w = 0;
          if (this.Ds >= 0) {
            w = Math.min(1, this.Ds / 2);
          }
          let H = Easing.quadInOut()(w);
          let I = this.Ah;
          let R = this.Qf;
          let L = new Vec4(I.x + (R.x - I.x) * H, I.y + (R.y - I.y) * H, 0, 1);
          if (p) {
            L = new Vec4(this.Ag / 2, this.zg / 2, 0, 1);
            w = 1;
            this.Bb.Kb.x = 0.5;
            this.Bb.Kb.y = 0.5;
          } else {
            if (this.ie.x > 0) {
              this.Bb.Kb.x = H;
            }
            if (this.ie.x < 0) {
              this.Bb.Kb.x = 1 - H;
            }
            if (this.ie.y > 0) {
              this.Bb.Kb.y = H;
            }
            if (this.ie.y < 0) {
              this.Bb.Kb.y = 1 - H;
            }
          }
          let N = this.Bb.g;
          N.x = L.x;
          N.y = L.y;
          if (w == 1) {
            this.CA = this.Ll = false;
            this.jl = 2;
            this.ii = 0;
            let G = this.Mc;
            G.x = this.Qf.x;
            G.y = this.Qf.y;
          }
          break;
        case 2:
          this.op += a;
          let O = this.Aa != 2 ? this.xa : this.da;
          this.ii += 0.05;
          if (this.ii > 1) {
            this.ii = 1;
          }
          if (p) {
            let G = this.Bb.Kb;
            G.x = 0.5;
            G.y = 0.5;
            let T = this.Bb.g;
            T.x = this.Ag / 2;
            T.y = this.zg / 2;
          } else {
            if (this.ie.x != 0) {
              let G = this.Bb.NN(O.g.x, O.g.y);
              if (G < 100) {
                G = 100;
              } else if (G > 300) {
                G = 300;
              }
              if (G <= 100) {
                this.ii = 1;
              }
              this.Mc.x += (O.g.x - this.Mc.x) * remap(G, 100, 300, 0.5, 0.1) * this.ii;
              let T = Math.min(this.Ah.x, this.Qf.x);
              let v12 = Math.max(this.Ah.x, this.Qf.x);
              if (this.Mc.x < T) {
                this.Mc.x = T;
              }
              if (this.Mc.x > v12) {
                this.Mc.x = v12;
              }
              this.Bb.g.x = this.Mc.x;
              this.Bb.Kb.x = remap(this.Mc.x, T, v12, 0, 1);
            }
            if (this.ie.y != 0) {
              let G = this.Bb.MN(O.g.x, O.g.y);
              if (G <= 100) {
                this.ii = 1;
              }
              if (G < 100) {
                G = 100;
              } else if (G > 300) {
                G = 300;
              }
              this.Mc.y += (O.g.y - this.Mc.y) * remap(G, 100, 300, 0.5, 0.1) * this.ii;
              let T = Math.min(this.Ah.y, this.Qf.y);
              let v13 = Math.max(this.Ah.y, this.Qf.y);
              if (this.Mc.y < T) {
                this.Mc.y = T;
              }
              if (this.Mc.y > v13) {
                this.Mc.y = v13;
              }
              this.Bb.g.y = this.Mc.y;
              this.Bb.Kb.y = remap(this.Mc.y, T, v13, 0, 1);
            }
          }
      }
      this.Bb.update();
      let v = this.Lc.length;
      let u = this;
      if (v > 0) {
        let w = false;
        let H = false;
        let I = false;
        let R = 0;
        let L = this.rc;
        while (R < L.length) {
          L[R++].NB = true;
        }
        let N = 0;
        while (N < v) {
          let O = this.Lc[N++];
          if (O == null) {
            continue;
          }
          O.update(a);
          let G = O.kb;
          if (this.se.yi() && G != null && G.yc == -1) {
            this.tk(true);
          } else {
            if (O.pb != null && G != null) {
              G.Jc.g.x = O.x;
              G.Jc.g.y = O.y;
              G.Jc.vh.Pb(G.Jc.g);
            }
            if (G != null) {
              if (G.yc != -1 && G.bh == 0) {
                O.Qu();
                continue;
              }
              G.update(a * this.Em);
              if (O.ve) {
                if (this.jl != 1 && !this.Ll) {
                  O.rT(a);
                }
                if (O.Gk == -1) {
                  this.ES(O);
                }
              }
            }
            if (O.Z != -1 && O.kb == null) {
              let T = function (W, p20) {
                if (new Vec2(p20.x, p20.y).sf(W.g) <= p20.Z + Star.bg) {
                  W = new Rope(u.ma(6), null, p20.x, p20.y, W, W.g.x, W.g.y, p20.Z + Star.bg);
                  W.Jc.vh.Pb(W.Jc.g);
                  p20.po = true;
                  p20.eE(W);
                  SoundFx.play(SoundFx.rope_get);
                  if (p20.pb != null) {
                    SoundFx.play(SoundFx.buzz);
                  }
                  return true;
                } else {
                  return false;
                }
              };
              if (this.Aa != 2) {
                if (!this.kd) {
                  if (T(this.xa, O)) {
                    this.yn();
                  }
                }
                if (!this.ld && O.kb == null) {
                  if (T(this.Ja, O)) {
                    this.yn();
                  }
                }
              } else if (T(this.da, O)) {
                this.yn();
              }
              let vLN04 = 0;
              let v14 = this.rc;
              while (vLN04 < v14.length) {
                T(v14[vLN04++].constraint, O);
              }
            }
            if (G != null) {
              let T = G.za[G.za.length - 1];
              let v15 = false;
              if (!w) {
                if (this.Aa != 2) {
                  if (T != this.xa || this.kd || H) {
                    if (T == this.Ja && !this.ld && !I) {
                      v15 = true;
                    }
                  } else {
                    v15 = true;
                  }
                } else if (!this.tc && !w) {
                  v15 = true;
                }
              }
              if (G.Fw != 0 && G.yc == -1 && v15) {
                let v16 = Vec2.Ia(G.Jc.g, T.g).km() * RAD2DEG;
                if (this.Aa != 2) {
                  let W = T == this.xa ? this.Ma : this.Na;
                  if (!G.Mn) {
                    G.rh = W.rotation - v16;
                  }
                  if (T == this.xa) {
                    this.Bo = v16 + G.rh - W.rotation;
                    H = true;
                  } else {
                    this.Co = v16 + G.rh - W.rotation;
                    I = true;
                  }
                  this.I.rotation = v16 + G.rh;
                  W.rotation = v16 + G.rh;
                } else {
                  if (!G.Mn) {
                    G.rh = this.I.rotation - v16;
                  }
                  this.I.vg = v16 + G.rh - this.I.rotation;
                  this.I.rotation = v16 + G.rh;
                  w = true;
                }
                G.Mn = true;
              } else {
                G.Mn = false;
              }
            }
          }
        }
        if (this.Aa != 2) {
          if (!H && !this.kd) {
            this.Ma.rotation += Math.min(5, this.Bo);
            this.Bo *= 0.98;
          }
          if (!I && !this.ld) {
            this.Na.rotation += Math.min(5, this.Co);
            this.Co *= 0.98;
          }
        } else if (!w && !this.tc) {
          this.I.rotation += Math.min(5, this.I.vg);
          this.I.vg *= 0.98;
        }
      }
      let A = 0;
      let D = this.rc;
      while (A < D.length) {
        let w = D[A];
        ++A;
        if (!w.NB) {
          w.rotation += Math.min(5, w.vg);
          w.vg *= 0.98;
        }
      }
      if (this.$c) {
        let w = 0;
        let H = this.rc;
        while (w < H.length) {
          let L = H[w];
          ++w;
          let N = L.constraint;
          if (!this.Ve) {
            if (Vec2.nd(N.g.x, N.g.y, this.Ka.x, this.Ka.y) < L.cC) {
              this.Ka.Lm(true);
            } else {
              this.Ka.Lm(false);
            }
            let O = 0;
            let G = this.ab;
            while (O < G.length) {
              let T = G[O];
              ++O;
              T.Lm(Vec2.nd(N.g.x, N.g.y, T.x, T.y) < L.cC);
            }
          }
        }
        let I = 0;
        let R = this.rc;
        while (I < R.length) {
          let L = R[I];
          ++I;
          if (L.Gc != null) {
            continue;
          }
          let N = Star.bg * 2;
          if (this.Aa == 2) {
            if (!this.tc && this.I.Gc == null) {
              this.rB(L.constraint, this.da, N);
            }
          }
          let O = 0;
          let G = this.rc;
          while (O < G.length) {
            let T = G[O];
            ++O;
            if (L != T && T.Gc == null) {
              this.rB(L.constraint, T.constraint, N);
            }
          }
        }
      }
      if (a > 0) {
        let w = a;
        while (w >= 0) {
          w -= 0.01;
          this.nc.update(Math.min(0.01, w));
          this.nc.nl(this.bubbles);
          this.nc.nl(this.ab);
          this.nc.nl(this.wj);
          this.nc.nl(this.Gh);
          this.nc.nl(this.ej);
          this.nc.nl(this.Ri);
        }
      }
      if (!this.tc) {
        this.I.update(a);
        this.di -= a;
        if (this.di <= 0) {
          if (!this.se.yi()) {
            this.da.update(a * this.Em);
          }
        }
      }
      if (this.Aa != 2) {
        let w = a * this.Em;
        this.di -= a;
        this.Ma.update(a);
        if (this.di <= 0) {
          this.xa.update(w);
        }
        this.Na.update(a);
        if (this.di <= 0) {
          this.Ja.update(w);
        }
        if (this.Aa == 1) {
          let H = 0;
          while (H < 30) {
            ++H;
            this.xa.As();
            this.Ja.As();
          }
        }
        if (this.Li > 0) {
          let H = PathResolver.ek(this.Li, 0, 200, a);
          this.Li = H.value;
          if (H.sk) {
            SoundFx.play(SoundFx.candy_link);
            this.Aa = 2;
            this.tc = false;
            this.ld = this.kd = true;
            let I = false;
            let R = false;
            let L = 0;
            let N = this.Af;
            while (L < N.length) {
              let v17 = N[L];
              ++L;
              if (v17 != null) {
                if (this.xc != null && v17.ca == this.xc) {
                  I = true;
                }
                if (this.pc != null && v17.ca == this.pc) {
                  R = true;
                }
              }
            }
            if (this.xc != null && this.pc != null && I && R) {
              this.lE = true;
            } else if (this.xc == null || !I) {
              if (this.pc == null || !R) {
                if (this.xc != null || this.pc != null) {
                  let vLN05 = 0;
                  let v18 = this.Af;
                  while (vLN05 < v18.length) {
                    let v19 = v18[vLN05];
                    ++vLN05;
                    if (v19 != null) {
                      if (this.xc != null && v19.ca == this.xc) {
                        v19.mg = true;
                        v19.Si(1);
                      }
                      if (this.pc != null && v19.ca == this.pc) {
                        v19.mg = true;
                        v19.Si(1);
                      }
                    }
                  }
                }
              }
            }
            if (this.xc != null || this.pc != null) {
              this.gd = this.xc ?? this.pc;
              this.yj.show();
              this.zj.oh();
              this.Aj.oh();
            }
            this.Co = this.Bo = this.I.vg = 0;
            this.da.g.x = this.xa.g.x;
            this.da.g.y = this.xa.g.y;
            this.I.x = this.da.g.x;
            this.I.y = this.da.g.y;
            let O = Vec2.Ia(this.xa.g, this.xa.ha);
            let G = Vec2.Ia(this.Ja.g, this.Ja.ha);
            let T = new Vec2((O.x + G.x) / 2, (O.y + G.y) / 2);
            this.da.ha.Pb(this.da.g);
            this.da.ha.Ax(T);
            let vLN06 = 0;
            let v20 = this.Lc;
            while (vLN06 < v20.length) {
              let v21 = v20[vLN06++].kb;
              if (v21 != null && v21.yc != v21.za.length - 3 && (v21.Mb == this.xa || v21.Mb == this.Ja)) {
                let v22 = v21.za[v21.za.length - 2];
                let v23 = v21.Mb.zh(v22);
                this.da.al(v22, v23, 0);
                v21.Mb = this.da;
                v21.za[v21.za.length - 1] = this.da;
                v21.rh = 0;
                v21.Mn = false;
              }
            }
            this.Ma.T.free();
            this.Na.T.free();
            let W = new Sprite(null, Resources.I, Keys.hH);
            this.ma(11).P(W.u);
            W.setX(this.I.x);
            W.setY(this.I.y);
            W.center();
            W.pa().WC(v157);
          } else {
            this.xa.vq(this.Ja, this.Li);
            this.Ja.vq(this.xa, this.Li);
          }
        }
        if (!this.kd && !this.ld && this.Aa == 0) {
          this.Rm(this.xa, this.Ma);
          this.Rm(this.Ja, this.Na);
          if (Entity.yo(this.Ma, this.Na)) {
            this.Aa = 1;
            this.Li = this.xa.g.sf(this.Ja.g);
            this.xa.al(this.Ja, this.Li, 1);
            this.Ja.al(this.xa, this.Li, 1);
          }
        }
      }
      let B = 0;
      let K = this.rc;
      while (B < K.length) {
        let w = K[B];
        ++B;
        w.update(a);
        w.constraint.update(a * this.Em);
        let H = 0;
        while (H < 30) {
          ++H;
          w.constraint.As();
        }
      }
      this.Ka.update(a);
      if (this.kr >= 0) {
        this.kr -= a;
        if (this.kr < 0 && !this.$c) {
          this.Ka.JQ();
        }
      }
      if (this.sq >= 0) {
        this.sq -= a;
        if (this.sq < 0) {
          this.I.CQ();
        }
      }
      if (!this.Ll) {
        let w = 0;
        let H = this.ab;
        while (w < H.length) {
          let I = H[w];
          ++w;
          I.update(a);
          let R = [];
          if (this.tc) {
            if (this.Aa != 2) {
              if (this.Ma != null) {
                R.push(this.Ma);
              }
              if (this.Na != null) {
                R.push(this.Na);
              }
            }
          } else {
            R.push(this.I);
          }
          if (this.Rl && !this.sh && !I.MO) {
            let L = 0;
            while (L < R.length) {
              let N = R[L];
              ++L;
              let O = N.x - I.x;
              let G = N.y - I.y;
              if (Math.sqrt(O * O + G * G) < 95) {
                I.pb = I.pb != null ? SeekerPath.HB(N, I.pb.g) : SeekerPath.HB(N, new Vec2(I.x, I.y));
                I.MO = true;
                SoundFx.play(SoundFx.magnet_attract);
              }
            }
          }
          if (I.timeout > 0 && I.time == 0) {
            this.nc.remove(I);
            Std.remove(this.ab, I);
            let L = I.j;
            L.nb(0).tween().alpha(0, 0.25);
            L.nb(1).tween().scale(0, 0.25);
            L.nb(2).tween().scale(0, 0.25, null, null, cachedBind(I, I.free));
            break;
          } else {
            let L = false;
            if (this.Aa != 2) {
              this.Rm(this.xa, this.Ma);
              this.Rm(this.Ja, this.Na);
              L = Entity.yo(this.Ma, I) && !this.kd || Entity.yo(this.Na, I) && !this.ld;
            } else {
              this.Rm(this.da, this.I);
              L = Entity.yo(this.I, I) && !this.tc;
            }
            if ((!this.$c || !I.fe) && !!this.$c) {
              L = false;
            }
            if (L) {
              this.I.XC();
              this.Ap++;
              this.Fi.uw(this.Ap);
              let N = new Sprite(null, Resources.Oa, Keys.kI);
              N.setX(I.x);
              N.setY(I.y);
              N.setUniformScale(0.4);
              N.pa().WC(STAR_DISAPPEAR_ANIM);
              N.center();
              this.Zi.P(N.u);
              I.free();
              this.nc.remove(I);
              Std.remove(this.ab, I);
              SoundFx.play([1013, 1012, 1011][this.Ap - 1]);
              if (this.Ka.IO()) {
                this.Ka.YC();
              }
              break;
            }
          }
        }
      }
      let E = 0;
      let v24 = this.bubbles;
      while (E < v24.length) {
        let w = v24[E];
        ++E;
        w.update(a);
        if (!w.bs) {
          if (this.Aa != 2) {
            if (!this.kd && this.Nv(w, this.Ma, this.xc, this.zj)) {
              this.xc = w;
              break;
            }
            if (!this.ld && this.Nv(w, this.Na, this.pc, this.Aj)) {
              this.pc = w;
              break;
            }
          } else if (!this.tc && this.Nv(w, this.I, this.gd, this.yj)) {
            this.gd = w;
            break;
          }
        }
        let H = 0;
        let I = this.rc;
        while (H < I.length) {
          let R = I[H];
          ++H;
          if (!w.bs && Rect.lk(R.x, R.y, w.x - 34, w.y - 34, 68, 68)) {
            let L = false;
            let N = 0;
            let O = this.Af;
            while (N < O.length) {
              let G = O[N];
              ++N;
              if (G.ca == w) {
                G.mg = false;
                L = true;
              }
            }
            if (R.ca == null || !L) {
              if (R.ca != null) {
                this.vm(w.x, w.y);
                let G = 0;
                let T = this.Af;
                while (G < T.length) {
                  let v25 = T[G];
                  ++G;
                  if (v25.ca == R.ca) {
                    v25.mg = true;
                    v25.Si(1);
                  }
                }
                R.ca = null;
              }
              R.ca = w;
              R.Gn.show();
              SoundFx.play(SoundFx.bubble);
              w.pop();
            }
          }
        }
        if (!w.qF) {
          let R = this.Vd.length;
          let L = 0;
          while (L < R) {
            let N = this.Vd[L++];
            if (Vec2.nd(w.x, w.y, N.x, N.y) < N.Fh) {
              w.qF = true;
            }
          }
        }
      }
      let vLN07 = 0;
      let V = this.Lp;
      while (vLN07 < V.length) {
        V[vLN07++].update(a);
      }
      let vLN08 = 0;
      let v26 = this.Kp;
      while (vLN08 < v26.length) {
        v26[vLN08++].update(a);
      }
      let v27 = -1;
      let vLN09 = 0;
      let v28 = this.Vd.length;
      while (vLN09 < v28) {
        let w = this.Vd[vLN09];
        let H = 0;
        while (H < v) {
          let L = this.Lc[H++];
          let N = w.kg.indexOf(L);
          if (Vec2.nd(L.x, L.y, w.x, w.y) <= w.Fh + this.ga * 5) {
            if (N < 0) {
              w.kg.push(L);
            }
          } else if (N >= 0) {
            Std.remove(w.kg, L);
          }
        }
        let I = this.bubbles.length;
        let R = 0;
        while (R < I) {
          let L = this.bubbles[R++];
          let N = w.kg.indexOf(L);
          if (Vec2.nd(L.x, L.y, w.x, w.y) <= w.Fh + this.ga * 10) {
            if (N < 0) {
              w.kg.push(L);
            }
          } else if (N >= 0) {
            Std.remove(w.kg, L);
          }
        }
        if (w.ET) {
          v27 = vLN09;
        }
        w.update(a);
        ++vLN09;
      }
      if (v27 >= 0) {
        this.Vd[v27].free();
        this.Vd.splice(v27, 1);
      }
      let vLN010 = 0;
      let v29 = this.Gh;
      while (vLN010 < v29.length) {
        let w = v29[vLN010];
        ++vLN010;
        w.update(a);
        let H = PathResolver.ek(w.xr, 0, 1, a);
        w.xr = H.value;
        if (H.sk) {
          w.state = 0;
        }
        let I = w.rotation;
        w.rotation = 0;
        w.Hd();
        w.rotation = I;
        w.Hd();
        let R = function (G) {
          let T = Sock.Sk * 2;
          return Rect.$j(w.Gb.x, w.Gb.y, w.Xb.x, w.Xb.y, G.g.x - Sock.Sk, G.g.y - Sock.Sk, T, T);
        };
        let L = function (G) {
          let T = Sock.Sk * 2;
          return Rect.$j(w.Vc.x, w.Vc.y, w.qd.x, w.qd.y, G.g.x - Sock.Sk, G.g.y - Sock.Sk, T, T);
        };
        if (w.state != 0) {
          continue;
        }
        if (this.Aa == 2 && this.I.Gc == null) {
          let G = this.da.xd.Zb();
          G.rotate(-I * DEG2RAD);
          if (G.y >= 0 && (R(this.da) || L(this.da))) {
            let T = 0;
            let v30 = this.Gh.length;
            while (T < v30) {
              let v31 = this.Gh[T++];
              if (v31 != w && v31.group == w.group) {
                v31.state = 1;
                v31.xr = 0.8;
                this.tk(false);
                this.I.Rw = this.da.sb.Rb() * 0.9 * LevelController.Ty;
                this.I.Gc = v31;
                w.qc.L(true);
                w.qc.pa().play(v167);
                SoundFx.play(SoundFx.teleport);
                let W = this;
                let v32 = this.I;
                this.delay(function () {
                  W.KE(v32);
                }, 0.1);
                break;
              }
            }
          }
        }
        let N = 0;
        let O = this.rc;
        while (N < O.length) {
          let G = O[N];
          ++N;
          if (G.Gc != null) {
            continue;
          }
          let T = G.constraint.xd.Zb();
          T.rotate(-I * DEG2RAD);
          if (T.y >= 0 && R(G.constraint) || L(G.constraint)) {
            let vLN011 = 0;
            let v33 = this.Gh.length;
            while (vLN011 < v33) {
              let W = this.Gh[vLN011++];
              if (W != w && W.group == w.group) {
                W.state = 1;
                W.xr = 0.8;
                this.jR(G);
                G.Rw = G.constraint.sb.Rb() * 0.9;
                G.Gc = W;
                w.qc.L(true);
                w.qc.pa().play(v167);
                SoundFx.play(SoundFx.teleport);
                let vThis2 = this;
                let vG = G;
                this.delay(function () {
                  vThis2.KE(vG);
                }, 0.1);
                break;
              }
            }
          }
        }
      }
      let vLN012 = 0;
      let v34 = this.Af;
      while (vLN012 < v34.length) {
        v34[vLN012++].update(a);
      }
      let vLN013 = 0;
      let v35 = this.Ri;
      while (vLN013 < v35.length) {
        let w = v35[vLN013];
        ++vLN013;
        w.update(a);
        let H = PathResolver.ek(w.Gp, 0, 1, a);
        w.Gp = H.value;
        if (H.sk) {
          this.uQ(w, a);
        }
      }
      let vLN014 = 0;
      let v36 = this.ej;
      while (vLN014 < v36.length) {
        let w = v36[vLN014];
        ++vLN014;
        if (w != null) {
          w.update(a);
          if (w.Ee != 3) {
            this.vQ(w, a);
          }
        }
      }
      let vLN015 = 0;
      let v37 = this.Ul;
      while (vLN015 < v37.length) {
        let w = v37[vLN015];
        ++vLN015;
        if (w != null && (w.update(a), !this.sh && w.Xj == 0 && Vec2.nd(this.da.g.x, this.da.g.y, w.x, w.y) < 32)) {
          this.sh = true;
          this.I.oe = false;
          this.I.j.tween().scale(0.3, 0.1);
          this.I.j.tween().alpha(0, 0.1);
          this.I.j.tween().tF(w.x, w.y);
          this.tk(false);
          if (this.gd != null) {
            this.mk(this.gd, false);
          }
          let H = this.da;
          let I = w;
          this.delay(function () {
            I.jA(H);
          }, 0.05);
          this.aF(3);
        }
      }
      let vLN016 = 0;
      let v38 = this.Dd;
      while (vLN016 < v38.length) {
        v38[vLN016++].update(a);
      }
      if (this.Ve && !this.sh) {
        let w = 0;
        let H = this.Dd;
        while (w < H.length) {
          let I = H[w];
          ++w;
          let R = false;
          if (!I.ce || I.wl) {
            if (this.Aa != 2) {
              if (R = !this.kd && d(I, this.xa)) {
                this.Dv(I, this.Ma.constraint, a);
              }
              if (R = !this.ld && d(I, this.Ja)) {
                this.Dv(I, this.Na.constraint, a);
              }
            } else if (R = !this.tc && d(I, this.da)) {
              this.Dv(I, this.I.constraint, a);
            }
            if (!R) {
              I.Ck = false;
            }
          }
        }
      } else if (!this.sh) {
        let w = 0;
        let H = this.Dd;
        while (w < H.length) {
          let I = H[w];
          ++w;
          if (!I.ce || I.wl) {
            let R = false;
            let L = false;
            if (this.Aa != 2) {
              if (R = !this.kd && d(I, this.xa)) {
                L = true;
              } else {
                R = !this.ld && d(I, this.Ja);
              }
            } else {
              R = !this.tc && d(I, this.da);
            }
            if (R) {
              if (this.Aa != 2) {
                if (L) {
                  if (this.xc != null) {
                    this.mk(this.xc, true);
                  }
                } else if (this.pc != null) {
                  this.mk(this.pc, false);
                }
              } else if (this.gd != null) {
                this.mk(this.gd, false);
              }
              let N = new CandyShatterParticles(this, 5);
              this.Bu.push(N);
              if (this.Rd != null && !this.si) {
                N.Kb.y = -500;
                N.angle = 90;
              }
              if (this.Aa != 2) {
                if (L) {
                  N.x = this.Ma.x;
                  N.y = this.Ma.y;
                  this.kd = true;
                } else {
                  N.x = this.Na.x;
                  N.y = this.Na.y;
                  this.ld = true;
                }
              } else {
                N.x = this.I.x;
                N.y = this.I.y;
                this.tc = true;
                this.I.free();
              }
              N.Qm(5);
              SoundFx.play(SoundFx.candy_break);
              this.tk(L);
              if (this.Cm) {
                return;
              }
              this.delay(cachedBind(this, this.fv), 0.3);
              return;
            }
          }
        }
      }
      let vLN017 = 0;
      let v39 = this.wj;
      while (vLN017 < v39.length) {
        let w = v39[vLN017];
        ++vLN017;
        w.update(a);
        let H = Vec2.Ia(new Vec2(w.x, w.y), w.es);
        let I = H.Rb();
        let R = 1;
        let L = new Vec2(0, 0);
        if (I >= 1) {
          R = I | 0;
          L = Vec2.bq(H, R);
        }
        let N = new Vec2(0, 0);
        let O = false;
        let G = false;
        if (this.Aa != 2) {
          O = false;
          let W = 0;
          let vR = R;
          while (W < vR) {
            let v40 = Vec2.Ob(L, W++);
            if (O = O || c(w, v40, this.xa)) {
              N = v40.Zb();
              break;
            }
          }
          if (O = O && !this.kd) {
            G = true;
          } else {
            O = false;
            let vLN018 = 0;
            let vR2 = R;
            while (vLN018 < vR2) {
              let v41 = Vec2.Ob(L, vLN018++);
              if (O = O || c(w, v41, this.Ja)) {
                N = v41.Zb();
                break;
              }
            }
            O = O && !this.ld;
          }
        } else {
          O = false;
          let W = 0;
          let vR3 = R;
          while (W < vR3) {
            let v42 = Vec2.Ob(L, W++);
            if (O = O || c(w, v42, this.da)) {
              N = v42.Zb();
            }
          }
          O = O && !this.tc;
        }
        let T = function (W) {
          W.g.x += H.x - N.x;
          W.g.y += H.y - N.y;
          W.ha.x += H.x - N.x;
          W.ha.y += H.y - N.y;
        };
        if (O) {
          if (this.Aa != 2) {
            if (G) {
              T(this.xa);
              this.pr(w, this.xa, a);
            } else {
              T(this.Ja);
              this.pr(w, this.Ja, a);
            }
          } else {
            T(this.da);
            this.pr(w, this.da, a);
          }
        } else {
          w.Ck = false;
        }
        O = false;
        let vLN019 = 0;
        let v43 = this.rc;
        while (vLN019 < v43.length) {
          let W = v43[vLN019];
          ++vLN019;
          O = false;
          let vLN020 = 0;
          let vR4 = R;
          while (vLN020 < vR4) {
            let v44 = vLN020++;
            O = O || c(w, Vec2.Ob(L, v44), W.constraint);
          }
          if (O) {
            T(W.constraint);
            this.pr(w, W.constraint, a);
          } else {
            w.Ck = false;
          }
        }
        w.oA();
      }
      this.se.update(a);
      if (!this.se.yi() && this.se.yu(this.da)) {
        this.se.Du(this.da);
        this.tk(true);
        this.I.vg = 0;
        this.aF(4);
      }
      this.Ic.update(a);
      if (!this.hg && this.I.Gc == null && this.Ve) {
        if (this.Aa != 2) {
          if (!this.kd) {
            let w = this.Ma.constraint.g.x - this.Ic.x;
            let H = this.Ma.constraint.g.y - this.Ic.y;
            if (Math.sqrt(w * w + H * H) <= Star.bg * 2) {
              this.Ic.Iu();
              this.Fi.rw();
              this.hg = true;
            }
          }
          if (!this.ld) {
            let w = this.Na.constraint.g.x - this.Ic.x;
            let H = this.Na.constraint.g.y - this.Ic.y;
            if (Math.sqrt(w * w + H * H) <= Star.bg * 2) {
              this.Ic.Iu();
              this.hg = true;
              this.Fi.rw();
            }
          }
        } else {
          let w = this.I.constraint.g.x - this.Ic.x;
          let H = this.I.constraint.g.y - this.Ic.y;
          if (Math.sqrt(w * w + H * H) <= Star.bg * 2) {
            this.Ic.Iu();
            this.Fi.rw();
            this.hg = true;
          }
        }
      }
      let v45 = Character.BF * (this.Rd == null || this.si ? 1 : -1);
      let v46 = Character.AF;
      if (this.Aa == 0) {
        if (this.xc != null) {
          b(this.xa);
        }
        if (this.pc != null) {
          b(this.Ja);
        }
      }
      if (this.Aa == 1) {
        if (this.xc != null || this.pc != null) {
          b(this.xa);
          b(this.Ja);
        }
      } else if (this.gd != null && !this.se.yi()) {
        b(this.da);
      }
      let vLN021 = 0;
      let v47 = this.rc;
      while (vLN021 < v47.length) {
        let w = v47[vLN021];
        ++vLN021;
        if (w.ca != null) {
          b(w.constraint);
        }
      }
      let v48;
      if (!this.tc && !this.Nr) {
        if (this.iw) {
          if (this.Ro > 0) {
            this.Ro = PathResolver.dk(this.Ro, 0, 1, a);
            if (this.Ro <= 0) {
              v48 = new Vec2(this.Ka.x, this.Ka.y);
              if (this.da.g.sf(v48) > OmNom.Iy) {
                this.iw = false;
                this.Ka.MQ();
                SoundFx.play(SoundFx.monster_close);
              } else {
                this.Ro = 1;
              }
            }
          }
        } else {
          let w = true;
          if (this.sh) {
            w = false;
          } else if (this.$c && !this.Ka.fe) {
            w = false;
          }
          if (w) {
            v48 = new Vec2(this.Ka.x, this.Ka.y);
            if (this.da.g.sf(v48) < OmNom.Iy) {
              this.iw = true;
              this.Ka.NQ();
              SoundFx.play(SoundFx.monster_open);
              this.Ro = 1;
            }
          }
        }
        if (!this.Cm && !this.iA && (!this.$c || this.$c && this.Ka.fe) && this.bN(this.I, this.gd, this.Ka, this.da)) {
          this.tc = this.iA = true;
          this.Dl();
          return;
        }
      }
      if (this.Ve) {
        if (this.Aa != 2) {
          this.Cv(this.Ma.constraint);
          this.Cv(this.Na.constraint);
        } else {
          this.Cv(this.I.constraint);
        }
        this.xn += a;
        if (this.ci[0] && (this.fg.isActive || (this.Ka.GQ(), this.fg.TD(true)), this.xn > 0.3)) {
          let w = new Vec2(this.nk[0].x, this.nk[0].y);
          let H;
          H = this.xn < 0.15 ? (this.xn - 0.3) / 0.15 * 70 : 70;
          let I = this.fg.Qi.x;
          let R = this.fg.Qi.y;
          let L;
          let N;
          if (this.Aa == 2) {
            L = I - this.I.constraint.g.x;
            N = R - this.I.constraint.g.y;
            let O = Math.sqrt(L * L + N * N);
            let G = Vec2.Ia(this.I.constraint.g, w);
            G.normalize();
            if (O <= 200) {
              H *= 1 - O * 0.005;
              this.I.constraint.Vh(Vec2.Ob(G, H), a);
            }
          } else {
            L = I - this.Ma.constraint.g.x;
            N = R - this.Ma.constraint.g.y;
            let O = Math.sqrt(L * L + N * N);
            L = I - this.Na.constraint.g.x;
            N = R - this.Na.constraint.g.y;
            let G = Math.sqrt(L * L + N * N);
            let T = Vec2.Ia(this.Ma.constraint.g, w);
            T.normalize();
            let v49 = Vec2.Ia(this.Na.constraint.g, w);
            v49.normalize();
            if (O <= 200) {
              this.Ma.constraint.Vh(Vec2.Ob(T, H * (1 - O * 0.005)), a);
            }
            if (G <= 200) {
              this.Na.constraint.Vh(Vec2.Ob(v49, H * (1 - G * 0.005)), a);
            }
          }
        }
        if (this.ci[0]) {
          if (this.Aa == 2) {
            let w = Vec2.Ia(this.I.constraint.g, this.I.constraint.ha);
            if (w.Rb() > 3) {
              w.normalize();
              this.I.constraint.g = Vec2.tb(this.I.constraint.ha, Vec2.Ob(w, 3));
            }
          } else {
            let w = Vec2.Ia(this.Ma.constraint.g, this.Ma.constraint.ha);
            if (w.Rb() > 3) {
              w.normalize();
              this.Ma.constraint.g = Vec2.tb(this.Ma.constraint.ha, Vec2.Ob(w, 3));
            }
            let H = Vec2.Ia(this.Na.constraint.g, this.Na.constraint.ha);
            if (H.Rb() > 3) {
              H.normalize();
              this.Na.constraint.g = Vec2.tb(this.Na.constraint.ha, Vec2.Ob(H, 3));
            }
          }
        }
      }
      let v50 = this.Aa == 2 && this.Ni(this.da) && !this.tc;
      let v51 = this.Aa != 2 && !this.kd && this.Ni(this.xa);
      let v52 = this.Aa != 2 && !this.ld && this.Ni(this.Ja);
      let v53 = this.$c;
      let vA2 = [];
      if (this.Ve) {
        v53 = false;
      }
      if (!this.Nr) {
        let w = 0;
        let H = this.rc;
        while (w < H.length) {
          let I = H[w];
          ++w;
          if (!this.Ni(I.constraint)) {
            v53 = false;
            break;
          }
          if (this.Ve) {
            vA2.push(I);
          }
        }
      }
      let vLN022 = 0;
      while (vLN022 < vA2.length) {
        Std.remove(this.rc, vA2[vLN022++]);
      }
      if (!!this.Wr && !v50 && !v51 && !v52 && !v53) {
        this.Wr = false;
      }
      if (LevelState.box == 13 && LevelState.level == 22) {
        v52 = false;
      }
      if (this.jl != 1 && !this.Wr && (v50 || v51 || v52 || v53)) {
        let w = false;
        if (this.Aa == 2 && this.tc || this.Aa != 2 && (this.kd || this.ld) || this.Nr) {
          w = true;
        }
        if (v50) {
          this.tc = true;
        }
        if (v51) {
          this.kd = true;
        }
        if (v52) {
          this.ld = true;
        }
        if (v53) {
          this.Nr = true;
        }
        if (!this.Cm && !w) {
          this.fv();
        }
      }
      if (this.Cd == 1 && !this.tc && this.gd != null && this.I.y < LevelController.DF && this.I.x > LevelController.CF) {
        let w = this.Cd = 0;
        let H = this.Lp;
        while (w < H.length) {
          let L = H[w];
          ++w;
          if (L.Cd == 1) {
            L.show();
          }
        }
        let I = 0;
        let R = this.Kp;
        while (I < R.length) {
          let L = R[I];
          ++I;
          if (L.Cd == 1) {
            L.show();
          }
        }
      }
      this.qu.update();
      this.Zi.tickAnims(a);
      if (this.Ff != null) {
        this.Ff.update(a);
      }
      if (this.fg != null) {
        if (this.ci[0]) {
          this.fg.Qi = new Vec2(this.nk[0].x, this.nk[0].y);
        }
        this.fg.update(a);
        this.Md.update(a);
        this.Cn.update(a);
      }
    }
    render() {
      for (var a = 0, b = this.Bu; a < b.length;) {
        b[a++].M();
      }
      a = this.um;
      if (a != null) {
        a.M();
      }
      this.Ka.M();
      a = 0;
      for (b = this.Vd; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.bubbles; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.Ri; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.Dd; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.wj; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.Gh; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.Lc; a < b.length;) {
        b[a++].RM();
      }
      a = 0;
      for (b = this.Lc; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.ab; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.Af; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.ej; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.Ul; a < b.length;) {
        b[a++].M();
      }
      for (a = this.nc.iterator(); a.fb();) {
        a.next().M();
      }
      this.Ic.M();
      if (this.Ve) {
        this.fg.M();
        this.Md.M();
        this.Cn.M();
      }
      this.se.M();
      if (!this.tc) {
        if (this.I.Gc == null) {
          this.I.x = this.da.g.x;
          this.I.y = this.da.g.y;
          this.I.visible = true;
        } else {
          this.I.visible = false;
        }
        if (this.Rl && !this.sh && this.Ff != null) {
          this.Ff.x = this.I.x;
          this.Ff.y = this.I.y;
          this.Ff.M();
        }
      }
      if (this.yj != null) {
        this.yj.setX(this.I.x);
        this.yj.setY(this.I.y);
      }
      if (this.Aa != 2) {
        if (this.kd) {
          this.Ma.T.L(false);
        } else {
          this.Ma.x = this.xa.g.x;
          this.Ma.y = this.xa.g.y;
          this.Ma.M();
        }
        if (this.zj != null) {
          this.zj.setX(this.Ma.x);
          this.zj.setY(this.Ma.y);
        }
        if (this.ld) {
          this.Na.T.L(false);
        } else {
          this.Na.x = this.Ja.g.x;
          this.Na.y = this.Ja.g.y;
          this.Na.M();
        }
        if (this.Aj != null) {
          this.Aj.setX(this.Na.x);
          this.Aj.setY(this.Na.y);
        }
        this.I.visible = false;
      } else if (this.I.Gc == null) {
        this.I.visible = true;
      }
      this.I.M();
      a = 0;
      for (b = this.rc; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.Lp; a < b.length;) {
        b[a++].M();
      }
      a = 0;
      for (b = this.Kp; a < b.length;) {
        b[a++].M();
      }
      this.Zi.Gd();
      this.Zi.Um();
      this.O.V.cR(this.Bb.Ab);
      this.O.V.Iq(this.Zi);
      this.O.V.WQ();
    }
  }
  LevelController.i = true;
  LevelController.s = Node;
  Object.assign(LevelController.prototype, {
    l: LevelController
  });
  class LevelCamera {
    constructor() {
      this.Kb = new Vec4(0.5, 0.5, 0, 1);
      this.g = new Vec4(0, 0, 0, 1);
      this.Ok = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
      this.Ab = new Camera();
    }
    PO(a, b) {
      var c = Application.instance.window;
      var d = c.V.viewport;
      var e = c.Hc.x;
      var f = c.Hc.y;
      c = d.x * e | 0;
      let g = d.y * f | 0;
      e = d.w * e | 0;
      d = d.J * f | 0;
      let h = this.Ab.pk;
      let m = 1 / (h.m41 * a + h.m42 * b + h.m43 * 0 + h.m44);
      let n = e / 2;
      f = d / 2;
      let q = (h.m11 * a + h.m12 * b + h.m13 * 0 + h.m14) * m;
      a = (h.m21 * a + h.m22 * b + h.m23 * 0 + h.m24) * m;
      b = n * q + a * 0 + (n + c);
      a = q * 0 + -f * a + (f + g);
      if (b + 400 < 0 || a + 400 < 0 || b - 200 > c + e || a - 200 > g + d) {
        return false;
      } else {
        return true;
      }
    }
    MN(a, b) {
      let c = Application.instance.window.lo();
      a = this.Ab.rF(new Vec4(a, b, 0, 1), c);
      return Math.min(a.y, c.y + c.J - a.y);
    }
    NN(a, b) {
      let c = Application.instance.window.lo();
      a = this.Ab.rF(new Vec4(a, b, 0, 1), c);
      return Math.min(a.x, c.x + c.w - a.x);
    }
    update() {
      var a = Application.instance.window.pi();
      var b = this.Ok;
      var c = this.Ok;
      c = Math.min(a.x / (b.B - b.A), a.y / (c.G - c.D));
      this.Ab.Lb(new Vec4(a.x, a.y, 0, 1));
      this.Ab.qS(c);
      this.Ab.centerPivot();
      var d = b = this.Ok;
      d = new Bounds(0, 0, a.x, a.y).hi((b.B - b.A) / (d.G - d.D));
      b = (a.x - (d.B - d.A)) / c / 2;
      a = (a.y - (d.G - d.D)) / c / 2;
      c = this.Ab;
      d = c.position;
      d.x = this.g.x + (b + (-b - b) * this.Kb.x);
      d.y = this.g.y + (a + (-a - a) * this.Kb.y);
      c.Sr();
    }
  }
  LevelCamera.i = true;
  Object.assign(LevelCamera.prototype, {
    l: LevelCamera
  });
  class KeyState {
    constructor(a) {
      this.id = a;
      this.state = 0;
      this.ll = false;
    }
    reset() {
      this.state = 0;
    }
    Nb() {
      return this.state == 1;
    }
    qe() {
      return this.state == 3;
    }
    zo() {
      if (this.state != 1) {
        return this.state == 2;
      } else {
        return true;
      }
    }
    Ak(a) {
      if (this.state != a) {
        this.state = a;
        switch (a) {
          case 1:
            this.ll = true;
            break;
          case 3:
            this.ll = true;
        }
      }
    }
    update() {
      switch (this.state) {
        case 1:
          if (this.ll) {
            this.ll = false;
          } else {
            this.state = 2;
          }
          break;
        case 3:
          if (this.ll) {
            this.ll = false;
          } else {
            this.state = 0;
          }
      }
    }
  }
  KeyState.i = true;
  Object.assign(KeyState.prototype, {
    l: KeyState
  });
  class KeyCodeMap {
    static dv(a) {
      if (KEYBOARD_CODES == null) {
        buildKeyboardCodeTable();
      }
      return KEYBOARD_CODES.J[a];
    }
  }

  class InputDeviceBase {
    constructor() {
      this.state = null;
      this.enabled = true;
    }
  }
  InputDeviceBase.i = true;
  Object.assign(InputDeviceBase.prototype, {
    l: InputDeviceBase
  });
  class MultiInputDevice {
    constructor() {
      this.enabled = true;
      this.buttons = [];
    }
    update(a) {
      let b = 0;
      let c = this.buttons;
      while (b < c.length) {
        c[b++].update(a);
      }
    }
    jM() {
      let a = 0;
      let b = this.buttons;
      while (a < b.length) {
        b[a++].reset();
      }
    }
    Nb(a) {
      if (!this.enabled) {
        return false;
      }
      a = this.co(a);
      if (a == null) {
        return false;
      } else {
        return a.Nb();
      }
    }
    qe(a) {
      if (!this.enabled) {
        return false;
      }
      a = this.co(a);
      if (a == null) {
        return false;
      } else {
        return a.qe();
      }
    }
    reset() {
      this.buttons = [];
    }
    Oi(a) {
      let b = this.co(a);
      if (b == null) {
        b = new KeyState(a);
        this.buttons.push(b);
      }
      b.Ak(1);
    }
    release(a) {
      a = this.co(a);
      if (a != null) {
        a.Ak(3);
      }
    }
    co(a) {
      let b = 0;
      let c = this.buttons.length;
      while (b < c) {
        let d = this.buttons[b];
        if (d.id == a) {
          return d;
        }
        ++b;
      }
      return null;
    }
  }
  MultiInputDevice.i = true;
  Object.assign(MultiInputDevice.prototype, {
    l: MultiInputDevice
  });
  class KeyboardInputDevice extends InputDeviceBase {
    constructor(a) {
      super();
      this.target = a ?? window.document;
      this.state = new KeyboardState();
      this.events = new EventEmitter();
      this.rj();
      this.ZQ = [];
      this.event = null;
    }
    nv() {
      return 0;
    }
    VO(a) {
      if (this.enabled) {
        var b = KeyCodeMap.dv(a.code);
        if (b == KeyCodeMap.dv("")) {
          b = a.which;
        }
        if (this.ZQ[b]) {
          a.preventDefault();
        }
        if (!a.repeat) {
          this.state.Oi(b);
          this.event = a;
          this.events.emit(0, [b]);
          this.event = null;
        }
      }
    }
    XO(a) {
      if (this.enabled) {
        var b = KeyCodeMap.dv(a.code);
        this.state.release(b);
        this.event = a;
        this.events.emit(1, [b]);
        this.event = null;
      }
    }
    vT() {
      this.state.jM();
    }
    addDomListener(a, b, c) {
      this.target.addEventListener(a, b, c);
    }
    rj() {
      this.addDomListener("keydown", cachedBind(this, this.VO), true);
      this.addDomListener("keyup", cachedBind(this, this.XO), true);
      this.addDomListener("visibilitychange", cachedBind(this, this.vT), false);
    }
  }
  KeyboardInputDevice.i = true;
  KeyboardInputDevice.s = InputDeviceBase;
  Object.assign(KeyboardInputDevice.prototype, {
    l: KeyboardInputDevice
  });
  class KeyboardState extends MultiInputDevice {
    constructor() {
      super();
    }
    Nb(a) {
      return super.Nb(a);
    }
    qe(a) {
      return super.qe(a);
    }
  }
  KeyboardState.i = true;
  KeyboardState.s = MultiInputDevice;
  Object.assign(KeyboardState.prototype, {
    l: KeyboardState
  });
  class MouseInputDevice extends InputDeviceBase {
    constructor(a) {
      super();
      this.target = a ?? window;
      this.state = new MouseState();
      this.events = new EventEmitter();
      this.rj();
    }
    nv() {
      return 1;
    }
    Mr(a) {
      if (this.enabled) {
        this.oe(a);
        switch (a.which) {
          case 1:
            this.state.Oi(0);
            break;
          case 2:
            this.state.Oi(1);
            break;
          case 3:
            this.state.Oi(2);
        }
        this.events.emit(0, [a.which - 1]);
      }
    }
    RP(a) {
      if (this.enabled) {
        this.oe(a);
        switch (a.which) {
          case 1:
            this.state.release(0);
            break;
          case 2:
            this.state.release(1);
            break;
          case 3:
            this.state.release(2);
        }
        this.events.emit(1, [a.which - 1]);
      }
    }
    QP(a) {
      if (this.enabled) {
        this.oe(a);
        a = this.state.position;
        this.events.emit(2, [a.x, a.y]);
        this.state.Ye[1] = true;
      }
    }
    PP() {
      if (this.enabled) {
        this.state.left[1] = true;
        this.events.emit(3);
      }
    }
    OP() {
      if (this.enabled) {
        this.state.Tq[1] = true;
        this.events.emit(4);
      }
    }
    Zf(a) {
      if (this.enabled) {
        var b = this.state;
        b.wheelDelta[1] += a.deltaY | 0;
        this.events.emit(5, [b.wheelDelta[1]]);
      }
    }
    oe(a) {
      let b = a.clientX;
      let c = a.clientY;
      if (this.target instanceof Element) {
        var d = this.target.getBoundingClientRect();
        b -= d.left;
        c -= d.top;
      }
      d = window.devicePixelRatio;
      let e = this.state;
      e.fk[1].x += a.movementX;
      e.fk[1].y += a.movementY;
      a = e.position;
      a.x = b * d | 0;
      a.y = c * d | 0;
    }
    addDomListener(a, b, c) {
      this.target.addEventListener(a, b, c);
    }
    rj() {
      this.addDomListener("mousedown", cachedBind(this, this.Mr));
      this.addDomListener("mouseup", cachedBind(this, this.RP));
      this.addDomListener("mousemove", cachedBind(this, this.QP));
      this.addDomListener("mouseleave", cachedBind(this, this.PP));
      this.addDomListener("mouseenter", cachedBind(this, this.OP));
      this.addDomListener("wheel", cachedBind(this, this.Zf), {
        passive: true
      });
    }
  }
  MouseInputDevice.i = true;
  MouseInputDevice.s = InputDeviceBase;
  Object.assign(MouseInputDevice.prototype, {
    l: MouseInputDevice
  });
  class MouseState extends MultiInputDevice {
    constructor() {
      super();
      this.position = new Size(0, 0);
      this.fk = [new Size(0, 0), new Size(0, 0)];
      this.wheelDelta = [0, 0];
      this.left = [false, false];
      this.Tq = [false, false];
      this.Ye = [false, false];
    }
    update(a) {
      super.update(a);
      this.Ye[0] = this.Ye[1];
      this.Ye[1] = false;
      a = this.fk[0];
      let b = this.fk[1];
      a.x = b.x;
      a.y = b.y;
      a = this.fk[1];
      a.x = 0;
      a.y = 0;
      this.wheelDelta[0] = this.wheelDelta[1];
      this.wheelDelta[1] = 0;
      this.left[0] = this.left[1];
      this.left[1] = false;
      this.Tq[0] = this.Tq[1];
      this.Tq[1] = false;
    }
    cO() {
      return this.wheelDelta[0];
    }
    Nb(a) {
      return super.Nb(a);
    }
    qe(a) {
      return super.qe(a);
    }
  }
  MouseState.i = true;
  MouseState.s = MultiInputDevice;
  Object.assign(MouseState.prototype, {
    l: MouseState
  });
  class TouchInputDevice extends InputDeviceBase {
    constructor(a) {
      super();
      this.target = a ?? window;
      this.lC = 0;
      this.XD(1);
      this.state = new TouchState();
      this.events = new EventEmitter();
      this.xC = 4;
      this.ow = 0;
      this.touches = {};
      window.document.body.style.setProperty("touch-action", "none");
      this.rj();
    }
    XD(a) {
      this.lC = Math.min(a, 5);
    }
    nv() {
      return 3;
    }
    bO(a) {
      if (a < 4) {
        return 0;
      } else {
        return a - 4;
      }
    }
    TQ(a) {
      if (this.enabled) {
        if (a.pointerType == "mouse") {
          var b = a.button + 1;
          if (!(b > 3)) {
            this.oe(a, b);
            this.state.Oi(b);
            this.state.Oi(0);
            a = this.state.position[b];
            b = this.state.position[0];
            b.x = a.x;
            b.y = a.y;
          }
        } else if (this.ow != this.lC) {
          b = this.xC++;
          this.touches["" + a.pointerId] = b;
          this.oe(a, b);
          this.ow++;
          this.state.Oi(b);
          if (b == 4) {
            this.state.Oi(0);
            a = this.state.position[b];
            b = this.state.position[0];
            b.x = a.x;
            b.y = a.y;
          }
        }
      }
    }
    aD(a) {
      a.stopPropagation();
      if (this.enabled) {
        if (a.pointerType == "mouse") {
          a = a.button + 1;
          if (!(a > 3)) {
            this.state.release(a);
            this.state.release(0);
          }
        } else {
          var b = this.touches[a.pointerId];
          if (b != null) {
            delete this.touches[a.pointerId];
            this.oe(a, b);
            this.state.release(b);
            if (--this.ow == 0) {
              this.xC = 4;
              this.state.release(0);
              a = this.state.position[b];
              b = this.state.position[0];
              b.x = a.x;
              b.y = a.y;
            }
          }
        }
      }
    }
    SQ(a) {
      this.aD(a);
    }
    UQ(a) {
      if (this.enabled) {
        if (a.pointerType == "mouse") {
          this.oe(a, 0);
          this.state.Ye[0][1] = true;
        } else {
          var b = this.touches[a.pointerId];
          if (b != null) {
            this.oe(a, b);
            this.state.Ye[b][1] = true;
            if (b == 4) {
              this.state.Ye[0][1] = true;
              a = this.state.position[b];
              b = this.state.position[0];
              b.x = a.x;
              b.y = a.y;
            }
          }
        }
      }
    }
    oe(a, b) {
      let c = a.clientX;
      a = a.clientY;
      if (this.target instanceof Element) {
        var d = this.target.getBoundingClientRect();
        c -= d.left;
        a -= d.top;
      }
      d = window.devicePixelRatio;
      b = this.state.position[b];
      b.x = c * d | 0;
      b.y = a * d | 0;
    }
    addDomListener(a, b, c) {
      if (c == null) {
        c = false;
      }
      this.target.addEventListener(a, b, c);
      if (a == "pointerup") {
        window.addEventListener(a, b, c);
      }
    }
    rj() {
      this.addDomListener("pointerdown", cachedBind(this, this.TQ));
      this.addDomListener("pointerup", cachedBind(this, this.aD));
      this.addDomListener("pointercancel", cachedBind(this, this.SQ));
      this.addDomListener("pointermove", cachedBind(this, this.UQ));
    }
  }
  TouchInputDevice.i = true;
  TouchInputDevice.s = InputDeviceBase;
  Object.assign(TouchInputDevice.prototype, {
    l: TouchInputDevice
  });
  class TouchState extends MultiInputDevice {
    constructor() {
      super();
      var a = [];
      for (var b = 0; b < 9;) {
        ++b;
        a.push(new Size(TouchState.aq, TouchState.aq));
      }
      this.position = a;
      a = [];
      for (b = 0; b < 9;) {
        ++b;
        a.push([false, false]);
      }
      this.Ye = a;
      a = [];
      for (b = 0; b < 9;) {
        ++b;
        a.push(0);
      }
      this.os = a;
    }
    update(a) {
      super.update(a);
      for (a = 0; a < 9;) {
        var b = a++;
        this.Ye[b][0] = this.Ye[b][1];
        this.Ye[b][1] = false;
        var c = this.os[b];
        switch (c) {
          case 1:
            this.os[b] = 0;
            c = this.position[b];
            let d = TouchState.aq;
            c.x = d;
            c.y = d;
            if (b == 4) {
              b = this.position[0];
              c = TouchState.aq;
              b.x = c;
              b.y = c;
            }
            break;
          case 2:
            this.os[b] = c - 1;
        }
      }
    }
    oF(a) {
      return this.Ye[a][0];
    }
    Nb(a) {
      return super.Nb(a);
    }
    qe(a) {
      return super.qe(a);
    }
    zo(a) {
      let b = this.co(a);
      if (b == null) {
        return false;
      } else if (this.Nb(a)) {
        return true;
      } else {
        return b.zo();
      }
    }
    release(a) {
      super.release(a);
      if (a >= 4) {
        this.os[a] = 2;
      }
    }
  }
  TouchState.i = true;
  TouchState.s = MultiInputDevice;
  Object.assign(TouchState.prototype, {
    l: TouchState
  });
  // --------------------------------------------------------------------
  // Keys — sprite-sheet / animation frame name registry
  //
  // Each `Keys.<X>` is a string used as a lookup into texture-packer
  // JSON or animation manifests. The two-letter property names
  // come from the Haxe minifier; the values are the actual names.
  // Grouped here by the prefix of their value for skim-readability.
  // --------------------------------------------------------------------

  // -- _frame_indices --
  Keys.cH = "0000";
  Keys.dH = "0001";
  Keys.eH = "0002";
  Keys.fH = "0019";
  Keys.gH = "0020";
  Keys.hH = "0021";
  Keys.SH = "0000";
  Keys.VH = "0000";
  Keys.WH = "0011";
  Keys.XH = "0012";
  Keys.iH = "0000";
  Keys.My = "0000";
  Keys.TH = "0001";
  Keys.UH = "0002";
  Keys.HI = "0000";
  Keys.II = "0001";
  Keys.JI = "0002";
  Keys.KI = "0003";
  Keys.LI = "0004";
  Keys.MI = "0005";
  Keys.NI = "0006";
  Keys.OI = "0007";

  // -- _misc --
  Keys.mI = "glow";
  Keys.Jy = "idle";
  Keys.YH = "x1";
  Keys.ZH = "x2";
  Keys.aI = "x4";
  Keys.Ky = "button0";
  Keys.rH = "button1";
  Keys.KG = "button0";
  Keys.LG = "button1";
  Keys.MG = "button2";
  Keys.NG = "button3";
  Keys.OG = "x1";
  Keys.PG = "x2";
  Keys.QG = "x3";
  Keys.SG = "x4";
  Keys.GG = "bee0000";
  Keys.IG = "bee";
  Keys.HG = "bee0001";
  Keys.JG = "pollen";
  Keys.QI = "center";
  Keys.Py = "handle";
  Keys.Ry = "highlight";
  Keys.RI = "record";
  Keys.Sy = "sticker";
  Keys.pH = "body";
  Keys.qH = "face";
  Keys.FI = "pipe";
  Keys.GI = "valve";
  Keys.GH = "fire";
  Keys.mH = "idle";
  Keys.OH = "bottle";
  Keys.QH = "light";
  Keys.RH = "top";
  Keys.bI = "flash";
  Keys.hI = "particle";
  Keys.jI = "wave";
  Keys.JK = "CTRC";
  Keys.TK = "logo";
  Keys.nL = "star";
  Keys.rL = "zeptolab";
  Keys.YF = "tape0";
  Keys.ZF = "tape1";
  Keys.XF = "roll";
  Keys.VF = "cutter";
  Keys.rJ = "season1";
  Keys.sJ = "season2";
  Keys.tJ = "season3";
  Keys.Pt = "shelf";
  Keys.VI = "cover1";
  Keys.WI = "cover2";
  Keys.XI = "cover3";
  Keys.YI = "cover4";
  Keys.ZI = "cover5";
  Keys.Ot = "lock";
  Keys.Xy = "next";
  Keys.aJ = "particle0";
  Keys.bJ = "particle1";
  Keys.cJ = "particle2";
  Keys.dJ = "perfect";
  Keys.fJ = "cover6";
  Keys.gJ = "cover7";
  Keys.hJ = "cover8";
  Keys.iJ = "cover9";
  Keys.eJ = "cover10";
  Keys.jJ = "cover11";
  Keys.kJ = "cover12";
  Keys.lJ = "cover13";
  Keys.mJ = "cover14";
  Keys.nJ = "cover15";
  Keys.oJ = "cover16";
  Keys.pJ = "cover17";
  Keys.qJ = "label";
  Keys.uy = "front";
  Keys.vy = "side";

  // -- a --
  Keys.uH = "a_01";
  Keys.vH = "a_02";

  // -- album --
  Keys.mK = "album/album";
  Keys.nK = "album/popup_frame";
  Keys.oK = "album/spot";

  // -- auto --
  Keys.sH = "auto_01";
  Keys.tH = "auto_02";

  // -- b --
  Keys.zH = "b_01";
  Keys.AH = "b_02";

  // -- bar --
  Keys.wH = "bar_0";
  Keys.xH = "bar_1";
  Keys.yH = "bar_2";

  // -- blink --
  Keys.EF = "blink/0000";
  Keys.FF = "blink/";

  // -- blue --
  Keys.pK = "blue_star";

  // -- bubbles --
  Keys.Wp = "bubbles/";

  // -- buttons --
  Keys.cz = "button_antimagnet";
  Keys.qK = "button_antimagnet_active";
  Keys.rK = "button_antimagnet_enabled";
  Keys.sK = "button_antimagnet_enabled_hot";
  Keys.dz = "button_antimagnet_hot";
  Keys.ez = "button_audio_x";
  Keys.tK = "button_back";
  Keys.uK = "button_back_hot";
  Keys.fz = "button_magnet";
  Keys.vK = "button_magnet_active";
  Keys.wK = "button_magnet_enabled";
  Keys.xK = "button_magnet_enabled_hot";
  Keys.gz = "button_magnet_hot";
  Keys.yK = "button_music_hot";
  Keys.zK = "button_music_on";
  Keys.AK = "button_pause";
  Keys.BK = "button_pause_hot";
  Keys.CK = "button_restart";
  Keys.DK = "button_restart_hot";
  Keys.hz = "button_round";
  Keys.iz = "button_round_hot";
  Keys.Rt = "button_short";
  Keys.St = "button_short_hot";
  Keys.EK = "button_sound_hot";
  Keys.FK = "button_sound_on";
  Keys.Uk = "button_tiny";
  Keys.Vk = "button_tiny_hot";
  Keys.GK = "button_wide";
  Keys.HK = "button_wide_hot";

  // -- candy --
  Keys.jz = "candy/0000";
  Keys.IK = "candy/";
  Keys.kz = "candy/0002";

  // -- cheese --
  Keys.jH = "cheese_hole";

  // -- chew --
  Keys.GF = "chew/";

  // -- disappear --
  Keys.kI = "disappear/0000";
  Keys.lI = "disappear/";

  // -- drag --
  Keys.Ly = "drag_button";
  Keys.BH = "drag_button_hot";

  // -- excited --
  Keys.MF = "excited/";

  // -- eyes --
  Keys.kH = "eyes/0000";
  Keys.lH = "eyes/";

  // -- fail --
  Keys.HF = "fail/";

  // -- firefly --
  Keys.PH = "firefly/";

  // -- flight --
  Keys.XG = "flight/0000";
  Keys.YG = "flight/";

  // -- frame --
  Keys.cI = "frame_bl";
  Keys.dI = "frame_br";
  Keys.Ny = "frame_hor_tile";
  Keys.eI = "frame_tl";
  Keys.fI = "frame_tr";
  Keys.Oy = "frame_ver_tile";

  // -- gear --
  Keys.KK = "gear_icon";

  // -- glow --
  Keys.nI = "glow_blue";

  // -- greeting --
  Keys.NF = "greeting/";

  // -- handle --
  Keys.Qy = "handle_hot";

  // -- hud_star --
  Keys.LK = "hud_star/0000";
  Keys.MK = "hud_star/";

  // -- idle --
  Keys.LF = "idle/";
  Keys.rI = "idle/";
  Keys.oI = "idle/0001";

  // -- idle2 --
  Keys.IF = "idle2/0000";
  Keys.JF = "idle2/";

  // -- idle3 --
  Keys.KF = "idle3/";

  // -- idle_blue --
  Keys.qI = "idle_blue/";
  Keys.pI = "idle_blue/0001";

  // -- idle_off --
  Keys.tI = "idle_off/";
  Keys.sI = "idle_off/0001";

  // -- lantern --
  Keys.HH = "lantern_end";
  Keys.IH = "lantern_start";

  // -- level --
  Keys.NK = "level/blue_star";
  Keys.Tt = "level/blue_star_hud";
  Keys.OK = "level/locked";
  Keys.PK = "level/stars0";
  Keys.QK = "level/stars1";
  Keys.RK = "level/stars2";
  Keys.SK = "level/stars3";

  // -- light --
  Keys.gI = "light_spot";

  // -- light_down --
  Keys.uI = "light_down/0000";
  Keys.vI = "light_down/";

  // -- light_up --
  Keys.wI = "light_up/0000";
  Keys.xI = "light_up/";

  // -- logo --
  Keys.UK = "logo_ru";

  // -- menu --
  Keys.VK = "menu_icon_round";
  Keys.lz = "menu_icon_tiny";

  // -- monster --
  Keys.WK = "monster_results";
  Keys.XK = "monster_sad1";
  Keys.YK = "monster_sad2";
  Keys.ZK = "monster_sad3";

  // -- mouse --
  Keys.nH = "mouse/0000";
  Keys.Vp = "mouse/";
  Keys.oH = "mouse/0008";

  // -- mouth_close --
  Keys.ly = "mouth_close/";

  // -- mouth_open --
  Keys.OF = "mouth_open/";

  // -- nav --
  Keys.aL = "nav_next0";
  Keys.bL = "nav_next1";
  Keys.cL = "nav_prev0";
  Keys.mz = "nav_prev1";

  // -- next --
  Keys.dL = "next_icon_tiny";

  // -- particle --
  Keys.JH = "particle_1";
  Keys.KH = "particle_2";
  Keys.LH = "particle_3";
  Keys.MH = "particle_4";
  Keys.NH = "particle_5";

  // -- particle_1 --
  Keys.CI = "particle_1/";

  // -- particle_2 --
  Keys.DI = "particle_2/";

  // -- particle_3 --
  Keys.EI = "particle_3/";

  // -- play --
  Keys.eL = "play_icon_round";

  // -- pop --
  Keys.ZG = "pop/0000";

  // -- popup --
  Keys.fL = "popup_bottom";
  Keys.gL = "popup_button";
  Keys.hL = "popup_button_hot";
  Keys.iL = "popup_button_x";
  Keys.jL = "popup_middle";
  Keys.nz = "popup_top";

  // -- puzzled --
  Keys.PF = "puzzled/";

  // -- restart --
  Keys.oz = "restart_icon_tiny";

  // -- shelf --
  Keys.uJ = "shelf_button";
  Keys.vJ = "shelf_button_hot";

  // -- shine --
  Keys.yI = "shine_blue";

  // -- sign --
  Keys.lK = "sign/";

  // -- skin --
  Keys.kL = "skin_glow";
  Keys.lL = "skin_hand";

  // -- sleeping --
  Keys.QF = "sleeping/";

  // -- sound --
  Keys.mL = "sound_icon";

  // -- spark --
  Keys.zI = "spark_blue";

  // -- stain --
  Keys.aH = "stain_01";
  Keys.bH = "stain_03";

  // -- star --
  Keys.oL = "star_empty";

  // -- super_in --
  Keys.RF = "super_in/";

  // -- super_loop --
  Keys.TF = "super_loop/";

  // -- super_loop_active --
  Keys.SF = "super_loop_active/";

  // -- timer --
  Keys.AI = "timer/0000";
  Keys.BI = "timer/";

  // -- tips --
  Keys.iI = "tips_glow";

  // -- wheel --
  Keys.CH = "wheel_active";
  Keys.DH = "wheel_bottom";
  Keys.EH = "wheel_rope";
  Keys.FH = "wheel_top";

  // -- x --
  Keys.pz = "x_icon";

  // -- x1 --
  Keys.TG = "x1/0000";
  Keys.UG = "x1/";

  // -- x2 --
  Keys.VG = "x2/0000";
  Keys.WG = "x2/";

  // -- xmas --
  Keys.pL = "xmas_hat_back";
  Keys.qL = "xmas_hat_front";

  // -- zzz --
  Keys.my = "zzz/";

  // -- $-prefixed (caught in a second pass) --
  Keys.$G = "pop/";
  Keys.$H = "x3";
  Keys.$p = "level/playable";
  Keys.$K = "music_icon";
  Keys.$I = "monster";
  // --------------------------------------------------------------------
  // statics.js — runtime bootstrap. Runs ONCE, after every class has been
  // declared (see manifest.json — this file is the last part inside the
  // IIFE). Three things happen here:
  //
  //   1. Host detection + tiny interop shims (performance.now, etc.).
  //   2. Initial values for every class-level field the game expects to
  //      exist before any constructor runs (TYPE tags, lookup tables,
  //      default save state, ...).
  //   3. Asset manifests + the named-id constants that scenes reference
  //      to pick out specific assets from the manifest by position.
  //
  // Most of the obfuscated two-letter names below are still here (e.g.
  // `WebApplication.ds`, `Scene.salutePlayed`); they're consumed from many other
  // call sites and renaming them is a separate pass. Inline comments
  // explain each block's purpose so a human can skim.
  //
  // Sprite-key constants previously lived here too (`Keys.*`, ~260
  // lines) — they're now in `src/keys.js`, which is concatenated
  // immediately before this file.
  // --------------------------------------------------------------------

  // --- Host detection + interop shims ---------------------------------
  host.zt |= 0;
  if (typeof performance != "undefined" && typeof performance.now == "function") {
    Std.now = performance.now.bind(performance);
  }
  // Older Edge / pre-2015 browsers don't have String.fromCodePoint.
  if (String.fromCodePoint == null) {
    String.fromCodePoint = function (a) {
      if (a < 65536) {
        return String.fromCharCode(a);
      } else {
        return String.fromCharCode((a >> 10) + 55232) + String.fromCharCode((a & 1023) + 56320);
      }
    };
  }
  // Haxe's runtime type tags. `i` marks "is interface", `l` marks the
  // class on its prototype; both used by the reflection helpers in
  // runtime/haxe/std.js.
  Object.defineProperty(String.prototype, "__class__", { value: String, enumerable: false, writable: true });
  String.i = true;
  Array.i = true;
  Date.prototype.l = Date;
  Date.i = "Date";
  var vO2 = {};
  var vO3 = {};
  var vNumber = Number;
  var vBoolean = Boolean;
  var vO4 = {};
  var vO5 = {};
  StdString.xL = {}.toString;

  // --- Locales + per-box bitmasks -------------------------------------
  // LANGUAGES — language list (matches assets/fonts/font-<lang>.{png,dat}).
  var LANGUAGES = "en de fr ru nl br it es ko ja".split(" ");
  // BOX_STAR_THRESHOLDS — per-box "stars needed" thresholds. Indexed by box-1 (0..16).
  //       Used by the season unlock logic in seasons.js.
  var BOX_STAR_THRESHOLDS = [0, 30, 80, 170, 230, 0, 40, 90, 150, 200, 0, 40, 90, 150, 200, 270, 350];
  // BOX_OBJECT_FLAGS — per-box bitmask of which game-object kinds are used. Each
  //       bit corresponds to one game-object type (rope, star, candy,
  //       etc.); LevelScene.getPreloads() ANDs against this to decide
  //       which obj_* sprite sheet to preload for the active box.
  var BOX_OBJECT_FLAGS = [3, 31, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 19351, 64407, 123823, 260791, 375463, 633511, 1117095];

  // --- WebApplication boot flags --------------------------------------
  WebApplication.ds                = false; // (unknown — still obfuscated; one reader in level.js)
  WebApplication.xmasMode          = false; // SDK.hasFeature("xmas")
  WebApplication.magnetEnabled     = true;
  WebApplication.magnetRefill      = 1;     // refill count after rewarded ad (unused; Mf=Infinity)
  WebApplication.telekinesisEnabled = true;
  WebApplication.telekinesisRefill = 1;     // unused; Mf=Infinity
  WebApplication.externalPause     = true;  // host owns pause button
  WebApplication.externalMute      = false; // host owns mute button
  WebApplication.menuMusicId       = 0;     // points at audio/menu_music{_xmas}.ogg
  WebApplication.gameMusicId       = 0;     // points at audio/game_music{_xmas}.ogg

  // --- Scene-tree + scene-state defaults ------------------------------
  Node.qw = new ArrayList(4096, null, true);
  Scene.salutePlayed         = false;  // first-clear celebration anim has fired
  MenuScene.freshBoot        = true;   // MenuScene.start() hasn't run yet
  LevelScene.freshBoot       = true;   // first-level preload delay still pending
  LevelScene.pendingLevelJump = -1;    // != -1: jump to this level index next frame
  LevelScene.pendingRestart  = false;
  LevelScene.ev              = false;  // (unknown - triggers JC() with am-temp swap)
  LevelScene.isPlaying       = false;  // mirrors `state == 1` for outside-of-scene checks
  LevelScene.am              = -1;     // (unknown - hit-counter target during ev)
  var gameReadyFired = false;          // one-shot, gates SDK.gameReady() in menu.start
  var audioDisabled  = false;          // SDK.onRequest("disableAudio") flipped
  var gameplayPaused = false;          // SDK.onRequest("pauseGameplay") flipped

  // --- LevelState defaults --------------------------------------------
  LevelState.season = 1;  // 1..3
  LevelState.box    = 1;
  LevelState.level  = 1;

  WorldScale.scale    = 1.2;   // physics-units-to-world scale factor
  Save.persistEnabled = true;  // gates Save.flush() writing to localStorage

  // --- SoundFx ids — these MUST match audio/sfx/manifest.json ---------
  // Every SoundFx.<key> is a numeric id passed to SoundFx.play(...).
  // The same id is the key the mixer registers each .ogg under (loaded
  // individually now; see Application.loadSfxBundle in lifecycle.js).
  SoundFx.win = 1001;
  SoundFx.wheel = 1002;
  SoundFx.transporter_move = 1003;
  SoundFx.transporter_drop = 1004;
  SoundFx.teleport = 1005;
  SoundFx.steam_start_2 = 1006;
  SoundFx.steam_start = 1007;
  SoundFx.steam_end = 1008;
  SoundFx.star_light02 = 1009;
  SoundFx.star_light01 = 1010;
  SoundFx.star_1 = 1013;
  SoundFx.sp_telekinesis = 1014;
  SoundFx.sp_field_bounce = 1015;
  SoundFx.sp_field = 1016;
  SoundFx.sp_cloverleaf = 1017;
  SoundFx.spike_rotate_out = 1018;
  SoundFx.spike_rotate_in = 1019;
  SoundFx.spider_win = 1020;
  SoundFx.spider_fall = 1021;
  SoundFx.spider_activate = 1022;
  SoundFx.scratch_out = 1023;
  SoundFx.scratch_in = 1024;
  SoundFx.salute = 1025;
  SoundFx.rope_get = 1026;
  SoundFx.pump_4 = 1031;
  SoundFx.mouse_tap = 1036;
  SoundFx.mouse_rustle = 1037;
  SoundFx.monster_sad = 1042;
  SoundFx.monster_open = 1043;
  SoundFx.monster_close = 1044;
  SoundFx.monster_chewing = 1045;
  SoundFx.magnet_idle = 1046;
  SoundFx.magnet_attract = 1047;
  SoundFx.lantern_teleport_out = 1048;
  SoundFx.lantern_teleport_in = 1049;
  SoundFx.gravity_on = 1050;
  SoundFx.gravity_off = 1051;
  SoundFx.ghost_puff = 1052;
  SoundFx.electric = 1053;
  SoundFx.candy_link = 1058;
  SoundFx.candy_break = 1059;
  SoundFx.buzz = 1060;
  SoundFx.button = 1061;
  SoundFx.bubble_break = 1062;
  SoundFx.bubble = 1063;
  SoundFx.bouncer = 1064;
  // --- Build / version ------------------------------------------------
  Resources.bm = [];
  Build.VERSION = new SemVer("1.6.20");
  Build.FG = "v1.6.20 2025-05-28 16:27:50 Generated by Haxe 4.3.4 polygonal";

  // --- Geometry / colour / time defaults ------------------------------
  RGBA.CS = new RGBA(1, 1, 1, 1);
  RGBA.yT = RGBA.CS;
  Rect.oy = 1; Rect.py = 2; Rect.ny = 4; Rect.qy = 8;
  FixedTimestep.Rk = 0.016666666666666666; // 1/60s
  Vec2.BL = [];
  Vec2.CL = [];

  // --- SDK runtime state ----------------------------------------------
  SDK.forceUnmuted = false;
  SDK.lastPreloadProgress = -1;

  // --- Pre-built animation timelines (Keys.Pa returns an interned key
  // for "frames 0..N at <fps>fps"). These are reused across many sprite
  // instances rather than re-instantiated per use.
  var vLN01 = 0.1;
  var STAR_IDLE_BLUE_ANIM = Keys.Pa(Keys.qI, 0, 17, 20);
  var vLN10 = 10;
  var X1_ANIM = Keys.Pa(Keys.UG, 0, 4, 25);
  var X2_ANIM = Keys.Pa(Keys.WG, 0, 4, 25);
  var MOUSE_ANIM_A = InternKey.create("" + Keys.Vp + "@20,0-2");
  var MOUSE_ANIM_B = InternKey.create("" + Keys.Vp + "@20,3,4,8");
  var MOUSE_ANIM_C = InternKey.create("" + Keys.Vp + "@20,2,6,7,11");
  var MOUSE_ANIM_D = InternKey.create("" + Keys.Vp + "@20,8,9,10,11");
  var v153 = null;
  var EYES_ANIM = InternKey.create("" + Keys.lH + "@20,0-8");

  // --- Character (Om Nom) animation + hitbox config -------------------
  Character.UI = Keys.Pa(Keys.$G, 0, 11, 20);
  Character.iy = Rect.Gm(new Rect(48, 48, 152, 152));
  Character.BF = -17;
  Character.AF = 20;

  // --- Candy / bubble / particle -------------------------------------
  CandyCutAnim.gy = new Rect(142, 157, 112, 104);
  CandyCutAnim.Sp = Rect.Gm(CandyCutAnim.gy);
  var v155 = Keys.Pa(null, 8, 17, 15);
  var v156 = InternKey.create("18@3,18");
  var v157 = Keys.Pa(null, 21, 25, 20);
  BubbleAnim.uF = Keys.Pa(Keys.YG, 0, 13, 20);
  CandyPiece.ky = Rect.Gm(new Rect(155, 176, 88, 76));
  PathResolver.Ey = 100;
  var BEE_ANIM = Keys.Pa(Keys.IG, 1, 3, 33);
  var v159 = null, v160 = null, v161 = null, v162 = null;
  var FIREFLY_ANIM = Keys.Pa(Keys.PH, 0, 39, 20);

  BoxLevelData.aw = [];

  // --- OmNom ----------------------------------------------------------
  OmNom.jK = Rect.Gm(new Rect(264, 350, 108, 2));
  OmNom.Iy = 80;
  var OM_NOM_ANIMS = [
    Keys.Pa(Keys.LF, 0, 18, 20),  // idle
    Keys.Pa(Keys.JF, 0, 24, 20),  // idle2
    Keys.Pa(Keys.KF, 0, 15, 20),  // idle3
    Keys.Pa(Keys.MF, 0, 19, 20),  // excited
    Keys.Pa(Keys.PF, 0, 26, 20),  // puzzled
    Keys.Pa(Keys.HF, 0, 12, 20),  // fail
    Keys.Pa(Keys.ly, 0, 3, 20),   // mouth_close
    Keys.Pa(Keys.OF, 0, 8, 20),   // mouth_open
    Keys.Pa(Keys.ly, 0, 3, 20),   // mouth_close (again — different state)
    Keys.Pa(Keys.GF, 0, 8, 20),   // chew
    Keys.Pa(Keys.NF, 0, 29, 20),  // greeting
    Keys.Pa(Keys.QF, 0, 6, 20),   // sleeping
    Keys.Pa(Keys.RF, 0, 15, 20),  // super_in
    Keys.Pa(Keys.TF, 0, 8, 10),   // super_loop
    Keys.Pa(Keys.SF, 0, 8, 20)    // super_loop_active
  ];
  var OM_NOM_BLINK_ANIM = InternKey.create("" + Keys.FF + "@20,0,1,0,1"); // blink
  var OM_NOM_ZZZ_ANIM = InternKey.create("" + Keys.my + "@30,0-36,0x15"); // zzz
  var OM_NOM_ZZZ_ANIM_REV = InternKey.create("" + Keys.my + "@30,0x15,0-36");

  // --- Pump / Sock / Star --------------------------------------------
  Pump.zF = Keys.Pa(null, 1, 5, 20);
  Pump.Vy = Rect.Gm(new Rect(300, 300, 175, 175));
  Sock.Yy = 56;
  Sock.wJ = 6;
  Sock.Sk = 16;
  Sock.xJ = -6.4;
  var v167 = InternKey.create("@20,2,3,3,4");
  var v168 = InternKey.create("0-4@20,5@0.4,6@20");
  var v169 = Keys.Pa(null, 7, 10, 10);
  var v170 = Keys.Pa(null, 1, 4, 20);
  Star.bg = 16.8;
  Star.iK = Rect.Gm(new Rect(70, 64, 82, 82));
  var STAR_IDLE_ANIM = Keys.Pa(Keys.rI, 0, 17, 20); // star idle
  var STAR_IDLE_OFF_ANIM = Keys.Pa(Keys.tI, 0, 17, 20); // star idle_off
  var STAR_LIGHT_UP_ANIM = Keys.Pa(Keys.xI, 0, 5, 20);  // star light_up
  var STAR_LIGHT_DOWN_ANIM = Keys.Pa(Keys.vI, 0, 5, 20);  // star light_down
  var STAR_DISAPPEAR_ANIM = Keys.Pa(Keys.lI, 0, 12, 20); // star disappear
  var PARTICLE_1_ANIM = Keys.Pa(Keys.CI, 0, 10, 20); // particle_1
  var PARTICLE_2_ANIM = Keys.Pa(Keys.DI, 0, 10, 20); // particle_2
  var PARTICLE_3_ANIM = Keys.Pa(Keys.EI, 0, 10, 20); // particle_3

  ConveyorItem.zL = 0;
  var DIGIT_FRAME_0 = Keys.HI, DIGIT_FRAME_1 = Keys.II, DIGIT_FRAME_2 = Keys.JI, DIGIT_FRAME_3 = Keys.KI;
  var DIGIT_FRAME_4 = Keys.LI, DIGIT_FRAME_5 = Keys.MI, DIGIT_FRAME_6 = Keys.NI, DIGIT_FRAME_7 = Keys.OI;

  // --- LevelController tuning -----------------------------------------
  LevelController.Yp = 36;
  LevelController.DF = 120;
  LevelController.CF = 240;
  LevelController.kK = 110;
  LevelController.mn = 1.2000000000000002;
  LevelController.Ty = 0.9;
  LevelController.Hj = true;

  var vLN023 = 0;
  var vLN024 = 0;
  Texture.WP = 1;

  // --- Anim / draw-effect TYPE tags -----------------------------------
  // Every effect / scene-node class carries a numeric TYPE used by
  // the renderer to pair effects with their GL programs (and by the
  // scene tree for cheap typeof tests). See ya()/typeId() overrides.
  AnimComponent.ty = 0;
  AnimComponent.$F = 3;
  AnimComponent.TYPE = 103;
  AnimController.TYPE     = 303;
  AnimSequenceCtl.TYPE    = 403;
  TweenTrack.TYPE         = 203;
  DrawEffect.TYPE         = 105;
  TextDrawEffect.TYPE     = 505;
  GradientLineEffect.TYPE = 705;
  TextGridEffect.TYPE     = 1805;
  ColorRectEffect.TYPE    = 1205;
  ClearEffect.TYPE        = 305;
  MultiLineEffect.WF      = 4.800000000000001;
  MultiLineEffect.TYPE    = 1105;
  DashedCircleEffect.TYPE = 605;
  SpriteShapeEffect.TYPE  = 1705;
  ShapePath.TYPE          = 1005;
  RingDrawEffect.TYPE     = 905;
  TextureDrawEffect.TYPE  = 205;
  MeshDrawEffect.TYPE     = 405;
  ParallaxDrawEffect.TYPE = 1605;
  SolidColorEffect.TYPE   = 1405;
  GradientEffect.TYPE     = 1505;

  // --- Hex lookup table (256-entry cached byte-to-string) -------------
  (function () {
    HexLookup.Dy = Array(256);
    let a = 0;
    while (a < 256) {
      let b = a++;
      HexLookup.Dy[b] = StringUtil.oO(b);
    }
    return null;
  })(this);
  var vLS000000 = "#000000";

  // --- More TYPE tags / GL constants ----------------------------------
  ShapePathBounds.TYPE = 1305;
  GLAttribSentinel.SI = -1;
  GLTypeSize.dA = [1, 1, 2, 2, 4];
  GLProgram.RE = new Float32Array(16);
  VertexBuffer.hO = [5120, 5121, 5122, 5123, 5126];
  WebGLRenderer.nq = [0, 1, 774, 775, 770, 771, 772, 773];
  WebGLRenderer.JM = [512, 513, 514, 515, 516, 517, 518, 519];
  NoopEffect.TYPE         = 2005;
  MeshDataEffect.TYPE     = 1905;
  CustomShaderEffect.TYPE = 805;
  GLTiledTextureProgram.sL = [[0, 1, 1, 1, 0, 0, 1, 0], [1, 1, 0, 1, 1, 0, 0, 0]];

  // Bounds + Scene-node TYPE tags
  ShapeBounds.TYPE        = 102;
  BoxBounds.Fd = new Vec4(0, 0, 0, 1);
  BoxBounds.TYPE          = 302;
  BoxShapeBounds.TYPE     = 402;
  PolygonShapeBounds.TYPE = 202;
  CircleBounds.TYPE       = 502;
  ColorTransformState.next = 0;
  SceneNode.count         = 0;
  SceneNode.HM            = 202;
  SceneNode.IM            = 0;
  SceneNode.TYPE          = 101;
  SceneGroup.count        = 0;
  SceneGroup.TYPE         = 201;
  MeshNode.TYPE           = 601;
  ClipState.next          = 0;
  BufferNode.TYPE         = 501;
  SceneRoot.count         = 0;
  SceneRoot.TYPE          = 301;
  SpriteNode.TYPE         = 401;
  NodeTreeUtil.yx = new Stack();
  NodeTreeUtil.DS = new Stack();
  DisplayBase.count       = 0;
  DisplayBase.TYPE        = 104;
  Sprite.TYPE             = 304;
  Container.TYPE          = 204;
  TextNode.TYPE           = 404;

  // --- Base64 + reinterpret helpers -----------------------------------
  Base64.UF = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  Base64.jy = Bytes.EC(Base64.UF);
  Float64Cast.Ev = new DataView(new ArrayBuffer(8));

  // --- Keyboard map + math constants ----------------------------------
  var KEYBOARD_CODES = null; // populated by buildKeyboardCodeTable() in helpers.js
  var EPSILON        = 0.000001;
  var RAD2DEG = 57.29577951308232;     // 180/π — radians→degrees
  var DEG2RAD = 0.0174532925199432;   // π/180 — degrees→radians
  var PI  = 3.141592653589793;    // π
  var HALF_PI = 1.5707963267948966;   // π/2
  var TWO_PI  = 6.283185307179586;    // 2π
  var vInfinity            = Infinity;
  var vNegInfinity                 = -Infinity;
  var INT16_MIN                 = -32768;
  var INT32_MAX        = 2147483647;
  var FLOAT_MAX             = 3.4e+38;
  var FLOAT_MIN                 = -3.4e+38;
  TouchState.aq = INT16_MIN;
  var X = new MathRandom();

  // --- HUD assets -----------------------------------------------------
  var HUD_STAR_ANIM = Keys.Pa(Keys.MK, 0, 10, 25); // hud_star
  var HUD_STAR_FRAME_0 = Keys.LK;                     // hud_star/0000
  var vA6 = [0, 5, 6, 7, 8];
  LevelDot.zE = [Keys.PK, Keys.QK, Keys.RK, Keys.SK, Keys.NK];

  // --- Physics gravity ------------------------------------------------
  PhysicsConfig.Et = 784;                       // px/s² (≈ 9.8 m/s² × ~80px/m)
  PhysicsConfig.wy = PhysicsConfig.Et;
  PhysicsConfig.current = new Vec2(0, PhysicsConfig.Et);

  ScriptLoader.cA = 0;
  MD5.yG = "0123456789abcdef".split("");

  Loader.ib();

  // --------------------------------------------------------------------
  // Asset manifest
  //
  // Three parallel arrays drive every fetch:
  //
  //   Loader.Ce — path TEMPLATES (with {image}, {audio}, {language},
  //               {resolution} placeholders the loader substitutes).
  //               INDEXED by all the `Loader.<X> = <number>` constants
  //               at the bottom of this file, so order MUST stay stable.
  //
  //   Loader.bA — "path:byteSize" pairs for the size hints used by the
  //               loading-progress UI.
  //
  //   Loader.zQ — subset of paths that have a 2x variant (used by
  //               Loader.HN/Loader.ni to pick `-2x` on Hi-DPI).
  //
  // Audio sound-sprite handling lives in Application.loadSfxBundle
  // (lifecycle.js); the old SPR-sprite sound.{ogg,aac} is gone.
  // --------------------------------------------------------------------
  Loader.Rp = "assets";
  Loader.MAX = 204;
  Loader.YQ = [50, 51, 52];

  // The paths/sizes were originally serialised as a single space-
  // separated string; expanded to one entry per line for readability.
  // `.split(" ")` is gone — these are plain arrays now.
  Loader.bA = [
    // videos
    "static/video/outro_portrait.mp4:606240",
    "static/video/outro_landscape.mp4:707037",
    "static/video/intro_portrait.mp4:254354",
    "static/video/intro_landscape.mp4:364300",
    // strings
    "static/strings.json:47035",
    // pics
    "images/pics/thumbs.png:83668",       "images/pics/thumbs.json:4819",
    "images/pics/thumbs-2x.png:280525",   "images/pics/thumbs-2x.json:4868",
    "images/pics/pic_21.jpg:151191",      "images/pics/pic_20.jpg:149085",
    "images/pics/pic_19.jpg:87608",       "images/pics/pic_18.jpg:91082",
    "images/pics/pic_17.jpg:106541",      "images/pics/pic_16.jpg:80658",
    "images/pics/pic_15.jpg:64604",       "images/pics/pic_14.jpg:88490",
    "images/pics/pic_13.jpg:119028",      "images/pics/pic_12.jpg:95377",
    "images/pics/pic_11.jpg:95431",       "images/pics/pic_10.jpg:107394",
    "images/pics/pic_09.jpg:94226",       "images/pics/pic_08.jpg:94333",
    "images/pics/pic_07.jpg:111936",      "images/pics/pic_06.jpg:79570",
    "images/pics/pic_05.jpg:85850",       "images/pics/pic_04.jpg:84859",
    "images/pics/pic_03.jpg:81184",       "images/pics/pic_02.jpg:113893",
    "images/pics/pic_01.jpg:119921",
    "images/pics/missing.png:154822",
    "images/pics/bg_xmas.jpg:259306",     "images/pics/bg.jpg:152419",
    // menu
    "images/menu/ui.png:396375",          "images/menu/ui.json:24561",
    "images/menu/shadow.png:15280",
    "images/menu/seasons.png:153688",     "images/menu/seasons.json:1527",
    "images/menu/season3.png:231313",     "images/menu/season3.json:3097",
    "images/menu/season2.png:231231",     "images/menu/season2.json:2700",
    "images/menu/season1.png:250245",     "images/menu/season1.json:2699",
    "images/menu/salute.png:32002",       "images/menu/salute.json:10858",
    "images/menu/salute-2x.png:92937",    "images/menu/salute-2x.json:11193",
    "images/menu/cut.png:18928",          "images/menu/cut.json:1097",
    "images/menu/cut-2x.png:60604",       "images/menu/cut-2x.json:1107",
    "images/menu/bg_xmas.jpg:126904",
    "images/menu/bg2_xmas.png:155196",    "images/menu/bg2.png:247796",
    "images/menu/bg.jpg:90340",
    // loader splash
    "images/loader_bg.jpg:22263", "images/loader.png:16984", "images/loader.dat:440",
    // language fonts
    "fonts/font-ru.png:68946",  "fonts/font-ru.dat:6169",
    "fonts/font-nl.png:48288",  "fonts/font-nl.dat:5609",
    "fonts/font-ko.png:163320", "fonts/font-ko.dat:14969",
    "fonts/font-ja.png:211458", "fonts/font-ja.dat:21469",
    "fonts/font-it.png:48936",  "fonts/font-it.dat:5549",
    "fonts/font-fr.png:50257",  "fonts/font-fr.dat:5729",
    "fonts/font-es.png:50586",  "fonts/font-es.dat:5709",
    "fonts/font-en.png:48296",  "fonts/font-en.dat:5589",
    "fonts/font-de.png:51771",  "fonts/font-de.dat:5729",
    "fonts/font-br.png:53145",  "fonts/font-br.dat:5849",
    // in-game sprite sheets (1x + 2x)
    "images/game/tut.png:27759", "images/game/tut.json:2291",
    "images/game/obj_vinyl.png:34111",     "images/game/obj_vinyl.json:1497",
    "images/game/obj_vinyl-2x.png:62064",  "images/game/obj_vinyl-2x.json:1523",
    "images/game/obj_transporter.png:1535","images/game/obj_transporter.json:1844",
    "images/game/obj_steam.png:9200",      "images/game/obj_steam.json:7334",
    "images/game/obj_steam-2x.png:21885",  "images/game/obj_steam-2x.json:7380",
    "images/game/obj_star.png:116319",     "images/game/obj_star.json:24293",
    "images/game/obj_star-2x.png:354592",  "images/game/obj_star-2x.json:24689",
    "images/game/obj_spikes.png:5674",     "images/game/obj_spikes.json:1081",
    "images/game/obj_spikes-2x.png:17960", "images/game/obj_spikes-2x.json:1083",
    "images/game/obj_spider.png:8232",     "images/game/obj_spider.json:2813",
    "images/game/obj_spider-2x.png:24082", "images/game/obj_spider-2x.json:2868",
    "images/game/obj_sp.png:24382",        "images/game/obj_sp.json:2637",
    "images/game/obj_sp-2x.png:82882",     "images/game/obj_sp-2x.json:2661",
    "images/game/obj_sock.png:12333",      "images/game/obj_sock.json:1287",
    "images/game/obj_sock-2x.png:35190",   "images/game/obj_sock-2x.json:1299",
    "images/game/obj_pump.png:10250",      "images/game/obj_pump.json:2081",
    "images/game/obj_pump-2x.png:29141",   "images/game/obj_pump-2x.json:2085",
    "images/game/obj_lighter.png:17490",   "images/game/obj_lighter.json:8776",
    "images/game/obj_lighter-2x.png:56932","images/game/obj_lighter-2x.json:8867",
    "images/game/obj_lantern.png:15236",   "images/game/obj_lantern.json:1912",
    "images/game/obj_lantern-2x.png:42472","images/game/obj_lantern-2x.json:1943",
    "images/game/obj_hook.png:12919",      "images/game/obj_hook.json:3405",
    "images/game/obj_hook-2x.png:37297",   "images/game/obj_hook-2x.json:3473",
    "images/game/obj_gravity.png:5221",    "images/game/obj_gravity.json:726",
    "images/game/obj_gravity-2x.png:14510","images/game/obj_gravity-2x.json:731",
    "images/game/obj_ghost.png:5670",      "images/game/obj_ghost.json:1697",
    "images/game/obj_ghost-2x.png:12807",  "images/game/obj_ghost-2x.json:1711",
    "images/game/obj_gap.png:16814",       "images/game/obj_gap.json:4839",
    "images/game/obj_gap-2x.png:47790",    "images/game/obj_gap-2x.json:4898",
    "images/game/obj_electro.png:8545",    "images/game/obj_electro.json:1288",
    "images/game/obj_electro-2x.png:30475","images/game/obj_electro-2x.json:1299",
    "images/game/obj_candy4.png:71722",    "images/game/obj_candy4.json:5300",
    "images/game/obj_candy4-2x.png:206179","images/game/obj_candy4-2x.json:5405",
    "images/game/obj_candy3.png:72274",    "images/game/obj_candy3.json:5298",
    "images/game/obj_candy3-2x.png:208381","images/game/obj_candy3-2x.json:5405",
    "images/game/obj_candy2.png:75319",    "images/game/obj_candy2.json:5308",
    "images/game/obj_candy2-2x.png:222774","images/game/obj_candy2-2x.json:5417",
    "images/game/obj_candy1.png:81126",    "images/game/obj_candy1.json:5309",
    "images/game/obj_candy1-2x.png:234543","images/game/obj_candy1-2x.json:5431",
    "images/game/obj_candy0.png:74349",    "images/game/obj_candy0.json:5308",
    "images/game/obj_candy0-2x.png:212961","images/game/obj_candy0-2x.json:5416",
    "images/game/obj_bubble.png:37007",    "images/game/obj_bubble.json:6254",
    "images/game/obj_bubble-2x.png:107943","images/game/obj_bubble-2x.json:6344",
    "images/game/obj_bouncer.png:15871",   "images/game/obj_bouncer.json:2285",
    "images/game/obj_bouncer-2x.png:42679","images/game/obj_bouncer-2x.json:2311",
    "images/game/obj_blades.png:11087",    "images/game/obj_blades.json:1849",
    "images/game/obj_blades-2x.png:26077", "images/game/obj_blades-2x.json:1874",
    "images/game/obj_bee.png:3255",        "images/game/obj_bee.json:1289",
    "images/game/obj_bee-2x.png:8439",     "images/game/obj_bee-2x.json:1297",
    "images/game/char3.png:125467",        "images/game/char3.json:16103",
    "images/game/char3-2x.png:370734",     "images/game/char3-2x.json:16192",
    "images/game/char2.png:156278",        "images/game/char2.json:18737",
    "images/game/char2-2x.png:339748",     "images/game/char2-2x.json:18905",
    "images/game/char1.png:145178",        "images/game/char1.json:17289",
    "images/game/char1-2x.png:306027",     "images/game/char1-2x.json:17381",
    // boxes — order is high → low (17 -> 1), matching Loader.Ce below
    "images/boxes/17mechanicalbox/support.png:20935", "static/boxes/17mechanicalbox/maps.json:32447",
    "images/boxes/17mechanicalbox/cover.png:94067",   "images/boxes/17mechanicalbox/cover.json:721",
    "images/boxes/17mechanicalbox/bg.jpg:192584",
    "images/boxes/16pillowbox/support.png:20889",     "static/boxes/16pillowbox/maps.json:34665",
    "images/boxes/16pillowbox/cover.png:111821",      "images/boxes/16pillowbox/cover.json:721",
    "images/boxes/16pillowbox/bg.jpg:166366",
    "images/boxes/15cheesebox/support.png:19248",     "static/boxes/15cheesebox/maps.json:27278",
    "images/boxes/15cheesebox/cover.png:121680",      "images/boxes/15cheesebox/cover.json:721",
    "images/boxes/15cheesebox/bg.jpg:80627",
    "images/boxes/14lanternbox/support.png:22796",    "static/boxes/14lanternbox/maps.json:22757",
    "images/boxes/14lanternbox/cover.png:117995",     "images/boxes/14lanternbox/cover.json:721",
    "images/boxes/14lanternbox/bg.jpg:193042",
    "images/boxes/13steambox/support.png:14277",      "static/boxes/13steambox/maps.json:22768",
    "images/boxes/13steambox/cover.png:102039",       "images/boxes/13steambox/cover.json:721",
    "images/boxes/13steambox/bg.jpg:130490",
    "images/boxes/12spookybox/support.png:27855",     "static/boxes/12spookybox/maps.json:27095",
    "images/boxes/12spookybox/cover.png:163397",      "images/boxes/12spookybox/cover.json:721",
    "images/boxes/12spookybox/bg.jpg:161968",
    "images/boxes/11djbox/support.png:20124",         "static/boxes/11djbox/maps.json:28386",
    "images/boxes/11djbox/cover.png:147733",          "images/boxes/11djbox/cover.json:721",
    "images/boxes/11djbox/bg.jpg:318137",
    "images/boxes/10buzzbox/support.png:10900",       "static/boxes/10buzzbox/maps.json:28775",
    "images/boxes/10buzzbox/cover.png:142967",        "images/boxes/10buzzbox/cover.json:721",
    "images/boxes/10buzzbox/bg.jpg:291192",
    "images/boxes/9toolbox/support.png:18151",        "static/boxes/9toolbox/maps.json:27367",
    "images/boxes/9toolbox/cover.png:127769",         "images/boxes/9toolbox/cover.json:721",
    "images/boxes/9toolbox/bg.jpg:290591",
    "images/boxes/8cosmicbox/support.png:17382",      "static/boxes/8cosmicbox/maps.json:30526",
    "images/boxes/8cosmicbox/earth.png:37193",
    "images/boxes/8cosmicbox/cover.png:154083",       "images/boxes/8cosmicbox/cover.json:721",
    "images/boxes/8cosmicbox/bg.jpg:261876",
    "images/boxes/7giftbox/support.png:17646",        "static/boxes/7giftbox/maps.json:28759",
    "images/boxes/7giftbox/cover.png:176165",         "images/boxes/7giftbox/cover.json:721",
    "images/boxes/7giftbox/bg.jpg:276708",
    "images/boxes/6toybox/support.png:24856",         "static/boxes/6toybox/maps.json:23787",
    "images/boxes/6toybox/cover.png:191492",          "images/boxes/6toybox/cover.json:721",
    "images/boxes/6toybox/bg.jpg:302842",
    "images/boxes/5valentinebox/support.png:19451",   "static/boxes/5valentinebox/maps.json:28121",
    "images/boxes/5valentinebox/cover.png:112297",    "images/boxes/5valentinebox/cover.json:721",
    "images/boxes/5valentinebox/bg.jpg:327075",
    "images/boxes/4magicbox/support.png:23898",       "static/boxes/4magicbox/maps.json:28874",
    "images/boxes/4magicbox/cover.png:174462",        "images/boxes/4magicbox/cover.json:721",
    "images/boxes/4magicbox/bg.jpg:297536",
    "images/boxes/3foilbox/support.png:21077",        "static/boxes/3foilbox/maps.json:28624",
    "images/boxes/3foilbox/cover.png:144475",         "images/boxes/3foilbox/cover.json:721",
    "images/boxes/3foilbox/bg.jpg:271789",
    "images/boxes/2fabricbox/support.png:23502",      "static/boxes/2fabricbox/maps.json:28645",
    "images/boxes/2fabricbox/cover.png:141431",       "images/boxes/2fabricbox/cover.json:721",
    "images/boxes/2fabricbox/bg.jpg:292429",
    "images/boxes/1cardboardbox/support.png:12953",   "static/boxes/1cardboardbox/maps.json:53856",
    "images/boxes/1cardboardbox/cover.png:178457",    "images/boxes/1cardboardbox/cover.json:721",
    "images/boxes/1cardboardbox/bg.jpg:224627",
    // music
    "audio/menu_music_xmas.ogg:435372",
    "audio/menu_music.ogg:431450",
    "audio/game_music_xmas.ogg:872474",
    "audio/game_music.ogg:509573"
  ];

  Loader.Ce = [
    // videos
    "static/video/outro_portrait.mp4",
    "static/video/outro_landscape.mp4",
    "static/video/intro_portrait.mp4",
    "static/video/intro_landscape.mp4",
    "static/strings.json",
    // pics
    "images/pics/thumbs{resolution}.{image}",
    "images/pics/thumbs{resolution}.json",
    "images/pics/pic_21.jpg", "images/pics/pic_20.jpg", "images/pics/pic_19.jpg",
    "images/pics/pic_18.jpg", "images/pics/pic_17.jpg", "images/pics/pic_16.jpg",
    "images/pics/pic_15.jpg", "images/pics/pic_14.jpg", "images/pics/pic_13.jpg",
    "images/pics/pic_12.jpg", "images/pics/pic_11.jpg", "images/pics/pic_10.jpg",
    "images/pics/pic_09.jpg", "images/pics/pic_08.jpg", "images/pics/pic_07.jpg",
    "images/pics/pic_06.jpg", "images/pics/pic_05.jpg", "images/pics/pic_04.jpg",
    "images/pics/pic_03.jpg", "images/pics/pic_02.jpg", "images/pics/pic_01.jpg",
    "images/pics/missing.{image}",
    "images/pics/bg_xmas.jpg", "images/pics/bg.jpg",
    // menu
    "images/menu/ui.{image}", "images/menu/ui.json",
    "images/menu/shadow.{image}",
    "images/menu/seasons.{image}", "images/menu/seasons.json",
    "images/menu/season3.{image}", "images/menu/season3.json",
    "images/menu/season2.{image}", "images/menu/season2.json",
    "images/menu/season1.{image}", "images/menu/season1.json",
    "images/menu/salute{resolution}.{image}", "images/menu/salute{resolution}.json",
    "images/menu/cut{resolution}.{image}",    "images/menu/cut{resolution}.json",
    "images/menu/bg_xmas.jpg",
    "images/menu/bg2_xmas.{image}", "images/menu/bg2.{image}",
    "images/menu/bg.jpg",
    // loader splash
    "images/loader_bg.jpg", "images/loader.{image}", "images/loader.dat",
    // language fonts
    "fonts/font{language}.{image}", "fonts/font{language}.dat",
    // in-game sprite sheets
    "images/game/tut.{image}", "images/game/tut.json",
    "images/game/obj_vinyl{resolution}.{image}",  "images/game/obj_vinyl{resolution}.json",
    "images/game/obj_transporter.{image}",        "images/game/obj_transporter.json",
    "images/game/obj_steam{resolution}.{image}",  "images/game/obj_steam{resolution}.json",
    "images/game/obj_star{resolution}.{image}",   "images/game/obj_star{resolution}.json",
    "images/game/obj_spikes{resolution}.{image}", "images/game/obj_spikes{resolution}.json",
    "images/game/obj_spider{resolution}.{image}", "images/game/obj_spider{resolution}.json",
    "images/game/obj_sp{resolution}.{image}",     "images/game/obj_sp{resolution}.json",
    "images/game/obj_sock{resolution}.{image}",   "images/game/obj_sock{resolution}.json",
    "images/game/obj_pump{resolution}.{image}",   "images/game/obj_pump{resolution}.json",
    "images/game/obj_lighter{resolution}.{image}","images/game/obj_lighter{resolution}.json",
    "images/game/obj_lantern{resolution}.{image}","images/game/obj_lantern{resolution}.json",
    "images/game/obj_hook{resolution}.{image}",   "images/game/obj_hook{resolution}.json",
    "images/game/obj_gravity{resolution}.{image}","images/game/obj_gravity{resolution}.json",
    "images/game/obj_ghost{resolution}.{image}",  "images/game/obj_ghost{resolution}.json",
    "images/game/obj_gap{resolution}.{image}",    "images/game/obj_gap{resolution}.json",
    "images/game/obj_electro{resolution}.{image}","images/game/obj_electro{resolution}.json",
    "images/game/obj_candy4{resolution}.{image}", "images/game/obj_candy4{resolution}.json",
    "images/game/obj_candy3{resolution}.{image}", "images/game/obj_candy3{resolution}.json",
    "images/game/obj_candy2{resolution}.{image}", "images/game/obj_candy2{resolution}.json",
    "images/game/obj_candy1{resolution}.{image}", "images/game/obj_candy1{resolution}.json",
    "images/game/obj_candy0{resolution}.{image}", "images/game/obj_candy0{resolution}.json",
    "images/game/obj_bubble{resolution}.{image}", "images/game/obj_bubble{resolution}.json",
    "images/game/obj_bouncer{resolution}.{image}","images/game/obj_bouncer{resolution}.json",
    "images/game/obj_blades{resolution}.{image}", "images/game/obj_blades{resolution}.json",
    "images/game/obj_bee{resolution}.{image}",    "images/game/obj_bee{resolution}.json",
    "images/game/char3{resolution}.{image}",      "images/game/char3{resolution}.json",
    "images/game/char2{resolution}.{image}",      "images/game/char2{resolution}.json",
    "images/game/char1{resolution}.{image}",      "images/game/char1{resolution}.json",
    // boxes — high-to-low order. Several Loader.<X> constants below
    // index into specific positions here (see scene.js Mp() arrays).
    "images/boxes/17mechanicalbox/support.{image}", "static/boxes/17mechanicalbox/maps.json",
    "images/boxes/17mechanicalbox/cover.{image}",   "images/boxes/17mechanicalbox/cover.json",
    "images/boxes/17mechanicalbox/bg.jpg",
    "images/boxes/16pillowbox/support.{image}",     "static/boxes/16pillowbox/maps.json",
    "images/boxes/16pillowbox/cover.{image}",       "images/boxes/16pillowbox/cover.json",
    "images/boxes/16pillowbox/bg.jpg",
    "images/boxes/15cheesebox/support.{image}",     "static/boxes/15cheesebox/maps.json",
    "images/boxes/15cheesebox/cover.{image}",       "images/boxes/15cheesebox/cover.json",
    "images/boxes/15cheesebox/bg.jpg",
    "images/boxes/14lanternbox/support.{image}",    "static/boxes/14lanternbox/maps.json",
    "images/boxes/14lanternbox/cover.{image}",      "images/boxes/14lanternbox/cover.json",
    "images/boxes/14lanternbox/bg.jpg",
    "images/boxes/13steambox/support.{image}",      "static/boxes/13steambox/maps.json",
    "images/boxes/13steambox/cover.{image}",        "images/boxes/13steambox/cover.json",
    "images/boxes/13steambox/bg.jpg",
    "images/boxes/12spookybox/support.{image}",     "static/boxes/12spookybox/maps.json",
    "images/boxes/12spookybox/cover.{image}",       "images/boxes/12spookybox/cover.json",
    "images/boxes/12spookybox/bg.jpg",
    "images/boxes/11djbox/support.{image}",         "static/boxes/11djbox/maps.json",
    "images/boxes/11djbox/cover.{image}",           "images/boxes/11djbox/cover.json",
    "images/boxes/11djbox/bg.jpg",
    "images/boxes/10buzzbox/support.{image}",       "static/boxes/10buzzbox/maps.json",
    "images/boxes/10buzzbox/cover.{image}",         "images/boxes/10buzzbox/cover.json",
    "images/boxes/10buzzbox/bg.jpg",
    "images/boxes/9toolbox/support.{image}",        "static/boxes/9toolbox/maps.json",
    "images/boxes/9toolbox/cover.{image}",          "images/boxes/9toolbox/cover.json",
    "images/boxes/9toolbox/bg.jpg",
    "images/boxes/8cosmicbox/support.{image}",      "static/boxes/8cosmicbox/maps.json",
    "images/boxes/8cosmicbox/earth.{image}",
    "images/boxes/8cosmicbox/cover.{image}",        "images/boxes/8cosmicbox/cover.json",
    "images/boxes/8cosmicbox/bg.jpg",
    "images/boxes/7giftbox/support.{image}",        "static/boxes/7giftbox/maps.json",
    "images/boxes/7giftbox/cover.{image}",          "images/boxes/7giftbox/cover.json",
    "images/boxes/7giftbox/bg.jpg",
    "images/boxes/6toybox/support.{image}",         "static/boxes/6toybox/maps.json",
    "images/boxes/6toybox/cover.{image}",           "images/boxes/6toybox/cover.json",
    "images/boxes/6toybox/bg.jpg",
    "images/boxes/5valentinebox/support.{image}",   "static/boxes/5valentinebox/maps.json",
    "images/boxes/5valentinebox/cover.{image}",     "images/boxes/5valentinebox/cover.json",
    "images/boxes/5valentinebox/bg.jpg",
    "images/boxes/4magicbox/support.{image}",       "static/boxes/4magicbox/maps.json",
    "images/boxes/4magicbox/cover.{image}",         "images/boxes/4magicbox/cover.json",
    "images/boxes/4magicbox/bg.jpg",
    "images/boxes/3foilbox/support.{image}",        "static/boxes/3foilbox/maps.json",
    "images/boxes/3foilbox/cover.{image}",          "images/boxes/3foilbox/cover.json",
    "images/boxes/3foilbox/bg.jpg",
    "images/boxes/2fabricbox/support.{image}",      "static/boxes/2fabricbox/maps.json",
    "images/boxes/2fabricbox/cover.{image}",        "images/boxes/2fabricbox/cover.json",
    "images/boxes/2fabricbox/bg.jpg",
    "images/boxes/1cardboardbox/support.{image}",   "static/boxes/1cardboardbox/maps.json",
    "images/boxes/1cardboardbox/cover.{image}",     "images/boxes/1cardboardbox/cover.json",
    "images/boxes/1cardboardbox/bg.jpg",
    // music (indices 199..202 — see Loader.menuMusicXmas/xF/wF/vF below)
    "audio/menu_music_xmas.ogg",
    "audio/menu_music.ogg",
    "audio/game_music_xmas.ogg",
    "audio/game_music.ogg"
  ];

  // Hi-DPI candidates (each has a `<base>.png` + `<base>-2x.png` pair).
  Loader.zQ = [
    "images/pics/thumbs.png", "images/pics/thumbs.json",
    "images/menu/salute.png", "images/menu/salute.json",
    "images/menu/cut.png",    "images/menu/cut.json",
    "images/game/obj_vinyl.png",     "images/game/obj_vinyl.json",
    "images/game/obj_steam.png",     "images/game/obj_steam.json",
    "images/game/obj_star.png",      "images/game/obj_star.json",
    "images/game/obj_spikes.png",    "images/game/obj_spikes.json",
    "images/game/obj_spider.png",    "images/game/obj_spider.json",
    "images/game/obj_sp.png",        "images/game/obj_sp.json",
    "images/game/obj_sock.png",      "images/game/obj_sock.json",
    "images/game/obj_pump.png",      "images/game/obj_pump.json",
    "images/game/obj_lighter.png",   "images/game/obj_lighter.json",
    "images/game/obj_lantern.png",   "images/game/obj_lantern.json",
    "images/game/obj_hook.png",      "images/game/obj_hook.json",
    "images/game/obj_gravity.png",   "images/game/obj_gravity.json",
    "images/game/obj_ghost.png",     "images/game/obj_ghost.json",
    "images/game/obj_gap.png",       "images/game/obj_gap.json",
    "images/game/obj_electro.png",   "images/game/obj_electro.json",
    "images/game/obj_candy4.png",    "images/game/obj_candy4.json",
    "images/game/obj_candy3.png",    "images/game/obj_candy3.json",
    "images/game/obj_candy2.png",    "images/game/obj_candy2.json",
    "images/game/obj_candy1.png",    "images/game/obj_candy1.json",
    "images/game/obj_candy0.png",    "images/game/obj_candy0.json",
    "images/game/obj_bubble.png",    "images/game/obj_bubble.json",
    "images/game/obj_bouncer.png",   "images/game/obj_bouncer.json",
    "images/game/obj_blades.png",    "images/game/obj_blades.json",
    "images/game/obj_bee.png",       "images/game/obj_bee.json",
    "images/game/char3.png",         "images/game/char3.json",
    "images/game/char2.png",         "images/game/char2.json",
    "images/game/char1.png",         "images/game/char1.json"
  ];

  Loader.rO = [];

  // Loader.KP — per-asset MAX SCALE for the {resolution} substitution.
  //             `1` means only a 1x exists; `2` means a 2x is on disk.
  //             Index matches Loader.Ce positionally.
  Loader.KP = [
    1, 1, 1, 1, 1, 2, 2, 1, 1, 1,   //  0..9
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   // 10..19
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   // 20..29
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   // 30..39
    1, 1, 2, 2, 2, 2, 1, 1, 1, 1,   // 40..49
    1, 1, 1, 1, 1, 1, 1, 2, 2, 1,   // 50..59
    1, 2, 2, 2, 2, 2, 2, 2, 2, 2,   // 60..69
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2,   // 70..79
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2,   // 80..89
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2,   // 90..99
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2,   //100..109
    2, 2, 2, 1, 1, 1, 1, 1, 1, 1,   //110..119
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   //120..129
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   //130..139
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   //140..149
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   //150..159
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   //160..169
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   //170..179
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   //180..189
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   //190..199
    1, 1, 1                          //200..202
  ];

  // --- Named Loader ids -----------------------------------------------
  // Aliases for specific entries in Loader.Ce — scenes pass these to
  // `Loader.ob/get/yb/etc.` instead of bare numbers. Keep in sync if
  // Loader.Ce order changes.
  Loader.outroPortraitVid = 0;   // outro_portrait.mp4
  Loader.outroLandscapeVid = 1;   // outro_landscape.mp4
  Loader.introPortraitVid = 2;   // intro_portrait.mp4
  Loader.introLandscapeVid = 3;   // intro_landscape.mp4
  Loader.strings = 4;   // strings.json
  Loader.picThumbs = 5;   // pics/thumbs
  Loader.picThumbsJson = 6;   // pics/thumbs.json
  Loader.picMissing = 28;  // pics/missing
  Loader.picsBgXmas = 29;  // pics/bg_xmas
  Loader.picsBg = 30;  // pics/bg
  Loader.menuUi = 31;  // menu/ui
  Loader.menuUiJson = 32;  // menu/ui.json
  Loader.menuShadow = 33;  // menu/shadow
  Loader.menuSeasons = 34;  // menu/seasons
  Loader.menuSeasonsJson = 35;
  Loader.menuSeason3 = 36;  // menu/season3
  Loader.menuSeason3Json = 37;
  Loader.menuSeason2 = 38;  // menu/season2
  Loader.menuSeason2Json = 39;
  Loader.menuSeason1 = 40;  // menu/season1
  Loader.menuSeason1Json = 41;
  Loader.menuSalute = 42;  // menu/salute
  Loader.menuSaluteJson = 43;
  Loader.menuCut = 44;
  Loader.menuCutJson = 45;
  Loader.menuBgXmas = 46;  // menu/cut
  Loader.menuBg2Xmas = 47;
  Loader.menuBg2 = 48;  // menu/bg_xmas
  Loader.menuBg = 49;  // menu/bg2_xmas
  Loader.loaderBg = 50;  // menu/bg2 / loader_bg.jpg
  Loader.loaderImg = 51;  // loader.png
  Loader.fontImg = 53;  // font (language-keyed)
  Loader.fontDat = 54;
  Loader.gameTut = 55;  // game/tut
  Loader.gameTutJson = 56;
  Loader.objVinyl = 57;  // obj_vinyl
  Loader.objVinylJson = 58;
  Loader.objTransporter = 59;  // obj_transporter
  Loader.objTransporterJson = 60;
  Loader.objSteam = 61;  // obj_steam
  Loader.objSteamJson = 62;
  Loader.objStar = 63;  // obj_star
  Loader.objStarJson = 64;
  Loader.objSpikes = 65;  // obj_spikes
  Loader.objSpikesJson = 66;
  Loader.objSpider = 67;  // obj_spider
  Loader.objSpiderJson = 68;
  Loader.objSp = 69;  // obj_sp
  Loader.objSpJson = 70;
  Loader.objSock = 71;  // obj_sock
  Loader.objSockJson = 72;
  Loader.objPump = 73;  // obj_pump
  Loader.objPumpJson = 74;
  Loader.objLighter = 75;  // obj_lighter
  Loader.objLighterJson = 76;
  Loader.objLantern = 77;  // obj_lantern
  Loader.objLanternJson = 78;
  Loader.objHook = 79;  // obj_hook
  Loader.objHookJson = 80;
  Loader.objGravity = 81;  // obj_gravity
  Loader.objGravityJson = 82;
  Loader.objGhost = 83;  // obj_ghost
  Loader.objGhostJson = 84;
  Loader.objGap = 85;  // obj_gap
  Loader.objGapJson = 86;
  Loader.objElectro = 87;  // obj_electro
  Loader.objElectroJson = 88;
  Loader.objBubble = 99;  // obj_candy0
  Loader.objBubbleJson = 100;
  Loader.objBouncer = 101; // obj_bubble
  Loader.objBouncerJson = 102;
  Loader.objBlades = 103; // obj_bouncer
  Loader.objBladesJson = 104;
  Loader.objBee = 105; // obj_blades
  Loader.objBeeJson = 106;
  Loader.char3 = 107; // obj_bee
  Loader.char3Json = 108;
  Loader.char2 = 109; // char3
  Loader.char2Json = 110;
  Loader.char1 = 111; // char2
  Loader.char1Json = 112;
  Loader.box8Earth = 160; // (one of the boxNN entries)
  Loader.menuMusicXmas = 199; // audio/menu_music_xmas.ogg
  Loader.menuMusic = 200; // audio/menu_music.ogg
  Loader.gameMusicXmas = 201; // audio/game_music_xmas.ogg
  Loader.gameMusic = 202; // audio/game_music.ogg

  Audio.events = new EventEmitter();
  WebAudioInstance.MA = true;
  // initial powerup count
  AdPowerupButtonA.Mf = Infinity;
  AdPowerupButtonB.Mf = Infinity;

  // per-bit set-mask lookup (1<<n - 1, with -1 for the all-bits case)
  BitMaskTable.zG = [
    0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191,
    16383, 32767, 65535, 131071, 262143, 524287, 1048575, 2097151,
    4194303, 8388607, 16777215, 33554431, 67108863, 134217727,
    268435455, 536870911, 1073741823, 2147483647, -1
  ];
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
