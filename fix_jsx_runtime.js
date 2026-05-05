const fs = require('fs');
const path = require('path');

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
  
  // Remove import statements for jsx/jsxs
  content = content.replace(/import\s*\{\s*(jsx|jsxs)[^}]*\}\s*from\s*['"]react\/jsx-runtime['"];?\n?/g, '');
  content = content.replace(/import\s*\{\s*jsx,\s*jsxs\s*\}\s*from\s*['"]react\/jsx-runtime['"];?\n?/g, '');
  content = content.replace(/import\s*\{[^}]*jsx[^}]*\}\s*from\s*['"]react\/jsx-runtime['"];?\n?/g, '');
  
  // Replace jsxs(...) with direct JSX (multi-element arrays)
  // This is a simplified conversion - we need to handle the actual JSX structure
  
  fs.writeFileSync(filePath, content);
  console.log(`Processed: ${file}`);
});

console.log('Done removing jsx-runtime imports');
