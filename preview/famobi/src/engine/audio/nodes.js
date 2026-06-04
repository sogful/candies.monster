  class AudioGraphNode {
    constructor(a, b) {
      this.n = a;
      this.type = b;
      this.inputs = [];
      this.output = null;
    }
    get(a) {
      let b = this;
      while (b != null) {
        if (b.type == a) {
          return b;
        }
        b = b.output;
      }
      return null;
    }
    free() {
      this.n = this.output = this.inputs = null;
    }
    connect(a) {
      this.output = a;
      a.inputs.push(this);
      this.n.disconnect();
      this.n.connect(a.n);
    }
    append(a) {
      Std.remove(this.output.inputs, this);
      a.connect(this.output);
      this.connect(a);
    }
  }
  AudioGraphNode.i = true;
  Object.assign(AudioGraphNode.prototype, {
    l: AudioGraphNode
  });
  class AudioGainNode extends AudioGraphNode {
    constructor() {
      super(Audio.context.createGain(), 2);
    }
    Gs(a) {
      this.n.gain.value = a;
    }
    xm(a, b) {
      let c = Audio.context.currentTime;
      let d = this.n;
      d.gain.cancelScheduledValues(0);
      d.gain.linearRampToValueAtTime(a, c + b);
    }
  }
  AudioGainNode.i = true;
  AudioGainNode.s = AudioGraphNode;
  Object.assign(AudioGainNode.prototype, {
    l: AudioGainNode
  });
  class AudioPannerNode extends AudioGraphNode {
    constructor() {
      super(Audio.context.createStereoPanner(), 1);
    }
    pS(a) {
      let b = this.n;
      b.pan.cancelScheduledValues(0);
      b.pan.setTargetAtTime(a, Audio.context.currentTime, 0.005);
    }
  }
  AudioPannerNode.i = true;
  AudioPannerNode.s = AudioGraphNode;
  Object.assign(AudioPannerNode.prototype, {
    l: AudioPannerNode
  });

  class AudioDestinationNode extends AudioGraphNode {
    constructor() {
      super(Audio.context.destination, 8);
    }
  }
  AudioDestinationNode.i = true;
  AudioDestinationNode.s = AudioGraphNode;
  Object.assign(AudioDestinationNode.prototype, {
    l: AudioDestinationNode
  });
  class AudioBufferSourceNode extends AudioGraphNode {
    constructor() {
      super(Audio.context.createBufferSource(), 0);
    }
    free() {
      this.n.onended = null;
      super.free();
    }
    play(a, b, c, d) {
      let e = this.n;
      e.buffer = a;
      e.loop = b;
      e.start(0, c);
      e.onended = d;
    }
    stop(a) {
      if (a == null) {
        a = 0;
      }
      this.n.stop(a);
    }
  }
  AudioBufferSourceNode.i = true;
  AudioBufferSourceNode.s = AudioGraphNode;
  Object.assign(AudioBufferSourceNode.prototype, {
    l: AudioBufferSourceNode
  });
