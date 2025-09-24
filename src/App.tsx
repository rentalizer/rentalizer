
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import DemoGate from "./pages/DemoGate";
import CalculatorGate from "./pages/CalculatorGate";
import Calc from "./pages/Calc";
import Login from "./pages/Login";
import MarketAnalysis from "./pages/MarketAnalysis";
import ResetPassword from "./pages/ResetPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Pricing from "./pages/Pricing";
import ListingsGate from "./pages/ListingsGate";
import AcquisitionsAgent from "./pages/AcquisitionsAgent";
import Community from "./pages/Community";
import CommunityGate from "./pages/CommunityGate";
import FullLeaderboard from "./pages/FullLeaderboard";
import PMS from "./pages/PMS";
import StudentLog from "./pages/StudentLog";
import AdminMembers from "./pages/AdminMembers";
import Members from "./pages/Members";
import ProfileSetup from "./pages/ProfileSetup";
import RichieAdmin from "./pages/RichieAdmin";
import GuideBook from "./pages/GuideBook";
import GuideBook2 from "./pages/GuideBook2";
import GuestGuide from "./pages/GuestGuide";
import { Auth } from "./pages/Auth";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<Index />} />
    <Route path="/demo" element={<DemoGate />} />
    <Route path="/listings" element={<ListingsGate />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/markets" element={<MarketAnalysis />} />
    <Route path="/calculator" element={<CalculatorGate />} />
    <Route path="/calc" element={<Calc />} />
    <Route path="/properties" element={<AcquisitionsAgent />} />
    <Route path="/community" element={<CommunityGate />} />
    <Route path="/leaderboard" element={<FullLeaderboard />} />
    <Route path="/pms" element={<PMS />} />
    <Route path="/student_log" element={<StudentLog />} />
    <Route path="/admin/members" element={<AdminMembers />} />
    <Route path="/admin/richie" element={<RichieAdmin />} />
    <Route path="/members" element={<Members />} />
    <Route path="/profile-setup" element={<ProfileSetup />} />
    {/* <Route path="/auth" element={<Auth />} /> */}
    <Route path="/signup" element={<Auth />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms-of-service" element={<TermsOfService />} />
    <Route path="/Guide-Book" element={<GuideBook />} />
    <Route path="/Guide-Book2" element={<GuideBook2 />} />
    <Route path="/guide/:slug" element={<GuestGuide />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
