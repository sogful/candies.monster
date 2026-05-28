  // Sprite sheet model + JSON / binary (.dat) loaders.
  //
  // SpriteSheet groups all frames with a SheetMeta describing the source
  // image. Each SpriteSheetFrame keeps:
  //   filename - name used by the engine to look up the frame
  //   frame    - rect inside the source image (TexRect)
  //   wE       - spriteSourceSize (the trimmed-frame's offset+size in
  //              the original untrimmed art)
  //   ec       - sourceSize (untrimmed art's full Size)
  //   Ip       - trimmed flag

  class SpriteSheet {
    constructor(frames, meta) {
      this.frames = frames;
      this.meta = meta;
    }
  }
  SpriteSheet.i = true;
  Object.assign(SpriteSheet.prototype, {
    l: SpriteSheet
  });

  class SpriteSheetFrame {
    constructor(filename, frameRect, spriteSourceSize, sourceSize, trimmed) {
      this.filename = filename;
      this.frame = frameRect;
      this.trimRect = spriteSourceSize;
      this.sourceSize = sourceSize;
      this.trimmed = trimmed;
    }
  }
  SpriteSheetFrame.i = true;
  Object.assign(SpriteSheetFrame.prototype, {
    l: SpriteSheetFrame
  });

  class SheetMeta {
    constructor(width, height, scale) {
      this.width = width;
      this.height = height;
      this.scale = scale;
    }
  }
  SheetMeta.i = true;
  Object.assign(SheetMeta.prototype, {
    l: SheetMeta
  });

  // SheetParser - two backends:
  //   parseJson(jsonString)  - TexturePacker JSON
  //   parseBinary(bytes)     - the engine's binary .dat sheet, packed via
  //                     BytesReader. Layout:
  //                       3 unused bytes (ta x3)
  //                       width, height, scale  (kc, kc, fR)
  //                       N frames as { name, frameRect, sourceSize, trim }
  //                       M animation groups, each expanding into N frames
  //                       named "<base>0001", "<base>0002", ...
  class SheetParser {
    constructor() {}
    parseJson(jsonString) {
      var json = JSON.parse(jsonString);
      let frames = [];
      let i = 0;
      let raw = json.frames;
      while (i < raw.length) {
        let f = raw[i++];
        let rect = f.frame;
        let spriteSize = f.spriteSourceSize;
        let sourceSize = f.sourceSize;
        frames.push(new SpriteSheetFrame(
          f.filename,
          new TexRect(rect.x, rect.y, rect.w, rect.h),
          new TexRect(spriteSize.x, spriteSize.y, spriteSize.w, spriteSize.h),
          new Size(sourceSize.w, sourceSize.h),
          f.trimmed
        ));
      }
      let meta = json.meta;
      return new SpriteSheet(frames, new SheetMeta(meta.size.w, meta.size.h, parseFloat(meta.scale)));
    }
    parseBinary(bytes) {
      function readFrame(filename) {
        return new SpriteSheetFrame(
          filename,
          new TexRect(reader.readInt16(), reader.readInt16(), reader.readInt16(), reader.readInt16()),
          new TexRect(reader.readInt16(), reader.readInt16(), reader.readInt16(), reader.readInt16()),
          new Size(reader.readInt16(), reader.readInt16()),
          reader.readByte() == 1
        );
      }
      let reader = new BytesReader(bytes);
      reader.readByte(); reader.readByte(); reader.readByte();
      let meta = new SheetMeta(reader.readInt16(), reader.readInt16(), reader.readFloat32());
      let frames = [];
      let frameCount = reader.readInt16();
      let i = 0;
      while (i < frameCount) {
        let name = reader.readString(reader.readInt16());
        frames.push(readFrame(name));
        ++i;
      }
      // animation groups - each entry expands into N sequentially-
      // numbered frames sharing the same per-frame metadata.
      let groupCount = reader.readInt16();
      for (i = 0; i < groupCount;) {
        let count = reader.readInt16();
        let baseName = reader.readString(reader.readInt16());
        let j = 0;
        while (j < count) {
          let suffix = "" + (j + 1);
          while (suffix.length < 4) {
            suffix = "0" + suffix;
          }
          frames.push(readFrame(baseName + suffix));
          ++j;
        }
        ++i;
      }
      return new SpriteSheet(frames, meta);
    }
  }
  SheetParser.i = true;
  Object.assign(SheetParser.prototype, {
    l: SheetParser
  });

  // SheetConvert.flatten - flatten a SpriteSheet into the engine's runtime
  // TextureFrame list (each frame numbered, with size + trim info ready
  // for the renderer to bind).
  class SheetConvert {
    static flatten(sheet) {
      let index = 0;
      let out = [];
      let i = 0;
      for (let frames = sheet.frames; i < frames.length;) {
        let f = frames[i++];
        out.push(new TextureFrame(index++, f.filename, f.sourceSize, f.frame, f.trimmed, new Size(f.trimRect.x, f.trimRect.y)));
      }
      return out;
    }
  }
  SheetConvert.i = true;
