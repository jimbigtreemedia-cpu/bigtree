module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  
  // Remove jsx-runtime imports
  root.find(j.ImportDeclaration, {
    source: { value: 'react/jsx-runtime' }
  }).remove();
  
  // Find all jsx() and jsxs() calls and convert them
  let modified = false;
  
  // This transform converts jsx/jsxs calls to JSX elements
  root.find(j.CallExpression, {
    callee: { name: (name) => name === 'jsx' || name === 'jsxs' }
  }).forEach(path => {
    const args = path.node.arguments;
    if (args.length < 2) return;
    
    const tagName = args[0].value;
    const propsObj = args[1];
    
    if (propsObj.type !== 'ObjectExpression') return;
    
    // Create JSX opening element
    const openingElement = j.jsxOpeningElement(
      j.jsxIdentifier(tagName),
      []
    );
    
    // Convert props
    const attributes = [];
    let children = null;
    
    propsObj.properties.forEach(prop => {
      if (prop.key.name === 'children') {
        children = prop.value;
      } else if (prop.type === 'Property' || prop.type === 'ObjectProperty') {
        const attrName = prop.key.name || prop.key.value;
        let attrValue;
        
        if (prop.value.type === 'StringLiteral') {
          attrValue = j.literal(prop.value.value);
        } else {
          attrValue = prop.value;
        }
        
        attributes.push(
          j.jsxAttribute(
            j.jsxIdentifier(attrName),
            j.jsxExpressionContainer(attrValue)
          )
        );
      }
    });
    
    openingElement.attributes = attributes;
    
    // Create closing element or self-closing
    let jsxElement;
    if (children) {
      openingElement.selfClosing = false;
      const closingElement = j.jsxClosingElement(j.jsxIdentifier(tagName));
      
      // Convert children
      let convertedChildren;
      if (children.type === 'ArrayExpression') {
        convertedChildren = children.elements.filter(c => c).map(child => {
          if (child.type === 'CallExpression' && 
              (child.callee.name === 'jsx' || child.callee.name === 'jsxs')) {
            // Recursively convert
            return convertJsxCall(j, child);
          }
          return child;
        });
      } else if (children.type === 'CallExpression' && 
                 (children.callee.name === 'jsx' || children.callee.name === 'jsxs')) {
        convertedChildren = [convertJsxCall(j, children)];
      } else {
        convertedChildren = [children];
      }
      
      jsxElement = j.jsxElement(
        openingElement,
        closingElement,
        convertedChildren
      );
    } else {
      openingElement.selfClosing = true;
      jsxElement = j.jsxElement(openingElement, null, []);
    }
    
    path.replace(jsxElement);
    modified = true;
  });
  
  function convertJsxCall(j, callNode) {
    const args = callNode.arguments;
    if (args.length < 2) return callNode;
    
    const tagName = args[0].value;
    const propsObj = args[1];
    
    if (propsObj.type !== 'ObjectExpression') return callNode;
    
    const openingElement = j.jsxOpeningElement(
      j.jsxIdentifier(tagName),
      []
    );
    
    const attributes = [];
    let children = null;
    
    propsObj.properties.forEach(prop => {
      if (prop.key.name === 'children') {
        children = prop.value;
      } else if (prop.type === 'Property' || prop.type === 'ObjectProperty') {
        const attrName = prop.key.name || prop.key.value;
        attributes.push(
          j.jsxAttribute(
            j.jsxIdentifier(attrName),
            j.jsxExpressionContainer(prop.value)
          )
        );
      }
    });
    
    let jsxElement;
    if (children) {
      openingElement.selfClosing = false;
      const closingElement = j.jsxClosingElement(j.jsxIdentifier(tagName));
      
      let convertedChildren;
      if (children.type === 'ArrayExpression') {
        convertedChildren = children.elements.filter(c => c).map(child => {
          if (child.type === 'CallExpression' && 
              (child.callee.name === 'jsx' || child.callee.name === 'jsxs')) {
            return convertJsxCall(j, child);
          }
          return child;
        });
      } else {
        convertedChildren = [children];
      }
      
      jsxElement = j.jsxElement(
        openingElement,
        closingElement,
        convertedChildren
      );
    } else {
      openingElement.selfClosing = true;
      jsxElement = j.jsxElement(openingElement, null, []);
    }
    
    return jsxElement;
  }
  
  return modified ? root.toSource() : fileInfo.source;
};
