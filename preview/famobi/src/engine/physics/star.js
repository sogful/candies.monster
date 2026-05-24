  class BonusStar extends MovingEntity {
    constructor(a) {
      super();
      this.S = a;
      this.Ij = this.time = 0;
      this.j = new Container();
      this.j.setUniformScale(0.4);
      a.ma(11).P(this.j.u);
    }
    hT() {
      this.j.L(true);
      this.Wc = new Sprite(this.j, Resources.Oa, Keys.nI);
      this.Wc.center();
      this.Wc.setUniformScale(0.4);
      var a = new AnimTimeline();
      a.vc(0.01, 0);
      a.vc(1, 0.2);
      a.La(0, 0);
      a.La(1, 0.2);
      new SpriteAnimator(this.Wc).play(a);
      this.Oa = new Sprite(this.j, Resources.Oa, Keys.pI);
      this.Oa.center();
      this.Oa.pa().loop(STAR_IDLE_BLUE_ANIM);
      this.Oa.pa().Cw();
      a = new AnimTimeline();
      a.vc(0, 0);
      a.vc(1, 0.2);
      a.La(0, 0);
      a.La(1, 0.2);
      new SpriteAnimator(this.Oa).play(a);
      this.qx = new Sprite(this.j, Resources.Oa, Keys.yI);
      this.qx.center();
      this.qx.setUniformScale(0.4);
      a = new AnimTimeline();
      a.vc(0.01, 0);
      a.vc(1, 0.205);
      a.vc(1.5, 0.505);
      a.La(0, 0);
      a.La(1, 0.05);
      a.La(1, 0.305);
      a.La(0, 0.505);
      new SpriteAnimator(this.qx).play(a, function () {});
    }
    Iu() {
      this.time = 0;
      this.nM = true;
      SoundFx.play(SoundFx.sp_cloverleaf);
      var a = new AnimTimeline();
      a.La(1, 0);
      a.La(1, 0.05);
      a.La(0, 0.805);
      a.yk(1, 0);
      a.yk(1, 0.05);
      a.yk(360, 0.805);
      a.vc(1, 0);
      a.vc(1, 0.05);
      a.vc(0.01, 0.805);
      new SpriteAnimator(this.Oa).play(a);
      a = new AnimTimeline();
      a.La(1, 0);
      a.La(1, 0.05);
      a.La(0, 0.805);
      a.vc(1, 0);
      a.vc(1, 0.05);
      a.vc(0.01, 0.805);
      new SpriteAnimator(this.Wc).play(a);
      for (a = 0; a < 6;) {
        var b = a++;
        var c = b * TWO_PI / 6;
        let d = new Sprite(this.j, Resources.Oa, Keys.zI);
        d.setUniformScale((b & 1) == 0 ? 0.5 : 1);
        d.center();
        b = Math.cos(c) * Star.bg * 10;
        c = Math.sin(c) * Star.bg * 10;
        d.tween().x(b, 1);
        d.tween().y(c, 1);
        d.tween().scale(0, 1);
        d.tween().alpha(0, 1, Easing.quadIn());
        d.tween().rotation(360, 1);
      }
    }
    free() {
      this.j.free();
      this.j = null;
    }
    update(a) {
      super.update(a);
      if (this.j != null) {
        this.Ij += a;
        var b = Math.sin(this.Ij * 3) * 3;
        for (var c = 0, d = this.j.Mj(); c < d;) {
          this.j.nb(c++).setY(b);
        }
        this.time += a;
        if (this.nM && this.time > 1) {
          this.free();
        }
      }
    }
    tg() {
      let a = this.ea;
      let b = this.ea;
      return new Vec2((a.B - a.A) * 0.9, (b.G - b.D) * 0.9);
    }
    Yq() {
      return 8;
    }
    M() {
      if (this.j != null) {
        super.M();
        this.j.setX(this.x);
        this.j.setY(this.y);
      }
    }
  }
  BonusStar.i = true;
  BonusStar.s = MovingEntity;
  Object.assign(BonusStar.prototype, {
    l: BonusStar
  });
  class Star extends MovingEntity {
    constructor(a) {
      super();
      this.S = a;
      this.fe = null;
      var b = Rect.Zb(Star.iK);
      var c = b.w / 2;
      b = b.J / 2;
      c = this.ea = new Bounds(0 - c, 0 - b, c, b);
      this.sa = new Bounds(c.A, c.D, c.B, c.G);
      this.timeout = 0;
      this.time = X.gi() * 2;
      this.Ij = 0;
      this.j = new Container();
      this.Wc = new Sprite(this.j, Resources.Oa, Keys.mI);
      this.Wc.center();
      this.Wc.setUniformScale(0.4);
      if (a.$c) {
        this.Ik = new Sprite(this.j, Resources.Oa, Keys.sI);
        this.Ik.center();
        this.Ik.setUniformScale(0.4);
      }
      this.Oa = new Sprite(this.j, Resources.Oa, Keys.oI);
      this.Oa.center();
      this.Oa.setUniformScale(0.4);
      this.Oa.setUniformScale(0.4);
      this.Oa.pa().loop(STAR_IDLE_ANIM);
      this.Oa.pa().Cw();
      if (a.$c) {
        this.Ik.pa().loop(STAR_IDLE_OFF_ANIM);
        this.Ik.pa().setTime(0);
        this.Ik.W(0);
        this.Ei = new Sprite(this.j, Resources.Oa, Keys.wI);
        this.Ei.center();
        this.Ei.setUniformScale(0.4);
        this.Ei.L(false);
        this.Ei.Wd(3);
        this.Zj = new Sprite(this.j, Resources.Oa, Keys.uI);
        this.Zj.center();
        this.Zj.setUniformScale(0.4);
        this.Zj.L(false);
      }
      a.ma(11).P(this.j.u);
    }
    Lm(a) {
      let b = this.fe == null;
      if (this.fe != a) {
        if (a) {
          if (!b) {
            this.Ei.L(true);
            this.Ei.pa().play(STAR_LIGHT_UP_ANIM);
            this.Ei.pa().Be(cachedBind(this, this.hQ));
            SoundFx.play(X.ym() ? SoundFx.star_light01 : SoundFx.star_light02);
          }
        } else if (b) {
          this.Wc.W(0);
          this.Oa.W(0);
        } else {
          this.Zj.L(true);
          this.Zj.pa().play(STAR_LIGHT_DOWN_ANIM);
          this.Zj.pa().Be(cachedBind(this, this.gQ));
        }
        this.fe = a;
      }
    }
    free() {
      this.j.free();
    }
    setTimeout() {
      this.time = this.timeout;
      this.Fp = new Sprite(null, Resources.Oa, Keys.AI);
      this.Fp.setUniformScale(0.4);
      this.Fp.center();
      this.j.appendChild(this.Fp);
      this.j.Ww(this.Fp, 0);
    }
    gQ() {
      this.Zj.L(false);
    }
    hQ() {
      this.Ei.L(false);
    }
    update(a) {
      super.update(a);
      this.Ij += a;
      if (this.S.$c) {
        if (this.fe) {
          var b = this.Wc;
          b.W(b.Uc + 0.1);
          b = this.Ik;
          b.W(b.Uc - 0.1);
          b = this.Oa;
          b.W(b.Uc + 0.1);
        } else {
          b = this.Wc;
          b.W(b.Uc - 0.1);
          b = this.Ik;
          b.W(b.Uc + 0.1);
          b = this.Oa;
          b.W(b.Uc - 0.1);
        }
      }
      b = Math.sin(this.Ij * 3) * 3;
      if (this.Sl()) {
        b = 0;
      }
      let c = 0;
      let d = this.j.Mj();
      while (c < d) {
        this.j.nb(c++).setY(b);
      }
      this.sa.A = this.x + this.ea.A;
      this.sa.D = this.y + this.ea.D;
      this.sa.B = this.x + this.ea.B;
      this.sa.G = this.y + this.ea.G;
      if (this.timeout > 0 && this.S.di <= 0) {
        this.Fp.Fb(Keys.jj(Keys.BI, (1 - this.time / this.timeout) * 35 | 0));
        if (this.time > 0) {
          this.time = PathResolver.dk(this.time, 0, 1, a);
        }
      }
    }
    tg() {
      let a = this.ea;
      let b = this.ea;
      return new Vec2((a.B - a.A) * 0.9, (b.G - b.D) * 0.9);
    }
    Yq() {
      return 8;
    }
    M() {
      super.M();
      this.j.setX(this.x);
      this.j.setY(this.y);
      this.j.setUniformScale(this.Dj);
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
      this.j = new Container();
      this.j.W(0.75);
      this.fc = [];
      this.ab = [];
      let a = 0;
      while (a < 4) {
        ++a;
        let b = new Sprite(null, Resources.Oa, "star_effect");
        b.center();
        b.Wd(3);
        b.L(false);
        this.ab.push(b);
        this.j.appendChild(b);
      }
      this.j.setUniformScale(0.4);
      this.BC = 0;
      SoundFx.play(SoundFx.magnet_idle, true);
      this.Hk = new AnimTimeline();
      this.Hk.vc(1, 0);
      this.Hk.vc(1, 0);
      this.Hk.vc(0, 2);
      this.Hk.La(0, 0);
      this.Hk.La(1, 1);
      this.Hk.La(0, 2);
      this.time = 1;
    }
    update(a) {
      this.time += a;
      if (this.BC < 4 && this.time > 0.5) {
        this.time = 0;
        var b = this.ab[this.BC++];
        b.L(true);
        new SpriteAnimator(b).loop(this.Hk);
      }
      for (b = 0; b < 4;) {
        let c = this.ab[b++];
        c.la(c.Zd + a * 90);
      }
    }
    M() {
      this.j.setX(this.x);
      this.j.setY(this.y);
    }
    free() {
      SoundFx.stop(SoundFx.magnet_idle);
      this.j.free();
    }
  }
  ThreeStarsCollect.i = true;
  ThreeStarsCollect.s = GameObject;
  Object.assign(ThreeStarsCollect.prototype, {
    l: ThreeStarsCollect
  });
