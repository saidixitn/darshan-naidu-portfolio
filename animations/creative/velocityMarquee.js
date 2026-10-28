import { gsap, ScrollTrigger } from "../../vendor.js";

let tickerAnim = null;
let scrollTriggerInstance = null;

export function init() {
  if (typeof document === "undefined") return;

  cleanup();

  const marqueeTrack = document.querySelector(".velocity-marquee-track");
  if (!marqueeTrack) return;

  let speed = 1.2;
  let direction = 1;

  // Infinite seamless scroll animation using GSAP ticker
  let xPos = 0;
  const singleWidth = marqueeTrack.scrollWidth / 2;

  tickerAnim = () => {
    xPos -= speed * direction;
    if (xPos <= -singleWidth) {
      xPos = 0;
    } else if (xPos > 0) {
      xPos = -singleWidth;
    }
    gsap.set(marqueeTrack, { x: xPos });
  };

  gsap.ticker.add(tickerAnim);

  // Link scroll velocity to marquee speed and direction (Atmos Gallery effect)
  scrollTriggerInstance = ScrollTrigger.create({
    onUpdate: (self) => {
      const vel = self.getVelocity();
      if (Math.abs(vel) > 100) {
        direction = vel > 0 ? 1 : -1;
        const boost = Math.min(6, Math.abs(vel) / 250);
        gsap.to(
          {},
          {
            duration: 0.6,
            ease: "power2.out",
            onStart: () => {
              speed = 1.2 + boost;
            },
            onComplete: () => {
              speed = 1.2;
            },
          }
        );
      }
    },
  });
}

export function cleanup() {
  if (tickerAnim) {
    gsap.ticker.remove(tickerAnim);
    tickerAnim = null;
  }
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
    scrollTriggerInstance = null;
  }
}

export default { init, cleanup };
