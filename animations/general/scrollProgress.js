import { gsap, ScrollTrigger } from "../../vendor.js";

let triggerInstance = null;
let progressBar = null;

export function init() {
  if (typeof document === "undefined") return;

  // Ensure element exists
  progressBar = document.querySelector(".site-scroll-progress");
  if (!progressBar) {
    progressBar = document.createElement("div");
    progressBar.className = "site-scroll-progress";
    progressBar.setAttribute("aria-hidden", "true");
    document.body.appendChild(progressBar);
  }

  // Cleanup old trigger if any
  if (triggerInstance) {
    triggerInstance.kill();
    triggerInstance = null;
  }

  gsap.set(progressBar, { scaleX: 0, transformOrigin: "left center" });

  triggerInstance = ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.15,
    onUpdate: (self) => {
      gsap.to(progressBar, {
        scaleX: self.progress,
        duration: 0.1,
        ease: "none",
        overwrite: "auto",
      });
    },
  });
}

export function cleanup() {
  if (triggerInstance) {
    triggerInstance.kill();
    triggerInstance = null;
  }
  if (progressBar) {
    gsap.set(progressBar, { scaleX: 0 });
  }
}

export default { init, cleanup };
