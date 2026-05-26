"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { computeScore, pointsForQuestion } from "@/lib/scoring";
import type { Simulation, SchoolSimulation, StudentSimulationGrade, Student, SimulationQuestionTag } from "@/lib/types";

interface Props {
  simulation: Simulation;
  participation: SchoolSimulation | null;
  students: Student[];
  existingGrades: StudentSimulationGrade[];
  tags: SimulationQuestionTag[];
  schoolSimulationId: string | null;
  userId: string;
}

export default function GradingSheet({ simulation, participation, students, existingGrades, tags, schoolSimulationId, userId }: Props) {
  const router = useRouter();
  const total = simulation.greek_questions + simulation.math_questions;

  // ── Step: select participating students ──────────────────────────────────
  const alreadyGraded = new Set(existingGrades.map((g) => g.student_id));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(existingGrades.map((g) => g.student_id).concat(
      participation?.is_submitted ? [] : []
    ))
  );
  const [step, setStep] = useState<"select" | "grade" | "done">(
    participation?.is_submitted ? "done" : existingGrades.length > 0 ? "grade" : "select"
  );

  // ── Grading state: wrong[studentId][questionIndex (0-based)] = bool ──────
  const buildInitial = useCallback(() => {
    const map: Record<string, boolean[]> = {};
    for (const sid of selectedIds) {
      const grade = existingGrades.find((g) => g.student_id === sid);
      map[sid] = Array.from({ length: total }, (_, qi) =>
        grade ? grade.wrong_questions.includes(qi + 1) : false
      );
    }
    return map;
  }, [selectedIds, existingGrades, total]);

  const [wrong, setWrong] = useState<Record<string, boolean[]>>(buildInitial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ssId, setSsId] = useState<string | null>(schoolSimulationId);

  function toggleCell(studentId: string, qi: number) {
    setWrong((prev) => {
      const row = [...(prev[studentId] ?? Array(total).fill(false))];
      row[qi] = !row[qi];
      return { ...prev, [studentId]: row };
    });
  }

  function score(studentId: string) {
    const row = wrong[studentId] ?? Array(total).fill(false);
    const wrongQs: number[] = [];
    row.forEach((isWrong, i) => { if (isWrong) wrongQs.push(i + 1); });
    return computeScore(wrongQs);
  }

  function wrongCount(studentId: string) {
    return (wrong[studentId] ?? []).filter(Boolean).length;
  }

  // Preview pages pass userId="preview" and a non-UUID schoolSimulationId.
  // In that mode we skip all DB calls and just simulate the state transitions.
  const isPreview = userId === "preview";

  // ── Confirm student selection ─────────────────────────────────────────────
  async function confirmSelection() {
    if (selectedIds.size === 0) { setError("Επιλέξτε τουλάχιστον έναν μαθητή."); return; }
    setSaving(true); setError(null);

    if (!isPreview) {
      const supabase = createSupabaseBrowserClient();
      let id = ssId;
      if (!id) {
        const { data, error: err } = await supabase.from("school_simulations").insert({
          school_id: userId, simulation_id: simulation.id, student_count: selectedIds.size,
        }).select("id").single();
        if (err) { setError(err.message); setSaving(false); return; }
        id = data.id;
        setSsId(id);
      } else {
        await supabase.from("school_simulations").update({ student_count: selectedIds.size }).eq("id", id);
      }
    }

    const initial: Record<string, boolean[]> = {};
    for (const sid of selectedIds) {
      const grade = existingGrades.find((g) => g.student_id === sid);
      initial[sid] = Array.from({ length: total }, (_, qi) =>
        grade ? grade.wrong_questions.includes(qi + 1) : false
      );
    }
    setWrong(initial);
    setStep("grade");
    setSaving(false);
    if (!isPreview) router.refresh();
  }

  // ── Submit grades ─────────────────────────────────────────────────────────
  async function submit() {
    setSaving(true); setError(null);

    if (isPreview) {
      // Simulate save + transition to done state
      setTimeout(() => { setStep("done"); setSaving(false); }, 300);
      return;
    }

    if (!ssId) { setError("Σφάλμα: δεν βρέθηκε η συμμετοχή."); setSaving(false); return; }
    const supabase = createSupabaseBrowserClient();

    for (const studentId of selectedIds) {
      const wrongQs = (wrong[studentId] ?? []).map((w, qi) => w ? qi + 1 : null).filter(Boolean) as number[];
      const { error: err } = await supabase.from("student_simulation_grades").upsert({
        student_id: studentId,
        simulation_id: simulation.id,
        school_simulation_id: ssId,
        wrong_questions: wrongQs,
        score: score(studentId),
      }, { onConflict: "student_id,simulation_id" });
      if (err) { setError(err.message); setSaving(false); return; }
    }

    await supabase.from("school_simulations").update({
      is_submitted: true, submitted_at: new Date().toISOString(), student_count: selectedIds.size,
    }).eq("id", ssId);

    setStep("done");
    setSaving(false);
    router.refresh();
  }

  const activeStudents = students.filter((s) => selectedIds.has(s.id));

  // ── Done state ────────────────────────────────────────────────────────────
  if (step === "done") {
    const graded = students.filter((s) => alreadyGraded.has(s.id) || selectedIds.has(s.id));
    const avg = graded.length ? Math.round(graded.reduce((a, s) => a + score(s.id), 0) / graded.length) : 0;
    return (
      <div className="space-y-6">
        <div className="rounded-3xl bg-green-50 border border-green-200 p-8 text-center">
          <div className="font-display text-5xl text-green-500">✓</div>
          <h2 className="mt-4 font-display text-2xl text-ink">Η βαθμολόγηση υποβλήθηκε!</h2>
          <p className="mt-2 text-sm text-ink/50">Τα αποτελέσματα αποθηκεύτηκαν. Δείτε λεπτομέρειες στο προφίλ κάθε μαθητή.</p>
        </div>
        <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-ink/40 mb-3">Αποτελέσματα</div>
        <div className="rounded-2xl border border-ink/10 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-[#fafaf8]">
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-wider uppercase text-ink/40">Μαθητής</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-wider uppercase text-ink/40 hidden sm:table-cell">Τάξη</th>
                <th className="text-center px-5 py-3 text-[10px] font-bold tracking-wider uppercase text-ink/40">Βαθμός</th>
                <th className="text-center px-5 py-3 text-[10px] font-bold tracking-wider uppercase text-ink/40">Λάθος</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {graded
                .sort((a, b) => score(b.id) - score(a.id))
                .map((s, i) => {
                  const sc = score(s.id);
                  const rank = i + 1;
                  return (
                    <tr key={s.id} className={i % 2 === 0 ? "bg-white" : "bg-[#fafaf8]"}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-ink/20 w-5 text-right">#{rank}</span>
                          <span className="font-medium text-ink">{s.last_name} {s.first_name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-ink/40 text-xs hidden sm:table-cell">{s.class_year ?? "—"}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`font-display text-xl font-black ${sc >= 75 ? "text-green-600" : sc >= 50 ? "text-yellow-600" : "text-red-600"}`}>{sc}</span>
                      </td>
                      <td className="px-5 py-3.5 text-center text-sm text-ink/50">{wrongCount(s.id)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <Link href={`/account/students/${s.id}`} className="text-xs font-bold text-[#056ef5] hover:text-[#7c00d0] transition-colors">Προφίλ →</Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-ink/10 bg-[#fafaf8]">
                <td className="px-5 py-3 font-bold text-ink text-sm" colSpan={2}>Μέσος όρος τμήματος</td>
                <td className="px-5 py-3 text-center font-display text-xl font-black text-[#056ef5]">{avg}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }

  // ── Select students ───────────────────────────────────────────────────────
  if (step === "select") {
    if (students.length === 0) {
      return (
        <div className="rounded-3xl border-2 border-dashed border-ink/10 p-12 text-center">
          <div className="font-display text-5xl text-ink/10 mb-4">👤</div>
          <h2 className="font-display text-xl text-ink">Δεν υπάρχουν μαθητές</h2>
          <p className="mt-2 text-sm text-ink/50 max-w-xs mx-auto leading-relaxed">
            Πρέπει να προσθέσετε μαθητές στον κατάλογό σας πριν βαθμολογήσετε.
          </p>
          <Link href="/account/students"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-[#056ef5] text-white font-black uppercase tracking-wider text-xs hover:bg-[#0451b8] transition-all">
            Προσθήκη μαθητών →
          </Link>
        </div>
      );
    }
    return (
      <div className="space-y-6 max-w-lg">
        <div>
          <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-ink/40 mb-2">Βήμα 1 από 2</div>
          <h2 className="font-display text-2xl text-ink">Ποιοι μαθητές συμμετείχαν;</h2>
          <p className="mt-1 text-sm text-ink/50">Επιλέξτε τους μαθητές που έκαναν αυτή την Προσομοίωση.</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white overflow-hidden">
          {/* Select all */}
          <label className="flex items-center gap-3 px-5 py-3.5 border-b border-ink/10 bg-[#fafaf8] cursor-pointer hover:bg-ink/5 transition-colors">
            <Checkbox
              checked={selectedIds.size === students.length}
              indeterminate={selectedIds.size > 0 && selectedIds.size < students.length}
              onChange={() => setSelectedIds(selectedIds.size === students.length ? new Set() : new Set(students.map((s) => s.id)))}
            />
            <span className="text-sm font-bold text-ink">Επιλογή όλων ({students.length})</span>
          </label>
          {students.map((s) => (
            <label key={s.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-ink/5 last:border-0 cursor-pointer hover:bg-[#fafaf8] transition-colors">
              <Checkbox
                checked={selectedIds.has(s.id)}
                onChange={() => {
                  const next = new Set(selectedIds);
                  next.has(s.id) ? next.delete(s.id) : next.add(s.id);
                  setSelectedIds(next);
                  setError(null);
                }}
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-ink">{s.last_name} {s.first_name}</span>
                {s.class_year && <span className="text-xs text-ink/40 ml-2">{s.class_year}</span>}
              </div>
            </label>
          ))}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button onClick={confirmSelection} disabled={saving || selectedIds.size === 0}
          className="w-full px-6 py-3 rounded-full bg-[#056ef5] text-white font-black uppercase tracking-wider text-sm hover:bg-[#0451b8] transition-all disabled:opacity-50 cursor-pointer">
          {saving ? "…" : `Έναρξη βαθμολόγησης (${selectedIds.size} μαθητές) →`}
        </button>
      </div>
    );
  }

  // ── Grading grid ─────────────────────────────────────────────────────────
  const COL_SECTION = 28;   // px — rotated label column
  const COL_Q      = 52;    // px — question number column
  const COL_STUDENT = 56;   // px — per-student column

  return (
    <div className="space-y-5" translate="no">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-xs text-ink/50">
          {activeStudents.length} μαθητές · {total} ερωτήσεις ·{" "}
          <button onClick={() => setStep("select")} className="text-[#056ef5] hover:underline cursor-pointer">
            αλλαγή επιλογής
          </button>
        </div>
        <button onClick={submit} disabled={saving}
          className="px-6 py-2.5 rounded-full bg-[#056ef5] text-white font-black uppercase tracking-wider text-sm hover:bg-[#0451b8] hover:-translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer">
          {saving ? "Αποθήκευση…" : "Υποβολή →"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">{error}</p>}

      {/* The spreadsheet — width:100% fills container when few students; min-width keeps cell sizes when many */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
        <table
          className="border-collapse w-full"
          style={{ minWidth: COL_SECTION + COL_Q + activeStudents.length * COL_STUDENT }}
        >
          {/* ── Header row ─────────────────────────────────── */}
          <thead>
            <tr>
              {/* section-label placeholder */}
              <th style={{ width: COL_SECTION }} className="border border-gray-200 bg-[#e8f5e3]" />
              {/* question col */}
              <th
                style={{ width: COL_Q, position: "sticky", left: COL_SECTION, zIndex: 20 }}
                className="border border-gray-200 bg-[#e8f5e3] px-2 py-2 text-center text-[9px] font-black tracking-widest uppercase text-gray-500"
              >
                Ερωτ.
              </th>
              {/* student cols */}
              {activeStudents.map((s) => (
                <th
                  key={s.id}
                  style={{ width: COL_STUDENT }}
                  className="border border-gray-200 bg-[#e8f5e3] px-1 py-2 text-center"
                >
                  <Link
                    href={`/account/students/${s.id}`}
                    className="block text-[9px] font-black leading-tight text-gray-600 hover:text-[#056ef5] transition-colors"
                    title={`${s.last_name} ${s.first_name}`}
                  >
                    <div className="truncate" style={{ maxWidth: COL_STUDENT - 8 }}>{s.last_name}</div>
                    <div className="truncate text-gray-400 font-medium" style={{ maxWidth: COL_STUDENT - 8 }}>{s.first_name}</div>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* ── Ν. ΓΛΩΣΣΑ section ──────────────────────────── */}
            {Array.from({ length: simulation.greek_questions }, (_, qi) => (
              <tr key={qi}>
                {/* Rotated section label — only on first row */}
                {qi === 0 && (
                  <td
                    rowSpan={simulation.greek_questions}
                    style={{ width: COL_SECTION, writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    className="border border-gray-200 bg-[#fef3c7] text-center text-[9px] font-black tracking-[0.3em] uppercase text-amber-700 select-none py-2"
                  >
                    Ν. ΓΛΩΣΣΑ
                  </td>
                )}
                {/* Question number + point value */}
                <td
                  style={{ width: COL_Q, position: "sticky", left: COL_SECTION, zIndex: 10 }}
                  className="border border-gray-200 bg-[#fffbeb] text-center py-0 leading-none"
                >
                  <div className="text-[10px] font-bold text-gray-600">Ε{qi + 1}</div>
                  <div className="text-[8px] text-gray-400 mt-0.5">{pointsForQuestion(qi + 1)}β</div>
                </td>
                {/* Student cells */}
                {activeStudents.map((s) => {
                  const isWrong = wrong[s.id]?.[qi] ?? false;
                  return (
                    <td
                      key={s.id}
                      style={{ width: COL_STUDENT, height: 28 }}
                      className="border border-gray-200 bg-[#fffdf5] text-center p-0"
                    >
                      <button
                        onClick={() => toggleCell(s.id, qi)}
                        style={{ width: "100%", height: 28 }}
                        className={`text-xs font-black transition-colors cursor-pointer select-none ${
                          isWrong
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "text-transparent hover:bg-amber-50 hover:text-amber-300"
                        }`}
                      >
                        ✕
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* ── ΜΑΘΗΜΑΤΙΚΑ section ─────────────────────────── */}
            {Array.from({ length: simulation.math_questions }, (_, qi) => {
              const absQi = simulation.greek_questions + qi;
              return (
                <tr key={absQi}>
                  {qi === 0 && (
                    <td
                      rowSpan={simulation.math_questions}
                      style={{ width: COL_SECTION, writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                      className="border border-gray-200 bg-[#dbeafe] text-center text-[9px] font-black tracking-[0.3em] uppercase text-blue-700 select-none py-2"
                    >
                      ΜΑΘΗΜΑΤΙΚΑ
                    </td>
                  )}
                  <td
                    style={{ width: COL_Q, position: "sticky", left: COL_SECTION, zIndex: 10 }}
                    className="border border-gray-200 bg-[#eff6ff] text-center py-0 leading-none"
                  >
                    <div className="text-[10px] font-bold text-gray-600">Ε{absQi + 1}</div>
                    <div className="text-[8px] text-gray-400 mt-0.5">{pointsForQuestion(absQi + 1)}β</div>
                  </td>
                  {activeStudents.map((s) => {
                    const isWrong = wrong[s.id]?.[absQi] ?? false;
                    return (
                      <td
                        key={s.id}
                        style={{ width: COL_STUDENT, height: 28 }}
                        className="border border-gray-200 bg-[#f5f8ff] text-center p-0"
                      >
                        <button
                          onClick={() => toggleCell(s.id, absQi)}
                          style={{ width: "100%", height: 28 }}
                          className={`text-xs font-black transition-colors cursor-pointer select-none ${
                            isWrong
                              ? "bg-red-100 text-red-600 hover:bg-red-200"
                              : "text-transparent hover:bg-blue-50 hover:text-blue-300"
                          }`}
                        >
                          ✕
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* ── Score row ──────────────────────────────────── */}
            <tr>
              <td
                colSpan={2}
                style={{ position: "sticky", left: 0, zIndex: 10 }}
                className="border border-gray-300 bg-[#1a3a2a] px-3 py-2.5 text-[9px] font-black tracking-[0.25em] uppercase text-white/80"
              >
                ΤΕΛΙΚΟΣ ΒΑΘΜΟΣ
              </td>
              {activeStudents.map((s) => {
                const sc = score(s.id);
                return (
                  <td key={s.id} className="border border-gray-300 bg-[#1a3a2a] text-center py-2">
                    <div className={`text-base font-black tabular-nums ${
                      sc >= 75 ? "text-[#c8ff00]" : sc >= 50 ? "text-yellow-300" : "text-red-400"
                    }`}>
                      {sc}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-xs text-ink/30 text-center">
        Κλικ σε κελί για να σημειώσετε λάθος · βαθμός = (σωστές / {total}) × 100
      </p>
    </div>
  );
}

function Checkbox({ checked, indeterminate = false, onChange }: { checked: boolean; indeterminate?: boolean; onChange: () => void }) {
  return (
    <div onClick={onChange}
      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-all ${
        checked || indeterminate ? "bg-[#056ef5] border-[#056ef5]" : "border-ink/25 hover:border-[#056ef5]"
      }`}>
      {checked && <span className="text-white text-xs font-black leading-none">✓</span>}
      {!checked && indeterminate && <span className="text-white text-xs font-black leading-none">–</span>}
    </div>
  );
}
