import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { StepIndicator } from "@/components/admin/StepIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Save, CheckCircle } from "lucide-react";

const steps = [
  { title: "Basic Info", description: "Name & description" },
  { title: "Target Audience", description: "Define reach" },
  { title: "Content", description: "Campaign content" },
  { title: "Schedule", description: "Timing & duration" },
  { title: "Review", description: "Final check" },
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
        title="Create New Campaign"
        description="Set up a new marketing campaign with the wizard"
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
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input id="campaignName" placeholder="Enter campaign name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaignType">Campaign Type</Label>
                  <Input id="campaignType" placeholder="Select campaign type" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaignDescription">Description</Label>
                  <Textarea
                    id="campaignDescription"
                    placeholder="Describe your campaign objectives..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="targetExams">Target Exams</Label>
                    <Input id="targetExams" placeholder="Select exams" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetColleges">Target Colleges</Label>
                    <Input id="targetColleges" placeholder="Select colleges" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="userSegment">User Segment</Label>
                    <Input id="userSegment" placeholder="Select segment" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedReach">Estimated Reach</Label>
                    <Input id="estimatedReach" placeholder="0" disabled />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Email Subject / Title</Label>
                  <Input id="subject" placeholder="Enter subject line" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template">Content Template</Label>
                  <Input id="template" placeholder="Select template" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Campaign Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter your campaign content here..."
                    rows={8}
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sendTime">Preferred Send Time</Label>
                    <Input id="sendTime" type="time" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input id="timezone" placeholder="Select timezone" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="rounded-lg border border-border bg-muted/30 p-6">
                  <h4 className="font-medium text-foreground mb-4">Campaign Summary</h4>
                  <dl className="grid gap-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Campaign Name</dt>
                      <dd className="font-medium">Campaign Name Placeholder</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Type</dt>
                      <dd className="font-medium">Email Campaign</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Estimated Reach</dt>
                      <dd className="font-medium">0 users</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Schedule</dt>
                      <dd className="font-medium">Not set</dd>
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
              Create Campaign
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
