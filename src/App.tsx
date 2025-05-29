
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionGate } from "@/components/SubscriptionGate";
import Index from "./pages/Index";
import Calculator from "./pages/Calculator";
import MarketAnalysis from "./pages/MarketAnalysis";
import ResetPassword from "./pages/ResetPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import AnimationDraft from "./pages/AnimationDraft";
import Test from "./pages/Test";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={
      <SubscriptionGate>
        <Index />
      </SubscriptionGate>
    } />
    <Route path="/calculator" element={
      <SubscriptionGate>
        <Calculator />
      </SubscriptionGate>
    } />
    <Route path="/market-analysis" element={
      <SubscriptionGate>
        <MarketAnalysis />
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
