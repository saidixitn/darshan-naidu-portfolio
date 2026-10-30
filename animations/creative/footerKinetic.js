/**
 * Footer Kinetic Wordmark: 1:1 Embedding of /darshan
 * Ensures 100% parity with https://darshannaidu.vercel.app/darshan
 */

export function createWordmarkMarkup() {
  return `<iframe src="/darshan/" class="footer-kinetic-iframe" title="Darshan Naidu" scrolling="no" loading="lazy"></iframe>`;
}

export function initFooterKinetic() {
  const wordmarks = document.querySelectorAll(".footer-wordmark");
  if (!wordmarks.length) return;

  wordmarks.forEach((el) => {
    if (!el.querySelector("iframe")) {
      el.innerHTML = createWordmarkMarkup();
    }
  });
}

export function cleanup() {
  // iframes clean up cleanly with DOM lifecycle
}

export default {
  init: initFooterKinetic,
  cleanup,
};
