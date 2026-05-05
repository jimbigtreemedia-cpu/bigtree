const fs = require('fs');
const path = require('path');

// This script will manually convert jsx/jsxs calls to JSX syntax
function convertJsxCalls(content) {
  // Remove any remaining jsx/jsxs imports
  content = content.replace(/import\s*\{[^}]*(?:jsx|jsxs)[^}]*\}\s*from\s*['"]react\/jsx-runtime['"];?\n?/g, '');
  
  // The babel transform didn't work properly, so we need a different approach
  // Let's check if the file still has jsx( calls
  if (!content.includes('jsx(') && !content.includes('jsxs(')) {
    return content;
  }
  
  console.log("File still has jsx/jsxs calls, needs manual fix");
  return content;
}

const files = [
  'components/FreeTrial.tsx',
  'components/Hero.tsx',
  'components/HomePricingPreview.tsx',
  'components/HomeServiceSnippet.tsx',
  'components/HomeStickyTrialCTA.tsx',
  'components/Legal.tsx',
  'components/Navbar.tsx',
  'components/Portfolio.tsx',
  'components/Pricing.tsx',
  'components/Process.tsx',
  'components/Services.tsx',
  'components/Skeletons.tsx',
  'components/Team.tsx',
  'components/Testimonials.tsx',
  'pages/HomePage.tsx',
  'pages/NotFoundPage.tsx',
  'pages/PortfolioDetailPage.tsx',
  'pages/ServiceDetailPage.tsx'
];

files.forEach(file => {
  const filePath = path.join('/workspace', file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const newContent = convertJsxCalls(content);
  fs.writeFileSync(filePath, newContent);
});

console.log("Check complete");
