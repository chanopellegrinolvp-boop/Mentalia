-- ============================================================
-- Mentalia — Protocolo de crisis: tabla risk_flags + RLS
-- Bloque 2 (2026-07-09)
-- Aplicar en Supabase SQL Editor o vía Management API.
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.risk_flags (
  id               uuid primary key default gen_random_uuid(),
  patient_id       uuid not null references public.profiles(id) on delete cascade,
  professional_id  uuid not null references public.profiles(id) on delete cascade,
  source           text not null check (source in ('diario','sesion')),
  nivel            text not null check (nivel in ('bajo','medio','alto')),
  detalle          text,
  created_at       timestamptz not null default now(),
  acknowledged_at  timestamptz
);

create index if not exists risk_flags_patient_idx
  on public.risk_flags (patient_id, acknowledged_at);
create index if not exists risk_flags_professional_idx
  on public.risk_flags (professional_id, acknowledged_at);

-- ────────────────────────────────────────────────────────────
-- RLS
-- Inserts los hace SOLO el endpoint /api/ia/riesgo con service role
-- (bypassa RLS) tras verificar la relación profesional↔paciente.
-- Por eso NO hay policy de INSERT para usuarios normales.
-- ────────────────────────────────────────────────────────────
alter table public.risk_flags enable row level security;

-- Paciente: ve solo los suyos
drop policy if exists "risk_flags: patient select own" on public.risk_flags;
create policy "risk_flags: patient select own"
  on public.risk_flags for select
  using (auth.uid() = patient_id);

-- Profesional: ve los que él generó (de sus pacientes)
drop policy if exists "risk_flags: professional select own" on public.risk_flags;
create policy "risk_flags: professional select own"
  on public.risk_flags for select
  using (auth.uid() = professional_id);

-- Profesional: puede marcar acknowledged_at (visto) en los suyos
drop policy if exists "risk_flags: professional acknowledge" on public.risk_flags;
create policy "risk_flags: professional acknowledge"
  on public.risk_flags for update
  using (auth.uid() = professional_id)
  with check (auth.uid() = professional_id);

-- Verificación
select policyname, cmd, qual
from pg_policies
where schemaname = 'public' and tablename = 'risk_flags'
order by cmd;
