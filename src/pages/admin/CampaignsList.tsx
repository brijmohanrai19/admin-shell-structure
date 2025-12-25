import { Link } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, MoreHorizontal, ExternalLink } from "lucide-react";

const placeholderCampaigns = [
  { id: "1", name: "JEE Main 2025 Landing", slug: "/jee-main-2025", template: "Exam LP", views: "12,450", status: "published" as const },
  { id: "2", name: "NEET UG Preparation", slug: "/neet-ug-prep", template: "Course LP", views: "8,320", status: "published" as const },
  { id: "3", name: "MIT Scholarship Program", slug: "/mit-scholarship", template: "Scholarship LP", views: "0", status: "draft" as const },
  { id: "4", name: "IIT Delhi Admissions", slug: "/iit-delhi", template: "College LP", views: "5,100", status: "active" as const },
  { id: "5", name: "CAT 2024 Results", slug: "/cat-2024-results", template: "Results LP", views: "45,000", status: "archived" as const },
];

export default function CampaignsList() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Landing Page Campaigns"
        description="Manage URL-based landing page instances"
        actions={
          <Link to="/admin/campaigns/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Landing Page
            </Button>
          </Link>
        }
      />

      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search landing pages..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={[
            { key: "name", label: "Landing Page Name" },
            { key: "slug", label: "URL Slug" },
            { key: "template", label: "Template" },
            { key: "views", label: "Page Views" },
            { key: "status", label: "Status" },
            { key: "actions", label: "", className: "text-right" },
          ]}
          rows={placeholderCampaigns.map((campaign) => ({
            name: <span className="font-medium">{campaign.name}</span>,
            slug: (
              <span className="flex items-center gap-1.5 text-muted-foreground font-mono text-sm">
                {campaign.slug}
                <ExternalLink className="h-3 w-3" />
              </span>
            ),
            template: <span className="text-muted-foreground">{campaign.template}</span>,
            views: campaign.views,
            status: <StatusBadge status={campaign.status} />,
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
