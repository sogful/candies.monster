const src = "/assets/audio/room/ambience.mp3";
const fadein = 0.035;
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
        if (!buffer || !visible || context.state !== "running" || playing) return;

        const now = context.currentTime;

        const source = context.createBufferSource();
        const gain = context.createGain();
        source.buffer = buffer;
        source.loop = true;
        source.loopEnd = buffer.duration;
        source.connect(gain);
        gain.connect(context.destination);
        source.onended = () => {
            source.disconnect();
            gain.disconnect();
        };

        playing = source;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(1, now + fadein);
        source.start(now);
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
        } else if (playing) {
            playing.stop();
            playing = null;
        }
    }

    return {prepare, show};
}
