import re
import os

def convert_jsx_to_native(content):
    """Convert jsx() and jsxs() function calls to native JSX syntax"""
    
    # Remove jsx-runtime imports
    content = re.sub(r'import\s*\{[^}]*(?:jsx|jsxs)[^}]*\}\s*from\s*[\'"]react/jsx-runtime[\'"];?\n?', '', content)
    
    # Add React import if not present
    if 'import React' not in content and "import React from 'react'" not in content:
        # Find first import line and add React import before it
        match = re.search(r'^import\s+', content, re.MULTILINE)
        if match:
            content = content[:match.start()] + 'import React from "react";\n' + content[match.start():]
    
    return content

files = [
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
]

for filepath in files:
    full_path = f'/workspace/{filepath}'
    if not os.path.exists(full_path):
        continue
    
    with open(full_path, 'r') as f:
        content = f.read()
    
    new_content = convert_jsx_to_native(content)
    
    with open(full_path, 'w') as f:
        f.write(new_content)
    
    print(f"Processed {filepath}")

print("Done!")
