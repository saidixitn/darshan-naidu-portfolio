/**
 * Footer Kinetic Wordmark: 1:1 Embedding of /darshan
 * Ensures 100% parity with https://darshannaidu.vercel.app/darshan
 */

export function createWordmarkMarkup() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
  return `<iframe src="/darshan/?theme=${currentTheme}" class="footer-kinetic-iframe" title="Darshan Naidu" scrolling="no" loading="lazy"></iframe>`;
}

export function initFooterKinetic() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
  const wordmarks = document.querySelectorAll(".footer-wordmark");
  if (!wordmarks.length) return;

  wordmarks.forEach((el) => {
    let iframe = el.querySelector("iframe");
    if (!iframe) {
      el.innerHTML = createWordmarkMarkup();
      iframe = el.querySelector("iframe");
    }
    if (iframe) {
      const send = () => {
        try {
          if (iframe.contentWindow) {
            iframe.contentWindow.postMessage({ type: "THEME_CHANGE", theme: currentTheme }, "*");
          }
        } catch (e) {}
      };
      iframe.addEventListener("load", send, { once: true });
      send();
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
