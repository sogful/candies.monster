var ui =
  "function" == typeof Object.defineProperties
    ? Object.defineProperty
    : function (ja, ma, ya) {
        if (ja == Array.prototype || ja == Object.prototype) return ja;
        ja[ma] = ya.value;
        return ja;
      };
function bj(ja) {
  ja = [
    "object" == typeof globalThis && globalThis,
    ja,
    "object" == typeof window && window,
    "object" == typeof self && self,
    "object" == typeof global && global,
  ];
  for (var ma = 0; ma < ja.length; ++ma) {
    var ya = ja[ma];
    if (ya && ya.Math == Math) return ya;
  }
  throw Error("Cannot find global object");
}
var cj = bj(this);
function dj(ja, ma) {
  if (ma)
    a: {
      var ya = cj;
      ja = ja.split(".");
      for (var Ca = 0; Ca < ja.length - 1; Ca++) {
        var Lb = ja[Ca];
        if (!(Lb in ya)) break a;
        ya = ya[Lb];
      }
      ja = ja[ja.length - 1];
      Ca = ya[ja];
      ma = ma(Ca);
      ma != Ca &&
        null != ma &&
        ui(ya, ja, { configurable: !0, writable: !0, value: ma });
    }
}
dj("Array.prototype.includes", function (ja) {
  return ja
    ? ja
    : function (ma, ya) {
        var Ca = this;
        Ca instanceof String && (Ca = String(Ca));
        var Lb = Ca.length;
        ya = ya || 0;
        for (0 > ya && (ya = Math.max(ya + Lb, 0)); ya < Lb; ya++) {
          var tb = Ca[ya];
          if (tb === ma || Object.is(tb, ma)) return !0;
        }
        return !1;
      };
});
function ej(ja, ma) {
  ja instanceof String && (ja += "");
  var ya = 0,
    Ca = !1,
    Lb = {
      next: function () {
        if (!Ca && ya < ja.length) {
          var tb = ya++;
          return { value: ma(tb, ja[tb]), done: !1 };
        }
        Ca = !0;
        return { done: !0, value: void 0 };
      },
    };
  Lb[Symbol.iterator] = function () {
    return Lb;
  };
  return Lb;
}
dj("Array.prototype.values", function (ja) {
  return ja
    ? ja
    : function () {
        return ej(this, function (ma, ya) {
          return ya;
        });
      };
});
(function (ja, ma) {
  function ya() {
    return Wa.gn(this, "");
  }
  function Ca() {
    return "level" + D.level;
  }
  function Lb() {
    function a(d, e) {
      Pg.J[d] = e;
    }
    Pg = new vc();
    a("Space", 32);
    a("Space", 32);
    a("Quote", 39);
    a("Comma", 44);
    a("Minus", 45);
    a("Period", 46);
    a("Slash", 47);
    for (var b = 0; 10 > b; ) {
      var c = b++;
      a("Digit" + String.fromCodePoint(48 + c), 48 + c);
    }
    a("Semicolon", 59);
    a("Equal", 61);
    a("BracketLeft", 91);
    a("Backslash", 92);
    a("BracketRight", 93);
    a("Backquote", 96);
    for (b = 0; 26 > b; )
      (c = b++), a("Key" + String.fromCodePoint(65 + c), 97 + c);
    for (b = 0; 12 > b; ) (c = b++), a("F" + (c + 1), 121 + c);
    a("ArrowUp", 133);
    a("ArrowLeft", 134);
    a("ArrowRight", 135);
    a("ArrowDown", 136);
    for (b = 0; 10 > b; ) (c = b++), a("EKeyNumpad" + c, 137 + c);
    a("NumpadAdd", 147);
    a("NumpadDecimal", 148);
    a("NumpadMultiply", 149);
    a("NumpadSubtract", 150);
    a("NumpadEqual", 151);
    a("NumpadComma", 152);
    a("NumpadEnter", 153);
    a("NumpadDivide", 154);
    a("NumLock", 155);
    a("Escape", 156);
    a("Backspace", 157);
    a("Tab", 158);
    a("Enter", 159);
    a("ControlLeft", 160);
    a("ControlRight", 161);
    a("ShiftLeft", 162);
    a("ShiftRight", 163);
    a("AltLeft", 164);
    a("AltRight", 165);
    a("PageUp", 166);
    a("PageDown", 167);
    a("Insert", 168);
    a("Delete", 169);
    a("Home", 170);
    a("End", 171);
    a("CapsLock", 172);
    a("Pause", 173);
    a("ScrollLock", 174);
    a("PrintScreen", 175);
  }
  function tb(a, b) {
    return 0 < a ? a < b : -a < b;
  }
  function Ua(a, b, c, d, e) {
    return d + ((a - b) / (c - b)) * (e - d);
  }
  function ye(a) {
    return a instanceof Array ? new Tc(a) : a.iterator();
  }
  function P(a, b) {
    if (null == b) return null;
    null == b.jf && (b.jf = ma.tt++);
    var c;
    null == a.yv ? (a.yv = {}) : (c = a.yv[b.jf]);
    null == c && ((c = b.bind(a)), (a.yv[b.jf] = c));
    return c;
  }
  ja.Ctrr = ja.Ctrr || {};
  var Qg = Qg || {},
    bc;
  class la {
    constructor(a, b) {
      this.r = new RegExp(a, b.split("u").join(""));
    }
    match(a) {
      this.r.global && (this.r.lastIndex = 0);
      this.r.Zj = this.r.exec(a);
      this.r.AD = a;
      return null != this.r.Zj;
    }
    Yc(a) {
      if (null != this.r.Zj && 0 <= a && a < this.r.Zj.length)
        return this.r.Zj[a];
      throw 0;
    }
    yP() {
      if (null == this.r.Zj) throw 1;
      let a = this.r.Zj.index + this.r.Zj[0].length;
      return ta.substr(this.r.AD, a, this.r.AD.length - a);
    }
  }
  la.i = !0;
  Object.assign(la.prototype, { l: la });
  class k {
    static PC(a) {
      return Uc.rP(null == a ? "null" : "" + a);
    }
    static gj(a, b) {
      return a + k.PC(b);
    }
    static Oa(a, b, c, d) {
      return hb.create((null == a ? "" : a + ",") + b + "-" + c + "@" + d);
    }
  }
  k.i = !0;
  class Ba {
    constructor() {
      this.GS = null;
      this.FA = [];
      this.Av = [];
      this.Bw = [];
      this.images = new ib();
      this.DC = null;
      this.jN = new Rg();
      this.save = null;
      this.zo = new Vc();
      this.fa = null;
      this.Ra = new ze();
      this.window = this.V = null;
      this.MS = new Mb();
      this.df = new Sg();
      Ba.instance = this;
    }
    ib(a, b) {
      this.config = a;
      this.DC = b;
      ma.console.info(
        "%c" + a.title.toUpperCase() + " %c" + Cd.xG,
        "font-weight:bold;",
        null
      );
      a.hB &&
        (window.addEventListener("error", P(this, this.Ae)),
        window.addEventListener("unhandledrejection", P(this, this.Ae)));
      this.Sj = this.JS();
      this.jd = -1 != window.navigator.userAgent.indexOf("Web0S");
      l.Fs(a.yB);
      l.Ui(a.language);
      this.df.Fg = P(this, this.uP);
      this.window = new Ae(a.wu);
      a.io && this.window.pO(a.zw) && (this.V = new Cb());
      null == this.V &&
        (this.window.jO(a.zw), (this.V = new Be()), (a.io = !1));
      if (null != this.V) {
        this.V.kp(this.window);
        this.window.If(2, P(this, this.VP));
        this.window.If(1, P(this, this.KC));
        this.window.update();
        this.zB();
        this.zo.version = Cd.VERSION.toString();
        this.zo.Po = a.Po;
        this.fa = new wc(this);
        this.nx();
        this.save = this.nv();
        var c = this;
        this.CS()
          .then(function (d) {
            d && l.IR();
          })
          .then(function () {
            c.preload();
          });
      }
    }
    NB() {
      let a = window.navigator.userAgent.toLowerCase();
      return new la(
        "(WebView|(iPhone|iPod|iPad)(?!.*Safari)|Android.*(;wv)|Linux; U; Android)",
        "ig"
      ).match(a);
    }
    preload() {
      function a(f, g, h) {
        let m = b.qM();
        m.name = l.mi(f);
        b.images.J.hasOwnProperty(f) && b.Bw.push(b.images.J[f]);
        b.images.J[f] = m;
        m.load(g, function () {
          if (l.xN().includes(f)) {
            let n = new FileReader();
            n.onload = function (q) {
              l.MR(f, new Dd(q.target.result));
              h(m.data);
            };
            n.onerror = function () {
              throw 2;
            };
            n.readAsArrayBuffer(g);
          } else h(m.data);
        });
      }
      let b = this;
      for (var c = 0; c < l.MAX; ) {
        var d = c++;
        l.AO(d) && l.wz(d, a);
      }
      0 < l.aB().length ? this.load(l.aB(), null, P(this, this.GC)) : this.GC();
      if (this.config.xE) {
        let f = window.document.querySelectorAll("meta[data-hash]").item(0)
          .dataset.hash;
        c = window.document.querySelectorAll("script[src]");
        d = null;
        let g = 0,
          h = c.length;
        for (
          ;
          g < h &&
          ((d = c.item(g++)), !new la(this.config.title, "i").match(d.src));

        );
        if (null != d) {
          var e = new XMLHttpRequest();
          e.open("GET", d.src);
          e.responseType = "arraybuffer";
          e.onreadystatechange = function () {
            if (4 == e.readyState && 200 == e.status)
              try {
                window.crypto.subtle
                  .digest("SHA-256", e.response)
                  .then(function (m) {
                    m = btoa(
                      String.fromCharCode.apply(null, new Uint8Array(m))
                    );
                    b.GS = m != f;
                  })
                  .catch(function () {});
              } catch (m) {}
          };
          e.send();
        }
      }
    }
    GC() {
      let a = this;
      cc.delay(function () {
        a.df.start();
        a.DC(a);
      }, 1);
    }
    Sl(a) {
      a = Object.create(a.prototype);
      a.O = this;
      a.caller = a;
      return this.load(a.jc(), null, void 0);
    }
    load(a, b, c) {
      let d = [],
        e = [],
        f = 0,
        g = 0;
      for (; g < a.length; ) {
        var h = a[g];
        ++g;
        if (!l.Cv(h) || (null != l.Qq() && null != l.IA()))
          (f += 1),
            l.SP(h, function (m) {
              --f;
              null != b && b(m);
              null != c && 0 == f && c();
            }),
            (h = l.mi(h)),
            this.zo.load(h) && e.push(h);
      }
      for (; 0 < d.length; ) this.zo.SQ(d.pop());
      return new Tg(this.zo, e);
    }
    VA(a) {
      return this.images.J[a];
    }
    qM() {
      return new Ce(this.config.xB, this.config.io);
    }
    FM(a) {
      this.VA(a).Jx();
      this.images.remove(a);
      l.js(a);
    }
    GM() {
      let a = 0,
        b = this.Bw;
      for (; a < b.length; ) b[a++].Jx();
      this.Bw = [];
    }
    createTexture(a, b, c) {
      function d(n) {
        if (84 == n.b[0] && 80 == n.b[1] && 83 == n.b[2])
          return (n = new Ed().hD(n)), new dc(Ug.Bl(n), n.Zl.scale);
        if (66 == n.b[0] && 77 == n.b[1] && 70 == n.b[2])
          return (n = new De().sm(n)), new dc(Ee.Bl(n), 1, Ee.NA(n));
        throw 3;
      }
      null == c && (c = !1);
      null == b && (b = 0);
      for (var e = l.mi(a), f = 0, g = this.V.RN(); f < g.length; ) {
        var h = g[f];
        ++f;
        if (h.name == e) return h;
      }
      f = this.VA(a);
      g = l.CN(a);
      let m = null;
      null == g &&
        ((h = l.Cl(a, "dat")),
        -1 != h
          ? ((g = new Dd(l.data.J[h])), null == g.data && (g = null))
          : ((h = l.Cl(a, "dat", !0)), -1 != h && (g = new Dd(l.data.J[h]))));
      if (null == g) {
        h = l.Cl(a, "tps");
        if (-1 != h)
          try {
            m = d(l.Yn(h));
          } catch (n) {}
        null == m &&
          ((h = l.Cl(a, "json")),
          -1 != h &&
            ((h = l.yb(h)),
            (h = new Ed().$Q(h)),
            (m = new dc(Ug.Bl(h), h.Zl.scale))));
        null == m &&
          ((h = l.Cl(a, "dat")),
          -1 != h &&
            ((h = l.Yn(h)),
            (h = new Ed().hD(h)),
            (m = new dc(Ug.Bl(h), h.Zl.scale))));
        null == m &&
          ((h = l.Cl(a, "fnt")),
          -1 != h &&
            ((h = l.Yn(h)),
            (h = new De().sm(h)),
            (m = new dc(Ee.Bl(h), 1, Ee.NA(h)))));
      }
      h = null;
      if (null == g) h = this.V.createTexture(f, b, m, e);
      else if (
        ((g = g.hq),
        1 == g.length ||
          Ma.tl(g, function (n) {
            return null != n.name;
          }))
      )
        for (
          h = this.V.createTexture(f, b, d(g[0].data), e), b = 1, e = g.length;
          b < e;

        )
          (f = b++), this.V.lA(h, d(g[f].data), g[f].name);
      else
        for (
          h = this.V.createTexture(f, b, null, e), b = 0, e = g.length;
          b < e;

        )
          this.V.lA(h, d(g[b++].data), null);
      c && (h.$e = 1 / l.yN(a));
      return h;
    }
    uP(a) {
      this.window.update();
      if (this.config.AA) {
        let b = this.MS,
          c = P(this, this.update);
        b.elapsedTime += a;
        b.Sh += a * b.Bx;
        0.25 < b.Sh && (b.Sh = 0.25);
        for (; b.Sh >= Mb.Mk; ) c(Mb.Mk), (b.Sh -= Mb.Mk);
        this.bd(b.Sh / Mb.Mk);
      } else this.update(a), this.bd(1);
      for (this.jN.update(a); 0 < this.FA.length; ) this.FA.pop()();
    }
    update(a) {
      let b = 0,
        c = this.Av;
      for (; b < c.length; ) {
        let d = c[b];
        ++b;
        null != d && d.state.update(a);
      }
      this.V.Fi();
      this.V.um();
      this.RO();
      this.fa.update(a);
      this.V.ei();
    }
    bd(a) {
      this.V.Fi() &&
        (this.V.um(), this.V.clear(), this.fa.bd(a), this.V.um(), this.V.ei());
    }
    RO() {
      if (this.config.WB) {
        var a = this.window;
        a = a.Fc.x / a.Fc.y;
        var b = this.window.Fc,
          c = b.x;
        b = b.y;
        2.5 < a
          ? ((a = (b / c) * 2.5), (c = (1 - a) / 2), this.V.yk(c, 0, c + a, 1))
          : 0.4 > a &&
            ((a = c / b / 0.4), (c = (1 - a) / 2), this.V.yk(0, c, 1, c + a));
      }
    }
    zB() {
      if (this.config.audio && Q.HB())
        if (null != this.Ra && this.Ra instanceof Wc) {
          var a = this.Ra.Wg,
            b = this.Ra.names;
          this.Ra.F();
          Q.ib();
          this.Ra = new Wc();
          this.Ra.Wg = a;
          this.Ra.names = b;
        } else {
          a = this.config.Hz;
          var c = null != a ? a : Q.DM();
          Ma.tl(l.Qq(), function (f) {
            return f == c;
          }) && l.AR(c);
          b = l.KN();
          a = [];
          for (var d = 0; d < b.length; ) {
            let f = b[d];
            ++d;
            new la("audio", "").match(f) && a.push(f);
          }
          if (0 != a.length) {
            Q.ib();
            Q.HB() && (this.Ra = new Wc());
            var e = this;
            b = function (f, g, h) {
              Fe.oB(g)
                ? ((f = Fe.nN(g)), (g = Fe.fR(g)), e.Ra.fs(f, g, h))
                : e.Ra.es(f, g, l.sg(f), h);
            };
            for (d = 0; d < a.length; ) l.wz(l.pg(a[d++]), b);
          }
        }
    }
    nv() {
      return new Ge();
    }
    gv(a) {
      return this.Av[a];
    }
    du(a) {
      return (this.Av[a.ev()] = a);
    }
    XN() {
      let a = this.gv(1);
      return null != a ? a : this.du(new He(this.window.canvas));
    }
    YN() {
      return this.XN().state;
    }
    WN() {
      let a = this.gv(0);
      return null != a ? a : this.du(new Ie());
    }
    jh() {
      return this.WN().state;
    }
    Nj() {
      let a = this.gv(3);
      return null != a ? a : this.du(new Je(this.window.canvas));
    }
    hd() {
      return this.Nj().state;
    }
    sM(a) {
      return new Ke(a);
    }
    nx() {
      let a = window.document.createElement("div");
      window.document.body.appendChild(a);
      a.innerText = "v" + Cd.VERSION.toString();
      let b = a.style;
      b.fontFamily = "monospace";
      b.fontSize = "1.25em";
      b.color = "#fff";
      b.position = "fixed";
      b.bottom = "1em";
      b.left = "1em";
      b.whiteSpace = "pre";
      b.textShadow = "1px 1px 1px #000";
      b.userSelect = "none";
      b.setProperty("-webkit-user-select", "none");
      setTimeout(function () {
        window.document.body.removeChild(a);
      }, 1e4);
    }
    KC() {
      this.Ra.Jg(1, 0);
    }
    VP() {
      this.Ra.Jg(0, 0);
    }
    JS() {
      try {
        return navigator.userAgentData.mobile;
      } catch (a) {
        return new la(
          "Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini",
          "i"
        ).match(ma.navigator.userAgent) ||
          "undefined" !== typeof window.orientation ||
          "onTouchstart" in window ||
          0 < navigator.wT
          ? !0
          : window.matchMedia("(any-pointer:coarse)").matches;
      }
    }
    reload() {
      window.location.reload();
    }
    CS() {
      return this.config.Iz
        ? new Promise(function (a) {
            let b = new Image();
            b.onerror = function () {
              b.onload = null;
              b.onerror = null;
              a(!1);
            };
            b.onload = function () {
              b.onload = null;
              b.onerror = null;
              a(!0);
            };
            b.src =
              "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=";
          })
        : Promise.resolve(!1);
    }
    zN() {
      return ma.navigator.language;
    }
    Ae(a) {
      "unhandledrejection" != a.type &&
        null != (null != a ? a.error : null) &&
        null != a.error.stack &&
        Da.Dd(a.error.stack);
      null != this.df && this.df.stop();
      ma.console.log("" + this.config.title + " CRASHED \ud83d\udc80");
      window.removeEventListener("error", P(this, this.Ae));
      window.removeEventListener("unhandledrejection", P(this, this.Ae));
    }
  }
  Ba.i = !0;
  Object.assign(Ba.prototype, { l: Ba });
  class J extends Ba {
    constructor(a) {
      super();
      this.ib(
        new Vg(
          "Ctrr",
          !0,
          null != a ? a : "en",
          null,
          null,
          null,
          null,
          { alpha: !1, depth: !1, antialias: !0, stencil: !0 },
          !1,
          null,
          !0,
          null,
          null,
          null,
          null,
          !1,
          null,
          null,
          null,
          null,
          !1,
          null
        ),
        P(this, this.Fg)
      );
    }
    Ae(a) {
      super.Ae(a);
      this.jd && this.reload();
    }
    nv() {
      return new z(this.sM(this.config.title));
    }
    preload() {
      super.preload();
      J.Xr = !this.NB() && !this.jd;
      this.jd
        ? l.Fs(1)
        : this.Sj && 2 >= this.window.Mj() && 1e3 > this.window.Fc.x
        ? l.Fs(1)
        : l.Fs(2);
    }
    LN() {
      return this.jd
        ? 5e3 < this.window.Fc.x
          ? 4
          : 3e3 < this.window.Fc.x
          ? 2
          : 1
        : this.Sj && 2 < this.window.Mj()
        ? 2
        : 1;
    }
    Fg() {
      window.document.body.addEventListener(
        "touchcancel",
        function (b) {
          b.preventDefault();
        },
        { passive: !1 }
      );
      window.document.body.addEventListener(
        "touchend",
        function (b) {
          b.preventDefault();
        },
        { passive: !1 }
      );
      window.document.body.addEventListener(
        "touchstart",
        function (b) {
          b.preventDefault();
        },
        { passive: !1 }
      );
      this.V.DR(new F(0, 0, 0, 1));
      Mb.Mk = 0.016;
      this.V.EM();
      this.window.SR(this.LN());
      this.Nj().PD(5);
      this.config.io
        ? (this.V.md(new Xc()),
          this.V.md(new Le()),
          this.V.md(new Me()),
          this.V.md(new Ne()),
          this.V.md(new Oe()),
          this.V.md(new Pe()),
          this.V.md(new Qe()),
          this.V.md(new Re()))
        : (this.V.md(new Se()),
          this.V.md(new Te()),
          this.V.md(new Ue()),
          this.V.md(new Ve()),
          this.V.md(new We()),
          this.V.md(new Xe()),
          this.V.md(new Ye()),
          this.V.md(new Ze()),
          this.V.md(new $e()));
      J.Ff = J.Hd ? l.qF : l.pF;
      J.xl = J.Hd ? l.oF : l.nF;
      let a = this;
      this.save.load(function () {
        if (null == z.language && ((z.language = a.config.language), a.jd)) {
          let b = ta.substr(a.zN().toLowerCase(), 0, 2);
          new la("(" + af.join("|") + ")", "").match(b) && (z.language = b);
        }
        a.Ui(z.language);
        a.lE();
      });
    }
    Ui(a) {
      l.Ui(a);
    }
    lE() {
      this.fa.Ta.sceneToLoad = ub;
      Q.If("EContextBroken", P(this, this.zB));
      this.Hu = -1;
      let a = this;
      Q.If("EContextResumed", function () {
        a.Ra.Vc(a.Hu) || a.Ra.play(a.Hu, !0, !0);
      });
      this.fa.$p(Yc);
    }
  }
  J.i = !0;
  J.s = Ba;
  Object.assign(J.prototype, { l: J });
  class bf extends J {
    constructor(a) {
      super(a);
      J.np = 0 == M.hasFeature("external_pause");
      J.Xi = 0 == M.hasFeature("external_mute");
      J.Hd = 1 == M.hasFeature("xmas");
      J.We = M.hasFeature("rewarded");
      J.Fe = M.hasFeature("rewarded");
    }
    nv() {
      let a = new z(new cf(Ba.instance.config.title));
      M.hasFeature("force_english") && (z.language = "en");
      return a;
    }
    Fg(a) {
      this.$E();
      M.bQ(P(this, this.$E));
      let b = this;
      M.gs("enableAudio", function () {
        Fd = !1;
        b.Ra.Jg(1);
        try {
          let c = b.fa,
            d = c.Tn(xc, c);
          null != d && d.bT();
        } catch (c) {}
      });
      M.gs("disableAudio", function () {
        Fd = !0;
        b.Ra.Jg(0);
        try {
          let c = b.fa,
            d = c.Tn(xc, c);
          null != d && d.KP();
        } catch (c) {}
      });
      M.gs("pauseGameplay", function () {
        Zh = !0;
        b.Nj().enabled = !1;
        b.df.stop();
      });
      M.gs("resumeGameplay", function () {
        Zh = !1;
        b.Nj().enabled = !0;
        b.hd().reset();
        b.df.start();
      });
      M.cQ(function () {
        M.Jl = !0;
        b.Ra.Jg(0);
        b.Nj().enabled = !1;
        b.df.stop();
      });
      M.fQ(function () {
        M.Jl = !1;
        Fd || b.Ra.Jg(1);
        Zh || ((b.Nj().enabled = !0), b.hd().reset(), b.df.start());
      });
      super.Fg(a);
    }
    Ui(a) {
      M.hasFeature("force_english")
        ? ((z.language = "en"), super.Ui("en"))
        : super.Ui(a);
    }
    lE() {
      this.fa.Ta.sceneToLoad = ec;
      this.fa.$p(df);
    }
    KC() {
      M.Jl || Fd || this.Ra.Jg(M.uN());
    }
    nx() {
      M.hasFeature("version") && super.nx();
    }
    $E() {
      let a = M.IN(),
        b = this.window.canvas.style;
      b.top = "" + a.t + "px";
      b.left = "" + a.QB + "px";
      b.width = "calc(100% - " + (a.r + a.QB) + "px)";
      b.height = "calc(100% - " + (a.b + a.t) + "px)";
    }
  }
  bf.i = !0;
  bf.s = J;
  Object.assign(bf.prototype, { l: bf });
  class Wg {}
  Wg.i = !0;
  Wg.Je = !0;
  class Zc {}
  Zc.i = !0;
  Zc.Je = !0;
  Zc.Ib = [Wg];
  class Xg {}
  Xg.i = !0;
  Xg.Je = !0;
  Xg.Ib = [Zc];
  class vb {
    constructor(a, b, c) {
      null == a && (a = 2);
      this.sd = null;
      this.aa = 0;
      this.wm = !1;
      this.Oj = -2;
      this.Xl = 2 > a ? 2 : a;
      null != b && 0 < b.length
        ? ((this.aa = b.length),
          (this.N = b.slice(0, b.length)),
          (this.bb = this.aa))
        : ((this.bb = this.Xl), (this.N = Array(this.bb)));
      c && (this.Oj = 0);
    }
    tw(a) {
      this.aa == this.bb && this.grow();
      this.N[this.aa++] = a;
    }
    Ba() {
      return this.N[0];
    }
    FS(a) {
      let b = this.N;
      b[a] = b[--this.aa];
    }
    trim(a) {
      this.aa = a;
      return this;
    }
    indexOf(a) {
      if (0 == this.aa) return -1;
      let b = 0,
        c = -1,
        d = this.aa - 1,
        e = this.N;
      do
        if (e[b] == a) {
          c = b;
          break;
        }
      while (b++ < d);
      return c;
    }
    Mf(a) {
      a > this.bb && ((this.bb = a), this.Si(a));
    }
    ib(a, b) {
      this.Mf(a);
      this.aa = a;
      let c = this.N,
        d = 0;
      for (; d < a; ) c[d++] = b;
    }
    pQ() {
      if (this.bb > this.Xl) {
        var a = this.Xl,
          b = this.aa;
        this.bb = a > b ? a : b;
        this.Si(this.bb);
      } else {
        a = this.N;
        b = this.aa;
        let c = this.bb;
        for (; b < c; ) a[b++] = null;
      }
    }
    grow() {
      this.bb = Yg.Hn(this.Oj, this.bb);
      this.Si(this.bb);
    }
    Si(a) {
      a = Array(a);
      Nb.un(this.N, 0, a, this.aa);
      this.N = a;
    }
    Xu() {
      Nb.Hr(this.N);
      this.N = null;
      null != this.sd && (this.sd.Xu(), (this.sd = null));
    }
    clear(a) {
      null == a && (a = !1);
      a && Nb.Hr(this.N);
      this.aa = 0;
    }
    iterator() {
      if (this.wm) {
        if (null == this.sd) this.sd = new Gd(this);
        else {
          let a = this.sd;
          a.N = a.ye.N;
          a.wg = a.ye.aa;
          a.xe = 0;
        }
        return this.sd;
      }
      return new Gd(this);
    }
  }
  vb.i = !0;
  vb.Ib = [Xg];
  Object.assign(vb.prototype, { l: vb });
  class da {
    constructor() {
      this.O = Ba.instance;
      this.listener = null;
      this.Mx = !1;
      this.parent = this.Me = this.Y = null;
      this.uC = this.tC = !1;
      this.name = null;
      this.time = 0;
      da.iw.tw(this);
    }
    ra() {
      if (null != this.O) {
        for (var a = this.Me; null != a; ) {
          var b = a.Y;
          a.ra();
          a = b;
        }
        null != this.parent && this.remove();
        for (a = this.listener; null != a; )
          (b = a.next), (a.Pq = null), (a.next = null), (a = b);
        this.O = this.listener = null;
        da.iw.FS(da.iw.indexOf(this));
      }
    }
    remove() {
      null != this.parent && da.removeChild(this);
    }
    iterator() {
      return new Zg(this);
    }
    oa(a) {
      return this.appendChild(a);
    }
    add(a) {
      return this.appendChild($h.kA(a));
    }
    update(a) {
      if (null != this.O) {
        this.Mx = !0;
        for (var b = this.Me, c; null != b; )
          (c = b.Y),
            b.uC || null == b.O || (b.update(a), b.aq(a), (b.time += a)),
            (b = c);
        this.time += a;
      }
    }
    aq() {}
    bd(a) {
      if (null != this.O && 0 != this.Mx)
        for (var b = this.Me, c; null != b; )
          (c = b.Y), b.tC || null == b.O || b.bd(a), (b = c);
    }
    Jr() {}
    jb(a) {
      return Math.min(1, this.time / a);
    }
    Tn(a, b) {
      for (var c = this.parent; null != c; ) {
        if (Wa.Rt(c, a)) return c;
        c = c.parent;
      }
      c = 1;
      let d = [this];
      for (; 0 < c; ) {
        let e = d[--c],
          f = e.Me;
        for (; null != f; ) (d[c++] = f), (f = f.Y);
        if (e != b && Wa.Rt(e, a)) return e;
      }
      return null;
    }
    appendChild(a) {
      a.parent = this;
      var b = this.Me;
      if (null != b) {
        for (; null != b.Y; ) b = b.Y;
        b.Y = a;
      } else this.Me = a;
      a.Jr();
      return a;
    }
    static removeChild(a) {
      if (null == a || null == a.parent) return !1;
      var b = a.parent;
      if (a == b.Me) b.Me = a.Y;
      else
        for (b = b.Me; null != b; ) {
          if (b.Y == a) {
            b.Y = a.Y;
            break;
          }
          b = b.Y;
        }
      a.parent = a.Y = null;
      return !0;
    }
  }
  da.i = !0;
  Object.assign(da.prototype, { l: da });
  class yc extends da {
    constructor() {
      super();
      this.name = this.Ga();
      this.Ta = {};
      this.caller = null;
      this.De = "New";
      this.xb("New");
      this.node = new qb();
      this.node.Ne = 1;
      this.ud = null;
    }
    VN() {
      return "Running" == this.De;
    }
    ba(a) {
      this.fa.$p(a, this, !1);
    }
    Bg(a) {
      this.fa.$p(a, this, !0);
    }
    Jf(a) {
      let b = this;
      if (null != a) {
        let c = this.iterator();
        for (; 0 < c.top; ) {
          let d = c.stack[--c.top];
          c.push(d);
          Wa.Rt(d, a) && (b = d);
        }
      }
      this.fa.Jf(b);
    }
    wi() {
      return !0;
    }
    jc() {
      return [];
    }
    $A() {
      let a = [],
        b = 0,
        c = this.jc();
      for (; b < c.length; ) {
        let d = c[b];
        ++b;
        (l.Cv(d) && null == l.IA()) || l.ob(d) || a.push(d);
      }
      return a;
    }
    WA(a) {
      return new $c(this, a);
    }
    Lj() {
      return 0;
    }
    bc() {
      return 0;
    }
    ra() {
      super.ra();
      this.xb("Destroyed");
      null != this.node && this.node.F();
      this.node = null;
    }
    update(a) {
      super.update(a);
      this.node.Hh(a);
    }
    bd(a) {
      super.bd(a);
      this.node.Fd();
      this.node.Nm();
      this.O.V.Bq(this.node);
    }
    ua() {}
    hm() {}
    fb() {}
    Mc() {}
    qb() {}
    Td(a) {
      this.Es(ua.Kf()(a));
    }
    ad(a) {
      this.Es(1 - a);
    }
    xb(a) {
      switch (a) {
        case "Created":
          this.node.Ne = 0;
          this.Es(0);
          break;
        case "Stopped":
          this.node.Ne = 1;
      }
      this.De = a;
    }
    Es(a) {
      this.li().bf(a);
    }
    li() {
      let a = this.node.ki(5);
      null == a && (a = new fc(0));
      this.node.zh(a);
      return a;
    }
    JN() {
      return this.ud.parent instanceof wc ? null : this.ud.parent.Of;
    }
    Ga() {
      return "Scene";
    }
  }
  yc.i = !0;
  yc.s = da;
  Object.assign(yc.prototype, { l: yc });
  class ca extends yc {
    constructor() {
      super();
      this.buttons = [null];
      this.Cc = new $g();
      this.cd = this.Aj = this.rd = this.gh = this.qa = null;
    }
    createTexture(a) {
      if (null != r.Wl[a]) return r.Wl[a];
      let b = this.O.createTexture(a, 8);
      return (r.Wl[a] = b);
    }
    ia(a) {
      let b = r.Wl[a];
      null != b && (Ba.instance.V.ia(b), Ba.instance.FM(a), (r.Wl[a] = null));
    }
    Vk() {
      let a = za.create(null, k.lK, k.mK);
      this.node.P(a.j.u);
      this.buttons[0] = a;
    }
    Ke(a, b) {
      this.rd = new F(a, b, 0, 1);
      this.qa = new S("fix");
      this.node.P(this.qa.u);
    }
    pj() {
      null == r.cd && (r.cd = this.createTexture(l.Mh));
      this.cd = new y(null, r.cd);
      this.node.P(this.cd.u);
      this.cd.la(X.Rn(0, 360));
    }
    Tg() {
      this.Da = new y(null, r.Da);
      this.node.P(this.Da.u);
    }
    Md() {
      if (l.ob(l.Xd)) {
        r.ji = this.createTexture(l.Xd);
        var a = r.fv(z.language, z.language);
        r.ic = r.ji.children[a];
        r.ii = r.ji.children[a + 1];
      }
      l.ob(l.zt) && (r.Tl = this.createTexture(l.zt));
      a = J.Hd ? l.Ay : l.Lh;
      l.ob(a) && (r.Da = this.createTexture(a));
      l.ob(l.hf) && (r.Wa = this.createTexture(l.hf));
      l.ob(l.Mp) && (r.yc = this.createTexture(l.Mp));
    }
    WA(a) {
      return new ef(this, a);
    }
    ua() {
      this.Md();
      null == ca.Tt &&
        ((ca.Tt = new gc(null, new F(0, 0, 0, 1))), this.fa.Ba.P(ca.Tt.u));
      this.Aj = ca.Tt;
    }
    hm() {
      super.hm();
      this.qb();
    }
    qb() {
      var a = this.fa.ka(),
        b = this.fa.ja();
      let c = this.fa.Xq();
      if (null != this.rd) {
        this.gh = c.gi(this.rd.x / this.rd.y);
        this.qa.o(this.gh.A);
        this.qa.m(this.gh.D);
        var d = this.gh;
        this.qa.H((d.B - d.A) / this.rd.x);
      }
      null != this.Hf &&
        (this.Hf.o(this.fa.ka() - this.Hf.ka()),
        this.Hf.m(this.fa.ja() - this.Hf.ja()));
      d = this.buttons[0];
      if (null != d) {
        var e = c.gi(this.rd.x / this.rd.y);
        d.j.H((0.2 * (e.B - e.A)) / d.ec.x);
        d.o(10);
        d.m(this.fa.ja() - d.j.ja() - 10);
      }
      null != this.Da &&
        ((e = r.Da.size),
        (d = a / e.x),
        (e = b / e.y),
        (this.gN = d > e),
        this.Da.H(Math.max(d, e)),
        this.Da.o(this.fa.ka() / 2),
        (d = this.Da),
        d.o(d.wa() - this.Da.ka() / 2),
        this.Da.m(0));
      null != this.cd &&
        (this.cd.C(),
        this.cd.lS(new F((c.A + c.B) / 2, (c.D + c.G) / 2, 0, 1)),
        this.cd.H((c.B - c.A) / 260),
        (a = Math.max(a, b) / 2),
        (a = (2 * Math.sqrt(2 * a * a)) / r.cd.size.x),
        this.cd.Qa < a && this.cd.H(a),
        (a = 1 / this.fa.Se()),
        1 > a && ((b = this.cd), b.H(b.Qa * a)),
        (a = this.cd),
        a.H(2 * a.Qa));
    }
    update(a) {
      super.update(a);
      if (this.VN()) {
        this.Cc.Fi();
        this.GR();
        this.Od(a);
        this.Cc.ei();
        let b = 0,
          c = this.buttons;
        for (; b < c.length; ) {
          let d = c[b];
          ++b;
          null != d && d.update(a);
        }
      }
      null != this.cd && ((a = this.cd), a.la(a.Yd + 0.1));
    }
    bc() {
      return 0.5;
    }
    Td(a) {
      this.Aj.W(1 - a);
    }
    ad(a) {
      this.Aj.W(a);
    }
    GR() {
      var a = this.O.hd();
      this.Cc.pressed = a.Nb(0);
      this.Cc.released = a.qe(0);
      a = a.position[0];
      var b = a.x,
        c = a.y;
      a = this.O.V.Ab;
      let d = this.O.window.eo();
      b = -1 + (2 * (b - d.x)) / d.w;
      c = -1 + (2 * (d.y - c)) / d.J;
      a = a.Bv;
      a = new F(
        a.m11 * b + a.m12 * c + a.m14,
        a.m21 * b + a.m22 * c + a.m24,
        0,
        1
      );
      null != a && ((b = this.Cc.g), (b.x = a.x), (b.y = a.y));
    }
    El() {
      let a = 0,
        b = this.buttons;
      for (; a < b.length; ) {
        let c = b[a];
        ++a;
        null != c && c.j.M(!1);
      }
    }
    nS() {
      let a = 0,
        b = this.buttons;
      for (; a < b.length; ) {
        let c = b[a];
        ++a;
        null != c && c.j.M(!0);
      }
    }
    Od() {}
    hb(a) {
      let b = this.buttons[a];
      if (null == b || "Running" != this.De || b.JO || !b.pi()) return !1;
      let c = !1;
      if (0 == a) {
        var d = this.O.jd ? 461 : -1;
        d = this.O.jh().Nb(d);
      } else d = !1;
      if (this.Cc.WL(a, b) || d) b.select(), (c = !0);
      b.Tw(this.Cc.JB(a));
      b.setActive(this.Cc.isActive(a));
      c && x.play(x.Nh);
      return c;
    }
    Es() {}
    yb(a, ...b) {
      return Db.get(a, 0 < b.length ? b.slice() : null);
    }
    Wq(...a) {
      let b = [],
        c = 0;
      for (; c < a.length; ) b.push(Db.get(a[c++]));
      return b;
    }
    mm() {
      this.O.Ra.stop(J.xl);
      this.TC(J.Ff);
    }
    xQ() {
      this.O.Ra.stop(J.Ff);
      this.TC(J.xl);
    }
    TC(a) {
      let b = this.O.Ra;
      b.Rf(z.Zc ? 1 : 0);
      b.Vc(a) || (b.play(a, !0), (this.O.Hu = a));
    }
    Nq() {
      let a = this.O.Ra;
      a.Vc(J.Ff) && a.Sn(J.Ff, 0.5, !0);
      a.Vc(J.xl) && a.Sn(J.xl, 0.5, !0);
    }
    BD() {
      let a = this;
      Q.ho() &&
        !ca.CD &&
        l.ob(l.Np) &&
        ((this.Hf = new y(null, this.createTexture(l.Np), "0000")),
        this.Hf.H(this.O.window.Vo),
        this.O.Sj || this.Hf.H(this.O.window.Mj()),
        this.fa.Ba.P(this.Hf.u),
        this.Hf.pa()
          .play(k.Oa(null, 0, 53, 30))
          .Be(function () {
            a.Hf.F();
            a.Hf = null;
            a.ia(l.Np);
          }),
        x.play(x.HJ),
        (ca.CD = !0),
        this.qb());
    }
    $S() {
      let a = 0;
      for (; 17 > a; ) {
        let b = a++;
        this.ia(
          [
            194, 189, 184, 179, 174, 169, 164, 158, 153, 148, 143, 138, 133,
            128, 123, 118, 113,
          ][b]
        );
        this.ia(
          [
            196, 191, 186, 181, 176, 171, 166, 161, 155, 150, 145, 140, 135,
            130, 125, 120, 115,
          ][b]
        );
        this.ia(
          [
            198, 193, 188, 183, 178, 173, 168, 163, 157, 152, 147, 142, 137,
            132, 127, 122, 117,
          ][b]
        );
      }
      r.pq = null;
      r.uj = null;
      r.ou = null;
      this.ia(l.Um);
      r.ca = null;
      this.ia(l.an);
      r.Cd = null;
      this.ia(l.Ym);
      r.pm = null;
      this.ia(l.$m);
      r.mc = null;
      this.ia(l.Vm);
      r.be = null;
      this.ia(l.Zm);
      r.Ak = null;
      this.ia(l.Tm);
      r.fd = null;
      this.ia(l.hj);
      r.Kb = null;
      this.ia(l.hj);
      r.bl = null;
      this.ia(l.dn);
      r.Rc = null;
      this.ia(l.bn);
      r.Hk = null;
      this.ia(l.Xm);
      r.zi = null;
      this.ia(l.Wm);
      r.vf = null;
      this.ia(l.ij);
      r.Df = null;
      this.ia(l.cn);
      r.Pc = null;
      this.ia(l.ij);
      r.Df = null;
      this.ia(l.Sm);
      r.hl = null;
    }
    Fp(a) {
      function b(d) {
        return 0 == (vi[a - 1] & d);
      }
      let c = a - 1;
      this.ia(
        [
          194, 189, 184, 179, 174, 169, 164, 158, 153, 148, 143, 138, 133, 128,
          123, 118, 113,
        ][c]
      );
      this.ia(
        [
          196, 191, 186, 181, 176, 171, 166, 161, 155, 150, 145, 140, 135, 130,
          125, 120, 115,
        ][c]
      );
      this.ia(
        [
          198, 193, 188, 183, 178, 173, 168, 163, 157, 152, 147, 142, 137, 132,
          127, 122, 117,
        ][c]
      );
      r.pq = null;
      r.uj = null;
      r.ou = null;
      null != r.ca && b(1) && (this.ia(l.Um), (r.ca = null));
      null != r.Cd && b(2) && (this.ia(l.an), (r.Cd = null));
      null != r.pm && b(4) && (this.ia(l.Ym), (r.pm = null));
      null != r.mc && b(8) && (this.ia(l.$m), (r.mc = null));
      null != r.be && b(64) && (this.ia(l.Vm), (r.be = null));
      null != r.Ak && b(128) && (this.ia(l.Zm), (r.Ak = null));
      null != r.fd && b(512) && (this.ia(l.Tm), (r.fd = null));
      null != r.Kb && b(2048) && (this.ia(l.hj), (r.Kb = null));
      null != r.bl && b(4096) && (this.ia(l.hj), (r.bl = null));
      null != r.Rc && b(16384) && (this.ia(l.dn), (r.Rc = null));
      null != r.Hk && b(65536) && (this.ia(l.bn), (r.Hk = null));
      null != r.zi && b(131072) && (this.ia(l.Xm), (r.zi = null));
      null != r.vf && b(262144) && (this.ia(l.Wm), (r.vf = null));
      null != r.Df && b(524288) && (this.ia(l.ij), (r.Df = null));
      null != r.Pc && b(1048576) && (this.ia(l.cn), (r.Pc = null));
      null != r.Df &&
        b(524288) &&
        (this.ia(l.ij), (r.Df = null), this.ia(l.Sm), (r.hl = null));
    }
    Ga() {
      return "AbstractScene";
    }
  }
  ca.i = !0;
  ca.s = yc;
  Object.assign(ca.prototype, { l: ca });
  class Yc extends ca {
    constructor() {
      super();
    }
    ua() {
      super.ua();
      this.rh = new y(null, this.createTexture(l.wy));
      this.node.P(this.rh.u);
      this.Ke(750, 750);
      var a = "logo";
      "ru" == l.hv() && (a = "logo_ru");
      this.we = new y(this.qa, r.Tl.children[0], a);
      this.we.C();
      this.we.o(375);
      this.we.m(200);
      this.ca = new S();
      this.ca.o(375);
      this.ca.m(400);
      this.qa.appendChild(this.ca);
      a = new y(this.ca, r.Tl.children[0], "bubble");
      a.C();
      this.text = new na(this.ca, r.Tl.children[1]);
      this.text.Pa("100%");
      this.text.rb(a.X.x, a.X.y);
      this.text.Eb(0, 0);
      this.text.Uf(!1);
      this.text.Pa("0%");
      this.text.o(-a.X.x / 2);
      this.text.m(-a.X.y / 2);
      this.text.lc(0.7 * this.text.Tq());
      this.Ul = this.O.Sl(this.fa.Ta.sceneToLoad);
      this.Yj = this.wd = 0;
      this.qj = Math.random() * Eb * 2;
      this.rj = Math.random() * Eb * 2;
      this.Bk = 0.1 * Math.random() - 0.05;
      this.Ck = 0.1 * Math.random() - 0.05;
    }
    qb() {
      super.qb();
      1 < this.fa.Se()
        ? (this.rh.la(0),
          this.rh.o(0),
          this.rh.jx(this.fa.ka()),
          this.rh.hx(this.fa.ja()))
        : (this.rh.la(90),
          this.rh.o(this.fa.ka()),
          this.rh.jx(this.fa.ja()),
          this.rh.hx(this.fa.ka()));
    }
    ra() {
      this.ia(l.wy);
      super.ra();
    }
    update(a) {
      super.update(a);
      this.qb();
      this.ca.o(375);
      this.ca.m(400);
      var b = 50 * Math.cos(this.qj);
      a = 50 * Math.sin(this.rj);
      this.qj += this.Bk;
      this.rj += this.Ck;
      let c = this.ca;
      c.o(c.wa() + b);
      b = this.ca;
      b.m(b.Sa() + a);
      switch (this.Yj) {
        case 0:
          this.wd < this.Ul.Yq() &&
            ((this.wd += 5),
            100 < this.wd && (this.wd = 100),
            this.TD(this.wd));
          this.text.Pa("" + this.wd + "%");
          this.Ul.pv() && 100 == this.wd && (this.Yj++, (this.time = 0));
          break;
        case 1:
          0.5 > this.time
            ? ((this.Bk *= 0.95), (this.Ck *= 0.95))
            : (this.Yj++, this.dk());
      }
    }
    TD() {}
    dk() {
      this.ba(this.fa.Ta.sceneToLoad);
    }
    bc(a) {
      return null == a ? 0 : 0.5;
    }
    Ga() {
      return "LoadingScene";
    }
  }
  Yc.i = !0;
  Yc.s = ca;
  Object.assign(Yc.prototype, { l: Yc });
  class df extends Yc {
    constructor() {
      super();
    }
    TD(a) {
      M.WR(a);
    }
    Ga() {
      return "FamobiLoadingScene";
    }
  }
  df.i = !0;
  df.s = Yc;
  Object.assign(df.prototype, { l: df });
  class ub extends ca {
    constructor() {
      super();
    }
    jc() {
      let a = [l.Zf, l.Xd, l.Mh, l.hf, l.Og, l.Ph, l.Ng, l.Np, l.sG, J.Ff];
      J.Hd ? (a.push(l.Ay), a.push(l.zy)) : (a.push(l.Lh), a.push(l.At));
      0 == D.Kj() && a.push(1 < this.O.window.Wn() ? l.Pt : l.Qt);
      return a;
    }
    bc(a) {
      return a instanceof hc ? 0 : super.bc(a);
    }
    Td(a, b) {
      null == b ? this.Aj.W(1 - a) : super.Td(a, b);
    }
    Tg() {
      super.Tg();
      this.Nc = new y(null, r.Mz);
      this.node.P(this.Nc.u);
    }
    Md() {
      super.Md();
      let a = J.Hd ? l.zy : l.At;
      l.ob(a) && (r.Mz = this.createTexture(a));
    }
    ua() {
      super.ua();
      this.Tg();
      this.pj();
      this.Ke(600, 900);
      this.Kh = new y(null, r.Wa, k.jL);
      this.eh = new y(null, r.Wa, k.BK);
      this.node.P(this.Kh.u);
      this.node.P(this.eh.u);
      this.we = new S(null, this.qa);
      this.we.o(303);
      this.we.m(220);
      this.we.H(0.9);
      if (J.Hd) {
        var a = new y(this.we, r.Wa, k.hL);
        a.o(-230);
        a.m(-275);
      }
      new y(this.we, r.Wa, "ru" == l.hv() ? k.MK : k.LK).C();
      J.Hd && ((a = new y(this.we, r.Wa, k.iL)), a.o(-230), a.m(-275));
      this.I = new y(this.qa, r.Wa);
      this.I.o(378);
      this.I.m(364);
      this.YE();
      this.I.C();
      this.nq = 0;
      a = Ob.jl(this.yb("PLAY"));
      a.o(65);
      a.m(500);
      this.qa.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a.focus();
      a = za.create(null, k.Pk, k.Qk, k.CK);
      a.o(309);
      a.m(617);
      this.qa.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a = new Hd();
      a.o(129);
      a.m(617);
      this.qa.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      let b = this;
      Q.once("EContextResumed", function () {
        b.O.Ra.Vc(J.Ff) || b.mm();
      });
    }
    fb() {
      super.fb();
      ub.Ej = !1;
      this.mm();
      this.ZC();
      1 == z.hint && X.rm() && 3 < D.Kj() && 3 < this.time && this.oa(new Id());
      this.ia([97, 95, 93, 91, 89][z.le]);
      r.I = null;
      this.BD();
      this.resize();
    }
    resize() {
      var a = 0;
      this.rd.y = 900;
      var b = 0.9,
        c = this.fa.Se();
      1 < c &&
        (2 < c && (c = 2),
        (this.rd.y = Ua(c, 1, 2, 900, 650)),
        (a = Ua(c, 1, 2, 0, -80)),
        (b = Ua(c, 1, 2, 0.9, 0.8)));
      super.qb();
      this.buttons[1].m(500 + a);
      this.buttons[2].m(617 + a);
      this.buttons[3].m(617 + a);
      this.we.H(b);
      J.Hd
        ? (this.I.o(378),
          this.I.m(370),
          1.1 < c &&
            ((a = Ua(c, 1.1, 2, 0, 1)),
            (b = this.I),
            b.o(b.wa() - 10 * a),
            (b = this.I),
            b.m(b.Sa() - 15 * a)),
          0.6 < c && ((a = this.I), a.o(a.wa() - 8)))
        : (this.I.o(378),
          this.I.m(370),
          "ru" != l.hv() &&
            ((a = this.I), a.o(a.wa() + 3), (a = this.I), a.m(a.Sa() + 6)),
          1.1 < c &&
            ((a = Ua(c, 1.1, 2, 0, 1)),
            (b = this.I),
            b.o(b.wa() - 8 * a),
            (b = this.I),
            b.m(b.Sa() - 7 * a)));
      J.Hd && 0.6 < c && ((c = this.we), c.H(0.85 * c.Qa));
      b = this.fa.Xq();
      c = this.Da.ka() / this.Nc.X.x;
      this.Nc.H(c);
      this.Nc.o((b.A + b.B) / 2);
      c = this.Nc;
      c.o(c.wa() - this.Nc.ka() / 2);
      this.Nc.m(this.Da.ja() - this.Nc.ja());
      this.gN &&
        (this.Nc.m(b.G - b.D - this.Nc.ja()),
        (c = this.Nc),
        c.m(c.Sa() + this.fa.Se() * this.Nc.ja() * 0.3));
      c = (b.B - b.A) / 2;
      a = 0.2;
      var d = this.fa.Se();
      1 < d && ((a = 0.2 + (d - 1)), 0.3 < a && (a = 0.3));
      a = new Y(0, 0, c, (b.G - b.D) * a);
      b = b.G;
      let e = a.G - a.D;
      a.G = b;
      a.D = b - e;
      this.Pv = a.gi(1);
      b = 1 < d ? 0.6 : 0.4;
      d = this.Pv;
      this.Kh.H(((d.B - d.A) * b) / this.Kh.X.x);
      d = this.Pv;
      this.Kh.o((d.A + d.B) / 2 - this.Kh.ka() / 2);
      this.Kh.m(this.Pv.G - 1.1 * this.Kh.ja());
      this.Kh.W(0.5);
      d = a.B - a.A;
      a.A = c;
      a.B = c + d;
      c = this.Qv = a.gi(1);
      this.eh.H(((c.B - c.A) * b) / this.eh.X.x);
      c = this.Qv;
      this.eh.o((c.A + c.B) / 2 - this.eh.ka() / 2);
      this.eh.m(this.Qv.G - 1.1 * this.eh.ja());
      this.eh.W(0.5);
    }
    update(a) {
      super.update(a);
      this.resize();
      null == this.Tn(Id, this) &&
        ((this.nq -= a),
        0 >= this.nq &&
          this.O.hd().Nb(0) &&
          this.I.Ub(this.Cc.g) &&
          ((z.le = this.MP()),
          (z.hint = 0),
          this.YE(),
          this.aC(),
          x.play(x.Nh),
          z.flush(),
          (this.nq = 0.25)));
    }
    bd(a) {
      super.bd(a);
    }
    Od() {
      if (this.O.jh().Nb(461))
        try {
          wi.back();
        } catch (a) {}
      this.hb(1) && this.play();
      this.hb(2) && this.iE();
      this.hb(3) && this.mp();
    }
    play() {
      0 == D.Kj() ? (this.Gm() ? this.ba(hc) : this.ba(Xa)) : this.ba(ic);
    }
    Gm() {
      return !this.O.NB();
    }
    iE() {
      this.ba(zc);
    }
    mp() {
      this.ba(Ac);
    }
    YE() {
      this.I.Fb(k.gj(k.AK, z.le));
      switch (z.le) {
        case 0:
        case 1:
          this.I.ys();
          break;
        case 2:
          this.I.Cm();
      }
    }
    MP() {
      let a = z.le;
      if (J.Hd)
        switch (a) {
          case 3:
            a = 4;
            break;
          case 4:
            a = 3;
        }
      else
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
      return a;
    }
    aC() {
      this.I.H(0.95);
      this.I.Sb().zS();
      this.I.Sb().scale(1, 1, ua.Pu(0.1, 0.5));
    }
    ZC() {
      0 == z.ug[0][0] ? this.Gm() && J.Xr && this.O.Sl(hc) : this.O.Sl(ic);
    }
    Ga() {
      return "MenuScene";
    }
  }
  ub.i = !0;
  ub.s = ca;
  Object.assign(ub.prototype, { l: ub });
  class ec extends ub {
    constructor() {
      super();
    }
    ua() {
      super.ua();
      M.hasFeature("credits") || (this.Kh.M(!1), this.eh.M(!1));
    }
    fb() {
      super.fb();
      xi || ((xi = !0), M.kN());
    }
    play() {
      let a = this;
      M.cf("button:main:start", function () {
        if (0 == D.Kj())
          if (a.Gm()) a.ba(xc);
          else {
            let b = ad;
            M.dt(Ca(), function () {
              a.ba(b);
            });
          }
        else a.ba(jc);
      });
    }
    iE() {
      this.ba(Jd);
    }
    ZC() {
      0 == z.ug[0][0] ? this.Gm() && J.Xr && this.O.Sl(xc) : this.O.Sl(jc);
    }
    mp() {
      this.ba(Kd);
    }
    Gm() {
      return M.hasFeature("intro") ? super.Gm() : !1;
    }
    Ga() {
      return "FamobiMenuScene";
    }
  }
  ec.i = !0;
  ec.s = ub;
  Object.assign(ec.prototype, { l: ec });
  class zc extends ca {
    constructor() {
      super();
    }
    jc() {
      return [l.Zf, l.Xd, l.Lh, l.Mh, l.hf, l.Og, l.Ph, l.Ng, J.Ff];
    }
    ua() {
      super.ua();
      this.Tg();
      this.pj();
      this.Ke(600, 900);
      this.Vk();
      var a = za.create(null, k.Lt, k.Mt, k.eL);
      a.o(65);
      a.m(303);
      this.qa.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a = za.create(null, k.Lt, k.Mt, k.SK);
      a.o(311.5);
      a.m(303);
      this.qa.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      this.x = [];
      this.x[1] = new y(this.qa, r.Wa, k.jz);
      this.x[1].o(65);
      this.x[1].m(303);
      this.x[1].M(!1);
      this.x[2] = new y(this.qa, r.Wa, k.jz);
      this.x[2].o(311.5);
      this.x[2].m(303);
      this.x[2].M(!1);
      this.Zs(1, z.me);
      this.Zs(2, z.Zc);
      a = Ob.jl(this.yb("LANGUAGE"));
      a.o(65);
      a.m(420);
      this.qa.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a.focus();
      a = Ob.jl(this.yb("RESET"));
      a.o(65);
      a.m(537);
      this.qa.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
    }
    fb() {
      super.fb();
      this.mm();
      this.vq = z.language;
      this.Mv = af.indexOf(this.vq);
    }
    qb() {
      let a = this.fa.Se(),
        b = 0;
      this.rd.y = 900;
      1.25 < a &&
        ((this.rd.y = 650), (b = (1 / a) * -350), this.O.jd && (b *= 2));
      super.qb();
      this.qa.m(this.gh.D + b);
    }
    Mc() {
      super.Mc();
      if (this.vq != z.language) {
        this.O.V.ia(r.ji);
        r.Wl[l.Xd] = null;
        r.ji = this.createTexture(l.Xd);
        let a = r.fv(z.language, z.language);
        r.ic = r.ji.children[a];
        r.ii = r.ji.children[a + 1];
        this.O.GM();
      }
    }
    Od() {
      this.hb(0) && (z.flush(), this.Vb());
      this.hb(1) && this.yp();
      this.hb(2) && this.xp();
      if (this.hb(3)) {
        var a = this.Mv + 1;
        let b = af.length;
        a %= b;
        0 > a && (a += b);
        this.Mv = a;
        z.language = af[this.Mv];
        l.Ui(z.language);
        a = r.fv(this.vq, z.language);
        r.ic = r.ji.children[a];
        r.ii = r.ji.children[a + 1];
        this.buttons[3].aF();
        this.buttons[4].aF();
        this.buttons[3].Ad(!1);
        this.buttons[3].je = 0;
        this.buttons[3].OD(this.yb("LANGUAGE"));
        this.buttons[4].OD(this.yb("RESET"));
      }
      this.hb(4) && this.jE();
    }
    ba(a) {
      this.vq != z.language && (l.js(l.Xd), l.js(l.Zf));
      super.ba(a);
    }
    jE() {
      this.ba(bd);
    }
    yp() {
      z.me = !z.me;
      this.Zs(1, z.me);
      this.buttons[1].Ad(!1);
      this.buttons[1].je = 0;
    }
    xp() {
      z.Zc = !z.Zc;
      z.Zc ? this.O.Ra.Rf(1) : this.O.Ra.Rf(0);
      this.Zs(2, z.Zc);
      this.buttons[2].Ad(!1);
      this.buttons[2].je = 0;
    }
    Vb() {
      this.ba(ub);
    }
    Zs(a, b) {
      let c = this.buttons[a],
        d = c.icon;
      b ? d.hp(null) : d.hp(new kc().Ow(-0.5));
      c.icon.W(b ? 1 : 0.5);
      this.x[a].M(!b);
    }
    Ga() {
      return "OptionsScene";
    }
  }
  zc.i = !0;
  zc.s = ca;
  Object.assign(zc.prototype, { l: zc });
  class Jd extends zc {
    constructor() {
      super();
    }
    ua() {
      super.ua();
      M.hasFeature("external_mute") &&
        (this.buttons[1].M(!1), this.buttons[2].M(!1));
      if (M.hasFeature("force_english")) {
        this.buttons[3].M(!1);
        let a = this.buttons[4].j;
        a.m(a.Sa() - 117);
      }
    }
    Vb() {
      this.ba(ec);
    }
    jE() {
      this.ba(ff);
    }
    Ga() {
      return "FamobiOptionsScene";
    }
  }
  Jd.i = !0;
  Jd.s = zc;
  Object.assign(Jd.prototype, { l: Jd });
  class bd extends ca {
    constructor() {
      super();
    }
    jc() {
      return [l.Zf, l.Xd, l.Lh, l.Mh, l.hf, l.Og, l.Ph, l.Ng];
    }
    ua() {
      super.ua();
      this.Tg();
      this.pj();
      this.Ke(600, 900);
      this.Vk();
      var a = new na(this.qa, r.ic);
      a.o(20);
      a.m(100);
      a.lc(50);
      a.Sf(!0);
      a.Eb(0);
      a.rb(560, 200);
      a.Pa(this.yb("RESET_TEXT"));
      a = new na(this.qa, r.ii);
      a.Pa(this.yb("RESET_HOLD_TEXT"));
      a.lc(40);
      a.Sf(!0);
      a.Eb(0);
      a.rb(560, 100);
      a.o(20);
      a.m(225);
      a = Ob.jl(this.yb("YES"));
      a.o(65);
      a.m(383);
      this.qa.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a.focus();
      a = Ob.jl(this.yb("NO"));
      a.o(65);
      a.m(500);
      this.qa.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      this.blink = this.state = 0;
    }
    qb() {
      let a = this.fa.Se(),
        b = 0;
      this.rd.y = 900;
      1.25 < a && ((this.rd.y = 650), (b = (1 / a) * -100));
      super.qb();
      this.qa.m(this.gh.D + b);
    }
    update(a) {
      super.update(a);
      this.O.jh();
      if (2 == this.state)
        0.1 > this.time ||
          (this.buttons[1].Tw(0 == (this.blink & 1)),
          this.blink++,
          (this.time = 0),
          10 == this.blink && ((this.state = 3), this.ju()));
      else if (this.Cc.JB(1) && this.O.hd().to(0))
        switch (this.state) {
          case 0:
            this.time = 0;
            this.state = 1;
            break;
          case 1:
            3 < this.time &&
              ((a = z.language),
              z.instance.reset(),
              (z.language = a),
              z.flush(),
              D.reset(),
              (this.state = 2),
              (this.blink = this.time = 0),
              this.buttons[1].blur());
        }
    }
    Od() {
      this.hb(0) && this.ju();
      2 != this.state &&
        this.hb(1) &&
        ((this.time = this.state = 0),
        this.buttons[1].Ad(!1),
        (this.buttons[1].je = 0));
      this.hb(2) && this.Vb();
    }
    ju() {
      this.ba(ub);
    }
    Vb() {
      this.ba(zc);
    }
    Ga() {
      return "ResetScene";
    }
  }
  bd.i = !0;
  bd.s = ca;
  Object.assign(bd.prototype, { l: bd });
  class ff extends bd {
    constructor() {
      super();
    }
    Vb() {
      this.ba(Jd);
    }
    ju() {
      this.ba(ec);
    }
    Ga() {
      return "FamobiResetScene";
    }
  }
  ff.i = !0;
  ff.s = bd;
  Object.assign(ff.prototype, { l: ff });
  class Bc extends ca {
    constructor() {
      super();
      this.oo = new la("(iPad|iPhone)", "g").match(ma.navigator.platform);
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
        (this.oo = !0);
    }
    bc() {
      return 0;
    }
    fb() {
      super.fb();
      this.O.window.canvas.style.visibility = "hidden";
      this.O.Ra.Rf(0);
      this.$d = window.document.createElement("div");
      this.$d.style.display = "flex";
      this.$d.style.position = "fixed";
      this.$d.style.left = "0px";
      this.$d.style.top = "0px";
      this.$d.style.width = "100%";
      this.$d.style.height = "100%";
      this.$d.style.justifyContent = "center";
      this.$d.style.alignItems = "center";
      window.document.body.appendChild(this.$d);
      try {
        (this.video = window.document.createElement("video")),
          this.$d.appendChild(this.video),
          (this.video.muted = this.Hv()),
          (this.video.autoplay = !0),
          (this.video.controls = !1),
          (this.video.poster =
            "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"),
          (this.video.playsInline = !0),
          this.video.addEventListener("ended", P(this, this.ended)),
          this.video.addEventListener("mousedown", P(this, this.Fr)),
          this.video.addEventListener("touchend", P(this, this.OE)),
          (this.url = J.Xr
            ? URL.createObjectURL(this.getData())
            : l.mi(this.jc()[0])),
          (this.video.src = this.url),
          (this.video.style.width = "100%"),
          (this.video.style.height = "100%"),
          (this.video.style.bottom = "0"),
          (this.video.style.left = "0"),
          (this.video.style.objectFit = "contain"),
          (this.video.style.background = "black");
      } catch (b) {
        this.ended();
      }
      let a = this;
      this.dT = this.O.window.If(1, function () {
        try {
          a.Tj() || (a.video.muted = !1);
        } catch (b) {}
      });
      this.cT = this.O.window.If(2, function () {
        try {
          a.video.muted = !0;
        } catch (b) {}
      });
    }
    Mc() {
      super.Mc();
      this.cT();
      this.dT();
    }
    Fr() {
      this.Tj() || (this.video.muted = !1);
    }
    OE() {
      this.Tj() || (this.video.muted = !1);
    }
    ended() {
      this.$d.removeChild(this.video);
      window.document.body.removeChild(this.$d);
      this.O.window.canvas.style.visibility = "";
      this.video.removeEventListener("ended", P(this, this.ended));
      this.video.removeEventListener("mousedown", P(this, this.Fr));
      this.video.removeEventListener("touchend", P(this, this.OE));
      URL.revokeObjectURL(this.url);
      this.FC();
    }
    Tj() {
      return 0 == z.Zc;
    }
    Hv() {
      return this.oo ? !0 : this.Tj();
    }
    Ga() {
      return "VideoScene";
    }
  }
  Bc.i = !0;
  Bc.s = ca;
  Object.assign(Bc.prototype, { l: Bc });
  class hc extends Bc {
    constructor() {
      super();
    }
    jc() {
      return [1 < Ba.instance.window.Wn() ? l.Pt : l.Qt];
    }
    getData() {
      let a = l.data.J[l.Qt];
      return null != a ? a : l.data.J[l.Pt];
    }
    FC() {
      D.Gs(1);
      D.tk(1);
      D.Xw(1);
      this.dk();
    }
    dk() {
      this.ba(Xa);
    }
    ua() {
      super.ua();
      this.Nq();
    }
    fb() {
      super.fb();
      this.O.Sl(Xa);
    }
    Ga() {
      return "IntroVideoScene";
    }
  }
  hc.i = !0;
  hc.s = Bc;
  Object.assign(hc.prototype, { l: hc });
  class xc extends hc {
    constructor() {
      super();
    }
    KP() {
      try {
        this.video.muted = !0;
      } catch (a) {}
    }
    bT() {
      try {
        this.Tj() || (this.video.muted = !1);
      } catch (a) {}
    }
    dk() {
      let a = this,
        b = ad;
      M.dt(Ca(), function () {
        a.ba(b);
      });
    }
    Hv() {
      return super.Hv() ? !0 : Fd;
    }
    Tj() {
      return super.Tj() ? !0 : Fd;
    }
    Ga() {
      return "FamobiIntroVideoScene";
    }
  }
  xc.i = !0;
  xc.s = hc;
  Object.assign(xc.prototype, { l: xc });
  class ic extends ca {
    constructor() {
      super();
    }
    jc() {
      return [l.Zf, l.Xd, l.Lh, l.Mh, l.hf, l.Og, l.Ph, l.Ng, l.Et, l.wG, J.Ff];
    }
    ua() {
      super.ua();
      this.ia(l.Bt);
      this.ia(l.Ct);
      this.ia(l.Dt);
      this.$S();
      this.Tg();
      this.Ke(600, 900);
      this.pj();
      this.Vk();
      r.Gg = this.createTexture(l.Et);
      this.Kz = 750 / r.Gg.hc.xf(k.Jt).ec.x;
      this.offsetY = 150;
      this.uE = 0.7 * r.Gg.hc.xf(k.Jt).ec.y;
      this.Gg = [];
      let a = 0;
      for (; 3 > a; ) {
        var b = a++;
        let c = new S(null, this.qa);
        new y(c, r.Gg, k.Jt);
        new y(c, r.Gg, [k.jJ, k.kJ, k.lJ][b]);
        c.C();
        c.H(this.Kz);
        c.o(300);
        c.m(this.offsetY + b * this.uE);
        this.Gg.push(c);
        let d = new na(c, r.ic);
        d.o(312);
        d.m(140);
        d.lc(70);
        d.Eb(0);
        d.rb(400, 100);
        d.Pa(this.yb("SEASON_NO", Da.Dd(b + 1)));
        b = za.create(r.Gg, k.mJ, k.nJ);
        b.o(512);
        b.m(285);
        b.j.C();
        c.appendChild(b.j);
        this.buttons.push(b);
        this.oa(b);
      }
      this.buttons[1].focus();
    }
    fb() {
      super.fb();
      this.mm();
      this.BD();
    }
    qb() {
      super.qb();
      let a = Math.min(Math.max(0, this.O.window.Wn() - 1), 0.2),
        b = 0;
      for (; 3 > b; ) {
        let c = b++;
        this.Gg[c].H(this.Kz + a);
        this.Gg[c].m(this.offsetY + c * (this.uE + 150 * a));
      }
    }
    Mc() {
      super.Mc();
      r.Gg = null;
      this.ia(l.Et);
    }
    Od() {
      if (this.hb(0)) z.flush(), this.Fp(D.box), this.Vb();
      else
        for (var a = 1; 4 > a; ) {
          let b = a++;
          this.hb(b) && this.YM(b);
        }
    }
    YM(a) {
      a != D.Ua && (this.ia([40, 38, 36][D.Ua - 1]), (r.Yb = null));
      D.Gs(a);
      this.Fp(D.box);
      switch (a) {
        case 1:
          D.tk(1);
          break;
        case 2:
          D.tk(6);
          break;
        case 3:
          D.tk(11);
      }
      this.ba(this.cB()[a - 1]);
    }
    cB() {
      return [Fb, wb, Gb];
    }
    Vb() {
      this.ba(ub);
    }
    Ga() {
      return "SelectSeasonScene";
    }
  }
  ic.i = !0;
  ic.s = ca;
  Object.assign(ic.prototype, { l: ic });
  class jc extends ic {
    constructor() {
      super();
    }
    cB() {
      return [lc, Ub, Vb];
    }
    Vb() {
      this.ba(ec);
    }
    Ga() {
      return "FamobiSelectSeasonScene";
    }
  }
  jc.i = !0;
  jc.s = ic;
  Object.assign(jc.prototype, { l: jc });
  class xb extends ca {
    constructor() {
      super();
    }
    jc() {
      return [l.Zf, l.Xd, l.Lh, l.Mh, l.hf, l.Og, l.Ng, l.Ph, J.Ff];
    }
    ua() {
      super.ua();
      this.ub = D.box;
      10 < this.ub ? (this.ub -= 10) : 5 < this.ub && (this.ub -= 5);
      this.state = 0;
      this.Tg();
      this.pj();
      this.Ke(650, 650);
      this.Yb = new S(null, this.qa);
      this.Yb.o(75);
      this.Yb.m(75);
      this.offsetX = this.Yb.wa();
      this.advance = 500;
      var a = this.bv(),
        b = this.av();
      switch (D.Ua) {
        case 2:
          var c = 5;
          break;
        case 3:
          c = 7;
          break;
        default:
          c = 5;
      }
      this.dl = c;
      this.Nz = [];
      for (var d = (c = 0), e = this.dl; d < e; ) {
        ++d;
        var f = new y(this.Yb);
        f.setColor(
          new F(
            0.17647058823529413,
            0.17647058823529413,
            0.20784313725490197,
            1
          ),
          300,
          300
        );
        f.o(100 + c);
        f.m(150);
        this.Nz.push(f);
        c += this.advance;
      }
      this.Ja = new y(this.Yb, r.Yb, k.SI);
      this.clipPath = new Y(0, 0, 177, 182);
      this.yn = [];
      e = this.dl;
      this.lm = e += 3 > D.Ua ? 1 : 0;
      for (d = c = 0; d < e; ) {
        f = d++;
        var g = this.Ar(f);
        let q = new S(null, this.Yb);
        this.yn.push(q);
        let p = f == this.dl;
        q.o(c);
        var h = null;
        if (p && 3 > D.Ua) (h = new S(null, q)), new y(h, r.Yb, b[f]);
        else {
          new y(q, r.Yb, b[f]);
          var m = new y(q, r.Yb, b[f]);
          m.af(m.X.x, 0);
          m.na(-1);
        }
        if (!p && D.sr(g)) {
          m = new S(null, q);
          m.ix("lock");
          new y(m, r.Yb, k.It);
          var n = new y(m, r.Yb, k.It);
          n.af(n.X.x, 0);
          n.na(-1);
          m.C();
          n = r.Yb.hc.xf(k.It).ec;
          m.o(m.wa() + n.x);
          m.m(m.Sa() + n.y / 2);
          0 < D.lv(g) &&
            ((m = new y(q, r.Wa, k.Nt)),
            m.o(260),
            m.m(320),
            m.H(0.7),
            (n = new na(q, r.ic)),
            n.rb(80, m.ja()),
            n.Eb(1, 0),
            n.bx(-3),
            n.Pa(Da.Dd(yi[g - 1])),
            n.lc(1.2 * (m.ja() | 0)),
            n.o(m.wa() - 80),
            n.m(m.Sa()));
          3 == D.Ua &&
            f == this.dl - 1 &&
            (new y(q, r.Yb, k.iJ),
            (m = new na(q, r.ic)),
            m.Pa(this.yb("MECH_HARDEST")),
            m.rb(184, 60),
            m.lc(36),
            m.Eb(0),
            m.o(253),
            m.m(425),
            m.la(-16));
        }
        p || 75 != D.LA(g) || new y(q, r.Yb, k.WI);
        p && 3 > D.Ua
          ? ((g = new na(h, r.ic)),
            g.rb(300, 100),
            g.o(100),
            g.m(206),
            g.Pa(a[f]),
            g.lc(60),
            g.Sf(!0),
            g.Cs(-40),
            g.Eb(0, 0),
            h.fl(),
            h.la(15))
          : ((h = new na(q, r.ic)),
            h.rb(400, 200),
            h.o(56),
            h.Pa(a[f]),
            h.lc(70),
            h.Sf(!0),
            h.Eb(0),
            h.Cs(-30),
            h.shape(),
            h.m(1 == h.mv() ? 110 : 90));
        c += this.advance;
      }
      this.Oc = [];
      for (a = 0; 2 > a; )
        ++a,
          (b = new y(null, r.Wa, k.gz)),
          b.C(),
          this.qa.appendChild(b),
          this.Oc.push(b);
      this.Vk();
      this.vb = this.add(Cc);
      a = D.ov();
      this.vb.Pa(null == a ? "null" : "" + a);
      this.RL = new gf(this.qa.node, new Y(145, 145, 505, 505));
      this.jt();
      this.cq = !0;
      this.nu = !1;
      this.yA = !0;
    }
    Jq() {
      this.ba(Pb);
    }
    jt() {
      1 < this.ub
        ? (this.Oc[0].Fb(k.gz), this.Oc[0].Vd(1))
        : (this.Oc[0].Fb(k.VK), this.Oc[0].Vd(2));
      this.ub == this.lm
        ? (this.Oc[1].Fb(k.TK), this.Oc[1].Vd(2))
        : (this.Oc[1].Fb(k.UK), this.Oc[1].Vd(1));
      this.Oc[0].H(1);
      this.Oc[1].H(1);
    }
    mx() {
      this.ws = -1;
      this.bu();
      this.$(1);
      this.Ie = -(this.ub - 1) * this.advance;
      this.x1 = this.Ie - this.advance * this.ws;
      this.Ie += this.offsetX;
      this.x1 += this.offsetX;
      this.cq = this.ub != this.lm || 3 == D.Ua;
      this.ub--;
      this.jt();
      this.Oc[0].H(0.9);
    }
    Ls() {
      this.ws = 1;
      this.bu();
      this.$(1);
      this.Ie = -(this.ub - 1) * this.advance;
      this.x1 = this.Ie - this.advance * this.ws;
      this.Ie += this.offsetX;
      this.x1 += this.offsetX;
      this.cq = this.ub != this.dl;
      this.ub++;
      this.jt();
      this.Oc[1].H(0.9);
    }
    update(a) {
      super.update(a);
      if ("Running" == this.De) {
        var b = this.O.hd().Nb(0);
        a = this.O.hd().qe(0);
        switch (this.state) {
          case 0:
            this.time > (this.yA ? 1 : 0) &&
              !this.nu &&
              ((this.nu = !0), (this.yA = !1), this.Oz());
            if (this.Aq) {
              var c = this.O.hd().position[0];
              this.lg = c.x - this.sA.x;
              50 > Math.abs(c.y - this.sA.y) &&
                (-100 > this.lg &&
                  this.ub < this.lm &&
                  ((this.Aq = !1), this.Ls()),
                100 < this.lg && 1 < this.ub && ((this.Aq = !1), this.mx()));
            }
            c = this.RL.Ub(this.Cc.g);
            var d = this.Oc[0].Ub(this.Cc.g);
            let e = this.Oc[1].Ub(this.Cc.g);
            b &&
              (this.buttons[0].blur(),
              (this.Wo = 1 < this.ub && d),
              (this.Mo = this.ub < this.lm && e),
              (this.SL = this.ub <= this.lm && c),
              (this.Aq = !0),
              (b = this.Cc.g),
              (this.sA = new F(b.x, b.y, 0, 1)),
              (this.lg = 0));
            a &&
              (this.Wo && d && (this.mx(), x.play(x.Nh)),
              this.Mo && e && (this.Ls(), x.play(x.Nh)),
              (this.Aq = this.Mo = this.Wo = !1),
              this.SL &&
                c &&
                10 > Math.abs(this.lg) &&
                (x.play(x.Nh),
                this.ub > this.dl
                  ? this.So() && this.$(4)
                  : ((a = this.Ar(this.ub - 1)),
                    D.sr(a)
                      ? ((this.Ta.starCount = D.lv(a)), this.Bg(Ld))
                      : (D.box != a && this.Fp(D.box),
                        D.tk(a),
                        this.Jq(),
                        this.$(4)))));
            break;
          case 1:
            c = this.Ar(this.ub - 1);
            (17 >= c && D.sr(c) && D.bA(c)) ||
              ((c = this.Oc[0].Ub(this.Cc.g)),
              (d = this.Oc[1].Ub(this.Cc.g)),
              b &&
                ((this.Wo = 1 < this.ub && c),
                (this.Mo = this.ub < this.lm && d)),
              a &&
                (this.Wo &&
                  c &&
                  (this.Ja.o(-(this.x1 - this.offsetX)),
                  this.mx(),
                  x.play(x.Nh)),
                this.Mo &&
                  d &&
                  (this.Ja.o(-(this.x1 - this.offsetX)),
                  this.Ls(),
                  x.play(x.Nh)),
                (this.Mo = this.Wo = !1)));
            a = this.jb(0.2);
            b = this.Ie;
            this.Yb.o(b + (this.x1 - b) * ua.Kf()(a));
            b = -(this.Yb.wa() - this.offsetX);
            this.cq
              ? (this.Ja.o(b),
                (b = b + this.Ie - this.offsetX),
                0 < this.ws
                  ? b > this.advance / 2
                    ? ((c = this.clipPath),
                      (b = this.advance - b),
                      (d = c.B - c.A),
                      (c.A = b),
                      (c.B = b + d))
                    : ((c = this.clipPath),
                      (b = -b),
                      (d = c.B - c.A),
                      (c.A = b),
                      (c.B = b + d))
                  : ((b = -b),
                    b > this.advance / 2
                      ? ((c = this.clipPath),
                        (b = -this.advance + b),
                        (d = c.B - c.A),
                        (c.A = b),
                        (c.B = b + d))
                      : ((c = this.clipPath),
                        (d = c.B - c.A),
                        (c.A = b),
                        (c.B = b + d))),
                this.Ja.bE(this.clipPath))
              : this.Ja.bE(null);
            1 == a && ((this.nu = !1), this.$(2), this.jt());
            break;
          case 2:
            a = this.Ar(this.ub - 1);
            D.sr(a) && D.bA(a)
              ? (this.Oz(),
                this.$(3),
                this.yn[this.ub - 1].Zn("lock").Cm(),
                x.play(x.RJ),
                (b = new hf()),
                (c = this.gh),
                b.j.o((c.A + c.B) / 2),
                (d = c = this.gh),
                b.j.m((c.D + c.G) / 2 + 0.15 * (d.G - d.D)),
                this.oa(b),
                this.node.P(b.j.u),
                D.aT(a))
              : this.$(0);
            break;
          case 3:
            (a = this.yn[this.ub - 1].Zn("lock")),
              (b = this.jb(1.5)),
              a.H(1 + 0.5 * b),
              a.W(1 - b),
              a.hp(new kc().Ow(0.5 * -b)),
              1 == b && this.$(0);
        }
      }
    }
    $(a) {
      this.state = a;
      this.time = 0;
    }
    Oz() {
      this.pu = this.oa(new cd(this.yn[this.ub - 1]));
      this.BC = this.oa(new cd(this.Ja));
    }
    bu() {
      null != this.pu &&
        (this.pu.ra(), this.BC.ra(), (this.BC = this.pu = null));
    }
    Ar(a) {
      a += 1;
      2 == D.Ua && (a += 5);
      3 == D.Ua && (a += 10);
      return a;
    }
    So() {
      return !1;
    }
    bc(a) {
      return null != a && a instanceof Ld ? 1.5 : super.bc(a);
    }
    fb() {
      super.fb();
      this.mm();
      this.ia(l.At);
      r.we = null;
      r.Mz = null;
      null != this.caller &&
        this.caller.Ta.boxComplete &&
        17 != D.box &&
        this.Ls();
    }
    qb() {
      super.qb();
      this.bu();
      this.advance = 500;
      let a = this.fa.Se();
      0.6 > a || (this.advance *= Math.min(1.5, Ua(a, 0.6, 2, 1, 1.2)));
      for (var b = 0, c = 0, d = this.Nz; c < d.length; ) {
        let e = d[c];
        ++c;
        e.o(100 + b);
        e.W(0.5);
        b += this.advance;
      }
      c = b = 0;
      for (d = this.yn; c < d.length; ) d[c++].o(b), (b += this.advance);
      this.Yb.o(-(this.ub - 1) * this.advance + this.offsetX);
      this.cq && (this.Ja.o(-(this.Yb.wa() - this.offsetX)), this.$(0));
      b = this.Oc[0];
      c = this.Oc[1];
      0.7 < a
        ? (b.o(50), b.m(325), c.o(600), c.m(325))
        : (b.o(250), b.m(650), c.o(400), c.m(650));
      this.Tn(Cc, this).layout();
    }
    Od() {
      this.hb(0) && this.Vb();
    }
    Vb() {
      this.ba(ic);
    }
    Ga() {
      return "SelectBoxScene";
    }
  }
  xb.i = !0;
  xb.s = ca;
  Object.assign(xb.prototype, { l: xb });
  class Fb extends xb {
    constructor() {
      super();
    }
    jc() {
      return super.jc().concat([l.Bt, l.tG]);
    }
    Md() {
      super.Md();
      r.Yb = this.createTexture(l.Bt);
    }
    So() {
      this.ba(wb);
      return !0;
    }
    bv() {
      let a = this.Wq(
          "BOX1_LABEL",
          "BOX2_LABEL",
          "BOX3_LABEL",
          "BOX4_LABEL",
          "BOX5_LABEL",
          "NEXT_SEASON"
        ),
        b = 0;
      for (; 5 > b; ) {
        let c = b++;
        a[c] = c + 1 + ". " + a[c];
      }
      return a;
    }
    av() {
      return [k.MI, k.NI, k.OI, k.QI, k.RI, k.Ry];
    }
    Ga() {
      return "Season1Scene";
    }
  }
  Fb.i = !0;
  Fb.s = xb;
  Object.assign(Fb.prototype, { l: Fb });
  class lc extends Fb {
    constructor() {
      super();
    }
    So() {
      this.ba(Ub);
      return !0;
    }
    Vb() {
      this.ba(jc);
    }
    Jq() {
      this.ba(Wb);
    }
    Ga() {
      return "FamobiSeason1Scene";
    }
  }
  lc.i = !0;
  lc.s = Fb;
  Object.assign(lc.prototype, { l: lc });
  class wb extends xb {
    constructor() {
      super();
    }
    jc() {
      return super.jc().concat([l.Ct, l.uG]);
    }
    ua() {
      null != this.caller &&
        this.caller instanceof Fb &&
        (D.Gs(2), this.Fp(D.box), D.tk(6));
      super.ua();
    }
    fb() {
      super.fb();
      this.ia(40);
    }
    Md() {
      super.Md();
      r.Yb = this.createTexture(l.Ct);
    }
    So() {
      this.ba(Gb);
      return !0;
    }
    bv() {
      let a = this.Wq(
          "BOX6_LABEL",
          "BOX7_LABEL",
          "BOX8_LABEL",
          "BOX9_LABEL",
          "BOX10_LABEL",
          "NEXT_SEASON"
        ),
        b = 0;
      for (; 5 > b; ) {
        let c = b++;
        a[c] = c + 1 + 5 + ". " + a[c];
      }
      return a;
    }
    av() {
      return [k.YI, k.ZI, k.$I, k.aJ, k.XI, k.Ry];
    }
    Ga() {
      return "Season2Scene";
    }
  }
  wb.i = !0;
  wb.s = xb;
  Object.assign(wb.prototype, { l: wb });
  class Ub extends wb {
    constructor() {
      super();
    }
    So() {
      this.ba(Vb);
      return !0;
    }
    Vb() {
      this.ba(jc);
    }
    Jq() {
      this.ba(Wb);
    }
    Ga() {
      return "FamobiSeason2Scene";
    }
  }
  Ub.i = !0;
  Ub.s = wb;
  Object.assign(Ub.prototype, { l: Ub });
  class Gb extends xb {
    constructor() {
      super();
    }
    jc() {
      return super.jc().concat([l.Dt, l.vG]);
    }
    ua() {
      null != this.caller &&
        this.caller instanceof wb &&
        (D.Gs(3), this.Fp(D.box), D.tk(11));
      super.ua();
    }
    fb() {
      super.fb();
      this.ia(38);
    }
    Md() {
      super.Md();
      r.Yb = this.createTexture(l.Dt);
    }
    bv() {
      let a = this.Wq(
          "BOX11_LABEL",
          "BOX12_LABEL",
          "BOX13_LABEL",
          "BOX14_LABEL",
          "BOX15_LABEL",
          "BOX16_LABEL",
          "BOX17_LABEL"
        ),
        b = 0;
      for (; 7 > b; ) {
        let c = b++;
        a[c] = c + 1 + 10 + ". " + a[c];
      }
      return a.slice(0, 7);
    }
    av() {
      return [k.bJ, k.cJ, k.dJ, k.eJ, k.fJ, k.gJ, k.hJ].slice(0, 7);
    }
    Ga() {
      return "Season3Scene";
    }
  }
  Gb.i = !0;
  Gb.s = xb;
  Object.assign(Gb.prototype, { l: Gb });
  class Vb extends Gb {
    constructor() {
      super();
    }
    Vb() {
      this.ba(jc);
    }
    Jq() {
      this.ba(Wb);
    }
    Ga() {
      return "FamobiSeason3Scene";
    }
  }
  Vb.i = !0;
  Vb.s = Gb;
  Object.assign(Vb.prototype, { l: Vb });
  class Pb extends ca {
    constructor() {
      super();
    }
    jc() {
      let a = [
          l.Zf,
          l.Xd,
          l.Mh,
          l.hf,
          l.Og,
          l.Mp,
          l.By,
          l.Mh,
          l.Ng,
          l.Ph,
          J.Ff,
        ],
        b = D.box - 1;
      a.push(
        [
          195, 190, 185, 180, 175, 170, 165, 159, 154, 149, 144, 139, 134, 129,
          124, 119, 114,
        ][b]
      );
      a.push(
        [
          196, 191, 186, 181, 176, 171, 166, 161, 155, 150, 145, 140, 135, 130,
          125, 120, 115,
        ][b]
      );
      a.push(
        [
          197, 192, 187, 182, 177, 172, 167, 162, 156, 151, 146, 141, 136, 131,
          126, 121, 116,
        ][b]
      );
      return a;
    }
    wD(a) {
      this.JC(a);
    }
    JC(a) {
      D.Xw(a);
      x.play(x.Nh);
      this.state = 1;
      this.time = 0;
    }
    ua() {
      super.ua();
      this.Aj.M(!0);
      null != Ya.instance && Ya.instance.ra();
      this.cb = this.add(Ya);
      this.fa.back.P(this.cb.node);
      this.state = 0;
      this.pj();
      this.Vk();
      var a = 20;
      D.pB() && (a = 0);
      this.po = new S();
      var b = r.Wa.hc.xf(k.Tp).ec;
      let c = b.x - a,
        d = b.y,
        e = 1;
      this.ti = new Md(5, 5);
      let f = this;
      this.ti.forEach(function (g, h, m) {
        e += 1;
        g = new Dc(e - 1);
        f.po.appendChild(g.j);
        g.j.o(h * c);
        g.j.m(m * d);
        return g;
      });
      this.po.o(-5);
      this.size = new Ka(5 * c, 5 * d);
      this.Ke(this.size.x, this.size.y);
      this.qa.appendChild(this.po);
      for (a = this.ti.iterator(); a.eb(); )
        (b = a.next()), D.CO(b.Bi) && b.TR(D.kv(b.Bi), D.pB(b.Bi));
      for (a = this.ti.iterator(); a.eb(); )
        if (((b = a.next()), 3 > D.kv(b.Bi))) {
          b.focus();
          this.hh = b;
          break;
        }
      null == this.hh && ((a = this.ti), (this.hh = a.N[0 * a.Tb]));
      this.hh.focus();
      this.vb = this.add(Cc);
      a = D.LA();
      this.vb.Pa(Da.Dd(0 == a ? 0 : a));
      this.mm();
    }
    fb() {
      super.fb();
      this.O.Ra.Rf(z.Zc ? 1 : 0);
    }
    ra() {
      super.ra();
      this.cb = null;
    }
    Md() {
      super.Md();
      r.uj = this.createTexture(
        [
          196, 191, 186, 181, 176, 171, 166, 161, 155, 150, 145, 140, 135, 130,
          125, 120, 115,
        ][D.box - 1]
      );
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 0:
          if (this.O.hd().gF(0))
            for (var b = this.ti.iterator(); b.eb(); )
              if (((a = b.next()), a.Ub(this.Cc.g))) {
                b = this.hh;
                null != b && b.blur();
                this.hh = a;
                this.hh.focus();
                break;
              }
          if (this.O.hd().Nb(0))
            for (a = this.ti.iterator(); a.eb(); )
              if (((b = a.next()), b.Ub(this.Cc.g))) {
                this.xv = b;
                break;
              }
          this.O.hd().qe(0) &&
            null != this.xv &&
            this.xv.Ub(this.Cc.g) &&
            this.wD(this.xv.Bi);
          if (null != this.hh) {
            a = new ah();
            b = this.ti;
            var c = this.hh.Bi - 1;
            a.y = (c / b.Tb) | 0;
            a.x = c % b.Tb;
            b = this.ti;
            c = this.hh.Bi - 1;
            a.y = (c / b.Tb) | 0;
            a.x = c % b.Tb;
          }
          break;
        case 1:
          a = this.jb(0.3);
          this.li().bf(1 - a);
          1 == a && (this.Nq(), this.cb.vM(), (this.state = 2));
          break;
        case 2:
          0 == this.cb.state && ((this.state = 3), this.cb.remove(), this.dk());
      }
    }
    ad(a, b) {
      b instanceof Xa
        ? 0 == a &&
          (this.fa.back.removeChild(this.cb.node), this.fa.Ba.P(this.cb.node))
        : (super.ad(a, b), 1 == a && b instanceof xb && this.cb.ra());
    }
    qb() {
      this.rd.y = this.size.y;
      this.po.m(0);
      let a = this.fa.Se();
      !this.O.Sj && 0.7 < a && ((this.rd.y += 400), this.po.m(200));
      super.qb();
      this.cb.layout();
      this.Tn(Cc, this).layout();
    }
    Od() {
      this.hb(0) && this.Vb();
    }
    Vb() {
      switch (D.Ua) {
        case 1:
          this.ba(Fb);
          break;
        case 2:
          this.ba(wb);
          break;
        case 3:
          this.ba(Gb);
      }
    }
    dk() {
      this.ba(Xa);
    }
    Ga() {
      return "SelectLevelScene";
    }
  }
  Pb.i = !0;
  Pb.s = ca;
  Object.assign(Pb.prototype, { l: Pb });
  class Wb extends Pb {
    constructor() {
      super();
    }
    wD(a) {
      let b = this;
      M.dt(Ca(), function () {
        M.cf("button:levelselection:level", function () {
          b.JC(a);
        });
      });
    }
    dk() {
      this.ba(ad);
    }
    Vb() {
      switch (D.Ua) {
        case 1:
          this.ba(lc);
          break;
        case 2:
          this.ba(Ub);
          break;
        case 3:
          this.ba(Vb);
      }
    }
    Ga() {
      return "FamobiSelectLevelScene";
    }
  }
  Wb.i = !0;
  Wb.s = Pb;
  Object.assign(Wb.prototype, { l: Wb });
  class Xa extends ca {
    constructor() {
      super();
    }
    jc() {
      function a(d) {
        return 0 < (vi[c] & d);
      }
      let b = [
        l.Zf,
        l.Xd,
        l.hf,
        l.Og,
        l.Mp,
        l.By,
        l.Ng,
        l.Ph,
        l.py,
        l.TF,
        l.qy,
        l.UF,
        l.ty,
        l.dG,
        l.uy,
        l.lG,
        l.vy,
        l.pG,
        J.xl,
      ];
      b.push([97, 95, 93, 91, 89][z.le]);
      b.push([98, 96, 94, 92, 90][z.le]);
      let c = D.box - 1;
      a(1) && (b.push(l.Um), b.push(l.ZF));
      a(2) && (b.push(l.an), b.push(l.jG));
      a(4) && (b.push(l.Ym), b.push(l.gG));
      a(8) && (b.push(l.$m), b.push(l.iG));
      a(64) && (b.push(l.Vm), b.push(l.$F));
      a(128) && (b.push(l.Zm), b.push(l.hG));
      a(512) && (b.push(l.Tm), b.push(l.YF));
      a(2048) && (b.push(l.hj), b.push(l.cG));
      a(4096) && (b.push(l.vt), b.push(l.XF));
      a(8192) && (b.push(l.ut), b.push(l.WF));
      a(16384) && (b.push(l.dn), b.push(l.oG));
      a(32768) && (b.push(l.wt), b.push(l.bG));
      a(65536) && (b.push(l.bn), b.push(l.mG));
      a(131072) && (b.push(l.Xm), b.push(l.eG));
      a(262144) && (b.push(l.Wm), b.push(l.aG));
      if (a(524288) || J.Fe)
        b.push(l.ij), b.push(l.fG), b.push(l.Sm), b.push(l.VF);
      a(1048576) && (b.push(l.cn), b.push(l.nG));
      J.Fe && (b.push(l.xt), b.push(l.kG));
      b.push(
        [
          194, 189, 184, 179, 174, 169, 164, 158, 153, 148, 143, 138, 133, 128,
          123, 118, 113,
        ][c]
      );
      b.push(
        [
          195, 190, 185, 180, 175, 170, 165, 159, 154, 149, 144, 139, 134, 129,
          124, 119, 114,
        ][c]
      );
      b.push(
        [
          196, 191, 186, 181, 176, 171, 166, 161, 155, 150, 145, 140, 135, 130,
          125, 120, 115,
        ][c]
      );
      b.push(
        [
          197, 192, 187, 182, 177, 172, 167, 162, 156, 151, 146, 141, 136, 131,
          126, 121, 116,
        ][c]
      );
      b.push(
        [
          198, 193, 188, 183, 178, 173, 168, 163, 157, 152, 147, 142, 137, 132,
          127, 122, 117,
        ][c]
      );
      8 == D.box && b.push(l.Zx);
      return b;
    }
    Lj() {
      return Xa.Ej ? 1 : 0;
    }
    ua() {
      super.ua();
      this.Br = 0;
      this.Lm = this.O.jd && 1920 == this.O.window.Fc.x;
      this.Aj.M(!1);
      this.fp = new gc(null, new F(1, 1, 1, 1));
      this.S = new ra(this);
      var a = za.create(null, k.sK, k.tK);
      this.buttons.push(a);
      this.node.P(a.j.u);
      a = za.create(null, k.uK, k.vK);
      this.buttons.push(a);
      this.node.P(a.j.u);
      J.Xi &&
        ((a = za.create(null, k.rK, k.qK, k.Zy)),
        a.icon.M(!z.Zc),
        this.buttons.push(a),
        this.node.P(a.j.u),
        (a = za.create(null, k.xK, k.wK, k.Zy)),
        a.icon.M(!z.me),
        this.buttons.push(a),
        this.node.P(a.j.u));
      J.We && this.kO();
      J.Fe && this.nO();
      this.dh(!1);
      this.vb = new S();
      this.node.P(this.vb.u);
      for (a = 0; 3 > a; ) ++a, new y(this.vb, r.Wa, ai).C();
      a = this.vb.nb(0).ka();
      var b = this.vb.nb(0);
      b.o(b.wa() - a);
      b = this.vb.nb(2);
      b.o(b.wa() + a);
      a = this.O.jd ? (this.Lm ? 40 : 80) : 60;
      this.de = new S();
      b = new na(this.de, r.ic);
      b.rb(200, a);
      b.Pa(this.yb("LEVEL"));
      b.Uf();
      b = new na(this.de, r.ic);
      b.m(0.9 * a);
      b.rb(200, a);
      this.ZE();
      this.node.P(this.de.u);
      this.Oo = this.state = this.si = this.mo = 0;
      this.Ur = this.fg = !1;
    }
    Mc() {
      super.Mc();
      null != this.cb && this.cb.remove();
      let a = 0,
        b = [
          27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11,
          10, 9, 8, 7,
        ];
      for (; a < b.length; ) this.ia(b[a++]);
    }
    Md() {
      super.Md();
      let a = D.box - 1;
      null == r.I &&
        ((r.I = this.createTexture([97, 95, 93, 91, 89][z.le])),
        (r.zu = this.createTexture(l.py)),
        (r.aM = this.createTexture(l.qy)),
        (r.WS = this.createTexture(l.vy)),
        (r.Na = this.createTexture(l.uy)),
        (r.nh = this.createTexture(l.ty)));
      null == r.ca && l.ob(l.Um) && (r.ca = this.createTexture(l.Um));
      null == r.Cd && l.ob(l.an) && (r.Cd = this.createTexture(l.an));
      null == r.pm && l.ob(l.Ym) && (r.pm = this.createTexture(l.Ym));
      null == r.mc && l.ob(l.$m) && (r.mc = this.createTexture(l.$m));
      null == r.be && l.ob(l.Vm) && (r.be = this.createTexture(l.Vm));
      null == r.Ak && l.ob(l.Zm) && (r.Ak = this.createTexture(l.Zm));
      null == r.fd && l.ob(l.Tm) && (r.fd = this.createTexture(l.Tm));
      null == r.Kb &&
        l.ob(l.hj) &&
        ((r.Kb = this.createTexture(l.hj)),
        8 == D.box && (r.Qn = this.createTexture(l.Zx)));
      null == r.bl && l.ob(l.vt) && (r.bl = this.createTexture(l.vt));
      null == r.Kd && l.ob(l.ut) && (r.Kd = this.createTexture(l.ut));
      null == r.Rc && l.ob(l.dn) && (r.Rc = this.createTexture(l.dn));
      null == r.ce && l.ob(l.wt) && (r.ce = this.createTexture(l.wt));
      null == r.Hk && l.ob(l.bn) && (r.Hk = this.createTexture(l.bn));
      null == r.zi && l.ob(l.Xm) && (r.zi = this.createTexture(l.Xm));
      null == r.vf && l.ob(l.Wm) && (r.vf = this.createTexture(l.Wm));
      null == r.Df && l.ob(l.ij) && (r.Df = this.createTexture(l.ij));
      null == r.Pc && l.ob(l.cn) && (r.Pc = this.createTexture(l.cn));
      null == r.Jd && l.ob(l.xt) && (r.Jd = this.createTexture(l.xt));
      null == r.hl && l.ob(l.Sm) && (r.hl = this.createTexture(l.Sm));
      null == r.pq &&
        ((r.pq = this.createTexture(
          [
            194, 189, 184, 179, 174, 169, 164, 158, 153, 148, 143, 138, 133,
            128, 123, 118, 113,
          ][a]
        )),
        (r.uj = this.createTexture(
          [
            196, 191, 186, 181, 176, 171, 166, 161, 155, 150, 145, 140, 135,
            130, 125, 120, 115,
          ][a]
        )),
        (r.ou = this.createTexture(
          [
            198, 193, 188, 183, 178, 173, 168, 163, 157, 152, 147, 142, 137,
            132, 127, 122, 117,
          ][a]
        )));
    }
    fb() {
      super.fb();
      Xa.Ej = !1;
      let a = this;
      switch (this.state) {
        case 0:
          this.xQ();
          this.S.show();
          this.cb = Ya.instance;
          if (null == this.cb) {
            this.dh(!0);
            this.$(1);
            break;
          }
          this.oa(this.cb);
          this.cb.XE(function () {
            a.cb.ra();
            a.dh(!0);
          });
          this.Dw();
          this.$(1);
          break;
        case 4:
          this.Bs(!0);
          this.$(1);
          this.buttons[1].Ad(!1);
          break;
        case 7:
          this.S.ra(),
            (this.S = new ra(this)),
            this.S.show(),
            this.S.update(0.016666666666666666),
            this.cb.XE(function () {
              a.cb.ra();
              a.dh(!0);
            }),
            this.$(1),
            this.dh(!1),
            this.Dw(),
            this.ZE(),
            this.gE();
      }
    }
    mw(a) {
      this.vb
        .nb(a - 1)
        .pa()
        .play(zi);
      this.Oo++;
    }
    jw() {
      this.fg = !0;
      new y(this.vb, r.Wa, ai).C();
      let a = this.vb.nb(0).ka(),
        b = -1.5 * a,
        c = 0;
      for (; 4 > c; ) this.vb.nb(c++).o(b), (b += a);
      this.vb.nb(3).pa().play(zi);
    }
    lw() {
      this.dh(!1);
      this.Ew();
      this.Ur = !1;
    }
    YP() {
      D.KR(Math.max(D.kv(), this.Oo), this.fg);
      x.Sn(x.Oh);
      this.$(5);
      this.Vn();
    }
    WP() {
      this.dh(!1);
      this.Ew();
      this.Ur = !1;
    }
    XP() {
      if (1 == this.state) {
        if (-1 != Xa.Sv && (this.Br++, this.Br == Xa.Sv)) {
          this.Br = 0;
          let a = 1,
            b = this.buttons.length;
          for (; a < b; ) this.buttons[a++].Ad(!0);
          this.$(6);
          this.Vn();
        }
        this.vD();
      }
    }
    Vn() {
      this.cb = this.add(Ya);
      this.cb.RD();
      this.node.P(this.cb.node);
      this.cb.DA();
    }
    kO() {
      this.td = new Qb();
      this.buttons.push(this.td);
      this.node.P(this.td.j.u);
    }
    nO() {
      this.ne = new Rb();
      this.buttons.push(this.ne);
      this.node.P(this.ne.j.u);
    }
    Ew() {
      J.We && this.td.reset();
      J.Fe && this.ne.reset();
    }
    dh(a) {
      let b = 1,
        c = this.buttons.length;
      for (; b < c; ) this.buttons[b++].Ad(a ? !1 : !0);
    }
    vD() {
      this.Nf();
    }
    Nf() {
      1 != this.state ||
        this.S.vm ||
        ((this.S.vm = !0),
        this.Dw(),
        this.node.P(this.fp.u),
        this.fp.W(0),
        this.dh(!1),
        this.Ew(),
        this.$(2));
    }
    lx() {
      this.Bg(Ec);
    }
    $(a) {
      this.state = a;
      this.time = 0;
      1 == a && ((this.Ur = !0), (this.ps = 0));
    }
    Dw() {
      this.fg = !1;
      this.Oo = 0;
      4 == this.vb.Jj() && this.vb.nb(3).F();
      var a = this.vb.nb(0).ka();
      this.vb.nb(0).o(-a);
      this.vb.nb(1).o(0);
      this.vb.nb(2).o(a);
      for (a = 0; 3 > a; ) this.vb.nb(a++).Fb(ai);
    }
    gE() {
      this.si = this.mo = 0;
      this.de.M(!0);
    }
    ZE() {
      let a = this.de.nb(1);
      a.lc(100);
      a.Pa("" + D.box + " - " + D.level);
      a.Uf();
    }
    Bs(a) {
      this.vb.M(a);
      this.buttons[1].M(a);
      this.buttons[2].M(a);
      a && !J.np && this.buttons[1].M(a);
      J.Xi && (this.buttons[3].M(a), this.buttons[4].M(a));
      J.We && this.td.M(a);
      J.Fe && this.ne.M(a);
    }
    update(a) {
      super.update(a);
      this.si += a;
      switch (this.mo) {
        case 0:
          var b = Math.min(this.si / 0.5, 1);
          1 == b && ((this.mo = 1), (this.si = 0));
          this.de.W(ua.Kf()(b));
          break;
        case 1:
          1 < this.si && ((this.mo = 2), (this.si = 0));
          break;
        case 2:
          (b = Math.min(this.si / 0.5, 1)),
            1 == b && ((this.mo = 3), this.de.M(!1)),
            this.de.W(ua.Kf()(1 - b));
      }
      switch (this.state) {
        case 1:
          this.nB();
          this.S.update(a);
          this.NQ(a);
          break;
        case 2:
          a = this.jb(0.15);
          this.fp.W(a);
          1 == a &&
            (this.S.ra(), (this.S = new ra(this)), this.S.show(), this.$(3));
          break;
        case 3:
          this.S.update(a);
          a = this.jb(0.2);
          this.fp.W(1 - a);
          1 == a &&
            (this.node.removeChild(this.fp.u),
            this.$(1),
            this.dh(!0),
            this.gE());
          break;
        case 4:
          this.S.update(0);
          break;
        case 5:
          this.S.update(a);
          7 == this.cb.state &&
            ((this.cb.state = 0), (this.state = 7), this.fE());
          break;
        case 6:
          this.S.update(a);
          7 == this.cb.state &&
            ((this.state = 7), (this.Ta.count = this.Br), this.hE());
          break;
        case 8:
          this.S.update(a);
      }
    }
    aq(a) {
      super.aq(a);
      this.resize();
    }
    Od() {
      if (8 != this.state) {
        var a = this.O.jh().Nb(112);
        if (this.O.jh().Nb(173) || this.O.jh().Nb(461)) a = !0;
        if (J.np && (this.hb(1) || a)) {
          if (1 != this.state) {
            this.buttons[1].Ad(!1);
            return;
          }
          x.Vi(x.Oh, 0);
          this.S.Hl();
          this.nB();
          this.Bs(!1);
          this.$(4);
          this.sD();
        }
        this.hb(2) && this.uD();
        J.Xi &&
          (this.hb(3) && this.xp(this.buttons[3]),
          this.hb(4) && this.yp(this.buttons[4]));
        this.S.Ml ||
          this.S.Ve ||
          (J.We &&
            this.hb(J.Xi ? 5 : 3) &&
            (0 == Qb.Lf
              ? this.rD()
              : (this.td.use(),
                J.Fe && (this.ne.jm = !0),
                this.S.yL(),
                z.Ao ||
                  ((z.Ao = !0),
                  z.flush(),
                  (a = new Nd(Db.get("MAGNET_TIP"))),
                  this.node.P(a.j.u),
                  this.oa(a)))),
          J.Fe &&
            this.hb(J.Xi ? 6 : 4) &&
            (0 == Rb.Lf
              ? this.xD()
              : (this.ne.use(),
                J.We && (this.td.jm = !0),
                this.S.zL(),
                z.up ||
                  ((z.up = !0),
                  z.flush(),
                  (a = new Nd(Db.get("ANTIMAGNET_TIP"))),
                  this.node.P(a.j.u),
                  this.oa(a)))));
      }
    }
    ad(a, b) {
      b instanceof xb &&
        (this.Aj.M(!0), 1 == a && b instanceof xb && Ya.instance.ra());
      super.ad(a, b);
    }
    bc(a) {
      return a instanceof Ec ? 0 : super.bc(a);
    }
    bd(a) {
      switch (this.state) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
          let b = this.S;
          null != b && b.bd(a);
      }
      super.bd(a);
    }
    NQ(a) {
      !this.Ur ||
        (!J.We && !J.Fe) ||
        this.S.Ml ||
        this.S.Ve ||
        ((this.ps += a),
        1 <= this.ps &&
          ((this.ps = 0),
          (a = this.kr()),
          J.We && this.td.FD(a),
          J.Fe && this.ne.FD(a)));
    }
    kr() {
      return !0;
    }
    resize() {
      var a = this.O.window.eo(),
        b = window.devicePixelRatio,
        c = 1 > b ? 1 : 2 < b ? 2 : b,
        d = this.O.window.Vo,
        e = this.fa.Se();
      b = 1 < e;
      c = 1 >= c ? 0.05 : 1.25 >= c ? 0.06 : 0.07;
      this.O.Sj &&
        (c = (c =
          800 >= Math.min(a.w, a.J) && 1280 >= Math.max(a.w, a.J) && 2 >= d)
          ? 0.08
          : 0.04);
      this.O.jd && (c = 0.04);
      c = Math.max(a.w, a.J) * c * d;
      this.O.Sj || (70 > c && (c = 70));
      b && (c *= 0.9);
      let f = 30;
      var g = 0;
      this.O.jd && ((g = 25 * d), (f = 60));
      this.vb.H(c / 150);
      var h = 0;
      this.O.jd && (h = 20);
      this.vb.o(a.w / 2);
      var m = this.O.jd ? (this.Lm ? 0.75 : 1.4) : 1,
        n = this.buttons[1];
      J.np ? (n.j.H((c / n.ec.y) * m), n.lp(a.w - h - g), n.m(0)) : n.M(!1);
      d = this.buttons[2];
      d.j.H((c / d.ec.y) * m);
      J.np ? d.lp(n.wa() - h) : d.lp(a.w - h);
      d.m(0);
      n = null;
      if (J.Xi) {
        var q = this.buttons[3];
        q.j.H((c / q.ec.y) * m);
        q.lp(d.wa() - h);
        q.m(0);
        n = this.buttons[4];
        n.j.H((c / n.ec.y) * m);
        n.lp(q.wa() - h);
        n.m(0);
      }
      J.We && ((q = (c / this.td.ec.y) * m), this.td.o(g), this.td.j.H(q));
      J.Fe &&
        (this.ne.j.H((c / this.td.ec.y) * m),
        J.We ? this.ne.o(this.td.wa() + this.td.ka() + h) : this.ne.o(g));
      h = 1;
      for (m = this.buttons.length; h < m; ) this.buttons[h++].j.m(g);
      this.vb.m(d.Sa() + d.ja() / 2);
      0.8 > e &&
        ((e =
          J.We && J.Fe
            ? this.ne.qv()
            : J.We
            ? this.td.qv()
            : J.Fe
            ? this.ne.qv()
            : 0),
        (g = J.Xi ? n.wa() : d.wa()),
        this.vb.o(e + (g - e) / 2),
        g - e < this.vb.ka() &&
          ((e = this.vb), e.m(e.Sa() + 1.25 * this.vb.ja())));
      this.de.H(c / 100);
      this.de.o(f);
      this.de.m(a.J - 1.1 * this.de.ja() - f);
      this.O.Sj &&
        b &&
        ((a = this.de), a.o(a.wa() + 20), (a = this.de), a.m(a.Sa() - 20));
    }
    rD() {
      this.$(8);
      cc.delay(P(this, this.EC), 1e3);
    }
    EC() {
      this.td.fill(J.sP);
      x.play(x.Uy);
      this.S.Hl();
      this.$(1);
    }
    aQ() {
      this.S.Hl();
      this.td.reject();
      this.$(1);
    }
    xD() {
      this.$(8);
      cc.delay(P(this, this.LC), 1e3);
    }
    LC() {
      this.ne.fill(J.HS);
      x.play(x.Uy);
      this.S.Hl();
      this.$(1);
    }
    iQ() {
      this.S.Hl();
      this.ne.reject();
      this.$(1);
    }
    sD() {
      this.lx();
    }
    xp(a) {
      z.Zc = !z.Zc;
      z.flush();
      a.icon.M(!z.Zc);
      a.Ad(!1);
      a.je = 0;
      this.O.Ra.Rf(z.Zc ? 1 : 0);
    }
    yp(a) {
      z.me = !z.me;
      z.flush();
      a.icon.M(!z.me);
      a.Ad(!1);
      a.je = 0;
    }
    uD() {
      this.Nf();
    }
    nB() {
      let a = this.O.hd(),
        b = this.O.Nj(),
        c = 0,
        d = fj;
      for (; c < d.length; ) {
        let f = d[c];
        ++c;
        var e = a.position[f];
        e = new Ka(e.x, e.y);
        let g = b.TN(f);
        a.Nb(f) && this.S.NS(e, g);
        a.gF(f) && this.S.OS(e, g);
        a.qe(f) && this.S.PS(e, g);
      }
    }
    fE() {
      this.Ta.stars = this.Oo;
      this.Ta.blueStar = this.fg;
      this.Bg(dd);
    }
    hE() {
      this.Bg(ed);
    }
    Ga() {
      return "LevelScene";
    }
  }
  Xa.i = !0;
  Xa.s = ca;
  Object.assign(Xa.prototype, { l: Xa });
  class ad extends Xa {
    constructor() {
      super();
      Xa.Sv = 1;
      this.Ix = !1;
    }
    kr() {
      return M.kr();
    }
    rD() {
      this.$(8);
      M.nC("game:powerup:magnet:rewarded");
      let a = this;
      M.kE(function (b) {
        b ? a.EC() : a.aQ();
      });
    }
    xD() {
      this.$(8);
      M.nC("game:powerup:telekinesis:rewarded");
      let a = this;
      M.kE(function (b) {
        b ? a.LC() : a.iQ();
      });
    }
    lw() {
      if (25 == D.level && null == z.Cf[D.box - 1][D.level]) {
        let a = Db.get(
          "BOX1_LABEL BOX2_LABEL BOX3_LABEL BOX4_LABEL BOX5_LABEL BOX6_LABEL BOX7_LABEL BOX8_LABEL BOX9_LABEL BOX10_LABEL BOX11_LABEL BOX12_LABEL BOX13_LABEL BOX14_LABEL BOX15_LABEL BOX16_LABEL BOX17_LABEL".split(
            " "
          )[D.box - 1]
        );
        M.Ge("EVENT_CUSTOM", {
          eventName: "BOX_CLEARED",
          boxId: D.box,
          boxName: a,
        });
      }
      this.Ix = !0;
      super.lw();
    }
    yp(a) {
      super.yp(a);
      M.RE(z.Zc ? 1 : 0, z.me ? 1 : 0);
    }
    xp(a) {
      super.xp(a);
      M.RE(z.Zc ? 1 : 0, z.me ? 1 : 0);
    }
    sD() {
      let a = this;
      M.SS(function () {
        M.cf("button:level:pause", P(a, a.lx));
      });
    }
    lx() {
      this.Bg(jf);
    }
    uD() {
      let a = this;
      M.Hx(Ca(), function () {
        a.Bs(!1);
        M.cf("button:level:restart", function () {
          a.Bs(!0);
          a.Nf();
        });
      });
    }
    vD() {
      let a = this;
      M.PE(
        D.Kj(),
        "fail",
        function () {
          M.QE("dead", Ca(), function () {
            M.cf("break:fail", P(a, a.Nf));
          });
        },
        function () {
          a.Nf();
        }
      );
    }
    mw(a) {
      super.mw(a);
      M.RS(a);
    }
    fE() {
      this.Ta.stars = this.Oo;
      this.Ta.blueStar = this.fg;
      this.Bg(kf);
    }
    Vn() {
      let a = this;
      5 == this.state && this.Ix
        ? M.PE(
            D.Kj(),
            "success",
            function () {
              a.Ix = !1;
              a.Vn();
            },
            function () {}
          )
        : super.Vn();
    }
    hE() {
      this.Bg(lf);
    }
    Ga() {
      return "FamobiLevelScene";
    }
  }
  ad.i = !0;
  ad.s = Xa;
  Object.assign(ad.prototype, { l: ad });
  class dd extends ca {
    constructor() {
      super();
    }
    jc() {
      return [l.Zf, l.Xd, l.Lh, l.hf, l.Og, l.Ng];
    }
    wi() {
      return !1;
    }
    ua() {
      super.ua();
      this.Ke(600, 900);
      var a = this.caller.Ta.stars;
      this.Gc = this.caller.Ta.blueStar;
      var b = this.Wq(
          "LEVEL_CLEARED1",
          "LEVEL_CLEARED2",
          "LEVEL_CLEARED3",
          "LEVEL_CLEARED4"
        )[a],
        c = new na(this.qa, r.ic);
      c.rb(600, 60);
      c.Pa(b);
      c.Eb(0);
      c.Uf();
      c.m(140);
      b = [];
      for (c = 0; 4 > c; ) ++c, b.push(new y(this.qa, r.Wa, k.gL));
      this.Za = b;
      b = 0;
      for (c = this.Za; b < c.length; ) c[b++].C();
      this.Gc
        ? ((this.AE = [0.9, 1, 1, 0.9]),
          this.Za[0].o(142),
          this.Za[0].m(337),
          this.Za[1].o(244),
          this.Za[1].m(316),
          this.Za[2].o(360),
          this.Za[2].m(316),
          this.Za[3].o(461),
          this.Za[3].m(337))
        : ((this.AE = [0.9, 1, 0.9]),
          this.Za[0].o(180),
          this.Za[0].m(291),
          this.Za[1].o(300),
          this.Za[1].m(273),
          this.Za[2].o(420),
          this.Za[2].m(291));
      for (b = 0; 4 > b; ) (c = b++), this.Za[c].W(0), this.Za[c].H(0);
      for (b = 0; b < a; ) this.Za[b++].Fb(k.fL);
      this.Gc && this.Za[3].Fb(k.hK);
      a = new y(this.qa, r.Wa, k.OK);
      a.o(190);
      a.m(400);
      this.Vu = D.dO();
      a = new Hd();
      a.o(59);
      a.m(640);
      this.qa.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a = za.create(null, k.Pk, k.Qk, k.fz);
      a.o(219);
      a.m(640);
      this.qa.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a = za.create(null, k.Pk, k.Qk, k.iz);
      a.o(379);
      a.m(640);
      this.qa.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a = za.create(null, k.Lt, k.Mt, k.WK);
      a.o(188.5);
      a.m(750);
      this.qa.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a.focus();
      17 == D.box && 25 == D.level && a.M(!1);
      this.Vu ? this.$(0) : this.$(1);
    }
    fb() {
      super.fb();
      if (
        this.caller instanceof Xa &&
        (x.play(x.$J), D.IL() && 17 == D.box && 25 == D.level)
      ) {
        this.Bg(Od);
        return;
      }
      this.caller instanceof Od
        ? ((z.yl = !0), z.flush(), this.$(7))
        : this.caller instanceof fd
        ? this.$(1)
        : this.Vu &&
          ((this.Vu = !1),
          (this.Ta.pictureIndex = null),
          (this.Ta.available = !0),
          (this.Ta.ui = !0),
          this.Bg(fd));
    }
    qb() {
      super.qb();
      let a = Ya.instance;
      null != a && a.layout();
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 1:
          0.25 < this.time && (this.Ms(1), this.$(2));
          break;
        case 2:
          0.25 < this.time && (this.$(3), this.Ms(2));
          break;
        case 3:
          0.25 < this.time && (this.$(4), this.Ms(3));
          break;
        case 4:
          0.25 < this.time && (this.Gc ? (this.$(5), this.Ms(4)) : this.$(6));
          break;
        case 5:
          0.25 < this.time && this.$(6);
          break;
        case 6:
          if (1 > this.time) break;
          this.oa(new cd(this.buttons[4].j, 2));
          this.$(7);
          break;
        case 8:
          a = this.jb(0.3);
          this.li().bf(1 - a);
          1 == a && (this.Nq(), Ya.instance.hu(), this.$(9));
          break;
        case 9:
          0 == Ya.instance.state && (this.$(10), this.Vb());
      }
    }
    Td(a) {
      this.li().bf(a);
    }
    ad(a) {
      this.li().bf(1 - a);
    }
    Od() {
      0 == this.state ||
        7 < this.state ||
        (this.hb(1) && this.mp(),
        this.hb(2) && this.ap(),
        this.hb(3) && this.bp(),
        this.hb(4) &&
          (D.cl()
            ? D.cl()
              ? ((this.Ta.boxComplete = !0), this.pC())
              : (this.time = 0)
            : (D.eS(), this.rC())));
    }
    mp() {
      this.ba(Ac);
    }
    Ms(a) {
      --a;
      this.Za[a].Sb().alpha(1, 0.3);
      this.Za[a].Sb().scale(this.AE[a], 0.3, ua.iu(0.1));
    }
    pC() {
      1 == D.Ua
        ? this.ba(Fb)
        : 2 == D.Ua
        ? this.ba(wb)
        : 3 == D.Ua && this.ba(Gb);
    }
    rC() {
      this.Jf();
    }
    bp() {
      this.Nf();
    }
    ap() {
      this.Xo();
    }
    Xo() {
      this.$(8);
    }
    Nf() {
      this.Ta.restart = !0;
      this.Jf();
    }
    $(a) {
      this.state = a;
      this.time = 0;
    }
    Vb() {
      D.cl()
        ? ((this.Ta.boxComplete = !0),
          1 == D.Ua
            ? this.ba(Fb)
            : 2 == D.Ua
            ? this.ba(wb)
            : 3 == D.Ua && this.ba(Gb))
        : this.ba(Pb);
    }
    Ga() {
      return "LevelClearedOverlay";
    }
  }
  dd.i = !0;
  dd.s = ca;
  Object.assign(dd.prototype, { l: dd });
  class kf extends dd {
    constructor() {
      super();
    }
    ua() {
      super.ua();
      this.El();
    }
    $(a) {
      super.$(a);
      let b = this;
      if (6 == a) {
        let c = this.caller.Ta.stars;
        cc.delay(function () {
          M.QS(c, D.Kj(), Ca(), function () {
            M.cf("break:result", P(b, b.nS));
          });
        }, 1e3);
      }
    }
    bp() {
      this.El();
      let a = this;
      M.Hx(Ca(), function () {
        M.cf("button:results:restart", P(a, a.Nf));
      });
    }
    pC() {
      1 == D.Ua
        ? this.ba(lc)
        : 2 == D.Ua
        ? this.ba(Ub)
        : 3 == D.Ua && this.ba(Vb);
    }
    rC() {
      this.El();
      let a = this;
      M.cf("button:results:next", function () {
        M.dt(Ca(), function () {
          a.Jf(null);
        });
      });
    }
    ap() {
      this.El();
      M.cf("button:results:quit", P(this, this.Xo));
    }
    Vb() {
      D.cl()
        ? ((this.Ta.boxComplete = !0),
          1 == D.Ua
            ? this.ba(lc)
            : 2 == D.Ua
            ? this.ba(Ub)
            : 3 == D.Ua && this.ba(Vb))
        : this.ba(Wb);
    }
    mp() {
      this.ba(Kd);
    }
    Ga() {
      return "FamobiLevelClearedOverlay";
    }
  }
  kf.i = !0;
  kf.s = dd;
  Object.assign(kf.prototype, { l: kf });
  class ed extends ca {
    constructor() {
      super();
    }
    jc() {
      return [l.Zf, l.Xd, l.Lh, l.hf, l.Og, l.Ng];
    }
    wi() {
      return !1;
    }
    ua() {
      super.ua();
      this.Ke(600, 900);
      var a = this.yb("LEVEL_FAILED"),
        b = new na(this.qa, r.ic);
      b.rb(600, 160);
      b.Sf(!0);
      b.lc(60);
      b.Pa(a);
      b.Eb(0);
      b.m(140);
      a = this.caller.Ta.count;
      b = 0;
      3 < a && (b = 1);
      5 < a && (b = 2);
      a = new y(this.qa, r.Wa, [k.PK, k.QK, k.RK][b]);
      a.o(190);
      a.m(320);
      a = za.create(null, k.Pk, k.Qk, k.fz);
      a.o(139);
      a.m(560);
      this.qa.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a = za.create(null, k.Pk, k.Qk, k.iz);
      a.o(299);
      a.m(560);
      this.qa.appendChild(a.j);
      this.buttons.push(a);
      this.oa(a);
      a.focus();
      this.state = 0;
    }
    qb() {
      super.qb();
      let a = Ya.instance;
      null != a && a.layout();
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 1:
          a = this.jb(0.3);
          this.li().bf(1 - a);
          1 == a && (this.Nq(), Ya.instance.hu(), this.$(2));
          break;
        case 2:
          0 == Ya.instance.state && (this.$(3), this.Vb());
      }
    }
    Td(a) {
      this.li().bf(a);
    }
    ad(a) {
      this.li().bf(1 - a);
    }
    Od() {
      0 < this.state || (this.hb(1) && this.ap(), this.hb(2) && this.bp());
    }
    bp() {
      this.Nf();
    }
    ap() {
      this.Xo();
    }
    Xo() {
      this.$(1);
      this.time = 0;
    }
    Nf() {
      this.Ta.restart = !0;
      this.Jf();
    }
    $(a) {
      this.state = a;
    }
    Vb() {
      D.cl()
        ? ((this.Ta.boxComplete = !0),
          1 == D.Ua
            ? this.ba(Fb)
            : 2 == D.Ua
            ? this.ba(wb)
            : 3 == D.Ua && this.ba(Gb))
        : this.ba(Pb);
    }
    Ga() {
      return "LevelLostOverlay";
    }
  }
  ed.i = !0;
  ed.s = ca;
  Object.assign(ed.prototype, { l: ed });
  class lf extends ed {
    constructor() {
      super();
    }
    bp() {
      this.El();
      let a = this;
      M.Hx(Ca(), function () {
        M.cf("button:results:restart", P(a, a.Nf));
      });
    }
    ap() {
      this.El();
      M.cf("button:failed:quit", P(this, this.Xo));
    }
    Vb() {
      D.cl()
        ? ((this.Ta.boxComplete = !0),
          1 == D.Ua
            ? this.ba(lc)
            : 2 == D.Ua
            ? this.ba(Ub)
            : 3 == D.Ua && this.ba(Vb))
        : this.ba(Wb);
    }
    Ga() {
      return "FamobiLevelLostOverlay";
    }
  }
  lf.i = !0;
  lf.s = ed;
  Object.assign(lf.prototype, { l: lf });
  class Ec extends ca {
    constructor() {
      super();
    }
    ua() {
      super.ua();
      this.Nc = new gc(null, new F(0, 0, 0, 1));
      this.Nc.W(0.5);
      this.node.P(this.Nc.u);
      this.Ke(550, 550);
      var a = za.create(null, k.bz, k.cz, k.NK);
      this.buttons.push(a);
      a.o(133.5);
      a.m(200);
      this.qa.appendChild(a.j);
      this.oa(a);
      a = za.create(null, k.bz, k.cz, k.XK);
      this.buttons.push(a);
      a.o(293.5);
      a.m(200);
      this.qa.appendChild(a.j);
      this.oa(a);
      a.focus();
      this.state = 0;
      this.O.Ra.Rf(0);
      x.stop(x.Ok);
      x.stop(x.Oh);
    }
    ad() {}
    bc(a) {
      return a instanceof Pb ? super.bc(a) : 0;
    }
    Od() {
      if (0 == this.state) {
        this.hb(1) && this.tD();
        var a = !1;
        this.O.jh().Nb(415) && (a = !0);
        this.O.jh().Nb(461) ? this.Cw() : (this.hb(2) || a) && this.Cw();
      }
    }
    tD() {
      this.eD();
    }
    Cw() {
      this.yD();
    }
    yD() {
      this.O.Ra.Rf(z.Zc ? 1 : 0);
      x.Vi(x.Oh, 1);
      this.Jf();
    }
    eD() {
      x.stop(x.Oh);
      this.cb = this.add(Ya);
      this.node.P(this.cb.node);
      this.cb.RD();
      this.cb.DA();
      this.state = 1;
    }
    mE() {
      this.ba(Pb);
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 1:
          7 == this.cb.state &&
            ((this.cb.state = 0), this.cb.hu(), (this.state = 2));
          break;
        case 2:
          0 == this.cb.state && ((this.state = 3), this.mE());
      }
    }
    wi() {
      return !1;
    }
    Ga() {
      return "PauseOverlay";
    }
  }
  Ec.i = !0;
  Ec.s = ca;
  Object.assign(Ec.prototype, { l: Ec });
  class jf extends Ec {
    constructor() {
      super();
    }
    Cw() {
      M.TS(P(this, this.yD));
    }
    tD() {
      let a = this;
      M.QE("quit", Ca(), function () {
        M.cf("button:pause:quit", P(a, a.eD));
      });
    }
    mE() {
      this.ba(Wb);
    }
    Ga() {
      return "FamobiPauseOverlay";
    }
  }
  jf.i = !0;
  jf.s = Ec;
  Object.assign(jf.prototype, { l: jf });
  class Ac extends ca {
    constructor() {
      super();
    }
    jc() {
      return [l.Ht, l.KI, J.Hd ? l.Oy : l.Ft];
    }
    Tg() {
      this.Da = new y(null, this.createTexture(J.Hd ? l.Oy : l.Ft));
      this.node.P(this.Da.u);
    }
    Md() {
      super.Md();
      this.HE = this.createTexture(l.Ht);
    }
    ua() {
      super.ua();
      z.hk = 0;
      z.flush();
      this.Tg();
      this.Ke(600, 900);
      this.GL();
      this.pj();
      var a = new na(this.qa, r.ic);
      a.rb(600, 60);
      a.Pa(this.yb("OMNOM_DRAWINGS"));
      a.Eb(0);
      a.Uf();
      a.m(20);
      a = new na(this.qa, r.ii);
      a.rb(600, 40);
      a.Pa(this.yb("DRAWINGS_TOTAL", Da.Dd(D.HN())));
      a.Eb(0);
      a.Uf();
      a.m(80);
      this.Vk();
      this.mf = new y(null, this.HE, "artist");
      this.scroll = new mf(this.$i, 0, 600, 0);
      this.scroll.offsetX = this.IE / 2;
      this.time = this.state = 0;
    }
    fb() {
      super.fb();
      null == this.mf.u.parent && this.fa.Ba.P(this.mf.u);
    }
    qb() {
      super.qb();
      let a = this.cd;
      a.H(1.1 * a.Qa);
    }
    Mc() {
      super.Mc();
      this.ia(l.Ht);
      this.ia(l.Ft);
    }
    GL() {
      this.$i = new S("thumbs", this.qa);
      this.$i.m(0);
      for (
        var a = [
            0.77, -2.45, 470, 695, 0.85, 0.2, 854, 627, 0.86, 0.2, 1260, 647,
            0.78, 1, 1630, 663, 0.86, 4.7, 2057, 642, 0.8, -2, 2477, 722, 0.8,
            -5, 2924, 602, 0.77, 0, 459, 1161, 0.85, -0.48, 854, 1147, 0.78,
            5.11, 1253, 1137, 0.82, 0.11, 1680, 1147, 0.7, 0, 2121, 1188, 0.75,
            1, 2526, 1264, 0.75, -2, 2933, 1162, 0.71, -3, 700, 1635, 0.66,
            -0.31, 1091, 1611, 0.66, 0.51, 1481, 1606, 0.7, 6.66, 1832, 1665,
            0.66, 0, 2172, 1627, 0.65, -5, 2586, 1680, 0.75, -2, 2855, 1624,
          ],
          b = 0;
        b < a.length;

      ) {
        var c = 0.8 * a[b++] * 1.5;
        let e = a[b++],
          f = (0.8 * a[b++]) / 2 - 90,
          g = (0.8 * a[b++]) / 2,
          h = b >> 2;
        var d = void 0;
        D.LB(h)
          ? ((d = "pics/"), 10 > h && (d = "pics/0"), (d += h))
          : (d = "missing");
        d = new y(this.$i, this.HE, d);
        d.ix(null == h ? "null" : "" + h);
        d.C();
        d.H(c);
        d.la(e);
        d.o(f);
        d.m(g);
      }
      a = this.$i.Re();
      this.IE = a.B - a.A;
      a = this.$i.ka();
      for (b = this.$i.iterator(); b.eb(); )
        (c = b.next()), c.o(c.wa() - a / 2);
    }
    update(a) {
      super.update(a);
      -50 > this.fa.ka() / this.qa.Qa - this.IE
        ? this.scroll.update(a)
        : this.$i.o(300);
      this.mf.o(this.fa.ka() - this.mf.ka());
      switch (this.state) {
        case 0:
          a = this.jb(0.2);
          this.mf.m(this.fa.ja() - this.mf.ja() * a);
          1 == a && (this.state = 1);
          break;
        case 1:
          this.mf.m(this.fa.ja() - this.mf.ja());
          break;
        case 2:
          (a = this.jb(0.2)),
            this.mf.m(this.fa.ja() - this.mf.ja() * (1 - a)),
            1 == a && (this.mf.M(!1), (this.state = 3), this.Vb());
      }
      "Running" == this.De &&
        ((a = this.O.hd()),
        a.Nb(0) && (this.Lu = a.position[0].x),
        !a.qe(0) ||
          5 < Math.abs(a.position[0].x - this.Lu) ||
          ((a = new bh()),
          this.$i.Ub(this.Cc.g, a) &&
            ((a = Da.parseInt(a.get(0).name)),
            (this.Ta.pictureIndex = a),
            (this.Ta.available = D.LB(a)),
            (this.Ta.ui = !1),
            this.Bg(fd))));
    }
    Od() {
      this.hb(0) && ((this.state = 2), (this.time = 0));
    }
    Vb() {
      this.ba(ub);
    }
    Ga() {
      return "PicturesScene";
    }
  }
  Ac.i = !0;
  Ac.s = ca;
  Object.assign(Ac.prototype, { l: Ac });
  class Kd extends Ac {
    constructor() {
      super();
    }
    Vb() {
      this.ba(ec);
    }
    Ga() {
      return "FamobiPicturesScene";
    }
  }
  Kd.i = !0;
  Kd.s = Ac;
  Object.assign(Kd.prototype, { l: Kd });
  class $g {
    constructor() {
      this.vx = -1;
      this.g = new F(0, 0, 0, 1);
      this.lo = this.mj = -1;
      this.pressed = this.released = !1;
    }
    Fi() {
      this.lo = -1;
    }
    ei() {}
    WL(a, b) {
      b = b.Ub(this.g);
      0 > this.mj &&
        (this.pressed && (this.vx = b ? a : -1),
        b && ((this.lo = a), this.pressed && (this.mj = a)));
      if (this.mj == a && (b && (this.lo = a), this.released)) {
        b = this.vx != a;
        this.vx = -1;
        if (b) return (this.mj = -1), (this.pressed = this.released = !1);
        if (a == this.lo)
          return (this.mj = -1), (this.pressed = this.released = !1), !0;
        this.mj = -1;
      }
      return !1;
    }
    JB(a) {
      return a == this.lo;
    }
    isActive(a) {
      return a == this.mj;
    }
  }
  $g.i = !0;
  Object.assign($g.prototype, { l: $g });
  class ta {
    static yu(a, b) {
      a = a.charCodeAt(b);
      if (a == a) return a;
    }
    static substr(a, b, c) {
      if (null == c) c = a.length;
      else if (0 > c)
        if (0 == b) c = a.length + c;
        else return "";
      return a.substr(b, c);
    }
    static remove(a, b) {
      b = a.indexOf(b);
      if (-1 == b) return !1;
      a.splice(b, 1);
      return !0;
    }
    static now() {
      return Date.now();
    }
  }
  ta.i = !0;
  class bi {
    constructor(a, b) {
      this.min = a;
      this.max = b;
    }
    eb() {
      return this.min < this.max;
    }
    next() {
      return this.min++;
    }
  }
  bi.i = !0;
  Object.assign(bi.prototype, { l: bi });
  class Ma {
    static tl(a, b) {
      for (a = ye(a); a.eb(); ) if (b(a.next())) return !0;
      return !1;
    }
    static yi(a, b) {
      for (a = ye(a); a.eb(); ) b(a.next());
    }
    static count(a, b) {
      let c = 0;
      if (null == b) for (b = ye(a); b.eb(); ) b.next(), ++c;
      else for (a = ye(a); a.eb(); ) b(a.next()) && ++c;
      return c;
    }
    static find(a, b) {
      for (a = ye(a); a.eb(); ) {
        let c = a.next();
        if (b(c)) return c;
      }
      return null;
    }
  }
  Ma.i = !0;
  class Ai {
    static tP(a) {
      new bf(a);
    }
  }
  ja.Ctrr.main = Ai.tP;
  Ai.i = !0;
  Math.i = !0;
  class gd {
    static KA(a) {
      return 17 >= a ? 1 : 2;
    }
    static jv(a) {
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
    static Vq(a, b) {
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
  gd.i = !0;
  class D {
    static reset() {
      D.Ua = 1;
      D.box = 1;
      D.level = 1;
    }
    static Gs(a) {
      D.Ua = a;
    }
    static tk(a) {
      D.box = a;
    }
    static Xw(a) {
      D.level = a;
    }
    static KR(a, b) {
      let c = D.box - 1,
        d = D.level - 1;
      z.ug[c][d] = a;
      z.gg[c][d] = b ? 1 : 0;
      25 > d && (z.Cf[c][d + 1] = !0);
      z.flush();
    }
    static HN() {
      return z.Li.length;
    }
    static LB(a) {
      return z.Li.includes("" + gd.KA(a) + "-" + gd.jv(a));
    }
    static FO() {
      switch (D.box) {
        case 1:
          return (
            1 ==
            [
              -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0,
              0, 1, 0, 1,
            ][D.level]
          );
        case 2:
          return (
            1 ==
            [
              -1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0,
            ][D.level]
          );
        default:
          return !1;
      }
    }
    static dO() {
      if (!D.FO() || z.Li.includes("" + D.box + "-" + D.level)) return !1;
      z.Li.push("" + D.box + "-" + D.level);
      z.hk++;
      z.flush();
      return !0;
    }
    static CO(a) {
      return z.Cf[D.box - 1][a - 1];
    }
    static sr(a) {
      return z.locked[a - 1];
    }
    static bA(a) {
      return 0 >= D.lv(a);
    }
    static aT(a) {
      z.locked[a - 1] = !1;
      z.Cf[a - 1][0] = !0;
      z.flush();
    }
    static lv(a) {
      --a;
      return yi[a] - D.ov();
    }
    static cl() {
      return 25 == D.level;
    }
    static eS() {
      D.Xw(D.level + 1);
    }
    static Kj() {
      let a = 0,
        b = D.Ua,
        c = 0;
      for (; 3 > c; ) (D.Ua = c++ + 1), (a += D.ov());
      D.Ua = b;
      return a;
    }
    static ov() {
      var a = 0,
        b = 0;
      let c = 0;
      switch (D.Ua) {
        case 1:
          a = 0;
          b = 5;
          break;
        case 2:
          a = 5;
          b = 10;
          break;
        case 3:
          (a = 10), (b = 17);
      }
      for (; a < b; ) {
        let d = a++,
          e = 0;
        for (; 25 > e; ) {
          let f = e++;
          c += z.ug[d][f];
          c += z.gg[d][f];
        }
      }
      return c;
    }
    static IL() {
      let a = 0;
      for (; 17 > a; ) {
        let b = a++,
          c = 0;
        for (; 25 > c; ) if (!z.Cf[b][c++]) return !1;
      }
      return !0;
    }
    static LA(a) {
      null == a && (a = D.box);
      let b = 0,
        c = 0;
      for (; 25 > c; ) {
        let d = c++;
        b += z.ug[a - 1][d];
        b += z.gg[a - 1][d];
      }
      return b;
    }
    static kv(a) {
      null == a && (a = D.level);
      return z.ug[D.box - 1][a - 1];
    }
    static pB(a) {
      null == a && (a = D.level);
      return 0 < z.gg[D.box - 1][a - 1];
    }
  }
  D.i = !0;
  class yb {
    static uf(a, b) {
      try {
        return a[b];
      } catch (c) {
        return null;
      }
    }
    static bN(a) {
      let b = [];
      if (null != a) {
        let d = Object.prototype.hasOwnProperty;
        for (var c in a)
          "__id__" != c && "hx__closures__" != c && d.call(a, c) && b.push(c);
      }
      return b;
    }
  }
  yb.i = !0;
  class Pd {}
  Pd.i = !0;
  class hd {
    constructor(a) {
      this.storage = a;
      this.uR = this.MB = !1;
      this.version = this.$n();
      this.reset();
    }
    load(a) {
      let b = this;
      this.storage.load(function (c) {
        let d = !1;
        try {
          if (null != c) {
            b.parse(c);
            if (b.version > b.$n()) throw 4;
            for (c = !1; b.version < b.$n(); )
              b.Sr(b.version + 1), b.version++, (c = !0);
            if (c) {
              b.save(a);
              return;
            }
          } else d = !0;
        } catch (e) {
          d = !0;
        }
        d ? (b.reset(), b.save(a)) : a();
      });
    }
    save(a) {
      this.MB = !0;
      let b = this;
      this.storage.save(this.stringify(), function (c) {
        b.MB = !1;
        b.uR = 0 == c;
        a();
      });
    }
  }
  hd.i = !0;
  Object.assign(hd.prototype, { l: hd });
  class z extends hd {
    constructor(a) {
      super(a);
      z.instance = this;
      this.reset();
    }
    reset() {
      this.version = this.$n();
      z.Zc = !0;
      z.me = !0;
      z.language = null;
      z.le = J.Hd ? 3 : 0;
      z.hint = 1;
      z.yl = !1;
      z.ug = [];
      z.gg = [];
      z.Cf = [];
      z.locked = [];
      z.Ao = !1;
      z.up = !1;
      z.Li = [];
      z.hk = 0;
      let a = 1;
      for (; 17 >= a; ) this.AB(a, 1 != a && 6 != a && 11 != a), ++a;
    }
    parse(a) {
      a = JSON.parse(a);
      this.version = a.v;
      z.Zc = a.music;
      z.me = a.sound;
      z.language = a.language;
      z.ug = a.levelStars;
      z.Cf = a.levelCleared;
      z.locked = a.locked;
      2 <= this.version &&
        ((z.hint = a.hint), (z.le = a.skin), (z.yl = a.gameWon));
      z.le = J.Hd ? 3 : z.le;
      3 <= this.version &&
        ((z.gg = a.blueStars),
        (z.Ao = a.magnetUsed),
        (z.up = a.levelCleared),
        (z.Li = a.pictures),
        (z.hk = a.picturesBadgeCounter));
    }
    stringify() {
      let a = {};
      a.v = this.version;
      a.music = z.Zc;
      a.sound = z.me;
      a.language = z.language;
      a.levelStars = z.ug;
      a.blueStars = z.gg;
      a.levelCleared = z.Cf;
      a.locked = z.locked;
      a.hint = z.hint;
      a.skin = J.Hd ? 0 : z.le;
      a.gameWon = z.yl;
      a.magnetUsed = z.Ao;
      a.telekinesisUsed = z.up;
      a.pictures = z.Li;
      a.picturesBadgeCounter = z.hk;
      return JSON.stringify(a);
    }
    Sr(a) {
      switch (a) {
        case 2:
          z.hint = 1;
          z.le = 0;
          z.yl = !1;
          for (a = 3; 17 >= a; ) this.AB(a, 6 != a && 11 != a), ++a;
          break;
        case 3:
          for (a = 0; 17 > a; ) {
            z.gg[a] = [];
            for (var b = 0; 25 > b; ) z.gg[a][b++] = 0;
            ++a;
          }
          z.Ao = !1;
          z.up = !1;
          z.Li = [];
          z.hk = 0;
          for (a = 1; 22 > a; ) {
            var c = a++;
            b = gd.KA(c);
            c = gd.jv(c);
            z.Cf[b - 1][c - 1] && (z.Li.push("" + b + "-" + c), z.hk++);
          }
      }
    }
    $n() {
      return 3;
    }
    AB(a, b) {
      null == b && (b = !0);
      --a;
      z.locked[a] = b;
      z.ug[a] = [];
      z.Cf[a] = [];
      let c = 0;
      for (; 25 > c; ) {
        let d = c++;
        z.ug[a][d] = 0;
        z.Cf[a][d] = !1;
      }
      b || (z.Cf[a][0] = !0);
      z.gg[a] = [];
      for (b = 0; 25 > b; ) z.gg[a][b++] = 0;
    }
    static flush() {
      z.instance.save(function () {});
    }
  }
  z.i = !0;
  z.s = hd;
  Object.assign(z.prototype, { l: z });
  class x {
    static play(a, b) {
      null == b && (b = !1);
      z.me && Ba.instance.Ra.play(a, b);
    }
    static stop(a) {
      Ba.instance.Ra.stop(a);
    }
    static Vi(a, b) {
      Ba.instance.Ra.bS(a, b);
    }
    static Sn(a) {
      z.me && Ba.instance.Ra.Sn(a, 1, !0);
    }
  }
  x.i = !0;
  class Da {
    static Dd(a) {
      return Wa.gn(a, "");
    }
    static parseInt(a) {
      a = parseInt(a);
      return isNaN(a) ? null : a;
    }
  }
  Da.i = !0;
  class Uc {
    static vr(a, b) {
      a = ta.yu(a, b);
      return 8 < a && 14 > a ? !0 : 32 == a;
    }
    static rP(a) {
      var b;
      let c = "";
      for (b = 4 - a.length; c.length < b; ) c += "0";
      return c + (null == a ? "null" : "" + a);
    }
    static fO(a) {
      let b = "";
      do (b = "0123456789ABCDEF".charAt(a & 15) + b), (a >>>= 4);
      while (0 < a);
      for (; 2 > b.length; ) b = "0" + b;
      return b;
    }
  }
  Uc.i = !0;
  class Db {
    static get(a, b) {
      null == Db.ud && (Db.ud = JSON.parse(l.yb(l.Ph)));
      var c = yb.uf(Db.ud, a);
      if (null == c || null == z.language) return a;
      if (Object.prototype.hasOwnProperty.call(c, z.language)) {
        a = yb.uf(c, z.language);
        if (null != b) {
          c = 0;
          let d = b.length;
          for (; c < d; ) a = a.replace(RegExp("::\\w+::", ""), b[c++]);
        }
        return a;
      }
      return yb.uf(c, "en");
    }
  }
  class r {
    static fv(a, b) {
      let c = af.slice();
      c.sort(Bi.eM);
      c.splice(c.indexOf(a), 0, a);
      return c.indexOf(b);
    }
  }
  r.i = !0;
  class $h {
    static kA(a) {
      return new (Function.prototype.bind.apply(a, [null].concat([])))();
    }
  }
  $h.i = !0;
  class wi {
    static back() {
      window.webOSSystem.platformBack();
    }
  }
  wi.i = !0;
  class ch {
    constructor(a) {
      let b = new la(
        "^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$",
        ""
      );
      if (b.match(a))
        (this.vP = Da.parseInt(b.Yc(1))),
          (this.DP = Da.parseInt(b.Yc(2))),
          (this.Sr = Da.parseInt(b.Yc(3))),
          (this.$C = b.Yc(4)),
          (this.Uz = b.Yc(5));
      else throw 23;
    }
    toString() {
      let a = this.vP + "." + this.DP + "." + this.Sr;
      null != this.$C && (a += "-" + this.$C);
      null != this.Uz && (a += "+" + this.Uz);
      return a;
    }
  }
  ch.i = !0;
  Object.assign(ch.prototype, { l: ch });
  class Cd {}
  Cd.i = !0;
  class Vg {
    constructor(
      a,
      b,
      c,
      d,
      e,
      f,
      g,
      h,
      m,
      n,
      q,
      p,
      v,
      u,
      A,
      C,
      B,
      K,
      E,
      aa,
      Z,
      V
    ) {
      this.hB = !1;
      this.WB = !0;
      this.zx = !1;
      this.AA = this.Iz = this.audio = this.fF = this.transition = this.xB = !0;
      this.xE = !1;
      this.Hz = this.zw = null;
      this.Po = 4;
      this.wu = null;
      this.yB = 1;
      this.language = "en";
      this.title = a;
      this.io = b;
      null != c && (this.language = c);
      null != d && (this.yB = d);
      null != e && (this.wu = e);
      null != f && (this.Po = f);
      null != g && (this.Hz = g);
      null != h && (this.zw = h);
      null != m && (this.xE = m);
      null != n && (this.AA = n);
      null != q && (this.Iz = q);
      null != p && (this.audio = p);
      null != v && (this.fF = v);
      null != u && (this.transition = u);
      null != A && (this.xB = A);
      null != E && (this.zx = E);
      null != Z && (this.WB = Z);
      null != V && (this.hB = V);
    }
  }
  Vg.i = !0;
  Object.assign(Vg.prototype, { l: Vg });
  class Rg {
    constructor() {
      this.current = 60;
      let a = [],
        b = 0;
      for (; 60 > b; ) ++b, a.push(0);
      this.values = a;
      this.time = this.ew = 0;
    }
    update(a) {
      this.time += a;
      1 < this.time &&
        ((this.current = Math.min(this.ew, 60)),
        this.values[this.current - 1]++,
        (this.ew = 0),
        --this.time);
      this.ew++;
    }
  }
  Rg.i = !0;
  Object.assign(Rg.prototype, { l: Rg });
  class Tg {
    constructor(a, b) {
      this.yd = a;
      this.Ce = b;
    }
    Yq() {
      if (0 == this.Ce.length) return 100;
      let a = Math.round(100 * this.yd.bo(this.Ce));
      this.Qj() && --a;
      0 > a && (a = 0);
      return a;
    }
    pv() {
      return 0 != this.Ce.length ? (1 == this.yd.bo() ? !this.Qj() : !1) : !0;
    }
    Qj() {
      let a = 0,
        b = this.Ce;
      for (; a < b.length; ) if (!l.ob(l.pg(b[a++]))) return !0;
      return !1;
    }
  }
  Tg.i = !0;
  Object.assign(Tg.prototype, { l: Tg });
  class Qd {}
  Qd.i = !0;
  Qd.Je = !0;
  Object.assign(Qd.prototype, { l: Qd });
  class Ke {
    constructor(a) {
      this.key = a;
    }
    load(a) {
      try {
        let b = ci.XA().getItem(this.key);
        null != a && a(b);
        return b;
      } catch (b) {
        return null != a && a(null), null;
      }
    }
    save(a, b) {
      try {
        ci.XA().setItem(this.key, a), null != b && b(!0);
      } catch (c) {
        null != b && b(!1);
      }
    }
  }
  Ke.i = !0;
  Ke.Ib = [Qd];
  Object.assign(Ke.prototype, { l: Ke });
  class di {
    constructor(a, b, c) {
      this.type = a;
      this.Pq = b;
      this.once = c;
      this.next = null;
    }
  }
  di.i = !0;
  Object.assign(di.prototype, { l: di });
  class Zg {
    constructor(a) {
      this.top = 0;
      this.stack = [];
      this.push(a);
    }
    eb() {
      return 0 < this.top;
    }
    next() {
      let a = this.stack[--this.top];
      this.push(a);
      return a;
    }
    push(a) {
      for (a = a.Me; null != a; ) (this.stack[this.top++] = a), (a = a.Y);
    }
  }
  Zg.i = !0;
  Object.assign(Zg.prototype, { l: Zg });
  class db {
    constructor(a, b, c, d) {
      this.r = a;
      this.ue = b;
      this.b = c;
      this.a = d;
    }
    Zb() {
      return new db(this.r, this.ue, this.b, this.a);
    }
  }
  db.i = !0;
  Object.assign(db.prototype, { l: db });
  class U {
    constructor(a, b, c, d) {
      this.x = a;
      this.y = b;
      this.w = c;
      this.J = d;
    }
    static Zb(a) {
      return new U(a.x, a.y, a.w, a.J);
    }
    static zm(a) {
      return new U(0.4 * a.x, 0.4 * a.y, 0.4 * a.w, 0.4 * a.J);
    }
    static ww(a, b, c, d, e, f, g, h) {
      return !(a > g || c < e || b > h || d < f);
    }
    static ik(a, b, c, d, e, f) {
      return a >= c && a < c + e && b >= d ? b < d + f : !1;
    }
    static nt(a, b, c, d, e) {
      return (
        (e.x < a ? U.iy : 0) +
        (e.x > c ? U.jy : 0) +
        (e.y < b ? U.hy : 0) +
        (e.y > d ? U.ky : 0)
      );
    }
    static Xj(a, b, c, d, e, f, g, h) {
      let m = new t(a, b),
        n = new t(c, d),
        q;
      g = e + g;
      let p = f + h,
        v = U.nt(e, f, g, p, m),
        u = U.nt(e, f, g, p, n);
      for (; 0 != v || 0 != u; ) {
        if (0 != (v & u)) return !1;
        0 != v ? ((h = v), (q = m)) : ((h = u), (q = n));
        0 < (h & U.iy)
          ? ((q.y += ((b - d) * (e - q.x)) / (a - c)), (q.x = e))
          : 0 != (h & U.jy) &&
            ((q.y += ((b - d) * (g - q.x)) / (a - c)), (q.x = g));
        0 < (h & U.hy)
          ? ((q.x += ((a - c) * (f - q.y)) / (b - d)), (q.y = f))
          : 0 != (h & U.ky) &&
            ((q.x += ((a - c) * (p - q.y)) / (b - d)), (q.y = p));
        h == v ? (v = U.nt(e, f, g, p, m)) : (u = U.nt(e, f, g, p, n));
      }
      return !0;
    }
  }
  U.i = !0;
  Object.assign(U.prototype, { l: U });
  class Ge extends hd {
    constructor() {
      super(null);
    }
    stringify() {
      return "";
    }
    parse() {}
    reset() {}
    $n() {
      return 1;
    }
    Sr() {}
  }
  Ge.i = !0;
  Ge.s = hd;
  Object.assign(Ge.prototype, { l: Ge });
  class wc extends da {
    constructor(a) {
      super();
      this.O = a;
      this.Ta = {};
      this.back = new qb();
      this.Ba = new qb();
      this.Ab = new Rd();
    }
    ka() {
      return this.O.window.oi().x;
    }
    ja() {
      return this.O.window.oi().y;
    }
    gB() {
      return this.O.window.oi();
    }
    Xq() {
      let a = this.O.window.oi();
      return new Y(0, 0, a.x, a.y);
    }
    Se() {
      return this.O.window.Wn();
    }
    update(a) {
      this.Ab.Lb(new F(this.ka(), this.ja(), 0, 1));
      this.O.V.uk(this.Ab);
      this.back.Hh(a);
      super.update(a);
      this.Ba.Hh(a);
    }
    bd(a) {
      let b = this.O.V;
      this.Ab.Lb(new F(this.ka(), this.ja(), 0, 1));
      b.uk(this.Ab);
      this.back.Fd();
      this.back.Nm();
      b.Bq(this.back);
      super.bd(a);
      this.Ba.Fd();
      this.Ba.Nm();
      b.Bq(this.Ba);
    }
    $p(a, b, c) {
      function d() {
        if (c) return b.ud.oa(new Fc(e)), g.oa(new Sd(b, e));
        let h = new Fc(e);
        g.oa(h);
        return null == f ? g.oa(new Td(e)) : g.oa(new nf(b, e));
      }
      let e = $h.kA(a);
      e.fa = this;
      e.O = this.O;
      e.caller = b;
      null == b && (e.Ta = this.Ta);
      let f = this.eN(),
        g = this;
      if (0 < e.$A().length) {
        a = e.WA(d);
        a.fa = this;
        a.O = this.O;
        let h = new Fc(a);
        null == f
          ? (this.oa(h), this.oa(new Td(a)))
          : (b.ud.oa(h), this.oa(new Sd(b, a)));
      } else d();
    }
    Jf(a) {
      null == (a.ud.parent instanceof wc ? null : a.ud.parent)
        ? this.oa(new of(a))
        : ((a.ud.parent.Of.caller = a), this.oa(new Ud(a)));
    }
    eN() {
      let a = this.Me;
      for (; null != a; ) {
        if (a instanceof Fc) return a;
        a = a.Y;
      }
      return null;
    }
  }
  wc.i = !0;
  wc.s = da;
  Object.assign(wc.prototype, { l: wc });
  class Mb {
    constructor() {
      this.Sh = Mb.Mk;
      this.elapsedTime = 0;
      this.Bx = 1;
    }
  }
  Mb.i = !0;
  Object.assign(Mb.prototype, { l: Mb });
  class Sg {
    constructor() {
      this.elapsedTime = 0;
      this.ts = !1;
      this.handle = -1;
      this.now = 0;
      this.Tu = !0;
      this.startTime = 0;
    }
    Fg() {}
    start() {
      if (!this.ts) {
        this.stop();
        this.ts = !0;
        var a = null,
          b = ((bc = window), P(bc, bc.requestAnimationFrame)),
          c = this;
        a = function (d) {
          c.handle = b(a);
          if (c.Tu) (c.startTime = d), (c.now = d), (c.Tu = !1);
          else {
            let e = d - c.now;
            c.now = d;
            c.elapsedTime = (d - c.startTime) / 1e3;
            c.Fg(e / 1e3);
          }
        };
        this.handle = b(a);
      }
    }
    stop() {
      this.ts &&
        ((this.Tu = !0),
        0 > this.handle ||
          (window.cancelAnimationFrame(this.handle),
          (this.handle = -1),
          (this.ts = !1)));
    }
  }
  Sg.i = !0;
  Object.assign(Sg.prototype, { l: Sg });
  class t {
    constructor(a, b) {
      this.x = a;
      this.y = b;
    }
    add(a) {
      this.x += a.x;
      this.y += a.y;
    }
    ux(a) {
      this.x -= a.x;
      this.y -= a.y;
    }
    multiply(a) {
      this.x *= a;
      this.y *= a;
    }
    rA(a) {
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
    ao() {
      return this.x * this.x + this.y * this.y;
    }
    KO() {
      return 0 == this.x ? 0 == this.y : !1;
    }
    ZM(a) {
      return this.x == a.x ? this.y == a.y : !1;
    }
    normalize() {
      this.multiply(1 / this.Rb());
    }
    angle() {
      return Math.atan(this.y / this.x);
    }
    em() {
      return Math.atan2(this.y, this.x);
    }
    Zb() {
      return new t(this.x, this.y);
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
    Ya(a, b, c) {
      this.x -= b;
      this.y -= c;
      this.rotate(a);
      this.x += b;
      this.y += c;
    }
    static sc() {
      return new t(0, 0);
    }
    static LP() {
      return new t(2147483647, 2147483647);
    }
    static tb(a, b) {
      return new t(a.x + b.x, a.y + b.y);
    }
    static Ha(a, b) {
      return new t(a.x - b.x, a.y - b.y);
    }
    static Ob(a, b) {
      return new t(a.x * b, a.y * b);
    }
    static Vp(a, b) {
      return new t(a.x / b, a.y / b);
    }
    static nd(a, b, c, d) {
      a -= c;
      b -= d;
      return Math.sqrt(a * a + b * b);
    }
    static rz(a, b) {
      return a.x * b.x + a.y * b.y;
    }
    static Vt(a) {
      return new t(-a.y, a.x);
    }
    static sL(a) {
      return new t(a.y, -a.x);
    }
    static Wp(a) {
      return t.Ob(a, 1 / a.Rb());
    }
    static XL(a, b) {
      let c = new t(0, 0);
      t.GD(a, b, c);
      return c;
    }
    static GD(a, b, c) {
      var d = a.length;
      if (1 >= d) c.x = c.y = 0;
      else {
        for (var e = t.tL, f = t.uL, g = 1 - b, h = 0; h < d; ) {
          let m = h++,
            n = a[m];
          e[m] = n.x;
          f[m] = n.y;
        }
        for (a = d - 1; 0 < a; ) {
          d = 0;
          for (h = 1; d < a; )
            (e[d] = e[d] * g + e[h] * b),
              (f[d] = f[d] * g + f[h] * b),
              ++d,
              ++h;
          --a;
        }
        c.x = e[0];
        c.y = f[0];
      }
    }
    static EA(a) {
      return new t(Math.cos(a), Math.sin(a));
    }
  }
  t.i = !0;
  Object.assign(t.prototype, { l: t });
  class $c extends yc {
    constructor(a, b) {
      super();
      this.gm = b;
      this.EP = a.$A();
      this.Ul = this.O.load(this.EP);
    }
    Yq() {
      return this.Ul.Yq();
    }
    update(a) {
      super.update(a);
      this.Ul.pv() && "Running" == this.De && this.Yw();
    }
    wi() {
      return !1;
    }
    Yw() {
      this.fa.oa(new Ud(this, !1, this.gm));
    }
    Ga() {
      return "LoadingOverlay";
    }
  }
  $c.i = !0;
  $c.s = yc;
  Object.assign($c.prototype, { l: $c });
  class Fc extends da {
    constructor(a) {
      super();
      this.Of = a;
      a.ud = this;
      a.uC = !0;
      a.tC = !0;
      this.oa(a);
    }
    update(a) {
      switch (this.Of.De) {
        case "Paused":
        case "Running":
        case "Started":
          break;
        default:
          return;
      }
      this.O.window.Gw && this.Of.qb();
      this.Of.update(a);
      this.Of.aq(a);
      super.update(a);
    }
    bd(a) {
      if (this.Of.Mx)
        switch (this.Of.De) {
          case "Paused":
          case "Running":
          case "Started":
            this.Of.bd(a);
        }
      super.bd(a);
    }
  }
  Fc.i = !0;
  Fc.s = da;
  Object.assign(Fc.prototype, { l: Fc });
  class jb extends da {
    constructor(a, b) {
      super();
      this.a = a;
      this.b = b;
      this.state = 0;
    }
    iN(a, b) {
      for (a = a.ud.parent; null != a && !(a instanceof wc); )
        b(a.Of), (a = a.parent);
    }
    Dl(a) {
      if (a.ud.parent == a.fa) return a;
      let b = a.ud.parent;
      for (; null != b; ) {
        if (b.parent == a.fa) return b.Of;
        b = b.parent;
      }
      return null;
    }
    Lj(a) {
      return a.O.config.fF ? a.Lj() : 0;
    }
    bc(a, b) {
      return a.O.config.transition ? a.bc(b) : 0;
    }
    $(a) {
      this.state = a;
      this.time = 0;
    }
  }
  jb.i = !0;
  jb.s = da;
  Object.assign(jb.prototype, { l: jb });
  class nf extends jb {
    constructor(a, b) {
      super(a, b);
      "Running" == a.De && a.xb("Paused");
      this.Dl(a).ad(0, b);
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 0:
          a = this.jb(this.bc(this.a, this.b) / 2);
          this.Dl(this.a).ad(a, this.b);
          1 == a && this.$(1);
          break;
        case 1:
          this.a.xb("Stopped");
          this.a.Mc();
          this.iN(this.a, function (b) {
            "Stopped" != b.De && (b.xb("Stopped"), b.Mc());
          });
          this.b.xb("Created");
          this.b.ua();
          this.b.qb();
          this.$(2);
          break;
        case 2:
          if (this.time < this.Lj(this.b)) break;
          this.b.xb("Started");
          this.b.hm();
          this.b.Td(0, this.a);
          this.$(3);
          break;
        case 3:
          (a = this.jb(this.bc(this.a, this.b) / 2)),
            this.b.Td(a, this.a),
            1 > a ||
              (this.b.xb("Running"),
              this.b.fb(),
              this.Dl(this.a).ud.ra(),
              this.ra());
      }
    }
  }
  nf.i = !0;
  nf.s = jb;
  Object.assign(nf.prototype, { l: nf });
  class dh extends jb {
    constructor(a, b) {
      super(a, b);
      b.xb("Created");
      b.ua();
      b.qb();
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 0:
          if (this.time < this.Lj(this.b)) break;
          this.a.xb("Paused");
          for (a = this.a; null != a.parent && a.parent != this.a.fa; )
            a = a.parent;
          this.Dl(this.a).ad(1, this.b);
          this.b.xb("Started");
          this.b.hm();
          this.b.Td(0, this.a);
          this.time = 0;
          this.state = 1;
          break;
        case 1:
          if (
            ((a = this.jb(this.bc(this.a, this.b))),
            this.Dl(this.a).ad(a, this.b),
            this.b.Td(a, this.a),
            1 == a)
          ) {
            this.a.xb("Stopped");
            this.a.Mc();
            for (a = this.a; null != a.parent && a.parent != this.a.fa; )
              "Stopped" != a.De && (a.xb("Stopped"), a.Mc()), (a = a.parent);
            this.Dl(this.a).ra();
            this.b.xb("Running");
            this.b.fb();
            this.ra();
          }
      }
    }
  }
  dh.i = !0;
  dh.s = jb;
  Object.assign(dh.prototype, { l: dh });
  class of extends jb {
    constructor(a) {
      super(a, null);
      a.xb("Paused");
      a.ad(1, null);
    }
    update() {
      let a = this.jb(this.bc(this.a, this.b));
      this.a.ad(a, this.b);
      1 > a || (this.a.xb("Stopped"), this.a.Mc(), this.a.ra(), this.ra());
    }
  }
  of.i = !0;
  of.s = jb;
  Object.assign(of.prototype, { l: of });
  class Ud extends jb {
    constructor(a, b, c) {
      null == b && (b = !0);
      let d = a.JN();
      super(a, d);
      this.oR = b;
      this.Gi = c;
      a.xb("Paused");
      a.ad(0, d);
    }
    update(a) {
      super.update(a);
      a = this.jb(this.bc(this.a, this.b));
      this.a.ad(a, this.b);
      1 == a &&
        (this.a.xb("Stopped"),
        this.a.Mc(),
        this.a.ud.ra(),
        this.oR &&
          ("Stopped" == this.b.De && this.b.xb("Restarted"),
          this.b.xb("Running"),
          this.b.fb()),
        this.ra(),
        null != this.Gi && (this.Gi(), (this.Gi = null)));
    }
  }
  Ud.i = !0;
  Ud.s = jb;
  Object.assign(Ud.prototype, { l: Ud });
  class Sd extends jb {
    constructor(a, b) {
      super(a, b);
      b.xb("Created");
      b.ua();
      b.qb();
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 0:
          if (this.time < this.Lj(this.b)) break;
          "Running" == this.a.De && this.a.xb("Paused");
          this.b.xb("Started");
          this.b.hm();
          this.b.Td(0, this.a);
          this.$(1);
          break;
        case 1:
          (a = this.jb(this.bc(this.a, this.b))),
            this.b.Td(a, this.a),
            1 > a ||
              (this.b.wi() && (this.a.xb("Stopped"), this.a.Mc()),
              this.b.xb("Running"),
              this.b.fb(),
              this.ra());
      }
    }
  }
  Sd.i = !0;
  Sd.s = jb;
  Object.assign(Sd.prototype, { l: Sd });
  class Td extends jb {
    constructor(a) {
      super(null, a);
      a.xb("Created");
      a.ua();
      a.qb();
    }
    update() {
      switch (this.state) {
        case 0:
          if (this.time < this.Lj(this.b)) break;
          this.b.xb("Started");
          this.b.hm();
          this.b.Td(0, this.a);
          this.$(1);
          break;
        case 1:
          let a = this.jb(this.bc(this.b, this.a));
          this.b.Td(a, this.a);
          1 > a || (this.b.xb("Running"), this.b.fb(), this.ra());
      }
    }
  }
  Td.i = !0;
  Td.s = jb;
  Object.assign(Td.prototype, { l: Td });
  class Md {
    constructor(a, b, c) {
      this.sd = null;
      this.wm = !1;
      if (null != c) {
        this.Tb = a;
        this.Xc = b;
        a = this.N = Array(this.Tb * this.Xc);
        b = 0;
        let d = this.Tb * this.Xc;
        for (; b < d; ) {
          let e = b++;
          a[e] = c[e];
        }
      } else (this.Tb = a), (this.Xc = b), (this.N = Array(this.Tb * this.Xc));
    }
    forEach(a) {
      let b = this.N,
        c = this.Tb,
        d = 0,
        e = this.Tb * this.Xc;
      for (; d < e; ) {
        let f = d++;
        b[f] = a(b[f], f % c, (f / c) | 0);
      }
      return this;
    }
    yi(a) {
      let b = this.N,
        c = 0,
        d = this.Tb * this.Xc;
      for (; c < d; ) a(b[c++]);
      return this;
    }
    resize(a, b) {
      if (a == this.Tb && b == this.Xc) return this;
      let c = this.N;
      this.N = Array(a * b);
      if (a == this.Tb)
        return (
          Nb.un(c, 0, this.N, this.Tb * (b < this.Xc ? b : this.Xc)),
          (this.Tb = a),
          (this.Xc = b),
          this
        );
      let d = a < this.Tb ? a : this.Tb,
        e;
      let f = this.N,
        g = 0,
        h = b < this.Xc ? b : this.Xc;
      for (; g < h; ) {
        var m = g++;
        e = m * a;
        m *= this.Tb;
        let n = 0,
          q = d;
        for (; n < q; ) {
          let p = n++;
          f[e + p] = c[m + p];
        }
      }
      this.Tb = a;
      this.Xc = b;
      return this;
    }
    iterator() {
      if (this.wm) {
        if (null == this.sd) this.sd = new Vd(this);
        else {
          let a = this.sd;
          a.N = a.ye.N;
          let b = a.ye;
          a.wg = b.Tb * b.Xc;
          a.xe = 0;
        }
        return this.sd;
      }
      return new Vd(this);
    }
  }
  Md.i = !0;
  Md.Ib = [Zc];
  Object.assign(Md.prototype, { l: Md });
  class id {}
  id.i = !0;
  id.Je = !0;
  Object.assign(id.prototype, { l: id });
  class Vd {
    constructor(a) {
      this.ye = a;
      this.N = this.ye.N;
      a = this.ye;
      this.wg = a.Tb * a.Xc;
      this.xe = 0;
    }
    eb() {
      return this.xe < this.wg;
    }
    next() {
      return this.N[this.xe++];
    }
  }
  Vd.i = !0;
  Vd.Ib = [id];
  Object.assign(Vd.prototype, { l: Vd });
  class ah {
    constructor(a, b) {
      null == b && (b = 0);
      null == a && (a = 0);
      this.x = a;
      this.y = b;
    }
  }
  ah.i = !0;
  Object.assign(ah.prototype, { l: ah });
  class Gd {
    constructor(a) {
      this.ye = a;
      this.N = this.ye.N;
      this.wg = this.ye.aa;
      this.xe = 0;
    }
    Xu() {
      this.N = this.ye = null;
    }
    eb() {
      return this.xe < this.wg;
    }
    next() {
      return this.N[this.xe++];
    }
  }
  Gd.i = !0;
  Gd.Ib = [id];
  Object.assign(Gd.prototype, { l: Gd });
  class eh {}
  eh.i = !0;
  eh.Je = !0;
  eh.Ib = [Zc];
  class fh {}
  fh.i = !0;
  fh.Je = !0;
  fh.Ib = [Zc];
  class mc {
    constructor(a, b, c) {
      null == a && (a = 16);
      this.Fa = 0;
      this.Oj = -2;
      this.bb = this.Xl = 1 > a ? 1 : a;
      if (null != b) {
        a = this.Fa = b.length;
        var d = this.bb;
        this.bb = a > d ? a : d;
      }
      this.N = Array(this.bb);
      if (null != b) {
        a = this.N;
        d = 0;
        let e = this.Fa;
        for (; d < e; ) {
          let f = d++;
          a[f] = b[f];
        }
      }
      c && (this.Oj = 0);
    }
    Mf(a) {
      a > this.bb && ((this.bb = a), this.Si(a));
    }
    top() {
      return this.N[this.Fa - 1];
    }
    clear(a) {
      null == a && (a = !1);
      a && Nb.Hr(this.N);
      this.Fa = 0;
    }
    grow() {
      this.bb = Yg.Hn(this.Oj, this.bb);
      this.Si(this.bb);
    }
    Si(a) {
      a = Array(a);
      Nb.un(this.N, 0, a, this.Fa);
      this.N = a;
    }
  }
  mc.i = !0;
  mc.Ib = [fh];
  Object.assign(mc.prototype, { l: mc });
  class pf {
    static next() {
      null == pf.qz && (pf.qz = 0);
      return pf.qz++;
    }
  }
  pf.i = !0;
  class qf {}
  qf.i = !0;
  qf.Je = !0;
  Object.assign(qf.prototype, { l: qf });
  class rf {
    constructor(a, b, c) {
      null == b && (b = !1);
      null == a && (a = 1);
      this.sd = null;
      this.aa = 0;
      this.wm = !1;
      this.Oj = -2;
      this.Xl = 1 > a ? 1 : a;
      this.bb = a;
      this.vg = b;
      null != c &&
        ((a = this.aa = c.length), (b = this.bb), (this.bb = a > b ? a : b));
      this.N = Array(this.bb + 1);
      this.N[0] = null;
      if (null != c) {
        a = this.N;
        b = 1;
        let d = this.aa + 1;
        for (; b < d; ) {
          let e = b++;
          a[e] = c[e - 1];
        }
        this.hR();
      }
    }
    enqueue(a) {
      this.aa == this.bb && this.grow();
      this.N[++this.aa] = a;
      a = a.g = this.aa;
      let b = this.N,
        c = a >> 1,
        d = b[a],
        e = d.priority;
      if (this.vg)
        for (; 0 < c; ) {
          var f = b[c];
          if (0 > e - f.priority) (b[a] = f), (f.g = a), (a = c), (c >>= 1);
          else break;
        }
      else
        for (; 0 < c; )
          if (((f = b[c]), 0 < e - f.priority))
            (b[a] = f), (f.g = a), (a = c), (c >>= 1);
          else break;
      b[a] = d;
      d.g = a;
    }
    CM() {
      var a = this.N;
      let b = a[1];
      b.g = -1;
      a[1] = a[this.aa];
      a = 1;
      let c = this.N,
        d = 2,
        e,
        f = c[1],
        g = f.priority;
      if (this.vg)
        for (; d < this.aa; )
          if (
            (d < this.aa - 1 && 0 < c[d].priority - c[d + 1].priority && ++d,
            (e = c[d]),
            0 < g - e.priority)
          )
            (c[a] = e), (e.g = a), (a = f.g = d), (d <<= 1);
          else break;
      else
        for (; d < this.aa; )
          if (
            (d < this.aa - 1 && 0 > c[d].priority - c[d + 1].priority && ++d,
            (e = c[d]),
            0 > g - e.priority)
          )
            (c[a] = e), (e.g = a), (a = f.g = d), (d <<= 1);
          else break;
      c[a] = f;
      f.g = a;
      this.aa--;
      return b;
    }
    jR(a, b) {
      var c = a.priority;
      if (c != b)
        if (((a.priority = b), (a = a.g), this.vg))
          if (b < c) {
            b = a;
            c = this.N;
            var d = a >> 1;
            a = c[a];
            var e = a.priority;
            if (this.vg)
              for (; 0 < d; ) {
                var f = c[d];
                if (0 > e - f.priority)
                  (c[b] = f), (f.g = b), (b = d), (d >>= 1);
                else break;
              }
            else
              for (; 0 < d; )
                if (((f = c[d]), 0 < e - f.priority))
                  (c[b] = f), (f.g = b), (b = d), (d >>= 1);
                else break;
            c[b] = a;
            a.g = b;
          } else {
            b = a;
            c = this.N;
            d = a << 1;
            e = c[a];
            f = e.priority;
            if (this.vg)
              for (; d < this.aa; )
                if (
                  (d < this.aa - 1 &&
                    0 < c[d].priority - c[d + 1].priority &&
                    ++d,
                  (a = c[d]),
                  0 < f - a.priority)
                )
                  (c[b] = a), (a.g = b), (b = e.g = d), (d <<= 1);
                else break;
            else
              for (; d < this.aa; )
                if (
                  (d < this.aa - 1 &&
                    0 > c[d].priority - c[d + 1].priority &&
                    ++d,
                  (a = c[d]),
                  0 > f - a.priority)
                )
                  (c[b] = a), (a.g = b), (b = e.g = d), (d <<= 1);
                else break;
            c[b] = e;
            e.g = b;
            a = this.aa;
            b = this.N;
            c = a >> 1;
            d = b[a];
            e = d.priority;
            if (this.vg)
              for (; 0 < c; )
                if (((f = b[c]), 0 > e - f.priority))
                  (b[a] = f), (f.g = a), (a = c), (c >>= 1);
                else break;
            else
              for (; 0 < c; )
                if (((f = b[c]), 0 < e - f.priority))
                  (b[a] = f), (f.g = a), (a = c), (c >>= 1);
                else break;
            b[a] = d;
            d.g = a;
          }
        else if (b > c) {
          b = a;
          c = this.N;
          d = a >> 1;
          a = c[a];
          e = a.priority;
          if (this.vg)
            for (; 0 < d; )
              if (((f = c[d]), 0 > e - f.priority))
                (c[b] = f), (f.g = b), (b = d), (d >>= 1);
              else break;
          else
            for (; 0 < d; )
              if (((f = c[d]), 0 < e - f.priority))
                (c[b] = f), (f.g = b), (b = d), (d >>= 1);
              else break;
          c[b] = a;
          a.g = b;
        } else {
          b = a;
          c = this.N;
          d = a << 1;
          e = c[a];
          f = e.priority;
          if (this.vg)
            for (; d < this.aa; )
              if (
                (d < this.aa - 1 &&
                  0 < c[d].priority - c[d + 1].priority &&
                  ++d,
                (a = c[d]),
                0 < f - a.priority)
              )
                (c[b] = a), (a.g = b), (b = e.g = d), (d <<= 1);
              else break;
          else
            for (; d < this.aa; )
              if (
                (d < this.aa - 1 &&
                  0 > c[d].priority - c[d + 1].priority &&
                  ++d,
                (a = c[d]),
                0 > f - a.priority)
              )
                (c[b] = a), (a.g = b), (b = e.g = d), (d <<= 1);
              else break;
          c[b] = e;
          e.g = b;
          a = this.aa;
          b = this.N;
          c = a >> 1;
          d = b[a];
          e = d.priority;
          if (this.vg)
            for (; 0 < c; )
              if (((f = b[c]), 0 > e - f.priority))
                (b[a] = f), (f.g = a), (a = c), (c >>= 1);
              else break;
          else
            for (; 0 < c; )
              if (((f = b[c]), 0 < e - f.priority))
                (b[a] = f), (f.g = a), (a = c), (c >>= 1);
              else break;
          b[a] = d;
          d.g = a;
        }
    }
    clear(a) {
      null == a && (a = !1);
      a && Nb.Hr(this.N);
      this.aa = 0;
    }
    iterator() {
      if (this.wm) {
        if (null == this.sd) return new Wd(this);
        this.sd.reset();
        return this.sd;
      }
      return new Wd(this);
    }
    hR() {
      let a = this.aa >> 1;
      for (; 1 <= a; ) this.qB(a, this.aa), --a;
    }
    qB(a, b) {
      let c = this.N;
      var d = a << 1,
        e = d + 1;
      let f = a;
      this.vg
        ? (d <= b && 0 > c[d].priority - c[a].priority && (f = d),
          d + 1 <= b && 0 > c[d + 1].priority - c[f].priority && (f = e))
        : (d <= b && 0 < c[d].priority - c[a].priority && (f = d),
          d + 1 <= b && 0 < c[d + 1].priority - c[f].priority && (f = e));
      f != a &&
        ((d = c[f]),
        (e = c[a]),
        (c[f] = e),
        (c[a] = d),
        (a = d.g),
        (d.g = e.g),
        (e.g = a),
        this.qB(f, b));
    }
    grow() {
      this.bb = Yg.Hn(this.Oj, this.bb);
      this.Si(this.bb);
    }
    Si(a) {
      a = Array(a + 1);
      Nb.un(this.N, 0, a, this.aa + 1);
      this.N = a;
    }
  }
  rf.i = !0;
  rf.Ib = [eh];
  Object.assign(rf.prototype, { l: rf });
  class Wd {
    constructor(a) {
      this.ye = a;
      this.reset();
    }
    reset() {
      this.xe = 0;
      this.wg = this.ye.aa;
      this.N = Array(this.wg);
      Nb.un(this.ye.N, 1, this.N, this.wg);
      return this;
    }
    eb() {
      return this.xe < this.wg;
    }
    next() {
      return this.N[this.xe++];
    }
  }
  Wd.i = !0;
  Wd.Ib = [id];
  Object.assign(Wd.prototype, { l: Wd });
  class Bi {
    static eM(a, b) {
      a = a.toLowerCase();
      b = b.toLowerCase();
      return a < b ? -1 : a > b ? 1 : 0;
    }
  }
  Bi.i = !0;
  class Yg {
    static Hn(a, b) {
      if (0 < a) b += a;
      else
        switch (a) {
          case -3:
            b <<= 1;
            break;
          case -2:
            b = ((3 * b) >> 1) + 1;
            break;
          case -1:
            a = b + 1;
            b = (a >> 3) + (9 > a ? 3 : 6);
            b += a;
            break;
          case 0:
            throw 5;
        }
      return b;
    }
  }
  Yg.i = !0;
  class Nb {
    static un(a, b, c, d) {
      if (0 < d)
        if (a == c)
          if (0 > b) {
            c = b + d;
            b = 0 + d;
            for (var e = 0; e < d; ) ++e, --c, --b, (a[b] = a[c]);
          } else {
            if (0 < b)
              for (c = b, e = b = 0; e < d; ) ++e, (a[b] = a[c]), ++c, ++b;
          }
        else if (0 == b) for (b = 0; b < d; ) (e = b++), (c[e] = a[e]);
        else if (0 == b) for (b = 0; b < d; ) (e = b++), (c[0 + e] = a[e]);
        else
          for (e = 0; e < d; ) {
            let f = e++;
            c[f] = a[b + f];
          }
    }
    static Hr(a) {
      var b, c;
      null == c && (c = 0);
      null == b && (b = 0);
      let d = b;
      for (b = 0 >= c ? a.length : b + c; d < b; ) a[d++] = null;
    }
    static OL(a, b, c) {
      let d = 0,
        e,
        f = c + 1;
      for (; d < f; )
        (e = d + ((f - d) >> 1)), a[e] < b ? (d = e + 1) : (f = e);
      return d <= c && a[d] == b ? d : ~d;
    }
  }
  Nb.i = !0;
  class M {
    static IN() {
      let a = window.famobi.getOffsets();
      return new gh(
        yb.uf(a, "left"),
        yb.uf(a, "right"),
        yb.uf(a, "top"),
        yb.uf(a, "bottom")
      );
    }
    static bQ(a) {
      window.famobi.onOffsetChange(a);
    }
    static cQ(a) {
      window.famobi_onPauseRequested = a;
    }
    static fQ(a) {
      window.famobi_onResumeRequested = a;
    }
    static gs(a, b) {
      window.famobi.onRequest(a, b);
    }
    static cf(a, b) {
      M.Jl = !0;
      window.famobi.showInterstitialAd(a, function () {
        M.Jl = !1;
        b();
      });
    }
    static kr() {
      return window.famobi.hasRewardedAd();
    }
    static kE(a) {
      M.Jl = !0;
      window.famobi.rewardedAd(function (b) {
        M.Jl = !1;
        a(1 == yb.uf(b, "rewardGranted"));
      });
    }
    static uN() {
      let a = window.famobi.getVolume();
      M.ZL && (a = 1);
      return a;
    }
    static WR(a) {
      if (M.RB != a) {
        M.RB = a;
        try {
          window.famobi.setPreloadProgress(a);
        } catch (b) {}
      }
    }
    static kN() {
      try {
        window.famobi.gameReady();
      } catch (a) {}
    }
    static hasFeature(a) {
      try {
        return window.famobi.hasFeature(a);
      } catch (b) {
        return !1;
      }
    }
    static dt(a, b) {
      M.Ge("EVENT_LEVELSTART", { levelName: null != a ? a : "" }).then(
        function () {
          b();
        },
        function () {
          b();
        }
      );
    }
    static Hx(a, b) {
      M.Ge("EVENT_LEVELRESTART", { levelName: a }).then(
        function () {
          b();
        },
        function () {
          b();
        }
      );
    }
    static QS(a, b, c, d) {
      Promise.all([
        M.Ge("EVENT_LEVELSUCCESS", { levelName: null != c ? c : "" }),
        M.Ge("EVENT_LEVELSCORE", {
          levelName: null != c ? c : "",
          levelScore: a,
        }),
        M.Ge("EVENT_TOTALSCORE", { totalScore: b }),
      ]).then(
        function () {
          d();
        },
        function () {
          d();
        }
      );
    }
    static QE(a, b, c) {
      M.Ge("EVENT_LEVELFAIL", {
        reason: a,
        levelName: null != b ? b : "",
      }).then(
        function () {
          c();
        },
        function () {
          c();
        }
      );
    }
    static PE(a, b, c, d) {
      M.Ge("EVENT_CUSTOM", { eventName: "LEVELEND", result: b, score: a }).then(
        function () {
          c();
        },
        function () {
          d();
        }
      );
    }
    static RS(a) {
      M.Ge("EVENT_LIVESCORE", { liveScore: a });
    }
    static SS(a) {
      M.Ge("EVENT_PAUSE").then(
        function () {
          a();
        },
        function () {
          a();
        }
      );
    }
    static TS(a) {
      M.Ge("EVENT_RESUME").then(
        function () {
          a();
        },
        function () {
          a();
        }
      );
    }
    static RE(a, b) {
      M.Ge("EVENT_VOLUMECHANGE", { bgmVolume: a, sfxVolume: b });
    }
    static nC(a) {
      M.Ge("EVENT_CUSTOM", { eventName: "GA:design", eventId: a });
    }
    static Ge(a, b) {
      try {
        return null != b
          ? window.famobi_analytics.trackEvent(a, b)
          : window.famobi_analytics.trackEvent(a);
      } catch (c) {
        return new Promise(function (d) {
          d(null);
        });
      }
    }
  }
  M.i = !0;
  class gh {
    constructor(a, b, c, d) {
      this.QB = a;
      this.r = b;
      this.t = c;
      this.b = d;
    }
  }
  gh.i = !0;
  Object.assign(gh.prototype, { l: gh });
  class cf {
    constructor(a) {
      this.storage = null;
      this.key = a;
      this.storage = window.famobi.localStorage;
    }
    load(a) {
      let b = this.storage.getItem(this.key);
      null != a && a(b);
      return b;
    }
    save(a, b) {
      this.storage.setItem(this.key, a);
      null != b && b(!0);
    }
  }
  cf.i = !0;
  cf.Ib = [Qd];
  Object.assign(cf.prototype, { l: cf });
  class Qa {
    constructor() {
      this.alpha = 1;
      this.rotation = 0;
      this.Am = this.Bm = 1;
      this.x = this.y = 0;
    }
    update() {}
    L() {}
  }
  Qa.i = !0;
  Object.assign(Qa.prototype, { l: Qa });
  class sf extends Qa {
    constructor(a, b, c) {
      super();
      this.$L = b;
      this.Pi = c;
      this.ul = 0;
      this.isActive = !1;
      this.j = new S();
      a.ma(0).P(this.j.u);
      this.mk = new tf(a.ma(12));
      this.nk = new uf(a.ma(12));
      a = new oa();
      a.vc(0.27999999999999997, 0);
      a.vc(0.4, 0.5);
      a.vc(0.27999999999999997, 1);
      a.wk(0, 0);
      a.wk(360, 1);
      this.Ci = new y(null, r.Jd, k.ZH);
      this.Ci.C();
      this.Ci.Vd(3);
      this.Ci.M(!1);
      this.j.appendChild(this.Ci);
      new Aa(this.Ci).loop(a);
    }
    F() {
      this.j.F();
      this.j = null;
      this.mk.F();
      this.nk.F();
      x.stop(x.Sp);
    }
    LD(a) {
      a &&
        !this.isActive &&
        (this.nk.reset(), (this.ul = 0), (this.state = 1), x.play(x.Sp, !0));
      !a && this.isActive && ((this.state = 0), (this.ul = Ci), x.stop(x.Sp));
      this.mk.Js(a);
      this.nk.Js(a);
      this.Ci.M(a);
      this.isActive = a;
    }
    update(a) {
      if (
        null != this.j &&
        (super.update(a),
        (this.ul = Ia.ak(this.ul, 0 == this.state ? 0 : 0.3, 1, a)),
        this.isActive)
      ) {
        let b = 1 == this.state ? this.ul / 0.3 : this.ul / Ci;
        this.mk.x = this.Pi.x;
        this.mk.y = this.Pi.y;
        this.mk.update(a);
        this.mk.alpha = b;
        this.nk.alpha = 0.5 * b;
        this.nk.iT(this.Pi, this.$L);
        this.nk.update(a);
      }
    }
    L() {
      null != this.j &&
        (super.L(),
        this.isActive &&
          (this.Ci.o(this.Pi.x),
          this.Ci.m(this.Pi.y),
          this.mk.L(),
          this.nk.L()));
    }
  }
  sf.i = !0;
  sf.s = Qa;
  Object.assign(sf.prototype, { l: sf });
  class tf extends Qa {
    constructor(a) {
      super();
      this.j = new S();
      a.P(this.j.u);
      this.rt = 4;
      this.pT = 2;
      this.hF = [];
      a = 0;
      let b = this.rt;
      for (; a < b; ) {
        ++a;
        let c = new y(this.j, r.Jd, k.bI);
        c.C();
        c.Vd(3);
        this.hF.push(c);
      }
      this.gD = 1.25;
      this.zD = 2;
      this.JL = 0.7;
      this.uc = 0;
      this.Js(!1);
    }
    F() {
      this.j.F();
      this.j = null;
    }
    Js(a) {
      this.j.M(a);
    }
    RR(a) {
      this.uc = a > Xd ? 0 : a;
    }
    update(a) {
      this.RR(this.uc + a / this.pT);
    }
    L() {
      if (null != this.j) {
        for (var a = Array(4), b = 0, c = this.rt; b < c; ) {
          var d = b++;
          a[d] = this.uc + (d * Xd) / this.rt;
        }
        b = 0;
        for (c = this.rt; b < c; ) {
          d = b++;
          let e = this.hF[d];
          a[d] > Xd && (a[d] -= Xd);
          let f = this.JL * Math.cos(a[d]) * this.alpha;
          0 != d % 2
            ? e.la((360 * this.zD * a[d]) / Eb)
            : e.la((360 * -this.zD * a[d]) / Eb);
          e.na(this.gD * Math.sin(a[d]) * 0.4);
          e.lb(this.gD * Math.sin(a[d]) * 0.4);
          e.o(this.x);
          e.m(this.y);
          e.W(f);
        }
      }
    }
  }
  tf.i = !0;
  tf.s = Qa;
  Object.assign(tf.prototype, { l: tf });
  class uf extends Qa {
    constructor(a) {
      super();
      this.Ss = new t(0, 0);
      this.uc = this.length = 0;
      this.j = new S();
      a.P(this.j.u);
      this.wb = [];
      for (a = 0; 4 > a; ) {
        ++a;
        let b = new y(this.j, r.Jd, "ray");
        b.Vd(3);
        b.W(0.3);
        b.M(!1);
        this.wb.push(b);
      }
    }
    F() {
      this.j.F();
      this.j = null;
    }
    Js(a) {
      null != this.j && this.j.M(a);
    }
    iT(a, b) {
      b = t.Ha(b, a);
      this.length = b.Rb();
      this.rotation = Math.atan2(b.y, b.x) * nc - 90;
      this.Ss.x = a.x;
      this.Ss.y = a.y;
    }
    reset() {
      this.uc = 0;
    }
    update() {
      this.uc += 0.05;
      let a = 0;
      for (; 4 > a; ) this.wb[a++].JR(this.uc);
    }
    L() {
      if (null != this.j) {
        var a = Math.ceil(this.length / (this.wb[0].X.y / 4));
        4 < a && (a = 4);
        for (var b = 0; 4 > b; ) this.wb[b++].M(!1);
        for (var c = (b = 0); c < a; ) {
          let d = c++,
            e = this.wb[d];
          b += e.X.y;
          e.o(-e.X.x / 2);
          e.m(d * e.X.y);
          e.M(!0);
        }
        this.j.na(0.27999999999999997);
        this.j.lb(this.length / b);
        this.j.o(this.Ss.x);
        this.j.m(this.Ss.y);
        this.j.la(this.rotation);
      }
    }
  }
  uf.i = !0;
  uf.s = Qa;
  Object.assign(uf.prototype, { l: uf });
  class hh {
    constructor(a) {
      this.S = a;
      this.j = new S();
      this.Da = new y(this.j);
      a.ma(0).P(this.j.u);
      this.Uu = !1;
    }
    oS() {
      this.mg = new S();
      this.j.appendChild(this.mg);
      this.Qn = new y(this.mg, r.Qn);
      this.Qn.C();
    }
    hN() {
      this.Uu = !this.Uu;
      this.Qn.Sb().rotation(this.Uu ? 180 : 0, 0.3, ua.Lc(100));
    }
    update() {
      let a = Ba.instance.window.oi(),
        b = this.S.yg,
        c = this.S.xg;
      var d = new Y(0, 0, a.x, a.y).gi(this.S.yg / this.S.xg),
        e = this.S.Bb.Ab.zoom;
      let f = (a.x - (d.B - d.A)) / e;
      d = (a.y - (d.G - d.D)) / e;
      this.Da.Tf(r.ou);
      this.Da.C();
      e = !1;
      1.2 > a.x / a.y
        ? (this.Da.la(0),
          this.Da.na((b + f) / this.Da.X.x),
          this.Da.lb((c + d) / this.Da.X.y))
        : (this.Da.la(90),
          (e = !0),
          this.Da.na((c + d) / this.Da.X.x),
          this.Da.lb((b + f) / this.Da.X.y));
      this.Da.o(b / 2);
      this.Da.m(c / 2);
      null != this.Qn &&
        (e
          ? (this.mg.na(this.Da.ed),
            this.mg.lb(this.Da.Qa),
            this.mg.o(this.Da.wa() + 55 * this.Da.ed),
            this.mg.m(this.Da.Sa() + 10 * this.Da.Qa))
          : (this.mg.na(this.Da.Qa),
            this.mg.lb(this.Da.ed),
            this.mg.o(this.Da.wa() + 10 * this.Da.Qa),
            this.mg.m(this.Da.Sa() - 40 * this.Da.ed)));
    }
  }
  hh.i = !0;
  Object.assign(hh.prototype, { l: hh });
  class Ea {
    constructor() {
      this.Bj = 1;
      this.x = this.y = this.rotation = 0;
      this.visible = !0;
      this.sa = new Y(va, va, wa, wa);
    }
    pe() {
      this.sa.A = this.x + this.ea.A;
      this.sa.D = this.y + this.ea.D;
      this.sa.B = this.x + this.ea.B;
      this.sa.G = this.y + this.ea.G;
    }
    L() {}
    QD(a) {
      this.pb = a;
    }
    update(a) {
      null != this.pb &&
        (this.pb.update(a),
        (this.x = this.pb.g.x),
        (this.y = this.pb.g.y),
        (this.rotation = this.pb.angle));
    }
    JQ(a, b) {
      let c = this.sa,
        d = this.sa;
      return U.ik(a, b, this.sa.A, this.sa.D, c.B - c.A, d.G - d.D);
    }
    aR(a, b, c, d) {
      let e = this.sa.A,
        f = this.sa.D,
        g = this.ea,
        h = this.ea;
      return U.ww(a, b, c, d, e, f, e + (g.B - g.A), f + (h.G - h.D));
    }
    static so(a, b) {
      return Di.test(a.sa, b.sa);
    }
  }
  Ea.i = !0;
  Object.assign(Ea.prototype, { l: Ea });
  class Xb extends Ea {
    constructor() {
      super();
      this.constraint = null;
      this.tg = 0;
      this.IB = !1;
      this.Ec = null;
      this.Kw = 0;
      this.zn = this.ca = null;
    }
  }
  Xb.i = !0;
  Xb.s = Ea;
  Object.assign(Xb.prototype, { l: Xb });
  class Fa extends Ea {
    constructor() {
      super();
      this.TE = -1;
    }
    ex(a) {
      this.TE = a;
    }
    Nl() {
      return -1 != this.TE;
    }
    Hj() {
      return new t(this.x, this.y);
    }
    Hg(a) {
      this.x = a.x;
      this.y = a.y;
    }
    rg() {
      return null;
    }
    Rq() {
      let a = this.rg();
      return (a.x + a.y) / 4;
    }
    ER(a) {
      this.Bj = a.x;
    }
    HC() {}
    Ii(a) {
      this.rotation = null != a.angle ? a.angle : 0;
      let b = a.path;
      if (null != b) {
        let c = Ia.yy;
        "R" == b.charAt(0) &&
          (c = Math.round((3 * Da.parseInt(ta.substr(b, 2, null))) / 2 + 1));
        a = new Yd(c, a.moveSpeed * ra.en, a.rotateSpeed);
        a.angle = this.rotation;
        a.SD(b, this.x, this.y);
        this.QD(a);
        a.start();
      }
    }
  }
  Fa.i = !0;
  Fa.s = Ea;
  Object.assign(Fa.prototype, { l: Fa });
  class vf extends Fa {
    constructor(a) {
      super();
      this.S = a;
      this.Fj = this.time = 0;
      this.j = new S();
      this.j.H(0.4);
      a.ma(11).P(this.j.u);
    }
    ZS() {
      this.j.M(!0);
      this.Uc = new y(this.j, r.Na, k.fI);
      this.Uc.C();
      this.Uc.H(0.4);
      var a = new oa();
      a.vc(0.01, 0);
      a.vc(1, 0.2);
      a.Ka(0, 0);
      a.Ka(1, 0.2);
      new Aa(this.Uc).play(a);
      this.Na = new y(this.j, r.Na, k.hI);
      this.Na.C();
      this.Na.pa().loop(gj);
      this.Na.pa().uw();
      a = new oa();
      a.vc(0, 0);
      a.vc(1, 0.2);
      a.Ka(0, 0);
      a.Ka(1, 0.2);
      new Aa(this.Na).play(a);
      this.kx = new y(this.j, r.Na, k.qI);
      this.kx.C();
      this.kx.H(0.4);
      a = new oa();
      a.vc(0.01, 0);
      a.vc(1, 0.205);
      a.vc(1.5, 0.505);
      a.Ka(0, 0);
      a.Ka(1, 0.05);
      a.Ka(1, 0.305);
      a.Ka(0, 0.505);
      new Aa(this.kx).play(a, function () {});
    }
    Cu() {
      this.time = 0;
      this.fM = !0;
      x.play(x.PJ);
      var a = new oa();
      a.Ka(1, 0);
      a.Ka(1, 0.05);
      a.Ka(0, 0.805);
      a.wk(1, 0);
      a.wk(1, 0.05);
      a.wk(360, 0.805);
      a.vc(1, 0);
      a.vc(1, 0.05);
      a.vc(0.01, 0.805);
      new Aa(this.Na).play(a);
      a = new oa();
      a.Ka(1, 0);
      a.Ka(1, 0.05);
      a.Ka(0, 0.805);
      a.vc(1, 0);
      a.vc(1, 0.05);
      a.vc(0.01, 0.805);
      new Aa(this.Uc).play(a);
      for (a = 0; 6 > a; ) {
        var b = a++,
          c = (b * ei) / 6;
        let d = new y(this.j, r.Na, k.rI);
        d.H(0 == (b & 1) ? 0.5 : 1);
        d.C();
        b = Math.cos(c) * bb.$f * 10;
        c = Math.sin(c) * bb.$f * 10;
        d.Sb().x(b, 1);
        d.Sb().y(c, 1);
        d.Sb().scale(0, 1);
        d.Sb().alpha(0, 1, ua.sw());
        d.Sb().rotation(360, 1);
      }
    }
    F() {
      this.j.F();
      this.j = null;
    }
    update(a) {
      super.update(a);
      if (null != this.j) {
        this.Fj += a;
        for (var b = 3 * Math.sin(3 * this.Fj), c = 0, d = this.j.Jj(); c < d; )
          this.j.nb(c++).m(b);
        this.time += a;
        this.fM && 1 < this.time && this.F();
      }
    }
    rg() {
      let a = this.ea,
        b = this.ea;
      return new t(0.9 * (a.B - a.A), 0.9 * (b.G - b.D));
    }
    Rq() {
      return 8;
    }
    L() {
      null != this.j && (super.L(), this.j.o(this.x), this.j.m(this.y));
    }
  }
  vf.i = !0;
  vf.s = Fa;
  Object.assign(vf.prototype, { l: vf });
  class hb {
    constructor(a) {
      this.U = a;
      this.controller = this.dv();
    }
    fB() {
      return this.controller.St ? this.controller.zg - this.controller.ge : -1;
    }
    Vc(a) {
      return this.controller.Xa == a;
    }
    play(a, b) {
      this.controller.wh = 0;
      this.controller.Aw = null != b ? b - 1 : 0;
      this.controller.play(a);
      return this;
    }
    QC(a) {
      let b = this;
      this.play(a).Be(function () {
        b.U.F();
      });
    }
    loop(a, b) {
      null == b && (b = !1);
      this.controller.wh = b ? 2 : 1;
      this.controller.play(a);
      return this;
    }
    stop() {
      this.controller.stop();
      return this;
    }
    Be(a) {
      this.controller.QR(a);
    }
    uw() {
      this.controller.vd = X.Rn(0, this.fB());
    }
    setTime(a) {
      let b = this.fB();
      this.controller.vd = 0 > a ? 0 : a > b ? b : a;
      return this;
    }
    dv() {
      let a = this.U.u.dN(),
        b = this;
      (null != a && a.Cz) ||
        ((a = new Zd()),
        a.PR(function (c, d) {
          b.U.ip(d);
        }),
        this.U.u.eq(a));
      return a;
    }
    static create(a) {
      function b(v) {
        null != g.Yc(v) &&
          ((v = ta.substr(g.Yc(v), 1, null)),
          (e = -1 != v.indexOf(".") ? parseFloat(v) : 1 / Da.parseInt(v)));
      }
      function c(v) {
        return f + (10 > v ? "000" : 100 > v ? "00" : "0") + v;
      }
      let d = [],
        e = 0.03333333333333333,
        f = "",
        g = null,
        h = 0;
      for (a = a.split(","); h < a.length; ) {
        var m = a[h];
        ++h;
        g = new la("^([a-z][\\w\\/]*)(@[\\d\\.]+)*", "i");
        if (g.match(m)) (f = g.Yc(1)), b(2);
        else if (
          ((g = new la("^(\\d+)-(\\d+)(@[\\d\\.]+)*", "")), g.match(m))
        ) {
          var n = Da.parseInt(g.Yc(1)),
            q = Da.parseInt(g.Yc(2));
          b(3);
          m = [];
          var p = n;
          if (n > q) for (; p >= q; ) m.push(p--);
          else for (; p <= q; ) m.push(p++);
          n = [];
          q = 0;
          for (p = m.length; q < p; ) ++q, n.push(e);
          for (p = q = 0; p < m.length; ) d.push(new Gc(c(m[p++]), n[q++]));
        } else if (
          ((g = new la("^(\\d+)x(\\d+)(@[\\d\\.]+)*", "")), g.match(m))
        )
          for (
            m = Da.parseInt(g.Yc(1)), n = Da.parseInt(g.Yc(2)), b(3), q = 0;
            q < n;

          )
            ++q, d.push(new Gc(c(m), e));
        else
          (g = new la("^\\d+(@[\\d\\.]+)*(@[\\d\\.]+)*", "")),
            g.match(m) && (b(1), d.push(new Gc(c(Da.parseInt(g.Yc(0))), e)));
      }
      return new jd(d, 0);
    }
  }
  hb.i = !0;
  Object.assign(hb.prototype, { l: hb });
  class Gc {
    constructor(a, b) {
      this.data = a;
      this.time = b;
    }
  }
  Gc.i = !0;
  Object.assign(Gc.prototype, { l: Gc });
  class jd {
    constructor(a, b) {
      this.ef = a.length;
      this.data = Array(this.ef);
      let c = 0;
      for (; c < this.ef; ) (this.data[c] = a[c].data), ++c;
      switch (b) {
        case 0:
          this.Va = Array(this.ef + 1);
          this.aj = 0;
          this.sq = a[0].time;
          c = 2;
          for (b = a[1].time; c < this.ef; )
            if (a[c++].time != b) {
              this.sq = 0;
              break;
            }
          for (c = 0; c < this.ef; )
            (this.Va[c] = this.aj), (this.aj += a[c].time), ++c;
          this.Va[c] = this.aj;
          break;
        case 1:
          for (
            this.Va = Array(this.ef),
              this.aj = a[this.ef - 1].time,
              this.sq = null,
              c = 0;
            c < this.ef;

          )
            (this.Va[c] = a[c].time), ++c;
      }
    }
  }
  jd.i = !0;
  Object.assign(jd.prototype, { l: jd });
  class wf extends Qa {
    constructor(a, b) {
      super();
      this.S = a;
      this.I = b;
      this.j = new S();
      a.ma(0).P(this.j.u);
      this.Lc = new y(this.j, r.Jd, k.UH);
      this.Lc.C();
      this.Lc.M(!1);
      this.Lc.la(0);
      this.Lc.H(0.5);
      this.Lc.Vd(4);
      this.uc = this.tq = 0;
      this.Vf = new xf(a, 10);
    }
    F() {
      this.Lc.F();
      this.Vf.F();
      this.j.F();
      this.j = null;
    }
    CA(a, b) {
      0 < this.tq ||
        ((this.tq = 0.064),
        this.Lc.o(a.x),
        this.Lc.m(a.y),
        this.Lc.M(!0),
        this.Lc.W(1),
        this.Lc.la(90 - b),
        (this.uc = 0),
        (this.Vf.x = a.x),
        (this.Vf.y = a.y),
        (this.Vf.angle = -b),
        (a = new t(1, 0)),
        a.rotate((-b * Eb) / 180),
        (b = t.Ob(a, 15)),
        (this.Vf.x -= b.x),
        (this.Vf.y -= b.y),
        this.Vf.Jm(10),
        this.I.RC(),
        x.play(x.Vy));
    }
    update(a) {
      null != this.j &&
        ((this.tq -= a),
        (this.uc += 15 * a),
        this.uc >= Eb && this.Lc.M(!1),
        this.Lc.W(Math.sin(this.uc)),
        this.Vf.update(a));
    }
    L() {
      super.L();
      this.Vf.L();
    }
  }
  wf.i = !0;
  wf.s = Qa;
  Object.assign(wf.prototype, { l: wf });
  class Hb extends Qa {
    constructor(a) {
      super();
      this.y = this.x = 0;
      this.Bm = this.Am = 1;
      this.rotation = 0;
      this.dj = [];
      this.Yh = [];
      this.Ex = a;
      this.ac = [];
      this.active = !1;
      this.Dq = this.duration = 0;
      this.Kb = new t(0, 0);
      this.XC = new t(0, 0);
      this.Ov =
        this.Wc =
        this.ox =
        this.size =
        this.fD =
        this.Zr =
        this.zE =
        this.Vs =
        this.pp =
        this.speed =
        this.pn =
        this.angle =
          0;
      this.Yi = new db(0, 0, 0, 0);
      this.Rs = new db(0, 0, 0, 0);
      this.di = new db(0, 0, 0, 0);
      this.Gq = new db(0, 0, 0, 0);
      this.rs = this.ym = this.sl = this.Eq = 0;
      this.dj = [];
      this.Yh = [];
      this.Ji = 0;
      this.CC = null;
    }
    zz() {
      if (this.ac.length != this.Ex) {
        var a = new ih();
        this.oh(a);
        this.ac.push(a);
      }
    }
    oh(a) {
      a.g.x = this.x + this.XC.x * X.Ac();
      a.g.y = this.y + this.XC.y * X.Ac();
      a.Zi.Pb(a.g);
      var b = (this.angle + this.pn * X.Ac()) * La;
      b = new t(Math.cos(b), Math.sin(b));
      b.multiply(this.speed + this.pp * X.Ac());
      a.dir = b;
      a.Zr = this.Zr + this.fD * X.Ac();
      a.Vs = this.Vs + this.zE * X.Ac();
      a.xr = a.Wc = this.Wc + this.Ov * X.Ac();
      b = new db(
        this.Yi.r + this.Rs.r * X.Ac(),
        this.Yi.ue + this.Rs.ue * X.Ac(),
        this.Yi.b + this.Rs.b * X.Ac(),
        this.Yi.a + this.Rs.a * X.Ac()
      );
      let c = new db(
        this.di.r + this.Gq.r * X.Ac(),
        this.di.ue + this.Gq.ue * X.Ac(),
        this.di.b + this.Gq.b * X.Ac(),
        this.di.a + this.Gq.a * X.Ac()
      );
      a.color = b;
      a.ai.r = (c.r - b.r) / a.Wc;
      a.ai.ue = (c.ue - b.ue) / a.Wc;
      a.ai.b = (c.b - b.b) / a.Wc;
      a.ai.a = (c.a - b.a) / a.Wc;
      a.size = this.size + this.ox * X.Ac();
    }
    update(a) {
      super.update(a);
      if (null == this.CC || 0 != this.ac.length || this.active) {
        if (this.active && 0 != this.Eq) {
          var b = 1 / this.Eq;
          for (this.sl += a; this.ac.length < this.Ex && this.sl > b; )
            this.zz(), (this.sl -= b);
          this.Dq += a;
          -1 != this.duration && this.duration < this.Dq && this.BS();
        }
        for (this.Ji = 0; this.Ji < this.ac.length; )
          (b = this.ac[this.Ji]),
            0 < b.Wc
              ? (this.gT(b, a),
                (b.color.r += b.ai.r * a),
                (b.color.ue += b.ai.ue * a),
                (b.color.b += b.ai.b * a),
                (b.color.a += b.ai.a * a),
                (b.Wc -= a),
                this.Ih(b, this.Ji, a),
                this.Ji++)
              : this.Dg(this.Ji);
      } else this.CC(this);
    }
    gT(a, b) {
      if (0 != a.g.x || 0 != a.g.y) {
        var c = a.g.Zb();
        c.normalize();
      } else c = new t(0, 0);
      let d = c.Zb();
      c.multiply(a.Zr);
      let e = d.x;
      d.x = -d.y;
      d.y = e;
      d.multiply(a.Vs);
      c = t.tb(c, d);
      c.add(this.Kb);
      c.multiply(b);
      a.dir.add(c);
      c.Pb(a.dir);
      c.multiply(b);
      a.g.add(c);
    }
    Ih(a) {
      this.dj[this.Ji] = new jh(a.g.x, a.g.y, a.size);
      this.Yh[this.Ji] = a.color;
    }
    Dg(a) {
      this.ac.splice(a, 1);
    }
    Jm(a) {
      if (0 < this.ac.length) for (; 0 < this.ac.length; ) this.Dg(0);
      this.ac = [];
      let b = 0;
      for (; b < a; ) ++b, this.zz();
      this.active = !0;
    }
    BS() {
      this.active = !1;
      this.Dq = this.duration;
      this.sl = 0;
    }
    L() {}
  }
  Hb.i = !0;
  Hb.s = Qa;
  Object.assign(Hb.prototype, { l: Hb });
  class xf extends Hb {
    constructor(a, b) {
      super(b);
      this.S = a;
      this.wb = [];
      this.angle = 0;
      this.pn = 50;
      this.Wc = 0.5;
      this.Ov = 0.3;
      this.duration = 1.5;
      this.speed = 80;
      this.pp = 10;
    }
    F() {
      let a = 0,
        b = this.wb;
      for (; a < b.length; ) b[a++].F();
    }
    oh(a) {
      super.oh(a);
      a = new y(null, r.Jd, k.$H);
      a.C();
      a.H(0.2 + 0.1 * Math.random());
      this.S.ma(5).P(a.u);
      a.Vd(3);
      this.wb.push(a);
    }
    Ih(a, b, c) {
      a.g.add(t.Ob(a.dir, c));
      super.Ih(a, b, c);
    }
    Dg(a) {
      super.Dg(a);
      let b = this.wb[a];
      this.wb.splice(a, 1);
      b.F();
    }
    L() {
      super.L();
      let a = 0,
        b = this.ac.length;
      for (; a < b; ) {
        var c = a++;
        let d = this.ac[c];
        c = this.wb[c];
        c.o(d.g.x);
        c.m(d.g.y);
        c.la(d.angle);
        c.W(d.Wc / d.xr);
      }
    }
    update(a) {
      super.update(a);
      a = 0;
      let b = this.ac.length;
      for (; a < b; ) {
        let c = this.ac[a++];
        c.angle = 52 + Math.atan2(c.dir.y, c.dir.x) * nc;
      }
    }
  }
  xf.i = !0;
  xf.s = Hb;
  Object.assign(xf.prototype, { l: xf });
  class kd extends Fa {
    constructor(a, b, c, d, e) {
      super();
      this.angle = 0;
      this.Gb = t.sc();
      this.Xb = t.sc();
      this.Tc = t.sc();
      this.qd = t.sc();
      this.Xs = -1;
      this.ro = new t(0, 0);
      this.zk = !1;
      this.j = new S();
      a.ma(5).P(this.j.u);
      this.T = new y(this.j);
      this.T.Tf(r.fd, 1 == d ? k.KG : k.MG);
      this.T.H(0.4);
      this.T.C();
      this.rotation = e;
      this.x = b;
      this.y = c;
      this.w = d;
      this.Yr = new t(b, c);
      a = (0.4 * (1 == d ? 194 : 302)) / 2;
      d = (0.4 * (1 == d ? 127 : 123)) / 2;
      d = this.ea = new Y(0 - a, 0 - d, a, d);
      this.sa = new Y(d.A, d.D, d.B, d.G);
      this.Gd();
    }
    iA() {
      this.Yr.x = this.x;
      this.Yr.y = this.y;
    }
    tQ() {
      let a = 1 == this.w ? hj : ij;
      this.T.pa().play(a);
    }
    Gd() {
      var a = this.ea;
      a = a.B - a.A;
      this.Gb.x = this.x - a / 2;
      this.Xb.x = this.x + a / 2;
      this.Gb.y = this.Xb.y = this.y - Ei / 2;
      this.Tc.x = this.Gb.x;
      this.qd.x = this.Xb.x;
      this.Tc.y = this.qd.y = this.y + Ei / 2;
      this.angle = this.rotation * La;
      this.Gb.Ya(this.angle, this.x, this.y);
      this.Xb.Ya(this.angle, this.x, this.y);
      this.Tc.Ya(this.angle, this.x, this.y);
      this.qd.Ya(this.angle, this.x, this.y);
    }
    update(a) {
      super.update(a);
      null != this.pb && this.Gd();
    }
    L() {
      super.L();
      this.j.o(this.x);
      this.j.m(this.y);
      this.T.H(0.4 * this.Bj);
      this.j.la(this.rotation);
    }
    rg() {
      let a = this.ea,
        b = this.ea;
      return new t(a.B - a.A, b.G - b.D);
    }
    Hg(a) {
      let b = new t(this.x, this.y);
      1e-6 > t.Ha(a, b).ao() ||
        (0.001 <= this.Xs && 0.1 >= this.Xs
          ? ((this.ro = t.Vp(t.Ha(a, b), this.Xs)),
            4e4 < this.ro.ao() && (this.ro = t.Ob(t.Wp(this.ro), 200)))
          : (this.ro = new t(0, 0)),
        (this.Xs = 0),
        (this.Yr = b.Zb()),
        (this.x = a.x),
        (this.y = a.y),
        this.Gd());
    }
    HC() {
      this.iA();
    }
  }
  kd.i = !0;
  kd.s = Fa;
  Object.assign(kd.prototype, { l: kd });
  class $d extends Qa {
    constructor(a, b, c, d, e) {
      super();
      this.j = new S();
      a.ma(0).P(this.j.u);
      this.j.Vd(3);
      this.j.M(!1);
      this.frames = [];
      a = [];
      for (var f = 0; f < d; ) ++f, a.push(0);
      this.Va = a;
      for (a = 0; a < d; ) {
        f = a++;
        let g = this.pM(b, c);
        this.j.appendChild(g);
        this.frames.push(g);
        this.Va[f] = (1 / d) * f;
      }
      this.delay = 0.3;
      this.vO = e;
    }
    F() {
      this.j.F();
      this.j = null;
    }
    pM(a, b) {
      let c = new S(),
        d = a / 2,
        e = b / 2;
      var f = new y(c, r.Jd, k.XH);
      f.H(0.25);
      var g = new y(c, r.Jd, k.YH);
      g.H(0.25);
      g.o(a - g.ka());
      var h = new y(c, r.Jd, k.WH);
      h.H(0.25);
      h.o(a - h.ka());
      h.m(b - h.ja());
      h = new y(c, r.Jd, k.VH);
      h.H(0.25);
      h.m(b - h.ja());
      let m = new y(c, r.Jd, k.Hy);
      m.o(f.wa() + f.ka());
      m.na((g.wa() - f.ka()) / m.X.x);
      m.lb(0.25);
      g = new y(c, r.Jd, k.Hy);
      g.na(m.Qa);
      g.lb(0.25);
      g.o(f.wa() + f.ka());
      g.m(b - g.ja());
      b = new y(c, r.Jd, k.Iy);
      b.m(f.ja());
      b.na(0.25);
      b.lb((h.Sa() - f.ja()) / b.X.y);
      f = new y(c, r.Jd, k.Iy);
      f.na(0.25);
      f.lb(b.ed);
      f.o(a - f.ka());
      f.m(b.Sa());
      for (a = 0; 8 > a; )
        (f = a++),
          (b = c.nb(f)),
          b.o(b.wa() - d),
          (f = c.nb(f)),
          f.m(f.Sa() - e);
      c.o(d);
      c.m(e);
      return c;
    }
    update(a) {
      this.delay -= a;
      if (!(0 < this.delay) && null != this.j) {
        super.update(a);
        this.j.M(!0);
        for (var b = 0, c = this.frames.length; b < c; ) {
          var d = b++;
          this.Va[d] += a;
          1 < this.Va[d] && (this.Va[d] -= this.Va[d]);
          let e = this.frames[d];
          d = this.Va[d];
          e.W(Ua(d, 0, 1, 1, 0));
          e.H(Ua(d, 0, 1, 0.89, 1.1));
          this.vO ? e.H(Ua(d, 0, 1, 0.89, 1.1)) : e.H(Ua(d, 0, 1, 1.1, 0.89));
        }
      }
    }
  }
  $d.i = !0;
  $d.s = Qa;
  Object.assign($d.prototype, { l: $d });
  class yf extends Ea {
    constructor(a, b) {
      super();
      this.S = a;
      this.$d = b;
      this.Xe = [];
      this.bm = [];
    }
    sO(a, b, c, d) {
      function e(g, h) {
        return new Gc(new t(g.x, g.y), h);
      }
      this.j = new S();
      this.S.ma(5).P(this.j.u);
      this.ko = new y(null, r.vf, k.bH);
      this.ko.H(0.4);
      this.ko.C();
      this.S.ma(0).P(this.ko.u);
      this.x = a.x;
      this.y = a.y;
      this.kC = b;
      this.Z = c;
      this.BL = d;
      this.elapsedTime = 0;
      this.isActive = !1;
      b = new t(0, 0);
      a = this.kC * La;
      c = new t(0, -27.200000000000003);
      d = new t(0, -33.6);
      let f = new t(0, -28);
      this.Xe[0] = t.tb(b, new t(0, -4.4).rotate(a));
      this.Xe[1] = t.tb(b, c.rotate(a));
      this.Xe[2] = t.tb(b, d.rotate(a));
      this.Xe[3] = t.tb(b, f.rotate(a));
      c = new t(0, -43.2);
      d = new t(0, -9.200000000000001);
      this.bm[0] = t.tb(b, new t(0, -36.4).rotate(a));
      this.bm[1] = t.tb(b, c.rotate(a));
      this.bm[2] = t.tb(b, d.rotate(a));
      b = new t(0, 0);
      d = new t(0, 5.400000000000001);
      c = new t(0, -4.799999999999997);
      d.rotate(a);
      c.rotate(a);
      a = t.tb(b, d);
      b = t.tb(b, c);
      null == fi &&
        ((c = new oa()),
        c.setScale(0.4, 0.4, 0, 100),
        c.Ah(0, 0, 0, 100),
        c.setScale(0.45999999999999996, 0.34, 0.05),
        c.Ah(a.x, a.y, 0.05),
        c.setScale(0.34, 0.45999999999999996, 0.1),
        c.Ah(b.x, b.y, 0.1),
        c.setScale(0.4, 0.4, 0.15),
        c.Ah(0, 0, 0.15),
        (fi = c));
      this.Dz = new jd(
        [
          e(this.Xe[0], 0, 100),
          e(this.Xe[1], 0.05, 100),
          e(this.Xe[2], 0.1, 100),
          e(this.Xe[3], 0.15),
        ],
        1
      );
      this.KL = new jd(
        [
          e(this.bm[0], 0, 100),
          e(this.bm[1], 0.05, 100),
          e(this.bm[2], 0.1, 100),
        ],
        1
      );
    }
    $B(a, b) {
      this.j.appendChild(a);
      this.wf = a;
      this.da = b;
      this.Sq().M(!1);
      null != this.da
        ? ((this.da.g.x = this.x + this.Xe[3].x),
          (this.da.g.y = this.y + this.Xe[3].y),
          (this.da.ha.x = this.da.g.x),
          (this.da.ha.y = this.da.g.y),
          this.mu(this.Dz),
          this.Ij().pa().play(Fi).Be(P(this, this.Mr)))
        : this.Ij().pa().play(Gi).Be(P(this, this.Mr));
      a.C();
      x.play(x.EJ);
    }
    bC() {
      this.elapsedTime = 0;
      this.isActive = !1;
      this.Sq().M(!1);
      null != this.da
        ? (this.Ij().pa().play(Hi).Be(P(this, this.Mr)), this.mu(this.KL))
        : this.Ij().pa().play(Ii).Be(P(this, this.Mr));
    }
    Ij() {
      return this.wf.nb(0);
    }
    Sq() {
      return this.wf.nb(1);
    }
    mu(a) {
      this.mq = new zf(this, this.da);
      this.mq.play(a);
    }
    su(a) {
      return t.nd(this.x, this.y, a.g.x, a.g.y) < this.Z;
    }
    xu(a) {
      this.da = a;
      a.On = !0;
      a.g.x = this.x + this.Xe[3].x;
      a.g.y = this.y + this.Xe[3].y;
      a.ha.x = a.g.x;
      a.ha.y = a.g.y;
      a.xd = new t(0, 0);
      a.sb = new t(0, 0);
      this.Ij().Fb(k.gH);
      this.Jo = new Aa(this.Ij());
      this.Jo.play(fi);
      this.mu(this.Dz);
    }
    cR() {
      this.da.On = !1;
      this.da = null;
      this.bC();
      x.play(x.FJ);
    }
    xi() {
      return null != this.da;
    }
    update(a) {
      super.update(a);
      null != this.mq && this.mq.Hh(a);
      this.isActive &&
        ((this.elapsedTime += a),
        this.elapsedTime >= this.BL &&
          (null == this.Jo || !this.Jo.Vc()) &&
          this.bC());
    }
    L() {
      super.L();
      this.j.o(this.x);
      this.j.m(this.y);
      this.ko.o(this.x);
      this.ko.m(this.y);
      null != this.wf && this.wf.la(this.kC);
    }
    gk(a, b) {
      a = t.nd(this.x, this.y, a, b);
      b = null != this.Jo && this.Jo.Vc();
      return a < this.Z ? !b : !1;
    }
    Mr(a) {
      switch (a) {
        case Gi:
          this.elapsedTime = 0;
          this.isActive = !0;
          X.rm() &&
            (this.Ij().Fb(k.eH), this.Sq().M(!0), this.Sq().pa().play(jj));
          break;
        case Fi:
          this.elapsedTime = 0;
          this.isActive = !0;
          break;
        case Ii:
        case Hi:
          this.wf.remove(), (this.wf = null), this.$d.lN();
      }
    }
  }
  yf.i = !0;
  yf.s = Ea;
  Object.assign(yf.prototype, { l: yf });
  class ld {
    constructor() {
      this.controllers = null;
      this.oM = !0;
    }
    F() {
      let a = this.controllers,
        b;
      for (; null != a; ) (b = a.next), a.F(), (a = b);
    }
    eq(a) {
      null != this.controllers && (a.next = this.controllers);
      this.controllers = a;
      a.object = this;
    }
    detach(a) {
      if (this.controllers == a) this.controllers = this.controllers.next;
      else {
        let b = this.controllers;
        for (; b.next != a; ) b = b.next;
        b.next = a.next;
      }
      a.next = null;
      a.object = null;
    }
    dN() {
      let a = this.controllers;
      for (; null != a; ) {
        if (303 == a.type) return a;
        a = a.next;
      }
      return null;
    }
    Hh(a) {
      if (null == this.controllers || !this.oM) return !1;
      let b = !1,
        c = this.controllers,
        d;
      for (; null != c; ) (d = c.next), c.update(a) && (b = !0), (c = d);
      return b;
    }
  }
  ld.i = !0;
  Object.assign(ld.prototype, { l: ld });
  class zf extends ld {
    constructor(a, b) {
      super();
      this.c = new md();
      this.vf = a;
      this.I = b;
    }
    play(a) {
      let b = a.data[0];
      this.set(b.x, b.y);
      this.c.play(a);
      this.c.Ro = P(this, this.RP);
      this.c.fk = P(this, this.fk);
      this.eq(this.c);
    }
    fk() {
      this.F();
      this.vf.mq = null;
    }
    RP(a, b, c) {
      let d = a.x;
      a = a.y;
      this.set(d + (b.x - d) * c, a + (b.y - a) * c);
    }
    set(a, b) {
      this.I.g.x = this.vf.x + a;
      this.I.g.y = this.vf.y + b;
      this.I.ha.x = this.I.g.x;
      this.I.ha.y = this.I.g.y;
    }
  }
  zf.i = !0;
  zf.s = ld;
  Object.assign(zf.prototype, { l: zf });
  class kh {
    constructor(a) {
      this.S = a;
      this.ae = null;
      this.uq = -1;
      this.jC = !1;
      this.zl = [];
    }
    update(a) {
      let b = 0,
        c = this.zl;
      for (; b < c.length; ) c[b++].update(a);
    }
    L() {
      let a = 0,
        b = this.zl;
      for (; a < b.length; ) b[a++].L();
    }
    su(a) {
      return null == this.ae ? !1 : this.ae.isActive ? this.ae.su(a) : !1;
    }
    xu(a) {
      null != this.ae && this.ae.xu(a);
    }
    xi() {
      return null == this.ae ? !1 : this.ae.xi();
    }
    oa(a, b) {
      this.zl.push(a);
      if (1 == b) {
        this.wf = new S();
        var c = new y(this.wf, r.vf, k.fH);
        c.H(0.4);
        c.C();
        c = new y(this.wf, r.vf, k.cH);
        c.H(0.4);
        c.C();
        a.$B(this.wf, a.da);
        this.ae = a;
        this.uq = b;
      }
    }
    gk(a, b, c) {
      return null == this.ae
        ? !1
        : this.ae.isActive && this.ae.xi() && this.ae.gk(a, b, c)
        ? (this.ae.cR(), !0)
        : !1;
    }
    lN() {
      if (!this.jC) {
        var a = this,
          b = Ma.find(this.zl, function (e) {
            return e.index == a.uq;
          }),
          c = this.uq + 1;
        c == this.zl.length + 1 && (c = 1);
        var d = Ma.find(this.zl, function (e) {
          return e.index == c;
        });
        d.$B(this.wf, b.da);
        b.da = null;
        this.uq = c;
        this.ae = d;
      }
    }
    QO() {
      this.jC = !0;
    }
  }
  kh.i = !0;
  Object.assign(kh.prototype, { l: kh });
  class kb extends Fa {
    constructor(a) {
      super();
      this.Vr = !1;
      this.j = new S();
      this.Im = new y(null, r.ca, X.rm() ? k.TG : k.UG);
      this.Im.C();
      this.Im.H(0.4);
      this.j.appendChild(this.Im);
      this.ca = new y(null, r.ca, k.Dy);
      this.ca.H(0.4);
      this.ca.C();
      this.j.appendChild(this.ca);
      a.ma(5).P(this.j.u);
      a = kb.$x.w / 2;
      let b = kb.$x.J / 2;
      a = this.ea = new Y(0 - a, 0 - b, a, b);
      this.sa = new Y(a.A, a.D, a.B, a.G);
    }
    pop() {
      this.ca.M(!1);
      this.Vr = !0;
    }
    update(a) {
      super.update(a);
      this.pe();
    }
    L() {
      this.Im.o(this.x);
      this.Im.m(this.y);
      this.ca.o(this.x);
      this.ca.m(this.y);
      this.ca.H(0.4 * this.Bj);
      (this.iF || this.Nl()) && this.Im.M(!1);
    }
    rg() {
      let a = r.ca.hc.xf(k.Dy).Nd;
      return new t(0.4 * a.w, 0.4 * a.J);
    }
  }
  kb.i = !0;
  kb.s = Fa;
  Object.assign(kb.prototype, { l: kb });
  class Af {
    constructor() {
      this.mD = 1;
      this.za = [];
    }
    yz(a, b) {
      this.za.splice(b, 0, a);
    }
    xz(a) {
      this.za.push(a);
    }
    gR(a) {
      this.za.splice(a, 1);
    }
  }
  Af.i = !0;
  Object.assign(Af.prototype, { l: Af });
  class ae extends Af {
    constructor(a, b, c, d, e, f, g, h) {
      super();
      this.KM = new F(0, 0, 0, 1);
      this.LM = new F(0, 0, 0, 1);
      this.OM = new F(0, 0, 0, 1);
      this.MM = new F(0, 0, 0, 1);
      this.PM = new F(0, 0, 0, 1);
      this.effect = new be();
      this.effect.Z = 2;
      this.va = new Va();
      this.va.Qf(this.effect);
      a.P(this.va);
      this.xw = 0;
      this.mD = 30;
      this.yc = -1;
      this.$g = 0;
      this.rB = !1;
      this.Ic = 42;
      this.Hc = null != b ? b : new Ib();
      null != e ? (this.Mb = e) : ((this.Mb = new Ib()), this.Mb.Lg(1));
      this.Hc.Lg(0.02);
      this.Hc.g.x = c;
      this.Hc.g.y = d;
      this.Mb.g.x = f;
      this.Mb.g.y = g;
      this.xz(this.Hc);
      this.xz(this.Mb);
      this.Mb.Wk(this.Hc, this.Ic, 0);
      a = t.Ha(this.Mb.g, this.Hc.g);
      a.rA(Math.round(h / this.Ic + 2));
      this.dc(h, a);
      this.vl = !1;
      this.ph = -1;
      this.HM = this.wv = this.Fn = !1;
      this.Nu = [];
      this.Vz = 3;
    }
    F() {
      this.va.F();
      this.Nu = this.Mb = this.Hc = this.va = null;
    }
    Rb() {
      let a = 0,
        b = this.za.length;
      if (0 < b) {
        let c = this.za[0].g,
          d = 1;
        for (; d < b; ) {
          let e = this.za[d++];
          a += c.sf(e.g);
          c = e.g;
        }
      }
      return a;
    }
    dc(a, b) {
      null == b && (b = t.sc());
      let c = this.za[this.za.length - 2],
        d = this.Mb.xh(c);
      for (var e; 0 < a; )
        a >= this.Ic
          ? ((c = this.za[this.za.length - 2]),
            (e = new Ib()),
            e.Lg(0.02),
            (e.g = t.tb(c.g, b)),
            this.yz(e, this.za.length - 1),
            this.Mb.fA(c, e, d),
            e.Wk(c, this.Ic, 0),
            (a -= this.Ic))
          : ((e = a + d),
            e > this.Ic
              ? ((a = this.Ic), (d = e - this.Ic))
              : ((c = this.za[this.za.length - 2]), this.Mb.oq(c, e), (a = 0)));
    }
    L() {
      this.effect.FR();
      let a = this.za.length;
      var b;
      if (-1 == this.yc) {
        var c = Array(a);
        for (b = 0; b < a; ) {
          var d = b++;
          c[d] = this.za[d].g;
        }
        this.Mu(c);
      } else {
        d = [];
        let e = [],
          f = !1,
          g = 0;
        for (; g < a; ) {
          let h = g++;
          c = this.za[h];
          let m = !0;
          0 < h && ((b = this.za[h - 1]), c.cO(b) || (m = !1));
          -1 != c.th.x || m || (f = !0);
          f ? e.push(c.g) : (d[h] = c.g);
        }
        0 < d.length && this.Mu(d);
        0 < e.length && !this.wv && this.Mu(e);
      }
    }
    Mu(a) {
      var b = a.length;
      let c = this.Nu;
      if (!(2 > b)) {
        var d = -1 == this.yc || this.vl ? 1 : this.$g / 1.95;
        if (!(0 >= d)) {
          1 < d && (d = 1);
          var e = a[0],
            f = a[1],
            g = e.x - f.x;
          f = e.y - f.y;
          var h = Math.sqrt(g * g + f * f);
          this.xw =
            h <= this.Ic + 0.3
              ? 0
              : h <= this.Ic + 1
              ? 1
              : h < this.Ic + 4
              ? 2
              : 3;
          if (!(3 > b)) {
            var m = this.KM,
              n = this.LM;
            g = this.OM;
            var q = this.MM;
            f = this.PM;
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
            this.rB &&
              ((n.x *= 3),
              (n.y *= 3),
              (n.z *= 3),
              (q.x *= 3),
              (q.y *= 3),
              (q.z *= 3),
              (g.x *= 3),
              (g.y *= 3),
              (g.z *= 3),
              (f.x *= 3),
              (f.y *= 3),
              (f.z *= 3),
              1 < n.x && (n.x = 1),
              1 < n.y && (n.y = 1),
              1 < n.z && (n.z = 1),
              1 < q.x && (q.x = 1),
              1 < q.y && (q.y = 1),
              1 < q.z && (q.z = 1),
              1 < g.x && (g.x = 1),
              1 < g.y && (g.y = 1),
              1 < g.z && (g.z = 1),
              1 < f.x && (f.x = 1),
              1 < f.y && (f.y = 1),
              1 < f.z && (f.z = 1));
            h > this.Ic + 7 &&
              !this.HM &&
              ((h = (h / this.Ic) * 2),
              (g.x *= h),
              (f.x *= h),
              1 < g.x && (g.x = 1),
              1 < f.x && (f.x = 1));
            h = !1;
            b = (b - 1) * this.Vz;
            var p = b - 1;
            m = (n.x - g.x) / p;
            var v = (n.y - g.y) / p;
            n = (n.z - g.z) / p;
            var u = (q.x - f.x) / p,
              A = (q.y - f.y) / p;
            q = (q.z - f.z) / p;
            p = this.Vz - 1;
            var C = p - 1,
              B = c[0];
            null == B ? (c[0] = e.Zb()) : ((B.x = e.x), (B.y = e.y));
            for (e = 1; e <= b; ) {
              B = e / b;
              var K = c[e];
              null == K && (K = c[e] = new t(0, 0));
              t.GD(a, B, K);
              B = (e - 1) % p;
              if (B == C || e == b) {
                var E = this.vl
                  ? 16777215
                  : h
                  ? ((((255 * g.z) | 0) & 255) << 16) |
                    ((((255 * g.y) | 0) & 255) << 8) |
                    (((255 * g.x) | 0) & 255)
                  : ((((255 * f.z) | 0) & 255) << 16) |
                    ((((255 * f.y) | 0) & 255) << 8) |
                    (((255 * f.x) | 0) & 255);
                K = [];
                let aa = [];
                this.effect.points.push(K);
                this.effect.Yh.push(aa);
                this.effect.on.push(d);
                let Z = e - B - 1,
                  V = c[Z++];
                K.push(new F(V.x, V.y, 0, 1));
                E = new F(
                  (E & 255) / 255,
                  ((E >> 8) & 255) / 255,
                  ((E >> 16) & 255) / 255,
                  1
                );
                for (aa.push(E); Z <= e; )
                  (V = c[Z]), K.push(new F(V.x, V.y, 0, 1)), aa.push(E), ++Z;
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
    pR(a) {
      for (var b = this.za.length, c = this.Mb.xh(this.za[b - 2]), d; 0 < a; )
        if (a >= this.Ic) {
          var e = b - 2;
          d = this.za[e];
          this.Mb.fA(d, this.za[b - 3], c);
          this.gR(e);
          --b;
          a -= this.Ic;
        } else
          (e = c - a),
            1 > e
              ? ((a = this.Ic), (c = this.Ic + e + 1))
              : ((d = this.za[b - 2]), this.Mb.oq(d, e), (a = 0));
      a = (b - 1) * (this.Ic + 3);
      b = this.Mb.hg;
      c = b.length;
      for (d = 0; d < c; ) (e = b[d++]), 1 == e.type && (e.xh = a);
    }
    update(a) {
      0 < this.$g &&
        ((this.$g = Ia.ak(this.$g, 0, 1, a)),
        1.95 > this.$g && this.vl && this.yw(this.yc));
      let b = this.za.length;
      for (var c, d = 0; d < b; )
        (c = this.za[d++]), c != this.Mb && c.update(a);
      a = 0;
      for (c = this.mD; a < c; ) for (++a, d = 0; d < b; ) this.za[d++].us();
    }
    yw(a) {
      this.vl = !1;
      var b = this.za[a],
        c = this.za[a + 1];
      if (null == c) b.pD();
      else {
        var d = c.hg;
        let e = d.length,
          f = 0;
        for (; f < e; ) {
          let g = f++;
          if (d[g].zj == b) {
            c.eR(g);
            d = new Ib();
            d.Lg(1e-5);
            d.g.Pb(c.g);
            d.ha.Pb(c.ha);
            this.yz(d, a + 1);
            d.Wk(b, this.Ic, 0);
            break;
          }
        }
      }
      a = 0;
      for (b = this.za.length; a < b; )
        (c = this.za[a]), c != this.Mb && c.Lg(1e-5), ++a;
    }
    zs(a) {
      this.yc = a;
      this.$g = 2;
      this.vl = !0;
      this.rB = !1;
    }
  }
  ae.i = !0;
  ae.s = Af;
  Object.assign(ae.prototype, { l: ae });
  class lh {
    constructor() {
      this.Kb = new F(0.5, 0.5, 0, 1);
      this.g = new F(0, 0, 0, 1);
      this.Jk = new Y(va, va, wa, wa);
      this.Ab = new Rd();
    }
    GO(a, b) {
      var c = Ba.instance.window,
        d = c.V.viewport,
        e = c.Fc.x,
        f = c.Fc.y;
      c = (d.x * e) | 0;
      let g = (d.y * f) | 0;
      e = (d.w * e) | 0;
      d = (d.J * f) | 0;
      let h = this.Ab.lk,
        m = 1 / (h.m41 * a + h.m42 * b + 0 * h.m43 + h.m44),
        n = e / 2;
      f = d / 2;
      let q = (h.m11 * a + h.m12 * b + 0 * h.m13 + h.m14) * m;
      a = (h.m21 * a + h.m22 * b + 0 * h.m23 + h.m24) * m;
      b = n * q + 0 * a + (n + c);
      a = 0 * q + -f * a + (f + g);
      return 0 > b + 400 || 0 > a + 400 || b - 200 > c + e || a - 200 > g + d
        ? !1
        : !0;
    }
    DN(a, b) {
      let c = Ba.instance.window.eo();
      a = this.Ab.jF(new F(a, b, 0, 1), c);
      return Math.min(a.y, c.y + c.J - a.y);
    }
    EN(a, b) {
      let c = Ba.instance.window.eo();
      a = this.Ab.jF(new F(a, b, 0, 1), c);
      return Math.min(a.x, c.x + c.w - a.x);
    }
    update() {
      var a = Ba.instance.window.oi(),
        b = this.Jk,
        c = this.Jk;
      c = Math.min(a.x / (b.B - b.A), a.y / (c.G - c.D));
      this.Ab.Lb(new F(a.x, a.y, 0, 1));
      this.Ab.hS(c);
      this.Ab.Dn();
      var d = (b = this.Jk);
      d = new Y(0, 0, a.x, a.y).gi((b.B - b.A) / (d.G - d.D));
      b = (a.x - (d.B - d.A)) / c / 2;
      a = (a.y - (d.G - d.D)) / c / 2;
      c = this.Ab;
      d = c.position;
      d.x = this.g.x + (b + (-b - b) * this.Kb.x);
      d.y = this.g.y + (a + (-a - a) * this.Kb.y);
      c.Lr();
    }
  }
  lh.i = !0;
  Object.assign(lh.prototype, { l: lh });
  class zb extends Xb {
    constructor(a) {
      super();
      this.S = a;
      var b = zb.Lp.w,
        c = b / 2;
      let d = zb.Lp.J / 2;
      c = this.ea = new Y(0 - c, 0 - d, c, d);
      this.sa = new Y(c.A, c.D, c.B, c.G);
      this.j = new S();
      a.ma(9).P(this.j.u);
      a = new y(null, r.I, k.VG);
      a.C();
      this.j.appendChild(a);
      b /= a.X.x;
      b *= a.X.x / zb.Yx.w;
      a.H(b);
      a = new y(null, r.I, k.WG);
      a.C();
      a.H(b);
      this.j.appendChild(a);
      a = new y(null, r.I, k.XG);
      a.C();
      a.H(b);
      this.j.appendChild(a);
      a = new y(null, r.I, Ji.data[0]);
      a.C();
      a.H(b);
      this.j.appendChild(a);
      this.j.H(0.71);
      this.oe = !0;
    }
    uQ() {
      if (null != this.j) {
        var a = this.j.nb(3);
        a.M(!0);
        a.pa()
          .play(Ji)
          .Be(function () {
            a.M(!1);
          });
      }
    }
    RC() {
      if (null != this.j) {
        var a = this.j.nb(3);
        a.M(!0);
        a.W(1);
        a.pa().play(kj);
        a.Sb().alpha(0, 0.2, null, null, function () {
          a.M(!1);
        });
      }
    }
    F() {
      this.j.F();
      this.j = null;
    }
    update(a) {
      super.update(a);
      this.sa.A = this.x + this.ea.A;
      this.sa.D = this.y + this.ea.D;
      this.sa.B = this.x + this.ea.B;
      this.sa.G = this.y + this.ea.G;
    }
    L() {
      super.L();
      null != this.j &&
        (this.oe && (this.j.o(this.x), this.j.m(this.y)),
        this.j.la(this.rotation),
        this.j.M(this.visible));
    }
  }
  zb.i = !0;
  zb.s = Xb;
  Object.assign(zb.prototype, { l: zb });
  class Bf extends Hb {
    constructor(a, b) {
      super(b);
      this.S = a;
      this.duration = 2;
      this.Kb.x = 0;
      this.Kb.y = 500;
      this.angle = -90;
      this.pn = 50;
      this.speed = 150;
      this.pp = 70;
      this.zE = this.fD = 1;
      this.Wc = 2;
      this.size = 1;
      this.Eq = 100;
      this.ym = 0;
      this.rs = 600;
      this.wb = [];
    }
    oh(a) {
      super.oh(a);
      a.xq = La * (this.ym + this.rs * X.Ac());
      a = new y(null, r.I, k.gj("", X.vh(3, 7)));
      a.C();
      a.H(0.4 * this.size);
      this.S.ma(5).P(a.u);
      this.wb.push(a);
    }
    Ih(a, b, c) {
      a.angle += a.xq * c;
      super.Ih(a, b, c);
    }
    Dg(a) {
      super.Dg(a);
      this.wb.splice(a, 1);
    }
    L() {
      super.L();
      let a = 0,
        b = this.ac.length;
      for (; a < b; ) {
        var c = a++;
        let d = this.ac[c];
        c = this.wb[c];
        c.la(d.angle * nc);
        c.o(d.g.x);
        c.m(d.g.y);
      }
    }
  }
  Bf.i = !0;
  Bf.s = Hb;
  Object.assign(Bf.prototype, { l: Bf });
  class oc {
    constructor(a) {
      this.S = a;
      this.T = new y();
      this.T.M(!1);
    }
    o(a) {
      this.T.o(a);
      null != this.Cb && this.Cb.j.o(a);
      return a;
    }
    m(a) {
      this.T.m(a);
      null != this.Cb && this.Cb.j.m(a);
    }
    mh() {
      this.T.remove();
      null != this.Cb && this.Cb.j.remove();
    }
    show() {
      this.T.Tf(r.ca, k.OG);
      this.T.C();
      this.T.H(0.4);
      null == this.T.u.parent && this.S.ma(9).P(this.T.u);
      this.T.pa().loop(oc.mF);
      this.T.M(!0);
    }
    pS() {
      null != this.Cb &&
        null == this.Cb.j.node.parent &&
        this.S.ma(9).P(this.Cb.j.u);
    }
  }
  oc.i = !0;
  Object.assign(oc.prototype, { l: oc });
  class Cf extends Qa {
    constructor() {
      super();
      this.j = new S();
      this.j.W(0.75);
      this.fc = [];
      this.Za = [];
      let a = 0;
      for (; 4 > a; ) {
        ++a;
        let b = new y(null, r.Na, "star_effect");
        b.C();
        b.Vd(3);
        b.M(!1);
        this.Za.push(b);
        this.j.appendChild(b);
      }
      this.j.H(0.4);
      this.wC = 0;
      x.play(x.Kt, !0);
      this.Ek = new oa();
      this.Ek.vc(1, 0);
      this.Ek.vc(1, 0);
      this.Ek.vc(0, 2);
      this.Ek.Ka(0, 0);
      this.Ek.Ka(1, 1);
      this.Ek.Ka(0, 2);
      this.time = 1;
    }
    update(a) {
      this.time += a;
      if (4 > this.wC && 0.5 < this.time) {
        this.time = 0;
        var b = this.Za[this.wC++];
        b.M(!0);
        new Aa(b).loop(this.Ek);
      }
      for (b = 0; 4 > b; ) {
        let c = this.Za[b++];
        c.la(c.Yd + 90 * a);
      }
    }
    L() {
      this.j.o(this.x);
      this.j.m(this.y);
    }
    F() {
      x.stop(x.Kt);
      this.j.F();
    }
  }
  Cf.i = !0;
  Cf.s = Qa;
  Object.assign(Cf.prototype, { l: Cf });
  class pc extends Xb {
    constructor(a, b) {
      super();
      this.S = a;
      this.T = new y(null, r.I, b);
      this.T.C();
      this.T.H(0.284);
      a.ma(9).P(this.T.u);
      a = pc.by.w / 2;
      b = pc.by.J / 2;
      a = this.ea = new Y(0 - a, 0 - b, a, b);
      this.sa = new Y(a.A, a.D, a.B, a.G);
    }
    update(a) {
      super.update(a);
      this.sa.A = this.x + this.ea.A;
      this.sa.D = this.y + this.ea.D;
      this.sa.B = this.x + this.ea.B;
      this.sa.G = this.y + this.ea.G;
    }
    L() {
      super.L();
      null != this.T &&
        (this.T.o(this.x), this.T.m(this.y), this.T.la(this.rotation));
    }
  }
  pc.i = !0;
  pc.s = Xb;
  Object.assign(pc.prototype, { l: pc });
  class Ia {
    constructor(a, b, c) {
      null == c && (c = 0);
      null == b && (b = 0);
      this.ym = c;
      this.path = [];
      if (0 < a) for (this.lC = [], c = 0; c < a; ) this.lC[c++] = b;
      this.g = new t(0, 0);
      this.angle = 0;
      this.reverse = this.paused = !1;
      this.Wf = this.km = 0;
    }
    Yp(a) {
      this.path.push(a);
    }
    start() {
      0 < this.path.length &&
        (this.g.Pb(this.path[0]), (this.Wf = 1), this.Zz());
    }
    Zz() {
      this.offset = t.Ha(this.path[this.Wf], this.g);
      this.offset.normalize();
      this.offset.multiply(this.lC[this.Wf]);
    }
    update(a) {
      if (!this.paused) {
        if (0 < this.path.length) {
          let b = this.path[this.Wf],
            c = !1;
          if (this.g.ZM(b)) c = !0;
          else {
            let d = a;
            0 != this.km && ((d = a + this.km), (this.km = 0));
            this.g.add(t.Ob(this.offset, d));
            (Jb.DD(this.offset.x, b.x - this.g.x) &&
              Jb.DD(this.offset.y, b.y - this.g.y)) ||
              ((this.km = t.Ha(this.g, b).Rb()),
              (this.km /= this.offset.Rb()),
              this.g.Pb(b),
              (c = !0));
          }
          c &&
            (this.reverse
              ? (this.Wf--, 0 > this.Wf && (this.Wf = this.path.length - 1))
              : (this.Wf++, this.Wf >= this.path.length && (this.Wf = 0)),
            this.Zz());
        }
        0 != this.ym && (this.angle += this.ym * a);
      }
    }
    static ak(a, b, c, d) {
      b != a &&
        (b > a
          ? ((a += c * d), a > b && (a = b))
          : ((a -= c * d), a < b && (a = b)));
      return a;
    }
    static bk(a, b, c, d) {
      let e = !1;
      b != a &&
        (b > a
          ? ((a += c * d), a > b && (a = b))
          : ((a -= c * d), a < b && (a = b)),
        b == a && (e = !0));
      return new mh(a, e);
    }
  }
  Ia.i = !0;
  Object.assign(Ia.prototype, { l: Ia });
  class Yd extends Ia {
    constructor(a, b, c) {
      super(a, b, c);
    }
    SD(a, b, c) {
      if ("R" == a.charAt(0)) {
        var d = Da.parseInt(ta.substr(a, 2, null)),
          e = Math.round((3 * d) / 2),
          f = (2 * Math.PI) / e;
        let g = 0;
        d *= ra.en;
        "C" != a.charAt(1) && (f = -f);
        for (a = 0; a < e; )
          ++a,
            this.Yp(new t(b + d * Math.cos(g), c + d * Math.sin(g))),
            (g += f);
      } else
        for (
          this.Yp(new t(b, c)),
            "," == a.charAt(a.length - 1) &&
              (a = ta.substr(a, 0, a.length - 1)),
            d = a.split(","),
            e = d.length,
            f = 0;
          f < e;

        )
          this.Yp(
            new t(
              b + parseFloat(d[f]) * ra.en,
              c + parseFloat(d[f + 1]) * ra.en
            )
          ),
            (f += 2);
    }
  }
  Yd.i = !0;
  Yd.s = Ia;
  Object.assign(Yd.prototype, { l: Yd });
  class Df extends da {
    constructor(a, b) {
      super();
      this.f = a;
      this.t = b;
    }
    update(a) {
      this.t -= a;
      0 < this.t || (this.f(), (this.f = null), this.ra());
    }
  }
  Df.i = !0;
  Df.s = da;
  Object.assign(Df.prototype, { l: Df });
  class Ef extends Qa {
    constructor(a) {
      super();
      this.U = new y();
      this.U.setColor(
        new F(0.17647058823529413, 0.17647058823529413, 0.17647058823529413, 1),
        a.yg,
        a.xg
      );
      this.U.W(0);
      let b = new oa();
      b.Ka(0, 0);
      b.Ka(0, 0.3);
      b.Ka(0.2, 0.6);
      new Aa(this.U).play(b);
      a.ma(0).P(this.U.u);
    }
    F() {
      this.U.F();
    }
  }
  Ef.i = !0;
  Ef.s = Qa;
  Object.assign(Ef.prototype, { l: Ef });
  class nh {
    constructor(a, b, c, d, e) {
      this.start = a;
      this.end = b;
      this.color = e;
    }
  }
  nh.i = !0;
  Object.assign(nh.prototype, { l: nh });
  class Hc extends Ea {
    constructor() {
      super();
      new U(-1, -1, -1, -1);
      this.VL = this.state = 0;
    }
    xk(a) {
      this.state = a;
    }
    nw(a, b) {
      return 0 == this.state && this.Ll(a, b) ? (this.xk(1), !0) : !1;
    }
    kQ(a, b) {
      return 1 == this.state && (this.xk(0), this.Ll(a, b))
        ? (null != this.kw && this.kw(this.VL), !0)
        : !1;
    }
    Ll(a, b) {
      return oh.wx(a, b, this.x, this.y, 20);
    }
  }
  Hc.i = !0;
  Hc.s = Ea;
  Object.assign(Hc.prototype, { l: Hc });
  class Ff extends Ea {
    constructor(a) {
      super();
      this.S = a;
      this.Gv = this.tr = !1;
      this.bq = this.zq = 0;
    }
    tO(a, b, c, d, e, f, g) {
      this.QL = d;
      this.$N = c;
      this.YC = b | 1;
      this.$q = 1;
      this.jB = e;
      this.kB = f;
      this.iB = g;
      this.x = a.x;
      this.y = a.y;
      this.time = X.fi();
      this.yf = new S();
      this.yf.o(this.x);
      this.yf.m(this.y);
      this.S.ma(5).P(this.yf.u);
      this.Io = new Gf(this.S, 7);
      this.Io.x = this.x;
      this.Io.y = this.y;
      this.rv = new y(this.yf, r.ce, k.hH);
      this.rv.H(0.4);
      this.rv.C();
      this.sv = new y(this.yf, r.ce, k.iH);
      this.sv.C();
      this.sv.H(0.4);
      this.fd = this.cc = this.ca = null;
      this.kg = !0;
    }
    update(a) {
      super.update(a);
      if (this.tr) {
        this.zq += a;
        var b = Math.min(1, this.zq / 0.16);
        this.yf.W(1 - b);
        1 == b && (this.yf.M(!1), (this.tr = !1));
      }
      this.Gv &&
        ((this.bq += a),
        (b = Math.min(1, this.bq / 0.36)),
        this.yf.W(b),
        1 == b && (this.Gv = !1));
      this.time += a;
      this.rv.m(Ua(Math.sin(5 * this.time), -1, 1, 0, -5));
      this.sv.m(Ua(Math.sin(5 * this.time + 0.05), -1, 1, 0, -3));
      null == this.cc ||
        null == this.cc.kb ||
        -1 == this.cc.kb.yc ||
        this.cc.Kl() ||
        ((this.kg = !0), this.Ri(1));
      this.Io.update(a);
    }
    L() {
      super.L();
      this.Io.L();
      this.yf.o(this.x);
      this.yf.o(this.x);
    }
    Ri(a) {
      if (0 != (a & this.YC)) {
        1 == this.$q && ((this.tr = !0), (this.zq = 0));
        this.$q = a;
        null != this.ca &&
          (this.ca.Kl() ? this.oD() : (this.ca.Co(), (this.ca.Vr = !0)));
        null != this.cc &&
          ((a = this.cc.kb),
          null != a && (a.$g = 0.36),
          this.cc.Kl() ? this.qD() : this.cc.Co());
        null != this.fd && (this.fd.Kl() ? this.nD() : this.fd.Co());
        switch (this.$q) {
          case 1:
            this.Gv = !0;
            this.tr = !1;
            this.yf.M(!0);
            this.bq = 0;
            break;
          case 2:
            this.ca = new Hf(this);
            this.ca.x = this.x;
            this.ca.y = this.y;
            this.ca.Bo();
            this.jB.push(this.ca);
            break;
          case 4:
            this.cc = new sb(this);
            this.cc.x = this.x;
            this.cc.y = this.y;
            this.cc.Yf = !1;
            this.cc.mc = null;
            this.cc.setRadius(this.$N);
            this.cc.Bo();
            this.cc.gu();
            this.kB.push(this.cc);
            break;
          case 8:
            (this.fd = new eb(this, this.x, this.y, 1, this.QL)),
              this.fd.gu(),
              this.fd.Bo(),
              this.iB.push(this.fd);
        }
        this.Io.Jm(7);
        x.play(x.vJ);
      }
    }
    nR() {
      let a = this.$q;
      do (a <<= 1), 32 == a && (a = 2);
      while (0 == (a & this.YC));
      this.Ri(a);
    }
    nw(a, b) {
      a -= this.x;
      b -= this.y;
      return this.kg && 40 > Math.sqrt(a * a + b * b) ? (this.nR(), !0) : !1;
    }
    oD() {
      null != this.ca &&
        (ta.remove(this.jB, this.ca), this.ca.F(), (this.ca = null));
    }
    qD() {
      null != this.cc &&
        (this.cc.F(), ta.remove(this.kB, this.cc), (this.cc = null));
    }
    nD() {
      null != this.fd &&
        (ta.remove(this.iB, this.fd), this.fd.F(), (this.fd = null));
    }
  }
  Ff.i = !0;
  Ff.s = Ea;
  Object.assign(Ff.prototype, { l: Ff });
  class eb extends kd {
    constructor(a, b, c, d, e) {
      super(a.S, b, c, d, e);
      this.ce = a;
      this.alpha = 1;
      this.state = 0;
    }
    Bo() {
      1 != this.state && ((this.state = 1), (this.time = 0));
    }
    Co() {
      -1 != this.state && ((this.state = -1), (this.time = 0));
    }
    Kl() {
      return 0 > this.state;
    }
    gu() {
      function a(c, d) {
        c = new y(d, r.ce, k.gj(k.Pp, c));
        c.C();
        return c;
      }
      this.Bu = new S(null, this.j);
      this.Bu.ys();
      this.jA = new S(null, this.j);
      this.fc = [];
      null == eb.tn &&
        (eb.tn = oa.parse(
          "0,s.27<x-34.<y7.33<,.35,s.22>x-35.>y6.33>,.7,s.16<x-36.<y5.33<,1.04,s.22>x-35.>y6.33>,1.4,s.27x-34.y7.33"
        ));
      var b = new Aa(a(2, this.Bu));
      b.loop(eb.tn);
      this.fc.push(b);
      null == eb.sn &&
        (eb.sn = oa.parse(
          "0,s.36<x32.9<y6.61<,.39,s.32>x31.9>y5.61>,.78,s.27<x30.9<y4.61<,1.17,s.32>x31.9>y5.61>,1.56,s.36x32.9y6.61"
        ));
      b = new Aa(a(2, this.Bu));
      b.loop(eb.sn);
      this.fc.push(b);
      null == eb.Wh &&
        (eb.Wh = oa.parse(
          "0,s.44<x23<y26<,.45,s.4>x22>y25>,.9,s.36<x21<y24<,1.35,s.4>x22>y25>,1.8,s.44x23y26"
        ));
      b = new Aa(a(3, this.jA));
      b.loop(eb.Wh);
      this.fc.push(b);
      null == eb.Vh &&
        (eb.Vh = oa.parse(
          "0,s.44<x-23<y28<,.5,s.4>x-22>y27>,1,s.36<x-21<y26<,1.5,s.4>x-22>y27>,2,s.44x-23y28"
        ));
      b = new Aa(a(4, this.jA));
      b.loop(eb.Vh);
      this.fc.push(b);
    }
    F() {
      this.j.F();
      this.T = this.j = null;
    }
    update(a) {
      super.update(a);
      if (0 < this.state) {
        this.time += a;
        let b = Math.min(1, this.time / 0.36);
        this.alpha = b;
        1 == b && (this.state = 0);
      }
      0 > this.state &&
        ((this.time += a),
        (a = Math.min(1, this.time / 0.16)),
        (this.alpha = 1 - a),
        1 == a && ((this.state = 0), this.ce.nD()));
    }
    L() {
      super.L();
      this.j.W(this.alpha);
    }
  }
  eb.i = !0;
  eb.s = kd;
  Object.assign(eb.prototype, { l: eb });
  class Hf extends kb {
    constructor(a) {
      super(a.S);
      this.ce = a;
      this.alpha = 1;
      this.state = 0;
      this.Cb = new Na();
      this.j.appendChild(this.Cb.j);
    }
    F() {
      this.j.F();
      this.j = null;
      this.Cb.F();
      this.Cb = null;
    }
    Kl() {
      return 0 > this.state;
    }
    Bo() {
      1 != this.state && ((this.state = 1), (this.time = 0));
    }
    Co() {
      -1 != this.state && ((this.state = -1), (this.time = 0));
    }
    pop() {
      super.pop();
      this.Cb.j.M(!1);
    }
    update(a) {
      super.update(a);
      if (0 < this.state) {
        this.time += a;
        let b = Math.min(1, this.time / 0.36);
        this.alpha = b;
        1 == b && (this.state = 0);
      }
      0 > this.state &&
        ((this.time += a),
        (a = Math.min(1, this.time / 0.16)),
        (this.alpha = 1 - a),
        1 == a && ((this.state = 0), this.ce.oD()));
    }
    L() {
      super.L();
      null != this.Cb && (this.Cb.j.o(this.x), this.Cb.j.m(this.y));
      this.j.W(this.alpha);
    }
  }
  Hf.i = !0;
  Hf.s = kb;
  Object.assign(Hf.prototype, { l: Hf });
  class Na {
    constructor() {
      function a(d) {
        d = new y(b.j, r.ce, k.gj(k.Pp, d));
        d.C();
        return d;
      }
      this.j = new S();
      this.fc = [];
      let b = this;
      null == Na.sn &&
        (Na.sn = oa.parse(
          "0,s.32<x34<y9<,.48,s.31>x33>y8>,.96,s.30<x34<y7<,1.44,s.31>x34>y9>,1.92,s.32x33y8,2.4,x34y9"
        ));
      var c = new Aa(a(0));
      c.loop(Na.sn);
      this.fc.push(c);
      null == Na.tn &&
        (Na.tn = oa.parse(
          "-100,s.38>,-99.,s.4<,-99.,s.38>,-98.,s.37,0,sx.37sy.4x26<y23<,.4,x25>y22>,.8,x24<y21<,1.20,x25>y22>,1.6,x26y23"
        ));
      c = new Aa(a(1));
      c.loop(Na.tn);
      this.fc.push(c);
      null == Na.Jz &&
        (Na.Jz = oa.parse(
          "0,s.13<x-34<y4<,.43,s.14>x-35>y3>,.86,s.16<x-36<y2<,1.29,s.14>x-35>y3>,1.72,s.13x-34y4"
        ));
      c = new Aa(a(1));
      c.loop(Na.Jz);
      this.fc.push(c);
      null == Na.Wh &&
        (Na.Wh = oa.parse(
          "0,s.24<x-30<y17<,.42,s.22>x-29>y16>,.84,s.21<x-28<y15<,1.26,s.22>x-29>y16>,1.68,s.24x-30y17"
        ));
      c = new Aa(a(0));
      c.loop(Na.Wh);
      this.fc.push(c);
      null == Na.Vh &&
        (Na.Vh = oa.parse(
          "0,s.37<x-2<y31<,.47,s.38>x-3>y32>,.94,s.4<x-4<y33<,1.41,s.38>x-3>y32>,1.88,s.37x-2y31"
        ));
      c = a(4);
      c.la(350);
      c = new Aa(c);
      c.loop(Na.Vh);
      this.fc.push(c);
    }
    F() {
      this.j.F();
      this.j = null;
    }
  }
  Na.i = !0;
  Object.assign(Na.prototype, { l: Na });
  class nd extends Fa {
    constructor(a) {
      super();
      this.S = a;
      this.kb = null;
      this.Yf = !1;
      this.Qm = -1;
      this.wr = t.sc();
      this.Gf = 0;
      this.bw = !1;
      this.Lo = 0;
      this.lh = this.Rd = null;
      this.Yl = this.am = this.cm = 0;
      this.Fh = this.ve = !1;
      this.mc = null;
      this.Dk = 0;
      this.jo = this.Tx = this.Ks = !1;
      this.$r = 0.8;
      this.Z = 0;
    }
    ON(a, b, c) {
      a = t.Ha(a, c);
      return (t.Ha(b, c).em() - a.em()) * nc;
    }
    bO(a, b) {
      this.wr.x = a;
      this.wr.y = b;
    }
    aO(a) {
      x.play(x.ZJ);
      let b = this.ON(this.wr, a, new t(this.x, this.y));
      180 < b ? (b -= 360) : -180 > b && (b += 360);
      var c = this.st;
      c.la(c.Yd + b);
      c = this.Vx;
      c.la(c.Yd + b);
      c = this.Ux;
      c.la(c.Yd + b);
      b =
        0 < b
          ? Math.min(Math.max(1, b), 2.25)
          : Math.max(Math.min(-1, b), -2.25);
      null != this.kb &&
        (0 < b
          ? 660 > this.kb.Rb() && this.kb.dc(b)
          : 0 != b && 3 < this.kb.za.length && this.kb.pR(-b),
        (this.Tx = !0));
      this.wr.Pb(a);
    }
    update(a) {
      super.update(a);
      this.jo &&
        ((this.$r -= 1.5 * a), 0 >= this.$r && ((this.Z = -1), (this.jo = !1)));
      if (null != this.Kd) {
        let b = t.Ha(this.pb.path[this.pb.Wf], this.pb.g),
          c = 0;
        15 < Math.abs(b.x) && (c = 0 < b.x ? 10 : -10);
        this.Kd.la(Ia.ak(this.Kd.Yd, c, 60, a));
      }
      this.Yf &&
        this.Tx &&
        null != this.kb &&
        ((a = 0.7 * this.kb.Rb()),
        0 == a
          ? this.st.H(0.001)
          : this.st.H(0.4 * Math.max(0, Math.min(1.2, 1 - a / 784))));
    }
    jT(a) {
      this.ve &&
        this.Ks &&
        ((this.Ks = !1), (this.Fh = !0), x.play(x.KJ), this.mc.start());
      if (this.ve && this.Fh) {
        0 != this.mc.state && (this.Dk += 46.800000000000004 * a);
        a = 0;
        let c = !1;
        if (null != this.kb) {
          var b = this.kb.Nu;
          let d = b.length,
            e = 0;
          for (; e < d; ) {
            let f = e++,
              g = b[f],
              h = b[f + 1],
              m = Math.max(28, g.sf(h));
            if (this.Dk >= a && (this.Dk < a + m || f > d - 3)) {
              b = t.Ha(h, g);
              b.multiply((this.Dk - a) / m);
              this.mc.U.o(g.x + b.x);
              this.mc.U.m(g.y + b.y);
              f > d - 3 && (c = !0);
              0 != this.mc.state && this.mc.U.la(b.em() * nc + 270);
              break;
            } else a += m;
          }
        }
        c && (this.Dk = -1);
      }
    }
    JM() {
      0 < this.Gf
        ? (this.back.M(!1), this.Rd.M(!0))
        : (this.back.o(this.x),
          this.back.m(this.y),
          this.back.M(!0),
          null != this.Rd && this.Rd.M(!1));
      (-1 != this.Z || this.jo) &&
        this.QM(this.x, this.y, -1 != this.Z ? this.Z : this.aD);
    }
    QM(a, b, c) {
      this.Xh.color.x = 0.2;
      this.Xh.color.y = 0.5;
      this.Xh.color.z = 0.9;
      this.Xh.color.w = this.$r;
      let d = this.Xh.C;
      d.x = a;
      d.y = b;
      this.Xh.Z = c;
    }
    L() {
      this.Yf && (this.Ux.M(-1 != this.Qm), this.Vx.M(-1 == this.Qm));
      null != this.Kd && (this.Kd.o(this.x), this.Kd.m(this.y));
      null != this.kb && this.kb.L();
      0 >= this.Gf
        ? (this.Ba.o(this.x), this.Ba.m(this.y), this.Ba.M(!0))
        : (this.Ba.M(!1),
          -1 != this.cm ? this.lh.Fb(k.tH) : this.lh.Fb(k.Fy),
          this.lh.o(this.x),
          this.lh.m(this.y));
    }
    XD(a) {
      this.kb = a;
      this.aD = this.Z;
      this.Z = -1;
      this.ve && (this.Ks = !0);
    }
    setRadius(a) {
      this.aD = this.Z;
      this.Z = a;
      var b = this.S.ma(3),
        c = this.S.ma(8);
      -1 == a || -2 == a
        ? ((a = X.rm() ? [k.mH, k.nH] : [k.rH, k.sH]),
          (this.back = new y(null, r.nh, a[0])),
          this.back.H(0.4),
          this.back.C(),
          (this.Ba = new y(null, r.nh, a[1])),
          this.Ba.C(),
          this.Ba.H(0.4),
          b.P(this.back.u),
          c.P(this.Ba.u))
        : ((this.back = new y(null, r.nh, k.kH)),
          this.back.C(),
          this.back.H(0.4),
          (this.Ba = new y(null, r.nh, k.lH)),
          this.Ba.C(),
          this.Ba.H(0.5),
          b.P(this.back.u),
          c.P(this.Ba.u),
          (this.jo = !1),
          (this.Xh = new ce()),
          (this.qq = new Va()),
          this.qq.Qf(this.Xh),
          c.P(this.qq));
      let d = this;
      this.Yf &&
        ((b = function (e) {
          e = new y(null, r.nh, e);
          e.C();
          e.o(d.x);
          e.m(d.y);
          e.H(0.4);
          return e;
        }),
        (c = b(k.vH)),
        this.S.ma(3).P(c.u),
        (this.st = b(k.wH)),
        this.S.ma(8).P(this.st.u),
        (this.Ux = b(k.uH)),
        this.S.ma(8).P(this.Ux.u),
        (this.Vx = b(k.xH)),
        this.S.ma(8).P(this.Vx.u),
        (this.Tx = !0));
    }
    NR(a, b, c) {
      this.Gf = a;
      this.bw = b;
      this.Lo = c;
      0 < this.Gf &&
        ((this.Rd = new S()),
        (a = new y(this.Rd, r.nh, k.oH)),
        a.o(-63),
        new y(this.Rd, r.nh, k.qH).o(this.Gf / 0.4 - 13),
        (b = new y(this.Rd, r.nh, k.pH)),
        b.o(-63 + a.ka()),
        b.jx(this.Gf / 0.4 - 13),
        this.Rd.H(0.4),
        this.Rd.C(),
        this.S.ma(5).P(this.Rd.u),
        (this.lh = new y(null, r.nh, k.Fy)),
        this.lh.C(),
        this.lh.H(0.4),
        this.S.ma(8).P(this.lh.u),
        this.bw
          ? ((this.am = this.y - this.Lo),
            (this.Yl = this.y + (this.Gf - this.Lo)),
            (a = (this.am + this.Yl) / 2),
            this.Rd.o(this.x),
            this.Rd.m(a),
            this.Rd.la(90),
            this.lh.la(90))
          : ((this.am = this.x - this.Lo),
            (this.Yl = this.x + (this.Gf - this.Lo)),
            this.Rd.o((this.am + this.Yl) / 2),
            this.Rd.m(this.y)));
      this.cm = -1;
    }
    BR() {
      this.Kd = new S();
      this.Kd.H(0.3076923076923077);
      var a = new y(this.Kd, r.Kd, k.yG);
      a.C();
      a.o(a.wa() - 6);
      a.m(a.Sa() - 54);
      this.S.ma(8).P(this.Kd.u);
      a = new y(this.Kd, r.Kd, k.zG);
      a.C();
      a.o(-6);
      a.m(-54);
      a.pa().loop(lj);
      a.pa().uw();
    }
    cS(a) {
      this.ve = a;
      this.Fh = this.Ks = !1;
      a &&
        ((this.mc = new If()),
        this.mc.U.o(this.x),
        this.mc.U.m(this.y),
        this.S.oa(this.mc),
        this.S.ma(10).P(this.mc.U.u));
    }
    Ku() {
      this.kb = null;
    }
  }
  nd.i = !0;
  nd.s = Fa;
  Object.assign(nd.prototype, { l: nd });
  class sb extends nd {
    constructor(a) {
      super(a.S);
      this.ce = a;
      this.fc = [];
    }
    Kl() {
      return 0 > this.state;
    }
    Bo() {
      1 != this.state && ((this.state = 1), (this.time = 0));
    }
    Co() {
      -1 != this.state && ((this.state = -1), (this.time = 0));
    }
    gu() {
      function a(d) {
        d = new y(b.Cb, r.ce, k.gj(k.Pp, d));
        d.C();
        return d;
      }
      this.Cb = new S();
      this.S.ma(5).P(this.Cb.u);
      let b = this;
      null == sb.Sz &&
        (sb.Sz = oa.parse(
          "0,s.17<x-26<y3<,.65,s.18>x-25>y2>,1.3,s.2<x-24<y1<,1.95,s.18>x-25>y2>,2.6,s.17x-26y3"
        ));
      var c = new Aa(a(1));
      c.loop(sb.Sz);
      this.fc.push(c);
      null == sb.Wh &&
        (sb.Wh = oa.parse(
          "0,s.36<x23<y14<,.45,s.32>x22>y13>,.9,s.27<x21<y12<,1.35,s.32>x22>y13>,1.8,s.36x23y14"
        ));
      c = new Aa(a(2));
      c.loop(sb.Wh);
      this.fc.push(c);
      null == sb.Vh &&
        (sb.Vh = oa.parse(
          "0,s.44<x-3<y25<,.5,s.4>x-2>y24>,1,s.36<x-1<y23<,1.5,s.4>x-2>y24>,2,s.44x-3y25"
        ));
      c = new Aa(a(4));
      c.loop(sb.Vh);
      this.fc.push(c);
    }
    F() {
      null != this.kb && (this.kb.yw(0), this.kb.F());
      this.Ku();
      this.Cb.F();
      this.Cb = null;
      this.back.F();
      this.Ba.F();
      this.qq.F();
      this.Ba = this.back = this.S = this.qq = null;
    }
    update(a) {
      super.update(a);
      if (0 < this.state) {
        this.time += a;
        let b = Math.min(1, this.time / 0.36);
        this.alpha = b;
        1 == b && (this.state = 0);
      }
      0 > this.state &&
        -2 != this.state &&
        ((this.time += a),
        (a = Math.min(1, this.time / 0.16)),
        (this.alpha = 1 - a),
        1 == a && ((this.state = -2), this.ce.qD()));
    }
    L() {
      super.L();
      this.Cb.o(this.x);
      this.Cb.m(this.y);
      this.Cb.W(this.alpha);
      this.back.W(this.alpha);
      this.Ba.W(this.alpha);
      this.Xh.color.w = this.alpha;
    }
  }
  sb.i = !0;
  sb.s = nd;
  Object.assign(sb.prototype, { l: sb });
  class Gf extends Hb {
    constructor(a, b) {
      super(b);
      this.S = a;
      this.wb = [];
      this.size = 0.6;
      this.ox = 0.2;
      this.angle = 360 * X.fi();
      this.pn = 15;
      this.rs = 30;
      this.Wc = 0.8;
      this.Ov = 0.3;
      this.duration = 1.5;
      this.speed = 140;
      this.pp = 35;
    }
    Jm(a) {
      super.Jm(a);
    }
    oh(a) {
      super.oh(a);
      this.angle += 360 / this.Ex;
      let b = this.size + X.Ac() * this.ox,
        c = k.gj(k.Pp, X.vh(0, 2)),
        d = r.ce.hc.xf(c).ec;
      a.width = d.x * b;
      a.height = d.y * b;
      a.xq = this.ym + this.rs * X.Ac();
      a = new y(null, r.ce, c);
      a.C();
      this.S.ma(5).P(a.u);
      this.wb.push(a);
    }
    Ih(a, b, c) {
      a.angle += a.xq * c;
      super.Ih(a, b, c);
    }
    Dg(a) {
      super.Dg(a);
      let b = this.wb[a];
      this.wb.splice(a, 1);
      b.F();
    }
    L() {
      super.L();
      let a = 0,
        b = this.ac.length;
      for (; a < b; ) {
        var c = a++;
        let d = this.ac[c];
        c = this.wb[c];
        c.la(d.angle);
        c.H((d.width / c.X.x) * 0.4);
        c.o(d.g.x);
        c.m(d.g.y);
        c.W(d.alpha);
      }
    }
    update(a) {
      super.update(a);
      a = 0;
      let b = this.ac.length;
      for (; a < b; ) {
        let c = this.ac[a++];
        0 < c.Wc &&
          (c.Wc < 0.7 * c.xr && (c.alpha = c.Wc / (0.7 * c.xr)),
          (c.dir.x *= 0.9),
          (c.dir.y *= 0.9),
          (c.width *= 1.015),
          (c.height *= 1.015));
      }
    }
  }
  Gf.i = !0;
  Gf.s = Hb;
  Object.assign(Gf.prototype, { l: Gf });
  class Jf extends Hc {
    constructor(a, b, c) {
      super();
      this.x = b;
      this.y = c;
      this.U = new y(null, r.Kb, k.Ey);
      this.U.H(0.4);
      this.U.C();
      this.U.o(b);
      this.U.m(c);
      this.Z = 40;
      a.ma(5).P(this.U.u);
      this.Jv = !1;
    }
    Ll(a, b) {
      return oh.wx(a, b, this.x, this.y, this.Z);
    }
    toggle() {
      this.Jv = !this.Jv;
      this.U.Fb(this.Jv ? k.jH : k.Ey);
    }
    L() {
      super.L();
      this.U.o(this.x);
      this.U.m(this.y);
    }
  }
  Jf.i = !0;
  Jf.s = Hc;
  Object.assign(Jf.prototype, { l: Jf });
  class rb extends Fa {
    constructor(a) {
      super();
      this.S = a;
      this.active = !1;
      this.ep = this.Cn = this.Zo = this.Un = 0;
      this.Su = null;
    }
    qO(a, b) {
      rb.Ch = null;
      this.x = a;
      this.y = b;
      this.Uj = 0;
      null == gi &&
        ((a = gi = new oa()),
        a.setScale(0.5599999999999999, 0.4, 0, 100),
        a.Ka(0.7, 0),
        a.setScale(0.42000000000000004, 0.52, 0.5),
        a.Ka(1, 0.5));
      this.j = new S();
      this.S.ma(5).P(this.j.u);
      this.Dj = new y(this.j, r.zi, k.yH);
      this.Dj.C();
      this.Dj.W(0);
      this.Su = new Aa(this.Dj);
      this.nr = new y(this.j, r.zi, k.AH);
      this.nr.C();
      this.nr.H(0.4);
      this.Uk = new y(this.j, r.zi, k.zH);
      this.Uk.C();
      this.Uk.H(0.4);
      this.Uk.W(0);
      this.Uk.m(1);
      this.I = new y(this.j, r.zi, [k.BH, k.CH, k.DH, k.EH, k.FH][z.le]);
      this.I.C();
      this.I.H(0.4);
      this.I.W(0);
      null == hi &&
        ((a = hi = new oa()),
        a.Ka(0, 0),
        a.Ka(1, 0.2),
        a.Zp(0.4, 0.4, 0),
        a.Zp(0.4, 0.32000000000000006, 0.07),
        a.Zp(0.34, 0.42000000000000004, 0.05),
        a.Zp(0.4, 0.4, 0.05),
        a.fu(-4, 0),
        a.fu(0, 0.1),
        a.fu(-1, 0.05),
        (a = Ki = new oa()),
        a.mn(0.4, 0.35, -100),
        a.mn(0.37200000000000005, 0.35, 100),
        a.mn(0.34800000000000003, 0.35, -100),
        a.mn(0.37200000000000005, 0.35, 100),
        a.mn(0.4, 0),
        (a = Li = new oa()),
        a.Ka(1, 0),
        a.Ka(0.6, 0.06),
        a.Ka(0, 0.1),
        a.setScale(0.4, 0.4, 0),
        a.setScale(0.45999999999999996, 0.32000000000000006, 0.06),
        a.setScale(0.4, 0.4, 0.1),
        a.Ah(0, 0, 0, 100),
        a.Ah(0, -4, 0.06, -100),
        a.Ah(0, 4, 0.1));
      this.uu = new Aa(this.I);
    }
    update(a) {
      this.ha = new t(this.x, this.y);
      super.update(a);
      null != rb.Ch &&
        ((rb.Ch.g = new t(this.x, this.y)),
        (rb.Ch.ha = new t(this.x, this.y)),
        1 != this.Uj && (this.Uj = 1));
      0 < this.Zo &&
        ((this.Zo -= a),
        0 > this.Zo &&
          ((rb.Ch.On = !1),
          (rb.Ch.g = new t(this.x, this.y)),
          (rb.Ch.ha = this.ha.Zb()),
          (rb.Ch = null)));
      0 < this.Un && ((this.Un -= a), 0 >= this.Un && this.Su.loop(gi, !0));
      0 < this.Cn && ((this.Cn -= a), 0 >= this.Cn && this.uu.loop(Ki));
      0 < this.ep && ((this.ep -= a), 0 >= this.ep && (this.Uj = 0));
    }
    L() {
      super.L();
      this.j.o(this.x);
      this.j.m(this.y);
    }
    gk(a, b) {
      return 1 == this.Uj && 35 > t.nd(a, b, this.x, this.y) && null != rb.Ch
        ? (this.uO(), !0)
        : !1;
    }
    dA(a) {
      x.play(x.yJ);
      rb.Ch = a;
      a.On = !0;
      a.g = a.ha = new t(this.x, this.y);
      a = this.S.Pl;
      let b = 0;
      for (; b < a.length; ) {
        let c = a[b];
        ++b;
        c.Uj = 1;
        c.nr.Sb().alpha(0, 0.3);
        c.Uk.Sb().alpha(1, 0.3);
        c.uu.play(hi);
        c.Dj.na(0.5599999999999999);
        c.Dj.lb(0.4);
        c.Dj.W(0.7);
        c.Un = 0.4 * Math.random();
        c.Cn = 0.2;
      }
    }
    uO() {
      x.play(x.zJ);
      let a = this.S.Pl,
        b = 0;
      for (; b < a.length; ) {
        let c = a[b];
        ++b;
        c.nr.Sb().alpha(1, 0.3);
        c.Uk.Sb().alpha(0, 0.3);
        c.uu.play(Li);
        c.Su.stop();
        c.Dj.W(0);
        c.ep = 0.5;
        c.Uj = 0;
      }
      this.Zo = 0.01;
    }
  }
  rb.i = !0;
  rb.s = Fa;
  Object.assign(rb.prototype, { l: rb });
  class Kf extends Xb {
    constructor(a, b) {
      super();
      this.YB = b;
      this.tg = 0;
      var c = zb.Lp.w / 2;
      let d = zb.Lp.J / 2;
      c = this.ea = new Y(0 - c, 0 - d, c, d);
      this.sa = new Y(c.A, c.D, c.B, c.G);
      this.j = new S();
      this.j.H(0.4);
      a.ma(9).P(this.j.u);
      this.qc = new y(this.j, r.Df, k.IH);
      this.qc.W(0.4);
      this.qc.C();
      this.qc.H((((2 * b) / this.qc.X.x) * 1.5) / 0.4);
      this.qc.Vd(3);
      new y(this.j, r.Df, k.GH).C();
      new y(this.j, r.Df, k.JH).C();
      this.Xa = new y(this.j, r.Df);
      this.Xa.pa().loop(mj);
      this.Xa.C();
      this.ca = null;
      this.zn = new oc(a);
      this.Ec = null;
    }
    update(a) {
      super.update(a);
      this.sa.A = this.x + this.ea.A;
      this.sa.D = this.y + this.ea.D;
      this.sa.B = this.x + this.ea.B;
      this.sa.G = this.y + this.ea.G;
    }
    L() {
      super.L();
      this.x = this.constraint.g.x;
      this.y = this.constraint.g.y;
      this.j.M(null == this.Ec);
      this.j.o(this.x);
      this.j.m(this.y);
      this.j.la(this.rotation);
      this.zn.o(this.x);
      this.zn.m(this.y);
    }
  }
  Kf.i = !0;
  Kf.s = Xb;
  Object.assign(Kf.prototype, { l: Kf });
  class de {
    static get() {
      let a = D.box,
        b = D.level;
      if (null == de.Tv[a]) {
        let c = l.yb(
          [
            195, 190, 185, 180, 175, 170, 165, 159, 154, 149, 144, 139, 134,
            129, 124, 119, 114,
          ][a - 1]
        );
        de.Tv[a] = JSON.parse(c);
      }
      return de.Tv[a][b - 1];
    }
  }
  de.i = !0;
  class Jb {
    static DD(a, b) {
      return 0 > a == 0 > b;
    }
    static zA(a, b, c) {
      return Math.max(Math.min(a, c), b);
    }
    static Yo(a, b) {
      return Math.floor(Math.random() * (b - a + 1) + a);
    }
    static XQ() {
      return 0.5 < Math.random();
    }
    static SO(a, b, c, d, e, f, g, h) {
      let m = e - a + g - c,
        n = f - b + h - d;
      a = c - a;
      b = d - b;
      e = g - e;
      f = h - f;
      h = Math.abs(b * e - f * a);
      return Math.abs(e * n - f * m) <= h ? Math.abs(a * n - b * m) <= h : !1;
    }
  }
  Jb.i = !0;
  class mh {
    constructor(a, b) {
      this.value = a;
      this.pk = b;
    }
  }
  mh.i = !0;
  Object.assign(mh.prototype, { l: mh });
  class Yb extends Ea {
    constructor(a, b) {
      super();
      this.S = a;
      this.Xa = 0;
      this.Bf = !1;
      this.x = b.x * Pd.Qp;
      this.y = b.y * Pd.Qp;
      this.wB = X.vh(5, 20);
      this.lu = 3;
      this.Rz = !1;
      this.time = 0;
      b = a.ma(1);
      this.tp = new y(null, r.pq);
      this.tp.C();
      this.tp.H(0.4);
      b.P(this.tp.u);
      this.En = new S();
      this.En.H(0.4);
      this.char = new y(this.En, r.zu, k.AF);
      this.char.C();
      b.P(this.En.u);
      this.blink = new y(null, r.zu, k.wF);
      this.blink.C();
      this.blink.H(0.4);
      this.blink.M(!1);
      b.P(this.blink.u);
      var c = U.Zb(Yb.bK);
      c.x -= 128;
      c.y -= 128;
      let d = c.x,
        e = c.y;
      c = this.ea = new Y(d, e, d + c.w, e + c.J);
      this.sa = new Y(c.A, c.D, c.B, c.G);
      this.pe();
      this.tp.o(this.x + Math.round(0.4 * nj));
      this.tp.m(this.y + Math.round(0.4 * oj));
      a.$c &&
        ((this.ff = new y(null, r.hl)),
        this.ff.H(0.4),
        this.ff.pa().loop(Mi),
        this.ff.C(),
        this.ff.o(this.x),
        this.ff.m(this.y),
        b.P(this.ff.u),
        (this.gf = new y(null, r.hl)),
        this.gf.H(0.4),
        this.gf.pa().loop(Ni),
        this.gf.C(),
        this.gf.o(this.x),
        this.gf.m(this.y),
        b.P(this.gf.u));
      this.ee = null;
      this.Hm = 0;
      this.Ns = -1;
      this.Dc(0);
    }
    BQ() {
      this.Bf || this.jr || this.Dc(10);
    }
    CQ() {
      !this.Bf && this.Bn() && this.Dc(1);
    }
    DQ() {
      !this.Bf && this.Bn() && this.Dc(2);
    }
    FQ() {
      !this.Bf && this.Bn() && this.Dc(7);
    }
    EQ() {
      !this.Bf && this.Bn() && this.Dc(8);
    }
    wQ() {
      this.Bf || (this.Dc(5), this.vE());
    }
    HQ() {
      this.Bf || (this.Dc(6), this.vE(), (this.Bf = !0));
    }
    SC() {
      !this.Bf && this.Bn() && this.Dc(3);
    }
    UC() {
      this.Bf || this.Dc(11);
    }
    AQ() {
      this.Dc(12);
      this.jr = !0;
      x.play(x.QJ);
      this.S.$c && (this.ff.M(!1), this.gf.M(!1));
    }
    zQ() {
      12 != this.Xa && this.Dc(13);
    }
    yQ() {
      switch (this.Xa) {
        case 7:
        case 8:
        case 14:
          break;
        default:
          this.Dc(14);
      }
    }
    zO() {
      switch (this.Xa) {
        case 0:
        case 1:
        case 2:
          return !0;
        default:
          return !1;
      }
    }
    Em(a) {
      if (this.jr) this.ee = !0;
      else if (this.ee != a) {
        let b = null == this.ee;
        this.ee = a;
        b
          ? this.UC()
          : a
          ? (this.SC(),
            this.ff.pa().stop(),
            this.ff.M(!1),
            this.gf.pa().stop(),
            this.gf.M(!1),
            x.stop(this.Ns),
            this.char.lb(1))
          : this.Bf ||
            ((this.Hm = 0),
            this.UC(),
            this.ff.pa().play(Mi),
            this.ff.M(!0),
            this.gf.pa().play(Ni),
            this.gf.M(!0));
      }
    }
    Bn() {
      return this.S.$c ? this.ee : !0;
    }
    vE() {
      this.S.$c &&
        (x.stop(this.Ns), this.ff.M(!1), this.gf.M(!1), (this.Hm = 0));
    }
    Dc(a) {
      switch (a) {
        case 3:
        case 4:
        case 6:
        case 7:
        case 8:
        case 10:
          var b = r.aM;
          break;
        case 11:
        case 12:
        case 13:
        case 14:
          b = r.hl;
          break;
        default:
          b = r.zu;
      }
      this.char.Tf(b);
      switch (a) {
        case 9:
          b = !0;
          break;
        case 13:
        case 14:
          b = !0;
          break;
        default:
          b = !1;
      }
      this.Xa = a;
      b
        ? this.char.pa().loop(Oi[a])
        : this.char
            .pa()
            .play(Oi[a], 2 == a ? 2 : 1)
            .Be(P(this, this.QP));
    }
    QP() {
      let a = this;
      switch (this.Xa) {
        case 0:
          this.lu--;
          0 == this.lu &&
            (this.blink.M(!0),
            this.blink
              .pa()
              .play(pj)
              .Be(function () {
                a.blink.M(!1);
              }),
            (this.lu = 3));
          0 == --this.wB
            ? (X.rm() ? this.CQ() : this.DQ(), (this.wB = X.vh(5, 20)))
            : this.Dc(0);
          break;
        case 1:
        case 2:
        case 3:
        case 4:
          this.Dc(0);
          break;
        case 6:
          this.Dc(9);
          break;
        case 8:
          this.jr ? this.Dc(13) : this.Dc(4);
          break;
        case 10:
          this.Dc(0);
          break;
        case 11:
          this.Rz = !0;
          break;
        case 12:
          this.Dc(13);
      }
    }
    update(a) {
      super.update(a);
      this.pe();
      if (this.S.$c && !this.jr) {
        if (this.Rz) {
          let b = Ua(Math.sin(2 * this.time), -1, 1, 0.95, 1.05);
          this.char.af(0, 433);
          this.char.lb(b);
          this.time += a;
        }
        this.ee ||
          ((this.Hm += a),
          4 < this.Hm &&
            ((this.Hm = 0),
            (this.Ns = [1041, 1040, 1039][X.vh(0, 2)]),
            x.play(this.Ns)));
      }
    }
    L() {
      super.L();
      this.sa.A = this.x + this.ea.A;
      this.sa.D = this.y + this.ea.D;
      this.sa.B = this.x + this.ea.B;
      this.sa.G = this.y + this.ea.G;
      this.En.o(this.x);
      this.En.m(this.y);
      this.blink.o(this.x);
      this.blink.m(this.y);
    }
  }
  Yb.i = !0;
  Yb.s = Ea;
  Object.assign(Yb.prototype, { l: Yb });
  class Lf extends Qa {
    constructor(a) {
      super();
      this.rw = [];
      this.WC = new S();
      a.ma(0).P(this.WC.u);
    }
    FL(a, b) {
      var c = [0.3, 0.3, 0.5, 0.5, 0.6];
      var d = (c = c[Jb.Yo(0, c.length - 1)]);
      Jb.XQ() ? (c *= 1 + Jb.Yo(0, 1) / 10) : (d *= 1 + Jb.Yo(0, 1) / 10);
      let e = Math.min(1 - c, 1 - d),
        f = Math.random(),
        g = new ph();
      this.WC.appendChild(g.U);
      g.qQ = b;
      g.x = a.x;
      g.y = a.y;
      g.Ts = e + c;
      g.Us = e + d;
      g.Am = g.Ts * f;
      g.Bm = g.Us * f;
      g.Hq = c;
      g.Iq = d;
      g.Fq = 0.3;
      g.tx = 1;
      g.alpha = 0.7 * f + 0.3;
      this.rw.push(g);
    }
    xA(a, b, c) {
      let d = c.pb.path[a];
      b = t.Ha(c.pb.path[b], d);
      c = b.Rb();
      if (!(c < qj)) {
        c = Math.floor(c / 17.6);
        b.normalize();
        for (var e = 0; e <= c; ) {
          var f = t.tb(d, t.Ob(b, 17.6 * e));
          f.x += Jb.Yo(-1.6, 1.6);
          f.y += Jb.Yo(-1.6, 1.6);
          this.FL(f, a);
          ++e;
        }
      }
    }
    update(a) {
      super.update(a);
      let b = 0,
        c = this.rw;
      for (; b < c.length; ) {
        let e = c[b];
        ++b;
        var d = Ia.bk(e.Am, e.Hq, 1, a);
        e.Am = d.value;
        d.pk && ((d = e.Ts), (e.Ts = e.Hq), (e.Hq = d));
        d = Ia.bk(e.Bm, e.Iq, 1, a);
        e.Bm = d.value;
        d.pk && ((d = e.Us), (e.Us = e.Iq), (e.Iq = d));
        d = Ia.bk(e.alpha, e.Fq, 1, a);
        e.alpha = d.value;
        d.pk && ((d = e.tx), (e.tx = e.Fq), (e.Fq = d));
      }
    }
    L() {
      let a = 0,
        b = this.rw;
      for (; a < b.length; ) {
        let c = b[a];
        ++a;
        c.U.YR(c.x, c.y, 0.4 * c.Am, 0.4 * c.Bm);
        c.U.W(c.alpha);
      }
    }
  }
  Lf.i = !0;
  Lf.s = Qa;
  Object.assign(Lf.prototype, { l: Lf });
  class ph {
    constructor() {
      this.Am =
        this.Ts =
        this.Hq =
        this.Bm =
        this.Us =
        this.Iq =
        this.alpha =
        this.tx =
        this.Fq =
          1;
      this.qQ = this.x = this.y = 0;
      this.U = new y(null, r.Kd, k.BG);
      this.U.C();
    }
  }
  ph.i = !0;
  Object.assign(ph.prototype, { l: ph });
  class Zb extends Fa {
    constructor(a) {
      super();
      this.U = new y(null, r.pm, k.KH);
      this.U.C();
      this.U.H(0.4);
      a.ma(5).P(this.U.u);
      a = Zb.Py.w / 2;
      let b = Zb.Py.J / 2;
      this.ea = new Y(0 - a, 0 - b, a, b);
      this.angle = 0;
      this.Gb = t.sc();
      this.Xb = t.sc();
      this.NE = this.zp = 0;
      this.yq = [];
    }
    WM(a) {
      a = new Mf(a, this.angle * nc - 90);
      let b = new t(this.x + 40, this.y);
      b.Ya(this.angle - Math.PI / 2, this.x, this.y);
      a.x = b.x;
      a.y = b.y;
      a.Jm(5);
      this.yq.push(a);
    }
    Gd() {
      var a = this.ea;
      a = (a.B - a.A) / 2;
      this.Gb.x = this.x - a;
      this.Xb.x = this.x + a;
      this.Gb.y = this.Xb.y = this.y;
      this.angle = this.rotation * La;
      this.Gb.Ya(this.angle, this.x, this.y);
      this.Xb.Ya(this.angle, this.x, this.y);
    }
    update(a) {
      super.update(a);
      this.pe();
      let b = 0,
        c = this.yq;
      for (; b < c.length; ) {
        let d = c[b];
        ++b;
        if (0 == d.ac.length) {
          ta.remove(this.yq, d);
          break;
        }
        d.update(a);
      }
    }
    L() {
      super.L();
      this.U.o(this.x);
      this.U.m(this.y);
      this.U.la(this.rotation);
      this.U.H(0.4 * this.Bj);
      let a = 0,
        b = this.yq;
      for (; a < b.length; ) b[a++].L();
    }
    rg() {
      let a = this.ea,
        b = this.ea;
      return new t(1.2 * (a.B - a.A), 1.2 * (b.G - b.D));
    }
    Hj() {
      let a = new t(0.8, -1.2000000000000002);
      a.rotate(this.rotation * La);
      return t.tb(new t(this.x, this.y), a);
    }
    Hg(a) {
      super.Hg(a);
      let b = new t(0.8, -1.2000000000000002);
      b.rotate(this.rotation * La);
      super.Hg(t.Ha(a, b));
    }
  }
  Zb.i = !0;
  Zb.s = Fa;
  Object.assign(Zb.prototype, { l: Zb });
  class Mf extends Hb {
    constructor(a, b) {
      super(5);
      this.S = a;
      this.angle = b;
      this.pn = 10;
      this.speed = 500;
      this.pp = 100;
      this.Wc = 0.6;
      this.size = 12;
      this.Eq = 100;
      this.Yi.r = 1;
      this.Yi.ue = 1;
      this.Yi.b = 1;
      this.Yi.a = 0.6;
      this.di.r = 1;
      this.di.ue = 1;
      this.di.b = 1;
      this.di.a = 0;
      this.wb = [];
    }
    oh(a) {
      super.oh(a);
      a = new y(null, r.pm, k.PC(6 + X.vh(0, 2)));
      a.H(0.4);
      a.C();
      a.Vd(3);
      this.S.ma(5).P(a.u);
      this.wb.push(a);
    }
    Ih(a, b, c) {
      super.Ih(a, b, c);
      a.dir.multiply(0.9);
      b = t.Ob(a.dir, c);
      b.add(this.Kb);
      a.g.add(b);
    }
    Dg(a) {
      super.Dg(a);
      let b = this.wb[a];
      this.wb.splice(a, 1);
      b.F();
    }
    L() {
      super.L();
      let a = 0,
        b = this.ac.length;
      for (; a < b; ) {
        var c = a++;
        let d = this.ac[c];
        c = this.wb[c];
        c.o(d.g.x);
        c.m(d.g.y);
        c.W(d.color.a);
      }
    }
  }
  Mf.i = !0;
  Mf.s = Hb;
  Object.assign(Mf.prototype, { l: Mf });
  class Nf extends Ea {
    constructor(a) {
      super();
      this.S = a;
      this.j = new S();
      a.ma(0).P(this.j.u);
      this.ig = [];
      this.Zg = [];
      this.px = -1;
      this.xo = t.LP();
      this.Rc = new y(this.j, r.Rc, k.II);
      this.Rc.C();
      this.Os = new Va();
      this.Os.Qf(new od());
      this.j.node.P(this.Os);
      this.op = new Va();
      this.op.Qf(new od());
      a.ma(13).P(this.op);
      this.eF = new y(this.j, r.Rc, k.My);
      this.eF.C();
      this.Px = new y(this.j, r.Rc, k.My);
      this.Px.na(-1);
      this.Px.C();
      this.Ox = new y(this.j, r.Rc, k.Ly);
      this.Ox.C();
      this.Jp = new y(this.j, r.Rc, k.Ly);
      this.Jp.na(-1);
      this.Jp.C();
      this.fj = new y(this.j, r.Rc, k.Jy);
      this.fj.C();
      this.fj.la(90);
      this.qt = new y(this.j, r.Rc, k.Jy);
      this.qt.C();
      this.qt.la(-90);
      this.Kk = new y(this.j, r.Rc, k.Ky);
      this.Kk.C();
      this.Kk.la(90);
      this.Kk.M(!1);
      this.Lk = new y(this.j, r.Rc, k.Ky);
      this.Lk.C();
      this.Lk.la(-90);
      this.Lk.M(!1);
      this.dF = new y(this.j, r.Rc, k.HI);
      this.dF.C();
    }
    F() {
      this.ig = this.Zg = null;
      this.j.F();
      this.S = this.j = null;
    }
    Lb(a) {
      this.size = a;
      var b = this.size / 216;
      this.j.H(0.4);
      this.Rc.H(b);
      this.Ox.H(b);
      this.Jp.na(-b);
      this.Jp.lb(b);
      a = 0.4 <= b ? b : 0.4;
      this.eF.H(a);
      this.Px.H(-a);
      b = 0.75 <= b ? b : 0.75;
      this.fj.H(b);
      this.qt.H(b);
      this.Kk.H(b);
      this.Lk.H(b);
      this.dF.H(1 - 0.5 * (1 - a));
      this.Dh = this.size;
      a = this.Os.effect;
      a.Z = this.Rc.ka() / 2;
      a.lineWidth = 10 * b;
      a = this.size / this.j.Qa - (this.fj.ka() / 2) * 0.76;
      this.fj.o(this.Kk.o(-a));
      this.qt.o(this.Lk.o(a));
    }
    eO() {
      return !this.fj.pi();
    }
    HR(a) {
      this.fj.M(!a);
    }
    BO() {
      return this.Kk.pi();
    }
    MD(a) {
      this.Kk.M(a);
    }
    IO() {
      return this.Lk.pi();
    }
    ND(a) {
      this.Lk.M(a);
    }
    mM() {
      let a = this.Zg.length,
        b,
        c = 0;
      for (; c < a; )
        if (((b = this.Zg[c++]), b != this && this.nM(b))) return !0;
      return !1;
    }
    L() {
      super.L();
      this.j.o(this.x);
      this.j.m(this.y);
      this.j.la(this.rotation);
      this.Ox.la(-this.rotation);
      this.Jp.la(-this.rotation);
      this.Os.Ne = this.IO() || this.BO() ? 2 : 1;
      let a = this.Zg.length;
      var b;
      let c = this.Zg.indexOf(this);
      for (b = 0; b < a; ) this.Zg[b++].op.Ne = 1;
      let d = 0;
      for (; d < a; )
        (b = this.Zg[d++]),
          b != this &&
            b.mM() &&
            this.Zg.indexOf(b) < c &&
            b.NM(this.x, this.y, this.Dh, b.x, b.y, b.Dh);
    }
    NM(a, b, c, d, e, f) {
      this.op.Ne = 1;
      let g = t.nd(a, b, d, e);
      g >= c + f ||
        c >= g + f ||
        (new t(a - d, b - e).angle(),
        (a = this.op),
        (a.Ne = 2),
        (b = a.Db),
        (b.translate.x = this.x),
        (b.translate.y = this.y),
        (b.K = (b.K & -2) | 496),
        (b = a.Db),
        (b.scale.x = b.scale.y = this.j.Qa),
        (b.K = (b.K & -2) | 500),
        (a = a.effect),
        (a.Z = this.Rc.ka() / 2),
        (a.yr = 0.2),
        (a.lineWidth = 6 * this.fj.Qa));
    }
    nM(a) {
      if (this.x == a.x && this.y == a.y && this.size == a.size) return !1;
      let b = this.ig.length,
        c = 0;
      for (; c < b; ) if (0 <= a.ig.indexOf(this.ig[c++])) return !0;
      return !1;
    }
  }
  Nf.i = !0;
  Nf.s = Ea;
  Object.assign(Nf.prototype, { l: Nf });
  class Za extends Fa {
    constructor(a, b) {
      super();
      this.S = a;
      this.group = b;
      this.angle = 0;
      this.Gb = new t(0, 0);
      this.Xb = new t(0, 0);
      this.Tc = new t(0, 0);
      this.qd = new t(0, 0);
      this.state = this.pr = 0;
      this.j = new S();
      a.ma(5).P(this.j.u);
      this.lr = new y(this.j, r.Ak, 0 == b ? k.Gy : k.LH);
      this.lr.H(0.4);
      this.lr.C();
      this.lr.m(30);
      this.lr.la(this.angle);
      this.qc = new y(this.j, r.Ak, k.MH);
      this.qc.H(0.4);
      this.qc.C();
      this.qc.kS(new F(this.qc.Pg, this.qc.Qg + 15, 0, 1));
      this.qc.M(!1);
    }
    Gd() {
      this.Gb.x = this.x - Za.Sy / 2;
      this.Xb.x = this.x + Za.Sy / 2;
      this.Gb.y = this.Xb.y = this.y;
      this.Tc.x = this.Gb.x;
      this.qd.x = this.Xb.x;
      this.Tc.y = this.qd.y = this.y + Za.oJ;
      this.angle = this.rotation * La;
      this.Gb.Ya(this.angle, this.x, this.y);
      this.Xb.Ya(this.angle, this.x, this.y);
      this.Tc.Ya(this.angle, this.x, this.y);
      this.qd.Ya(this.angle, this.x, this.y);
    }
    update(a) {
      super.update(a);
      null != this.pb && this.Gd();
    }
    L() {
      this.qc.pi() && (this.qc.pa().Vc(qh) || this.qc.M(!1));
      super.L();
      this.j.o(this.x);
      this.j.m(this.y);
      this.j.H(this.Bj);
      this.j.la(this.rotation);
    }
    rg() {
      let a = r.Ak.hc.xf(k.Gy).Nd;
      return new t(0.27999999999999997 * a.w, 0.27999999999999997 * a.J);
    }
    Hj() {
      let a = new t(-1.2000000000000002, 10);
      a.rotate(this.rotation * La);
      return t.tb(new t(this.x, this.y), a);
    }
    Hg(a) {
      let b = new t(-1.2000000000000002, 10);
      b.rotate(this.rotation * La);
      super.Hg(t.Ha(a, b));
    }
  }
  Za.i = !0;
  Za.s = Fa;
  Object.assign(Za.prototype, { l: Za });
  class If extends da {
    constructor() {
      super();
      this.U = new y(null, r.mc, k.NH);
      this.U.H(0.4);
      this.U.C();
      this.Yk = this.Rm = this.Wx = this.ru = this.state = 0;
    }
    ra() {
      super.ra();
      this.U.F();
    }
    start() {
      let a = this;
      this.U.pa()
        .play(rj)
        .Be(function () {
          a.U.pa().play(sj);
          a.state = 1;
        });
    }
    UL() {
      this.ru = 1;
      this.y = this.U.Sa();
      this.U.pa().stop();
      this.U.Fb(k.OH);
      this.Yk = X.vA(3);
      this.time = 0;
    }
    cc() {
      this.Wx = 1;
      this.y = this.U.Sa();
      this.U.pa().stop();
      this.U.Fb(k.PH);
      this.U.la(0);
      this.time = 0;
    }
    update(a) {
      super.update(a);
      a = this.parent;
      switch (this.ru) {
        case 1:
          var b = this.jb(0.5);
          this.U.m(this.y - 50 * ua.Lc(100)(b));
          let c = this.U;
          c.la(c.Yd + this.Yk);
          1 == b && (this.ru++, (this.time = 0));
          break;
        case 2:
          (b = this.U),
            b.m(b.Sa() + this.Rm),
            (b = this.U),
            b.la(b.Yd + this.Yk),
            (this.Rm += 0.4),
            1.5 < this.time && ((b = this.U), b.W(0.9 * b.Sc)),
            2 < this.time && this.ra();
      }
      switch (this.Wx) {
        case 1:
          b = this.jb(0.5);
          this.U.m(this.y - 50 * ua.Lc(100)(b));
          a.I.x = this.U.wa();
          a.I.y = this.U.Sa() - 15;
          a.I.L();
          1 == b && (this.Wx++, (this.time = 0));
          break;
        case 2:
          (a = this.U),
            a.m(a.Sa() + this.Rm),
            (this.Rm += 0.4),
            (a = this.parent),
            (a.I.x = this.U.wa()),
            (a.I.y = this.U.Sa() - 15),
            a.I.L(),
            1.5 < this.time && ((a = this.U), a.W(0.9 * a.Sc)),
            2 < this.time && this.ra();
      }
    }
  }
  If.i = !0;
  If.s = da;
  Object.assign(If.prototype, { l: If });
  class Of extends Fa {
    constructor(a, b, c, d, e, f) {
      super();
      this.S = a;
      this.width = d;
      this.T =
        -1 != f
          ? new y(null, r.bl, [k.GG, k.HG, k.IG, k.JG][d - 1])
          : new y(null, r.Cd, [k.QH, k.RH, k.SH, k.TH][d - 1]);
      this.x = b;
      this.y = c;
      a.ma(5).P(this.T.u);
      this.T.H(0.4);
      this.T.C();
      this.T.o(b);
      this.T.m(c);
      this.T.la(e);
      this.Gb = t.sc();
      this.Xb = t.sc();
      this.Tc = t.sc();
      this.qd = t.sc();
      this.be = !1;
      this.AC = this.NC = this.DB = 0;
      this.rl = !1;
      this.tf = 0;
      0 < f &&
        ((this.Eg = new Pf(a, b, c, f)), (this.Eg.kw = P(this, this.Kr)));
      this.Ps = !1;
      this.oQ = this.rotation = e;
      this.fS(f);
      this.Gd();
      this.ct = -1;
      this.qs = null;
      this.mr = this.sB = 0;
    }
    Gd() {
      let a = this.be ? this.width - 160 : 0.4 * this.T.X.x;
      a /= 2;
      this.Gb.x = this.x - a;
      this.Xb.x = this.x + a;
      this.Gb.y = this.Xb.y = this.y - 5;
      this.Tc.x = this.Gb.x;
      this.qd.x = this.Xb.x;
      this.Tc.y = this.qd.y = this.y + 5;
      this.angle = this.rotation * La;
      this.Gb.Ya(this.angle, this.x, this.y);
      this.Xb.Ya(this.angle, this.x, this.y);
      this.Tc.Ya(this.angle, this.x, this.y);
      this.qd.Ya(this.angle, this.x, this.y);
    }
    VS() {
      this.rl = !0;
      this.T.pa().loop(tj);
      this.tf = this.NC;
      x.play(x.Ok, !0);
      this.T.Cm();
    }
    VE() {
      this.rl = !1;
      this.tf = this.AC;
      this.T.pa().stop();
      this.T.Tf(r.be, k.aH);
      this.T.C();
      x.stop(x.Ok);
    }
    update(a) {
      super.update(a);
      null != this.pb && this.Gd();
      this.be &&
        (this.rl
          ? ((this.tf = Ia.ak(this.tf, 0, 1, a)), 0 == this.tf && this.VE())
          : ((this.tf = Ia.ak(this.tf, 0, 1, a)), 0 == this.tf && this.VS()));
      var b = this.Eg;
      null != b && b.update(a);
      if (null != this.qs) {
        this.Iw += a;
        b = Math.min(1, this.Iw / this.qs);
        let c = ua.Lc(100)(b),
          d = this.qR;
        this.rotation = d + (this.rR - d) * c;
        this.Gd();
        1 == b && (this.qs = null);
      }
      null != this.Ld && this.Ld.update(a);
      this.mr += a;
      1 < this.mr && (this.sB = this.mr = 0);
    }
    fS(a) {
      this.LE = a;
    }
    tR() {
      this.Ps = !this.Ps;
      let a = this.oQ + (this.Ps ? 90 : 0);
      this.Iw = 0;
      this.qs = (Math.abs(a - this.rotation) / 90) * 0.3;
      this.qR = this.rotation;
      this.rR = a;
      this.Eg.U.na(-this.Eg.U.Qa);
    }
    vQ() {
      this.be ||
        ((this.Ld = new $d(
          this.S,
          t.nd(this.Gb.x, this.Gb.y, this.Xb.x, this.Xb.y),
          4 * t.nd(this.Gb.x, this.Gb.y, this.Tc.x, this.Tc.y),
          3,
          !0
        )),
        this.Ld.j.C(),
        this.Ld.j.la(this.rotation));
    }
    AS() {
      null != this.Ld && (this.Ld.F(), (this.Ld = null));
    }
    Kr(a) {
      0 == a && null != this.IC && this.IC(this.LE);
      this.Ps ? x.play(x.NJ) : x.play(x.OJ);
    }
    L() {
      super.L();
      this.T.o(this.x);
      this.T.m(this.y);
      this.T.la(this.rotation);
      null != this.Eg && this.Eg.U.la(this.rotation);
      null != this.Ld &&
        (this.Ld.j.o(this.x), this.Ld.j.m(this.y), this.Ld.j.la(this.rotation));
    }
  }
  Of.i = !0;
  Of.s = Fa;
  Object.assign(Of.prototype, { l: Of });
  class Pf extends Hc {
    constructor(a, b, c, d) {
      super();
      this.x = b;
      this.y = c;
      this.GE = d;
      this.U = new y(null, r.bl, this.TA());
      this.U.H(0.4);
      this.U.C();
      this.U.o(b);
      this.U.m(c);
      this.Z = 20;
      a.ma(5).P(this.U.u);
    }
    xk(a) {
      super.xk(a);
      this.U.Fb(this.TA());
    }
    TA() {
      return 0 == this.state
        ? 1 == this.GE
          ? k.CG
          : k.EG
        : 1 == this.GE
        ? k.DG
        : k.FG;
    }
    Ll(a, b) {
      return oh.wx(a, b, this.x, this.y, this.Z);
    }
  }
  Pf.i = !0;
  Pf.s = Hc;
  Object.assign(Pf.prototype, { l: Pf });
  class bb extends Fa {
    constructor(a) {
      super();
      this.S = a;
      this.ee = null;
      var b = U.Zb(bb.aK),
        c = b.w / 2;
      b = b.J / 2;
      c = this.ea = new Y(0 - c, 0 - b, c, b);
      this.sa = new Y(c.A, c.D, c.B, c.G);
      this.timeout = 0;
      this.time = 2 * X.fi();
      this.Fj = 0;
      this.j = new S();
      this.Uc = new y(this.j, r.Na, k.eI);
      this.Uc.C();
      this.Uc.H(0.4);
      a.$c &&
        ((this.Fk = new y(this.j, r.Na, k.kI)), this.Fk.C(), this.Fk.H(0.4));
      this.Na = new y(this.j, r.Na, k.gI);
      this.Na.C();
      this.Na.H(0.4);
      this.Na.H(0.4);
      this.Na.pa().loop(uj);
      this.Na.pa().uw();
      a.$c &&
        (this.Fk.pa().loop(vj),
        this.Fk.pa().setTime(0),
        this.Fk.W(0),
        (this.Di = new y(this.j, r.Na, k.oI)),
        this.Di.C(),
        this.Di.H(0.4),
        this.Di.M(!1),
        this.Di.Vd(3),
        (this.Wj = new y(this.j, r.Na, k.mI)),
        this.Wj.C(),
        this.Wj.H(0.4),
        this.Wj.M(!1));
      a.ma(11).P(this.j.u);
    }
    Em(a) {
      let b = null == this.ee;
      this.ee != a &&
        (a
          ? b ||
            (this.Di.M(!0),
            this.Di.pa().play(wj),
            this.Di.pa().Be(P(this, this.$P)),
            x.play(X.rm() ? x.SJ : x.TJ))
          : b
          ? (this.Uc.W(0), this.Na.W(0))
          : (this.Wj.M(!0),
            this.Wj.pa().play(xj),
            this.Wj.pa().Be(P(this, this.ZP))),
        (this.ee = a));
    }
    F() {
      this.j.F();
    }
    setTimeout() {
      this.time = this.timeout;
      this.wp = new y(null, r.Na, k.sI);
      this.wp.H(0.4);
      this.wp.C();
      this.j.appendChild(this.wp);
      this.j.Pw(this.wp, 0);
    }
    ZP() {
      this.Wj.M(!1);
    }
    $P() {
      this.Di.M(!1);
    }
    update(a) {
      super.update(a);
      this.Fj += a;
      if (this.S.$c)
        if (this.ee) {
          var b = this.Uc;
          b.W(b.Sc + 0.1);
          b = this.Fk;
          b.W(b.Sc - 0.1);
          b = this.Na;
          b.W(b.Sc + 0.1);
        } else
          (b = this.Uc),
            b.W(b.Sc - 0.1),
            (b = this.Fk),
            b.W(b.Sc + 0.1),
            (b = this.Na),
            b.W(b.Sc - 0.1);
      b = 3 * Math.sin(3 * this.Fj);
      this.Nl() && (b = 0);
      let c = 0,
        d = this.j.Jj();
      for (; c < d; ) this.j.nb(c++).m(b);
      this.sa.A = this.x + this.ea.A;
      this.sa.D = this.y + this.ea.D;
      this.sa.B = this.x + this.ea.B;
      this.sa.G = this.y + this.ea.G;
      0 < this.timeout &&
        0 >= this.S.ci &&
        (this.wp.Fb(k.gj(k.tI, (35 * (1 - this.time / this.timeout)) | 0)),
        0 < this.time && (this.time = Ia.ak(this.time, 0, 1, a)));
    }
    rg() {
      let a = this.ea,
        b = this.ea;
      return new t(0.9 * (a.B - a.A), 0.9 * (b.G - b.D));
    }
    Rq() {
      return 8;
    }
    L() {
      super.L();
      this.j.o(this.x);
      this.j.m(this.y);
      this.j.H(this.Bj);
    }
  }
  bb.i = !0;
  bb.s = Fa;
  Object.assign(bb.prototype, { l: bb });
  class pd extends Ia {
    constructor(a, b, c) {
      super(0);
      this.g.x = b.x;
      this.g.y = b.y;
      this.speed = c;
      this.I = a;
    }
    Yp() {}
    start() {}
    update(a) {
      let b = this.I.x - this.g.x,
        c = this.I.y - this.g.y;
      var d = b * b + c * c;
      1e-6 > d
        ? ((this.g.x = this.I.x), (this.g.y = this.I.y))
        : ((d = Math.sqrt(d)),
          (this.g.x += (b / d) * this.speed * a),
          (this.g.y += (c / d) * this.speed * a),
          (this.speed += 50 * a));
    }
    static CB(a, b) {
      return new pd(a, b, 300);
    }
  }
  pd.i = !0;
  pd.s = Ia;
  Object.assign(pd.prototype, { l: pd });
  class Qf extends Fa {
    constructor(a) {
      super();
      this.S = a;
      this.uh = [];
    }
    rO(a, b, c) {
      this.x = a;
      this.y = b;
      this.rotation = c;
      this.uc = 0;
      this.fe = new ib();
      this.Ee = 0;
      this.j = new S();
      this.S.ma(5).P(this.j.u);
      this.Cp = new y(this.j, r.Hk, k.xI);
      this.Cp.C();
      this.Cp.m(27);
      this.Cp.H(0.4);
      this.Hp = new y(this.j, r.Hk, k.yI);
      this.Hp.H(0.4);
      this.Hp.C();
      this.Hp.m(27);
      this.mt = this.lt = 0;
      this.sE = new S(null, this.j);
      this.tE = new S(null, this.j);
      this.Bz();
    }
    QA() {
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
      return 1.2 * a;
    }
    sN() {
      let a = this.QA();
      return (a += Math.sin(6 * this.uc));
    }
    L() {
      super.L();
      this.j.o(this.x);
      this.j.m(this.y);
      this.j.la(this.rotation);
      this.Hp.la(this.lt);
      this.j.H(this.Bj);
    }
    update(a) {
      super.update(a);
      for (var b = 0, c = this.uh.length; b < c; )
        null == this.uh[b].T
          ? (--c,
            0 < c && (this.uh[b] = this.uh[this.uh.length - 1]),
            this.uh.pop())
          : ++b;
      b = 0;
      for (c = this.uh; b < c.length; ) c[b++].update(a);
      this.uc += a;
      this.lt += 0.05 * (this.mt - this.lt);
      if (this.Nl())
        for (b = this.fe.keys(); b.eb(); ) {
          c = b.next();
          let d = this.fe.J[c];
          d.Ws += a;
          0.5 <= d.Ws &&
            (1 > t.nd(d.qr.x, d.qr.y, d.Ln.x, d.Ln.y) && this.ow(),
            this.fe.remove(c));
        }
    }
    SN() {
      let a = new t(this.x, this.y);
      if (this.Nl()) return a;
      let b = new t(0, 27);
      b.rotate(this.rotation * La);
      return t.tb(a, b);
    }
    gk(a, b, c) {
      let d = this.SN();
      if (30 > t.Ha(new t(a, b), d).Rb())
        if (this.Nl()) this.fe.J[c] = new rh(new t(a, b), new t(a, b), 0);
        else return this.ow(), !0;
      return !1;
    }
    jQ(a, b, c) {
      this.fe.J.hasOwnProperty(c) && (this.fe.J[c].Ln = new t(a, b));
      return !1;
    }
    lQ(a) {
      if (this.fe.J.hasOwnProperty(a)) {
        let b = this.fe.J[a];
        0.5 >= b.Ws && 1 >= t.nd(b.qr.x, b.qr.y, b.Ln.x, b.Ln.y) && this.ow();
        this.fe.remove(a);
      }
      return !1;
    }
    ow() {
      let a = 0;
      switch (this.Ee) {
        case 0:
          this.Ee++;
          a = 0;
          x.play(x.WJ);
          break;
        case 1:
          this.Ee++;
          a = 0;
          x.play(x.VJ);
          break;
        case 2:
          (this.Ee = 0), (a = 1), x.play(x.UJ);
      }
      this.Bz();
      switch (a) {
        case 0:
          this.mt += 180;
          break;
        case 1:
          this.mt = 0;
      }
    }
    Bz() {
      for (var a = (this.uc = 0), b = this.uh; a < b.length; ) b[a++].aN();
      if (3 != this.Ee) {
        a = 7;
        1 == this.Ee && (a = 14);
        2 == this.Ee && (a = 20);
        b = 0;
        for (var c = a; b < c; ) {
          let e = b++;
          var d = null;
          switch (e % 3) {
            case 0:
              d = yj;
              break;
            case 1:
              d = zj;
              break;
            case 2:
              d = Aj;
          }
          let f = -this.QA();
          f *= 1 + 0.1 * X.Ac();
          1 != this.Ee || (1 != e % 3 && 2 != e % 3) || (f *= 0.95);
          2 != this.Ee || (1 != e % 3 && 2 != e % 3) || (f *= 0.94);
          let g = 1;
          0 == e % 3
            ? (g = 0)
            : 1 == e % 3
            ? (g = this.Ee)
            : 2 == e % 3 && (g = -this.Ee);
          let h = new oa();
          h.Ah(5, 0, 0, 100);
          h.Ah(5 + g, f, 0.6);
          h.vc(0.4, 0);
          h.vc(0.6000000000000001, 0.6);
          d = new sh((0.6 * e) / a, d, h);
          this.uh.push(d);
          (0 == e % 3 ? this.sE : this.tE).appendChild(d.T);
        }
      }
    }
    Hg(a) {
      this.Cp.m(3);
      this.Hp.m(3);
      this.sE.m(-27);
      this.tE.m(-27);
      super.Hg(a);
    }
    Rq() {
      return 0.3 * this.Cp.ka();
    }
    rg() {
      return new t(40, 56);
    }
  }
  Qf.i = !0;
  Qf.s = Fa;
  Object.assign(Qf.prototype, { l: Qf });
  class rh {
    constructor(a, b, c) {
      this.qr = a;
      this.Ln = b;
      this.Ws = c;
    }
  }
  rh.i = !0;
  Object.assign(rh.prototype, { l: rh });
  class sh {
    constructor(a, b, c) {
      this.state = 0;
      this.time = a;
      this.Xa = b;
      this.track = c;
      this.T = new y(null, r.Hk);
      this.T.M(!1);
      this.Lv = new Aa(this.T);
    }
    aN() {
      2 != this.state && (this.state = 2);
    }
    update(a) {
      switch (this.state) {
        case 0:
          this.time -= a;
          if (0 < this.time) break;
          this.T.Fb(this.Xa.data[0]);
          this.T.pa().play(this.Xa);
          this.T.M(!0);
          this.T.C();
          this.Lv.loop(this.track);
          this.state = 1;
          this.time = 0;
          break;
        case 1:
          this.time += a;
          0.6 <= this.time &&
            (this.T.pa().stop(), this.Lv.stop(), (this.time = this.state = 0));
          break;
        case 2:
          (a = this.T),
            a.W(0.95 * a.Sc),
            0.05 > this.T.Sc &&
              (this.T.F(),
              this.Lv.ra(),
              (this.T = this.track = this.Xa = null),
              (this.state = 3));
      }
    }
  }
  sh.i = !0;
  Object.assign(sh.prototype, { l: sh });
  class Nd extends da {
    constructor(a) {
      super();
      this.j = new S();
      this.Gn = new y(this.j);
      this.Gn.setColor(new F(1, 1, 1, 0.5), 400, 100);
      this.Gn.o(-200);
      this.Gn.m(-50);
      let b = [1, 1.6, 2, 1.6, 2, 2, 2.2, 2, 1.6, 2, 2, 1, 1.6],
        c = [
          603, 20, 350, 27, 38, 60, 471, 68, 306, 71, 197, 104, 622, 110, 144,
          131, -44, 133, 544, 136, 307, 151, 409, 156, 61, 157,
        ],
        d = 0,
        e = 0,
        f = b.length;
      for (; e < f; ) {
        let g = new y(this.j, r.Jd, k.aI);
        g.C();
        g.H(0.7 * b[e++]);
        g.o((c[d++] / 600) * 400 - 200);
        g.m((c[d++] / 187) * 100 - 50);
      }
      this.wc = new na(this.j, r.ii);
      this.wc.Pa(a);
      this.wc.rb(500, 100);
      this.wc.lc(40);
      this.wc.Eb(0, 0);
      this.wc.Sf(!0);
      this.wc.o(this.Gn.wa() - 50);
      this.wc.m(this.Gn.Sa());
      this.state = 0;
    }
    ra() {
      super.ra();
      this.j.F();
    }
    update(a) {
      super.update(a);
      a = this.O.fa.Xq().gi(0.6666666666666666);
      this.j.o((a.A + a.B) / 2);
      this.j.m(a.G - 150);
      this.j.H((a.B - a.A) / 600);
      switch (this.state) {
        case 0:
          a = this.jb(0.5);
          let b = ua.iu(0.1)(a),
            c = this.j;
          c.H(c.Qa * b);
          this.j.W(a);
          1 == a && ((this.state = 1), (this.time = 0));
          break;
        case 1:
          this.O.hd().Nb(0) &&
            2 < this.time &&
            ((this.time = 0), (this.state = 2));
          break;
        case 2:
          a = this.jb(0.25);
          this.j.W(1 - a);
          1 == a && ((this.time = 0), this.state++);
          break;
        case 3:
          this.ra();
      }
    }
  }
  Nd.i = !0;
  Nd.s = da;
  Object.assign(Nd.prototype, { l: Nd });
  class ee {
    constructor(a) {
      this.Gj = !1;
      this.eA = !0;
      this.oC = this.offset = a;
      this.index = ee.rL++;
    }
  }
  ee.i = !0;
  Object.assign(ee.prototype, { l: ee });
  class fe extends Ea {
    constructor(a) {
      super();
      this.S = a;
      this.cF = 10;
      this.offset = 0;
      this.id = -1;
      this.ze = !1;
      this.Ir = this.ss = this.Pe = 0;
      this.dir = new t(0, 0);
      this.active = !1;
      this.dm = -1;
      this.ha = new t(0, 0);
      this.Ap = null;
      this.Zd = new Rf();
      this.iq = [];
      this.node = new S();
      a.ma(4).P(this.node.u);
      this.j = new S();
      this.node.appendChild(this.j);
    }
    update(a) {
      super.update(a);
      this.ze ||
        ((this.Pe = a * this.cF * 10),
        (this.offset += this.Pe),
        (this.offset = this.Rv(this.offset, this.width)));
      this.active = 0.001 < Math.abs(this.Pe);
      this.ze &&
        this.active &&
        ((this.Ir += Math.abs(this.Pe)),
        15 <= this.Ir && (this.GQ(), (this.Ir = 0)));
      this.$M();
      let b = null,
        c = null;
      for (var d = this.Zd, e = d.keys(); e.eb(); ) {
        var f = e.next(),
          g = d.get(f);
        if (g.Gj) continue;
        let A = g.offset + this.Pe,
          C = !0;
        A >= this.width
          ? (A -= this.width)
          : 0 >= A
          ? (A += this.width)
          : (C = !1);
        var h = f.rg(),
          m = f.Hj(),
          n = new t(h.x * this.dir.x, h.y * this.dir.y).Rb() / 2,
          q = 1,
          p = A;
        A < n
          ? ((q = 0.5 + (0.5 * A) / n), (b = f), (p = n * q))
          : this.width - A < n &&
            ((q = 0.5 + (0.5 * (this.width - A)) / n),
            (c = f),
            (p = this.width - n * q));
        n = this.Zd;
        let B = n.keys();
        for (; B.eb(); ) {
          var v = B.next(),
            u = n.get(v);
          v == f ||
            u.Gj ||
            1 != q ||
            ((u = u.offset - g.offset),
            0.25 * t.tb(h, v.rg()).ao() > u * u &&
              (0.001 > Math.abs(u)
                ? ((v = this.iq.indexOf(v) - this.iq.indexOf(v)),
                  (u = 600 * (0 < v ? 1 : 0 > v ? -1 : 0)))
                : 600 > Math.abs(u) && (u = 600 * (0 < u ? 1 : 0 > u ? -1 : 0)),
              (A -= u * a)));
        }
        f.ER(new t(q, q));
        h = new t(this.x + this.dir.x * p - m.x, this.y + this.dir.y * p - m.y);
        g.eA
          ? ((p = new t(this.dir.y, -this.dir.x)),
            (m = t.rz(h, p) / this.dir.Rb()),
            (p = new t(p.x * m, p.y * m)),
            (m = 800 * a),
            p.ao() >= m * m
              ? ((q = p.Rb()), p.multiply((q - m) / q))
              : (g.eA = !1),
            h.ux(p),
            f.Hg(t.tb(f.Hj(), h)))
          : f.Hg(t.tb(new t(this.x, this.y), t.Ob(this.dir, p)));
        g.oC = A;
        C && (f.HC(), x.play(x.XJ));
      }
      this.Ap.move(this.Pe);
      for (d = this.Zd.iterator(); d.eb(); )
        (e = d.next()), (e.offset = this.Rv(e.oC, this.width));
      this.ze && (this.Pe = 0);
      if (-1 == this.dm)
        if (null != b && null != c)
          for (d = this.Zd, e = d.keys(); e.eb(); )
            (f = e.next()),
              (g = d.get(f)),
              g.Gj ||
                (f == b && (g.offset += 1500 * a),
                f == c && (g.offset -= 1500 * a));
        else
          null != b ? (this.Pe = 1500 * a) : null != c && (this.Pe = -1500 * a);
    }
    L() {
      this.j.o(this.x);
      this.j.m(this.y);
      this.j.Kg(0, this.height / 2);
      this.j.af(0, this.height / 2);
      this.j.la(this.rotation);
      this.Ap.L();
    }
    bt(a, b, c) {
      let d = !1;
      if (!this.ze) return !1;
      a = this.ot(new t(a, b));
      0 <= a.x &&
        a.x <= this.width &&
        0.5 * -this.height <= a.y &&
        a.y <= 0.5 * this.height &&
        ((this.dm = c), this.ha.Pb(a), (d = !0));
      return d;
    }
    Gx(a, b, c) {
      a = !1;
      if (!this.ze) return !1;
      if (this.dm == c) {
        this.dm = -1;
        this.Pe = 0;
        for (c = this.Zd.keys(); c.eb(); )
          (a = c.next()), this.Zd.J[a.jf].Gj && this.Zd.remove(a);
        a = !0;
      }
      return a;
    }
    Fx(a, b, c) {
      let d = !1;
      if (-1 != this.S.br || !Ba.instance.hd().to(0) || !this.ze) return !1;
      this.dm == c &&
        ((a = this.ot(new t(a, b))),
        (this.Pe = a.x - this.ha.x),
        (this.offset += this.Pe),
        (this.offset = this.Rv(this.offset, this.width)),
        this.ha.Pb(a),
        (d = !0));
      return d;
    }
    contains(a) {
      a = this.ot(a);
      return 0 <= a.x && a.x <= this.width && 0.5 * -this.height <= a.y
        ? a.y <= 0.5 * this.height
        : !1;
    }
    ot(a) {
      var b = this.ss - 0.5 * Math.PI;
      let c = new t(this.dir.x, this.dir.y);
      b = new t(Math.cos(b), Math.sin(b));
      return new t(
        c.x * (a.x - this.x) + c.y * (a.y - this.y),
        b.x * (a.x - this.x) + b.y * (a.y - this.y)
      );
    }
    hM(a, b) {
      a = this.ot(a);
      return !(
        a.x < -b ||
        a.x > this.width + b ||
        a.y < 0.5 * -this.height - b ||
        a.y > 0.5 * this.height + b
      );
    }
    bind(a) {
      this.PL(a);
    }
    YS(a) {
      let b = this.Zd,
        c = b.keys();
      for (; c.eb(); ) {
        let d = c.next(),
          e = b.get(d);
        if (d == a) {
          e.Gj = !0;
          d.ex(-1);
          break;
        }
      }
      a.ex(-1);
    }
    Dv(a) {
      return null != this.Zd.J.Rk[a.jf];
    }
    remove(a) {
      this.Zd.remove(a);
    }
    xO(a) {
      a = this.Zd.J[a.jf];
      return null != a ? a.Gj : !1;
    }
    isActive() {
      return this.active;
    }
    Rv(a, b) {
      let c = b - 0;
      a > b && (a -= c);
      0 > a && (a += c);
      return a;
    }
    PL(a) {
      var b = a.Hj();
      b = new t(b.x - this.x, b.y - this.y);
      this.Zd.set(
        a,
        new ee(
          Math.max(Math.min(b.x * this.dir.x + b.y * this.dir.y, this.width), 0)
        )
      );
      this.iq.push(a);
      a.ex(this.id);
    }
    oO(a, b, c, d, e, f, g, h) {
      this.dm = -1;
      this.id = a;
      this.x = b;
      this.y = c;
      this.width = d;
      this.height = e;
      this.rotation = f;
      this.ze = g;
      this.ss = f * La;
      this.dir = new t(Math.cos(this.ss), Math.sin(this.ss));
      this.cF = h;
      this.node = new S();
      a = new y(this.j, r.Pc, Bj);
      a.na(d / a.X.x);
      a.lb((e - 10) / a.ja());
      a = new y(this.j, r.Pc, Pi);
      a.na(0.4);
      a.lb((e - 10) / a.ja());
      a.o(-6);
      a.m(5);
      a = new y(this.j, r.Pc, Pi);
      a.na(0.4);
      a.lb((e - 10) / a.ja());
      a.o(d - a.ka() + 6);
      a.m(5);
      a = new y(this.j, r.Pc, Qi);
      a.na(d / a.ka());
      a.lb(-0.4);
      a.m(a.ja());
      a = new y(this.j, r.Pc, Qi);
      a.na(d / a.ka());
      a.lb(0.4);
      a.m(e - a.ja());
      a = new y(this.j, r.Pc, th);
      a.H(0.4);
      a.o(-6);
      a.m(e - a.ja());
      a = new y(this.j, r.Pc, th);
      a.na(0.4);
      a.lb(-0.4);
      a.o(-6);
      a.m(a.ja());
      a = new y(this.j, r.Pc, th);
      a.H(-0.4);
      a.o(d + 6);
      a.m(a.ja());
      a = new y(this.j, r.Pc, th);
      a.na(-0.4);
      a.lb(0.4);
      a.o(d + 6);
      a.m(e - a.ja());
      a = 0;
      g || (a = 0 < h ? 1 : -1);
      this.Ap = new Sf(d - 2, e - 10, a);
      this.Ap.j.m(5);
      this.j.appendChild(this.Ap.j);
      g = new y(this.j, r.Pc, Ri);
      g.na(0.4);
      g.lb((e - 10) / g.X.y);
      g.m(5);
      g = new y(this.j, r.Pc, Ri);
      g.na(-0.4);
      g.lb((e - 10) / g.X.y);
      g.o(d);
      g.m(5);
    }
    $M() {
      let a = [];
      for (var b = this.Zd, c = b.keys(); c.eb(); ) {
        let d = c.next();
        b.get(d).Gj && !this.contains(d.Hj()) && a.push(d);
      }
      for (b = 0; b < a.length; )
        (c = a[b]), ++b, this.Zd.remove(c), ta.remove(this.iq, c);
    }
    GQ() {
      x.play([1057, 1056, 1055, 1054][X.vh(0, 3)]);
    }
    static create(a, b, c, d, e, f, g, h, m) {
      a = new fe(a);
      a.oO(b, c, d, e, f, g, h, m);
      return a;
    }
  }
  fe.i = !0;
  fe.s = Ea;
  Object.assign(fe.prototype, { l: fe });
  class uh {
    constructor(a) {
      this.fe = new ib();
      this.vw = !1;
      this.list = [];
      this.S = a;
    }
    count() {
      return this.list.length;
    }
    bind(a) {
      let b = 0,
        c = this.list;
      for (; b < c.length; ) {
        let d = c[b];
        ++b;
        d.contains(new t(a.x, a.y)) && d.bind(a);
      }
    }
    push(a) {
      this.list.push(a);
    }
    iterator() {
      return new Tc(this.list);
    }
    al(a) {
      let b = 0;
      for (; b < a.length; ) this.bind(a[b++]);
    }
    gM(a) {
      var b = null;
      let c = [];
      for (var d = this.iterator(); d.eb(); ) {
        var e = d.next();
        e.hM(a.Hj(), a.Rq()) && c.push(e);
        e.Dv(a) && (b = e);
      }
      if (null != b && b.ze) {
        for (d = 0; d < c.length; )
          if (((e = c[d]), ++d, e.ze && e.isActive())) {
            this.lD(e, a);
            return;
          }
        if (b.ze)
          for (b = 0; b < c.length; ) (d = c[b]), ++b, d.ze || this.lD(d, a);
      }
    }
    il(a) {
      let b = 0;
      for (; b < a.length; ) this.gM(a[b++]);
    }
    remove(a) {
      let b = 0,
        c = this.list;
      for (; b < c.length; ) c[b++].remove(a);
    }
    kD() {
      var a = this.count() - 1;
      let b = a;
      for (; 0 <= a; ) {
        if (this.list[a].ze && this.list[a].isActive()) {
          let c = a;
          for (; c < b; ) this.wE(c, c + 1), ++c;
          --b;
        }
        --a;
      }
      this.JP();
    }
    update(a) {
      let b = 0,
        c = this.list;
      for (; b < c.length; ) c[b++].update(a);
      this.vw && (this.kD(), (this.vw = !1));
    }
    kR() {
      this.vw = !0;
    }
    bt(a, b, c) {
      let d = this.count() - 1;
      for (; 0 <= d; ) {
        let e = this.list[d];
        if (null != e && e.bt(a, b, c)) return (this.fe.J[c] = new t(a, b)), !0;
        --d;
      }
      return !1;
    }
    Gx(a, b, c) {
      let d = this.count() - 1;
      for (; 0 <= d; ) {
        let e = this.list[d];
        if (null != e && e.Gx(a, b, c)) return this.fe.remove(c), !0;
        --d;
      }
      return !1;
    }
    Fx(a, b, c) {
      var d = this.fe.J[c];
      if (null != d) {
        var e = t.Ha(new t(a, b), d);
        if (4 > e.ao()) return !1;
        e = t.Wp(e);
        let f = -1,
          g = null,
          h = 0,
          m = this.list;
        for (; h < m.length; ) {
          let n = m[h];
          ++h;
          if (n.contains(d)) {
            let q = Math.abs(t.rz(e, n.dir));
            q >= f && ((f = q), (g = n));
          }
        }
        null != g && g.bt(d.x, d.y, c);
        this.fe.remove(c);
      }
      for (d = this.count() - 1; 0 <= d; ) {
        if (this.list[d].Fx(a, b, c)) return this.kR(), !0;
        --d;
      }
      return !1;
    }
    lD(a, b) {
      if (!a.Dv(b) || a.xO(b)) {
        for (var c = 0, d = this.list; c < d.length; ) {
          let e = d[c];
          ++c;
          e.Dv(b) && e.YS(b);
        }
        a.bind(b);
        x.play(x.YJ);
      }
    }
    JP() {
      var a = this.count() - 1;
      let b = a;
      for (; 0 <= a; ) {
        if (!this.list[a].ze) {
          let c = a;
          for (; c < b; ) this.wE(c, c + 1), ++c;
          --b;
        }
        --a;
      }
    }
    wE(a, b) {
      let c = this.list[a];
      this.list[a] = this.list[b];
      this.list[b] = c;
      this.S.ma(4).ES(a, b);
    }
  }
  uh.i = !0;
  Object.assign(uh.prototype, { l: uh });
  class Sf extends Ea {
    constructor(a, b, c) {
      super();
      this.width = a;
      this.height = b;
      new t(0, 0);
      this.j = new S();
      this.ie = [];
      this.offset = 0;
      this.Tr = r.Pc.hc.xf(Si).ec.x;
      switch (c) {
        case -1:
          a = Cj;
          break;
        case 1:
          a = Dj;
          break;
        default:
          a = Si;
      }
      this.pw = a;
    }
    L() {
      super.L();
      var a = 0.4 * this.Tr;
      null == this.ie[0] && (this.ie[0] = new y(this.j, r.Pc, this.pw));
      this.ie[0].M(!0);
      var b = 1;
      var c = this.ie[0],
        d = Math.max(this.offset - ((this.offset / a) | 0) * a, 0);
      c.o(0);
      c.na(d / this.Tr);
      for (c.lb(this.height / c.X.y); d + a <= this.width; )
        null == this.ie[b] && (this.ie[b] = new y(this.j, r.Pc, this.pw)),
          this.ie[b].M(!0),
          (c = this.ie[b++]),
          c.na(0.4),
          c.lb(this.height / c.X.y),
          c.o(d),
          (d += c.ka());
      a = this.width - d;
      null == this.ie[b] && (this.ie[b] = new y(this.j, r.Pc, this.pw));
      this.ie[b].M(!0);
      c = this.ie[b++];
      c.o(this.width - a);
      c.na(a / this.Tr);
      c.lb(this.height / c.X.y);
      for (c = this.ie.length; b < c; ) this.ie[b++].M(!1);
    }
    move(a) {
      this.offset += a;
      for (a = 0.4 * this.Tr; this.offset > this.width; ) this.offset -= a;
      for (; 0 > this.offset; ) this.offset += a;
    }
  }
  Sf.i = !0;
  Sf.s = Ea;
  Object.assign(Sf.prototype, { l: Sf });
  class Ic extends Fa {
    constructor(a) {
      super();
      this.T = a;
      a.W(0);
      this.time = this.state = 0;
    }
    show() {
      this.$(1);
    }
    mh() {
      this.time = 0;
      this.$(3);
    }
    update(a) {
      this.time += a;
      switch (this.state) {
        case 1:
          a = Math.min(this.time / 1, 1);
          this.T.W(a);
          1 == a && this.$(2);
          break;
        case 2:
          1 == Math.min(this.time / (1 == D.box && 1 == D.level ? 10 : 5), 1) &&
            this.$(3);
          break;
        case 3:
          (a = Math.min(this.time / 0.5, 1)),
            this.T.W(1 - a),
            1 == a && (this.$(0), this.T.M(!1));
      }
    }
    L() {
      this.T.o(this.x);
      this.T.m(this.y);
      this.T.la(this.rotation);
    }
    $(a) {
      this.time = 0;
      this.state = a;
    }
  }
  Ic.i = !0;
  Ic.s = Fa;
  Object.assign(Ic.prototype, { l: Ic });
  class Tf extends Ic {
    constructor(a) {
      a = new y(null, r.WS, k.gj(k.dK, a));
      a.H(0.4);
      super(a);
      this.yi = 0;
    }
    Ii(a) {
      this.rotation = null != a.angle ? a.angle : 0;
      let b = a.path,
        c = ra.en;
      if (null != b) {
        let d = Ia.yy;
        "R" == b.charAt(0) &&
          (d = Math.round((3 * Da.parseInt(ta.substr(b, 2, null))) / 2 + 1));
        a = new Yd(d, a.moveSpeed * c, a.rotateSpeed);
        a.angle = this.rotation;
        a.SD(b, this.x, this.y);
        this.QD(a);
        a.start();
      }
    }
    update(a) {
      if (2 == this.Bd)
        switch (((this.time += a), this.state)) {
          case 1:
            a = Math.min(this.time / 1, 1);
            this.T.W(a);
            1 == a && ((this.Ie = this.x), this.$(2));
            break;
          case 2:
            a = Math.min(this.time / 1, 1);
            this.x = this.Ie + (this.Ie + (ra.cK + 40) * Pd.Qp) * a;
            1 == a && this.$(3);
            break;
          case 3:
            (a = Math.min(this.time / 0.5, 1)),
              this.T.W(1 - a),
              1 == a &&
                (2 == ++this.yi
                  ? (this.T.M(!1), this.$(0))
                  : ((this.x = this.Ie), this.$(1)));
        }
      else
        null != this.pb &&
          (this.pb.update(a),
          (this.x = this.pb.g.x),
          (this.y = this.pb.g.y),
          (this.rotation = this.pb.angle)),
          super.update(a);
    }
  }
  Tf.i = !0;
  Tf.s = Ic;
  Object.assign(Tf.prototype, { l: Tf });
  class Uf extends Ic {
    constructor(a, b) {
      let c = new na(null, r.ii);
      c.Pa(a);
      c.rb(b, 512);
      c.lc(26);
      c.Eb(0);
      c.Sf(!0);
      c.Vd(2);
      c.W(0.7);
      super(c);
    }
  }
  Uf.i = !0;
  Uf.s = Ic;
  Object.assign(Uf.prototype, { l: Uf });
  class ra extends da {
    constructor(a) {
      super();
      this.Ei = a;
      this.pA = this.oa(new da());
      this.Wi = new qb();
      this.TB = [];
      for (a = 0; 14 > a; ) {
        let b = new qb();
        this.TB[a++] = b;
        this.Wi.P(b);
      }
      this.Bb = new lh();
      this.ga = Pd.Qp;
      this.rp = 0;
      this.rS = t.sc();
      this.Cj = [];
      for (a = 0; 5 > a; ) this.Cj[a++] = [];
      this.oA = new Va();
      this.oA.Qf(new Jc(this.Cj));
      this.ma(13).P(this.oA);
      this.Ol = this.Zk = this.wo = this.vo = 0;
      this.vu = [];
      this.Hl();
    }
    yL() {
      this.Ml = !0;
      this.Ef = new Cf();
      this.ma(8).P(this.Ef.j.u);
    }
    zL() {
      this.ol = new Ef(this);
      this.Ld = new $d(this, this.yg, this.xg, 4, !1);
      this.dg = new sf(this, new t(this.Ja.x, this.Ja.y - 30), new t(0, 0));
      this.vn = new wf(this, this.I);
      this.qn = 0;
      this.Ve = !0;
      this.Ja.AQ();
      this.Gc.ZS();
      for (var a = 0, b = this.Cd; a < b.length; ) {
        var c = b[a];
        ++a;
        null == c || (c.be && !c.rl) || c.vQ();
      }
      a = 0;
      for (b = this.Jc; a < b.length; )
        (c = b[a]),
          ++a,
          c.ve &&
            (c.Fh
              ? (this.qp(c), (c.Fh = !1))
              : ((c.ve = !1), c.mc.ra(), (c.mc = null)));
      if (this.$c)
        for (this.Ja.Em(!0), a = 0, b = this.Za; a < b.length; ) b[a++].Em(!0);
    }
    xM() {
      this.ol.F();
      this.vn.F();
      this.Ld.F();
      this.dg.F();
      let a = 0,
        b = this.Cd;
      for (; a < b.length; ) b[a++].AS();
    }
    uv(a, b, c) {
      if (!a.zk) {
        a.zk = !0;
        var d = a.rotation * La,
          e = t.Ha(b.ha, b.g),
          f = b.ha;
        f = new t(f.x, f.y);
        f.Ya(-d, a.x, a.y);
        f = f.y < a.y;
        e = Math.max(40 * e.Rb(), 300) * (f ? -1 : 1);
        e = t.Ob(t.Vt(t.EA(d)), e);
        var g = b.g;
        g = new t(g.x, g.y);
        g.Ya(-d, a.x, a.y);
        b.g = g;
        g = b.ha;
        g = new t(g.x, g.y);
        g.Ya(-d, a.x, a.y);
        b.ha = g;
        b.ha.y = b.g.y;
        g = b.g;
        g = new t(g.x, g.y);
        g.Ya(d, a.x, a.y);
        b.g = g;
        g = b.ha;
        g = new t(g.x, g.y);
        g.Ya(d, a.x, a.y);
        b.ha = g;
        b.Uh(e, c);
        c = (-180 * d) / Math.PI + 90;
        f || (c += 180);
        b = b.g;
        d = new t(bb.$f, 0);
        d.rotate(-c);
        b = t.tb(b, d);
        2 > a.sB && (x.play(x.Vy), this.vn.CA(b, c));
      }
    }
    tv(a) {
      let b = bb.$f,
        c = 0,
        d = this.yg,
        e = this.xg,
        f = a.g.x < b || a.g.x > d - b,
        g = a.g.y < b || a.g.y > e - b;
      if (
        (f && 0 < Math.abs(Math.min(a.g.x, d - a.g.x))) ||
        (g && 0 < Math.abs(Math.min(a.g.y, e - a.g.y)))
      ) {
        let h = t.Ha(a.g, a.ha);
        a.ha = a.g;
        let m = null;
        f &&
          (a.g.x < b
            ? ((h.x = Math.abs(h.x)), (c = 0), (m = new t(b, a.g.y)))
            : ((h.x = -Math.abs(h.x)), (c = 180), (m = new t(d - b, a.g.y))),
          3 > Math.abs(h.x) && (h.x = 3 * (a.g.x < b ? 1 : -1)));
        g &&
          (a.g.y < b
            ? ((h.y = Math.abs(h.y)), (c = -90), (m = new t(a.g.x, b)))
            : ((h.y = -Math.abs(h.y)), (c = 90), (m = new t(a.g.x, e - b))),
          3 > Math.abs(h.y) && (h.y = 3 * (a.g.y < b ? 1 : -1)),
          5 > h.Rb() && (h.normalize(), (h = t.Ob(h, 5))));
        a.g = t.tb(a.g, h);
        a.g.x < b ? (a.g.x = b) : a.g.x > d - b && (a.g.x = d - b);
        a.g.y < b ? (a.g.y = b) : a.g.y > e - b && (a.g.y = e - b);
        this.vn.CA(m, c);
      }
    }
    Hl() {
      for (var a = 0; 5 > a; ) this.Cj[a++] = [];
      this.bi = Array(5);
      this.Zi = Array(5);
      this.kk = Array(5);
      for (a = 0; 5 > a; ) {
        let b = a++;
        this.bi[b] = !1;
        this.Zi[b] = t.sc();
        this.kk[b] = t.sc();
      }
    }
    ma(a) {
      return this.TB[a];
    }
    tu() {
      let a = this.pA.Me;
      for (; null != a; ) {
        let b = a.Y;
        a.ra();
        a = b;
      }
    }
    delay(a, b) {
      a = new Df(a, b);
      this.pA.oa(a);
    }
    ra() {
      x.stop(x.Oh);
      x.stop(x.Sp);
      this.Wi.F();
      super.ra();
    }
    show() {
      this.Ol = this.Zk = 0;
      this.tu();
      this.Qd = null;
      this.br = -1;
      this.Aa = 2;
      this.Ki = 0;
      x.stop(x.Ok);
      x.stop(x.Kt);
      this.Jc = [];
      this.Cd = [];
      this.Za = [];
      this.bubbles = [];
      this.Qi = [];
      this.Eh = [];
      this.Dp = [];
      this.Ep = [];
      this.tj = [];
      this.Ud = [];
      this.zf = [];
      this.bj = [];
      this.Pl = [];
      this.nc = new uh(this);
      this.se = new kh(this);
      this.rc = [];
      this.nm = null;
      this.qh = !1;
      this.da = new Ib();
      this.da.Lg(1);
      this.xa = new Ib();
      this.xa.Lg(1);
      this.Ia = new Ib();
      this.Ia.Lg(1);
      this.vj = new oc(this);
      var a = de.get();
      this.ku = new hh(this);
      this.I = new zb(this);
      this.I.constraint = this.da;
      this.gP(a);
      a = this.Ud.length;
      let b,
        c = 0;
      for (; c < a; ) (b = this.Ud[c++]), (b.Or = -1), (b.Zg = this.Ud);
      this.rp = 0;
      this.pc = this.xc = this.gd = null;
      this.aw = !1;
      this.tc = 2 != this.Aa;
      this.nE = this.Gr = this.ld = this.kd = !1;
      this.time = this.xR = this.gp = 0;
      this.ri = !0;
      $a.reset();
      this.ci = 0 < this.Zk ? 0 : 0.3;
      this.nc.al(this.Za);
      this.nc.al(this.Eh);
      this.nc.al(this.bubbles);
      this.nc.al(this.bj);
      this.nc.al(this.Qi);
      this.nc.al(this.tj);
      this.nc.kD();
      this.fg = !1;
      this.yS();
    }
    gP(a) {
      function b(g, h) {
        let m = 0,
          n = g.length;
        for (; m < n; ) {
          let q = g[m++],
            p = 0,
            v = q.length;
          for (; p < v; ) h(q[p++]);
        }
      }
      let c = [],
        d = 0,
        e = yb.bN(a);
      for (; d < e.length; ) c.push(yb.uf(a, e[d++]));
      let f = this;
      b(c, function (g) {
        switch (g.name) {
          case 0:
            f.hP(g);
            break;
          case 1:
            f.ZO(g);
            break;
          case 50:
            f.XO(g);
            break;
          case 51:
            f.YO(g);
            break;
          case 52:
            f.WO(g);
            break;
          case 134:
            f.fP(g);
        }
      });
      b(c, function (g) {
        switch (g.name) {
          case 2:
            f.Ja = new Yb(f, g);
            f.cA = !1;
            f.cr = ra.Ej ? 2 : -1;
            f.lq = 1;
            ra.Ej = !1;
            break;
          case 3:
            f.mP(g);
            break;
          case 4:
            f.qP(g);
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
            f.pP(g);
            break;
          case 53:
            f.cP(g);
            break;
          case 54:
            f.VO(g);
            break;
          case 55:
            f.iP(g);
            break;
          case 56:
            f.kP(g);
            break;
          case 57:
          case 58:
          case 59:
          case 60:
          case 80:
            f.lP(g);
            break;
          case 81:
          case 82:
            f.UO(g);
            break;
          case 100:
            f.bP(g);
            break;
          case 120:
            f.jP(g);
            break;
          case 130:
            f.aP(g);
            break;
          case 131:
            f.nP(g);
            break;
          case 132:
            f.eP(g);
            break;
          case 133:
            f.$O(g);
            break;
          case 135:
            f.oP(g);
            break;
          case 300:
            f.dP(g);
        }
      });
    }
    hP(a) {
      this.yg = (a.width * this.ga) | 0;
      this.xg = (a.height * this.ga) | 0;
      var b = a.view;
      if (null != b) {
        var c = b.x;
        let d = b.y;
        b = new Y(c, d, c + b.width, d + b.height);
        b.scale(this.ga, !1);
        c = this.Bb.Jk;
        c.A = b.A;
        c.D = b.D;
        c.B = b.B;
        c.G = b.G;
        c = this.Bb.g;
        c.x = (b.A + b.B) / 2;
        c.y = (b.D + b.G) / 2;
      } else
        (b = this.Bb.Jk),
          (b.A = 0),
          (b.D = 0),
          (b.B = this.yg),
          (b.G = this.xg),
          (b = this.Bb.g),
          (b.x = this.yg / 2),
          (b.y = this.xg / 2);
      this.he = new F(0, 0, 0, 1);
      null != a.scrollX && (this.he.x = a.scrollX);
      null != a.scrollY && (this.he.y = a.scrollY);
      8 == D.box && this.ku.oS();
    }
    ZO(a) {
      this.Bd = a.special;
      this.xm = a.ropePhysicsSpeed;
      this.$c = a.nightLevel;
      this.Aa = a.twoParts ? 0 : 2;
      this.xm *= ra.Ny;
      2 != this.Aa && ((this.wj = new oc(this)), (this.xj = new oc(this)));
    }
    bP(a) {
      var b = a.x * this.ga;
      let c = a.y * this.ga,
        d = a.length * this.ga;
      var e = a.radius,
        f = a.wheel,
        g = null != a.moveLength ? a.moveLength * this.ga : -1;
      let h = a.moveVertical,
        m = null != a.moveOffset ? a.moveOffset * this.ga : 0;
      var n = a.spider,
        q = "L" == a.part;
      let p = a.hidePath;
      var v = a.bindBulb;
      let u = new nd(this);
      u.x = b;
      u.y = c;
      u.Yf = f;
      u.cS(n);
      u.Ii(a);
      -1 != e && (e *= this.ga);
      if (-1 == e) {
        f = this.da;
        if (v)
          for (q = 0, v = this.rc; q < v.length; )
            (n = v[q]), ++q, null != n && (f = n.constraint);
        else 2 != this.Aa && (f = q ? this.xa : this.Ia);
        b = new ae(this.ma(6), null, b, c, f, f.g.x, f.g.y, d);
        b.Hc.th.Pb(b.Hc.g);
        u.XD(b);
        this.rn();
      }
      u.setRadius(e);
      u.NR(g, h, m);
      if (null != u.pb && (u.BR(), !p)) {
        a = "R" == a.path[0];
        null == this.nm && (this.nm = new Lf(this));
        e = 0;
        for (g = u.pb.path.length - 1; e < g; )
          (a && 0 != e % 3) || this.nm.xA(e, e + 1, u), ++e;
        2 < u.pb.path.length && this.nm.xA(0, u.pb.path.length - 1, u);
      }
      this.Jc.push(u);
    }
    XO(a) {
      this.xa.g.x = a.x * this.ga;
      this.xa.g.y = a.y * this.ga;
      this.La = new pc(this, k.YG);
      this.La.x = this.xa.g.x;
      this.La.y = this.xa.g.y;
      this.La.constraint = this.xa;
    }
    YO(a) {
      this.Ia.g.x = a.x * this.ga;
      this.Ia.g.y = a.y * this.ga;
      this.Ma = new pc(this, k.ZG);
      this.Ma.x = this.Ia.g.x;
      this.Ma.y = this.Ia.g.y;
      this.Ma.constraint = this.Ia;
    }
    WO(a) {
      this.da.g.x = a.x * this.ga;
      this.da.g.y = a.y * this.ga;
    }
    fP(a) {
      let b = new Ib();
      b.Lg(1);
      b.g.x = a.x * this.ga;
      b.g.y = a.y * this.ga;
      a = new Kf(this, a.litRadius * this.ga);
      a.x = b.g.x;
      a.y = b.g.y;
      a.constraint = b;
      this.rc.push(a);
    }
    cP(a) {
      this.Qd = new Jf(this, a.x * this.ga, a.y * this.ga);
      this.Qd.kw = P(this, this.Kr);
    }
    mP(a) {
      let b = new bb(this);
      b.x = a.x * this.ga;
      b.y = a.y * this.ga;
      b.timeout = a.timeout;
      -1 != a.timeout && b.setTimeout();
      b.Ii(a);
      b.update(0);
      this.Za.push(b);
    }
    dP(a) {
      this.Gc = new vf(this);
      this.Gc.x = a.x * this.ga;
      this.Gc.y = a.y * this.ga;
      this.Gc.update(0);
    }
    qP(a) {
      if (!this.eE(a) && null != a.text && "" != a.text) {
        var b = Math.ceil(a.width * this.ga);
        b = new Uf(Db.get(a.text), b);
        b.x = a.x * this.ga;
        b.y = a.y * this.ga;
        this.ma(2).P(b.T.u);
        a = a.special;
        b.Bd = null != a ? a : 0;
        0 == b.Bd && b.show();
        this.Ep.push(b);
      }
    }
    pP(a) {
      if (!this.eE(a)) {
        var b = new Tf(a.name - 5);
        b.T.C();
        b.x = a.x * this.ga;
        b.y = a.y * this.ga;
        var c = a.angle;
        b.rotation = null != c ? c : 0;
        c = a.special;
        b.Bd = null != c ? c : 0;
        b.Ii(a);
        a = 2;
        if (2 == b.Bd || 5 == this.Bd) a = 13;
        this.ma(a).P(b.T.u);
        (0 != b.Bd && 2 != b.Bd) || b.show();
        this.Dp.push(b);
      }
    }
    VO(a) {
      let b = new kb(this);
      b.x = a.x * this.ga;
      b.y = a.y * this.ga;
      this.bubbles.push(b);
    }
    iP(a) {
      let b = new Zb(this);
      b.angle = a.angle;
      b.x = a.x * this.ga;
      b.y = a.y * this.ga;
      b.rotation = a.angle + 90;
      b.Gd();
      this.Qi.push(b);
    }
    kP(a) {
      let b = new Za(this, a.group);
      b.x = a.x * this.ga;
      b.y = a.y * this.ga;
      b.Ii(a);
      b.rotation += 90;
      null != b.pb && (b.pb.angle += 90);
      b.Gd();
      this.Eh.push(b);
    }
    lP(a) {
      var b = a.x * this.ga;
      let c = a.y * this.ga,
        d = a.size,
        e = parseFloat(a.angle);
      if (0 == a.toggled) var f = -1;
      else (f = a.toggled), (f = null != f ? f : -1);
      b = new Of(this, b, c, d, null != e ? e : 0, f);
      b.Ii(a);
      -1 != f && (b.IC = P(this, this.sR));
      80 == a.name
        ? ((b.be = !0),
          (b.DB = a.initialDelay),
          (b.NC = a.onTime),
          (b.AC = a.offTime),
          (b.tf = 0),
          b.VE(),
          (b.tf += b.DB),
          b.Gd())
        : (b.be = !1);
      this.Cd.push(b);
    }
    jP(a) {
      let b = a.x * this.ga,
        c = a.y * this.ga,
        d = a.size * this.ga;
      var e = Da.parseInt(a.handleAngle);
      e = null != e ? e : 0;
      let f = e * La,
        g = a.oneHandle,
        h = new Nf(this);
      h.OB = a.size;
      h.x = b;
      h.y = c;
      h.rotation = e;
      h.er = new t(h.x - h.OB * this.ga, h.y);
      h.er.Ya(f, h.x, h.y);
      h.fr = new t(h.x + h.OB * this.ga, h.y);
      h.fr.Ya(f, h.x, h.y);
      h.Lb(d);
      h.HR(g);
      this.Ud.push(h);
    }
    UO(a) {
      let b = new kd(this, a.x * this.ga, a.y * this.ga, a.size, a.angle);
      b.Ii(a);
      this.tj.push(b);
    }
    aP(a) {
      let b = a.x * this.ga,
        c = a.y * this.ga,
        d = a.radius,
        e = a.angle,
        f = a.grab,
        g = a.bubble;
      a = a.bouncer;
      let h = new Ff(this);
      h.tO(
        new t(b, c),
        (a ? 8 : 0) | (g ? 2 : 0) | (f ? 4 : 0),
        d,
        e,
        this.bubbles,
        this.Jc,
        this.tj
      );
      this.zf.push(h);
      this.vj.Cb = new Na();
      2 != this.Aa && ((this.wj.Cb = new Na()), (this.xj.Cb = new Na()));
    }
    nP(a) {
      let b = a.x * this.ga,
        c = a.y * this.ga;
      a = a.angle;
      let d = new Qf(this);
      d.rO(b, c, a);
      this.bj.push(d);
    }
    eP(a) {
      let b = a.x * this.ga,
        c = a.y * this.ga,
        d = a.candyCaptured,
        e = new rb(this);
      e.qO(b, c);
      this.Pl.push(e);
      e.Ii(a);
      d && ((this.qh = !0), this.I.j.W(0), e.dA(this.da));
    }
    $O(a) {
      let b = a.x * this.ga,
        c = a.y * this.ga,
        d = a.angle,
        e = a.radius,
        f = a.activeTime;
      a = a.index;
      let g = new yf(this, this.se);
      g.index = a;
      g.sO(new t(b, c), d, e, f);
      this.se.oa(g, a);
    }
    oP(a) {
      var b = a.x * this.ga;
      let c = a.y * this.ga,
        d = a.angle,
        e = a.width * this.ga,
        f = a.length * this.ga,
        g = a.velocity * this.ga,
        h = "forward" == a.direction ? 1 : -1;
      a = "manual" == a.type;
      b = fe.create(this, this.nc.count(), b, c, f, e, -d, a, g * h);
      this.nc.push(b);
    }
    rn() {
      this.Zk += 1;
    }
    Ev(a, b, c, d) {
      if (U.ik(b.x, b.y, a.x - 34, a.y - 34, 68, 68)) {
        if (null != c) {
          this.om(a.x, a.y);
          this.Nn();
          b = 0;
          for (var e = this.zf; b < e.length; ) {
            var f = e[b];
            ++b;
            null != f && f.ca == c && ((f.kg = !0), f.Ri(1));
          }
        }
        d.show();
        c = !1;
        b = 0;
        for (e = this.zf; b < e.length; )
          (f = e[b]), ++b, null != f && f.ca == a && ((f.kg = !1), (c = !0));
        c && d.pS();
        x.play(x.Ty);
        a.pop();
        this.rn();
        return !0;
      }
      return !1;
    }
    Km(a, b) {
      this.nE || ((b.x = a.g.x), (b.y = a.g.y), b.pe());
    }
    UM(a, b, c, d) {
      this.Km(this.da, a);
      return Ea.so(a, c)
        ? (c.HQ(),
          x.play(x.Oh, !0),
          null != b && this.jk(b, !1),
          this.qk(null != d),
          (a.oe = !1),
          a.j.Sb().lF(c.x, c.y + 10),
          a.j.Sb().alpha(0, 0.1),
          a.j.Sb().scale(0, 0.1, null, null, function () {
            a.F();
          }),
          !0)
        : !1;
    }
    CE(a) {
      if (null != a && null != a.Ec) {
        var b = a.constraint;
        a.Ec.qc.M(!0);
        a.Ec.qc.pa().play(qh);
        var c = new t(0, Za.pJ);
        c.rotate(a.Ec.rotation * La);
        b.g.x = a.Ec.x;
        b.g.y = a.Ec.y;
        b.g.add(c);
        b.ha.Pb(b.g);
        b.sb.x = 0;
        b.sb.y = -1;
        b.sb.rotate(a.Ec.rotation * La);
        b.sb.multiply(a.Kw);
        b.xd.Pb(b.sb);
        b.xd.rA(60);
        b.ha.Pb(b.g);
        b.ha.ux(b.xd);
        a.Ec = null;
      }
    }
    qk(a) {
      let b = 0,
        c = this.Jc.length;
      for (; b < c; ) {
        let d = this.Jc[b++],
          e = d.kb;
        null != e &&
          (e.Mb == this.da ||
            (e.Mb == this.xa && a) ||
            (e.Mb == this.Ia && !a)) &&
          (-1 == e.yc ? (e.zs(e.za.length - 2), this.Nn()) : (e.wv = !0),
          d.ve && d.Fh && this.qp(d));
      }
    }
    bR(a) {
      if (null != a)
        for (var b = 0, c = this.Jc; b < c.length; ) {
          let d = c[b];
          ++b;
          if (null == d) continue;
          let e = d.kb;
          null != e &&
            e.Mb == a.constraint &&
            (-1 == e.yc ? e.zs(e.za.length - 2) : (e.wv = !0),
            d.ve && d.Fh && this.qp(d));
        }
    }
    Nn() {
      --this.Zk;
      this.Ol = 0;
    }
    YL() {
      this.Ax = 100 * Math.max(0, 30 - this.gp);
      this.Ax = (this.Ax / 10) * 10;
      this.xS = 1e3 * this.rp;
      this.xR = Math.ceil(this.Ax + this.xS);
    }
    yl() {
      null != this.gd && this.jk(this.gd, !1);
      this.YL();
      this.qk(!1);
      this.tu();
      let a = x.Ok;
      this.delay(function () {
        x.stop(a);
      }, 1.5);
      this.Ei.lw();
      this.delay(((bc = this.Ei), P(bc, bc.YP)), 1.8);
      this.se.QO();
      this.Ml && (this.Ef.F(), (this.Ef = null));
      this.Ve && (this.xM(), (this.Ve = !1));
    }
    Zu() {
      this.vm ||
        (this.Ja.wQ(),
        x.play(x.DJ),
        this.Ml && (this.Ef.F(), (this.Ef = null)),
        this.tu(),
        this.Ei.WP(),
        this.delay(((bc = this.Ei), P(bc, bc.XP)), 1));
    }
    ir(a, b, c, d) {
      if (
        c.aR(
          a.x - 249.60000000000002,
          a.y - 249.60000000000002,
          a.x + 249.60000000000002,
          a.y + 249.60000000000002
        )
      ) {
        var e = new t(0, 0);
        let h = new t(0, 0);
        c = new t(c.x, c.y);
        var f = a.ea;
        f = f.B - f.A;
        var g = a.ea;
        g = g.G - g.D;
        e.x = a.x - f / 2;
        h.x = a.x + f / 2;
        e.y = h.y = a.y;
        0 != a.angle && c.Ya(-a.angle, a.x, a.y);
        c.y < e.y &&
          U.ww(
            c.x - f / 2,
            c.y - g / 2,
            c.x + f / 2,
            c.y + g / 2,
            e.x,
            e.y - 249.60000000000002,
            h.x,
            h.y
          ) &&
          ((e = new t(
            0,
            -(
              (499.20000000000005 * (249.60000000000002 - (e.y - c.y))) /
              249.60000000000002
            )
          )),
          e.rotate(a.angle),
          b.Uh(e, d));
      }
    }
    gr(a, b, c) {
      if (!a.zk && null != a.j) {
        var d = t.Ha(b.ha, b.g),
          e = b.ha.Zb();
        e.Ya(-a.angle, a.x, a.y);
        d = Math.max(40 * d.Rb(), 336) * (e.y < a.y ? -1 : 1);
        e = t.Vt(t.EA(a.angle));
        e.multiply(d);
        b.g.Ya(-a.angle, a.x, a.y);
        b.ha.Ya(-a.angle, a.x, a.y);
        b.ha.y = b.g.y;
        b.g.Ya(a.angle, a.x, a.y);
        b.ha.Ya(a.angle, a.x, a.y);
        b.Uh(e, c);
        a.tQ();
        x.play(x.qJ);
      }
    }
    mQ(a, b) {
      a.U.pa().play(Zb.rF);
      x.play([1035, 1034, 1033, 1032][X.vh(0, 3)]);
      a.WM(this);
      this.tc || this.ir(a, this.da, this.I, b);
      2 != this.Aa &&
        (this.kd || this.ir(a, this.xa, this.La, b),
        this.ld || this.ir(a, this.Ia, this.Ma, b));
      let c = 0,
        d = this.rc;
      for (; c < d.length; ) {
        let e = d[c];
        ++c;
        this.ir(a, e.constraint, e, b);
      }
    }
    nQ(a, b) {
      function c(u, A, C) {
        var B = 0;
        if (
          (0 == a.rotation && (null == q.Qd || (null != q.Qd && q.ri))) ||
          (180 == a.rotation && null != q.Qd && !q.ri)
        )
          (B = a.x - A.x),
            (B =
              2.5 < Math.abs(B)
                ? -C.x / f + 0.25 * B
                : 1 > Math.abs(C.x)
                ? -C.x
                : -C.x / f);
        let K = -34 / u.weight;
        if (
          (0 != a.rotation && (null == q.Qd || (null != q.Qd && q.ri))) ||
          (180 != a.rotation && null != q.Qd && !q.ri)
        )
          (f *= 15),
            (K = 90 == a.rotation || 270 == a.rotation ? K / 4 : K / 2);
        C = new t(B, -C.y / f + K);
        A = a.y - A.y;
        A > h + 17.5 && C.multiply(Math.exp(-2 * (A - (h + 17.5))));
        C.rotate(g);
        u.Uh(C, b);
      }
      function d() {
        let u = 0,
          A = q.tj;
        for (; u < A.length; ) {
          let C = A[u];
          ++u;
          null != C && (C.zk = !1);
        }
      }
      function e(u, A, C) {
        A.Ya(-g, a.x, a.y);
        C.rotate(-g);
        return U.ww(
          A.x - 17.5,
          A.y - 8.75,
          A.x + 17.5,
          A.y + 17.5,
          m.x,
          m.y,
          n.x,
          n.y
        );
      }
      let f = 5,
        g = a.rotation * La,
        h = a.sN(),
        m = new t(a.x - 5, a.y - h - 1),
        n = new t(a.x + 5, a.y - 17.5),
        q = this;
      if (2 == this.Aa) {
        var p = this.da.g.Zb(),
          v = this.da.sb.Zb();
        e(this.da, p, v) && (d(), c(this.da, p, v));
      } else
        (p = this.xa.g.Zb()),
          (v = this.xa.sb.Zb()),
          e(this.xa, p, v) && (d(), c(this.xa, p, v)),
          (p = this.Ia.g.Zb()),
          (v = this.Ia.sb.Zb()),
          e(this.Ia, p, v) && (d(), c(this.Ia, p, v));
      p = 0;
      for (v = this.rc; p < v.length; ) {
        let u = v[p];
        ++p;
        let A = u.constraint.g.Zb(),
          C = u.constraint.sb.Zb();
        e(u.constraint, A, C) && (d(), c(u.constraint, A, C));
      }
    }
    yc(a, b, c) {
      let d = 0,
        e = this.Jc.length;
      for (; d < e; ) {
        let f = this.Jc[d++],
          g = f.kb;
        if (null == g || -1 != g.yc) continue;
        let h = g.za.length - 1,
          m = 0;
        for (; m < h; ) {
          let n = m++,
            q = g.za[n],
            p = g.za[n + 1];
          if (
            f.Yf && U.Xj(a.x, a.y, b.x, b.y, f.x - 44, f.y - 44, 88, 88)
              ? 0
              : Jb.SO(a.x, a.y, b.x, b.y, q.g.x, q.g.y, p.g.x, p.g.y)
          )
            return (
              f.ve && f.Fh && this.qp(f),
              x.play([1030, 1029, 1028, 1027][g.xw]),
              g.zs(n),
              this.Nn(),
              c && ((g.$g = 0), g.yw(n)),
              1
            );
        }
      }
      return 0;
    }
    qp(a) {
      x.play(x.LJ);
      a.ve = !1;
      a.mc.UL();
    }
    vS(a) {
      x.play(x.MJ);
      let b = 0,
        c = this.Jc;
      for (; b < c.length; ) {
        let d = c[b];
        ++b;
        let e = d.kb;
        null != e &&
          e.Mb == this.da &&
          (-1 != e.yc
            ? d.Ku()
            : (e.zs(e.za.length - 2), this.Nn(), (e.vl = !1)),
          d.ve && d.Fh && a != d && this.qp(d));
      }
      a.ve = !1;
      this.tc = this.nE = !0;
      a.mc.cc();
      this.vm || this.delay(P(this, this.Zu), 2);
    }
    jk(a, b) {
      for (var c = 0, d = this.zf; c < d.length; ) {
        var e = d[c];
        ++c;
        null != e &&
          (e.ca == a && ((e.kg = !0), e.Ri(1)),
          this.gd == a &&
            this.dE &&
            e.ca == this.pc &&
            ((e.kg = !0), e.Ri(1), (this.pc = null), (this.dE = !1)));
      }
      c = 0;
      for (d = this.rc; c < d.length; )
        if (((e = d[c]), ++c, null != e.ca && e.ca == a)) {
          e.ca = null;
          e.zn.mh();
          this.om(e.x, e.y);
          return;
        }
      2 != this.Aa
        ? b
          ? ((this.xc = null), this.wj.mh(), this.om(this.La.x, this.La.y))
          : ((this.pc = null), this.xj.mh(), this.om(this.Ma.x, this.Ma.y))
        : ((this.gd = null), this.vj.mh(), this.om(this.I.x, this.I.y));
      this.Nn();
    }
    om(a, b) {
      x.play(x.rJ);
      let c = new y(null, r.ca, k.QG);
      c.o(a);
      c.m(b);
      c.C();
      c.H(0.4);
      this.Wi.P(c.u);
      c.pa()
        .play(kb.LI)
        .Be(function () {
          c.F();
        });
    }
    hr(a, b, c, d) {
      return U.ik(c, d, b.g.x - 24, b.g.y - 24, 60, 60)
        ? (this.jk(a, b == this.xa), !0)
        : !1;
    }
    Lw(a) {
      var b = this.O.window,
        c = b.V.viewport,
        d = b.Fc.x;
      b = b.Fc.y;
      d = -1 + (2 * (a.x - ((c.x * d) | 0))) / ((c.w * d) | 0);
      a = -1 + (2 * (((c.y * b) | 0) - a.y)) / ((c.J * b) | 0);
      c = this.Bb.Ab.Bv;
      return new F(
        c.m11 * d + c.m12 * a + c.m14,
        c.m21 * d + c.m22 * a + c.m24,
        0,
        1
      );
    }
    NS(a, b) {
      var c = this.Lw(a);
      a = c.x;
      c = c.y;
      if (this.Gl) this.wA = !0;
      else if (!(5 <= b))
        if (null != this.Qd && this.Qd.Ll(a, c)) this.br = b;
        else if (
          !(
            (this.se.xi() && this.se.gk(a, c, b)) ||
            (null != this.gd && this.hr(this.gd, this.da, a, c)) ||
            (2 != this.Aa &&
              ((null != this.xc && this.hr(this.xc, this.xa, a, c)) ||
                (null != this.pc && this.hr(this.pc, this.Ia, a, c))))
          )
        ) {
          for (var d = 0, e = this.rc; d < e.length; ) {
            var f = e[d];
            ++d;
            if (null != f.ca && this.hr(f.ca, f.constraint, a, c)) return;
          }
          d = new t(a, c);
          this.bi[b] || (this.Zi[b].Pb(d), this.kk[b].Pb(d));
          d = 0;
          for (e = this.Cd; d < e.length; )
            if (
              ((f = e[d]), ++d, null != f.Eg && -1 == f.ct && f.Eg.nw(a, c))
            ) {
              f.ct = b;
              return;
            }
          d = !1;
          e = 0;
          for (f = this.Qi; e < f.length; ) {
            var g = f[e];
            ++e;
            if (g.JQ(a, c)) {
              g.zp = 0.05;
              g.NE = b;
              g.Nl() || (d = !0);
              break;
            }
          }
          if (!d) {
            d = 0;
            for (e = this.bj; d < e.length; ) if (e[d++].gk(a, c, b)) return;
            var h = this;
            d = 0;
            for (e = this.Pl; d < e.length; )
              if (((f = e[d]), ++d, null != f && f.gk(a, c, b))) {
                this.delay(function () {
                  h.qh = !1;
                  h.I.oe = !0;
                  h.I.j.W(1);
                  h.I.j.H(0.71);
                }, 0.1);
                return;
              }
            var m = 0;
            for (d = this.Ud.length; m < d; ) {
              e = this.Ud[m];
              f = t.nd(a, c, e.er.x, e.er.y);
              g = t.nd(a, c, e.fr.x, e.fr.y);
              if ((f < ra.Rp && !e.eO()) || g < ra.Rp) {
                for (m += 1; m < d; ) ++m;
                e.xo.x = a;
                e.xo.y = c;
                e.Or = b;
                f < ra.Rp && e.MD(!0);
                g < ra.Rp && e.ND(!0);
                return;
              }
              ++m;
            }
            d = 0;
            for (e = this.Jc; d < e.length; ) {
              f = e[d];
              ++d;
              if (f.Yf && U.ik(a, c, f.x - 44, f.y - 44, 88, 88)) {
                f.bO(a, c);
                f.Qm = b;
                return;
              }
              if (0 < f.Gf && U.ik(a, c, f.x - 26, f.y - 26, 52, 52)) {
                f.cm = b;
                return;
              }
            }
            d = 0;
            for (e = this.zf; d < e.length; )
              if (((f = e[d]), ++d, null != f && f.nw(a, c))) return;
            this.nc.bt(a, c, b) || (this.bi[b] = !0);
          }
        }
    }
    PS(a, b) {
      var c = this.Lw(a);
      a = c.x;
      c = c.y;
      if (!this.Gl) {
        this.bi[b] = !1;
        null != this.Qd &&
          this.br == b &&
          (this.Qd.Ll(a, c) &&
            (this.Qd.toggle(), 8 == D.box && this.ku.hN(), this.Kr(0)),
          (this.br = -1));
        for (var d = 0, e = this.Cd; d < e.length; ) {
          var f = e[d];
          ++d;
          if (null != f.Eg && f.ct == b && ((f.ct = -1), f.Eg.kQ(a, c))) return;
        }
        d = 0;
        for (e = this.Ud; d < e.length; )
          (f = e[d]),
            ++d,
            f.Or == b && ((f.Or = -1), (f.px = -1), f.MD(!1), f.ND(!1));
        d = 0;
        for (e = this.bj; d < e.length; ) if (e[d++].lQ(b)) return;
        d = 0;
        for (e = this.Jc; d < e.length; )
          (f = e[d]),
            ++d,
            f.Yf && f.Qm == b && (f.Qm = -1),
            0 < f.Gf && f.cm == b && (f.cm = -1);
        0 == b && this.Ve && (this.Ja.zQ(), this.dg.LD(!1));
        this.nc.Gx(a, c, b);
      }
    }
    OS(a, b) {
      a = this.Lw(a);
      var c = a.x,
        d = a.y;
      if (!(this.Gl || 5 <= b)) {
        a = new t(c, d);
        if (10 < this.Zi[b].sf(a))
          for (var e = 0, f = this.Qi; e < f.length; ) {
            var g = f[e];
            ++e;
            g.NE == b && 0 != g.zp && (g.zp = 0);
          }
        this.rS.Pb(a);
        f = 0;
        for (g = this.Ud; f < g.length; )
          if (((e = g[f]), ++f, e.Or == b)) {
            b = new t(e.x, e.y);
            b.sf(a) < e.Dh / 10 && e.xo.Pb(a);
            c = t.Ha(e.xo, b);
            c = t.Ha(a, b).em() - c.em();
            c > Math.PI
              ? (c -= 2 * Math.PI)
              : c < -Math.PI && (c += 2 * Math.PI);
            e.er.Ya(c, e.x, e.y);
            e.fr.Ya(c, e.x, e.y);
            e.rotation += c * nc;
            d = 0 < c ? x.IJ : x.JJ;
            0.07 > Math.abs(c) && (d = -1);
            e.px != d && -1 != d && (x.play(d), (e.px = d));
            d = 0;
            for (f = this.Jc; d < f.length; ) {
              g = f[d];
              ++d;
              var h = new t(g.x, g.y);
              h.sf(b) <= e.Dh + 5 * this.ga &&
                (h.Ya(c, e.x, e.y),
                (g.x = h.x),
                (g.y = h.y),
                null != g.kb && (g.kb.Hc.g.Pb(h), g.kb.Hc.th.Pb(h)));
            }
            d = 0;
            for (f = this.Qi; d < f.length; )
              (g = f[d]),
                ++d,
                (h = new t(g.x, g.y)),
                h.sf(b) <= e.Dh + 5 * this.ga &&
                  (h.Ya(c, e.x, e.y),
                  (g.x = h.x),
                  (g.y = h.y),
                  (g.rotation += c * nc),
                  g.Gd());
            d = 0;
            for (f = this.bubbles; d < f.length; )
              (g = f[d]),
                ++d,
                (h = new t(g.x, g.y)),
                h.sf(b) <= e.Dh + 10 * this.ga &&
                  g != this.gd &&
                  g != this.pc &&
                  g != this.xc &&
                  (h.Ya(c, e.x, e.y), (g.x = h.x), (g.y = h.y));
            U.ik(
              this.Ja.x,
              this.Ja.y,
              e.x - e.size,
              e.y - e.size,
              2 * e.size,
              2 * e.size
            ) &&
              ((b = new t(this.Ja.x, this.Ja.y)),
              b.Ya(c, e.x, e.y),
              (this.Ja.x = b.x),
              (this.Ja.y = b.y));
            e.xo.Pb(a);
            return;
          }
        e = 0;
        for (f = this.bj; e < f.length; ) if (f[e++].jQ(c, d, b)) return;
        f = 0;
        for (g = this.Jc; f < g.length; )
          if (((e = g[f]), ++f, null != e)) {
            if (e.Yf && e.Qm == b) {
              e.aO(a);
              return;
            }
            if (0 < e.Gf && e.cm == b) {
              e.bw
                ? (e.y = Jb.zA(a.y, e.am, e.Yl))
                : (e.x = Jb.zA(a.x, e.am, e.Yl));
              null != e.kb &&
                ((a = e.kb.Hc), (a.g.x = a.th.x = e.x), (a.g.y = a.th.y = e.y));
              return;
            }
          }
        e = !1;
        this.nc.Fx(c, d, b) && (e = !0);
        if (this.bi[b]) {
          c = new t(0, 0);
          f = new nh(t.tb(this.Zi[b], c), t.tb(a, c), 5, 5, db.qT.Zb());
          c = this.Cj[b];
          d = 0;
          if (!e)
            for (c.push(f), e = 0; e < c.length; )
              (f = c[e]), ++e, (d += this.yc(f.start, f.end, !1));
          this.kk[b].Pb(this.Zi[b]);
          this.Zi[b].Pb(a);
        }
      }
    }
    yS() {
      this.yh = new F(0, 0, 0, 1);
      this.Pf = new F(0, 0, 0, 1);
      this.Kc = new F(0, 0, 0, 1);
      this.el = 0;
      var a = this.Bb.Jk,
        b = this.yh;
      b.x = (a.A + a.B) / 2;
      b.y = (a.D + a.G) / 2;
      if (0 != this.he.x || 0 != this.he.y) this.el = 1;
      0 < this.he.x
        ? ((b = this.Pf),
          (b.x = (a.A + a.B) / 2 + (a.B - a.A)),
          (b.y = (a.D + a.G) / 2))
        : 0 > this.he.x &&
          ((b = this.Pf),
          (b.x = (a.A + a.B) / 2 - (a.B - a.A)),
          (b.y = (a.D + a.G) / 2));
      if (0 < this.he.y) {
        b = this.Pf;
        var c = this.yh;
        b.x = c.x + 0;
        b.y = c.y + (a.G - a.D);
      } else
        0 > this.he.y &&
          ((b = this.Pf),
          (c = this.yh),
          (b.x = c.x - 0),
          (b.y = c.y - (a.G - a.D)));
      1 == this.el &&
        ((this.xs = -0.5),
        (this.Gl = !0),
        (a = this.Bb.g),
        (b = this.yh),
        (a.x = b.x),
        (a.y = b.y));
      this.Bb.update();
      this.Pr =
        2 != this.Aa ? this.Mi(this.xa) || this.Mi(this.Ia) : this.Mi(this.da);
      if (this.$c)
        for (a = 0, b = this.rc; a < b.length; )
          if (this.Mi(b[a++].constraint)) {
            this.Pr = !0;
            break;
          }
    }
    Mi(a) {
      return !this.Bb.GO(a.g.x, a.g.y);
    }
    eE(a) {
      return z.language != a.locale;
    }
    Kr() {
      $a.toggle();
      this.ri = $a.EO();
      x.play(this.ri ? x.wJ : x.xJ);
    }
    sR(a) {
      let b = 0,
        c = this.Cd;
      for (; b < c.length; ) {
        let d = c[b];
        ++b;
        d.LE == a && d.tR();
      }
    }
    mB(a, b, c) {
      let d = t.Ha(a.g, b.g).Rb();
      if (d < c)
        if (c - d < (1e3 / (a.sb.Rb() + b.sb.Rb())) * 2) {
          var e = Math.acos(
              t.Wp(a.g.x > b.g.x ? t.Ha(a.g, b.g) : t.Ha(b.g, a.g)).x
            ),
            f = Math.abs(((c - d) / 2) * Math.cos(e));
          c = Math.abs(((c - d) / 2) * Math.sin(e));
          a.g.x <= b.g.x
            ? ((a.g.x -= f), (b.g.x += f))
            : ((b.g.x -= f), (a.g.x += f));
          a.g.y <= b.g.y
            ? ((a.g.y -= c), (b.g.y += c))
            : ((b.g.y -= c), (a.g.y += c));
        } else {
          var g = t.Ha(b.g, a.g),
            h = -g.y,
            m = g.x;
          f = (a.sb.x * g.x + a.sb.y * g.y) / c;
          e = (a.sb.x * h + a.sb.y * m) / c;
          h = (b.sb.x * h + a.sb.x * m) / c;
          m = f;
          f = (b.sb.x * g.x + a.sb.x * g.y) / c;
          let n = g.x / c;
          g = g.y / c;
          a.sb = new t(f * n - e * g, f * g + e * n);
          b.sb = new t(m * n - h * g, m * g + h * n);
          e = Math.acos(
            t.Wp(a.g.x > b.g.x ? t.Ha(a.g, b.g) : t.Ha(b.g, a.g)).x
          );
          f = Math.abs(((c - d) / 2) * Math.cos(e));
          c = Math.abs(((c - d) / 2) * Math.sin(e));
          a.g.x <= b.g.x
            ? ((a.g.x -= f), (b.g.x += f))
            : ((b.g.x -= f), (a.g.x += f));
          a.g.y <= b.g.y
            ? ((a.g.y -= c), (b.g.y += c))
            : ((b.g.y -= c), (a.g.y += c));
          a.xd = t.Vp(a.sb, 60);
          a.ha = t.Ha(a.g, a.xd);
          b.xd = t.Vp(b.sb, 60);
          b.ha = t.Ha(b.g, b.xd);
        }
    }
    UE(a) {
      if (this.Bd == a) {
        for (var b = (this.Bd = 0), c = this.Ep; b < c.length; ) {
          var d = c[b];
          ++b;
          null != d && (d.Bd == a ? d.show() : d.mh());
        }
        b = 0;
        for (c = this.Dp; b < c.length; )
          (d = c[b]), ++b, null != d && (d.Bd == a ? d.show() : d.mh());
      }
    }
    update(a) {
      function b(w) {
        w.Uh(new t(-w.sb.x / Ti, -w.sb.y / Ti + Ej), a);
      }
      function c(w, H, I) {
        let R = H.x;
        H = H.y;
        let L = w.Gb,
          N = w.Xb,
          O = w.Tc;
        w = w.qd;
        return U.Xj(
          L.x + R,
          L.y + H,
          N.x + R,
          N.y + H,
          I.g.x - 16,
          I.g.y - 16,
          32,
          32
        )
          ? !0
          : U.Xj(
              O.x + R,
              O.y + H,
              w.x + R,
              w.y + H,
              I.g.x - 16,
              I.g.y - 16,
              32,
              32
            );
      }
      function d(w, H) {
        return U.Xj(
          w.Gb.x,
          w.Gb.y,
          w.Xb.x,
          w.Xb.y,
          H.g.x - 6,
          H.g.y - 6,
          12,
          12
        )
          ? !0
          : U.Xj(w.Tc.x, w.Tc.y, w.qd.x, w.qd.y, H.g.x - 6, H.g.y - 6, 12, 12);
      }
      super.update(a);
      let e = 0,
        f = this.vu;
      for (; e < f.length; ) f[e++].update(a);
      let g = this.nm;
      null != g && g.update(a);
      let h = 0;
      for (; 5 > h; ) {
        let w = this.Cj[h++],
          H = w.length,
          I = 0;
        for (; I < H; ) {
          let R = w[I],
            L = Ia.bk(R.color.a, 0, 10, a);
          R.color.a = L.value;
          L.pk ? (w.splice(I, 1), --H) : ++I;
        }
      }
      0 == this.Zk && ((this.Ol += a), 30 < this.Ol && (this.Ol = 0));
      let m = this.yg / this.xg,
        n = this.O.window.eo(),
        q = n.w / n.J,
        p = 1 < m && 1 < q && q > m;
      switch (this.el) {
        case 0:
          this.gp += a;
          break;
        case 1:
          this.xs += a * (this.wA ? 3 : 1);
          let w = 0;
          0 <= this.xs && (w = Math.min(1, this.xs / 2));
          let H = ua.PQ()(w),
            I = this.yh,
            R = this.Pf,
            L = new F(I.x + (R.x - I.x) * H, I.y + (R.y - I.y) * H, 0, 1);
          p
            ? ((L = new F(this.yg / 2, this.xg / 2, 0, 1)),
              (w = 1),
              (this.Bb.Kb.x = 0.5),
              (this.Bb.Kb.y = 0.5))
            : (0 < this.he.x && (this.Bb.Kb.x = H),
              0 > this.he.x && (this.Bb.Kb.x = 1 - H),
              0 < this.he.y && (this.Bb.Kb.y = H),
              0 > this.he.y && (this.Bb.Kb.y = 1 - H));
          let N = this.Bb.g;
          N.x = L.x;
          N.y = L.y;
          if (1 == w) {
            this.wA = this.Gl = !1;
            this.el = 2;
            this.hi = 0;
            let G = this.Kc;
            G.x = this.Pf.x;
            G.y = this.Pf.y;
          }
          break;
        case 2:
          this.gp += a;
          let O = 2 != this.Aa ? this.xa : this.da;
          this.hi += 0.05;
          1 < this.hi && (this.hi = 1);
          if (p) {
            let G = this.Bb.Kb;
            G.x = 0.5;
            G.y = 0.5;
            let T = this.Bb.g;
            T.x = this.yg / 2;
            T.y = this.xg / 2;
          } else {
            if (0 != this.he.x) {
              let G = this.Bb.EN(O.g.x, O.g.y);
              100 > G ? (G = 100) : 300 < G && (G = 300);
              100 >= G && (this.hi = 1);
              this.Kc.x +=
                (O.g.x - this.Kc.x) * Ua(G, 100, 300, 0.5, 0.1) * this.hi;
              let T = Math.min(this.yh.x, this.Pf.x),
                ka = Math.max(this.yh.x, this.Pf.x);
              this.Kc.x < T && (this.Kc.x = T);
              this.Kc.x > ka && (this.Kc.x = ka);
              this.Bb.g.x = this.Kc.x;
              this.Bb.Kb.x = Ua(this.Kc.x, T, ka, 0, 1);
            }
            if (0 != this.he.y) {
              let G = this.Bb.DN(O.g.x, O.g.y);
              100 >= G && (this.hi = 1);
              100 > G ? (G = 100) : 300 < G && (G = 300);
              this.Kc.y +=
                (O.g.y - this.Kc.y) * Ua(G, 100, 300, 0.5, 0.1) * this.hi;
              let T = Math.min(this.yh.y, this.Pf.y),
                ka = Math.max(this.yh.y, this.Pf.y);
              this.Kc.y < T && (this.Kc.y = T);
              this.Kc.y > ka && (this.Kc.y = ka);
              this.Bb.g.y = this.Kc.y;
              this.Bb.Kb.y = Ua(this.Kc.y, T, ka, 0, 1);
            }
          }
      }
      this.Bb.update();
      let v = this.Jc.length,
        u = this;
      if (0 < v) {
        let w = !1,
          H = !1,
          I = !1,
          R = 0,
          L = this.rc;
        for (; R < L.length; ) L[R++].IB = !0;
        let N = 0;
        for (; N < v; ) {
          let O = this.Jc[N++];
          if (null == O) continue;
          O.update(a);
          let G = O.kb;
          if (this.se.xi() && null != G && -1 == G.yc) this.qk(!0);
          else {
            null != O.pb &&
              null != G &&
              ((G.Hc.g.x = O.x), (G.Hc.g.y = O.y), G.Hc.th.Pb(G.Hc.g));
            if (null != G) {
              if (-1 != G.yc && 0 == G.$g) {
                O.Ku();
                continue;
              }
              G.update(a * this.xm);
              O.ve &&
                (1 == this.el || this.Gl || O.jT(a), -1 == O.Dk && this.vS(O));
            }
            if (-1 != O.Z && null == O.kb) {
              let T = function (W, ba) {
                return new t(ba.x, ba.y).sf(W.g) <= ba.Z + bb.$f
                  ? ((W = new ae(
                      u.ma(6),
                      null,
                      ba.x,
                      ba.y,
                      W,
                      W.g.x,
                      W.g.y,
                      ba.Z + bb.$f
                    )),
                    W.Hc.th.Pb(W.Hc.g),
                    (ba.jo = !0),
                    ba.XD(W),
                    x.play(x.GJ),
                    null != ba.pb && x.play(x.sJ),
                    !0)
                  : !1;
              };
              2 != this.Aa
                ? (this.kd || (T(this.xa, O) && this.rn()),
                  this.ld || null != O.kb || (T(this.Ia, O) && this.rn()))
                : T(this.da, O) && this.rn();
              let ka = 0,
                Ha = this.rc;
              for (; ka < Ha.length; ) T(Ha[ka++].constraint, O);
            }
            if (null != G) {
              let T = G.za[G.za.length - 1],
                ka = !1;
              w ||
                (2 != this.Aa
                  ? T != this.xa || this.kd || H
                    ? T != this.Ia || this.ld || I || (ka = !0)
                    : (ka = !0)
                  : this.tc || w || (ka = !0));
              if (0 != G.xw && -1 == G.yc && ka) {
                let Ha = t.Ha(G.Hc.g, T.g).em() * nc;
                if (2 != this.Aa) {
                  let W = T == this.xa ? this.La : this.Ma;
                  G.Fn || (G.ph = W.rotation - Ha);
                  T == this.xa
                    ? ((this.vo = Ha + G.ph - W.rotation), (H = !0))
                    : ((this.wo = Ha + G.ph - W.rotation), (I = !0));
                  this.I.rotation = Ha + G.ph;
                  W.rotation = Ha + G.ph;
                } else
                  G.Fn || (G.ph = this.I.rotation - Ha),
                    (this.I.tg = Ha + G.ph - this.I.rotation),
                    (this.I.rotation = Ha + G.ph),
                    (w = !0);
                G.Fn = !0;
              } else G.Fn = !1;
            }
          }
        }
        2 != this.Aa
          ? (H ||
              this.kd ||
              ((this.La.rotation += Math.min(5, this.vo)), (this.vo *= 0.98)),
            I ||
              this.ld ||
              ((this.Ma.rotation += Math.min(5, this.wo)), (this.wo *= 0.98)))
          : w ||
            this.tc ||
            ((this.I.rotation += Math.min(5, this.I.tg)), (this.I.tg *= 0.98));
      }
      let A = 0,
        C = this.rc;
      for (; A < C.length; ) {
        let w = C[A];
        ++A;
        w.IB || ((w.rotation += Math.min(5, w.tg)), (w.tg *= 0.98));
      }
      if (this.$c) {
        let w = 0,
          H = this.rc;
        for (; w < H.length; ) {
          let L = H[w];
          ++w;
          let N = L.constraint;
          if (!this.Ve) {
            t.nd(N.g.x, N.g.y, this.Ja.x, this.Ja.y) < L.YB
              ? this.Ja.Em(!0)
              : this.Ja.Em(!1);
            let O = 0,
              G = this.Za;
            for (; O < G.length; ) {
              let T = G[O];
              ++O;
              T.Em(t.nd(N.g.x, N.g.y, T.x, T.y) < L.YB);
            }
          }
        }
        let I = 0,
          R = this.rc;
        for (; I < R.length; ) {
          let L = R[I];
          ++I;
          if (null != L.Ec) continue;
          let N = 2 * bb.$f;
          2 == this.Aa &&
            (this.tc || null != this.I.Ec || this.mB(L.constraint, this.da, N));
          let O = 0,
            G = this.rc;
          for (; O < G.length; ) {
            let T = G[O];
            ++O;
            L != T && null == T.Ec && this.mB(L.constraint, T.constraint, N);
          }
        }
      }
      if (0 < a) {
        let w = a;
        for (; 0 <= w; )
          (w -= 0.01),
            this.nc.update(Math.min(0.01, w)),
            this.nc.il(this.bubbles),
            this.nc.il(this.Za),
            this.nc.il(this.tj),
            this.nc.il(this.Eh),
            this.nc.il(this.bj),
            this.nc.il(this.Qi);
      }
      this.tc ||
        (this.I.update(a),
        (this.ci -= a),
        0 >= this.ci && (this.se.xi() || this.da.update(a * this.xm)));
      if (2 != this.Aa) {
        let w = a * this.xm;
        this.ci -= a;
        this.La.update(a);
        0 >= this.ci && this.xa.update(w);
        this.Ma.update(a);
        0 >= this.ci && this.Ia.update(w);
        if (1 == this.Aa) {
          let H = 0;
          for (; 30 > H; ) ++H, this.xa.us(), this.Ia.us();
        }
        if (0 < this.Ki) {
          let H = Ia.bk(this.Ki, 0, 200, a);
          this.Ki = H.value;
          if (H.pk) {
            x.play(x.uJ);
            this.Aa = 2;
            this.tc = !1;
            this.ld = this.kd = !0;
            let I = !1,
              R = !1,
              L = 0,
              N = this.zf;
            for (; L < N.length; ) {
              let ba = N[L];
              ++L;
              null != ba &&
                (null != this.xc && ba.ca == this.xc && (I = !0),
                null != this.pc && ba.ca == this.pc && (R = !0));
            }
            if (null != this.xc && null != this.pc && I && R) this.dE = !0;
            else if (null == this.xc || !I)
              if (null == this.pc || !R)
                if (null != this.xc || null != this.pc) {
                  let ba = 0,
                    cb = this.zf;
                  for (; ba < cb.length; ) {
                    let Ab = cb[ba];
                    ++ba;
                    null != Ab &&
                      (null != this.xc &&
                        Ab.ca == this.xc &&
                        ((Ab.kg = !0), Ab.Ri(1)),
                      null != this.pc &&
                        Ab.ca == this.pc &&
                        ((Ab.kg = !0), Ab.Ri(1)));
                  }
                }
            if (null != this.xc || null != this.pc)
              (this.gd = null != this.xc ? this.xc : this.pc),
                this.vj.show(),
                this.wj.mh(),
                this.xj.mh();
            this.wo = this.vo = this.I.tg = 0;
            this.da.g.x = this.xa.g.x;
            this.da.g.y = this.xa.g.y;
            this.I.x = this.da.g.x;
            this.I.y = this.da.g.y;
            let O = t.Ha(this.xa.g, this.xa.ha),
              G = t.Ha(this.Ia.g, this.Ia.ha),
              T = new t((O.x + G.x) / 2, (O.y + G.y) / 2);
            this.da.ha.Pb(this.da.g);
            this.da.ha.ux(T);
            let ka = 0,
              Ha = this.Jc;
            for (; ka < Ha.length; ) {
              let ba = Ha[ka++].kb;
              if (
                null != ba &&
                ba.yc != ba.za.length - 3 &&
                (ba.Mb == this.xa || ba.Mb == this.Ia)
              ) {
                let cb = ba.za[ba.za.length - 2],
                  Ab = ba.Mb.xh(cb);
                this.da.Wk(cb, Ab, 0);
                ba.Mb = this.da;
                ba.za[ba.za.length - 1] = this.da;
                ba.ph = 0;
                ba.Fn = !1;
              }
            }
            this.La.T.F();
            this.Ma.T.F();
            let W = new y(null, r.I, k.$G);
            this.ma(11).P(W.u);
            W.o(this.I.x);
            W.m(this.I.y);
            W.C();
            W.pa().QC(Fj);
          } else this.xa.oq(this.Ia, this.Ki), this.Ia.oq(this.xa, this.Ki);
        }
        this.kd ||
          this.ld ||
          0 != this.Aa ||
          (this.Km(this.xa, this.La),
          this.Km(this.Ia, this.Ma),
          Ea.so(this.La, this.Ma) &&
            ((this.Aa = 1),
            (this.Ki = this.xa.g.sf(this.Ia.g)),
            this.xa.Wk(this.Ia, this.Ki, 1),
            this.Ia.Wk(this.xa, this.Ki, 1)));
      }
      let B = 0,
        K = this.rc;
      for (; B < K.length; ) {
        let w = K[B];
        ++B;
        w.update(a);
        w.constraint.update(a * this.xm);
        let H = 0;
        for (; 30 > H; ) ++H, w.constraint.us();
      }
      this.Ja.update(a);
      0 <= this.cr && ((this.cr -= a), 0 > this.cr && !this.$c && this.Ja.BQ());
      0 <= this.lq && ((this.lq -= a), 0 > this.lq && this.I.uQ());
      if (!this.Gl) {
        let w = 0,
          H = this.Za;
        for (; w < H.length; ) {
          let I = H[w];
          ++w;
          I.update(a);
          let R = [];
          this.tc
            ? 2 != this.Aa &&
              (null != this.La && R.push(this.La),
              null != this.Ma && R.push(this.Ma))
            : R.push(this.I);
          if (this.Ml && !this.qh && !I.DO) {
            let L = 0;
            for (; L < R.length; ) {
              let N = R[L];
              ++L;
              let O = N.x - I.x,
                G = N.y - I.y;
              95 > Math.sqrt(O * O + G * G) &&
                ((I.pb =
                  null != I.pb ? pd.CB(N, I.pb.g) : pd.CB(N, new t(I.x, I.y))),
                (I.DO = !0),
                x.play(x.AJ));
            }
          }
          if (0 < I.timeout && 0 == I.time) {
            this.nc.remove(I);
            ta.remove(this.Za, I);
            let L = I.j;
            L.nb(0).Sb().alpha(0, 0.25);
            L.nb(1).Sb().scale(0, 0.25);
            L.nb(2).Sb().scale(0, 0.25, null, null, P(I, I.F));
            break;
          } else {
            let L = !1;
            2 != this.Aa
              ? (this.Km(this.xa, this.La),
                this.Km(this.Ia, this.Ma),
                (L =
                  (Ea.so(this.La, I) && !this.kd) ||
                  (Ea.so(this.Ma, I) && !this.ld)))
              : (this.Km(this.da, this.I), (L = Ea.so(this.I, I) && !this.tc));
            (this.$c && I.ee) || !this.$c || (L = !1);
            if (L) {
              this.I.RC();
              this.rp++;
              this.Ei.mw(this.rp);
              let N = new y(null, r.Na, k.cI);
              N.o(I.x);
              N.m(I.y);
              N.H(0.4);
              N.pa().QC(Gj);
              N.C();
              this.Wi.P(N.u);
              I.F();
              this.nc.remove(I);
              ta.remove(this.Za, I);
              x.play([1013, 1012, 1011][this.rp - 1]);
              this.Ja.zO() && this.Ja.SC();
              break;
            }
          }
        }
      }
      let E = 0,
        aa = this.bubbles;
      for (; E < aa.length; ) {
        let w = aa[E];
        ++E;
        w.update(a);
        if (!w.Vr)
          if (2 != this.Aa) {
            if (!this.kd && this.Ev(w, this.La, this.xc, this.wj)) {
              this.xc = w;
              break;
            }
            if (!this.ld && this.Ev(w, this.Ma, this.pc, this.xj)) {
              this.pc = w;
              break;
            }
          } else if (!this.tc && this.Ev(w, this.I, this.gd, this.vj)) {
            this.gd = w;
            break;
          }
        let H = 0,
          I = this.rc;
        for (; H < I.length; ) {
          let R = I[H];
          ++H;
          if (!w.Vr && U.ik(R.x, R.y, w.x - 34, w.y - 34, 68, 68)) {
            let L = !1,
              N = 0,
              O = this.zf;
            for (; N < O.length; ) {
              let G = O[N];
              ++N;
              G.ca == w && ((G.kg = !1), (L = !0));
            }
            if (null == R.ca || !L) {
              if (null != R.ca) {
                this.om(w.x, w.y);
                let G = 0,
                  T = this.zf;
                for (; G < T.length; ) {
                  let ka = T[G];
                  ++G;
                  ka.ca == R.ca && ((ka.kg = !0), ka.Ri(1));
                }
                R.ca = null;
              }
              R.ca = w;
              R.zn.show();
              x.play(x.Ty);
              w.pop();
            }
          }
        }
        if (!w.iF) {
          let R = this.Ud.length,
            L = 0;
          for (; L < R; ) {
            let N = this.Ud[L++];
            t.nd(w.x, w.y, N.x, N.y) < N.Dh && (w.iF = !0);
          }
        }
      }
      let Z = 0,
        V = this.Ep;
      for (; Z < V.length; ) V[Z++].update(a);
      let ea = 0,
        xa = this.Dp;
      for (; ea < xa.length; ) xa[ea++].update(a);
      let pa = -1,
        fa = 0,
        sa = this.Ud.length;
      for (; fa < sa; ) {
        let w = this.Ud[fa],
          H = 0;
        for (; H < v; ) {
          let L = this.Jc[H++],
            N = w.ig.indexOf(L);
          t.nd(L.x, L.y, w.x, w.y) <= w.Dh + 5 * this.ga
            ? 0 > N && w.ig.push(L)
            : 0 <= N && ta.remove(w.ig, L);
        }
        let I = this.bubbles.length,
          R = 0;
        for (; R < I; ) {
          let L = this.bubbles[R++],
            N = w.ig.indexOf(L);
          t.nd(L.x, L.y, w.x, w.y) <= w.Dh + 10 * this.ga
            ? 0 > N && w.ig.push(L)
            : 0 <= N && ta.remove(w.ig, L);
        }
        w.xT && (pa = fa);
        w.update(a);
        ++fa;
      }
      0 <= pa && (this.Ud[pa].F(), this.Ud.splice(pa, 1));
      let Ga = 0,
        qa = this.Eh;
      for (; Ga < qa.length; ) {
        let w = qa[Ga];
        ++Ga;
        w.update(a);
        let H = Ia.bk(w.pr, 0, 1, a);
        w.pr = H.value;
        H.pk && (w.state = 0);
        let I = w.rotation;
        w.rotation = 0;
        w.Gd();
        w.rotation = I;
        w.Gd();
        let R = function (G) {
            let T = 2 * Za.Nk;
            return U.Xj(
              w.Gb.x,
              w.Gb.y,
              w.Xb.x,
              w.Xb.y,
              G.g.x - Za.Nk,
              G.g.y - Za.Nk,
              T,
              T
            );
          },
          L = function (G) {
            let T = 2 * Za.Nk;
            return U.Xj(
              w.Tc.x,
              w.Tc.y,
              w.qd.x,
              w.qd.y,
              G.g.x - Za.Nk,
              G.g.y - Za.Nk,
              T,
              T
            );
          };
        if (0 != w.state) continue;
        if (2 == this.Aa && null == this.I.Ec) {
          let G = this.da.xd.Zb();
          G.rotate(-I * La);
          if (0 <= G.y && (R(this.da) || L(this.da))) {
            let T = 0,
              ka = this.Eh.length;
            for (; T < ka; ) {
              let Ha = this.Eh[T++];
              if (Ha != w && Ha.group == w.group) {
                Ha.state = 1;
                Ha.pr = 0.8;
                this.qk(!1);
                this.I.Kw = 0.9 * this.da.sb.Rb() * ra.Ny;
                this.I.Ec = Ha;
                w.qc.M(!0);
                w.qc.pa().play(qh);
                x.play(x.Wy);
                let W = this,
                  ba = this.I;
                this.delay(function () {
                  W.CE(ba);
                }, 0.1);
                break;
              }
            }
          }
        }
        let N = 0,
          O = this.rc;
        for (; N < O.length; ) {
          let G = O[N];
          ++N;
          if (null != G.Ec) continue;
          let T = G.constraint.xd.Zb();
          T.rotate(-I * La);
          if ((0 <= T.y && R(G.constraint)) || L(G.constraint)) {
            let ka = 0,
              Ha = this.Eh.length;
            for (; ka < Ha; ) {
              let W = this.Eh[ka++];
              if (W != w && W.group == w.group) {
                W.state = 1;
                W.pr = 0.8;
                this.bR(G);
                G.Kw = 0.9 * G.constraint.sb.Rb();
                G.Ec = W;
                w.qc.M(!0);
                w.qc.pa().play(qh);
                x.play(x.Wy);
                let ba = this,
                  cb = G;
                this.delay(function () {
                  ba.CE(cb);
                }, 0.1);
                break;
              }
            }
          }
        }
      }
      let ia = 0,
        ab = this.zf;
      for (; ia < ab.length; ) ab[ia++].update(a);
      let lb = 0,
        Ra = this.Qi;
      for (; lb < Ra.length; ) {
        let w = Ra[lb];
        ++lb;
        w.update(a);
        let H = Ia.bk(w.zp, 0, 1, a);
        w.zp = H.value;
        H.pk && this.mQ(w, a);
      }
      let mb = 0,
        ge = this.bj;
      for (; mb < ge.length; ) {
        let w = ge[mb];
        ++mb;
        null != w && (w.update(a), 3 != w.Ee && this.nQ(w, a));
      }
      let qd = 0,
        he = this.Pl;
      for (; qd < he.length; ) {
        let w = he[qd];
        ++qd;
        if (
          null != w &&
          (w.update(a),
          !this.qh &&
            0 == w.Uj &&
            32 > t.nd(this.da.g.x, this.da.g.y, w.x, w.y))
        ) {
          this.qh = !0;
          this.I.oe = !1;
          this.I.j.Sb().scale(0.3, 0.1);
          this.I.j.Sb().alpha(0, 0.1);
          this.I.j.Sb().lF(w.x, w.y);
          this.qk(!1);
          null != this.gd && this.jk(this.gd, !1);
          let H = this.da,
            I = w;
          this.delay(function () {
            I.dA(H);
          }, 0.05);
          this.UE(3);
        }
      }
      let ie = 0,
        Ui = this.Cd;
      for (; ie < Ui.length; ) Ui[ie++].update(a);
      if (this.Ve && !this.qh) {
        let w = 0,
          H = this.Cd;
        for (; w < H.length; ) {
          let I = H[w];
          ++w;
          let R = !1;
          if (!I.be || I.rl)
            2 != this.Aa
              ? ((R = !this.kd && d(I, this.xa)) &&
                  this.uv(I, this.La.constraint, a),
                (R = !this.ld && d(I, this.Ia)) &&
                  this.uv(I, this.Ma.constraint, a))
              : (R = !this.tc && d(I, this.da)) &&
                this.uv(I, this.I.constraint, a),
              R || (I.zk = !1);
        }
      } else if (!this.qh) {
        let w = 0,
          H = this.Cd;
        for (; w < H.length; ) {
          let I = H[w];
          ++w;
          if (!I.be || I.rl) {
            let R = !1,
              L = !1;
            2 != this.Aa
              ? (R = !this.kd && d(I, this.xa))
                ? (L = !0)
                : (R = !this.ld && d(I, this.Ia))
              : (R = !this.tc && d(I, this.da));
            if (R) {
              2 != this.Aa
                ? L
                  ? null != this.xc && this.jk(this.xc, !0)
                  : null != this.pc && this.jk(this.pc, !1)
                : null != this.gd && this.jk(this.gd, !1);
              let N = new Bf(this, 5);
              this.vu.push(N);
              null == this.Qd || this.ri || ((N.Kb.y = -500), (N.angle = 90));
              2 != this.Aa
                ? L
                  ? ((N.x = this.La.x), (N.y = this.La.y), (this.kd = !0))
                  : ((N.x = this.Ma.x), (N.y = this.Ma.y), (this.ld = !0))
                : ((N.x = this.I.x),
                  (N.y = this.I.y),
                  (this.tc = !0),
                  this.I.F());
              N.Jm(5);
              x.play(x.tJ);
              this.qk(L);
              if (this.vm) return;
              this.delay(P(this, this.Zu), 0.3);
              return;
            }
          }
        }
      }
      let ii = 0,
        Vi = this.tj;
      for (; ii < Vi.length; ) {
        let w = Vi[ii];
        ++ii;
        w.update(a);
        let H = t.Ha(new t(w.x, w.y), w.Yr),
          I = H.Rb(),
          R = 1,
          L = new t(0, 0);
        1 <= I && ((R = I | 0), (L = t.Vp(H, R)));
        let N = new t(0, 0),
          O = !1,
          G = !1;
        if (2 != this.Aa) {
          O = !1;
          let W = 0,
            ba = R;
          for (; W < ba; ) {
            let cb = t.Ob(L, W++);
            if ((O = O || c(w, cb, this.xa))) {
              N = cb.Zb();
              break;
            }
          }
          if ((O = O && !this.kd)) G = !0;
          else {
            O = !1;
            let cb = 0,
              Ab = R;
            for (; cb < Ab; ) {
              let Wi = t.Ob(L, cb++);
              if ((O = O || c(w, Wi, this.Ia))) {
                N = Wi.Zb();
                break;
              }
            }
            O = O && !this.ld;
          }
        } else {
          O = !1;
          let W = 0,
            ba = R;
          for (; W < ba; ) {
            let cb = t.Ob(L, W++);
            (O = O || c(w, cb, this.da)) && (N = cb.Zb());
          }
          O = O && !this.tc;
        }
        let T = function (W) {
          W.g.x += H.x - N.x;
          W.g.y += H.y - N.y;
          W.ha.x += H.x - N.x;
          W.ha.y += H.y - N.y;
        };
        O
          ? 2 != this.Aa
            ? G
              ? (T(this.xa), this.gr(w, this.xa, a))
              : (T(this.Ia), this.gr(w, this.Ia, a))
            : (T(this.da), this.gr(w, this.da, a))
          : (w.zk = !1);
        O = !1;
        let ka = 0,
          Ha = this.rc;
        for (; ka < Ha.length; ) {
          let W = Ha[ka];
          ++ka;
          O = !1;
          let ba = 0,
            cb = R;
          for (; ba < cb; ) {
            let Ab = ba++;
            O = O || c(w, t.Ob(L, Ab), W.constraint);
          }
          O ? (T(W.constraint), this.gr(w, W.constraint, a)) : (w.zk = !1);
        }
        w.iA();
      }
      this.se.update(a);
      !this.se.xi() &&
        this.se.su(this.da) &&
        (this.se.xu(this.da), this.qk(!0), (this.I.tg = 0), this.UE(4));
      this.Gc.update(a);
      if (!this.fg && null == this.I.Ec && this.Ve)
        if (2 != this.Aa) {
          if (!this.kd) {
            let w = this.La.constraint.g.x - this.Gc.x,
              H = this.La.constraint.g.y - this.Gc.y;
            Math.sqrt(w * w + H * H) <= 2 * bb.$f &&
              (this.Gc.Cu(), this.Ei.jw(), (this.fg = !0));
          }
          if (!this.ld) {
            let w = this.Ma.constraint.g.x - this.Gc.x,
              H = this.Ma.constraint.g.y - this.Gc.y;
            Math.sqrt(w * w + H * H) <= 2 * bb.$f &&
              (this.Gc.Cu(), (this.fg = !0), this.Ei.jw());
          }
        } else {
          let w = this.I.constraint.g.x - this.Gc.x,
            H = this.I.constraint.g.y - this.Gc.y;
          Math.sqrt(w * w + H * H) <= 2 * bb.$f &&
            (this.Gc.Cu(), this.Ei.jw(), (this.fg = !0));
        }
      let Ej = kb.tF * (null == this.Qd || this.ri ? 1 : -1),
        Ti = kb.sF;
      0 == this.Aa &&
        (null != this.xc && b(this.xa), null != this.pc && b(this.Ia));
      if (1 == this.Aa) {
        if (null != this.xc || null != this.pc) b(this.xa), b(this.Ia);
      } else null == this.gd || this.se.xi() || b(this.da);
      let ji = 0,
        Xi = this.rc;
      for (; ji < Xi.length; ) {
        let w = Xi[ji];
        ++ji;
        null != w.ca && b(w.constraint);
      }
      let vh;
      if (!this.tc && !this.Gr) {
        if (this.aw)
          0 < this.Ko &&
            ((this.Ko = Ia.ak(this.Ko, 0, 1, a)),
            0 >= this.Ko &&
              ((vh = new t(this.Ja.x, this.Ja.y)),
              this.da.g.sf(vh) > Yb.Cy
                ? ((this.aw = !1), this.Ja.EQ(), x.play(x.BJ))
                : (this.Ko = 1)));
        else {
          let w = !0;
          this.qh ? (w = !1) : this.$c && !this.Ja.ee && (w = !1);
          w &&
            ((vh = new t(this.Ja.x, this.Ja.y)),
            this.da.g.sf(vh) < Yb.Cy &&
              ((this.aw = !0), this.Ja.FQ(), x.play(x.CJ), (this.Ko = 1)));
        }
        if (
          !this.vm &&
          !this.cA &&
          (!this.$c || (this.$c && this.Ja.ee)) &&
          this.UM(this.I, this.gd, this.Ja, this.da)
        ) {
          this.tc = this.cA = !0;
          this.yl();
          return;
        }
      }
      if (this.Ve) {
        2 != this.Aa
          ? (this.tv(this.La.constraint), this.tv(this.Ma.constraint))
          : this.tv(this.I.constraint);
        this.qn += a;
        if (
          this.bi[0] &&
          (this.dg.isActive || (this.Ja.yQ(), this.dg.LD(!0)), 0.3 < this.qn)
        ) {
          let w = new t(this.kk[0].x, this.kk[0].y),
            H;
          H = 0.15 > this.qn ? ((this.qn - 0.3) / 0.15) * 70 : 70;
          let I = this.dg.Pi.x,
            R = this.dg.Pi.y,
            L,
            N;
          if (2 == this.Aa) {
            L = I - this.I.constraint.g.x;
            N = R - this.I.constraint.g.y;
            let O = Math.sqrt(L * L + N * N),
              G = t.Ha(this.I.constraint.g, w);
            G.normalize();
            200 >= O &&
              ((H *= 1 - 0.005 * O), this.I.constraint.Uh(t.Ob(G, H), a));
          } else {
            L = I - this.La.constraint.g.x;
            N = R - this.La.constraint.g.y;
            let O = Math.sqrt(L * L + N * N);
            L = I - this.Ma.constraint.g.x;
            N = R - this.Ma.constraint.g.y;
            let G = Math.sqrt(L * L + N * N),
              T = t.Ha(this.La.constraint.g, w);
            T.normalize();
            let ka = t.Ha(this.Ma.constraint.g, w);
            ka.normalize();
            200 >= O && this.La.constraint.Uh(t.Ob(T, H * (1 - 0.005 * O)), a);
            200 >= G && this.Ma.constraint.Uh(t.Ob(ka, H * (1 - 0.005 * G)), a);
          }
        }
        if (this.bi[0])
          if (2 == this.Aa) {
            let w = t.Ha(this.I.constraint.g, this.I.constraint.ha);
            3 < w.Rb() &&
              (w.normalize(),
              (this.I.constraint.g = t.tb(this.I.constraint.ha, t.Ob(w, 3))));
          } else {
            let w = t.Ha(this.La.constraint.g, this.La.constraint.ha);
            3 < w.Rb() &&
              (w.normalize(),
              (this.La.constraint.g = t.tb(this.La.constraint.ha, t.Ob(w, 3))));
            let H = t.Ha(this.Ma.constraint.g, this.Ma.constraint.ha);
            3 < H.Rb() &&
              (H.normalize(),
              (this.Ma.constraint.g = t.tb(this.Ma.constraint.ha, t.Ob(H, 3))));
          }
      }
      let ki = 2 == this.Aa && this.Mi(this.da) && !this.tc,
        li = 2 != this.Aa && !this.kd && this.Mi(this.xa),
        wh = 2 != this.Aa && !this.ld && this.Mi(this.Ia),
        Vf = this.$c,
        mi = [];
      this.Ve && (Vf = !1);
      if (!this.Gr) {
        let w = 0,
          H = this.rc;
        for (; w < H.length; ) {
          let I = H[w];
          ++w;
          if (!this.Mi(I.constraint)) {
            Vf = !1;
            break;
          }
          this.Ve && mi.push(I);
        }
      }
      let Yi = 0;
      for (; Yi < mi.length; ) ta.remove(this.rc, mi[Yi++]);
      !this.Pr || ki || li || wh || Vf || (this.Pr = !1);
      13 == D.box && 22 == D.level && (wh = !1);
      if (1 != this.el && !this.Pr && (ki || li || wh || Vf)) {
        let w = !1;
        if (
          (2 == this.Aa && this.tc) ||
          (2 != this.Aa && (this.kd || this.ld)) ||
          this.Gr
        )
          w = !0;
        ki && (this.tc = !0);
        li && (this.kd = !0);
        wh && (this.ld = !0);
        Vf && (this.Gr = !0);
        this.vm || w || this.Zu();
      }
      if (
        1 == this.Bd &&
        !this.tc &&
        null != this.gd &&
        this.I.y < ra.vF &&
        this.I.x > ra.uF
      ) {
        let w = (this.Bd = 0),
          H = this.Ep;
        for (; w < H.length; ) {
          let L = H[w];
          ++w;
          1 == L.Bd && L.show();
        }
        let I = 0,
          R = this.Dp;
        for (; I < R.length; ) {
          let L = R[I];
          ++I;
          1 == L.Bd && L.show();
        }
      }
      this.ku.update();
      this.Wi.Hh(a);
      null != this.Ef && this.Ef.update(a);
      null != this.dg &&
        (this.bi[0] && (this.dg.Pi = new t(this.kk[0].x, this.kk[0].y)),
        this.dg.update(a),
        this.Ld.update(a),
        this.vn.update(a));
    }
    bd() {
      for (var a = 0, b = this.vu; a < b.length; ) b[a++].L();
      a = this.nm;
      null != a && a.L();
      this.Ja.L();
      a = 0;
      for (b = this.Ud; a < b.length; ) b[a++].L();
      a = 0;
      for (b = this.bubbles; a < b.length; ) b[a++].L();
      a = 0;
      for (b = this.Qi; a < b.length; ) b[a++].L();
      a = 0;
      for (b = this.Cd; a < b.length; ) b[a++].L();
      a = 0;
      for (b = this.tj; a < b.length; ) b[a++].L();
      a = 0;
      for (b = this.Eh; a < b.length; ) b[a++].L();
      a = 0;
      for (b = this.Jc; a < b.length; ) b[a++].JM();
      a = 0;
      for (b = this.Jc; a < b.length; ) b[a++].L();
      a = 0;
      for (b = this.Za; a < b.length; ) b[a++].L();
      a = 0;
      for (b = this.zf; a < b.length; ) b[a++].L();
      a = 0;
      for (b = this.bj; a < b.length; ) b[a++].L();
      a = 0;
      for (b = this.Pl; a < b.length; ) b[a++].L();
      for (a = this.nc.iterator(); a.eb(); ) a.next().L();
      this.Gc.L();
      this.Ve && (this.dg.L(), this.Ld.L(), this.vn.L());
      this.se.L();
      this.tc ||
        (null == this.I.Ec
          ? ((this.I.x = this.da.g.x),
            (this.I.y = this.da.g.y),
            (this.I.visible = !0))
          : (this.I.visible = !1),
        this.Ml &&
          !this.qh &&
          null != this.Ef &&
          ((this.Ef.x = this.I.x), (this.Ef.y = this.I.y), this.Ef.L()));
      null != this.vj && (this.vj.o(this.I.x), this.vj.m(this.I.y));
      2 != this.Aa
        ? (this.kd
            ? this.La.T.M(!1)
            : ((this.La.x = this.xa.g.x),
              (this.La.y = this.xa.g.y),
              this.La.L()),
          null != this.wj && (this.wj.o(this.La.x), this.wj.m(this.La.y)),
          this.ld
            ? this.Ma.T.M(!1)
            : ((this.Ma.x = this.Ia.g.x),
              (this.Ma.y = this.Ia.g.y),
              this.Ma.L()),
          null != this.xj && (this.xj.o(this.Ma.x), this.xj.m(this.Ma.y)),
          (this.I.visible = !1))
        : null == this.I.Ec && (this.I.visible = !0);
      this.I.L();
      a = 0;
      for (b = this.rc; a < b.length; ) b[a++].L();
      a = 0;
      for (b = this.Ep; a < b.length; ) b[a++].L();
      a = 0;
      for (b = this.Dp; a < b.length; ) b[a++].L();
      this.Wi.Fd();
      this.Wi.Nm();
      this.O.V.VQ(this.Bb.Ab);
      this.O.V.Bq(this.Wi);
      this.O.V.OQ();
    }
  }
  ra.i = !0;
  ra.s = da;
  Object.assign(ra.prototype, { l: ra });
  class Wf {
    constructor() {
      this.loaded = !1;
      this.size = new Ka(0, 0);
      this.name = this.data = null;
    }
  }
  Wf.i = !0;
  Object.assign(Wf.prototype, { l: Wf });
  class Xf {
    constructor() {
      this.size = new Ka(0, 0);
      this.V = null;
    }
    WD(a) {
      this.V = a;
    }
    CR(a, b) {
      let c = this.size;
      c.x = a;
      c.y = b;
    }
  }
  Xf.i = !0;
  Object.assign(Xf.prototype, { l: Xf });
  class je extends Xf {
    constructor() {
      super();
      this.Fc = new Ka(0, 0);
      this.Qb = new Kc();
      this.visible = !0;
      this.Gw = this.Oq = !1;
    }
    If(a, b) {
      return this.Qb.If(a, b);
    }
    eo() {
      let a = this.V.viewport,
        b = this.Fc.x,
        c = this.Fc.y;
      return new Kb((a.x * b) | 0, (a.y * c) | 0, (a.w * b) | 0, (a.J * c) | 0);
    }
    oi() {
      let a = this.V.viewport;
      return new Ka((this.Fc.x * a.w) | 0, (this.Fc.y * a.J) | 0);
    }
  }
  je.i = !0;
  je.s = Xf;
  Object.assign(je.prototype, { l: je });
  class rd {
    constructor(a) {
      this.name = a;
      this.info = new xh(this);
      this.rf = null;
      this.zP = 256;
      this.PO = 0.001;
      this.Ab = this.Wb = null;
      this.aA = [];
      this.clearColor = new F(0, 0, 0, 1);
      this.mA = new fb(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.uM = new fb(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.viewport = new Kb(0, 0, 1, 1);
      this.Cq = Array(1056);
      this.ql = Array(1056);
      this.oT = !0;
      this.ls = Array(7);
      this.ah = Array(7);
      this.nn = ni.rG[7];
      this.od = 0;
      this.yx = [];
      this.Qx = new vb();
      this.ah[0] = new ke(1, !0);
      this.ah[1] = new Lc();
      this.ah[2] = new qc();
      this.ah[3] = new Yf(!0, !0);
      this.ah[4] = new Zf(!1, 1);
      this.ah[5] = new fc(1);
      this.ah[6] = new $f();
    }
    kp(a) {
      null != this.Wb && this.Wb.WD(null);
      this.Wb = a;
      this.Wb.WD(this);
    }
    DR(a) {
      let b = this.clearColor;
      b.x = a.x;
      b.y = a.y;
      b.z = a.z;
      b.w = a.w;
    }
    uk(a) {
      this.Ab = a;
    }
    VQ(a) {
      this.aA.push(this.Ab);
      this.uk(a);
    }
    OQ() {
      this.uk(this.aA.pop());
    }
    um() {
      this.yk(0, 0, 1, 1);
    }
    yk(a, b, c, d) {
      let e = this.viewport;
      e.x = a;
      e.y = b;
      e.w = c - a;
      e.J = d - b;
    }
    Fi() {
      if (
        null == this.Wb ||
        null == this.Wb.getContext() ||
        0 == this.Wb.size.x * this.Wb.size.y
      )
        return !1;
      this.mR();
      return !0;
    }
    ei() {}
    Bq(a) {
      let b = this.Qx;
      b.clear();
      b.Mf(Oa.count);
      Ja.tN(a, b);
      0 < b.aa && this.Ou(b);
    }
    clear() {}
    mR() {
      this.od = 0;
      let a = this.nn,
        b = 0;
      for (; 7 > b; ) {
        let c = b++;
        this.ls[c] = this.ah[c];
        0 != (a & (1 << c)) && this.ls[c].set(this);
      }
    }
    Ou(a) {
      let b = a.N,
        c = 0;
      for (a = a.aa; c < a; ) this.pl(b[c++]);
    }
    pl(a) {
      let b = a.effect;
      null != b &&
        b.enabled &&
        1 != a.Ne &&
        ((this.rf = a), this.zh(a), this.Pn(b));
    }
    RN() {
      return this.yx.slice();
    }
    createTexture(a, b, c, d) {
      null == b && (b = 0);
      b = this.zv(b);
      this.yx.push(b);
      b.name = d;
      b.Uw(a);
      null != c && b.zR(c);
      return b;
    }
    lA(a, b, c) {
      let d = this.zv(a.flags);
      d.name = null == c ? "-" : c;
      a.oa(d, b.clone());
      null != c && ((a = a.hc.xf(c)), d.hc.offset(a.Nd.x, a.Nd.y));
    }
    ia(a) {
      a.F();
      ta.remove(this.yx, a);
    }
    RA(a, b) {
      a = 32 * ((b / 100) | 0) + ((a / 100) | 0);
      b = this.Cq[a];
      null == b || this.ql[a] || ((this.ql[a] = !0), b.ib(this));
      return b;
    }
    SA(a, b) {
      a = 512 + 32 * ((b / 100) | 0) + ((a / 100) | 0);
      b = this.Cq[a];
      null == b || this.ql[a] || ((this.ql[a] = !0), b.ib(this));
      return b;
    }
    md(a) {
      var b;
      null == b && (b = !1);
      let c = (a.uA / 100) | 0;
      var d = (a.Rx / 100) | 0;
      d = 512 * (b ? 1 : 0) + 32 * d + c;
      this.Cq[d] = a;
      let e = 201 == a.Rx;
      if (e) {
        let f = 0;
        for (; 16 > f; )
          (d = f++ + 1), (d = 512 * (b ? 1 : 0) + 32 * d + c), (this.Cq[d] = a);
      }
      if (this.oT && (a.ib(this), (this.ql[d] = !0), e))
        for (a = 0; 16 > a; )
          (d = a++ + 1),
            (d = 512 * (b ? 1 : 0) + 32 * d + c),
            (this.ql[d] = !0);
    }
    EM() {
      this.nn &= -9;
    }
    co(a) {
      let b = this.mA,
        c = this.Ab.lk;
      0 < (a.K & 240) && a.ht();
      var d = a.Ue;
      a = d.m11;
      var e = d.m12,
        f = d.m13,
        g = d.m14;
      let h = d.m21,
        m = d.m22,
        n = d.m23,
        q = d.m24,
        p = d.m31,
        v = d.m32,
        u = d.m33,
        A = d.m34,
        C = d.m41,
        B = d.m42,
        K = d.m43,
        E = d.m44;
      d = c.m11 * e + c.m12 * m + c.m13 * v + c.m14 * B;
      let aa = c.m11 * f + c.m12 * n + c.m13 * u + c.m14 * K,
        Z = c.m11 * g + c.m12 * q + c.m13 * A + c.m14 * E,
        V = c.m21 * e + c.m22 * m + c.m23 * v + c.m24 * B,
        ea = c.m21 * f + c.m22 * n + c.m23 * u + c.m24 * K,
        xa = c.m21 * g + c.m22 * q + c.m23 * A + c.m24 * E,
        pa = c.m31 * e + c.m32 * m + c.m33 * v + c.m34 * B,
        fa = c.m31 * f + c.m32 * n + c.m33 * u + c.m34 * K,
        sa = c.m31 * g + c.m32 * q + c.m33 * A + c.m34 * E;
      e = c.m41 * e + c.m42 * m + c.m43 * v + c.m44 * B;
      f = c.m41 * f + c.m42 * n + c.m43 * u + c.m44 * K;
      g = c.m41 * g + c.m42 * q + c.m43 * A + c.m44 * E;
      b.m11 = c.m11 * a + c.m12 * h + c.m13 * p + c.m14 * C;
      b.m12 = d;
      b.m13 = aa;
      b.m14 = Z;
      b.m21 = c.m21 * a + c.m22 * h + c.m23 * p + c.m24 * C;
      b.m22 = V;
      b.m23 = ea;
      b.m24 = xa;
      b.m31 = c.m31 * a + c.m32 * h + c.m33 * p + c.m34 * C;
      b.m32 = pa;
      b.m33 = fa;
      b.m34 = sa;
      b.m41 = c.m41 * a + c.m42 * h + c.m43 * p + c.m44 * C;
      b.m42 = e;
      b.m43 = f;
      b.m44 = g;
      return b;
    }
    ni(a) {
      0 < (a.K & 64) && a.Mm();
      var b = a.Ue;
      a = b.m11;
      var c = b.m12,
        d = b.m14;
      let e = b.m21,
        f = b.m22,
        g = b.m24;
      b = new fb(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      let h = this.Ab.lk,
        m = h.m11 * c + h.m12 * f,
        n = h.m11 * d + h.m12 * g + h.m14;
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
    Pn(a) {
      a.update(this);
      let b = this.RA(a.type, this.rf.type);
      null != b &&
        ((this.info.effect = a), (this.info.va = this.rf), b.L(this.info));
    }
    ki(a) {
      return this.ls[a];
    }
    zh(a) {
      if (0 != this.nn) {
        for (var b = this.ls, c = 0, d = this.nn, e = this.od; 7 > c; ) {
          if (0 == (d & (1 << c))) {
            ++c;
            continue;
          }
          let f = a.Gk[c];
          null != f
            ? f.ab != b[c].ab && ((b[c] = f), (e |= 1 << c), f.set(this))
            : 0 < (e & (1 << c)) &&
              ((f = this.ah[c]), (b[c] = f), f.set(this), (e &= ~(1 << c)));
          ++c;
        }
        this.od = e;
      }
    }
    ax() {}
    ID() {}
    HD() {}
    Nw() {}
    Qw() {}
    Zw() {}
    eB(a) {
      return -0.001 * a.Db.translate.z;
    }
  }
  rd.i = !0;
  Object.assign(rd.prototype, { l: rd });
  class xh {
    constructor(a) {
      this.V = a;
      this.Lz = this.va = this.effect = null;
    }
  }
  xh.i = !0;
  Object.assign(xh.prototype, { l: xh });
  class sd {
    constructor(a, b) {
      this.Sd = 0;
      this.$e = 1;
      this.children = [];
      this.parent = null;
      this.name = "?";
      this.size = new Ka(0, 0);
      this.image = this.hc = null;
      this.id = sd.NP++;
      this.V = a;
      this.flags = b;
    }
    Zq() {
      return null != this.image ? this.image.loaded : !1;
    }
    F() {
      if (null != this.V) {
        var a = this.hc;
        null != a && a.F();
        a = 0;
        for (var b = this.children; a < b.length; ) b[a++].F();
        this.V = this.parent = this.hc = this.image = this.children = null;
      }
    }
    Uw(a) {
      null != this.image && (this.image.Jx(), this.Sd++);
      this.image = a;
      var b = this.size;
      a = a.size;
      b.x = a.x;
      b.y = a.y;
      b = 0;
      for (a = this.children; b < a.length; ) {
        let c = a[b];
        ++b;
        c.image = this.image;
        let d = c.size,
          e = this.size;
        d.x = e.x;
        d.y = e.y;
        c.Sd = this.Sd;
      }
    }
    zR(a) {
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
      a.Sd = this.Sd;
      a.$e = this.$e;
    }
  }
  sd.i = !0;
  Object.assign(sd.prototype, { l: sd });
  class dc {
    constructor(a, b, c) {
      null == b && (b = 1);
      this.Wu = new vc();
      this.frames = a.slice();
      this.scale = b;
      this.Gp = c;
      b = [];
      for (c = 0; c < a.length; ) b.push(a[c++].id);
      b.sort(function (d, e) {
        return d - e;
      });
      b = b[b.length - 1];
      this.wl = Array(b);
      for (c = 0; c < b; ) this.wl[c++] = null;
      for (b = 0; b < a.length; )
        (c = a[b]), ++b, (this.wl[c.id] = c), (this.Wu.J[c.name] = c);
    }
    F() {
      this.Gp = this.frames = this.Wu = this.wl = null;
    }
    vN(a) {
      return this.wl[a];
    }
    xf(a) {
      return this.Wu.J[a];
    }
    offset(a, b) {
      let c = 0,
        d = this.frames;
      for (; c < d.length; ) {
        let e = d[c];
        ++c;
        e.Nd.x += a;
        e.Nd.y += b;
      }
    }
    clone() {
      let a = [],
        b = 0,
        c = this.frames;
      for (; b < c.length; ) a.push(c[b++].clone());
      return new dc(a, this.scale, this.Gp);
    }
  }
  dc.i = !0;
  Object.assign(dc.prototype, { l: dc });
  class le {
    constructor(a, b, c, d, e, f) {
      this.id = a;
      this.name = b;
      this.ec = c;
      this.Nd = d;
      this.Bp = e;
      this.gt = f;
    }
    clone() {
      let a = this.ec,
        b = this.Nd;
      if (null != this.gt) {
        var c = this.gt;
        c = new Ka(c.x, c.y);
      } else c = null;
      return new le(
        this.id,
        this.name,
        new Ka(a.x, a.y),
        new Kb(b.x, b.y, b.w, b.J),
        this.Bp,
        c
      );
    }
  }
  le.i = !0;
  Object.assign(le.prototype, { l: le });
  class td {}
  td.i = !0;
  td.Je = !0;
  class nb {
    constructor() {
      this.St = !1;
      this.object = null;
      this.PB = !1;
      this.Cz = !0;
      this.nl = !1;
      this.vd = 0;
      this.Bx = 1;
      this.ge = this.zg = this.uc = 0;
      this.wh = 1;
      this.next = null;
      this.type = this.ya();
      nb.ly++;
    }
    Fm(a) {
      this.St = a;
    }
    F() {
      null != this.object && (this.object.detach(this), (this.object = null));
      this.Cz = !1;
      nb.ly--;
    }
    sp() {
      this.PB || (this.Fm(!1), (this.nl = !0), (this.vd = 0));
    }
    update(a) {
      return this.St
        ? ((this.vd += a * this.Bx),
          null == this.object ? !1 : this.im(this.vd))
        : this.nl
        ? ((this.vd += a), this.vd > nb.SF && this.F(), !0)
        : !1;
    }
    cv() {
      var a = this.vd + this.uc;
      if (0 == this.wh) {
        var b = this.ge,
          c = this.zg;
        return a < b ? b : a > c ? c : a;
      }
      b = this.zg - this.ge;
      return 0 < b
        ? ((c = (a - this.ge) / b),
          (a = Math.floor(c)),
          (c -= a),
          1 == this.wh
            ? this.ge + c * b
            : 0 == (a & 1)
            ? this.ge + c * b
            : this.zg - c * b)
        : this.ge;
    }
    ya() {
      return 103;
    }
  }
  nb.i = !0;
  nb.Ib = [td];
  Object.assign(nb.prototype, { l: nb });
  class Zd extends nb {
    constructor() {
      super();
      this.Xa = null;
      this.frame = -1;
      this.Ho = this.$l = this.Aw = 0;
      this.Ai = -1;
      this.Lq = this.Kq = null;
    }
    F() {
      this.Lq = this.Kq = this.Xa = null;
      super.F();
    }
    play(a, b, c) {
      null == b && (b = 0);
      this.Xa = a;
      null == c && (c = a.ef - 1);
      this.$l = b;
      this.Ho = c;
      this.ge = a.Va[this.$l];
      this.zg = a.Va[this.Ho + 1];
      this.vd = this.ge;
      this.Fm(!0);
      this.nl = !1;
      this.frame = -1;
      this.Ai = this.$l;
      this.im(this.vd);
      return this;
    }
    PR(a) {
      this.Kq = a;
    }
    QR(a) {
      this.Lq = a;
    }
    stop() {
      this.Xa = null;
      this.Fm(!1);
      this.Aw = 0;
      this.sp();
      return this;
    }
    im() {
      var a = this.cv();
      let b,
        c = this.Xa.ef;
      if (1 == c) b = this.Ai = 0;
      else if (a >= this.Xa.aj) b = this.Ai = c - 1;
      else {
        if (0 < this.Xa.sq) b = (a / this.Xa.sq) | 0;
        else {
          b = 0;
          let d = this.Xa.Va;
          if (a >= d[this.Ai] && a <= d[this.Ai + 1]) b = this.Ai;
          else if (16 > c) {
            let e = 0;
            for (; e <= c; ) {
              if (d[e] >= a) {
                b = e - 1;
                break;
              }
              ++e;
            }
          } else (b = Nb.OL(d, a, c - 1)), 0 > b && ((b = ~b), --b);
        }
        this.Ai = b;
      }
      b < this.$l ? (b = this.$l) : b > this.Ho && (b = this.Ho);
      b != this.frame &&
        ((this.frame = b),
        this.TP(this.Xa.data[b]),
        b >= this.Ho &&
          0 == this.wh &&
          (0 < --this.Aw
            ? ((this.vd = this.ge),
              (this.frame = -1),
              (this.Ai = this.$l),
              this.im(this.vd))
            : (this.sp(), (a = this.Xa), (this.Xa = null), this.UP(a))));
      return !0;
    }
    TP(a) {
      null != this.Kq && this.Kq(this.Xa, a, this.frame);
    }
    UP(a) {
      null != this.Lq && this.Lq(a);
    }
    ya() {
      return 303;
    }
  }
  Zd.i = !0;
  Zd.s = nb;
  Object.assign(Zd.prototype, { l: Zd });
  class md extends nb {
    constructor() {
      super();
      this.Ro = this.fk = null;
      this.lastIndex = 0;
      this.Xa = null;
    }
    F() {
      this.Ro = this.fk = null;
      super.F();
    }
    play(a, b) {
      null == b && (b = 0);
      this.Xa = a;
      this.wh = b;
      this.ge = this.vd = this.lastIndex = 0;
      this.zg = a.aj;
      this.Fm(!0);
      this.nl = !1;
      this.im(0);
    }
    stop() {
      this.fk = null;
      this.Fm(!1);
      this.Xa = null;
      this.sp();
    }
    im(a) {
      var b = this.cv();
      let c = this.Xa.Va,
        d;
      var e;
      if (b <= c[0]) d = e = this.lastIndex = b = 0;
      else if (b >= c[this.Xa.ef - 1])
        (b = 0), (d = e = this.lastIndex = this.Xa.ef - 1);
      else if (b > c[this.lastIndex]) {
        for (e = this.lastIndex + 1; b >= c[e]; ) (this.lastIndex = e), ++e;
        d = this.lastIndex;
        b = (b - c[d]) / (c[e] - c[d]);
      } else if (b < c[this.lastIndex]) {
        for (e = this.lastIndex - 1; b <= c[e]; ) (this.lastIndex = e), --e;
        d = e;
        e = this.lastIndex;
        b = (b - c[d]) / (c[e] - c[d]);
      } else (b = 0), (d = e = this.lastIndex);
      null != this.Ro && this.Ro(this.Xa.data[d], this.Xa.data[e], b);
      a > this.zg &&
        0 == this.wh &&
        ((a = this.fk), this.stop(), null != a && a());
      return !0;
    }
    ya() {
      return 403;
    }
  }
  md.i = !0;
  md.s = nb;
  Object.assign(md.prototype, { l: md });
  class me extends nb {
    constructor() {
      super();
    }
    F() {
      this.sh = this.Ag = this.easing = null;
      super.F();
    }
    Gh(a, b, c, d, e) {
      this.key = a;
      this.wS = b;
      this.tA = c;
      this.easing = e;
      this.ge = this.vd = 0;
      this.zg = d;
      this.Fm(!0);
      this.nl = !1;
    }
    stop() {
      this.Ag = this.sh = null;
      this.sp();
    }
    im(a) {
      if (a >= this.zg && 0 == this.wh)
        return this.sp(), this.Ag(this.key, this.tA), this.sh(this.key), !1;
      a = this.wS;
      a +=
        (this.tA - a) *
        this.easing((this.cv() - this.ge) / (this.zg - this.ge));
      this.Ag(this.key, a);
      return !0;
    }
    ya() {
      return 203;
    }
  }
  me.i = !0;
  me.s = nb;
  Object.assign(me.prototype, { l: me });
  class ag {
    constructor(a, b, c) {
      this.lT = c;
      this.xC = a;
      this.VM = b;
      this.fm = a * b;
      this.bh = !0;
    }
    resize(a) {
      return a > this.xC
        ? ((this.xC = a), (this.bh = !0), (this.fm = a * this.VM), !0)
        : !1;
    }
  }
  ag.i = !0;
  Object.assign(ag.prototype, { l: ag });
  class oi {
    constructor() {
      this.hw = 0;
      this.dj = Array(6);
      let a = 0;
      for (; 6 > a; ) this.dj[a++] = [];
    }
    getData(a) {
      return this.dj[a];
    }
  }
  oi.i = !0;
  Object.assign(oi.prototype, { l: oi });
  class Kb {
    constructor(a, b, c, d) {
      this.x = a;
      this.y = b;
      this.w = c;
      this.J = d;
    }
  }
  Kb.i = !0;
  Object.assign(Kb.prototype, { l: Kb });
  class ha {
    constructor() {
      this.type = this.ya();
      this.enabled = !0;
      this.va = null;
      this.ab = 0;
    }
    F() {
      this.va = null;
    }
    update() {}
    Bh(a) {
      this.va = a;
    }
    ya() {
      return 105;
    }
  }
  ha.i = !0;
  ha.Ib = [td];
  Object.assign(ha.prototype, { l: ha });
  class ud extends ha {
    constructor(a) {
      super();
      this.Hb = a;
      this.FE = a.$e;
      this.charset = a.hc.Gp;
      this.text = null;
      this.clip = !1;
      this.fontSize = this.charset.ms;
      this.hC = 4;
      this.AP = 512;
      this.size = new F(100, 100, 0, 1);
      this.Kv = !0;
      this.VB = !1;
      this.iR = 32;
      this.SE = this.UB = 0;
      this.Pj = 2;
      this.Xk = this.Ug = null;
      this.gA = 0;
      this.Ze = !0;
      this.overflow = !1;
      this.Mg = new yh();
      this.multiline = !1;
      this.Sd = 0;
    }
    Bh(a) {
      super.Bh(a);
      a.Lb(this.size.x, this.size.y);
    }
    Pa(a) {
      this.text != a &&
        ((this.text = a), this.multiline && this.Qz(), (this.Ze = !0));
    }
    Tq() {
      return this.fontSize;
    }
    cp() {
      this.fontSize = this.charset.ms;
    }
    lc(a) {
      var b;
      null != b && (4 > b && (b = 4), (this.hC = b));
      b = this.hC;
      let c = this.AP;
      a = a < b ? b : a > c ? c : a;
      a != this.fontSize && ((this.fontSize = a), (this.Ze = !0));
    }
    QN() {
      let a = this.size;
      return new F(a.x, a.y, 0, 1);
    }
    rb(a, b) {
      if (this.size.x != a || this.size.y != b)
        (this.size.x = a),
          (this.size.y = b),
          this.va.Lb(this.size.x, this.size.y),
          (this.Ze = !0);
    }
    mv() {
      return this.Mg.fw;
    }
    Cs(a) {
      this.UB = a;
      this.Ze = !0;
    }
    bx(a) {
      this.SE = a;
      this.Ze = !0;
    }
    Eb(a, b) {
      this.Ug = a;
      this.Xk = b;
      this.Ze = !0;
    }
    fN(a) {
      null == a && (a = !0);
      if (null != this.text) {
        var b = 2 * this.Pj,
          c = this.size.x - b,
          d = this.size.y - b;
        this.cp();
        b = d / this.charset.sj;
        this.Mg.shape(this, !0);
        var e = this.Mg.gb;
        c = Math.min(c / (e.B - e.A), d / (e.G - e.D));
        a && (c = Math.min(b, c));
        this.fontSize *= c;
        this.shape();
      }
    }
    Sf(a) {
      (this.multiline = a) && null == this.jq && this.LR(new bg());
    }
    LR(a) {
      this.jq = a;
      null != this.text && this.Qz();
      this.Ze = !0;
    }
    shape() {
      this.Mg.shape(this, !1);
      let a = this.Mg.gb;
      this.overflow = a.B - a.A > this.size.x - 2 * this.Pj;
      this.Ze = !1;
    }
    update() {
      if (this.Hb.Sd > this.Sd) {
        this.Sd = this.Hb.Sd;
        this.charset = this.Hb.hc.Gp;
        let a = this.Hb.$e;
        this.fontSize *= this.FE / a;
        this.FE = a;
        null != this.va.Qo && this.va.Qo();
        this.Ze = !0;
      }
      this.Ze && ((this.Ze = !1), this.shape());
    }
    F() {
      super.F();
      this.Hb = null;
      this.Mg.F();
      this.Mg = null;
    }
    Qz() {
      this.jq.dS(this.text);
      this.xx = [];
      let a = 0,
        b = this.jq.qC();
      for (; null != b; )
        this.xx.push(new zh(this.text.substring(a, b.position), b.required)),
          (a = b.position),
          (b = this.jq.qC());
    }
    ya() {
      return 505;
    }
  }
  ud.i = !0;
  ud.s = ha;
  Object.assign(ud.prototype, { l: ud });
  class zh {
    constructor(a, b) {
      this.text = a;
      this.Pz = b;
    }
  }
  zh.i = !0;
  Object.assign(zh.prototype, { l: zh });
  class yh {
    constructor() {
      this.cursor = new F(0, 0, 0, 1);
      this.Yg = new vb(32);
      this.fw = 1;
      this.gb = new Y(0, 0, 0, 0);
      this.Te = new vb(256);
    }
    F() {
      this.Yg.Xu();
      this.Yg = null;
    }
    shape(a, b) {
      null == b && (b = !1);
      let c = this.gb;
      c.A = c.D = va;
      c.B = c.G = wa;
      var d = a.text;
      if (null != d) {
        var e = d.length;
        if (null != e) {
          d = this.Te;
          b || (d.Mf(5 * e), d.clear());
          var f = a.charset;
          e = (a.fontSize / f.ms) * a.Hb.$e;
          f = f.lineHeight * e + a.UB * e;
          var g = a.Pj,
            h = a.size.x,
            m = a.Pj,
            n = this.cursor;
          n.x = g;
          n.y = g;
          n = !b && null != a.Ug;
          var q = !b && null != a.Xk;
          this.fw = 1;
          if (a.multiline) {
            b = new Y(va, va, wa, wa);
            let v = 0,
              u = a.xx.length,
              A = new Y(va, va, wa, wa),
              C = 0,
              B = 0;
            for (; v < u; ) {
              let K = a.xx[v++];
              var p = this.MA(K.text, a);
              this.cursor.x -= p.N[0].Xx * e;
              let E = d.aa;
              this.print(p, a, b);
              p = d.aa;
              let aa = b.B > h - m;
              aa && b.B - b.A < h - 2 * m
                ? (n && (this.Ug(a, A, C, B), c.add(A)),
                  d.trim(E),
                  (C = B = E),
                  (A.A = A.D = va),
                  (A.B = A.G = wa),
                  --v)
                : (A.add(b),
                  (B = p),
                  K.Pz &&
                    n &&
                    (this.Ug(a, A, C, p),
                    c.add(A),
                    (A.A = A.D = va),
                    (A.B = A.G = wa),
                    (C = p)));
              if (aa || K.Pz)
                (this.cursor.x = g), (this.cursor.y += f), this.fw++;
            }
            n && (this.Ug(a, A, C, B), c.add(A));
          } else {
            f = this.MA(a.text, a);
            if (0 == f.aa) return;
            this.cursor.x -= f.N[0].Xx * e;
            this.print(f, a, c, b);
            n && this.Ug(a, c, 0, d.aa);
          }
          q && this.Xk(a, c, 0, d.aa);
        }
      }
    }
    Ug(a, b, c, d) {
      let e = a.Pj,
        f = a.size.x - 2 * e;
      for (
        a =
          0 > a.Ug
            ? -b.A + e
            : 0 == a.Ug
            ? f / 2 - (b.A + b.B) / 2 + e
            : f - b.B + e;
        c < d;

      )
        (this.Te.N[c + 1] += a), (c += 5);
      d = b.A + a;
      c = b.B - b.A;
      b.A = d;
      b.B = d + c;
    }
    Xk(a, b) {
      var c = a.Pj,
        d = a.size.y - 2 * c;
      a =
        0 > a.Xk
          ? -b.D + c
          : 0 == a.Xk
          ? d / 2 - (b.D + b.G) / 2 + c
          : d - b.G + c;
      c = 0;
      for (d = (this.Te.aa / 5) | 0; c < d; ) this.Te.N[5 * c++ + 2] += a;
      a = b.D + a;
      c = b.G - b.D;
      b.D = a;
      b.G = a + c;
    }
    print(a, b, c, d) {
      null == d && (d = !1);
      c.A = c.D = va;
      c.B = c.G = wa;
      let e = b.charset,
        f = (b.fontSize / e.ms) * b.Hb.$e,
        g = b.SE * f,
        h = 0,
        m = a.aa;
      for (var n = 0; h < m; ) {
        var q = a.N[h++],
          p = this.cursor.x + q.Xx * f,
          v = this.cursor.y + q.sT * f;
        let A = q.width * f,
          C = q.height * f,
          B = 0;
        b.Kv &&
          ((n = e.Kv.J[(q.id << 16) | n]),
          null != n && (B = n),
          (B *= f),
          (n = q.id),
          (p += B));
        if (!d) {
          var u = this.Te;
          u.N[u.aa++] = q.id;
          u = this.Te;
          u.N[u.aa++] = p;
          u = this.Te;
          u.N[u.aa++] = v;
          u = this.Te;
          u.N[u.aa++] = A;
          u = this.Te;
          u.N[u.aa++] = C;
        }
        32 < q.id &&
          ((u = p),
          u < c.A && (c.A = u),
          u > c.B && (c.B = u),
          v < c.D && (c.D = v),
          v > c.G && (c.G = v),
          (p += A),
          (v += C),
          p < c.A && (c.A = p),
          p > c.B && (c.B = p),
          v < c.D && (c.D = v),
          v > c.G && (c.G = v));
        q = q.kF;
        0 < b.gA && (q = b.gA);
        this.cursor.x += q * f + B + g;
      }
    }
    MA(a, b) {
      let c = a.length,
        d = this.Yg;
      d.clear();
      d.Mf(c);
      var e = b.charset;
      let f = e.hA;
      e = e.VB;
      b = b.iR;
      let g;
      g = 1;
      var h = a.charCodeAt(0);
      if (32 <= h) {
        null == f[h] && (h = b);
        var m = f[h];
        d.N[d.aa++] = m;
      }
      for (; g < c; )
        (m = a.charCodeAt(g++)),
          32 > m
            ? (h = m)
            : (null == f[m] && (m = b),
              null != e &&
                ((h = e.J[(h << 16) | m]), null != h && (--d.aa, (m = h))),
              (h = f[m]),
              (d.N[d.aa++] = h),
              (h = m));
      return d;
    }
  }
  yh.i = !0;
  Object.assign(yh.prototype, { l: yh });
  class cg {
    constructor() {}
  }
  cg.i = !0;
  Object.assign(cg.prototype, { l: cg });
  class bg extends cg {
    constructor() {
      super();
    }
    dS(a) {
      this.Dd = a;
      this.state = Uc.vr(this.Dd, 0) ? 1 : 0;
      this.Ql = this.g = 0;
      this.Qu = 0 == this.Dd.length;
    }
    qC() {
      if (this.Qu) return null;
      let a = this.Dd.length,
        b;
      for (; this.g < a; ) {
        if ((b = "\n" == this.Dd.charAt(this.g)))
          return (
            this.g++,
            (this.Ql = this.g),
            (this.state = Uc.vr(this.Dd, 0) ? 1 : 0),
            { position: this.Ql, required: this.g != a }
          );
        switch (this.state) {
          case 0:
            Uc.vr(this.Dd, this.g) && (this.state = 1);
            this.g++;
            break;
          case 1:
            if (Uc.vr(this.Dd, this.g)) this.g++;
            else
              return (
                (this.Ql = this.g),
                (this.state = 0),
                { position: this.Ql, required: !1 }
              );
        }
        if (this.g == a)
          return (
            (this.Qu = !0),
            (this.Ql = this.g),
            { position: this.Ql, required: !1 }
          );
      }
      this.Qu = !0;
      return null;
    }
  }
  bg.i = !0;
  bg.s = cg;
  Object.assign(bg.prototype, { l: bg });
  class be extends ha {
    constructor() {
      super();
      this.points = [];
      this.Yh = [];
      this.on = [];
      this.Z = 10;
    }
    F() {
      super.F();
      this.on = this.Yh = this.points = null;
    }
    FR() {
      this.points = [];
      this.Yh = [];
      this.on = [];
    }
    ya() {
      return 705;
    }
  }
  be.i = !0;
  be.s = ha;
  Object.assign(be.prototype, { l: be });
  class dg extends ha {
    constructor(a, b, c) {
      super();
      this.Hb = a;
      this.charset = a.hc.Gp;
      a = [9633, 65533, 63];
      let d = 0;
      for (; 3 > d; ) {
        let e = d++;
        if (null != this.charset.hA[a[e]]) break;
      }
      this.grid = null;
      this.fillColor = -1;
      this.Zv = this.Yv = 0;
      this.Lb(b, c, !1);
    }
    Lb(a, b, c) {
      if (c)
        (a = (a / this.charset.BA) | 0),
          (b = (b / this.charset.lineHeight) | 0),
          this.Lb(a, b, !1);
      else if (
        (0 < this.Yv && a > this.Yv && (a = this.Yv),
        0 < this.Zv && b > this.Zv && (b = this.Zv),
        null == this.grid || a != this.grid.Tb || b != this.grid.Xc)
      )
        null == this.grid ? (this.grid = new Md(a, b)) : this.grid.resize(a, b),
          this.grid.forEach(function (d, e, f) {
            return null == d ? new Ah(e, f) : d;
          }),
          null != this.va && this.Qc();
    }
    Bh(a) {
      super.Bh(a);
      this.Qc();
    }
    Qc() {
      this.va.Lb(
        this.charset.BA * this.grid.Tb,
        this.charset.lineHeight * this.grid.Xc
      );
      this.va.Qc();
    }
    ya() {
      return 1805;
    }
  }
  dg.i = !0;
  dg.s = ha;
  Object.assign(dg.prototype, { l: dg });
  class Ah {
    constructor(a, b) {
      this.x = a;
      this.y = b;
      this.code = 0;
    }
  }
  Ah.i = !0;
  Object.assign(Ah.prototype, { l: Ah });
  class ne extends ha {
    constructor(a) {
      super();
      this.color = Hj.clone(a);
    }
    ya() {
      return 1205;
    }
  }
  ne.i = !0;
  ne.s = ha;
  Object.assign(ne.prototype, { l: ne });
  class oe extends ha {
    constructor(a) {
      super();
      this.color = a;
      this.cs = null;
    }
    ya() {
      return 305;
    }
  }
  oe.i = !0;
  oe.s = ha;
  Object.assign(oe.prototype, { l: oe });
  class Jc extends ha {
    constructor(a) {
      super();
      this.Cj = a;
      this.ft = [];
    }
    update(a) {
      super.update(a);
      this.ft = [];
      for (a = 0; 5 > a; ) {
        var b = this.Cj[a++],
          c = b.length;
        if (0 == c) continue;
        let q = 1;
        for (var d = void 0, e = [], f = 0, g = 0; g < c; ) {
          var h = g++;
          d = b[h];
          0 == h && (e[f++] = d.start);
          e[f++] = d.end;
        }
        b = 2 * c;
        c = [];
        f = 1 / b;
        for (g = 0; ; ) {
          1 < g && (g = 1);
          d = t.XL(e, g);
          c.push(d);
          if (1 == g) break;
          g += f;
        }
        e = Jc.OF / b;
        d = [];
        f = 0;
        for (g = b - 1; f < g; ) {
          var m = q;
          h = f == b - 1 ? 1 : q + e;
          let p = c[f],
            v = c[f + 1];
          var n = t.Ha(v, p);
          n.normalize();
          let u = t.sL(n);
          n = t.Vt(n);
          let A = t.tb(p, t.Ob(n, m));
          d.push(t.tb(p, t.Ob(u, m)));
          d.push(A);
          m = t.tb(v, t.Ob(n, h));
          d.push(t.tb(v, t.Ob(u, h)));
          d.push(m);
          q += e;
          ++f;
        }
        this.ft.push(d);
      }
    }
    ya() {
      return 1105;
    }
  }
  Jc.i = !0;
  Jc.s = ha;
  Object.assign(Jc.prototype, { l: Jc });
  class ce extends ha {
    constructor() {
      super();
      this.C = new F(0, 0, 0, 1);
      this.Z = 0;
      this.color = new F(0, 0, 0, 0);
      this.No = 0;
      this.lineWidth = 1.5;
      this.update(null);
    }
    update() {
      this.No = Math.max(16, Math.round(this.Z / 0.8));
      0 != this.No % 2 && this.No++;
    }
    ya() {
      return 605;
    }
  }
  ce.i = !0;
  ce.s = ha;
  Object.assign(ce.prototype, { l: ce });
  class eg extends ha {
    constructor(a, b) {
      super();
      this.Hb = a;
      this.shape = b;
      this.ac = [];
    }
    ya() {
      return 1705;
    }
  }
  eg.i = !0;
  eg.s = ha;
  Object.assign(eg.prototype, { l: eg });
  class rc extends ha {
    constructor() {
      super();
      this.precision = 0.2;
      this.sQ = !1;
      new Y(0, 0, 1024, 1024);
      this.kM = !1;
      this.Eu = 0;
      this.iM = 256;
      this.Du = Array(this.iM);
      this.wM = 1024;
      this.data = Array(this.wM);
      this.lineWidth = this.yr = 1;
      this.fillColor = 0;
      this.cursor = new F(0, 0, 0, 1);
      this.Ed = [];
      this.no = new Y(va, va, wa, wa);
      this.clear();
    }
    F() {
      this.Ed = this.Du = this.data = null;
      super.F();
    }
    Bh(a) {
      super.Bh(a);
      this.kM && this.lM();
    }
    clear() {
      this.Eu = 0;
      let a = this.no;
      a.A = a.D = va;
      a.B = a.G = wa;
    }
    lM() {
      let a = va,
        b = wa,
        c = va,
        d = wa,
        e = this.no,
        f = this.data,
        g = this.Du,
        h = 0,
        m = 0,
        n = this.Eu;
      for (; h < n; ) {
        var q = g[h++];
        switch (q) {
          case 1:
          case 2:
          case 3:
            q = f[m];
            let p = f[m + 1];
            q < a && (a = q);
            q > b && (b = q);
            p < c && (c = p);
            p > d && (d = p);
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
            (e.A = a),
              (e.D = c),
              (e.B = b),
              (e.G = d),
              (m = this.Az(q, m, f)),
              (a = e.A),
              (c = e.D),
              (b = e.B),
              (d = e.G);
        }
      }
      e.A = a;
      e.D = c;
      e.B = b;
      e.G = d;
      null != this.va && this.Qc();
    }
    Az() {
      return 0;
    }
    Qc() {
      let a = this.no;
      var b = this.va.ea;
      b.C.x = (a.A + a.B) / 2;
      b.C.y = (a.D + a.G) / 2;
      let c = (a.B - a.A) / 2,
        d = (a.G - a.D) / 2;
      b.Z = Math.sqrt(c * c + d * d);
      302 == b.type &&
        ((b = b.gb), (b.A = a.A), (b.D = a.D), (b.B = a.B), (b.G = a.G));
      this.va.Qc();
    }
    ya() {
      return 1005;
    }
  }
  rc.i = !0;
  rc.s = ha;
  Object.assign(rc.prototype, { l: rc });
  class od extends ha {
    constructor() {
      super();
      this.Z = 0;
      this.color = new F(1, 1, 1, 1);
      this.lineWidth = 6;
      this.yr = 1;
    }
    ya() {
      return 905;
    }
  }
  od.i = !0;
  od.s = ha;
  Object.assign(od.prototype, { l: od });
  class pe extends ha {
    constructor(a, b) {
      super();
      this.Hb = null;
      this.vp = new Kb(0, 0, 0, 0);
      this.frame = null;
      this.$o = this.tm = 1;
      this.Sd = this.K = this.offsetY = this.offsetX = 0;
      this.Tf(a, b);
    }
    OR(a) {
      this.offsetX = 0;
      this.offsetY = a;
      this.K = 0 == a ? this.K & -3 : this.K | 2;
    }
    Tf(a, b) {
      this.Hb = a;
      if (null != b) this.Sw(b);
      else {
        b = this.vp;
        let c = a.size.x,
          d = a.size.y;
        b.x = 0;
        b.y = 0;
        b.w = c;
        b.J = d;
        this.frame = null;
      }
      this.ab = a.id;
    }
    Sw(a) {
      a = this.Hb.hc.xf(a);
      if (null == this.frame || a.id != this.frame.id) {
        this.frame = a;
        a = this.vp;
        let b = this.frame.Nd;
        a.x = b.x;
        a.y = b.y;
        a.w = b.w;
        a.J = b.J;
      }
      return this.frame;
    }
    ip(a) {
      if (null == this.frame || this.frame.id != a) {
        this.frame = this.Hb.hc.vN(a);
        a = this.vp;
        let b = this.frame.Nd;
        a.x = b.x;
        a.y = b.y;
        a.w = b.w;
        a.J = b.J;
      }
    }
    update() {
      if (this.Hb.Sd > this.Sd) {
        this.Sd = this.Hb.Sd;
        if (null == this.frame) this.Tf(this.Hb);
        else {
          let a = this.frame;
          this.frame = null;
          this.ip(a.id);
        }
        null != this.va.Qo && this.va.Qo();
      }
    }
    F() {
      super.F();
      this.Hb = null;
    }
    ya() {
      return 205;
    }
  }
  pe.i = !0;
  pe.s = ha;
  Object.assign(pe.prototype, { l: pe });
  class qe extends ha {
    constructor(a) {
      super();
      this.Hb = a;
      this.cs = null;
    }
    F() {
      super.F();
      this.Hb = null;
    }
    ya() {
      return 405;
    }
  }
  qe.i = !0;
  qe.s = ha;
  Object.assign(qe.prototype, { l: qe });
  class fg extends ha {
    constructor(a, b) {
      super();
      this.Rr = new F(1, 1, 0, 1);
      this.sk = new F(0, 0, 0, 1);
      a.yi(function () {});
      this.Cr = new Ka(a.Tb * b, a.Xc * b);
    }
    F() {
      super.F();
    }
    Bh(a) {
      super.Bh(a);
      a.Lb(this.Cr.x, this.Cr.y);
      a.Qc();
    }
    update(a) {
      var b = a.Ab,
        c = b.position.y;
      b = b.position.x - a.rf.Ea.translate.x;
      var d = c - a.rf.Ea.translate.y;
      c = this.sk;
      c.x = b * (1 - this.Rr.x);
      c.y = d * (1 - this.Rr.y);
      b = a.rf;
      b.Lb(this.Cr.x, this.Cr.y);
      d = (1 - this.Rr.x) * c.x * 2;
      a = (1 - this.Rr.y) * c.y * 2;
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
    ya() {
      return 1605;
    }
  }
  fg.i = !0;
  fg.s = ha;
  Object.assign(fg.prototype, { l: fg });
  class gg extends ha {
    constructor(a) {
      null == a && (a = 1);
      super();
      this.flags = a;
      this.color = new F(0, 0, 0, 1);
    }
    ya() {
      return 1405;
    }
  }
  gg.i = !0;
  gg.s = ha;
  Object.assign(gg.prototype, { l: gg });
  class hg extends rc {
    constructor() {
      super();
      let a = [],
        b = 0;
      for (; 4 > b; ) ++b, a.push(new F(0, 0, 0, 1));
      this.ED = [];
    }
    ya() {
      return 1505;
    }
  }
  hg.i = !0;
  hg.s = rc;
  Object.assign(hg.prototype, { l: hg });
  class Bh {
    constructor() {
      this.LO = [];
      this.Yg = [];
    }
  }
  Bh.i = !0;
  Object.assign(Bh.prototype, { l: Bh });
  class Ch {
    constructor(a, b, c, d, e, f, g, h) {
      this.id = a;
      this.x = b;
      this.y = c;
      this.width = d;
      this.height = e;
      this.Xx = f;
      this.sT = g;
      this.kF = h;
    }
  }
  Ch.i = !0;
  Object.assign(Ch.prototype, { l: Ch });
  class Dh {
    constructor(a, b, c) {
      this.first = a;
      this.second = b;
      this.amount = c;
    }
  }
  Dh.i = !0;
  Object.assign(Dh.prototype, { l: Dh });
  class Eh {
    constructor(a, b, c, d) {
      this.eT = a;
      this.right = b;
      this.IM = c;
      this.left = d;
    }
  }
  Eh.i = !0;
  Object.assign(Eh.prototype, { l: Eh });
  class Fh {
    constructor(a, b) {
      this.size = a;
      this.padding = b;
    }
  }
  Fh.i = !0;
  Object.assign(Fh.prototype, { l: Fh });
  class Gh {
    constructor(a, b, c, d) {
      this.lineHeight = a;
      this.sj = b;
      this.wR = c;
      this.vR = d;
    }
  }
  Gh.i = !0;
  Object.assign(Gh.prototype, { l: Gh });
  class De {
    constructor() {}
    sm(a) {
      let b = new Bh();
      a = new sc(a);
      var c = a.ta(),
        d = a.ta(),
        e = a.ta();
      if (66 != c || 77 != d || 70 != e) throw 6;
      if (3 != a.ta()) throw 7;
      a.ta();
      c = a.Cg();
      d = a.kc();
      a.ta();
      a.ta();
      a.zd();
      a.ta();
      e = a.ta();
      var f = a.ta(),
        g = a.ta(),
        h = a.ta();
      a.ta();
      a.ta();
      a.ta();
      a.bs(c - 14);
      b.info = new Fh(Math.abs(d), new Eh(e, f, g, h));
      a.ta();
      a.Cg();
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
      b.rq = new Gh(c, d, e, f);
      a.ta();
      c = a.Cg();
      d = a.g;
      a.jD();
      d = a.g - d;
      for (c -= d; 0 < c; ) a.jD(), (c -= d);
      a.ta();
      c = (a.Cg() / 20) | 0;
      for (d = 0; d < c; ) {
        ++d;
        e = a.Cg();
        f = a.zd();
        g = a.zd();
        h = a.zd();
        let m = a.zd(),
          n = a.kc(),
          q = a.kc(),
          p = a.kc();
        a.ta();
        a.ta();
        b.Yg.push(new Ch(e, f, g, h, m, n, q, p));
      }
      if (a.g == a.ME) return b;
      a.ta();
      for (a.Cg(); a.g < a.ME; )
        (c = a.Cg()), (d = a.Cg()), (e = a.kc()), b.LO.push(new Dh(c, d, e));
      return b;
    }
  }
  De.i = !0;
  Object.assign(De.prototype, { l: De });
  class Ee {
    static NA(a) {
      for (var b = 0, c = 0, d = a.Yg; c < d.length; )
        b = Math.max(b, d[c++].id + 1);
      c = Array(b);
      for (d = 0; d < b; ) c[d++] = null;
      b = 0;
      for (d = a.Yg; b < d.length; ) {
        let e = d[b];
        ++b;
        c[e.id] = e;
      }
      return new Hh(
        c,
        a.info.size,
        a.rq.lineHeight,
        a.rq.sj,
        a.Yg[0].kF,
        a.rq.wR,
        a.rq.vR,
        [
          a.info.padding.eT,
          a.info.padding.right,
          a.info.padding.IM,
          a.info.padding.left,
        ]
      );
    }
    static Bl(a) {
      let b = [],
        c = 0;
      for (a = a.Yg; c < a.length; ) {
        let d = a[c];
        ++c;
        let e = d.id;
        b.push(
          new le(
            e,
            String.fromCodePoint(e),
            new Ka(d.width, d.height),
            new Kb(d.x, d.y, d.width, d.height),
            !1,
            null
          )
        );
      }
      return b;
    }
  }
  Ee.i = !0;
  class Hh {
    constructor(a, b, c, d, e, f, g, h) {
      this.hA = a;
      this.ms = b;
      this.lineHeight = c;
      this.sj = d;
      this.BA = e;
      this.padding = h;
      this.Kv = new ib();
      this.VB = new ib();
    }
  }
  Hh.i = !0;
  Object.assign(Hh.prototype, { l: Hh });
  class ig {
    constructor(a, b) {
      this.frames = a;
      this.Zl = b;
    }
  }
  ig.i = !0;
  Object.assign(ig.prototype, { l: ig });
  class jg {
    constructor(a, b, c, d, e) {
      this.filename = a;
      this.frame = b;
      this.oE = c;
      this.ec = d;
      this.Bp = e;
    }
  }
  jg.i = !0;
  Object.assign(jg.prototype, { l: jg });
  class kg {
    constructor(a, b, c) {
      this.width = a;
      this.height = b;
      this.scale = c;
    }
  }
  kg.i = !0;
  Object.assign(kg.prototype, { l: kg });
  class Ed {
    constructor() {}
    $Q(a) {
      var b = JSON.parse(a);
      a = [];
      let c = 0,
        d = b.frames;
      for (; c < d.length; ) {
        let e = d[c];
        ++c;
        let f = e.frame,
          g = e.spriteSourceSize,
          h = e.sourceSize;
        a.push(
          new jg(
            e.filename,
            new Kb(f.x, f.y, f.w, f.h),
            new Kb(g.x, g.y, g.w, g.h),
            new Ka(h.w, h.h),
            e.trimmed
          )
        );
      }
      b = b.meta;
      return new ig(a, new kg(b.size.w, b.size.h, parseFloat(b.scale)));
    }
    hD(a) {
      function b(h) {
        return new jg(
          h,
          new Kb(c.kc(), c.kc(), c.kc(), c.kc()),
          new Kb(c.kc(), c.kc(), c.kc(), c.kc()),
          new Ka(c.kc(), c.kc()),
          1 == c.ta()
        );
      }
      let c = new sc(a);
      c.ta();
      c.ta();
      c.ta();
      a = new kg(c.kc(), c.kc(), c.YQ());
      let d = [],
        e = c.kc(),
        f = 0;
      for (; f < e; ) {
        var g = c.bs(c.kc());
        d.push(b(g));
        ++f;
      }
      e = c.kc();
      for (f = 0; f < e; ) {
        g = c.kc();
        let h = c.bs(c.kc()),
          m = 0;
        for (; m < g; ) {
          let n = "" + (m + 1);
          for (; 4 > n.length; ) n = "0" + n;
          d.push(b(h + n));
          ++m;
        }
        ++f;
      }
      return new ig(d, a);
    }
  }
  Ed.i = !0;
  Object.assign(Ed.prototype, { l: Ed });
  class Ug {
    static Bl(a) {
      let b = 0,
        c = [],
        d = 0;
      for (a = a.frames; d < a.length; ) {
        let e = a[d];
        ++d;
        c.push(
          new le(b++, e.filename, e.ec, e.frame, e.Bp, new Ka(e.oE.x, e.oE.y))
        );
      }
      return c;
    }
  }
  Ug.i = !0;
  class Ae extends je {
    constructor(a) {
      super();
      this.wu = a;
      this.context = null;
      this.Oq = !1;
      this.TO = [];
      this.oo = new la("(iPad|iPhone)", "g").match(ma.navigator.platform);
      this.Kn = new Ka(-1, -1);
      this.Fw = this.Iu = null;
      this.mS();
      this.Vo = 1;
      this.oj();
      null != a
        ? ((this.canvas = window.document.getElementById(a)),
          null == this.canvas &&
            ((this.canvas = window.document.createElement("canvas")),
            (this.canvas.id = a),
            window.document.body.appendChild(this.canvas)))
        : ((this.canvas = window.document.createElement("canvas")),
          (this.canvas.id = "gfx"),
          (this.canvas.style.position = "absolute"),
          (this.canvas.style.width = "100%"),
          (this.canvas.style.height = "100%"),
          (this.canvas.style.touchAction = "none"),
          (this.canvas.style.userSelect = "none"),
          (this.canvas.style.outline = "none"),
          this.canvas.style.setProperty("-webkit-user-select", "none"),
          (this.canvas.style.zIndex = "0"),
          window.document.body.appendChild(this.canvas),
          (this.canvas.tabIndex = 1),
          this.canvas.focus());
    }
    Mj() {
      return window.devicePixelRatio;
    }
    mS() {
      null != this.Fw && (this.Fw.disconnect(), (this.Fw = null));
      this.sS = !1;
    }
    jO(a) {
      null == a && (a = { willReadFrequently: !1 });
      this.context = this.canvas.getContext("2d", a);
      this.canvas.addEventListener("contextlost", function () {});
      this.canvas.addEventListener("contextrestored", function () {});
    }
    pO(a) {
      function b() {
        try {
          e.Qb.zc(6);
        } catch (f) {}
      }
      function c(f) {
        f.preventDefault();
      }
      function d(f) {
        console.log(f.statusMessage || "Unknown error");
      }
      let e = this;
      this.addListener(this.canvas, "webglcontextcreationerror", d);
      this.addListener(this.canvas, "webglcontextlost", c);
      this.addListener(this.canvas, "webglcontextrestored", b);
      try {
        if (
          (null == a && (a = { stencil: !0 }),
          (this.context = this.canvas.getContext("webgl", a)) &&
            this.context instanceof WebGLRenderingContext)
        )
          return !0;
      } catch (f) {
        this.context = null;
      }
      this.canvas.removeEventListener("webglcontextcreationerror", d);
      this.canvas.removeEventListener("webglcontextlost", c);
      this.canvas.removeEventListener("webglcontextrestored", b);
      return !1;
    }
    Wn() {
      let a = this.oi();
      return a.x / a.y;
    }
    getContext() {
      return this.context;
    }
    SR(a) {
      this.Kn = new Ka(-1, -1);
      this.Vo = a;
      this.update();
    }
    update() {
      this.Gw = !1;
      var a = this.canvas.clientWidth;
      var b = this.canvas.clientHeight;
      if (
        0 != a &&
        0 != b &&
        (null != this.Iu && ((a = this.Iu.x), (b = this.Iu.y)),
        this.Kn.x != a || this.Kn.y != b)
      ) {
        var c = this.Kn;
        c.x = a;
        c.y = b;
        this.Fc.x = (a * this.Mj()) | 0;
        this.Fc.y = (b * this.Mj()) | 0;
        b = 0 == this.Vo ? this.Mj() : this.Vo;
        a = (this.Fc.x / b) | 0;
        b = (this.Fc.y / b) | 0;
        this.canvas.width = a;
        this.canvas.height = b;
        this.CR(a, b);
        this.Gw = !0;
        this.Qb.zc(0);
      }
    }
    yO() {
      try {
        return this.oo ? !1 : document.fullscreenEnabled;
      } catch (a) {
        return !1;
      }
    }
    oj() {
      this.addListener(window, "contextmenu", function (b) {
        b.preventDefault();
      });
      window.oncontextmenu = function () {
        return !1;
      };
      let a = this;
      this.addListener(window.document, "visibilitychange", function () {
        a.visible = "visible" == window.document.visibilityState;
        a.Qb.zc(a.visible ? 1 : 2);
      });
      this.yO() &&
        this.addListener(window.document, "fullscreenchange", function () {
          a.Oq = document.Oq;
          a.Qb.zc(a.Oq ? 3 : 4);
        });
      if (this.oo)
        this.addListener(window, "orientationchange", function () {
          a.Qb.zc(5);
          setInterval(function () {
            window.scrollTo(0, 1);
          }, 1);
        });
      else
        try {
          window.screen.orientation.onchange = function () {
            a.Qb.zc(5);
            setTimeout(function () {
              let b = a.Kn;
              b.x = 0;
              b.y = 0;
            }, 1e3);
          };
        } catch (b) {}
    }
    addListener(a, b, c) {
      let d = {};
      d.target = a;
      d.type = b;
      d.listener = c;
      this.TO.push(d);
      a.addEventListener(b, c);
    }
  }
  Ae.i = !0;
  Ae.s = je;
  Object.assign(Ae.prototype, { l: Ae });
  class pi {}
  class Ce extends Wf {
    constructor(a, b) {
      null == b && (b = !1);
      null == a && (a = !0);
      super();
      this.mT = a;
      this.flipY = b;
    }
    load(a, b, c) {
      let d = this;
      this.decode(a, c)
        .then(function (e) {
          d.data = e;
          let f = d.size;
          f.x = e.width;
          f.y = e.height;
          d.loaded = !0;
          b();
        })
        .catch(function () {});
    }
    Jx() {
      if (this.loaded) {
        try {
          this.data instanceof HTMLImageElement
            ? (this.data.src =
                "data:image/gif;base64,vmwareR0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7")
            : this.data instanceof HTMLCanvasElement
            ? ((this.data.width = 1), (this.data.height = 1))
            : this.data instanceof ImageBitmap && this.data.close();
        } catch (a) {}
        this.loaded = !1;
        this.data = null;
      }
    }
    decode(a, b) {
      let c = this;
      return "string" == typeof a
        ? (null == b && (b = "image/png"),
          (a = a.replace(RegExp("\\s+", "g"), "")),
          this.decode(
            new Blob([new Uint8Array(Mc.decode(a).b.TL)], { type: b })
          ))
        : a instanceof HTMLImageElement
        ? Promise.resolve(a)
        : a instanceof HTMLCanvasElement
        ? Promise.resolve(a)
        : this.mT
        ? null == window.createImageBitmap
          ? this.Ys(a)
          : "string" == typeof a
          ? this.Ys(a).then(function (d) {
              return c.KE(d);
            })
          : this.KE(a).then(null, function () {
              return c.Ys(a);
            })
        : this.Ys(a);
    }
    Ys(a) {
      return new Promise(function (b, c) {
        let d = window.document.createElement("img");
        d.addEventListener("load", function () {
          b(d);
        });
        d.addEventListener("error", function (e) {
          c(e);
        });
        if ("string" == typeof a) {
          debugger;
          d.src = a;
        } else d.src = URL.createObjectURL(a);
      });
    }
    KE(a) {
      return window.createImageBitmap(a, {
        imageOrientation: this.flipY ? "flipY" : "none",
        premultiplyAlpha: "default",
      });
    }
  }
  Ce.i = !0;
  Ce.s = Wf;
  Object.assign(Ce.prototype, { l: Ce });
  class re {}
  re.i = !0;
  re.Je = !0;
  Object.assign(re.prototype, { l: re });
  class Pa {
    constructor() {
      this.Rx = this.ih();
      this.uA = this.Bc();
    }
    ib() {}
    ih() {
      return 201;
    }
    Bc() {
      throw 8;
    }
  }
  Pa.i = !0;
  Pa.Ib = [re];
  Object.assign(Pa.prototype, { l: Pa });
  class Be extends rd {
    constructor() {
      function a() {
        let c = window.document
          .createElement("canvas")
          .getContext("2d", { alpha: !0, willReadFrequently: !0 });
        c.canvas.width = 1024;
        c.canvas.height = 1024;
        return c;
      }
      super("2d");
      this.LL = 0;
      this.$a = this.context = null;
      this.$h = new kc();
      this.globalAlpha = 1;
      this.Dr = this.Xg = null;
      this.GB = !1;
      this.yj = 0;
      this.Nx = new fb(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.globalCompositeOperation = null;
      var b = (this.jM = Array(5));
      b[0] = "source-over";
      b[1] = "source-over";
      b[2] = "multiply";
      b[3] = "lighter";
      b[4] = "screen";
      this.Fu = [null];
      for (b = 0; 3 > b; ) {
        ++b;
        let c = a();
        this.Fu.push(c);
      }
      this.xP = a();
      new Y(va, va, wa, wa);
    }
    kp(a) {
      super.kp(a);
      this.context = a.getContext();
      this.Fu[0] = this.context;
    }
    clear(a) {
      super.clear();
      null == a && (a = this.clearColor);
      var b = this.Wb;
      let c = this.viewport,
        d = (b.size.x * c.x) | 0,
        e = (b.size.y * c.y) | 0,
        f = (b.size.x * c.w) | 0;
      b = (b.size.y * c.J) | 0;
      this.clearRect(d, e, f, b);
      0 != a.w &&
        (this.Ti(
          "rgba(" +
            (((255 * a.x) | 0) & 255) +
            "," +
            (((255 * a.y) | 0) & 255) +
            "," +
            (((255 * a.z) | 0) & 255) +
            "," +
            a.w.toFixed(2) +
            ")"
        ),
        this.fillRect(d, e, f, b));
    }
    Fi() {
      if (!super.Fi()) return !1;
      this.$a = this.context;
      try {
        this.context.reset();
      } catch (a) {}
      this.$a.fillStyle = "#000000";
      this.globalAlpha = 1;
      this.um();
      this.context.save();
      this.Kx();
      return !0;
    }
    ei() {
      for (super.ei(); 0 < this.yj; ) this.$a.restore(), this.yj--;
      this.context.restore();
    }
    yk(a, b, c, d) {
      super.yk(a, b, c, d);
      for (this.Kx(); 0 < this.yj; ) this.$a.restore(), this.yj--;
      this.resetTransform();
      if (0 != a || 0 != b || 1 != c || 1 != d)
        (a = new Path2D()),
          (b = this.Wb),
          (c = this.viewport),
          a.rect(
            (b.size.x * c.x) | 0,
            (b.size.y * c.y) | 0,
            (b.size.x * c.w) | 0,
            (b.size.y * c.J) | 0
          ),
          this.$a.save(),
          this.$a.clip(a),
          this.yj++;
    }
    uk(a) {
      super.uk(a);
      this.Kx();
    }
    pl(a) {
      var b = a.effect;
      if (null != b && b.enabled && 1 != a.Ne)
        if (0 < (a.flags & 4))
          (this.rf = a),
            (a = this.globalAlpha),
            (this.globalAlpha = 0.75),
            this.Pn(b),
            (this.globalAlpha = a);
        else if (((this.rf = a), this.zh(a), null == this.Dr)) this.Pn(b);
        else {
          this.RA(a.effect.type, a.type);
          a = this.Wb.size.x;
          var c = this.Wb.size.y;
          this.$a = this.xP;
          this.Ww(a, c);
          this.Pn(b);
          this.Dm(this.GB ? "destination-out" : "destination-in");
          b = this.od;
          this.od = 0;
          var d = this.rf;
          this.rf = this.Dr;
          this.Pn(this.Dr.effect);
          this.od = b;
          this.rf = d;
          b = this.$a.canvas;
          this.$a = this.context;
          this.Dm("source-over");
          this.resetTransform();
          this.$a.drawImage(b, 0, 0, a, c, 0, 0, a, c);
        }
    }
    co(a) {
      0 < (a.K & 240) && a.ht();
      var b = a.Ue;
      a = b.m11;
      let c = b.m12,
        d = b.m13,
        e = b.m14,
        f = b.m21,
        g = b.m22,
        h = b.m23,
        m = b.m24,
        n = b.m31,
        q = b.m32,
        p = b.m33,
        v = b.m34,
        u = b.m41,
        A = b.m42,
        C = b.m43;
      b = b.m44;
      var B = this.Ab.lk;
      let K = this.mA,
        E = this.Nx,
        aa = E.m11 * B.m11 + E.m12 * B.m21 + E.m13 * B.m31 + E.m14 * B.m41,
        Z = E.m11 * B.m12 + E.m12 * B.m22 + E.m13 * B.m32 + E.m14 * B.m42,
        V = E.m11 * B.m13 + E.m12 * B.m23 + E.m13 * B.m33 + E.m14 * B.m43,
        ea = E.m11 * B.m14 + E.m12 * B.m24 + E.m13 * B.m34 + E.m14 * B.m44,
        xa = E.m21 * B.m11 + E.m22 * B.m21 + E.m23 * B.m31 + E.m24 * B.m41,
        pa = E.m21 * B.m12 + E.m22 * B.m22 + E.m23 * B.m32 + E.m24 * B.m42,
        fa = E.m21 * B.m13 + E.m22 * B.m23 + E.m23 * B.m33 + E.m24 * B.m43,
        sa = E.m21 * B.m14 + E.m22 * B.m24 + E.m23 * B.m34 + E.m24 * B.m44,
        Ga = E.m31 * B.m11 + E.m32 * B.m21 + E.m33 * B.m31 + E.m34 * B.m41,
        qa = E.m31 * B.m12 + E.m32 * B.m22 + E.m33 * B.m32 + E.m34 * B.m42,
        ia = E.m31 * B.m13 + E.m32 * B.m23 + E.m33 * B.m33 + E.m34 * B.m43,
        ab = E.m31 * B.m14 + E.m32 * B.m24 + E.m33 * B.m34 + E.m34 * B.m44,
        lb = E.m41 * B.m11 + E.m42 * B.m21 + E.m43 * B.m31 + E.m44 * B.m41,
        Ra = E.m41 * B.m12 + E.m42 * B.m22 + E.m43 * B.m32 + E.m44 * B.m42,
        mb = E.m41 * B.m13 + E.m42 * B.m23 + E.m43 * B.m33 + E.m44 * B.m43;
      B = E.m41 * B.m14 + E.m42 * B.m24 + E.m43 * B.m34 + E.m44 * B.m44;
      K.m11 = aa * a + Z * f + V * n + ea * u;
      K.m12 = aa * c + Z * g + V * q + ea * A;
      K.m13 = aa * d + Z * h + V * p + ea * C;
      K.m14 = aa * e + Z * m + V * v + ea * b;
      K.m21 = xa * a + pa * f + fa * n + sa * u;
      K.m22 = xa * c + pa * g + fa * q + sa * A;
      K.m23 = xa * d + pa * h + fa * p + sa * C;
      K.m24 = xa * e + pa * m + fa * v + sa * b;
      K.m31 = Ga * a + qa * f + ia * n + ab * u;
      K.m32 = Ga * c + qa * g + ia * q + ab * A;
      K.m33 = Ga * d + qa * h + ia * p + ab * C;
      K.m34 = Ga * e + qa * m + ia * v + ab * b;
      K.m41 = lb * a + Ra * f + mb * n + B * u;
      K.m42 = lb * c + Ra * g + mb * q + B * A;
      K.m43 = lb * d + Ra * h + mb * p + B * C;
      K.m44 = lb * e + Ra * m + mb * v + B * b;
      return K;
    }
    ni(a) {
      0 < (a.K & 64) && a.Mm();
      var b = a.Ue;
      a = b.m11;
      let c = b.m12;
      var d = b.m14;
      let e = b.m21,
        f = b.m22,
        g = b.m24;
      b = this.uM;
      let h = this.Nx,
        m = this.Ab.lk,
        n = h.m11 * m.m11 + h.m12 * m.m21,
        q = h.m11 * m.m12 + h.m12 * m.m22,
        p = h.m21 * m.m11 + h.m22 * m.m21,
        v = h.m21 * m.m12 + h.m22 * m.m22,
        u = n * d + q * g + (h.m11 * m.m14 + h.m12 * m.m24 + h.m14);
      d = p * d + v * g + (h.m21 * m.m14 + h.m22 * m.m24 + h.m24);
      b.m11 = n * a + q * e;
      b.m12 = n * c + q * f;
      b.m14 = u;
      b.m21 = p * a + v * e;
      b.m22 = p * c + v * f;
      b.m24 = d;
      return b;
    }
    ax(a) {
      this.Ka(a.Sk);
    }
    Nw(a) {
      this.Xg = a.Xg;
      this.context.globalCompositeOperation = this.jM[this.Xg];
    }
    Qw(a) {
      this.$h = a.transform;
    }
    Zw(a) {
      this.Dr = a.va;
      this.GB = a.wO;
      let b = a.Au;
      if (null != b) {
        this.$a.save();
        this.resetTransform();
        this.yj++;
        a = this.ni(a.Qr.Ea);
        let e = new Path2D();
        var c = b[0],
          d = new F(
            a.m11 * c.x + a.m12 * c.y + a.m14,
            a.m21 * c.x + a.m22 * c.y + a.m24,
            0,
            1
          );
        e.moveTo(d.x, d.y);
        for (c = 1; c < b.length; ) {
          d = b[c++];
          let f = a;
          d = new F(
            f.m11 * d.x + f.m12 * d.y + f.m14,
            f.m21 * d.x + f.m22 * d.y + f.m24,
            0,
            1
          );
          e.lineTo(d.x, d.y);
        }
        e.closePath();
        this.$a.clip(e);
      } else 0 < this.yj && this.$a.restore();
    }
    Kx() {
      let a = this.Wb,
        b = this.viewport,
        c = ((a.size.x * b.w) | 0) / 2,
        d = ((a.size.y * b.J) | 0) / 2;
      this.Wb.sS && ((c |= 0), (d |= 0));
      let e = this.Nx;
      e.m11 = c;
      e.m12 = 0;
      e.m13 = 0;
      e.m14 = c + ((a.size.x * b.x) | 0);
      e.m21 = 0;
      e.m22 = -d;
      e.m23 = 0;
      e.m24 = d + ((a.size.y * b.y) | 0);
    }
    zv(a) {
      return new vd(this, a);
    }
    Ka(a) {
      this.globalAlpha = a;
      this.context.globalAlpha = a;
    }
    jp(a) {
      this.$a = this.Fu[a];
    }
    Ww(a, b) {
      let c = this.$a.canvas,
        d = c.width,
        e = c.height,
        f = !1,
        g = this.Wb.size;
      if (d > g.x || e > g.y) (c.width = g.x), (c.height = g.y);
      if (d < a || e < b) f = !0;
      else
        try {
          this.$a.reset();
        } catch (h) {
          f = !0;
        }
      f && ((c.width = a), (c.height = b));
    }
    drawImage(a, b, c, d, e, f, g, h, m) {
      this.$a.drawImage(a, b, c, d, e, f, g, h, m);
    }
    Ti(a) {
      this.$a.fillStyle = a;
    }
    YD(a) {
      this.$a.strokeStyle = a;
    }
    Dm(a) {
      let b = this.$a;
      b.globalCompositeOperation != a && (b.globalCompositeOperation = a);
    }
    resetTransform() {
      this.$a.setTransform(1, 0, 0, 1, 0, 0);
    }
    vk(a) {
      a = this.ni(a);
      this.$a.setTransform(a.m11, a.m21, a.m12, a.m22, a.m14, a.m24);
    }
    clearRect(a, b, c, d) {
      this.$a.clearRect(a, b, c, d);
    }
    fillRect(a, b, c, d) {
      this.$a.fillRect(a, b, c, d);
    }
    Fz(a, b, c, d, e) {
      this.$a.globalAlpha = 1;
      var f = this.ki(2);
      this.jp(1);
      this.Ww(d, e);
      this.Dm("copy");
      var g = f.transform;
      var h = g.$b;
      f = g.offset;
      switch (g.hint) {
        case 0:
          this.drawImage(a, b, c, d, e, 0, 0, d, e);
          this.HL(this.$a, g, d, e);
          break;
        case 1:
          this.$a.globalAlpha = g.$b.w;
          this.drawImage(a, b, c, d, e, 0, 0, d, e);
          break;
        case 2:
          var m = 1 - h.x;
          f = 0 == f.x ? (h = g = 0) : (h = g = 1);
          this.Ti(
            "rgba(" +
              (((255 * g) | 0) & 255) +
              "," +
              (((255 * h) | 0) & 255) +
              "," +
              (((255 * f) | 0) & 255) +
              "," +
              m.toFixed(2) +
              ")"
          );
          this.fillRect(0, 0, d, e);
          this.Dm("destination-atop");
          this.drawImage(a, b, c, d, e, 0, 0, d, e);
          break;
        case 3:
          (m = 1 - h.x),
            (g = f.x / m),
            (h = f.y / m),
            (f = f.z / m),
            this.Ti(
              "rgba(" +
                (((255 * g) | 0) & 255) +
                "," +
                (((255 * h) | 0) & 255) +
                "," +
                (((255 * f) | 0) & 255) +
                "," +
                m.toFixed(2) +
                ")"
            ),
            this.fillRect(0, 0, d, e),
            this.Dm("destination-atop"),
            this.drawImage(a, b, c, d, e, 0, 0, d, e);
      }
      a = this.$a.canvas;
      this.jp(0);
      return a;
    }
    Ez(a, b, c, d, e) {
      this.jp(2);
      this.Ww(d, e);
      this.Ti(qi);
      this.fillRect(0, 0, d, e);
      this.$a.globalAlpha = this.globalAlpha;
      this.Dm("screen");
      this.drawImage(a, b, c, d, e, 0, 0, d, e);
      this.fillRect(0, 0, d, e);
      a = this.$a.canvas;
      this.jp(0);
      return a;
    }
    HL(a, b, c, d) {
      c = a.getImageData(0, 0, c, d);
      d = c.data;
      let e = 0,
        f = d.length;
      var g = b.$b,
        h = b.offset;
      b = g.x;
      let m = g.y,
        n = g.z;
      g = g.w;
      let q = h.x,
        p = h.y,
        v = h.z;
      h = h.w;
      let u;
      for (; e < f; )
        (u = d[e + 3]),
          (d[e] = 255 * ((d[e] / u) * b + q)),
          ++e,
          (d[e] = 255 * ((d[e] / u) * m + p)),
          ++e,
          (d[e] = 255 * ((d[e] / u) * n + v)),
          ++e,
          (d[e] = 255 * ((u / 255) * g + h)),
          ++e;
      a.putImageData(c, 0, 0);
    }
    KD(a) {
      this.$a.imageSmoothingEnabled = a;
    }
  }
  Be.i = !0;
  Be.s = rd;
  Object.assign(Be.prototype, { l: Be });
  class vd extends sd {
    constructor(a, b) {
      super(a, b);
    }
  }
  vd.i = !0;
  vd.s = sd;
  Object.assign(vd.prototype, { l: vd });
  class lg extends rc {
    constructor() {
      super();
    }
    Az(a, b, c) {
      var d = this.no;
      let e = d.A,
        f = d.D,
        g = d.B;
      d = d.G;
      switch (a) {
        case 10:
          var h = c[b];
          a = c[b + 1];
          var m = c[b + 2];
          c = c[b + 3];
          h < e && (e = h);
          h > g && (g = h);
          a < f && (f = a);
          a > d && (d = a);
          h += m;
          c = a + c;
          h < e && (e = h);
          h > g && (g = h);
          c < f && (f = c);
          c > d && (d = c);
          b += 4;
          break;
        case 11:
          h = c[b];
          a = c[b + 1];
          m = c[b + 2];
          c = c[b + 3];
          h < e && (e = h);
          h > g && (g = h);
          a < f && (f = a);
          a > d && (d = a);
          h += m;
          c = a + c;
          h < e && (e = h);
          h > g && (g = h);
          c < f && (f = c);
          c > d && (d = c);
          b += 5;
          break;
        case 12:
          a = c[b];
          h = c[b + 1];
          a < e && (e = a);
          a > g && (g = a);
          h < f && (f = h);
          h > d && (d = h);
          a = c[b + 2];
          c = c[b + 3];
          a < e && (e = a);
          a > g && (g = a);
          c < f && (f = c);
          c > d && (d = c);
          b += 4;
          break;
        case 13:
          a = c[b];
          h = c[b + 1];
          a < e && (e = a);
          a > g && (g = a);
          h < f && (f = h);
          h > d && (d = h);
          a = c[b + 2];
          h = c[b + 3];
          a < e && (e = a);
          a > g && (g = a);
          h < f && (f = h);
          h > d && (d = h);
          a = c[b + 4];
          c = c[b + 5];
          a < e && (e = a);
          a > g && (g = a);
          c < f && (f = c);
          c > d && (d = c);
          b += 6;
          break;
        case 14:
          h = c[b];
          a = c[b + 1];
          c = c[b + 2];
          m = h - c;
          var n = a - c;
          m < e && (e = m);
          m > g && (g = m);
          n < f && (f = n);
          n > d && (d = n);
          h += c;
          c = a + c;
          h < e && (e = h);
          h > g && (g = h);
          c < f && (f = c);
          c > d && (d = c);
          b += 5;
          break;
        case 15:
          h = c[b];
          a = c[b + 1];
          c = Math.max(c[b + 2], c[b + 3]);
          m = h - c;
          n = a - c;
          m < e && (e = m);
          m > g && (g = m);
          n < f && (f = n);
          n > d && (d = n);
          h += c;
          c = a + c;
          h < e && (e = h);
          h > g && (g = h);
          c < f && (f = c);
          c > d && (d = c);
          b += 8;
          break;
        case 16:
          ++b;
          break;
        case 17:
          b += 1 + (c[b] | 0);
      }
      c = this.no;
      c.A = e;
      c.D = f;
      c.B = g;
      c.G = d;
      return b;
    }
    ya() {
      return 1305;
    }
  }
  lg.i = !0;
  lg.s = rc;
  Object.assign(lg.prototype, { l: lg });
  class Te extends Pa {
    constructor() {
      super();
    }
    L(a) {
      let b = a.V,
        c = a.effect;
      var d = c.Hb;
      if (d.Zq()) {
        var e = d.image.data,
          f = d.size.x,
          g = d.size.y,
          h = b.globalAlpha;
        b.KD(0 < (d.flags & 8));
        0 < (b.od & 4) && (e = b.Fz(e, 0, 0, f, g));
        0 < (b.od & 1) && 0 == b.Xg && ((e = b.Ez(e, 0, 0, f, g)), (h = 1));
        b.Ka(h);
        b.jp(0);
        b.vk(a.va.Ea);
        g = c.Mg.Te;
        a = c.Hb.hc.wl;
        d = g.N;
        f = 0;
        g = 5 * ((g.aa / 5) | 0);
        h = c.size;
        var m = h.x,
          n = h.y;
        h = c.Pj;
        var q = m - h,
          p = n - h,
          v = null;
        c.clip &&
          ((v = b.$a), v.save(), v.rect(h, h, m - 2 * h, n - 2 * h), v.clip());
        for (m = c.multiline; f < g; ) {
          var u = d[f++];
          n = d[f++];
          let A = d[f++],
            C = d[f++],
            B = f++;
          u = a[u].Nd;
          if (m) {
            if (A > p) break;
          } else if (n > q) break;
          n + C > h && b.drawImage(e, u.x, u.y, u.w, u.J, n, A, C, d[B]);
        }
        c.clip && v.restore();
      }
    }
    Bc() {
      return 505;
    }
    ih() {
      return 401;
    }
  }
  Te.i = !0;
  Te.s = Pa;
  Object.assign(Te.prototype, { l: Te });
  class Ye extends Pa {
    constructor() {
      super();
    }
    L(a) {
      var b = a.V;
      let c = a.effect;
      this.Zh = a.V.Wb.getContext();
      this.Zh.lineWidth = 1;
      b.vk(a.va.Ea);
      a = 0;
      for (b = c.points.length; a < b; ) {
        var d = a++;
        this.Zh.globalAlpha = c.on[d];
        this.Zh.lineWidth = 2 * c.Z;
        let f = new Path2D(),
          g = c.points[d];
        d = c.Yh[d];
        let h = 0,
          m = g.length;
        for (; h < m; ) {
          let n = h++;
          var e = d[n];
          this.Zh.strokeStyle =
            "rgba(" +
            (((255 * e.x) | 0) & 255) +
            "," +
            (((255 * e.y) | 0) & 255) +
            "," +
            (((255 * e.z) | 0) & 255) +
            "," +
            e.w.toFixed(2) +
            ")";
          e = g[n].x;
          let q = g[n].y;
          0 == n ? f.moveTo(e, q) : f.lineTo(e, q);
        }
        this.Zh.stroke(f);
      }
    }
    Bc() {
      return 705;
    }
  }
  Ye.i = !0;
  Ye.s = Pa;
  Object.assign(Ye.prototype, { l: Ye });
  class Ue extends Pa {
    constructor() {
      super();
    }
    L(a) {
      let b = a.V;
      var c = a.effect,
        d = a.va;
      b.vk(a.va.Ea);
      a = c.color;
      if (0 < (b.od & 4)) {
        var e = b.$h;
        c = c.color;
        a = e.$b;
        let f = e.offset;
        e = c.x * a.x + f.x;
        let g = c.y * a.y + f.y,
          h = c.z * a.z + f.z;
        c = c.w * a.w + f.w;
        a = new F(
          0 > e ? 0 : 1 < e ? 1 : e,
          0 > g ? 0 : 1 < g ? 1 : g,
          0 > h ? 0 : 1 < h ? 1 : h,
          0 > c ? 0 : 1 < c ? 1 : c
        );
      }
      b.Ka(b.globalAlpha);
      b.Ti(
        "rgba(" +
          (((255 * a.x) | 0) & 255) +
          "," +
          (((255 * a.y) | 0) & 255) +
          "," +
          (((255 * a.z) | 0) & 255) +
          "," +
          a.w.toFixed(2) +
          ")"
      );
      d = d.size;
      b.fillRect(0, 0, d.x, d.y);
    }
    Bc() {
      return 1205;
    }
    ih() {
      return 401;
    }
  }
  Ue.i = !0;
  Ue.s = Pa;
  Object.assign(Ue.prototype, { l: Ue });
  class Ve extends Pa {
    constructor() {
      super();
    }
    L(a) {
      let b = a.V;
      var c = a.effect,
        d = b.Wb.size;
      a = d.x;
      d = d.y;
      b.resetTransform();
      b.Ka(b.globalAlpha);
      let e = 0,
        f = 0,
        g = c.cs;
      null != g && ((e = g.A), (f = g.D), (a = g.B - g.A), (d = g.G - g.D));
      c = c.color;
      b.Ti(
        "rgba(" +
          (((255 * c.x) | 0) & 255) +
          "," +
          (((255 * c.y) | 0) & 255) +
          "," +
          (((255 * c.z) | 0) & 255) +
          "," +
          c.w.toFixed(2) +
          ")"
      );
      b.fillRect(e, f, a, d);
    }
    Bc() {
      return 305;
    }
  }
  Ve.i = !0;
  Ve.s = Pa;
  Object.assign(Ve.prototype, { l: Ve });
  class Xe extends Pa {
    constructor() {
      super();
    }
    ib(a) {
      super.ib(a);
    }
    L(a) {
      let b = a.V;
      var c = a.effect;
      this.Zh = a.V.Wb.getContext();
      b.vk(a.va.Ea);
      a = 0;
      for (c = c.ft; a < c.length; ) this.cN(c[a++]);
    }
    cN(a) {
      let b = a[0];
      if (0 != a.length) {
        var c = new Path2D();
        c.moveTo(b.x, b.y);
        for (var d = 1, e = a.length; d < e; )
          (b = a[d]), c.lineTo(b.x, b.y), (d += 2);
        for (d = a.length - 2; 0 <= d; )
          (b = a[d]), c.lineTo(b.x, b.y), (d -= 2);
        c.closePath();
        this.Zh.fillStyle = "#ffffffff";
        this.Zh.fill(c);
      }
    }
    Bc() {
      return 1105;
    }
  }
  Xe.i = !0;
  Xe.s = Pa;
  Object.assign(Xe.prototype, { l: Xe });
  class Ze extends Pa {
    constructor() {
      super();
    }
    L(a) {
      var b = a.effect;
      a.V.vk(a.va.Ea);
      a = a.V.Wb.getContext();
      a.lineWidth = b.lineWidth;
      a.globalAlpha = 1;
      var c = b.color;
      a.strokeStyle =
        "rgba(" +
        (((255 * c.x) | 0) & 255) +
        "," +
        (((255 * c.y) | 0) & 255) +
        "," +
        (((255 * c.z) | 0) & 255) +
        "," +
        c.w.toFixed(2) +
        ")";
      c = b.No;
      let d = 2 * Math.PI,
        e = d / c,
        f = b.C.x,
        g = b.C.y;
      b = b.Z;
      let h = 0;
      for (; h < c; ) {
        var m = h++;
        1 != (m & 1) &&
          ((m = (m / c) * d),
          a.beginPath(),
          a.arc(f, g, b, m, m + e, !1),
          a.stroke(),
          a.closePath());
      }
    }
    Bc() {
      return 605;
    }
  }
  Ze.i = !0;
  Ze.s = Pa;
  Object.assign(Ze.prototype, { l: Ze });
  class We extends Pa {
    constructor() {
      super();
      this.yR = new F(0, 0, 0, 0);
      this.qS = !1;
    }
    L(a) {
      var b = a.effect;
      let c = a.V,
        d = 0 < (c.od & 1) && 0 == c.Xg ? 1 : 0,
        e = 0 < (c.od & 4) ? c.$h : null,
        f = b.sQ,
        g = !1,
        h = !1,
        m = !1,
        n = 0,
        q = b.Du,
        p = b.data,
        v = 0,
        u = 0;
      let A;
      b = b.Eu;
      if (0 != b) {
        var C = c.$a;
        this.qS
          ? c.resetTransform()
          : ((a = c.ni(a.va.Ea)),
            C.setTransform(a.m11, a.m21, a.m12, a.m22, a.m14, a.m24));
        a = !1;
        for (var B = new Path2D(); v < b; )
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
              c.YD(this.OA(p[u++], Math.min(p[u++] + d, 1), e));
              n = p[u++] | 0;
              C.lineWidth = n;
              m = 0 == h;
              g = !0;
              break;
            case 5:
              c.Ti(this.OA(p[u++], Math.min(p[u++] + d, 1), e));
              m = g;
              h = !0;
              break;
            case 6:
              g = !1;
              c.YD(qi);
              C.lineWidth = 1;
              break;
            case 7:
              h = !1;
              c.Ti(qi);
              break;
            case 8:
              K = g && f && 1 == (n & 1);
              a
                ? K || (C.translate(-0.5, -0.5), (a = !1))
                : K && (C.translate(0.5, 0.5), (a = !0));
              g && h
                ? m
                  ? (C.stroke(B), C.fill(B))
                  : (C.fill(B), C.stroke(B))
                : g
                ? C.stroke(B)
                : h && C.fill(B);
              v < b - 1 && (B = new Path2D());
              break;
            default:
              u = 0;
          }
      }
    }
    Bc() {
      return 1005;
    }
    OA(a, b, c) {
      if (null != c) {
        var d = this.yR;
        d.x = ((a >> 16) & 255) / 255;
        d.y = ((a >> 8) & 255) / 255;
        d.z = (a & 255) / 255;
        d.w = b;
        a = c.$b;
        c = c.offset;
        let e = d;
        d = e.x * a.x + c.x;
        b = e.y * a.y + c.y;
        let f = e.z * a.z + c.z;
        a = e.w * a.w + c.w;
        d = new F(
          0 > d ? 0 : 1 < d ? 1 : d,
          0 > b ? 0 : 1 < b ? 1 : b,
          0 > f ? 0 : 1 < f ? 1 : f,
          0 > a ? 0 : 1 < a ? 1 : a
        );
        return (
          "rgba(" +
          (((255 * d.x) | 0) & 255) +
          "," +
          (((255 * d.y) | 0) & 255) +
          "," +
          (((255 * d.z) | 0) & 255) +
          "," +
          d.w.toFixed(2) +
          ")"
        );
      }
      a |= ((255 * b) | 0) << 24;
      c = pi.xy;
      return (
        "#" + c[(a >> 16) & 255] + c[(a >> 8) & 255] + c[a & 255] + c[a >>> 24]
      );
    }
  }
  We.i = !0;
  We.s = Pa;
  Object.assign(We.prototype, { l: We });
  class F {
    constructor(a, b, c, d) {
      this.x = a;
      this.y = b;
      this.z = c;
      this.w = d;
    }
  }
  F.i = !0;
  Object.assign(F.prototype, { l: F });
  class $e extends Pa {
    constructor() {
      super();
    }
    L(a) {
      let b = a.effect;
      a.V.vk(a.va.Ea);
      a = a.V.Wb.getContext();
      a.lineWidth = b.lineWidth;
      a.globalAlpha = b.yr;
      a.strokeStyle = "#ffffff";
      a.beginPath();
      a.arc(0, 0, b.Z + b.lineWidth / 2, 0, 2 * Math.PI, !1);
      a.stroke();
      a.closePath();
    }
    Bc() {
      return 905;
    }
  }
  $e.i = !0;
  $e.s = Pa;
  Object.assign($e.prototype, { l: $e });
  class Se extends Pa {
    constructor() {
      super();
    }
    L(a) {
      var b = a.effect;
      let c = a.V;
      var d = a.va,
        e = b.Hb;
      if (e.Zq()) {
        c.KD(0 < (e.flags & 8));
        a = e.image.data;
        var f = d.size,
          g = f.x;
        f = f.y;
        c.vk(d.Ea);
        d = b.vp;
        var h = d.x;
        var m = d.y;
        var n = d.w,
          q = d.J,
          p = c.globalAlpha;
        0 < (c.od & 4) && ((a = c.Fz(a, h, m, n, q)), (h = m = 0));
        0 < (c.od & 1) &&
          0 == c.Xg &&
          ((a = c.Ez(a, h, m, n, q)), (h = m = 0), (p = 1));
        d = (1 / c.Ab.Pm.m11) * c.LL;
        if (1 == b.tm && 1 == b.$o && 0 == b.offsetX && 0 == b.offsetY)
          c.Ka(p),
            c.drawImage(a, h, m, n, q, 0 - d, 0 - d, g + 2 * d, f + 2 * d);
        else {
          var v = 0,
            u = b.offsetX,
            A = b.offsetY;
          0 != u && (v = 1);
          0 != A && (v |= 2);
          1 != b.tm && (v |= 4);
          1 != b.$o && (v |= 8);
          if (1 == v)
            (u %= 1),
              0 > u && ++u,
              (e = n * u),
              (b = g * u),
              c.drawImage(
                a,
                h + e,
                m,
                n - e,
                q,
                0 - d,
                0 - d,
                g - b + 2 * d,
                f + 2 * d
              ),
              c.drawImage(
                a,
                h,
                m,
                e,
                q,
                g - e - d,
                0 - d,
                b + 2 * d,
                f + 2 * d
              );
          else if (2 == v)
            (A %= 1),
              0 > A && ++A,
              (e = q * A),
              (b = f * A),
              c.drawImage(
                a,
                h,
                m + e,
                n,
                q - e,
                0 - d,
                0 - d,
                g + 2 * d,
                f - b + 2 * d
              ),
              c.drawImage(
                a,
                h,
                m,
                n,
                e,
                0 - d,
                f - e - d,
                g + 2 * d,
                b + 2 * d
              );
          else {
            c.Ka(p);
            h = e.size.x;
            m = e.size.y;
            g = b.tm;
            var C = b.$o;
            f = c.$a;
            f.save();
            n = new Path2D();
            n.rect(0, 0, h, m);
            f.clip(n);
            h = e.size.x;
            m = e.size.y;
            n = h / g;
            q = m / C;
            u = 1 / g;
            A = 1 / C;
            p = b.offsetX;
            var B = b.offsetY;
            b = p % 1;
            0 > b && ++b;
            b = -b;
            var K = B % 1;
            0 > K && ++K;
            K = -K;
            var E;
            v = n + 2 * d;
            var aa = q + 2 * d;
            if (0 < (e.flags & 4))
              for (
                e = 1 == ((B | 0) & 1) ? 1 : -1,
                  0 <= B && (e *= -1),
                  B = K * q,
                  C = K / C;
                1 > C;

              ) {
                K = C + A;
                let Z = 1 == ((p | 0) & 1) ? -1 : 1;
                0 <= p && (Z *= -1);
                C = b * n;
                for (E = b / g; 1 > E; )
                  (E += u),
                    f.save(),
                    f.scale(Z, e),
                    0 < Z
                      ? 0 < e
                        ? c.drawImage(a, 0, 0, h, m, C - d, B - d, v, aa)
                        : c.drawImage(a, 0, 0, h, m, C - d, -B - q - d, v, aa)
                      : 0 < e
                      ? c.drawImage(a, 0, 0, h, m, -C - n - d, B - d, v, aa)
                      : c.drawImage(
                          a,
                          0,
                          0,
                          h,
                          m,
                          -C - n - d,
                          -B - q - d,
                          v,
                          aa
                        ),
                    f.restore(),
                    (Z = -Z),
                    (C += n);
                e = -e;
                B += q;
                C = K;
              }
            else
              for (B = K * q, C = K / C; 1 > C; ) {
                K = C + A;
                C = b * n;
                for (E = b / g; 1 > E; )
                  (E += u),
                    c.drawImage(
                      a,
                      0,
                      0,
                      h,
                      m,
                      C - d,
                      B - d,
                      n + 2 * d,
                      q + 2 * d
                    ),
                    (C += n);
                B += q;
                C = K;
              }
            f.restore();
          }
        }
      }
    }
    Bc() {
      return 205;
    }
    ih() {
      return 401;
    }
  }
  Se.i = !0;
  Se.s = Pa;
  Object.assign(Se.prototype, { l: Se });
  class fb {
    constructor(a, b, c, d, e, f, g, h, m, n, q, p, v, u, A, C) {
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
      this.m44 = C;
    }
  }
  fb.i = !0;
  Object.assign(fb.prototype, { l: fb });
  class Zi {}
  class mg {
    static PA(a) {
      return mg.Yz[a >> 2];
    }
  }
  class $b {
    constructor() {
      this.Oi = this.R = this.V = null;
      this.Tz = [];
      this.pd = [];
    }
    ib(a) {
      this.V = a;
      this.R = this.V.R;
      this.createProgram() && this.Ig();
    }
    use() {
      this.V.nA != this && ((this.V.nA = this), this.R.useProgram(this.Oi));
    }
    drawArrays(a, b, c) {
      null == c && (c = 0);
      if (0 != a) {
        for (var d = 0, e = this.Tz; d < e.length; ) e[d++].bind();
        this.R.drawArrays(b, c, a);
      }
    }
    te(a, b) {
      var c, d;
      null == d && (d = !1);
      null == c && (c = -1);
      if (-1 == a) this.pd.push(new ob(a, null, !1, b, c));
      else {
        var e = Ma.find(this.pd, function (f) {
          return f.location == a;
        });
        e.type = b;
        e.usage = c;
        e.normalize = d;
      }
    }
    jg(a, b) {
      for (var c = 0, d = 0, e = this.pd; d < e.length; ) {
        var f = e[d];
        ++d;
        f.location > c && (c = f.location);
      }
      c = new Ih(c + 1);
      d = 0;
      for (e = this.pd; d < e.length; )
        (f = e[d]), ++d, c.CL(f.location, f.type, f.usage, f.normalize);
      c.seal();
      a = new wd(this.R, a, c, b);
      this.Tz.push(a);
      return a;
    }
    createProgram() {
      let a = this.R,
        b = this.ZB(35633, this.qg()),
        c = this.ZB(35632, this.og());
      this.Oi = a.createProgram();
      a.attachShader(this.Oi, b);
      a.attachShader(this.Oi, c);
      a.linkProgram(this.Oi);
      return !0;
    }
    ZB(a, b) {
      let c = this.R;
      a = this.R.createShader(a);
      c.shaderSource(a, b);
      c.compileShader(a);
      return a;
    }
    qg() {
      return null;
    }
    og() {
      return null;
    }
    Qe(a) {
      return this.R.getAttribLocation(this.Oi, a);
    }
    getUniformLocation(a) {
      return this.R.getUniformLocation(this.Oi, a);
    }
    cj(a, b) {
      let c = $b.JE;
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
      this.R.uniformMatrix4fv(a, !1, $b.JE);
    }
    WE(a, b) {
      this.R.activeTexture(33984);
      this.R.bindTexture(3553, b);
      this.R.uniform1i(a, 0);
    }
    Ig() {}
  }
  $b.i = !0;
  Object.assign($b.prototype, { l: $b });
  class ob {
    constructor(a, b, c, d, e) {
      this.location = a;
      this.name = b;
      this.normalize = c;
      this.type = d;
      this.usage = e;
    }
  }
  ob.i = !0;
  Object.assign(ob.prototype, { l: ob });
  class ng extends $b {
    constructor(a) {
      super();
      this.ib(a);
      this.te(this.Xp, 17);
      this.Ca = this.jg(4, 2);
      this.Ca.setData(this.Xp, [0, 1, 1, 1, 0, 0, 1, 0]);
      this.Ed = [];
    }
    RM(a) {
      this.use();
      var b = this.V.ni(this.V.ki(1).Qr.Ea);
      this.cj(this.xL, b);
      for (this.R.uniform4f(this.wL, 0, 0, 0, 0); 0 < this.Ed.length; )
        this.Ed.pop();
      for (b = 0; b < a.length; ) {
        let c = a[b];
        ++b;
        this.Ed.push(c.x);
        this.Ed.push(c.y);
      }
      this.Ca.resize(this.Ed.length);
      this.Ca.setData(this.Xp, this.Ed);
      this.V.R.stencilFunc(519, 1, 255);
      this.V.R.stencilOp(7680, 7680, 7681);
      this.drawArrays(a.length, 6);
      this.V.R.stencilFunc(514, 1, 255);
    }
    qg() {
      return "uniform mat4 u_m;attribute vec2 a_f;void main(){gl_Position=u_m*vec4(a_f,0,1);}";
    }
    og() {
      return "precision mediump float;uniform vec4 u_c;void main(){gl_FragColor=u_c;}";
    }
    Ig() {
      this.Xp = this.Qe("a_f");
      this.pd.push(new ob(this.Xp, "a_f", !1, -1, -1));
      this.xL = this.getUniformLocation("u_m");
      this.wL = this.getUniformLocation("u_c");
    }
  }
  ng.i = !0;
  ng.s = $b;
  Object.assign(ng.prototype, { l: ng });
  class Jh {
    constructor(a, b, c) {
      this.type = a;
      this.location = b;
      this.usage = c;
      this.cw = (a % 4) + 1;
      this.fm = this.cw * mg.Yz[a >> 2];
      this.offset = 0;
      this.vC = !1;
    }
  }
  Jh.i = !0;
  Object.assign(Jh.prototype, { l: Jh });
  class wd extends ag {
    constructor(a, b, c, d) {
      super(b, c.Om, d);
      this.format = c;
      this.R = a;
      this.qu = a.createBuffer();
      this.data = new ArrayBuffer(this.fm);
      this.ej = [];
      this.BB();
    }
    F() {
      this.R.deleteBuffer(this.qu);
      this.data = this.ej = this.R = this.qu = null;
    }
    resize(a) {
      return super.resize(a)
        ? ((this.data = new ArrayBuffer(this.fm)), this.BB(), !0)
        : !1;
    }
    dB(a) {
      return this.ej[a >> 2];
    }
    bind() {
      let a = this.R;
      a.bindBuffer(34962, this.qu);
      let b = this.format.Om;
      var c = this.format.attributes;
      let d = c.N,
        e = 0;
      for (c = c.aa; e < c; ) {
        let f = d[e++];
        -1 != f.location &&
          (a.enableVertexAttribArray(f.location),
          a.vertexAttribPointer(
            f.location,
            f.cw,
            wd.ZN[f.type >> 2],
            f.vC,
            b,
            f.offset
          ));
      }
      this.bh &&
        (a.bufferData(34962, this.data, 35040 + 4 * this.lT), (this.bh = !1));
    }
    mN(a) {
      var b = 0;
      null == b && (b = 0);
      return new og(this, a, b);
    }
    HA() {
      var a = [];
      let b = Array(this.format.Xv + 1);
      for (var c = 0, d = b.length; c < d; ) b[c++] = null;
      if (0 == a.length)
        for (a = this.format.iterator(); a.eb(); )
          (c = a.next()),
            -1 != c.location && (b[c.location] = this.mN(c.location));
      else
        for (c = 0; c < a.length; ) (d = a[c++]), (b[d] = new og(this, d, 0));
      return b;
    }
    setData(a, b, c) {
      null == c && (c = 0);
      this.bh = !0;
      0 == c && (c = b.length);
      var d = this.format.get(a);
      a = d.cw;
      var e = mg.PA(d.type);
      let f = (this.format.Om / e) | 0;
      e = (d.offset / e) | 0;
      d = this.dB(d.type);
      let g = 0;
      for (; g < c; ) (d[e + ((g / a) | 0) * f + (g % a)] = b[g]), ++g;
    }
    BB() {
      let a = this.data;
      this.ej = [
        new Int8Array(a),
        new Uint8Array(a),
        new Int16Array(a),
        new Uint16Array(a),
        new Float32Array(a),
        new Uint32Array(a),
      ];
    }
  }
  wd.i = !0;
  wd.s = ag;
  Object.assign(wd.prototype, { l: wd });
  class og {
    constructor(a, b, c) {
      this.mb = a;
      let d = a.format;
      b = d.get(b);
      this.view = a.dB(b.type);
      a = mg.PA(b.type);
      this.stride = (d.Om / a) | 0;
      this.start = this.g = ((b.offset / a) | 0) + c * this.stride;
      this.mb.bh = !0;
    }
    ZD(a, b) {
      let c = this.view,
        d = this.g,
        e = this.stride;
      c[d + 0 * e] = 0;
      c[d + 0 * e + 1] = 1;
      c[d + e] = 1;
      c[d + e + 1] = a;
      c[d + 2 * e] = b;
      c[d + 2 * e + 1] = 0;
      this.g = d + 3 * e;
    }
  }
  og.i = !0;
  Object.assign(og.prototype, { l: og });
  class ri {
    static Hw(a) {
      let b = 0,
        c = a.length;
      for (; b < c; ) {
        let d = a[b++];
        null != d && ((d.g = d.start), (d.mb.bh = !0));
      }
    }
  }
  class Ih {
    constructor(a) {
      this.Om = this.Xv = 0;
      this.attributes = new vb(a);
      this.attributes.ib(a, null);
    }
    get(a) {
      return this.attributes.N[a];
    }
    iterator() {
      return this.attributes.iterator();
    }
    CL(a, b, c, d) {
      null == d && (d = !1);
      null == c && (c = -1);
      b = new Jh(b, a, c);
      this.Xv = Math.max(this.Xv, a);
      b.vC = d;
      -1 == a ? this.attributes.tw(b) : (this.attributes.N[a] = b);
      this.Om += b.fm;
    }
    seal() {
      this.attributes.pQ();
      let a = this.attributes.aa,
        b = 1;
      for (; b < a; ) {
        let c = this.attributes.N[b - 1];
        this.attributes.N[b].offset = c.offset + c.fm;
        ++b;
      }
    }
  }
  Ih.i = !0;
  Object.assign(Ih.prototype, { l: Ih });
  class Sa extends $b {
    constructor() {
      super();
      this.Rx = this.ih();
      this.uA = this.Bc();
    }
    ih() {
      return 201;
    }
    Bc() {
      throw 9;
    }
  }
  Sa.i = !0;
  Sa.Ib = [re];
  Sa.s = $b;
  Object.assign(Sa.prototype, { l: Sa });
  class Cb extends rd {
    constructor() {
      super("webgl");
      this.R = null;
      this.ll = 1;
      this.$h = new kc();
      this.cu = this.stencilMask = this.nA = null;
      this.tM = new vb();
    }
    kp(a) {
      super.kp(a);
      this.R = a.getContext();
      this.um();
    }
    clear(a) {
      super.clear();
      null == a && (a = this.clearColor);
      this.R.clearColor(a.x, a.y, a.z, a.w);
      this.R.clear(17664);
    }
    Fi() {
      if (!super.Fi() || null == this.R) return !1;
      this.um();
      return !0;
    }
    ei() {
      super.ei();
    }
    yk(a, b, c, d) {
      super.yk(a, b, c, d);
      if (0 == a && 0 == b && 1 == c && 1 == d)
        this.R.viewport(0, 0, this.Wb.size.x, this.Wb.size.y),
          this.R.disable(3089);
      else {
        d = this.Wb;
        var e = this.viewport;
        a = (d.size.x * e.x) | 0;
        b = (d.size.x * e.w) | 0;
        c = (d.size.y * e.J) | 0;
        d = (this.Wb.size.y | 0) - c - ((d.size.y * e.y) | 0);
        this.R.viewport(a, d, b, c);
        this.R.enable(3089);
        this.R.scissor(a, d, b, c);
      }
    }
    ax(a) {
      this.ll = a.Sk;
    }
    ID(a) {
      a.kn
        ? (this.R.enable(2884),
          this.R.frontFace(a.qL ? 2305 : 2304),
          this.R.cullFace(1029))
        : this.R.disable(2884);
    }
    HD(a) {
      a.kn
        ? (this.R.enable(2929), this.R.depthFunc(Cb.BM[a.sz]))
        : (this.R.disable(2929), this.R.depthFunc(513));
    }
    Nw(a) {
      let b = 0,
        c = 0;
      if (a.IQ)
        switch (a.Xg) {
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
            (b = Cb.gq[a.cE]), (c = Cb.gq[a.qA]);
        }
      else
        switch (a.Xg) {
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
            (b = Cb.gq[a.cE]), (c = Cb.gq[a.qA]);
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
    Qw(a) {
      this.$h = a.transform;
    }
    Zw(a) {
      a = a.Au;
      null != this.cu && null == a && this.R.disable(2960);
      null == this.cu &&
        null != a &&
        (this.R.clearStencil(0),
        this.R.enable(2960),
        null == this.stencilMask && (this.stencilMask = new ng(this)),
        this.stencilMask.RM(a));
      this.cu = a;
    }
    Ou(a) {
      if (0 == this.zP) super.Ou(a);
      else {
        var b = a.iterator(),
          c = b.N[b.xe++],
          d = this.tM;
        d.Mf(a.aa);
        d.clear();
        var e = (d.N[d.aa++] = c);
        a = c.ar;
        var f = c.effect;
        f.update(this);
        this.info.effect = f;
        for (this.info.Lz = d; b.xe < b.wg; ) {
          c = b.N[b.xe++];
          c.effect.update(this);
          let g = f.type == c.effect.type;
          if (
            (g =
              (g =
                (g = (g = g && f.ab == c.effect.ab) && (a & 3) == (c.ar & 3)) &&
                (0 < (a & 1) ? e.Gk[0].ab == c.Gk[0].ab : !0)) &&
              (0 < (a & 2) ? e.Gk[1].ab == c.Gk[1].ab : !0))
          )
            d.N[d.aa++] = c;
          else {
            if (1 == d.aa) this.pl(d.Ba());
            else if (
              ((a = d.N[0]), (a = this.SA(a.effect.type, a.type)), null != a)
            )
              a.L(this.info);
            else for (a = d.N, f = 0, e = d.aa; f < e; ) this.pl(a[f++]);
            d.clear();
            e = d.N[d.aa++] = c;
            a = c.ar;
            f = c.effect;
            f.update(this);
            this.info.effect = f;
            this.info.Lz = d;
          }
        }
        if (0 < d.aa)
          if (1 == d.aa) this.pl(d.Ba());
          else if (
            ((b = d.N[0]), (b = this.SA(b.effect.type, b.type)), null != b)
          )
            b.L(this.info);
          else for (b = d.N, c = 0, d = d.aa; c < d; ) this.pl(b[c++]);
      }
    }
    zv(a) {
      return new pg(this, a);
    }
  }
  Cb.i = !0;
  Cb.s = rd;
  Object.assign(Cb.prototype, { l: Cb });
  class pg extends vd {
    constructor(a, b) {
      super(a, b);
      this.handle = null;
      this.R = a.R;
    }
    F() {
      null == this.parent && this.R.deleteTexture(this.handle);
      this.R = this.handle = null;
      super.F();
    }
    Uw(a) {
      super.Uw(a);
      null != this.handle &&
        (null == this.parent && this.R.deleteTexture(this.handle),
        (this.handle = null));
      null == this.handle && (this.handle = this.R.createTexture());
      this.R.bindTexture(3553, this.handle);
      try {
        var b = a.data instanceof ImageBitmap;
      } catch (d) {
        b = !1;
      }
      b || this.R.pixelStorei(37441, 1);
      this.R.pixelStorei(37440, 1);
      b = 0 < (this.flags & 2) ? (0 < (this.flags & 4) ? 33648 : 10497) : 33071;
      let c = 0 < (this.flags & 8) ? 9729 : 9728;
      this.R.texParameteri(3553, 10242, b);
      this.R.texParameteri(3553, 10243, b);
      this.R.texParameteri(3553, 10241, c);
      this.R.texParameteri(3553, 10240, c);
      this.R.texImage2D(3553, 0, 6408, 6408, 5121, a.data);
      0 < (this.flags & 240) &&
        ((a = 9984),
        0 < (this.flags & 32) && (a = 9985),
        0 < (this.flags & 64) && (a = 9986),
        0 < (this.flags & 128) && (a = 9987),
        this.R.texParameteri(3553, 10241, a),
        this.R.generateMipmap(3553));
      a = 0;
      for (b = this.children; a < b.length; ) b[a++].handle = this.handle;
      this.R.bindTexture(3553, null);
    }
    oa(a, b) {
      super.oa(a, b);
      a.handle = this.handle;
    }
  }
  pg.i = !0;
  pg.s = vd;
  Object.assign(pg.prototype, { l: pg });
  class qg extends ha {
    constructor() {
      super();
    }
    ya() {
      return 2005;
    }
  }
  qg.i = !0;
  qg.s = ha;
  Object.assign(qg.prototype, { l: qg });
  class rg extends ha {
    constructor() {
      super();
      new Kh(null, null, null, null);
      new Lh(null, null, null, null, null);
      this.$u = new Mh(null, null, null);
    }
    ya() {
      return 1905;
    }
  }
  rg.i = !0;
  rg.s = ha;
  Object.assign(rg.prototype, { l: rg });
  class Mh {
    constructor() {
      new F(0, 0, 0, 1);
      new F(0, 0, -1, 1);
      new F(0, 0, 0, 1);
    }
  }
  Mh.i = !0;
  Object.assign(Mh.prototype, { l: Mh });
  class Lh {
    constructor() {
      new F(1, 0, 0, 1);
      new F(Xd, 0, 1, 1);
      new F(1, 1, 1, 1);
      new F(1, 1, 1, 1);
      new F(1, 1, 1, 1);
    }
  }
  Lh.i = !0;
  Object.assign(Lh.prototype, { l: Lh });
  class Kh {
    constructor() {
      new F(0, 0, 0, 1);
      new F(0, 0, 0, 1);
      new F(0, 0, 0, 1);
      new F(0, 0, 0, 1);
    }
  }
  Kh.i = !0;
  Object.assign(Kh.prototype, { l: Kh });
  class sg extends ha {
    constructor(a) {
      super();
      this.Oi = a;
    }
    F() {}
    ya() {
      return 805;
    }
  }
  sg.i = !0;
  sg.s = ha;
  Object.assign(sg.prototype, { l: sg });
  class Le extends Sa {
    constructor() {
      super();
      this.Jh = this.Ca = null;
      this.size = 0;
    }
    ib(a) {
      super.ib(a);
      this.te(this.lf, 17);
      this.te(this.Tk, 13);
      this.te(Zi.JI, 7);
      this.Ca = this.jg(600, 2);
    }
    L(a) {
      this.use();
      var b = a.V;
      let c = a.effect;
      var d = c.Hb;
      if (d.Zq()) {
        var e = c.Mg.Te,
          f = (e.aa / 5) | 0;
        if (0 != f) {
          f > this.size &&
            ((this.size = f), this.Ca.resize(6 * f), (this.Jh = this.Ca.HA()));
          a = b.ni(a.va.Ea);
          this.cj(this.ln, a);
          this.WE(this.Wt, d.handle);
          a = d.size;
          this.R.uniform2f(this.Yt, a.x, a.y);
          a = this.Jh[this.lf];
          var g = this.Jh[this.Tk];
          if (c.clip) {
            this.R.uniform1f(this.kf, 0);
            this.R.uniform1i(this.vz, !1);
            ri.Hw(this.Jh);
            this.R.enable(2960);
            this.R.stencilFunc(519, 1, 255);
            this.R.stencilOp(7680, 7680, 7681);
            var h = c.QN(),
              m = h.x;
            h = h.y;
            var n = a.view,
              q = a.g,
              p = a.stride;
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
            g.ZD(0, 0);
            g.ZD(1, 1);
            this.R.uniform1f(this.kf, 0);
            this.drawArrays(6, 4);
            this.R.stencilFunc(514, 1, 255);
          }
          ri.Hw(this.Jh);
          this.R.uniform1f(this.kf, b.ll);
          b = 0 < (b.od & 4) ? b.$h : null;
          this.R.uniform1i(this.vz, null != b);
          null != b
            ? ((m = b.$b),
              this.R.uniform4f(this.Qh, m.x, m.y, m.z, m.w),
              (b = b.offset),
              this.R.uniform4f(this.Rh, b.x, b.y, b.z, b.w))
            : (this.R.uniform4f(this.Qh, 1, 1, 1, 1),
              (b = new F(0, 0, 0, 0)),
              this.R.uniform4f(this.Rh, b.x, b.y, b.z, b.w));
          d = d.hc.wl;
          e = e.N;
          b = 0;
          for (m = 5 * f; b < m; ) {
            var v = e[b++];
            h = e[b++];
            n = e[b++];
            q = h + e[b++];
            p = n + e[b++];
            var u = a.view,
              A = a.g,
              C = a.stride;
            u[A] = h;
            u[A + 1] = p;
            A += C;
            u[A] = q;
            u[A + 1] = n;
            A += C;
            u[A] = h;
            u[A + 1] = n;
            a.g = A + C;
            u = a.view;
            A = a.g;
            C = a.stride;
            u[A] = h;
            u[A + 1] = p;
            A += C;
            u[A] = q;
            u[A + 1] = p;
            A += C;
            u[A] = q;
            u[A + 1] = n;
            a.g = A + C;
            p = d[v].Nd;
            h = p.x;
            n = p.y;
            q = h + p.w;
            p = n + p.J;
            v = g.view;
            u = g.g;
            A = g.stride;
            v[u + 0 * A] = h;
            v[u + 0 * A + 1] = p;
            v[u + A] = q;
            v[u + A + 1] = n;
            v[u + 2 * A] = h;
            v[u + 2 * A + 1] = n;
            g.g = u + 3 * A;
            v = g.view;
            u = g.g;
            A = g.stride;
            v[u + 0 * A] = h;
            v[u + 0 * A + 1] = p;
            v[u + A] = q;
            v[u + A + 1] = p;
            v[u + 2 * A] = q;
            v[u + 2 * A + 1] = n;
            g.g = u + 3 * A;
          }
          this.drawArrays(6 * f, 4);
          c.clip && this.R.disable(2960);
        }
      }
    }
    Bc() {
      return 505;
    }
    ih() {
      return 401;
    }
    qg() {
      return "attribute vec4 a_position;\nattribute vec2 a_tcoord;\n\nvarying vec2 v_tcoord;\n\nuniform vec2 u_textureSize;\nuniform mat4 u_matrix;\n\nvoid main()\n{\n\tgl_Position = u_matrix * a_position;\n\tv_tcoord = vec2(a_tcoord.x, u_textureSize.y - a_tcoord.y) / u_textureSize;  \n}";
    }
    og() {
      return "precision mediump float;\n\nuniform sampler2D u_image;\nuniform bool u_transformColors;\nuniform vec4 u_colorMultiplier;\nuniform vec4 u_colorOffset;\nuniform float u_alpha;\n\nvarying vec2 v_tcoord;\n\nvoid main()\n{\n\tvec4 color = texture2D(u_image, v_tcoord);\n\tif (u_transformColors)\n\t{\n\t\tfloat a = color.a;\n\t\tfloat r = color.r / (a + 1e-6);\n\t\tfloat g = color.g / (a + 1e-6);\n\t\tfloat b = color.b / (a + 1e-6);\n\t\tr = r * u_colorMultiplier.r + u_colorOffset.r;\n\t\tg = g * u_colorMultiplier.g + u_colorOffset.g;\n\t\tb = b * u_colorMultiplier.b + u_colorOffset.b;\n\t\ta = a * u_colorMultiplier.a + u_colorOffset.a;\n\t\tcolor = vec4(r * a, g * a, b * a, a);\n\t}\n\tgl_FragColor = color * u_alpha;\n}";
    }
    Ig() {
      this.lf = this.Qe("a_position");
      this.pd.push(new ob(this.lf, "a_position", !1, -1, -1));
      this.Tk = this.Qe("a_tcoord");
      this.pd.push(new ob(this.Tk, "a_tcoord", !1, -1, -1));
      this.Yt = this.getUniformLocation("u_textureSize");
      this.ln = this.getUniformLocation("u_matrix");
      this.Wt = this.getUniformLocation("u_image");
      this.vz = this.getUniformLocation("u_transformColors");
      this.Qh = this.getUniformLocation("u_colorMultiplier");
      this.Rh = this.getUniformLocation("u_colorOffset");
      this.kf = this.getUniformLocation("u_alpha");
    }
  }
  Le.i = !0;
  Le.s = Sa;
  Object.assign(Le.prototype, { l: Le });
  class Pe extends Sa {
    constructor() {
      super();
      this.Ca = null;
    }
    ib(a) {
      super.ib(a);
      this.te(this.Id, 17);
      this.te(this.au, 18);
      this.Ca = this.jg(32, 2);
    }
    L(a) {
      this.use();
      let b = a.effect;
      a = a.V.co(a.va.Ea);
      this.cj(this.jj, a);
      this.R.uniform1f(this.lj, 0);
      a = b.Z;
      let c = 0,
        d = b.points.length;
      for (; c < d; ) {
        let e = c++;
        this.R.uniform1f(this.kf, b.on[e]);
        this.SM(b.points[e], b.Yh[e], a);
      }
    }
    SM(a, b, c) {
      a = this.An(a, c, !1);
      for (var d = 0, e = a.length; d < e; ) (a[d] += c / 2), (d += 2);
      this.Ca.resize(a.length);
      this.Ca.setData(this.Id, a);
      c = [];
      for (d = 0; d < b.length; )
        (e = b[d]),
          ++d,
          c.push(e.x),
          c.push(e.y),
          c.push(e.z),
          c.push(e.x),
          c.push(e.y),
          c.push(e.z),
          c.push(e.x),
          c.push(e.y),
          c.push(e.z),
          c.push(e.x),
          c.push(e.y),
          c.push(e.z),
          c.push(e.x),
          c.push(e.y),
          c.push(e.z),
          c.push(e.x),
          c.push(e.y),
          c.push(e.z);
      this.Ca.setData(this.au, c);
      this.drawArrays(a.length, 4);
    }
    Bc() {
      return 705;
    }
    An(a, b, c) {
      let d = new Nh().Hn(a, c),
        e = a.length;
      if (0 == e) return [];
      a = a.slice();
      c && (a.push(a[0]), d.push(d[0]), d.push(d[1]), d.push(d[2]), ++e);
      c = [];
      let f = 0,
        g = 1;
      for (; g < e; ) {
        var h = a[f],
          m = a[g],
          n = 3 * f,
          q = d[n++];
        let p = d[n++];
        n = Math.min(2, d[n++]);
        n *= b;
        let v = h.x + q * n,
          u = h.y + p * n,
          A = h.x - q * n;
        h = h.y - p * n;
        n = 3 * g;
        q = d[n++];
        p = d[n++];
        n = Math.min(2, d[n++]);
        n *= b;
        let C = m.x + q * n,
          B = m.y + p * n;
        q = m.x - q * n;
        m = m.y - p * n;
        c.push(C);
        c.push(B);
        c.push(A);
        c.push(h);
        c.push(v);
        c.push(u);
        c.push(C);
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
    qg() {
      return "attribute vec2 a_vertexPosition;\nattribute vec3 a_vertexColor;\n\nvarying vec3 v_vertexColor;\n\nuniform float u_zNDC;\nuniform mat4 u_camera;\n\nvoid main()\n{\n\tv_vertexColor = a_vertexColor;\n\tgl_Position = u_camera * vec4(a_vertexPosition, u_zNDC, 1.0);\n}";
    }
    og() {
      return "precision mediump float;\n\nvarying vec3 v_vertexColor;\n\nuniform float u_alpha;\n\nvoid main()\n{\n\tgl_FragColor = vec4(v_vertexColor * u_alpha, u_alpha);\n}";
    }
    Ig() {
      this.Id = this.Qe("a_vertexPosition");
      this.pd.push(new ob(this.Id, "a_vertexPosition", !1, -1, -1));
      this.au = this.Qe("a_vertexColor");
      this.pd.push(new ob(this.au, "a_vertexColor", !1, -1, -1));
      this.lj = this.getUniformLocation("u_zNDC");
      this.jj = this.getUniformLocation("u_camera");
      this.kf = this.getUniformLocation("u_alpha");
    }
  }
  Pe.i = !0;
  Pe.s = Sa;
  Object.assign(Pe.prototype, { l: Pe });
  class Nh {
    constructor() {
      this.$j = new F(0, 0, 0, 1);
      this.yE = new F(0, 0, 0, 1);
      this.zr = new F(0, 0, 0, 1);
      this.Rl = new F(0, 0, 0, 1);
    }
    Hn(a, b) {
      function c(v, u) {
        f.push(v.x);
        f.push(v.y);
        f.push(u);
      }
      function d(v, u, A, C, B) {
        v.x = A.x + C.x;
        v.y = A.y + C.y;
        C = Math.sqrt(v.x * v.x + v.y * v.y);
        0 < C ? ((v.x /= C), (v.y /= C)) : ((v.x = 0), (v.y = 0));
        C = v.x;
        u.x = -v.y;
        u.y = C;
        return B / (u.x * -A.y + u.y * A.x);
      }
      var e = null;
      let f = [];
      if (b) {
        a = a.slice();
        var g = a[0];
        a.push(new F(g.x, g.y, 0, 1));
      }
      g = a.length;
      for (var h = 1; h < g; ) {
        var m = h++,
          n = a[m - 1],
          q = a[m],
          p = m < a.length - 1 ? a[m + 1] : null;
        let v = q.x - n.x;
        n = q.y - n.y;
        let u = Math.sqrt(v * v + n * n);
        this.Rl = new F(v / u, n / u, 0, 1);
        null == e && ((e = this.Rl), (e = new F(-e.y, e.x, 0, 1)));
        1 == m && c(e, 1);
        null == p
          ? ((e = this.Rl), (e = new F(-e.y, e.x, 0, 1)), c(e, 1))
          : ((m = p.x - q.x),
            (q = p.y - q.y),
            (p = Math.sqrt(m * m + q * q)),
            (this.zr = new F(m / p, q / p, 0, 1)),
            (q = d(this.yE, this.$j, this.Rl, this.zr, 1)),
            c(this.$j, q));
      }
      b &&
        2 < a.length &&
        ((e = a[g - 2]),
        (b = a[0]),
        (a = a[1]),
        (h = b.x - e.x),
        (e = b.y - e.y),
        (q = Math.sqrt(h * h + e * e)),
        (this.Rl = new F(h / q, e / q, 0, 1)),
        (h = a.x - b.x),
        (a = a.y - b.y),
        (b = Math.sqrt(h * h + a * a)),
        (this.zr = new F(h / b, a / b, 0, 1)),
        (a = d(this.yE, this.$j, this.Rl, this.zr, 1)),
        (f[0] = this.$j.x),
        (f[1] = this.$j.y),
        (f[2] = a),
        (f[3 * g - 3] = this.$j.x),
        (f[3 * g - 2] = this.$j.y),
        (f[3 * g - 1] = a),
        f.pop(),
        f.pop(),
        f.pop());
      return f;
    }
  }
  Nh.i = !0;
  Object.assign(Nh.prototype, { l: Nh });
  class Me extends Sa {
    constructor() {
      super();
      this.Ca = null;
    }
    ib(a) {
      super.ib(a);
      this.te(this.lf, 17);
      this.Ca = this.jg(600, 2);
      this.Ca = this.jg(4, 2);
      this.Ca.setData(this.lf, [0, 1, 1, 1, 0, 0, 1, 0]);
    }
    L(a) {
      this.use();
      var b = a.va,
        c = a.effect.color;
      let d = c.w;
      this.R.uniform4f(this.vL, c.x * d, c.y * d, c.z * d, d);
      a = a.V;
      c = a.ni(b.Ea);
      this.cj(this.ln, c);
      this.R.uniform1f(this.kf, a.ll);
      c = b.size;
      this.R.uniform2f(this.Xt, c.x, c.y);
      this.R.uniform1f(this.lj, a.eB(b));
      b = 0 < (a.od & 4) ? a.$h : null;
      null != b
        ? ((a = b.$b),
          this.R.uniform4f(this.Qh, a.x, a.y, a.z, a.w),
          (b = b.offset),
          this.R.uniform4f(this.Rh, b.x, b.y, b.z, b.w))
        : (this.R.uniform4f(this.Qh, 1, 1, 1, 1),
          (b = new F(0, 0, 0, 0)),
          this.R.uniform4f(this.Rh, b.x, b.y, b.z, b.w));
      this.drawArrays(4, 5);
    }
    Bc() {
      return 1205;
    }
    ih() {
      return 401;
    }
    qg() {
      return "uniform mat4 u_matrix;\nuniform vec2 u_size;\nuniform float u_zNDC;\n\nattribute vec2 a_position;\n\nvoid main()\n{\n\tgl_Position = u_matrix * vec4(a_position * u_size, u_zNDC, 1.0);\n}";
    }
    og() {
      return "precision mediump float;\n\nuniform float u_alpha;\nuniform vec4 u_Color;\nuniform vec4 u_colorMultiplier;\nuniform vec4 u_colorOffset;\n\nvoid main()\n{\n\tvec4 color = u_Color;\n\tfloat alpha = color.a;\n\tcolor = vec4(color.rgb / alpha, alpha) * u_colorMultiplier + u_colorOffset;\n\tcolor = vec4(color.rgb * color.a, color.a);\n\tgl_FragColor = color * u_alpha;\n}";
    }
    Ig() {
      this.lf = this.Qe("a_position");
      this.pd.push(new ob(this.lf, "a_position", !1, -1, -1));
      this.ln = this.getUniformLocation("u_matrix");
      this.Xt = this.getUniformLocation("u_size");
      this.lj = this.getUniformLocation("u_zNDC");
      this.kf = this.getUniformLocation("u_alpha");
      this.vL = this.getUniformLocation("u_Color");
      this.Qh = this.getUniformLocation("u_colorMultiplier");
      this.Rh = this.getUniformLocation("u_colorOffset");
    }
  }
  Me.i = !0;
  Me.s = Sa;
  Object.assign(Me.prototype, { l: Me });
  class Ne extends Sa {
    constructor() {
      super();
      this.Jh = this.Ca = null;
    }
    ib(a) {
      super.ib(a);
      this.te(this.$t, 17);
      this.Ca = this.jg(4, 1);
      this.Jh = this.Ca.HA();
    }
    L(a) {
      this.use();
      var b = a.V,
        c = a.effect;
      if (!(b.ll < b.PO)) {
        this.R.uniform1f(this.lj, 0);
        var d = 0,
          e = 0,
          f = 1,
          g = 1,
          h = c.color,
          m = h.w;
        this.R.uniform4f(this.kj, h.x * m, h.y * m, h.z * m, m);
        this.R.uniform1f(this.kf, b.ll);
        null != c.cs &&
          ((g = a.V.Wb.size),
          (c = c.cs),
          (d = c.A / g.x),
          (e = c.D / g.y),
          (f = (c.B - c.A) / g.x),
          (g = (c.G - c.D) / g.y));
        e = 1 - g - e;
        ri.Hw(this.Jh);
        c = this.Jh[this.$t];
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
    qg() {
      return "precision mediump float;\n\nuniform float u_zNDC;\n\nattribute vec2 a_modelPosition;\n\nvoid main()\n{\n\tgl_Position.xy = 2.0 * a_modelPosition - 1.0;\n\tgl_Position.z = u_zNDC;\n\tgl_Position.w = 1.0;\n}";
    }
    og() {
      return "precision mediump float;\n\nuniform vec4 u_color;\nuniform float u_alpha;\n\nvoid main()\n{\n\tgl_FragColor = u_color * u_alpha;\n}";
    }
    Ig() {
      this.$t = this.Qe("a_modelPosition");
      this.pd.push(new ob(this.$t, "a_modelPosition", !1, -1, -1));
      this.lj = this.getUniformLocation("u_zNDC");
      this.kj = this.getUniformLocation("u_color");
      this.kf = this.getUniformLocation("u_alpha");
    }
  }
  Ne.i = !0;
  Ne.s = Sa;
  Object.assign(Ne.prototype, { l: Ne });
  class Oe extends Sa {
    constructor() {
      super();
      this.Ca = null;
      this.Ed = [];
    }
    ib(a) {
      super.ib(a);
      this.te(this.Id, 17);
      this.Ca = this.jg(32, 2);
    }
    L(a) {
      this.use();
      var b = a.effect;
      a = a.V.co(a.va.Ea);
      this.cj(this.jj, a);
      this.R.uniform4f(this.kj, 1, 1, 1, 1);
      a = 0;
      for (b = b.ft; a < b.length; ) {
        let c = b[a];
        ++a;
        this.Ca.resize(c.length);
        let d = 0,
          e = 0;
        for (; e < c.length; ) {
          let f = c[e];
          ++e;
          this.Ed[d++] = f.x;
          this.Ed[d++] = f.y;
        }
        this.Ca.setData(this.Id, this.Ed, d);
        this.drawArrays(c.length, 5);
      }
    }
    Bc() {
      return 1105;
    }
    qg() {
      return "attribute vec2 a_vertexPosition;\n\nuniform mat4 u_camera;\n\nvoid main()\n{\n\tgl_Position = u_camera * vec4(a_vertexPosition, 0.0, 1.0);\n}";
    }
    og() {
      return "precision mediump float;\n\nuniform vec4 u_color;\n\nvoid main()\n{\n\tgl_FragColor = vec4(u_color.rgb * u_color.a, u_color.a);\n}";
    }
    Ig() {
      this.Id = this.Qe("a_vertexPosition");
      this.pd.push(new ob(this.Id, "a_vertexPosition", !1, -1, -1));
      this.jj = this.getUniformLocation("u_camera");
      this.kj = this.getUniformLocation("u_color");
    }
  }
  Oe.i = !0;
  Oe.s = Sa;
  Object.assign(Oe.prototype, { l: Oe });
  class Qe extends Sa {
    constructor() {
      super();
      this.Ca = null;
      this.mb = [];
      this.nf = 0;
    }
    ib(a) {
      super.ib(a);
      this.te(this.Id, 17);
      this.Ca = this.jg(32, 1);
    }
    L(a) {
      this.use();
      var b = a.effect;
      a = a.V.co(a.va.Ea);
      this.cj(this.jj, a);
      a = b.color;
      this.R.uniform4f(this.kj, a.x, a.y, a.z, a.w);
      this.An(b);
      b = this.nf >> 1;
      this.Ca.resize(b);
      this.Ca.setData(this.Id, this.mb, this.nf);
      this.drawArrays(b, 4);
    }
    An(a) {
      this.nf = 0;
      let b = a.No,
        c = 2 * Math.PI,
        d = (c / b) * a.Z * 0.5,
        e = 0;
      for (; e < b; ) {
        var f = e++;
        if (1 == (f & 1)) continue;
        f = (f / b) * c;
        var g = a.C,
          h = a.Z,
          m = a.lineWidth / 2,
          n = Math.cos(f),
          q = Math.sin(f);
        f = g.x + n * h;
        g = g.y + q * h;
        h = -q * d;
        let p = n * d;
        n *= m;
        m *= q;
        q = f + h + n;
        let v = g + p + m,
          u = f - h - n,
          A = g - p - m,
          C = this.nf;
        this.mb[C++] = q;
        this.mb[C++] = v;
        this.mb[C++] = f - h + n;
        this.mb[C++] = g - p + m;
        this.mb[C++] = u;
        this.mb[C++] = A;
        this.mb[C++] = q;
        this.mb[C++] = v;
        this.mb[C++] = u;
        this.mb[C++] = A;
        this.mb[C++] = f + h - n;
        this.mb[C++] = g + p - m;
        this.nf = C;
      }
    }
    Bc() {
      return 605;
    }
    qg() {
      return "attribute vec2 a_vertexPosition;\n\nuniform mat4 u_camera;\n\nvoid main()\n{\n\tgl_Position = u_camera * vec4(a_vertexPosition, 0.0, 1.0);\n}";
    }
    og() {
      return "precision mediump float;\n\nuniform vec4 u_color;\n\nvoid main()\n{\n\tgl_FragColor = vec4(u_color.rgb * u_color.a, u_color.a);\n}";
    }
    Ig() {
      this.Id = this.Qe("a_vertexPosition");
      this.pd.push(new ob(this.Id, "a_vertexPosition", !1, -1, -1));
      this.jj = this.getUniformLocation("u_camera");
      this.kj = this.getUniformLocation("u_color");
    }
  }
  Qe.i = !0;
  Qe.s = Sa;
  Object.assign(Qe.prototype, { l: Qe });
  class Re extends Sa {
    constructor() {
      super();
      this.Ca = null;
      this.mb = [];
      this.nf = 0;
      this.vi = Array(256);
      this.Hi = Array(256);
    }
    ib(a) {
      super.ib(a);
      this.te(this.Id, 17);
      this.Ca = this.jg(32, 1);
    }
    L(a) {
      this.use();
      var b = a.effect;
      a = a.V.co(a.va.Ea);
      this.cj(this.jj, a);
      this.R.uniform4f(this.kj, b.color.x, b.color.y, b.color.z, b.yr);
      this.An(b);
      b = this.nf >> 1;
      this.Ca.resize(b);
      this.Ca.setData(this.Id, this.mb, this.nf);
      this.drawArrays(b, 4);
    }
    An(a) {
      this.nf = 0;
      var b = a.Z;
      let c = ((Xd / (2 * Math.acos(1 - 0.25 / b)) - 1) | 0) << 2;
      128 < c && (c = 128);
      var d = 2 * Math.PI;
      let e = 0,
        f = 0,
        g = c;
      for (; f < g; ) {
        var h = (f++ / c) * d;
        let m = Math.cos(h);
        h = Math.sin(h);
        this.Hi[e] = m * b;
        this.Hi[e + 1] = h * b;
        this.vi[e] = m * (b + a.lineWidth);
        this.vi[e + 1] = h * (b + a.lineWidth);
        e += 2;
      }
      a = 0;
      for (b = 1; a < c; )
        (d = this.nf),
          (this.mb[d++] = this.Hi[2 * a]),
          (this.mb[d++] = this.Hi[2 * a + 1]),
          (this.mb[d++] = this.Hi[2 * b]),
          (this.mb[d++] = this.Hi[2 * b + 1]),
          (this.mb[d++] = this.vi[2 * b]),
          (this.mb[d++] = this.vi[2 * b + 1]),
          (this.mb[d++] = this.Hi[2 * a]),
          (this.mb[d++] = this.Hi[2 * a + 1]),
          (this.mb[d++] = this.vi[2 * b]),
          (this.mb[d++] = this.vi[2 * b + 1]),
          (this.mb[d++] = this.vi[2 * a]),
          (this.mb[d++] = this.vi[2 * a + 1]),
          (this.nf = d),
          ++a,
          ++b,
          b == c && (b = 0);
    }
    Bc() {
      return 905;
    }
    qg() {
      return "attribute vec2 a_vertexPosition;\n\nuniform mat4 u_camera;\n\nvoid main()\n{\n\tgl_Position = u_camera * vec4(a_vertexPosition, 0.0, 1.0);\n}";
    }
    og() {
      return "precision mediump float;\n\nuniform vec4 u_color;\n\nvoid main()\n{\n\tgl_FragColor = vec4(u_color.rgb * u_color.a, u_color.a);\n}";
    }
    Ig() {
      this.Id = this.Qe("a_vertexPosition");
      this.pd.push(new ob(this.Id, "a_vertexPosition", !1, -1, -1));
      this.jj = this.getUniformLocation("u_camera");
      this.kj = this.getUniformLocation("u_color");
    }
  }
  Re.i = !0;
  Re.s = Sa;
  Object.assign(Re.prototype, { l: Re });
  class Xc extends Sa {
    constructor() {
      super();
      this.Ca = null;
    }
    ib(a) {
      super.ib(a);
      this.te(this.lf, 17);
      this.te(this.Tk, 17);
      this.Ca = this.jg(4, 2);
    }
    L(a) {
      this.use();
      var b = a.V,
        c = a.va,
        d = a.effect,
        e = d.Hb;
      if (e.Zq()) {
        var f = d.vp;
        a = f.x + d.offsetX * f.w;
        var g = f.y + d.offsetY * f.J,
          h = a + d.tm * f.w,
          m = g + d.$o * f.J;
        this.WE(this.Wt, e.handle);
        e = e.size;
        this.R.uniform2f(this.Yt, e.x, e.y);
        e = b.ni(c.Ea);
        this.cj(this.ln, e);
        this.R.uniform1f(this.kf, b.ll);
        e = c.size;
        this.R.uniform2f(this.Xt, e.x, e.y);
        this.R.uniform1f(this.lj, b.eB(c));
        b = 0 < (b.od & 4) ? b.$h : null;
        null != b
          ? ((c = b.$b),
            this.R.uniform4f(this.Qh, c.x, c.y, c.z, c.w),
            (b = b.offset),
            this.R.uniform4f(this.Rh, b.x, b.y, b.z, b.w))
          : (this.R.uniform4f(this.Qh, 1, 1, 1, 1),
            (b = new F(0, 0, 0, 0)),
            this.R.uniform4f(this.Rh, b.x, b.y, b.z, b.w));
        c = 0;
        b = d.offsetY;
        0 != d.offsetX && (c = 1);
        0 != b && (c |= 2);
        1 != d.tm && (c |= 4);
        1 != d.$o && (c |= 8);
        2 == c
          ? ((b %= 1),
            0 > b && ++b,
            (a = f.x + d.offsetX * f.w),
            (h = a + d.tm * f.w),
            (g = f.y + f.J * b),
            (m = f.y + f.J),
            (d = this.Ca.ej[4]),
            (d[0] = 0),
            (d[1] = 1 - b),
            (d[4] = 1),
            (d[5] = 1 - b),
            (d[8] = 0),
            (d[9] = 0),
            (d[12] = 1),
            (d[13] = 0),
            (d = this.Ca.ej[4]),
            (d[2] = a),
            (d[3] = m),
            (d[6] = h),
            (d[7] = m),
            (d[10] = a),
            (d[11] = g),
            (d[14] = h),
            (d[15] = g),
            (this.Ca.bh = !0),
            this.drawArrays(4, 5),
            (g = f.y),
            (m = f.J * b),
            (f = this.Ca.ej[4]),
            (f[0] = 0),
            (f[1] = 1),
            (f[4] = 1),
            (f[5] = 1),
            (f[8] = 0),
            (f[9] = 1 - b),
            (f[12] = 1),
            (f[13] = 1 - b),
            (this.Ca.bh = !0),
            (f = this.Ca.ej[4]),
            (f[2] = a),
            (f[3] = m),
            (f[6] = h),
            (f[7] = m),
            (f[10] = a),
            (f[11] = g),
            (f[14] = h),
            (f[15] = g))
          : (this.Ca.setData(this.lf, Xc.kL[0]),
            (f = this.Ca.ej[4]),
            (f[2] = a),
            (f[3] = m),
            (f[6] = h),
            (f[7] = m),
            (f[10] = a),
            (f[11] = g),
            (f[14] = h),
            (f[15] = g));
        this.Ca.bh = !0;
        this.drawArrays(4, 5);
      }
    }
    Bc() {
      return 205;
    }
    ih() {
      return 401;
    }
    qg() {
      return "attribute vec2 a_position;\nattribute vec2 a_tcoord;\n\nuniform mat4 u_matrix;\nuniform vec2 u_size;\nuniform vec2 u_textureSize;\nuniform float u_zNDC;\n\nvarying vec2 v_tcoord;\n\nvoid main()\n{\n\tgl_Position = u_matrix * vec4(a_position * u_size, u_zNDC, 1.0);\n\tv_tcoord = vec2(a_tcoord.x, u_textureSize.y - a_tcoord.y) / u_textureSize;  \n}";
    }
    og() {
      return "precision mediump float;\n\nuniform sampler2D u_image;\nuniform float u_alpha;\nuniform vec4 u_colorMultiplier;\nuniform vec4 u_colorOffset;\n\nvarying vec2 v_tcoord;\n\nvoid main()\n{\n\tvec4 color = texture2D(u_image, v_tcoord);\n\tfloat alpha = color.a;\n\tcolor = vec4(color.rgb / (alpha + 0.001), alpha) * u_colorMultiplier + u_colorOffset;\n\tcolor = vec4(color.rgb * color.a, color.a);\n\tgl_FragColor = color * u_alpha;\n}";
    }
    Ig() {
      this.lf = this.Qe("a_position");
      this.pd.push(new ob(this.lf, "a_position", !1, -1, -1));
      this.Tk = this.Qe("a_tcoord");
      this.pd.push(new ob(this.Tk, "a_tcoord", !1, -1, -1));
      this.ln = this.getUniformLocation("u_matrix");
      this.Xt = this.getUniformLocation("u_size");
      this.Yt = this.getUniformLocation("u_textureSize");
      this.lj = this.getUniformLocation("u_zNDC");
      this.Wt = this.getUniformLocation("u_image");
      this.kf = this.getUniformLocation("u_alpha");
      this.Qh = this.getUniformLocation("u_colorMultiplier");
      this.Rh = this.getUniformLocation("u_colorOffset");
    }
  }
  Xc.i = !0;
  Xc.s = Sa;
  Object.assign(Xc.prototype, { l: Xc });
  class gb {
    constructor(a) {
      this.type = a;
      this.ab = 0;
      this.Qr = null;
    }
    set() {}
    collapse() {
      return this;
    }
  }
  gb.i = !0;
  Object.assign(gb.prototype, { l: gb });
  class ke extends gb {
    constructor(a, b) {
      null == b && (b = !0);
      super(0);
      this.Xg = a;
      this.ab = (this.ab & -16) | a;
      this.IQ = b;
      this.ab &= -65537;
      b && (this.ab |= 65536);
      this.blendEquation = 1;
      this.ab = (this.ab & -61441) | 4096;
      this.qA = this.cE = 0;
    }
    set(a) {
      a.Nw(this);
    }
  }
  ke.i = !0;
  ke.s = gb;
  Object.assign(ke.prototype, { l: ke });
  class Bb {
    constructor() {
      this.type = this.ya();
      this.C = new F(0, 0, 0, 1);
      this.Z = 0;
    }
    F() {
      this.C = null;
    }
    In() {}
    from() {}
    ya() {
      return 102;
    }
  }
  Bb.i = !0;
  Bb.Ib = [td];
  Object.assign(Bb.prototype, { l: Bb });
  class Nc extends Bb {
    constructor() {
      super();
      this.gb = new Y(va, va, wa, wa);
    }
    F() {
      this.gb = null;
      super.F();
    }
    In(a) {
      var b = this.gb;
      b.A = b.D = va;
      b.B = b.G = wa;
      b = a.length >> 1;
      let c = 0;
      for (; c < b; ) {
        let d = c++;
        this.gb.eu(new F(a[d << 1], a[(d << 1) + 1], 0, 1));
      }
    }
    contains(a) {
      let b = this.gb,
        c = a.x;
      a = a.y;
      return c >= b.A && c <= b.B && a >= b.D ? a <= b.G : !1;
    }
    dr(a) {
      switch (a.type) {
        case 202:
          var b = a.C;
          a = a.Z;
          this.gb.eu(new F(b.x - a, b.y - a, 0, 1));
          this.gb.eu(new F(b.x + a, b.y + a, 0, 1));
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
      let b = a.C,
        c = a.Z;
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
    et(a, b) {
      var c = this.C,
        d = b.C;
      0 < (a.K & 64) && a.Mm();
      var e = a.Ue,
        f = e.m21 * c.x + e.m22 * c.y + e.m24;
      d.x = e.m11 * c.x + e.m12 * c.y + e.m14;
      d.y = f;
      b.Z =
        (0 < (a.K & 8)
          ? Math.max(Math.abs(a.scale.x), Math.abs(a.scale.y))
          : Math.max(
              Math.abs(a.matrix.m11) + Math.abs(a.matrix.m12),
              Math.abs(a.matrix.m21) + Math.abs(a.matrix.m22)
            )) * this.Z;
      b = b.gb;
      c = this.gb;
      d = c.B - c.A;
      c = this.gb;
      c = c.G - c.D;
      f = e = Nc.Ed;
      var g = this.gb,
        h = this.gb;
      f.x = (g.A + g.B) / 2;
      f.y = (h.D + h.G) / 2;
      a.Jb(e, e);
      b.A = e.x;
      b.D = e.y;
      b.B = e.x;
      b.G = e.y;
      0 < (a.K & 8)
        ? ((h = a.matrix),
          (e = h.m11),
          (f = h.m12),
          (g = h.m21),
          (h = h.m22),
          (a = a.scale),
          (d = d * a.x * 0.5),
          (a = c * a.y * 0.5),
          0 < e
            ? ((b.A -= e * d), (b.B += e * d))
            : ((b.A += e * d), (b.B -= e * d)),
          0 < f
            ? ((b.A -= f * a), (b.B += f * a))
            : ((b.A += f * a), (b.B -= f * a)),
          0 < g
            ? ((b.D -= g * d), (b.G += g * d))
            : ((b.D += g * d), (b.G -= g * d)),
          0 < h
            ? ((b.D -= h * a), (b.G += h * a))
            : ((b.D += h * a), (b.G -= h * a)))
        : ((g = a.matrix),
          (e = g.m11),
          (f = g.m12),
          (h = Math.sqrt(e * e + f * f)),
          (a = h * d * 0.5),
          (c = ((e * g.m22 - f * g.m21) / h) * c * 0.5),
          (e = Math.atan2(f, e)),
          (d = Math.cos(e)),
          (e = Math.sin(e)),
          0 < d
            ? ((b.A -= d * a), (b.B += d * a))
            : ((b.A += d * a), (b.B -= d * a)),
          0 < e
            ? ((b.A -= e * c), (b.B += e * c))
            : ((b.A += e * c), (b.B -= e * c)),
          0 < -e
            ? ((b.D -= -e * a), (b.G += -e * a))
            : ((b.D += -e * a), (b.G -= -e * a)),
          0 < d
            ? ((b.D -= d * c), (b.G += d * c))
            : ((b.D += d * c), (b.G -= d * c)));
    }
    ya() {
      return 302;
    }
  }
  Nc.i = !0;
  Nc.s = Bb;
  Object.assign(Nc.prototype, { l: Nc });
  class tg extends Bb {
    constructor() {
      super();
      this.box = new Oh(va, va, wa, wa);
    }
    F() {
      this.box = null;
      super.F();
    }
    In(a) {
      var b = this.box;
      b.A = b.D = va;
      b.B = b.G = wa;
      a = a.length >> 1;
      for (b = 0; b < a; ) ++b;
    }
    contains() {
      return !1;
    }
    dr() {}
    from() {}
    et(a, b) {
      var c = this.C,
        d = b.C;
      0 < (a.K & 16) && a.ht();
      var e = a.Ue;
      let f = c.x,
        g = c.y;
      c = c.z;
      d.x = e.m11 * f + e.m12 * g + e.m13 * c + e.m14;
      d.y = e.m21 * f + e.m22 * g + e.m23 * c + e.m24;
      d.z = e.m31 * f + e.m32 * g + e.m33 * c + e.m34;
      0 < (a.K & 8)
        ? ((d = Math.abs(a.scale.x)),
          (e = Math.abs(a.scale.y)),
          (a = Math.abs(a.scale.z)))
        : ((a = a.matrix),
          (d = Math.abs(a.m11) + Math.abs(a.m12) + Math.abs(a.m13)),
          (e = Math.abs(a.m21) + Math.abs(a.m22) + Math.abs(a.m23)),
          (a = Math.abs(a.m31) + Math.abs(a.m32) + Math.abs(a.m33)));
      b.Z = Math.max(Math.max(d, e), a) * this.Z;
    }
    ya() {
      return 402;
    }
  }
  tg.i = !0;
  tg.s = Bb;
  Object.assign(tg.prototype, { l: tg });
  class se extends Bb {
    constructor() {
      super();
    }
    In(a) {
      let b = a.length >> 1;
      for (var c = 0, d = 0, e = 0; e < b; ) {
        var f = e++;
        c += a[f << 1];
        d += a[(f << 1) + 1];
      }
      c = this.C.x = c / b;
      d = this.C.y = d / b;
      for (e = this.Z = 0; e < b; ) {
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
    dr(a) {
      if (0 != a.Z)
        if (0 == this.Z) (this.Z = a.Z), (this.C.x = a.C.x), (this.C.y = a.C.y);
        else {
          var b = a.C.x - this.C.x,
            c = a.C.y - this.C.y,
            d = a.Z - this.Z,
            e = b * b + c * c;
          d * d >= e
            ? 0 <= d && this.from(a)
            : ((d = Math.sqrt(e)),
              (e = (d + a.Z - this.Z) / (2 * d)),
              (this.C.x += e * b),
              (this.C.y += e * c),
              (this.Z = (d + this.Z + a.Z) / 2));
        }
    }
    from(a) {
      this.C.x = a.C.x;
      this.C.y = a.C.y;
      this.Z = a.Z;
    }
    et(a, b) {
      var c = this.C,
        d = b.C;
      0 < (a.K & 64) && a.Mm();
      let e = a.Ue,
        f = e.m21 * c.x + e.m22 * c.y + e.m24;
      d.x = e.m11 * c.x + e.m12 * c.y + e.m14;
      d.y = f;
      0 < (a.K & 8)
        ? ((c = Math.abs(a.scale.x)),
          (d = Math.abs(a.scale.y)),
          (a = Math.abs(a.scale.z)))
        : ((a = a.matrix),
          (c = Math.abs(a.m11) + Math.abs(a.m12) + Math.abs(a.m13)),
          (d = Math.abs(a.m21) + Math.abs(a.m22) + Math.abs(a.m23)),
          (a = Math.abs(a.m31) + Math.abs(a.m32) + Math.abs(a.m33)));
      b.Z = Math.max(Math.max(c, d), a) * this.Z;
    }
    ya() {
      return 202;
    }
  }
  se.i = !0;
  se.s = Bb;
  Object.assign(se.prototype, { l: se });
  class te extends Bb {
    constructor() {
      super();
    }
    In(a) {
      let b = 0,
        c = 0,
        d = 0,
        e = a.length;
      for (var f = 0; f < e; ) (b += a[f++]), (c += a[f++]), (d += a[f++]);
      f = (e / 3) | 0;
      b /= f;
      c /= f;
      d /= f;
      let g = 0;
      for (f = 0; f < e; ) {
        var h = a[f++] - b;
        let m = a[f++] - c,
          n = a[f++] - d;
        h = h * h + m * m + n * n;
        h > g && (g = h);
      }
      this.Z = Math.sqrt(g);
      a = this.C;
      a.x = b;
      a.y = c;
      a.z = d;
    }
    contains(a) {
      let b = a.x - this.C.x,
        c = a.y - this.C.y;
      a = a.z - this.C.z;
      return b * b + c * c + a * a <= this.Z * this.Z;
    }
    dr(a) {
      var b = a.Z;
      if (0 != b) {
        var c = this.Z;
        if (0 == c)
          (this.Z = a.Z),
            (b = this.C),
            (c = a.C),
            (b.x = c.x),
            (b.y = c.y),
            (b.z = c.z);
        else {
          var d = this.C,
            e = a.C,
            f = e.x - d.x,
            g = e.y - d.y;
          e = e.z - d.z;
          var h = f * f + g * g + e * e,
            m = b - c;
          m * m >= h
            ? 0 <= m &&
              ((this.Z = a.Z),
              (b = this.C),
              (c = a.C),
              (b.x = c.x),
              (b.y = c.y),
              (b.z = c.z))
            : ((a = Math.sqrt(h)),
              0 < a &&
                ((m = (a + m) / (2 * a)),
                (h = this.C),
                (h.x = d.x + f * m),
                (h.y = d.y + g * m),
                (h.z = d.z + e * m)),
              (this.Z = (a + c + b) / 2));
        }
      }
    }
    from(a) {
      this.C.x = a.C.x;
      this.C.y = a.C.y;
      this.Z = a.Z;
    }
    et(a, b) {
      b.C = a.ML(this.C, b.C);
      b.Z = a.GN() * this.Z;
    }
    ya() {
      return 502;
    }
  }
  te.i = !0;
  te.s = Bb;
  Object.assign(te.prototype, { l: te });
  class ug {
    constructor() {
      this.Pm = new fb(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.bD = new fb(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.lk = new fb(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    hT() {
      let a = this.bD,
        b = this.Pm;
      this.lk = new fb(
        a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * b.m31 + a.m14 * b.m41,
        a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * b.m32 + a.m14 * b.m42,
        a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * b.m33 + a.m14 * b.m43,
        a.m11 * b.m14 + a.m12 * b.m24 + a.m13 * b.m34 + a.m14 * b.m44,
        a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * b.m31 + a.m24 * b.m41,
        a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * b.m32 + a.m24 * b.m42,
        a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * b.m33 + a.m24 * b.m43,
        a.m21 * b.m14 + a.m22 * b.m24 + a.m23 * b.m34 + a.m24 * b.m44,
        a.m31 * b.m11 + a.m32 * b.m21 + a.m33 * b.m31 + a.m34 * b.m41,
        a.m31 * b.m12 + a.m32 * b.m22 + a.m33 * b.m32 + a.m34 * b.m42,
        a.m31 * b.m13 + a.m32 * b.m23 + a.m33 * b.m33 + a.m34 * b.m43,
        a.m31 * b.m14 + a.m32 * b.m24 + a.m33 * b.m34 + a.m34 * b.m44,
        a.m41 * b.m11 + a.m42 * b.m21 + a.m43 * b.m31 + a.m44 * b.m41,
        a.m41 * b.m12 + a.m42 * b.m22 + a.m43 * b.m32 + a.m44 * b.m42,
        a.m41 * b.m13 + a.m42 * b.m23 + a.m43 * b.m33 + a.m44 * b.m43,
        a.m41 * b.m14 + a.m42 * b.m24 + a.m43 * b.m34 + a.m44 * b.m44
      );
    }
    jF(a, b) {
      var c = this.lk;
      let d = a.x,
        e = a.y,
        f = a.z,
        g = a.w,
        h = 1 / (c.m41 * d + c.m42 * e + c.m43 * f + c.m44 * g);
      a = b.w / 2;
      let m = b.J / 2,
        n = (c.m11 * d + c.m12 * e + c.m13 * f + c.m14 * g) * h;
      c = (c.m21 * d + c.m22 * e + c.m23 * f + c.m24 * g) * h;
      return new F(a * n + 0 * c + (a + b.x), 0 * n + -m * c + (m + b.y), 0, 1);
    }
  }
  ug.i = !0;
  Object.assign(ug.prototype, { l: ug });
  class Rd extends ug {
    constructor() {
      super();
      this.origin = new F(0, 0, 0, 1);
      this.position = new F(0, 0, 0, 1);
      this.rotation = 0;
      this.zoom = 1;
      this.FB = new fb(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.EB = new fb(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.Bv = new fb(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.size = new F(0, 0, 0, 1);
      this.Lb(new F(1e3, 1e3, 0, 1));
    }
    hS(a) {
      this.zoom != a && ((this.zoom = a), this.Lr());
    }
    Dn() {
      let a = this.origin,
        b = this.size;
      a.x = b.x / 2;
      a.y = b.y / 2;
      this.Lr();
    }
    Lb(a) {
      let b = a.x,
        c = a.y;
      var d = this.size;
      d.x = a.x;
      d.y = a.y;
      d = this.bD;
      d.m11 = 2 / b;
      d.m12 = 0;
      d.m13 = 0;
      d.m14 = -1;
      d.m21 = 0;
      d.m22 = (2 / c) * -1;
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
      let e = this.EB;
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
      e.m33 = -1e3;
      e.m34 = 0;
      e.m41 = 0;
      e.m42 = 0;
      e.m43 = 0;
      e.m44 = 1;
      this.Lr();
    }
    Lr() {
      var a = this.Pm;
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
      a = this.Pm;
      var b = this.position,
        c = b.x;
      b = b.y;
      a.m14 += -c;
      a.m24 += -b;
      var d = this.zoom,
        e = this.zoom;
      a.m11 *= d;
      a.m12 *= d;
      a.m14 *= d;
      a.m21 *= e;
      a.m22 *= e;
      a.m24 *= e;
      e = this.rotation * La;
      d = Math.sin(e);
      e = Math.cos(e);
      var f = a.m11,
        g = a.m21;
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
      c = this.Pm;
      c.m11 = a.m11;
      c.m12 = a.m12;
      c.m14 = a.m14;
      c.m21 = a.m21;
      c.m22 = a.m22;
      c.m24 = a.m24;
      this.hT();
      a = this.FB;
      var h = this.Pm;
      c = h.m11;
      b = h.m12;
      d = h.m13;
      e = h.m14;
      f = h.m21;
      g = h.m22;
      var m = h.m23,
        n = h.m24,
        q = h.m31,
        p = h.m32,
        v = h.m33,
        u = h.m34,
        A = h.m41,
        C = h.m42,
        B = h.m43;
      h = h.m44;
      var K = c * g - b * f;
      let E = c * m - d * f,
        aa = c * n - e * f,
        Z = b * m - d * g,
        V = b * n - e * g,
        ea = d * n - e * m,
        xa = q * C - p * A,
        pa = q * B - v * A,
        fa = q * h - u * A,
        sa = p * B - v * C,
        Ga = p * h - u * C,
        qa = v * h - u * B,
        ia = 1 / (K * qa - E * Ga + aa * sa + Z * fa - V * pa + ea * xa);
      a.m11 = (g * qa - m * Ga + n * sa) * ia;
      a.m12 = (-b * qa + d * Ga - e * sa) * ia;
      a.m13 = (C * ea - B * V + h * Z) * ia;
      a.m14 = (-p * ea + v * V - u * Z) * ia;
      a.m21 = (-f * qa + m * fa - n * pa) * ia;
      a.m22 = (c * qa - d * fa + e * pa) * ia;
      a.m23 = (-A * ea + B * aa - h * E) * ia;
      a.m24 = (q * ea - v * aa + u * E) * ia;
      a.m31 = (f * Ga - g * fa + n * xa) * ia;
      a.m32 = (-c * Ga + b * fa - e * xa) * ia;
      a.m33 = (A * V - C * aa + h * K) * ia;
      a.m34 = (-q * V + p * aa - u * K) * ia;
      a.m41 = (-f * sa + g * pa - m * xa) * ia;
      a.m42 = (c * sa - b * pa + d * xa) * ia;
      a.m43 = (-A * Z + C * E - B * K) * ia;
      a.m44 = (q * Z - p * E + v * K) * ia;
      a = this.Bv;
      c = this.FB;
      b = this.EB;
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
      C = c.m41 * b.m11 + c.m42 * b.m21 + c.m43 * b.m31 + c.m44 * b.m41;
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
      a.m41 = C;
      a.m42 = B;
      a.m43 = h;
      a.m44 = K;
    }
  }
  Rd.i = !0;
  Rd.s = ug;
  Object.assign(Rd.prototype, { l: Rd });
  class kc {
    constructor() {
      this.hint = 0;
      this.offset = new F(0, 0, 0, 0);
      this.$b = new F(1, 1, 1, 1);
    }
    set(a) {
      var b = this.$b,
        c = a.$b;
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
    Ow(a) {
      0 <= a
        ? ((this.$b.x = 1 - a),
          (this.$b.y = 1 - a),
          (this.$b.z = 1 - a),
          (this.offset.x = a),
          (this.offset.y = a),
          (this.offset.z = a))
        : ((this.$b.x = a + 1),
          (this.$b.y = a + 1),
          (this.$b.z = a + 1),
          (this.offset.x = 0),
          (this.offset.y = 0),
          (this.offset.z = 0));
      this.$b.w = 1;
      this.offset.w = 0;
      this.hint = 2;
      return this;
    }
    concat(a) {
      if (1 == this.hint && 1 == a.hint) return (this.$b.w *= a.$b.w), this;
      let b = this.offset,
        c = this.$b,
        d = a.$b;
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
  kc.i = !0;
  Object.assign(kc.prototype, { l: kc });
  class qc extends gb {
    constructor(a) {
      super(2);
      this.transform = new kc();
      null != a && this.transform.set(a);
      this.collapsed = null;
      this.ab = qc.next++;
    }
    set(a) {
      a.Qw(this);
    }
    collapse(a) {
      if (1 == a.Fa) return this;
      null == this.collapsed && (this.collapsed = new qc());
      let b = this.collapsed.transform;
      b.set(a.top().transform);
      let c = a.Fa - 2;
      for (; -1 < c; ) b.concat(a.N[c--].transform);
      return this.collapsed;
    }
  }
  qc.i = !0;
  qc.s = gb;
  Object.assign(qc.prototype, { l: qc });
  class si {
    constructor() {
      this.Ab = null;
      this.Qx = new vb(1024);
      this.Qx.wm = !0;
      this.stack = new mc();
      this.Ed = new vb();
    }
    uk(a) {
      this.Ab = a;
    }
  }
  si.i = !0;
  Object.assign(si.prototype, { l: si });
  class Zf extends gb {
    constructor(a, b) {
      null == b && (b = 1);
      super(4);
      this.sz = b;
      this.kn = a;
      this.gx(a);
      this.jS(b);
    }
    gx(a) {
      this.ab &= -257;
      a && (this.ab |= 256);
      this.kn = a;
    }
    jS(a) {
      this.ab = (this.ab & -256) | (1 << a);
      this.sz = a;
    }
    set(a) {
      a.HD(this);
    }
  }
  Zf.i = !0;
  Zf.s = gb;
  Object.assign(Zf.prototype, { l: Zf });
  class Yf extends gb {
    constructor(a, b) {
      null == b && (b = !0);
      super(3);
      this.kn = a;
      this.qL = b;
      this.gx(a);
      this.iS(b);
    }
    iS(a) {
      this.ab = (this.ab &= -3) | (a ? 2 : 0);
    }
    gx(a) {
      this.ab = (this.ab &= -2) | (a ? 1 : 0);
      this.kn = a;
    }
    set(a) {
      a.ID(this);
    }
  }
  Yf.i = !0;
  Yf.s = gb;
  Object.assign(Yf.prototype, { l: Yf });
  class Sb {
    static cM() {
      let a = 0;
      for (; 7 > a; ) Sb.Qs[a++].Fa = 0;
    }
    static UQ(a) {
      null == Sb.Qs && Sb.lO();
      let b = Sb.Qs,
        c = Sb.ED;
      var d = a;
      for (c.clear(); null != d.parent; ) {
        var e = d.parent;
        c.Fa == c.bb && c.grow();
        c.N[c.Fa++] = e;
        d = d.parent;
      }
      d = 0;
      for (e = c.Fa; d < e; ) ++d, c.N[--c.Fa].WQ(b);
      for (a = a.Pd; null != a; )
        (d = b[a.state.type]),
          (e = a.state),
          d.Fa == d.bb && d.grow(),
          (d.N[d.Fa++] = e),
          (a = a.next);
      c.clear(!0);
      return b;
    }
    static lO() {
      Sb.Qs = Array(7);
      let a = 0;
      for (; 7 > a; ) Sb.Qs[a++] = new mc();
      Sb.ED = new mc(16);
    }
  }
  Sb.i = !0;
  class vg {
    constructor(a) {
      this.state = a;
    }
  }
  vg.i = !0;
  Object.assign(vg.prototype, { l: vg });
  class Oa extends ld {
    constructor(a, b) {
      super();
      this.type = this.ya();
      this.flags = 32 | b | Oa.AM;
      this.Y = this.parent = this.name = null;
      this.Db = new wg();
      this.Ea = new wg();
      this.Ne = 0;
      this.sa = this.Gu(a);
      this.key = pf.next();
      this.Pd = this.Vg = null;
      Oa.count++;
    }
    F() {
      if (!(0 < (this.flags & 16))) {
        super.F();
        null != this.parent && this.parent.removeChild(this);
        this.sa = this.Ea = this.Db = null;
        for (var a = this.Pd; null != a; ) (a.state.Qr = null), (a = a.next);
        this.dR();
        this.flags = 16;
        Oa.count--;
      }
    }
    bB() {
      let a = this;
      for (; null != a.parent; ) a = a.parent;
      return a;
    }
    Fd(a, b) {
      null == b && (b = !0);
      null == a && (a = !0);
      this.Lx(b);
      b && (this.pe(), a && this.cD());
    }
    Lx() {
      0 < (this.flags & 64) ||
        (0 < (this.flags & 512)
          ? null != this.parent
            ? this.Ea.VD(this.parent.Ea, this.Db)
            : this.Ea.Mw(this.Db)
          : null != this.parent
          ? this.Ea.UD(this.parent.Ea, this.Db)
          : this.Ea.set(this.Db));
    }
    pe() {}
    cD() {
      null != this.parent && (this.parent.pe(), this.parent.cD());
    }
    Nm(a) {
      var b = null == a;
      if (b) a = Sb.UQ(this);
      else {
        let c = this.Pd;
        for (; null != c; ) {
          let d = a[c.state.type],
            e = c.state;
          d.Fa == d.bb && d.grow();
          d.N[d.Fa++] = e;
          c = c.next;
        }
      }
      this.dD(a);
      if (b) Sb.cM();
      else for (b = this.Pd; null != b; ) --a[b.state.type].Fa, (b = b.next);
      this.flags &= -33;
    }
    ki(a) {
      let b = this.Pd;
      for (; null != b; ) {
        if (b.state.type == a) return b.state;
        b = b.next;
      }
      return null;
    }
    zh(a) {
      a.Qr = this;
      this.flags |= 32;
      if (null == this.Pd) this.Pd = new vg(a);
      else {
        for (var b = this.Pd; null != b; ) {
          if (b.state.type == a.type) {
            b.state = a;
            return;
          }
          b = b.next;
        }
        b = new vg(a);
        b.next = this.Pd;
        this.Pd = b;
      }
    }
    ks(a) {
      let b = this.Pd,
        c = null;
      for (; null != b; ) {
        if (b.state.type == a) {
          null != c ? (c.next = b.next) : (this.Pd = b.next);
          b.next = null;
          this.flags |= 32;
          break;
        }
        c = b;
        b = b.next;
      }
    }
    dR() {
      let a = this.Pd,
        b;
      null != a && (this.flags |= 32);
      for (; null != a; ) (b = a.next), (a.next = null), (a = b);
      this.Pd = null;
    }
    WQ(a) {
      let b = this.Pd;
      for (; null != b; ) {
        let c = a[b.state.type],
          d = b.state;
        c.Fa == c.bb && c.grow();
        c.N[c.Fa++] = d;
        b = b.next;
      }
    }
    Gu(a) {
      null == a && (a = Oa.zM);
      if (null == a) throw 10;
      switch (a) {
        case 202:
          return new se();
        case 302:
          return new Nc();
        default:
          throw 11;
      }
    }
    ya() {
      return 101;
    }
  }
  Oa.i = !0;
  Oa.Ib = [td, Wg];
  Oa.s = ld;
  Object.assign(Oa.prototype, { l: Oa });
  class Va extends Oa {
    constructor(a, b) {
      super(b, 2);
      this.ea = this.Gu(b);
      this.Gk = Array(7);
      null != a && a.P(this);
      this.ar = 0;
      this.effect = this.Qo = null;
      Va.count++;
    }
    F() {
      0 < (this.flags & 16) ||
        (null != this.effect && this.effect.F(),
        (this.effect = null),
        this.ea.F(),
        (this.Gk = this.ea = null),
        super.F(),
        Va.count--);
    }
    Qf(a) {
      this.effect = a;
      this.effect.Bh(this);
    }
    Qc() {}
    Ub(a, b) {
      if (!this.sa.contains(a)) return !1;
      null != b && b.add(this);
      return !0;
    }
    Al(a, b) {
      return b;
    }
    pe() {
      0 < (this.flags & 128) || (this.ea.et(this.Ea, this.sa), super.pe());
    }
    dD(a) {
      let b = 0;
      let c = this.Gk,
        d = 0,
        e = 0;
      for (; e < a.length; ) {
        var f = a[e];
        ++e;
        0 == f.Fa
          ? (c[d] = null)
          : ((f = f.N[f.Fa - 1].collapse(f)), (c[d] = f), (b |= 1 << f.type));
        ++d;
      }
      this.ar = b;
    }
    ya() {
      return 201;
    }
  }
  Va.i = !0;
  Va.s = Oa;
  Object.assign(Va.prototype, { l: Va });
  class xg extends Va {
    constructor(a, b, c, d) {
      super(c, d);
      this.size = new F(1, 1, 0, 1);
      this.min = new F(0, 0, 0, 1);
      this.max = new F(1, 1, 0, 1);
      this.cols = a;
      this.rows = b;
      this.wP();
      this.Qc();
    }
    wP() {
      this.hw = (this.cols + 1) * (this.rows + 1);
      this.dj = new vb(this.hw);
      for (var a = 0, b = this.hw; a < b; ) ++a, this.dj.tw(new F(0, 0, 0, 1));
      a = this.cols + 1;
      b = this.rows + 1;
      let c = 0,
        d;
      for (; c < b; ) {
        for (d = 0; d < a; ) {
          var e = this.dj.N[c * a + d];
          e.x = this.min.x + (d / (a - 1)) * this.max.x;
          e.y = this.min.y + (c / (b - 1)) * this.max.y;
          ++d;
        }
        ++c;
      }
      this.PP = (2 * this.cols + 2) * this.rows + 2 * (this.rows - 1);
      this.indices = new Uint8Array(this.PP);
      --b;
      for (c = e = 0; c < b; ) {
        for (d = 0; d < a; )
          (this.indices[e++] = c * a + d),
            (this.indices[e++] = c * a + a + d),
            ++d;
        c < b - 1 &&
          ((this.indices[e++] = (c + 1) * a + (a - 1)),
          (this.indices[e++] = (c + 1) * a));
        ++c;
      }
    }
    Qc() {
      super.Qc();
    }
    ya() {
      return 601;
    }
  }
  xg.i = !0;
  xg.s = Va;
  Object.assign(xg.prototype, { l: xg });
  class Lc extends gb {
    constructor() {
      super(1);
      this.va = null;
      this.wO = !1;
      this.Au = null;
      this.ab = Lc.next++;
    }
    set(a) {
      a.Zw(this);
    }
    XR(a) {
      let b = a.A,
        c = a.D,
        d = a.B - a.A;
      a = a.G - a.D;
      this.Au = [
        new F(b, c, 0, 1),
        new F(b, c + a, 0, 1),
        new F(b + d, c + a, 0, 1),
        new F(b + d, c, 0, 1),
      ];
    }
  }
  Lc.i = !0;
  Lc.s = gb;
  Object.assign(Lc.prototype, { l: Lc });
  class yg extends Va {
    constructor(a, b) {
      super(a, 402);
      this.$u = b;
      this.Qc();
      this.vB = this.bF = null;
    }
    F() {
      this.$u = null;
      var a = this.bF;
      null != a && a.F();
      a = this.vB;
      null != a && a.F();
      this.vB = this.bF = null;
      super.F();
    }
    Gu() {
      return new te();
    }
    Ub() {
      return !1;
    }
    Qc() {
      let a = this.$u.getData(0);
      this.ea.In(a);
    }
    ya() {
      return 501;
    }
  }
  yg.i = !0;
  yg.s = Va;
  Object.assign(yg.prototype, { l: yg });
  class qb extends Oa {
    constructor(a, b, c) {
      null == c && (c = 0);
      super(b, 1 | c);
      this.children = null;
      null != a && a.P(this);
      qb.count++;
    }
    F() {
      if (!(0 < (this.flags & 16))) {
        for (var a = this.children; null != a; ) {
          let b = a.Y;
          null != a.Vg ? a.Vg.F() : a.F();
          a = b;
        }
        super.F();
        qb.count--;
      }
    }
    Al(a, b) {
      return Ja.Al(this, a, b);
    }
    Ub(a, b) {
      let c = !1;
      if (this.sa.contains(a)) {
        let d = this.children;
        for (; null != d; ) d.Ub(a, b) && (c = !0), (d = d.Y);
      }
      return c;
    }
    Hh(a) {
      let b = super.Hh(a),
        c = this.children,
        d;
      for (; null != c; ) (d = c.Y), c.Hh(a) && (b = !0), (c = d);
      return b;
    }
    P(a) {
      if (null == this.children) (this.children = a), (a.Y = null);
      else {
        let b = this.children;
        for (; null != b.Y; ) b = b.Y;
        b.Y = a;
      }
      a.parent = this;
    }
    Jj() {
      let a = 0,
        b = this.children;
      for (; null != b; ) ++a, (b = b.Y);
      return a;
    }
    EL(a, b) {
      if (0 == b) (a.Y = this.children), (this.children = a);
      else {
        let c = this.children,
          d = 0;
        for (--b; d < b; ) ++d, (c = c.Y);
        a.Y = c.Y;
        c.Y = a;
      }
      a.parent = this;
    }
    removeChild(a) {
      if (this.children == a) this.children = a.Y;
      else {
        let b = this.children;
        for (; b.Y != a; ) b = b.Y;
        b.Y = a.Y;
      }
      a.Y = null;
      a.parent = null;
      return this;
    }
    nb(a) {
      let b = this.children,
        c = 0;
      for (; c <= a; ) {
        if (c == a) return b;
        b = b.Y;
        ++c;
      }
      return null;
    }
    Pw(a, b) {
      this.removeChild(a);
      this.EL(a, b);
    }
    Zn(a) {
      let b = this.children;
      for (; null != b; ) {
        if (b.name == a) return b;
        b = b.Y;
      }
      return null;
    }
    DS(a, b) {
      let c = null,
        d = null;
      for (var e = 0, f = this.children; 2 > e && null != f; )
        f.Y == a ? ((c = f), ++e) : f.Y == b && ((d = f), ++e), (f = f.Y);
      e = a.Y;
      f = b.Y;
      a.Y = null;
      b.Y = null;
      e == b
        ? (null != c ? (c.Y = b) : (this.children = b), (b.Y = a), (a.Y = f))
        : f == a
        ? (null != d ? (d.Y = a) : (this.children = a), (a.Y = b), (b.Y = e))
        : (null != c ? (c.Y = b) : (this.children = b),
          (b.Y = e),
          null != d ? (d.Y = a) : (this.children = a),
          (a.Y = f));
    }
    ES(a, b) {
      this.DS(this.nb(a), this.nb(b));
    }
    Rw(a) {
      if (this.children != a) {
        for (var b = this.children; b.Y != a; ) b = b.Y;
        b.Y = a.Y;
        a.Y = this.children;
        this.children = a;
      }
    }
    Vw(a) {
      if (null != a.Y) {
        var b = this.children;
        if (b == a) {
          for (; null != b.Y; ) b = b.Y;
          b.Y = a;
          this.children = a.Y;
        } else {
          for (; b.Y != a; ) b = b.Y;
          for (b = b.Y = a.Y; null != b.Y; ) b = b.Y;
          b.Y = a;
        }
        a.Y = null;
      }
    }
    Lx(a) {
      super.Lx(a);
      let b = this.children;
      for (; null != b; ) b.Fd(!1, a), (b = b.Y);
    }
    pe() {
      if (!(0 < (this.flags & 128)) && null != this.children) {
        var a = this.children;
        this.sa.from(a.sa);
        for (a = a.Y; null != a; ) this.sa.dr(a.sa), (a = a.Y);
        super.pe();
      }
    }
    dD(a) {
      let b = this.children;
      for (; null != b; ) b.Nm(a), (b = b.Y);
    }
    ya() {
      return 301;
    }
  }
  qb.i = !0;
  qb.s = Oa;
  Object.assign(qb.prototype, { l: qb });
  class fc extends gb {
    constructor(a) {
      super(5);
      this.Sk = 1;
      this.collapsed = null;
      this.bf(a);
    }
    bf(a) {
      this.Sk = 0 > a ? 0 : 1 < a ? 1 : a;
      this.ab = (65535 * this.Sk) | 0;
    }
    set(a) {
      a.ax(this);
    }
    collapse(a) {
      if (1 == a.Fa) return this;
      let b = a.top().Sk,
        c = a.Fa - 2;
      for (; -1 < c; ) b *= a.N[c--].Sk;
      null == this.collapsed
        ? (this.collapsed = new fc(b))
        : this.collapsed.bf(b);
      return this.collapsed;
    }
  }
  fc.i = !0;
  fc.s = gb;
  Object.assign(fc.prototype, { l: fc });
  class bh {
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
  bh.i = !0;
  Object.assign(bh.prototype, { l: bh });
  class Oc extends Va {
    constructor(a) {
      super(a, 302);
      this.flags |= 512;
      this.size = new F(1, 1, 0, 1);
      this.Qc();
    }
    Lb(a, b) {
      let c = this.size;
      c.x = a;
      c.y = b;
      this.Qc();
    }
    Ub(a, b) {
      if (!this.sa.contains(a)) return !1;
      a = this.Ea.eg(a, new F(0, 0, 0, 1));
      return $i.IS(a.x, a.y, this.size.x, this.size.y)
        ? (null != b && b.add(this), !0)
        : !1;
    }
    Al(a, b) {
      let c = new F(0, 0, 0, 1),
        d = ue,
        e = ue,
        f = ve,
        g = ve,
        h = this.size.x,
        m = this.size.y;
      if (a == this) (e = d = 0), (f = h), (g = m);
      else {
        if (a == this.parent) {
          var n = this.Db;
          c.x = 0;
          c.y = 0;
          n.Jb(c, c);
          c.x < d && (d = c.x);
          c.x > f && (f = c.x);
          c.y < e && (e = c.y);
          c.y > g && (g = c.y);
          c.x = h;
          c.y = 0;
          n.Jb(c, c);
          c.x < d && (d = c.x);
          c.x > f && (f = c.x);
          c.y < e && (e = c.y);
          c.y > g && (g = c.y);
          c.x = h;
          c.y = m;
          n.Jb(c, c);
          c.x < d && (d = c.x);
          c.x > f && (f = c.x);
          c.y < e && (e = c.y);
          c.y > g && (g = c.y);
          c.x = 0;
          c.y = m;
          n.Jb(c, c);
        } else
          null == a.parent
            ? ((n = this.Ea),
              (c.x = 0),
              (c.y = 0),
              n.Jb(c, c),
              c.x < d && (d = c.x),
              c.x > f && (f = c.x),
              c.y < e && (e = c.y),
              c.y > g && (g = c.y),
              (c.x = h),
              (c.y = 0),
              n.Jb(c, c),
              c.x < d && (d = c.x),
              c.x > f && (f = c.x),
              c.y < e && (e = c.y),
              c.y > g && (g = c.y),
              (c.x = h),
              (c.y = m),
              n.Jb(c, c),
              c.x < d && (d = c.x),
              c.x > f && (f = c.x),
              c.y < e && (e = c.y),
              c.y > g && (g = c.y),
              (c.x = 0),
              (c.y = m),
              n.Jb(c, c))
            : ((n = this.Ea),
              (a = a.Ea),
              (c.x = 0),
              (c.y = 0),
              n.Jb(c, c),
              a.eg(c, c),
              c.x < d && (d = c.x),
              c.x > f && (f = c.x),
              c.y < e && (e = c.y),
              c.y > g && (g = c.y),
              (c.x = h),
              (c.y = 0),
              n.Jb(c, c),
              a.eg(c, c),
              c.x < d && (d = c.x),
              c.x > f && (f = c.x),
              c.y < e && (e = c.y),
              c.y > g && (g = c.y),
              (c.x = h),
              (c.y = m),
              n.Jb(c, c),
              a.eg(c, c),
              c.x < d && (d = c.x),
              c.x > f && (f = c.x),
              c.y < e && (e = c.y),
              c.y > g && (g = c.y),
              (c.x = 0),
              (c.y = m),
              n.Jb(c, c),
              a.eg(c, c));
        c.x < d && (d = c.x);
        c.x > f && (f = c.x);
        c.y < e && (e = c.y);
        c.y > g && (g = c.y);
      }
      null == b
        ? (b = new Y(d, e, f, g))
        : ((b.A = d), (b.D = e), (b.B = f), (b.G = g));
      return b;
    }
    Qc() {
      super.Qc();
      var a = this.size.x / 2;
      let b = this.size.y / 2;
      this.ea.C.x = a;
      this.ea.C.y = b;
      this.ea.Z = Math.sqrt(a * a + b * b);
      302 == this.ea.type &&
        ((a = this.ea.gb),
        (a.A = 0),
        (a.D = 0),
        (a.B = this.size.x),
        (a.G = this.size.y));
    }
    ya() {
      return 401;
    }
  }
  Oc.i = !0;
  Oc.s = Va;
  Object.assign(Oc.prototype, { l: Oc });
  class Ja {
    static Fv(a, b) {
      for (a = a.parent; null != a; ) {
        if (a == b) return !0;
        a = a.parent;
      }
      return !1;
    }
    static Xf(a) {
      let b = Ja.qx;
      b.clear();
      for (b.Mf(Oa.count); null != a; ) (b.N[b.Fa++] = a), (a = a.parent);
      a = b.N[--b.Fa];
      for (a.Ea.set(a.Db); 0 < b.Fa; ) {
        let c = b.N[--b.Fa];
        0 >= (c.flags & 64) &&
          (0 < (c.flags & 512) ? c.Ea.VD(a.Ea, c.Db) : c.Ea.UD(a.Ea, c.Db));
        a = c;
      }
    }
    static tN(a, b) {
      let c = Ja.uS;
      c.Mf(Oa.count);
      var d = Ja.qx;
      d.Mf(Oa.count);
      d.clear();
      for (d.N[d.Fa++] = a; 0 < d.Fa; )
        if (((a = d.N[--d.Fa]), 1 != a.Ne))
          if (0 < (a.flags & 2)) null != a.effect && (c.N[c.Fa++] = a);
          else if (0 < (a.flags & 1))
            for (a = a.children; null != a; ) (d.N[d.Fa++] = a), (a = a.Y);
      b.clear();
      b.Mf(c.Fa);
      d = 0;
      for (a = c.Fa; d < a; ) {
        ++d;
        let e = c.N[--c.Fa];
        b.N[b.aa++] = e;
      }
    }
    static Al(a, b, c) {
      let d = ue,
        e = ue,
        f = ve,
        g = ve,
        h = Ja.qx;
      h.Mf(Oa.count);
      h.clear();
      for (h.N[h.Fa++] = a; 0 < h.Fa; )
        if (((a = h.N[--h.Fa]), 0 < (a.flags & 2)))
          a.Al(b, c),
            c.A < d && (d = c.A),
            c.D < e && (e = c.D),
            c.B > f && (f = c.B),
            c.G > g && (g = c.G);
        else if (0 < (a.flags & 1))
          for (a = a.children; null != a; ) (h.N[h.Fa++] = a), (a = a.Y);
      c.A = d;
      c.D = e;
      c.B = f;
      c.G = g;
      return c;
    }
    static US(a, b, c) {
      let d = c.A,
        e = c.D,
        f = c.B,
        g = c.G,
        h = ue,
        m = ue,
        n = ve,
        q = ve,
        p = new F(0, 0, 0, 1);
      b == a
        ? ((h = c.A), (m = c.D), (n = c.B), (q = c.G))
        : (b == a.parent
            ? ((b = a.Db),
              (p.x = d),
              (p.y = e),
              b.Jb(p, p),
              p.x < h && (h = p.x),
              p.x > n && (n = p.x),
              p.y < m && (m = p.y),
              p.y > q && (q = p.y),
              (p.x = f),
              (p.y = e),
              b.Jb(p, p),
              p.x < h && (h = p.x),
              p.x > n && (n = p.x),
              p.y < m && (m = p.y),
              p.y > q && (q = p.y),
              (p.x = f),
              (p.y = g),
              b.Jb(p, p),
              p.x < h && (h = p.x),
              p.x > n && (n = p.x),
              p.y < m && (m = p.y),
              p.y > q && (q = p.y),
              (p.x = d),
              (p.y = g),
              b.Jb(p, p))
            : null == b.parent
            ? ((b = a.Ea),
              (p.x = d),
              (p.y = e),
              b.Jb(p, p),
              p.x < h && (h = p.x),
              p.x > n && (n = p.x),
              p.y < m && (m = p.y),
              p.y > q && (q = p.y),
              (p.x = f),
              (p.y = e),
              b.Jb(p, p),
              p.x < h && (h = p.x),
              p.x > n && (n = p.x),
              p.y < m && (m = p.y),
              p.y > q && (q = p.y),
              (p.x = f),
              (p.y = g),
              b.Jb(p, p),
              p.x < h && (h = p.x),
              p.x > n && (n = p.x),
              p.y < m && (m = p.y),
              p.y > q && (q = p.y),
              (p.x = d),
              (p.y = g),
              b.Jb(p, p))
            : ((a = a.Ea),
              (b = b.Ea),
              (p.x = d),
              (p.y = e),
              a.Jb(p, p),
              b.eg(p, p),
              p.x < h && (h = p.x),
              p.x > n && (n = p.x),
              p.y < m && (m = p.y),
              p.y > q && (q = p.y),
              (p.x = f),
              (p.y = e),
              a.Jb(p, p),
              b.eg(p, p),
              p.x < h && (h = p.x),
              p.x > n && (n = p.x),
              p.y < m && (m = p.y),
              p.y > q && (q = p.y),
              (p.x = f),
              (p.y = g),
              a.Jb(p, p),
              b.eg(p, p),
              p.x < h && (h = p.x),
              p.x > n && (n = p.x),
              p.y < m && (m = p.y),
              p.y > q && (q = p.y),
              (p.x = d),
              (p.y = g),
              a.Jb(p, p),
              b.eg(p, p)),
          p.x < h && (h = p.x),
          p.x > n && (n = p.x),
          p.y < m && (m = p.y),
          p.y > q && (q = p.y));
      return new Y(h, m, n, q);
    }
  }
  Ja.i = !0;
  class we {}
  we.i = !0;
  we.Je = !0;
  Object.assign(we.prototype, { l: we });
  class wg {
    constructor() {
      this.lB = new fb(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.Ue = new fb(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.K = 15;
      this.scale = new F(1, 1, 1, 1);
      this.translate = new F(0, 0, 0, 1);
      this.matrix = new fb(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    set(a) {
      var b = this.translate,
        c = a.translate;
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
    Mw(a) {
      this.translate.x = a.translate.x;
      this.translate.y = a.translate.y;
      this.scale.x = a.scale.x;
      this.scale.y = a.scale.y;
      let b = this.matrix,
        c = a.matrix;
      b.m11 = c.m11;
      b.m12 = c.m12;
      b.m21 = c.m21;
      b.m22 = c.m22;
      this.K = a.K | 240;
    }
    JD() {
      let a = this.matrix;
      a.m11 = 1;
      a.m12 = 0;
      a.m21 = 0;
      a.m22 = 1;
      this.K |= 506;
    }
    GN() {
      let a, b;
      if (0 < (this.K & 8)) {
        a = Math.abs(this.scale.x);
        b = Math.abs(this.scale.y);
        var c = Math.abs(this.scale.z);
      } else
        (c = this.matrix),
          (a = Math.abs(c.m11) + Math.abs(c.m12) + Math.abs(c.m13)),
          (b = Math.abs(c.m21) + Math.abs(c.m22) + Math.abs(c.m23)),
          (c = Math.abs(c.m31) + Math.abs(c.m32) + Math.abs(c.m33));
      return Math.max(Math.max(a, b), c);
    }
    UD(a, b) {
      let c = a.K,
        d = b.K;
      if (0 < (c & 1)) this.set(b);
      else if (0 < (d & 1)) this.set(a);
      else if (12 == (c & 12) && 0 < (d & 8)) {
        if (0 < (c & 2)) {
          let f = b.matrix,
            g = this.matrix;
          g.m11 = f.m11;
          g.m12 = f.m12;
          g.m13 = f.m13;
          g.m21 = f.m21;
          g.m22 = f.m22;
          g.m23 = f.m23;
          g.m31 = f.m31;
          g.m32 = f.m32;
          g.m33 = f.m33;
        } else if (0 < (d & 2)) {
          let f = a.matrix,
            g = this.matrix;
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
          let f = a.matrix,
            g = b.matrix,
            h = g.m11,
            m = g.m12,
            n = g.m13,
            q = g.m21,
            p = g.m22,
            v = g.m23,
            u = g.m31,
            A = g.m32,
            C = g.m33,
            B = f.m11 * m + f.m12 * p + f.m13 * A,
            K = f.m11 * n + f.m12 * v + f.m13 * C,
            E = f.m21 * m + f.m22 * p + f.m23 * A,
            aa = f.m21 * n + f.m22 * v + f.m23 * C,
            Z = f.m31 * m + f.m32 * p + f.m33 * A,
            V = f.m31 * n + f.m32 * v + f.m33 * C,
            ea = this.matrix;
          ea.m11 = f.m11 * h + f.m12 * q + f.m13 * u;
          ea.m12 = B;
          ea.m13 = K;
          ea.m21 = f.m21 * h + f.m22 * q + f.m23 * u;
          ea.m22 = E;
          ea.m23 = aa;
          ea.m31 = f.m31 * h + f.m32 * q + f.m33 * u;
          ea.m32 = Z;
          ea.m33 = V;
        }
        this.K = (this.K & -4) | 248;
        let e = a.scale.x;
        if (0 < (c & 2)) {
          let f = a.scale.x,
            g = b.translate,
            h = a.translate;
          this.translate.x = g.x * f + h.x;
          this.translate.y = g.y * f + h.y;
          this.translate.z = g.z * f + h.z;
        } else {
          let f = a.scale.x,
            g = a.matrix,
            h = b.translate,
            m = h.x,
            n = h.y,
            q = h.z,
            p = a.translate;
          this.translate.x = (g.m11 * m + g.m12 * n + g.m13 * q) * f + p.x;
          this.translate.y = (g.m21 * m + g.m22 * n + g.m23 * q) * f + p.y;
          this.translate.z = (g.m31 * m + g.m32 * n + g.m33 * q) * f + p.z;
        }
        this.K = (this.K & -2) | 240;
        if (0 < (d & 4))
          (this.scale.x = this.scale.y = this.scale.z = e * b.scale.x),
            (this.K = (this.K & -2) | 244);
        else {
          let f = b.scale;
          this.scale.x = f.x * e;
          this.scale.y = f.y * e;
          this.scale.z = f.z * e;
          this.K = (this.K & -6) | 240;
        }
      } else {
        if (0 < (c & 8) && 0 < (d & 8)) {
          let e = a.matrix,
            f = a.scale,
            g = f.x,
            h = f.y,
            m = f.z,
            n = e.m11 * g,
            q = e.m12 * h,
            p = e.m13 * m,
            v = e.m21 * g,
            u = e.m22 * h,
            A = e.m23 * m,
            C = e.m31 * g,
            B = e.m32 * h,
            K = e.m33 * m,
            E = b.matrix,
            aa = b.scale,
            Z = aa.x,
            V = aa.y,
            ea = aa.z,
            xa = E.m11 * Z,
            pa = E.m12 * V,
            fa = E.m13 * ea,
            sa = E.m21 * Z,
            Ga = E.m22 * V,
            qa = E.m23 * ea,
            ia = E.m31 * Z,
            ab = E.m32 * V,
            lb = E.m33 * ea,
            Ra = this.matrix;
          Ra.m11 = n * xa + q * sa + p * ia;
          Ra.m12 = n * pa + q * Ga + p * ab;
          Ra.m13 = n * fa + q * qa + p * lb;
          Ra.m21 = v * xa + u * sa + A * ia;
          Ra.m22 = v * pa + u * Ga + A * ab;
          Ra.m23 = v * fa + u * qa + A * lb;
          Ra.m31 = C * xa + B * sa + K * ia;
          Ra.m32 = C * pa + B * Ga + K * ab;
          Ra.m33 = C * fa + B * qa + K * lb;
          this.K = 240;
          let mb = b.translate,
            ge = mb.x,
            qd = mb.y,
            he = mb.z,
            ie = a.translate;
          this.translate.x = n * ge + q * qd + p * he + ie.x;
          this.translate.y = v * ge + u * qd + A * he + ie.y;
          this.translate.z = C * ge + B * qd + K * he + ie.z;
        } else if (0 < (c & 8)) {
          let e = a.matrix,
            f = a.scale,
            g = f.x,
            h = f.y,
            m = f.z,
            n = e.m11 * g,
            q = e.m12 * h,
            p = e.m13 * m,
            v = e.m21 * g,
            u = e.m22 * h,
            A = e.m23 * m,
            C = e.m31 * g,
            B = e.m32 * h,
            K = e.m33 * m,
            E = b.matrix,
            aa = E.m11,
            Z = E.m12,
            V = E.m13,
            ea = E.m21,
            xa = E.m22,
            pa = E.m23,
            fa = E.m31,
            sa = E.m32,
            Ga = E.m33,
            qa = this.matrix;
          qa.m11 = n * aa + q * ea + p * fa;
          qa.m12 = n * Z + q * xa + p * sa;
          qa.m13 = n * V + q * pa + p * Ga;
          qa.m21 = v * aa + u * ea + A * fa;
          qa.m22 = v * Z + u * xa + A * sa;
          qa.m23 = v * V + u * pa + A * Ga;
          qa.m31 = C * aa + B * ea + K * fa;
          qa.m32 = C * Z + B * xa + K * sa;
          qa.m33 = C * V + B * pa + K * Ga;
          this.K = 240;
          let ia = b.translate,
            ab = ia.x,
            lb = ia.y,
            Ra = ia.z,
            mb = a.translate;
          this.translate.x = n * ab + q * lb + p * Ra + mb.x;
          this.translate.y = v * ab + u * lb + A * Ra + mb.y;
          this.translate.z = C * ab + B * lb + K * Ra + mb.z;
        } else if (0 < (d & 8)) {
          let e = a.matrix,
            f = b.matrix,
            g = b.scale,
            h = g.x,
            m = g.y,
            n = g.z,
            q = f.m11 * h,
            p = f.m12 * m,
            v = f.m13 * n,
            u = f.m21 * h,
            A = f.m22 * m,
            C = f.m23 * n,
            B = f.m31 * h,
            K = f.m32 * m,
            E = f.m33 * n,
            aa = e.m11 * p + e.m12 * A + e.m13 * K,
            Z = e.m11 * v + e.m12 * C + e.m13 * E,
            V = e.m21 * p + e.m22 * A + e.m23 * K,
            ea = e.m21 * v + e.m22 * C + e.m23 * E,
            xa = e.m31 * p + e.m32 * A + e.m33 * K,
            pa = e.m31 * v + e.m32 * C + e.m33 * E,
            fa = this.matrix;
          fa.m11 = e.m11 * q + e.m12 * u + e.m13 * B;
          fa.m12 = aa;
          fa.m13 = Z;
          fa.m21 = e.m21 * q + e.m22 * u + e.m23 * B;
          fa.m22 = V;
          fa.m23 = ea;
          fa.m31 = e.m31 * q + e.m32 * u + e.m33 * B;
          fa.m32 = xa;
          fa.m33 = pa;
          this.K = 240;
          let sa = b.translate,
            Ga = sa.x,
            qa = sa.y,
            ia = sa.z,
            ab = a.translate;
          this.translate.x = e.m11 * Ga + e.m12 * qa + e.m13 * ia + ab.x;
          this.translate.y = e.m21 * Ga + e.m22 * qa + e.m23 * ia + ab.y;
          this.translate.z = e.m31 * Ga + e.m32 * qa + e.m33 * ia + ab.z;
        } else {
          let e = a.matrix,
            f = b.matrix,
            g = f.m11,
            h = f.m12,
            m = f.m13,
            n = f.m21,
            q = f.m22,
            p = f.m23,
            v = f.m31,
            u = f.m32,
            A = f.m33,
            C = e.m11 * h + e.m12 * q + e.m13 * u,
            B = e.m11 * m + e.m12 * p + e.m13 * A,
            K = e.m21 * h + e.m22 * q + e.m23 * u,
            E = e.m21 * m + e.m22 * p + e.m23 * A,
            aa = e.m31 * h + e.m32 * q + e.m33 * u,
            Z = e.m31 * m + e.m32 * p + e.m33 * A,
            V = this.matrix;
          V.m11 = e.m11 * g + e.m12 * n + e.m13 * v;
          V.m12 = C;
          V.m13 = B;
          V.m21 = e.m21 * g + e.m22 * n + e.m23 * v;
          V.m22 = K;
          V.m23 = E;
          V.m31 = e.m31 * g + e.m32 * n + e.m33 * v;
          V.m32 = aa;
          V.m33 = Z;
          this.K = 240;
          let ea = b.translate,
            xa = ea.x,
            pa = ea.y,
            fa = ea.z,
            sa = a.translate;
          this.translate.x = e.m11 * xa + e.m12 * pa + e.m13 * fa + sa.x;
          this.translate.y = e.m21 * xa + e.m22 * pa + e.m23 * fa + sa.y;
          this.translate.z = e.m31 * xa + e.m32 * pa + e.m33 * fa + sa.z;
        }
        this.K = (this.K & -2) | 240;
      }
    }
    VD(a, b) {
      var c = a.K,
        d = b.K;
      if (0 < (c & 1)) this.Mw(b);
      else if (0 < (d & 1)) this.Mw(a);
      else if (12 == (c & 12) && 0 < (d & 8)) {
        if (0 < (c & 2)) {
          var e = b.matrix,
            f = this.matrix;
          f.m11 = e.m11;
          f.m12 = e.m12;
          f.m21 = e.m21;
          f.m22 = e.m22;
        } else if (0 < (d & 2))
          (e = a.matrix),
            (f = this.matrix),
            (f.m11 = e.m11),
            (f.m12 = e.m12),
            (f.m21 = e.m21),
            (f.m22 = e.m22);
        else {
          e = a.matrix;
          var g = b.matrix;
          f = g.m11;
          var h = g.m12,
            m = g.m21,
            n = g.m22;
          g = e.m11 * h + e.m12 * n;
          h = e.m21 * h + e.m22 * n;
          n = this.matrix;
          n.m11 = e.m11 * f + e.m12 * m;
          n.m12 = g;
          n.m21 = e.m21 * f + e.m22 * m;
          n.m22 = h;
        }
        this.K = (this.K & -4) | 504;
        e = a.scale.x;
        0 < (c & 2)
          ? ((c = a.scale.x),
            (f = b.translate),
            (a = a.translate),
            (this.translate.x = f.x * c + a.x),
            (this.translate.y = f.y * c + a.y))
          : ((c = a.scale.x),
            (f = a.matrix),
            (g = b.translate),
            (m = g.x),
            (g = g.y),
            (a = a.translate),
            (this.translate.x = (f.m11 * m + f.m12 * g) * c + a.x),
            (this.translate.y = (f.m21 * m + f.m22 * g) * c + a.y));
        this.K = (this.K & -2) | 496;
        0 < (d & 4)
          ? ((this.scale.x = this.scale.y = e * b.scale.x),
            (this.K = (this.K & -2) | 500))
          : ((a = b.scale),
            (this.scale.x = a.x * e),
            (this.scale.y = a.y * e),
            (this.K = (this.K & -6) | 496));
      } else {
        if (0 < (c & 8) && 0 < (d & 8)) {
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
          this.K = (this.K & -16) | 496;
          m = b.translate;
          b = m.x;
          m = m.y;
          a = a.translate;
          this.translate.x = d * b + c * m + a.x;
          this.translate.y = e * b + f * m + a.y;
        } else
          0 < (c & 8)
            ? ((f = a.matrix),
              (d = a.scale),
              (e = d.x),
              (m = d.y),
              (d = f.m11 * e),
              (c = f.m12 * m),
              (e *= f.m21),
              (f = f.m22 * m),
              (n = b.matrix),
              (m = n.m11),
              (g = n.m12),
              (h = n.m21),
              (n = n.m22),
              (q = this.matrix),
              (q.m11 = d * m + c * h),
              (q.m12 = d * g + c * n),
              (q.m21 = e * m + f * h),
              (q.m22 = e * g + f * n),
              (this.K = (this.K & -16) | 496),
              (m = b.translate),
              (b = m.x),
              (m = m.y),
              (a = a.translate),
              (this.translate.x = d * b + c * m + a.x),
              (this.translate.y = e * b + f * m + a.y))
            : 0 < (d & 8)
            ? ((d = a.matrix),
              (m = b.matrix),
              (c = b.scale),
              (e = c.x),
              (g = c.y),
              (c = m.m11 * e),
              (f = m.m12 * g),
              (e *= m.m21),
              (g *= m.m22),
              (m = d.m11 * f + d.m12 * g),
              (f = d.m21 * f + d.m22 * g),
              (g = this.matrix),
              (g.m11 = d.m11 * c + d.m12 * e),
              (g.m12 = m),
              (g.m21 = d.m21 * c + d.m22 * e),
              (g.m22 = f),
              (this.K = (this.K & -16) | 496),
              (c = b.translate),
              (b = c.x),
              (c = c.y),
              (a = a.translate),
              (this.translate.x = d.m11 * b + d.m12 * c + a.x),
              (this.translate.y = d.m21 * b + d.m22 * c + a.y))
            : ((d = a.matrix),
              (f = b.matrix),
              (c = f.m11),
              (m = f.m12),
              (e = f.m21),
              (g = f.m22),
              (f = d.m11 * m + d.m12 * g),
              (m = d.m21 * m + d.m22 * g),
              (g = this.matrix),
              (g.m11 = d.m11 * c + d.m12 * e),
              (g.m12 = f),
              (g.m21 = d.m21 * c + d.m22 * e),
              (g.m22 = m),
              (this.K = (this.K & -16) | 496),
              (c = b.translate),
              (b = c.x),
              (c = c.y),
              (a = a.translate),
              (this.translate.x = d.m11 * b + d.m12 * c + a.x),
              (this.translate.y = d.m21 * b + d.m22 * c + a.y));
        this.K = (this.K & -2) | 496;
      }
    }
    ML(a, b) {
      0 < (this.K & 16) && this.ht();
      let c = this.Ue,
        d = a.x,
        e = a.y;
      a = a.z;
      b.x = c.m11 * d + c.m12 * e + c.m13 * a + c.m14;
      b.y = c.m21 * d + c.m22 * e + c.m23 * a + c.m24;
      b.z = c.m31 * d + c.m32 * e + c.m33 * a + c.m34;
      return b;
    }
    Jb(a, b) {
      0 < (this.K & 64) && this.Mm();
      let c = this.Ue,
        d = c.m21 * a.x + c.m22 * a.y + c.m24;
      b.x = c.m11 * a.x + c.m12 * a.y + c.m14;
      b.y = d;
      return b;
    }
    eg(a, b) {
      0 < (this.K & 128) && this.fT();
      let c = this.lB,
        d = c.m21 * a.x + c.m22 * a.y + c.m24;
      b.x = c.m11 * a.x + c.m12 * a.y + c.m14;
      b.y = d;
      return b;
    }
    ht() {
      let a = this.Ue;
      if (0 < (this.K & 1))
        (a.m11 = 1),
          (a.m12 = 0),
          (a.m13 = 0),
          (a.m21 = 0),
          (a.m22 = 1),
          (a.m23 = 0),
          (a.m31 = 0),
          (a.m32 = 0),
          (a.m33 = 1),
          (a.m14 = 0),
          (a.m24 = 0),
          (a.m34 = 0);
      else {
        var b = this.matrix;
        if (0 < (this.K & 8)) {
          let c = this.scale.x,
            d = this.scale.y,
            e = this.scale.z;
          a.m11 = b.m11 * c;
          a.m12 = b.m12 * d;
          a.m13 = b.m13 * e;
          a.m21 = b.m21 * c;
          a.m22 = b.m22 * d;
          a.m23 = b.m23 * e;
          a.m31 = b.m31 * c;
          a.m32 = b.m32 * d;
          a.m33 = b.m33 * e;
        } else
          (a.m11 = b.m11),
            (a.m12 = b.m12),
            (a.m13 = b.m13),
            (a.m21 = b.m21),
            (a.m22 = b.m22),
            (a.m23 = b.m23),
            (a.m31 = b.m31),
            (a.m32 = b.m32),
            (a.m33 = b.m33);
        b = this.translate;
        a.m14 = b.x;
        a.m24 = b.y;
        a.m34 = b.z;
      }
      this.K &= -81;
    }
    Mm() {
      let a = this.Ue;
      if (0 < (this.K & 1))
        (a.m11 = 1),
          (a.m12 = 0),
          (a.m21 = 0),
          (a.m22 = 1),
          (a.m14 = 0),
          (a.m24 = 0);
      else {
        let c = this.matrix;
        if (0 < (this.K & 8)) {
          var b = this.scale;
          let d = b.x;
          b = b.y;
          a.m11 = c.m11 * d;
          a.m12 = c.m12 * b;
          a.m21 = c.m21 * d;
          a.m22 = c.m22 * b;
        } else
          (a.m11 = c.m11), (a.m12 = c.m12), (a.m21 = c.m21), (a.m22 = c.m22);
        a.m14 = this.translate.x;
        a.m24 = this.translate.y;
      }
      this.K &= -65;
    }
    fT() {
      let a = this.lB;
      var b = this.matrix;
      if (0 < (this.K & 1))
        (a.m11 = 1),
          (a.m12 = 0),
          (a.m21 = 0),
          (a.m22 = 1),
          (a.m14 = 0),
          (a.m24 = 0);
      else {
        if (0 < (this.K & 8))
          if (12 == (this.K & 12)) {
            var c = 1 / this.scale.x,
              d = b.m12 * c;
            a.m11 = b.m11 * c;
            a.m12 = b.m21 * c;
            a.m21 = d;
            a.m22 = b.m22 * c;
          } else {
            c = this.scale;
            var e = c.x,
              f = c.y;
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
        else
          0 < (this.K & 64) && this.Mm(),
            (b = this.Ue),
            (c = 1 / (b.m11 * b.m22 - b.m12 * b.m21)),
            (d = b.m11 * c),
            (a.m11 = b.m22 * c),
            (a.m12 = -b.m12 * c),
            (a.m21 = -b.m21 * c),
            (a.m22 = d);
        a.m14 = -(a.m11 * this.translate.x + a.m12 * this.translate.y);
        a.m24 = -(a.m21 * this.translate.x + a.m22 * this.translate.y);
      }
      this.K &= -129;
    }
  }
  wg.i = !0;
  Object.assign(wg.prototype, { l: wg });
  class $f extends gb {
    constructor() {
      super(3);
    }
    set() {}
  }
  $f.i = !0;
  $f.s = gb;
  Object.assign($f.prototype, { l: $f });
  class gc {
    constructor(a, b) {
      this.u = this.va = new Va();
      this.u.Vg = this;
      this.va.zh(new fc(1));
      null != a ? this.va.Qf(new qe(a)) : this.va.Qf(new oe(b));
    }
    W(a) {
      this.va.ki(5).bf(a);
    }
    M(a) {
      this.va.Ne = a ? 2 : 1;
    }
    F() {
      this.va.F();
      this.u = this.va = null;
    }
  }
  gc.i = !0;
  gc.Ib = [we];
  Object.assign(gc.prototype, { l: gc });
  class pb {
    constructor(a) {
      pb.count++;
      this.u = a;
      a.Vg = this;
      this.NL = this.ya();
      this.flags = 6;
      this.cg = this.ed = this.bg = this.Qa = 1;
      this.jn =
        this.hn =
        this.Qg =
        this.Pg =
        this.Sg =
        this.Rg =
        this.ag =
        this.Yd =
          0;
      this.Sc = 1;
      this.Zt = !0;
    }
    F() {
      this.u = null;
      pb.count--;
    }
    remove() {
      let a = this.u.parent;
      null != a && a.removeChild(this.u);
    }
    kh() {
      var a = this.u.parent;
      return null != a && ((a = a.Vg), null != a && 204 == a.NL) ? a : null;
    }
    ix(a) {
      this.u.name = a;
    }
    W(a) {
      a = 0 > a ? 0 : 1 < a ? 1 : a;
      if (this.Sc != a) {
        this.Sc = a;
        let b = this.u;
        if (1 > a) {
          let c = b.ki(5);
          null == c ? b.zh(new fc(this.Sc)) : c.bf(a);
        } else b.ks(5);
        b.flags |= 32;
      }
    }
    pi() {
      return this.Zt;
    }
    M(a) {
      this.Zt != a && ((this.Zt = a), (this.u.Ne = a ? 0 : 1));
    }
    na(a) {
      this.Qa != a &&
        ((this.bg = this.Qa = a),
        tb(a, 0.001) && (this.bg = 0.001 * (0 <= a ? 1 : -1)),
        1 == a && 1 == this.ed
          ? ((this.flags = (this.flags & -3) | 4),
            (a = this.u.Db),
            (a.scale.x = 1),
            (a.scale.y = 1),
            (a.K |= 500))
          : (this.flags &= -7),
        this.oc());
    }
    lb(a) {
      this.ed != a &&
        ((this.cg = this.ed = a),
        tb(a, 0.001) && (this.cg = 0.001 * (0 <= a ? 1 : -1)),
        1 == a && 1 == this.Qa
          ? ((this.flags = (this.flags & -3) | 4),
            (a = this.u.Db),
            (a.scale.x = 1),
            (a.scale.y = 1),
            (a.K |= 500))
          : (this.flags &= -7),
        this.oc());
    }
    H(a) {
      if (this.Qa != a || this.ed != a)
        (this.Qa = this.ed = a),
          tb(a, 0.001)
            ? (this.bg = this.cg = 0.001 * (0 <= a ? 1 : -1))
            : (this.bg = this.cg = a),
          (this.flags |= 2),
          1 == a
            ? ((a = this.u.Db),
              (a.scale.x = 1),
              (a.scale.y = 1),
              (a.K |= 500),
              (this.flags |= 4))
            : (this.flags &= -5),
          this.oc();
    }
    setScale(a, b) {
      if (this.Qa != a || this.ed != b) {
        if (1 == a && 1 == b) {
          this.flags = (this.flags & -3) | 4;
          let c = this.u.Db;
          c.scale.x = 1;
          c.scale.y = 1;
          c.K |= 500;
        } else this.flags = a == b ? (this.flags &= -5) | 2 : this.flags & -7;
        this.Qa = this.bg = a;
        this.ed = this.cg = b;
        tb(a, 0.001) && (this.bg = 0.001 * (0 <= a ? 1 : -1));
        tb(b, 0.001) && (this.cg = 0.001 * (0 <= b ? 1 : -1));
        this.oc();
      }
    }
    la(a) {
      if (this.Yd != a) {
        this.Yd = a;
        let b;
        b = a % 360;
        0 > b && (b += 360);
        this.ag = b * La;
        0 == a ? ((this.flags &= -2), this.u.Db.JD()) : (this.flags |= 1);
        this.oc();
      }
    }
    wa() {
      return this.Rg;
    }
    o(a) {
      this.Rg != a && ((this.Rg = a), this.oc());
      return a;
    }
    Sa() {
      return this.Sg;
    }
    m(a) {
      this.Sg != a && ((this.Sg = a), this.oc());
    }
    lS(a) {
      if (this.Rg != a.x || this.Sg != a.y)
        (this.Rg = a.x), (this.Sg = a.y), this.oc();
    }
    YR(a, b, c, d) {
      let e = !1;
      if (this.Rg != a || this.Sg != b) (this.Rg = a), (this.Sg = b), (e = !0);
      0 != this.Yd &&
        ((a = this.Yd = 0),
        0 > a && (a += 360),
        (this.ag = a * La),
        (this.flags &= -2),
        this.u.Db.JD(),
        (e = !0));
      if (this.Qa != c || this.ed != d)
        (this.bg = c),
          tb(c, 0.001) && (this.bg = 0.001 * (0 <= c ? 1 : -1)),
          (this.cg = d),
          tb(d, 0.001) && (this.cg = 0.001 * (0 <= d ? 1 : -1)),
          c == d
            ? 1 == c
              ? ((this.flags = (this.flags & -3) | 4),
                (c = this.u.Db),
                (c.scale.x = 1),
                (c.scale.y = 1),
                (c.K |= 500))
              : (this.flags = (this.flags & -5) | 2)
            : (this.flags &= -7),
          (e = !0);
      e && this.oc();
    }
    kS(a) {
      let b = a.x;
      a = a.y;
      null == b && (b = this.Pg);
      null == a && (a = this.Qg);
      if (this.Pg != b || this.Qg != a) (this.Pg = b), (this.Qg = a), this.oc();
    }
    Kg(a, b) {
      null == a && (a = this.Pg);
      null == b && (b = this.Qg);
      if (this.Pg != a || this.Qg != b) (this.Pg = a), (this.Qg = b), this.oc();
    }
    af(a, b) {
      null == a && (a = this.hn);
      null == b && (b = this.jn);
      if (this.hn != a || this.jn != b) (this.hn = a), (this.jn = b), this.oc();
    }
    C() {
      this.Dn();
      this.fl();
    }
    update(a) {
      this.u.Hh(a);
      this.u.Fd();
      this.u.Nm();
    }
    Dx(a) {
      Ja.Xf(this.u);
      return this.u.Ea.Jb(a, new F(0, 0, 0, 1));
    }
    Cx(a) {
      Ja.Xf(this.u);
      return this.u.Ea.eg(a, new F(0, 0, 0, 1));
    }
    Sb() {
      return new Ph(this);
    }
    Vd(a) {
      null == a ? this.u.ks(0) : this.u.zh(new ke(a, !1));
    }
    hp(a) {
      var b = this.u.ki(2);
      if (null != a) {
        null == b && ((b = new qc()), this.u.zh(b));
        b = b.transform;
        var c = b.$b,
          d = a.$b;
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
      } else null != b && this.u.ks(2);
    }
    bE(a) {
      let b = this.u.ki(1);
      null != a
        ? (null == b && ((b = new Lc()), this.u.zh(b)), b.XR(a))
        : null != b && this.u.ks(1);
    }
    oc() {
      let a = this.u.Db,
        b = this.Rg,
        c = this.Sg,
        d = this.Pg,
        e = this.Qg,
        f = this.hn,
        g = this.jn,
        h = this.bg;
      var m = this.cg,
        n = this.flags;
      if (0 < (n & 1)) {
        let p = Math.sin(this.ag),
          v = Math.cos(this.ag);
        var q = a.matrix;
        q.m11 = v;
        q.m12 = -p;
        q.m21 = p;
        q.m22 = v;
        a.K = (a.K & -4) | 504;
        0 < (n & 4)
          ? ((a.translate.x = -(f * v) + g * p + f + b - d),
            (a.translate.y = -(f * p) - g * v + g + c - e))
          : 0 < (n & 2)
          ? ((m = h * f),
            (n = h * g),
            (a.scale.x = a.scale.y = h),
            (a.K = (a.K & -2) | 500),
            (a.translate.x = -(m * v) + n * p + f + b - d),
            (a.translate.y = -(m * p) - n * v + g + c - e))
          : ((n = h * f),
            (q = m * g),
            (a.scale.x = h),
            (a.scale.y = m),
            (a.K = (a.K & -6) | 496),
            (a.translate.x = -(n * v) + q * p + f + b - d),
            (a.translate.y = -(n * p) - q * v + g + c - e));
      } else
        0 < (n & 4)
          ? ((a.translate.x = b - d), (a.translate.y = c - e))
          : 0 < (n & 2)
          ? ((a.scale.x = a.scale.y = h),
            (a.K = (a.K & -2) | 500),
            (a.translate.x = -(h * f) + f + b - d),
            (a.translate.y = -(h * g) + g + c - e))
          : ((a.scale.x = h),
            (a.scale.y = m),
            (a.K = (a.K & -6) | 496),
            (a.translate.x = -(h * f) + f + b - d),
            (a.translate.y = -(m * g) + g + c - e));
      a.K = (a.K & -2) | 496;
    }
    ya() {
      return 104;
    }
  }
  pb.i = !0;
  pb.Ib = [td, we];
  Object.assign(pb.prototype, { l: pb });
  class y extends pb {
    constructor(a, b, c) {
      super(new Oc(null != a ? a.node : null));
      this.He = new Y(0, 0, 0, 0);
      this.qf = this.wq = null;
      this.X = new F(0, 0, 0, 1);
      null != b && this.Tf(b, c);
      pb.count++;
    }
    F() {
      null != this.u &&
        (this.u.F(), (this.X = this.qf = this.wq = this.He = null), super.F());
    }
    ka() {
      if (0 == (this.flags & 1)) return this.X.x * Math.abs(this.Qa);
      var a = (this.X.x * Math.abs(this.Qa)) / 2;
      let b = (this.X.y * Math.abs(this.ed)) / 2,
        c = -Math.sin(this.ag),
        d = Math.cos(this.ag),
        e;
      0 < d ? ((e = -(d * a)), (a *= d)) : ((e = d * a), (a = -(d * a)));
      0 < c ? ((e -= c * b), (a += c * b)) : ((e += c * b), (a -= c * b));
      return a - e;
    }
    jx(a) {
      this.na(a / this.X.x);
    }
    ja() {
      if (0 == (this.flags & 1)) return this.X.y * Math.abs(this.ed);
      var a = (this.X.x * Math.abs(this.Qa)) / 2;
      let b = (this.X.y * Math.abs(this.ed)) / 2,
        c = Math.sin(this.ag),
        d = Math.cos(this.ag),
        e;
      0 < c ? ((e = -(c * a)), (a *= c)) : ((e = c * a), (a = -(c * a)));
      0 < d ? ((e -= d * b), (a += d * b)) : ((e += d * b), (a -= d * b));
      return a - e;
    }
    hx(a) {
      this.lb(a / this.X.y);
    }
    Dn() {
      this.Kg(this.X.x / 2, this.X.y / 2);
    }
    fl() {
      this.af(this.X.x / 2, this.X.y / 2);
    }
    Kg(a, b) {
      null != a && 0 <= a && 1 >= a && (a *= this.X.x);
      null != b && 0 <= b && 1 >= b && (b *= this.X.y);
      super.Kg(a, b);
    }
    af(a, b) {
      null != a && 0 <= a && 1 >= a && (a *= this.X.x);
      null != b && 0 <= b && 1 >= b && (b *= this.X.y);
      super.af(a, b);
    }
    Tf(a, b) {
      if (this.wq != a) {
        this.wq = a;
        this.qf = null;
        var c = this.u;
        c.Qo = P(this, this.MC);
        c.Qf(new pe(a));
        this.MC();
        this.oc();
      }
      null != b && this.ip(b);
    }
    MC() {
      var a = this.wq;
      let b = this.X;
      b.x = a.size.x * a.$e;
      b.y = a.size.y * a.$e;
      this.u.Lb(this.X.x, this.X.y);
      a = this.qf;
      null != a && ((this.qf = null), this.ip(a));
    }
    Fb(a) {
      if (this.qf != a) {
        this.qf = a;
        var b = this.u,
          c = b.effect,
          d = c.Sw(a);
        c = c.Hb.$e;
        a = this.He;
        var e = this.X;
        e.x = d.ec.x * c;
        e.y = d.ec.y * c;
        if (d.Bp) {
          e = d.gt;
          d = d.Nd;
          let f = e.x * c;
          e = e.y * c;
          a.A = f;
          a.D = e;
          a.B = f + d.w;
          a.G = e + d.J;
          b.Lb(d.w * c, d.J * c);
        } else
          b.Lb(this.X.x, this.X.y), (a.A = 0), (a.D = 0), (a.B = 0), (a.G = 0);
        this.oc();
      }
    }
    ip(a) {
      if (this.qf != a) {
        this.qf = a;
        var b = this.u,
          c = b.effect,
          d = c.Sw(a);
        c = c.Hb.$e;
        a = this.He;
        var e = this.X;
        e.x = d.ec.x * c;
        e.y = d.ec.y * c;
        if (d.Bp) {
          e = d.gt;
          d = d.Nd;
          let f = e.x * c;
          e = e.y * c;
          a.A = f;
          a.D = e;
          a.B = f + d.w;
          a.G = e + d.J;
          b.Lb(d.w * c, d.J * c);
        } else
          b.Lb(this.X.x, this.X.y), (a.A = 0), (a.D = 0), (a.B = 0), (a.G = 0);
        this.oc();
      }
    }
    pa() {
      return new hb(this);
    }
    setColor(a, b, c) {
      let d = this.X;
      d.x = b;
      d.y = c;
      b = this.u;
      b.Lb(this.X.x, this.X.y);
      b.Qc();
      this.u.Qf(new ne(a));
      return this;
    }
    Ub(a, b) {
      if (!this.pi()) return !1;
      Ja.Xf(this.u);
      this.u.pe();
      return this.u.Ub(a, b);
    }
    Re(a, b) {
      null == b && (b = !0);
      let c = new Y(va, va, wa, wa);
      if (0 == this.X.x) return c;
      if (a == this)
        return (c.A = 0), (c.D = 0), (c.B = this.X.x), (c.G = this.X.y), c;
      var d = this.He.A,
        e = this.He.D;
      let f = this.u;
      var g = f.size;
      let h = g.x;
      g = g.y;
      var m = this.He;
      if ((m = 0 < m.B - m.A)) {
        var n = this.He,
          q = n.B - n.A;
        n.A = 0;
        n.B = q;
        n = this.He;
        q = n.G - n.D;
        n.D = 0;
        n.G = q;
        f.Lb(this.X.x, this.X.y);
        this.oc();
        this.u.Fd(!1, !1);
      }
      b &&
        (Ja.Xf(this.u), null == a || Ja.Fv(this.u.parent, a.u) || Ja.Xf(a.u));
      this.u.Al(null == a ? this.u.bB() : a.u, c);
      m &&
        ((a = this.He),
        (b = a.B - a.A),
        (a.A = d),
        (a.B = d + b),
        (d = this.He),
        (a = d.G - d.D),
        (d.D = e),
        (d.G = e + a),
        (e = f.size),
        (e.x = h),
        (e.y = g),
        f.Qc(),
        this.oc(),
        this.u.Fd(!1, !1));
      return c;
    }
    Dx(a) {
      let b = this.He;
      var c = b.A;
      let d = b.D;
      var e = 0 < b.B - b.A;
      if (e) {
        var f = b.B - b.A;
        b.A = 0;
        b.B = f;
        f = b.G - b.D;
        b.D = 0;
        b.G = f;
        this.oc();
        this.u.Fd(!1, !1);
      }
      a = super.Dx(a);
      e &&
        ((e = b.B - b.A),
        (b.A = c),
        (b.B = c + e),
        (c = b.G - b.D),
        (b.D = d),
        (b.G = d + c),
        this.oc(),
        this.u.Fd(!1, !1));
      return a;
    }
    Cx(a) {
      let b = this.He;
      var c = b.A;
      let d = b.D;
      var e = 0 < b.B - b.A;
      if (e) {
        var f = b.B - b.A;
        b.A = 0;
        b.B = f;
        f = b.G - b.D;
        b.D = 0;
        b.G = f;
        this.oc();
        this.u.Fd(!1, !1);
      }
      a = super.Cx(a);
      e &&
        ((e = b.B - b.A),
        (b.A = c),
        (b.B = c + e),
        (c = b.G - b.D),
        (b.D = d),
        (b.G = d + c),
        this.oc(),
        this.u.Fd(!1, !1));
      return a;
    }
    Cm() {
      null != this.kh()
        ? this.kh().Cm(this)
        : null != this.u.parent && this.u.parent.Vw(this.u);
    }
    ys() {
      null != this.kh()
        ? this.kh().ys(this)
        : null != this.u.parent && this.u.parent.Rw(this.u);
    }
    JR(a) {
      this.u.effect.OR(a);
    }
    oc() {
      let a = this.u.Db,
        b = this.Rg,
        c = this.Sg;
      var d = this.He;
      let e = d.A;
      d = d.D;
      let f = this.Pg,
        g = this.Qg,
        h = this.hn - e,
        m = this.jn - d,
        n = this.bg;
      var q = this.cg,
        p = this.flags;
      if (0 < (p & 1)) {
        let u = Math.sin(this.ag),
          A = Math.cos(this.ag);
        var v = a.matrix;
        let C = a.matrix;
        C.m11 = A;
        C.m12 = -u;
        C.m13 = v.m13;
        C.m21 = u;
        C.m22 = A;
        C.m23 = v.m23;
        C.m31 = v.m31;
        C.m32 = v.m32;
        C.m33 = v.m33;
        a.K = (a.K & -4) | 248;
        0 < (p & 4)
          ? ((a.scale.x = 1),
            (a.scale.y = 1),
            (a.K |= 500),
            (a.translate.x = -(h * A) + m * u + h + b - f + e),
            (a.translate.y = -(h * u) - m * A + m + c - g + d))
          : 0 < (p & 2)
          ? ((q = n * h),
            (p = n * m),
            (a.scale.x = a.scale.y = n),
            (a.K = (a.K & -2) | 500),
            (a.translate.x = -(q * A) + p * u + h + b - f + e),
            (a.translate.y = -(q * u) - p * A + m + c - g + d))
          : ((p = n * h),
            (v = q * m),
            (a.scale.x = n),
            (a.scale.y = q),
            (a.K = (a.K & -6) | 496),
            (a.translate.x = -(p * A) + v * u + h + b - f + e),
            (a.translate.y = -(p * u) - v * A + m + c - g + d));
      } else
        0 < (p & 4)
          ? ((a.scale.x = 1),
            (a.scale.y = 1),
            (a.K |= 500),
            (a.translate.x = b - f + e),
            (a.translate.y = c - g + d))
          : 0 < (p & 2)
          ? ((a.scale.x = a.scale.y = n),
            (a.K = (a.K & -2) | 500),
            (a.translate.x = -(n * h) + h + b - f + e),
            (a.translate.y = -(n * m) + m + c - g + d))
          : ((a.scale.x = n),
            (a.scale.y = q),
            (a.K = (a.K & -6) | 496),
            (a.translate.x = -(n * h) + h + b - f + e),
            (a.translate.y = -(q * m) + m + c - g + d));
      a.K = (a.K & -2) | 496;
    }
    ya() {
      return 304;
    }
  }
  y.i = !0;
  y.s = pb;
  Object.assign(y.prototype, { l: y });
  class S extends pb {
    constructor(a, b) {
      super(new qb(null != b ? b.node : null, null, 512));
      this.node = this.u;
      this.u.name = a;
    }
    F() {
      null != this.node && (this.node.F(), (this.node = null), super.F());
    }
    appendChild(a) {
      this.node.P(a.u);
    }
    Jj() {
      return this.node.Jj();
    }
    nb(a) {
      return this.node.nb(a).Vg;
    }
    Pw(a, b) {
      this.node.Pw(a.u, b);
    }
    Zn(a) {
      a = this.node.Zn(a);
      return null != a ? a.Vg : null;
    }
    Cm(a) {
      null == a
        ? null != this.kh() && this.node.parent.Vw(this.u)
        : this.node.Vw(a.u);
    }
    ys(a) {
      null == a
        ? null != this.kh() && this.node.parent.Rw(this.u)
        : this.node.Rw(a.u);
    }
    iterator() {
      let a = this.node.children;
      return {
        eb: function () {
          return null != a;
        },
        next: function () {
          let b = a.Vg;
          a = a.Y;
          return b;
        },
      };
    }
    Ub(a, b) {
      Ja.Xf(this.u);
      this.u.Fd(!1, !0);
      return this.node.Ub(a, b);
    }
    Re(a, b) {
      null == b && (b = !0);
      b &&
        (this.u.Fd(!1, !1),
        Ja.Xf(this.u),
        null == a || Ja.Fv(this.u, a.u) || Ja.Xf(a.u),
        (b = !1));
      let c = new Y(va, va, wa, wa),
        d = this.node.children;
      for (; null != d; ) {
        let e = d.Vg;
        null != e && e instanceof pb && c.add(e.Re(a, b));
        d = d.Y;
      }
      return c;
    }
    ka() {
      let a = this.Re(this.kh());
      return a.B - a.A;
    }
    ja() {
      let a = this.Re(this.kh());
      return a.G - a.D;
    }
    fl() {
      if (0 != this.Jj()) {
        var a = this.Re(this);
        this.af((a.A + a.B) / 2, (a.D + a.G) / 2);
      }
    }
    Dn() {
      if (0 != this.Jj()) {
        var a = this.Re(this);
        this.Kg((a.A + a.B) / 2, (a.D + a.G) / 2);
      }
    }
    ya() {
      return 204;
    }
  }
  S.i = !0;
  S.s = pb;
  Object.assign(S.prototype, { l: S });
  class Aa {
    constructor(a) {
      this.U = a;
      this.controllers = Array(6);
      for (a = 0; 6 > a; ) this.controllers[a++] = null;
    }
    ra() {
      if (null != this.controllers) {
        for (var a = 0, b = this.controllers; a < b.length; ) {
          let c = b[a];
          ++a;
          null != c && c.F();
        }
        this.U = this.controllers = null;
      }
    }
    play(a, b) {
      this.start(a, 0, b);
    }
    loop(a, b) {
      null == b && (b = !1);
      this.start(a, b ? 2 : 1);
    }
    Vc() {
      return null != this.current.Xa;
    }
    stop() {
      let a = 0,
        b = this.controllers;
      for (; a < b.length; ) {
        let c = b[a];
        ++a;
        null != c && c.stop();
      }
    }
    start(a, b, c) {
      let d = 0;
      this.current = null;
      let e = 0;
      for (; 6 > e; ) {
        let f = e++,
          g = a.NN();
        if (null == g[f]) continue;
        let h = this.controllers[f];
        if (null == h) {
          h = new md();
          let n;
          switch (f) {
            case 0:
              n = P(this, this.ZR);
              break;
            case 1:
              n = P(this, this.$R);
              break;
            case 2:
              n = P(this, this.wk);
              break;
            case 3:
              n = P(this, this.UR);
              break;
            case 4:
              n = P(this, this.VR);
              break;
            case 5:
              n = P(this, this.Ka);
          }
          h.Ro = n;
          h.PB = !0;
          this.U.u.eq(h);
          this.controllers[f] = h;
        }
        let m = g[f].aj;
        m > d && ((d = m), (this.current = h));
        h.play(g[f], b);
      }
      null != c &&
        (this.current.fk = function () {
          c(a);
        });
    }
    ZR(a, b, c) {
      this.U.na(this.Il(a, b, c));
    }
    $R(a, b, c) {
      this.U.lb(this.Il(a, b, c));
    }
    wk(a, b, c) {
      this.U.la(this.Il(a, b, c));
    }
    UR(a, b, c) {
      this.U.o(this.Il(a, b, c));
    }
    VR(a, b, c) {
      this.U.m(this.Il(a, b, c));
    }
    Ka(a, b, c) {
      this.U.W(this.Il(a, b, c));
    }
    Il(a, b, c) {
      c = ua.Lc(100 * a.TM)(c);
      a = a.value;
      return a + (b.value - a) * c;
    }
  }
  Aa.i = !0;
  Object.assign(Aa.prototype, { l: Aa });
  class zg {
    constructor(a, b) {
      this.value = a;
      this.TM = b;
    }
  }
  zg.i = !0;
  Object.assign(zg.prototype, { l: zg });
  class oa {
    constructor() {
      this.fc = null;
      let a = [],
        b = 0;
      for (; 6 > b; ) ++b, a.push(0);
      this.Va = a;
      this.frames = [];
    }
    Hs(a, b, c) {
      null == c && (c = 0);
      this.nj(0, a, b, c);
    }
    Is(a, b, c) {
      null == c && (c = 0);
      this.nj(1, a, b, c);
    }
    setScale(a, b, c, d) {
      null == d && (d = 0);
      this.Hs(a, c, d);
      this.Is(b, c, d);
    }
    vc(a, b) {
      var c;
      null == c && (c = 0);
      this.Hs(a, b, c);
      this.Is(a, b, c);
    }
    wk(a, b, c) {
      null == c && (c = 0);
      this.nj(2, a, b, c);
    }
    $D(a, b, c) {
      null == c && (c = 0);
      this.nj(3, a, b, c);
    }
    aE(a, b, c) {
      null == c && (c = 0);
      this.nj(4, a, b, c);
    }
    Ah(a, b, c, d) {
      null == d && (d = 0);
      this.$D(a, c, d);
      this.aE(b, c, d);
    }
    Ka(a, b, c) {
      null == c && (c = 0);
      this.nj(5, a, b, c);
    }
    Zp(a, b, c) {
      var d;
      null == d && (d = 0);
      let e = this.Va[0];
      this.Hs(a, e, d);
      this.Va[0] += c;
      e = this.Va[1];
      this.Is(b, e, d);
      this.Va[1] += c;
    }
    mn(a, b, c) {
      null == c && (c = 0);
      let d = this.Va[0];
      this.Hs(a, d, c);
      this.Va[0] += b;
      d = this.Va[1];
      this.Is(a, d, c);
      this.Va[1] += b;
    }
    fu(a, b) {
      var c;
      null == c && (c = 0);
      let d = this.Va[3];
      this.$D(0, d, c);
      this.Va[3] += b;
      d = this.Va[4];
      this.aE(a, d, c);
      this.Va[4] += b;
    }
    nj(a, b, c, d) {
      this.frames.push(new Ag(a, c, new zg(b, d)));
      this.fc = null;
    }
    NN() {
      if (null == this.fc) {
        this.fc = [];
        let d = 0;
        for (; 6 > d; ) {
          let e = d++;
          var a = this.frames;
          let f = [];
          for (var b = 0; b < a.length; ) {
            var c = a[b];
            ++b;
            c.TQ == e && f.push(c);
          }
          if (0 == f.length) this.fc[e] = null;
          else {
            f.sort(function (g, h) {
              return (1e5 * g.time - 1e5 * h.time) | 0;
            });
            if (0 < f[0].time) {
              switch (e) {
                case 0:
                case 1:
                case 5:
                  a = 1;
                  break;
                default:
                  a = 0;
              }
              f.unshift(new Ag(e, 0, new zg(a, 0)));
            }
            a = Array(f.length);
            b = 0;
            for (c = f.length; b < c; ) {
              let g = b++,
                h = f[g];
              a[g] = new Gc(h.NO, h.time);
            }
            this.fc[e] = new jd(a, 1);
          }
        }
      }
      return this.fc;
    }
    static parse(a) {
      a = a.replace(RegExp("\\s", "g"), "");
      let b = new oa(),
        c = Object.create(null);
      c.sx = 0;
      c.sy = 1;
      c.r = 2;
      c.x = 3;
      c.y = 4;
      c.a = 5;
      let d = new la("(s|p|sx|sy|r|x|y|a)([\\-\\d\\.]+)([<>]*)", ""),
        e = new la("([\\d\\.]+)", "");
      a = a.split(",");
      let f = 0,
        g = a.length,
        h = -1,
        m = [];
      for (; f < g; ) {
        var n = a[f++];
        let q = !1;
        for (; d.match(n); ) {
          q = !0;
          n = d.Yc(1);
          let p = parseFloat(d.Yc(2)),
            v = d.Yc(3);
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
          for (; 0 < m.length; )
            b.nj(m.pop(), p, h, "<" == v ? -100 : ">" == v ? 100 : 0);
          n = d.yP();
        }
        q || (e.match(n), (h = parseFloat(e.Yc(1))));
      }
      return b;
    }
  }
  oa.i = !0;
  Object.assign(oa.prototype, { l: oa });
  class Ag {
    constructor(a, b, c) {
      this.TQ = a;
      this.time = b;
      this.NO = c;
    }
  }
  Ag.i = !0;
  Object.assign(Ag.prototype, { l: Ag });
  class na extends pb {
    constructor(a, b) {
      a = new Oc(null != a ? a.node : null);
      super(a);
      this.effect = new ud(b);
      a.Qf(this.effect);
      b = this.effect.size;
      a.Lb(b.x, b.y);
    }
    F() {
      null != this.u && (this.u.F(), (this.Hb = this.effect = null), super.F());
    }
    Tf(a) {
      this.effect.F();
      this.effect = new ud(a);
      a = this.u;
      a.Qf(this.effect);
      let b = this.effect.size;
      a.Lb(b.x, b.y);
    }
    Uf(a) {
      null == a && (a = !0);
      this.effect.Ze && this.effect.shape();
      this.effect.fN(a);
    }
    shape() {
      this.effect.shape();
    }
    rb(a, b) {
      this.effect.rb(a, b);
      this.u.Lb(a, b);
    }
    Pa(a) {
      this.effect.Pa(a);
    }
    Eb(a, b) {
      this.effect.Eb(a, b);
    }
    Tq() {
      return this.effect.Tq();
    }
    lc(a) {
      this.effect.lc(a);
    }
    mv() {
      return this.effect.mv();
    }
    cp() {
      this.effect.cp();
    }
    bx(a) {
      this.effect.bx(a);
    }
    Cs(a) {
      this.effect.Cs(a);
    }
    Sf(a) {
      this.effect.Sf(a);
    }
    Re(a, b) {
      null == b && (b = !0);
      this.shape();
      var c = this.effect.Mg.gb;
      c = new Y(c.A, c.D, c.B, c.G);
      if (c.A >= c.B || c.D >= c.G || a == this) return c;
      b && (Ja.Xf(this.u), null == a || Ja.Fv(this.u, a.u) || Ja.Xf(a.u));
      return Ja.US(this.u, null == a ? this.u.bB() : a.u, c);
    }
    fl() {
      let a = this.Re(this);
      a.A >= a.B || a.D >= a.G
        ? this.af(0, 0)
        : this.af((a.A + a.B) / 2, (a.D + a.G) / 2);
    }
    Dn() {
      let a = this.Re(this);
      a.A >= a.B || a.D >= a.G
        ? this.Kg(0, 0)
        : this.Kg((a.A + a.B) / 2, (a.D + a.G) / 2);
    }
    ka() {
      let a = this.Re(this.kh());
      return a.B - a.A;
    }
    na() {
      throw 24;
    }
    lb() {
      throw 25;
    }
    ya() {
      return 404;
    }
  }
  na.i = !0;
  na.s = pb;
  Object.assign(na.prototype, { l: na });
  class Ph {
    constructor(a) {
      this.U = a;
      this.channels = 0;
      this.Ru = [];
      this.repeat = 0;
      this.easing = ua.XB();
    }
    x(a, b, c, d, e) {
      this.Gh(0, a, b, c, d, e);
      return this;
    }
    y(a, b, c, d, e) {
      this.Gh(1, a, b, c, d, e);
      return this;
    }
    lF(a, b) {
      this.Gh(0, a, 0.1, void 0, null);
      this.Gh(1, b, 0.1, void 0, null);
    }
    scale(a, b, c, d, e) {
      this.Gh(4, a, b, c, d, e);
      return this;
    }
    rotation(a, b, c, d, e) {
      this.Gh(5, a, b, c, d, e);
      return this;
    }
    alpha(a, b, c, d, e) {
      this.Gh(6, a, b, c, d, e);
      return this;
    }
    zS() {
      let a = this.U.u.controllers;
      for (; null != a; ) {
        let b = a.next;
        203 == a.type && a.stop();
        a = b;
      }
      this.channels = 0;
    }
    Gh(a, b, c, d, e, f) {
      let g;
      switch (a) {
        case 0:
          g = this.U.wa();
          break;
        case 1:
          g = this.U.Sa();
          break;
        case 2:
          g = this.U.Qa;
          break;
        case 3:
          g = this.U.ed;
          break;
        case 4:
          g = this.U.Qa;
          break;
        case 5:
          g = this.U.Yd;
          break;
        case 6:
          g = this.U.Sc;
      }
      let h = this.dv(a);
      h.Gh(a, g, b, c, null == d ? ua.XB() : d);
      h.wh = null == e ? 0 : e;
      this.Ru[a] = f;
      this.channels |= 1 << a;
    }
    dv(a) {
      let b,
        c = this.U.u.controllers;
      if (null != c)
        if (0 < (this.channels & (1 << a)))
          for (; null != c; ) {
            if (203 == c.type && ((b = c), b.key == a))
              return (b.sh = P(this, this.sh)), (b.Ag = P(this, this.Ag)), b;
            c = c.next;
          }
        else
          for (; null != c; ) {
            if (203 == c.type && c.nl)
              return (
                (b = c), (b.sh = P(this, this.sh)), (b.Ag = P(this, this.Ag)), b
              );
            c = c.next;
          }
      b = new me();
      b.sh = P(this, this.sh);
      b.Ag = P(this, this.Ag);
      this.U.u.eq(b);
      return b;
    }
    Ag(a, b) {
      let c = this.U;
      switch (a) {
        case 0:
          c.o(b);
          break;
        case 1:
          c.m(b);
          break;
        case 2:
          c.na(b);
          break;
        case 3:
          c.lb(b);
          break;
        case 4:
          c.H(b);
          break;
        case 5:
          c.la(b);
          break;
        case 6:
          c.W(b);
      }
    }
    sh(a) {
      let b = this.Ru[a];
      null != b && ((this.Ru[a] = null), b());
    }
  }
  Ph.i = !0;
  Object.assign(Ph.prototype, { l: Ph });
  class xd {}
  xd.i = !0;
  xd.Je = !0;
  Object.assign(xd.prototype, { l: xd });
  class cc {
    constructor(a) {
      let b = this;
      this.id = setInterval(function () {
        b.Fg();
      }, a);
    }
    stop() {
      null != this.id && (clearInterval(this.id), (this.id = null));
    }
    Fg() {}
    static delay(a, b) {
      let c = new cc(b);
      c.Fg = function () {
        c.stop();
        a();
      };
      return c;
    }
  }
  cc.i = !0;
  Object.assign(cc.prototype, { l: cc });
  class Ta {
    constructor(a) {
      this.length = a.byteLength;
      this.b = new Uint8Array(a);
      this.b.TL = a;
      a.hO = this;
      a.Wz = this.b;
    }
    yb(a, b, c) {
      if (0 > a || 0 > b || a + b > this.length) throw 12;
      null == c && (c = xe.Ot);
      let d = "",
        e = this.b,
        f = a;
      a += b;
      switch (c.Ut) {
        case 0:
          for (; f < a; )
            if (((c = e[f++]), 128 > c)) {
              if (0 == c) break;
              d += String.fromCodePoint(c);
            } else
              224 > c
                ? ((c = ((c & 63) << 6) | (e[f++] & 127)),
                  (d += String.fromCodePoint(c)))
                : 240 > c
                ? ((c =
                    ((c & 31) << 12) | ((e[f++] & 127) << 6) | (e[f++] & 127)),
                  (d += String.fromCodePoint(c)))
                : ((c =
                    ((c & 15) << 18) |
                    ((e[f++] & 127) << 12) |
                    ((e[f++] & 127) << 6) |
                    (e[f++] & 127)),
                  (d += String.fromCodePoint(c)));
          break;
        case 1:
          for (; f < a; )
            (c = e[f++] | (e[f++] << 8)), (d += String.fromCodePoint(c));
      }
      return d;
    }
    toString() {
      return this.yb(0, this.length);
    }
    static zC(a) {
      if (void 0 == xe.Qy) {
        for (
          var b = new Uint8Array(a.length << 1), c = 0, d = a.length;
          c < d;

        ) {
          let e = c++,
            f = a.charCodeAt(e);
          b[e << 1] = f & 255;
          b[(e << 1) | 1] = f >> 8;
        }
        return new Ta(b.buffer);
      }
      b = [];
      for (c = 0; c < a.length; )
        (d = a.charCodeAt(c++)),
          55296 <= d &&
            56319 >= d &&
            (d = ((d - 55232) << 10) | (a.charCodeAt(c++) & 1023)),
          127 >= d
            ? b.push(d)
            : (2047 >= d
                ? b.push(192 | (d >> 6))
                : (65535 >= d
                    ? b.push(224 | (d >> 12))
                    : (b.push(240 | (d >> 18)), b.push(128 | ((d >> 12) & 63))),
                  b.push(128 | ((d >> 6) & 63))),
              b.push(128 | (d & 63)));
      return new Ta(new Uint8Array(b).buffer);
    }
    static ek(a) {
      let b = a.hO;
      return null != b ? b : new Ta(a);
    }
  }
  Ta.i = !0;
  Object.assign(Ta.prototype, { l: Ta });
  var xe = (Qg["haxe.io.Encoding"] = {
    nz: !0,
    mz: null,
    Ot: { uz: "UTF8", Ut: 0, fn: "haxe.io.Encoding", toString: ya },
    Qy: { uz: "RawNative", Ut: 1, fn: "haxe.io.Encoding", toString: ya },
  });
  xe.mz = [xe.Ot, xe.Qy];
  class Mc {
    static encode(a, b) {
      null == b && (b = !0);
      let c = new Bg(Mc.ay).XM(a).toString();
      if (b)
        switch (a.length % 3) {
          case 1:
            c += "==";
            break;
          case 2:
            c += "=";
        }
      return c;
    }
    static decode(a, b) {
      null == b && (b = !0);
      if (b) for (; 61 == ta.yu(a, a.length - 1); ) a = ta.substr(a, 0, -1);
      return new Bg(Mc.ay).yM(Ta.zC(a));
    }
  }
  Mc.i = !0;
  class Bg {
    constructor(a) {
      let b = a.length,
        c = 1;
      for (; b > 1 << c; ) ++c;
      if (8 < c || b != 1 << c) throw 13;
      this.sj = a;
      this.mC = c;
    }
    XM(a) {
      let b = this.mC,
        c = this.sj,
        d = ((8 * a.length) / b) | 0,
        e = new Ta(new ArrayBuffer(d + (0 == (8 * a.length) % b ? 0 : 1))),
        f = 0,
        g = 0,
        h = (1 << b) - 1,
        m = 0,
        n = 0;
      for (; n < d; ) {
        for (; g < b; ) (g += 8), (f <<= 8), (f |= a.b[m++]);
        g -= b;
        e.b[n++] = c.b[(f >> g) & h];
      }
      0 < g && (e.b[n++] = c.b[(f << (b - g)) & h]);
      return e;
    }
    mO() {
      let a = [];
      for (var b = 0; 256 > b; ) a[b++] = -1;
      b = 0;
      let c = this.sj.length;
      for (; b < c; ) {
        let d = b++;
        a[this.sj.b[d]] = d;
      }
      this.BE = a;
    }
    yM(a) {
      let b = this.mC;
      null == this.BE && this.mO();
      let c = this.BE,
        d = (a.length * b) >> 3,
        e = new Ta(new ArrayBuffer(d)),
        f = 0,
        g = 0,
        h = 0,
        m = 0;
      for (; m < d; ) {
        for (; 8 > g; ) {
          g += b;
          f <<= b;
          let n = c[a.b[h++]];
          if (-1 == n) throw 14;
          f |= n;
        }
        g -= 8;
        e.b[m++] = (f >> g) & 255;
      }
      return e;
    }
  }
  Bg.i = !0;
  Object.assign(Bg.prototype, { l: Bg });
  class ib {
    constructor() {
      this.J = {};
    }
    get(a) {
      return this.J[a];
    }
    remove(a) {
      if (!this.J.hasOwnProperty(a)) return !1;
      delete this.J[a];
      return !0;
    }
    keys() {
      let a = [];
      for (var b in this.J) this.J.hasOwnProperty(b) && a.push(+b);
      return new Tc(a);
    }
    iterator() {
      return {
        ds: this.J,
        uo: this.keys(),
        eb: function () {
          return this.uo.eb();
        },
        next: function () {
          let a = this.uo.next();
          return this.ds[a];
        },
      };
    }
  }
  ib.i = !0;
  ib.Ib = [xd];
  Object.assign(ib.prototype, { l: ib });
  class Rf {
    constructor() {
      this.J = { Rk: {} };
    }
    set(a, b) {
      let c = a.jf;
      null == c && (c = a.jf = ma.tt++);
      this.J[c] = b;
      this.J.Rk[c] = a;
    }
    get(a) {
      return this.J[a.jf];
    }
    remove(a) {
      a = a.jf;
      if (null == this.J.Rk[a]) return !1;
      delete this.J[a];
      delete this.J.Rk[a];
      return !0;
    }
    keys() {
      let a = [];
      for (var b in this.J.Rk) this.J.hasOwnProperty(b) && a.push(this.J.Rk[b]);
      return new Tc(a);
    }
    iterator() {
      return {
        ds: this.J,
        uo: this.keys(),
        eb: function () {
          return this.uo.eb();
        },
        next: function () {
          let a = this.uo.next();
          return this.ds[a.jf];
        },
      };
    }
  }
  Rf.i = !0;
  Rf.Ib = [xd];
  Object.assign(Rf.prototype, { l: Rf });
  class vc {
    constructor() {
      this.J = Object.create(null);
    }
    get(a) {
      return this.J[a];
    }
    keys() {
      return new Qh(this.J);
    }
  }
  vc.i = !0;
  vc.Ib = [xd];
  Object.assign(vc.prototype, { l: vc });
  class Qh {
    constructor(a) {
      this.J = a;
      this.keys = Object.keys(a);
      this.length = this.keys.length;
      this.current = 0;
    }
    eb() {
      return this.current < this.length;
    }
    next() {
      return this.keys[this.current++];
    }
  }
  Qh.i = !0;
  Object.assign(Qh.prototype, { l: Qh });
  class Rh {
    constructor() {
      this.size = this.g = 0;
    }
    DL(a) {
      this.g == this.size && this.grow(1);
      this.view.setUint8(this.g++, a);
    }
    grow(a) {
      var b = this.g + a;
      for (a = 0 == this.size ? 16 : this.size; a < b; ) a = (3 * a) >> 1;
      b = new ArrayBuffer(a);
      let c = new Uint8Array(b);
      0 < this.size && c.set(this.XS);
      this.size = a;
      this.buffer = b;
      this.XS = c;
      this.view = new DataView(this.buffer);
    }
    Yn() {
      if (0 == this.size) return new Ta(new ArrayBuffer(0));
      let a = new Ta(this.buffer);
      a.length = this.g;
      return a;
    }
  }
  Rh.i = !0;
  Object.assign(Rh.prototype, { l: Rh });
  class Cg {
    ta() {
      throw 26;
    }
    sm(a, b, c) {
      let d = c,
        e = a.b;
      if (0 > b || 0 > c || b + c > a.length) throw 15;
      try {
        for (; 0 < d; ) (e[b] = this.ta()), ++b, --d;
      } catch (f) {
        if (!(haxe.Exception.uT(f).yT() instanceof haxe.vT.tT)) throw f;
      }
      return c - d;
    }
    ZQ(a, b) {
      for (var c = 0; 0 < b; ) {
        let d = this.sm(a, c, b);
        if (0 == d) throw 16;
        c += d;
        b -= d;
      }
    }
    jD() {
      let a = new Rh(),
        b;
      for (;;) {
        b = this.ta();
        if (0 == b) break;
        a.DL(b);
      }
      a.Yn();
    }
    YQ() {
      let a = this.Cg(),
        b = this.Cg();
      return this.fq ? yd.uB(b, a) : yd.uB(a, b);
    }
    kc() {
      var a = this.ta();
      let b = this.ta();
      a = this.fq ? b | (a << 8) : a | (b << 8);
      return 0 != (a & 32768) ? a - 65536 : a;
    }
    zd() {
      let a = this.ta(),
        b = this.ta();
      return this.fq ? b | (a << 8) : a | (b << 8);
    }
    iD() {
      let a = this.ta(),
        b = this.ta(),
        c = this.ta();
      return this.fq ? c | (b << 8) | (a << 16) : a | (b << 8) | (c << 16);
    }
    Cg() {
      let a = this.ta(),
        b = this.ta(),
        c = this.ta(),
        d = this.ta();
      return this.fq
        ? d | (c << 8) | (b << 16) | (a << 24)
        : a | (b << 8) | (c << 16) | (d << 24);
    }
    bs(a, b) {
      let c = new Ta(new ArrayBuffer(a));
      this.ZQ(c, a);
      return c.yb(0, a, b);
    }
  }
  Cg.i = !0;
  Object.assign(Cg.prototype, { l: Cg });
  class sc extends Cg {
    constructor(a, b, c) {
      super();
      null == b && (b = 0);
      null == c && (c = a.length - b);
      if (0 > b || 0 > c || b + c > a.length) throw 17;
      this.b = a.b;
      this.g = b;
      this.ME = this.Vj = c;
    }
    ta() {
      if (0 == this.Vj) throw 18;
      this.Vj--;
      return this.b[this.g++];
    }
    sm(a, b, c) {
      if (0 > b || 0 > c || b + c > a.length) throw 19;
      if (0 == this.Vj && 0 < c) throw 20;
      this.Vj < c && (c = this.Vj);
      let d = this.b;
      a = a.b;
      let e = 0,
        f = c;
      for (; e < f; ) {
        let g = e++;
        a[b + g] = d[this.g + g];
      }
      this.g += c;
      this.Vj -= c;
      return c;
    }
  }
  sc.i = !0;
  sc.s = Cg;
  Object.assign(sc.prototype, { l: sc });
  class yd {
    static uB(a, b) {
      yd.vv.setInt32(0, a, !0);
      yd.vv.setInt32(4, b, !0);
      return yd.vv.getFloat64(0, !0);
    }
  }
  yd.i = !0;
  class Tc {
    constructor(a) {
      this.current = 0;
      this.Gz = a;
    }
    eb() {
      return this.current < this.Gz.length;
    }
    next() {
      return this.Gz[this.current++];
    }
  }
  Tc.i = !0;
  Object.assign(Tc.prototype, { l: Tc });
  class Sh {
    constructor(a) {
      this.id = a;
      this.state = 0;
      this.gl = !1;
    }
    reset() {
      this.state = 0;
    }
    Nb() {
      return 1 == this.state;
    }
    qe() {
      return 3 == this.state;
    }
    to() {
      return 1 != this.state ? 2 == this.state : !0;
    }
    xk(a) {
      if (this.state != a)
        switch (((this.state = a), a)) {
          case 1:
            this.gl = !0;
            break;
          case 3:
            this.gl = !0;
        }
    }
    update() {
      switch (this.state) {
        case 1:
          this.gl ? (this.gl = !1) : (this.state = 2);
          break;
        case 3:
          this.gl ? (this.gl = !1) : (this.state = 0);
      }
    }
  }
  Sh.i = !0;
  Object.assign(Sh.prototype, { l: Sh });
  class tc {
    constructor() {
      this.state = null;
      this.enabled = !0;
    }
  }
  tc.i = !0;
  Object.assign(tc.prototype, { l: tc });
  class uc {
    constructor() {
      this.enabled = !0;
      this.buttons = [];
    }
    update(a) {
      let b = 0,
        c = this.buttons;
      for (; b < c.length; ) c[b++].update(a);
    }
    bM() {
      let a = 0,
        b = this.buttons;
      for (; a < b.length; ) b[a++].reset();
    }
    Nb(a) {
      if (!this.enabled) return !1;
      a = this.Xn(a);
      return null == a ? !1 : a.Nb();
    }
    qe(a) {
      if (!this.enabled) return !1;
      a = this.Xn(a);
      return null == a ? !1 : a.qe();
    }
    reset() {
      this.buttons = [];
    }
    Ni(a) {
      let b = this.Xn(a);
      null == b && ((b = new Sh(a)), this.buttons.push(b));
      b.xk(1);
    }
    release(a) {
      a = this.Xn(a);
      null != a && a.xk(3);
    }
    Xn(a) {
      let b = 0,
        c = this.buttons.length;
      for (; b < c; ) {
        let d = this.buttons[b];
        if (d.id == a) return d;
        ++b;
      }
      return null;
    }
  }
  uc.i = !0;
  Object.assign(uc.prototype, { l: uc });
  class ti {
    static Yu(a) {
      null == Pg && Lb();
      return Pg.J[a];
    }
  }
  class Ie extends tc {
    constructor(a) {
      super();
      this.target = null != a ? a : window.document;
      this.state = new Dg();
      this.Qb = new Kc();
      this.oj();
      this.RQ = [];
      this.event = null;
    }
    ev() {
      return 0;
    }
    MO(a) {
      if (this.enabled) {
        var b = ti.Yu(a.code);
        b == ti.Yu("") && (b = a.which);
        this.RQ[b] && a.preventDefault();
        a.repeat ||
          (this.state.Ni(b),
          (this.event = a),
          this.Qb.zc(0, [b]),
          (this.event = null));
      }
    }
    OO(a) {
      if (this.enabled) {
        var b = ti.Yu(a.code);
        this.state.release(b);
        this.event = a;
        this.Qb.zc(1, [b]);
        this.event = null;
      }
    }
    nT() {
      this.state.bM();
    }
    addListener(a, b, c) {
      this.target.addEventListener(a, b, c);
    }
    oj() {
      this.addListener("keydown", P(this, this.MO), !0);
      this.addListener("keyup", P(this, this.OO), !0);
      this.addListener("visibilitychange", P(this, this.nT), !1);
    }
  }
  Ie.i = !0;
  Ie.s = tc;
  Object.assign(Ie.prototype, { l: Ie });
  class Dg extends uc {
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
  Dg.i = !0;
  Dg.s = uc;
  Object.assign(Dg.prototype, { l: Dg });
  class He extends tc {
    constructor(a) {
      super();
      this.target = null != a ? a : window;
      this.state = new Eg();
      this.Qb = new Kc();
      this.oj();
    }
    ev() {
      return 1;
    }
    Fr(a) {
      if (this.enabled) {
        this.oe(a);
        switch (a.which) {
          case 1:
            this.state.Ni(0);
            break;
          case 2:
            this.state.Ni(1);
            break;
          case 3:
            this.state.Ni(2);
        }
        this.Qb.zc(0, [a.which - 1]);
      }
    }
    IP(a) {
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
        this.Qb.zc(1, [a.which - 1]);
      }
    }
    HP(a) {
      this.enabled &&
        (this.oe(a),
        (a = this.state.position),
        this.Qb.zc(2, [a.x, a.y]),
        (this.state.Ye[1] = !0));
    }
    GP() {
      this.enabled && ((this.state.left[1] = !0), this.Qb.zc(3));
    }
    FP() {
      this.enabled && ((this.state.Mq[1] = !0), this.Qb.zc(4));
    }
    Yf(a) {
      if (this.enabled) {
        var b = this.state;
        b.wheelDelta[1] += a.deltaY | 0;
        this.Qb.zc(5, [b.wheelDelta[1]]);
      }
    }
    oe(a) {
      let b = a.clientX,
        c = a.clientY;
      if (this.target instanceof Element) {
        var d = this.target.getBoundingClientRect();
        b -= d.left;
        c -= d.top;
      }
      d = window.devicePixelRatio;
      let e = this.state;
      e.ck[1].x += a.movementX;
      e.ck[1].y += a.movementY;
      a = e.position;
      a.x = (b * d) | 0;
      a.y = (c * d) | 0;
    }
    addListener(a, b, c) {
      this.target.addEventListener(a, b, c);
    }
    oj() {
      this.addListener("mousedown", P(this, this.Fr));
      this.addListener("mouseup", P(this, this.IP));
      this.addListener("mousemove", P(this, this.HP));
      this.addListener("mouseleave", P(this, this.GP));
      this.addListener("mouseenter", P(this, this.FP));
      this.addListener("wheel", P(this, this.Yf), { passive: !0 });
    }
  }
  He.i = !0;
  He.s = tc;
  Object.assign(He.prototype, { l: He });
  class Eg extends uc {
    constructor() {
      super();
      this.position = new Ka(0, 0);
      this.ck = [new Ka(0, 0), new Ka(0, 0)];
      this.wheelDelta = [0, 0];
      this.left = [!1, !1];
      this.Mq = [!1, !1];
      this.Ye = [!1, !1];
    }
    update(a) {
      super.update(a);
      this.Ye[0] = this.Ye[1];
      this.Ye[1] = !1;
      a = this.ck[0];
      let b = this.ck[1];
      a.x = b.x;
      a.y = b.y;
      a = this.ck[1];
      a.x = 0;
      a.y = 0;
      this.wheelDelta[0] = this.wheelDelta[1];
      this.wheelDelta[1] = 0;
      this.left[0] = this.left[1];
      this.left[1] = !1;
      this.Mq[0] = this.Mq[1];
      this.Mq[1] = !1;
    }
    UN() {
      return this.wheelDelta[0];
    }
    Nb(a) {
      return super.Nb(a);
    }
    qe(a) {
      return super.qe(a);
    }
  }
  Eg.i = !0;
  Eg.s = uc;
  Object.assign(Eg.prototype, { l: Eg });
  class Je extends tc {
    constructor(a) {
      super();
      this.target = null != a ? a : window;
      this.gC = 0;
      this.PD(1);
      this.state = new ac();
      this.Qb = new Kc();
      this.sC = 4;
      this.gw = 0;
      this.touches = {};
      window.document.body.style.setProperty("touch-action", "none");
      this.oj();
    }
    PD(a) {
      this.gC = Math.min(a, 5);
    }
    ev() {
      return 3;
    }
    TN(a) {
      return 4 > a ? 0 : a - 4;
    }
    LQ(a) {
      if (this.enabled)
        if ("mouse" == a.pointerType) {
          var b = a.button + 1;
          3 < b ||
            (this.oe(a, b),
            this.state.Ni(b),
            this.state.Ni(0),
            (a = this.state.position[b]),
            (b = this.state.position[0]),
            (b.x = a.x),
            (b.y = a.y));
        } else
          this.gw != this.gC &&
            ((b = this.sC++),
            (this.touches["" + a.pointerId] = b),
            this.oe(a, b),
            this.gw++,
            this.state.Ni(b),
            4 == b &&
              (this.state.Ni(0),
              (a = this.state.position[b]),
              (b = this.state.position[0]),
              (b.x = a.x),
              (b.y = a.y)));
    }
    VC(a) {
      a.stopPropagation();
      if (this.enabled)
        if ("mouse" == a.pointerType)
          (a = a.button + 1),
            3 < a || (this.state.release(a), this.state.release(0));
        else {
          var b = this.touches[a.pointerId];
          null != b &&
            (delete this.touches[a.pointerId],
            this.oe(a, b),
            this.state.release(b),
            0 == --this.gw &&
              ((this.sC = 4),
              this.state.release(0),
              (a = this.state.position[b]),
              (b = this.state.position[0]),
              (b.x = a.x),
              (b.y = a.y)));
        }
    }
    KQ(a) {
      this.VC(a);
    }
    MQ(a) {
      if (this.enabled)
        if ("mouse" == a.pointerType) this.oe(a, 0), (this.state.Ye[0][1] = !0);
        else {
          var b = this.touches[a.pointerId];
          null != b &&
            (this.oe(a, b),
            (this.state.Ye[b][1] = !0),
            4 == b &&
              ((this.state.Ye[0][1] = !0),
              (a = this.state.position[b]),
              (b = this.state.position[0]),
              (b.x = a.x),
              (b.y = a.y)));
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
      b.x = (c * d) | 0;
      b.y = (a * d) | 0;
    }
    addListener(a, b, c) {
      null == c && (c = !1);
      this.target.addEventListener(a, b, c);
      "pointerup" == a && window.addEventListener(a, b, c);
    }
    oj() {
      this.addListener("pointerdown", P(this, this.LQ));
      this.addListener("pointerup", P(this, this.VC));
      this.addListener("pointercancel", P(this, this.KQ));
      this.addListener("pointermove", P(this, this.MQ));
    }
  }
  Je.i = !0;
  Je.s = tc;
  Object.assign(Je.prototype, { l: Je });
  class ac extends uc {
    constructor() {
      super();
      for (var a = [], b = 0; 9 > b; ) ++b, a.push(new Ka(ac.Up, ac.Up));
      this.position = a;
      a = [];
      for (b = 0; 9 > b; ) ++b, a.push([!1, !1]);
      this.Ye = a;
      a = [];
      for (b = 0; 9 > b; ) ++b, a.push(0);
      this.hs = a;
    }
    update(a) {
      super.update(a);
      for (a = 0; 9 > a; ) {
        var b = a++;
        this.Ye[b][0] = this.Ye[b][1];
        this.Ye[b][1] = !1;
        var c = this.hs[b];
        switch (c) {
          case 1:
            this.hs[b] = 0;
            c = this.position[b];
            let d = ac.Up;
            c.x = d;
            c.y = d;
            4 == b &&
              ((b = this.position[0]), (c = ac.Up), (b.x = c), (b.y = c));
            break;
          case 2:
            this.hs[b] = c - 1;
        }
      }
    }
    gF(a) {
      return this.Ye[a][0];
    }
    Nb(a) {
      return super.Nb(a);
    }
    qe(a) {
      return super.qe(a);
    }
    to(a) {
      let b = this.Xn(a);
      return null == b ? !1 : this.Nb(a) ? !0 : b.to();
    }
    release(a) {
      super.release(a);
      4 <= a && (this.hs[a] = 2);
    }
  }
  ac.i = !0;
  ac.s = uc;
  Object.assign(ac.prototype, { l: ac });
  class Wa {
    static rN(a) {
      if (null == a) return null;
      if (a instanceof Array) return Array;
      let b = a.l;
      if (null != b) return b;
      a = Wa.pz(a);
      return null != a ? Wa.oL(a) : null;
    }
    static gn(a, b) {
      if (null == a) return "null";
      if (5 <= b.length) return "<...>";
      var c = typeof a;
      "function" == c && (a.i || a.nz) && (c = "object");
      switch (c) {
        case "function":
          return "<function>";
        case "object":
          if (a.fn) {
            var d = Qg[a.fn].mz[a.Ut];
            c = d.uz;
            if (d.nL) {
              b += "\t";
              var e = [],
                f = 0;
              for (d = d.nL; f < d.length; ) {
                let g = d[f];
                f += 1;
                e.push(Wa.gn(a[g], b));
              }
              return c + "(" + e.join(",") + ")";
            }
            return c;
          }
          if (a instanceof Array) {
            c = "[";
            b += "\t";
            e = 0;
            for (f = a.length; e < f; )
              (d = e++), (c += (0 < d ? "," : "") + Wa.gn(a[d], b));
            return c + "]";
          }
          try {
            e = a.toString;
          } catch (g) {
            return "???";
          }
          if (
            null != e &&
            e != Object.toString &&
            "function" == typeof e &&
            ((c = a.toString()), "[object Object]" != c)
          )
            return c;
          c = "{\n";
          b += "\t";
          e = null != a.hasOwnProperty;
          f = null;
          for (f in a)
            (e && !a.hasOwnProperty(f)) ||
              "prototype" == f ||
              "__class__" == f ||
              "__super__" == f ||
              "__interfaces__" == f ||
              "__properties__" == f ||
              (2 != c.length && (c += ", \n"),
              (c += b + f + " : " + Wa.gn(a[f], b)));
          b = b.substring(1);
          return c + ("\n" + b + "}");
        case "string":
          return a;
        default:
          return String(a);
      }
    }
    static oz(a, b) {
      for (;;) {
        if (null == a) return !1;
        if (a == b) return !0;
        let c = a.Ib;
        if (null != c && (null == a.s || a.s.Ib != c)) {
          let d = 0,
            e = c.length;
          for (; d < e; ) {
            let f = c[d++];
            if (f == b || Wa.oz(f, b)) return !0;
          }
        }
        a = a.s;
      }
    }
    static Rt(a, b) {
      if (null == b) return !1;
      switch (b) {
        case Array:
          return a instanceof Array;
        case Ij:
          return "boolean" == typeof a;
        case Jj:
          return null != a;
        case Kj:
          return "number" == typeof a;
        case Lj:
          return "number" == typeof a ? (a | 0) === a : !1;
        case String:
          return "string" == typeof a;
        default:
          if (null != a)
            if ("function" == typeof b) {
              if (Wa.lL(a, b)) return !0;
            } else {
              if ("object" == typeof b && Wa.mL(b) && a instanceof b) return !0;
            }
          else return !1;
          return (b == Mj && null != a.i) || (b == Nj && null != a.nz)
            ? !0
            : null != a.fn
            ? Qg[a.fn] == b
            : !1;
      }
    }
    static lL(a, b) {
      return a instanceof b ? !0 : b.Je ? Wa.oz(Wa.rN(a), b) : !1;
    }
    static pz(a) {
      a = Wa.pL.call(a).slice(8, -1);
      return "Object" == a || "Function" == a || "Math" == a || "JSON" == a
        ? null
        : a;
    }
    static mL(a) {
      return null != Wa.pz(a);
    }
    static oL(a) {
      return ma[a];
    }
  }
  Wa.i = !0;
  class ci {
    static XA() {
      try {
        let a = window.localStorage;
        a.getItem("");
        if (0 == a.length) {
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
  ci.i = !0;
  class Y {
    constructor(a, b, c, d) {
      this.A = a;
      this.D = b;
      this.B = c;
      this.G = d;
    }
    add(a) {
      a.A < this.A && (this.A = a.A);
      a.B > this.B && (this.B = a.B);
      a.D < this.D && (this.D = a.D);
      a.G > this.G && (this.G = a.G);
    }
    eu(a) {
      let b = a.x;
      b < this.A && (this.A = b);
      b > this.B && (this.B = b);
      a = a.y;
      a < this.D && (this.D = a);
      a > this.G && (this.G = a);
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
      } else (this.A *= a), (this.D *= a), (this.B *= a), (this.G *= a);
    }
    gi(a) {
      var b = this.B - this.A;
      let c = this.G - this.D;
      var d = b / a;
      let e = c / 1;
      if (d <= e)
        return (b = this.D + (c - d) / 2), new Y(this.A, b, this.B, b + d);
      d = a * e;
      b = this.A + (b - d) / 2;
      return new Y(b, this.D, b + d, this.G);
    }
  }
  Y.i = !0;
  Object.assign(Y.prototype, { l: Y });
  class Oh {
    constructor(a, b, c, d) {
      this.A = a;
      this.D = b;
      this.B = c;
      this.G = d;
    }
  }
  Oh.i = !0;
  Object.assign(Oh.prototype, { l: Oh });
  class Hj {
    static clone(a) {
      return new F(a.x, a.y, a.z, a.w);
    }
  }
  class ua {
    static XB() {
      return function (a) {
        return a;
      };
    }
    static Lc(a) {
      let b = (-100 > a ? -100 : 100 < a ? 100 : a) / 100;
      return function (c) {
        return 0 == b
          ? c
          : 0 > b
          ? c * (c * -b + 1 + b)
          : c * ((2 - c) * b + (1 - b));
      };
    }
    static sw() {
      return function (a) {
        return Math.pow(a, 2);
      };
    }
    static PQ() {
      return function (a) {
        return 1 > (a *= 2)
          ? 0.5 * Math.pow(a, 2)
          : 1 - 0.5 * Math.abs(Math.pow(2 - a, 2));
      };
    }
    static Kf() {
      return function (a) {
        return 1 - Math.pow(1 - a, 2);
      };
    }
    static iu(a) {
      null == a && (a = 0.1);
      let b = 17.0158 * a;
      return function (c) {
        --c;
        return c * c * ((b + 1) * c + b) + 1;
      };
    }
    static Pu(a, b) {
      null == b && (b = 0.3);
      null == a && (a = 0);
      let c, d;
      1 > a
        ? ((d = 1), (c = 0.25 * b))
        : ((d = a), (c = (b / ei) * Math.asin(1 / d)));
      return function (e) {
        return d * Math.pow(2, -10 * e) * Math.sin(((e - c) * ei) / b) + 1;
      };
    }
  }
  ua.i = !0;
  class Ka {
    constructor(a, b) {
      this.x = a;
      this.y = b;
    }
  }
  Ka.i = !0;
  Object.assign(Ka.prototype, { l: Ka });
  class $i {
    static IS(a, b, c, d) {
      return 0 <= a && a <= c && 0 <= b ? b <= d : !1;
    }
  }
  $i.i = !0;
  class oh {
    static wx(a, b, c, d, e) {
      a -= c;
      b -= d;
      return a * a + b * b < e * e;
    }
  }
  oh.i = !0;
  class Di {
    static test(a, b) {
      return a.A >= b.B
        ? !1
        : a.B <= b.A
        ? !1
        : a.D >= b.G
        ? !1
        : a.G <= b.D
        ? !1
        : !0;
    }
  }
  Di.i = !0;
  class Fg {
    constructor(a) {
      this.aS(a);
    }
    aS(a) {
      this.seed = a;
    }
    rm() {
      return 0.5 > this.fi();
    }
    vh(a, b) {
      a -= 0.4999;
      return Math.round(a + (b + 0.4999 - a) * this.fi());
    }
    Rn(a, b) {
      return a + (b - a) * this.fi();
    }
    vA(a) {
      return this.Rn(-a, a);
    }
    Ac() {
      return this.fi() - this.fi();
    }
  }
  Fg.i = !0;
  Object.assign(Fg.prototype, { l: Fg });
  class Gg extends Fg {
    constructor() {
      super(0);
    }
    fi() {
      return Math.random();
    }
  }
  Gg.i = !0;
  Gg.s = Fg;
  Object.assign(Gg.prototype, { l: Gg });
  class ef extends $c {
    constructor(a, b) {
      super(a, b);
    }
    ua() {
      super.ua();
      r.Tl = Ba.instance.createTexture(l.zt, 8);
      this.ca = new S();
      this.node.P(this.ca.u);
      let a = new y(null, r.Tl.children[0], "bubble"),
        b = (Math.min(this.fa.ka(), this.fa.ja()) / a.X.x) * 0.25;
      this.ca.H(b);
      this.ca.appendChild(a);
      a.C();
      this.text = new na(this.ca, r.Tl.children[1]);
      this.text.Pa("100%");
      this.text.rb(a.X.x, a.X.y);
      this.text.Eb(0, 0);
      this.text.Uf(!1);
      this.text.Pa("0%");
      this.text.o(-a.X.x / 2);
      this.text.m(-a.X.y / 2);
      this.text.lc(0.7 * this.text.Tq());
      this.Yj = this.wd = 0;
      this.qj = Math.random() * Eb * 2;
      this.rj = Math.random() * Eb * 2;
      this.Bk = 0.1 * Math.random() - 0.05;
      this.Ck = 0.1 * Math.random() - 0.05;
    }
    update(a) {
      super.update(a);
      this.time += a;
      this.ca.o(this.fa.ka() / 2);
      this.ca.m(this.fa.ja() / 2);
      var b = 50 * Math.cos(this.qj);
      a = 50 * Math.sin(this.rj);
      this.qj += this.Bk;
      this.rj += this.Ck;
      let c = this.ca;
      c.o(c.wa() + b);
      b = this.ca;
      b.m(b.Sa() + a);
      switch (this.Yj) {
        case 0:
          this.wd < this.Yq() &&
            ((this.wd += 5), 100 < this.wd && (this.wd = 100));
          this.text.Pa("" + this.wd + "%");
          this.Ul.pv() && 100 == this.wd && (this.Yj++, (this.time = 0));
          break;
        case 1:
          0.5 > this.time
            ? ((this.Bk *= 0.95), (this.Ck *= 0.95))
            : (this.Yj++, super.Yw());
      }
    }
    Yw() {}
    bc() {
      return 0.25;
    }
    Ga() {
      return "LoadingOverlay";
    }
  }
  ef.i = !0;
  ef.s = $c;
  Object.assign(ef.prototype, { l: ef });
  class Id extends da {
    constructor() {
      super();
      this.state = 0;
    }
    Jr() {
      super.Jr();
      let a = this.parent;
      this.Uc = new y(a.qa, r.Wa, k.cL);
      this.Uc.C();
      this.Uc.o(378);
      this.Uc.m(364);
      this.Uc.W(0);
      this.Af = new y(a.qa, r.Wa, k.dL);
      this.Af.o(368);
      this.Af.m(354);
      this.Af.W(0);
    }
    update(a) {
      super.update(a);
      this.Uc.H(Ua(Math.sin(10 * this.time), -1, 1, 1, 1.1));
      a = this.parent;
      switch (this.state) {
        case 0:
          if (1 > this.time) break;
          this.time = 0;
          this.state = 1;
          break;
        case 1:
          a = this.jb(0.5);
          this.Uc.W(a);
          this.Af.W(a);
          this.Af.o(428 + -60 * ua.Kf()(a));
          this.Af.m(414 + -60 * ua.Kf()(a));
          1 == a && ((this.time = 0), (this.state = 2));
          break;
        case 2:
          var b = this.jb(0.25);
          this.Af.H(Ua(b, 0, 1, 1, 0.9));
          1 == b &&
            ((this.time = 0),
            (this.state = 3),
            a.I.Fb(a.I.qf == k.ez ? k.dz : k.ez),
            a.aC());
          break;
        case 3:
          b = this.jb(0.5);
          this.Af.H(Ua(ua.Kf()(b), 0, 1, 0.9, 1));
          1 == b && ((this.time = 0), (this.state = a.I.qf == k.dz ? 5 : 4));
          break;
        case 4:
          1 < this.time && ((this.time = 0), (this.state = 2));
          break;
        case 5:
          (a = this.jb(0.5)),
            this.Uc.W(1 - a),
            this.Af.W(1 - a),
            this.Af.o(368 + 60 * ua.sw()(a)),
            this.Af.m(354 + 60 * ua.sw()(a)),
            1 == a && this.ra();
      }
    }
  }
  Id.i = !0;
  Id.s = da;
  Object.assign(Id.prototype, { l: Id });
  class Ld extends ca {
    constructor() {
      super();
    }
    ua() {
      super.ua();
      this.Wd = new S();
      var a = new y(this.Wd, r.Wa, k.hz),
        b = new y(this.Wd, r.Wa, k.bL),
        c = new y(this.Wd, r.Wa, k.YK);
      b.hx(500);
      b.m(a.X.y - 1);
      c.m(b.Sa() + 500 - 1);
      this.Wd.C();
      a = za.create(null, k.ZK, k.$K, k.aL);
      this.buttons.push(a);
      a.o(680);
      a.m(-20);
      this.Wd.appendChild(a.j);
      this.oa(a);
      b = new na(this.Wd, r.ic);
      b.Pa(Db.get("CANT_UNLOCK_TEXT1"));
      b.o(20);
      b.m(60);
      b.Eb(0);
      b.rb(760, 100);
      b.lc(80);
      a = new na(this.Wd, r.ic);
      a.Pa(Da.Dd(this.caller.Ta.starCount));
      a.o(20);
      a.m(b.Sa() + 90);
      a.Eb(0);
      a.rb(760, 100);
      a.lc(80);
      b = new y(this.Wd, r.Wa, k.Nt);
      c = a.Re();
      b.H(0.8);
      b.o(c.B);
      b.m((c.D + c.G) / 2 - b.ja() / 2);
      b = new na(this.Wd, r.ic);
      b.Pa(Db.get("CANT_UNLOCK_TEXT2"));
      b.o(20);
      b.m(a.Sa() + 90);
      b.Eb(0);
      b.rb(760, 100);
      b.lc(80);
      a = new na(this.Wd, r.ii);
      a.Pa(Db.get("CANT_UNLOCK_TEXT3"));
      a.o(20);
      a.m(b.Sa() + 90 + 40);
      a.Eb(0);
      a.Sf(!0);
      a.rb(760, 140);
      a.lc(60);
      this.node.P(this.Wd.u);
    }
    bc() {
      return 0.5;
    }
    ad(a) {
      a = ua.Kf()(1 - a);
      let b = this.node.Db;
      b.scale.x = b.scale.y = 0.001 + a;
      b.K = (b.K & -2) | 500;
    }
    Td(a) {
      a = ua.Pu(0.5, 0.5)(a);
      let b = this.node.Db;
      b.scale.x = b.scale.y = 0.001 + a;
      b.K = (b.K & -2) | 500;
    }
    Od() {
      this.O.jh().Nb(461) && this.Jf();
      this.hb(1) && this.Jf();
    }
    qb() {
      super.qb();
      let a = this.fa.Xq().gi(1);
      var b = this.node.Db;
      b.translate.x = (a.A + a.B) / 2;
      b.translate.y = (a.D + a.G) / 2;
      b.K = (b.K & -2) | 496;
      if (1 < this.fa.Se())
        this.Wd.H(1), (b = this.Wd.ja()), this.Wd.H(((a.G - a.D) / b) * 0.75);
      else {
        b = 1.1;
        let c = 1 / this.fa.Se();
        1 > c && (b = 1.1 * c);
        this.Wd.H((a.B - a.A) / (r.Wa.hc.xf(k.hz).ec.x * b));
      }
    }
    wi() {
      return !1;
    }
    Ga() {
      return "MissingStarsPopup";
    }
  }
  Ld.i = !0;
  Ld.s = ca;
  Object.assign(Ld.prototype, { l: Ld });
  class Od extends Bc {
    constructor() {
      super();
    }
    wi() {
      return !1;
    }
    getData() {
      let a = l.data.J[l.lz];
      return null != a ? a : l.data.J[l.kz];
    }
    jc() {
      return [1 < this.O.window.Wn() ? l.kz : l.lz];
    }
    FC() {
      this.Jf();
    }
    Ga() {
      return "OutroVideoScene";
    }
  }
  Od.i = !0;
  Od.s = Bc;
  Object.assign(Od.prototype, { l: Od });
  class fd extends ca {
    constructor() {
      super();
    }
    jc() {
      let a = [l.Gt];
      a.push(
        [
          27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11,
          10, 9, 8, 7,
        ][this.Vq() - 1]
      );
      return a;
    }
    Td() {}
    ad() {}
    bc() {
      return 0;
    }
    wi() {
      return !1;
    }
    ua() {
      super.ua();
      var a = this.Vq();
      this.ol = new gc(null, new F(0, 0, 0, 1));
      this.ol.W(0);
      this.node.P(this.ol.u);
      var b = this.caller.Ta.ui,
        c = b ? 1350 : 1200;
      this.Ke(800, c);
      this.j = new S(null, this.qa);
      this.j.o(400);
      this.j.m(c / 2);
      this.j.H(0);
      this.j.M(!1);
      c = this.createTexture(l.Gt);
      new y(this.j, c).C();
      this.caller.Ta.available
        ? ((this.EE = [
            27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11,
            10, 9, 8, 7,
          ][a - 1]),
          (a = new y(this.j, this.createTexture(this.EE))),
          a.C(),
          a.o(-1),
          a.m(-14))
        : ((c = gd.jv(a)),
          (a = this.pN(a)),
          (a = this.yb("COMPLETE_BOXNAME", null == c ? "null" : "" + c, a)),
          (c = new na(this.j, r.ii)),
          c.rb(400, 400),
          c.Sf(!0),
          c.lc(50),
          c.Pa(a),
          c.Eb(0),
          c.o(-200),
          c.m(-100));
      b &&
        ((b = Ob.jl(this.yb("COLLECT_DRAWING"))),
        b.j.H(1.25),
        this.j.appendChild(b.j),
        b.o(-293.75),
        b.m(500),
        this.buttons.push(b),
        this.oa(b),
        b.focus(),
        (b = new y(this.j, r.Wa, k.fK)),
        b.C(),
        b.o(0),
        b.m(-570),
        (b = this.yb("DRAWING_FOUND")),
        (a = new na(this.j, r.ic)),
        a.rb(600, 160),
        a.lc(80),
        a.Pa(b),
        a.Eb(0),
        a.o(-300),
        a.m(-615));
      this.time = this.state = 0;
    }
    Mc() {
      super.Mc();
      this.ia(l.Gt);
      this.ia(this.EE);
    }
    Od(a) {
      super.Od(a);
      1 == this.state && this.hb(1) && ((this.state = 2), (this.time = 0));
    }
    fb() {
      super.fb();
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 0:
          a = this.jb(0.5);
          this.j.H(ua.iu()(a));
          this.j.M(!0);
          this.ol.W(0.4 * a);
          1 == a && (this.state = 1);
          break;
        case 1:
          if (this.caller.Ta.ui) break;
          this.O.hd().Nb(0) && ((this.state = 2), (this.time = 0));
          break;
        case 2:
          (a = this.jb(0.25)),
            this.j.H(1 - ua.Kf()(a)),
            this.ol.W(0.4 * (1 - a)),
            1 == a && ((this.state = 3), this.Jf());
      }
    }
    Vq() {
      let a = this.caller.Ta.pictureIndex;
      null == a && (a = gd.Vq(D.box, D.level));
      return a;
    }
    pN(a) {
      return 17 >= a ? this.yb("BOX1_LABEL") : this.yb("BOX2_LABEL");
    }
    Ga() {
      return "PicturePopup";
    }
  }
  fd.i = !0;
  fd.s = ca;
  Object.assign(fd.prototype, { l: fd });
  class mf extends da {
    constructor(a, b, c, d) {
      super();
      this.j = a;
      this.min = b;
      this.max = c;
      this.offsetX = d;
      this.pt = this.ng = this.lg = this.sk = 0;
      this.Mn = 0.03;
      this.wn = this.xn = !1;
      this.To = this.Uo = 0;
      this.Nv = this.kl = aj;
    }
    update() {
      var a = this.O.hd();
      let b = this.O.YN().UN();
      0 != b
        ? ((this.ng += -10 * (0 < b ? 1 : 0 > b ? -1 : 0)),
          (this.Mn = 0.05),
          (this.wn = this.xn = !1))
        : a.Nb(0)
        ? ((this.lg = 0),
          (this.Lu = this.Nv = this.kl = a.position[0].x),
          (this.ng = this.pt = 0),
          (this.wn = this.xn = !1),
          (this.Mn = 0.03),
          (this.time = 0))
        : a.qe(0)
        ? ((this.sk += this.lg), (this.lg = 0), (this.ng = this.kl - this.Nv))
        : (a.to(0)
            ? ((this.Nv = this.kl),
              (this.kl = a.position[0].x),
              (this.lg = this.kl - this.Lu))
            : (this.xn
                ? 0.001 > this.Uo * this.Uo
                  ? (this.xn = !1)
                  : (this.ng += 0.1 * this.Uo)
                : this.wn
                ? 0.001 > this.To * this.To
                  ? (this.wn = !1)
                  : (this.ng -= 0.1 * this.To)
                : 0 > this.Uo
                ? ((this.xn = !0), (this.Mn = 0.3))
                : 0 > this.To && ((this.wn = !0), (this.Mn = 0.3)),
              (this.pt = (this.pt + this.ng) * (1 - this.Mn)),
              (this.ng = 0),
              (this.sk += this.pt)),
          (a = this.offsetX + (this.sk + this.lg)),
          this.j.o(a),
          (this.Uo = this.offsetX - a),
          (this.To = this.max + a - this.offsetX));
    }
  }
  mf.i = !0;
  mf.s = da;
  Object.assign(mf.prototype, { l: mf });
  class hf extends da {
    constructor() {
      super();
      this.j = new S();
      this.wb = [];
      this.Ip = [];
      this.Yk = [];
      let a = 0;
      for (; 10 > a; ) {
        let c = a++;
        var b = X.Rn(-Eb / 2 - Eb / 4, -Eb / 2 + Eb / 4);
        this.Ip[c] = new F(10 * Math.cos(b), 10 * Math.sin(b), 0, 1);
        b = this.wb[c] = new y(this.j, r.Yb, [k.TI, k.UI, k.VI][X.vh(0, 2)]);
        b.C();
        b.H(X.Rn(0.75, 2));
        b.la(360 * Math.random());
        this.Yk[c] = X.vA(10);
      }
    }
    ra() {
      super.ra();
      this.j.F();
      this.wb = null;
    }
    update(a) {
      super.update(a);
      let b = (a = 0);
      for (; 10 > b; ) {
        let c = b++;
        this.Ip[c].y += 0.25;
        let d = this.wb[c];
        d.o(d.wa() + this.Ip[c].x);
        d.m(d.Sa() + this.Ip[c].y);
        d.la(d.Yd + this.Yk[c]);
        3 < this.time && (d.W(0.95 * d.Sc), 0.05 > d.Sc && ++a);
      }
      10 == a && this.ra();
    }
  }
  hf.i = !0;
  hf.s = da;
  Object.assign(hf.prototype, { l: hf });
  class Pc extends da {
    constructor() {
      super();
      this.ec = null;
      this.focused = !1;
      this.je = 0;
      this.j = new S();
    }
    Tw() {}
    setActive(a) {
      this.active = a;
    }
    select() {
      this.Ad(!0);
    }
    focus() {
      this.focused = !0;
    }
    blur() {
      this.focused = !1;
    }
    Ad(a) {
      this.JO = a;
    }
    wa() {
      return this.j.wa();
    }
    o(a) {
      this.j.o(a);
      return a;
    }
    Sa() {
      return this.j.Sa();
    }
    m(a) {
      this.j.m(a);
    }
    lp(a) {
      this.j.o(a - this.j.ka());
    }
    ja() {
      return this.j.ja();
    }
    pi() {
      return this.j.pi();
    }
    M(a) {
      this.j.M(a);
    }
  }
  Pc.i = !0;
  Pc.s = da;
  Object.assign(Pc.prototype, { l: Pc });
  class Dc extends Pc {
    constructor(a) {
      super();
      this.Bi = a;
      this.j = new S();
      this.icon = new y(this.j, r.Wa, k.GK);
      this.gO = new gf(this.j.node, new Y(20, 10, 170, 160));
    }
    focus() {}
    blur() {
      super.blur();
      this.icon.Fb(k.Tp);
    }
    TR(a, b) {
      this.icon.Fb(k.Tp);
      let c = new na(this.j, r.ic);
      c.rb(this.icon.ka(), this.icon.ja());
      c.Pa(Da.Dd(this.Bi));
      c.Eb(0, 0);
      c.lc(0.5 * this.icon.ja());
      c.m(c.Sa() - 20);
      new y(this.j, r.Wa, Dc.rE[a]);
      b && new y(this.j, r.Wa, Dc.rE[4]);
    }
    Ub(a) {
      return this.icon.qf == k.Tp || this.focused ? this.gO.Ub(a) : !1;
    }
  }
  Dc.i = !0;
  Dc.s = Pc;
  Object.assign(Dc.prototype, { l: Dc });
  class Th {
    constructor(a, b, c) {
      this.zj = a;
      this.xh = b;
      this.type = c;
    }
  }
  Th.i = !0;
  Object.assign(Th.prototype, { l: Th });
  class Hg {
    constructor() {
      this.On = !1;
      this.Lg(1);
      this.ns();
    }
    Lg(a) {
      this.weight = a;
      this.rr = 1 / a;
      this.Kb = new t(0, $a.oy * a);
    }
    ns() {
      this.sb = t.sc();
      this.a = t.sc();
      this.g = t.sc();
      this.xd = t.sc();
      this.$s = t.sc();
    }
    Uh(a, b) {
      a.KO() || this.g.add(t.Ob(a, b / 1));
    }
  }
  Hg.i = !0;
  Object.assign(Hg.prototype, { l: Hg });
  class Ib extends Hg {
    constructor() {
      super();
      this.ha = new t(zd, zd);
      this.th = new t(-1, -1);
      this.hg = [];
      this.$s = t.sc();
      this.ns();
    }
    ns() {
      super.ns();
      this.ha = new t(zd, zd);
      this.ha.x = zd;
      this.ha.y = zd;
      this.pD();
    }
    pD() {
      this.hg = [];
    }
    Wk(a, b, c) {
      this.hg.push(new Th(a, b, c));
    }
    eR(a) {
      this.hg.splice(a, 1);
    }
    cO(a) {
      let b = this.hg,
        c = b.length,
        d = 0;
      for (; d < c; ) if (b[d++].zj == a) return !0;
      return !1;
    }
    oq(a, b) {
      let c = this.hg,
        d = c.length,
        e = 0;
      for (; e < d; ) {
        let f = c[e++];
        if (f.zj == a) {
          f.xh = b;
          break;
        }
      }
    }
    fA(a, b, c) {
      let d = this.hg,
        e = d.length,
        f = 0;
      for (; f < e; ) {
        let g = d[f++];
        if (g.zj == a) {
          g.zj = b;
          g.xh = c;
          break;
        }
      }
    }
    xh(a) {
      let b = this.hg,
        c = b.length,
        d = 0;
      for (; d < c; ) {
        let e = b[d++];
        if (e.zj == a) return e.xh;
      }
      return -1;
    }
    update(a) {
      if (0 != a) {
        var b = this.$s,
          c = $a.current;
        this.On
          ? ((b.x = 0), (b.y = 0))
          : 0 != c.y || 0 != c.x
          ? ((b.x = c.x), (b.y = c.y))
          : ((b.x = this.Kb.x * this.rr), (b.y = this.Kb.y * this.rr));
        b = (a / 1) * a;
        this.a.x = this.$s.x * b;
        this.a.y = this.$s.y * b;
        this.ha.x == zd && ((this.ha.x = this.g.x), (this.ha.y = this.g.y));
        this.xd.x = this.g.x - this.ha.x + this.a.x;
        this.xd.y = this.g.y - this.ha.y + this.a.y;
        0 < a &&
          ((a = 1 / a),
          (this.sb.x = this.xd.x * a),
          (this.sb.y = this.xd.y * a));
        this.ha.x = this.g.x;
        this.ha.y = this.g.y;
        this.g.x += this.xd.x;
        this.g.y += this.xd.y;
      }
    }
    us() {
      var a = this.th;
      let b = this.g,
        c = this.rr;
      let d,
        e = 0,
        f = 0;
      if (-1 != a.x) (b.x = a.x), (b.y = a.y);
      else {
        a = this.hg;
        for (var g = a.length, h = 0; h < g; ) {
          var m = a[h++],
            n = m.zj;
          let u = n.g;
          var q = u.x - b.x;
          d = u.y - b.y;
          0 == q && 0 == d && (d = q = 1);
          var p = Math.sqrt(q * q + d * d),
            v = m.xh;
          m = m.type;
          if (1 == m) {
            if (p <= v) continue;
          } else if (2 == m && p >= v) continue;
          m = -1 == n.th.x;
          n = n.rr;
          p = (p - v) / ((1 < p ? p : 1) * (c + n));
          m && ((e = q), (f = d));
          v = c * p;
          q *= v;
          d *= v;
          b.x += q;
          b.y += d;
          m && ((q = n * p), (u.x -= e * q), (u.y -= f * q));
        }
      }
    }
  }
  Ib.i = !0;
  Ib.s = Hg;
  Object.assign(Ib.prototype, { l: Ib });
  class $a {
    static toggle() {
      $a.current.y = -$a.current.y;
    }
    static EO() {
      return $a.current.y == $a.oy ? 0 == $a.current.x : !1;
    }
    static reset() {
      $a.current.x = 0;
      $a.current.y = $a.yt;
    }
  }
  $a.i = !0;
  class Vc {
    constructor() {
      this.iC = this.fC = 0;
      this.Vl = [];
      this.yd = new rf();
      this.version = null;
      this.yC = this.dw = 0;
      this.Po = 1;
    }
    load(a) {
      if (this.KB(a) || this.Iv(a) || this.Qj(a)) return !1;
      this.dw++;
      a = new Ig(a, this);
      a.priority = this.iC--;
      if (this.Vl.length == this.Po) return this.yd.enqueue(a), !0;
      this.Vl.push(a);
      a.load();
      return !0;
    }
    stop() {
      this.yd.clear();
    }
    SQ(a) {
      if (this.KB(a) && !this.Iv(a) && !this.Qj(a)) {
        var b = Ma.find(this.yd, function (c) {
          return -1 < c.Ik.url.indexOf(a);
        });
        null != b && this.yd.jR(b, ++this.fC);
      }
    }
    bo(a) {
      if (0 == this.dw) return 1;
      if (null == a) return this.yC / this.dw;
      let b = this;
      return (
        Ma.count(a, function (c) {
          return b.Iv(c);
        }) / a.length
      );
    }
    KB(a) {
      function b(c) {
        return -1 < c.Ik.url.indexOf(a);
      }
      return null == this.yd
        ? !1
        : 0 < Ma.count(this.yd, b) + Ma.count(this.Vl, b);
    }
    eQ(a) {
      ta.remove(this.Vl, a);
      this.yC++;
      0 == this.yd.aa && 0 == this.Vl.length && (this.iC = this.fC = 0);
      let b = l.pg(a.Ik.url);
      0 <= b && l.setData(b, a.Ik.data);
      0 < this.yd.aa && ((a = this.yd.CM()), this.Vl.push(a), a.load());
    }
    dQ() {
      this.stop();
    }
    Iv(a) {
      return l.ob(l.pg(a));
    }
    Qj(a) {
      return l.Qj(l.pg(a));
    }
  }
  Vc.i = !0;
  Object.assign(Vc.prototype, { l: Vc });
  class Ig {
    constructor(a, b) {
      this.Ik = new Uh(a, b.version);
      this.yd = b;
    }
    load() {
      let a = this;
      this.Ik.load(
        function () {
          Vc.Xz += l.qN(a.Ik.url);
          a.yd.eQ(a);
          a.F();
        },
        function () {
          a.yd.dQ();
          a.F();
        }
      );
    }
    F() {
      this.yd = null;
      this.Ik.F();
    }
  }
  Ig.i = !0;
  Ig.Ib = [qf];
  Object.assign(Ig.prototype, { l: Ig });
  class Ad {
    static encode(a) {
      var b = a.length;
      let c = [1732584193, -271733879, -1732584194, 271733878],
        d = 64,
        e = a.length;
      for (var f = []; d <= e; ) {
        var g = a.substring(d - 64, d);
        let h = 0;
        for (; 64 > h; )
          (f[h >> 2] =
            g.charCodeAt(h) +
            (g.charCodeAt(h + 1) << 8) +
            (g.charCodeAt(h + 2) << 16) +
            (g.charCodeAt(h + 3) << 24)),
            (h += 4);
        Ad.$v(c, f);
        d += 64;
      }
      a = a.substring(d - 64);
      f = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      d = 0;
      for (e = a.length; d < e; )
        (f[d >> 2] |= a.charCodeAt(d) << (d % 4 << 3)), ++d;
      f[d >> 2] |= 128 << (d % 4 << 3);
      if (55 < d) for (Ad.$v(c, f), d = 0; 16 > d; ) (f[d] = 0), ++d;
      f[14] = 8 * b;
      Ad.$v(c, f);
      b = Ad.qG;
      f = "";
      d = 0;
      for (e = c.length; d < e; )
        for (a = 0, g = c[d++]; 4 > a; )
          (f += b[(g >> ((a << 3) + 4)) & 15] + b[(g >> (a << 3)) & 15]), ++a;
      return f;
    }
    static $v(a, b) {
      let c = a[0],
        d = a[1],
        e = a[2],
        f = a[3],
        g =
          (((c + ((d & e) | (~d & f))) & -1) + ((b[0] + -680876936) & -1)) & -1;
      c = (((g << 7) | (g >>> 25)) + d) & -1;
      g = (((f + ((c & d) | (~c & e))) & -1) + ((b[1] + -389564586) & -1)) & -1;
      f = (((g << 12) | (g >>> 20)) + c) & -1;
      g = (((e + ((f & c) | (~f & d))) & -1) + ((b[2] + 606105819) & -1)) & -1;
      e = (((g << 17) | (g >>> 15)) + f) & -1;
      g =
        (((d + ((e & f) | (~e & c))) & -1) + ((b[3] + -1044525330) & -1)) & -1;
      d = (((g << 22) | (g >>> 10)) + e) & -1;
      g = (((c + ((d & e) | (~d & f))) & -1) + ((b[4] + -176418897) & -1)) & -1;
      c = (((g << 7) | (g >>> 25)) + d) & -1;
      g = (((f + ((c & d) | (~c & e))) & -1) + ((b[5] + 1200080426) & -1)) & -1;
      f = (((g << 12) | (g >>> 20)) + c) & -1;
      g =
        (((e + ((f & c) | (~f & d))) & -1) + ((b[6] + -1473231341) & -1)) & -1;
      e = (((g << 17) | (g >>> 15)) + f) & -1;
      g = (((d + ((e & f) | (~e & c))) & -1) + ((b[7] + -45705983) & -1)) & -1;
      d = (((g << 22) | (g >>> 10)) + e) & -1;
      g = (((c + ((d & e) | (~d & f))) & -1) + ((b[8] + 1770035416) & -1)) & -1;
      c = (((g << 7) | (g >>> 25)) + d) & -1;
      g =
        (((f + ((c & d) | (~c & e))) & -1) + ((b[9] + -1958414417) & -1)) & -1;
      f = (((g << 12) | (g >>> 20)) + c) & -1;
      g = (((e + ((f & c) | (~f & d))) & -1) + ((b[10] + -42063) & -1)) & -1;
      e = (((g << 17) | (g >>> 15)) + f) & -1;
      g =
        (((d + ((e & f) | (~e & c))) & -1) + ((b[11] + -1990404162) & -1)) & -1;
      d = (((g << 22) | (g >>> 10)) + e) & -1;
      g =
        (((c + ((d & e) | (~d & f))) & -1) + ((b[12] + 1804603682) & -1)) & -1;
      c = (((g << 7) | (g >>> 25)) + d) & -1;
      g = (((f + ((c & d) | (~c & e))) & -1) + ((b[13] + -40341101) & -1)) & -1;
      f = (((g << 12) | (g >>> 20)) + c) & -1;
      g =
        (((e + ((f & c) | (~f & d))) & -1) + ((b[14] + -1502002290) & -1)) & -1;
      e = (((g << 17) | (g >>> 15)) + f) & -1;
      g =
        (((d + ((e & f) | (~e & c))) & -1) + ((b[15] + 1236535329) & -1)) & -1;
      d = (((g << 22) | (g >>> 10)) + e) & -1;
      g = (((c + ((d & f) | (e & ~f))) & -1) + ((b[1] + -165796510) & -1)) & -1;
      c = (((g << 5) | (g >>> 27)) + d) & -1;
      g =
        (((f + ((c & e) | (d & ~e))) & -1) + ((b[6] + -1069501632) & -1)) & -1;
      f = (((g << 9) | (g >>> 23)) + c) & -1;
      g = (((e + ((f & d) | (c & ~d))) & -1) + ((b[11] + 643717713) & -1)) & -1;
      e = (((g << 14) | (g >>> 18)) + f) & -1;
      g = (((d + ((e & c) | (f & ~c))) & -1) + ((b[0] + -373897302) & -1)) & -1;
      d = (((g << 20) | (g >>> 12)) + e) & -1;
      g = (((c + ((d & f) | (e & ~f))) & -1) + ((b[5] + -701558691) & -1)) & -1;
      c = (((g << 5) | (g >>> 27)) + d) & -1;
      g = (((f + ((c & e) | (d & ~e))) & -1) + ((b[10] + 38016083) & -1)) & -1;
      f = (((g << 9) | (g >>> 23)) + c) & -1;
      g =
        (((e + ((f & d) | (c & ~d))) & -1) + ((b[15] + -660478335) & -1)) & -1;
      e = (((g << 14) | (g >>> 18)) + f) & -1;
      g = (((d + ((e & c) | (f & ~c))) & -1) + ((b[4] + -405537848) & -1)) & -1;
      d = (((g << 20) | (g >>> 12)) + e) & -1;
      g = (((c + ((d & f) | (e & ~f))) & -1) + ((b[9] + 568446438) & -1)) & -1;
      c = (((g << 5) | (g >>> 27)) + d) & -1;
      g =
        (((f + ((c & e) | (d & ~e))) & -1) + ((b[14] + -1019803690) & -1)) & -1;
      f = (((g << 9) | (g >>> 23)) + c) & -1;
      g = (((e + ((f & d) | (c & ~d))) & -1) + ((b[3] + -187363961) & -1)) & -1;
      e = (((g << 14) | (g >>> 18)) + f) & -1;
      g = (((d + ((e & c) | (f & ~c))) & -1) + ((b[8] + 1163531501) & -1)) & -1;
      d = (((g << 20) | (g >>> 12)) + e) & -1;
      g =
        (((c + ((d & f) | (e & ~f))) & -1) + ((b[13] + -1444681467) & -1)) & -1;
      c = (((g << 5) | (g >>> 27)) + d) & -1;
      g = (((f + ((c & e) | (d & ~e))) & -1) + ((b[2] + -51403784) & -1)) & -1;
      f = (((g << 9) | (g >>> 23)) + c) & -1;
      g = (((e + ((f & d) | (c & ~d))) & -1) + ((b[7] + 1735328473) & -1)) & -1;
      e = (((g << 14) | (g >>> 18)) + f) & -1;
      g =
        (((d + ((e & c) | (f & ~c))) & -1) + ((b[12] + -1926607734) & -1)) & -1;
      d = (((g << 20) | (g >>> 12)) + e) & -1;
      g = (((c + (d ^ e ^ f)) & -1) + ((b[5] + -378558) & -1)) & -1;
      c = (((g << 4) | (g >>> 28)) + d) & -1;
      g = (((f + (c ^ d ^ e)) & -1) + ((b[8] + -2022574463) & -1)) & -1;
      f = (((g << 11) | (g >>> 21)) + c) & -1;
      g = (((e + (f ^ c ^ d)) & -1) + ((b[11] + 1839030562) & -1)) & -1;
      e = (((g << 16) | (g >>> 16)) + f) & -1;
      g = (((d + (e ^ f ^ c)) & -1) + ((b[14] + -35309556) & -1)) & -1;
      d = (((g << 23) | (g >>> 9)) + e) & -1;
      g = (((c + (d ^ e ^ f)) & -1) + ((b[1] + -1530992060) & -1)) & -1;
      c = (((g << 4) | (g >>> 28)) + d) & -1;
      g = (((f + (c ^ d ^ e)) & -1) + ((b[4] + 1272893353) & -1)) & -1;
      f = (((g << 11) | (g >>> 21)) + c) & -1;
      g = (((e + (f ^ c ^ d)) & -1) + ((b[7] + -155497632) & -1)) & -1;
      e = (((g << 16) | (g >>> 16)) + f) & -1;
      g = (((d + (e ^ f ^ c)) & -1) + ((b[10] + -1094730640) & -1)) & -1;
      d = (((g << 23) | (g >>> 9)) + e) & -1;
      g = (((c + (d ^ e ^ f)) & -1) + ((b[13] + 681279174) & -1)) & -1;
      c = (((g << 4) | (g >>> 28)) + d) & -1;
      g = (((f + (c ^ d ^ e)) & -1) + ((b[0] + -358537222) & -1)) & -1;
      f = (((g << 11) | (g >>> 21)) + c) & -1;
      g = (((e + (f ^ c ^ d)) & -1) + ((b[3] + -722521979) & -1)) & -1;
      e = (((g << 16) | (g >>> 16)) + f) & -1;
      g = (((d + (e ^ f ^ c)) & -1) + ((b[6] + 76029189) & -1)) & -1;
      d = (((g << 23) | (g >>> 9)) + e) & -1;
      g = (((c + (d ^ e ^ f)) & -1) + ((b[9] + -640364487) & -1)) & -1;
      c = (((g << 4) | (g >>> 28)) + d) & -1;
      g = (((f + (c ^ d ^ e)) & -1) + ((b[12] + -421815835) & -1)) & -1;
      f = (((g << 11) | (g >>> 21)) + c) & -1;
      g = (((e + (f ^ c ^ d)) & -1) + ((b[15] + 530742520) & -1)) & -1;
      e = (((g << 16) | (g >>> 16)) + f) & -1;
      g = (((d + (e ^ f ^ c)) & -1) + ((b[2] + -995338651) & -1)) & -1;
      d = (((g << 23) | (g >>> 9)) + e) & -1;
      g = (((c + (e ^ (d | ~f))) & -1) + ((b[0] + -198630844) & -1)) & -1;
      c = (((g << 6) | (g >>> 26)) + d) & -1;
      g = (((f + (d ^ (c | ~e))) & -1) + ((b[7] + 1126891415) & -1)) & -1;
      f = (((g << 10) | (g >>> 22)) + c) & -1;
      g = (((e + (c ^ (f | ~d))) & -1) + ((b[14] + -1416354905) & -1)) & -1;
      e = (((g << 15) | (g >>> 17)) + f) & -1;
      g = (((d + (f ^ (e | ~c))) & -1) + ((b[5] + -57434055) & -1)) & -1;
      d = (((g << 21) | (g >>> 11)) + e) & -1;
      g = (((c + (e ^ (d | ~f))) & -1) + ((b[12] + 1700485571) & -1)) & -1;
      c = (((g << 6) | (g >>> 26)) + d) & -1;
      g = (((f + (d ^ (c | ~e))) & -1) + ((b[3] + -1894986606) & -1)) & -1;
      f = (((g << 10) | (g >>> 22)) + c) & -1;
      g = (((e + (c ^ (f | ~d))) & -1) + ((b[10] + -1051523) & -1)) & -1;
      e = (((g << 15) | (g >>> 17)) + f) & -1;
      g = (((d + (f ^ (e | ~c))) & -1) + ((b[1] + -2054922799) & -1)) & -1;
      d = (((g << 21) | (g >>> 11)) + e) & -1;
      g = (((c + (e ^ (d | ~f))) & -1) + ((b[8] + 1873313359) & -1)) & -1;
      c = (((g << 6) | (g >>> 26)) + d) & -1;
      g = (((f + (d ^ (c | ~e))) & -1) + ((b[15] + -30611744) & -1)) & -1;
      f = (((g << 10) | (g >>> 22)) + c) & -1;
      g = (((e + (c ^ (f | ~d))) & -1) + ((b[6] + -1560198380) & -1)) & -1;
      e = (((g << 15) | (g >>> 17)) + f) & -1;
      g = (((d + (f ^ (e | ~c))) & -1) + ((b[13] + 1309151649) & -1)) & -1;
      d = (((g << 21) | (g >>> 11)) + e) & -1;
      g = (((c + (e ^ (d | ~f))) & -1) + ((b[4] + -145523070) & -1)) & -1;
      c = (((g << 6) | (g >>> 26)) + d) & -1;
      g = (((f + (d ^ (c | ~e))) & -1) + ((b[11] + -1120210379) & -1)) & -1;
      f = (((g << 10) | (g >>> 22)) + c) & -1;
      g = (((e + (c ^ (f | ~d))) & -1) + ((b[2] + 718787259) & -1)) & -1;
      e = (((g << 15) | (g >>> 17)) + f) & -1;
      g = (((d + (f ^ (e | ~c))) & -1) + ((b[9] + -343485551) & -1)) & -1;
      a[0] = (c + a[0]) & -1;
      a[1] = (((((g << 21) | (g >>> 11)) + e) & -1) + a[1]) & -1;
      a[2] = (e + a[2]) & -1;
      a[3] = (f + a[3]) & -1;
    }
  }
  Ad.i = !0;
  class Dd {
    constructor(a) {
      this.hq = [];
      this.data = null;
      var b = new Uint8Array(a),
        c = b.byteLength;
      if (69 == b[c - 1]) {
        var d = b[c - 6] | (b[c - 5] << 8) | (b[c - 4] << 16),
          e = a.slice(c - (d + 6), c - 6);
        if (0 < (b[c - 3] & 1)) {
          a = Ta.ek(a.slice(0, a.byteLength - (d + 6)));
          b = Ad.encode(Mc.encode(a));
          a = [];
          for (c = 0; 32 > c; ) a.push(ta.yu(b, c++));
          b = new Uint8Array(e);
          c = 0;
          for (d = e.byteLength; c < d; ) {
            var f = c++;
            b[f] ^= a[f & 31];
          }
        }
        this.data = Ta.ek(e);
        e = new sc(this.data);
        a = e.ta();
        for (b = 0; b < a; ) {
          ++b;
          d = e.ta();
          f = e.ta();
          c = null;
          let g = e.zd();
          0 < g && (c = e.bs(g, xe.Ot));
          0 == d
            ? ((d = e.zd()),
              (f = new Ta(new ArrayBuffer(d))),
              e.sm(f, 0, d),
              this.hq.push(new Jg(c, f, null)))
            : this.hq.push(new Jg(c, this.hq[f].data, f));
        }
      }
    }
  }
  Dd.i = !0;
  Object.assign(Dd.prototype, { l: Dd });
  class Jg {
    constructor(a, b, c) {
      this.name = a;
      this.data = b;
      this.ds = c;
    }
  }
  Jg.i = !0;
  Object.assign(Jg.prototype, { l: Jg });
  class l {
    static ib() {
      l.data = new ib();
      l.Zl = new ib();
      l.$z = [];
      l.os = 1;
      l.language = "en";
      l.qo = "png";
      l.$k = null;
      l.Jw = new vc();
      l.Ju = new ib();
      l.decoding = new ib();
      l.kq = null;
      l.fh = new ib();
      l.fh.J[0] = ["wav", "ogg", "aac"];
      l.fh.J[2] = ["png", "jpg", "avif"];
      l.fh.J[3] = ["txt", "json", "tmj", "tsj"];
      l.fh.J[1] = ["dat", "tps", "fnt", "zst"];
      l.fh.J[4] = ["mp4"];
    }
    static Fs(a) {
      l.os = a;
    }
    static hv() {
      return l.language;
    }
    static Ui(a) {
      var b;
      null == b && (b = !1);
      null == a && (a = "en");
      a = a.toLowerCase();
      var c = l.JA();
      0 < c.length &&
        !Ma.tl(c, function (d) {
          return d == l.language;
        }) &&
        (a = "en");
      if (b && a != l.language)
        for (b = 0, c = l.Ce; b < c.length; ) {
          let d = c[b];
          ++b;
          new la("{language}", "").match(d) && (l.pg(d), l.js(l.pg(d)));
        }
      l.language = a;
    }
    static IR() {
      l.qo = "avif";
    }
    static yN(a) {
      var b = new RegExp("^(" + l.Kp + "/)", "");
      a = l.mi(a).replace(b, "");
      b = new la("-(\\d)x", "");
      return b.match(a) ? Da.parseInt(b.Yc(1)) : 1;
    }
    static BN(a) {
      return l.BP[a];
    }
    static IA() {
      return l.$k;
    }
    static AR(a) {
      l.$k = a;
    }
    static getType(a) {
      let b = 0;
      for (; 5 > b; ) {
        let c = b++;
        if (new la("\\.(" + l.fh.J[c].join("|") + ")", "mi").match(a)) return c;
      }
      throw 21;
    }
    static mi(a) {
      let b = l.Ce[a];
      if (null == b) return null;
      let c = new la("{(?:language|image|audio|resolution)}", "");
      c.match(b) &&
        ((c = new la("{language}", "")),
        c.match(b) &&
          null != l.language &&
          (b = b.replace(c.r, "-" + l.language)),
        (c = new la("{image}", "g")),
        c.match(b) && null != l.qo && (b = b.replace(c.r, l.qo)),
        (c = new la("{audio}", "g")),
        c.match(b) && null != l.$k && (b = b.replace(c.r, l.$k)),
        (c = new la("{resolution}", "g")),
        c.match(b) &&
          null != l.os &&
          (b =
            1 == l.os
              ? b.replace(c.r, "")
              : b.replace(c.r, "-" + Math.min(l.BN(a), l.os) + "x")));
      return "" + l.Kp + "/" + b;
    }
    static KN() {
      var a;
      null == a && (a = l.wN());
      let b = [],
        c = 0;
      for (; c < a.length; ) {
        let d = l.mi(a[c++]);
        null != d && b.push(d);
      }
      return b;
    }
    static wN() {
      let a = [],
        b = 0,
        c = l.MAX;
      for (; b < c; ) a.push(b++);
      return a;
    }
    static iterator() {
      return new Vh();
    }
    static aB() {
      let a = l.QQ,
        b = [],
        c = 0;
      for (; c < a.length; ) {
        let d = a[c];
        ++c;
        l.DE(d) && b.push(d);
      }
      return b;
    }
    static xN() {
      let a = l.iO,
        b = [],
        c = 0;
      for (; c < a.length; ) {
        let d = a[c];
        ++c;
        l.DE(d) && b.push(d);
      }
      return b;
    }
    static Cl(a, b, c) {
      null == c && (c = !1);
      let d = RegExp("\\.(\\w+)$", "");
      a = l.mi(a).replace(d, "." + b);
      c && (a = a.replace(RegExp("\\.p\\.", ""), "."));
      return l.pg(a);
    }
    static pg(a) {
      function b(d, e) {
        a = a.replace(new RegExp(d, ""), e);
      }
      if (Object.prototype.hasOwnProperty.call(l.Jw.J, a))
        return Da.parseInt(l.Jw.J[a]);
      b("^(" + l.Kp + "/)(.*)", "$2");
      var c = l.Ce.indexOf(a);
      if (-1 != c) return c;
      c = l.JA();
      0 < c.length && b("-(" + c.join("|") + ")", "{language}");
      l.rQ.includes(a)
        ? b("(\\.\\w+)$", "{resolution}$1")
        : b("[\\/-][124]x", "{resolution}");
      c = l.Ce.indexOf(a);
      if (-1 != c) return c;
      new la("(" + l.fh.J[2].join("|") + ")", "g").match(a)
        ? ((c = l.oN()),
          0 < c.length &&
            (b("(.*?)\\.(" + c.join("|") + ")$", "$1.{image}"),
            b("((" + c.join("|") + ")\\/)", "{image}/")))
        : new la("(" + l.fh.J[0].join("|") + ")", "g").match(a) &&
          ((c = l.Qq()),
          0 < c.length &&
            (b("(.*?)\\.(" + c.join("|") + ")$", "$1.{audio}"),
            b("((" + c.join("|") + ")\\/)", "{audio}/")));
      return l.Ce.indexOf(a);
    }
    static yb(a) {
      a = l.data.J[a];
      if ("string" == typeof a) return a;
      if (a instanceof ArrayBuffer) {
        if ("TextDecoder" in window)
          return (a = new DataView(a)), new TextDecoder("utf-8").decode(a);
        a = Ta.ek(a);
        return a.yb(0, a.length);
      }
      return null;
    }
    static Yn(a) {
      return Ta.ek(l.data.J[a]);
    }
    static qN(a) {
      if (null == l.kq) {
        l.kq = new vc();
        let b = 0,
          c = l.Wz;
        for (; b < c.length; ) {
          let d = c[b++].split(":");
          l.kq.J[l.Kp + "/" + d[0]] = Da.parseInt(d[1]);
        }
      }
      return l.kq.J[a];
    }
    static DE(a) {
      return l.Cv(a)
        ? null == l.$k
          ? !1
          : Ma.tl(l.Qq(), function (b) {
              return b == l.$k;
            })
        : !0;
    }
    static setData(a, b) {
      if (l.Ju.J.hasOwnProperty(a) && 0 == l.decoding.J[a])
        (l.decoding.J[a] = 1),
          l.Ju.J[a](a, b, function (c) {
            l.decoding.J[a] = 2;
            l.setData(a, c);
          });
      else {
        l.data.J[a] = b;
        b = l.$z;
        let c = b.length;
        for (; -1 < --c; )
          if (b[c].id == a) {
            let d = b[c];
            b[c] = b[b.length - 1];
            b.pop();
            d.zc();
          }
      }
    }
    static ob(a) {
      return null != l.data.J[a];
    }
    static js(a) {
      l.data.J[a] = null;
      l.data.remove(a);
      l.decoding.J[a] = 0;
    }
    static MR(a, b) {
      l.Zl.J[a] = b;
    }
    static CN(a) {
      return l.Zl.J[a];
    }
    static Cv(a) {
      return 1e3 < a
        ? ((a = l.Jw.J[null == a ? "null" : "" + a]),
          new la("(ogg|aac|mp3|wav)$", "").match(a))
        : new la("{audio}", "").match(l.Ce[a]);
    }
    static sg(a) {
      return new la("music", "").match(l.Ce[a]);
    }
    static AO(a) {
      a = l.Ce[a];
      let b = new la("{image}", "g");
      b.match(a) && null != l.qo && (a = a.replace(b.r, l.qo));
      return new la("\\.(" + l.fh.J[2].join("|") + ")$", "").match(a);
    }
    static Qj(a) {
      return 1 == l.decoding.J[a];
    }
    static SP(a, b) {
      null != l.mi(a) && (l.ob(a) ? b(a) : l.$z.push(new Wh(a, b)));
    }
    static wz(a, b) {
      l.Ju.J[a] = b;
      l.decoding.J[a] = 0;
    }
    static Qq() {
      return ["ogg", "aac"].slice();
    }
    static oN() {
      return ["png", "jpg", "avif"].slice();
    }
    static JA() {
      return "ru nl ko ja it fr es en de br".split(" ").slice();
    }
  }
  l.i = !0;
  class Wh {
    constructor(a, b) {
      this.id = a;
      this.Pq = b;
    }
    zc() {
      this.Pq(this.id);
      this.Pq = null;
    }
  }
  Wh.i = !0;
  Object.assign(Wh.prototype, { l: Wh });
  class Vh {
    constructor() {
      this.tB = 0;
    }
    eb() {
      return this.tB < l.MAX;
    }
    next() {
      return this.tB++;
    }
  }
  Vh.i = !0;
  Object.assign(Vh.prototype, { l: Vh });
  class Uh {
    constructor(a, b) {
      this.gm = this.Ae = null;
      this.progress = 0;
      this.data = null;
      this.url = a;
      this.version = b;
    }
    F() {
      this.Ae = this.gm = this.data = null;
    }
    load(a, b) {
      this.gm = a;
      this.Ae = b;
      let c;
      switch (l.getType(this.url)) {
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
      this.rT(this.url, c, function (e) {
        d.Gi(e);
      });
    }
    rT(a, b, c) {
      let d = new XMLHttpRequest(),
        e = this;
      d.onerror = function () {
        null != e.Ae && e.Ae();
        d.onerror = d.onload = d.onprogress = null;
      };
      d.onload = function () {
        e.progress = 1;
        if (404 == d.status) null != e.Ae && e.Ae();
        else {
          var f = d.response;
          d.onerror = d.onload = d.onprogress = null;
          c(f);
        }
      };
      d.onprogress = function (f) {
        0 < f.total && (e.progress = f.loaded / f.total);
      };
      try {
        d.open(
          "GET",
          null != this.version ? "" + a + "?v=" + this.version : a,
          !0
        ),
          (d.responseType = b),
          d.send();
      } catch (f) {}
    }
    Gi(a) {
      this.data = a;
      this.gm();
      this.gm = null;
    }
  }
  Uh.i = !0;
  Object.assign(Uh.prototype, { l: Uh });
  class Kg {
    constructor(a, b, c) {
      this.id = a;
      this.data = b;
      this.sg = c;
      this.SB = -1;
    }
  }
  Kg.i = !0;
  Object.assign(Kg.prototype, { l: Kg });
  class Bd {
    constructor() {
      this.KS = 0.05;
      this.enabled = !0;
      this.eC = 2;
      this.CP = 16;
      this.dC = this.Th = 0;
      this.Vv = this.Uv = this.Wv = 1;
      this.cC = 0;
      this.OP = 1e4;
      this.dd = [];
      this.Wg = new ib();
      this.LS = new ib();
      this.names = [];
    }
    F() {
      1 != this.Uv && this.Rf(1);
      1 != this.Vv && this.$w(1);
      1 != this.Wv && this.Jg(1);
      0 != this.cC && this.Ds(0);
      let a = 0,
        b = this.dd;
      for (; a < b.length; ) b[a++].F();
      this.names = this.Wg = this.dd = null;
    }
    es() {}
    fs(a) {
      let b = 0;
      for (; b < a.length; ) {
        let c = a[b];
        ++b;
        this.names[c.id] = c.name;
      }
    }
    play() {
      return -1;
    }
    stop(a, b) {
      null == b && (b = 0);
      if (0 > a) return !1;
      if (1e4 > a) {
        var c = !1;
        let d = 0,
          e = this.dd,
          f = [],
          g = 0;
        for (; g < e.length; ) {
          let h = e[g];
          ++g;
          h.Le.id == a && f.push(h);
        }
        for (; d < f.length; ) (c = !0), f[d++].stop(b);
        return c;
      }
      c = Ma.find(this.dd, function (d) {
        return d.id == a;
      });
      return null != c ? (c.stop(b), !0) : !1;
    }
    Vc(a) {
      return 0 > a
        ? !1
        : 1e4 > a
        ? Ma.tl(this.dd, function (b) {
            return b.Le.id == a;
          })
        : Ma.tl(this.dd, function (b) {
            return b.id == a;
          });
    }
    pg(a) {
      let b = Ma.find(this.dd, function (c) {
        return c.Le.id == a;
      });
      return null != b ? b.id : -1;
    }
    PN(a) {
      return 1e4 > a
        ? Ma.find(this.dd, function (b) {
            return b.Le.id == a;
          })
        : Ma.find(this.dd, function (b) {
            return b.id == a;
          });
    }
    HO(a) {
      return null != this.Wg.J[a];
    }
    bS(a, b) {
      null == a
        ? Ma.yi(this.dd, function (c) {
            c.Le.sg || c.Vi(b);
          })
        : Ma.yi(this.dd, function (c) {
            c.Le.sg || (1e4 > a ? c.Le.id : c.id) != a || c.Vi(b);
          });
    }
    Jg(a) {
      this.Wv = 0 > a ? 0 : 1 < a ? 1 : a;
      this.it();
      this.kt();
    }
    $w(a) {
      this.Vv = 0 > a ? 0 : 1 < a ? 1 : a;
      this.kt();
    }
    Rf(a) {
      this.Uv = 0 > a ? 0 : 1 < a ? 1 : a;
      this.it();
    }
    Ds(a) {
      this.cC = -1 > a ? -1 : 1 < a ? 1 : a;
    }
    Sn(a, b, c) {
      null == c && (c = !0);
      this.qm(a, 0, b);
      c && this.stop(a, b);
    }
    qm(a, b, c) {
      var d;
      null == d && (d = -1);
      let e = this.PN(a);
      null != e &&
        this.Vc(a) &&
        (-1 != d && e.Vi(d),
        (a = e.fo() - b),
        (0 < a ? 0.01 > a : 0.01 > -a) || e.qm(b, c));
    }
    lR(a, b, c) {
      if (!this.enabled || !this.HO(a)) return -1;
      if (b && this.Vc(a)) return this.pg(a);
      b && (c = !0);
      if (!c && this.zx(a)) return -1;
      a = this.FN(this.Wg.J[a].sg, c);
      return 0 > a ? -1 : a;
    }
    hQ(a) {
      this.dd.push(a);
      this.dd.length > this.dC && (this.dC = this.dd.length);
    }
    gQ(a) {
      this.Th &= ~(1 << a.channel);
      ta.remove(this.dd, a);
      null != a.Gi && (a.Gi(), (a.Gi = null));
    }
    zx(a) {
      let b = this.Wg.J[a];
      if (b.sg) return !1;
      let c = ta.now() / 1e3;
      a = this.LS.J[a];
      null == a && (a = this.KS);
      if (c - b.SB < a) return !0;
      b.SB = c;
      return !1;
    }
    FN(a, b) {
      if (a) {
        for (b = 0; b < this.eC; ) {
          if (0 == (this.Th & (1 << b))) return (this.Th |= 1 << b), b;
          ++b;
        }
        return -1;
      }
      a = -1;
      for (var c = this.eC, d = c + this.CP; c < d; ) {
        if (0 == (this.Th & (1 << c))) {
          this.Th |= 1 << c;
          a = c;
          break;
        }
        ++c;
      }
      if (b && 0 > a) {
        b = null;
        c = a = 0;
        for (d = this.dd; c < d.length; ) {
          let e = d[c];
          ++c;
          !e.Le.sg && !e.loop && e.bo() > a && ((a = e.bo()), (b = e));
        }
        if (null == b) return -1;
        a = b.channel;
        b.stop();
      }
      return a;
    }
    it() {
      Ma.yi(this.dd, function (a) {
        a.Le.sg && a.Vi(a.fo());
      });
    }
    kt() {
      Ma.yi(this.dd, function (a) {
        a.Le.sg || a.Vi(a.fo());
      });
    }
  }
  Bd.i = !0;
  Object.assign(Bd.prototype, { l: Bd });
  class Xh {
    constructor(a, b, c, d) {
      this.name = a;
      this.id = b;
      this.min = c;
      this.max = d;
    }
  }
  Xh.i = !0;
  Object.assign(Xh.prototype, { l: Xh });
  class Fe {
    static oB(a) {
      a = Ta.ek(a);
      return 83 == a.b[0] && 80 == a.b[1] ? 82 == a.b[2] : !1;
    }
    static fR(a) {
      return a.slice(5 + new sc(Ta.ek(a), 3).zd());
    }
    static nN(a) {
      if (!Fe.oB(a)) throw 22;
      a = new sc(Ta.ek(a), 5);
      let b = [],
        c = 0,
        d = a.zd();
      for (; c < d; ) {
        c++;
        let e = "",
          f = 0,
          g = a.zd();
        for (; f < g; ) {
          f++;
          let h = a.ta();
          e += String.fromCodePoint(h);
        }
        b.push(new Xh(e, a.zd(), a.iD(), a.iD()));
      }
      return b;
    }
  }
  Fe.i = !0;
  class ze extends Bd {
    constructor() {
      super();
    }
    es() {}
    fs() {}
    play() {
      return -1;
    }
    Jg() {}
    Rf() {}
    $w() {}
    Ds() {}
    it() {}
    kt() {}
  }
  ze.i = !0;
  ze.s = Bd;
  Object.assign(ze.prototype, { l: ze });
  class Lg {
    constructor(a, b) {
      this.volume = 1;
      this.offset = 0;
      this.loop = !1;
      this.qw = a;
      this.Le = b;
    }
    F() {
      this.qw = this.Le = null;
      this.Rj = !0;
    }
    fo() {
      return this.Rj ? NaN : this.volume;
    }
    Vi(a) {
      this.Rj || ((this.volume = a), this.kT());
    }
    bo() {
      return this.Rj ? NaN : this.MN() / this.data.duration;
    }
  }
  Lg.i = !0;
  Object.assign(Lg.prototype, { l: Lg });
  class Kc {
    constructor() {
      this.yo = [];
      this.stack = [];
      this.qE = this.pE = 0;
    }
    If(a, b) {
      this.yo.push(new Yh(a, b));
      let c = this;
      return function () {
        c.removeListener(a, b);
      };
    }
    once(a, b) {
      this.If(a, b);
      this.yo[this.yo.length - 1].flags = 3;
    }
    removeListener(a, b) {
      let c = this.yo,
        d = 0,
        e = c.length;
      for (; d < e; ) {
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
    zc(a, b) {
      var c = this.yo;
      let d = c.length,
        e = this.stack,
        f = this.pE,
        g = 0,
        h = d;
      for (; g < h; ) e[f++] = c[g++];
      f > this.qE && (this.qE = f);
      for (this.pE = f; 0 < d; )
        (c = e[--f]),
          (e[f] = null),
          c.type == a &&
            0 < c.flags &&
            (c.listener.apply(null, b), 3 == c.flags && (c.flags = 0)),
          --d;
    }
  }
  Kc.i = !0;
  Object.assign(Kc.prototype, { l: Kc });
  class Q {
    static ho() {
      return null != Q.context ? "running" == Q.context.state : !1;
    }
    static If(a, b) {
      return Q.Qb.If(a, b);
    }
    static once(a, b) {
      Q.Qb.once(a, b);
    }
    static ib() {
      if (null != Q.context) {
        Q.dM();
        var a = Q.df;
        null != a && a.stop();
      }
      a = new la("(iPad|iPhone)", "g").match(ma.navigator.platform);
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && (a = !0);
      a &&
        ((Q.currentTime = null),
        (Q.df = new cc(1e3)),
        (Q.df.Fg = function () {
          null != Q.context &&
            Q.ho() &&
            (null != Q.currentTime &&
              Q.currentTime == Q.context.currentTime &&
              (Q.df.stop(), Q.Qb.zc("EContextBroken")),
            (Q.currentTime = Q.context.currentTime));
        }));
      try {
        "undefined" !== typeof AudioContext
          ? (Q.context = new AudioContext())
          : "undefined" !== typeof webkitAudioContext &&
            (Q.context = new webkitAudioContext()),
          (Q.context.onstatechange = function () {
            Q.Qb.zc(Q.ho() ? "EContextResumed" : "EContextSuspended");
          }),
          Q.Qb.zc("EContextCreated"),
          Q.ho() || Q.addListener();
      } catch (b) {
        Q.context = null;
      }
    }
    static HB() {
      for (;;) {
        if (null != Q.Sx) return Q.Sx;
        try {
          Q.Sx = !(!window.AudioContext && !window.webkitAudioContext);
        } catch (a) {
          Q.Sx = !1;
        }
      }
    }
    static DM() {
      function a(h, m) {
        e[h] = m;
      }
      let b = null;
      try {
        b = "undefined" !== typeof Audio ? new Audio() : null;
      } catch (h) {
        return null;
      }
      if (!b || "function" !== typeof b.canPlayType) return null;
      let c = { probably: 2, maybe: 1, "": 0 },
        d = null;
      d = function (h) {
        if (h instanceof Array) {
          let m = 0,
            n = 0;
          for (; n < h.length; ) {
            let q = d(h[n++]);
            q > m && (m = q);
          }
          return m;
        }
        return yb.uf(c, b.canPlayType(h).replace(RegExp("^no$", ""), ""));
      };
      let e = {};
      a("mp3", d("audio/mp3;"));
      a("ogg", d('audio/ogg; codecs="vorbis"'));
      a("aac", d("audio/aac;"));
      var f = ma.navigator.userAgent;
      if (-1 < f.indexOf("OPR") || -1 < f.indexOf("YaBrowser")) e.aac = 0;
      f = 0;
      let g = ["aac", "ogg", "mp3"];
      for (; f < g.length; ) {
        let h = g[f];
        ++f;
        if (0 < yb.uf(e, h)) return h;
      }
      return null;
    }
    static dM() {
      try {
        (Q.context.onstatechange = null), Q.context.close();
      } catch (a) {}
      Q.context = null;
    }
    static OC(a) {
      a.preventDefault();
      null != Q.context &&
        "running" != Q.context.state &&
        Q.context.resume().then(
          function () {},
          function () {
            Q.Qb.zc("EContextResumeRejected");
          }
        );
    }
    static addListener() {
      window.addEventListener("mouseup", Q.OC);
      window.addEventListener("touchend", Q.OC);
    }
  }
  Q.i = !0;
  class Wc extends Bd {
    constructor() {
      super();
    }
    F() {
      super.F();
      this.Fo = this.Eo = this.Go = this.Do = null;
    }
    es(a, b, c, d, e) {
      null == c && (c = !1);
      super.es(a, b, c, d, e);
      let f = this;
      this.decode(b, function (g) {
        null == g ? d(null) : ((f.Wg.J[a] = new Kg(a, g, c)), d(g));
      });
    }
    fs(a, b, c) {
      super.fs(a, b, c);
      let d = this;
      this.decode(b, function (e) {
        if (null == e) c(null);
        else
          try {
            let f = d.split(e, a),
              g = 0,
              h = a.length;
            for (; g < h; ) {
              let m = g++,
                n = a[m].id;
              d.names[n] = a[m].name;
              d.Wg.J[n] = new Kg(n, f[m], !1);
            }
            c(e);
          } catch (f) {}
      });
    }
    play(a, b, c, d) {
      null == d && (d = 0);
      null == c && (c = !1);
      null == b && (b = !1);
      if (null == Q.context || !Q.ho()) return -1;
      c = this.lR(a, b, c);
      if (0 > c) return -1;
      a = new Qc(this, this.Wg.J[a]);
      a.id = this.OP++;
      a.channel = c;
      a.loop = b;
      a.offset = d;
      a.play();
      this.hQ(a);
      return a.id;
    }
    Jg(a, b) {
      null == b && (b = 0);
      if (null != Q.context) {
        this.Wv = 0 > a ? 0 : 1 < a ? 1 : a;
        var c = this.Uq();
        0 < b ? c.qm(a, b) : c.As(a);
      }
    }
    Rf(a) {
      null != Q.context &&
        ((this.Uv = 0 > a ? 0 : 1 < a ? 1 : a), this.YA().As(a));
    }
    $w(a) {
      null != Q.context &&
        ((this.Vv = 0 > a ? 0 : 1 < a ? 1 : a), this.ZA().As(a));
    }
    Ds(a) {
      null != Q.context && (super.Ds(a), this.AN().gS(a));
    }
    it() {}
    kt() {}
    decode(a, b) {
      new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(
        2,
        1323e4,
        44100
      ).decodeAudioData(
        a,
        function (c) {
          b(c);
        },
        function () {
          b(null);
        }
      );
    }
    Uq() {
      null == this.Do &&
        ((this.Do = new Rc()), (this.Do.type = 5), this.Do.connect(new Mg()));
      return this.Do;
    }
    ZA() {
      null == this.Go &&
        ((this.Go = new Rc()), (this.Go.type = 3), this.Go.connect(this.Uq()));
      return this.Go;
    }
    YA() {
      null == this.Eo &&
        ((this.Eo = new Rc()), (this.Eo.type = 4), this.Eo.connect(this.Uq()));
      return this.Eo;
    }
    AN() {
      null == this.Fo &&
        ((this.Fo = new Ng()), (this.Fo.type = 6), this.Uq().append(this.Fo));
      return this.Fo;
    }
    rM(a) {
      let b = window.OfflineAudioContext;
      null == b && (b = window.webkitOfflineAudioContext);
      return new b(2, 44100 * a, 44100);
    }
    split(a, b) {
      let c = this.rM(Math.ceil((2 * b[b.length - 1].max) / 1e3)),
        d = a.sampleRate,
        e = [],
        f = 0,
        g = b.length;
      if (1 == a.numberOfChannels)
        for (var h = a.getChannelData(0); f < g; ) {
          var m = b[f++];
          a = ((d / 1e3) * m.min) | 0;
          var n = ((d / 1e3) * m.max) | 0;
          m = c.createBuffer(1, n - a, d);
          a = h.subarray(a, n);
          try {
            m.copyToChannel(a, 0);
          } catch (q) {
            m.getChannelData(0).set(a);
          }
          e.push(m);
        }
      else
        for (h = a.getChannelData(0), a = a.getChannelData(1); f < g; ) {
          n = b[f++];
          m = ((d / 1e3) * n.min) | 0;
          let q = ((d / 1e3) * n.max) | 0;
          n = c.createBuffer(2, q - m, d);
          let p = h.subarray(m, q);
          m = a.subarray(m, q);
          try {
            n.copyToChannel(p, 0), n.copyToChannel(m, 1);
          } catch (v) {
            n.getChannelData(0).set(p), n.getChannelData(1).set(m);
          }
          e.push(n);
        }
      return e;
    }
  }
  Wc.i = !0;
  Wc.s = Bd;
  Object.assign(Wc.prototype, { l: Wc });
  class Qc extends Lg {
    constructor(a, b) {
      super(a, b);
      this.data = b.data;
      this.Er = null;
    }
    F() {
      if (!this.Rj) {
        var a = this.pf;
        a: for (; null != a; ) {
          let b = a.output;
          switch (a.type) {
            case 0:
              this.Vc && ((this.Vc = !1), this.pf.stop(0));
              break;
            case 1:
            case 2:
              break;
            default:
              break a;
          }
          ta.remove(a.output.inputs, a);
          a.n.disconnect();
          a.F();
          a = b;
        }
        this.pf = this.data = null;
        a = this.qw;
        super.F();
        a.gQ(this);
      }
    }
    play() {
      if (!this.Rj) {
        this.Vc = !0;
        this.pf = new Og();
        var a = this.qw;
        this.pf.connect(this.Le.sg ? a.YA() : a.ZA());
        this.startTime = Q.context.currentTime;
        this.pf.play(this.data, this.loop, this.offset, P(this, this.onended));
      }
    }
    qm(a, b) {
      if (!this.Rj) {
        var c = this.UA();
        null != c && c.qm(a, b);
        this.volume = a;
        this.Er = Q.context.currentTime + b;
      }
    }
    stop(a) {
      null == a && (a = 0);
      this.Rj ||
        this.stopped ||
        !this.Vc ||
        ((this.stopped = !0), this.pf.stop(Q.context.currentTime + a));
    }
    MN() {
      return (
        (this.offset + (Q.context.currentTime - this.startTime)) %
        this.data.duration
      );
    }
    fo() {
      if (null != this.Er) {
        if (Q.context.currentTime < this.Er) return this.pf.get(2).n.gain.value;
        this.Er = null;
      }
      return this.volume;
    }
    kT() {
      let a = this.UA();
      null != a && a.As(this.fo());
    }
    onended() {
      this.Vc && ((this.Vc = !1), this.F());
    }
    UA() {
      if (!Qc.GA || null == this.pf) return null;
      try {
        let a = this.pf.get(2);
        if (null == a) {
          a = new Rc();
          let b = this.pf.get(1);
          null == b ? this.pf.append(a) : b.append(a);
        }
        return a;
      } catch (a) {
        return (Qc.GA = !1), null;
      }
    }
  }
  Qc.i = !0;
  Qc.s = Lg;
  Object.assign(Qc.prototype, { l: Qc });
  class Tb {
    constructor(a, b) {
      this.n = a;
      this.type = b;
      this.inputs = [];
      this.output = null;
    }
    get(a) {
      let b = this;
      for (; null != b; ) {
        if (b.type == a) return b;
        b = b.output;
      }
      return null;
    }
    F() {
      this.n = this.output = this.inputs = null;
    }
    connect(a) {
      this.output = a;
      a.inputs.push(this);
      this.n.disconnect();
      this.n.connect(a.n);
    }
    append(a) {
      ta.remove(this.output.inputs, this);
      a.connect(this.output);
      this.connect(a);
    }
  }
  Tb.i = !0;
  Object.assign(Tb.prototype, { l: Tb });
  class Mg extends Tb {
    constructor() {
      super(Q.context.destination, 8);
    }
  }
  Mg.i = !0;
  Mg.s = Tb;
  Object.assign(Mg.prototype, { l: Mg });
  class Og extends Tb {
    constructor() {
      super(Q.context.createBufferSource(), 0);
    }
    F() {
      this.n.onended = null;
      super.F();
    }
    play(a, b, c, d) {
      let e = this.n;
      e.buffer = a;
      e.loop = b;
      e.start(0, c);
      e.onended = d;
    }
    stop(a) {
      null == a && (a = 0);
      this.n.stop(a);
    }
  }
  Og.i = !0;
  Og.s = Tb;
  Object.assign(Og.prototype, { l: Og });
  class Rc extends Tb {
    constructor() {
      super(Q.context.createGain(), 2);
    }
    As(a) {
      this.n.gain.value = a;
    }
    qm(a, b) {
      let c = Q.context.currentTime,
        d = this.n;
      d.gain.cancelScheduledValues(0);
      d.gain.linearRampToValueAtTime(a, c + b);
    }
  }
  Rc.i = !0;
  Rc.s = Tb;
  Object.assign(Rc.prototype, { l: Rc });
  class Ng extends Tb {
    constructor() {
      super(Q.context.createStereoPanner(), 1);
    }
    gS(a) {
      let b = this.n;
      b.pan.cancelScheduledValues(0);
      b.pan.setTargetAtTime(a, Q.context.currentTime, 0.005);
    }
  }
  Ng.i = !0;
  Ng.s = Tb;
  Object.assign(Ng.prototype, { l: Ng });
  class za extends Pc {
    constructor(a, b, c, d) {
      super();
      this.frame = b;
      this.Fl = c;
      null == a && (a = r.Wa);
      this.T = new y(null, a, (this.frame = b));
      this.j.appendChild(this.T);
      this.icon = null;
      null != d &&
        ((this.icon = new y(null, a, d)),
        this.icon.fl(),
        this.j.appendChild(this.icon));
      a = this.T.X;
      this.ec = new F(a.x, a.y, 0, 1);
      this.je = 0;
    }
    reset() {
      this.T.Fb(this.frame);
    }
    Tw(a) {
      this.focused && (a = !0);
      null != this.Fl && this.j.nb(0).Fb(a ? this.Fl : this.frame);
    }
    update(a) {
      super.update(a);
      0 < this.je &&
        ((this.je -= a), 0 > this.je && (this.T.Fb(this.frame), (this.je = 0)));
    }
    focus() {}
    select() {
      super.select();
      this.je = 0.2;
    }
    Ub(a) {
      return this.j.Ub(a);
    }
    static create(a, b, c, d) {
      return new za(a, b, c, d);
    }
  }
  za.i = !0;
  za.s = Pc;
  Object.assign(za.prototype, { l: za });
  class Hd extends za {
    constructor() {
      super(r.Wa, k.Pk, k.Qk, k.eK);
      let a = z.hk;
      0 != a &&
        (new y(this.j, r.Wa, k.gK),
        19 < a && (a = 19),
        new y(this.j, r.Wa, "album/" + a));
    }
  }
  Hd.i = !0;
  Hd.s = za;
  Object.assign(Hd.prototype, { l: Hd });
  class cd extends da {
    constructor(a, b, c) {
      null == c && (c = !1);
      null == b && (b = 1);
      super();
      this.T = a;
      this.scale = b;
      this.loop = c;
      this.time = 0;
      a.setScale(1, 1);
      a.fl();
      this.g = new F(a.wa(), a.Sa(), 0, 1);
    }
    ra() {
      this.T.setScale(1, 1);
      this.T.o(this.g.x);
      this.T.m(this.g.y);
      super.ra();
    }
    update(a) {
      super.update(a);
      a = this.time;
      if (0.1 > a) {
        a = 0.05 * Math.sin((a / 0.1) * (Math.PI / 2)) * this.scale;
        var b = 1 - a;
        a = 1 + a;
      } else if (0.3 > a)
        (b = a - 0.1),
          (a =
            (1 > (b /= 0.09999999999999999)
              ? 0.055 * b * b * b
              : 0.055 * ((b -= 2) * b * b + 2)) * this.scale),
          (b = 0.95 + a),
          (a = 1.05 - a);
      else if (0.6 > a)
        (a = (a - 0.3) / 0.3 - 1),
          (a = 0.05 * (a * a * a + 1) * this.scale),
          (b = 1.06 - a),
          (a = 0.94 + a);
      else {
        this.loop ? 4 < a && (this.time = 0) : this.ra();
        return;
      }
      this.T.o(this.g.x + b);
      this.T.m(this.g.y + a);
      this.T.na(b);
      this.T.lb(a);
    }
  }
  cd.i = !0;
  cd.s = da;
  Object.assign(cd.prototype, { l: cd });
  class Ya extends da {
    constructor() {
      super();
      Ya.instance = this;
      this.Lm = Ba.instance.jd && 1920 == this.O.window.Fc.x;
      this.state = 0;
      this.j = new S();
      this.node = new qb();
      this.node.P(this.j.u);
      this.node.name = "cover";
      this.Nc = new gc(null, new F(0, 0, 0, 1));
      this.Nc.W(0.5);
      this.j.node.P(this.Nc.u);
      this.Wr = [];
      this.vs = [1, 1];
      this.ke = [new y(this.j, r.uj, k.ny), new y(this.j, r.uj, k.ny)];
      this.Ba = [new y(this.j, r.uj, k.my), new y(this.j, r.uj, k.my)];
      this.zb = [new y(this.j, r.yc, k.QF), new y(this.j, r.yc, k.RF)];
      this.Jn = null;
      Ba.instance.config.io && ((this.Jn = new kc()), this.Ba[1].hp(this.Jn));
      this.Oe = new y(null, r.yc, k.NF);
      this.node.P(this.Oe.u);
      let a = Ba.instance.jd ? (this.Lm ? 1 : 1.5) : 1;
      this.Oe.Kg(652 * a, 577 * a);
      this.ml = new F(0, 0, 0, 1);
      this.Oe.M(!1);
      this.Oe.W(0);
      this.Oe.H(a);
      this.dc = new y(null, r.yc, k.PF);
      this.dc.M(!1);
      this.dc.W(0);
      this.node.P(this.dc.u);
      this.dc.af(this.dc.X.x / 2, 0);
      this.dc.Kg(this.dc.X.x / 2, 0);
      this.rk = new F(0, 0, 0, 1);
      this.ke[0].na(0.001);
      this.ke[1].na(0.001);
      this.Ba[0].o(-this.Ba[0].X.x);
      this.Ba[1].na(-1);
      this.zb[0].Kg(this.zb[0].X.x, 0);
      this.zb[0].af(this.zb[0].X.x, 0);
      this.node.Fd();
      this.ur = !1;
      this.layout();
    }
    RD() {
      this.ur = !0;
      this.layout();
    }
    ra() {
      super.ra();
      this.node.F();
      this.Nr = null;
      Ya.instance = null;
    }
    XE(a) {
      this.Nr = a;
      this.time = 0;
      this.state = 5;
    }
    DA() {
      this.time = 0;
      this.ke[0].na(1);
      this.ke[1].na(1);
      this.zb[0].M(!1);
      this.zb[1].M(!1);
      this.layout();
      this.animate(1);
      this.state = 6;
      x.stop(x.Ok);
      x.stop(x.Oh);
    }
    vM() {
      this.Oe.M(!0);
      this.state = 1;
      this.time = 0;
    }
    hu() {
      this.dc.M(!0);
      this.state = 3;
      this.time = 0;
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 1:
          a = this.jb(1.5);
          this.Oe.o(this.ml.x);
          this.Oe.m(this.ml.y);
          this.Oe.W(ua.Kf()(a));
          1 == a && ((this.state = 2), (this.time = 0));
          break;
        case 2:
          a = this.jb(2);
          this.Oe.o(this.ml.x);
          this.Oe.m(this.ml.y * (1 - a));
          1 == a && ((this.state = 0), this.Oe.M(!1));
          break;
        case 3:
          a = this.jb(1);
          this.dc.W(ua.Kf()(a));
          this.dc.o(this.rk.x);
          this.dc.m(0 * this.rk.y);
          this.zb[0].M(!0);
          this.zb[1].M(!0);
          this.zb[0].W(this.dc.Sc);
          this.zb[1].W(this.dc.Sc);
          this.zb[0].m(0.9 * -this.zb[0].ja());
          this.zb[1].m(0.9 * -this.zb[1].ja());
          1 == a && ((this.state = 4), (this.time = 0));
          break;
        case 4:
          a = this.jb(2);
          this.dc.o(this.rk.x);
          this.dc.m(this.rk.y * a);
          var b = this.dc.Dx(new F(0, 0, 0, 1));
          b = this.j.Cx(b);
          this.zb[0].m(Math.min(0, b.y - 0.9 * this.zb[0].ja()));
          this.zb[1].m(Math.min(0, b.y - 0.9 * this.zb[1].ja()));
          1 == a && ((this.state = 0), this.dc.M(!1));
          break;
        case 5:
          a = this.jb(2);
          this.animate(a);
          1 == a &&
            ((this.ur = !0),
            (this.state = 0),
            null != this.Nr && (this.Nr(), (this.Nr = null)));
          break;
        case 6:
          (a = this.jb(2)),
            this.animate(1 - a),
            1 == a && ((this.ur = !1), (this.state = 7));
      }
    }
    layout() {
      var a = Ba.instance.window.oi();
      this.j.update(0.016666666666666666);
      var b = a.x,
        c = a.y,
        d = b,
        e = c;
      2 < Ba.instance.window.Mj() &&
        ((d = b / 2),
        (e = c / 2),
        (b = this.node.Db),
        (b.scale.x = b.scale.y = b.scale.z = 2),
        (b.K = (b.K & -2) | 244));
      d /= 2;
      this.j.o(d);
      b = this.Ba[0];
      b.na(d / b.X.x);
      b.o(-b.ka());
      this.vs[0] = b.Qa;
      this.Wr[0] = b.wa();
      c = this.Ba[1];
      c.na(-d / c.X.x);
      c.o(c.ka());
      this.vs[1] = -c.Qa;
      this.Wr[1] = c.wa();
      this.ml.x = d;
      this.ml.y = e;
      this.rk.x = d;
      this.rk.y = e;
      this.j.lb(e / b.X.y);
      this.node.Fd();
      this.dc.o(this.rk.x);
      this.animate(this.ur ? 1 : 0);
      e = this.O.jd ? (this.Lm ? 1 : 1.75) : 1;
      this.zb[0].na(e);
      this.zb[1].na(e);
      this.dc.H(e);
      3 < a.x / a.y &&
        ((a = this.dc),
        a.H(0.75 * a.Qa),
        (a = this.zb[0]),
        a.na(0.75 * a.Qa),
        (a = this.zb[1]),
        a.na(0.75 * a.Qa));
    }
    animate(a) {
      this.Ba[0].na((1 - a) * this.vs[0]);
      this.Ba[1].na((-1 + a) * this.vs[1]);
      this.Ba[0].o(this.Wr[0] - a * this.ke[0].ka());
      this.Ba[1].o(this.Wr[1] + a * this.ke[1].ka());
      null != this.Jn && (this.Jn.Ow(-a), this.Ba[1].hp(this.Jn));
      let b = this.O.jd ? (this.Lm ? 1 : 1.75) : 1;
      this.ke[0].na(a);
      this.ke[0].o(this.Ba[0].wa() + this.Ba[0].ka());
      this.ke[1].na(a);
      this.ke[1].o(this.Ba[1].wa() - this.Ba[1].ka() - this.ke[1].ka());
      this.zb[0].na((1 - a) * b);
      this.zb[0].o(this.ke[0].wa());
      this.zb[0].W(1 - a);
      this.zb[1].na((1 - a) * b);
      this.zb[1].o(this.ke[1].wa() + this.ke[1].ka());
      this.zb[1].W(1 - a);
      this.Nc.W(0.5 * (1 - a));
    }
  }
  Ya.i = !0;
  Ya.s = da;
  Object.assign(Ya.prototype, { l: Ya });
  class gf {
    constructor(a, b) {
      this.rect = new Oc(a);
      this.rect.Lb(b.B - b.A, b.G - b.D);
      a = this.rect.Db;
      a.translate.x = b.A;
      a.translate.y = b.D;
      a.K = (a.K & -2) | 496;
    }
    Ub(a) {
      Ja.Xf(this.rect);
      this.rect.pe();
      return this.rect.Ub(a);
    }
  }
  gf.i = !0;
  Object.assign(gf.prototype, { l: gf });
  class Cc extends da {
    constructor() {
      super();
      this.Na = new y(null, r.Wa, k.Nt);
      this.label = new na(null, r.ic);
    }
    Pa(a) {
      this.label.Pa(a);
      this.layout();
    }
    Jr() {
      let a = this.parent;
      a.node.P(this.Na.u);
      a.node.P(this.label.u);
    }
    layout() {
      var a = this.parent,
        b = a.fa.ka();
      a = Math.min(0.1 * a.fa.gB().x, 0.1 * a.fa.gB().y);
      this.Na.H(a / this.Na.X.x);
      this.Na.o(b - this.Na.ka() - 20);
      this.Na.m(20);
      b = 0.1 * this.Na.ja();
      this.label.rb(300, this.Na.ja() - 2 * b);
      this.label.Eb(1, 0);
      this.label.o(this.Na.wa() - 300);
      this.label.m(this.Na.Sa() + b);
      this.label.Uf();
    }
  }
  Cc.i = !0;
  Cc.s = da;
  Object.assign(Cc.prototype, { l: Cc });
  class Sc extends za {
    constructor(a, b, c, d) {
      super(a, b, c);
      this.AL = d;
      this.jm = !1;
      this.time = Math.random();
      this.$("ENoAd");
    }
    FD(a) {
      switch (this.state) {
        case "EAd":
          this.$(a ? "EAd" : "ENoAd");
          break;
        case "ENoAd":
          this.$(a ? "EAd" : "ENoAd");
      }
    }
    use() {
      this.count--;
      0 == this.count && (this.badge.F(), (this.badge = null));
    }
    fill(a) {
      this.count = a;
      this.$("EFilled");
    }
    reject() {
      this.$("ENoAd");
    }
    $(a) {
      if (this.state != a)
        switch (((this.state = a), this.state)) {
          case "EActive":
            a = new y(null, r.Wa, this.AL);
            a.ix("glow");
            let b = new oa();
            b.Ka(0, 0);
            b.Ka(1, 0.5);
            b.Ka(0, 1);
            new Aa(a).loop(b);
            this.j.appendChild(a);
            null != this.badge && this.j.Cm(this.badge);
            break;
          case "EAd":
            this.re = new y(null, r.Wa, "ads_icon");
            this.re.o(120);
            this.re.m(120);
            this.re.C();
            this.j.appendChild(this.re);
            this.j.W(1);
            this.Ad(!1);
            break;
          case "EFilled":
            this.Ad(!1);
            null != this.re && (this.re.F(), (this.re = null));
            this.badge = new na(this.j, r.ic);
            this.badge.rb(60, 60);
            this.badge.o(105);
            this.badge.m(70);
            this.badge.cp();
            this.badge.Pa(Da.Dd(this.count));
            this.badge.Uf(!1);
            break;
          case "ENoAd":
            this.j.W(0.5),
              this.Ad(!0),
              null != this.re && (this.re.F(), (this.re = null));
        }
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case "EAd":
          null != this.re &&
            3 < this.time &&
            !this.jm &&
            (this.re.m(100), this.re.Sb().y(110, 1, ua.Pu()), (this.time = 0));
          this.j.W(this.jm ? 0.5 : 1);
          break;
        case "EFilled":
          this.j.W(this.jm ? 0.5 : 1);
      }
    }
    reset() {
      super.reset();
      let a = this.j.Zn("glow");
      null != a && a.F();
      this.jm = !1;
      switch (this.state) {
        case "EActive":
        case "EAd":
        case "ERequested":
          this.$("ENoAd");
      }
    }
    select() {
      super.select();
      this.je = 0;
      switch (this.state) {
        case "EActive":
        case "EAd":
          this.$("ERequested");
          break;
        case "EFilled":
          this.$("EActive");
      }
    }
    Ad(a) {
      switch (this.state) {
        case "EActive":
        case "ENoAd":
          a = !0;
      }
      super.Ad(a);
    }
    ja() {
      return this.T.ja();
    }
    qv() {
      return this.j.wa() + this.T.ka() * this.j.Qa;
    }
    ka() {
      return this.T.ka() * this.j.Qa;
    }
  }
  Sc.i = !0;
  Sc.s = za;
  Object.assign(Sc.prototype, { l: Sc });
  class Qb extends Sc {
    constructor() {
      super(r.Wa, k.$y, k.az, k.nK);
      0 < Qb.Lf && this.fill(Qb.Lf);
    }
    fill(a) {
      Qb.Lf = a;
      super.fill(a);
    }
    use() {
      super.use();
      Qb.Lf--;
    }
    $(a) {
      super.$(a);
      switch (this.state) {
        case "EActive":
          this.frame = k.$y;
          this.Fl = k.az;
          this.T.Fb(this.frame);
          break;
        case "EFilled":
          (this.frame = k.oK), (this.Fl = k.pK), this.T.Fb(this.frame);
      }
    }
  }
  Qb.i = !0;
  Qb.s = Sc;
  Object.assign(Qb.prototype, { l: Qb });
  class Rb extends Sc {
    constructor() {
      super(r.Wa, k.Xy, k.Yy, k.iK);
      0 < Rb.Lf && this.fill(Rb.Lf);
    }
    fill(a) {
      Rb.Lf = a;
      super.fill(a);
    }
    use() {
      super.use();
      Rb.Lf--;
    }
    $(a) {
      super.$(a);
      switch (this.state) {
        case "EActive":
          this.frame = k.Xy;
          this.Fl = k.Yy;
          break;
        case "EFilled":
          (this.frame = k.jK), (this.Fl = k.kK), this.T.Fb(this.frame);
      }
    }
  }
  Rb.i = !0;
  Rb.s = Sc;
  Object.assign(Rb.prototype, { l: Rb });
  class Ob extends za {
    constructor(a, b, c) {
      super(null, a, b);
      this.wc = new na(null, r.ic);
      this.wc.rb(this.T.X.x - 80, this.T.X.y - 50);
      this.wc.o(40);
      this.wc.m(25);
      this.wc.Pa(c);
      this.wc.Eb(0, 0);
      this.wc.Uf(!1);
      this.j.appendChild(this.wc);
    }
    aF() {
      this.wc.Tf(r.ic);
      this.wc.rb(this.T.X.x - 80, this.T.X.y - 50);
      this.wc.Eb(0, 0);
    }
    OD(a) {
      this.wc.cp();
      this.wc.Pa(a);
      this.wc.Uf();
    }
    static jl(a) {
      return new Ob(k.yK, k.zK, a);
    }
  }
  Ob.i = !0;
  Ob.s = za;
  Object.assign(Ob.prototype, { l: Ob });
  class ni {}
  ni.i = !0;
  class Yh {
    constructor(a, b) {
      this.type = a;
      this.listener = b;
      this.flags = 1;
    }
  }
  Yh.i = !0;
  Object.assign(Yh.prototype, { l: Yh });
  class ih {
    constructor() {
      this.Zi = new t(0, 0);
      this.g = new t(0, 0);
      this.dir = new t(0, 0);
      this.Vs = this.Zr = 0;
      this.color = new db(0, 0, 0, 0);
      this.ai = new db(0, 0, 0, 0);
      this.angle = this.xq = this.xr = this.Wc = this.size = 0;
      this.scale = this.alpha = 1;
      this.height = this.width = 0;
    }
  }
  ih.i = !0;
  Object.assign(ih.prototype, { l: ih });
  class jh {
    constructor(a, b, c) {
      this.x = a;
      this.y = b;
      this.size = c;
    }
  }
  jh.i = !0;
  Object.assign(jh.prototype, { l: jh });
  ma.tt |= 0;
  "undefined" != typeof performance &&
    "function" == typeof performance.now &&
    (ta.now = performance.now.bind(performance));
  null == String.fromCodePoint &&
    (String.fromCodePoint = function (a) {
      return 65536 > a
        ? String.fromCharCode(a)
        : String.fromCharCode((a >> 10) + 55232) +
            String.fromCharCode((a & 1023) + 56320);
    });
  Object.defineProperty(String.prototype, "__class__", {
    value: String,
    enumerable: !1,
    writable: !0,
  });
  String.i = !0;
  Array.i = !0;
  Date.prototype.l = Date;
  Date.i = "Date";
  var Lj = {},
    Jj = {},
    Kj = Number,
    Ij = Boolean,
    Mj = {},
    Nj = {};
  Wa.pL = {}.toString;
  var af = "en de fr ru nl br it es ko ja".split(" "),
    yi = [
      0, 30, 80, 170, 230, 0, 40, 90, 150, 200, 0, 40, 90, 150, 200, 270, 350,
    ],
    vi = [
      3, 31, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 19351, 64407, 123823,
      260791, 375463, 633511, 1117095,
    ];
  k.wF = "blink/0000";
  k.xF = "blink/";
  k.yF = "chew/";
  k.zF = "fail/";
  k.DF = "idle/";
  k.AF = "idle2/0000";
  k.BF = "idle2/";
  k.CF = "idle3/";
  k.EF = "excited/";
  k.FF = "greeting/";
  k.ey = "mouth_close/";
  k.GF = "mouth_open/";
  k.HF = "puzzled/";
  k.IF = "sleeping/";
  k.JF = "super_in/";
  k.LF = "super_loop/";
  k.KF = "super_loop_active/";
  k.gy = "zzz/";
  k.VG = "0000";
  k.WG = "0001";
  k.XG = "0002";
  k.YG = "0019";
  k.ZG = "0020";
  k.$G = "0021";
  k.cI = "disappear/0000";
  k.dI = "disappear/";
  k.eI = "glow";
  k.fI = "glow_blue";
  k.jI = "idle/";
  k.gI = "idle/0001";
  k.iI = "idle_blue/";
  k.hI = "idle_blue/0001";
  k.lI = "idle_off/";
  k.kI = "idle_off/0001";
  k.mI = "light_down/0000";
  k.nI = "light_down/";
  k.oI = "light_up/0000";
  k.pI = "light_up/";
  k.qI = "shine_blue";
  k.rI = "spark_blue";
  k.sI = "timer/0000";
  k.tI = "timer/";
  k.mH = "a_01";
  k.nH = "a_02";
  k.kH = "auto_01";
  k.lH = "auto_02";
  k.rH = "b_01";
  k.sH = "b_02";
  k.oH = "bar_0";
  k.pH = "bar_1";
  k.qH = "bar_2";
  k.Fy = "drag_button";
  k.tH = "drag_button_hot";
  k.uH = "wheel_active";
  k.vH = "wheel_bottom";
  k.wH = "wheel_rope";
  k.xH = "wheel_top";
  k.OG = "flight/0000";
  k.PG = "flight/";
  k.Dy = "idle";
  k.QG = "pop/0000";
  k.SG = "pop/";
  k.TG = "stain_01";
  k.UG = "stain_03";
  k.QH = "x1";
  k.RH = "x2";
  k.SH = "x3";
  k.TH = "x4";
  k.KH = "0000";
  k.NH = "0000";
  k.OH = "0011";
  k.PH = "0012";
  k.aH = "0000";
  k.Gy = "0000";
  k.LH = "0001";
  k.MH = "0002";
  k.KG = "x1/0000";
  k.LG = "x1/";
  k.MG = "x2/0000";
  k.NG = "x2/";
  k.Ey = "button0";
  k.jH = "button1";
  k.CG = "button0";
  k.DG = "button1";
  k.EG = "button2";
  k.FG = "button3";
  k.GG = "x1";
  k.HG = "x2";
  k.IG = "x3";
  k.JG = "x4";
  k.yG = "bee0000";
  k.AG = "bee";
  k.zG = "bee0001";
  k.BG = "pollen";
  k.HI = "center";
  k.Jy = "handle";
  k.Ky = "handle_hot";
  k.Ly = "highlight";
  k.II = "record";
  k.My = "sticker";
  k.hH = "body";
  k.Pp = "bubbles/";
  k.iH = "face";
  k.uI = "particle_1/";
  k.vI = "particle_2/";
  k.wI = "particle_3/";
  k.xI = "pipe";
  k.yI = "valve";
  k.yH = "fire";
  k.zH = "lantern_end";
  k.AH = "lantern_start";
  k.BH = "particle_1";
  k.CH = "particle_2";
  k.DH = "particle_3";
  k.EH = "particle_4";
  k.FH = "particle_5";
  k.bH = "cheese_hole";
  k.cH = "eyes/0000";
  k.dH = "eyes/";
  k.eH = "idle";
  k.fH = "mouse/0000";
  k.Op = "mouse/";
  k.gH = "mouse/0008";
  k.GH = "bottle";
  k.HH = "firefly/";
  k.IH = "light";
  k.JH = "top";
  k.zI = "0000";
  k.AI = "0001";
  k.BI = "0002";
  k.CI = "0003";
  k.DI = "0004";
  k.EI = "0005";
  k.FI = "0006";
  k.GI = "0007";
  k.UH = "flash";
  k.VH = "frame_bl";
  k.WH = "frame_br";
  k.Hy = "frame_hor_tile";
  k.XH = "frame_tl";
  k.YH = "frame_tr";
  k.Iy = "frame_ver_tile";
  k.ZH = "light_spot";
  k.$H = "particle";
  k.aI = "tips_glow";
  k.bI = "wave";
  k.dK = "sign/";
  k.eK = "album/album";
  k.fK = "album/popup_frame";
  k.gK = "album/spot";
  k.hK = "blue_star";
  k.Xy = "button_antimagnet";
  k.iK = "button_antimagnet_active";
  k.jK = "button_antimagnet_enabled";
  k.kK = "button_antimagnet_enabled_hot";
  k.Yy = "button_antimagnet_hot";
  k.Zy = "button_audio_x";
  k.lK = "button_back";
  k.mK = "button_back_hot";
  k.$y = "button_magnet";
  k.nK = "button_magnet_active";
  k.oK = "button_magnet_enabled";
  k.pK = "button_magnet_enabled_hot";
  k.az = "button_magnet_hot";
  k.qK = "button_music_hot";
  k.rK = "button_music_on";
  k.sK = "button_pause";
  k.tK = "button_pause_hot";
  k.uK = "button_restart";
  k.vK = "button_restart_hot";
  k.bz = "button_round";
  k.cz = "button_round_hot";
  k.Lt = "button_short";
  k.Mt = "button_short_hot";
  k.wK = "button_sound_hot";
  k.xK = "button_sound_on";
  k.Pk = "button_tiny";
  k.Qk = "button_tiny_hot";
  k.yK = "button_wide";
  k.zK = "button_wide_hot";
  k.dz = "candy/0000";
  k.AK = "candy/";
  k.ez = "candy/0002";
  k.BK = "famobi";
  k.CK = "gear_icon";
  k.DK = "hud_star/0000";
  k.EK = "hud_star/";
  k.FK = "level/blue_star";
  k.Nt = "level/blue_star_hud";
  k.GK = "level/locked";
  k.Tp = "level/playable";
  k.HK = "level/stars0";
  k.IK = "level/stars1";
  k.JK = "level/stars2";
  k.KK = "level/stars3";
  k.LK = "logo";
  k.MK = "logo_ru";
  k.NK = "menu_icon_round";
  k.fz = "menu_icon_tiny";
  k.OK = "monster_results";
  k.PK = "monster_sad1";
  k.QK = "monster_sad2";
  k.RK = "monster_sad3";
  k.SK = "music_icon";
  k.TK = "nav_next0";
  k.UK = "nav_next1";
  k.VK = "nav_prev0";
  k.gz = "nav_prev1";
  k.WK = "next_icon_tiny";
  k.XK = "play_icon_round";
  k.YK = "popup_bottom";
  k.ZK = "popup_button";
  k.$K = "popup_button_hot";
  k.aL = "popup_button_x";
  k.bL = "popup_middle";
  k.hz = "popup_top";
  k.iz = "restart_icon_tiny";
  k.cL = "skin_glow";
  k.dL = "skin_hand";
  k.eL = "sound_icon";
  k.fL = "star";
  k.gL = "star_empty";
  k.jz = "x_icon";
  k.hL = "xmas_hat_back";
  k.iL = "xmas_hat_front";
  k.jL = "zeptolab";
  k.QF = "tape0";
  k.RF = "tape1";
  k.PF = "roll";
  k.NF = "cutter";
  k.jJ = "season1";
  k.kJ = "season2";
  k.lJ = "season3";
  k.Jt = "shelf";
  k.mJ = "shelf_button";
  k.nJ = "shelf_button_hot";
  k.MI = "cover1";
  k.NI = "cover2";
  k.OI = "cover3";
  k.QI = "cover4";
  k.RI = "cover5";
  k.It = "lock";
  k.SI = "monster";
  k.Ry = "next";
  k.TI = "particle0";
  k.UI = "particle1";
  k.VI = "particle2";
  k.WI = "perfect";
  k.YI = "cover6";
  k.ZI = "cover7";
  k.$I = "cover8";
  k.aJ = "cover9";
  k.XI = "cover10";
  k.bJ = "cover11";
  k.cJ = "cover12";
  k.dJ = "cover13";
  k.eJ = "cover14";
  k.fJ = "cover15";
  k.gJ = "cover16";
  k.hJ = "cover17";
  k.iJ = "label";
  k.my = "front";
  k.ny = "side";
  J.Xr = !1;
  J.Hd = !1;
  J.We = !0;
  J.sP = 1;
  J.Fe = !0;
  J.HS = 1;
  J.np = !0;
  J.Xi = !1;
  J.Ff = 0;
  J.xl = 0;
  da.iw = new vb(4096, null, !0);
  ca.CD = !1;
  ub.Ej = !0;
  Xa.Sv = -1;
  Xa.Ej = !0;
  var xi = !1,
    Fd = !1,
    Zh = !1;
  D.Ua = 1;
  D.box = 1;
  D.level = 1;
  Pd.Qp = 1.2;
  x.$J = 1001;
  x.ZJ = 1002;
  x.YJ = 1003;
  x.XJ = 1004;
  x.Wy = 1005;
  x.WJ = 1006;
  x.VJ = 1007;
  x.UJ = 1008;
  x.TJ = 1009;
  x.SJ = 1010;
  x.RJ = 1013;
  x.Sp = 1014;
  x.Vy = 1015;
  x.QJ = 1016;
  x.PJ = 1017;
  x.OJ = 1018;
  x.NJ = 1019;
  x.MJ = 1020;
  x.LJ = 1021;
  x.KJ = 1022;
  x.JJ = 1023;
  x.IJ = 1024;
  x.HJ = 1025;
  x.GJ = 1026;
  x.Uy = 1031;
  x.FJ = 1036;
  x.EJ = 1037;
  x.DJ = 1042;
  x.CJ = 1043;
  x.BJ = 1044;
  x.Oh = 1045;
  x.Kt = 1046;
  x.AJ = 1047;
  x.zJ = 1048;
  x.yJ = 1049;
  x.xJ = 1050;
  x.wJ = 1051;
  x.vJ = 1052;
  x.Ok = 1053;
  x.uJ = 1058;
  x.tJ = 1059;
  x.sJ = 1060;
  x.Nh = 1061;
  x.rJ = 1062;
  x.Ty = 1063;
  x.qJ = 1064;
  r.Wl = [];
  Cd.VERSION = new ch("1.6.17");
  Cd.xG = "v1.6.17 2025-02-20 10:09:16 Generated by Haxe 4.3.4 polygonal";
  db.tS = new db(1, 1, 1, 1);
  db.qT = db.tS;
  U.iy = 1;
  U.jy = 2;
  U.hy = 4;
  U.ky = 8;
  Mb.Mk = 0.016666666666666666;
  t.tL = [];
  t.uL = [];
  M.ZL = !1;
  M.RB = -1;
  var Ci = 0.1,
    gj = k.Oa(k.iI, 0, 17, 20),
    Ei = 10,
    hj = k.Oa(k.LG, 0, 4, 25),
    ij = k.Oa(k.NG, 0, 4, 25),
    Gi = hb.create("" + k.Op + "@20,0-2"),
    Fi = hb.create("" + k.Op + "@20,3,4,8"),
    Ii = hb.create("" + k.Op + "@20,2,6,7,11"),
    Hi = hb.create("" + k.Op + "@20,8,9,10,11"),
    fi = null,
    jj = hb.create("" + k.dH + "@20,0-8");
  kb.LI = k.Oa(k.SG, 0, 11, 20);
  kb.$x = U.zm(new U(48, 48, 152, 152));
  kb.tF = -17;
  kb.sF = 20;
  zb.Yx = new U(142, 157, 112, 104);
  zb.Lp = U.zm(zb.Yx);
  var Ji = k.Oa(null, 8, 17, 15),
    kj = hb.create("18@3,18"),
    Fj = k.Oa(null, 21, 25, 20);
  oc.mF = k.Oa(k.PG, 0, 13, 20);
  pc.by = U.zm(new U(155, 176, 88, 76));
  Ia.yy = 100;
  var lj = k.Oa(k.AG, 1, 3, 33),
    gi = null,
    hi = null,
    Ki = null,
    Li = null,
    mj = k.Oa(k.HH, 0, 39, 20);
  de.Tv = [];
  Yb.bK = U.zm(new U(264, 350, 108, 2));
  Yb.Cy = 80;
  var Oi = [
      k.Oa(k.DF, 0, 18, 20),
      k.Oa(k.BF, 0, 24, 20),
      k.Oa(k.CF, 0, 15, 20),
      k.Oa(k.EF, 0, 19, 20),
      k.Oa(k.HF, 0, 26, 20),
      k.Oa(k.zF, 0, 12, 20),
      k.Oa(k.ey, 0, 3, 20),
      k.Oa(k.GF, 0, 8, 20),
      k.Oa(k.ey, 0, 3, 20),
      k.Oa(k.yF, 0, 8, 20),
      k.Oa(k.FF, 0, 29, 20),
      k.Oa(k.IF, 0, 6, 20),
      k.Oa(k.JF, 0, 15, 20),
      k.Oa(k.LF, 0, 8, 10),
      k.Oa(k.KF, 0, 8, 20),
    ],
    pj = hb.create("" + k.xF + "@20,0,1,0,1"),
    Mi = hb.create("" + k.gy + "@30,0-36,0x15"),
    Ni = hb.create("" + k.gy + "@30,0x15,0-36");
  Zb.rF = k.Oa(null, 1, 5, 20);
  Zb.Py = U.zm(new U(300, 300, 175, 175));
  Za.Sy = 56;
  Za.oJ = 6;
  Za.Nk = 16;
  Za.pJ = -6.4;
  var qh = hb.create("@20,2,3,3,4"),
    rj = hb.create("0-4@20,5@0.4,6@20"),
    sj = k.Oa(null, 7, 10, 10),
    tj = k.Oa(null, 1, 4, 20);
  bb.$f = 16.8;
  bb.aK = U.zm(new U(70, 64, 82, 82));
  var uj = k.Oa(k.jI, 0, 17, 20),
    vj = k.Oa(k.lI, 0, 17, 20),
    wj = k.Oa(k.pI, 0, 5, 20),
    xj = k.Oa(k.nI, 0, 5, 20),
    Gj = k.Oa(k.dI, 0, 12, 20),
    yj = k.Oa(k.uI, 0, 10, 20),
    zj = k.Oa(k.vI, 0, 10, 20),
    Aj = k.Oa(k.wI, 0, 10, 20);
  ee.rL = 0;
  var Pi = k.zI,
    th = k.AI,
    Bj = k.BI,
    Qi = k.CI,
    Si = k.DI,
    Dj = k.EI,
    Cj = k.FI,
    Ri = k.GI;
  ra.Rp = 36;
  ra.vF = 120;
  ra.uF = 240;
  ra.cK = 110;
  ra.en = 1.2000000000000002;
  ra.Ny = 0.9;
  ra.Ej = !0;
  var nj = 0,
    oj = 0;
  sd.NP = 1;
  nb.ly = 0;
  nb.SF = 3;
  nb.TYPE = 103;
  Zd.TYPE = 303;
  md.TYPE = 403;
  me.TYPE = 203;
  ha.TYPE = 105;
  ud.TYPE = 505;
  be.TYPE = 705;
  dg.TYPE = 1805;
  ne.TYPE = 1205;
  oe.TYPE = 305;
  Jc.OF = 4.800000000000001;
  Jc.TYPE = 1105;
  ce.TYPE = 605;
  eg.TYPE = 1705;
  rc.TYPE = 1005;
  od.TYPE = 905;
  pe.TYPE = 205;
  qe.TYPE = 405;
  fg.TYPE = 1605;
  gg.TYPE = 1405;
  hg.TYPE = 1505;
  (function () {
    pi.xy = Array(256);
    let a = 0;
    for (; 256 > a; ) {
      let b = a++;
      pi.xy[b] = Uc.fO(b);
    }
    return null;
  })(this);
  var qi = "#000000";
  lg.TYPE = 1305;
  Zi.JI = -1;
  mg.Yz = [1, 1, 2, 2, 4];
  $b.JE = new Float32Array(16);
  wd.ZN = [5120, 5121, 5122, 5123, 5126];
  Cb.gq = [0, 1, 774, 775, 770, 771, 772, 773];
  Cb.BM = [512, 513, 514, 515, 516, 517, 518, 519];
  qg.TYPE = 2005;
  rg.TYPE = 1905;
  sg.TYPE = 805;
  Xc.kL = [
    [0, 1, 1, 1, 0, 0, 1, 0],
    [1, 1, 0, 1, 1, 0, 0, 0],
  ];
  Bb.TYPE = 102;
  Nc.Ed = new F(0, 0, 0, 1);
  Nc.TYPE = 302;
  tg.TYPE = 402;
  se.TYPE = 202;
  te.TYPE = 502;
  qc.next = 0;
  Oa.count = 0;
  Oa.zM = 202;
  Oa.AM = 0;
  Oa.TYPE = 101;
  Va.count = 0;
  Va.TYPE = 201;
  xg.TYPE = 601;
  Lc.next = 0;
  yg.TYPE = 501;
  qb.count = 0;
  qb.TYPE = 301;
  Oc.TYPE = 401;
  Ja.qx = new mc();
  Ja.uS = new mc();
  pb.count = 0;
  pb.TYPE = 104;
  y.TYPE = 304;
  S.TYPE = 204;
  na.TYPE = 404;
  Mc.MF = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  Mc.ay = Ta.zC(Mc.MF);
  yd.vv = new DataView(new ArrayBuffer(8));
  var Pg = null,
    qj = 1e-6,
    nc = 57.29577951308232,
    La = 0.0174532925199432,
    Eb = 3.141592653589793,
    Xd = 1.5707963267948966,
    ei = 6.283185307179586,
    va = Infinity,
    wa = -Infinity,
    aj = -32768,
    zd = 2147483647,
    ue = 3.4e38,
    ve = -3.4e38;
  ac.Up = aj;
  var X = new Gg(),
    zi = k.Oa(k.EK, 0, 10, 25),
    ai = k.DK,
    fj = [0, 5, 6, 7, 8];
  Dc.rE = [k.HK, k.IK, k.JK, k.KK, k.FK];
  $a.yt = 784;
  $a.oy = $a.yt;
  $a.current = new t(0, $a.yt);
  Vc.Xz = 0;
  Ad.qG = "0123456789abcdef".split("");
  l.ib();
  l.Wz =
    "video/outro_portrait.mp4:606240 video/outro_landscape.mp4:707037 video/intro_portrait.mp4:254354 video/intro_landscape.mp4:364300 strings.json:47035 pics/thumbs.png:83668 pics/thumbs.json:4819 pics/thumbs.avif:30351 pics/thumbs-2x.png:280525 pics/thumbs-2x.json:4868 pics/thumbs-2x.avif:70263 pics/pic_21.jpg:151191 pics/pic_20.jpg:149085 pics/pic_19.jpg:87608 pics/pic_18.jpg:91082 pics/pic_17.jpg:106541 pics/pic_16.jpg:80658 pics/pic_15.jpg:64604 pics/pic_14.jpg:88490 pics/pic_13.jpg:119028 pics/pic_12.jpg:95377 pics/pic_11.jpg:95431 pics/pic_10.jpg:107394 pics/pic_09.jpg:94226 pics/pic_08.jpg:94333 pics/pic_07.jpg:111936 pics/pic_06.jpg:79570 pics/pic_05.jpg:85850 pics/pic_04.jpg:84859 pics/pic_03.jpg:81184 pics/pic_02.jpg:113893 pics/pic_01.jpg:119921 pics/missing.png:154822 pics/missing.avif:5712 pics/bg_xmas.jpg:259306 pics/bg.jpg:152419 menu/ui.png:396375 menu/ui.json:24561 menu/ui.avif:137885 menu/shadow.png:15280 menu/shadow.avif:2633 menu/seasons.png:153688 menu/seasons.json:1527 menu/seasons.avif:34025 menu/season3.png:231313 menu/season3.json:3097 menu/season3.avif:39252 menu/season2.png:231231 menu/season2.json:2700 menu/season2.avif:35274 menu/season1.png:250245 menu/season1.json:2699 menu/season1.avif:35761 menu/salute.png:32002 menu/salute.json:10858 menu/salute.avif:42068 menu/salute-2x.png:92937 menu/salute-2x.json:11193 menu/salute-2x.avif:78609 menu/cut.png:18928 menu/cut.json:1097 menu/cut.avif:6615 menu/cut-2x.png:60604 menu/cut-2x.json:1107 menu/cut-2x.avif:14906 menu/bg_xmas.jpg:126904 menu/bg2_xmas.png:155196 menu/bg2_xmas.avif:68280 menu/bg2.png:247796 menu/bg2.avif:83887 menu/bg.jpg:90340 loader_bg.jpg:22263 loader.png:16984 loader.dat:440 loader.avif:13186 lang/font-ru.png:68946 lang/font-ru.dat:6169 lang/font-ru.avif:52817 lang/font-nl.png:48288 lang/font-nl.dat:5609 lang/font-nl.avif:36366 lang/font-ko.png:163320 lang/font-ko.dat:14969 lang/font-ko.avif:121158 lang/font-ja.png:211458 lang/font-ja.dat:21469 lang/font-ja.avif:168476 lang/font-it.png:48936 lang/font-it.dat:5549 lang/font-it.avif:36585 lang/font-fr.png:50257 lang/font-fr.dat:5729 lang/font-fr.avif:37979 lang/font-es.png:50586 lang/font-es.dat:5709 lang/font-es.avif:38190 lang/font-en.png:48296 lang/font-en.dat:5589 lang/font-en.avif:36148 lang/font-de.png:51771 lang/font-de.dat:5729 lang/font-de.avif:38951 lang/font-br.png:53145 lang/font-br.dat:5849 lang/font-br.avif:40468 game/tut.png:27759 game/tut.json:2291 game/tut.avif:8244 game/obj_vinyl.png:34111 game/obj_vinyl.json:1497 game/obj_vinyl.avif:7320 game/obj_vinyl-2x.png:62064 game/obj_vinyl-2x.json:1523 game/obj_vinyl-2x.avif:14661 game/obj_transporter.png:1535 game/obj_transporter.json:1844 game/obj_transporter.avif:1159 game/obj_steam.png:9200 game/obj_steam.json:7334 game/obj_steam.avif:7957 game/obj_steam-2x.png:21885 game/obj_steam-2x.json:7380 game/obj_steam-2x.avif:13073 game/obj_star.png:116319 game/obj_star.json:24293 game/obj_star.avif:89923 game/obj_star-2x.png:354592 game/obj_star-2x.json:24689 game/obj_star-2x.avif:153837 game/obj_spikes.png:5674 game/obj_spikes.json:1081 game/obj_spikes.avif:6243 game/obj_spikes-2x.png:17960 game/obj_spikes-2x.json:1083 game/obj_spikes-2x.avif:10490 game/obj_spider.png:8232 game/obj_spider.json:2813 game/obj_spider.avif:7159 game/obj_spider-2x.png:24082 game/obj_spider-2x.json:2868 game/obj_spider-2x.avif:12205 game/obj_sp.png:24382 game/obj_sp.json:2637 game/obj_sp.avif:4498 game/obj_sp-2x.png:82882 game/obj_sp-2x.json:2661 game/obj_sp-2x.avif:8676 game/obj_sock.png:12333 game/obj_sock.json:1287 game/obj_sock.avif:4106 game/obj_sock-2x.png:35190 game/obj_sock-2x.json:1299 game/obj_sock-2x.avif:7669 game/obj_pump.png:10250 game/obj_pump.json:2081 game/obj_pump.avif:5534 game/obj_pump-2x.png:29141 game/obj_pump-2x.json:2085 game/obj_pump-2x.avif:9587 game/obj_lighter.png:17490 game/obj_lighter.json:8776 game/obj_lighter.avif:9038 game/obj_lighter-2x.png:56932 game/obj_lighter-2x.json:8867 game/obj_lighter-2x.avif:17301 game/obj_lantern.png:15236 game/obj_lantern.json:1912 game/obj_lantern.avif:7878 game/obj_lantern-2x.png:42472 game/obj_lantern-2x.json:1943 game/obj_lantern-2x.avif:12887 game/obj_hook.png:12919 game/obj_hook.json:3405 game/obj_hook.avif:7600 game/obj_hook-2x.png:37297 game/obj_hook-2x.json:3473 game/obj_hook-2x.avif:15050 game/obj_gravity.png:5221 game/obj_gravity.json:726 game/obj_gravity.avif:2706 game/obj_gravity-2x.png:14510 game/obj_gravity-2x.json:731 game/obj_gravity-2x.avif:4457 game/obj_ghost.png:5670 game/obj_ghost.json:1697 game/obj_ghost.avif:3868 game/obj_ghost-2x.png:12807 game/obj_ghost-2x.json:1711 game/obj_ghost-2x.avif:5544 game/obj_gap.png:16814 game/obj_gap.json:4839 game/obj_gap.avif:6761 game/obj_gap-2x.png:47790 game/obj_gap-2x.json:4898 game/obj_gap-2x.avif:11868 game/obj_electro.png:8545 game/obj_electro.json:1288 game/obj_electro.avif:10446 game/obj_electro-2x.png:30475 game/obj_electro-2x.json:1299 game/obj_electro-2x.avif:19955 game/obj_candy4.png:71722 game/obj_candy4.json:5300 game/obj_candy4.avif:19466 game/obj_candy4-2x.png:206179 game/obj_candy4-2x.json:5405 game/obj_candy4-2x.avif:37315 game/obj_candy3.png:72274 game/obj_candy3.json:5298 game/obj_candy3.avif:20168 game/obj_candy3-2x.png:208381 game/obj_candy3-2x.json:5405 game/obj_candy3-2x.avif:37953 game/obj_candy2.png:75319 game/obj_candy2.json:5308 game/obj_candy2.avif:20918 game/obj_candy2-2x.png:222774 game/obj_candy2-2x.json:5417 game/obj_candy2-2x.avif:38860 game/obj_candy1.png:81126 game/obj_candy1.json:5309 game/obj_candy1.avif:24470 game/obj_candy1-2x.png:234543 game/obj_candy1-2x.json:5431 game/obj_candy1-2x.avif:43647 game/obj_candy0.png:74349 game/obj_candy0.json:5308 game/obj_candy0.avif:21638 game/obj_candy0-2x.png:212961 game/obj_candy0-2x.json:5416 game/obj_candy0-2x.avif:40347 game/obj_bubble.png:37007 game/obj_bubble.json:6254 game/obj_bubble.avif:19815 game/obj_bubble-2x.png:107943 game/obj_bubble-2x.json:6344 game/obj_bubble-2x.avif:40808 game/obj_bouncer.png:15871 game/obj_bouncer.json:2285 game/obj_bouncer.avif:6517 game/obj_bouncer-2x.png:42679 game/obj_bouncer-2x.json:2311 game/obj_bouncer-2x.avif:11241 game/obj_blades.png:11087 game/obj_blades.json:1849 game/obj_blades.avif:8324 game/obj_blades-2x.png:26077 game/obj_blades-2x.json:1874 game/obj_blades-2x.avif:14498 game/obj_bee.png:3255 game/obj_bee.json:1289 game/obj_bee.avif:2463 game/obj_bee-2x.png:8439 game/obj_bee-2x.json:1297 game/obj_bee-2x.avif:4060 game/char3.png:125467 game/char3.json:16103 game/char3.avif:120310 game/char3-2x.png:370734 game/char3-2x.json:16192 game/char3-2x.avif:206896 game/char2.png:156278 game/char2.json:18737 game/char2.avif:136313 game/char2-2x.png:339748 game/char2-2x.json:18905 game/char2-2x.avif:239616 game/char1.png:145178 game/char1.json:17289 game/char1.avif:127645 game/char1-2x.png:306027 game/char1-2x.json:17381 game/char1-2x.avif:224163 box17/support.png:20935 box17/support.avif:3584 box17/maps.json:32447 box17/cover.png:94067 box17/cover.json:721 box17/cover.avif:11863 box17/bg.jpg:192584 box16/support.png:20889 box16/support.avif:4603 box16/maps.json:34665 box16/cover.png:111821 box16/cover.json:721 box16/cover.avif:8733 box16/bg.jpg:166366 box15/support.png:19248 box15/support.avif:2873 box15/maps.json:27278 box15/cover.png:121680 box15/cover.json:721 box15/cover.avif:3647 box15/bg.jpg:80627 box14/support.png:22796 box14/support.avif:4530 box14/maps.json:22757 box14/cover.png:117995 box14/cover.json:721 box14/cover.avif:17531 box14/bg.jpg:193042 box13/support.png:14277 box13/support.avif:3572 box13/maps.json:22768 box13/cover.png:102039 box13/cover.json:721 box13/cover.avif:10244 box13/bg.jpg:130490 box12/support.png:27855 box12/support.avif:3644 box12/maps.json:27095 box12/cover.png:163397 box12/cover.json:721 box12/cover.avif:12415 box12/bg.jpg:161968 box11/support.png:20124 box11/support.avif:5281 box11/maps.json:28386 box11/cover.png:147733 box11/cover.json:721 box11/cover.avif:35474 box11/bg.jpg:318137 box10/support.png:10900 box10/support.avif:3824 box10/maps.json:28775 box10/cover.png:142967 box10/cover.json:721 box10/cover.avif:33681 box10/bg.jpg:291192 box09/support.png:18151 box09/support.avif:4523 box09/maps.json:27367 box09/cover.png:127769 box09/cover.json:721 box09/cover.avif:28967 box09/bg.jpg:290591 box08/support.png:17382 box08/support.avif:4089 box08/maps.json:30526 box08/earth.png:37193 box08/earth.avif:4882 box08/cover.png:154083 box08/cover.json:721 box08/cover.avif:31701 box08/bg.jpg:261876 box07/support.png:17646 box07/support.avif:4297 box07/maps.json:28759 box07/cover.png:176165 box07/cover.json:721 box07/cover.avif:39919 box07/bg.jpg:276708 box06/support.png:24856 box06/support.avif:3389 box06/maps.json:23787 box06/cover.png:191492 box06/cover.json:721 box06/cover.avif:45432 box06/bg.jpg:302842 box05/support.png:19451 box05/support.avif:5872 box05/maps.json:28121 box05/cover.png:112297 box05/cover.json:721 box05/cover.avif:57943 box05/bg.jpg:327075 box04/support.png:23898 box04/support.avif:5691 box04/maps.json:28874 box04/cover.png:174462 box04/cover.json:721 box04/cover.avif:37968 box04/bg.jpg:297536 box03/support.png:21077 box03/support.avif:4881 box03/maps.json:28624 box03/cover.png:144475 box03/cover.json:721 box03/cover.avif:32034 box03/bg.jpg:271789 box02/support.png:23502 box02/support.avif:5663 box02/maps.json:28645 box02/cover.png:141431 box02/cover.json:721 box02/cover.avif:26487 box02/bg.jpg:292429 box01/support.png:12953 box01/support.avif:4676 box01/maps.json:53856 box01/cover.png:178457 box01/cover.json:721 box01/cover.avif:40419 box01/bg.jpg:224627 audio/ogg/sound.ogg:250686 audio/ogg/menu_music_xmas.ogg:435372 audio/ogg/menu_music.ogg:431450 audio/ogg/game_music_xmas.ogg:872474 audio/ogg/game_music.ogg:509573 audio/aac/sound.aac:334758 audio/aac/menu_music_xmas.aac:269307 audio/aac/menu_music.aac:264168 audio/aac/game_music_xmas.aac:476705 audio/aac/game_music.aac:286076".split(
      " "
    );
  l.Kp = "res";
  l.MAX = 204;
  l.QQ = [50, 51, 52];
  l.Ce =
    "video/outro_portrait.mp4 video/outro_landscape.mp4 video/intro_portrait.mp4 video/intro_landscape.mp4 strings.json pics/thumbs{resolution}.{image} pics/thumbs{resolution}.json pics/pic_21.jpg pics/pic_20.jpg pics/pic_19.jpg pics/pic_18.jpg pics/pic_17.jpg pics/pic_16.jpg pics/pic_15.jpg pics/pic_14.jpg pics/pic_13.jpg pics/pic_12.jpg pics/pic_11.jpg pics/pic_10.jpg pics/pic_09.jpg pics/pic_08.jpg pics/pic_07.jpg pics/pic_06.jpg pics/pic_05.jpg pics/pic_04.jpg pics/pic_03.jpg pics/pic_02.jpg pics/pic_01.jpg pics/missing.{image} pics/bg_xmas.jpg pics/bg.jpg menu/ui.{image} menu/ui.json menu/shadow.{image} menu/seasons.{image} menu/seasons.json menu/season3.{image} menu/season3.json menu/season2.{image} menu/season2.json menu/season1.{image} menu/season1.json menu/salute{resolution}.{image} menu/salute{resolution}.json menu/cut{resolution}.{image} menu/cut{resolution}.json menu/bg_xmas.jpg menu/bg2_xmas.{image} menu/bg2.{image} menu/bg.jpg loader_bg.jpg loader.{image} loader.dat lang/font{language}.{image} lang/font{language}.dat game/tut.{image} game/tut.json game/obj_vinyl{resolution}.{image} game/obj_vinyl{resolution}.json game/obj_transporter.{image} game/obj_transporter.json game/obj_steam{resolution}.{image} game/obj_steam{resolution}.json game/obj_star{resolution}.{image} game/obj_star{resolution}.json game/obj_spikes{resolution}.{image} game/obj_spikes{resolution}.json game/obj_spider{resolution}.{image} game/obj_spider{resolution}.json game/obj_sp{resolution}.{image} game/obj_sp{resolution}.json game/obj_sock{resolution}.{image} game/obj_sock{resolution}.json game/obj_pump{resolution}.{image} game/obj_pump{resolution}.json game/obj_lighter{resolution}.{image} game/obj_lighter{resolution}.json game/obj_lantern{resolution}.{image} game/obj_lantern{resolution}.json game/obj_hook{resolution}.{image} game/obj_hook{resolution}.json game/obj_gravity{resolution}.{image} game/obj_gravity{resolution}.json game/obj_ghost{resolution}.{image} game/obj_ghost{resolution}.json game/obj_gap{resolution}.{image} game/obj_gap{resolution}.json game/obj_electro{resolution}.{image} game/obj_electro{resolution}.json game/obj_candy4{resolution}.{image} game/obj_candy4{resolution}.json game/obj_candy3{resolution}.{image} game/obj_candy3{resolution}.json game/obj_candy2{resolution}.{image} game/obj_candy2{resolution}.json game/obj_candy1{resolution}.{image} game/obj_candy1{resolution}.json game/obj_candy0{resolution}.{image} game/obj_candy0{resolution}.json game/obj_bubble{resolution}.{image} game/obj_bubble{resolution}.json game/obj_bouncer{resolution}.{image} game/obj_bouncer{resolution}.json game/obj_blades{resolution}.{image} game/obj_blades{resolution}.json game/obj_bee{resolution}.{image} game/obj_bee{resolution}.json game/char3{resolution}.{image} game/char3{resolution}.json game/char2{resolution}.{image} game/char2{resolution}.json game/char1{resolution}.{image} game/char1{resolution}.json box17/support.{image} box17/maps.json box17/cover.{image} box17/cover.json box17/bg.jpg box16/support.{image} box16/maps.json box16/cover.{image} box16/cover.json box16/bg.jpg box15/support.{image} box15/maps.json box15/cover.{image} box15/cover.json box15/bg.jpg box14/support.{image} box14/maps.json box14/cover.{image} box14/cover.json box14/bg.jpg box13/support.{image} box13/maps.json box13/cover.{image} box13/cover.json box13/bg.jpg box12/support.{image} box12/maps.json box12/cover.{image} box12/cover.json box12/bg.jpg box11/support.{image} box11/maps.json box11/cover.{image} box11/cover.json box11/bg.jpg box10/support.{image} box10/maps.json box10/cover.{image} box10/cover.json box10/bg.jpg box09/support.{image} box09/maps.json box09/cover.{image} box09/cover.json box09/bg.jpg box08/support.{image} box08/maps.json box08/earth.{image} box08/cover.{image} box08/cover.json box08/bg.jpg box07/support.{image} box07/maps.json box07/cover.{image} box07/cover.json box07/bg.jpg box06/support.{image} box06/maps.json box06/cover.{image} box06/cover.json box06/bg.jpg box05/support.{image} box05/maps.json box05/cover.{image} box05/cover.json box05/bg.jpg box04/support.{image} box04/maps.json box04/cover.{image} box04/cover.json box04/bg.jpg box03/support.{image} box03/maps.json box03/cover.{image} box03/cover.json box03/bg.jpg box02/support.{image} box02/maps.json box02/cover.{image} box02/cover.json box02/bg.jpg box01/support.{image} box01/maps.json box01/cover.{image} box01/cover.json box01/bg.jpg audio/{audio}/sound.{audio} audio/{audio}/menu_music_xmas.{audio} audio/{audio}/menu_music.{audio} audio/{audio}/game_music_xmas.{audio} audio/{audio}/game_music.{audio}".split(
      " "
    );
  l.rQ =
    "pics/thumbs.avif pics/thumbs.png pics/thumbs.json menu/salute.avif menu/salute.png menu/salute.json menu/cut.avif menu/cut.png menu/cut.json game/obj_vinyl.avif game/obj_vinyl.png game/obj_vinyl.json game/obj_steam.avif game/obj_steam.png game/obj_steam.json game/obj_star.avif game/obj_star.png game/obj_star.json game/obj_spikes.avif game/obj_spikes.png game/obj_spikes.json game/obj_spider.avif game/obj_spider.png game/obj_spider.json game/obj_sp.avif game/obj_sp.png game/obj_sp.json game/obj_sock.avif game/obj_sock.png game/obj_sock.json game/obj_pump.avif game/obj_pump.png game/obj_pump.json game/obj_lighter.avif game/obj_lighter.png game/obj_lighter.json game/obj_lantern.avif game/obj_lantern.png game/obj_lantern.json game/obj_hook.avif game/obj_hook.png game/obj_hook.json game/obj_gravity.avif game/obj_gravity.png game/obj_gravity.json game/obj_ghost.avif game/obj_ghost.png game/obj_ghost.json game/obj_gap.avif game/obj_gap.png game/obj_gap.json game/obj_electro.avif game/obj_electro.png game/obj_electro.json game/obj_candy4.avif game/obj_candy4.png game/obj_candy4.json game/obj_candy3.avif game/obj_candy3.png game/obj_candy3.json game/obj_candy2.avif game/obj_candy2.png game/obj_candy2.json game/obj_candy1.avif game/obj_candy1.png game/obj_candy1.json game/obj_candy0.avif game/obj_candy0.png game/obj_candy0.json game/obj_bubble.avif game/obj_bubble.png game/obj_bubble.json game/obj_bouncer.avif game/obj_bouncer.png game/obj_bouncer.json game/obj_blades.avif game/obj_blades.png game/obj_blades.json game/obj_bee.avif game/obj_bee.png game/obj_bee.json game/char3.avif game/char3.png game/char3.json game/char2.avif game/char2.png game/char2.json game/char1.avif game/char1.png game/char1.json".split(
      " "
    );
  l.iO = [];
  l.BP = [
    1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1,
  ];
  l.lz = 0;
  l.kz = 1;
  l.Qt = 2;
  l.Pt = 3;
  l.Ph = 4;
  l.Ht = 5;
  l.KI = 6;
  l.Gt = 28;
  l.Oy = 29;
  l.Ft = 30;
  l.hf = 31;
  l.Og = 32;
  l.Mh = 33;
  l.Et = 34;
  l.wG = 35;
  l.Dt = 36;
  l.vG = 37;
  l.Ct = 38;
  l.uG = 39;
  l.Bt = 40;
  l.tG = 41;
  l.Np = 42;
  l.sG = 43;
  l.Mp = 44;
  l.By = 45;
  l.Ay = 46;
  l.zy = 47;
  l.At = 48;
  l.Lh = 49;
  l.wy = 50;
  l.zt = 51;
  l.Xd = 53;
  l.Zf = 54;
  l.vy = 55;
  l.pG = 56;
  l.dn = 57;
  l.oG = 58;
  l.cn = 59;
  l.nG = 60;
  l.bn = 61;
  l.mG = 62;
  l.uy = 63;
  l.lG = 64;
  l.an = 65;
  l.jG = 66;
  l.$m = 67;
  l.iG = 68;
  l.xt = 69;
  l.kG = 70;
  l.Zm = 71;
  l.hG = 72;
  l.Ym = 73;
  l.gG = 74;
  l.ij = 75;
  l.fG = 76;
  l.Xm = 77;
  l.eG = 78;
  l.ty = 79;
  l.dG = 80;
  l.hj = 81;
  l.cG = 82;
  l.wt = 83;
  l.bG = 84;
  l.Wm = 85;
  l.aG = 86;
  l.Vm = 87;
  l.$F = 88;
  l.Um = 99;
  l.ZF = 100;
  l.Tm = 101;
  l.YF = 102;
  l.vt = 103;
  l.XF = 104;
  l.ut = 105;
  l.WF = 106;
  l.Sm = 107;
  l.VF = 108;
  l.qy = 109;
  l.UF = 110;
  l.py = 111;
  l.TF = 112;
  l.Zx = 160;
  l.Ng = 199;
  l.qF = 200;
  l.pF = 201;
  l.oF = 202;
  l.nF = 203;
  Q.Qb = new Kc();
  Qc.GA = !0;
  Qb.Lf = 0;
  Rb.Lf = 0;
  ni.rG = [
    0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767,
    65535, 131071, 262143, 524287, 1048575, 2097151, 4194303, 8388607, 16777215,
    33554431, 67108863, 134217727, 268435455, 536870911, 1073741823, 2147483647,
    -1,
  ];
})(
  "undefined" != typeof exports
    ? exports
    : "undefined" != typeof window
    ? window
    : "undefined" != typeof self
    ? self
    : this,
  "undefined" != typeof window
    ? window
    : "undefined" != typeof global
    ? global
    : "undefined" != typeof self
    ? self
    : this
);
//# sourceMappingURL=ctrr.js.map
