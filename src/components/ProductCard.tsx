import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import type { Product } from '../data/products'
import { minPrice } from '../data/products'
import { useShop, useUI } from '../store/shop'
import { uah } from '../lib/format'
import { HeartIcon } from './Icons'

export function BottleImage({ id, alt, className = '' }: { id: string; alt: string; className?: string }) {
  return (
    <img
      src={`/bottles/${id}.webp`}
      alt={alt}
      loading="lazy"
      decoding="async"
      width={800}
      height={1000}
      className={`h-full w-full object-contain ${className}`}
    />
  )
}

export const ProductCard = forwardRef<HTMLElement, { p: Product; index?: number }>(function ProductCard(
  { p, index = 0 },
  ref,
) {
  const open = useUI((s) => s.openProduct)
  const notify = useUI((s) => s.notify)
  const add = useShop((s) => s.add)
  const wished = useShop((s) => s.wishlist.includes(p.id))
  const toggleWish = useShop((s) => s.toggleWish)
  const smallest = p.sizes[0]

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.8, delay: Math.min(index, 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="gold-frame group relative flex flex-col bg-ink-800"
    >
      {/* visual */}
      <button
        onClick={() => open(p.id)}
        className="relative block aspect-[4/5] overflow-hidden bg-[#15110e] focus-visible:outline-none"
        aria-label={`View details: ${p.brand} ${p.name}`}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen transition-opacity duration-700 ease-luxe group-hover:opacity-100"
          style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 42%, rgba(201,169,110,0.28), transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-1000 ease-luxe group-hover:opacity-100"
          style={{ background: 'linear-gradient(115deg, transparent 30%, rgba(255,236,200,0.09) 50%, transparent 70%)' }}
        />
        <BottleImage
          id={p.id}
          alt={`${p.brand} ${p.name} — stylised 3D bottle`}
          className="relative transition-transform duration-[1.1s] ease-luxe group-hover:-translate-y-3 group-hover:scale-[1.03]"
        />
        {p.bestseller && (
          <span className="absolute left-4 top-4 border border-champagne/40 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide2 text-champagne">
            Bestseller
          </span>
        )}
        <span className="absolute bottom-4 left-4 text-[9px] uppercase tracking-luxe text-ivory/30">
          {String(index + 1).padStart(2, '0')}
        </span>
      </button>

      <button
        onClick={() => {
          toggleWish(p.id)
          notify(wished ? 'Removed from wishlist' : `${p.name} added to wishlist`)
        }}
        className={`icon-btn absolute right-2 top-2 z-10 ${wished ? 'text-champagne' : ''}`}
        aria-pressed={wished}
        aria-label={wished ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
      >
        <HeartIcon filled={wished} width={18} height={18} />
      </button>

      {/* info */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="eyebrow text-[9px]">{p.brand}</p>
        <h3 className="mt-2 font-serif text-2xl font-light leading-tight text-ivory">{p.name}</h3>
        <p className="mt-1 text-[11px] uppercase tracking-wide2 text-ivory/45">
          {p.concentration} · {p.sizes.map((s) => `${s.ml} ml`).join(' / ')}
        </p>
        <div className="grid transition-all duration-700 ease-luxe [grid-template-rows:1fr] lg:[grid-template-rows:0fr] lg:group-focus-within:[grid-template-rows:1fr] lg:group-hover:[grid-template-rows:1fr]">
          <p className="overflow-hidden text-sm leading-relaxed text-ivory/60 opacity-100 transition-opacity duration-700 lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100">
            <span className="block pt-3">{p.short}</span>
          </p>
        </div>
        <p className="mt-4 font-serif text-xl text-champagne">
          {p.sizes.length > 1 && <span className="mr-1 font-sans text-[10px] uppercase tracking-wide2 text-ivory/40">from</span>}
          {uah(minPrice(p))}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2 pt-1">
          <button onClick={() => open(p.id)} className="btn-line px-2 py-3 text-[10px]">
            View Details
          </button>
          <button
            onClick={() => {
              add(p.id, smallest.ml)
              notify(`${p.name} · ${smallest.ml} ml added to bag`)
            }}
            className="btn-gold btn-sweep px-2 py-3 text-[10px]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.article>
  )
})
