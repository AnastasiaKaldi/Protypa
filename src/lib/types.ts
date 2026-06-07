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

export type PackageType = "parent" | "school" | "legacy";
export type BillingInterval = "month" | "year" | "one_time";
export type AccountType = "school" | "parent";

export interface Package {
  id: string;
  slug: string;
  name_el: string;
  description_el: string | null;
  subject: Subject | null;        // null for parent/school v2 packages
  package_type: PackageType;
  min_students: number | null;    // null for legacy
  max_students: number | null;
  price_cents: number;
  original_price_cents: number | null;
  duration_days: number;
  billing_interval: BillingInterval;
  features: PackageFeature[];
  stripe_price_id: string | null; // null until Stripe products are created
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

// ─── School portal ───────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  full_name: string | null;
  school_name: string | null;
  is_admin: boolean;
  onboarding_complete: boolean;
  created_at: string;
}

export interface School {
  id: string;
  legal_name: string | null;
  trade_name: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  region: string | null;
  phone: string | null;
  mobile: string | null;
  school_email: string | null;
  contact_person: string | null;
  contact_email: string | null;
  afm: string | null;
  doy: string | null;
  subjects: string[];
  terms_accepted_at: string | null;
  marketing_opt_in: boolean;
  created_at: string;
  updated_at: string;
}

export interface Simulation {
  id: string;
  number: number;
  title: string;
  subject: "greek" | "math" | "bundle";
  exam_date: string | null;
  unlocks_at: string | null;
  grading_closes_at: string | null;
  greek_questions: number;
  math_questions: number;
  is_published: boolean;
  material_url: string | null;
  questions_url: string | null;
  created_at: string;
}

export interface SchoolSimulation {
  id: string;
  school_id: string;
  simulation_id: string;
  student_count: number | null;
  is_submitted: boolean;
  submitted_at: string | null;
}

export interface SimulationGrade {
  id: string;
  school_simulation_id: string;
  student_label: string;
  wrong_questions: number[];
  score: number;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  school_id: string;
  first_name: string;
  last_name: string;
  class_year: string | null;
  subjects: string[];
  notes: string | null;
  mother_name: string | null;
  father_name: string | null;
  gender: "female" | "male" | "other" | null;
  created_at: string;
  updated_at: string;
}

export interface SimulationQuestionTag {
  id: string;
  simulation_id: string;
  question_number: number;
  subject: "greek" | "math";
  category: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  tag: string | null;
  cover_image_url: string | null;
  publish_at: string | null;
  email_sent_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentSimulationGrade {
  id: string;
  student_id: string;
  simulation_id: string;
  school_simulation_id: string;
  wrong_questions: number[];
  score: number;
  submitted_at: string;
  updated_at: string;
}
