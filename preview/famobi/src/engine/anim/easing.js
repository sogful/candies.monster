  // Easing - interpolation curves for Tween. Every method returns a
  // function (t: 0..1) -> 0..1 so callers can compose them with the
  // generic tween runner. The signatures match Haxe's motion.easing.
  class Easing {
    static linear() {
      return function (t) {return t};
    }
    // poly - polynomial ease. param in [-100..100]; negative arches
    // upward (ease-in), positive bulges downward (ease-out), 0 = linear.
    static poly(amount) {
      let k = (amount < -100 ? -100 : amount > 100 ? 100 : amount) / 100;
      return function (t) {
        if (k == 0) {
          return t;
        } else if (k < 0) {
          return t * (t * -k + 1 + k);
        } else {
          return t * ((2 - t) * k + (1 - k));
        }
      };
    }
    static quadIn() {
      return function (t) {return Math.pow(t, 2)};
    }
    static quadInOut() {
      return function (t) {
        if ((t *= 2) < 1) {
          return Math.pow(t, 2) * 0.5;
        } else {
          return 1 - Math.abs(Math.pow(2 - t, 2)) * 0.5;
        }
      };
    }
    static quadOut() {
      return function (t) {return 1 - Math.pow(1 - t, 2)};
    }
    // backOut - overshoots past 1 then settles. amount scales the
    // overshoot; default 0.1 gives the haxe stdlib's 1.70158 constant
    // (0.1 * 17.0158).
    static backOut(amount) {
      if (amount == null) amount = 0.1;
      let s = amount * 17.0158;
      return function (t) {
        --t;
        return t * t * ((s + 1) * t + s) + 1;
      };
    }
    // elasticOut - damped sine, springs into place. amplitude < 1
    // collapses to a fixed shape; period controls the bounce rate.
    static elasticOut(amplitude, period) {
      if (period == null) period = 0.3;
      if (amplitude == null) amplitude = 0;
      let amp;
      let phase;
      if (amplitude < 1) {
        amp = 1;
        phase = period * 0.25;
      } else {
        amp = amplitude;
        phase = period / TWO_PI * Math.asin(1 / amp);
      }
      return function (t) {
        return amp * Math.pow(2, t * -10) * Math.sin((t - phase) * TWO_PI / period) + 1;
      };
    }
  }
  Easing.i = true;
