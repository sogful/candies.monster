  class C5 {}
  C5.i = true;
  C5.Je = true;
  class C180 {}
  C180.i = true;
  C180.Je = true;
  class MotionBase {
    constructor() {
      this.controllers = null;
      this.wM = true;
    }
    free() {
      let a = this.controllers;
      let b;
      while (a != null) {
        b = a.next;
        a.free();
        a = b;
      }
    }
    lq(a) {
      if (this.controllers != null) {
        a.next = this.controllers;
      }
      this.controllers = a;
      a.object = this;
    }
    detach(a) {
      if (this.controllers == a) {
        this.controllers = this.controllers.next;
      } else {
        let b = this.controllers;
        while (b.next != a) {
          b = b.next;
        }
        b.next = a.next;
      }
      a.next = null;
      a.object = null;
    }
    lN() {
      let a = this.controllers;
      while (a != null) {
        if (a.type == 303) {
          return a;
        }
        a = a.next;
      }
      return null;
    }
    tickAnims(a) {
      if (this.controllers == null || !this.wM) {
        return false;
      }
      let b = false;
      let c = this.controllers;
      let d;
      while (c != null) {
        d = c.next;
        if (c.update(a)) {
          b = true;
        }
        c = d;
      }
      return b;
    }
  }
  MotionBase.i = true;
  Object.assign(MotionBase.prototype, {
    l: MotionBase
  });
  class SceneNode extends MotionBase {
    constructor(a, b) {
      super();
      this.type = this.typeId();
      this.flags = b | 32 | SceneNode.IM;
      this.Y = this.parent = this.name = null;
      this.Db = new SceneTransform();
      this.Fa = new SceneTransform();
      this.Ne = 0;
      this.sa = this.Mu(a);
      this.key = UidGen.next();
      this.Qd = this.Xg = null;
      SceneNode.count++;
    }
    free() {
      if (!((this.flags & 16) > 0)) {
        super.free();
        if (this.parent != null) {
          this.parent.removeChild(this);
        }
        this.sa = this.Fa = this.Db = null;
        for (var a = this.Qd; a != null;) {
          a.state.Xr = null;
          a = a.next;
        }
        this.lR();
        this.flags = 16;
        SceneNode.count--;
      }
    }
    gB() {
      let a = this;
      while (a.parent != null) {
        a = a.parent;
      }
      return a;
    }
    Gd(a, b) {
      if (b == null) {
        b = true;
      }
      if (a == null) {
        a = true;
      }
      this.Rx(b);
      if (b) {
        this.pe();
        if (a) {
          this.iD();
        }
      }
    }
    Rx() {
      if (!((this.flags & 64) > 0)) {
        if ((this.flags & 512) > 0) {
          if (this.parent != null) {
            this.Fa.cE(this.parent.Fa, this.Db);
          } else {
            this.Fa.Tw(this.Db);
          }
        } else if (this.parent != null) {
          this.Fa.bE(this.parent.Fa, this.Db);
        } else {
          this.Fa.set(this.Db);
        }
      }
    }
    pe() {}
    iD() {
      if (this.parent != null) {
        this.parent.pe();
        this.parent.iD();
      }
    }
    Um(a) {
      var b = a == null;
      if (b) {
        a = RenderStateCollector.bR(this);
      } else {
        let c = this.Qd;
        while (c != null) {
          let d = a[c.state.type];
          let e = c.state;
          if (d.Ga == d.eb) {
            d.grow();
          }
          d.N[d.Ga++] = e;
          c = c.next;
        }
      }
      this.jD(a);
      if (b) {
        RenderStateCollector.kM();
      } else {
        for (b = this.Qd; b != null;) {
          --a[b.state.type].Ga;
          b = b.next;
        }
      }
      this.flags &= -33;
    }
    li(a) {
      let b = this.Qd;
      while (b != null) {
        if (b.state.type == a) {
          return b.state;
        }
        b = b.next;
      }
      return null;
    }
    Bh(a) {
      a.Xr = this;
      this.flags |= 32;
      if (this.Qd == null) {
        this.Qd = new StateNode(a);
      } else {
        for (var b = this.Qd; b != null;) {
          if (b.state.type == a.type) {
            b.state = a;
            return;
          }
          b = b.next;
        }
        b = new StateNode(a);
        b.next = this.Qd;
        this.Qd = b;
      }
    }
    qs(a) {
      let b = this.Qd;
      let c = null;
      while (b != null) {
        if (b.state.type == a) {
          if (c != null) {
            c.next = b.next;
          } else {
            this.Qd = b.next;
          }
          b.next = null;
          this.flags |= 32;
          break;
        }
        c = b;
        b = b.next;
      }
    }
    lR() {
      let a = this.Qd;
      let b;
      if (a != null) {
        this.flags |= 32;
      }
      while (a != null) {
        b = a.next;
        a.next = null;
        a = b;
      }
      this.Qd = null;
    }
    dR(a) {
      let b = this.Qd;
      while (b != null) {
        let c = a[b.state.type];
        let d = b.state;
        if (c.Ga == c.eb) {
          c.grow();
        }
        c.N[c.Ga++] = d;
        b = b.next;
      }
    }
    Mu(a) {
      if (a == null) {
        a = SceneNode.HM;
      }
      if (a == null) {
        throw 10;
      }
      switch (a) {
        case 202:
          return new PolygonShapeBounds();
        case 302:
          return new BoxBounds();
        default:
          throw 11;
      }
    }
    typeId() {
      return 101;
    }
  }
  SceneNode.i = true;
  SceneNode.Ib = [C180, C5];
  SceneNode.s = MotionBase;
  Object.assign(SceneNode.prototype, {
    l: SceneNode
  });
  class SceneGroup extends SceneNode {
    constructor(a, b) {
      super(b, 2);
      this.ea = this.Mu(b);
      this.Jk = Array(7);
      if (a != null) {
        a.P(this);
      }
      this.hr = 0;
      this.effect = this.Xo = null;
      SceneGroup.count++;
    }
    free() {
      if (!((this.flags & 16) > 0)) {
        if (this.effect != null) {
          this.effect.free();
        }
        this.effect = null;
        this.ea.free();
        this.Jk = this.ea = null;
        super.free();
        SceneGroup.count--;
      }
    }
    Rf(a) {
      this.effect = a;
      this.effect.Dh(this);
    }
    Sc() {}
    Ub(a, b) {
      if (!this.sa.contains(a)) {
        return false;
      }
      if (b != null) {
        b.add(this);
      }
      return true;
    }
    Fl(a, b) {
      return b;
    }
    pe() {
      if (!((this.flags & 128) > 0)) {
        this.ea.kt(this.Fa, this.sa);
        super.pe();
      }
    }
    jD(a) {
      let b = 0;
      let c = this.Jk;
      let d = 0;
      let e = 0;
      while (e < a.length) {
        var f = a[e];
        ++e;
        if (f.Ga == 0) {
          c[d] = null;
        } else {
          f = f.N[f.Ga - 1].collapse(f);
          c[d] = f;
          b |= 1 << f.type;
        }
        ++d;
      }
      this.hr = b;
    }
    typeId() {
      return 201;
    }
  }
  SceneGroup.i = true;
  SceneGroup.s = SceneNode;
  Object.assign(SceneGroup.prototype, {
    l: SceneGroup
  });
  class MeshNode extends SceneGroup {
    constructor(a, b, c, d) {
      super(c, d);
      this.size = new Vec4(1, 1, 0, 1);
      this.min = new Vec4(0, 0, 0, 1);
      this.max = new Vec4(1, 1, 0, 1);
      this.cols = a;
      this.rows = b;
      this.FP();
      this.Sc();
    }
    FP() {
      this.pw = (this.cols + 1) * (this.rows + 1);
      this.gj = new ArrayList(this.pw);
      for (var a = 0, b = this.pw; a < b;) {
        ++a;
        this.gj.pushBack(new Vec4(0, 0, 0, 1));
      }
      a = this.cols + 1;
      b = this.rows + 1;
      let c = 0;
      let d;
      while (c < b) {
        for (d = 0; d < a;) {
          var e = this.gj.N[c * a + d];
          e.x = this.min.x + d / (a - 1) * this.max.x;
          e.y = this.min.y + c / (b - 1) * this.max.y;
          ++d;
        }
        ++c;
      }
      this.YP = (this.cols * 2 + 2) * this.rows + (this.rows - 1) * 2;
      this.indices = new Uint8Array(this.YP);
      --b;
      for (c = e = 0; c < b;) {
        for (d = 0; d < a;) {
          this.indices[e++] = c * a + d;
          this.indices[e++] = c * a + a + d;
          ++d;
        }
        if (c < b - 1) {
          this.indices[e++] = (c + 1) * a + (a - 1);
          this.indices[e++] = (c + 1) * a;
        }
        ++c;
      }
    }
    Sc() {
      super.Sc();
    }
    typeId() {
      return 601;
    }
  }
  MeshNode.i = true;
  MeshNode.s = SceneGroup;
  Object.assign(MeshNode.prototype, {
    l: MeshNode
  });
  class BufferNode extends SceneGroup {
    constructor(a, b) {
      super(a, 402);
      this.gv = b;
      this.Sc();
      this.AB = this.jF = null;
    }
    free() {
      this.gv = null;
      var a = this.jF;
      if (a != null) {
        a.free();
      }
      a = this.AB;
      if (a != null) {
        a.free();
      }
      this.AB = this.jF = null;
      super.free();
    }
    Mu() {
      return new CircleBounds();
    }
    Ub() {
      return false;
    }
    Sc() {
      let a = this.gv.getData(0);
      this.ea.Pn(a);
    }
    typeId() {
      return 501;
    }
  }
  BufferNode.i = true;
  BufferNode.s = SceneGroup;
  Object.assign(BufferNode.prototype, {
    l: BufferNode
  });
  class SceneRoot extends SceneNode {
    constructor(a, b, c) {
      if (c == null) {
        c = 0;
      }
      super(b, c | 1);
      this.children = null;
      if (a != null) {
        a.P(this);
      }
      SceneRoot.count++;
    }
    free() {
      if (!((this.flags & 16) > 0)) {
        for (var a = this.children; a != null;) {
          let b = a.Y;
          if (a.Xg != null) {
            a.Xg.free();
          } else {
            a.free();
          }
          a = b;
        }
        super.free();
        SceneRoot.count--;
      }
    }
    Fl(a, b) {
      return NodeTreeUtil.Fl(this, a, b);
    }
    Ub(a, b) {
      let c = false;
      if (this.sa.contains(a)) {
        let d = this.children;
        while (d != null) {
          if (d.Ub(a, b)) {
            c = true;
          }
          d = d.Y;
        }
      }
      return c;
    }
    tickAnims(a) {
      let b = super.tickAnims(a);
      let c = this.children;
      let d;
      while (c != null) {
        d = c.Y;
        if (c.tickAnims(a)) {
          b = true;
        }
        c = d;
      }
      return b;
    }
    P(a) {
      if (this.children == null) {
        this.children = a;
        a.Y = null;
      } else {
        let b = this.children;
        while (b.Y != null) {
          b = b.Y;
        }
        b.Y = a;
      }
      a.parent = this;
    }
    Mj() {
      let a = 0;
      let b = this.children;
      while (b != null) {
        ++a;
        b = b.Y;
      }
      return a;
    }
    ML(a, b) {
      if (b == 0) {
        a.Y = this.children;
        this.children = a;
      } else {
        let c = this.children;
        let d = 0;
        for (--b; d < b;) {
          ++d;
          c = c.Y;
        }
        a.Y = c.Y;
        c.Y = a;
      }
      a.parent = this;
    }
    removeChild(a) {
      if (this.children == a) {
        this.children = a.Y;
      } else {
        let b = this.children;
        while (b.Y != a) {
          b = b.Y;
        }
        b.Y = a.Y;
      }
      a.Y = null;
      a.parent = null;
      return this;
    }
    nb(a) {
      let b = this.children;
      let c = 0;
      while (c <= a) {
        if (c == a) {
          return b;
        }
        b = b.Y;
        ++c;
      }
      return null;
    }
    Ww(a, b) {
      this.removeChild(a);
      this.ML(a, b);
    }
    fo(a) {
      let b = this.children;
      while (b != null) {
        if (b.name == a) {
          return b;
        }
        b = b.Y;
      }
      return null;
    }
    MS(a, b) {
      let c = null;
      let d = null;
      for (var e = 0, f = this.children; e < 2 && f != null;) {
        if (f.Y == a) {
          c = f;
          ++e;
        } else if (f.Y == b) {
          d = f;
          ++e;
        }
        f = f.Y;
      }
      e = a.Y;
      f = b.Y;
      a.Y = null;
      b.Y = null;
      if (e == b) {
        if (c != null) {
          c.Y = b;
        } else {
          this.children = b;
        }
        b.Y = a;
        a.Y = f;
      } else if (f == a) {
        if (d != null) {
          d.Y = a;
        } else {
          this.children = a;
        }
        a.Y = b;
        b.Y = e;
      } else {
        if (c != null) {
          c.Y = b;
        } else {
          this.children = b;
        }
        b.Y = e;
        if (d != null) {
          d.Y = a;
        } else {
          this.children = a;
        }
        a.Y = f;
      }
    }
    NS(a, b) {
      this.MS(this.nb(a), this.nb(b));
    }
    Yw(a) {
      if (this.children != a) {
        for (var b = this.children; b.Y != a;) {
          b = b.Y;
        }
        b.Y = a.Y;
        a.Y = this.children;
        this.children = a;
      }
    }
    bx(a) {
      if (a.Y != null) {
        var b = this.children;
        if (b == a) {
          while (b.Y != null) {
            b = b.Y;
          }
          b.Y = a;
          this.children = a.Y;
        } else {
          while (b.Y != a) {
            b = b.Y;
          }
          for (b = b.Y = a.Y; b.Y != null;) {
            b = b.Y;
          }
          b.Y = a;
        }
        a.Y = null;
      }
    }
    Rx(a) {
      super.Rx(a);
      let b = this.children;
      while (b != null) {
        b.Gd(false, a);
        b = b.Y;
      }
    }
    pe() {
      if (!((this.flags & 128) > 0) && this.children != null) {
        var a = this.children;
        this.sa.from(a.sa);
        for (a = a.Y; a != null;) {
          this.sa.lr(a.sa);
          a = a.Y;
        }
        super.pe();
      }
    }
    jD(a) {
      let b = this.children;
      while (b != null) {
        b.Um(a);
        b = b.Y;
      }
    }
    typeId() {
      return 301;
    }
  }
  SceneRoot.i = true;
  SceneRoot.s = SceneNode;
  Object.assign(SceneRoot.prototype, {
    l: SceneRoot
  });
  class SpriteNode extends SceneGroup {
    constructor(a) {
      super(a, 302);
      this.flags |= 512;
      this.size = new Vec4(1, 1, 0, 1);
      this.Sc();
    }
    Lb(a, b) {
      let c = this.size;
      c.x = a;
      c.y = b;
      this.Sc();
    }
    Ub(a, b) {
      if (!this.sa.contains(a)) {
        return false;
      }
      a = this.Fa.gg(a, new Vec4(0, 0, 0, 1));
      if (PointInRect.RS(a.x, a.y, this.size.x, this.size.y)) {
        if (b != null) {
          b.add(this);
        }
        return true;
      } else {
        return false;
      }
    }
    Fl(a, b) {
      let c = new Vec4(0, 0, 0, 1);
      let d = FLOAT_MAX;
      let e = FLOAT_MAX;
      let f = FLOAT_MIN;
      let g = FLOAT_MIN;
      let h = this.size.x;
      let m = this.size.y;
      if (a == this) {
        e = d = 0;
        f = h;
        g = m;
      } else {
        if (a == this.parent) {
          var n = this.Db;
          c.x = 0;
          c.y = 0;
          n.Jb(c, c);
          if (c.x < d) {
            d = c.x;
          }
          if (c.x > f) {
            f = c.x;
          }
          if (c.y < e) {
            e = c.y;
          }
          if (c.y > g) {
            g = c.y;
          }
          c.x = h;
          c.y = 0;
          n.Jb(c, c);
          if (c.x < d) {
            d = c.x;
          }
          if (c.x > f) {
            f = c.x;
          }
          if (c.y < e) {
            e = c.y;
          }
          if (c.y > g) {
            g = c.y;
          }
          c.x = h;
          c.y = m;
          n.Jb(c, c);
          if (c.x < d) {
            d = c.x;
          }
          if (c.x > f) {
            f = c.x;
          }
          if (c.y < e) {
            e = c.y;
          }
          if (c.y > g) {
            g = c.y;
          }
          c.x = 0;
          c.y = m;
          n.Jb(c, c);
        } else if (a.parent == null) {
          n = this.Fa;
          c.x = 0;
          c.y = 0;
          n.Jb(c, c);
          if (c.x < d) {
            d = c.x;
          }
          if (c.x > f) {
            f = c.x;
          }
          if (c.y < e) {
            e = c.y;
          }
          if (c.y > g) {
            g = c.y;
          }
          c.x = h;
          c.y = 0;
          n.Jb(c, c);
          if (c.x < d) {
            d = c.x;
          }
          if (c.x > f) {
            f = c.x;
          }
          if (c.y < e) {
            e = c.y;
          }
          if (c.y > g) {
            g = c.y;
          }
          c.x = h;
          c.y = m;
          n.Jb(c, c);
          if (c.x < d) {
            d = c.x;
          }
          if (c.x > f) {
            f = c.x;
          }
          if (c.y < e) {
            e = c.y;
          }
          if (c.y > g) {
            g = c.y;
          }
          c.x = 0;
          c.y = m;
          n.Jb(c, c);
        } else {
          n = this.Fa;
          a = a.Fa;
          c.x = 0;
          c.y = 0;
          n.Jb(c, c);
          a.gg(c, c);
          if (c.x < d) {
            d = c.x;
          }
          if (c.x > f) {
            f = c.x;
          }
          if (c.y < e) {
            e = c.y;
          }
          if (c.y > g) {
            g = c.y;
          }
          c.x = h;
          c.y = 0;
          n.Jb(c, c);
          a.gg(c, c);
          if (c.x < d) {
            d = c.x;
          }
          if (c.x > f) {
            f = c.x;
          }
          if (c.y < e) {
            e = c.y;
          }
          if (c.y > g) {
            g = c.y;
          }
          c.x = h;
          c.y = m;
          n.Jb(c, c);
          a.gg(c, c);
          if (c.x < d) {
            d = c.x;
          }
          if (c.x > f) {
            f = c.x;
          }
          if (c.y < e) {
            e = c.y;
          }
          if (c.y > g) {
            g = c.y;
          }
          c.x = 0;
          c.y = m;
          n.Jb(c, c);
          a.gg(c, c);
        }
        if (c.x < d) {
          d = c.x;
        }
        if (c.x > f) {
          f = c.x;
        }
        if (c.y < e) {
          e = c.y;
        }
        if (c.y > g) {
          g = c.y;
        }
      }
      if (b == null) {
        b = new Bounds(d, e, f, g);
      } else {
        b.A = d;
        b.D = e;
        b.B = f;
        b.G = g;
      }
      return b;
    }
    Sc() {
      super.Sc();
      var a = this.size.x / 2;
      let b = this.size.y / 2;
      this.ea.C.x = a;
      this.ea.C.y = b;
      this.ea.Z = Math.sqrt(a * a + b * b);
      if (this.ea.type == 302) {
        a = this.ea.gb;
        a.A = 0;
        a.D = 0;
        a.B = this.size.x;
        a.G = this.size.y;
      }
    }
    typeId() {
      return 401;
    }
  }
  SpriteNode.i = true;
  SpriteNode.s = SceneGroup;
  Object.assign(SpriteNode.prototype, {
    l: SpriteNode
  });
  class C295 {}
  C295.i = true;
  C295.Je = true;
  Object.assign(C295.prototype, {
    l: C295
  });

  class DisplayBase {
    constructor(a) {
      DisplayBase.count++;
      this.u = a;
      a.Xg = this;
      this.VL = this.typeId();
      this.flags = 6;
      this.eg = this.ed = this.dg = this.Ra = 1;
      this.qn = this.pn = this.Sg = this.Rg = this.Ug = this.Tg = this.cg = this.Zd = 0;
      this.Uc = 1;
      this.eu = true;
    }
    free() {
      this.u = null;
      DisplayBase.count--;
    }
    remove() {
      let a = this.u.parent;
      if (a != null) {
        a.removeChild(this.u);
      }
    }
    mh() {
      var a = this.u.parent;
      if (a != null && (a = a.Xg, a != null && a.VL == 204)) {
        return a;
      } else {
        return null;
      }
    }
    ox(a) {
      this.u.name = a;
    }
    W(a) {
      a = a < 0 ? 0 : a > 1 ? 1 : a;
      if (this.Uc != a) {
        this.Uc = a;
        let b = this.u;
        if (a < 1) {
          let c = b.li(5);
          if (c == null) {
            b.Bh(new AlphaState(this.Uc));
          } else {
            c.bf(a);
          }
        } else {
          b.qs(5);
        }
        b.flags |= 32;
      }
    }
    ri() {
      return this.eu;
    }
    L(a) {
      if (this.eu != a) {
        this.eu = a;
        this.u.Ne = a ? 0 : 1;
      }
    }
    setScaleX(a) {
      if (this.Ra != a) {
        this.dg = this.Ra = a;
        if (absLessThan(a, 0.001)) {
          this.dg = (a >= 0 ? 1 : -1) * 0.001;
        }
        if (a == 1 && this.ed == 1) {
          this.flags = this.flags & -3 | 4;
          a = this.u.Db;
          a.scale.x = 1;
          a.scale.y = 1;
          a.K |= 500;
        } else {
          this.flags &= -7;
        }
        this.oc();
      }
    }
    setScaleY(a) {
      if (this.ed != a) {
        this.eg = this.ed = a;
        if (absLessThan(a, 0.001)) {
          this.eg = (a >= 0 ? 1 : -1) * 0.001;
        }
        if (a == 1 && this.Ra == 1) {
          this.flags = this.flags & -3 | 4;
          a = this.u.Db;
          a.scale.x = 1;
          a.scale.y = 1;
          a.K |= 500;
        } else {
          this.flags &= -7;
        }
        this.oc();
      }
    }
    setUniformScale(a) {
      if (this.Ra != a || this.ed != a) {
        this.Ra = this.ed = a;
        if (absLessThan(a, 0.001)) {
          this.dg = this.eg = (a >= 0 ? 1 : -1) * 0.001;
        } else {
          this.dg = this.eg = a;
        }
        this.flags |= 2;
        if (a == 1) {
          a = this.u.Db;
          a.scale.x = 1;
          a.scale.y = 1;
          a.K |= 500;
          this.flags |= 4;
        } else {
          this.flags &= -5;
        }
        this.oc();
      }
    }
    setScale(a, b) {
      if (this.Ra != a || this.ed != b) {
        if (a == 1 && b == 1) {
          this.flags = this.flags & -3 | 4;
          let c = this.u.Db;
          c.scale.x = 1;
          c.scale.y = 1;
          c.K |= 500;
        } else {
          this.flags = a == b ? (this.flags &= -5) | 2 : this.flags & -7;
        }
        this.Ra = this.dg = a;
        this.ed = this.eg = b;
        if (absLessThan(a, 0.001)) {
          this.dg = (a >= 0 ? 1 : -1) * 0.001;
        }
        if (absLessThan(b, 0.001)) {
          this.eg = (b >= 0 ? 1 : -1) * 0.001;
        }
        this.oc();
      }
    }
    la(a) {
      if (this.Zd != a) {
        this.Zd = a;
        let b;
        b = a % 360;
        if (b < 0) {
          b += 360;
        }
        this.cg = b * DEG2RAD;
        if (a == 0) {
          this.flags &= -2;
          this.u.Db.RD();
        } else {
          this.flags |= 1;
        }
        this.oc();
      }
    }
    getX() {
      return this.Tg;
    }
    setX(a) {
      if (this.Tg != a) {
        this.Tg = a;
        this.oc();
      }
      return a;
    }
    getY() {
      return this.Ug;
    }
    setY(a) {
      if (this.Ug != a) {
        this.Ug = a;
        this.oc();
      }
    }
    uS(a) {
      if (this.Tg != a.x || this.Ug != a.y) {
        this.Tg = a.x;
        this.Ug = a.y;
        this.oc();
      }
    }
    gS(a, b, c, d) {
      let e = false;
      if (this.Tg != a || this.Ug != b) {
        this.Tg = a;
        this.Ug = b;
        e = true;
      }
      if (this.Zd != 0) {
        a = this.Zd = 0;
        if (a < 0) {
          a += 360;
        }
        this.cg = a * DEG2RAD;
        this.flags &= -2;
        this.u.Db.RD();
        e = true;
      }
      if (this.Ra != c || this.ed != d) {
        this.dg = c;
        if (absLessThan(c, 0.001)) {
          this.dg = (c >= 0 ? 1 : -1) * 0.001;
        }
        this.eg = d;
        if (absLessThan(d, 0.001)) {
          this.eg = (d >= 0 ? 1 : -1) * 0.001;
        }
        if (c == d) {
          if (c == 1) {
            this.flags = this.flags & -3 | 4;
            c = this.u.Db;
            c.scale.x = 1;
            c.scale.y = 1;
            c.K |= 500;
          } else {
            this.flags = this.flags & -5 | 2;
          }
        } else {
          this.flags &= -7;
        }
        e = true;
      }
      if (e) {
        this.oc();
      }
    }
    tS(a) {
      let b = a.x;
      a = a.y;
      if (b == null) {
        b = this.Rg;
      }
      if (a == null) {
        a = this.Sg;
      }
      if (this.Rg != b || this.Sg != a) {
        this.Rg = b;
        this.Sg = a;
        this.oc();
      }
    }
    setPivot(a, b) {
      if (a == null) {
        a = this.Rg;
      }
      if (b == null) {
        b = this.Sg;
      }
      if (this.Rg != a || this.Sg != b) {
        this.Rg = a;
        this.Sg = b;
        this.oc();
      }
    }
    setOrigin(a, b) {
      if (a == null) {
        a = this.pn;
      }
      if (b == null) {
        b = this.qn;
      }
      if (this.pn != a || this.qn != b) {
        this.pn = a;
        this.qn = b;
        this.oc();
      }
    }
    center() {
      this.centerPivot();
      this.centerOrigin();
    }
    update(a) {
      this.u.tickAnims(a);
      this.u.Gd();
      this.u.Um();
    }
    Jx(a) {
      NodeTreeUtil.Yf(this.u);
      return this.u.Fa.Jb(a, new Vec4(0, 0, 0, 1));
    }
    Ix(a) {
      NodeTreeUtil.Yf(this.u);
      return this.u.Fa.gg(a, new Vec4(0, 0, 0, 1));
    }
    tween() {
      return new SpriteTween(this);
    }
    Wd(a) {
      if (a == null) {
        this.u.qs(0);
      } else {
        this.u.Bh(new BlendModeState(a, false));
      }
    }
    pp(a) {
      var b = this.u.li(2);
      if (a != null) {
        if (b == null) {
          b = new ColorTransformState();
          this.u.Bh(b);
        }
        b = b.transform;
        var c = b.$b;
        var d = a.$b;
        c.x = d.x;
        c.y = d.y;
        c.z = d.z;
        c.w = d.w;
        c = b.offset;
        d = a.offset;
        c.x = d.x;
        c.y = d.y;
        c.z = d.z;
        c.w = d.w;
        b.hint = a.hint;
      } else if (b != null) {
        this.u.qs(2);
      }
    }
    jE(a) {
      let b = this.u.li(1);
      if (a != null) {
        if (b == null) {
          b = new ClipState();
          this.u.Bh(b);
        }
        b.fS(a);
      } else if (b != null) {
        this.u.qs(1);
      }
    }
    oc() {
      let a = this.u.Db;
      let b = this.Tg;
      let c = this.Ug;
      let d = this.Rg;
      let e = this.Sg;
      let f = this.pn;
      let g = this.qn;
      let h = this.dg;
      var m = this.eg;
      var n = this.flags;
      if ((n & 1) > 0) {
        let p = Math.sin(this.cg);
        let v = Math.cos(this.cg);
        var q = a.matrix;
        q.m11 = v;
        q.m12 = -p;
        q.m21 = p;
        q.m22 = v;
        a.K = a.K & -4 | 504;
        if ((n & 4) > 0) {
          a.translate.x = -(f * v) + g * p + f + b - d;
          a.translate.y = -(f * p) - g * v + g + c - e;
        } else if ((n & 2) > 0) {
          m = h * f;
          n = h * g;
          a.scale.x = a.scale.y = h;
          a.K = a.K & -2 | 500;
          a.translate.x = -(m * v) + n * p + f + b - d;
          a.translate.y = -(m * p) - n * v + g + c - e;
        } else {
          n = h * f;
          q = m * g;
          a.scale.x = h;
          a.scale.y = m;
          a.K = a.K & -6 | 496;
          a.translate.x = -(n * v) + q * p + f + b - d;
          a.translate.y = -(n * p) - q * v + g + c - e;
        }
      } else if ((n & 4) > 0) {
        a.translate.x = b - d;
        a.translate.y = c - e;
      } else if ((n & 2) > 0) {
        a.scale.x = a.scale.y = h;
        a.K = a.K & -2 | 500;
        a.translate.x = -(h * f) + f + b - d;
        a.translate.y = -(h * g) + g + c - e;
      } else {
        a.scale.x = h;
        a.scale.y = m;
        a.K = a.K & -6 | 496;
        a.translate.x = -(h * f) + f + b - d;
        a.translate.y = -(m * g) + g + c - e;
      }
      a.K = a.K & -2 | 496;
    }
    typeId() {
      return 104;
    }
  }
  DisplayBase.i = true;
  DisplayBase.Ib = [C180, C295];
  Object.assign(DisplayBase.prototype, {
    l: DisplayBase
  });

  class MeshBuffer {
    constructor() {
      this.pw = 0;
      this.gj = Array(6);
      let a = 0;
      while (a < 6) {
        this.gj[a++] = [];
      }
    }
    getData(a) {
      return this.gj[a];
    }
  }
  MeshBuffer.i = true;
  Object.assign(MeshBuffer.prototype, {
    l: MeshBuffer
  });

  class ShapeBounds {
    constructor() {
      this.type = this.typeId();
      this.C = new Vec4(0, 0, 0, 1);
      this.Z = 0;
    }
    free() {
      this.C = null;
    }
    Pn() {}
    from() {}
    typeId() {
      return 102;
    }
  }
  ShapeBounds.i = true;
  ShapeBounds.Ib = [C180];
  Object.assign(ShapeBounds.prototype, {
    l: ShapeBounds
  });
  class BoxBounds extends ShapeBounds {
    constructor() {
      super();
      this.gb = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
    }
    free() {
      this.gb = null;
      super.free();
    }
    Pn(a) {
      var b = this.gb;
      b.A = b.D = vInfinity;
      b.B = b.G = vNegInfinity;
      b = a.length >> 1;
      let c = 0;
      while (c < b) {
        let d = c++;
        this.gb.ku(new Vec4(a[d << 1], a[(d << 1) + 1], 0, 1));
      }
    }
    contains(a) {
      let b = this.gb;
      let c = a.x;
      a = a.y;
      if (c >= b.A && c <= b.B && a >= b.D) {
        return a <= b.G;
      } else {
        return false;
      }
    }
    lr(a) {
      switch (a.type) {
        case 202:
          var b = a.C;
          a = a.Z;
          this.gb.ku(new Vec4(b.x - a, b.y - a, 0, 1));
          this.gb.ku(new Vec4(b.x + a, b.y + a, 0, 1));
          break;
        case 302:
          this.gb.add(a.gb);
      }
      b = this.gb;
      b = (b.B - b.A) / 2;
      a = this.gb;
      a = (a.G - a.D) / 2;
      this.C.x = this.gb.A + b;
      this.C.y = this.gb.D + a;
      this.Z = Math.sqrt(b * b + a * a);
    }
    from(a) {
      let b = a.C;
      let c = a.Z;
      switch (a.type) {
        case 202:
          this.gb.A = b.x - c;
          this.gb.D = b.y - c;
          this.gb.B = b.x + c;
          this.gb.G = b.y + c;
          break;
        case 302:
          var d = this.gb;
          a = a.gb;
          d.A = a.A;
          d.D = a.D;
          d.B = a.B;
          d.G = a.G;
      }
      d = this.C;
      d.x = b.x;
      d.y = b.y;
      d.z = b.z;
      this.Z = c;
    }
    kt(a, b) {
      var c = this.C;
      var d = b.C;
      if ((a.K & 64) > 0) {
        a.Tm();
      }
      var e = a.Ue;
      var f = e.m21 * c.x + e.m22 * c.y + e.m24;
      d.x = e.m11 * c.x + e.m12 * c.y + e.m14;
      d.y = f;
      b.Z = ((a.K & 8) > 0 ? Math.max(Math.abs(a.scale.x), Math.abs(a.scale.y)) : Math.max(Math.abs(a.matrix.m11) + Math.abs(a.matrix.m12), Math.abs(a.matrix.m21) + Math.abs(a.matrix.m22))) * this.Z;
      b = b.gb;
      c = this.gb;
      d = c.B - c.A;
      c = this.gb;
      c = c.G - c.D;
      f = e = BoxBounds.Fd;
      var g = this.gb;
      var h = this.gb;
      f.x = (g.A + g.B) / 2;
      f.y = (h.D + h.G) / 2;
      a.Jb(e, e);
      b.A = e.x;
      b.D = e.y;
      b.B = e.x;
      b.G = e.y;
      if ((a.K & 8) > 0) {
        h = a.matrix;
        e = h.m11;
        f = h.m12;
        g = h.m21;
        h = h.m22;
        a = a.scale;
        d = d * a.x * 0.5;
        a = c * a.y * 0.5;
        if (e > 0) {
          b.A -= e * d;
          b.B += e * d;
        } else {
          b.A += e * d;
          b.B -= e * d;
        }
        if (f > 0) {
          b.A -= f * a;
          b.B += f * a;
        } else {
          b.A += f * a;
          b.B -= f * a;
        }
        if (g > 0) {
          b.D -= g * d;
          b.G += g * d;
        } else {
          b.D += g * d;
          b.G -= g * d;
        }
        if (h > 0) {
          b.D -= h * a;
          b.G += h * a;
        } else {
          b.D += h * a;
          b.G -= h * a;
        }
      } else {
        g = a.matrix;
        e = g.m11;
        f = g.m12;
        h = Math.sqrt(e * e + f * f);
        a = h * d * 0.5;
        c = (e * g.m22 - f * g.m21) / h * c * 0.5;
        e = Math.atan2(f, e);
        d = Math.cos(e);
        e = Math.sin(e);
        if (d > 0) {
          b.A -= d * a;
          b.B += d * a;
        } else {
          b.A += d * a;
          b.B -= d * a;
        }
        if (e > 0) {
          b.A -= e * c;
          b.B += e * c;
        } else {
          b.A += e * c;
          b.B -= e * c;
        }
        if (-e > 0) {
          b.D -= -e * a;
          b.G += -e * a;
        } else {
          b.D += -e * a;
          b.G -= -e * a;
        }
        if (d > 0) {
          b.D -= d * c;
          b.G += d * c;
        } else {
          b.D += d * c;
          b.G -= d * c;
        }
      }
    }
    typeId() {
      return 302;
    }
  }
  BoxBounds.i = true;
  BoxBounds.s = ShapeBounds;
  Object.assign(BoxBounds.prototype, {
    l: BoxBounds
  });
  class CircleBounds extends ShapeBounds {
    constructor() {
      super();
    }
    Pn(a) {
      let b = 0;
      let c = 0;
      let d = 0;
      let e = a.length;
      for (var f = 0; f < e;) {
        b += a[f++];
        c += a[f++];
        d += a[f++];
      }
      f = e / 3 | 0;
      b /= f;
      c /= f;
      d /= f;
      let g = 0;
      for (f = 0; f < e;) {
        var h = a[f++] - b;
        let m = a[f++] - c;
        let n = a[f++] - d;
        h = h * h + m * m + n * n;
        if (h > g) {
          g = h;
        }
      }
      this.Z = Math.sqrt(g);
      a = this.C;
      a.x = b;
      a.y = c;
      a.z = d;
    }
    contains(a) {
      let b = a.x - this.C.x;
      let c = a.y - this.C.y;
      a = a.z - this.C.z;
      return b * b + c * c + a * a <= this.Z * this.Z;
    }
    lr(a) {
      var b = a.Z;
      if (b != 0) {
        var c = this.Z;
        if (c == 0) {
          this.Z = a.Z;
          b = this.C;
          c = a.C;
          b.x = c.x;
          b.y = c.y;
          b.z = c.z;
        } else {
          var d = this.C;
          var e = a.C;
          var f = e.x - d.x;
          var g = e.y - d.y;
          e = e.z - d.z;
          var h = f * f + g * g + e * e;
          var m = b - c;
          if (m * m >= h) {
            if (m >= 0) {
              this.Z = a.Z;
              b = this.C;
              c = a.C;
              b.x = c.x;
              b.y = c.y;
              b.z = c.z;
            }
          } else {
            a = Math.sqrt(h);
            if (a > 0) {
              m = (a + m) / (a * 2);
              h = this.C;
              h.x = d.x + f * m;
              h.y = d.y + g * m;
              h.z = d.z + e * m;
            }
            this.Z = (a + c + b) / 2;
          }
        }
      }
    }
    from(a) {
      this.C.x = a.C.x;
      this.C.y = a.C.y;
      this.Z = a.Z;
    }
    kt(a, b) {
      b.C = a.UL(this.C, b.C);
      b.Z = a.PN() * this.Z;
    }
    typeId() {
      return 502;
    }
  }
  CircleBounds.i = true;
  CircleBounds.s = ShapeBounds;
  Object.assign(CircleBounds.prototype, {
    l: CircleBounds
  });

  class TextNode extends DisplayBase {
    constructor(a, b) {
      a = new SpriteNode(a != null ? a.node : null);
      super(a);
      this.effect = new TextDrawEffect(b);
      a.Rf(this.effect);
      b = this.effect.size;
      a.Lb(b.x, b.y);
    }
    free() {
      if (this.u != null) {
        this.u.free();
        this.Hb = this.effect = null;
        super.free();
      }
    }
    Uf(a) {
      this.effect.free();
      this.effect = new TextDrawEffect(a);
      a = this.u;
      a.Rf(this.effect);
      let b = this.effect.size;
      a.Lb(b.x, b.y);
    }
    setMultiline(a) {
      if (a == null) {
        a = true;
      }
      if (this.effect.Ze) {
        this.effect.shape();
      }
      this.effect.nN(a);
    }
    shape() {
      this.effect.shape();
    }
    setBoxSize(a, b) {
      this.effect.setBoxSize(a, b);
      this.u.Lb(a, b);
    }
    setText(a) {
      this.effect.setText(a);
    }
    setAlign(a, b) {
      this.effect.setAlign(a, b);
    }
    $q() {
      return this.effect.$q();
    }
    setFontSize(a) {
      this.effect.setFontSize(a);
    }
    uv() {
      return this.effect.uv();
    }
    kp() {
      this.effect.kp();
    }
    kx(a) {
      this.effect.kx(a);
    }
    Is(a) {
      this.effect.Is(a);
    }
    Tf(a) {
      this.effect.Tf(a);
    }
    Re(a, b) {
      if (b == null) {
        b = true;
      }
      this.shape();
      var c = this.effect.Og.gb;
      c = new Bounds(c.A, c.D, c.B, c.G);
      if (c.A >= c.B || c.D >= c.G || a == this) {
        return c;
      }
      if (b) {
        NodeTreeUtil.Yf(this.u);
        if (a != null && !NodeTreeUtil.Ov(this.u, a.u)) {
          NodeTreeUtil.Yf(a.u);
        }
      }
      return NodeTreeUtil.cT(this.u, a == null ? this.u.gB() : a.u, c);
    }
    centerOrigin() {
      let a = this.Re(this);
      if (a.A >= a.B || a.D >= a.G) {
        this.setOrigin(0, 0);
      } else {
        this.setOrigin((a.A + a.B) / 2, (a.D + a.G) / 2);
      }
    }
    centerPivot() {
      let a = this.Re(this);
      if (a.A >= a.B || a.D >= a.G) {
        this.setPivot(0, 0);
      } else {
        this.setPivot((a.A + a.B) / 2, (a.D + a.G) / 2);
      }
    }
    getWidth() {
      let a = this.Re(this.mh());
      return a.B - a.A;
    }
    setScaleX() {
      throw 24;
    }
    setScaleY() {
      throw 25;
    }
    typeId() {
      return 404;
    }
  }
  TextNode.i = true;
  TextNode.s = DisplayBase;
  Object.assign(TextNode.prototype, {
    l: TextNode
  });
  class BoxShapeBounds extends ShapeBounds {
    constructor() {
      super();
      this.box = new BoundsLite(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
    }
    free() {
      this.box = null;
      super.free();
    }
    Pn(a) {
      var b = this.box;
      b.A = b.D = vInfinity;
      b.B = b.G = vNegInfinity;
      a = a.length >> 1;
      for (b = 0; b < a;) {
        ++b;
      }
    }
    contains() {
      return false;
    }
    lr() {}
    from() {}
    kt(a, b) {
      var c = this.C;
      var d = b.C;
      if ((a.K & 16) > 0) {
        a.nt();
      }
      var e = a.Ue;
      let f = c.x;
      let g = c.y;
      c = c.z;
      d.x = e.m11 * f + e.m12 * g + e.m13 * c + e.m14;
      d.y = e.m21 * f + e.m22 * g + e.m23 * c + e.m24;
      d.z = e.m31 * f + e.m32 * g + e.m33 * c + e.m34;
      if ((a.K & 8) > 0) {
        d = Math.abs(a.scale.x);
        e = Math.abs(a.scale.y);
        a = Math.abs(a.scale.z);
      } else {
        a = a.matrix;
        d = Math.abs(a.m11) + Math.abs(a.m12) + Math.abs(a.m13);
        e = Math.abs(a.m21) + Math.abs(a.m22) + Math.abs(a.m23);
        a = Math.abs(a.m31) + Math.abs(a.m32) + Math.abs(a.m33);
      }
      b.Z = Math.max(Math.max(d, e), a) * this.Z;
    }
    typeId() {
      return 402;
    }
  }
  BoxShapeBounds.i = true;
  BoxShapeBounds.s = ShapeBounds;
  Object.assign(BoxShapeBounds.prototype, {
    l: BoxShapeBounds
  });
  class PolygonShapeBounds extends ShapeBounds {
    constructor() {
      super();
    }
    Pn(a) {
      let b = a.length >> 1;
      var c = 0;
      var d = 0;
      for (var e = 0; e < b;) {
        var f = e++;
        c += a[f << 1];
        d += a[(f << 1) + 1];
      }
      c = this.C.x = c / b;
      d = this.C.y = d / b;
      for (e = this.Z = 0; e < b;) {
        var g = e++;
        f = a[g << 1] - c;
        g = a[(g << 1) + 1] - d;
        this.Z = Math.max(f * f + g * g, this.Z);
      }
      this.Z = Math.sqrt(this.Z);
    }
    contains(a) {
      let b = a.x - this.C.x;
      a = a.y - this.C.y;
      return b * b + a * a <= this.Z * this.Z;
    }
    lr(a) {
      if (a.Z != 0) {
        if (this.Z == 0) {
          this.Z = a.Z;
          this.C.x = a.C.x;
          this.C.y = a.C.y;
        } else {
          var b = a.C.x - this.C.x;
          var c = a.C.y - this.C.y;
          var d = a.Z - this.Z;
          var e = b * b + c * c;
          if (d * d >= e) {
            if (d >= 0) {
              this.from(a);
            }
          } else {
            d = Math.sqrt(e);
            e = (d + a.Z - this.Z) / (d * 2);
            this.C.x += e * b;
            this.C.y += e * c;
            this.Z = (d + this.Z + a.Z) / 2;
          }
        }
      }
    }
    from(a) {
      this.C.x = a.C.x;
      this.C.y = a.C.y;
      this.Z = a.Z;
    }
    kt(a, b) {
      var c = this.C;
      var d = b.C;
      if ((a.K & 64) > 0) {
        a.Tm();
      }
      let e = a.Ue;
      let f = e.m21 * c.x + e.m22 * c.y + e.m24;
      d.x = e.m11 * c.x + e.m12 * c.y + e.m14;
      d.y = f;
      if ((a.K & 8) > 0) {
        c = Math.abs(a.scale.x);
        d = Math.abs(a.scale.y);
        a = Math.abs(a.scale.z);
      } else {
        a = a.matrix;
        c = Math.abs(a.m11) + Math.abs(a.m12) + Math.abs(a.m13);
        d = Math.abs(a.m21) + Math.abs(a.m22) + Math.abs(a.m23);
        a = Math.abs(a.m31) + Math.abs(a.m32) + Math.abs(a.m33);
      }
      b.Z = Math.max(Math.max(c, d), a) * this.Z;
    }
    typeId() {
      return 202;
    }
  }
  PolygonShapeBounds.i = true;
  PolygonShapeBounds.s = ShapeBounds;
  Object.assign(PolygonShapeBounds.prototype, {
    l: PolygonShapeBounds
  });

  class ColorRectShape {
    constructor(a, b) {
      this.u = this.va = new SceneGroup();
      this.u.Xg = this;
      this.va.Bh(new AlphaState(1));
      if (a != null) {
        this.va.Rf(new MeshDrawEffect(a));
      } else {
        this.va.Rf(new ClearEffect(b));
      }
    }
    W(a) {
      this.va.li(5).bf(a);
    }
    L(a) {
      this.va.Ne = a ? 2 : 1;
    }
    free() {
      this.va.free();
      this.u = this.va = null;
    }
  }
  ColorRectShape.i = true;
  ColorRectShape.Ib = [C295];
  Object.assign(ColorRectShape.prototype, {
    l: ColorRectShape
  });
