import { useParams, Link } from "react-router-dom";
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
  ArrowLeft,
  Download,
  Eye,
  Users,
  Target,
  Clock,
  TrendingDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface CampaignMetrics {
  page_views: number;
  unique_visitors: number;
  total_leads: number;
  conversion_rate: number;
  avg_time_on_page: string;
  bounce_rate: number;
}

interface DailyStat {
  date: string;
  views: number;
  leads: number;
}

interface TrafficSource {
  source: string;
  views: number;
  leads: number;
  conversion: number;
}

interface DeviceBreakdown {
  device: string;
  percentage: number;
  leads: number;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  submitted_at: string;
  form_data: {
    course: string;
    city: string;
  };
}

const mockCampaignData = {
  id: "1",
  name: "VITEEE 2026 - Ad Campaign",
  status: "live",
  created_at: "2024-01-15",
  metrics: {
    page_views: 24523,
    unique_visitors: 18234,
    total_leads: 842,
    conversion_rate: 3.43,
    avg_time_on_page: "2m 34s",
    bounce_rate: 42.3,
  } as CampaignMetrics,
  daily_stats: [
    { date: "2024-12-20", views: 1234, leads: 38 },
    { date: "2024-12-21", views: 1456, leads: 42 },
    { date: "2024-12-22", views: 1123, leads: 35 },
    { date: "2024-12-23", views: 1567, leads: 51 },
    { date: "2024-12-24", views: 1389, leads: 44 },
    { date: "2024-12-25", views: 1678, leads: 58 },
    { date: "2024-12-26", views: 1821, leads: 63 },
  ] as DailyStat[],
  traffic_sources: [
    { source: "Google Ads", views: 12234, leads: 421, conversion: 3.44 },
    { source: "Facebook Ads", views: 8456, leads: 289, conversion: 3.42 },
    { source: "Organic Search", views: 2341, leads: 87, conversion: 3.72 },
    { source: "Direct", views: 1492, leads: 45, conversion: 3.02 },
  ] as TrafficSource[],
  device_breakdown: [
    { device: "Mobile", percentage: 68, leads: 572 },
    { device: "Desktop", percentage: 28, leads: 236 },
    { device: "Tablet", percentage: 4, leads: 34 },
  ] as DeviceBreakdown[],
  recent_leads: [
    { id: "1", name: "Rajesh Kumar", phone: "+91-98XXXXXX12", submitted_at: "2024-12-26 14:23", form_data: { course: "B.Tech", city: "Vellore" } },
    { id: "2", name: "Priya Sharma", phone: "+91-97XXXXXX34", submitted_at: "2024-12-26 13:15", form_data: { course: "B.Tech", city: "Chennai" } },
    { id: "3", name: "Amit Patel", phone: "+91-96XXXXXX56", submitted_at: "2024-12-26 12:08", form_data: { course: "M.Tech", city: "Bangalore" } },
  ] as Lead[],
};

const DEVICE_COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

export default function CampaignAnalytics() {
  const { id } = useParams();
  const campaign = mockCampaignData;

  const handleDownloadCSV = () => {
    console.log("Downloading lead data as CSV...");
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Link to="/admin/campaigns">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{campaign.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-green-500 text-white">Live</Badge>
                <span className="text-sm text-muted-foreground">
                  Created {new Date(campaign.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        }
        actions={
          <Select defaultValue="7">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="p-8 space-y-6">
        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Page Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{campaign.metrics.page_views.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Unique Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{campaign.metrics.unique_visitors.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4" />
                Total Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{campaign.metrics.total_leads.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{campaign.metrics.conversion_rate}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Avg Time on Page
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaign.metrics.avg_time_on_page}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Bounce Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaign.metrics.bounce_rate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Performance (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaign.daily_stats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="views" fill="#3b82f6" name="Views" />
                <Line yAxisId="right" type="monotone" dataKey="leads" stroke="#10b981" name="Leads" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic Sources and Device Breakdown */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Traffic Sources Table */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 text-sm font-medium text-muted-foreground">Source</th>
                      <th className="text-right py-2 px-2 text-sm font-medium text-muted-foreground">Views</th>
                      <th className="text-right py-2 px-2 text-sm font-medium text-muted-foreground">Leads</th>
                      <th className="text-right py-2 px-2 text-sm font-medium text-muted-foreground">Conv %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaign.traffic_sources.map((source) => (
                      <tr key={source.source} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-2 text-sm font-medium">{source.source}</td>
                        <td className="py-3 px-2 text-sm text-right">{source.views.toLocaleString()}</td>
                        <td className="py-3 px-2 text-sm text-right font-medium text-green-600">{source.leads}</td>
                        <td className="py-3 px-2 text-sm text-right">{source.conversion}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Device Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={campaign.device_breakdown}
                    dataKey="percentage"
                    nameKey="device"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.device}: ${entry.percentage}%`}
                  >
                    {campaign.device_breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {campaign.device_breakdown.map((device, index) => (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: DEVICE_COLORS[index] }}
                      />
                      <span className="text-sm">{device.device}</span>
                    </div>
                    <span className="text-sm font-medium">{device.leads} leads</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Leads</CardTitle>
              <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Phone</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Course</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">City</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {campaign.recent_leads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium">{lead.name}</td>
                      <td className="py-3 px-4 text-sm font-mono">{lead.phone}</td>
                      <td className="py-3 px-4 text-sm">{lead.form_data.course}</td>
                      <td className="py-3 px-4 text-sm">{lead.form_data.city}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{lead.submitted_at}</td>
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
