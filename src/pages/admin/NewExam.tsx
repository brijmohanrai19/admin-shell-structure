import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ExamForm } from "@/components/admin/exams/exam-form";
import { examsAPI } from "@/services/api/exams";

export default function NewExam() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      await examsAPI.create(data);
      toast.success("Exam created successfully!");
      navigate("/admin/exams");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create exam";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/exams");
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}
      <ExamForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        disabled={loading}
      />
    </div>
  );
}
