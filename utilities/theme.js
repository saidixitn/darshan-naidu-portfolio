/**
 * Light / Dark Mode Controller with localStorage persistence
 * Uses event delegation to prevent duplicate listeners on Barba transitions.
 */
let hasBoundEvents = false;
const STORAGE_KEY = "darshan_portfolio_theme";

export function applyTheme(theme) {
  const html = document.documentElement;
  html.setAttribute("data-theme", theme);
  document.querySelectorAll(".theme_toggle_btn").forEach((btn) => {
    btn.setAttribute("data-current-theme", theme);
    const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    btn.setAttribute("title", label);
    btn.setAttribute("aria-label", label);
  });

  // Notify all kinetic wordmark iframes in footer immediately
  document.querySelectorAll(".footer-wordmark iframe, .footer-kinetic-iframe").forEach((frame) => {
    try {
      if (frame.contentWindow) {
        frame.contentWindow.postMessage({ type: "THEME_CHANGE", theme }, "*");
      }
    } catch (e) {}
  });
}

export function initThemeToggle() {
  const html = document.documentElement;

  // Determine initial theme: localStorage > system preference > default (light)
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  let currentTheme = savedTheme;
  if (!currentTheme) {
    currentTheme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  // Apply initial theme
  applyTheme(currentTheme);

  // Bind event listener only once using document-level delegation
  if (!hasBoundEvents) {
    hasBoundEvents = true;
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".theme_toggle_btn, #theme-toggle, .mobile-theme-toggle");
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        const activeTheme = html.getAttribute("data-theme") === "dark" ? "dark" : "light";
        const nextTheme = activeTheme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
        try {
          localStorage.setItem(STORAGE_KEY, nextTheme);
        } catch (err) {
          console.warn("Could not save theme to localStorage:", err);
        }
      }
    });
  }
}
