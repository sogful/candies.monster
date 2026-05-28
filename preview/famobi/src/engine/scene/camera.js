  // LevelCamera - level-scoped camera tracker. Wraps the renderer's
  // Camera and resizes / centres it based on `bounds` (the world rect
  // the level wants to show). `pivotBias` is the on-screen pivot
  // (0..1) used by the scroll logic to lean the camera toward one
  // side. `target` is the current world-space point the camera
  // follows.
  class LevelCamera {
    constructor() {
      this.pivotBias = new Vec4(0.5, 0.5, 0, 1);
      this.target = new Vec4(0, 0, 0, 1);
      this.bounds = new Bounds(vInfinity, vInfinity, vNegInfinity, vNegInfinity);
      this.camera = new Camera();
    }
    // isOnScreen - culling test. Projects (worldX, worldY) into the
    // viewport via pk and returns false if the point sits more than
    // ~400px outside the viewport rect (with asymmetric slack: 400px
    // top/left, 200px bottom/right to match the original engine).
    isOnScreen(worldX, worldY) {
      let win = Application.instance.window;
      let viewport = win.renderer.viewport;
      let screenW = win.canvasSize.x;
      let screenH = win.canvasSize.y;
      let vpX = viewport.x * screenW | 0;
      let vpY = viewport.y * screenH | 0;
      let vpW = viewport.w * screenW | 0;
      let vpH = viewport.h * screenH | 0;
      let m = this.camera.worldM;
      let invW = 1 / (m.m41 * worldX + m.m42 * worldY + m.m43 * 0 + m.m44);
      let halfW = vpW / 2;
      let halfH = vpH / 2;
      let nx = (m.m11 * worldX + m.m12 * worldY + m.m13 * 0 + m.m14) * invW;
      let ny = (m.m21 * worldX + m.m22 * worldY + m.m23 * 0 + m.m24) * invW;
      let screenX = halfW * nx + ny * 0 + (halfW + vpX);
      let screenY = nx * 0 + -halfH * ny + (halfH + vpY);
      if (screenX + 400 < 0 || screenY + 400 < 0 || screenX - 200 > vpX + vpW || screenY - 200 > vpY + vpH) {
        return false;
      } else {
        return true;
      }
    }
    // distToVerticalEdge - distance from a world point to whichever
    // horizontal viewport edge (top or bottom) is closer, in pixels.
    // Used by the scroll logic to decide when to scroll vertically.
    distToVerticalEdge(worldX, worldY) {
      let viewport = Application.instance.window.viewportRect();
      let screen = this.camera.projectPoint(new Vec4(worldX, worldY, 0, 1), viewport);
      return Math.min(screen.y, viewport.y + viewport.h - screen.y);
    }
    // distToHorizontalEdge - same as above but for vertical viewport
    // edges (left / right). Used for horizontal scroll.
    distToHorizontalEdge(worldX, worldY) {
      let viewport = Application.instance.window.viewportRect();
      let screen = this.camera.projectPoint(new Vec4(worldX, worldY, 0, 1), viewport);
      return Math.min(screen.x, viewport.x + viewport.w - screen.x);
    }
    // update - resize the wrapped Camera so `bounds` fits the
    // viewport, then offset the camera by the pivot bias so the
    // tracking target sits at the requested screen position.
    update() {
      let viewportSize = Application.instance.window.viewportSize();
      let b = this.bounds;
      let scale = Math.min(viewportSize.x / (b.right - b.left), viewportSize.y / (b.bottom - b.top));
      this.camera.setSize(new Vec4(viewportSize.x, viewportSize.y, 0, 1));
      this.camera.setZoom(scale);
      this.camera.centerPivot();
      let aspectFitBounds = new Bounds(0, 0, viewportSize.x, viewportSize.y).fitAspect((b.right - b.left) / (b.bottom - b.top));
      let slackX = (viewportSize.x - (aspectFitBounds.right - aspectFitBounds.left)) / scale / 2;
      let slackY = (viewportSize.y - (aspectFitBounds.bottom - aspectFitBounds.top)) / scale / 2;
      let cam = this.camera;
      cam.position.x = this.target.x + (slackX + (-slackX - slackX) * this.pivotBias.x);
      cam.position.y = this.target.y + (slackY + (-slackY - slackY) * this.pivotBias.y);
      cam.rebuild();
    }
  }
  LevelCamera.i = true;
  Object.assign(LevelCamera.prototype, {
    l: LevelCamera
  });
