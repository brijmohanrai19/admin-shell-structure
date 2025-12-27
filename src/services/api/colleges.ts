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

  // Location
  city: string;
  state: string;
  country: string;
  address: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  campus_area: number | null;

  // Contact
  phone: string;
  email: string;
  website: string;

  // Establishment
  year_established: number | null;
  college_type: string;
  university_affiliation: string;

  // Courses & Fees
  courses: Course[];
  fee_range: FeeRange | null;
  intake: number | null;
  approvals: string[];

  // Infrastructure
  hostel_available: boolean;
  hostel_fee_range: any;
  library_size: number | null;
  labs_count: number | null;
  sports_facilities: string[];

  // Placements
  placement_percentage: number | null;
  average_package: number | null;
  highest_package: number | null;
  top_recruiters: string[];
  placement_trends: any;

  // Rankings
  nirf_rank: number | null;
  qs_rank: number | null;
  other_rankings: any;

  // Admission
  entrance_exams: string[];
  admission_criteria: string;
  seat_matrix: any;

  // Media
  logo_url: string;
  banner_image: string;
  gallery_images: string[];
  virtual_tour_link: string;
  video_url: string;

  // Content
  description: string;
  admission_process: string;
  about: string;
  facilities: string;
  alumni_network: string;

  // Meta
  seo: any;
  crawl_policy: any;
  form_schema_id: string | null;
  priority: number;
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
