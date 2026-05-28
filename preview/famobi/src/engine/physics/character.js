  class MovingEntity extends Entity {
    constructor() {
      super();
      this.ownerId = -1;
    }
    setOwner(a) {
      this.ownerId = a;
    }
    isOwned() {
      return this.ownerId != -1;
    }
    position() {
      return new Vec2(this.x, this.y);
    }
    setPosition(a) {
      this.x = a.x;
      this.y = a.y;
    }
    collisionSize() {
      return null;
    }
    scoreValue() {
      let a = this.collisionSize();
      return (a.x + a.y) / 4;
    }
    setScale(a) {
      this.visualScale = a.x;
    }
    onConveyorEdge() {}
    applyMotion(a) {
      this.rotation = a.angle ?? 0;
      let b = a.path;
      if (b != null) {
        let c = PathResolver.DEFAULT_RES;
        if (b.charAt(0) == "R") {
          c = Math.round(Numeric.parseInt(Std.substr(b, 2, null)) * 3 / 2 + 1);
        }
        a = new PathState(c, a.moveSpeed * LevelController.SCALE, a.rotateSpeed);
        a.angle = this.rotation;
        a.fromSpec(b, this.x, this.y);
        this.setMotion(a);
        a.start();
      }
    }
  }
  MovingEntity.i = true;
  MovingEntity.s = Entity;
  Object.assign(MovingEntity.prototype, {
    l: MovingEntity
  });
  class BezierMover extends MotionBase {
    constructor(a, b) {
      super();
      this.animCtl = new AnimSequenceCtl();
      this.ownerEntity = a;
      this.point = b;
    }
    play(a) {
      let b = a.data[0];
      this.set(b.x, b.y);
      this.animCtl.play(a);
      this.animCtl.onFrameCb = cachedBind(this, this.onFrame);
      this.animCtl.onDoneCb = cachedBind(this, this.onDoneCb);
      this.attachAnim(this.animCtl);
    }
    onDoneCb() {
      this.free();
      this.ownerEntity.bezierMover = null;
    }
    onFrame(a, b, c) {
      let d = a.x;
      a = a.y;
      this.set(d + (b.x - d) * c, a + (b.y - a) * c);
    }
    set(a, b) {
      this.point.g.x = this.ownerEntity.x + a;
      this.point.g.y = this.ownerEntity.y + b;
      this.point.prev.x = this.point.g.x;
      this.point.prev.y = this.point.g.y;
    }
  }
  BezierMover.i = true;
  BezierMover.s = MotionBase;
  Object.assign(BezierMover.prototype, {
    l: BezierMover
  });
  class CharacterController {
    constructor(a) {
      this.controller = a;
      this.activeMouse = null;
      this.activeIndex = -1;
      this.locked = false;
      this.mice = [];
    }
    update(a) {
      let b = 0;
      let c = this.mice;
      while (b < c.length) {
        c[b++].update(a);
      }
    }
    draw() {
      let a = 0;
      let b = this.mice;
      while (a < b.length) {
        b[a++].draw();
      }
    }
    containsGrab(a) {
      if (this.activeMouse == null) {
        return false;
      } else if (this.activeMouse.isActive) {
        return this.activeMouse.containsGrab(a);
      } else {
        return false;
      }
    }
    captureGrab(a) {
      if (this.activeMouse != null) {
        this.activeMouse.captureGrab(a);
      }
    }
    hasGrab() {
      if (this.activeMouse == null) {
        return false;
      } else {
        return this.activeMouse.hasGrab();
      }
    }
    addChild(a, b) {
      this.mice.push(a);
      if (b == 1) {
        this.mouseContainer = new Container();
        var c = new Sprite(this.mouseContainer, Resources.wf, Keys.nH);
        c.setUniformScale(0.4);
        c.center();
        c = new Sprite(this.mouseContainer, Resources.wf, Keys.kH);
        c.setUniformScale(0.4);
        c.center();
        a.enter(this.mouseContainer, a.mainGrab);
        this.activeMouse = a;
        this.activeIndex = b;
      }
    }
    tryClick(a, b, c) {
      if (this.activeMouse == null) {
        return false;
      } else if (this.activeMouse.isActive && this.activeMouse.hasGrab() && this.activeMouse.tryClickAt(a, b, c)) {
        this.activeMouse.dropGrab();
        return true;
      } else {
        return false;
      }
    }
    switchToNext() {
      if (!this.locked) {
        var a = this;
        var b = Lambda.find(this.mice, function (e) {
          return e.index == a.activeIndex;
        });
        var c = this.activeIndex + 1;
        if (c == this.mice.length + 1) {
          c = 1;
        }
        var d = Lambda.find(this.mice, function (e) {
          return e.index == c;
        });
        d.enter(this.mouseContainer, b.mainGrab);
        b.mainGrab = null;
        this.activeIndex = c;
        this.activeMouse = d;
      }
    }
    lock() {
      this.locked = true;
    }
  }
  CharacterController.i = true;
  Object.assign(CharacterController.prototype, {
    l: CharacterController
  });
  class Character extends MovingEntity {
    constructor(a) {
      super();
      this.popped = false;
      this.container = new Container();
      this.baseSprite = new Sprite(null, Resources.ca, X.bool() ? Keys.aH : Keys.bH);
      this.baseSprite.center();
      this.baseSprite.setUniformScale(0.4);
      this.container.appendChild(this.baseSprite);
      this.faceSprite = new Sprite(null, Resources.ca, Keys.Jy);
      this.faceSprite.setUniformScale(0.4);
      this.faceSprite.center();
      this.container.appendChild(this.faceSprite);
      a.layer(5).appendChild(this.container.node);
      a = Character.BOUNDS.w / 2;
      let b = Character.BOUNDS.h / 2;
      a = this.localBounds = new Bounds(0 - a, 0 - b, a, b);
      this.bounds = new Bounds(a.left, a.top, a.right, a.bottom);
    }
    pop() {
      this.faceSprite.setVisible(false);
      this.popped = true;
    }
    update(a) {
      super.update(a);
      this.updateBounds();
    }
    draw() {
      this.baseSprite.setX(this.x);
      this.baseSprite.setY(this.y);
      this.faceSprite.setX(this.x);
      this.faceSprite.setY(this.y);
      this.faceSprite.setUniformScale(this.visualScale * 0.4);
      if (this.bubbleHit || this.isOwned()) {
        this.baseSprite.setVisible(false);
      }
    }
    collisionSize() {
      let a = Resources.ca.frames.findByName(Keys.Jy).uvOffset;
      return new Vec2(a.w * 0.4, a.h * 0.4);
    }
  }
  Character.i = true;
  Character.s = MovingEntity;
  Object.assign(Character.prototype, {
    l: Character
  });

  class BeeAnims {
    constructor() {
      function a(d) {
        d = new Sprite(b.container, Resources.de, Keys.indexed(Keys.Wp, d));
        d.center();
        return d;
      }
      this.container = new Container();
      this.animators = [];
      let b = this;
      if (BeeAnims.zn == null) {
        BeeAnims.zn = AnimTimeline.parse("0,s.32<x34<y9<,.48,s.31>x33>y8>,.96,s.30<x34<y7<,1.44,s.31>x34>y9>,1.92,s.32x33y8,2.4,x34y9");
      }
      var c = new SpriteAnimator(a(0));
      c.loop(BeeAnims.zn);
      this.animators.push(c);
      if (BeeAnims.An == null) {
        BeeAnims.An = AnimTimeline.parse("-100,s.38>,-99.,s.4<,-99.,s.38>,-98.,s.37,0,sx.37sy.4x26<y23<,.4,x25>y22>,.8,x24<y21<,1.20,x25>y22>,1.6,x26y23");
      }
      c = new SpriteAnimator(a(1));
      c.loop(BeeAnims.An);
      this.animators.push(c);
      if (BeeAnims.Pz == null) {
        BeeAnims.Pz = AnimTimeline.parse("0,s.13<x-34<y4<,.43,s.14>x-35>y3>,.86,s.16<x-36<y2<,1.29,s.14>x-35>y3>,1.72,s.13x-34y4");
      }
      c = new SpriteAnimator(a(1));
      c.loop(BeeAnims.Pz);
      this.animators.push(c);
      if (BeeAnims.Xh == null) {
        BeeAnims.Xh = AnimTimeline.parse("0,s.24<x-30<y17<,.42,s.22>x-29>y16>,.84,s.21<x-28<y15<,1.26,s.22>x-29>y16>,1.68,s.24x-30y17");
      }
      c = new SpriteAnimator(a(0));
      c.loop(BeeAnims.Xh);
      this.animators.push(c);
      if (BeeAnims.Wh == null) {
        BeeAnims.Wh = AnimTimeline.parse("0,s.37<x-2<y31<,.47,s.38>x-3>y32>,.94,s.4<x-4<y33<,1.41,s.38>x-3>y32>,1.88,s.37x-2y31");
      }
      c = a(4);
      c.setRotation(350);
      c = new SpriteAnimator(c);
      c.loop(BeeAnims.Wh);
      this.animators.push(c);
    }
    free() {
      this.container.free();
      this.container = null;
    }
  }
  BeeAnims.i = true;
  Object.assign(BeeAnims.prototype, {
    l: BeeAnims
  });

  class Bee extends Character {
    constructor(a) {
      super(a.controller);
      this.switcher = a;
      this.alpha = 1;
      this.state = 0;
      this.beeAnims = new BeeAnims();
      this.container.appendChild(this.beeAnims.container);
    }
    free() {
      this.container.free();
      this.container = null;
      this.beeAnims.free();
      this.beeAnims = null;
    }
    isDying() {
      return this.state < 0;
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
    pop() {
      super.pop();
      this.beeAnims.container.setVisible(false);
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
          this.switcher.freeBeeSlot();
        }
      }
    }
    draw() {
      super.draw();
      if (this.beeAnims != null) {
        this.beeAnims.container.setX(this.x);
        this.beeAnims.container.setY(this.y);
      }
      this.container.setAlpha(this.alpha);
    }
  }
  Bee.i = true;
  Bee.s = Character;
  Object.assign(Bee.prototype, {
    l: Bee
  });
  // OmNom - the player character that eats the candy. `state` is a
  // small animation FSM (0=idle, 1/2=look-left/right, 3=wakeStart,
  // 4=settle, 5=surprised, 6=eat, 7/8=mouthOpen/Close, 9=chewLoop,
  // 10=idleCalm, 11=snooze, 12=transform, 13=nightIdle loop,
  // 14=grabBy loop). `playAnim()` drives it and feeds the resource
  // back-channel (Fu/iM/ml atlases) for the right sprite sheet.
  // `ate` latches true once the candy is eaten (final state).
  // `transformed` latches true once the candy-into-OmNom morph fires
  // (the IQ "field" sound). on night levels (`controller.nightMode`)
  // OmNom is asleep until lit by the player: zSprite / zSprite2 are
  // the floating ZZZ glyphs that fade out, and snoreTimer ticks down
  // to play a random snore SFX every 4s while unlit. `blinkCountdown`
  // randomises how many idle cycles happen before the eye blink.
  // shadowSprite is the static drop-shadow under the character.
  class OmNom extends Entity {
    constructor(a, b) {
      super();
      this.controller = a;
      this.state = 0;
      this.ate = false;
      this.x = b.x * WorldScale.scale;
      this.y = b.y * WorldScale.scale;
      this.blinkCountdown = X.randInt(5, 20);
      this.idlesUntilBlink = 3;
      this.snoring = false;
      this.time = 0;
      b = a.layer(1);
      this.shadowSprite = new Sprite(null, Resources.wq);
      this.shadowSprite.center();
      this.shadowSprite.setUniformScale(0.4);
      b.appendChild(this.shadowSprite.node);
      this.charNode = new Container();
      this.charNode.setUniformScale(0.4);
      this.char = new Sprite(this.charNode, Resources.Fu, Keys.IF);
      this.char.center();
      b.appendChild(this.charNode.node);
      this.blink = new Sprite(null, Resources.Fu, Keys.EF);
      this.blink.center();
      this.blink.setUniformScale(0.4);
      this.blink.setVisible(false);
      b.appendChild(this.blink.node);
      var c = Rect.clone(OmNom.defaultBounds);
      c.x -= 128;
      c.y -= 128;
      let d = c.x;
      let e = c.y;
      c = this.localBounds = new Bounds(d, e, d + c.w, e + c.h);
      this.bounds = new Bounds(c.left, c.top, c.right, c.bottom);
      this.updateBounds();
      this.shadowSprite.setX(this.x + Math.round(vLN023 * 0.4));
      this.shadowSprite.setY(this.y + Math.round(vLN024 * 0.4));
      if (a.nightMode) {
        this.zSprite = new Sprite(null, Resources.ml);
        this.zSprite.setUniformScale(0.4);
        this.zSprite.anim().loop(OM_NOM_ZZZ_ANIM);
        this.zSprite.center();
        this.zSprite.setX(this.x);
        this.zSprite.setY(this.y);
        b.appendChild(this.zSprite.node);
        this.zSprite2 = new Sprite(null, Resources.ml);
        this.zSprite2.setUniformScale(0.4);
        this.zSprite2.anim().loop(OM_NOM_ZZZ_ANIM_REV);
        this.zSprite2.center();
        this.zSprite2.setX(this.x);
        this.zSprite2.setY(this.y);
        b.appendChild(this.zSprite2.node);
      }
      this.lit = null;
      this.snoreTimer = 0;
      this.snoreSfxId = -1;
      this.playAnim(0);
    }
    playIdleCalm() {
      if (!this.ate && !this.transformed) {
        this.playAnim(10);
      }
    }
    playLookLeft() {
      if (!this.ate && this.isAwake()) {
        this.playAnim(1);
      }
    }
    playLookRight() {
      if (!this.ate && this.isAwake()) {
        this.playAnim(2);
      }
    }
    playMouthOpen() {
      if (!this.ate && this.isAwake()) {
        this.playAnim(7);
      }
    }
    playMouthClose() {
      if (!this.ate && this.isAwake()) {
        this.playAnim(8);
      }
    }
    playSurprised() {
      if (!this.ate) {
        this.playAnim(5);
        this.stopSnore();
      }
    }
    playEat() {
      if (!this.ate) {
        this.playAnim(6);
        this.stopSnore();
        this.ate = true;
      }
    }
    playWakeStart() {
      if (!this.ate && this.isAwake()) {
        this.playAnim(3);
      }
    }
    playSnooze() {
      if (!this.ate) {
        this.playAnim(11);
      }
    }
    playTransform() {
      this.playAnim(12);
      this.transformed = true;
      SoundFx.play(SoundFx.sp_field);
      if (this.controller.nightMode) {
        this.zSprite.setVisible(false);
        this.zSprite2.setVisible(false);
      }
    }
    playNight() {
      if (this.state != 12) {
        this.playAnim(13);
      }
    }
    playGrabBy() {
      switch (this.state) {
        case 7:
        case 8:
        case 14:
          break;
        default:
          this.playAnim(14);
      }
    }
    isCalm() {
      switch (this.state) {
        case 0:
        case 1:
        case 2:
          return true;
        default:
          return false;
      }
    }
    setLit(a) {
      if (this.transformed) {
        this.lit = true;
      } else if (this.lit != a) {
        let b = this.lit == null;
        this.lit = a;
        if (b) {
          this.playSnooze();
        } else if (a) {
          this.playWakeStart();
          this.zSprite.anim().stop();
          this.zSprite.setVisible(false);
          this.zSprite2.anim().stop();
          this.zSprite2.setVisible(false);
          SoundFx.stop(this.snoreSfxId);
          this.char.setScaleY(1);
        } else if (!this.ate) {
          this.snoreTimer = 0;
          this.playSnooze();
          this.zSprite.anim().play(OM_NOM_ZZZ_ANIM);
          this.zSprite.setVisible(true);
          this.zSprite2.anim().play(OM_NOM_ZZZ_ANIM_REV);
          this.zSprite2.setVisible(true);
        }
      }
    }
    isAwake() {
      if (this.controller.nightMode) {
        return this.lit;
      } else {
        return true;
      }
    }
    stopSnore() {
      if (this.controller.nightMode) {
        SoundFx.stop(this.snoreSfxId);
        this.zSprite.setVisible(false);
        this.zSprite2.setVisible(false);
        this.snoreTimer = 0;
      }
    }
    playAnim(a) {
      switch (a) {
        case 3:
        case 4:
        case 6:
        case 7:
        case 8:
        case 10:
          var b = Resources.iM;
          break;
        case 11:
        case 12:
        case 13:
        case 14:
          b = Resources.ml;
          break;
        default:
          b = Resources.Fu;
      }
      this.char.setTexture(b);
      switch (a) {
        case 9:
          b = true;
          break;
        case 13:
        case 14:
          b = true;
          break;
        default:
          b = false;
      }
      this.state = a;
      if (b) {
        this.char.anim().loop(OM_NOM_ANIMS[a]);
      } else {
        this.char.anim().play(OM_NOM_ANIMS[a], a == 2 ? 2 : 1).onProgress(cachedBind(this, this.onAnimDone));
      }
    }
    onAnimDone() {
      let a = this;
      switch (this.state) {
        case 0:
          this.idlesUntilBlink--;
          if (this.idlesUntilBlink == 0) {
            this.blink.setVisible(true);
            this.blink.anim().play(OM_NOM_BLINK_ANIM).onProgress(function () {
              a.blink.setVisible(false);
            });
            this.idlesUntilBlink = 3;
          }
          if (--this.blinkCountdown == 0) {
            if (X.bool()) {
              this.playLookLeft();
            } else {
              this.playLookRight();
            }
            this.blinkCountdown = X.randInt(5, 20);
          } else {
            this.playAnim(0);
          }
          break;
        case 1:
        case 2:
        case 3:
        case 4:
          this.playAnim(0);
          break;
        case 6:
          this.playAnim(9);
          break;
        case 8:
          if (this.transformed) {
            this.playAnim(13);
          } else {
            this.playAnim(4);
          }
          break;
        case 10:
          this.playAnim(0);
          break;
        case 11:
          this.snoring = true;
          break;
        case 12:
          this.playAnim(13);
      }
    }
    update(a) {
      super.update(a);
      this.updateBounds();
      if (this.controller.nightMode && !this.transformed) {
        if (this.snoring) {
          let b = remap(Math.sin(this.time * 2), -1, 1, 0.95, 1.05);
          this.char.setOrigin(0, 433);
          this.char.setScaleY(b);
          this.time += a;
        }
        if (!this.lit) {
          this.snoreTimer += a;
          if (this.snoreTimer > 4) {
            this.snoreTimer = 0;
            this.snoreSfxId = [1041, 1040, 1039][X.randInt(0, 2)];
            SoundFx.play(this.snoreSfxId);
          }
        }
      }
    }
    draw() {
      super.draw();
      this.bounds.left = this.x + this.localBounds.left;
      this.bounds.top = this.y + this.localBounds.top;
      this.bounds.right = this.x + this.localBounds.right;
      this.bounds.bottom = this.y + this.localBounds.bottom;
      this.charNode.setX(this.x);
      this.charNode.setY(this.y);
      this.blink.setX(this.x);
      this.blink.setY(this.y);
    }
  }
  OmNom.i = true;
  OmNom.s = Entity;
  Object.assign(OmNom.prototype, {
    l: OmNom
  });
