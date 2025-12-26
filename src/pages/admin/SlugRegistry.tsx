import { useState } from "react";
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
import { Search, Info, ExternalLink, Copy, CheckCircle2 } from "lucide-react";

interface SlugRecord {
  id: string;
  full_path: string;
  entity_type: "exam" | "college" | "scholarship" | "campaign";
  entity_id: string;
  entity_name: string;
  status: "draft" | "active" | "retired";
  created_at: string;
  registered_by: string;
}

const mockSlugRegistry: SlugRecord[] = [
  {
    id: "1",
    full_path: "/exam/viteee-2026",
    entity_type: "exam",
    entity_id: "1",
    entity_name: "VITEEE 2026",
    status: "active",
    created_at: "2024-01-15",
    registered_by: "admin@example.com",
  },
  {
    id: "2",
    full_path: "/college/vit-vellore",
    entity_type: "college",
    entity_id: "1",
    entity_name: "VIT Vellore",
    status: "active",
    created_at: "2024-01-20",
    registered_by: "admin@example.com",
  },
  {
    id: "3",
    full_path: "/ad/viteee-admissions",
    entity_type: "campaign",
    entity_id: "1",
    entity_name: "VITEEE Ad Campaign",
    status: "active",
    created_at: "2024-02-01",
    registered_by: "admin@example.com",
  },
  {
    id: "4",
    full_path: "/exam/jee-main-2025",
    entity_type: "exam",
    entity_id: "2",
    entity_name: "JEE Main 2025",
    status: "retired",
    created_at: "2023-06-10",
    registered_by: "admin@example.com",
  },
  {
    id: "5",
    full_path: "/scholarship/merit-scholarship",
    entity_type: "scholarship",
    entity_id: "1",
    entity_name: "National Merit Scholarship 2026",
    status: "active",
    created_at: "2024-03-05",
    registered_by: "admin@example.com",
  },
  {
    id: "6",
    full_path: "/lp/engineering-admission",
    entity_type: "campaign",
    entity_id: "2",
    entity_name: "Engineering Admission LP",
    status: "draft",
    created_at: "2024-12-20",
    registered_by: "admin@example.com",
  },
  {
    id: "7",
    full_path: "/exam/neet-ug-2024",
    entity_type: "exam",
    entity_id: "3",
    entity_name: "NEET UG 2024",
    status: "retired",
    created_at: "2023-03-15",
    registered_by: "admin@example.com",
  },
];

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
      return `/admin/exams/${entityId}/edit`;
    case "college":
      return `/admin/colleges/${entityId}/edit`;
    case "scholarship":
      return `/admin/scholarships/${entityId}/edit`;
    case "campaign":
      return `/admin/campaigns/${entityId}/edit`;
    default:
      return "#";
  }
};

export default function SlugRegistry() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [entityTypeFilter, setEntityTypeFilter] = useState("all");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const handleCopySlug = (slug: string) => {
    navigator.clipboard.writeText(slug);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleCheckAvailability = (slug: string) => {
    const exists = mockSlugRegistry.some(s => s.full_path === slug);
    alert(exists ? `Slug "${slug}" is already registered!` : `Slug "${slug}" is available!`);
  };

  const filteredSlugs = mockSlugRegistry.filter((slug) => {
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
      </div>
    </div>
  );
}
