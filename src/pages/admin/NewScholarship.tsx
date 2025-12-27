import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScholarshipForm } from "@/components/admin/scholarships/scholarship-form";
import { scholarshipsAPI } from "@/services/api/scholarships";

export default function NewScholarship() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      await scholarshipsAPI.create(data);
      alert("Scholarship created successfully!");
      navigate("/admin/scholarships");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create scholarship";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/scholarships");
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}
      <ScholarshipForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        disabled={loading}
      />
    </div>
  );
}
