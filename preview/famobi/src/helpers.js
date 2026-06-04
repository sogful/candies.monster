  // --------------------------------------------------------------------
  // helpers.js — small free-standing functions shared across the engine.
  //
  // These are the f5..f10 + P() functions Haxe emits at the top of the
  // generated IIFE. They've been renamed to something pronounceable;
  // call sites were updated in bulk.
  // --------------------------------------------------------------------

  // numToString — Haxe's "use my toString()" trampoline; bound onto
  // Number.prototype so `(123).toString()` reaches Haxe's StdString.on().
  function numToString() {
    return StdString.on(this, "");
  }

  // currentLevelId — short string id of the active level, used as the
  // analytics event payload (e.g. "level42" for box 2 / level 17).
  function currentLevelId() {
    return "level" + ((LevelState.box - 1) * 25 + LevelState.level);
  }

  // buildKeyboardCodeTable — populates the global `KEYBOARD_CODES` KeyTable that
  // maps `KeyboardEvent.code` strings ("Space", "KeyA", "ArrowUp", ...)
  // to the Haxe-internal numeric keycodes used by KeyboardInputDevice.
  // Called once during boot.
  function buildKeyboardCodeTable() {
    function set(code, value) { KEYBOARD_CODES.J[code] = value; }
    KEYBOARD_CODES = new KeyTable();
    set("Space", 32);
    set("Space", 32);
    set("Quote", 39);
    set("Comma", 44);
    set("Minus", 45);
    set("Period", 46);
    set("Slash", 47);
    for (var i = 0; i < 10; i++) set("Digit" + String.fromCodePoint(48 + i), 48 + i);
    set("Semicolon", 59);
    set("Equal", 61);
    set("BracketLeft", 91);
    set("Backslash", 92);
    set("BracketRight", 93);
    set("Backquote", 96);
    for (i = 0; i < 26; i++) set("Key" + String.fromCodePoint(65 + i), 97 + i);
    for (i = 0; i < 12; i++) set("F" + (i + 1), 121 + i);
    set("ArrowUp", 133);
    set("ArrowLeft", 134);
    set("ArrowRight", 135);
    set("ArrowDown", 136);
    for (i = 0; i < 10; i++) set("EKeyNumpad" + i, 137 + i);
    set("NumpadAdd", 147);
    set("NumpadDecimal", 148);
    set("NumpadMultiply", 149);
    set("NumpadSubtract", 150);
    set("NumpadEqual", 151);
    set("NumpadComma", 152);
    set("NumpadEnter", 153);
    set("NumpadDivide", 154);
    set("NumLock", 155);
    set("Escape", 156);
    set("Backspace", 157);
    set("Tab", 158);
    set("Enter", 159);
    set("ControlLeft", 160);
    set("ControlRight", 161);
    set("ShiftLeft", 162);
    set("ShiftRight", 163);
    set("AltLeft", 164);
    set("AltRight", 165);
    set("PageUp", 166);
    set("PageDown", 167);
    set("Insert", 168);
    set("Delete", 169);
    set("Home", 170);
    set("End", 171);
    set("CapsLock", 172);
    set("Pause", 173);
    set("ScrollLock", 174);
    set("PrintScreen", 175);
  }

  // absLessThan — |a| < b, branchless-ish. Used in float equality checks.
  function absLessThan(a, b) {
    if (a > 0) return a < b;
    return -a < b;
  }

  // remap — linearly remap `a` from the range [b..c] into [d..e].
  function remap(a, b, c, d, e) {
    return d + (a - b) / (c - b) * (e - d);
  }

  // getIterator — coerce a value (Array or anything with .iterator()) to
  // an iterator. Haxe's generic `for-in` calls this.
  function getIterator(a) {
    if (a instanceof Array) return new ArrayIter(a);
    return a.iterator();
  }

  // cachedBind — memoised `fn.bind(obj)` so repeat callbacks share the
  // same bound function (otherwise Haxe-style `P(this, this.foo)` calls
  // inside every frame would allocate a fresh closure each time and
  // break listener removal). The cache key is a per-method id stamped
  // onto the function object the first time we see it.
  function cachedBind(obj, fn) {
    if (fn == null) return null;
    if (fn.jf == null) fn.jf = host.zt++;
    var cached;
    if (obj.Hv == null) obj.Hv = {};
    else cached = obj.Hv[fn.jf];
    if (cached == null) {
      cached = fn.bind(obj);
      obj.Hv[fn.jf] = cached;
    }
    return cached;
  }

  // Public namespace + Haxe-internal slot bookkeeping.
  globalScope.Ctrr = globalScope.Ctrr || {};
  var v9 = v9 || {};
  var v10;
