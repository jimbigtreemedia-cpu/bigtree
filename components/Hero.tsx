import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlayCircle, Wand2, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { siteData } from "../data";

const shouldDeferVideoForConnection = () => {
  if (typeof navigator === "undefined") return false;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) return false;
  if (connection.saveData) return true;
  const effectiveType = String(connection.effectiveType || "").toLowerCase();
  if (effectiveType.includes("2g") || effectiveType.includes("slow-2g")) return true;
  if (typeof connection.downlink === "number" && connection.downlink > 0 && connection.downlink < 1.5) return true;
  return false;
};

const Hero = () => {
  const { hero, trust } = siteData;
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTextVisible, setIsTextVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const comparisonPairs = (hero.comparisonPairs || []).map((pair) => ({
    label: pair.label || "",
    image: pair.image || pair.after || pair.before || ""
  })).filter((pair) => pair.image);
  const currentPair = comparisonPairs[currentPairIndex] || { image: hero.poster || "", label: "" };
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
    if (!hero.slides || hero.slides.length <= 1 || prefersReducedMotion)
      return;
    const interval = setInterval(() => {
      setIsTextVisible(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % hero.slides.length);
        setIsTextVisible(true);
      }, 500);
    }, 5e3);
    return () => clearInterval(interval);
  }, [hero.slides, prefersReducedMotion]);
  useEffect(() => {
    if (!hero.videoUrl || prefersReducedMotion || shouldDeferVideoForConnection()) {
      return;
    }
    let timeoutId = null;
    if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
      const callbackId = window.requestIdleCallback(() => setShouldLoadVideo(true), { timeout: 1800 });
      return () => window.cancelIdleCallback(callbackId);
    }
    timeoutId = window.setTimeout(() => setShouldLoadVideo(true), 1200);
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [hero.videoUrl, prefersReducedMotion]);
  useEffect(() => {
    if (comparisonPairs.length <= 1 || prefersReducedMotion) {
      return;
    }
    let animationTimeoutId = null;
    const intervalId = window.setInterval(() => {
      setIsAnimating(true);
      setCurrentPairIndex((prev) => (prev + 1) % comparisonPairs.length);
      if (animationTimeoutId) {
        window.clearTimeout(animationTimeoutId);
      }
      animationTimeoutId = window.setTimeout(() => setIsAnimating(false), 300);
    }, 3500);
    return () => {
      window.clearInterval(intervalId);
      if (animationTimeoutId) {
        window.clearTimeout(animationTimeoutId);
      }
    };
  }, [comparisonPairs.length, prefersReducedMotion]);
  const changePair = (direction) => {
    if (isAnimating || comparisonPairs.length <= 1)
      return;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    setCurrentPairIndex((prev) => {
      if (direction === "next")
        return (prev + 1) % comparisonPairs.length;
      return (prev - 1 + comparisonPairs.length) % comparisonPairs.length;
    });
  };
  return  jsxs("section", { className: "relative w-full overflow-hidden min-h-screen flex flex-col justify-center dark:bg-slate-950", children: [
     jsxs("div", { className: "absolute inset-0 z-0", children: [
      hero.videoUrl && shouldLoadVideo ?  jsx("video", { autoPlay: true, muted: true, loop: true, playsInline: true, preload: "metadata", className: "absolute top-0 left-0 w-full h-full object-cover opacity-100 dark:opacity-90", poster: hero.poster, children:  jsx("source", { src: hero.videoUrl, type: "video/mp4" }) }) :  jsx("img", { src: hero.poster, alt: "Background", className: "absolute top-0 left-0 w-full h-full object-cover opacity-30 dark:opacity-20", loading: "eager", decoding: "async", fetchPriority: "high" }),
       jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-background-base/60 via-background-base/30 to-background-base/70 dark:from-slate-950/75 dark:via-slate-950/30 dark:to-slate-950/80" }),
       jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.65)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.65)_100%)]" })
    ] }),
     jsxs("div", { className: "absolute inset-0 pointer-events-none z-0 overflow-hidden", children: [
       jsx("div", { className: `absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent-teal/10 rounded-full blur-[100px] ${prefersReducedMotion ? "" : "animate-pulse"}` }),
       jsx("div", { className: `absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-accent-gold/10 rounded-full blur-[120px] ${prefersReducedMotion ? "" : "animate-pulse"}`, style: { animationDelay: "2s" } })
    ] }),
     jsx("div", { className: "relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8 pt-32 pb-20", children:  jsxs("div", { className: "grid lg:grid-cols-2 gap-16 items-center", children: [
       jsxs("div", { className: "text-center lg:text-left order-1", children: [
         jsxs("div", { className: `inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-accent-teal uppercase tracking-widest shadow-sm mb-8 ${prefersReducedMotion ? "" : "animate-fade-in-up"}`, children: [
           jsxs("span", { className: "relative flex h-2 w-2", children: [
             jsx("span", { className: `${prefersReducedMotion ? "" : "animate-ping"} absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75` }),
             jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-accent-teal" })
          ] }),
          "AI-Powered Precision & Human-Powered Perfection"
        ] }),
         jsx("div", { className: `transition-opacity duration-500 min-h-[12rem] ${isTextVisible ? "opacity-100" : "opacity-0"}`, children: hero.slides && hero.slides.length > 0 &&  jsxs(Fragment, { children: [
           jsx("h1", { className: "text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1]", dangerouslySetInnerHTML: { __html: hero.slides[currentSlide].title } }),
           jsx("p", { className: "text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-10 font-medium max-w-xl mx-auto lg:mx-0", children: hero.slides[currentSlide].subtitle })
        ] }) }),
         jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-16 lg:mb-0", children: [
           jsxs(Link, { to: "/free-trial", "data-analytics-cta": "hero_free_trial_primary", "data-analytics-section": "hero_primary", className: `w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 rounded-full bg-primary text-white font-bold hover:bg-slate-800 dark:hover:bg-accent-teal transition-all shadow-xl shadow-primary/20 gap-2 group ${prefersReducedMotion ? "" : "hover:-translate-y-1"}`, children: [
             <Wand2 size={20} className={prefersReducedMotion ? "" : "group-hover:rotate-12 transition-transform"} />,
            "Start Free Trial"
          ] }),
           jsxs(Link, { to: "/portfolio", "data-analytics-cta": "hero_view_work_secondary", "data-analytics-section": "hero_primary", className: `w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all gap-2 shadow-sm hover:shadow-md ${prefersReducedMotion ? "" : "hover:-translate-y-1"}`, children: [
             <PlayCircle size={20} />,
            "View Work"
          ] })
        ] }),
         jsxs("div", { className: "hidden lg:flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400 mt-12", children: [
           jsxs("div", { className: "flex items-center gap-2", children: [
             <CheckCircle2 size={16} className="text-accent-teal" />,
             jsx("span", { children: "24h Turnaround" })
          ] }),
           jsxs("div", { className: "flex items-center gap-2", children: [
             <CheckCircle2 size={16} className="text-accent-teal" />,
             jsx("span", { children: "Enterprise Security" })
          ] }),
           jsxs("div", { className: "flex items-center gap-2", children: [
             <CheckCircle2 size={16} className="text-accent-teal" />,
             jsx("span", { children: "Premium Quality" })
          ] })
        ] })
      ] }),
       jsxs("div", { className: "relative w-full max-w-2xl mx-auto lg:max-w-none order-2 lg:order-2", children: [
         jsxs("div", { className: "relative rounded-2xl overflow-hidden shadow-2xl border-[8px] border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-900 aspect-[4/3] group select-none", children: [
          comparisonPairs.length > 1 &&  jsxs(Fragment, { children: [
             jsx("button", { onClick: (e) => {
              e.stopPropagation();
              changePair("prev");
            }, className: "absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all hover:scale-110 active:scale-95", "aria-label": "Previous image", children:  <ChevronLeft size={24} /> }),
             jsx("button", { onClick: (e) => {
              e.stopPropagation();
              changePair("next");
            }, className: "absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all hover:scale-110 active:scale-95", "aria-label": "Next image", children:  <ChevronRight size={24} /> })
          ] }),
           jsxs("div", { className: `relative w-full h-full transition-opacity duration-300 ${isAnimating ? "opacity-50" : "opacity-100"}`, children: [
             jsx("img", { src: currentPair.image || hero.poster, alt: currentPair.label || "Portfolio showcase", className: "absolute inset-0 w-full h-full object-cover", draggable: false, loading: "eager", decoding: "async", fetchPriority: "high" }),
             jsx("div", { className: "absolute top-4 left-4 bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1 rounded-md shadow-lg pointer-events-none z-10", children: "RAW" }),
             jsx("div", { className: "absolute top-4 right-4 bg-primary/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-md shadow-lg pointer-events-none z-10", children: "EDITED" }),
             jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" }),
             jsxs("div", { className: "absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none z-20", children: [
               jsx("span", { className: "px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20", children: currentPair.label }),
              comparisonPairs.length > 1 &&  jsx("div", { className: "flex gap-1.5", children: comparisonPairs.map((_, i) =>  jsx("div", { className: `h-1.5 rounded-full shadow-sm transition-all duration-300 ${i === currentPairIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"}` }, i)) })
            ] })
          ] })
        ] }),
         jsx("div", { className: "absolute -bottom-12 -left-16 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 hidden sm:block animate-bounce-slow z-20", children:  jsxs("div", { className: "flex items-start gap-2.5", children: [
           jsx("div", { className: "mt-0.5 rounded-full bg-accent-teal/15 p-1.5 text-accent-teal", children:  <CheckCircle2 size={14} /> }),
           jsxs("div", { className: "text-xs leading-relaxed", children: [
             jsx("p", { className: "font-bold text-slate-900 dark:text-white", children: "Human + AI Workflow" }),
             jsx("p", { className: "text-slate-500 dark:text-slate-400", children: "There's Human in the AI loop" })
          ] })
        ] }) })
      ] })
    ] }) }),
     jsx("div", { className: "relative border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm", children:  jsxs("div", { className: "mx-auto max-w-7xl px-6 py-12 lg:px-8", children: [
       jsx("p", { className: "text-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8", children: "Trusted by Global Brands" }),
       jsx("div", { className: "flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 dark:invert-[0.8]", children: trust.map((logo, i) =>  jsx("img", { src: logo, alt: "Brand Partner", className: "h-8 w-auto object-contain hover:opacity-100 hover:scale-110 transition-all cursor-pointer", loading: "lazy", decoding: "async" }, i)) })
    ] }) })
  ] });
};
export default Hero;
