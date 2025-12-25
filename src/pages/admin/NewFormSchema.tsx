/**
 * TODO: New Form Schema Page
 *
 * Responsibilities:
 * - Create new form schema for lead capture
 * - Add/remove form fields with configuration
 * - Set field types, labels, validation rules
 * - Configure field order and required status
 * - Preview form layout
 *
 * API:
 * - POST /admin/form-schemas (create form schema)
 * - POST /admin/form-schemas/:id/set-default (set as system default)
 *
 * Components:
 * - PageHeader
 * - FormSchemaEditor (schema builder)
 * - FormFieldEditor (field configuration)
 * - FieldTypeSelector (text, email, phone, select, etc.)
 * - FormPreview (live preview of form)
 */

export default function NewFormSchema() {
  return (
    <div>
      <h1>Create New Form Schema</h1>
      <p>TODO: Implement form schema creation</p>
    </div>
  );
}
