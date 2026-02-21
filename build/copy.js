#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

console.log('📦 Building extension...');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

// Files to copy to dist
const filesToCopy = [
  'manifest.json',
  'background.js',
  'popup.html',
  'popup.js',
  'recorder.html',
  'recorder.js',
  'icon.svg',
  'icon16.png',
  'icon32.png',
  'icon48.png',
  'icon128.png'
];

async function build() {
  try {
    // Create dist directory if it doesn't exist
    await fs.ensureDir(distDir);
    console.log('✅ Created dist directory');

    // Copy each file
    for (const file of filesToCopy) {
      const srcPath = path.join(rootDir, file);
      const destPath = path.join(distDir, file);

      if (await fs.pathExists(srcPath)) {
        await fs.copy(srcPath, destPath);
        console.log(`✅ Copied: ${file}`);
      } else {
        console.warn(`⚠️  File not found: ${file}`);
      }
    }

    console.log('🎉 Build completed successfully');
    console.log(`📁 Extension built in: ${distDir}`);
  } catch (error) {
    console.error('❌ Error during build:', error.message);
    process.exit(1);
  }
}

build();
