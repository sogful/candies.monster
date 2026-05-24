  class Easing {
    static linear() {
      return function (a) {
        return a;
      };
    }
    static poly(a) {
      let b = (a < -100 ? -100 : a > 100 ? 100 : a) / 100;
      return function (c) {
        if (b == 0) {
          return c;
        } else if (b < 0) {
          return c * (c * -b + 1 + b);
        } else {
          return c * ((2 - c) * b + (1 - b));
        }
      };
    }
    static quadIn() {
      return function (a) {
        return Math.pow(a, 2);
      };
    }
    static quadInOut() {
      return function (a) {
        if ((a *= 2) < 1) {
          return Math.pow(a, 2) * 0.5;
        } else {
          return 1 - Math.abs(Math.pow(2 - a, 2)) * 0.5;
        }
      };
    }
    static quadOut() {
      return function (a) {
        return 1 - Math.pow(1 - a, 2);
      };
    }
    static backOut(a) {
      if (a == null) {
        a = 0.1;
      }
      let b = a * 17.0158;
      return function (c) {
        --c;
        return c * c * ((b + 1) * c + b) + 1;
      };
    }
    static elasticOut(a, b) {
      if (b == null) {
        b = 0.3;
      }
      if (a == null) {
        a = 0;
      }
      let c;
      let d;
      if (a < 1) {
        d = 1;
        c = b * 0.25;
      } else {
        d = a;
        c = b / TWO_PI * Math.asin(1 / d);
      }
      return function (e) {
        return d * Math.pow(2, e * -10) * Math.sin((e - c) * TWO_PI / b) + 1;
      };
    }
  }
  Easing.i = true;
