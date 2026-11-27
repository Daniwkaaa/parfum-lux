import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEscape } from '../lib/useEscape'
import { useFocusTrap } from '../lib/useFocusTrap'
import { getProduct, products, type Product } from '../data/products'
import { isSample, sampleSizes } from '../data/meta'
import { similarTo } from '../lib/accords'
import { useFilters } from './Collection'
import { scrollToId } from '../lib/format'
import { MAX_QTY, useShop, useUI } from '../store/shop'
import { uah } from '../lib/format'
import { useWebGL } from '../lib/useWebGL'
import { BottleImage } from './ProductCard'
import { ArrowIcon, CloseIcon, HeartIcon, MinusIcon, PlusIcon, RotateIcon } from './Icons'

const ProductViewer = lazy(() => import('../three/ProductViewer'))

function Badge({ kind }: { kind: 'official' | 'editorial' }) {
  return (
    <span
      className={`ml-3 inline-block border px-2 py-0.5 align-middle text-[8px] font-semibold uppercase tracking-wide2 ${
        kind === 'official' ? 'border-champagne/50 text-champagne' : 'border-ivory/25 text-ivory/50'
      }`}
      title={
        kind === 'official'
          ? 'Факти та піраміда нот за даними парфумерного дому'
          : 'Власна думка бутика — не офіційна інформація бренду'
      }
    >
      {kind === 'official' ? 'Офіційно' : 'Редакція'}
    </span>
  )
}

function Meter({ label, value, scale }: { label: string; value: number; scale: string[] }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] uppercase tracking-wide2 text-ivory/50">
        <span>{label}</span>
        <span>{scale[value - 1]}</span>
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1" role="meter" aria-valuemin={1} aria-valuemax={5} aria-valuenow={value} aria-label={label}>
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.span
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
            className={`h-[3px] origin-left ${i <= value ? 'bg-champagne' : 'bg-ivory/10'}`}
          />
        ))}
      </div>
    </div>
  )
}

function Details({ p }: { p: Product }) {
  const webgl = useWebGL()
  const [ml, setMl] = useState(p.sizes[p.sizes.length > 1 ? 1 : 0].ml)
  const [qty, setQty] = useState(1)
  const add = useShop((s) => s.add)
  const wished = useShop((s) => s.wishlist.includes(p.id))
  const toggleWish = useShop((s) => s.toggleWish)
  const { notify, setPanel, openProduct } = useUI()
  const [format, setFormat] = useState<'bottle' | 'sample'>('bottle')
  const samples = sampleSizes(p)
  const options = format === 'bottle' ? p.sizes : samples
  const size = [...p.sizes, ...samples].find((s) => s.ml === ml)!
  const similar = similarTo(p, products)
  const setFilters = useFilters((s) => s.set)
  const resetFilters = useFilters((s) => s.reset)
  const filterByNote = (note: string) => {
    resetFilters()
    setFilters({ notes: [note] })
    openProduct(null)
    setTimeout(() => scrollToId('collection'), 1300)
  }
  const idx = products.findIndex((x) => x.id === p.id)
  const next = products[(idx + 1) % products.length]

  return (
    <div className="grid min-h-full grid-cols-1 lg:grid-cols-2">
      {/* viewer */}
      <div className="relative h-[58svh] bg-[#110e0c] lg:sticky lg:top-0 lg:h-[100svh]">
        {webgl ? (
          <Suspense
            fallback={
              <div className="absolute inset-0 grid place-items-center">
                <BottleImage id={p.id} alt={`${p.brand} ${p.name}`} className="h-3/4 animate-pulse" />
              </div>
            }
          >
            <ProductViewer spec={p.bottle} />
          </Suspense>
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <BottleImage id={p.id} alt={`${p.brand} ${p.name}`} className="h-3/4" />
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{ background: 'radial-gradient(ellipse 50% 45% at 50% 45%, rgba(201,169,110,0.12), transparent 70%)' }}
        />
        <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-end justify-between text-[9px] uppercase tracking-wide2 text-ivory/40">
          <span className="flex items-center gap-2">
            <RotateIcon width={14} height={14} /> {webgl ? 'Потягніть, щоб обернути на 360° · Прокрутіть або зведіть пальці, щоб наблизити' : '3D недоступне на цьому пристрої'}
          </span>
        </div>
        <p className="pointer-events-none absolute left-5 top-5 max-w-[60%] text-[9px] uppercase leading-relaxed tracking-wide2 text-ivory/30">
          Стилізована 3D-інтерпретація · не офіційна копія флакона
        </p>
      </div>

      {/* info */}
      <div className="px-5 pb-16 pt-10 sm:px-10 lg:px-14 lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow">{p.brand}</p>
          <h2 id="product-title" className="h-display mt-4 text-5xl sm:text-6xl">{p.name}</h2>
          <p className="mt-3 text-[11px] uppercase tracking-wide2 text-ivory/50">
            {p.concentration} · {p.year}
            {p.perfumer && <> · Парфумер: {p.perfumer}</>}
            <Badge kind="official" />
          </p>
          <p className="mt-8 font-serif text-4xl text-champagne">{uah(size.price * qty)}</p>
          {qty > 1 && <p className="mt-1 text-xs text-ivory/40">{uah(size.price)} за одиницю</p>}

          <p className="mt-8 leading-relaxed text-ivory/70">
            {p.description}
            <Badge kind="editorial" />
          </p>
          {p.availabilityNote && (
            <p className="mt-4 border-l border-champagne/50 pl-4 text-xs leading-relaxed text-ivory/50">{p.availabilityNote}</p>
          )}

          {/* volume */}
          <div className="mt-10 inline-flex rounded-full border border-ivory/15 p-1" role="radiogroup" aria-label="Формат">
            {(
              [
                ['bottle', 'Флакон'],
                ['sample', 'Пробник'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                role="radio"
                aria-checked={format === id}
                onClick={() => {
                  setFormat(id)
                  setMl(id === 'bottle' ? p.sizes[p.sizes.length > 1 ? 1 : 0].ml : 5)
                }}
                className={`relative z-10 rounded-full px-5 py-2 text-[10px] font-semibold uppercase tracking-wide2 transition-colors ${
                  format === id ? 'text-ink' : 'text-ivory/60 hover:text-ivory'
                }`}
              >
                {format === id && (
                  <motion.span layoutId={`fmt-${p.id}`} className="absolute inset-0 -z-10 rounded-full bg-champagne" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                {label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {format === 'sample' && (
              <motion.p
                key="sample-note"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 max-w-md overflow-hidden text-xs leading-relaxed text-ivory/55"
              >
                Відливант з оригінального флакона у скляний атомайзер. Спробуйте аромат на шкірі кілька днів, перш ніж
                обирати повний флакон.
              </motion.p>
            )}
          </AnimatePresence>
          <fieldset className="mt-5">
            <legend className="sr-only">Об’єм</legend>
            <div className="flex flex-wrap gap-2">
              {options.map((s) => (
                <label
                  key={s.ml}
                  className={`cursor-pointer border px-5 py-3 text-center transition-all duration-300 ${
                    ml === s.ml ? 'border-champagne bg-champagne/10 text-champagne' : 'border-ivory/15 text-ivory/70 hover:border-ivory/40'
                  }`}
                >
                  <input type="radio" name="volume" value={s.ml} checked={ml === s.ml} onChange={() => setMl(s.ml)} className="sr-only" />
                  <span className="block text-sm font-semibold">{s.ml} мл</span>
                  {isSample(s.ml) && <span className="block text-[9px] uppercase tracking-wide2 opacity-60">≈ {Math.round(s.ml * 12)} розпилень</span>}
                  <span className="block text-[10px] opacity-60">{uah(s.price)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* qty + add */}
          <div className="mt-8 flex flex-wrap items-stretch gap-3">
            <div className="flex items-center border border-ivory/15" role="group" aria-label="Кількість">
              <button className="icon-btn h-12 w-12" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Зменшити кількість">
                <MinusIcon width={16} height={16} />
              </button>
              <span className="w-8 text-center text-sm" aria-live="polite">{qty}</span>
              <button className="icon-btn h-12 w-12" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} disabled={qty >= MAX_QTY} aria-label="Збільшити кількість">
                <PlusIcon width={16} height={16} />
              </button>
            </div>
            <button
              className="btn-gold btn-sweep flex-1 whitespace-nowrap px-4"
              onClick={() => {
                add(p.id, ml, qty)
                notify(`${p.name} · ${isSample(ml) ? 'пробник ' : ''}${ml} мл × ${qty} додано до кошика`)
              }}
            >
              До кошика
            </button>
            <button
              className={`btn-line px-4 ${wished ? 'border-champagne text-champagne' : ''}`}
              onClick={() => {
                toggleWish(p.id)
                notify(wished ? 'Видалено з обраного' : 'Додано до обраного')
              }}
              aria-pressed={wished}
              aria-label={wished ? 'Видалити з обраного' : 'Додати до обраного'}
            >
              <HeartIcon filled={wished} width={18} height={18} />
            </button>
          </div>
          <button
            className="mt-3 text-[10px] uppercase tracking-wide2 text-ivory/50 underline-offset-4 hover:text-champagne hover:underline"
            onClick={() => {
              add(p.id, ml, qty)
              openProduct(null)
              setPanel('checkout')
            }}
          >
            Купити зараз — оформити замовлення
          </button>

          {/* notes */}
          <div className="mt-14">
            <h3 className="text-[10px] uppercase tracking-luxe text-ivory/50">
              Піраміда нот <Badge kind="official" />
            </h3>
            <div className="mt-5 grid grid-cols-1 gap-px bg-ivory/10 sm:grid-cols-3">
              {(
                [
                  ['Ноти верху', p.notes.top],
                  ['Ноти серця', p.notes.heart],
                  ['Базові ноти', p.notes.base],
                ] as const
              ).map(([t, n]) => (
                <div key={t} className="bg-ink p-5">
                  <p className="font-serif text-lg italic text-champagne">{t}</p>
                  <ul className="mt-3 space-y-1.5 text-sm text-ivory/75">
                    {n.map((x) => (
                      <li key={x}>
                        <button
                          onClick={() => filterByNote(x)}
                          className="text-left underline-offset-4 transition-colors hover:text-champagne hover:underline"
                          title={`Показати всі аромати з нотою «${x}»`}
                        >
                          {x}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* characteristics */}
          <div className="mt-14">
            <h3 className="text-[10px] uppercase tracking-luxe text-ivory/50">
              Характер аромату <Badge kind="editorial" />
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <Meter label="Стійкість" value={p.characteristics.longevity} scale={['Слабка', 'Помірна', 'Добра', 'Висока', 'Виняткова']} />
              <Meter label="Шлейф" value={p.characteristics.projection} scale={['Близький до шкіри', 'Помірний', 'Помітний', 'Сильний', 'Потужний']} />
            </div>
            <dl className="mt-8 grid grid-cols-1 gap-y-5 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-[10px] uppercase tracking-wide2 text-ivory/40">Група аромату</dt>
                <dd className="mt-1 text-ivory/85">{p.family}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wide2 text-ivory/40">Сезон</dt>
                <dd className="mt-1 text-ivory/85">{p.characteristics.seasons.join(', ')}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wide2 text-ivory/40">Нагода</dt>
                <dd className="mt-1 text-ivory/85">{p.characteristics.occasion}</dd>
              </div>
            </dl>
          </div>

          {/* similar */}
          <div className="mt-16">
            <h3 className="text-[10px] uppercase tracking-luxe text-ivory/50">Схожі аромати</h3>
            <p className="mt-2 text-xs text-ivory/40">Підібрано за спільними нотами й акордами</p>
            <ul className="no-scrollbar -mx-5 mt-6 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
              {similar.map(({ product: q, score, shared }, i) => (
                <motion.li
                  key={q.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, root: undefined }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className="w-[70vw] shrink-0 snap-start sm:w-auto"
                >
                  <button
                    onClick={() => openProduct(q.id)}
                    className="group flex h-full w-full gap-4 border border-ivory/10 bg-ink-800 p-3 text-left transition-colors duration-500 hover:border-champagne/50"
                    aria-label={`Схожий аромат: ${q.brand} ${q.name}`}
                  >
                    <span className="h-28 w-20 shrink-0 overflow-hidden bg-[#15110e]">
                      <BottleImage id={q.id} alt="" className="transition-transform duration-700 group-hover:scale-110" />
                    </span>
                    <span className="flex min-w-0 flex-col py-1">
                      <span className="eyebrow truncate text-[8px]">{q.brand}</span>
                      <span className="mt-1 font-serif text-lg leading-tight group-hover:text-champagne">{q.name}</span>
                      <span className="mt-2 flex gap-[3px]" aria-label={`Спорідненість ${Math.round(score * 100)} зі 100`}>
                        {[0, 1, 2, 3, 4].map((d) => (
                          <span key={d} className={`h-[3px] w-4 ${d < Math.max(1, Math.round(score * 7)) ? 'bg-champagne' : 'bg-ivory/15'}`} />
                        ))}
                      </span>
                      {shared.length > 0 && (
                        <span className="mt-2 line-clamp-2 text-[11px] leading-snug text-ivory/45">Спільне: {shared.join(', ').toLowerCase()}</span>
                      )}
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => openProduct(next.id)}
            className="group mt-16 flex w-full items-center justify-between border-t border-ivory/10 pt-8 text-left"
          >
            <span>
              <span className="block text-[10px] uppercase tracking-luxe text-ivory/40">Наступний аромат</span>
              <span className="mt-2 block font-serif text-3xl font-light group-hover:text-champagne">
                {next.brand} — {next.name}
              </span>
            </span>
            <ArrowIcon className="transition-transform duration-500 group-hover:translate-x-2" />
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export function ProductModal() {
  const id = useUI((s) => s.product)
  const openProduct = useUI((s) => s.openProduct)
  const p = id ? getProduct(id) : undefined
  const scroller = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [id])

  // deep-link (?p=id) + back button support
  useEffect(() => {
    const fromUrl = new URLSearchParams(location.search).get('p')
    if (fromUrl && getProduct(fromUrl)) openProduct(fromUrl)
    const onPop = () => openProduct(new URLSearchParams(location.search).get('p'))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [openProduct])

  useEffect(() => {
    const url = new URL(location.href)
    const cur = url.searchParams.get('p')
    if ((id ?? null) === cur) return
    if (id) url.searchParams.set('p', id)
    else url.searchParams.delete('p')
    try {
      history.pushState(null, '', url)
    } catch {
      /* file:// pages cannot change the URL — deep links are optional */
    }
  }, [id])

  useEscape(() => openProduct(null), !!p)
  useFocusTrap(scroller, !!p)

  return (
    <AnimatePresence>
      {p && (
        <motion.div
          key="product"
          ref={scroller}
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-ink"
          data-lenis-prevent
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: 'inset(0% 0 0 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-title"
        >
          <button
            onClick={() => openProduct(null)}
            className="fixed right-4 top-4 z-10 flex items-center gap-3 bg-ink/70 px-4 py-3 text-[10px] uppercase tracking-luxe text-ivory/80 backdrop-blur hover:text-champagne sm:right-8 sm:top-6"
            aria-label="Закрити картку товару"
          >
            Закрити <CloseIcon width={16} height={16} />
          </button>
          <AnimatePresence mode="wait">
            <motion.div
              key={p.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Details p={p} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
