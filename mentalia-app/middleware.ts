import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Maintenance mode — bypass for /api routes, _next assets and /mantenimiento itself
  if (process.env.MAINTENANCE_MODE === "true") {
    // Allow developer bypass via cookie
    const bypassCookie = request.cookies.get("mentalia_bypass")?.value;
    const bypassParam = request.nextUrl.searchParams.get("bypass");

    if (bypassParam === "mentalia2026") {
      const res = NextResponse.next();
      res.cookies.set("mentalia_bypass", "mentalia2026", { maxAge: 60 * 60 * 24, path: "/" });
      return res;
    }

    const isAllowed =
      bypassCookie === "mentalia2026" ||
      path === "/mantenimiento" ||
      path.startsWith("/_next") ||
      path.startsWith("/api") ||
      path.startsWith("/.well-known") ||
      path === "/manifest.json" ||
      path === "/sw.js" ||
      path === "/favicon.ico" ||
      path.match(/\.(png|svg|ico|webp|jpg)$/);

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/mantenimiento", request.url));
    }
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect dashboard routes
  if (path.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect logged-in users away from auth pages
  if ((path === "/login" || path === "/registro") && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const dest = profile?.role === "professional" ? "/dashboard/profesional" : "/dashboard/paciente";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
