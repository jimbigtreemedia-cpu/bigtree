
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";

const quickLinks = [
  { label: "Go Home", to: "/" },
  { label: "View Services", to: "/services" },
  { label: "Contact Team", to: "/contact" }
];

const NotFoundPage = () => {
  return  jsx("section", { className: "relative min-h-[70vh] flex items-center py-24 bg-background-base dark:bg-slate-950", children:  jsxs("div", { className: "max-w-4xl mx-auto px-6 lg:px-8 text-center", children: [
     jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 dark:bg-accent-teal/10 text-primary dark:text-accent-teal mb-6", children:  <Compass size={30} /> }),
     jsx("p", { className: "text-xs font-bold uppercase tracking-[0.2em] text-accent-teal mb-3", children: "Error 404" }),
     jsx("h1", { className: "text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4", children: "Page Not Found" }),
     jsx("p", { className: "text-slate-600 dark:text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto mb-10", children: "The page you are looking for does not exist or may have moved. Use one of the links below to continue browsing Snapiums." }),
     jsxs("div", { className: "flex flex-wrap justify-center gap-3", children: [
      quickLinks.map((link, index) =>  jsxs(Link, { to: link.to, "data-analytics-cta": `not_found_quick_link_${index + 1}`, "data-analytics-section": "not_found", className: `inline-flex items-center justify-center h-12 px-6 rounded-full font-bold transition-all ${index === 0 ? "bg-primary text-white hover:bg-slate-800 dark:hover:bg-accent-teal" : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"}`, children: [
        index === 0 &&  <ArrowLeft size={18} className="mr-2" />,
        link.label
      ] }, link.to))
    ] })
  ] }) });
};

export default NotFoundPage;
