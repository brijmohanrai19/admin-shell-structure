import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SlugInput } from "@/components/admin/shared/slug-input";
import { SEOEditor, SEO } from "@/components/admin/seo/seo-editor";
import {
  CrawlPolicyEditor,
  CrawlPolicy,
} from "@/components/admin/shared/crawl-policy-editor";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { X, Plus } from "lucide-react";

export interface ExamFormData {
  name: string;
  slug: string;
  conducting_body: string;

  // Dates
  exam_date: string | null;
  application_start_date: string | null;
  application_end_date: string | null;
  result_date: string | null;
  counselling_start_date: string | null;
  counselling_end_date: string | null;

  // Exam Details
  exam_mode: string;
  exam_level: string;

  // Fees
  application_fee_general: number | null;
  application_fee_reserved: number | null;
  late_fee: number | null;

  // Links
  official_website: string;
  application_link: string;
  result_link: string;
  important_links: Record<string, string>;

  // Content
  description: string;
  eligibility: string;
  exam_pattern: string;

  // Meta
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

    // Dates
    exam_date: initialData?.exam_date || null,
    application_start_date: initialData?.application_start_date || null,
    application_end_date: initialData?.application_end_date || null,
    result_date: initialData?.result_date || null,
    counselling_start_date: initialData?.counselling_start_date || null,
    counselling_end_date: initialData?.counselling_end_date || null,

    // Exam Details
    exam_mode: initialData?.exam_mode || "Online",
    exam_level: initialData?.exam_level || "National",

    // Fees
    application_fee_general: initialData?.application_fee_general || null,
    application_fee_reserved: initialData?.application_fee_reserved || null,
    late_fee: initialData?.late_fee || null,

    // Links
    official_website: initialData?.official_website || "",
    application_link: initialData?.application_link || "",
    result_link: initialData?.result_link || "",
    important_links: initialData?.important_links || {},

    // Content
    description: initialData?.description || "",
    eligibility: initialData?.eligibility || "",
    exam_pattern: initialData?.exam_pattern || "",

    // Meta
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

      {/* Tabbed Form */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="dates">Important Dates</TabsTrigger>
          <TabsTrigger value="fees">Fees & Links</TabsTrigger>
          <TabsTrigger value="seo">SEO & Settings</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-4 mt-4">
          <Card>
            <CardContent className="space-y-4 pt-6">
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
                  placeholder="e.g., GATE 2026"
                  disabled={disabled}
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
                  placeholder="e.g., IIT"
                  disabled={disabled}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exam_mode">Exam Mode</Label>
                  <Select
                    value={formData.exam_mode}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, exam_mode: value }))
                    }
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Offline">Offline</SelectItem>
                      <SelectItem value="Both">Both (Online & Offline)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exam_level">Exam Level</Label>
                  <Select
                    value={formData.exam_level}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, exam_level: value }))
                    }
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="National">National</SelectItem>
                      <SelectItem value="State">State</SelectItem>
                      <SelectItem value="University">University</SelectItem>
                      <SelectItem value="International">International</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority (higher = shows first)</Label>
                <Input
                  id="priority"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="0-100"
                  disabled={disabled}
                />
              </div>

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
                  disabled={disabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eligibility">Eligibility Criteria</Label>
                <Textarea
                  id="eligibility"
                  value={formData.eligibility}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, eligibility: e.target.value }))
                  }
                  rows={4}
                  placeholder="Eligibility criteria..."
                  disabled={disabled}
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
                  disabled={disabled}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Important Dates Tab */}
        <TabsContent value="dates" className="space-y-4 mt-4">
          <Card>
            <CardContent className="space-y-4 pt-6">
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
                  disabled={disabled}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    disabled={disabled}
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
                    disabled={disabled}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="result-date">Result Declaration Date</Label>
                <Input
                  id="result-date"
                  type="date"
                  value={formData.result_date || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      result_date: e.target.value || null,
                    }))
                  }
                  disabled={disabled}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="counselling-start">Counselling Start Date</Label>
                  <Input
                    id="counselling-start"
                    type="date"
                    value={formData.counselling_start_date || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        counselling_start_date: e.target.value || null,
                      }))
                    }
                    disabled={disabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="counselling-end">Counselling End Date</Label>
                  <Input
                    id="counselling-end"
                    type="date"
                    value={formData.counselling_end_date || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        counselling_end_date: e.target.value || null,
                      }))
                    }
                    disabled={disabled}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fees & Links Tab */}
        <TabsContent value="fees" className="space-y-4 mt-4">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <h3 className="text-lg font-semibold">Application Fees</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fee-general">General Category (₹)</Label>
                  <Input
                    id="fee-general"
                    type="number"
                    value={formData.application_fee_general || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        application_fee_general: e.target.value ? parseInt(e.target.value) : null,
                      }))
                    }
                    placeholder="1500"
                    disabled={disabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fee-reserved">Reserved Category (₹)</Label>
                  <Input
                    id="fee-reserved"
                    type="number"
                    value={formData.application_fee_reserved || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        application_fee_reserved: e.target.value ? parseInt(e.target.value) : null,
                      }))
                    }
                    placeholder="750"
                    disabled={disabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="late-fee">Late Fee (₹)</Label>
                  <Input
                    id="late-fee"
                    type="number"
                    value={formData.late_fee || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        late_fee: e.target.value ? parseInt(e.target.value) : null,
                      }))
                    }
                    placeholder="500"
                    disabled={disabled}
                  />
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold mb-4">Important Links</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="official-website">Official Website</Label>
                    <Input
                      id="official-website"
                      type="url"
                      value={formData.official_website}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          official_website: e.target.value,
                        }))
                      }
                      placeholder="https://exam.gov.in"
                      disabled={disabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="application-link">Application Link</Label>
                    <Input
                      id="application-link"
                      type="url"
                      value={formData.application_link}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          application_link: e.target.value,
                        }))
                      }
                      placeholder="https://apply.exam.gov.in"
                      disabled={disabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="result-link">Result Link</Label>
                    <Input
                      id="result-link"
                      type="url"
                      value={formData.result_link}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          result_link: e.target.value,
                        }))
                      }
                      placeholder="https://results.exam.gov.in"
                      disabled={disabled}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold mb-4">Additional Links</h3>

                {Object.entries(formData.important_links).length > 0 && (
                  <div className="space-y-2 mb-4">
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
                          disabled={disabled}
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
                    placeholder="Label (e.g., Admit Card)"
                    disabled={disabled}
                  />
                  <Input
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="URL (e.g., https://admitcard.exam.gov.in)"
                    type="url"
                    disabled={disabled}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddLink}
                  className="w-full mt-2"
                  disabled={disabled}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO & Settings Tab */}
        <TabsContent value="seo" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
              <SEOEditor
                value={formData.seo}
                onChange={(seo) => setFormData((prev) => ({ ...prev, seo }))}
                entityName={formData.name}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Crawl Policy</h3>
              <CrawlPolicyEditor
                value={formData.crawl_policy}
                onChange={(crawl_policy) =>
                  setFormData((prev) => ({ ...prev, crawl_policy }))
                }
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
