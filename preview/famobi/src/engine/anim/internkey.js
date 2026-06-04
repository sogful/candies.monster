  class InternKey {
    constructor(a) {
      this.U = a;
      this.controller = this.mv();
    }
    kB() {
      if (this.controller.Yt) {
        return this.controller.Bg - this.controller.he;
      } else {
        return -1;
      }
    }
    Dc(a) {
      return this.controller.Xa == a;
    }
    play(a, b) {
      this.controller.yh = 0;
      this.controller.Iw = b != null ? b - 1 : 0;
      this.controller.play(a);
      return this;
    }
    WC(a) {
      let b = this;
      this.play(a).Be(function () {
        b.U.free();
      });
    }
    loop(a, b) {
      if (b == null) {
        b = false;
      }
      this.controller.yh = b ? 2 : 1;
      this.controller.play(a);
      return this;
    }
    stop() {
      this.controller.stop();
      return this;
    }
    Be(a) {
      this.controller.ZR(a);
    }
    Cw() {
      this.controller.vd = X.Yn(0, this.kB());
    }
    setTime(a) {
      let b = this.kB();
      this.controller.vd = a < 0 ? 0 : a > b ? b : a;
      return this;
    }
    mv() {
      let a = this.U.u.lN();
      let b = this;
      if (a == null || !a.Iz) {
        a = new AnimController();
        a.YR(function (c, d) {
          b.U.qp(d);
        });
        this.U.u.lq(a);
      }
      return a;
    }
    static create(a) {
      function b(v) {
        if (g.Zc(v) != null) {
          v = Std.substr(g.Zc(v), 1, null);
          e = v.indexOf(".") != -1 ? parseFloat(v) : 1 / Numeric.parseInt(v);
        }
      }
      function c(v) {
        return f + (v < 10 ? "000" : v < 100 ? "00" : "0") + v;
      }
      let d = [];
      let e = 0.03333333333333333;
      let f = "";
      let g = null;
      let h = 0;
      for (a = a.split(","); h < a.length;) {
        var m = a[h];
        ++h;
        g = new EReg("^([a-z][\\w\\/]*)(@[\\d\\.]+)*", "i");
        if (g.match(m)) {
          f = g.Zc(1);
          b(2);
        } else {
          g = new EReg("^(\\d+)-(\\d+)(@[\\d\\.]+)*", "");
          if (g.match(m)) {
            var n = Numeric.parseInt(g.Zc(1));
            var q = Numeric.parseInt(g.Zc(2));
            b(3);
            m = [];
            var p = n;
            if (n > q) {
              while (p >= q) {
                m.push(p--);
              }
            } else {
              while (p <= q) {
                m.push(p++);
              }
            }
            n = [];
            q = 0;
            for (p = m.length; q < p;) {
              ++q;
              n.push(e);
            }
            for (p = q = 0; p < m.length;) {
              d.push(new AnimFrameRef(c(m[p++]), n[q++]));
            }
          } else {
            g = new EReg("^(\\d+)x(\\d+)(@[\\d\\.]+)*", "");
            if (g.match(m)) {
              m = Numeric.parseInt(g.Zc(1));
              n = Numeric.parseInt(g.Zc(2));
              b(3);
              q = 0;
              while (q < n) {
                ++q;
                d.push(new AnimFrameRef(c(m), e));
              }
            } else {
              g = new EReg("^\\d+(@[\\d\\.]+)*(@[\\d\\.]+)*", "");
              if (g.match(m)) {
                b(1);
                d.push(new AnimFrameRef(c(Numeric.parseInt(g.Zc(0))), e));
              }
            }
          }
        }
      }
      return new AnimSequence(d, 0);
    }
  }
  InternKey.i = true;
  Object.assign(InternKey.prototype, {
    l: InternKey
  });
