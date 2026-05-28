  // SceneDirector - top-level scene host. Owns the back/front layers
  // (sandwiching the active scene stack), the shared shared-state
  // object `Ha` that travels with each scene push, and a Camera. Every
  // frame it sets the camera's viewport to the current window size,
  // hands it to the renderer, then walks the scene tree.
  class SceneDirector extends Node {
    constructor(application) {
      super();
      this.app = application;
      this.sharedState = {};
      this.back = new SceneRoot();
      this.front = new SceneRoot();
      this.camera = new Camera();
    }
    getWidth() {
      return this.app.window.viewportSize().x;
    }
    getHeight() {
      return this.app.window.viewportSize().y;
    }
    viewportSize() {
      return this.app.window.viewportSize();
    }
    viewportRect() {
      let size = this.app.window.viewportSize();
      return new Bounds(0, 0, size.x, size.y);
    }
    aspectRatio() {
      return this.app.window.aspectRatio();
    }
    update(dt) {
      this.camera.setSize(new Vec4(this.getWidth(), this.getHeight(), 0, 1));
      this.app.renderer.setCamera(this.camera);
      this.back.tickAnims(dt);
      super.update(dt);
      this.front.tickAnims(dt);
    }
    render(target) {
      let renderer = this.app.renderer;
      this.camera.setSize(new Vec4(this.getWidth(), this.getHeight(), 0, 1));
      renderer.setCamera(this.camera);
      this.back.updateTransforms();
      this.back.collectRenderStates();
      renderer.drawScene(this.back);
      super.render(target);
      this.front.updateTransforms();
      this.front.collectRenderStates();
      renderer.drawScene(this.front);
    }
    // push - push scene class `sceneClass`. `caller` is the source scene
    // (null for the very first push). `pushOver` if true keeps the
    // caller mounted underneath (e.g. modal pause overlay).
    //
    // Flow: instantiate the scene, ask it for its preload set; if
    // anything still has to be fetched, mount a CTRCLoadingScene (or
    // its bubble overlay variant for pushOver) and run the real push
    // only after the loader scene's xv() reports done.
    push(sceneClass, caller, pushOver) {
      function performPush() {
        if (pushOver) {
          caller.wrapper.addChild(new SceneWrapper(target));
          return director.addChild(new TransitionPushOver(caller, target));
        }
        let wrapper = new SceneWrapper(target);
        director.addChild(wrapper);
        if (currentWrapper == null) {
          return director.addChild(new TransitionPush(target));
        } else {
          return director.addChild(new TransitionReplace(caller, target));
        }
      }
      let target = Construct.create(sceneClass);
      target.director = this;
      target.app = this.app;
      target.caller = caller;
      if (caller == null) {
        target.sharedState = this.sharedState;
      }
      let currentWrapper = this.topWrapper();
      let director = this;
      if (target.preloadSet().length > 0) {
        let loader = target.makeLoader(performPush);
        loader.director = this;
        loader.app = this.app;
        // Skip the bubble loading overlay entirely if every preload
        // was already cached. eB() drops fully-loaded ids, but if any
        // remain unfetched ScriptDownload still hits the network. In
        // the common warmed-up case xv() reports done at construction
        // and the only thing the overlay would contribute is a ~0.5s
        // fade in + fade out - which is exactly what looks "fake".
        if (loader.Zl != null && loader.Zl.isDone()) {
          performPush();
        } else {
          let wrapper = new SceneWrapper(loader);
          if (currentWrapper == null) {
            this.addChild(wrapper);
            this.addChild(new TransitionPush(loader));
          } else {
            caller.wrapper.addChild(wrapper);
            this.addChild(new TransitionPushOver(caller, loader));
          }
        }
      } else {
        performPush();
      }
    }
    // pop - pop scene `scene`. If it has no parent above the director
    // it's a clean exit; otherwise pop back to its parent and propagate
    // `caller` so the destination scene knows who returned to it.
    pop(scene) {
      if ((scene.wrapper.parent instanceof SceneDirector ? null : scene.wrapper.parent) == null) {
        this.addChild(new TransitionExit(scene));
      } else {
        scene.wrapper.parent.scene.caller = scene;
        this.addChild(new TransitionPopBack(scene));
      }
    }
    // topWrapper - find the topmost mounted SceneWrapper in the
    // director's animation/queue list (Me is the head, Y the link).
    topWrapper() {
      let cursor = this.firstChild;
      while (cursor != null) {
        if (cursor instanceof SceneWrapper) {
          return cursor;
        }
        cursor = cursor.nextSibling;
      }
      return null;
    }
  }
  SceneDirector.i = true;
  SceneDirector.s = Node;
  Object.assign(SceneDirector.prototype, {
    l: SceneDirector
  });
