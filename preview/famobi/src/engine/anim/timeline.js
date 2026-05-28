  class AnimFrameRef {
    constructor(a, b) {
      this.data = a;
      this.time = b;
    }
  }
  AnimFrameRef.i = true;
  Object.assign(AnimFrameRef.prototype, {
    l: AnimFrameRef
  });
  class AnimSequence {
    constructor(a, b) {
      this.frameCount = a.length;
      this.data = Array(this.frameCount);
      let c = 0;
      while (c < this.frameCount) {
        this.data[c] = a[c].data;
        ++c;
      }
      switch (b) {
        case 0:
          this.timestamps = Array(this.frameCount + 1);
          this.totalDuration = 0;
          this.uniformDuration = a[0].time;
          c = 2;
          for (b = a[1].time; c < this.frameCount;) {
            if (a[c++].time != b) {
              this.uniformDuration = 0;
              break;
            }
          }
          for (c = 0; c < this.frameCount;) {
            this.timestamps[c] = this.totalDuration;
            this.totalDuration += a[c].time;
            ++c;
          }
          this.timestamps[c] = this.totalDuration;
          break;
        case 1:
          this.timestamps = Array(this.frameCount);
          this.totalDuration = a[this.frameCount - 1].time;
          this.uniformDuration = null;
          c = 0;
          while (c < this.frameCount) {
            this.timestamps[c] = a[c].time;
            ++c;
          }
      }
    }
  }
  AnimSequence.i = true;
  Object.assign(AnimSequence.prototype, {
    l: AnimSequence
  });
  class AnimComponent {
    constructor() {
      this.playing = false;
      this.object = null;
      this.paused = false;
      this.alive = true;
      this.dying = false;
      this.time = 0;
      this.rate = 1;
      this.startTime = this.endTime = this.timeOffset = 0;
      this.loopMode = 1;
      this.next = null;
      this.type = this.typeId();
      AnimComponent.ACTIVE++;
    }
    setPlaying(a) {
      this.playing = a;
    }
    free() {
      if (this.object != null) {
        this.object.detach(this);
        this.object = null;
      }
      this.alive = false;
      AnimComponent.ACTIVE--;
    }
    stopAlive() {
      if (!this.paused) {
        this.setPlaying(false);
        this.dying = true;
        this.time = 0;
      }
    }
    update(a) {
      if (this.playing) {
        this.time += a * this.rate;
        if (this.object == null) {
          return false;
        } else {
          return this.tick(this.time);
        }
      } else if (this.dying) {
        this.time += a;
        if (this.time > AnimComponent.$F) {
          this.free();
        }
        return true;
      } else {
        return false;
      }
    }
    computeWrappedTime() {
      var a = this.time + this.timeOffset;
      if (this.loopMode == 0) {
        var b = this.startTime;
        var c = this.endTime;
        if (a < b) {
          return b;
        } else if (a > c) {
          return c;
        } else {
          return a;
        }
      }
      b = this.endTime - this.startTime;
      if (b > 0) {
        c = (a - this.startTime) / b;
        a = Math.floor(c);
        c -= a;
        if (this.loopMode == 1) {
          return this.startTime + c * b;
        } else if ((a & 1) == 0) {
          return this.startTime + c * b;
        } else {
          return this.endTime - c * b;
        }
      } else {
        return this.startTime;
      }
    }
    typeId() {
      return 103;
    }
  }
  AnimComponent.i = true;
  AnimComponent.Ib = [C180];
  Object.assign(AnimComponent.prototype, {
    l: AnimComponent
  });

  class AnimController extends AnimComponent {
    constructor() {
      super();
      this.anim = null;
      this.frame = -1;
      this.endIndex = this.startIndex = this.repeatsLeft = 0;
      this.frameCache = -1;
      this.onCompleteCb = this.onFrameCb = null;
    }
    free() {
      this.onCompleteCb = this.onFrameCb = this.anim = null;
      super.free();
    }
    play(a, b, c) {
      if (b == null) {
        b = 0;
      }
      this.anim = a;
      if (c == null) {
        c = a.frameCount - 1;
      }
      this.startIndex = b;
      this.endIndex = c;
      this.startTime = a.timestamps[this.startIndex];
      this.endTime = a.timestamps[this.endIndex + 1];
      this.time = this.startTime;
      this.setPlaying(true);
      this.dying = false;
      this.frame = -1;
      this.frameCache = this.startIndex;
      this.tick(this.time);
      return this;
    }
    onFrame(a) {
      this.onFrameCb = a;
    }
    onComplete(a) {
      this.onCompleteCb = a;
    }
    stop() {
      this.anim = null;
      this.setPlaying(false);
      this.repeatsLeft = 0;
      this.stopAlive();
      return this;
    }
    tick() {
      var a = this.computeWrappedTime();
      let b;
      let c = this.anim.frameCount;
      if (c == 1) {
        b = this.frameCache = 0;
      } else if (a >= this.anim.totalDuration) {
        b = this.frameCache = c - 1;
      } else {
        if (this.anim.uniformDuration > 0) {
          b = a / this.anim.uniformDuration | 0;
        } else {
          b = 0;
          let d = this.anim.timestamps;
          if (a >= d[this.frameCache] && a <= d[this.frameCache + 1]) {
            b = this.frameCache;
          } else if (c < 16) {
            let e = 0;
            while (e <= c) {
              if (d[e] >= a) {
                b = e - 1;
                break;
              }
              ++e;
            }
          } else {
            b = NativeArray.binarySearch(d, a, c - 1);
            if (b < 0) {
              b = ~b;
              --b;
            }
          }
        }
        this.frameCache = b;
      }
      if (b < this.startIndex) {
        b = this.startIndex;
      } else if (b > this.endIndex) {
        b = this.endIndex;
      }
      if (b != this.frame) {
        this.frame = b;
        this.emitFrame(this.anim.data[b]);
        if (b >= this.endIndex && this.loopMode == 0) {
          if (--this.repeatsLeft > 0) {
            this.time = this.startTime;
            this.frame = -1;
            this.frameCache = this.startIndex;
            this.tick(this.time);
          } else {
            this.stopAlive();
            a = this.anim;
            this.anim = null;
            this.emitComplete(a);
          }
        }
      }
      return true;
    }
    emitFrame(a) {
      if (this.onFrameCb != null) {
        this.onFrameCb(this.anim, a, this.frame);
      }
    }
    emitComplete(a) {
      if (this.onCompleteCb != null) {
        this.onCompleteCb(a);
      }
    }
    typeId() {
      return 303;
    }
  }
  AnimController.i = true;
  AnimController.s = AnimComponent;
  Object.assign(AnimController.prototype, {
    l: AnimController
  });
  class SpriteAnimator {
    constructor(a) {
      this.sprite = a;
      this.controllers = Array(6);
      for (a = 0; a < 6;) {
        this.controllers[a++] = null;
      }
    }
    dispose() {
      if (this.controllers != null) {
        for (var a = 0, b = this.controllers; a < b.length;) {
          let c = b[a];
          ++a;
          if (c != null) {
            c.free();
          }
        }
        this.sprite = this.controllers = null;
      }
    }
    play(a, b) {
      this.start(a, 0, b);
    }
    loop(a, b) {
      if (b == null) {
        b = false;
      }
      this.start(a, b ? 2 : 1);
    }
    isPlaying() {
      return this.current.anim != null;
    }
    stop() {
      let a = 0;
      let b = this.controllers;
      while (a < b.length) {
        let c = b[a];
        ++a;
        if (c != null) {
          c.stop();
        }
      }
    }
    start(a, b, c) {
      let d = 0;
      this.current = null;
      let e = 0;
      while (e < 6) {
        let f = e++;
        let g = a.compileFrames();
        if (g[f] == null) {
          continue;
        }
        let h = this.controllers[f];
        if (h == null) {
          h = new AnimSequenceCtl();
          let n;
          switch (f) {
            case 0:
              n = cachedBind(this, this.applyScaleX);
              break;
            case 1:
              n = cachedBind(this, this.applyScaleY);
              break;
            case 2:
              n = cachedBind(this, this.rotKey);
              break;
            case 3:
              n = cachedBind(this, this.applyX);
              break;
            case 4:
              n = cachedBind(this, this.applyY);
              break;
            case 5:
              n = cachedBind(this, this.alphaKey);
          }
          h.onFrameCb = n;
          h.paused = true;
          this.sprite.node.attachAnim(h);
          this.controllers[f] = h;
        }
        let m = g[f].totalDuration;
        if (m > d) {
          d = m;
          this.current = h;
        }
        h.play(g[f], b);
      }
      if (c != null) {
        this.current.onDoneCb = function () {
          c(a);
        };
      }
    }
    applyScaleX(a, b, c) {
      this.sprite.setScaleX(this.lerp(a, b, c));
    }
    applyScaleY(a, b, c) {
      this.sprite.setScaleY(this.lerp(a, b, c));
    }
    rotKey(a, b, c) {
      this.sprite.setRotation(this.lerp(a, b, c));
    }
    applyX(a, b, c) {
      this.sprite.setX(this.lerp(a, b, c));
    }
    applyY(a, b, c) {
      this.sprite.setY(this.lerp(a, b, c));
    }
    alphaKey(a, b, c) {
      this.sprite.setAlpha(this.lerp(a, b, c));
    }
    lerp(a, b, c) {
      c = Easing.poly(a.easingFactor * 100)(c);
      a = a.value;
      return a + (b.value - a) * c;
    }
  }
  SpriteAnimator.i = true;
  Object.assign(SpriteAnimator.prototype, {
    l: SpriteAnimator
  });
  class AnimTimeline {
    constructor() {
      this.compiledChannels = null;
      let a = [];
      let b = 0;
      while (b < 6) {
        ++b;
        a.push(0);
      }
      this.timestamps = a;
      this.frames = [];
    }
    scaleXKey(a, b, c) {
      if (c == null) {
        c = 0;
      }
      this.pushKey(0, a, b, c);
    }
    scaleYKey(a, b, c) {
      if (c == null) {
        c = 0;
      }
      this.pushKey(1, a, b, c);
    }
    setScale(a, b, c, d) {
      if (d == null) {
        d = 0;
      }
      this.scaleXKey(a, c, d);
      this.scaleYKey(b, c, d);
    }
    scaleKey(a, b) {
      var c;
      if (c == null) {
        c = 0;
      }
      this.scaleXKey(a, b, c);
      this.scaleYKey(a, b, c);
    }
    rotKey(a, b, c) {
      if (c == null) {
        c = 0;
      }
      this.pushKey(2, a, b, c);
    }
    xKey(a, b, c) {
      if (c == null) {
        c = 0;
      }
      this.pushKey(3, a, b, c);
    }
    yKey(a, b, c) {
      if (c == null) {
        c = 0;
      }
      this.pushKey(4, a, b, c);
    }
    posKey(a, b, c, d) {
      if (d == null) {
        d = 0;
      }
      this.xKey(a, c, d);
      this.yKey(b, c, d);
    }
    alphaKey(a, b, c) {
      if (c == null) {
        c = 0;
      }
      this.pushKey(5, a, b, c);
    }
    relScaleKey(a, b, c) {
      var d;
      if (d == null) {
        d = 0;
      }
      let e = this.timestamps[0];
      this.scaleXKey(a, e, d);
      this.timestamps[0] += c;
      e = this.timestamps[1];
      this.scaleYKey(b, e, d);
      this.timestamps[1] += c;
    }
    relScaleUniKey(a, b, c) {
      if (c == null) {
        c = 0;
      }
      let d = this.timestamps[0];
      this.scaleXKey(a, d, c);
      this.timestamps[0] += b;
      d = this.timestamps[1];
      this.scaleYKey(a, d, c);
      this.timestamps[1] += b;
    }
    relPosKey(a, b) {
      var c;
      if (c == null) {
        c = 0;
      }
      let d = this.timestamps[3];
      this.xKey(0, d, c);
      this.timestamps[3] += b;
      d = this.timestamps[4];
      this.yKey(a, d, c);
      this.timestamps[4] += b;
    }
    pushKey(a, b, c, d) {
      this.frames.push(new TimelineEvent(a, c, new KeyValueAN(b, d)));
      this.compiledChannels = null;
    }
    compileFrames() {
      if (this.compiledChannels == null) {
        this.compiledChannels = [];
        let d = 0;
        while (d < 6) {
          let e = d++;
          var a = this.frames;
          let f = [];
          for (var b = 0; b < a.length;) {
            var c = a[b];
            ++b;
            if (c.channel == e) {
              f.push(c);
            }
          }
          if (f.length == 0) {
            this.compiledChannels[e] = null;
          } else {
            f.sort(function (g, h) {
              return g.time * 100000 - h.time * 100000 | 0;
            });
            if (f[0].time > 0) {
              switch (e) {
                case 0:
                case 1:
                case 5:
                  a = 1;
                  break;
                default:
                  a = 0;
              }
              f.unshift(new TimelineEvent(e, 0, new KeyValueAN(a, 0)));
            }
            a = Array(f.length);
            b = 0;
            for (c = f.length; b < c;) {
              let g = b++;
              let h = f[g];
              a[g] = new AnimFrameRef(h.keyValue, h.time);
            }
            this.compiledChannels[e] = new AnimSequence(a, 1);
          }
        }
      }
      return this.compiledChannels;
    }
    static parse(a) {
      a = a.replace(RegExp("\\s", "g"), "");
      let b = new AnimTimeline();
      let c = Object.create(null);
      c.sx = 0;
      c.sy = 1;
      c.r = 2;
      c.x = 3;
      c.y = 4;
      c.a = 5;
      let d = new EReg("(s|p|sx|sy|r|x|y|a)([\\-\\d\\.]+)([<>]*)", "");
      let e = new EReg("([\\d\\.]+)", "");
      a = a.split(",");
      let f = 0;
      let g = a.length;
      let h = -1;
      let m = [];
      while (f < g) {
        var n = a[f++];
        let q = false;
        while (d.match(n)) {
          q = true;
          n = d.matched(1);
          let p = parseFloat(d.matched(2));
          let v = d.matched(3);
          switch (n) {
            case "p":
              m.push(4);
              m.push(3);
              break;
            case "s":
              m.push(1);
              m.push(0);
              break;
            default:
              m.push(c[n]);
          }
          while (m.length > 0) {
            b.pushKey(m.pop(), p, h, v == "<" ? -100 : v == ">" ? 100 : 0);
          }
          n = d.matchedRight();
        }
        if (!q) {
          e.match(n);
          h = parseFloat(e.matched(1));
        }
      }
      return b;
    }
  }
  AnimTimeline.i = true;
  Object.assign(AnimTimeline.prototype, {
    l: AnimTimeline
  });

  class AnimSequenceCtl extends AnimComponent {
    constructor() {
      super();
      this.onFrameCb = this.onDoneCb = null;
      this.lastIndex = 0;
      this.anim = null;
    }
    free() {
      this.onFrameCb = this.onDoneCb = null;
      super.free();
    }
    play(a, b) {
      if (b == null) {
        b = 0;
      }
      this.anim = a;
      this.loopMode = b;
      this.startTime = this.time = this.lastIndex = 0;
      this.endTime = a.totalDuration;
      this.setPlaying(true);
      this.dying = false;
      this.tick(0);
    }
    stop() {
      this.onDoneCb = null;
      this.setPlaying(false);
      this.anim = null;
      this.stopAlive();
    }
    tick(a) {
      var b = this.computeWrappedTime();
      let c = this.anim.timestamps;
      let d;
      var e;
      if (b <= c[0]) {
        d = e = this.lastIndex = b = 0;
      } else if (b >= c[this.anim.frameCount - 1]) {
        b = 0;
        d = e = this.lastIndex = this.anim.frameCount - 1;
      } else if (b > c[this.lastIndex]) {
        for (e = this.lastIndex + 1; b >= c[e];) {
          this.lastIndex = e;
          ++e;
        }
        d = this.lastIndex;
        b = (b - c[d]) / (c[e] - c[d]);
      } else if (b < c[this.lastIndex]) {
        for (e = this.lastIndex - 1; b <= c[e];) {
          this.lastIndex = e;
          --e;
        }
        d = e;
        e = this.lastIndex;
        b = (b - c[d]) / (c[e] - c[d]);
      } else {
        b = 0;
        d = e = this.lastIndex;
      }
      if (this.onFrameCb != null) {
        this.onFrameCb(this.anim.data[d], this.anim.data[e], b);
      }
      if (a > this.endTime && this.loopMode == 0) {
        a = this.onDoneCb;
        this.stop();
        if (a != null) {
          a();
        }
      }
      return true;
    }
    typeId() {
      return 403;
    }
  }
  AnimSequenceCtl.i = true;
  AnimSequenceCtl.s = AnimComponent;
  Object.assign(AnimSequenceCtl.prototype, {
    l: AnimSequenceCtl
  });
  class TweenTrack extends AnimComponent {
    constructor() {
      super();
    }
    free() {
      this.onComplete = this.onProgress = this.easing = null;
      super.free();
    }
    addTween(a, b, c, d, e) {
      this.key = a;
      this.startValue = b;
      this.endValue = c;
      this.easing = e;
      this.startTime = this.time = 0;
      this.endTime = d;
      this.setPlaying(true);
      this.dying = false;
    }
    stop() {
      this.onProgress = this.onComplete = null;
      this.stopAlive();
    }
    tick(a) {
      if (a >= this.endTime && this.loopMode == 0) {
        this.stopAlive();
        this.onProgress(this.key, this.endValue);
        this.onComplete(this.key);
        return false;
      }
      a = this.startValue;
      a += (this.endValue - a) * this.easing((this.computeWrappedTime() - this.startTime) / (this.endTime - this.startTime));
      this.onProgress(this.key, a);
      return true;
    }
    typeId() {
      return 203;
    }
  }
  TweenTrack.i = true;
  TweenTrack.s = AnimComponent;
  Object.assign(TweenTrack.prototype, {
    l: TweenTrack
  });
  class C192 {
    constructor() {}
  }
  C192.i = true;
  Object.assign(C192.prototype, {
    l: C192
  });
  class TokenParser extends C192 {
    constructor() {
      super();
    }
    setSource(a) {
      this.source = a;
      this.state = StringUtil.isWhitespace(this.source, 0) ? 1 : 0;
      this.tokenStart = this.pos = 0;
      this.done = this.source.length == 0;
    }
    nextToken() {
      if (this.done) {
        return null;
      }
      let a = this.source.length;
      let b;
      while (this.pos < a) {
        if (b = this.source.charAt(this.pos) == "\n") {
          this.pos++;
          this.tokenStart = this.pos;
          this.state = StringUtil.isWhitespace(this.source, 0) ? 1 : 0;
          return {
            position: this.tokenStart,
            required: this.pos != a
          };
        }
        switch (this.state) {
          case 0:
            if (StringUtil.isWhitespace(this.source, this.pos)) {
              this.state = 1;
            }
            this.pos++;
            break;
          case 1:
            if (StringUtil.isWhitespace(this.source, this.pos)) {
              this.pos++;
            } else {
              this.tokenStart = this.pos;
              this.state = 0;
              return {
                position: this.tokenStart,
                required: false
              };
            }
        }
        if (this.pos == a) {
          this.done = true;
          this.tokenStart = this.pos;
          return {
            position: this.tokenStart,
            required: false
          };
        }
      }
      this.done = true;
      return null;
    }
  }
  TokenParser.i = true;
  TokenParser.s = C192;
  Object.assign(TokenParser.prototype, {
    l: TokenParser
  });

  class KeyValueAN {
    constructor(a, b) {
      this.value = a;
      this.easingFactor = b;
    }
  }
  KeyValueAN.i = true;
  Object.assign(KeyValueAN.prototype, {
    l: KeyValueAN
  });
  class TimelineEvent {
    constructor(a, b, c) {
      this.channel = a;
      this.time = b;
      this.keyValue = c;
    }
  }
  TimelineEvent.i = true;
  Object.assign(TimelineEvent.prototype, {
    l: TimelineEvent
  });
  class SpriteTween {
    constructor(a) {
      this.sprite = a;
      this.channels = 0;
      this.callbacks = [];
      this.repeat = 0;
      this.easing = Easing.linear();
    }
    x(a, b, c, d, e) {
      this.addTween(0, a, b, c, d, e);
      return this;
    }
    y(a, b, c, d, e) {
      this.addTween(1, a, b, c, d, e);
      return this;
    }
    xy(a, b) {
      this.addTween(0, a, 0.1, undefined, null);
      this.addTween(1, b, 0.1, undefined, null);
    }
    scale(a, b, c, d, e) {
      this.addTween(4, a, b, c, d, e);
      return this;
    }
    rotation(a, b, c, d, e) {
      this.addTween(5, a, b, c, d, e);
      return this;
    }
    alpha(a, b, c, d, e) {
      this.addTween(6, a, b, c, d, e);
      return this;
    }
    stopAll() {
      let a = this.sprite.node.controllers;
      while (a != null) {
        let b = a.next;
        if (a.type == 203) {
          a.stop();
        }
        a = b;
      }
      this.channels = 0;
    }
    addTween(a, b, c, d, e, f) {
      let g;
      switch (a) {
        case 0:
          g = this.sprite.getX();
          break;
        case 1:
          g = this.sprite.getY();
          break;
        case 2:
          g = this.sprite.scaleX;
          break;
        case 3:
          g = this.sprite.scaleY;
          break;
        case 4:
          g = this.sprite.scaleX;
          break;
        case 5:
          g = this.sprite.rotation;
          break;
        case 6:
          g = this.sprite.alpha;
      }
      let h = this.getOrCreateTrack(a);
      h.addTween(a, g, b, c, d == null ? Easing.linear() : d);
      h.loopMode = e == null ? 0 : e;
      this.callbacks[a] = f;
      this.channels |= 1 << a;
    }
    getOrCreateTrack(a) {
      let b;
      let c = this.sprite.node.controllers;
      if (c != null) {
        if ((this.channels & 1 << a) > 0) {
          while (c != null) {
            if (c.type == 203 && (b = c, b.key == a)) {
              b.onComplete = cachedBind(this, this.fireCallback);
              b.onProgress = cachedBind(this, this.applyChannel);
              return b;
            }
            c = c.next;
          }
        } else {
          while (c != null) {
            if (c.type == 203 && c.dying) {
              b = c;
              b.onComplete = cachedBind(this, this.fireCallback);
              b.onProgress = cachedBind(this, this.applyChannel);
              return b;
            }
            c = c.next;
          }
        }
      }
      b = new TweenTrack();
      b.onProgress = cachedBind(this, this.applyChannel);
      b.onComplete = cachedBind(this, this.fireCallback);
      this.sprite.node.attachAnim(b);
      return b;
    }
    applyChannel(a, b) {
      let c = this.sprite;
      switch (a) {
        case 0:
          c.setX(b);
          break;
        case 1:
          c.setY(b);
          break;
        case 2:
          c.setScaleX(b);
          break;
        case 3:
          c.setScaleY(b);
          break;
        case 4:
          c.setUniformScale(b);
          break;
        case 5:
          c.setRotation(b);
          break;
        case 6:
          c.setAlpha(b);
      }
    }
    fireCallback(a) {
      let b = this.callbacks[a];
      if (b != null) {
        this.callbacks[a] = null;
        b();
      }
    }
  }
  SpriteTween.i = true;
  Object.assign(SpriteTween.prototype, {
    l: SpriteTween
  });
