import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SlugInput } from "@/components/admin/shared/slug-input";
import { SEOEditor, SEO } from "@/components/admin/seo/seo-editor";
import {
  CrawlPolicyEditor,
  CrawlPolicy,
} from "@/components/admin/shared/crawl-policy-editor";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface ScholarshipFormData {
  name: string;
  slug: string;
  provider_name: string;
  provider_type: "Government" | "Private" | "NGO" | "Corporate";
  amount_min: number | null;
  amount_max: number | null;
  currency: "INR" | "USD" | "EUR";
  eligibility_criteria: string;
  benefits: string;
  application_process: string;
  application_deadline: string | null;
  seo: SEO;
  crawl_policy: CrawlPolicy;
  status: "draft" | "live" | "closed" | "archived";
}

export interface ScholarshipFormProps {
  initialData?: Partial<ScholarshipFormData>;
  onSubmit: (data: ScholarshipFormData) => void;
  onCancel: () => void;
}

export function ScholarshipForm({
  initialData,
  onSubmit,
  onCancel,
}: ScholarshipFormProps) {
  const [formData, setFormData] = useState<ScholarshipFormData>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    provider_name: initialData?.provider_name || "",
    provider_type: initialData?.provider_type || "Government",
    amount_min: initialData?.amount_min || null,
    amount_max: initialData?.amount_max || null,
    currency: initialData?.currency || "INR",
    eligibility_criteria: initialData?.eligibility_criteria || "",
    benefits: initialData?.benefits || "",
    application_process: initialData?.application_process || "",
    application_deadline: initialData?.application_deadline || null,
    seo: initialData?.seo || {
      title: "",
      description: "",
      keywords: [],
      og_image_url: null,
      og_title: null,
      og_description: null,
      twitter_card_type: null,
      twitter_image_url: null,
    },
    crawl_policy: initialData?.crawl_policy || {
      indexable: true,
      follow_links: true,
      canonical_url: null,
      sitemap_include: true,
      sitemap_priority: 0.7,
      sitemap_changefreq: "monthly",
    },
    status: initialData?.status || "draft",
  });

  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [isCrawlPolicyOpen, setIsCrawlPolicyOpen] = useState(false);

  const handleSubmit = (status: "draft" | "live") => {
    // Validation
    if (
      !formData.name ||
      !formData.slug ||
      !formData.provider_name ||
      !formData.eligibility_criteria
    ) {
      alert(
        "Please fill required fields: Name, Slug, Provider Name, and Eligibility Criteria"
      );
      return;
    }

    // Amount validation
    if (
      formData.amount_min !== null &&
      formData.amount_max !== null &&
      formData.amount_min > formData.amount_max
    ) {
      alert("Minimum amount cannot be greater than maximum amount");
      return;
    }

    // Call onSubmit
    onSubmit({ ...formData, status });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {initialData ? "Edit Scholarship" : "Create New Scholarship"}
        </h2>
        {initialData && <StatusBadge status={formData.status} />}
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Scholarship Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., National Merit Scholarship 2026"
            />
          </div>

          <SlugInput
            value={formData.slug}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, slug: value }))
            }
            prefix="scholarship"
            entityType="scholarship"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="provider-name">
                Provider Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="provider-name"
                value={formData.provider_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    provider_name: e.target.value,
                  }))
                }
                placeholder="e.g., Govt of India"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider-type">Provider Type</Label>
              <Select
                value={formData.provider_type}
                onValueChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    provider_type: val as ScholarshipFormData["provider_type"],
                  }))
                }
              >
                <SelectTrigger id="provider-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Government">Government</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="NGO">NGO</SelectItem>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Application Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.application_deadline || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  application_deadline: e.target.value || null,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Amount Details */}
      <Card>
        <CardHeader>
          <CardTitle>Amount Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount-min">Minimum Amount</Label>
              <Input
                id="amount-min"
                type="number"
                value={formData.amount_min || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    amount_min: e.target.value ? parseFloat(e.target.value) : null,
                  }))
                }
                placeholder="e.g., 10000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount-max">Maximum Amount</Label>
              <Input
                id="amount-max"
                type="number"
                value={formData.amount_max || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    amount_max: e.target.value ? parseFloat(e.target.value) : null,
                  }))
                }
                placeholder="e.g., 100000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    currency: val as "INR" | "USD" | "EUR",
                  }))
                }
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Leave blank if amount varies
          </p>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eligibility">
              Eligibility Criteria <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="eligibility"
              value={formData.eligibility_criteria}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  eligibility_criteria: e.target.value,
                }))
              }
              rows={6}
              placeholder="Who can apply for this scholarship..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="benefits">Benefits</Label>
            <Textarea
              id="benefits"
              value={formData.benefits}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, benefits: e.target.value }))
              }
              rows={4}
              placeholder="What benefits does this scholarship provide..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="application-process">Application Process</Label>
            <Textarea
              id="application-process"
              value={formData.application_process}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  application_process: e.target.value,
                }))
              }
              rows={4}
              placeholder="How to apply for this scholarship..."
            />
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Collapsible open={isSeoOpen} onOpenChange={setIsSeoOpen}>
        <Card>
          <CardHeader>
            <CollapsibleTrigger className="flex items-center justify-between w-full hover:text-primary">
              <CardTitle>SEO Settings</CardTitle>
              {isSeoOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <SEOEditor
                value={formData.seo}
                onChange={(seo) => setFormData((prev) => ({ ...prev, seo }))}
                entityName={formData.name}
              />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Crawl Policy */}
      <Collapsible open={isCrawlPolicyOpen} onOpenChange={setIsCrawlPolicyOpen}>
        <Card>
          <CardHeader>
            <CollapsibleTrigger className="flex items-center justify-between w-full hover:text-primary">
              <CardTitle>Crawl Policy</CardTitle>
              {isCrawlPolicyOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <CrawlPolicyEditor
                value={formData.crawl_policy}
                onChange={(crawl_policy) =>
                  setFormData((prev) => ({ ...prev, crawl_policy }))
                }
              />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Form Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleSubmit("draft")}
            >
              Save Draft
            </Button>
            <Button type="button" onClick={() => handleSubmit("live")}>
              Publish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
