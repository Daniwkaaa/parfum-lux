/** Pre-rendered bottle images, bundled by Vite (inlined as data URIs in the single-file build). */
const files = import.meta.glob('../assets/bottles/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>

export const bottleImage = (id: string) => files[`../assets/bottles/${id}.webp`] ?? ''
