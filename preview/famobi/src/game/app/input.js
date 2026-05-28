  class KeyState {
    constructor(a) {
      this.id = a;
      this.state = 0;
      this.heldDown = false;
    }
    reset() {
      this.state = 0;
    }
    justPressed() {
      return this.state == 1;
    }
    justReleased() {
      return this.state == 3;
    }
    moved() {
      if (this.state != 1) {
        return this.state == 2;
      } else {
        return true;
      }
    }
    setState(a) {
      if (this.state != a) {
        this.state = a;
        switch (a) {
          case 1:
            this.heldDown = true;
            break;
          case 3:
            this.heldDown = true;
        }
      }
    }
    update() {
      switch (this.state) {
        case 1:
          if (this.heldDown) {
            this.heldDown = false;
          } else {
            this.state = 2;
          }
          break;
        case 3:
          if (this.heldDown) {
            this.heldDown = false;
          } else {
            this.state = 0;
          }
      }
    }
  }
  KeyState.i = true;
  Object.assign(KeyState.prototype, {
    l: KeyState
  });
  class KeyCodeMap {
    static dv(a) {
      if (KEYBOARD_CODES == null) {
        buildKeyboardCodeTable();
      }
      return KEYBOARD_CODES.map[a];
    }
  }

  class InputDeviceBase {
    constructor() {
      this.state = null;
      this.enabled = true;
    }
  }
  InputDeviceBase.i = true;
  Object.assign(InputDeviceBase.prototype, {
    l: InputDeviceBase
  });
  class MultiInputDevice {
    constructor() {
      this.enabled = true;
      this.buttons = [];
    }
    update(a) {
      let b = 0;
      let c = this.buttons;
      while (b < c.length) {
        c[b++].update(a);
      }
    }
    resetAll() {
      let a = 0;
      let b = this.buttons;
      while (a < b.length) {
        b[a++].reset();
      }
    }
    justPressed(a) {
      if (!this.enabled) {
        return false;
      }
      a = this.getButtonById(a);
      if (a == null) {
        return false;
      } else {
        return a.justPressed();
      }
    }
    justReleased(a) {
      if (!this.enabled) {
        return false;
      }
      a = this.getButtonById(a);
      if (a == null) {
        return false;
      } else {
        return a.justReleased();
      }
    }
    reset() {
      this.buttons = [];
    }
    press(a) {
      let b = this.getButtonById(a);
      if (b == null) {
        b = new KeyState(a);
        this.buttons.push(b);
      }
      b.setState(1);
    }
    release(a) {
      a = this.getButtonById(a);
      if (a != null) {
        a.setState(3);
      }
    }
    getButtonById(a) {
      let b = 0;
      let c = this.buttons.length;
      while (b < c) {
        let d = this.buttons[b];
        if (d.id == a) {
          return d;
        }
        ++b;
      }
      return null;
    }
  }
  MultiInputDevice.i = true;
  Object.assign(MultiInputDevice.prototype, {
    l: MultiInputDevice
  });
  class KeyboardInputDevice extends InputDeviceBase {
    constructor(a) {
      super();
      this.target = a ?? window.document;
      this.state = new KeyboardState();
      this.events = new EventEmitter();
      this.install();
      this.preventDefaults = [];
      this.event = null;
    }
    typeId() {
      return 0;
    }
    onKeyDown(a) {
      if (this.enabled) {
        var b = KeyCodeMap.fromString(a.code);
        if (b == KeyCodeMap.fromString("")) {
          b = a.which;
        }
        if (this.preventDefaults[b]) {
          a.preventDefault();
        }
        if (!a.repeat) {
          this.state.press(b);
          this.event = a;
          this.events.emit(0, [b]);
          this.event = null;
        }
      }
    }
    onKeyUp(a) {
      if (this.enabled) {
        var b = KeyCodeMap.fromString(a.code);
        this.state.release(b);
        this.event = a;
        this.events.emit(1, [b]);
        this.event = null;
      }
    }
    onVisChange() {
      this.state.resetAll();
    }
    addDomListener(a, b, c) {
      this.target.addEventListener(a, b, c);
    }
    install() {
      this.addDomListener("keydown", cachedBind(this, this.onKeyDown), true);
      this.addDomListener("keyup", cachedBind(this, this.onKeyUp), true);
      this.addDomListener("visibilitychange", cachedBind(this, this.onVisChange), false);
    }
  }
  KeyboardInputDevice.i = true;
  KeyboardInputDevice.s = InputDeviceBase;
  Object.assign(KeyboardInputDevice.prototype, {
    l: KeyboardInputDevice
  });
  class KeyboardState extends MultiInputDevice {
    constructor() {
      super();
    }
    justPressed(a) {
      return super.justPressed(a);
    }
    justReleased(a) {
      return super.justReleased(a);
    }
  }
  KeyboardState.i = true;
  KeyboardState.s = MultiInputDevice;
  Object.assign(KeyboardState.prototype, {
    l: KeyboardState
  });
  class MouseInputDevice extends InputDeviceBase {
    constructor(a) {
      super();
      this.target = a ?? window;
      this.state = new MouseState();
      this.events = new EventEmitter();
      this.install();
    }
    typeId() {
      return 1;
    }
    onMouseDown(a) {
      if (this.enabled) {
        this.updatePosition(a);
        switch (a.which) {
          case 1:
            this.state.press(0);
            break;
          case 2:
            this.state.press(1);
            break;
          case 3:
            this.state.press(2);
        }
        this.events.emit(0, [a.which - 1]);
      }
    }
    onMouseUp(a) {
      if (this.enabled) {
        this.updatePosition(a);
        switch (a.which) {
          case 1:
            this.state.release(0);
            break;
          case 2:
            this.state.release(1);
            break;
          case 3:
            this.state.release(2);
        }
        this.events.emit(1, [a.which - 1]);
      }
    }
    onMouseMove(a) {
      if (this.enabled) {
        this.updatePosition(a);
        a = this.state.position;
        this.events.emit(2, [a.x, a.y]);
        this.state.hoveredFlags[1] = true;
      }
    }
    onMouseLeave() {
      if (this.enabled) {
        this.state.left[1] = true;
        this.events.emit(3);
      }
    }
    onMouseEnter() {
      if (this.enabled) {
        this.state.clickedFlags[1] = true;
        this.events.emit(4);
      }
    }
    onWheel(a) {
      if (this.enabled) {
        var b = this.state;
        b.wheelDelta[1] += a.deltaY | 0;
        this.events.emit(5, [b.wheelDelta[1]]);
      }
    }
    updatePosition(a) {
      let b = a.clientX;
      let c = a.clientY;
      if (this.target instanceof Element) {
        var d = this.target.getBoundingClientRect();
        b -= d.left;
        c -= d.top;
      }
      d = window.devicePixelRatio;
      let e = this.state;
      e.movementDelta[1].x += a.movementX;
      e.movementDelta[1].y += a.movementY;
      a = e.position;
      a.x = b * d | 0;
      a.y = c * d | 0;
    }
    addDomListener(a, b, c) {
      this.target.addEventListener(a, b, c);
    }
    install() {
      this.addDomListener("mousedown", cachedBind(this, this.onMouseDown));
      this.addDomListener("mouseup", cachedBind(this, this.onMouseUp));
      this.addDomListener("mousemove", cachedBind(this, this.onMouseMove));
      this.addDomListener("mouseleave", cachedBind(this, this.onMouseLeave));
      this.addDomListener("mouseenter", cachedBind(this, this.onMouseEnter));
      this.addDomListener("wheel", cachedBind(this, this.onWheel), {
        passive: true
      });
    }
  }
  MouseInputDevice.i = true;
  MouseInputDevice.s = InputDeviceBase;
  Object.assign(MouseInputDevice.prototype, {
    l: MouseInputDevice
  });
  class MouseState extends MultiInputDevice {
    constructor() {
      super();
      this.position = new Size(0, 0);
      this.movementDelta = [new Size(0, 0), new Size(0, 0)];
      this.wheelDelta = [0, 0];
      this.left = [false, false];
      this.clickedFlags = [false, false];
      this.hoveredFlags = [false, false];
    }
    update(a) {
      super.update(a);
      this.hoveredFlags[0] = this.hoveredFlags[1];
      this.hoveredFlags[1] = false;
      a = this.movementDelta[0];
      let b = this.movementDelta[1];
      a.x = b.x;
      a.y = b.y;
      a = this.movementDelta[1];
      a.x = 0;
      a.y = 0;
      this.wheelDelta[0] = this.wheelDelta[1];
      this.wheelDelta[1] = 0;
      this.left[0] = this.left[1];
      this.left[1] = false;
      this.clickedFlags[0] = this.clickedFlags[1];
      this.clickedFlags[1] = false;
    }
    wheelDelta() {
      return this.wheelDelta[0];
    }
    justPressed(a) {
      return super.justPressed(a);
    }
    justReleased(a) {
      return super.justReleased(a);
    }
  }
  MouseState.i = true;
  MouseState.s = MultiInputDevice;
  Object.assign(MouseState.prototype, {
    l: MouseState
  });
  class TouchInputDevice extends InputDeviceBase {
    constructor(a) {
      super();
      this.target = a ?? window;
      this.maxTouches = 0;
      this.setMaxTouches(1);
      this.state = new TouchState();
      this.events = new EventEmitter();
      this.nextTouchSlot = 4;
      this.activeTouches = 0;
      this.touches = {};
      window.document.body.style.setProperty("touch-action", "none");
      this.install();
    }
    setMaxTouches(a) {
      this.maxTouches = Math.min(a, 5);
    }
    typeId() {
      return 3;
    }
    slotForId(a) {
      if (a < 4) {
        return 0;
      } else {
        return a - 4;
      }
    }
    onPointerDown(a) {
      if (this.enabled) {
        if (a.pointerType == "mouse") {
          var b = a.button + 1;
          if (!(b > 3)) {
            this.updateTouchPos(a, b);
            this.state.press(b);
            this.state.press(0);
            a = this.state.position[b];
            b = this.state.position[0];
            b.x = a.x;
            b.y = a.y;
          }
        } else if (this.activeTouches != this.maxTouches) {
          b = this.nextTouchSlot++;
          this.touches["" + a.pointerId] = b;
          this.updateTouchPos(a, b);
          this.activeTouches++;
          this.state.press(b);
          if (b == 4) {
            this.state.press(0);
            a = this.state.position[b];
            b = this.state.position[0];
            b.x = a.x;
            b.y = a.y;
          }
        }
      }
    }
    onPointerUp(a) {
      a.stopPropagation();
      if (this.enabled) {
        if (a.pointerType == "mouse") {
          a = a.button + 1;
          if (!(a > 3)) {
            this.state.release(a);
            this.state.release(0);
          }
        } else {
          var b = this.touches[a.pointerId];
          if (b != null) {
            delete this.touches[a.pointerId];
            this.updateTouchPos(a, b);
            this.state.release(b);
            if (--this.activeTouches == 0) {
              this.nextTouchSlot = 4;
              this.state.release(0);
              a = this.state.position[b];
              b = this.state.position[0];
              b.x = a.x;
              b.y = a.y;
            }
          }
        }
      }
    }
    onPointerCancel(a) {
      this.onPointerUp(a);
    }
    onPointerMove(a) {
      if (this.enabled) {
        if (a.pointerType == "mouse") {
          this.updateTouchPos(a, 0);
          this.state.hoveredFlags[0][1] = true;
        } else {
          var b = this.touches[a.pointerId];
          if (b != null) {
            this.updateTouchPos(a, b);
            this.state.hoveredFlags[b][1] = true;
            if (b == 4) {
              this.state.hoveredFlags[0][1] = true;
              a = this.state.position[b];
              b = this.state.position[0];
              b.x = a.x;
              b.y = a.y;
            }
          }
        }
      }
    }
    updateTouchPos(a, b) {
      let c = a.clientX;
      a = a.clientY;
      if (this.target instanceof Element) {
        var d = this.target.getBoundingClientRect();
        c -= d.left;
        a -= d.top;
      }
      d = window.devicePixelRatio;
      b = this.state.position[b];
      b.x = c * d | 0;
      b.y = a * d | 0;
    }
    addDomListener(a, b, c) {
      if (c == null) {
        c = false;
      }
      this.target.addEventListener(a, b, c);
      if (a == "pointerup") {
        window.addEventListener(a, b, c);
      }
    }
    install() {
      this.addDomListener("pointerdown", cachedBind(this, this.onPointerDown));
      this.addDomListener("pointerup", cachedBind(this, this.onPointerUp));
      this.addDomListener("pointercancel", cachedBind(this, this.onPointerCancel));
      this.addDomListener("pointermove", cachedBind(this, this.onPointerMove));
    }
  }
  TouchInputDevice.i = true;
  TouchInputDevice.s = InputDeviceBase;
  Object.assign(TouchInputDevice.prototype, {
    l: TouchInputDevice
  });
  class TouchState extends MultiInputDevice {
    constructor() {
      super();
      var a = [];
      for (var b = 0; b < 9;) {
        ++b;
        a.push(new Size(TouchState.UNSET, TouchState.UNSET));
      }
      this.position = a;
      a = [];
      for (b = 0; b < 9;) {
        ++b;
        a.push([false, false]);
      }
      this.hoveredFlags = a;
      a = [];
      for (b = 0; b < 9;) {
        ++b;
        a.push(0);
      }
      this.posSnapshot = a;
    }
    update(a) {
      super.update(a);
      for (a = 0; a < 9;) {
        var b = a++;
        this.hoveredFlags[b][0] = this.hoveredFlags[b][1];
        this.hoveredFlags[b][1] = false;
        var c = this.posSnapshot[b];
        switch (c) {
          case 1:
            this.posSnapshot[b] = 0;
            c = this.position[b];
            let d = TouchState.UNSET;
            c.x = d;
            c.y = d;
            if (b == 4) {
              b = this.position[0];
              c = TouchState.UNSET;
              b.x = c;
              b.y = c;
            }
            break;
          case 2:
            this.posSnapshot[b] = c - 1;
        }
      }
    }
    hovered(a) {
      return this.hoveredFlags[a][0];
    }
    justPressed(a) {
      return super.justPressed(a);
    }
    justReleased(a) {
      return super.justReleased(a);
    }
    moved(a) {
      let b = this.getButtonById(a);
      if (b == null) {
        return false;
      } else if (this.justPressed(a)) {
        return true;
      } else {
        return b.moved();
      }
    }
    release(a) {
      super.release(a);
      if (a >= 4) {
        this.posSnapshot[a] = 2;
      }
    }
  }
  TouchState.i = true;
  TouchState.s = MultiInputDevice;
  Object.assign(TouchState.prototype, {
    l: TouchState
  });
