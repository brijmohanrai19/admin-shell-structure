import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface Campaign {
  id: string;
  name: string;
  slug: string;
  url_prefix: string;
  entity_type: string | null;
  entity_id: number | null;
  template_id: number | null;
  template_version: number | null;
  content_data: any;
  seo: any;
  crawl_policy: any;
  form_schema_id: number | null;
  trackers: any[];
  status: "draft" | "live" | "paused" | "archived";
  created_at: string;
  updated_at: string;
}

export const campaignsAPI = {
  // Get all campaigns
  list: async (): Promise<Campaign[]> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/campaigns`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch campaigns");
    }

    return response.json();
  },

  // Get single campaign
  get: async (id: string): Promise<Campaign> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/campaigns/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch campaign");
    }

    return response.json();
  },

  // Create campaign
  create: async (data: Partial<Campaign>): Promise<Campaign> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/campaigns`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create campaign");
    }

    return response.json();
  },

  // Update campaign
  update: async (id: string, data: Partial<Campaign>): Promise<Campaign> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/campaigns/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update campaign");
    }

    return response.json();
  },

  // Delete campaign
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/campaigns/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete campaign");
    }
  },
};
