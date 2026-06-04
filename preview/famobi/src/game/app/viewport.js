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
