import { useNavigate, useParams } from "react-router-dom";
import { CollegeForm } from "@/components/admin/colleges/college-form";

export default function CollegeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock initial data (TODO: fetch from API)
  const mockCollege = {
    name: "VIT Vellore",
    slug: "vit-vellore",
    city: "Vellore",
    state: "Tamil Nadu",
    country: "India",
    intake: 5000,
    courses: [
      {
        id: "1",
        level: "UG" as const,
        name: "B.Tech Computer Science",
        specialization: "AI & ML",
      },
      {
        id: "2",
        level: "PG" as const,
        name: "M.Tech Data Science",
        specialization: "",
      },
    ],
    fee_range: {
      min: 150000,
      max: 500000,
      currency: "INR" as const,
    },
    approvals: ["AICTE", "UGC", "NAAC"],
    description: "VIT is a leading private engineering college in India.",
    admission_process: "Admission is based on VITEEE exam scores.",
    form_schema_id: null,
    status: "live" as const,
  };

  const handleSubmit = (data: any) => {
    console.log("Updating college:", id, data);
    // TODO: PATCH /admin/colleges/:id
    alert("College updated (mock)");
    navigate("/admin/colleges");
  };

  const handleCancel = () => {
    navigate("/admin/colleges");
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Edit College</h1>
      <CollegeForm
        initialData={mockCollege}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
