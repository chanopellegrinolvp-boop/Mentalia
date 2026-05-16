# Mentalia — Plataforma de Salud Mental Argentina

## Descripción
SaaS B2B2C para psicólogos y pacientes argentinos. El profesional gestiona su consultorio digital (agenda, historia clínica, videollamadas, cobros). El paciente accede a sus sesiones, diario emocional y seguimiento.

## Stack
- **Framework:** Next.js 14 App Router + TypeScript
- **Estilos:** Tailwind CSS (sin librerías UI externas)
- **Base de datos / Auth:** Supabase (PostgreSQL + RLS + Auth)
- **IA:** OpenAI GPT-4o (resumen clínico post-sesión)
- **Videollamadas:** Jitsi Meet embebido (funcional). Daily.co preparado pero inactivo (falta DAILY_API_KEY)
- **Emails:** Resend
- **Pagos:** MercadoPago — mencionado en UI/landing pero SIN integración real aún
- **Deploy:** Vercel (producción en https://mentalia-app.vercel.app)
- **Repositorio:** https://github.com/chanopellegrinolvp-boop/Mentalia (branch main)

## Archivos clave
- `mentalia-app/` — app Next.js (MVP funcional)
- `logo_mentalia.svg` — logo SVG oficial
- `logo_mentalia_white.svg` — versión blanca del logo
- `brief_mentalia_COMPLETO (1).docx` — brief original del producto

## Supabase
- Project ID: `odxruvzwkjucgshmjohd`
- URL: `https://odxruvzwkjucgshmjohd.supabase.co`
- Anon key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9keHJ1dnp3a2p1Y2dzaG1qb2hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NjU5NDIsImV4cCI6MjA5MzU0MTk0Mn0.u2eUy11SQ0jiDKnYuMby5PGV46PSzK0EggHRJAaJQcA`

## Variables de entorno (mentalia-app/.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://odxruvzwkjucgshmjohd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ver arriba>
SUPABASE_SERVICE_ROLE_KEY=<configurado>
NEXT_PUBLIC_APP_URL=http://localhost:3001
OPENAI_API_KEY=<configurado>
DAILY_API_KEY=<VACÍO — pendiente>
DAILY_DOMAIN=mentalia
RESEND_API_KEY=<configurado>
EMAIL_FROM=<configurado>
NEXT_PUBLIC_SITE_URL=<pendiente definir para producción>
```

## Tablas Supabase (principales)
- `profiles` — id, email, full_name, role (professional/patient), referral_code
- `professionals` — id, license_number, specialty, bio, city, province, session_price, is_available, years_experience, modality
- `pacientes` — pacientes offline creados por el profesional
- `appointments` — id, professional_id, patient_id, paciente_id, scheduled_at, status, room_name
- `session_notes` — notas clínicas por sesión con resumen IA
- `messages` — mensajería entre profesional y paciente
- `payments` — historial de pagos (sin checkout implementado)
- `emotional_diary` — entradas diarias del paciente (fecha, mood 1-10, emotions[], notes)
- `referrals` — referrer_id, referred_id, created_at

## Paleta de colores
| Token | Hex |
|---|---|
| Verde oscuro | `#2D6A4F` |
| Verde claro | `#D8F3DC` |
| Blanco cálido | `#FDFCFA` |
| Gris | `#6B7280` |

## Reglas de diseño (no revertir sin consultar)
- Nav landing: fondo `#2D6A4F` (verde oscuro), texto blanco
- Logo en nav: texto "Mentalia" en Georgia italic, color white o verde según contexto
- Watermarks: logo SVG con opacity 0.04 centrado como fondo en hero, login, registro, pricing
- Sidebar dashboards: fondo `#2D6A4F`, íconos y texto blancos

## Pricing
| Plan | USD/mes | ARS/mes |
|---|---|---|
| Starter | $15 | $14.500 |
| Pro | $32 (destacado) | $30.000 |
| Clínica | $75 | $70.000 |

- Trial: 10 días gratis, sin tarjeta
- Referidos: 20% de descuento por 2 meses por cada referido

## Reglas de texto
- En el cuerpo: "el profesional", "el paciente" — sin barras
- En títulos y etiquetas: "psicólogos/as" está bien
- Tono: profesional, cálido, directo
- No mencionar IA explícitamente — hablar de "resumen clínico", "seguimiento", "herramientas"

## Estructura de rutas (mentalia-app/app/)

### Públicas
- `/` — Landing page con marketing, pricing, funciones, testimonios
- `/login` — Login email/password
- `/registro` — Registro (crea profile + professionals en Supabase)
- `/olvide-contrasena` — Reset password
- `/nueva-contrasena` — Nueva contraseña

### Dashboard Profesional (requiere auth + role=professional)
- `/dashboard/profesional` — Home: stats, próximas sesiones, accesos rápidos
- `/dashboard/profesional/agenda` — Calendario de sesiones
- `/dashboard/profesional/pacientes` — Lista de pacientes
- `/dashboard/profesional/pacientes/nuevo` — Crear paciente
- `/dashboard/profesional/pacientes/[id]` — Detalle + crear sesión + historia
- `/dashboard/profesional/historia` — Búsqueda y edición de historias clínicas
- `/dashboard/profesional/pagos` — Historial de ingresos
- `/dashboard/profesional/perfil` — Editar perfil público
- `/dashboard/profesional/estadisticas` — KPIs: pacientes activos, sesiones, revenue

### Dashboard Paciente (requiere auth + role=patient)
- `/dashboard/paciente` — Home: próxima sesión, estado emocional, accesos rápidos
- `/dashboard/paciente/sesiones` — Historial de sesiones
- `/dashboard/paciente/videollamada` — Unirse a sesión activa
- `/dashboard/paciente/diario` — Diario emocional (mood slider + emotion chips)
- `/dashboard/paciente/actividades` — Actividades terapéuticas (estáticas)
- `/dashboard/paciente/progreso` — Gráfico evolución emocional + stats
- `/dashboard/paciente/pagos` — Historial de pagos
- `/dashboard/paciente/buscar` — Buscar y contactar profesionales

### Compartidas
- `/dashboard/mensajes` — Chat en tiempo real (Supabase realtime)
- `/dashboard/referidos` — Código referido + historial
- `/sesion/[id]` — Room de sesión: videollamada + notas + resumen IA
- `/videollamada/[sala]` — Jitsi Meet embebido

### APIs
- `POST /api/ia/resumen-sesion` — GPT-4o genera resumen clínico estructurado (JSON: resumen, temas, riesgo)
- `POST /api/sesion/iniciar` — Crear sala Daily.co (inactivo, DAILY_API_KEY vacío)
- `POST /api/sesion/finalizar` — Finalizar sesión
- `GET /api/auth/callback` — OAuth callback Supabase
- `POST /api/auth/signout` — Cerrar sesión

## Componentes clave
- `components/app/Sidebar.tsx` — Sidebar con navegación para ambos roles + link al sitio web
- `components/PWARegister.tsx` — Registro del service worker para PWA
- `app/dashboard/paciente/diario/DiarioForm.tsx` — Formulario diario emocional (client component)
- `app/dashboard/profesional/perfil/PerfilForm.tsx` — Form edición perfil profesional
- `app/dashboard/referidos/CopiarCodigo.tsx` — Botón copiar código (client component)

## PWA
- `public/manifest.json` — name: Mentalia, display: standalone, theme: #2D6A4F, lang: es-AR
- `public/sw.js` — Service worker con cache network-first
- `public/icon-192.png` y `public/icon-512.png` — Íconos PWA
- Instalable desde navegador en Android e iOS (Add to Home Screen)
- Para publicar en Play Store: usar PWABuilder (1-2 días)
- Para app nativa: wrappear con Capacitor (pendiente)

## Reglas de flujo de trabajo
- Después de cada commit, siempre hacer `git push origin main`
- El deploy a Vercel es manual con `npx vercel deploy --prod --yes` desde `mentalia-app/`
- GitHub auto-deploy NO está configurado — push y deploy son pasos separados

## Estado del proyecto
### Funcionando en producción
- Autenticación completa (login, registro, recuperar contraseña)
- Dashboard profesional completo (agenda, pacientes, historia clínica, pagos, estadísticas, perfil)
- Dashboard paciente completo (sesiones, diario, actividades, progreso, videollamada, pagos)
- Mensajería en tiempo real
- Videollamadas con Jitsi Meet
- Resumen clínico post-sesión con OpenAI GPT-4o
- Emails automáticos con Resend
- Sistema de referidos
- Landing page con pricing, funciones, testimonios
- PWA instalable

### Pendiente / Próximos pasos
1. **MercadoPago** — integrar checkout real (endpoint + webhook + activar pagos)
2. **Dominio propio** — mentalia.com.ar o mentalia.app
3. **NEXT_PUBLIC_SITE_URL** — definir en Vercel para emails correctos
4. **Daily.co** — agregar DAILY_API_KEY si se quiere salas privadas
5. **App nativa** — wrappear con Capacitor para Play Store / App Store
6. **Actividades terapéuticas** — migrar de hardcodeado a tabla en Supabase
7. **Políticas** — páginas /privacidad y /terminos (links en footer sin contenido)
