-- Limpieza de RLS policies duplicadas en Mentalia
-- Generado: junio 2026
-- REVISAR ANTES DE EJECUTAR en producción.
-- Para aplicar: copiar y ejecutar en Supabase SQL Editor, o usar MCP apply_migration.

-- ============================================================
-- APPOINTMENTS (3 duplicados)
-- ============================================================
-- "Profesional ve sus turnos" (qual: auth.uid() = professional_id)
-- es un SUBCONJUNTO de "appointments: select own"
-- (qual: auth.uid() = professional_id OR auth.uid() = patient_id)
DROP POLICY IF EXISTS "Profesional ve sus turnos" ON public.appointments;

-- "Paciente ve sus turnos" (qual: auth.uid() = patient_id)
-- es un SUBCONJUNTO de "appointments: select own"
DROP POLICY IF EXISTS "Paciente ve sus turnos" ON public.appointments;

-- "Profesional actualiza sus turnos" (qual: auth.uid() = professional_id)
-- es un SUBCONJUNTO de "appointments: update own"
-- (qual: auth.uid() = professional_id OR auth.uid() = patient_id)
DROP POLICY IF EXISTS "Profesional actualiza sus turnos" ON public.appointments;

-- ============================================================
-- PROFESSIONALS (1 duplicado)
-- ============================================================
-- "Profesionales insertan su perfil" y "professionals: insert own"
-- tienen condiciones IDÉNTICAS (WITH CHECK: auth.uid() = id).
-- Se conserva "professionals: insert own" (nombre más consistente).
DROP POLICY IF EXISTS "Profesionales insertan su perfil" ON public.professionals;

-- ============================================================
-- EMOTIONAL_DIARY (1 duplicado)
-- ============================================================
-- "emotional_diary: all for owner" tiene WITH CHECK: auth.uid() = patient_id
-- "Paciente ve su propio diario" tiene misma qual pero sin WITH CHECK
-- Se conserva la más restrictiva (con WITH CHECK).
DROP POLICY IF EXISTS "Paciente ve su propio diario" ON public.emotional_diary;

-- ============================================================
-- MESSAGES (2 redundantes, 1 alerta de seguridad)
-- ============================================================
-- "messages: select own" tiene qual idéntica a "Usuario ve sus mensajes" (ALL).
-- La política ALL ya cubre SELECT, por lo que esta es redundante.
DROP POLICY IF EXISTS "messages: select own" ON public.messages;

-- "messages: delete own" es un subconjunto de "Usuario ve sus mensajes" (ALL).
DROP POLICY IF EXISTS "messages: delete own" ON public.messages;

-- ALERTA: "Usuario ve sus mensajes" es ALL sin WITH CHECK para INSERT/UPDATE.
-- Esto permite que un usuario inserte mensajes con cualquier sender_id.
-- La política "messages: insert as sender" (WITH CHECK: auth.uid() = sender_id)
-- queda anulada por la política ALL más permisiva (las políticas se aplican con OR).
-- FIX RECOMENDADO (NO incluido aquí para no cambiar comportamiento accidentalmente):
--   DROP POLICY "Usuario ve sus mensajes" ON public.messages;
--   Y verificar que las políticas específicas (insert as sender, select own) cubren todo.

-- ============================================================
-- PROFESSIONALS (UPDATE — diferencia en WITH CHECK)
-- ============================================================
-- "professionals: update own" tiene WITH CHECK: auth.uid() = id
-- "Profesionales editan su propio perfil" tiene misma qual pero WITHOUT CHECK
-- NOTA: Ambas coexisten con diferente WITH CHECK. La que no tiene WITH CHECK
-- es potencialmente más permisiva en updates. No se elimina automáticamente
-- porque podría romper el flujo de edición de perfil si la con WITH CHECK
-- tiene una restricción adicional no esperada. Revisar manualmente.
