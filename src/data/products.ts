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
export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter'

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
    concentration: 'Eau de Parfum',
    year: 2018,
    perfumer: 'Dominique Ropion',
    sizes: [
      { ml: 60, price: 4650 },
      { ml: 100, price: 6300 },
    ],
    family: 'Aromatic Fougère',
    short: 'Crisp apple and sage over a warm amberwood trail.',
    description:
      'A modern fougère built on contrast: the brightness of apple, ginger and bergamot meets an aromatic heart of sage and juniper, settling into amberwood and tonka. Polished, versatile and confidently clean.',
    notes: {
      top: ['Apple', 'Ginger', 'Bergamot'],
      heart: ['Sage', 'Juniper Berries', 'Geranium'],
      base: ['Amberwood', 'Tonka Bean', 'Cedarwood', 'Vetiver', 'Olibanum'],
    },
    characteristics: {
      longevity: 4,
      projection: 3,
      seasons: ['Spring', 'Autumn', 'Winter'],
      occasion: 'Office, daytime, smart-casual evenings',
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
    concentration: 'Parfum',
    year: 2023,
    perfumer: 'Quentin Bisch',
    sizes: [
      { ml: 75, price: 5450 },
      { ml: 125, price: 6950 },
    ],
    family: 'Amber Fougère',
    short: 'Lavender and mint melted into honey, tobacco and tonka.',
    description:
      'The most intense chapter of the Le Male saga. Fresh lavender and mint open onto a dense, golden accord of vanilla and benzoin, finishing with honey, tobacco and tonka bean — sensual, sweet and unmistakably nocturnal.',
    notes: {
      top: ['Lavender', 'Mint'],
      heart: ['Vanilla', 'Benzoin'],
      base: ['Honey', 'Tonka Bean', 'Tobacco'],
    },
    characteristics: {
      longevity: 5,
      projection: 4,
      seasons: ['Autumn', 'Winter'],
      occasion: 'Evenings, dates, nightlife',
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
    concentration: 'Elixir',
    year: 2021,
    perfumer: 'François Demachy',
    sizes: [
      { ml: 60, price: 7100 },
      { ml: 100, price: 9800 },
    ],
    family: 'Spicy Aromatic',
    short: 'Cinnamon, nutmeg and lavender over licorice and sandalwood.',
    description:
      'An ultra-concentrated interpretation of Sauvage. Grapefruit and a fistful of spices — cinnamon, nutmeg, cardamom — frame a lavender heart, while licorice, sandalwood, amber and vetiver give a dark, resinous depth.',
    notes: {
      top: ['Grapefruit', 'Cinnamon', 'Nutmeg', 'Cardamom'],
      heart: ['Lavender'],
      base: ['Licorice', 'Sandalwood', 'Amber', 'Patchouli', 'Haitian Vetiver'],
    },
    characteristics: {
      longevity: 5,
      projection: 4,
      seasons: ['Autumn', 'Winter'],
      occasion: 'Evenings, formal events',
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
    concentration: 'Eau de Parfum',
    year: 2007,
    perfumer: 'Richard Herpin',
    sizes: [
      { ml: 50, price: 12900 },
      { ml: 100, price: 18400 },
    ],
    family: 'Amber Woody',
    short: 'Smooth oud, rosewood and cardamom wrapped in tonka.',
    description:
      'One of the first Western fragrances to make oud wearable. Rosewood, cardamom and Chinese pepper lead to a smooth, smoky heart of oud, sandalwood and vetiver, softened by tonka, vanilla and amber. Refined rather than animalic.',
    notes: {
      top: ['Rosewood', 'Cardamom', 'Chinese Pepper'],
      heart: ['Oud', 'Sandalwood', 'Vetiver'],
      base: ['Tonka Bean', 'Vanilla', 'Amber'],
    },
    characteristics: {
      longevity: 4,
      projection: 3,
      seasons: ['Autumn', 'Winter', 'Spring'],
      occasion: 'Office, dinners, signature scent',
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
    concentration: 'Eau de Parfum',
    year: 2010,
    perfumer: 'Olivier Creed & Erwin Creed',
    sizes: [
      { ml: 50, price: 13900 },
      { ml: 100, price: 19600 },
    ],
    family: 'Chypre Fruity',
    short: 'Pineapple and blackcurrant over smoky birch and musk.',
    description:
      'A modern legend. Juicy pineapple, bergamot, blackcurrant and apple open onto smoky birch and patchouli, resting on a dry base of musk, oakmoss and ambergris. Bold, magnetic and endlessly imitated.',
    notes: {
      top: ['Pineapple', 'Bergamot', 'Blackcurrant', 'Apple'],
      heart: ['Birch', 'Patchouli', 'Moroccan Jasmine', 'Rose'],
      base: ['Musk', 'Oakmoss', 'Ambergris', 'Vanilla'],
    },
    characteristics: {
      longevity: 4,
      projection: 4,
      seasons: ['Spring', 'Summer', 'Autumn'],
      occasion: 'Business, celebrations, all-round signature',
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
    concentration: 'Eau de Parfum',
    year: 2015,
    perfumer: 'Francis Kurkdjian',
    sizes: [
      { ml: 70, price: 14800 },
      { ml: 200, price: 29900 },
    ],
    family: 'Amber Floral',
    short: 'Saffron, jasmine and amberwood — luminous and mineral.',
    description:
      'Created for the 250th anniversary of Baccarat crystal. Saffron and jasmine glow over a crystalline accord of amberwood and ambergris, with fir resin and cedar adding a sweet, airy, almost burnt-sugar radiance. A scent of pure light.',
    notes: {
      top: ['Saffron', 'Jasmine'],
      heart: ['Amberwood', 'Ambergris'],
      base: ['Fir Resin', 'Cedar'],
    },
    characteristics: {
      longevity: 5,
      projection: 5,
      seasons: ['Autumn', 'Winter', 'Spring'],
      occasion: 'Special occasions, evenings, statement wear',
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
    concentration: 'Eau de Parfum',
    year: 2014,
    perfumer: 'Jacques Polge',
    sizes: [
      { ml: 50, price: 5900 },
      { ml: 100, price: 7900 },
    ],
    family: 'Woody Aromatic',
    short: 'Citrus and incense over a warm sandalwood-cedar base.',
    description:
      'An ode to masculine freedom in a deep blue flacon. Grapefruit, lemon and mint sparkle over ginger, nutmeg and jasmine, while incense, cedar, sandalwood and labdanum give the Eau de Parfum a rounder, warmer depth than the original.',
    notes: {
      top: ['Grapefruit', 'Lemon', 'Mint', 'Pink Pepper', 'Bergamot', 'Aldehydes', 'Coriander'],
      heart: ['Ginger', 'Nutmeg', 'Jasmine', 'Melon'],
      base: ['Incense', 'Amber', 'Cedar', 'Sandalwood', 'Patchouli', 'Labdanum', 'Amberwood'],
    },
    characteristics: {
      longevity: 4,
      projection: 3,
      seasons: ['Spring', 'Summer', 'Autumn', 'Winter'],
      occasion: 'Office, everyday, any formal setting',
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
    concentration: 'Eau de Parfum',
    year: 2016,
    perfumer: 'Hamid Merati-Kashani',
    sizes: [
      { ml: 75, price: 9200 },
      { ml: 125, price: 11900 },
    ],
    family: 'Amber Floral',
    short: 'Apple and lavender over vanilla, cardamom and guaiac wood.',
    description:
      'Inspired by the regal elegance of 18th-century equestrian life. Crisp apple, lavender and mandarin give way to geranium, violet and jasmine, before a creamy, spiced base of vanilla, cardamom, pepper and guaiac wood takes over.',
    notes: {
      top: ['Apple', 'Lavender', 'Bergamot', 'Mandarin'],
      heart: ['Geranium', 'Violet', 'Jasmine'],
      base: ['Vanilla', 'Cardamom', 'Sandalwood', 'Pepper', 'Patchouli', 'Guaiac Wood'],
    },
    characteristics: {
      longevity: 5,
      projection: 4,
      seasons: ['Autumn', 'Winter'],
      occasion: 'Evenings, cold-weather daily wear',
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
    concentration: 'Eau de Parfum',
    year: 2015,
    sizes: [
      { ml: 50, price: 7400 },
      { ml: 100, price: 10800 },
    ],
    family: 'Amber Spicy',
    short: 'Lavender and honey over tobacco, tonka and vanilla.',
    description:
      'Part of the 1861 collection, a tribute to Sicily. A citrus-lavender opening glides into honey, cinnamon and jasmine sambac, then deepens into a rich tobacco leaf, tonka bean and vanilla — the warmth of a Mediterranean evening.',
    notes: {
      top: ['Lavender', 'Bergamot', 'Lemon'],
      heart: ['Honey', 'Cinnamon', 'Cashmeran', 'Jasmine Sambac'],
      base: ['Tobacco Leaf', 'Tonka Bean', 'Vanilla'],
    },
    characteristics: {
      longevity: 5,
      projection: 4,
      seasons: ['Autumn', 'Winter'],
      occasion: 'Evenings, special occasions',
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
    concentration: 'Parfum',
    year: 2015,
    perfumer: 'Alberto Morillas',
    sizes: [
      { ml: 75, price: 5300 },
      { ml: 125, price: 6900 },
    ],
    family: 'Aromatic Aquatic',
    short: 'Marine notes and bergamot deepened with incense and patchouli.',
    description:
      'A darker, more mineral take on the Acqua di Giò signature. Sea notes and bergamot meet an aromatic heart of geranium, sage and rosemary, anchored by incense and patchouli — like sea spray over warm volcanic stone.',
    notes: {
      top: ['Sea Notes', 'Bergamot'],
      heart: ['Geranium', 'Sage', 'Rosemary'],
      base: ['Incense', 'Patchouli'],
    },
    characteristics: {
      longevity: 4,
      projection: 3,
      seasons: ['Spring', 'Summer', 'Autumn'],
      occasion: 'Daytime, office, warm evenings',
    },
    tags: { families: ['fresh'], occasions: ['day', 'office'], intensity: 'moderate' },
    availabilityNote:
      'Armani has since introduced Acqua di Giò Parfum; Profumo stock may be limited — availability confirmed at order.',
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
  label: { kind: 'plate', metal: 'gold', text: 'PARFUM LUX', sub: 'MAISON · KYIV', color: '#2b1c08' },
}

export const brands = Array.from(new Set(products.map((p) => p.brand)))

export const getProduct = (id: string) => products.find((p) => p.id === id)

export const minPrice = (p: Product) => Math.min(...p.sizes.map((s) => s.price))
