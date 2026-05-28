  // StorageProvider - probe localStorage for usability. Returns the
  // Storage object on success, null when the browser blocks it (Safari
  // private mode, file:// loads, quota issues).
  class StorageProvider {
    static tryGet() {
      try {
        let storage = window.localStorage;
        storage.getItem("");
        // some browsers (older Safari) appear to have localStorage
        // but throw on write - exercise it with a throwaway key.
        if (storage.length == 0) {
          let probeKey = "_hx_" + Math.random();
          storage.setItem(probeKey, probeKey);
          storage.removeItem(probeKey);
        }
        return storage;
      } catch (_) {
        return null;
      }
    }
  }
  StorageProvider.i = true;

  // EventEmitter - haxe-style synchronous pubsub. emit() copies the
  // current listener list onto a reusable stack (so listeners added or
  // removed during dispatch don't perturb the in-flight iteration),
  // then drains it in reverse order. `flags == 0` means "removed",
  // `1` regular, `3` once-only (cleared after firing).
  class EventEmitter {
    constructor() {
      this.listeners = [];
      this.stack = [];
      this.stackMax = this.stackTop = 0;
    }
    addListener(type, listener) {
      this.listeners.push(new EmitterListener(type, listener));
      let self = this;
      return function () {
        self.removeListener(type, listener);
      };
    }
    once(type, listener) {
      this.addListener(type, listener);
      this.listeners[this.listeners.length - 1].flags = 3;
    }
    removeListener(type, listener) {
      let arr = this.listeners;
      let i = 0;
      let n = arr.length;
      while (i < n) {
        let entry = arr[i];
        if (entry.type == type && entry.listener == listener) {
          entry.flags = 0;
          // swap-and-pop O(1) remove
          arr[i] = arr[n - 1];
          arr.pop();
          break;
        }
        ++i;
      }
    }
    emit(type, args) {
      var listeners = this.listeners;
      let count = listeners.length;
      let stack = this.stack;
      let top = this.stackTop;
      // snapshot current listeners onto the reusable stack
      let i = 0;
      let snapshotEnd = count;
      while (i < snapshotEnd) {
        stack[top++] = listeners[i++];
      }
      if (top > this.stackMax) {
        this.stackMax = top;
      }
      // drain LIFO; flags=0 means removed mid-dispatch (skip)
      for (this.stackTop = top; count > 0;) {
        let entry = stack[--top];
        stack[top] = null;
        if (entry.type == type && entry.flags > 0) {
          entry.listener.apply(null, args);
          if (entry.flags == 3) {
            entry.flags = 0;
          }
        }
        --count;
      }
    }
  }
  EventEmitter.i = true;
  Object.assign(EventEmitter.prototype, {
    l: EventEmitter
  });

  // EventListenerRecord - linked-list node used by the older event
  // system (Node subclass dispatch). Newer code uses EmitterListener.
  class EventListenerRecord {
    constructor(type, callback, once) {
      this.type = type;
      this.callback = callback;
      this.once = once;
      this.next = null;
    }
  }
  EventListenerRecord.i = true;
  Object.assign(EventListenerRecord.prototype, {
    l: EventListenerRecord
  });

  // EmitterListener - entry held by EventEmitter.listeners.
  class EmitterListener {
    constructor(type, listener) {
      this.type = type;
      this.listener = listener;
      this.flags = 1;
    }
  }
  EmitterListener.i = true;
  Object.assign(EmitterListener.prototype, {
    l: EmitterListener
  });

  // AsyncCallback - small one-shot callback wrapper used by the loader
  // queue. fire() invokes callback(id) and nulls the slot so the entry
  // can be GC'd.
  class AsyncCallback {
    constructor(id, callback) {
      this.id = id;
      this.callback = callback;
    }
    fire() {
      this.callback(this.id);
      this.callback = null;
    }
  }
  AsyncCallback.i = true;
  Object.assign(AsyncCallback.prototype, {
    l: AsyncCallback
  });
