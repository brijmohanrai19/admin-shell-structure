/**
 * TODO: New Scholarship Page
 *
 * Responsibilities:
 * - Create new scholarship entity
 * - Configure scholarship details (name, amount, eligibility, etc.)
 * - Set scholarship slug (with availability check)
 * - Configure default SEO for scholarship
 * - Set default form schema for scholarship
 * - Assign trackers to scholarship
 * - Save as draft or publish scholarship
 *
 * API:
 * - POST /admin/scholarships (create scholarship)
 * - POST /admin/slug-registry/check (validate slug)
 * - POST /admin/scholarships/:id/publish (publish scholarship)
 *
 * Components:
 * - PageHeader
 * - ScholarshipForm (scholarship details form)
 * - SlugInput (with availability check)
 * - SEOEditor
 * - EligibilityEditor (manage eligibility criteria)
 */

export default function NewScholarship() {
  return (
    <div>
      <h1>Create New Scholarship</h1>
      <p>TODO: Implement scholarship creation form</p>
    </div>
  );
}
