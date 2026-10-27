import wordSwap from "../animations/home/wordSwap.js";
import shared from "../animations/shared.js";
function init() {
  (wordSwap.init(), shared.init());
}
function cleanup() {
  (wordSwap.cleanup(), shared.cleanup());
}
export default { init, cleanup };
