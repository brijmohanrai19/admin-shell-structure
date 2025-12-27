import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface SeoEntry {
  id: string;
  entity_id: number;
  url: string;
  title: string;
  description: string;
  keywords: string;
  index_status: "indexed" | "not-indexed";
  source_type: "exam" | "college" | "scholarship" | "campaign";
  created_at: string;
}

export const seoAPI = {
  // Get all SEO entries
  list: async (): Promise<SeoEntry[]> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/seo`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch SEO data");
    }

    return response.json();
  },
};
