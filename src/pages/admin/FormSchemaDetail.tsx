import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Edit, Lock, AlertTriangle, CheckCircle } from "lucide-react";
import { formSchemasAPI, FormSchema } from "@/services/api/form-schemas";

export default function FormSchemaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadFormSchema(id);
    }
  }, [id]);

  const loadFormSchema = async (schemaId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await formSchemasAPI.get(schemaId);
      setFormSchema(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load form schema");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!id || !formSchema) return;

    if (formSchema.status === "published") {
      alert("Form schema is already published");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to publish this form schema? Once published, it cannot be edited."
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError(null);
      await formSchemasAPI.update(id, { status: "published" });
      alert("Form schema published successfully!");
      loadFormSchema(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to publish form schema";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading form schema...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!formSchema) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
          Form schema not found
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500 text-white";
      case "retired":
        return "bg-gray-500 text-white";
      case "draft":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title={formSchema.name}
        description={`Version ${formSchema.version}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/form-schemas")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Form Schemas
            </Button>
            {formSchema.status === "draft" && (
              <>
                <Button variant="outline" onClick={() => navigate(`/admin/form-schemas/${id}`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button onClick={handlePublish} disabled={saving}>
                  Publish
                </Button>
              </>
            )}
          </div>
        }
      />

      <div className="p-8 space-y-6">
        {/* Status Warning */}
        {formSchema.status === "published" && (
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              <strong>Version Locked:</strong> This published form schema cannot be edited. Create a new version to make changes.
            </AlertDescription>
          </Alert>
        )}

        {formSchema.status === "draft" && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Draft:</strong> This form schema is not yet published and can still be edited.
            </AlertDescription>
          </Alert>
        )}

        {formSchema.is_system_default && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>System Default:</strong> This is the default form schema used when no specific schema is selected.
            </AlertDescription>
          </Alert>
        )}

        {/* Schema Info */}
        <Card>
          <CardHeader>
            <CardTitle>Form Schema Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-base">{formSchema.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Slug</p>
                <p className="text-base font-mono">{formSchema.slug}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Version</p>
                <Badge variant="secondary">v{formSchema.version}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge className={getStatusColor(formSchema.status)}>{formSchema.status}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Usage Count</p>
                <p className="text-base">{formSchema.usage_count} campaigns</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-base">{new Date(formSchema.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Fields */}
        <Card>
          <CardHeader>
            <CardTitle>Form Fields ({formSchema.fields.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {formSchema.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="font-mono text-xs">
                        {index + 1}
                      </Badge>
                      <p className="font-medium">{field.label}</p>
                      {field.required && (
                        <Badge variant="destructive" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Type: {field.type}</span>
                      {field.options && field.options.length > 0 && (
                        <span>Options: {field.options.join(", ")}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Field Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Field Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold">{formSchema.fields.length}</p>
                <p className="text-sm text-muted-foreground">Total Fields</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold">
                  {formSchema.fields.filter((f) => f.required).length}
                </p>
                <p className="text-sm text-muted-foreground">Required Fields</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold">
                  {formSchema.fields.filter((f) => !f.required).length}
                </p>
                <p className="text-sm text-muted-foreground">Optional Fields</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
