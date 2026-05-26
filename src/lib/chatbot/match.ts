import { el } from "@/lib/i18n/el";

export interface FaqEntry {
  q: string;
  a: string;
  category: string;
  categoryLabel: string;
}

// Common Greek stopwords — removed from token sets before scoring
const STOPWORDS = new Set([
  "ο", "η", "το", "οι", "τα", "και", "για", "με", "σε", "στο", "στη", "στην", "στις", "στους",
  "από", "που", "πως", "πώς", "τι", "ποιος", "ποια", "ποιο", "ποιες", "ποιοι",
  "είναι", "ειναι", "έχει", "εχει", "έχουν", "θα", "να", "δεν", "μη", "μην",
  "ένα", "μια", "ενα", "ένας", "μου", "σου", "του", "της", "μας", "σας", "τους",
  "ως", "αν", "αλλά", "αλλα", "πιο", "όλα", "ολα", "όλες", "όλους", "πολύ", "πολυ",
  "πρέπει", "πρεπει", "μπορώ", "μπορω", "μπορεί", "μπορει", "έχω", "εχω",
  "μέσω", "μεσω", "ολες", "αυτό", "αυτο", "αυτή", "αυτη", "ή",
]);

// Synonym clusters — every token in a cluster is treated as equivalent when
// matching. Add new clusters here as you grow the FAQ.
// (After normalisation — already de-accented and lowercased.)
const SYNONYM_CLUSTERS: string[][] = [
  // money: cost + payment + price all in one cluster — paraphrases of
  // "how much / how do I pay / πόσο κάνει / τιμή / κάρτα" all collapse here.
  // Includes English aliases.
  ["κοστιζει", "κοστος", "κοστο", "τιμη", "τιμες", "κανει", "αξιζει", "χρεωση",
   "ποσο", "πληρωμη", "πληρωμης", "πληρωνω", "πληρωσω", "πληρωθει",
   "καρτα", "καρτας", "stripe", "αγορα", "συναλλαγη", "χρεωστικη", "πιστωτικη",
   "δωσω", "δωσει", "λεφτα", "ευρω",
   "cost", "price", "much", "pay", "payment", "card", "purchase", "buy", "euros"],
  // duration / when / how long
  ["διαρκει", "διαρκεια", "χρονος", "χρονικα", "ποτε", "μερες", "ωρες", "ληγει", "ληξη", "παραταση",
   "duration", "long", "when", "expire", "expires", "expiration"],
  // account / signup / login
  ["λογαριασμος", "λογαριασμο", "λογαριασμου", "εγγραφη", "εγγραφω", "δημιουργω", "δημιουργησω",
   "φτιαξω", "συνδεθω", "συνδεση", "γραψω", "γραφτω",
   "account", "signup", "register", "create", "login", "signin"],
  // password
  ["κωδικος", "κωδικο", "κωδικου", "password", "ξεχασα", "ξεχνω", "επαναφορα", "ανακτηση",
   "forgot", "reset", "recover"],
  // refund / cancel
  ["επιστροφη", "επιστρεψω", "ακυρωση", "ακυρωσω", "πισω", "ξαναπαρω", "πισωγυρισμα",
   "refund", "cancel", "money", "back"],
  // receipt / invoice / tax doc
  ["αποδειξη", "τιμολογιο", "παραστατικο", "παραστατικα", "φορολογικο", "αφμ",
   "receipt", "invoice", "vat", "tax"],
  // schools (πρότυπα)
  ["προτυπα", "προτυπο", "προτυπων", "σχολειο", "σχολεια", "σχολειου", "σχολειων",
   "school", "schools"],
  // experimental schools
  ["πειραματικα", "πειραματικο", "πειραματικου",
   "experimental"],
  // exams
  ["εξετασεις", "εξεταση", "εξετασεων", "διαγωνισμα", "διαγωνισματα", "διαγωνισμου", "δοκιμασια",
   "exam", "exams", "test", "tests"],
  // statistics
  ["στατιστικα", "στατιστικη", "στατιστικες", "αναλυση", "αναλυσεις", "δεδομενα", "μετρησεις",
   "statistics", "stats", "data", "analytics"],
  // greek subject
  ["γλωσσα", "γλωσσας", "νεοελληνικη", "κατανοηση", "κειμενο", "κειμενα",
   "greek", "language", "comprehension"],
  // math subject
  ["μαθηματικα", "μαθηματικων", "αριθμητικη", "αλγεβρα", "γεωμετρια", "ασκησεις",
   "math", "maths", "mathematics"],
  // platform / software / install
  ["πλατφορμα", "πλατφορμας", "εργαλειο", "συστημα", "εφαρμογη", "λογισμικο", "εγκατασταση", "εγκαταστησω",
   "platform", "tool", "software", "install", "download", "app"],
  // help / contact
  ["βοηθεια", "βοηθησετε", "επικοινωνια", "επαφη", "ομαδα", "υποστηριξη",
   "help", "support", "contact"],
  // students
  ["μαθητη", "μαθητης", "μαθητων", "μαθητες", "παιδια", "παιδι",
   "student", "students", "kid", "kids", "child", "children"],
  // teachers / tutoring center
  ["φροντιστηριο", "φροντιστηρια", "φροντιστηριου", "καθηγητης", "καθηγητες", "διδασκοντες", "εκπαιδευτικος",
   "teacher", "teachers", "tutor", "tutors"],
  // results / grades
  ["αποτελεσματα", "αποτελεσμα", "βαθμος", "βαθμοι", "βαθμολογια", "βαθμολογηση",
   "results", "grades", "grade", "score", "scores"],
  // package / subscription
  ["πακετο", "πακετα", "συνδρομη", "συνδρομες", "πληρες",
   "package", "packages", "subscription", "plan", "plans"],
  // delete / cancel account
  ["διαγραφω", "διαγραφη", "καταργηση",
   "delete", "remove"],
];

// Build a fast token → cluster-id index once.
const TOKEN_TO_CLUSTER: Map<string, number> = (() => {
  const m = new Map<string, number>();
  SYNONYM_CLUSTERS.forEach((cluster, i) => {
    for (const t of cluster) m.set(t, i);
  });
  return m;
})();

// Very basic Greek stem: trim a common verb/noun suffix so that "κοστιζει"
// and "κοστος" both reduce to "κοστ", catching simple inflection variants.
function stem(t: string): string {
  if (t.length <= 4) return t;
  const suffixes = [
    "ιζετε", "ιζουν", "ιζει", "ιζω",
    "ηκαμε", "ηκατε", "ηκαν", "ηκα",
    "ουμαι", "ουσαι", "ουνται", "ουμασ", "ουσασ",
    "οντασ", "οντος", "ονται", "ωντας",
    "ικους", "ικους", "ικους", "ικους",
    "ικος", "ικου", "ικη", "ικο", "ικα",
    "εται", "ουμε", "ετε", "ετε",
    "εις", "εων", "ων", "ος", "ου", "οι",
    "ες", "ας", "ις", "ησ",
    "ει", "ε", "η", "α", "ο", "ω",
  ];
  for (const s of suffixes) {
    if (t.endsWith(s) && t.length - s.length >= 3) {
      return t.slice(0, t.length - s.length);
    }
  }
  return t;
}

// ── Levenshtein (edit distance) — bounded for performance ─────────────────
// Returns Infinity if distance exceeds `max` (early exit).
function levenshtein(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return Infinity;
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  let prev = new Array(n + 1);
  let curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= n; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1,
        prev[j] + 1,
        prev[j - 1] + cost,
      );
      if (curr[j] < rowMin) rowMin = curr[j];
    }
    if (rowMin > max) return Infinity; // can't improve below max anymore
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

// Edit threshold: short tokens are stricter (typos look more like other words)
function editBudget(token: string): number {
  if (token.length <= 4) return 0;
  if (token.length <= 7) return 1;
  return 2;
}

// All cluster terms flat list, for fuzzy lookup
const ALL_CLUSTER_TERMS: { term: string; clusterId: number }[] = (() => {
  const list: { term: string; clusterId: number }[] = [];
  SYNONYM_CLUSTERS.forEach((cluster, i) => {
    for (const t of cluster) list.push({ term: t, clusterId: i });
  });
  return list;
})();

// Find the cluster id for a token using exact OR fuzzy match (typo-tolerant).
function fuzzyClusterId(token: string): number | undefined {
  const exact = TOKEN_TO_CLUSTER.get(token);
  if (exact !== undefined) return exact;

  const budget = editBudget(token);
  if (budget === 0) return undefined;

  let bestId: number | undefined = undefined;
  let bestDist = budget + 1;
  for (const { term, clusterId } of ALL_CLUSTER_TERMS) {
    if (Math.abs(term.length - token.length) > budget) continue;
    const d = levenshtein(token, term, bestDist - 1);
    if (d < bestDist) {
      bestDist = d;
      bestId = clusterId;
      if (d === 0) break;
    }
  }
  return bestId;
}

// Expand a token to its set of "equivalent" search keys:
//   raw token, stem, and any (fuzzy-matched) synonym-cluster id.
function expand(token: string): string[] {
  const out = new Set<string>();
  out.add(token);
  out.add(stem(token));
  const cid = fuzzyClusterId(token);
  if (cid !== undefined) out.add(`__c${cid}`);
  const sid = fuzzyClusterId(stem(token));
  if (sid !== undefined) out.add(`__c${sid}`);
  return [...out];
}

// Greek diacritic removal + lowercase
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(s: string): string[] {
  return normalize(s)
    .split(" ")
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

// Flatten the i18n FAQ structure into a flat searchable list
export function getFaqEntries(): FaqEntry[] {
  const out: FaqEntry[] = [];
  for (const cat of el.faq.categories) {
    for (const item of cat.items) {
      out.push({ q: item.q, a: item.a, category: cat.id, categoryLabel: cat.label });
    }
  }
  return out;
}

export interface MatchResult {
  entry: FaqEntry;
  score: number;
}

// Build the expanded token set for any text — original tokens + stems +
// synonym-cluster IDs. We match against this fingerprint instead of raw words.
function fingerprint(s: string): Set<string> {
  const out = new Set<string>();
  for (const t of tokenize(s)) {
    for (const e of expand(t)) out.add(e);
  }
  return out;
}

// Score = (question fingerprint overlap × 3) + (answer fingerprint overlap × 1)
// Now "πόσο κάνει" and "πόσο κοστίζει" both expand to the cost cluster id,
// so either query matches any FAQ entry containing κοστίζει / τιμή / πληρωμή.
export function findBestMatch(query: string, entries: FaqEntry[]): MatchResult | null {
  const qFp = fingerprint(query);
  if (qFp.size === 0) return null;

  let best: MatchResult | null = null;
  for (const entry of entries) {
    const qSetEntry = fingerprint(entry.q);
    const aSetEntry = fingerprint(entry.a);
    let questionHits = 0;
    let answerHits = 0;
    for (const t of qFp) {
      if (qSetEntry.has(t)) questionHits++;
      if (aSetEntry.has(t)) answerHits++;
    }
    const score = questionHits * 3 + answerHits;
    if (score > 0 && (!best || score > best.score)) {
      best = { entry, score };
    }
  }

  // Confidence threshold: 2 weighted points minimum.
  return best && best.score >= 2 ? best : null;
}

// Suggested starter questions shown when the chat opens
export function getSuggestedQuestions(): string[] {
  return [
    "Τι είναι το protupa.gr;",
    "Πόσο διαρκεί η πρόσβαση μετά την αγορά;",
    "Πώς δημιουργώ λογαριασμό;",
    "Τι είναι τα Πρότυπα Σχολεία;",
  ];
}

// After answering a question, suggest other questions from the same category
// (excluding the one just answered). Picks the first 3 by default.
export function getRelatedQuestions(categoryId: string, excludeQuestion: string, limit = 3): string[] {
  const cat = el.faq.categories.find((c) => c.id === categoryId);
  if (!cat) return [];
  return cat.items
    .filter((item) => item.q !== excludeQuestion)
    .slice(0, limit)
    .map((item) => item.q);
}
