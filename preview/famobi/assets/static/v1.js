// the sdk here is completely patched out, making the powerups work for FREE?? lol that's nice

const loadScript = function(src) {
    return new Promise(function(resolve, reject) {
        const s = document.createElement('script');
        let r = false;
        s.type = 'text/javascript';
        s.src = src;
        s.async = true;
        s.onerror = function(err) {
            reject(err, s);
        };
        s.onload = s.onreadystatechange = function() {
            if (!r && (!this.readyState || this.readyState == 'complete')) {
                r = true;
                resolve();
            }
        };
        const t = document.getElementsByTagName('script')[0];
        t.parentElement.insertBefore(s, t);
    });
};

window.famobi_tracking = window.famobi_tracking || {
    init: function() {},
    trackEvent: function() {},
    EVENTS: {
        'LEVEL_START'   : 'event/level/start',
        'LEVEL_END'     : 'event/level/end',
        'LEVEL_UPDATE'  : 'event/level/update',
        'PING'          : 'event/ping',
        'AD'            : 'event/ad'
    }
};

if (typeof window !== "undefined" && !window.famobi) {
    ! function(a, b) {
        var famobi = {

                onOffsetChangeCallback: null,
                offsets: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                orientationChangeCallback: null,
                brandingLogo: null,
                config: null,
                reached_home: false,
                splashComplete: false,
                volume: 1.0,

                init: function() {

                    return new Promise(function(resolve, reject) {

                        if(!this.config) {
                            readTextFile("famobi.json", function(text){

                                var data = JSON.parse(text);
                                data = data.offlinizer || data;

                                data.game_i18n = data.game_i18n || {};
                                this.config = data;



                                this.log("init...");

                                this.game.init();


                                for(var i = 0; this.config.includeCSS && i < this.config.includeCSS.length; i++) {
                                    this.includeCSS(this.config.includeCSS[i]);
                                }

                                if(window.famobi_gameJS && window.famobi_gameJS.length) {
                                    if(typeof window.famobi_gameJS[window.famobi_gameJS.length - 1] == "string") {
                                        window.famobi_gameJS.push(function(){});
                                    }
                                }

                                window.famobi_gameJS.unshift("assets/static/zepto.min.js");

                                for(var i = 0; this.config.includeJS && i < this.config.includeJS.length; i++) {
                                    window.famobi_gameJS.unshift(this.config.includeJS[i]);
                                }

                                window.addEventListener("orientationchange", function() {
                                    if (typeof this.orientationChangeCallback == "function") {
                                        this.orientationChangeCallback();
                                    }
                                }.bind(this), false);

                                var aid = this.getUrlParams()["fg_aid"];

                                window.famobi_multiplayer = this.config.features.multiplayer || false;

                                this.config.gameParams = this.config.gameParams || {};



                                var getGameTitle = function() {
                                    String.prototype.replaceAll = function(search, replacement) {
                                        var target = this;
                                        return target.split(search).join(replacement);
                                    };
                                    function toTitleCase(str) {
                                        return str.replace(/\w\S*/g, function(txt){
                                            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                                        });
                                    }
                                    return toTitleCase(window.famobi_gameID.replaceAll("-", " "));
                                };


                                this.ads.init();

                                this.adapters.add("analytics", "trackStats", function(key, value) {

                                    if(!window.famobi.config.logging) return;

                                    console.log(
                                        "%c " + key + " %c (trackStats)",
                                        "background: #333333; color: white; display: block;",
                                        ""
                                    );
                                    if(value) console.log(value);
                                });

                                this.adapters.add("analytics", "trackEvent", function(event, params) {
                                    if(event == "EVENT_LIVESCORE" || !window.famobi.config.logging) {
                                        return;
                                    }
                                    console.log(
                                        "%c " + event + " %c (trackEvent)",
                                        "background: #0092c3; color: white; display: block;",
                                        ""
                                    );
                                    if(params) console.log(params);
                                });

                                this.adapters.add("analytics", "trackScreen", function(screen, pageTitle) {

                                    if(!window.famobi.config.logging) return;

                                    console.log(
                                        "%c " + screen + " %c (trackScreen)",
                                        "background: #f08119; color: white; display: block;",
                                        ""
                                    );
                                    if(pageTitle) console.log("pageTitle: " + pageTitle);
                                });

                                resolve((window.famobi_gameID === "running-jack") ? false : true);

                            }.bind(this));
                        }

                        function readTextFile(file, callback) {
                            var rawFile = new XMLHttpRequest();
                            rawFile.overrideMimeType("application/json");
                            rawFile.open("GET", file, true);
                            rawFile.onreadystatechange = function() {
                                if (rawFile.readyState === 4 && rawFile.status == "200") {
                                    callback(rawFile.responseText);
                                }
                            };
                            rawFile.send(null);
                        }
                    }.bind(this));
                },

                showInterstitialAd: function(eventId, callback) {

                    let params = {};

                    if(typeof eventId === "object") {
                        params = eventId;
                    } else {
                        params.callback = typeof eventId === "function" ? eventId : typeof callback === "function" ? callback : undefined;
                        params.eventId = typeof eventId === "string" ? eventId : typeof callback === "string" ? callback : undefined;
                    }

                    if(typeof params.callback === "function") {
                        params.callback();
                    }

                    return Promise.resolve();
                },

                forceAd: function(callback) {

                    this.showAd(callback, true);
                },

                rewardedAd: function(callback) {

                    if(!this.hasFeature("rewarded")) {
                        this.log("rewarded ads: not supported");
                        if (typeof callback == "function") {
                            callback(this.rewardedads.defaultReturnValue);
                        }
                        return;
                    }

                    if(!this.hasRewardedAd()) {
                        this.log("rewarded ads: not supported");
                        if (typeof callback == "function") {
                            callback(this.rewardedads.defaultReturnValue);
                        }
                        return;
                    }

                    this.rewardedads.show().then(function(result) {
                        if (typeof callback == "function") {
                            callback(result);
                        }
                        return;
                    })
                },

                showAd: function(callback, force) {

                    if(!!this.config.ads.off) {

                        this.log("ads: off");

                        if (typeof callback == "function") {
                            callback();
                        }
                        return;
                    }

                    if(force !== true && !this.ads.hasCooledDown()) {

                        this.log("skipping ad...");

                        if (typeof callback == "function") {
                            callback();
                        }
                        return;
                    }


                    this.ads.adcount++;
                    this.ads.lastAdCall = Date.now();
                    this.game.pause();

                    this.log("showing ad...");
                    this.ads.show(this.ads.show_initial && this.ads.adcount == 1).then(function() {

                        this.log("ad finished");

                        if (typeof callback == "function") {
                            callback();
                        }

                        setTimeout(function() {
                            this.game.resume();
                        }.bind(this), 100);
                    }.bind(this));
                },

                rewardedads: {
                    lastAdCall: Date.now(),
                    adcount: 0,
                    defaultReturnValue: {
                        "adType": "rewarded",
                        "adDidLoad": false,
                        "adDidShow": false,
                        "adCount": 0,
                        "rewardGranted": false
                    },

                    init: function() {
                        var self = window.famobi;
                    },
                    hasCooledDown: function() {
                        return true;
                    },
                    show: function() {
                        var self = window.famobi;
                        return new Promise(function(resolve, reject) {
                            setTimeout(function() {
                                resolve({
                                    "adType": "rewarded",
                                    "adDidLoad": true,
                                    "adDidShow": true,
                                    "adCount": self.rewardedads.adcount,
                                    "rewardGranted": true
                                });
                            }, 0);
                        });
                    }
                },
                ads: {
                    lastAdCall: Date.now(),
                    adcount: 0,
                    off: true,
                    show_initial: false,
                    min_s_before: 10,
                    min_s_between: 90,

                    init: function() {

                        var self = window.famobi;
                        self.config.ads = self.config.ads || {};
                        this.lastAdCall = Date.now();
                        this.off = self.config.ads.off === false ? false : true;
                        this.show_initial = self.config.ads.show_initial || false;
                        this.min_s_before = self.config.ads.min_s_before || 10;
                        this.min_s_between = self.config.ads.min_s_between || 90;
                    },
                    hasCooledDown: function() {
                        var min_s_between =
                            this.adcount === 0 && +this.min_s_before > 0
                                ? +this.min_s_before
                                : +this.min_s_between;

                        var ret = Date.now() - min_s_between * 1000 > this.lastAdCall;
                        return ret;
                    },
                    show: function(isInitial) {

                        var self = window.famobi;
                        if(isInitial) {
                            self.log("initial ad");
                        }
                        return new Promise(function(resolve, reject) {
                            setTimeout(function() {
                                resolve();
                            }, 0);
                        });
                    }
                },

                gametranslation: {

                    init: function() {
                        window.famobi.gametranslation.curLangString = window.famobi.gametranslation.getUserLang();

                        if (window.famobi.gametranslation.getSupportedLanguages().indexOf(window.famobi.gametranslation.curLangString) === -1) {
                            window.famobi.gametranslation.curLangString = "en";
                        }

                        window.famobi.gametranslation.translationData = window.famobi.gametranslation.getGameTranslations();

                        window.famobi.gametranslation.translateHtml(faZepto("body"));
                    },

                    getSupportedLanguages: function() {
                        return window.famobi.config.languages || Object.keys(window.famobi.config.game_i18n) || [];
                    },

                    getGameTranslations: function() {
                        var i18n = window.famobi.config.game_i18n,
                            lang = window.famobi.gametranslation.curLangString;

                        if (i18n.current) {
                            return i18n.current;
                        }

                        faZepto.each(i18n, function(language, translations) {
                            faZepto.each(translations, function(key, value) {
                                if (value == null) {
                                    i18n[language][key] = "";
                                } else if (typeof i18n[language][key] === "string") {
                                    i18n[language][key] = value.replace(/\{lang\}/g, language);
                                }
                            });
                        });

                        i18n.current = faZepto.extend(
                            {},
                            i18n["default"],
                            i18n[window.famobi.config.aid + ".default"],
                            i18n[lang],
                            i18n[window.famobi.config.aid + "." + lang]
                        );

                        return (window.famobi.config.game_i18n.current = i18n.current);
                    },

                    translateString: function(key) {
                        return window.famobi.gametranslation.translationData.hasOwnProperty(key)
                            ? window.famobi.gametranslation.translationData[key]
                            : null;
                    },

                    getNavigatorLocale: function() {
                        var language = "";

                        if (navigator.languages && window.famobi.sizeOf(navigator.languages)) {
                            language = navigator.languages[0];
                        } else if (navigator.language) {
                            language = navigator.language;
                        } else if (navigator.userLanguage) {
                            language = navigator.userLanguage;
                        } else if (navigator.browserLanguage) {
                            language = navigator.browserLanguage;
                        }

                        return language;
                    },

                    getNavigatorLanguage: function() {
                        return window.famobi.gametranslation.getNavigatorLocale().substr(0, 2);
                    },

                    getUserLang: function() {
                        var urlParams = window.famobi.getUrlParams(),
                            lang = window.famobi.gametranslation.getNavigatorLanguage();

                        if (urlParams.locale && urlParams.locale.length == 2) {
                            return urlParams.locale;
                        }

                        switch (lang) {
                            case "ch":
                            case "at":
                                return "de";
                            default:
                                return lang;
                        }
                    },

                    translateHtml: function($selector) {
                        $selector.find("[data-i18n]").each(function() {
                            var textkey = this.getAttribute("data-i18n");
                            this.innerHTML = window.famobi.gametranslation.translateString(textkey);
                        });
                        return $selector;
                    }
                },

                __: function(key) {

                    switch(key) {
                        case "test_preload_image":
                            return "html5games/images/testPreloadImage.png";
                        case "preload_image":
                            return "html5games/images/" + (this.config.preload_image || "preloadImage") + ".png";
                        case "more_games_image":
                            return this.getBrandingButtonImage();
                        default:
                    }

                    var lang = this.getCurrentLanguage();

                    if(this.config.game_i18n) {

                        if(this.config.game_i18n[lang]) {
                            this.config.game_i18n[lang] = Object.assign(this.config.game_i18n[lang], this.config.game_i18n[this.config.aid+"."+lang]);
                        }

                        if(this.config.game_i18n[lang] && this.config.game_i18n[lang][key]) {
                            if(typeof this.config.game_i18n[lang][key] === "string") {
                                return this.config.game_i18n[lang][key].replace("{lang}", lang);
                            }
                            return this.config.game_i18n[lang][key];
                        }

                        if(this.config.game_i18n.default) {
                            this.config.game_i18n.default = Object.assign(this.config.game_i18n.default, this.config.game_i18n[this.config.aid+".default"]);
                        }

                        if(this.config.game_i18n.default && this.config.game_i18n.default[key]) {
                            if(typeof this.config.game_i18n.default[key] === "string") {
                                return this.config.game_i18n.default[key].replace("{lang}", lang);
                            }
                            return this.config.game_i18n.default[key];
                        }
                    }

                    this.warn("No translation found for '" + key + "'");
                    return null;
                },

                getCurrentLanguage: function() {

                    let locale = "";
                    let lang = "";

                    try{
                        locale = new URL(window.location.href).searchParams.get("locale");
                    } catch(e) {
                        console.error(e);
                    }

                    try{
                        lang = new URL(window.location.href).searchParams.get("lang");
                    } catch(e) {
                        console.error(e);
                    }

                    return lang || locale || (navigator.language || navigator.userLanguage).substr(0, 2);
                },

                showSplashScreen: function(pCallback, pShowTill_EVENT, pModal) {
                  if(!document.getElementById("famobi_splash")) {
                    function readSplashFile(file, callback) {
                        var rawFile = new XMLHttpRequest();
                        rawFile.overrideMimeType("application/xhtml+xml");
                        rawFile.open("GET", file, true);
                        rawFile.onreadystatechange = function() {
                            if (rawFile.readyState === 4 && rawFile.status == "200") {
                                callback(rawFile.responseText);
                            }
                        };
                        rawFile.send(null);
                    }
                    readSplashFile("html5games/splash/splash.html",(response)=>{
                      this.includeCSS("html5games/splash/splash.css");
                      let splashScreen = document.createElement("div");
                      splashScreen.classList.add("splash-screen");
                      splashScreen.style.position = "absolute";
                      splashScreen.style.top = "0";
                      splashScreen.style.left = "0";
                      splashScreen.style.width = "100%";
                      splashScreen.style.height = "100%";
                      splashScreen.innerHTML = response;
                      if(this.config.preload_image)splashScreen.querySelector(".logo").src = "html5games/images/"+this.config.preload_image+".png";
                      document.body.appendChild(splashScreen);
                      this.splashScreen = splashScreen;
                      if(pModal) return;
                      if(!pShowTill_EVENT) {
                        setTimeout(()=>this.hideSplashScreen(pCallback), 2000);
                      } else {
                        window.addEventListener(pShowTill_EVENT,()=>this.hideSplashScreen(pCallback));
                      }
                    });
                  }
                  else {
                    splashScreen.style.display = "block";
                    splashScreen.style.animation = splashScreen._orgAni;
                    if(pModal) return;
                    if(!pShowTill_EVENT) {
                      setTimeout(()=>this.hideSplashScreen(pCallback), 2000);
                    } else {
                      window.removeEventListener(pShowTill_EVENT,()=>this.hideSplashScreen(pCallback));
                      window.addEventListener(pShowTill_EVENT,()=>this.hideSplashScreen(pCallback));
                    }
                  }
                },

                hideSplashScreen: function(pCallback) {
                  this.splashScreen.style.display = "none";
                  if(!this.splashScreen._orgAni)this.splashScreen._orgAni = this.splashScreen.style.animation;
                  this.splashScreen.style.animation = "none";
                  if(pCallback)pCallback(this.splashScreen);
                },

                getAbsolutePath: function(relativePath) {
                    var absolutePath =
                        document.location.protocol + "//" + document.location.pathname;

                    if (document.location.protocol !== "file:") {
                        return relativePath;
                    }

                    if (relativePath.startsWith("/")) {
                        relativePath = relativePath.substr(1);
                    }

                    return (
                        absolutePath.substr(0, absolutePath.lastIndexOf("/") + 1) + relativePath
                    );
                },

                menu: {
                    create: function() {
                        // Menu functionality disabled - game only mode
                        return;
                    },
                    show: function() {
                        return this;
                    },
                    hide: function() {
                        return this;
                    },
                    hideAll: function() {
                        return this;
                    },
                    handleClick: function() {
                        return function() {};
                    },
                    removeClick: function() {
                        return this;
                    },
                    eventTrap: function() {},
                    toggleOverlay: function() {
                        return false;
                    },
                    setHtml: function() {},
                    toggleLanguages: function() {},
                    switchLanguage: function() {},
                    bindEvents: function() {}
                },

                getMoreGamesButtonImage: function() {

                    return this.brandingLogo ? this.brandingLogo.src : "html5games/images/" + (this.config.more_games_button_image || "logo") + ".png";
                },

                getBrandingButtonImage: function() {

                    return this.brandingLogo ? this.brandingLogo.src : "html5games/images/" + (this.config.branding_button_image || this.config.more_games_button_image || "logo") + ".png";
                },

                moreGamesLink: function() {

                    var url = "https://famobi.com";

                    if(url = this.config.more_games_url) {
                        window.open(url, "") || (window.top.location.href = url);
                    } else {
                        return;

                        confirm("redirecting to... " + url) && (window.open(url, "") || (window.top.location.href = url));
                    }



                },

                openBrandingLink: function() {
                    this.moreGamesLink();
                },

                sessionStorage: {

                    setItem: function(key, value) {
                        try{
                            window.sessionStorage.setItem(window.famobi_gameID + ":" + key, value);
                        } catch(e) {
                            window.famobi.config.logging && console.log("[SessionStorage] Skipped because of issues");
                        }
                    },
                    getItem: function(key) {
                        try{
                            return window.sessionStorage.getItem(window.famobi_gameID + ":" + key);
                        } catch(e) {
                            window.famobi.config.logging && console.log("[SessionStorage] Skipped because of issues");
                        }
                        return null;

                    },
                    removeItem: function(key) {
                        try{
                            window.sessionStorage.removeItem(window.famobi_gameID + ":" + key);
                        } catch(e) {
                            window.famobi.config.logging && console.log("[SessionStorage] Skipped because of issues");
                        }
                    },
                    clear: function() {
                        try{
                            for (var key in window.sessionStorage) {
                                if (key.startsWith(window.famobi_gameID + ":")) {
                                    window.sessionStorage.removeItem(key);
                                }
                            }
                        } catch(e) {
                            window.famobi.config.logging && console.log("[SessionStorage] Skipped because of issues");
                        }
                    }
                },

                localStorage: {

                    setItem: function(key, value) {
                        try{
                            window.localStorage.setItem(window.famobi_gameID + ":" + key, value);
                        } catch(e) {
                            window.famobi.config.logging && console.log("[LocalStorage] Skipped because of issues");
                        }
                    },
                    getItem: function(key) {
                        try{
                            return window.localStorage.getItem(window.famobi_gameID + ":" + key);
                        } catch(e) {
                            window.famobi.config.logging && console.log("[LocalStorage] Skipped because of issues");
                        }
                        return null;

                    },
                    removeItem: function(key) {
                        try{
                            window.localStorage.removeItem(window.famobi_gameID + ":" + key);
                        } catch(e) {
                            window.famobi.config.logging && console.log("[LocalStorage] Skipped because of issues");
                        }
                    },
                    clear: function() {
                        try{
                            for (var key in window.localStorage) {
                                if (key.startsWith(window.famobi_gameID + ":")) {
                                    window.localStorage.removeItem(key);
                                }
                            }
                        } catch(e) {
                            window.famobi.config.logging && console.log("[LocalStorage] Skipped because of issues");
                        }
                    }
                },

                log: function() {
                    if(this.config && !this.config.logging) {
                        return;
                    }
                    console.log(arguments.length === 1 ? arguments[0] : arguments);
                },

                warn: function() {
                    if(this.config && !this.config.logging) {
                        return;
                    }
                    console.warn(arguments.length === 1 ? arguments[0] : arguments);
                },

                orientation: {

                    init: function() {
                        this.rootElement = document.getElementById("fg-root");
                        this.update(window.famobi.config.gameParams.orientation);
                    },

                    update: function(orientation) {
                        if (
                            typeof orientation != "undefined" &&
                            (window.famobi.config.rotation || (window.famobi.config.rotation !== false && !detection.is.pc && !detection.is.tablet)) &&
                            window.screen &&
                            window.screen.height !== window.screen.width
                        ) {
                            this.rootElement.className =
                                this.rootElement.className + " fg-orientation-" + orientation;

                            if (typeof this.fgLandscapeOverlay == "undefined") {
                                this.fgLandscapeOverlay = document.createElement("div");
                                this.fgLandscapeOverlay.setAttribute("id", "fg-landscape-overlay");

                                this.fgLandscapeImage = document.createElement("img");
                                this.fgLandscapeImage.setAttribute(
                                    "src",
                                    "html5games/images/RotateToLandscape.png"
                                );
                                this.fgLandscapeImage.setAttribute("class", "fg-orientation-icon");
                                this.fgLandscapeImage.setAttribute("alt", "switch to landscape");
                                this.fgLandscapeOverlay.appendChild(this.fgLandscapeImage);

                                this.rootElement.appendChild(this.fgLandscapeOverlay);
                            }

                            if (typeof this.fgPortraitOverlay == "undefined") {
                                this.fgPortraitOverlay = document.createElement("div");
                                this.fgPortraitOverlay.setAttribute("id", "fg-portrait-overlay");

                                this.fgPortraitImage = document.createElement("img");
                                this.fgPortraitImage.setAttribute(
                                    "src",
                                    "html5games/images/RotateToPortrait.png"
                                );
                                this.fgPortraitImage.setAttribute("class", "fg-orientation-icon");
                                this.fgPortraitImage.setAttribute("alt", "switch to portrait");
                                this.fgPortraitOverlay.appendChild(this.fgPortraitImage);

                                this.rootElement.appendChild(this.fgPortraitOverlay);
                            }
                        }

                        return this;
                    }
                },

                sizeOf: function(data) {
                    var length = 0;
                    var prop;

                    if (!data) {
                        return length;
                    }

                    if (typeof data.length != "undefined") {
                        return data.length;
                    }

                    if (Object.keys) {
                        length = Object.keys(data).length;
                    } else {
                        for (prop in data) {
                            if (data.hasOwnProperty(prop)) {
                                length++;
                            }
                        }
                    }
                    return length;
                },

                getOrientation: function() {
                    var orientationMatch = window.matchMedia('all and (orientation:landscape)');

                    if(orientationMatch && orientationMatch.matches === true) {
                        return 'landscape';
                    }
                    return 'portrait';
                },

                onOrientationChange: function(callback) {
                    this.orientationChangeCallback = callback;

                    if (typeof callback !== "function") {
                      this.error("famobi.onorientationchange: no valid callback provided.");
                    }
                    return faZepto(window).resize(callback);
                },

                submitHighscore: function(level, score, isTriggered) {

                    !isTriggered && this.warn("famobi.submitHighscore is deprecated, please use famobi_analytics.trackEvent('EVENT_LEVELSCORE')instead: https://sites.google.com/a/famobi.com/api-docs/api-implementation/famobi-analytics");
                },
                levelUp: function() {
                    this.warn("famobi.levelUp is deprecated, please use famobi_analytics.trackEvent('EVENT_LEVELSUCCESS') instead: https://sites.google.com/a/famobi.com/api-docs/api-implementation/famobi-analytics");
                },
                gameOver: function() {
                    this.warn("famobi.gameOver is deprecated, please use famobi_analytics.trackEvent('EVENT_LEVELFAIL') instead: https://sites.google.com/a/famobi.com/api-docs/api-implementation/famobi-analytics");
                },
                includeCSS: function(href) {
                    var head  = document.getElementsByTagName('head')[0],
                        link  = document.createElement('link');

                    link.rel  = 'stylesheet';
                    link.type = 'text/css';
                    link.href = href;

                    head.appendChild(link);
                },
                sendLiveScore: function(liveScore) {
                },
                hasRewardedAd: function() {
                    return this.hasFeature("rewarded");
                },
                hasFeature: function(feature) {

                    if(feature == "local") feature = "standalone";
                    return (feature in this.config.features) && !!this.config.features[feature];
                },
                getAppLink: function() {
                    return "";
                },
                getUrlParams: function(a, b, c) {
                    a = /[?&]?([^=]+)=([^&]*)/g, b = document.location && document.location.search ? document.location.search.split("+").join(" ") : "";
                    for (var d = {}; c = a.exec(b);) d[decodeURIComponent(c[1])] = decodeURIComponent(c[2]);

                        if(d['fg_aid']) {
                            this.config.aid = d['fg_aid'];
                        } else {
                            d['fg_aid'] = this.config.aid;
                        }

                    return d;
                },
                showLeaderboard: function() {
                    if(!window.famobi.hasFeature("highscores")) return;
                },
                game: {
                    waitingCounter: 0,
                    setWaiting: function(newVal) {
                        newVal
                            ? this.waitingCounter++
                            : this.waitingCounter > 0
                            ? this.waitingCounter--
                            : (this.waitingCounter = 0);
                        return this;
                    },
                    isWaiting: function() {
                        return this.waitingCounter > 0;
                    },
                    canResume: function() {
                        return this.waitingCounter === 1;
                    },
                    init: function() {
                        this.waitingCounter = 0;
                    },
                    pause: function() {

                        if (this.isWaiting()) {
                            this.setWaiting(true);
                            return false;
                        }

                        this.setWaiting(true);

                        try {
                            if (typeof window.famobi_onPauseRequested == "function") {
                                window.famobi_onPauseRequested();
                                return true;
                            }
                            if (window.game && typeof window.game.paused !== "undefined") {
                                window.game.paused = true;
                                return true;
                            }
                            if (typeof window.cr_setSuspended !== "undefined") {
                                cr_setSuspended(true);
                                return true;
                            }
                            if (typeof window.createjs !== "undefined") {
                            }
                        } catch (e) {
                            window.famobi.log("Pausing game failed: " + e);
                        }
                    },
                    resume: function() {

                        if (!this.isWaiting()) {
                            return false;
                        }

                        if (!this.canResume()) {
                            this.setWaiting(false);
                            return false;
                        }

                        this.setWaiting(false);

                        try {
                            if (typeof window.famobi_onResumeRequested == "function") {
                                window.famobi_onResumeRequested();
                                return true;
                            }
                            if (window.game && typeof window.game.paused !== "undefined") {
                                window.game.paused = false;
                                return true;
                            }
                            if (typeof window.cr_setSuspended !== "undefined") {
                                cr_setSuspended(false);
                                return true;
                            }
                            if (typeof window.createjs !== "undefined") {
                            }
                        } catch (e) {
                            window.famobi.log("Resuming game failed: " + e);
                        }

                        return false;
                    }
                },
                translateHtml: function() {
                    return this.gametranslation.translateHtml.apply(this, arguments);
                },
                setPreloadProgress: function(percent) {
                    if(this.config.logging) {
                        console.info(percent + "%");
                    }
                },
                gameReady: function() {

                    this.adapters.run("game", "ready");
                    this.log("Received gameReady signal");
                },
                playerReady: function() {

                    this.adapters.run("player", "ready");
                    this.log("Received playerReady signal");
                },
                setVolume: function(vol) {
                    this.volume = Math.max(0.0, Math.min(1.0, vol));
                    if(this.volume != vol) {
                        console.warn("volume: value out of bounds. Now forced to " + this.volume);
                    }
                    this.adapters.run("request", "changeVolume", this.volume);
                },
                getVolume: function() {
                    return this.volume;
                },
                getFeatureProperties: function(feature) {
                    return this.hasFeature(feature) && (typeof this.config.features[feature] == "object") ? this.config.features[feature] : {};
                },
                adaptersModule: function() {
                    var self = this,
                        M;

                    function module() {

                        this.adapters = {
                            ads: {
                                show: this.createAdapter(),
                                rewarded: this.createAdapter(),
                                callback: this.createAdapter(),
                                vastUrl: this.createAdapter()
                            },
                            adEvent: {
                                loaded: this.createAdapter(),
                                displayed: this.createAdapter(),
                                errored: this.createAdapter(),
                                userClosed: this.createAdapter(),
                                completed: this.createAdapter()
                            },
                            analytics: {
                                trackEvent: this.createAdapter(),
                                trackScreen: this.createAdapter(),
                                trackStats: this.createAdapter()
                            },
                            api: {
                                created: this.createAdapter({queueCalls: true, runOnce: true})
                            },
                            game: {
                                loaded: this.createAdapter({queueCalls: true, runOnce: true}),
                                gameOver: this.createAdapter(),
                                levelUp: this.createAdapter(),
                                preloadProgress: this.createAdapter(),
                                preloadComplete: this.createAdapter({queueCalls: true, runOnce: true}),
                                ready: this.createAdapter({queueCalls: true, runOnce: true})
                            },
                            player: {
                                ready: this.createAdapter({queueCalls: true, runOnce: true})
                            },
                            highscore: {
                                show: this.createAdapter(),
                                submit: this.createAdapter()
                            },
                            screenshot: {
                                submit: this.createAdapter()
                            },
                            request: {
                                startGame: this.createAdapter({queueCalls: true, runOnce: true}),
                                stopGame: this.createAdapter(),
                                restartGame: this.createAdapter(),
                                pauseGameplay: this.createAdapter(),
                                resumeGameplay: this.createAdapter(),
                                enableAudio: this.createAdapter(),
                                disableAudio: this.createAdapter(),
                                enableMusic: this.createAdapter(),
                                disableMusic: this.createAdapter(),
                                changeVolume: this.createAdapter()
                            },
                            viewport: {
                                orientationChanged: this.createAdapter({queueCalls: true, queueLength: 1, runOnce: false}),
                                offsetChanged: this.createAdapter({queueCalls: true, queueLength: 1, runOnce: false})
                            }
                        };

                        this.adapter_templates = {
                            ads: {
                                show: [function(callback, force) {
                                }],
                                rewarded: [function(callback) {
                                }],
                                callback: [function(options) {
                                }],
                                vastUrl: [function() {
                                }]
                            },
                            adEvent: {
                                loaded: [function(ad) {
                                    /**/
                                }],
                                displayed: [function() {
                                    /**/
                                }],
                                errored: [function(adErrorEvent) {
                                    /**/
                                }],
                                userClosed: [function(adcount) {
                                    /**/
                                }],
                                completed: [function(adcount) {
                                    /**/
                                }]
                            },
                            analytics: {
                                trackEvent: [function(event, params) {
                                    /**/
                                }],
                                trackScreen: [function(screen, pageTitle) {
                                    /**/
                                }],
                                trackStats: [function(key, value) {
                                    /**/
                                }]
                            },
                            api: {
                                created: [function(apiInstance) {
                                    /**/
                                }]
                            },
                            game: {
                                loaded: [function() {
                                    /**/
                                }],
                                gameOver: [function() {
                                    /**/
                                }],
                                levelUp: [function() {
                                    /**/
                                }],
                                preloadProgress: [function() {
                                    /**/
                                }],
                                preloadComplete: [function() {
                                    /**/
                                }],
                                ready: [function() {
                                    /**/
                                }]
                            },
                            highscore: {
                                show: [function(level) {
                                    /**/
                                }],
                                submit: [function(level, score) {
                                    /**/
                                }]
                            },
                            screenshot: {
                                submit: [function(screenshot_url, options) {
                                    /**/
                                }]
                            },
                            request: {

                                startGame: [function() {
                                }],
                                stopGame: [function() {
                                }],
                                restartGame: [function() {
                                }],
                                pauseGameplay: [function() {
                                }],
                                resumeGameplay: [function() {
                                }],
                                enableAudio: [function() {
                                }],
                                disableAudio: [function() {
                                }],
                                enableMusic: [function() {
                                }],
                                disableMusic: [function() {
                                }],
                                changeVolume: [function(vol) {
                                }]
                            },
                            player: {
                                ready: [function() {
                                    /**/
                                }]
                            }
                        };
                    }

                    var adaptersPrototype = module.prototype;

                    adaptersPrototype.createAdapter = function(options) {
                        return {
                            callbacks: [],
                            queueCalls: !!(options && options.queueCalls),
                            queue: [],
                            runOnce: !!(options && options.runOnce),
                            numRuns: 0
                        };
                    };

                    adaptersPrototype.init = function() {
                        var section = "",
                            subsection = "";

                        if (typeof window.famobi_adapters !== "undefined") {
                            for (section in window.famobi_adapters) {
                                for (subsection in window.famobi_adapters[section]) {
                                    this.add(
                                        section,
                                        subsection,
                                        window.famobi_adapters[section][subsection]
                                    );
                                }
                            }
                        }
                    };

                    adaptersPrototype.list = function() {
                        //self.log("available adapters: ", this.adapters);
                        //self.log("adapter templates: ", this.adapter_templates);
                        return this.adapters;
                    };

                    adaptersPrototype.add = function(section, subsection, callback) {

                        if (!(section in this.adapters && subsection in this.adapters[section])) {
                            self.log("adapters.add: invalid (sub-)section");
                            return this;
                        }

                        if (typeof callback !== 'function') {
                            self.log("adapters.add: invalid callback");
                            return this;
                        }

                        var adapter = this.adapters[section][subsection];

                        if (typeof adapter != 'object' || !Array.isArray(adapter.callbacks)) {
                            self.log("adapters.add: broken adapter object for", section, subsection);
                            return this;
                        }

                        // self.log("adapters.add: push callback for", section, subsection);
                        adapter.callbacks.push(callback);

                        if (adapter.queueCalls && adapter.queue.length > 0) {
                            adapter.queue.forEach(function(args) {
                                try {
                                    callback.apply(this, args);
                                } catch(err) {
                                    console.warn("adapters.run: callback failed for", section + "." + subsection, "\n", err);
                                }
                            }, this);
                        }

                        return this;
                    };

                    adaptersPrototype.has = function(section, subsection) {
                        return (section in this.adapters) &&
                            (subsection in this.adapters[section]) &&
                            (typeof this.adapters[section][subsection] == "object") &&
                            Array.isArray(this.adapters[section][subsection].callbacks) &&
                            (this.adapters[section][subsection].callbacks.length > 0);
                    };

                    adaptersPrototype.run = function(section, subsection) {
                        var args = arguments ? Array.prototype.slice.call(arguments, 2) : [];

                        if (!(section in this.adapters) ||
                                !(subsection in this.adapters[section]) ||
                                !(typeof this.adapters[section][subsection] == "object")) {
                            return false;
                        }

                        var adapter = this.adapters[section][subsection];

                        if (adapter.runOnce && adapter.numRuns > 0) {
                            console.warn("adapters.run: one-time adapter called more than once for", section + "." + subsection, "\n");
                            return false;
                        }

                        adapter.numRuns += 1;

                        if (adapter.queueCalls) {
                            adapter.queue.push(args);
                        }

                        if (adapter.callbacks.length > 0) {
                            adapter.callbacks.forEach(function(callback) {
                                try {
                                    callback.apply(this, args);
                                } catch(err) {
                                    console.warn("adapters.run: callback failed for", section + "." + subsection, "\n", err);
                                }
                            }, this);
                            return true;
                        }

                        return false;
                    };

                    M = new module();
                    M.init();

                    return M;
                },
                requestsModule: function() {
                    var self = this,
                        M;

                    function module() {
                        // define private vars
                        this.adapterSection = "requests";
                        this.legitActionIdentifiers = [
                            "startGame",
                            "stopGame",
                            "restartGame",
                            "pauseGameplay",
                            "resumeGameplay",
                            "enableAudio",
                            "enableMusic",
                            "disableAudio",
                            "disableMusic",
                            "changeVolume"
                        ];
                    }

                    var requestsPrototype = module.prototype;

                    requestsPrototype.init = function() {
                    };

                    requestsPrototype.isAction = function(actionIdentifier) {
                        return typeof actionIdentifier === "string" &&
                            (M.legitActionIdentifiers.indexOf(actionIdentifier) > -1)
                    };

                    requestsPrototype.onRequest = function(actionIdentifier, callback) {

                        if (!self.adapters) {
                            console.warn(
                                "onRequest(): adapters module required"
                            );
                            return;
                        }

                        if (!M.isAction(actionIdentifier))  {
                            console.warn(
                                "onRequest(): required param 'action' has to be one of \"" +
                                    M.legitActionIdentifiers.join('", "') + '"'
                            );
                            return;
                        }

                        if (typeof callback !== "function") {
                            console.warn(
                                "onRequest(): required param 'callback' has to be of type 'function'"
                            );
                            return;
                        }

                        self.adapters.add("request", actionIdentifier, callback);
                    };

                    requestsPrototype.requestAction = function(actionIdentifier) {

                        if (!self.adapters) {
                            console.warn(
                                "onRequest(): adapters module required"
                            );
                            return;
                        }

                        if (!M.isAction(actionIdentifier))  {
                            console.warn(
                                "requestAction(): required param 'action' has to be one of \"" +
                                    M.legitActionIdentifiers.join('", "') + '"'
                            );
                            return;
                        }

                        self.adapters.run.apply(self.adapters, ["request"].concat(Array.from(arguments)))
                    };

                    M = new module();
                    M.init();

                    return M;
                },
                onRequest: function(action, callback) {

                    if (!this.requests) {
                        console.warn(
                            "onRequest(): requests module required"
                        );
                        return;
                    }

                    this.requests.onRequest(action, callback);
                },
                requestAction: function() {

                    if (!this.requests) {
                        console.warn(
                            "onRequest(): requests module required"
                        );
                        return;
                    }

                    this.requests.requestAction.apply(this, arguments);
                },
                getOffsets: function() {
                    return this.offsets;
                },
                setOffsets: function(top = 0, right = 0, bottom = 0, left = 0) {
                    
                    if(typeof top === "object") {
                        this.offsets.top = top.top || 0;
                        this.offsets.right = top.right || 0;
                        this.offsets.bottom = top.bottom || 0;
                        this.offsets.left = top.left || 0;
                    } else {
                        this.offsets.top = top;
                        this.offsets.right = right;
                        this.offsets.bottom = bottom;
                        this.offsets.left = left;
                    }

                    window.famobi.adapters.run("viewport", "offsetChanged", this.offsets);
                },
                onOffsetChange: function(callback) {
                    this.onOffsetChangeCallback = callback;
                },
                getConsentStatus: function(type) {
                    return true;
                }
            };
            // export famobi object to global object
        b[a] = famobi;

    }('famobi', window);

    var isPageReady = new Promise(function(resolve, reject) {
       var readyRE = /complete|loaded|interactive/;
       if (readyRE.test(document.readyState) && document.body) {
           resolve();
       }
       else {
           document.addEventListener('DOMContentLoaded', resolve, false);
       }
    });

    isPageReady.then(function() {

        window.famobi.adapters = window.famobi.adaptersModule.call(window.famobi);
        window.famobi.requests = window.famobi.requestsModule.call(window.famobi);

        return window.famobi.init();

    }).then(function() {

        if (window.famobi.hasOwnProperty("adapters")) {
            window.famobi.adapters.run("api", "created", famobi);
        }
        return Promise.resolve();

    }).then(function() {
        window.famobi.showInterstitialAd("preroll", () => {
            setTimeout(function() {
                (function next() {
                    if (!window.famobi_gameJS.length) {

                        window.famobi.gametranslation.init();
                        window.famobi.orientation.init();

                        window.setTimeout(function() {
                            var e = document.createEvent('Events');
                            e.initEvent("deviceready", true, false);
                            document.dispatchEvent(e);
                        }, 50);

                        return;
                    }
                    var currentScript = window.famobi_gameJS.shift();

                    if (typeof currentScript === "function") {
                        if(typeof Zepto !== "undefined" && typeof window.faZepto === "undefined") {
                            window.faZepto = Zepto;

                            // see https://github.com/blai/fashionista/issues/2
                            ;(function ($) {
                                $.getScript = function(src, func, error_func) {
                                    var script = document.createElement('script');
                                    script.async = "async";
                                    script.src = src;
                                    if (func) {
                                        script.onload = func;
                                    }
                                    if (error_func) {
                                        script.onerror = error_func;
                                    }
                                    document.getElementsByTagName("head")[0].appendChild( script );
                                };
                            })(Zepto);
                        }

                        if(currentScript instanceof Promise) {
                            currentScript().then(function() {
                                next();
                            });
                        } else {
                            currentScript()
                            next();
                        }
                    }
                    else {
                        var scriptEl = document.createElement("script"),
                            _currentScript = currentScript.match(/(\{(.*?)\})/);
                        scriptEl.onload = next;
                        scriptEl.onerror = next;
                        scriptEl.src = _currentScript ? window.famobi.__(_currentScript[2]) : currentScript;
                        document.body.appendChild(scriptEl);
                    }
                })();
            }, window.famobi.config.nextTimeout || 0);
        });
    });
}