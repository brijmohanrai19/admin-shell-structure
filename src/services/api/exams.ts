import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface Exam {
  id: string;
  name: string;
  slug: string;
  conducting_body: string;

  // Dates
  exam_date: string | null;
  application_start_date: string | null;
  application_end_date: string | null;
  result_date: string | null;
  counselling_start_date: string | null;
  counselling_end_date: string | null;

  // Exam Details
  exam_mode: string;
  exam_duration: number | null;
  exam_language: string[];
  total_marks: number | null;
  negative_marking: boolean;
  exam_level: string;
  exam_frequency: string;

  // Fees
  application_fee_general: number | null;
  application_fee_reserved: number | null;
  late_fee: number | null;

  // Links
  official_website: string;
  application_link: string;
  syllabus_pdf_url: string;
  admit_card_link: string;
  result_link: string;
  important_links: Record<string, string>;

  // Content
  description: string;
  eligibility: string;
  exam_pattern: string;
  syllabus: string;
  preparation_tips: string;
  cutoff_trends: any;

  // Media
  banner_image: string;
  thumbnail_image: string;
  brochure_pdf: string;

  // Meta
  seo: any;
  crawl_policy: any;
  priority: number;
  status: "draft" | "live" | "closed" | "archived";
  created_at: string;
  updated_at: string;
}

export const examsAPI = {
  // Get all exams
  list: async (): Promise<Exam[]> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/exams`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch exams");
    }

    return response.json();
  },

  // Get single exam
  get: async (id: string): Promise<Exam> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/exams/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch exam");
    }

    return response.json();
  },

  // Create exam
  create: async (data: Partial<Exam>): Promise<Exam> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/exams`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create exam");
    }

    return response.json();
  },

  // Update exam
  update: async (id: string, data: Partial<Exam>): Promise<Exam> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/exams/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update exam");
    }

    return response.json();
  },

  // Delete exam (optional)
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/exams/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete exam");
    }
  },
};
