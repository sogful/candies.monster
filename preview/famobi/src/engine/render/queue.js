  // RenderQueue - per-renderer draw queue. `camera` is the active
  // Camera assigned via setCamera(); drawList is the main batched-draw list (sized
  // 1024 with reusableIter so it grows in-place); auxList is the auxiliary list
  // used for operations queued outside the main batch.
  class RenderQueue {
    constructor() {
      this.camera = null;
      this.drawList = new ArrayList(1024);
      this.drawList.reusableIter = true;
      this.stack = new Stack();
      this.auxList = new ArrayList();
    }
    // wk - set the active camera for this queue.
    setCamera(camera) {
      this.camera = camera;
    }
  }
  RenderQueue.i = true;
  Object.assign(RenderQueue.prototype, {
    l: RenderQueue
  });

  // RenderStateCollector - groups a node's effective render states into
  // 7 type-indexed buckets (one Stack per state type) so the renderer
  // can apply / restore them in O(1). Vs is the bucket array; MD is a
  // scratch stack for walking ancestors. Static so allocations are
  // amortised across every node draw.
  class RenderStateCollector {
    // kM - reset every bucket's length to 0 (cheap: the underlying
    // arrays stay sized).
    static kM() {
      let i = 0;
      while (i < 7) {
        RenderStateCollector.Vs[i++].count = 0;
      }
    }
    // bR - collect render states for `node`. Walks parents into a
    // temp stack, drains it in root->leaf order so each ancestor can
    // push its own states (dR), then folds in the node's own first
    // level child states (Qd linked list). Returns the bucket array.
    static bR(node) {
      if (RenderStateCollector.Vs == null) {
        RenderStateCollector.initBuckets();
      }
      let buckets = RenderStateCollector.Vs;
      let tmpStack = RenderStateCollector.MD;
      var walker = node;
      // push every ancestor onto the temp stack (leaf-first order)
      for (tmpStack.clear(); walker.parent != null;) {
        var parent = walker.parent;
        if (tmpStack.count == tmpStack.capacity) {
          tmpStack.grow();
        }
        tmpStack.array[tmpStack.count++] = parent;
        walker = walker.parent;
      }
      // drain root->leaf so each ancestor applies its states in order
      let i = 0;
      for (let n = tmpStack.count; i < n;) {
        ++i;
        tmpStack.array[--tmpStack.count].pushStatesTo(buckets);
      }
      // append the node's own immediate-children states into the right
      // bucket by state type
      for (let child = node.firstState; child != null;) {
        let bucket = buckets[child.state.type];
        let state = child.state;
        if (bucket.count == bucket.capacity) {
          bucket.grow();
        }
        bucket.array[bucket.count++] = state;
        child = child.next;
      }
      tmpStack.clear(true);
      return buckets;
    }
    // uO - lazy-init the static buckets (7 type Stacks + the ancestor
    // walk scratch stack).
    static initBuckets() {
      RenderStateCollector.Vs = Array(7);
      let i = 0;
      while (i < 7) {
        RenderStateCollector.Vs[i++] = new Stack();
      }
      RenderStateCollector.MD = new Stack(16);
    }
  }
  RenderStateCollector.i = true;

  // RendererInfo - per-renderer scratch state. `renderer` is the
  // owning Renderer; `effect` / `visual` / `spriteData` are slots the
  // renderer fills in while walking the scene (effect = active GL
  // effect, visual = SceneGroup currently being drawn, spriteData =
  // current TextureDrawEffect frame source).
  class RendererInfo {
    constructor(renderer) {
      this.renderer = renderer;
      this.spriteData = this.visual = this.effect = null;
    }
  }
  RendererInfo.i = true;
  Object.assign(RendererInfo.prototype, {
    l: RendererInfo
  });
