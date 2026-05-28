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
      this.cachedIter = null;
      this.count = 0;
      this.reusableIter = false;
      this.growStrategy = -2;
      this.initCapacity = a < 2 ? 2 : a;
      if (b != null && b.length > 0) {
        this.count = b.length;
        this.array = b.slice(0, b.length);
        this.capacity = this.count;
      } else {
        this.capacity = this.initCapacity;
        this.array = Array(this.capacity);
      }
      if (c) {
        this.growStrategy = 0;
      }
    }
    pushBack(a) {
      if (this.count == this.capacity) {
        this.grow();
      }
      this.array[this.count++] = a;
    }
    front() {
      return this.array[0];
    }
    swapPop(a) {
      let b = this.array;
      b[a] = b[--this.count];
    }
    trim(a) {
      this.count = a;
      return this;
    }
    indexOf(a) {
      if (this.count == 0) {
        return -1;
      }
      let b = 0;
      let c = -1;
      let d = this.count - 1;
      let e = this.array;
      do {
        if (e[b] == a) {
          c = b;
          break;
        }
      } while (b++ < d);
      return c;
    }
    reserve(a) {
      if (a > this.capacity) {
        this.capacity = a;
        this.resizeContainer(a);
      }
    }
    init(a, b) {
      this.reserve(a);
      this.count = a;
      let c = this.array;
      let d = 0;
      while (d < a) {
        c[d++] = b;
      }
    }
    pack() {
      if (this.capacity > this.initCapacity) {
        var a = this.initCapacity;
        var b = this.count;
        this.capacity = a > b ? a : b;
        this.resizeContainer(this.capacity);
      } else {
        a = this.array;
        b = this.count;
        let c = this.capacity;
        while (b < c) {
          a[b++] = null;
        }
      }
    }
    grow() {
      this.capacity = GrowStrategy.compute(this.growStrategy, this.capacity);
      this.resizeContainer(this.capacity);
    }
    resizeContainer(a) {
      a = Array(a);
      NativeArray.blit(this.array, 0, a, this.count);
      this.array = a;
    }
    freeNative() {
      NativeArray.fill(this.array);
      this.array = null;
      if (this.cachedIter != null) {
        this.cachedIter.freeNative();
        this.cachedIter = null;
      }
    }
    clear(a) {
      if (a == null) {
        a = false;
      }
      if (a) {
        NativeArray.fill(this.array);
      }
      this.count = 0;
    }
    iterator() {
      if (this.reusableIter) {
        if (this.cachedIter == null) {
          this.cachedIter = new ArrayListIter(this);
        } else {
          let a = this.cachedIter;
          a.array = a.list.array;
          a.end = a.list.count;
          a.idx = 0;
        }
        return this.cachedIter;
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
      this.cachedIter = null;
      this.reusableIter = false;
      if (c != null) {
        this.cols = a;
        this.rows = b;
        a = this.array = Array(this.cols * this.rows);
        b = 0;
        let d = this.cols * this.rows;
        while (b < d) {
          let e = b++;
          a[e] = c[e];
        }
      } else {
        this.cols = a;
        this.rows = b;
        this.array = Array(this.cols * this.rows);
      }
    }
    forEach(a) {
      let b = this.array;
      let c = this.cols;
      let d = 0;
      let e = this.cols * this.rows;
      while (d < e) {
        let f = d++;
        b[f] = a(b[f], f % c, f / c | 0);
      }
      return this;
    }
    forEachValue(a) {
      let b = this.array;
      let c = 0;
      let d = this.cols * this.rows;
      while (c < d) {
        a(b[c++]);
      }
      return this;
    }
    resize(a, b) {
      if (a == this.cols && b == this.rows) {
        return this;
      }
      let c = this.array;
      this.array = Array(a * b);
      if (a == this.cols) {
        NativeArray.blit(c, 0, this.array, this.cols * (b < this.rows ? b : this.rows));
        this.cols = a;
        this.rows = b;
        return this;
      }
      let d = a < this.cols ? a : this.cols;
      let e;
      let f = this.array;
      let g = 0;
      let h = b < this.rows ? b : this.rows;
      while (g < h) {
        var m = g++;
        e = m * a;
        m *= this.cols;
        let n = 0;
        let q = d;
        while (n < q) {
          let p = n++;
          f[e + p] = c[m + p];
        }
      }
      this.cols = a;
      this.rows = b;
      return this;
    }
    iterator() {
      if (this.reusableIter) {
        if (this.cachedIter == null) {
          this.cachedIter = new Grid2DIter(this);
        } else {
          let a = this.cachedIter;
          a.array = a.list.array;
          let b = a.list;
          a.end = b.cols * b.rows;
          a.idx = 0;
        }
        return this.cachedIter;
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
      this.list = a;
      this.array = this.list.array;
      a = this.list;
      this.end = a.cols * a.rows;
      this.idx = 0;
    }
    hasNext() {
      return this.idx < this.end;
    }
    next() {
      return this.array[this.idx++];
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
      this.count = 0;
      this.growStrategy = -2;
      this.capacity = this.initCapacity = a < 1 ? 1 : a;
      if (b != null) {
        a = this.count = b.length;
        var d = this.capacity;
        this.capacity = a > d ? a : d;
      }
      this.array = Array(this.capacity);
      if (b != null) {
        a = this.array;
        d = 0;
        let e = this.count;
        while (d < e) {
          let f = d++;
          a[f] = b[f];
        }
      }
      if (c) {
        this.growStrategy = 0;
      }
    }
    reserve(a) {
      if (a > this.capacity) {
        this.capacity = a;
        this.resizeContainer(a);
      }
    }
    top() {
      return this.array[this.count - 1];
    }
    clear(a) {
      if (a == null) {
        a = false;
      }
      if (a) {
        NativeArray.fill(this.array);
      }
      this.count = 0;
    }
    grow() {
      this.capacity = GrowStrategy.compute(this.growStrategy, this.capacity);
      this.resizeContainer(this.capacity);
    }
    resizeContainer(a) {
      a = Array(a);
      NativeArray.blit(this.array, 0, a, this.count);
      this.array = a;
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
      this.cachedIter = null;
      this.count = 0;
      this.reusableIter = false;
      this.growStrategy = -2;
      this.initCapacity = a < 1 ? 1 : a;
      this.capacity = a;
      this.minHeap = b;
      if (c != null) {
        a = this.count = c.length;
        b = this.capacity;
        this.capacity = a > b ? a : b;
      }
      this.array = Array(this.capacity + 1);
      this.array[0] = null;
      if (c != null) {
        a = this.array;
        b = 1;
        let d = this.count + 1;
        while (b < d) {
          let e = b++;
          a[e] = c[e - 1];
        }
        this.buildHeap();
      }
    }
    enqueue(a) {
      if (this.count == this.capacity) {
        this.grow();
      }
      this.array[++this.count] = a;
      a = a.g = this.count;
      let b = this.array;
      let c = a >> 1;
      let d = b[a];
      let e = d.priority;
      if (this.minHeap) {
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
    dequeue() {
      var a = this.array;
      let b = a[1];
      b.g = -1;
      a[1] = a[this.count];
      a = 1;
      let c = this.array;
      let d = 2;
      let e;
      let f = c[1];
      let g = f.priority;
      if (this.minHeap) {
        while (d < this.count) {
          if (d < this.count - 1 && c[d].priority - c[d + 1].priority > 0) {
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
        while (d < this.count) {
          if (d < this.count - 1 && c[d].priority - c[d + 1].priority < 0) {
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
      this.count--;
      return b;
    }
    reprioritize(a, b) {
      var c = a.priority;
      if (c != b) {
        a.priority = b;
        a = a.g;
        if (this.minHeap) {
          if (b < c) {
            b = a;
            c = this.array;
            var d = a >> 1;
            a = c[a];
            var e = a.priority;
            if (this.minHeap) {
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
            c = this.array;
            d = a << 1;
            e = c[a];
            f = e.priority;
            if (this.minHeap) {
              while (d < this.count) {
                if (d < this.count - 1 && c[d].priority - c[d + 1].priority > 0) {
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
              while (d < this.count) {
                if (d < this.count - 1 && c[d].priority - c[d + 1].priority < 0) {
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
            a = this.count;
            b = this.array;
            c = a >> 1;
            d = b[a];
            e = d.priority;
            if (this.minHeap) {
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
          c = this.array;
          d = a >> 1;
          a = c[a];
          e = a.priority;
          if (this.minHeap) {
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
          c = this.array;
          d = a << 1;
          e = c[a];
          f = e.priority;
          if (this.minHeap) {
            while (d < this.count) {
              if (d < this.count - 1 && c[d].priority - c[d + 1].priority > 0) {
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
            while (d < this.count) {
              if (d < this.count - 1 && c[d].priority - c[d + 1].priority < 0) {
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
          a = this.count;
          b = this.array;
          c = a >> 1;
          d = b[a];
          e = d.priority;
          if (this.minHeap) {
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
        NativeArray.fill(this.array);
      }
      this.count = 0;
    }
    iterator() {
      if (this.reusableIter) {
        if (this.cachedIter == null) {
          return new ArrayReverseIter(this);
        }
        this.cachedIter.reset();
        return this.cachedIter;
      }
      return new ArrayReverseIter(this);
    }
    buildHeap() {
      let a = this.count >> 1;
      while (a >= 1) {
        this.siftDown(a, this.count);
        --a;
      }
    }
    siftDown(a, b) {
      let c = this.array;
      var d = a << 1;
      var e = d + 1;
      let f = a;
      if (this.minHeap) {
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
        this.siftDown(f, b);
      }
    }
    grow() {
      this.capacity = GrowStrategy.compute(this.growStrategy, this.capacity);
      this.resizeContainer(this.capacity);
    }
    resizeContainer(a) {
      a = Array(a + 1);
      NativeArray.blit(this.array, 0, a, this.count + 1);
      this.array = a;
    }
  }
  PriorityQueue.i = true;
  PriorityQueue.Ib = [C87];
  Object.assign(PriorityQueue.prototype, {
    l: PriorityQueue
  });
  class NativeArray {
    static blit(a, b, c, d) {
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
    static fill(a) {
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
    static binarySearch(a, b, c) {
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
      this.map = {};
    }
    get(a) {
      return this.map[a];
    }
    remove(a) {
      if (!this.map.hasOwnProperty(a)) {
        return false;
      }
      delete this.map[a];
      return true;
    }
    keys() {
      let a = [];
      for (var b in this.map) {
        if (this.map.hasOwnProperty(b)) {
          a.push(+b);
        }
      }
      return new ArrayIter(a);
    }
    iterator() {
      return {
        store: this.map,
        keyIter: this.keys(),
        hasNext: function () {
          return this.keyIter.hasNext();
        },
        next: function () {
          let a = this.keyIter.next();
          return this.store[a];
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
      this.map = Object.create(null);
    }
    get(a) {
      return this.map[a];
    }
    keys() {
      return new ObjectIter(this.map);
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
      this.arr = a;
    }
    hasNext() {
      return this.current < this.arr.length;
    }
    next() {
      return this.arr[this.current++];
    }
  }
  ArrayIter.i = true;
  Object.assign(ArrayIter.prototype, {
    l: ArrayIter
  });
  class ArrayListIter {
    constructor(a) {
      this.list = a;
      this.array = this.list.array;
      this.end = this.list.count;
      this.idx = 0;
    }
    freeNative() {
      this.array = this.list = null;
    }
    hasNext() {
      return this.idx < this.end;
    }
    next() {
      return this.array[this.idx++];
    }
  }
  ArrayListIter.i = true;
  ArrayListIter.Ib = [C83];
  Object.assign(ArrayListIter.prototype, {
    l: ArrayListIter
  });
  class UidGen {
    static next() {
      if (UidGen.counter == null) {
        UidGen.counter = 0;
      }
      return UidGen.counter++;
    }
  }
  UidGen.i = true;
  class GrowStrategy {
    static compute(a, b) {
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
    hasNext() {
      return this.top > 0;
    }
    next() {
      let a = this.stack[--this.top];
      this.push(a);
      return a;
    }
    push(a) {
      for (a = a.firstChild; a != null;) {
        this.stack[this.top++] = a;
        a = a.nextSibling;
      }
    }
  }
  NodeTreeIter.i = true;
  Object.assign(NodeTreeIter.prototype, {
    l: NodeTreeIter
  });

  class ArrayReverseIter {
    constructor(a) {
      this.list = a;
      this.reset();
    }
    reset() {
      this.idx = 0;
      this.end = this.list.count;
      this.array = Array(this.end);
      NativeArray.blit(this.list.array, 1, this.array, this.end);
      return this;
    }
    hasNext() {
      return this.idx < this.end;
    }
    next() {
      return this.array[this.idx++];
    }
  }
  ArrayReverseIter.i = true;
  ArrayReverseIter.Ib = [C83];
  Object.assign(ArrayReverseIter.prototype, {
    l: ArrayReverseIter
  });

  class OrderedMap {
    constructor() {
      this.map = {
        Wk: {}
      };
    }
    set(a, b) {
      let c = a.jf;
      if (c == null) {
        c = a.jf = host.zt++;
      }
      this.map[c] = b;
      this.map.Wk[c] = a;
    }
    get(a) {
      return this.map[a.jf];
    }
    remove(a) {
      a = a.jf;
      if (this.map.Wk[a] == null) {
        return false;
      }
      delete this.map[a];
      delete this.map.Wk[a];
      return true;
    }
    keys() {
      let a = [];
      for (var b in this.map.Wk) {
        if (this.map.hasOwnProperty(b)) {
          a.push(this.map.Wk[b]);
        }
      }
      return new ArrayIter(a);
    }
    iterator() {
      return {
        store: this.map,
        keyIter: this.keys(),
        hasNext: function () {
          return this.keyIter.hasNext();
        },
        next: function () {
          let a = this.keyIter.next();
          return this.store[a.jf];
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
      this.map = a;
      this.keys = Object.keys(a);
      this.length = this.keys.length;
      this.current = 0;
    }
    hasNext() {
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
