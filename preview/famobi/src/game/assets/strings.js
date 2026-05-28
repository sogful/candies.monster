  class LevelMath {
    static seasonForBox(a) {
      if (a <= 17) {
        return 1;
      } else {
        return 2;
      }
    }
    static globalIndex(a) {
      switch (a) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 3:
          return 3;
        case 4:
          return 4;
        case 5:
          return 5;
        case 6:
          return 6;
        case 7:
          return 7;
        case 8:
          return 8;
        case 9:
          return 9;
        case 10:
          return 10;
        case 11:
          return 12;
        case 12:
          return 14;
        case 13:
          return 15;
        case 14:
          return 17;
        case 15:
          return 20;
        case 16:
          return 23;
        case 17:
          return 25;
        case 18:
          return 1;
        case 19:
          return 4;
        case 20:
          return 7;
        case 21:
          return 10;
        default:
          return -1;
      }
    }
    static boxLevelFromGlobal(a, b) {
      switch (a) {
        case 1:
          switch (b) {
            case 1:
              return 1;
            case 2:
              return 2;
            case 3:
              return 3;
            case 4:
              return 4;
            case 5:
              return 5;
            case 6:
              return 6;
            case 7:
              return 7;
            case 8:
              return 8;
            case 9:
              return 9;
            case 10:
              return 10;
            case 12:
              return 11;
            case 14:
              return 12;
            case 15:
              return 13;
            case 17:
              return 14;
            case 20:
              return 15;
            case 23:
              return 16;
            case 25:
              return 17;
            default:
              return -1;
          }
        case 2:
          switch (b) {
            case 1:
              return 18;
            case 4:
              return 19;
            case 7:
              return 20;
            case 10:
              return 21;
            default:
              return -1;
          }
        default:
          return -1;
      }
    }
  }
  LevelMath.i = true;
  class Strings {
    static get(a, b) {
      if (Strings.wrapper == null) {
        Strings.wrapper = JSON.parse(Loader.getText(Loader.strings));
      }
      var c = ObjectAccess.getField(Strings.wrapper, a);
      if (c == null || Save.language == null) {
        return a;
      }
      if (Object.prototype.hasOwnProperty.call(c, Save.language)) {
        a = ObjectAccess.getField(c, Save.language);
        if (b != null) {
          c = 0;
          let d = b.length;
          while (c < d) {
            a = a.replace(RegExp("::\\w+::", ""), b[c++]);
          }
        }
        return a;
      }
      return ObjectAccess.getField(c, "en");
    }
  }

  class BoxLevelData {
    static get() {
      let a = LevelState.box;
      let b = LevelState.level;
      // preview bridge: override any requested box/level with the
      // custom level data parked by customlevel.js
      if (window.customleveldata != null) {
        return window.customleveldata;
      }
      if (BoxLevelData.cache[a] == null) {
        let c = Loader.getText([195, 190, 185, 180, 175, 170, 165, 159, 154, 149, 144, 139, 134, 129, 124, 119, 114][a - 1]);
        BoxLevelData.cache[a] = JSON.parse(c);
      }
      return BoxLevelData.cache[a][b - 1];
    }
  }
  BoxLevelData.i = true;
