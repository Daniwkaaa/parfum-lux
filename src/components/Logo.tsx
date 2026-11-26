/** ÉLIXIR identity: a single drop of perfume, drawn in one hairline, beside a widely tracked wordmark. */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 30" className={className} fill="none" aria-hidden="true">
      <path
        d="M10 1.5C10 1.5 2.5 12 2.5 19.2a7.5 7.5 0 0 0 15 0C17.5 12 10 1.5 10 1.5Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path d="M10 10.5v15" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="10" cy="19.5" r="1.4" fill="currentColor" />
    </svg>
  )
}

export function Logo({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const text = { sm: 'text-lg', md: 'text-xl sm:text-2xl', lg: 'text-4xl sm:text-5xl' }[size]
  const mark = { sm: 'h-5', md: 'h-6 sm:h-7', lg: 'h-10 sm:h-12' }[size]
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark className={`${mark} w-auto text-champagne`} />
      <span className={`font-serif font-medium uppercase leading-none tracking-[0.42em] [margin-right:-0.42em] ${text}`}>
        Élixir
      </span>
    </span>
  )
}

/** Brand ornament between chapters: hairline · drop · hairline. */
export function Ornament({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <div className={`${tone === 'dark' ? 'bg-ink' : 'bg-ivory'} py-2`} aria-hidden="true">
      <div className="container-lux flex items-center gap-6">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-champagne/40" />
        <LogoMark className="h-6 w-auto text-champagne/70" />
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-champagne/40" />
      </div>
    </div>
  )
}
