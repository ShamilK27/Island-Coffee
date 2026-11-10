import { useRef } from "react";
import { useScene } from "../motion/useScene";
import { gsap } from "../motion/gsap";
import { EASE } from "../motion/gsap";
import { revealText } from "../motion/presets";
import { ATMOSPHERE } from "../data/content";

/**
 * Scene 06: The House.
 * A framed photograph pins and opens to full-bleed as if you stepped through
 * the door, then a row of three tiles reveals together.
 */
export function Atmosphere() {
  const root = useRef(null);

  useScene(root, (api) => {
    const { q } = api;
    revealText(api, q("[data-atmos-title]")[0]);

    const caption = api.split(q("[data-room-title]")[0], "words,chars");
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: q("[data-room]")[0],
        start: "top top",
        end: api.mobile ? "+=90%" : "+=130%",
        pin: true,
        scrub: true,
      },
    });
    tl.fromTo(
      q("[data-room-frame]"),
      {
        clipPath: api.mobile
          ? "inset(22% 8% 22% 8% round 24px)"
          : "inset(20% 26% 20% 26% round 28px)",
      },
      { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1 },
    )
      .fromTo(
        q("[data-room-frame] img"),
        { scale: 1.45 },
        { scale: 1, duration: 1 },
        0,
      )
      .fromTo(
        q("[data-room-shade]"),
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        0.4,
      )
      .fromTo(
        caption.chars,
        { yPercent: 115 },
        { yPercent: 0, stagger: 0.012, duration: 0.4, ease: "power3.out" },
        0.55,
      )
      .fromTo(
        q("[data-room-sub]"),
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.3 },
        0.75,
      );

    // The tiles sit in one even row and reveal together, left to right
    const media = q("[data-tile] .media");
    const row = { trigger: q("[data-tiles]")[0], start: "top 85%", once: true };
    if (api.reduced) {
      gsap.from(media, { autoAlpha: 0, duration: 0.8, scrollTrigger: row });
    } else {
      gsap
        .timeline({ scrollTrigger: row })
        .fromTo(
          media,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            stagger: 0.12,
            ease: EASE.cine,
          },
        )
        .fromTo(
          q("[data-tile] .media img"),
          { scale: 1.35 },
          { scale: 1, duration: 1.6, stagger: 0.12, ease: EASE.out },
          0,
        );
    }
  });

  return (
    <section
      id="house"
      ref={root}
      data-scene
      data-bg="#17100D"
      data-fg="#F2E9DC"
      aria-label="Island Coffee in Sri Lanka"
      className="relative pb-28 pt-28 md:pb-44 md:pt-40"
    >
      <header className="mx-auto mb-16 flex max-w-[1500px] flex-col justify-between gap-8 px-5 md:mb-24 md:flex-row md:items-end md:px-10">
        <div>
          <p className="t-eyebrow mb-5 text-caramel">06 — The Island</p>
          <h2 data-atmos-title className="t-display">
            Coffee, <em className="italic text-caramel">Sri Lankan</em> style.
          </h2>
        </div>
        <p className="t-lead max-w-sm text-cream/60">
          Visit our store on Galle Road in Bambalapitiya, or find Island Coffee
          at leading supermarkets across the island.
        </p>
      </header>

      <div data-room className="relative h-[100svh] overflow-hidden">
        <div data-room-frame className="absolute inset-0 overflow-hidden">
          <img
            src={ATMOSPHERE.hero}
            alt="A hand scooping freshly roasted coffee beans from the roaster"
            loading="lazy"
            className="h-full w-full object-cover object-[80%_50%] md:object-center"
          />
          <div
            data-room-shade
            className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-espresso/10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso/60 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-12 px-5 md:bottom-20 md:px-10">
          <h3
            data-room-title
            data-mask
            className="t-mega !text-[clamp(3rem,10vw,10rem)]"
          >
            Brewing tradition
          </h3>
          <p data-room-sub className="t-lead mt-6 max-w-md text-cream/75">
            Island Coffee: brewing tradition in the heart of Sri Lanka, for more
            than six decades.
          </p>
        </div>
      </div>

      <div
        data-tiles
        className="mx-auto mt-24 grid max-w-[1500px] gap-10 px-5 md:mt-40 md:grid-cols-3 md:gap-8 md:px-10"
      >
        {ATMOSPHERE.tiles.map((t) => (
          <figure key={t.title} data-tile>
            <div className="media aspect-[4/5]" data-cursor="View">
              <img
                src={t.image}
                alt={t.title}
                loading="lazy"
                className="transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] hover:scale-105"
              />
            </div>
            <figcaption className="mt-4">
              <span className="block font-display text-2xl">{t.title}</span>
              <span className="mt-1 block text-sm text-cream/55">{t.text}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
