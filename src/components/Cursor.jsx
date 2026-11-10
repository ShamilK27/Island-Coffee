import { useEffect, useRef, useState } from 'react'
import { gsap, isTouch, prefersReducedMotion } from '../motion/gsap'
import { stage } from '../motion/stage'

/**
 * Desktop-only custom cursor: a small roasted coffee bean that tilts with the
 * pointer's movement. Over links and buttons it grows a little; over anything
 * marked data-cursor="Label" it swells into a caramel label pill.
 * Also feeds normalised pointer coordinates to the 3D stage.
 */
export function Cursor() {
  const bean = useRef(null)
  const pill = useRef(null)
  const [label, setLabel] = useState('')
  const [enabled] = useState(() => !isTouch() && !prefersReducedMotion())

  useEffect(() => {
    const onMove = (e) => {
      stage.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      stage.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    if (!enabled) return () => window.removeEventListener('pointermove', onMove)

    document.documentElement.classList.add('has-cursor')
    gsap.set([bean.current, pill.current], { xPercent: -50, yPercent: -50, x: -100, y: -100 })
    gsap.set(pill.current, { scale: 0.2, autoAlpha: 0 })
    const bx = gsap.quickTo(bean.current, 'x', { duration: 0.12, ease: 'power3' })
    const by = gsap.quickTo(bean.current, 'y', { duration: 0.12, ease: 'power3' })
    const px = gsap.quickTo(pill.current, 'x', { duration: 0.35, ease: 'power3' })
    const py = gsap.quickTo(pill.current, 'y', { duration: 0.35, ease: 'power3' })
    const tilt = gsap.quickTo(bean.current, 'rotation', { duration: 0.5, ease: 'power3' })

    let lastX = null
    let settle
    const move = (e) => {
      bx(e.clientX)
      by(e.clientY)
      px(e.clientX)
      py(e.clientY)
      // the bean leans into horizontal movement, then rights itself
      if (lastX !== null) tilt(gsap.utils.clamp(-40, 40, (e.clientX - lastX) * 3))
      lastX = e.clientX
      clearTimeout(settle)
      settle = setTimeout(() => tilt(0), 120)
    }
    const over = (e) => {
      const target = e.target.closest?.('[data-cursor], a, button')
      const text = target?.dataset?.cursor ?? ''
      setLabel(text)
      gsap.to(bean.current, { scale: text ? 0 : target ? 1.45 : 1, duration: 0.4, ease: 'expo.out' })
      gsap.to(pill.current, { scale: text ? 1 : 0.2, autoAlpha: text ? 1 : 0, duration: 0.45, ease: 'expo.out' })
    }
    const leaveWin = () => gsap.to([bean.current, pill.current], { autoAlpha: 0, duration: 0.3 })
    const enterWin = () => gsap.to(bean.current, { autoAlpha: 1, duration: 0.3 })

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over)
    document.addEventListener('pointerleave', leaveWin)
    document.addEventListener('pointerenter', enterWin)
    return () => {
      clearTimeout(settle)
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointerleave', leaveWin)
      document.removeEventListener('pointerenter', enterWin)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div
        ref={pill}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] whitespace-nowrap rounded-full bg-caramel px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-espresso"
      >
        {label}
      </div>
      <svg
        ref={bean}
        aria-hidden
        viewBox="0 0 22 28"
        className="pointer-events-none fixed left-0 top-0 z-[91] h-[22px] w-[17px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
      >
        <ellipse cx="11" cy="14" rx="9.5" ry="13" fill="#b87945" />
        <ellipse cx="11" cy="14" rx="9.5" ry="13" fill="none" stroke="#7a4423" strokeWidth="1" />
        <path d="M11 2.5 C5.5 10 16.5 18 11 25.5" stroke="#3b2014" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    </>
  )
}
