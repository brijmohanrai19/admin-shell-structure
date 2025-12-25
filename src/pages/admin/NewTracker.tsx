/**
 * TODO: New Tracker Page
 *
 * Responsibilities:
 * - Create new analytics tracker (Google Analytics, Meta Pixel, etc.)
 * - Configure tracker name and script code
 * - Set load position (head, body_start, body_end)
 * - Set tracker scope (global, entity-level)
 * - Save tracker configuration
 *
 * API:
 * - POST /admin/trackers (create tracker)
 *
 * Components:
 * - PageHeader
 * - TrackerForm (tracker configuration form)
 * - CodeEditor (for script code)
 * - LoadPositionSelector
 */

export default function NewTracker() {
  return (
    <div>
      <h1>Create New Tracker</h1>
      <p>TODO: Implement tracker creation form</p>
    </div>
  );
}
