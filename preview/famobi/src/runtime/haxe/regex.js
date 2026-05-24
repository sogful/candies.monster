  // EReg - Haxe's `EReg` regular-expression wrapper.
  //
  // Haxe normalises regex flags (it does not grok the JS-only `u` flag) and
  // stores the last match result on the underlying RegExp object as `bk`
  // (matched array) + `ID` (the input string). Methods:
  //
  //   match(s)  → boolean, also stashes result for Zc/HP
  //   Zc(i)     → captured group i  (throws 0 if no match)
  //   HP()      → "matchedRight": substring AFTER the match
  //                                (throws 1 if no match)
  //
  // Originally minified as `C2` (and `ma` in ctrrold.js).
  class EReg {
    constructor(a, b) {
      this.r = new RegExp(a, b.split("u").join(""));
    }
    match(a) {
      if (this.r.global) {
        this.r.lastIndex = 0;
      }
      this.r.bk = this.r.exec(a);
      this.r.ID = a;
      return this.r.bk != null;
    }
    Zc(a) {
      if (this.r.bk != null && a >= 0 && a < this.r.bk.length) {
        return this.r.bk[a];
      }
      throw 0;
    }
    HP() {
      if (this.r.bk == null) {
        throw 1;
      }
      let a = this.r.bk.index + this.r.bk[0].length;
      return Std.substr(this.r.ID, a, this.r.ID.length - a);
    }
  }
  EReg.i = true;
  Object.assign(EReg.prototype, {
    l: EReg
  });
  // SDK - Famobi CTRC portal bridge.
  //
  // Every call into the host portal goes through here. The portal exposes
  // `window.CTRC` (insets / ads / volume / feature flags / lifecycle) and
  // `window.CTRC_analytics.trackEvent(name, params)`. With the public
  // game files alone these globals do not exist - they come from the portal
  // bundle. See `../../../sdk.js` for the in-tree placeholder
  // that lets the game launch standalone.
  //
  // Originally minified as `M`. Static methods are still in their cryptic
  // two-letter form (`RN`, `ns`, `Ge`, ...); future passes should rename them.
  // Likely mapping:
  //
  //    RN  → getInsets             ns  → onRequest
  //    jQ  → onInsetsChange        cf  → showInterstitialAd
  //    kQ  → setPauseRequestHandler tr  → hasRewardedAd
  //    nQ  → setResumeRequestHandler sE → showRewardedAd
  //    DN  → getVolume             eS  → setPreloadProgress
  //    sN  → gameReady             Ge  → trackEvent (internal)
  //    it  → trackLevelStart       Nx  → trackLevelRestart
  //    ZS  → trackLevelSuccess     YE  → trackLevelFail
  //    XE  → trackLevelEnd         $S  → trackLiveScore
  //    aT  → trackPause            bT  → trackResume
  //    jt  → trackVolumeChange     sC  → trackDesignEvent
  //
  // Static state:
  //    Ol  - true while an ad is being shown (used by the game to gate
  //          input and pause the loop)
  //    gM  - "force unmuted" override; if true, getVolume returns 1
  //          regardless of what the portal says
  //    WB  - last value sent to setPreloadProgress, so we do not spam
  //          identical updates
