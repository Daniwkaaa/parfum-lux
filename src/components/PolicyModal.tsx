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
    title: 'Доставка',
    body: [
      `Доставляємо по всій Україні Новою поштою — у відділення, поштомат або кур’єром до дверей. Замовлення, підтверджені в будні до 15:00, відправляємо того ж дня; доставка зазвичай триває 1–2 дні.`,
      `Вартість доставки — ${uah(site.shippingCost)}; для замовлень від ${uah(site.freeShippingFrom)} доставка безкоштовна.`,
      'Кожне замовлення пакуємо в захисну коробку й запечатуємо. Ви можете оглянути посилку у відділенні перед оплатою.',
    ],
  },
  payment: {
    title: 'Оплата',
    body: [
      'Оплата здійснюється під час отримання — готівкою або карткою у відділенні Нової пошти чи кур’єру.',
      'Онлайн-оплата карткою потребує підключеного платіжного сервісу й у цій демоверсії не діє. Сайт ніколи не запитує й не зберігає дані банківських карток.',
      'Усі ціни вказано в українських гривнях (₴).',
    ],
  },
  privacy: {
    title: 'Політика конфіденційності',
    body: [
      'Цей сайт — демонстраційний проєкт для портфоліо. Ваш кошик, обране, адреса для розсилки та демо-замовлення зберігаються лише у вашому браузері (localStorage) й ніколи не надсилаються на сервер.',
      'Ви можете будь-коли видалити ці дані, очистивши сховище браузера для цього сайту.',
      'Якщо бутик буде підключено до робочого бекенду, персональні дані (ім’я, телефон, адреса доставки) використовуватимуться виключно для виконання замовлення відповідно до Закону України «Про захист персональних даних».',
      site.email ? `Запитання: ${site.email}` : 'Запитання можна поставити через форму консьєржа в розділі «Контакти».',
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
          <button className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setPolicy(null)} aria-label="Закрити" tabIndex={-1} />
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
            <button className="icon-btn absolute right-4 top-4" onClick={() => setPolicy(null)} aria-label="Закрити">
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
