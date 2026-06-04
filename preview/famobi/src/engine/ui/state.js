  // ButtonInputState - Scene's single-pointer state machine. Per frame:
  // Scene clears the hover, copies the pointer position into `pos` plus
  // the rising/falling edges into `pressed`/`released`, then calls
  // `poll(id, bounds)` for each registered hit region. The first region
  // that consumes the click returns true; the rest see false.
  //
  // Fields:
  //   pressedId - id of the region under the pointer on press-down, or -1.
  //               Stays latched until release or until the pointer leaves.
  //   hoverId   - id whose bounds the pointer is currently inside.
  //               Cleared every frame, repopulated during poll().
  //   cancelId  - set on press-down if the pointer was OUT of bounds at
  //               press start (id of the would-be active region but with
  //               `pos` outside). Used to suppress the click on release
  //               if the press never actually landed inside.
  //   pos       - pointer position (Vec4, .x/.y meaningful).
  //   pressed / released - set externally each frame by Scene.
  class ButtonInputState {
    constructor() {
      this.cancelId = -1;
      this.pos = new Vec4(0, 0, 0, 1);
      this.hoverId = this.pressedId = -1;
      this.pressed = this.released = false;
    }
    resetHover() {
      this.hoverId = -1;
    }
    fi() {}
    poll(a, b) {
      b = b.Ub(this.pos);
      if (this.pressedId < 0) {
        if (this.pressed) {
          this.cancelId = b ? a : -1;
        }
        if (b) {
          this.hoverId = a;
          if (this.pressed) {
            this.pressedId = a;
          }
        }
      }
      if (this.pressedId == a && (b && (this.hoverId = a), this.released)) {
        b = this.cancelId != a;
        this.cancelId = -1;
        if (b) {
          this.pressedId = -1;
          return this.pressed = this.released = false;
        }
        if (a == this.hoverId) {
          this.pressedId = -1;
          this.pressed = this.released = false;
          return true;
        }
        this.pressedId = -1;
      }
      return false;
    }
    isHovered(a) {
      return a == this.hoverId;
    }
    isActive(a) {
      return a == this.pressedId;
    }
  }
  ButtonInputState.i = true;
  Object.assign(ButtonInputState.prototype, {
    l: ButtonInputState
  });
