import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { Link } from "react-router-dom";
const LAST_UPDATED = "February 14, 2026";
const Legal = ({ type }) => {
  const isPrivacy = type === "privacy";
  const title = isPrivacy ? "Privacy Policy" : "Terms of Service";
  return /* @__PURE__ */ jsx("section", { className: "py-32 bg-background-base dark:bg-slate-950 border-t border-black/5 dark:border-white/5", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4", children: "Legal" }),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3", children: title }),
      /* @__PURE__ */ jsxs("p", { className: "text-slate-500 dark:text-slate-400", children: [
        "Last updated: ",
        LAST_UPDATED
      ] })
    ] }),
    /* @__PURE__ */ jsx("article", { className: "space-y-8 bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 premium-border dark:border dark:border-slate-800 soft-shadow text-slate-600 dark:text-slate-300 leading-relaxed", children: isPrivacy ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-slate-900 dark:text-white mb-2", children: "1. Information We Collect" }),
        /* @__PURE__ */ jsx("p", { children: "We collect information that you provide directly to us, including when you fill out forms, request a quote, upload trial files, or contact our team. This may include your name, email address, and project instructions." })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-slate-900 dark:text-white mb-2", children: "2. How We Use Your Information" }),
        /* @__PURE__ */ jsx("p", { children: "We use this information to deliver services, communicate project updates, provide support, and improve quality. We do not sell your personal information." })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-slate-900 dark:text-white mb-2", children: "3. File Security and Retention" }),
        /* @__PURE__ */ jsx("p", { children: "Client assets are handled under strict confidentiality controls. We retain files only as long as needed for service delivery and agreed support windows." })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-slate-900 dark:text-white mb-2", children: "4. Contact" }),
        /* @__PURE__ */ jsx("p", { children: 'For privacy questions or data requests, contact us via the contact page and include "Privacy Request" in your message.' })
      ] })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-slate-900 dark:text-white mb-2", children: "1. Acceptance of Terms" }),
        /* @__PURE__ */ jsx("p", { children: "By accessing or using our services, you agree to these Terms of Service. If you do not agree, do not use the service." })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-slate-900 dark:text-white mb-2", children: "2. Service Scope" }),
        /* @__PURE__ */ jsx("p", { children: "Snapiums provides image editing and AI-assisted post-production services. Final deliverables, timelines, and revisions are defined by the selected package or written quote." })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-slate-900 dark:text-white mb-2", children: "3. Intellectual Property" }),
        /* @__PURE__ */ jsx("p", { children: "You retain ownership of source files you provide. You grant us a limited license to process those files only for service delivery." })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-slate-900 dark:text-white mb-2", children: "4. Liability and Changes" }),
        /* @__PURE__ */ jsx("p", { children: "We may update service terms periodically. Continued use after updates constitutes acceptance of the revised terms." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col sm:flex-row gap-4", children: [
      /* @__PURE__ */ jsx(Link, { to: "/contact", "data-analytics-cta": "legal_contact_us", "data-analytics-section": "legal_footer", className: "flex-1 h-12 flex items-center justify-center rounded-xl bg-primary text-white font-bold hover:bg-slate-800 dark:hover:bg-accent-teal transition-all shadow-lg shadow-primary/20", children: "Contact Us" }),
      /* @__PURE__ */ jsx(Link, { to: "/", "data-analytics-cta": "legal_back_home", "data-analytics-section": "legal_footer", className: "flex-1 h-12 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all", children: "Back Home" })
    ] })
  ] }) });
};
var stdin_default = Legal;
export {
  stdin_default as default
};
