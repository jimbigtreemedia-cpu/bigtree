import { jsx, jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, X } from "lucide-react";

const DISMISS_KEY = "snapiums-home-sticky-cta-dismissed";

const HomeStickyTrialCTA = () => {
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    try {
      setDismissed(window.sessionStorage.getItem(DISMISS_KEY) === "1");
    } catch (error) {
    }
  }, []);
  const dismiss = () => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch (error) {
    }
  };
  if (dismissed) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-x-4 bottom-4 z-[60] pointer-events-none", children: /* @__PURE__ */ jsxs("div", { className: "sticky-home-cta pointer-events-auto mx-auto max-w-4xl rounded-2xl border border-primary/30 dark:border-accent-teal/30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl shadow-primary/20", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold uppercase tracking-[0.2em] text-accent-teal mb-2", children: [
          /* @__PURE__ */ jsx(Sparkles, { size: 12, className: "inline mr-1.5" }),
          "Ready to Test Quality?"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed", children: "Upload up to 3 files and get a conversion-ready sample edit before you commit." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/free-trial", "data-analytics-cta": "home_sticky_free_trial", "data-analytics-section": "home_sticky", className: "inline-flex items-center justify-center h-10 px-4 rounded-full bg-primary text-white text-sm font-bold hover:bg-slate-800 dark:hover:bg-accent-teal transition-colors", children: [
          "Start Free Trial",
          /* @__PURE__ */ jsx(ArrowRight, { size: 14, className: "ml-1.5" })
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/contact", "data-analytics-cta": "home_sticky_talk_to_team", "data-analytics-section": "home_sticky", className: "inline-flex items-center justify-center h-10 px-4 rounded-full border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors", children: "Talk to Team" }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: dismiss, className: "inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors", "aria-label": "Dismiss trial prompt", children: /* @__PURE__ */ jsx(X, { size: 16 }) })
      ] })
    ] })
  ] }) });
};

var stdin_default = HomeStickyTrialCTA;
export {
  stdin_default as default
};
