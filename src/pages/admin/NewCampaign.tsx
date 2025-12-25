import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { StepIndicator } from "@/components/admin/StepIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Save, CheckCircle, Globe, Layout, FileText, Search, BarChart3 } from "lucide-react";

const steps = [
  { title: "Basics", description: "Name & URL configuration", icon: Globe },
  { title: "Template", description: "Select page template", icon: Layout },
  { title: "Content", description: "Page content & assets", icon: FileText },
  { title: "SEO & Crawl", description: "Meta tags & indexing", icon: Search },
  { title: "Tracking", description: "Analytics & UTM params", icon: BarChart3 },
];

export default function NewCampaign() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Create Landing Page"
        description="Set up a new URL-based landing page campaign"
        actions={
          <Link to="/admin/campaigns">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </Link>
        }
      />

      <div className="p-8 max-w-5xl">
        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {/* Step Content */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Basics */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pageName">Landing Page Name</Label>
                  <Input id="pageName" placeholder="e.g., JEE Main 2025 Preparation Guide" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urlSlug">URL Slug</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">/</span>
                    <Input id="urlSlug" placeholder="jee-main-2025" className="font-mono" />
                  </div>
                  <p className="text-xs text-muted-foreground">The URL path for this landing page</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="linkedExam">Linked Exam (Optional)</Label>
                    <Input id="linkedExam" placeholder="Select exam" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedCollege">Linked College (Optional)</Label>
                    <Input id="linkedCollege" placeholder="Select college" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pageDescription">Internal Description</Label>
                  <Textarea
                    id="pageDescription"
                    placeholder="Internal notes about this landing page..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Template */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="templateSelect">Page Template</Label>
                  <Input id="templateSelect" placeholder="Select a template" />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {["Exam LP", "College LP", "Scholarship LP", "Course LP", "Results LP", "Custom"].map((template) => (
                    <div
                      key={template}
                      className="border border-border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
                    >
                      <div className="aspect-video bg-muted rounded mb-3 flex items-center justify-center">
                        <Layout className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-sm">{template}</p>
                      <p className="text-xs text-muted-foreground">Template preview</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="templateVariant">Template Variant</Label>
                  <Input id="templateVariant" placeholder="Select variant (if available)" />
                </div>
              </div>
            )}

            {/* Step 3: Content */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Hero Title</Label>
                  <Input id="heroTitle" placeholder="Main headline for the landing page" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Textarea
                    id="heroSubtitle"
                    placeholder="Supporting text below the headline..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroImage">Hero Image URL</Label>
                  <Input id="heroImage" placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaText">CTA Button Text</Label>
                  <Input id="ctaText" placeholder="e.g., Apply Now, Learn More" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaUrl">CTA Button URL</Label>
                  <Input id="ctaUrl" placeholder="/apply or https://..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bodyContent">Page Body Content</Label>
                  <Textarea
                    id="bodyContent"
                    placeholder="Main content for the landing page (supports markdown)..."
                    rows={8}
                  />
                </div>
              </div>
            )}

            {/* Step 4: SEO & Crawl */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input id="metaTitle" placeholder="SEO title (60 chars max)" />
                  <p className="text-xs text-muted-foreground">0 / 60 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    placeholder="SEO description (160 chars max)..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">0 / 160 characters</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="canonicalUrl">Canonical URL (Optional)</Label>
                    <Input id="canonicalUrl" placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ogImage">OG Image URL</Label>
                    <Input id="ogImage" placeholder="Social share image URL" />
                  </div>
                </div>
                <div className="border border-border rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-sm">Crawl Settings</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="robotsIndex">Robots Index</Label>
                      <Input id="robotsIndex" placeholder="index / noindex" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="robotsFollow">Robots Follow</Label>
                      <Input id="robotsFollow" placeholder="follow / nofollow" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sitemapPriority">Sitemap Priority</Label>
                    <Input id="sitemapPriority" placeholder="0.5" type="number" step="0.1" min="0" max="1" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Tracking */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="border border-border rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-sm">UTM Parameters</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="utmSource">UTM Source</Label>
                      <Input id="utmSource" placeholder="e.g., google, facebook" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="utmMedium">UTM Medium</Label>
                      <Input id="utmMedium" placeholder="e.g., cpc, organic" />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="utmCampaign">UTM Campaign</Label>
                      <Input id="utmCampaign" placeholder="e.g., spring_2025" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="utmContent">UTM Content (Optional)</Label>
                      <Input id="utmContent" placeholder="e.g., banner_v1" />
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-sm">Tracking Pixels</h4>
                  <div className="space-y-2">
                    <Label htmlFor="gaTrackingId">Google Analytics ID</Label>
                    <Input id="gaTrackingId" placeholder="G-XXXXXXXXXX" className="font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fbPixelId">Facebook Pixel ID</Label>
                    <Input id="fbPixelId" placeholder="Pixel ID" className="font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customTracking">Custom Tracking Script</Label>
                    <Textarea
                      id="customTracking"
                      placeholder="<script>...</script>"
                      rows={4}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-6">
                  <h4 className="font-medium text-foreground mb-4">Landing Page Summary</h4>
                  <dl className="grid gap-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Page Name</dt>
                      <dd className="font-medium">Landing Page Placeholder</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">URL</dt>
                      <dd className="font-medium font-mono">/slug-placeholder</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Template</dt>
                      <dd className="font-medium">Not selected</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Index Status</dt>
                      <dd className="font-medium">index, follow</dd>
                    </div>
                  </dl>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>All required fields are complete</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Publish Landing Page
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
