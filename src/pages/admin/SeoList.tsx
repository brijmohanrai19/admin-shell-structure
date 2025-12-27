import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Eye, Info, Loader2 } from "lucide-react";
import { seoAPI, SeoEntry } from "@/services/api/seo";

const getSourceColor = (sourceType: string) => {
  switch (sourceType) {
    case "campaign":
      return "bg-green-500 text-white";
    case "exam":
      return "bg-blue-500 text-white";
    case "college":
      return "bg-purple-500 text-white";
    case "scholarship":
      return "bg-orange-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

export default function SeoList() {
  const [seoRecords, setSeoRecords] = useState<SeoEntry[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<SeoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadSeoRecords();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = seoRecords.filter(
        (record) =>
          record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.keywords.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(seoRecords);
    }
  }, [searchQuery, seoRecords]);

  const loadSeoRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await seoAPI.list();
      setSeoRecords(data);
      setFilteredRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load SEO records");
    } finally {
      setLoading(false);
    }
  };

  const indexedCount = filteredRecords.filter((r) => r.index_status === "indexed").length;
  const notIndexedCount = filteredRecords.length - indexedCount;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="SEO Records"
        description="View auto-generated SEO metadata for all pages"
      />

      <div className="p-8 space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <button onClick={loadSeoRecords} className="underline">
                Retry
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Auto-generated:</strong> SEO records are automatically created when campaigns, exams, colleges, or scholarships are published.
            SEO settings can be configured on individual entity pages.
          </AlertDescription>
        </Alert>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total SEO Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredRecords.length}</div>
              <p className="text-xs text-muted-foreground">All published pages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Indexed Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{indexedCount}</div>
              <p className="text-xs text-muted-foreground">Crawled by search engines</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Not Indexed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{notIndexedCount}</div>
              <p className="text-xs text-muted-foreground">Awaiting first crawl</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search SEO records..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* SEO Records List */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Records ({filteredRecords.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRecords.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No SEO records match your search" : "No SEO records found"}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`${getSourceColor(record.source_type)} capitalize`}>
                          {record.source_type}
                        </Badge>
                        {record.index_status === "indexed" ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Indexed
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            Not Indexed
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">URL:</span>
                          <code className="text-xs bg-muted px-2 py-0.5 rounded">{record.url}</code>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">Title:</span>
                          <p className="text-sm">{record.title}</p>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">Description:</span>
                          <p className="text-sm text-muted-foreground">{record.description}</p>
                        </div>

                        {record.keywords && (
                          <div className="flex items-start gap-2">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">Keywords:</span>
                            <p className="text-xs text-muted-foreground">{record.keywords}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Page
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Info */}
        <Card>
          <CardHeader>
            <CardTitle>How SEO Records Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <p className="font-medium">SEO records are automatically created for:</p>
              <ul className="space-y-1 ml-5 list-disc text-muted-foreground">
                <li>Published campaigns (landing pages)</li>
                <li>Live exams (exam detail pages)</li>
                <li>Live colleges (college detail pages)</li>
                <li>Live scholarships (scholarship detail pages)</li>
              </ul>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-medium">To customize SEO for a page:</p>
              <ol className="space-y-1 ml-5 list-decimal text-muted-foreground">
                <li>Navigate to the entity edit page (Campaign, Exam, College, or Scholarship)</li>
                <li>Find the "SEO Configuration" section</li>
                <li>Check "Override SEO settings"</li>
                <li>Customize title, description, keywords, and social media tags</li>
              </ol>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Note:</strong> This is a read-only view. SEO records cannot be edited directly.
                All SEO modifications must be done on the source entity (Campaign, Exam, College, or Scholarship).
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
