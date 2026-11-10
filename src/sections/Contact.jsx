import { useRef } from 'react'
import { ArrowUpRight, MapPin, Phone, ShoppingBag } from 'lucide-react'
import { useScene } from '../motion/useScene'
import { gsap, EASE } from '../motion/gsap'
import { revealText } from '../motion/presets'
import { Magnetic } from '../components/Magnetic'
import { CONTACT, SHOP_URL } from '../data/content'

const label = { fill: '#8a6a52', fontSize: 11, letterSpacing: 3, style: { fontFamily: 'var(--font-sans)' } }

/**
 * Stylised map of Bambalapitiya (pure SVG; no third-party map scripts).
 * Schematic, not to scale: coast to the west, then the railway, Marine Drive,
 * Galle Road and Duplication Road running north–south.
 */
function MapArt() {
  return (
    <svg viewBox="0 0 600 600" className="h-full w-full" aria-hidden="true">
      <rect width="600" height="600" fill="#2c1c15" />
      {/* Indian Ocean */}
      <path d="M-10 -10 H120 C 105 150, 135 300, 110 450 S 95 560, 100 610 H-10 Z" fill="#241712" />
      <path data-draw d="M120 -10 C 105 150, 135 300, 110 450 S 95 560, 100 610" stroke="#4b3426" strokeWidth="3" fill="none" />
      {/* city blocks */}
      {[
        [300, 60, 70, 90], [390, 60, 90, 90], [300, 330, 70, 110], [390, 330, 90, 110], [500, 200, 80, 120], [500, 360, 80, 140],
      ].map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="6" fill="#33221a" />
      ))}
      {/* railway along the coast */}
      <path data-draw d="M150 -10 C 138 150, 165 300, 142 450 S 128 560, 132 610" stroke="#5a3f2e" strokeWidth="2" strokeDasharray="10 6" fill="none" />
      {/* main roads (north–south) */}
      <g stroke="#4a362a" fill="none" strokeLinecap="round">
        <path data-draw d="M190 -10 C 178 150, 205 300, 182 450 S 168 560, 172 610" strokeWidth="9" />
        <path data-draw d="M270 -10 C 262 160, 282 300, 262 450 S 250 560, 255 610" strokeWidth="16" />
        <path data-draw d="M480 -10 C 472 160, 492 300, 476 450 S 468 560, 470 610" strokeWidth="10" />
      </g>
      {/* cross streets */}
      <g stroke="#3b2b21" strokeWidth="5" fill="none" strokeLinecap="round">
        {['M150 175 H600', 'M150 300 C 300 296, 450 306, 600 300', 'M150 470 H600', 'M262 90 H480', 'M262 560 H480'].map((d) => (
          <path key={d} data-draw d={d} />
        ))}
      </g>
      <text x="22" y="300" {...label} transform="rotate(-90 22 300)">INDIAN OCEAN</text>
      <text x="200" y="520" {...label} fontSize="9" transform="rotate(-86 200 520)">MARINE DR</text>
      <text x="292" y="250" {...label} transform="rotate(-87 292 250)">GALLE RD</text>
      <text x="508" y="120" {...label} fontSize="9" transform="rotate(-88 508 120)">DUPLICATION RD</text>
      <text x="330" y="290" {...label} fill="#a07d61">BAMBALAPITIYA</text>
      {/* store pin on Galle Road */}
      <g transform="translate(276 360)">
        <circle r="12" fill="#B87945" style={{ transformOrigin: 'center', transformBox: 'fill-box', animation: 'pulse-ring 2.4s ease-out infinite' }} />
        <circle r="12" fill="#B87945" style={{ transformOrigin: 'center', transformBox: 'fill-box', animation: 'pulse-ring 2.4s ease-out 1.2s infinite' }} />
        <circle r="10" fill="#B87945" stroke="#F2E9DC" strokeWidth="3" />
      </g>
    </svg>
  )
}

/** Scene 09: visit the store. */
export function Contact() {
  const root = useRef(null)

  useScene(root, (api) => {
    const { q } = api
    revealText(api, q('[data-visit-title]')[0])
    if (api.reduced) return
    gsap.from(q('[data-info]'), {
      y: 40,
      autoAlpha: 0,
      stagger: 0.08,
      duration: 1.1,
      ease: EASE.out,
      scrollTrigger: { trigger: q('[data-info]')[0], start: 'top 88%', toggleActions: 'play none none reverse' },
    })
    // Roads draw themselves in as the map opens
    const roads = q('[data-draw]').filter((p) => !p.getAttribute('stroke-dasharray'))
    roads.forEach((p) => {
      const len = p.getTotalLength()
      gsap.fromTo(
        p,
        { strokeDasharray: len, strokeDashoffset: len },
        {
          strokeDashoffset: 0,
          duration: 2.2,
          ease: EASE.cine,
          scrollTrigger: { trigger: q('[data-map]')[0], start: 'top 75%', toggleActions: 'play none none reverse' },
        },
      )
    })
    gsap.fromTo(
      q('[data-map]'),
      { clipPath: 'inset(10% 10% 10% 10% round 400px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 28px)',
        ease: 'none',
        scrollTrigger: { trigger: q('[data-map]')[0], start: 'top 95%', end: 'top 35%', scrub: true },
      },
    )
    gsap.fromTo(
      q('[data-map] svg'),
      { scale: 1.3, rotate: -4 },
      { scale: 1, rotate: 0, ease: 'none', scrollTrigger: { trigger: q('[data-map]')[0], start: 'top bottom', end: 'top 30%', scrub: true } },
    )
  })

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.mapsQuery)}`

  return (
    <section
      id="visit"
      ref={root}
      data-scene
      data-bg="#39251C"
      data-fg="#F2E9DC"
      aria-label="Visit our store"
      className="relative py-28 md:py-40"
    >
      <div className="mx-auto grid max-w-[1500px] gap-14 px-5 md:px-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <p className="t-eyebrow mb-5 text-caramel">09 — Visit</p>
          <h2 data-visit-title className="t-display mb-12">
            Find us on <em className="italic text-caramel">Galle Road</em>.
          </h2>

          <div className="grid gap-10 sm:grid-cols-2">
            <div data-info>
              <p className="t-eyebrow mb-4 flex items-center gap-2 text-cream/50">
                <MapPin size={13} /> Our store
              </p>
              <address className="font-display text-2xl not-italic leading-snug">
                {CONTACT.address.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
            </div>
            <div data-info>
              <p className="t-eyebrow mb-4 flex items-center gap-2 text-cream/50">
                <Phone size={13} /> Call us
              </p>
              <a href={`tel:${CONTACT.phoneHref}`} className="link-line font-display text-2xl">
                {CONTACT.phone}
              </a>
              <p className="mt-3 text-sm text-cream/55">Call ahead for opening hours and bulk orders.</p>
            </div>
            <div data-info>
              <p className="t-eyebrow mb-4 flex items-center gap-2 text-cream/50">
                <ShoppingBag size={13} /> Island-wide
              </p>
              <p className="leading-relaxed text-cream/75">{CONTACT.availability}</p>
            </div>
            <div data-info>
              <p className="t-eyebrow mb-4 text-cream/50">Online</p>
              <ul className="space-y-2">
                {CONTACT.links.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="link-line inline-flex items-center gap-1">
                      {s.label} <ArrowUpRight size={13} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div data-info className="mt-12 flex flex-wrap gap-3">
            <Magnetic>
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn btn-solid" data-cursor="Go">
                <span>Get directions</span>
                <ArrowUpRight size={14} />
              </a>
            </Magnetic>
            <Magnetic>
              <a href={SHOP_URL} target="_blank" rel="noreferrer" className="btn btn-ghost">
                <span>Shop online</span>
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="lg:col-span-6">
          <a
            data-map
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            data-cursor="Open"
            aria-label="Open the Island Coffee store, 158 Galle Road, Bambalapitiya, in Google Maps (opens in a new tab)"
            className="group relative block aspect-square overflow-hidden rounded-[28px] outline-offset-4 focus-visible:outline-2 focus-visible:outline-caramel lg:aspect-auto lg:h-full lg:min-h-[640px]"
          >
            <MapArt />
            <span className="t-eyebrow absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-espresso/80 px-3.5 py-2 text-cream/80 backdrop-blur-md transition-colors group-hover:bg-caramel group-hover:text-espresso">
              Open in Maps <ArrowUpRight size={12} />
            </span>
            <div className="absolute bottom-5 left-5 right-5 flex items-center gap-4 rounded-2xl bg-espresso/80 p-4 backdrop-blur-md md:right-auto">
              <img src={CONTACT.image} alt="" loading="lazy" className="size-16 rounded-xl object-cover" />
              <div>
                <p className="font-display text-xl">Island Coffee</p>
                <p className="text-sm text-cream/60">{CONTACT.address.join(', ')}</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
