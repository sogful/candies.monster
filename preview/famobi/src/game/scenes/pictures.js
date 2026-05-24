  class PicturesScene extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      return [Loader.picThumbs, Loader.picThumbsJson, WebApplication.xmasMode ? Loader.picsBgXmas : Loader.picsBg];
    }
    Vg() {
      this.Ea = new Sprite(null, this.createTexture(WebApplication.xmasMode ? Loader.picsBgXmas : Loader.picsBg));
      this.node.P(this.Ea.u);
    }
    Nd() {
      super.Nd();
      this.PE = this.createTexture(Loader.picThumbs);
    }
    init() {
      super.init();
      Save.kk = 0;
      Save.flush();
      this.Vg();
      this.Ke(600, 900);
      this.OL();
      this.sj();
      var a = new TextNode(this.ra, Resources.ic);
      a.setBoxSize(600, 60);
      a.setText(this.yb("OMNOM_DRAWINGS"));
      a.setAlign(0);
      a.setMultiline();
      a.setY(20);
      a = new TextNode(this.ra, Resources.ji);
      a.setBoxSize(600, 40);
      a.setText(this.yb("DRAWINGS_TOTAL", Numeric.Ed(LevelState.QN())));
      a.setAlign(0);
      a.setMultiline();
      a.setY(80);
      this.$k();
      this.mf = new Sprite(null, this.PE, "artist");
      this.scroll = new HorizontalScroller(this.cj, 0, 600, 0);
      this.scroll.offsetX = this.QE / 2;
      this.time = this.state = 0;
    }
    start() {
      super.start();
      if (this.mf.u.parent == null) {
        this.fa.front.P(this.mf.u);
      }
    }
    layout() {
      super.layout();
      let a = this.cd;
      a.setUniformScale(a.Ra * 1.1);
    }
    Oc() {
      super.Oc();
      this.ia(Loader.picThumbs);
      this.ia(Loader.picsBg);
    }
    OL() {
      this.cj = new Container("thumbs", this.ra);
      this.cj.setY(0);
      for (var a = [0.77, -2.45, 470, 695, 0.85, 0.2, 854, 627, 0.86, 0.2, 1260, 647, 0.78, 1, 1630, 663, 0.86, 4.7, 2057, 642, 0.8, -2, 2477, 722, 0.8, -5, 2924, 602, 0.77, 0, 459, 1161, 0.85, -0.48, 854, 1147, 0.78, 5.11, 1253, 1137, 0.82, 0.11, 1680, 1147, 0.7, 0, 2121, 1188, 0.75, 1, 2526, 1264, 0.75, -2, 2933, 1162, 0.71, -3, 700, 1635, 0.66, -0.31, 1091, 1611, 0.66, 0.51, 1481, 1606, 0.7, 6.66, 1832, 1665, 0.66, 0, 2172, 1627, 0.65, -5, 2586, 1680, 0.75, -2, 2855, 1624], b = 0; b < a.length;) {
        var c = a[b++] * 0.8 * 1.5;
        let e = a[b++];
        let f = a[b++] * 0.8 / 2 - 90;
        let g = a[b++] * 0.8 / 2;
        let h = b >> 2;
        var d = undefined;
        if (LevelState.QB(h)) {
          d = "pics/";
          if (h < 10) {
            d = "pics/0";
          }
          d += h;
        } else {
          d = "missing";
        }
        d = new Sprite(this.cj, this.PE, d);
        d.ox(h == null ? "null" : "" + h);
        d.center();
        d.setUniformScale(c);
        d.la(e);
        d.setX(f);
        d.setY(g);
      }
      a = this.cj.Re();
      this.QE = a.B - a.A;
      a = this.cj.getWidth();
      for (b = this.cj.iterator(); b.fb();) {
        c = b.next();
        c.setX(c.getX() - a / 2);
      }
    }
    update(a) {
      super.update(a);
      if (this.fa.getWidth() / this.ra.Ra - this.QE < -50) {
        this.scroll.update(a);
      } else {
        this.cj.setX(300);
      }
      this.mf.setX(this.fa.getWidth() - this.mf.getWidth());
      switch (this.state) {
        case 0:
          a = this.jb(0.2);
          this.mf.setY(this.fa.getHeight() - this.mf.getHeight() * a);
          if (a == 1) {
            this.state = 1;
          }
          break;
        case 1:
          this.mf.setY(this.fa.getHeight() - this.mf.getHeight());
          break;
        case 2:
          a = this.jb(0.2);
          this.mf.setY(this.fa.getHeight() - this.mf.getHeight() * (1 - a));
          if (a == 1) {
            this.mf.L(false);
            this.state = 3;
            this.Vb();
          }
      }
      if (this.De == "Running") {
        a = this.O.hd();
        if (a.Nb(0)) {
          this.Ru = a.position[0].x;
        }
        if (!!a.qe(0) && !(Math.abs(a.position[0].x - this.Ru) > 5)) {
          a = new GrowableList();
          if (this.cj.Ub(this.pointer.pos, a)) {
            a = Numeric.parseInt(a.get(0).name);
            this.Ha.pictureIndex = a;
            this.Ha.available = LevelState.QB(a);
            this.Ha.ui = false;
            this.Dg(PictureRevealScene);
          }
        }
      }
    }
    Pd() {
      if (this.hb(0)) {
        this.state = 2;
        this.time = 0;
      }
    }
    Vb() {
      this.$(MenuScene);
    }
    getName() {
      return "PicturesScene";
    }
  }
  PicturesScene.i = true;
  PicturesScene.s = Scene;
  Object.assign(PicturesScene.prototype, {
    l: PicturesScene
  });
  class CTRCPicturesScene extends PicturesScene {
    constructor() {
      super();
    }
    Vb() {
      this.$(CTRCMenuScene);
    }
    getName() {
      return "CTRCPicturesScene";
    }
  }
  CTRCPicturesScene.i = true;
  CTRCPicturesScene.s = PicturesScene;
  Object.assign(CTRCPicturesScene.prototype, {
    l: CTRCPicturesScene
  });
  class WarpScene extends Scene {
    constructor() {
      super();
    }
    start() {
      super.start();
      var a = this.caller.Ha.box;
      if (a != LevelState.box) {
        this.eF();
      }
      LevelState.Ui(a);
      a = this.caller.Ha.level;
      LevelState.sp(a);
      if (a <= 5) {
        LevelState.zk(1);
      } else if (a > 5 && a < 10) {
        LevelState.zk(2);
      } else {
        LevelState.zk(3);
      }
      this.xD();
    }
    xD() {
      this.$(LevelScene);
    }
    getName() {
      return "WarpScene";
    }
  }
  WarpScene.i = true;
  WarpScene.s = Scene;
  Object.assign(WarpScene.prototype, {
    l: WarpScene
  });
  class CTRCWarpScene extends WarpScene {
    constructor() {
      super();
    }
    xD() {
      this.$(CTRCLevelScene);
    }
    getName() {
      return "CTRCWarpScene";
    }
  }
  CTRCWarpScene.i = true;
  CTRCWarpScene.s = WarpScene;
  Object.assign(CTRCWarpScene.prototype, {
    l: CTRCWarpScene
  });

  class PictureRevealScene extends Scene {
    constructor() {
      super();
    }
    getPreloads() {
      let a = [Loader.picMissing];
      a.push([27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7][this.br() - 1]);
      return a;
    }
    transitionIn() {}
    transitionOut() {}
    getTransitionDuration() {
      return 0;
    }
    replacesPrevious() {
      return false;
    }
    init() {
      super.init();
      var a = this.br();
      this.tl = new ColorRectShape(null, new Vec4(0, 0, 0, 1));
      this.tl.W(0);
      this.node.P(this.tl.u);
      var b = this.caller.Ha.ui;
      var c = b ? 1350 : 1200;
      this.Ke(800, c);
      this.j = new Container(null, this.ra);
      this.j.setX(400);
      this.j.setY(c / 2);
      this.j.setUniformScale(0);
      this.j.L(false);
      c = this.createTexture(Loader.picMissing);
      new Sprite(this.j, c).center();
      if (this.caller.Ha.available) {
        this.ME = [27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7][a - 1];
        a = new Sprite(this.j, this.createTexture(this.ME));
        a.center();
        a.setX(-1);
        a.setY(-14);
      } else {
        c = LevelMath.rv(a);
        a = this.yN(a);
        a = this.yb("COMPLETE_BOXNAME", c == null ? "null" : "" + c, a);
        c = new TextNode(this.j, Resources.ji);
        c.setBoxSize(400, 400);
        c.Tf(true);
        c.setFontSize(50);
        c.setText(a);
        c.setAlign(0);
        c.setX(-200);
        c.setY(-100);
      }
      if (b) {
        b = LabelledButton.ol(this.yb("COLLECT_DRAWING"));
        b.j.setUniformScale(1.25);
        this.j.appendChild(b.j);
        b.setX(-293.75);
        b.setY(500);
        this.buttons.push(b);
        this.oa(b);
        b.focus();
        b = new Sprite(this.j, Resources.Wa, Keys.nK);
        b.center();
        b.setX(0);
        b.setY(-570);
        b = this.yb("DRAWING_FOUND");
        a = new TextNode(this.j, Resources.ic);
        a.setBoxSize(600, 160);
        a.setFontSize(80);
        a.setText(b);
        a.setAlign(0);
        a.setX(-300);
        a.setY(-615);
      }
      this.time = this.state = 0;
    }
    Oc() {
      super.Oc();
      this.ia(Loader.picMissing);
      this.ia(this.ME);
    }
    Pd(a) {
      super.Pd(a);
      if (this.state == 1 && this.hb(1)) {
        this.state = 2;
        this.time = 0;
      }
    }
    start() {
      super.start();
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 0:
          a = this.jb(0.5);
          this.j.setUniformScale(Easing.backOut()(a));
          this.j.L(true);
          this.tl.W(a * 0.4);
          if (a == 1) {
            this.state = 1;
          }
          break;
        case 1:
          if (this.caller.Ha.ui) {
            break;
          }
          if (this.O.hd().Nb(0)) {
            this.state = 2;
            this.time = 0;
          }
          break;
        case 2:
          a = this.jb(0.25);
          this.j.setUniformScale(1 - Easing.quadOut()(a));
          this.tl.W((1 - a) * 0.4);
          if (a == 1) {
            this.state = 3;
            this.Kf();
          }
      }
    }
    br() {
      let a = this.caller.Ha.pictureIndex;
      if (a == null) {
        a = LevelMath.br(LevelState.box, LevelState.level);
      }
      return a;
    }
    yN(a) {
      if (a <= 17) {
        return this.yb("BOX1_LABEL");
      } else {
        return this.yb("BOX2_LABEL");
      }
    }
    getName() {
      return "PicturePopup";
    }
  }
  PictureRevealScene.i = true;
  PictureRevealScene.s = Scene;
  Object.assign(PictureRevealScene.prototype, {
    l: PictureRevealScene
  });
