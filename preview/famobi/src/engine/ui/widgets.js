  class HorizontalScroller extends Node {
    constructor(a, b, c, d) {
      super();
      this.j = a;
      this.min = b;
      this.max = c;
      this.offsetX = d;
      this.vt = this.pg = this.ng = this.vk = 0;
      this.Tn = 0.03;
      this.Dn = this.En = false;
      this.$o = this.ap = 0;
      this.Wv = this.pl = INT16_MIN;
    }
    update() {
      var a = this.O.hd();
      let b = this.O.gO().cO();
      if (b != 0) {
        this.pg += (b > 0 ? 1 : b < 0 ? -1 : 0) * -10;
        this.Tn = 0.05;
        this.Dn = this.En = false;
      } else if (a.Nb(0)) {
        this.ng = 0;
        this.Ru = this.Wv = this.pl = a.position[0].x;
        this.pg = this.vt = 0;
        this.Dn = this.En = false;
        this.Tn = 0.03;
        this.time = 0;
      } else if (a.qe(0)) {
        this.vk += this.ng;
        this.ng = 0;
        this.pg = this.pl - this.Wv;
      } else {
        if (a.zo(0)) {
          this.Wv = this.pl;
          this.pl = a.position[0].x;
          this.ng = this.pl - this.Ru;
        } else {
          if (this.En) {
            if (this.ap * this.ap < 0.001) {
              this.En = false;
            } else {
              this.pg += this.ap * 0.1;
            }
          } else if (this.Dn) {
            if (this.$o * this.$o < 0.001) {
              this.Dn = false;
            } else {
              this.pg -= this.$o * 0.1;
            }
          } else if (this.ap < 0) {
            this.En = true;
            this.Tn = 0.3;
          } else if (this.$o < 0) {
            this.Dn = true;
            this.Tn = 0.3;
          }
          this.vt = (this.vt + this.pg) * (1 - this.Tn);
          this.pg = 0;
          this.vk += this.vt;
        }
        a = this.offsetX + (this.vk + this.ng);
        this.j.setX(a);
        this.ap = this.offsetX - a;
        this.$o = this.max + a - this.offsetX;
      }
    }
  }
  HorizontalScroller.i = true;
  HorizontalScroller.s = Node;
  Object.assign(HorizontalScroller.prototype, {
    l: HorizontalScroller
  });
  class UIWidget extends Node {
    constructor() {
      super();
      this.ec = null;
      this.focused = false;
      this.ke = 0;
      this.j = new Container();
    }
    $w() {}
    setActive(a) {
      this.active = a;
    }
    select() {
      this.Ad(true);
    }
    focus() {
      this.focused = true;
    }
    blur() {
      this.focused = false;
    }
    Ad(a) {
      this.SO = a;
    }
    getX() {
      return this.j.getX();
    }
    setX(a) {
      this.j.setX(a);
      return a;
    }
    getY() {
      return this.j.getY();
    }
    setY(a) {
      this.j.setY(a);
    }
    up(a) {
      this.j.setX(a - this.j.getWidth());
    }
    getHeight() {
      return this.j.getHeight();
    }
    ri() {
      return this.j.ri();
    }
    L(a) {
      this.j.L(a);
    }
  }
  UIWidget.i = true;
  UIWidget.s = Node;
  Object.assign(UIWidget.prototype, {
    l: UIWidget
  });
  class LevelDot extends UIWidget {
    constructor(a) {
      super();
      this.Ci = a;
      this.j = new Container();
      this.icon = new Sprite(this.j, Resources.Wa, Keys.OK);
      this.pO = new HitTestRect(this.j.node, new Bounds(20, 10, 170, 160));
    }
    focus() {}
    blur() {
      super.blur();
      this.icon.Fb(Keys.$p);
    }
    bS(a, b) {
      this.icon.Fb(Keys.$p);
      let c = new TextNode(this.j, Resources.ic);
      c.setBoxSize(this.icon.getWidth(), this.icon.getHeight());
      c.setText(Numeric.Ed(this.Ci));
      c.setAlign(0, 0);
      c.setFontSize(this.icon.getHeight() * 0.5);
      c.setY(c.getY() - 20);
      new Sprite(this.j, Resources.Wa, LevelDot.zE[a]);
      if (b) {
        new Sprite(this.j, Resources.Wa, LevelDot.zE[4]);
      }
    }
    Ub(a) {
      if (this.icon.qf == Keys.$p || this.focused) {
        return this.pO.Ub(a);
      } else {
        return false;
      }
    }
  }
  LevelDot.i = true;
  LevelDot.s = UIWidget;
  Object.assign(LevelDot.prototype, {
    l: LevelDot
  });

  class ScoreLabel extends Node {
    constructor() {
      super();
      this.Oa = new Sprite(null, Resources.Wa, Keys.Tt);
      this.label = new TextNode(null, Resources.ic);
    }
    setText(a) {
      this.label.setText(a);
      this.layout();
    }
    Qr() {
      let a = this.parent;
      a.node.P(this.Oa.u);
      a.node.P(this.label.u);
    }
    layout() {
      var a = this.parent;
      var b = a.fa.getWidth();
      a = Math.min(a.fa.lB().x * 0.1, a.fa.lB().y * 0.1);
      this.Oa.setUniformScale(a / this.Oa.X.x);
      this.Oa.setX(b - this.Oa.getWidth() - 20);
      this.Oa.setY(20);
      b = this.Oa.getHeight() * 0.1;
      this.label.setBoxSize(300, this.Oa.getHeight() - b * 2);
      this.label.setAlign(1, 0);
      this.label.setX(this.Oa.getX() - 300);
      this.label.setY(this.Oa.getY() + b);
      this.label.setMultiline();
    }
  }
  ScoreLabel.i = true;
  ScoreLabel.s = Node;
  Object.assign(ScoreLabel.prototype, {
    l: ScoreLabel
  });

  class HitTestRect {
    constructor(a, b) {
      this.rect = new SpriteNode(a);
      this.rect.Lb(b.B - b.A, b.G - b.D);
      a = this.rect.Db;
      a.translate.x = b.A;
      a.translate.y = b.D;
      a.K = a.K & -2 | 496;
    }
    Ub(a) {
      NodeTreeUtil.Yf(this.rect);
      this.rect.pe();
      return this.rect.Ub(a);
    }
  }
  HitTestRect.i = true;
  Object.assign(HitTestRect.prototype, {
    l: HitTestRect
  });
