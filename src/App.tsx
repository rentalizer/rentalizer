
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import React, { lazy, Suspense } from "react";

// Lazy load all page components for better performance
const Index = lazy(() => import("./pages/Index"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const DemoGate = lazy(() => import("./pages/DemoGate"));
const CalculatorGate = lazy(() => import("./pages/CalculatorGate"));
const Calc = lazy(() => import("./pages/Calc"));
const MarketAnalysis = lazy(() => import("./pages/MarketAnalysis"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Pricing = lazy(() => import("./pages/Pricing"));
const ListingsGate = lazy(() => import("./pages/ListingsGate"));
const AcquisitionsAgent = lazy(() => import("./pages/AcquisitionsAgent"));
const Community = lazy(() => import("./pages/Community"));
const CommunityGate = lazy(() => import("./pages/CommunityGate"));
const FullLeaderboard = lazy(() => import("./pages/FullLeaderboard"));
const PMS = lazy(() => import("./pages/PMS"));
const StudentLog = lazy(() => import("./pages/StudentLog"));
const AdminMembers = lazy(() => import("./pages/AdminMembers"));
const Members = lazy(() => import("./pages/Members"));
const ProfileSetup = lazy(() => import("./pages/ProfileSetup"));
const RichieAdmin = lazy(() => import("./pages/RichieAdmin"));
const GuideBook = lazy(() => import("./pages/GuideBook"));
const GuideBook2 = lazy(() => import("./pages/GuideBook2"));
const GuestGuide = lazy(() => import("./pages/GuestGuide"));
const Auth = lazy(() => import("./pages/Auth"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Reduce unnecessary refetches
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
});

// Optimized loading component for Suspense fallback
const PageLoader = React.memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
      <div className="text-cyan-300 text-sm">Loading...</div>
    </div>
  </div>
));

const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/login" element={<Auth />} />
      <Route path="/auth/signup" element={<Auth />} />
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
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/Guide-Book" element={<GuideBook />} />
      <Route path="/Guide-Book2" element={<GuideBook2 />} />
      <Route path="/guide/:slug" element={<GuestGuide />} />
    </Routes>
  </Suspense>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <PerformanceMonitor />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
