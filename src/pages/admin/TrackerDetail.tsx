import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { trackersAPI, Tracker } from "@/services/api/trackers";

interface TrackerFormData {
  name: string;
  type: string;
  scope: "global" | "entity" | "campaign";
  script_code: string;
  load_position: "head" | "body_start" | "body_end";
  is_active: boolean;
  priority: number;
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

export default function TrackerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tracker, setTracker] = useState<Tracker | null>(null);
  const [formData, setFormData] = useState<TrackerFormData>({
    name: "",
    type: "",
    scope: "campaign",
    script_code: "",
    load_position: "head",
    is_active: true,
    priority: 5,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadTracker();
    }
  }, [id]);

  const loadTracker = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trackersAPI.get(id!);
      setTracker(data);
      setFormData({
        name: data.name,
        type: data.type,
        scope: data.scope as "global" | "entity" | "campaign",
        script_code: data.script_code,
        load_position: data.load_position as "head" | "body_start" | "body_end",
        is_active: data.is_active,
        priority: data.priority,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tracker");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof TrackerFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError("Tracker name is required");
      return;
    }

    if (!formData.type) {
      setError("Tracker type is required");
      return;
    }

    if (!formData.script_code.trim()) {
      setError("Script code is required");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const updated = await trackersAPI.update(id!, formData);
      setTracker(updated);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update tracker");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this tracker?")) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await trackersAPI.delete(id!);
      navigate("/admin/trackers");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete tracker");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !tracker) {
    return (
      <div className="min-h-screen p-8">
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button onClick={loadTracker} variant="outline" size="sm">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!tracker) {
    return (
      <div className="min-h-screen p-8">
        <Alert variant="destructive">
          <AlertDescription>Tracker not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title={tracker.name}
        description={`Tracker ID: ${tracker.id}`}
        actions={
          <div className="flex gap-2">
            <Link to="/admin/trackers">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Trackers
              </Button>
            </Link>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              Delete Tracker
            </Button>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Tracker Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Tracker Information</span>
              <div className="flex gap-2">
                <Badge variant={tracker.is_active ? "default" : "secondary"}>
                  {tracker.is_active ? "Active" : "Inactive"}
                </Badge>
                <Badge className={
                  tracker.scope === "global" ? "bg-purple-500 text-white" :
                  tracker.scope === "entity" ? "bg-blue-500 text-white" :
                  "bg-green-500 text-white"
                }>
                  {tracker.scope}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{new Date(tracker.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{new Date(tracker.updated_at).toLocaleString()}</p>
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
                  <SelectValue placeholder="Select tracker type..." />
                </SelectTrigger>
                <SelectContent>
                  {trackerTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                placeholder="Enter the complete script tag(s) for this tracker"
              />
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
              <Button variant="outline" onClick={() => navigate("/admin/trackers")} disabled={saving}>
                Cancel
              </Button>

              <Button onClick={handleSave} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
