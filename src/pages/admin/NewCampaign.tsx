/**
 * TODO: Campaign Builder - 5-Step Wizard
 *
 * Responsibilities:
 * - CRITICAL: 5-step wizard for creating landing page campaigns
 * - Step 1: Basics (name, prefix, slug, entity association)
 * - Step 2: Template Selection (with version locking warning)
 * - Step 3: Content Editor (template-driven, live preview)
 * - Step 4: SEO & Crawl (SEO override, crawl policy, form schema selector)
 * - Step 5: Tracking (inherited trackers, campaign overrides)
 * - Save Draft (any time)
 * - Launch (locks template + form versions - IMMUTABLE)
 *
 * API:
 * - POST /admin/slug-registry/check (real-time slug availability)
 * - GET /admin/templates (fetch available templates)
 * - GET /admin/form-schemas (fetch form schemas)
 * - GET /admin/trackers (fetch trackers)
 * - POST /admin/campaigns (save draft)
 * - POST /admin/campaigns/:id/launch (launch campaign)
 *
 * Components:
 * - WizardContainer (5-step navigation)
 * - Step1Basics (slug input with availability check)
 * - Step2Template (template gallery with version lock warning)
 * - Step3Content (template data editor + live preview)
 * - Step4SEO (SEO editor, crawl policy, form schema selector)
 * - Step5Tracking (inherited trackers, resolution preview)
 */

export default function NewCampaign() {
  return (
    <div>
      <h1>Create Landing Page Campaign</h1>
      <p>TODO: Implement 5-step campaign builder wizard</p>
      <p className="text-sm text-muted-foreground">
        Steps: Basics → Template → Content → SEO & Crawl → Tracking
      </p>
    </div>
  );
}
