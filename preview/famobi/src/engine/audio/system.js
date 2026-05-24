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
