import { API_CONFIG } from "@/config/api";
const API_BASE_URL = API_CONFIG.BASE_URL;

export interface AnalyticsOverview {
  totalCampaigns: number;
  activeCampaigns: number;
  draftCampaigns: number;
  pausedCampaigns: number;
  totalExams: number;
  totalColleges: number;
  totalScholarships: number;
  recentCampaigns: number;
}

export interface CampaignAnalytics {
  byEntityType: Record<string, { total: number; live: number; draft: number }>;
  trends: Array<{ month: string; count: number }>;
}

export interface EntityAnalytics {
  exams: {
    byLevel: Array<{ level: string; count: number }>;
  };
  colleges: {
    byType: Array<{ type: string; count: number }>;
    topRanked: Array<{ name: string; nirf_rank: number; placement_percentage: number }>;
  };
  scholarships: {
    byType: Array<{ type: string; count: number }>;
  };
}

export interface Activity {
  type: string;
  id: number;
  name: string;
  status: string;
  entityType?: string;
  timestamp: string;
}

export const analyticsAPI = {
  getOverview: async (): Promise<AnalyticsOverview> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/analytics/overview`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch analytics overview");
    return response.json();
  },

  getCampaignAnalytics: async (): Promise<CampaignAnalytics> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/analytics/campaigns`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch campaign analytics");
    return response.json();
  },

  getEntityAnalytics: async (): Promise<EntityAnalytics> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/analytics/entities`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch entity analytics");
    return response.json();
  },

  getRecentActivity: async (): Promise<Activity[]> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/analytics/recent-activity`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch recent activity");
    return response.json();
  },
};
