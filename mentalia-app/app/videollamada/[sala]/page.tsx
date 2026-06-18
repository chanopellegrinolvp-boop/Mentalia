import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import VideoRoom from "./VideoRoom";

export default async function VideoPage({ params }: { params: Promise<{ sala: string }> }) {
  const { sala } = await params;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role = "patient";
  let appointmentId: string | null = null;
  let patientId: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role ?? "patient";

    if (role === "professional") {
      const { data: appt } = await supabase
        .from("appointments")
        .select("id, patient_id")
        .eq("professional_id", user.id)
        .or(`id.eq.${sala},daily_room_name.eq.${sala}`)
        .maybeSingle();
      appointmentId = appt?.id ?? null;
      patientId = appt?.patient_id ?? null;
    }
  }

  const exitUrl = role === "professional" ? "/dashboard/profesional" : "/dashboard/paciente";

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "#0f1923" }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Link href="/">
          <Image src="/logo_mentalia_white.svg" alt="Mentalia" width={110} height={30} />
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400 font-medium">Sesión activa</span>
          <span className="text-xs text-white/30">·</span>
          <span className="text-xs text-white/40 font-mono">{sala}</span>
        </div>

        <Link
          href={exitUrl}
          className="text-xs font-medium px-4 py-2 rounded-lg transition-all"
          style={{ color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          Salir de la sesión
        </Link>
      </div>

      {/* Video room */}
      <div className="flex-1 overflow-hidden">
        <VideoRoom sala={sala} role={role} userId={user?.id ?? null} appointmentId={appointmentId} patientId={patientId} />
      </div>
    </div>
  );
}
