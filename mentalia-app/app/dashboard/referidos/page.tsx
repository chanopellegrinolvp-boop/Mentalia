import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ReferidosClient from "./ReferidosClient";

export default async function ReferidosPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: referrals }] = await Promise.all([
    supabase.from("profiles").select("referral_code, full_name").eq("id", user.id).single(),
    supabase.from("referrals").select("referred_id, created_at, profiles!referred_id(full_name)").eq("referrer_id", user.id),
  ]);

  return (
    <ReferidosClient
      referralCode={profile?.referral_code ?? ""}
      referrals={referrals ?? []}
      userName={profile?.full_name ?? ""}
    />
  );
}
