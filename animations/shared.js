import footer from "./general/footer.js";
import projectTeaser from "./general/projectTeaser.js";
import swiper from "./general/swiper.js";
import scrollText from "./shared/scrollText.js";
import imageReveal from "./general/imageReveal.js";
import navScroll from "./shared/navScroll.js";
function init() {
  (navScroll.init(),
    scrollText.init(),
    swiper.init(),
    imageReveal.init(),
    footer.init());
}
function cleanup() {
  (navScroll.cleanup(),
    scrollText.cleanup(),
    swiper.cleanup(),
    imageReveal.cleanup(),
    footer.cleanup());
}
export default { init, cleanup };
