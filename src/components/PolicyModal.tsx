import { useRef } from 'react'
import { useEscape } from '../lib/useEscape'
import { useFocusTrap } from '../lib/useFocusTrap'
import { AnimatePresence, motion } from 'framer-motion'
import { useUI } from '../store/shop'
import { site } from '../data/site'
import { uah } from '../lib/format'
import { CloseIcon } from './Icons'

const CONTENT = {
  delivery: {
    title: 'Delivery information',
    body: [
      `We deliver across Ukraine with Nova Poshta — to a branch, a parcel locker or by courier to your door. Orders confirmed before 15:00 on weekdays are dispatched the same day; delivery typically takes 1–2 days.`,
      `Delivery costs ${uah(site.shippingCost)} and is complimentary for orders from ${uah(site.freeShippingFrom)}.`,
      'Every order is packed in protective boxes and sealed. You may inspect the parcel at the branch before paying.',
    ],
  },
  payment: {
    title: 'Payment information',
    body: [
      'Payment is made on receipt — in cash or by card at the Nova Poshta branch or to the courier.',
      'Online card payment requires a connected payment provider and is not active in this demonstration build. No card details are ever requested or stored on this site.',
      'All prices are shown in Ukrainian hryvnia (UAH) and include VAT.',
    ],
  },
  privacy: {
    title: 'Privacy policy',
    body: [
      'This website is a portfolio demonstration. Your bag, wishlist, newsletter address and demo orders are stored only in your own browser (localStorage) and are never sent to a server.',
      'You can delete this data at any time by clearing your browser storage for this site.',
      'If the boutique is connected to a live backend, personal data (name, phone, delivery address) would be used solely to fulfil your order, in line with the Law of Ukraine “On Personal Data Protection”.',
      site.email ? `Questions: ${site.email}` : 'Questions: use the concierge form in the Contacts section.',
    ],
  },
}

export function PolicyModal() {
  const { policy, setPolicy } = useUI()
  useEscape(() => setPolicy(null), !!policy)
  const box = useRef<HTMLDivElement>(null)
  useFocusTrap(box, !!policy)
  const c = policy ? CONTENT[policy] : null
  return (
    <AnimatePresence>
      {c && (
        <motion.div className="fixed inset-0 z-[70] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setPolicy(null)} aria-label="Close" tabIndex={-1} />
          <motion.div
            ref={box}
            role="dialog"
            aria-modal="true"
            aria-labelledby="policy-title"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[85vh] w-full max-w-xl overflow-y-auto border border-ivory/10 bg-ink-800 p-8 sm:p-10"
            data-lenis-prevent
          >
            <button className="icon-btn absolute right-4 top-4" onClick={() => setPolicy(null)} aria-label="Close">
              <CloseIcon />
            </button>
            <h2 id="policy-title" className="font-serif text-4xl font-light">{c.title}</h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-ivory/65">
              {c.body.map((p) => <p key={p}>{p}</p>)}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
