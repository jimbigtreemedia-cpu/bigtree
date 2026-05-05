import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import ImageWithLoader from "./ImageWithLoader";
import { getVideoMimeTypeFromUrl, inferMediaTypeFromUrl, normalizeMediaUrl } from "./mediaUtils";
const CoverMedia = ({ src = "", alt = "", className = "", parentClassName = "", priority = false, sources = [], loading, decoding, fetchPriority, sizes, srcSet, forceType = "auto", poster = "", autoPlay = true, loop = true, muted = true, playsInline = true, controls = false, preload = "metadata" }) => {
    const [isVideoReady, setIsVideoReady] = useState(false);
    const mediaSrc = normalizeMediaUrl(src);
    const mediaType = useMemo(() => {
        if (forceType === "video" || forceType === "image") {
            return forceType;
        }
        return inferMediaTypeFromUrl(mediaSrc, "image");
    }, [forceType, mediaSrc]);
    const videoMimeType = getVideoMimeTypeFromUrl(mediaSrc);
    useEffect(() => {
        setIsVideoReady(false);
    }, [mediaSrc, mediaType]);
    const handleVideoReady = () => {
        setIsVideoReady(true);
    };
    if (mediaType !== "video") {
        return _jsx(ImageWithLoader, { src: mediaSrc, alt: alt, className: className, parentClassName: parentClassName, priority: priority, loading: loading, decoding: decoding, fetchPriority: fetchPriority, sizes: sizes, srcSet: srcSet });
    }
    return (_jsxs("div", { className: `relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${parentClassName}`.trim(), children: [!isVideoReady && _jsx("div", { className: "absolute inset-0 z-10 bg-slate-200 dark:bg-slate-700 animate-pulse" }), _jsxs("video", { autoPlay: autoPlay, loop: loop, muted: muted, playsInline: playsInline, controls: controls, preload: preload, className: `${className} transition-opacity duration-500 ${isVideoReady ? "opacity-100" : "opacity-0"}`.trim(), poster: poster || undefined, "aria-label": alt || "Video preview", onLoadedData: handleVideoReady, onCanPlay: handleVideoReady, onError: handleVideoReady, children: [videoMimeType ? _jsx("source", { src: mediaSrc, type: videoMimeType }) : _jsx("source", { src: mediaSrc }), "Your browser does not support the video tag."] })] }));
};
export default CoverMedia;
