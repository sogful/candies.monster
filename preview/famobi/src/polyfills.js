var v2 = typeof Object.defineProperties == "function" ? Object.defineProperty : function (p2, p3, p4) {
  if (p2 == Array.prototype || p2 == Object.prototype) {
    return p2;
  }
  p2[p3] = p4.value;
  return p2;
};
function f2(p5) {
  p5 = [typeof globalThis == "object" && globalThis, p5, typeof window == "object" && window, typeof self == "object" && self, typeof global == "object" && global];
  for (var vLN0 = 0; vLN0 < p5.length; ++vLN0) {
    var v3 = p5[vLN0];
    if (v3 && v3.Math == Math) {
      return v3;
    }
  }
  throw Error("Cannot find global object");
}
var vF2 = f2(this);
function f3(p6, p7) {
  if (p7) {
    a: {
      var vVF2 = vF2;
      p6 = p6.split(".");
      for (var vLN02 = 0; vLN02 < p6.length - 1; vLN02++) {
        var v4 = p6[vLN02];
        if (!(v4 in vVF2)) {
          break a;
        }
        vVF2 = vVF2[v4];
      }
      p6 = p6[p6.length - 1];
      vLN02 = vVF2[p6];
      p7 = p7(vLN02);
      if (p7 != vLN02 && p7 != null) {
        v2(vVF2, p6, {
          configurable: true,
          writable: true,
          value: p7
        });
      }
    }
  }
}
f3("Array.prototype.includes", function (p8) {
  if (p8) {
    return p8;
  } else {
    return function (p9, p10) {
      var vThis = this;
      if (vThis instanceof String) {
        vThis = String(vThis);
      }
      var v5 = vThis.length;
      p10 = p10 || 0;
      for (p10 < 0 && (p10 = Math.max(p10 + v5, 0)); p10 < v5; p10++) {
        var v6 = vThis[p10];
        if (v6 === p9 || Object.is(v6, p9)) {
          return true;
        }
      }
      return false;
    };
  }
});
function f4(p11, p12) {
  if (p11 instanceof String) {
    p11 += "";
  }
  var vLN03 = 0;
  var v7 = false;
  var vO = {
    next: function () {
      if (!v7 && vLN03 < p11.length) {
        var v8 = vLN03++;
        return {
          value: p12(v8, p11[v8]),
          done: false
        };
      }
      v7 = true;
      return {
        done: true,
        value: undefined
      };
    }
  };
  vO[Symbol.iterator] = function () {
    return vO;
  };
  return vO;
}
f3("Array.prototype.values", function (p13) {
  if (p13) {
    return p13;
  } else {
    return function () {
      return f4(this, function (p14, p15) {
        return p15;
      });
    };
  }
});
