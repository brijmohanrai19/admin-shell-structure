import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Eye, Info } from "lucide-react";

const mockSeoRecords = [
  {
    id: "1",
    source_type: "campaign",
    source_name: "VITEEE 2026 Admissions",
    url_slug: "/viteee-2026",
    title: "VITEEE 2026 - Apply for VIT Engineering Entrance Exam",
    description: "Apply for VITEEE 2026 Engineering Entrance Exam. Get admission to VIT's top B.Tech programs. Register now!",
    indexed: true,
    last_crawled: "2024-03-15",
  },
  {
    id: "2",
    source_type: "exam",
    source_name: "JEE Main",
    url_slug: "/exams/jee-main",
    title: "JEE Main 2026 - Engineering Entrance Exam",
    description: "Complete guide to JEE Main 2026. Exam dates, syllabus, pattern, and preparation tips.",
    indexed: true,
    last_crawled: "2024-03-14",
  },
  {
    id: "3",
    source_type: "college",
    source_name: "VIT Chennai",
    url_slug: "/colleges/vit-chennai",
    title: "VIT Chennai - Vellore Institute of Technology",
    description: "VIT Chennai Campus - Top engineering college in India. Admissions, courses, placements.",
    indexed: true,
    last_crawled: "2024-03-13",
  },
  {
    id: "4",
    source_type: "scholarship",
    source_name: "Merit Scholarship 2024",
    url_slug: "/scholarships/merit-2024",
    title: "Merit Scholarship 2024 - Apply for Financial Aid",
    description: "Merit-based scholarship for engineering students. Up to 100% tuition fee waiver. Apply now!",
    indexed: false,
    last_crawled: null,
  },
  {
    id: "5",
    source_type: "campaign",
    source_name: "KIITEE 2026 Applications",
    url_slug: "/kiitee-2026",
    title: "KIITEE 2026 - KIIT Engineering Entrance Exam",
    description: "Apply for KIITEE 2026. Engineering admission to KIIT University. Online application open.",
    indexed: true,
    last_crawled: "2024-03-12",
  },
];

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
  const indexedCount = mockSeoRecords.filter((r) => r.indexed).length;
  const notIndexedCount = mockSeoRecords.length - indexedCount;

  return (
    <div className="min-h-screen">
      <PageHeader
        title="SEO Records"
        description="View auto-generated SEO metadata for all pages"
      />

      <div className="p-8 space-y-6">
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
              <div className="text-2xl font-bold">{mockSeoRecords.length}</div>
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
            <Input placeholder="Search SEO records..." className="pl-10" />
          </div>
        </div>

        {/* SEO Records List */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockSeoRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getSourceColor(record.source_type)} capitalize`}>
                        {record.source_type}
                      </Badge>
                      <span className="font-medium">{record.source_name}</span>
                      {record.indexed ? (
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
                        <code className="text-xs bg-muted px-2 py-0.5 rounded">{record.url_slug}</code>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">Title:</span>
                        <p className="text-sm">{record.title}</p>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">Description:</span>
                        <p className="text-sm text-muted-foreground">{record.description}</p>
                      </div>

                      {record.last_crawled && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Last Crawled:</span>
                          <span className="text-xs">
                            {new Date(record.last_crawled).toLocaleDateString()}
                          </span>
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
