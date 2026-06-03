import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

// Handles both email-confirmation links and password-reset links.
// Supabase sends: GET /auth/callback?code=<pkce-code>&next=<destination>
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          },
        },
      },
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // If the URL specified a destination, honour it; otherwise route admins
      // to /admin and everyone else to /account.
      let destination = nextParam ?? "/account";
      if (!nextParam && data.user) {
        const { data: profile } = await supabase
          .from("profiles").select("is_admin").eq("id", data.user.id).maybeSingle();
        if (profile?.is_admin) destination = "/admin";
      }
      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  return NextResponse.redirect(`${origin}/signin?error=auth`);
}
