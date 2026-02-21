#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

console.log('🧹 Cleaning build artifacts...');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const packageFile = path.join(rootDir, 'screen-recorder-extension.zip');

async function clean() {
  try {
    // Remove dist directory if it exists
    if (await fs.pathExists(distDir)) {
      await fs.remove(distDir);
      console.log('✅ Removed dist directory');
    }

    // Remove package file if it exists
    if (await fs.pathExists(packageFile)) {
      await fs.remove(packageFile);
      console.log('✅ Removed package file');
    }

    console.log('🎉 Clean completed successfully');
  } catch (error) {
    console.error('❌ Error during clean:', error.message);
    process.exit(1);
  }
}

clean();
