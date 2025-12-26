import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ChevronDown, ChevronUp, X, Plus } from "lucide-react";

export interface ExamFormData {
  name: string;
  slug: string;
  conducting_body: string;
  application_start_date: string | null;
  application_end_date: string | null;
  exam_date: string | null;
  description: string;
  eligibility: string;
  exam_pattern: string;
  important_links: Record<string, string>;
  priority: number;
  seo: SEO;
  crawl_policy: CrawlPolicy;
  status: "draft" | "live" | "closed" | "archived";
}

export interface ExamFormProps {
  initialData?: Partial<ExamFormData>;
  onSubmit: (data: ExamFormData) => void;
  onCancel: () => void;
  disabled?: boolean;
}

export function ExamForm({ initialData, onSubmit, onCancel, disabled }: ExamFormProps) {
  const [formData, setFormData] = useState<ExamFormData>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    conducting_body: initialData?.conducting_body || "",
    application_start_date: initialData?.application_start_date || null,
    application_end_date: initialData?.application_end_date || null,
    exam_date: initialData?.exam_date || null,
    description: initialData?.description || "",
    eligibility: initialData?.eligibility || "",
    exam_pattern: initialData?.exam_pattern || "",
    important_links: initialData?.important_links || {},
    priority: initialData?.priority || 0,
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
      sitemap_priority: 0.8,
      sitemap_changefreq: "weekly",
    },
    status: initialData?.status || "draft",
  });

  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [isCrawlPolicyOpen, setIsCrawlPolicyOpen] = useState(false);
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const handleSubmit = (status: "draft" | "live") => {
    // Validation
    if (!formData.name || !formData.slug || !formData.conducting_body) {
      alert("Please fill required fields: Name, Slug, and Conducting Body");
      return;
    }

    // Call onSubmit
    onSubmit({ ...formData, status });
  };

  const handleAddLink = () => {
    if (linkLabel.trim() && linkUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        important_links: {
          ...prev.important_links,
          [linkLabel]: linkUrl,
        },
      }));
      setLinkLabel("");
      setLinkUrl("");
    }
  };

  const handleRemoveLink = (label: string) => {
    const newLinks = { ...formData.important_links };
    delete newLinks[label];
    setFormData((prev) => ({
      ...prev,
      important_links: newLinks,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {initialData ? "Edit Exam" : "Create New Exam"}
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
              Exam Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., VITEEE 2026"
            />
          </div>

          <SlugInput
            value={formData.slug}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, slug: value }))
            }
            prefix="exam"
            entityType="exam"
          />

          <div className="space-y-2">
            <Label htmlFor="conducting-body">
              Conducting Body <span className="text-destructive">*</span>
            </Label>
            <Input
              id="conducting-body"
              value={formData.conducting_body}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  conducting_body: e.target.value,
                }))
              }
              placeholder="e.g., VIT University"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="app-start-date">Application Start Date</Label>
              <Input
                id="app-start-date"
                type="date"
                value={formData.application_start_date || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    application_start_date: e.target.value || null,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="app-end-date">Application End Date</Label>
              <Input
                id="app-end-date"
                type="date"
                value={formData.application_end_date || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    application_end_date: e.target.value || null,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exam-date">Exam Date</Label>
              <Input
                id="exam-date"
                type="date"
                value={formData.exam_date || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    exam_date: e.target.value || null,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Input
              id="priority"
              type="number"
              value={formData.priority}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priority: parseInt(e.target.value) || 0,
                }))
              }
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">
              Higher priority = shown first
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={6}
              placeholder="Detailed description of the exam..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eligibility">Eligibility</Label>
            <Textarea
              id="eligibility"
              value={formData.eligibility}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, eligibility: e.target.value }))
              }
              rows={4}
              placeholder="Eligibility criteria..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exam-pattern">Exam Pattern</Label>
            <Textarea
              id="exam-pattern"
              value={formData.exam_pattern}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, exam_pattern: e.target.value }))
              }
              rows={4}
              placeholder="Exam pattern details..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Important Links */}
      <Card>
        <CardHeader>
          <CardTitle>Important Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(formData.important_links).length > 0 && (
            <div className="space-y-2">
              {Object.entries(formData.important_links).map(([label, url]) => (
                <div
                  key={label}
                  className="flex gap-2 items-center p-2 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {url}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveLink(label)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Input
              value={linkLabel}
              onChange={(e) => setLinkLabel(e.target.value)}
              placeholder="Label (e.g., Official Website)"
            />
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="URL (e.g., https://example.com)"
              type="url"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddLink}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </Button>
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
            <Button type="button" variant="outline" onClick={onCancel} disabled={disabled}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleSubmit("draft")}
              disabled={disabled}
            >
              Save Draft
            </Button>
            <Button type="button" onClick={() => handleSubmit("live")} disabled={disabled}>
              Publish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
