-- ============================================================
-- Mentalia — Bloque 7: subida de matrícula + panel de aprobación
-- Storage privado para documentos de matrícula (dato sensible) + columnas.
-- Aplicar en Supabase SQL Editor.
-- ============================================================

-- 1) Bucket privado 'matriculas' con límite de 5 MB y tipos permitidos.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('matriculas', 'matriculas', false, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do update
  set public = false,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

-- 2) Columnas en professionals.
alter table public.professionals
  add column if not exists license_doc_url         text,
  add column if not exists license_doc_uploaded_at timestamptz;

-- 3) RLS de storage.objects: el profesional sube/lee/actualiza SOLO su carpeta
--    (path = <uid>/archivo). El admin lee TODOS vía service role desde el server
--    (bypassa RLS), por eso no hace falta policy de admin acá.
drop policy if exists "matriculas: subir propio" on storage.objects;
create policy "matriculas: subir propio" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'matriculas' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "matriculas: leer propio" on storage.objects;
create policy "matriculas: leer propio" on storage.objects
  for select to authenticated
  using (bucket_id = 'matriculas' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "matriculas: actualizar propio" on storage.objects;
create policy "matriculas: actualizar propio" on storage.objects
  for update to authenticated
  using (bucket_id = 'matriculas' and (storage.foldername(name))[1] = auth.uid()::text);

-- Verificación (pegame ambos resultados)
select id, public, file_size_limit from storage.buckets where id = 'matriculas';
select policyname, cmd from pg_policies
where schemaname = 'storage' and tablename = 'objects' and policyname like 'matriculas%'
order by policyname;
