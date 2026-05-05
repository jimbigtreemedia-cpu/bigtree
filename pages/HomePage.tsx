import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React, { Suspense, lazy } from "react";
import Hero from "../components/Hero";
import HomeServiceSnippet from "../components/HomeServiceSnippet";
import HomePricingPreview from "../components/HomePricingPreview";
import HomeStickyTrialCTA from "../components/HomeStickyTrialCTA";
import {
  FAQSectionSkeleton,
  ProcessSectionSkeleton,
  TeamSectionSkeleton,
  TestimonialsSectionSkeleton
} from "../components/Skeletons";
const Process = lazy(() => import("../components/Process.js"));
const Testimonials = lazy(() => import("../components/Testimonials.js"));
const Team = lazy(() => import("../components/Team.js"));
const FAQ = lazy(() => import("../components/FAQ.js"));
const HomePage = () => {
  return  jsxs(Fragment, { children: [
     <Hero />,
     <HomeServiceSnippet />,
     <HomePricingPreview />,
     <Suspense fallback={<ProcessSectionSkeleton />} children={<Process />} />,
     <Suspense fallback={<TestimonialsSectionSkeleton />} children={<Testimonials />} />,
     <Suspense fallback={<TeamSectionSkeleton />} children={<Team />} />,
     <Suspense fallback={<FAQSectionSkeleton />} children={<FAQ />} />,
     jsx("div", { className: "h-28" }),
     <HomeStickyTrialCTA />
  ] });
};
export default HomePage;
