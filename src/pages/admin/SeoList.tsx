import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, MoreHorizontal, AlertTriangle, CheckCircle, Info } from "lucide-react";

const placeholderSeoPages = [
  { id: "1", page: "/exams/jee-main", score: 92, issues: 0, status: "active" as const },
  { id: "2", page: "/colleges/iit-delhi", score: 85, issues: 2, status: "active" as const },
  { id: "3", page: "/scholarships/merit", score: 78, issues: 3, status: "pending" as const },
  { id: "4", page: "/exams/neet", score: 95, issues: 0, status: "active" as const },
  { id: "5", page: "/colleges/bits-pilani", score: 70, issues: 5, status: "draft" as const },
];

export default function SeoList() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="SEO Management"
        description="Monitor and optimize search engine performance"
      />

      <div className="p-8 space-y-6">
        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. SEO Score
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">84/100</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
          <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pages with Issues
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">-5 from last week</p>
            </CardContent>
          </Card>
          <Card className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Indexed Pages
              </CardTitle>
              <Info className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4,567</div>
              <p className="text-xs text-muted-foreground">+156 this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search pages..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={[
            { key: "page", label: "Page URL" },
            { key: "score", label: "SEO Score" },
            { key: "issues", label: "Issues" },
            { key: "status", label: "Status" },
            { key: "actions", label: "", className: "text-right" },
          ]}
          rows={placeholderSeoPages.map((page) => ({
            page: <span className="font-mono text-sm">{page.page}</span>,
            score: (
              <div className="flex items-center gap-2">
                <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${page.score}%` }}
                  />
                </div>
                <span className="text-sm">{page.score}</span>
              </div>
            ),
            issues: page.issues > 0 ? (
              <span className="text-warning font-medium">{page.issues} issues</span>
            ) : (
              <span className="text-success">No issues</span>
            ),
            status: <StatusBadge status={page.status} />,
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
