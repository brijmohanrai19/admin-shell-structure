import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CsvImportModal } from "@/components/admin/CsvImportModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, Filter, MoreHorizontal, Upload } from "lucide-react";
import { scholarshipsAPI, Scholarship } from "@/services/api/scholarships";

export default function ScholarshipsList() {
  const navigate = useNavigate();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

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

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await scholarshipsAPI.delete(id);
      toast.success("Scholarship deleted successfully");
      loadScholarships();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete scholarship");
    }
  };

  const handleBulkImport = async (data: any[]) => {
    for (const row of data) {
      const scholarshipData = {
        name: row.name,
        slug: row.slug,
        provider_name: row.provider_name || "",
        eligibility_criteria: row.eligibility_criteria || "",
        amount_min: row.amount_min ? parseInt(row.amount_min) : null,
        amount_max: row.amount_max ? parseInt(row.amount_max) : null,
        currency: row.currency || "INR",
        deadline: row.deadline || null,
        status: "draft" as const,
      };
      await scholarshipsAPI.create(scholarshipData);
    }
    loadScholarships();
  };

  const sampleScholarshipsData = [
    {
      name: "Post Matric Scholarship",
      slug: "post-matric-2026",
      provider_name: "Ministry of Social Justice",
      eligibility_criteria: "Students from SC/ST/OBC categories"
    },
    {
      name: "Kishore Vaigyanik Protsahan Yojana",
      slug: "kvpy-2026",
      provider_name: "Indian Institute of Science",
      eligibility_criteria: "Students pursuing basic sciences"
    },
    {
      name: "National Merit Scholarship",
      slug: "nms-2026",
      provider_name: "Department of Education",
      eligibility_criteria: "Class 10 students with 60%+ marks"
    }
  ];

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
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowImportModal(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </Button>
            <Link to="/admin/scholarships/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Scholarship
              </Button>
            </Link>
          </div>
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
                    onClick={() => handleDelete(scholarship.id, scholarship.name)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ),
          }))}
        />
      </div>

      {/* CSV Import Modal */}
      <CsvImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleBulkImport}
        expectedColumns={[
          "name",
          "slug",
          "provider_name",
          "eligibility_criteria",
        ]}
        title="Import Scholarships from CSV"
        description="Upload a CSV file with scholarship data. Each row will be created as a new scholarship."
        sampleData={sampleScholarshipsData}
        entityName="Scholarship"
      />
    </div>
  );
}
