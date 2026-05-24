  class MovingEntity extends Entity {
    constructor() {
      super();
      this.$E = -1;
    }
    lx(a) {
      this.$E = a;
    }
    Sl() {
      return this.$E != -1;
    }
    Kj() {
      return new Vec2(this.x, this.y);
    }
    Jg(a) {
      this.x = a.x;
      this.y = a.y;
    }
    tg() {
      return null;
    }
    Yq() {
      let a = this.tg();
      return (a.x + a.y) / 4;
    }
    NR(a) {
      this.Dj = a.x;
    }
    NC() {}
    Ji(a) {
      this.rotation = a.angle ?? 0;
      let b = a.path;
      if (b != null) {
        let c = PathResolver.Ey;
        if (b.charAt(0) == "R") {
          c = Math.round(Numeric.parseInt(Std.substr(b, 2, null)) * 3 / 2 + 1);
        }
        a = new PathState(c, a.moveSpeed * LevelController.mn, a.rotateSpeed);
        a.angle = this.rotation;
        a.$D(b, this.x, this.y);
        this.YD(a);
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
      this.c = new AnimSequenceCtl();
      this.wf = a;
      this.I = b;
    }
    play(a) {
      let b = a.data[0];
      this.set(b.x, b.y);
      this.c.play(a);
      this.c.Yo = cachedBind(this, this.$P);
      this.c.ik = cachedBind(this, this.ik);
      this.lq(this.c);
    }
    ik() {
      this.free();
      this.wf.tq = null;
    }
    $cachedBind(a, b, c) {
      let d = a.x;
      a = a.y;
      this.set(d + (b.x - d) * c, a + (b.y - a) * c);
    }
    set(a, b) {
      this.I.g.x = this.wf.x + a;
      this.I.g.y = this.wf.y + b;
      this.I.ha.x = this.I.g.x;
      this.I.ha.y = this.I.g.y;
    }
  }
  BezierMover.i = true;
  BezierMover.s = MotionBase;
  Object.assign(BezierMover.prototype, {
    l: BezierMover
  });
  class CharacterController {
    constructor(a) {
      this.S = a;
      this.be = null;
      this.Bq = -1;
      this.oC = false;
      this.El = [];
    }
    update(a) {
      let b = 0;
      let c = this.El;
      while (b < c.length) {
        c[b++].update(a);
      }
    }
    M() {
      let a = 0;
      let b = this.El;
      while (a < b.length) {
        b[a++].M();
      }
    }
    yu(a) {
      if (this.be == null) {
        return false;
      } else if (this.be.isActive) {
        return this.be.yu(a);
      } else {
        return false;
      }
    }
    Du(a) {
      if (this.be != null) {
        this.be.Du(a);
      }
    }
    yi() {
      if (this.be == null) {
        return false;
      } else {
        return this.be.yi();
      }
    }
    oa(a, b) {
      this.El.push(a);
      if (b == 1) {
        this.xf = new Container();
        var c = new Sprite(this.xf, Resources.wf, Keys.nH);
        c.setUniformScale(0.4);
        c.center();
        c = new Sprite(this.xf, Resources.wf, Keys.kH);
        c.setUniformScale(0.4);
        c.center();
        a.eC(this.xf, a.da);
        this.be = a;
        this.Bq = b;
      }
    }
    jk(a, b, c) {
      if (this.be == null) {
        return false;
      } else if (this.be.isActive && this.be.yi() && this.be.jk(a, b, c)) {
        this.be.kR();
        return true;
      } else {
        return false;
      }
    }
    tN() {
      if (!this.oC) {
        var a = this;
        var b = Lambda.find(this.El, function (e) {
          return e.index == a.Bq;
        });
        var c = this.Bq + 1;
        if (c == this.El.length + 1) {
          c = 1;
        }
        var d = Lambda.find(this.El, function (e) {
          return e.index == c;
        });
        d.eC(this.xf, b.da);
        b.da = null;
        this.Bq = c;
        this.be = d;
      }
    }
    ZO() {
      this.oC = true;
    }
  }
  CharacterController.i = true;
  Object.assign(CharacterController.prototype, {
    l: CharacterController
  });
  class Character extends MovingEntity {
    constructor(a) {
      super();
      this.bs = false;
      this.j = new Container();
      this.Pm = new Sprite(null, Resources.ca, X.ym() ? Keys.aH : Keys.bH);
      this.Pm.center();
      this.Pm.setUniformScale(0.4);
      this.j.appendChild(this.Pm);
      this.ca = new Sprite(null, Resources.ca, Keys.Jy);
      this.ca.setUniformScale(0.4);
      this.ca.center();
      this.j.appendChild(this.ca);
      a.ma(5).P(this.j.u);
      a = Character.iy.w / 2;
      let b = Character.iy.J / 2;
      a = this.ea = new Bounds(0 - a, 0 - b, a, b);
      this.sa = new Bounds(a.A, a.D, a.B, a.G);
    }
    pop() {
      this.ca.L(false);
      this.bs = true;
    }
    update(a) {
      super.update(a);
      this.pe();
    }
    M() {
      this.Pm.setX(this.x);
      this.Pm.setY(this.y);
      this.ca.setX(this.x);
      this.ca.setY(this.y);
      this.ca.setUniformScale(this.Dj * 0.4);
      if (this.qF || this.Sl()) {
        this.Pm.L(false);
      }
    }
    tg() {
      let a = Resources.ca.hc.yf(Keys.Jy).Od;
      return new Vec2(a.w * 0.4, a.J * 0.4);
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
        d = new Sprite(b.j, Resources.de, Keys.jj(Keys.Wp, d));
        d.center();
        return d;
      }
      this.j = new Container();
      this.fc = [];
      let b = this;
      if (BeeAnims.zn == null) {
        BeeAnims.zn = AnimTimeline.parse("0,s.32<x34<y9<,.48,s.31>x33>y8>,.96,s.30<x34<y7<,1.44,s.31>x34>y9>,1.92,s.32x33y8,2.4,x34y9");
      }
      var c = new SpriteAnimator(a(0));
      c.loop(BeeAnims.zn);
      this.fc.push(c);
      if (BeeAnims.An == null) {
        BeeAnims.An = AnimTimeline.parse("-100,s.38>,-99.,s.4<,-99.,s.38>,-98.,s.37,0,sx.37sy.4x26<y23<,.4,x25>y22>,.8,x24<y21<,1.20,x25>y22>,1.6,x26y23");
      }
      c = new SpriteAnimator(a(1));
      c.loop(BeeAnims.An);
      this.fc.push(c);
      if (BeeAnims.Pz == null) {
        BeeAnims.Pz = AnimTimeline.parse("0,s.13<x-34<y4<,.43,s.14>x-35>y3>,.86,s.16<x-36<y2<,1.29,s.14>x-35>y3>,1.72,s.13x-34y4");
      }
      c = new SpriteAnimator(a(1));
      c.loop(BeeAnims.Pz);
      this.fc.push(c);
      if (BeeAnims.Xh == null) {
        BeeAnims.Xh = AnimTimeline.parse("0,s.24<x-30<y17<,.42,s.22>x-29>y16>,.84,s.21<x-28<y15<,1.26,s.22>x-29>y16>,1.68,s.24x-30y17");
      }
      c = new SpriteAnimator(a(0));
      c.loop(BeeAnims.Xh);
      this.fc.push(c);
      if (BeeAnims.Wh == null) {
        BeeAnims.Wh = AnimTimeline.parse("0,s.37<x-2<y31<,.47,s.38>x-3>y32>,.94,s.4<x-4<y33<,1.41,s.38>x-3>y32>,1.88,s.37x-2y31");
      }
      c = a(4);
      c.la(350);
      c = new SpriteAnimator(c);
      c.loop(BeeAnims.Wh);
      this.fc.push(c);
    }
    free() {
      this.j.free();
      this.j = null;
    }
  }
  BeeAnims.i = true;
  Object.assign(BeeAnims.prototype, {
    l: BeeAnims
  });

  class Bee extends Character {
    constructor(a) {
      super(a.S);
      this.de = a;
      this.alpha = 1;
      this.state = 0;
      this.Cb = new BeeAnims();
      this.j.appendChild(this.Cb.j);
    }
    free() {
      this.j.free();
      this.j = null;
      this.Cb.free();
      this.Cb = null;
    }
    Pl() {
      return this.state < 0;
    }
    Io() {
      if (this.state != 1) {
        this.state = 1;
        this.time = 0;
      }
    }
    Jo() {
      if (this.state != -1) {
        this.state = -1;
        this.time = 0;
      }
    }
    pop() {
      super.pop();
      this.Cb.j.L(false);
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
          this.de.uD();
        }
      }
    }
    M() {
      super.M();
      if (this.Cb != null) {
        this.Cb.j.setX(this.x);
        this.Cb.j.setY(this.y);
      }
      this.j.W(this.alpha);
    }
  }
  Bee.i = true;
  Bee.s = Character;
  Object.assign(Bee.prototype, {
    l: Bee
  });
  class OmNom extends Entity {
    constructor(a, b) {
      super();
      this.S = a;
      this.Xa = 0;
      this.Cf = false;
      this.x = b.x * WorldScale.scale;
      this.y = b.y * WorldScale.scale;
      this.BB = X.xh(5, 20);
      this.ru = 3;
      this.Xz = false;
      this.time = 0;
      b = a.ma(1);
      this.Cp = new Sprite(null, Resources.wq);
      this.Cp.center();
      this.Cp.setUniformScale(0.4);
      b.P(this.Cp.u);
      this.Ln = new Container();
      this.Ln.setUniformScale(0.4);
      this.char = new Sprite(this.Ln, Resources.Fu, Keys.IF);
      this.char.center();
      b.P(this.Ln.u);
      this.blink = new Sprite(null, Resources.Fu, Keys.EF);
      this.blink.center();
      this.blink.setUniformScale(0.4);
      this.blink.L(false);
      b.P(this.blink.u);
      var c = Rect.Zb(OmNom.jK);
      c.x -= 128;
      c.y -= 128;
      let d = c.x;
      let e = c.y;
      c = this.ea = new Bounds(d, e, d + c.w, e + c.J);
      this.sa = new Bounds(c.A, c.D, c.B, c.G);
      this.pe();
      this.Cp.setX(this.x + Math.round(vLN023 * 0.4));
      this.Cp.setY(this.y + Math.round(vLN024 * 0.4));
      if (a.$c) {
        this.ff = new Sprite(null, Resources.ml);
        this.ff.setUniformScale(0.4);
        this.ff.pa().loop(OM_NOM_ZZZ_ANIM);
        this.ff.center();
        this.ff.setX(this.x);
        this.ff.setY(this.y);
        b.P(this.ff.u);
        this.gf = new Sprite(null, Resources.ml);
        this.gf.setUniformScale(0.4);
        this.gf.pa().loop(OM_NOM_ZZZ_ANIM_REV);
        this.gf.center();
        this.gf.setX(this.x);
        this.gf.setY(this.y);
        b.P(this.gf.u);
      }
      this.fe = null;
      this.Om = 0;
      this.Ss = -1;
      this.Fc(0);
    }
    JQ() {
      if (!this.Cf && !this.sr) {
        this.Fc(10);
      }
    }
    KQ() {
      if (!this.Cf && this.In()) {
        this.Fc(1);
      }
    }
    LQ() {
      if (!this.Cf && this.In()) {
        this.Fc(2);
      }
    }
    NQ() {
      if (!this.Cf && this.In()) {
        this.Fc(7);
      }
    }
    MQ() {
      if (!this.Cf && this.In()) {
        this.Fc(8);
      }
    }
    EQ() {
      if (!this.Cf) {
        this.Fc(5);
        this.DE();
      }
    }
    PQ() {
      if (!this.Cf) {
        this.Fc(6);
        this.DE();
        this.Cf = true;
      }
    }
    YC() {
      if (!this.Cf && this.In()) {
        this.Fc(3);
      }
    }
    $C() {
      if (!this.Cf) {
        this.Fc(11);
      }
    }
    IQ() {
      this.Fc(12);
      this.sr = true;
      SoundFx.play(SoundFx.sp_field);
      if (this.S.$c) {
        this.ff.L(false);
        this.gf.L(false);
      }
    }
    HQ() {
      if (this.Xa != 12) {
        this.Fc(13);
      }
    }
    GQ() {
      switch (this.Xa) {
        case 7:
        case 8:
        case 14:
          break;
        default:
          this.Fc(14);
      }
    }
    IO() {
      switch (this.Xa) {
        case 0:
        case 1:
        case 2:
          return true;
        default:
          return false;
      }
    }
    Lm(a) {
      if (this.sr) {
        this.fe = true;
      } else if (this.fe != a) {
        let b = this.fe == null;
        this.fe = a;
        if (b) {
          this.$C();
        } else if (a) {
          this.YC();
          this.ff.pa().stop();
          this.ff.L(false);
          this.gf.pa().stop();
          this.gf.L(false);
          SoundFx.stop(this.Ss);
          this.char.setScaleY(1);
        } else if (!this.Cf) {
          this.Om = 0;
          this.$C();
          this.ff.pa().play(OM_NOM_ZZZ_ANIM);
          this.ff.L(true);
          this.gf.pa().play(OM_NOM_ZZZ_ANIM_REV);
          this.gf.L(true);
        }
      }
    }
    In() {
      if (this.S.$c) {
        return this.fe;
      } else {
        return true;
      }
    }
    DE() {
      if (this.S.$c) {
        SoundFx.stop(this.Ss);
        this.ff.L(false);
        this.gf.L(false);
        this.Om = 0;
      }
    }
    Fc(a) {
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
      this.char.Uf(b);
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
      this.Xa = a;
      if (b) {
        this.char.pa().loop(OM_NOM_ANIMS[a]);
      } else {
        this.char.pa().play(OM_NOM_ANIMS[a], a == 2 ? 2 : 1).Be(cachedBind(this, this.ZP));
      }
    }
    ZP() {
      let a = this;
      switch (this.Xa) {
        case 0:
          this.ru--;
          if (this.ru == 0) {
            this.blink.L(true);
            this.blink.pa().play(OM_NOM_BLINK_ANIM).Be(function () {
              a.blink.L(false);
            });
            this.ru = 3;
          }
          if (--this.BB == 0) {
            if (X.ym()) {
              this.KQ();
            } else {
              this.LQ();
            }
            this.BB = X.xh(5, 20);
          } else {
            this.Fc(0);
          }
          break;
        case 1:
        case 2:
        case 3:
        case 4:
          this.Fc(0);
          break;
        case 6:
          this.Fc(9);
          break;
        case 8:
          if (this.sr) {
            this.Fc(13);
          } else {
            this.Fc(4);
          }
          break;
        case 10:
          this.Fc(0);
          break;
        case 11:
          this.Xz = true;
          break;
        case 12:
          this.Fc(13);
      }
    }
    update(a) {
      super.update(a);
      this.pe();
      if (this.S.$c && !this.sr) {
        if (this.Xz) {
          let b = remap(Math.sin(this.time * 2), -1, 1, 0.95, 1.05);
          this.char.setOrigin(0, 433);
          this.char.setScaleY(b);
          this.time += a;
        }
        if (!this.fe) {
          this.Om += a;
          if (this.Om > 4) {
            this.Om = 0;
            this.Ss = [1041, 1040, 1039][X.xh(0, 2)];
            SoundFx.play(this.Ss);
          }
        }
      }
    }
    M() {
      super.M();
      this.sa.A = this.x + this.ea.A;
      this.sa.D = this.y + this.ea.D;
      this.sa.B = this.x + this.ea.B;
      this.sa.G = this.y + this.ea.G;
      this.Ln.setX(this.x);
      this.Ln.setY(this.y);
      this.blink.setX(this.x);
      this.blink.setY(this.y);
    }
  }
  OmNom.i = true;
  OmNom.s = Entity;
  Object.assign(OmNom.prototype, {
    l: OmNom
  });
