  class TransitionReplace extends SceneTransition {
    constructor(a, b) {
      super(a, b);
      if (a.lifecycle == "Running") {
        a.setLifecycle("Paused");
      }
      this.topWrapperFor(a).transitionOut(0, b);
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 0:
          a = this.progress(this.getTransitionDuration(this.from, this.to) / 2);
          this.topWrapperFor(this.from).transitionOut(a, this.to);
          if (a == 1) {
            this.setState(1);
          }
          break;
        case 1:
          this.from.setLifecycle("Stopped");
          this.from.onStop();
          this.forEachAncestorScene(this.from, function (b) {
            if (b.lifecycle != "Stopped") {
              b.setLifecycle("Stopped");
              b.onStop();
            }
          });
          this.to.setLifecycle("Created");
          this.to.init();
          this.to.layout();
          this.setState(2);
          break;
        case 2:
          if (this.time < this.bootMode(this.to)) {
            break;
          }
          this.to.setLifecycle("Started");
          this.to.onShown();
          this.to.transitionIn(0, this.from);
          this.setState(3);
          break;
        case 3:
          a = this.progress(this.getTransitionDuration(this.from, this.to) / 2);
          this.to.transitionIn(a, this.from);
          if (!(a < 1)) {
            this.to.setLifecycle("Running");
            this.to.start();
            this.topWrapperFor(this.from).wrapper.dispose();
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
      b.setLifecycle("Created");
      b.init();
      b.layout();
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 0:
          if (this.time < this.bootMode(this.to)) {
            break;
          }
          this.from.setLifecycle("Paused");
          for (a = this.from; a.parent != null && a.parent != this.from.director;) {
            a = a.parent;
          }
          this.topWrapperFor(this.from).transitionOut(1, this.to);
          this.to.setLifecycle("Started");
          this.to.onShown();
          this.to.transitionIn(0, this.from);
          this.time = 0;
          this.state = 1;
          break;
        case 1:
          a = this.progress(this.getTransitionDuration(this.from, this.to));
          this.topWrapperFor(this.from).transitionOut(a, this.to);
          this.to.transitionIn(a, this.from);
          if (a == 1) {
            this.from.setLifecycle("Stopped");
            this.from.onStop();
            for (a = this.from; a.parent != null && a.parent != this.from.director;) {
              if (a.lifecycle != "Stopped") {
                a.setLifecycle("Stopped");
                a.onStop();
              }
              a = a.parent;
            }
            this.topWrapperFor(this.from).dispose();
            this.to.setLifecycle("Running");
            this.to.start();
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
      a.setLifecycle("Paused");
      a.transitionOut(1, null);
    }
    update() {
      let a = this.progress(this.getTransitionDuration(this.from, this.to));
      this.from.transitionOut(a, this.to);
      if (!(a < 1)) {
        this.from.setLifecycle("Stopped");
        this.from.onStop();
        this.from.dispose();
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
      let d = a.previousScene();
      super(a, d);
      this.restorePrev = b;
      this.onDone = c;
      a.setLifecycle("Paused");
      a.transitionOut(0, d);
    }
    update(a) {
      super.update(a);
      a = this.progress(this.getTransitionDuration(this.from, this.to));
      this.from.transitionOut(a, this.to);
      if (a == 1) {
        this.from.setLifecycle("Stopped");
        this.from.onStop();
        this.from.wrapper.dispose();
        if (this.restorePrev) {
          if (this.to.lifecycle == "Stopped") {
            this.to.setLifecycle("Restarted");
          }
          this.to.setLifecycle("Running");
          this.to.start();
        }
        this.dispose();
        if (this.onDone != null) {
          this.onDone();
          this.onDone = null;
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
      b.setLifecycle("Created");
      b.init();
      b.layout();
    }
    update(a) {
      super.update(a);
      switch (this.state) {
        case 0:
          if (this.time < this.bootMode(this.to)) {
            break;
          }
          if (this.from.lifecycle == "Running") {
            this.from.setLifecycle("Paused");
          }
          this.to.setLifecycle("Started");
          this.to.onShown();
          this.to.transitionIn(0, this.from);
          this.setState(1);
          break;
        case 1:
          a = this.progress(this.getTransitionDuration(this.from, this.to));
          this.to.transitionIn(a, this.from);
          if (!(a < 1)) {
            if (this.to.replacesPrevious()) {
              this.from.setLifecycle("Stopped");
              this.from.onStop();
            }
            this.to.setLifecycle("Running");
            this.to.start();
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
      a.setLifecycle("Created");
      a.init();
      a.layout();
    }
    update() {
      switch (this.state) {
        case 0:
          if (this.time < this.bootMode(this.to)) {
            break;
          }
          this.to.setLifecycle("Started");
          this.to.onShown();
          this.to.transitionIn(0, this.from);
          this.setState(1);
          break;
        case 1:
          let a = this.progress(this.getTransitionDuration(this.to, this.from));
          this.to.transitionIn(a, this.from);
          if (!(a < 1)) {
            this.to.setLifecycle("Running");
            this.to.start();
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
