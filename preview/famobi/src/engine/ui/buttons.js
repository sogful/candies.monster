  class ButtonBase extends UIWidget {
    constructor(a, b, c, d) {
      super();
      this.frame = b;
      this.focusFrame = c;
      if (a == null) {
        a = Resources.Wa;
      }
      this.sprite = new Sprite(null, a, this.frame = b);
      this.container.appendChild(this.sprite);
      this.icon = null;
      if (d != null) {
        this.icon = new Sprite(null, a, d);
        this.icon.centerOrigin();
        this.container.appendChild(this.icon);
      }
      a = this.sprite.size;
      this.contentSize = new Vec4(a.x, a.y, 0, 1);
      this.debounce = 0;
    }
    reset() {
      this.sprite.setFrame(this.frame);
    }
    applyHover(a) {
      if (this.focused) {
        a = true;
      }
      if (this.focusFrame != null) {
        this.container.childAt(0).setFrame(a ? this.focusFrame : this.frame);
      }
    }
    update(a) {
      super.update(a);
      if (this.debounce > 0) {
        this.debounce -= a;
        if (this.debounce < 0) {
          this.sprite.setFrame(this.frame);
          this.debounce = 0;
        }
      }
    }
    focus() {}
    select() {
      super.select();
      this.debounce = 0.2;
    }
    hitTest(a) {
      return this.container.hitTest(a);
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
      let a = Save.pictureBadgeCount;
      if (a != 0) {
        new Sprite(this.container, Resources.Wa, Keys.oK);
        if (a > 19) {
          a = 19;
        }
        new Sprite(this.container, Resources.Wa, "album/" + a);
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
      this.glowFrame = d;
      this.disabledLocally = false;
      this.time = Math.random();
      this.setState("ENoAd");
    }
    setHasAd(a) {
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
            a = new Sprite(null, Resources.Wa, this.glowFrame);
            a.setName("glow");
            let b = new AnimTimeline();
            b.alphaKey(0, 0);
            b.alphaKey(1, 0.5);
            b.alphaKey(0, 1);
            new SpriteAnimator(a).loop(b);
            this.container.appendChild(a);
            if (this.badge != null) {
              this.container.moveToTop(this.badge);
            }
            break;
          case "EAd":
            this.adIcon = new Sprite(null, Resources.Wa, "ads_icon");
            this.adIcon.setX(120);
            this.adIcon.setY(120);
            this.adIcon.center();
            this.container.appendChild(this.adIcon);
            this.container.setAlpha(1);
            this.setSelected(false);
            break;
          case "EFilled":
            this.setSelected(false);
            if (this.adIcon != null) {
              this.adIcon.free();
              this.adIcon = null;
            }
            this.badge = new TextNode(this.container, Resources.ic);
            this.badge.setBoxSize(60, 60);
            this.badge.setX(105);
            this.badge.setY(70);
            this.badge.markDirty();
            this.badge.setText(isFinite(this.count) ? Numeric.toStr(this.count) : "∞");
            this.badge.autoFit(false);
            break;
          case "ENoAd":
            this.container.setAlpha(0.5);
            this.setSelected(true);
            if (this.adIcon != null) {
              this.adIcon.free();
              this.adIcon = null;
            }
        }
      }
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case "EAd":
          if (this.adIcon != null && this.time > 3 && !this.disabledLocally) {
            this.adIcon.setY(100);
            this.adIcon.tween().y(110, 1, Easing.elasticOut());
            this.time = 0;
          }
          this.container.setAlpha(this.disabledLocally ? 0.5 : 1);
          break;
        case "EFilled":
          this.container.setAlpha(this.disabledLocally ? 0.5 : 1);
      }
    }
    reset() {
      super.reset();
      let a = this.container.childByName("glow");
      if (a != null) {
        a.free();
      }
      this.disabledLocally = false;
      switch (this.state) {
        case "EActive":
        case "EAd":
        case "ERequested":
          this.setState("ENoAd");
      }
    }
    select() {
      super.select();
      this.debounce = 0;
      switch (this.state) {
        case "EActive":
        case "EAd":
          this.setState("ERequested");
          break;
        case "EFilled":
          this.setState("EActive");
      }
    }
    setSelected(a) {
      switch (this.state) {
        case "EActive":
        case "ENoAd":
          a = true;
      }
      super.setSelected(a);
    }
    getHeight() {
      return this.sprite.getHeight();
    }
    rightEdge() {
      return this.container.getX() + this.sprite.getWidth() * this.container.scaleX;
    }
    getWidth() {
      return this.sprite.getWidth() * this.container.scaleX;
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
      if (AdPowerupButtonA.COOLDOWN > 0) {
        this.fill(AdPowerupButtonA.COOLDOWN);
      }
    }
    fill(a) {
      AdPowerupButtonA.COOLDOWN = a;
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
          this.focusFrame = Keys.gz;
          this.sprite.setFrame(this.frame);
          break;
        case "EFilled":
          this.frame = Keys.wK;
          this.focusFrame = Keys.xK;
          this.sprite.setFrame(this.frame);
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
      if (AdPowerupButtonB.COOLDOWN > 0) {
        this.fill(AdPowerupButtonB.COOLDOWN);
      }
    }
    fill(a) {
      AdPowerupButtonB.COOLDOWN = a;
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
          this.focusFrame = Keys.dz;
          break;
        case "EFilled":
          this.frame = Keys.rK;
          this.focusFrame = Keys.sK;
          this.sprite.setFrame(this.frame);
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
      this.label = new TextNode(null, Resources.ic);
      this.label.setBoxSize(this.sprite.size.x - 80, this.sprite.size.y - 50);
      this.label.setX(40);
      this.label.setY(25);
      this.label.setText(c);
      this.label.setAlign(0, 0);
      this.label.autoFit(false);
      this.container.appendChild(this.label);
    }
    refreshFont() {
      this.label.setTexture(Resources.ic);
      this.label.setBoxSize(this.sprite.size.x - 80, this.sprite.size.y - 50);
      this.label.setAlign(0, 0);
    }
    setLabel(a) {
      this.label.markDirty();
      this.label.setText(a);
      this.label.autoFit();
    }
    static create(a) {
      return new LabelledButton(Keys.GK, Keys.HK, a);
    }
  }
  LabelledButton.i = true;
  LabelledButton.s = ButtonBase;
  Object.assign(LabelledButton.prototype, {
    l: LabelledButton
  });
