import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ahora = Date.now();
  const cutoff = new Date(ahora).toISOString();
  const cutoff24h = new Date(ahora - 24 * 60 * 60 * 1000).toISOString();
  const cutoff48h = new Date(ahora - 48 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("appointments")
    .delete()
    .in("status", ["completed", "cancelled", "no_show"])
    .lt("scheduled_at", cutoff)
    .select("id");

  if (error) {
    console.error("[cron] limpiar-sesiones error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: resueltas, error: errResueltas } = await supabase
    .from("solicitudes_consulta")
    .delete()
    .in("status", ["aceptada", "rechazada"])
    .lt("updated_at", cutoff24h)
    .select("id");

  if (errResueltas) {
    console.error("[cron] limpiar-sesiones solicitudes resueltas error:", errResueltas.message);
    return NextResponse.json({ error: errResueltas.message }, { status: 500 });
  }

  const { data: pendientes, error: errPendientes } = await supabase
    .from("solicitudes_consulta")
    .delete()
    .eq("status", "pendiente")
    .lt("created_at", cutoff48h)
    .select("id");

  if (errPendientes) {
    console.error("[cron] limpiar-sesiones solicitudes pendientes error:", errPendientes.message);
    return NextResponse.json({ error: errPendientes.message }, { status: 500 });
  }

  const eliminadas = data?.length ?? 0;
  const solicitudesResueltas = resueltas?.length ?? 0;
  const solicitudesPendientes = pendientes?.length ?? 0;
  console.log(
    `[cron] limpiar-sesiones: ${eliminadas} sesiones, ${solicitudesResueltas} solicitudes resueltas, ${solicitudesPendientes} solicitudes pendientes eliminadas`
  );
  return NextResponse.json({
    ok: true,
    eliminadas,
    solicitudesResueltas,
    solicitudesPendientes,
  });
}
