import React, { FC } from "react";
const ANALYTICS_ENDPOINT = "/backend/api/analytics-event.php";
const ANALYTICS_SESSION_KEY = "snapiums_analytics_session";

const sanitizeText = (value, maxLength = 500) => {
  const normalized = String(value ?? "").trim().replace(/\s+/g, " ");
  return normalized.length > maxLength ? normalized.slice(0, maxLength) : normalized;
};

const getSessionId = () => {
  try {
    let sessionId = window.sessionStorage.getItem(ANALYTICS_SESSION_KEY);
    if (sessionId) {
      return sessionId;
    }
    const randomPart = Math.random().toString(16).slice(2, 10);
    sessionId = `s-${Date.now()}-${randomPart}`;
    window.sessionStorage.setItem(ANALYTICS_SESSION_KEY, sessionId);
    return sessionId;
  } catch (error) {
    return `s-${Date.now()}`;
  }
};

const normalizeProperties = (value, depth = 3) => {
  if (depth <= 0 || value === null || value === undefined) {
    return null;
  }
  if (typeof value === "string") {
    return sanitizeText(value, 500);
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.slice(0, 40).map((item) => normalizeProperties(item, depth - 1)).filter((item) => item !== null);
  }
  if (typeof value === "object") {
    const output = {};
    Object.entries(value).slice(0, 40).forEach(([key, item]) => {
      const safeKey = sanitizeText(key, 80);
      if (!safeKey) return;
      const normalized = normalizeProperties(item, depth - 1);
      if (normalized !== null) {
        output[safeKey] = normalized;
      }
    });
    return output;
  }
  return null;
};

const dispatchPayload = (payload) => {
  const body = JSON.stringify(payload);
  if (!body) {
    return;
  }

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      const sent = navigator.sendBeacon(ANALYTICS_ENDPOINT, blob);
      if (sent) {
        return;
      }
    }
  } catch (error) {
  }

  try {
    fetch(ANALYTICS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true
    }).catch(() => {
    });
  } catch (error) {
  }
};

export const trackEvent = (event, properties = {}) => {
  if (typeof window === "undefined" || !event) {
    return;
  }

  const safeEvent = sanitizeText(event, 64).toLowerCase();
  if (!safeEvent) {
    return;
  }

  const payload = {
    event: safeEvent,
    path: sanitizeText(`${window.location.pathname}${window.location.search}`, 500),
    title: sanitizeText(document.title, 300),
    referrer: sanitizeText(document.referrer, 800),
    sessionId: sanitizeText(getSessionId(), 120),
    timestampClient: new Date().toISOString(),
    properties: normalizeProperties(properties)
  };

  dispatchPayload(payload);
};

export const trackCtaClick = (ctaId, destination = "", extra = {}) => {
  const safeCtaId = sanitizeText(ctaId, 80);
  if (!safeCtaId) {
    return;
  }
  trackEvent("cta_click", {
    ctaId: safeCtaId,
    destination: sanitizeText(destination, 500),
    ...extra
  });
};
