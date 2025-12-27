import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Info, Save, ArrowLeft } from "lucide-react";
import { redirectsAPI } from "@/services/api/redirects";

interface RedirectFormData {
  source_path: string;
  target_path: string;
  redirect_type: "301" | "302";
  is_active: boolean;
  notes: string;
}

interface FormErrors {
  source_path?: string;
  target_path?: string;
}

export default function NewRedirect() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RedirectFormData>({
    source_path: "",
    target_path: "",
    redirect_type: "301",
    is_active: true,
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof RedirectFormData>(
    field: K,
    value: RedirectFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.source_path.trim()) {
      newErrors.source_path = "Source path is required";
    } else if (!formData.source_path.startsWith("/")) {
      newErrors.source_path = "Source path must start with /";
    }

    if (!formData.target_path.trim()) {
      newErrors.target_path = "Target path is required";
    } else if (!formData.target_path.startsWith("/")) {
      newErrors.target_path = "Target path must start with /";
    }

    if (
      formData.source_path &&
      formData.target_path &&
      formData.source_path === formData.target_path
    ) {
      newErrors.source_path = "Source and target paths cannot be the same";
      newErrors.target_path = "Source and target paths cannot be the same";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await redirectsAPI.create(formData);
      navigate("/admin/redirects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create redirect");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/redirects");
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Create Redirect"
        description="Add a new URL redirect rule"
        actions={
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Redirects
          </Button>
        }
      />

      <div className="p-8 space-y-6 max-w-3xl">
        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Redirects help maintain SEO value when moving or renaming pages. Use 301 for permanent changes and 302 for temporary redirects.
          </AlertDescription>
        </Alert>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Redirect Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Source Path */}
            <div className="space-y-2">
              <Label htmlFor="source-path">
                Source Path <span className="text-destructive">*</span>
              </Label>
              <Input
                id="source-path"
                value={formData.source_path}
                onChange={(e) => updateField("source_path", e.target.value)}
                placeholder="/old-path"
                className={errors.source_path ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground">
                Path to redirect FROM (must start with /)
              </p>
              {errors.source_path && (
                <p className="text-xs text-destructive">{errors.source_path}</p>
              )}
            </div>

            {/* Target Path */}
            <div className="space-y-2">
              <Label htmlFor="target-path">
                Target Path <span className="text-destructive">*</span>
              </Label>
              <Input
                id="target-path"
                value={formData.target_path}
                onChange={(e) => updateField("target_path", e.target.value)}
                placeholder="/new-path"
                className={errors.target_path ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground">
                Path to redirect TO (must start with /)
              </p>
              {errors.target_path && (
                <p className="text-xs text-destructive">{errors.target_path}</p>
              )}
            </div>

            {/* Redirect Type */}
            <div className="space-y-3">
              <Label>
                Redirect Type <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={formData.redirect_type}
                onValueChange={(value: "301" | "302") =>
                  updateField("redirect_type", value)
                }
              >
                <div className="flex items-start space-x-3 space-y-0 p-4 border rounded-lg">
                  <RadioGroupItem value="301" id="type-301" />
                  <div className="flex-1">
                    <Label htmlFor="type-301" className="font-medium cursor-pointer">
                      301 Permanent
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recommended for moved content. Search engines transfer ranking to the new URL.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-y-0 p-4 border rounded-lg">
                  <RadioGroupItem value="302" id="type-302" />
                  <div className="flex-1">
                    <Label htmlFor="type-302" className="font-medium cursor-pointer">
                      302 Temporary
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recommended for testing. Original URL keeps ranking. Good for seasonal campaigns.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Active Status */}
            <div className="space-y-3">
              <Label>Status</Label>
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <Switch
                  id="is-active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => updateField("is_active", checked)}
                />
                <div className="flex-1">
                  <Label htmlFor="is-active" className="cursor-pointer">
                    Active
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Inactive redirects are not applied
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Reason for this redirect..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Internal notes about why this redirect exists
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>

              <Button onClick={handleSave} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Saving..." : "Save Redirect"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
