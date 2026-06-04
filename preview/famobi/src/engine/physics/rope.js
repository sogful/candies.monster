  class RopeBase {
    constructor() {
      this.sD = 1;
      this.za = [];
    }
    Ez(a, b) {
      this.za.splice(b, 0, a);
    }
    Dz(a) {
      this.za.push(a);
    }
    oR(a) {
      this.za.splice(a, 1);
    }
  }
  RopeBase.i = true;
  Object.assign(RopeBase.prototype, {
    l: RopeBase
  });
  class Rope extends RopeBase {
    constructor(a, b, c, d, e, f, g, h) {
      super();
      this.SM = new Vec4(0, 0, 0, 1);
      this.TM = new Vec4(0, 0, 0, 1);
      this.WM = new Vec4(0, 0, 0, 1);
      this.UM = new Vec4(0, 0, 0, 1);
      this.XM = new Vec4(0, 0, 0, 1);
      this.effect = new GradientLineEffect();
      this.effect.Z = 2;
      this.va = new SceneGroup();
      this.va.Rf(this.effect);
      a.P(this.va);
      this.Fw = 0;
      this.sD = 30;
      this.yc = -1;
      this.bh = 0;
      this.wB = false;
      this.Kc = 42;
      this.Jc = b ?? new VerletPoint();
      if (e != null) {
        this.Mb = e;
      } else {
        this.Mb = new VerletPoint();
        this.Mb.Ng(1);
      }
      this.Jc.Ng(0.02);
      this.Jc.g.x = c;
      this.Jc.g.y = d;
      this.Mb.g.x = f;
      this.Mb.g.y = g;
      this.Dz(this.Jc);
      this.Dz(this.Mb);
      this.Mb.al(this.Jc, this.Kc, 0);
      a = Vec2.Ia(this.Mb.g, this.Jc.g);
      a.xA(Math.round(h / this.Kc + 2));
      this.dc(h, a);
      this.Al = false;
      this.rh = -1;
      this.PM = this.Fv = this.Mn = false;
      this.Tu = [];
      this.aA = 3;
    }
    free() {
      this.va.free();
      this.Tu = this.Mb = this.Jc = this.va = null;
    }
    Rb() {
      let a = 0;
      let b = this.za.length;
      if (b > 0) {
        let c = this.za[0].g;
        let d = 1;
        while (d < b) {
          let e = this.za[d++];
          a += c.sf(e.g);
          c = e.g;
        }
      }
      return a;
    }
    dc(a, b) {
      if (b == null) {
        b = Vec2.sc();
      }
      let c = this.za[this.za.length - 2];
      let d = this.Mb.zh(c);
      for (var e; a > 0;) {
        if (a >= this.Kc) {
          c = this.za[this.za.length - 2];
          e = new VerletPoint();
          e.Ng(0.02);
          e.g = Vec2.tb(c.g, b);
          this.Ez(e, this.za.length - 1);
          this.Mb.lA(c, e, d);
          e.al(c, this.Kc, 0);
          a -= this.Kc;
        } else {
          e = a + d;
          if (e > this.Kc) {
            a = this.Kc;
            d = e - this.Kc;
          } else {
            c = this.za[this.za.length - 2];
            this.Mb.vq(c, e);
            a = 0;
          }
        }
      }
    }
    M() {
      this.effect.OR();
      let a = this.za.length;
      var b;
      if (this.yc == -1) {
        var c = Array(a);
        for (b = 0; b < a;) {
          var d = b++;
          c[d] = this.za[d].g;
        }
        this.Su(c);
      } else {
        d = [];
        let e = [];
        let f = false;
        let g = 0;
        while (g < a) {
          let h = g++;
          c = this.za[h];
          let m = true;
          if (h > 0) {
            b = this.za[h - 1];
            if (!c.lO(b)) {
              m = false;
            }
          }
          if (c.vh.x == -1 && !m) {
            f = true;
          }
          if (f) {
            e.push(c.g);
          } else {
            d[h] = c.g;
          }
        }
        if (d.length > 0) {
          this.Su(d);
        }
        if (e.length > 0 && !this.Fv) {
          this.Su(e);
        }
      }
    }
    Su(a) {
      var b = a.length;
      let c = this.Tu;
      if (!(b < 2)) {
        var d = this.yc == -1 || this.Al ? 1 : this.bh / 1.95;
        if (!(d <= 0)) {
          if (d > 1) {
            d = 1;
          }
          var e = a[0];
          var f = a[1];
          var g = e.x - f.x;
          f = e.y - f.y;
          var h = Math.sqrt(g * g + f * f);
          this.Fw = h <= this.Kc + 0.3 ? 0 : h <= this.Kc + 1 ? 1 : h < this.Kc + 4 ? 2 : 3;
          if (!(b < 3)) {
            var m = this.SM;
            var n = this.TM;
            g = this.WM;
            var q = this.UM;
            f = this.XM;
            m.x = 0;
            m.y = 0;
            m.z = 0;
            m.w = d;
            n.x = 0.475;
            n.y = 0.305;
            n.z = 0.185;
            n.w = d;
            g.x = 0.19;
            g.y = 0.122;
            g.z = 0.074;
            g.w = d;
            q.x = 0.6755555555555556;
            q.y = 0.44;
            q.z = 0.27555555555555555;
            q.w = d;
            f.x = 0.304;
            f.y = 0.198;
            f.z = 0.124;
            f.w = d;
            if (this.wB) {
              n.x *= 3;
              n.y *= 3;
              n.z *= 3;
              q.x *= 3;
              q.y *= 3;
              q.z *= 3;
              g.x *= 3;
              g.y *= 3;
              g.z *= 3;
              f.x *= 3;
              f.y *= 3;
              f.z *= 3;
              if (n.x > 1) {
                n.x = 1;
              }
              if (n.y > 1) {
                n.y = 1;
              }
              if (n.z > 1) {
                n.z = 1;
              }
              if (q.x > 1) {
                q.x = 1;
              }
              if (q.y > 1) {
                q.y = 1;
              }
              if (q.z > 1) {
                q.z = 1;
              }
              if (g.x > 1) {
                g.x = 1;
              }
              if (g.y > 1) {
                g.y = 1;
              }
              if (g.z > 1) {
                g.z = 1;
              }
              if (f.x > 1) {
                f.x = 1;
              }
              if (f.y > 1) {
                f.y = 1;
              }
              if (f.z > 1) {
                f.z = 1;
              }
            }
            if (h > this.Kc + 7 && !this.PM) {
              h = h / this.Kc * 2;
              g.x *= h;
              f.x *= h;
              if (g.x > 1) {
                g.x = 1;
              }
              if (f.x > 1) {
                f.x = 1;
              }
            }
            h = false;
            b = (b - 1) * this.aA;
            var p = b - 1;
            m = (n.x - g.x) / p;
            var v = (n.y - g.y) / p;
            n = (n.z - g.z) / p;
            var u = (q.x - f.x) / p;
            var A = (q.y - f.y) / p;
            q = (q.z - f.z) / p;
            p = this.aA - 1;
            var D = p - 1;
            var B = c[0];
            if (B == null) {
              c[0] = e.Zb();
            } else {
              B.x = e.x;
              B.y = e.y;
            }
            for (e = 1; e <= b;) {
              B = e / b;
              var K = c[e];
              if (K == null) {
                K = c[e] = new Vec2(0, 0);
              }
              Vec2.OD(a, B, K);
              B = (e - 1) % p;
              if (B == D || e == b) {
                var E = this.Al ? 16777215 : h ? ((g.z * 255 | 0) & 255) << 16 | ((g.y * 255 | 0) & 255) << 8 | (g.x * 255 | 0) & 255 : ((f.z * 255 | 0) & 255) << 16 | ((f.y * 255 | 0) & 255) << 8 | (f.x * 255 | 0) & 255;
                K = [];
                let vA = [];
                this.effect.points.push(K);
                this.effect.Zh.push(vA);
                this.effect.vn.push(d);
                let v11 = e - B - 1;
                let V = c[v11++];
                K.push(new Vec4(V.x, V.y, 0, 1));
                E = new Vec4((E & 255) / 255, (E >> 8 & 255) / 255, (E >> 16 & 255) / 255, 1);
                for (vA.push(E); v11 <= e;) {
                  V = c[v11];
                  K.push(new Vec4(V.x, V.y, 0, 1));
                  vA.push(E);
                  ++v11;
                }
                h = !h;
                B += 1;
                g.x += m * B;
                g.y += v * B;
                g.z += n * B;
                f.x += u * B;
                f.y += A * B;
                f.z += q * B;
              }
              ++e;
            }
          }
        }
      }
    }
    xR(a) {
      var b = this.za.length;
      for (var c = this.Mb.zh(this.za[b - 2]), d; a > 0;) {
        if (a >= this.Kc) {
          var e = b - 2;
          d = this.za[e];
          this.Mb.lA(d, this.za[b - 3], c);
          this.oR(e);
          --b;
          a -= this.Kc;
        } else {
          e = c - a;
          if (e < 1) {
            a = this.Kc;
            c = this.Kc + e + 1;
          } else {
            d = this.za[b - 2];
            this.Mb.vq(d, e);
            a = 0;
          }
        }
      }
      a = (b - 1) * (this.Kc + 3);
      b = this.Mb.jg;
      c = b.length;
      for (d = 0; d < c;) {
        e = b[d++];
        if (e.type == 1) {
          e.zh = a;
        }
      }
    }
    update(a) {
      if (this.bh > 0) {
        this.bh = PathResolver.dk(this.bh, 0, 1, a);
        if (this.bh < 1.95 && this.Al) {
          this.Gw(this.yc);
        }
      }
      let b = this.za.length;
      var c;
      for (var d = 0; d < b;) {
        c = this.za[d++];
        if (c != this.Mb) {
          c.update(a);
        }
      }
      a = 0;
      for (c = this.sD; a < c;) {
        ++a;
        d = 0;
        while (d < b) {
          this.za[d++].As();
        }
      }
    }
    Gw(a) {
      this.Al = false;
      var b = this.za[a];
      var c = this.za[a + 1];
      if (c == null) {
        b.vD();
      } else {
        var d = c.jg;
        let e = d.length;
        let f = 0;
        while (f < e) {
          let g = f++;
          if (d[g].Cj == b) {
            c.mR(g);
            d = new VerletPoint();
            d.Ng(0.00001);
            d.g.Pb(c.g);
            d.ha.Pb(c.ha);
            this.Ez(d, a + 1);
            d.al(b, this.Kc, 0);
            break;
          }
        }
      }
      a = 0;
      for (b = this.za.length; a < b;) {
        c = this.za[a];
        if (c != this.Mb) {
          c.Ng(0.00001);
        }
        ++a;
      }
    }
    Fs(a) {
      this.yc = a;
      this.bh = 2;
      this.Al = true;
      this.wB = false;
    }
  }
  Rope.i = true;
  Rope.s = RopeBase;
  Object.assign(Rope.prototype, {
    l: Rope
  });

  class ColoredSegment {
    constructor(a, b, c, d, e) {
      this.start = a;
      this.end = b;
      this.color = e;
    }
  }
  ColoredSegment.i = true;
  Object.assign(ColoredSegment.prototype, {
    l: ColoredSegment
  });
