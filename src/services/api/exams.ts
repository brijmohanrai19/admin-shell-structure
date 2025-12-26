import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface Exam {
  id: string;
  name: string;
  slug: string;
  conducting_body: string;
  application_start_date: string | null;
  application_end_date: string | null;
  exam_date: string | null;
  description: string;
  eligibility: string;
  exam_pattern: string;
  important_links: Record<string, string>;
  priority: number;
  seo: any;
  crawl_policy: any;
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
