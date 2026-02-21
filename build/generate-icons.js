#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Generate PNG icons from icon.svg using ImageMagick.
// Requires: magick (ImageMagick 7+)
async function generateIcons() {
  console.log('🎨 Generating PNG icons from icon.svg...');

  const rootDir = path.join(__dirname, '..');
  const svgPath = path.join(rootDir, 'icon.svg');
  const sizes = [16, 32, 48, 128];

  for (const size of sizes) {
    const outPath = path.join(rootDir, `icon${size}.png`);
    // -background none  : preserve transparency
    // -strip            : remove all metadata (timestamps, comments, etc.)
    execSync(
      `magick -background none "${svgPath}" -resize ${size}x${size} -strip "${outPath}"`,
      { stdio: 'inherit' }
    );
    console.log(`✅ Created: icon${size}.png`);
  }

  console.log('🎉 All icons generated successfully!');
}

generateIcons().catch((err) => {
  console.error('❌ Icon generation failed:', err.message);
  console.error('   Make sure ImageMagick 7+ is installed (brew install imagemagick)');
  process.exit(1);
});
