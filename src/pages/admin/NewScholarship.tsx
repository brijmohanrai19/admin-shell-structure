import { useNavigate } from "react-router-dom";
import { ScholarshipForm } from "@/components/admin/scholarships/scholarship-form";

export default function NewScholarship() {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    console.log("Creating scholarship:", data);
    // TODO: POST /admin/scholarships
    alert("Scholarship created (mock)");
    navigate("/admin/scholarships");
  };

  const handleCancel = () => {
    navigate("/admin/scholarships");
  };

  return (
    <div className="container mx-auto py-6">
      <ScholarshipForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
