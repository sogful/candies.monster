  class Insets {
    constructor(a, b, c, d) {
      this.left = a;
      this.right = b;
      this.top = c;
      this.bottom = d;
    }
  }
  Insets.i = true;
  Object.assign(Insets.prototype, {
    l: Insets
  });
  class C173 {
    constructor() {
      this.size = new Size(0, 0);
      this.renderer = null;
    }
    setRenderer(a) {
      this.renderer = a;
    }
    resize(a, b) {
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
      this.canvasSize = new Size(0, 0);
      this.events = new EventEmitter();
      this.visible = true;
      this.lostContextFlag = this.focused = false;
    }
    addListener(a, b) {
      return this.events.addListener(a, b);
    }
    viewportRect() {
      let a = this.renderer.viewport;
      let b = this.canvasSize.x;
      let c = this.canvasSize.y;
      return new TexRect(a.x * b | 0, a.y * c | 0, a.w * b | 0, a.h * c | 0);
    }
    viewportSize() {
      let a = this.renderer.viewport;
      return new Size(this.canvasSize.x * a.w | 0, this.canvasSize.y * a.h | 0);
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
      this.canvasId = a;
      this.context = null;
      this.focused = false;
      this.events_pool = [];
      this.isIOS = new EReg("(iPad|iPhone)", "g").match(host.navigator.platform);
      this.lastSize = new Size(-1, -1);
      this.resizeObserver = this.fullscreenSize = null;
      this.clearObserver();
      this.scale = 1;
      this.installListeners();
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
    pixelRatio() {
      return window.devicePixelRatio;
    }
    clearObserver() {
      if (this.resizeObserver != null) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
      this.observerActive = false;
    }
    initContext(a) {
      if (a == null) {
        a = {
          willReadFrequently: false
        };
      }
      this.context = this.canvas.getContext("2d", a);
      this.canvas.addEventListener("contextlost", function () {});
      this.canvas.addEventListener("contextrestored", function () {});
    }
    install(a) {
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
    aspectRatio() {
      let a = this.viewportSize();
      return a.x / a.y;
    }
    getContext() {
      return this.context;
    }
    setResolution(a) {
      this.lastSize = new Size(-1, -1);
      this.scale = a;
      this.update();
    }
    update() {
      this.lostContextFlag = false;
      var a = this.canvas.clientWidth;
      var b = this.canvas.clientHeight;
      if (a != 0 && b != 0 && (this.fullscreenSize != null && (a = this.fullscreenSize.x, b = this.fullscreenSize.y), this.lastSize.x != a || this.lastSize.y != b)) {
        var c = this.lastSize;
        c.x = a;
        c.y = b;
        this.canvasSize.x = a * this.pixelRatio() | 0;
        this.canvasSize.y = b * this.pixelRatio() | 0;
        b = this.scale == 0 ? this.pixelRatio() : this.scale;
        a = this.canvasSize.x / b | 0;
        b = this.canvasSize.y / b | 0;
        this.canvas.width = a;
        this.canvas.height = b;
        this.resize(a, b);
        this.lostContextFlag = true;
        this.events.emit(0);
      }
    }
    supportsFullscreen() {
      try {
        if (this.isIOS) {
          return false;
        } else {
          return document.fullscreenEnabled;
        }
      } catch (a) {
        return false;
      }
    }
    installListeners() {
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
      if (this.supportsFullscreen()) {
        this.addDomListener(window.document, "fullscreenchange", function () {
          a.Vq = document.Vq;
          a.events.emit(a.Vq ? 3 : 4);
        });
      }
      if (this.isIOS) {
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
      this.events_pool.push(d);
      a.addEventListener(b, c);
    }
  }
  Viewport.i = true;
  Viewport.s = C174;
  Object.assign(Viewport.prototype, {
    l: Viewport
  });
