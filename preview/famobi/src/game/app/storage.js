  class SaveBase {
    constructor(a) {
      this.storage = a;
      this.CR = this.RB = false;
      this.version = this.ho();
      this.reset();
    }
    load(a) {
      let b = this;
      this.storage.load(function (c) {
        let d = false;
        try {
          if (c != null) {
            b.parse(c);
            if (b.version > b.ho()) {
              throw 4;
            }
            for (c = false; b.version < b.ho();) {
              b.Zr(b.version + 1);
              b.version++;
              c = true;
            }
            if (c) {
              b.save(a);
              return;
            }
          } else {
            d = true;
          }
        } catch (e) {
          d = true;
        }
        if (d) {
          b.reset();
          b.save(a);
        } else {
          a();
        }
      });
    }
    save(a) {
      this.RB = true;
      let b = this;
      this.storage.save(this.stringify(), function (c) {
        b.RB = false;
        b.CR = c == 0;
        a();
      });
    }
  }
  SaveBase.i = true;
  Object.assign(SaveBase.prototype, {
    l: SaveBase
  });
  class Save extends SaveBase {
    constructor(a) {
      super(a);
      Save.instance = this;
      this.reset();
    }
    reset() {
      this.version = this.ho();
      Save.Ec = true;
      Save.Bd = true;
      Save.Yi(null);
      Save.me = WebApplication.xmasMode ? 3 : 0;
      Save.hint = 1;
      Save.Dl = false;
      Save.wg = [];
      Save.ig = [];
      Save.Df = [];
      Save.locked = [];
      Save.Ho = false;
      Save.Dp = false;
      Save.Mi = [];
      Save.kk = 0;
      let a = 1;
      while (a <= 17) {
        this.FB(a, a != 1 && a != 6 && a != 11);
        ++a;
      }
    }
    parse(a) {
      a = JSON.parse(a);
      this.version = a.v;
      Save.Ec = a.music;
      Save.Bd = a.sound;
      Save.Yi(a.language);
      Save.wg = a.levelStars;
      Save.Df = a.levelCleared;
      Save.locked = a.locked;
      if (this.version >= 2) {
        Save.hint = a.hint;
        Save.me = a.skin;
        Save.Dl = a.gameWon;
      }
      Save.me = WebApplication.xmasMode ? 3 : Save.me;
      if (this.version >= 3) {
        Save.ig = a.blueStars;
        Save.Ho = a.magnetUsed;
        Save.Dp = a.levelCleared;
        Save.Mi = a.pictures;
        Save.kk = a.picturesBadgeCounter;
      }
    }
    stringify() {
      let a = {
        v: this.version,
        music: Save.Ec,
        sound: Save.Bd,
        language: Save.language,
        levelStars: Save.wg,
        blueStars: Save.ig,
        levelCleared: Save.Df,
        locked: Save.locked,
        hint: Save.hint,
        skin: WebApplication.xmasMode ? 0 : Save.me,
        gameWon: Save.Dl,
        magnetUsed: Save.Ho,
        telekinesisUsed: Save.Dp,
        pictures: Save.Mi,
        picturesBadgeCounter: Save.kk
      };
      return JSON.stringify(a);
    }
    Zr(a) {
      switch (a) {
        case 2:
          Save.hint = 1;
          Save.me = 0;
          Save.Dl = false;
          for (a = 3; a <= 17;) {
            this.FB(a, a != 6 && a != 11);
            ++a;
          }
          break;
        case 3:
          for (a = 0; a < 17;) {
            Save.ig[a] = [];
            for (var b = 0; b < 25;) {
              Save.ig[a][b++] = 0;
            }
            ++a;
          }
          Save.Ho = false;
          Save.Dp = false;
          Save.Mi = [];
          Save.kk = 0;
          for (a = 1; a < 22;) {
            var c = a++;
            b = LevelMath.PA(c);
            c = LevelMath.rv(c);
            if (Save.Df[b - 1][c - 1]) {
              Save.Mi.push("" + b + "-" + c);
              Save.kk++;
            }
          }
      }
    }
    ho() {
      return 3;
    }
    FB(a, b) {
      if (b == null) {
        b = true;
      }
      --a;
      Save.locked[a] = b;
      Save.wg[a] = [];
      Save.Df[a] = [];
      let c = 0;
      while (c < 25) {
        let d = c++;
        Save.wg[a][d] = 0;
        Save.Df[a][d] = false;
      }
      if (!b) {
        Save.Df[a][0] = true;
      }
      Save.ig[a] = [];
      for (b = 0; b < 25;) {
        Save.ig[a][b++] = 0;
      }
    }
    static Yi(a) {
      if (!Lambda.Ej(Loader.hv(), function (b) {
        return b == a;
      })) {
        a = "en";
      }
      Save.language = a;
    }
    static flush() {
      if (Save.persistEnabled) {
        Save.instance.save(function () {});
      }
    }
  }
  Save.i = true;
  Save.s = SaveBase;
  Object.assign(Save.prototype, {
    l: Save
  });
  class C64 {}
  C64.i = true;
  C64.Je = true;
  Object.assign(C64.prototype, {
    l: C64
  });

  class LocalStorageStore {
    constructor(a) {
      this.key = a;
    }
    load(a) {
      try {
        let b = StorageProvider.tryGet().getItem(this.key);
        if (a != null) {
          a(b);
        }
        return b;
      } catch (b) {
        if (a != null) {
          a(null);
        }
        return null;
      }
    }
    save(a, b) {
      try {
        StorageProvider.tryGet().setItem(this.key, a);
        if (b != null) {
          b(true);
        }
      } catch (c) {
        if (b != null) {
          b(false);
        }
      }
    }
  }
  LocalStorageStore.i = true;
  LocalStorageStore.Ib = [C64];
  Object.assign(LocalStorageStore.prototype, {
    l: LocalStorageStore
  });

  class NullSave extends SaveBase {
    constructor() {
      super(null);
    }
    stringify() {
      return "";
    }
    parse() {}
    reset() {}
    ho() {
      return 1;
    }
    Zr() {}
  }
  NullSave.i = true;
  NullSave.s = SaveBase;
  Object.assign(NullSave.prototype, {
    l: NullSave
  });
  class PortalLocalStorage {
    constructor(a) {
      this.storage = null;
      this.key = a;
      this.storage = window.CTRC.localStorage;
    }
    load(a) {
      let b = this.storage.getItem(this.key);
      if (a != null) {
        a(b);
      }
      return b;
    }
    save(a, b) {
      this.storage.setItem(this.key, a);
      if (b != null) {
        b(true);
      }
    }
  }
  PortalLocalStorage.i = true;
  PortalLocalStorage.Ib = [C64];
  Object.assign(PortalLocalStorage.prototype, {
    l: PortalLocalStorage
  });
