/**
 * TODO: Slug Input Component (with Availability Check)
 *
 * Responsibilities:
 * - Input field for URL slug
 * - Real-time availability check (debounced 500ms)
 * - Visual indicators: loading, available (green checkmark), taken (red X), retired (yellow warning)
 * - Display conflict details if slug is taken
 * - Enforce slug format: lowercase, hyphens only, no spaces
 * - Show full URL preview
 *
 * API:
 * - POST /admin/slug-registry/check (validate slug availability)
 *
 * Props:
 * - value: string
 * - onChange: (value: string) => void
 * - prefix?: string (e.g., 'ad', 'lp')
 * - disabled?: boolean
 */

export function SlugInput() {
  return (
    <div>
      <p>TODO: Slug Input with Availability Check</p>
    </div>
  );
}
