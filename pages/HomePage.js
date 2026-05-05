import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React, { Suspense, lazy } from "react";
import Hero from "../components/Hero.js";
import HomeServiceSnippet from "../components/HomeServiceSnippet.js";
import HomePricingPreview from "../components/HomePricingPreview.js";
import HomeStickyTrialCTA from "../components/HomeStickyTrialCTA.js";
import {
  FAQSectionSkeleton,
  ProcessSectionSkeleton,
  TeamSectionSkeleton,
  TestimonialsSectionSkeleton
} from "../components/Skeletons.js";
const Process = lazy(() => import("../components/Process.js"));
const Testimonials = lazy(() => import("../components/Testimonials.js"));
const Team = lazy(() => import("../components/Team.js"));
const FAQ = lazy(() => import("../components/FAQ.js"));
const HomePage = () => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Hero, {}),
    /* @__PURE__ */ jsx(HomeServiceSnippet, {}),
    /* @__PURE__ */ jsx(HomePricingPreview, {}),
    /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(ProcessSectionSkeleton, {}), children: /* @__PURE__ */ jsx(Process, {}) }),
    /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(TestimonialsSectionSkeleton, {}), children: /* @__PURE__ */ jsx(Testimonials, {}) }),
    /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(TeamSectionSkeleton, {}), children: /* @__PURE__ */ jsx(Team, {}) }),
    /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(FAQSectionSkeleton, {}), children: /* @__PURE__ */ jsx(FAQ, {}) }),
    /* @__PURE__ */ jsx("div", { className: "h-28" }),
    /* @__PURE__ */ jsx(HomeStickyTrialCTA, {})
  ] });
};
var stdin_default = HomePage;
export {
  stdin_default as default
};
