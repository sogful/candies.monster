  class LevelBackground {
    constructor(a) {
      this.S = a;
      this.j = new Container();
      this.Ea = new Sprite(this.j);
      a.ma(0).P(this.j.u);
      this.$u = false;
    }
    xS() {
      this.og = new Container();
      this.j.appendChild(this.og);
      this.Xn = new Sprite(this.og, Resources.Xn);
      this.Xn.center();
    }
    pN() {
      this.$u = !this.$u;
      this.Xn.tween().rotation(this.$u ? 180 : 0, 0.3, Easing.poly(100));
    }
    update() {
      let a = Application.instance.window.pi();
      let b = this.S.Ag;
      let c = this.S.zg;
      var d = new Bounds(0, 0, a.x, a.y).hi(this.S.Ag / this.S.zg);
      var e = this.S.Bb.Ab.zoom;
      let f = (a.x - (d.B - d.A)) / e;
      d = (a.y - (d.G - d.D)) / e;
      this.Ea.Uf(Resources.uu);
      this.Ea.center();
      e = false;
      if (a.x / a.y < 1.2) {
        this.Ea.la(0);
        this.Ea.setScaleX((b + f) / this.Ea.X.x);
        this.Ea.setScaleY((c + d) / this.Ea.X.y);
      } else {
        this.Ea.la(90);
        e = true;
        this.Ea.setScaleX((c + d) / this.Ea.X.x);
        this.Ea.setScaleY((b + f) / this.Ea.X.y);
      }
      this.Ea.setX(b / 2);
      this.Ea.setY(c / 2);
      if (this.Xn != null) {
        if (e) {
          this.og.setScaleX(this.Ea.ed);
          this.og.setScaleY(this.Ea.Ra);
          this.og.setX(this.Ea.getX() + this.Ea.ed * 55);
          this.og.setY(this.Ea.getY() + this.Ea.Ra * 10);
        } else {
          this.og.setScaleX(this.Ea.Ra);
          this.og.setScaleY(this.Ea.ed);
          this.og.setX(this.Ea.getX() + this.Ea.Ra * 10);
          this.og.setY(this.Ea.getY() - this.Ea.ed * 40);
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
      this.j = new Container();
      this.wb = [];
      this.Pp = [];
      this.cl = [];
      let a = 0;
      while (a < 10) {
        let c = a++;
        var b = X.Yn(-PI / 2 - PI / 4, -PI / 2 + PI / 4);
        this.Pp[c] = new Vec4(Math.cos(b) * 10, Math.sin(b) * 10, 0, 1);
        b = this.wb[c] = new Sprite(this.j, Resources.Yb, [Keys.aJ, Keys.bJ, Keys.cJ][X.xh(0, 2)]);
        b.center();
        b.setUniformScale(X.Yn(0.75, 2));
        b.la(Math.random() * 360);
        this.cl[c] = X.BA(10);
      }
    }
    dispose() {
      super.dispose();
      this.j.free();
      this.wb = null;
    }
    update(a) {
      super.update(a);
      let b = a = 0;
      while (b < 10) {
        let c = b++;
        this.Pp[c].y += 0.25;
        let d = this.wb[c];
        d.setX(d.getX() + this.Pp[c].x);
        d.setY(d.getY() + this.Pp[c].y);
        d.la(d.Zd + this.cl[c]);
        if (this.time > 3) {
          d.W(d.Uc * 0.95);
          if (d.Uc < 0.05) {
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
      this.T = a;
      this.scale = b;
      this.loop = c;
      this.time = 0;
      a.setScale(1, 1);
      a.centerOrigin();
      this.g = new Vec4(a.getX(), a.getY(), 0, 1);
    }
    dispose() {
      this.T.setScale(1, 1);
      this.T.setX(this.g.x);
      this.T.setY(this.g.y);
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
      this.T.setX(this.g.x + b);
      this.T.setY(this.g.y + a);
      this.T.setScaleX(b);
      this.T.setScaleY(a);
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
      this.Sm = Application.instance.jd && this.O.window.Hc.x == 1920;
      this.state = 0;
      this.j = new Container();
      this.node = new SceneRoot();
      this.node.P(this.j.u);
      this.node.name = "cover";
      this.Pc = new ColorRectShape(null, new Vec4(0, 0, 0, 1));
      this.Pc.W(0.5);
      this.j.node.P(this.Pc.u);
      this.cs = [];
      this.Bs = [1, 1];
      this.le = [new Sprite(this.j, Resources.xj, Keys.vy), new Sprite(this.j, Resources.xj, Keys.vy)];
      this.front = [new Sprite(this.j, Resources.xj, Keys.uy), new Sprite(this.j, Resources.xj, Keys.uy)];
      this.zb = [new Sprite(this.j, Resources.yc, Keys.YF), new Sprite(this.j, Resources.yc, Keys.ZF)];
      this.Qn = null;
      if (Application.instance.config.oo) {
        this.Qn = new ColorTransform();
        this.front[1].pp(this.Qn);
      }
      this.Oe = new Sprite(null, Resources.yc, Keys.VF);
      this.node.P(this.Oe.u);
      let a = Application.instance.jd ? this.Sm ? 1 : 1.5 : 1;
      this.Oe.setPivot(a * 652, a * 577);
      this.rl = new Vec4(0, 0, 0, 1);
      this.Oe.L(false);
      this.Oe.W(0);
      this.Oe.setUniformScale(a);
      this.dc = new Sprite(null, Resources.yc, Keys.XF);
      this.dc.L(false);
      this.dc.W(0);
      this.node.P(this.dc.u);
      this.dc.setOrigin(this.dc.X.x / 2, 0);
      this.dc.setPivot(this.dc.X.x / 2, 0);
      this.uk = new Vec4(0, 0, 0, 1);
      this.le[0].setScaleX(0.001);
      this.le[1].setScaleX(0.001);
      this.front[0].setX(-this.front[0].X.x);
      this.front[1].setScaleX(-1);
      this.zb[0].setPivot(this.zb[0].X.x, 0);
      this.zb[0].setOrigin(this.zb[0].X.x, 0);
      this.node.Gd();
      this.Cr = false;
      this.layout();
    }
    ZD() {
      this.Cr = true;
      this.layout();
    }
    dispose() {
      super.dispose();
      this.node.free();
      this.Ur = null;
      LevelCurtain.instance = null;
    }
    dF(a) {
      this.Ur = a;
      this.time = 0;
      this.state = 5;
    }
    JA() {
      this.time = 0;
      this.le[0].setScaleX(1);
      this.le[1].setScaleX(1);
      this.zb[0].L(false);
      this.zb[1].L(false);
      this.layout();
      this.animate(1);
      this.state = 6;
      SoundFx.stop(SoundFx.electric);
      SoundFx.stop(SoundFx.monster_chewing);
    }
    DM() {
      this.Oe.L(true);
      this.state = 1;
      this.time = 0;
    }
    nu() {
      this.dc.L(true);
      this.state = 3;
      this.time = 0;
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 1:
          a = this.jb(1.5);
          this.Oe.setX(this.rl.x);
          this.Oe.setY(this.rl.y);
          this.Oe.W(Easing.quadOut()(a));
          if (a == 1) {
            this.state = 2;
            this.time = 0;
          }
          break;
        case 2:
          a = this.jb(2);
          this.Oe.setX(this.rl.x);
          this.Oe.setY(this.rl.y * (1 - a));
          if (a == 1) {
            this.state = 0;
            this.Oe.L(false);
          }
          break;
        case 3:
          a = this.jb(1);
          this.dc.W(Easing.quadOut()(a));
          this.dc.setX(this.uk.x);
          this.dc.setY(this.uk.y * 0);
          this.zb[0].L(true);
          this.zb[1].L(true);
          this.zb[0].W(this.dc.Uc);
          this.zb[1].W(this.dc.Uc);
          this.zb[0].setY(-this.zb[0].getHeight() * 0.9);
          this.zb[1].setY(-this.zb[1].getHeight() * 0.9);
          if (a == 1) {
            this.state = 4;
            this.time = 0;
          }
          break;
        case 4:
          a = this.jb(2);
          this.dc.setX(this.uk.x);
          this.dc.setY(this.uk.y * a);
          var b = this.dc.Jx(new Vec4(0, 0, 0, 1));
          b = this.j.Ix(b);
          this.zb[0].setY(Math.min(0, b.y - this.zb[0].getHeight() * 0.9));
          this.zb[1].setY(Math.min(0, b.y - this.zb[1].getHeight() * 0.9));
          if (a == 1) {
            this.state = 0;
            this.dc.L(false);
          }
          break;
        case 5:
          a = this.jb(2);
          this.animate(a);
          if (a == 1) {
            this.Cr = true;
            this.state = 0;
            if (this.Ur != null) {
              this.Ur();
              this.Ur = null;
            }
          }
          break;
        case 6:
          a = this.jb(2);
          this.animate(1 - a);
          if (a == 1) {
            this.Cr = false;
            this.state = 7;
          }
      }
    }
    layout() {
      var a = Application.instance.window.pi();
      this.j.update(0.016666666666666666);
      var b = a.x;
      var c = a.y;
      var d = b;
      var e = c;
      if (Application.instance.window.Pj() > 2) {
        d = b / 2;
        e = c / 2;
        b = this.node.Db;
        b.scale.x = b.scale.y = b.scale.z = 2;
        b.K = b.K & -2 | 244;
      }
      d /= 2;
      this.j.setX(d);
      b = this.front[0];
      b.setScaleX(d / b.X.x);
      b.setX(-b.getWidth());
      this.Bs[0] = b.Ra;
      this.cs[0] = b.getX();
      c = this.front[1];
      c.setScaleX(-d / c.X.x);
      c.setX(c.getWidth());
      this.Bs[1] = -c.Ra;
      this.cs[1] = c.getX();
      this.rl.x = d;
      this.rl.y = e;
      this.uk.x = d;
      this.uk.y = e;
      this.j.setScaleY(e / b.X.y);
      this.node.Gd();
      this.dc.setX(this.uk.x);
      this.animate(this.Cr ? 1 : 0);
      e = this.O.jd ? this.Sm ? 1 : 1.75 : 1;
      this.zb[0].setScaleX(e);
      this.zb[1].setScaleX(e);
      this.dc.setUniformScale(e);
      if (a.x / a.y > 3) {
        a = this.dc;
        a.setUniformScale(a.Ra * 0.75);
        a = this.zb[0];
        a.setScaleX(a.Ra * 0.75);
        a = this.zb[1];
        a.setScaleX(a.Ra * 0.75);
      }
    }
    animate(a) {
      this.front[0].setScaleX((1 - a) * this.Bs[0]);
      this.front[1].setScaleX((-1 + a) * this.Bs[1]);
      this.front[0].setX(this.cs[0] - a * this.le[0].getWidth());
      this.front[1].setX(this.cs[1] + a * this.le[1].getWidth());
      if (this.Qn != null) {
        this.Qn.Vw(-a);
        this.front[1].pp(this.Qn);
      }
      let b = this.O.jd ? this.Sm ? 1 : 1.75 : 1;
      this.le[0].setScaleX(a);
      this.le[0].setX(this.front[0].getX() + this.front[0].getWidth());
      this.le[1].setScaleX(a);
      this.le[1].setX(this.front[1].getX() - this.front[1].getWidth() - this.le[1].getWidth());
      this.zb[0].setScaleX((1 - a) * b);
      this.zb[0].setX(this.le[0].getX());
      this.zb[0].W(1 - a);
      this.zb[1].setScaleX((1 - a) * b);
      this.zb[1].setX(this.le[1].getX() + this.le[1].getWidth());
      this.zb[1].W(1 - a);
      this.Pc.W((1 - a) * 0.5);
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
      this.T = a;
      a.W(0);
      this.time = this.state = 0;
    }
    show() {
      this.setState(1);
    }
    oh() {
      this.time = 0;
      this.setState(3);
    }
    update(a) {
      this.time += a;
      switch (this.state) {
        case 1:
          a = Math.min(this.time / 1, 1);
          this.T.W(a);
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
          this.T.W(1 - a);
          if (a == 1) {
            this.setState(0);
            this.T.L(false);
          }
      }
    }
    M() {
      this.T.setX(this.x);
      this.T.setY(this.y);
      this.T.la(this.rotation);
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
      c.Tf(true);
      c.Wd(2);
      c.W(0.7);
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
      this.U = new Sprite();
      this.U.setColor(new Vec4(0.17647058823529413, 0.17647058823529413, 0.17647058823529413, 1), a.Ag, a.zg);
      this.U.W(0);
      let b = new AnimTimeline();
      b.La(0, 0);
      b.La(0, 0.3);
      b.La(0.2, 0.6);
      new SpriteAnimator(this.U).play(b);
      a.ma(0).P(this.U.u);
    }
    free() {
      this.U.free();
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
      this.j = new Container();
      this.Nn = new Sprite(this.j);
      this.Nn.setColor(new Vec4(1, 1, 1, 0.5), 400, 100);
      this.Nn.setX(-200);
      this.Nn.setY(-50);
      let b = [1, 1.6, 2, 1.6, 2, 2, 2.2, 2, 1.6, 2, 2, 1, 1.6];
      let c = [603, 20, 350, 27, 38, 60, 471, 68, 306, 71, 197, 104, 622, 110, 144, 131, -44, 133, 544, 136, 307, 151, 409, 156, 61, 157];
      let d = 0;
      let e = 0;
      let f = b.length;
      while (e < f) {
        let g = new Sprite(this.j, Resources.Kd, Keys.iI);
        g.center();
        g.setUniformScale(b[e++] * 0.7);
        g.setX(c[d++] / 600 * 400 - 200);
        g.setY(c[d++] / 187 * 100 - 50);
      }
      this.wc = new TextNode(this.j, Resources.ji);
      this.wc.setText(a);
      this.wc.setBoxSize(500, 100);
      this.wc.setFontSize(40);
      this.wc.setAlign(0, 0);
      this.wc.Tf(true);
      this.wc.setX(this.Nn.getX() - 50);
      this.wc.setY(this.Nn.getY());
      this.state = 0;
    }
    dispose() {
      super.dispose();
      this.j.free();
    }
    update(a) {
      super.update(a);
      a = this.O.fa.dr().hi(0.6666666666666666);
      this.j.setX((a.A + a.B) / 2);
      this.j.setY(a.G - 150);
      this.j.setUniformScale((a.B - a.A) / 600);
      switch (this.state) {
        case 0:
          a = this.jb(0.5);
          let b = Easing.backOut(0.1)(a);
          let c = this.j;
          c.setUniformScale(c.Ra * b);
          this.j.W(a);
          if (a == 1) {
            this.state = 1;
            this.time = 0;
          }
          break;
        case 1:
          if (this.O.hd().Nb(0) && this.time > 2) {
            this.time = 0;
            this.state = 2;
          }
          break;
        case 2:
          a = this.jb(0.25);
          this.j.W(1 - a);
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
      super.Qr();
      let a = this.parent;
      this.Wc = new Sprite(a.ra, Resources.Wa, Keys.kL);
      this.Wc.center();
      this.Wc.setX(378);
      this.Wc.setY(364);
      this.Wc.W(0);
      this.Bf = new Sprite(a.ra, Resources.Wa, Keys.lL);
      this.Bf.setX(368);
      this.Bf.setY(354);
      this.Bf.W(0);
    }
    update(a) {
      super.update(a);
      this.Wc.setUniformScale(remap(Math.sin(this.time * 10), -1, 1, 1, 1.1));
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
          a = this.jb(0.5);
          this.Wc.W(a);
          this.Bf.W(a);
          this.Bf.setX(428 + Easing.quadOut()(a) * -60);
          this.Bf.setY(414 + Easing.quadOut()(a) * -60);
          if (a == 1) {
            this.time = 0;
            this.state = 2;
          }
          break;
        case 2:
          var b = this.jb(0.25);
          this.Bf.setUniformScale(remap(b, 0, 1, 1, 0.9));
          if (b == 1) {
            this.time = 0;
            this.state = 3;
            a.I.Fb(a.I.qf == Keys.kz ? Keys.jz : Keys.kz);
            a.fC();
          }
          break;
        case 3:
          b = this.jb(0.5);
          this.Bf.setUniformScale(remap(Easing.quadOut()(b), 0, 1, 0.9, 1));
          if (b == 1) {
            this.time = 0;
            this.state = a.I.qf == Keys.jz ? 5 : 4;
          }
          break;
        case 4:
          if (this.time > 1) {
            this.time = 0;
            this.state = 2;
          }
          break;
        case 5:
          a = this.jb(0.5);
          this.Wc.W(1 - a);
          this.Bf.W(1 - a);
          this.Bf.setX(368 + Easing.quadIn()(a) * 60);
          this.Bf.setY(354 + Easing.quadIn()(a) * 60);
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
