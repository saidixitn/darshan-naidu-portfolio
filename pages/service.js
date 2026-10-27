import swiper from "../animations/general/swiper.js";
import faq from "../animations/service/faq.js";
import shared from "../animations/shared.js";
function init() {
  (swiper.init(), faq.init(), shared.init());
}
function cleanup() {
  (faq.cleanup(), shared.cleanup(), swiper.cleanup());
}
export default { init, cleanup };
