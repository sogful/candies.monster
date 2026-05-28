  // Rect - axis-aligned rectangle (x, y, w, h). `oy`/`py`/`ny`/`qy`
  // on the class are the four Cohen-Sutherland clipping flags used
  // by $j.
  class Rect {
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }
    static clone(r) {
      return new Rect(r.x, r.y, r.w, r.h);
    }
    // Gm - 40% scale (used to convert from 2x art space to 1x).
    static from2x(r) {
      return new Rect(r.x * 0.4, r.y * 0.4, r.w * 0.4, r.h * 0.4);
    }
    // Ew - AABB overlap given two min/max pairs.
    static overlapAABB(aMinX, aMinY, aMaxX, aMaxY, bMinX, bMinY, bMaxX, bMaxY) {
      return !(aMinX > bMaxX) && !(aMaxX < bMinX) && !(aMinY > bMaxY) && !(aMaxY < bMinY);
    }
    // lk - point-in-rect (origin + size form).
    static pointInside(px, py, rx, ry, rw, rh) {
      if (px >= rx && px < rx + rw && py >= ry) {
        return py < ry + rh;
      } else {
        return false;
      }
    }
    // tt - Cohen-Sutherland outcode for `point` against the rect
    // [minX..maxX, minY..maxY]. Bit-flags: oy=left, py=right, ny=top,
    // qy=bottom.
    static outcode(minX, minY, maxX, maxY, point) {
      return (point.x < minX ? Rect.OUT_LEFT : 0)
           + (point.x > maxX ? Rect.OUT_RIGHT : 0)
           + (point.y < minY ? Rect.OUT_TOP : 0)
           + (point.y > maxY ? Rect.OUT_BOTTOM : 0);
    }
    // $j - Cohen-Sutherland line/rect intersection. Returns true if
    // the segment (x1,y1)-(x2,y2) intersects rect at (rx,ry,rw,rh).
    // The segment endpoints (m, n) are mutated as the algorithm clips.
    static lineIntersect(x1, y1, x2, y2, rx, ry, rw, rh) {
      let pA = new Vec2(x1, y1);
      let pB = new Vec2(x2, y2);
      let target;
      let maxX = rx + rw;
      let maxY = ry + rh;
      let codeA = Rect.outcode(rx, ry, maxX, maxY, pA);
      let codeB = Rect.outcode(rx, ry, maxX, maxY, pB);
      while (codeA != 0 || codeB != 0) {
        if ((codeA & codeB) != 0) {
          return false;
        }
        let outcode;
        if (codeA != 0) {
          outcode = codeA;
          target = pA;
        } else {
          outcode = codeB;
          target = pB;
        }
        if ((outcode & Rect.OUT_LEFT) > 0) {
          target.y += (y1 - y2) * (rx - target.x) / (x1 - x2);
          target.x = rx;
        } else if ((outcode & Rect.OUT_RIGHT) != 0) {
          target.y += (y1 - y2) * (maxX - target.x) / (x1 - x2);
          target.x = maxX;
        }
        if ((outcode & Rect.OUT_TOP) > 0) {
          target.x += (x1 - x2) * (ry - target.y) / (y1 - y2);
          target.y = ry;
        } else if ((outcode & Rect.OUT_BOTTOM) != 0) {
          target.x += (x1 - x2) * (maxY - target.y) / (y1 - y2);
          target.y = maxY;
        }
        if (outcode == codeA) {
          codeA = Rect.outcode(rx, ry, maxX, maxY, pA);
        } else {
          codeB = Rect.outcode(rx, ry, maxX, maxY, pB);
        }
      }
      return true;
    }
  }
  Rect.i = true;
  Object.assign(Rect.prototype, {
    l: Rect
  });

  // Bounds - axis-aligned box stored as edges: A=left, B=right,
  // D=top, G=bottom (cross-file used, kept stable).
  class Bounds {
    constructor(left, top, right, bottom) {
      this.left = left;
      this.top = top;
      this.right = right;
      this.bottom = bottom;
    }
    // add - union with another Bounds.
    add(b) {
      if (b.left < this.left) this.left = b.left;
      if (b.right > this.right) this.right = b.right;
      if (b.top < this.top) this.top = b.top;
      if (b.bottom > this.bottom) this.bottom = b.bottom;
    }
    // expand - grow to include `point`.
    expand(point) {
      let x = point.x;
      if (x < this.left) this.left = x;
      if (x > this.right) this.right = x;
      let y = point.y;
      if (y < this.top) this.top = y;
      if (y > this.bottom) this.bottom = y;
    }
    // scale - either uniform-from-origin (centred=false) or centred
    // (centred=true) by factor `s`.
    scale(s, centred) {
      if (centred) {
        let halfW = (this.right - this.left) / 2;
        let cx = this.left + halfW;
        this.left = cx - halfW * s;
        this.right = cx + halfW * s;
        let halfH = (this.bottom - this.top) / 2;
        let cy = this.top + halfH;
        this.top = cy - halfH * s;
        this.bottom = cy + halfH * s;
      } else {
        this.left *= s;
        this.top *= s;
        this.right *= s;
        this.bottom *= s;
      }
    }
    // fitAspect - fit a sub-bounds into the existing one matching the
    // given aspect ratio `ar` (width/height). The new bounds is
    // centred along whichever axis had spare room.
    fitAspect(ar) {
      let curW = this.right - this.left;
      let curH = this.bottom - this.top;
      let widthIfShorter = curW / ar;
      let heightIfTaller = curH / 1;
      if (widthIfShorter <= heightIfTaller) {
        let top = this.top + (curH - widthIfShorter) / 2;
        return new Bounds(this.left, top, this.right, top + widthIfShorter);
      }
      let newW = ar * heightIfTaller;
      let left = this.left + (curW - newW) / 2;
      return new Bounds(left, this.top, left + newW, this.bottom);
    }
  }
  Bounds.i = true;
  Object.assign(Bounds.prototype, {
    l: Bounds
  });

  class Size {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }
  Size.i = true;
  Object.assign(Size.prototype, {
    l: Size
  });

  // BoundsLite - identical layout to Bounds, no methods. Used where
  // an immutable bounds is needed without dragging in Bounds' method
  // table (cuts a little memory in tight inner loops).
  class BoundsLite {
    constructor(left, top, right, bottom) {
      this.left = left;
      this.top = top;
      this.right = right;
      this.bottom = bottom;
    }
  }
  BoundsLite.i = true;
  Object.assign(BoundsLite.prototype, {
    l: BoundsLite
  });

  class PointInRect {
    // RS - point-in-rect with rect anchored at origin (0,0,w,h).
    static test(px, py, w, h) {
      if (px >= 0 && px <= w && py >= 0) {
        return py <= h;
      } else {
        return false;
      }
    }
  }
  PointInRect.i = true;

  class PointInCircle {
    // Cx - point (px,py) inside circle centred at (cx,cy) radius r?
    static test(px, py, cx, cy, r) {
      px -= cx;
      py -= cy;
      return px * px + py * py < r * r;
    }
  }
  PointInCircle.i = true;

  class AABBTest {
    static test(a, b) {
      if (a.left >= b.right) return false;
      if (a.right <= b.left) return false;
      if (a.top >= b.bottom) return false;
      if (a.bottom <= b.top) return false;
      return true;
    }
  }
  AABBTest.i = true;
