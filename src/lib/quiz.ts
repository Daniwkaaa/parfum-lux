import { products, type Family, type Intensity, type Occasion, type Product } from '../data/products'

export interface QuizAnswers {
  families: Family[]
  occasion: Occasion | null
  intensity: Intensity | null
}

const LEVEL: Record<Intensity, number> = { soft: 0, moderate: 1, intense: 2 }

/** Scores each product 0–100 against the answers and returns them best first. */
export function recommend(a: QuizAnswers): { product: Product; score: number }[] {
  const max = a.families.length * 3 + (a.occasion ? 2 : 0) + (a.intensity ? 2 : 0) || 1
  return products
    .map((p) => {
      let s = 0
      a.families.forEach((f) => p.tags.families.includes(f) && (s += 3))
      if (a.occasion && p.tags.occasions.includes(a.occasion)) s += 2
      if (a.intensity) {
        const d = Math.abs(LEVEL[a.intensity] - LEVEL[p.tags.intensity])
        s += d === 0 ? 2 : d === 1 ? 1 : 0
      }
      return { product: p, score: Math.round((s / max) * 100) }
    })
    .sort((x, y) => y.score - x.score || (y.product.bestseller ? 1 : 0) - (x.product.bestseller ? 1 : 0))
}
