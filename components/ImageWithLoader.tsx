import React, { useState } from "react";

interface ImageWithLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  parentClassName?: string;
  alt?: string;
  priority?: boolean;
  sources?: Array<{ srcSet: string; type: string; sizes?: string; media?: string }>;
  loading?: string;
  decoding?: string;
  fetchPriority?: string;
  sizes?: string;
  srcSet?: string;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({
  className = "",
  parentClassName = "",
  alt = "",
  priority = false,
  sources = [],
  loading,
  decoding,
  fetchPriority,
  sizes,
  srcSet,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const resolvedLoading = loading || (priority ? "eager" : "lazy");
  const resolvedDecoding = decoding || (priority ? "sync" : "async");
  const resolvedFetchPriority = fetchPriority || (priority ? "high" : "auto");
  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(event);
    }
  };
  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    if (onError) {
      onError(event);
    }
  };
  const imageNode = <img className={`${className} transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`} alt={alt} onLoad={handleLoad} onError={handleError} loading={resolvedLoading} decoding={resolvedDecoding} fetchPriority={resolvedFetchPriority} sizes={sizes} srcSet={srcSet} {...props} />;
  return (
    <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${parentClassName}`}>
      {!isLoaded && <div className="absolute inset-0 z-10 bg-slate-200 dark:bg-slate-700 animate-pulse flex items-center justify-center" />}
      {sources.length > 0 ? (
        <picture>
          {sources.map((source, index) => <source key={`${source.srcSet}-${index}`} srcSet={source.srcSet} type={source.type} sizes={source.sizes || sizes} media={source.media} />)}
          {imageNode}
        </picture>
      ) : imageNode}
    </div>
  );
};
export default ImageWithLoader;
