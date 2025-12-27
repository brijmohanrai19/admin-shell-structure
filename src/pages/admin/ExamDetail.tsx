import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ExamForm } from "@/components/admin/exams/exam-form";
import { examsAPI, Exam } from "@/services/api/exams";

export default function ExamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadExam(id);
    }
  }, [id]);

  const loadExam = async (examId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await examsAPI.get(examId);
      setExam(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load exam");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    if (!id) return;

    try {
      setSaving(true);
      setError(null);
      await examsAPI.update(id, data);
      toast.success("Exam updated successfully!");
      navigate("/admin/exams");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update exam";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/exams");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
          Exam not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <ExamForm
        initialData={exam}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        disabled={saving}
      />
    </div>
  );
}
