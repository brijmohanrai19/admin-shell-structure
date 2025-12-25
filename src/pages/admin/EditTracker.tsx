/**
 * TODO: Edit Tracker Page
 *
 * Responsibilities:
 * - Load existing tracker by ID
 * - Edit tracker configuration and script code
 * - Update load position and scope
 * - Warning if tracker is in use by campaigns
 *
 * API:
 * - GET /admin/trackers/:id (fetch tracker)
 * - PATCH /admin/trackers/:id (update tracker)
 *
 * Components:
 * - PageHeader
 * - TrackerForm
 * - CodeEditor
 * - LoadPositionSelector
 * - UsageWarning (if tracker is active)
 */

export default function EditTracker() {
  return (
    <div>
      <h1>Edit Tracker</h1>
      <p>TODO: Implement tracker editing form</p>
    </div>
  );
}
