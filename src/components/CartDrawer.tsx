import { AnimatePresence, motion } from 'framer-motion'
import { getProduct } from '../data/products'
import { MAX_QTY, linePrice, useCartTotals, useShop, useUI } from '../store/shop'
import { scrollToId, uah } from '../lib/format'
import { site } from '../data/site'
import { Drawer } from './Drawer'
import { BottleImage } from './ProductCard'
import { CloseIcon, MinusIcon, PlusIcon } from './Icons'

export function CartLines({ compact = false }: { compact?: boolean }) {
  const cart = useShop((s) => s.cart)
  const setQty = useShop((s) => s.setQty)
  const remove = useShop((s) => s.remove)
  const open = useUI((s) => s.openProduct)
  const setPanel = useUI((s) => s.setPanel)
  return (
    <ul className="divide-y divide-ivory/10">
      <AnimatePresence initial={false}>
        {cart.map((l) => {
          const p = getProduct(l.id)
          if (!p) return null
          return (
            <motion.li
              key={`${l.id}-${l.ml}`}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="flex gap-4 py-4">
                <button
                  onClick={() => {
                    setPanel(null)
                    open(p.id)
                  }}
                  className={`shrink-0 bg-[#15110e] ${compact ? 'h-16 w-14' : 'h-24 w-20'}`}
                  aria-label={`View ${p.name}`}
                >
                  <BottleImage id={p.id} alt="" />
                </button>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="eyebrow truncate text-[9px]">{p.brand}</p>
                      <p className="truncate font-serif text-lg leading-tight">{p.name}</p>
                      <p className="text-[11px] text-ivory/45">
                        {p.concentration} · {l.ml} ml
                      </p>
                    </div>
                    {!compact && (
                      <button
                        className="text-ivory/40 hover:text-champagne"
                        onClick={() => remove(l.id, l.ml)}
                        aria-label={`Remove ${p.name} ${l.ml} ml`}
                      >
                        <CloseIcon width={16} height={16} />
                      </button>
                    )}
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    {compact ? (
                      <span className="text-xs text-ivory/50">× {l.qty}</span>
                    ) : (
                      <div className="flex items-center border border-ivory/15" role="group" aria-label="Quantity">
                        <button className="icon-btn h-8 w-8" onClick={() => setQty(l.id, l.ml, l.qty - 1)} aria-label="Decrease quantity">
                          <MinusIcon width={14} height={14} />
                        </button>
                        <span className="w-6 text-center text-xs">{l.qty}</span>
                        <button
                          className="icon-btn h-8 w-8"
                          onClick={() => setQty(l.id, l.ml, l.qty + 1)}
                          disabled={l.qty >= MAX_QTY}
                          aria-label="Increase quantity"
                        >
                          <PlusIcon width={14} height={14} />
                        </button>
                      </div>
                    )}
                    <span className="font-serif text-lg text-champagne">{uah(linePrice(l))}</span>
                  </div>
                </div>
              </div>
            </motion.li>
          )
        })}
      </AnimatePresence>
    </ul>
  )
}

export function Totals() {
  const { subtotal, shipping, total } = useCartTotals()
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between text-ivory/60">
        <dt>Subtotal</dt>
        <dd>{uah(subtotal)}</dd>
      </div>
      <div className="flex justify-between text-ivory/60">
        <dt>Delivery</dt>
        <dd>{shipping === 0 ? 'Complimentary' : uah(shipping)}</dd>
      </div>
      <div className="flex justify-between border-t border-ivory/10 pt-3 font-serif text-2xl text-ivory">
        <dt>Total</dt>
        <dd className="text-champagne">{uah(total)}</dd>
      </div>
    </dl>
  )
}

export function CartDrawer() {
  const setPanel = useUI((s) => s.setPanel)
  const { count, subtotal } = useCartTotals()
  const clear = useShop((s) => s.clear)
  const left = site.freeShippingFrom - subtotal

  return (
    <Drawer
      title={`Your Bag${count ? ` (${count})` : ''}`}
      onClose={() => setPanel(null)}
      footer={
        count > 0 ? (
          <div>
            <p className="mb-4 text-[11px] text-ivory/50">
              {left > 0 ? `Add ${uah(left)} more for complimentary delivery.` : 'Your order qualifies for complimentary delivery.'}
            </p>
            <div className="mb-4 h-px bg-ivory/10">
              <div className="h-px bg-champagne transition-all duration-700" style={{ width: `${Math.min(100, (subtotal / site.freeShippingFrom) * 100)}%` }} />
            </div>
            <Totals />
            <button className="btn-gold btn-sweep mt-6 w-full" onClick={() => setPanel('checkout')}>
              Proceed to Checkout
            </button>
            <button className="mt-3 w-full text-[10px] uppercase tracking-wide2 text-ivory/40 hover:text-champagne" onClick={clear}>
              Clear bag
            </button>
          </div>
        ) : undefined
      }
    >
      {count === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <p className="font-serif text-3xl font-light">Your bag is empty</p>
          <p className="mt-3 max-w-xs text-sm text-ivory/50">Explore the collection and find the scent that becomes your signature.</p>
          <button
            className="btn-line mt-8"
            onClick={() => {
              setPanel(null)
              setTimeout(() => scrollToId('collection'), 300)
            }}
          >
            Explore Collection
          </button>
        </div>
      ) : (
        <CartLines />
      )}
    </Drawer>
  )
}
