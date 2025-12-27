import { useState, useEffect } from "react";
import { analyticsAPI, AnalyticsOverview, CampaignAnalytics, EntityAnalytics } from "@/services/api/analytics";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Users, FileText, Award, RefreshCw } from "lucide-react";

export default function Analytics() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignAnalytics | null>(null);
  const [entities, setEntities] = useState<EntityAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const [overviewData, campaignsData, entitiesData] = await Promise.all([
        analyticsAPI.getOverview(),
        analyticsAPI.getCampaignAnalytics(),
        analyticsAPI.getEntityAnalytics(),
      ]);
      setOverview(overviewData);
      setCampaigns(campaignsData);
      setEntities(entitiesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadAnalytics}>Retry</Button>
        </div>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Analytics Dashboard"
        description="Monitor performance and track key metrics"
        actions={
          <Button onClick={loadAnalytics} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.totalCampaigns || 0}</div>
              <p className="text-xs text-muted-foreground">
                {overview?.activeCampaigns || 0} active, {overview?.draftCampaigns || 0} draft
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Exams</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.totalExams || 0}</div>
              <p className="text-xs text-muted-foreground">Live exams</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Colleges</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.totalColleges || 0}</div>
              <p className="text-xs text-muted-foreground">Live colleges</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Scholarships</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.totalScholarships || 0}</div>
              <p className="text-xs text-muted-foreground">Active scholarships</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campaign Trends */}
          {campaigns && campaigns.trends.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Campaign Creation Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={campaigns.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" name="Campaigns" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Exams by Level */}
          {entities && entities.exams.byLevel.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Exams by Level</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={entities.exams.byLevel}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="level" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Exams" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colleges by Type */}
          {entities && entities.colleges.byType.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Colleges by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={entities.colleges.byType}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {entities.colleges.byType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Scholarships by Type */}
          {entities && entities.scholarships.byType.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Scholarships by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={entities.scholarships.byType}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#00C49F" name="Scholarships" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Campaign Distribution */}
        {campaigns && Object.keys(campaigns.byEntityType).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Campaigns by Entity Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(campaigns.byEntityType).map(([entityType, stats]) => (
                  <div key={entityType} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <div className="font-medium capitalize">{entityType}</div>
                      <div className="text-sm text-muted-foreground">
                        {stats.live} live, {stats.draft} draft
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Colleges */}
        {entities && entities.colleges.topRanked.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top Ranked Colleges (NIRF)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {entities.colleges.topRanked.map((college, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {college.nirf_rank}
                      </div>
                      <div>
                        <div className="font-medium">{college.name}</div>
                        <div className="text-sm text-muted-foreground">
                          NIRF Rank: {college.nirf_rank}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm">
                      {college.placement_percentage ? (
                        <span className="text-green-600 font-medium">
                          {college.placement_percentage}% Placement
                        </span>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {overview?.totalCampaigns === 0 && overview?.totalExams === 0 && overview?.totalColleges === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Data Available</h3>
                <p className="text-sm">
                  Start creating campaigns, exams, colleges, and scholarships to see analytics.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
