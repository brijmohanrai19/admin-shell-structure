import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { collegesAPI, College } from "@/services/api/colleges";

export default function CollegesList() {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await collegesAPI.list();
      setColleges(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load colleges");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading colleges...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadColleges}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Colleges"
        description="Manage all colleges and institutions"
        actions={
          <Link to="/admin/colleges/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add College
            </Button>
          </Link>
        }
      />

      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search colleges..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={[
            { key: "name", label: "College Name" },
            { key: "location", label: "Location" },
            { key: "type", label: "Type" },
            { key: "status", label: "Status" },
            { key: "actions", label: "", className: "text-right" },
          ]}
          rows={colleges.map((college) => ({
            name: (
              <Link
                to={`/admin/colleges/${college.id}`}
                className="font-medium hover:underline"
              >
                {college.name}
              </Link>
            ),
            location: `${college.city}, ${college.state}`,
            type: college.approvals.includes("AICTE") ? "Engineering" : "General",
            status: <StatusBadge status={college.status} />,
            actions: (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(`/admin/colleges/${college.id}`)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => {
                      if (confirm(`Delete ${college.name}?`)) {
                        console.log("Delete college:", college.id);
                        alert("Delete functionality coming soon");
                      }
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ),
          }))}
        />
      </div>
    </div>
  );
}
