import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SEOEditor } from "@/components/admin/seo/seo-editor";
import { CrawlPolicyEditor } from "@/components/admin/shared/crawl-policy-editor";
import { ChevronDown, ChevronUp, AlertTriangle, Info } from "lucide-react";
import { CampaignWizardState } from "./wizard-container";

export interface Step4Props {
  state: CampaignWizardState;
  onChange: (updates: Partial<CampaignWizardState>) => void;
}

const mockFormSchemas = [
  { id: "1", name: "Engineering Admission Form", version: 2, field_count: 8 },
  { id: "2", name: "Scholarship Application Form", version: 1, field_count: 12 },
  { id: "3", name: "General Inquiry Form", version: 3, field_count: 5 },
];

export function Step4SEO({ state, onChange }: Step4Props) {
  const [isSeoOpen, setIsSeoOpen] = useState(state.seo_override);
  const [isCrawlPolicyOpen, setIsCrawlPolicyOpen] = useState(
    state.crawl_policy_override
  );

  const handleSeoOverrideChange = (checked: boolean) => {
    onChange({
      seo_override: checked,
      seo: checked
        ? {
            title: "",
            description: "",
            keywords: [],
            og_image_url: null,
            og_title: null,
            og_description: null,
            twitter_card_type: null,
            twitter_image_url: null,
          }
        : null,
    });
    setIsSeoOpen(checked);
  };

  const handleCrawlPolicyOverrideChange = (checked: boolean) => {
    onChange({
      crawl_policy_override: checked,
      crawl_policy: checked
        ? {
            indexable: false,
            follow_links: false,
            canonical_url: null,
            sitemap_include: false,
            sitemap_priority: 0.3,
            sitemap_changefreq: "never",
          }
        : null,
    });
    setIsCrawlPolicyOpen(checked);
  };

  const handleFormSchemaOverrideChange = (checked: boolean) => {
    onChange({
      form_schema_override: checked,
      form_schema_id: checked ? null : null,
    });
  };

  return (
    <div className="space-y-6">
      {/* SEO Override Section */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="seo-override"
              checked={state.seo_override}
              onCheckedChange={handleSeoOverrideChange}
            />
            <Label htmlFor="seo-override" className="cursor-pointer">
              Override SEO settings
            </Label>
          </div>

          {!state.seo_override ? (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Will use entity SEO (if associated) or system default
              </p>
            </div>
          ) : (
            <Collapsible open={isSeoOpen} onOpenChange={setIsSeoOpen}>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-primary w-full">
                {isSeoOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                {isSeoOpen ? "Hide" : "Show"} SEO Editor
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                {state.seo && (
                  <SEOEditor
                    value={state.seo}
                    onChange={(seo) => onChange({ seo })}
                    entityName={state.name}
                  />
                )}
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardContent>
      </Card>

      {/* Crawl Policy Override Section */}
      <Card>
        <CardHeader>
          <CardTitle>Crawl Policy Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="crawl-policy-override"
              checked={state.crawl_policy_override}
              onCheckedChange={handleCrawlPolicyOverrideChange}
            />
            <Label htmlFor="crawl-policy-override" className="cursor-pointer">
              Override crawl policy
            </Label>
          </div>

          {!state.crawl_policy_override ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Recommended for ads:</strong> noindex, nofollow
                (prevents search engine indexing)
              </AlertDescription>
            </Alert>
          ) : (
            <Collapsible
              open={isCrawlPolicyOpen}
              onOpenChange={setIsCrawlPolicyOpen}
            >
              <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-primary w-full">
                {isCrawlPolicyOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                {isCrawlPolicyOpen ? "Hide" : "Show"} Crawl Policy Editor
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                {state.crawl_policy && (
                  <CrawlPolicyEditor
                    value={state.crawl_policy}
                    onChange={(crawl_policy) => onChange({ crawl_policy })}
                    recommended={{ indexable: false, follow_links: false }}
                  />
                )}
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardContent>
      </Card>

      {/* Form Schema Override Section */}
      <Card>
        <CardHeader>
          <CardTitle>Form Schema Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="form-schema-override"
              checked={state.form_schema_override}
              onCheckedChange={handleFormSchemaOverrideChange}
            />
            <Label htmlFor="form-schema-override" className="cursor-pointer">
              Override form schema
            </Label>
          </div>

          {!state.form_schema_override ? (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">Resolution Chain:</p>
              <p className="text-sm text-muted-foreground">
                Campaign → {state.entity.type ? `${state.entity.type} Entity` : "College"} → System Default
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="form-schema-select">Select Form Schema</Label>
              <Select
                value={state.form_schema_id || ""}
                onValueChange={(value) =>
                  onChange({ form_schema_id: value || null })
                }
              >
                <SelectTrigger id="form-schema-select">
                  <SelectValue placeholder="Select a form schema..." />
                </SelectTrigger>
                <SelectContent>
                  {mockFormSchemas.map((schema) => (
                    <SelectItem key={schema.id} value={schema.id}>
                      {schema.name} (v{schema.version}) - {schema.field_count}{" "}
                      fields
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {state.form_schema_id && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Form schema version will be LOCKED after launch
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
