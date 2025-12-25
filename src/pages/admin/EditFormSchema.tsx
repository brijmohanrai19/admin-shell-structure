/**
 * TODO: Edit Form Schema Page
 *
 * Responsibilities:
 * - Load existing form schema by ID
 * - Modify fields and configuration
 * - Create new version if schema is in use by campaigns
 * - Show locked status if schema is locked by campaigns
 * - Update validation rules
 *
 * API:
 * - GET /admin/form-schemas/:id (fetch schema)
 * - PATCH /admin/form-schemas/:id (update draft)
 * - POST /admin/form-schemas (create new version)
 *
 * Components:
 * - PageHeader
 * - FormSchemaEditor
 * - FormFieldEditor
 * - FieldTypeSelector
 * - FormPreview
 * - VersionIndicator
 */

export default function EditFormSchema() {
  return (
    <div>
      <h1>Edit Form Schema</h1>
      <p>TODO: Implement form schema editing</p>
    </div>
  );
}
