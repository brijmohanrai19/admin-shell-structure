import { Link } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";

const placeholderCampaigns = [
  { id: "1", name: "Spring Admissions 2025", type: "Email", reach: "45,000", status: "active" as const },
  { id: "2", name: "JEE Preparation Guide", type: "Content", reach: "120,000", status: "published" as const },
  { id: "3", name: "Scholarship Alert Series", type: "Notification", reach: "80,000", status: "draft" as const },
  { id: "4", name: "College Fair Promotion", type: "Multi-channel", reach: "65,000", status: "pending" as const },
  { id: "5", name: "Alumni Success Stories", type: "Social", reach: "30,000", status: "archived" as const },
];

export default function CampaignsList() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Campaigns"
        description="Manage marketing campaigns and promotions"
        actions={
          <Link to="/admin/campaigns/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </Link>
        }
      />

      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search campaigns..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={[
            { key: "name", label: "Campaign Name" },
            { key: "type", label: "Type" },
            { key: "reach", label: "Est. Reach" },
            { key: "status", label: "Status" },
            { key: "actions", label: "", className: "text-right" },
          ]}
          rows={placeholderCampaigns.map((campaign) => ({
            name: <span className="font-medium">{campaign.name}</span>,
            type: campaign.type,
            reach: campaign.reach,
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
