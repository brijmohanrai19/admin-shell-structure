import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WizardContainer } from "@/components/admin/campaigns/campaign-builder/wizard-container";
import { campaignsAPI } from "@/services/api/campaigns";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NewCampaign() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any, action: "draft" | "launch") => {
    try {
      setLoading(true);
      setError(null);

      // Map wizard data to Campaign API format
      const campaignData = {
        name: data.basics?.name || "",
        slug: data.basics?.slug || "",
        url_prefix: data.basics?.urlPrefix || "ad",
        entity_type: data.basics?.entityType || null,
        entity_id: data.basics?.entityId || null,
        template_id: data.template?.templateId || null,
        template_version: data.template?.version || null,
        content_data: data.content || {},
        seo: data.seo || {},
        crawl_policy: data.seo?.crawlPolicy || {},
        form_schema_id: data.seo?.formSchemaId || null,
        trackers: data.tracking?.trackers || [],
        status: action === "launch" ? "live" : "draft",
      };

      await campaignsAPI.create(campaignData);
      navigate("/admin/campaigns");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm("Discard changes and exit?")) {
      navigate("/admin/campaigns");
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <WizardContainer
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={loading}
      />
    </div>
  );
}
