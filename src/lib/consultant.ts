/**
 * ÉLIXIR offline consultant.
 *
 * A deterministic, rule-based matcher for Ukrainian free-text requests
 * ("щось на побачення, але не солодке, до 8 тисяч"). It is NOT a language
 * model: it extracts preferences with a keyword lexicon (with negation and
 * multi-turn refinement), scores the catalogue and writes a templated reply.
 * When the site runs on Netlify with an API key, the AI endpoint is used first
 * and this engine is the fallback.
 */
import { minPrice, products, type Family, type Intensity, type Occasion, type Product, type Season } from '../data/products'
import { allNotes, genderOf, samplePrice, type Gender } from '../data/meta'
import { ACCORDS, accordsOf, similarTo } from './accords'
import { uah } from './format'

export interface Prefs {
  families: Family[]
  noFamilies: Family[]
  accords: string[]
  noAccords: string[]
  notes: string[]
  noNotes: string[]
  occasions: Occasion[]
  intensity: Intensity | null
  gender: Gender | null
  seasons: Season[]
  maxPrice: number | null
  cheaper: boolean
  brands: string[]
  like: string | null // product id for "схоже на …"
  wantSamples: boolean
  more: boolean // "ще", "інші"
}

export const emptyPrefs = (): Prefs => ({
  families: [], noFamilies: [], accords: [], noAccords: [], notes: [], noNotes: [],
  occasions: [], intensity: null, gender: null, seasons: [], maxPrice: null, cheaper: false,
  brands: [], like: null, wantSamples: false, more: false,
})

export interface Pick {
  id: string
  why: string
}
export interface ConsultantReply {
  reply: string
  picks: Pick[]
  suggestions?: string[]
}

/* ------------------------------------------------------------------ */
/* Lexicon                                                              */
/* ------------------------------------------------------------------ */

type Effect =
  | { family: Family }
  | { accord: string }
  | { note: string }
  | { occasion: Occasion }
  | { intensity: Intensity }
  | { gender: Gender }
  | { season: Season }

const LEX: [RegExp, Effect[]][] = [
  // families & accords
  [/свіж|бадьор|прохолод|чист(ий|е|ого)|свіжовипран|fresh/, [{ family: 'fresh' }]],
  [/солод|цукр|гурман|десерт|смачн|ласощ|sweet/, [{ family: 'sweet' }]],
  [/дерев|лісов|(?<!\p{L})ліс(?!\p{L})|wood/u, [{ family: 'woody' }]],
  [/прян|гостр|spic/, [{ family: 'spicy' }]],
  [/квіт|квітк|floral|жіночн(ий|е) букет/, [{ family: 'floral' }]],
  [/цитрус|лимон|апельсин|грейпфрут|бергамот|мандарин/, [{ accord: 'citrus' }]],
  [/морськ|(?<!\p{L})мор(е|я)(?!\p{L})|океан|аква|водян|бриз|озон/u, [{ accord: 'aquatic' }]],
  [/лаванд|трав|шавл|м[’']?ят|хвой|сосн/, [{ accord: 'aromatic' }]],
  [/троянд|(?<!\p{L})роз(а|и|у)(?!\p{L})|півоні/u, [{ accord: 'rose' }]],
  [/жасмин|біл(і|ими) квіт|тубероз|апельсиновий цвіт|неролі/, [{ accord: 'white' }]],
  [/пудр|ірис|фіалк/, [{ accord: 'powdery' }]],
  [/ваніл|тонка/, [{ accord: 'vanilla' }]],
  [/(?<!\p{L})кав(а|у|ою|ов)|шоколад|какао|карамел|праліне|(?<!\p{L})мед(ов|(?!\p{L}))|коньяк|(?<!\p{L})ром(?!\p{L})|мигдал/u, [{ accord: 'gourmand' }]],
  [/фрукт|ягід|ягод|ананас|яблук|вишн|персик|малин|смородин|груш/, [{ accord: 'fruity' }]],
  [/кориц|кардамон|шафран|перц|імбир|гвоздик/, [{ accord: 'spices' }]],
  [/ладан|смол|дим|димн|церков|амбр/, [{ accord: 'resins' }]],
  [/сандал|кедр/, [{ accord: 'woods' }]],
  [/(?<!\p{L})уд(ом|у|ові)?(?!\p{L})|агар|тютюн|шкір|сигар|leather/u, [{ accord: 'oud' }]],
  [/мох|ветивер|пачул|землист/, [{ accord: 'mossy' }]],
  // occasions
  [/побачен|романт|вечір|вечер|ніч|клуб|вечірк|date/, [{ occasion: 'evening' }]],
  [/офіс|робот|діл|бізнес|співбесід|нарад|office/, [{ occasion: 'office' }]],
  [/щодн|кожен день|кожного дня|універсальн|на кожен|повсякден/, [{ occasion: 'day' }]],
  [/весілл|свят|особлив|урочист|театр|ресторан|подарун|подія|подію/, [{ occasion: 'special' }]],
  // intensity
  [/легк|ненав|делікат|тих(ий|е)|м[’']?як|близьк|ледь|ненавязл|soft/, [{ intensity: 'soft' }]],
  [/помітн|середн|баланс/, [{ intensity: 'moderate' }]],
  [/стійк|шлейф|потужн|яскрав|насичен|інтенсив|компліменти|звабл|сексуальн|beast/, [{ intensity: 'intense' }]],
  // gender
  [/для нього|чолов|хлопц|хлопця|тат(а|о|у)|бать|брат|сина|колег(и|у) чолов|для мужа|(?<!\p{L})him(?!\p{L})/u, [{ gender: 'him' }]],
  [/для неї|жін|дівчин|мам(а|и|і|у)|дружин|сестр|доньк|подруг|(?<!\p{L})her(?!\p{L})/u, [{ gender: 'her' }]],
  [/унісекс|для обох|для пари|unisex/, [{ gender: 'unisex' }]],
  // seasons
  [/літ(о|а|ні|ній)|спек|жар|пляж|відпустк|summer/, [{ season: 'Літо' }]],
  [/зим|холод|мороз|winter/, [{ season: 'Зима' }]],
  [/осін|осен|autumn/, [{ season: 'Осінь' }]],
  [/весн|spring/, [{ season: 'Весна' }]],
]

/** Brand aliases incl. common Cyrillic spellings. */
const BRAND_ALIASES: [RegExp, string][] = [
  [/yves saint laurent|(?<!\p{L})ysl(?!\p{L})|ів сен лоран|сен лоран|ів сен-лоран/u, 'Yves Saint Laurent'],
  [/jean paul gaultier|(?<!\p{L})jpg(?!\p{L})|готьє|готье|жан поль/u, 'Jean Paul Gaultier'],
  [/dior|діор/, 'Dior'],
  [/tom ford|том форд/, 'Tom Ford'],
  [/creed|крід/, 'Creed'],
  [/kurkdjian|курк|(?<!\p{L})mfk(?!\p{L})/u, 'Maison Francis Kurkdjian'],
  [/chanel|шанель/, 'Chanel'],
  [/parfums de marly|(?<!\p{L})pdm(?!\p{L})|марлі/u, 'Parfums de Marly'],
  [/xerjoff|ксерджоф|ксержоф/, 'Xerjoff'],
  [/armani|армані/, 'Giorgio Armani'],
  [/kilian|кіліан|кілліан/, 'Kilian Paris'],
  [/le labo|ле лабо/, 'Le Labo'],
  [/byredo|байредо|буредо/, 'Byredo'],
  [/margiela|маржела|марджела|replica|реплік/, 'Maison Margiela'],
  [/initio|ініціо|инисио/, 'Initio Parfums Privés'],
  [/amouage|амуаж/, 'Amouage'],
  [/lanc[oô]me|ланком/, 'Lancôme'],
  [/herm[eè]s|гермес|ермес/, 'Hermès'],
  [/mancera|мансера|мансєра/, 'Mancera'],
  [/nishane|нішан/, 'Nishane'],
  [/malle|(?<!\p{L})маль(?!\p{L})/u, 'Frédéric Malle'],
  [/louis vuitton|(?<!\p{L})lv(?!\p{L})|луї віттон|віттон/u, 'Louis Vuitton'],
  [/diptyque|диптик|діптік/, 'Diptyque'],
  [/tiziana|терензі|тіціана/, 'Tiziana Terenzi'],
]

/** Product-name aliases for "схоже на …". */
const NAME_ALIASES: [RegExp, string][] = [
  [/aventus|авентус/, 'creed-aventus'],
  [/baccarat|бакара|баккара|br ?540/, 'mfk-baccarat-rouge-540'],
  [/sauvage elixir|соваж еліксир|саваж еліксир/, 'dior-sauvage-elixir'],
  [/sauvage|соваж|саваж|сов[аі]ж/, 'dior-sauvage-edp'],
  [/bleu de chanel|блю де шанель|блю шанель/, 'chanel-bleu-edp'],
  [/oud wood|уд вуд/, 'tom-ford-oud-wood'],
  [/tobacco vanil|тобако ваніл|тютюн ваніл/, 'tom-ford-tobacco-vanille'],
  [/lost cherry|лост чер/, 'tom-ford-lost-cherry'],
  [/black orchid|блек орхід|чорна орхід/, 'tom-ford-black-orchid'],
  [/le male elixir|ле мейл еліксир|ле маль еліксир/, 'jpg-le-male-elixir'],
  [/le male|ле мейл|ле маль/, 'jpg-le-male-le-parfum'],
  [/layton|лейтон/, 'pdm-layton'],
  [/delina|деліна/, 'pdm-delina'],
  [/naxos|наксос/, 'xerjoff-naxos'],
  [/santal 33|сантал/, 'le-labo-santal-33'],
  [/another 13|енозер/, 'le-labo-another-13'],
  [/coco mademoiselle|коко мадемуазель|коко мадмуазель/, 'chanel-coco-mademoiselle'],
  [/black opium|блек опіум/, 'ysl-black-opium'],
  [/libre|лібре/, 'ysl-libre-edp'],
  [/la vie est belle|ла ві е бель|лавіебель/, 'lancome-la-vie-est-belle'],
  [/angels'? share|енджелс шер|ейнджелс/, 'kilian-angels-share'],
  [/jazz club|джаз клаб/, 'margiela-jazz-club'],
  [/by the fireplace|бай зе файр|камін/, 'margiela-by-the-fireplace'],
  [/terre d.?herm|тер д.?ермес/, 'hermes-terre-dhermes'],
  [/acqua di gi|аква ді джо|аква ди джо/, 'armani-adg-profumo'],
  [/(?<!\p{L})y edp(?!\p{L})|(?<!\p{L})[иі]грек(?!\p{L})/u, 'ysl-y-edp'],
  [/herod|херод|ірод/, 'pdm-herod'],
  [/erba pura|ерба пура/, 'xerjoff-erba-pura'],
  [/gypsy water|джипсі/, 'byredo-gypsy-water'],
  [/interlude|інтерлюд/, 'amouage-interlude-man'],
  [/silver mountain|сілвер маунтін/, 'creed-silver-mountain-water'],
  [/green irish|грін айріш/, 'creed-green-irish-tweed'],
  [/imagination|імеджинейшн|імаджинейшн/, 'louis-vuitton-imagination'],
  [/ombre nomade|омбре номад/, 'louis-vuitton-ombre-nomade'],
  [/portrait of a lady|портрет леді/, 'frederic-malle-portrait-of-a-lady'],
  [/hacivat|хаджіват|хацеват/, 'nishane-hacivat'],
  [/kirke|кірке/, 'tiziana-terenzi-kirke'],
  [/side effect|сайд ефект/, 'initio-side-effect'],
]

const NEGATORS = /(^|\s)(не|без|ні|нічого|жодн(ого|их)|крім|окрім|not|no|without|ненавиджу|не люблю|не хочу|терпіти не можу)(\s|$)/

/** Split into clauses; negation applies inside its clause only. */
function clauses(text: string) {
  return text
    .split(/[,.;!?\n]|\s(але|проте|однак|а|і щоб|та щоб)\s/)
    .map((c) => (c ?? '').trim())
    .filter(Boolean)
}

/* ------------------------------------------------------------------ */
/* Parsing                                                              */
/* ------------------------------------------------------------------ */

function parseBudget(t: string): number | null {
  const m =
    t.match(/(?:до|не більше|максимум|в межах|бюджет[а-я]*|up to|under)\s*(\d[\d\s]*[.,]?\d*)\s*(тис|тисяч|k|к)?/) ??
    t.match(/(\d[\d\s]*[.,]?\d*)\s*(тис|тисяч|k|к)?\s*(грн|гривень|₴|uah)/)
  if (!m) return null
  let n = parseFloat(m[1].replace(/\s/g, '').replace(',', '.'))
  if (Number.isNaN(n)) return null
  if (m[2] || n < 100) n *= 1000
  return Math.round(n)
}

export function parse(text: string, prev: Prefs = emptyPrefs()): Prefs {
  const t = ' ' + text.toLowerCase().replace(/[ʼ`´]/g, '’') + ' '
  const p: Prefs = { ...prev, more: false, cheaper: false, like: null }
  const add = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr : [...arr, v])
  const del = <T,>(arr: T[], v: T) => arr.filter((x) => x !== v)

  for (const c of clauses(t)) {
    const neg = NEGATORS.test(' ' + c + ' ')
    for (const [re, effects] of LEX) {
      if (!re.test(c)) continue
      for (const e of effects) {
        if ('family' in e) {
          if (neg) { p.noFamilies = add(p.noFamilies, e.family); p.families = del(p.families, e.family) }
          else { p.families = add(p.families, e.family); p.noFamilies = del(p.noFamilies, e.family) }
        } else if ('accord' in e) {
          if (neg) { p.noAccords = add(p.noAccords, e.accord); p.accords = del(p.accords, e.accord) }
          else { p.accords = add(p.accords, e.accord); p.noAccords = del(p.noAccords, e.accord) }
        } else if ('occasion' in e && !neg) p.occasions = add(p.occasions, e.occasion)
        else if ('intensity' in e) p.intensity = neg ? (e.intensity === 'intense' ? 'soft' : e.intensity === 'soft' ? 'intense' : null) : e.intensity
        else if ('gender' in e && !neg) p.gender = e.gender
        else if ('season' in e && !neg) p.seasons = add(p.seasons, e.season)
      }
    }
    // explicit notes from the catalogue ("з ірисом", "без пачулі")
    for (const n of NOTE_STEMS) {
      if (n.re.test(c)) {
        if (neg) { p.noNotes = add(p.noNotes, n.note); p.notes = del(p.notes, n.note) }
        else { p.notes = add(p.notes, n.note); p.noNotes = del(p.noNotes, n.note) }
      }
    }
  }

  // "sweet" negated also rules out the sweet accords
  if (p.noFamilies.includes('sweet')) for (const a of ['vanilla', 'gourmand']) if (!p.accords.includes(a)) p.noAccords = add(p.noAccords, a)
  if (p.noFamilies.includes('floral')) for (const a of ['rose', 'white']) if (!p.accords.includes(a)) p.noAccords = add(p.noAccords, a)

  const budget = parseBudget(t)
  if (budget) p.maxPrice = budget
  if (/без обмежен\S* бюджет|будь-який бюджет|бюджет не важлив/.test(t)) p.maxPrice = null
  if (/без різниці для кого|для будь-кого|неважливо для кого|будь-якої статі/.test(t)) p.gender = null
  // 'cheaper than what you showed' only when no explicit budget was given now
  if (/дешевш|бюджетн|недорог|економ|cheaper/.test(t) && !budget) p.cheaper = true
  if (/пробник|відливант|спробува|тестер|семпл|sample/.test(t)) p.wantSamples = true
  if (/(?<!\p{L})(ще|інші|інших|інше|other|more)(?!\p{L})/u.test(t)) p.more = true

  for (const [re, b] of BRAND_ALIASES) if (re.test(t)) p.brands = add(p.brands, b)
  for (const [re, id] of NAME_ALIASES) if (re.test(t)) { p.like = id; break }
  // naming a brand only to compare ("схоже на Aventus") shouldn't restrict to that brand
  if (p.like && /схож|подібн|як у|альтернатив|замін|на зразок|типу/.test(t)) {
    const likeBrand = products.find((x) => x.id === p.like)?.brand
    p.brands = p.brands.filter((b) => b !== likeBrand)
  }
  if (/(будь-?який|не важливо|неважливо) бренд|без бренд/.test(t)) p.brands = []
  return p
}

const NOTE_STEMS = (() => {
  const seen = new Set<string>()
  const out: { note: string; re: RegExp }[] = []
  for (const p of products)
    for (const n of allNotes(p)) {
      const l = n.toLowerCase()
      if (seen.has(l) || l.split(' ').length > 2) continue
      seen.add(l)
      const stem = l.length <= 3 ? l : l.slice(0, Math.max(4, l.length - 2))
      out.push({ note: n, re: l.length <= 3 ? new RegExp(`(^|\\s)${l}(\\s|$)`) : new RegExp(stem.replace(/[’']/g, '[’\']')) })
    }
  return out
})()

const hasSignal = (p: Prefs) =>
  p.families.length + p.noFamilies.length + p.accords.length + p.noAccords.length + p.notes.length + p.occasions.length + p.seasons.length + p.brands.length > 0 ||
  !!p.intensity || !!p.gender || !!p.maxPrice || !!p.like

/* ------------------------------------------------------------------ */
/* Scoring                                                              */
/* ------------------------------------------------------------------ */

const LEVEL: Record<Intensity, number> = { soft: 0, moderate: 1, intense: 2 }
const accordLabel = (id: string) => ACCORDS.find((a) => a.id === id)?.label.toLowerCase() ?? id
const FAMILY_LABEL: Record<Family, string> = { fresh: 'свіжий', sweet: 'солодкий', woody: 'деревний', spicy: 'пряний', floral: 'квітковий' }
const OCC_LABEL: Record<Occasion, string> = { day: 'на щодень', office: 'для офісу', evening: 'для вечора', special: 'для особливої події' }

interface Scored {
  p: Product
  score: number
  reasons: string[]
}

function score(p: Product, pr: Prefs, likeId: string | null): Scored | null {
  const price = minPrice(p)
  if (pr.maxPrice && price > pr.maxPrice && !(pr.wantSamples && samplePrice(p, 5) <= pr.maxPrice)) return null
  const g = genderOf(p)
  if (pr.gender && pr.gender !== 'unisex' && g !== 'unisex' && g !== pr.gender) return null
  if (pr.gender === 'unisex' && g !== 'unisex') return null
  if (pr.brands.length && !pr.brands.includes(p.brand)) return null
  if (likeId && p.id === likeId) return null

  const acc = accordsOf(p)
  const notes = allNotes(p).map((n) => n.toLowerCase())
  let s = 0
  const reasons: string[] = []

  for (const f of pr.families) if (p.tags.families.includes(f)) { s += 3; reasons.push(FAMILY_LABEL[f] + ' характер') }
  for (const f of pr.noFamilies) if (p.tags.families.includes(f)) s -= 7
  const accHit = pr.accords.filter((a) => acc.includes(a))
  s += accHit.length * 3
  if (accHit.length) reasons.push('акорди: ' + accHit.map(accordLabel).join(', '))
  for (const a of pr.noAccords) if (acc.includes(a)) s -= 4
  const noteHit = pr.notes.filter((n) => notes.some((x) => x.includes(n.toLowerCase())))
  s += noteHit.length * 3
  if (noteHit.length) reasons.push('є ' + noteHit.map((n) => n.toLowerCase()).join(', '))
  for (const n of pr.noNotes) if (notes.some((x) => x.includes(n.toLowerCase()))) s -= 6
  const occHit = pr.occasions.filter((o) => p.tags.occasions.includes(o))
  s += occHit.length * 2
  if (occHit.length) reasons.push(OCC_LABEL[occHit[0]])
  if (pr.intensity) {
    const d = Math.abs(LEVEL[pr.intensity] - LEVEL[p.tags.intensity])
    s += d === 0 ? 2.5 : d === 1 ? 0.5 : -2
    if (d === 0) reasons.push(pr.intensity === 'intense' ? 'стійкий, з помітним шлейфом' : pr.intensity === 'soft' ? 'делікатний, близько до шкіри' : 'збалансована сила звучання')
  }
  const seasonHit = pr.seasons.filter((x) => p.characteristics.seasons.includes(x))
  s += seasonHit.length * 1.5
  if (seasonHit.length) reasons.push('сезон: ' + seasonHit.join(', ').toLowerCase())
  if (pr.gender && g === pr.gender) s += 0.5
  if (pr.brands.length) s += 1
  if (pr.cheaper) s -= price / 20000
  if (p.bestseller) s += 0.3
  return { p, score: s, reasons }
}

/* ------------------------------------------------------------------ */
/* Reply                                                                */
/* ------------------------------------------------------------------ */

function understood(pr: Prefs) {
  const bits: string[] = []
  if (pr.like) bits.push(`схоже на ${products.find((x) => x.id === pr.like)?.name}`)
  if (pr.gender) bits.push(pr.gender === 'him' ? 'для нього' : pr.gender === 'her' ? 'для неї' : 'унісекс')
  if (pr.occasions.length) bits.push(pr.occasions.map((o) => OCC_LABEL[o]).join(' і '))
  if (pr.families.length) bits.push(pr.families.map((f) => FAMILY_LABEL[f]).join(', '))
  if (pr.accords.length) bits.push(pr.accords.map(accordLabel).join(', '))
  if (pr.notes.length) bits.push('з нотами: ' + pr.notes.map((n) => n.toLowerCase()).join(', '))
  if (pr.noFamilies.length) bits.push('не ' + pr.noFamilies.map((f) => FAMILY_LABEL[f]).join(' і не '))
  if (pr.noNotes.length) bits.push('без ' + pr.noNotes.map((n) => n.toLowerCase()).join(', '))
  if (pr.intensity) bits.push(pr.intensity === 'intense' ? 'зі шлейфом' : pr.intensity === 'soft' ? 'делікатний' : 'помірний')
  if (pr.seasons.length) bits.push(pr.seasons.join('/').toLowerCase())
  if (pr.brands.length) bits.push(pr.brands.join(', '))
  if (pr.maxPrice) bits.push(`до ${uah(pr.maxPrice)}`)
  return bits
}

const SUGGEST_START = [
  'Щось на побачення, але не солодке',
  'Свіжий аромат для офісу до 7 000 ₴',
  'Схоже на Baccarat Rouge 540',
  'Подарунок для нього на зиму',
]

export function consult(text: string, prev: Prefs, shown: string[]): { reply: ConsultantReply; prefs: Prefs } {
  const pr = parse(text, prev)
  if (!hasSignal(pr)) {
    return {
      prefs: pr,
      reply: {
        reply:
          'Розкажіть трохи більше — і я підберу аромат. Наприклад: для кого він, на яку нагоду, які відчуття подобаються (свіжість, солодкість, дерево, прянощі, квіти) чи чого точно не хочеться. Можна також назвати улюблений аромат — знайду схожі.',
        picks: [],
        suggestions: SUGGEST_START,
      },
    }
  }

  let pool: Scored[]
  if (pr.like) {
    const base = products.find((x) => x.id === pr.like)!
    const sims = similarTo(base, products, 12)
    pool = sims
      .map((sm) => {
        const sc = score(sm.product, pr, pr.like)
        if (!sc) return null
        return { ...sc, score: sc.score + sm.score * 10, reasons: [`спільне з ${base.name}: ${sm.shared.slice(0, 3).join(', ').toLowerCase() || 'схожі акорди'}`, ...sc.reasons] }
      })
      .filter(Boolean) as Scored[]
  } else {
    pool = products.map((p) => score(p, pr, null)).filter(Boolean) as Scored[]
  }
  if (pr.more) pool = pool.filter((x) => !shown.includes(x.p.id))
  if (pr.cheaper && shown.length) {
    const prices = shown.map((id) => minPrice(products.find((x) => x.id === id)!))
    const ref = prices.reduce((a, b) => a + b, 0) / prices.length
    pool = pool.filter((x) => minPrice(x.p) < ref)
  }
  pool.sort((a, b) => b.score - a.score || minPrice(a.p) - minPrice(b.p))
  const top = pool.filter((x) => x.score > 0 || pr.like).slice(0, 3)

  const bits = understood(pr)
  if (!top.length) {
    return {
      prefs: pr,
      reply: {
        reply: `Шукав: ${bits.join(' · ')} — але в колекції немає аромату, що відповідає всім умовам одразу. Спробуйте послабити одну з них, наприклад бюджет чи групу аромату.`,
        picks: [],
        suggestions: ['Без обмеження бюджету', 'Без різниці для кого', 'Почати спочатку'],
      },
    }
  }

  const picks: Pick[] = top.map(({ p, reasons }) => {
    const r = reasons.slice(0, 3)
    const key = [...p.notes.top.slice(0, 2), ...p.notes.base.slice(0, 2)].map((n) => n.toLowerCase()).join(', ')
    const why = (r.length ? r.join('; ') + '. Звучить: ' + key : p.short.replace(/\.$/, '')) + '.'
    return { id: p.id, why: why.charAt(0).toUpperCase() + why.slice(1) }
  })
  const lead = pr.like
    ? `Ось аромати, найближчі до ${products.find((x) => x.id === pr.like)?.name} за складом:`
    : `Зрозумів: ${bits.join(' · ')}. Ось мій вибір:`
  const tail = pr.wantSamples
    ? 'Кожен можна взяти пробником 2–10 мл, щоб пожити з ароматом кілька днів.'
    : 'Не впевнені? Почніть із пробника — його можна додати прямо з картки.'
  return {
    prefs: pr,
    reply: {
      reply: `${lead}`,
      picks,
      suggestions: ['Покажіть ще варіанти', 'А щось дешевше?', pr.gender ? 'Без різниці для кого' : 'Для нього', tail.startsWith('Кожен') ? 'Почати спочатку' : 'Хочу пробники'],
    },
  }
}

/** Catalogue IDs — used to validate AI answers. */
export const PRODUCT_IDS = new Set(products.map((p) => p.id))
