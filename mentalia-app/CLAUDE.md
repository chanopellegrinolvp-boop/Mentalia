# Mentalia — Plataforma de Salud Mental Argentina

> Este archivo vive en `mentalia-app/` y se auto-carga al abrir Claude Code acá.
> Al terminar una sesión, registrar el cambio en `C:\Segundo Cerebro\WIKI\changelog.md` con formato `## [fecha] build | título`.
> **Regla de oro:** la fuente de verdad es producción / la palabra de Lucho, NO el repo.

## Descripción
SaaS B2B2C para psicólogos y pacientes argentinos. El profesional gestiona su consultorio digital (agenda, historia clínica, videollamadas, cobros). El paciente accede a sus sesiones, diario emocional y seguimiento.

## Stack
- **Framework:** Next.js 14 App Router + TypeScript
- **Estilos:** Tailwind CSS (sin librerías UI externas)
- **Base de datos / Auth:** Supabase (PostgreSQL + RLS + Auth)
- **IA:** OpenAI GPT-4o (ver "Regla de modelo IA")
- **Videollamadas:** Daily.co (salas privadas, `DAILY_API_KEY` configurado). Único proveedor de video.
- **Emails:** Resend
- **Pagos:** MercadoPago — **integración real y activa** (checkout + webhook en producción)
- **App nativa:** Capacitor (Android en Google Play)
- **Deploy:** Vercel — producción en https://mentaliasalud.online
- **Repositorio:** github.com/chanopellegrinolvp-boop/Mentalia (branch `main`)

## Deploy
- El repo git tiene raíz en la carpeta padre (`Pront Claude/`); la app Next vive en `mentalia-app/`.
- **Auto-deploy por Git (2026-07-10):** el proyecto Vercel `mentalia-app` está conectado a `github.com/chanopellegrinolvp-boop/Mentalia`, rama `main` = Production, **Root Directory = `mentalia-app`**. **`git push origin main` auto-deploya al dominio real** (mentaliasalud.online). Ya NO se usa `vercel --prod`.
- ⚠️ **No correr `vercel deploy` desde `mentalia-app/`**: con Root Directory = `mentalia-app`, el CLI buscaría `mentalia-app/mentalia-app` y falla. Si hiciera falta un deploy manual, hacerlo desde la raíz del repo o por la UI de Vercel.
- Env vars de prod están solo en Production (no en Preview). Si se crean ramas/PRs, los Preview deploys fallarían sin esas vars → o se agregan a Preview o se desactivan los Preview deployments.
- Existe un 2º proyecto Vercel `mentalia` (omega, subdominio `mentalia-omega.vercel.app`) como **red de seguridad** — no se borró. Consolidación: pendiente borrarlo cuando el auto-deploy esté probado en el tiempo.
- Los `*.html` legacy en la raíz (`mentalia-landing.html`, `terminos.html`, `privacidad.html`) + `vercel.json` de la raíz son de un landing estático viejo; la app real es el proyecto Next de `mentalia-app/`.

## Regla de modelo IA
- **Los endpoints IA usan `gpt-4o` (OpenAI):** `ia/resumen`, `ia/resumen-sesion`, `ia/resumen-semanal`, `ia/riesgo`, y el diario (`diario/evaluar-riesgo`, solo tras el pre-filtro).
- `@anthropic-ai/sdk` está **instalado pero sin uso** en el código.
- **Un modelo por endpoint**, elegido a propósito — no los dos "por las dudas". Si se cambia un endpoint a Claude, documentarlo acá y medir costo.

## Evaluación de riesgo del diario (pre-filtro cost-smart)
- El diario emocional del paciente se evalúa **sin gastar gpt-4o en cada entrada**.
- Al guardar una nota, `DiarioForm` llama (fire-and-forget) a `POST /api/diario/evaluar-riesgo`.
- **Pre-filtro barato (sin IA)** en `lib/preFiltroRiesgo.ts`: normaliza el texto (minúsculas + sin tildes) y busca patrones de señal de alerta (ideación suicida, autolesión, desesperanza, con variantes y typos). **Sesgo hacia la seguridad**: ante la duda, escala (mejor falso positivo que perder una señal).
- **Solo si el pre-filtro dispara** se llama a `gpt-4o` (vía `lib/riesgo.ts`, compartido con `ia/riesgo`), se persiste en `risk_flags` con `source='diario'` y se dispara el flujo por nivel ya existente (alto → banner al paciente + notificación/email al profesional; medio → notificación; bajo → registro). El profesional se deriva del turno más reciente del paciente.
- Resultado: la **mayoría de las entradas NO tocan gpt-4o**.
- ⚠️ **Privacidad pendiente:** esto crea un flujo nuevo (diario → OpenAI en los casos marcados). La política `/privacidad` debe reflejarlo (hoy la sección 4.2/OpenAI habla de notas clínicas; falta el caso del diario). Actualizar en el próximo bloque legal.

## Supabase
- Project ID: `odxruvzwkjucgshmjohd` · URL: `https://odxruvzwkjucgshmjohd.supabase.co`
- Auditoría RLS completa hecha. Migraciones en `supabase/migrations/` + `supabase/rls-policies.sql`.

### Tablas (reales, verificadas en código)
- `profiles` — id, email, full_name, role (professional/patient), referral_code
- `professionals` — license_number, specialty, bio, city, province, session_price, is_available, years_experience, modality
- `pacientes` — pacientes offline creados por el profesional
- `appointments` — professional_id, patient_id, paciente_id, scheduled_at, status, room_name
- `session_notes` — notas clínicas por sesión con resumen IA
- `clinical_attachments` — adjuntos clínicos (storage Supabase)
- `treatment_plans` — plan de tratamiento por paciente
- `quick_notes` — notas rápidas del profesional
- `emotional_diary` — entradas diarias del paciente (mood 1-10, emotions[], notes)
- `therapeutic_activities` — actividades terapéuticas (migradas de hardcode a tabla)
- `solicitudes_consulta` — solicitudes de turno paciente→profesional (status pendiente/aceptada/rechazada)
- `messages` — mensajería realtime
- `payments` — historial de pagos (MercadoPago)
- `referrals` — referrer_id, referred_id
- `rate_limits` — control de rate limiting

## Endpoints API (`app/api/`)
### IA (todos gpt-4o)
- `POST ia/resumen`, `POST ia/resumen-sesion`, `POST ia/resumen-semanal`, `POST ia/riesgo` (evalúa nivel de riesgo del paciente — **sin flujo de acción todavía**)

### Pagos (MercadoPago, real)
- `POST pagos/crear-preferencia` — arma la preferencia de checkout
- `POST pagos/webhook` — procesa el pago y activa el plan (`payments`)
- `POST pagos/cancelar-plan`

### Sesión / video
- `POST sesion/iniciar`, `POST sesion/finalizar`, `POST videollamada/crear-sala` (Daily.co)

### Auth / perfil
- `GET auth/callback`, `POST auth/signout`, `POST auth/crear-perfil`

### Emails (Resend)
- `emails/bienvenida`, `emails/turno`, `emails/turno-cancelado`, `emails/recordatorio-turno`, `emails/solicitud-consulta`, `emails/solicitud-rechazada`, `contacto`

### Crons (`vercel.json` en `mentalia-app/`)
- `GET cron/recordatorio-turnos` — recordatorios de turnos
- `GET cron/limpiar-sesiones` — limpia appointments vencidos + `solicitudes_consulta` resueltas (24h) y pendientes (48h)

### Otros
- `cobros/resumen-pdf` (pdfkit) · `pacientes/[id]/adjuntos` (+ `[attachmentId]`)
- `app/.well-known/assetlinks.json/route.ts` — Digital Asset Links para la app Android

## Rutas de páginas
- **Públicas:** `/`, `/login`, `/registro`, `/olvide-contrasena`, `/nueva-contrasena`, `/privacidad`, `/terminos`, `/nosotros`, `/contacto`, `/como-instalar`
- **Profesional (`/dashboard/profesional`):** home, agenda (+ solicitudes), pacientes (+ nuevo, [id]), historia, pagos, perfil, estadisticas
- **Paciente (`/dashboard/paciente`):** home, sesiones, videollamada, diario, actividades, progreso, pagos, buscar
- **Compartidas:** `/dashboard/mensajes`, `/dashboard/referidos`, `/sesion/[id]`, `/videollamada/[sala]`

## Estado del proyecto (2026-07)
**Funcionando en producción (v1.0):** auth completa · dashboards profesional y paciente completos · mensajería realtime · videollamadas · diario emocional · resumen clínico IA · emails · referidos · MercadoPago real (pago acreditado + webhook) · dominio propio · `/privacidad` y `/terminos` con contenido (Ley 25.326) · PWA · app Android con Capacitor en Google Play (Alpha).

**Pendientes de cierre (ver `C:\Segundo Cerebro\OUTPUTS\2026-07-03-mentalia-plan-cierre-riesgos.md`):**
1. 🟡 Sync repo + CLAUDE.md + tag `v1.0` (este cambio).
2. 🔴 Protocolo de crisis: `ia/riesgo` detecta pero no actúa (falta banner al paciente con líneas AR, notificación al profesional, tabla `risk_flags`).
3. 🟡 Legal: falta consentimiento informado específico de datos de salud en `/registro` (hoy solo checkbox genérico; no guarda `consent_at`/`consent_version`).
4. 🔴 Verificación de matrícula: `license_number` se guarda sin validar; falta `verification_status` + ocultar no verificados del buscador.
5. 🔴 Tests: no hay. Prioridad: pagos MercadoPago + RLS historia clínica.

## Paleta y diseño
| Token | Hex |
|---|---|
| Verde oscuro | `#2D6A4F` |
| Verde claro | `#D8F3DC` |
| Blanco cálido | `#FDFCFA` |
| Gris | `#6B7280` |

- Nav/sidebar landing y dashboards: fondo `#2D6A4F`, texto/íconos blancos.
- Logo "Mentalia" en Playfair/Georgia italic. Watermark: logo SVG opacity 0.04 en hero/login/registro/pricing.

## Reglas de texto
- Cuerpo: "el profesional", "el paciente" (sin barras). Títulos/etiquetas: "psicólogos/as" ok.
- Tono profesional, cálido, directo. No mencionar IA explícitamente — hablar de "resumen clínico", "seguimiento".

## Pricing
| Plan | ARS/mes |
|---|---|
| Starter | $16.500 |
| Pro | $45.000 (destacado) |
| Clínica | $85.000 |
- Trial: 10 días gratis, sin tarjeta. Referidos: 20% de descuento por 2 meses por referido.

## Verificación de matrícula (admin, manual)
- `professionals.verification_status`: `pendiente` (default) | `verificado` | `rechazado`.
- **Solo `verificado` aparece en el buscador** (`/dashboard/paciente/buscar`) y puede recibir pacientes nuevos. `pendiente`/`rechazado` ven un banner de estado en su dashboard.
- No hay panel de admin todavía: el cambio de estado se hace a mano en el **SQL Editor de Supabase**, tras revisar la matrícula contra el colegio provincial:
  ```sql
  update public.professionals set verification_status = 'verificado' where id = '<uuid-del-profesional>';
  update public.professionals set verification_status = 'rechazado'  where id = '<uuid-del-profesional>';
  -- listar pendientes: select id, license_number, city, province from professionals where verification_status = 'pendiente';
  ```

## Reglas de trabajo
- Sin features nuevas hasta cerrar los pendientes de arriba (regla del plan de cierre).
- Commitear antes de deployar (el deploy usa el working tree). `git push origin main` después de cada commit.
- Al terminar la sesión: entrada en `C:\Segundo Cerebro\WIKI\changelog.md`.
