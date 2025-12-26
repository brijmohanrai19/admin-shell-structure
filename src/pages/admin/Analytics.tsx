import { Link } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  Download,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Metric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

interface ChartDataPoint {
  date: string;
  views: number;
  leads: number;
}

interface TopCampaign {
  id: string;
  name: string;
  leads: number;
  conversion: string;
  revenue: string;
}

interface RecentLead {
  id: string;
  name: string;
  exam: string;
  campaign: string;
  date: string;
  status: "new" | "contacted" | "qualified";
}

const mockMetrics: Metric[] = [
  { label: "Total Page Views", value: "124,523", change: "+12.5%", trend: "up" },
  { label: "Total Leads", value: "3,847", change: "+8.3%", trend: "up" },
  { label: "Active Campaigns", value: "23", change: "+2", trend: "up" },
  { label: "Conversion Rate", value: "3.09%", change: "-0.2%", trend: "down" },
];

const mockChartData: ChartDataPoint[] = [
  { date: "2024-01", views: 8500, leads: 245 },
  { date: "2024-02", views: 9200, leads: 278 },
  { date: "2024-03", views: 10100, leads: 312 },
  { date: "2024-04", views: 11300, leads: 356 },
  { date: "2024-05", views: 12800, leads: 402 },
  { date: "2024-06", views: 14200, leads: 441 },
];

const mockTopCampaigns: TopCampaign[] = [
  { id: "1", name: "VITEEE 2026 - Ads", leads: 842, conversion: "3.2%", revenue: "$12,400" },
  { id: "2", name: "IIT JEE Landing Page", leads: 721, conversion: "2.9%", revenue: "$10,200" },
  { id: "3", name: "Scholarship Portal", leads: 634, conversion: "4.1%", revenue: "$8,900" },
  { id: "4", name: "NEET Preparation", leads: 512, conversion: "2.7%", revenue: "$7,100" },
  { id: "5", name: "Engineering Admission", leads: 428, conversion: "3.5%", revenue: "$6,300" },
];

const mockRecentLeads: RecentLead[] = [
  { id: "1", name: "Rajesh Kumar", exam: "VITEEE 2026", campaign: "Ad Campaign", date: "2024-12-26", status: "new" },
  { id: "2", name: "Priya Sharma", exam: "JEE Main", campaign: "Landing Page", date: "2024-12-26", status: "contacted" },
  { id: "3", name: "Amit Patel", exam: "NEET UG", campaign: "Scholarship", date: "2024-12-25", status: "qualified" },
  { id: "4", name: "Sneha Reddy", exam: "GATE", campaign: "Engineering", date: "2024-12-25", status: "new" },
  { id: "5", name: "Vikram Singh", exam: "CAT", campaign: "MBA Admission", date: "2024-12-24", status: "contacted" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "new":
      return "bg-blue-500 text-white";
    case "contacted":
      return "bg-yellow-500 text-white";
    case "qualified":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const MetricCard = ({ metric }: { metric: Metric }) => {
  const isPositive = metric.trend === "up";
  const Icon = isPositive ? ArrowUpIcon : ArrowDownIcon;
  const changeColor = metric.change.startsWith("+") ? "text-green-600" : "text-red-600";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {metric.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{metric.value}</div>
        <div className={`flex items-center gap-1 text-sm mt-2 ${changeColor}`}>
          <Icon className="h-4 w-4" />
          <span>{metric.change}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Analytics() {
  const handleExport = () => {
    console.log("Exporting analytics data...");
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Analytics Dashboard"
        description="Platform-wide analytics and performance metrics"
        actions={
          <div className="flex items-center gap-3">
            <Select defaultValue="30">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {mockMetrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Page Views & Leads Chart - Takes 2 columns */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Page Views & Leads Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="views"
                    stroke="#3b82f6"
                    name="Page Views"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="leads"
                    stroke="#10b981"
                    name="Leads"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Top Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTopCampaigns.map((campaign, index) => (
                  <Link
                    key={campaign.id}
                    to={`/admin/analytics/campaigns/${campaign.id}`}
                    className="block"
                  >
                    <div className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            #{index + 1}
                          </span>
                          <span className="text-sm font-medium truncate">{campaign.name}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{campaign.leads} leads</span>
                          <span>{campaign.conversion}</span>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-green-600">
                        {campaign.revenue}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Exam
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Campaign
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockRecentLeads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium">{lead.name}</td>
                      <td className="py-3 px-4 text-sm">{lead.exam}</td>
                      <td className="py-3 px-4 text-sm">{lead.campaign}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(lead.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${getStatusColor(lead.status)} capitalize`}>
                          {lead.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
