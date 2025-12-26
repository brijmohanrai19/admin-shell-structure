import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Info, AlertTriangle, Save, Rocket } from "lucide-react";

interface TemplateFormData {
  name: string;
  description: string;
  component_definition: string; // JSON string
}

const exampleJSON = `{
  "sections": [
    {
      "type": "hero",
      "label": "Hero Section",
      "props": ["headline", "subheadline", "cta_text"]
    },
    {
      "type": "features",
      "label": "Features Section",
      "props": ["feature_items"]
    },
    {
      "type": "form",
      "label": "Lead Form Section",
      "props": ["form_title"]
    }
  ]
}`;

export default function NewTemplate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TemplateFormData>({
    name: "",
    description: "",
    component_definition: "",
  });

  const updateField = (field: keyof TemplateFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Parse JSON to show preview
  const parsedJSON = (() => {
    try {
      if (!formData.component_definition.trim()) return null;
      return JSON.parse(formData.component_definition);
    } catch {
      return null;
    }
  })();

  const isJSONValid =
    !formData.component_definition.trim() || parsedJSON !== null;

  const handleSaveDraft = () => {
    if (!formData.name.trim()) {
      alert("Template name is required");
      return;
    }

    console.log("Saving template as draft:", {
      ...formData,
      version: 1,
      status: "draft",
    });
    alert("Template saved as draft! (mock)");
    navigate("/admin/templates");
  };

  const handlePublish = () => {
    if (!formData.name.trim()) {
      alert("Template name is required");
      return;
    }

    if (!formData.component_definition.trim()) {
      alert("Component definition is required for publishing");
      return;
    }

    if (!isJSONValid) {
      alert("Invalid JSON in component definition");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to publish this template? Once published, the template structure becomes IMMUTABLE and cannot be changed."
    );

    if (!confirmed) return;

    console.log("Publishing template:", {
      ...formData,
      version: 1,
      status: "published",
    });
    alert("Template published successfully! (mock)");
    navigate("/admin/templates");
  };

  const handleCancel = () => {
    navigate("/admin/templates");
  };

  return (
    <div className="min-h-screen">
      <PageHeader title="Create New Template" description="Design a new landing page template" />

      <div className="p-8 space-y-6">
        {/* Warning Alert */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> Once published, template structure becomes IMMUTABLE. You can only create new versions, not modify existing ones.
          </AlertDescription>
        </Alert>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Template Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g., Standard Exam LP"
              />
              {!formData.name && (
                <p className="text-xs text-destructive">Template name is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <div className="flex items-center gap-2">
                <Input id="version" value="1" disabled className="max-w-[100px]" />
                <Badge variant="secondary">Auto-assigned</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Version starts at v1 and increments with each new version
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
                placeholder="Brief description of this template's purpose and structure"
              />
            </div>
          </CardContent>
        </Card>

        {/* Component Definition */}
        <Card>
          <CardHeader>
            <CardTitle>Component Definition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Full visual template editor coming soon. For now, define template structure using JSON.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="component-definition">
                Template Structure (JSON)
              </Label>
              <Textarea
                id="component-definition"
                value={formData.component_definition}
                onChange={(e) => updateField("component_definition", e.target.value)}
                rows={15}
                className={`font-mono text-sm ${!isJSONValid ? "border-destructive" : ""}`}
                placeholder={exampleJSON}
              />
              {!isJSONValid && (
                <p className="text-xs text-destructive">Invalid JSON syntax</p>
              )}
              <p className="text-xs text-muted-foreground">
                Define sections and their properties in JSON format
              </p>
            </div>

            <details className="text-sm">
              <summary className="cursor-pointer font-medium mb-2">
                View example structure
              </summary>
              <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-xs">
                {exampleJSON}
              </pre>
            </details>
          </CardContent>
        </Card>

        {/* Template Preview */}
        {parsedJSON && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Template Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Parsed template structure:
                </p>

                {parsedJSON.sections && Array.isArray(parsedJSON.sections) ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Sections ({parsedJSON.sections.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {parsedJSON.sections.map((section: any, index: number) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {section.type || "unnamed"} {section.label ? `(${section.label})` : ""}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No valid sections array found in JSON
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>

              <div className="flex items-center gap-3">
                <Button variant="secondary" onClick={handleSaveDraft}>
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </Button>
                <Button onClick={handlePublish}>
                  <Rocket className="mr-2 h-4 w-4" />
                  Publish Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
