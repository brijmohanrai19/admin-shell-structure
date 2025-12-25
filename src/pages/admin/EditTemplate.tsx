/**
 * TODO: Edit Template Page
 *
 * Responsibilities:
 * - Load existing template by ID
 * - Edit template structure and sections
 * - Modify component definitions
 * - Create new version if template is published
 * - Show locked status if template is in use by campaigns
 *
 * API:
 * - GET /admin/templates/:id (fetch template)
 * - PATCH /admin/templates/:id (update draft)
 * - POST /admin/templates (create new version)
 *
 * Components:
 * - PageHeader
 * - TemplateEditor
 * - ComponentDefinitionEditor
 * - VersionIndicator (show current version)
 */

export default function EditTemplate() {
  return (
    <div>
      <h1>Edit Template</h1>
      <p>TODO: Implement template editing form</p>
    </div>
  );
}
