import contactForm from "../animations/contact/contactForm.js";
import shared from "../animations/shared.js";
function init() {
  (contactForm.init(), shared.init());
}
function cleanup() {
  (contactForm.cleanup(), shared.cleanup());
}
export default { init, cleanup };
