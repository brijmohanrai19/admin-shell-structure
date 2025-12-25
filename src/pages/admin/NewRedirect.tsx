/**
 * TODO: New Redirect Page
 *
 * Responsibilities:
 * - Create new URL redirect rule
 * - Configure source path and destination path
 * - Set redirect type (301 permanent, 302 temporary)
 * - Validate source path availability
 * - Link to retired slugs if applicable
 *
 * API:
 * - POST /admin/redirects (create redirect)
 * - POST /admin/slug-registry/check (validate source path)
 *
 * Components:
 * - PageHeader
 * - RedirectForm (redirect configuration)
 * - SlugInput (source path with validation)
 * - RedirectTypeSelector (301/302)
 */

export default function NewRedirect() {
  return (
    <div>
      <h1>Create New Redirect</h1>
      <p>TODO: Implement redirect creation form</p>
    </div>
  );
}
