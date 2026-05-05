import { jsx, jsxs } from "react/jsx-runtime";

import React, { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, CheckCircle, Clock3, Play, ShieldCheck, Sparkles } from "lucide-react";
import { siteData } from "../data";
import CoverMedia from "../components/CoverMedia";
import { buildPortfolioProjects } from "../components/portfolioUtils";
import { isLikelyVideoUrl } from "../components/mediaUtils";
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
    return  <Navigate to="/services" replace />;
  }
  return  jsxs("section", { className: "relative py-20 md:py-24 bg-slate-50/70 dark:bg-slate-950 min-h-screen overflow-hidden", children: [
     jsx("div", { className: "pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(15,102,216,0.12),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.12),transparent_65%)]" }),
     jsxs("div", { className: "relative max-w-7xl mx-auto px-6 lg:px-8", children: [
       jsxs(Link, { to: "/services", className: "inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-accent-teal transition-colors mb-8", children: [
         <ArrowLeft size={16} />,
        "Back to Services"
      ] }),
       jsxs("header", { className: "mb-8 md:mb-10", children: [
         jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-4", children: [
           jsx("span", { className: "px-3 py-1 rounded-full border border-accent-teal/30 bg-accent-teal/10 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-teal", children: "Service Detail" }),
           jsx("span", { className: "px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300", children: segmentLabel || "Service" }),
          hasVideoShowcase &&  jsx("span", { className: "px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300", children: "Image + Motion Ready" })
        ] }),
         jsx("h1", { className: "text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4", children: service.title }),
         jsx("p", { className: "text-slate-600 dark:text-slate-300 text-lg leading-relaxed max-w-4xl", children: service.fullDescription })
      ] }),
       jsxs("div", { className: "grid xl:grid-cols-[minmax(0,1fr)_330px] gap-8 mb-14 items-start", children: [
         jsxs("div", { className: "space-y-6", children: [
           jsxs("div", { className: "relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-xl", children: [
             <CoverMedia src={service.image} alt={service.title} className="w-full h-full object-cover" parentClassName="aspect-square" priority sizes="(max-width: 1280px) 100vw" />,
             jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" }),
             jsxs("div", { className: "absolute left-4 right-4 bottom-4 flex items-end justify-between gap-4", children: [
               jsx("div", { className: "flex flex-wrap gap-2", children: service.tags.map((tag) =>  jsx("span", { className: "px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300 border border-white/40", children: tag }, tag)) }),
               jsxs("div", { className: "hidden sm:flex flex-col items-end text-white text-xs font-bold uppercase tracking-[0.16em]", children: [
                 jsx("span", { className: "opacity-90", children: "Case Studies" }),
                 jsx("span", { className: "text-lg leading-none", children: relatedProjects.length })
              ] })
            ] })
          ] }),
           jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-3", children: [
             jsxs("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 p-4", children: [
               jsx("div", { className: "inline-flex p-2 rounded-lg bg-accent-teal/10 text-accent-teal mb-2", children:  <Clock3 size={16} /> }),
               jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-slate-400 mb-1", children: "Typical SLA" }),
               jsx("p", { className: "text-sm font-semibold text-slate-700 dark:text-slate-200", children: "24-48 Hours" })
            ] }),
             jsxs("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 p-4", children: [
               jsx("div", { className: "inline-flex p-2 rounded-lg bg-accent-gold/15 text-accent-gold mb-2", children:  <ShieldCheck size={16} /> }),
               jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-slate-400 mb-1", children: "Quality" }),
               jsx("p", { className: "text-sm font-semibold text-slate-700 dark:text-slate-200", children: "Human QA Pass" })
            ] }),
             jsxs("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 p-4", children: [
               jsx("div", { className: "inline-flex p-2 rounded-lg bg-primary/10 text-primary mb-2", children:  <Sparkles size={16} /> }),
               jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-slate-400 mb-1", children: "Workflow" }),
               jsx("p", { className: "text-sm font-semibold text-slate-700 dark:text-slate-200", children: "AI + Artist" })
            ] }),
             jsxs("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 p-4", children: [
               jsx("div", { className: "inline-flex p-2 rounded-lg bg-primary/10 text-primary mb-2", children:  <CheckCircle size={16} /> }),
               jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-slate-400 mb-1", children: "Deliverables" }),
               jsxs("p", { className: "text-sm font-semibold text-slate-700 dark:text-slate-200", children: [
                deliverableCount,
                " items"
              ] })
            ] })
          ] }),
           jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
             jsxs("article", { className: "bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-sm", children: [
               jsx("h2", { className: "text-2xl font-bold text-slate-900 dark:text-white mb-4", children: "What Is Included" }),
               jsx("ul", { className: "space-y-3", children: service.deliverables.map((item) =>  jsxs("li", { className: "flex items-start gap-3", children: [
                 <CheckCircle size={18} className="text-primary dark:text-accent-teal mt-0.5 shrink-0" />,
                 jsx("span", { className: "text-slate-600 dark:text-slate-300", children: item })
              ] }, item)) })
            ] }),
             jsxs("article", { className: "bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-sm", children: [
               jsx("h2", { className: "text-2xl font-bold text-slate-900 dark:text-white mb-4", children: "Production Workflow" }),
               jsx("ol", { className: "space-y-3", children: breakdownPoints.map((point, index) =>  jsxs("li", { className: "rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 p-4", children: [
                 jsxs("p", { className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-1", children: [
                  "Step ",
                  index + 1
                ] }),
                 jsx("p", { className: "text-slate-700 dark:text-slate-200", children: point })
              ] }, point)) })
            ] })
          ] })
        ] }),
         jsxs("aside", { className: "space-y-4 xl:sticky xl:top-24", children: [
           jsxs("div", { className: "rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-6", children: [
             jsx("h3", { className: "text-lg font-bold text-slate-900 dark:text-white mb-2", children: "Service Snapshot" }),
             jsx("p", { className: "text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4", children: service.description }),
             jsxs("div", { className: "space-y-2 text-sm", children: [
               jsxs("p", { className: "flex items-center justify-between gap-3", children: [
                 jsx("span", { className: "text-slate-500 dark:text-slate-400", children: "Segment" }),
                 jsx("span", { className: "font-semibold text-slate-900 dark:text-slate-100", children: segmentLabel || "Service" })
              ] }),
               jsxs("p", { className: "flex items-center justify-between gap-3", children: [
                 jsx("span", { className: "text-slate-500 dark:text-slate-400", children: "Case Studies" }),
                 jsx("span", { className: "font-semibold text-slate-900 dark:text-slate-100", children: relatedProjects.length })
              ] }),
               jsxs("p", { className: "flex items-center justify-between gap-3", children: [
                 jsx("span", { className: "text-slate-500 dark:text-slate-400", children: "Deliverables" }),
                 jsx("span", { className: "font-semibold text-slate-900 dark:text-slate-100", children: deliverableCount })
              ] })
            ] })
          ] }),
           jsxs("div", { className: "rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-6", children: [
             jsx("h3", { className: "text-lg font-bold text-slate-900 dark:text-white mb-3", children: "Start This Service" }),
             <Link to={primaryPortfolioLink} className="w-full h-12 inline-flex items-center justify-center rounded-xl bg-primary text-white font-bold hover:bg-slate-800 dark:hover:bg-accent-teal transition-all shadow-lg shadow-primary/20" children={primaryPortfolioLabel} />,
             <Link to="/free-trial" className="mt-3 w-full h-12 inline-flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal transition-all" children="Start Free Trial" />,
             <Link to="/contact" className="mt-3 w-full h-12 inline-flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal transition-all" children="Talk to Specialist" />
          ] })
        ] })
      ] }),
       jsxs("section", { children: [
         jsxs("div", { className: "flex items-center justify-between mb-6 gap-4", children: [
           jsx("h2", { className: "text-2xl md:text-3xl font-bold text-slate-900 dark:text-white", children: "Relevant Case Studies" }),
           <Link to="/portfolio" className="text-sm font-bold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-accent-teal transition-colors" children="View All Portfolio" />
        ] }),
         jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: showcaseProjects.map((project) => {
          const coverIsVideo = isLikelyVideoUrl(project.coverImage);
          return  jsxs(Link, { to: `/portfolio/${project.id}`, "data-analytics-cta": `service_detail_case_study_${project.id}`, "data-analytics-section": "service_detail_case_studies_grid", className: "group rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all", children: [
             jsxs("div", { className: "relative", children: [
               <CoverMedia src={project.coverImage} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" parentClassName="aspect-[4/3]" />,
              (project.hasVideo || coverIsVideo) &&  jsx("div", { className: "absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg", children:  <Play size={13} fill="currentColor" className="ml-0.5" /> })
            ] }),
           jsxs("div", { className: "p-5", children: [
             jsxs("div", { className: "mb-2 flex items-center justify-between gap-2", children: [
               jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.18em] text-accent-teal truncate", children: project.categoryLabel }),
               jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400", children: project.deliveryTag })
            ] }),
             jsx("h3", { className: "font-bold text-slate-900 dark:text-white mb-1", children: project.title }),
             jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 mb-3", children: project.description }),
             jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-primary dark:text-accent-teal", children: [
              "View Case Study",
               <ArrowUpRight size={14} />
            ] })
          ] })
        ] }, project.id);
        }) })
      ] })
    ] })
  ] });
};
export default ServiceDetailPage;
