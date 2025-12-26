import { Link } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";

const placeholderScholarships = [
  { id: "1", name: "Merit Scholarship 2025", provider: "Government", amount: "₹50,000", status: "live" as const },
  { id: "2", name: "Sports Excellence Award", provider: "MHRD", amount: "₹75,000", status: "live" as const },
  { id: "3", name: "Women in STEM Grant", provider: "DST", amount: "₹1,00,000", status: "draft" as const },
  { id: "4", name: "SC/ST Scholarship", provider: "Ministry of Social Justice", amount: "₹60,000", status: "live" as const },
  { id: "5", name: "Innovation Fellowship", provider: "Private Foundation", amount: "₹2,00,000", status: "draft" as const },
];

export default function ScholarshipsList() {
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
          rows={placeholderScholarships.map((scholarship) => ({
            name: <span className="font-medium">{scholarship.name}</span>,
            provider: scholarship.provider,
            amount: scholarship.amount,
            status: <StatusBadge status={scholarship.status} />,
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
