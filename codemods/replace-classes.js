const fs = require('fs');
const path = require('path');

// Simple class replacement mapping
const classMappings = {
  // Add common utility class mappings here
  'u-gap-md': 'gap-6',
  'u-flex': 'flex',
  'u-items-center': 'items-center',
  'u-justify-center': 'justify-center',
  'u-text-center': 'text-center',
  'u-mt-4': 'mt-4',
  'u-mb-4': 'mb-4',
  'u-p-4': 'p-4',
  'u-bg-primary': 'bg-primary',
  'u-text-primary': 'text-primary',
  'u-rounded': 'rounded-md',
  'u-shadow': 'shadow-primary',
};

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let newContent = content;

    // Replace class names in template strings and HTML-like content
    Object.entries(classMappings).forEach(([oldClass, newClass]) => {
      const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
      if (regex.test(newContent)) {
        newContent = newContent.replace(regex, newClass);
        modified = true;
        console.log(`Replaced ${oldClass} with ${newClass} in ${filePath}`);
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, newContent);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other build directories
      if (!['node_modules', 'dist', 'build', '.git'].includes(file)) {
        walkDirectory(filePath);
      }
    } else if (stat.isFile()) {
      // Process TypeScript and JavaScript files
      if (file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.tsx') || file.endsWith('.jsx')) {
        processFile(filePath);
      }
    }
  });
}

// Start from src directory
const srcDir = path.join(__dirname, '../src');
if (fs.existsSync(srcDir)) {
  console.log('Starting codemod processing...');
  walkDirectory(srcDir);
  console.log('Codemod processing complete.');
} else {
  console.log('src directory not found, skipping codemod processing.');
}