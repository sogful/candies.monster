  class SpriteSheet {
    constructor(a, b) {
      this.frames = a;
      this.em = b;
    }
  }
  SpriteSheet.i = true;
  Object.assign(SpriteSheet.prototype, {
    l: SpriteSheet
  });
  class SpriteSheetFrame {
    constructor(a, b, c, d, e) {
      this.filename = a;
      this.frame = b;
      this.wE = c;
      this.ec = d;
      this.Ip = e;
    }
  }
  SpriteSheetFrame.i = true;
  Object.assign(SpriteSheetFrame.prototype, {
    l: SpriteSheetFrame
  });
  class SheetMeta {
    constructor(a, b, c) {
      this.width = a;
      this.height = b;
      this.scale = c;
    }
  }
  SheetMeta.i = true;
  Object.assign(SheetMeta.prototype, {
    l: SheetMeta
  });
  class SheetParser {
    constructor() {}
    hR(a) {
      var b = JSON.parse(a);
      a = [];
      let c = 0;
      let d = b.frames;
      while (c < d.length) {
        let e = d[c];
        ++c;
        let f = e.frame;
        let g = e.spriteSourceSize;
        let h = e.sourceSize;
        a.push(new SpriteSheetFrame(e.filename, new TexRect(f.x, f.y, f.w, f.h), new TexRect(g.x, g.y, g.w, g.h), new Size(h.w, h.h), e.trimmed));
      }
      b = b.meta;
      return new SpriteSheet(a, new SheetMeta(b.size.w, b.size.h, parseFloat(b.scale)));
    }
    nD(a) {
      function b(h) {
        return new SpriteSheetFrame(h, new TexRect(c.kc(), c.kc(), c.kc(), c.kc()), new TexRect(c.kc(), c.kc(), c.kc(), c.kc()), new Size(c.kc(), c.kc()), c.ta() == 1);
      }
      let c = new BytesReader(a);
      c.ta();
      c.ta();
      c.ta();
      a = new SheetMeta(c.kc(), c.kc(), c.fR());
      let d = [];
      let e = c.kc();
      let f = 0;
      while (f < e) {
        var g = c.hs(c.kc());
        d.push(b(g));
        ++f;
      }
      e = c.kc();
      for (f = 0; f < e;) {
        g = c.kc();
        let h = c.hs(c.kc());
        let m = 0;
        while (m < g) {
          let n = "" + (m + 1);
          while (n.length < 4) {
            n = "0" + n;
          }
          d.push(b(h + n));
          ++m;
        }
        ++f;
      }
      return new SpriteSheet(d, a);
    }
  }
  SheetParser.i = true;
  Object.assign(SheetParser.prototype, {
    l: SheetParser
  });
  class SheetConvert {
    static Gl(a) {
      let b = 0;
      let c = [];
      let d = 0;
      for (a = a.frames; d < a.length;) {
        let e = a[d];
        ++d;
        c.push(new TextureFrame(b++, e.filename, e.ec, e.frame, e.Ip, new Size(e.wE.x, e.wE.y)));
      }
      return c;
    }
  }
  SheetConvert.i = true;
