import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Edit, Lock, AlertTriangle } from "lucide-react";
import { templatesAPI, Template } from "@/services/api/templates";

export default function TemplateDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadTemplate(id);
    }
  }, [id]);

  const loadTemplate = async (templateId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await templatesAPI.get(templateId);
      setTemplate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load template");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!id || !template) return;

    if (template.status === "published") {
      alert("Template is already published");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to publish this template? Once published, it cannot be edited."
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError(null);
      await templatesAPI.update(id, { status: "published" });
      alert("Template published successfully!");
      loadTemplate(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to publish template";
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
          <p className="text-muted-foreground">Loading template...</p>
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

  if (!template) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
          Template not found
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
        title={template.name}
        description={`Version ${template.version}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/templates")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Templates
            </Button>
            {template.status === "draft" && (
              <>
                <Button variant="outline" onClick={() => navigate(`/admin/templates/${id}`)}>
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
        {template.status === "published" && (
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              <strong>Version Locked:</strong> This published template cannot be edited. Create a new version to make changes.
            </AlertDescription>
          </Alert>
        )}

        {template.status === "draft" && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Draft:</strong> This template is not yet published and can still be edited.
            </AlertDescription>
          </Alert>
        )}

        {/* Template Info */}
        <Card>
          <CardHeader>
            <CardTitle>Template Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-base">{template.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Slug</p>
                <p className="text-base font-mono">{template.slug}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Version</p>
                <Badge variant="secondary">v{template.version}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge className={getStatusColor(template.status)}>{template.status}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Usage Count</p>
                <p className="text-base">{template.usage_count} campaigns</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-base">{new Date(template.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        {template.sections && template.sections.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Template Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {template.sections.map((section, index) => (
                  <Badge key={index} variant="outline">
                    {section}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Component Definition */}
        <Card>
          <CardHeader>
            <CardTitle>Component Definition</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
              {JSON.stringify(template.component_definition, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
