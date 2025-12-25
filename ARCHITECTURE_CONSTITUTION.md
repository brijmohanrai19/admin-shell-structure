📋 CONSTITUTION FILE FOR CLAUDE CODE
Here's the complete context document to give Claude Code:

FILE: ARCHITECTURE_CONSTITUTION.md
markdown# ARCHITECTURE CONSTITUTION - Admin Shell Structure

**Project:** Self-Hosted Education & Campaign Platform - Admin UI
**Authority:** Final & Non-Negotiable
**Date:** December 25, 2025

---

## 0️⃣ CONTEXT

This repository is the **Admin UI shell** for managing:
- Landing Page Campaigns (LP ONLY - no email/SMS/WhatsApp)
- Exams, Colleges, Scholarships
- Templates, Form Schemas, Trackers, SEO

**Backend APIs are already defined and LOCKED.**

---

## 1️⃣ CAMPAIGN SCOPE (CRITICAL)

### **WHAT CAMPAIGNS ARE:**
- ✅ Landing Page campaigns ONLY
- ✅ Dynamic URL: `/{prefix}/{slug}` (e.g., `/ad/viteee-2026`)
- ✅ Template-driven rendering
- ✅ Form schema-driven lead capture
- ✅ Tracker-managed analytics

### **WHAT CAMPAIGNS ARE NOT:**
- ❌ Email campaigns
- ❌ SMS campaigns
- ❌ WhatsApp campaigns
- ❌ Push notifications
- ❌ Multi-channel campaigns

**Rule:** Any UI suggesting email/SMS/WhatsApp campaigns violates the architecture.

---

## 2️⃣ ADMIN SCREENS (REQUIRED)

### **2.1 Entity Management:**
1. **Dashboard** (`/`)
2. **Exams** (`/exams`, `/exams/new`, `/exams/[id]`)
3. **Colleges** (`/colleges`, `/colleges/new`, `/colleges/[id]`)
4. **Scholarships** (`/scholarships`, `/scholarships/new`, `/scholarships/[id]`)
5. **Campaigns** (`/campaigns`, `/campaigns/new`, `/campaigns/[id]`)
   - **CRITICAL:** `/campaigns/new` = 5-step wizard

### **2.2 System Management:**
6. **Templates** (`/templates`, `/templates/new`, `/templates/[id]`, `/templates/[id]/edit`)
7. **Form Schemas** (`/form-schemas`, `/form-schemas/new`, `/form-schemas/[id]`, `/form-schemas/[id]/edit`)
8. **Trackers** (`/trackers`, `/trackers/new`, `/trackers/[id]`, `/trackers/[id]/edit`, `/trackers/[id]/rules`)
9. **SEO** (`/seo`)

### **2.3 Utilities:**
10. **Slug Registry** (`/slug-registry`)
11. **Redirects** (`/redirects`, `/redirects/new`)

### **2.4 Analytics:**
12. **Analytics Dashboard** (`/analytics`)
13. **Campaign Analytics** (`/analytics/campaigns/[id]`)
14. **Exam ROI** (`/analytics/exams/[id]`)

---

## 3️⃣ CAMPAIGN BUILDER (5-STEP WIZARD)

**Route:** `/campaigns/new`

**Steps (Non-Negotiable):**

### **Step 1: Basics**
- Campaign name (internal)
- Description (internal notes)
- Prefix selector (ad, lp, cmp, etc.)
- Slug input (with real-time availability check)
- Entity association (Exam/College/Scholarship - optional)

### **Step 2: Template Selection**
- Template gallery
- Template preview
- **Version locking:** Template version locked at selection
- **Warning:** "Template version will be LOCKED after launch"

### **Step 3: Content**
- Template data editor (dynamic based on `component_definition`)
- Live preview pane
- Variable placeholders: `{exam_name}`, `{college_name}`, etc.

### **Step 4: SEO & Crawl**
- SEO override checkbox (default: use entity SEO)
- SEO editor (if override)
- Crawl policy editor (default: noindex for ads)
- Form schema selector (default: Campaign → College → System)

### **Step 5: Tracking**
- Inherited trackers display (read-only)
- Campaign tracker overrides
- Tracker resolution preview

**Actions:**
- Save Draft (any time)
- Launch (final step - LOCKS template and form versions)

---

## 4️⃣ TEMPLATE SYSTEM

### **Template Structure:**
```json
{
  "version": "1.0",
  "sections": [
    {
      "type": "hero",
      "config": {
        "fields": {
          "headline": { "type": "text", "default": "Apply Now for {exam_name}" }
        }
      }
    },
    {
      "type": "form",
      "config": {
        "form_schema_ref": "campaign.form_schema"
      }
    }
  ]
}
```

### **Version Locking:**
- Templates have incremental versions (v1, v2, v3)
- Campaign locks `template_id` + `template_version` on launch
- After launch, template version is **IMMUTABLE**
- Updating template creates new version
- Old campaigns continue using locked version

---

## 5️⃣ FORM SCHEMA SYSTEM

### **Schema Structure:**
- Form schemas have name + version
- Fields: `field_name`, `field_label`, `field_type`, `required`, `validation_regex`, etc.
- Field types: text, email, phone, select, checkbox, textarea, date, number

### **Resolution Chain:**
1. Campaign form schema (if override)
2. College form schema (if campaign → college)
3. System default form schema

### **Version Locking:**
- Campaign locks `form_schema_id` + `form_schema_version` on launch
- After launch, form version is **IMMUTABLE**
- Lead submissions store `form_schema_version` for historical accuracy

---

## 6️⃣ TRACKER SYSTEM

### **Tracker Resolution (Hierarchy):**
1. **Page-level** (highest priority)
2. **Campaign-level**
3. **Entity-level** (Exam/College/Scholarship)
4. **Global** (lowest priority)

**Deduplication:** Backend deduplicates by `tracker_id`

### **Tracker Injection:**
- Scripts are injected **server-side only**
- Public API returns tracker IDs only (NOT script code)
- Admin API returns full script code
- Load positions: `head`, `body_start`, `body_end`

---

## 7️⃣ SEO & CRAWL POLICY

### **SEO Resolution:**
1. Campaign SEO (if override)
2. Entity SEO (Exam/College/Scholarship)
3. System default SEO

### **Crawl Policy:**
- Fields: `indexable`, `follow_links`, `canonical_url`, `sitemap_include`, `sitemap_priority`, `sitemap_changefreq`
- Default for ads: `noindex, nofollow`
- Default for organic: `index, follow`

---

## 8️⃣ SLUG REGISTRY

### **Purpose:**
- Prevent URL conflicts
- Track slug lifecycle: `draft`, `active`, `retired`, `redirected`

### **Validation:**
- Before creating campaign/exam/college/scholarship:
  - Check slug availability via `POST /admin/slug-registry/check`
  - If `retired`, cannot reuse
  - If `active`, show conflict error

### **Lifecycle:**
- Draft → Active (on publish/launch)
- Active → Retired (on archive)
- Retired → **Permanent** (cannot reuse)

---

## 9️⃣ COMPONENT STRUCTURE
```
components/
├── admin/
│   ├── campaigns/
│   │   ├── campaign-builder/
│   │   │   ├── wizard-container.tsx
│   │   │   ├── step-1-basics.tsx
│   │   │   ├── step-2-template.tsx
│   │   │   ├── step-3-content.tsx
│   │   │   ├── step-4-seo.tsx
│   │   │   └── step-5-tracking.tsx
│   │   ├── campaign-table.tsx
│   │   └── campaign-status-badge.tsx
│   ├── templates/
│   │   ├── template-gallery.tsx
│   │   ├── template-card.tsx
│   │   ├── template-editor.tsx
│   │   └── component-definition-editor.tsx
│   ├── forms/
│   │   ├── form-schema-editor.tsx
│   │   ├── form-field-editor.tsx
│   │   ├── field-type-selector.tsx
│   │   └── form-preview.tsx
│   ├── trackers/
│   │   ├── tracker-form.tsx
│   │   ├── tracker-rule-editor.tsx
│   │   └── tracker-resolution-preview.tsx
│   ├── seo/
│   │   ├── seo-editor.tsx
│   │   └── seo-preview-card.tsx
│   ├── analytics/
│   │   ├── metrics-grid.tsx
│   │   ├── leads-chart.tsx
│   │   └── leads-table.tsx
│   ├── exams/
│   │   ├── exam-form.tsx
│   │   └── exam-table.tsx
│   ├── colleges/
│   │   ├── college-form.tsx
│   │   ├── college-table.tsx
│   │   └── courses-editor.tsx
│   ├── scholarships/
│   │   ├── scholarship-form.tsx
│   │   └── scholarship-table.tsx
│   └── shared/
│       ├── slug-input.tsx (with availability check)
│       ├── seo-editor.tsx
│       ├── crawl-policy-editor.tsx
│       ├── status-badge.tsx
│       └── entity-selector.tsx
```

---

## 🔟 BACKEND API ENDPOINTS (READ-ONLY REFERENCE)

### **Admin APIs:**
```
# Campaigns
GET    /admin/campaigns
POST   /admin/campaigns
PATCH  /admin/campaigns/:id
POST   /admin/campaigns/:id/launch
POST   /admin/campaigns/:id/pause
POST   /admin/campaigns/:id/resume
POST   /admin/campaigns/:id/archive

# Exams
GET    /admin/exams
POST   /admin/exams
PATCH  /admin/exams/:id
POST   /admin/exams/:id/publish

# Colleges (similar to exams)
# Scholarships (similar to exams)

# Templates
GET    /admin/templates
POST   /admin/templates
POST   /admin/templates/:id/publish

# Form Schemas
GET    /admin/form-schemas
POST   /admin/form-schemas
POST   /admin/form-schemas/:id/set-default

# Trackers
GET    /admin/trackers
POST   /admin/trackers
GET    /admin/tracker-rules
POST   /admin/tracker-rules
PATCH  /admin/tracker-rules/:id

# SEO
GET    /admin/seo
POST   /admin/seo
POST   /admin/seo/:id/set-default

# Slug Registry
POST   /admin/slug-registry/check
GET    /admin/slug-registry

# Redirects
GET    /admin/redirects
POST   /admin/redirects

# Analytics
GET    /admin/analytics/dashboard
GET    /admin/analytics/campaigns/:id
GET    /admin/analytics/exams/:id/roi
```

---

## 1️⃣1️⃣ ABSOLUTE FORBIDDENS

❌ **NEVER create or suggest:**
1. Email campaign UI
2. SMS campaign UI
3. WhatsApp campaign UI
4. Push notification UI
5. Campaign type selectors ("Email | SMS | LP")
6. Multi-channel campaign logic
7. Hardcoded tracker scripts in components
8. Hardcoded SEO fields
9. Hardcoded form fields
10. Client-side tracker injection
11. API calls in component files (use server actions/API routes)
12. Mock data in components

---

## 1️⃣2️⃣ NAVIGATION STRUCTURE
```
Dashboard (/)
├── Entities
│   ├── Exams (/exams)
│   ├── Colleges (/colleges)
│   ├── Scholarships (/scholarships)
│   └── Landing Page Campaigns (/campaigns)  ← CLARIFIED
├── System
│   ├── Templates (/templates)
│   ├── Form Schemas (/form-schemas)
│   ├── Trackers (/trackers)
│   └── SEO (/seo)
├── Utilities
│   ├── Slug Registry (/slug-registry)
│   └── Redirects (/redirects)
└── Analytics (/analytics)
```

---

## 1️⃣3️⃣ DATA FLOW RULES

### **Campaign Creation:**
```
Admin opens /campaigns/new
  ↓
Step 1: Select prefix, slug, entity
  ↓ (real-time validation)
POST /admin/slug-registry/check
  ↓
Step 2: Select template (version locked)
  ↓
Step 3: Fill content (template-driven)
  ↓
Step 4: Override SEO/crawl/form (optional)
  ↓
Step 5: Add tracker overrides (optional)
  ↓
POST /admin/campaigns (save draft)
  ↓
POST /admin/campaigns/:id/launch
  ↓ (locks template + form versions)
Campaign live at /{prefix}/{slug}
```

### **Template Versioning:**
```
Admin creates template v1
  ↓
POST /admin/templates (status: draft)
  ↓
POST /admin/templates/:id/publish
  ↓ (template becomes immutable)
Campaign A uses template v1 (locked)
  ↓
Admin edits template
  ↓ (creates new version v2)
Campaign B uses template v2 (locked)
  ↓
Campaign A still uses v1 (no breaking changes)
```

---

## 1️⃣4️⃣ VALIDATION RULES

### **Slug Validation:**
- Lowercase, hyphens only, no spaces
- Must be unique within full_path (`/{prefix}/{slug}`)
- Cannot reuse retired slugs

### **Template Launch:**
- Campaign status must be `draft`
- All required fields validated
- Template version locked (immutable)
- Form version locked (immutable)

### **SEO Fields:**
- Title: max 60 chars (warning)
- Description: max 160 chars (warning)
- Keywords: array of strings

### **Crawl Policy:**
- `sitemap_priority`: 0.0 - 1.0
- `sitemap_changefreq`: always, hourly, daily, weekly, monthly, yearly, never

---

## 1️⃣5️⃣ UI/UX PATTERNS

### **Status Badges:**
- `draft`: Gray/neutral
- `live`: Green
- `paused`: Yellow/orange
- `archived`: Red/muted
- `closed`: Blue/muted (exams only)

### **Locked Fields (After Launch):**
- Show lock icon 🔒
- Make field read-only
- Display tooltip: "Cannot change after launch"
- Show "Create New Version" button (for templates)

### **Real-Time Validation:**
- Slug availability: debounce 500ms
- Show loading indicator during check
- Green checkmark: available
- Red X: taken (show conflict)
- Yellow warning: retired (cannot use)

### **Confirmation Dialogs:**
- Launch campaign: "This will LOCK template and form versions. Continue?"
- Archive campaign: "This will retire the URL permanently. Continue?"
- Publish template: "This will make the template immutable. Create new version for changes."

---

## 1️⃣6️⃣ STYLING CONSTRAINTS

**DO:**
- Use existing UI library (shadcn/ui, etc.)
- Follow existing color scheme
- Maintain consistent spacing

**DO NOT:**
- Change global styles
- Add new CSS frameworks
- Modify design tokens
- Change typography without approval

---

## 1️⃣7️⃣ STATE MANAGEMENT

**Allowed:**
- React useState (component-local state)
- React useReducer (complex component state)
- Server actions for mutations
- URL state (query params, path params)

**NOT Allowed (Yet):**
- Global state management (Redux, Zustand, etc.)
- Client-side API calls (use server actions)
- Local storage for business data

---

## 1️⃣8️⃣ FILE NAMING CONVENTIONS

**Routes:**
- `page.tsx` - Route page component
- `layout.tsx` - Route layout
- `loading.tsx` - Loading UI
- `error.tsx` - Error boundary
- `not-found.tsx` - 404 handler

**Components:**
- `kebab-case.tsx` (e.g., `campaign-builder.tsx`)
- Prefix with entity: `exam-form.tsx`, `college-table.tsx`
- Suffix with type: `-form`, `-table`, `-card`, `-dialog`, `-editor`

**API Routes:**
- `route.ts` (Next.js convention)

---

## 1️⃣9️⃣ TODO COMMENT FORMAT

Every placeholder file must include:
```typescript
/**
 * TODO: [Component/Page Name]
 * 
 * Responsibilities:
 * - [List of responsibilities]
 * 
 * API: [API endpoints used]
 * 
 * Components: [Child components]
 */
```

---

## 2️⃣0️⃣ IMPLEMENTATION PHASES

### **Phase 1: Structure (CURRENT)**
- Create all route placeholders
- Create all component placeholders
- Update navigation
- Remove contract violations

### **Phase 2: Shared Components**
- SlugInput (with availability check)
- SEOEditor
- CrawlPolicyEditor
- StatusBadge
- EntitySelector

### **Phase 3: Entity Management**
- Exam CRUD
- College CRUD
- Scholarship CRUD
- Entity tables with filters

### **Phase 4: Campaign Builder (CRITICAL)**
- 5-step wizard
- Template selection
- Content editor
- SEO overrides
- Tracker overrides
- Launch flow

### **Phase 5: System Management**
- Template editor
- Form schema editor
- Tracker management
- SEO management

### **Phase 6: Analytics**
- Dashboard
- Campaign analytics
- Exam ROI

### **Phase 7: Utilities**
- Slug registry
- Redirects

---

## 2️⃣1️⃣ SUCCESS CRITERIA

This admin UI is correct ONLY if:

✅ Campaign builder has 5 steps (no more, no less)
✅ Template and form versions lock on campaign launch
✅ Slug validation prevents conflicts
✅ No email/SMS/WhatsApp campaign UI exists
✅ All routes map to defined APIs
✅ Navigation reflects Step 5 architecture
✅ Components are entity-grouped
✅ Status badges are consistent
✅ SEO editor warns on character limits
✅ Tracker resolution shows precedence

---

## 🔒 FINAL RULE

If any implementation choice conflicts with this constitution,
**the implementation is wrong** — not the constitution.

Architecture is LOCKED. Execution must follow.

---

**END OF CONSTITUTION**
