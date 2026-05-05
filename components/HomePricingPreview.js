import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Gem, Shirt, Zap } from "lucide-react";
import { siteData } from "../data.js";

const HomePricingPreview = () => {
  return /* @__PURE__ */ jsx("section", { id: "home-pricing", className: "py-24 bg-slate-50 dark:bg-slate-900 border-y border-black/5 dark:border-white/5", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-5", children: [
        /* @__PURE__ */ jsx(Zap, { size: 12, className: "text-accent-gold fill-accent-gold" }),
        "Quick Pricing Check"
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4", children: "Preview Rates Before You Book" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 dark:text-slate-400 max-w-3xl mx-auto text-base leading-relaxed", children: "Use this as a rough planning guide. Submit 3 files in the free trial and we will confirm quality plus exact pricing based on complexity." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto", children: siteData.pricing.map((category) => {
      const isJewelry = category.title.toLowerCase() === "jewelry";
      const basePrice = category.items[0]?.price || "Custom";
      return /* @__PURE__ */ jsxs("article", { className: "rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-7 shadow-sm hover:shadow-xl transition-all duration-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: `inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${isJewelry ? "bg-accent-gold/10 text-accent-gold" : "bg-accent-teal/10 text-accent-teal"}`, children: [
              isJewelry ? /* @__PURE__ */ jsx(Gem, { size: 12 }) : /* @__PURE__ */ jsx(Shirt, { size: 12 }),
              category.title
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: [
              "Starts at ",
              /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-900 dark:text-white", children: [
                basePrice,
                "/image"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Link, { to: "/pricing", "data-analytics-cta": isJewelry ? "home_pricing_full_table_jewelry" : "home_pricing_full_table_clothing", "data-analytics-section": "home_pricing_cards", className: "text-xs font-bold uppercase tracking-wider text-primary dark:text-accent-teal hover:underline", children: "Full Table" })
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3 mb-6", children: category.items.slice(0, 3).map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between gap-3 text-sm", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 text-slate-600 dark:text-slate-300", children: [
            /* @__PURE__ */ jsx(Check, { size: 15, className: "text-primary dark:text-accent-teal" }),
            item.name
          ] }),
          /* @__PURE__ */ jsx("strong", { className: "text-slate-900 dark:text-white", children: item.price })
        ] }, item.name)) }),
        /* @__PURE__ */ jsxs(Link, { to: "/free-trial", "data-analytics-cta": isJewelry ? "home_pricing_try_services_jewelry" : "home_pricing_try_services_clothing", "data-analytics-section": "home_pricing_cards", className: `w-full inline-flex items-center justify-center h-11 rounded-xl font-bold transition-colors ${isJewelry ? "bg-primary text-white hover:bg-slate-800 dark:hover:bg-accent-teal" : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700"}`, children: [
          "Try These Services",
          /* @__PURE__ */ jsx(ArrowRight, { size: 16, className: "ml-2" })
        ] })
      ] }, category.title);
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-wrap items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsx(Link, { to: "/pricing", "data-analytics-cta": "home_pricing_see_full", "data-analytics-section": "home_pricing_footer", className: "inline-flex items-center justify-center h-11 px-6 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors", children: "See Full Pricing" }),
      /* @__PURE__ */ jsx(Link, { to: "/contact", "data-analytics-cta": "home_pricing_custom_quote", "data-analytics-section": "home_pricing_footer", className: "inline-flex items-center justify-center h-11 px-6 rounded-full bg-primary text-white font-bold hover:bg-slate-800 dark:hover:bg-accent-teal transition-colors", children: "Request Custom Quote" })
    ] })
  ] }) });
};

var stdin_default = HomePricingPreview;
export {
  stdin_default as default
};
