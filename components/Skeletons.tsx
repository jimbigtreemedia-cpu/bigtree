import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { useLocation } from "react-router-dom";

const S = ({ c = "" }) =>  jsx("div", { className: `skeleton-block ${c}`.trim() });
const Lines = ({ w = ["w-full", "w-5/6"], c = "h-4 rounded-full", box = "space-y-2" }) =>  jsx("div", { className: box, children: w.map((x, i) =>  jsx(S, { c: `${c} ${x}` }, `${x}-${i}`)) });
const LoadingShell = ({ children }) =>  jsxs("div", { role: "status", "aria-live": "polite", "aria-busy": "true", children: [
   jsx("span", { className: "sr-only", children: "Loading page content" }),
   jsx("div", { "aria-hidden": true, children })
] });

const HomeHeroSkeleton = () =>  jsxs("section", { className: "relative min-h-screen overflow-hidden pt-32 pb-20 dark:bg-slate-950", children: [
   <S c="absolute inset-0 rounded-none opacity-30" />,
   jsxs("div", { className: "relative mx-auto max-w-7xl px-6 lg:px-8", children: [
     jsxs("div", { className: "grid lg:grid-cols-2 gap-16 items-center", children: [
       jsxs("div", { className: "order-2 lg:order-1", children: [
         <S c="h-8 w-56 rounded-full mb-8" />,
         <Lines w={["w-full"]} c="h-14 rounded-2xl" box="space-y-4 mb-8" />,
         <Lines w={["w-full"]} c="h-5 rounded-full" box="space-y-2 mb-10" />,
         jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
           <S c="h-14 w-full sm:w-52 rounded-full" />,
           <S c="h-14 w-full sm:w-44 rounded-full" />
        ] }),
         jsxs("div", { className: "hidden lg:flex gap-6 mt-12", children: [
           <S c="h-4 w-28 rounded-full" />,
           <S c="h-4 w-28 rounded-full" />,
           <S c="h-4 w-28 rounded-full" />
        ] })
      ] }),
       jsxs("div", { className: "order-1 lg:order-2", children: [
         jsxs("div", { className: "relative aspect-[4/3] rounded-2xl border-[8px] border-white dark:border-slate-800 overflow-hidden", children: [
           <S c="absolute inset-0 rounded-none" />,
           <S c="absolute top-4 left-4 h-6 w-14 rounded-md" />,
           <S c="absolute top-4 right-4 h-6 w-16 rounded-md" />,
           jsxs("div", { className: "absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2", children: [
             <S c="h-6 w-36 rounded-full" />,
             jsxs("div", { className: "flex gap-1.5", children: [
               <S c="h-1.5 w-6 rounded-full" />,
               <S c="h-1.5 w-1.5 rounded-full" />,
               <S c="h-1.5 w-1.5 rounded-full" />
            ] })
          ] })
        ] }),
         <S c="hidden sm:block -mt-10 -ml-8 h-20 w-56 rounded-xl" />
      ] })
    ] }),
     jsxs("div", { className: "mt-16 border-t border-slate-200 dark:border-slate-800 py-12", children: [
       <S c="h-3 w-56 rounded-full mx-auto mb-8" />,
       jsx("div", { className: "flex flex-wrap justify-center gap-10", children: Array.from({ length: 5 }).map((_, i) =>  jsx(S, { c: "h-8 w-28 rounded-lg" }, i)) })
    ] })
  ] })
] });

const HomeServicesSkeleton = () =>  jsx("section", { className: "py-24 bg-white dark:bg-slate-950 border-y border-black/5 dark:border-white/5", children:  jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-8", children: [
   jsxs("div", { className: "flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12", children: [
     jsxs("div", { className: "max-w-3xl", children: [
       <S c="h-3 w-44 rounded-full mb-3" />,
       <S c="h-10 w-full rounded-2xl mb-4" />,
       <Lines w={["w-full"]} />
    ] }),
     jsxs("div", { className: "flex gap-3", children: [
       <S c="h-11 w-40 rounded-full" />,
       <S c="h-11 w-36 rounded-full" />
    ] })
  ] }),
   jsx("div", { className: "grid sm:grid-cols-2 xl:grid-cols-3 gap-5", children: Array.from({ length: 6 }).map((_, i) =>  jsxs("article", { className: "rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 p-6", children: [
     jsxs("div", { className: "flex justify-between mb-4", children: [ <S c="h-6 w-24 rounded-full" />,  <S c="h-5 w-5 rounded-md" />] }),
     <S c="h-6 w-11/12 rounded-xl mb-3" />,
     <Lines w={["w-full"]} box="space-y-2 mb-5" />,
     <S c="h-4 w-28 rounded-full" />
  ] }, i)) })
] }) });

const HomePricingSkeleton = () =>  jsx("section", { className: "py-24 bg-slate-50 dark:bg-slate-900 border-y border-black/5 dark:border-white/5", children:  jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-8", children: [
   jsxs("div", { className: "text-center mb-12", children: [
     <S c="h-7 w-44 rounded-full mx-auto mb-5" />,
     <S c="h-10 w-full max-w-2xl rounded-2xl mx-auto mb-4" />,
     <Lines w={["w-full"]} box="space-y-2 max-w-3xl mx-auto" />
  ] }),
   jsx("div", { className: "grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto", children: Array.from({ length: 2 }).map((_, i) =>  jsxs("article", { className: "rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-7", children: [
     jsxs("div", { className: "flex justify-between mb-6", children: [ <S c="h-6 w-24 rounded-full" />,  <S c="h-4 w-20 rounded-full" />] }),
     jsx("div", { className: "space-y-3 mb-6", children: Array.from({ length: 3 }).map((__, j) =>  jsxs("div", { className: "flex justify-between", children: [ <S c="h-4 w-2/3 rounded-full" />,  <S c="h-4 w-16 rounded-full" />] }, j)) }),
     <S c="h-11 w-full rounded-xl" />
  ] }, i)) }),
   jsxs("div", { className: "mt-10 flex justify-center gap-3", children: [ <S c="h-11 w-36 rounded-full" />,  <S c="h-11 w-44 rounded-full" />] })
] }) });

const ProcessSectionSkeleton = () =>  jsx("section", { className: "py-32 bg-background-base dark:bg-slate-950", children:  jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-8", children: [
   jsxs("div", { className: "text-center mb-20", children: [ <S c="h-12 w-2/3 max-w-2xl rounded-2xl mx-auto mb-6" />,  <Lines w={["w-full"]} box="space-y-2 max-w-2xl mx-auto" />] }),
   jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12", children: Array.from({ length: 4 }).map((_, i) =>  jsxs("article", { className: "rounded-3xl p-8 pt-12 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-center", children: [ <S c="w-14 h-14 rounded-2xl mx-auto mb-6" />,  <S c="h-6 w-3/4 rounded-xl mx-auto mb-3" />,  <Lines w={["w-full"]} />] }, i)) })
] }) });

const TestimonialsSectionSkeleton = () =>  jsx("section", { className: "py-32 bg-white dark:bg-slate-950", children:  jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-8", children: [
   jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8", children: [
     jsxs("div", { children: [ <S c="h-7 w-48 rounded-full mb-4" />,  <S c="h-12 w-80 rounded-2xl" />] }),
     jsxs("div", { className: "hidden md:flex gap-3", children: [ <S c="h-12 w-12 rounded-full" />,  <S c="h-12 w-12 rounded-full" />,  <S c="h-12 w-12 rounded-full" />] })
  ] }),
   jsxs("div", { className: "rounded-3xl overflow-hidden bg-primary dark:bg-slate-900", children: [
     jsxs("div", { className: "grid lg:grid-cols-5 min-h-[500px]", children: [
       jsxs("div", { className: "lg:col-span-3 p-10 md:p-16", children: [ <Lines w={["w-full"]} c="h-10 rounded-2xl bg-white/35 dark:bg-slate-700/70" box="space-y-4 mb-10" />,  <S c="h-16 w-48 rounded-2xl bg-white/35 dark:bg-slate-700/70" />] }),
       jsx("div", { className: "lg:col-span-2 p-10 md:p-16 border-l border-white/10", children:  jsx("div", { className: "space-y-4", children: Array.from({ length: 3 }).map((_, i) =>  jsx(S, { c: "h-20 w-full rounded-2xl bg-white/20 dark:bg-slate-700/60" }, i)) }) })
    ] }),
     <S c="h-1 w-full rounded-none bg-white/30 dark:bg-slate-700/70" />
  ] })
] }) });

const TeamSectionSkeleton = () =>  jsx("section", { className: "py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800", children:  jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-8", children: [
   jsxs("div", { className: "text-center mb-16", children: [ <S c="h-10 w-80 rounded-2xl mx-auto mb-6" />,  <Lines w={["w-full"]} box="space-y-2 max-w-2xl mx-auto" />] }),
   jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8", children: Array.from({ length: 4 }).map((_, i) =>  jsxs("article", { className: "bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 text-center", children: [ <S c="w-32 h-32 rounded-full mx-auto mb-6" />,  <S c="h-6 w-2/3 rounded-xl mx-auto mb-2" />,  <S c="h-4 w-1/2 rounded-full mx-auto" />] }, i)) })
] }) });

const FAQSectionSkeleton = () =>  jsx("section", { className: "py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900", children:  jsxs("div", { className: "max-w-3xl mx-auto px-6 lg:px-8", children: [
   jsxs("div", { className: "text-center mb-16", children: [ <S c="h-7 w-44 rounded-full mx-auto mb-4" />,  <S c="h-10 w-80 rounded-2xl mx-auto mb-4" />,  <S c="h-4 w-72 rounded-full mx-auto" />] }),
   jsx("div", { className: "space-y-4", children: Array.from({ length: 5 }).map((_, i) =>  jsxs("article", { className: "border rounded-2xl bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800", children: [ jsxs("div", { className: "flex justify-between p-6", children: [ <S c="h-6 w-4/5 rounded-xl" />,  <S c="h-10 w-10 rounded-full" />] }),  jsx("div", { className: "px-6 pb-6", children:  <S c="h-4 w-full rounded-full" /> })] }, i)) })
] }) });

const HomeStickyCtaSkeleton = () =>  jsx("div", { className: "pointer-events-none fixed bottom-4 left-0 right-0 z-[60] px-4", children:  jsxs("div", { className: "mx-auto max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur p-3 flex items-center gap-3", children: [ <S c="h-10 w-10 rounded-xl" />,  jsxs("div", { className: "flex-1", children: [ <S c="h-4 w-3/4 rounded-full mb-2" />,  <S c="h-3 w-1/2 rounded-full" />] }),  <S c="h-10 w-28 rounded-xl" />] }) });

const HomeRouteSkeleton = () =>  jsxs(Fragment, { children: [ <HomeHeroSkeleton />,  <HomeServicesSkeleton />,  <HomePricingSkeleton />,  <ProcessSectionSkeleton />,  <TestimonialsSectionSkeleton />,  <TeamSectionSkeleton />,  <FAQSectionSkeleton />,  jsx("div", { className: "h-28" }),  <HomeStickyCtaSkeleton />] });

const ServiceCardSkeleton = () =>  jsxs("article", { className: "group p-8 rounded-3xl bg-white dark:bg-slate-900 premium-border dark:border dark:border-slate-800 soft-shadow flex flex-col", children: [
   <S c="w-full mb-8 rounded-2xl aspect-square" />,
   jsxs("div", { className: "flex items-center gap-3 mb-3", children: [ <S c="h-10 w-10 rounded-lg" />,  <S c="h-6 w-3/4 rounded-xl" />] }),
   <Lines w={["w-full"]} box="space-y-2 mb-8" />,
   <S c="h-14 w-full rounded-xl mt-auto" />
] });

const ServicesPageRouteSkeleton = () =>  jsx("section", { className: "py-32 bg-background-base dark:bg-slate-950 scroll-mt-28", children:  jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-8", children: [
   jsxs("div", { className: "text-center mb-20", children: [ <S c="h-12 w-11/12 max-w-4xl rounded-2xl mx-auto mb-6" />,  <Lines w={["w-full"]} c="h-5 rounded-full" box="space-y-2 max-w-4xl mx-auto" />] }),
  ["clothing", "jewelry"].map((segment) =>  jsxs("article", { className: "mb-20", children: [
     jsxs("div", { className: "mb-8 md:mb-10", children: [ <S c="h-3 w-40 rounded-full mb-2" />,  <S c="h-10 w-3/4 rounded-2xl mb-4" />,  <S c="h-4 w-full max-w-4xl rounded-full" />] }),
     jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8", children: Array.from({ length: 3 }).map((_, i) =>  jsx(ServiceCardSkeleton, {}, `${segment}-${i}`)) })
  ] }, segment))
] }) });

const PortfolioPageRouteSkeleton = () => {
  const h = ["h-72", "h-96", "h-80", "h-[26rem]", "h-72", "h-[22rem]", "h-80", "h-96", "h-72"];
  return  jsx("section", { className: "py-32 bg-white dark:bg-slate-950 scroll-mt-28", children:  jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-8", children: [
     jsxs("div", { className: "text-center mb-16", children: [ <S c="h-12 w-3/4 max-w-2xl rounded-2xl mx-auto mb-6" />,  <S c="h-4 w-full max-w-2xl rounded-full mx-auto mb-12" />,  jsx("div", { className: "flex flex-wrap justify-center gap-3 mb-16", children: Array.from({ length: 6 }).map((_, i) =>  jsx(S, { c: "h-10 w-24 rounded-full" }, i)) })] }),
     jsx("div", { className: "columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8", children: h.map((x, i) =>  jsxs("article", { className: "relative block overflow-hidden rounded-3xl soft-shadow break-inside-avoid premium-border dark:border dark:border-slate-800 bg-slate-100 dark:bg-slate-900", children: [ jsx(S, { c: `${x} w-full rounded-none` }),  jsxs("div", { className: "absolute inset-x-0 bottom-0 p-8", children: [ <S c="h-3 w-24 rounded-full mb-2 bg-white/40 dark:bg-slate-700/60" />,  <S c="h-6 w-2/3 rounded-xl bg-white/40 dark:bg-slate-700/60" />] })] }, i)) })
  ] }) });
};

const PricingCardSkeleton = ({ featured = false }) =>  jsxs("article", { className: `relative rounded-3xl p-8 sm:p-10 flex flex-col ${featured ? "bg-white dark:bg-slate-950 shadow-xl border border-accent-gold/20 ring-1 ring-accent-gold/10" : "bg-white dark:bg-slate-950 shadow-lg border border-slate-100 dark:border-slate-800"}`, children: [
  featured &&  <S c="absolute -top-4 left-1/2 -translate-x-1/2 h-7 w-40 rounded-full" />,
   jsxs("div", { className: "flex justify-between mb-8", children: [ <S c="h-16 w-16 rounded-2xl" />,  jsxs("div", { children: [ <S c="h-3 w-20 rounded-full mb-1" />,  <S c="h-8 w-20 rounded-xl" />] })] }),
   <S c="h-8 w-1/2 rounded-xl mb-2" />,
   <S c="h-4 w-full rounded-full mb-8" />,
   jsx("div", { className: "space-y-0 mb-10 rounded-2xl p-1 border border-slate-100 dark:border-slate-800", children: Array.from({ length: 6 }).map((_, i) =>  jsxs("div", { className: "flex justify-between p-4", children: [ <S c="h-4 w-2/3 rounded-full" />,  <S c="h-4 w-16 rounded-full" />] }, i)) }),
   <S c="h-14 w-full rounded-xl mt-auto" />
] });

const PricingPageRouteSkeleton = () =>  jsx("section", { className: "py-32 bg-slate-50 dark:bg-slate-900", children:  jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-8", children: [
   jsxs("div", { className: "text-center mb-20", children: [ <S c="h-7 w-44 rounded-full mx-auto mb-6" />,  <S c="h-12 w-2/3 rounded-2xl mx-auto mb-6" />,  <Lines w={["w-full"]} box="space-y-2 max-w-2xl mx-auto" />] }),
   jsxs("div", { className: "grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto", children: [ <PricingCardSkeleton  />,  <PricingCardSkeleton featured />] }),
   jsx("div", { className: "mt-16 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16", children: Array.from({ length: 3 }).map((_, i) =>  jsx(S, { c: "h-10 w-56 rounded-full" }, i)) })
] }) });

const ContactPageRouteSkeleton = () =>  jsx("section", { className: "py-32 bg-background-base dark:bg-slate-950 border-t border-black/5 dark:border-white/5", children:  jsxs("div", { className: "max-w-3xl mx-auto px-6 lg:px-8", children: [
   jsxs("div", { className: "text-center mb-16", children: [ <S c="h-12 w-2/3 rounded-2xl mx-auto mb-4" />,  <S c="h-5 w-96 max-w-full rounded-full mx-auto" />] }),
   jsxs("div", { className: "space-y-6 bg-white dark:bg-slate-900 p-10 rounded-3xl premium-border dark:border dark:border-slate-800", children: [
     jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: Array.from({ length: 2 }).map((_, i) =>  jsx(S, { c: "h-14 w-full rounded-xl" }, i)) }),
     <S c="h-14 w-full rounded-xl" />,
     <S c="h-28 w-full rounded-xl" />,
     <S c="h-14 w-full rounded-xl" />
  ] })
] }) });

const FreeTrialPageRouteSkeleton = () =>  jsx("section", { className: "py-32 bg-white dark:bg-slate-950", children:  jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-8", children: [
   jsxs("div", { className: "text-center mb-16", children: [ <S c="h-7 w-28 rounded-full mx-auto mb-4" />,  <S c="h-12 w-2/3 rounded-2xl mx-auto mb-6" />,  <Lines w={["w-full"]} box="space-y-2 max-w-2xl mx-auto" />] }),
   jsxs("div", { className: "rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900", children: [
     jsxs("div", { className: "grid lg:grid-cols-2", children: [
       jsxs("div", { className: "p-10 md:p-16 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800", children: [ <S c="h-72 w-full rounded-2xl mb-8" />,  <S c="h-5 w-44 rounded-full" />] }),
       jsxs("div", { className: "p-10 md:p-16 bg-white dark:bg-slate-900/50 space-y-6", children: [ <S c="h-8 w-56 rounded-xl" />,  jsx("div", { className: "grid sm:grid-cols-2 gap-6", children: Array.from({ length: 2 }).map((_, i) =>  jsx(S, { c: "h-12 w-full rounded-xl" }, i)) }),  <S c="h-32 w-full rounded-xl" />,  <S c="h-20 w-full rounded-xl" />,  <S c="h-14 w-full rounded-xl" />] })
    ] })
  ] })
] }) });

const ServiceDetailPageRouteSkeleton = () =>  jsx("section", { className: "py-24 md:py-28 bg-background-base dark:bg-slate-950 min-h-screen", children:  jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-8", children: [
   <S c="h-4 w-36 rounded-full mb-8" />,
   jsxs("div", { className: "grid lg:grid-cols-2 gap-12 items-start mb-14", children: [
     jsxs("div", { className: "space-y-4", children: [ <S c="aspect-square w-full rounded-3xl" />,  jsx("div", { className: "flex flex-wrap gap-2", children: Array.from({ length: 4 }).map((_, i) =>  jsx(S, { c: "h-6 w-20 rounded-full" }, i)) })] }),
     jsxs("div", { children: [ <S c="h-3 w-28 rounded-full mb-3" />,  <S c="h-12 w-full rounded-2xl mb-6" />,  <Lines w={["w-full"]} box="space-y-2 mb-8" />,  jsx("div", { className: "grid sm:grid-cols-3 gap-3 mb-8", children: Array.from({ length: 3 }).map((_, i) =>  jsx(S, { c: "h-24 w-full rounded-xl" }, i)) }),  jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [ <S c="h-12 flex-1 rounded-xl" />,  <S c="h-12 flex-1 rounded-xl" />] })] })
  ] }),
   jsx("div", { className: "grid lg:grid-cols-2 gap-8 mb-14", children: Array.from({ length: 2 }).map((_, i) =>  jsxs("article", { className: "bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800", children: [ <S c="h-8 w-52 rounded-xl mb-5" />, Array.from({ length: i === 0 ? 5 : 3 }).map((__, j) =>  jsx(S, { c: "h-4 w-full rounded-full mb-3" }, j))] }, i)) }),
   jsxs("section", { children: [
     jsxs("div", { className: "flex justify-between mb-6", children: [ <S c="h-10 w-64 rounded-2xl" />,  <S c="h-4 w-32 rounded-full" />] }),
     jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: Array.from({ length: 3 }).map((_, i) =>  jsxs("article", { className: "rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800", children: [ <S c="aspect-[4/3] w-full rounded-none" />,  jsxs("div", { className: "p-5", children: [ <S c="h-5 w-3/4 rounded-xl mb-1" />,  <S c="h-4 w-full rounded-full" />] })] }, i)) })
  ] })
] }) });

const PortfolioDetailPageRouteSkeleton = () =>  jsx("section", { className: "py-24 md:py-28 bg-white dark:bg-slate-950 min-h-screen", children:  jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-8", children: [
   <S c="h-4 w-36 rounded-full mb-8" />,
   jsxs("header", { className: "mb-10", children: [ <S c="h-3 w-24 rounded-full mb-3" />,  <S c="h-12 w-3/4 rounded-2xl mb-4" />,  <S c="h-5 w-full max-w-3xl rounded-full" />] }),
   jsxs("div", { className: "rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 mb-8", children: [
     jsxs("div", { className: "flex justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900", children: [ <S c="h-4 w-36 rounded-full" />,  <S c="h-3 w-16 rounded-full" />] }),
     jsxs("div", { className: "relative min-h-[60vh] p-4 sm:p-6 lg:p-8", children: [ <S c="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full" />,  <S c="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full" />,  <S c="h-[60vh] w-full rounded-2xl" />] }),
     jsxs("div", { className: "px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row gap-4 justify-between items-center", children: [ <S c="h-10 w-24 rounded-lg" />,  jsx("div", { className: "flex gap-3", children: Array.from({ length: 6 }).map((_, i) =>  jsx(S, { c: "h-14 w-14 rounded-lg" }, i)) }),  <S c="h-4 w-20 rounded-full" />] })
  ] }),
   jsx("div", { className: "grid md:grid-cols-3 gap-6 mb-14", children: Array.from({ length: 3 }).map((_, i) =>  jsx(S, { c: "h-24 w-full rounded-2xl" }, i)) }),
   jsxs("section", { className: "mb-10", children: [ jsxs("div", { className: "flex justify-between mb-6", children: [ <S c="h-10 w-52 rounded-2xl" />,  <S c="h-4 w-40 rounded-full" />] }),  jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: Array.from({ length: 3 }).map((_, i) =>  jsxs("article", { className: "rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800", children: [ <S c="aspect-[4/3] w-full rounded-none" />,  <S c="h-10 w-2/3 rounded-xl m-5" />] }, i)) })] })
] }) });

const LegalPageRouteSkeleton = () =>  jsx("section", { className: "py-32 bg-background-base dark:bg-slate-950 border-t border-black/5 dark:border-white/5", children:  jsxs("div", { className: "max-w-4xl mx-auto px-6 lg:px-8", children: [
   jsxs("div", { className: "text-center mb-10", children: [ <S c="h-7 w-24 rounded-full mx-auto mb-4" />,  <S c="h-12 w-2/3 rounded-2xl mx-auto mb-3" />,  <S c="h-4 w-44 rounded-full mx-auto" />] }),
   jsx("article", { className: "space-y-8 bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 premium-border dark:border dark:border-slate-800", children: Array.from({ length: 4 }).map((_, i) =>  jsxs("section", { children: [ <S c="h-7 w-2/5 rounded-xl mb-2" />,  <Lines w={["w-full"]} />] }, i)) }),
   jsxs("div", { className: "mt-8 flex flex-col sm:flex-row gap-4", children: [ <S c="h-12 flex-1 rounded-xl" />,  <S c="h-12 flex-1 rounded-xl" />] })
] }) });

const NotFoundPageRouteSkeleton = () =>  jsx("section", { className: "relative min-h-[70vh] flex items-center py-24 bg-background-base dark:bg-slate-950", children:  jsxs("div", { className: "max-w-4xl mx-auto px-6 lg:px-8 text-center", children: [
   <S c="h-16 w-16 rounded-2xl mx-auto mb-6" />,
   <S c="h-3 w-24 rounded-full mx-auto mb-3" />,
   <S c="h-12 w-2/3 rounded-2xl mx-auto mb-4" />,
   <Lines w={["w-full"]} box="space-y-2 max-w-2xl mx-auto mb-10" />,
   jsx("div", { className: "flex flex-wrap justify-center gap-3", children: Array.from({ length: 3 }).map((_, i) =>  jsx(S, { c: "h-12 w-36 rounded-full" }, i)) })
] }) });

const RouteSkeleton = () => {
  const { pathname } = useLocation();
  let page =  <NotFoundPageRouteSkeleton />;
  if (pathname === "/") page =  <HomeRouteSkeleton />;
  else if (pathname === "/services") page =  <ServicesPageRouteSkeleton />;
  else if (pathname.startsWith("/services/")) page =  <ServiceDetailPageRouteSkeleton />;
  else if (pathname === "/portfolio") page =  <PortfolioPageRouteSkeleton />;
  else if (pathname.startsWith("/portfolio/")) page =  <PortfolioDetailPageRouteSkeleton />;
  else if (pathname === "/process") page =  <ProcessSectionSkeleton />;
  else if (pathname === "/pricing") page =  <PricingPageRouteSkeleton />;
  else if (pathname === "/free-trial") page =  <FreeTrialPageRouteSkeleton />;
  else if (pathname === "/contact") page =  <ContactPageRouteSkeleton />;
  else if (pathname === "/team") page =  <TeamSectionSkeleton />;
  else if (pathname === "/faq") page =  <FAQSectionSkeleton />;
  else if (pathname.startsWith("/legal/")) page =  <LegalPageRouteSkeleton />;
  return  <LoadingShell children={page} />;
};

