import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const protectedPrefixes = ["/dashboard", "/sesion", "/videollamada"];
  const isProtected = protectedPrefixes.some(p => path.startsWith(p));

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isProfRoute = path.startsWith("/dashboard/profesional");
  const isPacRoute = path.startsWith("/dashboard/paciente");

  if (user && (isProfRoute || isPacRoute)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (isProfRoute && profile?.role !== "professional") {
      return NextResponse.redirect(new URL("/dashboard/paciente", request.url));
    }
    if (isPacRoute && profile?.role !== "patient") {
      return NextResponse.redirect(new URL("/dashboard/profesional", request.url));
    }

    // Trial enforcement: solo para profesionales fuera de la página de pagos
    if (isProfRoute && profile?.role === "professional" && !path.startsWith("/dashboard/profesional/pagos")) {
      const { data: prof } = await supabase
        .from("professionals")
        .select("trial_ends_at")
        .eq("id", user.id)
        .single();

      const trialExpired = prof?.trial_ends_at && new Date(prof.trial_ends_at) < new Date();

      if (trialExpired) {
        const cutoff = new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString();
        const { count } = await supabase
          .from("payments")
          .select("*", { count: "exact", head: true })
          .eq("professional_id", user.id)
          .eq("status", "paid")
          .gte("paid_at", cutoff);

        if (!count) {
          return NextResponse.redirect(new URL("/dashboard/profesional/pagos?trial_expired=true", request.url));
        }
      }
    }
  }

  if ((path === "/login" || path === "/registro") && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const dest = profile?.role === "patient" ? "/dashboard/paciente" : "/dashboard/profesional";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest\\.json|sw\\.js|.*\\.png$|.*\\.ico$|.*\\.svg$).*)"],
};
