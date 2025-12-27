import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, Filter, MoreHorizontal, ExternalLink, Loader2 } from "lucide-react";
import { campaignsAPI, Campaign } from "@/services/api/campaigns";

export default function CampaignsList() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await campaignsAPI.list();
      setCampaigns(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) {
      return;
    }

    try {
      await campaignsAPI.delete(id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete campaign");
    }
  };

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
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button onClick={loadCampaigns} variant="outline" size="sm">
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!loading && !error && (
          <>
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
                { key: "entity", label: "Entity" },
                { key: "status", label: "Status" },
                { key: "actions", label: "", className: "text-right" },
              ]}
              rows={campaigns.map((campaign) => ({
                name: <span className="font-medium">{campaign.name}</span>,
                slug: (
                  <span className="flex items-center gap-1.5 text-muted-foreground font-mono text-sm">
                    /{campaign.url_prefix}/{campaign.slug}
                    <ExternalLink className="h-3 w-3" />
                  </span>
                ),
                entity: campaign.entity_type ? (
                  <span className="text-sm text-muted-foreground capitalize">
                    {campaign.entity_type}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                ),
                status: <StatusBadge status={campaign.status} />,
                actions: (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/admin/campaigns/${campaign.id}`)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(campaign.id, campaign.name)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ),
              }))}
            />
          </>
        )}
      </div>
    </div>
  );
}
