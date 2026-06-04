  class SceneState extends Node {
    constructor() {
      super();
      this.name = this.getName();
      this.Ha = {};
      this.caller = null;
      this.De = "New";
      this.xb("New");
      this.node = new SceneRoot();
      this.node.Ne = 1;
      this.ud = null;
    }
    dO() {
      return this.De == "Running";
    }
    $(a) {
      this.fa.hq(a, this, false);
    }
    Dg(a) {
      this.fa.hq(a, this, true);
    }
    Kf(a) {
      let b = this;
      if (a != null) {
        let c = this.iterator();
        while (c.top > 0) {
          let d = c.stack[--c.top];
          c.push(d);
          if (StdString.Xt(d, a)) {
            b = d;
          }
        }
      }
      this.fa.Kf(b);
    }
    replacesPrevious() {
      return true;
    }
    getPreloads() {
      return [];
    }
    eB() {
      let a = [];
      let b = 0;
      let c = this.getPreloads();
      while (b < c.length) {
        let d = c[b];
        ++b;
        if ((!Loader.Lv(d) || Loader.OA() != null) && !Loader.ob(d)) {
          a.push(d);
        }
      }
      return a;
    }
    aB(a) {
      return new ScenePreloadState(this, a);
    }
    Oj() {
      return 0;
    }
    getTransitionDuration() {
      return 0;
    }
    dispose() {
      super.dispose();
      this.xb("Destroyed");
      if (this.node != null) {
        this.node.free();
      }
      this.node = null;
    }
    update(a) {
      super.update(a);
      this.node.tickAnims(a);
    }
    render(a) {
      super.render(a);
      this.node.Gd();
      this.node.Um();
      this.O.V.Iq(this.node);
    }
    init() {}
    onShown() {}
    start() {}
    Oc() {}
    layout() {}
    transitionIn(a) {
      this.Ks(Easing.quadOut()(a));
    }
    transitionOut(a) {
      this.Ks(1 - a);
    }
    xb(a) {
      switch (a) {
        case "Created":
          this.node.Ne = 0;
          this.Ks(0);
          break;
        case "Stopped":
          this.node.Ne = 1;
      }
      this.De = a;
    }
    Ks(a) {
      this.mi().bf(a);
    }
    mi() {
      let a = this.node.li(5);
      if (a == null) {
        a = new AlphaState(0);
      }
      this.node.Bh(a);
      return a;
    }
    SN() {
      if (this.ud.parent instanceof SceneDirector) {
        return null;
      } else {
        return this.ud.parent.Pf;
      }
    }
    getName() {
      return "SceneState";
    }
  }
  SceneState.i = true;
  SceneState.s = Node;
  Object.assign(SceneState.prototype, {
    l: SceneState
  });
  class Scene extends SceneState {
    constructor() {
      super();
      this.buttons = [null];
      this.pointer = new ButtonInputState();
      this.cd = this.fh = this.rd = this.ih = this.ra = null;
    }
    createTexture(a) {
      if (Resources.bm[a] != null) {
        return Resources.bm[a];
      }
      let b = this.O.createTexture(a, 8);
      return Resources.bm[a] = b;
    }
    ia(a) {
      let b = Resources.bm[a];
      if (b != null) {
        Application.instance.V.ia(b);
        Application.instance.NM(a);
        Resources.bm[a] = null;
      }
    }
    $k() {
      let a = ButtonBase.create(null, Keys.tK, Keys.uK);
      this.node.P(a.j.u);
      this.buttons[0] = a;
    }
    Ke(a, b) {
      this.rd = new Vec4(a, b, 0, 1);
      this.ra = new Container("fix");
      this.node.P(this.ra.u);
    }
    sj() {
      if (Resources.cd == null) {
        Resources.cd = this.createTexture(Loader.menuShadow);
      }
      this.cd = new Sprite(null, Resources.cd);
      this.node.P(this.cd.u);
      this.cd.la(X.Yn(0, 360));
    }
    Vg() {
      this.Ea = new Sprite(null, Resources.Ea);
      this.node.P(this.Ea.u);
    }
    Nd() {
      if (Loader.ob(Loader.fontImg)) {
        Resources.ki = this.createTexture(Loader.fontImg);
        var a = Resources.ov(Save.language, Save.language);
        Resources.ic = Resources.ki.children[a];
        Resources.ji = Resources.ki.children[a + 1];
      }
      if (Loader.ob(Loader.loaderImg)) {
        Resources.Yl = this.createTexture(Loader.loaderImg);
      }
      a = WebApplication.xmasMode ? Loader.menuBgXmas : Loader.menuBg;
      if (Loader.ob(a)) {
        Resources.Ea = this.createTexture(a);
      }
      if (Loader.ob(Loader.menuUi)) {
        Resources.Wa = this.createTexture(Loader.menuUi);
      }
      if (Loader.ob(Loader.menuCut)) {
        Resources.yc = this.createTexture(Loader.menuCut);
      }
    }
    aB(a) {
      return new BubbleLoadingOverlay(this, a);
    }
    init() {
      this.Nd();
      if (Scene.Zt == null) {
        Scene.Zt = new ColorRectShape(null, new Vec4(0, 0, 0, 1));
        this.fa.front.P(Scene.Zt.u);
      }
      this.fh = Scene.Zt;
    }
    onShown() {
      super.onShown();
      this.layout();
    }
    layout() {
      var a = this.fa.getWidth();
      var b = this.fa.getHeight();
      let c = this.fa.dr();
      if (this.rd != null) {
        this.ih = c.hi(this.rd.x / this.rd.y);
        this.ra.setX(this.ih.A);
        this.ra.setY(this.ih.D);
        var d = this.ih;
        this.ra.setUniformScale((d.B - d.A) / this.rd.x);
      }
      if (this.If != null) {
        this.If.setX(this.fa.getWidth() - this.If.getWidth());
        this.If.setY(this.fa.getHeight() - this.If.getHeight());
      }
      d = this.buttons[0];
      if (d != null) {
        var e = c.hi(this.rd.x / this.rd.y);
        d.j.setUniformScale((e.B - e.A) * 0.2 / d.ec.x);
        d.setX(10);
        d.setY(this.fa.getHeight() - d.j.getHeight() - 10);
      }
      if (this.Ea != null) {
        e = Resources.Ea.size;
        d = a / e.x;
        e = b / e.y;
        this.oN = d > e;
        this.Ea.setUniformScale(Math.max(d, e));
        this.Ea.setX(this.fa.getWidth() / 2);
        d = this.Ea;
        d.setX(d.getX() - this.Ea.getWidth() / 2);
        this.Ea.setY(0);
      }
      if (this.cd != null) {
        this.cd.center();
        this.cd.uS(new Vec4((c.A + c.B) / 2, (c.D + c.G) / 2, 0, 1));
        this.cd.setUniformScale((c.B - c.A) / 260);
        a = Math.max(a, b) / 2;
        a = Math.sqrt(a * 2 * a) * 2 / Resources.cd.size.x;
        if (this.cd.Ra < a) {
          this.cd.setUniformScale(a);
        }
        a = 1 / this.fa.Se();
        if (a < 1) {
          b = this.cd;
          b.setUniformScale(b.Ra * a);
        }
        a = this.cd;
        a.setUniformScale(a.Ra * 2);
      }
    }
    update(a) {
      super.update(a);
      if (this.dO()) {
        this.pointer.resetHover();
        this.PR();
        this.Pd(a);
        this.pointer.fi();
        let b = 0;
        let c = this.buttons;
        while (b < c.length) {
          let d = c[b];
          ++b;
          if (d != null) {
            d.update(a);
          }
        }
      }
      if (this.cd != null) {
        a = this.cd;
        a.la(a.Zd + 0.1);
      }
    }
    getTransitionDuration() {
      return 0.5;
    }
    transitionIn(a) {
      this.fh.W(1 - a);
    }
    transitionOut(a) {
      this.fh.W(a);
    }
    PR() {
      var a = this.O.hd();
      this.pointer.pressed = a.Nb(0);
      this.pointer.released = a.qe(0);
      a = a.position[0];
      var b = a.x;
      var c = a.y;
      a = this.O.V.Ab;
      let d = this.O.window.lo();
      b = -1 + (b - d.x) * 2 / d.w;
      c = -1 + (d.y - c) * 2 / d.J;
      a = a.Kv;
      a = new Vec4(a.m11 * b + a.m12 * c + a.m14, a.m21 * b + a.m22 * c + a.m24, 0, 1);
      if (a != null) {
        b = this.pointer.pos;
        b.x = a.x;
        b.y = a.y;
      }
    }
    Jl() {
      let a = 0;
      let b = this.buttons;
      while (a < b.length) {
        let c = b[a];
        ++a;
        if (c != null) {
          c.j.L(false);
        }
      }
    }
    wS() {
      let a = 0;
      let b = this.buttons;
      while (a < b.length) {
        let c = b[a];
        ++a;
        if (c != null) {
          c.j.L(true);
        }
      }
    }
    Pd() {}
    hb(a) {
      let b = this.buttons[a];
      if (b == null || this.De != "Running" || b.SO || !b.ri()) {
        return false;
      }
      let c = false;
      if (a == 0) {
        var d = this.O.jd ? 461 : -1;
        d = this.O.lh().Nb(d);
      } else {
        d = false;
      }
      if (this.pointer.poll(a, b) || d) {
        b.select();
        c = true;
      }
      b.$w(this.pointer.isHovered(a));
      b.setActive(this.pointer.isActive(a));
      if (c) {
        SoundFx.play(SoundFx.button);
      }
      return c;
    }
    Ks() {}
    yb(a, ...b) {
      return Strings.get(a, b.length > 0 ? b.slice() : null);
    }
    cr(...a) {
      let b = [];
      let c = 0;
      while (c < a.length) {
        b.push(Strings.get(a[c++]));
      }
      return b;
    }
    sm() {
      this.O.Sa.stop(WebApplication.gameMusicId);
      this.ZC(WebApplication.menuMusicId);
    }
    FQ() {
      this.O.Sa.stop(WebApplication.menuMusicId);
      this.ZC(WebApplication.gameMusicId);
    }
    ZC(a) {
      let b = this.O.Sa;
      b.Sf(Save.Ec ? 1 : 0);
      if (!b.Dc(a)) {
        b.play(a, true);
        this.O.Nu = a;
      }
    }
    Uq() {
      let a = this.O.Sa;
      if (a.Dc(WebApplication.menuMusicId)) {
        a.Zn(WebApplication.menuMusicId, 0.5, true);
      }
      if (a.Dc(WebApplication.gameMusicId)) {
        a.Zn(WebApplication.gameMusicId, 0.5, true);
      }
    }
    JD() {
      let a = this;
      if (Audio.no() && !Scene.salutePlayed && Loader.ob(Loader.menuSalute)) {
        this.If = new Sprite(null, this.createTexture(Loader.menuSalute), "0000");
        this.If.setUniformScale(this.O.window.bp);
        if (!this.O.Vj) {
          this.If.setUniformScale(this.O.window.Pj());
        }
        this.fa.front.P(this.If.u);
        this.If.pa().play(Keys.Pa(null, 0, 53, 30)).Be(function () {
          a.If.free();
          a.If = null;
          a.ia(Loader.menuSalute);
        });
        SoundFx.play(SoundFx.salute);
        Scene.salutePlayed = true;
        this.layout();
      }
    }
    eF() {
      let a = 0;
      while (a < 17) {
        let b = a++;
        this.ia([194, 189, 184, 179, 174, 169, 164, 158, 153, 148, 143, 138, 133, 128, 123, 118, 113][b]);
        this.ia([196, 191, 186, 181, 176, 171, 166, 161, 155, 150, 145, 140, 135, 130, 125, 120, 115][b]);
        this.ia([198, 193, 188, 183, 178, 173, 168, 163, 157, 152, 147, 142, 137, 132, 127, 122, 117][b]);
      }
      Resources.wq = null;
      Resources.xj = null;
      Resources.uu = null;
      this.ia(Loader.objBubble);
      Resources.ca = null;
      this.ia(Loader.objSpikes);
      Resources.Dd = null;
      this.ia(Loader.objPump);
      Resources.wm = null;
      this.ia(Loader.objSpider);
      Resources.mc = null;
      this.ia(Loader.objElectro);
      Resources.ce = null;
      this.ia(Loader.objSock);
      Resources.Dk = null;
      this.ia(Loader.objBouncer);
      Resources.fd = null;
      this.ia(Loader.objGravity);
      Resources.Kb = null;
      this.ia(Loader.objGravity);
      Resources.gl = null;
      this.ia(Loader.objVinyl);
      Resources.Tc = null;
      this.ia(Loader.objSteam);
      Resources.Kk = null;
      this.ia(Loader.objLantern);
      Resources.Ai = null;
      this.ia(Loader.objGap);
      Resources.wf = null;
      this.ia(Loader.objLighter);
      Resources.Ef = null;
      this.ia(Loader.objTransporter);
      Resources.Rc = null;
      this.ia(Loader.objLighter);
      Resources.Ef = null;
      this.ia(Loader.char3);
      Resources.ml = null;
    }
    Mp(a) {
      function b(d) {
        return (BOX_OBJECT_FLAGS[a - 1] & d) == 0;
      }
      let c = a - 1;
      this.ia([194, 189, 184, 179, 174, 169, 164, 158, 153, 148, 143, 138, 133, 128, 123, 118, 113][c]);
      this.ia([196, 191, 186, 181, 176, 171, 166, 161, 155, 150, 145, 140, 135, 130, 125, 120, 115][c]);
      this.ia([198, 193, 188, 183, 178, 173, 168, 163, 157, 152, 147, 142, 137, 132, 127, 122, 117][c]);
      Resources.wq = null;
      Resources.xj = null;
      Resources.uu = null;
      if (Resources.ca != null && b(1)) {
        this.ia(Loader.objBubble);
        Resources.ca = null;
      }
      if (Resources.Dd != null && b(2)) {
        this.ia(Loader.objSpikes);
        Resources.Dd = null;
      }
      if (Resources.wm != null && b(4)) {
        this.ia(Loader.objPump);
        Resources.wm = null;
      }
      if (Resources.mc != null && b(8)) {
        this.ia(Loader.objSpider);
        Resources.mc = null;
      }
      if (Resources.ce != null && b(64)) {
        this.ia(Loader.objElectro);
        Resources.ce = null;
      }
      if (Resources.Dk != null && b(128)) {
        this.ia(Loader.objSock);
        Resources.Dk = null;
      }
      if (Resources.fd != null && b(512)) {
        this.ia(Loader.objBouncer);
        Resources.fd = null;
      }
      if (Resources.Kb != null && b(2048)) {
        this.ia(Loader.objGravity);
        Resources.Kb = null;
      }
      if (Resources.gl != null && b(4096)) {
        this.ia(Loader.objGravity);
        Resources.gl = null;
      }
      if (Resources.Tc != null && b(16384)) {
        this.ia(Loader.objVinyl);
        Resources.Tc = null;
      }
      if (Resources.Kk != null && b(65536)) {
        this.ia(Loader.objSteam);
        Resources.Kk = null;
      }
      if (Resources.Ai != null && b(131072)) {
        this.ia(Loader.objLantern);
        Resources.Ai = null;
      }
      if (Resources.wf != null && b(262144)) {
        this.ia(Loader.objGap);
        Resources.wf = null;
      }
      if (Resources.Ef != null && b(524288)) {
        this.ia(Loader.objLighter);
        Resources.Ef = null;
      }
      if (Resources.Rc != null && b(1048576)) {
        this.ia(Loader.objTransporter);
        Resources.Rc = null;
      }
      if (Resources.Ef != null && b(524288)) {
        this.ia(Loader.objLighter);
        Resources.Ef = null;
        this.ia(Loader.char3);
        Resources.ml = null;
      }
    }
    getName() {
      return "AbstractScene";
    }
  }
  Scene.i = true;
  Scene.s = SceneState;
  Object.assign(Scene.prototype, {
    l: Scene
  });
  class SceneWrapper extends Node {
    constructor(a) {
      super();
      this.Pf = a;
      a.ud = this;
      a.zC = true;
      a.yC = true;
      this.oa(a);
    }
    update(a) {
      switch (this.Pf.De) {
        case "Paused":
        case "Running":
        case "Started":
          break;
        default:
          return;
      }
      if (this.O.window.Nw) {
        this.Pf.layout();
      }
      this.Pf.update(a);
      this.Pf.iq(a);
      super.update(a);
    }
    render(a) {
      if (this.Pf.Sx) {
        switch (this.Pf.De) {
          case "Paused":
          case "Running":
          case "Started":
            this.Pf.render(a);
        }
      }
      super.render(a);
    }
  }
  SceneWrapper.i = true;
  SceneWrapper.s = Node;
  Object.assign(SceneWrapper.prototype, {
    l: SceneWrapper
  });
  class SceneTransition extends Node {
    constructor(a, b) {
      super();
      this.a = a;
      this.b = b;
      this.state = 0;
    }
    qN(a, b) {
      for (a = a.ud.parent; a != null && !(a instanceof SceneDirector);) {
        b(a.Pf);
        a = a.parent;
      }
    }
    Il(a) {
      if (a.ud.parent == a.fa) {
        return a;
      }
      let b = a.ud.parent;
      while (b != null) {
        if (b.parent == a.fa) {
          return b.Pf;
        }
        b = b.parent;
      }
      return null;
    }
    Oj(a) {
      if (a.O.config.nF) {
        return a.Oj();
      } else {
        return 0;
      }
    }
    getTransitionDuration(a, b) {
      if (a.O.config.transition) {
        return a.getTransitionDuration(b);
      } else {
        return 0;
      }
    }
    setState(a) {
      this.state = a;
      this.time = 0;
    }
  }
  SceneTransition.i = true;
  SceneTransition.s = Node;
  Object.assign(SceneTransition.prototype, {
    l: SceneTransition
  });

  class ScenePreloadState extends SceneState {
    constructor(a, b) {
      super();
      this.mm = b;
      this.NP = a.eB();
      this.Zl = this.O.load(this.NP);
    }
    er() {
      return this.Zl.er();
    }
    update(a) {
      super.update(a);
      if (this.Zl.xv() && this.De == "Running") {
        this.gx();
      }
    }
    replacesPrevious() {
      return false;
    }
    gx() {
      this.fa.oa(new TransitionPopBack(this, false, this.mm));
    }
    getName() {
      return "LoadingOverlay";
    }
  }
  ScenePreloadState.i = true;
  ScenePreloadState.s = SceneState;
  Object.assign(ScenePreloadState.prototype, {
    l: ScenePreloadState
  });

  class BubbleLoadingOverlay extends ScenePreloadState {
    constructor(a, b) {
      super(a, b);
    }
    init() {
      super.init();
      Resources.Yl = Application.instance.createTexture(Loader.loaderImg, 8);
      this.ca = new Container();
      this.node.P(this.ca.u);
      let a = new Sprite(null, Resources.Yl.children[0], "bubble");
      let b = Math.min(this.fa.getWidth(), this.fa.getHeight()) / a.X.x * 0.25;
      this.ca.setUniformScale(b);
      this.ca.appendChild(a);
      a.center();
      this.text = new TextNode(this.ca, Resources.Yl.children[1]);
      this.text.setText("100%");
      this.text.setBoxSize(a.X.x, a.X.y);
      this.text.setAlign(0, 0);
      this.text.setMultiline(false);
      this.text.setText("0%");
      this.text.setX(-a.X.x / 2);
      this.text.setY(-a.X.y / 2);
      this.text.setFontSize(this.text.$q() * 0.7);
      this.ak = this.wd = 0;
      this.tj = Math.random() * PI * 2;
      this.uj = Math.random() * PI * 2;
      this.Ek = Math.random() * 0.1 - 0.05;
      this.Fk = Math.random() * 0.1 - 0.05;
    }
    update(a) {
      super.update(a);
      this.time += a;
      this.ca.setX(this.fa.getWidth() / 2);
      this.ca.setY(this.fa.getHeight() / 2);
      var b = Math.cos(this.tj) * 50;
      a = Math.sin(this.uj) * 50;
      this.tj += this.Ek;
      this.uj += this.Fk;
      let c = this.ca;
      c.setX(c.getX() + b);
      b = this.ca;
      b.setY(b.getY() + a);
      // Loading overlay used to crawl a fake % counter (5 per frame)
      // and then sit on 100% for an extra half-second before dismissing.
      // Now: show real progress directly. The parent's update() handles
      // the actual dismissal via `gx()` once the overlay is fully
      // pushed in (De == "Running") AND loading is done - see
      // ScenePreloadState.update. We no longer override gx() to a
      // no-op, so the inherited TransitionPopBack fires automatically.
      this.wd = this.er() | 0;
      this.text.setText("" + this.wd + "%");
    }
    getTransitionDuration() {
      return 0.25;
    }
    getName() {
      return "LoadingOverlay";
    }
  }
  BubbleLoadingOverlay.i = true;
  BubbleLoadingOverlay.s = ScenePreloadState;
  Object.assign(BubbleLoadingOverlay.prototype, {
    l: BubbleLoadingOverlay
  });
