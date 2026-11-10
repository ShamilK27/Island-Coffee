import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import SplitType from 'split-type'
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus } from 'lucide-react'
import { useScene } from '../motion/useScene'
import { gsap, EASE, prefersReducedMotion } from '../motion/gsap'
import { revealText } from '../motion/presets'
import { Magnetic } from '../components/Magnetic'
import { useOrder } from '../components/OrderContext'
import { MENU, lkr } from '../data/content'

const pad = (n) => String(n).padStart(2, '0')
const priceFrom = (m) => (m.sizes.length > 1 ? `from ${lkr(m.sizes[0].price)}` : lkr(m.sizes[0].price))

/** Product name that animates in, char by char, each time it mounts. */
function AnimatedName({ text, className }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const s = new SplitType(ref.current, { types: 'words,chars', tagName: 'span' })
    const tw = gsap.fromTo(s.chars, { yPercent: 115, rotate: 8 }, { yPercent: 0, rotate: 0, stagger: 0.025, duration: 1, ease: EASE.out })
    return () => {
      tw.kill()
      s.revert()
    }
  }, [text])
  return (
    <h3 ref={ref} className={`mask-words ${className}`}>
      {text}
    </h3>
  )
}

/**
 * Scene 04: the menu as a luxury product advertisement.
 * Each pack stands on a lit podium over a blurred backdrop of its ingredients
 * (drag or swipe to change), a ghosted giant product name, and a details card. Keyboard and touch friendly.
 */
export function Menu() {
  const root = useRef(null)
  const [idx, setIdx] = useState(0)
  const [sizeIdx, setSizeIdx] = useState(0)
  const prevIdx = useRef(0)
  const { add } = useOrder()
  const item = MENU[idx]
  const size = item.sizes[Math.min(sizeIdx, item.sizes.length - 1)]

  const go = useCallback((n) => {
    setIdx((n + MENU.length) % MENU.length)
    setSizeIdx(0)
  }, [])

  // Scroll entrance
  useScene(root, (api) => {
    const { q } = api
    revealText(api, q('[data-menu-title]')[0], { types: 'words,chars' })
    if (api.reduced) return
    gsap.from(q('[data-menu-row]'), {
      y: 40,
      autoAlpha: 0,
      stagger: 0.06,
      duration: 1,
      ease: EASE.out,
      scrollTrigger: { trigger: q('[data-menu-list]')[0], start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    const stageIn = { trigger: q('[data-stage]')[0], start: 'top 85%', toggleActions: 'play none none reverse' }
    gsap.from(q('[data-podium]'), { y: 60, scale: 0.85, autoAlpha: 0, duration: 1.4, ease: EASE.out, scrollTrigger: stageIn })
    gsap.from(q('[data-packs]'), { y: -120, autoAlpha: 0, duration: 1.3, ease: 'bounce.out', delay: 0.35, scrollTrigger: stageIn })
    gsap.fromTo(
      q('[data-ghost]'),
      { xPercent: 8 },
      { xPercent: -8, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
    )
  })

  // Podium: the old pack lifts away, the new one rises onto the plinth; the backdrop cross-fades
  useLayoutEffect(() => {
    const packs = root.current.querySelectorAll('[data-pack]')
    const shots = root.current.querySelectorAll('[data-bgshot]')
    const from = prevIdx.current
    prevIdx.current = idx
    if (from === idx || prefersReducedMotion()) {
      gsap.set([...packs, ...shots], { autoAlpha: 0 })
      gsap.set([packs[idx], shots[idx]], { autoAlpha: 1, x: 0, y: 0, rotate: 0 })
      return
    }
    gsap.to(packs[from], { y: -50, autoAlpha: 0, duration: 0.45, ease: 'power2.in', overwrite: 'auto', onComplete: () => gsap.set(packs[from], { x: 0, rotate: 0 }) })
    gsap.fromTo(packs[idx], { x: 0, y: 80, rotate: 0, scale: 0.94, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 1.1, ease: EASE.out, delay: 0.25, overwrite: 'auto' })
    gsap.to(shots[from], { autoAlpha: 0, duration: 1.2, ease: 'power1.inOut', overwrite: 'auto' })
    gsap.fromTo(shots[idx], { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, ease: 'power1.inOut', overwrite: 'auto' })
    gsap.fromTo(root.current.querySelector('[data-glow]'), { opacity: 0.35, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.4, ease: EASE.out, delay: 0.25 })
    gsap.fromTo(root.current.querySelectorAll('[data-detail]'), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.9, ease: EASE.out, delay: 0.15 })
  }, [idx])

  const onKey = (e) => {
    if (e.key === 'ArrowRight') go(idx + 1)
    if (e.key === 'ArrowLeft') go(idx - 1)
  }

  // Drag / swipe the pack sideways (mouse, pen or touch). Swipe left = next.
  const drag = useRef(null)
  const onPointerDown = (e) => {
    if (e.button > 0) return
    drag.current = { x: e.clientX, dx: 0, pack: root.current.querySelectorAll('[data-pack]')[idx] }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    const s = drag.current
    if (!s) return
    s.dx = e.clientX - s.x
    gsap.set(s.pack, { x: s.dx * 0.5, rotate: s.dx * 0.03 })
  }
  const onPointerUp = () => {
    const s = drag.current
    drag.current = null
    if (!s) return
    if (Math.abs(s.dx) > 70) go(idx + (s.dx < 0 ? 1 : -1))
    else gsap.to(s.pack, { x: 0, rotate: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' })
  }

  return (
    <section
      id="menu"
      ref={root}
      data-scene
      data-bg="#261812"
      data-fg="#F2E9DC"
      data-color-start="top bottom"
      data-color-end="top 90%"
      aria-label="The collection"
      className="relative overflow-hidden bg-roast pb-24 pt-28 text-cream md:pb-32 md:pt-36"
      onKeyDown={onKey}
    >
      {/* The selected coffee's ingredients, blurred across the whole section */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {MENU.map((m, i) => (
          <img
            key={m.name}
            data-bgshot
            src={m.image}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full scale-110 object-cover [filter:blur(22px)_brightness(0.34)_saturate(1.1)]"
            style={{ visibility: i === 0 ? 'visible' : 'hidden' }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-roast via-roast/10 to-roast" />
      </div>

      {/* Ghosted product name */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[38%] flex justify-center overflow-hidden">
        <div data-ghost>
          <div key={item.name} className="t-mega t-outline whitespace-nowrap text-cream/[0.07] [animation:ghost-in_1.2s_var(--ease-out-expo)_both]">
            {item.name}
          </div>
        </div>
      </div>
      <style>{`@keyframes ghost-in{from{opacity:0;letter-spacing:.06em}to{opacity:1;letter-spacing:-0.04em}}`}</style>

      <div className="relative mx-auto max-w-[1500px] px-5 md:px-10">
        <header className="mb-14 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end">
          <div>
            <p className="t-eyebrow mb-5 text-caramel">04 — The Collection</p>
            <h2 data-menu-title className="t-display">
              Find your <em className="italic text-caramel">flavour</em>
            </h2>
          </div>
          <p className="t-lead max-w-sm text-cream/60">
            Every coffee in our online shop, from the signature powder and highland Arabica to vanilla, mint and Jaffna.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Product list */}
          <div data-menu-list className="min-w-0 order-1 lg:col-span-4">
            <ul role="listbox" aria-label="Coffees" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:block lg:space-y-0 lg:overflow-visible lg:px-0">
              {MENU.map((m, i) => {
                const on = i === idx
                return (
                  <li key={m.name} data-menu-row role="option" aria-selected={on} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => go(i)}
                      data-cursor="Select"
                      className={`group flex w-full items-baseline gap-4 rounded-full border px-4 py-2 text-left transition-colors duration-500 lg:rounded-none lg:border-0 lg:border-b lg:border-cream/10 lg:px-0 lg:py-3 ${
                        on ? 'border-caramel text-cream' : 'border-cream/15 text-cream/45 hover:text-cream'
                      }`}
                    >
                      <span className={`t-eyebrow hidden w-6 lg:inline ${on ? 'text-caramel' : ''}`}>{pad(i + 1)}</span>
                      <span className="relative whitespace-nowrap font-display text-lg lg:flex-1 lg:text-xl">
                        {m.name}
                        <span className={`absolute -bottom-1 left-0 hidden h-px bg-caramel transition-all duration-700 lg:block ${on ? 'w-full' : 'w-0 group-hover:w-1/3'}`} />
                      </span>
                      <span className="hidden text-sm tabular-nums lg:inline">{priceFrom(m)}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Podium */}
          <div className="min-w-0 order-2 lg:col-span-5">
            <div
              data-stage
              className="relative mx-auto aspect-[4/5] w-full max-w-[460px] touch-pan-y select-none"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              data-cursor="Drag"
            >
              <div data-glow className="absolute left-1/2 top-[42%] aspect-square w-[115%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(214,154,99,0.28),rgba(214,154,99,0)_62%)]" />

              <svg data-podium viewBox="0 0 400 150" className="absolute inset-x-0 bottom-0 w-full overflow-visible" aria-hidden>
                <defs>
                  <linearGradient id="podium-side" x1="0" x2="1">
                    <stop offset="0" stopColor="#1a100b" />
                    <stop offset=".45" stopColor="#4a2e1e" />
                    <stop offset=".75" stopColor="#2a1a12" />
                    <stop offset="1" stopColor="#120b07" />
                  </linearGradient>
                  <radialGradient id="podium-top" cx=".5" cy=".35" r=".65">
                    <stop offset="0" stopColor="#6b4630" />
                    <stop offset="1" stopColor="#2c1a10" />
                  </radialGradient>
                  <filter id="podium-soft" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="8" />
                  </filter>
                </defs>
                <ellipse cx="200" cy="138" rx="200" ry="22" fill="#000" opacity=".45" filter="url(#podium-soft)" />
                <path d="M10 52 V118 A190 26 0 0 0 390 118 V52 Z" fill="url(#podium-side)" />
                <ellipse cx="200" cy="52" rx="190" ry="34" fill="url(#podium-top)" />
                <ellipse cx="200" cy="52" rx="189" ry="33" fill="none" stroke="#d69a63" strokeOpacity=".35" />
                <ellipse cx="200" cy="58" rx="92" ry="11" fill="#000" opacity=".5" filter="url(#podium-soft)" />
                {[
                  [86, 60, 20],
                  [306, 46, -30],
                  [322, 64, 60],
                ].map(([x, y, r]) => (
                  <g key={x} transform={`translate(${x} ${y}) rotate(${r})`}>
                    <ellipse rx="11" ry="7" fill="#3a1c0d" />
                    <path d="M-8 0 C -3 -3, 3 3, 8 0" stroke="#1a0b04" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                  </g>
                ))}
              </svg>

              <div data-packs className="absolute inset-x-0 bottom-[19%] top-[3%]">
                {MENU.map((m, i) => (
                  <div key={m.name} data-pack className="absolute inset-0 flex items-end justify-center" style={{ visibility: i === 0 ? 'visible' : 'hidden' }}>
                    <img
                      src={m.pack}
                      alt={i === idx ? `${m.name} pack` : ''}
                      loading="lazy"
                      draggable="false"
                      className="max-h-full max-w-[58%] object-contain drop-shadow-[0_26px_26px_rgba(0,0,0,0.55)]"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4" aria-hidden>
              <span className="t-eyebrow text-[0.6rem] tabular-nums text-cream/60">{pad(idx + 1)}</span>
              <span className="flex items-center gap-1.5">
                {MENU.map((m, i) => (
                  <span key={m.name} className={`h-1.5 rounded-full transition-all duration-500 ${i === idx ? 'w-6 bg-caramel' : 'w-1.5 bg-cream/25'}`} />
                ))}
              </span>
              <span className="t-eyebrow text-[0.6rem] tabular-nums text-cream/40">{pad(MENU.length)}</span>
            </div>
          </div>

          {/* Details */}
          <div className="min-w-0 order-3 flex flex-col justify-center lg:col-span-3" aria-live="polite">
            <p data-detail className="t-eyebrow mb-4 text-caramel">
              {item.label}
            </p>
            <AnimatedName key={item.name} text={item.name} className="mb-6 font-display text-[clamp(2.2rem,3.3vw,3.6rem)] leading-[0.98] tracking-[-0.025em]" />
            <p data-detail className="mb-6 leading-relaxed text-cream/70">
              {item.text}
            </p>
            <ul data-detail className="mb-8 flex flex-wrap gap-2" aria-label="Tasting notes">
              {item.notes.map((n) => (
                <li key={n} className="rounded-full border border-cream/15 px-3 py-1.5 text-xs text-cream/75">
                  {n}
                </li>
              ))}
            </ul>
            <div data-detail className="mb-8 flex flex-col gap-3 border-t border-cream/10 pt-6">
              <span className="t-eyebrow text-cream/50">{item.sizes.length > 1 ? 'Choose a pack size' : 'Price'}</span>
              {item.sizes.length > 1 && (
                <div role="radiogroup" aria-label="Pack size" className="flex flex-wrap gap-2">
                  {item.sizes.map((s, i) => (
                    <button
                      key={s.size}
                      type="button"
                      role="radio"
                      aria-checked={s === size}
                      onClick={() => setSizeIdx(i)}
                      className={`rounded-full border px-4 py-1.5 text-sm tabular-nums transition-colors ${
                        s === size ? 'border-caramel bg-caramel text-espresso' : 'border-cream/20 text-cream/70 hover:border-cream/50'
                      }`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              )}
              <span className="font-display text-[clamp(1.9rem,2.6vw,2.6rem)] tabular-nums leading-none">
                {lkr(size.price)}
                {item.sizes.length === 1 && size.size !== 'Jar' && <span className="ml-3 align-middle text-base text-cream/50">{size.size}</span>}
              </span>
            </div>
            <div data-detail className="flex items-center gap-3">
              <Magnetic className="flex-1">
                <button type="button" className="btn btn-solid w-full justify-center" onClick={() => add({ id: `${item.name}|${size.size}`, name: item.name, size: size.size, price: size.price, pack: item.pack, url: item.url })} data-cursor="Add">
                  <span>Add to cart</span>
                  <Plus size={14} />
                </button>
              </Magnetic>
              <button type="button" onClick={() => go(idx - 1)} aria-label="Previous coffee" className="grid size-12 shrink-0 place-items-center rounded-full border border-cream/20 transition-colors hover:border-caramel hover:text-caramel">
                <ArrowLeft size={16} />
              </button>
              <button type="button" onClick={() => go(idx + 1)} aria-label="Next coffee" className="grid size-12 shrink-0 place-items-center rounded-full border border-cream/20 transition-colors hover:border-caramel hover:text-caramel">
                <ArrowRight size={16} />
              </button>
            </div>
            <a data-detail href={item.url} target="_blank" rel="noreferrer" className="link-line mt-5 inline-flex w-fit items-center gap-2 text-sm text-cream/60 hover:text-cream">
              View on islandcoffee.lk <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
