import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlugInput } from "@/components/admin/shared/slug-input";
import { EntitySelector } from "@/components/admin/shared/entity-selector";
import { CampaignWizardState } from "./wizard-container";

export interface Step1Props {
  state: CampaignWizardState;
  onChange: (updates: Partial<CampaignWizardState>) => void;
}

export function Step1Basics({ state, onChange }: Step1Props) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="campaign-name">
              Campaign Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="campaign-name"
              value={state.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g., VITEEE 2026 Landing Page"
            />
            <p className="text-xs text-muted-foreground">
              Internal name, not visible to public
            </p>
            {state.name && state.name.length < 3 && (
              <p className="text-xs text-destructive">
                Name must be at least 3 characters
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaign-description">Description</Label>
            <Textarea
              id="campaign-description"
              value={state.description}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={3}
              placeholder="Internal notes about this campaign..."
            />
            <p className="text-xs text-muted-foreground">
              Optional notes for your team
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>URL Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prefix">
              URL Prefix <span className="text-destructive">*</span>
            </Label>
            <Select
              value={state.prefix}
              onValueChange={(value) => onChange({ prefix: value })}
            >
              <SelectTrigger id="prefix">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ad">ad (Advertisements)</SelectItem>
                <SelectItem value="lp">lp (Landing Pages)</SelectItem>
                <SelectItem value="cmp">cmp (Campaigns)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Prefix helps organize your campaigns
            </p>
          </div>

          <SlugInput
            value={state.slug}
            onChange={(value) => onChange({ slug: value })}
            prefix={state.prefix}
            entityType="campaign"
          />

          {state.slug && state.prefix && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Full URL Preview:</p>
              <p className="text-sm text-muted-foreground font-mono mt-1">
                https://example.com/{state.prefix}/{state.slug}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Entity Association (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <EntitySelector
            value={state.entity}
            onChange={(entity) => onChange({ entity })}
          />
          <p className="text-xs text-muted-foreground mt-3">
            Link this campaign to an exam, college, or scholarship for better
            SEO and tracking integration
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
