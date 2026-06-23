import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { data } = await supabaseAdmin
    .from("clinical_attachments")
    .select("id, file_name, file_type, file_url, notes, created_at")
    .eq("professional_id", user.id)
    .eq("patient_id", params.id)
    .order("created_at", { ascending: false });

  const withSignedUrls = await Promise.all(
    (data ?? []).map(async (a) => {
      const { data: signed } = await supabaseAdmin.storage
        .from("clinical-attachments")
        .createSignedUrl(a.file_url, 3600);
      return { ...a, signed_url: signed?.signedUrl ?? null };
    })
  );

  return NextResponse.json(withSignedUrls);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const notes = formData.get("notes") as string | null;

  if (!file) return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: "Tipo no permitido. Usar PDF, JPG, PNG o WEBP" }, { status: 400 });
  if (file.size > 10 * 1024 * 1024)
    return NextResponse.json({ error: "El archivo supera los 10 MB" }, { status: 400 });

  const path = `${user.id}/${params.id}/${Date.now()}_${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabaseAdmin.storage
    .from("clinical-attachments")
    .upload(path, buffer, { contentType: file.type });

  if (uploadError)
    return NextResponse.json({ error: "Error al subir archivo" }, { status: 500 });

  const { error: dbError } = await supabaseAdmin.from("clinical_attachments").insert({
    professional_id: user.id,
    patient_id: params.id,
    file_url: path,
    file_name: file.name,
    file_type: file.type,
    notes: notes || null,
  });

  if (dbError) {
    await supabaseAdmin.storage.from("clinical-attachments").remove([path]);
    return NextResponse.json({ error: "Error al guardar adjunto" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
