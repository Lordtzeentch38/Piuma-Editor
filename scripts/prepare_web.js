const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const webDir = path.join(rootDir, 'src_web');

if (!fs.existsSync(webDir)) {
  fs.mkdirSync(webDir, { recursive: true });
}

// Copy index.html -> src_web/index.html
fs.copyFileSync(path.join(rootDir, 'index.html'), path.join(webDir, 'index.html'));

// Copy assets folder -> src_web/assets
const srcAssets = path.join(rootDir, 'assets');
const destAssets = path.join(webDir, 'assets');
if (fs.existsSync(srcAssets)) {
  if (!fs.existsSync(destAssets)) {
    fs.mkdirSync(destAssets, { recursive: true });
  }
  const files = fs.readdirSync(srcAssets);
  for (const file of files) {
    fs.copyFileSync(path.join(srcAssets, file), path.join(destAssets, file));
  }
}

console.log('src_web assets prepared successfully');
