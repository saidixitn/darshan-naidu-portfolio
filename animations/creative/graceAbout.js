import { gsap } from "../../vendor.js";

let cleanupFns = [];

export function init() {
  if (typeof document === "undefined") return;

  cleanup();

  const container = document.querySelector('[data-barba-namespace="about"]');
  if (!container) return;

  // 1. Interactive Hero Shot Selector (Grace Fashion AI stage switcher)
  const shotButtons = container.querySelectorAll(".grace-shot-btn");
  const stageMedias = container.querySelectorAll(".grace-stage-media");

  if (shotButtons.length && stageMedias.length) {
    shotButtons.forEach((btn, index) => {
      const handleClick = (e) => {
        e.preventDefault();
        shotButtons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        stageMedias.forEach((media, mIdx) => {
          if (mIdx === index) {
            media.style.display = "block";
            gsap.fromTo(
              media,
              { opacity: 0, scale: 1.04 },
              { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
            );
            const video = media.querySelector("video");
            if (video) {
              try {
                video.play();
              } catch (err) {}
            }
          } else {
            gsap.to(media, {
              opacity: 0,
              duration: 0.3,
              ease: "power1.in",
              onComplete: () => {
                media.style.display = "none";
                const video = media.querySelector("video");
                if (video) {
                  try {
                    video.pause();
                  } catch (err) {}
                }
              },
            });
          }
        });
      };

      btn.addEventListener("click", handleClick);
      cleanupFns.push(() => btn.removeEventListener("click", handleClick));
    });
  }

  // 2. Interactive Mode Tabs (Grace Fashion AI mode selector)
  const modeTabs = container.querySelectorAll(".grace-mode-tab");
  modeTabs.forEach((tab) => {
    const handleTabClick = (e) => {
      e.preventDefault();
      modeTabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");

      // Micro pulse
      gsap.fromTo(
        tab,
        { scale: 0.96 },
        { scale: 1, duration: 0.4, ease: "back.out(1.8)" }
      );
    };

    tab.addEventListener("click", handleTabClick);
    cleanupFns.push(() => tab.removeEventListener("click", handleTabClick));
  });

  // 3. Grace Fashion AI FAQ Accordions with Smooth GSAP height animation
  const faqItems = container.querySelectorAll(".grace-faq-item");
  faqItems.forEach((item) => {
    const header = item.querySelector(".grace-faq-header");
    const content = item.querySelector(".grace-faq-content");
    const icon = item.querySelector(".grace-faq-icon");

    if (!header || !content) return;

    let isOpen = false;

    const toggleAccordion = () => {
      isOpen = !isOpen;
      item.classList.toggle("is-open", isOpen);

      if (isOpen) {
        content.style.display = "block";
        const h = content.scrollHeight;
        gsap.fromTo(
          content,
          { height: 0, opacity: 0 },
          { height: h, opacity: 1, duration: 0.45, ease: "power3.out" }
        );
        if (icon) {
          gsap.to(icon, { rotation: 45, duration: 0.35, ease: "power2.out" });
        }
      } else {
        gsap.to(content, {
          height: 0,
          opacity: 0,
          duration: 0.35,
          ease: "power3.inOut",
          onComplete: () => {
            content.style.display = "none";
          },
        });
        if (icon) {
          gsap.to(icon, { rotation: 0, duration: 0.35, ease: "power2.out" });
        }
      }
    };

    header.addEventListener("click", toggleAccordion);
    cleanupFns.push(() => header.removeEventListener("click", toggleAccordion));
  });
}

export function cleanup() {
  cleanupFns.forEach((fn) => fn());
  cleanupFns = [];
}

export default { init, cleanup };
