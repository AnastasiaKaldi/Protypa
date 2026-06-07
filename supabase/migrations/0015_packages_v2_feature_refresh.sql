-- ──────────────────────────────────────────────────────────────────────────
-- Packages v2 feature refresh.
--
-- Changes to existing parent / school packages:
--   • Unified "Στατιστικά για κάθε παιδί" → "Στατιστικά για κάθε μαθητή"
--     (so the comparison table doesn't double-up the row).
--   • Added "AI σύνοψη επίδοσης μαθητή" as a feature on both packages.
--     The AI synopsis itself will be built later — for now it's a marketing
--     line in the comparison.
--   • Added "Διάγραμμα προσωπικής πορείας" to school tiers (parent already
--     had it; schools serve the same per-student chart at /account/students/[id]).
--
-- Re-ordered features so the comparison table reads top-to-bottom:
--   access → student limit → per-student stats → AI synopsis → personal chart
--   → school-wide stats → national comparison.
-- ──────────────────────────────────────────────────────────────────────────

-- ─── Parent package ─────────────────────────────────────────────────────
update packages
set features = $$[
  {"label":"Πρόσβαση σε όλα τα διαγωνίσματα","included":true},
  {"label":"Έως 2 μαθητές","included":true},
  {"label":"Στατιστικά για κάθε μαθητή","included":true},
  {"label":"AI σύνοψη επίδοσης μαθητή","included":true},
  {"label":"Διάγραμμα προσωπικής πορείας","included":true},
  {"label":"Συνολικά στατιστικά φροντιστηρίου","included":false},
  {"label":"Σύγκριση με όλα τα φροντιστήρια Ελλάδας","included":false}
]$$::jsonb
where slug = 'parent';

-- ─── School tier 1 (5–10) ───────────────────────────────────────────────
update packages
set features = $$[
  {"label":"Πρόσβαση σε όλα τα διαγωνίσματα","included":true},
  {"label":"Έως 10 μαθητές","included":true},
  {"label":"Στατιστικά για κάθε μαθητή","included":true},
  {"label":"AI σύνοψη επίδοσης μαθητή","included":true},
  {"label":"Διάγραμμα προσωπικής πορείας","included":true},
  {"label":"Συνολικά στατιστικά φροντιστηρίου","included":true},
  {"label":"Σύγκριση με όλα τα φροντιστήρια Ελλάδας","included":true}
]$$::jsonb
where slug = 'school-tier-1';

-- ─── School tier 2 (11–15) ──────────────────────────────────────────────
update packages
set features = $$[
  {"label":"Πρόσβαση σε όλα τα διαγωνίσματα","included":true},
  {"label":"Έως 15 μαθητές","included":true},
  {"label":"Στατιστικά για κάθε μαθητή","included":true},
  {"label":"AI σύνοψη επίδοσης μαθητή","included":true},
  {"label":"Διάγραμμα προσωπικής πορείας","included":true},
  {"label":"Συνολικά στατιστικά φροντιστηρίου","included":true},
  {"label":"Σύγκριση με όλα τα φροντιστήρια Ελλάδας","included":true}
]$$::jsonb
where slug = 'school-tier-2';

-- ─── School tier 3 (16–20) ──────────────────────────────────────────────
update packages
set features = $$[
  {"label":"Πρόσβαση σε όλα τα διαγωνίσματα","included":true},
  {"label":"Έως 20 μαθητές","included":true},
  {"label":"Στατιστικά για κάθε μαθητή","included":true},
  {"label":"AI σύνοψη επίδοσης μαθητή","included":true},
  {"label":"Διάγραμμα προσωπικής πορείας","included":true},
  {"label":"Συνολικά στατιστικά φροντιστηρίου","included":true},
  {"label":"Σύγκριση με όλα τα φροντιστήρια Ελλάδας","included":true}
]$$::jsonb
where slug = 'school-tier-3';

-- ─── School tier 4 (21–25) ──────────────────────────────────────────────
update packages
set features = $$[
  {"label":"Πρόσβαση σε όλα τα διαγωνίσματα","included":true},
  {"label":"Έως 25 μαθητές","included":true},
  {"label":"Στατιστικά για κάθε μαθητή","included":true},
  {"label":"AI σύνοψη επίδοσης μαθητή","included":true},
  {"label":"Διάγραμμα προσωπικής πορείας","included":true},
  {"label":"Συνολικά στατιστικά φροντιστηρίου","included":true},
  {"label":"Σύγκριση με όλα τα φροντιστήρια Ελλάδας","included":true}
]$$::jsonb
where slug = 'school-tier-4';
