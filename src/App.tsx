
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { User, DollarSign } from "lucide-react";
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
import AnimationDraft from "./pages/AnimationDraft";
import Test from "./pages/Test";
import Test3 from "./pages/Test3";
import Test4 from "./pages/Test4";
import Test5 from "./pages/Test5";
import Pricing from "./pages/Pricing";
import AcquisitionsAgent from "./pages/AcquisitionsAgent";
import Community from "./pages/Community";
import TestCommunity from "./pages/TestCommunity";
import CommunityGate from "./pages/CommunityGate";
import FullLeaderboard from "./pages/FullLeaderboard";
import PMS from "./pages/PMS";
import CalculatorTest from "./pages/CalculatorTest";
import CalculatorTestGate from "./pages/CalculatorTestGate";
import StudentLog from "./pages/StudentLog";
import TestHome from "./pages/TestHome";
import AdminMembers from "./pages/AdminMembers";
import Members from "./pages/Members";
import ProfileSetup from "./pages/ProfileSetup";
import RichieAdmin from "./pages/RichieAdmin";
import LogoDownload from "./pages/LogoDownload";
import TestLogo from "./pages/TestLogo";
import { Auth } from "./pages/Auth";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/test-home" element={<TestHome />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<Index />} />
    <Route path="/demo" element={<DemoGate />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/markets" element={<MarketAnalysis />} />
    <Route path="/calculator" element={<CalculatorGate />} />
    <Route path="/calculator-test" element={<CalculatorTest />} />
    <Route path="/calculator-test-gate" element={<CalculatorTestGate />} />
    <Route path="/calc" element={<Calc />} />
    <Route path="/properties" element={<AcquisitionsAgent />} />
    <Route path="/community" element={<CommunityGate />} />
    <Route path="/test-community" element={<TestCommunity />} />
    <Route path="/leaderboard" element={<FullLeaderboard />} />
    <Route path="/pms" element={<PMS />} />
    <Route path="/student_log" element={<StudentLog />} />
    <Route path="/admin/members" element={<AdminMembers />} />
    <Route path="/admin/richie" element={<RichieAdmin />} />
    <Route path="/members" element={<Members />} />
    <Route path="/profile-setup" element={<ProfileSetup />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms-of-service" element={<TermsOfService />} />
    <Route path="/animation-draft" element={<AnimationDraft />} />
    <Route path="/test" element={<Test />} />
    <Route path="/test3" element={<Test3 />} />
    <Route path="/test4" element={<Test4 />} />
    <Route path="/test5" element={<Test5 />} />
    <Route path="/logo-download" element={<LogoDownload />} />
    <Route path="/test-logo" element={<TestLogo />} />
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
