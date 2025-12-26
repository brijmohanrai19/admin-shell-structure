import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Info, Lock, Save, Rocket, Plus, X, GripVertical, GitBranch } from "lucide-react";

interface FormField {
  id: string;
  label: string;
  field_type: "text" | "email" | "phone" | "select" | "textarea" | "number";
  required: boolean;
  placeholder?: string;
  options?: string[];
}

interface FormSchemaData {
  name: string;
  description: string;
  fields: FormField[];
  version: number;
  status: "draft" | "published" | "retired";
  used_by_count: number;
}

const fieldTypes = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "number", label: "Number" },
  { value: "select", label: "Select/Dropdown" },
  { value: "textarea", label: "Textarea" },
];

// Mock data
const mockFormSchema: FormSchemaData = {
  name: "Engineering Admission Form",
  description: "Standard form for engineering admission leads",
  fields: [
    { id: "1", label: "Full Name", field_type: "text", required: true, placeholder: "Enter your full name" },
    { id: "2", label: "Email", field_type: "email", required: true, placeholder: "your@email.com" },
    { id: "3", label: "Phone", field_type: "phone", required: true, placeholder: "+91 XXXXX XXXXX" },
    { id: "4", label: "Course Interested", field_type: "select", required: true, options: ["B.Tech", "M.Tech", "Diploma"] },
  ],
  version: 3,
  status: "published",
  used_by_count: 15,
};

export default function EditFormSchema() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormSchemaData>(mockFormSchema);

  const updateField = (field: keyof FormSchemaData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      label: "",
      field_type: "text",
      required: false,
      placeholder: "",
    };
    updateField("fields", [...formData.fields, newField]);
  };

  const removeField = (fieldId: string) => {
    updateField(
      "fields",
      formData.fields.filter((f) => f.id !== fieldId)
    );
  };

  const updateFieldData = (fieldId: string, updates: Partial<FormField>) => {
    updateField(
      "fields",
      formData.fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f))
    );
  };

  const isPublished = formData.status === "published" || formData.status === "retired";
  const isInUse = formData.used_by_count > 0;

  const handleUpdate = () => {
    if (!formData.name.trim()) {
      alert("Schema name is required");
      return;
    }

    if (isPublished) {
      alert("Cannot modify published form schemas. Create a new version instead.");
      return;
    }

    const emptyLabels = formData.fields.filter((f) => !f.label.trim());
    if (emptyLabels.length > 0) {
      alert("All fields must have labels");
      return;
    }

    console.log("Updating form schema:", formData);
    alert("Form schema updated successfully! (mock)");
    navigate("/admin/form-schemas");
  };

  const handlePublish = () => {
    if (!formData.name.trim()) {
      alert("Schema name is required");
      return;
    }

    if (formData.fields.length === 0) {
      alert("Add at least one field before publishing");
      return;
    }

    const emptyLabels = formData.fields.filter((f) => !f.label.trim());
    if (emptyLabels.length > 0) {
      alert("All fields must have labels");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to publish this form schema? Once published, the schema becomes IMMUTABLE."
    );

    if (!confirmed) return;

    console.log("Publishing form schema:", { ...formData, status: "published" });
    alert("Form schema published successfully! (mock)");
    navigate("/admin/form-schemas");
  };

  const handleCreateNewVersion = () => {
    const confirmed = window.confirm(
      `This will create a new draft version (v${formData.version + 1}) based on the current schema. Continue?`
    );

    if (!confirmed) return;

    console.log("Creating new version:", {
      ...formData,
      version: formData.version + 1,
      status: "draft",
      used_by_count: 0,
    });
    alert(`New version v${formData.version + 1} created! (mock)`);
    navigate("/admin/form-schemas");
  };

  const handleCancel = () => {
    navigate("/admin/form-schemas");
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title={`Edit Form Schema: ${formData.name}`}
        description={`Version ${formData.version} - ${formData.status}`}
      />

      <div className="p-8 space-y-6">
        {/* Status Alert */}
        {isPublished && (
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              <strong>Form schema is {formData.status}:</strong> Structure is IMMUTABLE and cannot be modified.
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
                Schema Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g., Engineering Admission Form"
                disabled={isPublished}
              />
              {!formData.name && (
                <p className="text-xs text-destructive">Schema name is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Brief description of this form's purpose"
                disabled={isPublished}
              />
            </div>
          </CardContent>
        </Card>

        {/* Field Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Form Fields</span>
              {!isPublished && (
                <Button variant="outline" size="sm" onClick={addField}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Field
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPublished ? (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Field structure is locked for published schemas. Create a new version to make changes.
                </AlertDescription>
              </Alert>
            ) : null}

            {formData.fields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No fields added yet. Click "Add Field" to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.fields.map((field) => (
                  <div
                    key={field.id}
                    className="flex gap-3 items-start p-4 border rounded-lg"
                  >
                    <div className="flex items-center pt-2 cursor-move">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">
                            Field Label <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            value={field.label}
                            onChange={(e) =>
                              updateFieldData(field.id, { label: e.target.value })
                            }
                            placeholder="e.g., Full Name"
                            className="h-9"
                            disabled={isPublished}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Field Type</Label>
                          <Select
                            value={field.field_type}
                            onValueChange={(value: any) =>
                              updateFieldData(field.id, { field_type: value })
                            }
                            disabled={isPublished}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Placeholder</Label>
                        <Input
                          value={field.placeholder || ""}
                          onChange={(e) =>
                            updateFieldData(field.id, { placeholder: e.target.value })
                          }
                          placeholder="e.g., Enter your full name"
                          className="h-9"
                          disabled={isPublished}
                        />
                      </div>

                      {field.field_type === "select" && (
                        <div className="space-y-1">
                          <Label className="text-xs">Options (comma-separated)</Label>
                          <Input
                            value={field.options?.join(", ") || ""}
                            onChange={(e) =>
                              updateFieldData(field.id, {
                                options: e.target.value.split(",").map((s) => s.trim()),
                              })
                            }
                            placeholder="Option 1, Option 2, Option 3"
                            className="h-9"
                            disabled={isPublished}
                          />
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`required-${field.id}`}
                          checked={field.required}
                          onCheckedChange={(checked) =>
                            updateFieldData(field.id, { required: checked as boolean })
                          }
                          disabled={isPublished}
                        />
                        <Label
                          htmlFor={`required-${field.id}`}
                          className="text-xs cursor-pointer"
                        >
                          Required field
                        </Label>
                      </div>
                    </div>

                    {!isPublished && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeField(field.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Preview */}
        {formData.fields.length > 0 && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Form Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This is a simplified preview. Actual form will be styled based on the template.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4 border rounded-lg p-6 bg-muted/30">
                  {formData.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label>
                        {field.label}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      {field.field_type === "textarea" ? (
                        <div className="h-20 w-full rounded border bg-background px-3 py-2 text-sm text-muted-foreground">
                          {field.placeholder || ""}
                        </div>
                      ) : field.field_type === "select" ? (
                        <div className="h-9 w-full rounded border bg-background px-3 py-2 text-sm text-muted-foreground flex items-center">
                          {field.placeholder || "Select..."}
                        </div>
                      ) : (
                        <div className="h-9 w-full rounded border bg-background px-3 py-2 text-sm text-muted-foreground flex items-center">
                          {field.placeholder || ""}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <p className="text-muted-foreground">
                    {formData.fields.length} field{formData.fields.length !== 1 ? "s" : ""} total
                  </p>
                  <p className="text-muted-foreground">
                    {formData.fields.filter((f) => f.required).length} required
                  </p>
                </div>
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
                      Publish Schema
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
