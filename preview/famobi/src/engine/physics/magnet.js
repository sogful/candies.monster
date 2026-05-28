  class MagnetEffect extends GameObject {
    constructor(a, b, c) {
      super();
      this.endPos = b;
      this.startPos = c;
      this.progress = 0;
      this.isActive = false;
      this.container = new Container();
      a.layer(0).appendChild(this.container.node);
      this.inner = new MagnetInner(a.layer(12));
      this.outer = new MagnetOuter(a.layer(12));
      a = new AnimTimeline();
      a.scaleKey(0.27999999999999997, 0);
      a.scaleKey(0.4, 0.5);
      a.scaleKey(0.27999999999999997, 1);
      a.rotKey(0, 0);
      a.rotKey(360, 1);
      this.glowSprite = new Sprite(null, Resources.Kd, Keys.gI);
      this.glowSprite.center();
      this.glowSprite.setBlendMode(3);
      this.glowSprite.setVisible(false);
      this.container.appendChild(this.glowSprite);
      new SpriteAnimator(this.glowSprite).loop(a);
    }
    free() {
      this.container.free();
      this.container = null;
      this.inner.free();
      this.outer.free();
      SoundFx.stop(SoundFx.sp_telekinesis);
    }
    setEnabled(a) {
      if (a && !this.isActive) {
        this.outer.reset();
        this.progress = 0;
        this.state = 1;
        SoundFx.play(SoundFx.sp_telekinesis, true);
      }
      if (!a && this.isActive) {
        this.state = 0;
        this.progress = vLN01;
        SoundFx.stop(SoundFx.sp_telekinesis);
      }
      this.inner.setSegmentsVisible(a);
      this.outer.setSegmentsVisible(a);
      this.glowSprite.setVisible(a);
      this.isActive = a;
    }
    update(a) {
      if (this.container != null && (super.update(a), this.progress = PathResolver.rampToward(this.progress, this.state == 0 ? 0 : 0.3, 1, a), this.isActive)) {
        let b = this.state == 1 ? this.progress / 0.3 : this.progress / vLN01;
        this.inner.x = this.startPos.x;
        this.inner.y = this.startPos.y;
        this.inner.update(a);
        this.inner.alpha = b;
        this.outer.alpha = b * 0.5;
        this.outer.updateLine(this.startPos, this.endPos);
        this.outer.update(a);
      }
    }
    draw() {
      if (this.container != null) {
        super.draw();
        if (this.isActive) {
          this.glowSprite.setX(this.startPos.x);
          this.glowSprite.setY(this.startPos.y);
          this.inner.draw();
          this.outer.draw();
        }
      }
    }
  }
  MagnetEffect.i = true;
  MagnetEffect.s = GameObject;
  Object.assign(MagnetEffect.prototype, {
    l: MagnetEffect
  });
  class MagnetInner extends GameObject {
    constructor(a) {
      super();
      this.container = new Container();
      a.appendChild(this.container.node);
      this.count = 4;
      this.speed = 2;
      this.sprites = [];
      a = 0;
      let b = this.count;
      while (a < b) {
        ++a;
        let c = new Sprite(this.container, Resources.Kd, Keys.jI);
        c.center();
        c.setBlendMode(3);
        this.sprites.push(c);
      }
      this.maxScale = 1.25;
      this.rotMult = 2;
      this.alphaMax = 0.7;
      this.phase = 0;
      this.setSegmentsVisible(false);
    }
    free() {
      this.container.free();
      this.container = null;
    }
    setSegmentsVisible(a) {
      this.container.setVisible(a);
    }
    setPhase(a) {
      this.phase = a > HALF_PI ? 0 : a;
    }
    update(a) {
      this.setPhase(this.phase + a / this.speed);
    }
    draw() {
      if (this.container != null) {
        var a = Array(4);
        for (var b = 0, c = this.count; b < c;) {
          var d = b++;
          a[d] = this.phase + d * HALF_PI / this.count;
        }
        b = 0;
        for (c = this.count; b < c;) {
          d = b++;
          let e = this.sprites[d];
          if (a[d] > HALF_PI) {
            a[d] -= HALF_PI;
          }
          let f = this.alphaMax * Math.cos(a[d]) * this.alpha;
          if (d % 2 != 0) {
            e.setRotation(this.rotMult * 360 * a[d] / PI);
          } else {
            e.setRotation(-this.rotMult * 360 * a[d] / PI);
          }
          e.setScaleX(this.maxScale * Math.sin(a[d]) * 0.4);
          e.setScaleY(this.maxScale * Math.sin(a[d]) * 0.4);
          e.setX(this.x);
          e.setY(this.y);
          e.setAlpha(f);
        }
      }
    }
  }
  MagnetInner.i = true;
  MagnetInner.s = GameObject;
  Object.assign(MagnetInner.prototype, {
    l: MagnetInner
  });
  class MagnetOuter extends GameObject {
    constructor(a) {
      super();
      this.startVec = new Vec2(0, 0);
      this.phase = this.length = 0;
      this.container = new Container();
      a.appendChild(this.container.node);
      this.sprites = [];
      for (a = 0; a < 4;) {
        ++a;
        let b = new Sprite(this.container, Resources.Kd, "ray");
        b.setBlendMode(3);
        b.setAlpha(0.3);
        b.setVisible(false);
        this.sprites.push(b);
      }
    }
    free() {
      this.container.free();
      this.container = null;
    }
    setSegmentsVisible(a) {
      if (this.container != null) {
        this.container.setVisible(a);
      }
    }
    updateLine(a, b) {
      b = Vec2.diff(b, a);
      this.length = b.length();
      this.rotation = Math.atan2(b.y, b.x) * RAD2DEG - 90;
      this.startVec.x = a.x;
      this.startVec.y = a.y;
    }
    reset() {
      this.phase = 0;
    }
    update() {
      this.phase += 0.05;
      let a = 0;
      while (a < 4) {
        this.sprites[a++].setOffsetY(this.phase);
      }
    }
    draw() {
      if (this.container != null) {
        var a = Math.ceil(this.length / (this.sprites[0].size.y / 4));
        if (a > 4) {
          a = 4;
        }
        for (var b = 0; b < 4;) {
          this.sprites[b++].setVisible(false);
        }
        for (var c = b = 0; c < a;) {
          let d = c++;
          let e = this.sprites[d];
          b += e.size.y;
          e.setX(-e.size.x / 2);
          e.setY(d * e.size.y);
          e.setVisible(true);
        }
        this.container.setScaleX(0.27999999999999997);
        this.container.setScaleY(this.length / b);
        this.container.setX(this.startVec.x);
        this.container.setY(this.startVec.y);
        this.container.setRotation(this.rotation);
      }
    }
  }
  MagnetOuter.i = true;
  MagnetOuter.s = GameObject;
  Object.assign(MagnetOuter.prototype, {
    l: MagnetOuter
  });

  class MagnetGlowFlash extends GameObject {
    constructor(a, b) {
      super();
      this.controller = a;
      this.magnet = b;
      this.container = new Container();
      a.layer(0).appendChild(this.container.node);
      this.glow = new Sprite(this.container, Resources.Kd, Keys.bI);
      this.glow.center();
      this.glow.setVisible(false);
      this.glow.setRotation(0);
      this.glow.setUniformScale(0.5);
      this.glow.setBlendMode(4);
      this.phase = this.cooldown = 0;
      this.smoke = new SmokeEmitter(a, 10);
    }
    free() {
      this.glow.free();
      this.smoke.free();
      this.container.free();
      this.container = null;
    }
    flashAt(a, b) {
      if (!(this.cooldown > 0)) {
        this.cooldown = 0.064;
        this.glow.setX(a.x);
        this.glow.setY(a.y);
        this.glow.setVisible(true);
        this.glow.setAlpha(1);
        this.glow.setRotation(90 - b);
        this.phase = 0;
        this.smoke.x = a.x;
        this.smoke.y = a.y;
        this.smoke.angle = -b;
        a = new Vec2(1, 0);
        a.rotate(-b * PI / 180);
        b = Vec2.scaled(a, 15);
        this.smoke.x -= b.x;
        this.smoke.y -= b.y;
        this.smoke.start(10);
        this.magnet.showMagnetHit();
        SoundFx.play(SoundFx.sp_field_bounce);
      }
    }
    update(a) {
      if (this.container != null) {
        this.cooldown -= a;
        this.phase += a * 15;
        if (this.phase >= PI) {
          this.glow.setVisible(false);
        }
        this.glow.setAlpha(Math.sin(this.phase));
        this.smoke.update(a);
      }
    }
    draw() {
      super.draw();
      this.smoke.draw();
    }
  }
  MagnetGlowFlash.i = true;
  MagnetGlowFlash.s = GameObject;
  Object.assign(MagnetGlowFlash.prototype, {
    l: MagnetGlowFlash
  });
