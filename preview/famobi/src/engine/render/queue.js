  class RenderQueue {
    constructor() {
      this.Ab = null;
      this.Wx = new ArrayList(1024);
      this.Wx.Dm = true;
      this.stack = new Stack();
      this.Fd = new ArrayList();
    }
    wk(a) {
      this.Ab = a;
    }
  }
  RenderQueue.i = true;
  Object.assign(RenderQueue.prototype, {
    l: RenderQueue
  });
  class RenderStateCollector {
    static kM() {
      let a = 0;
      while (a < 7) {
        RenderStateCollector.Vs[a++].Ga = 0;
      }
    }
    static bR(a) {
      if (RenderStateCollector.Vs == null) {
        RenderStateCollector.uO();
      }
      let b = RenderStateCollector.Vs;
      let c = RenderStateCollector.MD;
      var d = a;
      for (c.clear(); d.parent != null;) {
        var e = d.parent;
        if (c.Ga == c.eb) {
          c.grow();
        }
        c.N[c.Ga++] = e;
        d = d.parent;
      }
      d = 0;
      for (e = c.Ga; d < e;) {
        ++d;
        c.N[--c.Ga].dR(b);
      }
      for (a = a.Qd; a != null;) {
        d = b[a.state.type];
        e = a.state;
        if (d.Ga == d.eb) {
          d.grow();
        }
        d.N[d.Ga++] = e;
        a = a.next;
      }
      c.clear(true);
      return b;
    }
    static uO() {
      RenderStateCollector.Vs = Array(7);
      let a = 0;
      while (a < 7) {
        RenderStateCollector.Vs[a++] = new Stack();
      }
      RenderStateCollector.MD = new Stack(16);
    }
  }
  RenderStateCollector.i = true;

  class RendererInfo {
    constructor(a) {
      this.V = a;
      this.Rz = this.va = this.effect = null;
    }
  }
  RendererInfo.i = true;
  Object.assign(RendererInfo.prototype, {
    l: RendererInfo
  });
