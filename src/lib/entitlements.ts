import { createSupabaseServerClient } from "./supabase/server";
import type { ExamPaper, Package, Purchase } from "./types";

// Single source of truth for "does this user have access to X right now?"
// Every protected page and API route MUST go through these helpers — no ad-hoc
// queries — so the rules stay consistent.

export interface ActivePackage {
  purchase: Purchase;
  pkg: Package;
}

export async function getActivePackages(
  userId: string,
): Promise<ActivePackage[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("purchases")
    .select("*, packages(*)")
    .eq("user_id", userId)
    .gt("expires_at", new Date().toISOString())
    .order("expires_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row: Purchase & { packages: Package }) => ({
    purchase: row,
    pkg: row.packages,
  }));
}

export async function getAccessiblePapers(
  userId: string,
): Promise<(ExamPaper & { package_name: string })[]> {
  const active = await getActivePackages(userId);
  if (active.length === 0) return [];
  const packageIds = active.map((a) => a.pkg.id);

  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("exam_papers")
    .select("*, packages(name_el)")
    .in("package_id", packageIds)
    .order("year", { ascending: false });

  if (error || !data) return [];
  return data.map(
    (row: ExamPaper & { packages: { name_el: string } }) => ({
      ...row,
      package_name: row.packages.name_el,
    }),
  );
}

export async function hasAccessToPaper(
  userId: string,
  paperId: string,
): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return false;
  const { data: paper } = await supabase
    .from("exam_papers")
    .select("package_id")
    .eq("id", paperId)
    .single();
  if (!paper) return false;

  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", userId)
    .eq("package_id", paper.package_id)
    .gt("expires_at", new Date().toISOString())
    .limit(1)
    .maybeSingle();

  return !!purchase;
}
