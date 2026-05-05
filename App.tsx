import React, { Suspense, lazy, FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";
import ScrollToTop from "./components/ScrollToTop";
import RouteSEO from "./components/RouteSEO";
import AnalyticsTracker from "./components/AnalyticsTracker";
import { RouteSkeleton } from "./components/Skeletons";

const HomePage = lazy(() => import("./pages/HomePage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const PortfolioDetailPage = lazy(() => import("./pages/PortfolioDetailPage"));
const ProcessPage = lazy(() => import("./pages/ProcessPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const FreeTrialPage = lazy(() => import("./pages/FreeTrialPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const Legal = lazy(() => import("./components/Legal"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const PageFallback: FC = () => <RouteSkeleton />;

const App: FC = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="snapiums-theme">
      <BrowserRouter>
        <RouteSEO />
        <AnalyticsTracker />
        <ScrollToTop />
        <div className="font-display overflow-x-hidden w-full transition-colors duration-300">
          <Navbar />
          <main className="relative flex min-h-screen w-full flex-col">
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/portfolio/:projectId" element={<PortfolioDetailPage />} />
                <Route path="/process" element={<ProcessPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/free-trial" element={<FreeTrialPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/legal/privacy" element={<Legal type="privacy" />} />
                <Route path="/legal/terms" element={<Legal type="terms" />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
