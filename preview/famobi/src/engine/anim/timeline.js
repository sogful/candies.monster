  class AnimFrameRef {
    constructor(a, b) {
      this.data = a;
      this.time = b;
    }
  }
  AnimFrameRef.i = true;
  Object.assign(AnimFrameRef.prototype, {
    l: AnimFrameRef
  });
  class AnimSequence {
    constructor(a, b) {
      this.ef = a.length;
      this.data = Array(this.ef);
      let c = 0;
      while (c < this.ef) {
        this.data[c] = a[c].data;
        ++c;
      }
      switch (b) {
        case 0:
          this.Va = Array(this.ef + 1);
          this.dj = 0;
          this.zq = a[0].time;
          c = 2;
          for (b = a[1].time; c < this.ef;) {
            if (a[c++].time != b) {
              this.zq = 0;
              break;
            }
          }
          for (c = 0; c < this.ef;) {
            this.Va[c] = this.dj;
            this.dj += a[c].time;
            ++c;
          }
          this.Va[c] = this.dj;
          break;
        case 1:
          this.Va = Array(this.ef);
          this.dj = a[this.ef - 1].time;
          this.zq = null;
          c = 0;
          while (c < this.ef) {
            this.Va[c] = a[c].time;
            ++c;
          }
      }
    }
  }
  AnimSequence.i = true;
  Object.assign(AnimSequence.prototype, {
    l: AnimSequence
  });
  class AnimComponent {
    constructor() {
      this.Yt = false;
      this.object = null;
      this.UB = false;
      this.Iz = true;
      this.sl = false;
      this.vd = 0;
      this.Hx = 1;
      this.he = this.Bg = this.uc = 0;
      this.yh = 1;
      this.next = null;
      this.type = this.typeId();
      AnimComponent.ty++;
    }
    Mm(a) {
      this.Yt = a;
    }
    free() {
      if (this.object != null) {
        this.object.detach(this);
        this.object = null;
      }
      this.Iz = false;
      AnimComponent.ty--;
    }
    Bp() {
      if (!this.UB) {
        this.Mm(false);
        this.sl = true;
        this.vd = 0;
      }
    }
    update(a) {
      if (this.Yt) {
        this.vd += a * this.Hx;
        if (this.object == null) {
          return false;
        } else {
          return this.om(this.vd);
        }
      } else if (this.sl) {
        this.vd += a;
        if (this.vd > AnimComponent.$F) {
          this.free();
        }
        return true;
      } else {
        return false;
      }
    }
    lv() {
      var a = this.vd + this.uc;
      if (this.yh == 0) {
        var b = this.he;
        var c = this.Bg;
        if (a < b) {
          return b;
        } else if (a > c) {
          return c;
        } else {
          return a;
        }
      }
      b = this.Bg - this.he;
      if (b > 0) {
        c = (a - this.he) / b;
        a = Math.floor(c);
        c -= a;
        if (this.yh == 1) {
          return this.he + c * b;
        } else if ((a & 1) == 0) {
          return this.he + c * b;
        } else {
          return this.Bg - c * b;
        }
      } else {
        return this.he;
      }
    }
    typeId() {
      return 103;
    }
  }
  AnimComponent.i = true;
  AnimComponent.Ib = [C180];
  Object.assign(AnimComponent.prototype, {
    l: AnimComponent
  });

  class AnimController extends AnimComponent {
    constructor() {
      super();
      this.Xa = null;
      this.frame = -1;
      this.Oo = this.fm = this.Iw = 0;
      this.Bi = -1;
      this.Sq = this.Rq = null;
    }
    free() {
      this.Sq = this.Rq = this.Xa = null;
      super.free();
    }
    play(a, b, c) {
      if (b == null) {
        b = 0;
      }
      this.Xa = a;
      if (c == null) {
        c = a.ef - 1;
      }
      this.fm = b;
      this.Oo = c;
      this.he = a.Va[this.fm];
      this.Bg = a.Va[this.Oo + 1];
      this.vd = this.he;
      this.Mm(true);
      this.sl = false;
      this.frame = -1;
      this.Bi = this.fm;
      this.om(this.vd);
      return this;
    }
    YR(a) {
      this.Rq = a;
    }
    ZR(a) {
      this.Sq = a;
    }
    stop() {
      this.Xa = null;
      this.Mm(false);
      this.Iw = 0;
      this.Bp();
      return this;
    }
    om() {
      var a = this.lv();
      let b;
      let c = this.Xa.ef;
      if (c == 1) {
        b = this.Bi = 0;
      } else if (a >= this.Xa.dj) {
        b = this.Bi = c - 1;
      } else {
        if (this.Xa.zq > 0) {
          b = a / this.Xa.zq | 0;
        } else {
          b = 0;
          let d = this.Xa.Va;
          if (a >= d[this.Bi] && a <= d[this.Bi + 1]) {
            b = this.Bi;
          } else if (c < 16) {
            let e = 0;
            while (e <= c) {
              if (d[e] >= a) {
                b = e - 1;
                break;
              }
              ++e;
            }
          } else {
            b = NativeArray.WL(d, a, c - 1);
            if (b < 0) {
              b = ~b;
              --b;
            }
          }
        }
        this.Bi = b;
      }
      if (b < this.fm) {
        b = this.fm;
      } else if (b > this.Oo) {
        b = this.Oo;
      }
      if (b != this.frame) {
        this.frame = b;
        this.bQ(this.Xa.data[b]);
        if (b >= this.Oo && this.yh == 0) {
          if (--this.Iw > 0) {
            this.vd = this.he;
            this.frame = -1;
            this.Bi = this.fm;
            this.om(this.vd);
          } else {
            this.Bp();
            a = this.Xa;
            this.Xa = null;
            this.cQ(a);
          }
        }
      }
      return true;
    }
    bQ(a) {
      if (this.Rq != null) {
        this.Rq(this.Xa, a, this.frame);
      }
    }
    cQ(a) {
      if (this.Sq != null) {
        this.Sq(a);
      }
    }
    typeId() {
      return 303;
    }
  }
  AnimController.i = true;
  AnimController.s = AnimComponent;
  Object.assign(AnimController.prototype, {
    l: AnimController
  });
  class SpriteAnimator {
    constructor(a) {
      this.U = a;
      this.controllers = Array(6);
      for (a = 0; a < 6;) {
        this.controllers[a++] = null;
      }
    }
    dispose() {
      if (this.controllers != null) {
        for (var a = 0, b = this.controllers; a < b.length;) {
          let c = b[a];
          ++a;
          if (c != null) {
            c.free();
          }
        }
        this.U = this.controllers = null;
      }
    }
    play(a, b) {
      this.start(a, 0, b);
    }
    loop(a, b) {
      if (b == null) {
        b = false;
      }
      this.start(a, b ? 2 : 1);
    }
    Dc() {
      return this.current.Xa != null;
    }
    stop() {
      let a = 0;
      let b = this.controllers;
      while (a < b.length) {
        let c = b[a];
        ++a;
        if (c != null) {
          c.stop();
        }
      }
    }
    start(a, b, c) {
      let d = 0;
      this.current = null;
      let e = 0;
      while (e < 6) {
        let f = e++;
        let g = a.WN();
        if (g[f] == null) {
          continue;
        }
        let h = this.controllers[f];
        if (h == null) {
          h = new AnimSequenceCtl();
          let n;
          switch (f) {
            case 0:
              n = cachedBind(this, this.hS);
              break;
            case 1:
              n = cachedBind(this, this.iS);
              break;
            case 2:
              n = cachedBind(this, this.yk);
              break;
            case 3:
              n = cachedBind(this, this.cS);
              break;
            case 4:
              n = cachedBind(this, this.dS);
              break;
            case 5:
              n = cachedBind(this, this.La);
          }
          h.Yo = n;
          h.UB = true;
          this.U.u.lq(h);
          this.controllers[f] = h;
        }
        let m = g[f].dj;
        if (m > d) {
          d = m;
          this.current = h;
        }
        h.play(g[f], b);
      }
      if (c != null) {
        this.current.ik = function () {
          c(a);
        };
      }
    }
    hS(a, b, c) {
      this.U.setScaleX(this.Nl(a, b, c));
    }
    iS(a, b, c) {
      this.U.setScaleY(this.Nl(a, b, c));
    }
    yk(a, b, c) {
      this.U.la(this.Nl(a, b, c));
    }
    cS(a, b, c) {
      this.U.setX(this.Nl(a, b, c));
    }
    dS(a, b, c) {
      this.U.setY(this.Nl(a, b, c));
    }
    La(a, b, c) {
      this.U.W(this.Nl(a, b, c));
    }
    Nl(a, b, c) {
      c = Easing.poly(a.aN * 100)(c);
      a = a.value;
      return a + (b.value - a) * c;
    }
  }
  SpriteAnimator.i = true;
  Object.assign(SpriteAnimator.prototype, {
    l: SpriteAnimator
  });
  class AnimTimeline {
    constructor() {
      this.fc = null;
      let a = [];
      let b = 0;
      while (b < 6) {
        ++b;
        a.push(0);
      }
      this.Va = a;
      this.frames = [];
    }
    Ms(a, b, c) {
      if (c == null) {
        c = 0;
      }
      this.qj(0, a, b, c);
    }
    Ns(a, b, c) {
      if (c == null) {
        c = 0;
      }
      this.qj(1, a, b, c);
    }
    setScale(a, b, c, d) {
      if (d == null) {
        d = 0;
      }
      this.Ms(a, c, d);
      this.Ns(b, c, d);
    }
    vc(a, b) {
      var c;
      if (c == null) {
        c = 0;
      }
      this.Ms(a, b, c);
      this.Ns(a, b, c);
    }
    yk(a, b, c) {
      if (c == null) {
        c = 0;
      }
      this.qj(2, a, b, c);
    }
    hE(a, b, c) {
      if (c == null) {
        c = 0;
      }
      this.qj(3, a, b, c);
    }
    iE(a, b, c) {
      if (c == null) {
        c = 0;
      }
      this.qj(4, a, b, c);
    }
    Ch(a, b, c, d) {
      if (d == null) {
        d = 0;
      }
      this.hE(a, c, d);
      this.iE(b, c, d);
    }
    La(a, b, c) {
      if (c == null) {
        c = 0;
      }
      this.qj(5, a, b, c);
    }
    gq(a, b, c) {
      var d;
      if (d == null) {
        d = 0;
      }
      let e = this.Va[0];
      this.Ms(a, e, d);
      this.Va[0] += c;
      e = this.Va[1];
      this.Ns(b, e, d);
      this.Va[1] += c;
    }
    tn(a, b, c) {
      if (c == null) {
        c = 0;
      }
      let d = this.Va[0];
      this.Ms(a, d, c);
      this.Va[0] += b;
      d = this.Va[1];
      this.Ns(a, d, c);
      this.Va[1] += b;
    }
    lu(a, b) {
      var c;
      if (c == null) {
        c = 0;
      }
      let d = this.Va[3];
      this.hE(0, d, c);
      this.Va[3] += b;
      d = this.Va[4];
      this.iE(a, d, c);
      this.Va[4] += b;
    }
    qj(a, b, c, d) {
      this.frames.push(new TimelineEvent(a, c, new KeyValueAN(b, d)));
      this.fc = null;
    }
    WN() {
      if (this.fc == null) {
        this.fc = [];
        let d = 0;
        while (d < 6) {
          let e = d++;
          var a = this.frames;
          let f = [];
          for (var b = 0; b < a.length;) {
            var c = a[b];
            ++b;
            if (c.aR == e) {
              f.push(c);
            }
          }
          if (f.length == 0) {
            this.fc[e] = null;
          } else {
            f.sort(function (g, h) {
              return g.time * 100000 - h.time * 100000 | 0;
            });
            if (f[0].time > 0) {
              switch (e) {
                case 0:
                case 1:
                case 5:
                  a = 1;
                  break;
                default:
                  a = 0;
              }
              f.unshift(new TimelineEvent(e, 0, new KeyValueAN(a, 0)));
            }
            a = Array(f.length);
            b = 0;
            for (c = f.length; b < c;) {
              let g = b++;
              let h = f[g];
              a[g] = new AnimFrameRef(h.WO, h.time);
            }
            this.fc[e] = new AnimSequence(a, 1);
          }
        }
      }
      return this.fc;
    }
    static parse(a) {
      a = a.replace(RegExp("\\s", "g"), "");
      let b = new AnimTimeline();
      let c = Object.create(null);
      c.sx = 0;
      c.sy = 1;
      c.r = 2;
      c.x = 3;
      c.y = 4;
      c.a = 5;
      let d = new EReg("(s|p|sx|sy|r|x|y|a)([\\-\\d\\.]+)([<>]*)", "");
      let e = new EReg("([\\d\\.]+)", "");
      a = a.split(",");
      let f = 0;
      let g = a.length;
      let h = -1;
      let m = [];
      while (f < g) {
        var n = a[f++];
        let q = false;
        while (d.match(n)) {
          q = true;
          n = d.Zc(1);
          let p = parseFloat(d.Zc(2));
          let v = d.Zc(3);
          switch (n) {
            case "p":
              m.push(4);
              m.push(3);
              break;
            case "s":
              m.push(1);
              m.push(0);
              break;
            default:
              m.push(c[n]);
          }
          while (m.length > 0) {
            b.qj(m.pop(), p, h, v == "<" ? -100 : v == ">" ? 100 : 0);
          }
          n = d.HP();
        }
        if (!q) {
          e.match(n);
          h = parseFloat(e.Zc(1));
        }
      }
      return b;
    }
  }
  AnimTimeline.i = true;
  Object.assign(AnimTimeline.prototype, {
    l: AnimTimeline
  });

  class AnimSequenceCtl extends AnimComponent {
    constructor() {
      super();
      this.Yo = this.ik = null;
      this.lastIndex = 0;
      this.Xa = null;
    }
    free() {
      this.Yo = this.ik = null;
      super.free();
    }
    play(a, b) {
      if (b == null) {
        b = 0;
      }
      this.Xa = a;
      this.yh = b;
      this.he = this.vd = this.lastIndex = 0;
      this.Bg = a.dj;
      this.Mm(true);
      this.sl = false;
      this.om(0);
    }
    stop() {
      this.ik = null;
      this.Mm(false);
      this.Xa = null;
      this.Bp();
    }
    om(a) {
      var b = this.lv();
      let c = this.Xa.Va;
      let d;
      var e;
      if (b <= c[0]) {
        d = e = this.lastIndex = b = 0;
      } else if (b >= c[this.Xa.ef - 1]) {
        b = 0;
        d = e = this.lastIndex = this.Xa.ef - 1;
      } else if (b > c[this.lastIndex]) {
        for (e = this.lastIndex + 1; b >= c[e];) {
          this.lastIndex = e;
          ++e;
        }
        d = this.lastIndex;
        b = (b - c[d]) / (c[e] - c[d]);
      } else if (b < c[this.lastIndex]) {
        for (e = this.lastIndex - 1; b <= c[e];) {
          this.lastIndex = e;
          --e;
        }
        d = e;
        e = this.lastIndex;
        b = (b - c[d]) / (c[e] - c[d]);
      } else {
        b = 0;
        d = e = this.lastIndex;
      }
      if (this.Yo != null) {
        this.Yo(this.Xa.data[d], this.Xa.data[e], b);
      }
      if (a > this.Bg && this.yh == 0) {
        a = this.ik;
        this.stop();
        if (a != null) {
          a();
        }
      }
      return true;
    }
    typeId() {
      return 403;
    }
  }
  AnimSequenceCtl.i = true;
  AnimSequenceCtl.s = AnimComponent;
  Object.assign(AnimSequenceCtl.prototype, {
    l: AnimSequenceCtl
  });
  class TweenTrack extends AnimComponent {
    constructor() {
      super();
    }
    free() {
      this.uh = this.Cg = this.easing = null;
      super.free();
    }
    Ih(a, b, c, d, e) {
      this.key = a;
      this.FS = b;
      this.zA = c;
      this.easing = e;
      this.he = this.vd = 0;
      this.Bg = d;
      this.Mm(true);
      this.sl = false;
    }
    stop() {
      this.Cg = this.uh = null;
      this.Bp();
    }
    om(a) {
      if (a >= this.Bg && this.yh == 0) {
        this.Bp();
        this.Cg(this.key, this.zA);
        this.uh(this.key);
        return false;
      }
      a = this.FS;
      a += (this.zA - a) * this.easing((this.lv() - this.he) / (this.Bg - this.he));
      this.Cg(this.key, a);
      return true;
    }
    typeId() {
      return 203;
    }
  }
  TweenTrack.i = true;
  TweenTrack.s = AnimComponent;
  Object.assign(TweenTrack.prototype, {
    l: TweenTrack
  });
  class C192 {
    constructor() {}
  }
  C192.i = true;
  Object.assign(C192.prototype, {
    l: C192
  });
  class TokenParser extends C192 {
    constructor() {
      super();
    }
    mS(a) {
      this.Ed = a;
      this.state = StringUtil.Dr(this.Ed, 0) ? 1 : 0;
      this.Vl = this.g = 0;
      this.Wu = this.Ed.length == 0;
    }
    vC() {
      if (this.Wu) {
        return null;
      }
      let a = this.Ed.length;
      let b;
      while (this.g < a) {
        if (b = this.Ed.charAt(this.g) == "\n") {
          this.g++;
          this.Vl = this.g;
          this.state = StringUtil.Dr(this.Ed, 0) ? 1 : 0;
          return {
            position: this.Vl,
            required: this.g != a
          };
        }
        switch (this.state) {
          case 0:
            if (StringUtil.Dr(this.Ed, this.g)) {
              this.state = 1;
            }
            this.g++;
            break;
          case 1:
            if (StringUtil.Dr(this.Ed, this.g)) {
              this.g++;
            } else {
              this.Vl = this.g;
              this.state = 0;
              return {
                position: this.Vl,
                required: false
              };
            }
        }
        if (this.g == a) {
          this.Wu = true;
          this.Vl = this.g;
          return {
            position: this.Vl,
            required: false
          };
        }
      }
      this.Wu = true;
      return null;
    }
  }
  TokenParser.i = true;
  TokenParser.s = C192;
  Object.assign(TokenParser.prototype, {
    l: TokenParser
  });

  class KeyValueAN {
    constructor(a, b) {
      this.value = a;
      this.aN = b;
    }
  }
  KeyValueAN.i = true;
  Object.assign(KeyValueAN.prototype, {
    l: KeyValueAN
  });
  class TimelineEvent {
    constructor(a, b, c) {
      this.aR = a;
      this.time = b;
      this.WO = c;
    }
  }
  TimelineEvent.i = true;
  Object.assign(TimelineEvent.prototype, {
    l: TimelineEvent
  });
  class SpriteTween {
    constructor(a) {
      this.U = a;
      this.channels = 0;
      this.Xu = [];
      this.repeat = 0;
      this.easing = Easing.linear();
    }
    x(a, b, c, d, e) {
      this.Ih(0, a, b, c, d, e);
      return this;
    }
    y(a, b, c, d, e) {
      this.Ih(1, a, b, c, d, e);
      return this;
    }
    tF(a, b) {
      this.Ih(0, a, 0.1, undefined, null);
      this.Ih(1, b, 0.1, undefined, null);
    }
    scale(a, b, c, d, e) {
      this.Ih(4, a, b, c, d, e);
      return this;
    }
    rotation(a, b, c, d, e) {
      this.Ih(5, a, b, c, d, e);
      return this;
    }
    alpha(a, b, c, d, e) {
      this.Ih(6, a, b, c, d, e);
      return this;
    }
    IS() {
      let a = this.U.u.controllers;
      while (a != null) {
        let b = a.next;
        if (a.type == 203) {
          a.stop();
        }
        a = b;
      }
      this.channels = 0;
    }
    Ih(a, b, c, d, e, f) {
      let g;
      switch (a) {
        case 0:
          g = this.U.getX();
          break;
        case 1:
          g = this.U.getY();
          break;
        case 2:
          g = this.U.Ra;
          break;
        case 3:
          g = this.U.ed;
          break;
        case 4:
          g = this.U.Ra;
          break;
        case 5:
          g = this.U.Zd;
          break;
        case 6:
          g = this.U.Uc;
      }
      let h = this.mv(a);
      h.Ih(a, g, b, c, d == null ? Easing.linear() : d);
      h.yh = e == null ? 0 : e;
      this.Xu[a] = f;
      this.channels |= 1 << a;
    }
    mv(a) {
      let b;
      let c = this.U.u.controllers;
      if (c != null) {
        if ((this.channels & 1 << a) > 0) {
          while (c != null) {
            if (c.type == 203 && (b = c, b.key == a)) {
              b.uh = cachedBind(this, this.uh);
              b.Cg = cachedBind(this, this.Cg);
              return b;
            }
            c = c.next;
          }
        } else {
          while (c != null) {
            if (c.type == 203 && c.sl) {
              b = c;
              b.uh = cachedBind(this, this.uh);
              b.Cg = cachedBind(this, this.Cg);
              return b;
            }
            c = c.next;
          }
        }
      }
      b = new TweenTrack();
      b.uh = cachedBind(this, this.uh);
      b.Cg = cachedBind(this, this.Cg);
      this.U.u.lq(b);
      return b;
    }
    Cg(a, b) {
      let c = this.U;
      switch (a) {
        case 0:
          c.setX(b);
          break;
        case 1:
          c.setY(b);
          break;
        case 2:
          c.setScaleX(b);
          break;
        case 3:
          c.setScaleY(b);
          break;
        case 4:
          c.setUniformScale(b);
          break;
        case 5:
          c.la(b);
          break;
        case 6:
          c.W(b);
      }
    }
    uh(a) {
      let b = this.Xu[a];
      if (b != null) {
        this.Xu[a] = null;
        b();
      }
    }
  }
  SpriteTween.i = true;
  Object.assign(SpriteTween.prototype, {
    l: SpriteTween
  });
