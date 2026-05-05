import { jsx, jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { Send } from "lucide-react";
import { trackEvent } from "../analytics.js";

const CONTACT_ENDPOINT = "/backend/api/contact-submit.php";
const CONTACT_FIELD_IDS = {
  firstName: "contact-first-name",
  lastName: "contact-last-name",
  email: "contact-email",
  message: "contact-message",
  website: "contact-website",
  status: "contact-form-status"
};

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    website: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateFields = () => {
    const errors = {
      firstName: "",
      lastName: "",
      email: "",
      message: ""
    };
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required.";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required.";
    }
    const emailValue = formData.email.trim();
    if (!emailValue) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      errors.email = "Enter a valid email address.";
    }
    if (!formData.message.trim()) {
      errors.message = "Message is required.";
    }
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const nextErrors = validateFields();
    const hasErrors = Object.values(nextErrors).some(Boolean);
    setFieldErrors(nextErrors);
    if (hasErrors) {
      setStatus({
        type: "error",
        message: "Please correct the highlighted fields."
      });
      return;
    }

    setStatus({ type: "", message: "" });
    setIsSubmitting(true);
    trackEvent("contact_submit_start", {
      source: "contact_form"
    });

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          message: formData.message,
          website: formData.website
        })
      });

      const payload = await response.json().catch(() => ({
        ok: false,
        error: "Invalid server response."
      }));

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Failed to submit contact form.");
      }

      setStatus({
        type: "success",
        message: "Thanks. Your message was submitted successfully."
      });
      trackEvent("contact_submit", {
        source: "contact_form"
      });
      trackEvent("contact_submit_success", {
        source: "contact_form"
      });
      setFieldErrors({
        firstName: "",
        lastName: "",
        email: "",
        message: ""
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
        website: ""
      });
    } catch (error) {
      trackEvent("contact_submit_error", {
        source: "contact_form",
        message: error?.message || "Failed to submit contact form."
      });
      setStatus({
        type: "error",
        message: error?.message || "Failed to submit contact form."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return /* @__PURE__ */ jsx("section", { className: "py-32 bg-background-base dark:bg-slate-950 border-t border-black/5 dark:border-white/5 scroll-mt-28", id: "contact", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4", children: "Get in Touch" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 dark:text-slate-400 text-lg", children: "Connect with our professional editing team. Response within 2 hours." })
    ] }),
    /* @__PURE__ */ jsxs("form", { className: "space-y-6 bg-white dark:bg-slate-900 p-10 rounded-3xl premium-border dark:border dark:border-slate-800 soft-shadow", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: CONTACT_FIELD_IDS.firstName, className: "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3", children: "First Name" }),
          /* @__PURE__ */ jsx("input", { id: CONTACT_FIELD_IDS.firstName, "aria-invalid": Boolean(fieldErrors.firstName), "aria-describedby": fieldErrors.firstName ? `${CONTACT_FIELD_IDS.firstName}-error` : void 0, className: "w-full bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-accent-teal focus:border-transparent outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600", placeholder: "Jane", type: "text", value: formData.firstName, onChange: (event) => updateField("firstName", event.target.value), required: true }),
          fieldErrors.firstName && /* @__PURE__ */ jsx("p", { id: `${CONTACT_FIELD_IDS.firstName}-error`, className: "mt-2 text-sm text-red-600 dark:text-red-400", children: fieldErrors.firstName })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: CONTACT_FIELD_IDS.lastName, className: "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3", children: "Last Name" }),
          /* @__PURE__ */ jsx("input", { id: CONTACT_FIELD_IDS.lastName, "aria-invalid": Boolean(fieldErrors.lastName), "aria-describedby": fieldErrors.lastName ? `${CONTACT_FIELD_IDS.lastName}-error` : void 0, className: "w-full bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-accent-teal focus:border-transparent outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600", placeholder: "Doe", type: "text", value: formData.lastName, onChange: (event) => updateField("lastName", event.target.value), required: true }),
          fieldErrors.lastName && /* @__PURE__ */ jsx("p", { id: `${CONTACT_FIELD_IDS.lastName}-error`, className: "mt-2 text-sm text-red-600 dark:text-red-400", children: fieldErrors.lastName })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: CONTACT_FIELD_IDS.email, className: "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3", children: "Email" }),
        /* @__PURE__ */ jsx("input", { id: CONTACT_FIELD_IDS.email, "aria-invalid": Boolean(fieldErrors.email), "aria-describedby": fieldErrors.email ? `${CONTACT_FIELD_IDS.email}-error` : void 0, className: "w-full bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-accent-teal focus:border-transparent outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600", placeholder: "jane@brand.com", type: "email", value: formData.email, onChange: (event) => updateField("email", event.target.value), required: true }),
        fieldErrors.email && /* @__PURE__ */ jsx("p", { id: `${CONTACT_FIELD_IDS.email}-error`, className: "mt-2 text-sm text-red-600 dark:text-red-400", children: fieldErrors.email })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: CONTACT_FIELD_IDS.message, className: "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3", children: "Message" }),
        /* @__PURE__ */ jsx("textarea", { id: CONTACT_FIELD_IDS.message, "aria-invalid": Boolean(fieldErrors.message), "aria-describedby": fieldErrors.message ? `${CONTACT_FIELD_IDS.message}-error` : void 0, className: "w-full bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-accent-teal focus:border-transparent outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600", placeholder: "Project details...", rows: 4, value: formData.message, onChange: (event) => updateField("message", event.target.value), required: true }),
        fieldErrors.message && /* @__PURE__ */ jsx("p", { id: `${CONTACT_FIELD_IDS.message}-error`, className: "mt-2 text-sm text-red-600 dark:text-red-400", children: fieldErrors.message })
      ] }),
      /* @__PURE__ */ jsx("input", { id: CONTACT_FIELD_IDS.website, type: "text", value: formData.website, onChange: (event) => updateField("website", event.target.value), tabIndex: -1, autoComplete: "off", className: "hidden", "aria-hidden": true }),
      status.message && /* @__PURE__ */ jsx("p", { id: CONTACT_FIELD_IDS.status, role: "status", "aria-live": status.type === "error" ? "assertive" : "polite", "aria-atomic": "true", className: `text-sm font-medium ${status.type === "error" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`, children: status.message }),
      /* @__PURE__ */ jsxs("button", { className: "w-full py-5 bg-primary hover:bg-slate-800 dark:hover:bg-accent-teal text-white font-bold rounded-xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed", type: "submit", disabled: isSubmitting, children: [
        /* @__PURE__ */ jsx("span", { children: isSubmitting ? "Sending..." : "Send Message" }),
        /* @__PURE__ */ jsx(Send, { size: 20 })
      ] })
    ] })
  ] }) });
};

var stdin_default = Contact;
export {
  stdin_default as default
};
