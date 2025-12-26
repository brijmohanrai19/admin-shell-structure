import { Link } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";

const placeholderExams = [
  { id: "1", name: "JEE Main 2025", category: "Engineering", status: "live" as const, date: "Apr 2025" },
  { id: "2", name: "NEET UG 2025", category: "Medical", status: "draft" as const, date: "May 2025" },
  { id: "3", name: "CAT 2024", category: "Management", status: "closed" as const, date: "Nov 2024" },
  { id: "4", name: "GATE 2025", category: "Engineering", status: "live" as const, date: "Feb 2025" },
  { id: "5", name: "CLAT 2025", category: "Law", status: "draft" as const, date: "Dec 2024" },
];

export default function ExamsList() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Exams"
        description="Manage all exams and their configurations"
        actions={
          <Link to="/admin/exams/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Exam
            </Button>
          </Link>
        }
      />

      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search exams..."
              className="pl-10"
            />
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
            { key: "category", label: "Category" },
            { key: "status", label: "Status" },
            { key: "date", label: "Exam Date" },
            { key: "actions", label: "", className: "text-right" },
          ]}
          rows={placeholderExams.map((exam) => ({
            name: <span className="font-medium">{exam.name}</span>,
            category: exam.category,
            status: <StatusBadge status={exam.status} />,
            date: exam.date,
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
