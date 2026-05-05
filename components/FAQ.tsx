
import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { siteData } from "../data";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900" id="faq">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
            <HelpCircle size={12} className="text-primary dark:text-accent-teal" />
            Common Questions
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-500 dark:text-slate-400">Everything you need to know about our process and services.</p>
        </div>
        <div className="space-y-4">
          {siteData.faq.map((item, index) => {
            const isOpen = openIndex === index;
            const questionId = `faq-question-${index}`;
            const panelId = `faq-panel-${index}`;
            return (
              <div key={index} className={`border rounded-2xl transition-all duration-300 ${isOpen ? "bg-slate-50 dark:bg-slate-900 border-primary/20 dark:border-accent-teal/20 shadow-md" : "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"}`}>
                <button type="button" id={questionId} onClick={() => toggleFAQ(index)} className="w-full flex items-center justify-between p-6 text-left focus:outline-none" aria-expanded={isOpen} aria-controls={panelId}>
                  <span className={`font-bold text-lg ${openIndex === index ? "text-primary dark:text-accent-teal" : "text-slate-900 dark:text-white"}`}>{item.question}</span>
                  <div className={`p-2 rounded-full transition-colors ${openIndex === index ? "bg-primary/10 dark:bg-accent-teal/10 text-primary dark:text-accent-teal" : "bg-slate-100 dark:bg-slate-900 text-slate-400"}`}>
                    {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>
                <div id={panelId} role="region" aria-labelledby={questionId} aria-hidden={!isOpen} className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="p-6 pt-0 text-slate-600 dark:text-slate-300 leading-relaxed border-t border-dashed border-slate-200/50 dark:border-slate-700/50 mt-2">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
