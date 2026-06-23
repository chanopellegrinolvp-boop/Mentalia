import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const statusLabel: Record<string, string> = {
  paid: "Cobrado",
  approved: "Aprobado",
  pending: "Pendiente",
  failed: "Fallido",
  refunded: "Reembolsado",
};

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

export async function GET(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "professional")
    return NextResponse.json({ error: "Solo profesionales" }, { status: 403 });

  const mes = req.nextUrl.searchParams.get("mes");
  if (!mes || !/^\d{4}-\d{2}$/.test(mes))
    return NextResponse.json({ error: "Parámetro mes inválido (formato: YYYY-MM)" }, { status: 400 });

  const [year, monthStr] = mes.split("-");
  const start = new Date(parseInt(year), parseInt(monthStr) - 1, 1).toISOString();
  const end = new Date(parseInt(year), parseInt(monthStr), 1).toISOString();
  const mesLabel = new Date(parseInt(year), parseInt(monthStr) - 1, 1)
    .toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  const { data: pagos } = await supabaseAdmin
    .from("payments")
    .select("amount, status, paid_at, created_at, profiles(full_name, email)")
    .eq("professional_id", user.id)
    .gte("created_at", start)
    .lt("created_at", end)
    .order("created_at", { ascending: true });

  const total = (pagos ?? [])
    .filter(p => p.status === "paid" || p.status === "approved")
    .reduce((acc, p) => acc + Number(p.amount), 0);

  const doc = new PDFDocument({ margin: 50, size: "A4" });
  const chunks: Buffer[] = [];

  await new Promise<void>((resolve, reject) => {
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", resolve);
    doc.on("error", reject);

    // Encabezado
    doc.font("Helvetica-Bold").fontSize(18).fillColor("#40916C").text("Mentalia", 50, 50);
    doc.font("Helvetica").fontSize(11).fillColor("#374151")
      .text("Resumen de Cobros", 50, 75);
    doc.font("Helvetica").fontSize(10).fillColor("#6B7280")
      .text(`Profesional: ${profile?.full_name ?? user.email ?? "—"}`, 50, 95)
      .text(`Período: ${mesLabel}`, 50, 110);

    // Línea separadora
    doc.moveTo(50, 135).lineTo(545, 135).strokeColor("#E5E7EB").lineWidth(1).stroke();

    // Cabecera tabla
    let y = 150;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#374151");
    doc.text("Fecha", 50, y);
    doc.text("Paciente", 160, y);
    doc.text("Monto", 370, y, { width: 80, align: "right" });
    doc.text("Estado", 460, y);
    y += 6;

    doc.moveTo(50, y + 8).lineTo(545, y + 8).strokeColor("#E5E7EB").stroke();
    y += 18;

    // Filas
    doc.font("Helvetica").fontSize(9).fillColor("#374151");
    for (const p of pagos ?? []) {
      if (y > 760) {
        doc.addPage();
        y = 50;
      }
      const paciente = (() => {
        const pr = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
        const name = pr?.full_name ?? pr?.email ?? "—";
        return name.length > 26 ? name.substring(0, 24) + "…" : name;
      })();
      const monto = Number(p.amount).toLocaleString("es-AR", {
        style: "currency", currency: "ARS", maximumFractionDigits: 0,
      });
      const estado = statusLabel[p.status] ?? p.status;
      const fecha = formatFecha(p.paid_at ?? p.created_at);

      doc.text(fecha, 50, y);
      doc.text(paciente, 160, y);
      doc.text(monto, 370, y, { width: 80, align: "right" });
      doc.text(estado, 460, y);
      y += 18;
    }

    if ((pagos ?? []).length === 0) {
      doc.font("Helvetica").fontSize(10).fillColor("#9CA3AF")
        .text("No hay cobros registrados en este período.", 50, y);
      y += 20;
    }

    // Total
    y += 8;
    doc.moveTo(50, y).lineTo(545, y).strokeColor("#E5E7EB").stroke();
    y += 12;
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#374151")
      .text("Total cobrado:", 300, y)
      .text(total.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }), 370, y, { width: 80, align: "right" });

    // Pie
    doc.font("Helvetica").fontSize(8).fillColor("#9CA3AF")
      .text(
        "Este documento es un resumen interno. No constituye factura ni comprobante fiscal.",
        50, 800, { width: 495, align: "center" }
      );

    doc.end();
  });

  const pdfBuffer = Buffer.concat(chunks);
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="mentalia-cobros-${mes}.pdf"`,
    },
  });
}
