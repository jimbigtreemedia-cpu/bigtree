import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackCtaClick, trackEvent } from "../analytics";
const resolveDestination = (element) => {
    if (!element)
        return "";
    const explicitDestination = element.getAttribute("data-analytics-destination");
    if (explicitDestination) {
        return explicitDestination;
    }
    const href = element.getAttribute("href");
    if (href) {
        return href;
    }
    return "";
};
const AnalyticsTracker = () => {
    const location = useLocation();
    useEffect(() => {
        trackEvent("page_view", {
            path: `${location.pathname || "/"}${location.search || ""}`
        });
    }, [location.pathname, location.search]);
    useEffect(() => {
        const handleClick = (event) => {
            const target = event.target;
            if (!(target instanceof Element)) {
                return;
            }
            const clickable = target.closest("[data-analytics-cta]");
            if (!clickable) {
                return;
            }
            const ctaId = clickable.getAttribute("data-analytics-cta") || "";
            const section = clickable.getAttribute("data-analytics-section") || "";
            const destination = resolveDestination(clickable);
            trackCtaClick(ctaId, destination, {
                section,
                pagePath: `${window.location.pathname}${window.location.search}`
            });
            const normalizedDestination = String(destination || "").toLowerCase();
            const normalizedCtaId = String(ctaId || "").toLowerCase();
            if (normalizedDestination.includes("/free-trial") || normalizedCtaId.includes("free-trial")) {
                trackEvent("free_trial_click", {
                    ctaId,
                    section,
                    destination
                });
            }
        };
        document.addEventListener("click", handleClick, true);
        return () => {
            document.removeEventListener("click", handleClick, true);
        };
    }, []);
    return null;
};
export default AnalyticsTracker;
