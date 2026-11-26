import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon } from './Icons'
import { useCartTotals, useShop, useUI } from '../store/shop'
import { scrollToId } from '../lib/format'

export const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'collection', label: 'Collection' },
  { id: 'brands', label: 'Brands' },
  { id: 'about', label: 'About Us' },
  { id: 'contacts', label: 'Contacts' },
]

function useActive() {
  const [active, setActive] = useState('home')
  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return active
}

function Counter({ n }: { n: number }) {
  return (
    <AnimatePresence>
      {n > 0 && (
        <motion.span
          key={n}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-champagne px-1 text-[9px] font-bold text-ink"
        >
          {n}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

export function Nav() {
  const active = useActive()
  const [scrolled, setScrolled] = useState(false)
  const { count } = useCartTotals()
  const wish = useShop((s) => s.wishlist.length)
  const { panel, setPanel } = useUI()

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const go = (id: string) => {
    setPanel(null)
    setTimeout(() => scrollToId(id), panel === 'menu' ? 350 : 0)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-700 ease-luxe ${
          scrolled ? 'border-b border-ivory/5 bg-ink/90 py-3 backdrop-blur-xl' : 'py-6'
        }`}
      >
        <div className="container-lux flex items-center justify-between">
          <button
            onClick={() => go('home')}
            className="font-serif text-xl uppercase tracking-[0.28em] text-ivory transition-colors hover:text-champagne sm:text-2xl"
            aria-label="Parfum Lux — back to top"
          >
            Parfum<span className="text-champagne"> Lux</span>
          </button>

          <nav className="hidden lg:block" aria-label="Main">
            <ul className="flex items-center gap-10">
              {NAV.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => go(n.id)}
                    aria-current={active === n.id ? 'true' : undefined}
                    className={`group relative py-2 text-[10px] font-semibold uppercase tracking-luxe transition-colors duration-300 ${
                      active === n.id ? 'text-champagne' : 'text-ivory/70 hover:text-ivory'
                    }`}
                  >
                    {n.label}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-px bg-champagne transition-all duration-500 ease-luxe ${
                        active === n.id ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button className="icon-btn" onClick={() => setPanel('search')} aria-label="Search">
              <SearchIcon />
            </button>
            <button className="icon-btn" onClick={() => setPanel('wishlist')} aria-label={`Wishlist, ${wish} items`}>
              <HeartIcon />
              <Counter n={wish} />
            </button>
            <button className="icon-btn" onClick={() => setPanel('cart')} aria-label={`Shopping bag, ${count} items`}>
              <BagIcon />
              <Counter n={count} />
            </button>
            <button className="icon-btn lg:hidden" onClick={() => setPanel('menu')} aria-label="Open menu">
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {panel === 'menu' && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-ink lg:hidden"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="container-lux flex items-center justify-between py-6">
              <span className="font-serif text-xl uppercase tracking-[0.28em]">
                Parfum<span className="text-champagne"> Lux</span>
              </span>
              <button className="icon-btn" onClick={() => setPanel(null)} aria-label="Close menu">
                <CloseIcon />
              </button>
            </div>
            <ul className="container-lux mt-10 flex flex-1 flex-col gap-4">
              {NAV.map((n, i) => (
                <motion.li
                  key={n.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    onClick={() => go(n.id)}
                    className={`flex w-full items-baseline gap-5 border-b border-ivory/10 py-4 text-left font-serif text-4xl font-light ${
                      active === n.id ? 'text-champagne' : 'text-ivory'
                    }`}
                  >
                    <span className="font-sans text-[10px] tracking-luxe text-champagne/70">0{i + 1}</span>
                    {n.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <div className="container-lux flex gap-3 pb-10">
              <button className="btn-line flex-1" onClick={() => setPanel('search')}>Search</button>
              <button className="btn-gold flex-1" onClick={() => setPanel('cart')}>Bag ({count})</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
