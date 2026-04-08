// Greek-locale formatters used across pages.

const eur = new Intl.NumberFormat("el-GR", {
  style: "currency",
  currency: "EUR",
});
export function formatEuro(cents: number): string {
  return eur.format(cents / 100);
}

const dt = new Intl.DateTimeFormat("el-GR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
export function formatDate(iso: string | Date): string {
  return dt.format(typeof iso === "string" ? new Date(iso) : iso);
}
