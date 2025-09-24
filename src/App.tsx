
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import React, { lazy, Suspense } from "react";

// Lazy load all page components for better performance with error handling
const Index = lazy(() => import("./pages/Index").catch(() => ({ default: () => <div>Error loading page</div> })));
const LandingPage = lazy(() => import("./pages/LandingPage").catch(() => ({ default: () => <div>Error loading page</div> })));
const DemoGate = lazy(() => import("./pages/DemoGate").catch(() => ({ default: () => <div>Error loading page</div> })));
const CalculatorGate = lazy(() => import("./pages/CalculatorGate").catch(() => ({ default: () => <div>Error loading page</div> })));
const Calc = lazy(() => import("./pages/Calc").catch(() => ({ default: () => <div>Error loading page</div> })));
const MarketAnalysis = lazy(() => import("./pages/MarketAnalysis").catch(() => ({ default: () => <div>Error loading page</div> })));
const ResetPassword = lazy(() => import("./pages/ResetPassword").then(module => ({ default: module.ResetPassword })).catch(() => ({ default: () => <div>Error loading page</div> })));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy").catch(() => ({ default: () => <div>Error loading page</div> })));
const TermsOfService = lazy(() => import("./pages/TermsOfService").catch(() => ({ default: () => <div>Error loading page</div> })));
const Pricing = lazy(() => import("./pages/Pricing").catch(() => ({ default: () => <div>Error loading page</div> })));
const ListingsGate = lazy(() => import("./pages/ListingsGate").catch(() => ({ default: () => <div>Error loading page</div> })));
const AcquisitionsAgent = lazy(() => import("./pages/AcquisitionsAgent").catch(() => ({ default: () => <div>Error loading page</div> })));
const Community = lazy(() => import("./pages/Community").catch(() => ({ default: () => <div>Error loading page</div> })));
const CommunityGate = lazy(() => import("./pages/CommunityGate").catch(() => ({ default: () => <div>Error loading page</div> })));
const FullLeaderboard = lazy(() => import("./pages/FullLeaderboard").catch(() => ({ default: () => <div>Error loading page</div> })));
const PMS = lazy(() => import("./pages/PMS").catch(() => ({ default: () => <div>Error loading page</div> })));
const StudentLog = lazy(() => import("./pages/StudentLog").catch(() => ({ default: () => <div>Error loading page</div> })));
const AdminMembers = lazy(() => import("./pages/AdminMembers").catch(() => ({ default: () => <div>Error loading page</div> })));
const Members = lazy(() => import("./pages/Members").catch(() => ({ default: () => <div>Error loading page</div> })));
const ProfileSetup = lazy(() => import("./pages/ProfileSetup").catch(() => ({ default: () => <div>Error loading page</div> })));
const RichieAdmin = lazy(() => import("./pages/RichieAdmin").catch(() => ({ default: () => <div>Error loading page</div> })));
const GuideBook = lazy(() => import("./pages/GuideBook").catch(() => ({ default: () => <div>Error loading page</div> })));
const GuideBook2 = lazy(() => import("./pages/GuideBook2").catch(() => ({ default: () => <div>Error loading page</div> })));
const GuestGuide = lazy(() => import("./pages/GuestGuide").catch(() => ({ default: () => <div>Error loading page</div> })));
const Auth = lazy(() => import("./pages/Auth").then(module => ({ default: module.Auth })).catch(() => ({ default: () => <div>Error loading page</div> })));

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
  <ErrorBoundary>
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
  </ErrorBoundary>
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
