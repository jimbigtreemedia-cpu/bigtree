import { jsx, jsxs } from "react/jsx-runtime";

import React, { useEffect, useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { siteData } from "../data";
import { useTheme } from "./ThemeProvider";
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navLinks = [
    { name: "Home", to: "/", end: true },
    { name: "Services", to: "/services" },
    { name: "Portfolio", to: "/portfolio" },
    { name: "Process", to: "/process" },
    { name: "Pricing", to: "/pricing" },
    { name: "Contact", to: "/contact" }
  ];
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updatePreference);
      return () => mediaQuery.removeEventListener("change", updatePreference);
    }
    mediaQuery.addListener(updatePreference);
    return () => mediaQuery.removeListener(updatePreference);
  }, []);
  useEffect(() => {
    let frameId = null;
    let ticking = false;
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 20);
      ticking = false;
      frameId = null;
    };
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      frameId = window.requestAnimationFrame(updateScrollState);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return  jsxs("nav", { className: `fixed top-0 left-0 right-0 z-50 border-b ${prefersReducedMotion ? "transition-none" : "transition-all duration-300"} ${isScrolled || mobileMenuOpen ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-sm border-slate-200 dark:border-slate-800" : "bg-transparent border-transparent"}`, children: [
     jsx("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children:  jsxs("div", { className: "flex h-20 items-center justify-between gap-2", children: [
       jsxs(Link, { className: "flex min-w-0 items-center gap-2 pr-1 md:gap-3 md:pr-0", to: "/", children: [
         jsx("img", { src: siteData.general.logo, alt: "Big Tree Media Logo", className: "h-9 w-9 rounded-lg shadow-lg shadow-primary/10 md:h-10 md:w-10" }),
         jsx("span", { className: "max-w-[7.5rem] truncate text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:max-w-none sm:text-xl", children: "Big Tree Media" })
      ] }),
       jsx("div", { className: "hidden md:flex items-center gap-10", children: navLinks.map((link) =>  jsx(NavLink, { to: link.to, end: link.end, className: ({ isActive }) => `text-sm transition-colors ${isActive ? "font-bold text-primary dark:text-accent-teal" : "font-semibold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white"}`, children: link.name }, link.name)) }),
       jsxs("div", { className: "hidden md:flex items-center gap-4", children: [
         jsx("button", { onClick: toggleTheme, className: "p-2 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors", "aria-label": "Toggle Theme", children: theme === "light" ?  <Moon size={20} /> :  <Sun size={20} /> }),
         <Link to="/free-trial" className="free-trial-glow inline-flex h-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-4 text-sm font-bold text-primary transition-colors hover:bg-primary/15 dark:border-accent-teal/30 dark:bg-accent-teal/10 dark:text-accent-teal dark:hover:bg-accent-teal/20" children="Free Trial" />,
         <Link to="/contact" className="flex h-11 items-center justify-center rounded-full bg-primary px-8 text-sm font-bold text-white shadow-lg shadow-primary/10 transition-all hover:bg-slate-800 hover:shadow-primary/20 hover:scale-105 active:scale-95 dark:hover:bg-accent-teal dark:text-white" children="Get Started" />
      ] }),
       jsxs("div", { className: "ml-1 flex shrink-0 items-center gap-1.5 md:hidden sm:ml-2 sm:gap-3", children: [
         <Link to="/free-trial" className="free-trial-glow whitespace-nowrap rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1.5 text-[11px] font-bold text-primary dark:border-accent-teal/30 dark:bg-accent-teal/10 dark:text-accent-teal sm:px-4 sm:py-2 sm:text-xs" children="Free Trial" />,
         jsx("button", { onClick: toggleTheme, className: "p-2 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors", "aria-label": "Toggle Theme", children: theme === "light" ?  <Moon size={20} /> :  <Sun size={20} /> }),
         jsx("button", { className: "flex items-center justify-center p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg transition-colors", onClick: () => setMobileMenuOpen(!mobileMenuOpen), "aria-label": mobileMenuOpen ? "Close menu" : "Open menu", "aria-expanded": mobileMenuOpen, children: mobileMenuOpen ?  <X size={24} /> :  <Menu size={24} /> })
      ] })
    ] }) }),
     jsx("div", { className: `md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-lg transition-all duration-300 overflow-hidden ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`, children:  jsxs("div", { className: "px-6 py-4 space-y-3", children: [
      navLinks.map((link) =>  jsx(NavLink, { to: link.to, end: link.end, className: ({ isActive }) => `block py-2 text-sm transition-colors ${isActive ? "font-bold text-primary dark:text-accent-teal" : "font-semibold text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white"}`, children: link.name }, link.name)),
       jsx("div", { className: "border-t border-slate-200 dark:border-slate-800 pt-3 mt-3", children:  <Link to="/contact" className="block w-full h-11 flex items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-lg shadow-primary/10 transition-all hover:bg-slate-800 mt-2" children="Get Started" /> })
    ] }) })
  ] });
};
export default Navbar;
