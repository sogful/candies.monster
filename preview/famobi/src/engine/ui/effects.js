  class LevelBackground {
    constructor(a) {
      this.controller = a;
      this.container = new Container();
      this.background = new Sprite(this.container);
      a.layer(0).appendChild(this.container.node);
      this.flipped = false;
    }
    addEarth() {
      this.earthContainer = new Container();
      this.container.appendChild(this.earthContainer);
      this.earthSprite = new Sprite(this.earthContainer, Resources.Xn);
      this.earthSprite.center();
    }
    toggleEarth() {
      this.flipped = !this.flipped;
      this.earthSprite.tween().rotation(this.flipped ? 180 : 0, 0.3, Easing.poly(100));
    }
    update() {
      let a = Application.instance.window.viewportSize();
      let b = this.controller.levelW;
      let c = this.controller.levelH;
      var d = new Bounds(0, 0, a.x, a.y).fitAspect(this.controller.levelW / this.controller.levelH);
      var e = this.controller.camera.camera.zoom;
      let f = (a.x - (d.right - d.left)) / e;
      d = (a.y - (d.bottom - d.top)) / e;
      this.background.setTexture(Resources.uu);
      this.background.center();
      e = false;
      if (a.x / a.y < 1.2) {
        this.background.setRotation(0);
        this.background.setScaleX((b + f) / this.background.size.x);
        this.background.setScaleY((c + d) / this.background.size.y);
      } else {
        this.background.setRotation(90);
        e = true;
        this.background.setScaleX((c + d) / this.background.size.x);
        this.background.setScaleY((b + f) / this.background.size.y);
      }
      this.background.setX(b / 2);
      this.background.setY(c / 2);
      if (this.earthSprite != null) {
        if (e) {
          this.earthContainer.setScaleX(this.background.scaleY);
          this.earthContainer.setScaleY(this.background.scaleX);
          this.earthContainer.setX(this.background.getX() + this.background.scaleY * 55);
          this.earthContainer.setY(this.background.getY() + this.background.scaleX * 10);
        } else {
          this.earthContainer.setScaleX(this.background.scaleX);
          this.earthContainer.setScaleY(this.background.scaleY);
          this.earthContainer.setX(this.background.getX() + this.background.scaleX * 10);
          this.earthContainer.setY(this.background.getY() - this.background.scaleY * 40);
        }
      }
    }
  }
  LevelBackground.i = true;
  Object.assign(LevelBackground.prototype, {
    l: LevelBackground
  });
  class PuffEffect extends Node {
    constructor() {
      super();
      this.container = new Container();
      this.sprites = [];
      this.velocities = [];
      this.spinSpeeds = [];
      let a = 0;
      while (a < 10) {
        let c = a++;
        var b = X.randRange(-PI / 2 - PI / 4, -PI / 2 + PI / 4);
        this.velocities[c] = new Vec4(Math.cos(b) * 10, Math.sin(b) * 10, 0, 1);
        b = this.sprites[c] = new Sprite(this.container, Resources.Yb, [Keys.aJ, Keys.bJ, Keys.cJ][X.randInt(0, 2)]);
        b.center();
        b.setUniformScale(X.randRange(0.75, 2));
        b.setRotation(Math.random() * 360);
        this.spinSpeeds[c] = X.randSigned(10);
      }
    }
    dispose() {
      super.dispose();
      this.container.free();
      this.sprites = null;
    }
    update(a) {
      super.update(a);
      let b = a = 0;
      while (b < 10) {
        let c = b++;
        this.velocities[c].y += 0.25;
        let d = this.sprites[c];
        d.setX(d.getX() + this.velocities[c].x);
        d.setY(d.getY() + this.velocities[c].y);
        d.setRotation(d.rotation + this.spinSpeeds[c]);
        if (this.time > 3) {
          d.setAlpha(d.alpha * 0.95);
          if (d.alpha < 0.05) {
            ++a;
          }
        }
      }
      if (a == 10) {
        this.dispose();
      }
    }
  }
  PuffEffect.i = true;
  PuffEffect.s = Node;
  Object.assign(PuffEffect.prototype, {
    l: PuffEffect
  });
  class BounceAnim extends Node {
    constructor(a, b, c) {
      if (c == null) {
        c = false;
      }
      if (b == null) {
        b = 1;
      }
      super();
      this.sprite = a;
      this.scale = b;
      this.loop = c;
      this.time = 0;
      a.setScale(1, 1);
      a.centerOrigin();
      this.g = new Vec4(a.getX(), a.getY(), 0, 1);
    }
    dispose() {
      this.sprite.setScale(1, 1);
      this.sprite.setX(this.g.x);
      this.sprite.setY(this.g.y);
      super.dispose();
    }
    update(a) {
      super.update(a);
      a = this.time;
      if (a < 0.1) {
        a = Math.sin(a / 0.1 * (Math.PI / 2)) * 0.05 * this.scale;
        var b = 1 - a;
        a = 1 + a;
      } else if (a < 0.3) {
        b = a - 0.1;
        a = ((b /= 0.09999999999999999) < 1 ? b * 0.055 * b * b : ((b -= 2) * b * b + 2) * 0.055) * this.scale;
        b = 0.95 + a;
        a = 1.05 - a;
      } else if (a < 0.6) {
        a = (a - 0.3) / 0.3 - 1;
        a = (a * a * a + 1) * 0.05 * this.scale;
        b = 1.06 - a;
        a = 0.94 + a;
      } else {
        if (this.loop) {
          if (a > 4) {
            this.time = 0;
          }
        } else {
          this.dispose();
        }
        return;
      }
      this.sprite.setX(this.g.x + b);
      this.sprite.setY(this.g.y + a);
      this.sprite.setScaleX(b);
      this.sprite.setScaleY(a);
    }
  }
  BounceAnim.i = true;
  BounceAnim.s = Node;
  Object.assign(BounceAnim.prototype, {
    l: BounceAnim
  });
  class LevelCurtain extends Node {
    constructor() {
      super();
      LevelCurtain.instance = this;
      this.isWebOSHD = Application.instance.isWebOS && this.app.window.canvasSize.x == 1920;
      this.state = 0;
      this.container = new Container();
      this.node = new SceneRoot();
      this.node.appendChild(this.container.node);
      this.node.name = "cover";
      this.dimmer = new ColorRectShape(null, new Vec4(0, 0, 0, 1));
      this.dimmer.setAlpha(0.5);
      this.container.node.appendChild(this.dimmer.node);
      this.scales = [];
      this.stretchScales = [1, 1];
      this.leftHalves = [new Sprite(this.container, Resources.xj, Keys.vy), new Sprite(this.container, Resources.xj, Keys.vy)];
      this.front = [new Sprite(this.container, Resources.xj, Keys.uy), new Sprite(this.container, Resources.xj, Keys.uy)];
      this.ribbons = [new Sprite(this.container, Resources.yc, Keys.YF), new Sprite(this.container, Resources.yc, Keys.ZF)];
      this.colorTint = null;
      if (Application.instance.config.useWebGL) {
        this.colorTint = new ColorTransform();
        this.front[1].setColorTransform(this.colorTint);
      }
      this.closeSprite = new Sprite(null, Resources.yc, Keys.VF);
      this.node.appendChild(this.closeSprite.node);
      let a = Application.instance.isWebOS ? this.isWebOSHD ? 1 : 1.5 : 1;
      this.closeSprite.setPivot(a * 652, a * 577);
      this.closeTargetPos = new Vec4(0, 0, 0, 1);
      this.closeSprite.setVisible(false);
      this.closeSprite.setAlpha(0);
      this.closeSprite.setUniformScale(a);
      this.openSprite = new Sprite(null, Resources.yc, Keys.XF);
      this.openSprite.setVisible(false);
      this.openSprite.setAlpha(0);
      this.node.appendChild(this.openSprite.node);
      this.openSprite.setOrigin(this.openSprite.size.x / 2, 0);
      this.openSprite.setPivot(this.openSprite.size.x / 2, 0);
      this.openTargetPos = new Vec4(0, 0, 0, 1);
      this.leftHalves[0].setScaleX(0.001);
      this.leftHalves[1].setScaleX(0.001);
      this.front[0].setX(-this.front[0].size.x);
      this.front[1].setScaleX(-1);
      this.ribbons[0].setPivot(this.ribbons[0].size.x, 0);
      this.ribbons[0].setOrigin(this.ribbons[0].size.x, 0);
      this.node.updateTransforms();
      this.ready = false;
      this.layout();
    }
    markReady() {
      this.ready = true;
      this.layout();
    }
    dispose() {
      super.dispose();
      this.node.free();
      this.onCloseDoneCb = null;
      LevelCurtain.instance = null;
    }
    setOnCloseDone(a) {
      this.onCloseDoneCb = a;
      this.time = 0;
      this.state = 5;
    }
    skipClose() {
      this.time = 0;
      this.leftHalves[0].setScaleX(1);
      this.leftHalves[1].setScaleX(1);
      this.ribbons[0].setVisible(false);
      this.ribbons[1].setVisible(false);
      this.layout();
      this.animate(1);
      this.state = 6;
      SoundFx.stop(SoundFx.electric);
      SoundFx.stop(SoundFx.monster_chewing);
    }
    playCloseAnim() {
      this.closeSprite.setVisible(true);
      this.state = 1;
      this.time = 0;
    }
    playOpenAnim() {
      this.openSprite.setVisible(true);
      this.state = 3;
      this.time = 0;
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 1:
          a = this.progress(1.5);
          this.closeSprite.setX(this.closeTargetPos.x);
          this.closeSprite.setY(this.closeTargetPos.y);
          this.closeSprite.setAlpha(Easing.quadOut()(a));
          if (a == 1) {
            this.state = 2;
            this.time = 0;
          }
          break;
        case 2:
          a = this.progress(2);
          this.closeSprite.setX(this.closeTargetPos.x);
          this.closeSprite.setY(this.closeTargetPos.y * (1 - a));
          if (a == 1) {
            this.state = 0;
            this.closeSprite.setVisible(false);
          }
          break;
        case 3:
          a = this.progress(1);
          this.openSprite.setAlpha(Easing.quadOut()(a));
          this.openSprite.setX(this.openTargetPos.x);
          this.openSprite.setY(this.openTargetPos.y * 0);
          this.ribbons[0].setVisible(true);
          this.ribbons[1].setVisible(true);
          this.ribbons[0].setAlpha(this.openSprite.alpha);
          this.ribbons[1].setAlpha(this.openSprite.alpha);
          this.ribbons[0].setY(-this.ribbons[0].getHeight() * 0.9);
          this.ribbons[1].setY(-this.ribbons[1].getHeight() * 0.9);
          if (a == 1) {
            this.state = 4;
            this.time = 0;
          }
          break;
        case 4:
          a = this.progress(2);
          this.openSprite.setX(this.openTargetPos.x);
          this.openSprite.setY(this.openTargetPos.y * a);
          var b = this.openSprite.localToWorld(new Vec4(0, 0, 0, 1));
          b = this.container.worldToLocal(b);
          this.ribbons[0].setY(Math.min(0, b.y - this.ribbons[0].getHeight() * 0.9));
          this.ribbons[1].setY(Math.min(0, b.y - this.ribbons[1].getHeight() * 0.9));
          if (a == 1) {
            this.state = 0;
            this.openSprite.setVisible(false);
          }
          break;
        case 5:
          a = this.progress(2);
          this.animate(a);
          if (a == 1) {
            this.ready = true;
            this.state = 0;
            if (this.onCloseDoneCb != null) {
              this.onCloseDoneCb();
              this.onCloseDoneCb = null;
            }
          }
          break;
        case 6:
          a = this.progress(2);
          this.animate(1 - a);
          if (a == 1) {
            this.ready = false;
            this.state = 7;
          }
      }
    }
    layout() {
      var a = Application.instance.window.viewportSize();
      this.container.update(0.016666666666666666);
      var b = a.x;
      var c = a.y;
      var d = b;
      var e = c;
      if (Application.instance.window.pixelRatio() > 2) {
        d = b / 2;
        e = c / 2;
        b = this.node.localT;
        b.scale.x = b.scale.y = b.scale.z = 2;
        b.K = b.K & -2 | 244;
      }
      d /= 2;
      this.container.setX(d);
      b = this.front[0];
      b.setScaleX(d / b.size.x);
      b.setX(-b.getWidth());
      this.stretchScales[0] = b.scaleX;
      this.scales[0] = b.getX();
      c = this.front[1];
      c.setScaleX(-d / c.size.x);
      c.setX(c.getWidth());
      this.stretchScales[1] = -c.scaleX;
      this.scales[1] = c.getX();
      this.closeTargetPos.x = d;
      this.closeTargetPos.y = e;
      this.openTargetPos.x = d;
      this.openTargetPos.y = e;
      this.container.setScaleY(e / b.size.y);
      this.node.updateTransforms();
      this.openSprite.setX(this.openTargetPos.x);
      this.animate(this.ready ? 1 : 0);
      e = this.app.isWebOS ? this.isWebOSHD ? 1 : 1.75 : 1;
      this.ribbons[0].setScaleX(e);
      this.ribbons[1].setScaleX(e);
      this.openSprite.setUniformScale(e);
      if (a.x / a.y > 3) {
        a = this.openSprite;
        a.setUniformScale(a.scaleX * 0.75);
        a = this.ribbons[0];
        a.setScaleX(a.scaleX * 0.75);
        a = this.ribbons[1];
        a.setScaleX(a.scaleX * 0.75);
      }
    }
    animate(a) {
      this.front[0].setScaleX((1 - a) * this.stretchScales[0]);
      this.front[1].setScaleX((-1 + a) * this.stretchScales[1]);
      this.front[0].setX(this.scales[0] - a * this.leftHalves[0].getWidth());
      this.front[1].setX(this.scales[1] + a * this.leftHalves[1].getWidth());
      if (this.colorTint != null) {
        this.colorTint.brightness(-a);
        this.front[1].setColorTransform(this.colorTint);
      }
      let b = this.app.isWebOS ? this.isWebOSHD ? 1 : 1.75 : 1;
      this.leftHalves[0].setScaleX(a);
      this.leftHalves[0].setX(this.front[0].getX() + this.front[0].getWidth());
      this.leftHalves[1].setScaleX(a);
      this.leftHalves[1].setX(this.front[1].getX() - this.front[1].getWidth() - this.leftHalves[1].getWidth());
      this.ribbons[0].setScaleX((1 - a) * b);
      this.ribbons[0].setX(this.leftHalves[0].getX());
      this.ribbons[0].setAlpha(1 - a);
      this.ribbons[1].setScaleX((1 - a) * b);
      this.ribbons[1].setX(this.leftHalves[1].getX() + this.leftHalves[1].getWidth());
      this.ribbons[1].setAlpha(1 - a);
      this.dimmer.setAlpha((1 - a) * 0.5);
    }
  }
  LevelCurtain.i = true;
  LevelCurtain.s = Node;
  Object.assign(LevelCurtain.prototype, {
    l: LevelCurtain
  });

  class TimedFader extends MovingEntity {
    constructor(a) {
      super();
      this.sprite = a;
      a.setAlpha(0);
      this.time = this.state = 0;
    }
    show() {
      this.setState(1);
    }
    hide() {
      this.time = 0;
      this.setState(3);
    }
    update(a) {
      this.time += a;
      switch (this.state) {
        case 1:
          a = Math.min(this.time / 1, 1);
          this.sprite.setAlpha(a);
          if (a == 1) {
            this.setState(2);
          }
          break;
        case 2:
          if (Math.min(this.time / (LevelState.box == 1 && LevelState.level == 1 ? 10 : 5), 1) == 1) {
            this.setState(3);
          }
          break;
        case 3:
          a = Math.min(this.time / 0.5, 1);
          this.sprite.setAlpha(1 - a);
          if (a == 1) {
            this.setState(0);
            this.sprite.setVisible(false);
          }
      }
    }
    draw() {
      this.sprite.setX(this.x);
      this.sprite.setY(this.y);
      this.sprite.setRotation(this.rotation);
    }
    setState(a) {
      this.time = 0;
      this.state = a;
    }
  }
  TimedFader.i = true;
  TimedFader.s = MovingEntity;
  Object.assign(TimedFader.prototype, {
    l: TimedFader
  });
  class TutorialHintText extends TimedFader {
    constructor(a, b) {
      let c = new TextNode(null, Resources.ji);
      c.setText(a);
      c.setBoxSize(b, 512);
      c.setFontSize(26);
      c.setAlign(0);
      c.setMultiline(true);
      c.setBlendMode(2);
      c.setAlpha(0.7);
      super(c);
    }
  }
  TutorialHintText.i = true;
  TutorialHintText.s = TimedFader;
  Object.assign(TutorialHintText.prototype, {
    l: TutorialHintText
  });

  class ScreenFade extends GameObject {
    constructor(a) {
      super();
      this.sprite = new Sprite();
      this.sprite.setColor(new Vec4(0.17647058823529413, 0.17647058823529413, 0.17647058823529413, 1), a.levelW, a.levelH);
      this.sprite.setAlpha(0);
      let b = new AnimTimeline();
      b.alphaKey(0, 0);
      b.alphaKey(0, 0.3);
      b.alphaKey(0.2, 0.6);
      new SpriteAnimator(this.sprite).play(b);
      a.layer(0).appendChild(this.sprite.node);
    }
    free() {
      this.sprite.free();
    }
  }
  ScreenFade.i = true;
  ScreenFade.s = GameObject;
  Object.assign(ScreenFade.prototype, {
    l: ScreenFade
  });

  class LevelToast extends Node {
    constructor(a) {
      super();
      this.container = new Container();
      this.bgRect = new Sprite(this.container);
      this.bgRect.setColor(new Vec4(1, 1, 1, 0.5), 400, 100);
      this.bgRect.setX(-200);
      this.bgRect.setY(-50);
      let b = [1, 1.6, 2, 1.6, 2, 2, 2.2, 2, 1.6, 2, 2, 1, 1.6];
      let c = [603, 20, 350, 27, 38, 60, 471, 68, 306, 71, 197, 104, 622, 110, 144, 131, -44, 133, 544, 136, 307, 151, 409, 156, 61, 157];
      let d = 0;
      let e = 0;
      let f = b.length;
      while (e < f) {
        let g = new Sprite(this.container, Resources.Kd, Keys.iI);
        g.center();
        g.setUniformScale(b[e++] * 0.7);
        g.setX(c[d++] / 600 * 400 - 200);
        g.setY(c[d++] / 187 * 100 - 50);
      }
      this.label = new TextNode(this.container, Resources.ji);
      this.label.setText(a);
      this.label.setBoxSize(500, 100);
      this.label.setFontSize(40);
      this.label.setAlign(0, 0);
      this.label.setMultiline(true);
      this.label.setX(this.bgRect.getX() - 50);
      this.label.setY(this.bgRect.getY());
      this.state = 0;
    }
    dispose() {
      super.dispose();
      this.container.free();
    }
    update(a) {
      super.update(a);
      a = this.app.director.viewportRect().fitAspect(0.6666666666666666);
      this.container.setX((a.left + a.right) / 2);
      this.container.setY(a.bottom - 150);
      this.container.setUniformScale((a.right - a.left) / 600);
      switch (this.state) {
        case 0:
          a = this.progress(0.5);
          let b = Easing.backOut(0.1)(a);
          let c = this.container;
          c.setUniformScale(c.scaleX * b);
          this.container.setAlpha(a);
          if (a == 1) {
            this.state = 1;
            this.time = 0;
          }
          break;
        case 1:
          if (this.app.pointer().justPressed(0) && this.time > 2) {
            this.time = 0;
            this.state = 2;
          }
          break;
        case 2:
          a = this.progress(0.25);
          this.container.setAlpha(1 - a);
          if (a == 1) {
            this.time = 0;
            this.state++;
          }
          break;
        case 3:
          this.dispose();
      }
    }
  }
  LevelToast.i = true;
  LevelToast.s = Node;
  Object.assign(LevelToast.prototype, {
    l: LevelToast
  });
  class HintPointerAnim extends Node {
    constructor() {
      super();
      this.state = 0;
    }
    Qr() {
      super.onAttach();
      let a = this.parent;
      this.topSprite = new Sprite(a.layout, Resources.Wa, Keys.kL);
      this.topSprite.center();
      this.topSprite.setX(378);
      this.topSprite.setY(364);
      this.topSprite.setAlpha(0);
      this.bottomSprite = new Sprite(a.layout, Resources.Wa, Keys.lL);
      this.bottomSprite.setX(368);
      this.bottomSprite.setY(354);
      this.bottomSprite.setAlpha(0);
    }
    update(a) {
      super.update(a);
      this.topSprite.setUniformScale(remap(Math.sin(this.time * 10), -1, 1, 1, 1.1));
      a = this.parent;
      switch (this.state) {
        case 0:
          if (this.time < 1) {
            break;
          }
          this.time = 0;
          this.state = 1;
          break;
        case 1:
          a = this.progress(0.5);
          this.topSprite.setAlpha(a);
          this.bottomSprite.setAlpha(a);
          this.bottomSprite.setX(428 + Easing.quadOut()(a) * -60);
          this.bottomSprite.setY(414 + Easing.quadOut()(a) * -60);
          if (a == 1) {
            this.time = 0;
            this.state = 2;
          }
          break;
        case 2:
          var b = this.progress(0.25);
          this.bottomSprite.setUniformScale(remap(b, 0, 1, 1, 0.9));
          if (b == 1) {
            this.time = 0;
            this.state = 3;
            a.mainCandy.setFrame(a.mainCandy.frame == Keys.kz ? Keys.jz : Keys.kz);
            a.animateSkinPreview();
          }
          break;
        case 3:
          b = this.progress(0.5);
          this.bottomSprite.setUniformScale(remap(Easing.quadOut()(b), 0, 1, 0.9, 1));
          if (b == 1) {
            this.time = 0;
            this.state = a.mainCandy.frame == Keys.jz ? 5 : 4;
          }
          break;
        case 4:
          if (this.time > 1) {
            this.time = 0;
            this.state = 2;
          }
          break;
        case 5:
          a = this.progress(0.5);
          this.topSprite.setAlpha(1 - a);
          this.bottomSprite.setAlpha(1 - a);
          this.bottomSprite.setX(368 + Easing.quadIn()(a) * 60);
          this.bottomSprite.setY(354 + Easing.quadIn()(a) * 60);
          if (a == 1) {
            this.dispose();
          }
      }
    }
  }
  HintPointerAnim.i = true;
  HintPointerAnim.s = Node;
  Object.assign(HintPointerAnim.prototype, {
    l: HintPointerAnim
  });
