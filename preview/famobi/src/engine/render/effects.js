  class DrawEffect {
    constructor() {
      this.type = this.typeId();
      this.enabled = true;
      this.visual = null;
      this.key = 0;
    }
    free() {
      this.visual = null;
    }
    update() {}
    attachToVisual(a) {
      this.visual = a;
    }
    typeId() {
      return 105;
    }
  }
  DrawEffect.i = true;
  DrawEffect.Ib = [C180];
  Object.assign(DrawEffect.prototype, {
    l: DrawEffect
  });
  class RingDrawEffect extends DrawEffect {
    constructor() {
      super();
      this.radius = 0;
      this.color = new Vec4(1, 1, 1, 1);
      this.lineWidth = 6;
      this.opacity = 1;
    }
    typeId() {
      return 905;
    }
  }
  RingDrawEffect.i = true;
  RingDrawEffect.s = DrawEffect;
  Object.assign(RingDrawEffect.prototype, {
    l: RingDrawEffect
  });
  class TextureDrawEffect extends DrawEffect {
    constructor(a, b) {
      super();
      this.texture = null;
      this.uvRect = new TexRect(0, 0, 0, 0);
      this.frame = null;
      this.scaleY = this.scaleX = 1;
      this.textureVersion = this.flags = this.offsetY = this.offsetX = 0;
      this.setTexture(a, b);
    }
    setOffsetY(a) {
      this.offsetX = 0;
      this.offsetY = a;
      this.flags = a == 0 ? this.flags & -3 : this.flags | 2;
    }
    setTexture(a, b) {
      this.texture = a;
      if (b != null) {
        this.setFrameByName(b);
      } else {
        b = this.uvRect;
        let c = a.size.x;
        let d = a.size.y;
        b.x = 0;
        b.y = 0;
        b.w = c;
        b.h = d;
        this.frame = null;
      }
      this.key = a.id;
    }
    setFrameByName(a) {
      a = this.texture.frames.findByName(a);
      if (this.frame == null || a.id != this.frame.id) {
        this.frame = a;
        a = this.uvRect;
        let b = this.frame.uvOffset;
        a.x = b.x;
        a.y = b.y;
        a.w = b.w;
        a.h = b.h;
      }
      return this.frame;
    }
    setFrame(a) {
      if (this.frame == null || this.frame.id != a) {
        this.frame = this.texture.frames.findById(a);
        a = this.uvRect;
        let b = this.frame.uvOffset;
        a.x = b.x;
        a.y = b.y;
        a.w = b.w;
        a.h = b.h;
      }
    }
    update() {
      if (this.texture.textureVersion > this.textureVersion) {
        this.textureVersion = this.texture.textureVersion;
        if (this.frame == null) {
          this.setTexture(this.texture);
        } else {
          let a = this.frame;
          this.frame = null;
          this.setFrame(a.id);
        }
        if (this.visual.onFrameChanged != null) {
          this.visual.onFrameChanged();
        }
      }
    }
    free() {
      super.free();
      this.texture = null;
    }
    typeId() {
      return 205;
    }
  }
  TextureDrawEffect.i = true;
  TextureDrawEffect.s = DrawEffect;
  Object.assign(TextureDrawEffect.prototype, {
    l: TextureDrawEffect
  });
  class MeshDrawEffect extends DrawEffect {
    constructor(a) {
      super();
      this.texture = a;
      this.mesh = null;
    }
    free() {
      super.free();
      this.texture = null;
    }
    typeId() {
      return 405;
    }
  }
  MeshDrawEffect.i = true;
  MeshDrawEffect.s = DrawEffect;
  Object.assign(MeshDrawEffect.prototype, {
    l: MeshDrawEffect
  });
  class ParallaxDrawEffect extends DrawEffect {
    constructor(a, b) {
      super();
      this.parallaxRatio = new Vec4(1, 1, 0, 1);
      this.offset = new Vec4(0, 0, 0, 1);
      a.forEachValue(function () {});
      this.layerSize = new Size(a.cols * b, a.rows * b);
    }
    free() {
      super.free();
    }
    attachToVisual(a) {
      super.attachToVisual(a);
      a.setSize(this.layerSize.x, this.layerSize.y);
      a.rebuildGeometry();
    }
    update(a) {
      var b = a.camera;
      var c = b.position.y;
      b = b.position.x - a.currentVisual.worldT.translate.x;
      var d = c - a.currentVisual.worldT.translate.y;
      c = this.offset;
      c.x = b * (1 - this.parallaxRatio.x);
      c.y = d * (1 - this.parallaxRatio.y);
      b = a.currentVisual;
      b.setSize(this.layerSize.x, this.layerSize.y);
      d = (1 - this.parallaxRatio.x) * c.x * 2;
      a = (1 - this.parallaxRatio.y) * c.y * 2;
      b.localBounds.center.x = d;
      b.localBounds.center.y = a;
      c = b.localBounds.bounds;
      let e = c.right - c.left;
      c.left = d;
      c.right = d + e;
      c = b.localBounds.bounds;
      b = c.bottom - c.top;
      c.top = a;
      c.bottom = a + b;
    }
    typeId() {
      return 1605;
    }
  }
  ParallaxDrawEffect.i = true;
  ParallaxDrawEffect.s = DrawEffect;
  Object.assign(ParallaxDrawEffect.prototype, {
    l: ParallaxDrawEffect
  });
  class SolidColorEffect extends DrawEffect {
    constructor(a) {
      if (a == null) {
        a = 1;
      }
      super();
      this.flags = a;
      this.color = new Vec4(0, 0, 0, 1);
    }
    typeId() {
      return 1405;
    }
  }
  SolidColorEffect.i = true;
  SolidColorEffect.s = DrawEffect;
  Object.assign(SolidColorEffect.prototype, {
    l: SolidColorEffect
  });
  class ShapePath extends DrawEffect {
    constructor() {
      super();
      this.precision = 0.2;
      this.closed = false;
      new Bounds(0, 0, 1024, 1024);
      this.needsRebuild = false;
      this.opCount = 0;
      this.opCapacity = 256;
      this.ops = Array(this.opCapacity);
      this.dataCapacity = 1024;
      this.data = Array(this.dataCapacity);
      this.lineWidth = this.opacity = 1;
      this.fillColor = 0;
      this.cursor = new Vec4(0, 0, 0, 1);
      this.triBuffer = [];
      this.localBounds = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
      this.clear();
    }
    free() {
      this.triBuffer = this.ops = this.data = null;
      super.free();
    }
    attachToVisual(a) {
      super.attachToVisual(a);
      if (this.needsRebuild) {
        this.updateBounds();
      }
    }
    clear() {
      this.opCount = 0;
      let a = this.localBounds;
      a.left = a.top = vInfinity;
      a.right = a.bottom = vNegInfinity;
    }
    updateBounds() {
      let a = vInfinity;
      let b = vNegInfinity;
      let c = vInfinity;
      let d = vNegInfinity;
      let e = this.localBounds;
      let f = this.data;
      let g = this.ops;
      let h = 0;
      let m = 0;
      let n = this.opCount;
      while (h < n) {
        var q = g[h++];
        switch (q) {
          case 1:
          case 2:
          case 3:
            q = f[m];
            let p = f[m + 1];
            if (q < a) {
              a = q;
            }
            if (q > b) {
              b = q;
            }
            if (p < c) {
              c = p;
            }
            if (p > d) {
              d = p;
            }
            m += 2;
            break;
          case 4:
            m += 3;
            break;
          case 5:
            m += 2;
            break;
          case 6:
          case 7:
          case 8:
            break;
          default:
            e.left = a;
            e.top = c;
            e.right = b;
            e.bottom = d;
            m = this.processCmd(q, m, f);
            a = e.left;
            c = e.top;
            b = e.right;
            d = e.bottom;
        }
      }
      e.left = a;
      e.top = c;
      e.right = b;
      e.bottom = d;
      if (this.visual != null) {
        this.rebuildGeometry();
      }
    }
    processCmd() {
      return 0;
    }
    rebuildGeometry() {
      let a = this.localBounds;
      var b = this.visual.localBounds;
      b.center.x = (a.left + a.right) / 2;
      b.center.y = (a.top + a.bottom) / 2;
      let c = (a.right - a.left) / 2;
      let d = (a.bottom - a.top) / 2;
      b.radius = Math.sqrt(c * c + d * d);
      if (b.type == 302) {
        b = b.bounds;
        b.left = a.left;
        b.top = a.top;
        b.right = a.right;
        b.bottom = a.bottom;
      }
      this.visual.rebuildGeometry();
    }
    typeId() {
      return 1005;
    }
  }
  ShapePath.i = true;
  ShapePath.s = DrawEffect;
  Object.assign(ShapePath.prototype, {
    l: ShapePath
  });

  class GradientEffect extends ShapePath {
    constructor() {
      super();
      let a = [];
      let b = 0;
      while (b < 4) {
        ++b;
        a.push(new Vec4(0, 0, 0, 1));
      }
      this.gradientStops = [];
    }
    typeId() {
      return 1505;
    }
  }
  GradientEffect.i = true;
  GradientEffect.s = ShapePath;
  Object.assign(GradientEffect.prototype, {
    l: GradientEffect
  });

  class TextDrawEffect extends DrawEffect {
    constructor(a) {
      super();
      this.texture = a;
      this.baseScale = a.scale;
      this.charset = a.frames.charset;
      this.text = null;
      this.clip = false;
      this.fontSize = this.charset.fontSize;
      this.minFontSize = 4;
      this.maxFontSize = 512;
      this.size = new Vec4(100, 100, 0, 1);
      this.kerning = true;
      this.shadow = false;
      this.maxChars = 32;
      this.lineHeightOffset = this.yOffsetPerLine = 0;
      this.padding = 2;
      this.alignV = this.alignH = null;
      this.wrapMode = 0;
      this.dirty = true;
      this.overflow = false;
      this.layout = new TextLayout();
      this.multiline = false;
      this.textureVersion = 0;
    }
    attachToVisual(a) {
      super.attachToVisual(a);
      a.setSize(this.size.x, this.size.y);
    }
    setText(a) {
      if (this.text != a) {
        this.text = a;
        if (this.multiline) {
          this.reflow();
        }
        this.dirty = true;
      }
    }
    getFontSize() {
      return this.fontSize;
    }
    markDirty() {
      this.fontSize = this.charset.fontSize;
    }
    setFontSize(a) {
      var b;
      if (b != null) {
        if (b < 4) {
          b = 4;
        }
        this.minFontSize = b;
      }
      b = this.minFontSize;
      let c = this.maxFontSize;
      a = a < b ? b : a > c ? c : a;
      if (a != this.fontSize) {
        this.fontSize = a;
        this.dirty = true;
      }
    }
    getSize() {
      let a = this.size;
      return new Vec4(a.x, a.y, 0, 1);
    }
    setBoxSize(a, b) {
      if (this.size.x != a || this.size.y != b) {
        this.size.x = a;
        this.size.y = b;
        this.visual.setSize(this.size.x, this.size.y);
        this.dirty = true;
      }
    }
    lineCount() {
      return this.layout.lineCount;
    }
    setYOffsetPerLine(a) {
      this.yOffsetPerLine = a;
      this.dirty = true;
    }
    setLineHeightOffset(a) {
      this.lineHeightOffset = a;
      this.dirty = true;
    }
    setAlign(a, b) {
      this.alignH = a;
      this.alignV = b;
      this.dirty = true;
    }
    autoFit(a) {
      if (a == null) {
        a = true;
      }
      if (this.text != null) {
        var b = this.padding * 2;
        var c = this.size.x - b;
        var d = this.size.y - b;
        this.markDirty();
        b = d / this.charset.base;
        this.layout.shape(this, true);
        var e = this.layout.bounds;
        c = Math.min(c / (e.right - e.left), d / (e.bottom - e.top));
        if (a) {
          c = Math.min(b, c);
        }
        this.fontSize *= c;
        this.shape();
      }
    }
    setMultiline(a) {
      if ((this.multiline = a) && this.parser == null) {
        this.setParser(new TokenParser());
      }
    }
    setParser(a) {
      this.parser = a;
      if (this.text != null) {
        this.reflow();
      }
      this.dirty = true;
    }
    shape() {
      this.layout.shape(this, false);
      let a = this.layout.bounds;
      this.overflow = a.right - a.left > this.size.x - this.padding * 2;
      this.dirty = false;
    }
    update() {
      if (this.texture.textureVersion > this.textureVersion) {
        this.textureVersion = this.texture.textureVersion;
        this.charset = this.texture.frames.charset;
        let a = this.texture.scale;
        this.fontSize *= this.baseScale / a;
        this.baseScale = a;
        if (this.visual.onFrameChanged != null) {
          this.visual.onFrameChanged();
        }
        this.dirty = true;
      }
      if (this.dirty) {
        this.dirty = false;
        this.shape();
      }
    }
    free() {
      super.free();
      this.texture = null;
      this.layout.free();
      this.layout = null;
    }
    reflow() {
      this.parser.setSource(this.text);
      this.tokens = [];
      let a = 0;
      let b = this.parser.nextToken();
      while (b != null) {
        this.tokens.push(new TextRun(this.text.substring(a, b.position), b.required));
        a = b.position;
        b = this.parser.nextToken();
      }
    }
    typeId() {
      return 505;
    }
  }
  TextDrawEffect.i = true;
  TextDrawEffect.s = DrawEffect;
  Object.assign(TextDrawEffect.prototype, {
    l: TextDrawEffect
  });
  class GradientLineEffect extends DrawEffect {
    constructor() {
      super();
      this.points = [];
      this.colorLists = [];
      this.alphas = [];
      this.radius = 10;
    }
    free() {
      super.free();
      this.alphas = this.colorLists = this.points = null;
    }
    clearTrail() {
      this.points = [];
      this.colorLists = [];
      this.alphas = [];
    }
    typeId() {
      return 705;
    }
  }
  GradientLineEffect.i = true;
  GradientLineEffect.s = DrawEffect;
  Object.assign(GradientLineEffect.prototype, {
    l: GradientLineEffect
  });
  class ClearEffect extends DrawEffect {
    constructor(a) {
      super();
      this.color = a;
      this.mesh = null;
    }
    typeId() {
      return 305;
    }
  }
  ClearEffect.i = true;
  ClearEffect.s = DrawEffect;
  Object.assign(ClearEffect.prototype, {
    l: ClearEffect
  });
  class MultiLineEffect extends DrawEffect {
    constructor(a) {
      super();
      this.types = a;
      this.outputs = [];
    }
    update(a) {
      super.update(a);
      this.outputs = [];
      for (a = 0; a < 5;) {
        var b = this.types[a++];
        var c = b.length;
        if (c == 0) {
          continue;
        }
        let q = 1;
        var d = undefined;
        var e = [];
        var f = 0;
        for (var g = 0; g < c;) {
          var h = g++;
          d = b[h];
          if (h == 0) {
            e[f++] = d.start;
          }
          e[f++] = d.end;
        }
        b = c * 2;
        c = [];
        f = 1 / b;
        for (g = 0;;) {
          if (g > 1) {
            g = 1;
          }
          d = Vec2.bezier(e, g);
          c.push(d);
          if (g == 1) {
            break;
          }
          g += f;
        }
        e = MultiLineEffect.WIDTH_SCALE / b;
        d = [];
        f = 0;
        for (g = b - 1; f < g;) {
          var m = q;
          h = f == b - 1 ? 1 : q + e;
          let p = c[f];
          let v = c[f + 1];
          var n = Vec2.diff(v, p);
          n.normalize();
          let u = Vec2.perpCW(n);
          n = Vec2.perpCCW(n);
          let A = Vec2.sum(p, Vec2.scaled(n, m));
          d.push(Vec2.sum(p, Vec2.scaled(u, m)));
          d.push(A);
          m = Vec2.sum(v, Vec2.scaled(n, h));
          d.push(Vec2.sum(v, Vec2.scaled(u, h)));
          d.push(m);
          q += e;
          ++f;
        }
        this.outputs.push(d);
      }
    }
    typeId() {
      return 1105;
    }
  }
  MultiLineEffect.i = true;
  MultiLineEffect.s = DrawEffect;
  Object.assign(MultiLineEffect.prototype, {
    l: MultiLineEffect
  });
  class DashedCircleEffect extends DrawEffect {
    constructor() {
      super();
      this.center = new Vec4(0, 0, 0, 1);
      this.radius = 0;
      this.color = new Vec4(0, 0, 0, 0);
      this.segments = 0;
      this.lineWidth = 1.5;
      this.update(null);
    }
    update() {
      this.segments = Math.max(16, Math.round(this.radius / 0.8));
      if (this.segments % 2 != 0) {
        this.segments++;
      }
    }
    typeId() {
      return 605;
    }
  }
  DashedCircleEffect.i = true;
  DashedCircleEffect.s = DrawEffect;
  Object.assign(DashedCircleEffect.prototype, {
    l: DashedCircleEffect
  });

  class TextGridEffect extends DrawEffect {
    constructor(a, b, c) {
      super();
      this.texture = a;
      this.charset = a.frames.charset;
      a = [9633, 65533, 63];
      let d = 0;
      while (d < 3) {
        let e = d++;
        if (this.charset.glyphsById[a[e]] != null) {
          break;
        }
      }
      this.grid = null;
      this.fillColor = -1;
      this.gridH = this.gridW = 0;
      this.setSize(b, c, false);
    }
    setSize(a, b, c) {
      if (c) {
        a = a / this.charset.defaultAdvance | 0;
        b = b / this.charset.lineHeight | 0;
        this.setSize(a, b, false);
      } else {
        if (this.gridW > 0 && a > this.gridW) {
          a = this.gridW;
        }
        if (this.gridH > 0 && b > this.gridH) {
          b = this.gridH;
        }
        if (this.grid == null || a != this.grid.cols || b != this.grid.rows) {
          if (this.grid == null) {
            this.grid = new Grid2D(a, b);
          } else {
            this.grid.resize(a, b);
          }
          this.grid.forEach(function (d, e, f) {
            if (d == null) {
              return new GridCell(e, f);
            } else {
              return d;
            }
          });
          if (this.visual != null) {
            this.rebuildGeometry();
          }
        }
      }
    }
    attachToVisual(a) {
      super.attachToVisual(a);
      this.rebuildGeometry();
    }
    rebuildGeometry() {
      this.visual.setSize(this.charset.defaultAdvance * this.grid.cols, this.charset.lineHeight * this.grid.rows);
      this.visual.rebuildGeometry();
    }
    typeId() {
      return 1805;
    }
  }
  TextGridEffect.i = true;
  TextGridEffect.s = DrawEffect;
  Object.assign(TextGridEffect.prototype, {
    l: TextGridEffect
  });
  class ColorRectEffect extends DrawEffect {
    constructor(a) {
      super();
      this.color = Vec4Clone.clone(a);
    }
    typeId() {
      return 1205;
    }
  }
  ColorRectEffect.i = true;
  ColorRectEffect.s = DrawEffect;
  Object.assign(ColorRectEffect.prototype, {
    l: ColorRectEffect
  });
  class SpriteShapeEffect extends DrawEffect {
    constructor(a, b) {
      super();
      this.texture = a;
      this.shape = b;
      this.frames = [];
    }
    typeId() {
      return 1705;
    }
  }
  SpriteShapeEffect.i = true;
  SpriteShapeEffect.s = DrawEffect;
  Object.assign(SpriteShapeEffect.prototype, {
    l: SpriteShapeEffect
  });
  class ShapePathBounds extends ShapePath {
    constructor() {
      super();
    }
    processCmd(a, b, c) {
      var d = this.localBounds;
      let e = d.left;
      let f = d.top;
      let g = d.right;
      d = d.bottom;
      switch (a) {
        case 10:
          var h = c[b];
          a = c[b + 1];
          var m = c[b + 2];
          c = c[b + 3];
          if (h < e) {
            e = h;
          }
          if (h > g) {
            g = h;
          }
          if (a < f) {
            f = a;
          }
          if (a > d) {
            d = a;
          }
          h += m;
          c = a + c;
          if (h < e) {
            e = h;
          }
          if (h > g) {
            g = h;
          }
          if (c < f) {
            f = c;
          }
          if (c > d) {
            d = c;
          }
          b += 4;
          break;
        case 11:
          h = c[b];
          a = c[b + 1];
          m = c[b + 2];
          c = c[b + 3];
          if (h < e) {
            e = h;
          }
          if (h > g) {
            g = h;
          }
          if (a < f) {
            f = a;
          }
          if (a > d) {
            d = a;
          }
          h += m;
          c = a + c;
          if (h < e) {
            e = h;
          }
          if (h > g) {
            g = h;
          }
          if (c < f) {
            f = c;
          }
          if (c > d) {
            d = c;
          }
          b += 5;
          break;
        case 12:
          a = c[b];
          h = c[b + 1];
          if (a < e) {
            e = a;
          }
          if (a > g) {
            g = a;
          }
          if (h < f) {
            f = h;
          }
          if (h > d) {
            d = h;
          }
          a = c[b + 2];
          c = c[b + 3];
          if (a < e) {
            e = a;
          }
          if (a > g) {
            g = a;
          }
          if (c < f) {
            f = c;
          }
          if (c > d) {
            d = c;
          }
          b += 4;
          break;
        case 13:
          a = c[b];
          h = c[b + 1];
          if (a < e) {
            e = a;
          }
          if (a > g) {
            g = a;
          }
          if (h < f) {
            f = h;
          }
          if (h > d) {
            d = h;
          }
          a = c[b + 2];
          h = c[b + 3];
          if (a < e) {
            e = a;
          }
          if (a > g) {
            g = a;
          }
          if (h < f) {
            f = h;
          }
          if (h > d) {
            d = h;
          }
          a = c[b + 4];
          c = c[b + 5];
          if (a < e) {
            e = a;
          }
          if (a > g) {
            g = a;
          }
          if (c < f) {
            f = c;
          }
          if (c > d) {
            d = c;
          }
          b += 6;
          break;
        case 14:
          h = c[b];
          a = c[b + 1];
          c = c[b + 2];
          m = h - c;
          var n = a - c;
          if (m < e) {
            e = m;
          }
          if (m > g) {
            g = m;
          }
          if (n < f) {
            f = n;
          }
          if (n > d) {
            d = n;
          }
          h += c;
          c = a + c;
          if (h < e) {
            e = h;
          }
          if (h > g) {
            g = h;
          }
          if (c < f) {
            f = c;
          }
          if (c > d) {
            d = c;
          }
          b += 5;
          break;
        case 15:
          h = c[b];
          a = c[b + 1];
          c = Math.max(c[b + 2], c[b + 3]);
          m = h - c;
          n = a - c;
          if (m < e) {
            e = m;
          }
          if (m > g) {
            g = m;
          }
          if (n < f) {
            f = n;
          }
          if (n > d) {
            d = n;
          }
          h += c;
          c = a + c;
          if (h < e) {
            e = h;
          }
          if (h > g) {
            g = h;
          }
          if (c < f) {
            f = c;
          }
          if (c > d) {
            d = c;
          }
          b += 8;
          break;
        case 16:
          ++b;
          break;
        case 17:
          b += 1 + (c[b] | 0);
      }
      c = this.localBounds;
      c.left = e;
      c.top = f;
      c.right = g;
      c.bottom = d;
      return b;
    }
    typeId() {
      return 1305;
    }
  }
  ShapePathBounds.i = true;
  ShapePathBounds.s = ShapePath;
  Object.assign(ShapePathBounds.prototype, {
    l: ShapePathBounds
  });
  class NoopEffect extends DrawEffect {
    constructor() {
      super();
    }
    typeId() {
      return 2005;
    }
  }
  NoopEffect.i = true;
  NoopEffect.s = DrawEffect;
  Object.assign(NoopEffect.prototype, {
    l: NoopEffect
  });
  class MeshDataEffect extends DrawEffect {
    constructor() {
      super();
      new MeshData(null, null, null, null);
      new MeshVertices(null, null, null, null, null);
      this.geometry = new MeshGeometry(null, null, null);
    }
    typeId() {
      return 1905;
    }
  }
  MeshDataEffect.i = true;
  MeshDataEffect.s = DrawEffect;
  Object.assign(MeshDataEffect.prototype, {
    l: MeshDataEffect
  });
  class CustomShaderEffect extends DrawEffect {
    constructor(a) {
      super();
      this.program = a;
    }
    free() {}
    typeId() {
      return 805;
    }
  }
  CustomShaderEffect.i = true;
  CustomShaderEffect.s = DrawEffect;
  Object.assign(CustomShaderEffect.prototype, {
    l: CustomShaderEffect
  });

  class MeshGeometry {
    constructor() {
      new Vec4(0, 0, 0, 1);
      new Vec4(0, 0, -1, 1);
      new Vec4(0, 0, 0, 1);
    }
  }
  MeshGeometry.i = true;
  Object.assign(MeshGeometry.prototype, {
    l: MeshGeometry
  });
  class MeshVertices {
    constructor() {
      new Vec4(1, 0, 0, 1);
      new Vec4(HALF_PI, 0, 1, 1);
      new Vec4(1, 1, 1, 1);
      new Vec4(1, 1, 1, 1);
      new Vec4(1, 1, 1, 1);
    }
  }
  MeshVertices.i = true;
  Object.assign(MeshVertices.prototype, {
    l: MeshVertices
  });
  class MeshData {
    constructor() {
      new Vec4(0, 0, 0, 1);
      new Vec4(0, 0, 0, 1);
      new Vec4(0, 0, 0, 1);
      new Vec4(0, 0, 0, 1);
    }
  }
  MeshData.i = true;
  Object.assign(MeshData.prototype, {
    l: MeshData
  });

  class GridCell {
    constructor(a, b) {
      this.x = a;
      this.y = b;
      this.code = 0;
    }
  }
  GridCell.i = true;
  Object.assign(GridCell.prototype, {
    l: GridCell
  });
