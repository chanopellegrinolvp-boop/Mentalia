import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/app/Sidebar";
import LogoFondo from "@/components/app/LogoFondo";
import RiskBanner from "@/components/app/RiskBanner";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  // Protocolo de crisis: banner fijo al paciente si tiene una alerta de nivel alto sin resolver.
  let mostrarRiesgo = false;
  if (profile.role === "patient") {
    const { data: flag } = await supabase
      .from("risk_flags")
      .select("id")
      .eq("patient_id", user.id)
      .eq("nivel", "alto")
      .is("acknowledged_at", null)
      .limit(1)
      .maybeSingle();
    mostrarRiesgo = !!flag;
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#f0f7f2" }}>
      <Sidebar profile={{ full_name: profile.full_name, email: profile.email, role: profile.role }} />
      <LogoFondo />
      <main className="flex-1 md:ml-60 min-h-screen pb-16 md:pb-0">
        {mostrarRiesgo && <RiskBanner />}
        {children}
      </main>
    </div>
  );
}
