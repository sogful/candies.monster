  class AudioSample {
    constructor(a, b, c) {
      this.id = a;
      this.data = b;
      this.ug = c;
      this.XB = -1;
    }
  }
  AudioSample.i = true;
  Object.assign(AudioSample.prototype, {
    l: AudioSample
  });
  class AudioInstance {
    constructor(a, b) {
      this.volume = 1;
      this.offset = 0;
      this.loop = false;
      this.yw = a;
      this.Le = b;
    }
    free() {
      this.yw = this.Le = null;
      this.Uj = true;
    }
    mo() {
      if (this.Uj) {
        return NaN;
      } else {
        return this.volume;
      }
    }
    Xi(a) {
      if (!this.Uj) {
        this.volume = a;
        this.sT();
      }
    }
    jo() {
      if (this.Uj) {
        return NaN;
      } else {
        return this.VN() / this.data.duration;
      }
    }
  }
  AudioInstance.i = true;
  Object.assign(AudioInstance.prototype, {
    l: AudioInstance
  });
  class WebAudioInstance extends AudioInstance {
    constructor(a, b) {
      super(a, b);
      this.data = b.data;
      this.Lr = null;
    }
    free() {
      if (!this.Uj) {
        var a = this.pf;
        a: while (a != null) {
          let b = a.output;
          switch (a.type) {
            case 0:
              if (this.Dc) {
                this.Dc = false;
                this.pf.stop(0);
              }
              break;
            case 1:
            case 2:
              break;
            default:
              break a;
          }
          Std.remove(a.output.inputs, a);
          a.n.disconnect();
          a.free();
          a = b;
        }
        this.pf = this.data = null;
        a = this.yw;
        super.free();
        a.oQ(this);
      }
    }
    play() {
      if (!this.Uj) {
        this.Dc = true;
        this.pf = new AudioBufferSourceNode();
        var a = this.yw;
        this.pf.connect(this.Le.ug ? a.cB() : a.dB());
        this.startTime = Audio.context.currentTime;
        this.pf.play(this.data, this.loop, this.offset, cachedBind(this, this.onended));
      }
    }
    xm(a, b) {
      if (!this.Uj) {
        var c = this.ZA();
        if (c != null) {
          c.xm(a, b);
        }
        this.volume = a;
        this.Lr = Audio.context.currentTime + b;
      }
    }
    stop(a) {
      if (a == null) {
        a = 0;
      }
      if (!this.Uj && !this.stopped && !!this.Dc) {
        this.stopped = true;
        this.pf.stop(Audio.context.currentTime + a);
      }
    }
    VN() {
      return (this.offset + (Audio.context.currentTime - this.startTime)) % this.data.duration;
    }
    mo() {
      if (this.Lr != null) {
        if (Audio.context.currentTime < this.Lr) {
          return this.pf.get(2).n.gain.value;
        }
        this.Lr = null;
      }
      return this.volume;
    }
    sT() {
      let a = this.ZA();
      if (a != null) {
        a.Gs(this.mo());
      }
    }
    onended() {
      if (this.Dc) {
        this.Dc = false;
        this.free();
      }
    }
    ZA() {
      if (!WebAudioInstance.MA || this.pf == null) {
        return null;
      }
      try {
        let a = this.pf.get(2);
        if (a == null) {
          a = new AudioGainNode();
          let b = this.pf.get(1);
          if (b == null) {
            this.pf.append(a);
          } else {
            b.append(a);
          }
        }
        return a;
      } catch (a) {
        WebAudioInstance.MA = false;
        return null;
      }
    }
  }
  WebAudioInstance.i = true;
  WebAudioInstance.s = AudioInstance;
  Object.assign(WebAudioInstance.prototype, {
    l: WebAudioInstance
  });

  class AudioSliceInfo {
    constructor(a, b, c, d) {
      this.name = a;
      this.id = b;
      this.min = c;
      this.max = d;
    }
  }
  AudioSliceInfo.i = true;
  Object.assign(AudioSliceInfo.prototype, {
    l: AudioSliceInfo
  });
  class SPRSheetParser {
    static tB(a) {
      a = Bytes.hk(a);
      if (a.b[0] == 83 && a.b[1] == 80) {
        return a.b[2] == 82;
      } else {
        return false;
      }
    }
    static nR(a) {
      return a.slice(5 + new BytesReader(Bytes.hk(a), 3).zd());
    }
    static vN(a) {
      if (!SPRSheetParser.tB(a)) {
        throw 22;
      }
      a = new BytesReader(Bytes.hk(a), 5);
      let b = [];
      let c = 0;
      let d = a.zd();
      while (c < d) {
        c++;
        let e = "";
        let f = 0;
        let g = a.zd();
        while (f < g) {
          f++;
          let h = a.ta();
          e += String.fromCodePoint(h);
        }
        b.push(new AudioSliceInfo(e, a.zd(), a.oD(), a.oD()));
      }
      return b;
    }
  }
  SPRSheetParser.i = true;
