import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface Course {
  id: string;
  level: "UG" | "PG" | "Diploma" | "PhD";
  name: string;
  specialization?: string;
}

export interface FeeRange {
  min: number;
  max: number;
  currency: string;
}

export interface College {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  country: string;
  courses: Course[];
  fee_range: FeeRange | null;
  intake: number | null;
  approvals: string[];
  description: string;
  admission_process: string;
  seo: any;
  crawl_policy: any;
  form_schema_id: string | null;
  status: "draft" | "live" | "archived";
  created_at: string;
  updated_at: string;
}

export const collegesAPI = {
  // Get all colleges
  list: async (): Promise<College[]> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/colleges`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch colleges");
    }

    return response.json();
  },

  // Get single college
  get: async (id: string): Promise<College> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/colleges/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch college");
    }

    return response.json();
  },

  // Create college
  create: async (data: Partial<College>): Promise<College> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/colleges`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create college");
    }

    return response.json();
  },

  // Update college
  update: async (id: string, data: Partial<College>): Promise<College> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/colleges/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update college");
    }

    return response.json();
  },

  // Delete college
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/colleges/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete college");
    }
  },
};
