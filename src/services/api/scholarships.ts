import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface Scholarship {
  id: string;
  name: string;
  slug: string;
  provider_name: string;
  provider_type: string;
  amount_min: number | null;
  amount_max: number | null;
  currency: string;
  eligibility_criteria: string;
  application_process: string;
  deadline: string | null;
  description: string;
  seo: any;
  crawl_policy: any;
  form_schema_id: string | null;
  status: "draft" | "live" | "archived";
  created_at: string;
  updated_at: string;
}

export const scholarshipsAPI = {
  // Get all scholarships
  list: async (): Promise<Scholarship[]> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/scholarships`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch scholarships");
    }

    return response.json();
  },

  // Get single scholarship
  get: async (id: string): Promise<Scholarship> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/scholarships/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch scholarship");
    }

    return response.json();
  },

  // Create scholarship
  create: async (data: Partial<Scholarship>): Promise<Scholarship> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/scholarships`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create scholarship");
    }

    return response.json();
  },

  // Update scholarship
  update: async (id: string, data: Partial<Scholarship>): Promise<Scholarship> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/scholarships/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update scholarship");
    }

    return response.json();
  },

  // Delete scholarship
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/scholarships/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete scholarship");
    }
  },
};
