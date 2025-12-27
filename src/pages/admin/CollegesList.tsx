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
import { collegesAPI, College } from "@/services/api/colleges";

export default function CollegesList() {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

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

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await collegesAPI.delete(id);
      toast.success("College deleted successfully");
      loadColleges();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete college");
    }
  };

  const handleBulkImport = async (data: any[]) => {
    for (const row of data) {
      const collegeData = {
        name: row.name,
        slug: row.slug,
        city: row.city || "",
        state: row.state || "",
        country: row.country || "India",
        description: row.description || "",
        courses: row.courses ? JSON.parse(row.courses) : [],
        priority: parseInt(row.priority) || 0,
        status: "draft" as const,
      };
      await collegesAPI.create(collegeData);
    }
    loadColleges();
  };

  const sampleCollegesData = [
    {
      name: "NIT Trichy",
      slug: "nit-trichy",
      city: "Tiruchirappalli",
      state: "Tamil Nadu",
      country: "India",
      description: "National Institute of Technology - Premier engineering institute",
      priority: "9"
    },
    {
      name: "IIIT Hyderabad",
      slug: "iiit-hyderabad",
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      description: "International Institute of Information Technology",
      priority: "8"
    },
    {
      name: "Anna University",
      slug: "anna-university",
      city: "Chennai",
      state: "Tamil Nadu",
      country: "India",
      description: "State university offering engineering programs",
      priority: "7"
    }
  ];

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
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowImportModal(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </Button>
            <Link to="/admin/colleges/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add College
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
                    onClick={() => handleDelete(college.id, college.name)}
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
          "city",
          "state",
          "country",
          "description",
          "priority",
        ]}
        title="Import Colleges from CSV"
        description="Upload a CSV file with college data. Each row will be created as a new college."
        sampleData={sampleCollegesData}
        entityName="College"
      />
    </div>
  );
}
