
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { User, DollarSign } from "lucide-react";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import Demo from "./pages/Demo";
import Calculator from "./pages/Calculator";
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
import CommunityGate from "./pages/CommunityGate";
import FullLeaderboard from "./pages/FullLeaderboard";
import PMS from "./pages/PMS";
import CalculatorTest from "./pages/CalculatorTest";
import CalculatorTestGate from "./pages/CalculatorTestGate";
import StudentLog from "./pages/StudentLog";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<Index />} />
    <Route path="/demo" element={<Demo />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/markets" element={<MarketAnalysis />} />
    <Route path="/calculator" element={<Calculator />} />
    <Route path="/calculator-test" element={<CalculatorTest />} />
    <Route path="/calculator-test-gate" element={<CalculatorTestGate />} />
    <Route path="/calc" element={<Calc />} />
    <Route path="/properties" element={<AcquisitionsAgent />} />
    <Route path="/community" element={<CommunityGate />} />
    <Route path="/leaderboard" element={<FullLeaderboard />} />
    <Route path="/pms" element={<PMS />} />
    <Route path="/student_log" element={<StudentLog />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms-of-service" element={<TermsOfService />} />
    <Route path="/animation-draft" element={<AnimationDraft />} />
    <Route path="/test" element={<Test />} />
    <Route path="/test3" element={<Test3 />} />
    <Route path="/test4" element={<Test4 />} />
    <Route path="/test5" element={<Test5 />} />
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
