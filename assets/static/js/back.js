const button = document.querySelector(".pageback");
if (button) button.addEventListener("click", event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const audio = new Audio("/assets/audio/tap.mp3");
    void audio.play().catch(() => {});
    setTimeout(() => location.assign(button.href), 150);
});
