import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// True iff Supabase env vars are configured. Lets pages render in a
// "not yet configured" mode during initial local setup instead of crashing.
export function isSupabaseConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Server-side Supabase client tied to Next.js cookies.
// Returns null if env vars are missing — callers must handle that case.
export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured()) return null;
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a server component — middleware will refresh cookies.
          }
        },
      },
    },
  );
}

// Service-role client. Bypasses RLS. Only call from trusted server code
// (webhooks, scoring API). Never expose to the browser.
import { createClient } from "@supabase/supabase-js";
export function createSupabaseServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
