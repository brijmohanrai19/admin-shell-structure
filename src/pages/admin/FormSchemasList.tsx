import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, MoreHorizontal, Eye } from "lucide-react";

const placeholderSchemas = [
  { id: "1", name: "Exam Registration", fields: 12, submissions: 1234, lastModified: "1 day ago" },
  { id: "2", name: "College Inquiry", fields: 8, submissions: 567, lastModified: "3 days ago" },
  { id: "3", name: "Scholarship Application", fields: 15, submissions: 234, lastModified: "Yesterday" },
  { id: "4", name: "Contact Form", fields: 5, submissions: 890, lastModified: "1 week ago" },
  { id: "5", name: "Feedback Survey", fields: 10, submissions: 456, lastModified: "2 days ago" },
];

export default function FormSchemasList() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Form Schemas"
        description="Manage form definitions and field configurations"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Schema
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search form schemas..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={[
            { key: "name", label: "Schema Name" },
            { key: "fields", label: "Fields" },
            { key: "submissions", label: "Submissions" },
            { key: "lastModified", label: "Last Modified" },
            { key: "actions", label: "", className: "text-right" },
          ]}
          rows={placeholderSchemas.map((schema) => ({
            name: <span className="font-medium">{schema.name}</span>,
            fields: (
              <Badge variant="secondary" className="font-normal">
                {schema.fields} fields
              </Badge>
            ),
            submissions: schema.submissions.toLocaleString(),
            lastModified: <span className="text-muted-foreground">{schema.lastModified}</span>,
            actions: (
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
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
