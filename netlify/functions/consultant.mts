/**
 * ÉLIXIR AI consultant — Netlify Function (Functions 2.0, bundled by esbuild).
 *
 * POST /api/consultant  { messages: [{ role: 'user' | 'assistant', content: string }] }
 * →  200 { reply: string, picks: [{ id, why }] }
 *
 * Requires the ANTHROPIC_API_KEY environment variable in the Netlify site
 * settings. Without it the endpoint answers 503 and the site silently uses its
 * built-in offline consultant instead.
 */
import Anthropic from '@anthropic-ai/sdk'
import { minPrice, products } from '../../src/data/products'
import { allNotes, genderOf, samplePrice } from '../../src/data/meta'

const MODEL = 'claude-opus-5-5'
const MAX_TURNS = 16
const MAX_CHARS = 1500

const GENDER_UA = { her: 'для неї', him: 'для нього', unisex: 'унісекс' } as const

// Deterministic, compact catalogue — kept byte-stable so the system prompt caches.
const CATALOG = products
  .map((p) =>
    [
      p.id,
      `${p.brand} — ${p.name}`,
      p.concentration,
      GENDER_UA[genderOf(p)],
      p.family,
      `верх: ${p.notes.top.join(', ')}`,
      `серце: ${p.notes.heart.join(', ')}`,
      `база: ${p.notes.base.join(', ')}`,
      `сезони: ${p.characteristics.seasons.join(', ')}`,
      `нагода: ${p.characteristics.occasion}`,
      `стійкість ${p.characteristics.longevity}/5, шлейф ${p.characteristics.projection}/5`,
      `флакон від ${minPrice(p)} грн (${p.sizes.map((s) => `${s.ml} мл ${s.price}`).join('; ')})`,
      `пробник 2 мл ${samplePrice(p, 2)} грн, 5 мл ${samplePrice(p, 5)} грн`,
      `коротко: ${p.short}`,
    ].join(' | '),
  )
  .join('\n')

const SYSTEM = `Ти — парфумерний консультант українського бутика люксової парфумерії ÉLIXIR. Розмовляй виключно українською, тепло й професійно, як консультант дорогого бутика: коротко, по суті, без канцеляриту.

Твоє завдання — за описом клієнта (для кого, нагода, настрій, бажані й небажані відтінки, бюджет, сезон, улюблені аромати) порадити від 1 до 3 ароматів ВИКЛЮЧНО з каталогу нижче. Ніколи не вигадуй аромати, ноти, ціни чи характеристики, яких немає в каталозі. Якщо клієнт називає аромат, якого немає в каталозі, чесно скажи про це й запропонуй найближчі за нотами з каталогу. Якщо запит неясний — постав одне уточнювальне питання й поверни порожній список picks. Ціни вказуй у гривнях (₴). Доречно згадуй, що будь-який аромат можна спершу взяти пробником 2–10 мл.

Формат відповіді: поле reply — 1–3 речення (без списку ароматів, бо картки покажуться окремо); поле picks — до 3 елементів, де id — точний id з каталогу, а why — одне-два речення, чому саме цей аромат підходить цьому клієнту (з опорою на ноти й характеристики з каталогу).

Каталог (id | назва | концентрація | для кого | група | ноти | сезони | нагода | стійкість | ціни | пробники | опис):
${CATALOG}`

const SCHEMA = {
  type: 'object',
  properties: {
    reply: { type: 'string' },
    picks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', enum: products.map((p) => p.id) },
          why: { type: 'string' },
        },
        required: ['id', 'why'],
        additionalProperties: false,
      },
    },
  },
  required: ['reply', 'picks'],
  additionalProperties: false,
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } })

function validMessages(input: unknown): Anthropic.Beta.BetaMessageParam[] | null {
  if (!Array.isArray(input) || input.length === 0) return null
  const msgs = input.slice(-MAX_TURNS)
  // the conversation sent to Claude must start with a user turn
  while (msgs.length && msgs[0]?.role !== 'user') msgs.shift()
  if (!msgs.length) return null
  const out: Anthropic.Beta.BetaMessageParam[] = []
  for (const m of msgs) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') return null
    const content = m.content.trim().slice(0, MAX_CHARS)
    if (!content) return null
    out.push({ role: m.role, content })
  }
  return out.at(-1)?.role === 'user' ? out : null
}

export default async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)
  if (!process.env.ANTHROPIC_API_KEY) return json({ error: 'not_configured' }, 503)

  let body: { messages?: unknown }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'bad_json' }, 400)
  }
  const messages = validMessages(body.messages)
  if (!messages) return json({ error: 'bad_messages' }, 400)

  const client = new Anthropic()
  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 4000,
      // a refused request is re-run on a fallback model chosen by the API
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low', format: { type: 'json_schema', schema: SCHEMA } },
      system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
      messages,
    })

    if (response.stop_reason === 'refusal') return json({ error: 'refusal' }, 422)
    const text = response.content.find((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')?.text
    if (!text) return json({ error: 'empty' }, 502)

    let parsed: { reply: string; picks: { id: string; why: string }[] }
    try {
      parsed = JSON.parse(text)
    } catch {
      return json({ error: 'bad_model_json' }, 502)
    }
    const ids = new Set(products.map((p) => p.id))
    return json({
      reply: String(parsed.reply ?? ''),
      picks: (parsed.picks ?? []).filter((p) => ids.has(p.id)).slice(0, 3),
    })
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return json({ error: 'rate_limited' }, 429)
    if (error instanceof Anthropic.AuthenticationError) return json({ error: 'not_configured' }, 503)
    if (error instanceof Anthropic.BadRequestError) {
      console.error('Claude bad request:', error.message)
      return json({ error: 'bad_request' }, 502)
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`Claude API error ${error.status}:`, error.message)
      return json({ error: 'upstream' }, 502)
    }
    console.error('Consultant failure:', error)
    return json({ error: 'internal' }, 500)
  }
}

export const config = { path: '/api/consultant' }
