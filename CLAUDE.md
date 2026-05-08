# Mentalia — Plataforma de Salud Mental Argentina

## Stack
- **Landing:** HTML puro + Tailwind CDN (sin framework)
- **MVP:** Next.js 14 + TypeScript + Tailwind + Supabase + Daily.co + MercadoPago + Claude API
- Node.js disponible dentro de `mentalia-app/`

## Archivos clave
- `mentalia-landing.html` — landing page completa (producción visual)
- `logo_mentalia.svg` — logo SVG oficial
- `brief_mentalia_COMPLETO (1).docx` — brief completo del producto
- `mentalia-app/` — app Next.js en construcción

## Supabase
- Project ID: `odxruvzwkjucgshmjohd`
- URL: `https://odxruvzwkjucgshmjohd.supabase.co`
- Anon key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9keHJ1dnp3a2p1Y2dzaG1qb2hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NjU5NDIsImV4cCI6MjA5MzU0MTk0Mn0.u2eUy11SQ0jiDKnYuMby5PGV46PSzK0EggHRJAaJQcA`

## Paleta de colores
| Token | Hex |
|---|---|
| Verde oscuro | `#2D6A4F` |
| Verde claro | `#D8F3DC` |
| Blanco cálido | `#FDFCFA` |
| Gris | `#6B7280` |

## Reglas de diseño (validadas — no revertir sin consultar)
- Nav: fondo `rgba(216,243,220,0.97)` con backdrop blur
- Logo: SVG inline del ícono + "Mentalia" en Georgia italic verde oscuro
- Watermarks: hero (derecha), sección problema (abajo izquierda), CTA final (centrado blanco)
- Idiomas de soporte: español, italiano, inglés

## Pricing
| Plan | Precio |
|---|---|
| Starter | $15 USD/mes |
| Pro | $32 USD/mes (destacado, borde verde) |
| Clínica | $75 USD/mes |

## Reglas de texto
- En el cuerpo: usar "el profesional", "el paciente" — sin barras
- En títulos y etiquetas: "psicólogos/as" está bien
- Tono: profesional, cálido, directo

## Secciones de la landing (estado actual)
1. Barra de anuncio (verde oscuro) + Nav
2. Hero — H1 Georgia italic, 2 CTAs, barra social proof, mockup dashboard
3. Problema/Solución — 3 cards con watermark
4. Funciones — grid 6 cards + 1 card "Seguimiento semanal con IA"
5. Pricing — 3 planes
6. Testimonios — stats + 3 reseñas profesionales + 3 pacientes
7. CTA Final — fondo verde oscuro con watermark blanco centrado
8. Footer — logo, links, redes, soporte multilingüe
