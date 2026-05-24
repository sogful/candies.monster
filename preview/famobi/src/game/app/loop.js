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
