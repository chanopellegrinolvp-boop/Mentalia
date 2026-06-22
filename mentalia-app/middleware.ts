import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (host === "mentalia-app.vercel.app") {
    return NextResponse.redirect(
      `https://mentaliasalud.online${request.nextUrl.pathname}${request.nextUrl.search}`,
      { status: 301 }
    );
  }

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
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  const isProfRoute = path.startsWith("/dashboard/profesional");
  const isPacRoute = path.startsWith("/dashboard/paciente");

  if (user && (isProfRoute || isPacRoute)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // Sin perfil: usuario auth sin fila en profiles → evitar redirect loop
    if (!profile?.role) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isProfRoute && profile.role !== "professional") {
      return NextResponse.redirect(new URL("/dashboard/paciente", request.url));
    }
    if (isPacRoute && profile.role !== "patient") {
      return NextResponse.redirect(new URL("/dashboard/profesional", request.url));
    }

    // Trial enforcement: bloquea todas las rutas del profesional excepto pagos y perfil
    const trialExcluded = path.startsWith("/dashboard/profesional/pagos") || path.startsWith("/dashboard/profesional/perfil");
    if (isProfRoute && profile?.role === "professional" && !trialExcluded) {
      const { data: prof } = await supabase
        .from("professionals")
        .select("trial_ends_at")
        .eq("id", user.id)
        .single();

      // Sin fila en professionals → completar perfil
      if (!prof) {
        if (!path.startsWith("/dashboard/profesional/perfil")) {
          return NextResponse.redirect(new URL("/dashboard/profesional/perfil?setup=true", request.url));
        }
      } else {
        const trialExpired = prof.trial_ends_at && new Date(prof.trial_ends_at) < new Date();

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
