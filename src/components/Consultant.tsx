import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getProduct, minPrice } from '../data/products'
import { samplePrice } from '../data/meta'
import { consult, emptyPrefs, PRODUCT_IDS, type ConsultantReply, type Prefs } from '../lib/consultant'
import { uah } from '../lib/format'
import { useEscape } from '../lib/useEscape'
import { useFocusTrap } from '../lib/useFocusTrap'
import { useShop, useUI } from '../store/shop'
import { BottleImage } from './ProductCard'
import { LogoMark } from './Logo'
import { ArrowIcon, CloseIcon } from './Icons'

interface Msg {
  id: number
  role: 'user' | 'assistant'
  text: string
  picks?: ConsultantReply['picks']
  suggestions?: string[]
}

const GREETING: Msg = {
  id: 0,
  role: 'assistant',
  text: 'Вітаю в ÉLIXIR. Опишіть, який аромат шукаєте — для кого, на яку нагоду, які відчуття подобаються чи чого не хочеться. Або назвіть улюблений аромат, і я знайду схожі.',
  suggestions: ['Щось на побачення, але не солодке', 'Свіжий аромат для офісу до 7 000 ₴', 'Схоже на Baccarat Rouge 540', 'Подарунок для нього на зиму'],
}

/* ---------------- AI endpoint (Netlify Function) ---------------- */

// The AI endpoint exists only on Netlify builds made with VITE_AI_CONSULTANT=1
// (see README); everywhere else the offline consultant answers directly.
const AI_ENABLED = import.meta.env.VITE_AI_CONSULTANT === '1'
let aiAvailable: boolean | null = AI_ENABLED ? null : false // learned per page load

async function askAI(history: Msg[]): Promise<ConsultantReply | null> {
  if (aiAvailable === false || !/^https?:$/.test(location.protocol)) return null
  try {
    const res = await fetch('/api/consultant', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        messages: history
          .filter((m) => m.id !== 0)
          .map((m) => ({
            role: m.role,
            content:
              m.role === 'assistant' && m.picks?.length
                ? `${m.text}\nПорадив: ${m.picks.map((p) => getProduct(p.id)?.name).join(', ')}`
                : m.text,
          })),
      }),
      signal: AbortSignal.timeout(30000),
    })
    if (!res.ok) {
      if (res.status === 404 || res.status === 503) aiAvailable = false
      return null
    }
    const data = (await res.json()) as ConsultantReply
    if (typeof data.reply !== 'string' || !Array.isArray(data.picks)) return null
    aiAvailable = true
    return { reply: data.reply, picks: data.picks.filter((p) => PRODUCT_IDS.has(p.id)).slice(0, 3) }
  } catch {
    return null
  }
}

/* ---------------- UI ---------------- */

function PickCard({ id, why, onOpen }: { id: string; why: string; onOpen: (id: string) => void }) {
  const p = getProduct(id)
  const add = useShop((s) => s.add)
  const notify = useUI((s) => s.notify)
  if (!p) return null
  return (
    <div className="flex gap-3 border border-ivory/10 bg-ink/60 p-2.5">
      <button onClick={() => onOpen(id)} className="h-24 w-[72px] shrink-0 bg-[#15110e]" aria-label={`Детальніше: ${p.name}`}>
        <BottleImage id={id} alt="" />
      </button>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="eyebrow truncate text-[8px]">{p.brand}</span>
        <button onClick={() => onOpen(id)} className="text-left font-serif text-[15px] leading-tight hover:text-champagne">
          {p.name}
        </button>
        <p className="mt-1 text-[11.5px] leading-snug text-ivory/60">{why}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="font-serif text-sm text-champagne">від {uah(minPrice(p))}</span>
          <button
            onClick={() => {
              add(id, 2)
              notify(`${p.name} · пробник 2 мл додано до кошика`)
            }}
            className="rounded-full border border-champagne/40 px-2.5 py-1 text-[10px] text-champagne-light transition-colors hover:border-champagne hover:bg-champagne/10"
          >
            + Пробник · {uah(samplePrice(p, 2))}
          </button>
        </div>
      </div>
    </div>
  )
}

function Typing() {
  return (
    <div className="flex items-center gap-3 px-1 py-2 text-[11px] text-ivory/45" role="status" aria-label="Консультант підбирає аромати">
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-champagne"
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </span>
      підбираю аромати…
    </div>
  )
}

export function Consultant() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [mode, setMode] = useState<'ai' | 'local' | null>(null)
  const [teaser, setTeaser] = useState(false)
  const prefs = useRef<Prefs>(emptyPrefs())
  const shown = useRef<string[]>([])
  const list = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const { product, panel: uiPanel, openProduct } = useUI()

  useEscape(() => setOpen(false), open)
  useFocusTrap(panel, open, 'textarea')

  // one gentle teaser per session
  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem('elixir-consultant-teaser') === '1'
    } catch {
      /* ignore */
    }
    if (seen) return
    const t = setTimeout(() => setTeaser(true), 9000)
    return () => clearTimeout(t)
  }, [])
  const dismissTeaser = () => {
    setTeaser(false)
    try {
      sessionStorage.setItem('elixir-consultant-teaser', '1')
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, busy])

  const send = async (text: string) => {
    const q = text.trim()
    if (!q || busy) return
    if (/^почати спочатку$/i.test(q)) {
      prefs.current = emptyPrefs()
      shown.current = []
      setMsgs([GREETING])
      setInput('')
      return
    }
    const userMsg: Msg = { id: Date.now(), role: 'user', text: q }
    const history = [...msgs, userMsg]
    setMsgs(history)
    setInput('')
    setBusy(true)
    const started = performance.now()

    let reply = await askAI(history)
    let usedMode: 'ai' | 'local' = 'ai'
    if (!reply) {
      const r = consult(q, prefs.current, shown.current)
      prefs.current = r.prefs
      reply = r.reply
      usedMode = 'local'
    }
    // a short, natural pause even when the answer is instant
    const wait = 650 - (performance.now() - started)
    if (wait > 0) await new Promise((r) => setTimeout(r, wait))
    shown.current = [...shown.current, ...reply.picks.map((p) => p.id)]
    setMode(usedMode)
    setMsgs((m) => [
      ...m,
      {
        id: Date.now() + 1,
        role: 'assistant',
        text: reply!.reply,
        picks: reply!.picks,
        suggestions: reply!.suggestions ?? (usedMode === 'ai' ? ['Покажіть ще варіанти', 'А щось дешевше?', 'Хочу пробники'] : undefined),
      },
    ])
    setBusy(false)
  }

  const openFromChat = (id: string) => {
    setOpen(false)
    openProduct(id)
  }

  // never cover a drawer, modal or the mobile menu
  const hidden = !!product || uiPanel !== null
  const last = msgs[msgs.length - 1]

  return (
    <>
      {/* launcher */}
      <AnimatePresence>
        {!open && !hidden && (
          <motion.div
            className="fixed bottom-5 right-5 z-[65] flex items-end gap-3 sm:bottom-8 sm:right-8"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <AnimatePresence>
              {teaser && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="relative mb-2 max-w-[220px] border border-champagne/30 bg-ink-700/95 px-4 py-3 text-[13px] leading-snug shadow-2xl backdrop-blur"
                >
                  <button
                    onClick={() => {
                      dismissTeaser()
                      setOpen(true)
                    }}
                    className="text-left"
                  >
                    Підібрати аромат за 30 секунд? <span className="text-champagne">Запитайте мене</span>
                  </button>
                  <button onClick={dismissTeaser} className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-ink-600 text-ivory/60 hover:text-champagne" aria-label="Сховати підказку">
                    <CloseIcon width={10} height={10} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => {
                dismissTeaser()
                setOpen(true)
              }}
              className="group relative grid h-14 w-14 place-items-center rounded-full border border-champagne/60 bg-ink shadow-[0_10px_40px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:scale-105 sm:h-16 sm:w-16"
              aria-label="Відкрити консультанта з вибору аромату"
            >
              <span className="absolute inset-0 animate-[breathe_3.2s_ease-in-out_infinite] rounded-full shadow-[0_0_0_0_rgba(201,169,110,0.45)]" />
              <LogoMark className="h-7 w-auto text-champagne transition-transform duration-500 group-hover:-translate-y-0.5" />
              <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full border border-ivory/10 bg-ink-700/95 px-3 py-1.5 text-[10px] uppercase tracking-wide2 text-ivory/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Консультант
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="false"
            aria-label="Консультант ÉLIXIR"
            className="fixed inset-0 z-[66] flex flex-col overflow-hidden border-champagne/25 bg-ink-800/95 shadow-[0_30px_80px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:inset-auto sm:bottom-8 sm:right-8 sm:h-[min(680px,calc(100vh-4rem))] sm:w-[420px] sm:border"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'bottom right' }}
          >
            {/* header */}
            <div className="relative flex items-center gap-3 border-b border-ivory/10 px-5 py-4">
              <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{ background: 'radial-gradient(ellipse 60% 120% at 0% 0%, rgba(201,169,110,0.18), transparent 70%)' }}
              />
              <span className="relative grid h-10 w-10 place-items-center rounded-full border border-champagne/50 bg-ink">
                <LogoMark className="h-5 w-auto text-champagne" />
              </span>
              <div className="relative flex-1">
                <p className="font-serif text-lg leading-none">Консультант ÉLIXIR</p>
                <p className="mt-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-wide2 text-ivory/45">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                  {mode === 'ai' ? 'ШІ-консультант' : mode === 'local' ? 'Підбір за вашим описом' : 'На зв’язку'}
                </p>
              </div>
              <button className="icon-btn relative" onClick={() => setOpen(false)} aria-label="Закрити консультанта">
                <CloseIcon />
              </button>
            </div>

            {/* messages */}
            <div ref={list} className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5" data-lenis-prevent aria-live="polite">
              {msgs.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className={m.role === 'user' ? 'flex justify-end' : ''}
                >
                  {m.role === 'user' ? (
                    <p className="max-w-[85%] border border-champagne/30 bg-champagne/10 px-4 py-2.5 text-sm text-ivory">{m.text}</p>
                  ) : (
                    <div className="space-y-3">
                      <p className="max-w-[92%] text-sm leading-relaxed text-ivory/85">{m.text}</p>
                      {m.picks && m.picks.length > 0 && (
                        <div className="space-y-2">
                          {m.picks.map((p, i) => (
                            <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
                              <PickCard id={p.id} why={p.why} onOpen={openFromChat} />
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
              {busy && <Typing />}
            </div>

            {/* suggestions */}
            {!busy && last.role === 'assistant' && last.suggestions && (
              <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
                {last.suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="shrink-0 rounded-full border border-ivory/15 px-3 py-1.5 text-[11.5px] text-ivory/75 transition-colors hover:border-champagne/60 hover:text-champagne"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
              className="flex items-end gap-2 border-t border-ivory/10 px-4 py-3"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 600))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send(input)
                  }
                }}
                rows={1}
                placeholder="Наприклад: свіжий, для нього, до 6 000 ₴"
                aria-label="Ваше повідомлення консультанту"
                className="max-h-28 min-h-[44px] flex-1 resize-none border-b border-ivory/20 bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-champagne focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || busy}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-champagne text-ink transition-all hover:bg-champagne-light disabled:opacity-30"
                aria-label="Надіслати"
              >
                <ArrowIcon width={18} height={18} />
              </button>
            </form>
            <p className="px-4 pb-3 text-[9.5px] leading-snug text-ivory/30">
              Рекомендації — лише з колекції ÉLIXIR. Ноти й характеристики варто перевірити на шкірі — почніть із пробника.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
