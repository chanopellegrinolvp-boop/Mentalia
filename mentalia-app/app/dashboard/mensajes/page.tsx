import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MensajesClient from "./MensajesClient";

export default async function MensajesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return <MensajesClient userId={user.id} />;
}
