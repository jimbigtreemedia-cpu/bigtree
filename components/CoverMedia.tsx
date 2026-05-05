import React, { useEffect, useMemo, useState } from "react";
import ImageWithLoader from "./ImageWithLoader";
import { getVideoMimeTypeFromUrl, inferMediaTypeFromUrl, normalizeMediaUrl } from "./mediaUtils";

interface CoverMediaProps {
  src?: string;
  alt?: string;
  className?: string;
  parentClassName?: string;
  priority?: boolean;
  sources?: any[];
  loading?: any;
  decoding?: any;
  fetchPriority?: any;
  sizes?: any;
  srcSet?: any;
  forceType?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  preload?: string;
}

const CoverMedia: React.FC<CoverMediaProps> = ({
  src = "",
  alt = "",
  className = "",
  parentClassName = "",
  priority = false,
  sources = [],
  loading,
  decoding,
  fetchPriority,
  sizes,
  srcSet,
  forceType = "auto",
  poster = "",
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  controls = false,
  preload = "metadata"
}) => {
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
    return <ImageWithLoader src={mediaSrc} alt={alt} className={className} parentClassName={parentClassName} priority={priority} loading={loading} decoding={decoding} fetchPriority={fetchPriority} sizes={sizes} srcSet={srcSet} />;
  }

  return (
    <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${parentClassName}`.trim()}>
      {!isVideoReady && <div className="absolute inset-0 z-10 bg-slate-200 dark:bg-slate-700 animate-pulse" />}
      <video
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        controls={controls}
        preload={preload}
        className={`${className} transition-opacity duration-500 ${isVideoReady ? "opacity-100" : "opacity-0"}`.trim()}
        poster={poster || undefined}
        aria-label={alt || "Video preview"}
        onLoadedData={handleVideoReady}
        onCanPlay={handleVideoReady}
        onError={handleVideoReady}
      >
        {videoMimeType ? <source src={mediaSrc} type={videoMimeType} /> : <source src={mediaSrc} />}
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
export default CoverMedia;
