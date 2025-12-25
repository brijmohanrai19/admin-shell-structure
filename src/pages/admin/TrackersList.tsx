import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, MoreHorizontal, Play, Pause } from "lucide-react";

const placeholderTrackers = [
  { id: "1", name: "Page View Tracker", events: "1.2M", status: "active" as const, lastEvent: "2 min ago" },
  { id: "2", name: "Form Submission Tracker", events: "45K", status: "active" as const, lastEvent: "5 min ago" },
  { id: "3", name: "Click Tracker", events: "890K", status: "active" as const, lastEvent: "1 min ago" },
  { id: "4", name: "Download Tracker", events: "12K", status: "draft" as const, lastEvent: "1 hour ago" },
  { id: "5", name: "Error Tracker", events: "234", status: "active" as const, lastEvent: "30 min ago" },
];

export default function TrackersList() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Trackers"
        description="Manage analytics trackers and event configurations"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Tracker
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search trackers..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={[
            { key: "name", label: "Tracker Name" },
            { key: "events", label: "Total Events" },
            { key: "status", label: "Status" },
            { key: "lastEvent", label: "Last Event" },
            { key: "actions", label: "", className: "text-right" },
          ]}
          rows={placeholderTrackers.map((tracker) => ({
            name: <span className="font-medium">{tracker.name}</span>,
            events: tracker.events,
            status: <StatusBadge status={tracker.status} />,
            lastEvent: <span className="text-muted-foreground">{tracker.lastEvent}</span>,
            actions: (
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon">
                  {tracker.status === "active" ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            ),
          }))}
        />
      </div>
    </div>
  );
}
