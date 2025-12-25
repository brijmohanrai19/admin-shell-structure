import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, MoreHorizontal, ExternalLink } from "lucide-react";

const placeholderSlugs = [
  { id: "1", slug: "/jee-main-2025", entity: "Exam", target: "JEE Main 2025", created: "Jan 15, 2024" },
  { id: "2", slug: "/iit-delhi", entity: "College", target: "IIT Delhi", created: "Jan 10, 2024" },
  { id: "3", slug: "/merit-scholarship", entity: "Scholarship", target: "Merit Scholarship 2025", created: "Jan 8, 2024" },
  { id: "4", slug: "/neet-ug-2025", entity: "Exam", target: "NEET UG 2025", created: "Jan 5, 2024" },
  { id: "5", slug: "/spring-campaign", entity: "Campaign", target: "Spring Admissions 2025", created: "Jan 2, 2024" },
];

export default function SlugRegistry() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Slug Registry"
        description="Manage URL slugs and permalink configurations"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Register Slug
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search slugs..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={[
            { key: "slug", label: "Slug" },
            { key: "entity", label: "Entity Type" },
            { key: "target", label: "Target" },
            { key: "created", label: "Created" },
            { key: "actions", label: "", className: "text-right" },
          ]}
          rows={placeholderSlugs.map((item) => ({
            slug: (
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{item.slug}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            ),
            entity: (
              <Badge variant="secondary" className="font-normal">
                {item.entity}
              </Badge>
            ),
            target: <span className="font-medium">{item.target}</span>,
            created: <span className="text-muted-foreground">{item.created}</span>,
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
