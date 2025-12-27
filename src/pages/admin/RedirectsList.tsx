import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Search, Info, Trash2, ExternalLink, ChevronDown, Loader2 } from "lucide-react";
import { redirectsAPI, Redirect } from "@/services/api/redirects";

const formatHitCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

const truncatePath = (path: string, maxLength: number = 30): string => {
  if (path.length <= maxLength) return path;
  return path.substring(0, maxLength - 3) + "...";
};

export default function RedirectsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRedirects();
  }, []);

  const loadRedirects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await redirectsAPI.list();
      setRedirects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load redirects");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, sourcePath: string) => {
    if (!confirm(`Are you sure you want to delete redirect from "${sourcePath}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await redirectsAPI.delete(id);
      toast.success("Redirect deleted successfully");
      loadRedirects();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete redirect");
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const redirect = redirects.find((r) => r.id === id);
      if (!redirect) return;

      await redirectsAPI.update(id, { is_active: !redirect.is_active });

      setRedirects((prev) =>
        prev.map((redirect) =>
          redirect.id === id
            ? { ...redirect, is_active: !redirect.is_active }
            : redirect
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update redirect status");
    }
  };

  const handleTestRedirect = (sourcePath: string) => {
    window.open(sourcePath, "_blank");
  };

  const filteredRedirects = redirects.filter((redirect) => {
    const matchesSearch =
      redirect.source_path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      redirect.target_path.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === "all" || redirect.redirect_type === typeFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && redirect.is_active) ||
      (statusFilter === "inactive" && !redirect.is_active);
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Redirects"
        description="Manage 301 (permanent) and 302 (temporary) URL redirects"
        actions={
          <Link to="/admin/redirects/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Redirect
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
              <Button onClick={loadRedirects} variant="outline" size="sm">
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!loading && !error && (
          <>
            {/* Info Section (Collapsible) */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                About Redirects
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <Alert>
              <AlertDescription>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>301 Permanent:</strong> Use for permanently moved content. Search engines transfer ranking to the new URL.
                  </p>
                  <p>
                    <strong>302 Temporary:</strong> Use for temporary moves. Original URL keeps ranking. Good for testing or seasonal campaigns.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          </CollapsibleContent>
        </Collapsible>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search redirects..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="301">301 Permanent</SelectItem>
              <SelectItem value="302">302 Temporary</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {filteredRedirects.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <p className="text-muted-foreground">
              No redirects configured. Add your first redirect to manage URL changes.
            </p>
          </div>
        ) : (
          <DataTable
            columns={[
              { key: "source_path", label: "Source Path" },
              { key: "target_path", label: "Target Path" },
              { key: "type", label: "Type" },
              { key: "hits", label: "Hits" },
              { key: "status", label: "Status" },
              { key: "actions", label: "Actions", className: "text-right" },
            ]}
            rows={filteredRedirects.map((redirect) => ({
              source_path: (
                <code
                  className="text-sm font-mono bg-muted px-2 py-1 rounded"
                  title={redirect.source_path}
                >
                  {redirect.source_path}
                </code>
              ),
              target_path: (
                <code
                  className="text-sm font-mono bg-muted px-2 py-1 rounded"
                  title={redirect.target_path}
                >
                  {truncatePath(redirect.target_path)}
                </code>
              ),
              type: (
                <Badge
                  className={
                    redirect.redirect_type === "301"
                      ? "bg-blue-500 text-white"
                      : "bg-yellow-500 text-white"
                  }
                >
                  {redirect.redirect_type}
                </Badge>
              ),
              hits: (
                <span className="text-sm font-medium">
                  {formatHitCount(redirect.hit_count)}
                </span>
              ),
              status: (
                <div className="flex items-center gap-2">
                  <Switch
                    checked={redirect.is_active}
                    onCheckedChange={() => handleToggleActive(redirect.id)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {redirect.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              ),
              actions: (
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTestRedirect(redirect.source_path)}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Test
                  </Button>
                  <Link to={`/admin/redirects/${redirect.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(redirect.id, redirect.source_path)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
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
