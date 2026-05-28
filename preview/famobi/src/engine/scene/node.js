  class Node {
    constructor() {
      this.app = Application.instance;
      this.listener = null;
      this.ticked = false;
      this.parent = this.firstChild = this.nextSibling = null;
      this.pausedUpdate = this.hiddenRender = false;
      this.name = null;
      this.time = 0;
      Node.all.pushBack(this);
    }
    dispose() {
      if (this.app != null) {
        for (var a = this.firstChild; a != null;) {
          var b = a.nextSibling;
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
        this.app = this.listener = null;
        Node.all.swapPop(Node.all.indexOf(this));
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
    addChild(a) {
      return this.appendChild(a);
    }
    add(a) {
      return this.appendChild(Construct.create(a));
    }
    update(a) {
      if (this.app != null) {
        this.ticked = true;
        for (var b = this.firstChild, c; b != null;) {
          c = b.nextSibling;
          if (!b.pausedUpdate && b.app != null) {
            b.update(a);
            b.lateUpdate(a);
            b.time += a;
          }
          b = c;
        }
        this.time += a;
      }
    }
    lateUpdate() {}
    render(a) {
      if (this.app != null && this.ticked != 0) {
        for (var b = this.firstChild, c; b != null;) {
          c = b.nextSibling;
          if (!b.hiddenRender && b.app != null) {
            b.render(a);
          }
          b = c;
        }
      }
    }
    onAttach() {}
    progress(a) {
      return Math.min(1, this.time / a);
    }
    // findNode - locate a parent (walking up) or descendant (BFS,
    // excluding `b`) that is an instance of class `a`.
    findNode(a, b) {
      for (var c = this.parent; c != null;) {
        if (StdString.isType(c, a)) {
          return c;
        }
        c = c.parent;
      }
      c = 1;
      let d = [this];
      while (c > 0) {
        let e = d[--c];
        let f = e.firstChild;
        while (f != null) {
          d[c++] = f;
          f = f.nextSibling;
        }
        if (e != b && StdString.isType(e, a)) {
          return e;
        }
      }
      return null;
    }
    appendChild(a) {
      a.parent = this;
      var b = this.firstChild;
      if (b != null) {
        while (b.nextSibling != null) {
          b = b.nextSibling;
        }
        b.nextSibling = a;
      } else {
        this.firstChild = a;
      }
      a.onAttach();
      return a;
    }
    static removeChild(a) {
      if (a == null || a.parent == null) {
        return false;
      }
      var b = a.parent;
      if (a == b.firstChild) {
        b.firstChild = a.nextSibling;
      } else {
        for (b = b.firstChild; b != null;) {
          if (b.nextSibling == a) {
            b.nextSibling = a.nextSibling;
            break;
          }
          b = b.nextSibling;
        }
      }
      a.parent = a.nextSibling = null;
      return true;
    }
  }
  Node.i = true;
  Object.assign(Node.prototype, {
    l: Node
  });
  class NodeTreeUtil {
    static contains(a, b) {
      for (a = a.parent; a != null;) {
        if (a == b) {
          return true;
        }
        a = a.parent;
      }
      return false;
    }
    static updateWorldTransforms(a) {
      let b = NodeTreeUtil.scratchStack;
      b.clear();
      for (b.reserve(SceneNode.count); a != null;) {
        b.array[b.count++] = a;
        a = a.parent;
      }
      a = b.array[--b.count];
      for (a.worldT.set(a.localT); b.count > 0;) {
        let c = b.array[--b.count];
        if ((c.flags & 64) <= 0) {
          if ((c.flags & 512) > 0) {
            c.worldT.composeMirror(a.worldT, c.localT);
          } else {
            c.worldT.compose(a.worldT, c.localT);
          }
        }
        a = c;
      }
    }
    static collectVisuals(a, b) {
      let c = NodeTreeUtil.renderStack;
      c.reserve(SceneNode.count);
      var d = NodeTreeUtil.scratchStack;
      d.reserve(SceneNode.count);
      d.clear();
      for (d.array[d.count++] = a; d.count > 0;) {
        a = d.array[--d.count];
        if (a.visibility != 1) {
          if ((a.flags & 2) > 0) {
            if (a.effect != null) {
              c.array[c.count++] = a;
            }
          } else if ((a.flags & 1) > 0) {
            for (a = a.children; a != null;) {
              d.array[d.count++] = a;
              a = a.nextSibling;
            }
          }
        }
      }
      b.clear();
      b.reserve(c.count);
      d = 0;
      for (a = c.count; d < a;) {
        ++d;
        let e = c.array[--c.count];
        b.array[b.count++] = e;
      }
    }
    static computeBounds(a, b, c) {
      let d = FLOAT_MAX;
      let e = FLOAT_MAX;
      let f = FLOAT_MIN;
      let g = FLOAT_MIN;
      let h = NodeTreeUtil.scratchStack;
      h.reserve(SceneNode.count);
      h.clear();
      for (h.array[h.count++] = a; h.count > 0;) {
        a = h.array[--h.count];
        if ((a.flags & 2) > 0) {
          a.computeWorldBounds(b, c);
          if (c.left < d) {
            d = c.left;
          }
          if (c.top < e) {
            e = c.top;
          }
          if (c.right > f) {
            f = c.right;
          }
          if (c.bottom > g) {
            g = c.bottom;
          }
        } else if ((a.flags & 1) > 0) {
          for (a = a.children; a != null;) {
            h.array[h.count++] = a;
            a = a.nextSibling;
          }
        }
      }
      c.left = d;
      c.top = e;
      c.right = f;
      c.bottom = g;
      return c;
    }
    static transformBounds(a, b, c) {
      let d = c.left;
      let e = c.top;
      let f = c.right;
      let g = c.bottom;
      let h = FLOAT_MAX;
      let m = FLOAT_MAX;
      let n = FLOAT_MIN;
      let q = FLOAT_MIN;
      let p = new Vec4(0, 0, 0, 1);
      if (b == a) {
        h = c.left;
        m = c.top;
        n = c.right;
        q = c.bottom;
      } else {
        if (b == a.parent) {
          b = a.localT;
          p.x = d;
          p.y = e;
          b.transformPoint2D(p, p);
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
          b.transformPoint2D(p, p);
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
          b.transformPoint2D(p, p);
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
          b.transformPoint2D(p, p);
        } else if (b.parent == null) {
          b = a.worldT;
          p.x = d;
          p.y = e;
          b.transformPoint2D(p, p);
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
          b.transformPoint2D(p, p);
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
          b.transformPoint2D(p, p);
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
          b.transformPoint2D(p, p);
        } else {
          a = a.worldT;
          b = b.worldT;
          p.x = d;
          p.y = e;
          a.transformPoint2D(p, p);
          b.inverseTransformPoint2D(p, p);
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
          a.transformPoint2D(p, p);
          b.inverseTransformPoint2D(p, p);
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
          a.transformPoint2D(p, p);
          b.inverseTransformPoint2D(p, p);
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
          a.transformPoint2D(p, p);
          b.inverseTransformPoint2D(p, p);
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
      this.cb = a;
      this.timer = b;
    }
    update(a) {
      this.timer -= a;
      if (!(this.timer > 0)) {
        this.cb();
        this.cb = null;
        this.dispose();
      }
    }
  }
  DelayedCallback.i = true;
  DelayedCallback.s = Node;
  Object.assign(DelayedCallback.prototype, {
    l: DelayedCallback
  });
