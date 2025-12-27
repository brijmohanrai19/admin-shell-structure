import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface SlugRecord {
  id: string;
  full_path: string;
  entity_type: "exam" | "college" | "scholarship" | "campaign";
  entity_id: string;
  entity_name: string;
  status: "draft" | "active" | "retired";
  created_at: string;
  updated_at: string;
}

export const slugRegistryAPI = {
  // Get all slugs from all entities
  list: async (): Promise<SlugRecord[]> => {
    try {
      // Fetch all entity types in parallel
      const [examsRes, collegesRes, scholarshipsRes, campaignsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/exams`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }),
        fetch(`${API_BASE_URL}/api/admin/colleges`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }),
        fetch(`${API_BASE_URL}/api/admin/scholarships`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }),
        fetch(`${API_BASE_URL}/api/admin/campaigns`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }),
      ]);

      if (!examsRes.ok || !collegesRes.ok || !scholarshipsRes.ok || !campaignsRes.ok) {
        throw new Error("Failed to fetch slug registry data");
      }

      const [exams, colleges, scholarships, campaigns] = await Promise.all([
        examsRes.json(),
        collegesRes.json(),
        scholarshipsRes.json(),
        campaignsRes.json(),
      ]);

      // Transform exams to slug records
      const examSlugs: SlugRecord[] = exams.map((exam: any) => ({
        id: `exam-${exam.id}`,
        full_path: `/exam/${exam.slug}`,
        entity_type: "exam" as const,
        entity_id: exam.id,
        entity_name: exam.name,
        status: exam.status || "active",
        created_at: exam.created_at,
        updated_at: exam.updated_at,
      }));

      // Transform colleges to slug records
      const collegeSlugs: SlugRecord[] = colleges.map((college: any) => ({
        id: `college-${college.id}`,
        full_path: `/college/${college.slug}`,
        entity_type: "college" as const,
        entity_id: college.id,
        entity_name: college.name,
        status: college.status || "active",
        created_at: college.created_at,
        updated_at: college.updated_at,
      }));

      // Transform scholarships to slug records
      const scholarshipSlugs: SlugRecord[] = scholarships.map((scholarship: any) => ({
        id: `scholarship-${scholarship.id}`,
        full_path: `/scholarship/${scholarship.slug}`,
        entity_type: "scholarship" as const,
        entity_id: scholarship.id,
        entity_name: scholarship.name,
        status: scholarship.status || "active",
        created_at: scholarship.created_at,
        updated_at: scholarship.updated_at,
      }));

      // Transform campaigns to slug records
      const campaignSlugs: SlugRecord[] = campaigns.map((campaign: any) => {
        // Determine path prefix based on campaign type
        const pathPrefix = campaign.type === "landing_page" ? "/lp" : "/ad";

        return {
          id: `campaign-${campaign.id}`,
          full_path: `${pathPrefix}/${campaign.slug}`,
          entity_type: "campaign" as const,
          entity_id: campaign.id,
          entity_name: campaign.name,
          status: campaign.status || "active",
          created_at: campaign.created_at,
          updated_at: campaign.updated_at,
        };
      });

      // Combine all slugs
      const allSlugs = [
        ...examSlugs,
        ...collegeSlugs,
        ...scholarshipSlugs,
        ...campaignSlugs,
      ];

      // Sort by created_at (newest first)
      allSlugs.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      return allSlugs;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to fetch slug registry");
    }
  },
};
