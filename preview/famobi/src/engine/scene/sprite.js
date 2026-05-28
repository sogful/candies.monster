  class Sprite extends DisplayBase {
    constructor(a, b, c) {
      super(new SpriteNode(a != null ? a.node : null));
      this.frameBounds = new Bounds(0, 0, 0, 0);
      this.frame = this.texture = null;
      this.size = new Vec4(0, 0, 0, 1);
      if (b != null) {
        this.setTexture(b, c);
      }
      DisplayBase.count++;
    }
    free() {
      if (this.node != null) {
        this.node.free();
        this.size = this.frame = this.texture = this.frameBounds = null;
        super.free();
      }
    }
    getWidth() {
      if ((this.flags & 1) == 0) {
        return this.size.x * Math.abs(this.scaleX);
      }
      var a = this.size.x * Math.abs(this.scaleX) / 2;
      let b = this.size.y * Math.abs(this.scaleY) / 2;
      let c = -Math.sin(this.rotationRad);
      let d = Math.cos(this.rotationRad);
      let e;
      if (d > 0) {
        e = -(d * a);
        a *= d;
      } else {
        e = d * a;
        a = -(d * a);
      }
      if (c > 0) {
        e -= c * b;
        a += c * b;
      } else {
        e += c * b;
        a -= c * b;
      }
      return a - e;
    }
    setWidth(a) {
      this.setScaleX(a / this.size.x);
    }
    getHeight() {
      if ((this.flags & 1) == 0) {
        return this.size.y * Math.abs(this.scaleY);
      }
      var a = this.size.x * Math.abs(this.scaleX) / 2;
      let b = this.size.y * Math.abs(this.scaleY) / 2;
      let c = Math.sin(this.rotationRad);
      let d = Math.cos(this.rotationRad);
      let e;
      if (c > 0) {
        e = -(c * a);
        a *= c;
      } else {
        e = c * a;
        a = -(c * a);
      }
      if (d > 0) {
        e -= d * b;
        a += d * b;
      } else {
        e += d * b;
        a -= d * b;
      }
      return a - e;
    }
    setHeight(a) {
      this.setScaleY(a / this.size.y);
    }
    centerPivot() {
      this.setPivot(this.size.x / 2, this.size.y / 2);
    }
    centerOrigin() {
      this.setOrigin(this.size.x / 2, this.size.y / 2);
    }
    setPivot(a, b) {
      if (a != null && a >= 0 && a <= 1) {
        a *= this.size.x;
      }
      if (b != null && b >= 0 && b <= 1) {
        b *= this.size.y;
      }
      super.setPivot(a, b);
    }
    setOrigin(a, b) {
      if (a != null && a >= 0 && a <= 1) {
        a *= this.size.x;
      }
      if (b != null && b >= 0 && b <= 1) {
        b *= this.size.y;
      }
      super.setOrigin(a, b);
    }
    setTexture(a, b) {
      if (this.texture != a) {
        this.texture = a;
        this.frame = null;
        var c = this.node;
        c.onFrameChanged = cachedBind(this, this.applyTextureSize);
        c.setEffect(new TextureDrawEffect(a));
        this.applyTextureSize();
        this.invalidateLayout();
      }
      if (b != null) {
        this.setFrame(b);
      }
    }
    applyTextureSize() {
      var a = this.texture;
      let b = this.size;
      b.x = a.size.x * a.scale;
      b.y = a.size.y * a.scale;
      this.node.setSize(this.size.x, this.size.y);
      a = this.frame;
      if (a != null) {
        this.frame = null;
        this.setFrame(a);
      }
    }
    setFrame(a) {
      if (this.frame != a) {
        this.frame = a;
        var b = this.node;
        var c = b.effect;
        var d = c.setFrameByName(a);
        c = c.texture.scale;
        a = this.frameBounds;
        var e = this.size;
        e.x = d.sourceSize.x * c;
        e.y = d.sourceSize.y * c;
        if (d.trimmed) {
          e = d.trimOrigin;
          d = d.uvOffset;
          let f = e.x * c;
          e = e.y * c;
          a.left = f;
          a.top = e;
          a.right = f + d.w;
          a.bottom = e + d.h;
          b.setSize(d.w * c, d.h * c);
        } else {
          b.setSize(this.size.x, this.size.y);
          a.left = 0;
          a.top = 0;
          a.right = 0;
          a.bottom = 0;
        }
        this.invalidateLayout();
      }
    }
    setFrame(a) {
      if (this.frame != a) {
        this.frame = a;
        var b = this.node;
        var c = b.effect;
        var d = c.setFrameByName(a);
        c = c.texture.scale;
        a = this.frameBounds;
        var e = this.size;
        e.x = d.sourceSize.x * c;
        e.y = d.sourceSize.y * c;
        if (d.trimmed) {
          e = d.trimOrigin;
          d = d.uvOffset;
          let f = e.x * c;
          e = e.y * c;
          a.left = f;
          a.top = e;
          a.right = f + d.w;
          a.bottom = e + d.h;
          b.setSize(d.w * c, d.h * c);
        } else {
          b.setSize(this.size.x, this.size.y);
          a.left = 0;
          a.top = 0;
          a.right = 0;
          a.bottom = 0;
        }
        this.invalidateLayout();
      }
    }
    anim() {
      return new InternKey(this);
    }
    setColor(a, b, c) {
      let d = this.size;
      d.x = b;
      d.y = c;
      b = this.node;
      b.setSize(this.size.x, this.size.y);
      b.rebuildGeometry();
      this.node.setEffect(new ColorRectEffect(a));
      return this;
    }
    hitTest(a, b) {
      if (!this.isVisible()) {
        return false;
      }
      NodeTreeUtil.updateWorldTransforms(this.node);
      this.node.updateBounds();
      return this.node.hitTest(a, b);
    }
    boundingBox(a, b) {
      if (b == null) {
        b = true;
      }
      let c = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
      if (this.size.x == 0) {
        return c;
      }
      if (a == this) {
        c.left = 0;
        c.top = 0;
        c.right = this.size.x;
        c.bottom = this.size.y;
        return c;
      }
      var d = this.frameBounds.left;
      var e = this.frameBounds.top;
      let f = this.node;
      var g = f.size;
      let h = g.x;
      g = g.y;
      var m = this.frameBounds;
      if (m = m.right - m.left > 0) {
        var n = this.frameBounds;
        var q = n.right - n.left;
        n.left = 0;
        n.right = q;
        n = this.frameBounds;
        q = n.bottom - n.top;
        n.top = 0;
        n.bottom = q;
        f.setSize(this.size.x, this.size.y);
        this.invalidateLayout();
        this.node.updateTransforms(false, false);
      }
      if (b) {
        NodeTreeUtil.updateWorldTransforms(this.node);
        if (a != null && !NodeTreeUtil.contains(this.node.parent, a.node)) {
          NodeTreeUtil.updateWorldTransforms(a.node);
        }
      }
      this.node.computeWorldBounds(a == null ? this.node.root() : a.node, c);
      if (m) {
        a = this.frameBounds;
        b = a.right - a.left;
        a.left = d;
        a.right = d + b;
        d = this.frameBounds;
        a = d.bottom - d.top;
        d.top = e;
        d.bottom = e + a;
        e = f.size;
        e.x = h;
        e.y = g;
        f.rebuildGeometry();
        this.invalidateLayout();
        this.node.updateTransforms(false, false);
      }
      return c;
    }
    localToWorldFrame(a) {
      let b = this.frameBounds;
      var c = b.left;
      let d = b.top;
      var e = b.right - b.left > 0;
      if (e) {
        var f = b.right - b.left;
        b.left = 0;
        b.right = f;
        f = b.bottom - b.top;
        b.top = 0;
        b.bottom = f;
        this.invalidateLayout();
        this.node.updateTransforms(false, false);
      }
      a = super.localToWorld(a);
      if (e) {
        e = b.right - b.left;
        b.left = c;
        b.right = c + e;
        c = b.bottom - b.top;
        b.top = d;
        b.bottom = d + c;
        this.invalidateLayout();
        this.node.updateTransforms(false, false);
      }
      return a;
    }
    worldToLocalFrame(a) {
      let b = this.frameBounds;
      var c = b.left;
      let d = b.top;
      var e = b.right - b.left > 0;
      if (e) {
        var f = b.right - b.left;
        b.left = 0;
        b.right = f;
        f = b.bottom - b.top;
        b.top = 0;
        b.bottom = f;
        this.invalidateLayout();
        this.node.updateTransforms(false, false);
      }
      a = super.worldToLocal(a);
      if (e) {
        e = b.right - b.left;
        b.left = c;
        b.right = c + e;
        c = b.bottom - b.top;
        b.top = d;
        b.bottom = d + c;
        this.invalidateLayout();
        this.node.updateTransforms(false, false);
      }
      return a;
    }
    moveToTop() {
      if (this.parentContainer() != null) {
        this.parentContainer().moveToTop(this);
      } else if (this.node.parent != null) {
        this.node.parent.moveToBack(this.node);
      }
    }
    moveToBottom() {
      if (this.parentContainer() != null) {
        this.parentContainer().moveToBottom(this);
      } else if (this.node.parent != null) {
        this.node.parent.moveToFront(this.node);
      }
    }
    setOffsetY(a) {
      this.node.effect.setOffsetY(a);
    }
    updateLocalTransform() {
      let a = this.node.localT;
      let b = this.pivotX;
      let c = this.pivotY;
      var d = this.frameBounds;
      let e = d.left;
      d = d.top;
      let f = this.originX;
      let g = this.originY;
      let h = this.originYBase - e;
      let m = this.originXBase - d;
      let n = this.scaleXSafe;
      var q = this.scaleYSafe;
      var p = this.flags;
      if ((p & 1) > 0) {
        let u = Math.sin(this.rotationRad);
        let A = Math.cos(this.rotationRad);
        var v = a.matrix;
        let D = a.matrix;
        D.m11 = A;
        D.m12 = -u;
        D.m13 = v.m13;
        D.m21 = u;
        D.m22 = A;
        D.m23 = v.m23;
        D.m31 = v.m31;
        D.m32 = v.m32;
        D.m33 = v.m33;
        a.K = a.K & -4 | 248;
        if ((p & 4) > 0) {
          a.scale.x = 1;
          a.scale.y = 1;
          a.K |= 500;
          a.translate.x = -(h * A) + m * u + h + b - f + e;
          a.translate.y = -(h * u) - m * A + m + c - g + d;
        } else if ((p & 2) > 0) {
          q = n * h;
          p = n * m;
          a.scale.x = a.scale.y = n;
          a.K = a.K & -2 | 500;
          a.translate.x = -(q * A) + p * u + h + b - f + e;
          a.translate.y = -(q * u) - p * A + m + c - g + d;
        } else {
          p = n * h;
          v = q * m;
          a.scale.x = n;
          a.scale.y = q;
          a.K = a.K & -6 | 496;
          a.translate.x = -(p * A) + v * u + h + b - f + e;
          a.translate.y = -(p * u) - v * A + m + c - g + d;
        }
      } else if ((p & 4) > 0) {
        a.scale.x = 1;
        a.scale.y = 1;
        a.K |= 500;
        a.translate.x = b - f + e;
        a.translate.y = c - g + d;
      } else if ((p & 2) > 0) {
        a.scale.x = a.scale.y = n;
        a.K = a.K & -2 | 500;
        a.translate.x = -(n * h) + h + b - f + e;
        a.translate.y = -(n * m) + m + c - g + d;
      } else {
        a.scale.x = n;
        a.scale.y = q;
        a.K = a.K & -6 | 496;
        a.translate.x = -(n * h) + h + b - f + e;
        a.translate.y = -(q * m) + m + c - g + d;
      }
      a.K = a.K & -2 | 496;
    }
    typeId() {
      return 304;
    }
  }
  Sprite.i = true;
  Sprite.s = DisplayBase;
  Object.assign(Sprite.prototype, {
    l: Sprite
  });
  class Container extends DisplayBase {
    constructor(a, b) {
      // node aliased twice in the original code (Container kept its own
      // `node` field separately from DisplayBase's `u`); both now refer
      // to the same SceneRoot so the alias is redundant.
      super(new SceneRoot(b != null ? b.node : null, null, 512));
      this.node.name = a;
    }
    free() {
      if (this.node != null) {
        this.node.free();
        this.node = null;
        super.free();
      }
    }
    appendChild(a) {
      this.node.appendChild(a.node);
    }
    childCount() {
      return this.node.childCount();
    }
    childAt(a) {
      return this.node.childAt(a).owner;
    }
    moveChildTo(a, b) {
      this.node.moveChildTo(a.node, b);
    }
    childByName(a) {
      a = this.node.childByName(a);
      if (a != null) {
        return a.owner;
      } else {
        return null;
      }
    }
    moveToTop(a) {
      if (a == null) {
        if (this.parentContainer() != null) {
          this.node.parent.moveToBack(this.node);
        }
      } else {
        this.node.moveToBack(a.node);
      }
    }
    moveToBottom(a) {
      if (a == null) {
        if (this.parentContainer() != null) {
          this.node.parent.moveToFront(this.node);
        }
      } else {
        this.node.moveToFront(a.node);
      }
    }
    iterator() {
      let a = this.node.children;
      return {
        hasNext: function () {
          return a != null;
        },
        next: function () {
          let b = a.owner;
          a = a.nextSibling;
          return b;
        }
      };
    }
    hitTest(a, b) {
      NodeTreeUtil.updateWorldTransforms(this.node);
      this.node.updateTransforms(false, true);
      return this.node.hitTest(a, b);
    }
    boundingBox(a, b) {
      if (b == null) {
        b = true;
      }
      if (b) {
        this.node.updateTransforms(false, false);
        NodeTreeUtil.updateWorldTransforms(this.node);
        if (a != null && !NodeTreeUtil.contains(this.node, a.node)) {
          NodeTreeUtil.updateWorldTransforms(a.node);
        }
        b = false;
      }
      let c = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
      let d = this.node.children;
      while (d != null) {
        let e = d.owner;
        if (e != null && e instanceof DisplayBase) {
          c.add(e.boundingBox(a, b));
        }
        d = d.nextSibling;
      }
      return c;
    }
    getWidth() {
      let a = this.boundingBox(this.parentContainer());
      return a.right - a.left;
    }
    getHeight() {
      let a = this.boundingBox(this.parentContainer());
      return a.bottom - a.top;
    }
    centerOrigin() {
      if (this.childCount() != 0) {
        var a = this.boundingBox(this);
        this.setOrigin((a.left + a.right) / 2, (a.top + a.bottom) / 2);
      }
    }
    centerPivot() {
      if (this.childCount() != 0) {
        var a = this.boundingBox(this);
        this.setPivot((a.left + a.right) / 2, (a.top + a.bottom) / 2);
      }
    }
    typeId() {
      return 204;
    }
  }
  Container.i = true;
  Container.s = DisplayBase;
  Object.assign(Container.prototype, {
    l: Container
  });
