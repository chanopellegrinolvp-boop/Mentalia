import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { emailTurnoConfirmado, emailNuevoTurnoProfesional } from "@/lib/resend";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

function verifySignature(rawBody: string, header: string, secret: string): boolean {
  try {
    const parts = Object.fromEntries(header.split(",").map(p => p.split("=")));
    const timestamp = parts["t"];
    const signature = parts["v1"];
    if (!timestamp || !signature) return false;
    const toSign = `${timestamp}.${rawBody}`;
    const expected = crypto.createHmac("sha256", secret).update(toSign).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch { return false; }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sigHeader = req.headers.get("calendly-webhook-signature") ?? "";
  const secret = process.env.CALENDLY_WEBHOOK_SECRET;

  if (secret && sigHeader) {
    if (!verifySignature(rawBody, sigHeader, secret)) {
      return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
    }
  }

  let body: any;
  try { body = JSON.parse(rawBody); } catch { return NextResponse.json({ ok: true }); }

  const event = body.event;
  const payload = body.payload;
  if (!event || !payload) return NextResponse.json({ ok: true });

  const invitee = payload.invitee;
  const scheduledEvent = payload.event ?? payload.scheduled_event;

  if (!invitee || !scheduledEvent) return NextResponse.json({ ok: true });

  const inviteeEmail: string = invitee.email ?? "";
  const inviteeName: string = invitee.name ?? "Paciente";
  const startTime: string = scheduledEvent.start_time ?? scheduledEvent.start ?? "";
  const endTime: string = scheduledEvent.end_time ?? scheduledEvent.end ?? "";
  const schedulingUrl: string = scheduledEvent.event_type?.scheduling_url ?? scheduledEvent.location?.join_url ?? "";

  // Buscar el profesional por calendly_url
  const calendlyUser = schedulingUrl.match(/calendly\.com\/([^/]+)/)?.[1];
  let professionalId: string | null = null;
  let professionalEmail: string | null = null;
  let professionalName: string | null = null;

  if (calendlyUser) {
    const { data: pros } = await supabaseAdmin
      .from("professionals")
      .select("id, profiles!id(full_name, email)")
      .ilike("calendly_url", `%calendly.com/${calendlyUser}%`)
      .limit(1);
    if (pros?.[0]) {
      professionalId = pros[0].id;
      const prof = pros[0].profiles as any;
      professionalEmail = prof?.email ?? null;
      professionalName = prof?.full_name ?? "Profesional";
    }
  }

  // Buscar el paciente por email
  let patientId: string | null = null;
  let patientName = inviteeName;
  if (inviteeEmail) {
    const { data: patient } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name")
      .eq("email", inviteeEmail)
      .single();
    if (patient) { patientId = patient.id; patientName = patient.full_name ?? inviteeName; }
  }

  if (event === "invitee.created") {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);

    if (professionalId) {
      await supabaseAdmin.from("appointments").insert({
        professional_id: professionalId,
        patient_id: patientId,
        scheduled_at: startTime,
        duration_minutes: durationMinutes || 60,
        status: "confirmed",
        modality: "online",
        notes: `Reservado vía Calendly · ${inviteeEmail}`,
      });
    }

    // Emails de confirmación
    const fechaStr = startDate.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const horaStr = startDate.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

    if (inviteeEmail) {
      await emailTurnoConfirmado({
        to: inviteeEmail,
        pacienteName: patientName,
        profesionalName: professionalName ?? "tu profesional",
        fecha: fechaStr,
        hora: horaStr,
        modalidad: "Online",
      });
    }

    if (professionalEmail) {
      await emailNuevoTurnoProfesional({
        to: professionalEmail,
        profesionalName: professionalName ?? "Profesional",
        pacienteName: patientName,
        patieneEmail: inviteeEmail,
        fecha: fechaStr,
        hora: horaStr,
      });
    }
  }

  if (event === "invitee.canceled") {
    if (professionalId) {
      await supabaseAdmin
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("professional_id", professionalId)
        .eq("scheduled_at", startTime);
    }
  }

  return NextResponse.json({ ok: true });
}
