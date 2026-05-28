  // FpsMeter - rolling per-second framerate count. update() increments
  // a frame counter each call; once a second of `time` has accumulated
  // it stamps the count into a [0..60] histogram and resets.
  class FpsMeter {
    constructor() {
      this.current = 60;
      let buckets = [];
      let i = 0;
      while (i < 60) {
        ++i;
        buckets.push(0);
      }
      this.values = buckets;
      this.time = this.frameCount = 0;
    }
    update(dt) {
      this.time += dt;
      if (this.time > 1) {
        this.current = Math.min(this.frameCount, 60);
        this.values[this.current - 1]++;
        this.frameCount = 0;
        --this.time;
      }
      this.frameCount++;
    }
  }
  FpsMeter.i = true;
  Object.assign(FpsMeter.prototype, {
    l: FpsMeter
  });

  // LoadProgress - aggregates an async loader (`yd`) and the set of
  // resource ids it's expected to deliver (`Ce`). er() = percent done
  // (rounded, capped at 99 until everything is actually in memory).
  // xv() = "done", Tj() = "some id is still missing from the cache".
  class LoadProgress {
    constructor(loader, ids) {
      this.loader = loader;
      this.ids = ids;
    }
    percent() {
      if (this.ids.length == 0) {
        return 100;
      }
      let pct = Math.round(this.loader.progress(this.ids) * 100);
      if (this.hasMissing()) {
        --pct;
      }
      if (pct < 0) {
        pct = 0;
      }
      return pct;
    }
    isDone() {
      if (this.ids.length != 0) {
        if (this.loader.progress() == 1) {
          return !this.hasMissing();
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
    hasMissing() {
      let i = 0;
      let ids = this.ids;
      while (i < ids.length) {
        if (!Loader.isLoaded(Loader.idByName(ids[i++]))) {
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

  // FixedTimestep - timing config; Rk is the static default step.
  class FixedTimestep {
    constructor() {
      this.accum = FixedTimestep.STEP;
      this.elapsedTime = 0;
      this.scale = 1;
    }
  }
  FixedTimestep.i = true;
  Object.assign(FixedTimestep.prototype, {
    l: FixedTimestep
  });

  // MainLoop - rAF-driven game loop. zs=running, Zu=first-tick flag (so
  // the first `dt` doesn't include the gap between start() and the
  // first rAF callback). Subclasses override tick(dt) to advance the app.
  class MainLoop {
    constructor() {
      this.elapsedTime = 0;
      this.running = false;
      this.handle = -1;
      this.now = 0;
      this.firstTick = true;
      this.startTime = 0;
    }
    tick() {}
    start() {
      if (!this.running) {
        this.stop();
        this.running = true;
        var tick = null;
        v10 = window;
        var raf = cachedBind(v10, v10.requestAnimationFrame);
        var self = this;
        tick = function (timestamp) {
          self.handle = raf(tick);
          if (self.Zu) {
            self.startTime = timestamp;
            self.now = timestamp;
            self.Zu = false;
          } else {
            let dtMs = timestamp - self.now;
            self.now = timestamp;
            self.elapsedTime = (timestamp - self.startTime) / 1000;
            self.tick(dtMs / 1000);
          }
        };
        this.handle = raf(tick);
      }
    }
    stop() {
      if (this.running) {
        this.firstTick = true;
        if (!(this.handle < 0)) {
          window.cancelAnimationFrame(this.handle);
          this.handle = -1;
          this.running = false;
        }
      }
    }
  }
  MainLoop.i = true;
  Object.assign(MainLoop.prototype, {
    l: MainLoop
  });
