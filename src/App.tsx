import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";

// Auth Pages
import Login from "@/pages/Login";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import ExamsList from "@/pages/admin/ExamsList";
import NewExam from "@/pages/admin/NewExam";
import ExamDetail from "@/pages/admin/ExamDetail";
import CollegesList from "@/pages/admin/CollegesList";
import NewCollege from "@/pages/admin/NewCollege";
import CollegeDetail from "@/pages/admin/CollegeDetail";
import ScholarshipsList from "@/pages/admin/ScholarshipsList";
import NewScholarship from "@/pages/admin/NewScholarship";
import ScholarshipDetail from "@/pages/admin/ScholarshipDetail";
import CampaignsList from "@/pages/admin/CampaignsList";
import NewCampaign from "@/pages/admin/NewCampaign";
import CampaignDetail from "@/pages/admin/CampaignDetail";
import TemplatesList from "@/pages/admin/TemplatesList";
import NewTemplate from "@/pages/admin/NewTemplate";
import TemplateDetail from "@/pages/admin/TemplateDetail";
import EditTemplate from "@/pages/admin/EditTemplate";
import FormSchemasList from "@/pages/admin/FormSchemasList";
import NewFormSchema from "@/pages/admin/NewFormSchema";
import FormSchemaDetail from "@/pages/admin/FormSchemaDetail";
import EditFormSchema from "@/pages/admin/EditFormSchema";
import TrackersList from "@/pages/admin/TrackersList";
import NewTracker from "@/pages/admin/NewTracker";
import TrackerDetail from "@/pages/admin/TrackerDetail";
import EditTracker from "@/pages/admin/EditTracker";
import TrackerRules from "@/pages/admin/TrackerRules";
import SeoList from "@/pages/admin/SeoList";
import Analytics from "@/pages/admin/Analytics";
import CampaignAnalytics from "@/pages/admin/CampaignAnalytics";
import ExamAnalytics from "@/pages/admin/ExamAnalytics";
import SlugRegistry from "@/pages/admin/SlugRegistry";
import RedirectsList from "@/pages/admin/RedirectsList";
import NewRedirect from "@/pages/admin/NewRedirect";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Redirect root to admin dashboard */}
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />

              {/* Entities */}
              <Route path="exams" element={<ExamsList />} />
              <Route path="exams/new" element={<NewExam />} />
              <Route path="exams/:id" element={<ExamDetail />} />

              <Route path="colleges" element={<CollegesList />} />
              <Route path="colleges/new" element={<NewCollege />} />
              <Route path="colleges/:id" element={<CollegeDetail />} />

              <Route path="scholarships" element={<ScholarshipsList />} />
              <Route path="scholarships/new" element={<NewScholarship />} />
              <Route path="scholarships/:id" element={<ScholarshipDetail />} />

              <Route path="campaigns" element={<CampaignsList />} />
              <Route path="campaigns/new" element={<NewCampaign />} />
              <Route path="campaigns/:id" element={<CampaignDetail />} />

              {/* System */}
              <Route path="templates" element={<TemplatesList />} />
              <Route path="templates/new" element={<NewTemplate />} />
              <Route path="templates/:id" element={<TemplateDetail />} />
              <Route path="templates/:id/edit" element={<EditTemplate />} />

              <Route path="form-schemas" element={<FormSchemasList />} />
              <Route path="form-schemas/new" element={<NewFormSchema />} />
              <Route path="form-schemas/:id" element={<FormSchemaDetail />} />
              <Route path="form-schemas/:id/edit" element={<EditFormSchema />} />

              <Route path="trackers" element={<TrackersList />} />
              <Route path="trackers/new" element={<NewTracker />} />
              <Route path="trackers/:id" element={<TrackerDetail />} />
              <Route path="trackers/:id/edit" element={<EditTracker />} />
              <Route path="trackers/rules" element={<TrackerRules />} />

              <Route path="seo" element={<SeoList />} />

              {/* Analytics */}
              <Route path="analytics" element={<Analytics />} />
              <Route path="analytics/campaigns/:id" element={<CampaignAnalytics />} />
              <Route path="analytics/exams/:id" element={<ExamAnalytics />} />

              {/* Utilities */}
              <Route path="slug-registry" element={<SlugRegistry />} />
              <Route path="redirects" element={<RedirectsList />} />
              <Route path="redirects/new" element={<NewRedirect />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
