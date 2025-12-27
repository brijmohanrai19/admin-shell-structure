import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Eye, GitBranch } from "lucide-react";
import { templatesAPI, Template } from "@/services/api/templates";

type StatusType = "published" | "retired" | "draft";

const getStatusColor = (status: StatusType) => {
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

export default function TemplatesList() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await templatesAPI.list();
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  // Group templates by slug
  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.slug]) {
      acc[template.slug] = [];
    }
    acc[template.slug].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadTemplates}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Templates"
        description="Manage landing page templates and their versions"
        actions={
          <Link to="/admin/templates/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Template
            </Button>
          </Link>
        }
      />

      <div className="p-8 space-y-6">
        {Object.entries(groupedTemplates).map(([templateSlug, versions]) => {
          const latestVersion = Math.max(...versions.map(v => v.version));
          return (
            <Card key={templateSlug}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{versions[0].name}</span>
                  <Badge variant="outline">{versions.length} versions</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {versions
                    .sort((a, b) => b.version - a.version)
                    .map((template) => (
                      <div
                        key={template.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">v{template.version}</Badge>
                            {template.version === latestVersion && (
                              <Badge className="bg-blue-500 text-white">
                                Latest
                              </Badge>
                            )}
                          </div>

                          <Badge className={getStatusColor(template.status)}>
                            {template.status}
                          </Badge>

                          <div className="text-sm text-muted-foreground">
                            Used by {template.usage_count} campaigns
                          </div>

                          <div className="text-sm text-muted-foreground">
                            Created {new Date(template.created_at).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link to={`/admin/templates/${template.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>

                          {template.status === "draft" && (
                            <Link to={`/admin/templates/${template.id}`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </Link>
                          )}

                          {template.version === latestVersion && (
                            <Button variant="outline" size="sm">
                              <GitBranch className="h-4 w-4 mr-1" />
                              New Version
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
