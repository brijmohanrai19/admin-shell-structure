import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CollegeForm } from "@/components/admin/colleges/college-form";
import { collegesAPI } from "@/services/api/colleges";

export default function NewCollege() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      await collegesAPI.create(data);
      toast.success("College created successfully!");
      navigate("/admin/colleges");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create college";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/colleges");
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}
      <CollegeForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        disabled={loading}
      />
    </div>
  );
}
