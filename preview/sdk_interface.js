/**
 * SDK INTERFACE v1.0.4
 ** /

/*
	SETTINGS
 */
const SDK_INTERFACE_SETTINGS = {

	isProd: true,
	debugLevel: 0,
	forceMockObject: false,

	// ads
	interstitial: {
		enabled: true, // enable/disable interstitial ads
		initial: false, // show initial ad
		preload: 250, // preload interval in ms
		retry: 2000, // timeout before retry after preload fail
		timout: 250, // timout before calling showRewarded()
		cooldown: 0, // time between ads
	},
	rewarded: {
		enabled: true, // enable/disable rewarded ads
		preload: 250, // preload interval in ms
		retry: 2000, // timeout before retry after preload fail
		timout: 250, // timout before calling showRewarded()
		reward: true // reward when in doubt
	},

	// files to load
	externalFiles: ["//games.cdn.famobi.com/scripts/microsoft-start/migrateStorage.js?v="+(Math.floor(new Date().getTime() / 600000)), "//assets.msn.com/staticsb/statics/latest/msstart-games-sdk/msstart-v1.0.0-rc.19.min.js", "sdk_interface_custom.js"],

	// features
	features: {
		auto_quality: false,
		copyright: true,
		credits: true,
		external_achievements: false,
		external_leaderboard: false,
		external_mute: false,
		external_pause: false,
		external_start: false,
		forced_mode: false,
		leaderboard: false,
		multiplayer: false,
		multiplayer_local: true,
		skip_title: false,
		skip_tutorial: false,
		standalone: true
	},

	// forced mode
	forced_mode: {

	},

	// misc
	aid: "A1234-5", // affiliate id
	name: "Famobi", // name of partner/customer
	branding_url: "",
	branding_image: "logo", // "logo" = transparent
	show_splash: false,
	menuless: true
};

const SDK_INTERFACE_HELPERS = {

	adInstanceInterstitial: {},
	adInstanceRewarded: {},
	adInstanceDisplay: {},

	log: function() {
		if(SDK_INTERFACE_SETTINGS.debugLevel === 0) {
			return;
		}
		console.log(...arguments);
	},

	displayAds: {

		displayAdPlacement: null,
		isBusy: false,
		useFenster: false,

		supportedValues: {
			"top": [
				{position: "top", width: 728, height: 90},
				{position: "top", width: 970, height: 250}
			],
			"right": [
				{position: "right", width: 160, height: 600},
				{position: "right", width: 300, height: 600},
				{position: "right", width: 300, height: 250},
				{position: "right", width: 320, height: 50}
			],
			"bottom": [
				{position: "bottom", width: 320, height: 50}
			],
			"left": [
				{position: "left", width: 300, height: 250},
				{position: "left", width: 300, height: 600},
				{position: "left", width: 320, height: 50},
				{position: "left", width: 160, height: 600}
			]
		},

		init: function() {

			let resizeTimer;

			const onOrientationChange = () => {
				this.resetOffset();
			};

			const updateHandler = () => {

				let orientation = this.getOrientation();

				if(this.orientation !== orientation) {
					this.orientation = orientation;
					onOrientationChange();
				}

				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(() => {
					this.getAdPlacement().then(displayAdPlacement => {
						if(displayAdPlacement === null) {
							// console.log
						}
						if(displayAdPlacement !== null && this.displayAdPlacement !== displayAdPlacement) {
							this.update(displayAdPlacement);
						}
					})
				}, 500);
			};

			window.addEventListener("resize", updateHandler);
			window.addEventListener("orientationchange", onOrientationChange);

			this.orientation = this.getOrientation();

			this.interval = setInterval(() => {
				updateHandler();
			}, 3E3);

			updateHandler();
		},

		update: function(displayAdPlacement) {

			if(this.isBusy) {
				return;
			}

			SDK_INTERFACE_HELPERS.log("[display ad] updating...", displayAdPlacement);

			this.isBusy = true;

			SDK_INTERFACE_HELPERS.$msstart.hideDisplayAdsAsync().then(response => {
				// console.log(response);
			}).catch(e => {

			}).then(() => {

				SDK_INTERFACE_HELPERS.$msstart.showDisplayAdsAsync(displayAdPlacement).then(response => {
				    setTimeout(() => {
				    	this.displayAdPlacement = displayAdPlacement;
				    	this.updateOffset(displayAdPlacement);
				    	this.isBusy = false;
				    }, 1E3);
				}).catch(e => {
					SDK_INTERFACE_HELPERS.log(e);
					setTimeout(() => {
						this.displayAdPlacement = null;
						this.isBusy = false;
					}, 1E3);
				});
			})
		},

		resetOffset: function() {
			
			let offsets = {top: 0, right: 0, bottom: 0, left: 0};

			if(this.useFenster && typeof fenster !== "undefined") {
				window.fenster.set(offsets);
			} else {
				window.famobi.setOffsets(offsets);
			}
		},

		getOrientation: function() {
			return window.innerWidth <= window.innerHeight ? "portrait" : "landscape";
		},

		updateOffset: function(displayAdPlacement) {

			displayAdPlacement = displayAdPlacement || this.displayAdPlacement;

			let position = displayAdPlacement.split(":")[0],
				size = displayAdPlacement.split(":")[1],
				width = parseInt(size.split("x")[0]),
				height = parseInt(size.split("x")[1]),
				offsets = {};

			let padding = 50;

			offsets[position] = ["top", "bottom"].includes(position) ? (height + padding) : (width + padding);

			if(this.useFenster && typeof fenster !== "undefined") {
				window.fenster.set(offsets);
			} else {
				window.famobi.setOffsets(offsets);
			}
		},

		getAdPlacement: function() {

			return new Promise((resolve, reject) => {

				let adPlacement = "";

				if(this.getOrientation() === "portrait") {
					adPlacement = this.getSupportedValues("bottom");
						
				} else {
					adPlacement = this.getSupportedValues("right");
				}

				SDK_INTERFACE_HELPERS.log("adPlacement", adPlacement);

				resolve(adPlacement);
			});
		},

		getSupportedValues: function(placement) {
			
			if(!["top", "right", "bottom", "left"].includes(placement)) {
				return null;
			}

			for(let i = 0; i < this.supportedValues[placement].length; i++) {
				if(
					this.supportedValues[placement][i].width <= window.innerWidth &&
					this.supportedValues[placement][i].height <= window.innerHeight
				) {
					return this.supportedValues[placement][i].position + ":" + 
						this.supportedValues[placement][i].width + "x" +
						this.supportedValues[placement][i].height
				}
			}

			return null;
		}
	},

	$msstart: {

		getConsentStringAsync: function() {
			SDK_INTERFACE_HELPERS.log("$msstart.getConsentStringAsync()");
			return $msstart.getConsentStringAsync();
		},

		getEntryPointInfo: function() {
			SDK_INTERFACE_HELPERS.log("$msstart.getEntryPointInfo()");
			return $msstart.getEntryPointInfo();
		},

		getLocale: function() {
			SDK_INTERFACE_HELPERS.log("$msstart.getLocale()");
			return $msstart.getLocale();
		},

		getSignedInUserAsync: function() {
			SDK_INTERFACE_HELPERS.log("$msstart.getSignedInUserAsync()");
			return $msstart.getSignedInUserAsync();
		},

		getSourceShareId: function() {
			SDK_INTERFACE_HELPERS.log("$msstart.getSourceShareId()");
			return $msstart.getSourceShareId();
		},

		hideDisplayAdsAsync: function() {
			SDK_INTERFACE_HELPERS.log("$msstart.hideDisplayAdsAsync()");
			return $msstart.hideDisplayAdsAsync();
		},

		isInMicrosoftStart: function() {
			SDK_INTERFACE_HELPERS.log("$msstart.isInMicrosoftStart()");
			return $msstart.isInMicrosoftStart();
		},

		loadAdsAsync: function(loadAdOptions) {
			SDK_INTERFACE_HELPERS.log("$msstart.loadAdsAsync()", loadAdOptions);
			return $msstart.loadAdsAsync(loadAdOptions);
		},

		pingAsync: function() {
			SDK_INTERFACE_HELPERS.log("$msstart.pingAsync()");
			return $msstart.pingAsync();
		},

		promptInstallAsync: function() {
			SDK_INTERFACE_HELPERS.log("$msstart.promptInstallAsync()");
			return $msstart.promptInstallAsync();
		},

		shareAsync: function(shareData) {
			SDK_INTERFACE_HELPERS.log("$msstart.shareAsync()", shareData);
			return $msstart.shareAsync(shareData);
		},

		showAdsAsync: function(instanceId) {
			SDK_INTERFACE_HELPERS.log("$msstart.showAdsAsync('%s')", instanceId);
			return $msstart.showAdsAsync(instanceId);
		},

		showDisplayAdsAsync: function(displayAdPlacement) {
			SDK_INTERFACE_HELPERS.log("$msstart.showDisplayAdsAsync()", displayAdPlacement);
			return $msstart.showDisplayAdsAsync(displayAdPlacement);
		},

		signInAsync: function() {
			SDK_INTERFACE_HELPERS.log("$msstart.signInAsync()");
			return $msstart.signInAsync();
		},

		submitGameResultsAsync: function(primaryStatValue) {
			SDK_INTERFACE_HELPERS.log("$msstart.submitGameResultsAsync(%s)", primaryStatValue);
			return $msstart.submitGameResultsAsync(primaryStatValue);
		},

		switchGameAsync: function(switchGameData) {
			SDK_INTERFACE_HELPERS.log("$msstart.switchGameAsync()", switchGameData);
			return $msstart.switchGameAsync(switchGameData);
		}
	}
};

const SDK_INTERFACE_OVERRIDES = {
	famobi: {

		getCurrentLanguage: function() {
			let lang = SDK_INTERFACE_HELPERS.$msstart.getLocale();
			if(typeof lang === "string" && lang.length >= 2) {
				return lang.substr(0, 2);
			}
			return "en";
		},

		/*
		setPreloadProgress: function(progress) {

		},
		*/

		gameReady: function() {
			// SDK_INTERFACE_HELPERS.displayAds.init();
		},

		/*

		playerReady: function(progress) {

		},
		*/
	},
	famobi_analytics: {
		trackEvent: function(event, params) {

			return new Promise(function(resolve, reject) {
				switch(event) {

					/*
					case "EVENT_LEVELFAIL":
						if(params.reason !== "quit") {
							window.famobi.showAd(function() {

							})
						}
						break;
					*/

					default:
						// nothing to do
				}
				return resolve(event, params);
			});
		}
	}
}

const SDK_INTERFACE_PRELOAD_AD = function(type) {

	return new Promise(function(resolve, reject) {

		switch(type) {
			case "interstitial":
				return SDK_INTERFACE_HELPERS.$msstart.loadAdsAsync().then(adInstance => {
					SDK_INTERFACE_HELPERS.log("[interstitial] adInstance", adInstance);
					SDK_INTERFACE_HELPERS.adInstanceInterstitial = adInstance;
					resolve();
				}).catch(e => {
					SDK_INTERFACE_HELPERS.log(e);
					(e.code === "LOAD_ADS_CLIENT_FAILURE" && e.extra && e.extra.error === "Ads already loaded.") ? resolve() : reject();
				});
			case "rewarded":
				return SDK_INTERFACE_HELPERS.$msstart.loadAdsAsync(true).then(adInstance => {
					SDK_INTERFACE_HELPERS.log("[rewarded] adInstance", adInstance);
					SDK_INTERFACE_HELPERS.adInstanceRewarded = adInstance;
					resolve();
				}).catch(e => {
					SDK_INTERFACE_HELPERS.log(e);
					(e.code === "LOAD_ADS_CLIENT_FAILURE" && e.extra && e.extra.error === "Ads already loaded.") ? resolve() : reject();
				});
			default:
				// do nothing
		}
	});
};

const SDK_INTERFACE_SHOW_AD = function() {

	return new Promise(function(resolve, reject) {

		SDK_INTERFACE_HELPERS.$msstart.showAdsAsync(SDK_INTERFACE_HELPERS.adInstanceInterstitial.instanceId).then(adInstance => {
			adInstance.showAdsCompletedAsync.then(() => {
				resolve();
			}).catch(e => {
				resolve();
			});
		}).catch(e => {
			SDK_INTERFACE_HELPERS.log(e);
			resolve();
		});
	});
};

const SDK_INTERFACE_REWARDED_AD = function() {

	return new Promise(function(resolve, reject) {

		SDK_INTERFACE_HELPERS.$msstart.showAdsAsync(SDK_INTERFACE_HELPERS.adInstanceRewarded.instanceId).then(
			adInstance => {
		    	adInstance.showAdsCompletedAsync.then(() => {
		    		resolve(true);
		    	}).catch(e => {
					resolve(false);
				});
			}).catch(e => {
				SDK_INTERFACE_HELPERS.log(e);
				resolve(false);
			});
	});
};

const SDK_INTERFACE_MOCK_OBJECT = function() {
	return new Promise(function(resolve, reject) {

		$msstart = {

			ShareGameData: {
				title: "",
				text: "",
				image: ""
			},

			EntryPointInfo: {
				entryPointId: "",
				entryPointName: ""
			},

			PlayerInfo: {
				playerId: ""
			},

			LoadAdOptions: {
				isRewardedAd: false,
				canBackfill: false
			},

			AdInstance: {
				instanceId: "",
				showAdsCompletedAsync: function() {
					return Promise.resolve();
				}
			},

			SwitchGameData: {
				id: "",
				payloadData: {

				}
			},

			/**
			 * An API that allows a game to get the consent string from the parent container.
			 * This API currently returns the consent string only in EU countries.
			 **/
			getConsentStringAsync: function() {
				return Promise.resolve("");
			},

			/**
			 * Returns information about the entry point from which the game was launched.
			 **/
			getEntryPointInfo: function() {
				return this.EntryPointInfo;
			},

			/**
			 * Returns the a lower cased locale value that the game should use to localize in-game experiences.
			 **/
			getLocale: function() {
				return "en-us";
			},

			/**
			 * An API that allows a game to retrieve signed in users Player Id associated with Microsoft Start Games.
			 **/
			getSignedInUserAsync: function() {
				return Promise.resolve(this.PlayerInfo);
			},

			/**
			 * Returns the id of shared game event.
			 **/
			getSourceShareId: function() {
				return "";
			},

			/**
			 * An API that invokes to hide display ads over the game
			 **/
			hideDisplayAdsAsync: function() {
				return Promise.resolve("");
			},

			/**
			 * A function that can be used to test whether the game is currently running within Microsoft Start.
			 **/
			isInMicrosoftStart: function() {
				return false;
			},

			/**
			 * An API that loads ad instance.
			 **/
			loadAdsAsync: function(loadAdOptions) {

				return new Promise((resolve, reject) => {
					if(Math.random() > 0.3) {
						return resolve({
							instanceId: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10),
							rewarded: !!loadAdOptions,
							showAdsCompletedAsync: Promise.resolve()
						});
					}
					reject({
						code: "LOAD_ADS_CLIENT_FAILURE",
						description: "Loading In-Game Ads Failed.",
						extra: {
							isRewardedAd: !!loadAdOptions,
							canBackfill: false,
							error: !!loadAdOptions ? "Ads is being loaded." : "Ads already loaded."
						}
					});
				});
			},

			/**
			 * An API that allows a game to ping Microsoft Start Games to test the connection between the container and itself.
			 **/
			pingAsync: function() {
				return Promise.resolve("");
			},

			/**
			 * An API that invokes a PWA install prompt flow on Microsoft Start Games.
			 * It will display a dialog modal and wait until the user either confirms or cancels the install.
			 **/
			promptInstallAsync: function() {
				return Promise.resolve("");
			},

			/**
			 * An API that loads ad instance.
			 **/
			shareAsync: function(shareData) {
				return Promise.resolve("");
			},

			/**
			 * An API that invokes a share flow on Microsoft Start Games.
			 **/
			showAdsAsync: function(instanceId) {

				return new Promise((resolve, reject) => {

					const closeInterstitialAd = function() {
						let adInstance = { ...SDK_INTERFACE_HELPERS.adInstanceInterstitial};
						SDK_INTERFACE_HELPERS.adInstanceInterstitial = {};
						resolve(adInstance);
					};

					const closeRewardedAd = function(isGranted) {
						let adInstance = { ...SDK_INTERFACE_HELPERS.adInstanceRewarded};
						SDK_INTERFACE_HELPERS.adInstanceRewarded = {};

						if(isGranted) {
							resolve(adInstance);
						} else {
							reject({
								code: "SHOW_ADS_COMPLETED_FAILURE",
								description: "User closed rewarded ad before completion.",
								extra: {
									error: "No loaded ads with the given id found."
								}
							});
						}
					};

					if((SDK_INTERFACE_HELPERS.adInstanceRewarded.instanceId || null) === instanceId) {

						if(typeof Swal !== "undefined") {
							return Swal.fire({
								title: "<strong>[REWARDED AD]</strong>",
								html: "<i>This dialog represents a rewarded ad.</i><br /><br /><b>Important:</b> In any case, the game should now be muted!",
								showDenyButton: true,
								confirmButtonText: 'Grant reward',
								denyButtonText: 'Deny reward',
								didDestroy: () => {
									closeRewardedAd(false);
								}
							}).then(result => {
								closeRewardedAd(result.isConfirmed || false);
							});
						}

						return closeRewardedAd(confirm("Rewarded ad ended. Should a reward be granted?"));
					}

					if((SDK_INTERFACE_HELPERS.adInstanceInterstitial.instanceId || null) === instanceId) {
						
						if(typeof Swal !== "undefined") {
							return Swal.fire({
								title: "<strong>[INTERSTITIAL AD]</strong>",
								html: "<i>This dialog represents an interstitial ad.</i><br /><br /><b>Important:</b> In any case, the game should now be muted!",
								confirmButtonText: 'Close',
								didDestroy: () => {
									closeInterstitialAd();
								}
							});

						}
						alert("This is an ad!");
						return closeInterstitialAd();
					}

					return reject({
						code: "LOAD_ADS_CLIENT_FAILURE",
						description: "Loading In-Game Ads Failed.",
						extra: {
							error: "No loaded ads with the given id found."
						}
					});
				});
			},

			/**
			 * An API that invokes to show a display ad over the game
			 **/
			showDisplayAdsAsync: function(displayAdPlacement) {
				return Promise.resolve("");
			},

			/**
			 * An API that invokes a sign in prompt flow on Microsoft Start Games.
			 * It will display a dialog modal and wait until the user either signs in or dismisses the dialog.
			 **/
			signInAsync: function() {
				return Promise.resolve(this.PlayerInfo);
			},

			/**
			 * An API that submits the user's game results.
			 */
			submitGameResultsAsync: function(primaryStatValue) {
				return Promise.resolve(true);
			},

			/**
			 * An API that invokes a switch game flow on Microsoft Start Games.
			 * The API never resolves because it immediately starts the new game that was passed as an argument.
			 * The game switched to can access the data from the previous game through the $msstart.switchGamePayload,
			 * which contains the payload that was sent when the API was invoked.
			 **/
			switchGameAsync: function(switchGameData) {
				return new Promise(resolve => {
					// never resolves...
				});
			}
		};

		resolve();
	});
};

const SDK_INTERFACE_INIT = function() {
	return new Promise(function(resolve, reject) {

		const onSDKLoaded = () => {
			let interval = setInterval(() => {
				if(typeof $msstart !== "undefined" && typeof migrateStorage !== "undefined") {
					clearInterval(interval);
					console.log('♥ ♥ ♥ MSSTART SDK READY ♥ ♥ ♥ (GAME %s)', SDK_INTERFACE_SETTINGS.version);
					if(!SDK_INTERFACE_HELPERS.$msstart.isInMicrosoftStart()) {
						console.warn("$msstart.isInMicrosoftStart(): %s", SDK_INTERFACE_HELPERS.$msstart.isInMicrosoftStart() ? "true" : "false");
					}
					migrateStorage().finally(resolve);
				}
			}, 250);
		};

		if(SDK_INTERFACE_SETTINGS.forceMockObject) {
			SDK_INTERFACE.loadFile("//cdn.jsdelivr.net/npm/sweetalert2@11").then(() => {
				onSDKLoaded();
			});
		} else {
			onSDKLoaded();
		}
	});
};

SDK_INTERFACE.init(SDK_INTERFACE_SETTINGS);