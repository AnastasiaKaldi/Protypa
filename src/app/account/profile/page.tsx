"use client";
import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { DOY_LIST } from "@/lib/doy-list";
import type { School } from "@/lib/types";

export default function ProfilePage() {
  const [school, setSchool] = useState<Partial<School>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setSchool(PREVIEW_SCHOOL); setIsPreview(true); setLoading(false); return; }
      const { data } = await supabase.from("schools").select("*").eq("id", user.id).maybeSingle();
      if (data) setSchool(data as School);
      setLoading(false);
    });
  }, []);

  function set<K extends keyof School>(key: K, val: School[K]) {
    setSchool((prev) => ({ ...prev, [key]: val }));
    setSaved(false);
  }

  function toggleSubject(s: string) {
    const current = (school.subjects as string[]) ?? [];
    set("subjects", current.includes(s) ? current.filter((x) => x !== s) : [...current, s]);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null); setSaved(false);
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error: err } = await supabase.from("schools").upsert({
      id: user.id,
      ...school,
    });

    setSaving(false);
    if (err) { setError(err.message); return; }

    // Mark onboarding complete if all required fields are present
    const required = ["legal_name", "trade_name", "afm", "doy", "city"] as const;
    const complete = required.every((k) => school[k]);
    if (complete) {
      await supabase.from("profiles").update({ onboarding_complete: true }).eq("id", user.id);
    }

    setSaved(true);
  }

  if (loading) return <div className="py-12 text-center text-ink/30 text-sm">Φόρτωση…</div>;

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <div className="text-xs text-ink/45">Ρυθμίσεις</div>
        <h1 className="font-display text-2xl text-ink mt-1">Προφίλ Φροντιστηρίου</h1>
        <p className="text-sm text-ink/55 mt-1">Συμπληρώστε τα στοιχεία για έκδοση παραστατικών και στατιστικά.</p>
      </div>

      {isPreview && (
        <div className="border-l-2 border-amber-500 bg-amber-50/60 px-4 py-3 text-sm text-amber-900">
          <strong className="font-semibold">Προεπισκόπηση:</strong> Δείγμα συμπληρωμένου προφίλ. Συνδεθείτε για να επεξεργαστείτε τα δικά σας στοιχεία.
        </div>
      )}

      <form onSubmit={save} className="space-y-8">
        {/* Company */}
        <Section title="Στοιχεία Εταιρείας" color="#056ef5">
          <Field label="Επωνυμία" value={school.legal_name ?? ""} onChange={(v) => set("legal_name", v)} placeholder="π.χ. Βασιλειάδης & ΣΙΑ ΟΕ" />
          <Field label="Διακριτικός τίτλος" value={school.trade_name ?? ""} onChange={(v) => set("trade_name", v)} placeholder="π.χ. Φροντιστήριο Πεδίο" />
          <div className="grid grid-cols-2 gap-5">
            <Field label="ΑΦΜ" value={school.afm ?? ""} onChange={(v) => set("afm", v)} placeholder="π.χ. 152998856" />
            <label className="block">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-ink/40">ΔΟΥ</span>
              <select
                value={school.doy ?? ""}
                onChange={(e) => set("doy", e.target.value)}
                className="mt-2 w-full bg-white border-0 border-b-2 border-ink/20 px-0 py-2.5 text-base font-display text-ink focus:outline-none focus:border-[#056ef5] transition-colors cursor-pointer"
              >
                <option value="">Επιλέξτε ΔΟΥ</option>
                {DOY_LIST.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </label>
          </div>
        </Section>

        {/* Address */}
        <Section title="Διεύθυνση" color="#7c00d0">
          <Field label="Οδός & αριθμός" value={school.address ?? ""} onChange={(v) => set("address", v)} placeholder="π.χ. Παπαδοπούλου 12" />
          <div className="grid grid-cols-2 gap-5">
            <Field label="Ταχ. κώδικας" value={school.postal_code ?? ""} onChange={(v) => set("postal_code", v)} placeholder="π.χ. 71201" />
            <Field label="Πόλη" value={school.city ?? ""} onChange={(v) => set("city", v)} placeholder="π.χ. Ηράκλειο" />
          </div>
          <Field label="Περιοχή / Νομός" value={school.region ?? ""} onChange={(v) => set("region", v)} placeholder="π.χ. Κρήτη" />
        </Section>

        {/* Contact */}
        <Section title="Επικοινωνία" color="#056ef5">
          <Field label="Τηλέφωνο φροντιστηρίου" value={school.phone ?? ""} onChange={(v) => set("phone", v)} type="tel" placeholder="π.χ. 2801711611" />
          <Field label="Email φροντιστηρίου" value={school.school_email ?? ""} onChange={(v) => set("school_email", v)} type="email" placeholder="info@frontistirio.gr" />
          <Field label="Υπεύθυνος επικοινωνίας" value={school.contact_person ?? ""} onChange={(v) => set("contact_person", v)} placeholder="π.χ. Γραμματεία" />
          <Field label="Κινητό υπευθύνου" value={school.mobile ?? ""} onChange={(v) => set("mobile", v)} type="tel" placeholder="π.χ. 6944525252" />
          <Field label="Email υπευθύνου" value={school.contact_email ?? ""} onChange={(v) => set("contact_email", v)} type="email" placeholder="manager@frontistirio.gr" />
        </Section>

        {/* Subjects */}
        <Section title="Μαθήματα" color="#7c00d0">
          <div className="space-y-3">
            {[
              { id: "greek", label: "Νέα Ελληνική Γλώσσα", icon: "✎" },
              { id: "math",  label: "Μαθηματικά",           icon: "∑" },
            ].map(({ id, label, icon }) => {
              const active = ((school.subjects as string[]) ?? []).includes(id);
              return (
                <button key={id} type="button" onClick={() => toggleSubject(id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    active ? "border-[#056ef5] bg-[#056ef5]/5" : "border-ink/10 hover:border-ink/30"
                  }`}>
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-display flex-shrink-0 ${active ? "bg-[#056ef5] text-white" : "bg-ink/5 text-ink/40"}`}>
                    {icon}
                  </span>
                  <span className="font-bold text-ink text-sm">{label}</span>
                  {active && <span className="ml-auto w-5 h-5 rounded-full bg-[#056ef5] text-white text-xs grid place-items-center">✓</span>}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Marketing email opt-in */}
        <Section title="Ενημερωτικά Emails">
          <button type="button"
            onClick={() => set("marketing_opt_in", !school.marketing_opt_in)}
            className={`w-full flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
              school.marketing_opt_in ? "border-[#056ef5] bg-[#056ef5]/5" : "border-ink/10 hover:border-ink/30"
            }`}>
            <span className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              school.marketing_opt_in ? "bg-[#056ef5] border-[#056ef5]" : "border-ink/30"
            }`}>
              {school.marketing_opt_in && <span className="text-white text-xs font-black">✓</span>}
            </span>
            <div>
              <div className="font-bold text-ink text-sm">Θέλω να λαμβάνω ενημερωτικά emails</div>
              <p className="mt-1 text-xs text-ink/55 leading-relaxed">
                Νέα θέματα διαγωνισμάτων, ανακοινώσεις και ενημερώσεις της πλατφόρμας — απευθείας στο email σας.
                Μπορείτε να αλλάξετε αυτή τη ρύθμιση ανά πάσα στιγμή από εδώ.
              </p>
            </div>
          </button>
        </Section>

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">{error}</p>}
        {saved && <p className="text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded-xl">✓ Οι αλλαγές αποθηκεύτηκαν.</p>}

        <button type="submit" disabled={saving}
          className="px-8 py-3 rounded-full bg-[#056ef5] text-white font-black uppercase tracking-wider text-sm hover:bg-[#0451b8] hover:-translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer">
          {saving ? "Αποθήκευση…" : "Αποθήκευση αλλαγών"}
        </button>
      </form>
    </div>
  );
}

function Section({ title, children, color = "#056ef5" }: { title: string; children: React.ReactNode; color?: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white overflow-hidden">
      <div className="px-6 pt-5">
        <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color }}>
          <span className="w-2 h-2 rounded-sm" style={{ background: color }} />
          {title}
        </div>
      </div>
      <div className="px-6 pb-6 pt-4 space-y-5">
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-ink/40">{label}</span>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full bg-transparent border-0 border-b-2 border-ink/20 px-0 py-2.5 text-base font-display text-ink placeholder:text-ink/25 focus:outline-none focus:border-[#056ef5] transition-colors"
      />
    </label>
  );
}

const PREVIEW_SCHOOL: Partial<School> = {
  legal_name: "Βασιλειάδης & ΣΙΑ ΟΕ",
  trade_name: "Φροντιστήριο Πεδίο",
  address: "Παπαδοπούλου 12",
  postal_code: "71201",
  city: "Ηράκλειο",
  region: "Κρήτη",
  phone: "2801711611",
  school_email: "info@pediofrontistirio.gr",
  contact_person: "Νίκος Παπαδόπουλος",
  mobile: "6944525252",
  contact_email: "nikos@pediofrontistirio.gr",
  afm: "152998856",
  doy: "ΗΡΑΚΛΕΙΟΥ",
  subjects: ["greek", "math"],
  marketing_opt_in: true,
};
