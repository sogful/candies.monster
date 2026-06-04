  // SDK - was the Famobi CTRC portal bridge. Ads and analytics are
  // stripped: showInterstitialAd / showRewardedAd / hasRewardedAd /
  // adShowing are stubs (no-ops, "no ad available"), and every
  // track* method is a no-op that immediately invokes its callback.
  // Powerups are infinite (see statics.js + buttons.js), so the
  // "needs ad" branches that called these are unreachable anyway.
  //
  // The remaining methods (getInsets, onInsetsChange, set*Handler,
  // onRequest, getVolume, setPreloadProgress, gameReady, hasFeature)
  // still forward to window.CTRC; the in-tree stub at ctrc-sdk-stub.js
  // satisfies them.
  class SDK {
    static getInsets() {
      let a = window.CTRC.getOffsets();
      return new Insets(ObjectAccess.vf(a, "left"), ObjectAccess.vf(a, "right"), ObjectAccess.vf(a, "top"), ObjectAccess.vf(a, "bottom"));
    }
    static onInsetsChange(a) {
      window.CTRC.onOffsetChange(a);
    }
    static setPauseRequestHandler(a) {
      window.CTRC_onPauseRequested = a;
    }
    static setResumeRequestHandler(a) {
      window.CTRC_onResumeRequested = a;
    }
    static onRequest(a, b) {
      window.CTRC.onRequest(a, b);
    }
    static showInterstitialAd(a, b) {
      b();
    }
    static hasRewardedAd() {
      return false;
    }
    static showRewardedAd(a) {
      a(false);
    }
    static getVolume() {
      let a = window.CTRC.getVolume();
      if (SDK.forceUnmuted) {
        a = 1;
      }
      return a;
    }
    static setPreloadProgress(a) {
      if (SDK.lastPreloadProgress != a) {
        SDK.lastPreloadProgress = a;
        try {
          window.CTRC.setPreloadProgress(a);
        } catch (b) {}
      }
    }
    static gameReady() {
      try {
        window.CTRC.gameReady();
      } catch (a) {}
    }
    static hasFeature(a) {
      try {
        return window.CTRC.hasFeature(a);
      } catch (b) {
        return false;
      }
    }
    static trackLevelStart(a, b)         { b(); }
    static trackLevelRestart(a, b)       { b(); }
    static trackLevelSuccess(a, b, c, d) { d(); }
    static trackLevelFail(a, b, c)       { c(); }
    static trackLevelEnd(a, b, c, d)     { c(); }
    static trackLiveScore(a)             {}
    static trackPause(a)                 { a(); }
    static trackResume(a)                { a(); }
    static trackVolumeChange(a, b)       {}
    static trackDesignEvent(a)           {}
    static trackEvent(a, b)              { return Promise.resolve(null); }
  }
  SDK.i = true;
