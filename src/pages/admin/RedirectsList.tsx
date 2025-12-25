import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, MoreHorizontal, ArrowRight } from "lucide-react";

const placeholderRedirects = [
  { id: "1", from: "/old-jee", to: "/exams/jee-main", type: "301", status: "active" as const },
  { id: "2", from: "/college/iitd", to: "/colleges/iit-delhi", type: "301", status: "active" as const },
  { id: "3", from: "/scholarship", to: "/scholarships", type: "302", status: "active" as const },
  { id: "4", from: "/apply", to: "/exams/register", type: "301", status: "draft" as const },
  { id: "5", from: "/careers", to: "https://careers.example.com", type: "301", status: "active" as const },
];

export default function RedirectsList() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Redirects"
        description="Manage URL redirects and routing rules"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Redirect
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search redirects..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={[
            { key: "from", label: "From" },
            { key: "arrow", label: "" },
            { key: "to", label: "To" },
            { key: "type", label: "Type" },
            { key: "status", label: "Status" },
            { key: "actions", label: "", className: "text-right" },
          ]}
          rows={placeholderRedirects.map((redirect) => ({
            from: <span className="font-mono text-sm">{redirect.from}</span>,
            arrow: <ArrowRight className="h-4 w-4 text-muted-foreground" />,
            to: <span className="font-mono text-sm">{redirect.to}</span>,
            type: (
              <span className="text-xs font-medium bg-muted px-2 py-1 rounded">
                {redirect.type}
              </span>
            ),
            status: <StatusBadge status={redirect.status} />,
            actions: (
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            ),
          }))}
        />
      </div>
    </div>
  );
}
