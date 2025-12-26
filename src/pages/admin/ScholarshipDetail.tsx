import { useNavigate, useParams } from "react-router-dom";
import { ScholarshipForm } from "@/components/admin/scholarships/scholarship-form";

export default function ScholarshipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock initial data (TODO: fetch from API)
  const mockScholarship = {
    name: "National Merit Scholarship 2026",
    slug: "national-merit-scholarship-2026",
    provider_name: "Govt of India",
    provider_type: "Government" as const,
    amount_min: 10000,
    amount_max: 50000,
    currency: "INR" as const,
    eligibility_criteria:
      "Students must have secured at least 80% in class 12 and family income should be below 5 lakh per annum.",
    benefits:
      "Financial assistance for tuition fees and hostel accommodation.",
    application_process:
      "Apply online through the National Scholarship Portal before the deadline.",
    application_deadline: "2026-03-31",
    status: "live" as const,
  };

  const handleSubmit = (data: any) => {
    console.log("Updating scholarship:", id, data);
    // TODO: PATCH /admin/scholarships/:id
    alert("Scholarship updated (mock)");
    navigate("/admin/scholarships");
  };

  const handleCancel = () => {
    navigate("/admin/scholarships");
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Edit Scholarship</h1>
      <ScholarshipForm
        initialData={mockScholarship}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
