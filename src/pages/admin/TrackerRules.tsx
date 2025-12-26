import { Link } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Info } from "lucide-react";

const mockRules = [
  {
    id: "1",
    entity_type: "exam",
    entity_name: "VITEEE",
    trackers: ["Google Analytics 4", "Meta Pixel"],
    created_at: "2024-01-15",
  },
  {
    id: "2",
    entity_type: "college",
    entity_name: "VIT Chennai",
    trackers: ["Google Analytics 4", "LinkedIn Insight Tag"],
    created_at: "2024-02-01",
  },
  {
    id: "3",
    entity_type: "scholarship",
    entity_name: "Merit Scholarship 2024",
    trackers: ["Google Tag Manager"],
    created_at: "2024-02-15",
  },
];

const resolutionHierarchy = [
  { level: 1, name: "Campaign Level", description: "Trackers assigned directly to a campaign" },
  { level: 2, name: "Entity Level", description: "Trackers from associated exam, college, or scholarship" },
  { level: 3, name: "Global Level", description: "System-wide trackers (always active)" },
];

export default function TrackerRules() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Tracker Rules"
        description="Manage tracker assignment and resolution hierarchy"
        actions={
          <Link to="/admin/trackers">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Trackers
            </Button>
          </Link>
        }
      />

      <div className="p-8 space-y-6">
        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Tracker Resolution:</strong> Trackers are automatically merged from multiple sources and deduplicated by tracker ID.
            Lower priority levels inherit trackers from higher priority levels.
          </AlertDescription>
        </Alert>

        {/* Resolution Hierarchy */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Tracker Resolution Hierarchy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Trackers are resolved in the following order (highest to lowest priority):
              </p>

              <div className="space-y-2">
                {resolutionHierarchy.map((level) => (
                  <div
                    key={level.level}
                    className="flex items-start gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      {level.level}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{level.name}</h4>
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Example:</strong> If a campaign has Meta Pixel (campaign-level) and is associated with an exam that has Google Analytics (entity-level),
                  the final page will have both trackers: Meta Pixel + Google Analytics + All Global Trackers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deduplication Logic */}
        <Card>
          <CardHeader>
            <CardTitle>Deduplication Logic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                When the same tracker appears at multiple levels:
              </p>

              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">1</Badge>
                  <span>Trackers are identified by their unique <code className="bg-muted px-1 py-0.5 rounded">tracker_id</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">2</Badge>
                  <span>Higher priority level (campaign) overwrites lower priority (entity, global)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">3</Badge>
                  <span>Only one instance of each tracker fires per page (prevents duplicate tracking)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">4</Badge>
                  <span>Disabled trackers are filtered out before injection</span>
                </li>
              </ul>

              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Priority Order:</p>
                <p className="text-sm text-muted-foreground font-mono">
                  Campaign Trackers → Entity Trackers → Global Trackers (deduplicated by tracker_id)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Entity Tracker Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Entity-Level Tracker Rules</span>
              <Badge variant="outline">{mockRules.length} rules</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockRules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No entity-level tracker rules configured</p>
                <p className="text-sm mt-2">Entity trackers are managed at the entity level (Exams, Colleges, Scholarships)</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Entity-level trackers are configured on the entity edit pages (Exams, Colleges, Scholarships).
                    This view shows all current entity tracker assignments.
                  </AlertDescription>
                </Alert>

                {mockRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div>
                        <div className="font-medium">{rule.entity_name}</div>
                        <div className="text-sm text-muted-foreground capitalize">{rule.entity_type}</div>
                      </div>

                      <Badge variant="secondary" className="capitalize">
                        {rule.entity_type}
                      </Badge>

                      <div className="flex flex-wrap gap-1">
                        {rule.trackers.map((tracker, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tracker}
                          </Badge>
                        ))}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Created {new Date(rule.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/admin/${rule.entity_type}s/${rule.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Edit on Entity
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Global Trackers Info */}
        <Card>
          <CardHeader>
            <CardTitle>Global Trackers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Global trackers are system-wide and fire on every page. They are always active and cannot be overridden.
            </p>
            <Link to="/admin/trackers">
              <Button variant="outline">
                Manage Global Trackers
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
