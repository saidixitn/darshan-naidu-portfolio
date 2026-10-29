import shared from "../animations/shared.js";

function ensureVideoPlays() {
  const videos = document.querySelectorAll("video[autoplay]");
  videos.forEach((video) => {
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const playOnInteraction = () => {
          video.play().catch(() => {});
          window.removeEventListener("scroll", playOnInteraction);
          window.removeEventListener("click", playOnInteraction);
          window.removeEventListener("touchstart", playOnInteraction);
        };
        window.addEventListener("scroll", playOnInteraction, { once: true, passive: true });
        window.addEventListener("click", playOnInteraction, { once: true });
        window.addEventListener("touchstart", playOnInteraction, { once: true, passive: true });
      });
    }
  });
}

function init() {
  shared.init();
  ensureVideoPlays();
}

function cleanup() {
  shared.cleanup();
}

export default { init, cleanup };
