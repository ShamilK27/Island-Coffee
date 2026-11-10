import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Check } from 'lucide-react'

const OrderCtx = createContext(null)
const KEY = 'island-coffee-cart'
export const CART_URL = '/cart/'

const load = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(v) ? v.filter((l) => l && l.id && l.qty > 0) : []
  } catch {
    return []
  }
}

/**
 * Front-end cart shared by the film and the /cart/ page. Lines are
 * { id, name, size, price, pack, url, qty } and persist in localStorage, so
 * the bag survives a reload and stays in sync across tabs. No network.
 */
export function OrderProvider({ children, toasts = true }) {
  const [lines, setLines] = useState(load)
  const [toast, setToast] = useState(null)
  const timer = useRef()

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines))
    } catch {
      /* storage blocked: the cart still works for this visit */
    }
  }, [lines])

  useEffect(() => {
    const onStorage = (e) => e.key === KEY && setLines(load())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const add = useCallback((product) => {
    setLines((list) => {
      const hit = list.find((l) => l.id === product.id)
      if (hit) return list.map((l) => (l === hit ? { ...l, qty: l.qty + 1 } : l))
      return [...list, { ...product, qty: 1 }]
    })
    setToast({ id: Date.now(), name: `${product.name} · ${product.size}` })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  const setQty = useCallback((id, qty) => {
    setLines((list) => (qty < 1 ? list.filter((l) => l.id !== id) : list.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, 99) } : l))))
  }, [])

  const remove = useCallback((id) => setLines((list) => list.filter((l) => l.id !== id)), [])
  const clear = useCallback(() => setLines([]), [])

  const value = useMemo(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((sum, l) => sum + l.price * l.qty, 0),
      add,
      setQty,
      remove,
      clear,
    }),
    [lines, add, setQty, remove, clear],
  )

  return (
    <OrderCtx.Provider value={value}>
      {children}
      {toasts && (
        <div aria-live="polite" className="pointer-events-none fixed bottom-6 left-1/2 z-[70] w-max max-w-[calc(100vw-32px)] -translate-x-1/2">
          {toast && (
            <div
              key={toast.id}
              className="pointer-events-auto flex items-center gap-3 rounded-full bg-cream py-2.5 pl-3 pr-2.5 text-sm text-espresso shadow-2xl shadow-black/40 [animation:toast_3.2s_var(--ease-out-expo)_both]"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-caramel text-espresso">
                <Check size={14} strokeWidth={2.5} />
              </span>
              <span className="min-w-0 truncate">
                <strong className="font-semibold">{toast.name}</strong> added
              </span>
              <a href={CART_URL} className="shrink-0 rounded-full bg-espresso px-3.5 py-1.5 text-xs font-semibold text-cream" data-cursor="Cart">
                View cart
              </a>
            </div>
          )}
        </div>
      )}
      <style>{`@keyframes toast{0%{opacity:0;transform:translateY(20px) scale(.96)}10%{opacity:1;transform:none}88%{opacity:1;transform:none}100%{opacity:0;transform:translateY(10px)}}`}</style>
    </OrderCtx.Provider>
  )
}

// eslint-disable-next-line react/only-export-components
export const useOrder = () => useContext(OrderCtx)
