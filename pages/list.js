import shared from "../animations/shared.js";
import filters from "../utilities/filters.js";
function init() {
  (filters.init(), shared.init());
}
function cleanup() {
  (shared.cleanup(), filters.cleanup());
}
export default { init, cleanup };
