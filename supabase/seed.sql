-- Sample data so the site looks alive on first run.
-- Replace the stripe_price_id values with real Price IDs from your Stripe dashboard.

insert into packages (slug, name_el, description_el, subject, price_cents, original_price_cents, duration_days, features, stripe_price_id) values
  (
    'greek',
    'Γλώσσα',
    'Για εξάσκηση μόνο στη Γλώσσα',
    'greek',
    1999, 3999, 30,
    '[
      {"label": "Θέματα Γλώσσας προηγούμενων ετών", "included": true},
      {"label": "Επιπλέον θέματα εξάσκησης στη Γλώσσα", "included": true},
      {"label": "Αναλυτικές επεξηγήσεις", "included": true},
      {"label": "Προσομοιώσεις με χρονόμετρο", "included": true},
      {"label": "Dashboard προόδου", "included": true},
      {"label": "Μαθηματικά", "included": false}
    ]'::jsonb,
    'price_REPLACE_ME_GREEK'
  ),
  (
    'math',
    'Μαθηματικά',
    'Για εξάσκηση μόνο στα Μαθηματικά',
    'math',
    1999, 3999, 30,
    '[
      {"label": "Θέματα Μαθηματικών προηγούμενων ετών", "included": true},
      {"label": "Επιπλέον θέματα εξάσκησης στα Μαθηματικά", "included": true},
      {"label": "Αναλυτικές επεξηγήσεις", "included": true},
      {"label": "Προσομοιώσεις με χρονόμετρο", "included": true},
      {"label": "Dashboard προόδου", "included": true},
      {"label": "Γλώσσα", "included": false}
    ]'::jsonb,
    'price_REPLACE_ME_MATH'
  ),
  (
    'bundle',
    'Πλήρες Πακέτο',
    'Γλώσσα και Μαθηματικά',
    'bundle',
    3499, 6999, 30,
    '[
      {"label": "Θέματα Γλώσσας και Μαθηματικών προηγούμενων ετών", "included": true},
      {"label": "Επιπλέον θέματα εξάσκησης σε Γλώσσα & Μαθηματικά", "included": true},
      {"label": "Αναλυτικές επεξηγήσεις", "included": true},
      {"label": "Προσομοιώσεις με χρονόμετρο", "included": true},
      {"label": "Ολοκληρωμένο Dashboard", "included": true}
    ]'::jsonb,
    'price_REPLACE_ME_BUNDLE'
  );

-- Sample paper + 10 questions for the math package.
with math_pkg as (select id from packages where slug = 'math'),
     paper as (
       insert into exam_papers (package_id, title_el, year, pdf_path)
       select id, 'Πρότυπα Γυμνάσια — Δείγμα Θεμάτων 2024', 2024, 'samples/math-2024.pdf' from math_pkg
       returning id
     )
insert into questions (paper_id, number, qtype, prompt_el, choices, correct_answer)
select paper.id, n, qtype::question_type, prompt, choices::jsonb, ans from paper, (values
  (1,  'multiplication', 'Πόσο κάνει 12 × 8;',                          '["α","β","γ","δ"]', 'γ'),
  (2,  'addition',       'Πόσο κάνει 348 + 257;',                       '["α","β","γ","δ"]', 'β'),
  (3,  'subtraction',    'Πόσο κάνει 1000 − 478;',                      '["α","β","γ","δ"]', 'α'),
  (4,  'division',       'Πόσο κάνει 144 ÷ 12;',                        '["α","β","γ","δ"]', 'δ'),
  (5,  'fractions',      'Ποιο κλάσμα είναι ίσο με 1/2;',               '["α","β","γ","δ"]', 'β'),
  (6,  'geometry',       'Πόσες πλευρές έχει ένα κανονικό εξάγωνο;',    '["α","β","γ","δ"]', 'γ'),
  (7,  'word_problem',   'Ο Νίκος έχει 24€ και ξοδεύει το 1/4. Πόσα ξόδεψε;', '["α","β","γ","δ"]', 'α'),
  (8,  'multiplication', 'Πόσο κάνει 25 × 4;',                          '["α","β","γ","δ"]', 'δ'),
  (9,  'fractions',      'Πόσο είναι 3/4 + 1/4;',                       '["α","β","γ","δ"]', 'γ'),
  (10, 'addition',       'Πόσο κάνει 99 + 99;',                         '["α","β","γ","δ"]', 'β')
) as q(n, qtype, prompt, choices, ans);
