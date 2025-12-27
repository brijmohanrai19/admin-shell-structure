import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { WizardContainer } from "@/components/admin/campaigns/campaign-builder/wizard-container";
import { campaignsAPI, Campaign } from "@/services/api/campaigns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCampaign();
    }
  }, [id]);

  const loadCampaign = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await campaignsAPI.get(id!);
      setCampaign(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load campaign");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any, action: "draft" | "launch") => {
    try {
      setSaving(true);
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
        status: action === "launch" ? "live" : campaign?.status || "draft",
      };

      const updated = await campaignsAPI.update(id!, campaignData);
      setCampaign(updated);
      toast.success(action === "launch" ? "Campaign launched successfully!" : "Campaign updated successfully!");

      if (action === "launch") {
        navigate("/admin/campaigns");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update campaign";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/campaigns");
  };

  // Map campaign data to wizard format
  const getInitialData = () => {
    if (!campaign) return undefined;

    return {
      basics: {
        name: campaign.name,
        slug: campaign.slug,
        urlPrefix: campaign.url_prefix,
        entityType: campaign.entity_type,
        entityId: campaign.entity_id,
      },
      template: {
        templateId: campaign.template_id,
        version: campaign.template_version,
      },
      content: campaign.content_data,
      seo: {
        ...campaign.seo,
        crawlPolicy: campaign.crawl_policy,
        formSchemaId: campaign.form_schema_id,
      },
      tracking: {
        trackers: campaign.trackers,
      },
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !campaign) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <button onClick={loadCampaign} className="underline">
              Retry
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <Alert variant="destructive">
          <AlertDescription>Campaign not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isPublished = campaign.status === "live";

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {/* Template Lock Warning */}
      {isPublished && (
        <Alert className="mb-6">
          <AlertDescription>
            <strong>Note:</strong> This campaign is published. Template and form schema versions are locked and cannot be changed.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <WizardContainer
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={getInitialData()}
        isSubmitting={saving}
        mode="edit"
      />
    </div>
  );
}
