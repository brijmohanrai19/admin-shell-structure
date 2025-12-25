import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import ExamsList from "@/pages/admin/ExamsList";
import NewExam from "@/pages/admin/NewExam";
import CollegesList from "@/pages/admin/CollegesList";
import ScholarshipsList from "@/pages/admin/ScholarshipsList";
import CampaignsList from "@/pages/admin/CampaignsList";
import NewCampaign from "@/pages/admin/NewCampaign";
import TemplatesList from "@/pages/admin/TemplatesList";
import FormSchemasList from "@/pages/admin/FormSchemasList";
import TrackersList from "@/pages/admin/TrackersList";
import SeoList from "@/pages/admin/SeoList";
import Analytics from "@/pages/admin/Analytics";
import SlugRegistry from "@/pages/admin/SlugRegistry";
import RedirectsList from "@/pages/admin/RedirectsList";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to admin dashboard */}
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            
            {/* Entities */}
            <Route path="exams" element={<ExamsList />} />
            <Route path="exams/new" element={<NewExam />} />
            <Route path="colleges" element={<CollegesList />} />
            <Route path="scholarships" element={<ScholarshipsList />} />
            <Route path="campaigns" element={<CampaignsList />} />
            <Route path="campaigns/new" element={<NewCampaign />} />
            
            {/* System */}
            <Route path="templates" element={<TemplatesList />} />
            <Route path="form-schemas" element={<FormSchemasList />} />
            <Route path="trackers" element={<TrackersList />} />
            <Route path="seo" element={<SeoList />} />
            
            {/* Data */}
            <Route path="analytics" element={<Analytics />} />
            <Route path="slug-registry" element={<SlugRegistry />} />
            <Route path="redirects" element={<RedirectsList />} />
          </Route>
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
