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
  DollarSign,
  Target,
  TrendingUp,
  Users,
  Award,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ExamMetrics {
  total_investment: number;
  total_leads: number;
  cost_per_lead: number;
  estimated_revenue: number;
  roi_percentage: number;
  qualified_leads: number;
  conversion_to_application: number;
}

interface CampaignPerformance {
  campaign_name: string;
  investment: number;
  leads: number;
  cpl: number;
  revenue: number;
  roi: number;
}

interface MonthlyTrend {
  month: string;
  investment: number;
  leads: number;
  revenue: number;
}

interface LeadQuality {
  quality: string;
  count: number;
  percentage: number;
}

const mockExamData = {
  id: "1",
  name: "VITEEE 2026",
  status: "live",
  campaigns_count: 3,
  metrics: {
    total_investment: 45000,
    total_leads: 2341,
    cost_per_lead: 19.22,
    estimated_revenue: 124000,
    roi_percentage: 175.6,
    qualified_leads: 1523,
    conversion_to_application: 65.1,
  } as ExamMetrics,
  campaign_performance: [
    {
      campaign_name: "Google Ads Campaign",
      investment: 25000,
      leads: 1245,
      cpl: 20.08,
      revenue: 68000,
      roi: 172
    },
    {
      campaign_name: "Facebook Ads",
      investment: 15000,
      leads: 834,
      cpl: 17.99,
      revenue: 42000,
      roi: 180
    },
    {
      campaign_name: "Landing Page Organic",
      investment: 5000,
      leads: 262,
      cpl: 19.08,
      revenue: 14000,
      roi: 180
    },
  ] as CampaignPerformance[],
  monthly_trend: [
    { month: "Jan", investment: 8000, leads: 412, revenue: 21000 },
    { month: "Feb", investment: 9000, leads: 478, revenue: 24500 },
    { month: "Mar", investment: 10000, leads: 523, revenue: 27800 },
    { month: "Apr", investment: 9500, leads: 498, revenue: 26200 },
    { month: "May", investment: 8500, leads: 430, revenue: 22500 },
  ] as MonthlyTrend[],
  lead_quality: [
    { quality: "High Quality", count: 723, percentage: 30.9 },
    { quality: "Medium Quality", count: 1124, percentage: 48.0 },
    { quality: "Low Quality", count: 494, percentage: 21.1 },
  ] as LeadQuality[],
};

const QUALITY_COLORS = ["#10b981", "#3b82f6", "#f59e0b"];

export default function ExamAnalytics() {
  const { id } = useParams();
  const exam = mockExamData;

  const bestPerformingCampaign = exam.campaign_performance.reduce((best, current) =>
    current.roi > best.roi ? current : best
  );

  return (
    <div className="min-h-screen">
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Link to="/admin/exams">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{exam.name} Analytics</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-green-500 text-white">Live</Badge>
                <Badge variant="outline">{exam.campaigns_count} Campaigns</Badge>
              </div>
            </div>
          </div>
        }
        actions={
          <Select defaultValue="90">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="180">Last 6 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
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
                <DollarSign className="h-4 w-4" />
                Total Investment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${exam.metrics.total_investment.toLocaleString()}</div>
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
              <div className="text-3xl font-bold text-green-600">{exam.metrics.total_leads.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Cost Per Lead
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${exam.metrics.cost_per_lead}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                ROI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{exam.metrics.roi_percentage}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Estimated Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${exam.metrics.estimated_revenue.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Award className="h-4 w-4" />
                Qualified Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exam.metrics.qualified_leads.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {exam.metrics.conversion_to_application}% conversion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Campaign</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Investment</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Leads</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">CPL</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Revenue</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">ROI %</th>
                  </tr>
                </thead>
                <tbody>
                  {exam.campaign_performance.map((campaign) => {
                    const isBest = campaign.campaign_name === bestPerformingCampaign.campaign_name;
                    return (
                      <tr
                        key={campaign.campaign_name}
                        className={`border-b hover:bg-muted/50 transition-colors ${isBest ? 'bg-green-50' : ''}`}
                      >
                        <td className="py-3 px-4 text-sm font-medium">
                          {campaign.campaign_name}
                          {isBest && (
                            <Badge className="ml-2 bg-green-500 text-white text-xs">Best Performer</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-right">${campaign.investment.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-green-600">{campaign.leads}</td>
                        <td className="py-3 px-4 text-sm text-right">${campaign.cpl}</td>
                        <td className="py-3 px-4 text-sm text-right">${campaign.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-right">
                          <span className={campaign.roi > 100 ? 'text-green-600 font-semibold' : 'text-red-600'}>
                            {campaign.roi}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={exam.monthly_trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="investment"
                    stroke="#ef4444"
                    name="Investment ($)"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="leads"
                    stroke="#3b82f6"
                    name="Leads"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    name="Revenue ($)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Lead Quality Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Quality Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={exam.lead_quality}
                    dataKey="percentage"
                    nameKey="quality"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.quality}: ${entry.percentage}%`}
                  >
                    {exam.lead_quality.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={QUALITY_COLORS[index % QUALITY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {exam.lead_quality.map((quality, index) => (
                  <div key={quality.quality} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: QUALITY_COLORS[index] }}
                      />
                      <span className="text-sm">{quality.quality}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{quality.count}</span>
                      <span className="text-muted-foreground"> ({quality.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
