/**
 * EXTENDED CATALOGUE (40 fragrances) — appended to `products` in products.ts.
 * Notes follow the pyramids published by the houses and widely reproduced by
 * fragrance references; descriptions and characteristics are the boutique's
 * own editorial text. Prices (UAH) are indicative and easy to edit.
 * Bottles are stylised parametric interpretations, not official replicas.
 */
import type { BottleSpec, Metal, Product } from './products'

type CapShape = BottleSpec['cap']['shape']
type LabelKind = BottleSpec['label']['kind']

function bottle(o: {
  body?: BottleSpec['body']
  size: [number, number, number]
  radius?: number
  glass: string
  tint: number
  liquid: string
  level?: number
  cap: [CapShape, number, number, number, Metal]
  collar?: Metal
  rings?: boolean
  label: [LabelKind, string, string, string, Metal?]
}): BottleSpec {
  return {
    body: o.body ?? 'box',
    size: o.size,
    radius: o.radius ?? 0.05,
    glass: o.glass,
    tint: o.tint,
    liquid: o.liquid,
    liquidLevel: o.level ?? 0.84,
    cap: { shape: o.cap[0], size: [o.cap[1], o.cap[2], o.cap[3]], metal: o.cap[4] },
    collar: o.collar ?? o.cap[4],
    collarRings: o.rings,
    label: { kind: o.label[0], text: o.label[1], sub: o.label[2], color: o.label[3], metal: o.label[4] },
  }
}

const EDP = 'Парфумована вода'
const EDT = 'Туалетна вода'
const EXTRAIT = 'Екстракт парфумів'

export const extraProducts: Product[] = [
  /* ---------------- Chanel ---------------- */
  {
    id: 'chanel-coco-mademoiselle',
    brand: 'Chanel',
    name: 'Coco Mademoiselle',
    concentration: EDP,
    year: 2001,
    perfumer: 'Jacques Polge',
    sizes: [{ ml: 50, price: 6400 }, { ml: 100, price: 8900 }],
    family: 'Квітковий шипр',
    short: 'Апельсин і троянда на пачулі та білому мускусі.',
    description:
      'Сучасна класика Chanel: іскристий апельсин і бергамот відкривають серце з троянди та жасмину, а пачулі, ветивер і білий мускус додають характеру. Свіжа, але впевнена жіночність.',
    notes: {
      top: ['Апельсин', 'Мандарин', 'Бергамот', 'Апельсиновий цвіт'],
      heart: ['Турецька троянда', 'Жасмин', 'Мімоза', 'Іланг-іланг'],
      base: ['Пачулі', 'Білий мускус', 'Ваніль', 'Ветивер', 'Боби тонка', 'Опопонакс'],
    },
    characteristics: { longevity: 4, projection: 4, seasons: ['Весна', 'Осінь'], occasion: 'Офіс, побачення, щодня' },
    tags: { families: ['floral', 'fresh'], occasions: ['day', 'office'], intensity: 'moderate' },
    bestseller: true,
    bottle: bottle({ size: [1.05, 1.5, 0.5], glass: '#f3e7da', tint: 0.08, liquid: '#e9bf9a', cap: ['box', 0.6, 0.4, 0.4, 'silver'], label: ['print', 'COCO MADEMOISELLE', 'CHANEL', '#2a2a2a'] }),
  },

  /* ---------------- Dior ---------------- */
  {
    id: 'dior-sauvage-edp',
    brand: 'Dior',
    name: 'Sauvage Eau de Parfum',
    concentration: EDP,
    year: 2018,
    perfumer: 'François Demachy',
    sizes: [{ ml: 60, price: 4900 }, { ml: 100, price: 6600 }],
    family: 'Амбровий фужер',
    short: 'Бергамот, лаванда й пряний перець на теплій ваніллю амбрі.',
    description:
      'Парфумована версія Sauvage — м’якша й тепліша. Соковитий бергамот, сичуанський перець і лаванда звучать на основі з амброксану та ванілі. Універсальний чоловічий аромат на будь-який день.',
    notes: {
      top: ['Бергамот'],
      heart: ['Сичуанський перець', 'Лаванда', 'Рожевий перець', 'Ветивер', 'Пачулі', 'Герань', 'Елемі'],
      base: ['Амброксан', 'Ваніль'],
    },
    characteristics: { longevity: 4, projection: 4, seasons: ['Весна', 'Літо', 'Осінь', 'Зима'], occasion: 'Щодня, офіс, вечори' },
    tags: { families: ['fresh', 'spicy'], occasions: ['day', 'office', 'evening'], intensity: 'moderate' },
    bestseller: true,
    bottle: bottle({ size: [1.0, 1.6, 0.56], radius: 0.08, glass: '#1c2a44', tint: 0.7, liquid: '#22314f', cap: ['box', 0.7, 0.48, 0.5, 'black'], collar: 'silver', label: ['print', 'SAUVAGE', 'EAU DE PARFUM', '#d6dbe4'] }),
  },
  {
    id: 'dior-homme-intense',
    brand: 'Dior',
    name: 'Dior Homme Intense',
    concentration: EDP,
    year: 2011,
    perfumer: 'Olivier Polge',
    sizes: [{ ml: 50, price: 4800 }, { ml: 100, price: 6900 }],
    family: 'Деревний квітковий мускусний',
    short: 'Пудровий ірис і груша на кедрі та ветивері.',
    description:
      'Один із найвишуканіших чоловічих ірисів. Лаванда та пудровий ірис з ноткою груші й амбретти лягають на сухий кедр і ветивер — елегантно, чуттєво й трохи ностальгічно.',
    notes: { top: ['Лаванда'], heart: ['Ірис', 'Амбретта', 'Груша'], base: ['Ветивер', 'Вірджинський кедр'] },
    characteristics: { longevity: 4, projection: 3, seasons: ['Осінь', 'Зима'], occasion: 'Вечори, урочисті події, офіс' },
    tags: { families: ['floral', 'woody'], occasions: ['evening', 'office'], intensity: 'moderate' },
    bottle: bottle({ size: [0.82, 1.85, 0.5], radius: 0.03, glass: '#c9c4bd', tint: 0.25, liquid: '#8f8a85', cap: ['box', 0.5, 0.5, 0.42, 'gunmetal'], label: ['print', 'DIOR HOMME', 'INTENSE', '#1d1d1d'] }),
  },

  /* ---------------- Tom Ford ---------------- */
  {
    id: 'tom-ford-tobacco-vanille',
    brand: 'Tom Ford',
    name: 'Tobacco Vanille',
    concentration: EDP,
    year: 2007,
    perfumer: 'Olivier Gillotin',
    sizes: [{ ml: 50, price: 12900 }, { ml: 100, price: 18400 }],
    family: 'Амбровий пряний',
    short: 'Тютюновий лист, ваніль і какао — затишок англійського клубу.',
    description:
      'Розкішний, густий і теплий. Тютюновий лист і прянощі переходять у ваніль, какао та боби тонка, а сушені фрукти й деревні ноти залишають медовий шлейф. Аромат холодних вечорів.',
    notes: {
      top: ['Тютюновий лист', 'Прянощі'],
      heart: ['Ваніль', 'Какао', 'Боби тонка', 'Цвіт тютюну'],
      base: ['Сушені фрукти', 'Деревні ноти'],
    },
    characteristics: { longevity: 5, projection: 4, seasons: ['Осінь', 'Зима'], occasion: 'Вечори, холодна пора' },
    tags: { families: ['sweet', 'spicy'], occasions: ['evening', 'special'], intensity: 'intense' },
    bestseller: true,
    bottle: bottle({ size: [0.92, 1.7, 0.6], radius: 0.03, glass: '#3a2213', tint: 0.75, liquid: '#5a3210', cap: ['box', 0.7, 0.36, 0.48, 'bronze'], collar: 'gold', label: ['plate', 'TOBACCO VANILLE', 'PRIVATE BLEND', '#2a1a0d', 'gold'] }),
  },
  {
    id: 'tom-ford-lost-cherry',
    brand: 'Tom Ford',
    name: 'Lost Cherry',
    concentration: EDP,
    year: 2018,
    perfumer: 'Louise Turner',
    sizes: [{ ml: 50, price: 14200 }, { ml: 100, price: 20500 }],
    family: 'Амбровий квітковий',
    short: 'Чорна вишня й гіркий мигдаль у тонка та перуанському бальзамі.',
    description:
      'Спокусливий фруктовий гурманський аромат: чорна вишня, вишневий лікер і гіркий мигдаль переходять у троянду та жасмин, а потім у теплий бальзам, обсмажені боби тонка й сандал.',
    notes: {
      top: ['Чорна вишня', 'Вишневий лікер', 'Гіркий мигдаль'],
      heart: ['Турецька троянда', 'Жасмин самбак'],
      base: ['Перуанський бальзам', 'Обсмажені боби тонка', 'Сандалове дерево', 'Ветивер', 'Кедр'],
    },
    characteristics: { longevity: 4, projection: 4, seasons: ['Осінь', 'Зима'], occasion: 'Вечори, побачення' },
    tags: { families: ['sweet', 'floral'], occasions: ['evening', 'special'], intensity: 'intense' },
    bottle: bottle({ size: [0.92, 1.7, 0.6], radius: 0.03, glass: '#5a0d14', tint: 0.8, liquid: '#6b0f17', cap: ['box', 0.7, 0.36, 0.48, 'bronze'], collar: 'gold', label: ['plate', 'LOST CHERRY', 'PRIVATE BLEND', '#2a0a0a', 'gold'] }),
  },
  {
    id: 'tom-ford-ombre-leather',
    brand: 'Tom Ford',
    name: 'Ombré Leather',
    concentration: EDP,
    year: 2018,
    perfumer: 'Sonia Constant',
    sizes: [{ ml: 50, price: 7900 }, { ml: 100, price: 10900 }],
    family: 'Шкіряний',
    short: 'Кардамон і м’яка шкіра на амбрі та мосі.',
    description:
      'Образ пустелі й шкіряної куртки: кардамон відкриває гладку, оксамитову шкіру з квітковим відтінком жасмину, а амбра, мох і пачулі тримають шлейф сухим і теплим.',
    notes: { top: ['Кардамон'], heart: ['Шкіра', 'Жасмин самбак'], base: ['Амбра', 'Мох', 'Пачулі'] },
    characteristics: { longevity: 5, projection: 4, seasons: ['Осінь', 'Зима', 'Весна'], occasion: 'Щодня, вечори' },
    tags: { families: ['woody', 'spicy'], occasions: ['day', 'evening'], intensity: 'intense' },
    bottle: bottle({ size: [0.95, 1.65, 0.55], radius: 0.03, glass: '#121212', tint: 0.92, liquid: '#1a1410', cap: ['box', 0.72, 0.4, 0.5, 'black'], collar: 'gold', label: ['plate', 'OMBRÉ LEATHER', 'TOM FORD', '#1a1a1a', 'gold'] }),
  },
  {
    id: 'tom-ford-black-orchid',
    brand: 'Tom Ford',
    name: 'Black Orchid',
    concentration: EDP,
    year: 2006,
    sizes: [{ ml: 50, price: 6900 }, { ml: 100, price: 9600 }],
    family: 'Амбровий квітковий',
    short: 'Чорна орхідея, трюфель і темний шоколад.',
    description:
      'Темний і розкішний: трюфель, чорна смородина й бергамот ведуть до квіткового серця орхідеї та прянощів, а мексиканський шоколад, пачулі, ладан і ваніль роблять шлейф глибоким, як оксамит.',
    notes: {
      top: ['Трюфель', 'Гарденія', 'Чорна смородина', 'Іланг-іланг', 'Бергамот', 'Мандарин'],
      heart: ['Орхідея', 'Прянощі', 'Фруктові ноти', 'Лотос'],
      base: ['Мексиканський шоколад', 'Пачулі', 'Ваніль', 'Ладан', 'Сандалове дерево', 'Ветивер', 'Білий мускус'],
    },
    characteristics: { longevity: 5, projection: 4, seasons: ['Осінь', 'Зима'], occasion: 'Вечори, особливі події' },
    tags: { families: ['floral', 'sweet', 'spicy'], occasions: ['evening', 'special'], intensity: 'intense' },
    bottle: bottle({ body: 'octagon', size: [0.95, 1.6, 0.7], glass: '#0d0d0f', tint: 0.95, liquid: '#120e10', cap: ['box', 0.62, 0.36, 0.5, 'black'], collar: 'gold', rings: true, label: ['plate', 'BLACK ORCHID', 'TOM FORD', '#1a1a1a', 'gold'] }),
  },

  /* ---------------- Creed ---------------- */
  {
    id: 'creed-silver-mountain-water',
    brand: 'Creed',
    name: 'Silver Mountain Water',
    concentration: EDP,
    year: 1995,
    perfumer: 'Olivier Creed',
    sizes: [{ ml: 50, price: 12900 }, { ml: 100, price: 18200 }],
    family: 'Цитрусовий ароматичний',
    short: 'Зелений чай і бергамот — свіжість гірського струмка.',
    description:
      'Натхненний Швейцарськими Альпами: бергамот і мандарин, прозорий зелений чай із чорною смородиною та чиста мускусно-сандалова база. Холодний, світлий і дуже елегантний.',
    notes: {
      top: ['Бергамот', 'Мандарин'],
      heart: ['Зелений чай', 'Чорна смородина'],
      base: ['Мускус', 'Петитгрейн', 'Сандалове дерево', 'Гальбанум'],
    },
    characteristics: { longevity: 3, projection: 3, seasons: ['Весна', 'Літо'], occasion: 'День, офіс, спека' },
    tags: { families: ['fresh'], occasions: ['day', 'office'], intensity: 'soft' },
    bottle: bottle({ body: 'cylinder', size: [0.82, 1.7, 0.82], glass: '#b9bfc6', tint: 0.45, liquid: '#c9d3da', cap: ['cylinder', 0.4, 0.5, 0.4, 'silver'], label: ['plate', 'SILVER MOUNTAIN WATER', 'CREED', '#1a1a1a', 'silver'] }),
  },
  {
    id: 'creed-green-irish-tweed',
    brand: 'Creed',
    name: 'Green Irish Tweed',
    concentration: EDP,
    year: 1985,
    perfumer: 'Olivier Creed & Pierre Bourdon',
    sizes: [{ ml: 50, price: 12900 }, { ml: 100, price: 18200 }],
    family: 'Ароматичний фужер',
    short: 'Вербена, ірис і фіалкове листя на амбергрисі.',
    description:
      'Зелений, чистий і аристократичний аромат ірландських пагорбів. Лимонна вербена й ірис, свіже фіалкове листя та м’яка база з амбергрису й сандалу.',
    notes: { top: ['Лимонна вербена', 'Ірис'], heart: ['Листя фіалки'], base: ['Амбергрис', 'Сандалове дерево'] },
    characteristics: { longevity: 4, projection: 3, seasons: ['Весна', 'Літо', 'Осінь'], occasion: 'Офіс, день, бізнес' },
    tags: { families: ['fresh', 'woody'], occasions: ['day', 'office'], intensity: 'moderate' },
    bottle: bottle({ body: 'cylinder', size: [0.82, 1.7, 0.82], glass: '#1e3b2a', tint: 0.75, liquid: '#2d5a3c', cap: ['cylinder', 0.4, 0.5, 0.4, 'silver'], label: ['plate', 'GREEN IRISH TWEED', 'CREED', '#1a1a1a', 'silver'] }),
  },

  /* ---------------- Parfums de Marly ---------------- */
  {
    id: 'pdm-delina',
    brand: 'Parfums de Marly',
    name: 'Delina',
    concentration: EDP,
    year: 2017,
    perfumer: 'Quentin Bisch',
    sizes: [{ ml: 30, price: 6900 }, { ml: 75, price: 11900 }],
    family: 'Квітковий фруктовий',
    short: 'Турецька троянда й лічі з ревенем на мускусі.',
    description:
      'Сучасна троянда в рожевому флаконі: соковиті лічі, ревінь і бергамот, турецька троянда з півонією та мускусом, а потім кашмеран, ладан і ветивер. Свіжа, ніжна й незабутня.',
    notes: {
      top: ['Лічі', 'Ревінь', 'Бергамот', 'Мускатний горіх'],
      heart: ['Турецька троянда', 'Півонія', 'Мускус', 'Ваніль'],
      base: ['Кашмеран', 'Ладан', 'Кедр', 'Ветивер'],
    },
    characteristics: { longevity: 4, projection: 4, seasons: ['Весна', 'Літо'], occasion: 'День, побачення, свята' },
    tags: { families: ['floral', 'fresh'], occasions: ['day', 'special'], intensity: 'moderate' },
    bestseller: true,
    bottle: bottle({ size: [0.9, 1.75, 0.55], radius: 0.04, glass: '#f2b8c6', tint: 0.4, liquid: '#f5c4d0', cap: ['cylinder', 0.34, 0.46, 0.34, 'rose'], label: ['plate', 'DELINA', 'PARFUMS DE MARLY', '#3a1a22', 'rose'] }),
  },
  {
    id: 'pdm-herod',
    brand: 'Parfums de Marly',
    name: 'Herod',
    concentration: EDP,
    year: 2012,
    perfumer: 'Olivier Pescheux',
    sizes: [{ ml: 75, price: 9200 }, { ml: 125, price: 11900 }],
    family: 'Амбровий пряний',
    short: 'Тютюн, кориця й ладан на ванільній основі.',
    description:
      'Пряний тютюновий аромат з королівським характером: кориця й перець відкривають тютюновий лист, ладан і османтус, а ваніль, мускус і кедр роблять шлейф м’яким і теплим.',
    notes: {
      top: ['Кориця', 'Перець'],
      heart: ['Тютюновий лист', 'Ладан', 'Османтус', 'Лабданум'],
      base: ['Ваніль', 'Ізо Е Супер', 'Мускус', 'Кедр', 'Ветивер'],
    },
    characteristics: { longevity: 4, projection: 4, seasons: ['Осінь', 'Зима'], occasion: 'Вечори, холодна пора' },
    tags: { families: ['spicy', 'sweet'], occasions: ['evening'], intensity: 'intense' },
    bottle: bottle({ size: [0.9, 1.75, 0.55], radius: 0.04, glass: '#3d2420', tint: 0.7, liquid: '#6b3a1c', cap: ['cylinder', 0.34, 0.46, 0.34, 'gold'], label: ['plate', 'HEROD', 'PARFUMS DE MARLY', '#2a1a0d', 'gold'] }),
  },
  {
    id: 'pdm-pegasus',
    brand: 'Parfums de Marly',
    name: 'Pegasus',
    concentration: EDP,
    year: 2011,
    sizes: [{ ml: 75, price: 9200 }, { ml: 125, price: 11900 }],
    family: 'Амбровий квітковий',
    short: 'Мигдаль і геліотроп на ванілі та сандалі.',
    description:
      'Мигдально-ванільний аромат з благородною свіжістю: геліотроп, кмин і бергамот, гіркий мигдаль із лавандою та жасмином і кремова база з ванілі, сандалу й амбри.',
    notes: {
      top: ['Геліотроп', 'Кмин', 'Бергамот'],
      heart: ['Гіркий мигдаль', 'Лаванда', 'Жасмин'],
      base: ['Ваніль', 'Сандалове дерево', 'Амбра'],
    },
    characteristics: { longevity: 4, projection: 4, seasons: ['Осінь', 'Зима', 'Весна'], occasion: 'Вечори, побачення' },
    tags: { families: ['sweet', 'floral'], occasions: ['evening', 'special'], intensity: 'moderate' },
    bottle: bottle({ size: [0.9, 1.75, 0.55], radius: 0.04, glass: '#2c3646', tint: 0.65, liquid: '#5a5034', cap: ['cylinder', 0.34, 0.46, 0.34, 'silver'], label: ['plate', 'PEGASUS', 'PARFUMS DE MARLY', '#1d1d1d', 'silver'] }),
  },

  /* ---------------- Xerjoff ---------------- */
  {
    id: 'xerjoff-erba-pura',
    brand: 'Xerjoff',
    name: 'Erba Pura',
    concentration: EDP,
    year: 2019,
    perfumer: 'Christian Carbonnel',
    sizes: [{ ml: 50, price: 8900 }, { ml: 100, price: 12400 }],
    family: 'Амбровий фруктовий',
    short: 'Сицилійські цитруси й фрукти на мускусі та ванілі.',
    description:
      'Сонячний фруктовий коктейль: сицилійський апельсин, калабрійський бергамот і лимон переходять у соковиті фрукти, а білий мускус, мадагаскарська ваніль і амбра дають потужний солодкий шлейф.',
    notes: {
      top: ['Сицилійський апельсин', 'Калабрійський бергамот', 'Лимон'],
      heart: ['Фруктові ноти'],
      base: ['Білий мускус', 'Мадагаскарська ваніль', 'Амбра'],
    },
    characteristics: { longevity: 5, projection: 5, seasons: ['Весна', 'Літо'], occasion: 'День, свята, відпустка' },
    tags: { families: ['sweet', 'fresh'], occasions: ['day', 'special'], intensity: 'intense' },
    bottle: bottle({ size: [0.88, 1.65, 0.6], radius: 0.1, glass: '#f4ecdd', tint: 0.08, liquid: '#e9d27a', cap: ['box', 0.58, 0.5, 0.48, 'gold'], label: ['plate', 'ERBA PURA', 'XERJOFF', '#2b1c08', 'gold'] }),
  },
  {
    id: 'xerjoff-alexandria-ii',
    brand: 'Xerjoff',
    name: 'Alexandria II',
    concentration: EDP,
    year: 2012,
    sizes: [{ ml: 50, price: 15900 }, { ml: 100, price: 22900 }],
    family: 'Амбровий деревний',
    short: 'Уд і троянда з лавандою та корицею.',
    description:
      'Розкішний східний аромат: рожеве дерево, лаванда, кориця та яблуко відкривають болгарську троянду й конвалію, а уд, сандал, амбра й ваніль складаються в царствений шлейф.',
    notes: {
      top: ['Рожеве дерево', 'Лаванда', 'Кориця', 'Яблуко'],
      heart: ['Болгарська троянда', 'Конвалія', 'Кедр'],
      base: ['Уд', 'Сандалове дерево', 'Амбра', 'Ваніль', 'Мускус'],
    },
    characteristics: { longevity: 5, projection: 4, seasons: ['Осінь', 'Зима'], occasion: 'Вечори, урочисті події' },
    tags: { families: ['woody', 'floral', 'spicy'], occasions: ['evening', 'special'], intensity: 'intense' },
    bottle: bottle({ size: [0.88, 1.65, 0.6], radius: 0.1, glass: '#f0e6d4', tint: 0.12, liquid: '#b8823a', cap: ['facet', 0.66, 0.42, 0.5, 'gold'], label: ['plate', 'ALEXANDRIA II', 'XERJOFF', '#2b1c08', 'gold'] }),
  },

  /* ---------------- Kilian ---------------- */
  {
    id: 'kilian-angels-share',
    brand: 'Kilian Paris',
    name: "Angels' Share",
    concentration: EDP,
    year: 2020,
    perfumer: 'Benoist Lapouza',
    sizes: [{ ml: 50, price: 13900 }],
    family: 'Амбровий пряний',
    short: 'Коньяк, кориця й праліне на дубі.',
    description:
      'Названий на честь «частки ангелів» — коньяку, що випаровується з бочок. Коньяк, кориця, боби тонка й дуб огортають праліне, ваніллю та сандалом. Гурманський, але дорослий.',
    notes: {
      top: ['Коньяк'],
      heart: ['Кориця', 'Боби тонка', 'Дуб'],
      base: ['Праліне', 'Ваніль', 'Сандалове дерево'],
    },
    characteristics: { longevity: 5, projection: 4, seasons: ['Осінь', 'Зима'], occasion: 'Вечори, свята' },
    tags: { families: ['sweet', 'spicy', 'woody'], occasions: ['evening', 'special'], intensity: 'intense' },
    bestseller: true,
    bottle: bottle({ size: [0.82, 1.8, 0.5], radius: 0.03, glass: '#6a3a12', tint: 0.6, liquid: '#9a5a1c', cap: ['box', 0.56, 0.5, 0.44, 'gold'], label: ['plate', "ANGELS' SHARE", 'KILIAN PARIS', '#2a1a0d', 'gold'] }),
  },
  {
    id: 'kilian-love-dont-be-shy',
    brand: 'Kilian Paris',
    name: "Love, Don't Be Shy",
    concentration: EDP,
    year: 2007,
    perfumer: 'Calice Becker',
    sizes: [{ ml: 50, price: 13900 }],
    family: 'Амбровий квітковий',
    short: 'Апельсиновий цвіт і маршмелоу з ваніллю.',
    description:
      'Квітковий гурманський аромат, мов зізнання: нероли, рожевий перець і бергамот, апельсиновий цвіт з ірисом і жасмином, а потім ніжне маршмелоу, ваніль, цукор і мускус.',
    notes: {
      top: ['Неролі', 'Рожевий перець', 'Бергамот', 'Коріандр'],
      heart: ['Апельсиновий цвіт', 'Ірис', 'Жасмин', 'Жимолость', 'Троянда'],
      base: ['Маршмелоу', 'Ваніль', 'Цукор', 'Лабданум', 'Мускус'],
    },
    characteristics: { longevity: 4, projection: 3, seasons: ['Осінь', 'Зима', 'Весна'], occasion: 'Побачення, вечори' },
    tags: { families: ['sweet', 'floral'], occasions: ['evening', 'special'], intensity: 'moderate' },
    bottle: bottle({ size: [0.82, 1.8, 0.5], radius: 0.03, glass: '#f3d9cf', tint: 0.25, liquid: '#f0c2a6', cap: ['box', 0.56, 0.5, 0.44, 'pearl'], collar: 'gold', label: ['plate', "LOVE, DON'T BE SHY", 'KILIAN PARIS', '#2a1a0d', 'gold'] }),
  },

  /* ---------------- Le Labo ---------------- */
  {
    id: 'le-labo-santal-33',
    brand: 'Le Labo',
    name: 'Santal 33',
    concentration: EDP,
    year: 2011,
    perfumer: 'Frank Voelkl',
    sizes: [{ ml: 50, price: 10900 }, { ml: 100, price: 15400 }],
    family: 'Деревний шкіряний',
    short: 'Сандал, кардамон і шкіра з фіалкою.',
    description:
      'Культовий сандал, який упізнають у будь-якому місті світу. Фіалка й кардамон, ірис і папірус, а далі австралійський сандал, кедр і шкіра — сухо, димно й дуже затишно.',
    notes: {
      top: ['Фіалка', 'Кардамон'],
      heart: ['Ірис', 'Амброксан', 'Папірус'],
      base: ['Австралійський сандал', 'Кедр', 'Шкіра'],
    },
    characteristics: { longevity: 4, projection: 4, seasons: ['Весна', 'Осінь', 'Зима'], occasion: 'Щодня, офіс' },
    tags: { families: ['woody'], occasions: ['day', 'office'], intensity: 'moderate' },
    bestseller: true,
    bottle: bottle({ body: 'apothecary', size: [0.82, 1.6, 0.82], glass: '#f1ece3', tint: 0.06, liquid: '#e9d8a8', cap: ['cylinder', 0.24, 0.42, 0.24, 'black'], collar: 'black', label: ['sticker', 'SANTAL 33', 'LE LABO', '#1a1a1a'] }),
  },
  {
    id: 'le-labo-another-13',
    brand: 'Le Labo',
    name: 'Another 13',
    concentration: EDP,
    year: 2010,
    perfumer: 'Nathalie Lorson',
    sizes: [{ ml: 50, price: 10900 }, { ml: 100, price: 15400 }],
    family: 'Мускусний амбровий',
    short: 'Амброксан і мускус — аромат «другої шкіри».',
    description:
      'Мінімалістичний, мінеральний і дуже особистий. Амброксан і мускус із дотиком груші, жасмину та моху звучать як тепла шкіра — хтось відчує його ледь-ледь, хтось — на відстані.',
    notes: { top: ['Груша', 'Амбретта'], heart: ['Жасмин', 'Мох'], base: ['Амброксан', 'Мускус'] },
    characteristics: { longevity: 4, projection: 3, seasons: ['Весна', 'Літо', 'Осінь', 'Зима'], occasion: 'Щодня, офіс' },
    tags: { families: ['fresh', 'woody'], occasions: ['day', 'office'], intensity: 'soft' },
    bottle: bottle({ body: 'apothecary', size: [0.82, 1.6, 0.82], glass: '#f1ece3', tint: 0.06, liquid: '#efe7d2', cap: ['cylinder', 0.24, 0.42, 0.24, 'black'], collar: 'black', label: ['sticker', 'ANOTHER 13', 'LE LABO', '#1a1a1a'] }),
  },

  /* ---------------- Byredo ---------------- */
  {
    id: 'byredo-gypsy-water',
    brand: 'Byredo',
    name: 'Gypsy Water',
    concentration: EDP,
    year: 2008,
    perfumer: 'Jérôme Epinette',
    sizes: [{ ml: 50, price: 8900 }, { ml: 100, price: 12900 }],
    family: 'Деревний ароматичний',
    short: 'Хвоя, ладан і ваніль — романтика кочового життя.',
    description:
      'Портрет вільного життя серед лісів: бергамот, лимон, перець і ялівець, ладан із сосновою хвоєю та ірисом, а потім м’яка амбра, ваніль і сандал.',
    notes: {
      top: ['Бергамот', 'Лимон', 'Перець', 'Ялівцеві ягоди'],
      heart: ['Ладан', 'Соснова хвоя', 'Корінь ірису'],
      base: ['Амбра', 'Ваніль', 'Сандалове дерево'],
    },
    characteristics: { longevity: 3, projection: 3, seasons: ['Весна', 'Осінь'], occasion: 'Щодня, вихідні' },
    tags: { families: ['woody', 'fresh'], occasions: ['day'], intensity: 'soft' },
    bottle: bottle({ body: 'cylinder', size: [0.82, 1.55, 0.82], glass: '#f1ece3', tint: 0.05, liquid: '#efe3c4', cap: ['cylinder', 0.42, 0.42, 0.42, 'black'], collar: 'black', label: ['sticker', 'GYPSY WATER', 'BYREDO', '#1a1a1a'] }),
  },
  {
    id: 'byredo-mojave-ghost',
    brand: 'Byredo',
    name: 'Mojave Ghost',
    concentration: EDP,
    year: 2014,
    perfumer: 'Jérôme Epinette',
    sizes: [{ ml: 50, price: 8900 }, { ml: 100, price: 12900 }],
    family: 'Деревний квітковий мускусний',
    short: 'Амбретта, магнолія й сандал — квітка пустелі.',
    description:
      'Натхненний квіткою, що виживає в пустелі Мохаве. Амбретта й соковита саподілла, фіалка, сандал і магнолія, а наостанок кедр, мускус і тепла амбра — прозоро й заворожливо.',
    notes: {
      top: ['Амбретта', 'Саподілла'],
      heart: ['Фіалка', 'Сандалове дерево', 'Магнолія'],
      base: ['Кедр', 'Мускус', 'Амбра'],
    },
    characteristics: { longevity: 3, projection: 3, seasons: ['Весна', 'Літо', 'Осінь'], occasion: 'Щодня, офіс' },
    tags: { families: ['floral', 'woody'], occasions: ['day', 'office'], intensity: 'soft' },
    bottle: bottle({ body: 'cylinder', size: [0.82, 1.55, 0.82], glass: '#f1ece3', tint: 0.05, liquid: '#f2e6d2', cap: ['cylinder', 0.42, 0.42, 0.42, 'black'], collar: 'black', label: ['sticker', 'MOJAVE GHOST', 'BYREDO', '#1a1a1a'] }),
  },

  /* ---------------- Maison Margiela ---------------- */
  {
    id: 'margiela-jazz-club',
    brand: 'Maison Margiela',
    name: 'Replica Jazz Club',
    concentration: EDT,
    year: 2013,
    perfumer: 'Alienor Massenet',
    sizes: [{ ml: 30, price: 3400 }, { ml: 100, price: 6300 }],
    family: 'Ароматичний пряний',
    short: 'Ром, тютюн і ваніль — вечір у джаз-клубі.',
    description:
      'Спогад про вечір у бруклінському клубі: рожевий перець і лимон, ром із шавлією та ветивером, а потім тютюновий лист, ванільний стручок і стиракс — тепло й невимушено.',
    notes: {
      top: ['Рожевий перець', 'Лимон', 'Неролі'],
      heart: ['Ром', 'Мускатна шавлія', 'Яванський ветивер'],
      base: ['Тютюновий лист', 'Ванільний стручок', 'Стиракс'],
    },
    characteristics: { longevity: 3, projection: 3, seasons: ['Осінь', 'Зима'], occasion: 'Вечори, вихідні' },
    tags: { families: ['sweet', 'spicy'], occasions: ['evening'], intensity: 'moderate' },
    bottle: bottle({ size: [0.95, 1.4, 0.55], radius: 0.16, glass: '#f1ece3', tint: 0.05, liquid: '#c98a3c', cap: ['cylinder', 0.3, 0.32, 0.3, 'silver'], label: ['sticker', 'JAZZ CLUB', 'REPLICA', '#1a1a1a'] }),
  },
  {
    id: 'margiela-by-the-fireplace',
    brand: 'Maison Margiela',
    name: 'Replica By the Fireplace',
    concentration: EDT,
    year: 2015,
    perfumer: 'Marie Salamagne',
    sizes: [{ ml: 30, price: 3400 }, { ml: 100, price: 6300 }],
    family: 'Деревний пряний',
    short: 'Каштани на вогні, гвоздика й ваніль.',
    description:
      'Затишок біля каміна: рожевий перець, апельсиновий цвіт і гвоздика, смажені каштани з гваяковим деревом і ялівцем та тепла база з ванілі, перуанського бальзаму й кашмерану.',
    notes: {
      top: ['Рожевий перець', 'Апельсиновий цвіт', 'Гвоздика'],
      heart: ['Каштан', 'Гваякове дерево', 'Ялівець'],
      base: ['Ваніль', 'Перуанський бальзам', 'Кашмеран'],
    },
    characteristics: { longevity: 4, projection: 3, seasons: ['Осінь', 'Зима'], occasion: 'Вечори вдома, холодна пора' },
    tags: { families: ['sweet', 'woody', 'spicy'], occasions: ['evening', 'day'], intensity: 'moderate' },
    bottle: bottle({ size: [0.95, 1.4, 0.55], radius: 0.16, glass: '#f1ece3', tint: 0.05, liquid: '#a8611f', cap: ['cylinder', 0.3, 0.32, 0.3, 'silver'], label: ['sticker', 'BY THE FIREPLACE', 'REPLICA', '#1a1a1a'] }),
  },

  /* ---------------- Initio ---------------- */
  {
    id: 'initio-oud-for-greatness',
    brand: 'Initio Parfums Privés',
    name: 'Oud for Greatness',
    concentration: EDP,
    year: 2018,
    sizes: [{ ml: 90, price: 14900 }],
    family: 'Деревний уд',
    short: 'Шафран, мускатний горіх і чистий уд.',
    description:
      'Сміливий і величний: шафран, мускатний горіх і лаванда відкривають густий уд, а пачулі та мускус роблять шлейф глибоким і довгим. Аромат для тих, хто не боїться уваги.',
    notes: { top: ['Шафран', 'Мускатний горіх', 'Лаванда'], heart: ['Уд'], base: ['Пачулі', 'Мускус'] },
    characteristics: { longevity: 5, projection: 5, seasons: ['Осінь', 'Зима'], occasion: 'Вечори, урочисті події' },
    tags: { families: ['woody', 'spicy'], occasions: ['evening', 'special'], intensity: 'intense' },
    bottle: bottle({ size: [0.95, 1.65, 0.62], radius: 0.04, glass: '#efe6da', tint: 0.1, liquid: '#5a2a3a', cap: ['cylinder', 0.36, 0.5, 0.36, 'black'], collar: 'gunmetal', label: ['print', 'OUD FOR GREATNESS', 'INITIO', '#f1e8da'] }),
  },
  {
    id: 'initio-side-effect',
    brand: 'Initio Parfums Privés',
    name: 'Side Effect',
    concentration: EDP,
    year: 2016,
    sizes: [{ ml: 90, price: 14900 }],
    family: 'Амбровий пряний',
    short: 'Ром, тютюн, ваніль і кориця.',
    description:
      'П’янкий і чуттєвий: ром і тютюн з ваніллю та корицею створюють густу теплу хмару, яка довго тримається на шкірі та одязі.',
    notes: { top: ['Ром'], heart: ['Тютюн', 'Кориця'], base: ['Ваніль'] },
    characteristics: { longevity: 5, projection: 4, seasons: ['Осінь', 'Зима'], occasion: 'Вечори, побачення' },
    tags: { families: ['sweet', 'spicy'], occasions: ['evening', 'special'], intensity: 'intense' },
    bottle: bottle({ size: [0.95, 1.65, 0.62], radius: 0.04, glass: '#efe6da', tint: 0.1, liquid: '#7a2a1c', cap: ['cylinder', 0.36, 0.5, 0.36, 'black'], collar: 'gunmetal', label: ['print', 'SIDE EFFECT', 'INITIO', '#f1e8da'] }),
  },

  /* ---------------- Amouage ---------------- */
  {
    id: 'amouage-interlude-man',
    brand: 'Amouage',
    name: 'Interlude Man',
    concentration: EDP,
    year: 2012,
    perfumer: 'Pierre Negrin',
    sizes: [{ ml: 100, price: 14900 }],
    family: 'Амбровий пряний',
    short: 'Ладан, амбра й шкіра з орегано — димний хаос.',
    description:
      'Аромат-«антракт» між порядком і хаосом: орегано, перець і бергамот, димний ладан з амброю, лабданумом і опопонаксом, а потім шкіра, уд, сандал і пачулі. Потужний і незабутній.',
    notes: {
      top: ['Орегано', 'Перець', 'Бергамот'],
      heart: ['Ладан', 'Амбра', 'Лабданум', 'Опопонакс'],
      base: ['Шкіра', 'Уд', 'Сандалове дерево', 'Пачулі'],
    },
    characteristics: { longevity: 5, projection: 5, seasons: ['Осінь', 'Зима'], occasion: 'Вечори, холодна пора' },
    tags: { families: ['spicy', 'woody'], occasions: ['evening', 'special'], intensity: 'intense' },
    bottle: bottle({ body: 'octagon', size: [0.95, 1.55, 0.62], glass: '#14233e', tint: 0.8, liquid: '#1c2c4a', cap: ['facet', 0.6, 0.48, 0.46, 'silver'], label: ['plate', 'INTERLUDE MAN', 'AMOUAGE', '#1a1a1a', 'silver'] }),
  },
  {
    id: 'amouage-reflection-man',
    brand: 'Amouage',
    name: 'Reflection Man',
    concentration: EDP,
    year: 2007,
    perfumer: 'Lucas Sieuzac',
    sizes: [{ ml: 100, price: 14900 }],
    family: 'Деревний квітковий мускусний',
    short: 'Неролі, жасмин і ірис на сандалі.',
    description:
      'Світлий, чистий і вишуканий: розмарин, рожевий перець і петитгрейн, квіткове серце з жасмину, неролі та кореня ірису й деревна база з сандалу, кедру й ветиверу.',
    notes: {
      top: ['Розмарин', 'Рожевий перець', 'Петитгрейн'],
      heart: ['Жасмин', 'Неролі', 'Корінь ірису'],
      base: ['Сандалове дерево', 'Кедр', 'Ветивер', 'Пачулі'],
    },
    characteristics: { longevity: 4, projection: 4, seasons: ['Весна', 'Літо'], occasion: 'Офіс, день, урочисті події' },
    tags: { families: ['floral', 'fresh', 'woody'], occasions: ['day', 'office'], intensity: 'moderate' },
    bottle: bottle({ body: 'octagon', size: [0.95, 1.55, 0.62], glass: '#f1ece3', tint: 0.06, liquid: '#e9e0b8', cap: ['facet', 0.6, 0.48, 0.46, 'silver'], label: ['plate', 'REFLECTION MAN', 'AMOUAGE', '#1a1a1a', 'silver'] }),
  },

  /* ---------------- Yves Saint Laurent ---------------- */
  {
    id: 'ysl-libre-edp',
    brand: 'Yves Saint Laurent',
    name: 'Libre Eau de Parfum',
    concentration: EDP,
    year: 2019,
    perfumer: 'Anne Flipo & Carlos Benaïm',
    sizes: [{ ml: 50, price: 5400 }, { ml: 90, price: 7400 }],
    family: 'Амбровий фужер',
    short: 'Лаванда й апельсиновий цвіт на ванілі.',
    description:
      'Аромат свободи: французька лаванда в поєднанні з марокканським апельсиновим цвітом і жасмином на чуттєвій мадагаскарській ванілі та мускусі. Сміливий і жіночний водночас.',
    notes: {
      top: ['Лаванда', 'Мандарин', 'Чорна смородина', 'Петитгрейн'],
      heart: ['Лаванда', 'Апельсиновий цвіт', 'Жасмин'],
      base: ['Мадагаскарська ваніль', 'Мускус', 'Кедр', 'Амбергрис'],
    },
    characteristics: { longevity: 4, projection: 4, seasons: ['Осінь', 'Зима', 'Весна'], occasion: 'Офіс, вечори, щодня' },
    tags: { families: ['floral', 'sweet'], occasions: ['day', 'evening'], intensity: 'moderate' },
    bottle: bottle({ size: [1.0, 1.45, 0.52], radius: 0.06, glass: '#f1e7d6', tint: 0.08, liquid: '#e7b98a', cap: ['box', 0.6, 0.5, 0.42, 'black'], collar: 'gold', label: ['plate', 'LIBRE', 'YVES SAINT LAURENT', '#2b1c08', 'gold'] }),
  },
  {
    id: 'ysl-la-nuit-de-lhomme',
    brand: 'Yves Saint Laurent',
    name: "La Nuit de L'Homme",
    concentration: EDT,
    year: 2009,
    perfumer: 'Anne Flipo, Pierre Wargnye & Dominique Ropion',
    sizes: [{ ml: 60, price: 4300 }, { ml: 100, price: 5900 }],
    family: 'Пряний ароматичний',
    short: 'Кардамон і лаванда з кедром — нічна спокуса.',
    description:
      'Чуттєва класика для вечорів: кардамон відкриває серце з лаванди, кедра й бергамоту, а ветивер і кмин додають теплого, трохи загадкового шлейфу.',
    notes: { top: ['Кардамон'], heart: ['Лаванда', 'Кедр', 'Бергамот'], base: ['Ветивер', 'Кмин'] },
    characteristics: { longevity: 3, projection: 3, seasons: ['Осінь', 'Зима', 'Весна'], occasion: 'Вечори, побачення' },
    tags: { families: ['spicy', 'fresh'], occasions: ['evening'], intensity: 'soft' },
    bottle: bottle({ size: [0.9, 1.6, 0.5], radius: 0.04, glass: '#17171d', tint: 0.85, liquid: '#1d1d26', cap: ['box', 0.56, 0.44, 0.42, 'black'], collar: 'silver', label: ['print', "LA NUIT DE L'HOMME", 'YVES SAINT LAURENT', '#cfd2d8'] }),
  },
  {
    id: 'ysl-black-opium',
    brand: 'Yves Saint Laurent',
    name: 'Black Opium',
    concentration: EDP,
    year: 2014,
    perfumer: 'Nathalie Lorson, Marie Salamagne, Olivier Cresp & Honorine Blanc',
    sizes: [{ ml: 50, price: 5200 }, { ml: 90, price: 7200 }],
    family: 'Амбровий гурманський',
    short: 'Кава, ваніль і білі квіти.',
    description:
      'Рок-н-рольний гурманський аромат: груша, рожевий перець і апельсиновий цвіт, енергійна кава з жасмином і гірким мигдалем та ваніль, пачулі й кедр у шлейфі.',
    notes: {
      top: ['Груша', 'Рожевий перець', 'Апельсиновий цвіт'],
      heart: ['Кава', 'Жасмин', 'Гіркий мигдаль', 'Лакриця'],
      base: ['Ваніль', 'Пачулі', 'Кедр', 'Кашмірове дерево'],
    },
    characteristics: { longevity: 4, projection: 4, seasons: ['Осінь', 'Зима'], occasion: 'Вечори, вечірки' },
    tags: { families: ['sweet', 'floral'], occasions: ['evening', 'special'], intensity: 'intense' },
    bestseller: true,
    bottle: bottle({ size: [0.95, 1.5, 0.55], radius: 0.05, glass: '#141016', tint: 0.92, liquid: '#1c1418', cap: ['box', 0.6, 0.48, 0.44, 'black'], collar: 'rose', label: ['print', 'BLACK OPIUM', 'YVES SAINT LAURENT', '#e7b9c4'] }),
  },

  /* ---------------- Jean Paul Gaultier ---------------- */
  {
    id: 'jpg-le-male-le-parfum',
    brand: 'Jean Paul Gaultier',
    name: 'Le Male Le Parfum',
    concentration: EDP,
    year: 2020,
    perfumer: 'Quentin Bisch & Natalie Gracia-Cetto',
    sizes: [{ ml: 75, price: 4900 }, { ml: 125, price: 6400 }],
    family: 'Деревний пряний',
    short: 'Кардамон, ірис і ваніль — Le Male у парадному мундирі.',
    description:
      'Елегантна вечірня версія Le Male: кардамон відкриває пудрові лаванду та ірис, а ваніль і деревні ноти роблять шлейф теплим і оксамитовим.',
    notes: { top: ['Кардамон'], heart: ['Лаванда', 'Ірис'], base: ['Ваніль', 'Деревні ноти'] },
    characteristics: { longevity: 5, projection: 4, seasons: ['Осінь', 'Зима'], occasion: 'Вечори, побачення' },
    tags: { families: ['sweet', 'spicy'], occasions: ['evening', 'special'], intensity: 'intense' },
    bottle: bottle({ body: 'torso', size: [1.05, 1.85, 0.62], radius: 0, glass: '#1b2438', tint: 0.8, liquid: '#232e46', cap: ['cylinder', 0.26, 0.34, 0.26, 'gold'], label: ['print', 'LE MALE', 'LE PARFUM', '#e3cc9a'] }),
  },

  /* ---------------- Lancôme ---------------- */
  {
    id: 'lancome-la-vie-est-belle',
    brand: 'Lancôme',
    name: 'La Vie Est Belle',
    concentration: EDP,
    year: 2012,
    perfumer: 'Olivier Polge, Dominique Ropion & Anne Flipo',
    sizes: [{ ml: 50, price: 4900 }, { ml: 100, price: 6900 }],
    family: 'Квітковий гурманський',
    short: 'Ірис, праліне й ваніль — аромат щастя.',
    description:
      'Посмішка у флаконі: чорна смородина й груша, ірис із жасмином та апельсиновим цвітом і гурманська база з праліне, ванілі, пачулі та бобів тонка.',
    notes: {
      top: ['Чорна смородина', 'Груша'],
      heart: ['Ірис', 'Жасмин', 'Апельсиновий цвіт'],
      base: ['Праліне', 'Ваніль', 'Пачулі', 'Боби тонка'],
    },
    characteristics: { longevity: 5, projection: 4, seasons: ['Осінь', 'Зима', 'Весна'], occasion: 'Щодня, свята' },
    tags: { families: ['sweet', 'floral'], occasions: ['day', 'special'], intensity: 'intense' },
    bestseller: true,
    bottle: bottle({ body: 'stone', size: [1.15, 1.35, 0.6], radius: 0.28, glass: '#f6eef0', tint: 0.06, liquid: '#f0bccb', cap: ['dome', 0.5, 0.36, 0.4, 'silver'], label: ['print', 'LA VIE EST BELLE', 'LANCÔME', '#3a2a2e'] }),
  },

  /* ---------------- Giorgio Armani ---------------- */
  {
    id: 'armani-si-edp',
    brand: 'Giorgio Armani',
    name: 'Sì',
    concentration: EDP,
    year: 2013,
    perfumer: 'Christine Nagel',
    sizes: [{ ml: 50, price: 4700 }, { ml: 100, price: 6600 }],
    family: 'Шипровий фруктовий',
    short: 'Касис, троянда й ваніль на пачулі.',
    description:
      'Сучасний шипр для впевненої жінки: нектар чорної смородини, травнева троянда й фрезія, а потім ваніль, пачулі, амброксан і деревні ноти — тепло й елегантно.',
    notes: {
      top: ['Нектар чорної смородини'],
      heart: ['Травнева троянда', 'Фрезія'],
      base: ['Ваніль', 'Пачулі', 'Амброксан', 'Деревні ноти'],
    },
    characteristics: { longevity: 4, projection: 4, seasons: ['Осінь', 'Зима', 'Весна'], occasion: 'Офіс, вечори' },
    tags: { families: ['sweet', 'floral'], occasions: ['office', 'evening'], intensity: 'moderate' },
    bottle: bottle({ size: [1.0, 1.4, 0.5], radius: 0.05, glass: '#2a2629', tint: 0.7, liquid: '#4a2f34', cap: ['box', 0.56, 0.46, 0.42, 'black'], collar: 'gold', label: ['print', 'SÌ', 'GIORGIO ARMANI', '#e3cc9a'] }),
  },

  /* ---------------- Hermès ---------------- */
  {
    id: 'hermes-terre-dhermes',
    brand: 'Hermès',
    name: "Terre d'Hermès",
    concentration: EDT,
    year: 2006,
    perfumer: 'Jean-Claude Ellena',
    sizes: [{ ml: 50, price: 4600 }, { ml: 100, price: 6400 }],
    family: 'Деревний пряний',
    short: 'Апельсин і кремінь на ветивері та кедрі.',
    description:
      'Алхімія землі: апельсин і грейпфрут, перець і пеларгонія з мінеральним відтінком кременю та глибока база з ветиверу, кедру, пачулі й бензоїну. Сучасна чоловіча класика.',
    notes: {
      top: ['Апельсин', 'Грейпфрут'],
      heart: ['Перець', 'Пеларгонія', 'Кремінь'],
      base: ['Ветивер', 'Кедр', 'Пачулі', 'Бензоїн'],
    },
    characteristics: { longevity: 4, projection: 3, seasons: ['Весна', 'Літо', 'Осінь'], occasion: 'Офіс, щодня' },
    tags: { families: ['woody', 'fresh'], occasions: ['office', 'day'], intensity: 'moderate' },
    bottle: bottle({ size: [0.95, 1.45, 0.62], radius: 0.06, glass: '#f0e4d2', tint: 0.12, liquid: '#d98a3a', cap: ['box', 0.62, 0.34, 0.5, 'silver'], label: ['print', "TERRE D'HERMÈS", 'HERMÈS', '#2a1a0d'] }),
  },

  /* ---------------- Mancera / Nishane ---------------- */
  {
    id: 'mancera-cedrat-boise',
    brand: 'Mancera',
    name: 'Cedrat Boisé',
    concentration: EDP,
    year: 2011,
    sizes: [{ ml: 120, price: 6400 }],
    family: 'Шипровий фруктовий',
    short: 'Цитрон і чорна смородина на шкірі та сандалі.',
    description:
      'Свіжий фруктово-деревний аромат з чудовою стійкістю: цитрусові, чорна смородина й прянощі, фруктове серце з пачулі та жасмином і база зі шкіри, сандалу, ванілі та дубового моху.',
    notes: {
      top: ['Цитрусові', 'Чорна смородина', 'Прянощі', 'Лимон'],
      heart: ['Фруктові ноти', 'Пачулі', 'Жасмин'],
      base: ['Шкіра', 'Сандалове дерево', 'Ваніль', 'Білий мускус', 'Дубовий мох', 'Кедр'],
    },
    characteristics: { longevity: 5, projection: 4, seasons: ['Весна', 'Літо', 'Осінь'], occasion: 'Щодня, офіс' },
    tags: { families: ['fresh', 'woody'], occasions: ['day', 'office'], intensity: 'moderate' },
    bottle: bottle({ size: [0.95, 1.55, 0.55], radius: 0.04, glass: '#efe6da', tint: 0.08, liquid: '#e8d9a2', cap: ['box', 0.6, 0.46, 0.46, 'gold'], label: ['print', 'CEDRAT BOISÉ', 'MANCERA', '#2b1c08'] }),
  },
  {
    id: 'nishane-hacivat',
    brand: 'Nishane',
    name: 'Hacivat',
    concentration: EXTRAIT,
    year: 2017,
    perfumer: 'Jorge Lee',
    sizes: [{ ml: 50, price: 8400 }, { ml: 100, price: 11900 }],
    family: 'Шипровий',
    short: 'Ананас і бергамот на дубовому моху.',
    description:
      'Стамбульська відповідь класичним шипрам: ананас, грейпфрут і бергамот, деревне серце з кедру, пачулі та жасмину й мохова база, що звучить сухо, свіжо й дуже довго.',
    notes: {
      top: ['Ананас', 'Грейпфрут', 'Бергамот'],
      heart: ['Кедр', 'Пачулі', 'Жасмин'],
      base: ['Дубовий мох', 'Деревні ноти'],
    },
    characteristics: { longevity: 5, projection: 4, seasons: ['Весна', 'Літо', 'Осінь'], occasion: 'Офіс, день, бізнес' },
    tags: { families: ['fresh', 'woody'], occasions: ['day', 'office'], intensity: 'intense' },
    bottle: bottle({ size: [0.9, 1.55, 0.6], radius: 0.05, glass: '#efe6da', tint: 0.1, liquid: '#d9cf8c', cap: ['box', 0.58, 0.5, 0.48, 'gold'], label: ['plate', 'HACIVAT', 'NISHANE', '#2b1c08', 'gold'] }),
  },

  /* ---------------- Frédéric Malle ---------------- */
  {
    id: 'frederic-malle-portrait-of-a-lady',
    brand: 'Frédéric Malle',
    name: 'Portrait of a Lady',
    concentration: EDP,
    year: 2010,
    perfumer: 'Dominique Ropion',
    sizes: [{ ml: 50, price: 13400 }, { ml: 100, price: 19400 }],
    family: 'Амбровий квітковий',
    short: 'Турецька троянда й пачулі з ладаном.',
    description:
      'Одна з найвідоміших троянд нішевої парфумерії: малина, гвоздика й кориця, величезне серце з турецької троянди й пачулі та база з сандалу, ладану, бензоїну й мускусу.',
    notes: {
      top: ['Малина', 'Гвоздика', 'Кориця', 'Чорна смородина'],
      heart: ['Турецька троянда', 'Пачулі'],
      base: ['Сандалове дерево', 'Ладан', 'Бензоїн', 'Мускус', 'Амбра'],
    },
    characteristics: { longevity: 5, projection: 5, seasons: ['Осінь', 'Зима'], occasion: 'Вечори, особливі події' },
    tags: { families: ['floral', 'spicy', 'woody'], occasions: ['evening', 'special'], intensity: 'intense' },
    bottle: bottle({ size: [0.82, 1.6, 0.5], radius: 0.03, glass: '#efe6da', tint: 0.08, liquid: '#7a1a24', cap: ['box', 0.52, 0.42, 0.42, 'black'], collar: 'black', label: ['sticker', 'PORTRAIT OF A LADY', 'FRÉDÉRIC MALLE', '#1a1a1a'] }),
  },

  /* ---------------- Louis Vuitton ---------------- */
  {
    id: 'louis-vuitton-imagination',
    brand: 'Louis Vuitton',
    name: 'Imagination',
    concentration: EDP,
    year: 2021,
    perfumer: 'Jacques Cavallier Belletrud',
    sizes: [{ ml: 100, price: 18900 }],
    family: 'Цитрусовий ароматичний',
    short: 'Цитрон, імбир і чорний чай.',
    description:
      'Світлий і благородний цитрус: цитрон, бергамот і сицилійський апельсин, нігерійський імбир, цейлонська кориця й туніський неролі та база з амброксану, гваякового дерева, чорного чаю й ладану.',
    notes: {
      top: ['Цитрон', 'Калабрійський бергамот', 'Сицилійський апельсин'],
      heart: ['Нігерійський імбир', 'Цейлонська кориця', 'Туніський неролі'],
      base: ['Амброксан', 'Гваякове дерево', 'Китайський чорний чай', 'Олібанум'],
    },
    characteristics: { longevity: 4, projection: 4, seasons: ['Весна', 'Літо'], occasion: 'День, офіс, подорожі' },
    tags: { families: ['fresh', 'spicy'], occasions: ['day', 'office'], intensity: 'moderate' },
    bottle: bottle({ size: [0.95, 1.5, 0.6], radius: 0.16, glass: '#f1ece3', tint: 0.05, liquid: '#e6d7a6', cap: ['box', 0.56, 0.34, 0.46, 'silver'], label: ['print', 'IMAGINATION', 'LOUIS VUITTON', '#1a1a1a'] }),
  },
  {
    id: 'louis-vuitton-ombre-nomade',
    brand: 'Louis Vuitton',
    name: 'Ombre Nomade',
    concentration: EDP,
    year: 2018,
    perfumer: 'Jacques Cavallier Belletrud',
    sizes: [{ ml: 100, price: 24900 }],
    family: 'Амбровий деревний',
    short: 'Уд, малина й ладан — тінь кочівника.',
    description:
      'Подорож пустелею: насичений уд із соковитою малиною, ладаном і трояндою, бензоїн, береза, шафран і герань. Глибокий, димний і розкішний, з неймовірною стійкістю.',
    notes: {
      top: ['Уд', 'Малина'],
      heart: ['Ладан', 'Троянда', 'Шафран', 'Герань'],
      base: ['Бензоїн', 'Береза', 'Амбра'],
    },
    characteristics: { longevity: 5, projection: 5, seasons: ['Осінь', 'Зима'], occasion: 'Вечори, урочисті події' },
    tags: { families: ['woody', 'spicy', 'sweet'], occasions: ['evening', 'special'], intensity: 'intense' },
    bottle: bottle({ size: [0.95, 1.5, 0.6], radius: 0.16, glass: '#efe3d0', tint: 0.12, liquid: '#7a3a18', cap: ['box', 0.56, 0.34, 0.46, 'gold'], label: ['print', 'OMBRE NOMADE', 'LOUIS VUITTON', '#1a1a1a'] }),
  },

  /* ---------------- Diptyque ---------------- */
  {
    id: 'diptyque-tam-dao',
    brand: 'Diptyque',
    name: 'Tam Dao',
    concentration: EDT,
    year: 2003,
    perfumer: 'Daniela Andrier',
    sizes: [{ ml: 50, price: 5600 }, { ml: 100, price: 7900 }],
    family: 'Деревний',
    short: 'Сандал, кипарис і рожеве дерево.',
    description:
      'Медитативний сандаловий аромат, натхненний в’єтнамськими лісами: рожеве дерево, кипарис і мирт, кремовий сандал і м’яка база з амбри, кедру, прянощів та білого мускусу.',
    notes: {
      top: ['Рожеве дерево', 'Кипарис', 'Мирт'],
      heart: ['Сандалове дерево'],
      base: ['Амбра', 'Кедр', 'Прянощі', 'Білий мускус'],
    },
    characteristics: { longevity: 3, projection: 2, seasons: ['Осінь', 'Зима', 'Весна'], occasion: 'Офіс, щодня' },
    tags: { families: ['woody'], occasions: ['office', 'day'], intensity: 'soft' },
    bottle: bottle({ body: 'stone', size: [1.0, 1.45, 0.55], radius: 0.25, glass: '#f1ece3', tint: 0.05, liquid: '#e6d0a8', cap: ['cylinder', 0.26, 0.4, 0.26, 'black'], collar: 'black', label: ['sticker', 'TAM DAO', 'DIPTYQUE', '#1a1a1a'] }),
  },

  /* ---------------- Tiziana Terenzi ---------------- */
  {
    id: 'tiziana-terenzi-kirke',
    brand: 'Tiziana Terenzi',
    name: 'Kirke',
    concentration: EXTRAIT,
    year: 2015,
    sizes: [{ ml: 100, price: 12900 }],
    family: 'Шипровий фруктовий',
    short: 'Маракуя, персик і малина на мускусі.',
    description:
      'Магнетичний фруктовий шипр, названий на честь чарівниці Кірки: маракуя, персик, малина, чорна смородина й груша, конвалія в серці та база з мускусу, геліотропу, сандалу, ванілі й пачулі.',
    notes: {
      top: ['Маракуя', 'Персик', 'Малина', 'Чорна смородина', 'Груша'],
      heart: ['Конвалія'],
      base: ['Мускус', 'Геліотроп', 'Сандалове дерево', 'Ваніль', 'Пачулі'],
    },
    characteristics: { longevity: 5, projection: 5, seasons: ['Весна', 'Літо', 'Осінь'], occasion: 'День, свята' },
    tags: { families: ['sweet', 'fresh'], occasions: ['day', 'special'], intensity: 'intense' },
    bottle: bottle({ size: [0.85, 1.7, 0.6], radius: 0.06, glass: '#3a2a4a', tint: 0.55, liquid: '#c87a9a', cap: ['sphere', 0.5, 0.46, 0.5, 'gold'], label: ['plate', 'KIRKE', 'TIZIANA TERENZI', '#2b1c08', 'gold'] }),
  },
]
