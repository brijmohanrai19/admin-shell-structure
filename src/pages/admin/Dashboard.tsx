import { PageHeader } from "@/components/admin/PageHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  GraduationCap,
  Building2,
  Award,
  Megaphone,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentActivity = [
  { id: "1", action: "Exam Created", entity: "JEE Main 2025", time: "2 hours ago" },
  { id: "2", action: "Campaign Published", entity: "Spring Admissions", time: "4 hours ago" },
  { id: "3", action: "Scholarship Updated", entity: "Merit Scholarship", time: "Yesterday" },
  { id: "4", action: "College Added", entity: "IIT Delhi", time: "Yesterday" },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Dashboard"
        description="Overview of your admin panel activity and statistics"
      />

      <div className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Exams"
            value="156"
            change="+12 this month"
            changeType="positive"
            icon={GraduationCap}
          />
          <StatsCard
            title="Active Colleges"
            value="2,847"
            change="+89 this month"
            changeType="positive"
            icon={Building2}
          />
          <StatsCard
            title="Scholarships"
            value="324"
            change="+5 this month"
            changeType="positive"
            icon={Award}
          />
          <StatsCard
            title="Active Campaigns"
            value="42"
            change="3 ending soon"
            changeType="neutral"
            icon={Megaphone}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Page Views"
            value="1.2M"
            change="+18.2% vs last month"
            changeType="positive"
            icon={TrendingUp}
          />
          <StatsCard
            title="Active Users"
            value="45.2K"
            change="+8.5% vs last month"
            changeType="positive"
            icon={Users}
          />
          <Card className="animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <button className="rounded-lg border border-border bg-card p-3 text-sm font-medium hover:bg-accent transition-colors text-left">
                + New Exam
              </button>
              <button className="rounded-lg border border-border bg-card p-3 text-sm font-medium hover:bg-accent transition-colors text-left">
                + New Campaign
              </button>
              <button className="rounded-lg border border-border bg-card p-3 text-sm font-medium hover:bg-accent transition-colors text-left">
                + New College
              </button>
              <button className="rounded-lg border border-border bg-card p-3 text-sm font-medium hover:bg-accent transition-colors text-left">
                + New Template
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Recent Activity
          </h2>
          <DataTable
            columns={[
              { key: "action", label: "Action" },
              { key: "entity", label: "Entity" },
              { key: "time", label: "Time", className: "text-right" },
            ]}
            rows={recentActivity.map((item) => ({
              action: <span className="font-medium">{item.action}</span>,
              entity: item.entity,
              time: <span className="text-muted-foreground">{item.time}</span>,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
