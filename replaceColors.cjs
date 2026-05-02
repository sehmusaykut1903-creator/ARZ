const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
};

const files = walk('src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace colors with their respective css variables
  
  // App primary bg
  content = content.replace(/bg-\[#002D5E\]/g, 'bg-app-primary');
  
  // Hardcoded whites and grays
  content = content.replace(/bg-white/g, 'bg-app-card');
  content = content.replace(/bg-slate-50/g, 'bg-app-bg');
  content = content.replace(/bg-gray-50/g, 'bg-app-bg');
  
  // Text colors on primary
  // Carefully replace text-white when inside bg-app-primary or similar
  content = content.replace(/text-white/g, 'text-app-on-primary');
  
  // Text colors on card/bg
  content = content.replace(/text-gray-900/g, 'text-app-text');
  content = content.replace(/text-slate-900/g, 'text-app-text');
  content = content.replace(/text-gray-800/g, 'text-app-text');
  content = content.replace(/text-slate-800/g, 'text-app-text');
  content = content.replace(/text-primary/g, 'text-app-text');
  
  // Muted text
  content = content.replace(/text-gray-500/g, 'text-app-muted');
  content = content.replace(/text-gray-400/g, 'text-app-muted');
  content = content.replace(/text-gray-600/g, 'text-app-muted');
  content = content.replace(/text-slate-500/g, 'text-app-muted');

  // Borders
  content = content.replace(/border-\[#002D5E\]/g, 'border-app-primary');
  content = content.replace(/shadow-blue-900\/20/g, 'shadow-app-primary/20');
  content = content.replace(/text-blue-900/g, 'text-app-text');
  content = content.replace(/text-blue-800/g, 'text-app-text');
  content = content.replace(/bg-blue-50/g, 'bg-app-primary/10');
  content = content.replace(/text-blue-600/g, 'text-app-primary');
  content = content.replace(/bg-blue-600/g, 'bg-app-primary');
  content = content.replace(/text-blue-700/g, 'text-app-primary');

  // Specific check for text visibility on cards
  content = content.replace(/text-gray-300/g, 'text-app-muted');
  content = content.replace(/bg-app-card\/10 text-app-on-primary/g, 'bg-app-card/20 text-app-on-primary');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
