import { NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";
import { hasAccessToPaper } from "@/lib/entitlements";

// Returns a short-lived signed URL for the paper's PDF, after verifying
// the user has an active purchase covering the paper's package.
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
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
  const allowed = await hasAccessToPaper(user.id, id);
  if (!allowed) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { data: paper } = await supabase
    .from("exam_papers")
    .select("pdf_path")
    .eq("id", id)
    .single();
  if (!paper) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  // Use service client so the signed URL works regardless of bucket RLS.
  const admin = createSupabaseServiceClient();
  const { data: signed, error } = await admin.storage
    .from("exam-pdfs")
    .createSignedUrl(paper.pdf_path, 60 * 5);
  if (error || !signed) {
    return NextResponse.json({ error: "could not sign" }, { status: 500 });
  }
  return NextResponse.json({ url: signed.signedUrl });
}
