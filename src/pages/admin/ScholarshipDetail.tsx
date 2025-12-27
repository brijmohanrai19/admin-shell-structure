import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ScholarshipForm } from "@/components/admin/scholarships/scholarship-form";
import { scholarshipsAPI, Scholarship } from "@/services/api/scholarships";

export default function ScholarshipDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadScholarship(id);
    }
  }, [id]);

  const loadScholarship = async (scholarshipId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await scholarshipsAPI.get(scholarshipId);
      setScholarship(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load scholarship");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    if (!id) return;

    try {
      setSaving(true);
      setError(null);
      await scholarshipsAPI.update(id, data);
      toast.success("Scholarship updated successfully!");
      navigate("/admin/scholarships");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update scholarship";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/scholarships");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading scholarship...</p>
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

  if (!scholarship) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
          Scholarship not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <ScholarshipForm
        initialData={scholarship}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        disabled={saving}
      />
    </div>
  );
}
