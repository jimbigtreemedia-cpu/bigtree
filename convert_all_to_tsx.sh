#!/bin/bash

# Convert all .js files in components and pages to .tsx
for file in components/*.js pages/*.js; do
    if [ -f "$file" ]; then
        # Get the base name without extension
        base="${file%.js}"
        
        # Convert to .tsx
        mv "$file" "${base}.tsx"
        echo "Converted $file to ${base}.tsx"
    fi
done

echo "Done converting all JS files to TSX!"
