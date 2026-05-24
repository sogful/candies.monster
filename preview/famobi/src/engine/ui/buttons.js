  class ButtonBase extends UIWidget {
    constructor(a, b, c, d) {
      super();
      this.frame = b;
      this.Kl = c;
      if (a == null) {
        a = Resources.Wa;
      }
      this.T = new Sprite(null, a, this.frame = b);
      this.j.appendChild(this.T);
      this.icon = null;
      if (d != null) {
        this.icon = new Sprite(null, a, d);
        this.icon.centerOrigin();
        this.j.appendChild(this.icon);
      }
      a = this.T.X;
      this.ec = new Vec4(a.x, a.y, 0, 1);
      this.ke = 0;
    }
    reset() {
      this.T.Fb(this.frame);
    }
    $w(a) {
      if (this.focused) {
        a = true;
      }
      if (this.Kl != null) {
        this.j.nb(0).Fb(a ? this.Kl : this.frame);
      }
    }
    update(a) {
      super.update(a);
      if (this.ke > 0) {
        this.ke -= a;
        if (this.ke < 0) {
          this.T.Fb(this.frame);
          this.ke = 0;
        }
      }
    }
    focus() {}
    select() {
      super.select();
      this.ke = 0.2;
    }
    Ub(a) {
      return this.j.Ub(a);
    }
    static create(a, b, c, d) {
      return new ButtonBase(a, b, c, d);
    }
  }
  ButtonBase.i = true;
  ButtonBase.s = UIWidget;
  Object.assign(ButtonBase.prototype, {
    l: ButtonBase
  });
  class AlbumButton extends ButtonBase {
    constructor() {
      super(Resources.Wa, Keys.Uk, Keys.Vk, Keys.mK);
      let a = Save.kk;
      if (a != 0) {
        new Sprite(this.j, Resources.Wa, Keys.oK);
        if (a > 19) {
          a = 19;
        }
        new Sprite(this.j, Resources.Wa, "album/" + a);
      }
    }
  }
  AlbumButton.i = true;
  AlbumButton.s = ButtonBase;
  Object.assign(AlbumButton.prototype, {
    l: AlbumButton
  });

  class AdPowerupButton extends ButtonBase {
    constructor(a, b, c, d) {
      super(a, b, c);
      this.IL = d;
      this.pm = false;
      this.time = Math.random();
      this.setState("ENoAd");
    }
    ND(a) {
      switch (this.state) {
        case "EAd":
          this.setState(a ? "EAd" : "ENoAd");
          break;
        case "ENoAd":
          this.setState(a ? "EAd" : "ENoAd");
      }
    }
    use() {
      // Powerups are infinite (count starts at Infinity from statics.js).
      // Skip the decrement so we never re-enter the "needs ad" path.
      if (isFinite(this.count)) {
        this.count--;
        if (this.count == 0) {
          this.badge.free();
          this.badge = null;
        }
      }
    }
    fill(a) {
      this.count = a;
      this.setState("EFilled");
    }
    reject() {
      this.setState("ENoAd");
    }
    setState(a) {
      if (this.state != a) {
        this.state = a;
        switch (this.state) {
          case "EActive":
            a = new Sprite(null, Resources.Wa, this.IL);
            a.ox("glow");
            let b = new AnimTimeline();
            b.La(0, 0);
            b.La(1, 0.5);
            b.La(0, 1);
            new SpriteAnimator(a).loop(b);
            this.j.appendChild(a);
            if (this.badge != null) {
              this.j.Jm(this.badge);
            }
            break;
          case "EAd":
            this.re = new Sprite(null, Resources.Wa, "ads_icon");
            this.re.setX(120);
            this.re.setY(120);
            this.re.center();
            this.j.appendChild(this.re);
            this.j.W(1);
            this.Ad(false);
            break;
          case "EFilled":
            this.Ad(false);
            if (this.re != null) {
              this.re.free();
              this.re = null;
            }
            this.badge = new TextNode(this.j, Resources.ic);
            this.badge.setBoxSize(60, 60);
            this.badge.setX(105);
            this.badge.setY(70);
            this.badge.kp();
            this.badge.setText(isFinite(this.count) ? Numeric.Ed(this.count) : "∞");
            this.badge.setMultiline(false);
            break;
          case "ENoAd":
            this.j.W(0.5);
            this.Ad(true);
            if (this.re != null) {
              this.re.free();
              this.re = null;
            }
        }
      }
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case "EAd":
          if (this.re != null && this.time > 3 && !this.pm) {
            this.re.setY(100);
            this.re.tween().y(110, 1, Easing.elasticOut());
            this.time = 0;
          }
          this.j.W(this.pm ? 0.5 : 1);
          break;
        case "EFilled":
          this.j.W(this.pm ? 0.5 : 1);
      }
    }
    reset() {
      super.reset();
      let a = this.j.fo("glow");
      if (a != null) {
        a.free();
      }
      this.pm = false;
      switch (this.state) {
        case "EActive":
        case "EAd":
        case "ERequested":
          this.setState("ENoAd");
      }
    }
    select() {
      super.select();
      this.ke = 0;
      switch (this.state) {
        case "EActive":
        case "EAd":
          this.setState("ERequested");
          break;
        case "EFilled":
          this.setState("EActive");
      }
    }
    Ad(a) {
      switch (this.state) {
        case "EActive":
        case "ENoAd":
          a = true;
      }
      super.Ad(a);
    }
    getHeight() {
      return this.T.getHeight();
    }
    yv() {
      return this.j.getX() + this.T.getWidth() * this.j.Ra;
    }
    getWidth() {
      return this.T.getWidth() * this.j.Ra;
    }
  }
  AdPowerupButton.i = true;
  AdPowerupButton.s = ButtonBase;
  Object.assign(AdPowerupButton.prototype, {
    l: AdPowerupButton
  });
  class AdPowerupButtonA extends AdPowerupButton {
    constructor() {
      super(Resources.Wa, Keys.fz, Keys.gz, Keys.vK);
      if (AdPowerupButtonA.Mf > 0) {
        this.fill(AdPowerupButtonA.Mf);
      }
    }
    fill(a) {
      AdPowerupButtonA.Mf = a;
      super.fill(a);
    }
    use() {
      super.use();
      // no Mf-- - infinite powerups (see statics.js)
    }
    setState(a) {
      super.setState(a);
      switch (this.state) {
        case "EActive":
          this.frame = Keys.fz;
          this.Kl = Keys.gz;
          this.T.Fb(this.frame);
          break;
        case "EFilled":
          this.frame = Keys.wK;
          this.Kl = Keys.xK;
          this.T.Fb(this.frame);
      }
    }
  }
  AdPowerupButtonA.i = true;
  AdPowerupButtonA.s = AdPowerupButton;
  Object.assign(AdPowerupButtonA.prototype, {
    l: AdPowerupButtonA
  });
  class AdPowerupButtonB extends AdPowerupButton {
    constructor() {
      super(Resources.Wa, Keys.cz, Keys.dz, Keys.qK);
      if (AdPowerupButtonB.Mf > 0) {
        this.fill(AdPowerupButtonB.Mf);
      }
    }
    fill(a) {
      AdPowerupButtonB.Mf = a;
      super.fill(a);
    }
    use() {
      super.use();
      // no Mf-- - infinite powerups (see statics.js)
    }
    setState(a) {
      super.setState(a);
      switch (this.state) {
        case "EActive":
          this.frame = Keys.cz;
          this.Kl = Keys.dz;
          break;
        case "EFilled":
          this.frame = Keys.rK;
          this.Kl = Keys.sK;
          this.T.Fb(this.frame);
      }
    }
  }
  AdPowerupButtonB.i = true;
  AdPowerupButtonB.s = AdPowerupButton;
  Object.assign(AdPowerupButtonB.prototype, {
    l: AdPowerupButtonB
  });
  class LabelledButton extends ButtonBase {
    constructor(a, b, c) {
      super(null, a, b);
      this.wc = new TextNode(null, Resources.ic);
      this.wc.setBoxSize(this.T.X.x - 80, this.T.X.y - 50);
      this.wc.setX(40);
      this.wc.setY(25);
      this.wc.setText(c);
      this.wc.setAlign(0, 0);
      this.wc.setMultiline(false);
      this.j.appendChild(this.wc);
    }
    iF() {
      this.wc.Uf(Resources.ic);
      this.wc.setBoxSize(this.T.X.x - 80, this.T.X.y - 50);
      this.wc.setAlign(0, 0);
    }
    WD(a) {
      this.wc.kp();
      this.wc.setText(a);
      this.wc.setMultiline();
    }
    static ol(a) {
      return new LabelledButton(Keys.GK, Keys.HK, a);
    }
  }
  LabelledButton.i = true;
  LabelledButton.s = ButtonBase;
  Object.assign(LabelledButton.prototype, {
    l: LabelledButton
  });
