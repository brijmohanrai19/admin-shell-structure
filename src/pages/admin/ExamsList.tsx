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
import { examsAPI, Exam } from "@/services/api/exams";

export default function ExamsList() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await examsAPI.list();
      setExams(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await examsAPI.delete(id);
      toast.success("Exam deleted successfully");
      loadExams();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete exam");
    }
  };

  const handleBulkImport = async (data: any[]) => {
    for (const row of data) {
      const examData = {
        name: row.name,
        slug: row.slug,
        conducting_body: row.conducting_body,
        exam_date: row.exam_date || null,
        description: row.description || "",
        eligibility: row.eligibility || "",
        exam_pattern: row.exam_pattern || "",
        priority: parseInt(row.priority) || 0,
        status: "draft" as const,
      };
      await examsAPI.create(examData);
    }
    loadExams();
  };

  const sampleExamsData = [
    {
      name: "GATE 2026",
      slug: "gate-2026",
      conducting_body: "IIT",
      exam_date: "2026-02-10",
      description: "Graduate Aptitude Test in Engineering",
      eligibility: "Bachelor's degree in Engineering/Technology",
      exam_pattern: "Computer-based test with MCQs",
      priority: "8"
    },
    {
      name: "CAT 2026",
      slug: "cat-2026",
      conducting_body: "IIM",
      exam_date: "2026-11-28",
      description: "Common Admission Test for MBA",
      eligibility: "Bachelor's degree with 50% marks",
      exam_pattern: "3 sections - QA VA-RC DI-LR",
      priority: "7"
    },
    {
      name: "CLAT 2026",
      slug: "clat-2026",
      conducting_body: "CLAT Consortium",
      exam_date: "2026-12-06",
      description: "Common Law Admission Test",
      eligibility: "Class 12 pass or appearing",
      exam_pattern: "2 hour exam with 150 questions",
      priority: "6"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading exams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadExams}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Exams"
        description="Manage entrance examinations"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowImportModal(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </Button>
            <Link to="/admin/exams/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Exam
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
            <Input placeholder="Search exams..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={[
            { key: "name", label: "Exam Name" },
            { key: "conducting_body", label: "Conducting Body" },
            { key: "exam_date", label: "Exam Date" },
            { key: "status", label: "Status" },
            { key: "actions", label: "", className: "text-right" },
          ]}
          rows={exams.map((exam) => ({
            name: (
              <Link
                to={`/admin/exams/${exam.id}`}
                className="font-medium hover:underline"
              >
                {exam.name}
              </Link>
            ),
            conducting_body: exam.conducting_body,
            exam_date: exam.exam_date
              ? new Date(exam.exam_date).toLocaleDateString()
              : "TBD",
            status: <StatusBadge status={exam.status} />,
            actions: (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(`/admin/exams/${exam.id}`)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => handleDelete(exam.id, exam.name)}
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
          "conducting_body",
          "exam_date",
          "description",
          "eligibility",
          "exam_pattern",
          "priority",
        ]}
        title="Import Exams from CSV"
        description="Upload a CSV file with exam data. Each row will be created as a new exam."
        sampleData={sampleExamsData}
        entityName="Exam"
      />
    </div>
  );
}
