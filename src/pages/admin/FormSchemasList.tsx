import { Link } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Eye, GitBranch } from "lucide-react";

const mockFormSchemas = [
  { id: "1", name: "Engineering Admission Form", version: 3, is_latest: true, status: "published", field_count: 12, used_by_count: 15, created_at: "2024-01-15" },
  { id: "2", name: "Engineering Admission Form", version: 2, is_latest: false, status: "retired", field_count: 10, used_by_count: 8, created_at: "2023-12-01" },
  { id: "3", name: "Engineering Admission Form", version: 1, is_latest: false, status: "retired", field_count: 8, used_by_count: 3, created_at: "2023-10-10" },
  { id: "4", name: "Scholarship Application Form", version: 2, is_latest: true, status: "published", field_count: 18, used_by_count: 10, created_at: "2024-02-20" },
  { id: "5", name: "Scholarship Application Form", version: 1, is_latest: false, status: "retired", field_count: 15, used_by_count: 5, created_at: "2024-01-05" },
  { id: "6", name: "General Inquiry Form", version: 1, is_latest: true, status: "draft", field_count: 6, used_by_count: 0, created_at: "2024-03-01" },
  { id: "7", name: "College Application Form", version: 1, is_latest: true, status: "published", field_count: 20, used_by_count: 22, created_at: "2024-01-10" },
];

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
  // Group form schemas by name
  const groupedSchemas = mockFormSchemas.reduce((acc, schema) => {
    if (!acc[schema.name]) {
      acc[schema.name] = [];
    }
    acc[schema.name].push(schema);
    return acc;
  }, {} as Record<string, typeof mockFormSchemas>);

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
        {Object.entries(groupedSchemas).map(([schemaName, versions]) => (
          <Card key={schemaName}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{schemaName}</span>
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
                          {schema.is_latest && (
                            <Badge className="bg-blue-500 text-white">
                              Latest
                            </Badge>
                          )}
                        </div>

                        <Badge className={getStatusColor(schema.status)}>
                          {schema.status}
                        </Badge>

                        <div className="text-sm text-muted-foreground">
                          {schema.field_count} fields
                        </div>

                        <div className="text-sm text-muted-foreground">
                          Used by {schema.used_by_count} campaigns
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
                          <Link to={`/admin/form-schemas/${schema.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </Link>
                        )}

                        {schema.is_latest && (
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
        ))}
      </div>
    </div>
  );
}
