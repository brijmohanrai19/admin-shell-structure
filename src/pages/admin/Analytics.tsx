import { PageHeader } from "@/components/admin/PageHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Users,
  Eye,
  Clock,
  Download,
  Calendar,
} from "lucide-react";

export default function Analytics() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Analytics"
        description="View detailed analytics and performance metrics"
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 days
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Page Views"
            value="2.4M"
            change="+12.5% vs last period"
            changeType="positive"
            icon={Eye}
          />
          <StatsCard
            title="Unique Visitors"
            value="456K"
            change="+8.2% vs last period"
            changeType="positive"
            icon={Users}
          />
          <StatsCard
            title="Avg. Session Duration"
            value="4m 32s"
            change="+15% vs last period"
            changeType="positive"
            icon={Clock}
          />
          <StatsCard
            title="Bounce Rate"
            value="32.4%"
            change="-2.1% vs last period"
            changeType="positive"
            icon={TrendingUp}
          />
        </div>

        {/* Charts Placeholder */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Traffic Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg bg-muted/30">
                <p className="text-muted-foreground text-sm">Chart Placeholder</p>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { page: "/exams/jee-main", views: "234K" },
                  { page: "/colleges/list", views: "189K" },
                  { page: "/scholarships", views: "156K" },
                  { page: "/exams/neet", views: "134K" },
                  { page: "/colleges/iit-delhi", views: "98K" },
                ].map((item, index) => (
                  <div
                    key={item.page}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-6">
                        {index + 1}
                      </span>
                      <span className="text-sm font-mono">{item.page}</span>
                    </div>
                    <span className="text-sm font-medium">{item.views}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* More Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle>Device Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center border border-dashed border-border rounded-lg bg-muted/30">
                <p className="text-muted-foreground text-sm">Pie Chart Placeholder</p>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center border border-dashed border-border rounded-lg bg-muted/30">
                <p className="text-muted-foreground text-sm">Bar Chart Placeholder</p>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center border border-dashed border-border rounded-lg bg-muted/30">
                <p className="text-muted-foreground text-sm">Map Placeholder</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
