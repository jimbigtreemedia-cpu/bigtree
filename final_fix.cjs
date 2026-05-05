const fs = require('fs');
const path = require('path');

// Get all .tsx files in components and pages
const dirs = ['components', 'pages'];
let count = 0;

dirs.forEach(dir => {
  const dirPath = path.join('/workspace', dir);
  if (!fs.existsSync(dirPath)) return;
  
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.tsx'));
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has jsx/jsxs calls
    if (!content.includes('jsx(') && !content.includes('jsxs(')) {
      return;
    }
    
    console.log(`Processing ${dir}/${file}...`);
    count++;
    
    // Remove jsx-runtime imports
    content = content.replace(/import\s*\{[^}]*(?:jsx|jsxs)[^}]*\}\s*from\s*['"]react\/jsx-runtime['"];?\n?/g, '');
    
    // Add React import if not present
    if (!content.includes('import React')) {
      const match = content.match(/^import\s+/m);
      if (match) {
        content = content.slice(0, match.index) + 'import React from "react";\n' + content.slice(match.index);
      }
    }
    
    fs.writeFileSync(filePath, content);
  });
});

console.log(`Processed ${count} files with jsx/jsxs calls`);
