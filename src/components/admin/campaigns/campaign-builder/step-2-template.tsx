import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, FileText, Check } from "lucide-react";
import { CampaignWizardState } from "./wizard-container";

export interface Step2Props {
  state: CampaignWizardState;
  onChange: (updates: Partial<CampaignWizardState>) => void;
}

const mockTemplates = [
  {
    id: "1",
    name: "Standard Exam LP",
    version: 3,
    description:
      "Full-page landing page with hero, features, testimonials, and form",
    thumbnail: null,
    component_definition: {
      sections: [
        { type: "hero", label: "Hero Section" },
        { type: "features", label: "Features Section" },
        { type: "testimonials", label: "Testimonials Section" },
        { type: "form", label: "Lead Form Section" },
      ],
    },
  },
  {
    id: "2",
    name: "Minimal Scholarship LP",
    version: 2,
    description: "Simple one-page with form and key info",
    thumbnail: null,
    component_definition: {
      sections: [
        { type: "hero", label: "Hero Section" },
        { type: "form", label: "Application Form" },
      ],
    },
  },
  {
    id: "3",
    name: "College Admission LP",
    version: 1,
    description:
      "Multi-section LP with courses, facilities, and admission form",
    thumbnail: null,
    component_definition: {
      sections: [
        { type: "hero", label: "Hero Section" },
        { type: "features", label: "Campus Features" },
        { type: "courses", label: "Courses Offered" },
        { type: "form", label: "Admission Form" },
      ],
    },
  },
];

export function Step2Template({ state, onChange }: Step2Props) {
  const selectedTemplate = mockTemplates.find(
    (t) => t.id === state.template_id
  );

  const handleSelectTemplate = (
    templateId: string,
    templateVersion: number
  ) => {
    onChange({
      template_id: templateId,
      template_version: templateVersion,
    });
  };

  return (
    <div className="space-y-6">
      {/* Warning Alert */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Template version will be LOCKED after
          launch. You can update content, but cannot change the template or its
          version.
        </AlertDescription>
      </Alert>

      {/* Selected Template Display */}
      {selectedTemplate && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  Selected Template
                </CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onChange({ template_id: null, template_version: null })
                }
              >
                Change Template
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">
                  {selectedTemplate.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedTemplate.description}
                </p>
              </div>
              <Badge variant="secondary">v{selectedTemplate.version}</Badge>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Template Sections:</h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedTemplate.component_definition.sections.map(
                  (section, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-muted rounded"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{section.label}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Gallery */}
      {!selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>Choose a Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() =>
                    handleSelectTemplate(template.id, template.version)
                  }
                >
                  <CardContent className="pt-6">
                    {/* Placeholder Thumbnail */}
                    <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Badge variant="outline">v{template.version}</Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>

                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground mb-1">
                          {template.component_definition.sections.length}{" "}
                          sections
                        </p>
                      </div>

                      <Button className="w-full mt-4" size="sm">
                        Select Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
