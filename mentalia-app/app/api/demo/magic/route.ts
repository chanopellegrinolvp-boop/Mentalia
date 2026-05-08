import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function GET(_request: NextRequest) {
  const siteUrl = "https://mentalia-app.vercel.app";

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email: "demo@mentalia.com",
    options: {
      redirectTo: `${siteUrl}/api/auth/callback`,
    },
  });

  if (error || !data?.properties?.action_link) {
    console.error("Demo magic link error:", error?.message);
    return NextResponse.redirect(`${siteUrl}/demo?error=1`);
  }

  return NextResponse.redirect(data.properties.action_link);
}
