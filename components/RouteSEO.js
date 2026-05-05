import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NOT_FOUND_SEO, SEO_DEFAULT, ROUTE_SEO, getPortfolioSeo, getServiceSeo } from "../seo";
const normalizePath = (pathname) => {
    if (!pathname)
        return "/";
    if (pathname.length > 1 && pathname.endsWith("/")) {
        return pathname.slice(0, -1);
    }
    return pathname;
};
const setMetaByName = (name, value) => {
    if (!value)
        return;
    let element = document.querySelector(`meta[name="${name}"]`);
    if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
    }
    element.setAttribute("content", value);
};
const setMetaByProperty = (property, value) => {
    if (!value)
        return;
    let element = document.querySelector(`meta[property="${property}"]`);
    if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
    }
    element.setAttribute("content", value);
};
const setCanonical = (href) => {
    if (!href)
        return;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", href);
};
const resolveSeo = async (pathname) => {
    const normalizedPath = normalizePath(pathname);
    if (normalizedPath.startsWith("/services/")) {
        const serviceId = decodeURIComponent(normalizedPath.replace("/services/", ""));
        try {
            const { siteData } = await import("../data.js");
            const service = siteData.services.find((item) => item.id === serviceId);
            if (service)
                return getServiceSeo(service);
        }
        catch (error) {
        }
        return NOT_FOUND_SEO;
    }
    if (normalizedPath.startsWith("/portfolio/")) {
        const projectId = decodeURIComponent(normalizedPath.replace("/portfolio/", ""));
        try {
            const { siteData } = await import("../data.js");
            const project = siteData.projects.find((item) => item.id === projectId);
            if (project)
                return getPortfolioSeo(project);
        }
        catch (error) {
        }
        return NOT_FOUND_SEO;
    }
    return ROUTE_SEO[normalizedPath] || NOT_FOUND_SEO;
};
const RouteSEO = () => {
    const location = useLocation();
    useEffect(() => {
        let cancelled = false;
        const pathname = normalizePath(location.pathname);
        const applySeo = async () => {
            const seo = await resolveSeo(pathname);
            if (cancelled)
                return;
            const canonicalUrl = new URL(pathname, window.location.origin).href;
            const imageUrl = new URL(seo.image || SEO_DEFAULT.image, window.location.origin).href;
            const title = seo.title || SEO_DEFAULT.title;
            const description = seo.description || SEO_DEFAULT.description;
            const type = seo.type || SEO_DEFAULT.type;
            const robots = seo.robots || SEO_DEFAULT.robots || "index,follow";
            document.title = title;
            setMetaByName("description", description);
            setMetaByName("robots", robots);
            setMetaByName("twitter:card", "summary_large_image");
            setMetaByName("twitter:title", title);
            setMetaByName("twitter:description", description);
            setMetaByName("twitter:image", imageUrl);
            setMetaByProperty("og:site_name", SEO_DEFAULT.siteName);
            setMetaByProperty("og:type", type);
            setMetaByProperty("og:title", title);
            setMetaByProperty("og:description", description);
            setMetaByProperty("og:url", canonicalUrl);
            setMetaByProperty("og:image", imageUrl);
            setMetaByProperty("og:image:alt", seo.imageAlt || SEO_DEFAULT.imageAlt);
            setCanonical(canonicalUrl);
        };
        applySeo();
        return () => {
            cancelled = true;
        };
    }, [location.pathname]);
    return null;
};
export default RouteSEO;
