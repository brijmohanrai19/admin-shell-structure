import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface Redirect {
  id: string;
  source_path: string;
  target_path: string;
  redirect_type: "301" | "302";
  is_active: boolean;
  hit_count: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export const redirectsAPI = {
  // Get all redirects
  list: async (): Promise<Redirect[]> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/redirects`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch redirects");
    }

    return response.json();
  },

  // Get single redirect
  get: async (id: string): Promise<Redirect> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/redirects/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch redirect");
    }

    return response.json();
  },

  // Create redirect
  create: async (data: Partial<Redirect>): Promise<Redirect> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/redirects`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create redirect");
    }

    return response.json();
  },

  // Update redirect
  update: async (id: string, data: Partial<Redirect>): Promise<Redirect> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/redirects/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update redirect");
    }

    return response.json();
  },

  // Delete redirect
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/redirects/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete redirect");
    }
  },
};
