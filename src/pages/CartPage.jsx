import { useLayoutEffect, useRef } from 'react'
import { ArrowLeft, ArrowUpRight, Minus, Phone, Plus, X } from 'lucide-react'
import { gsap, EASE, prefersReducedMotion } from '../motion/gsap'
import { OrderProvider, useOrder } from '../components/OrderContext'
import { Logo } from '../components/Nav'
import { Cursor } from '../components/Cursor'
import { Magnetic } from '../components/Magnetic'
import { CONTACT, SHOP_URL, lkr } from '../data/content'

const MENU_URL = '/#menu'

/** Standalone cart page (/cart/). Shares the persisted cart with the film. */
export function CartPage() {
  return (
    <OrderProvider toasts={false}>
      <Header />
      <Cart />
      <Cursor />
      <div className="grain" aria-hidden />
    </OrderProvider>
  )
}

function Header() {
  const { count } = useOrder()
  return (
    <header className="flex items-center justify-between px-5 py-4 md:px-10 md:py-6">
      <a href="/" aria-label="Island Coffee, home">
        <Logo />
      </a>
      <a href={MENU_URL} className="t-eyebrow link-line flex items-center gap-2 pb-1 text-[0.62rem] text-cream/70 hover:text-cream">
        <ArrowLeft size={13} /> <span className="hidden sm:inline">Continue shopping</span>
        <span className="sm:hidden">Shop</span>
      </a>
      <span className="sr-only" aria-live="polite">
        {count} {count === 1 ? 'item' : 'items'} in your cart
      </span>
    </header>
  )
}

function Cart() {
  const root = useRef(null)
  const { lines, count, total, setQty, remove, clear } = useOrder()
  const empty = lines.length === 0

  // Entrance
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('[data-in]', { y: 40, autoAlpha: 0, stagger: 0.07, duration: 1.1, ease: EASE.out, delay: 0.1 })
    }, root)
    return () => ctx.revert()
  }, [empty])

  return (
    <main ref={root} className="mx-auto max-w-[1400px] px-5 pb-24 pt-10 md:px-10 md:pt-16">
      <p data-in className="t-eyebrow mb-5 text-caramel">
        Your cart · {count} {count === 1 ? 'item' : 'items'}
      </p>
      <h1 data-in className="t-display mb-12 md:mb-16">
        {empty ? (
          <>
            Nothing <em className="italic text-caramel">brewing</em> yet.
          </>
        ) : (
          <>
            Your <em className="italic text-caramel">cart</em>.
          </>
        )}
      </h1>

      {empty ? (
        <div data-in className="flex flex-col items-start gap-8 border-t border-cream/10 pt-10 md:flex-row md:items-center md:justify-between">
          <p className="t-lead max-w-md text-cream/70">Pick a powder, a flavour and a pack size from the collection, and it will wait for you here.</p>
          <Magnetic>
            <a href={MENU_URL} className="btn btn-solid" data-cursor="Shop">
              <span>Browse the collection</span>
              <ArrowUpRight size={14} />
            </a>
          </Magnetic>
        </div>
      ) : (
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Lines */}
          <section aria-label="Items in your cart" className="lg:col-span-7">
            <ul className="border-t border-cream/10">
              {lines.map((l) => (
                <li data-in key={l.id} className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-cream/10 py-6 sm:grid-cols-[7rem_1fr_auto] sm:gap-6">
                  <div className="row-span-2 grid aspect-square place-items-center rounded-2xl bg-roast p-3 sm:row-span-1">
                    {l.pack && <img src={l.pack} alt="" loading="lazy" className="max-h-full max-w-full object-contain drop-shadow-[0_12px_14px_rgba(0,0,0,0.5)]" />}
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-display text-2xl leading-tight md:text-3xl">
                      {l.url ? (
                        <a href={l.url} target="_blank" rel="noreferrer" className="link-line">
                          {l.name}
                        </a>
                      ) : (
                        l.name
                      )}
                    </h2>
                    <p className="mt-1 text-sm text-cream/55">
                      {l.size} · {lkr(l.price)} each
                    </p>

                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center rounded-full border border-cream/20" role="group" aria-label={`Quantity of ${l.name}, ${l.size}`}>
                        <button type="button" onClick={() => setQty(l.id, l.qty - 1)} aria-label="Decrease quantity" className="grid size-10 place-items-center rounded-full transition-colors hover:text-caramel">
                          <Minus size={14} />
                        </button>
                        <span className="w-7 text-center text-sm tabular-nums" aria-live="polite">
                          {l.qty}
                        </span>
                        <button type="button" onClick={() => setQty(l.id, l.qty + 1)} aria-label="Increase quantity" className="grid size-10 place-items-center rounded-full transition-colors hover:text-caramel">
                          <Plus size={14} />
                        </button>
                      </div>
                      <button type="button" onClick={() => remove(l.id)} className="link-line flex items-center gap-1.5 text-xs text-cream/50 hover:text-cream" aria-label={`Remove ${l.name}, ${l.size}`}>
                        <X size={12} /> Remove
                      </button>
                    </div>
                  </div>

                  <p className="col-start-2 font-display text-xl tabular-nums sm:col-start-3 sm:text-right sm:text-2xl">{lkr(l.price * l.qty)}</p>
                </li>
              ))}
            </ul>
            <button data-in type="button" onClick={clear} className="link-line mt-6 text-xs text-cream/45 hover:text-cream">
              Empty the cart
            </button>
          </section>

          {/* Summary */}
          <aside data-in aria-label="Order summary" className="lg:col-span-5">
            <div className="rounded-[28px] bg-roast p-6 md:p-8 lg:sticky lg:top-8">
              <h2 className="t-eyebrow mb-6 text-cream/60">Summary</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-cream/60">Items</dt>
                  <dd className="tabular-nums">{count}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-cream/60">Delivery</dt>
                  <dd className="text-cream/60">Confirmed with your order</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-cream/10 pt-5">
                  <dt className="t-eyebrow">Subtotal</dt>
                  <dd className="font-display text-4xl tabular-nums">{lkr(total)}</dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-col gap-3">
                <a href={`tel:${CONTACT.phoneHref}`} className="btn btn-solid w-full justify-center" data-cursor="Call">
                  <Phone size={14} />
                  <span>Order by phone · {CONTACT.phone}</span>
                </a>
                <a href={SHOP_URL} target="_blank" rel="noreferrer" className="btn btn-ghost w-full justify-center" data-cursor="Shop">
                  <span>Checkout on islandcoffee.lk</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-cream/45">
                Payment isn’t taken on this page. Call the store to place your order, or add the same items in the Island Coffee online shop to pay there.
              </p>
            </div>
          </aside>
        </div>
      )}
    </main>
  )
}
