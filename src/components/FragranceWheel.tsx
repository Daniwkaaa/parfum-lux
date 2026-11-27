import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import { products } from '../data/products'
import { allNotes } from '../data/meta'
import { ACCORDS, WHEEL, hasAccord, type Accord, type WheelFamily } from '../lib/accords'
import { plural } from '../lib/plural'
import { scrollToId } from '../lib/format'
import { useUI } from '../store/shop'
import { useFilters } from './Collection'
import { BottleImage } from './ProductCard'
import { LogoMark } from './Logo'
import { ArrowIcon } from './Icons'

/* ------------------------------------------------------------------ */
/* Geometry                                                             */
/* ------------------------------------------------------------------ */

const R_IN0 = 66
const R_IN1 = 148
const R_OUT0 = 154
const R_OUT1 = 268
const GAP = 0.9 // degrees between segments

const rad = (deg: number) => ((deg - 90) * Math.PI) / 180
const pt = (r: number, deg: number) => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))] as const

function sector(r0: number, r1: number, a0: number, a1: number) {
  const s = a0 + GAP / 2
  const e = a1 - GAP / 2
  const large = e - s > 180 ? 1 : 0
  const [x0, y0] = pt(r1, s)
  const [x1, y1] = pt(r1, e)
  const [x2, y2] = pt(r0, e)
  const [x3, y3] = pt(r0, s)
  return `M${x0} ${y0} A${r1} ${r1} 0 ${large} 1 ${x1} ${y1} L${x2} ${y2} A${r0} ${r0} 0 ${large} 0 ${x3} ${y3}Z`
}

interface Seg {
  kind: 'family' | 'accord'
  id: string
  family: WheelFamily
  accord?: Accord
  a0: number
  a1: number
}

/** Lay out the wheel: each family spans as many units as it has accords. */
const SEGMENTS: Seg[] = (() => {
  const units = WHEEL.reduce((n, f) => n + f.accords.length, 0)
  const per = 360 / units
  const out: Seg[] = []
  let a = -per * 1.5 // start so that "Свіжі" sits near the top
  WHEEL.forEach((f) => {
    const start = a
    f.accords.forEach((ac) => {
      out.push({ kind: 'accord', id: ac.id, family: f, accord: ac, a0: a, a1: a + per })
      a += per
    })
    out.push({ kind: 'family', id: f.id, family: f, a0: start, a1: a })
  })
  return out
})()

const mid = (s: Seg) => (s.a0 + s.a1) / 2

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16)
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt * 255)))
  const r = c(n >> 16)
  const g = c((n >> 8) & 255)
  const b = c(n & 255)
  return `rgb(${r},${g},${b})`
}

/** Split a label into ≤2 short lines for the ring. */
function lines(label: string) {
  if (label.length <= 11) return [label]
  const words = label.split(' ')
  const half = Math.ceil(words.length / 2)
  return [words.slice(0, half).join(' '), words.slice(half).join(' ')]
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

type Selection = { kind: 'family' | 'accord'; id: string } | null

export function FragranceWheel() {
  const [sel, setSel] = useState<Selection>(null)
  const [hover, setHover] = useState<string | null>(null)
  const rot = useMotionValue(0)
  const counter = useTransform(rot, (r) => -r)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const openProduct = useUI((s) => s.openProduct)
  const setFilters = useFilters((s) => s.set)
  const resetFilters = useFilters((s) => s.reset)

  const matchCount = useMemo(() => {
    const m: Record<string, number> = {}
    WHEEL.forEach((f) => (m[f.id] = products.filter((p) => p.tags.families.includes(f.id)).length))
    ACCORDS.forEach((a) => (m[a.id] = products.filter((p) => hasAccord(p, a.id)).length))
    return m
  }, [])

  // rotate the selected segment to the top along the shortest path
  useEffect(() => {
    if (!sel) return
    const seg = SEGMENTS.find((s) => s.kind === sel.kind && s.id === sel.id)
    if (!seg) return
    const cur = rot.get()
    let delta = (-mid(seg) - cur) % 360
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360
    const ctl = animate(rot, cur + delta, { type: 'spring', stiffness: 60, damping: 16, mass: 1.1 })
    return () => ctl.stop()
  }, [sel, rot])

  const choose = (s: Seg) => {
    const off = sel?.id === s.id && sel.kind === s.kind
    setSel(off ? null : { kind: s.kind, id: s.id })
    // on phones the panel sits under the wheel: glide to it once the wheel has turned
    if (!off && window.innerWidth < 1024) setTimeout(() => scrollToId('wheel-panel'), 700)
  }

  const family = sel ? (sel.kind === 'family' ? WHEEL.find((f) => f.id === sel.id)! : ACCORDS.find((a) => a.id === sel.id)!.family) : null
  const accord = sel?.kind === 'accord' ? ACCORDS.find((a) => a.id === sel.id)! : null
  const matches = useMemo(() => {
    if (!sel) return []
    return products.filter((p) => (sel.kind === 'family' ? p.tags.families.includes(sel.id as WheelFamily['id']) : hasAccord(p, sel.id)))
  }, [sel])
  const typicalNotes = useMemo(() => {
    if (!sel) return []
    const keys = accord ? accord.keys : family!.accords.flatMap((a) => a.keys)
    const freq = new Map<string, number>()
    matches.forEach((p) =>
      allNotes(p).forEach((n) => {
        const l = n.toLowerCase()
        if (keys.some((k) => (k === 'уд' ? l === 'уд' : l.includes(k)))) freq.set(n, (freq.get(n) ?? 0) + 1)
      }),
    )
    return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([n]) => n)
  }, [sel, matches, accord, family])

  const showInCollection = () => {
    resetFilters()
    if (sel?.kind === 'family') setFilters({ family: sel.id as WheelFamily['id'] })
    else if (sel) setFilters({ accord: sel.id })
    // let the filter panel expand first, then glide to the collection
    setTimeout(() => scrollToId('collection'), 650)
  }

  return (
    <section id="wheel" className="relative overflow-hidden bg-ink py-24 sm:py-32" aria-labelledby="wheel-title">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 45% 55% at 30% 50%, rgba(201,169,110,0.09), transparent 70%)' }}
      />
      <div className="container-lux relative">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div data-reveal>
            <p className="eyebrow">Колесо ароматів</p>
            <h2 id="wheel-title" className="h-display mt-5 text-5xl sm:text-7xl">
              Мапа <em className="text-champagne">відчуттів</em>
            </h2>
          </div>
          <p data-reveal className="max-w-md text-sm leading-relaxed text-ivory/55">
            Кожен аромат — це поєднання акордів. Оберіть групу у центрі або акорд на зовнішньому колі, щоб побачити,
            які флакони його містять.
          </p>
        </div>

        <div ref={ref} className="mt-14 grid items-start gap-12 lg:grid-cols-12">
          {/* wheel */}
          <div className="relative mx-auto w-full max-w-[600px] lg:sticky lg:top-24 lg:col-span-7">
            {/* top marker */}
            <div className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-3 text-champagne" aria-hidden="true">
              <svg width="14" height="12" viewBox="0 0 14 12"><path d="M7 12 0 0h14z" fill="currentColor" /></svg>
            </div>
            <svg viewBox="-300 -300 600 600" className="h-auto w-full select-none overflow-visible" role="group" aria-label="Колесо ароматів">
              <defs>
                <filter id="wheel-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="wheel-core" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#2a2119" />
                  <stop offset="100%" stopColor="#0d0b0a" />
                </radialGradient>
              </defs>

              {/* ornamental rings & ticks */}
              <circle r={288} fill="none" stroke="rgba(201,169,110,0.25)" strokeWidth={0.8} />
              <circle r={294} fill="none" stroke="rgba(201,169,110,0.12)" strokeWidth={0.6} strokeDasharray="1 5" />

              <motion.g style={{ rotate: rot }}>
                {Array.from({ length: 72 }).map((_, i) => {
                  const [x0, y0] = pt(276, i * 5)
                  const [x1, y1] = pt(i % 6 === 0 ? 284 : 280, i * 5)
                  return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke="rgba(201,169,110,0.35)" strokeWidth={i % 6 === 0 ? 1 : 0.5} />
                })}

                {SEGMENTS.map((s, i) => {
                  const isAcc = s.kind === 'accord'
                  const active = sel?.kind === s.kind && sel.id === s.id
                  const related = sel && !active && (sel.kind === 'family' ? s.family.id === sel.id : s.kind === 'family' && family?.id === s.family.id)
                  const dim = sel && !active && !related
                  const hov = hover === s.kind + s.id
                  const m = mid(s)
                  const push = active ? 12 : hov ? 7 : 0
                  const [dx, dy] = pt(push, m)
                  const idx = isAcc ? s.family.accords.indexOf(s.accord!) : 0
                  const fill = isAcc ? shade(s.family.color, -0.12 + idx * 0.07) : shade(s.family.color, -0.22)
                  const [lx, ly] = pt(isAcc ? (R_OUT0 + R_OUT1) / 2 : (R_IN0 + R_IN1) / 2, m)
                  const label = isAcc ? s.accord!.label : s.family.label
                  return (
                    <motion.g
                      key={s.kind + s.id}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={inView ? { opacity: dim ? 0.35 : 1, scale: 1, x: dx, y: dy } : {}}
                      transition={{
                        opacity: { duration: 0.5, delay: inView && !sel ? 0.15 + i * 0.04 : 0 },
                        scale: { duration: 0.9, delay: 0.15 + i * 0.04, ease: [0.22, 1, 0.36, 1] },
                        x: { type: 'spring', stiffness: 300, damping: 22 },
                        y: { type: 'spring', stiffness: 300, damping: 22 },
                      }}
                      style={{ originX: '0px', originY: '0px' }}
                      role="button"
                      tabIndex={0}
                      aria-pressed={active}
                      aria-label={`${isAcc ? 'Акорд' : 'Група'}: ${label}, ${matchCount[s.id]} ${plural(matchCount[s.id], ['аромат', 'аромати', 'ароматів'])}`}
                      onClick={() => choose(s)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          choose(s)
                        }
                      }}
                      onMouseEnter={() => setHover(s.kind + s.id)}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover(s.kind + s.id)}
                      onBlur={() => setHover(null)}
                      className="cursor-pointer outline-none"
                      data-wheel={s.kind + ':' + s.id}
                    >
                      <path
                        d={isAcc ? sector(R_OUT0, R_OUT1, s.a0, s.a1) : sector(R_IN0, R_IN1, s.a0, s.a1)}
                        fill={fill}
                        stroke={active ? '#e3cc9a' : hov ? 'rgba(227,204,154,0.8)' : 'rgba(10,9,8,0.9)'}
                        strokeWidth={active ? 2 : 1}
                        filter={active ? 'url(#wheel-glow)' : undefined}
                        style={{ transition: 'stroke 0.3s' }}
                      />
                      {/* sheen */}
                      <path
                        d={isAcc ? sector(R_OUT1 - 10, R_OUT1, s.a0, s.a1) : sector(R_IN1 - 8, R_IN1, s.a0, s.a1)}
                        fill="rgba(255,240,215,0.12)"
                        pointerEvents="none"
                      />
                      <motion.g style={{ x: lx, y: ly, rotate: counter }} pointerEvents="none">
                        <text
                          textAnchor="middle"
                          fill="#f8f2e8"
                          style={{ fontFamily: isAcc ? 'Jost, sans-serif' : '"Playfair Display", serif' }}
                          fontSize={isAcc ? 13 : 17}
                          fontWeight={isAcc ? 500 : 400}
                          fontStyle={isAcc ? 'normal' : 'italic'}
                          letterSpacing={isAcc ? 0.6 : 0}
                        >
                          {lines(label).map((l, k, arr) => (
                            <tspan key={k} x={0} dy={k === 0 ? (arr.length > 1 ? -4 : 4) : 15}>
                              {l}
                            </tspan>
                          ))}
                        </text>
                        {isAcc && (
                          <text y={lines(label).length > 1 ? 28 : 21} textAnchor="middle" fill="rgba(248,242,232,0.55)" fontSize={10} style={{ fontFamily: 'Jost, sans-serif' }}>
                            {matchCount[s.id]}
                          </text>
                        )}
                      </motion.g>
                    </motion.g>
                  )
                })}
              </motion.g>

              {/* core */}
              <circle r={R_IN0 - 6} fill="url(#wheel-core)" stroke="rgba(201,169,110,0.5)" strokeWidth={1} />
              <AnimatePresence mode="wait">
                <motion.g
                  key={sel ? sel.kind + sel.id : 'none'}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.35 }}
                  pointerEvents="none"
                >
                  {sel ? (
                    <>
                      <text y={-2} textAnchor="middle" fill="#e3cc9a" fontSize={30} style={{ fontFamily: '"Playfair Display", serif' }}>
                        {matches.length}
                      </text>
                      <text y={18} textAnchor="middle" fill="rgba(248,242,232,0.6)" fontSize={9} letterSpacing={2} style={{ fontFamily: 'Jost, sans-serif' }}>
                        {plural(matches.length, ['АРОМАТ', 'АРОМАТИ', 'АРОМАТІВ'])}
                      </text>
                    </>
                  ) : (
                    <foreignObject x={-16} y={-24} width={32} height={48}>
                      <LogoMark className="h-full w-full text-champagne" />
                    </foreignObject>
                  )}
                </motion.g>
              </AnimatePresence>
            </svg>
          </div>

          {/* panel */}
          <div id="wheel-panel" className="min-h-[420px] lg:col-span-5" aria-live="polite">
            <AnimatePresence mode="wait">
              {!sel ? (
                <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                  <p className="font-serif text-3xl italic leading-snug text-ivory/85">
                    Почніть з відчуття, а не з бренду.
                  </p>
                  <ul className="mt-10 space-y-4">
                    {WHEEL.map((f) => (
                      <li key={f.id}>
                        <button
                          onClick={() => setSel({ kind: 'family', id: f.id })}
                          className="group flex w-full items-center gap-4 border-b border-ivory/10 pb-4 text-left"
                        >
                          <span className="h-3 w-3 shrink-0 rounded-full transition-transform duration-500 group-hover:scale-150" style={{ background: f.color }} />
                          <span className="flex-1">
                            <span className="block font-serif text-xl group-hover:text-champagne">{f.label}</span>
                            <span className="block text-xs text-ivory/45">{f.accords.map((a) => a.label).join(' · ')}</span>
                          </span>
                          <span className="text-[10px] text-ivory/40">{matchCount[f.id]}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : (
                <motion.div key={sel.kind + sel.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: family!.color }} />
                    <button onClick={() => setSel({ kind: 'family', id: family!.id })} className="eyebrow hover:text-champagne-light">
                      {family!.label}
                    </button>
                    {accord && <span className="eyebrow text-ivory/40">/ акорд</span>}
                  </div>
                  <h3 className="mt-4 font-serif text-5xl">{accord ? accord.label : family!.label}</h3>
                  <p className="mt-5 leading-relaxed text-ivory/60">{family!.mood}</p>

                  {typicalNotes.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {typicalNotes.map((n, i) => (
                        <motion.span
                          key={n}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + i * 0.05 }}
                          className="rounded-full border border-ivory/15 px-3 py-1 text-xs text-ivory/75"
                        >
                          {n}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  <ul className="mt-8 grid grid-cols-3 gap-3">
                    {matches.slice(0, 6).map((p, i) => (
                      <motion.li key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06, duration: 0.5 }}>
                        <button onClick={() => openProduct(p.id)} className="group block w-full text-left" aria-label={`${p.brand} ${p.name}`}>
                          <span className="block aspect-[4/5] overflow-hidden bg-[#15110e]">
                            <BottleImage id={p.id} alt="" className="transition-transform duration-700 group-hover:-translate-y-1 group-hover:scale-105" />
                          </span>
                          <span className="mt-2 block truncate text-[9px] uppercase tracking-wide2 text-champagne">{p.brand}</span>
                          <span className="block truncate font-serif text-sm group-hover:text-champagne">{p.name}</span>
                        </button>
                      </motion.li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button onClick={showInCollection} className="btn-gold btn-sweep">
                      Усі {matches.length} у колекції <ArrowIcon width={16} height={16} />
                    </button>
                    <button onClick={() => setSel(null)} className="text-[10px] uppercase tracking-wide2 text-ivory/50 hover:text-champagne">
                      ↺ Скинути
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
