  class Renderer {
    constructor(a) {
      this.name = a;
      this.info = new RendererInfo(this);
      this.currentVisual = null;
      this.quadCap = 256;
      this.alphaEpsilon = 0.001;
      this.camera = this.window = null;
      this.cameraStack = [];
      this.clearColor = new Vec4(0, 0, 0, 1);
      this.invViewProjM = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.viewProjM = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.viewport = new TexRect(0, 0, 1, 1);
      this.activeTextureSlots = Array(1056);
      this.textureDirty = Array(1056);
      this.batchingEnabled = true;
      this.activeStates = Array(7);
      this.defaultStates = Array(7);
      this.stateMask = BitMaskTable.LOW_BITS[7];
      this.renderFlags = 0;
      this.textures = [];
      this.drawList = new ArrayList();
      this.defaultStates[0] = new BlendModeState(1, true);
      this.defaultStates[1] = new ClipState();
      this.defaultStates[2] = new ColorTransformState();
      this.defaultStates[3] = new CullFaceState(true, true);
      this.defaultStates[4] = new DepthTestState(false, 1);
      this.defaultStates[5] = new AlphaState(1);
      this.defaultStates[6] = new PassThroughState();
    }
    attachWindow(a) {
      if (this.window != null) {
        this.window.setRenderer(null);
      }
      this.window = a;
      this.window.setRenderer(this);
    }
    setClearColor(a) {
      let b = this.clearColor;
      b.x = a.x;
      b.y = a.y;
      b.z = a.z;
      b.w = a.w;
    }
    setCamera(a) {
      this.camera = a;
    }
    pushCamera(a) {
      this.cameraStack.push(this.camera);
      this.setCamera(a);
    }
    popCamera() {
      this.setCamera(this.cameraStack.pop());
    }
    resetViewport() {
      this.setViewport(0, 0, 1, 1);
    }
    setViewport(a, b, c, d) {
      let e = this.viewport;
      e.x = a;
      e.y = b;
      e.w = c - a;
      e.h = d - b;
    }
    beginFrame() {
      if (this.window == null || this.window.getContext() == null || this.window.size.x * this.window.size.y == 0) {
        return false;
      }
      this.applyDefaultStates();
      return true;
    }
    endFrame() {}
    // drawScene - flatten the scene rooted at `a` into the draw list
    // and submit it to the GPU pipeline.
    drawScene(a) {
      let b = this.drawList;
      b.clear();
      b.reserve(SceneNode.count);
      NodeTreeUtil.collectVisuals(a, b);
      if (b.count > 0) {
        this.submitBatch(b);
      }
    }
    clear() {}
    applyDefaultStates() {
      this.renderFlags = 0;
      let a = this.stateMask;
      let b = 0;
      while (b < 7) {
        let c = b++;
        this.activeStates[c] = this.defaultStates[c];
        if ((a & 1 << c) != 0) {
          this.activeStates[c].set(this);
        }
      }
    }
    submitBatch(a) {
      let b = a.array;
      let c = 0;
      for (a = a.count; c < a;) {
        this.drawVisual(b[c++]);
      }
    }
    drawVisual(a) {
      let b = a.effect;
      if (b != null && b.enabled && a.visibility != 1) {
        this.currentVisual = a;
        this.setRenderState(a);
        this.drawEffect(b);
      }
    }
    listTextures() {
      return this.textures.slice();
    }
    createTexture(a, b, c, d) {
      if (b == null) {
        b = 0;
      }
      b = this.createNativeTexture(b);
      this.textures.push(b);
      b.name = d;
      b.setImage(a);
      if (c != null) {
        b.setFrames(c);
      }
      return b;
    }
    addTextureFrame(a, b, c) {
      let d = this.createNativeTexture(a.flags);
      d.name = c == null ? "-" : c;
      a.addChild(d, b.clone());
      if (c != null) {
        a = a.frames.findByName(c);
        d.frames.offset(a.uvOffset.x, a.uvOffset.y);
      }
    }
    release(a) {
      a.free();
      Std.remove(this.textures, a);
    }
    programFor(a, b) {
      a = (b / 100 | 0) * 32 + (a / 100 | 0);
      b = this.activeTextureSlots[a];
      if (b != null && !this.textureDirty[a]) {
        this.textureDirty[a] = true;
        b.init(this);
      }
      return b;
    }
    programForFlipped(a, b) {
      a = 512 + (b / 100 | 0) * 32 + (a / 100 | 0);
      b = this.activeTextureSlots[a];
      if (b != null && !this.textureDirty[a]) {
        this.textureDirty[a] = true;
        b.init(this);
      }
      return b;
    }
    registerProgram(a) {
      var b;
      if (b == null) {
        b = false;
      }
      let c = a.effectType / 100 | 0;
      var d = a.visualType / 100 | 0;
      d = (b ? 1 : 0) * 512 + d * 32 + c;
      this.activeTextureSlots[d] = a;
      let e = a.visualType == 201;
      if (e) {
        let f = 0;
        while (f < 16) {
          d = f++ + 1;
          d = (b ? 1 : 0) * 512 + d * 32 + c;
          this.activeTextureSlots[d] = a;
        }
      }
      if (this.batchingEnabled && (a.init(this), this.textureDirty[d] = true, e)) {
        for (a = 0; a < 16;) {
          d = a++ + 1;
          d = (b ? 1 : 0) * 512 + d * 32 + c;
          this.textureDirty[d] = true;
        }
      }
    }
    disableDepthTest() {
      this.stateMask &= -9;
    }
    computeClipMatrix(a) {
      let b = this.invViewProjM;
      let c = this.camera.worldM;
      if ((a.flags & 240) > 0) {
        a.updateComposite();
      }
      var d = a.compositeM;
      a = d.m11;
      var e = d.m12;
      var f = d.m13;
      var g = d.m14;
      let h = d.m21;
      let m = d.m22;
      let n = d.m23;
      let q = d.m24;
      let p = d.m31;
      let v = d.m32;
      let u = d.m33;
      let A = d.m34;
      let D = d.m41;
      let B = d.m42;
      let K = d.m43;
      let E = d.m44;
      d = c.m11 * e + c.m12 * m + c.m13 * v + c.m14 * B;
      let v54 = c.m11 * f + c.m12 * n + c.m13 * u + c.m14 * K;
      let v55 = c.m11 * g + c.m12 * q + c.m13 * A + c.m14 * E;
      let V = c.m21 * e + c.m22 * m + c.m23 * v + c.m24 * B;
      let v56 = c.m21 * f + c.m22 * n + c.m23 * u + c.m24 * K;
      let v57 = c.m21 * g + c.m22 * q + c.m23 * A + c.m24 * E;
      let v58 = c.m31 * e + c.m32 * m + c.m33 * v + c.m34 * B;
      let v59 = c.m31 * f + c.m32 * n + c.m33 * u + c.m34 * K;
      let v60 = c.m31 * g + c.m32 * q + c.m33 * A + c.m34 * E;
      e = c.m41 * e + c.m42 * m + c.m43 * v + c.m44 * B;
      f = c.m41 * f + c.m42 * n + c.m43 * u + c.m44 * K;
      g = c.m41 * g + c.m42 * q + c.m43 * A + c.m44 * E;
      b.m11 = c.m11 * a + c.m12 * h + c.m13 * p + c.m14 * D;
      b.m12 = d;
      b.m13 = v54;
      b.m14 = v55;
      b.m21 = c.m21 * a + c.m22 * h + c.m23 * p + c.m24 * D;
      b.m22 = V;
      b.m23 = v56;
      b.m24 = v57;
      b.m31 = c.m31 * a + c.m32 * h + c.m33 * p + c.m34 * D;
      b.m32 = v58;
      b.m33 = v59;
      b.m34 = v60;
      b.m41 = c.m41 * a + c.m42 * h + c.m43 * p + c.m44 * D;
      b.m42 = e;
      b.m43 = f;
      b.m44 = g;
      return b;
    }
    compute2DTransform(a) {
      if ((a.flags & 64) > 0) {
        a.update2DComposite();
      }
      var b = a.compositeM;
      a = b.m11;
      var c = b.m12;
      var d = b.m14;
      let e = b.m21;
      let f = b.m22;
      let g = b.m24;
      b = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      let h = this.camera.worldM;
      let m = h.m11 * c + h.m12 * f;
      let n = h.m11 * d + h.m12 * g + h.m14;
      c = h.m21 * c + h.m22 * f;
      d = h.m21 * d + h.m22 * g + h.m24;
      b.m11 = h.m11 * a + h.m12 * e;
      b.m12 = m;
      b.m14 = n;
      b.m21 = h.m21 * a + h.m22 * e;
      b.m22 = c;
      b.m24 = d;
      return b;
    }
    drawEffect(a) {
      a.update(this);
      let b = this.programFor(a.type, this.currentVisual.type);
      if (b != null) {
        this.info.effect = a;
        this.info.visual = this.currentVisual;
        b.render(this.info);
      }
    }
    getRenderState(a) {
      return this.activeStates[a];
    }
    setRenderState(a) {
      if (this.stateMask != 0) {
        var b = this.activeStates;
        for (var c = 0, d = this.stateMask, e = this.renderFlags; c < 7;) {
          if ((d & 1 << c) == 0) {
            ++c;
            continue;
          }
          let f = a.stateSlots[c];
          if (f != null) {
            if (f.key != b[c].key) {
              b[c] = f;
              e |= 1 << c;
              f.set(this);
            }
          } else if ((e & 1 << c) > 0) {
            f = this.defaultStates[c];
            b[c] = f;
            f.set(this);
            e &= ~(1 << c);
          }
          ++c;
        }
        this.renderFlags = e;
      }
    }
    applyAlpha() {}
    applyCullFace() {}
    applyDepth() {}
    applyBlend() {}
    applyColorTransform() {}
    applyClip() {}
    depthOf(a) {
      return a.localT.translate.z * -0.001;
    }
  }
  Renderer.i = true;
  Object.assign(Renderer.prototype, {
    l: Renderer
  });
  class CanvasRenderer extends Renderer {
    constructor() {
      function a() {
        let c = window.document.createElement("canvas").getContext("2d", {
          alpha: true,
          willReadFrequently: true
        });
        c.canvas.width = 1024;
        c.canvas.height = 1024;
        return c;
      }
      super("2d");
      this.pixelPadding = 0;
      this.currentCtx = this.context = null;
      this.colorTransformValue = new ColorTransform();
      this.globalAlpha = 1;
      this.currentClip = this.mode = null;
      this.clipInvert = false;
      this.clipDepth = 0;
      this.scratchM = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.globalCompositeOperation = null;
      var b = this.blendModeMap = Array(5);
      b[0] = "source-over";
      b[1] = "source-over";
      b[2] = "multiply";
      b[3] = "lighter";
      b[4] = "screen";
      this.ctxPool = [null];
      for (b = 0; b < 3;) {
        ++b;
        let c = a();
        this.ctxPool.push(c);
      }
      this.clipOffscreen = a();
      new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
    }
    attachWindow(a) {
      super.attachWindow(a);
      this.context = a.getContext();
      this.ctxPool[0] = this.context;
    }
    clear(a) {
      super.clear();
      if (a == null) {
        a = this.clearColor;
      }
      var b = this.window;
      let c = this.viewport;
      let d = b.size.x * c.x | 0;
      let e = b.size.y * c.y | 0;
      let f = b.size.x * c.w | 0;
      b = b.size.y * c.h | 0;
      this.clearRect(d, e, f, b);
      if (a.w != 0) {
        this.setFillStyle("rgba(" + ((a.x * 255 | 0) & 255) + "," + ((a.y * 255 | 0) & 255) + "," + ((a.z * 255 | 0) & 255) + "," + a.w.toFixed(2) + ")");
        this.fillRect(d, e, f, b);
      }
    }
    beginFrame() {
      if (!super.beginFrame()) {
        return false;
      }
      this.currentCtx = this.context;
      try {
        this.context.reset();
      } catch (a) {}
      this.currentCtx.fillStyle = "#000000";
      this.globalAlpha = 1;
      this.resetViewport();
      this.context.save();
      this.resetContextDefaults();
      return true;
    }
    endFrame() {
      for (super.endFrame(); this.clipDepth > 0;) {
        this.currentCtx.restore();
        this.clipDepth--;
      }
      this.context.restore();
    }
    setViewport(a, b, c, d) {
      super.setViewport(a, b, c, d);
      for (this.resetContextDefaults(); this.clipDepth > 0;) {
        this.currentCtx.restore();
        this.clipDepth--;
      }
      this.resetTransform();
      if (a != 0 || b != 0 || c != 1 || d != 1) {
        a = new Path2D();
        b = this.window;
        c = this.viewport;
        a.rect(b.size.x * c.x | 0, b.size.y * c.y | 0, b.size.x * c.w | 0, b.size.y * c.h | 0);
        this.currentCtx.save();
        this.currentCtx.clip(a);
        this.clipDepth++;
      }
    }
    setCamera(a) {
      super.setCamera(a);
      this.resetContextDefaults();
    }
    drawVisual(a) {
      var b = a.effect;
      if (b != null && b.enabled && a.visibility != 1) {
        if ((a.flags & 4) > 0) {
          this.currentVisual = a;
          a = this.globalAlpha;
          this.globalAlpha = 0.75;
          this.drawEffect(b);
          this.globalAlpha = a;
        } else {
          this.currentVisual = a;
          this.setRenderState(a);
          if (this.currentClip == null) {
            this.drawEffect(b);
          } else {
            this.programFor(a.effect.type, a.type);
            a = this.window.size.x;
            var c = this.window.size.y;
            this.currentCtx = this.clipOffscreen;
            this.resizeOffscreen(a, c);
            this.drawEffect(b);
            this.setCompositeOp(this.clipInvert ? "destination-out" : "destination-in");
            b = this.renderFlags;
            this.renderFlags = 0;
            var d = this.currentVisual;
            this.currentVisual = this.currentClip;
            this.drawEffect(this.currentClip.effect);
            this.renderFlags = b;
            this.currentVisual = d;
            b = this.currentCtx.canvas;
            this.currentCtx = this.context;
            this.setCompositeOp("source-over");
            this.resetTransform();
            this.currentCtx.drawImage(b, 0, 0, a, c, 0, 0, a, c);
          }
        }
      }
    }
    computeClipMatrix(a) {
      if ((a.flags & 240) > 0) {
        a.updateComposite();
      }
      var b = a.compositeM;
      a = b.m11;
      let c = b.m12;
      let d = b.m13;
      let e = b.m14;
      let f = b.m21;
      let g = b.m22;
      let h = b.m23;
      let m = b.m24;
      let n = b.m31;
      let q = b.m32;
      let p = b.m33;
      let v = b.m34;
      let u = b.m41;
      let A = b.m42;
      let D = b.m43;
      b = b.m44;
      var B = this.camera.worldM;
      let K = this.invViewProjM;
      let E = this.scratchM;
      let v62 = E.m11 * B.m11 + E.m12 * B.m21 + E.m13 * B.m31 + E.m14 * B.m41;
      let v63 = E.m11 * B.m12 + E.m12 * B.m22 + E.m13 * B.m32 + E.m14 * B.m42;
      let V = E.m11 * B.m13 + E.m12 * B.m23 + E.m13 * B.m33 + E.m14 * B.m43;
      let v64 = E.m11 * B.m14 + E.m12 * B.m24 + E.m13 * B.m34 + E.m14 * B.m44;
      let v65 = E.m21 * B.m11 + E.m22 * B.m21 + E.m23 * B.m31 + E.m24 * B.m41;
      let v66 = E.m21 * B.m12 + E.m22 * B.m22 + E.m23 * B.m32 + E.m24 * B.m42;
      let v67 = E.m21 * B.m13 + E.m22 * B.m23 + E.m23 * B.m33 + E.m24 * B.m43;
      let v68 = E.m21 * B.m14 + E.m22 * B.m24 + E.m23 * B.m34 + E.m24 * B.m44;
      let v69 = E.m31 * B.m11 + E.m32 * B.m21 + E.m33 * B.m31 + E.m34 * B.m41;
      let v70 = E.m31 * B.m12 + E.m32 * B.m22 + E.m33 * B.m32 + E.m34 * B.m42;
      let v71 = E.m31 * B.m13 + E.m32 * B.m23 + E.m33 * B.m33 + E.m34 * B.m43;
      let v72 = E.m31 * B.m14 + E.m32 * B.m24 + E.m33 * B.m34 + E.m34 * B.m44;
      let v73 = E.m41 * B.m11 + E.m42 * B.m21 + E.m43 * B.m31 + E.m44 * B.m41;
      let v74 = E.m41 * B.m12 + E.m42 * B.m22 + E.m43 * B.m32 + E.m44 * B.m42;
      let v75 = E.m41 * B.m13 + E.m42 * B.m23 + E.m43 * B.m33 + E.m44 * B.m43;
      B = E.m41 * B.m14 + E.m42 * B.m24 + E.m43 * B.m34 + E.m44 * B.m44;
      K.m11 = v62 * a + v63 * f + V * n + v64 * u;
      K.m12 = v62 * c + v63 * g + V * q + v64 * A;
      K.m13 = v62 * d + v63 * h + V * p + v64 * D;
      K.m14 = v62 * e + v63 * m + V * v + v64 * b;
      K.m21 = v65 * a + v66 * f + v67 * n + v68 * u;
      K.m22 = v65 * c + v66 * g + v67 * q + v68 * A;
      K.m23 = v65 * d + v66 * h + v67 * p + v68 * D;
      K.m24 = v65 * e + v66 * m + v67 * v + v68 * b;
      K.m31 = v69 * a + v70 * f + v71 * n + v72 * u;
      K.m32 = v69 * c + v70 * g + v71 * q + v72 * A;
      K.m33 = v69 * d + v70 * h + v71 * p + v72 * D;
      K.m34 = v69 * e + v70 * m + v71 * v + v72 * b;
      K.m41 = v73 * a + v74 * f + v75 * n + B * u;
      K.m42 = v73 * c + v74 * g + v75 * q + B * A;
      K.m43 = v73 * d + v74 * h + v75 * p + B * D;
      K.m44 = v73 * e + v74 * m + v75 * v + B * b;
      return K;
    }
    compute2DTransform(a) {
      if ((a.flags & 64) > 0) {
        a.update2DComposite();
      }
      var b = a.compositeM;
      a = b.m11;
      let c = b.m12;
      var d = b.m14;
      let e = b.m21;
      let f = b.m22;
      let g = b.m24;
      b = this.viewProjM;
      let h = this.scratchM;
      let m = this.camera.worldM;
      let n = h.m11 * m.m11 + h.m12 * m.m21;
      let q = h.m11 * m.m12 + h.m12 * m.m22;
      let p = h.m21 * m.m11 + h.m22 * m.m21;
      let v = h.m21 * m.m12 + h.m22 * m.m22;
      let u = n * d + q * g + (h.m11 * m.m14 + h.m12 * m.m24 + h.m14);
      d = p * d + v * g + (h.m21 * m.m14 + h.m22 * m.m24 + h.m24);
      b.m11 = n * a + q * e;
      b.m12 = n * c + q * f;
      b.m14 = u;
      b.m21 = p * a + v * e;
      b.m22 = p * c + v * f;
      b.m24 = d;
      return b;
    }
    applyAlpha(a) {
      this.setGlobalAlpha(a.alpha);
    }
    applyBlend(a) {
      this.mode = a.mode;
      this.context.globalCompositeOperation = this.blendModeMap[this.mode];
    }
    applyColorTransform(a) {
      this.colorTransformValue = a.transform;
    }
    applyClip(a) {
      this.currentClip = a.visual;
      this.clipInvert = a.invert;
      let b = a.corners;
      if (b != null) {
        this.currentCtx.save();
        this.resetTransform();
        this.clipDepth++;
        a = this.compute2DTransform(a.owner.worldT);
        let e = new Path2D();
        var c = b[0];
        var d = new Vec4(a.m11 * c.x + a.m12 * c.y + a.m14, a.m21 * c.x + a.m22 * c.y + a.m24, 0, 1);
        e.moveTo(d.x, d.y);
        for (c = 1; c < b.length;) {
          d = b[c++];
          let f = a;
          d = new Vec4(f.m11 * d.x + f.m12 * d.y + f.m14, f.m21 * d.x + f.m22 * d.y + f.m24, 0, 1);
          e.lineTo(d.x, d.y);
        }
        e.closePath();
        this.currentCtx.clip(e);
      } else if (this.clipDepth > 0) {
        this.currentCtx.restore();
      }
    }
    resetContextDefaults() {
      let a = this.window;
      let b = this.viewport;
      let c = (a.size.x * b.w | 0) / 2;
      let d = (a.size.y * b.h | 0) / 2;
      if (this.window.BS) {
        c |= 0;
        d |= 0;
      }
      let e = this.scratchM;
      e.m11 = c;
      e.m12 = 0;
      e.m13 = 0;
      e.m14 = c + (a.size.x * b.x | 0);
      e.m21 = 0;
      e.m22 = -d;
      e.m23 = 0;
      e.m24 = d + (a.size.y * b.y | 0);
    }
    createNativeTexture(a) {
      return new TextureWrapper(this, a);
    }
    setGlobalAlpha(a) {
      this.globalAlpha = a;
      this.context.globalAlpha = a;
    }
    selectCtx(a) {
      this.currentCtx = this.ctxPool[a];
    }
    resizeOffscreen(a, b) {
      let c = this.currentCtx.canvas;
      let d = c.width;
      let e = c.height;
      let f = false;
      let g = this.window.size;
      if (d > g.x || e > g.y) {
        c.width = g.x;
        c.height = g.y;
      }
      if (d < a || e < b) {
        f = true;
      } else {
        try {
          this.currentCtx.reset();
        } catch (h) {
          f = true;
        }
      }
      if (f) {
        c.width = a;
        c.height = b;
      }
    }
    drawImage(a, b, c, d, e, f, g, h, m) {
      this.currentCtx.drawImage(a, b, c, d, e, f, g, h, m);
    }
    setFillStyle(a) {
      this.currentCtx.fillStyle = a;
    }
    setStrokeStyle(a) {
      this.currentCtx.strokeStyle = a;
    }
    setCompositeOp(a) {
      let b = this.currentCtx;
      if (b.globalCompositeOperation != a) {
        b.globalCompositeOperation = a;
      }
    }
    resetTransform() {
      this.currentCtx.setTransform(1, 0, 0, 1, 0, 0);
    }
    setTransformFromNode(a) {
      a = this.compute2DTransform(a);
      this.currentCtx.setTransform(a.m11, a.m21, a.m12, a.m22, a.m14, a.m24);
    }
    clearRect(a, b, c, d) {
      this.currentCtx.clearRect(a, b, c, d);
    }
    fillRect(a, b, c, d) {
      this.currentCtx.fillRect(a, b, c, d);
    }
    composeColorTransformLayer(a, b, c, d, e) {
      this.currentCtx.globalAlpha = 1;
      var f = this.getRenderState(2);
      this.selectCtx(1);
      this.resizeOffscreen(d, e);
      this.setCompositeOp("copy");
      var g = f.transform;
      var h = g.mul;
      f = g.offset;
      switch (g.hint) {
        case 0:
          this.drawImage(a, b, c, d, e, 0, 0, d, e);
          this.applyColorTransformPixels(this.currentCtx, g, d, e);
          break;
        case 1:
          this.currentCtx.globalAlpha = g.mul.w;
          this.drawImage(a, b, c, d, e, 0, 0, d, e);
          break;
        case 2:
          var m = 1 - h.x;
          f = f.x == 0 ? h = g = 0 : h = g = 1;
          this.setFillStyle("rgba(" + ((g * 255 | 0) & 255) + "," + ((h * 255 | 0) & 255) + "," + ((f * 255 | 0) & 255) + "," + m.toFixed(2) + ")");
          this.fillRect(0, 0, d, e);
          this.setCompositeOp("destination-atop");
          this.drawImage(a, b, c, d, e, 0, 0, d, e);
          break;
        case 3:
          m = 1 - h.x;
          g = f.x / m;
          h = f.y / m;
          f = f.z / m;
          this.setFillStyle("rgba(" + ((g * 255 | 0) & 255) + "," + ((h * 255 | 0) & 255) + "," + ((f * 255 | 0) & 255) + "," + m.toFixed(2) + ")");
          this.fillRect(0, 0, d, e);
          this.setCompositeOp("destination-atop");
          this.drawImage(a, b, c, d, e, 0, 0, d, e);
      }
      a = this.currentCtx.canvas;
      this.selectCtx(0);
      return a;
    }
    composeMultiplyLayer(a, b, c, d, e) {
      this.selectCtx(2);
      this.resizeOffscreen(d, e);
      this.setFillStyle(vLS000000);
      this.fillRect(0, 0, d, e);
      this.currentCtx.globalAlpha = this.globalAlpha;
      this.setCompositeOp("screen");
      this.drawImage(a, b, c, d, e, 0, 0, d, e);
      this.fillRect(0, 0, d, e);
      a = this.currentCtx.canvas;
      this.selectCtx(0);
      return a;
    }
    applyColorTransformPixels(a, b, c, d) {
      c = a.getImageData(0, 0, c, d);
      d = c.data;
      let e = 0;
      let f = d.length;
      var g = b.mul;
      var h = b.offset;
      b = g.x;
      let m = g.y;
      let n = g.z;
      g = g.w;
      let q = h.x;
      let p = h.y;
      let v = h.z;
      h = h.w;
      let u;
      while (e < f) {
        u = d[e + 3];
        d[e] = (d[e] / u * b + q) * 255;
        ++e;
        d[e] = (d[e] / u * m + p) * 255;
        ++e;
        d[e] = (d[e] / u * n + v) * 255;
        ++e;
        d[e] = (u / 255 * g + h) * 255;
        ++e;
      }
      a.putImageData(c, 0, 0);
    }
    setSmoothing(a) {
      this.currentCtx.imageSmoothingEnabled = a;
    }
  }
  CanvasRenderer.i = true;
  CanvasRenderer.s = Renderer;
  Object.assign(CanvasRenderer.prototype, {
    l: CanvasRenderer
  });
  class WebGLRenderer extends Renderer {
    constructor() {
      super("webgl");
      this.gl = null;
      this.currentAlpha = 1;
      this.colorTransformValue = new ColorTransform();
      this.stencilState = this.stencilMask = this.currentProgram = null;
      this.programsList = new ArrayList();
    }
    attachWindow(a) {
      super.attachWindow(a);
      this.gl = a.getContext();
      this.resetViewport();
    }
    clear(a) {
      super.clear();
      if (a == null) {
        a = this.clearColor;
      }
      this.gl.clearColor(a.x, a.y, a.z, a.w);
      this.gl.clear(17664);
    }
    beginFrame() {
      if (!super.beginFrame() || this.gl == null) {
        return false;
      }
      this.resetViewport();
      return true;
    }
    endFrame() {
      super.endFrame();
    }
    setViewport(a, b, c, d) {
      super.setViewport(a, b, c, d);
      if (a == 0 && b == 0 && c == 1 && d == 1) {
        this.gl.viewport(0, 0, this.window.size.x, this.window.size.y);
        this.gl.disable(3089);
      } else {
        d = this.window;
        var e = this.viewport;
        a = d.size.x * e.x | 0;
        b = d.size.x * e.w | 0;
        c = d.size.y * e.h | 0;
        d = (this.window.size.y | 0) - c - (d.size.y * e.y | 0);
        this.gl.viewport(a, d, b, c);
        this.gl.enable(3089);
        this.gl.scissor(a, d, b, c);
      }
    }
    applyAlpha(a) {
      this.currentAlpha = a.alpha;
    }
    applyCullFace(a) {
      if (a.enabled) {
        this.gl.enable(2884);
        this.gl.frontFace(a.frontCCW ? 2305 : 2304);
        this.gl.cullFace(1029);
      } else {
        this.gl.disable(2884);
      }
    }
    applyDepth(a) {
      if (a.enabled) {
        this.gl.enable(2929);
        this.gl.depthFunc(WebGLRenderer.DEPTH_FUNCS[a.compareFunc]);
      } else {
        this.gl.disable(2929);
        this.gl.depthFunc(513);
      }
    }
    applyBlend(a) {
      let b = 0;
      let c = 0;
      if (a.premultiplied) {
        switch (a.mode) {
          case 0:
            b = 1;
            c = 0;
            break;
          case 1:
            b = 1;
            c = 771;
            break;
          case 2:
            b = 774;
            c = 771;
            break;
          case 3:
            b = 770;
            c = 772;
            break;
          case 4:
            b = 1;
            c = 769;
            break;
          case 5:
            b = WebGLRenderer.BLEND_FUNCS[a.factorDst];
            c = WebGLRenderer.BLEND_FUNCS[a.factorSrc];
        }
      } else {
        switch (a.mode) {
          case 0:
            b = 1;
            c = 0;
            break;
          case 1:
            b = 770;
            c = 771;
            break;
          case 2:
            b = 774;
            c = 771;
            break;
          case 3:
            c = b = 1;
            break;
          case 4:
            b = 770;
            c = 1;
            break;
          case 5:
            b = WebGLRenderer.BLEND_FUNCS[a.factorDst];
            c = WebGLRenderer.BLEND_FUNCS[a.factorSrc];
        }
      }
      this.gl.enable(3042);
      this.gl.blendFunc(b, c);
      let d;
      switch (a.blendEquation) {
        case 1:
          d = 32774;
          break;
        case 2:
          d = 32778;
          break;
        case 3:
          d = 32779;
      }
      this.gl.blendEquation(d);
    }
    applyColorTransform(a) {
      this.colorTransformValue = a.transform;
    }
    applyClip(a) {
      a = a.corners;
      if (this.stencilState != null && a == null) {
        this.gl.disable(2960);
      }
      if (this.stencilState == null && a != null) {
        this.gl.clearStencil(0);
        this.gl.enable(2960);
        if (this.stencilMask == null) {
          this.stencilMask = new GLFillProgram(this);
        }
        this.stencilMask.uploadStencil(a);
      }
      this.stencilState = a;
    }
    submitBatch(a) {
      if (this.quadCap == 0) {
        super.submitBatch(a);
      } else {
        var b = a.iterator();
        var c = b.array[b.idx++];
        var d = this.programsList;
        d.reserve(a.count);
        d.clear();
        var e = d.array[d.count++] = c;
        a = c.stateMaskBits;
        var f = c.effect;
        f.update(this);
        this.info.effect = f;
        for (this.info.spriteData = d; b.idx < b.end;) {
          c = b.array[b.idx++];
          c.effect.update(this);
          let g = f.type == c.effect.type;
          if (g = (g = (g = (g = g && f.key == c.effect.key) && (a & 3) == (c.stateMaskBits & 3)) && ((a & 1) > 0 ? e.stateSlots[0].key == c.stateSlots[0].key : true)) && ((a & 2) > 0 ? e.stateSlots[1].key == c.stateSlots[1].key : true)) {
            d.array[d.count++] = c;
          } else {
            if (d.count == 1) {
              this.drawVisual(d.front());
            } else {
              a = d.array[0];
              a = this.programForFlipped(a.effect.type, a.type);
              if (a != null) {
                a.render(this.info);
              } else {
                a = d.array;
                f = 0;
                e = d.count;
                while (f < e) {
                  this.drawVisual(a[f++]);
                }
              }
            }
            d.clear();
            e = d.array[d.count++] = c;
            a = c.stateMaskBits;
            f = c.effect;
            f.update(this);
            this.info.effect = f;
            this.info.spriteData = d;
          }
        }
        if (d.count > 0) {
          if (d.count == 1) {
            this.drawVisual(d.front());
          } else {
            b = d.array[0];
            b = this.programForFlipped(b.effect.type, b.type);
            if (b != null) {
              b.render(this.info);
            } else {
              b = d.array;
              c = 0;
              d = d.count;
              while (c < d) {
                this.drawVisual(b[c++]);
              }
            }
          }
        }
      }
    }
    createNativeTexture(a) {
      return new WebGLTexture(this, a);
    }
  }
  WebGLRenderer.i = true;
  WebGLRenderer.s = Renderer;
  Object.assign(WebGLRenderer.prototype, {
    l: WebGLRenderer
  });

  class C226 {}
  C226.i = true;
  C226.Je = true;
  Object.assign(C226.prototype, {
    l: C226
  });
  class C227 {
    constructor() {
      this.visualType = this.getVisualType();
      this.effectType = this.getEffectType();
    }
    init() {}
    getVisualType() {
      return 201;
    }
    getEffectType() {
      throw 8;
    }
  }
  C227.i = true;
  C227.Ib = [C226];
  Object.assign(C227.prototype, {
    l: C227
  });

  class CanvasGradientLineRenderer extends C227 {
    constructor() {
      super();
    }
    render(a) {
      var b = a.renderer;
      let c = a.effect;
      this.ctx2d = a.renderer.window.getContext();
      this.ctx2d.lineWidth = 1;
      b.setTransformFromNode(a.visual.worldT);
      a = 0;
      for (b = c.points.length; a < b;) {
        var d = a++;
        this.ctx2d.globalAlpha = c.alphas[d];
        this.ctx2d.lineWidth = c.radius * 2;
        let f = new Path2D();
        let g = c.points[d];
        d = c.colorLists[d];
        let h = 0;
        let m = g.length;
        while (h < m) {
          let n = h++;
          var e = d[n];
          this.ctx2d.strokeStyle = "rgba(" + ((e.x * 255 | 0) & 255) + "," + ((e.y * 255 | 0) & 255) + "," + ((e.z * 255 | 0) & 255) + "," + e.w.toFixed(2) + ")";
          e = g[n].x;
          let q = g[n].y;
          if (n == 0) {
            f.moveTo(e, q);
          } else {
            f.lineTo(e, q);
          }
        }
        this.ctx2d.stroke(f);
      }
    }
    getEffectType() {
      return 705;
    }
  }
  CanvasGradientLineRenderer.i = true;
  CanvasGradientLineRenderer.s = C227;
  Object.assign(CanvasGradientLineRenderer.prototype, {
    l: CanvasGradientLineRenderer
  });
  class CanvasSolidColorRenderer extends C227 {
    constructor() {
      super();
    }
    render(a) {
      let b = a.renderer;
      var c = a.effect;
      var d = a.visual;
      b.setTransformFromNode(a.visual.worldT);
      a = c.color;
      if ((b.renderFlags & 4) > 0) {
        var e = b.colorTransformValue;
        c = c.color;
        a = e.mul;
        let f = e.offset;
        e = c.x * a.x + f.x;
        let g = c.y * a.y + f.y;
        let h = c.z * a.z + f.z;
        c = c.w * a.w + f.w;
        a = new Vec4(e < 0 ? 0 : e > 1 ? 1 : e, g < 0 ? 0 : g > 1 ? 1 : g, h < 0 ? 0 : h > 1 ? 1 : h, c < 0 ? 0 : c > 1 ? 1 : c);
      }
      b.setGlobalAlpha(b.globalAlpha);
      b.setFillStyle("rgba(" + ((a.x * 255 | 0) & 255) + "," + ((a.y * 255 | 0) & 255) + "," + ((a.z * 255 | 0) & 255) + "," + a.w.toFixed(2) + ")");
      d = d.size;
      b.fillRect(0, 0, d.x, d.y);
    }
    getEffectType() {
      return 1205;
    }
    getVisualType() {
      return 401;
    }
  }
  CanvasSolidColorRenderer.i = true;
  CanvasSolidColorRenderer.s = C227;
  Object.assign(CanvasSolidColorRenderer.prototype, {
    l: CanvasSolidColorRenderer
  });
  class CanvasClearRenderer extends C227 {
    constructor() {
      super();
    }
    render(a) {
      let b = a.renderer;
      var c = a.effect;
      var d = b.window.size;
      a = d.x;
      d = d.y;
      b.resetTransform();
      b.setGlobalAlpha(b.globalAlpha);
      let e = 0;
      let f = 0;
      let g = c.mesh;
      if (g != null) {
        e = g.left;
        f = g.top;
        a = g.right - g.left;
        d = g.bottom - g.top;
      }
      c = c.color;
      b.setFillStyle("rgba(" + ((c.x * 255 | 0) & 255) + "," + ((c.y * 255 | 0) & 255) + "," + ((c.z * 255 | 0) & 255) + "," + c.w.toFixed(2) + ")");
      b.fillRect(e, f, a, d);
    }
    getEffectType() {
      return 305;
    }
  }
  CanvasClearRenderer.i = true;
  CanvasClearRenderer.s = C227;
  Object.assign(CanvasClearRenderer.prototype, {
    l: CanvasClearRenderer
  });
  class CanvasMultiLineRenderer extends C227 {
    constructor() {
      super();
    }
    init(a) {
      super.init(a);
    }
    render(a) {
      let b = a.renderer;
      var c = a.effect;
      this.ctx2d = a.renderer.window.getContext();
      b.setTransformFromNode(a.visual.worldT);
      a = 0;
      for (c = c.lt; a < c.length;) {
        this.drawPathStrip(c[a++]);
      }
    }
    drawPathStrip(a) {
      let b = a[0];
      if (a.length != 0) {
        var c = new Path2D();
        c.moveTo(b.x, b.y);
        for (var d = 1, e = a.length; d < e;) {
          b = a[d];
          c.lineTo(b.x, b.y);
          d += 2;
        }
        for (d = a.length - 2; d >= 0;) {
          b = a[d];
          c.lineTo(b.x, b.y);
          d -= 2;
        }
        c.closePath();
        this.ctx2d.fillStyle = "#ffffffff";
        this.ctx2d.fill(c);
      }
    }
    getEffectType() {
      return 1105;
    }
  }
  CanvasMultiLineRenderer.i = true;
  CanvasMultiLineRenderer.s = C227;
  Object.assign(CanvasMultiLineRenderer.prototype, {
    l: CanvasMultiLineRenderer
  });
  class CanvasDashedCircleRenderer extends C227 {
    constructor() {
      super();
    }
    render(a) {
      var b = a.effect;
      a.renderer.setTransformFromNode(a.visual.worldT);
      a = a.renderer.window.getContext();
      a.lineWidth = b.lineWidth;
      a.globalAlpha = 1;
      var c = b.color;
      a.strokeStyle = "rgba(" + ((c.x * 255 | 0) & 255) + "," + ((c.y * 255 | 0) & 255) + "," + ((c.z * 255 | 0) & 255) + "," + c.w.toFixed(2) + ")";
      c = b.Uo;
      let d = Math.PI * 2;
      let e = d / c;
      let f = b.center.x;
      let g = b.center.y;
      b = b.radius;
      let h = 0;
      while (h < c) {
        var m = h++;
        if ((m & 1) != 1) {
          m = m / c * d;
          a.beginPath();
          a.arc(f, g, b, m, m + e, false);
          a.stroke();
          a.closePath();
        }
      }
    }
    getEffectType() {
      return 605;
    }
  }
  CanvasDashedCircleRenderer.i = true;
  CanvasDashedCircleRenderer.s = C227;
  Object.assign(CanvasDashedCircleRenderer.prototype, {
    l: CanvasDashedCircleRenderer
  });
  class CanvasCircleStrokeRenderer extends C227 {
    constructor() {
      super();
    }
    render(a) {
      let b = a.effect;
      a.renderer.setTransformFromNode(a.visual.worldT);
      a = a.renderer.window.getContext();
      a.lineWidth = b.lineWidth;
      a.globalAlpha = b.opacity;
      a.strokeStyle = "#ffffff";
      a.beginPath();
      a.arc(0, 0, b.radius + b.lineWidth / 2, 0, Math.PI * 2, false);
      a.stroke();
      a.closePath();
    }
    getEffectType() {
      return 905;
    }
  }
  CanvasCircleStrokeRenderer.i = true;
  CanvasCircleStrokeRenderer.s = C227;
  Object.assign(CanvasCircleStrokeRenderer.prototype, {
    l: CanvasCircleStrokeRenderer
  });

  class CanvasTextRenderer extends C227 {
    constructor() {
      super();
    }
    render(a) {
      let b = a.renderer;
      let c = a.effect;
      var d = c.texture;
      if (d.isReady()) {
        var e = d.image.data;
        var f = d.size.x;
        var g = d.size.y;
        var h = b.globalAlpha;
        b.setSmoothing((d.flags & 8) > 0);
        if ((b.renderFlags & 4) > 0) {
          e = b.composeColorTransformLayer(e, 0, 0, f, g);
        }
        if ((b.renderFlags & 1) > 0 && b.mode == 0) {
          e = b.composeMultiplyLayer(e, 0, 0, f, g);
          h = 1;
        }
        b.setGlobalAlpha(h);
        b.selectCtx(0);
        b.setTransformFromNode(a.visual.worldT);
        g = c.layout.vertices;
        a = c.texture.frames.byId;
        d = g.array;
        f = 0;
        g = (g.count / 5 | 0) * 5;
        h = c.size;
        var m = h.x;
        var n = h.y;
        h = c.padding;
        var q = m - h;
        var p = n - h;
        var v = null;
        if (c.clip) {
          v = b.currentCtx;
          v.save();
          v.rect(h, h, m - h * 2, n - h * 2);
          v.clip();
        }
        for (m = c.multiline; f < g;) {
          var u = d[f++];
          n = d[f++];
          let A = d[f++];
          let D = d[f++];
          let B = f++;
          u = a[u].uvOffset;
          if (m) {
            if (A > p) {
              break;
            }
          } else if (n > q) {
            break;
          }
          if (n + D > h) {
            b.drawImage(e, u.x, u.y, u.w, u.h, n, A, D, d[B]);
          }
        }
        if (c.clip) {
          v.restore();
        }
      }
    }
    getEffectType() {
      return 505;
    }
    getVisualType() {
      return 401;
    }
  }
  CanvasTextRenderer.i = true;
  CanvasTextRenderer.s = C227;
  Object.assign(CanvasTextRenderer.prototype, {
    l: CanvasTextRenderer
  });
  class CanvasPathRenderer extends C227 {
    constructor() {
      super();
      this.tmpColor = new Vec4(0, 0, 0, 0);
      this.smoothing = false;
    }
    render(a) {
      var b = a.effect;
      let c = a.renderer;
      let d = (c.renderFlags & 1) > 0 && c.mode == 0 ? 1 : 0;
      let e = (c.renderFlags & 4) > 0 ? c.colorTransformValue : null;
      let f = b.AQ;
      let g = false;
      let h = false;
      let m = false;
      let n = 0;
      let q = b.Ju;
      let p = b.data;
      let v = 0;
      let u = 0;
      let A;
      b = b.Ku;
      if (b != 0) {
        var D = c.currentCtx;
        if (this.smoothing) {
          c.resetTransform();
        } else {
          a = c.compute2DTransform(a.visual.worldT);
          D.setTransform(a.m11, a.m21, a.m12, a.m22, a.m14, a.m24);
        }
        a = false;
        for (var B = new Path2D(); v < b;) {
          switch (q[v++]) {
            case 1:
              var K = p[u++];
              A = p[u++];
              B.moveTo(K, A);
              break;
            case 2:
              K = p[u++];
              A = p[u++];
              B.lineTo(K, A);
              break;
            case 3:
              u++;
              u++;
              B.closePath();
              break;
            case 4:
              c.setStrokeStyle(this.formatColor(p[u++], Math.min(p[u++] + d, 1), e));
              n = p[u++] | 0;
              D.lineWidth = n;
              m = h == 0;
              g = true;
              break;
            case 5:
              c.setFillStyle(this.formatColor(p[u++], Math.min(p[u++] + d, 1), e));
              m = g;
              h = true;
              break;
            case 6:
              g = false;
              c.setStrokeStyle(vLS000000);
              D.lineWidth = 1;
              break;
            case 7:
              h = false;
              c.setFillStyle(vLS000000);
              break;
            case 8:
              K = g && f && (n & 1) == 1;
              if (a) {
                if (!K) {
                  D.translate(-0.5, -0.5);
                  a = false;
                }
              } else if (K) {
                D.translate(0.5, 0.5);
                a = true;
              }
              if (g && h) {
                if (m) {
                  D.stroke(B);
                  D.fill(B);
                } else {
                  D.fill(B);
                  D.stroke(B);
                }
              } else if (g) {
                D.stroke(B);
              } else if (h) {
                D.fill(B);
              }
              if (v < b - 1) {
                B = new Path2D();
              }
              break;
            default:
              u = 0;
          }
        }
      }
    }
    getEffectType() {
      return 1005;
    }
    formatColor(a, b, c) {
      if (c != null) {
        var d = this.tmpColor;
        d.x = (a >> 16 & 255) / 255;
        d.y = (a >> 8 & 255) / 255;
        d.z = (a & 255) / 255;
        d.w = b;
        a = c.mul;
        c = c.offset;
        let e = d;
        d = e.x * a.x + c.x;
        b = e.y * a.y + c.y;
        let f = e.z * a.z + c.z;
        a = e.w * a.w + c.w;
        d = new Vec4(d < 0 ? 0 : d > 1 ? 1 : d, b < 0 ? 0 : b > 1 ? 1 : b, f < 0 ? 0 : f > 1 ? 1 : f, a < 0 ? 0 : a > 1 ? 1 : a);
        return "rgba(" + ((d.x * 255 | 0) & 255) + "," + ((d.y * 255 | 0) & 255) + "," + ((d.z * 255 | 0) & 255) + "," + d.w.toFixed(2) + ")";
      }
      a |= (b * 255 | 0) << 24;
      c = HexLookup.BYTES;
      return "#" + c[a >> 16 & 255] + c[a >> 8 & 255] + c[a & 255] + c[a >>> 24];
    }
  }
  CanvasPathRenderer.i = true;
  CanvasPathRenderer.s = C227;
  Object.assign(CanvasPathRenderer.prototype, {
    l: CanvasPathRenderer
  });

  class HexLookup {}
