import { brands, products } from '../data/products'
import { useFilters } from './Collection'
import { scrollToId } from '../lib/format'

export function Brands() {
  const set = useFilters((s) => s.set)
  const pick = (b: string) => {
    set({ brand: b, family: 'all', query: '' })
    scrollToId('collection')
  }
  const row = [...brands, ...brands]
  return (
    <section id="brands" className="relative border-y border-ivory/10 bg-ink py-20 sm:py-28" aria-labelledby="brands-title">
      <div className="container-lux mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div data-reveal>
          <p className="eyebrow">The houses</p>
          <h2 id="brands-title" className="h-display mt-4 text-5xl sm:text-6xl">
            {brands.length} legendary <em className="text-champagne">maisons</em>
          </h2>
        </div>
        <p data-reveal className="max-w-xs text-xs leading-relaxed text-ivory/45">
          Select a house to view its fragrances. Names are shown as plain wordmarks; all trademarks belong to their
          respective owners.
        </p>
      </div>
      <div className="marquee-wrap relative overflow-hidden" style={{ maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)' }}>
        <ul className="marquee flex w-max items-center">
          {row.map((b, i) => (
            <li key={`${b}-${i}`} aria-hidden={i >= brands.length}>
              <button
                tabIndex={i >= brands.length ? -1 : 0}
                onClick={() => pick(b)}
                className="group flex items-center gap-10 px-10 font-serif text-3xl font-light uppercase tracking-[0.12em] text-ivory/35 transition-colors duration-500 hover:text-champagne sm:text-5xl"
              >
                {b}
                <span className="font-sans text-[10px] tracking-wide2 text-ivory/25 group-hover:text-champagne/70">
                  {products.filter((p) => p.brand === b).length}
                </span>
                <span className="text-champagne/40">✦</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
