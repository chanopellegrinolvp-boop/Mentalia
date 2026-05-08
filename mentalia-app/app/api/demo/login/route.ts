import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const siteUrl = "https://mentalia-app.vercel.app";
  const successUrl = `${siteUrl}/buscar`;
  const errorUrl = `${siteUrl}/demo?error=1`;

  // Crear el response de redirect ANTES de crear el cliente Supabase
  // para poder pasarle su propio cookie setter
  const response = NextResponse.redirect(successUrl);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Setear cookies directamente en el response de redirect
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({
    email: "demo@mentalia.com",
    password: "Demo1234!",
  });

  if (error) {
    return NextResponse.redirect(errorUrl);
  }

  return response;
}
