import { Suspense, lazy, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { heroState } from '../three/heroState'
import { scrollToId } from '../lib/format'
import { useWebGL } from '../lib/useWebGL'
import { ArrowIcon, RotateIcon } from './Icons'

gsap.registerPlugin(ScrollTrigger)
const HeroScene = lazy(() => import('../three/HeroScene'))

function HeroFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <img
        src="/bottles/signature.webp"
        alt="Parfum Lux signature flacon"
        className="h-[62%] w-auto object-contain opacity-90"
      />
    </div>
  )
}

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const webgl = useWebGL()

  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      gsap.set('[data-hero-line]', { yPercent: 110 })
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.to('[data-hero-line]', { yPercent: 0, duration: 1.6, stagger: 0.12 }, 0.2)
        .from('[data-hero-fade]', { opacity: 0, y: 24, duration: 1.2, stagger: 0.1 }, 0.9)
        .from('[data-hero-rule]', { scaleX: 0, duration: 1.4, transformOrigin: 'left' }, 0.8)

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => (heroState.progress = self.progress),
      })
      gsap.to('[data-hero-l1]', { xPercent: -18, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('[data-hero-l3]', { xPercent: 14, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('[data-hero-content]', { opacity: 0, y: -80, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: '70% top', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section
      id="home"
      ref={root}
      className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink"
      aria-label="The Art of Exceptional Fragrance"
    >
      {/* 3D */}
      <div className="absolute inset-0 [@media(pointer:coarse)]:pointer-events-none" aria-hidden="true">
        {webgl ? (
          <Suspense fallback={<HeroFallback />}>
            <HeroScene />
          </Suspense>
        ) : (
          <HeroFallback />
        )}
      </div>

      {/* cinematic light & vignette */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background:
            'radial-gradient(ellipse 40% 55% at 50% 45%, rgba(201,169,110,0.16), transparent 70%), radial-gradient(ellipse 25% 40% at 80% 10%, rgba(255,226,176,0.08), transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(10,9,8,0.85) 100%)' }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />

      {/* Editorial type */}
      <div data-hero-content className="pointer-events-none relative z-10 flex h-full flex-col justify-between pb-8 pt-28 sm:pb-10 sm:pt-32">
        <div className="container-lux">
          <div data-hero-fade className="flex items-center gap-4">
            <span className="eyebrow">Maison Parfum Lux</span>
            <span data-hero-rule className="h-px w-16 bg-champagne/50" />
            <span className="eyebrow text-ivory/50">Kyiv</span>
          </div>
        </div>

        <h1 className="relative mt-auto select-none pb-6 font-serif font-light uppercase leading-[0.86] [text-shadow:0_2px_30px_rgba(10,9,8,0.6)] sm:mt-0 sm:pb-0">
          <span className="container-lux block overflow-hidden">
            <span data-hero-l1 className="block">
              <span data-hero-line className="block text-[11vw] tracking-[-0.01em] text-ivory sm:text-[8vw] lg:text-[6.4vw]">
                The Art of
              </span>
            </span>
          </span>
          <span className="block overflow-hidden px-2 text-center">
            <span data-hero-line className="text-outline block text-[14.5vw] italic tracking-[-0.02em] lg:text-[12.5vw]">
              Exceptional
            </span>
          </span>
          <span className="container-lux block overflow-hidden text-right">
            <span data-hero-l3 className="block">
              <span data-hero-line className="block text-[11vw] tracking-[-0.01em] text-ivory sm:text-[8vw] lg:text-[6.4vw]">
                Fragrance
              </span>
            </span>
          </span>
        </h1>

        <div className="container-lux flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-sm">
            <p data-hero-fade className="font-serif text-xl italic text-ivory/80 sm:text-2xl">
              Discover the world of extraordinary scents.
            </p>
            <button
              data-hero-fade
              onClick={() => scrollToId('collection')}
              className="btn-gold btn-sweep pointer-events-auto mt-6"
            >
              Explore Collection <ArrowIcon width={16} height={16} />
            </button>
          </div>
          <div data-hero-fade className="hidden items-center gap-8 sm:flex">
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-luxe text-ivory/50 [@media(pointer:coarse)]:hidden">
              <RotateIcon width={14} height={14} /> Drag to rotate
            </span>
            <button
              onClick={() => scrollToId('collection')}
              className="pointer-events-auto flex items-center gap-3 text-[10px] uppercase tracking-luxe text-ivory/60 hover:text-champagne"
              aria-label="Scroll to collection"
            >
              Scroll
              <span className="relative block h-12 w-px overflow-hidden bg-ivory/15">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2s_ease-in-out_infinite] bg-champagne" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
