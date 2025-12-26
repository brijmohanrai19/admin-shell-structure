import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { CoursesEditor, Course } from "./courses-editor";
import { ChevronDown, ChevronUp, X } from "lucide-react";

export interface CollegeFormData {
  name: string;
  slug: string;
  city: string;
  state: string;
  country: string;
  intake: number | null;
  courses: Course[];
  fee_range: {
    min: number | null;
    max: number | null;
    currency: "INR" | "USD" | "EUR";
  };
  approvals: string[];
  description: string;
  admission_process: string;
  form_schema_id: string | null;
  seo: SEO;
  crawl_policy: CrawlPolicy;
  status: "draft" | "live" | "closed" | "archived";
}

export interface CollegeFormProps {
  initialData?: Partial<CollegeFormData>;
  onSubmit: (data: CollegeFormData) => void;
  onCancel: () => void;
}

export function CollegeForm({
  initialData,
  onSubmit,
  onCancel,
}: CollegeFormProps) {
  const [formData, setFormData] = useState<CollegeFormData>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    country: initialData?.country || "India",
    intake: initialData?.intake || null,
    courses: initialData?.courses || [],
    fee_range: initialData?.fee_range || {
      min: null,
      max: null,
      currency: "INR",
    },
    approvals: initialData?.approvals || [],
    description: initialData?.description || "",
    admission_process: initialData?.admission_process || "",
    form_schema_id: initialData?.form_schema_id || null,
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
  const [approvalInput, setApprovalInput] = useState("");

  const handleSubmit = (status: "draft" | "live") => {
    // Validation
    if (!formData.name || !formData.slug || !formData.city || !formData.state) {
      alert("Please fill required fields: Name, Slug, City, and State");
      return;
    }

    // Require at least 1 course for publish
    if (status === "live" && formData.courses.length === 0) {
      alert("Please add at least one course before publishing");
      return;
    }

    // Fee range validation
    if (
      formData.fee_range.min !== null &&
      formData.fee_range.max !== null &&
      formData.fee_range.min > formData.fee_range.max
    ) {
      alert("Minimum fee cannot be greater than maximum fee");
      return;
    }

    // Call onSubmit
    onSubmit({ ...formData, status });
  };

  const handleAddApproval = () => {
    if (approvalInput.trim()) {
      const newApprovals = approvalInput
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a && !formData.approvals.includes(a));

      if (newApprovals.length > 0) {
        setFormData((prev) => ({
          ...prev,
          approvals: [...prev.approvals, ...newApprovals],
        }));
      }
      setApprovalInput("");
    }
  };

  const handleRemoveApproval = (approval: string) => {
    setFormData((prev) => ({
      ...prev,
      approvals: prev.approvals.filter((a) => a !== approval),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {initialData ? "Edit College" : "Create New College"}
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
              College Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., VIT Vellore"
            />
          </div>

          <SlugInput
            value={formData.slug}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, slug: value }))
            }
            prefix="college"
            entityType="college"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
                placeholder="e.g., Vellore"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">
                State <span className="text-destructive">*</span>
              </Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, state: e.target.value }))
                }
                placeholder="e.g., Tamil Nadu"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, country: e.target.value }))
                }
                placeholder="e.g., India"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="intake">Intake (Optional)</Label>
            <Input
              id="intake"
              type="number"
              value={formData.intake || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  intake: e.target.value ? parseInt(e.target.value) : null,
                }))
              }
              placeholder="Total student intake"
            />
          </div>
        </CardContent>
      </Card>

      {/* Courses */}
      <CoursesEditor
        value={formData.courses}
        onChange={(courses) =>
          setFormData((prev) => ({ ...prev, courses }))
        }
      />

      {/* Fee Range */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Range (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fee-min">Minimum Amount</Label>
              <Input
                id="fee-min"
                type="number"
                value={formData.fee_range.min || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fee_range: {
                      ...prev.fee_range,
                      min: e.target.value ? parseFloat(e.target.value) : null,
                    },
                  }))
                }
                placeholder="e.g., 100000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fee-max">Maximum Amount</Label>
              <Input
                id="fee-max"
                type="number"
                value={formData.fee_range.max || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fee_range: {
                      ...prev.fee_range,
                      max: e.target.value ? parseFloat(e.target.value) : null,
                    },
                  }))
                }
                placeholder="e.g., 500000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.fee_range.currency}
                onValueChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    fee_range: {
                      ...prev.fee_range,
                      currency: val as "INR" | "USD" | "EUR",
                    },
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
            Leave blank if fee amount varies by course
          </p>
        </CardContent>
      </Card>

      {/* Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Approvals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.approvals.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.approvals.map((approval) => (
                <Badge
                  key={approval}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {approval}
                  <button
                    type="button"
                    onClick={() => handleRemoveApproval(approval)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              value={approvalInput}
              onChange={(e) => setApprovalInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddApproval();
                }
              }}
              placeholder="e.g., AICTE, UGC, NAAC (comma-separated)"
            />
            <Button type="button" variant="outline" onClick={handleAddApproval}>
              Add
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Examples: AICTE, UGC, NAAC, NBA
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={6}
              placeholder="Detailed description of the college..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admission-process">Admission Process</Label>
            <Textarea
              id="admission-process"
              value={formData.admission_process}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  admission_process: e.target.value,
                }))
              }
              rows={4}
              placeholder="How to apply for admission..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Schema */}
      <Card>
        <CardHeader>
          <CardTitle>Form Schema (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="form-schema">Select Form Schema</Label>
            <Select
              value={formData.form_schema_id || "default"}
              onValueChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  form_schema_id: val === "default" ? null : val,
                }))
              }
            >
              <SelectTrigger id="form-schema">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default System Form</SelectItem>
                {/* TODO: Populate from API */}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Leave as default to use the standard college enquiry form
            </p>
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
