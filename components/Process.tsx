import React from "react";
import { Upload, Sparkles, UserCheck, CheckCircle2 } from "lucide-react";
const Process = () => {
  const steps = [{
    icon: /*#__PURE__*/React.createElement(Upload, {
      size: 24
    }),
    title: "Upload & Brief",
    desc: "Send us your files via any platform (WeTransfer, Dropbox) with your specific instructions.",
    color: "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400"
  }, {
    icon: /*#__PURE__*/React.createElement(Sparkles, {
      size: 24
    }),
    title: "AI Processing",
    desc: "We apply advanced AI tools for initial enhancements, background removal, and color correction.",
    color: "text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400"
  }, {
    icon: /*#__PURE__*/React.createElement(UserCheck, {
      size: 24
    }),
    title: "Human Review",
    desc: "Senior retouchers meticulously refine details and ensure the output matches your brand style.",
    color: "text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400"
  }, {
    icon: /*#__PURE__*/React.createElement(CheckCircle2, {
      size: 24
    }),
    title: "Delivery",
    desc: "Download your flawless, commercial-ready assets in your preferred format within 24 hours.",
    color: "text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400"
  }];
  return jsxs("section", {
    className: "py-32 bg-background-base dark:bg-slate-950 scroll-mt-28 relative overflow-hidden",
    id: "process",
    children: [jsxs("div", {
      className: "absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none",
      children: [jsx("div", {
        className: "absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -translate-y-1/2"
      }), jsx("div", {
        className: "absolute bottom-0 right-0 w-64 h-64 bg-accent-gold/5 dark:bg-accent-gold/10 rounded-full blur-3xl"
      })]
    }), jsxs("div", {
      className: "max-w-7xl mx-auto px-6 lg:px-8 relative z-10",
      children: [jsxs("div", {
        className: "text-center mb-20",
        children: [jsx("h2", {
          className: "text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6",
          children: "Simple, Efficient Workflow"
        }), jsx("p", {
          className: "text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed",
          children: "From upload to final delivery, our hybrid AI-human process ensures speed without compromising on quality."
        })]
      }), jsxs("div", {
        className: "relative",
        children: [jsx("div", {
          className: "hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent border-t border-dashed border-slate-300 dark:border-slate-700 z-0"
        }), jsx("div", {
          className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12",
          children: steps.map((step, index) => jsxs("div", {
            className: "relative z-10 group",
            children: [jsxs("div", {
              className: "absolute -top-3 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-20",
              children: ["STEP 0", index + 1]
            }), jsxs("div", {
              className: "bg-white dark:bg-slate-900 rounded-3xl p-8 pt-12 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col items-center text-center relative overflow-hidden",
              children: [jsx("div", {
                className: `w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${step.color}`,
                children: step.icon
              }), jsx("h3", {
                className: "text-xl font-bold text-slate-900 dark:text-white mb-3",
                children: step.title
              }), jsx("p", {
                className: "text-slate-500 dark:text-slate-400 text-sm leading-relaxed",
                children: step.desc
              }), jsx("div", {
                className: "absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              })]
            }), index < steps.length - 1 && jsx("div", {
              className: "lg:hidden absolute left-1/2 -bottom-6 -translate-x-1/2 text-slate-300 dark:text-slate-700",
              children: jsx("div", {
                className: "w-0.5 h-4 bg-slate-300 dark:bg-slate-700"
              })
            })]
          }, index))
        })]
      })]
    })]
  });
};
export default Process;