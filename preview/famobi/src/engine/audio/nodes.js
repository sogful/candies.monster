  // AudioGraphNode - thin wrapper over a Web Audio node so the rest of
  // the engine can manage a node graph without touching the raw API.
  // `n` is the underlying AudioNode, `type` is a small enum used by
  // get() to walk the chain to a specific node type (e.g. find the
  // gain stage from a source). `inputs`/`output` track wiring.
  class AudioGraphNode {
    constructor(audioNode, typeId) {
      this.audioNode = audioNode;
      this.type = typeId;
      this.inputs = [];
      this.output = null;
    }
    // get - walk the output chain until a node of `type` is found.
    get(type) {
      let cursor = this;
      while (cursor != null) {
        if (cursor.type == type) {
          return cursor;
        }
        cursor = cursor.output;
      }
      return null;
    }
    free() {
      this.audioNode = this.output = this.inputs = null;
    }
    connect(target) {
      this.output = target;
      target.inputs.push(this);
      this.audioNode.disconnect();
      this.audioNode.connect(target.audioNode);
    }
    // append - splice `node` in between `this` and `this.output`.
    append(node) {
      Std.remove(this.output.inputs, this);
      node.connect(this.output);
      this.connect(node);
    }
  }
  AudioGraphNode.i = true;
  Object.assign(AudioGraphNode.prototype, {
    l: AudioGraphNode
  });

  // AudioGainNode - type 2; wraps GainNode. setValue is instant, xm
  // ramps to a target over a duration.
  class AudioGainNode extends AudioGraphNode {
    constructor() {
      super(Audio.context.createGain(), 2);
    }
    setValue(value) {
      this.audioNode.gain.value = value;
    }
    rampTo(target, duration) {
      let now = Audio.context.currentTime;
      let node = this.audioNode;
      node.gain.cancelScheduledValues(0);
      node.gain.linearRampToValueAtTime(target, now + duration);
    }
  }
  AudioGainNode.i = true;
  AudioGainNode.s = AudioGraphNode;
  Object.assign(AudioGainNode.prototype, {
    l: AudioGainNode
  });

  // AudioPannerNode - type 1; wraps StereoPannerNode. setPan smoothly
  // targets a pan value with a 5ms exponential ramp.
  class AudioPannerNode extends AudioGraphNode {
    constructor() {
      super(Audio.context.createStereoPanner(), 1);
    }
    setPan(value) {
      let node = this.audioNode;
      node.pan.cancelScheduledValues(0);
      node.pan.setTargetAtTime(value, Audio.context.currentTime, 0.005);
    }
  }
  AudioPannerNode.i = true;
  AudioPannerNode.s = AudioGraphNode;
  Object.assign(AudioPannerNode.prototype, {
    l: AudioPannerNode
  });

  // AudioDestinationNode - type 8; wraps the shared context destination.
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

  // AudioBufferSourceNode - type 0; wraps a one-shot BufferSourceNode.
  // Web Audio source nodes are single-use, so callers free() after the
  // onended callback fires.
  class AudioBufferSourceNode extends AudioGraphNode {
    constructor() {
      super(Audio.context.createBufferSource(), 0);
    }
    free() {
      this.audioNode.onended = null;
      super.free();
    }
    play(buffer, loop, offsetSeconds, onended) {
      let node = this.audioNode;
      node.buffer = buffer;
      node.loop = loop;
      node.start(0, offsetSeconds);
      node.onended = onended;
    }
    stop(when) {
      if (when == null) when = 0;
      this.audioNode.stop(when);
    }
  }
  AudioBufferSourceNode.i = true;
  AudioBufferSourceNode.s = AudioGraphNode;
  Object.assign(AudioBufferSourceNode.prototype, {
    l: AudioBufferSourceNode
  });
