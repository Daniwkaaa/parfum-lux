import type { Product } from './products'

export type Gender = 'her' | 'him' | 'unisex'

/** Who the house primarily markets each fragrance to. Edit freely. */
const GENDER: Record<string, Gender> = {
  'ysl-y-edp': 'him',
  'jpg-le-male-elixir': 'him',
  'dior-sauvage-elixir': 'him',
  'tom-ford-oud-wood': 'unisex',
  'creed-aventus': 'him',
  'mfk-baccarat-rouge-540': 'unisex',
  'chanel-bleu-edp': 'him',
  'pdm-layton': 'him',
  'xerjoff-naxos': 'unisex',
  'armani-adg-profumo': 'him',
  'chanel-coco-mademoiselle': 'her',
  'dior-sauvage-edp': 'him',
  'dior-homme-intense': 'him',
  'tom-ford-tobacco-vanille': 'unisex',
  'tom-ford-lost-cherry': 'unisex',
  'tom-ford-ombre-leather': 'unisex',
  'tom-ford-black-orchid': 'unisex',
  'creed-silver-mountain-water': 'unisex',
  'creed-green-irish-tweed': 'him',
  'pdm-delina': 'her',
  'pdm-herod': 'him',
  'pdm-pegasus': 'him',
  'xerjoff-erba-pura': 'unisex',
  'xerjoff-alexandria-ii': 'unisex',
  'kilian-angels-share': 'unisex',
  'kilian-love-dont-be-shy': 'her',
  'le-labo-santal-33': 'unisex',
  'le-labo-another-13': 'unisex',
  'byredo-gypsy-water': 'unisex',
  'byredo-mojave-ghost': 'unisex',
  'margiela-jazz-club': 'him',
  'margiela-by-the-fireplace': 'unisex',
  'initio-oud-for-greatness': 'unisex',
  'initio-side-effect': 'unisex',
  'amouage-interlude-man': 'him',
  'amouage-reflection-man': 'him',
  'ysl-libre-edp': 'her',
  'ysl-la-nuit-de-lhomme': 'him',
  'ysl-black-opium': 'her',
  'jpg-le-male-le-parfum': 'him',
  'lancome-la-vie-est-belle': 'her',
  'armani-si-edp': 'her',
  'hermes-terre-dhermes': 'him',
  'mancera-cedrat-boise': 'unisex',
  'nishane-hacivat': 'unisex',
  'frederic-malle-portrait-of-a-lady': 'her',
  'louis-vuitton-imagination': 'him',
  'louis-vuitton-ombre-nomade': 'unisex',
  'diptyque-tam-dao': 'unisex',
  'tiziana-terenzi-kirke': 'unisex',
}

export const genderOf = (p: Product): Gender => GENDER[p.id] ?? 'unisex'

export const GENDER_LABEL: Record<Gender, string> = { her: 'Для неї', him: 'Для нього', unisex: 'Унісекс' }

/* ------------------------------------------------------------------ */
/* Samples (decants)                                                   */
/* ------------------------------------------------------------------ */

export const SAMPLE_ML = [2, 5, 10] as const
export const isSample = (ml: number) => ml <= 10

/**
 * Decant price: price-per-ml of the largest bottle × ml, with a premium for
 * hand-decanting and a glass atomiser, rounded to 10 ₴. Edit the formula here.
 */
export function samplePrice(p: Product, ml: number) {
  const big = p.sizes[p.sizes.length - 1]
  const perMl = big.price / big.ml
  return Math.ceil((perMl * ml * 1.5 + 70) / 10) * 10
}

export const sampleSizes = (p: Product) => SAMPLE_ML.map((ml) => ({ ml, price: samplePrice(p, ml) }))

/** Every purchasable size — full bottles and decants. */
export const allSizes = (p: Product) => [...sampleSizes(p), ...p.sizes]

export const allNotes = (p: Product) => [...p.notes.top, ...p.notes.heart, ...p.notes.base]
