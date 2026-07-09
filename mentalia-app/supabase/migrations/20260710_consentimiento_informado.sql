-- ============================================================
-- Mentalia — Consentimiento informado (Ley 25.326)
-- Bloque 3 (2026-07-10)
-- Agrega registro de consentimiento a profiles.
-- Aplicar en Supabase SQL Editor.
-- ============================================================

alter table public.profiles
  add column if not exists consent_at      timestamptz,
  add column if not exists consent_version text;

comment on column public.profiles.consent_at is
  'Fecha/hora del consentimiento informado expreso (Ley 25.326). NULL = cuentas previas a la feature.';
comment on column public.profiles.consent_version is
  'Versión del texto de consentimiento aceptado (ej. v1-2026-07).';

-- Verificación (pegame el resultado)
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'profiles'
  and column_name in ('consent_at', 'consent_version')
order by column_name;
