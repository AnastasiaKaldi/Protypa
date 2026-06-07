"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { DOY_LIST } from "@/lib/doy-list";

type AccountType = "school" | "parent";

// ─── Step lists per account type ─────────────────────────────────────────────
const SCHOOL_STEPS = [
  { number: 1, label: "Εσείς",           hint: "Στοιχεία υπευθύνου" },
  { number: 2, label: "Το Φροντιστήριο", hint: "Στοιχεία & διεύθυνση" },
  { number: 3, label: "Φορολογικά",      hint: "ΑΦΜ & ΔΟΥ" },
  { number: 4, label: "Όροι χρήσης",     hint: "Αποδοχή & ολοκλήρωση" },
];

const PARENT_STEPS = [
  { number: 1, label: "Στοιχεία",     hint: "Τα στοιχεία σας" },
  { number: 2, label: "Όροι χρήσης", hint: "Αποδοχή & ολοκλήρωση" },
];

// ─── Form shape (both flows share it; parent flow leaves school-only fields blank) ─
type FormData = {
  // Parent / contact person
  first_name: string;       // parent flow only
  last_name: string;        // parent flow only
  contact_person: string;
  mobile: string;
  contact_email: string;
  // School
  trade_name: string;
  legal_name: string;
  address: string;
  postal_code: string;
  city: string;
  region: string;
  phone: string;
  school_email: string;
  // Tax
  afm: string;
  doy: string;
  // Legal
  terms: boolean;
  marketing_opt_in: boolean;
};

const EMPTY: FormData = {
  first_name: "", last_name: "",
  contact_person: "", mobile: "", contact_email: "",
  trade_name: "", legal_name: "",
  address: "", postal_code: "", city: "", region: "",
  phone: "", school_email: "",
  afm: "", doy: "",
  terms: false,
  marketing_opt_in: false,
};

// ─── Page ────────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>("school");
  const [bootstrapping, setBootstrapping] = useState(true);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Read account_type from the user's profile so we know which flow to render.
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/signin"); return; }
      const { data: profile } = await supabase
        .from("profiles")
        .select("account_type")
        .eq("id", user.id)
        .maybeSingle();
      setAccountType((profile?.account_type as AccountType | undefined) ?? "school");
      setBootstrapping(false);
    });
  }, [router]);

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function finish() {
    setSaving(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/signin"); return; }

    // For parents we store the combined name in contact_person / legal_name /
    // trade_name so invoicing fields are populated. School-only fields stay null.
    const isParent = accountType === "parent";
    const combinedName = `${form.first_name} ${form.last_name}`.trim();

    const payload = isParent
      ? {
          id: user.id,
          contact_person: combinedName,
          contact_email: form.contact_email,
          mobile: form.mobile,
          // Reuse for billing — sole-trader invoicing wants a name in legal_name.
          legal_name: combinedName,
          trade_name: combinedName,
          address: form.address,
          afm: form.afm,
          terms_accepted_at: new Date().toISOString(),
          marketing_opt_in: form.marketing_opt_in,
        }
      : {
          id: user.id,
          legal_name: form.legal_name,
          trade_name: form.trade_name,
          address: form.address,
          postal_code: form.postal_code,
          city: form.city,
          region: form.region,
          phone: form.phone,
          school_email: form.school_email,
          contact_person: form.contact_person,
          mobile: form.mobile,
          contact_email: form.contact_email,
          afm: form.afm,
          doy: form.doy,
          terms_accepted_at: new Date().toISOString(),
          marketing_opt_in: form.marketing_opt_in,
        };

    const { error: schoolErr } = await supabase.from("schools").upsert(payload);
    if (schoolErr) { setError(schoolErr.message); setSaving(false); return; }

    await supabase.from("profiles").update({ onboarding_complete: true }).eq("id", user.id);
    router.push("/account");
    router.refresh();
  }

  if (bootstrapping) {
    return <div className="min-h-screen grid place-items-center text-ink/40 text-sm">Φόρτωση…</div>;
  }

  const isParent = accountType === "parent";
  const steps = isParent ? PARENT_STEPS : SCHOOL_STEPS;
  const panelColor = isParent
    ? (step === 1 ? "#7c00d0" : "#056ef5")
    : ["#056ef5", "#7c00d0", "#056ef5", "#7c00d0"][step - 1];

  return (
    <div className="min-h-screen grid md:grid-cols-[1fr_1.2fr]">
      {/* ── Left brand panel ── */}
      <div
        className="hidden md:flex flex-col justify-between p-10 relative overflow-hidden"
        style={{ backgroundColor: panelColor }}
      >
        <img src="/Logos/mainLogo.png" alt="Protupa" className="h-8 w-auto" />

        <div className="relative z-10 space-y-4">
          {steps.map((s) => (
            <div key={s.number} className="flex items-center gap-4">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-all
                ${step > s.number   ? "bg-[#c8ff00] text-ink" : ""}
                ${step === s.number ? "bg-white text-ink ring-4 ring-white/30" : ""}
                ${step < s.number   ? "bg-white/20 text-white/50" : ""}
              `}>
                {step > s.number ? "✓" : s.number}
              </div>
              <div className={step >= s.number ? "text-white" : "text-white/40"}>
                <div className="text-sm font-bold leading-none">{s.label}</div>
                <div className="text-xs mt-0.5 opacity-70">{s.hint}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-white/30 text-xs">© {new Date().getFullYear()} Protupa</div>
        <img src="/TransparentAssets/Asset 13.png" alt="" aria-hidden="true"
          className="pointer-events-none select-none absolute top-6 right-6 w-36 opacity-50 rotate-6" />
      </div>

      {/* ── Right form panel ── */}
      <div className="flex items-center justify-center px-6 py-14 bg-white min-h-screen">
        <div className="w-full max-w-md">
          {/* Mobile progress bar */}
          <div className="md:hidden flex gap-1 mb-8">
            {steps.map((s) => (
              <div key={s.number} className={`h-1 flex-1 rounded-full transition-all ${step >= s.number ? "bg-[#056ef5]" : "bg-ink/10"}`} />
            ))}
          </div>

          <div className="mb-8">
            <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-ink/40 mb-2">
              Βήμα {step} από {steps.length}
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-ink">
              {isParent
                ? (step === 1 ? "Τα στοιχεία σας" : "Όροι χρήσης")
                : (step === 1 ? "Στοιχεία υπευθύνου"
                  : step === 2 ? "Στοιχεία φροντιστηρίου"
                  : step === 3 ? "Φορολογικά στοιχεία"
                  : "Όροι χρήσης")}
            </h1>
            <p className="mt-2 text-sm text-ink/50">
              {isParent
                ? (step === 1
                    ? "Συμπληρώστε τα βασικά σας στοιχεία για έκδοση παραστατικών."
                    : "Διαβάστε και αποδεχτείτε τους όρους για να ολοκληρώσετε.")
                : (step === 1 ? "Τα στοιχεία του ατόμου που θα διαχειρίζεται τον λογαριασμό."
                  : step === 2 ? "Το όνομα και η διεύθυνση του φροντιστηρίου σας."
                  : step === 3 ? "ΑΦΜ και ΔΟΥ για έκδοση παραστατικών."
                  : "Διαβάστε και αποδεχτείτε τους όρους για να ολοκληρώσετε.")}
            </p>
          </div>

          {/* ── PARENT — Step 1: All details ── */}
          {isParent && step === 1 && (
            <form className="space-y-7" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              <div className="grid grid-cols-2 gap-5">
                <Field label="Όνομα *" placeholder="π.χ. Μαρία"
                  value={form.first_name} onChange={(v) => set("first_name", v)} required />
                <Field label="Επώνυμο *" placeholder="π.χ. Παπαδοπούλου"
                  value={form.last_name} onChange={(v) => set("last_name", v)} required />
              </div>
              <Field label="Email *" placeholder="you@example.com" type="email"
                value={form.contact_email} onChange={(v) => set("contact_email", v)} required />
              <Field label="Τηλέφωνο *" placeholder="π.χ. 6944525252" type="tel"
                value={form.mobile} onChange={(v) => set("mobile", v)} required />
              <Field label="Διεύθυνση *" placeholder="π.χ. Παπαδοπούλου 12, 71201 Ηράκλειο"
                value={form.address} onChange={(v) => set("address", v)} required />
              <Field label="ΑΦΜ *" placeholder="π.χ. 152998856"
                value={form.afm} onChange={(v) => set("afm", v)} required />
              <StepButtons onBack={null} />
            </form>
          )}

          {/* ── SCHOOL — Step 1: You ── */}
          {!isParent && step === 1 && (
            <form className="space-y-7" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              <Field label="Ονοματεπώνυμο *" placeholder="π.χ. Νίκος Παπαδόπουλος"
                value={form.contact_person} onChange={(v) => set("contact_person", v)} required />
              <Field label="Κινητό τηλέφωνο *" placeholder="π.χ. 6944525252" type="tel"
                value={form.mobile} onChange={(v) => set("mobile", v)} required />
              <Field label="Email επικοινωνίας *" placeholder="you@frontistirio.gr" type="email"
                value={form.contact_email} onChange={(v) => set("contact_email", v)} required />
              <StepButtons onBack={null} />
            </form>
          )}

          {/* ── SCHOOL — Step 2: The School ── */}
          {!isParent && step === 2 && (
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
              <Field label="Διακριτικός τίτλος *" placeholder="π.χ. Φροντιστήριο Πεδίο"
                value={form.trade_name} onChange={(v) => set("trade_name", v)} required />
              <Field label="Επωνυμία (νομικό όνομα) *" placeholder="π.χ. Βασιλειάδης & ΣΙΑ ΟΕ"
                value={form.legal_name} onChange={(v) => set("legal_name", v)} required />
              <Field label="Διεύθυνση *" placeholder="π.χ. Παπαδοπούλου 12"
                value={form.address} onChange={(v) => set("address", v)} required />
              <div className="grid grid-cols-2 gap-5">
                <Field label="Ταχ. κώδικας *" placeholder="π.χ. 71201"
                  value={form.postal_code} onChange={(v) => set("postal_code", v)} required />
                <Field label="Πόλη *" placeholder="π.χ. Ηράκλειο"
                  value={form.city} onChange={(v) => set("city", v)} required />
              </div>
              <Field label="Περιοχή / Νομός" placeholder="π.χ. Κρήτη"
                value={form.region} onChange={(v) => set("region", v)} />
              <Field label="Τηλέφωνο φροντιστηρίου *" placeholder="π.χ. 2801711611" type="tel"
                value={form.phone} onChange={(v) => set("phone", v)} required />
              <Field label="Email φροντιστηρίου *" placeholder="info@frontistirio.gr" type="email"
                value={form.school_email} onChange={(v) => set("school_email", v)} required />
              <StepButtons onBack={() => setStep(1)} />
            </form>
          )}

          {/* ── SCHOOL — Step 3: Tax (no subjects anymore) ── */}
          {!isParent && step === 3 && (
            <form className="space-y-7" onSubmit={(e) => { e.preventDefault(); setStep(4); }}>
              <Field label="ΑΦΜ *" placeholder="π.χ. 152998856"
                value={form.afm} onChange={(v) => set("afm", v)} required />
              <SelectField label="ΔΟΥ *" value={form.doy} onChange={(v) => set("doy", v)}
                placeholder="Επιλέξτε ΔΟΥ" options={DOY_LIST as unknown as string[]} required />
              <StepButtons onBack={() => setStep(2)} />
            </form>
          )}

          {/* ── Terms step (last step in both flows) ── */}
          {((isParent && step === 2) || (!isParent && step === 4)) && (
            <div className="space-y-6">
              <div className="h-64 overflow-y-auto rounded-2xl border border-ink/10 p-5 text-sm text-ink/70 leading-relaxed space-y-4 bg-[#fafaf8]">
                <p className="font-bold text-ink">ΟΡΟΙ ΧΡΗΣΗΣ ΠΛΑΤΦΟΡΜΑΣ PROTUPA</p>
                <p>Τελευταία ενημέρωση: {new Date().getFullYear()}</p>
                <p>
                  Η πρόσβαση στην πλατφόρμα Protupa και η χρήση των υπηρεσιών της προϋποθέτει
                  την ανεπιφύλακτη αποδοχή των παρόντων Όρων Χρήσης.
                </p>
                <p className="font-bold text-ink">1. Παροχή υπηρεσιών</p>
                <p>
                  Η Protupa παρέχει πρόσβαση σε θέματα διαγωνισμάτων εξετάσεων Πρότυπων
                  και Πειραματικών Σχολών, στατιστικά στοιχεία, καθώς και εργαλεία καταχώρησης
                  και αξιολόγησης βαθμολογίας μαθητών.
                </p>
                <p className="font-bold text-ink">2. Εμπιστευτικότητα δεδομένων</p>
                <p>
                  Τα δεδομένα σας και των μαθητών σας αποθηκεύονται με ασφάλεια. Χωρίς ρητή
                  γραπτή άδειά σας, δεν έχουμε πρόσβαση στα αναγνωριστικά δεδομένα των μαθητών σας.
                </p>
                <p className="font-bold text-ink">3. Υποχρεώσεις χρήστη</p>
                <p>
                  Ο χρήστης αναλαμβάνει να εισάγει ακριβή στοιχεία στο σύστημα και να μην
                  κοινοποιεί τα διαπιστευτήριά του σε τρίτους.
                </p>
                <p className="font-bold text-ink">4. Πνευματική ιδιοκτησία</p>
                <p>
                  Όλο το περιεχόμενο της πλατφόρμας αποτελεί πνευματική ιδιοκτησία της Protupa
                  και δεν επιτρέπεται η αναδημοσίευση χωρίς γραπτή άδεια.
                </p>
                <p className="font-bold text-ink">5. Αλλαγές όρων</p>
                <p>
                  Διατηρούμε το δικαίωμα τροποποίησης των παρόντων Όρων Χρήσης. Οι χρήστες
                  θα ενημερώνονται μέσω email για ουσιαστικές αλλαγές.
                </p>
                <p className="italic text-ink/50 text-xs">
                  * Τελική νομική έκδοση των Όρων Χρήσης θα κατατεθεί μετά από νομική επισκόπηση.
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input type="checkbox" checked={form.terms}
                    onChange={(e) => set("terms", e.target.checked)} className="sr-only" />
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
                    ${form.terms ? "bg-[#056ef5] border-[#056ef5]" : "border-ink/30 group-hover:border-[#056ef5]"}`}>
                    {form.terms && <span className="text-white text-xs font-black">✓</span>}
                  </div>
                </div>
                <span className="text-sm text-ink/70 leading-relaxed">
                  Έχω διαβάσει και αποδέχομαι τους{" "}
                  <span className="text-[#056ef5] font-bold">Όρους Χρήσης</span> και την{" "}
                  <span className="text-[#056ef5] font-bold">Πολιτική Απορρήτου</span> της Protupa.
                </span>
              </label>

              {/* Marketing email opt-in */}
              <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-2xl border border-ink/10 bg-[#fafaf8]">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={form.marketing_opt_in}
                    onChange={(e) => set("marketing_opt_in", e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
                    ${form.marketing_opt_in ? "bg-[#056ef5] border-[#056ef5]" : "border-ink/30 group-hover:border-[#056ef5]"}`}>
                    {form.marketing_opt_in && <span className="text-white text-xs font-black">✓</span>}
                  </div>
                </div>
                <div className="text-sm text-ink/80 leading-relaxed">
                  <span className="font-semibold text-ink">Ενημερωτικά emails</span>
                  <p className="mt-0.5 text-xs text-ink/55">
                    Θέλω να λαμβάνω emails για νέα θέματα διαγωνισμάτων, ανακοινώσεις και ενημερώσεις της πλατφόρμας.
                    Μπορείτε να αλλάξετε αυτή τη ρύθμιση οποιαδήποτε στιγμή από το προφίλ σας.
                  </p>
                </div>
              </label>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">{error}</div>
              )}

              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setStep(step - 1)}
                  className="px-5 py-3 rounded-full border-2 border-ink/15 text-ink/50 font-bold text-sm hover:border-ink/30 transition-colors cursor-pointer">
                  ← Πίσω
                </button>
                <button type="button" disabled={!form.terms || saving}
                  onClick={() => {
                    if (!form.terms) { setError("Πρέπει να αποδεχτείτε τους όρους χρήσης."); return; }
                    finish();
                  }}
                  className="flex-1 px-6 py-3 rounded-full bg-[#056ef5] text-white font-black uppercase tracking-wider text-sm hover:bg-[#0451b8] hover:-translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer">
                  {saving ? "Αποθήκευση…" : "Ολοκλήρωση εγγραφής →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepButtons({ onBack }: { onBack: (() => void) | null }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      {onBack && (
        <button type="button" onClick={onBack}
          className="px-5 py-3 rounded-full border-2 border-ink/15 text-ink/50 font-bold text-sm hover:border-ink/30 transition-colors cursor-pointer">
          ← Πίσω
        </button>
      )}
      <button type="submit"
        className="flex-1 px-6 py-3 rounded-full bg-[#056ef5] text-white font-black uppercase tracking-wider text-sm hover:bg-[#0451b8] hover:-translate-y-0.5 transition-all cursor-pointer">
        Επόμενο →
      </button>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, required = false }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-ink/40">{label}</span>
      <input required={required} type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full bg-transparent border-0 border-b-2 border-ink/20 px-0 py-2.5 text-base font-display text-ink placeholder:text-ink/25 focus:outline-none focus:border-[#056ef5] transition-colors" />
    </label>
  );
}

function SelectField({ label, value, onChange, placeholder, options, required = false }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; options: string[]; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-ink/40">{label}</span>
      <select required={required} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full bg-white border-0 border-b-2 border-ink/20 px-0 py-2.5 text-base font-display text-ink focus:outline-none focus:border-[#056ef5] transition-colors cursor-pointer">
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </label>
  );
}
