-- ============================================================
-- Mentalia — Row Level Security Policies
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- profiles
-- ────────────────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles: select own" ON profiles;
CREATE POLICY "profiles: select own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles: insert own" ON profiles;
CREATE POLICY "profiles: insert own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles: update own" ON profiles;
CREATE POLICY "profiles: update own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ────────────────────────────────────────────────────────────
-- professionals
-- Lectura pública (directorio), escritura solo el dueño
-- ────────────────────────────────────────────────────────────
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "professionals: select public" ON professionals;
CREATE POLICY "professionals: select public"
  ON professionals FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "professionals: insert own" ON professionals;
CREATE POLICY "professionals: insert own"
  ON professionals FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "professionals: update own" ON professionals;
CREATE POLICY "professionals: update own"
  ON professionals FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ────────────────────────────────────────────────────────────
-- pacientes
-- Solo el profesional que los creó
-- ────────────────────────────────────────────────────────────
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pacientes: all for professional" ON pacientes;
CREATE POLICY "pacientes: all for professional"
  ON pacientes FOR ALL
  USING (auth.uid() = professional_id)
  WITH CHECK (auth.uid() = professional_id);


-- ────────────────────────────────────────────────────────────
-- appointments
-- Solo el profesional o el paciente de esa fila
-- ────────────────────────────────────────────────────────────
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "appointments: select own" ON appointments;
CREATE POLICY "appointments: select own"
  ON appointments FOR SELECT
  USING (auth.uid() = professional_id OR auth.uid() = patient_id);

DROP POLICY IF EXISTS "appointments: insert professional" ON appointments;
CREATE POLICY "appointments: insert professional"
  ON appointments FOR INSERT
  WITH CHECK (auth.uid() = professional_id);

DROP POLICY IF EXISTS "appointments: update own" ON appointments;
CREATE POLICY "appointments: update own"
  ON appointments FOR UPDATE
  USING (auth.uid() = professional_id OR auth.uid() = patient_id);

DROP POLICY IF EXISTS "appointments: delete professional" ON appointments;
CREATE POLICY "appointments: delete professional"
  ON appointments FOR DELETE
  USING (auth.uid() = professional_id);


-- ────────────────────────────────────────────────────────────
-- session_notes
-- Solo el profesional de esa sesión
-- ────────────────────────────────────────────────────────────
ALTER TABLE session_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "session_notes: all for professional" ON session_notes;
CREATE POLICY "session_notes: all for professional"
  ON session_notes FOR ALL
  USING (auth.uid() = professional_id)
  WITH CHECK (auth.uid() = professional_id);


-- ────────────────────────────────────────────────────────────
-- messages
-- Solo el sender o el receiver
-- ────────────────────────────────────────────────────────────
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages: select own" ON messages;
CREATE POLICY "messages: select own"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "messages: insert as sender" ON messages;
CREATE POLICY "messages: insert as sender"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "messages: delete own" ON messages;
CREATE POLICY "messages: delete own"
  ON messages FOR DELETE
  USING (auth.uid() = sender_id);


-- ────────────────────────────────────────────────────────────
-- payments
-- Solo el user_id de esa fila (paciente o profesional)
-- ────────────────────────────────────────────────────────────
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payments: select own" ON payments;
CREATE POLICY "payments: select own"
  ON payments FOR SELECT
  USING (auth.uid() = patient_id OR auth.uid() = professional_id);

DROP POLICY IF EXISTS "payments: insert own" ON payments;
CREATE POLICY "payments: insert own"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = patient_id OR auth.uid() = professional_id);


-- ────────────────────────────────────────────────────────────
-- emotional_diary
-- Solo el paciente dueño
-- ────────────────────────────────────────────────────────────
ALTER TABLE emotional_diary ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "emotional_diary: all for owner" ON emotional_diary;
CREATE POLICY "emotional_diary: all for owner"
  ON emotional_diary FOR ALL
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);


-- ────────────────────────────────────────────────────────────
-- referrals
-- Solo el referrer o el referred
-- ────────────────────────────────────────────────────────────
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "referrals: select own" ON referrals;
CREATE POLICY "referrals: select own"
  ON referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

DROP POLICY IF EXISTS "referrals: insert as referrer" ON referrals;
CREATE POLICY "referrals: insert as referrer"
  ON referrals FOR INSERT
  WITH CHECK (auth.uid() = referrer_id);


-- ────────────────────────────────────────────────────────────
-- Verificación: mostrar todas las políticas activas
-- ────────────────────────────────────────────────────────────
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
