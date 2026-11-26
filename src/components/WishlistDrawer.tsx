import { getProduct, minPrice } from '../data/products'
import { useShop, useUI } from '../store/shop'
import { scrollToId, uah } from '../lib/format'
import { Drawer } from './Drawer'
import { BottleImage } from './ProductCard'
import { CloseIcon } from './Icons'

export function WishlistDrawer() {
  const { setPanel, openProduct, notify } = useUI()
  const wishlist = useShop((s) => s.wishlist)
  const toggle = useShop((s) => s.toggleWish)
  const add = useShop((s) => s.add)

  return (
    <Drawer title="Обране" onClose={() => setPanel(null)}>
      {wishlist.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <p className="font-serif text-3xl font-light">Тут поки порожньо</p>
          <p className="mt-3 max-w-xs text-sm text-ivory/50">Натисніть на сердечко біля будь-якого аромату, щоб зберегти його тут.</p>
          <button
            className="btn-line mt-8"
            onClick={() => {
              setPanel(null)
              setTimeout(() => scrollToId('collection'), 300)
            }}
          >
            Переглянути аромати
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-ivory/10">
          {wishlist.map((id) => {
            const p = getProduct(id)
            if (!p) return null
            return (
              <li key={id} className="flex gap-4 py-4">
                <button
                  className="h-24 w-20 shrink-0 bg-[#15110e]"
                  onClick={() => {
                    setPanel(null)
                    openProduct(id)
                  }}
                  aria-label={`Переглянути ${p.name}`}
                >
                  <BottleImage id={id} alt="" />
                </button>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="eyebrow text-[9px]">{p.brand}</p>
                      <p className="font-serif text-lg leading-tight">{p.name}</p>
                      <p className="text-sm text-champagne">від {uah(minPrice(p))}</p>
                    </div>
                    <button className="text-ivory/40 hover:text-champagne" onClick={() => toggle(id)} aria-label={`Видалити ${p.name} з обраного`}>
                      <CloseIcon width={16} height={16} />
                    </button>
                  </div>
                  <button
                    className="mt-auto self-start text-[10px] font-semibold uppercase tracking-wide2 text-champagne hover:text-champagne-light"
                    onClick={() => {
                      add(id, p.sizes[0].ml)
                      notify(`${p.name} · ${p.sizes[0].ml} мл додано до кошика`)
                    }}
                  >
                    + Додати {p.sizes[0].ml} мл до кошика
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Drawer>
  )
}
