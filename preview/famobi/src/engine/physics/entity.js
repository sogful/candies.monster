  class GameObject {
    constructor() {
      this.alpha = 1;
      this.rotation = 0;
      this.scaleX = this.scaleY = 1;
      this.x = this.y = 0;
    }
    update() {}
    draw() {}
  }
  GameObject.i = true;
  Object.assign(GameObject.prototype, {
    l: GameObject
  });
  class Entity {
    constructor() {
      this.visualScale = 1;
      this.x = this.y = this.rotation = 0;
      this.visible = true;
      this.bounds = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
    }
    updateBounds() {
      this.bounds.left = this.x + this.localBounds.left;
      this.bounds.top = this.y + this.localBounds.top;
      this.bounds.right = this.x + this.localBounds.right;
      this.bounds.bottom = this.y + this.localBounds.bottom;
    }
    draw() {}
    setMotion(a) {
      this.motion = a;
    }
    update(a) {
      if (this.motion != null) {
        this.motion.update(a);
        this.x = this.motion.g.x;
        this.y = this.motion.g.y;
        this.rotation = this.motion.angle;
      }
    }
    boundsContainsPoint(a, b) {
      let c = this.bounds;
      let d = this.bounds;
      return Rect.pointInside(a, b, this.bounds.left, this.bounds.top, c.right - c.left, d.bottom - d.top);
    }
    boundsOverlapsRect(a, b, c, d) {
      let e = this.bounds.left;
      let f = this.bounds.top;
      let g = this.localBounds;
      let h = this.localBounds;
      return Rect.overlapAABB(a, b, c, d, e, f, e + (g.right - g.left), f + (h.bottom - h.top));
    }
    static boundsOverlap(a, b) {
      return AABBTest.test(a.bounds, b.bounds);
    }
  }
  Entity.i = true;
  Object.assign(Entity.prototype, {
    l: Entity
  });
  class AnchoredEntity extends Entity {
    constructor() {
      super();
      this.constraint = null;
      this.spinVel = 0;
      this.skipSpin = false;
      this.litBy = null;
      this.bouncePower = 0;
      this.bubbleAnim = null;
    }
  }
  AnchoredEntity.i = true;
  AnchoredEntity.s = Entity;
  Object.assign(AnchoredEntity.prototype, {
    l: AnchoredEntity
  });
  // ParticleEmitter - classic 2d particle system (Cocos2d style).
  // `capacity` caps live particle count; `particles` holds active
  // ParticleData. emission rate is `emitRate` (particles/sec), with
  // `emitAccum` carrying fractional spawn budget between frames.
  // `duration` of -1 means infinite; otherwise the emitter auto-stops
  // and calls `onDone(this)` once particles drain. per-particle
  // variance pairs: angle/angleVar, speed/speedVar, life/lifeVar,
  // size/sizeVar, radialAccel/radialAccelVar, tangentialAccel/
  // tangentialAccelVar, angularVel/angularVelVar (subclasses use),
  // colorStart/colorStartVar -> colorEnd/colorEndVar. outPoints +
  // outColors are write-only buffers populated each frame by
  // writeOutput() for the renderer to consume.
  class ParticleEmitter extends GameObject {
    constructor(a) {
      super();
      this.y = this.x = 0;
      this.scaleY = this.scaleX = 1;
      this.rotation = 0;
      this.outPoints = [];
      this.outColors = [];
      this.capacity = a;
      this.particles = [];
      this.active = false;
      this.elapsed = this.duration = 0;
      this.gravity = new Vec2(0, 0);
      this.posVar = new Vec2(0, 0);
      this.lifeVar = this.life = this.sizeVar = this.size = this.radialAccelVar = this.radialAccel = this.tangentialAccelVar = this.tangentialAccel = this.speedVar = this.speed = this.angleVar = this.angle = 0;
      this.colorStart = new RGBA(0, 0, 0, 0);
      this.colorStartVar = new RGBA(0, 0, 0, 0);
      this.colorEnd = new RGBA(0, 0, 0, 0);
      this.colorEndVar = new RGBA(0, 0, 0, 0);
      this.angularVelVar = this.angularVel = this.emitAccum = this.emitRate = 0;
      this.outPoints = [];
      this.outColors = [];
      this.idx = 0;
      this.onDone = null;
    }
    spawn() {
      if (this.particles.length != this.capacity) {
        var a = new ParticleData();
        this.initParticle(a);
        this.particles.push(a);
      }
    }
    initParticle(a) {
      a.g.x = this.x + this.posVar.x * X.randCentered();
      a.g.y = this.y + this.posVar.y * X.randCentered();
      a.prev.copyFrom(a.g);
      var b = (this.angle + this.angleVar * X.randCentered()) * DEG2RAD;
      b = new Vec2(Math.cos(b), Math.sin(b));
      b.multiply(this.speed + this.speedVar * X.randCentered());
      a.dir = b;
      a.radialAccel = this.radialAccel + this.radialAccelVar * X.randCentered();
      a.tangentialAccel = this.tangentialAccel + this.tangentialAccelVar * X.randCentered();
      a.lifeStart = a.life = this.life + this.lifeVar * X.randCentered();
      b = new RGBA(this.colorStart.r + this.colorStartVar.r * X.randCentered(), this.colorStart.g + this.colorStartVar.g * X.randCentered(), this.colorStart.b + this.colorStartVar.b * X.randCentered(), this.colorStart.a + this.colorStartVar.a * X.randCentered());
      let c = new RGBA(this.colorEnd.r + this.colorEndVar.r * X.randCentered(), this.colorEnd.g + this.colorEndVar.g * X.randCentered(), this.colorEnd.b + this.colorEndVar.b * X.randCentered(), this.colorEnd.a + this.colorEndVar.a * X.randCentered());
      a.color = b;
      a.colorRate.r = (c.r - b.r) / a.life;
      a.colorRate.g = (c.g - b.g) / a.life;
      a.colorRate.b = (c.b - b.b) / a.life;
      a.colorRate.a = (c.a - b.a) / a.life;
      a.size = this.size + this.sizeVar * X.randCentered();
    }
    update(a) {
      super.update(a);
      if (this.onDone == null || this.particles.length != 0 || this.active) {
        if (this.active && this.emitRate != 0) {
          var b = 1 / this.emitRate;
          for (this.emitAccum += a; this.particles.length < this.capacity && this.emitAccum > b;) {
            this.spawn();
            this.emitAccum -= b;
          }
          this.elapsed += a;
          if (this.duration != -1 && this.duration < this.elapsed) {
            this.stop();
          }
        }
        for (this.idx = 0; this.idx < this.particles.length;) {
          b = this.particles[this.idx];
          if (b.life > 0) {
            this.integrate(b, a);
            b.color.r += b.colorRate.r * a;
            b.color.g += b.colorRate.g * a;
            b.color.b += b.colorRate.b * a;
            b.color.a += b.colorRate.a * a;
            b.life -= a;
            this.writeOutput(b, this.idx, a);
            this.idx++;
          } else {
            this.removeAt(this.idx);
          }
        }
      } else {
        this.onDone(this);
      }
    }
    integrate(a, b) {
      if (a.g.x != 0 || a.g.y != 0) {
        var c = a.g.clone();
        c.normalize();
      } else {
        c = new Vec2(0, 0);
      }
      let d = c.clone();
      c.multiply(a.radialAccel);
      let e = d.x;
      d.x = -d.y;
      d.y = e;
      d.multiply(a.tangentialAccel);
      c = Vec2.sum(c, d);
      c.add(this.gravity);
      c.multiply(b);
      a.dir.add(c);
      c.copyFrom(a.dir);
      c.multiply(b);
      a.g.add(c);
    }
    writeOutput(a) {
      this.outPoints[this.idx] = new PointWithSize(a.g.x, a.g.y, a.size);
      this.outColors[this.idx] = a.color;
    }
    removeAt(a) {
      this.particles.splice(a, 1);
    }
    start(a) {
      if (this.particles.length > 0) {
        while (this.particles.length > 0) {
          this.removeAt(0);
        }
      }
      this.particles = [];
      let b = 0;
      while (b < a) {
        ++b;
        this.spawn();
      }
      this.active = true;
    }
    stop() {
      this.active = false;
      this.elapsed = this.duration;
      this.emitAccum = 0;
    }
    draw() {}
  }
  ParticleEmitter.i = true;
  ParticleEmitter.s = GameObject;
  Object.assign(ParticleEmitter.prototype, {
    l: ParticleEmitter
  });
  class AnimatedNineSlice extends GameObject {
    constructor(a, b, c, d, e) {
      super();
      this.container = new Container();
      a.layer(0).appendChild(this.container.node);
      this.container.setBlendMode(3);
      this.container.setVisible(false);
      this.frames = [];
      a = [];
      for (var f = 0; f < d;) {
        ++f;
        a.push(0);
      }
      this.phases = a;
      for (a = 0; a < d;) {
        f = a++;
        let g = this.buildFrame(b, c);
        this.container.appendChild(g);
        this.frames.push(g);
        this.phases[f] = 1 / d * f;
      }
      this.delay = 0.3;
      this.outward = e;
    }
    free() {
      this.container.free();
      this.container = null;
    }
    buildFrame(a, b) {
      let c = new Container();
      let d = a / 2;
      let e = b / 2;
      var f = new Sprite(c, Resources.Kd, Keys.eI);
      f.setUniformScale(0.25);
      var g = new Sprite(c, Resources.Kd, Keys.fI);
      g.setUniformScale(0.25);
      g.setX(a - g.getWidth());
      var h = new Sprite(c, Resources.Kd, Keys.dI);
      h.setUniformScale(0.25);
      h.setX(a - h.getWidth());
      h.setY(b - h.getHeight());
      h = new Sprite(c, Resources.Kd, Keys.cI);
      h.setUniformScale(0.25);
      h.setY(b - h.getHeight());
      let m = new Sprite(c, Resources.Kd, Keys.Ny);
      m.setX(f.getX() + f.getWidth());
      m.setScaleX((g.getX() - f.getWidth()) / m.size.x);
      m.setScaleY(0.25);
      g = new Sprite(c, Resources.Kd, Keys.Ny);
      g.setScaleX(m.scaleX);
      g.setScaleY(0.25);
      g.setX(f.getX() + f.getWidth());
      g.setY(b - g.getHeight());
      b = new Sprite(c, Resources.Kd, Keys.Oy);
      b.setY(f.getHeight());
      b.setScaleX(0.25);
      b.setScaleY((h.getY() - f.getHeight()) / b.size.y);
      f = new Sprite(c, Resources.Kd, Keys.Oy);
      f.setScaleX(0.25);
      f.setScaleY(b.scaleY);
      f.setX(a - f.getWidth());
      f.setY(b.getY());
      for (a = 0; a < 8;) {
        f = a++;
        b = c.childAt(f);
        b.setX(b.getX() - d);
        f = c.childAt(f);
        f.setY(f.getY() - e);
      }
      c.setX(d);
      c.setY(e);
      return c;
    }
    update(a) {
      this.delay -= a;
      if (!(this.delay > 0) && this.container != null) {
        super.update(a);
        this.container.setVisible(true);
        for (var b = 0, c = this.frames.length; b < c;) {
          var d = b++;
          this.phases[d] += a;
          if (this.phases[d] > 1) {
            this.phases[d] -= this.phases[d];
          }
          let e = this.frames[d];
          d = this.phases[d];
          e.setAlpha(remap(d, 0, 1, 1, 0));
          e.setUniformScale(remap(d, 0, 1, 0.89, 1.1));
          if (this.outward) {
            e.setUniformScale(remap(d, 0, 1, 0.89, 1.1));
          } else {
            e.setUniformScale(remap(d, 0, 1, 1.1, 0.89));
          }
        }
      }
    }
  }
  AnimatedNineSlice.i = true;
  AnimatedNineSlice.s = GameObject;
  Object.assign(AnimatedNineSlice.prototype, {
    l: AnimatedNineSlice
  });

  class TouchableEntity extends Entity {
    constructor() {
      super();
      new Rect(-1, -1, -1, -1);
      this.clickData = this.state = 0;
    }
    setState(a) {
      this.state = a;
    }
    tryPressDown(a, b) {
      if (this.state == 0 && this.containsPoint(a, b)) {
        this.setState(1);
        return true;
      } else {
        return false;
      }
    }
    tryReleaseUp(a, b) {
      if (this.state == 1 && (this.setState(0), this.containsPoint(a, b))) {
        if (this.onClick != null) {
          this.onClick(this.clickData);
        }
        return true;
      } else {
        return false;
      }
    }
    containsPoint(a, b) {
      return PointInCircle.test(a, b, this.x, this.y, 20);
    }
  }
  TouchableEntity.i = true;
  TouchableEntity.s = Entity;
  Object.assign(TouchableEntity.prototype, {
    l: TouchableEntity
  });
  class GameItemSwitcher extends Entity {
    constructor(a) {
      super();
      this.controller = a;
      this.fadingIn = this.fadingOut = false;
      this.fadeInProgress = this.fadeOutProgress = 0;
    }
    init(a, b, c, d, e, f, g) {
      this.bouncerVariant = d;
      this.candyRadius = c;
      this.availableSlotsMask = b | 1;
      this.currentSlot = 1;
      this.beesList = e;
      this.candyList = f;
      this.bouncerList = g;
      this.x = a.x;
      this.y = a.y;
      this.time = X.next();
      this.ghostContainer = new Container();
      this.ghostContainer.setX(this.x);
      this.ghostContainer.setY(this.y);
      this.controller.layer(5).appendChild(this.ghostContainer.node);
      this.puff = new PollenEmitter(this.controller, 7);
      this.puff.x = this.x;
      this.puff.y = this.y;
      this.ghostBody = new Sprite(this.ghostContainer, Resources.de, Keys.pH);
      this.ghostBody.setUniformScale(0.4);
      this.ghostBody.center();
      this.ghostFace = new Sprite(this.ghostContainer, Resources.de, Keys.qH);
      this.ghostFace.center();
      this.ghostFace.setUniformScale(0.4);
      this.bouncer = this.candy = this.bee = null;
      this.canSwitch = true;
    }
    update(a) {
      super.update(a);
      if (this.fadingOut) {
        this.fadeOutProgress += a;
        var b = Math.min(1, this.fadeOutProgress / 0.16);
        this.ghostContainer.setAlpha(1 - b);
        if (b == 1) {
          this.ghostContainer.setVisible(false);
          this.fadingOut = false;
        }
      }
      if (this.fadingIn) {
        this.fadeInProgress += a;
        b = Math.min(1, this.fadeInProgress / 0.36);
        this.ghostContainer.setAlpha(b);
        if (b == 1) {
          this.fadingIn = false;
        }
      }
      this.time += a;
      this.ghostBody.setY(remap(Math.sin(this.time * 5), -1, 1, 0, -5));
      this.ghostFace.setY(remap(Math.sin(this.time * 5 + 0.05), -1, 1, 0, -3));
      if (this.candy != null && this.candy.rope != null && this.candy.rope.breakIndex != -1 && !this.candy.isDying()) {
        this.canSwitch = true;
        this.setSlot(1);
      }
      this.puff.update(a);
    }
    draw() {
      super.draw();
      this.puff.draw();
      this.ghostContainer.setX(this.x);
      this.ghostContainer.setX(this.x);
    }
    setSlot(a) {
      if ((a & this.availableSlotsMask) != 0) {
        if (this.currentSlot == 1) {
          this.fadingOut = true;
          this.fadeOutProgress = 0;
        }
        this.currentSlot = a;
        if (this.bee != null) {
          if (this.bee.isDying()) {
            this.freeBeeSlot();
          } else {
            this.bee.startExit();
            this.bee.popped = true;
          }
        }
        if (this.candy != null) {
          a = this.candy.rope;
          if (a != null) {
            a.breakDelay = 0.36;
          }
          if (this.candy.isDying()) {
            this.freeCandySlot();
          } else {
            this.candy.startExit();
          }
        }
        if (this.bouncer != null) {
          if (this.bouncer.isDying()) {
            this.freeBouncerSlot();
          } else {
            this.bouncer.startExit();
          }
        }
        switch (this.currentSlot) {
          case 1:
            this.fadingIn = true;
            this.fadingOut = false;
            this.ghostContainer.setVisible(true);
            this.fadeInProgress = 0;
            break;
          case 2:
            this.bee = new Bee(this);
            this.bee.x = this.x;
            this.bee.y = this.y;
            this.bee.startEnter();
            this.beesList.push(this.bee);
            break;
          case 4:
            this.candy = new CandyVariant(this);
            this.candy.x = this.x;
            this.candy.y = this.y;
            this.candy.Zf = false;
            this.candy.spider = null;
            this.candy.setRadius(this.candyRadius);
            this.candy.startEnter();
            this.candy.buildAnimations();
            this.candyList.push(this.candy);
            break;
          case 8:
            this.bouncer = new BouncerFace(this, this.x, this.y, 1, this.bouncerVariant);
            this.bouncer.buildAnimations();
            this.bouncer.startEnter();
            this.bouncerList.push(this.bouncer);
        }
        this.puff.start(7);
        SoundFx.play(SoundFx.ghost_puff);
      }
    }
    cycleSlot() {
      let a = this.currentSlot;
      do {
        a <<= 1;
        if (a == 32) {
          a = 2;
        }
      } while ((a & this.availableSlotsMask) == 0);
      this.setSlot(a);
    }
    tryPressDown(a, b) {
      a -= this.x;
      b -= this.y;
      if (this.canSwitch && Math.sqrt(a * a + b * b) < 40) {
        this.cycleSlot();
        return true;
      } else {
        return false;
      }
    }
    freeBeeSlot() {
      if (this.bee != null) {
        Std.remove(this.beesList, this.bee);
        this.bee.free();
        this.bee = null;
      }
    }
    freeCandySlot() {
      if (this.candy != null) {
        this.candy.free();
        Std.remove(this.candyList, this.candy);
        this.candy = null;
      }
    }
    freeBouncerSlot() {
      if (this.bouncer != null) {
        Std.remove(this.bouncerList, this.bouncer);
        this.bouncer.free();
        this.bouncer = null;
      }
    }
  }
  GameItemSwitcher.i = true;
  GameItemSwitcher.s = Entity;
  Object.assign(GameItemSwitcher.prototype, {
    l: GameItemSwitcher
  });

  class WorldScale {}
  WorldScale.i = true;
