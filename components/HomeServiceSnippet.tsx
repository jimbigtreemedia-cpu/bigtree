import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Gem, Shirt } from "lucide-react";
import { siteData } from "../data";
const HomeServiceSnippet = () => {
  const clothing = siteData.services.filter(service => service.segment === "clothing").slice(0, 3);
  const jewelry = siteData.services.filter(service => service.segment === "jewelry").slice(0, 3);
  const featuredServices = [...clothing, ...jewelry];
  return jsx("section", {
    id: "home-services",
    className: "py-24 bg-white dark:bg-slate-950 border-y border-black/5 dark:border-white/5",
    children: jsxs("div", {
      className: "max-w-7xl mx-auto px-6 lg:px-8",
      children: [jsxs("div", {
        className: "flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12",
        children: [jsxs("div", {
          className: "max-w-3xl",
          children: [jsx("p", {
            className: "text-xs font-bold uppercase tracking-[0.2em] text-accent-teal mb-3",
            children: "High-Intent Services"
          }), jsx("h2", {
            className: "text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4",
            children: "Popular Editing Services Clients Start With"
          }), jsx("p", {
            className: "text-slate-500 dark:text-slate-400 text-base leading-relaxed",
            children: "These are the fastest-moving services for new clients. Start with a free trial, then scale to full production once quality is approved."
          })]
        }), jsxs("div", {
          className: "flex flex-wrap gap-3",
          children: [jsxs(Link, {
            to: "/services",
            "data-analytics-cta": "home_services_view_all",
            "data-analytics-section": "home_services_header",
            className: "inline-flex items-center justify-center h-11 px-6 rounded-full bg-primary text-white font-bold hover:bg-slate-800 dark:hover:bg-accent-teal transition-colors",
            children: ["View All Services", /*#__PURE__*/React.createElement(ArrowRight, {
              size: 16,
              className: "ml-2"
            })]
          }), /*#__PURE__*/React.createElement(Link, {
            to: "/free-trial",
            className: "inline-flex items-center justify-center h-11 px-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
            children: "Start Free Trial"
          })]
        })]
      }), jsx("div", {
        className: "grid sm:grid-cols-2 xl:grid-cols-3 gap-5",
        children: featuredServices.map(service => {
          const isJewelry = service.segment === "jewelry";
          const badgeClass = isJewelry ? "bg-accent-gold/10 text-accent-gold border-accent-gold/20" : "bg-accent-teal/10 text-accent-teal border-accent-teal/20";
          return jsxs(Link, {
            to: `/services/${service.id}`,
            "data-analytics-cta": `home_service_card_${service.id}`,
            "data-analytics-section": "home_services_grid",
            className: "group rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 p-6 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all duration-300",
            children: [jsxs("div", {
              className: "flex items-center justify-between mb-4",
              children: [jsx("span", {
                className: `inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${badgeClass}`,
                children: isJewelry ? "Jewelry" : "Clothing"
              }), jsx("div", {
                className: "text-slate-400 group-hover:text-primary dark:group-hover:text-accent-teal transition-colors",
                children: isJewelry ? /*#__PURE__*/React.createElement(Gem, {
                  size: 18
                }) : /*#__PURE__*/React.createElement(Shirt, {
                  size: 18
                })
              })]
            }), jsx("h3", {
              className: "text-lg font-bold text-slate-900 dark:text-white leading-snug mb-3",
              children: service.title
            }), jsx("p", {
              className: "text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5 max-h-[4.5rem] overflow-hidden",
              children: service.description
            }), jsxs("div", {
              className: "inline-flex items-center text-sm font-bold text-primary dark:text-accent-teal",
              children: ["View details", /*#__PURE__*/React.createElement(ArrowRight, {
                size: 15,
                className: "ml-2 transition-transform group-hover:translate-x-1"
              })]
            })]
          }, service.id);
        })
      })]
    })
  });
};
export default HomeServiceSnippet;