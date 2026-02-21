#!/usr/bin/env node

const zip = require('zip-a-folder');
const path = require('path');

console.log('📦 Packaging extension...');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const packageFile = path.join(rootDir, 'screen-recorder-extension.zip');

async function packageExtension() {
  try {
    // Check if dist directory exists
    const fs = require('fs-extra');
    if (!(await fs.pathExists(distDir))) {
      console.error('❌ dist directory not found. Run build first.');
      process.exit(1);
    }

    // Create zip file
    await zip.zip(distDir, packageFile);
    
    console.log('🎉 Extension packaged successfully');
    console.log(`📦 Package created: ${packageFile}`);
    console.log('📤 Ready to upload to Chrome Web Store!');
  } catch (error) {
    console.error('❌ Error during packaging:', error.message);
    process.exit(1);
  }
}

packageExtension();
