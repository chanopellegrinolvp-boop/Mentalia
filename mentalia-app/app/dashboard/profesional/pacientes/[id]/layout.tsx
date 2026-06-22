import { redirect } from "next/navigation";

export default async function PacienteDetalleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (id === "null" || id === "undefined") {
    redirect("/dashboard/profesional/pacientes");
  }
  return <>{children}</>;
}
