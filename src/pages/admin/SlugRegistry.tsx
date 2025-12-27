import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Info, ExternalLink, Copy, CheckCircle2, Loader2 } from "lucide-react";
import { slugRegistryAPI, SlugRecord } from "@/services/api/slug-registry";

const getStatusColor = (status: string) => {
  switch (status) {
    case "draft":
      return "bg-gray-500 text-white";
    case "active":
      return "bg-green-500 text-white";
    case "retired":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const getEntityTypeColor = (entityType: string) => {
  switch (entityType) {
    case "exam":
      return "bg-blue-500 text-white";
    case "college":
      return "bg-purple-500 text-white";
    case "scholarship":
      return "bg-orange-500 text-white";
    case "campaign":
      return "bg-pink-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const getEntityEditPath = (entityType: string, entityId: string) => {
  switch (entityType) {
    case "exam":
      return `/admin/exams/${entityId}`;
    case "college":
      return `/admin/colleges/${entityId}`;
    case "scholarship":
      return `/admin/scholarships/${entityId}`;
    case "campaign":
      return `/admin/campaigns/${entityId}`;
    default:
      return "#";
  }
};

export default function SlugRegistry() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [entityTypeFilter, setEntityTypeFilter] = useState("all");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [slugs, setSlugs] = useState<SlugRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSlugs();
  }, []);

  const loadSlugs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await slugRegistryAPI.list();
      setSlugs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load slug registry");
    } finally {
      setLoading(false);
    }
  };

  const handleCopySlug = (slug: string) => {
    navigator.clipboard.writeText(slug);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleCheckAvailability = (slug: string) => {
    const exists = slugs.some(s => s.full_path === slug);
    alert(exists ? `Slug "${slug}" is already registered!` : `Slug "${slug}" is available!`);
  };

  const filteredSlugs = slugs.filter((slug) => {
    const matchesSearch =
      slug.full_path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slug.entity_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || slug.status === statusFilter;
    const matchesEntityType = entityTypeFilter === "all" || slug.entity_type === entityTypeFilter;
    return matchesSearch && matchesStatus && matchesEntityType;
  });

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Slug Registry"
        description="Manage URL slug allocation and prevent conflicts"
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
              <Button onClick={loadSlugs} variant="outline" size="sm">
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!loading && !error && (
          <>
            {/* Info Alert */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Note:</strong> Retired slugs are permanently reserved and cannot be reused. This prevents broken links and maintains SEO value.
              </AlertDescription>
            </Alert>

            {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search slugs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
          <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="exam">Exam</SelectItem>
              <SelectItem value="college">College</SelectItem>
              <SelectItem value="scholarship">Scholarship</SelectItem>
              <SelectItem value="campaign">Campaign</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {filteredSlugs.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <p className="text-muted-foreground">
              No slugs registered yet. Slugs are created when entities or campaigns are saved.
            </p>
          </div>
        ) : (
          <DataTable
            columns={[
              { key: "full_path", label: "Full Path" },
              { key: "entity_type", label: "Entity Type" },
              { key: "entity_name", label: "Entity Name" },
              { key: "status", label: "Status" },
              { key: "created_at", label: "Created" },
              { key: "actions", label: "Actions", className: "text-right" },
            ]}
            rows={filteredSlugs.map((slug) => ({
              full_path: (
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {slug.full_path}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCopySlug(slug.full_path)}
                  >
                    {copiedSlug === slug.full_path ? (
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              ),
              entity_type: (
                <Badge className={`${getEntityTypeColor(slug.entity_type)} capitalize`}>
                  {slug.entity_type}
                </Badge>
              ),
              entity_name: (
                <Link
                  to={getEntityEditPath(slug.entity_type, slug.entity_id)}
                  className="text-sm font-medium hover:underline"
                >
                  {slug.entity_name}
                </Link>
              ),
              status: (
                <Badge className={`${getStatusColor(slug.status)} capitalize`}>
                  {slug.status}
                </Badge>
              ),
              created_at: (
                <span className="text-sm text-muted-foreground">
                  {new Date(slug.created_at).toLocaleDateString()}
                </span>
              ),
              actions: (
                <div className="flex items-center justify-end gap-2">
                  <Link to={getEntityEditPath(slug.entity_type, slug.entity_id)}>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Entity
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCheckAvailability(slug.full_path)}
                  >
                    Check
                  </Button>
                </div>
              ),
            }))}
          />
        )}
          </>
        )}
      </div>
    </div>
  );
}
