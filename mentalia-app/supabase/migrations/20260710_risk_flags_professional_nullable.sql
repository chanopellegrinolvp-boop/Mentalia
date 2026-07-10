-- ============================================================
-- Mentalia — Fix seguridad: paciente sin profesional
-- Bloque 2b-fix (2026-07-10)
-- El paciente siempre debe recibir el banner de crisis, tenga o no profesional.
-- Se permite risk_flags.professional_id NULL (paciente sin profesional asignado).
-- La FK a profiles(id) sigue vigente (solo valida valores no nulos).
-- Aplicar en Supabase SQL Editor.
-- ============================================================

alter table public.risk_flags
  alter column professional_id drop not null;

-- Verificación (pegame el resultado)
select column_name, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'risk_flags'
  and column_name in ('patient_id', 'professional_id')
order by column_name;
