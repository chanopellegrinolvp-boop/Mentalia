-- =====================================================================
-- DATOS DE PRUEBA - Plataforma de psicología
-- 6 registros por tabla, todos coherentes entre sí
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) PROFILES (3 profesionales psicólogos + 3 pacientes)
-- ---------------------------------------------------------------------
INSERT INTO profiles (id, full_name, email, phone, dni, birth_date, role, created_at) VALUES
('11111111-1111-1111-1111-111111111101', 'Lucía Fernández',   'lucia.fernandez@mindcare.com',   '+54 9 2477 412233', '28456789', '1985-03-12', 'professional', '2025-01-15 10:00:00'),
('11111111-1111-1111-1111-111111111102', 'Martín Sosa',       'martin.sosa@mindcare.com',       '+54 9 2477 556677', '30123456', '1982-07-22', 'professional', '2025-01-20 11:30:00'),
('11111111-1111-1111-1111-111111111103', 'Carolina Méndez',   'carolina.mendez@mindcare.com',   '+54 9 11 4055 8899', '32987654', '1989-11-04', 'professional', '2025-02-02 09:15:00'),
('22222222-2222-2222-2222-222222222201', 'Julián Pereyra',    'julian.pereyra@gmail.com',       '+54 9 2477 334455', '40112233', '1995-05-18', 'patient',      '2025-03-10 14:20:00'),
('22222222-2222-2222-2222-222222222202', 'Sofía Ramírez',     'sofia.ramirez@hotmail.com',      '+54 9 11 6677 8899', '42334455', '1998-09-27', 'patient',      '2025-03-18 16:45:00'),
('22222222-2222-2222-2222-222222222203', 'Mateo González',    'mateo.gonzalez@outlook.com',     '+54 9 351 488 1122', '38221144', '1992-12-01', 'patient',      '2025-04-05 12:00:00');


-- ---------------------------------------------------------------------
-- 2) PROFESSIONALS (perfil extendido, solo para los 3 psicólogos)
-- ---------------------------------------------------------------------
INSERT INTO professionals (id, profile_id, license_number, specialty, bio, years_experience, session_price, modality, created_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', '11111111-1111-1111-1111-111111111101', 'MN-45821', 'Terapia Cognitivo-Conductual',
 'Psicóloga clínica especializada en ansiedad y trastornos del estado de ánimo. Atiendo adultos y adolescentes desde un enfoque TCC.',
 10, 18000.00, 'online',   '2025-01-15 10:30:00'),

('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02', '11111111-1111-1111-1111-111111111102', 'MP-12987', 'Psicoanálisis',
 'Psicólogo clínico con orientación psicoanalítica. Trabajo con adultos en procesos de duelo, vínculos y conflictos laborales.',
 14, 20000.00, 'presencial','2025-01-20 12:00:00'),

('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03', '11111111-1111-1111-1111-111111111103', 'MN-67432', 'Terapia Sistémica de Familia',
 'Especialista en terapia familiar y de pareja. Acompaño procesos vinculares con un enfoque sistémico y narrativo.',
 7, 17500.00, 'hibrido',   '2025-02-02 09:45:00');


-- ---------------------------------------------------------------------
-- 3) APPOINTMENTS (6 turnos: pasados, presentes, futuros, cancelado)
-- ---------------------------------------------------------------------
INSERT INTO appointments (id, professional_id, patient_id, scheduled_at, duration_min, modality, status, notes, created_at) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', '22222222-2222-2222-2222-222222222201',
 '2026-04-15 16:00:00', 50, 'online',     'completed', 'Primera sesión. Motivo de consulta: ansiedad laboral.', '2026-04-10 10:00:00'),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', '22222222-2222-2222-2222-222222222201',
 '2026-04-22 16:00:00', 50, 'online',     'completed', 'Segunda sesión. Se trabajan técnicas de respiración.',   '2026-04-15 17:00:00'),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb03', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02', '22222222-2222-2222-2222-222222222202',
 '2026-04-28 18:30:00', 50, 'presencial', 'completed', 'Sesión inicial. Consulta por duelo reciente.',           '2026-04-20 11:30:00'),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb04', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03', '22222222-2222-2222-2222-222222222203',
 '2026-05-06 10:00:00', 60, 'online',     'scheduled', 'Sesión de pareja agendada. Primera entrevista.',         '2026-04-30 09:00:00'),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb05', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', '22222222-2222-2222-2222-222222222202',
 '2026-05-12 17:00:00', 50, 'online',     'scheduled', 'Derivación de colega. Pendiente confirmación.',          '2026-05-01 14:15:00'),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb06', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02', '22222222-2222-2222-2222-222222222203',
 '2026-04-25 19:00:00', 50, 'presencial', 'cancelled', 'Cancelado por el paciente con 24 hs de aviso.',          '2026-04-18 13:00:00');


-- ---------------------------------------------------------------------
-- 4) PAYMENTS (1 pago por turno, estados variados)
-- ---------------------------------------------------------------------
INSERT INTO payments (id, appointment_id, patient_id, amount, currency, method, status, transaction_ref, paid_at, created_at) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccc01', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', '22222222-2222-2222-2222-222222222201',
 18000.00, 'ARS', 'mercado_pago',     'paid',     'MP-1029384756', '2026-04-15 16:55:00', '2026-04-15 16:55:00'),

('cccccccc-cccc-cccc-cccc-cccccccccc02', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', '22222222-2222-2222-2222-222222222201',
 18000.00, 'ARS', 'mercado_pago',     'paid',     'MP-1029400112', '2026-04-22 16:58:00', '2026-04-22 16:58:00'),

('cccccccc-cccc-cccc-cccc-cccccccccc03', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb03', '22222222-2222-2222-2222-222222222202',
 20000.00, 'ARS', 'transferencia',    'paid',     'TRF-887766554',  '2026-04-28 18:45:00', '2026-04-28 18:45:00'),

('cccccccc-cccc-cccc-cccc-cccccccccc04', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb04', '22222222-2222-2222-2222-222222222203',
 17500.00, 'ARS', 'mercado_pago',     'pending',   NULL,             NULL,                  '2026-04-30 09:05:00'),

('cccccccc-cccc-cccc-cccc-cccccccccc05', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb05', '22222222-2222-2222-2222-222222222202',
 18000.00, 'ARS', 'tarjeta_credito',  'pending',   NULL,             NULL,                  '2026-05-01 14:20:00'),

('cccccccc-cccc-cccc-cccc-cccccccccc06', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb06', '22222222-2222-2222-2222-222222222203',
 20000.00, 'ARS', 'mercado_pago',     'refunded', 'MP-1029455999', '2026-04-19 10:00:00', '2026-04-18 13:05:00');
