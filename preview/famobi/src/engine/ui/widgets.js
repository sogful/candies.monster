  // HorizontalScroller - touch / mouse-wheel kinetic scroll container.
  // The wrapped node `j` slides between offsetX+min and offsetX+max.
  // State machine:
  //   vk        - committed scroll position (accumulated past drags)
  //   ng        - current drag delta (latest finger - press anchor)
  //   pg        - inertial impulse to apply this tick (wheel ticks
  //               write here, finger-release computes from velocity)
  //   vt        - smoothed inertial velocity (damped by Tn each tick)
  //   ap / $o   - overscroll past min / max respectively (positive)
  //   Dn / En   - "rubber-banding back" flags after overscroll
  //   Tn        - damping factor; bigger = more rebound force during
  //               an overscroll snap-back
  //   pl / Wv   - last two finger x positions (used to compute throw
  //               velocity on release)
  //   Ru        - finger anchor at press-down
  class HorizontalScroller extends Node {
    constructor(child, minOffset, maxOffset, offsetX) {
      super();
      this.container = child;
      this.min = minOffset;
      this.max = maxOffset;
      this.offsetX = offsetX;
      this.velocity = this.impulse = this.dragDelta = this.scrollX = 0;
      this.damping = 0.03;
      this.rebounceLeft = this.rebounceRight = false;
      this.overshootRight = this.overshootLeft = 0;
      this.prevLastX = this.lastX = INT16_MIN;
    }
    update() {
      let input = this.app.pointer();
      let wheel = this.app.mouseState().wheelDelta();
      if (wheel != 0) {
        this.impulse += (wheel > 0 ? 1 : wheel < 0 ? -1 : 0) * -10;
        this.damping = 0.05;
        this.rebounceLeft = this.rebounceRight = false;
      } else if (input.justPressed(0)) {
        // press-down: reset drag + inertia, anchor finger position
        this.dragDelta = 0;
        this.anchorX = this.prevLastX = this.lastX = input.position[0].x;
        this.impulse = this.velocity = 0;
        this.rebounceLeft = this.rebounceRight = false;
        this.damping = 0.03;
        this.time = 0;
      } else if (input.justReleased(0)) {
        // release: commit the drag, convert finger velocity to impulse
        this.scrollX += this.dragDelta;
        this.dragDelta = 0;
        this.impulse = this.lastX - this.prevLastX;
      } else {
        if (input.moved(0)) {
          // mid-drag: track finger
          this.prevLastX = this.lastX;
          this.lastX = input.position[0].x;
          this.dragDelta = this.lastX - this.anchorX;
        } else {
          if (this.rebounceRight) {
            // rubber-banding back from max overshoot
            if (this.overshootLeft * this.overshootLeft < 0.001) this.rebounceRight = false;
            else this.impulse += this.overshootLeft * 0.1;
          } else if (this.rebounceLeft) {
            if (this.overshootRight * this.overshootRight < 0.001) this.rebounceLeft = false;
            else this.impulse -= this.overshootRight * 0.1;
          } else if (this.overshootLeft < 0) {
            this.rebounceRight = true;
            this.damping = 0.3;
          } else if (this.overshootRight < 0) {
            this.rebounceLeft = true;
            this.damping = 0.3;
          }
          this.velocity = (this.velocity + this.impulse) * (1 - this.damping);
          this.impulse = 0;
          this.scrollX += this.velocity;
        }
        let x = this.offsetX + (this.scrollX + this.dragDelta);
        this.container.setX(x);
        this.overshootLeft = this.offsetX - x;
        this.overshootRight = this.max + x - this.offsetX;
      }
    }
  }
  HorizontalScroller.i = true;
  HorizontalScroller.s = Node;
  Object.assign(HorizontalScroller.prototype, {
    l: HorizontalScroller
  });

  // UIWidget - shared base for clickable / focusable widgets. `j`
  // holds the underlying scenegraph Container. SO is the "selected
  // until next frame" flag toggled by Ad(); ke is a small counter
  // some widgets use to debounce.
  class UIWidget extends Node {
    constructor() {
      super();
      this.contentSize = null;
      this.focused = false;
      this.debounce = 0;
      this.container = new Container();
    }
    applyHover() {}
    setActive(active) {
      this.active = active;
    }
    select() {
      this.setSelected(true);
    }
    focus() {
      this.focused = true;
    }
    blur() {
      this.focused = false;
    }
    setSelected(selected) {
      this.selectedFlag = selected;
    }
    getX() {
      return this.container.getX();
    }
    setX(x) {
      this.container.setX(x);
      return x;
    }
    getY() {
      return this.container.getY();
    }
    setY(y) {
      this.container.setY(y);
    }
    // up - right-align: position so the right edge sits at `x`.
    alignRight(x) {
      this.container.setX(x - this.container.getWidth());
    }
    getHeight() {
      return this.container.getHeight();
    }
    isVisible() {
      return this.container.isVisible();
    }
    setVisible(visible) {
      this.container.setVisible(visible);
    }
  }
  UIWidget.i = true;
  UIWidget.s = Node;
  Object.assign(UIWidget.prototype, {
    l: UIWidget
  });

  // LevelDot - one of the 25 numbered level icons in the level select
  // grid. Ci is the 1-based level index. The icon starts unfocused
  // (default sprite, $p). bS swaps in the played-state sprite (+ a
  // perfect-clear badge from LevelDot.STAR_FRAMES[4] when `b` is true) and
  // overlays the level number.
  class LevelDot extends UIWidget {
    constructor(index) {
      super();
      this.index = index;
      this.container = new Container();
      this.icon = new Sprite(this.container, Resources.Wa, Keys.OK);
      this.hitArea = new HitTestRect(this.container.node, new Bounds(20, 10, 170, 160));
    }
    focus() {}
    blur() {
      super.blur();
      this.icon.setFrame(Keys.$p);
    }
    setStars(stars, perfectClear) {
      this.icon.setFrame(Keys.$p);
      let label = new TextNode(this.container, Resources.ic);
      label.setBoxSize(this.icon.getWidth(), this.icon.getHeight());
      label.setText(Numeric.toStr(this.index));
      label.setAlign(0, 0);
      label.setFontSize(this.icon.getHeight() * 0.5);
      label.setY(label.getY() - 20);
      new Sprite(this.container, Resources.Wa, LevelDot.STAR_FRAMES[stars]);
      if (perfectClear) {
        new Sprite(this.container, Resources.Wa, LevelDot.STAR_FRAMES[4]);
      }
    }
    hitTest(point) {
      // only hit-testable if the dot is in the "playable" sprite
      // (`Keys.$p`) or currently focused.
      if (this.icon.frame == Keys.$p || this.focused) {
        return this.hitArea.hitTest(point);
      } else {
        return false;
      }
    }
  }
  LevelDot.i = true;
  LevelDot.s = UIWidget;
  Object.assign(LevelDot.prototype, {
    l: LevelDot
  });

  // ScoreLabel - top-right HUD score with a background icon. layout()
  // sizes the icon as 10% of the smaller viewport dimension and pins
  // the label inside it.
  class ScoreLabel extends Node {
    constructor() {
      super();
      this.iconSprite = new Sprite(null, Resources.Wa, Keys.Tt);
      this.label = new TextNode(null, Resources.ic);
    }
    setText(text) {
      this.label.setText(text);
      this.layout();
    }
    Qr() {
      let scene = this.parent;
      scene.node.appendChild(this.iconSprite.node);
      scene.node.appendChild(this.label.node);
    }
    layout() {
      let scene = this.parent;
      let width = scene.director.getWidth();
      let iconSize = Math.min(scene.director.viewportSize().x * 0.1, scene.director.viewportSize().y * 0.1);
      this.iconSprite.setUniformScale(iconSize / this.iconSprite.size.x);
      this.iconSprite.setX(width - this.iconSprite.getWidth() - 20);
      this.iconSprite.setY(20);
      let pad = this.iconSprite.getHeight() * 0.1;
      this.label.setBoxSize(300, this.iconSprite.getHeight() - pad * 2);
      this.label.setAlign(1, 0);
      this.label.setX(this.iconSprite.getX() - 300);
      this.label.setY(this.iconSprite.getY() + pad);
      this.label.autoFit();
    }
  }
  ScoreLabel.i = true;
  ScoreLabel.s = Node;
  Object.assign(ScoreLabel.prototype, {
    l: ScoreLabel
  });

  // HitTestRect - invisible rectangular hit area attached to a scene
  // node so it inherits the same transforms. Ub(point) walks the
  // node tree to refresh the world transform then tests containment.
  class HitTestRect {
    constructor(parentNode, bounds) {
      this.rect = new SpriteNode(parentNode);
      this.rect.setSize(bounds.right - bounds.left, bounds.bottom - bounds.top);
      let xform = this.rect.localT;
      xform.translate.x = bounds.left;
      xform.translate.y = bounds.top;
      xform.K = xform.K & -2 | 496;
    }
    hitTest(point) {
      NodeTreeUtil.updateWorldTransforms(this.rect);
      this.rect.makeLocalBounds();
      return this.rect.hitTest(point);
    }
  }
  HitTestRect.i = true;
  Object.assign(HitTestRect.prototype, {
    l: HitTestRect
  });
