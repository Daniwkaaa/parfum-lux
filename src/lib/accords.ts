import type { Family, Product } from '../data/products'
import { allNotes } from '../data/meta'

export interface Accord {
  id: string
  label: string
  keys: string[] // lowercase note fragments
}
export interface WheelFamily {
  id: Family
  label: string
  color: string
  mood: string
  accords: Accord[]
}

/** The ÉLIXIR fragrance wheel: 5 families, 14 accords. */
export const WHEEL: WheelFamily[] = [
  {
    id: 'fresh',
    label: 'Свіжі',
    color: '#7fa39a',
    mood: 'Прозорі, бадьорі, «чисті». Цитруси, морське повітря, трави — для дня, спеки й офісу.',
    accords: [
      { id: 'citrus', label: 'Цитрусові', keys: ['бергамот', 'лимон', 'апельсин', 'грейпфрут', 'мандарин', 'цитрон', 'цитрус', 'вербена', 'петитгрейн'] },
      { id: 'aquatic', label: 'Водяні', keys: ['морськ', 'зелений чай', 'диня', 'кремінь'] },
      { id: 'aromatic', label: 'Ароматичні', keys: ['лаванд', 'шавлі', 'розмарин', 'м’ят', 'листя фіалки', 'гальбанум', 'ялівц', 'хвоя', 'орегано', 'мирт'] },
    ],
  },
  {
    id: 'floral',
    label: 'Квіткові',
    color: '#c48b8f',
    mood: 'Романтичні й світлі: троянда, білі квіти, пудровий ірис. Від ніжних до розкішно-густих.',
    accords: [
      { id: 'rose', label: 'Троянда', keys: ['троянд', 'півоні'] },
      { id: 'white', label: 'Білі квіти', keys: ['жасмин', 'апельсиновий цвіт', 'неролі', 'гарденія', 'іланг', 'магнолі', 'конвалі', 'жимолост', 'османтус', 'фрезі', 'орхіде', 'лотос', 'цвіт тютюну'] },
      { id: 'powdery', label: 'Пудрові', keys: ['ірис', 'фіалка', 'геліотроп', 'мімоз', 'амбретт', 'пеларгоні', 'герань'] },
    ],
  },
  {
    id: 'sweet',
    label: 'Солодкі',
    color: '#d1a35c',
    mood: 'Теплі, обволікаючі, «смачні»: ваніль, праліне, кава, соковиті фрукти.',
    accords: [
      { id: 'vanilla', label: 'Ванільні', keys: ['ваніль', 'ванільн', 'тонка', 'бензоїн'] },
      { id: 'gourmand', label: 'Гурманські', keys: ['праліне', 'какао', 'кава', 'мед', 'маршмелоу', 'цукор', 'шоколад', 'коньяк', 'ром', 'лікер', 'мигдаль', 'каштан'] },
      { id: 'fruity', label: 'Фруктові', keys: ['ананас', 'яблуко', 'груша', 'смородин', 'лічі', 'персик', 'малина', 'маракуя', 'вишня', 'фруктов', 'ревінь', 'саподілла', 'сушені фрукти'] },
    ],
  },
  {
    id: 'spicy',
    label: 'Пряні',
    color: '#b4683f',
    mood: 'Гарячі й інтригуючі: кориця, кардамон, шафран, димні смоли й ладан.',
    accords: [
      { id: 'spices', label: 'Прянощі', keys: ['кориц', 'мускатний', 'гвоздик', 'шафран', 'кардамон', 'перець', 'імбир', 'кмин', 'коріандр', 'прянощі'] },
      { id: 'resins', label: 'Ладан і смоли', keys: ['ладан', 'олібанум', 'лабданум', 'опопонакс', 'стиракс', 'елемі', 'смола', 'бальзам', 'амбра'] },
    ],
  },
  {
    id: 'woody',
    label: 'Деревні',
    color: '#8a6446',
    mood: 'Глибокі, благородні, заземлені: сандал, кедр, уд, шкіра, мох і ветивер.',
    accords: [
      { id: 'woods', label: 'Сандал і кедр', keys: ['сандал', 'кедр', 'рожеве дерево', 'гваяков', 'кипарис', 'кашмеран', 'кашмірове', 'дуб', 'деревні ноти', 'папірус', 'амбервуд'] },
      { id: 'oud', label: 'Уд, тютюн, шкіра', keys: ['уд', 'тютюн', 'шкіра', 'береза'] },
      { id: 'mossy', label: 'Мох і ветивер', keys: ['ветивер', 'мох', 'пачулі'] },
    ],
  },
]

export const ACCORDS = WHEEL.flatMap((f) => f.accords.map((a) => ({ ...a, family: f })))
export const accordById = (id: string) => ACCORDS.find((a) => a.id === id)

const noteMatches = (note: string, a: Accord) => {
  const n = note.toLowerCase()
  // 'уд' must be the whole word (avoid matching inside other words)
  return a.keys.some((k) => (k === 'уд' ? n === 'уд' : n.includes(k)))
}

export function accordsOf(p: Product): string[] {
  const notes = allNotes(p)
  return ACCORDS.filter((a) => notes.some((n) => noteMatches(n, a))).map((a) => a.id)
}

export const hasAccord = (p: Product, id: string) => accordsOf(p).includes(id)

/* ------------------------------------------------------------------ */
/* Similarity                                                           */
/* ------------------------------------------------------------------ */

const jaccard = <T,>(a: T[], b: T[]) => {
  const A = new Set(a)
  const B = new Set(b)
  const inter = [...A].filter((x) => B.has(x)).length
  const uni = new Set([...A, ...B]).size
  return uni ? inter / uni : 0
}

export interface Similar {
  product: Product
  score: number // 0..1
  shared: string[] // shared accord labels + identical notes
}

export function similarTo(p: Product, pool: Product[], n = 4): Similar[] {
  const pa = accordsOf(p)
  const pn = allNotes(p).map((x) => x.toLowerCase())
  return pool
    .filter((q) => q.id !== p.id)
    .map((q) => {
      const qa = accordsOf(q)
      const qn = allNotes(q).map((x) => x.toLowerCase())
      const score =
        0.5 * jaccard(pa, qa) +
        0.3 * jaccard(pn, qn) +
        0.15 * jaccard(p.tags.families, q.tags.families) +
        0.05 * (p.tags.intensity === q.tags.intensity ? 1 : 0)
      const sharedNotes = allNotes(q).filter((x) => pn.includes(x.toLowerCase()))
      return { product: q, score, shared: [...new Set(sharedNotes)].slice(0, 4) }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
}
