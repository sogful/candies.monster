  class C5 {}
  C5.i = true;
  C5.Je = true;
  class C180 {}
  C180.i = true;
  C180.Je = true;
  class MotionBase {
    constructor() {
      this.controllers = null;
      this.animsEnabled = true;
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
    attachAnim(a) {
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
    findAnimController() {
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
      if (this.controllers == null || !this.animsEnabled) {
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
      this.flags = b | 32 | SceneNode.DEFAULT_FLAGS;
      this.nextSibling = this.parent = this.name = null;
      this.localT = new SceneTransform();
      this.worldT = new SceneTransform();
      this.visibility = 0;
      this.bounds = this.makeLocalBounds(a);
      this.key = UidGen.next();
      this.firstState = this.owner = null;
      SceneNode.count++;
    }
    free() {
      if (!((this.flags & 16) > 0)) {
        super.free();
        if (this.parent != null) {
          this.parent.removeChild(this);
        }
        this.bounds = this.worldT = this.localT = null;
        for (var a = this.firstState; a != null;) {
          a.state.owner = null;
          a = a.next;
        }
        this.releaseAllStates();
        this.flags = 16;
        SceneNode.count--;
      }
    }
    root() {
      let a = this;
      while (a.parent != null) {
        a = a.parent;
      }
      return a;
    }
    // updateTransforms - refresh this node's local-to-world Fa matrix
    // from its parent's, then trigger any post-transform hooks (pe)
    // and bubble up to ancestors (iD) so they see the new world.
    updateTransforms(a, b) {
      if (b == null) {
        b = true;
      }
      if (a == null) {
        a = true;
      }
      this.recomputeWorld(b);
      if (b) {
        this.updateBounds();
        if (a) {
          this.markAncestorsDirty();
        }
      }
    }
    recomputeWorld() {
      if (!((this.flags & 64) > 0)) {
        if ((this.flags & 512) > 0) {
          if (this.parent != null) {
            this.worldT.composeMirror(this.parent.worldT, this.localT);
          } else {
            this.worldT.copyFrom2D(this.localT);
          }
        } else if (this.parent != null) {
          this.worldT.compose(this.parent.worldT, this.localT);
        } else {
          this.worldT.set(this.localT);
        }
      }
    }
    updateBounds() {}
    markAncestorsDirty() {
      if (this.parent != null) {
        this.parent.updateBounds();
        this.parent.markAncestorsDirty();
      }
    }
    // collectRenderStates - push every render-state child of this
    // node into the right type bucket of `a` (or freshly collect one
    // via RenderStateCollector if `a` was omitted). Pops them back
    // off when descending out of scope.
    collectRenderStates(a) {
      var b = a == null;
      if (b) {
        a = RenderStateCollector.bR(this);
      } else {
        let c = this.firstState;
        while (c != null) {
          let d = a[c.state.type];
          let e = c.state;
          if (d.count == d.capacity) {
            d.grow();
          }
          d.array[d.count++] = e;
          c = c.next;
        }
      }
      this.collapseStateBuckets(a);
      if (b) {
        RenderStateCollector.kM();
      } else {
        for (b = this.firstState; b != null;) {
          --a[b.state.type].count;
          b = b.next;
        }
      }
      this.flags &= -33;
    }
    getRenderState(a) {
      let b = this.firstState;
      while (b != null) {
        if (b.state.type == a) {
          return b.state;
        }
        b = b.next;
      }
      return null;
    }
    setRenderState(a) {
      a.owner = this;
      this.flags |= 32;
      if (this.firstState == null) {
        this.firstState = new StateNode(a);
      } else {
        for (var b = this.firstState; b != null;) {
          if (b.state.type == a.type) {
            b.state = a;
            return;
          }
          b = b.next;
        }
        b = new StateNode(a);
        b.next = this.firstState;
        this.firstState = b;
      }
    }
    removeRenderState(a) {
      let b = this.firstState;
      let c = null;
      while (b != null) {
        if (b.state.type == a) {
          if (c != null) {
            c.next = b.next;
          } else {
            this.firstState = b.next;
          }
          b.next = null;
          this.flags |= 32;
          break;
        }
        c = b;
        b = b.next;
      }
    }
    releaseAllStates() {
      let a = this.firstState;
      let b;
      if (a != null) {
        this.flags |= 32;
      }
      while (a != null) {
        b = a.next;
        a.next = null;
        a = b;
      }
      this.firstState = null;
    }
    pushStatesTo(a) {
      let b = this.firstState;
      while (b != null) {
        let c = a[b.state.type];
        let d = b.state;
        if (c.count == c.capacity) {
          c.grow();
        }
        c.array[c.count++] = d;
        b = b.next;
      }
    }
    makeLocalBounds(a) {
      if (a == null) {
        a = SceneNode.RECT_TYPE;
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
      this.localBounds = this.makeLocalBounds(b);
      this.stateSlots = Array(7);
      if (a != null) {
        a.appendChild(this);
      }
      this.stateMaskBits = 0;
      this.effect = this.onFrameChanged = null;
      SceneGroup.count++;
    }
    free() {
      if (!((this.flags & 16) > 0)) {
        if (this.effect != null) {
          this.effect.free();
        }
        this.effect = null;
        this.localBounds.free();
        this.stateSlots = this.localBounds = null;
        super.free();
        SceneGroup.count--;
      }
    }
    setEffect(a) {
      this.effect = a;
      this.effect.attachToVisual(this);
    }
    rebuildGeometry() {}
    hitTest(a, b) {
      if (!this.bounds.contains(a)) {
        return false;
      }
      if (b != null) {
        b.add(this);
      }
      return true;
    }
    computeWorldBounds(a, b) {
      return b;
    }
    updateBounds() {
      if (!((this.flags & 128) > 0)) {
        this.localBounds.transformInto(this.worldT, this.bounds);
        super.updateBounds();
      }
    }
    collapseStateBuckets(a) {
      let b = 0;
      let c = this.stateSlots;
      let d = 0;
      let e = 0;
      while (e < a.length) {
        var f = a[e];
        ++e;
        if (f.count == 0) {
          c[d] = null;
        } else {
          f = f.array[f.count - 1].collapse(f);
          c[d] = f;
          b |= 1 << f.type;
        }
        ++d;
      }
      this.stateMaskBits = b;
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
      this.buildMesh();
      this.rebuildGeometry();
    }
    buildMesh() {
      this.vertexCount = (this.cols + 1) * (this.rows + 1);
      this.vertices = new ArrayList(this.vertexCount);
      for (var a = 0, b = this.vertexCount; a < b;) {
        ++a;
        this.vertices.pushBack(new Vec4(0, 0, 0, 1));
      }
      a = this.cols + 1;
      b = this.rows + 1;
      let c = 0;
      let d;
      while (c < b) {
        for (d = 0; d < a;) {
          var e = this.vertices.array[c * a + d];
          e.x = this.min.x + d / (a - 1) * this.max.x;
          e.y = this.min.y + c / (b - 1) * this.max.y;
          ++d;
        }
        ++c;
      }
      this.indexCount = (this.cols * 2 + 2) * this.rows + (this.rows - 1) * 2;
      this.indices = new Uint8Array(this.indexCount);
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
    rebuildGeometry() {
      super.rebuildGeometry();
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
      this.vertexBuffer = b;
      this.rebuildGeometry();
      this.indexBuffer = this.vao = null;
    }
    free() {
      this.vertexBuffer = null;
      var a = this.vao;
      if (a != null) {
        a.free();
      }
      a = this.indexBuffer;
      if (a != null) {
        a.free();
      }
      this.indexBuffer = this.vao = null;
      super.free();
    }
    makeLocalBounds() {
      return new CircleBounds();
    }
    hitTest() {
      return false;
    }
    rebuildGeometry() {
      let a = this.vertexBuffer.getData(0);
      this.localBounds.fromVertices(a);
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
        a.appendChild(this);
      }
      SceneRoot.count++;
    }
    free() {
      if (!((this.flags & 16) > 0)) {
        for (var a = this.children; a != null;) {
          let b = a.nextSibling;
          if (a.owner != null) {
            a.owner.free();
          } else {
            a.free();
          }
          a = b;
        }
        super.free();
        SceneRoot.count--;
      }
    }
    computeWorldBounds(a, b) {
      return NodeTreeUtil.computeBounds(this, a, b);
    }
    hitTest(a, b) {
      let c = false;
      if (this.bounds.contains(a)) {
        let d = this.children;
        while (d != null) {
          if (d.hitTest(a, b)) {
            c = true;
          }
          d = d.nextSibling;
        }
      }
      return c;
    }
    tickAnims(a) {
      let b = super.tickAnims(a);
      let c = this.children;
      let d;
      while (c != null) {
        d = c.nextSibling;
        if (c.tickAnims(a)) {
          b = true;
        }
        c = d;
      }
      return b;
    }
    appendChild(a) {
      if (this.children == null) {
        this.children = a;
        a.nextSibling = null;
      } else {
        let b = this.children;
        while (b.nextSibling != null) {
          b = b.nextSibling;
        }
        b.nextSibling = a;
      }
      a.parent = this;
    }
    childCount() {
      let a = 0;
      let b = this.children;
      while (b != null) {
        ++a;
        b = b.nextSibling;
      }
      return a;
    }
    insertChild(a, b) {
      if (b == 0) {
        a.nextSibling = this.children;
        this.children = a;
      } else {
        let c = this.children;
        let d = 0;
        for (--b; d < b;) {
          ++d;
          c = c.nextSibling;
        }
        a.nextSibling = c.nextSibling;
        c.nextSibling = a;
      }
      a.parent = this;
    }
    removeChild(a) {
      if (this.children == a) {
        this.children = a.nextSibling;
      } else {
        let b = this.children;
        while (b.nextSibling != a) {
          b = b.nextSibling;
        }
        b.nextSibling = a.nextSibling;
      }
      a.nextSibling = null;
      a.parent = null;
      return this;
    }
    childAt(a) {
      let b = this.children;
      let c = 0;
      while (c <= a) {
        if (c == a) {
          return b;
        }
        b = b.nextSibling;
        ++c;
      }
      return null;
    }
    moveChildTo(a, b) {
      this.removeChild(a);
      this.insertChild(a, b);
    }
    childByName(a) {
      let b = this.children;
      while (b != null) {
        if (b.name == a) {
          return b;
        }
        b = b.nextSibling;
      }
      return null;
    }
    swapSiblings(a, b) {
      let c = null;
      let d = null;
      for (var e = 0, f = this.children; e < 2 && f != null;) {
        if (f.nextSibling == a) {
          c = f;
          ++e;
        } else if (f.nextSibling == b) {
          d = f;
          ++e;
        }
        f = f.nextSibling;
      }
      e = a.nextSibling;
      f = b.nextSibling;
      a.nextSibling = null;
      b.nextSibling = null;
      if (e == b) {
        if (c != null) {
          c.nextSibling = b;
        } else {
          this.children = b;
        }
        b.nextSibling = a;
        a.nextSibling = f;
      } else if (f == a) {
        if (d != null) {
          d.nextSibling = a;
        } else {
          this.children = a;
        }
        a.nextSibling = b;
        b.nextSibling = e;
      } else {
        if (c != null) {
          c.nextSibling = b;
        } else {
          this.children = b;
        }
        b.nextSibling = e;
        if (d != null) {
          d.nextSibling = a;
        } else {
          this.children = a;
        }
        a.nextSibling = f;
      }
    }
    swapSiblingsAt(a, b) {
      this.swapSiblings(this.childAt(a), this.childAt(b));
    }
    moveToFront(a) {
      if (this.children != a) {
        for (var b = this.children; b.nextSibling != a;) {
          b = b.nextSibling;
        }
        b.nextSibling = a.nextSibling;
        a.nextSibling = this.children;
        this.children = a;
      }
    }
    moveToBack(a) {
      if (a.nextSibling != null) {
        var b = this.children;
        if (b == a) {
          while (b.nextSibling != null) {
            b = b.nextSibling;
          }
          b.nextSibling = a;
          this.children = a.nextSibling;
        } else {
          while (b.nextSibling != a) {
            b = b.nextSibling;
          }
          for (b = b.nextSibling = a.nextSibling; b.nextSibling != null;) {
            b = b.nextSibling;
          }
          b.nextSibling = a;
        }
        a.nextSibling = null;
      }
    }
    recomputeWorld(a) {
      super.recomputeWorld(a);
      let b = this.children;
      while (b != null) {
        b.updateTransforms(false, a);
        b = b.nextSibling;
      }
    }
    updateBounds() {
      if (!((this.flags & 128) > 0) && this.children != null) {
        var a = this.children;
        this.bounds.from(a.bounds);
        for (a = a.nextSibling; a != null;) {
          this.bounds.union(a.bounds);
          a = a.nextSibling;
        }
        super.updateBounds();
      }
    }
    collapseStateBuckets(a) {
      let b = this.children;
      while (b != null) {
        b.collectRenderStates(a);
        b = b.nextSibling;
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
      this.rebuildGeometry();
    }
    setSize(a, b) {
      let c = this.size;
      c.x = a;
      c.y = b;
      this.rebuildGeometry();
    }
    hitTest(a, b) {
      if (!this.bounds.contains(a)) {
        return false;
      }
      a = this.worldT.inverseTransformPoint2D(a, new Vec4(0, 0, 0, 1));
      if (PointInRect.test(a.x, a.y, this.size.x, this.size.y)) {
        if (b != null) {
          b.add(this);
        }
        return true;
      } else {
        return false;
      }
    }
    computeWorldBounds(a, b) {
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
          var n = this.localT;
          c.x = 0;
          c.y = 0;
          n.transformPoint2D(c, c);
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
          n.transformPoint2D(c, c);
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
          n.transformPoint2D(c, c);
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
          n.transformPoint2D(c, c);
        } else if (a.parent == null) {
          n = this.worldT;
          c.x = 0;
          c.y = 0;
          n.transformPoint2D(c, c);
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
          n.transformPoint2D(c, c);
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
          n.transformPoint2D(c, c);
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
          n.transformPoint2D(c, c);
        } else {
          n = this.worldT;
          a = a.worldT;
          c.x = 0;
          c.y = 0;
          n.transformPoint2D(c, c);
          a.inverseTransformPoint2D(c, c);
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
          n.transformPoint2D(c, c);
          a.inverseTransformPoint2D(c, c);
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
          n.transformPoint2D(c, c);
          a.inverseTransformPoint2D(c, c);
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
          n.transformPoint2D(c, c);
          a.inverseTransformPoint2D(c, c);
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
        b.left = d;
        b.top = e;
        b.right = f;
        b.bottom = g;
      }
      return b;
    }
    rebuildGeometry() {
      super.rebuildGeometry();
      var a = this.size.x / 2;
      let b = this.size.y / 2;
      this.localBounds.center.x = a;
      this.localBounds.center.y = b;
      this.localBounds.radius = Math.sqrt(a * a + b * b);
      if (this.localBounds.type == 302) {
        a = this.localBounds.bounds;
        a.left = 0;
        a.top = 0;
        a.right = this.size.x;
        a.bottom = this.size.y;
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
      this.node = a;
      a.owner = this;
      this.typeIdValue = this.typeId();
      this.flags = 6;
      this.scaleYSafe = this.scaleY = this.scaleXSafe = this.scaleX = 1;
      this.originXBase = this.originYBase = this.originY = this.originX = this.pivotY = this.pivotX = this.rotationRad = this.rotation = 0;
      this.alpha = 1;
      this.visible = true;
    }
    free() {
      this.node = null;
      DisplayBase.count--;
    }
    remove() {
      let a = this.node.parent;
      if (a != null) {
        a.removeChild(this.node);
      }
    }
    parentContainer() {
      var a = this.node.parent;
      if (a != null && (a = a.owner, a != null && a.typeIdValue == 204)) {
        return a;
      } else {
        return null;
      }
    }
    setName(a) {
      this.node.name = a;
    }
    setAlpha(a) {
      a = a < 0 ? 0 : a > 1 ? 1 : a;
      if (this.alpha != a) {
        this.alpha = a;
        let b = this.node;
        if (a < 1) {
          let c = b.getRenderState(5);
          if (c == null) {
            b.setRenderState(new AlphaState(this.alpha));
          } else {
            c.setAlpha(a);
          }
        } else {
          b.removeRenderState(5);
        }
        b.flags |= 32;
      }
    }
    isVisible() {
      return this.visible;
    }
    setVisible(a) {
      if (this.visible != a) {
        this.visible = a;
        this.node.visibility = a ? 0 : 1;
      }
    }
    setScaleX(a) {
      if (this.scaleX != a) {
        this.scaleXSafe = this.scaleX = a;
        if (absLessThan(a, 0.001)) {
          this.scaleXSafe = (a >= 0 ? 1 : -1) * 0.001;
        }
        if (a == 1 && this.scaleY == 1) {
          this.flags = this.flags & -3 | 4;
          a = this.node.localT;
          a.scale.x = 1;
          a.scale.y = 1;
          a.flags |= 500;
        } else {
          this.flags &= -7;
        }
        this.invalidateLayout();
      }
    }
    setScaleY(a) {
      if (this.scaleY != a) {
        this.scaleYSafe = this.scaleY = a;
        if (absLessThan(a, 0.001)) {
          this.scaleYSafe = (a >= 0 ? 1 : -1) * 0.001;
        }
        if (a == 1 && this.scaleX == 1) {
          this.flags = this.flags & -3 | 4;
          a = this.node.localT;
          a.scale.x = 1;
          a.scale.y = 1;
          a.flags |= 500;
        } else {
          this.flags &= -7;
        }
        this.invalidateLayout();
      }
    }
    setUniformScale(a) {
      if (this.scaleX != a || this.scaleY != a) {
        this.scaleX = this.scaleY = a;
        if (absLessThan(a, 0.001)) {
          this.scaleXSafe = this.scaleYSafe = (a >= 0 ? 1 : -1) * 0.001;
        } else {
          this.scaleXSafe = this.scaleYSafe = a;
        }
        this.flags |= 2;
        if (a == 1) {
          a = this.node.localT;
          a.scale.x = 1;
          a.scale.y = 1;
          a.flags |= 500;
          this.flags |= 4;
        } else {
          this.flags &= -5;
        }
        this.invalidateLayout();
      }
    }
    setScale(a, b) {
      if (this.scaleX != a || this.scaleY != b) {
        if (a == 1 && b == 1) {
          this.flags = this.flags & -3 | 4;
          let c = this.node.localT;
          c.scale.x = 1;
          c.scale.y = 1;
          c.flags |= 500;
        } else {
          this.flags = a == b ? (this.flags &= -5) | 2 : this.flags & -7;
        }
        this.scaleX = this.scaleXSafe = a;
        this.scaleY = this.scaleYSafe = b;
        if (absLessThan(a, 0.001)) {
          this.scaleXSafe = (a >= 0 ? 1 : -1) * 0.001;
        }
        if (absLessThan(b, 0.001)) {
          this.scaleYSafe = (b >= 0 ? 1 : -1) * 0.001;
        }
        this.invalidateLayout();
      }
    }
    setRotation(a) {
      if (this.rotation != a) {
        this.rotation = a;
        let b;
        b = a % 360;
        if (b < 0) {
          b += 360;
        }
        this.rotationRad = b * DEG2RAD;
        if (a == 0) {
          this.flags &= -2;
          this.node.localT.resetRotation();
        } else {
          this.flags |= 1;
        }
        this.invalidateLayout();
      }
    }
    getX() {
      return this.pivotX;
    }
    setX(a) {
      if (this.pivotX != a) {
        this.pivotX = a;
        this.invalidateLayout();
      }
      return a;
    }
    getY() {
      return this.pivotY;
    }
    setY(a) {
      if (this.pivotY != a) {
        this.pivotY = a;
        this.invalidateLayout();
      }
    }
    setOriginXY(a) {
      if (this.pivotX != a.x || this.pivotY != a.y) {
        this.pivotX = a.x;
        this.pivotY = a.y;
        this.invalidateLayout();
      }
    }
    setTransform(a, b, c, d) {
      let e = false;
      if (this.pivotX != a || this.pivotY != b) {
        this.pivotX = a;
        this.pivotY = b;
        e = true;
      }
      if (this.rotation != 0) {
        a = this.rotation = 0;
        if (a < 0) {
          a += 360;
        }
        this.rotationRad = a * DEG2RAD;
        this.flags &= -2;
        this.node.localT.resetRotation();
        e = true;
      }
      if (this.scaleX != c || this.scaleY != d) {
        this.scaleXSafe = c;
        if (absLessThan(c, 0.001)) {
          this.scaleXSafe = (c >= 0 ? 1 : -1) * 0.001;
        }
        this.scaleYSafe = d;
        if (absLessThan(d, 0.001)) {
          this.scaleYSafe = (d >= 0 ? 1 : -1) * 0.001;
        }
        if (c == d) {
          if (c == 1) {
            this.flags = this.flags & -3 | 4;
            c = this.node.localT;
            c.scale.x = 1;
            c.scale.y = 1;
            c.flags |= 500;
          } else {
            this.flags = this.flags & -5 | 2;
          }
        } else {
          this.flags &= -7;
        }
        e = true;
      }
      if (e) {
        this.invalidateLayout();
      }
    }
    setOriginVec(a) {
      let b = a.x;
      a = a.y;
      if (b == null) {
        b = this.originX;
      }
      if (a == null) {
        a = this.originY;
      }
      if (this.originX != b || this.originY != a) {
        this.originX = b;
        this.originY = a;
        this.invalidateLayout();
      }
    }
    setPivot(a, b) {
      if (a == null) {
        a = this.originX;
      }
      if (b == null) {
        b = this.originY;
      }
      if (this.originX != a || this.originY != b) {
        this.originX = a;
        this.originY = b;
        this.invalidateLayout();
      }
    }
    setOrigin(a, b) {
      if (a == null) {
        a = this.originYBase;
      }
      if (b == null) {
        b = this.originXBase;
      }
      if (this.originYBase != a || this.originXBase != b) {
        this.originYBase = a;
        this.originXBase = b;
        this.invalidateLayout();
      }
    }
    center() {
      this.centerPivot();
      this.centerOrigin();
    }
    update(a) {
      this.node.tickAnims(a);
      this.node.updateTransforms();
      this.node.collectRenderStates();
    }
    localToWorld(a) {
      NodeTreeUtil.updateWorldTransforms(this.node);
      return this.node.worldT.transformPoint2D(a, new Vec4(0, 0, 0, 1));
    }
    worldToLocal(a) {
      NodeTreeUtil.updateWorldTransforms(this.node);
      return this.node.worldT.inverseTransformPoint2D(a, new Vec4(0, 0, 0, 1));
    }
    tween() {
      return new SpriteTween(this);
    }
    setBlendMode(a) {
      if (a == null) {
        this.node.removeRenderState(0);
      } else {
        this.node.setRenderState(new BlendModeState(a, false));
      }
    }
    setColorTransform(a) {
      var b = this.node.getRenderState(2);
      if (a != null) {
        if (b == null) {
          b = new ColorTransformState();
          this.node.setRenderState(b);
        }
        b = b.transform;
        var c = b.mul;
        var d = a.mul;
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
        this.node.removeRenderState(2);
      }
    }
    setClipBounds(a) {
      let b = this.node.getRenderState(1);
      if (a != null) {
        if (b == null) {
          b = new ClipState();
          this.node.setRenderState(b);
        }
        b.fromBounds(a);
      } else if (b != null) {
        this.node.removeRenderState(1);
      }
    }
    invalidateLayout() {
      let a = this.node.localT;
      let b = this.pivotX;
      let c = this.pivotY;
      let d = this.originX;
      let e = this.originY;
      let f = this.originYBase;
      let g = this.originXBase;
      let h = this.scaleXSafe;
      var m = this.scaleYSafe;
      var n = this.flags;
      if ((n & 1) > 0) {
        let p = Math.sin(this.rotationRad);
        let v = Math.cos(this.rotationRad);
        var q = a.matrix;
        q.m11 = v;
        q.m12 = -p;
        q.m21 = p;
        q.m22 = v;
        a.flags = a.flags & -4 | 504;
        if ((n & 4) > 0) {
          a.translate.x = -(f * v) + g * p + f + b - d;
          a.translate.y = -(f * p) - g * v + g + c - e;
        } else if ((n & 2) > 0) {
          m = h * f;
          n = h * g;
          a.scale.x = a.scale.y = h;
          a.flags = a.flags & -2 | 500;
          a.translate.x = -(m * v) + n * p + f + b - d;
          a.translate.y = -(m * p) - n * v + g + c - e;
        } else {
          n = h * f;
          q = m * g;
          a.scale.x = h;
          a.scale.y = m;
          a.flags = a.flags & -6 | 496;
          a.translate.x = -(n * v) + q * p + f + b - d;
          a.translate.y = -(n * p) - q * v + g + c - e;
        }
      } else if ((n & 4) > 0) {
        a.translate.x = b - d;
        a.translate.y = c - e;
      } else if ((n & 2) > 0) {
        a.scale.x = a.scale.y = h;
        a.flags = a.flags & -2 | 500;
        a.translate.x = -(h * f) + f + b - d;
        a.translate.y = -(h * g) + g + c - e;
      } else {
        a.scale.x = h;
        a.scale.y = m;
        a.flags = a.flags & -6 | 496;
        a.translate.x = -(h * f) + f + b - d;
        a.translate.y = -(m * g) + g + c - e;
      }
      a.flags = a.flags & -2 | 496;
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
      this.channelCount = 0;
      this.channels = Array(6);
      let a = 0;
      while (a < 6) {
        this.channels[a++] = [];
      }
    }
    getData(a) {
      return this.channels[a];
    }
  }
  MeshBuffer.i = true;
  Object.assign(MeshBuffer.prototype, {
    l: MeshBuffer
  });

  class ShapeBounds {
    constructor() {
      this.type = this.typeId();
      this.center = new Vec4(0, 0, 0, 1);
      this.radius = 0;
    }
    free() {
      this.center = null;
    }
    fromVertices() {}
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
      this.bounds = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
    }
    free() {
      this.bounds = null;
      super.free();
    }
    fromVertices(a) {
      var b = this.bounds;
      b.left = b.top = vInfinity;
      b.right = b.bottom = vNegInfinity;
      b = a.length >> 1;
      let c = 0;
      while (c < b) {
        let d = c++;
        this.bounds.expand(new Vec4(a[d << 1], a[(d << 1) + 1], 0, 1));
      }
    }
    contains(a) {
      let b = this.bounds;
      let c = a.x;
      a = a.y;
      if (c >= b.left && c <= b.right && a >= b.top) {
        return a <= b.bottom;
      } else {
        return false;
      }
    }
    union(a) {
      switch (a.type) {
        case 202:
          var b = a.center;
          a = a.radius;
          this.bounds.expand(new Vec4(b.x - a, b.y - a, 0, 1));
          this.bounds.expand(new Vec4(b.x + a, b.y + a, 0, 1));
          break;
        case 302:
          this.bounds.add(a.bounds);
      }
      b = this.bounds;
      b = (b.right - b.left) / 2;
      a = this.bounds;
      a = (a.bottom - a.top) / 2;
      this.center.x = this.bounds.left + b;
      this.center.y = this.bounds.top + a;
      this.radius = Math.sqrt(b * b + a * a);
    }
    from(a) {
      let b = a.center;
      let c = a.radius;
      switch (a.type) {
        case 202:
          this.bounds.left = b.x - c;
          this.bounds.top = b.y - c;
          this.bounds.right = b.x + c;
          this.bounds.bottom = b.y + c;
          break;
        case 302:
          var d = this.bounds;
          a = a.bounds;
          d.left = a.left;
          d.top = a.top;
          d.right = a.right;
          d.bottom = a.bottom;
      }
      d = this.center;
      d.x = b.x;
      d.y = b.y;
      d.z = b.z;
      this.radius = c;
    }
    transformInto(a, b) {
      var c = this.center;
      var d = b.center;
      if ((a.flags & 64) > 0) {
        a.update2DComposite();
      }
      var e = a.compositeM;
      var f = e.m21 * c.x + e.m22 * c.y + e.m24;
      d.x = e.m11 * c.x + e.m12 * c.y + e.m14;
      d.y = f;
      b.radius = ((a.flags & 8) > 0 ? Math.max(Math.abs(a.scale.x), Math.abs(a.scale.y)) : Math.max(Math.abs(a.matrix.m11) + Math.abs(a.matrix.m12), Math.abs(a.matrix.m21) + Math.abs(a.matrix.m22))) * this.radius;
      b = b.bounds;
      c = this.bounds;
      d = c.right - c.left;
      c = this.bounds;
      c = c.bottom - c.top;
      f = e = BoxBounds.SCRATCH;
      var g = this.bounds;
      var h = this.bounds;
      f.x = (g.left + g.right) / 2;
      f.y = (h.top + h.bottom) / 2;
      a.transformPoint2D(e, e);
      b.left = e.x;
      b.top = e.y;
      b.right = e.x;
      b.bottom = e.y;
      if ((a.flags & 8) > 0) {
        h = a.matrix;
        e = h.m11;
        f = h.m12;
        g = h.m21;
        h = h.m22;
        a = a.scale;
        d = d * a.x * 0.5;
        a = c * a.y * 0.5;
        if (e > 0) {
          b.left -= e * d;
          b.right += e * d;
        } else {
          b.left += e * d;
          b.right -= e * d;
        }
        if (f > 0) {
          b.left -= f * a;
          b.right += f * a;
        } else {
          b.left += f * a;
          b.right -= f * a;
        }
        if (g > 0) {
          b.top -= g * d;
          b.bottom += g * d;
        } else {
          b.top += g * d;
          b.bottom -= g * d;
        }
        if (h > 0) {
          b.top -= h * a;
          b.bottom += h * a;
        } else {
          b.top += h * a;
          b.bottom -= h * a;
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
          b.left -= d * a;
          b.right += d * a;
        } else {
          b.left += d * a;
          b.right -= d * a;
        }
        if (e > 0) {
          b.left -= e * c;
          b.right += e * c;
        } else {
          b.left += e * c;
          b.right -= e * c;
        }
        if (-e > 0) {
          b.top -= -e * a;
          b.bottom += -e * a;
        } else {
          b.top += -e * a;
          b.bottom -= -e * a;
        }
        if (d > 0) {
          b.top -= d * c;
          b.bottom += d * c;
        } else {
          b.top += d * c;
          b.bottom -= d * c;
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
    fromVertices(a) {
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
      this.radius = Math.sqrt(g);
      a = this.center;
      a.x = b;
      a.y = c;
      a.z = d;
    }
    contains(a) {
      let b = a.x - this.center.x;
      let c = a.y - this.center.y;
      a = a.z - this.center.z;
      return b * b + c * c + a * a <= this.radius * this.radius;
    }
    union(a) {
      var b = a.radius;
      if (b != 0) {
        var c = this.radius;
        if (c == 0) {
          this.radius = a.radius;
          b = this.center;
          c = a.center;
          b.x = c.x;
          b.y = c.y;
          b.z = c.z;
        } else {
          var d = this.center;
          var e = a.center;
          var f = e.x - d.x;
          var g = e.y - d.y;
          e = e.z - d.z;
          var h = f * f + g * g + e * e;
          var m = b - c;
          if (m * m >= h) {
            if (m >= 0) {
              this.radius = a.radius;
              b = this.center;
              c = a.center;
              b.x = c.x;
              b.y = c.y;
              b.z = c.z;
            }
          } else {
            a = Math.sqrt(h);
            if (a > 0) {
              m = (a + m) / (a * 2);
              h = this.center;
              h.x = d.x + f * m;
              h.y = d.y + g * m;
              h.z = d.z + e * m;
            }
            this.radius = (a + c + b) / 2;
          }
        }
      }
    }
    from(a) {
      this.center.x = a.center.x;
      this.center.y = a.center.y;
      this.radius = a.radius;
    }
    transformInto(a, b) {
      b.center = a.transformPoint3D(this.center, b.center);
      b.radius = a.maxAbsScale() * this.radius;
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
      a.setEffect(this.effect);
      b = this.effect.size;
      a.setSize(b.x, b.y);
    }
    free() {
      if (this.node != null) {
        this.node.free();
        this.texture = this.effect = null;
        super.free();
      }
    }
    setCharset(a) {
      this.effect.free();
      this.effect = new TextDrawEffect(a);
      a = this.node;
      a.setEffect(this.effect);
      let b = this.effect.size;
      a.setSize(b.x, b.y);
    }
    autoFit(a) {
      if (a == null) {
        a = true;
      }
      if (this.effect.Ze) {
        this.effect.shape();
      }
      this.effect.autoFit(a);
    }
    shape() {
      this.effect.shape();
    }
    setBoxSize(a, b) {
      this.effect.setBoxSize(a, b);
      this.node.setSize(a, b);
    }
    setText(a) {
      this.effect.setText(a);
    }
    setAlign(a, b) {
      this.effect.setAlign(a, b);
    }
    getFontSize() {
      return this.effect.getFontSize();
    }
    setFontSize(a) {
      this.effect.setFontSize(a);
    }
    lineCount() {
      return this.effect.lineCount();
    }
    markDirty() {
      this.effect.markDirty();
    }
    setLineHeightOffset(a) {
      this.effect.setLineHeightOffset(a);
    }
    setYOffsetPerLine(a) {
      this.effect.setYOffsetPerLine(a);
    }
    setMultiline(a) {
      this.effect.setMultiline(a);
    }
    boundingBox(a, b) {
      if (b == null) {
        b = true;
      }
      this.shape();
      var c = this.effect.layout.bounds;
      c = new Bounds(c.left, c.top, c.right, c.bottom);
      if (c.left >= c.right || c.top >= c.bottom || a == this) {
        return c;
      }
      if (b) {
        NodeTreeUtil.updateWorldTransforms(this.node);
        if (a != null && !NodeTreeUtil.contains(this.node, a.node)) {
          NodeTreeUtil.updateWorldTransforms(a.node);
        }
      }
      return NodeTreeUtil.transformBounds(this.node, a == null ? this.node.root() : a.node, c);
    }
    centerOrigin() {
      let a = this.boundingBox(this);
      if (a.left >= a.right || a.top >= a.bottom) {
        this.setOrigin(0, 0);
      } else {
        this.setOrigin((a.left + a.right) / 2, (a.top + a.bottom) / 2);
      }
    }
    centerPivot() {
      let a = this.boundingBox(this);
      if (a.left >= a.right || a.top >= a.bottom) {
        this.setPivot(0, 0);
      } else {
        this.setPivot((a.left + a.right) / 2, (a.top + a.bottom) / 2);
      }
    }
    getWidth() {
      let a = this.boundingBox(this.parentContainer());
      return a.right - a.left;
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
    fromVertices(a) {
      var b = this.box;
      b.left = b.top = vInfinity;
      b.right = b.bottom = vNegInfinity;
      a = a.length >> 1;
      for (b = 0; b < a;) {
        ++b;
      }
    }
    contains() {
      return false;
    }
    union() {}
    from() {}
    transformInto(a, b) {
      var c = this.center;
      var d = b.center;
      if ((a.flags & 16) > 0) {
        a.updateComposite();
      }
      var e = a.compositeM;
      let f = c.x;
      let g = c.y;
      c = c.z;
      d.x = e.m11 * f + e.m12 * g + e.m13 * c + e.m14;
      d.y = e.m21 * f + e.m22 * g + e.m23 * c + e.m24;
      d.z = e.m31 * f + e.m32 * g + e.m33 * c + e.m34;
      if ((a.flags & 8) > 0) {
        d = Math.abs(a.scale.x);
        e = Math.abs(a.scale.y);
        a = Math.abs(a.scale.z);
      } else {
        a = a.matrix;
        d = Math.abs(a.m11) + Math.abs(a.m12) + Math.abs(a.m13);
        e = Math.abs(a.m21) + Math.abs(a.m22) + Math.abs(a.m23);
        a = Math.abs(a.m31) + Math.abs(a.m32) + Math.abs(a.m33);
      }
      b.radius = Math.max(Math.max(d, e), a) * this.radius;
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
    fromVertices(a) {
      let b = a.length >> 1;
      var c = 0;
      var d = 0;
      for (var e = 0; e < b;) {
        var f = e++;
        c += a[f << 1];
        d += a[(f << 1) + 1];
      }
      c = this.center.x = c / b;
      d = this.center.y = d / b;
      for (e = this.radius = 0; e < b;) {
        var g = e++;
        f = a[g << 1] - c;
        g = a[(g << 1) + 1] - d;
        this.radius = Math.max(f * f + g * g, this.radius);
      }
      this.radius = Math.sqrt(this.radius);
    }
    contains(a) {
      let b = a.x - this.center.x;
      a = a.y - this.center.y;
      return b * b + a * a <= this.radius * this.radius;
    }
    union(a) {
      if (a.radius != 0) {
        if (this.radius == 0) {
          this.radius = a.radius;
          this.center.x = a.center.x;
          this.center.y = a.center.y;
        } else {
          var b = a.center.x - this.center.x;
          var c = a.center.y - this.center.y;
          var d = a.radius - this.radius;
          var e = b * b + c * c;
          if (d * d >= e) {
            if (d >= 0) {
              this.from(a);
            }
          } else {
            d = Math.sqrt(e);
            e = (d + a.radius - this.radius) / (d * 2);
            this.center.x += e * b;
            this.center.y += e * c;
            this.radius = (d + this.radius + a.radius) / 2;
          }
        }
      }
    }
    from(a) {
      this.center.x = a.center.x;
      this.center.y = a.center.y;
      this.radius = a.radius;
    }
    transformInto(a, b) {
      var c = this.center;
      var d = b.center;
      if ((a.flags & 64) > 0) {
        a.update2DComposite();
      }
      let e = a.compositeM;
      let f = e.m21 * c.x + e.m22 * c.y + e.m24;
      d.x = e.m11 * c.x + e.m12 * c.y + e.m14;
      d.y = f;
      if ((a.flags & 8) > 0) {
        c = Math.abs(a.scale.x);
        d = Math.abs(a.scale.y);
        a = Math.abs(a.scale.z);
      } else {
        a = a.matrix;
        c = Math.abs(a.m11) + Math.abs(a.m12) + Math.abs(a.m13);
        d = Math.abs(a.m21) + Math.abs(a.m22) + Math.abs(a.m23);
        a = Math.abs(a.m31) + Math.abs(a.m32) + Math.abs(a.m33);
      }
      b.radius = Math.max(Math.max(c, d), a) * this.radius;
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
      this.node = this.visual = new SceneGroup();
      this.node.owner = this;
      this.visual.setRenderState(new AlphaState(1));
      if (a != null) {
        this.visual.setEffect(new MeshDrawEffect(a));
      } else {
        this.visual.setEffect(new ClearEffect(b));
      }
    }
    setAlpha(a) {
      this.visual.getRenderState(5).setAlpha(a);
    }
    setVisible(a) {
      this.visual.visibility = a ? 2 : 1;
    }
    free() {
      this.visual.free();
      this.node = this.visual = null;
    }
  }
  ColorRectShape.i = true;
  ColorRectShape.Ib = [C295];
  Object.assign(ColorRectShape.prototype, {
    l: ColorRectShape
  });
