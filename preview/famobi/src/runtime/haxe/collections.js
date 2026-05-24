  class C6 {}
  C6.i = true;
  C6.Je = true;
  C6.Ib = [C5];
  class C7 {}
  C7.i = true;
  C7.Je = true;
  C7.Ib = [C6];
  class ArrayList {
    constructor(a, b, c) {
      if (a == null) {
        a = 2;
      }
      this.sd = null;
      this.ba = 0;
      this.Dm = false;
      this.Rj = -2;
      this.cm = a < 2 ? 2 : a;
      if (b != null && b.length > 0) {
        this.ba = b.length;
        this.N = b.slice(0, b.length);
        this.eb = this.ba;
      } else {
        this.eb = this.cm;
        this.N = Array(this.eb);
      }
      if (c) {
        this.Rj = 0;
      }
    }
    pushBack(a) {
      if (this.ba == this.eb) {
        this.grow();
      }
      this.N[this.ba++] = a;
    }
    front() {
      return this.N[0];
    }
    swapPop(a) {
      let b = this.N;
      b[a] = b[--this.ba];
    }
    trim(a) {
      this.ba = a;
      return this;
    }
    indexOf(a) {
      if (this.ba == 0) {
        return -1;
      }
      let b = 0;
      let c = -1;
      let d = this.ba - 1;
      let e = this.N;
      do {
        if (e[b] == a) {
          c = b;
          break;
        }
      } while (b++ < d);
      return c;
    }
    reserve(a) {
      if (a > this.eb) {
        this.eb = a;
        this.resizeContainer(a);
      }
    }
    ib(a, b) {
      this.reserve(a);
      this.ba = a;
      let c = this.N;
      let d = 0;
      while (d < a) {
        c[d++] = b;
      }
    }
    pack() {
      if (this.eb > this.cm) {
        var a = this.cm;
        var b = this.ba;
        this.eb = a > b ? a : b;
        this.resizeContainer(this.eb);
      } else {
        a = this.N;
        b = this.ba;
        let c = this.eb;
        while (b < c) {
          a[b++] = null;
        }
      }
    }
    grow() {
      this.eb = GrowStrategy.On(this.Rj, this.eb);
      this.resizeContainer(this.eb);
    }
    resizeContainer(a) {
      a = Array(a);
      NativeArray.Bn(this.N, 0, a, this.ba);
      this.N = a;
    }
    cv() {
      NativeArray.Or(this.N);
      this.N = null;
      if (this.sd != null) {
        this.sd.cv();
        this.sd = null;
      }
    }
    clear(a) {
      if (a == null) {
        a = false;
      }
      if (a) {
        NativeArray.Or(this.N);
      }
      this.ba = 0;
    }
    iterator() {
      if (this.Dm) {
        if (this.sd == null) {
          this.sd = new ArrayListIter(this);
        } else {
          let a = this.sd;
          a.N = a.ye.N;
          a.yg = a.ye.ba;
          a.xe = 0;
        }
        return this.sd;
      }
      return new ArrayListIter(this);
    }
  }
  ArrayList.i = true;
  ArrayList.Ib = [C7];
  Object.assign(ArrayList.prototype, {
    l: ArrayList
  });
  class Grid2D {
    constructor(a, b, c) {
      this.sd = null;
      this.Dm = false;
      if (c != null) {
        this.Tb = a;
        this.Yc = b;
        a = this.N = Array(this.Tb * this.Yc);
        b = 0;
        let d = this.Tb * this.Yc;
        while (b < d) {
          let e = b++;
          a[e] = c[e];
        }
      } else {
        this.Tb = a;
        this.Yc = b;
        this.N = Array(this.Tb * this.Yc);
      }
    }
    forEach(a) {
      let b = this.N;
      let c = this.Tb;
      let d = 0;
      let e = this.Tb * this.Yc;
      while (d < e) {
        let f = d++;
        b[f] = a(b[f], f % c, f / c | 0);
      }
      return this;
    }
    zi(a) {
      let b = this.N;
      let c = 0;
      let d = this.Tb * this.Yc;
      while (c < d) {
        a(b[c++]);
      }
      return this;
    }
    resize(a, b) {
      if (a == this.Tb && b == this.Yc) {
        return this;
      }
      let c = this.N;
      this.N = Array(a * b);
      if (a == this.Tb) {
        NativeArray.Bn(c, 0, this.N, this.Tb * (b < this.Yc ? b : this.Yc));
        this.Tb = a;
        this.Yc = b;
        return this;
      }
      let d = a < this.Tb ? a : this.Tb;
      let e;
      let f = this.N;
      let g = 0;
      let h = b < this.Yc ? b : this.Yc;
      while (g < h) {
        var m = g++;
        e = m * a;
        m *= this.Tb;
        let n = 0;
        let q = d;
        while (n < q) {
          let p = n++;
          f[e + p] = c[m + p];
        }
      }
      this.Tb = a;
      this.Yc = b;
      return this;
    }
    iterator() {
      if (this.Dm) {
        if (this.sd == null) {
          this.sd = new Grid2DIter(this);
        } else {
          let a = this.sd;
          a.N = a.ye.N;
          let b = a.ye;
          a.yg = b.Tb * b.Yc;
          a.xe = 0;
        }
        return this.sd;
      }
      return new Grid2DIter(this);
    }
  }
  Grid2D.i = true;
  Grid2D.Ib = [C6];
  Object.assign(Grid2D.prototype, {
    l: Grid2D
  });
  class C83 {}
  C83.i = true;
  C83.Je = true;
  Object.assign(C83.prototype, {
    l: C83
  });
  class Grid2DIter {
    constructor(a) {
      this.ye = a;
      this.N = this.ye.N;
      a = this.ye;
      this.yg = a.Tb * a.Yc;
      this.xe = 0;
    }
    fb() {
      return this.xe < this.yg;
    }
    next() {
      return this.N[this.xe++];
    }
  }
  Grid2DIter.i = true;
  Grid2DIter.Ib = [C83];
  Object.assign(Grid2DIter.prototype, {
    l: Grid2DIter
  });
  class C88 {}
  C88.i = true;
  C88.Je = true;
  C88.Ib = [C6];
  class Stack {
    constructor(a, b, c) {
      if (a == null) {
        a = 16;
      }
      this.Ga = 0;
      this.Rj = -2;
      this.eb = this.cm = a < 1 ? 1 : a;
      if (b != null) {
        a = this.Ga = b.length;
        var d = this.eb;
        this.eb = a > d ? a : d;
      }
      this.N = Array(this.eb);
      if (b != null) {
        a = this.N;
        d = 0;
        let e = this.Ga;
        while (d < e) {
          let f = d++;
          a[f] = b[f];
        }
      }
      if (c) {
        this.Rj = 0;
      }
    }
    reserve(a) {
      if (a > this.eb) {
        this.eb = a;
        this.resizeContainer(a);
      }
    }
    top() {
      return this.N[this.Ga - 1];
    }
    clear(a) {
      if (a == null) {
        a = false;
      }
      if (a) {
        NativeArray.Or(this.N);
      }
      this.Ga = 0;
    }
    grow() {
      this.eb = GrowStrategy.On(this.Rj, this.eb);
      this.resizeContainer(this.eb);
    }
    resizeContainer(a) {
      a = Array(a);
      NativeArray.Bn(this.N, 0, a, this.Ga);
      this.N = a;
    }
  }
  Stack.i = true;
  Stack.Ib = [C88];
  Object.assign(Stack.prototype, {
    l: Stack
  });
  class C87 {}
  C87.i = true;
  C87.Je = true;
  C87.Ib = [C6];
  class PriorityQueue {
    constructor(a, b, c) {
      if (b == null) {
        b = false;
      }
      if (a == null) {
        a = 1;
      }
      this.sd = null;
      this.ba = 0;
      this.Dm = false;
      this.Rj = -2;
      this.cm = a < 1 ? 1 : a;
      this.eb = a;
      this.xg = b;
      if (c != null) {
        a = this.ba = c.length;
        b = this.eb;
        this.eb = a > b ? a : b;
      }
      this.N = Array(this.eb + 1);
      this.N[0] = null;
      if (c != null) {
        a = this.N;
        b = 1;
        let d = this.ba + 1;
        while (b < d) {
          let e = b++;
          a[e] = c[e - 1];
        }
        this.pR();
      }
    }
    enqueue(a) {
      if (this.ba == this.eb) {
        this.grow();
      }
      this.N[++this.ba] = a;
      a = a.g = this.ba;
      let b = this.N;
      let c = a >> 1;
      let d = b[a];
      let e = d.priority;
      if (this.xg) {
        while (c > 0) {
          var f = b[c];
          if (e - f.priority < 0) {
            b[a] = f;
            f.g = a;
            a = c;
            c >>= 1;
          } else {
            break;
          }
        }
      } else {
        while (c > 0) {
          f = b[c];
          if (e - f.priority > 0) {
            b[a] = f;
            f.g = a;
            a = c;
            c >>= 1;
          } else {
            break;
          }
        }
      }
      b[a] = d;
      d.g = a;
    }
    KM() {
      var a = this.N;
      let b = a[1];
      b.g = -1;
      a[1] = a[this.ba];
      a = 1;
      let c = this.N;
      let d = 2;
      let e;
      let f = c[1];
      let g = f.priority;
      if (this.xg) {
        while (d < this.ba) {
          if (d < this.ba - 1 && c[d].priority - c[d + 1].priority > 0) {
            ++d;
          }
          e = c[d];
          if (g - e.priority > 0) {
            c[a] = e;
            e.g = a;
            a = f.g = d;
            d <<= 1;
          } else {
            break;
          }
        }
      } else {
        while (d < this.ba) {
          if (d < this.ba - 1 && c[d].priority - c[d + 1].priority < 0) {
            ++d;
          }
          e = c[d];
          if (g - e.priority < 0) {
            c[a] = e;
            e.g = a;
            a = f.g = d;
            d <<= 1;
          } else {
            break;
          }
        }
      }
      c[a] = f;
      f.g = a;
      this.ba--;
      return b;
    }
    rR(a, b) {
      var c = a.priority;
      if (c != b) {
        a.priority = b;
        a = a.g;
        if (this.xg) {
          if (b < c) {
            b = a;
            c = this.N;
            var d = a >> 1;
            a = c[a];
            var e = a.priority;
            if (this.xg) {
              while (d > 0) {
                var f = c[d];
                if (e - f.priority < 0) {
                  c[b] = f;
                  f.g = b;
                  b = d;
                  d >>= 1;
                } else {
                  break;
                }
              }
            } else {
              while (d > 0) {
                f = c[d];
                if (e - f.priority > 0) {
                  c[b] = f;
                  f.g = b;
                  b = d;
                  d >>= 1;
                } else {
                  break;
                }
              }
            }
            c[b] = a;
            a.g = b;
          } else {
            b = a;
            c = this.N;
            d = a << 1;
            e = c[a];
            f = e.priority;
            if (this.xg) {
              while (d < this.ba) {
                if (d < this.ba - 1 && c[d].priority - c[d + 1].priority > 0) {
                  ++d;
                }
                a = c[d];
                if (f - a.priority > 0) {
                  c[b] = a;
                  a.g = b;
                  b = e.g = d;
                  d <<= 1;
                } else {
                  break;
                }
              }
            } else {
              while (d < this.ba) {
                if (d < this.ba - 1 && c[d].priority - c[d + 1].priority < 0) {
                  ++d;
                }
                a = c[d];
                if (f - a.priority < 0) {
                  c[b] = a;
                  a.g = b;
                  b = e.g = d;
                  d <<= 1;
                } else {
                  break;
                }
              }
            }
            c[b] = e;
            e.g = b;
            a = this.ba;
            b = this.N;
            c = a >> 1;
            d = b[a];
            e = d.priority;
            if (this.xg) {
              while (c > 0) {
                f = b[c];
                if (e - f.priority < 0) {
                  b[a] = f;
                  f.g = a;
                  a = c;
                  c >>= 1;
                } else {
                  break;
                }
              }
            } else {
              while (c > 0) {
                f = b[c];
                if (e - f.priority > 0) {
                  b[a] = f;
                  f.g = a;
                  a = c;
                  c >>= 1;
                } else {
                  break;
                }
              }
            }
            b[a] = d;
            d.g = a;
          }
        } else if (b > c) {
          b = a;
          c = this.N;
          d = a >> 1;
          a = c[a];
          e = a.priority;
          if (this.xg) {
            while (d > 0) {
              f = c[d];
              if (e - f.priority < 0) {
                c[b] = f;
                f.g = b;
                b = d;
                d >>= 1;
              } else {
                break;
              }
            }
          } else {
            while (d > 0) {
              f = c[d];
              if (e - f.priority > 0) {
                c[b] = f;
                f.g = b;
                b = d;
                d >>= 1;
              } else {
                break;
              }
            }
          }
          c[b] = a;
          a.g = b;
        } else {
          b = a;
          c = this.N;
          d = a << 1;
          e = c[a];
          f = e.priority;
          if (this.xg) {
            while (d < this.ba) {
              if (d < this.ba - 1 && c[d].priority - c[d + 1].priority > 0) {
                ++d;
              }
              a = c[d];
              if (f - a.priority > 0) {
                c[b] = a;
                a.g = b;
                b = e.g = d;
                d <<= 1;
              } else {
                break;
              }
            }
          } else {
            while (d < this.ba) {
              if (d < this.ba - 1 && c[d].priority - c[d + 1].priority < 0) {
                ++d;
              }
              a = c[d];
              if (f - a.priority < 0) {
                c[b] = a;
                a.g = b;
                b = e.g = d;
                d <<= 1;
              } else {
                break;
              }
            }
          }
          c[b] = e;
          e.g = b;
          a = this.ba;
          b = this.N;
          c = a >> 1;
          d = b[a];
          e = d.priority;
          if (this.xg) {
            while (c > 0) {
              f = b[c];
              if (e - f.priority < 0) {
                b[a] = f;
                f.g = a;
                a = c;
                c >>= 1;
              } else {
                break;
              }
            }
          } else {
            while (c > 0) {
              f = b[c];
              if (e - f.priority > 0) {
                b[a] = f;
                f.g = a;
                a = c;
                c >>= 1;
              } else {
                break;
              }
            }
          }
          b[a] = d;
          d.g = a;
        }
      }
    }
    clear(a) {
      if (a == null) {
        a = false;
      }
      if (a) {
        NativeArray.Or(this.N);
      }
      this.ba = 0;
    }
    iterator() {
      if (this.Dm) {
        if (this.sd == null) {
          return new ArrayReverseIter(this);
        }
        this.sd.reset();
        return this.sd;
      }
      return new ArrayReverseIter(this);
    }
    pR() {
      let a = this.ba >> 1;
      while (a >= 1) {
        this.vB(a, this.ba);
        --a;
      }
    }
    vB(a, b) {
      let c = this.N;
      var d = a << 1;
      var e = d + 1;
      let f = a;
      if (this.xg) {
        if (d <= b && c[d].priority - c[a].priority < 0) {
          f = d;
        }
        if (d + 1 <= b && c[d + 1].priority - c[f].priority < 0) {
          f = e;
        }
      } else {
        if (d <= b && c[d].priority - c[a].priority > 0) {
          f = d;
        }
        if (d + 1 <= b && c[d + 1].priority - c[f].priority > 0) {
          f = e;
        }
      }
      if (f != a) {
        d = c[f];
        e = c[a];
        c[f] = e;
        c[a] = d;
        a = d.g;
        d.g = e.g;
        e.g = a;
        this.vB(f, b);
      }
    }
    grow() {
      this.eb = GrowStrategy.On(this.Rj, this.eb);
      this.resizeContainer(this.eb);
    }
    resizeContainer(a) {
      a = Array(a + 1);
      NativeArray.Bn(this.N, 0, a, this.ba + 1);
      this.N = a;
    }
  }
  PriorityQueue.i = true;
  PriorityQueue.Ib = [C87];
  Object.assign(PriorityQueue.prototype, {
    l: PriorityQueue
  });
  class NativeArray {
    static Bn(a, b, c, d) {
      if (d > 0) {
        if (a == c) {
          if (b < 0) {
            c = b + d;
            b = 0 + d;
            for (var e = 0; e < d;) {
              ++e;
              --c;
              --b;
              a[b] = a[c];
            }
          } else if (b > 0) {
            c = b;
            e = b = 0;
            while (e < d) {
              ++e;
              a[b] = a[c];
              ++c;
              ++b;
            }
          }
        } else if (b == 0) {
          for (b = 0; b < d;) {
            e = b++;
            c[e] = a[e];
          }
        } else if (b == 0) {
          for (b = 0; b < d;) {
            e = b++;
            c[0 + e] = a[e];
          }
        } else {
          for (e = 0; e < d;) {
            let f = e++;
            c[f] = a[b + f];
          }
        }
      }
    }
    static Or(a) {
      var b;
      var c;
      if (c == null) {
        c = 0;
      }
      if (b == null) {
        b = 0;
      }
      let d = b;
      for (b = c <= 0 ? a.length : b + c; d < b;) {
        a[d++] = null;
      }
    }
    static WL(a, b, c) {
      let d = 0;
      let e;
      let f = c + 1;
      while (d < f) {
        e = d + (f - d >> 1);
        if (a[e] < b) {
          d = e + 1;
        } else {
          f = e;
        }
      }
      if (d <= c && a[d] == b) {
        return d;
      } else {
        return ~d;
      }
    }
  }
  NativeArray.i = true;
  class GrowableList {
    constructor() {
      this.list = [];
      this.size = 0;
    }
    add(a) {
      this.list[this.size++] = a;
    }
    get(a) {
      return this.list[a];
    }
  }
  GrowableList.i = true;
  Object.assign(GrowableList.prototype, {
    l: GrowableList
  });
  class C306 {}
  C306.i = true;
  C306.Je = true;
  Object.assign(C306.prototype, {
    l: C306
  });

  class HashMap {
    constructor() {
      this.J = {};
    }
    get(a) {
      return this.J[a];
    }
    remove(a) {
      if (!this.J.hasOwnProperty(a)) {
        return false;
      }
      delete this.J[a];
      return true;
    }
    keys() {
      let a = [];
      for (var b in this.J) {
        if (this.J.hasOwnProperty(b)) {
          a.push(+b);
        }
      }
      return new ArrayIter(a);
    }
    iterator() {
      return {
        ks: this.J,
        Ao: this.keys(),
        fb: function () {
          return this.Ao.fb();
        },
        next: function () {
          let a = this.Ao.next();
          return this.ks[a];
        }
      };
    }
  }
  HashMap.i = true;
  HashMap.Ib = [C306];
  Object.assign(HashMap.prototype, {
    l: HashMap
  });
  class KeyTable {
    constructor() {
      this.J = Object.create(null);
    }
    get(a) {
      return this.J[a];
    }
    keys() {
      return new ObjectIter(this.J);
    }
  }
  KeyTable.i = true;
  KeyTable.Ib = [C306];
  Object.assign(KeyTable.prototype, {
    l: KeyTable
  });
  class ArrayIter {
    constructor(a) {
      this.current = 0;
      this.Mz = a;
    }
    fb() {
      return this.current < this.Mz.length;
    }
    next() {
      return this.Mz[this.current++];
    }
  }
  ArrayIter.i = true;
  Object.assign(ArrayIter.prototype, {
    l: ArrayIter
  });
  class ArrayListIter {
    constructor(a) {
      this.ye = a;
      this.N = this.ye.N;
      this.yg = this.ye.ba;
      this.xe = 0;
    }
    cv() {
      this.N = this.ye = null;
    }
    fb() {
      return this.xe < this.yg;
    }
    next() {
      return this.N[this.xe++];
    }
  }
  ArrayListIter.i = true;
  ArrayListIter.Ib = [C83];
  Object.assign(ArrayListIter.prototype, {
    l: ArrayListIter
  });
  class UidGen {
    static next() {
      if (UidGen.xz == null) {
        UidGen.xz = 0;
      }
      return UidGen.xz++;
    }
  }
  UidGen.i = true;
  class GrowStrategy {
    static On(a, b) {
      if (a > 0) {
        b += a;
      } else {
        switch (a) {
          case -3:
            b <<= 1;
            break;
          case -2:
            b = (b * 3 >> 1) + 1;
            break;
          case -1:
            a = b + 1;
            b = (a >> 3) + (a < 9 ? 3 : 6);
            b += a;
            break;
          case 0:
            throw 5;
        }
      }
      return b;
    }
  }
  GrowStrategy.i = true;

  class NodeTreeIter {
    constructor(a) {
      this.top = 0;
      this.stack = [];
      this.push(a);
    }
    fb() {
      return this.top > 0;
    }
    next() {
      let a = this.stack[--this.top];
      this.push(a);
      return a;
    }
    push(a) {
      for (a = a.Me; a != null;) {
        this.stack[this.top++] = a;
        a = a.Y;
      }
    }
  }
  NodeTreeIter.i = true;
  Object.assign(NodeTreeIter.prototype, {
    l: NodeTreeIter
  });

  class ArrayReverseIter {
    constructor(a) {
      this.ye = a;
      this.reset();
    }
    reset() {
      this.xe = 0;
      this.yg = this.ye.ba;
      this.N = Array(this.yg);
      NativeArray.Bn(this.ye.N, 1, this.N, this.yg);
      return this;
    }
    fb() {
      return this.xe < this.yg;
    }
    next() {
      return this.N[this.xe++];
    }
  }
  ArrayReverseIter.i = true;
  ArrayReverseIter.Ib = [C83];
  Object.assign(ArrayReverseIter.prototype, {
    l: ArrayReverseIter
  });

  class OrderedMap {
    constructor() {
      this.J = {
        Wk: {}
      };
    }
    set(a, b) {
      let c = a.jf;
      if (c == null) {
        c = a.jf = host.zt++;
      }
      this.J[c] = b;
      this.J.Wk[c] = a;
    }
    get(a) {
      return this.J[a.jf];
    }
    remove(a) {
      a = a.jf;
      if (this.J.Wk[a] == null) {
        return false;
      }
      delete this.J[a];
      delete this.J.Wk[a];
      return true;
    }
    keys() {
      let a = [];
      for (var b in this.J.Wk) {
        if (this.J.hasOwnProperty(b)) {
          a.push(this.J.Wk[b]);
        }
      }
      return new ArrayIter(a);
    }
    iterator() {
      return {
        ks: this.J,
        Ao: this.keys(),
        fb: function () {
          return this.Ao.fb();
        },
        next: function () {
          let a = this.Ao.next();
          return this.ks[a.jf];
        }
      };
    }
  }
  OrderedMap.i = true;
  OrderedMap.Ib = [C306];
  Object.assign(OrderedMap.prototype, {
    l: OrderedMap
  });

  class ObjectIter {
    constructor(a) {
      this.J = a;
      this.keys = Object.keys(a);
      this.length = this.keys.length;
      this.current = 0;
    }
    fb() {
      return this.current < this.length;
    }
    next() {
      return this.keys[this.current++];
    }
  }
  ObjectIter.i = true;
  Object.assign(ObjectIter.prototype, {
    l: ObjectIter
  });
