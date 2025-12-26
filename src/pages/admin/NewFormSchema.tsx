import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Info, AlertTriangle, Save, Rocket, Plus, X, GripVertical } from "lucide-react";

interface FormField {
  id: string;
  label: string;
  field_type: "text" | "email" | "phone" | "select" | "textarea" | "number";
  required: boolean;
  placeholder?: string;
  options?: string[]; // For select fields
}

interface FormSchemaData {
  name: string;
  description: string;
  fields: FormField[];
}

const fieldTypes = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "number", label: "Number" },
  { value: "select", label: "Select/Dropdown" },
  { value: "textarea", label: "Textarea" },
];

export default function NewFormSchema() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormSchemaData>({
    name: "",
    description: "",
    fields: [],
  });

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

  const removeField = (id: string) => {
    updateField(
      "fields",
      formData.fields.filter((f) => f.id !== id)
    );
  };

  const updateFieldData = (id: string, updates: Partial<FormField>) => {
    updateField(
      "fields",
      formData.fields.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const handleSaveDraft = () => {
    if (!formData.name.trim()) {
      alert("Schema name is required");
      return;
    }

    console.log("Saving form schema as draft:", {
      ...formData,
      version: 1,
      status: "draft",
    });
    alert("Form schema saved as draft! (mock)");
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

    console.log("Publishing form schema:", {
      ...formData,
      version: 1,
      status: "published",
    });
    alert("Form schema published successfully! (mock)");
    navigate("/admin/form-schemas");
  };

  const handleCancel = () => {
    navigate("/admin/form-schemas");
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Create New Form Schema"
        description="Design a new form definition for lead capture"
      />

      <div className="p-8 space-y-6">
        {/* Warning Alert */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> Once published, form schema becomes IMMUTABLE. You can only create new versions, not modify existing ones.
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
                Schema Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g., Engineering Admission Form"
              />
              {!formData.name && (
                <p className="text-xs text-destructive">Schema name is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <div className="flex items-center gap-2">
                <Input id="version" value="1" disabled className="max-w-[100px]" />
                <Badge variant="secondary">Auto-assigned</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Brief description of this form's purpose"
              />
            </div>
          </CardContent>
        </Card>

        {/* Field Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Form Fields</span>
              <Button variant="outline" size="sm" onClick={addField}>
                <Plus className="mr-2 h-4 w-4" />
                Add Field
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.fields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No fields added yet. Click "Add Field" to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.fields.map((field, index) => (
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
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Field Type</Label>
                          <Select
                            value={field.field_type}
                            onValueChange={(value: any) =>
                              updateFieldData(field.id, { field_type: value })
                            }
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
                        />
                        <Label
                          htmlFor={`required-${field.id}`}
                          className="text-xs cursor-pointer"
                        >
                          Required field
                        </Label>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeField(field.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
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

              <div className="flex items-center gap-3">
                <Button variant="secondary" onClick={handleSaveDraft}>
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </Button>
                <Button onClick={handlePublish}>
                  <Rocket className="mr-2 h-4 w-4" />
                  Publish Schema
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
