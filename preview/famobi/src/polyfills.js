// Standard Closure-Compiler / Haxe polyfill bootstrap for older
// runtimes. Lives outside the main IIFE because it patches global
// prototypes, so anything inside the IIFE can rely on
// Array.prototype.includes / .values being present.

// safe defineProperty - falls back to direct assignment on
// Array.prototype / Object.prototype where defineProperty is forbidden
// in some legacy engines.
var defineprop = typeof Object.defineProperties == "function" ? Object.defineProperty : function (target, key, descriptor) {
  if (target == Array.prototype || target == Object.prototype) {
    return target;
  }
  target[key] = descriptor.value;
  return target;
};

// findGlobal - pick whichever global object the host exposes
// (globalThis / window / self / global). Identified by Math identity.
function findGlobal(hint) {
  hint = [typeof globalThis == "object" && globalThis, hint, typeof window == "object" && window, typeof self == "object" && self, typeof global == "object" && global];
  for (var i = 0; i < hint.length; ++i) {
    var candidate = hint[i];
    if (candidate && candidate.Math == Math) {
      return candidate;
    }
  }
  throw Error("Cannot find global object");
}
var globalRef = findGlobal(this);

// installPolyfill - given a dotted "Type.proto.method" path and a
// factory(existing) -> replacement, install replacement on the global
// when factory returns something different / non-null.
function installPolyfill(path, factory) {
  if (factory) {
    a: {
      var owner = globalRef;
      path = path.split(".");
      for (var i = 0; i < path.length - 1; i++) {
        var segment = path[i];
        if (!(segment in owner)) {
          break a;
        }
        owner = owner[segment];
      }
      path = path[path.length - 1];
      var existing = owner[path];
      factory = factory(existing);
      if (factory != existing && factory != null) {
        defineprop(owner, path, {
          configurable: true,
          writable: true,
          value: factory
        });
      }
    }
  }
}

installPolyfill("Array.prototype.includes", function (existing) {
  if (existing) {
    return existing;
  } else {
    return function (needle, fromIndex) {
      var arr = this;
      if (arr instanceof String) {
        arr = String(arr);
      }
      var len = arr.length;
      fromIndex = fromIndex || 0;
      for (fromIndex < 0 && (fromIndex = Math.max(fromIndex + len, 0)); fromIndex < len; fromIndex++) {
        var value = arr[fromIndex];
        if (value === needle || Object.is(value, needle)) {
          return true;
        }
      }
      return false;
    };
  }
});

// mappedIterator - shared backing for the .values / .keys / .entries
// polyfills. Walks src like an array, calls map(index, src[index]) per
// step.
function mappedIterator(src, map) {
  if (src instanceof String) {
    src += "";
  }
  var i = 0;
  var done = false;
  var iter = {
    next: function () {
      if (!done && i < src.length) {
        var idx = i++;
        return {
          value: map(idx, src[idx]),
          done: false
        };
      }
      done = true;
      return {
        done: true,
        value: undefined
      };
    }
  };
  iter[Symbol.iterator] = function () {
    return iter;
  };
  return iter;
}
installPolyfill("Array.prototype.values", function (existing) {
  if (existing) {
    return existing;
  } else {
    return function () {
      return mappedIterator(this, function (idx, value) {
        return value;
      });
    };
  }
});
