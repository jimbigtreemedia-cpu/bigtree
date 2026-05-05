const VIDEO_URL_PATTERN = /\.(mp4|webm|mov|m4v|avi|mkv|wmv|flv|mpeg|mpg|3gp|m2ts|mts|ts|m3u8)(?:$|[?#])/i;
const normalizeMediaUrl = (value) => String(value || "").trim();
const isLikelyVideoUrl = (value) => {
    const normalized = normalizeMediaUrl(value);
    if (!normalized)
        return false;
    return VIDEO_URL_PATTERN.test(normalized);
};
const inferMediaTypeFromUrl = (value, fallback = "image") => {
    return isLikelyVideoUrl(value) ? "video" : fallback;
};
const getVideoMimeTypeFromUrl = (value) => {
    const normalized = normalizeMediaUrl(value).toLowerCase().split(/[?#]/)[0];
    if (!normalized)
        return "";
    if (normalized.endsWith(".mp4") || normalized.endsWith(".m4v"))
        return "video/mp4";
    if (normalized.endsWith(".webm"))
        return "video/webm";
    if (normalized.endsWith(".mov"))
        return "video/quicktime";
    if (normalized.endsWith(".m3u8"))
        return "application/x-mpegURL";
    return "";
};
export { getVideoMimeTypeFromUrl, inferMediaTypeFromUrl, isLikelyVideoUrl, normalizeMediaUrl };
