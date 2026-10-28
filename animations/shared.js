import footer from "./general/footer.js";
import projectTeaser from "./general/projectTeaser.js";
import swiper from "./general/swiper.js";
import scrollText from "./shared/scrollText.js";
import imageReveal from "./general/imageReveal.js";
import navScroll from "./shared/navScroll.js";
import magnetic from "./general/magnetic.js";

// Creative showcase animations (inspired by fourmula.ai, codetv-gsap, atmos.gallery, madewithgsap, brandonyasin)
import velocitySkew from "./creative/velocitySkew.js";
import wordScrub from "./creative/wordScrub.js";
import ambientAurora from "./creative/ambientAurora.js";
import floatingTags from "./creative/floatingTags.js";
import cardEntrances from "./creative/cardEntrances.js";
import imageScrollEffects from "./creative/imageScrollEffects.js";
import creativeTextEffects from "./creative/creativeTextEffects.js";
import studioClock from "./creative/studioClock.js";
import velocityMarquee from "./creative/velocityMarquee.js";

function init() {
  navScroll.init();
  scrollText.init();
  swiper.init();
  imageReveal.init();
  footer.init();

  try {
    magnetic.init();

    // Creative GSAP additions
    ambientAurora.init();
    velocitySkew.init();
    wordScrub.init();
    floatingTags.init();
    cardEntrances.init();
    imageScrollEffects.init();
    creativeTextEffects.init();
    studioClock.init();
    velocityMarquee.init();
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

    ambientAurora.cleanup();
    velocitySkew.cleanup();
    wordScrub.cleanup();
    floatingTags.cleanup();
    cardEntrances.cleanup();
    imageScrollEffects.cleanup();
    creativeTextEffects.cleanup();
    studioClock.cleanup();
    velocityMarquee.cleanup();
  } catch (err) {
    console.warn("Creative animations cleanup:", err);
  }
}

export default { init, cleanup };
