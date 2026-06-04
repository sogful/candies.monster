  class SceneDirector extends Node {
    constructor(a) {
      super();
      this.O = a;
      this.Ha = {};
      this.back = new SceneRoot();
      this.front = new SceneRoot();
      this.Ab = new Camera();
    }
    getWidth() {
      return this.O.window.pi().x;
    }
    getHeight() {
      return this.O.window.pi().y;
    }
    lB() {
      return this.O.window.pi();
    }
    dr() {
      let a = this.O.window.pi();
      return new Bounds(0, 0, a.x, a.y);
    }
    Se() {
      return this.O.window.bo();
    }
    update(a) {
      this.Ab.Lb(new Vec4(this.getWidth(), this.getHeight(), 0, 1));
      this.O.V.wk(this.Ab);
      this.back.tickAnims(a);
      super.update(a);
      this.front.tickAnims(a);
    }
    render(a) {
      let b = this.O.V;
      this.Ab.Lb(new Vec4(this.getWidth(), this.getHeight(), 0, 1));
      b.wk(this.Ab);
      this.back.Gd();
      this.back.Um();
      b.Iq(this.back);
      super.render(a);
      this.front.Gd();
      this.front.Um();
      b.Iq(this.front);
    }
    hq(a, b, c) {
      function d() {
        if (c) {
          b.ud.oa(new SceneWrapper(e));
          return g.oa(new TransitionPushOver(b, e));
        }
        let h = new SceneWrapper(e);
        g.oa(h);
        if (f == null) {
          return g.oa(new TransitionPush(e));
        } else {
          return g.oa(new TransitionReplace(b, e));
        }
      }
      let e = Construct.qA(a);
      e.fa = this;
      e.O = this.O;
      e.caller = b;
      if (b == null) {
        e.Ha = this.Ha;
      }
      let f = this.mN();
      let g = this;
      if (e.eB().length > 0) {
        a = e.aB(d);
        a.fa = this;
        a.O = this.O;
        // Skip the bubble loading overlay entirely if every preload
        // was already cached. eB() drops fully-loaded ids, but if any
        // remain unfetched ScriptDownload still hits the network. In
        // the common warmed-up case xv() reports done at construction
        // and the only thing the overlay would contribute is a ~0.5s
        // fade in + fade out - which is exactly what looks "fake".
        if (a.Zl != null && a.Zl.xv()) {
          d();
        } else {
          let h = new SceneWrapper(a);
          if (f == null) {
            this.oa(h);
            this.oa(new TransitionPush(a));
          } else {
            b.ud.oa(h);
            this.oa(new TransitionPushOver(b, a));
          }
        }
      } else {
        d();
      }
    }
    Kf(a) {
      if ((a.ud.parent instanceof SceneDirector ? null : a.ud.parent) == null) {
        this.oa(new TransitionExit(a));
      } else {
        a.ud.parent.Pf.caller = a;
        this.oa(new TransitionPopBack(a));
      }
    }
    mN() {
      let a = this.Me;
      while (a != null) {
        if (a instanceof SceneWrapper) {
          return a;
        }
        a = a.Y;
      }
      return null;
    }
  }
  SceneDirector.i = true;
  SceneDirector.s = Node;
  Object.assign(SceneDirector.prototype, {
    l: SceneDirector
  });
