import { useRef, type ReactNode } from 'react'
import { useFocusTrap } from '../lib/useFocusTrap'
import { useEscape } from '../lib/useEscape'
import { motion } from 'framer-motion'
import { CloseIcon } from './Icons'

export function Drawer({
  title,
  onClose,
  children,
  footer,
  side = 'right',
}: {
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  side?: 'right' | 'left'
}) {
  useEscape(onClose)
  const panel = useRef<HTMLElement>(null)
  useFocusTrap(panel)

  return (
    <motion.div className="fixed inset-0 z-50" initial="hidden" animate="show" exit="hidden">
      <motion.button
        aria-label="Close"
        className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-sm"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
        transition={{ duration: 0.5 }}
        onClick={onClose}
        tabIndex={-1}
      />
      <motion.aside
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        variants={{ hidden: { x: side === 'right' ? '100%' : '-100%' }, show: { x: 0 } }}
        transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        className={`absolute top-0 flex h-full w-full max-w-[460px] flex-col border-ivory/10 bg-ink-800 ${
          side === 'right' ? 'right-0 border-l' : 'left-0 border-r'
        }`}
      >
        <header className="flex items-center justify-between border-b border-ivory/10 px-6 py-5">
          <h2 className="font-serif text-3xl font-light">{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label={`Close ${title}`}>
            <CloseIcon />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6" data-lenis-prevent>
          {children}
        </div>
        {footer && <footer className="border-t border-ivory/10 px-6 py-6">{footer}</footer>}
      </motion.aside>
    </motion.div>
  )
}
