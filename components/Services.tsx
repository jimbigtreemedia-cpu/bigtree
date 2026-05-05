import { jsx, jsxs } from "react/jsx-runtime";

import React from "react";
import { Link } from "react-router-dom";
import { Camera, Shirt, Sparkles, Video, Workflow, Gem, ArrowRight, Palette, UserRound, Megaphone } from "lucide-react";
import { siteData } from "../data";
import CoverMedia from "./CoverMedia";
const iconMap = {
  camera:  <Camera size={28} />,
  shirt:  <Shirt size={28} />,
  sparkles:  <Sparkles size={28} />,
  video:  <Video size={28} />,
  workflow:  <Workflow size={28} />,
  diamond:  <Gem size={28} />,
  palette:  <Palette size={28} />,
  "user-round":  <UserRound size={28} />,
  megaphone:  <Megaphone size={28} />
};
const sectionCopy = {
  clothing: {
    eyebrow: "Clothing Services",
    title: "Clothing Photo Editing Services for Ecommerce Growth",
    description: "Professional clothing photo editing, ghost mannequin retouching, and model content production for fashion brands that need faster launches, lower production costs, and conversion-ready visuals."
  },
  jewelry: {
    eyebrow: "Jewelry Services",
    title: "Jewelry Retouching and Content Services for Luxury Brands",
    description: "High-end jewelry image retouching, color variant editing, model composites, and social-ready content built to increase trust, highlight craftsmanship, and improve product page performance."
  }
};
const segmentOrder = ["clothing", "jewelry"];
const ServiceCard = ({ service }) => {
  const iconTone = service.segment === "jewelry" ? "bg-accent-gold/10 text-accent-gold" : "bg-accent-teal/10 text-accent-teal";
  return  jsxs(Link, { to: `/services/${service.id}`, "data-analytics-cta": `services_card_${service.id}`, "data-analytics-section": "services_grid", className: "group p-8 rounded-3xl bg-white dark:bg-slate-900 premium-border dark:border dark:border-slate-800 soft-shadow hover:-translate-y-1 transition-all duration-300 flex flex-col", children: [
     jsxs("div", { className: "relative w-full mb-8 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 aspect-square", children: [
       <CoverMedia src={service.image || "https://picsum.photos/400/400"} alt={service.title} parentClassName="absolute inset-0 w-full h-full" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />,
      service.tags && service.tags.length > 0 &&  jsx("div", { className: "absolute bottom-4 left-4 flex gap-2 flex-wrap z-20", children:  jsx("span", { className: "bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-tighter", children: service.tags[0] }) })
    ] }),
     jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
       jsx("div", { className: `p-2 rounded-lg ${iconTone}`, children: iconMap[service.icon] || iconMap.camera }),
       jsx("h3", { className: "text-xl font-bold text-slate-900 dark:text-white", children: service.title })
    ] }),
     jsx("p", { className: "text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 flex-grow", children: service.description }),
     jsxs("div", { className: "w-full py-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold group-hover:bg-primary group-hover:text-white group-hover:border-primary dark:group-hover:border-primary transition-all flex items-center justify-center gap-2", children: [
       <ArrowRight size={18} />,
      "View Service Details"
    ] })
  ] });
};
const Services = () => {
  const groupedServices = segmentOrder.map((segment) => ({
    segment,
    ...sectionCopy[segment],
    items: siteData.services.filter((service) => service.segment === segment)
  })).filter((section) => section.items.length > 0);
  return  jsx("section", { className: "py-32 bg-background-base dark:bg-slate-950 scroll-mt-28", id: "services", children:  jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-8", children: [
     jsxs("div", { className: "text-center mb-20", children: [
       jsx("h2", { className: "text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6", children: "Clothing and Jewelry Image Editing Services" }),
       jsx("p", { className: "text-slate-500 dark:text-slate-400 max-w-4xl mx-auto text-lg leading-relaxed", children: "Snapiums delivers SEO-focused ecommerce visuals for fashion and jewelry brands, combining AI speed with expert retouching quality to improve product discovery, click-through rates, and conversion performance." })
    ] }),
    groupedServices.map((section) =>  jsxs("article", { className: "mb-20 last:mb-0", children: [
       jsxs("div", { className: "mb-8 md:mb-10", children: [
         jsx("p", { className: `text-xs font-bold uppercase tracking-[0.2em] mb-2 ${section.segment === "jewelry" ? "text-accent-gold" : "text-accent-teal"}`, children: section.eyebrow }),
         jsx("h3", { className: "text-3xl md:text-4xl font-bold text-slate-900 dark:text-white", children: section.title }),
         jsx("p", { className: "mt-4 text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-4xl", children: section.description })
      ] }),
       jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8", children: section.items.map((service) =>  jsx(ServiceCard, { service }, service.id)) })
    ] }, section.segment))
  ] }) });
};
export default Services;
