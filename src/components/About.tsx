const PILLARS = [
  {
    n: 'I',
    t: 'Authenticity',
    d: 'Every flacon in our selection is presented under its real name, house and concentration — with the fragrance pyramid as the house publishes it. Our own opinions are always labelled as editorial.',
  },
  {
    n: 'II',
    t: 'Curation',
    d: 'We hold fewer fragrances, chosen with intent: compositions that defined their decade, and the modern icons that will define the next.',
  },
  {
    n: 'III',
    t: 'Ritual',
    d: 'Discovery should be slow. Explore each bottle in 3D, read its story, and let our finder guide you before you commit to a signature.',
  },
]

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-ink py-24 sm:py-40" aria-labelledby="about-title">
      <div className="container-lux">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p data-reveal className="eyebrow">About the boutique</p>
            <h2 id="about-title" data-reveal className="h-display mt-5 text-6xl sm:text-7xl lg:text-8xl">
              A house of <em className="text-champagne">rare</em> scents
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p data-reveal className="font-serif text-3xl font-light leading-snug text-ivory/90 sm:text-4xl">
              “Perfume is the most intimate accessory — invisible, yet the first thing remembered and the last thing
              forgotten.”
            </p>
            <p data-reveal className="mt-8 leading-relaxed text-ivory/55">
              Parfum Lux was imagined as a quiet room in a loud world: a boutique where the great houses of perfumery
              sit side by side, and where choosing a fragrance feels like an appointment rather than a transaction. We
              believe a scent should be understood before it is worn — its materials, its maker, its mood.
            </p>
          </div>
        </div>

        <div className="relative mt-24 overflow-hidden">
          <p data-parallax="60" className="text-outline pointer-events-none select-none whitespace-nowrap font-serif text-[22vw] italic leading-none opacity-60" aria-hidden="true">
            l’essence
          </p>
        </div>

        <ul data-reveal-stagger className="mt-16 grid gap-px bg-ivory/10 md:grid-cols-3">
          {PILLARS.map((p) => (
            <li key={p.t} className="group bg-ink p-8 transition-colors duration-700 hover:bg-ink-700 sm:p-10">
              <span className="font-serif text-xl italic text-champagne">{p.n}</span>
              <h3 className="mt-6 font-serif text-3xl font-light">{p.t}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ivory/55">{p.d}</p>
              <span className="mt-8 block h-px w-10 bg-champagne transition-all duration-700 ease-luxe group-hover:w-24" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
