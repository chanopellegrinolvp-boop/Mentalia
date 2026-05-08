import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/");

  const [
    { data: totalUsers },
    { data: professionals },
    { data: recentUsers },
    { data: totalAppointments },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact" }),
    supabase.from("professionals").select("*, profiles!id(full_name, email, created_at)").order("created_at", { ascending: false }),
    supabase.from("profiles").select("full_name, email, role, created_at").order("created_at", { ascending: false }).limit(10),
    supabase.from("appointments").select("id", { count: "exact" }),
  ]);

  const stats = {
    totalUsers: totalUsers?.length ?? 0,
    totalPros: professionals?.length ?? 0,
    verifiedPros: professionals?.filter((p: any) => p.is_verified).length ?? 0,
    totalAppointments: totalAppointments?.length ?? 0,
  };

  return <AdminClient professionals={professionals ?? []} recentUsers={recentUsers ?? []} stats={stats} />;
}
