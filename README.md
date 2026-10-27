# Deztopia High-End Design Portfolio (Local Edition)

This is a complete, self-contained local instance of **[deztopia.com](https://www.deztopia.com/)**, running locally with all original animations, typography (FK Grotesk), GSAP interactions, Barba transitions, and assets.

## 🚀 Live Local Server

The website is currently running live at:
👉 **[http://localhost:3000](http://localhost:3000)**

To run or restart the server at any time:
```bash
cd /Users/saidixitnaidu/Downloads/social-media-portfolio
python3 server.py
```

---

## 🎨 Features & Optimizations Applied

1. **Default Pointer Restored**:
   - The custom circle follower cursor (`.cb-cursor`) has been disabled as requested.
   - Native OS / browser cursor is active everywhere with standard hover pointers on interactive elements (`cursor: pointer`).

2. **Full Animation & Interaction Engine Preserved**:
   - **GSAP & ScrollTrigger**: Smooth scroll reveals, pinning, parallax, and sticky layouts.
   - **FK Grotesk Fonts**: Localized offline woff2 fonts loaded directly.
   - **Word Swap & Text Split**: Dynamic typography animations on the homepage hero and section intros.
   - **Swiper & Project Teasers**: Interactive portfolio showcase with smooth carousels.
   - **Barba.js**: Seamless page transitions between case studies and subpages.

3. **Color Palette & Styling Enhancements**:
   - Prepared modern luxury accent tokens in `style.css`:
     - `--accent-cyan: #00F0FF`
     - `--accent-violet: #8A2BE2`
     - `--accent-purple: #7000FF`
     - `--accent-glow: 0 0 25px rgba(0, 240, 255, 0.25)`

4. **Multi-Threaded Concurrency**:
   - Scraped and downloaded over 570 static assets concurrently across 24 worker threads.

---

## 📁 Directory Structure

```text
social-media-portfolio/
├── index.html                    # Homepage
├── about-deztopia/index.html      # About page
├── service/index.html             # Services & Capabilities
├── deztopia-design-portfolio/    # All Projects Showcase
├── for-startups/index.html        # For Startups page
├── contact-deztopia/index.html    # Contact page
├── projects/
│   ├── across/index.html         # Across case study
│   ├── basilica/index.html       # Basilica case study
│   ├── obvio/index.html          # Obvio case study
│   ├── rendezvu/index.html       # Rendezvu case study
│   └── roomie/index.html         # Roomie case study
├── assets/
│   ├── css/                      # Webflow & Swiper stylesheets
│   ├── fonts/                    # FK Grotesk Regular & Medium (.woff2)
│   ├── images/                   # All AVIF, WebP, SVG, GIF imagery
│   └── js/                       # jQuery, Webflow chunks, Finsweet
├── animations/                   # GSAP animation modules (wordSwap, preloader, etc.)
├── pages/                        # Page lifecycle handlers (home, about, service, detail)
├── utilities/                    # SplitTypes, smoothScroll, helper utilities
├── main.js                       # Primary ES module entrypoint
├── style.css                     # Custom styles, default cursor & color accents
└── server.py                     # High-performance local development server
```
