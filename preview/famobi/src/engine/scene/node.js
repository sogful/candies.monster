  class Node {
    constructor() {
      this.O = Application.instance;
      this.listener = null;
      this.Sx = false;
      this.parent = this.Me = this.Y = null;
      this.zC = this.yC = false;
      this.name = null;
      this.time = 0;
      Node.qw.pushBack(this);
    }
    dispose() {
      if (this.O != null) {
        for (var a = this.Me; a != null;) {
          var b = a.Y;
          a.dispose();
          a = b;
        }
        if (this.parent != null) {
          this.remove();
        }
        for (a = this.listener; a != null;) {
          b = a.next;
          a.callback = null;
          a.next = null;
          a = b;
        }
        this.O = this.listener = null;
        Node.qw.swapPop(Node.qw.indexOf(this));
      }
    }
    remove() {
      if (this.parent != null) {
        Node.removeChild(this);
      }
    }
    iterator() {
      return new NodeTreeIter(this);
    }
    oa(a) {
      return this.appendChild(a);
    }
    add(a) {
      return this.appendChild(Construct.qA(a));
    }
    update(a) {
      if (this.O != null) {
        this.Sx = true;
        for (var b = this.Me, c; b != null;) {
          c = b.Y;
          if (!b.zC && b.O != null) {
            b.update(a);
            b.iq(a);
            b.time += a;
          }
          b = c;
        }
        this.time += a;
      }
    }
    iq() {}
    render(a) {
      if (this.O != null && this.Sx != 0) {
        for (var b = this.Me, c; b != null;) {
          c = b.Y;
          if (!b.yC && b.O != null) {
            b.render(a);
          }
          b = c;
        }
      }
    }
    Qr() {}
    jb(a) {
      return Math.min(1, this.time / a);
    }
    $n(a, b) {
      for (var c = this.parent; c != null;) {
        if (StdString.Xt(c, a)) {
          return c;
        }
        c = c.parent;
      }
      c = 1;
      let d = [this];
      while (c > 0) {
        let e = d[--c];
        let f = e.Me;
        while (f != null) {
          d[c++] = f;
          f = f.Y;
        }
        if (e != b && StdString.Xt(e, a)) {
          return e;
        }
      }
      return null;
    }
    appendChild(a) {
      a.parent = this;
      var b = this.Me;
      if (b != null) {
        while (b.Y != null) {
          b = b.Y;
        }
        b.Y = a;
      } else {
        this.Me = a;
      }
      a.Qr();
      return a;
    }
    static removeChild(a) {
      if (a == null || a.parent == null) {
        return false;
      }
      var b = a.parent;
      if (a == b.Me) {
        b.Me = a.Y;
      } else {
        for (b = b.Me; b != null;) {
          if (b.Y == a) {
            b.Y = a.Y;
            break;
          }
          b = b.Y;
        }
      }
      a.parent = a.Y = null;
      return true;
    }
  }
  Node.i = true;
  Object.assign(Node.prototype, {
    l: Node
  });
  class NodeTreeUtil {
    static Ov(a, b) {
      for (a = a.parent; a != null;) {
        if (a == b) {
          return true;
        }
        a = a.parent;
      }
      return false;
    }
    static Yf(a) {
      let b = NodeTreeUtil.yx;
      b.clear();
      for (b.reserve(SceneNode.count); a != null;) {
        b.N[b.Ga++] = a;
        a = a.parent;
      }
      a = b.N[--b.Ga];
      for (a.Fa.set(a.Db); b.Ga > 0;) {
        let c = b.N[--b.Ga];
        if ((c.flags & 64) <= 0) {
          if ((c.flags & 512) > 0) {
            c.Fa.cE(a.Fa, c.Db);
          } else {
            c.Fa.bE(a.Fa, c.Db);
          }
        }
        a = c;
      }
    }
    static CN(a, b) {
      let c = NodeTreeUtil.DS;
      c.reserve(SceneNode.count);
      var d = NodeTreeUtil.yx;
      d.reserve(SceneNode.count);
      d.clear();
      for (d.N[d.Ga++] = a; d.Ga > 0;) {
        a = d.N[--d.Ga];
        if (a.Ne != 1) {
          if ((a.flags & 2) > 0) {
            if (a.effect != null) {
              c.N[c.Ga++] = a;
            }
          } else if ((a.flags & 1) > 0) {
            for (a = a.children; a != null;) {
              d.N[d.Ga++] = a;
              a = a.Y;
            }
          }
        }
      }
      b.clear();
      b.reserve(c.Ga);
      d = 0;
      for (a = c.Ga; d < a;) {
        ++d;
        let e = c.N[--c.Ga];
        b.N[b.ba++] = e;
      }
    }
    static Fl(a, b, c) {
      let d = FLOAT_MAX;
      let e = FLOAT_MAX;
      let f = FLOAT_MIN;
      let g = FLOAT_MIN;
      let h = NodeTreeUtil.yx;
      h.reserve(SceneNode.count);
      h.clear();
      for (h.N[h.Ga++] = a; h.Ga > 0;) {
        a = h.N[--h.Ga];
        if ((a.flags & 2) > 0) {
          a.Fl(b, c);
          if (c.A < d) {
            d = c.A;
          }
          if (c.D < e) {
            e = c.D;
          }
          if (c.B > f) {
            f = c.B;
          }
          if (c.G > g) {
            g = c.G;
          }
        } else if ((a.flags & 1) > 0) {
          for (a = a.children; a != null;) {
            h.N[h.Ga++] = a;
            a = a.Y;
          }
        }
      }
      c.A = d;
      c.D = e;
      c.B = f;
      c.G = g;
      return c;
    }
    static cT(a, b, c) {
      let d = c.A;
      let e = c.D;
      let f = c.B;
      let g = c.G;
      let h = FLOAT_MAX;
      let m = FLOAT_MAX;
      let n = FLOAT_MIN;
      let q = FLOAT_MIN;
      let p = new Vec4(0, 0, 0, 1);
      if (b == a) {
        h = c.A;
        m = c.D;
        n = c.B;
        q = c.G;
      } else {
        if (b == a.parent) {
          b = a.Db;
          p.x = d;
          p.y = e;
          b.Jb(p, p);
          if (p.x < h) {
            h = p.x;
          }
          if (p.x > n) {
            n = p.x;
          }
          if (p.y < m) {
            m = p.y;
          }
          if (p.y > q) {
            q = p.y;
          }
          p.x = f;
          p.y = e;
          b.Jb(p, p);
          if (p.x < h) {
            h = p.x;
          }
          if (p.x > n) {
            n = p.x;
          }
          if (p.y < m) {
            m = p.y;
          }
          if (p.y > q) {
            q = p.y;
          }
          p.x = f;
          p.y = g;
          b.Jb(p, p);
          if (p.x < h) {
            h = p.x;
          }
          if (p.x > n) {
            n = p.x;
          }
          if (p.y < m) {
            m = p.y;
          }
          if (p.y > q) {
            q = p.y;
          }
          p.x = d;
          p.y = g;
          b.Jb(p, p);
        } else if (b.parent == null) {
          b = a.Fa;
          p.x = d;
          p.y = e;
          b.Jb(p, p);
          if (p.x < h) {
            h = p.x;
          }
          if (p.x > n) {
            n = p.x;
          }
          if (p.y < m) {
            m = p.y;
          }
          if (p.y > q) {
            q = p.y;
          }
          p.x = f;
          p.y = e;
          b.Jb(p, p);
          if (p.x < h) {
            h = p.x;
          }
          if (p.x > n) {
            n = p.x;
          }
          if (p.y < m) {
            m = p.y;
          }
          if (p.y > q) {
            q = p.y;
          }
          p.x = f;
          p.y = g;
          b.Jb(p, p);
          if (p.x < h) {
            h = p.x;
          }
          if (p.x > n) {
            n = p.x;
          }
          if (p.y < m) {
            m = p.y;
          }
          if (p.y > q) {
            q = p.y;
          }
          p.x = d;
          p.y = g;
          b.Jb(p, p);
        } else {
          a = a.Fa;
          b = b.Fa;
          p.x = d;
          p.y = e;
          a.Jb(p, p);
          b.gg(p, p);
          if (p.x < h) {
            h = p.x;
          }
          if (p.x > n) {
            n = p.x;
          }
          if (p.y < m) {
            m = p.y;
          }
          if (p.y > q) {
            q = p.y;
          }
          p.x = f;
          p.y = e;
          a.Jb(p, p);
          b.gg(p, p);
          if (p.x < h) {
            h = p.x;
          }
          if (p.x > n) {
            n = p.x;
          }
          if (p.y < m) {
            m = p.y;
          }
          if (p.y > q) {
            q = p.y;
          }
          p.x = f;
          p.y = g;
          a.Jb(p, p);
          b.gg(p, p);
          if (p.x < h) {
            h = p.x;
          }
          if (p.x > n) {
            n = p.x;
          }
          if (p.y < m) {
            m = p.y;
          }
          if (p.y > q) {
            q = p.y;
          }
          p.x = d;
          p.y = g;
          a.Jb(p, p);
          b.gg(p, p);
        }
        if (p.x < h) {
          h = p.x;
        }
        if (p.x > n) {
          n = p.x;
        }
        if (p.y < m) {
          m = p.y;
        }
        if (p.y > q) {
          q = p.y;
        }
      }
      return new Bounds(h, m, n, q);
    }
  }
  NodeTreeUtil.i = true;

  class DelayedCallback extends Node {
    constructor(a, b) {
      super();
      this.f = a;
      this.t = b;
    }
    update(a) {
      this.t -= a;
      if (!(this.t > 0)) {
        this.f();
        this.f = null;
        this.dispose();
      }
    }
  }
  DelayedCallback.i = true;
  DelayedCallback.s = Node;
  Object.assign(DelayedCallback.prototype, {
    l: DelayedCallback
  });
