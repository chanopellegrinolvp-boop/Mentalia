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

  const cutoff = new Date().toISOString();

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

  const eliminadas = data?.length ?? 0;
  console.log(`[cron] limpiar-sesiones: ${eliminadas} sesiones eliminadas`);
  return NextResponse.json({ ok: true, eliminadas });
}
