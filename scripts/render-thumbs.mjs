// Renders every product bottle to public/bottles/<id>.webp using the dev server.
// Usage: npm run dev (port 5173) then: node scripts/render-thumbs.mjs [id...]
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')
import { writeFileSync, readFileSync } from 'node:fs'

const src = ['products.ts', 'catalog-extra.ts'].map((f) => readFileSync(new URL(`../src/data/${f}`, import.meta.url), 'utf8')).join('\n')
const all = [...src.matchAll(/^\s{4}id: '([^']+)'/gm)].map((m) => m[1])
const ids = process.argv.slice(2).length ? process.argv.slice(2) : all
const base = process.env.BASE ?? 'http://localhost:5173'

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const page = await browser.newPage({ viewport: { width: 800, height: 1000 } })
for (const id of ids) {
  await page.goto(`${base}/?render=${id}`)
  await page.waitForSelector('#thumb canvas')
  await page.waitForTimeout(3500)
  const data = await page.evaluate(() => document.querySelector('#thumb canvas').toDataURL('image/webp', 0.9))
  writeFileSync(new URL(`../src/assets/bottles/${id}.webp`, import.meta.url), Buffer.from(data.split(',')[1], 'base64'))
  console.log('rendered', id)
}
await browser.close()
