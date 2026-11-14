// click sfx
document.querySelectorAll(".clickable").forEach(function(element) {
    element.addEventListener("click", function() {
        document.querySelector(".click").currentTime = 0;
        document.querySelector(".click").play();
    });
});

/*//////////////////////////////////////////////////////////////////////*/

// oddly coolsite.cv/utdr/swatchlings-shaped visualizer 
(function setupSongVisualizer() {
    try {
        if (!window.__visCtx) {
            window.__visCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    } catch (e) {
        window.__visCtx = null;
    }
    if (!window.__visCtx) {return}
    window.__visAnalyser = window.__visCtx.createAnalyser();
    window.__visAnalyser.fftSize = 64;
    window.__visAnalyser.smoothingTimeConstant = 0.8;

    const container = document.querySelector(".visualizer")
    if (container && !container.dataset.ready) {
        for (let i = 0; i < 20; i++) {
            const bar = document.createElement("div");
            bar.className = "bar";
            bar.id = `bar-${i}`;
            container.appendChild(bar);
        }
        container.dataset.ready = "1";
    }

    const dataArray = new Uint8Array(window.__visAnalyser.frequencyBinCount);
    function animate() {
        if (!window.__visAnalyser) {requestAnimationFrame(animate); return}
        window.__visAnalyser.getByteFrequencyData(dataArray);
        const maxHeight = Math.max(40, (container && container.clientHeight) ? container.clientHeight : 100);
        for (let i = 0; i < 20; i++) {
            const value = dataArray[Math.floor(i * dataArray.length / 20)] || 0;
            const height = Math.max(4, (value / 255) * maxHeight);
            const el = document.getElementById(`bar-${i}`);
            if (el) {el.style.height = height + "px"}
        }
        requestAnimationFrame(animate);
    }; animate();

    document.addEventListener("click", function() {
        if (window.__visCtx && window.__visCtx.state === "suspended") {
            window.__visCtx.resume();
        }
    }, { once: false });
})();

function bindvisualizer(audioElement) {
    if (!window.__visCtx || !window.__visAnalyser || !audioElement) {return}
    try {if (window.__visSource) {window.__visSource.disconnect()}} catch (e) {}
    try {
        window.__visSource = window.__visCtx.createMediaElementSource(audioElement);
        window.__visSource.connect(window.__visAnalyser);
        window.__visAnalyser.connect(window.__visCtx.destination);
    } catch (e) {}
}

/*//////////////////////////////////////////////////////////////////////*/

// you are the most vibecoded page EVER!
class musicplayer {
    constructor(songs) {
        this.audio = document.querySelector(".audioplayer");
        this.nextAudio = document.createElement("audio");
        this.nextAudio.preload = "auto";
        bindvisualizer(this.audio);

        this.playbackFormatPriority = ["opus", "ogg", "mp3"];
        this._onPlaybackError = null;
        this.songs = songs || [];

        this.initaudiopaths();
        this.currentsongindex = 0; this.currentcategoryindex = 0;
        this.currentsubcategoryindex = null;
        this.isplaying = false; this.isloopall = true;
        this.isloopone = false; this.isshuffled = false;
         this.shuffledorder = []; this.looptreshold = 0.05; 
         this.triggeredloop = false;
        this.initializepayer(); this.rendersonglist();
        this.setupeventlisteners();
    }
    initaudiopaths() {
        this.songs.forEach(category => {
            const applyToTrack = (track) => {
                if (!track || !track.path) {return}
                const parts = track.path.split(".");
                if (parts.length > 1) {
                    track.defaultExt = parts.pop();
                    track.basePath = parts.join(".");
                } else {
                    track.defaultExt = "";
                    track.basePath = track.path;
                }
            };
            if (category.subcategories) {
                category.subcategories.forEach(sub => {
                    sub.tracks.forEach(applyToTrack);
                });
            }
            if (category.tracks) {
                category.tracks.forEach(applyToTrack);
            }
        });
    }
    getdisplayname(track) {
        const filename = track.path || "";
        if (!filename) {return "???"}
        const basename = filename.split("/").pop(); 
        return basename.replace(/\.[^/.]+$/, "");
    }

    createtrackelement(track, trackindex, categoryindex, subcategoryindex = null) {
        const trackelement = document.createElement("div");
        trackelement.className = "songitem";
        trackelement.dataset.categoryindex = categoryindex;
        if (subcategoryindex !== null) trackelement.dataset.subcategoryindex = subcategoryindex;
        trackelement.dataset.trackindex = trackindex;

        const tracknamecontainer = document.createElement("div");
        tracknamecontainer.className = "songnamecontainer";

        const trackname = document.createElement("div");
        trackname.className = "songname clickable";
        trackname.textContent = `${trackindex + 1}. ${this.getdisplayname(track)}`;

        const downloadbuttons = document.createElement("div");
        downloadbuttons.className = "downloadbuttons";

        (track.formats || []).forEach(format => {
            if (format === "opus") {return}
            const downloadbutton = document.createElement("button");
            downloadbutton.className = "downloadbutton clickable";
            downloadbutton.dataset.format = format;
            const displayformat = format === "dspadpcm.bcstm" ? "bcstm" : format;
            downloadbutton.innerHTML = `<div class="extensionlabel">.${displayformat}</div><img src="/assets/images/music/icons/download.png">`;
            downloadbuttons.appendChild(downloadbutton);
        });

        tracknamecontainer.appendChild(trackname);
        tracknamecontainer.appendChild(downloadbuttons);
        trackelement.appendChild(tracknamecontainer);

        return trackelement;
    }
    initializepayer() {this.updatebackground("menu.webp")}

    rendersonglist() {
        const songlist = document.querySelector(".songlist");
        songlist.innerHTML = "";

        this.songs.forEach((category, categoryindex) => {
            const block = document.createElement("div");
            block.className = "songblock";
            const header = document.createElement("div");
            header.className = "songblockheader";
            const icon = document.createElement("div");
            icon.className = "songblockicon";
            const iconpath = category.icon.startsWith("/") ? category.icon : `/assets/images/icons/games/${category.icon}/64.webp`;
            icon.style.backgroundImage = `url(${iconpath})`;
            icon.style.backgroundSize = "cover";

            const title = document.createElement("div");
            title.className = "songblocktitle";
            title.textContent = category.category;

            header.appendChild(icon);
            header.appendChild(title);

            const trackscontainer = document.createElement("div");

            if (category.subcategories) {
                category.subcategories.forEach((subcategory, subcategoryindex) => {
                    const subcategoryelement = document.createElement("div");
                    subcategoryelement.className = "subcategory";

                    const subcategoryheader = document.createElement("div");
                    subcategoryheader.className = "subcategoryheader";

                    const subcategorytitle = document.createElement("div");
                    subcategorytitle.className = "subcategorytitle";
                    subcategorytitle.textContent = subcategory.name;

                    subcategoryheader.appendChild(subcategorytitle);

                    subcategoryelement.appendChild(subcategoryheader);

                    subcategory.tracks.forEach((track, trackindex) => {
                        subcategoryelement.appendChild(this.createtrackelement(track, trackindex, categoryindex, subcategoryindex));
                    });

                    trackscontainer.appendChild(subcategoryelement);
                });
            } else {
                category.tracks.forEach((track, trackindex) => {
                    trackscontainer.appendChild(this.createtrackelement(track, trackindex, categoryindex));
                });
            }

            block.appendChild(header);
            block.appendChild(trackscontainer);
            songlist.appendChild(block);
        });
    }

    setupeventlisteners() {
        document.addEventListener("click", (e) => {
            const songitem = e.target.closest(".songitem");
            if (songitem) {
                const songname = e.target.closest(".songname");
                if (songname) {
                    const categoryindex = parseInt(songitem.dataset.categoryindex);
                    const subcategoryindex = songitem.dataset.subcategoryindex ? parseInt(songitem.dataset.subcategoryindex) : null;
                    const trackindex = parseInt(songitem.dataset.trackindex);
                    this.playsong(categoryindex, trackindex, subcategoryindex);
                }
            }

            const downloadbutton = e.target.closest(".downloadbutton");
            if (downloadbutton) {
                const songitem = downloadbutton.closest(".songitem");
                const categoryindex = parseInt(songitem.dataset.categoryindex);
                const subcategoryindex = songitem.dataset.subcategoryindex ? parseInt(songitem.dataset.subcategoryindex) : null;
                const trackindex = parseInt(songitem.dataset.trackindex);

                let song;
                if (subcategoryindex !== null) {
                    song = this.songs[categoryindex].subcategories[subcategoryindex].tracks[trackindex];
                } else {
                    song = this.songs[categoryindex].tracks[trackindex];
                }

                const format = downloadbutton.dataset.format;
                this.downloadsong(song, format);
            }
        });

        // the slop onclick events
        document.querySelector(".playpausebutton").addEventListener("click", () => {
            this.toggleplaypause();
        });

        document.querySelector(".prevbutton").addEventListener("click", () => {
            this.previoussong();
        });

        document.querySelector(".nextbutton").addEventListener("click", () => {
            this.nextsong();
        });

        document.querySelector(".loopallbutton").addEventListener("click", () => {
            if (!this.isloopall && !this.isloopone) {this.setloopmode("all")}
            else if (this.isloopall) {this.setloopmode("one")}
            else {this.setloopmode("none")}
        });

        document.querySelector(".shufflebutton").addEventListener("click", () => {
            this.toggleshuffle();
        });

        // what makes the realtime dragging work
        const progressbar = document.querySelector(".progressbar");
        let isdragging = false;
        let lastupdatetime = 0;
        progressbar.addEventListener("mousedown", (e) => {
            isdragging = true;
            this.seekto(e);
        });
        progressbar.addEventListener("mousemove", (e) => {
            if (isdragging) {
                const now = Date.now();
                if (now - lastupdatetime > 16) {
                    this.seekto(e);
                    lastupdatetime = now;
                }
            }
        });
        document.addEventListener("mouseup", () => {isdragging = false});
        progressbar.addEventListener("click", (e) => {
            if (!isdragging) {this.seekto(e)}
        });

        document.querySelector(".fullscreenbutton").addEventListener("click", () => {
            this.togglefullscreen();
        });

        this.audio.addEventListener("timeupdate", () => this.updateprogress());
        this.audio.addEventListener("ended", () => this.onsongend());
        this.audio.addEventListener("loadedmetadata", () => this.updatetimedisplay());
    }

    getplaybacksources(track) {
        if (!track) {return []}
        const base = track.basePath || (track.path ? track.path.replace(/\.[^/.]+$/, "") : "");
        if (!base) {return []}
        const candidates = [];
        this.playbackFormatPriority.forEach(ext => {
            if (ext && !candidates.includes(ext)) {candidates.push(ext)}
        });
        if (track.defaultExt && !candidates.includes(track.defaultExt)) {
            candidates.push(track.defaultExt);
        }
        return candidates.map(ext => `${base}.${ext}`);
    }

    setaudiosourcewithfallback(track) {
        const sources = this.getplaybacksources(track);
        if (!sources.length) {return}

        let index = 0;
        const tryplay = () => {
            if (index >= sources.length) {return}
            const filename = sources[index];
            const audiopath = filename.startsWith("/") ? filename : `/assets/audio/music/${filename}`;
            this.triggeredloop = false;
            this.audio.src = audiopath;
            this.audio.load();
            this.audio.play().then(() => {
                this.isplaying = true;
                this.updateplaybutton();
            }).catch(e => {});
        };

        if (this._onPlaybackError) {
            this.audio.removeEventListener("error", this._onPlaybackError);
        }
        this._onPlaybackError = () => {
            index++; tryplay();
        };
        this.audio.addEventListener("error", this._onPlaybackError);

        tryplay();
    }

    playsong(categoryindex, trackindex, subcategoryindex = null) {
        this.currentcategoryindex = categoryindex;
        this.currentsongindex = trackindex;
        this.currentsubcategoryindex = subcategoryindex;

        let song;
        if (subcategoryindex !== null) {
            song = this.songs[categoryindex].subcategories[subcategoryindex].tracks[trackindex];
        } else {
            song = this.songs[categoryindex].tracks[trackindex];
        }

        this.preloadtracks();

        document.querySelectorAll(".songitem").forEach(item => {
            item.classList.remove("active");
        });

        const activeitem = document.querySelector(`[data-category-index="${categoryindex}"][data-track-index="${trackindex}"]`);
        if (activeitem) {activeitem.classList.add("active")}

        this.updatebackground(song.background);
        this.setaudiosourcewithfallback(song);
    }

    toggleplaypause() {
        if (this.isplaying) {
            this.audio.pause();
            this.isplaying = false;
            this.updateplaybutton();
        } else {
            this.audio.play().then(() => {
                this.isplaying = true;
                this.updateplaybutton();
            }).catch(e => {console.error("error playing audio?!", e)});
        }
    }

    previoussong() {
        let newcategoryindex = this.currentcategoryindex;
        let newsubcategoryindex = this.currentsubcategoryindex;
        let newsongindex = this.currentsongindex - 1;

        if (newsongindex < 0) {
            if (newsubcategoryindex !== null && newsubcategoryindex > 0) {
                newsubcategoryindex--;
                newsongindex = this.songs[newcategoryindex].subcategories[newsubcategoryindex].tracks.length - 1;
            } else if (newsubcategoryindex !== null && newsubcategoryindex === 0) {
                newcategoryindex = (newcategoryindex - 1 + this.songs.length) % this.songs.length;
                if (this.songs[newcategoryindex].subcategories) {
                    newsubcategoryindex = this.songs[newcategoryindex].subcategories.length - 1;
                    newsongindex = this.songs[newcategoryindex].subcategories[newsubcategoryindex].tracks.length - 1;
                } else {
                    newsubcategoryindex = null;
                    newsongindex = this.songs[newcategoryindex].tracks.length - 1;
                }
            } else {
                newcategoryindex = (newcategoryindex - 1 + this.songs.length) % this.songs.length;
                if (this.songs[newcategoryindex].subcategories) {
                    newsubcategoryindex = this.songs[newcategoryindex].subcategories.length - 1;
                    newsongindex = this.songs[newcategoryindex].subcategories[newsubcategoryindex].tracks.length - 1;
                } else {
                    newsubcategoryindex = null;
                    newsongindex = this.songs[newcategoryindex].tracks.length - 1;
                }
            }
        }

        this.playsong(newcategoryindex, newsongindex, newsubcategoryindex);
    }

    nextsong() {
        let newcategoryindex = this.currentcategoryindex;
        let newsubcategoryindex = this.currentsubcategoryindex;
        let newsongindex = this.currentsongindex + 1;

        let currentracklength;
        if (newsubcategoryindex !== null) {
            currentracklength = this.songs[newcategoryindex].subcategories[newsubcategoryindex].tracks.length;
        } else {
            currentracklength = this.songs[newcategoryindex].tracks.length;
        }

        if (newsongindex >= currentracklength) {
            if (newsubcategoryindex !== null && newsubcategoryindex < this.songs[newcategoryindex].subcategories.length - 1) {
                newsubcategoryindex++;
                newsongindex = 0;
            } else if (newsubcategoryindex !== null && newsubcategoryindex === this.songs[newcategoryindex].subcategories.length - 1) {
                newcategoryindex = (newcategoryindex + 1) % this.songs.length;
                if (this.songs[newcategoryindex].subcategories) {
                    newsubcategoryindex = 0;
                    newsongindex = 0;
                } else {
                    newsubcategoryindex = null;
                    newsongindex = 0;
                }
            } else {
                newcategoryindex = (newcategoryindex + 1) % this.songs.length;
                if (this.songs[newcategoryindex].subcategories) {
                    newsubcategoryindex = 0;
                    newsongindex = 0;
                } else {
                    newsubcategoryindex = null;
                    newsongindex = 0;
                }
            }
        }
        if (this.nextAudio.src && this.nextAudio.readyState >= 2) {
            this.swapaudioelements();
        }; this.playsong(newcategoryindex, newsongindex, newsubcategoryindex);
    }
    swapaudioelements() {
        const tempaudio = this.audio;
        this.audio = this.nextAudio;
        this.nextAudio = tempaudio;
        document.querySelector(".audioplayer").remove();
        document.body.appendChild(this.audio);
        this.audio.className = "audioplayer";
        this.audio.addEventListener("timeupdate", () => this.updateprogress());
        this.audio.addEventListener("ended", () => this.onsongend());
        this.audio.addEventListener("loadedmetadata", () => this.updatetimedisplay());
        bindvisualizer(this.audio);

        this.audio.play().then(() => {
            this.isplaying = true;
            this.updateplaybutton();
        }).catch(e => {
            console.error("error playing audio??", e);
        });
    }

    setloopmode(mode) {
        this.isloopall = mode === "all";
        this.isloopone = mode === "one";

        const loopbutton = document.querySelector(".loopallbutton");
        if (this.isloopall) {
            loopbutton.classList.add("active");
            loopbutton.querySelector("img").src = "/assets/images/music/icons/loop.png";
        } else if (this.isloopone) {
            loopbutton.classList.add("active");
            loopbutton.querySelector("img").src = "/assets/images/music/icons/loopone.png";
        } else {
            loopbutton.classList.remove("active");
            loopbutton.querySelector("img").src = "/assets/images/music/icons/loop.png";
        }
    }

    toggleshuffle() {
        this.isshuffled = !this.isshuffled;
        document.querySelector(".shufflebutton").classList.toggle("active", this.isshuffled);

        if (this.isshuffled) {
            this.generateshuffledorder();
        }
    }

    generateshuffledorder() {
        this.shuffledorder = [];
        this.songs.forEach((category, categoryindex) => {
            if (category.subcategories) {
                category.subcategories.forEach((subcategory, subcategoryindex) => {
                    subcategory.tracks.forEach((track, trackindex) => {
                        this.shuffledorder.push({ categoryindex, subcategoryindex, trackindex });
                    });
                });
            } else {
                category.tracks.forEach((track, trackindex) => {
                    this.shuffledorder.push({ categoryindex, subcategoryindex: null, trackindex });
                });
            }
        });

        for (let i = this.shuffledorder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.shuffledorder[i], this.shuffledorder[j]] = [this.shuffledorder[j], this.shuffledorder[i]];
        }
    }

    preloadtracks() {
        let nextcategoryindex = this.currentcategoryindex;
        let nextsubcategoryindex= this.currentsubcategoryindex;
        let nextsongindex = this.currentsongindex + 1;

         let currentracklength;
         if (nextsubcategoryindex !== null) {
             currentracklength = this.songs[nextcategoryindex].subcategories[nextsubcategoryindex].tracks.length;
         } else {
             currentracklength = this.songs[nextcategoryindex].tracks.length;
         }

         if (nextsongindex >= currentracklength) {
             if (nextsubcategoryindex !== null && nextsubcategoryindex < this.songs[nextcategoryindex].subcategories.length - 1) {
                 nextsubcategoryindex++;
                 nextsongindex = 0;
             } else if (nextsubcategoryindex !== null && nextsubcategoryindex === this.songs[nextcategoryindex].subcategories.length - 1) {
                 nextcategoryindex = (nextcategoryindex + 1) % this.songs.length;
                 if (this.songs[nextcategoryindex].subcategories) {
                     nextsubcategoryindex = 0;
                     nextsongindex = 0;
                 } else {
                     nextsubcategoryindex = null;
                     nextsongindex = 0;
                 }
             } else {
                 nextcategoryindex = (nextcategoryindex + 1) % this.songs.length;
                 if (this.songs[nextcategoryindex].subcategories) {
                     nextsubcategoryindex = 0;
                     nextsongindex = 0;
                 } else {
                     nextsubcategoryindex = null;
                     nextsongindex = 0;
                 }
             }
        }
        let nextsong;
        if (nextsubcategoryindex !== null) {
            nextsong = this.songs[nextcategoryindex].subcategories[nextsubcategoryindex].tracks[nextsongindex];
        } else {
            nextsong = this.songs[nextcategoryindex].tracks[nextsongindex];
        }
        if (nextsong && nextsong.path) {
            const nextAudioPath = nextsong.path.startsWith("/") ? nextsong.path : `/assets/audio/music/${nextsong.path}`;
            this.nextAudio.src = nextAudioPath;
        }
    }

     coolloop() {
         if (this.isloopone) {
             this.audio.currentTime = 0;
             this.triggeredloop = false;
             if (this.isplaying) {
                 this.audio.play().catch(e => console.error("loop error:", e));
             }
         } else if (this.isloopall || this.isshuffled) {
            if (this.isshuffled) {
                const currentIndex = this.shuffledorder.findIndex(item => 
                    item.categoryindex === this.currentcategoryindex && 
                    item.subcategoryindex === this.currentsubcategoryindex && 
                    item.trackindex === this.currentsongindex
                );

                if (currentIndex !== -1) {
                    const nextIndex = (currentIndex + 1) % this.shuffledorder.length;
                    const nextsong = this.shuffledorder[nextIndex];
                    this.playsong(nextsong.categoryindex, nextsong.trackindex, nextsong.subcategoryindex);
                } else {
                    this.nextsong();
                }
            } else {
                this.nextsong();
            }
        }
    }; onsongend() {this.coolloop()}

    updateplaybutton() {
        const playpausebutton = document.querySelector(".playpausebutton");
        const img = playpausebutton.querySelector("img");
        img.src = this.isplaying ? "/assets/images/music/icons/pause.png" : "/assets/images/music/icons/play.png";
    }

    updateprogress() {
        if (this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            const progressfillcontainer = document.querySelector(".progressfillcontainer");
            const progressfill = document.querySelector(".progressfill");
            progressfillcontainer.style.width = `${progress}%`;
            progressfill.style.setProperty("--progress", progress / 100);

             if (this.audio.currentTime >= this.audio.duration - this.looptreshold && !this.triggeredloop) {
                 console.log("Triggering seamless loop at", this.audio.currentTime, "duration:", this.audio.duration, "mode:", this.isloopone ? "single" : "playlist");
                 this.triggeredloop = true; this.coolloop();
             }
        }
        this.updatetimedisplay();
    }

    updatetimedisplay() {
        const current = this.formattime(this.audio.currentTime || 0);
        const duration = this.formattime(this.audio.duration || 0);
        document.querySelector(".timedisplay").textContent = `${current}/${duration}`;
    }

    formattime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    seekto(e) {
        if (this.audio.duration) {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickx = e.clientX - rect.left;
            const percentage = clickx / rect.width;
            this.audio.currentTime = percentage * this.audio.duration;
        }
    }

    updatebackground(imageurl) {
        const stupidbg = document.querySelector(".stupidbg");
        if (imageurl) {
            const bgpath = imageurl.startsWith("/") ? imageurl : `/assets/images/music/bgs/${imageurl}`;
            const currentbg = stupidbg.style.backgroundImage;
            if (currentbg === `url("${bgpath}")` || currentbg === `url(${bgpath})`) {return}

            const newbg = document.createElement("div");
            newbg.className = "stupidbg";
            newbg.style.backgroundImage = `url(${bgpath})`;
            newbg.style.opacity = "0";
            newbg.style.transition = "opacity 1s ease-in-out";
            document.body.insertBefore(newbg, stupidbg);

            setTimeout(() => {
                newbg.style.opacity = "1";
                stupidbg.style.opacity = "0";
            }, 50);
            setTimeout(() => {
                if (stupidbg.parentNode) {
                    stupidbg.parentNode.removeChild(stupidbg);
                }
            }, 1100);
        } else {
            if (stupidbg.style.backgroundImage === "none") {return}

            stupidbg.style.opacity = "0";
            setTimeout(() => {
                stupidbg.style.backgroundImage = "none";
                stupidbg.style.opacity = "1";
            }, 500);
        }
    }

    togglefullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    downloadsong(song, format) {
        const filename = song.path;
        if (!filename) {return}

        const audiopath = filename.startsWith("/") ? filename : `/assets/audio/music/${filename}`;
        const downloadurl = audiopath.replace(/\.\w+$/, `.${format}`);

        const link = document.createElement("a");
        link.href = downloadurl;
        link.download = `${this.getdisplayname(song)}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

}

window.addEventListener("DOMContentLoaded", function() {
    fetch("/assets/static/data/music/tracks.json")
        .then(function(response) {return response.json()})
        .then(function(data) {
            window.musicplayer = new musicplayer(data);
        })
        .catch(function(err) {
            console.error("failed to load music.json?!", err);
            window.musicplayer = new musicplayer([]);
        });
});
