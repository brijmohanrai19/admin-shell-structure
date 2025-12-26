import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CampaignWizardState } from "./wizard-container";

export interface Step5Props {
  state: CampaignWizardState;
  onChange: (updates: Partial<CampaignWizardState>) => void;
}

const mockTrackers = {
  global: [
    { id: "1", name: "Google Analytics 4", type: "google_analytics", is_active: true },
    { id: "2", name: "Google Tag Manager", type: "google_tag_manager", is_active: true },
  ],
  entity: [
    { id: "3", name: "Meta Pixel", type: "meta_pixel", source: "exam" },
  ],
};

const availableTrackers = [
  { id: "4", name: "LinkedIn Insight Tag", type: "linkedin" },
  { id: "5", name: "Twitter Pixel", type: "twitter" },
  { id: "6", name: "TikTok Pixel", type: "tiktok" },
];

export function Step5Tracking({ state, onChange }: Step5Props) {
  const handleAddTracker = () => {
    onChange({
      tracker_overrides: [
        ...state.tracker_overrides,
        {
          tracker_id: "",
          enabled: true,
          priority: 10,
        },
      ],
    });
  };

  const handleRemoveTracker = (index: number) => {
    onChange({
      tracker_overrides: state.tracker_overrides.filter((_, i) => i !== index),
    });
  };

  const handleUpdateTracker = (
    index: number,
    updates: Partial<(typeof state.tracker_overrides)[0]>
  ) => {
    onChange({
      tracker_overrides: state.tracker_overrides.map((tracker, i) =>
        i === index ? { ...tracker, ...updates } : tracker
      ),
    });
  };

  // Calculate final trackers
  const finalTrackers = [
    ...mockTrackers.global.map((t) => ({ ...t, source: "global" })),
    ...(state.entity.type
      ? mockTrackers.entity.map((t) => ({ ...t, source: "entity" }))
      : []),
    ...state.tracker_overrides
      .filter((t) => t.tracker_id && t.enabled)
      .map((t) => {
        const tracker = availableTrackers.find((at) => at.id === t.tracker_id);
        return tracker ? { ...tracker, source: "campaign" } : null;
      })
      .filter(Boolean),
  ];

  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Trackers are injected server-side and deduplicated by tracker ID.
          Trackers from multiple sources are merged automatically.
        </AlertDescription>
      </Alert>

      {/* Inherited Trackers */}
      <Card>
        <CardHeader>
          <CardTitle>Inherited Trackers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              Global Trackers (Always Active)
            </h4>
            <div className="space-y-2">
              {mockTrackers.global.map((tracker) => (
                <div
                  key={tracker.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <div className="font-medium text-sm">{tracker.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {tracker.type}
                    </div>
                  </div>
                  <Badge variant="secondary">Global</Badge>
                </div>
              ))}
            </div>
          </div>

          {state.entity.type && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                Entity Trackers (from {state.entity.type})
              </h4>
              <div className="space-y-2">
                {mockTrackers.entity.map((tracker) => (
                  <div
                    key={tracker.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-sm">{tracker.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {tracker.type}
                      </div>
                    </div>
                    <Badge variant="outline">{tracker.source}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Tracker Resolution:</strong> Global → Entity →  Campaign
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Tracker Overrides */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign-Specific Trackers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.tracker_overrides.length > 0 && (
            <div className="space-y-3">
              {state.tracker_overrides.map((tracker, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-start p-3 border rounded-lg"
                >
                  <div className="flex-1 space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Tracker</Label>
                      <Select
                        value={tracker.tracker_id}
                        onValueChange={(value) =>
                          handleUpdateTracker(index, { tracker_id: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select tracker..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTrackers.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`tracker-${index}-enabled`}
                          checked={tracker.enabled}
                          onCheckedChange={(checked) =>
                            handleUpdateTracker(index, { enabled: checked })
                          }
                        />
                        <Label
                          htmlFor={`tracker-${index}-enabled`}
                          className="text-xs cursor-pointer"
                        >
                          Enabled
                        </Label>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Priority</Label>
                        <Input
                          type="number"
                          value={tracker.priority}
                          onChange={(e) =>
                            handleUpdateTracker(index, {
                              priority: parseInt(e.target.value) || 0,
                            })
                          }
                          className="h-8"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveTracker(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Button
            variant="outline"
            onClick={handleAddTracker}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Campaign Tracker
          </Button>
        </CardContent>
      </Card>

      {/* Final Tracker Resolution Preview */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Final Trackers Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              These trackers will fire on this campaign:
            </p>
            <div className="space-y-2 mt-3">
              {finalTrackers.map((tracker: any, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded"
                >
                  <span className="text-sm font-medium">{tracker.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {tracker.source}
                  </Badge>
                </div>
              ))}
            </div>
            {finalTrackers.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No trackers configured
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
