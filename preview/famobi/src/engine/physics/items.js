  class Gap extends Entity {
    constructor(a, b) {
      super();
      this.controller = a;
      this.charCtrl = b;
      this.enterPath = [];
      this.exitPath = [];
    }
    init(a, b, c, d) {
      function e(g, h) {
        return new AnimFrameRef(new Vec2(g.x, g.y), h);
      }
      this.container = new Container();
      this.controller.layer(5).appendChild(this.container.node);
      this.holeSprite = new Sprite(null, Resources.wf, Keys.jH);
      this.holeSprite.setUniformScale(0.4);
      this.holeSprite.center();
      this.controller.layer(0).appendChild(this.holeSprite.node);
      this.x = a.x;
      this.y = a.y;
      this.angleDeg = b;
      this.radius = c;
      this.duration = d;
      this.elapsedTime = 0;
      this.isActive = false;
      b = new Vec2(0, 0);
      a = this.angleDeg * DEG2RAD;
      c = new Vec2(0, -27.200000000000003);
      d = new Vec2(0, -33.6);
      let f = new Vec2(0, -28);
      this.enterPath[0] = Vec2.sum(b, new Vec2(0, -4.4).rotate(a));
      this.enterPath[1] = Vec2.sum(b, c.rotate(a));
      this.enterPath[2] = Vec2.sum(b, d.rotate(a));
      this.enterPath[3] = Vec2.sum(b, f.rotate(a));
      c = new Vec2(0, -43.2);
      d = new Vec2(0, -9.200000000000001);
      this.exitPath[0] = Vec2.sum(b, new Vec2(0, -36.4).rotate(a));
      this.exitPath[1] = Vec2.sum(b, c.rotate(a));
      this.exitPath[2] = Vec2.sum(b, d.rotate(a));
      b = new Vec2(0, 0);
      d = new Vec2(0, 5.400000000000001);
      c = new Vec2(0, -4.799999999999997);
      d.rotate(a);
      c.rotate(a);
      a = Vec2.sum(b, d);
      b = Vec2.sum(b, c);
      if (v153 == null) {
        c = new AnimTimeline();
        c.setScale(0.4, 0.4, 0, 100);
        c.posKey(0, 0, 0, 100);
        c.setScale(0.45999999999999996, 0.34, 0.05);
        c.posKey(a.x, a.y, 0.05);
        c.setScale(0.34, 0.45999999999999996, 0.1);
        c.posKey(b.x, b.y, 0.1);
        c.setScale(0.4, 0.4, 0.15);
        c.posKey(0, 0, 0.15);
        v153 = c;
      }
      this.enterSequence = new AnimSequence([e(this.enterPath[0], 0, 100), e(this.enterPath[1], 0.05, 100), e(this.enterPath[2], 0.1, 100), e(this.enterPath[3], 0.15)], 1);
      this.exitSequence = new AnimSequence([e(this.exitPath[0], 0, 100), e(this.exitPath[1], 0.05, 100), e(this.exitPath[2], 0.1, 100)], 1);
    }
    enter(a, b) {
      this.container.appendChild(a);
      this.mouseContainer = a;
      this.mainGrab = b;
      this.eyesSprite().setVisible(false);
      if (this.mainGrab != null) {
        this.mainGrab.g.x = this.x + this.enterPath[3].x;
        this.mainGrab.g.y = this.y + this.enterPath[3].y;
        this.mainGrab.prev.x = this.mainGrab.g.x;
        this.mainGrab.prev.y = this.mainGrab.g.y;
        this.playBezier(this.enterSequence);
        this.mouseSprite().anim().play(MOUSE_ANIM_B).onComplete(cachedBind(this, this.onAnimDone));
      } else {
        this.mouseSprite().anim().play(MOUSE_ANIM_A).onComplete(cachedBind(this, this.onAnimDone));
      }
      a.center();
      SoundFx.play(SoundFx.mouse_rustle);
    }
    exit() {
      this.elapsedTime = 0;
      this.isActive = false;
      this.eyesSprite().setVisible(false);
      if (this.mainGrab != null) {
        this.mouseSprite().anim().play(MOUSE_ANIM_D).onComplete(cachedBind(this, this.onAnimDone));
        this.playBezier(this.exitSequence);
      } else {
        this.mouseSprite().anim().play(MOUSE_ANIM_C).onComplete(cachedBind(this, this.onAnimDone));
      }
    }
    mouseSprite() {
      return this.mouseContainer.childAt(0);
    }
    eyesSprite() {
      return this.mouseContainer.childAt(1);
    }
    playBezier(a) {
      this.bezierMover = new BezierMover(this, this.mainGrab);
      this.bezierMover.play(a);
    }
    containsGrab(a) {
      return Vec2.distance(this.x, this.y, a.g.x, a.g.y) < this.radius;
    }
    captureGrab(a) {
      this.mainGrab = a;
      a.pinned = true;
      a.g.x = this.x + this.enterPath[3].x;
      a.g.y = this.y + this.enterPath[3].y;
      a.prev.x = a.g.x;
      a.prev.y = a.g.y;
      a.delta = new Vec2(0, 0);
      a.velocity = new Vec2(0, 0);
      this.mouseSprite().setFrame(Keys.oH);
      this.spinAnimator = new SpriteAnimator(this.mouseSprite());
      this.spinAnimator.play(v153);
      this.playBezier(this.enterSequence);
    }
    dropGrab() {
      this.mainGrab.pinned = false;
      this.mainGrab = null;
      this.exit();
      SoundFx.play(SoundFx.mouse_tap);
    }
    hasGrab() {
      return this.mainGrab != null;
    }
    update(a) {
      super.update(a);
      if (this.bezierMover != null) {
        this.bezierMover.tickAnims(a);
      }
      if (this.isActive) {
        this.elapsedTime += a;
        if (this.elapsedTime >= this.duration && (this.spinAnimator == null || !this.spinAnimator.isPlaying())) {
          this.exit();
        }
      }
    }
    draw() {
      super.draw();
      this.container.setX(this.x);
      this.container.setY(this.y);
      this.holeSprite.setX(this.x);
      this.holeSprite.setY(this.y);
      if (this.mouseContainer != null) {
        this.mouseContainer.setRotation(this.angleDeg);
      }
    }
    tryClickAt(a, b) {
      a = Vec2.distance(this.x, this.y, a, b);
      b = this.spinAnimator != null && this.spinAnimator.isPlaying();
      if (a < this.radius) {
        return !b;
      } else {
        return false;
      }
    }
    onAnimDone(a) {
      switch (a) {
        case MOUSE_ANIM_A:
          this.elapsedTime = 0;
          this.isActive = true;
          if (X.bool()) {
            this.mouseSprite().setFrame(Keys.mH);
            this.eyesSprite().setVisible(true);
            this.eyesSprite().anim().play(EYES_ANIM);
          }
          break;
        case MOUSE_ANIM_B:
          this.elapsedTime = 0;
          this.isActive = true;
          break;
        case MOUSE_ANIM_C:
        case MOUSE_ANIM_D:
          this.mouseContainer.remove();
          this.mouseContainer = null;
          this.charCtrl.switchToNext();
      }
    }
  }
  Gap.i = true;
  Gap.s = Entity;
  Object.assign(Gap.prototype, {
    l: Gap
  });
  class LighterEntity extends AnchoredEntity {
    constructor(a, b) {
      super();
      this.litRadius = b;
      this.spinVel = 0;
      var c = CandyCutAnim.BOUNDS.w / 2;
      let d = CandyCutAnim.BOUNDS.h / 2;
      c = this.localBounds = new Bounds(0 - c, 0 - d, c, d);
      this.bounds = new Bounds(c.left, c.top, c.right, c.bottom);
      this.container = new Container();
      this.container.setUniformScale(0.4);
      a.layer(9).appendChild(this.container.node);
      this.glowSprite = new Sprite(this.container, Resources.Ef, Keys.QH);
      this.glowSprite.setAlpha(0.4);
      this.glowSprite.center();
      this.glowSprite.setUniformScale(b * 2 / this.glowSprite.size.x * 1.5 / 0.4);
      this.glowSprite.setBlendMode(3);
      new Sprite(this.container, Resources.Ef, Keys.OH).center();
      new Sprite(this.container, Resources.Ef, Keys.RH).center();
      this.fireflySprite = new Sprite(this.container, Resources.Ef);
      this.fireflySprite.anim().loop(FIREFLY_ANIM);
      this.fireflySprite.center();
      this.bubbleAnim = new BubbleAnim(a);
      this.litBy = null;
    }
    update(a) {
      super.update(a);
      this.bounds.left = this.x + this.localBounds.left;
      this.bounds.top = this.y + this.localBounds.top;
      this.bounds.right = this.x + this.localBounds.right;
      this.bounds.bottom = this.y + this.localBounds.bottom;
    }
    draw() {
      super.draw();
      this.x = this.constraint.g.x;
      this.y = this.constraint.g.y;
      this.container.setVisible(this.litBy == null);
      this.container.setX(this.x);
      this.container.setY(this.y);
      this.container.setRotation(this.rotation);
      this.bubbleAnim.setX(this.x);
      this.bubbleAnim.setY(this.y);
    }
  }
  LighterEntity.i = true;
  LighterEntity.s = AnchoredEntity;
  Object.assign(LighterEntity.prototype, {
    l: LighterEntity
  });
  class Pump extends MovingEntity {
    constructor(a) {
      super();
      this.sprite = new Sprite(null, Resources.wm, Keys.SH);
      this.sprite.center();
      this.sprite.setUniformScale(0.4);
      a.layer(5).appendChild(this.sprite.node);
      a = Pump.BOUNDS.w / 2;
      let b = Pump.BOUNDS.h / 2;
      this.localBounds = new Bounds(0 - a, 0 - b, a, b);
      this.angle = 0;
      this.leftEnd = Vec2.zero();
      this.rightEnd = Vec2.zero();
      this.pressTouchId = this.pressTimer = 0;
      this.sprays = [];
    }
    spawnSpray(a) {
      a = new DirectionalSpray(a, this.angle * RAD2DEG - 90);
      let b = new Vec2(this.x + 40, this.y);
      b.rotateAround(this.angle - Math.PI / 2, this.x, this.y);
      a.x = b.x;
      a.y = b.y;
      a.start(5);
      this.sprays.push(a);
    }
    updateEnds() {
      var a = this.localBounds;
      a = (a.right - a.left) / 2;
      this.leftEnd.x = this.x - a;
      this.rightEnd.x = this.x + a;
      this.leftEnd.y = this.rightEnd.y = this.y;
      this.angle = this.rotation * DEG2RAD;
      this.leftEnd.rotateAround(this.angle, this.x, this.y);
      this.rightEnd.rotateAround(this.angle, this.x, this.y);
    }
    update(a) {
      super.update(a);
      this.updateBounds();
      let b = 0;
      let c = this.sprays;
      while (b < c.length) {
        let d = c[b];
        ++b;
        if (d.particles.length == 0) {
          Std.remove(this.sprays, d);
          break;
        }
        d.update(a);
      }
    }
    draw() {
      super.draw();
      this.sprite.setX(this.x);
      this.sprite.setY(this.y);
      this.sprite.setRotation(this.rotation);
      this.sprite.setUniformScale(this.visualScale * 0.4);
      let a = 0;
      let b = this.sprays;
      while (a < b.length) {
        b[a++].draw();
      }
    }
    collisionSize() {
      let a = this.localBounds;
      let b = this.localBounds;
      return new Vec2((a.right - a.left) * 1.2, (b.bottom - b.top) * 1.2);
    }
    position() {
      let a = new Vec2(0.8, -1.2000000000000002);
      a.rotate(this.rotation * DEG2RAD);
      return Vec2.sum(new Vec2(this.x, this.y), a);
    }
    setPosition(a) {
      super.setPosition(a);
      let b = new Vec2(0.8, -1.2000000000000002);
      b.rotate(this.rotation * DEG2RAD);
      super.setPosition(Vec2.diff(a, b));
    }
  }
  Pump.i = true;
  Pump.s = MovingEntity;
  Object.assign(Pump.prototype, {
    l: Pump
  });
  class Vinyl extends Entity {
    constructor(a) {
      super();
      this.controller = a;
      this.container = new Container();
      a.layer(0).appendChild(this.container.node);
      this.groupKeys = [];
      this.siblings = [];
      this.activeIdx = -1;
      this.tmpPos = Vec2.MAX();
      this.recordSprite = new Sprite(this.container, Resources.Tc, Keys.RI);
      this.recordSprite.center();
      this.innerRingGroup = new SceneGroup();
      this.innerRingGroup.setEffect(new RingDrawEffect());
      this.container.node.appendChild(this.innerRingGroup);
      this.outerRingGroup = new SceneGroup();
      this.outerRingGroup.setEffect(new RingDrawEffect());
      a.layer(13).appendChild(this.outerRingGroup);
      this.markerL = new Sprite(this.container, Resources.Tc, Keys.Sy);
      this.markerL.center();
      this.markerR = new Sprite(this.container, Resources.Tc, Keys.Sy);
      this.markerR.setScaleX(-1);
      this.markerR.center();
      this.handleL = new Sprite(this.container, Resources.Tc, Keys.Ry);
      this.handleL.center();
      this.handleR = new Sprite(this.container, Resources.Tc, Keys.Ry);
      this.handleR.setScaleX(-1);
      this.handleR.center();
      this.pinL = new Sprite(this.container, Resources.Tc, Keys.Py);
      this.pinL.center();
      this.pinL.setRotation(90);
      this.pinR = new Sprite(this.container, Resources.Tc, Keys.Py);
      this.pinR.center();
      this.pinR.setRotation(-90);
      this.pinHighlightL = new Sprite(this.container, Resources.Tc, Keys.Qy);
      this.pinHighlightL.center();
      this.pinHighlightL.setRotation(90);
      this.pinHighlightL.setVisible(false);
      this.pinHighlightR = new Sprite(this.container, Resources.Tc, Keys.Qy);
      this.pinHighlightR.center();
      this.pinHighlightR.setRotation(-90);
      this.pinHighlightR.setVisible(false);
      this.centerKnob = new Sprite(this.container, Resources.Tc, Keys.QI);
      this.centerKnob.center();
    }
    free() {
      this.groupKeys = this.siblings = null;
      this.container.free();
      this.controller = this.container = null;
    }
    setSize(a) {
      this.size = a;
      var b = this.size / 216;
      this.container.setUniformScale(0.4);
      this.recordSprite.setUniformScale(b);
      this.handleL.setUniformScale(b);
      this.handleR.setScaleX(-b);
      this.handleR.setScaleY(b);
      a = b >= 0.4 ? b : 0.4;
      this.markerL.setUniformScale(a);
      this.markerR.setUniformScale(-a);
      b = b >= 0.75 ? b : 0.75;
      this.pinL.setUniformScale(b);
      this.pinR.setUniformScale(b);
      this.pinHighlightL.setUniformScale(b);
      this.pinHighlightR.setUniformScale(b);
      this.centerKnob.setUniformScale(1 - (1 - a) * 0.5);
      this.diameter = this.size;
      a = this.innerRingGroup.effect;
      a.radius = this.recordSprite.getWidth() / 2;
      a.lineWidth = b * 10;
      a = this.size / this.container.scaleX - this.pinL.getWidth() / 2 * 0.76;
      this.pinL.setX(this.pinHighlightL.setX(-a));
      this.pinR.setX(this.pinHighlightR.setX(a));
    }
    isOneHandle() {
      return !this.pinL.isVisible();
    }
    setOneHandle(a) {
      this.pinL.setVisible(!a);
    }
    leftHighlightVisible() {
      return this.pinHighlightL.isVisible();
    }
    setLeftHighlight(a) {
      this.pinHighlightL.setVisible(a);
    }
    rightHighlightVisible() {
      return this.pinHighlightR.isVisible();
    }
    setRightHighlight(a) {
      this.pinHighlightR.setVisible(a);
    }
    anyCollidesWithSibling() {
      let a = this.siblings.length;
      let b;
      let c = 0;
      while (c < a) {
        b = this.siblings[c++];
        if (b != this && this.sharesKey(b)) {
          return true;
        }
      }
      return false;
    }
    draw() {
      super.draw();
      this.container.setX(this.x);
      this.container.setY(this.y);
      this.container.setRotation(this.rotation);
      this.handleL.setRotation(-this.rotation);
      this.handleR.setRotation(-this.rotation);
      this.innerRingGroup.visibility = this.rightHighlightVisible() || this.leftHighlightVisible() ? 2 : 1;
      let a = this.siblings.length;
      var b;
      let c = this.siblings.indexOf(this);
      for (b = 0; b < a;) {
        this.siblings[b++].xp.visibility = 1;
      }
      let d = 0;
      while (d < a) {
        b = this.siblings[d++];
        if (b != this && b.anyCollidesWithSibling() && this.siblings.indexOf(b) < c) {
          b.renderCollisionRing(this.x, this.y, this.diameter, b.x, b.y, b.diameter);
        }
      }
    }
    renderCollisionRing(a, b, c, d, e, f) {
      this.outerRingGroup.visibility = 1;
      let g = Vec2.distance(a, b, d, e);
      if (!(g >= c + f) && !(c >= g + f)) {
        new Vec2(a - d, b - e).angle();
        a = this.outerRingGroup;
        a.visibility = 2;
        b = a.localT;
        b.translate.x = this.x;
        b.translate.y = this.y;
        b.flags = b.flags & -2 | 496;
        b = a.localT;
        b.scale.x = b.scale.y = this.container.scaleX;
        b.flags = b.flags & -2 | 500;
        a = a.effect;
        a.radius = this.recordSprite.getWidth() / 2;
        a.opacity = 0.2;
        a.lineWidth = this.pinL.scaleX * 6;
      }
    }
    sharesKey(a) {
      if (this.x == a.x && this.y == a.y && this.size == a.size) {
        return false;
      }
      let b = this.groupKeys.length;
      let c = 0;
      while (c < b) {
        if (a.groupKeys.indexOf(this.groupKeys[c++]) >= 0) {
          return true;
        }
      }
      return false;
    }
  }
  Vinyl.i = true;
  Vinyl.s = Entity;
  Object.assign(Vinyl.prototype, {
    l: Vinyl
  });
  class Sock extends MovingEntity {
    constructor(a, b) {
      super();
      this.controller = a;
      this.group = b;
      this.angle = 0;
      this.leftEnd = new Vec2(0, 0);
      this.rightEnd = new Vec2(0, 0);
      this.endA = new Vec2(0, 0);
      this.endB = new Vec2(0, 0);
      this.state = this.celebrateTimer = 0;
      this.container = new Container();
      a.layer(5).appendChild(this.container.node);
      this.baseSprite = new Sprite(this.container, Resources.Dk, b == 0 ? Keys.My : Keys.TH);
      this.baseSprite.setUniformScale(0.4);
      this.baseSprite.center();
      this.baseSprite.setY(30);
      this.baseSprite.setRotation(this.angle);
      this.celebrateSprite = new Sprite(this.container, Resources.Dk, Keys.UH);
      this.celebrateSprite.setUniformScale(0.4);
      this.celebrateSprite.center();
      this.celebrateSprite.setOriginVec(new Vec4(this.celebrateSprite.originX, this.celebrateSprite.originY + 15, 0, 1));
      this.celebrateSprite.setVisible(false);
    }
    updateEnds() {
      this.leftEnd.x = this.x - Sock.WIDTH / 2;
      this.rightEnd.x = this.x + Sock.WIDTH / 2;
      this.leftEnd.y = this.rightEnd.y = this.y;
      this.endA.x = this.leftEnd.x;
      this.endB.x = this.rightEnd.x;
      this.endA.y = this.endB.y = this.y + Sock.handleY;
      this.angle = this.rotation * DEG2RAD;
      this.leftEnd.rotateAround(this.angle, this.x, this.y);
      this.rightEnd.rotateAround(this.angle, this.x, this.y);
      this.endA.rotateAround(this.angle, this.x, this.y);
      this.endB.rotateAround(this.angle, this.x, this.y);
    }
    update(a) {
      super.update(a);
      if (this.motion != null) {
        this.updateEnds();
      }
    }
    draw() {
      if (this.celebrateSprite.isVisible()) {
        if (!this.celebrateSprite.anim().isPlaying(v167)) {
          this.celebrateSprite.setVisible(false);
        }
      }
      super.draw();
      this.container.setX(this.x);
      this.container.setY(this.y);
      this.container.setUniformScale(this.visualScale);
      this.container.setRotation(this.rotation);
    }
    collisionSize() {
      let a = Resources.Dk.frames.findByName(Keys.My).uvOffset;
      return new Vec2(a.w * 0.27999999999999997, a.h * 0.27999999999999997);
    }
    position() {
      let a = new Vec2(-1.2000000000000002, 10);
      a.rotate(this.rotation * DEG2RAD);
      return Vec2.sum(new Vec2(this.x, this.y), a);
    }
    setPosition(a) {
      let b = new Vec2(-1.2000000000000002, 10);
      b.rotate(this.rotation * DEG2RAD);
      super.setPosition(Vec2.diff(a, b));
    }
  }
  Sock.i = true;
  Sock.s = MovingEntity;
  Object.assign(Sock.prototype, {
    l: Sock
  });
  class SawBlade extends MovingEntity {
    constructor(a, b, c, d, e, f) {
      super();
      this.controller = a;
      this.width = d;
      this.sprite = f != -1 ? new Sprite(null, Resources.gl, [Keys.OG, Keys.PG, Keys.QG, Keys.SG][d - 1]) : new Sprite(null, Resources.Dd, [Keys.YH, Keys.ZH, Keys.$H, Keys.aI][d - 1]);
      this.x = b;
      this.y = c;
      a.layer(5).appendChild(this.sprite.node);
      this.sprite.setUniformScale(0.4);
      this.sprite.center();
      this.sprite.setX(b);
      this.sprite.setY(c);
      this.sprite.setRotation(e);
      this.leftEnd = Vec2.zero();
      this.rightEnd = Vec2.zero();
      this.endA = Vec2.zero();
      this.endB = Vec2.zero();
      this.electric = false;
      this.offTime = this.onTime = this.initialDelay = 0;
      this.ignoreElectric = false;
      this.timer = 0;
      if (f > 0) {
        this.button = new SawBladeButton(a, b, c, f);
        this.button.onClick = cachedBind(this, this.onGravityClick);
      }
      this.toggled = false;
      this.baseRotation = this.rotation = e;
      this.setToggleValue(f);
      this.updateEnds();
      this.touchId = -1;
      this.tweenDuration = null;
      this.idleTimer = this.idleCounter = 0;
    }
    updateEnds() {
      let a = this.electric ? this.width - 160 : this.sprite.size.x * 0.4;
      a /= 2;
      this.leftEnd.x = this.x - a;
      this.rightEnd.x = this.x + a;
      this.leftEnd.y = this.rightEnd.y = this.y - 5;
      this.endA.x = this.leftEnd.x;
      this.endB.x = this.rightEnd.x;
      this.endA.y = this.endB.y = this.y + 5;
      this.angle = this.rotation * DEG2RAD;
      this.leftEnd.rotateAround(this.angle, this.x, this.y);
      this.rightEnd.rotateAround(this.angle, this.x, this.y);
      this.endA.rotateAround(this.angle, this.x, this.y);
      this.endB.rotateAround(this.angle, this.x, this.y);
    }
    activateZap() {
      this.ignoreElectric = true;
      this.sprite.anim().loop(v170);
      this.timer = this.onTime;
      SoundFx.play(SoundFx.electric, true);
      this.sprite.moveToTop();
    }
    toggleOn() {
      this.ignoreElectric = false;
      this.timer = this.offTime;
      this.sprite.anim().stop();
      this.sprite.setTexture(Resources.ce, Keys.iH);
      this.sprite.center();
      SoundFx.stop(SoundFx.electric);
    }
    update(a) {
      super.update(a);
      if (this.motion != null) {
        this.updateEnds();
      }
      if (this.electric) {
        if (this.ignoreElectric) {
          this.timer = PathResolver.rampToward(this.timer, 0, 1, a);
          if (this.timer == 0) {
            this.toggleOn();
          }
        } else {
          this.timer = PathResolver.rampToward(this.timer, 0, 1, a);
          if (this.timer == 0) {
            this.activateZap();
          }
        }
      }
      var b = this.button;
      if (b != null) {
        b.update(a);
      }
      if (this.tweenDuration != null) {
        this.tweenTime += a;
        b = Math.min(1, this.tweenTime / this.tweenDuration);
        let c = Easing.poly(100)(b);
        let d = this.fromRotation;
        this.rotation = d + (this.toRotation - d) * c;
        this.updateEnds();
        if (b == 1) {
          this.tweenDuration = null;
        }
      }
      if (this.borderFx != null) {
        this.borderFx.update(a);
      }
      this.idleTimer += a;
      if (this.idleTimer > 1) {
        this.idleCounter = this.idleTimer = 0;
      }
    }
    setToggleValue(a) {
      this.toggleValue = a;
    }
    toggleRotation() {
      this.toggled = !this.toggled;
      let a = this.baseRotation + (this.toggled ? 90 : 0);
      this.tweenTime = 0;
      this.tweenDuration = Math.abs(a - this.rotation) / 90 * 0.3;
      this.fromRotation = this.rotation;
      this.toRotation = a;
      this.button.sprite.setScaleX(-this.button.sprite.scaleX);
    }
    onElectricDeactivate() {
      if (!this.electric) {
        this.borderFx = new AnimatedNineSlice(this.controller, Vec2.distance(this.leftEnd.x, this.leftEnd.y, this.rightEnd.x, this.rightEnd.y), Vec2.distance(this.leftEnd.x, this.leftEnd.y, this.endA.x, this.endA.y) * 4, 3, true);
        this.borderFx.container.center();
        this.borderFx.container.setRotation(this.rotation);
      }
    }
    onElectricReactivate() {
      if (this.borderFx != null) {
        this.borderFx.free();
        this.borderFx = null;
      }
    }
    onButtonClick(a) {
      if (a == 0 && this.onToggleCb != null) {
        this.onToggleCb(this.toggleValue);
      }
      if (this.toggled) {
        SoundFx.play(SoundFx.spike_rotate_in);
      } else {
        SoundFx.play(SoundFx.spike_rotate_out);
      }
    }
    draw() {
      super.draw();
      this.sprite.setX(this.x);
      this.sprite.setY(this.y);
      this.sprite.setRotation(this.rotation);
      if (this.button != null) {
        this.button.sprite.setRotation(this.rotation);
      }
      if (this.borderFx != null) {
        this.borderFx.container.setX(this.x);
        this.borderFx.container.setY(this.y);
        this.borderFx.container.setRotation(this.rotation);
      }
    }
  }
  SawBlade.i = true;
  SawBlade.s = MovingEntity;
  Object.assign(SawBlade.prototype, {
    l: SawBlade
  });
  class SteamGenerator extends MovingEntity {
    constructor(a) {
      super();
      this.controller = a;
      this.puffs = [];
    }
    init(a, b, c) {
      this.x = a;
      this.y = b;
      this.rotation = c;
      this.phase = 0;
      this.touchPoints = new HashMap();
      this.level = 0;
      this.container = new Container();
      this.controller.layer(5).appendChild(this.container.node);
      this.baseSprite = new Sprite(this.container, Resources.Kk, Keys.FI);
      this.baseSprite.center();
      this.baseSprite.setY(27);
      this.baseSprite.setUniformScale(0.4);
      this.leverSprite = new Sprite(this.container, Resources.Kk, Keys.GI);
      this.leverSprite.setUniformScale(0.4);
      this.leverSprite.center();
      this.leverSprite.setY(27);
      this.leverTargetAngle = this.leverAngle = 0;
      this.bubbleGroupA = new Container(null, this.container);
      this.bubbleGroupB = new Container(null, this.container);
      this.updatePuffsForLevel();
    }
    puffOffset() {
      let a = 0;
      switch (this.level) {
        case 0:
          a = 32.9;
          break;
        case 1:
          a = 94;
          break;
        case 2:
          a = 141;
      }
      return a * 1.2;
    }
    puffSinusoidalOffset() {
      let a = this.puffOffset();
      return a += Math.sin(this.phase * 6);
    }
    draw() {
      super.draw();
      this.container.setX(this.x);
      this.container.setY(this.y);
      this.container.setRotation(this.rotation);
      this.leverSprite.setRotation(this.leverAngle);
      this.container.setUniformScale(this.visualScale);
    }
    update(a) {
      super.update(a);
      for (var b = 0, c = this.puffs.length; b < c;) {
        if (this.puffs[b].sprite == null) {
          --c;
          if (c > 0) {
            this.puffs[b] = this.puffs[this.puffs.length - 1];
          }
          this.puffs.pop();
        } else {
          ++b;
        }
      }
      b = 0;
      for (c = this.puffs; b < c.length;) {
        c[b++].update(a);
      }
      this.phase += a;
      this.leverAngle += (this.leverTargetAngle - this.leverAngle) * 0.05;
      if (this.isOwned()) {
        for (b = this.touchPoints.keys(); b.hasNext();) {
          c = b.next();
          let d = this.touchPoints.map[c];
          d.time += a;
          if (d.time >= 0.5) {
            if (Vec2.distance(d.startPos.x, d.startPos.y, d.currentPos.x, d.currentPos.y) < 1) {
              this.advanceLevel();
            }
            this.touchPoints.remove(c);
          }
        }
      }
    }
    touchPos() {
      let a = new Vec2(this.x, this.y);
      if (this.isOwned()) {
        return a;
      }
      let b = new Vec2(0, 27);
      b.rotate(this.rotation * DEG2RAD);
      return Vec2.sum(a, b);
    }
    tryClickAt(a, b, c) {
      let d = this.touchPos();
      if (Vec2.diff(new Vec2(a, b), d).length() < 30) {
        if (this.isOwned()) {
          this.touchPoints.map[c] = new Triple3(new Vec2(a, b), new Vec2(a, b), 0);
        } else {
          this.advanceLevel();
          return true;
        }
      }
      return false;
    }
    onTouchDrag(a, b, c) {
      if (this.touchPoints.map.hasOwnProperty(c)) {
        this.touchPoints.map[c].currentPos = new Vec2(a, b);
      }
      return false;
    }
    onTouchEnd(a) {
      if (this.touchPoints.map.hasOwnProperty(a)) {
        let b = this.touchPoints.map[a];
        if (b.time <= 0.5 && Vec2.distance(b.startPos.x, b.startPos.y, b.currentPos.x, b.currentPos.y) <= 1) {
          this.advanceLevel();
        }
        this.touchPoints.remove(a);
      }
      return false;
    }
    advanceLevel() {
      let a = 0;
      switch (this.level) {
        case 0:
          this.level++;
          a = 0;
          SoundFx.play(SoundFx.steam_start_2);
          break;
        case 1:
          this.level++;
          a = 0;
          SoundFx.play(SoundFx.steam_start);
          break;
        case 2:
          this.level = 0;
          a = 1;
          SoundFx.play(SoundFx.steam_end);
      }
      this.updatePuffsForLevel();
      switch (a) {
        case 0:
          this.leverTargetAngle += 180;
          break;
        case 1:
          this.leverTargetAngle = 0;
      }
    }
    updatePuffsForLevel() {
      for (var a = this.phase = 0, b = this.puffs; a < b.length;) {
        b[a++].iN();
      }
      if (this.level != 3) {
        a = 7;
        if (this.level == 1) {
          a = 14;
        }
        if (this.level == 2) {
          a = 20;
        }
        b = 0;
        for (var c = a; b < c;) {
          let e = b++;
          var d = null;
          switch (e % 3) {
            case 0:
              d = PARTICLE_1_ANIM;
              break;
            case 1:
              d = PARTICLE_2_ANIM;
              break;
            case 2:
              d = PARTICLE_3_ANIM;
          }
          let f = -this.puffOffset();
          f *= 1 + X.randCentered() * 0.1;
          if (this.level == 1 && (e % 3 == 1 || e % 3 == 2)) {
            f *= 0.95;
          }
          if (this.level == 2 && (e % 3 == 1 || e % 3 == 2)) {
            f *= 0.94;
          }
          let g = 1;
          if (e % 3 == 0) {
            g = 0;
          } else if (e % 3 == 1) {
            g = this.level;
          } else if (e % 3 == 2) {
            g = -this.level;
          }
          let h = new AnimTimeline();
          h.posKey(5, 0, 0, 100);
          h.posKey(5 + g, f, 0.6);
          h.scaleKey(0.4, 0);
          h.scaleKey(0.6000000000000001, 0.6);
          d = new SteamPuff(e * 0.6 / a, d, h);
          this.puffs.push(d);
          (e % 3 == 0 ? this.bubbleGroupA : this.bubbleGroupB).appendChild(d.sprite);
        }
      }
    }
    setPosition(a) {
      this.baseSprite.setY(3);
      this.leverSprite.setY(3);
      this.bubbleGroupA.setY(-27);
      this.bubbleGroupB.setY(-27);
      super.setPosition(a);
    }
    scoreValue() {
      return this.baseSprite.getWidth() * 0.3;
    }
    collisionSize() {
      return new Vec2(40, 56);
    }
  }
  SteamGenerator.i = true;
  SteamGenerator.s = MovingEntity;
  Object.assign(SteamGenerator.prototype, {
    l: SteamGenerator
  });
  class Transporter extends Entity {
    constructor(a, b, c) {
      super();
      this.width = a;
      this.height = b;
      new Vec2(0, 0);
      this.container = new Container();
      this.tiles = [];
      this.offset = 0;
      this.tileWidth = Resources.Rc.frames.findByName(DIGIT_FRAME_4).sourceSize.x;
      switch (c) {
        case -1:
          a = DIGIT_FRAME_6;
          break;
        case 1:
          a = DIGIT_FRAME_5;
          break;
        default:
          a = DIGIT_FRAME_4;
      }
      this.digitFrame = a;
    }
    draw() {
      super.draw();
      var a = this.tileWidth * 0.4;
      if (this.tiles[0] == null) {
        this.tiles[0] = new Sprite(this.container, Resources.Rc, this.digitFrame);
      }
      this.tiles[0].setVisible(true);
      var b = 1;
      var c = this.tiles[0];
      var d = Math.max(this.offset - (this.offset / a | 0) * a, 0);
      c.setX(0);
      c.setScaleX(d / this.tileWidth);
      for (c.setScaleY(this.height / c.size.y); d + a <= this.width;) {
        if (this.tiles[b] == null) {
          this.tiles[b] = new Sprite(this.container, Resources.Rc, this.digitFrame);
        }
        this.tiles[b].setVisible(true);
        c = this.tiles[b++];
        c.setScaleX(0.4);
        c.setScaleY(this.height / c.size.y);
        c.setX(d);
        d += c.getWidth();
      }
      a = this.width - d;
      if (this.tiles[b] == null) {
        this.tiles[b] = new Sprite(this.container, Resources.Rc, this.digitFrame);
      }
      this.tiles[b].setVisible(true);
      c = this.tiles[b++];
      c.setX(this.width - a);
      c.setScaleX(a / this.tileWidth);
      c.setScaleY(this.height / c.size.y);
      for (c = this.tiles.length; b < c;) {
        this.tiles[b++].setVisible(false);
      }
    }
    move(a) {
      this.offset += a;
      for (a = this.tileWidth * 0.4; this.offset > this.width;) {
        this.offset -= a;
      }
      while (this.offset < 0) {
        this.offset += a;
      }
    }
  }
  Transporter.i = true;
  Transporter.s = Entity;
  Object.assign(Transporter.prototype, {
    l: Transporter
  });
  class TutText extends TimedFader {
    constructor(a) {
      a = new Sprite(null, Resources.eT, Keys.indexed(Keys.lK, a));
      a.setUniformScale(0.4);
      super(a);
      this.cycle = 0;
    }
    applyMotion(a) {
      this.rotation = a.angle ?? 0;
      let b = a.path;
      let c = LevelController.SCALE;
      if (b != null) {
        let d = PathResolver.DEFAULT_RES;
        if (b.charAt(0) == "R") {
          d = Math.round(Numeric.parseInt(Std.substr(b, 2, null)) * 3 / 2 + 1);
        }
        a = new PathState(d, a.moveSpeed * c, a.rotateSpeed);
        a.angle = this.rotation;
        a.fromSpec(b, this.x, this.y);
        this.setMotion(a);
        a.start();
      }
    }
    update(a) {
      if (this.special == 2) {
        this.time += a;
        switch (this.state) {
          case 1:
            a = Math.min(this.time / 1, 1);
            this.sprite.setAlpha(a);
            if (a == 1) {
              this.startX = this.x;
              this.setState(2);
            }
            break;
          case 2:
            a = Math.min(this.time / 1, 1);
            this.x = this.startX + (this.startX + (LevelController.airReach + 40) * WorldScale.scale) * a;
            if (a == 1) {
              this.setState(3);
            }
            break;
          case 3:
            a = Math.min(this.time / 0.5, 1);
            this.sprite.setAlpha(1 - a);
            if (a == 1) {
              if (++this.cycle == 2) {
                this.sprite.setVisible(false);
                this.setState(0);
              } else {
                this.x = this.startX;
                this.setState(1);
              }
            }
        }
      } else {
        if (this.motion != null) {
          this.motion.update(a);
          this.x = this.motion.g.x;
          this.y = this.motion.g.y;
          this.rotation = this.motion.angle;
        }
        super.update(a);
      }
    }
  }
  TutText.i = true;
  TutText.s = TimedFader;
  Object.assign(TutText.prototype, {
    l: TutText
  });

  class Bouncer extends MovingEntity {
    constructor(a, b, c, d, e) {
      super();
      this.angle = 0;
      this.leftEnd = Vec2.zero();
      this.rightEnd = Vec2.zero();
      this.endA = Vec2.zero();
      this.endB = Vec2.zero();
      this.moveTimer = -1;
      this.moveVel = new Vec2(0, 0);
      this.bounceHandled = false;
      this.container = new Container();
      a.layer(5).appendChild(this.container.node);
      this.sprite = new Sprite(this.container);
      this.sprite.setTexture(Resources.fd, d == 1 ? Keys.TG : Keys.VG);
      this.sprite.setUniformScale(0.4);
      this.sprite.center();
      this.rotation = e;
      this.x = b;
      this.y = c;
      this.w = d;
      this.lastPos = new Vec2(b, c);
      a = (d == 1 ? 194 : 302) * 0.4 / 2;
      d = (d == 1 ? 127 : 123) * 0.4 / 2;
      d = this.localBounds = new Bounds(0 - a, 0 - d, a, d);
      this.bounds = new Bounds(d.left, d.top, d.right, d.bottom);
      this.updateEnds();
    }
    syncLastPos() {
      this.lastPos.x = this.x;
      this.lastPos.y = this.y;
    }
    playBounceAnim() {
      let a = this.w == 1 ? X1_ANIM : X2_ANIM;
      this.sprite.anim().play(a);
    }
    updateEnds() {
      var a = this.localBounds;
      a = a.right - a.left;
      this.leftEnd.x = this.x - a / 2;
      this.rightEnd.x = this.x + a / 2;
      this.leftEnd.y = this.rightEnd.y = this.y - vLN10 / 2;
      this.endA.x = this.leftEnd.x;
      this.endB.x = this.rightEnd.x;
      this.endA.y = this.endB.y = this.y + vLN10 / 2;
      this.angle = this.rotation * DEG2RAD;
      this.leftEnd.rotateAround(this.angle, this.x, this.y);
      this.rightEnd.rotateAround(this.angle, this.x, this.y);
      this.endA.rotateAround(this.angle, this.x, this.y);
      this.endB.rotateAround(this.angle, this.x, this.y);
    }
    update(a) {
      super.update(a);
      if (this.motion != null) {
        this.updateEnds();
      }
    }
    draw() {
      super.draw();
      this.container.setX(this.x);
      this.container.setY(this.y);
      this.sprite.setUniformScale(this.visualScale * 0.4);
      this.container.setRotation(this.rotation);
    }
    collisionSize() {
      let a = this.localBounds;
      let b = this.localBounds;
      return new Vec2(a.right - a.left, b.bottom - b.top);
    }
    setPosition(a) {
      let b = new Vec2(this.x, this.y);
      if (!(Vec2.diff(a, b).lengthSq() < 0.000001)) {
        if (this.moveTimer >= 0.001 && this.moveTimer <= 0.1) {
          this.moveVel = Vec2.divided(Vec2.diff(a, b), this.moveTimer);
          if (this.moveVel.lengthSq() > 40000) {
            this.moveVel = Vec2.scaled(Vec2.normalized(this.moveVel), 200);
          }
        } else {
          this.moveVel = new Vec2(0, 0);
        }
        this.moveTimer = 0;
        this.lastPos = b.clone();
        this.x = a.x;
        this.y = a.y;
        this.updateEnds();
      }
    }
    onConveyorEdge() {
      this.syncLastPos();
    }
  }
  Bouncer.i = true;
  Bouncer.s = MovingEntity;
  Object.assign(Bouncer.prototype, {
    l: Bouncer
  });
  class Spider extends Node {
    constructor() {
      super();
      this.sprite = new Sprite(null, Resources.mc, Keys.VH);
      this.sprite.setUniformScale(0.4);
      this.sprite.center();
      this.spinSpeed = this.fallVelY = this.winState = this.fallState = this.state = 0;
    }
    dispose() {
      super.dispose();
      this.sprite.free();
    }
    start() {
      let a = this;
      this.sprite.anim().play(v168).onComplete(function () {
        a.sprite.anim().play(v169);
        a.state = 1;
      });
    }
    startFall() {
      this.fallState = 1;
      this.y = this.sprite.getY();
      this.sprite.anim().stop();
      this.sprite.setFrame(Keys.WH);
      this.spinSpeed = X.randSigned(3);
      this.time = 0;
    }
    startWin() {
      this.winState = 1;
      this.y = this.sprite.getY();
      this.sprite.anim().stop();
      this.sprite.setFrame(Keys.XH);
      this.sprite.setRotation(0);
      this.time = 0;
    }
    update(a) {
      super.update(a);
      a = this.parent;
      switch (this.fallState) {
        case 1:
          var b = this.progress(0.5);
          this.sprite.setY(this.y - Easing.poly(100)(b) * 50);
          let c = this.sprite;
          c.setRotation(c.rotation + this.spinSpeed);
          if (b == 1) {
            this.fallState++;
            this.time = 0;
          }
          break;
        case 2:
          b = this.sprite;
          b.setY(b.getY() + this.fallVelY);
          b = this.sprite;
          b.setRotation(b.rotation + this.spinSpeed);
          this.fallVelY += 0.4;
          if (this.time > 1.5) {
            b = this.sprite;
            b.setAlpha(b.alpha * 0.9);
          }
          if (this.time > 2) {
            this.dispose();
          }
      }
      switch (this.winState) {
        case 1:
          b = this.progress(0.5);
          this.sprite.setY(this.y - Easing.poly(100)(b) * 50);
          a.mainCandy.x = this.sprite.getX();
          a.mainCandy.y = this.sprite.getY() - 15;
          a.mainCandy.draw();
          if (b == 1) {
            this.winState++;
            this.time = 0;
          }
          break;
        case 2:
          a = this.sprite;
          a.setY(a.getY() + this.fallVelY);
          this.fallVelY += 0.4;
          a = this.parent;
          a.mainCandy.x = this.sprite.getX();
          a.mainCandy.y = this.sprite.getY() - 15;
          a.mainCandy.draw();
          if (this.time > 1.5) {
            a = this.sprite;
            a.setAlpha(a.alpha * 0.9);
          }
          if (this.time > 2) {
            this.dispose();
          }
      }
    }
  }
  Spider.i = true;
  Spider.s = Node;
  Object.assign(Spider.prototype, {
    l: Spider
  });

  class BouncerFace extends Bouncer {
    constructor(a, b, c, d, e) {
      super(a.controller, b, c, d, e);
      this.switcher = a;
      this.alpha = 1;
      this.state = 0;
    }
    startEnter() {
      if (this.state != 1) {
        this.state = 1;
        this.time = 0;
      }
    }
    startExit() {
      if (this.state != -1) {
        this.state = -1;
        this.time = 0;
      }
    }
    isDying() {
      return this.state < 0;
    }
    buildAnimations() {
      function a(c, d) {
        c = new Sprite(d, Resources.de, Keys.indexed(Keys.Wp, c));
        c.center();
        return c;
      }
      this.innerContainer = new Container(null, this.container);
      this.innerContainer.moveToBottom();
      this.outerContainer = new Container(null, this.container);
      this.animators = [];
      if (BouncerFace.An == null) {
        BouncerFace.An = AnimTimeline.parse("0,s.27<x-34.<y7.33<,.35,s.22>x-35.>y6.33>,.7,s.16<x-36.<y5.33<,1.04,s.22>x-35.>y6.33>,1.4,s.27x-34.y7.33");
      }
      var b = new SpriteAnimator(a(2, this.innerContainer));
      b.loop(BouncerFace.An);
      this.animators.push(b);
      if (BouncerFace.zn == null) {
        BouncerFace.zn = AnimTimeline.parse("0,s.36<x32.9<y6.61<,.39,s.32>x31.9>y5.61>,.78,s.27<x30.9<y4.61<,1.17,s.32>x31.9>y5.61>,1.56,s.36x32.9y6.61");
      }
      b = new SpriteAnimator(a(2, this.innerContainer));
      b.loop(BouncerFace.zn);
      this.animators.push(b);
      if (BouncerFace.Xh == null) {
        BouncerFace.Xh = AnimTimeline.parse("0,s.44<x23<y26<,.45,s.4>x22>y25>,.9,s.36<x21<y24<,1.35,s.4>x22>y25>,1.8,s.44x23y26");
      }
      b = new SpriteAnimator(a(3, this.outerContainer));
      b.loop(BouncerFace.Xh);
      this.animators.push(b);
      if (BouncerFace.Wh == null) {
        BouncerFace.Wh = AnimTimeline.parse("0,s.44<x-23<y28<,.5,s.4>x-22>y27>,1,s.36<x-21<y26<,1.5,s.4>x-22>y27>,2,s.44x-23y28");
      }
      b = new SpriteAnimator(a(4, this.outerContainer));
      b.loop(BouncerFace.Wh);
      this.animators.push(b);
    }
    free() {
      this.container.free();
      this.sprite = this.container = null;
    }
    update(a) {
      super.update(a);
      if (this.state > 0) {
        this.time += a;
        let b = Math.min(1, this.time / 0.36);
        this.alpha = b;
        if (b == 1) {
          this.state = 0;
        }
      }
      if (this.state < 0) {
        this.time += a;
        a = Math.min(1, this.time / 0.16);
        this.alpha = 1 - a;
        if (a == 1) {
          this.state = 0;
          this.switcher.freeBouncerSlot();
        }
      }
    }
    draw() {
      super.draw();
      this.container.setAlpha(this.alpha);
    }
  }
  BouncerFace.i = true;
  BouncerFace.s = Bouncer;
  Object.assign(BouncerFace.prototype, {
    l: BouncerFace
  });
  class ToggleButton extends TouchableEntity {
    constructor(a, b, c) {
      super();
      this.x = b;
      this.y = c;
      this.sprite = new Sprite(null, Resources.Kb, Keys.Ky);
      this.sprite.setUniformScale(0.4);
      this.sprite.center();
      this.sprite.setX(b);
      this.sprite.setY(c);
      this.radius = 40;
      a.layer(5).appendChild(this.sprite.node);
      this.toggled = false;
    }
    containsPoint(a, b) {
      return PointInCircle.test(a, b, this.x, this.y, this.radius);
    }
    toggle() {
      this.toggled = !this.toggled;
      this.sprite.setFrame(this.toggled ? Keys.rH : Keys.Ky);
    }
    draw() {
      super.draw();
      this.sprite.setX(this.x);
      this.sprite.setY(this.y);
    }
  }
  ToggleButton.i = true;
  ToggleButton.s = TouchableEntity;
  Object.assign(ToggleButton.prototype, {
    l: ToggleButton
  });

  class LanternEye extends MovingEntity {
    constructor(a) {
      super();
      this.controller = a;
      this.active = false;
      this.eyeOpenTimer = this.eyeLoopDelay = this.teleportTimer = this.glowFadeDelay = 0;
      this.glowAnimator = null;
    }
    init(a, b) {
      LanternEye.teleporting = null;
      this.x = a;
      this.y = b;
      this.state = 0;
      if (v159 == null) {
        a = v159 = new AnimTimeline();
        a.setScale(0.5599999999999999, 0.4, 0, 100);
        a.alphaKey(0.7, 0);
        a.setScale(0.42000000000000004, 0.52, 0.5);
        a.alphaKey(1, 0.5);
      }
      this.container = new Container();
      this.controller.layer(5).appendChild(this.container.node);
      this.glowSprite = new Sprite(this.container, Resources.Ai, Keys.GH);
      this.glowSprite.center();
      this.glowSprite.setAlpha(0);
      this.glowAnimator = new SpriteAnimator(this.glowSprite);
      this.closedSprite = new Sprite(this.container, Resources.Ai, Keys.IH);
      this.closedSprite.center();
      this.closedSprite.setUniformScale(0.4);
      this.openSprite = new Sprite(this.container, Resources.Ai, Keys.HH);
      this.openSprite.center();
      this.openSprite.setUniformScale(0.4);
      this.openSprite.setAlpha(0);
      this.openSprite.setY(1);
      this.eyeSprite = new Sprite(this.container, Resources.Ai, [Keys.JH, Keys.KH, Keys.LH, Keys.MH, Keys.NH][Save.skin]);
      this.eyeSprite.center();
      this.eyeSprite.setUniformScale(0.4);
      this.eyeSprite.setAlpha(0);
      if (v160 == null) {
        a = v160 = new AnimTimeline();
        a.alphaKey(0, 0);
        a.alphaKey(1, 0.2);
        a.relScaleKey(0.4, 0.4, 0);
        a.relScaleKey(0.4, 0.32000000000000006, 0.07);
        a.relScaleKey(0.34, 0.42000000000000004, 0.05);
        a.relScaleKey(0.4, 0.4, 0.05);
        a.relPosKey(-4, 0);
        a.relPosKey(0, 0.1);
        a.relPosKey(-1, 0.05);
        a = v161 = new AnimTimeline();
        a.relScaleUniKey(0.4, 0.35, -100);
        a.relScaleUniKey(0.37200000000000005, 0.35, 100);
        a.relScaleUniKey(0.34800000000000003, 0.35, -100);
        a.relScaleUniKey(0.37200000000000005, 0.35, 100);
        a.relScaleUniKey(0.4, 0);
        a = v162 = new AnimTimeline();
        a.alphaKey(1, 0);
        a.alphaKey(0.6, 0.06);
        a.alphaKey(0, 0.1);
        a.setScale(0.4, 0.4, 0);
        a.setScale(0.45999999999999996, 0.32000000000000006, 0.06);
        a.setScale(0.4, 0.4, 0.1);
        a.posKey(0, 0, 0, 100);
        a.posKey(0, -4, 0.06, -100);
        a.posKey(0, 4, 0.1);
      }
      this.eyeAnimator = new SpriteAnimator(this.eyeSprite);
    }
    update(a) {
      this.prev = new Vec2(this.x, this.y);
      super.update(a);
      if (LanternEye.teleporting != null) {
        LanternEye.teleporting.g = new Vec2(this.x, this.y);
        LanternEye.teleporting.prev = new Vec2(this.x, this.y);
        if (this.state != 1) {
          this.state = 1;
        }
      }
      if (this.teleportTimer > 0) {
        this.teleportTimer -= a;
        if (this.teleportTimer < 0) {
          LanternEye.teleporting.pinned = false;
          LanternEye.teleporting.g = new Vec2(this.x, this.y);
          LanternEye.teleporting.prev = this.prev.clone();
          LanternEye.teleporting = null;
        }
      }
      if (this.glowFadeDelay > 0) {
        this.glowFadeDelay -= a;
        if (this.glowFadeDelay <= 0) {
          this.glowAnimator.loop(v159, true);
        }
      }
      if (this.eyeLoopDelay > 0) {
        this.eyeLoopDelay -= a;
        if (this.eyeLoopDelay <= 0) {
          this.eyeAnimator.loop(v161);
        }
      }
      if (this.eyeOpenTimer > 0) {
        this.eyeOpenTimer -= a;
        if (this.eyeOpenTimer <= 0) {
          this.state = 0;
        }
      }
    }
    draw() {
      super.draw();
      this.container.setX(this.x);
      this.container.setY(this.y);
    }
    tryClickAt(a, b) {
      if (this.state == 1 && Vec2.distance(a, b, this.x, this.y) < 35 && LanternEye.teleporting != null) {
        this.endTeleport();
        return true;
      } else {
        return false;
      }
    }
    startTeleport(a) {
      SoundFx.play(SoundFx.lantern_teleport_in);
      LanternEye.teleporting = a;
      a.pinned = true;
      a.g = a.prev = new Vec2(this.x, this.y);
      a = this.controller.lanterns;
      let b = 0;
      while (b < a.length) {
        let c = a[b];
        ++b;
        c.state = 1;
        c.closedSprite.tween().alpha(0, 0.3);
        c.openSprite.tween().alpha(1, 0.3);
        c.eyeAnimator.play(v160);
        c.glowSprite.setScaleX(0.5599999999999999);
        c.glowSprite.setScaleY(0.4);
        c.glowSprite.setAlpha(0.7);
        c.glowFadeDelay = Math.random() * 0.4;
        c.eyeLoopDelay = 0.2;
      }
    }
    endTeleport() {
      SoundFx.play(SoundFx.lantern_teleport_out);
      let a = this.controller.lanterns;
      let b = 0;
      while (b < a.length) {
        let c = a[b];
        ++b;
        c.closedSprite.tween().alpha(1, 0.3);
        c.openSprite.tween().alpha(0, 0.3);
        c.eyeAnimator.play(v162);
        c.glowAnimator.stop();
        c.glowSprite.setAlpha(0);
        c.eyeOpenTimer = 0.5;
        c.state = 0;
      }
      this.teleportTimer = 0.01;
    }
  }
  LanternEye.i = true;
  LanternEye.s = MovingEntity;
  Object.assign(LanternEye.prototype, {
    l: LanternEye
  });
  class SawBladeButton extends TouchableEntity {
    constructor(a, b, c, d) {
      super();
      this.x = b;
      this.y = c;
      this.variant = d;
      this.sprite = new Sprite(null, Resources.gl, this.pickFrame());
      this.sprite.setUniformScale(0.4);
      this.sprite.center();
      this.sprite.setX(b);
      this.sprite.setY(c);
      this.radius = 20;
      a.layer(5).appendChild(this.sprite.node);
    }
    setState(a) {
      super.setState(a);
      this.sprite.setFrame(this.pickFrame());
    }
    pickFrame() {
      if (this.state == 0) {
        if (this.variant == 1) {
          return Keys.KG;
        } else {
          return Keys.MG;
        }
      } else if (this.variant == 1) {
        return Keys.LG;
      } else {
        return Keys.NG;
      }
    }
    containsPoint(a, b) {
      return PointInCircle.test(a, b, this.x, this.y, this.radius);
    }
  }
  SawBladeButton.i = true;
  SawBladeButton.s = TouchableEntity;
  Object.assign(SawBladeButton.prototype, {
    l: SawBladeButton
  });
  class ConveyorBelt extends Entity {
    constructor(a) {
      super();
      this.controller = a;
      this.speed = 10;
      this.offset = 0;
      this.id = -1;
      this.paused = false;
      this.stepProgress = this.angle = this.deltaFrame = 0;
      this.dir = new Vec2(0, 0);
      this.active = false;
      this.activeId = -1;
      this.prev = new Vec2(0, 0);
      this.belt = null;
      this.items = new OrderedMap();
      this.order = [];
      this.node = new Container();
      a.layer(4).appendChild(this.node.node);
      this.container = new Container();
      this.node.appendChild(this.container);
    }
    update(a) {
      super.update(a);
      if (!this.paused) {
        this.deltaFrame = a * this.speed * 10;
        this.offset += this.deltaFrame;
        this.offset = this.wrap(this.offset, this.width);
      }
      this.active = Math.abs(this.deltaFrame) > 0.001;
      if (this.paused && this.active) {
        this.stepProgress += Math.abs(this.deltaFrame);
        if (this.stepProgress >= 15) {
          this.onStep();
          this.stepProgress = 0;
        }
      }
      this.updateAnim();
      let b = null;
      let c = null;
      var d = this.items;
      for (var e = d.keys(); e.hasNext();) {
        var f = e.next();
        var g = d.get(f);
        if (g.removed) {
          continue;
        }
        let A = g.offset + this.deltaFrame;
        let D = true;
        if (A >= this.width) {
          A -= this.width;
        } else if (A <= 0) {
          A += this.width;
        } else {
          D = false;
        }
        var h = f.collisionSize();
        var m = f.position();
        var n = new Vec2(h.x * this.dir.x, h.y * this.dir.y).length() / 2;
        var q = 1;
        var p = A;
        if (A < n) {
          q = 0.5 + A * 0.5 / n;
          b = f;
          p = n * q;
        } else if (this.width - A < n) {
          q = 0.5 + (this.width - A) * 0.5 / n;
          c = f;
          p = this.width - n * q;
        }
        n = this.items;
        let B = n.keys();
        while (B.hasNext()) {
          var v = B.next();
          var u = n.get(v);
          if (v != f && !u.removed && q == 1) {
            u = u.offset - g.offset;
            if (Vec2.sum(h, v.collisionSize()).lengthSq() * 0.25 > u * u) {
              if (Math.abs(u) < 0.001) {
                v = this.order.indexOf(v) - this.order.indexOf(v);
                u = (v > 0 ? 1 : v < 0 ? -1 : 0) * 600;
              } else if (Math.abs(u) < 600) {
                u = (u > 0 ? 1 : u < 0 ? -1 : 0) * 600;
              }
              A -= u * a;
            }
          }
        }
        f.setScale(new Vec2(q, q));
        h = new Vec2(this.x + this.dir.x * p - m.x, this.y + this.dir.y * p - m.y);
        if (g.needsSnap) {
          p = new Vec2(this.dir.y, -this.dir.x);
          m = Vec2.dot(h, p) / this.dir.length();
          p = new Vec2(p.x * m, p.y * m);
          m = a * 800;
          if (p.lengthSq() >= m * m) {
            q = p.length();
            p.multiply((q - m) / q);
          } else {
            g.needsSnap = false;
          }
          h.sub(p);
          f.setPosition(Vec2.sum(f.position(), h));
        } else {
          f.setPosition(Vec2.sum(new Vec2(this.x, this.y), Vec2.scaled(this.dir, p)));
        }
        g.offsetTemp = A;
        if (D) {
          f.onConveyorEdge();
          SoundFx.play(SoundFx.transporter_drop);
        }
      }
      this.belt.move(this.deltaFrame);
      for (d = this.items.iterator(); d.hasNext();) {
        e = d.next();
        e.offset = this.wrap(e.offsetTemp, this.width);
      }
      if (this.paused) {
        this.deltaFrame = 0;
      }
      if (this.activeId == -1) {
        if (b != null && c != null) {
          d = this.items;
          e = d.keys();
          while (e.hasNext()) {
            f = e.next();
            g = d.get(f);
            if (!g.removed) {
              if (f == b) {
                g.offset += a * 1500;
              }
              if (f == c) {
                g.offset -= a * 1500;
              }
            }
          }
        } else if (b != null) {
          this.deltaFrame = a * 1500;
        } else if (c != null) {
          this.deltaFrame = a * -1500;
        }
      }
    }
    draw() {
      this.container.setX(this.x);
      this.container.setY(this.y);
      this.container.setPivot(0, this.height / 2);
      this.container.setOrigin(0, this.height / 2);
      this.container.setRotation(this.rotation);
      this.belt.draw();
    }
    onTouchPress(a, b, c) {
      let d = false;
      if (!this.paused) {
        return false;
      }
      a = this.worldToLocal(new Vec2(a, b));
      if (a.x >= 0 && a.x <= this.width && -this.height * 0.5 <= a.y && a.y <= this.height * 0.5) {
        this.activeId = c;
        this.prev.copyFrom(a);
        d = true;
      }
      return d;
    }
    onTouchRelease(a, b, c) {
      a = false;
      if (!this.paused) {
        return false;
      }
      if (this.activeId == c) {
        this.activeId = -1;
        this.deltaFrame = 0;
        for (c = this.items.keys(); c.hasNext();) {
          a = c.next();
          if (this.items.map[a.jf].removed) {
            this.items.remove(a);
          }
        }
        a = true;
      }
      return a;
    }
    onTouchMove(a, b, c) {
      let d = false;
      if (this.controller.jr != -1 || !Application.instance.pointer().moved(0) || !this.paused) {
        return false;
      }
      if (this.activeId == c) {
        a = this.worldToLocal(new Vec2(a, b));
        this.deltaFrame = a.x - this.prev.x;
        this.offset += this.deltaFrame;
        this.offset = this.wrap(this.offset, this.width);
        this.prev.copyFrom(a);
        d = true;
      }
      return d;
    }
    contains(a) {
      a = this.worldToLocal(a);
      if (a.x >= 0 && a.x <= this.width && -this.height * 0.5 <= a.y) {
        return a.y <= this.height * 0.5;
      } else {
        return false;
      }
    }
    worldToLocal(a) {
      var b = this.angle - Math.PI * 0.5;
      let c = new Vec2(this.dir.x, this.dir.y);
      b = new Vec2(Math.cos(b), Math.sin(b));
      return new Vec2(c.x * (a.x - this.x) + c.y * (a.y - this.y), b.x * (a.x - this.x) + b.y * (a.y - this.y));
    }
    containsPoint(a, b) {
      a = this.worldToLocal(a);
      return !(a.x < -b) && !(a.x > this.width + b) && !(a.y < -this.height * 0.5 - b) && !(a.y > this.height * 0.5 + b);
    }
    bind(a) {
      this.bindItem(a);
    }
    markRemoved(a) {
      let b = this.items;
      let c = b.keys();
      while (c.hasNext()) {
        let d = c.next();
        let e = b.get(d);
        if (d == a) {
          e.removed = true;
          d.setOwner(-1);
          break;
        }
      }
      a.setOwner(-1);
    }
    has(a) {
      return this.items.map.Wk[a.jf] != null;
    }
    remove(a) {
      this.items.remove(a);
    }
    isRemoved(a) {
      a = this.items.map[a.jf];
      if (a != null) {
        return a.removed;
      } else {
        return false;
      }
    }
    isActive() {
      return this.active;
    }
    wrap(a, b) {
      let c = b - 0;
      if (a > b) {
        a -= c;
      }
      if (a < 0) {
        a += c;
      }
      return a;
    }
    bindItem(a) {
      var b = a.position();
      b = new Vec2(b.x - this.x, b.y - this.y);
      this.items.set(a, new ConveyorItem(Math.max(Math.min(b.x * this.dir.x + b.y * this.dir.y, this.width), 0)));
      this.order.push(a);
      a.setOwner(this.id);
    }
    setupBelt(a, b, c, d, e, f, g, h) {
      this.activeId = -1;
      this.id = a;
      this.x = b;
      this.y = c;
      this.width = d;
      this.height = e;
      this.rotation = f;
      this.paused = g;
      this.angle = f * DEG2RAD;
      this.dir = new Vec2(Math.cos(this.angle), Math.sin(this.angle));
      this.speed = h;
      this.node = new Container();
      a = new Sprite(this.container, Resources.Rc, DIGIT_FRAME_2);
      a.setScaleX(d / a.size.x);
      a.setScaleY((e - 10) / a.getHeight());
      a = new Sprite(this.container, Resources.Rc, DIGIT_FRAME_0);
      a.setScaleX(0.4);
      a.setScaleY((e - 10) / a.getHeight());
      a.setX(-6);
      a.setY(5);
      a = new Sprite(this.container, Resources.Rc, DIGIT_FRAME_0);
      a.setScaleX(0.4);
      a.setScaleY((e - 10) / a.getHeight());
      a.setX(d - a.getWidth() + 6);
      a.setY(5);
      a = new Sprite(this.container, Resources.Rc, DIGIT_FRAME_3);
      a.setScaleX(d / a.getWidth());
      a.setScaleY(-0.4);
      a.setY(a.getHeight());
      a = new Sprite(this.container, Resources.Rc, DIGIT_FRAME_3);
      a.setScaleX(d / a.getWidth());
      a.setScaleY(0.4);
      a.setY(e - a.getHeight());
      a = new Sprite(this.container, Resources.Rc, DIGIT_FRAME_1);
      a.setUniformScale(0.4);
      a.setX(-6);
      a.setY(e - a.getHeight());
      a = new Sprite(this.container, Resources.Rc, DIGIT_FRAME_1);
      a.setScaleX(0.4);
      a.setScaleY(-0.4);
      a.setX(-6);
      a.setY(a.getHeight());
      a = new Sprite(this.container, Resources.Rc, DIGIT_FRAME_1);
      a.setUniformScale(-0.4);
      a.setX(d + 6);
      a.setY(a.getHeight());
      a = new Sprite(this.container, Resources.Rc, DIGIT_FRAME_1);
      a.setScaleX(-0.4);
      a.setScaleY(0.4);
      a.setX(d + 6);
      a.setY(e - a.getHeight());
      a = 0;
      if (!g) {
        a = h > 0 ? 1 : -1;
      }
      this.belt = new Transporter(d - 2, e - 10, a);
      this.belt.container.setY(5);
      this.container.appendChild(this.belt.container);
      g = new Sprite(this.container, Resources.Rc, DIGIT_FRAME_7);
      g.setScaleX(0.4);
      g.setScaleY((e - 10) / g.size.y);
      g.setY(5);
      g = new Sprite(this.container, Resources.Rc, DIGIT_FRAME_7);
      g.setScaleX(-0.4);
      g.setScaleY((e - 10) / g.size.y);
      g.setX(d);
      g.setY(5);
    }
    cleanupRemoved() {
      let a = [];
      var b = this.items;
      for (var c = b.keys(); c.hasNext();) {
        let d = c.next();
        if (b.get(d).removed && !this.contains(d.position())) {
          a.push(d);
        }
      }
      for (b = 0; b < a.length;) {
        c = a[b];
        ++b;
        this.items.remove(c);
        Std.remove(this.order, c);
      }
    }
    playBeltSfx() {
      SoundFx.play([1057, 1056, 1055, 1054][X.randInt(0, 3)]);
    }
    static create(a, b, c, d, e, f, g, h, m) {
      a = new ConveyorBelt(a);
      a.setupBelt(b, c, d, e, f, g, h, m);
      return a;
    }
  }
  ConveyorBelt.i = true;
  ConveyorBelt.s = Entity;
  Object.assign(ConveyorBelt.prototype, {
    l: ConveyorBelt
  });

  class SteamPuff {
    constructor(a, b, c) {
      this.state = 0;
      this.time = a;
      this.frameAnim = b;
      this.loopAnim = c;
      this.sprite = new Sprite(null, Resources.Kk);
      this.sprite.setVisible(false);
      this.animator = new SpriteAnimator(this.sprite);
    }
    startFadeOut() {
      if (this.state != 2) {
        this.state = 2;
      }
    }
    update(a) {
      switch (this.state) {
        case 0:
          this.time -= a;
          if (this.time > 0) {
            break;
          }
          this.sprite.setFrame(this.frameAnim.data[0]);
          this.sprite.anim().play(this.frameAnim);
          this.sprite.setVisible(true);
          this.sprite.center();
          this.animator.loop(this.loopAnim);
          this.state = 1;
          this.time = 0;
          break;
        case 1:
          this.time += a;
          if (this.time >= 0.6) {
            this.sprite.anim().stop();
            this.animator.stop();
            this.time = this.state = 0;
          }
          break;
        case 2:
          a = this.sprite;
          a.setAlpha(a.alpha * 0.95);
          if (this.sprite.alpha < 0.05) {
            this.sprite.free();
            this.animator.dispose();
            this.sprite = this.loopAnim = this.frameAnim = null;
            this.state = 3;
          }
      }
    }
  }
  SteamPuff.i = true;
  Object.assign(SteamPuff.prototype, {
    l: SteamPuff
  });
  class ConveyorItem {
    constructor(a) {
      this.removed = false;
      this.needsSnap = true;
      this.offsetTemp = this.offset = a;
      this.index = ConveyorItem.NEXT_INDEX++;
    }
  }
  ConveyorItem.i = true;
  Object.assign(ConveyorItem.prototype, {
    l: ConveyorItem
  });

  class ConveyorBeltMgr {
    constructor(a) {
      this.touchPoints = new HashMap();
      this.needsReorder = false;
      this.list = [];
      this.controller = a;
    }
    count() {
      return this.list.length;
    }
    bind(a) {
      let b = 0;
      let c = this.list;
      while (b < c.length) {
        let d = c[b];
        ++b;
        if (d.contains(new Vec2(a.x, a.y))) {
          d.bind(a);
        }
      }
    }
    push(a) {
      this.list.push(a);
    }
    iterator() {
      return new ArrayIter(this.list);
    }
    bindAll(a) {
      let b = 0;
      while (b < a.length) {
        this.bind(a[b++]);
      }
    }
    checkItem(a) {
      var b = null;
      let c = [];
      for (var d = this.iterator(); d.hasNext();) {
        var e = d.next();
        if (e.containsPoint(a.position(), a.scoreValue())) {
          c.push(e);
        }
        if (e.has(a)) {
          b = e;
        }
      }
      if (b != null && b.ze) {
        for (d = 0; d < c.length;) {
          e = c[d];
          ++d;
          if (e.ze && e.isActive()) {
            this.assignItemToBelt(e, a);
            return;
          }
        }
        if (b.ze) {
          for (b = 0; b < c.length;) {
            d = c[b];
            ++b;
            if (!d.ze) {
              this.assignItemToBelt(d, a);
            }
          }
        }
      }
    }
    checkAll(a) {
      let b = 0;
      while (b < a.length) {
        this.checkItem(a[b++]);
      }
    }
    remove(a) {
      let b = 0;
      let c = this.list;
      while (b < c.length) {
        c[b++].remove(a);
      }
    }
    reorderActive() {
      var a = this.count() - 1;
      let b = a;
      while (a >= 0) {
        if (this.list[a].ze && this.list[a].isActive()) {
          let c = a;
          while (c < b) {
            this.swap(c, c + 1);
            ++c;
          }
          --b;
        }
        --a;
      }
      this.reorderPaused();
    }
    update(a) {
      let b = 0;
      let c = this.list;
      while (b < c.length) {
        c[b++].update(a);
      }
      if (this.needsReorder) {
        this.reorderActive();
        this.needsReorder = false;
      }
    }
    markReorder() {
      this.needsReorder = true;
    }
    onTouchPress(a, b, c) {
      let d = this.count() - 1;
      while (d >= 0) {
        let e = this.list[d];
        if (e != null && e.onTouchPress(a, b, c)) {
          this.touchPoints.map[c] = new Vec2(a, b);
          return true;
        }
        --d;
      }
      return false;
    }
    onTouchRelease(a, b, c) {
      let d = this.count() - 1;
      while (d >= 0) {
        let e = this.list[d];
        if (e != null && e.onTouchRelease(a, b, c)) {
          this.touchPoints.remove(c);
          return true;
        }
        --d;
      }
      return false;
    }
    onTouchMove(a, b, c) {
      var d = this.touchPoints.map[c];
      if (d != null) {
        var e = Vec2.diff(new Vec2(a, b), d);
        if (e.lengthSq() < 4) {
          return false;
        }
        e = Vec2.normalized(e);
        let f = -1;
        let g = null;
        let h = 0;
        let m = this.list;
        while (h < m.length) {
          let n = m[h];
          ++h;
          if (n.contains(d)) {
            let q = Math.abs(Vec2.dot(e, n.dir));
            if (q >= f) {
              f = q;
              g = n;
            }
          }
        }
        if (g != null) {
          g.onTouchPress(d.x, d.y, c);
        }
        this.touchPoints.remove(c);
      }
      for (d = this.count() - 1; d >= 0;) {
        if (this.list[d].onTouchMove(a, b, c)) {
          this.markReorder();
          return true;
        }
        --d;
      }
      return false;
    }
    assignItemToBelt(a, b) {
      if (!a.has(b) || a.isRemoved(b)) {
        for (var c = 0, d = this.list; c < d.length;) {
          let e = d[c];
          ++c;
          if (e.has(b)) {
            e.markRemoved(b);
          }
        }
        a.bind(b);
        SoundFx.play(SoundFx.transporter_move);
      }
    }
    reorderPaused() {
      var a = this.count() - 1;
      let b = a;
      while (a >= 0) {
        if (!this.list[a].ze) {
          let c = a;
          while (c < b) {
            this.swap(c, c + 1);
            ++c;
          }
          --b;
        }
        --a;
      }
    }
    swap(a, b) {
      let c = this.list[a];
      this.list[a] = this.list[b];
      this.list[b] = c;
      this.controller.layer(4).swapSiblingsAt(a, b);
    }
  }
  ConveyorBeltMgr.i = true;
  Object.assign(ConveyorBeltMgr.prototype, {
    l: ConveyorBeltMgr
  });
