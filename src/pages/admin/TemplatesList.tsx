import { Link } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Eye, GitBranch } from "lucide-react";

const mockTemplates = [
  { id: "1", name: "Standard Exam LP", version: 3, is_latest: true, status: "published", used_by_count: 12, created_at: "2024-01-15" },
  { id: "2", name: "Standard Exam LP", version: 2, is_latest: false, status: "retired", used_by_count: 5, created_at: "2023-12-01" },
  { id: "3", name: "Standard Exam LP", version: 1, is_latest: false, status: "retired", used_by_count: 2, created_at: "2023-10-10" },
  { id: "4", name: "Minimal Scholarship LP", version: 2, is_latest: true, status: "published", used_by_count: 8, created_at: "2024-02-20" },
  { id: "5", name: "Minimal Scholarship LP", version: 1, is_latest: false, status: "retired", used_by_count: 3, created_at: "2024-01-05" },
  { id: "6", name: "College Admission LP", version: 1, is_latest: true, status: "draft", used_by_count: 0, created_at: "2024-03-01" },
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

export default function TemplatesList() {
  // Group templates by name
  const groupedTemplates = mockTemplates.reduce((acc, template) => {
    if (!acc[template.name]) {
      acc[template.name] = [];
    }
    acc[template.name].push(template);
    return acc;
  }, {} as Record<string, typeof mockTemplates>);

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
        {Object.entries(groupedTemplates).map(([templateName, versions]) => (
          <Card key={templateName}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{templateName}</span>
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
                          {template.is_latest && (
                            <Badge className="bg-blue-500 text-white">
                              Latest
                            </Badge>
                          )}
                        </div>

                        <Badge className={getStatusColor(template.status)}>
                          {template.status}
                        </Badge>

                        <div className="text-sm text-muted-foreground">
                          Used by {template.used_by_count} campaigns
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
                          <Link to={`/admin/templates/${template.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </Link>
                        )}

                        {template.is_latest && (
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
