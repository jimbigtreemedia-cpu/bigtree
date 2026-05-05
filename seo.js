export const SEO_DEFAULT = {
    siteName: "Big Tree Media Image Editing Agency",
    title: "Big Tree Media Image Editing Agency",
    description: "Big Tree Media is an image editing agency for ecommerce brands, delivering fast and high-quality retouching, background removal, clipping path, and post-production services.",
    image: "/og-image.svg",
    imageAlt: "Big Tree Media Image Editing Agency preview image",
    type: "website",
    robots: "index,follow"
};

export const NOT_FOUND_SEO = {
    title: "Page Not Found | Big Tree Media",
    description: "The page you requested could not be found. Explore Big Tree Media services, portfolio, and contact options.",
    type: "website",
    robots: "noindex,follow"
};

export const ROUTE_SEO = {
    "/": {
        title: "Big Tree Media Image Editing Agency | Ecommerce Photo Editing Services",
        description: "Professional ecommerce image editing services for fashion and jewelry brands, including retouching, ghost mannequin, model content, and post-production.",
        type: "website"
    },
    "/services": {
        title: "Clothing and Jewelry Editing Services | Big Tree Media",
        description: "Explore Big Tree Media services for clothing and jewelry brands: color correction, ghost mannequin, model image creation, social content, and full production pipelines.",
        type: "website"
    },
    "/portfolio": {
        title: "Portfolio and Case Studies | Big Tree Media",
        description: "View portfolio case studies across apparel and jewelry editing, including retouching, model imagery, ecommerce optimization, and social-ready visuals.",
        type: "website"
    },
    "/process": {
        title: "Image Editing Workflow Process | Big Tree Media",
        description: "Learn Big Tree Media AI plus human quality control workflow for ecommerce image editing, from upload and briefing to QA and final delivery.",
        type: "website"
    },
    "/pricing": {
        title: "Image Editing Pricing for Apparel and Jewelry | Big Tree Media",
        description: "Transparent per-image pricing for clothing and jewelry editing services, with scalable plans for ecommerce teams and high-volume catalogs.",
        type: "website"
    },
    "/free-trial": {
        title: "Free Trial Image Editing | Big Tree Media",
        description: "Upload up to 3 images and test Big Tree Media quality before scaling. Fast turnaround and ecommerce-ready output formats.",
        type: "website"
    },
    "/contact": {
        title: "Contact Big Tree Media | Ecommerce Editing Support",
        description: "Contact Big Tree Media for quotes, onboarding, and production planning for clothing and jewelry post-production services.",
        type: "website"
    },
    "/team": {
        title: "Our Editing Team | Big Tree Media",
        description: "Meet the retouchers, art directors, and workflow specialists behind Big Tree Media quality-first ecommerce image editing services.",
        type: "website"
    },
    "/faq": {
        title: "FAQ | Big Tree Media Image Editing Services",
        description: "Frequently asked questions about turnaround times, file upload process, pricing, revisions, and quality assurance at Big Tree Media.",
        type: "website"
    },
    "/legal/privacy": {
        title: "Privacy Policy | Big Tree Media",
        description: "Read Big Tree Media privacy policy covering data handling, file security, and client information practices.",
        type: "article"
    },
    "/legal/terms": {
        title: "Terms of Service | Big Tree Media",
        description: "Read Big Tree Media terms of service, including delivery scope, ownership, usage rights, and updates to service terms.",
        type: "article"
    }
};

export const getServiceSeo = (service) => ({
    title: service.seoTitle || `${service.title} | Big Tree Media`,
    description: service.seoDescription || service.description || service.fullDescription || SEO_DEFAULT.description,
    type: "article",
    robots: SEO_DEFAULT.robots
});

export const getPortfolioSeo = (project) => ({
    title: `${project.title} Case Study | Big Tree Media Portfolio`,
    description: project.description || SEO_DEFAULT.description,
    type: "article",
    robots: SEO_DEFAULT.robots
});
