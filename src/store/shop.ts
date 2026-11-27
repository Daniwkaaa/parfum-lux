import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getProduct } from '../data/products'
import { allSizes } from '../data/meta'

export interface CartLine {
  id: string
  ml: number
  qty: number
}

const safeStorage = createJSONStorage(() => {
  try {
    const k = '__pl_test__'
    localStorage.setItem(k, k)
    localStorage.removeItem(k)
    return localStorage
  } catch {
    const mem = new Map<string, string>()
    return {
      getItem: (n: string) => mem.get(n) ?? null,
      setItem: (n: string, v: string) => void mem.set(n, v),
      removeItem: (n: string) => void mem.delete(n),
    }
  }
})

export const MAX_QTY = 10

interface ShopState {
  cart: CartLine[]
  wishlist: string[]
  add: (id: string, ml: number, qty?: number) => void
  setQty: (id: string, ml: number, qty: number) => void
  remove: (id: string, ml: number) => void
  clear: () => void
  toggleWish: (id: string) => void
}

export const useShop = create<ShopState>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      add: (id, ml, qty = 1) =>
        set((s) => {
          const ex = s.cart.find((l) => l.id === id && l.ml === ml)
          if (ex)
            return {
              cart: s.cart.map((l) =>
                l === ex ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l,
              ),
            }
          return { cart: [...s.cart, { id, ml, qty: Math.min(MAX_QTY, qty) }] }
        }),
      setQty: (id, ml, qty) =>
        set((s) => ({
          cart:
            qty <= 0
              ? s.cart.filter((l) => !(l.id === id && l.ml === ml))
              : s.cart.map((l) =>
                  l.id === id && l.ml === ml ? { ...l, qty: Math.min(MAX_QTY, qty) } : l,
                ),
        })),
      remove: (id, ml) => set((s) => ({ cart: s.cart.filter((l) => !(l.id === id && l.ml === ml)) })),
      clear: () => set({ cart: [] }),
      toggleWish: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id) ? s.wishlist.filter((w) => w !== id) : [...s.wishlist, id],
        })),
    }),
    { name: 'elixir-shop', storage: safeStorage, version: 1 },
  ),
)

export const linePrice = (l: CartLine) => {
  const p = getProduct(l.id)
  const s = p ? allSizes(p).find((x) => x.ml === l.ml) : undefined
  return (s?.price ?? 0) * l.qty
}

export const useCartTotals = () => {
  const cart = useShop((s) => s.cart)
  const count = cart.reduce((a, l) => a + l.qty, 0)
  const subtotal = cart.reduce((a, l) => a + linePrice(l), 0)
  const shipping = subtotal === 0 || subtotal >= 5000 ? 0 : 150
  return { count, subtotal, shipping, total: subtotal + shipping }
}

type Panel = null | 'cart' | 'wishlist' | 'search' | 'checkout' | 'menu'
type Policy = null | 'privacy' | 'delivery' | 'payment'

interface UIState {
  product: string | null
  panel: Panel
  policy: Policy
  toast: { id: number; text: string } | null
  openProduct: (id: string | null) => void
  setPanel: (p: Panel) => void
  setPolicy: (p: Policy) => void
  notify: (text: string) => void
}

export const useUI = create<UIState>((set) => ({
  product: null,
  panel: null,
  policy: null,
  toast: null,
  openProduct: (product) => set({ product }),
  setPanel: (panel) => set({ panel }),
  setPolicy: (policy) => set({ policy }),
  notify: (text) => {
    const id = Date.now()
    set({ toast: { id, text } })
    setTimeout(() => set((s) => (s.toast?.id === id ? { toast: null } : s)), 2600)
  },
}))
