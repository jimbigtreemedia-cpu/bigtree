import re
import os

def convert_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # First, let's check if this file has jsx/jsxs calls
    if 'jsx(' not in content and 'jsxs(' not in content:
        return False
    
    print(f"Processing {filepath}...")
    
    # We need to convert jsx() and jsxs() calls to JSX
    # Pattern: jsx("tag", { props..., children: ... })
    # Pattern: jsxs("tag", { props..., children: [...] })
    
    # This is very complex, so let's use a different approach
    # We'll use babel to transform these files
    
    return True

files_to_fix = [
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

for f in files_to_fix:
    full_path = f'/workspace/{f}'
    if os.path.exists(full_path):
        convert_file(full_path)

print("Check complete")
