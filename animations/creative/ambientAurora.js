import { gsap } from "../../vendor.js";

let auroraContainer = null;
let anim1 = null;
let anim2 = null;
let mouseHandler = null;

export function init() {
  if (typeof document === "undefined") return;

  // Ensure cinema film grain exists (Atmos Gallery / Grace Fashion aesthetic)
  let grainContainer = document.querySelector(".cinema-grain-layer");
  if (!grainContainer) {
    grainContainer = document.createElement("div");
    grainContainer.className = "cinema-grain-layer";
    grainContainer.setAttribute("aria-hidden", "true");
    document.body.prepend(grainContainer);
  }

  // Ensure element exists
  auroraContainer = document.querySelector(".ambient-aurora-layer");
  if (!auroraContainer) {
    auroraContainer = document.createElement("div");
    auroraContainer.className = "ambient-aurora-layer";
    auroraContainer.setAttribute("aria-hidden", "true");
    auroraContainer.innerHTML = `
      <div class="aurora-orb is-orb-1"></div>
      <div class="aurora-orb is-orb-2"></div>
    `;
    document.body.prepend(auroraContainer);
  }

  const orb1 = auroraContainer.querySelector(".is-orb-1");
  const orb2 = auroraContainer.querySelector(".is-orb-2");

  if (!orb1 || !orb2) return;

  // Gentle, atmospheric floating choreography (inspired by fourmula.ai & GSAP Cloud)
  anim1 = gsap.to(orb1, {
    x: "25vw",
    y: "35vh",
    scale: 1.25,
    rotation: 45,
    duration: 16,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  anim2 = gsap.to(orb2, {
    x: "-20vw",
    y: "-30vh",
    scale: 0.85,
    rotation: -45,
    duration: 22,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: 2,
  });

  // Soft mouse parallax
  if (window.matchMedia("(pointer: fine)").matches) {
    mouseHandler = (e) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 60;
      const normY = (e.clientY / window.innerHeight - 0.5) * 60;

      gsap.to(auroraContainer, {
        x: normX,
        y: normY,
        duration: 2.5,
        ease: "power1.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", mouseHandler, { passive: true });
  }
}

export function cleanup() {
  if (anim1) anim1.kill();
  if (anim2) anim2.kill();
  if (mouseHandler) window.removeEventListener("mousemove", mouseHandler);
  if (auroraContainer) {
    gsap.set(auroraContainer, { x: 0, y: 0 });
  }
}

export default { init, cleanup };
