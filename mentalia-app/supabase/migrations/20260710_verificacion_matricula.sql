-- ============================================================
-- Mentalia — Verificación de matrícula (MVP, RIESGO 3)
-- Bloque 4 (2026-07-10)
-- Estado de verificación en professionals. Revisión manual por admin.
-- Aplicar en Supabase SQL Editor.
-- ============================================================

alter table public.professionals
  add column if not exists verification_status text
    not null default 'pendiente'
    check (verification_status in ('pendiente', 'verificado', 'rechazado'));

comment on column public.professionals.verification_status is
  'Estado de verificación de matrícula: pendiente (default) | verificado | rechazado. Solo verificado aparece en el buscador.';

-- NOTA: al aplicar, TODOS los profesionales existentes quedan en 'pendiente'
-- y dejan de aparecer en el buscador hasta que un admin los verifique.
-- Para verificar a mano un profesional (revisión manual):
--   update public.professionals set verification_status = 'verificado' where id = '<uuid-del-profesional>';
-- Para rechazar:
--   update public.professionals set verification_status = 'rechazado' where id = '<uuid-del-profesional>';

-- Verificación (pegame el resultado)
select column_name, data_type, column_default, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'professionals'
  and column_name = 'verification_status';
