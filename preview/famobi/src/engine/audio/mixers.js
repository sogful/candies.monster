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
