  class KeyState {
    constructor(a) {
      this.id = a;
      this.state = 0;
      this.ll = false;
    }
    reset() {
      this.state = 0;
    }
    Nb() {
      return this.state == 1;
    }
    qe() {
      return this.state == 3;
    }
    zo() {
      if (this.state != 1) {
        return this.state == 2;
      } else {
        return true;
      }
    }
    Ak(a) {
      if (this.state != a) {
        this.state = a;
        switch (a) {
          case 1:
            this.ll = true;
            break;
          case 3:
            this.ll = true;
        }
      }
    }
    update() {
      switch (this.state) {
        case 1:
          if (this.ll) {
            this.ll = false;
          } else {
            this.state = 2;
          }
          break;
        case 3:
          if (this.ll) {
            this.ll = false;
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
      return KEYBOARD_CODES.J[a];
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
    jM() {
      let a = 0;
      let b = this.buttons;
      while (a < b.length) {
        b[a++].reset();
      }
    }
    Nb(a) {
      if (!this.enabled) {
        return false;
      }
      a = this.co(a);
      if (a == null) {
        return false;
      } else {
        return a.Nb();
      }
    }
    qe(a) {
      if (!this.enabled) {
        return false;
      }
      a = this.co(a);
      if (a == null) {
        return false;
      } else {
        return a.qe();
      }
    }
    reset() {
      this.buttons = [];
    }
    Oi(a) {
      let b = this.co(a);
      if (b == null) {
        b = new KeyState(a);
        this.buttons.push(b);
      }
      b.Ak(1);
    }
    release(a) {
      a = this.co(a);
      if (a != null) {
        a.Ak(3);
      }
    }
    co(a) {
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
      this.rj();
      this.ZQ = [];
      this.event = null;
    }
    nv() {
      return 0;
    }
    VO(a) {
      if (this.enabled) {
        var b = KeyCodeMap.dv(a.code);
        if (b == KeyCodeMap.dv("")) {
          b = a.which;
        }
        if (this.ZQ[b]) {
          a.preventDefault();
        }
        if (!a.repeat) {
          this.state.Oi(b);
          this.event = a;
          this.events.emit(0, [b]);
          this.event = null;
        }
      }
    }
    XO(a) {
      if (this.enabled) {
        var b = KeyCodeMap.dv(a.code);
        this.state.release(b);
        this.event = a;
        this.events.emit(1, [b]);
        this.event = null;
      }
    }
    vT() {
      this.state.jM();
    }
    addDomListener(a, b, c) {
      this.target.addEventListener(a, b, c);
    }
    rj() {
      this.addDomListener("keydown", cachedBind(this, this.VO), true);
      this.addDomListener("keyup", cachedBind(this, this.XO), true);
      this.addDomListener("visibilitychange", cachedBind(this, this.vT), false);
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
    Nb(a) {
      return super.Nb(a);
    }
    qe(a) {
      return super.qe(a);
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
      this.rj();
    }
    nv() {
      return 1;
    }
    Mr(a) {
      if (this.enabled) {
        this.oe(a);
        switch (a.which) {
          case 1:
            this.state.Oi(0);
            break;
          case 2:
            this.state.Oi(1);
            break;
          case 3:
            this.state.Oi(2);
        }
        this.events.emit(0, [a.which - 1]);
      }
    }
    RP(a) {
      if (this.enabled) {
        this.oe(a);
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
    QP(a) {
      if (this.enabled) {
        this.oe(a);
        a = this.state.position;
        this.events.emit(2, [a.x, a.y]);
        this.state.Ye[1] = true;
      }
    }
    PP() {
      if (this.enabled) {
        this.state.left[1] = true;
        this.events.emit(3);
      }
    }
    OP() {
      if (this.enabled) {
        this.state.Tq[1] = true;
        this.events.emit(4);
      }
    }
    Zf(a) {
      if (this.enabled) {
        var b = this.state;
        b.wheelDelta[1] += a.deltaY | 0;
        this.events.emit(5, [b.wheelDelta[1]]);
      }
    }
    oe(a) {
      let b = a.clientX;
      let c = a.clientY;
      if (this.target instanceof Element) {
        var d = this.target.getBoundingClientRect();
        b -= d.left;
        c -= d.top;
      }
      d = window.devicePixelRatio;
      let e = this.state;
      e.fk[1].x += a.movementX;
      e.fk[1].y += a.movementY;
      a = e.position;
      a.x = b * d | 0;
      a.y = c * d | 0;
    }
    addDomListener(a, b, c) {
      this.target.addEventListener(a, b, c);
    }
    rj() {
      this.addDomListener("mousedown", cachedBind(this, this.Mr));
      this.addDomListener("mouseup", cachedBind(this, this.RP));
      this.addDomListener("mousemove", cachedBind(this, this.QP));
      this.addDomListener("mouseleave", cachedBind(this, this.PP));
      this.addDomListener("mouseenter", cachedBind(this, this.OP));
      this.addDomListener("wheel", cachedBind(this, this.Zf), {
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
      this.fk = [new Size(0, 0), new Size(0, 0)];
      this.wheelDelta = [0, 0];
      this.left = [false, false];
      this.Tq = [false, false];
      this.Ye = [false, false];
    }
    update(a) {
      super.update(a);
      this.Ye[0] = this.Ye[1];
      this.Ye[1] = false;
      a = this.fk[0];
      let b = this.fk[1];
      a.x = b.x;
      a.y = b.y;
      a = this.fk[1];
      a.x = 0;
      a.y = 0;
      this.wheelDelta[0] = this.wheelDelta[1];
      this.wheelDelta[1] = 0;
      this.left[0] = this.left[1];
      this.left[1] = false;
      this.Tq[0] = this.Tq[1];
      this.Tq[1] = false;
    }
    cO() {
      return this.wheelDelta[0];
    }
    Nb(a) {
      return super.Nb(a);
    }
    qe(a) {
      return super.qe(a);
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
      this.lC = 0;
      this.XD(1);
      this.state = new TouchState();
      this.events = new EventEmitter();
      this.xC = 4;
      this.ow = 0;
      this.touches = {};
      window.document.body.style.setProperty("touch-action", "none");
      this.rj();
    }
    XD(a) {
      this.lC = Math.min(a, 5);
    }
    nv() {
      return 3;
    }
    bO(a) {
      if (a < 4) {
        return 0;
      } else {
        return a - 4;
      }
    }
    TQ(a) {
      if (this.enabled) {
        if (a.pointerType == "mouse") {
          var b = a.button + 1;
          if (!(b > 3)) {
            this.oe(a, b);
            this.state.Oi(b);
            this.state.Oi(0);
            a = this.state.position[b];
            b = this.state.position[0];
            b.x = a.x;
            b.y = a.y;
          }
        } else if (this.ow != this.lC) {
          b = this.xC++;
          this.touches["" + a.pointerId] = b;
          this.oe(a, b);
          this.ow++;
          this.state.Oi(b);
          if (b == 4) {
            this.state.Oi(0);
            a = this.state.position[b];
            b = this.state.position[0];
            b.x = a.x;
            b.y = a.y;
          }
        }
      }
    }
    aD(a) {
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
            this.oe(a, b);
            this.state.release(b);
            if (--this.ow == 0) {
              this.xC = 4;
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
    SQ(a) {
      this.aD(a);
    }
    UQ(a) {
      if (this.enabled) {
        if (a.pointerType == "mouse") {
          this.oe(a, 0);
          this.state.Ye[0][1] = true;
        } else {
          var b = this.touches[a.pointerId];
          if (b != null) {
            this.oe(a, b);
            this.state.Ye[b][1] = true;
            if (b == 4) {
              this.state.Ye[0][1] = true;
              a = this.state.position[b];
              b = this.state.position[0];
              b.x = a.x;
              b.y = a.y;
            }
          }
        }
      }
    }
    oe(a, b) {
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
    rj() {
      this.addDomListener("pointerdown", cachedBind(this, this.TQ));
      this.addDomListener("pointerup", cachedBind(this, this.aD));
      this.addDomListener("pointercancel", cachedBind(this, this.SQ));
      this.addDomListener("pointermove", cachedBind(this, this.UQ));
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
        a.push(new Size(TouchState.aq, TouchState.aq));
      }
      this.position = a;
      a = [];
      for (b = 0; b < 9;) {
        ++b;
        a.push([false, false]);
      }
      this.Ye = a;
      a = [];
      for (b = 0; b < 9;) {
        ++b;
        a.push(0);
      }
      this.os = a;
    }
    update(a) {
      super.update(a);
      for (a = 0; a < 9;) {
        var b = a++;
        this.Ye[b][0] = this.Ye[b][1];
        this.Ye[b][1] = false;
        var c = this.os[b];
        switch (c) {
          case 1:
            this.os[b] = 0;
            c = this.position[b];
            let d = TouchState.aq;
            c.x = d;
            c.y = d;
            if (b == 4) {
              b = this.position[0];
              c = TouchState.aq;
              b.x = c;
              b.y = c;
            }
            break;
          case 2:
            this.os[b] = c - 1;
        }
      }
    }
    oF(a) {
      return this.Ye[a][0];
    }
    Nb(a) {
      return super.Nb(a);
    }
    qe(a) {
      return super.qe(a);
    }
    zo(a) {
      let b = this.co(a);
      if (b == null) {
        return false;
      } else if (this.Nb(a)) {
        return true;
      } else {
        return b.zo();
      }
    }
    release(a) {
      super.release(a);
      if (a >= 4) {
        this.os[a] = 2;
      }
    }
  }
  TouchState.i = true;
  TouchState.s = MultiInputDevice;
  Object.assign(TouchState.prototype, {
    l: TouchState
  });
