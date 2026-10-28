import footer from "./general/footer.js";
import projectTeaser from "./general/projectTeaser.js";
import swiper from "./general/swiper.js";
import scrollText from "./shared/scrollText.js";
import imageReveal from "./general/imageReveal.js";
import navScroll from "./shared/navScroll.js";
import magnetic from "./general/magnetic.js";
import clickPulse from "./general/clickPulse.js";

// Creative showcase animations (inspired by fourmula.ai, codetv-gsap, atmos.gallery, madewithgsap)
import velocitySkew from "./creative/velocitySkew.js";
import wordScrub from "./creative/wordScrub.js";
import ambientAurora from "./creative/ambientAurora.js";
import floatingTags from "./creative/floatingTags.js";
import cardEntrances from "./creative/cardEntrances.js";

function init() {
  navScroll.init();
  scrollText.init();
  swiper.init();
  imageReveal.init();
  footer.init();

  try {
    magnetic.init();
    clickPulse.init();

    // Creative GSAP additions
    ambientAurora.init();
    velocitySkew.init();
    wordScrub.init();
    floatingTags.init();
    cardEntrances.init();
  } catch (err) {
    console.warn("Creative animations init:", err);
  }
}

function cleanup() {
  navScroll.cleanup();
  scrollText.cleanup();
  swiper.cleanup();
  imageReveal.cleanup();
  footer.cleanup();

  try {
    magnetic.cleanup();
    clickPulse.cleanup();

    ambientAurora.cleanup();
    velocitySkew.cleanup();
    wordScrub.cleanup();
    floatingTags.cleanup();
    cardEntrances.cleanup();
  } catch (err) {
    console.warn("Creative animations cleanup:", err);
  }
}

export default { init, cleanup };
