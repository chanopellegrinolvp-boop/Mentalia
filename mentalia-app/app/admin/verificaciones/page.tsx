import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import VerificacionesClient from "./VerificacionesClient";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = "force-dynamic";

export default async function AdminVerificaciones() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (!isAdmin(user.id)) redirect("/"); // no admin → afuera

  const { data: pros } = await supabaseAdmin
    .from("professionals")
    .select("id, license_number, province, license_doc_url, license_doc_uploaded_at, profiles(full_name, email)")
    .eq("verification_status", "pendiente")
    .order("license_doc_uploaded_at", { ascending: true, nullsFirst: false });

  const items = await Promise.all((pros ?? []).map(async (p: any) => {
    let docUrl: string | null = null;
    if (p.license_doc_url) {
      const { data } = await supabaseAdmin.storage.from("matriculas").createSignedUrl(p.license_doc_url, 3600);
      docUrl = data?.signedUrl ?? null;
    }
    return {
      id: p.id,
      nombre: p.profiles?.full_name ?? "—",
      email: p.profiles?.email ?? "",
      matricula: p.license_number ?? "—",
      provincia: p.province ?? "—",
      docUrl,
      subido: p.license_doc_uploaded_at as string | null,
    };
  }));

  return <VerificacionesClient items={items} />;
}
