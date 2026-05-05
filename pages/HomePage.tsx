import React, { Fragment, Suspense, lazy } from "react";
import Hero from "../components/Hero";
import HomeServiceSnippet from "../components/HomeServiceSnippet";
import HomePricingPreview from "../components/HomePricingPreview";
import HomeStickyTrialCTA from "../components/HomeStickyTrialCTA";
import { FAQSectionSkeleton, ProcessSectionSkeleton, TeamSectionSkeleton, TestimonialsSectionSkeleton } from "../components/Skeletons";
const Process = /*#__PURE__*/lazy(() => import("../components/Process.js"));
const Testimonials = /*#__PURE__*/lazy(() => import("../components/Testimonials.js"));
const Team = /*#__PURE__*/lazy(() => import("../components/Team.js"));
const FAQ = /*#__PURE__*/lazy(() => import("../components/FAQ.js"));
const HomePage = () => {
  return jsxs(Fragment, {
    children: [/*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(HomeServiceSnippet, null), /*#__PURE__*/React.createElement(HomePricingPreview, null), /*#__PURE__*/React.createElement(Suspense, {
      fallback: /*#__PURE__*/React.createElement(ProcessSectionSkeleton, null),
      children: /*#__PURE__*/React.createElement(Process, null)
    }), /*#__PURE__*/React.createElement(Suspense, {
      fallback: /*#__PURE__*/React.createElement(TestimonialsSectionSkeleton, null),
      children: /*#__PURE__*/React.createElement(Testimonials, null)
    }), /*#__PURE__*/React.createElement(Suspense, {
      fallback: /*#__PURE__*/React.createElement(TeamSectionSkeleton, null),
      children: /*#__PURE__*/React.createElement(Team, null)
    }), /*#__PURE__*/React.createElement(Suspense, {
      fallback: /*#__PURE__*/React.createElement(FAQSectionSkeleton, null),
      children: /*#__PURE__*/React.createElement(FAQ, null)
    }), jsx("div", {
      className: "h-28"
    }), /*#__PURE__*/React.createElement(HomeStickyTrialCTA, null)]
  });
};
export default HomePage;