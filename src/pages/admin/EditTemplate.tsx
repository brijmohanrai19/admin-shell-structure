import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Info, AlertTriangle, Save, Rocket, Lock, GitBranch } from "lucide-react";

interface TemplateFormData {
  name: string;
  description: string;
  component_definition: string;
  version: number;
  status: "draft" | "published" | "retired";
  used_by_count: number;
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

// Mock data for demonstration
const mockTemplate: TemplateFormData = {
  name: "Standard Exam LP",
  description: "Full-page landing page with hero, features, testimonials, and form",
  component_definition: exampleJSON,
  version: 3,
  status: "published",
  used_by_count: 12,
};

export default function EditTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();

  // In real app, fetch template by ID
  const [formData, setFormData] = useState<TemplateFormData>(mockTemplate);

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

  const isPublished = formData.status === "published" || formData.status === "retired";
  const isInUse = formData.used_by_count > 0;

  const handleUpdate = () => {
    if (!formData.name.trim()) {
      alert("Template name is required");
      return;
    }

    if (isPublished) {
      alert("Cannot modify published templates. Create a new version instead.");
      return;
    }

    if (!isJSONValid) {
      alert("Invalid JSON in component definition");
      return;
    }

    console.log("Updating template:", formData);
    alert("Template updated successfully! (mock)");
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

    console.log("Publishing template:", { ...formData, status: "published" });
    alert("Template published successfully! (mock)");
    navigate("/admin/templates");
  };

  const handleCreateNewVersion = () => {
    const confirmed = window.confirm(
      `This will create a new draft version (v${formData.version + 1}) based on the current template. Continue?`
    );

    if (!confirmed) return;

    console.log("Creating new version:", {
      ...formData,
      version: formData.version + 1,
      status: "draft",
      used_by_count: 0,
    });
    alert(`New version v${formData.version + 1} created! (mock)`);
    navigate("/admin/templates");
  };

  const handleCancel = () => {
    navigate("/admin/templates");
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title={`Edit Template: ${formData.name}`}
        description={`Version ${formData.version} - ${formData.status}`}
      />

      <div className="p-8 space-y-6">
        {/* Status Alert */}
        {isPublished && (
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              <strong>Template is {formData.status}:</strong> Structure is IMMUTABLE and cannot be modified.
              {isInUse && ` Currently used by ${formData.used_by_count} campaigns.`}
              {" "}You can only create a new version.
            </AlertDescription>
          </Alert>
        )}

        {/* Version Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Version Information</span>
              {isPublished && (
                <Button variant="outline" size="sm" onClick={handleCreateNewVersion}>
                  <GitBranch className="mr-2 h-4 w-4" />
                  Create New Version (v{formData.version + 1})
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Version</p>
                <p className="text-lg font-semibold">v{formData.version}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  className={
                    formData.status === "published"
                      ? "bg-green-500 text-white"
                      : formData.status === "retired"
                      ? "bg-gray-500 text-white"
                      : "bg-yellow-500 text-white"
                  }
                >
                  {formData.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Used By</p>
                <p className="text-lg font-semibold">{formData.used_by_count} campaigns</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                disabled={isPublished}
              />
              {!formData.name && (
                <p className="text-xs text-destructive">Template name is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
                placeholder="Brief description of this template's purpose and structure"
                disabled={isPublished}
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
            {isPublished ? (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Template structure is locked for published templates. Create a new version to make changes.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Full visual template editor coming soon. For now, define template structure using JSON.
                </AlertDescription>
              </Alert>
            )}

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
                disabled={isPublished}
              />
              {!isJSONValid && (
                <p className="text-xs text-destructive">Invalid JSON syntax</p>
              )}
              {!isPublished && (
                <p className="text-xs text-muted-foreground">
                  Define sections and their properties in JSON format
                </p>
              )}
            </div>

            {!isPublished && (
              <details className="text-sm">
                <summary className="cursor-pointer font-medium mb-2">
                  View example structure
                </summary>
                <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-xs">
                  {exampleJSON}
                </pre>
              </details>
            )}
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

              {!isPublished ? (
                <div className="flex items-center gap-3">
                  <Button variant="secondary" onClick={handleUpdate}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  {formData.status === "draft" && (
                    <Button onClick={handlePublish}>
                      <Rocket className="mr-2 h-4 w-4" />
                      Publish Template
                    </Button>
                  )}
                </div>
              ) : (
                <Button onClick={handleCreateNewVersion}>
                  <GitBranch className="mr-2 h-4 w-4" />
                  Create New Version
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
