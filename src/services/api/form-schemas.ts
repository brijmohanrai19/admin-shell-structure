import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface FormField {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  options?: string[];
}

export interface FormSchema {
  id: string;
  name: string;
  slug: string;
  version: number;
  fields: FormField[];
  status: "draft" | "published" | "retired";
  usage_count: number;
  is_system_default: boolean;
  created_at: string;
  updated_at: string;
}

export const formSchemasAPI = {
  // Get all form schemas
  list: async (): Promise<FormSchema[]> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/form-schemas`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch form schemas");
    }

    return response.json();
  },

  // Get single form schema
  get: async (id: string): Promise<FormSchema> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/form-schemas/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch form schema");
    }

    return response.json();
  },

  // Create form schema
  create: async (data: Partial<FormSchema>): Promise<FormSchema> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/form-schemas`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create form schema");
    }

    return response.json();
  },

  // Update form schema
  update: async (id: string, data: Partial<FormSchema>): Promise<FormSchema> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/form-schemas/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update form schema");
    }

    return response.json();
  },

  // Delete form schema
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/form-schemas/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete form schema");
    }
  },
};
