import Link from "next/link";
import { redirect } from "next/navigation";
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from "@/lib/supabase/server";
import { hasAccessToPaper } from "@/lib/entitlements";
import { el } from "@/lib/i18n/el";
import type { Question } from "@/lib/types";
import { GradingClient } from "./GradingClient";

export default async function GradePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect(`/signin?next=/grade/${id}`);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/signin?next=/grade/${id}`);

  const allowed = await hasAccessToPaper(user.id, id);
  if (!allowed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-brand-dark">
          {el.grading.accessDenied}
        </h1>
        <Link
          href="/paketa"
          className="inline-block mt-6 px-5 py-2.5 rounded-md bg-brand text-white font-medium hover:bg-brand-dark"
        >
          {el.grading.accessDeniedCta}
        </Link>
      </div>
    );
  }

  const { data: paper } = await supabase
    .from("exam_papers")
    .select("*")
    .eq("id", id)
    .single();
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("paper_id", id)
    .order("number", { ascending: true });

  // Mint an initial signed URL server-side so the iframe loads immediately.
  // Client will refresh via /api/papers/[id]/pdf when needed.
  let pdfUrl: string | null = null;
  if (paper) {
    const admin = createSupabaseServiceClient();
    const { data: signed } = await admin.storage
      .from("exam-pdfs")
      .createSignedUrl(paper.pdf_path, 60 * 30);
    pdfUrl = signed?.signedUrl ?? null;
  }

  return (
    <GradingClient
      paperId={id}
      paperTitle={paper?.title_el ?? ""}
      pdfUrl={pdfUrl}
      questions={(questions as Question[]) ?? []}
    />
  );
}
