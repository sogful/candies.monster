  class Keys {
    static padNum(a) {
      return StringUtil.padNumber4(a == null ? "null" : "" + a);
    }
    static indexed(a, b) {
      return a + Keys.padNum(b);
    }
    static range(a, b, c, d) {
      return InternKey.create((a == null ? "" : a + ",") + b + "-" + c + "@" + d);
    }
  }
  Keys.i = true;
  // Resources - global asset cache + helpers. Most fields are filled
  // in by Scene.loadTextures() and consumed by the rest of the engine
  // via short slot names (Resources.Wa = menu UI sheet, Resources.ic
  // = current font, etc.).
  class Resources {
    // langIndex - look up the index of `b` in the LANGUAGES list,
    // ensuring `a` appears at its sorted position (used to pick the
    // right font variant for a language).
    static langIndex(a, b) {
      let c = LANGUAGES.slice();
      c.sort(Comparator.compareLower);
      c.splice(c.indexOf(a), 0, a);
      return c.indexOf(b);
    }
  }
  Resources.i = true;
  class ScriptLoader {
    constructor() {
      this.newPriority = this.bumpPriority = 0;
      this.activeDownloads = [];
      this.loader = new PriorityQueue();
      this.version = null;
      this.totalDone = this.totalQueued = 0;
      this.maxConcurrent = 1;
    }
    load(a) {
      if (this.isQueued(a) || this.isLoaded(a) || this.isDecoding(a)) {
        return false;
      }
      this.totalQueued++;
      a = new ScriptDownload(a, this);
      a.priority = this.newPriority--;
      if (this.activeDownloads.length == this.maxConcurrent) {
        this.loader.enqueue(a);
        return true;
      }
      this.activeDownloads.push(a);
      a.load();
      return true;
    }
    stop() {
      this.loader.clear();
    }
    reprioritize(a) {
      if (this.isQueued(a) && !this.isLoaded(a) && !this.isDecoding(a)) {
        var b = Lambda.find(this.loader, function (c) {
          return c.req.url.indexOf(a) > -1;
        });
        if (b != null) {
          this.loader.reprioritize(b, ++this.bumpPriority);
        }
      }
    }
    progress(a) {
      if (this.totalQueued == 0) {
        return 1;
      }
      if (a == null) {
        return this.totalDone / this.totalQueued;
      }
      let b = this;
      return Lambda.count(a, function (c) {
        return b.isUrlLoaded(c);
      }) / a.length;
    }
    isUrlLoaded(a) {
      return Loader.isLoaded(Loader.idByName(a));
    }
    isQueued(a) {
      function b(c) {
        return c.req.url.indexOf(a) > -1;
      }
      if (this.loader == null) {
        return false;
      } else {
        return Lambda.count(this.loader, b) + Lambda.count(this.activeDownloads, b) > 0;
      }
    }
    onDownloadDone(a) {
      Std.remove(this.activeDownloads, a);
      this.totalDone++;
      if (this.loader.count == 0 && this.activeDownloads.length == 0) {
        this.newPriority = this.bumpPriority = 0;
      }
      let b = Loader.idByName(a.req.url);
      if (b >= 0) {
        Loader.setData(b, a.req.data);
      }
      if (this.loader.count > 0) {
        a = this.loader.dequeue();
        this.activeDownloads.push(a);
        a.load();
      }
    }
    cancel() {
      this.stop();
    }
    isLoaded(a) {
      return Loader.isLoaded(Loader.idByName(a));
    }
    isDecoding(a) {
      return Loader.isDecoding(Loader.idByName(a));
    }
  }
  ScriptLoader.i = true;
  Object.assign(ScriptLoader.prototype, {
    l: ScriptLoader
  });
  class DataReader {
    constructor(a) {
      this.entries = [];
      this.data = null;
      var b = new Uint8Array(a);
      var c = b.byteLength;
      if (b[c - 1] == 69) {
        var d = b[c - 6] | b[c - 5] << 8 | b[c - 4] << 16;
        var e = a.slice(c - (d + 6), c - 6);
        if ((b[c - 3] & 1) > 0) {
          a = Bytes.fromBuffer(a.slice(0, a.byteLength - (d + 6)));
          b = MD5.encode(Base64.encode(a));
          a = [];
          for (c = 0; c < 32;) {
            a.push(Std.charCode(b, c++));
          }
          b = new Uint8Array(e);
          c = 0;
          for (d = e.byteLength; c < d;) {
            var f = c++;
            b[f] ^= a[f & 31];
          }
        }
        this.data = Bytes.fromBuffer(e);
        e = new BytesReader(this.data);
        a = e.readByte();
        for (b = 0; b < a;) {
          ++b;
          d = e.readByte();
          f = e.readByte();
          c = null;
          let g = e.readUInt16();
          if (g > 0) {
            c = e.readString(g, v141.Ut);
          }
          if (d == 0) {
            d = e.readUInt16();
            f = new Bytes(new ArrayBuffer(d));
            e.readBytes(f, 0, d);
            this.entries.push(new NamedDataEntry(c, f, null));
          } else {
            this.entries.push(new NamedDataEntry(c, this.entries[f].data, f));
          }
        }
      }
    }
  }
  DataReader.i = true;
  Object.assign(DataReader.prototype, {
    l: DataReader
  });
  class Loader {
    static init() {
      Loader.data = new HashMap();
      Loader.metadata = new HashMap();
      Loader.asyncCallbacks = [];
      Loader.maxResolution = 1;
      Loader.language = "en";
      Loader.imageExt = "png";
      Loader.audioExt = null;
      Loader.nameTable = new KeyTable();
      Loader.decoders = new HashMap();
      Loader.decoding = new HashMap();
      Loader.keysByName = null;
      Loader.extensions = new HashMap();
      Loader.extensions.map[0] = ["wav", "ogg", "aac"];
      Loader.extensions.map[2] = ["png", "jpg"];
      Loader.extensions.map[3] = ["txt", "json", "tmj", "tsj"];
      Loader.extensions.map[1] = ["dat", "tps", "fnt", "zst"];
      Loader.extensions.map[4] = ["mp4"];
    }
    static setMaxResolution(a) {
      Loader.maxResolution = a;
    }
    static getLanguage() {
      return Loader.language;
    }
    static setLanguage(a) {
      var b;
      if (b == null) {
        b = false;
      }
      if (a == null) {
        a = "en";
      }
      a = a.toLowerCase();
      var c = Loader.languageList();
      if (c.length > 0 && !Lambda.exists(c, function (d) {
        return d == a;
      })) {
        a = "en";
      }
      if (b && a != Loader.language) {
        b = 0;
        c = Loader.paths;
        while (b < c.length) {
          let d = c[b];
          ++b;
          if (new EReg("{language}", "").match(d)) {
            Loader.idByName(d);
            Loader.purge(Loader.idByName(d));
          }
        }
      }
      Loader.language = a;
      return Loader.language;
    }
    static selectImageFormat() {
      // was: Loader.imageExt = "avif"; - switched to png everywhere
    }
    static getResolutionLevel(a) {
      var b = new RegExp("^(" + Loader.prefix + "/)", "");
      a = Loader.getUrl(a).replace(b, "");
      b = new EReg("-(\\d)x", "");
      if (b.match(a)) {
        return Numeric.parseInt(b.matched(1));
      } else {
        return 1;
      }
    }
    static maxResolutionLevel(a) {
      return Loader.RESOLUTIONS[a];
    }
    static getAudioExt() {
      return Loader.audioExt;
    }
    static setAudioExt(a) {
      Loader.audioExt = a;
    }
    static getType(a) {
      let b = 0;
      while (b < 5) {
        let c = b++;
        if (new EReg("\\.(" + Loader.extensions.map[c].join("|") + ")", "mi").match(a)) {
          return c;
        }
      }
      throw 21;
    }
    // getUrl - resolve resource id `a` to its URL string, substituting
    // {language}/{image}/{audio}/{resolution} placeholders against the
    // currently-selected language and best-supported image / audio
    // codec / DPI tier.
    static getUrl(a) {
      let b = Loader.paths[a];
      if (b == null) {
        return null;
      }
      let c = new EReg("{(?:language|image|audio|resolution)}", "");
      if (c.match(b)) {
        c = new EReg("{language}", "");
        if (c.match(b) && Loader.language != null) {
          b = b.replace(c.r, "-" + Loader.language);
        }
        c = new EReg("{image}", "g");
        if (c.match(b) && Loader.imageExt != null) {
          b = b.replace(c.r, Loader.imageExt);
        }
        c = new EReg("{audio}", "g");
        if (c.match(b) && Loader.audioExt != null) {
          b = b.replace(c.r, Loader.audioExt);
        }
        c = new EReg("{resolution}", "g");
        if (c.match(b) && Loader.maxResolution != null) {
          b = Loader.maxResolution == 1 ? b.replace(c.r, "") : b.replace(c.r, "-" + Math.min(Loader.maxResolutionLevel(a), Loader.maxResolution) + "x");
        }
      }
      return "" + Loader.prefix + "/" + b;
    }
    static allUrls() {
      var a;
      if (a == null) {
        a = Loader.allIds();
      }
      let b = [];
      let c = 0;
      while (c < a.length) {
        let d = Loader.getUrl(a[c++]);
        if (d != null) {
          b.push(d);
        }
      }
      return b;
    }
    static allIds() {
      let a = [];
      let b = 0;
      let c = Loader.MAX;
      while (b < c) {
        a.push(b++);
      }
      return a;
    }
    static iterator() {
      return new AssetIdIter();
    }
    static filterLanguageRes() {
      let a = Loader.LANGUAGE_RESOURCES;
      let b = [];
      let c = 0;
      while (c < a.length) {
        let d = a[c];
        ++c;
        if (Loader.canLoad(d)) {
          b.push(d);
        }
      }
      return b;
    }
    static filterImageRes() {
      let a = Loader.IMAGE_RESOURCES;
      let b = [];
      let c = 0;
      while (c < a.length) {
        let d = a[c];
        ++c;
        if (Loader.canLoad(d)) {
          b.push(d);
        }
      }
      return b;
    }
    // idForExt - look up the resource id whose URL is `a` rewritten
    // with extension `b`. `c` strips the `.p.` infix some sheet
    // variants use.
    static idForExt(a, b, c) {
      if (c == null) {
        c = false;
      }
      let d = RegExp("\\.(\\w+)$", "");
      a = Loader.getUrl(a).replace(d, "." + b);
      if (c) {
        a = a.replace(RegExp("\\.p\\.", ""), ".");
      }
      return Loader.idByName(a);
    }
    // idByName - reverse-lookup a path string to its resource id.
    // Walks the name table first (Qw), then strips the project prefix
    // and tries the URL table (Ce) with progressively more aggressive
    // language / DPI / codec normalisation.
    static idByName(a) {
      function b(d, e) {
        a = a.replace(new RegExp(d, ""), e);
      }
      if (Object.prototype.hasOwnProperty.call(Loader.nameTable.map, a)) {
        return Numeric.parseInt(Loader.nameTable.map[a]);
      }
      b("^(" + Loader.prefix + "/)(.*)", "$2");
      var c = Loader.paths.indexOf(a);
      if (c != -1) {
        return c;
      }
      c = Loader.languageList();
      if (c.length > 0) {
        b("-(" + c.join("|") + ")", "{language}");
      }
      if (Loader.resolutionList.includes(a)) {
        b("(\\.\\w+)$", "{resolution}$1");
      } else {
        b("[\\/-][124]x", "{resolution}");
      }
      c = Loader.paths.indexOf(a);
      if (c != -1) {
        return c;
      }
      if (new EReg("(" + Loader.extensions.map[2].join("|") + ")", "g").match(a)) {
        c = Loader.imageFormats();
        if (c.length > 0) {
          b("(.*?)\\.(" + c.join("|") + ")$", "$1.{image}");
          b("((" + c.join("|") + ")\\/)", "{image}/");
        }
      } else if (new EReg("(" + Loader.extensions.map[0].join("|") + ")", "g").match(a)) {
        c = Loader.audioFormats();
        if (c.length > 0) {
          b("(.*?)\\.(" + c.join("|") + ")$", "$1.{audio}");
          b("((" + c.join("|") + ")\\/)", "{audio}/");
        }
      }
      return Loader.paths.indexOf(a);
    }
    // getText - read resource `a` from the data table as a string.
    // Accepts string or ArrayBuffer-backed entries; UTF-8 decoded.
    static getText(a) {
      a = Loader.data.map[a];
      if (typeof a == "string") {
        return a;
      }
      if (a instanceof ArrayBuffer) {
        if ("TextDecoder" in window) {
          a = new DataView(a);
          return new TextDecoder("utf-8").decode(a);
        }
        a = Bytes.fromBuffer(a);
        return a.decodeString(0, a.length);
      }
      return null;
    }
    // getBytes - read resource `a` as a Bytes object.
    static getBytes(a) {
      return Bytes.fromBuffer(Loader.data.map[a]);
    }
    static idByName2(a) {
      if (Loader.keysByName == null) {
        Loader.keysByName = new KeyTable();
        let b = 0;
        let c = Loader.manifest;
        while (b < c.length) {
          let d = c[b++].split(":");
          Loader.keysByName.map[Loader.prefix + "/" + d[0]] = Numeric.parseInt(d[1]);
        }
      }
      return Loader.keysByName.map[a];
    }
    static canLoad(a) {
      if (Loader.isAudioResource(a)) {
        if (Loader.audioExt == null) {
          return false;
        } else {
          return Lambda.exists(Loader.audioFormats(), function (b) {
            return b == Loader.audioExt;
          });
        }
      } else {
        return true;
      }
    }
    static setData(a, b) {
      if (Loader.decoders.map.hasOwnProperty(a) && Loader.decoding.map[a] == 0) {
        Loader.decoding.map[a] = 1;
        Loader.decoders.map[a](a, b, function (c) {
          Loader.decoding.map[a] = 2;
          Loader.setData(a, c);
        });
      } else {
        Loader.data.map[a] = b;
        b = Loader.asyncCallbacks;
        let c = b.length;
        while (--c > -1) {
          if (b[c].id == a) {
            let d = b[c];
            b[c] = b[b.length - 1];
            b.pop();
            d.fire();
          }
        }
      }
    }
    // isLoaded - has resource id `a` been fetched into the data table?
    static isLoaded(a) {
      return Loader.data.map[a] != null;
    }
    static purge(a) {
      Loader.data.map[a] = null;
      Loader.data.remove(a);
      Loader.decoding.map[a] = 0;
    }
    static setMetadata(a, b) {
      Loader.metadata.map[a] = b;
    }
    static getMetadata(a) {
      return Loader.metadata.map[a];
    }
    static isAudioResource(a) {
      if (a > 1000) {
        a = Loader.nameTable.map[a == null ? "null" : "" + a];
        return new EReg("(ogg|aac|mp3|wav)$", "").match(a);
      } else {
        return new EReg("{audio}", "").match(Loader.paths[a]);
      }
    }
    static isMusic(a) {
      return new EReg("music", "").match(Loader.paths[a]);
    }
    static isImageResource(a) {
      a = Loader.paths[a];
      let b = new EReg("{image}", "g");
      if (b.match(a) && Loader.imageExt != null) {
        a = a.replace(b.r, Loader.imageExt);
      }
      return new EReg("\\.(" + Loader.extensions.map[2].join("|") + ")$", "").match(a);
    }
    static isDecoding(a) {
      return Loader.decoding.map[a] == 1;
    }
    static onceLoaded(a, b) {
      if (Loader.getUrl(a) != null) {
        if (Loader.isLoaded(a)) {
          b(a);
        } else {
          Loader.asyncCallbacks.push(new AsyncCallback(a, b));
        }
      }
    }
    static setDecoder(a, b) {
      Loader.decoders.map[a] = b;
      Loader.decoding.map[a] = 0;
    }
    static audioFormats() {
      return ["ogg", "aac"].slice();
    }
    static imageFormats() {
      return ["png", "jpg"].slice();
    }
    static languageList() {
      return "ru nl ko ja it fr es en de br".split(" ").slice();
    }
  }
  Loader.i = true;

  class C91 {}
  C91.i = true;
  C91.Je = true;
  Object.assign(C91.prototype, {
    l: C91
  });
  class ScriptDownload {
    constructor(a, b) {
      this.req = new AssetXHR(a, b.version);
      this.loader = b;
    }
    load() {
      let a = this;
      this.req.load(function () {
        ScriptLoader.totalLoaded += Loader.idByName2(a.req.url);
        a.loader.onDownloadDone(a);
        a.free();
      }, function () {
        a.loader.cancel();
        a.free();
      });
    }
    free() {
      this.loader = null;
      this.req.free();
    }
  }
  ScriptDownload.i = true;
  ScriptDownload.Ib = [C91];
  Object.assign(ScriptDownload.prototype, {
    l: ScriptDownload
  });
  class NamedDataEntry {
    constructor(a, b, c) {
      this.name = a;
      this.data = b;
      this.aliasOf = c;
    }
  }
  NamedDataEntry.i = true;
  Object.assign(NamedDataEntry.prototype, {
    l: NamedDataEntry
  });
  class AssetIdIter {
    constructor() {
      this.idx = 0;
    }
    hasNext() {
      return this.idx < Loader.MAX;
    }
    next() {
      return this.idx++;
    }
  }
  AssetIdIter.i = true;
  Object.assign(AssetIdIter.prototype, {
    l: AssetIdIter
  });
  class AssetXHR {
    constructor(a, b) {
      this.onDone = this.onError = null;
      this.progress = 0;
      this.data = null;
      this.url = a;
      this.version = b;
    }
    free() {
      this.onError = this.onDone = this.data = null;
    }
    load(a, b) {
      this.onDone = a;
      this.onError = b;
      let c;
      switch (Loader.getType(this.url)) {
        case 0:
          c = "arraybuffer";
          break;
        case 1:
          c = "arraybuffer";
          break;
        case 2:
          c = "blob";
          break;
        case 3:
          c = "text";
          break;
        case 4:
          c = "blob";
      }
      let d = this;
      this.createXHR(this.url, c, function (e) {
        d.onData(e);
      });
    }
    createXHR(a, b, c) {
      let d = new XMLHttpRequest();
      let e = this;
      d.onerror = function () {
        if (e.onError != null) {
          e.onError();
        }
        d.onerror = d.onload = d.onprogress = null;
      };
      d.onload = function () {
        e.progress = 1;
        if (d.status == 404) {
          if (e.onError != null) {
            e.onError();
          }
        } else {
          var f = d.response;
          d.onerror = d.onload = d.onprogress = null;
          c(f);
        }
      };
      d.onprogress = function (f) {
        if (f.total > 0) {
          e.progress = f.loaded / f.total;
        }
      };
      try {
        d.open("GET", this.version != null ? "" + a + "?v=" + this.version : a, true);
        d.responseType = b;
        d.send();
      } catch (f) {}
    }
    onData(a) {
      this.data = a;
      this.onDone();
      this.onDone = null;
    }
  }
  AssetXHR.i = true;
  Object.assign(AssetXHR.prototype, {
    l: AssetXHR
  });
