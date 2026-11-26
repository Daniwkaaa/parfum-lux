import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { getProduct } from '../data/products'
import { linePrice, useCartTotals, useShop, useUI, type CartLine } from '../store/shop'
import { uah } from '../lib/format'
import { CartLines, Totals } from './CartDrawer'
import { CheckIcon, CloseIcon } from './Icons'

type Delivery = 'branch' | 'courier'
interface Form {
  name: string
  phone: string
  email: string
  city: string
  delivery: Delivery
  branch: string
  address: string
  comment: string
  agree: boolean
}
type Errors = Partial<Record<keyof Form, string>>

const initial: Form = {
  name: '',
  phone: '+380 ',
  email: '',
  city: '',
  delivery: 'branch',
  branch: '',
  address: '',
  comment: '',
  agree: false,
}

const phoneDigits = (v: string) => v.replace(/\D/g, '')

export function normalizePhone(v: string) {
  let d = phoneDigits(v)
  if (d.length === 10 && d.startsWith('0')) d = '38' + d
  return d
}

export function validate(f: Form): Errors {
  const e: Errors = {}
  const name = f.name.trim()
  if (!name) e.name = 'Please enter your full name.'
  else if (name.split(/\s+/).length < 2) e.name = 'Please enter both first and last name.'
  else if (!/^[\p{L}\s'’-]+$/u.test(name)) e.name = 'Name may contain letters, spaces, apostrophes and hyphens only.'

  const d = normalizePhone(f.phone)
  if (!/^380\d{9}$/.test(d)) e.phone = 'Enter a Ukrainian number, e.g. +380 67 123 45 67.'

  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Please enter a valid email address.'

  if (f.city.trim().length < 2) e.city = 'Please enter your city.'
  if (f.delivery === 'branch') {
    if (!/^\d{1,5}$/.test(f.branch.trim())) e.branch = 'Enter the Nova Poshta branch number (digits only).'
  } else if (f.address.trim().length < 6) e.address = 'Please enter street, building and apartment.'
  if (!f.agree) e.agree = 'Please accept the privacy policy to continue.'
  return e
}

const formatPhone = (v: string) => {
  let d = phoneDigits(v)
  if (!d.startsWith('380')) d = '380' + d.replace(/^3?8?0?/, '')
  d = d.slice(0, 12)
  const p = [d.slice(0, 3), d.slice(3, 5), d.slice(5, 8), d.slice(8, 10), d.slice(10, 12)].filter(Boolean)
  return '+' + p.join(' ')
}

function Field({ label, error, children, id }: { label: string; error?: string; children: ReactNode; id: string }) {
  return (
    <div>
      <label htmlFor={id} className="text-[10px] uppercase tracking-wide2 text-ivory/50">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-xs text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

interface Placed {
  number: string
  name: string
  total: number
  lines: CartLine[]
  delivery: string
}

export function Checkout() {
  const { setPanel, setPolicy } = useUI()
  const cart = useShop((s) => s.cart)
  const clear = useShop((s) => s.clear)
  const { count, total } = useCartTotals()
  const [f, setF] = useState<Form>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState(false)
  const [busy, setBusy] = useState(false)
  const [placed, setPlaced] = useState<Placed | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !busy && setPanel(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy, setPanel])

  const upd = <K extends keyof Form>(k: K, v: Form[K]) => {
    const next = { ...f, [k]: v }
    setF(next)
    if (touched) setErrors(validate(next))
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setTouched(true)
    const e = validate(f)
    setErrors(e)
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0]
      document.getElementById(`co-${first}`)?.focus()
      return
    }
    setBusy(true)
    await new Promise((r) => setTimeout(r, 1400))
    const number = 'PL-' + Date.now().toString(36).toUpperCase().slice(-6)
    const order: Placed = {
      number,
      name: f.name.trim().split(/\s+/)[0],
      total,
      lines: cart,
      delivery:
        f.delivery === 'branch'
          ? `Nova Poshta branch №${f.branch.trim()}, ${f.city.trim()}`
          : `Courier — ${f.address.trim()}, ${f.city.trim()}`,
    }
    try {
      const prev = JSON.parse(localStorage.getItem('parfum-lux-demo-orders') || '[]')
      localStorage.setItem(
        'parfum-lux-demo-orders',
        JSON.stringify([...prev, { ...order, createdAt: new Date().toISOString() }]),
      )
    } catch {
      /* storage unavailable — demo still completes */
    }
    setPlaced(order)
    clear()
    setBusy(false)
  }

  const inputCls = (k: keyof Form) => `field ${errors[k] ? 'field-error' : ''}`
  const aria = (k: keyof Form) => ({
    id: `co-${k}`,
    'aria-invalid': !!errors[k],
    'aria-describedby': errors[k] ? `co-${k}-err` : undefined,
  })

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-ink"
      data-lenis-prevent
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
    >
      <div className="container-lux py-6">
        <div className="flex items-center justify-between">
          <span className="font-serif text-xl uppercase tracking-[0.28em]">
            Parfum<span className="text-champagne"> Lux</span>
          </span>
          <button className="icon-btn" onClick={() => !busy && setPanel(null)} aria-label="Close checkout">
            <CloseIcon />
          </button>
        </div>

        {placed ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-2xl py-16 text-center sm:py-24"
          >
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-champagne text-champagne">
              <CheckIcon width={28} height={28} />
            </span>
            <p className="eyebrow mt-8">Demo order confirmed</p>
            <h2 id="checkout-title" className="h-display mt-5 text-5xl sm:text-6xl">
              Thank you, {placed.name}
            </h2>
            <p className="mt-6 text-ivory/60">
              Your demo order <span className="text-champagne">{placed.number}</span> has been recorded in this browser.
            </p>
            <div className="mx-auto mt-10 max-w-md border border-ivory/10 p-6 text-left">
              <ul className="space-y-2 text-sm">
                {placed.lines.map((l) => {
                  const p = getProduct(l.id)
                  return (
                    <li key={`${l.id}-${l.ml}`} className="flex justify-between gap-4 text-ivory/70">
                      <span>
                        {p?.name} · {l.ml} ml × {l.qty}
                      </span>
                      <span>{uah(linePrice(l))}</span>
                    </li>
                  )
                })}
              </ul>
              <p className="mt-4 border-t border-ivory/10 pt-4 text-sm text-ivory/50">{placed.delivery}</p>
              <p className="mt-2 flex justify-between font-serif text-2xl">
                <span>Total</span>
                <span className="text-champagne">{uah(placed.total)}</span>
              </p>
            </div>
            <p className="mx-auto mt-8 max-w-md text-xs leading-relaxed text-ivory/40">
              This boutique is a portfolio demonstration: no payment was taken and the order was not transmitted to any
              store or courier. Connect a backend and payment provider to process real orders.
            </p>
            <button className="btn-gold mt-10" onClick={() => setPanel(null)}>
              Continue Exploring
            </button>
          </motion.div>
        ) : count === 0 ? (
          <div className="py-32 text-center">
            <h2 id="checkout-title" className="h-display text-5xl">Your bag is empty</h2>
            <button className="btn-line mt-10" onClick={() => setPanel(null)}>
              Back to the boutique
            </button>
          </div>
        ) : (
          <div className="grid gap-12 py-10 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
            <form onSubmit={submit} noValidate>
              <p className="eyebrow">Checkout</p>
              <h2 id="checkout-title" className="h-display mt-4 text-5xl sm:text-6xl">Delivery details</h2>

              <div className="mt-12 grid gap-8 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Full name *" error={errors.name} id="co-name">
                    <input {...aria('name')} className={inputCls('name')} value={f.name} onChange={(e) => upd('name', e.target.value)} autoComplete="name" placeholder="Olena Kovalenko" />
                  </Field>
                </div>
                <Field label="Phone *" error={errors.phone} id="co-phone">
                  <input
                    {...aria('phone')}
                    className={inputCls('phone')}
                    value={f.phone}
                    onChange={(e) => upd('phone', formatPhone(e.target.value))}
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+380 67 123 45 67"
                  />
                </Field>
                <Field label="Email (optional)" error={errors.email} id="co-email">
                  <input {...aria('email')} type="email" className={inputCls('email')} value={f.email} onChange={(e) => upd('email', e.target.value)} autoComplete="email" placeholder="you@example.com" />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="City *" error={errors.city} id="co-city">
                    <input {...aria('city')} className={inputCls('city')} value={f.city} onChange={(e) => upd('city', e.target.value)} autoComplete="address-level2" placeholder="Kyiv" />
                  </Field>
                </div>

                <fieldset className="sm:col-span-2">
                  <legend className="text-[10px] uppercase tracking-wide2 text-ivory/50">Delivery method *</legend>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {(
                      [
                        ['branch', 'Nova Poshta branch', '1–2 days'],
                        ['courier', 'Courier to door', '1–2 days · Kyiv same day'],
                      ] as const
                    ).map(([v, t, s]) => (
                      <label
                        key={v}
                        className={`cursor-pointer border p-4 transition-colors ${f.delivery === v ? 'border-champagne bg-champagne/5' : 'border-ivory/15 hover:border-ivory/35'}`}
                      >
                        <input type="radio" name="delivery" className="sr-only" checked={f.delivery === v} onChange={() => upd('delivery', v)} />
                        <span className="block text-sm">{t}</span>
                        <span className="block text-[11px] text-ivory/45">{s}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="sm:col-span-2">
                  {f.delivery === 'branch' ? (
                    <Field label="Branch number *" error={errors.branch} id="co-branch">
                      <input {...aria('branch')} className={inputCls('branch')} value={f.branch} onChange={(e) => upd('branch', e.target.value.replace(/\D/g, '').slice(0, 5))} inputMode="numeric" placeholder="e.g. 24" />
                    </Field>
                  ) : (
                    <Field label="Delivery address *" error={errors.address} id="co-address">
                      <input {...aria('address')} className={inputCls('address')} value={f.address} onChange={(e) => upd('address', e.target.value)} autoComplete="street-address" placeholder="Street, building, apartment" />
                    </Field>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Field label="Comment for the concierge" id="co-comment">
                    <textarea id="co-comment" className="field resize-none" rows={2} value={f.comment} onChange={(e) => upd('comment', e.target.value)} placeholder="Gift wrapping, preferred delivery time…" maxLength={400} />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-[10px] uppercase tracking-wide2 text-ivory/50">Payment</p>
                  <p className="mt-3 border border-ivory/15 p-4 text-sm text-ivory/70">
                    Payment on receipt (cash or card) — online payment requires a connected payment provider and is not
                    active in this demo.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-ivory/70">
                    <input
                      {...aria('agree')}
                      type="checkbox"
                      checked={f.agree}
                      onChange={(e) => upd('agree', e.target.checked)}
                      className="mt-1 h-4 w-4 accent-[#c9a96e]"
                    />
                    <span>
                      I agree to the{' '}
                      <button type="button" className="text-champagne underline underline-offset-4" onClick={() => setPolicy('privacy')}>
                        privacy policy
                      </button>{' '}
                      and the processing of my data for this order.
                    </span>
                  </label>
                  {errors.agree && <p id="co-agree-err" className="mt-1.5 text-xs text-red-300" role="alert">{errors.agree}</p>}
                </div>
              </div>

              <button type="submit" disabled={busy} className="btn-gold btn-sweep mt-12 w-full sm:w-auto">
                {busy ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border border-ink border-t-transparent" /> Placing order…
                  </>
                ) : (
                  <>Place Demo Order · {uah(total)}</>
                )}
              </button>
              <p className="mt-4 text-xs text-ivory/40">
                Demo checkout: no payment is taken and no order is sent to a store.
              </p>
            </form>

            <aside className="h-fit border border-ivory/10 bg-ink-800 p-6 lg:sticky lg:top-8">
              <h3 className="font-serif text-2xl font-light">Order summary</h3>
              <div className="mt-4">
                <CartLines />
              </div>
              <div className="mt-6 border-t border-ivory/10 pt-6">
                <Totals />
              </div>
            </aside>
          </div>
        )}
      </div>
    </motion.div>
  )
}
