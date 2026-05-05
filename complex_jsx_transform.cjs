const fs = require('fs');
const path = require('path');

// Complex parser to convert jsx() and jsxs() calls to JSX
function parseJsxStructure(content) {
  // We need to handle nested structures like:
  // jsx("div", { className: "foo", children: jsx("span", { children: "text" }) })
  // This requires a proper parser
  
  let result = content;
  
  // Strategy: Use regex to find and replace jsx/jsxs calls iteratively
  // Start from the innermost calls and work outward
  
  let iterations = 0;
  const maxIterations = 100;
  
  while ((result.includes('jsx(') || result.includes('jsxs(')) && iterations < maxIterations) {
    iterations++;
    
    // Find innermost jsx call (one that doesn't contain other jsx calls in its children)
    // Pattern: jsx("tag", { ... children: ... })
    
    // Match jsx("tag", { props })
    const jsxPattern = /jsx\s*\(\s*["']([^"']+)["']\s*,\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}\s*\)/g;
    
    // Match jsxs("tag", { props })  
    const jsxsPattern = /jsxs\s*\(\s*["']([^"']+)["']\s*,\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}\s*\)/g;
    
    // Try to replace jsx calls first
    result = result.replace(jsxPattern, (match, tag, propsStr) => {
      try {
        return convertSingleJsx(tag, propsStr);
      } catch (e) {
        return match; // Keep original if conversion fails
      }
    });
    
    // Then try jsxs calls
    result = result.replace(jsxsPattern, (match, tag, propsStr) => {
      try {
        return convertSingleJsx(tag, propsStr);
      } catch (e) {
        return match;
      }
    });
  }
  
  return result;
}

function convertSingleJsx(tag, propsStr) {
  // Parse props string into actual props
  let props = {};
  
  // Handle children specially
  let children = null;
  let childrenMatch = propsStr.match(/children:\s*(\[.*?\]|jsx\s*\([^)]+\)|jsxs\s*\([^)]+\))/s);
  if (childrenMatch) {
    children = childrenMatch[1];
    // Remove children from props string for parsing
    propsStr = propsStr.replace(/children:\s*(?:\[.*?\]|jsx\s*\([^)]+\)|jsxs\s*\([^)]+\))/s, '');
  }
  
  // Simple prop parsing (handles strings, numbers, booleans, simple objects)
  const propPattern = /([a-zA-Z_$][\w$]*)\s*:\s*(?:"([^"]*)"|'([^']*)'|(\d+)|(true|false)|(\{[^}]*\})|([a-zA-Z_$][\w$]*))/g;
  let propMatch;
  while ((propMatch = propPattern.exec(propsStr)) !== null) {
    const propName = propMatch[1];
    const value = propMatch[2] || propMatch[3] || propMatch[4] || propMatch[5] || propMatch[6] || propMatch[7];
    props[propName] = value;
  }
  
  // Build JSX string
  let jsxStr = `<${tag}`;
  
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null) continue;
    
    // Format value
    let formattedValue;
    if (value === 'true') {
      formattedValue = `{true}`;
    } else if (value === 'false') {
      formattedValue = `{false}`;
    } else if (/^\d+$/.test(value)) {
      formattedValue = `{${value}}`;
    } else if (value.startsWith('{') || value.startsWith('(')) {
      formattedValue = `{${value}}`;
    } else {
      // String value
      formattedValue = `"${value}"`;
    }
    
    jsxStr += ` ${key}=${formattedValue}`;
  }
  
  if (children) {
    // Convert children
    let childrenStr = children;
    if (children.startsWith('[') && children.endsWith(']')) {
      // Array of children - remove brackets and commas between elements
      childrenStr = children.slice(1, -1).replace(/,\s*(?=\s*(?:jsx|jsxs|\s*"[^"]*"|\s*'\''|\s*\d))/g, ' ');
    }
    
    // Recursively convert any jsx/jsxs in children
    childrenStr = parseJsxStructure(childrenStr);
    
    jsxStr += `>${childrenStr}</${tag}>`;
  } else {
    jsxStr += ` />`;
  }
  
  return jsxStr;
}

// Test with a file
const testFile = '/workspace/components/FreeTrial.tsx';
if (fs.existsSync(testFile)) {
  let content = fs.readFileSync(testFile, 'utf8');
  console.log("Original has jsx:", content.includes('jsx('));
  const converted = parseJsxStructure(content);
  console.log("Converted has jsx:", converted.includes('jsx('));
  
  if (!converted.includes('jsx(') && !converted.includes('jsxs(')) {
    console.log("SUCCESS: All jsx/jsxs calls converted!");
  } else {
    console.log("Still has jsx/jsxs calls");
  }
}
