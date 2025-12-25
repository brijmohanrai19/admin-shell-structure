/**
 * TODO: Crawl Policy Editor Component
 *
 * Responsibilities:
 * - Edit crawl policy settings
 * - Fields: indexable, follow_links, canonical_url, sitemap_include, sitemap_priority, sitemap_changefreq
 * - Default values: noindex/nofollow for ads, index/follow for organic
 * - Validation: sitemap_priority (0.0 - 1.0), sitemap_changefreq enum
 * - Show impact warnings (e.g., "noindex means page won't appear in search")
 *
 * Props:
 * - policy: CrawlPolicy
 * - onChange: (policy: CrawlPolicy) => void
 * - defaultType?: 'ad' | 'organic'
 */

export function CrawlPolicyEditor() {
  return (
    <div>
      <p>TODO: Crawl Policy Editor</p>
    </div>
  );
}
