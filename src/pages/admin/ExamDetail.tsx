import { useNavigate, useParams } from "react-router-dom";
import { ExamForm } from "@/components/admin/exams/exam-form";

export default function ExamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock initial data (TODO: fetch from API)
  const mockExam = {
    name: "VITEEE 2026",
    slug: "viteee-2026",
    conducting_body: "VIT University",
    exam_date: "2026-04-15",
    application_start_date: "2025-11-01",
    application_end_date: "2026-02-28",
    description: "VIT Engineering Entrance Examination for admission to VIT campuses.",
    eligibility: "Candidates must have passed 10+2 with Physics, Chemistry, and Mathematics.",
    exam_pattern: "Multiple choice questions with negative marking.",
    important_links: {
      "Official Website": "https://vit.ac.in",
      "Syllabus": "https://vit.ac.in/syllabus",
    },
    priority: 10,
    status: "live" as const,
  };

  const handleSubmit = (data: any) => {
    console.log("Updating exam:", id, data);
    // TODO: PATCH /admin/exams/:id
    alert("Exam updated (mock)");
    navigate("/admin/exams");
  };

  const handleCancel = () => {
    navigate("/admin/exams");
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Edit Exam</h1>
      <ExamForm
        initialData={mockExam}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
