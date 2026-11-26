/**
 * PRODUCT CATALOGUE
 * -----------------
 * All prices are in UAH and are indicative Ukrainian retail prices.
 * Edit `sizes[].price` to change them — everything else (cards, cart,
 * totals, filters) recalculates automatically.
 *
 * Information sources:
 *  - `notes`, `year`, `perfumer`, `concentration` reflect the fragrance
 *    pyramids and facts published by the houses and widely reproduced by
 *    fragrance references. They are marked "Official" in the UI.
 *  - `description`, `characteristics` (longevity, projection, season,
 *    occasion) and `tags` are the boutique's own editorial opinion and are
 *    marked "Editorial" in the UI.
 *
 * The 3D bottles are stylised interpretations generated from `bottle`
 * parameters — they are NOT official replicas of the houses' packaging.
 */

export type Family = 'fresh' | 'sweet' | 'woody' | 'spicy' | 'floral'
export type Occasion = 'day' | 'office' | 'evening' | 'special'
export type Intensity = 'soft' | 'moderate' | 'intense'
export type Season = 'Весна' | 'Літо' | 'Осінь' | 'Зима'

export type Metal = 'gold' | 'silver' | 'black' | 'gunmetal' | 'bronze'

export interface BottleSpec {
  body: 'box' | 'cylinder' | 'torso' | 'stone'
  /** width, height, depth in scene units (height ≈ 2) */
  size: [number, number, number]
  radius: number
  glass: string
  /** 0 = crystal clear, 1 = heavily tinted */
  tint: number
  liquid: string
  liquidLevel: number
  cap: {
    shape: 'box' | 'cylinder' | 'dome' | 'facet'
    size: [number, number, number]
    metal: Metal
  }
  collar: Metal
  /** stacked metal rings at the neck */
  collarRings?: boolean
  /** glass base thickness as a fraction of height (default 0.08) */
  base?: number
  label: {
    kind: 'plate' | 'print'
    metal?: Metal
    text: string
    sub: string
    color: string
  }
}

export interface Size {
  ml: number
  price: number
}

export interface Product {
  id: string
  brand: string
  name: string
  concentration: string
  year: number
  perfumer?: string
  sizes: Size[]
  family: string
  short: string
  description: string
  notes: { top: string[]; heart: string[]; base: string[] }
  characteristics: {
    longevity: number // 1–5, editorial
    projection: number // 1–5, editorial
    seasons: Season[]
    occasion: string
  }
  tags: { families: Family[]; occasions: Occasion[]; intensity: Intensity }
  bestseller?: boolean
  availabilityNote?: string
  bottle: BottleSpec
}

export const products: Product[] = [
  {
    id: 'ysl-y-edp',
    brand: 'Yves Saint Laurent',
    name: 'Y Eau de Parfum',
    concentration: 'Парфумована вода',
    year: 2018,
    perfumer: 'Dominique Ropion',
    sizes: [
      { ml: 60, price: 4650 },
      { ml: 100, price: 6300 },
    ],
    family: 'Ароматичний фужер',
    short: 'Хрустке яблуко й шавлія на теплому шлейфі амбервуду.',
    description:
      'Сучасний фужер, побудований на контрасті: яскравість яблука, імбиру й бергамоту зустрічається з ароматичним серцем шавлії та ялівцю, а потім м’яко осідає в амбервуді й бобах тонка. Вишуканий, універсальний і впевнено чистий.',
    notes: {
      top: ['Яблуко', 'Імбир', 'Бергамот'],
      heart: ['Шавлія', 'Ягоди ялівцю', 'Герань'],
      base: ['Амбервуд', 'Боби тонка', 'Кедр', 'Ветивер', 'Олібанум'],
    },
    characteristics: {
      longevity: 4,
      projection: 3,
      seasons: ['Весна', 'Осінь', 'Зима'],
      occasion: 'Офіс, день, вечори у стилі смарт-кежуал',
    },
    tags: { families: ['fresh', 'woody'], occasions: ['day', 'office'], intensity: 'moderate' },
    bottle: {
      body: 'box',
      size: [0.95, 1.75, 0.5],
      radius: 0.05,
      glass: '#1b2a44',
      tint: 0.75,
      liquid: '#14213b',
      liquidLevel: 0.86,
      cap: { shape: 'box', size: [0.62, 0.42, 0.42], metal: 'black' },
      collar: 'silver',
      label: { kind: 'print', text: 'Y', sub: 'EAU DE PARFUM', color: '#dfe6f2' },
    },
  },
  {
    id: 'jpg-le-male-elixir',
    brand: 'Jean Paul Gaultier',
    name: 'Le Male Elixir',
    concentration: 'Парфуми',
    year: 2023,
    perfumer: 'Quentin Bisch',
    sizes: [
      { ml: 75, price: 5450 },
      { ml: 125, price: 6950 },
    ],
    family: 'Амбровий фужер',
    short: 'Лаванда й м’ята, що тануть у меді, тютюні та бобах тонка.',
    description:
      'Найінтенсивніший розділ історії Le Male. Свіжа лаванда й м’ята розкриваються густим золотистим акордом ванілі та бензоїну, а завершуються медом, тютюном і бобами тонка — чуттєво, солодко й безперечно по-вечірньому.',
    notes: {
      top: ['Лаванда', 'М’ята'],
      heart: ['Ваніль', 'Бензоїн'],
      base: ['Мед', 'Боби тонка', 'Тютюн'],
    },
    characteristics: {
      longevity: 5,
      projection: 4,
      seasons: ['Осінь', 'Зима'],
      occasion: 'Вечори, побачення, нічне життя',
    },
    tags: { families: ['sweet', 'spicy'], occasions: ['evening', 'special'], intensity: 'intense' },
    bottle: {
      body: 'torso',
      size: [1.05, 1.85, 0.62],
      radius: 0,
      glass: '#c08a2a',
      tint: 0.55,
      liquid: '#b5741a',
      liquidLevel: 0.9,
      cap: { shape: 'cylinder', size: [0.26, 0.34, 0.26], metal: 'gold' },
      collar: 'gold',
      label: { kind: 'print', text: 'LE MALE', sub: 'ELIXIR', color: '#3a2306' },
    },
  },
  {
    id: 'dior-sauvage-elixir',
    brand: 'Dior',
    name: 'Sauvage Elixir',
    concentration: 'Еліксир',
    year: 2021,
    perfumer: 'François Demachy',
    sizes: [
      { ml: 60, price: 7100 },
      { ml: 100, price: 9800 },
    ],
    family: 'Пряний ароматичний',
    short: 'Кориця, мускатний горіх і лаванда на тлі лакриці та сандалу.',
    description:
      'Надконцентрована інтерпретація Sauvage. Грейпфрут і жменя прянощів — кориця, мускатний горіх, кардамон — обрамлюють лавандове серце, а лакриця, сандал, амбра й ветивер додають темної смолистої глибини.',
    notes: {
      top: ['Грейпфрут', 'Кориця', 'Мускатний горіх', 'Кардамон'],
      heart: ['Лаванда'],
      base: ['Лакриця', 'Сандалове дерево', 'Амбра', 'Пачулі', 'Гаїтянський ветивер'],
    },
    characteristics: {
      longevity: 5,
      projection: 4,
      seasons: ['Осінь', 'Зима'],
      occasion: 'Вечори, урочисті події',
    },
    tags: { families: ['spicy', 'woody'], occasions: ['evening', 'special'], intensity: 'intense' },
    bestseller: true,
    bottle: {
      body: 'box',
      size: [1.0, 1.6, 0.58],
      radius: 0.08,
      glass: '#1a2230',
      tint: 0.85,
      liquid: '#2a1b12',
      liquidLevel: 0.85,
      cap: { shape: 'box', size: [0.7, 0.5, 0.5], metal: 'black' },
      collar: 'gunmetal',
      label: { kind: 'print', text: 'SAUVAGE', sub: 'ELIXIR', color: '#c9ced8' },
    },
  },
  {
    id: 'tom-ford-oud-wood',
    brand: 'Tom Ford',
    name: 'Oud Wood',
    concentration: 'Парфумована вода',
    year: 2007,
    perfumer: 'Richard Herpin',
    sizes: [
      { ml: 50, price: 12900 },
      { ml: 100, price: 18400 },
    ],
    family: 'Амбровий деревний',
    short: 'Оксамитовий уд, рожеве дерево й кардамон, огорнуті бобами тонка.',
    description:
      'Один із перших західних ароматів, що зробив уд по-справжньому носибельним. Рожеве дерево, кардамон і китайський перець ведуть до м’якого димного серця з уду, сандалу та ветиверу, яке пом’якшують боби тонка, ваніль і амбра. Вишуканий, а не анімалістичний.',
    notes: {
      top: ['Рожеве дерево', 'Кардамон', 'Китайський перець'],
      heart: ['Уд', 'Сандалове дерево', 'Ветивер'],
      base: ['Боби тонка', 'Ваніль', 'Амбра'],
    },
    characteristics: {
      longevity: 4,
      projection: 3,
      seasons: ['Осінь', 'Зима', 'Весна'],
      occasion: 'Офіс, вечері, аромат-підпис',
    },
    tags: { families: ['woody', 'spicy'], occasions: ['office', 'evening'], intensity: 'moderate' },
    bottle: {
      body: 'box',
      size: [0.92, 1.7, 0.6],
      radius: 0.03,
      glass: '#3b2414',
      tint: 0.7,
      liquid: '#5b3412',
      liquidLevel: 0.82,
      cap: { shape: 'box', size: [0.7, 0.36, 0.48], metal: 'bronze' },
      collar: 'gold',
      label: { kind: 'plate', metal: 'gold', text: 'OUD WOOD', sub: 'PRIVATE BLEND', color: '#2a1a0d' },
    },
  },
  {
    id: 'creed-aventus',
    brand: 'Creed',
    name: 'Aventus',
    concentration: 'Парфумована вода',
    year: 2010,
    perfumer: 'Olivier Creed & Erwin Creed',
    sizes: [
      { ml: 50, price: 13900 },
      { ml: 100, price: 19600 },
    ],
    family: 'Фруктовий шипр',
    short: 'Ананас і чорна смородина на димній березі та мускусі.',
    description:
      'Сучасна легенда. Соковитий ананас, бергамот, чорна смородина та яблуко відкривають димну березу й пачулі, що спочивають на сухій базі з мускусу, дубового моху та амбергрису. Сміливий, магнетичний і безліч разів наслідуваний.',
    notes: {
      top: ['Ананас', 'Бергамот', 'Чорна смородина', 'Яблуко'],
      heart: ['Береза', 'Пачулі', 'Марокканський жасмин', 'Троянда'],
      base: ['Мускус', 'Дубовий мох', 'Амбергрис', 'Ваніль'],
    },
    characteristics: {
      longevity: 4,
      projection: 4,
      seasons: ['Весна', 'Літо', 'Осінь'],
      occasion: 'Бізнес, свята, універсальний аромат-підпис',
    },
    tags: { families: ['fresh', 'woody'], occasions: ['day', 'special'], intensity: 'moderate' },
    bestseller: true,
    bottle: {
      body: 'cylinder',
      size: [0.82, 1.7, 0.82],
      radius: 0,
      glass: '#0d0d0f',
      tint: 0.92,
      liquid: '#141416',
      liquidLevel: 0.85,
      cap: { shape: 'cylinder', size: [0.4, 0.5, 0.4], metal: 'silver' },
      collar: 'silver',
      label: { kind: 'plate', metal: 'silver', text: 'AVENTUS', sub: 'CREED', color: '#1a1a1a' },
    },
  },
  {
    id: 'mfk-baccarat-rouge-540',
    brand: 'Maison Francis Kurkdjian',
    name: 'Baccarat Rouge 540',
    concentration: 'Парфумована вода',
    year: 2015,
    perfumer: 'Francis Kurkdjian',
    sizes: [
      { ml: 70, price: 14800 },
      { ml: 200, price: 29900 },
    ],
    family: 'Амбровий квітковий',
    short: 'Шафран, жасмин і амбервуд — сяйливий, мінеральний аромат.',
    description:
      'Створений до 250-річчя кришталевої мануфактури Baccarat. Шафран і жасмин сяють над кришталевим акордом амбервуду та амбергрису, а смола ялиці й кедр додають солодкого, повітряного, майже карамельного світіння. Аромат чистого світла.',
    notes: {
      top: ['Шафран', 'Жасмин'],
      heart: ['Амбервуд', 'Амбергрис'],
      base: ['Смола ялиці', 'Кедр'],
    },
    characteristics: {
      longevity: 5,
      projection: 5,
      seasons: ['Осінь', 'Зима', 'Весна'],
      occasion: 'Особливі події, вечори, яскраві виходи',
    },
    tags: { families: ['sweet', 'floral', 'woody'], occasions: ['special', 'evening'], intensity: 'intense' },
    bestseller: true,
    bottle: {
      body: 'box',
      size: [0.95, 1.55, 0.62],
      radius: 0.04,
      glass: '#f4ecdf',
      tint: 0.08,
      liquid: '#e3b56a',
      liquidLevel: 0.8,
      cap: { shape: 'box', size: [0.66, 0.34, 0.44], metal: 'gold' },
      collar: 'gold',
      label: { kind: 'print', text: 'BACCARAT ROUGE 540', sub: 'MAISON FRANCIS KURKDJIAN', color: '#6b4a1c' },
    },
  },
  {
    id: 'chanel-bleu-edp',
    brand: 'Chanel',
    name: 'Bleu de Chanel',
    concentration: 'Парфумована вода',
    year: 2014,
    perfumer: 'Jacques Polge',
    sizes: [
      { ml: 50, price: 5900 },
      { ml: 100, price: 7900 },
    ],
    family: 'Деревний ароматичний',
    short: 'Цитруси й ладан на теплій базі із сандалу та кедра.',
    description:
      'Ода чоловічій свободі в глибокому синьому флаконі. Грейпфрут, лимон і м’ята іскряться над імбиром, мускатним горіхом і жасмином, а ладан, кедр, сандал і лабданум надають парфумованій воді круглішої та теплішої глибини, ніж в оригіналу.',
    notes: {
      top: ['Грейпфрут', 'Лимон', 'М’ята', 'Рожевий перець', 'Бергамот', 'Альдегіди', 'Коріандр'],
      heart: ['Імбир', 'Мускатний горіх', 'Жасмин', 'Диня'],
      base: ['Ладан', 'Амбра', 'Кедр', 'Сандалове дерево', 'Пачулі', 'Лабданум', 'Амбервуд'],
    },
    characteristics: {
      longevity: 4,
      projection: 3,
      seasons: ['Весна', 'Літо', 'Осінь', 'Зима'],
      occasion: 'Офіс, щодня, будь-яка офіційна обстановка',
    },
    tags: { families: ['fresh', 'woody'], occasions: ['office', 'day'], intensity: 'moderate' },
    bestseller: true,
    bottle: {
      body: 'box',
      size: [1.05, 1.5, 0.5],
      radius: 0.06,
      glass: '#0f1c33',
      tint: 0.85,
      liquid: '#0c1a33',
      liquidLevel: 0.85,
      cap: { shape: 'box', size: [0.62, 0.44, 0.42], metal: 'black' },
      collar: 'black',
      label: { kind: 'print', text: 'BLEU', sub: 'DE CHANEL', color: '#d5dbe6' },
    },
  },
  {
    id: 'pdm-layton',
    brand: 'Parfums de Marly',
    name: 'Layton',
    concentration: 'Парфумована вода',
    year: 2016,
    perfumer: 'Hamid Merati-Kashani',
    sizes: [
      { ml: 75, price: 9200 },
      { ml: 125, price: 11900 },
    ],
    family: 'Амбровий квітковий',
    short: 'Яблуко й лаванда на тлі ванілі, кардамону та гваякового дерева.',
    description:
      'Натхненний королівською елегантністю кінних традицій XVIII століття. Хрустке яблуко, лаванда й мандарин поступаються герані, фіалці та жасмину, а згодом настає черга кремової пряної бази з ванілі, кардамону, перцю та гваякового дерева.',
    notes: {
      top: ['Яблуко', 'Лаванда', 'Бергамот', 'Мандарин'],
      heart: ['Герань', 'Фіалка', 'Жасмин'],
      base: ['Ваніль', 'Кардамон', 'Сандалове дерево', 'Перець', 'Пачулі', 'Гваякове дерево'],
    },
    characteristics: {
      longevity: 5,
      projection: 4,
      seasons: ['Осінь', 'Зима'],
      occasion: 'Вечори, щоденно в холодну пору',
    },
    tags: { families: ['sweet', 'spicy', 'floral'], occasions: ['evening', 'special'], intensity: 'intense' },
    bestseller: true,
    bottle: {
      body: 'box',
      size: [0.9, 1.75, 0.55],
      radius: 0.04,
      glass: '#2a2c30',
      tint: 0.6,
      liquid: '#6e4a1e',
      liquidLevel: 0.85,
      cap: { shape: 'cylinder', size: [0.34, 0.46, 0.34], metal: 'silver' },
      collar: 'silver',
      label: { kind: 'plate', metal: 'silver', text: 'LAYTON', sub: 'PARFUMS DE MARLY', color: '#1d1d1d' },
    },
  },
  {
    id: 'xerjoff-naxos',
    brand: 'Xerjoff',
    name: 'Naxos',
    concentration: 'Парфумована вода',
    year: 2015,
    sizes: [
      { ml: 50, price: 7400 },
      { ml: 100, price: 10800 },
    ],
    family: 'Амбровий пряний',
    short: 'Лаванда й мед на тлі тютюну, бобів тонка та ванілі.',
    description:
      'Частина колекції 1861 — присвята Сицилії. Цитрусово-лавандовий вступ плавно переходить у мед, корицю та жасмин самбак, а потім поглиблюється насиченим тютюновим листом, бобами тонка й ваніллю — тепло середземноморського вечора.',
    notes: {
      top: ['Лаванда', 'Бергамот', 'Лимон'],
      heart: ['Мед', 'Кориця', 'Кашмеран', 'Жасмин самбак'],
      base: ['Тютюновий лист', 'Боби тонка', 'Ваніль'],
    },
    characteristics: {
      longevity: 5,
      projection: 4,
      seasons: ['Осінь', 'Зима'],
      occasion: 'Вечори, особливі події',
    },
    tags: { families: ['sweet', 'spicy'], occasions: ['evening', 'special'], intensity: 'intense' },
    bottle: {
      body: 'box',
      size: [0.88, 1.65, 0.6],
      radius: 0.1,
      glass: '#f3eadb',
      tint: 0.1,
      liquid: '#d49a2c',
      liquidLevel: 0.82,
      cap: { shape: 'box', size: [0.58, 0.5, 0.48], metal: 'gold' },
      collar: 'gold',
      label: { kind: 'plate', metal: 'gold', text: 'NAXOS', sub: 'XERJOFF · 1861', color: '#2b1c08' },
    },
  },
  {
    id: 'armani-adg-profumo',
    brand: 'Giorgio Armani',
    name: 'Acqua di Giò Profumo',
    concentration: 'Парфуми',
    year: 2015,
    perfumer: 'Alberto Morillas',
    sizes: [
      { ml: 75, price: 5300 },
      { ml: 125, price: 6900 },
    ],
    family: 'Ароматичний водяний',
    short: 'Морські ноти й бергамот, поглиблені ладаном і пачулі.',
    description:
      'Темніше й мінеральніше прочитання впізнаваного Acqua di Giò. Морські ноти й бергамот зустрічаються з ароматичним серцем герані, шавлії та розмарину, яке тримають ладан і пачулі — наче морські бризки на теплому вулканічному камені.',
    notes: {
      top: ['Морські ноти', 'Бергамот'],
      heart: ['Герань', 'Шавлія', 'Розмарин'],
      base: ['Ладан', 'Пачулі'],
    },
    characteristics: {
      longevity: 4,
      projection: 3,
      seasons: ['Весна', 'Літо', 'Осінь'],
      occasion: 'День, офіс, теплі вечори',
    },
    tags: { families: ['fresh'], occasions: ['day', 'office'], intensity: 'moderate' },
    availabilityNote:
      'Згодом Armani представив Acqua di Giò Parfum, тож запаси Profumo можуть бути обмежені — наявність підтверджуємо під час замовлення.',
    bottle: {
      body: 'stone',
      size: [1.0, 1.65, 0.62],
      radius: 0.22,
      glass: '#2b2e33',
      tint: 0.85,
      liquid: '#1e2226',
      liquidLevel: 0.85,
      cap: { shape: 'dome', size: [0.5, 0.42, 0.5], metal: 'gunmetal' },
      collar: 'gunmetal',
      label: { kind: 'print', text: 'ACQUA DI GIÒ', sub: 'PROFUMO', color: '#cfd3d8' },
    },
  },
]

/** The boutique's own house bottle used in the hero — not a product. */
export const signatureBottle: BottleSpec = {
  body: 'box',
  size: [1.05, 1.6, 0.66],
  radius: 0.12,
  glass: '#fbf4e8',
  tint: 0.04,
  liquid: '#b8741f',
  liquidLevel: 0.8,
  cap: { shape: 'facet', size: [0.78, 0.4, 0.56], metal: 'gold' },
  collar: 'gold',
  collarRings: true,
  base: 0.14,
  label: { kind: 'plate', metal: 'gold', text: 'PARFUM LUX', sub: 'КИЇВ', color: '#2b1c08' },
}

export const brands = Array.from(new Set(products.map((p) => p.brand)))

export const getProduct = (id: string) => products.find((p) => p.id === id)

export const minPrice = (p: Product) => Math.min(...p.sizes.map((s) => s.price))
