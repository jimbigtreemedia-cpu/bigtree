import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Instagram as InstagramIcon, Linkedin as LinkedinIcon, Twitter as TwitterIcon, Facebook as FacebookIcon, MapPin, Send, ChevronRight, Link as LinkIcon } from "lucide-react";
import { siteData } from "../data";

const NEWSLETTER_ENDPOINT = "/backend/api/newsletter-subscribe.php";

const iconMap: Record<string, React.ReactNode> = {
  Instagram: <InstagramIcon size={20} />,
  LinkedIn: <LinkedinIcon size={20} />,
  Twitter: <TwitterIcon size={20} />,
  Facebook: <FacebookIcon size={20} />
};
const Footer = () => {
  const { general } = siteData;
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterWebsite, setNewsletterWebsite] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState({ type: "", message: "" });
  const [isSubscribing, setIsSubscribing] = useState(false);
  const companyLinks = [
    { name: "About Us", to: "/team" },
    { name: "Portfolio", to: "/portfolio" },
    { name: "Pricing", to: "/pricing" },
    { name: "Process", to: "/process" },
    { name: "Contact", to: "/contact" },
    { name: "FAQ", to: "/faq" }
  ];
  const serviceLinks = [
    { label: "Color Correction / Matching", id: "ecommerce-packshots" },
    { label: "Ghost Mannequin Editing", id: "ghost-mannequin" },
    { label: "Clothing Image to Model", id: "ai-fashion-models" },
    { label: "Clothing Social Content", id: "clothing-branding-social-media" },
    { label: "Jewelry Image Retouching", id: "jewelry-image-retouching" },
    { label: "Jewelry Color Change", id: "jewelry-color-change" },
    { label: "Jewelry Social Content", id: "jewelry-branding-social-media" }
  ];
  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();
    if (isSubscribing) {
      return;
    }

    setNewsletterStatus({ type: "", message: "" });
    setIsSubscribing(true);

    try {
      const response = await fetch(NEWSLETTER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: newsletterEmail,
          source: "footer",
          website: newsletterWebsite
        })
      });

      const payload = await response.json().catch(() => ({
        ok: false,
        error: "Invalid server response."
      }));

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Failed to subscribe.");
      }

      setNewsletterStatus({
        type: "success",
        message: payload.message || "Subscribed successfully."
      });
      setNewsletterEmail("");
      setNewsletterWebsite("");
    } catch (error) {
      setNewsletterStatus({
        type: "error",
        message: error?.message || "Failed to subscribe."
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-t border-black/5 dark:border-slate-800 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent-teal/5 dark:bg-accent-teal/10 rounded-full blur-[150px] -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-gold/5 dark:bg-accent-gold/10 rounded-full blur-[120px] translate-y-1/2 translate-x-1/2" />
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Link className="flex items-center gap-3 mb-6" to="/">
              <img src={general.logo} alt="Big Tree Media Logo" className="h-10 w-10 rounded-lg shadow-lg shadow-primary/10" />
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Big Tree Media</span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">Premium e-commerce image editing and AI post-production. Transforming fashion and jewelry photography with expert precision.</p>
            <div className="flex items-center gap-3">
              {general.socials.map((social, i) => (
                <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white dark:hover:bg-accent-teal transition-all duration-300 hover:scale-110" aria-label={`Visit our ${social.platform} page`}>
                  {iconMap[social.platform] || <LinkIcon size={20} />}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-6">Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map((item) => (
                <li key={item.id}>
                  <button onClick={() => navigate(`/services/${item.id}`)} className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-accent-teal transition-colors duration-200 flex items-center gap-2 group text-left w-full">
                    <ChevronRight size={16} className="text-slate-400 dark:text-slate-600 group-hover:text-primary dark:group-hover:text-accent-teal transition-colors" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-6">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item.name}>
                  <Link to={item.to} className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-accent-teal transition-colors duration-200 flex items-center gap-2 group">
                    <ChevronRight size={16} className="text-slate-400 dark:text-slate-600 group-hover:text-primary dark:group-hover:text-accent-teal transition-colors" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-6">Stay Updated</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">Subscribe to get the latest updates and offers.</p>
            <form className="space-y-3" onSubmit={handleNewsletterSubmit}>
              <input type="email" placeholder="Enter your email" className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary dark:focus:border-accent-teal focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm" value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} required />
              <input type="text" value={newsletterWebsite} onChange={(event) => setNewsletterWebsite(event.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              {newsletterStatus.message && <p className={`text-sm font-medium ${newsletterStatus.type === "error" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>{newsletterStatus.message}</p>}
              <button type="submit" data-analytics-cta="footer_newsletter_subscribe" data-analytics-section="footer_newsletter" disabled={isSubscribing} className="w-full h-11 px-6 rounded-lg bg-primary text-white font-semibold hover:bg-slate-800 dark:hover:bg-accent-teal transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed">
                <Send size={18} />
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 text-sm mb-3">
                <Mail size={16} className="text-slate-400 dark:text-slate-500" />
                <a href={`mailto:${general.email}`} className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-accent-teal">{general.email}</a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-slate-400 dark:text-slate-500" />
                <span className="text-slate-600 dark:text-slate-400">{general.address}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 dark:text-slate-500 text-sm text-center md:text-left">&copy; {(new Date()).getFullYear()} Big Tree Media Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/legal/privacy" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent-teal transition-colors">Privacy Policy</Link>
            <Link to="/legal/terms" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent-teal transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
