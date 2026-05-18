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
