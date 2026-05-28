  // BonusStar - the hidden blue clover (level object name=300). Sits
  // dormant until om-nom passes it, then activate() spawns the
  // glow/star/twinkle sprites and starts the spin animation. collect()
  // fires when the player touches it: plays the SFX, fades sprites
  // out, shoots 6 sparkle sprites outward along the unit circle, and
  // marks `collected` so update() can free the container after 1s.
  // wobbleTime drives the gentle Math.sin(t*3)*3 vertical bob.
  class BonusStar extends MovingEntity {
    constructor(a) {
      super();
      this.controller = a;
      this.wobbleTime = this.time = 0;
      this.container = new Container();
      this.container.setUniformScale(0.4);
      a.layer(11).appendChild(this.container.node);
    }
    activate() {
      this.container.setVisible(true);
      this.glowSprite = new Sprite(this.container, Resources.Oa, Keys.nI);
      this.glowSprite.center();
      this.glowSprite.setUniformScale(0.4);
      var a = new AnimTimeline();
      a.scaleKey(0.01, 0);
      a.scaleKey(1, 0.2);
      a.alphaKey(0, 0);
      a.alphaKey(1, 0.2);
      new SpriteAnimator(this.glowSprite).play(a);
      this.starSprite = new Sprite(this.container, Resources.Oa, Keys.pI);
      this.starSprite.center();
      this.starSprite.anim().loop(STAR_IDLE_BLUE_ANIM);
      this.starSprite.anim().randomize();
      a = new AnimTimeline();
      a.scaleKey(0, 0);
      a.scaleKey(1, 0.2);
      a.alphaKey(0, 0);
      a.alphaKey(1, 0.2);
      new SpriteAnimator(this.starSprite).play(a);
      this.twinkleSprite = new Sprite(this.container, Resources.Oa, Keys.yI);
      this.twinkleSprite.center();
      this.twinkleSprite.setUniformScale(0.4);
      a = new AnimTimeline();
      a.scaleKey(0.01, 0);
      a.scaleKey(1, 0.205);
      a.scaleKey(1.5, 0.505);
      a.alphaKey(0, 0);
      a.alphaKey(1, 0.05);
      a.alphaKey(1, 0.305);
      a.alphaKey(0, 0.505);
      new SpriteAnimator(this.twinkleSprite).play(a, function () {});
    }
    collect() {
      this.time = 0;
      this.collected = true;
      SoundFx.play(SoundFx.sp_cloverleaf);
      var a = new AnimTimeline();
      a.alphaKey(1, 0);
      a.alphaKey(1, 0.05);
      a.alphaKey(0, 0.805);
      a.rotKey(1, 0);
      a.rotKey(1, 0.05);
      a.rotKey(360, 0.805);
      a.scaleKey(1, 0);
      a.scaleKey(1, 0.05);
      a.scaleKey(0.01, 0.805);
      new SpriteAnimator(this.starSprite).play(a);
      a = new AnimTimeline();
      a.alphaKey(1, 0);
      a.alphaKey(1, 0.05);
      a.alphaKey(0, 0.805);
      a.scaleKey(1, 0);
      a.scaleKey(1, 0.05);
      a.scaleKey(0.01, 0.805);
      new SpriteAnimator(this.glowSprite).play(a);
      for (a = 0; a < 6;) {
        var b = a++;
        var c = b * TWO_PI / 6;
        let d = new Sprite(this.container, Resources.Oa, Keys.zI);
        d.setUniformScale((b & 1) == 0 ? 0.5 : 1);
        d.center();
        b = Math.cos(c) * Star.radius * 10;
        c = Math.sin(c) * Star.radius * 10;
        d.tween().x(b, 1);
        d.tween().y(c, 1);
        d.tween().scale(0, 1);
        d.tween().alpha(0, 1, Easing.quadIn());
        d.tween().rotation(360, 1);
      }
    }
    free() {
      this.container.free();
      this.container = null;
    }
    update(a) {
      super.update(a);
      if (this.container != null) {
        this.wobbleTime += a;
        var b = Math.sin(this.wobbleTime * 3) * 3;
        for (var c = 0, d = this.container.childCount(); c < d;) {
          this.container.childAt(c++).setY(b);
        }
        this.time += a;
        if (this.collected && this.time > 1) {
          this.free();
        }
      }
    }
    collisionSize() {
      let a = this.localBounds;
      let b = this.localBounds;
      return new Vec2((a.right - a.left) * 0.9, (b.bottom - b.top) * 0.9);
    }
    scoreValue() {
      return 8;
    }
    draw() {
      if (this.container != null) {
        super.draw();
        this.container.setX(this.x);
        this.container.setY(this.y);
      }
    }
  }
  BonusStar.i = true;
  BonusStar.s = MovingEntity;
  Object.assign(BonusStar.prototype, {
    l: BonusStar
  });
  // Star - the standard collectible (yellow star). On night levels
  // (controller.nightMode) the star has an additional "lit" state:
  // setLit(true) plays the LIGHT_UP animation via lightUpFx and
  // crossfades from starSpriteOff to starSprite, setLit(false) plays
  // LIGHT_DOWN via lightDownFx. Stars with a `timeout` show a ring
  // (timeoutRing) and tick down via the resolver until expiring.
  // wobbleTime drives the same vertical bob as BonusStar.
  class Star extends MovingEntity {
    constructor(a) {
      super();
      this.controller = a;
      this.lit = null;
      var b = Rect.clone(Star.defaultBounds);
      var c = b.w / 2;
      b = b.h / 2;
      c = this.localBounds = new Bounds(0 - c, 0 - b, c, b);
      this.bounds = new Bounds(c.left, c.top, c.right, c.bottom);
      this.timeout = 0;
      this.time = X.next() * 2;
      this.wobbleTime = 0;
      this.container = new Container();
      this.glowSprite = new Sprite(this.container, Resources.Oa, Keys.mI);
      this.glowSprite.center();
      this.glowSprite.setUniformScale(0.4);
      if (a.nightMode) {
        this.starSpriteOff = new Sprite(this.container, Resources.Oa, Keys.sI);
        this.starSpriteOff.center();
        this.starSpriteOff.setUniformScale(0.4);
      }
      this.starSprite = new Sprite(this.container, Resources.Oa, Keys.oI);
      this.starSprite.center();
      this.starSprite.setUniformScale(0.4);
      this.starSprite.setUniformScale(0.4);
      this.starSprite.anim().loop(STAR_IDLE_ANIM);
      this.starSprite.anim().randomize();
      if (a.nightMode) {
        this.starSpriteOff.anim().loop(STAR_IDLE_OFF_ANIM);
        this.starSpriteOff.anim().setTime(0);
        this.starSpriteOff.setAlpha(0);
        this.lightUpFx = new Sprite(this.container, Resources.Oa, Keys.wI);
        this.lightUpFx.center();
        this.lightUpFx.setUniformScale(0.4);
        this.lightUpFx.setVisible(false);
        this.lightUpFx.setBlendMode(3);
        this.lightDownFx = new Sprite(this.container, Resources.Oa, Keys.uI);
        this.lightDownFx.center();
        this.lightDownFx.setUniformScale(0.4);
        this.lightDownFx.setVisible(false);
      }
      a.layer(11).appendChild(this.container.node);
    }
    setLit(a) {
      let b = this.lit == null;
      if (this.lit != a) {
        if (a) {
          if (!b) {
            this.lightUpFx.setVisible(true);
            this.lightUpFx.anim().play(STAR_LIGHT_UP_ANIM);
            this.lightUpFx.anim().onComplete(cachedBind(this, this.onLightUpDone));
            SoundFx.play(X.bool() ? SoundFx.star_light01 : SoundFx.star_light02);
          }
        } else if (b) {
          this.glowSprite.setAlpha(0);
          this.starSprite.setAlpha(0);
        } else {
          this.lightDownFx.setVisible(true);
          this.lightDownFx.anim().play(STAR_LIGHT_DOWN_ANIM);
          this.lightDownFx.anim().onComplete(cachedBind(this, this.onLightDownDone));
        }
        this.lit = a;
      }
    }
    free() {
      this.container.free();
    }
    setTimeout() {
      this.time = this.timeout;
      this.timeoutRing = new Sprite(null, Resources.Oa, Keys.AI);
      this.timeoutRing.setUniformScale(0.4);
      this.timeoutRing.center();
      this.container.appendChild(this.timeoutRing);
      this.container.moveChildTo(this.timeoutRing, 0);
    }
    onLightDownDone() {
      this.lightDownFx.setVisible(false);
    }
    onLightUpDone() {
      this.lightUpFx.setVisible(false);
    }
    update(a) {
      super.update(a);
      this.wobbleTime += a;
      if (this.controller.nightMode) {
        if (this.lit) {
          var b = this.glowSprite;
          b.setAlpha(b.alpha + 0.1);
          b = this.starSpriteOff;
          b.setAlpha(b.alpha - 0.1);
          b = this.starSprite;
          b.setAlpha(b.alpha + 0.1);
        } else {
          b = this.glowSprite;
          b.setAlpha(b.alpha - 0.1);
          b = this.starSpriteOff;
          b.setAlpha(b.alpha + 0.1);
          b = this.starSprite;
          b.setAlpha(b.alpha - 0.1);
        }
      }
      b = Math.sin(this.wobbleTime * 3) * 3;
      if (this.isOwned()) {
        b = 0;
      }
      let c = 0;
      let d = this.container.childCount();
      while (c < d) {
        this.container.childAt(c++).setY(b);
      }
      this.bounds.left = this.x + this.localBounds.left;
      this.bounds.top = this.y + this.localBounds.top;
      this.bounds.right = this.x + this.localBounds.right;
      this.bounds.bottom = this.y + this.localBounds.bottom;
      if (this.timeout > 0 && this.controller.startDelay <= 0) {
        this.timeoutRing.setFrame(Keys.indexed(Keys.BI, (1 - this.time / this.timeout) * 35 | 0));
        if (this.time > 0) {
          this.time = PathResolver.rampToward(this.time, 0, 1, a);
        }
      }
    }
    collisionSize() {
      let a = this.localBounds;
      let b = this.localBounds;
      return new Vec2((a.right - a.left) * 0.9, (b.bottom - b.top) * 0.9);
    }
    scoreValue() {
      return 8;
    }
    draw() {
      super.draw();
      this.container.setX(this.x);
      this.container.setY(this.y);
      this.container.setUniformScale(this.visualScale);
    }
  }
  Star.i = true;
  Star.s = MovingEntity;
  Object.assign(Star.prototype, {
    l: Star
  });

  class ThreeStarsCollect extends GameObject {
    constructor() {
      super();
      this.container = new Container();
      this.container.setAlpha(0.75);
      this.animators = [];
      this.stars = [];
      let a = 0;
      while (a < 4) {
        ++a;
        let b = new Sprite(null, Resources.Oa, "star_effect");
        b.center();
        b.setBlendMode(3);
        b.setVisible(false);
        this.stars.push(b);
        this.container.appendChild(b);
      }
      this.container.setUniformScale(0.4);
      this.spriteIdx = 0;
      SoundFx.play(SoundFx.magnet_idle, true);
      this.spinAnim = new AnimTimeline();
      this.spinAnim.scaleKey(1, 0);
      this.spinAnim.scaleKey(1, 0);
      this.spinAnim.scaleKey(0, 2);
      this.spinAnim.alphaKey(0, 0);
      this.spinAnim.alphaKey(1, 1);
      this.spinAnim.alphaKey(0, 2);
      this.time = 1;
    }
    update(a) {
      this.time += a;
      if (this.spriteIdx < 4 && this.time > 0.5) {
        this.time = 0;
        var b = this.stars[this.spriteIdx++];
        b.setVisible(true);
        new SpriteAnimator(b).loop(this.spinAnim);
      }
      for (b = 0; b < 4;) {
        let c = this.stars[b++];
        c.setRotation(c.rotation + a * 90);
      }
    }
    draw() {
      this.container.setX(this.x);
      this.container.setY(this.y);
    }
    free() {
      SoundFx.stop(SoundFx.magnet_idle);
      this.container.free();
    }
  }
  ThreeStarsCollect.i = true;
  ThreeStarsCollect.s = GameObject;
  Object.assign(ThreeStarsCollect.prototype, {
    l: ThreeStarsCollect
  });
