import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Film, Image as ImageIcon, Keyboard, Play, Sparkles, ZoomIn, ZoomOut } from "lucide-react";
import { siteData } from "../data";
import ImageWithLoader from "../components/ImageWithLoader";
import CoverMedia from "../components/CoverMedia";
import { buildPortfolioProjects } from "../components/portfolioUtils";
import { inferMediaTypeFromUrl, isLikelyVideoUrl } from "../components/mediaUtils";
const PortfolioDetailPage = () => {
  const {
    projectId
  } = useParams();
  const portfolioProjects = useMemo(() => buildPortfolioProjects(siteData.projects, siteData.services), []);
  const project = useMemo(() => portfolioProjects.find(item => item.id === projectId), [portfolioProjects, projectId]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const allMedia = useMemo(() => {
    if (!project) return [];
    const images = project.images.map(url => ({
      type: "image",
      url
    }));
    const videos = project.videos.map(url => ({
      type: "video",
      url
    }));
    if (images.length === 0 && videos.length === 0) {
      return [{
        type: inferMediaTypeFromUrl(project.coverImage, "image"),
        url: project.coverImage
      }];
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
  const imageCount = allMedia.filter(media => media.type === "image").length;
  const videoCount = allMedia.filter(media => media.type === "video").length;
  const goToMedia = index => {
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
  const handleZoom = direction => {
    setZoomLevel(previous => {
      const nextValue = direction === "in" ? previous + 0.25 : previous - 0.25;
      return Math.min(Math.max(nextValue, 0.6), 3);
    });
  };
  useEffect(() => {
    const onKeyDown = event => {
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
    const sameCategory = portfolioProjects.filter(item => item.categoryId === project.categoryId && item.id !== project.id);
    const fallback = portfolioProjects.filter(item => item.id !== project.id && item.categoryId !== project.categoryId);
    return [...sameCategory, ...fallback].slice(0, 3);
  }, [portfolioProjects, project?.categoryId, project?.id]);
  if (!project || !currentMedia) {
    return /*#__PURE__*/React.createElement(Navigate, {
      to: "/portfolio",
      replace: true
    });
  }
  return jsxs("section", {
    className: "relative py-20 md:py-24 bg-slate-50/60 dark:bg-slate-950 min-h-screen",
    children: [jsx("div", {
      className: "pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(15,102,216,0.12),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.12),transparent_65%)]"
    }), jsxs("div", {
      className: "relative max-w-7xl mx-auto px-6 lg:px-8",
      children: [jsxs(Link, {
        to: "/portfolio",
        className: "inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-accent-teal transition-colors mb-8",
        children: [/*#__PURE__*/React.createElement(ArrowLeft, {
          size: 16
        }), "Back to Portfolio"]
      }), jsxs("header", {
        className: "mb-8 md:mb-10",
        children: [jsxs("div", {
          className: "flex flex-wrap items-center gap-2 mb-4",
          children: [jsx("span", {
            className: "px-3 py-1 rounded-full border border-accent-teal/30 bg-accent-teal/10 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-teal",
            children: "Case Study"
          }), jsx("span", {
            className: "px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300",
            children: project.categoryLabel
          }), jsx("span", {
            className: "px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300",
            children: project.deliveryTag
          }), jsxs("span", {
            className: "px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300",
            children: [project.mediaCount, " Assets"]
          })]
        }), jsx("h1", {
          className: "text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4",
          children: project.title
        }), jsx("p", {
          className: "text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed",
          children: project.description
        })]
      }), jsxs("div", {
        className: "grid xl:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start mb-14",
        children: [jsxs("div", {
          className: "rounded-3xl overflow-hidden border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl",
          children: [jsxs("div", {
            className: "flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900",
            children: [jsxs("div", {
              className: "flex items-center gap-3 min-w-0",
              children: [jsx("div", {
                className: "w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 flex items-center justify-center shrink-0",
                children: currentMedia.type === "video" ? /*#__PURE__*/React.createElement(Film, {
                  size: 15
                }) : /*#__PURE__*/React.createElement(ImageIcon, {
                  size: 15
                })
              }), jsxs("div", {
                className: "min-w-0",
                children: [jsx("p", {
                  className: "text-sm font-semibold text-slate-700 dark:text-slate-100 truncate",
                  children: project.categoryLabel
                }), jsx("p", {
                  className: "text-xs text-slate-500 dark:text-slate-400 truncate",
                  children: project.serviceCategoryLabel
                })]
              })]
            }), jsxs("div", {
              className: "text-right shrink-0",
              children: [jsxs("p", {
                className: "text-xs font-bold uppercase tracking-wide text-slate-400",
                children: [currentMediaIndex + 1, " / ", allMedia.length]
              }), jsx("p", {
                className: "hidden sm:block text-[11px] text-slate-400 dark:text-slate-500 mt-0.5",
                children: "Use left and right arrow keys"
              })]
            })]
          }), jsxs("div", {
            className: "relative flex items-center justify-center min-h-[58vh] sm:min-h-[64vh] p-4 sm:p-6 lg:p-8 overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950",
            children: [jsx("button", {
              onClick: prevMedia,
              disabled: currentMediaIndex === 0,
              className: "absolute left-4 z-20 p-3 rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 shadow-lg text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-all",
              "aria-label": "Previous media",
              children: /*#__PURE__*/React.createElement(ChevronLeft, {
                size: 22
              })
            }), jsx("button", {
              onClick: nextMedia,
              disabled: currentMediaIndex === allMedia.length - 1,
              className: "absolute right-4 z-20 p-3 rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 shadow-lg text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-all",
              "aria-label": "Next media",
              children: /*#__PURE__*/React.createElement(ChevronRight, {
                size: 22
              })
            }), jsx("div", {
              className: "w-full h-full flex items-center justify-center",
              children: currentMedia.type === "image" ? jsx(ImageWithLoader, {
                src: currentMedia.url,
                alt: project.title,
                className: "max-h-[72vh] max-w-full object-contain drop-shadow-xl",
                style: {
                  transform: `scale(${zoomLevel})`,
                  transition: "transform 0.2s ease-out"
                },
                parentClassName: "bg-transparent flex items-center justify-center",
                priority: true,
                sizes: "100vw"
              }) : jsx("video", {
                src: currentMedia.url,
                controls: true,
                autoPlay: true,
                className: "max-h-[72vh] max-w-full object-contain rounded-xl bg-black drop-shadow-xl"
              })
            })]
          }), jsxs("div", {
            className: "bg-white/95 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 sm:px-6 py-4 flex flex-col gap-4",
            children: [jsxs("div", {
              className: "flex items-center justify-between gap-4 flex-wrap",
              children: [jsxs("div", {
                className: "flex items-center gap-2",
                children: [jsx("button", {
                  onClick: () => handleZoom("in"),
                  disabled: !isImageMedia,
                  className: "p-2 rounded-lg text-slate-500 dark:text-slate-400 border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                  title: "Zoom In",
                  children: /*#__PURE__*/React.createElement(ZoomIn, {
                    size: 20
                  })
                }), jsx("button", {
                  onClick: () => handleZoom("out"),
                  disabled: !isImageMedia,
                  className: "p-2 rounded-lg text-slate-500 dark:text-slate-400 border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                  title: "Zoom Out",
                  children: /*#__PURE__*/React.createElement(ZoomOut, {
                    size: 20
                  })
                }), jsx("span", {
                  className: "text-xs font-semibold text-slate-500 dark:text-slate-400",
                  children: isImageMedia ? `${Math.round(zoomLevel * 100)}% zoom` : "Video mode"
                })]
              }), jsxs("div", {
                className: "text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500",
                children: [imageCount, " Images | ", videoCount, " Videos"]
              })]
            }), jsx("div", {
              className: "flex gap-3 overflow-x-auto hide-scrollbar pb-1",
              children: allMedia.map((media, index) => jsx("button", {
                onClick: () => goToMedia(index),
                className: `relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 border ${index === currentMediaIndex ? "ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-105 border-primary/40 opacity-100" : "border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100 hover:scale-105"}`,
                children: media.type === "video" ? jsxs("div", {
                  className: "relative w-full h-full bg-slate-900 flex items-center justify-center",
                  children: [/*#__PURE__*/React.createElement(Film, {
                    size: 18,
                    className: "text-white/75"
                  }), jsx("div", {
                    className: "absolute inset-0 flex items-center justify-center",
                    children: jsx("span", {
                      className: "w-7 h-7 rounded-full bg-white/90 text-slate-900 flex items-center justify-center",
                      children: /*#__PURE__*/React.createElement(Play, {
                        size: 12,
                        fill: "currentColor",
                        className: "ml-0.5"
                      })
                    })
                  })]
                }) : /*#__PURE__*/React.createElement(ImageWithLoader, {
                  src: media.url,
                  className: "w-full h-full object-cover",
                  alt: "thumb"
                })
              }, `${media.url}-${index}`))
            })]
          })]
        }), jsxs("aside", {
          className: "xl:sticky xl:top-24 space-y-4",
          children: [jsxs("div", {
            className: "rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-6",
            children: [jsxs("div", {
              className: "flex items-center gap-2 mb-3",
              children: [/*#__PURE__*/React.createElement(Sparkles, {
                size: 16,
                className: "text-primary dark:text-accent-teal"
              }), jsx("h2", {
                className: "text-base font-bold text-slate-900 dark:text-white",
                children: "Project Overview"
              })]
            }), jsx("p", {
              className: "text-sm text-slate-600 dark:text-slate-300 leading-relaxed",
              children: project.description
            }), jsxs("div", {
              className: "mt-5 grid grid-cols-2 gap-3",
              children: [jsxs("div", {
                className: "rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3",
                children: [jsx("p", {
                  className: "text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1",
                  children: "Service"
                }), project.hasMappedService ? jsx(Link, {
                  to: `/services/${project.categoryId}`,
                  className: "text-sm font-semibold text-primary hover:text-slate-800 dark:hover:text-accent-teal transition-colors",
                  children: project.categoryLabel
                }) : jsx("p", {
                  className: "text-sm font-semibold text-slate-800 dark:text-slate-100",
                  children: project.categoryLabel
                })]
              }), jsxs("div", {
                className: "rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3",
                children: [jsx("p", {
                  className: "text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1",
                  children: "Category"
                }), jsx("p", {
                  className: "text-sm font-semibold text-slate-800 dark:text-slate-100",
                  children: project.serviceCategoryLabel
                })]
              }), jsxs("div", {
                className: "rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3",
                children: [jsx("p", {
                  className: "text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1",
                  children: "Delivery"
                }), jsx("p", {
                  className: "text-sm font-semibold text-slate-800 dark:text-slate-100",
                  children: project.deliveryLabel
                })]
              }), jsxs("div", {
                className: "rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3",
                children: [jsx("p", {
                  className: "text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1",
                  children: "Assets"
                }), jsxs("p", {
                  className: "text-sm font-semibold text-slate-800 dark:text-slate-100",
                  children: [project.mediaCount, " files"]
                })]
              })]
            })]
          }), jsxs("div", {
            className: "rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-6",
            children: [jsx("h3", {
              className: "text-base font-bold text-slate-900 dark:text-white mb-3",
              children: "Project Actions"
            }), /*#__PURE__*/React.createElement(Link, {
              to: "/contact",
              className: "w-full h-11 inline-flex items-center justify-center rounded-xl bg-primary text-white font-bold hover:bg-slate-800 dark:hover:bg-accent-teal transition-all shadow-lg shadow-primary/20",
              children: "Discuss Similar Project"
            }), project.hasMappedService && jsx(Link, {
              to: `/services/${project.categoryId}`,
              className: "mt-3 w-full h-11 inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal transition-colors",
              children: "View Service Details"
            }), /*#__PURE__*/React.createElement(Link, {
              to: "/portfolio",
              className: "mt-3 w-full h-11 inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal transition-colors",
              children: "Browse Full Portfolio"
            })]
          }), jsxs("div", {
            className: "rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-5",
            children: [jsxs("div", {
              className: "flex items-center gap-2 mb-3",
              children: [/*#__PURE__*/React.createElement(Keyboard, {
                size: 15,
                className: "text-slate-500 dark:text-slate-300"
              }), jsx("h3", {
                className: "text-sm font-bold text-slate-900 dark:text-white",
                children: "Keyboard Shortcuts"
              })]
            }), jsxs("ul", {
              className: "space-y-2 text-sm text-slate-600 dark:text-slate-300",
              children: [jsxs("li", {
                className: "flex items-center justify-between gap-3",
                children: [/*#__PURE__*/React.createElement("span", null, "Navigate media"), jsx("kbd", {
                  className: "px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold",
                  children: "Left / Right"
                })]
              }), jsxs("li", {
                className: "flex items-center justify-between gap-3",
                children: [/*#__PURE__*/React.createElement("span", null, "Zoom image in"), jsx("kbd", {
                  className: "px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold",
                  children: "+"
                })]
              }), jsxs("li", {
                className: "flex items-center justify-between gap-3",
                children: [/*#__PURE__*/React.createElement("span", null, "Zoom image out"), jsx("kbd", {
                  className: "px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold",
                  children: "-"
                })]
              })]
            })]
          })]
        })]
      }), jsxs("section", {
        className: "mb-10",
        children: [jsxs("div", {
          className: "flex items-center justify-between mb-6 gap-4",
          children: [jsx("h2", {
            className: "text-2xl md:text-3xl font-bold text-slate-900 dark:text-white",
            children: "Related Work"
          }), /*#__PURE__*/React.createElement(Link, {
            to: "/contact",
            className: "text-sm font-bold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-accent-teal transition-colors",
            children: "Discuss Your Project"
          })]
        }), relatedProjects.length > 0 ? jsx("div", {
          className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6",
          children: relatedProjects.map(related => {
            const coverIsVideo = isLikelyVideoUrl(related.coverImage);
            return jsxs(Link, {
              to: `/portfolio/${related.id}`,
              "data-analytics-cta": `portfolio_detail_related_${related.id}`,
              "data-analytics-section": "portfolio_detail_related_grid",
              className: "group rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all",
              children: [jsxs("div", {
                className: "relative",
                children: [/*#__PURE__*/React.createElement(CoverMedia, {
                  src: related.coverImage,
                  alt: related.title,
                  className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
                  parentClassName: "aspect-[4/3]"
                }), (related.hasVideo || coverIsVideo) && jsx("div", {
                  className: "absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg",
                  children: /*#__PURE__*/React.createElement(Play, {
                    size: 13,
                    fill: "currentColor",
                    className: "ml-0.5"
                  })
                })]
              }), jsxs("div", {
                className: "p-5",
                children: [jsxs("div", {
                  className: "flex items-center justify-between gap-2 mb-2",
                  children: [jsx("p", {
                    className: "text-[10px] font-bold uppercase tracking-[0.18em] text-accent-teal truncate",
                    children: related.categoryLabel
                  }), jsx("p", {
                    className: "text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500",
                    children: related.deliveryTag
                  })]
                }), jsx("h3", {
                  className: "font-bold text-slate-900 dark:text-white mb-1",
                  children: related.title
                }), jsx("p", {
                  className: "text-sm text-slate-500 dark:text-slate-400",
                  children: related.description
                })]
              })]
            }, related.id);
          })
        }) : jsx("div", {
          className: "rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center",
          children: jsx("p", {
            className: "text-slate-500 dark:text-slate-400",
            children: "No additional related work yet. Explore the full portfolio for more examples."
          })
        })]
      })]
    })]
  });
};
export default PortfolioDetailPage;