  class LevelController extends Node {
    constructor(a) {
      super();
      this.scene = a;
      this.animContainer = this.addChild(new Node());
      this.root = new SceneRoot();
      this.layers = [];
      for (a = 0; a < 14;) {
        let b = new SceneRoot();
        this.layers[a++] = b;
        this.root.appendChild(b);
      }
      this.camera = new LevelCamera();
      this.scale = WorldScale.scale;
      this.apples = 0;
      this.scrollVec = Vec2.zero();
      this.particleTypes = [];
      for (a = 0; a < 5;) {
        this.particleTypes[a++] = [];
      }
      this.particleGroup = new SceneGroup();
      this.particleGroup.setEffect(new MultiLineEffect(this.particleTypes));
      this.layer(13).appendChild(this.particleGroup);
      this.tutorialTimer = this.ropesAlive = this.combinedPivotX = this.combinedPivotY = 0;
      this.delayedCalls = [];
      this.resetInput();
    }
    activateMagnet() {
      this.magnetActive = true;
      this.threeStarsEffect = new ThreeStarsCollect();
      this.layer(8).appendChild(this.threeStarsEffect.container.node);
    }
    activateTelekinesis() {
      this.fadeOverlay = new ScreenFade(this);
      this.borderFx = new AnimatedNineSlice(this, this.levelW, this.levelH, 4, false);
      this.magnetEffect = new MagnetEffect(this, new Vec2(this.omNom.x, this.omNom.y - 30), new Vec2(0, 0));
      this.magnetFlash = new MagnetGlowFlash(this, this.mainCandy);
      this.magnetTouchDur = 0;
      this.telekinesisActive = true;
      this.omNom.playTransform();
      this.bonusStar.activate();
      for (var a = 0, b = this.electrics; a < b.length;) {
        var c = b[a];
        ++a;
        if (c != null && (!c.electric || !!c.ignoreElectric)) {
          c.onElectricDeactivate();
        }
      }
      a = 0;
      for (b = this.sockets; a < b.length;) {
        c = b[a];
        ++a;
        if (c.hasSpider) {
          if (c.spiderActive) {
            this.detachSpider(c);
            c.spiderActive = false;
          } else {
            c.hasSpider = false;
            c.spider.dispose();
            c.spider = null;
          }
        }
      }
      if (this.nightMode) {
        this.omNom.setLit(true);
        a = 0;
        b = this.stars;
        while (a < b.length) {
          b[a++].setLit(true);
        }
      }
    }
    deactivateTelekinesis() {
      this.fadeOverlay.free();
      this.magnetFlash.free();
      this.borderFx.free();
      this.magnetEffect.free();
      let a = 0;
      let b = this.electrics;
      while (a < b.length) {
        b[a++].onElectricReactivate();
      }
    }
    bounceOff(a, b, c) {
      if (!a.bounceHandled) {
        a.bounceHandled = true;
        var d = a.rotation * DEG2RAD;
        var e = Vec2.diff(b.prev, b.g);
        var f = b.prev;
        f = new Vec2(f.x, f.y);
        f.rotateAround(-d, a.x, a.y);
        f = f.y < a.y;
        e = Math.max(e.length() * 40, 300) * (f ? -1 : 1);
        e = Vec2.scaled(Vec2.perpCCW(Vec2.fromAngle(d)), e);
        var g = b.g;
        g = new Vec2(g.x, g.y);
        g.rotateAround(-d, a.x, a.y);
        b.g = g;
        g = b.prev;
        g = new Vec2(g.x, g.y);
        g.rotateAround(-d, a.x, a.y);
        b.prev = g;
        b.prev.y = b.g.y;
        g = b.g;
        g = new Vec2(g.x, g.y);
        g.rotateAround(d, a.x, a.y);
        b.g = g;
        g = b.prev;
        g = new Vec2(g.x, g.y);
        g.rotateAround(d, a.x, a.y);
        b.prev = g;
        b.applyImpulse(e, c);
        c = d * -180 / Math.PI + 90;
        if (!f) {
          c += 180;
        }
        b = b.g;
        d = new Vec2(Star.radius, 0);
        d.rotate(-c);
        b = Vec2.sum(b, d);
        if (a.xB < 2) {
          SoundFx.play(SoundFx.sp_field_bounce);
          this.magnetFlash.flashAt(b, c);
        }
      }
    }
    applyTouchPan(a) {
      let b = Star.radius;
      let c = 0;
      let d = this.levelW;
      let e = this.levelH;
      let f = a.g.x < b || a.g.x > d - b;
      let g = a.g.y < b || a.g.y > e - b;
      if (f && Math.abs(Math.min(a.g.x, d - a.g.x)) > 0 || g && Math.abs(Math.min(a.g.y, e - a.g.y)) > 0) {
        let h = Vec2.diff(a.g, a.prev);
        a.prev = a.g;
        let m = null;
        if (f) {
          if (a.g.x < b) {
            h.x = Math.abs(h.x);
            c = 0;
            m = new Vec2(b, a.g.y);
          } else {
            h.x = -Math.abs(h.x);
            c = 180;
            m = new Vec2(d - b, a.g.y);
          }
          if (Math.abs(h.x) < 3) {
            h.x = (a.g.x < b ? 1 : -1) * 3;
          }
        }
        if (g) {
          if (a.g.y < b) {
            h.y = Math.abs(h.y);
            c = -90;
            m = new Vec2(a.g.x, b);
          } else {
            h.y = -Math.abs(h.y);
            c = 90;
            m = new Vec2(a.g.x, e - b);
          }
          if (Math.abs(h.y) < 3) {
            h.y = (a.g.y < b ? 1 : -1) * 3;
          }
          if (h.length() < 5) {
            h.normalize();
            h = Vec2.scaled(h, 5);
          }
        }
        a.g = Vec2.sum(a.g, h);
        if (a.g.x < b) {
          a.g.x = b;
        } else if (a.g.x > d - b) {
          a.g.x = d - b;
        }
        if (a.g.y < b) {
          a.g.y = b;
        } else if (a.g.y > e - b) {
          a.g.y = e - b;
        }
        this.magnetFlash.flashAt(m, c);
      }
    }
    resetInput() {
      for (var a = 0; a < 5;) {
        this.particleTypes[a++] = [];
      }
      this.touchActive = Array(5);
      this.touchPos = Array(5);
      this.touchPrev = Array(5);
      for (a = 0; a < 5;) {
        let b = a++;
        this.touchActive[b] = false;
        this.touchPos[b] = Vec2.zero();
        this.touchPrev[b] = Vec2.zero();
      }
    }
    layer(a) {
      return this.layers[a];
    }
    clearAnims() {
      let a = this.animContainer.firstChild;
      while (a != null) {
        let b = a.nextSibling;
        a.dispose();
        a = b;
      }
    }
    delay(a, b) {
      a = new DelayedCallback(a, b);
      this.animContainer.addChild(a);
    }
    dispose() {
      SoundFx.stop(SoundFx.monster_chewing);
      SoundFx.stop(SoundFx.sp_telekinesis);
      this.root.free();
      super.dispose();
    }
    show() {
      this.tutorialTimer = this.ropesAlive = 0;
      this.clearAnims();
      this.gravityButton = null;
      this.activeGravityTouch = -1;
      this.candyMode = 2;
      this.linkDistance = 0;
      SoundFx.stop(SoundFx.electric);
      SoundFx.stop(SoundFx.magnet_idle);
      this.sockets = [];
      this.electrics = [];
      this.stars = [];
      this.bubbles = [];
      this.pumps = [];
      this.socks = [];
      this.tutorialPics = [];
      this.tutorials = [];
      this.bouncers = [];
      this.vinyls = [];
      this.ghosts = [];
      this.steamGens = [];
      this.lanterns = [];
      this.conveyorMgr = new ConveyorBeltMgr(this);
      this.characterCtrl = new CharacterController(this);
      this.bouncerItems = [];
      this.swarm = null;
      this.lanternCaught = false;
      this.mainGrab = new VerletPoint();
      this.mainGrab.setWeight(1);
      this.leftGrab = new VerletPoint();
      this.leftGrab.setWeight(1);
      this.rightGrab = new VerletPoint();
      this.rightGrab.setWeight(1);
      this.anchorBubble = new BubbleAnim(this);
      var a = BoxLevelData.get();
      this.background = new LevelBackground(this);
      this.mainCandy = new CandyCutAnim(this);
      this.mainCandy.constraint = this.mainGrab;
      this.loadObjects(a);
      a = this.vinyls.length;
      let b;
      let c = 0;
      while (c < a) {
        b = this.vinyls[c++];
        b.activeTouchId = -1;
        b.siblings = this.vinyls;
      }
      this.apples = 0;
      this.rightRope = this.leftRope = this.heldGrab = null;
      this.afterFirstWin = false;
      this.bothActive = this.candyMode != 2;
      this.fadeStarted = this.candyBoth = this.rightSet = this.leftSet = false;
      this.time = this.totalScore = this.elapsedSec = 0;
      this.gravityFlipped = true;
      PhysicsConfig.reset();
      this.startDelay = this.ropesAlive > 0 ? 0 : 0.3;
      this.conveyorMgr.bindAll(this.stars);
      this.conveyorMgr.bindAll(this.socks);
      this.conveyorMgr.bindAll(this.bubbles);
      this.conveyorMgr.bindAll(this.steamGens);
      this.conveyorMgr.bindAll(this.pumps);
      this.conveyorMgr.bindAll(this.bouncers);
      this.conveyorMgr.reorderActive();
      this.bonusCollected = false;
      this.resetScroll();
    }
    loadObjects(a) {
      function b(g, h) {
        let m = 0;
        let n = g.length;
        while (m < n) {
          let q = g[m++];
          let p = 0;
          let v = q.length;
          while (p < v) {
            h(q[p++]);
          }
        }
      }
      let c = [];
      let d = 0;
      let e = ObjectAccess.getKeys(a);
      while (d < e.length) {
        c.push(ObjectAccess.getField(a, e[d++]));
      }
      let f = this;
      b(c, function (g) {
        switch (g.name) {
          case 0:
            f.addSettings(g);
            break;
          case 1:
            f.addGameDesign(g);
            break;
          case 50:
            f.addCandyLeft(g);
            break;
          case 51:
            f.addCandyRight(g);
            break;
          case 52:
            f.addCandy(g);
            break;
          case 134:
            f.addLightBulb(g);
        }
      });
      b(c, function (g) {
        switch (g.name) {
          case 2:
            f.omNom = new OmNom(f, g);
            f.iA = false;
            f.kr = LevelController.FIRST_HINT ? 2 : -1;
            f.sq = 1;
            LevelController.FIRST_HINT = false;
            break;
          case 3:
            f.addStar(g);
            break;
          case 4:
            f.addTutorialText(g);
            break;
          case 5:
          case 6:
          case 7:
          case 8:
          case 9:
          case 10:
          case 11:
          case 12:
          case 13:
          case 14:
            f.addTutorialPicture(g);
            break;
          case 53:
            f.addGravitySwitch(g);
            break;
          case 54:
            f.addBubble(g);
            break;
          case 55:
            f.addPump(g);
            break;
          case 56:
            f.addSock(g);
            break;
          case 57:
          case 58:
          case 59:
          case 60:
          case 80:
            f.addSpike(g);
            break;
          case 81:
          case 82:
            f.addBouncer(g);
            break;
          case 100:
            f.addGrab(g);
            break;
          case 120:
            f.addRotatedCircle(g);
            break;
          case 130:
            f.addGhost(g);
            break;
          case 131:
            f.addSteam(g);
            break;
          case 132:
            f.addLantern(g);
            break;
          case 133:
            f.addGap(g);
            break;
          case 135:
            f.addTransporter(g);
            break;
          case 300:
            f.addBonusStar(g);
        }
      });
    }
    addSettings(a) {
      this.levelW = a.width * this.scale | 0;
      this.levelH = a.height * this.scale | 0;
      var b = a.view;
      if (b != null) {
        var c = b.x;
        let d = b.y;
        b = new Bounds(c, d, c + b.width, d + b.height);
        b.scale(this.scale, false);
        c = this.camera.bounds;
        c.left = b.left;
        c.top = b.top;
        c.right = b.right;
        c.bottom = b.bottom;
        c = this.camera.target;
        c.x = (b.left + b.right) / 2;
        c.y = (b.top + b.bottom) / 2;
      } else {
        // preview bridge: when a custom level declares dimensions larger
        // than the canonical 320x480, the engine would fit the whole
        // level into the viewport and shrink everything. clamp the camera
        // bounds (and recenter) so the camera renders at the normal
        // scale; oversized object positions just clip off-screen rather
        // than triggering a global zoom-out.
        let _maxW = window.customleveldata != null ? Math.min(this.levelW, 320 * this.scale) : this.levelW;
        let _maxH = window.customleveldata != null ? Math.min(this.levelH, 480 * this.scale) : this.levelH;
        b = this.camera.bounds;
        b.left = 0;
        b.top = 0;
        b.right = _maxW;
        b.bottom = _maxH;
        b = this.camera.target;
        b.x = _maxW / 2;
        b.y = _maxH / 2;
      }
      this.scrollDir = new Vec4(0, 0, 0, 1);
      if (a.scrollX != null) {
        this.scrollDir.x = a.scrollX;
      }
      if (a.scrollY != null) {
        this.scrollDir.y = a.scrollY;
      }
      if (LevelState.box == 8) {
        this.background.addEarth();
      }
    }
    addGameDesign(a) {
      this.special = a.special;
      this.ropeSpeed = a.ropePhysicsSpeed;
      this.nightMode = a.nightLevel;
      this.candyMode = a.twoParts ? 0 : 2;
      this.ropeSpeed *= LevelController.ROPE_SPEED;
      if (this.candyMode != 2) {
        this.leftBubble = new BubbleAnim(this);
        this.rightBubble = new BubbleAnim(this);
      }
    }
    addGrab(a) {
      var b = a.x * this.scale;
      let c = a.y * this.scale;
      let d = a.length * this.scale;
      var e = a.radius;
      var f = a.wheel;
      var g = a.moveLength != null ? a.moveLength * this.scale : -1;
      let h = a.moveVertical;
      let m = a.moveOffset != null ? a.moveOffset * this.scale : 0;
      var n = a.spider;
      var q = a.part == "L";
      let p = a.hidePath;
      var v = a.bindBulb;
      let u = new Candy(this);
      u.x = b;
      u.y = c;
      u.Zf = f;
      u.setSpider(n);
      u.applyMotion(a);
      if (e != -1) {
        e *= this.scale;
      }
      if (e == -1) {
        f = this.mainGrab;
        if (v) {
          q = 0;
          v = this.bouncerItems;
          while (q < v.length) {
            n = v[q];
            ++q;
            if (n != null) {
              f = n.constraint;
            }
          }
        } else if (this.candyMode != 2) {
          f = q ? this.leftGrab : this.rightGrab;
        }
        b = new Rope(this.layer(6), null, b, c, f, f.g.x, f.g.y, d);
        b.startPoint.pinPos.copyFrom(b.startPoint.g);
        u.attachRope(b);
        this.incRopeCount();
      }
      u.setRadius(e);
      u.setupBubbleTimer(g, h, m);
      if (u.motion != null && (u.createArrow(), !p)) {
        a = a.path[0] == "R";
        if (this.swarm == null) {
          this.swarm = new SwarmManager(this);
        }
        e = 0;
        for (g = u.motion.path.length - 1; e < g;) {
          if (!a || e % 3 == 0) {
            this.swarm.addAlongLine(e, e + 1, u);
          }
          ++e;
        }
        if (u.motion.path.length > 2) {
          this.swarm.addAlongLine(0, u.motion.path.length - 1, u);
        }
      }
      this.sockets.push(u);
    }
    addCandyLeft(a) {
      this.leftGrab.g.x = a.x * this.scale;
      this.leftGrab.g.y = a.y * this.scale;
      this.leftCandy = new CandyPiece(this, Keys.fH);
      this.leftCandy.x = this.leftGrab.g.x;
      this.leftCandy.y = this.leftGrab.g.y;
      this.leftCandy.constraint = this.leftGrab;
    }
    addCandyRight(a) {
      this.rightGrab.g.x = a.x * this.scale;
      this.rightGrab.g.y = a.y * this.scale;
      this.rightCandy = new CandyPiece(this, Keys.gH);
      this.rightCandy.x = this.rightGrab.g.x;
      this.rightCandy.y = this.rightGrab.g.y;
      this.rightCandy.constraint = this.rightGrab;
    }
    addCandy(a) {
      this.mainGrab.g.x = a.x * this.scale;
      this.mainGrab.g.y = a.y * this.scale;
    }
    addLightBulb(a) {
      let b = new VerletPoint();
      b.setWeight(1);
      b.g.x = a.x * this.scale;
      b.g.y = a.y * this.scale;
      a = new LighterEntity(this, a.litRadius * this.scale);
      a.x = b.g.x;
      a.y = b.g.y;
      a.constraint = b;
      this.bouncerItems.push(a);
    }
    addGravitySwitch(a) {
      this.gravityButton = new ToggleButton(this, a.x * this.scale, a.y * this.scale);
      this.gravityButton.onClick = cachedBind(this, this.onGravityClick);
    }
    addStar(a) {
      let b = new Star(this);
      b.x = a.x * this.scale;
      b.y = a.y * this.scale;
      b.timeout = a.timeout;
      if (a.timeout != -1) {
        b.setTimeout();
      }
      b.applyMotion(a);
      b.update(0);
      this.stars.push(b);
    }
    addBonusStar(a) {
      this.bonusStar = new BonusStar(this);
      this.bonusStar.x = a.x * this.scale;
      this.bonusStar.y = a.y * this.scale;
      this.bonusStar.update(0);
    }
    addTutorialText(a) {
      if (!this.isObjectExcluded(a) && a.text != null && a.text != "") {
        var b = Math.ceil(a.width * this.scale);
        b = new TutorialHintText(Strings.get(a.text), b);
        b.x = a.x * this.scale;
        b.y = a.y * this.scale;
        this.layer(2).appendChild(b.sprite.node);
        a = a.special;
        b.special = a ?? 0;
        if (b.special == 0) {
          b.show();
        }
        this.tutorials.push(b);
      }
    }
    addTutorialPicture(a) {
      if (!this.isObjectExcluded(a)) {
        var b = new TutText(a.name - 5);
        b.sprite.center();
        b.x = a.x * this.scale;
        b.y = a.y * this.scale;
        var c = a.angle;
        b.rotation = c ?? 0;
        c = a.special;
        b.special = c ?? 0;
        b.applyMotion(a);
        a = 2;
        if (b.special == 2 || this.special == 5) {
          a = 13;
        }
        this.layer(a).appendChild(b.sprite.node);
        if (b.special == 0 || b.special == 2) {
          b.show();
        }
        this.tutorialPics.push(b);
      }
    }
    addBubble(a) {
      let b = new Character(this);
      b.x = a.x * this.scale;
      b.y = a.y * this.scale;
      this.bubbles.push(b);
    }
    addPump(a) {
      let b = new Pump(this);
      b.angle = a.angle;
      b.x = a.x * this.scale;
      b.y = a.y * this.scale;
      b.rotation = a.angle + 90;
      b.updateEnds();
      this.pumps.push(b);
    }
    addSock(a) {
      let b = new Sock(this, a.group);
      b.x = a.x * this.scale;
      b.y = a.y * this.scale;
      b.applyMotion(a);
      b.rotation += 90;
      if (b.motion != null) {
        b.motion.angle += 90;
      }
      b.updateEnds();
      this.socks.push(b);
    }
    addSpike(a) {
      var b = a.x * this.scale;
      let c = a.y * this.scale;
      let d = a.size;
      let e = parseFloat(a.angle);
      if (a.toggled == 0) {
        var f = -1;
      } else {
        f = a.toggled;
        f = f ?? -1;
      }
      b = new SawBlade(this, b, c, d, e ?? 0, f);
      b.applyMotion(a);
      if (f != -1) {
        b.onToggleCb = cachedBind(this, this.onElectricToggle);
      }
      if (a.name == 80) {
        b.electric = true;
        b.initialDelay = a.initialDelay;
        b.onTime = a.onTime;
        b.offTime = a.offTime;
        b.timer = 0;
        b.toggleOn();
        b.timer += b.initialDelay;
        b.updateEnds();
      } else {
        b.electric = false;
      }
      this.electrics.push(b);
    }
    addRotatedCircle(a) {
      let b = a.x * this.scale;
      let c = a.y * this.scale;
      let d = a.size * this.scale;
      var e = Numeric.parseInt(a.handleAngle);
      e = e ?? 0;
      let f = e * DEG2RAD;
      let g = a.oneHandle;
      let h = new Vinyl(this);
      h.handleHalf = a.size;
      h.x = b;
      h.y = c;
      h.rotation = e;
      h.leftHandle = new Vec2(h.x - h.handleHalf * this.scale, h.y);
      h.leftHandle.rotateAround(f, h.x, h.y);
      h.rightHandle = new Vec2(h.x + h.handleHalf * this.scale, h.y);
      h.rightHandle.rotateAround(f, h.x, h.y);
      h.setSize(d);
      h.setOneHandle(g);
      this.vinyls.push(h);
    }
    addBouncer(a) {
      let b = new Bouncer(this, a.x * this.scale, a.y * this.scale, a.size, a.angle);
      b.applyMotion(a);
      this.bouncers.push(b);
    }
    addGhost(a) {
      let b = a.x * this.scale;
      let c = a.y * this.scale;
      let d = a.radius;
      let e = a.angle;
      let f = a.grab;
      let g = a.bubble;
      a = a.bouncer;
      let h = new GameItemSwitcher(this);
      h.init(new Vec2(b, c), (a ? 8 : 0) | (g ? 2 : 0) | (f ? 4 : 0), d, e, this.bubbles, this.sockets, this.bouncers);
      this.ghosts.push(h);
      this.anchorBubble.beeAnims = new BeeAnims();
      if (this.candyMode != 2) {
        this.leftBubble.beeAnims = new BeeAnims();
        this.rightBubble.beeAnims = new BeeAnims();
      }
    }
    addSteam(a) {
      let b = a.x * this.scale;
      let c = a.y * this.scale;
      a = a.angle;
      let d = new SteamGenerator(this);
      d.init(b, c, a);
      this.steamGens.push(d);
    }
    addLantern(a) {
      let b = a.x * this.scale;
      let c = a.y * this.scale;
      let d = a.candyCaptured;
      let e = new LanternEye(this);
      e.init(b, c);
      this.lanterns.push(e);
      e.applyMotion(a);
      if (d) {
        this.lanternCaught = true;
        this.mainCandy.container.setAlpha(0);
        e.startTeleport(this.mainGrab);
      }
    }
    addGap(a) {
      let b = a.x * this.scale;
      let c = a.y * this.scale;
      let d = a.angle;
      let e = a.radius;
      let f = a.activeTime;
      a = a.index;
      let g = new Gap(this, this.characterCtrl);
      g.index = a;
      g.init(new Vec2(b, c), d, e, f);
      this.characterCtrl.addChild(g, a);
    }
    addTransporter(a) {
      var b = a.x * this.scale;
      let c = a.y * this.scale;
      let d = a.angle;
      let e = a.width * this.scale;
      let f = a.length * this.scale;
      let g = a.velocity * this.scale;
      let h = a.direction == "forward" ? 1 : -1;
      a = a.type == "manual";
      b = ConveyorBelt.create(this, this.conveyorMgr.count(), b, c, f, e, -d, a, g * h);
      this.conveyorMgr.push(b);
    }
    incRopeCount() {
      this.ropesAlive += 1;
    }
    checkBubbleHit(a, b, c, d) {
      if (Rect.pointInside(b.x, b.y, a.x - 34, a.y - 34, 68, 68)) {
        if (c != null) {
          this.spawnBubblePop(a.x, a.y);
          this.onCut();
          b = 0;
          for (var e = this.ghosts; b < e.length;) {
            var f = e[b];
            ++b;
            if (f != null && f.attached == c) {
              f.canSwitch = true;
              f.setSlot(1);
            }
          }
        }
        d.show();
        c = false;
        b = 0;
        for (e = this.ghosts; b < e.length;) {
          f = e[b];
          ++b;
          if (f != null && f.attached == a) {
            f.canSwitch = false;
            c = true;
          }
        }
        if (c) {
          d.reattachBeeAnim();
        }
        SoundFx.play(SoundFx.bubble);
        a.pop();
        this.incRopeCount();
        return true;
      }
      return false;
    }
    syncCandyPos(a, b) {
      if (!this.fadeStarted) {
        b.x = a.g.x;
        b.y = a.g.y;
        b.updateBounds();
      }
    }
    tryEatCandy(a, b, c, d) {
      this.syncCandyPos(this.mainGrab, a);
      if (Entity.boundsOverlap(a, c)) {
        c.playEat();
        SoundFx.play(SoundFx.monster_chewing, true);
        if (b != null) {
          this.releaseGrab(b, false);
        }
        this.cutGrabbedRopes(d != null);
        a.alive = false;
        a.container.tween().xy(c.x, c.y + 10);
        a.container.tween().alpha(0, 0.1);
        a.container.tween().scale(0, 0.1, null, null, function () {
          a.free();
        });
        return true;
      } else {
        return false;
      }
    }
    applyLighterAnchor(a) {
      if (a != null && a.litBy != null) {
        var b = a.constraint;
        a.litBy.celebrateSprite.setVisible(true);
        a.litBy.celebrateSprite.anim().play(v167);
        var c = new Vec2(0, Sock.handleYRot);
        c.rotate(a.litBy.rotation * DEG2RAD);
        b.g.x = a.litBy.x;
        b.g.y = a.litBy.y;
        b.g.add(c);
        b.prev.copyFrom(b.g);
        b.velocity.x = 0;
        b.velocity.y = -1;
        b.velocity.rotate(a.litBy.rotation * DEG2RAD);
        b.velocity.multiply(a.bouncePower);
        b.delta.copyFrom(b.velocity);
        b.delta.div(60);
        b.prev.copyFrom(b.g);
        b.prev.sub(b.delta);
        a.litBy = null;
      }
    }
    cutGrabbedRopes(a) {
      let b = 0;
      let c = this.sockets.length;
      while (b < c) {
        let d = this.sockets[b++];
        let e = d.rope;
        if (e != null && (e.endPoint == this.mainGrab || e.endPoint == this.leftGrab && a || e.endPoint == this.rightGrab && !a)) {
          if (e.breakIndex == -1) {
            e.markBreakAt(e.points.length - 2);
            this.onCut();
          } else {
            e.skipReturnTrail = true;
          }
          if (d.hasSpider && d.spiderActive) {
            this.detachSpider(d);
          }
        }
      }
    }
    cutAttachedRopes(a) {
      if (a != null) {
        for (var b = 0, c = this.sockets; b < c.length;) {
          let d = c[b];
          ++b;
          if (d == null) {
            continue;
          }
          let e = d.rope;
          if (e != null && e.endPoint == a.constraint) {
            if (e.breakIndex == -1) {
              e.markBreakAt(e.points.length - 2);
            } else {
              e.skipReturnTrail = true;
            }
            if (d.hasSpider && d.spiderActive) {
              this.detachSpider(d);
            }
          }
        }
      }
    }
    onCut() {
      --this.ropesAlive;
      this.tutorialTimer = 0;
    }
    computeScore() {
      this.timeScore = Math.max(0, 30 - this.elapsedSec) * 100;
      this.timeScore = this.timeScore / 10 * 10;
      this.appleScore = this.apples * 1000;
      this.totalScore = Math.ceil(this.timeScore + this.appleScore);
    }
    onWin() {
      if (this.heldGrab != null) {
        this.releaseGrab(this.heldGrab, false);
      }
      this.computeScore();
      this.cutGrabbedRopes(false);
      this.clearAnims();
      let a = SoundFx.electric;
      this.delay(function () {
        SoundFx.stop(a);
      }, 1.5);
      this.scene.onLevelWon();
      this.delay((v10 = this.scene, cachedBind(v10, v10.fQ)), 1.8);
      this.characterCtrl.lock();
      if (this.magnetActive) {
        this.threeStarsEffect.free();
        this.threeStarsEffect = null;
      }
      if (this.telekinesisActive) {
        this.deactivateTelekinesis();
        this.telekinesisActive = false;
      }
    }
    onCandyLost() {
      if (!this.restarting) {
        this.omNom.playSurprised();
        SoundFx.play(SoundFx.monster_sad);
        if (this.magnetActive) {
          this.threeStarsEffect.free();
          this.threeStarsEffect = null;
        }
        this.clearAnims();
        this.scene.onLevelWonAlt();
        this.delay((v10 = this.scene, cachedBind(v10, v10.showLevelLost)), 1);
      }
    }
    checkCandyHit(a, b, c, d) {
      if (c.boundsOverlapsRect(a.x - 249.60000000000002, a.y - 249.60000000000002, a.x + 249.60000000000002, a.y + 249.60000000000002)) {
        var e = new Vec2(0, 0);
        let h = new Vec2(0, 0);
        c = new Vec2(c.x, c.y);
        var f = a.localBounds;
        f = f.right - f.left;
        var g = a.localBounds;
        g = g.bottom - g.top;
        e.x = a.x - f / 2;
        h.x = a.x + f / 2;
        e.y = h.y = a.y;
        if (a.angle != 0) {
          c.rotateAround(-a.angle, a.x, a.y);
        }
        if (c.y < e.y && Rect.overlapAABB(c.x - f / 2, c.y - g / 2, c.x + f / 2, c.y + g / 2, e.x, e.y - 249.60000000000002, h.x, h.y)) {
          e = new Vec2(0, -((249.60000000000002 - (e.y - c.y)) * 499.20000000000005 / 249.60000000000002));
          e.rotate(a.angle);
          b.applyImpulse(e, d);
        }
      }
    }
    handleBounce(a, b, c) {
      if (!a.bounceHandled && a.container != null) {
        var d = Vec2.diff(b.prev, b.g);
        var e = b.prev.clone();
        e.rotateAround(-a.angle, a.x, a.y);
        d = Math.max(d.length() * 40, 336) * (e.y < a.y ? -1 : 1);
        e = Vec2.perpCCW(Vec2.fromAngle(a.angle));
        e.multiply(d);
        b.g.rotateAround(-a.angle, a.x, a.y);
        b.prev.rotateAround(-a.angle, a.x, a.y);
        b.prev.y = b.g.y;
        b.g.rotateAround(a.angle, a.x, a.y);
        b.prev.rotateAround(a.angle, a.x, a.y);
        b.applyImpulse(e, c);
        a.playBounceAnim();
        SoundFx.play(SoundFx.bouncer);
      }
    }
    pumpActivate(a, b) {
      a.sprite.anim().play(Pump.SPRAY_KEYS);
      SoundFx.play([1035, 1034, 1033, 1032][X.randInt(0, 3)]);
      a.spawnSpray(this);
      if (!this.bothActive) {
        this.checkCandyHit(a, this.mainGrab, this.mainCandy, b);
      }
      if (this.candyMode != 2) {
        if (!this.leftSet) {
          this.checkCandyHit(a, this.leftGrab, this.leftCandy, b);
        }
        if (!this.rightSet) {
          this.checkCandyHit(a, this.rightGrab, this.rightCandy, b);
        }
      }
      let c = 0;
      let d = this.bouncerItems;
      while (c < d.length) {
        let e = d[c];
        ++c;
        this.checkCandyHit(a, e.constraint, e, b);
      }
    }
    handleSteamGen(a, b) {
      function c(u, A, D) {
        var B = 0;
        if (a.rotation == 0 && (q.gravityButton == null || q.gravityButton != null && q.gravityFlipped) || a.rotation == 180 && q.gravityButton != null && !q.gravityFlipped) {
          B = a.x - A.x;
          B = Math.abs(B) > 2.5 ? -D.x / f + B * 0.25 : Math.abs(D.x) < 1 ? -D.x : -D.x / f;
        }
        let K = -34 / u.weight;
        if (a.rotation != 0 && (q.gravityButton == null || q.gravityButton != null && q.gravityFlipped) || a.rotation != 180 && q.gravityButton != null && !q.gravityFlipped) {
          f *= 15;
          K = a.rotation == 90 || a.rotation == 270 ? K / 4 : K / 2;
        }
        D = new Vec2(B, -D.y / f + K);
        A = a.y - A.y;
        if (A > h + 17.5) {
          D.multiply(Math.exp((A - (h + 17.5)) * -2));
        }
        D.rotate(g);
        u.applyImpulse(D, b);
      }
      function d() {
        let u = 0;
        let A = q.bouncerItems;
        while (u < A.length) {
          let D = A[u];
          ++u;
          if (D != null) {
            D.bounceHandled = false;
          }
        }
      }
      function e(u, A, D) {
        A.rotateAround(-g, a.x, a.y);
        D.rotate(-g);
        return Rect.overlapAABB(A.x - 17.5, A.y - 8.75, A.x + 17.5, A.y + 17.5, m.x, m.y, n.x, n.y);
      }
      let f = 5;
      let g = a.rotation * DEG2RAD;
      let h = a.puffSinusoidalOffset();
      let m = new Vec2(a.x - 5, a.y - h - 1);
      let n = new Vec2(a.x + 5, a.y - 17.5);
      let q = this;
      if (this.candyMode == 2) {
        var p = this.mainGrab.g.clone();
        var v = this.mainGrab.velocity.clone();
        if (e(this.mainGrab, p, v)) {
          d();
          c(this.mainGrab, p, v);
        }
      } else {
        p = this.leftGrab.g.clone();
        v = this.leftGrab.velocity.clone();
        if (e(this.leftGrab, p, v)) {
          d();
          c(this.leftGrab, p, v);
        }
        p = this.rightGrab.g.clone();
        v = this.rightGrab.velocity.clone();
        if (e(this.rightGrab, p, v)) {
          d();
          c(this.rightGrab, p, v);
        }
      }
      p = 0;
      for (v = this.bouncerItems; p < v.length;) {
        let u = v[p];
        ++p;
        let A = u.constraint.g.clone();
        let D = u.constraint.velocity.clone();
        if (e(u.constraint, A, D)) {
          d();
          c(u.constraint, A, D);
        }
      }
    }
    cutRopeAlong(a, b, c) {
      let d = 0;
      let e = this.sockets.length;
      while (d < e) {
        let f = this.sockets[d++];
        let g = f.rope;
        if (g == null || g.breakIndex != -1) {
          continue;
        }
        let h = g.points.length - 1;
        let m = 0;
        while (m < h) {
          let n = m++;
          let q = g.points[n];
          let p = g.points[n + 1];
          if (f.Zf && Rect.lineIntersect(a.x, a.y, b.x, b.y, f.x - 44, f.y - 44, 88, 88) ? 0 : MathUtil.aP(a.x, a.y, b.x, b.y, q.g.x, q.g.y, p.g.x, p.g.y)) {
            if (f.hasSpider && f.spiderActive) {
              this.detachSpider(f);
            }
            SoundFx.play([1030, 1029, 1028, 1027][g.Fw]);
            g.markBreakAt(n);
            this.onCut();
            if (c) {
              g.breakDelay = 0;
              g.severAt(n);
            }
            return 1;
          }
        }
      }
      return 0;
    }
    detachSpider(a) {
      SoundFx.play(SoundFx.spider_fall);
      a.hasSpider = false;
      a.spider.startFall();
    }
    spiderWin(a) {
      SoundFx.play(SoundFx.spider_win);
      let b = 0;
      let c = this.sockets;
      while (b < c.length) {
        let d = c[b];
        ++b;
        let e = d.rope;
        if (e != null && e.endPoint == this.mainGrab) {
          if (e.breakIndex != -1) {
            d.detachRope();
          } else {
            e.markBreakAt(e.points.length - 2);
            this.onCut();
            e.alive = false;
          }
          if (d.hasSpider && d.spiderActive && a != d) {
            this.detachSpider(d);
          }
        }
      }
      a.hasSpider = false;
      this.bothActive = this.fadeStarted = true;
      a.spider.startWin();
      if (!this.restarting) {
        this.delay(cachedBind(this, this.onCandyLost), 2);
      }
    }
    releaseGrab(a, b) {
      for (var c = 0, d = this.ghosts; c < d.length;) {
        var e = d[c];
        ++c;
        if (e != null) {
          if (e.attached == a) {
            e.canSwitch = true;
            e.setSlot(1);
          }
          if (this.heldGrab == a && this.linkRightActive && e.attached == this.rightRope) {
            e.canSwitch = true;
            e.setSlot(1);
            this.rightRope = null;
            this.linkRightActive = false;
          }
        }
      }
      c = 0;
      for (d = this.bouncerItems; c < d.length;) {
        e = d[c];
        ++c;
        if (e.attached != null && e.attached == a) {
          e.attached = null;
          e.Gn.hide();
          this.spawnBubblePop(e.x, e.y);
          return;
        }
      }
      if (this.candyMode != 2) {
        if (b) {
          this.leftRope = null;
          this.leftBubble.hide();
          this.spawnBubblePop(this.leftCandy.x, this.leftCandy.y);
        } else {
          this.rightRope = null;
          this.rightBubble.hide();
          this.spawnBubblePop(this.rightCandy.x, this.rightCandy.y);
        }
      } else {
        this.heldGrab = null;
        this.anchorBubble.hide();
        this.spawnBubblePop(this.mainCandy.x, this.mainCandy.y);
      }
      this.onCut();
    }
    spawnBubblePop(a, b) {
      SoundFx.play(SoundFx.bubble_break);
      let c = new Sprite(null, Resources.ca, Keys.ZG);
      c.setX(a);
      c.setY(b);
      c.center();
      c.setUniformScale(0.4);
      this.root.appendChild(c.node);
      c.anim().play(Character.IDLE_ANIM).onComplete(function () {
        c.free();
      });
    }
    tryReleaseDrag(a, b, c, d) {
      if (Rect.pointInside(c, d, b.g.x - 24, b.g.y - 24, 60, 60)) {
        this.releaseGrab(a, b == this.leftGrab);
        return true;
      } else {
        return false;
      }
    }
    screenToWorld(a) {
      var b = this.app.window;
      var c = b.renderer.viewport;
      var d = b.canvasSize.x;
      b = b.canvasSize.y;
      d = -1 + (a.x - (c.x * d | 0)) * 2 / (c.w * d | 0);
      a = -1 + ((c.y * b | 0) - a.y) * 2 / (c.h * b | 0);
      c = this.camera.camera.screenToWorldM;
      return new Vec4(c.m11 * d + c.m12 * a + c.m14, c.m21 * d + c.m22 * a + c.m24, 0, 1);
    }
    onTouchPress(a, b) {
      var c = this.screenToWorld(a);
      a = c.x;
      c = c.y;
      if (this.starsFrozen) {
        this.clickWhileFrozen = true;
      } else if (!(b >= 5)) {
        if (this.gravityButton != null && this.gravityButton.containsPoint(a, c)) {
          this.activeGravityTouch = b;
        } else if ((!this.characterCtrl.hasGrab() || !this.characterCtrl.tryClickAt(a, c, b)) && (this.heldGrab == null || !this.tryReleaseDrag(this.heldGrab, this.mainGrab, a, c)) && (this.candyMode == 2 || (this.leftRope == null || !this.tryReleaseDrag(this.leftRope, this.leftGrab, a, c)) && (this.rightRope == null || !this.tryReleaseDrag(this.rightRope, this.rightGrab, a, c)))) {
          for (var d = 0, e = this.bouncerItems; d < e.length;) {
            var f = e[d];
            ++d;
            if (f.attached != null && this.tryReleaseDrag(f.attached, f.constraint, a, c)) {
              return;
            }
          }
          d = new Vec2(a, c);
          if (!this.touchActive[b]) {
            this.touchPos[b].copyFrom(d);
            this.touchPrev[b].copyFrom(d);
          }
          d = 0;
          for (e = this.electrics; d < e.length;) {
            f = e[d];
            ++d;
            if (f.button != null && f.touchId == -1 && f.button.tryPressDown(a, c)) {
              f.touchId = b;
              return;
            }
          }
          d = false;
          e = 0;
          for (f = this.pumps; e < f.length;) {
            var g = f[e];
            ++e;
            if (g.boundsContainsPoint(a, c)) {
              g.Gp = 0.05;
              g.VE = b;
              if (!g.isOwned()) {
                d = true;
              }
              break;
            }
          }
          if (!d) {
            d = 0;
            for (e = this.steamGens; d < e.length;) {
              if (e[d++].tryClickAt(a, c, b)) {
                return;
              }
            }
            var h = this;
            d = 0;
            for (e = this.lanterns; d < e.length;) {
              f = e[d];
              ++d;
              if (f != null && f.tryClickAt(a, c, b)) {
                this.delay(function () {
                  h.sh = false;
                  h.mainCandy.alive = true;
                  h.mainCandy.container.setAlpha(1);
                  h.mainCandy.container.setUniformScale(0.71);
                }, 0.1);
                return;
              }
            }
            var m = 0;
            for (d = this.vinyls.length; m < d;) {
              e = this.vinyls[m];
              f = Vec2.distance(a, c, e.leftHandle.x, e.leftHandle.y);
              g = Vec2.distance(a, c, e.rightHandle.x, e.rightHandle.y);
              if (f < LevelController.HANDLE_HIT && !e.isOneHandle() || g < LevelController.HANDLE_HIT) {
                for (m += 1; m < d;) {
                  ++m;
                }
                e.Do.x = a;
                e.Do.y = c;
                e.activeTouchId = b;
                if (f < LevelController.HANDLE_HIT) {
                  e.setLeftHighlight(true);
                }
                if (g < LevelController.HANDLE_HIT) {
                  e.setRightHighlight(true);
                }
                return;
              }
              ++m;
            }
            d = 0;
            for (e = this.sockets; d < e.length;) {
              f = e[d];
              ++d;
              if (f.Zf && Rect.pointInside(a, c, f.x - 44, f.y - 44, 88, 88)) {
                f.setLastTouch(a, c);
                f.Xm = b;
                return;
              }
              if (f.Hf > 0 && Rect.pointInside(a, c, f.x - 26, f.y - 26, 52, 52)) {
                f.im = b;
                return;
              }
            }
            d = 0;
            for (e = this.ghosts; d < e.length;) {
              f = e[d];
              ++d;
              if (f != null && f.tryPressDown(a, c)) {
                return;
              }
            }
            if (!this.conveyorMgr.onTouchPress(a, c, b)) {
              this.touchActive[b] = true;
            }
          }
        }
      }
    }
    onTouchRelease(a, b) {
      var c = this.screenToWorld(a);
      a = c.x;
      c = c.y;
      if (!this.starsFrozen) {
        this.touchActive[b] = false;
        if (this.gravityButton != null && this.activeGravityTouch == b) {
          if (this.gravityButton.containsPoint(a, c)) {
            this.gravityButton.toggle();
            if (LevelState.box == 8) {
              this.background.toggleEarth();
            }
            this.onGravityClick(0);
          }
          this.activeGravityTouch = -1;
        }
        for (var d = 0, e = this.electrics; d < e.length;) {
          var f = e[d];
          ++d;
          if (f.button != null && f.touchId == b && (f.touchId = -1, f.button.tryReleaseUp(a, c))) {
            return;
          }
        }
        d = 0;
        for (e = this.vinyls; d < e.length;) {
          f = e[d];
          ++d;
          if (f.activeTouchId == b) {
            f.activeTouchId = -1;
            f.xx = -1;
            f.setLeftHighlight(false);
            f.setRightHighlight(false);
          }
        }
        d = 0;
        for (e = this.steamGens; d < e.length;) {
          if (e[d++].onTouchEnd(b)) {
            return;
          }
        }
        d = 0;
        for (e = this.sockets; d < e.length;) {
          f = e[d];
          ++d;
          if (f.Zf && f.Xm == b) {
            f.Xm = -1;
          }
          if (f.Hf > 0 && f.im == b) {
            f.im = -1;
          }
        }
        if (b == 0 && this.telekinesisActive) {
          this.omNom.playNight();
          this.magnetEffect.setEnabled(false);
        }
        this.conveyorMgr.onTouchRelease(a, c, b);
      }
    }
    onTouchMove(a, b) {
      a = this.screenToWorld(a);
      var c = a.x;
      var d = a.y;
      if (!this.starsFrozen && !(b >= 5)) {
        a = new Vec2(c, d);
        if (this.touchPos[b].distTo(a) > 10) {
          for (var e = 0, f = this.pumps; e < f.length;) {
            var g = f[e];
            ++e;
            if (g.VE == b && g.Gp != 0) {
              g.Gp = 0;
            }
          }
        }
        this.scrollVec.copyFrom(a);
        f = 0;
        for (g = this.vinyls; f < g.length;) {
          e = g[f];
          ++f;
          if (e.activeTouchId == b) {
            b = new Vec2(e.x, e.y);
            if (b.distTo(a) < e.diameter / 10) {
              e.Do.copyFrom(a);
            }
            c = Vec2.diff(e.Do, b);
            c = Vec2.diff(a, b).direction() - c.direction();
            if (c > Math.PI) {
              c -= Math.PI * 2;
            } else if (c < -Math.PI) {
              c += Math.PI * 2;
            }
            e.leftHandle.rotateAround(c, e.x, e.y);
            e.rightHandle.rotateAround(c, e.x, e.y);
            e.rotation += c * RAD2DEG;
            d = c > 0 ? SoundFx.scratch_in : SoundFx.scratch_out;
            if (Math.abs(c) < 0.07) {
              d = -1;
            }
            if (e.xx != d && d != -1) {
              SoundFx.play(d);
              e.xx = d;
            }
            d = 0;
            for (f = this.sockets; d < f.length;) {
              g = f[d];
              ++d;
              var h = new Vec2(g.x, g.y);
              if (h.distTo(b) <= e.diameter + this.scale * 5) {
                h.rotateAround(c, e.x, e.y);
                g.x = h.x;
                g.y = h.y;
                if (g.rope != null) {
                  g.rope.startPoint.g.copyFrom(h);
                  g.rope.startPoint.pinPos.copyFrom(h);
                }
              }
            }
            d = 0;
            for (f = this.pumps; d < f.length;) {
              g = f[d];
              ++d;
              h = new Vec2(g.x, g.y);
              if (h.distTo(b) <= e.diameter + this.scale * 5) {
                h.rotateAround(c, e.x, e.y);
                g.x = h.x;
                g.y = h.y;
                g.rotation += c * RAD2DEG;
                g.updateEnds();
              }
            }
            d = 0;
            for (f = this.bubbles; d < f.length;) {
              g = f[d];
              ++d;
              h = new Vec2(g.x, g.y);
              if (h.distTo(b) <= e.diameter + this.scale * 10 && g != this.heldGrab && g != this.rightRope && g != this.leftRope) {
                h.rotateAround(c, e.x, e.y);
                g.x = h.x;
                g.y = h.y;
              }
            }
            if (Rect.pointInside(this.omNom.x, this.omNom.y, e.x - e.size, e.y - e.size, e.size * 2, e.size * 2)) {
              b = new Vec2(this.omNom.x, this.omNom.y);
              b.rotateAround(c, e.x, e.y);
              this.omNom.x = b.x;
              this.omNom.y = b.y;
            }
            e.Do.copyFrom(a);
            return;
          }
        }
        e = 0;
        for (f = this.steamGens; e < f.length;) {
          if (f[e++].rQ(c, d, b)) {
            return;
          }
        }
        f = 0;
        for (g = this.sockets; f < g.length;) {
          e = g[f];
          ++f;
          if (e != null) {
            if (e.Zf && e.Xm == b) {
              e.onWheelDrag(a);
              return;
            }
            if (e.Hf > 0 && e.im == b) {
              if (e.jw) {
                e.y = MathUtil.clamp(a.y, e.gm, e.dm);
              } else {
                e.x = MathUtil.clamp(a.x, e.gm, e.dm);
              }
              if (e.rope != null) {
                a = e.rope.startPoint;
                a.g.x = a.pinPos.x = e.x;
                a.g.y = a.pinPos.y = e.y;
              }
              return;
            }
          }
        }
        e = false;
        if (this.conveyorMgr.onTouchMove(c, d, b)) {
          e = true;
        }
        if (this.touchActive[b]) {
          c = new Vec2(0, 0);
          f = new ColoredSegment(Vec2.sum(this.touchPos[b], c), Vec2.sum(a, c), 5, 5, RGBA.WHITE.clone());
          c = this.particleTypes[b];
          d = 0;
          if (!e) {
            c.push(f);
            e = 0;
            while (e < c.length) {
              f = c[e];
              ++e;
              d += this.cutRopeAlong(f.start, f.end, false);
            }
          }
          this.touchPrev[b].copyFrom(this.touchPos[b]);
          this.touchPos[b].copyFrom(a);
        }
      }
    }
    resetScroll() {
      this.scrollCenter = new Vec4(0, 0, 0, 1);
      this.scrollTarget = new Vec4(0, 0, 0, 1);
      this.cameraPos = new Vec4(0, 0, 0, 1);
      this.scrollState = 0;
      var a = this.camera.bounds;
      var b = this.scrollCenter;
      b.x = (a.left + a.right) / 2;
      b.y = (a.top + a.bottom) / 2;
      if (this.scrollDir.x != 0 || this.scrollDir.y != 0) {
        this.scrollState = 1;
      }
      if (this.scrollDir.x > 0) {
        b = this.scrollTarget;
        b.x = (a.left + a.right) / 2 + (a.right - a.left);
        b.y = (a.top + a.bottom) / 2;
      } else if (this.scrollDir.x < 0) {
        b = this.scrollTarget;
        b.x = (a.left + a.right) / 2 - (a.right - a.left);
        b.y = (a.top + a.bottom) / 2;
      }
      if (this.scrollDir.y > 0) {
        b = this.scrollTarget;
        var c = this.scrollCenter;
        b.x = c.x + 0;
        b.y = c.y + (a.bottom - a.top);
      } else if (this.scrollDir.y < 0) {
        b = this.scrollTarget;
        c = this.scrollCenter;
        b.x = c.x - 0;
        b.y = c.y - (a.bottom - a.top);
      }
      if (this.scrollState == 1) {
        this.scrollTimer = -0.5;
        this.starsFrozen = true;
        a = this.camera.target;
        b = this.scrollCenter;
        a.x = b.x;
        a.y = b.y;
      }
      this.camera.update();
      this.flightWarning = this.candyMode != 2 ? this.isGrabFlying(this.leftGrab) || this.isGrabFlying(this.rightGrab) : this.isGrabFlying(this.mainGrab);
      if (this.nightMode) {
        a = 0;
        b = this.bouncerItems;
        while (a < b.length) {
          if (this.isGrabFlying(b[a++].constraint)) {
            this.flightWarning = true;
            break;
          }
        }
      }
    }
    isGrabFlying(a) {
      return !this.camera.isOnScreen(a.g.x, a.g.y);
    }
    isObjectExcluded(a) {
      return Save.language != a.locale;
    }
    onGravityClick() {
      PhysicsConfig.toggle();
      this.gravityFlipped = PhysicsConfig.isNormal();
      SoundFx.play(this.gravityFlipped ? SoundFx.gravity_off : SoundFx.gravity_on);
    }
    onElectricToggle(a) {
      let b = 0;
      let c = this.electrics;
      while (b < c.length) {
        let d = c[b];
        ++b;
        if (d.toggleValue == a) {
          d.toggleRotation();
        }
      }
    }
    tryBounce(a, b, c) {
      let d = Vec2.diff(a.g, b.g).length();
      if (d < c) {
        if (c - d < 1000 / (a.velocity.length() + b.velocity.length()) * 2) {
          var e = Math.acos(Vec2.normalized(a.g.x > b.g.x ? Vec2.diff(a.g, b.g) : Vec2.diff(b.g, a.g)).x);
          var f = Math.abs((c - d) / 2 * Math.cos(e));
          c = Math.abs((c - d) / 2 * Math.sin(e));
          if (a.g.x <= b.g.x) {
            a.g.x -= f;
            b.g.x += f;
          } else {
            b.g.x -= f;
            a.g.x += f;
          }
          if (a.g.y <= b.g.y) {
            a.g.y -= c;
            b.g.y += c;
          } else {
            b.g.y -= c;
            a.g.y += c;
          }
        } else {
          var g = Vec2.diff(b.g, a.g);
          var h = -g.y;
          var m = g.x;
          f = (a.velocity.x * g.x + a.velocity.y * g.y) / c;
          e = (a.velocity.x * h + a.velocity.y * m) / c;
          h = (b.velocity.x * h + a.velocity.x * m) / c;
          m = f;
          f = (b.velocity.x * g.x + a.velocity.x * g.y) / c;
          let n = g.x / c;
          g = g.y / c;
          a.velocity = new Vec2(f * n - e * g, f * g + e * n);
          b.velocity = new Vec2(m * n - h * g, m * g + h * n);
          e = Math.acos(Vec2.normalized(a.g.x > b.g.x ? Vec2.diff(a.g, b.g) : Vec2.diff(b.g, a.g)).x);
          f = Math.abs((c - d) / 2 * Math.cos(e));
          c = Math.abs((c - d) / 2 * Math.sin(e));
          if (a.g.x <= b.g.x) {
            a.g.x -= f;
            b.g.x += f;
          } else {
            b.g.x -= f;
            a.g.x += f;
          }
          if (a.g.y <= b.g.y) {
            a.g.y -= c;
            b.g.y += c;
          } else {
            b.g.y -= c;
            a.g.y += c;
          }
          a.delta = Vec2.divided(a.velocity, 60);
          a.prev = Vec2.diff(a.g, a.delta);
          b.delta = Vec2.divided(b.velocity, 60);
          b.prev = Vec2.diff(b.g, b.delta);
        }
      }
    }
    triggerSpecial(a) {
      if (this.special == a) {
        for (var b = this.special = 0, c = this.tutorials; b < c.length;) {
          var d = c[b];
          ++b;
          if (d != null) {
            if (d.special == a) {
              d.show();
            } else {
              d.hide();
            }
          }
        }
        b = 0;
        for (c = this.tutorialPics; b < c.length;) {
          d = c[b];
          ++b;
          if (d != null) {
            if (d.special == a) {
              d.show();
            } else {
              d.hide();
            }
          }
        }
      }
    }
    update(a) {
      function b(w) {
        w.applyImpulse(new Vec2(-w.velocity.x / v46, -w.velocity.y / v46 + v45), a);
      }
      function c(w, H, I) {
        let R = H.x;
        H = H.y;
        let L = w.leftEnd;
        let N = w.rightEnd;
        let O = w.Vc;
        w = w.qd;
        if (Rect.lineIntersect(L.x + R, L.y + H, N.x + R, N.y + H, I.g.x - 16, I.g.y - 16, 32, 32)) {
          return true;
        } else {
          return Rect.lineIntersect(O.x + R, O.y + H, w.x + R, w.y + H, I.g.x - 16, I.g.y - 16, 32, 32);
        }
      }
      function d(w, H) {
        if (Rect.lineIntersect(w.leftEnd.x, w.leftEnd.y, w.rightEnd.x, w.rightEnd.y, H.g.x - 6, H.g.y - 6, 12, 12)) {
          return true;
        } else {
          return Rect.lineIntersect(w.Vc.x, w.Vc.y, w.qd.x, w.qd.y, H.g.x - 6, H.g.y - 6, 12, 12);
        }
      }
      super.update(a);
      let e = 0;
      let f = this.delayedCalls;
      while (e < f.length) {
        f[e++].update(a);
      }
      let g = this.swarm;
      if (g != null) {
        g.update(a);
      }
      let h = 0;
      while (h < 5) {
        let w = this.particleTypes[h++];
        let H = w.length;
        let I = 0;
        while (I < H) {
          let R = w[I];
          let L = PathResolver.rampTowardStep(R.color.a, 0, 10, a);
          R.color.a = L.value;
          if (L.reached) {
            w.splice(I, 1);
            --H;
          } else {
            ++I;
          }
        }
      }
      if (this.ropesAlive == 0) {
        this.tutorialTimer += a;
        if (this.tutorialTimer > 30) {
          this.tutorialTimer = 0;
        }
      }
      let m = this.levelW / this.levelH;
      let n = this.app.window.viewportRect();
      let q = n.w / n.h;
      let p = m > 1 && q > 1 && q > m;
      switch (this.scrollState) {
        case 0:
          this.elapsedSec += a;
          break;
        case 1:
          this.scrollTimer += a * (this.clickWhileFrozen ? 3 : 1);
          let w = 0;
          if (this.scrollTimer >= 0) {
            w = Math.min(1, this.scrollTimer / 2);
          }
          let H = Easing.quadInOut()(w);
          let I = this.scrollCenter;
          let R = this.scrollTarget;
          let L = new Vec4(I.x + (R.x - I.x) * H, I.y + (R.y - I.y) * H, 0, 1);
          if (p) {
            L = new Vec4(this.levelW / 2, this.levelH / 2, 0, 1);
            w = 1;
            this.camera.pivotBias.x = 0.5;
            this.camera.pivotBias.y = 0.5;
          } else {
            if (this.scrollDir.x > 0) {
              this.camera.pivotBias.x = H;
            }
            if (this.scrollDir.x < 0) {
              this.camera.pivotBias.x = 1 - H;
            }
            if (this.scrollDir.y > 0) {
              this.camera.pivotBias.y = H;
            }
            if (this.scrollDir.y < 0) {
              this.camera.pivotBias.y = 1 - H;
            }
          }
          let N = this.camera.target;
          N.x = L.x;
          N.y = L.y;
          if (w == 1) {
            this.clickWhileFrozen = this.starsFrozen = false;
            this.scrollState = 2;
            this.lerpT = 0;
            let G = this.cameraPos;
            G.x = this.scrollTarget.x;
            G.y = this.scrollTarget.y;
          }
          break;
        case 2:
          this.elapsedSec += a;
          let O = this.candyMode != 2 ? this.leftGrab : this.mainGrab;
          this.lerpT += 0.05;
          if (this.lerpT > 1) {
            this.lerpT = 1;
          }
          if (p) {
            let G = this.camera.pivotBias;
            G.x = 0.5;
            G.y = 0.5;
            let T = this.camera.target;
            T.x = this.levelW / 2;
            T.y = this.levelH / 2;
          } else {
            if (this.scrollDir.x != 0) {
              let G = this.camera.distToHorizontalEdge(O.g.x, O.g.y);
              if (G < 100) {
                G = 100;
              } else if (G > 300) {
                G = 300;
              }
              if (G <= 100) {
                this.lerpT = 1;
              }
              this.cameraPos.x += (O.g.x - this.cameraPos.x) * remap(G, 100, 300, 0.5, 0.1) * this.lerpT;
              let T = Math.min(this.scrollCenter.x, this.scrollTarget.x);
              let v12 = Math.max(this.scrollCenter.x, this.scrollTarget.x);
              if (this.cameraPos.x < T) {
                this.cameraPos.x = T;
              }
              if (this.cameraPos.x > v12) {
                this.cameraPos.x = v12;
              }
              this.camera.target.x = this.cameraPos.x;
              this.camera.pivotBias.x = remap(this.cameraPos.x, T, v12, 0, 1);
            }
            if (this.scrollDir.y != 0) {
              let G = this.camera.distToVerticalEdge(O.g.x, O.g.y);
              if (G <= 100) {
                this.lerpT = 1;
              }
              if (G < 100) {
                G = 100;
              } else if (G > 300) {
                G = 300;
              }
              this.cameraPos.y += (O.g.y - this.cameraPos.y) * remap(G, 100, 300, 0.5, 0.1) * this.lerpT;
              let T = Math.min(this.scrollCenter.y, this.scrollTarget.y);
              let v13 = Math.max(this.scrollCenter.y, this.scrollTarget.y);
              if (this.cameraPos.y < T) {
                this.cameraPos.y = T;
              }
              if (this.cameraPos.y > v13) {
                this.cameraPos.y = v13;
              }
              this.camera.target.y = this.cameraPos.y;
              this.camera.pivotBias.y = remap(this.cameraPos.y, T, v13, 0, 1);
            }
          }
      }
      this.camera.update();
      let v = this.sockets.length;
      let u = this;
      if (v > 0) {
        let w = false;
        let H = false;
        let I = false;
        let R = 0;
        let L = this.bouncerItems;
        while (R < L.length) {
          L[R++].skipSpin = true;
        }
        let N = 0;
        while (N < v) {
          let O = this.sockets[N++];
          if (O == null) {
            continue;
          }
          O.update(a);
          let G = O.rope;
          if (this.characterCtrl.hasGrab() && G != null && G.breakIndex == -1) {
            this.cutGrabbedRopes(true);
          } else {
            if (O.motion != null && G != null) {
              G.startPoint.g.x = O.x;
              G.startPoint.g.y = O.y;
              G.startPoint.pinPos.copyFrom(G.startPoint.g);
            }
            if (G != null) {
              if (G.breakIndex != -1 && G.breakDelay == 0) {
                O.detachRope();
                continue;
              }
              G.update(a * this.ropeSpeed);
              if (O.hasSpider) {
                if (this.scrollState != 1 && !this.starsFrozen) {
                  O.updateSpider(a);
                }
                if (O.Gk == -1) {
                  this.spiderWin(O);
                }
              }
            }
            if (O.radius != -1 && O.rope == null) {
              let T = function (W, p20) {
                if (new Vec2(p20.x, p20.y).distTo(W.g) <= p20.radius + Star.radius) {
                  W = new Rope(u.layer(6), null, p20.x, p20.y, W, W.g.x, W.g.y, p20.radius + Star.radius);
                  W.startPoint.pinPos.copyFrom(W.startPoint.g);
                  p20.po = true;
                  p20.attachRope(W);
                  SoundFx.play(SoundFx.rope_get);
                  if (p20.motion != null) {
                    SoundFx.play(SoundFx.buzz);
                  }
                  return true;
                } else {
                  return false;
                }
              };
              if (this.candyMode != 2) {
                if (!this.leftSet) {
                  if (T(this.leftGrab, O)) {
                    this.incRopeCount();
                  }
                }
                if (!this.rightSet && O.rope == null) {
                  if (T(this.rightGrab, O)) {
                    this.incRopeCount();
                  }
                }
              } else if (T(this.mainGrab, O)) {
                this.incRopeCount();
              }
              let vLN04 = 0;
              let v14 = this.bouncerItems;
              while (vLN04 < v14.length) {
                T(v14[vLN04++].constraint, O);
              }
            }
            if (G != null) {
              let T = G.points[G.points.length - 1];
              let v15 = false;
              if (!w) {
                if (this.candyMode != 2) {
                  if (T != this.leftGrab || this.leftSet || H) {
                    if (T == this.rightGrab && !this.rightSet && !I) {
                      v15 = true;
                    }
                  } else {
                    v15 = true;
                  }
                } else if (!this.bothActive && !w) {
                  v15 = true;
                }
              }
              if (G.Fw != 0 && G.breakIndex == -1 && v15) {
                let v16 = Vec2.diff(G.startPoint.g, T.g).direction() * RAD2DEG;
                if (this.candyMode != 2) {
                  let W = T == this.leftGrab ? this.leftCandy : this.rightCandy;
                  if (!G.severed) {
                    G.rotationOffset = W.rotation - v16;
                  }
                  if (T == this.leftGrab) {
                    this.combinedPivotY = v16 + G.rotationOffset - W.rotation;
                    H = true;
                  } else {
                    this.combinedPivotX = v16 + G.rotationOffset - W.rotation;
                    I = true;
                  }
                  this.mainCandy.rotation = v16 + G.rotationOffset;
                  W.rotation = v16 + G.rotationOffset;
                } else {
                  if (!G.severed) {
                    G.rotationOffset = this.mainCandy.rotation - v16;
                  }
                  this.mainCandy.angularVel = v16 + G.rotationOffset - this.mainCandy.rotation;
                  this.mainCandy.rotation = v16 + G.rotationOffset;
                  w = true;
                }
                G.severed = true;
              } else {
                G.severed = false;
              }
            }
          }
        }
        if (this.candyMode != 2) {
          if (!H && !this.leftSet) {
            this.leftCandy.rotation += Math.min(5, this.combinedPivotY);
            this.combinedPivotY *= 0.98;
          }
          if (!I && !this.rightSet) {
            this.rightCandy.rotation += Math.min(5, this.combinedPivotX);
            this.combinedPivotX *= 0.98;
          }
        } else if (!w && !this.bothActive) {
          this.mainCandy.rotation += Math.min(5, this.mainCandy.angularVel);
          this.mainCandy.angularVel *= 0.98;
        }
      }
      let A = 0;
      let D = this.bouncerItems;
      while (A < D.length) {
        let w = D[A];
        ++A;
        if (!w.skipSpin) {
          w.rotation += Math.min(5, w.angularVel);
          w.angularVel *= 0.98;
        }
      }
      if (this.nightMode) {
        let w = 0;
        let H = this.bouncerItems;
        while (w < H.length) {
          let L = H[w];
          ++w;
          let N = L.constraint;
          if (!this.telekinesisActive) {
            if (Vec2.distance(N.g.x, N.g.y, this.omNom.x, this.omNom.y) < L.litRadius) {
              this.omNom.setLit(true);
            } else {
              this.omNom.setLit(false);
            }
            let O = 0;
            let G = this.stars;
            while (O < G.length) {
              let T = G[O];
              ++O;
              T.setLit(Vec2.distance(N.g.x, N.g.y, T.x, T.y) < L.litRadius);
            }
          }
        }
        let I = 0;
        let R = this.bouncerItems;
        while (I < R.length) {
          let L = R[I];
          ++I;
          if (L.litBy != null) {
            continue;
          }
          let N = Star.radius * 2;
          if (this.candyMode == 2) {
            if (!this.bothActive && this.mainCandy.litBy == null) {
              this.tryBounce(L.constraint, this.mainGrab, N);
            }
          }
          let O = 0;
          let G = this.bouncerItems;
          while (O < G.length) {
            let T = G[O];
            ++O;
            if (L != T && T.litBy == null) {
              this.tryBounce(L.constraint, T.constraint, N);
            }
          }
        }
      }
      if (a > 0) {
        let w = a;
        while (w >= 0) {
          w -= 0.01;
          this.conveyorMgr.update(Math.min(0.01, w));
          this.conveyorMgr.checkAll(this.bubbles);
          this.conveyorMgr.checkAll(this.stars);
          this.conveyorMgr.checkAll(this.bouncers);
          this.conveyorMgr.checkAll(this.socks);
          this.conveyorMgr.checkAll(this.steamGens);
          this.conveyorMgr.checkAll(this.pumps);
        }
      }
      if (!this.bothActive) {
        this.mainCandy.update(a);
        this.startDelay -= a;
        if (this.startDelay <= 0) {
          if (!this.characterCtrl.hasGrab()) {
            this.mainGrab.update(a * this.ropeSpeed);
          }
        }
      }
      if (this.candyMode != 2) {
        let w = a * this.ropeSpeed;
        this.startDelay -= a;
        this.leftCandy.update(a);
        if (this.startDelay <= 0) {
          this.leftGrab.update(w);
        }
        this.rightCandy.update(a);
        if (this.startDelay <= 0) {
          this.rightGrab.update(w);
        }
        if (this.candyMode == 1) {
          let H = 0;
          while (H < 30) {
            ++H;
            this.leftGrab.applyConstraints();
            this.rightGrab.applyConstraints();
          }
        }
        if (this.linkDistance > 0) {
          let H = PathResolver.rampTowardStep(this.linkDistance, 0, 200, a);
          this.linkDistance = H.value;
          if (H.reached) {
            SoundFx.play(SoundFx.candy_link);
            this.candyMode = 2;
            this.bothActive = false;
            this.rightSet = this.leftSet = true;
            let I = false;
            let R = false;
            let L = 0;
            let N = this.ghosts;
            while (L < N.length) {
              let v17 = N[L];
              ++L;
              if (v17 != null) {
                if (this.leftRope != null && v17.attached == this.leftRope) {
                  I = true;
                }
                if (this.rightRope != null && v17.attached == this.rightRope) {
                  R = true;
                }
              }
            }
            if (this.leftRope != null && this.rightRope != null && I && R) {
              this.linkRightActive = true;
            } else if (this.leftRope == null || !I) {
              if (this.rightRope == null || !R) {
                if (this.leftRope != null || this.rightRope != null) {
                  let vLN05 = 0;
                  let v18 = this.ghosts;
                  while (vLN05 < v18.length) {
                    let v19 = v18[vLN05];
                    ++vLN05;
                    if (v19 != null) {
                      if (this.leftRope != null && v19.attached == this.leftRope) {
                        v19.canSwitch = true;
                        v19.setSlot(1);
                      }
                      if (this.rightRope != null && v19.attached == this.rightRope) {
                        v19.canSwitch = true;
                        v19.setSlot(1);
                      }
                    }
                  }
                }
              }
            }
            if (this.leftRope != null || this.rightRope != null) {
              this.heldGrab = this.leftRope ?? this.rightRope;
              this.anchorBubble.show();
              this.leftBubble.hide();
              this.rightBubble.hide();
            }
            this.combinedPivotX = this.combinedPivotY = this.mainCandy.angularVel = 0;
            this.mainGrab.g.x = this.leftGrab.g.x;
            this.mainGrab.g.y = this.leftGrab.g.y;
            this.mainCandy.x = this.mainGrab.g.x;
            this.mainCandy.y = this.mainGrab.g.y;
            let O = Vec2.diff(this.leftGrab.g, this.leftGrab.prev);
            let G = Vec2.diff(this.rightGrab.g, this.rightGrab.prev);
            let T = new Vec2((O.x + G.x) / 2, (O.y + G.y) / 2);
            this.mainGrab.prev.copyFrom(this.mainGrab.g);
            this.mainGrab.prev.sub(T);
            let vLN06 = 0;
            let v20 = this.sockets;
            while (vLN06 < v20.length) {
              let v21 = v20[vLN06++].rope;
              if (v21 != null && v21.breakIndex != v21.points.length - 3 && (v21.endPoint == this.leftGrab || v21.endPoint == this.rightGrab)) {
                let v22 = v21.points[v21.points.length - 2];
                let v23 = v21.endPoint.restLenTo(v22);
                this.mainGrab.addLink(v22, v23, 0);
                v21.endPoint = this.mainGrab;
                v21.points[v21.points.length - 1] = this.mainGrab;
                v21.rotationOffset = 0;
                v21.severed = false;
              }
            }
            this.leftCandy.sprite.free();
            this.rightCandy.sprite.free();
            let W = new Sprite(null, Resources.skinAtlas, Keys.hH);
            this.layer(11).appendChild(W.node);
            W.setX(this.mainCandy.x);
            W.setY(this.mainCandy.y);
            W.center();
            W.anim().playAndFree(v157);
          } else {
            this.leftGrab.setLinkDistance(this.rightGrab, this.linkDistance);
            this.rightGrab.setLinkDistance(this.leftGrab, this.linkDistance);
          }
        }
        if (!this.leftSet && !this.rightSet && this.candyMode == 0) {
          this.syncCandyPos(this.leftGrab, this.leftCandy);
          this.syncCandyPos(this.rightGrab, this.rightCandy);
          if (Entity.boundsOverlap(this.leftCandy, this.rightCandy)) {
            this.candyMode = 1;
            this.linkDistance = this.leftGrab.g.distTo(this.rightGrab.g);
            this.leftGrab.addLink(this.rightGrab, this.linkDistance, 1);
            this.rightGrab.addLink(this.leftGrab, this.linkDistance, 1);
          }
        }
      }
      let B = 0;
      let K = this.bouncerItems;
      while (B < K.length) {
        let w = K[B];
        ++B;
        w.update(a);
        w.constraint.update(a * this.ropeSpeed);
        let H = 0;
        while (H < 30) {
          ++H;
          w.constraint.applyConstraints();
        }
      }
      this.omNom.update(a);
      if (this.idleTimer >= 0) {
        this.idleTimer -= a;
        if (this.idleTimer < 0 && !this.nightMode) {
          this.omNom.playIdleCalm();
        }
      }
      if (this.candyHitTimer >= 0) {
        this.candyHitTimer -= a;
        if (this.candyHitTimer < 0) {
          this.mainCandy.playCutAnim();
        }
      }
      if (!this.starsFrozen) {
        let w = 0;
        let H = this.stars;
        while (w < H.length) {
          let I = H[w];
          ++w;
          I.update(a);
          let R = [];
          if (this.bothActive) {
            if (this.candyMode != 2) {
              if (this.leftCandy != null) {
                R.push(this.leftCandy);
              }
              if (this.rightCandy != null) {
                R.push(this.rightCandy);
              }
            }
          } else {
            R.push(this.mainCandy);
          }
          if (this.magnetActive && !this.lanternCaught && !I.magnetTracked) {
            let L = 0;
            while (L < R.length) {
              let N = R[L];
              ++L;
              let O = N.x - I.x;
              let G = N.y - I.y;
              if (Math.sqrt(O * O + G * G) < 95) {
                I.motion = I.motion != null ? SeekerPath.create(N, I.motion.g) : SeekerPath.create(N, new Vec2(I.x, I.y));
                I.magnetTracked = true;
                SoundFx.play(SoundFx.magnet_attract);
              }
            }
          }
          if (I.timeout > 0 && I.time == 0) {
            this.conveyorMgr.remove(I);
            Std.remove(this.stars, I);
            let L = I.container;
            L.childAt(0).tween().alpha(0, 0.25);
            L.childAt(1).tween().scale(0, 0.25);
            L.childAt(2).tween().scale(0, 0.25, null, null, cachedBind(I, I.free));
            break;
          } else {
            let L = false;
            if (this.candyMode != 2) {
              this.syncCandyPos(this.leftGrab, this.leftCandy);
              this.syncCandyPos(this.rightGrab, this.rightCandy);
              L = Entity.boundsOverlap(this.leftCandy, I) && !this.leftSet || Entity.boundsOverlap(this.rightCandy, I) && !this.rightSet;
            } else {
              this.syncCandyPos(this.mainGrab, this.mainCandy);
              L = Entity.boundsOverlap(this.mainCandy, I) && !this.bothActive;
            }
            if ((!this.nightMode || !I.lit) && !!this.nightMode) {
              L = false;
            }
            if (L) {
              this.mainCandy.showMagnetHit();
              this.apples++;
              this.scene.onStarCollected(this.apples);
              let N = new Sprite(null, Resources.Oa, Keys.kI);
              N.setX(I.x);
              N.setY(I.y);
              N.setUniformScale(0.4);
              N.anim().playAndFree(STAR_DISAPPEAR_ANIM);
              N.center();
              this.root.appendChild(N.node);
              I.free();
              this.conveyorMgr.remove(I);
              Std.remove(this.stars, I);
              SoundFx.play([1013, 1012, 1011][this.apples - 1]);
              if (this.omNom.isCalm()) {
                this.omNom.playWakeStart();
              }
              break;
            }
          }
        }
      }
      let E = 0;
      let v24 = this.bubbles;
      while (E < v24.length) {
        let w = v24[E];
        ++E;
        w.update(a);
        if (!w.popped) {
          if (this.candyMode != 2) {
            if (!this.leftSet && this.checkBubbleHit(w, this.leftCandy, this.leftRope, this.leftBubble)) {
              this.leftRope = w;
              break;
            }
            if (!this.rightSet && this.checkBubbleHit(w, this.rightCandy, this.rightRope, this.rightBubble)) {
              this.rightRope = w;
              break;
            }
          } else if (!this.bothActive && this.checkBubbleHit(w, this.mainCandy, this.heldGrab, this.anchorBubble)) {
            this.heldGrab = w;
            break;
          }
        }
        let H = 0;
        let I = this.bouncerItems;
        while (H < I.length) {
          let R = I[H];
          ++H;
          if (!w.popped && Rect.pointInside(R.x, R.y, w.x - 34, w.y - 34, 68, 68)) {
            let L = false;
            let N = 0;
            let O = this.ghosts;
            while (N < O.length) {
              let G = O[N];
              ++N;
              if (G.attached == w) {
                G.canSwitch = false;
                L = true;
              }
            }
            if (R.attached == null || !L) {
              if (R.attached != null) {
                this.spawnBubblePop(w.x, w.y);
                let G = 0;
                let T = this.ghosts;
                while (G < T.length) {
                  let v25 = T[G];
                  ++G;
                  if (v25.attached == R.attached) {
                    v25.canSwitch = true;
                    v25.setSlot(1);
                  }
                }
                R.attached = null;
              }
              R.attached = w;
              R.Gn.show();
              SoundFx.play(SoundFx.bubble);
              w.pop();
            }
          }
        }
        if (!w.bubbleHit) {
          let R = this.vinyls.length;
          let L = 0;
          while (L < R) {
            let N = this.vinyls[L++];
            if (Vec2.distance(w.x, w.y, N.x, N.y) < N.diameter) {
              w.bubbleHit = true;
            }
          }
        }
      }
      let vLN07 = 0;
      let V = this.tutorials;
      while (vLN07 < V.length) {
        V[vLN07++].update(a);
      }
      let vLN08 = 0;
      let v26 = this.tutorialPics;
      while (vLN08 < v26.length) {
        v26[vLN08++].update(a);
      }
      let v27 = -1;
      let vLN09 = 0;
      let v28 = this.vinyls.length;
      while (vLN09 < v28) {
        let w = this.vinyls[vLN09];
        let H = 0;
        while (H < v) {
          let L = this.sockets[H++];
          let N = w.groupKeys.indexOf(L);
          if (Vec2.distance(L.x, L.y, w.x, w.y) <= w.diameter + this.scale * 5) {
            if (N < 0) {
              w.groupKeys.push(L);
            }
          } else if (N >= 0) {
            Std.remove(w.groupKeys, L);
          }
        }
        let I = this.bubbles.length;
        let R = 0;
        while (R < I) {
          let L = this.bubbles[R++];
          let N = w.groupKeys.indexOf(L);
          if (Vec2.distance(L.x, L.y, w.x, w.y) <= w.diameter + this.scale * 10) {
            if (N < 0) {
              w.groupKeys.push(L);
            }
          } else if (N >= 0) {
            Std.remove(w.groupKeys, L);
          }
        }
        if (w.ET) {
          v27 = vLN09;
        }
        w.update(a);
        ++vLN09;
      }
      if (v27 >= 0) {
        this.vinyls[v27].free();
        this.vinyls.splice(v27, 1);
      }
      let vLN010 = 0;
      let v29 = this.socks;
      while (vLN010 < v29.length) {
        let w = v29[vLN010];
        ++vLN010;
        w.update(a);
        let H = PathResolver.rampTowardStep(w.celebrateTimer, 0, 1, a);
        w.celebrateTimer = H.value;
        if (H.reached) {
          w.state = 0;
        }
        let I = w.rotation;
        w.rotation = 0;
        w.updateEnds();
        w.rotation = I;
        w.updateEnds();
        let R = function (G) {
          let T = Sock.HIT_HALF * 2;
          return Rect.lineIntersect(w.leftEnd.x, w.leftEnd.y, w.rightEnd.x, w.rightEnd.y, G.g.x - Sock.HIT_HALF, G.g.y - Sock.HIT_HALF, T, T);
        };
        let L = function (G) {
          let T = Sock.HIT_HALF * 2;
          return Rect.lineIntersect(w.Vc.x, w.Vc.y, w.qd.x, w.qd.y, G.g.x - Sock.HIT_HALF, G.g.y - Sock.HIT_HALF, T, T);
        };
        if (w.state != 0) {
          continue;
        }
        if (this.candyMode == 2 && this.mainCandy.litBy == null) {
          let G = this.mainGrab.delta.clone();
          G.rotate(-I * DEG2RAD);
          if (G.y >= 0 && (R(this.mainGrab) || L(this.mainGrab))) {
            let T = 0;
            let v30 = this.socks.length;
            while (T < v30) {
              let v31 = this.socks[T++];
              if (v31 != w && v31.group == w.group) {
                v31.state = 1;
                v31.celebrateTimer = 0.8;
                this.cutGrabbedRopes(false);
                this.mainCandy.bouncePower = this.mainGrab.velocity.length() * 0.9 * LevelController.ROPE_SPEED;
                this.mainCandy.litBy = v31;
                w.celebrateSprite.setVisible(true);
                w.celebrateSprite.anim().play(v167);
                SoundFx.play(SoundFx.teleport);
                let W = this;
                let v32 = this.mainCandy;
                this.delay(function () {
                  W.applyLighterAnchor(v32);
                }, 0.1);
                break;
              }
            }
          }
        }
        let N = 0;
        let O = this.bouncerItems;
        while (N < O.length) {
          let G = O[N];
          ++N;
          if (G.litBy != null) {
            continue;
          }
          let T = G.constraint.delta.clone();
          T.rotate(-I * DEG2RAD);
          if (T.y >= 0 && R(G.constraint) || L(G.constraint)) {
            let vLN011 = 0;
            let v33 = this.socks.length;
            while (vLN011 < v33) {
              let W = this.socks[vLN011++];
              if (W != w && W.group == w.group) {
                W.state = 1;
                W.celebrateTimer = 0.8;
                this.cutAttachedRopes(G);
                G.bouncePower = G.constraint.velocity.length() * 0.9;
                G.litBy = W;
                w.celebrateSprite.setVisible(true);
                w.celebrateSprite.anim().play(v167);
                SoundFx.play(SoundFx.teleport);
                let vThis2 = this;
                let vG = G;
                this.delay(function () {
                  vThis2.applyLighterAnchor(vG);
                }, 0.1);
                break;
              }
            }
          }
        }
      }
      let vLN012 = 0;
      let v34 = this.ghosts;
      while (vLN012 < v34.length) {
        v34[vLN012++].update(a);
      }
      let vLN013 = 0;
      let v35 = this.pumps;
      while (vLN013 < v35.length) {
        let w = v35[vLN013];
        ++vLN013;
        w.update(a);
        let H = PathResolver.rampTowardStep(w.Gp, 0, 1, a);
        w.Gp = H.value;
        if (H.reached) {
          this.pumpActivate(w, a);
        }
      }
      let vLN014 = 0;
      let v36 = this.steamGens;
      while (vLN014 < v36.length) {
        let w = v36[vLN014];
        ++vLN014;
        if (w != null) {
          w.update(a);
          if (w.level != 3) {
            this.handleSteamGen(w, a);
          }
        }
      }
      let vLN015 = 0;
      let v37 = this.lanterns;
      while (vLN015 < v37.length) {
        let w = v37[vLN015];
        ++vLN015;
        if (w != null && (w.update(a), !this.lanternCaught && w.Xj == 0 && Vec2.distance(this.mainGrab.g.x, this.mainGrab.g.y, w.x, w.y) < 32)) {
          this.lanternCaught = true;
          this.mainCandy.alive = false;
          this.mainCandy.container.tween().scale(0.3, 0.1);
          this.mainCandy.container.tween().alpha(0, 0.1);
          this.mainCandy.container.tween().xy(w.x, w.y);
          this.cutGrabbedRopes(false);
          if (this.heldGrab != null) {
            this.releaseGrab(this.heldGrab, false);
          }
          let H = this.mainGrab;
          let I = w;
          this.delay(function () {
            I.startTeleport(H);
          }, 0.05);
          this.triggerSpecial(3);
        }
      }
      let vLN016 = 0;
      let v38 = this.electrics;
      while (vLN016 < v38.length) {
        v38[vLN016++].update(a);
      }
      if (this.telekinesisActive && !this.lanternCaught) {
        let w = 0;
        let H = this.electrics;
        while (w < H.length) {
          let I = H[w];
          ++w;
          let R = false;
          if (!I.electric || I.ignoreElectric) {
            if (this.candyMode != 2) {
              if (R = !this.leftSet && d(I, this.leftGrab)) {
                this.bounceOff(I, this.leftCandy.constraint, a);
              }
              if (R = !this.rightSet && d(I, this.rightGrab)) {
                this.bounceOff(I, this.rightCandy.constraint, a);
              }
            } else if (R = !this.bothActive && d(I, this.mainGrab)) {
              this.bounceOff(I, this.mainCandy.constraint, a);
            }
            if (!R) {
              I.bounceHandled = false;
            }
          }
        }
      } else if (!this.lanternCaught) {
        let w = 0;
        let H = this.electrics;
        while (w < H.length) {
          let I = H[w];
          ++w;
          if (!I.electric || I.ignoreElectric) {
            let R = false;
            let L = false;
            if (this.candyMode != 2) {
              if (R = !this.leftSet && d(I, this.leftGrab)) {
                L = true;
              } else {
                R = !this.rightSet && d(I, this.rightGrab);
              }
            } else {
              R = !this.bothActive && d(I, this.mainGrab);
            }
            if (R) {
              if (this.candyMode != 2) {
                if (L) {
                  if (this.leftRope != null) {
                    this.releaseGrab(this.leftRope, true);
                  }
                } else if (this.rightRope != null) {
                  this.releaseGrab(this.rightRope, false);
                }
              } else if (this.heldGrab != null) {
                this.releaseGrab(this.heldGrab, false);
              }
              let N = new CandyShatterParticles(this, 5);
              this.delayedCalls.push(N);
              if (this.gravityButton != null && !this.gravityFlipped) {
                N.Kb.y = -500;
                N.angle = 90;
              }
              if (this.candyMode != 2) {
                if (L) {
                  N.x = this.leftCandy.x;
                  N.y = this.leftCandy.y;
                  this.leftSet = true;
                } else {
                  N.x = this.rightCandy.x;
                  N.y = this.rightCandy.y;
                  this.rightSet = true;
                }
              } else {
                N.x = this.mainCandy.x;
                N.y = this.mainCandy.y;
                this.bothActive = true;
                this.mainCandy.free();
              }
              N.start(5);
              SoundFx.play(SoundFx.candy_break);
              this.cutGrabbedRopes(L);
              if (this.restarting) {
                return;
              }
              this.delay(cachedBind(this, this.onCandyLost), 0.3);
              return;
            }
          }
        }
      }
      let vLN017 = 0;
      let v39 = this.bouncers;
      while (vLN017 < v39.length) {
        let w = v39[vLN017];
        ++vLN017;
        w.update(a);
        let H = Vec2.diff(new Vec2(w.x, w.y), w.lastPos);
        let I = H.length();
        let R = 1;
        let L = new Vec2(0, 0);
        if (I >= 1) {
          R = I | 0;
          L = Vec2.divided(H, R);
        }
        let N = new Vec2(0, 0);
        let O = false;
        let G = false;
        if (this.candyMode != 2) {
          O = false;
          let W = 0;
          let vR = R;
          while (W < vR) {
            let v40 = Vec2.scaled(L, W++);
            if (O = O || c(w, v40, this.leftGrab)) {
              N = v40.clone();
              break;
            }
          }
          if (O = O && !this.leftSet) {
            G = true;
          } else {
            O = false;
            let vLN018 = 0;
            let vR2 = R;
            while (vLN018 < vR2) {
              let v41 = Vec2.scaled(L, vLN018++);
              if (O = O || c(w, v41, this.rightGrab)) {
                N = v41.clone();
                break;
              }
            }
            O = O && !this.rightSet;
          }
        } else {
          O = false;
          let W = 0;
          let vR3 = R;
          while (W < vR3) {
            let v42 = Vec2.scaled(L, W++);
            if (O = O || c(w, v42, this.mainGrab)) {
              N = v42.clone();
            }
          }
          O = O && !this.bothActive;
        }
        let T = function (W) {
          W.g.x += H.x - N.x;
          W.g.y += H.y - N.y;
          W.prev.x += H.x - N.x;
          W.prev.y += H.y - N.y;
        };
        if (O) {
          if (this.candyMode != 2) {
            if (G) {
              T(this.leftGrab);
              this.handleBounce(w, this.leftGrab, a);
            } else {
              T(this.rightGrab);
              this.handleBounce(w, this.rightGrab, a);
            }
          } else {
            T(this.mainGrab);
            this.handleBounce(w, this.mainGrab, a);
          }
        } else {
          w.bounceHandled = false;
        }
        O = false;
        let vLN019 = 0;
        let v43 = this.bouncerItems;
        while (vLN019 < v43.length) {
          let W = v43[vLN019];
          ++vLN019;
          O = false;
          let vLN020 = 0;
          let vR4 = R;
          while (vLN020 < vR4) {
            let v44 = vLN020++;
            O = O || c(w, Vec2.scaled(L, v44), W.constraint);
          }
          if (O) {
            T(W.constraint);
            this.handleBounce(w, W.constraint, a);
          } else {
            w.bounceHandled = false;
          }
        }
        w.syncLastPos();
      }
      this.characterCtrl.update(a);
      if (!this.characterCtrl.hasGrab() && this.characterCtrl.containsGrab(this.mainGrab)) {
        this.characterCtrl.captureGrab(this.mainGrab);
        this.cutGrabbedRopes(true);
        this.mainCandy.angularVel = 0;
        this.triggerSpecial(4);
      }
      this.bonusStar.update(a);
      if (!this.bonusCollected && this.mainCandy.litBy == null && this.telekinesisActive) {
        if (this.candyMode != 2) {
          if (!this.leftSet) {
            let w = this.leftCandy.constraint.g.x - this.bonusStar.x;
            let H = this.leftCandy.constraint.g.y - this.bonusStar.y;
            if (Math.sqrt(w * w + H * H) <= Star.radius * 2) {
              this.bonusStar.collect();
              this.scene.onBonusCollected();
              this.bonusCollected = true;
            }
          }
          if (!this.rightSet) {
            let w = this.rightCandy.constraint.g.x - this.bonusStar.x;
            let H = this.rightCandy.constraint.g.y - this.bonusStar.y;
            if (Math.sqrt(w * w + H * H) <= Star.radius * 2) {
              this.bonusStar.collect();
              this.bonusCollected = true;
              this.scene.onBonusCollected();
            }
          }
        } else {
          let w = this.mainCandy.constraint.g.x - this.bonusStar.x;
          let H = this.mainCandy.constraint.g.y - this.bonusStar.y;
          if (Math.sqrt(w * w + H * H) <= Star.radius * 2) {
            this.bonusStar.collect();
            this.scene.onBonusCollected();
            this.bonusCollected = true;
          }
        }
      }
      let v45 = Character.BACK_FORCE * (this.gravityButton == null || this.gravityFlipped ? 1 : -1);
      let v46 = Character.AHEAD_FORCE;
      if (this.candyMode == 0) {
        if (this.leftRope != null) {
          b(this.leftGrab);
        }
        if (this.rightRope != null) {
          b(this.rightGrab);
        }
      }
      if (this.candyMode == 1) {
        if (this.leftRope != null || this.rightRope != null) {
          b(this.leftGrab);
          b(this.rightGrab);
        }
      } else if (this.heldGrab != null && !this.characterCtrl.hasGrab()) {
        b(this.mainGrab);
      }
      let vLN021 = 0;
      let v47 = this.bouncerItems;
      while (vLN021 < v47.length) {
        let w = v47[vLN021];
        ++vLN021;
        if (w.attached != null) {
          b(w.constraint);
        }
      }
      let v48;
      if (!this.bothActive && !this.candyBoth) {
        if (this.afterFirstWin) {
          if (this.endProgress > 0) {
            this.endProgress = PathResolver.rampToward(this.endProgress, 0, 1, a);
            if (this.endProgress <= 0) {
              v48 = new Vec2(this.omNom.x, this.omNom.y);
              if (this.mainGrab.g.distTo(v48) > OmNom.EAT_DIST) {
                this.afterFirstWin = false;
                this.omNom.playMouthClose();
                SoundFx.play(SoundFx.monster_close);
              } else {
                this.endProgress = 1;
              }
            }
          }
        } else {
          let w = true;
          if (this.lanternCaught) {
            w = false;
          } else if (this.nightMode && !this.omNom.lit) {
            w = false;
          }
          if (w) {
            v48 = new Vec2(this.omNom.x, this.omNom.y);
            if (this.mainGrab.g.distTo(v48) < OmNom.EAT_DIST) {
              this.afterFirstWin = true;
              this.omNom.playMouthOpen();
              SoundFx.play(SoundFx.monster_open);
              this.endProgress = 1;
            }
          }
        }
        if (!this.restarting && !this.menuActive && (!this.nightMode || this.nightMode && this.omNom.lit) && this.tryEatCandy(this.mainCandy, this.heldGrab, this.omNom, this.mainGrab)) {
          this.bothActive = this.menuActive = true;
          this.onWin();
          return;
        }
      }
      if (this.telekinesisActive) {
        if (this.candyMode != 2) {
          this.applyTouchPan(this.leftCandy.constraint);
          this.applyTouchPan(this.rightCandy.constraint);
        } else {
          this.applyTouchPan(this.mainCandy.constraint);
        }
        this.magnetTouchDur += a;
        if (this.touchActive[0] && (this.magnetEffect.isActive || (this.omNom.playGrabBy(), this.magnetEffect.setEnabled(true)), this.magnetTouchDur > 0.3)) {
          let w = new Vec2(this.touchPrev[0].x, this.touchPrev[0].y);
          let H;
          H = this.magnetTouchDur < 0.15 ? (this.magnetTouchDur - 0.3) / 0.15 * 70 : 70;
          let I = this.magnetEffect.Qi.x;
          let R = this.magnetEffect.Qi.y;
          let L;
          let N;
          if (this.candyMode == 2) {
            L = I - this.mainCandy.constraint.g.x;
            N = R - this.mainCandy.constraint.g.y;
            let O = Math.sqrt(L * L + N * N);
            let G = Vec2.diff(this.mainCandy.constraint.g, w);
            G.normalize();
            if (O <= 200) {
              H *= 1 - O * 0.005;
              this.mainCandy.constraint.applyImpulse(Vec2.scaled(G, H), a);
            }
          } else {
            L = I - this.leftCandy.constraint.g.x;
            N = R - this.leftCandy.constraint.g.y;
            let O = Math.sqrt(L * L + N * N);
            L = I - this.rightCandy.constraint.g.x;
            N = R - this.rightCandy.constraint.g.y;
            let G = Math.sqrt(L * L + N * N);
            let T = Vec2.diff(this.leftCandy.constraint.g, w);
            T.normalize();
            let v49 = Vec2.diff(this.rightCandy.constraint.g, w);
            v49.normalize();
            if (O <= 200) {
              this.leftCandy.constraint.applyImpulse(Vec2.scaled(T, H * (1 - O * 0.005)), a);
            }
            if (G <= 200) {
              this.rightCandy.constraint.applyImpulse(Vec2.scaled(v49, H * (1 - G * 0.005)), a);
            }
          }
        }
        if (this.touchActive[0]) {
          if (this.candyMode == 2) {
            let w = Vec2.diff(this.mainCandy.constraint.g, this.mainCandy.constraint.prev);
            if (w.length() > 3) {
              w.normalize();
              this.mainCandy.constraint.g = Vec2.sum(this.mainCandy.constraint.prev, Vec2.scaled(w, 3));
            }
          } else {
            let w = Vec2.diff(this.leftCandy.constraint.g, this.leftCandy.constraint.prev);
            if (w.length() > 3) {
              w.normalize();
              this.leftCandy.constraint.g = Vec2.sum(this.leftCandy.constraint.prev, Vec2.scaled(w, 3));
            }
            let H = Vec2.diff(this.rightCandy.constraint.g, this.rightCandy.constraint.prev);
            if (H.length() > 3) {
              H.normalize();
              this.rightCandy.constraint.g = Vec2.sum(this.rightCandy.constraint.prev, Vec2.scaled(H, 3));
            }
          }
        }
      }
      let v50 = this.candyMode == 2 && this.isGrabFlying(this.mainGrab) && !this.bothActive;
      let v51 = this.candyMode != 2 && !this.leftSet && this.isGrabFlying(this.leftGrab);
      let v52 = this.candyMode != 2 && !this.rightSet && this.isGrabFlying(this.rightGrab);
      let v53 = this.nightMode;
      let vA2 = [];
      if (this.telekinesisActive) {
        v53 = false;
      }
      if (!this.candyBoth) {
        let w = 0;
        let H = this.bouncerItems;
        while (w < H.length) {
          let I = H[w];
          ++w;
          if (!this.isGrabFlying(I.constraint)) {
            v53 = false;
            break;
          }
          if (this.telekinesisActive) {
            vA2.push(I);
          }
        }
      }
      let vLN022 = 0;
      while (vLN022 < vA2.length) {
        Std.remove(this.bouncerItems, vA2[vLN022++]);
      }
      if (!!this.flightWarning && !v50 && !v51 && !v52 && !v53) {
        this.flightWarning = false;
      }
      if (LevelState.box == 13 && LevelState.level == 22) {
        v52 = false;
      }
      if (this.scrollState != 1 && !this.flightWarning && (v50 || v51 || v52 || v53)) {
        let w = false;
        if (this.candyMode == 2 && this.bothActive || this.candyMode != 2 && (this.leftSet || this.rightSet) || this.candyBoth) {
          w = true;
        }
        if (v50) {
          this.bothActive = true;
        }
        if (v51) {
          this.leftSet = true;
        }
        if (v52) {
          this.rightSet = true;
        }
        if (v53) {
          this.candyBoth = true;
        }
        if (!this.restarting && !w) {
          this.onCandyLost();
        }
      }
      if (this.special == 1 && !this.bothActive && this.heldGrab != null && this.mainCandy.y < LevelController.SPECIAL_MAX_Y && this.mainCandy.x > LevelController.SPECIAL_MIN_X) {
        let w = this.special = 0;
        let H = this.tutorials;
        while (w < H.length) {
          let L = H[w];
          ++w;
          if (L.special == 1) {
            L.show();
          }
        }
        let I = 0;
        let R = this.tutorialPics;
        while (I < R.length) {
          let L = R[I];
          ++I;
          if (L.special == 1) {
            L.show();
          }
        }
      }
      this.background.update();
      this.root.tickAnims(a);
      if (this.threeStarsEffect != null) {
        this.threeStarsEffect.update(a);
      }
      if (this.magnetEffect != null) {
        if (this.touchActive[0]) {
          this.magnetEffect.Qi = new Vec2(this.touchPrev[0].x, this.touchPrev[0].y);
        }
        this.magnetEffect.update(a);
        this.borderFx.update(a);
        this.magnetFlash.update(a);
      }
    }
    render() {
      for (var a = 0, b = this.delayedCalls; a < b.length;) {
        b[a++].draw();
      }
      a = this.swarm;
      if (a != null) {
        a.draw();
      }
      this.omNom.draw();
      a = 0;
      for (b = this.vinyls; a < b.length;) {
        b[a++].draw();
      }
      a = 0;
      for (b = this.bubbles; a < b.length;) {
        b[a++].draw();
      }
      a = 0;
      for (b = this.pumps; a < b.length;) {
        b[a++].draw();
      }
      a = 0;
      for (b = this.electrics; a < b.length;) {
        b[a++].draw();
      }
      a = 0;
      for (b = this.bouncers; a < b.length;) {
        b[a++].draw();
      }
      a = 0;
      for (b = this.socks; a < b.length;) {
        b[a++].draw();
      }
      a = 0;
      for (b = this.sockets; a < b.length;) {
        b[a++].updateBack();
      }
      a = 0;
      for (b = this.sockets; a < b.length;) {
        b[a++].draw();
      }
      a = 0;
      for (b = this.stars; a < b.length;) {
        b[a++].draw();
      }
      a = 0;
      for (b = this.ghosts; a < b.length;) {
        b[a++].draw();
      }
      a = 0;
      for (b = this.steamGens; a < b.length;) {
        b[a++].draw();
      }
      a = 0;
      for (b = this.lanterns; a < b.length;) {
        b[a++].draw();
      }
      for (a = this.conveyorMgr.iterator(); a.hasNext();) {
        a.next().draw();
      }
      this.bonusStar.draw();
      if (this.telekinesisActive) {
        this.magnetEffect.draw();
        this.borderFx.draw();
        this.magnetFlash.draw();
      }
      this.characterCtrl.draw();
      if (!this.bothActive) {
        if (this.mainCandy.litBy == null) {
          this.mainCandy.x = this.mainGrab.g.x;
          this.mainCandy.y = this.mainGrab.g.y;
          this.mainCandy.visible = true;
        } else {
          this.mainCandy.visible = false;
        }
        if (this.magnetActive && !this.lanternCaught && this.threeStarsEffect != null) {
          this.threeStarsEffect.x = this.mainCandy.x;
          this.threeStarsEffect.y = this.mainCandy.y;
          this.threeStarsEffect.draw();
        }
      }
      if (this.anchorBubble != null) {
        this.anchorBubble.setX(this.mainCandy.x);
        this.anchorBubble.setY(this.mainCandy.y);
      }
      if (this.candyMode != 2) {
        if (this.leftSet) {
          this.leftCandy.sprite.setVisible(false);
        } else {
          this.leftCandy.x = this.leftGrab.g.x;
          this.leftCandy.y = this.leftGrab.g.y;
          this.leftCandy.draw();
        }
        if (this.leftBubble != null) {
          this.leftBubble.setX(this.leftCandy.x);
          this.leftBubble.setY(this.leftCandy.y);
        }
        if (this.rightSet) {
          this.rightCandy.sprite.setVisible(false);
        } else {
          this.rightCandy.x = this.rightGrab.g.x;
          this.rightCandy.y = this.rightGrab.g.y;
          this.rightCandy.draw();
        }
        if (this.rightBubble != null) {
          this.rightBubble.setX(this.rightCandy.x);
          this.rightBubble.setY(this.rightCandy.y);
        }
        this.mainCandy.visible = false;
      } else if (this.mainCandy.litBy == null) {
        this.mainCandy.visible = true;
      }
      this.mainCandy.draw();
      a = 0;
      for (b = this.bouncerItems; a < b.length;) {
        b[a++].draw();
      }
      a = 0;
      for (b = this.tutorials; a < b.length;) {
        b[a++].draw();
      }
      a = 0;
      for (b = this.tutorialPics; a < b.length;) {
        b[a++].draw();
      }
      this.root.updateTransforms();
      this.root.collectRenderStates();
      this.app.renderer.pushCamera(this.camera.camera);
      this.app.renderer.drawScene(this.root);
      this.app.renderer.popCamera();
    }
  }
  LevelController.i = true;
  LevelController.s = Node;
  Object.assign(LevelController.prototype, {
    l: LevelController
  });
