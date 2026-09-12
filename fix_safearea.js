const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('SafeAreaView') && /from ['"]react-native['"]/.test(content)) {
        let originalContent = content;
        
        // Handle `import { SafeAreaView, ... } from 'react-native'`
        content = content.replace(/,\s*SafeAreaView\b/g, '');
        content = content.replace(/\bSafeAreaView\s*,\s*/g, '');
        content = content.replace(/import\s*{\s*SafeAreaView\s*}\s*from\s*['"]react-native['"];?\r?\n/g, '');
        
        if (content !== originalContent) {
          if (!content.includes('react-native-safe-area-context')) {
              content = `import { SafeAreaView } from 'react-native-safe-area-context';\n` + content;
          }
          fs.writeFileSync(fullPath, content);
          console.log('Fixed', fullPath);
        }
      }
    }
  }
}
processDir(path.join(__dirname, 'src'));
