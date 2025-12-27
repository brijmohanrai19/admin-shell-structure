import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface Tracker {
  id: string;
  name: string;
  type: string;
  scope: string;
  script_code: string;
  priority: number;
  load_position: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const trackersAPI = {
  // Get all trackers
  list: async (): Promise<Tracker[]> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/trackers`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch trackers");
    }

    return response.json();
  },

  // Get single tracker
  get: async (id: string): Promise<Tracker> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/trackers/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tracker");
    }

    return response.json();
  },

  // Create tracker
  create: async (data: Partial<Tracker>): Promise<Tracker> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/trackers`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create tracker");
    }

    return response.json();
  },

  // Update tracker
  update: async (id: string, data: Partial<Tracker>): Promise<Tracker> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/trackers/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update tracker");
    }

    return response.json();
  },

  // Delete tracker
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/trackers/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete tracker");
    }
  },
};
