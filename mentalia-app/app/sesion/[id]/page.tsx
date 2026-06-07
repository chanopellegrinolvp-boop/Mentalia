import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import SesionRoom from "./SesionRoom";

export default async function SesionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: sesion } = await supabase
    .from("appointments")
    .select("id, scheduled_at, duration_minutes, status, daily_room_name, paciente_id, patient_id, pacientes(nombre, motivo_consulta), session_notes(id, content, ai_summary, temas_clave, nivel_riesgo)")
    .eq("id", id)
    .eq("professional_id", user.id)
    .single();

  if (!sesion) notFound();

  // Fix 14: historial previo para pacientes offline (paciente_id) y online (patient_id)
  const historialBase = supabase
    .from("appointments")
    .select("session_notes(content, ai_summary, temas_clave)")
    .eq("professional_id", user.id)
    .neq("id", id)
    .order("scheduled_at", { ascending: false })
    .limit(3);

  const { data: historial } = sesion.paciente_id
    ? await historialBase.eq("paciente_id", sesion.paciente_id)
    : sesion.patient_id
    ? await historialBase.eq("patient_id", sesion.patient_id)
    : { data: [] };

  return (
    <SesionRoom
      sesion={sesion as any}
      historialPrevio={historial as any}
      profesionalId={user.id}
    />
  );
}
