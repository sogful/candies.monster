  // InternKey - thin facade over AnimController for sprite-tied
  // animations. Each Sprite gets at most one shared AnimController
  // (lazy-installed via ensureController()); InternKey wraps the play/stop/loop API
  // and forwards the controller's per-frame frame index back to the
  // sprite's setFrame(frameIndex) setter so the displayed bitmap updates.
  class InternKey {
    constructor(sprite) {
      this.sprite = sprite;
      this.controller = this.ensureController();
    }
    // remaining - duration left on the current animation, or -1 if idle.
    remaining() {
      if (this.controller.playing) {
        return this.controller.endTime - this.controller.startTime;
      } else {
        return -1;
      }
    }
    isPlaying(animId) {
      return this.controller.anim == animId;
    }
    play(animId, startFrame) {
      this.controller.loopMode = 0;
      this.controller.repeatsLeft = startFrame != null ? startFrame - 1 : 0;
      this.controller.play(animId);
      return this;
    }
    // playAndFree - one-shot animation that frees its sprite on end.
    // Used for effects that own their sprite (e.g. burst particles).
    playAndFree(animId) {
      let self = this;
      this.play(animId).onComplete(function () {
        self.sprite.free();
      });
    }
    loop(animId, pingpong) {
      if (pingpong == null) pingpong = false;
      this.controller.loopMode = pingpong ? 2 : 1;
      this.controller.play(animId);
      return this;
    }
    stop() {
      this.controller.stop();
      return this;
    }
    onComplete(callback) {
      this.controller.onComplete(callback);
    }
    // randomize - jump the playhead to a random point in the current
    // animation (used to desync looping decorative sprites).
    randomize() {
      this.controller.time = X.randRange(0, this.remaining());
    }
    setTime(t) {
      let duration = this.remaining();
      this.controller.time = t < 0 ? 0 : t > duration ? duration : t;
      return this;
    }
    // mv - lazily install (or return) the AnimController that drives
    // this sprite. Registers our frame-index -> sprite callback so the
    // displayed bitmap follows the active animation.
    ensureController() {
      let existing = this.sprite.node.findAnimController();
      let self = this;
      if (existing == null || !existing.alive) {
        existing = new AnimController();
        existing.onFrame(function (_, frameIndex) {
          self.sprite.setFrame(frameIndex);
        });
        this.sprite.node.attachAnim(existing);
      }
      return existing;
    }
    // create - mini language for declaring animations from spec strings
    // separated by commas. Each segment matches one of:
    //
    //   name(@duration)                  set the active base name and
    //                                     optional per-frame duration
    //                                     (seconds, or 1/N if integer)
    //   a-b(@duration)                   range: emit frames a..b
    //                                     (auto-reversing if a > b)
    //   a x N(@duration)                 emit frame `a` N times
    //   number(@duration)(@duration)     emit a single numbered frame
    //
    // Frame numbers are zero-padded to 4 digits and appended to the
    // current base name (e.g. "blink" + 12 -> "blink0012"). Returns
    // an AnimSequence ready for AnimController.play().
    static create(spec) {
      function parseDuration(groupIndex) {
        if (matcher.matched(groupIndex) != null) {
          let raw = Std.substr(matcher.matched(groupIndex), 1, null);
          frameDuration = raw.indexOf(".") != -1 ? parseFloat(raw) : 1 / Numeric.parseInt(raw);
        }
      }
      function frameName(num) {
        return baseName + (num < 10 ? "000" : num < 100 ? "00" : "0") + num;
      }
      let frames = [];
      let frameDuration = 0.03333333333333333;
      let baseName = "";
      let matcher = null;
      let i = 0;
      for (let parts = spec.split(","); i < parts.length;) {
        let segment = parts[i];
        ++i;
        matcher = new EReg("^([a-z][\\w\\/]*)(@[\\d\\.]+)*", "i");
        if (matcher.match(segment)) {
          baseName = matcher.matched(1);
          parseDuration(2);
        } else {
          matcher = new EReg("^(\\d+)-(\\d+)(@[\\d\\.]+)*", "");
          if (matcher.match(segment)) {
            let from = Numeric.parseInt(matcher.matched(1));
            let to = Numeric.parseInt(matcher.matched(2));
            parseDuration(3);
            let nums = [];
            let cursor = from;
            if (from > to) {
              while (cursor >= to) nums.push(cursor--);
            } else {
              while (cursor <= to) nums.push(cursor++);
            }
            let durations = [];
            let j = 0;
            for (let n = nums.length; j < n;) {
              ++j;
              durations.push(frameDuration);
            }
            for (let k = j = 0; k < nums.length;) {
              frames.push(new AnimFrameRef(frameName(nums[k++]), durations[j++]));
            }
          } else {
            matcher = new EReg("^(\\d+)x(\\d+)(@[\\d\\.]+)*", "");
            if (matcher.match(segment)) {
              let num = Numeric.parseInt(matcher.matched(1));
              let count = Numeric.parseInt(matcher.matched(2));
              parseDuration(3);
              let j = 0;
              while (j < count) {
                ++j;
                frames.push(new AnimFrameRef(frameName(num), frameDuration));
              }
            } else {
              matcher = new EReg("^\\d+(@[\\d\\.]+)*(@[\\d\\.]+)*", "");
              if (matcher.match(segment)) {
                parseDuration(1);
                frames.push(new AnimFrameRef(frameName(Numeric.parseInt(matcher.matched(0))), frameDuration));
              }
            }
          }
        }
      }
      return new AnimSequence(frames, 0);
    }
  }
  InternKey.i = true;
  Object.assign(InternKey.prototype, {
    l: InternKey
  });
