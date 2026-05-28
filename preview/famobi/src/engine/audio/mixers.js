  class AudioMixerBase {
    constructor() {
      this.throttleDefault = 0.05;
      this.enabled = true;
      this.musicChannels = 2;
      this.sfxChannels = 16;
      this.peakInFlight = this.channelMask = 0;
      this.sfxVolume = this.musicVolume = this.masterVolume = 1;
      this.pan = 0;
      this.nextId = 10000;
      this.instances = [];
      this.samples = new HashMap();
      this.throttle = new HashMap();
      this.names = [];
    }
    free() {
      if (this.musicVolume != 1) {
        this.setMusicVolume(1);
      }
      if (this.sfxVolume != 1) {
        this.setSfxVolume(1);
      }
      if (this.masterVolume != 1) {
        this.setMasterVolume(1);
      }
      if (this.pan != 0) {
        this.setPan(0);
      }
      let a = 0;
      let b = this.instances;
      while (a < b.length) {
        b[a++].free();
      }
      this.names = this.samples = this.instances = null;
    }
    loadSample() {}
    loadSliced(a) {
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
        let e = this.instances;
        let f = [];
        let g = 0;
        while (g < e.length) {
          let h = e[g];
          ++g;
          if (h.sample.id == a) {
            f.push(h);
          }
        }
        while (d < f.length) {
          c = true;
          f[d++].stop(b);
        }
        return c;
      }
      c = Lambda.find(this.instances, function (d) {
        return d.id == a;
      });
      if (c != null) {
        c.stop(b);
        return true;
      } else {
        return false;
      }
    }
    // isPlaying - is sound id `a` currently in-flight?
    isPlaying(a) {
      if (a < 0) {
        return false;
      } else if (a < 10000) {
        return Lambda.exists(this.instances, function (b) {
          return b.sample.id == a;
        });
      } else {
        return Lambda.exists(this.instances, function (b) {
          return b.id == a;
        });
      }
    }
    activeIdFor(a) {
      let b = Lambda.find(this.instances, function (c) {
        return c.sample.id == a;
      });
      if (b != null) {
        return b.id;
      } else {
        return -1;
      }
    }
    findInstance(a) {
      if (a < 10000) {
        return Lambda.find(this.instances, function (b) {
          return b.sample.id == a;
        });
      } else {
        return Lambda.find(this.instances, function (b) {
          return b.id == a;
        });
      }
    }
    hasSample(a) {
      return this.samples.map[a] != null;
    }
    // setActiveVolume - retarget a currently-playing sound's volume.
    setActiveVolume(a, b) {
      if (a == null) {
        Lambda.forEach(this.instances, function (c) {
          if (!c.sample.isMusic) {
            c.setVolumeInstant(b);
          }
        });
      } else {
        Lambda.forEach(this.instances, function (c) {
          if (!c.sample.isMusic && (a < 10000 ? c.sample.id : c.id) == a) {
            c.setVolumeInstant(b);
          }
        });
      }
    }
    setMasterVolume(a) {
      this.masterVolume = a < 0 ? 0 : a > 1 ? 1 : a;
      this.applyMusicVolume();
      this.applySfxVolume();
    }
    setSfxVolume(a) {
      this.sfxVolume = a < 0 ? 0 : a > 1 ? 1 : a;
      this.applySfxVolume();
    }
    setMusicVolume(a) {
      this.musicVolume = a < 0 ? 0 : a > 1 ? 1 : a;
      this.applyMusicVolume();
    }
    setPan(a) {
      this.pan = a < -1 ? -1 : a > 1 ? 1 : a;
    }
    // fadeStop - fade volume to zero over `b` seconds, then stop.
    fadeStop(a, b, c) {
      if (c == null) {
        c = true;
      }
      this.rampTo(a, 0, b);
      if (c) {
        this.stop(a, b);
      }
    }
    rampTo(a, b, c) {
      var d;
      if (d == null) {
        d = -1;
      }
      let e = this.findInstance(a);
      if (e != null && this.isPlaying(a)) {
        if (d != -1) {
          e.setVolumeInstant(d);
        }
        a = e.getVolume() - b;
        if (!(a > 0 ? a < 0.01 : -a < 0.01)) {
          e.rampTo(b, c);
        }
      }
    }
    acquireChannel(a, b, c) {
      if (!this.enabled || !this.hasSample(a)) {
        return -1;
      }
      if (b && this.isPlaying(a)) {
        return this.activeIdFor(a);
      }
      if (b) {
        c = true;
      }
      if (!c && this.isThrottled(a)) {
        return -1;
      }
      a = this.pickChannel(this.samples.map[a].isMusic, c);
      if (a < 0) {
        return -1;
      } else {
        return a;
      }
    }
    addInstance(a) {
      this.instances.push(a);
      if (this.instances.length > this.peakInFlight) {
        this.peakInFlight = this.instances.length;
      }
    }
    returnToPool(a) {
      this.channelMask &= ~(1 << a.channel);
      Std.remove(this.instances, a);
      if (a.onDone != null) {
        a.onDone();
        a.onDone = null;
      }
    }
    isThrottled(a) {
      let b = this.samples.map[a];
      if (b.isMusic) {
        return false;
      }
      let c = Std.now() / 1000;
      a = this.throttle.map[a];
      if (a == null) {
        a = this.throttleDefault;
      }
      if (c - b.lastPlayTime < a) {
        return true;
      }
      b.lastPlayTime = c;
      return false;
    }
    pickChannel(a, b) {
      if (a) {
        for (b = 0; b < this.musicChannels;) {
          if ((this.channelMask & 1 << b) == 0) {
            this.channelMask |= 1 << b;
            return b;
          }
          ++b;
        }
        return -1;
      }
      a = -1;
      for (var c = this.musicChannels, d = c + this.sfxChannels; c < d;) {
        if ((this.channelMask & 1 << c) == 0) {
          this.channelMask |= 1 << c;
          a = c;
          break;
        }
        ++c;
      }
      if (b && a < 0) {
        b = null;
        c = a = 0;
        for (d = this.instances; c < d.length;) {
          let e = d[c];
          ++c;
          if (!e.sample.isMusic && !e.loop && e.progress() > a) {
            a = e.progress();
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
    applyMusicVolume() {
      Lambda.forEach(this.instances, function (a) {
        if (a.sample.isMusic) {
          a.setVolumeInstant(a.getVolume());
        }
      });
    }
    applySfxVolume() {
      Lambda.forEach(this.instances, function (a) {
        if (!a.sample.isMusic) {
          a.setVolumeInstant(a.getVolume());
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
    loadSample() {}
    loadSliced() {}
    play() {
      return -1;
    }
    setMasterVolume() {}
    setMusicVolume() {}
    setSfxVolume() {}
    setPan() {}
    applyMusicVolume() {}
    applySfxVolume() {}
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
      this.panner = this.musicGain = this.sfxGain = this.masterGain = null;
    }
    loadSample(a, b, c, d, e) {
      if (c == null) {
        c = false;
      }
      super.loadSample(a, b, c, d, e);
      let f = this;
      this.decode(b, function (g) {
        if (g == null) {
          d(null);
        } else {
          f.samples.map[a] = new AudioSample(a, g, c);
          d(g);
        }
      });
    }
    loadSliced(a, b, c) {
      super.loadSliced(a, b, c);
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
              d.samples.map[n] = new AudioSample(n, f[m], false);
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
      if (Audio.context == null || !Audio.isRunning()) {
        return -1;
      }
      c = this.acquireChannel(a, b, c);
      if (c < 0) {
        return -1;
      }
      a = new WebAudioInstance(this, this.samples.map[a]);
      a.id = this.nextId++;
      a.channel = c;
      a.loop = b;
      a.offset = d;
      a.play();
      this.addInstance(a);
      return a.id;
    }
    setMasterVolume(a, b) {
      if (b == null) {
        b = 0;
      }
      if (Audio.context != null) {
        this.masterVolume = a < 0 ? 0 : a > 1 ? 1 : a;
        var c = this.masterBus();
        if (b > 0) {
          c.rampTo(a, b);
        } else {
          c.setValue(a);
        }
      }
    }
    setMusicVolume(a) {
      if (Audio.context != null) {
        this.musicVolume = a < 0 ? 0 : a > 1 ? 1 : a;
        this.musicBus().setValue(a);
      }
    }
    setSfxVolume(a) {
      if (Audio.context != null) {
        this.sfxVolume = a < 0 ? 0 : a > 1 ? 1 : a;
        this.sfxBus().setValue(a);
      }
    }
    setPan(a) {
      if (Audio.context != null) {
        super.setPan(a);
        this.pannerBus().setPan(a);
      }
    }
    applyMusicVolume() {}
    applySfxVolume() {}
    decode(a, b) {
      new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(2, 13230000, 44100).decodeAudioData(a, function (c) {
        b(c);
      }, function () {
        b(null);
      });
    }
    masterBus() {
      if (this.masterGain == null) {
        this.masterGain = new AudioGainNode();
        this.masterGain.type = 5;
        this.masterGain.connect(new AudioDestinationNode());
      }
      return this.masterGain;
    }
    sfxBus() {
      if (this.sfxGain == null) {
        this.sfxGain = new AudioGainNode();
        this.sfxGain.type = 3;
        this.sfxGain.connect(this.masterBus());
      }
      return this.sfxGain;
    }
    musicBus() {
      if (this.musicGain == null) {
        this.musicGain = new AudioGainNode();
        this.musicGain.type = 4;
        this.musicGain.connect(this.masterBus());
      }
      return this.musicGain;
    }
    pannerBus() {
      if (this.panner == null) {
        this.panner = new AudioPannerNode();
        this.panner.type = 6;
        this.masterBus().append(this.panner);
      }
      return this.panner;
    }
    makeOfflineCtx(a) {
      let b = window.OfflineAudioContext;
      if (b == null) {
        b = window.webkitOfflineAudioContext;
      }
      return new b(2, a * 44100, 44100);
    }
    split(a, b) {
      let c = this.makeOfflineCtx(Math.ceil(b[b.length - 1].max * 2 / 1000));
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
