  class Audio {
    // isRunning - true if the AudioContext exists and is unblocked.
    static isRunning() {
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
    // init - lazy-init AudioContext. iOS Safari sometimes locks the
    // context after backgrounding; the DelayedCall watchdog detects
    // currentTime not advancing and emits EContextBroken so callers
    // can recreate it.
    static init() {
      if (Audio.context != null) {
        Audio.closeContext();
        var a = Audio.watchdog;
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
        Audio.watchdog = new DelayedCall(1000);
        Audio.watchdog.tick = function () {
          if (Audio.context != null && Audio.isRunning()) {
            if (Audio.currentTime != null && Audio.currentTime == Audio.context.currentTime) {
              Audio.watchdog.stop();
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
          Audio.events.emit(Audio.isRunning() ? "EContextResumed" : "EContextSuspended");
        };
        Audio.events.emit("EContextCreated");
        if (!Audio.isRunning()) {
          Audio.installAutoplayHandlers();
        }
      } catch (b) {
        Audio.context = null;
      }
    }
    // isSupported - feature-test the AudioContext API once and cache
    // the result in Yx.
    static isSupported() {
      while (true) {
        if (Audio.supportCache != null) {
          return Audio.supportCache;
        }
        try {
          Audio.supportCache = !!window.AudioContext || !!window.webkitAudioContext;
        } catch (a) {
          Audio.supportCache = false;
        }
      }
    }
    // bestFormat - audio container probe (returns "ogg" / "mp3" /
    // "aac"). Stripped down to always "ogg" for this build since the
    // sound sprite was split into per-file ogg vorbis assets.
    static bestFormat() {
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
        return ObjectAccess.getField(c, b.canPlayType(h).replace(RegExp("^no$", ""), ""));
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
        if (ObjectAccess.getField(e, h) > 0) {
          return h;
        }
      }
      return null;
    }
    // closeContext - tear down the active AudioContext.
    static closeContext() {
      try {
        Audio.context.onstatechange = null;
        Audio.context.close();
      } catch (a) {}
      Audio.context = null;
    }
    static handleAutoplay(a) {
      a.preventDefault();
      if (Audio.context != null && Audio.context.state != "running") {
        Audio.context.resume().then(function () {}, function () {
          Audio.events.emit("EContextResumeRejected");
        });
      }
    }
    static installAutoplayHandlers() {
      window.addEventListener("mouseup", Audio.handleAutoplay);
      window.addEventListener("touchend", Audio.handleAutoplay);
    }
  }
  Audio.i = true;

  class SoundFx {
    static play(a, b) {
      if (b == null) {
        b = false;
      }
      if (Save.sfxOn) {
        Application.instance.audio.play(a, b);
      }
    }
    static stop(a) {
      Application.instance.audio.stop(a);
    }
    // setVolume - retarget the volume of an already-playing sound `a`
    // to `b` (instant, no ramp).
    static setVolume(a, b) {
      Application.instance.audio.setActiveVolume(a, b);
    }
    // fadeOut - one-second fade-to-zero on sound `a`, then stop.
    static fadeOut(a) {
      if (Save.sfxOn) {
        Application.instance.audio.fadeStop(a, 1, true);
      }
    }
  }
  SoundFx.i = true;
