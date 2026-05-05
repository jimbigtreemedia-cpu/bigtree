import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { Link } from "react-router-dom";
import { Shirt, Gem, Check, ArrowRight, Zap } from "lucide-react";
import { siteData } from "../data.js";
const Pricing = () => {
  return /* @__PURE__ */ jsxs("section", { className: "py-32 bg-slate-50 dark:bg-slate-900 scroll-mt-28 relative overflow-hidden", id: "pricing", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-40 -left-64 w-96 h-96 bg-accent-teal/5 dark:bg-accent-teal/10 rounded-full blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-20 -right-64 w-96 h-96 bg-accent-gold/5 dark:bg-accent-gold/10 rounded-full blur-3xl" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-8 relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-20", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6 shadow-sm", children: [
          /* @__PURE__ */ jsx(Zap, { size: 12, className: "text-accent-gold fill-accent-gold" }),
          "Transparent Rates"
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6", children: "Simple, Flat-Rate Pricing" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed", children: "Scalable costs for growing brands. No hidden fees or complicated credits - just professional per-image rates." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto", children: siteData.pricing.map((category) => {
        const isJewelry = category.title === "Jewelry";
        return /* @__PURE__ */ jsxs("div", { className: `relative rounded-3xl p-8 sm:p-10 transition-all duration-300 hover:-translate-y-2 flex flex-col ${isJewelry ? "bg-white dark:bg-slate-950 shadow-xl shadow-accent-gold/5 border border-accent-gold/20 ring-1 ring-accent-gold/10" : "bg-white dark:bg-slate-950 shadow-lg border border-slate-100 dark:border-slate-800"}`, children: [
          isJewelry && /* @__PURE__ */ jsx("div", { className: "absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-accent-gold text-white dark:text-slate-900 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg", children: "Premium Retouching" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-8", children: [
            /* @__PURE__ */ jsx("div", { className: `p-4 rounded-2xl ${isJewelry ? "bg-accent-gold/10 text-accent-gold" : "bg-accent-teal/10 text-accent-teal"}`, children: isJewelry ? /* @__PURE__ */ jsx(Gem, { size: 32 }) : /* @__PURE__ */ jsx(Shirt, { size: 32 }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1", children: "Starting from" }),
              /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-slate-900 dark:text-white", children: category.items[0].price })
            ] })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-slate-900 dark:text-white mb-2", children: category.title }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 dark:text-slate-400 text-sm mb-8", children: isJewelry ? "Specialized high-end retouching for diamonds, gemstones, and precious metals. Includes focus stacking." : "Standard to advanced retouching for apparel, accessories, and ghost mannequins. Fast turnaround." }),
          /* @__PURE__ */ jsx("div", { className: "space-y-0 mb-10 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-1 border border-slate-100 dark:border-slate-800", children: category.items.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-4 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all duration-200 group", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: `size-1.5 rounded-full ${isJewelry ? "bg-accent-gold" : "bg-accent-teal"} opacity-50 group-hover:opacity-100 transition-opacity` }),
              /* @__PURE__ */ jsx("span", { className: "text-slate-600 dark:text-slate-300 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors", children: item.name })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900 dark:text-white", children: item.price })
          ] }, item.name)) }),
          /* @__PURE__ */ jsx("div", { className: "mt-auto", children: /* @__PURE__ */ jsxs(Link, { to: "/contact", "data-analytics-cta": isJewelry ? "pricing_get_started_jewelry" : "pricing_get_started_clothing", "data-analytics-section": "pricing_table", className: `w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${isJewelry ? "bg-primary text-white hover:bg-slate-800 dark:hover:bg-accent-teal shadow-xl shadow-primary/20" : "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal"}`, children: [
            "Get Started",
            /* @__PURE__ */ jsx(ArrowRight, { size: 18 })
          ] }) })
        ] }, category.title);
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-16 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 text-sm font-medium text-slate-500 dark:text-slate-400 opacity-90", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm", children: [
          /* @__PURE__ */ jsx(Check, { size: 16, className: "text-primary dark:text-accent-teal" }),
          /* @__PURE__ */ jsx("span", { children: "Volume Discounts (1000+ images)" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm", children: [
          /* @__PURE__ */ jsx(Check, { size: 16, className: "text-primary dark:text-accent-teal" }),
          /* @__PURE__ */ jsx("span", { children: "Free Trial (3 Images)" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm", children: [
          /* @__PURE__ */ jsx(Check, { size: 16, className: "text-primary dark:text-accent-teal" }),
          /* @__PURE__ */ jsx("span", { children: "Monthly Billing Available" })
        ] })
      ] })
    ] })
  ] });
};
var stdin_default = Pricing;
export {
  stdin_default as default
};
