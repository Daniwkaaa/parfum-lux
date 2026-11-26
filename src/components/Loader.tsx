import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Logo } from './Logo'

export function Loader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    let fontsReady = false
    document.fonts?.ready.then(() => (fontsReady = true))
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / 1800)
      const target = fontsReady ? p : Math.min(p, 0.85)
      setPct(Math.round(target * 100))
      if (target < 1) raf = requestAnimationFrame(step)
      else setTimeout(onDone, 250)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      role="status"
      aria-label="Завантаження"
    >
      <motion.div
        initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center text-ivory"
      >
        <Logo size="lg" />
        <p className="mt-5 font-serif text-lg italic text-ivory/50">Аромат, який розповідає твою історію</p>
      </motion.div>
      <div className="mt-8 h-px w-48 overflow-hidden bg-ivory/10">
        <div className="h-full bg-champagne transition-[width] duration-200" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-4 font-sans text-[10px] tracking-luxe text-ivory/40">{String(pct).padStart(3, '0')}</p>
    </motion.div>
  )
}
