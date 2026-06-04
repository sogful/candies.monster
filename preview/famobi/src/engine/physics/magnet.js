  class MagnetEffect extends GameObject {
    constructor(a, b, c) {
      super();
      this.hM = b;
      this.Qi = c;
      this.yl = 0;
      this.isActive = false;
      this.j = new Container();
      a.ma(0).P(this.j.u);
      this.qk = new MagnetInner(a.ma(12));
      this.rk = new MagnetOuter(a.ma(12));
      a = new AnimTimeline();
      a.vc(0.27999999999999997, 0);
      a.vc(0.4, 0.5);
      a.vc(0.27999999999999997, 1);
      a.yk(0, 0);
      a.yk(360, 1);
      this.Di = new Sprite(null, Resources.Kd, Keys.gI);
      this.Di.center();
      this.Di.Wd(3);
      this.Di.L(false);
      this.j.appendChild(this.Di);
      new SpriteAnimator(this.Di).loop(a);
    }
    free() {
      this.j.free();
      this.j = null;
      this.qk.free();
      this.rk.free();
      SoundFx.stop(SoundFx.sp_telekinesis);
    }
    TD(a) {
      if (a && !this.isActive) {
        this.rk.reset();
        this.yl = 0;
        this.state = 1;
        SoundFx.play(SoundFx.sp_telekinesis, true);
      }
      if (!a && this.isActive) {
        this.state = 0;
        this.yl = vLN01;
        SoundFx.stop(SoundFx.sp_telekinesis);
      }
      this.qk.Os(a);
      this.rk.Os(a);
      this.Di.L(a);
      this.isActive = a;
    }
    update(a) {
      if (this.j != null && (super.update(a), this.yl = PathResolver.dk(this.yl, this.state == 0 ? 0 : 0.3, 1, a), this.isActive)) {
        let b = this.state == 1 ? this.yl / 0.3 : this.yl / vLN01;
        this.qk.x = this.Qi.x;
        this.qk.y = this.Qi.y;
        this.qk.update(a);
        this.qk.alpha = b;
        this.rk.alpha = b * 0.5;
        this.rk.qT(this.Qi, this.hM);
        this.rk.update(a);
      }
    }
    M() {
      if (this.j != null) {
        super.M();
        if (this.isActive) {
          this.Di.setX(this.Qi.x);
          this.Di.setY(this.Qi.y);
          this.qk.M();
          this.rk.M();
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
      this.j = new Container();
      a.P(this.j.u);
      this.xt = 4;
      this.xT = 2;
      this.pF = [];
      a = 0;
      let b = this.xt;
      while (a < b) {
        ++a;
        let c = new Sprite(this.j, Resources.Kd, Keys.jI);
        c.center();
        c.Wd(3);
        this.pF.push(c);
      }
      this.mD = 1.25;
      this.HD = 2;
      this.RL = 0.7;
      this.uc = 0;
      this.Os(false);
    }
    free() {
      this.j.free();
      this.j = null;
    }
    Os(a) {
      this.j.L(a);
    }
    $R(a) {
      this.uc = a > HALF_PI ? 0 : a;
    }
    update(a) {
      this.$R(this.uc + a / this.xT);
    }
    M() {
      if (this.j != null) {
        var a = Array(4);
        for (var b = 0, c = this.xt; b < c;) {
          var d = b++;
          a[d] = this.uc + d * HALF_PI / this.xt;
        }
        b = 0;
        for (c = this.xt; b < c;) {
          d = b++;
          let e = this.pF[d];
          if (a[d] > HALF_PI) {
            a[d] -= HALF_PI;
          }
          let f = this.RL * Math.cos(a[d]) * this.alpha;
          if (d % 2 != 0) {
            e.la(this.HD * 360 * a[d] / PI);
          } else {
            e.la(-this.HD * 360 * a[d] / PI);
          }
          e.setScaleX(this.mD * Math.sin(a[d]) * 0.4);
          e.setScaleY(this.mD * Math.sin(a[d]) * 0.4);
          e.setX(this.x);
          e.setY(this.y);
          e.W(f);
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
      this.Xs = new Vec2(0, 0);
      this.uc = this.length = 0;
      this.j = new Container();
      a.P(this.j.u);
      this.wb = [];
      for (a = 0; a < 4;) {
        ++a;
        let b = new Sprite(this.j, Resources.Kd, "ray");
        b.Wd(3);
        b.W(0.3);
        b.L(false);
        this.wb.push(b);
      }
    }
    free() {
      this.j.free();
      this.j = null;
    }
    Os(a) {
      if (this.j != null) {
        this.j.L(a);
      }
    }
    qT(a, b) {
      b = Vec2.Ia(b, a);
      this.length = b.Rb();
      this.rotation = Math.atan2(b.y, b.x) * RAD2DEG - 90;
      this.Xs.x = a.x;
      this.Xs.y = a.y;
    }
    reset() {
      this.uc = 0;
    }
    update() {
      this.uc += 0.05;
      let a = 0;
      while (a < 4) {
        this.wb[a++].SR(this.uc);
      }
    }
    M() {
      if (this.j != null) {
        var a = Math.ceil(this.length / (this.wb[0].X.y / 4));
        if (a > 4) {
          a = 4;
        }
        for (var b = 0; b < 4;) {
          this.wb[b++].L(false);
        }
        for (var c = b = 0; c < a;) {
          let d = c++;
          let e = this.wb[d];
          b += e.X.y;
          e.setX(-e.X.x / 2);
          e.setY(d * e.X.y);
          e.L(true);
        }
        this.j.setScaleX(0.27999999999999997);
        this.j.setScaleY(this.length / b);
        this.j.setX(this.Xs.x);
        this.j.setY(this.Xs.y);
        this.j.la(this.rotation);
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
      this.S = a;
      this.I = b;
      this.j = new Container();
      a.ma(0).P(this.j.u);
      this.Nc = new Sprite(this.j, Resources.Kd, Keys.bI);
      this.Nc.center();
      this.Nc.L(false);
      this.Nc.la(0);
      this.Nc.setUniformScale(0.5);
      this.Nc.Wd(4);
      this.uc = this.Aq = 0;
      this.Wf = new SmokeEmitter(a, 10);
    }
    free() {
      this.Nc.free();
      this.Wf.free();
      this.j.free();
      this.j = null;
    }
    IA(a, b) {
      if (!(this.Aq > 0)) {
        this.Aq = 0.064;
        this.Nc.setX(a.x);
        this.Nc.setY(a.y);
        this.Nc.L(true);
        this.Nc.W(1);
        this.Nc.la(90 - b);
        this.uc = 0;
        this.Wf.x = a.x;
        this.Wf.y = a.y;
        this.Wf.angle = -b;
        a = new Vec2(1, 0);
        a.rotate(-b * PI / 180);
        b = Vec2.Ob(a, 15);
        this.Wf.x -= b.x;
        this.Wf.y -= b.y;
        this.Wf.Qm(10);
        this.I.XC();
        SoundFx.play(SoundFx.sp_field_bounce);
      }
    }
    update(a) {
      if (this.j != null) {
        this.Aq -= a;
        this.uc += a * 15;
        if (this.uc >= PI) {
          this.Nc.L(false);
        }
        this.Nc.W(Math.sin(this.uc));
        this.Wf.update(a);
      }
    }
    M() {
      super.M();
      this.Wf.M();
    }
  }
  MagnetGlowFlash.i = true;
  MagnetGlowFlash.s = GameObject;
  Object.assign(MagnetGlowFlash.prototype, {
    l: MagnetGlowFlash
  });
