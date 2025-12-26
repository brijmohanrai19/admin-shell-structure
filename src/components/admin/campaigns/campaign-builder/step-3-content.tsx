import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { CampaignWizardState } from "./wizard-container";

export interface Step3Props {
  state: CampaignWizardState;
  onChange: (updates: Partial<CampaignWizardState>) => void;
}

export function Step3Content({ state, onChange }: Step3Props) {
  const updateContentData = (field: string, value: string) => {
    onChange({
      content_data: {
        ...state.content_data,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Full dynamic template editor will be implemented with backend
          integration. For now, use these simplified fields to demonstrate the
          concept.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Page Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="headline">
              Headline <span className="text-destructive">*</span>
            </Label>
            <Input
              id="headline"
              value={state.content_data.headline || ""}
              onChange={(e) => updateContentData("headline", e.target.value)}
              placeholder="e.g., Apply for VITEEE 2026"
            />
            <p className="text-xs text-muted-foreground">
              Main heading for the hero section
            </p>
            {!state.content_data.headline && (
              <p className="text-xs text-destructive">Headline is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subheadline">Subheadline</Label>
            <Input
              id="subheadline"
              value={state.content_data.subheadline || ""}
              onChange={(e) => updateContentData("subheadline", e.target.value)}
              placeholder="e.g., Secure your seat in India's top engineering college"
            />
            <p className="text-xs text-muted-foreground">
              Supporting text below the headline
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cta-text">Call-to-Action Text</Label>
            <Input
              id="cta-text"
              value={state.content_data.cta_text || ""}
              onChange={(e) => updateContentData("cta_text", e.target.value)}
              placeholder="e.g., Apply Now"
            />
            <p className="text-xs text-muted-foreground">
              Text for primary button
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feature-items">Feature Items (JSON)</Label>
            <Textarea
              id="feature-items"
              value={state.content_data.feature_items || ""}
              onChange={(e) =>
                updateContentData("feature_items", e.target.value)
              }
              rows={6}
              placeholder={`[\n  "Top-ranked engineering programs",\n  "100% placement record",\n  "State-of-the-art facilities"\n]`}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              JSON array of feature points (for features section)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Variable Placeholders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              You can use these placeholders in your content (will be replaced
              dynamically):
            </p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <code className="text-xs bg-muted p-2 rounded">
                {"{exam_name}"}
              </code>
              <code className="text-xs bg-muted p-2 rounded">
                {"{college_name}"}
              </code>
              <code className="text-xs bg-muted p-2 rounded">
                {"{scholarship_name}"}
              </code>
              <code className="text-xs bg-muted p-2 rounded">
                {"{exam_date}"}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
