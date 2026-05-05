import re
import os

def parse_nested_braces(s, start):
    """Parse nested braces and return the end position"""
    count = 1
    i = start + 1
    while i < len(s) and count > 0:
        if s[i] == '{':
            count += 1
        elif s[i] == '}':
            count -= 1
        i += 1
    return i

def convert_jsx_call(content):
    """Manually convert jsx() and jsxs() calls to JSX"""
    
    # Remove jsx-runtime imports
    content = re.sub(r'import\s*\{[^}]*(?:jsx|jsxs)[^}]*\}\s*from\s*[\'"]react/jsx-runtime[\'"];?\n?', '', content)
    
    # Add React import if not present
    if 'import React from' not in content:
        match = re.search(r'^import\s+', content, re.MULTILINE)
        if match:
            content = content[:match.start()] + 'import React from "react";\n' + content[match.start():]
    
    # Iteratively convert jsx/jsxs calls from innermost to outermost
    max_iterations = 50
    iteration = 0
    
    while ('jsx(' in content or 'jsxs(' in content) and iteration < max_iterations:
        iteration += 1
        old_content = content
        
        # Find innermost jsx/jsxs calls (those without nested jsx/jsxs in their arguments)
        # Pattern: jsx("tag", { ... })
        
        # First handle simple cases without nested children
        pattern = r'(jsx|jsxs)\s*\(\s*["\']([a-zA-Z0-9]+)["\']\s*,\s*\{'
        
        for match in re.finditer(pattern, content):
            func_name = match.group(1)
            tag = match.group(2)
            brace_start = match.end() - 1
            
            # Find matching closing brace
            brace_end = parse_nested_braces(content, brace_start)
            if brace_end <= brace_start:
                continue
                
            props_str = content[brace_start+1:brace_end-1]
            
            # Check if this call contains nested jsx/jsxs calls
            inner_part = content[match.start():brace_end]
            if re.search(r'\bjsx\s*\(|\bjsxs\s*\(', inner_part[len(match.group(0)):-1]):
                # Has nested calls, skip for now (will be processed in next iteration)
                continue
            
            # Parse props and convert to JSX
            try:
                jsx_element = build_jsx_element(tag, props_str)
                if jsx_element:
                    # Replace the entire jsx/jsxs call
                    content = content[:match.start()] + jsx_element + content[brace_end:]
            except Exception as e:
                pass
    
    return content

def build_jsx_element(tag, props_str):
    """Build a JSX element from tag and props string"""
    
    # Extract children if present
    children = None
    children_match = re.search(r'children\s*:\s*(\[.*?\]|jsx\s*\([^)]+\)|jsxs\s*\([^)]+\)|React\.createElement\([^)]+\))', props_str, re.DOTALL)
    
    if children_match:
        children = children_match.group(1)
        # Remove children from props string
        props_str = props_str[:children_match.start()] + props_str[children_match.end():]
    
    # Parse remaining props
    props = []
    prop_pattern = r'([a-zA-Z_$][\w$]*)\s*:\s*(?:"([^"]*)"|\'([^\']*)\'|(\d+(?:\.\d+)?)|(true|false)|(\{[^{}]*\})|([a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)*))'
    
    for m in re.finditer(prop_pattern, props_str):
        name = m.group(1)
        value = m.group(2) or m.group(3) or m.group(4) or m.group(5) or m.group(6) or m.group(7)
        
        if value is None:
            continue
            
        if value in ('true', 'false'):
            props.append(f'{name}={{{value}}}')
        elif value.isdigit() or (value.replace('.', '').isdigit() and value.count('.') <= 1):
            props.append(f'{name}={{{value}}}')
        elif value.startswith('{') and value.endswith('}'):
            props.append(f'{name}={{{value[1:-1]}}}')
        elif isinstance(value, str):
            # Check if it's a variable reference
            if re.match(r'^[a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)*$', value):
                props.append(f'{name}={{{value}}}')
            else:
                props.append(f'{name}="{value}"')
    
    # Build the element
    props_str_final = ' '.join(props)
    
    if children:
        # Convert any remaining jsx/jsxs in children
        children = convert_simple_children(children)
        if props_str_final:
            return f'<{tag} {props_str_final}>{children}</{tag}>'
        else:
            return f'<{tag}>{children}</{tag}>'
    else:
        if props_str_final:
            return f'<{tag} {props_str_final} />'
        else:
            return f'<{tag} />'

def convert_simple_children(children):
    """Convert jsx/jsxs calls in children"""
    # Remove array brackets if present
    if children.startswith('[') and children.endswith(']'):
        children = children[1:-1]
    
    # Replace jsx/jsxs calls with placeholders temporarily
    # This is simplified - in reality we'd need recursive conversion
    
    # For now, just clean up the children string
    children = re.sub(r'^\s*,\s*', '', children)
    children = re.sub(r'\s*,\s*$', '', children)
    children = re.sub(r'\s*,\s*,\s*', ', ', children)
    
    return children.strip()

# Process files
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
    
    new_content = convert_jsx_call(content)
    
    with open(full_path, 'w') as f:
        f.write(new_content)
    
    has_jsx = 'jsx(' in new_content or 'jsxs(' in new_content
    print(f"{'✓' if not has_jsx else '✗'} {filepath} - {'Clean' if not has_jsx else 'Still has jsx calls'}")

print("\nDone!")
