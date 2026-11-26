import { NAV } from './Nav'
import { site } from '../data/site'
import { scrollToId } from '../lib/format'
import { useUI } from '../store/shop'

export function Footer() {
  const setPolicy = useUI((s) => s.setPolicy)
  const setPanel = useUI((s) => s.setPanel)
  return (
    <footer id="contacts" className="bg-ink pt-24" aria-labelledby="contacts-title">
      <div className="container-lux">
        <h2 id="contacts-title" className="sr-only">Contacts</h2>
        <div className="grid gap-14 border-b border-ivory/10 pb-16 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-serif text-3xl uppercase tracking-[0.28em]">
              Parfum<span className="text-champagne"> Lux</span>
            </p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ivory/50">
              A curated boutique of exceptional fragrances, presented in an interactive 3D showroom.
            </p>
            <ul className="mt-8 flex gap-6">
              {site.socials.map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-wide2 text-ivory/60 transition-colors hover:text-champagne">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav className="lg:col-span-2" aria-label="Footer">
            <p className="eyebrow">Navigate</p>
            <ul className="mt-6 space-y-3 text-sm">
              {NAV.map((n) => (
                <li key={n.id}>
                  <button onClick={() => scrollToId(n.id)} className="text-ivory/60 transition-colors hover:text-champagne">{n.label}</button>
                </li>
              ))}
              <li><button onClick={() => scrollToId('discover')} className="text-ivory/60 hover:text-champagne">Fragrance finder</button></li>
              <li><button onClick={() => setPanel('wishlist')} className="text-ivory/60 hover:text-champagne">Wishlist</button></li>
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="eyebrow">Contact</p>
            <address className="mt-6 space-y-3 text-sm not-italic text-ivory/60">
              <p>{site.address}</p>
              <p><a href={site.phoneHref} className="hover:text-champagne">{site.phoneDisplay}</a></p>
              <p><a href={`mailto:${site.email}`} className="hover:text-champagne">{site.email}</a></p>
              <p>{site.hours}</p>
            </address>
          </div>

          <div className="lg:col-span-3">
            <p className="eyebrow">Client care</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li><button onClick={() => setPolicy('delivery')} className="text-ivory/60 hover:text-champagne">Delivery information</button></li>
              <li><button onClick={() => setPolicy('payment')} className="text-ivory/60 hover:text-champagne">Payment information</button></li>
              <li><button onClick={() => setPolicy('privacy')} className="text-ivory/60 hover:text-champagne">Privacy policy</button></li>
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-ivory/40">
              Delivery across Ukraine via Nova Poshta · complimentary from 5 000 ₴. Payment on receipt.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-8 text-[10px] uppercase tracking-wide2 text-ivory/30 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Parfum Lux · Portfolio demonstration</p>
          <p className="normal-case tracking-normal">
            Brand and product names are trademarks of their respective owners. 3D bottles are stylised interpretations,
            not official replicas.
          </p>
        </div>
      </div>
      <p className="pointer-events-none select-none overflow-hidden whitespace-nowrap text-center font-serif text-[19vw] font-light uppercase leading-[0.8] tracking-[0.06em] text-ivory/[0.04]" aria-hidden="true">
        Parfum Lux
      </p>
    </footer>
  )
}
