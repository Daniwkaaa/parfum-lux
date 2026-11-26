import { useEffect, useMemo, useState } from 'react'
import { plural } from '../lib/plural'
import { AnimatePresence, motion } from 'framer-motion'
import { brands, minPrice, products, type Family } from '../data/products'
import { ProductCard } from './ProductCard'
import { SearchIcon, CloseIcon } from './Icons'
import { create } from 'zustand'

const FAMILIES: { id: Family | 'all'; label: string }[] = [
  { id: 'all', label: 'Усі' },
  { id: 'fresh', label: 'Свіжі' },
  { id: 'sweet', label: 'Солодкі' },
  { id: 'woody', label: 'Деревні' },
  { id: 'spicy', label: 'Пряні' },
  { id: 'floral', label: 'Квіткові' },
]

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'name'

interface FilterState {
  family: Family | 'all'
  brand: string
  sort: Sort
  query: string
  set: (p: Partial<Omit<FilterState, 'set'>>) => void
}

export const useFilters = create<FilterState>((set) => ({
  family: 'all',
  brand: 'all',
  sort: 'featured',
  query: '',
  set: (p) => set(p),
}))

export const matchesQuery = (q: string, p: (typeof products)[number]) => {
  const s = q.trim().toLowerCase()
  if (!s) return true
  const hay = [p.brand, p.name, p.family, ...p.notes.top, ...p.notes.heart, ...p.notes.base].join(' ').toLowerCase()
  return s.split(/\s+/).every((w) => hay.includes(w))
}

export function Collection() {
  const { family, brand, sort, query, set } = useFilters()

  const list = useMemo(() => {
    const r = products.filter(
      (p) =>
        (family === 'all' || p.tags.families.includes(family)) &&
        (brand === 'all' || p.brand === brand) &&
        matchesQuery(query, p),
    )
    if (sort === 'price-asc') r.sort((a, b) => minPrice(a) - minPrice(b))
    if (sort === 'price-desc') r.sort((a, b) => minPrice(b) - minPrice(a))
    if (sort === 'name') r.sort((a, b) => a.name.localeCompare(b.name))
    return r
  }, [family, brand, sort, query])

  const filtered = family !== 'all' || brand !== 'all' || query !== ''

  // show the catalogue in pages so 50 flacons never flood the page
  const PAGE = 12
  const [shown, setShown] = useState(PAGE)
  useEffect(() => setShown(PAGE), [family, brand, sort, query])
  const visible = list.slice(0, shown)
  const rest = list.length - visible.length

  return (
    <section id="collection" className="relative bg-ink py-24 sm:py-32" aria-labelledby="collection-title">
      <div className="container-lux">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div data-reveal>
            <p className="eyebrow">Колекція · {products.length} {plural(products.length, ['аромат', 'аромати', 'ароматів'])}</p>
            <h2 id="collection-title" className="h-display mt-5 text-6xl sm:text-7xl lg:text-8xl">
              Обрані <em className="text-champagne">ікони</em>
            </h2>
          </div>
          <p data-reveal className="max-w-md text-sm leading-relaxed text-ivory/55">
            П’ятдесят культових ароматів від люксових і нішевих домів, що визначають сучасну парфумерію. Обертайте
            й наближайте кожен флакон у нашому 3D-шоурумі, перш ніж зробити вибір.
          </p>
        </div>

        {/* Filters */}
        <div data-reveal className="mt-14 flex flex-col gap-5 border-y border-ivory/10 py-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Фільтр за групою ароматів">
            {FAMILIES.map((f) => (
              <button
                key={f.id}
                onClick={() => set({ family: f.id })}
                aria-pressed={family === f.id}
                className={`chip shrink-0 ${family === f.id ? 'chip-active' : ''}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-center">
            <label className="relative flex items-center">
              <SearchIcon width={16} height={16} className="pointer-events-none absolute left-0 text-ivory/40" />
              <input
                value={query}
                onChange={(e) => set({ query: e.target.value })}
                placeholder="Назва, бренд або нота"
                className="field min-w-[220px] py-2 pl-7 pr-6"
                aria-label="Пошук у колекції"
              />
              {query && (
                <button onClick={() => set({ query: '' })} className="absolute right-0 text-ivory/50 hover:text-champagne" aria-label="Очистити пошук">
                  <CloseIcon width={14} height={14} />
                </button>
              )}
            </label>
            <select
              value={brand}
              onChange={(e) => set({ brand: e.target.value })}
              className="field cursor-pointer bg-ink py-2 pr-2 text-xs uppercase tracking-wide2"
              aria-label="Фільтр за брендом"
            >
              <option value="all">Усі бренди</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => set({ sort: e.target.value as Sort })}
              className="field cursor-pointer bg-ink py-2 pr-2 text-xs uppercase tracking-wide2"
              aria-label="Сортування"
            >
              <option value="featured">Рекомендовані</option>
              <option value="price-asc">Ціна: за зростанням</option>
              <option value="price-desc">Ціна: за спаданням</option>
              <option value="name">Назва: A–Z</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex min-h-6 items-center justify-between text-[10px] uppercase tracking-wide2 text-ivory/40">
          <span aria-live="polite">Знайдено: {list.length}</span>
          {filtered && (
            <button
              onClick={() => set({ family: 'all', brand: 'all', query: '' })}
              className="text-champagne hover:text-champagne-light"
            >
              Скинути фільтри
            </button>
          )}
        </div>

        <motion.div layout className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-7">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i % PAGE} />
            ))}
          </AnimatePresence>
        </motion.div>
        {rest > 0 && (
          <div className="mt-14 flex flex-col items-center gap-4">
            <p className="text-[10px] uppercase tracking-wide2 text-ivory/40">
              Показано {visible.length} з {list.length}
            </p>
            <div className="h-px w-48 bg-ivory/10">
              <div className="h-px bg-champagne transition-all duration-700" style={{ width: `${(visible.length / list.length) * 100}%` }} />
            </div>
            <button className="btn-line mt-2" onClick={() => setShown((s) => s + PAGE)}>
              Показати ще {Math.min(PAGE, rest)}
            </button>
          </div>
        )}
        {list.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-serif text-3xl font-light">Жоден аромат не відповідає вибраним параметрам.</p>
            <button onClick={() => set({ family: 'all', brand: 'all', query: '' })} className="btn-line mt-8">
              Показати всі аромати
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
