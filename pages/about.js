import shared from "../animations/shared.js";
import graceAbout from "../animations/creative/graceAbout.js";

function init() {
  shared.init();
  try {
    graceAbout.init();
  } catch (err) {
    console.warn("graceAbout init error:", err);
  }
}

function cleanup() {
  shared.cleanup();
  try {
    graceAbout.cleanup();
  } catch (err) {}
}

export default { init, cleanup };
