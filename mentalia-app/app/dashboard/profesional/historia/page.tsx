import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import HistoriaClient from "./HistoriaClient";

export default async function HistoriaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "professional") redirect("/dashboard/paciente");

  // Pacientes online (patient_id → profiles)
  const { data: appsOnline } = await supabase
    .from("appointments")
    .select("patient_id, patient:patient_id(full_name, email)")
    .eq("professional_id", user.id)
    .not("patient_id", "is", null)
    .neq("status", "cancelled");

  // Pacientes offline (paciente_id → pacientes)
  const { data: appsOffline } = await supabase
    .from("appointments")
    .select("paciente_id, paciente:paciente_id(id, nombre, email)")
    .eq("professional_id", user.id)
    .not("paciente_id", "is", null)
    .neq("status", "cancelled");

  const uniqueMap = new Map<string, { id: string; full_name: string; email: string; tipo: "online" | "offline" }>();

  appsOnline?.forEach((a: any) => {
    if (a.patient_id && !uniqueMap.has(a.patient_id)) {
      uniqueMap.set(a.patient_id, {
        id: a.patient_id,
        full_name: a.patient?.full_name ?? "Paciente",
        email: a.patient?.email ?? "",
        tipo: "online",
      });
    }
  });

  appsOffline?.forEach((a: any) => {
    if (a.paciente_id && !uniqueMap.has(a.paciente_id)) {
      uniqueMap.set(a.paciente_id, {
        id: a.paciente_id,
        full_name: a.paciente?.nombre ?? "Paciente offline",
        email: a.paciente?.email ?? "",
        tipo: "offline",
      });
    }
  });

  const patients = Array.from(uniqueMap.values());

  return <HistoriaClient professionalId={user.id} patients={patients} />;
}
