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
import { scholarshipsAPI, Scholarship } from "@/services/api/scholarships";

export default function ScholarshipsList() {
  const navigate = useNavigate();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadScholarships();
  }, []);

  const loadScholarships = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await scholarshipsAPI.list();
      setScholarships(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load scholarships");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (scholarship: Scholarship) => {
    if (!scholarship.amount_min && !scholarship.amount_max) return "N/A";
    if (scholarship.amount_min === scholarship.amount_max) {
      return `${scholarship.currency} ${scholarship.amount_min?.toLocaleString()}`;
    }
    if (scholarship.amount_min && scholarship.amount_max) {
      return `${scholarship.currency} ${scholarship.amount_min.toLocaleString()} - ${scholarship.amount_max.toLocaleString()}`;
    }
    if (scholarship.amount_min) {
      return `${scholarship.currency} ${scholarship.amount_min.toLocaleString()}+`;
    }
    return `Up to ${scholarship.currency} ${scholarship.amount_max?.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading scholarships...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadScholarships}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Scholarships"
        description="Manage scholarships and financial aid programs"
        actions={
          <Link to="/admin/scholarships/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Scholarship
            </Button>
          </Link>
        }
      />

      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search scholarships..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={[
            { key: "name", label: "Scholarship Name" },
            { key: "provider", label: "Provider" },
            { key: "amount", label: "Amount" },
            { key: "status", label: "Status" },
            { key: "actions", label: "", className: "text-right" },
          ]}
          rows={scholarships.map((scholarship) => ({
            name: (
              <Link
                to={`/admin/scholarships/${scholarship.id}`}
                className="font-medium hover:underline"
              >
                {scholarship.name}
              </Link>
            ),
            provider: scholarship.provider_name,
            amount: formatAmount(scholarship),
            status: <StatusBadge status={scholarship.status} />,
            actions: (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(`/admin/scholarships/${scholarship.id}`)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => {
                      if (confirm(`Delete ${scholarship.name}?`)) {
                        console.log("Delete scholarship:", scholarship.id);
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
