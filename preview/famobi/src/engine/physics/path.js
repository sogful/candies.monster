  class PathResolver {
    constructor(a, b, c) {
      if (c == null) {
        c = 0;
      }
      if (b == null) {
        b = 0;
      }
      this.Fm = c;
      this.path = [];
      if (a > 0) {
        this.qC = [];
        c = 0;
        while (c < a) {
          this.qC[c++] = b;
        }
      }
      this.g = new Vec2(0, 0);
      this.angle = 0;
      this.reverse = this.paused = false;
      this.Xf = this.qm = 0;
    }
    fq(a) {
      this.path.push(a);
    }
    start() {
      if (this.path.length > 0) {
        this.g.Pb(this.path[0]);
        this.Xf = 1;
        this.eA();
      }
    }
    eA() {
      this.offset = Vec2.Ia(this.path[this.Xf], this.g);
      this.offset.normalize();
      this.offset.multiply(this.qC[this.Xf]);
    }
    update(a) {
      if (!this.paused) {
        if (this.path.length > 0) {
          let b = this.path[this.Xf];
          let c = false;
          if (this.g.gN(b)) {
            c = true;
          } else {
            let d = a;
            if (this.qm != 0) {
              d = a + this.qm;
              this.qm = 0;
            }
            this.g.add(Vec2.Ob(this.offset, d));
            if (!MathUtil.LD(this.offset.x, b.x - this.g.x) || !MathUtil.LD(this.offset.y, b.y - this.g.y)) {
              this.qm = Vec2.Ia(this.g, b).Rb();
              this.qm /= this.offset.Rb();
              this.g.Pb(b);
              c = true;
            }
          }
          if (c) {
            if (this.reverse) {
              this.Xf--;
              if (this.Xf < 0) {
                this.Xf = this.path.length - 1;
              }
            } else {
              this.Xf++;
              if (this.Xf >= this.path.length) {
                this.Xf = 0;
              }
            }
            this.eA();
          }
        }
        if (this.Fm != 0) {
          this.angle += this.Fm * a;
        }
      }
    }
    static dk(a, b, c, d) {
      if (b != a) {
        if (b > a) {
          a += c * d;
          if (a > b) {
            a = b;
          }
        } else {
          a -= c * d;
          if (a < b) {
            a = b;
          }
        }
      }
      return a;
    }
    static ek(a, b, c, d) {
      let e = false;
      if (b != a) {
        if (b > a) {
          a += c * d;
          if (a > b) {
            a = b;
          }
        } else {
          a -= c * d;
          if (a < b) {
            a = b;
          }
        }
        if (b == a) {
          e = true;
        }
      }
      return new PathStep(a, e);
    }
  }
  PathResolver.i = true;
  Object.assign(PathResolver.prototype, {
    l: PathResolver
  });
  class PathState extends PathResolver {
    constructor(a, b, c) {
      super(a, b, c);
    }
    $D(a, b, c) {
      if (a.charAt(0) == "R") {
        var d = Numeric.parseInt(Std.substr(a, 2, null));
        var e = Math.round(d * 3 / 2);
        var f = Math.PI * 2 / e;
        let g = 0;
        d *= LevelController.mn;
        if (a.charAt(1) != "C") {
          f = -f;
        }
        for (a = 0; a < e;) {
          ++a;
          this.fq(new Vec2(b + d * Math.cos(g), c + d * Math.sin(g)));
          g += f;
        }
      } else {
        this.fq(new Vec2(b, c));
        if (a.charAt(a.length - 1) == ",") {
          a = Std.substr(a, 0, a.length - 1);
        }
        d = a.split(",");
        e = d.length;
        f = 0;
        while (f < e) {
          this.fq(new Vec2(b + parseFloat(d[f]) * LevelController.mn, c + parseFloat(d[f + 1]) * LevelController.mn));
          f += 2;
        }
      }
    }
  }
  PathState.i = true;
  PathState.s = PathResolver;
  Object.assign(PathState.prototype, {
    l: PathState
  });

  class SeekerPath extends PathResolver {
    constructor(a, b, c) {
      super(0);
      this.g.x = b.x;
      this.g.y = b.y;
      this.speed = c;
      this.I = a;
    }
    fq() {}
    start() {}
    update(a) {
      let b = this.I.x - this.g.x;
      let c = this.I.y - this.g.y;
      var d = b * b + c * c;
      if (d < 0.000001) {
        this.g.x = this.I.x;
        this.g.y = this.I.y;
      } else {
        d = Math.sqrt(d);
        this.g.x += b / d * this.speed * a;
        this.g.y += c / d * this.speed * a;
        this.speed += a * 50;
      }
    }
    static HB(a, b) {
      return new SeekerPath(a, b, 300);
    }
  }
  SeekerPath.i = true;
  SeekerPath.s = PathResolver;
  Object.assign(SeekerPath.prototype, {
    l: SeekerPath
  });

  class PathStep {
    constructor(a, b) {
      this.value = a;
      this.sk = b;
    }
  }
  PathStep.i = true;
  Object.assign(PathStep.prototype, {
    l: PathStep
  });
