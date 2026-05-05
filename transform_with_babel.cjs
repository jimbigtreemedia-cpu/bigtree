const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

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

const babelOptions = {
  presets: [['@babel/preset-react', { runtime: 'classic' }]],
  filename: 'file.tsx',
  retainLines: true
};

files.forEach(file => {
  const filePath = path.join('/workspace', file);
  if (!fs.existsSync(filePath)) return;
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  try {
    const result = babel.transformSync(content, babelOptions);
    if (result && result.code) {
      // Add React import if not present
      let code = result.code;
      if (!code.includes('import React')) {
        code = 'import React from "react";\n' + code;
      }
      fs.writeFileSync(filePath, code);
      console.log(`✓ Transformed: ${file}`);
    }
  } catch (err) {
    console.error(`✗ Error transforming ${file}:`, err.message);
  }
});

console.log('Done!');
