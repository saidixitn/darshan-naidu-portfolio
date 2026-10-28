export function init() {
  cleanup();
}
export function cleanup() {
  document.querySelectorAll(".card-specular-glare").forEach(el => el.remove());
  document.querySelectorAll(".grace-card, .grace-feature-card, .grace-stage-card, .grace-lookbook-hero").forEach(el => {
    el.style.transform = "none";
    el.style.transformStyle = "flat";
  });
}
export default { init, cleanup };
