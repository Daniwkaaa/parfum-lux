import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckIcon } from './Icons'

const KEY = 'parfum-lux-demo-messages'
interface F { name: string; contact: string; topic: string; message: string }
type E = Partial<Record<keyof F, string>>

export function validateContact(f: F): E {
  const e: E = {}
  if (f.name.trim().length < 2) e.name = 'Please enter your name.'
  const c = f.contact.trim()
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c)
  const digits = c.replace(/\D/g, '')
  const isPhone = /^(380\d{9}|0\d{9})$/.test(digits) && /^[\d\s()+-]+$/.test(c)
  if (!isEmail && !isPhone) e.contact = 'Enter a valid email or Ukrainian phone number.'
  if (f.message.trim().length < 10) e.message = 'Please write at least 10 characters.'
  return e
}

export function ContactForm() {
  const [f, setF] = useState<F>({ name: '', contact: '', topic: 'Fragrance consultation', message: '' })
  const [errors, setErrors] = useState<E>({})
  const [sent, setSent] = useState(false)
  const upd = (k: keyof F, v: string) => {
    const n = { ...f, [k]: v }
    setF(n)
    if (Object.keys(errors).length) setErrors(validateContact(n))
  }
  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validateContact(f)
    setErrors(e)
    if (Object.keys(e).length) {
      document.getElementById(`cf-${Object.keys(e)[0]}`)?.focus()
      return
    }
    try {
      const prev = JSON.parse(localStorage.getItem(KEY) || '[]')
      localStorage.setItem(KEY, JSON.stringify([...prev, { ...f, createdAt: new Date().toISOString() }]))
    } catch {
      /* storage unavailable */
    }
    setSent(true)
  }
  const cls = (k: keyof F) => `field ${errors[k] ? 'field-error' : ''}`

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div key="ok" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-4" role="status">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-champagne text-champagne">
            <CheckIcon />
          </span>
          <div>
            <p className="font-serif text-2xl font-light">Thank you, {f.name.trim().split(/\s+/)[0]}.</p>
            <p className="mt-2 text-sm text-ivory/55">
              Your request was saved in this demo. Connect a backend or form service to receive messages.
            </p>
            <button
              className="mt-4 text-[10px] uppercase tracking-wide2 text-champagne hover:underline"
              onClick={() => {
                setSent(false)
                setF({ name: '', contact: '', topic: 'Fragrance consultation', message: '' })
              }}
            >
              Send another request
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.form key="form" exit={{ opacity: 0 }} onSubmit={submit} noValidate className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-name" className="text-[10px] uppercase tracking-wide2 text-ivory/50">Name *</label>
            <input id="cf-name" className={cls('name')} value={f.name} onChange={(e) => upd('name', e.target.value)} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'cf-name-err' : undefined} />
            {errors.name && <p id="cf-name-err" role="alert" className="mt-1.5 text-xs text-red-300">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="cf-contact" className="text-[10px] uppercase tracking-wide2 text-ivory/50">Email or phone *</label>
            <input id="cf-contact" className={cls('contact')} value={f.contact} onChange={(e) => upd('contact', e.target.value)} aria-invalid={!!errors.contact} aria-describedby={errors.contact ? 'cf-contact-err' : undefined} />
            {errors.contact && <p id="cf-contact-err" role="alert" className="mt-1.5 text-xs text-red-300">{errors.contact}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="cf-topic" className="text-[10px] uppercase tracking-wide2 text-ivory/50">Topic</label>
            <select id="cf-topic" className="field cursor-pointer bg-transparent" value={f.topic} onChange={(e) => upd('topic', e.target.value)}>
              <option>Fragrance consultation</option>
              <option>Showroom appointment</option>
              <option>Order &amp; delivery</option>
              <option>Corporate gifting</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="cf-message" className="text-[10px] uppercase tracking-wide2 text-ivory/50">Message *</label>
            <textarea id="cf-message" rows={3} maxLength={800} className={`${cls('message')} resize-none`} value={f.message} onChange={(e) => upd('message', e.target.value)} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'cf-message-err' : undefined} />
            {errors.message && <p id="cf-message-err" role="alert" className="mt-1.5 text-xs text-red-300">{errors.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-line">Send to the concierge</button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
