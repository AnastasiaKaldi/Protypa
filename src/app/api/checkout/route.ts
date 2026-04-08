import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { package_id } = await req.json();
  if (!package_id) {
    return NextResponse.json({ error: "missing package_id" }, { status: 400 });
  }

  const { data: pkg } = await supabase
    .from("packages")
    .select("*")
    .eq("id", package_id)
    .single();
  if (!pkg) {
    return NextResponse.json({ error: "package not found" }, { status: 404 });
  }

  const origin = req.headers.get("origin") ?? "http://localhost:3000";
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    locale: "el",
    customer_email: user.email,
    line_items: [{ price: pkg.stripe_price_id, quantity: 1 }],
    success_url: `${origin}/account?purchase=success`,
    cancel_url: `${origin}/paketa`,
    metadata: {
      user_id: user.id,
      package_id: pkg.id,
      duration_days: String(pkg.duration_days),
    },
  });

  return NextResponse.json({ url: session.url });
}
