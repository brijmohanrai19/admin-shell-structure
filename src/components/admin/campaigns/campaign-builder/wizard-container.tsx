import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Save, Rocket } from "lucide-react";
import { SEO } from "@/components/admin/seo/seo-editor";
import { CrawlPolicy } from "@/components/admin/shared/crawl-policy-editor";
import { Step1Basics } from "./step-1-basics";
import { Step2Template } from "./step-2-template";
import { Step3Content } from "./step-3-content";
import { Step4SEO } from "./step-4-seo";
import { Step5Tracking } from "./step-5-tracking";

export interface CampaignWizardState {
  // Step 1: Basics
  name: string;
  description: string;
  prefix: string;
  slug: string;
  entity: {
    type: "exam" | "college" | "scholarship" | null;
    id: string | null;
  };

  // Step 2: Template
  template_id: string | null;
  template_version: number | null;

  // Step 3: Content
  content_data: Record<string, any>;

  // Step 4: SEO & Crawl
  seo_override: boolean;
  seo: SEO | null;
  crawl_policy_override: boolean;
  crawl_policy: CrawlPolicy | null;
  form_schema_override: boolean;
  form_schema_id: string | null;

  // Step 5: Tracking
  tracker_overrides: Array<{
    tracker_id: string;
    enabled: boolean;
    priority: number;
  }>;

  // Meta
  currentStep: 1 | 2 | 3 | 4 | 5;
}

export interface WizardContainerProps {
  onSubmit: (data: CampaignWizardState, action: "draft" | "launch") => void;
  onCancel: () => void;
}

const STEPS = [
  { number: 1, title: "Basics", description: "Campaign details and URL" },
  { number: 2, title: "Template", description: "Select page template" },
  { number: 3, title: "Content", description: "Fill page content" },
  { number: 4, title: "SEO & Crawl", description: "Configure SEO" },
  { number: 5, title: "Tracking", description: "Analytics setup" },
];

export function WizardContainer({ onSubmit, onCancel }: WizardContainerProps) {
  const [state, setState] = useState<CampaignWizardState>({
    name: "",
    description: "",
    prefix: "ad",
    slug: "",
    entity: { type: null, id: null },
    template_id: null,
    template_version: null,
    content_data: {},
    seo_override: false,
    seo: null,
    crawl_policy_override: false,
    crawl_policy: null,
    form_schema_override: false,
    form_schema_id: null,
    tracker_overrides: [],
    currentStep: 1,
  });

  const updateState = (updates: Partial<CampaignWizardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  // Validation per step
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          state.name.trim().length >= 3 &&
          state.prefix &&
          state.slug.trim()
        );
      case 2:
        return !!(state.template_id && state.template_version);
      case 3:
        // For now, headline is required if template has content
        return !!(state.template_id && state.content_data.headline);
      case 4:
      case 5:
        return true; // Optional steps
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid(state.currentStep)) {
      setState((prev) => ({
        ...prev,
        currentStep: Math.min(5, prev.currentStep + 1) as 1 | 2 | 3 | 4 | 5,
      }));
    }
  };

  const handlePrevious = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1) as 1 | 2 | 3 | 4 | 5,
    }));
  };

  const handleSaveDraft = () => {
    onSubmit(state, "draft");
  };

  const handleLaunch = () => {
    if (isStepValid(1) && isStepValid(2) && isStepValid(3)) {
      onSubmit(state, "launch");
    } else {
      alert("Please complete all required steps before launching");
    }
  };

  // Render current step
  const renderStep = () => {
    const props = { state, onChange: updateState };

    switch (state.currentStep) {
      case 1:
        return <Step1Basics {...props} />;
      case 2:
        return <Step2Template {...props} />;
      case 3:
        return <Step3Content {...props} />;
      case 4:
        return <Step4SEO {...props} />;
      case 5:
        return <Step5Tracking {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Create Landing Page Campaign</h1>
        <p className="text-muted-foreground mt-2">
          Follow the steps below to create and launch your campaign
        </p>
      </div>

      {/* Step Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                        step.number === state.currentStep
                          ? "bg-primary text-primary-foreground"
                          : step.number < state.currentStep
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.number}
                    </div>
                    <div className="text-center mt-2">
                      <div
                        className={`text-sm font-medium ${
                          step.number === state.currentStep
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </div>
                      <div className="text-xs text-muted-foreground hidden md:block">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 ${
                        step.number < state.currentStep
                          ? "bg-primary"
                          : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="min-h-[400px]">{renderStep()}</div>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="secondary" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
            </div>

            <div className="flex gap-3">
              {state.currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}

              {state.currentStep < 5 ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid(state.currentStep)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleLaunch}>
                  <Rocket className="h-4 w-4 mr-2" />
                  Launch Campaign
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
