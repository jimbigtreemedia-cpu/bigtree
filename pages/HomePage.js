import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Suspense, lazy } from "react";
import Hero from "../components/Hero";
import HomeServiceSnippet from "../components/HomeServiceSnippet";
import HomePricingPreview from "../components/HomePricingPreview";
import HomeStickyTrialCTA from "../components/HomeStickyTrialCTA";
import { FAQSectionSkeleton, ProcessSectionSkeleton, TeamSectionSkeleton, TestimonialsSectionSkeleton } from "../components/Skeletons";
const Process = lazy(() => import("../components/Process.js"));
const Testimonials = lazy(() => import("../components/Testimonials.js"));
const Team = lazy(() => import("../components/Team.js"));
const FAQ = lazy(() => import("../components/FAQ.js"));
const HomePage = () => {
    return jsxs(Fragment, { children: [
            _jsx(Hero, {}),
            _jsx(HomeServiceSnippet, {}),
            _jsx(HomePricingPreview, {}),
            _jsx(Suspense, { fallback: _jsx(ProcessSectionSkeleton, {}), children: _jsx(Process, {}) }),
            _jsx(Suspense, { fallback: _jsx(TestimonialsSectionSkeleton, {}), children: _jsx(Testimonials, {}) }),
            _jsx(Suspense, { fallback: _jsx(TeamSectionSkeleton, {}), children: _jsx(Team, {}) }),
            _jsx(Suspense, { fallback: _jsx(FAQSectionSkeleton, {}), children: _jsx(FAQ, {}) }),
            jsx("div", { className: "h-28" }),
            _jsx(HomeStickyTrialCTA, {})
        ] });
};
export default HomePage;
