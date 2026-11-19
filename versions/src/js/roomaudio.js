const src = "/assets/audio/room/ambience.mp3";
const fadein = 0.035;
const fadeout = 1;

/*//////////////////////////////////////////////////////////////////////*/

function volume(ramp, now) {
    const progress = Math.max(0, Math.min(1, (now - ramp.start) / ramp.duration));
    return ramp.from + (ramp.to - ramp.from) * progress;
}

function fade(voice, now, from, to, duration) {
    const gain = voice.gain.gain;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(from, now);
    gain.linearRampToValueAtTime(to, now + duration);
    voice.ramp = {start: now, from, to, duration};
}

/*//////////////////////////////////////////////////////////////////////*/

export function startaudio() {
    let context;
    let loading;
    let playing;
    let visible = false;

    function listen(open) {
        const method = open ? "addEventListener" : "removeEventListener";
        document[method]("pointerdown", prepare, true);
        document[method]("keydown", prepare, true);
    }

    function load() {
        if (!loading) {
            loading = fetch(src).then(response => {
                if (!response.ok) throw new Error("Ambience unavailable");
                return response.arrayBuffer();
            }).then(bytes => context.decodeAudioData(bytes)).catch(() => {
                loading = null;
                return null;
            });
        }
        return loading;
    }

    async function play() {
        if (!visible || context.state !== "running") return;
        listen(false);
        const buffer = await load();
        if (!buffer || !visible || context.state !== "running" || (playing && !playing.end)) return;

        const now = context.currentTime;
        const previous = playing;
        const continuing = previous && now < previous.end;
        const offset = continuing ? (previous.offset + now - previous.start) % buffer.duration : 0;
        const level = continuing ? volume(previous.ramp, now) : 0;

        const source = context.createBufferSource();
        const gain = context.createGain();
        const voice = {source, gain, start: now, offset, end: 0};
        source.buffer = buffer;
        source.loop = true;
        source.loopEnd = buffer.duration;
        source.connect(gain);
        gain.connect(context.destination);
        source.onended = () => {
            source.disconnect();
            gain.disconnect();
            if (playing === voice) playing = null;
        };

        playing = voice;
        fade(voice, now, level, 1, fadein);
        if (continuing) previous.source.stop(now);
        source.start(now, offset);
    }

    function prepare() {
        const audio = window.AudioContext || window.webkitAudioContext;
        if (!audio) return;
        try {
            context ||= new audio();
            if (context.state === "running") void play();
            else void context.resume().then(play).catch(() => {});
        } catch {}
    }

    function show(open) {
        if (visible === open) return;
        visible = open;
        listen(open);
        if (open) {
            if (context || navigator.userActivation?.hasBeenActive) prepare();
        } else if (playing && !playing.end) {
            const now = context.currentTime;
            fade(playing, now, volume(playing.ramp, now), 0, fadeout);
            playing.end = now + fadeout;
            playing.source.stop(playing.end);
        }
    }

    return {prepare, show};
}
