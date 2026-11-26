import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Family, Intensity, Occasion } from '../data/products'
import { recommend, type QuizAnswers } from '../lib/quiz'
import { useShop, useUI } from '../store/shop'
import { uah } from '../lib/format'
import { BottleImage } from './ProductCard'
import { ArrowIcon } from './Icons'

const FAM: { id: Family; label: string; hint: string }[] = [
  { id: 'fresh', label: 'Fresh', hint: 'Citrus, sea air, green herbs' },
  { id: 'sweet', label: 'Sweet', hint: 'Vanilla, honey, tonka' },
  { id: 'woody', label: 'Woody', hint: 'Cedar, sandalwood, oud' },
  { id: 'spicy', label: 'Spicy', hint: 'Cinnamon, cardamom, pepper' },
  { id: 'floral', label: 'Floral', hint: 'Jasmine, rose, violet' },
]
const OCC: { id: Occasion; label: string; hint: string }[] = [
  { id: 'day', label: 'Everyday', hint: 'Effortless, from morning on' },
  { id: 'office', label: 'Office', hint: 'Polished and close to skin' },
  { id: 'evening', label: 'Evening', hint: 'Dinners, dates, nightlife' },
  { id: 'special', label: 'Special occasion', hint: 'Unforgettable entrances' },
]
const INT: { id: Intensity; label: string; hint: string }[] = [
  { id: 'soft', label: 'Subtle', hint: 'A whisper for those close to you' },
  { id: 'moderate', label: 'Balanced', hint: 'Noticed, never overwhelming' },
  { id: 'intense', label: 'Intense', hint: 'A trail that lingers in the room' },
]

function Option({ active, onClick, label, hint }: { active: boolean; onClick: () => void; label: string; hint: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`group border p-5 text-left transition-all duration-500 ease-luxe ${
        active ? 'border-champagne bg-champagne/10' : 'border-ivory/15 hover:border-ivory/40 hover:bg-ivory/[0.03]'
      }`}
    >
      <span className={`block font-serif text-2xl font-light ${active ? 'text-champagne' : ''}`}>{label}</span>
      <span className="mt-1 block text-xs text-ivory/50">{hint}</span>
    </button>
  )
}

const STEPS = ['Which scents draw you in?', 'Where will you wear it?', 'How present should it be?']

export function Quiz() {
  const [step, setStep] = useState(0)
  const [a, setA] = useState<QuizAnswers>({ families: [], occasion: null, intensity: null })
  const { openProduct, notify } = useUI()
  const add = useShop((s) => s.add)

  const canNext = step === 0 ? a.families.length > 0 : step === 1 ? !!a.occasion : !!a.intensity
  const results = step === 3 ? recommend(a).slice(0, 3) : []


  return (
    <section id="discover" className="relative overflow-hidden bg-ink-800 py-24 sm:py-32" aria-labelledby="quiz-title">
      <div className="pointer-events-none absolute -right-40 top-0 h-[600px] w-[600px] rounded-full bg-champagne/10 blur-[140px]" />
      <div className="container-lux relative grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div data-reveal>
          <p className="eyebrow">Fragrance finder</p>
          <h2 id="quiz-title" className="h-display mt-5 text-6xl sm:text-7xl">
            Discover <br />
            your <em className="text-champagne">scent</em>
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/55">
            Three questions, one considered recommendation. Our finder matches your preferences against the scent
            profile of every fragrance in the boutique.
          </p>
          <div className="mt-10 flex gap-2" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`h-px flex-1 transition-colors duration-700 ${i <= step ? 'bg-champagne' : 'bg-ivory/15'}`} />
            ))}
          </div>
          <p className="mt-3 text-[10px] uppercase tracking-wide2 text-ivory/40">
            {step < 3 ? `Step ${step + 1} of 3` : 'Your selection'}
          </p>
        </div>

        <div className="min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {step < 3 && (
                <>
                  <h3 className="font-serif text-3xl font-light sm:text-4xl">{STEPS[step]}</h3>
                  {step === 0 && <p className="mt-2 text-xs text-ivory/45">Choose up to two.</p>}
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {step === 0 &&
                      FAM.map((o) => (
                        <Option
                          key={o.id}
                          {...o}
                          active={a.families.includes(o.id)}
                          onClick={() =>
                            setA((s) => ({
                              ...s,
                              families: s.families.includes(o.id)
                                ? s.families.filter((x) => x !== o.id)
                                : [...s.families, o.id].slice(-2),
                            }))
                          }
                        />
                      ))}
                    {step === 1 && OCC.map((o) => <Option key={o.id} {...o} active={a.occasion === o.id} onClick={() => setA((s) => ({ ...s, occasion: o.id }))} />)}
                    {step === 2 && INT.map((o) => <Option key={o.id} {...o} active={a.intensity === o.id} onClick={() => setA((s) => ({ ...s, intensity: o.id }))} />)}
                  </div>
                  <div className="mt-10 flex items-center justify-between">
                    <button
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                      className={`text-[10px] uppercase tracking-wide2 text-ivory/50 hover:text-champagne ${step === 0 ? 'invisible' : ''}`}
                    >
                      ← Back
                    </button>
                    <button className="btn-gold btn-sweep" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
                      {step === 2 ? 'Reveal my scents' : 'Continue'} <ArrowIcon width={16} height={16} />
                    </button>
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <h3 className="font-serif text-3xl font-light sm:text-4xl">Selected for you</h3>
                  <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                    {results.map(({ product: p, score }, i) => (
                      <motion.li
                        key={p.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.12, duration: 0.7 }}
                        className="group flex flex-col border border-ivory/10 bg-ink"
                      >
                        <button onClick={() => openProduct(p.id)} className="relative aspect-[4/5] bg-[#15110e]" aria-label={`View ${p.name}`}>
                          <BottleImage id={p.id} alt="" className="transition-transform duration-700 group-hover:-translate-y-2" />
                          <span className="absolute left-3 top-3 bg-ink/80 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide2 text-champagne">
                            {score}% match
                          </span>
                        </button>
                        <div className="flex flex-1 flex-col p-4">
                          <p className="eyebrow text-[8px]">{p.brand}</p>
                          <p className="mt-1 font-serif text-xl leading-tight">{p.name}</p>
                          <p className="mt-1 text-sm text-champagne">{uah(p.sizes[0].price)}</p>
                          <button
                            className="mt-4 text-left text-[10px] font-semibold uppercase tracking-wide2 text-ivory/70 hover:text-champagne"
                            onClick={() => {
                              add(p.id, p.sizes[0].ml)
                              notify(`${p.name} · ${p.sizes[0].ml} ml added to bag`)
                            }}
                          >
                            + Add to bag
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                  <button
                    className="mt-10 text-[10px] uppercase tracking-wide2 text-ivory/50 hover:text-champagne"
                    onClick={() => {
                      setA({ families: [], occasion: null, intensity: null })
                      setStep(0)
                    }}
                  >
                    ↺ Start again
                  </button>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
