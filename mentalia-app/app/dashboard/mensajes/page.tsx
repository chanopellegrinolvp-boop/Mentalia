import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MensajesClient from "./MensajesClient";

export default async function MensajesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single();

  // Buscar contactos (profesional → sus pacientes con turnos, paciente → sus profesionales)
  let contacts: { id: string; full_name: string; role: string }[] = [];

  if (profile?.role === "professional") {
    const { data: appts } = await supabase
      .from("appointments").select("patient_id, patient:patient_id(full_name)")
      .eq("professional_id", user.id).neq("status", "cancelled");
    const seen = new Map<string, any>();
    appts?.forEach((a: any) => { if (!seen.has(a.patient_id)) seen.set(a.patient_id, { id: a.patient_id, full_name: a.patient?.full_name ?? "Paciente", role: "patient" }); });
    contacts = Array.from(seen.values());
  } else {
    const { data: appts } = await supabase
      .from("appointments").select("professional_id, professional:professional_id(full_name)")
      .eq("patient_id", user.id).neq("status", "cancelled");
    const seen = new Map<string, any>();
    appts?.forEach((a: any) => { if (!seen.has(a.professional_id)) seen.set(a.professional_id, { id: a.professional_id, full_name: a.professional?.full_name ?? "Profesional", role: "professional" }); });
    contacts = Array.from(seen.values());
  }

  return <MensajesClient userId={user.id} userName={profile?.full_name ?? "Yo"} contacts={contacts} />;
}
