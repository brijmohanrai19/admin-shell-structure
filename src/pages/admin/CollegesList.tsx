import { Link } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";

const placeholderColleges = [
  { id: "1", name: "IIT Delhi", location: "New Delhi", type: "Government", status: "live" as const },
  { id: "2", name: "IIT Bombay", location: "Mumbai", type: "Government", status: "live" as const },
  { id: "3", name: "BITS Pilani", location: "Pilani", type: "Private", status: "live" as const },
  { id: "4", name: "NIT Trichy", location: "Tiruchirappalli", type: "Government", status: "draft" as const },
  { id: "5", name: "VIT Vellore", location: "Vellore", type: "Private", status: "draft" as const },
];

export default function CollegesList() {
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
          rows={placeholderColleges.map((college) => ({
            name: <span className="font-medium">{college.name}</span>,
            location: college.location,
            type: college.type,
            status: <StatusBadge status={college.status} />,
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
