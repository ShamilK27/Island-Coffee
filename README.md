# Island Coffee: perfecting the art of coffee since 1964

A cinematic, scroll-directed redesign concept for [Island Coffee](https://islandcoffee.lk/), Sri Lanka.
Brand facts (products, LKR prices, store, figures) come from islandcoffee.lk; photography is
placeholder stock from Unsplash. Replace it with Island Coffee's own images in `public/images`.
React + Vite, Tailwind v4, GSAP/ScrollTrigger, Lenis, SplitType, React Three Fiber.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## The film (scene order)

| # | Scene | Technique |
|---|-------|-----------|
| 01 | **Hero** | Title behind a live 3D roasted bean; words part like curtains on scroll |
| 02 | **Journey** | Framed window expands to full-bleed while the bean lifts away; four pinned stages wipe over each other |
| 03 | **Pour** | The Island Coffee logo pot tilts in and pours into a cup (stream, rising crema, ripples, steam), with "Poured since 1964" and the brand stats; coffee floods the frame and becomes the Menu |
| 04 | **Collection** | All 13 shop products: each pack rises onto a lit podium over a blurred backdrop of its ingredients (drag or swipe to change), pack sizes + LKR prices, add-to-cart, shop links |
| 05 | **Story** | Manifesto lights up word by word; masked editorial images |
| 06 | **House** | Pinned photo opens from a card to full-bleed; three parallax planes |
| 07 | **Gallery** | Asymmetric grid, hover zoom, lightbox |
| 08 | **Voices** | Editorial testimonial slider + marquee |
| 09 | **Visit** | Hours, contact, self-drawing SVG map |
| 10 | **Finale** | Brand name assembles around a turning cup; footer |

## Cart page (`/cart/`)

A second, lightweight page (`cart/index.html` → `src/pages/CartPage.jsx`) with no loader or 3D. It shares the cart with the film through `OrderContext`, which stores lines (product, pack size, quantity) in `localStorage` and syncs across tabs. Customers can change quantities, remove items and see the subtotal. There is no payment: the page offers **Order by phone** and **Checkout on islandcoffee.lk**. Because `/cart/` is a real folder in the build, it works on any static host without rewrite rules.

## Animation architecture

```
src/motion/
  gsap.js          one GSAP instance, shared eases + media queries
  useScene.js      every section's choreography goes through this hook:
                   gsap.matchMedia scoped to the section → auto cleanup,
                   rebuilds on breakpoint / reduced-motion change,
                   SplitType instances auto-reverted
  presets.js       shared vocabulary: charsIn, revealText, maskReveal, parallax
  Director.js      page-level: morphs --bg/--fg between scenes (data-bg/data-fg),
                   publishes --progress, sorts + refreshes all triggers
  stage.js         mutable bridge between ScrollTriggers and the WebGL loop
  SmoothScroll.jsx Lenis driven by GSAP's ticker (one clock)
src/three/
  Stage.jsx        the single fixed canvas (lazy-loaded chunk)
  BeanModel.jsx    glossy hero bean (damped, scroll-driven)
  geometry.js      procedural bean geometry
  Beans.jsx        instanced floating beans
```

Rules the code follows:
- Sections never animate on their own clock: everything scroll-bound is one scrubbed timeline per scene, so it reverses perfectly.
- 3D never re-renders React on scroll. Triggers write numbers to `stage`, and `useFrame` damps them.
- The canvas stops rendering (`frameloop="never"`) once the Journey has taken over.
- `prefers-reduced-motion`: Lenis off, cursor/magnetics off, reveals become fades, ambient loops disabled.
- Mobile: smaller pins, fewer beans, lower DPR.

All copy and media live in `src/data/content.js`. Photography is from Unsplash (stored locally in `public/images`).
