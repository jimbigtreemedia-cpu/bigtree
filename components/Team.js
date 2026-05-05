import React from "react";
import { siteData } from "../data";
import ImageWithLoader from "./ImageWithLoader";
const Team = () => {
    return jsx("section", {
        className: "py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800",
        id: "team",
        children: jsxs("div", {
            className: "max-w-7xl mx-auto px-6 lg:px-8",
            children: [jsxs("div", {
                    className: "text-center mb-16",
                    children: [jsx("h2", {
                            className: "text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6",
                            children: "Meet the Editors"
                        }), jsx("p", {
                            className: "text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed",
                            children: "Behind our advanced AI technology is a team of world-class artists and retouchers ensuring every pixel meets our premium standards."
                        })]
                }), jsx("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8",
                    children: siteData.team.map(member => jsxs("div", {
                        className: "group bg-white dark:bg-slate-950 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 hover:-translate-y-2 text-center",
                        children: [jsx("div", {
                                className: "relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-slate-50 dark:border-slate-900 shadow-inner",
                                children: /*#__PURE__*/ React.createElement(ImageWithLoader, {
                                    src: member.image,
                                    alt: member.name,
                                    className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                })
                            }), jsx("h3", {
                                className: "text-xl font-bold text-slate-900 dark:text-white mb-1",
                                children: member.name
                            }), jsx("p", {
                                className: "text-primary dark:text-accent-teal font-medium text-sm uppercase tracking-wide opacity-80",
                                children: member.role
                            })]
                    }, member.id))
                })]
        })
    });
};
export default Team;
