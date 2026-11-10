import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, EASE, prefersReducedMotion } from '../motion/gsap'
import { app } from '../motion/stage'
import { useSmoothScroll } from '../motion/SmoothScroll'
import { HERO } from '../data/content'

const loadImage = (src) =>
  new Promise((resolve) => {
    const i = new Image()
    i.onload = i.onerror = resolve
    i.src = src
  })

const NAME = 'Island Coffee'

// Pot geometry (SVG units): the logo is tilted to pour; its spout tip sits at SPOUT
const VB = { x: -30, y: -60, w: 240, h: 200 }
const SPOUT = { x: 197, y: 70 }
const POT_TOP = -60
const POT_BOTTOM = 140

/**
 * Opening title card: the Island Coffee pot tips in and pours into the
 * outlined brand name. As fonts and the hero plate load, the name fills with
 * coffee from the bottom while the pot drains from gold to grey. Once full,
 * the stream cuts off, the pot tips back, the name lifts away and the card
 * rises like a curtain, handing the stage to the hero intro (app.setReady()).
 */
export function Loader() {
  const root = useRef(null)
  const count = useRef(null)
  const fill = useRef(null)
  const potLevel = useRef(null)
  const stream = useRef(null)
  const [done, setDone] = useState(false)
  const scroll = useSmoothScroll()
  const scrollRef = useRef(scroll)
  scrollRef.current = scroll

  useLayoutEffect(() => {
    document.body.classList.add('is-loading')
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    const reduced = prefersReducedMotion()
    const level = { v: 0 }
    let cancelled = false

    // The fill level drives the name's coffee line, the progress bar and the percentage together
    const render = () => {
      const v = level.v
      if (fill.current) fill.current.style.clipPath = `inset(${100 - v}% 0% 0% 0%)`
      // the pot drains as the name fills: its gold layer is clipped from the top down
      if (potLevel.current) potLevel.current.setAttribute('y', String(POT_TOP + (v / 100) * (POT_BOTTOM - POT_TOP) * 0.8))
      // the stream reaches exactly down to the coffee line inside the letters
      if (stream.current) stream.current.style.bottom = `${v}%`
      if (count.current) count.current.textContent = `${Math.round(v)}%`
    }

    const assets = Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      loadImage(HERO.background),
      new Promise((r) => setTimeout(r, reduced ? 200 : 1900)),
    ])

    const ctx = gsap.context(() => {
      gsap.from('[data-loader-name]', { y: 30, autoAlpha: 0, duration: 1, ease: EASE.out })
      // the pot tips forward around its spout, then the stream falls from it
      gsap.fromTo('[data-loader-pot]', { rotate: -38, x: -20, y: -30, autoAlpha: 0 }, { rotate: 0, x: 0, y: 0, autoAlpha: 1, duration: reduced ? 0.01 : 0.7, ease: 'power2.out' })
      if (!reduced) gsap.fromTo('[data-loader-stream]', { scaleY: 0 }, { scaleY: 1, duration: 0.45, ease: 'power2.in', delay: 0.5 })
      const pour = gsap.to(level, { v: 86, duration: reduced ? 0.2 : 1.8, ease: 'power1.inOut', delay: reduced ? 0 : 0.45, onUpdate: render })
      gsap.to('[data-loader-line]', { scaleX: 0.86, duration: reduced ? 0.2 : 2.2, ease: 'power1.inOut' })

      assets.then(() =>
        ctx.add(() => {
          if (cancelled) return
          pour.kill()
          const tl = gsap.timeline({ onComplete: () => setDone(true) })
          tl.to(level, { v: 100, duration: 0.5, ease: 'power2.out', onUpdate: render })
            .to('[data-loader-line]', { scaleX: 1, duration: 0.5, ease: EASE.soft }, 0)
            // the stream cuts off: its tail falls into the name
            .to('[data-loader-stream]', { scaleY: 0, transformOrigin: '50% 100%', duration: 0.4, ease: 'power2.in' }, '-=0.1')
            .to('[data-loader-pot]', { rotate: -38, x: -20, y: -40, autoAlpha: 0, duration: 0.55, ease: 'power2.in' }, '<0.1')
            .to('[data-loader-name]', { y: -40, autoAlpha: 0, duration: 0.6, ease: 'power3.in' }, '+=0.05')
            .add(() => {
              document.body.classList.remove('is-loading')
              scrollRef.current?.start()
              app.setReady()
            }, '-=0.25')
            .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: reduced ? 0.3 : 1.25, ease: EASE.cine }, '-=0.35')
        }),
      )
    }, root)

    return () => {
      cancelled = true
      ctx.revert()
    }
  }, [])

  if (done) return null

  return (
    <div
      ref={root}
      role="status"
      aria-label="Loading Island Coffee"
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-espresso p-6 text-cream md:p-10"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      <div className="t-eyebrow flex justify-between text-cream/50">
        <span>Sri Lankan Coffee</span>
      </div>

      <div className="relative flex flex-col items-center">
        <div
          data-loader-name
          className="relative"
          style={{ '--pot': 'clamp(80px, 13vw, 190px)', '--stream': 'clamp(90px, 17vh, 190px)', '--pour-x': '2.6%' }}
        >
          {/* The stream runs from the spout down to the coffee line, into the "I" of Island */}
          <span
            ref={stream}
            data-loader-stream
            aria-hidden
            className="absolute left-[var(--pour-x)] top-[calc(60%-var(--stream))] w-[5px] -translate-x-1/2 origin-top rounded-t-full bg-gradient-to-b from-[#7a4423] via-[#9a5a2e] to-caramel"
            style={{ bottom: '0%' }}
          />
          {/* The pot pours from its spout, which sits right above the stream */}
          <div aria-hidden className="pointer-events-none absolute bottom-[40%] left-[var(--pour-x)] h-0 w-0">
            <svg
              data-loader-pot
              viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
              className="absolute w-[var(--pot)] overflow-visible"
              style={{
                left: `calc(var(--pot) * ${-(SPOUT.x - VB.x) / VB.w})`,
                bottom: `calc(var(--stream) - var(--pot) * ${(VB.h - (SPOUT.y - VB.y)) / VB.w})`,
                transformOrigin: `${((SPOUT.x - VB.x) / VB.w) * 100}% ${((SPOUT.y - VB.y) / VB.h) * 100}%`,
              }}
            >
              <defs>
                <clipPath id="loader-pot-level">
                  <rect ref={potLevel} x="-200" y={POT_TOP} width="600" height="600" />
                </clipPath>
              </defs>
              <image href="/images/logo-240.png" x="-25" y="-54" width="220" height="237" transform="rotate(45 85 65)" style={{ filter: 'grayscale(1) brightness(0.45)' }} opacity="0.75" />
              <g clipPath="url(#loader-pot-level)">
                <image href="/images/logo-240.png" x="-25" y="-54" width="220" height="237" transform="rotate(45 85 65)" />
              </g>
            </svg>
          </div>
          <div className="t-display relative whitespace-nowrap text-center leading-none" aria-hidden>
            <span className="text-transparent [-webkit-text-stroke:1px_rgba(242,233,220,0.35)]">{NAME}</span>
            <span ref={fill} className="absolute inset-0 text-caramel" style={{ clipPath: 'inset(100% 0% 0% 0%)' }}>
              {NAME}
            </span>
          </div>
        </div>
        <p className="t-eyebrow mt-6 text-cream/50">Since 1964</p>
      </div>

      <div className="flex items-center justify-between gap-6">
        <div className="relative h-px flex-1 bg-cream/15">
          <div data-loader-line className="absolute inset-0 origin-left scale-x-0 bg-caramel" />
        </div>
        <span ref={count} className="t-eyebrow w-12 text-right tabular-nums text-cream/70">
          0%
        </span>
      </div>
    </div>
  )
}
