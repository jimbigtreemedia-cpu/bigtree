import { jsx, jsxs } from "react/jsx-runtime";
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import { ThemeProvider } from "./components/ThemeProvider.js";
import ScrollToTop from "./components/ScrollToTop.js";
import RouteSEO from "./components/RouteSEO.js";
import AnalyticsTracker from "./components/AnalyticsTracker.js";
import { RouteSkeleton } from "./components/Skeletons.js";
const HomePage = lazy(() => import("./pages/HomePage.js"));
const ServicesPage = lazy(() => import("./pages/ServicesPage.js"));
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage.js"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage.js"));
const PortfolioDetailPage = lazy(() => import("./pages/PortfolioDetailPage.js"));
const ProcessPage = lazy(() => import("./pages/ProcessPage.js"));
const PricingPage = lazy(() => import("./pages/PricingPage.js"));
const FreeTrialPage = lazy(() => import("./pages/FreeTrialPage.js"));
const ContactPage = lazy(() => import("./pages/ContactPage.js"));
const TeamPage = lazy(() => import("./pages/TeamPage.js"));
const FAQPage = lazy(() => import("./pages/FAQPage.js"));
const Legal = lazy(() => import("./components/Legal.js"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.js"));
const PageFallback = () => /* @__PURE__ */ jsx(RouteSkeleton, {});
const App = () => {
  return /* @__PURE__ */ jsx(ThemeProvider, { defaultTheme: "light", storageKey: "snapiums-theme", children: /* @__PURE__ */ jsxs(BrowserRouter, { children: [
    /* @__PURE__ */ jsx(RouteSEO, {}),
    /* @__PURE__ */ jsx(AnalyticsTracker, {}),
    /* @__PURE__ */ jsx(ScrollToTop, {}),
    /* @__PURE__ */ jsxs("div", { className: "font-display overflow-x-hidden w-full transition-colors duration-300", children: [
      /* @__PURE__ */ jsx(Navbar, {}),
      /* @__PURE__ */ jsx("main", { className: "relative flex min-h-screen w-full flex-col", children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(PageFallback, {}), children: /* @__PURE__ */ jsxs(Routes, { children: [
        /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(HomePage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/services", element: /* @__PURE__ */ jsx(ServicesPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/services/:serviceId", element: /* @__PURE__ */ jsx(ServiceDetailPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/portfolio", element: /* @__PURE__ */ jsx(PortfolioPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/portfolio/:projectId", element: /* @__PURE__ */ jsx(PortfolioDetailPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/process", element: /* @__PURE__ */ jsx(ProcessPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/pricing", element: /* @__PURE__ */ jsx(PricingPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/free-trial", element: /* @__PURE__ */ jsx(FreeTrialPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/contact", element: /* @__PURE__ */ jsx(ContactPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/team", element: /* @__PURE__ */ jsx(TeamPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/faq", element: /* @__PURE__ */ jsx(FAQPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/legal/privacy", element: /* @__PURE__ */ jsx(Legal, { type: "privacy" }) }),
        /* @__PURE__ */ jsx(Route, { path: "/legal/terms", element: /* @__PURE__ */ jsx(Legal, { type: "terms" }) }),
        /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFoundPage, {}) })
      ] }) }) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] }) });
};
var stdin_default = App;
export {
  stdin_default as default
};
