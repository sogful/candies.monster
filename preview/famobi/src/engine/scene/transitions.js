  class TransitionReplace extends SceneTransition {
    constructor(a, b) {
      super(a, b);
      if (a.De == "Running") {
        a.xb("Paused");
      }
      this.Il(a).transitionOut(0, b);
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 0:
          a = this.jb(this.getTransitionDuration(this.a, this.b) / 2);
          this.Il(this.a).transitionOut(a, this.b);
          if (a == 1) {
            this.setState(1);
          }
          break;
        case 1:
          this.a.xb("Stopped");
          this.a.Oc();
          this.qN(this.a, function (b) {
            if (b.De != "Stopped") {
              b.xb("Stopped");
              b.Oc();
            }
          });
          this.b.xb("Created");
          this.b.init();
          this.b.layout();
          this.setState(2);
          break;
        case 2:
          if (this.time < this.Oj(this.b)) {
            break;
          }
          this.b.xb("Started");
          this.b.onShown();
          this.b.transitionIn(0, this.a);
          this.setState(3);
          break;
        case 3:
          a = this.jb(this.getTransitionDuration(this.a, this.b) / 2);
          this.b.transitionIn(a, this.a);
          if (!(a < 1)) {
            this.b.xb("Running");
            this.b.start();
            this.Il(this.a).ud.dispose();
            this.dispose();
          }
      }
    }
  }
  TransitionReplace.i = true;
  TransitionReplace.s = SceneTransition;
  Object.assign(TransitionReplace.prototype, {
    l: TransitionReplace
  });
  class TransitionCrossfade extends SceneTransition {
    constructor(a, b) {
      super(a, b);
      b.xb("Created");
      b.init();
      b.layout();
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 0:
          if (this.time < this.Oj(this.b)) {
            break;
          }
          this.a.xb("Paused");
          for (a = this.a; a.parent != null && a.parent != this.a.fa;) {
            a = a.parent;
          }
          this.Il(this.a).transitionOut(1, this.b);
          this.b.xb("Started");
          this.b.onShown();
          this.b.transitionIn(0, this.a);
          this.time = 0;
          this.state = 1;
          break;
        case 1:
          a = this.jb(this.getTransitionDuration(this.a, this.b));
          this.Il(this.a).transitionOut(a, this.b);
          this.b.transitionIn(a, this.a);
          if (a == 1) {
            this.a.xb("Stopped");
            this.a.Oc();
            for (a = this.a; a.parent != null && a.parent != this.a.fa;) {
              if (a.De != "Stopped") {
                a.xb("Stopped");
                a.Oc();
              }
              a = a.parent;
            }
            this.Il(this.a).dispose();
            this.b.xb("Running");
            this.b.start();
            this.dispose();
          }
      }
    }
  }
  TransitionCrossfade.i = true;
  TransitionCrossfade.s = SceneTransition;
  Object.assign(TransitionCrossfade.prototype, {
    l: TransitionCrossfade
  });
  class TransitionExit extends SceneTransition {
    constructor(a) {
      super(a, null);
      a.xb("Paused");
      a.transitionOut(1, null);
    }
    update() {
      let a = this.jb(this.getTransitionDuration(this.a, this.b));
      this.a.transitionOut(a, this.b);
      if (!(a < 1)) {
        this.a.xb("Stopped");
        this.a.Oc();
        this.a.dispose();
        this.dispose();
      }
    }
  }
  TransitionExit.i = true;
  TransitionExit.s = SceneTransition;
  Object.assign(TransitionExit.prototype, {
    l: TransitionExit
  });
  class TransitionPopBack extends SceneTransition {
    constructor(a, b, c) {
      if (b == null) {
        b = true;
      }
      let d = a.SN();
      super(a, d);
      this.wR = b;
      this.Hi = c;
      a.xb("Paused");
      a.transitionOut(0, d);
    }
    update(a) {
      super.update(a);
      a = this.jb(this.getTransitionDuration(this.a, this.b));
      this.a.transitionOut(a, this.b);
      if (a == 1) {
        this.a.xb("Stopped");
        this.a.Oc();
        this.a.ud.dispose();
        if (this.wR) {
          if (this.b.De == "Stopped") {
            this.b.xb("Restarted");
          }
          this.b.xb("Running");
          this.b.start();
        }
        this.dispose();
        if (this.Hi != null) {
          this.Hi();
          this.Hi = null;
        }
      }
    }
  }
  TransitionPopBack.i = true;
  TransitionPopBack.s = SceneTransition;
  Object.assign(TransitionPopBack.prototype, {
    l: TransitionPopBack
  });
  class TransitionPushOver extends SceneTransition {
    constructor(a, b) {
      super(a, b);
      b.xb("Created");
      b.init();
      b.layout();
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 0:
          if (this.time < this.Oj(this.b)) {
            break;
          }
          if (this.a.De == "Running") {
            this.a.xb("Paused");
          }
          this.b.xb("Started");
          this.b.onShown();
          this.b.transitionIn(0, this.a);
          this.setState(1);
          break;
        case 1:
          a = this.jb(this.getTransitionDuration(this.a, this.b));
          this.b.transitionIn(a, this.a);
          if (!(a < 1)) {
            if (this.b.replacesPrevious()) {
              this.a.xb("Stopped");
              this.a.Oc();
            }
            this.b.xb("Running");
            this.b.start();
            this.dispose();
          }
      }
    }
  }
  TransitionPushOver.i = true;
  TransitionPushOver.s = SceneTransition;
  Object.assign(TransitionPushOver.prototype, {
    l: TransitionPushOver
  });
  class TransitionPush extends SceneTransition {
    constructor(a) {
      super(null, a);
      a.xb("Created");
      a.init();
      a.layout();
    }
    update() {
      switch (this.state) {
        case 0:
          if (this.time < this.Oj(this.b)) {
            break;
          }
          this.b.xb("Started");
          this.b.onShown();
          this.b.transitionIn(0, this.a);
          this.setState(1);
          break;
        case 1:
          let a = this.jb(this.getTransitionDuration(this.b, this.a));
          this.b.transitionIn(a, this.a);
          if (!(a < 1)) {
            this.b.xb("Running");
            this.b.start();
            this.dispose();
          }
      }
    }
  }
  TransitionPush.i = true;
  TransitionPush.s = SceneTransition;
  Object.assign(TransitionPush.prototype, {
    l: TransitionPush
  });
