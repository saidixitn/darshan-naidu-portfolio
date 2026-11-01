/**
 * Interactive Canvas Halo (Removed per user request)
 */
export function init() {
  if (typeof document === "undefined") return;
  document.querySelectorAll(".canvas-interactive-halo").forEach((el) => el.remove());
}

export function cleanup() {
  if (typeof document === "undefined") return;
  document.querySelectorAll(".canvas-interactive-halo").forEach((el) => el.remove());
}

export default { init, cleanup };
