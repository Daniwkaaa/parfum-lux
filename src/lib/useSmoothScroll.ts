import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll(locked: boolean) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    let t: ReturnType<typeof setTimeout>
    let lastH = document.body.scrollHeight
    const ro = new ResizeObserver(() => {
      const h = document.body.scrollHeight
      if (Math.abs(h - lastH) < 2) return
      lastH = h
      clearTimeout(t)
      t = setTimeout(() => {
        lenis.resize()
        ScrollTrigger.refresh()
      }, 150)
    })
    ro.observe(document.body)
    return () => {
      ro.disconnect()
      clearTimeout(t)
      gsap.ticker.remove(tick)
      lenis.destroy()
      delete (window as unknown as { __lenis?: Lenis }).__lenis
    }
  }, [])

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis
    if (locked) {
      lenis?.stop()
      document.documentElement.style.overflow = 'hidden'
    } else {
      lenis?.start()
      document.documentElement.style.overflow = ''
    }
  }, [locked])
}

/** Fade/slide-in for any element with [data-reveal]; stagger children with [data-reveal-stagger]. */
export function useRevealAnimations(deps: unknown[] = []) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.3,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        )
      })
      gsap.utils.toArray<HTMLElement>('[data-reveal-stagger]').forEach((el) => {
        gsap.fromTo(
          el.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.08,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        )
      })
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const amt = Number(el.dataset.parallax) || 80
        gsap.fromTo(
          el,
          { y: amt },
          { y: -amt, ease: 'none', scrollTrigger: { trigger: el, scrub: true } },
        )
      })
    })
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

