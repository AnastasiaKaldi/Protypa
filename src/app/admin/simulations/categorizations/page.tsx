"use client";

import { useState } from "react";
import Link from "next/link";

type SheetReport = {
  sheet: string;
  status: "ok" | "warning" | "skipped";
  message: string;
  count: number;
};
type UploadResponse = {
  success?: boolean;
  updated?: number;
  sheets?: SheetReport[];
  error?: string;
};

export default function CategorizationsUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<UploadResponse | null>(null);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setResult(null);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/question-tags", {
      method: "POST",
      body: form,
    });
    let data: UploadResponse;
    try {
      data = (await res.json()) as UploadResponse;
    } catch {
      data = { error: "Σφάλμα αποκρίσεως διακομιστή." };
    }
    setBusy(false);
    setResult(data);
  }

  function reset() {
    setFile(null);
    setResult(null);
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/simulations"
        className="!text-white/70 hover:!text-white text-xs transition-colors"
      >
        ← Πίσω στις Προσομοιώσεις
      </Link>

      <div>
        <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/80 mb-2">
          Admin
        </div>
        <h1 className="font-display text-3xl text-white">Κατηγοριοποιήσεις ερωτήσεων</h1>
        <p className="text-sm text-white max-w-2xl leading-relaxed mt-3">
          Φορτώστε ένα αρχείο Excel <code className="text-[#c8ff00]">.xlsx</code> με ένα φύλλο
          ανά διαγώνισμα. Το όνομα κάθε φύλλου πρέπει να είναι ο αριθμός του διαγωνίσματος (π.χ.
          <code className="text-[#c8ff00]"> 1</code>,
          <code className="text-[#c8ff00]"> 2</code>, …
          <code className="text-[#c8ff00]"> 10</code>). Κάθε φύλλο πρέπει να έχει 40 ερωτήσεις (Γλώσσα 1–20,
          Μαθηματικά 21–40) με στήλες:{" "}
          <strong className="text-white">Ερώτηση</strong>,{" "}
          <strong className="text-white">Μάθημα</strong>,{" "}
          <strong className="text-white">Κατηγορία</strong>.
        </p>
        <p className="text-xs text-white/80 mt-3">
          Επαναφόρτωση του ίδιου αρχείου είναι ασφαλής — οι παλιές κατηγοριοποιήσεις
          ενημερώνονται αυτόματα.
        </p>
      </div>

      {/* Upload form */}
      <form
        onSubmit={upload}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4"
      >
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-white/80">
            Αρχείο Excel (.xlsx)
          </span>
          <input
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setResult(null);
            }}
            className="block mt-3 text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#056ef5] file:text-white file:font-bold file:text-xs file:uppercase file:tracking-wider file:cursor-pointer hover:file:bg-[#0451b8] file:transition-colors"
          />
          {file && (
            <span className="block mt-3 text-xs text-white/80">
              Επιλέχθηκε: <strong className="text-white">{file.name}</strong> ({Math.round(file.size / 1024)} KB)
            </span>
          )}
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!file || busy}
            className="px-6 py-2.5 rounded-full bg-[#c8ff00] text-ink font-black uppercase tracking-wider text-xs hover:bg-[#b8ee00] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {busy ? "Φόρτωση..." : "Επιβεβαίωση & Αποθήκευση"}
          </button>
          {file && !busy && (
            <button
              type="button"
              onClick={reset}
              className="text-xs text-white/70 hover:text-white transition-colors"
            >
              Επαναφορά
            </button>
          )}
        </div>
      </form>

      {/* Top-level error */}
      {result?.error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          <strong className="font-bold">Σφάλμα:</strong> {result.error}
        </div>
      )}

      {/* Top-level success */}
      {result?.success && (
        <div className="rounded-2xl border border-green-500/40 bg-green-500/10 p-4 text-sm text-green-200">
          <strong className="font-bold">Επιτυχία.</strong> Αποθηκεύτηκαν{" "}
          <strong className="text-white">{result.updated}</strong> κατηγοριοποιήσεις στη βάση
          δεδομένων.
        </div>
      )}

      {/* Per-sheet report */}
      {result?.sheets && result.sheets.length > 0 && (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-5 py-3 bg-white/5 border-b border-white/10 text-[10px] font-bold tracking-wider uppercase text-white/80">
            Αποτελέσματα ανά φύλλο
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-wider uppercase text-white/80">
                  Φύλλο
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-wider uppercase text-white/80">
                  Κατάσταση
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-wider uppercase text-white/80">
                  Λεπτομέρειες
                </th>
                <th className="text-right px-5 py-3 text-[10px] font-bold tracking-wider uppercase text-white/80">
                  Ερωτήσεις
                </th>
              </tr>
            </thead>
            <tbody>
              {result.sheets.map((s) => (
                <tr key={s.sheet} className="border-t border-white/5">
                  <td className="px-5 py-3 text-white font-medium">{s.sheet}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-5 py-3 text-white">{s.message}</td>
                  <td className="px-5 py-3 text-right text-white tabular-nums">{s.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: SheetReport["status"] }) {
  const style =
    status === "ok"
      ? "bg-green-500/20 text-green-300 border-green-500/30"
      : status === "warning"
        ? "bg-amber-500/20 text-amber-200 border-amber-500/30"
        : "bg-red-500/20 text-red-200 border-red-500/30";
  const label = status === "ok" ? "OK" : status === "warning" ? "Προειδοποίηση" : "Παραλείφθηκε";
  return (
    <span
      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${style}`}
    >
      {label}
    </span>
  );
}
