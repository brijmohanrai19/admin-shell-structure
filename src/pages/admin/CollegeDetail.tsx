import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { CollegeForm } from "@/components/admin/colleges/college-form";
import { collegesAPI, College } from "@/services/api/colleges";

export default function CollegeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCollege(id);
    }
  }, [id]);

  const loadCollege = async (collegeId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await collegesAPI.get(collegeId);
      setCollege(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load college");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    if (!id) return;

    try {
      setSaving(true);
      setError(null);
      await collegesAPI.update(id, data);
      toast.success("College updated successfully!");
      navigate("/admin/colleges");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update college";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/colleges");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading college...</p>
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

  if (!college) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
          College not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <CollegeForm
        initialData={college}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        disabled={saving}
      />
    </div>
  );
}
