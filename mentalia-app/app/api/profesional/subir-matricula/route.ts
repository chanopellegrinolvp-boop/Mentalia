import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const TIPOS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "professional") {
    return NextResponse.json({ error: "Solo profesionales" }, { status: 403 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "El archivo supera el máximo de 5 MB" }, { status: 400 });
  }
  const ext = TIPOS[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Tipo no permitido. Subí JPG, PNG, WEBP o PDF." }, { status: 400 });
  }

  // Path dentro del bucket: <uid>/archivo → la RLS de storage exige que la carpeta sea el uid.
  const path = `${user.id}/matricula-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await supabaseAdmin.storage
    .from("matriculas")
    .upload(path, buffer, { contentType: file.type, upsert: true });
  if (upErr) {
    console.error("[subir-matricula] storage:", upErr.message);
    return NextResponse.json({ error: "No se pudo subir el archivo" }, { status: 500 });
  }

  const { error: updErr } = await supabaseAdmin
    .from("professionals")
    .update({ license_doc_url: path, license_doc_uploaded_at: new Date().toISOString() })
    .eq("id", user.id);
  if (updErr) {
    console.error("[subir-matricula] update:", updErr.message);
    return NextResponse.json({ error: "No se pudo registrar el documento" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
