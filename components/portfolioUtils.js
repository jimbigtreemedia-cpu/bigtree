import { isLikelyVideoUrl } from "./mediaUtils.js";

const toCleanUrlList = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item || "").trim()).filter(Boolean);
};

const toTitle = (value) => String(value || "")
  .split("-")
  .filter(Boolean)
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(" ");

const inferDeliveryType = (images, videos, coverImage, declaredType) => {
  const coverIsVideo = isLikelyVideoUrl(coverImage);
  const hasVideo = videos.length > 0 || coverIsVideo;
  const hasImage = images.length > 0 || Boolean(String(coverImage || "").trim()) && !coverIsVideo;
  if (hasVideo && hasImage) return "mixed";
  if (hasVideo) return "video";
  if (hasImage) return "image";
  const normalizedDeclared = String(declaredType || "").toLowerCase();
  if (normalizedDeclared === "video") return "video";
  if (normalizedDeclared === "mixed") return "mixed";
  return "image";
};

const deliveryLabelMap = {
  image: "Image-ready output",
  video: "Motion-ready output",
  mixed: "Mixed image + motion"
};

const deliveryTagMap = {
  image: "Image",
  video: "Video",
  mixed: "Mixed"
};

export const buildPortfolioProjects = (projects, services) => {
  const serviceById = new Map((Array.isArray(services) ? services : []).map((service) => [service.id, service]));

  return (Array.isArray(projects) ? projects : []).map((project) => {
    const images = toCleanUrlList(project.images);
    const videos = toCleanUrlList(project.videos);
    const coverImage = String(project.coverImage || "").trim();
    const coverIsVideo = isLikelyVideoUrl(coverImage);
    const service = serviceById.get(project.category) || null;
    const deliveryType = inferDeliveryType(images, videos, coverImage, project.type);
    const mediaCount = Math.max(1, images.length + videos.length);
    const segment = service && service.segment ? String(service.segment) : "";

    return {
      ...project,
      coverImage,
      images,
      videos,
      service,
      hasMappedService: Boolean(service),
      categoryId: service ? service.id : String(project.category || ""),
      categoryLabel: service ? String(service.title || service.id || "") : toTitle(project.category),
      serviceCategory: segment,
      serviceCategoryLabel: segment ? toTitle(segment) : "Unassigned",
      deliveryType,
      deliveryLabel: deliveryLabelMap[deliveryType] || deliveryLabelMap.image,
      deliveryTag: deliveryTagMap[deliveryType] || deliveryTagMap.image,
      mediaCount,
      hasVideo: videos.length > 0 || coverIsVideo,
      primaryType: deliveryType === "mixed" ? "video" : deliveryType
    };
  });
};
