import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SEO {
  title: string;
  description: string;
  keywords: string[];
  og_image_url: string | null;
  og_title: string | null;
  og_description: string | null;
  twitter_card_type: "summary" | "summary_large_image" | null;
  twitter_image_url: string | null;
}

export interface SEOEditorProps {
  value: SEO;
  onChange: (value: SEO) => void;
  entityName?: string;
}

export function SEOEditor({ value, onChange, entityName }: SEOEditorProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");

  // Character count helpers
  const titleLength = value.title.length;
  const descriptionLength = value.description.length;

  const getTitleColorClass = () => {
    if (titleLength > 60) return "text-red-600";
    if (titleLength > 48) return "text-yellow-600";
    return "text-muted-foreground";
  };

  const getDescriptionColorClass = () => {
    if (descriptionLength > 160) return "text-red-600";
    if (descriptionLength > 128) return "text-yellow-600";
    return "text-muted-foreground";
  };

  const handleKeywordInputBlur = () => {
    if (keywordInput.trim()) {
      const newKeywords = keywordInput
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k && !value.keywords.includes(k));

      if (newKeywords.length > 0) {
        onChange({
          ...value,
          keywords: [...value.keywords, ...newKeywords],
        });
      }
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    onChange({
      ...value,
      keywords: value.keywords.filter((k) => k !== keyword),
    });
  };

  return (
    <div className="space-y-6">
      {/* Basic SEO Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="seo-title">Meta Title</Label>
            <span className={cn("text-xs font-medium", getTitleColorClass())}>
              {titleLength}/60 chars
            </span>
          </div>
          <Input
            id="seo-title"
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            placeholder={entityName ? `${entityName} - Learn More` : "Page title for SEO"}
            maxLength={70}
          />
          {titleLength > 60 && (
            <p className="text-xs text-red-600">
              Warning: Titles over 60 characters may be truncated in search results
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="seo-description">Meta Description</Label>
            <span className={cn("text-xs font-medium", getDescriptionColorClass())}>
              {descriptionLength}/160 chars
            </span>
          </div>
          <Textarea
            id="seo-description"
            value={value.description}
            onChange={(e) => onChange({ ...value, description: e.target.value })}
            placeholder="Brief description of the page content (160 chars max)"
            rows={3}
            maxLength={200}
          />
          {descriptionLength > 160 && (
            <p className="text-xs text-red-600">
              Warning: Descriptions over 160 characters may be truncated
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="seo-keywords">Keywords</Label>
          <Input
            id="seo-keywords"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onBlur={handleKeywordInputBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleKeywordInputBlur();
              }
            }}
            placeholder="Enter keywords separated by commas"
          />
          {value.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {value.keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Card */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Search Engine Preview
          </h4>
          <div className="space-y-1">
            <div className="text-lg text-blue-600 hover:underline cursor-pointer">
              {value.title || "Page Title"}
            </div>
            <div className="text-sm text-green-700">
              https://example.com/path-to-page
            </div>
            <div className="text-sm text-gray-600">
              {value.description || "Page description will appear here..."}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Section */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-primary">
          {isAdvancedOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          Advanced Settings (Open Graph & Twitter)
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-4">
          <div className="space-y-4 border-l-2 border-muted pl-4">
            <h4 className="text-sm font-medium">Open Graph</h4>

            <div className="space-y-2">
              <Label htmlFor="og-image">OG Image URL</Label>
              <Input
                id="og-image"
                value={value.og_image_url || ""}
                onChange={(e) =>
                  onChange({ ...value, og_image_url: e.target.value || null })
                }
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="og-title">OG Title (Optional)</Label>
              <Input
                id="og-title"
                value={value.og_title || ""}
                onChange={(e) =>
                  onChange({ ...value, og_title: e.target.value || null })
                }
                placeholder="Leave blank to use Meta Title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="og-description">OG Description (Optional)</Label>
              <Textarea
                id="og-description"
                value={value.og_description || ""}
                onChange={(e) =>
                  onChange({ ...value, og_description: e.target.value || null })
                }
                placeholder="Leave blank to use Meta Description"
                rows={2}
              />
            </div>

            <h4 className="text-sm font-medium pt-4">Twitter Card</h4>

            <div className="space-y-2">
              <Label htmlFor="twitter-card-type">Twitter Card Type</Label>
              <Select
                value={value.twitter_card_type || "summary"}
                onValueChange={(val) =>
                  onChange({
                    ...value,
                    twitter_card_type: val as "summary" | "summary_large_image",
                  })
                }
              >
                <SelectTrigger id="twitter-card-type">
                  <SelectValue placeholder="Select card type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="summary_large_image">
                    Summary Large Image
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter-image">Twitter Image URL</Label>
              <Input
                id="twitter-image"
                value={value.twitter_image_url || ""}
                onChange={(e) =>
                  onChange({ ...value, twitter_image_url: e.target.value || null })
                }
                placeholder="https://example.com/twitter-image.jpg"
                type="url"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
