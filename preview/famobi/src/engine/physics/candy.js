  class Candy extends MovingEntity {
    constructor(a) {
      super();
      this.controller = a;
      this.rope = null;
      this.isWheel = false;
      this.pinIdx = -1;
      this.lastTouchPos = Vec2.zero();
      this.bubbleTime = 0;
      this.inBubble = false;
      this.bubbleAnchor = 0;
      this.bubbleSprite = this.bubbleBack = null;
      this.bubbleMax = this.bubbleMin = this.bubbleAxis = 0;
      this.spiderActive = this.hasSpider = false;
      this.spider = null;
      this.spiderDist = 0;
      this.popping = this.ropeChanged = this.spiderArmed = false;
      this.fadeAlpha = 0.8;
      this.radius = 0;
    }
    angleBetween(a, b, c) {
      a = Vec2.diff(a, c);
      return (Vec2.diff(b, c).direction() - a.direction()) * RAD2DEG;
    }
    setLastTouch(a, b) {
      this.lastTouchPos.x = a;
      this.lastTouchPos.y = b;
    }
    onWheelDrag(a) {
      SoundFx.play(SoundFx.wheel);
      let b = this.angleBetween(this.lastTouchPos, a, new Vec2(this.x, this.y));
      if (b > 180) {
        b -= 360;
      } else if (b < -180) {
        b += 360;
      }
      var c = this.wheelSprite;
      c.setRotation(c.rotation + b);
      c = this.wheelTopSprite;
      c.setRotation(c.rotation + b);
      c = this.wheelPinSprite;
      c.setRotation(c.rotation + b);
      b = b > 0 ? Math.min(Math.max(1, b), 2.25) : Math.max(Math.min(-1, b), -2.25);
      if (this.rope != null) {
        if (b > 0) {
          if (this.rope.length() < 660) {
            this.rope.extend(b);
          }
        } else if (b != 0 && this.rope.points.length > 3) {
          this.rope.shrink(-b);
        }
        this.ropeChanged = true;
      }
      this.lastTouchPos.copyFrom(a);
    }
    update(a) {
      super.update(a);
      if (this.popping) {
        this.fadeAlpha -= a * 1.5;
        if (this.fadeAlpha <= 0) {
          this.radius = -1;
          this.popping = false;
        }
      }
      if (this.arrowSprite != null) {
        let b = Vec2.diff(this.motion.path[this.motion.cursor], this.motion.g);
        let c = 0;
        if (Math.abs(b.x) > 15) {
          c = b.x > 0 ? 10 : -10;
        }
        this.arrowSprite.setRotation(PathResolver.rampToward(this.arrowSprite.rotation, c, 60, a));
      }
      if (this.isWheel && this.ropeChanged && this.rope != null) {
        a = this.rope.length() * 0.7;
        if (a == 0) {
          this.wheelSprite.setUniformScale(0.001);
        } else {
          this.wheelSprite.setUniformScale(Math.max(0, Math.min(1.2, 1 - a / 784)) * 0.4);
        }
      }
    }
    updateSpider(a) {
      if (this.hasSpider && this.spiderArmed) {
        this.spiderArmed = false;
        this.spiderActive = true;
        SoundFx.play(SoundFx.spider_activate);
        this.spider.start();
      }
      if (this.hasSpider && this.spiderActive) {
        if (this.spider.state != 0) {
          this.spiderDist += a * 46.800000000000004;
        }
        a = 0;
        let c = false;
        if (this.rope != null) {
          var b = this.rope.trail;
          let d = b.length;
          let e = 0;
          while (e < d) {
            let f = e++;
            let g = b[f];
            let h = b[f + 1];
            let m = Math.max(28, g.distTo(h));
            if (this.spiderDist >= a && (this.spiderDist < a + m || f > d - 3)) {
              b = Vec2.diff(h, g);
              b.multiply((this.spiderDist - a) / m);
              this.spider.sprite.setX(g.x + b.x);
              this.spider.sprite.setY(g.y + b.y);
              if (f > d - 3) {
                c = true;
              }
              if (this.spider.state != 0) {
                this.spider.sprite.setRotation(b.direction() * RAD2DEG + 270);
              }
              break;
            } else {
              a += m;
            }
          }
        }
        if (c) {
          this.spiderDist = -1;
        }
      }
    }
    updateBack() {
      if (this.bubbleTime > 0) {
        this.back.setVisible(false);
        this.bubbleBack.setVisible(true);
      } else {
        this.back.setX(this.x);
        this.back.setY(this.y);
        this.back.setVisible(true);
        if (this.bubbleBack != null) {
          this.bubbleBack.setVisible(false);
        }
      }
      if (this.radius != -1 || this.popping) {
        this.updateGlow(this.x, this.y, this.radius != -1 ? this.radius : this.savedRadius);
      }
    }
    updateGlow(a, b, c) {
      this.glow.color.x = 0.2;
      this.glow.color.y = 0.5;
      this.glow.color.z = 0.9;
      this.glow.color.w = this.fadeAlpha;
      let d = this.glow.center;
      d.x = a;
      d.y = b;
      this.glow.radius = c;
    }
    draw() {
      if (this.isWheel) {
        this.wheelPinSprite.setVisible(this.pinIdx != -1);
        this.wheelTopSprite.setVisible(this.pinIdx == -1);
      }
      if (this.arrowSprite != null) {
        this.arrowSprite.setX(this.x);
        this.arrowSprite.setY(this.y);
      }
      if (this.rope != null) {
        this.rope.draw();
      }
      if (this.bubbleTime <= 0) {
        this.front.setX(this.x);
        this.front.setY(this.y);
        this.front.setVisible(true);
      } else {
        this.front.setVisible(false);
        if (this.bubbleAxis != -1) {
          this.bubbleSprite.setFrame(Keys.BH);
        } else {
          this.bubbleSprite.setFrame(Keys.Ly);
        }
        this.bubbleSprite.setX(this.x);
        this.bubbleSprite.setY(this.y);
      }
    }
    attachRope(a) {
      this.rope = a;
      this.savedRadius = this.radius;
      this.radius = -1;
      if (this.hasSpider) {
        this.spiderArmed = true;
      }
    }
    setRadius(a) {
      this.savedRadius = this.radius;
      this.radius = a;
      var b = this.controller.layer(3);
      var c = this.controller.layer(8);
      if (a == -1 || a == -2) {
        a = X.bool() ? [Keys.uH, Keys.vH] : [Keys.zH, Keys.AH];
        this.back = new Sprite(null, Resources.ph, a[0]);
        this.back.setUniformScale(0.4);
        this.back.center();
        this.front = new Sprite(null, Resources.ph, a[1]);
        this.front.center();
        this.front.setUniformScale(0.4);
        b.appendChild(this.back.node);
        c.appendChild(this.front.node);
      } else {
        this.back = new Sprite(null, Resources.ph, Keys.sH);
        this.back.center();
        this.back.setUniformScale(0.4);
        this.front = new Sprite(null, Resources.ph, Keys.tH);
        this.front.center();
        this.front.setUniformScale(0.5);
        b.appendChild(this.back.node);
        c.appendChild(this.front.node);
        this.popping = false;
        this.glow = new DashedCircleEffect();
        this.glowGroup = new SceneGroup();
        this.glowGroup.setEffect(this.glow);
        c.appendChild(this.glowGroup);
      }
      let d = this;
      if (this.isWheel) {
        b = function (e) {
          e = new Sprite(null, Resources.ph, e);
          e.center();
          e.setX(d.x);
          e.setY(d.y);
          e.setUniformScale(0.4);
          return e;
        };
        c = b(Keys.DH);
        this.controller.layer(3).appendChild(c.node);
        this.wheelSprite = b(Keys.EH);
        this.controller.layer(8).appendChild(this.wheelSprite.node);
        this.wheelPinSprite = b(Keys.CH);
        this.controller.layer(8).appendChild(this.wheelPinSprite.node);
        this.wheelTopSprite = b(Keys.FH);
        this.controller.layer(8).appendChild(this.wheelTopSprite.node);
        this.ropeChanged = true;
      }
    }
    setupBubbleTimer(a, b, c) {
      this.bubbleTime = a;
      this.inBubble = b;
      this.bubbleAnchor = c;
      if (this.bubbleTime > 0) {
        this.bubbleBack = new Container();
        a = new Sprite(this.bubbleBack, Resources.ph, Keys.wH);
        a.setX(-63);
        new Sprite(this.bubbleBack, Resources.ph, Keys.yH).setX(this.bubbleTime / 0.4 - 13);
        b = new Sprite(this.bubbleBack, Resources.ph, Keys.xH);
        b.setX(-63 + a.getWidth());
        b.setWidth(this.bubbleTime / 0.4 - 13);
        this.bubbleBack.setUniformScale(0.4);
        this.bubbleBack.center();
        this.controller.layer(5).appendChild(this.bubbleBack.node);
        this.bubbleSprite = new Sprite(null, Resources.ph, Keys.Ly);
        this.bubbleSprite.center();
        this.bubbleSprite.setUniformScale(0.4);
        this.controller.layer(8).appendChild(this.bubbleSprite.node);
        if (this.inBubble) {
          this.bubbleMin = this.y - this.bubbleAnchor;
          this.bubbleMax = this.y + (this.bubbleTime - this.bubbleAnchor);
          a = (this.bubbleMin + this.bubbleMax) / 2;
          this.bubbleBack.setX(this.x);
          this.bubbleBack.setY(a);
          this.bubbleBack.setRotation(90);
          this.bubbleSprite.setRotation(90);
        } else {
          this.bubbleMin = this.x - this.bubbleAnchor;
          this.bubbleMax = this.x + (this.bubbleTime - this.bubbleAnchor);
          this.bubbleBack.setX((this.bubbleMin + this.bubbleMax) / 2);
          this.bubbleBack.setY(this.y);
        }
      }
      this.bubbleAxis = -1;
    }
    createArrow() {
      this.arrowSprite = new Container();
      this.arrowSprite.setUniformScale(0.3076923076923077);
      var a = new Sprite(this.arrowSprite, Resources.Ld, Keys.GG);
      a.center();
      a.setX(a.getX() - 6);
      a.setY(a.getY() - 54);
      this.controller.layer(8).appendChild(this.arrowSprite.node);
      a = new Sprite(this.arrowSprite, Resources.Ld, Keys.HG);
      a.center();
      a.setX(-6);
      a.setY(-54);
      a.anim().loop(BEE_ANIM);
      a.anim().randomize();
    }
    setSpider(a) {
      this.hasSpider = a;
      this.spiderActive = this.spiderArmed = false;
      if (a) {
        this.spider = new Spider();
        this.spider.sprite.setX(this.x);
        this.spider.sprite.setY(this.y);
        this.controller.addChild(this.spider);
        this.controller.layer(10).appendChild(this.spider.sprite.node);
      }
    }
    detachRope() {
      this.rope = null;
    }
  }
  Candy.i = true;
  Candy.s = MovingEntity;
  Object.assign(Candy.prototype, {
    l: Candy
  });
  class CandyVariant extends Candy {
    constructor(a) {
      super(a.controller);
      this.switcher = a;
      this.animators = [];
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
    buildAnimations() {
      function a(d) {
        d = new Sprite(b.beeAnims, Resources.de, Keys.indexed(Keys.Wp, d));
        d.center();
        return d;
      }
      this.container = new Container();
      this.controller.layer(5).appendChild(this.container.node);
      let b = this;
      if (CandyVariant.Yz == null) {
        CandyVariant.Yz = AnimTimeline.parse("0,s.17<x-26<y3<,.65,s.18>x-25>y2>,1.3,s.2<x-24<y1<,1.95,s.18>x-25>y2>,2.6,s.17x-26y3");
      }
      var c = new SpriteAnimator(a(1));
      c.loop(CandyVariant.Yz);
      this.animators.push(c);
      if (CandyVariant.Xh == null) {
        CandyVariant.Xh = AnimTimeline.parse("0,s.36<x23<y14<,.45,s.32>x22>y13>,.9,s.27<x21<y12<,1.35,s.32>x22>y13>,1.8,s.36x23y14");
      }
      c = new SpriteAnimator(a(2));
      c.loop(CandyVariant.Xh);
      this.animators.push(c);
      if (CandyVariant.Wh == null) {
        CandyVariant.Wh = AnimTimeline.parse("0,s.44<x-3<y25<,.5,s.4>x-2>y24>,1,s.36<x-1<y23<,1.5,s.4>x-2>y24>,2,s.44x-3y25");
      }
      c = new SpriteAnimator(a(4));
      c.loop(CandyVariant.Wh);
      this.animators.push(c);
    }
    free() {
      if (this.rope != null) {
        this.rope.severAt(0);
        this.rope.free();
      }
      this.detachRope();
      this.container.free();
      this.container = null;
      this.back.free();
      this.front.free();
      this.front = this.back = this.controller = null;
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
      if (this.state < 0 && this.state != -2) {
        this.time += a;
        a = Math.min(1, this.time / 0.16);
        this.alpha = 1 - a;
        if (a == 1) {
          this.state = -2;
          this.switcher.freeCandySlot();
        }
      }
    }
    draw() {
      super.draw();
      this.container.setX(this.x);
      this.container.setY(this.y);
      this.container.setAlpha(this.alpha);
      this.back.setAlpha(this.alpha);
      this.front.setAlpha(this.alpha);
      this.glow.color.w = this.alpha;
    }
  }
  CandyVariant.i = true;
  CandyVariant.s = Candy;
  Object.assign(CandyVariant.prototype, {
    l: CandyVariant
  });

  class CandyCutAnim extends AnchoredEntity {
    constructor(a) {
      super();
      this.controller = a;
      var b = CandyCutAnim.BOUNDS.w;
      var c = b / 2;
      let d = CandyCutAnim.BOUNDS.h / 2;
      c = this.localBounds = new Bounds(0 - c, 0 - d, c, d);
      this.bounds = new Bounds(c.left, c.top, c.right, c.bottom);
      this.container = new Container();
      a.layer(9).appendChild(this.container.node);
      a = new Sprite(null, Resources.skinAtlas, Keys.cH);
      a.center();
      this.container.appendChild(a);
      b /= a.size.x;
      b *= a.size.x / CandyCutAnim.SRC_RECT.w;
      a.setUniformScale(b);
      a = new Sprite(null, Resources.skinAtlas, Keys.dH);
      a.center();
      a.setUniformScale(b);
      this.container.appendChild(a);
      a = new Sprite(null, Resources.skinAtlas, Keys.eH);
      a.center();
      a.setUniformScale(b);
      this.container.appendChild(a);
      a = new Sprite(null, Resources.skinAtlas, v155.data[0]);
      a.center();
      a.setUniformScale(b);
      this.container.appendChild(a);
      this.container.setUniformScale(0.71);
      this.followCandy = true;
    }
    playCutAnim() {
      if (this.container != null) {
        var a = this.container.childAt(3);
        a.setVisible(true);
        a.anim().play(v155).onComplete(function () {
          a.setVisible(false);
        });
      }
    }
    showMagnetHit() {
      if (this.container != null) {
        var a = this.container.childAt(3);
        a.setVisible(true);
        a.setAlpha(1);
        a.anim().play(v156);
        a.tween().alpha(0, 0.2, null, null, function () {
          a.setVisible(false);
        });
      }
    }
    free() {
      this.container.free();
      this.container = null;
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
      if (this.container != null) {
        if (this.followCandy) {
          this.container.setX(this.x);
          this.container.setY(this.y);
        }
        this.container.setRotation(this.rotation);
        this.container.setVisible(this.visible);
      }
    }
  }
  CandyCutAnim.i = true;
  CandyCutAnim.s = AnchoredEntity;
  Object.assign(CandyCutAnim.prototype, {
    l: CandyCutAnim
  });
  class CandyShatterParticles extends ParticleEmitter {
    constructor(a, b) {
      super(b);
      this.controller = a;
      this.duration = 2;
      this.gravity.x = 0;
      this.gravity.y = 500;
      this.angle = -90;
      this.angleVar = 50;
      this.speed = 150;
      this.speedVar = 70;
      this.tangentialAccelVar = this.radialAccelVar = 1;
      this.life = 2;
      this.size = 1;
      this.emitRate = 100;
      this.angularVel = 0;
      this.angularVelVar = 600;
      this.sprites = [];
    }
    initParticle(a) {
      super.initParticle(a);
      a.angSpeed = DEG2RAD * (this.angularVel + this.angularVelVar * X.randCentered());
      a = new Sprite(null, Resources.skinAtlas, Keys.indexed("", X.randInt(3, 7)));
      a.center();
      a.setUniformScale(this.size * 0.4);
      this.controller.layer(5).appendChild(a.node);
      this.sprites.push(a);
    }
    writeOutput(a, b, c) {
      a.angle += a.angSpeed * c;
      super.writeOutput(a, b, c);
    }
    removeAt(a) {
      super.removeAt(a);
      this.sprites.splice(a, 1);
    }
    draw() {
      super.draw();
      let a = 0;
      let b = this.particles.length;
      while (a < b) {
        var c = a++;
        let d = this.particles[c];
        c = this.sprites[c];
        c.setRotation(d.angle * RAD2DEG);
        c.setX(d.g.x);
        c.setY(d.g.y);
      }
    }
  }
  CandyShatterParticles.i = true;
  CandyShatterParticles.s = ParticleEmitter;
  Object.assign(CandyShatterParticles.prototype, {
    l: CandyShatterParticles
  });
  class CandyPiece extends AnchoredEntity {
    constructor(a, b) {
      super();
      this.controller = a;
      this.sprite = new Sprite(null, Resources.skinAtlas, b);
      this.sprite.center();
      this.sprite.setUniformScale(0.284);
      a.layer(9).appendChild(this.sprite.node);
      a = CandyPiece.BOUNDS.w / 2;
      b = CandyPiece.BOUNDS.h / 2;
      a = this.localBounds = new Bounds(0 - a, 0 - b, a, b);
      this.bounds = new Bounds(a.left, a.top, a.right, a.bottom);
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
      if (this.sprite != null) {
        this.sprite.setX(this.x);
        this.sprite.setY(this.y);
        this.sprite.setRotation(this.rotation);
      }
    }
  }
  CandyPiece.i = true;
  CandyPiece.s = AnchoredEntity;
  Object.assign(CandyPiece.prototype, {
    l: CandyPiece
  });

  class BubbleAnim {
    constructor(a) {
      this.controller = a;
      this.sprite = new Sprite();
      this.sprite.setVisible(false);
    }
    setX(a) {
      this.sprite.setX(a);
      if (this.beeAnims != null) {
        this.beeAnims.container.setX(a);
      }
      return a;
    }
    setY(a) {
      this.sprite.setY(a);
      if (this.beeAnims != null) {
        this.beeAnims.container.setY(a);
      }
    }
    removeFromNode() {
      this.sprite.remove();
      if (this.beeAnims != null) {
        this.beeAnims.container.remove();
      }
    }
    show() {
      this.sprite.setTexture(Resources.ca, Keys.XG);
      this.sprite.center();
      this.sprite.setUniformScale(0.4);
      if (this.sprite.node.parent == null) {
        this.controller.layer(9).appendChild(this.sprite.node);
      }
      this.sprite.anim().loop(BubbleAnim.IDLE_ANIM);
      this.sprite.setVisible(true);
    }
    reattachBeeAnim() {
      if (this.beeAnims != null && this.beeAnims.container.node.parent == null) {
        this.controller.layer(9).appendChild(this.beeAnims.container.node);
      }
    }
  }
  BubbleAnim.i = true;
  Object.assign(BubbleAnim.prototype, {
    l: BubbleAnim
  });
