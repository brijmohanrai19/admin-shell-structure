import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, MoreHorizontal, Copy } from "lucide-react";

const placeholderTemplates = [
  { id: "1", name: "Exam Notification", type: "Email", usage: 234, lastModified: "2 days ago" },
  { id: "2", name: "College Profile Card", type: "Component", usage: 567, lastModified: "1 week ago" },
  { id: "3", name: "Scholarship Alert", type: "Email", usage: 123, lastModified: "3 days ago" },
  { id: "4", name: "Application Form", type: "Form", usage: 89, lastModified: "Yesterday" },
  { id: "5", name: "Results Page", type: "Page", usage: 456, lastModified: "5 days ago" },
];

export default function TemplatesList() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Templates"
        description="Manage reusable templates for various content types"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search templates..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={[
            { key: "name", label: "Template Name" },
            { key: "type", label: "Type" },
            { key: "usage", label: "Usage Count" },
            { key: "lastModified", label: "Last Modified" },
            { key: "actions", label: "", className: "text-right" },
          ]}
          rows={placeholderTemplates.map((template) => ({
            name: <span className="font-medium">{template.name}</span>,
            type: (
              <Badge variant="secondary" className="font-normal">
                {template.type}
              </Badge>
            ),
            usage: template.usage,
            lastModified: <span className="text-muted-foreground">{template.lastModified}</span>,
            actions: (
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            ),
          }))}
        />
      </div>
    </div>
  );
}
