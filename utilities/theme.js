/**
 * Light / Dark Mode Controller with localStorage persistence
 */
export function initThemeToggle() {
  const STORAGE_KEY = "darshan_portfolio_theme";
  const html = document.documentElement;

  // Determine initial theme: localStorage > system preference > default (light)
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  let currentTheme = savedTheme;
  if (!currentTheme) {
    currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  // Apply initial theme
  applyTheme(currentTheme);

  // Setup toggle button click handlers
  const toggleButtons = document.querySelectorAll(".theme_toggle_btn");
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const nextTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      localStorage.setItem(STORAGE_KEY, nextTheme);
    });
  });

  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    document.querySelectorAll(".theme_toggle_btn").forEach((btn) => {
      btn.setAttribute("data-current-theme", theme);
      const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
      btn.setAttribute("title", label);
      btn.setAttribute("aria-label", label);
    });
  }
}
