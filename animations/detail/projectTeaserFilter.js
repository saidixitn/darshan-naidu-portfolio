let ctx;
function init() {
  const t = document.querySelector('[data-project-teaser="list"]');
  if (!t) return;
  const e = Array.from(t.querySelectorAll(".project_teaser_item_wrap")),
    r = document.querySelector('[data-enter-page="title"]'),
    o = r ? r.textContent?.trim() : null,
    c = o
      ? e.filter((t) => {
          const e = t.querySelector('[data-project-teaser="project-title"]');
          return e?.textContent?.trim() !== o;
        })
      : e;
  for (let t = c.length - 1; t > 0; t--) {
    const e = Math.floor(Math.random() * (t + 1));
    [c[t], c[e]] = [c[e], c[t]];
  }
  e.forEach((t) => {
    t.style.display = "none";
  });
  c.slice(0, 3).forEach((t) => {
    t.style.display = "block";
  });
}
function cleanup() {
  const t = document.querySelector('[data-project-teaser="list"]');
  if (!t) return;
  (t.querySelectorAll(".project_teaser_item_wrap").forEach((t) => {
    t.style.display = "";
  }),
    ctx && ctx.revert());
}
export default { init, cleanup };
