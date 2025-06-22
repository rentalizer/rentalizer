
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Calculator from "./pages/Calculator";
import MarketAnalysis from "./pages/MarketAnalysis";
import Community from "./pages/Community";
import PMS from "./pages/PMS";
import Demo from "./pages/Demo";
import Test from "./pages/Test";
import Test3 from "./pages/Test3";
import Test4 from "./pages/Test4";
import Test5 from "./pages/Test5";
import TestPMS from "./pages/TestPMS";
import Pricing from "./pages/Pricing";
import LandingPage from "./pages/LandingPage";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ResetPassword from "./pages/ResetPassword";
import AcquisitionsAgent from "./pages/AcquisitionsAgent";
import AnimationDraft from "./pages/AnimationDraft";
import AskRichie from "./pages/AskRichie";
import ContentManager from "./pages/ContentManager";
import ClientPortalLog from "./pages/ClientPortalLog";
import ClientPortalLogApp from "./pages/ClientPortalLogApp";
import CustomerInterface from "./pages/CustomerInterface";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/market-analysis" element={<MarketAnalysis />} />
            <Route path="/community" element={<Community />} />
            <Route path="/pms" element={<PMS />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/test" element={<Test />} />
            <Route path="/test3" element={<Test3 />} />
            <Route path="/test4" element={<Test4 />} />
            <Route path="/test5" element={<Test5 />} />
            <Route path="/test-pms" element={<TestPMS />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/acquisitions" element={<AcquisitionsAgent />} />
            <Route path="/animation-draft" element={<AnimationDraft />} />
            <Route path="/ask-richie" element={<AskRichie />} />
            <Route path="/content-manager" element={<ContentManager />} />
            <Route path="/client-portal-log" element={<ClientPortalLog />} />
            <Route path="/client-portal-log-app" element={<ClientPortalLogApp />} />
            <Route path="/customer" element={<CustomerInterface />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
