import { useEffect, useRef } from 'react'

/**
 * Calls `handler` on Escape. The listener is attached once (stable), so a
 * re-render during the key event can never detach it mid-dispatch.
 * Only the most recently activated layer reacts (stack), so nested dialogs
 * close one at a time.
 */
const stack: symbol[] = []

export function useEscape(handler: () => void, active = true) {
  const ref = useRef(handler)
  ref.current = handler
  useEffect(() => {
    if (!active) return
    const id = Symbol('esc')
    stack.push(id)
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || stack[stack.length - 1] !== id) return
      e.preventDefault()
      ref.current()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      const i = stack.indexOf(id)
      if (i >= 0) stack.splice(i, 1)
    }
  }, [active])
}
