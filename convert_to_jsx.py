import re
import os

def convert_jsxs_to_jsx(content):
    """Convert jsx() and jsxs() calls to proper JSX syntax"""
    
    # This is a complex transformation - we'll use a state machine approach
    # First, let's handle simple cases and build up
    
    lines = content.split('\n')
    result_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Skip lines that are just jsx/jsxs function calls at the start
        if re.match(r'^\s*(return\s+)?(jsx|jsxs)\s*\(', line):
            # We need to parse this structure and convert it
            converted = parse_jsx_call(lines, i)
            if converted:
                result_lines.extend(converted[0])
                i = converted[1]
                continue
        
        result_lines.append(line)
        i += 1
    
    return '\n'.join(result_lines)

def parse_jsx_call(lines, start_idx):
    """Parse a jsx/jsxs call and convert to JSX"""
    # This is complex - let's try a different approach
    return None, start_idx + 1

# Actually, let's use a simpler regex-based approach for the specific pattern
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

for filepath in files_to_fix:
    full_path = f'/workspace/{filepath}'
    if not os.path.exists(full_path):
        continue
    
    with open(full_path, 'r') as f:
        content = f.read()
    
    # Remove any remaining jsx-runtime imports
    content = re.sub(r'import\s*\{[^}]*(?:jsx|jsxs)[^}]*\}\s*from\s*[\'"]react/jsx-runtime[\'"];?\n?', '', content)
    
    with open(full_path, 'w') as f:
        f.write(content)
    
    print(f"Cleaned imports from {filepath}")

print("Done cleaning imports")
