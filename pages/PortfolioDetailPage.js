import { jsx, jsxs } from "react/jsx-runtime";
import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Film, Image as ImageIcon, Keyboard, Play, Sparkles, ZoomIn, ZoomOut } from "lucide-react";
import { siteData } from "../data.js";
import ImageWithLoader from "../components/ImageWithLoader.js";
import CoverMedia from "../components/CoverMedia.js";
import { buildPortfolioProjects } from "../components/portfolioUtils.js";
import { inferMediaTypeFromUrl, isLikelyVideoUrl } from "../components/mediaUtils.js";
const PortfolioDetailPage = () => {
  const { projectId } = useParams();
  const portfolioProjects = useMemo(() => buildPortfolioProjects(siteData.projects, siteData.services), []);
  const project = useMemo(() => portfolioProjects.find((item) => item.id === projectId), [portfolioProjects, projectId]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const allMedia = useMemo(() => {
    if (!project) return [];
    const images = project.images.map((url) => ({ type: "image", url }));
    const videos = project.videos.map((url) => ({ type: "video", url }));
    if (images.length === 0 && videos.length === 0) {
      return [{ type: inferMediaTypeFromUrl(project.coverImage, "image"), url: project.coverImage }];
    }
    return [...images, ...videos];
  }, [project]);
  useEffect(() => {
    setCurrentMediaIndex(0);
    setZoomLevel(1);
  }, [projectId]);
  useEffect(() => {
    if (currentMediaIndex > allMedia.length - 1) {
      setCurrentMediaIndex(Math.max(allMedia.length - 1, 0));
    }
  }, [allMedia.length, currentMediaIndex]);
  const currentMedia = allMedia[currentMediaIndex] || allMedia[0];
  const isImageMedia = currentMedia && currentMedia.type === "image";
  const imageCount = allMedia.filter((media) => media.type === "image").length;
  const videoCount = allMedia.filter((media) => media.type === "video").length;
  const goToMedia = (index) => {
    setCurrentMediaIndex(index);
    setZoomLevel(1);
  };
  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      goToMedia(currentMediaIndex - 1);
    }
  };
  const nextMedia = () => {
    if (currentMediaIndex < allMedia.length - 1) {
      goToMedia(currentMediaIndex + 1);
    }
  };
  const handleZoom = (direction) => {
    setZoomLevel((previous) => {
      const nextValue = direction === "in" ? previous + 0.25 : previous - 0.25;
      return Math.min(Math.max(nextValue, 0.6), 3);
    });
  };
  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target;
      const tagName = target && target.tagName ? String(target.tagName).toLowerCase() : "";
      const isEditable = tagName === "input" || tagName === "textarea" || tagName === "select" || target && target.isContentEditable;
      if (isEditable) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        prevMedia();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextMedia();
        return;
      }
      if (!isImageMedia) return;
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        handleZoom("in");
        return;
      }
      if (event.key === "-") {
        event.preventDefault();
        handleZoom("out");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentMediaIndex, allMedia.length, isImageMedia]);
  const relatedProjects = useMemo(() => {
    if (!project) return [];
    const sameCategory = portfolioProjects.filter((item) => item.categoryId === project.categoryId && item.id !== project.id);
    const fallback = portfolioProjects.filter((item) => item.id !== project.id && item.categoryId !== project.categoryId);
    return [...sameCategory, ...fallback].slice(0, 3);
  }, [portfolioProjects, project?.categoryId, project?.id]);
  if (!project || !currentMedia) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/portfolio", replace: true });
  }
  return /* @__PURE__ */ jsxs("section", { className: "relative py-20 md:py-24 bg-slate-50/60 dark:bg-slate-950 min-h-screen", children: [
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(15,102,216,0.12),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.12),transparent_65%)]" }),
    /* @__PURE__ */ jsxs("div", { className: "relative max-w-7xl mx-auto px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/portfolio", className: "inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-accent-teal transition-colors mb-8", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
        "Back to Portfolio"
      ] }),
      /* @__PURE__ */ jsxs("header", { className: "mb-8 md:mb-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "px-3 py-1 rounded-full border border-accent-teal/30 bg-accent-teal/10 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-teal", children: "Case Study" }),
          /* @__PURE__ */ jsx("span", { className: "px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300", children: project.categoryLabel }),
          /* @__PURE__ */ jsx("span", { className: "px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300", children: project.deliveryTag }),
          /* @__PURE__ */ jsxs("span", { className: "px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300", children: [
            project.mediaCount,
            " Assets"
          ] })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4", children: project.title }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed", children: project.description })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid xl:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start mb-14", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-3xl overflow-hidden border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 flex items-center justify-center shrink-0", children: currentMedia.type === "video" ? /* @__PURE__ */ jsx(Film, { size: 15 }) : /* @__PURE__ */ jsx(ImageIcon, { size: 15 }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-700 dark:text-slate-100 truncate", children: project.categoryLabel }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 truncate", children: project.serviceCategoryLabel })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right shrink-0", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold uppercase tracking-wide text-slate-400", children: [
                currentMediaIndex + 1,
                " / ",
                allMedia.length
              ] }),
              /* @__PURE__ */ jsx("p", { className: "hidden sm:block text-[11px] text-slate-400 dark:text-slate-500 mt-0.5", children: "Use left and right arrow keys" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-center min-h-[58vh] sm:min-h-[64vh] p-4 sm:p-6 lg:p-8 overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950", children: [
            /* @__PURE__ */ jsx("button", { onClick: prevMedia, disabled: currentMediaIndex === 0, className: "absolute left-4 z-20 p-3 rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 shadow-lg text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-all", "aria-label": "Previous media", children: /* @__PURE__ */ jsx(ChevronLeft, { size: 22 }) }),
            /* @__PURE__ */ jsx("button", { onClick: nextMedia, disabled: currentMediaIndex === allMedia.length - 1, className: "absolute right-4 z-20 p-3 rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 shadow-lg text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-all", "aria-label": "Next media", children: /* @__PURE__ */ jsx(ChevronRight, { size: 22 }) }),
            /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: currentMedia.type === "image" ? /* @__PURE__ */ jsx(ImageWithLoader, { src: currentMedia.url, alt: project.title, className: "max-h-[72vh] max-w-full object-contain drop-shadow-xl", style: { transform: `scale(${zoomLevel})`, transition: "transform 0.2s ease-out" }, parentClassName: "bg-transparent flex items-center justify-center", priority: true, sizes: "100vw" }) : /* @__PURE__ */ jsx("video", { src: currentMedia.url, controls: true, autoPlay: true, className: "max-h-[72vh] max-w-full object-contain rounded-xl bg-black drop-shadow-xl" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white/95 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 sm:px-6 py-4 flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => handleZoom("in"), disabled: !isImageMedia, className: "p-2 rounded-lg text-slate-500 dark:text-slate-400 border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed", title: "Zoom In", children: /* @__PURE__ */ jsx(ZoomIn, { size: 20 }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => handleZoom("out"), disabled: !isImageMedia, className: "p-2 rounded-lg text-slate-500 dark:text-slate-400 border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed", title: "Zoom Out", children: /* @__PURE__ */ jsx(ZoomOut, { size: 20 }) }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-500 dark:text-slate-400", children: isImageMedia ? `${Math.round(zoomLevel * 100)}% zoom` : "Video mode" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500", children: [
                imageCount,
                " Images | ",
                videoCount,
                " Videos"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex gap-3 overflow-x-auto hide-scrollbar pb-1", children: allMedia.map((media, index) => /* @__PURE__ */ jsx("button", { onClick: () => goToMedia(index), className: `relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 border ${index === currentMediaIndex ? "ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-105 border-primary/40 opacity-100" : "border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100 hover:scale-105"}`, children: media.type === "video" ? /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full bg-slate-900 flex items-center justify-center", children: [
              /* @__PURE__ */ jsx(Film, { size: 18, className: "text-white/75" }),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "w-7 h-7 rounded-full bg-white/90 text-slate-900 flex items-center justify-center", children: /* @__PURE__ */ jsx(Play, { size: 12, fill: "currentColor", className: "ml-0.5" }) }) })
            ] }) : /* @__PURE__ */ jsx(ImageWithLoader, { src: media.url, className: "w-full h-full object-cover", alt: "thumb" }) }, `${media.url}-${index}`)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("aside", { className: "xl:sticky xl:top-24 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsx(Sparkles, { size: 16, className: "text-primary dark:text-accent-teal" }),
              /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-slate-900 dark:text-white", children: "Project Overview" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600 dark:text-slate-300 leading-relaxed", children: project.description }),
            /* @__PURE__ */ jsxs("div", { className: "mt-5 grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1", children: "Service" }),
                project.hasMappedService ? /* @__PURE__ */ jsx(Link, { to: `/services/${project.categoryId}`, className: "text-sm font-semibold text-primary hover:text-slate-800 dark:hover:text-accent-teal transition-colors", children: project.categoryLabel }) : /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800 dark:text-slate-100", children: project.categoryLabel })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1", children: "Category" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800 dark:text-slate-100", children: project.serviceCategoryLabel })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1", children: "Delivery" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800 dark:text-slate-100", children: project.deliveryLabel })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1", children: "Assets" }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-slate-800 dark:text-slate-100", children: [
                  project.mediaCount,
                  " files"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900 dark:text-white mb-3", children: "Project Actions" }),
            /* @__PURE__ */ jsx(Link, { to: "/contact", "data-analytics-cta": "portfolio_detail_discuss_project", "data-analytics-section": "portfolio_detail_sidebar", className: "w-full h-11 inline-flex items-center justify-center rounded-xl bg-primary text-white font-bold hover:bg-slate-800 dark:hover:bg-accent-teal transition-all shadow-lg shadow-primary/20", children: "Discuss Similar Project" }),
            project.hasMappedService && /* @__PURE__ */ jsx(Link, { to: `/services/${project.categoryId}`, className: "mt-3 w-full h-11 inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal transition-colors", children: "View Service Details" }),
            /* @__PURE__ */ jsx(Link, { to: "/portfolio", className: "mt-3 w-full h-11 inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal transition-colors", children: "Browse Full Portfolio" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsx(Keyboard, { size: 15, className: "text-slate-500 dark:text-slate-300" }),
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-900 dark:text-white", children: "Keyboard Shortcuts" })
            ] }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-slate-600 dark:text-slate-300", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsx("span", { children: "Navigate media" }),
                /* @__PURE__ */ jsx("kbd", { className: "px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold", children: "Left / Right" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsx("span", { children: "Zoom image in" }),
                /* @__PURE__ */ jsx("kbd", { className: "px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold", children: "+" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsx("span", { children: "Zoom image out" }),
                /* @__PURE__ */ jsx("kbd", { className: "px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold", children: "-" })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mb-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6 gap-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-bold text-slate-900 dark:text-white", children: "Related Work" }),
          /* @__PURE__ */ jsx(Link, { to: "/contact", "data-analytics-cta": "portfolio_detail_discuss_project", "data-analytics-section": "portfolio_detail_related_work", className: "text-sm font-bold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-accent-teal transition-colors", children: "Discuss Your Project" })
        ] }),
        relatedProjects.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: relatedProjects.map((related) => {
          const coverIsVideo = isLikelyVideoUrl(related.coverImage);
          return /* @__PURE__ */ jsxs(Link, { to: `/portfolio/${related.id}`, "data-analytics-cta": `portfolio_detail_related_${related.id}`, "data-analytics-section": "portfolio_detail_related_grid", className: "group rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(CoverMedia, { src: related.coverImage, alt: related.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500", parentClassName: "aspect-[4/3]" }),
              (related.hasVideo || coverIsVideo) && /* @__PURE__ */ jsx("div", { className: "absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsx(Play, { size: 13, fill: "currentColor", className: "ml-0.5" }) })
            ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 mb-2", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.18em] text-accent-teal truncate", children: related.categoryLabel }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500", children: related.deliveryTag })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 dark:text-white mb-1", children: related.title }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: related.description })
          ] })
        ] }, related.id);
        }) }) : /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-slate-500 dark:text-slate-400", children: "No additional related work yet. Explore the full portfolio for more examples." }) })
      ] })
    ] })
  ] });
};
var stdin_default = PortfolioDetailPage;
export {
  stdin_default as default
};
