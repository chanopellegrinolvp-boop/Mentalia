import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import HistoriaClient from "./HistoriaClient";

export default async function HistoriaPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "professional") redirect("/dashboard/paciente");

  const { data: appointments } = await supabase
    .from("appointments")
    .select("patient_id, patient:patient_id(full_name, email)")
    .eq("professional_id", user.id)
    .neq("status", "cancelled");

  const uniqueMap = new Map<string, { id: string; full_name: string; email: string }>();
  appointments?.forEach((a: any) => {
    if (!uniqueMap.has(a.patient_id)) {
      uniqueMap.set(a.patient_id, { id: a.patient_id, full_name: a.patient?.full_name ?? "Paciente", email: a.patient?.email ?? "" });
    }
  });
  const patients = Array.from(uniqueMap.values());

  return <HistoriaClient professionalId={user.id} patients={patients} />;
}
