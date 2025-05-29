
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionGate } from "@/components/SubscriptionGate";
import { AccessGate } from "@/components/AccessGate";
import { User, DollarSign } from "lucide-react";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import Calculator from "./pages/Calculator";
import MarketAnalysis from "./pages/MarketAnalysis";
import ResetPassword from "./pages/ResetPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import AnimationDraft from "./pages/AnimationDraft";
import Test from "./pages/Test";
import Pricing from "./pages/Pricing";
import AcquisitionsAgent from "./pages/AcquisitionsAgent";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/dashboard" element={
      <SubscriptionGate>
        <Index />
      </SubscriptionGate>
    } />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/markets" element={
      <SubscriptionGate>
        <AccessGate
          requiredAccess="essentials"
          moduleName="Market Analysis"
          moduleDescription="Access AI-powered market research and rental arbitrage insights."
          moduleIcon={<DollarSign className="h-8 w-8 text-cyan-400" />}
        >
          <MarketAnalysis />
        </AccessGate>
      </SubscriptionGate>
    } />
    <Route path="/calculator" element={
      <SubscriptionGate>
        <AccessGate
          requiredAccess="essentials"
          moduleName="Property Calculator"
          moduleDescription="Use our advanced calculator to analyze rental arbitrage deals."
          moduleIcon={<DollarSign className="h-8 w-8 text-blue-400" />}
        >
          <Calculator />
        </AccessGate>
      </SubscriptionGate>
    } />
    <Route path="/deals" element={
      <SubscriptionGate>
        <AccessGate
          requiredAccess="complete"
          moduleName="Acquisitions Agent"
          moduleDescription="AI-powered deal sourcing and landlord outreach automation."
          moduleIcon={<User className="h-8 w-8 text-purple-400" />}
        >
          <AcquisitionsAgent />
        </AccessGate>
      </SubscriptionGate>
    } />
    <Route path="/front-desk" element={
      <SubscriptionGate>
        <AccessGate
          requiredAccess="complete"
          moduleName="Front Desk"
          moduleDescription="Automated guest management and property operations."
          moduleIcon={<DollarSign className="h-8 w-8 text-green-400" />}
        >
          <Index />
        </AccessGate>
      </SubscriptionGate>
    } />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms-of-service" element={<TermsOfService />} />
    <Route path="/animation-draft" element={<AnimationDraft />} />
    <Route path="/test" element={<Test />} />
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
