  class RopeBase {
    constructor() {
      this.segmentLength = 1;
      this.points = [];
    }
    insertPoint(a, b) {
      this.points.splice(b, 0, a);
    }
    pushPoint(a) {
      this.points.push(a);
    }
    removePoint(a) {
      this.points.splice(a, 1);
    }
  }
  RopeBase.i = true;
  Object.assign(RopeBase.prototype, {
    l: RopeBase
  });
  class Rope extends RopeBase {
    constructor(a, b, c, d, e, f, g, h) {
      super();
      this.col0 = new Vec4(0, 0, 0, 1);
      this.col1 = new Vec4(0, 0, 0, 1);
      this.col2 = new Vec4(0, 0, 0, 1);
      this.col3 = new Vec4(0, 0, 0, 1);
      this.col4 = new Vec4(0, 0, 0, 1);
      this.effect = new GradientLineEffect();
      this.effect.radius = 2;
      this.visual = new SceneGroup();
      this.visual.setEffect(this.effect);
      a.appendChild(this.visual);
      this.breakProgress = 0;
      this.segmentLength = 30;
      this.breakIndex = -1;
      this.breakDelay = 0;
      this.pumped = false;
      this.segLength = 42;
      this.startPoint = b ?? new VerletPoint();
      if (e != null) {
        this.endPoint = e;
      } else {
        this.endPoint = new VerletPoint();
        this.endPoint.setWeight(1);
      }
      this.startPoint.setWeight(0.02);
      this.startPoint.g.x = c;
      this.startPoint.g.y = d;
      this.endPoint.g.x = f;
      this.endPoint.g.y = g;
      this.pushPoint(this.startPoint);
      this.pushPoint(this.endPoint);
      this.endPoint.addLink(this.startPoint, this.segLength, 0);
      a = Vec2.diff(this.endPoint.g, this.startPoint.g);
      a.div(Math.round(h / this.segLength + 2));
      this.extend(h, a);
      this.alive = false;
      this.pumpId = -1;
      this.stretched = this.skipReturnTrail = this.severed = false;
      this.trail = [];
      this.colorIdx = 3;
    }
    free() {
      this.visual.free();
      this.trail = this.endPoint = this.startPoint = this.visual = null;
    }
    length() {
      let total = 0;
      let n = this.points.length;
      if (n > 0) {
        let prev = this.points[0].g;
        let i = 1;
        while (i < n) {
          let pt = this.points[i++];
          total += prev.distTo(pt.g);
          prev = pt.g;
        }
      }
      return total;
    }
    extend(a, b) {
      if (b == null) {
        b = Vec2.zero();
      }
      let c = this.points[this.points.length - 2];
      let d = this.endPoint.restLenTo(c);
      for (var e; a > 0;) {
        if (a >= this.segLength) {
          c = this.points[this.points.length - 2];
          e = new VerletPoint();
          e.setWeight(0.02);
          e.g = Vec2.sum(c.g, b);
          this.insertPoint(e, this.points.length - 1);
          this.endPoint.replaceLinkTarget(c, e, d);
          e.addLink(c, this.segLength, 0);
          a -= this.segLength;
        } else {
          e = a + d;
          if (e > this.segLength) {
            a = this.segLength;
            d = e - this.segLength;
          } else {
            c = this.points[this.points.length - 2];
            this.endPoint.setLinkDistance(c, e);
            a = 0;
          }
        }
      }
    }
    rebuildTrail() {
      this.effect.clearTrail();
      let a = this.points.length;
      var b;
      if (this.breakIndex == -1) {
        var c = Array(a);
        for (b = 0; b < a;) {
          var d = b++;
          c[d] = this.points[d].g;
        }
        this.renderTrail(c);
      } else {
        d = [];
        let e = [];
        let f = false;
        let g = 0;
        while (g < a) {
          let h = g++;
          c = this.points[h];
          let m = true;
          if (h > 0) {
            b = this.points[h - 1];
            if (!c.hasLink(b)) {
              m = false;
            }
          }
          if (c.pinPos.x == -1 && !m) {
            f = true;
          }
          if (f) {
            e.push(c.g);
          } else {
            d[h] = c.g;
          }
        }
        if (d.length > 0) {
          this.renderTrail(d);
        }
        if (e.length > 0 && !this.skipReturnTrail) {
          this.renderTrail(e);
        }
      }
    }
    renderTrail(a) {
      var b = a.length;
      let c = this.trail;
      if (!(b < 2)) {
        var d = this.breakIndex == -1 || this.alive ? 1 : this.breakDelay / 1.95;
        if (!(d <= 0)) {
          if (d > 1) {
            d = 1;
          }
          var e = a[0];
          var f = a[1];
          var g = e.x - f.x;
          f = e.y - f.y;
          var h = Math.sqrt(g * g + f * f);
          this.breakProgress = h <= this.segLength + 0.3 ? 0 : h <= this.segLength + 1 ? 1 : h < this.segLength + 4 ? 2 : 3;
          if (!(b < 3)) {
            var m = this.col0;
            var n = this.col1;
            g = this.col2;
            var q = this.col3;
            f = this.col4;
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
            if (this.pumped) {
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
            if (h > this.segLength + 7 && !this.stretched) {
              h = h / this.segLength * 2;
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
            b = (b - 1) * this.colorIdx;
            var p = b - 1;
            m = (n.x - g.x) / p;
            var v = (n.y - g.y) / p;
            n = (n.z - g.z) / p;
            var u = (q.x - f.x) / p;
            var A = (q.y - f.y) / p;
            q = (q.z - f.z) / p;
            p = this.colorIdx - 1;
            var D = p - 1;
            var B = c[0];
            if (B == null) {
              c[0] = e.clone();
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
              Vec2.bezierInto(a, B, K);
              B = (e - 1) % p;
              if (B == D || e == b) {
                var E = this.alive ? 16777215 : h ? ((g.z * 255 | 0) & 255) << 16 | ((g.y * 255 | 0) & 255) << 8 | (g.x * 255 | 0) & 255 : ((f.z * 255 | 0) & 255) << 16 | ((f.y * 255 | 0) & 255) << 8 | (f.x * 255 | 0) & 255;
                K = [];
                let vA = [];
                this.effect.points.push(K);
                this.effect.colorLists.push(vA);
                this.effect.alphas.push(d);
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
    shrink(a) {
      var b = this.points.length;
      for (var c = this.endPoint.restLenTo(this.points[b - 2]), d; a > 0;) {
        if (a >= this.segLength) {
          var e = b - 2;
          d = this.points[e];
          this.endPoint.replaceLinkTarget(d, this.points[b - 3], c);
          this.removePoint(e);
          --b;
          a -= this.segLength;
        } else {
          e = c - a;
          if (e < 1) {
            a = this.segLength;
            c = this.segLength + e + 1;
          } else {
            d = this.points[b - 2];
            this.endPoint.setLinkDistance(d, e);
            a = 0;
          }
        }
      }
      a = (b - 1) * (this.segLength + 3);
      b = this.endPoint.links;
      c = b.length;
      for (d = 0; d < c;) {
        e = b[d++];
        if (e.type == 1) {
          e.restLen = a;
        }
      }
    }
    update(a) {
      if (this.breakDelay > 0) {
        this.breakDelay = PathResolver.rampToward(this.breakDelay, 0, 1, a);
        if (this.breakDelay < 1.95 && this.alive) {
          this.severAt(this.breakIndex);
        }
      }
      let b = this.points.length;
      var c;
      for (var d = 0; d < b;) {
        c = this.points[d++];
        if (c != this.endPoint) {
          c.update(a);
        }
      }
      a = 0;
      for (c = this.segmentLength; a < c;) {
        ++a;
        d = 0;
        while (d < b) {
          this.points[d++].applyConstraints();
        }
      }
    }
    severAt(a) {
      this.alive = false;
      var b = this.points[a];
      var c = this.points[a + 1];
      if (c == null) {
        b.clearLinks();
      } else {
        var d = c.links;
        let e = d.length;
        let f = 0;
        while (f < e) {
          let g = f++;
          if (d[g].other == b) {
            c.removeLinkAt(g);
            d = new VerletPoint();
            d.setWeight(0.00001);
            d.g.copyFrom(c.g);
            d.prev.copyFrom(c.prev);
            this.insertPoint(d, a + 1);
            d.addLink(b, this.segLength, 0);
            break;
          }
        }
      }
      a = 0;
      for (b = this.points.length; a < b;) {
        c = this.points[a];
        if (c != this.endPoint) {
          c.setWeight(0.00001);
        }
        ++a;
      }
    }
    markBreakAt(a) {
      this.breakIndex = a;
      this.breakDelay = 2;
      this.alive = true;
      this.pumped = false;
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
