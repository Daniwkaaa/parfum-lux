import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useFocusTrap } from '../lib/useFocusTrap'
import { useEscape } from '../lib/useEscape'
import { products, minPrice } from '../data/products'
import { useUI } from '../store/shop'
import { uah } from '../lib/format'
import { matchesQuery } from './Collection'
import { BottleImage } from './ProductCard'
import { CloseIcon, SearchIcon } from './Icons'

const SUGGEST = ['Уд', 'Ваніль', 'Creed', 'Лаванда', 'Dior', 'Шафран']

export function SearchOverlay() {
  const { setPanel, openProduct } = useUI()
  const [q, setQ] = useState('')
  const [hi, setHi] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const results = useMemo(() => (q.trim() ? products.filter((p) => matchesQuery(q, p)) : []), [q])

  useEffect(() => {
    input.current?.focus()
  }, [])
  useEscape(() => setPanel(null))
  const root = useRef<HTMLDivElement>(null)
  useFocusTrap(root, true, 'input')
  useEffect(() => {
    setHi(0)
  }, [q])

  const choose = (id: string) => {
    setPanel(null)
    openProduct(id)
  }

  return (
    <motion.div
      ref={root}
      className="fixed inset-0 z-50 overflow-y-auto bg-ink/95 backdrop-blur-xl"
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      role="dialog"
      aria-modal="true"
      aria-label="Пошук"
    >
      <div className="container-lux py-6">
        <div className="flex justify-end">
          <button className="icon-btn" onClick={() => setPanel(null)} aria-label="Закрити пошук">
            <CloseIcon />
          </button>
        </div>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-10 max-w-4xl"
        >
          <p className="eyebrow">Пошук по бутику</p>
          <label className="mt-6 flex items-center gap-4 border-b border-ivory/20 pb-4 focus-within:border-champagne">
            <SearchIcon width={28} height={28} className="text-ivory/40" />
            <input
              ref={input}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => Math.min(results.length - 1, h + 1)) }
                if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(0, h - 1)) }
                if (e.key === 'Enter' && results[hi]) choose(results[hi].id)
              }}
              placeholder="Аромат, бренд або нота…"
              className="w-full bg-transparent font-serif text-3xl font-light text-ivory placeholder:text-ivory/25 focus:outline-none sm:text-5xl"
              aria-label="Пошук ароматів за назвою, брендом або нотою"
              role="combobox"
              aria-expanded={results.length > 0}
              aria-controls="search-results"
            />
          </label>

          {!q && (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="mr-2 text-[10px] uppercase tracking-wide2 text-ivory/40">Популярне:</span>
              {SUGGEST.map((s) => (
                <button key={s} onClick={() => setQ(s)} className="chip">{s}</button>
              ))}
            </div>
          )}

          {q && (
            <p className="mt-6 text-[10px] uppercase tracking-wide2 text-ivory/40" aria-live="polite">
              Знайдено: {results.length}
            </p>
          )}
          <ul id="search-results" role="listbox" className="mt-4 divide-y divide-ivory/10">
            {results.map((p, i) => (
              <li key={p.id} role="option" aria-selected={i === hi}>
                <button
                  onClick={() => choose(p.id)}
                  onMouseEnter={() => setHi(i)}
                  className={`flex w-full items-center gap-5 px-2 py-3 text-left transition-colors ${i === hi ? 'bg-ivory/5' : ''}`}
                >
                  <span className="h-16 w-14 shrink-0 bg-[#15110e]"><BottleImage id={p.id} alt="" /></span>
                  <span className="flex-1">
                    <span className="eyebrow block text-[9px]">{p.brand}</span>
                    <span className="block font-serif text-2xl font-light">{p.name}</span>
                  </span>
                  <span className="hidden font-serif text-lg text-champagne sm:block">{uah(minPrice(p))}</span>
                </button>
              </li>
            ))}
          </ul>
          {q && results.length === 0 && (
            <p className="mt-10 font-serif text-2xl font-light text-ivory/60">За запитом «{q}» нічого не знайдено. Спробуйте назву бренду або ноту, наприклад «ваніль».</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
