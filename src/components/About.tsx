const PILLARS = [
  {
    n: 'I',
    t: 'Оригінальність',
    d: 'Лише оригінальна парфумерія культових світових брендів. Кожен аромат представлено під справжньою назвою, з концентрацією та пірамідою нот, яку публікує парфумерний дім, а наші власні враження позначено як редакційні.',
  },
  {
    n: 'II',
    t: 'Кураторський вибір',
    d: 'Ми тримаємо небагато ароматів, але кожен обрано свідомо: композиції, що визначили своє десятиліття, і сучасні ікони, які визначать наступне.',
  },
  {
    n: 'III',
    t: 'Твоя історія',
    d: 'Аромат — це підпис, який залишається після тебе. Роздивись кожен флакон у 3D, прочитай його історію й дозволь нашому підбору підказати той, що звучатиме саме як ти.',
  },
]

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-ink py-24 sm:py-40" aria-labelledby="about-title">
      <div className="container-lux">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p data-reveal className="eyebrow">Про ÉLIXIR</p>
            <h2 id="about-title" data-reveal className="h-display mt-5 text-5xl sm:text-6xl lg:text-7xl">
              Аромат, який <em className="text-champagne">розповідає</em> твою історію
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p data-reveal className="font-serif text-3xl font-light leading-snug text-ivory/90 sm:text-4xl">
              Відкрий для себе світ виняткової парфумерії. Обирай аромати культових світових брендів та знаходь
              власний стиль у кожній ноті.
            </p>
            <p data-reveal className="mt-8 leading-relaxed text-ivory/55">
              ÉLIXIR — преміальний український магазин оригінальної люксової парфумерії. Ми задумали його як тиху
              кімнату в гучному світі: цифровий бутик, де великі парфумерні доми стоять пліч-о-пліч, а вибір аромату
              нагадує особисту зустріч, а не звичайну покупку. Бо аромат варто зрозуміти, перш ніж його носити, — його
              матеріали, творця й настрій.
            </p>
          </div>
        </div>

        <div className="relative mt-24 overflow-hidden">
          <p data-parallax="60" className="text-outline pointer-events-none select-none whitespace-nowrap font-serif text-[22vw] italic leading-none opacity-60" aria-hidden="true">
            élixir
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
