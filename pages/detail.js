import projectTeaserFilter from "../animations/detail/projectTeaserFilter.js";
import shared from "../animations/shared.js";
function init() {
  (projectTeaserFilter.init(), shared.init());
}
function cleanup() {
  (projectTeaserFilter.cleanup(), shared.cleanup());
}
export default { init, cleanup };
