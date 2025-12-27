import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Eye, GitBranch } from "lucide-react";
import { formSchemasAPI, FormSchema } from "@/services/api/form-schemas";

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

export default function FormSchemasList() {
  const [formSchemas, setFormSchemas] = useState<FormSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFormSchemas();
  }, []);

  const loadFormSchemas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await formSchemasAPI.list();
      setFormSchemas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load form schemas");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await formSchemasAPI.delete(id);
      toast.success("Form schema deleted successfully");
      loadFormSchemas();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete form schema");
    }
  };

  // Group form schemas by slug
  const groupedSchemas = formSchemas.reduce((acc, schema) => {
    if (!acc[schema.slug]) {
      acc[schema.slug] = [];
    }
    acc[schema.slug].push(schema);
    return acc;
  }, {} as Record<string, FormSchema[]>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading form schemas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadFormSchemas}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Form Schemas"
        description="Manage form definitions and field configurations"
        actions={
          <Link to="/admin/form-schemas/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Form Schema
            </Button>
          </Link>
        }
      />

      <div className="p-8 space-y-6">
        {Object.entries(groupedSchemas).map(([schemaSlug, versions]) => {
          const latestVersion = Math.max(...versions.map(v => v.version));
          return (
            <Card key={schemaSlug}>
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
                    .map((schema) => (
                      <div
                        key={schema.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">v{schema.version}</Badge>
                            {schema.version === latestVersion && (
                              <Badge className="bg-blue-500 text-white">
                                Latest
                              </Badge>
                            )}
                          </div>

                          <Badge className={getStatusColor(schema.status)}>
                            {schema.status}
                          </Badge>

                          <div className="text-sm text-muted-foreground">
                            {schema.fields.length} fields
                          </div>

                          <div className="text-sm text-muted-foreground">
                            Used by {schema.usage_count} campaigns
                          </div>

                          <div className="text-sm text-muted-foreground">
                            Created {new Date(schema.created_at).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link to={`/admin/form-schemas/${schema.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>

                          {schema.status === "draft" && (
                            <Link to={`/admin/form-schemas/${schema.id}`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </Link>
                          )}

                          {schema.version === latestVersion && (
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
