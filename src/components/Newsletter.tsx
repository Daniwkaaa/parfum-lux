import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowIcon, CheckIcon } from './Icons'

const KEY = 'parfum-lux-newsletter'
const valid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid(email)) return setError('Please enter a valid email address.')
    try {
      const list: string[] = JSON.parse(localStorage.getItem(KEY) || '[]')
      if (list.includes(email.trim().toLowerCase())) {
        setError('This address is already on our list.')
        return
      }
      localStorage.setItem(KEY, JSON.stringify([...list, email.trim().toLowerCase()]))
    } catch {
      /* storage unavailable */
    }
    setError('')
    setDone(true)
  }

  return (
    <section id="newsletter" className="relative overflow-hidden bg-cocoa py-24 sm:py-32" aria-labelledby="nl-title">
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 20% 0%, rgba(201,169,110,0.22), transparent 60%)' }} />
      <div className="container-lux relative grid items-end gap-12 lg:grid-cols-2">
        <div data-reveal>
          <p className="eyebrow text-champagne-light">The Letter</p>
          <h2 id="nl-title" className="h-display mt-5 text-5xl sm:text-7xl">
            Private news, <em className="text-champagne-light">first</em>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory/65">
            New arrivals, limited editions and invitations to private discovery evenings. One letter a month — never
            more.
          </p>
        </div>
        <div data-reveal>
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="ok" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-4" role="status">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-champagne text-champagne">
                  <CheckIcon />
                </span>
                <div>
                  <p className="font-serif text-3xl font-light">Welcome to the circle.</p>
                  <p className="mt-2 text-sm text-ivory/60">
                    {email.trim()} has been saved in this demo. Connect an email service to send real letters.
                  </p>
                  <button className="mt-4 text-[10px] uppercase tracking-wide2 text-champagne-light hover:underline" onClick={() => { setDone(false); setEmail('') }}>
                    Subscribe another address
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" exit={{ opacity: 0, y: -20 }} onSubmit={submit} noValidate>
                <label htmlFor="nl-email" className="text-[10px] uppercase tracking-wide2 text-ivory/60">Email address</label>
                <div className={`mt-2 flex items-center border-b ${error ? 'border-red-300' : 'border-ivory/30 focus-within:border-champagne-light'}`}>
                  <input
                    id="nl-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError('') }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={!!error}
                    aria-describedby={error ? 'nl-err' : undefined}
                    className="w-full bg-transparent py-4 font-serif text-2xl font-light placeholder:text-ivory/30 focus:outline-none"
                  />
                  <button type="submit" className="flex items-center gap-2 py-4 pl-4 text-[10px] font-semibold uppercase tracking-wide2 text-champagne-light hover:text-ivory">
                    Subscribe <ArrowIcon width={16} height={16} />
                  </button>
                </div>
                {error && <p id="nl-err" role="alert" className="mt-2 text-xs text-red-300">{error}</p>}
                <p className="mt-4 text-[11px] text-ivory/40">You can unsubscribe at any time.</p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
