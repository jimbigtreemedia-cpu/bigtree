import React, { useState, useEffect, useCallback, useRef } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, Pause, Play, TrendingUp, CheckCircle2 } from "lucide-react";
import { siteData } from "../data";
import ImageWithLoader from "./ImageWithLoader";
const Testimonials = () => {
  const {
    testimonials
  } = siteData;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timerRef = useRef(null);
  const progressRef = useRef(0);
  const SLIDE_DURATION = 6e3;
  const resetProgress = useCallback(() => {
    progressRef.current = 0;
    setProgress(0);
  }, []);
  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
    resetProgress();
  }, [testimonials.length, resetProgress]);
  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
    resetProgress();
  };
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
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsPaused(true);
      resetProgress();
    }
  }, [prefersReducedMotion, resetProgress]);
  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;
    const startTime = Date.now() - progressRef.current / 100 * SLIDE_DURATION;
    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(100, elapsed / SLIDE_DURATION * 100);
      progressRef.current = newProgress;
      setProgress(newProgress);
      if (newProgress >= 100) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        nextSlide();
      }
    }, 100);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPaused, nextSlide, prefersReducedMotion, currentIndex]);
  const handleManualChange = index => {
    setCurrentIndex(index);
    resetProgress();
  };
  const currentData = testimonials[currentIndex];
  return jsxs("section", {
    className: "py-32 bg-white dark:bg-slate-950 relative overflow-hidden scroll-mt-28",
    id: "testimonials",
    children: [jsx("div", {
      className: "absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(95,158,160,0.03),transparent_40%)] dark:opacity-20"
    }), jsx("div", {
      className: "absolute bottom-20 left-20 w-64 h-64 bg-accent-gold/5 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen dark:opacity-20"
    }), jsxs("div", {
      className: "max-w-7xl mx-auto px-6 lg:px-8 relative z-10",
      children: [jsxs("div", {
        className: "flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8",
        children: [jsxs("div", {
          children: [jsxs("div", {
            className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4",
            children: [/*#__PURE__*/React.createElement(Star, {
              size: 12,
              className: "text-accent-gold fill-accent-gold"
            }), "Client Success Stories"]
          }), jsxs("h2", {
            className: "text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight",
            children: ["Trusted by ", jsx("br", {
              className: "hidden md:block"
            }), "Global Retailers"]
          })]
        }), jsxs("div", {
          className: "hidden md:flex items-center gap-3",
          children: [jsx("button", {
            onClick: prevSlide,
            className: "w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary dark:hover:bg-accent-teal dark:hover:text-white dark:hover:border-accent-teal transition-all duration-300 shadow-sm",
            "aria-label": "Previous Slide",
            children: /*#__PURE__*/React.createElement(ChevronLeft, {
              size: 20
            })
          }), jsx("button", {
            onClick: () => setIsPaused(!isPaused),
            disabled: prefersReducedMotion,
            className: "w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary dark:hover:bg-accent-teal dark:hover:text-white dark:hover:border-accent-teal transition-all duration-300 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed",
            "aria-label": isPaused ? "Play" : "Pause",
            title: prefersReducedMotion ? "Autoplay disabled by reduced motion preference" : "",
            children: isPaused ? /*#__PURE__*/React.createElement(Play, {
              size: 20,
              className: "ml-0.5"
            }) : /*#__PURE__*/React.createElement(Pause, {
              size: 20
            })
          }), jsx("button", {
            onClick: nextSlide,
            className: "w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary dark:hover:bg-accent-teal dark:hover:text-white dark:hover:border-accent-teal transition-all duration-300 shadow-sm",
            "aria-label": "Next Slide",
            children: /*#__PURE__*/React.createElement(ChevronRight, {
              size: 20
            })
          })]
        })]
      }), jsxs("div", {
        className: "relative bg-primary dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 dark:shadow-black/40 group border border-transparent dark:border-slate-800",
        onMouseEnter: () => setIsPaused(true),
        onMouseLeave: () => setIsPaused(false),
        children: [jsxs("div", {
          className: "grid lg:grid-cols-5 min-h-[500px]",
          children: [jsxs("div", {
            className: "lg:col-span-3 p-10 md:p-16 flex flex-col justify-center relative z-10",
            children: [jsx("div", {
              className: "absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"
            }), jsxs("div", {
              className: "relative",
              children: [/*#__PURE__*/React.createElement(Quote, {
                size: 80,
                className: "text-white/5 absolute -top-10 -left-10 transform -scale-x-100 rotate-12"
              }), jsx("div", {
                className: "flex gap-1 mb-8 relative",
                children: [...Array(5)].map((_, i) => jsx(Star, {
                  size: 18,
                  className: "fill-accent-gold text-accent-gold"
                }, i))
              }), jsxs("h3", {
                className: `text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-snug mb-10 ${prefersReducedMotion ? "" : "animate-fade-in-up"}`,
                children: ['"', currentData.quote, '"']
              }, `quote-${currentIndex}`), jsxs("div", {
                className: "flex items-center gap-5",
                children: [jsx("div", {
                  className: "size-16 rounded-2xl overflow-hidden border border-white/20 shadow-lg",
                  children: /*#__PURE__*/React.createElement(ImageWithLoader, {
                    src: currentData.image,
                    alt: currentData.author,
                    className: "w-full h-full object-cover",
                    parentClassName: "w-full h-full"
                  })
                }), jsxs("div", {
                  children: [jsx("div", {
                    className: "text-white font-bold text-xl",
                    children: currentData.author
                  }), jsx("div", {
                    className: "text-accent-teal font-medium text-sm flex items-center gap-2",
                    children: currentData.role
                  })]
                })]
              })]
            })]
          }), jsxs("div", {
            className: "lg:col-span-2 bg-slate-900/40 dark:bg-black/40 border-l border-white/5 p-10 md:p-16 flex flex-col justify-center backdrop-blur-sm relative",
            children: [jsxs("div", {
              className: "flex items-center gap-2 mb-8 text-white/60 text-xs font-bold uppercase tracking-widest",
              children: [/*#__PURE__*/React.createElement(TrendingUp, {
                size: 16,
                className: "text-accent-teal"
              }), /*#__PURE__*/React.createElement("span", null, "Impact Report")]
            }), jsx("div", {
              className: "space-y-4 relative z-10",
              children: currentData.metrics.map((metric, idx) => jsx("div", {
                className: `bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors duration-300 group/metric cursor-default ${prefersReducedMotion ? "" : "animate-fade-in-up"}`,
                style: prefersReducedMotion ? undefined : {
                  animationDelay: `${idx * 150}ms`
                },
                children: jsxs("div", {
                  className: "flex items-start gap-4",
                  children: [jsx("div", {
                    className: "mt-1 p-1 rounded-full bg-accent-teal/20 text-accent-teal",
                    children: /*#__PURE__*/React.createElement(CheckCircle2, {
                      size: 16
                    })
                  }), jsxs("div", {
                    children: [jsx("p", {
                      className: "text-lg font-bold text-white leading-tight group-hover/metric:text-accent-teal transition-colors",
                      children: metric
                    }), jsx("p", {
                      className: "text-white/40 text-[10px] mt-1 font-bold uppercase tracking-wide",
                      children: "Validated Result"
                    })]
                  })]
                })
              }, `metric-${currentIndex}-${idx}`))
            }), jsxs("div", {
              className: "mt-auto pt-10 border-t border-white/5 flex items-center justify-between",
              children: [jsxs("span", {
                className: "text-xs font-medium text-white/40",
                children: ["Case Study ID: #", currentData.id.toString().padStart(3, "0")]
              }), jsxs("div", {
                className: "flex items-center gap-2 text-white/40",
                children: [jsx("div", {
                  className: "size-2 rounded-full bg-green-500 animate-pulse"
                }), jsx("span", {
                  className: "text-xs font-bold uppercase tracking-wider",
                  children: "Verified"
                })]
              })]
            })]
          })]
        }), jsx("div", {
          className: "absolute bottom-0 left-0 w-full h-1 bg-slate-900/50",
          children: jsx("div", {
            className: "h-full bg-accent-teal shadow-[0_0_10px_rgba(95,158,160,0.8)] transition-[width] duration-100 ease-linear",
            style: {
              width: `${progress}%`
            }
          })
        })]
      }), jsx("div", {
        className: "mt-8 flex md:hidden items-center justify-center gap-2",
        children: testimonials.map((_, idx) => jsx("button", {
          onClick: () => handleManualChange(idx),
          className: `h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-primary dark:bg-accent-teal" : "w-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"}`,
          "aria-label": `Go to slide ${idx + 1}`
        }, idx))
      })]
    })]
  });
};
export default Testimonials;