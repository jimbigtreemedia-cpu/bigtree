<?php
declare(strict_types=1);

function h(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8");
}

function normalizeRoutePath(string $path): string
{
    $normalized = trim($path);
    if ($normalized === "") {
        return "/";
    }
    if ($normalized[0] !== "/") {
        $normalized = "/" . $normalized;
    }
    if (strlen($normalized) > 1) {
        $normalized = rtrim($normalized, "/");
    }
    return $normalized === "" ? "/" : $normalized;
}

function detectScheme(): string
{
    $forwarded = trim((string) ($_SERVER["HTTP_X_FORWARDED_PROTO"] ?? ""));
    if ($forwarded !== "") {
        $parts = explode(",", $forwarded);
        $candidate = strtolower(trim((string) ($parts[0] ?? "")));
        if ($candidate === "https") {
            return "https";
        }
    }

    $https = strtolower((string) ($_SERVER["HTTPS"] ?? ""));
    return ($https === "on" || $https === "1") ? "https" : "http";
}

$seoDefault = [
    "siteName" => "Big Tree Media Image Editing Agency",
    "title" => "Big Tree Media Image Editing Agency",
    "description" => "Big Tree Media is an image editing agency for ecommerce brands, delivering fast and high-quality retouching, background removal, clipping path, and post-production services.",
    "image" => "/og-image.svg",
    "imageAlt" => "Big Tree Media Image Editing Agency preview image",
    "type" => "website",
    "robots" => "index,follow",
];

$notFoundSeo = [
    "title" => "Page Not Found | Big Tree Media",
    "description" => "The page you requested could not be found. Explore Big Tree Media services, portfolio, and contact options.",
    "type" => "website",
    "robots" => "noindex,follow",
];

$routeSeo = [
    "/" => [
        "title" => "Big Tree Media Image Editing Agency | Ecommerce Photo Editing Services",
        "description" => "Professional ecommerce image editing services for fashion and jewelry brands, including retouching, ghost mannequin, model content, and post-production.",
        "type" => "website",
    ],
    "/services" => [
        "title" => "Clothing and Jewelry Editing Services | Big Tree Media",
        "description" => "Explore Big Tree Media services for clothing and jewelry brands: color correction, ghost mannequin, model image creation, social content, and full production pipelines.",
        "type" => "website",
    ],
    "/portfolio" => [
        "title" => "Portfolio and Case Studies | Big Tree Media",
        "description" => "View portfolio case studies across apparel and jewelry editing, including retouching, model imagery, ecommerce optimization, and social-ready visuals.",
        "type" => "website",
    ],
    "/process" => [
        "title" => "Image Editing Workflow Process | Big Tree Media",
        "description" => "Learn Big Tree Media AI plus human quality control workflow for ecommerce image editing, from upload and briefing to QA and final delivery.",
        "type" => "website",
    ],
    "/pricing" => [
        "title" => "Image Editing Pricing for Apparel and Jewelry | Big Tree Media",
        "description" => "Transparent per-image pricing for clothing and jewelry editing services, with scalable plans for ecommerce teams and high-volume catalogs.",
        "type" => "website",
    ],
    "/free-trial" => [
        "title" => "Free Trial Image Editing | Big Tree Media",
        "description" => "Upload up to 3 images and test Big Tree Media quality before scaling. Fast turnaround and ecommerce-ready output formats.",
        "type" => "website",
    ],
    "/contact" => [
        "title" => "Contact Big Tree Media | Ecommerce Editing Support",
        "description" => "Contact Big Tree Media for quotes, onboarding, and production planning for clothing and jewelry post-production services.",
        "type" => "website",
    ],
    "/team" => [
        "title" => "Our Editing Team | Big Tree Media",
        "description" => "Meet the retouchers, art directors, and workflow specialists behind Big Tree Media quality-first ecommerce image editing services.",
        "type" => "website",
    ],
    "/faq" => [
        "title" => "FAQ | Big Tree Media Image Editing Services",
        "description" => "Frequently asked questions about turnaround times, file upload process, pricing, revisions, and quality assurance at Big Tree Media.",
        "type" => "website",
    ],
    "/legal/privacy" => [
        "title" => "Privacy Policy | Big Tree Media",
        "description" => "Read Big Tree Media privacy policy covering data handling, file security, and client information practices.",
        "type" => "article",
    ],
    "/legal/terms" => [
        "title" => "Terms of Service | Big Tree Media",
        "description" => "Read Big Tree Media terms of service, including delivery scope, ownership, usage rights, and updates to service terms.",
        "type" => "article",
    ],
];

$scriptName = str_replace("\\", "/", (string) ($_SERVER["SCRIPT_NAME"] ?? "/index.php"));
$basePath = str_replace("\\", "/", dirname($scriptName));
$basePath = preg_replace('#/+#', '/', $basePath) ?? "/";
$basePath = rtrim($basePath, "/");
if ($basePath === "" || $basePath === ".") {
    $basePath = "/";
} elseif ($basePath[0] !== "/") {
    $basePath = "/" . $basePath;
}

$requestPath = parse_url((string) ($_SERVER["REQUEST_URI"] ?? "/"), PHP_URL_PATH);
$requestPath = is_string($requestPath) && $requestPath !== "" ? $requestPath : "/";

$routePath = $requestPath;
if ($basePath !== "/" && str_starts_with($routePath, $basePath)) {
    $routePath = substr($routePath, strlen($basePath));
    $routePath = $routePath === "" ? "/" : $routePath;
}
$routePath = normalizeRoutePath($routePath);

$siteData = [];
$dataStorePath = __DIR__ . DIRECTORY_SEPARATOR . "data-store.json";
if (is_file($dataStorePath)) {
    $rawData = file_get_contents($dataStorePath);
    if (is_string($rawData) && trim($rawData) !== "") {
        $decoded = json_decode($rawData, true);
        if (is_array($decoded)) {
            $siteData = $decoded;
        }
    }
}

$resolvedSeo = $seoDefault;
$isNotFound = false;
if (array_key_exists($routePath, $routeSeo)) {
    $resolvedSeo = array_merge($resolvedSeo, $routeSeo[$routePath]);
} elseif (str_starts_with($routePath, "/services/")) {
    $serviceId = urldecode(substr($routePath, strlen("/services/")));
    $serviceFound = false;
    if ($serviceId !== "" && strpos($serviceId, "/") === false) {
        $services = is_array($siteData["services"] ?? null) ? $siteData["services"] : [];
        foreach ($services as $service) {
            if (!is_array($service)) {
                continue;
            }
            if ((string) ($service["id"] ?? "") !== $serviceId) {
                continue;
            }
            $title = trim((string) ($service["seoTitle"] ?? ""));
            $description = trim((string) ($service["seoDescription"] ?? ""));
            if ($title === "") {
                $title = trim((string) ($service["title"] ?? "")) . " | Big Tree Media";
            }
            if ($description === "") {
                $description = trim((string) ($service["description"] ?? $service["fullDescription"] ?? ""));
            }
            $resolvedSeo = array_merge($resolvedSeo, [
                "title" => $title !== "" ? $title : $seoDefault["title"],
                "description" => $description !== "" ? $description : $seoDefault["description"],
                "type" => "article",
            ]);
            $serviceFound = true;
            break;
        }
    }
    if (!$serviceFound) {
        $isNotFound = true;
    }
} elseif (str_starts_with($routePath, "/portfolio/")) {
    $projectId = urldecode(substr($routePath, strlen("/portfolio/")));
    $projectFound = false;
    if ($projectId !== "" && strpos($projectId, "/") === false) {
        $projects = is_array($siteData["projects"] ?? null) ? $siteData["projects"] : [];
        foreach ($projects as $project) {
            if (!is_array($project)) {
                continue;
            }
            if ((string) ($project["id"] ?? "") !== $projectId) {
                continue;
            }
            $titleBase = trim((string) ($project["title"] ?? ""));
            $resolvedSeo = array_merge($resolvedSeo, [
                "title" => ($titleBase !== "" ? $titleBase : "Portfolio") . " Case Study | Big Tree Media Portfolio",
                "description" => trim((string) ($project["description"] ?? "")) ?: $seoDefault["description"],
                "type" => "article",
            ]);
            $projectFound = true;
            break;
        }
    }
    if (!$projectFound) {
        $isNotFound = true;
    }
} else {
    $isNotFound = true;
}

if ($isNotFound) {
    $resolvedSeo = array_merge($seoDefault, $notFoundSeo);
    http_response_code(404);
}

$title = trim((string) ($resolvedSeo["title"] ?? $seoDefault["title"]));
$description = trim((string) ($resolvedSeo["description"] ?? $seoDefault["description"]));
$type = trim((string) ($resolvedSeo["type"] ?? $seoDefault["type"]));
$robots = trim((string) ($resolvedSeo["robots"] ?? $seoDefault["robots"]));
$siteName = trim((string) ($resolvedSeo["siteName"] ?? $seoDefault["siteName"]));
$imageAlt = trim((string) ($resolvedSeo["imageAlt"] ?? $seoDefault["imageAlt"]));

$scheme = detectScheme();
$host = trim((string) ($_SERVER["HTTP_HOST"] ?? "localhost"));
$origin = $scheme . "://" . $host;
$appBasePath = $basePath === "/" ? "" : $basePath;

$canonicalPath = $routePath === "/" ? "/" : $routePath;
$canonicalUrl = $origin . $appBasePath . $canonicalPath;

$imagePath = trim((string) ($resolvedSeo["image"] ?? $seoDefault["image"]));
if (preg_match("/^https?:\\/\\//i", $imagePath) === 1) {
    $imageUrl = $imagePath;
} else {
    $normalizedImagePath = "/" . ltrim($imagePath, "/");
    $imageUrl = $origin . $appBasePath . $normalizedImagePath;
}

$assetPath = static function (string $path) use ($appBasePath): string {
    return ($appBasePath !== "" ? $appBasePath : "") . "/" . ltrim($path, "/");
};
?>
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="<?= h($description) ?>" />
    <meta name="robots" content="<?= h($robots) ?>" />
    <meta name="theme-color" content="#1a4d4a" />

    <link rel="canonical" href="<?= h($canonicalUrl) ?>" id="canonical-link" />
    <link rel="icon" type="image/svg+xml" href="<?= h($assetPath("favicon.svg")) ?>" />
    <link rel="shortcut icon" href="<?= h($assetPath("favicon.svg")) ?>" />
    <link rel="apple-touch-icon" href="<?= h($assetPath("favicon.svg")) ?>" />

    <meta property="og:site_name" content="<?= h($siteName) ?>" />
    <meta property="og:type" content="<?= h($type) ?>" />
    <meta property="og:title" content="<?= h($title) ?>" />
    <meta property="og:description" content="<?= h($description) ?>" />
    <meta property="og:url" content="<?= h($canonicalUrl) ?>" />
    <meta property="og:image" content="<?= h($imageUrl) ?>" />
    <meta property="og:image:alt" content="<?= h($imageAlt) ?>" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="<?= h($title) ?>" />
    <meta name="twitter:description" content="<?= h($description) ?>" />
    <meta name="twitter:image" content="<?= h($imageUrl) ?>" />

    <title><?= h($title) ?></title>
    <link rel="dns-prefetch" href="//esm.sh" />
    <link rel="preconnect" href="https://esm.sh" crossorigin />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="modulepreload" href="https://esm.sh/react@18.2.0" crossorigin />
    <link rel="modulepreload" href="https://esm.sh/react@18.2.0/jsx-runtime" crossorigin />
    <link rel="modulepreload" href="https://esm.sh/react-dom@18.2.0/client" crossorigin />
    <link rel="modulepreload" href="https://esm.sh/react-router-dom@6.30.1?external=react,react-dom" crossorigin />
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              primary: "#1a4d4a",
              "accent-teal": "#5f9ea0",
              "accent-gold": "#d4af37",
              "background-base": "#fafafb",
              "text-main": "#334155"
            },
            fontFamily: {
              display: ["Space Grotesk", "sans-serif"]
            },
            borderRadius: {
              xl: "1.25rem",
              "2xl": "1.75rem",
              "3xl": "2.5rem"
            }
          }
        }
      };
    </script>
    <style>
      html { scroll-behavior: smooth; }
      body { font-family: "Space Grotesk", sans-serif; }
      .soft-shadow {
        box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.04), 0 4px 10px -2px rgba(0, 0, 0, 0.02);
      }
      .premium-border {
        border: 1px solid rgba(0, 0, 0, 0.06);
      }
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      @keyframes free-trial-glow {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba(26, 77, 74, 0.18), 0 0 0 0 rgba(26, 77, 74, 0.08);
          transform: translateY(0);
        }
        50% {
          box-shadow: 0 0 0 3px rgba(26, 77, 74, 0.2), 0 0 24px 2px rgba(26, 77, 74, 0.28);
          transform: translateY(-1px);
        }
      }
      .free-trial-glow {
        animation: free-trial-glow 2.2s ease-in-out infinite;
        will-change: box-shadow, transform;
      }
      @keyframes sticky-home-cta-in {
        0% { opacity: 0; transform: translateY(18px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .sticky-home-cta { animation: sticky-home-cta-in 280ms ease-out; }
      @keyframes skeleton-shimmer {
        0% { background-position: 100% 0; }
        100% { background-position: -100% 0; }
      }
      .skeleton-block {
        background-color: #e2e8f0;
        background-image: linear-gradient(110deg, #e2e8f0 8%, #f8fafc 20%, #e2e8f0 33%);
        background-size: 220% 100%;
        animation: skeleton-shimmer 1.4s ease-in-out infinite;
      }
      .dark .skeleton-block {
        background-color: #334155;
        background-image: linear-gradient(110deg, #334155 8%, #475569 20%, #334155 33%);
      }
      @media (prefers-reduced-motion: reduce) {
        .free-trial-glow, .sticky-home-cta, .skeleton-block { animation: none; }
        .skeleton-block { background-image: none; }
      }
    </style>
    <script>
      (function () {
        var hash = window.location.hash || "";
        if (!hash.startsWith("#/")) return;

        var pathname = window.location.pathname.replace(/index\.(html|php)$/i, "");
        var basePath = pathname.replace(/\/$/, "");
        var hashPath = hash.slice(1);
        var nextPath = (basePath === "" || basePath === "/" ? "" : basePath) + hashPath;
        var nextUrl = nextPath + window.location.search;

        window.history.replaceState(null, "", nextUrl);
      })();
    </script>
    <script>
      (function () {
        var baseUrl = window.location.origin + window.location.pathname.replace(/index\.(html|php)$/i, "");
        var canonical = document.getElementById("canonical-link");
        var ogUrl = document.querySelector('meta[property="og:url"]');
        var ogImage = document.querySelector('meta[property="og:image"]');
        var twitterImage = document.querySelector('meta[name="twitter:image"]');
        var ogImageValue = ogImage ? ogImage.getAttribute("content") || "" : "";
        var twitterImageValue = twitterImage ? twitterImage.getAttribute("content") || "" : "";
        var absoluteOgImage = ogImageValue ? new URL(ogImageValue, window.location.origin).href : "";
        var absoluteTwitterImage = twitterImageValue ? new URL(twitterImageValue, window.location.origin).href : absoluteOgImage;

        if (canonical) canonical.href = baseUrl;
        if (ogUrl) ogUrl.content = baseUrl;
        if (ogImage && absoluteOgImage) ogImage.content = absoluteOgImage;
        if (twitterImage && absoluteTwitterImage) twitterImage.content = absoluteTwitterImage;
      })();
    </script>
    <script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18.2.0",
    "react/jsx-runtime": "https://esm.sh/react@18.2.0/jsx-runtime",
    "react-dom": "https://esm.sh/react-dom@18.2.0",
    "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
    "react-router-dom": "https://esm.sh/react-router-dom@6.30.1?external=react,react-dom",
    "lucide-react": "https://esm.sh/lucide-react@0.564.0?external=react"
  }
}
    </script>
  </head>
  <body class="bg-background-base text-text-main antialiased selection:bg-accent-teal selection:text-white dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
    <div id="root"></div>
    <script type="module" src="<?= h($assetPath("index.js")) ?>"></script>
  </body>
</html>
