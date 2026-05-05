import React, { Fragment, useState, useCallback, useRef } from "react";
import { Upload, X, FileImage, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { trackEvent } from "../analytics";
const TRIAL_ENDPOINT = "/backend/api/trial-submit.php";
const FREE_TRIAL_FIELD_IDS = {
  files: "free-trial-files",
  name: "free-trial-name",
  email: "free-trial-email",
  instructions: "free-trial-instructions",
  website: "free-trial-website",
  status: "free-trial-form-status"
};
const FreeTrial = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [status, setStatus] = useState({
    type: "",
    message: ""
  });
  const [submissionInfo, setSubmissionInfo] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    instructions: "",
    website: ""
  });
  const [fieldErrors, setFieldErrors] = useState({
    files: "",
    name: "",
    email: "",
    instructions: ""
  });
  const fileInputRef = useRef(null);
  const handleDrag = useCallback(event => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  }, []);
  const handleDrop = useCallback(event => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFiles(event.dataTransfer.files);
    }
  }, []);
  const handleChange = event => {
    event.preventDefault();
    if (event.target.files && event.target.files[0]) {
      handleFiles(event.target.files);
    }
  };
  const handleFiles = fileList => {
    const newFiles = Array.from(fileList).filter(file => file instanceof File);
    if (newFiles.length === 0) {
      return;
    }
    setFiles(prev => {
      const merged = [...prev, ...newFiles];
      return merged.slice(0, 3);
    });
    setFieldErrors(prev => ({
      ...prev,
      files: ""
    }));
    setStatus({
      type: "",
      message: ""
    });
  };
  const removeFile = index => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  const updateField = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
    setFieldErrors(prev => ({
      ...prev,
      [key]: ""
    }));
  };
  const validateFields = () => {
    const errors = {
      files: "",
      name: "",
      email: "",
      instructions: ""
    };
    if (files.length === 0) {
      errors.files = "Please upload at least one file.";
    }
    if (!formData.name.trim()) {
      errors.name = "Name is required.";
    }
    const emailValue = formData.email.trim();
    if (!emailValue) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      errors.email = "Enter a valid email address.";
    }
    if (!formData.instructions.trim()) {
      errors.instructions = "Editing instructions are required.";
    }
    return errors;
  };
  const handleSubmit = async event => {
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
    const totalBytes = files.reduce((sum, file) => sum + (file?.size || 0), 0);
    trackEvent("free_trial_upload_start", {
      source: "free_trial_form",
      fileCount: files.length,
      totalBytes
    });
    trackEvent("upload_start", {
      source: "free_trial_form",
      fileCount: files.length,
      totalBytes
    });
    setIsSubmitting(true);
    setStatus({
      type: "",
      message: ""
    });
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("instructions", formData.instructions);
      payload.append("website", formData.website);
      files.forEach(file => {
        payload.append("files[]", file, file.name);
      });
      const response = await fetch(TRIAL_ENDPOINT, {
        method: "POST",
        body: payload
      });
      const data = await response.json().catch(() => ({
        ok: false,
        error: "Invalid server response."
      }));
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Failed to submit free trial form.");
      }
      setIsSuccess(true);
      setSubmissionInfo(data.data || null);
      trackEvent("free_trial_upload_success", {
        source: "free_trial_form",
        fileCount: files.length,
        totalBytes,
        submissionId: data?.data?.id || ""
      });
      trackEvent("upload_success", {
        source: "free_trial_form",
        fileCount: files.length,
        totalBytes,
        submissionId: data?.data?.id || ""
      });
      setFiles([]);
      setFormData({
        name: "",
        email: "",
        instructions: "",
        website: ""
      });
      setFieldErrors({
        files: "",
        name: "",
        email: "",
        instructions: ""
      });
    } catch (error) {
      trackEvent("free_trial_upload_error", {
        source: "free_trial_form",
        fileCount: files.length,
        totalBytes,
        message: error?.message || "Failed to submit free trial form."
      });
      trackEvent("upload_error", {
        source: "free_trial_form",
        fileCount: files.length,
        totalBytes,
        message: error?.message || "Failed to submit free trial form."
      });
      setStatus({
        type: "error",
        message: error?.message || "Failed to submit free trial form."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  if (isSuccess) {
    return jsx("section", {
      id: "free-trial",
      className: "py-24 bg-primary/5 dark:bg-primary/10 border-y border-primary/10",
      children: jsxs("div", {
        className: "max-w-3xl mx-auto px-6 text-center animate-fade-in-up",
        children: [jsx("div", {
          className: "w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6",
          children: /*#__PURE__*/React.createElement(CheckCircle, {
            className: "w-10 h-10 text-green-600 dark:text-green-400"
          })
        }), jsx("h2", {
          className: "text-3xl font-bold text-slate-900 dark:text-white mb-4",
          children: "Upload Successful!"
        }), jsx("p", {
          role: "status",
          "aria-live": "polite",
          "aria-atomic": "true",
          className: "text-slate-600 dark:text-slate-300 text-lg mb-4",
          children: "Our team has received your trial files. We will process them and email you the results within 24 hours."
        }), submissionInfo?.id && jsxs("p", {
          className: "text-sm text-slate-500 dark:text-slate-400 mb-8",
          children: ["Submission ID: ", submissionInfo.id]
        }), jsx("button", {
          onClick: () => {
            setIsSuccess(false);
            setStatus({
              type: "",
              message: ""
            });
          },
          className: "px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-primary/20",
          children: "Upload More"
        })]
      })
    });
  }
  return jsx("section", {
    id: "free-trial",
    className: "py-32 bg-white dark:bg-slate-950 scroll-mt-20",
    children: jsxs("div", {
      className: "max-w-7xl mx-auto px-6 lg:px-8",
      children: [jsxs("div", {
        className: "text-center mb-16",
        children: [jsx("div", {
          className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-accent-teal/10 border border-primary/20 dark:border-accent-teal/20 text-xs font-bold text-primary dark:text-accent-teal uppercase tracking-widest mb-4",
          children: "Free Trial"
        }), jsx("h2", {
          className: "text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6",
          children: "Test Our Quality Risk-Free"
        }), jsx("p", {
          className: "text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg",
          children: "Upload up to 3 images or videos for a complimentary test edit. Experience our workflow and quality firsthand before committing."
        })]
      }), jsx("div", {
        className: "bg-slate-50 dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800",
        children: jsxs("div", {
          className: "grid lg:grid-cols-2",
          children: [jsxs("div", {
            className: "p-10 md:p-16 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col justify-center",
            children: [jsxs("div", {
              className: `relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer ${dragActive ? "border-primary bg-primary/5 dark:border-accent-teal dark:bg-accent-teal/5 scale-[1.02]" : "border-slate-300 dark:border-slate-700 hover:border-primary dark:hover:border-accent-teal hover:bg-slate-100 dark:hover:bg-slate-800"}`,
              role: "button",
              tabIndex: 0,
              "aria-label": "Upload files for free trial",
              "aria-invalid": Boolean(fieldErrors.files),
              "aria-describedby": fieldErrors.files ? `${FREE_TRIAL_FIELD_IDS.files}-error` : undefined,
              onKeyDown: event => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  triggerFileInput();
                }
              },
              onDragEnter: handleDrag,
              onDragLeave: handleDrag,
              onDragOver: handleDrag,
              onDrop: handleDrop,
              onClick: triggerFileInput,
              children: [jsx("label", {
                htmlFor: FREE_TRIAL_FIELD_IDS.files,
                className: "sr-only",
                children: "Upload trial files"
              }), jsx("input", {
                id: FREE_TRIAL_FIELD_IDS.files,
                ref: fileInputRef,
                type: "file",
                className: "sr-only",
                multiple: true,
                accept: "image/*,video/*,.dng,.cr2,.cr3,.nef,.arw,.rw2,.orf,.psd,.tiff,.tif,.raw,.mp4,.mov,.avi,.mkv,.webm,.wmv,.flv,.mpeg,.mpg,.3gp,.m2ts,.mts",
                "aria-invalid": Boolean(fieldErrors.files),
                "aria-describedby": fieldErrors.files ? `${FREE_TRIAL_FIELD_IDS.files}-error` : undefined,
                onChange: handleChange
              }), jsx("div", {
                className: "w-16 h-16 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center mx-auto mb-6",
                children: jsx(Upload, {
                  className: `w-8 h-8 ${dragActive ? "text-primary dark:text-accent-teal" : "text-slate-400"}`
                })
              }), jsx("h3", {
                className: "text-lg font-bold text-slate-900 dark:text-white mb-2",
                children: "Drag & drop files here"
              }), jsx("p", {
                className: "text-slate-500 dark:text-slate-400 text-sm mb-6",
                children: "or click to browse files (images + videos)"
              }), jsx("span", {
                className: "inline-flex px-6 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold shadow-sm transition-colors",
                children: "Select Files"
              })]
            }), fieldErrors.files && jsx("p", {
              id: `${FREE_TRIAL_FIELD_IDS.files}-error`,
              className: "mt-3 text-sm text-red-600 dark:text-red-400",
              children: fieldErrors.files
            }), files.length > 0 && jsxs("div", {
              className: "mt-8 space-y-3 overflow-hidden",
              children: [jsxs("h4", {
                className: "text-sm font-bold text-slate-900 dark:text-white mb-4",
                children: ["Selected Files (", files.length, "/3)"]
              }), files.map((file, idx) => jsxs("div", {
                className: "flex w-full max-w-full items-start justify-between gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm animate-fade-in-up",
                children: [jsxs("div", {
                  className: "flex min-w-0 flex-1 items-center gap-3 overflow-hidden",
                  children: [jsx("div", {
                    className: "w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0",
                    children: /*#__PURE__*/React.createElement(FileImage, {
                      className: "w-5 h-5 text-primary dark:text-accent-teal"
                    })
                  }), jsxs("div", {
                    className: "min-w-0",
                    children: [jsx("p", {
                      className: "break-all text-sm font-medium leading-snug text-slate-700 dark:text-slate-200",
                      title: file.name,
                      children: file.name
                    }), jsxs("p", {
                      className: "text-xs text-slate-400",
                      children: [(file.size / 1024 / 1024).toFixed(2), " MB"]
                    })]
                  })]
                }), jsx("button", {
                  type: "button",
                  onClick: () => removeFile(idx),
                  className: "shrink-0 p-2 text-slate-400 hover:text-red-500 transition-colors",
                  children: /*#__PURE__*/React.createElement(X, {
                    size: 18
                  })
                })]
              }, idx))]
            })]
          }), jsxs("div", {
            className: "p-10 md:p-16 bg-white dark:bg-slate-900/50",
            children: [jsx("h3", {
              className: "text-2xl font-bold text-slate-900 dark:text-white mb-6",
              children: "Contact & Instructions"
            }), jsxs("form", {
              onSubmit: handleSubmit,
              className: "space-y-6",
              children: [jsxs("div", {
                className: "grid grid-cols-1 gap-6 sm:grid-cols-2",
                children: [jsxs("div", {
                  children: [jsx("label", {
                    htmlFor: FREE_TRIAL_FIELD_IDS.name,
                    className: "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2",
                    children: "Name"
                  }), jsx("input", {
                    id: FREE_TRIAL_FIELD_IDS.name,
                    "aria-invalid": Boolean(fieldErrors.name),
                    "aria-describedby": fieldErrors.name ? `${FREE_TRIAL_FIELD_IDS.name}-error` : undefined,
                    required: true,
                    type: "text",
                    className: "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary dark:focus:ring-accent-teal outline-none transition-all text-slate-900 dark:text-white",
                    placeholder: "John Doe",
                    value: formData.name,
                    onChange: event => updateField("name", event.target.value)
                  }), fieldErrors.name && jsx("p", {
                    id: `${FREE_TRIAL_FIELD_IDS.name}-error`,
                    className: "mt-2 text-sm text-red-600 dark:text-red-400",
                    children: fieldErrors.name
                  })]
                }), jsxs("div", {
                  children: [jsx("label", {
                    htmlFor: FREE_TRIAL_FIELD_IDS.email,
                    className: "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2",
                    children: "Email"
                  }), jsx("input", {
                    id: FREE_TRIAL_FIELD_IDS.email,
                    "aria-invalid": Boolean(fieldErrors.email),
                    "aria-describedby": fieldErrors.email ? `${FREE_TRIAL_FIELD_IDS.email}-error` : undefined,
                    required: true,
                    type: "email",
                    className: "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary dark:focus:ring-accent-teal outline-none transition-all text-slate-900 dark:text-white",
                    placeholder: "john@company.com",
                    value: formData.email,
                    onChange: event => updateField("email", event.target.value)
                  }), fieldErrors.email && jsx("p", {
                    id: `${FREE_TRIAL_FIELD_IDS.email}-error`,
                    className: "mt-2 text-sm text-red-600 dark:text-red-400",
                    children: fieldErrors.email
                  })]
                })]
              }), jsxs("div", {
                children: [jsx("label", {
                  htmlFor: FREE_TRIAL_FIELD_IDS.instructions,
                  className: "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2",
                  children: "Editing Instructions"
                }), jsx("textarea", {
                  id: FREE_TRIAL_FIELD_IDS.instructions,
                  "aria-invalid": Boolean(fieldErrors.instructions),
                  "aria-describedby": fieldErrors.instructions ? `${FREE_TRIAL_FIELD_IDS.instructions}-error` : undefined,
                  required: true,
                  className: "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary dark:focus:ring-accent-teal outline-none transition-all text-slate-900 dark:text-white h-32 resize-none",
                  placeholder: "e.g. Remove background, natural shadow, color correction...",
                  value: formData.instructions,
                  onChange: event => updateField("instructions", event.target.value)
                }), fieldErrors.instructions && jsx("p", {
                  id: `${FREE_TRIAL_FIELD_IDS.instructions}-error`,
                  className: "mt-2 text-sm text-red-600 dark:text-red-400",
                  children: fieldErrors.instructions
                })]
              }), jsx("input", {
                id: FREE_TRIAL_FIELD_IDS.website,
                type: "text",
                value: formData.website,
                onChange: event => updateField("website", event.target.value),
                tabIndex: -1,
                autoComplete: "off",
                className: "hidden",
                "aria-hidden": true
              }), jsxs("div", {
                className: "bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-start gap-3",
                children: [jsx("div", {
                  className: "mt-0.5",
                  children: /*#__PURE__*/React.createElement(CheckCircle, {
                    className: "w-5 h-5 text-blue-600 dark:text-blue-400"
                  })
                }), jsx("p", {
                  className: "text-sm text-blue-800 dark:text-blue-300",
                  children: "Your images are secure. We process them solely for this trial and delete them after 7 days if you don't proceed."
                })]
              }), status.message && jsx("p", {
                id: FREE_TRIAL_FIELD_IDS.status,
                role: "status",
                "aria-live": status.type === "error" ? "assertive" : "polite",
                "aria-atomic": "true",
                className: `text-sm font-medium ${status.type === "error" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`,
                children: status.message
              }), jsx("button", {
                type: "submit",
                disabled: files.length === 0 || isSubmitting,
                className: `w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${files.length === 0 ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed" : "bg-primary hover:bg-slate-800 dark:hover:bg-accent-teal text-white shadow-primary/20 hover:scale-[1.02] active:scale-95"}`,
                children: isSubmitting ? /*#__PURE__*/React.createElement(Fragment, {
                  children: [/*#__PURE__*/React.createElement(Loader2, {
                    className: "animate-spin"
                  })]
                }) : jsxs(Fragment, {
                  children: ["Start Free Trial", /*#__PURE__*/React.createElement(ArrowRight, {
                    size: 20
                  })]
                })
              })]
            })]
          })]
        })
      })]
    })
  });
};
export default FreeTrial;