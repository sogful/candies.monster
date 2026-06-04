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
