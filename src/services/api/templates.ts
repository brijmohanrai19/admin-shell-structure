import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface Template {
  id: string;
  name: string;
  slug: string;
  version: number;
  component_definition: any;
  sections: string[];
  status: "draft" | "published" | "retired";
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export const templatesAPI = {
  // Get all templates
  list: async (): Promise<Template[]> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/templates`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch templates");
    }

    return response.json();
  },

  // Get single template
  get: async (id: string): Promise<Template> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/templates/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch template");
    }

    return response.json();
  },

  // Create template
  create: async (data: Partial<Template>): Promise<Template> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/templates`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create template");
    }

    return response.json();
  },

  // Update template
  update: async (id: string, data: Partial<Template>): Promise<Template> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/templates/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update template");
    }

    return response.json();
  },

  // Delete template
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/templates/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete template");
    }
  },
};
