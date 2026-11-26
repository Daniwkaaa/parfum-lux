import { AnimatePresence, motion } from 'framer-motion'
import { useUI } from '../store/shop'
import { CheckIcon } from './Icons'

export function Toast() {
  const toast = useUI((s) => s.toast)
  const setPanel = useUI((s) => s.setPanel)
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex items-center gap-4 border border-champagne/30 bg-ink-700/95 px-5 py-3 text-sm shadow-2xl backdrop-blur"
          >
            <CheckIcon width={16} height={16} className="text-champagne" />
            <span>{toast.text}</span>
            {toast.text.includes('bag') && (
              <button className="text-[10px] font-semibold uppercase tracking-wide2 text-champagne hover:underline" onClick={() => setPanel('cart')}>
                View bag
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
