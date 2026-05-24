class StorageProvider {
    static tryGet() {
      try {
        let a = window.localStorage;
        a.getItem("");
        if (a.length == 0) {
          let b = "_hx_" + Math.random();
          a.setItem(b, b);
          a.removeItem(b);
        }
        return a;
      } catch (a) {
        return null;
      }
    }
  }
  StorageProvider.i = true;

  class EventEmitter {
    constructor() {
      this.listeners = [];
      this.stack = [];
      this.stackMax = this.stackTop = 0;
    }
    addListener(a, b) {
      this.listeners.push(new EmitterListener(a, b));
      let c = this;
      return function () {
        c.removeListener(a, b);
      };
    }
    once(a, b) {
      this.addListener(a, b);
      this.listeners[this.listeners.length - 1].flags = 3;
    }
    removeListener(a, b) {
      let c = this.listeners;
      let d = 0;
      let e = c.length;
      while (d < e) {
        let f = c[d];
        if (f.type == a && f.listener == b) {
          f.flags = 0;
          c[d] = c[e - 1];
          c.pop();
          break;
        }
        ++d;
      }
    }
    emit(a, b) {
      var c = this.listeners;
      let d = c.length;
      let e = this.stack;
      let f = this.stackTop;
      let g = 0;
      let h = d;
      while (g < h) {
        e[f++] = c[g++];
      }
      if (f > this.stackMax) {
        this.stackMax = f;
      }
      for (this.stackTop = f; d > 0;) {
        c = e[--f];
        e[f] = null;
        if (c.type == a && c.flags > 0) {
          c.listener.apply(null, b);
          if (c.flags == 3) {
            c.flags = 0;
          }
        }
        --d;
      }
    }
  }
  EventEmitter.i = true;
  Object.assign(EventEmitter.prototype, {
    l: EventEmitter
  });

  class EventListenerRecord {
    constructor(a, b, c) {
      this.type = a;
      this.callback = b;
      this.once = c;
      this.next = null;
    }
  }
  EventListenerRecord.i = true;
  Object.assign(EventListenerRecord.prototype, {
    l: EventListenerRecord
  });

  class EmitterListener {
    constructor(a, b) {
      this.type = a;
      this.listener = b;
      this.flags = 1;
    }
  }
  EmitterListener.i = true;
  Object.assign(EmitterListener.prototype, {
    l: EmitterListener
  });

  class AsyncCallback {
    constructor(a, b) {
      this.id = a;
      this.callback = b;
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
