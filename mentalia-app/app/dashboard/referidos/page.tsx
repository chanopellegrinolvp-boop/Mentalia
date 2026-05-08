import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CopiarCodigo from "./CopiarCodigo";

export default async function Referidos() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("referral_code")
    .eq("id", user.id)
    .single();

  const { count: totalReferidos } = await supabase
    .from("referrals")
    .select("*", { count: "exact", head: true })
    .eq("referrer_id", user.id);

  const { data: referidos } = await supabase
    .from("referrals")
    .select("id, created_at")
    .eq("referrer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const referralCode = profile?.referral_code ?? null;

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-semibold text-gray-900">Referidos</h1>
          <p className="text-xs text-gray-400 mt-0.5">Invitá colegas o pacientes y ganá beneficios</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Tu código de referido</h2>
          {referralCode ? (
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-center">
              <p className="text-3xl font-bold tracking-widest text-[#2D6A4F]">{referralCode}</p>
              <p className="text-xs text-gray-400 mt-2">Compartí este código con quien quieras invitar</p>
              <div className="mt-4 flex gap-2 justify-center">
                <CopiarCodigo codigo={referralCode} />
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center">
              <p className="text-sm text-gray-400">Tu código de referido se generará pronto</p>
            </div>
          )}
        </section>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-gray-100 rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-[#2D6A4F]">{totalReferidos ?? 0}</p>
            <p className="text-xs text-gray-500 mt-1">Personas invitadas</p>
          </div>
          <div className="bg-[#D8F3DC] rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-[#2D6A4F]">20% off</p>
            <p className="text-xs text-[#2D6A4F]/70 mt-1">Descuento por 2 meses por referido</p>
          </div>
        </div>

        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Cómo funciona</h2>
          <div className="space-y-2">
            {[
              { num: "1", texto: "Compartís tu código con un colega o paciente" },
              { num: "2", texto: "Se registran en Mentalia usando tu código" },
              { num: "3", texto: "Vos obtenés un 20% de descuento durante 2 meses en tu plan actual" },
            ].map(step => (
              <div key={step.num} className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center gap-4">
                <span className="w-7 h-7 rounded-full bg-[#2D6A4F] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {step.num}
                </span>
                <p className="text-sm text-gray-700">{step.texto}</p>
              </div>
            ))}
          </div>
        </section>

        {referidos && referidos.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Historial de referidos</h2>
            <div className="space-y-2">
              {referidos.map((r: any) => (
                <div key={r.id} className="bg-white border border-gray-100 rounded-xl px-5 py-3 flex items-center justify-between">
                  <p className="text-sm text-gray-600">Usuario invitado</p>
                  <p className="text-xs text-gray-400">
                    {new Date(r.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
