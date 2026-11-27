import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Loader } from './components/Loader'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Collection } from './components/Collection'
import { Bestsellers } from './components/Bestsellers'
import { Quiz } from './components/Quiz'
import { FragranceWheel } from './components/FragranceWheel'
import { About } from './components/About'
import { Brands } from './components/Brands'
import { Newsletter } from './components/Newsletter'
import { Footer } from './components/Footer'
import { ProductModal } from './components/ProductModal'
import { CartDrawer } from './components/CartDrawer'
import { WishlistDrawer } from './components/WishlistDrawer'
import { SearchOverlay } from './components/SearchOverlay'
import { Checkout } from './components/Checkout'
import { PolicyModal } from './components/PolicyModal'
import { Toast } from './components/Toast'
import { Ornament } from './components/Logo'
import { useUI } from './store/shop'
import { useRevealAnimations, useSmoothScroll } from './lib/useSmoothScroll'

export default function App() {
  const [loading, setLoading] = useState(true)
  const done = useCallback(() => setLoading(false), [])
  const { panel, product, policy } = useUI()
  const locked = loading || !!product || !!policy || (panel !== null)
  useSmoothScroll(locked)
  useRevealAnimations([loading])

  return (
    <div className="grain">
      <a href="#collection" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:bg-champagne focus:px-4 focus:py-2 focus:text-ink">
        Перейти до колекції
      </a>
      <AnimatePresence>{loading && <Loader onDone={done} />}</AnimatePresence>
      <Nav />
      <main>
        <Hero ready={!loading} />
        <Collection />
        <Ornament />
        <Bestsellers />
        <FragranceWheel />
        <Quiz />
        <Brands />
        <About />
        <Ornament />
        <Newsletter />
      </main>
      <Footer />

      <ProductModal />
      <AnimatePresence>
        {panel === 'cart' && <CartDrawer key="cart" />}
        {panel === 'wishlist' && <WishlistDrawer key="wish" />}
        {panel === 'search' && <SearchOverlay key="search" />}
        {panel === 'checkout' && <Checkout key="checkout" />}
      </AnimatePresence>
      <PolicyModal />
      <Toast />
    </div>
  )
}
