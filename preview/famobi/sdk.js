/*
 * CTRC SDK stub
 * -------------
 * The original build of this Cut the Rope clone was wrapped by Famobi's
 * "CTRC" portal SDK, which provided `window.CTRC` + `window.CTRC_analytics`
 * for ads, analytics, visibility/audio plumbing and feature gating.
 *
 * The portal SDK is not shipped with the public game files, so without
 * stubs the game crashes immediately when `class M`/`class cf` reach
 * for `window.CTRC.getOffsets()` etc. during boot.
 *
 * This stub provides no-op implementations of every SDK entry point the
 * compiled code calls. It pulls feature flags out of the local
 * `ctrc.json` (which IS shipped) so feature gates behave as configured.
 *
 * Load this BEFORE index.js. See index.html.
 */
(function () {
  "use strict";

  // ------------------------------------------------------------------
  // 1.  Feature flags. ctrc.json is gone (ads + analytics stripped, so
  //     none of the portal config matters anymore); these defaults are
  //     baked in. `rewarded: true` keeps the magnet/telekinesis buttons
  //     visible - they're filled to Infinity in statics.js so no ad is
  //     ever shown, but the buttons still need to render. Everything
  //     not listed falls through to `false`, which is what the original
  //     SDK did for unknown features.
  // ------------------------------------------------------------------
  var config = {
    features: {
      audio: true,
      copyright: true,
      credits: true,
      pause: true,
      progress: true,
      score: true,
      tutorial: true,
      version: true,
      visibilitychange: true,
      home: true,
      privacy: true,
      rewarded: true
    }
  };

  // ------------------------------------------------------------------
  // 2.  Visibility callbacks. The portal would normally invoke these
  //     when the host page hides/shows the iframe. We bridge them to
  //     the standard Page Visibility API so background tabs still
  //     pause the game.
  // ------------------------------------------------------------------
  var onPauseRequested = null;
  var onResumeRequested = null;
  Object.defineProperty(window, "CTRC_onPauseRequested", {
    configurable: true,
    get: function () { return onPauseRequested; },
    set: function (fn) { onPauseRequested = fn; }
  });
  Object.defineProperty(window, "CTRC_onResumeRequested", {
    configurable: true,
    get: function () { return onResumeRequested; },
    set: function (fn) { onResumeRequested = fn; }
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (typeof onPauseRequested === "function") try { onPauseRequested(); } catch (e) {}
    } else {
      if (typeof onResumeRequested === "function") try { onResumeRequested(); } catch (e) {}
    }
  });

  // ------------------------------------------------------------------
  // 3.  Request channel. The game calls `CTRC.onRequest("enableAudio",
  //     fn)` to subscribe to host events; the portal would fire them.
  //     We just remember the handlers and never trigger them.
  // ------------------------------------------------------------------
  var requestHandlers = Object.create(null);

  // ------------------------------------------------------------------
  // 4.  Offsets. The portal can letterbox the canvas inside its UI.
  //     With no portal, we use zero insets on every side.
  // ------------------------------------------------------------------
  function getOffsets() {
    return { left: 0, right: 0, top: 0, bottom: 0 };
  }

  // ------------------------------------------------------------------
  // 5.  Ads. We pretend there is no inventory and immediately invoke
  //     the callback. `rewardedAd` reports the reward as NOT granted
  //     so the player just doesn't get the bonus power-up - but the
  //     game flow continues normally.
  // ------------------------------------------------------------------
  function showInterstitialAd(eventId, done) {
    if (typeof done === "function") setTimeout(done, 0);
  }
  function hasRewardedAd() {
    return false;
  }
  function rewardedAd(done) {
    if (typeof done === "function") setTimeout(function () {
      done({ rewardGranted: 0 });
    }, 0);
  }

  // ------------------------------------------------------------------
  // 6.  Audio volume. The portal exposes a host-wide volume slider;
  //     we default to "full volume".
  // ------------------------------------------------------------------
  function getVolume() {
    return 1;
  }

  // ------------------------------------------------------------------
  // 7.  Lifecycle. `setPreloadProgress` is decoration; `gameReady`
  //     would let the portal hide its loader. Both are no-ops here.
  // ------------------------------------------------------------------
  function setPreloadProgress(_p) {}
  function gameReady() {}

  // ------------------------------------------------------------------
  // 8.  Feature gate. Pull from `ctrc.json.features`. Anything not
  //     listed (e.g. "external_pause", "xmas", "force_english") is
  //     treated as false, which matches the original SDK's behaviour.
  // ------------------------------------------------------------------
  function hasFeature(name) {
    return config.features ? config.features[name] === true : false;
  }

  // ------------------------------------------------------------------
  // 9.  Offset subscription. We never fire it but we honour the API.
  // ------------------------------------------------------------------
  function onOffsetChange(_fn) {}

  // ------------------------------------------------------------------
  // 10. Public CTRC surface.
  // ------------------------------------------------------------------
  // The portal also vends its own Storage shim (sometimes a sandboxed
  // wrapper around localStorage with quota tracking and an in-memory
  // fallback for incognito/iframe-blocked contexts). The compiled `C98`
  // class stashes a reference at construction time, so this MUST be a
  // truthy Storage-shaped object before index.js runs. We delegate to
  // window.localStorage when available, otherwise to an in-memory map
  // so the game still boots in private browsing.
  var storage;
  try {
    window.localStorage.setItem("__ctrc_probe", "1");
    window.localStorage.removeItem("__ctrc_probe");
    storage = window.localStorage;
  } catch (e) {
    var mem = Object.create(null);
    storage = {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
      setItem: function (k, v) { mem[k] = String(v); },
      removeItem: function (k) { delete mem[k]; },
      clear: function () { for (var k in mem) delete mem[k]; },
      key: function (i) { return Object.keys(mem)[i] ?? null; },
      get length() { return Object.keys(mem).length; }
    };
  }

  window.CTRC = {
    getOffsets: getOffsets,
    onOffsetChange: onOffsetChange,
    onRequest: function (eventName, handler) {
      requestHandlers[eventName] = handler;
    },
    showInterstitialAd: showInterstitialAd,
    hasRewardedAd: hasRewardedAd,
    rewardedAd: rewardedAd,
    getVolume: getVolume,
    setPreloadProgress: setPreloadProgress,
    gameReady: gameReady,
    hasFeature: hasFeature,
    localStorage: storage,
    // Exposed so a dev console can simulate portal events if needed.
    _emit: function (eventName) {
      var fn = requestHandlers[eventName];
      if (typeof fn === "function") fn();
    },
    _config: config
  };

  // ------------------------------------------------------------------
  // 11. Analytics. `trackEvent` must return a thenable - the game
  //     awaits it before progressing past level start/end screens.
  // ------------------------------------------------------------------
  window.CTRC_analytics = {
    trackEvent: function (_name, _params) {
      return Promise.resolve(null);
    }
  };
})();
