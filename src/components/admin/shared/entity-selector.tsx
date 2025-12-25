/**
 * TODO: Entity Selector Component
 *
 * Responsibilities:
 * - Dropdown selector for entity association
 * - Support entity types: Exam, College, Scholarship
 * - Search/filter entities by name
 * - Display entity details in dropdown
 * - Optional field (can be unselected)
 * - Load entities from API
 *
 * API:
 * - GET /admin/exams (fetch exams)
 * - GET /admin/colleges (fetch colleges)
 * - GET /admin/scholarships (fetch scholarships)
 *
 * Props:
 * - entityType: 'exam' | 'college' | 'scholarship'
 * - value?: string (entity ID)
 * - onChange: (entityId: string | null) => void
 */

export function EntitySelector() {
  return (
    <div>
      <p>TODO: Entity Selector</p>
    </div>
  );
}
