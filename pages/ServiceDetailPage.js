import { jsx, jsxs } from "react/jsx-runtime";
import React, { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, CheckCircle, Clock3, Play, ShieldCheck, Sparkles } from "lucide-react";
import { siteData } from "../data.js";
import CoverMedia from "../components/CoverMedia.js";
import { buildPortfolioProjects } from "../components/portfolioUtils.js";
import { isLikelyVideoUrl } from "../components/mediaUtils.js";
const toTitle = (value) => String(value || "").split("-").filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const service = siteData.services.find((item) => item.id === serviceId);
  const portfolioProjects = useMemo(() => buildPortfolioProjects(siteData.projects, siteData.services), []);
  const relatedProjects = useMemo(() => {
    if (!service) return [];
    return portfolioProjects.filter((project) => project.categoryId === service.id);
  }, [portfolioProjects, service?.id]);
  const showcaseProjects = useMemo(() => {
    if (!service) return portfolioProjects.slice(0, 3);
    if (relatedProjects.length > 0) {
      return relatedProjects.slice(0, 3);
    }
    const sameSegmentProjects = portfolioProjects.filter((project) => project.serviceCategory === service.segment);
    if (sameSegmentProjects.length > 0) {
      return sameSegmentProjects.slice(0, 3);
    }
    return portfolioProjects.slice(0, 3);
  }, [portfolioProjects, relatedProjects, service?.segment]);
  const primaryPortfolioLink = showcaseProjects.length > 0 ? `/portfolio/${showcaseProjects[0].id}` : "/portfolio";
  const primaryPortfolioLabel = relatedProjects.length > 0 ? "View Related Case Study" : showcaseProjects.length > 0 ? "View Case Study" : "View Portfolio";
  const segmentLabel = toTitle(service && service.segment ? service.segment : "");
  const deliverableCount = Array.isArray(service && service.deliverables) ? service.deliverables.length : 0;
  const hasVideoShowcase = showcaseProjects.some((project) => project.hasVideo || isLikelyVideoUrl(project.coverImage));
  const breakdownPoints = [
    "AI-assisted first pass for speed and consistency.",
    "Senior retoucher quality pass aligned to your brand style guide.",
    "Final QC checklist before delivery to ensure channel readiness.",
    "Structured output packaging for direct ecommerce and marketplace publishing."
  ];
  if (!service) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/services", replace: true });
  }
  return /* @__PURE__ */ jsxs("section", { className: "relative py-20 md:py-24 bg-slate-50/70 dark:bg-slate-950 min-h-screen overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(15,102,216,0.12),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.12),transparent_65%)]" }),
    /* @__PURE__ */ jsxs("div", { className: "relative max-w-7xl mx-auto px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/services", className: "inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-accent-teal transition-colors mb-8", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
        "Back to Services"
      ] }),
      /* @__PURE__ */ jsxs("header", { className: "mb-8 md:mb-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "px-3 py-1 rounded-full border border-accent-teal/30 bg-accent-teal/10 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-teal", children: "Service Detail" }),
          /* @__PURE__ */ jsx("span", { className: "px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300", children: segmentLabel || "Service" }),
          hasVideoShowcase && /* @__PURE__ */ jsx("span", { className: "px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300", children: "Image + Motion Ready" })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4", children: service.title }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-600 dark:text-slate-300 text-lg leading-relaxed max-w-4xl", children: service.fullDescription })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid xl:grid-cols-[minmax(0,1fr)_330px] gap-8 mb-14 items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-xl", children: [
            /* @__PURE__ */ jsx(CoverMedia, { src: service.image, alt: service.title, className: "w-full h-full object-cover", parentClassName: "aspect-square", priority: true, sizes: "(max-width: 1280px) 100vw, 900px" }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" }),
            /* @__PURE__ */ jsxs("div", { className: "absolute left-4 right-4 bottom-4 flex items-end justify-between gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: service.tags.map((tag) => /* @__PURE__ */ jsx("span", { className: "px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300 border border-white/40", children: tag }, tag)) }),
              /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex flex-col items-end text-white text-xs font-bold uppercase tracking-[0.16em]", children: [
                /* @__PURE__ */ jsx("span", { className: "opacity-90", children: "Case Studies" }),
                /* @__PURE__ */ jsx("span", { className: "text-lg leading-none", children: relatedProjects.length })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 p-4", children: [
              /* @__PURE__ */ jsx("div", { className: "inline-flex p-2 rounded-lg bg-accent-teal/10 text-accent-teal mb-2", children: /* @__PURE__ */ jsx(Clock3, { size: 16 }) }),
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-slate-400 mb-1", children: "Typical SLA" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-700 dark:text-slate-200", children: "24-48 Hours" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 p-4", children: [
              /* @__PURE__ */ jsx("div", { className: "inline-flex p-2 rounded-lg bg-accent-gold/15 text-accent-gold mb-2", children: /* @__PURE__ */ jsx(ShieldCheck, { size: 16 }) }),
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-slate-400 mb-1", children: "Quality" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-700 dark:text-slate-200", children: "Human QA Pass" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 p-4", children: [
              /* @__PURE__ */ jsx("div", { className: "inline-flex p-2 rounded-lg bg-primary/10 text-primary mb-2", children: /* @__PURE__ */ jsx(Sparkles, { size: 16 }) }),
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-slate-400 mb-1", children: "Workflow" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-700 dark:text-slate-200", children: "AI + Artist" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 p-4", children: [
              /* @__PURE__ */ jsx("div", { className: "inline-flex p-2 rounded-lg bg-primary/10 text-primary mb-2", children: /* @__PURE__ */ jsx(CheckCircle, { size: 16 }) }),
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-slate-400 mb-1", children: "Deliverables" }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-slate-700 dark:text-slate-200", children: [
                deliverableCount,
                " items"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("article", { className: "bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-sm", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-slate-900 dark:text-white mb-4", children: "What Is Included" }),
              /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: service.deliverables.map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(CheckCircle, { size: 18, className: "text-primary dark:text-accent-teal mt-0.5 shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "text-slate-600 dark:text-slate-300", children: item })
              ] }, item)) })
            ] }),
            /* @__PURE__ */ jsxs("article", { className: "bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-sm", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-slate-900 dark:text-white mb-4", children: "Production Workflow" }),
              /* @__PURE__ */ jsx("ol", { className: "space-y-3", children: breakdownPoints.map((point, index) => /* @__PURE__ */ jsxs("li", { className: "rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 p-4", children: [
                /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-1", children: [
                  "Step ",
                  index + 1
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-slate-700 dark:text-slate-200", children: point })
              ] }, point)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("aside", { className: "space-y-4 xl:sticky xl:top-24", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900 dark:text-white mb-2", children: "Service Snapshot" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4", children: service.description }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
              /* @__PURE__ */ jsxs("p", { className: "flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500 dark:text-slate-400", children: "Segment" }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900 dark:text-slate-100", children: segmentLabel || "Service" })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500 dark:text-slate-400", children: "Case Studies" }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900 dark:text-slate-100", children: relatedProjects.length })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500 dark:text-slate-400", children: "Deliverables" }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900 dark:text-slate-100", children: deliverableCount })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900 dark:text-white mb-3", children: "Start This Service" }),
            /* @__PURE__ */ jsx(Link, { to: primaryPortfolioLink, "data-analytics-cta": "service_detail_primary_portfolio", "data-analytics-section": "service_detail_sidebar", className: "w-full h-12 inline-flex items-center justify-center rounded-xl bg-primary text-white font-bold hover:bg-slate-800 dark:hover:bg-accent-teal transition-all shadow-lg shadow-primary/20", children: primaryPortfolioLabel }),
            /* @__PURE__ */ jsx(Link, { to: "/free-trial", "data-analytics-cta": "service_detail_free_trial", "data-analytics-section": "service_detail_sidebar", className: "mt-3 w-full h-12 inline-flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal transition-all", children: "Start Free Trial" }),
            /* @__PURE__ */ jsx(Link, { to: "/contact", "data-analytics-cta": "service_detail_contact_cta", "data-analytics-section": "service_detail_sidebar", className: "mt-3 w-full h-12 inline-flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal transition-all", children: "Talk to Specialist" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6 gap-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-bold text-slate-900 dark:text-white", children: "Relevant Case Studies" }),
          /* @__PURE__ */ jsx(Link, { to: "/portfolio", "data-analytics-cta": "service_detail_view_all_portfolio", "data-analytics-section": "service_detail_case_studies", className: "text-sm font-bold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-accent-teal transition-colors", children: "View All Portfolio" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: showcaseProjects.map((project) => {
          const coverIsVideo = isLikelyVideoUrl(project.coverImage);
          return /* @__PURE__ */ jsxs(Link, { to: `/portfolio/${project.id}`, "data-analytics-cta": `service_detail_case_study_${project.id}`, "data-analytics-section": "service_detail_case_studies_grid", className: "group rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(CoverMedia, { src: project.coverImage, alt: project.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500", parentClassName: "aspect-[4/3]" }),
              (project.hasVideo || coverIsVideo) && /* @__PURE__ */ jsx("div", { className: "absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsx(Play, { size: 13, fill: "currentColor", className: "ml-0.5" }) })
            ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.18em] text-accent-teal truncate", children: project.categoryLabel }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400", children: project.deliveryTag })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 dark:text-white mb-1", children: project.title }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 mb-3", children: project.description }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-primary dark:text-accent-teal", children: [
              "View Case Study",
              /* @__PURE__ */ jsx(ArrowUpRight, { size: 14 })
            ] })
          ] })
        ] }, project.id);
        }) })
      ] })
    ] })
  ] });
};
var stdin_default = ServiceDetailPage;
export {
  stdin_default as default
};
