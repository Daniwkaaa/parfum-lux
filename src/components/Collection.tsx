import { useEffect, useMemo, useState } from 'react'
import { plural } from '../lib/plural'
import { AnimatePresence, motion } from 'framer-motion'
import { brands, minPrice, products, type Family, type Product, type Season } from '../data/products'
import { allNotes, genderOf, GENDER_LABEL, type Gender } from '../data/meta'
import { accordById, hasAccord, WHEEL } from '../lib/accords'
import { uah } from '../lib/format'
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

const GENDERS: { id: Gender | 'all'; label: string }[] = [
  { id: 'all', label: 'Усі' },
  { id: 'her', label: 'Для неї' },
  { id: 'him', label: 'Для нього' },
  { id: 'unisex', label: 'Унісекс' },
]

const SEASONS: Season[] = ['Весна', 'Літо', 'Осінь', 'Зима']

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'name'

const PRICES = products.map(minPrice)
export const PRICE_MIN = Math.floor(Math.min(...PRICES) / 500) * 500
export const PRICE_MAX = Math.ceil(Math.max(...PRICES) / 500) * 500

/** All notes, most frequent first — feeds the note autocomplete. */
const NOTE_INDEX = (() => {
  const m = new Map<string, number>()
  products.forEach((p) => allNotes(p).forEach((n) => m.set(n, (m.get(n) ?? 0) + 1)))
  return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([n]) => n)
})()

interface FilterValues {
  family: Family | 'all'
  gender: Gender | 'all'
  brand: string
  sort: Sort
  query: string
  priceMin: number
  priceMax: number
  seasons: Season[]
  notes: string[]
  accord: string | null
}
interface FilterState extends FilterValues {
  set: (p: Partial<FilterValues>) => void
  reset: () => void
}

const DEFAULTS: FilterValues = {
  family: 'all',
  gender: 'all',
  brand: 'all',
  sort: 'featured',
  query: '',
  priceMin: PRICE_MIN,
  priceMax: PRICE_MAX,
  seasons: [],
  notes: [],
  accord: null,
}

export const useFilters = create<FilterState>((set) => ({
  ...DEFAULTS,
  set: (p) => set(p),
  reset: () => set({ ...DEFAULTS }),
}))

export const matchesQuery = (q: string, p: (typeof products)[number]) => {
  const s = q.trim().toLowerCase()
  if (!s) return true
  const hay = [p.brand, p.name, p.family, ...p.notes.top, ...p.notes.heart, ...p.notes.base].join(' ').toLowerCase()
  return s.split(/\s+/).every((w) => hay.includes(w))
}

export function matchesFilters(p: Product, f: FilterValues) {
  const price = minPrice(p)
  const notes = allNotes(p).map((n) => n.toLowerCase())
  return (
    (f.family === 'all' || p.tags.families.includes(f.family)) &&
    (f.gender === 'all' || genderOf(p) === f.gender) &&
    (f.brand === 'all' || p.brand === f.brand) &&
    price >= f.priceMin &&
    price <= f.priceMax &&
    f.seasons.every((s) => p.characteristics.seasons.includes(s)) &&
    f.notes.every((n) => notes.some((x) => x.includes(n.toLowerCase()))) &&
    (!f.accord || hasAccord(p, f.accord)) &&
    matchesQuery(f.query, p)
  )
}

/* ---------------- price range (two thumbs) ---------------- */
function PriceRange() {
  const { priceMin, priceMax, set } = useFilters()
  const step = 500
  const pct = (v: number) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-wide2 text-ivory/50">Ціна флакона</span>
        <span className="font-serif text-lg text-champagne">
          {uah(priceMin)} — {uah(priceMax)}
        </span>
      </div>
      <div className="range-dual relative mt-5 h-6">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ivory/15" />
        <div
          className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-champagne"
          style={{ left: `${pct(priceMin)}%`, right: `${100 - pct(priceMax)}%` }}
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={step}
          value={priceMin}
          onChange={(e) => set({ priceMin: Math.min(Number(e.target.value), priceMax - step) })}
          aria-label="Мінімальна ціна"
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={step}
          value={priceMax}
          onChange={(e) => set({ priceMax: Math.max(Number(e.target.value), priceMin + step) })}
          aria-label="Максимальна ціна"
        />
      </div>
    </div>
  )
}

/* ---------------- note autocomplete ---------------- */
function NotePicker() {
  const { notes, set } = useFilters()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [hi, setHi] = useState(0)
  const options = useMemo(() => {
    const s = q.trim().toLowerCase()
    return NOTE_INDEX.filter((n) => !notes.includes(n) && (!s || n.toLowerCase().includes(s))).slice(0, 8)
  }, [q, notes])
  const add = (n: string) => {
    set({ notes: [...notes, n] })
    setQ('')
    setHi(0)
  }
  return (
    <div className="relative">
      <label htmlFor="note-picker" className="text-[10px] uppercase tracking-wide2 text-ivory/50">
        Нота в складі
      </label>
      <input
        id="note-picker"
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setOpen(true)
          setHi(0)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => Math.min(options.length - 1, h + 1)) }
          if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(0, h - 1)) }
          if (e.key === 'Enter' && options[hi]) { e.preventDefault(); add(options[hi]) }
        }}
        placeholder="Почніть вводити: уд, ваніль, ірис…"
        className="field py-2"
        role="combobox"
        aria-expanded={open && options.length > 0}
        aria-controls="note-options"
        autoComplete="off"
      />
      <AnimatePresence>
        {open && options.length > 0 && (
          <motion.ul
            id="note-options"
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-auto border border-ivory/10 bg-ink-700 py-1 shadow-2xl"
            data-lenis-prevent
          >
            {options.map((n, i) => (
              <li key={n} role="option" aria-selected={i === hi}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => add(n)}
                  onMouseEnter={() => setHi(i)}
                  className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm ${i === hi ? 'bg-champagne/10 text-champagne' : 'text-ivory/80'}`}
                >
                  {n}
                  <span className="text-[10px] text-ivory/35">
                    {products.filter((p) => allNotes(p).includes(n)).length}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------------- active filter chips ---------------- */
function ActiveChips() {
  const f = useFilters()
  const chips: { key: string; label: string; clear: () => void }[] = []
  if (f.gender !== 'all') chips.push({ key: 'g', label: GENDER_LABEL[f.gender], clear: () => f.set({ gender: 'all' }) })
  if (f.family !== 'all') chips.push({ key: 'f', label: FAMILIES.find((x) => x.id === f.family)!.label, clear: () => f.set({ family: 'all' }) })
  if (f.brand !== 'all') chips.push({ key: 'b', label: f.brand, clear: () => f.set({ brand: 'all' }) })
  if (f.accord) chips.push({ key: 'a', label: `Акорд: ${accordById(f.accord)?.label}`, clear: () => f.set({ accord: null }) })
  if (f.priceMin !== PRICE_MIN || f.priceMax !== PRICE_MAX)
    chips.push({ key: 'p', label: `${uah(f.priceMin)} — ${uah(f.priceMax)}`, clear: () => f.set({ priceMin: PRICE_MIN, priceMax: PRICE_MAX }) })
  f.seasons.forEach((s) => chips.push({ key: 's' + s, label: s, clear: () => f.set({ seasons: f.seasons.filter((x) => x !== s) }) }))
  f.notes.forEach((n) => chips.push({ key: 'n' + n, label: `Нота: ${n}`, clear: () => f.set({ notes: f.notes.filter((x) => x !== n) }) }))
  if (f.query) chips.push({ key: 'q', label: `«${f.query}»`, clear: () => f.set({ query: '' }) })
  if (!chips.length) return null
  return (
    <motion.div layout className="flex flex-wrap items-center gap-2">
      <AnimatePresence>
        {chips.map((c) => (
          <motion.button
            key={c.key}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={c.clear}
            className="group flex items-center gap-2 rounded-full border border-champagne/40 bg-champagne/10 py-1.5 pl-3 pr-2 text-xs text-champagne-light hover:border-champagne"
            aria-label={`Прибрати фільтр: ${c.label}`}
          >
            {c.label}
            <CloseIcon width={12} height={12} className="opacity-60 group-hover:opacity-100" />
          </motion.button>
        ))}
      </AnimatePresence>
      <button onClick={f.reset} className="ml-1 text-[10px] uppercase tracking-wide2 text-ivory/50 hover:text-champagne">
        Скинути все
      </button>
    </motion.div>
  )
}

export function Collection() {
  const f = useFilters()
  const { family, gender, brand, sort, query, seasons, notes, accord, priceMin, priceMax, set } = f
  const [more, setMore] = useState(false)

  const list = useMemo(() => {
    const r = products.filter((p) => matchesFilters(p, f))
    if (sort === 'price-asc') r.sort((a, b) => minPrice(a) - minPrice(b))
    if (sort === 'price-desc') r.sort((a, b) => minPrice(b) - minPrice(a))
    if (sort === 'name') r.sort((a, b) => a.name.localeCompare(b.name))
    return r
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [family, gender, brand, sort, query, seasons, notes, accord, priceMin, priceMax])

  const advancedCount =
    seasons.length + notes.length + (accord ? 1 : 0) + (priceMin !== PRICE_MIN || priceMax !== PRICE_MAX ? 1 : 0)

  // open the advanced panel automatically when something (e.g. the wheel) sets an accord
  useEffect(() => {
    if (accord) setMore(true)
  }, [accord])

  // show the catalogue in pages so 50 flacons never flood the page
  const PAGE = 12
  const [shown, setShown] = useState(PAGE)
  useEffect(() => setShown(PAGE), [family, gender, brand, sort, query, seasons, notes, accord, priceMin, priceMax])
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

        {/* Gender switch */}
        <div data-reveal className="mt-14 flex justify-center sm:justify-start">
          <div className="relative inline-flex rounded-full border border-ivory/15 p-1" role="radiogroup" aria-label="Для кого">
            {GENDERS.map((g) => (
              <button
                key={g.id}
                role="radio"
                aria-checked={gender === g.id}
                onClick={() => set({ gender: g.id })}
                className={`relative z-10 rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-wide2 transition-colors duration-300 sm:px-6 ${
                  gender === g.id ? 'text-ink' : 'text-ivory/60 hover:text-ivory'
                }`}
              >
                {gender === g.id && (
                  <motion.span layoutId="gender-pill" className="absolute inset-0 -z-10 rounded-full bg-champagne" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div data-reveal className="mt-6 flex flex-col gap-5 border-y border-ivory/10 py-5">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Фільтр за групою ароматів">
            {FAMILIES.map((fm) => (
              <button
                key={fm.id}
                onClick={() => set({ family: fm.id })}
                aria-pressed={family === fm.id}
                className={`chip shrink-0 ${family === fm.id ? 'chip-active' : ''}`}
              >
                {fm.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center">
            <label className="relative flex items-center">
              <SearchIcon width={16} height={16} className="pointer-events-none absolute left-0 text-ivory/40" />
              <input
                value={query}
                onChange={(e) => set({ query: e.target.value })}
                placeholder="Назва, бренд або нота"
                className="field min-w-[200px] py-2 pl-7 pr-6"
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
            <button
              onClick={() => setMore((m) => !m)}
              aria-expanded={more}
              aria-controls="more-filters"
              className={`chip flex items-center justify-center gap-2 ${more || advancedCount ? 'chip-active' : ''}`}
            >
              Ще фільтри{advancedCount > 0 && <span className="grid h-4 min-w-4 place-items-center rounded-full bg-champagne px-1 text-[9px] text-ink">{advancedCount}</span>}
              <span className={`transition-transform duration-300 ${more ? 'rotate-180' : ''}`}>▾</span>
            </button>
          </div>
        </div>

        {/* Advanced panel */}
        <AnimatePresence initial={false}>
          {more && (
            <motion.div
              id="more-filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-b border-ivory/10"
            >
              <div className="grid gap-10 py-8 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.2fr]">
                <PriceRange />
                <div>
                  <span className="text-[10px] uppercase tracking-wide2 text-ivory/50">Сезон</span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SEASONS.map((s) => {
                      const on = seasons.includes(s)
                      return (
                        <button
                          key={s}
                          aria-pressed={on}
                          onClick={() => set({ seasons: on ? seasons.filter((x) => x !== s) : [...seasons, s] })}
                          className={`chip ${on ? 'chip-active' : ''}`}
                        >
                          {s}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <NotePicker />
              </div>
              <div className="pb-8">
                <span className="text-[10px] uppercase tracking-wide2 text-ivory/50">Акорд</span>
                <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
                  {WHEEL.flatMap((w) =>
                    w.accords.map((a) => (
                      <button
                        key={a.id}
                        aria-pressed={accord === a.id}
                        onClick={() => set({ accord: accord === a.id ? null : a.id })}
                        className={`chip flex shrink-0 items-center gap-2 ${accord === a.id ? 'chip-active' : ''}`}
                      >
                        <span className="h-2 w-2 rounded-full" style={{ background: w.color }} />
                        {a.label}
                      </button>
                    )),
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex min-h-6 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="shrink-0 text-[10px] uppercase tracking-wide2 text-ivory/40" aria-live="polite">Знайдено: {list.length}</span>
          <ActiveChips />
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
            <button onClick={f.reset} className="btn-line mt-8">
              Показати всі аромати
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
