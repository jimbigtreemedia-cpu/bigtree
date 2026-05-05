import { jsx, jsxs } from "react/jsx-runtime";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { siteData } from "../data";
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return  jsx("section", { className: "py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900", id: "faq", children:  jsxs("div", { className: "max-w-3xl mx-auto px-6 lg:px-8", children: [
     jsxs("div", { className: "text-center mb-16", children: [
       jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4", children: [
         <HelpCircle size={12} className="text-primary dark:text-accent-teal" />,
        "Common Questions"
      ] }),
       jsx("h2", { className: "text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4", children: "Frequently Asked Questions" }),
       jsx("p", { className: "text-slate-500 dark:text-slate-400", children: "Everything you need to know about our process and services." })
    ] }),
     jsx("div", { className: "space-y-4", children: siteData.faq.map((item, index) => {
      const isOpen = openIndex === index;
      const questionId = `faq-question-${index}`;
      const panelId = `faq-panel-${index}`;
      return  jsxs("div", { className: `border rounded-2xl transition-all duration-300 ${isOpen ? "bg-slate-50 dark:bg-slate-900 border-primary/20 dark:border-accent-teal/20 shadow-md" : "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"}`, children: [
       jsxs("button", { type: "button", id: questionId, onClick: () => toggleFAQ(index), className: "w-full flex items-center justify-between p-6 text-left focus:outline-none", "aria-expanded": isOpen, "aria-controls": panelId, children: [
         jsx("span", { className: `font-bold text-lg ${openIndex === index ? "text-primary dark:text-accent-teal" : "text-slate-900 dark:text-white"}`, children: item.question }),
         jsx("div", { className: `p-2 rounded-full transition-colors ${openIndex === index ? "bg-primary/10 dark:bg-accent-teal/10 text-primary dark:text-accent-teal" : "bg-slate-100 dark:bg-slate-900 text-slate-400"}`, children: openIndex === index ?  <ChevronUp size={20} /> :  <ChevronDown size={20} /> })
      ] }),
       jsx("div", { id: panelId, role: "region", "aria-labelledby": questionId, "aria-hidden": !isOpen, className: `overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`, children:  jsx("div", { className: "p-6 pt-0 text-slate-600 dark:text-slate-300 leading-relaxed border-t border-dashed border-slate-200/50 dark:border-slate-700/50 mt-2", children: item.answer }) })
    ] }, index);
    }) })
  ] }) });
};
export default FAQ;
