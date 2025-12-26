import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Info, Save, AlertTriangle } from "lucide-react";

interface TrackerFormData {
  name: string;
  type: string;
  scope: "global" | "entity" | "campaign";
  script_code: string;
  load_position: "head" | "body_start" | "body_end";
  is_active: boolean;
  priority: number;
  usage_count: number;
}

const trackerTypes = [
  { value: "google_analytics", label: "Google Analytics 4" },
  { value: "google_tag_manager", label: "Google Tag Manager" },
  { value: "meta_pixel", label: "Meta Pixel" },
  { value: "linkedin", label: "LinkedIn Insight Tag" },
  { value: "twitter", label: "Twitter Pixel" },
  { value: "tiktok", label: "TikTok Pixel" },
  { value: "custom", label: "Custom Tracker" },
];

const scopes = [
  { value: "global", label: "Global (All Pages)", description: "Fires on every page across the platform" },
  { value: "entity", label: "Entity Level", description: "Applied to specific entities (exams, colleges)" },
  { value: "campaign", label: "Campaign Level", description: "Applied to specific campaigns only" },
];

const loadPositions = [
  { value: "head", label: "Head", description: "Loads in <head> tag (recommended for most trackers)" },
  { value: "body_start", label: "Body Start", description: "Loads at beginning of <body>" },
  { value: "body_end", label: "Body End", description: "Loads at end of <body> (recommended for performance)" },
];

// Mock data
const mockTracker: TrackerFormData = {
  name: "Google Analytics 4",
  type: "google_analytics",
  scope: "global",
  script_code: `<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>`,
  load_position: "head",
  is_active: true,
  priority: 10,
  usage_count: 25,
};

export default function EditTracker() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TrackerFormData>(mockTracker);

  const updateField = (field: keyof TrackerFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isInUse = formData.usage_count > 0;

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Tracker name is required");
      return;
    }

    if (!formData.type) {
      alert("Tracker type is required");
      return;
    }

    if (!formData.script_code.trim()) {
      alert("Script code is required");
      return;
    }

    console.log("Updating tracker:", formData);
    alert("Tracker updated successfully! (mock)");
    navigate("/admin/trackers");
  };

  const handleCancel = () => {
    navigate("/admin/trackers");
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title={`Edit Tracker: ${formData.name}`}
        description="Update tracker configuration"
      />

      <div className="p-8 space-y-6">
        {/* Usage Warning */}
        {isInUse && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> This tracker is currently active on {formData.usage_count} pages.
              Changes will affect all pages using this tracker.
            </AlertDescription>
          </Alert>
        )}

        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Trackers are injected server-side and deduplicated by tracker ID. They will be automatically minified and optimized for performance.
          </AlertDescription>
        </Alert>

        {/* Usage Information */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tracker ID</p>
                <p className="text-lg font-semibold">{id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Pages</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">{formData.usage_count}</p>
                  {isInUse && <Badge variant="secondary">In Use</Badge>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Tracker Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g., Google Analytics 4"
              />
              {!formData.name && (
                <p className="text-xs text-destructive">Tracker name is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">
                Tracker Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => updateField("type", value)}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {trackerTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!formData.type && (
                <p className="text-xs text-destructive">Tracker type is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="scope">Scope</Label>
              <Select
                value={formData.scope}
                onValueChange={(value: any) => updateField("scope", value)}
              >
                <SelectTrigger id="scope">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {scopes.map((scope) => (
                    <SelectItem key={scope.value} value={scope.value}>
                      <div>
                        <div className="font-medium">{scope.label}</div>
                        <div className="text-xs text-muted-foreground">{scope.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                value={formData.priority}
                onChange={(e) => updateField("priority", parseInt(e.target.value) || 0)}
                min="0"
                max="100"
              />
              <p className="text-xs text-muted-foreground">
                Higher priority trackers load first (0-100)
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is-active"
                checked={formData.is_active}
                onCheckedChange={(checked) => updateField("is_active", checked)}
              />
              <Label htmlFor="is-active" className="cursor-pointer">
                Active (tracker will fire on pages)
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Script Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Script Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="load-position">Load Position</Label>
              <Select
                value={formData.load_position}
                onValueChange={(value: any) => updateField("load_position", value)}
              >
                <SelectTrigger id="load-position">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {loadPositions.map((pos) => (
                    <SelectItem key={pos.value} value={pos.value}>
                      <div>
                        <div className="font-medium">{pos.label}</div>
                        <div className="text-xs text-muted-foreground">{pos.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="script-code">
                Script Code <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="script-code"
                value={formData.script_code}
                onChange={(e) => updateField("script_code", e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
              {!formData.script_code && (
                <p className="text-xs text-destructive">Script code is required</p>
              )}
              <p className="text-xs text-muted-foreground">
                Enter the complete script tag(s) for this tracker
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>

              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
