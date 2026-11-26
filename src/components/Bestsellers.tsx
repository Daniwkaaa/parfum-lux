import { products, minPrice } from '../data/products'
import { useUI } from '../store/shop'
import { uah } from '../lib/format'
import { BottleImage } from './ProductCard'
import { ArrowIcon } from './Icons'

export function Bestsellers() {
  const open = useUI((s) => s.openProduct)
  const list = products.filter((p) => p.bestseller).slice(0, 6)
  return (
    <section id="bestsellers" className="relative overflow-hidden bg-ivory py-24 text-ink sm:py-32" aria-labelledby="best-title">
      <div className="container-lux">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div data-reveal>
            <p className="eyebrow text-champagne-dark">Бестселери</p>
            <h2 id="best-title" className="h-display mt-5 text-5xl sm:text-7xl lg:text-8xl">
              Найпопулярніші <em className="text-champagne-dark">аромати</em>
            </h2>
          </div>
          <p data-reveal className="max-w-sm text-sm leading-relaxed text-ink/60">
            Аромати, до яких наші клієнти повертаються сезон за сезоном, — за характер, стійкість і компліменти,
            що їх супроводжують.
          </p>
        </div>

        <ol data-reveal-stagger className="mt-16 divide-y divide-ink/10 border-y border-ink/10">
          {list.map((p, i) => (
            <li key={p.id}>
              <button
                onClick={() => open(p.id)}
                className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 py-5 text-left transition-colors duration-500 hover:bg-ink hover:text-ivory sm:grid-cols-[80px_120px_1fr_auto_auto] sm:gap-8 sm:px-6"
                aria-label={`${p.brand} ${p.name} — детальніше`}
              >
                <span className="font-serif text-3xl font-light text-champagne-dark group-hover:text-champagne sm:text-5xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="hidden h-28 overflow-hidden bg-[#15110e] sm:block">
                  <BottleImage id={p.id} alt="" className="transition-transform duration-700 ease-luxe group-hover:scale-110" />
                </span>
                <span>
                  <span className="eyebrow block text-[9px] text-champagne-dark group-hover:text-champagne">{p.brand}</span>
                  <span className="mt-1 block font-serif text-2xl font-light sm:text-4xl">{p.name}</span>
                  <span className="mt-1 hidden text-xs text-ink/50 group-hover:text-ivory/50 md:block">{p.short}</span>
                  <span className="mt-1 block font-serif text-lg sm:hidden">{uah(minPrice(p))}</span>
                </span>
                <span className="hidden font-serif text-xl sm:block">{uah(minPrice(p))}</span>
                <ArrowIcon className="transition-transform duration-500 group-hover:translate-x-2" />
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
