import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
const ImageWithLoader = ({ className = "", parentClassName = "", alt = "", priority = false, sources = [], loading, decoding, fetchPriority, sizes, srcSet, onLoad, onError, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const resolvedLoading = loading || (priority ? "eager" : "lazy");
    const resolvedDecoding = decoding || (priority ? "sync" : "async");
    const resolvedFetchPriority = fetchPriority || (priority ? "high" : "auto");
    const handleLoad = (event) => {
        setIsLoaded(true);
        if (onLoad) {
            onLoad(event);
        }
    };
    const handleError = (event) => {
        setIsLoaded(true);
        if (onError) {
            onError(event);
        }
    };
    const imageNode = jsx("img", { className: `${className} transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`, alt, onLoad: handleLoad, onError: handleError, loading: resolvedLoading, decoding: resolvedDecoding, fetchPriority: resolvedFetchPriority, sizes, srcSet, ...props });
    return jsxs("div", { className: `relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${parentClassName}`, children: [
            !isLoaded && jsx("div", { className: "absolute inset-0 z-10 bg-slate-200 dark:bg-slate-700 animate-pulse flex items-center justify-center" }),
            sources.length > 0 ? jsxs("picture", { children: [
                    sources.map((source, index) => jsx("source", { srcSet: source.srcSet, type: source.type, sizes: source.sizes || sizes, media: source.media }, `${source.srcSet}-${index}`)),
                    imageNode
                ] }) : imageNode
        ] });
};
export default ImageWithLoader;
