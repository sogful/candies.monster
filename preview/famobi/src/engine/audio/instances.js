  // AudioSample - decoded audio buffer cache entry. isMusic flags
  // music vs sfx (routed through different mixer chains).
  // lastPlayTime is the wall clock seconds of the last play() call,
  // used by AudioMixerBase.isThrottled to suppress rapid re-triggers
  // (default throttle window is 50ms).
  class AudioSample {
    constructor(id, audioBuffer, isMusic) {
      this.id = id;
      this.data = audioBuffer;
      this.isMusic = isMusic;
      this.lastPlayTime = -1;
    }
  }
  AudioSample.i = true;
  Object.assign(AudioSample.prototype, {
    l: AudioSample
  });

  // AudioInstance - one in-flight playback. yw is the owning mixer (used
  // to return the instance back to its pool on free), Le is the
  // AudioSample being played. Uj is the disposed flag.
  class AudioInstance {
    constructor(mixer, sample) {
      this.volume = 1;
      this.offset = 0;
      this.loop = false;
      this.mixer = mixer;
      this.sample = sample;
    }
    free() {
      this.mixer = this.sample = null;
      this.disposed = true;
    }
    getVolume() {
      if (this.disposed) return NaN;
      return this.volume;
    }
    setVolumeInstant(value) {
      if (!this.disposed) {
        this.volume = value;
        this.syncGain();
      }
    }
    progress() {
      if (this.disposed) return NaN;
      return this.currentTime() / this.data.duration;
    }
  }
  AudioInstance.i = true;
  Object.assign(AudioInstance.prototype, {
    l: AudioInstance
  });

  // WebAudioInstance - Web Audio API backend. `pf` is the head of the
  // node chain (BufferSource -> [Panner] -> [Gain] -> destination).
  // Lr stores the wall-clock end of an in-flight gain ramp so mo()
  // can read the live value during the ramp.
  class WebAudioInstance extends AudioInstance {
    constructor(mixer, sample) {
      super(mixer, sample);
      this.data = sample.data;
      this.rampEnd = null;
    }
    free() {
      if (!this.disposed) {
        // walk the node chain, stop the source if still playing, then
        // detach + dispose every node up to (but not including) the
        // destination (default branch of the switch breaks out).
        var node = this.head;
        a: while (node != null) {
          let next = node.output;
          switch (node.type) {
            case 0:
              if (this.started) {
                this.started = false;
                this.head.stop(0);
              }
              break;
            case 1:
            case 2:
              break;
            default:
              break a;
          }
          Std.remove(node.output.inputs, node);
          node.audioNode.disconnect();
          node.free();
          node = next;
        }
        this.head = this.data = null;
        let mixer = this.mixer;
        super.free();
        mixer.returnToPool(this);
      }
    }
    play() {
      if (!this.disposed) {
        this.started = true;
        this.head = new AudioBufferSourceNode();
        let mixer = this.mixer;
        // cB() = music bus, dB() = sfx bus
        this.head.connect(this.sample.isMusic ? mixer.musicBus() : mixer.sfxBus());
        this.startTime = Audio.context.currentTime;
        this.head.play(this.data, this.loop, this.offset, cachedBind(this, this.onended));
      }
    }
    rampTo(target, durationSeconds) {
      if (!this.disposed) {
        let gain = this.ensureGain();
        if (gain != null) {
          gain.rampTo(target, durationSeconds);
        }
        this.volume = target;
        this.rampEnd = Audio.context.currentTime + durationSeconds;
      }
    }
    stop(when) {
      if (when == null) when = 0;
      if (!this.disposed && !this.stopped && !!this.started) {
        this.stopped = true;
        this.head.stop(Audio.context.currentTime + when);
      }
    }
    currentTime() {
      return (this.offset + (Audio.context.currentTime - this.startTime)) % this.data.duration;
    }
    getVolume() {
      if (this.rampEnd != null) {
        if (Audio.context.currentTime < this.rampEnd) {
          // mid-ramp - sample the actual gain so callers see the
          // current interpolated value rather than the target.
          return this.head.get(2).audioNode.gain.value;
        }
        this.rampEnd = null;
      }
      return this.volume;
    }
    syncGain() {
      let gain = this.ensureGain();
      if (gain != null) gain.setValue(this.getVolume());
    }
    onended() {
      if (this.started) {
        this.started = false;
        this.free();
      }
    }
    // ZA - lazy-install a GainNode into the chain (after the panner if
    // present, otherwise straight after the source). MA is a static
    // kill switch: any GainNode failure flips it off permanently so
    // subsequent instances skip the attempt.
    ensureGain() {
      if (!WebAudioInstance.gainEnabled || this.head == null) {
        return null;
      }
      try {
        let gain = this.head.get(2);
        if (gain == null) {
          gain = new AudioGainNode();
          let panner = this.head.get(1);
          if (panner == null) {
            this.head.append(gain);
          } else {
            panner.append(gain);
          }
        }
        return gain;
      } catch (_) {
        WebAudioInstance.gainEnabled = false;
        return null;
      }
    }
  }
  WebAudioInstance.i = true;
  WebAudioInstance.s = AudioInstance;
  Object.assign(WebAudioInstance.prototype, {
    l: WebAudioInstance
  });

  // AudioSliceInfo - one entry from the legacy SPR (sound sprite)
  // index: byte range inside the parent audio file for a single
  // logical sound effect.
  class AudioSliceInfo {
    constructor(name, id, minByte, maxByte) {
      this.name = name;
      this.id = id;
      this.min = minByte;
      this.max = maxByte;
    }
  }
  AudioSliceInfo.i = true;
  Object.assign(AudioSliceInfo.prototype, {
    l: AudioSliceInfo
  });

  // SPRSheetParser - decodes the legacy `.spr` sound-sprite header.
  // Layout:
  //   bytes 0..2 = magic "SPR"
  //   byte 2 (offset 3) = body offset (used by nR() to strip header)
  //   byte 5+   = N slice entries; each one:
  //     {nameLength, name, id, minByte, maxByte}
  //
  // tB - magic check ("SPR\0"). nR - returns body bytes after header.
  // vN - parses the slice table into AudioSliceInfo records.
  class SPRSheetParser {
    static hasMagic(bytes) {
      bytes = Bytes.fromBuffer(bytes);
      if (bytes.bytes[0] == 83 && bytes.bytes[1] == 80) {
        return bytes.bytes[2] == 82;
      } else {
        return false;
      }
    }
    static body(bytes) {
      return bytes.slice(5 + new BytesReader(Bytes.fromBuffer(bytes), 3).readUInt16());
    }
    static parseSlices(bytes) {
      if (!SPRSheetParser.hasMagic(bytes)) throw 22;
      let reader = new BytesReader(Bytes.fromBuffer(bytes), 5);
      let slices = [];
      let i = 0;
      let count = reader.readUInt16();
      while (i < count) {
        i++;
        let name = "";
        let j = 0;
        let nameLen = reader.readUInt16();
        while (j < nameLen) {
          j++;
          name += String.fromCodePoint(reader.readByte());
        }
        slices.push(new AudioSliceInfo(name, reader.readUInt16(), reader.readUInt24(), reader.readUInt24()));
      }
      return slices;
    }
  }
  SPRSheetParser.i = true;
