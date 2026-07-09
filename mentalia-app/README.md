# Mentalia — Plataforma de Salud Mental

SaaS B2B2C para psicólogos y pacientes argentinos. El profesional gestiona
su consultorio digital (agenda, historia clínica, videollamadas, cobros).
El paciente accede a sus sesiones, diario emocional y seguimiento.

## Stack
- **Framework:** Next.js 14 App Router + TypeScript
- **Estilos:** Tailwind CSS
- **Base de datos / Auth:** Supabase (PostgreSQL + RLS + Auth)
- **IA:** OpenAI GPT-4o (resumen clínico post-sesión)
- **Videollamadas:** Daily.co
- **Emails:** Resend
- **Pagos:** MercadoPago Checkout Pro
- **Deploy:** Vercel
- **PWA:** Instalable en Android e iOS

## Variables de entorno requeridas

Crear un archivo `.env.local` con:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://mentaliasalud.lat
OPENAI_API_KEY=
RESEND_API_KEY=
EMAIL_FROM=
MP_ACCESS_TOKEN=
NEXT_PUBLIC_MP_PUBLIC_KEY=
```

## Correr localmente

```bash
cd mentalia-app
npm install
npm run dev
```

## Estructura principal

```
mentalia-app/
├── app/
│   ├── api/              # API routes (pagos, emails, IA, sesiones)
│   ├── dashboard/
│   │   ├── profesional/  # Dashboard del profesional
│   │   └── paciente/     # Dashboard del paciente
│   ├── login/
│   ├── registro/
│   ├── privacidad/
│   └── terminos/
├── components/
│   ├── app/              # Sidebar, BotonesPlanes, etc.
│   └── landing/          # Componentes de la landing page
├── lib/                  # Supabase client, Resend, helpers
├── public/               # Assets, manifest.json, sw.js, íconos
└── supabase/             # SQL de RLS policies
```

## Rutas principales

### Públicas
- `/` — Landing page
- `/login` — Iniciar sesión
- `/registro` — Crear cuenta (profesional o paciente)
- `/privacidad` — Política de privacidad
- `/terminos` — Términos y condiciones

### Dashboard Profesional
- `/dashboard/profesional` — Home con stats
- `/dashboard/profesional/agenda` — Calendario
- `/dashboard/profesional/pacientes` — Lista de pacientes
- `/dashboard/profesional/historia` — Historias clínicas
- `/dashboard/profesional/estadisticas` — KPIs y gráficos
- `/dashboard/profesional/pagos` — Historial de ingresos

### Dashboard Paciente
- `/dashboard/paciente` — Home
- `/dashboard/paciente/diario` — Diario emocional
- `/dashboard/paciente/progreso` — Evolución emocional
- `/dashboard/paciente/sesiones` — Historial de sesiones

## Deploy

El proyecto está deployado en Vercel conectado al repositorio GitHub.
Cualquier push a `main` genera un deploy automático.

Dominio: https://mentaliasalud.lat

## Play Store

La app está disponible como PWA instalable.
Assets en `/public/screenshots/`
Package name: com.mentaliasalud.app
