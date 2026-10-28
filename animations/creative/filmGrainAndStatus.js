export function init() {
  cleanup();
}
export function cleanup() {
  const el = document.getElementById("editorial-film-grain");
  if (el) el.remove();
  const pill = document.getElementById("studio-radar-pill");
  if (pill) pill.remove();
  const anyPill = document.querySelectorAll(".studio-radar-pill, #studio-radar-pill, [data-studio-radar]");
  anyPill.forEach(p => p.remove());
}
export default { init, cleanup };
