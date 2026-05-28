  class SaveBase {
    constructor(a) {
      this.storage = a;
      this.saveFailed = this.saving = false;
      this.version = this.currentVersion();
      this.reset();
    }
    load(a) {
      let b = this;
      this.storage.load(function (c) {
        let d = false;
        try {
          if (c != null) {
            b.parse(c);
            if (b.version > b.currentVersion()) {
              throw 4;
            }
            for (c = false; b.version < b.currentVersion();) {
              b.migrate(b.version + 1);
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
      this.saving = true;
      let b = this;
      this.storage.save(this.stringify(), function (c) {
        b.saving = false;
        b.saveFailed = c == 0;
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
      this.version = this.currentVersion();
      Save.musicOn = true;
      Save.sfxOn = true;
      Save.setLanguage(null);
      Save.skin = WebApplication.xmasMode ? 3 : 0;
      Save.hint = 1;
      Save.gameWon = false;
      Save.levelStars = [];
      Save.blueStars = [];
      Save.cleared = [];
      Save.locked = [];
      Save.magnetUsed = false;
      Save.telekinesisUsed = false;
      Save.pictures = [];
      Save.pictureBadgeCount = 0;
      let a = 1;
      while (a <= 17) {
        this.initBox(a, a != 1 && a != 6 && a != 11);
        ++a;
      }
    }
    parse(a) {
      a = JSON.parse(a);
      this.version = a.v;
      Save.musicOn = a.music;
      Save.sfxOn = a.sound;
      Save.setLanguage(a.language);
      Save.levelStars = a.levelStars;
      Save.cleared = a.levelCleared;
      Save.locked = a.locked;
      if (this.version >= 2) {
        Save.hint = a.hint;
        Save.skin = a.skin;
        Save.gameWon = a.gameWon;
      }
      Save.skin = WebApplication.xmasMode ? 3 : Save.skin;
      if (this.version >= 3) {
        Save.blueStars = a.blueStars;
        Save.magnetUsed = a.magnetUsed;
        Save.telekinesisUsed = a.levelCleared;
        Save.pictures = a.pictures;
        Save.pictureBadgeCount = a.picturesBadgeCounter;
      }
    }
    stringify() {
      let a = {
        v: this.version,
        music: Save.musicOn,
        sound: Save.sfxOn,
        language: Save.language,
        levelStars: Save.levelStars,
        blueStars: Save.blueStars,
        levelCleared: Save.cleared,
        locked: Save.locked,
        hint: Save.hint,
        skin: WebApplication.xmasMode ? 0 : Save.skin,
        gameWon: Save.gameWon,
        magnetUsed: Save.magnetUsed,
        telekinesisUsed: Save.telekinesisUsed,
        pictures: Save.pictures,
        picturesBadgeCounter: Save.pictureBadgeCount
      };
      return JSON.stringify(a);
    }
    migrate(a) {
      switch (a) {
        case 2:
          Save.hint = 1;
          Save.skin = 0;
          Save.gameWon = false;
          for (a = 3; a <= 17;) {
            this.initBox(a, a != 6 && a != 11);
            ++a;
          }
          break;
        case 3:
          for (a = 0; a < 17;) {
            Save.blueStars[a] = [];
            for (var b = 0; b < 25;) {
              Save.blueStars[a][b++] = 0;
            }
            ++a;
          }
          Save.magnetUsed = false;
          Save.telekinesisUsed = false;
          Save.pictures = [];
          Save.pictureBadgeCount = 0;
          for (a = 1; a < 22;) {
            var c = a++;
            b = LevelMath.seasonForBox(c);
            c = LevelMath.globalIndex(c);
            if (Save.cleared[b - 1][c - 1]) {
              Save.pictures.push("" + b + "-" + c);
              Save.pictureBadgeCount++;
            }
          }
      }
    }
    currentVersion() {
      return 3;
    }
    initBox(a, b) {
      if (b == null) {
        b = true;
      }
      --a;
      Save.locked[a] = b;
      Save.levelStars[a] = [];
      Save.cleared[a] = [];
      let c = 0;
      while (c < 25) {
        let d = c++;
        Save.levelStars[a][d] = 0;
        Save.cleared[a][d] = false;
      }
      if (!b) {
        Save.cleared[a][0] = true;
      }
      Save.blueStars[a] = [];
      for (b = 0; b < 25;) {
        Save.blueStars[a][b++] = 0;
      }
    }
    // setLanguage - validate `a` against the loader's available
    // language list and store it (falling back to "en").
    static setLanguage(a) {
      if (!Lambda.exists(Loader.languageList(), function (b) {
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
    currentVersion() {
      return 1;
    }
    migrate() {}
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
