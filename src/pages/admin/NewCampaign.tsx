import { useNavigate } from "react-router-dom";
import { WizardContainer } from "@/components/admin/campaigns/campaign-builder/wizard-container";

export default function NewCampaign() {
  const navigate = useNavigate();

  const handleSubmit = (data: any, action: "draft" | "launch") => {
    console.log(`Campaign ${action}:`, data);
    // TODO: POST /admin/campaigns
    if (action === "launch") {
      alert("Campaign launched successfully! (mock)");
    } else {
      alert("Campaign saved as draft! (mock)");
    }
    navigate("/admin/campaigns");
  };

  const handleCancel = () => {
    if (confirm("Discard changes and exit?")) {
      navigate("/admin/campaigns");
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <WizardContainer onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
