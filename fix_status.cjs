const fs = require('fs');

let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

// remove lines like `"status": "Operasyonel Durum",`
content = content.replace(/^\s*"status":\s*"[^"]*",?\s*$/gm, '');

fs.writeFileSync('src/lib/i18n.ts', content, 'utf8');
console.log("Fixed duplicate status");
