import { SplitType } from "../vendor.js";
let SplitTypes = [];
function init(e) {
  const t = e.querySelectorAll("[data-split-type]");
  t &&
    t.length > 0 &&
    t.forEach((e) => {
      const t = e.dataset.splitType || "lines";
      SplitTypes.push(new SplitType(e, { types: t }));
    });
}
function cleanup() {
  SplitTypes.forEach((e) => {
    e.revert(e.elements);
  });
}
export default { init, cleanup };
