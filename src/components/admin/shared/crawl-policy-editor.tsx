import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CrawlPolicy {
  indexable: boolean;
  follow_links: boolean;
  canonical_url: string | null;
  sitemap_include: boolean;
  sitemap_priority: number; // 0.0 - 1.0
  sitemap_changefreq:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
}

export interface CrawlPolicyEditorProps {
  value: CrawlPolicy;
  onChange: (value: CrawlPolicy) => void;
  recommended?: Partial<CrawlPolicy>;
}

export function CrawlPolicyEditor({
  value,
  onChange,
  recommended,
}: CrawlPolicyEditorProps) {
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);

  // Check if current value differs from recommendation
  const hasRecommendation =
    recommended &&
    (recommended.indexable !== undefined || recommended.follow_links !== undefined);

  const isDifferentFromRecommended = () => {
    if (!recommended) return false;
    return (
      (recommended.indexable !== undefined &&
        value.indexable !== recommended.indexable) ||
      (recommended.follow_links !== undefined &&
        value.follow_links !== recommended.follow_links)
    );
  };

  return (
    <div className="space-y-6">
      {/* Recommended Settings Banner */}
      {hasRecommendation && isDifferentFromRecommended() && (
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="flex-1 text-sm">
            <span className="font-medium text-blue-900">Recommended settings:</span>
            <span className="text-blue-700 ml-1">
              {recommended.indexable === false && "noindex"}
              {recommended.indexable === false &&
                recommended.follow_links === false &&
                ", "}
              {recommended.follow_links === false && "nofollow"}
            </span>
          </div>
        </div>
      )}

      {/* Basic Crawl Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="indexable">Allow Search Engine Indexing</Label>
            <p className="text-xs text-muted-foreground">
              Allow search engines to index this page in search results
            </p>
          </div>
          <Switch
            id="indexable"
            checked={value.indexable}
            onCheckedChange={(checked) =>
              onChange({ ...value, indexable: checked })
            }
          />
        </div>

        {!value.indexable && (
          <div className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>
              This page will not appear in search engine results (noindex)
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="follow-links">Follow Links</Label>
            <p className="text-xs text-muted-foreground">
              Allow search engines to follow links on this page
            </p>
          </div>
          <Switch
            id="follow-links"
            checked={value.follow_links}
            onCheckedChange={(checked) =>
              onChange({ ...value, follow_links: checked })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="canonical-url">Canonical URL (Optional)</Label>
          <Input
            id="canonical-url"
            type="url"
            value={value.canonical_url || ""}
            onChange={(e) =>
              onChange({
                ...value,
                canonical_url: e.target.value || null,
              })
            }
            placeholder="https://example.com/canonical-page"
          />
          <p className="text-xs text-muted-foreground">
            Specify the preferred URL if this content exists at multiple URLs
          </p>
        </div>
      </div>

      {/* Sitemap Settings */}
      <Collapsible open={isSitemapOpen} onOpenChange={setIsSitemapOpen}>
        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-primary">
          {isSitemapOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          Sitemap Configuration
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-4 space-y-4">
          <div className="space-y-4 border-l-2 border-muted pl-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sitemap-include">Include in Sitemap</Label>
                <p className="text-xs text-muted-foreground">
                  Add this page to the XML sitemap
                </p>
              </div>
              <Switch
                id="sitemap-include"
                checked={value.sitemap_include}
                onCheckedChange={(checked) =>
                  onChange({ ...value, sitemap_include: checked })
                }
              />
            </div>

            {value.sitemap_include && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sitemap-priority">
                      Sitemap Priority: {value.sitemap_priority.toFixed(1)}
                    </Label>
                    <Badge variant="secondary" className="text-xs">
                      {value.sitemap_priority === 1.0
                        ? "Highest"
                        : value.sitemap_priority >= 0.7
                        ? "High"
                        : value.sitemap_priority >= 0.4
                        ? "Medium"
                        : "Low"}
                    </Badge>
                  </div>
                  <Slider
                    id="sitemap-priority"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[value.sitemap_priority]}
                    onValueChange={(values) =>
                      onChange({ ...value, sitemap_priority: values[0] })
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Priority relative to other pages on your site (0.0 - 1.0)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sitemap-changefreq">Change Frequency</Label>
                  <Select
                    value={value.sitemap_changefreq}
                    onValueChange={(val) =>
                      onChange({
                        ...value,
                        sitemap_changefreq: val as CrawlPolicy["sitemap_changefreq"],
                      })
                    }
                  >
                    <SelectTrigger id="sitemap-changefreq">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="always">Always</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    How frequently this page is likely to change
                  </p>
                </div>
              </>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Summary */}
      <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-1">
        <div className="font-medium">Robots Meta Tag:</div>
        <code className="text-xs">
          {value.indexable ? "index" : "noindex"},{" "}
          {value.follow_links ? "follow" : "nofollow"}
        </code>
      </div>
    </div>
  );
}
