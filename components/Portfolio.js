import { jsx as _jsx } from "react/jsx-runtime";
import { jsx, jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PlayCircle, ExternalLink } from "lucide-react";
import { siteData } from "../data";
import CoverMedia from "./CoverMedia";
import { isLikelyVideoUrl } from "./mediaUtils";
const Portfolio = () => {
    const [filter, setFilter] = useState("all");
    const categories = useMemo(() => [
        { id: "all", label: "All Work" },
        ...Array.from(new Set(siteData.projects.map((project) => project.category))).map((category) => ({
            id: category,
            label: category.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
        }))
    ], []);
    const filteredProjects = filter === "all" ? siteData.projects : siteData.projects.filter((project) => project.category === filter);
    return jsx("section", { className: "py-32 bg-white dark:bg-slate-950 scroll-mt-28", id: "portfolio", children: jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-8", children: [
                jsxs("div", { className: "text-center mb-16", children: [
                        jsx("h2", { className: "text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6", children: "Master Portfolio Grid" }),
                        jsx("p", { className: "text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12", children: "Witness the world-class quality our expert agency delivers for global luxury brands." }),
                        jsx("div", { className: "flex flex-wrap justify-center gap-3 mb-16", children: categories.map((category) => jsx("button", { onClick: () => setFilter(category.id), className: `px-8 py-2.5 rounded-full text-sm font-bold transition-all ${filter === category.id ? "bg-primary text-white shadow-lg shadow-primary/10" : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"}`, children: category.label }, category.id)) })
                    ] }),
                jsx("div", { className: "columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8", children: filteredProjects.map((project) => {
                        const coverIsVideo = isLikelyVideoUrl(project.coverImage);
                        const hasVideoMedia = coverIsVideo || String(project.type || "").toLowerCase() === "video" || String(project.type || "").toLowerCase() === "mixed" || Array.isArray(project.videos) && project.videos.length > 0;
                        return jsxs(Link, { to: `/portfolio/${project.id}`, "data-analytics-cta": `portfolio_card_${project.id}`, "data-analytics-section": "portfolio_grid", className: "relative block group overflow-hidden rounded-3xl soft-shadow break-inside-avoid premium-border dark:border dark:border-slate-800 cursor-pointer bg-slate-100 dark:bg-slate-900", children: [
                                _jsx(CoverMedia, { src: project.coverImage, alt: project.title, className: "w-full object-cover transition-transform duration-1000 group-hover:scale-110" }),
                                hasVideoMedia && jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none z-20", children: jsx("div", { className: "w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl", children: _jsx(PlayCircle, { size: 32, fill: "currentColor", className: "opacity-90" }) }) }),
                                jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 z-20", children: jsxs("div", { className: "flex justify-between items-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500", children: [
                                            jsxs("div", { children: [
                                                    jsx("p", { className: "text-[10px] font-bold text-accent-teal uppercase tracking-[0.2em] mb-2", children: project.category.replace(/-/g, " ") }),
                                                    jsx("h4", { className: "text-white font-bold text-xl", children: project.title })
                                                ] }),
                                            jsx("div", { className: "w-12 h-12 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center text-white border border-white/30 hover:bg-white/30 transition-colors", children: _jsx(ExternalLink, { size: 20 }) })
                                        ] }) })
                            ] }, project.id);
                    }) })
            ] }) });
};
export default Portfolio;
