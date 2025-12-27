import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { CoursesEditor, Course } from "./courses-editor";
import { X } from "lucide-react";

export interface CollegeFormData {
  name: string;
  slug: string;

  // Location
  city: string;
  state: string;
  country: string;
  address: string;
  pincode: string;

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
  fee_range: {
    min: number | null;
    max: number | null;
    currency: "INR" | "USD" | "EUR";
  };
  intake: number | null;
  approvals: string[];

  // Rankings & Placements
  nirf_rank: number | null;
  qs_rank: number | null;
  placement_percentage: number | null;
  average_package: number | null;
  highest_package: number | null;

  // Content
  description: string;
  admission_process: string;

  // Meta
  priority: number;
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

    // Location
    city: initialData?.city || "",
    state: initialData?.state || "",
    country: initialData?.country || "India",
    address: initialData?.address || "",
    pincode: initialData?.pincode || "",

    // Contact
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    website: initialData?.website || "",

    // Establishment
    year_established: initialData?.year_established || null,
    college_type: initialData?.college_type || "Private",
    university_affiliation: initialData?.university_affiliation || "",

    // Courses & Fees
    courses: initialData?.courses || [],
    fee_range: initialData?.fee_range || {
      min: null,
      max: null,
      currency: "INR",
    },
    intake: initialData?.intake || null,
    approvals: initialData?.approvals || [],

    // Rankings & Placements
    nirf_rank: initialData?.nirf_rank || null,
    qs_rank: initialData?.qs_rank || null,
    placement_percentage: initialData?.placement_percentage || null,
    average_package: initialData?.average_package || null,
    highest_package: initialData?.highest_package || null,

    // Content
    description: initialData?.description || "",
    admission_process: initialData?.admission_process || "",

    // Meta
    priority: initialData?.priority || 0,
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

      {/* Tabbed Form */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="contact">Contact & Location</TabsTrigger>
          <TabsTrigger value="courses">Courses & Fees</TabsTrigger>
          <TabsTrigger value="rankings">Rankings & Placements</TabsTrigger>
          <TabsTrigger value="seo">SEO & Settings</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-4 mt-4">
          <Card>
            <CardContent className="space-y-4 pt-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="college_type">College Type</Label>
                  <Select
                    value={formData.college_type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, college_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Government">Government</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                      <SelectItem value="Deemed">Deemed University</SelectItem>
                      <SelectItem value="Autonomous">Autonomous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year_established">Year Established</Label>
                  <Input
                    id="year_established"
                    type="number"
                    value={formData.year_established || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        year_established: e.target.value ? parseInt(e.target.value) : null,
                      }))
                    }
                    placeholder="1984"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="university_affiliation">University Affiliation</Label>
                <Input
                  id="university_affiliation"
                  value={formData.university_affiliation}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      university_affiliation: e.target.value,
                    }))
                  }
                  placeholder="e.g., Anna University"
                />
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
                      priority: e.target.value ? parseInt(e.target.value) : 0,
                    }))
                  }
                  placeholder="0-100"
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
        </TabsContent>

        {/* Contact & Location Tab */}
        <TabsContent value="contact" className="space-y-4 mt-4">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, address: e.target.value }))
                  }
                  rows={3}
                  placeholder="Full address of the college"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, pincode: e.target.value }))
                  }
                  placeholder="632014"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="info@college.edu"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, website: e.target.value }))
                  }
                  placeholder="https://www.college.edu"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Courses & Fees Tab */}
        <TabsContent value="courses" className="space-y-4 mt-4">
          <CoursesEditor
            value={formData.courses}
            onChange={(courses) =>
              setFormData((prev) => ({ ...prev, courses }))
            }
          />

          <Card>
            <CardContent className="space-y-4 pt-6">
              <h3 className="text-lg font-semibold">Fee Range</h3>

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

              <div className="space-y-2">
                <Label htmlFor="intake">Student Intake</Label>
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

          <Card>
            <CardContent className="space-y-4 pt-6">
              <h3 className="text-lg font-semibold">Approvals</h3>

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
        </TabsContent>

        {/* Rankings & Placements Tab */}
        <TabsContent value="rankings" className="space-y-4 mt-4">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <h3 className="text-lg font-semibold">Rankings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nirf_rank">NIRF Rank</Label>
                  <Input
                    id="nirf_rank"
                    type="number"
                    value={formData.nirf_rank || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        nirf_rank: e.target.value ? parseInt(e.target.value) : null,
                      }))
                    }
                    placeholder="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qs_rank">QS World Rank</Label>
                  <Input
                    id="qs_rank"
                    type="number"
                    value={formData.qs_rank || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        qs_rank: e.target.value ? parseInt(e.target.value) : null,
                      }))
                    }
                    placeholder="100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 pt-6">
              <h3 className="text-lg font-semibold">Placements</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="placement_percentage">Placement Rate (%)</Label>
                  <Input
                    id="placement_percentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.placement_percentage || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        placement_percentage: e.target.value ? parseFloat(e.target.value) : null,
                      }))
                    }
                    placeholder="95.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="average_package">Average Package (₹)</Label>
                  <Input
                    id="average_package"
                    type="number"
                    value={formData.average_package || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        average_package: e.target.value ? parseInt(e.target.value) : null,
                      }))
                    }
                    placeholder="800000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="highest_package">Highest Package (₹)</Label>
                  <Input
                    id="highest_package"
                    type="number"
                    value={formData.highest_package || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        highest_package: e.target.value ? parseInt(e.target.value) : null,
                      }))
                    }
                    placeholder="4500000"
                  />
                </div>
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

          <Card>
            <CardContent className="space-y-4 pt-6">
              <h3 className="text-lg font-semibold">Form Schema</h3>
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
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Leave as default to use the standard college enquiry form
                </p>
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
