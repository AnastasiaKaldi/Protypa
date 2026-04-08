// Database row shapes — kept in sync with supabase/migrations/0001_init.sql.
// We don't auto-generate types in the MVP to keep the toolchain minimal.

export type Subject = "math" | "greek" | "bundle";

export type QuestionType =
  | "multiplication"
  | "addition"
  | "subtraction"
  | "division"
  | "fractions"
  | "geometry"
  | "word_problem"
  | "grammar"
  | "vocabulary"
  | "reading_comprehension"
  | "other";

export interface PackageFeature {
  label: string;
  included: boolean;
}

export interface Package {
  id: string;
  slug: string;
  name_el: string;
  description_el: string | null;
  subject: Subject;
  price_cents: number;
  original_price_cents: number | null;
  duration_days: number;
  features: PackageFeature[];
  stripe_price_id: string;
}

export interface ExamPaper {
  id: string;
  package_id: string;
  title_el: string;
  year: number | null;
  pdf_path: string;
  created_at: string;
}

export interface Question {
  id: string;
  paper_id: string;
  number: number;
  qtype: QuestionType;
  prompt_el: string | null;
  choices: string[];
  correct_answer: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  package_id: string;
  stripe_session_id: string | null;
  purchased_at: string;
  expires_at: string;
}

export interface GradingSession {
  id: string;
  user_id: string;
  paper_id: string;
  student_name: string | null;
  answers: Record<string, string>;
  score: number;
  total: number;
  type_breakdown: Record<string, { correct: number; total: number }>;
  created_at: string;
}
