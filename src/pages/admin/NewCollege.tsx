import { useNavigate } from "react-router-dom";
import { CollegeForm } from "@/components/admin/colleges/college-form";

export default function NewCollege() {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    console.log("Creating college:", data);
    // TODO: POST /admin/colleges
    alert("College created (mock)");
    navigate("/admin/colleges");
  };

  const handleCancel = () => {
    navigate("/admin/colleges");
  };

  return (
    <div className="container mx-auto py-6">
      <CollegeForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
