import { useEffect, type RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]):not([tabindex="-1"]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

/** Moves focus into a dialog, keeps Tab inside it, and restores focus on close. */
export function useFocusTrap(ref: RefObject<HTMLElement>, active = true, initial?: string) {
  useEffect(() => {
    if (!active) return
    const prev = document.activeElement as HTMLElement | null
    const el = ref.current
    const t = setTimeout(() => {
      const target = (initial && el?.querySelector<HTMLElement>(initial)) || el?.querySelector<HTMLElement>(FOCUSABLE)
      target?.focus({ preventScroll: true })
    }, 60)
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !el) return
      const items = [...el.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((n) => n.offsetParent !== null || n === document.activeElement)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (!el.contains(document.activeElement)) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      if (prev && document.contains(prev)) prev.focus({ preventScroll: true })
    }
  }, [active, ref, initial])
}
