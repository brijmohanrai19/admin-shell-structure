import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SlugInput } from "@/components/admin/shared/slug-input";
import { SEOEditor, SEO } from "@/components/admin/seo/seo-editor";
import {
  CrawlPolicyEditor,
  CrawlPolicy,
} from "@/components/admin/shared/crawl-policy-editor";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Plus, X } from "lucide-react";

export interface ScholarshipFormData {
  name: string;
  slug: string;
  provider_name: string;
  provider_type: "Government" | "Private" | "NGO" | "Corporate";

  // Type & Duration
  scholarship_type: string;
  level: string;
  duration: string;
  number_of_awards: number | null;
  renewable: boolean;

  // Amount
  amount_min: number | null;
  amount_max: number | null;
  currency: "INR" | "USD" | "EUR";
  coverage: string;
  disbursement_schedule: string;

  // Eligibility
  eligibility_criteria: string;
  minimum_marks: number | null;
  income_limit: number | null;
  age_limit: number | null;
  gender: string;
  category: string[];
  disability_eligible: boolean;

  // Dates
  announcement_date: string | null;
  application_start_date: string | null;
  application_end_date: string | null;
  deadline: string | null;
  result_date: string | null;

  // Process
  benefits: string;
  application_process: string;
  documents_required: string[];
  selection_process: string;
  how_to_apply: string;

  // Links
  official_website: string;
  application_link: string;
  guidelines_pdf: string;

  // Media
  logo_url: string;
  banner_image: string;

  // Content
  description: string;

  // Meta
  seo: SEO;
  crawl_policy: CrawlPolicy;
  form_schema_id: string | null;
  priority: number;
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

    // Type & Duration
    scholarship_type: initialData?.scholarship_type || "",
    level: initialData?.level || "",
    duration: initialData?.duration || "",
    number_of_awards: initialData?.number_of_awards || null,
    renewable: initialData?.renewable || false,

    // Amount
    amount_min: initialData?.amount_min || null,
    amount_max: initialData?.amount_max || null,
    currency: initialData?.currency || "INR",
    coverage: initialData?.coverage || "",
    disbursement_schedule: initialData?.disbursement_schedule || "",

    // Eligibility
    eligibility_criteria: initialData?.eligibility_criteria || "",
    minimum_marks: initialData?.minimum_marks || null,
    income_limit: initialData?.income_limit || null,
    age_limit: initialData?.age_limit || null,
    gender: initialData?.gender || "All",
    category: initialData?.category || [],
    disability_eligible: initialData?.disability_eligible || false,

    // Dates
    announcement_date: initialData?.announcement_date || null,
    application_start_date: initialData?.application_start_date || null,
    application_end_date: initialData?.application_end_date || null,
    deadline: initialData?.deadline || null,
    result_date: initialData?.result_date || null,

    // Process
    benefits: initialData?.benefits || "",
    application_process: initialData?.application_process || "",
    documents_required: initialData?.documents_required || [],
    selection_process: initialData?.selection_process || "",
    how_to_apply: initialData?.how_to_apply || "",

    // Links
    official_website: initialData?.official_website || "",
    application_link: initialData?.application_link || "",
    guidelines_pdf: initialData?.guidelines_pdf || "",

    // Media
    logo_url: initialData?.logo_url || "",
    banner_image: initialData?.banner_image || "",

    // Content
    description: initialData?.description || "",

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
      sitemap_priority: 0.7,
      sitemap_changefreq: "monthly",
    },
    form_schema_id: initialData?.form_schema_id || null,
    status: initialData?.status || "draft",
  });

  const [newDocument, setNewDocument] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = (status: "draft" | "live" | "closed" | "archived") => {
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

  const addDocument = () => {
    if (newDocument.trim()) {
      setFormData((prev) => ({
        ...prev,
        documents_required: [...prev.documents_required, newDocument.trim()],
      }));
      setNewDocument("");
    }
  };

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents_required: prev.documents_required.filter((_, i) => i !== index),
    }));
  };

  const addCategory = () => {
    if (newCategory.trim() && !formData.category.includes(newCategory.trim())) {
      setFormData((prev) => ({
        ...prev,
        category: [...prev.category, newCategory.trim()],
      }));
      setNewCategory("");
    }
  };

  const removeCategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.filter((_, i) => i !== index),
    }));
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

      {/* Tabs */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="dates">Important Dates</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility & Process</TabsTrigger>
          <TabsTrigger value="seo">SEO & Settings</TabsTrigger>
        </TabsList>

        {/* TAB 1: BASIC INFO */}
        <TabsContent value="basic" className="space-y-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scholarship-type">Scholarship Type</Label>
                  <Select
                    value={formData.scholarship_type}
                    onValueChange={(val) =>
                      setFormData((prev) => ({ ...prev, scholarship_type: val }))
                    }
                  >
                    <SelectTrigger id="scholarship-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Merit-based">Merit-based</SelectItem>
                      <SelectItem value="Need-based">Need-based</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                      <SelectItem value="Research">Research</SelectItem>
                      <SelectItem value="Community Service">Community Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(val) =>
                      setFormData((prev) => ({ ...prev, level: val }))
                    }
                  >
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pre-Matric">Pre-Matric</SelectItem>
                      <SelectItem value="Post-Matric">Post-Matric</SelectItem>
                      <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, duration: e.target.value }))
                    }
                    placeholder="e.g., 1 year, 4 years"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number-of-awards">Number of Awards</Label>
                  <Input
                    id="number-of-awards"
                    type="number"
                    value={formData.number_of_awards || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        number_of_awards: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      }))
                    }
                    placeholder="e.g., 100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority (0-100)</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        priority: e.target.value ? parseInt(e.target.value) : 0,
                      }))
                    }
                    placeholder="Higher = shows first"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="renewable"
                  checked={formData.renewable}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, renewable: checked === true }))
                  }
                />
                <Label htmlFor="renewable" className="font-normal cursor-pointer">
                  Renewable scholarship
                </Label>
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
                  placeholder="Detailed description of the scholarship..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Amount Details */}
          <Card>
            <CardHeader>
              <CardTitle>Amount & Coverage</CardTitle>
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
                        amount_min: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
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
                        amount_max: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
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

              <div className="space-y-2">
                <Label htmlFor="coverage">Coverage</Label>
                <Input
                  id="coverage"
                  value={formData.coverage}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, coverage: e.target.value }))
                  }
                  placeholder="e.g., Tuition fees, Books, Accommodation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="disbursement-schedule">Disbursement Schedule</Label>
                <Input
                  id="disbursement-schedule"
                  value={formData.disbursement_schedule}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      disbursement_schedule: e.target.value,
                    }))
                  }
                  placeholder="e.g., Annual, Semester-wise, Monthly"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Leave amount blank if it varies
              </p>
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle>Important Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  placeholder="https://example.com"
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
                  placeholder="https://apply.example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guidelines-pdf">Guidelines PDF URL</Label>
                <Input
                  id="guidelines-pdf"
                  type="url"
                  value={formData.guidelines_pdf}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      guidelines_pdf: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/guidelines.pdf"
                />
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo-url">Logo URL</Label>
                <Input
                  id="logo-url"
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, logo_url: e.target.value }))
                  }
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner-image">Banner Image URL</Label>
                <Input
                  id="banner-image"
                  type="url"
                  value={formData.banner_image}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      banner_image: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: IMPORTANT DATES */}
        <TabsContent value="dates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Important Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="announcement-date">Announcement Date</Label>
                  <Input
                    id="announcement-date"
                    type="date"
                    value={formData.announcement_date || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        announcement_date: e.target.value || null,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="application-start-date">
                    Application Start Date
                  </Label>
                  <Input
                    id="application-start-date"
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="application-end-date">
                    Application End Date
                  </Label>
                  <Input
                    id="application-end-date"
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
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        deadline: e.target.value || null,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="result-date">Result Date</Label>
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
                />
              </div>

              <p className="text-sm text-muted-foreground">
                All dates are optional. Leave blank if not applicable.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: ELIGIBILITY & PROCESS */}
        <TabsContent value="eligibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Eligibility Criteria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eligibility-criteria">
                  Eligibility Criteria <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="eligibility-criteria"
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minimum-marks">Minimum Marks (%)</Label>
                  <Input
                    id="minimum-marks"
                    type="number"
                    step="0.01"
                    value={formData.minimum_marks || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        minimum_marks: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      }))
                    }
                    placeholder="e.g., 60.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="income-limit">Income Limit (Annual)</Label>
                  <Input
                    id="income-limit"
                    type="number"
                    value={formData.income_limit || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        income_limit: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      }))
                    }
                    placeholder="e.g., 500000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age-limit">Age Limit (Max)</Label>
                  <Input
                    id="age-limit"
                    type="number"
                    value={formData.age_limit || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        age_limit: e.target.value ? parseInt(e.target.value) : null,
                      }))
                    }
                    placeholder="e.g., 25"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, gender: val }))
                  }
                >
                  <SelectTrigger id="gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g., SC, ST, OBC, General"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCategory();
                      }
                    }}
                  />
                  <Button type="button" size="sm" onClick={addCategory}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.category.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.category.map((cat, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm"
                      >
                        {cat}
                        <button
                          type="button"
                          onClick={() => removeCategory(index)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="disability-eligible"
                  checked={formData.disability_eligible}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      disability_eligible: checked === true,
                    }))
                  }
                />
                <Label
                  htmlFor="disability-eligible"
                  className="font-normal cursor-pointer"
                >
                  Eligible for persons with disabilities
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Application Process */}
          <Card>
            <CardHeader>
              <CardTitle>Application Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="how-to-apply">How to Apply</Label>
                <Textarea
                  id="how-to-apply"
                  value={formData.how_to_apply}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      how_to_apply: e.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Step-by-step application instructions..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="selection-process">Selection Process</Label>
                <Textarea
                  id="selection-process"
                  value={formData.selection_process}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      selection_process: e.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="How candidates are selected..."
                />
              </div>

              <div className="space-y-2">
                <Label>Documents Required</Label>
                <div className="flex gap-2">
                  <Input
                    value={newDocument}
                    onChange={(e) => setNewDocument(e.target.value)}
                    placeholder="e.g., Aadhar Card, Income Certificate"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addDocument();
                      }
                    }}
                  />
                  <Button type="button" size="sm" onClick={addDocument}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.documents_required.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                    {formData.documents_required.map((doc, index) => (
                      <li key={index} className="flex items-center gap-2">
                        {doc}
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: SEO & SETTINGS */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <SEOEditor
                value={formData.seo}
                onChange={(seo) => setFormData((prev) => ({ ...prev, seo }))}
                entityName={formData.name}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Crawl Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <CrawlPolicyEditor
                value={formData.crawl_policy}
                onChange={(crawl_policy) =>
                  setFormData((prev) => ({ ...prev, crawl_policy }))
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="form-schema-id">Form Schema ID</Label>
                <Input
                  id="form-schema-id"
                  value={formData.form_schema_id || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      form_schema_id: e.target.value || null,
                    }))
                  }
                  placeholder="Optional custom form schema ID"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
