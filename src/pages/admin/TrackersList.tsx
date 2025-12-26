import { Link } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Eye, Settings } from "lucide-react";

const mockTrackers = [
  {
    id: "1",
    name: "Google Analytics 4",
    type: "google_analytics",
    scope: "global",
    is_active: true,
    priority: 10,
    created_at: "2024-01-15",
  },
  {
    id: "2",
    name: "Google Tag Manager",
    type: "google_tag_manager",
    scope: "global",
    is_active: true,
    priority: 9,
    created_at: "2024-01-10",
  },
  {
    id: "3",
    name: "Meta Pixel",
    type: "meta_pixel",
    scope: "entity",
    is_active: true,
    priority: 8,
    created_at: "2024-02-01",
  },
  {
    id: "4",
    name: "LinkedIn Insight Tag",
    type: "linkedin",
    scope: "campaign",
    is_active: false,
    priority: 7,
    created_at: "2024-02-15",
  },
  {
    id: "5",
    name: "Twitter Pixel",
    type: "twitter",
    scope: "campaign",
    is_active: true,
    priority: 6,
    created_at: "2024-03-01",
  },
];

type ScopeType = "global" | "entity" | "campaign";

const getScopeColor = (scope: ScopeType) => {
  switch (scope) {
    case "global":
      return "bg-purple-500 text-white";
    case "entity":
      return "bg-blue-500 text-white";
    case "campaign":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

export default function TrackersList() {
  // Group trackers by scope
  const groupedTrackers = {
    global: mockTrackers.filter((t) => t.scope === "global"),
    entity: mockTrackers.filter((t) => t.scope === "entity"),
    campaign: mockTrackers.filter((t) => t.scope === "campaign"),
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Trackers"
        description="Manage analytics and tracking pixel configurations"
        actions={
          <div className="flex gap-2">
            <Link to="/admin/trackers/rules">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Tracker Rules
              </Button>
            </Link>
            <Link to="/admin/trackers/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Tracker
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        {/* Global Trackers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>Global Trackers</span>
                <Badge className="bg-purple-500 text-white">Always Active</Badge>
              </div>
              <Badge variant="outline">{groupedTrackers.global.length} trackers</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {groupedTrackers.global.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No global trackers configured</p>
              </div>
            ) : (
              <div className="space-y-3">
                {groupedTrackers.global.map((tracker) => (
                  <div
                    key={tracker.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div>
                        <div className="font-medium">{tracker.name}</div>
                        <div className="text-sm text-muted-foreground">{tracker.type}</div>
                      </div>

                      <Badge className={getScopeColor(tracker.scope)}>
                        {tracker.scope}
                      </Badge>

                      <Badge variant={tracker.is_active ? "default" : "secondary"}>
                        {tracker.is_active ? "Active" : "Inactive"}
                      </Badge>

                      <div className="text-sm text-muted-foreground">
                        Priority: {tracker.priority}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Created {new Date(tracker.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/admin/trackers/${tracker.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>

                      <Link to={`/admin/trackers/${tracker.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Entity Trackers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>Entity Trackers</span>
                <Badge className="bg-blue-500 text-white">Entity Level</Badge>
              </div>
              <Badge variant="outline">{groupedTrackers.entity.length} trackers</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {groupedTrackers.entity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No entity-level trackers configured</p>
              </div>
            ) : (
              <div className="space-y-3">
                {groupedTrackers.entity.map((tracker) => (
                  <div
                    key={tracker.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div>
                        <div className="font-medium">{tracker.name}</div>
                        <div className="text-sm text-muted-foreground">{tracker.type}</div>
                      </div>

                      <Badge className={getScopeColor(tracker.scope)}>
                        {tracker.scope}
                      </Badge>

                      <Badge variant={tracker.is_active ? "default" : "secondary"}>
                        {tracker.is_active ? "Active" : "Inactive"}
                      </Badge>

                      <div className="text-sm text-muted-foreground">
                        Priority: {tracker.priority}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Created {new Date(tracker.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/admin/trackers/${tracker.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>

                      <Link to={`/admin/trackers/${tracker.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Campaign Trackers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>Campaign Trackers</span>
                <Badge className="bg-green-500 text-white">Campaign Level</Badge>
              </div>
              <Badge variant="outline">{groupedTrackers.campaign.length} trackers</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {groupedTrackers.campaign.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No campaign-level trackers configured</p>
              </div>
            ) : (
              <div className="space-y-3">
                {groupedTrackers.campaign.map((tracker) => (
                  <div
                    key={tracker.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div>
                        <div className="font-medium">{tracker.name}</div>
                        <div className="text-sm text-muted-foreground">{tracker.type}</div>
                      </div>

                      <Badge className={getScopeColor(tracker.scope)}>
                        {tracker.scope}
                      </Badge>

                      <Badge variant={tracker.is_active ? "default" : "secondary"}>
                        {tracker.is_active ? "Active" : "Inactive"}
                      </Badge>

                      <div className="text-sm text-muted-foreground">
                        Priority: {tracker.priority}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Created {new Date(tracker.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/admin/trackers/${tracker.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>

                      <Link to={`/admin/trackers/${tracker.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
