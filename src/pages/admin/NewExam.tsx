import { useNavigate } from "react-router-dom";
import { ExamForm } from "@/components/admin/exams/exam-form";

export default function NewExam() {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    console.log("Creating exam:", data);
    // TODO: POST /admin/exams
    alert("Exam created (mock)");
    navigate("/admin/exams");
  };

  const handleCancel = () => {
    navigate("/admin/exams");
  };

  return (
    <div className="container mx-auto py-6">
      <ExamForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
