import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; attachmentId: string } }
) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { data: adjunto } = await supabaseAdmin
    .from("clinical_attachments")
    .select("file_url")
    .eq("id", params.attachmentId)
    .eq("professional_id", user.id)
    .eq("patient_id", params.id)
    .single();

  if (!adjunto) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  await supabaseAdmin.storage.from("clinical-attachments").remove([adjunto.file_url]);
  await supabaseAdmin.from("clinical_attachments").delete().eq("id", params.attachmentId);

  return NextResponse.json({ ok: true });
}
