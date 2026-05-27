"use client";
import { useState, useEffect, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Simulation } from "@/lib/types";

type FormState = {
  number: string; title: string; subject: string;
  exam_date: string; unlocks_at: string; grading_closes_at: string;
  greek_questions: string; math_questions: string; is_published: boolean;
  material_url: string; questions_url: string;
};

const EMPTY_FORM: FormState = {
  number: "", title: "", subject: "bundle",
  exam_date: "", unlocks_at: "", grading_closes_at: "",
  greek_questions: "20", math_questions: "20", is_published: false,
  material_url: "", questions_url: "",
};

export default function AdminSimulationsPage() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();
    const { data } = await supabase.from("simulations").select("*").order("number");
    setSimulations((data as Simulation[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function startEdit(sim: Simulation) {
    setEditId(sim.id);
    setForm({
      number: String(sim.number),
      title: sim.title,
      subject: sim.subject,
      exam_date: sim.exam_date?.slice(0, 10) ?? "",
      unlocks_at: sim.unlocks_at?.slice(0, 16) ?? "",
      grading_closes_at: sim.grading_closes_at?.slice(0, 16) ?? "",
      greek_questions: String(sim.greek_questions),
      math_questions: String(sim.math_questions),
      is_published: sim.is_published,
      material_url: sim.material_url ?? "",
      questions_url: sim.questions_url ?? "",
    });
    setShowForm(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null);
    const supabase = createSupabaseBrowserClient();
    const payload = {
      number: parseInt(form.number),
      title: form.title,
      subject: form.subject,
      exam_date: form.exam_date || null,
      unlocks_at: form.unlocks_at ? new Date(form.unlocks_at).toISOString() : null,
      grading_closes_at: form.grading_closes_at ? new Date(form.grading_closes_at).toISOString() : null,
      greek_questions: parseInt(form.greek_questions),
      math_questions: parseInt(form.math_questions),
      is_published: form.is_published,
      material_url: form.material_url || null,
      questions_url: form.questions_url || null,
    };
    const { error: err } = editId
      ? await supabase.from("simulations").update(payload).eq("id", editId)
      : await supabase.from("simulations").insert(payload);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setShowForm(false); setEditId(null); setForm(EMPTY_FORM);
    load();
  }

  async function seedTags(sim: Simulation) {
    const supabase = createSupabaseBrowserClient();
    await supabase.rpc("seed_default_question_tags", {
      sim_id: sim.id,
      greek_q: sim.greek_questions,
      math_q: sim.math_questions,
    });
    alert(`Κατηγορίες ερωτήσεων δημιουργήθηκαν για "${sim.title}"`);
  }

  async function togglePublish(sim: Simulation) {
    const supabase = createSupabaseBrowserClient();
    await supabase.from("simulations").update({ is_published: !sim.is_published }).eq("id", sim.id);
    load();
  }

  const subjectLabel = (s: string) => s === "greek" ? "Γλώσσα" : s === "math" ? "Μαθηματικά" : "Και τα δύο";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/30 mb-2">Admin</div>
          <h1 className="font-display text-3xl text-white">Προσομοιώσεις</h1>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }}
          className="px-5 py-2.5 rounded-full bg-[#056ef5] text-white font-black uppercase tracking-wider text-xs hover:bg-[#0451b8] transition-all cursor-pointer"
        >
          + Νέα Προσομοίωση
        </button>
      </div>

      {/* Create / Edit form */}
      {showForm && (
        <div className="rounded-2xl border border-[#056ef5]/40 bg-[#056ef5]/5 p-6">
          <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#056ef5] mb-5">
            {editId ? "Επεξεργασία Προσομοίωσης" : "Νέα Προσομοίωση"}
          </div>
          <form onSubmit={save} className="space-y-5">
            <div className="grid md:grid-cols-3 gap-5">
              <AdminField label="Αριθμός *" type="number" value={form.number} onChange={(v) => set("number", v)} required />
              <div className="md:col-span-2">
                <AdminField label="Τίτλος *" placeholder="π.χ. Προσομοίωση 1 · Νοέμβριος 2025"
                  value={form.title} onChange={(v) => set("title", v)} required />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <label className="block">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Μάθημα *</span>
                  <select value={form.subject} onChange={(e) => set("subject", e.target.value)}
                    className="mt-2 w-full bg-transparent border-0 border-b-2 border-white/20 px-0 py-2.5 text-sm text-white focus:outline-none focus:border-[#056ef5] transition-colors cursor-pointer">
                    <option value="bundle" className="bg-[#0a0a0f]">Και τα δύο</option>
                    <option value="greek"  className="bg-[#0a0a0f]">Ν. Γλώσσα</option>
                    <option value="math"   className="bg-[#0a0a0f]">Μαθηματικά</option>
                  </select>
                </label>
              </div>
              <AdminField label="Ερωτήσεις Γλώσσας" type="number" value={form.greek_questions} onChange={(v) => set("greek_questions", v)} />
              <AdminField label="Ερωτήσεις Μαθ/κών" type="number" value={form.math_questions} onChange={(v) => set("math_questions", v)} />
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              <AdminField label="Ημ/νία εξέτασης" type="date" value={form.exam_date} onChange={(v) => set("exam_date", v)} />
              <AdminField label="Ξεκλείδωμα" type="datetime-local" value={form.unlocks_at} onChange={(v) => set("unlocks_at", v)} />
              <AdminField label="Κλείσιμο βαθμολόγησης" type="datetime-local" value={form.grading_closes_at} onChange={(v) => set("grading_closes_at", v)} />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <AdminField label="URL Ύλης (PDF)" placeholder="https://..." value={form.material_url} onChange={(v) => set("material_url", v)} />
              <AdminField label="URL Θεμάτων (PDF)" placeholder="https://..." value={form.questions_url} onChange={(v) => set("questions_url", v)} />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${form.is_published ? "bg-[#c8ff00] border-[#c8ff00]" : "border-white/30"}`}
                onClick={() => set("is_published", !form.is_published)}>
                {form.is_published && <span className="text-ink text-xs font-black">✓</span>}
              </div>
              <span className="text-sm text-white/70">Δημοσιευμένο (ορατό σε χρήστες)</span>
            </label>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}
                className="px-5 py-2 rounded-full border border-white/20 text-white/50 text-sm font-bold hover:border-white/40 transition-colors cursor-pointer">
                Ακύρωση
              </button>
              <button type="submit" disabled={saving}
                className="px-6 py-2 rounded-full bg-[#056ef5] text-white font-black text-sm uppercase tracking-wider hover:bg-[#0451b8] transition-all disabled:opacity-50 cursor-pointer">
                {saving ? "Αποθήκευση…" : "Αποθήκευση"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Simulations list */}
      {loading ? (
        <div className="text-center py-12 text-white/30">Φόρτωση…</div>
      ) : simulations.length === 0 ? (
        <div className="rounded-2xl border border-white/10 p-12 text-center">
          <p className="text-white/30 text-sm">Δεν υπάρχουν Προσομοιώσεις ακόμα. Δημιουργήστε την πρώτη.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {simulations.map((sim) => (
            <div key={sim.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#056ef5]/20 text-[#056ef5] font-display text-lg grid place-items-center flex-shrink-0">
                {sim.number}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white">{sim.title}</div>
                <div className="text-xs text-white/40 mt-0.5 flex flex-wrap gap-3">
                  <span>{subjectLabel(sim.subject)}</span>
                  {sim.exam_date && <span>Εξέταση: {new Date(sim.exam_date).toLocaleDateString("el-GR")}</span>}
                  {sim.unlocks_at && <span>Ξεκλ.: {new Date(sim.unlocks_at).toLocaleDateString("el-GR")}</span>}
                  {sim.grading_closes_at && <span>Κλείσιμο: {new Date(sim.grading_closes_at).toLocaleDateString("el-GR")}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button onClick={() => togglePublish(sim)}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    sim.is_published
                      ? "border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                      : "border-white/20 text-white/40 hover:border-white/40"
                  }`}>
                  {sim.is_published ? "✓ Δημοσιευμένο" : "Μη δημοσ."}
                </button>
                <button onClick={() => seedTags(sim)}
                  className="text-[10px] font-bold px-3 py-1.5 rounded-full border border-[#c8ff00]/30 text-[#c8ff00]/70 hover:bg-[#c8ff00]/10 transition-all cursor-pointer"
                  title="Δημιουργία προεπιλεγμένων κατηγοριών ερωτήσεων">
                  Κατηγορίες
                </button>
                <button onClick={() => startEdit(sim)}
                  className="text-xs font-bold text-[#056ef5] hover:text-[#c8ff00] transition-colors cursor-pointer">
                  Επεξ. →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminField({ label, value, onChange, type = "text", placeholder, required = false }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">{label}</span>
      <input
        required={required} type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full bg-transparent border-0 border-b-2 border-white/20 px-0 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#056ef5] transition-colors"
      />
    </label>
  );
}
