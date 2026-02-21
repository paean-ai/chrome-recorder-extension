#!/usr/bin/env node

const chokidar = require('chokidar');
const path = require('path');
const { spawn } = require('child_process');

console.log('👀 Watching for file changes...');

const rootDir = path.join(__dirname, '..');

// Files to watch
const watchFiles = [
  'manifest.json',
  'background.js',
  'popup.html',
  'popup.js',
  'recorder.html',
  'recorder.js',
  'icon.svg'
].map(file => path.join(rootDir, file));

// Initialize watcher
const watcher = chokidar.watch(watchFiles, {
  ignored: /node_modules/,
  persistent: true,
  ignoreInitial: true
});

let isBuilding = false;

function runBuild() {
  if (isBuilding) {
    console.log('⏳ Build already in progress...');
    return;
  }

  isBuilding = true;
  console.log('🔄 Changes detected, running build...');

  const buildProcess = spawn('bun', ['run', 'build:dev'], {
    cwd: rootDir,
    stdio: 'inherit'
  });

  buildProcess.on('close', (code) => {
    isBuilding = false;
    if (code === 0) {
      console.log('✅ Build completed');
    } else {
      console.error(`❌ Build failed with code ${code}`);
    }
  });
}

// Watch for changes
watcher.on('change', (filePath) => {
  const fileName = path.basename(filePath);
  console.log(`📝 File changed: ${fileName}`);
  runBuild();
});

watcher.on('add', (filePath) => {
  const fileName = path.basename(filePath);
  console.log(`📁 File added: ${fileName}`);
  runBuild();
});

console.log('🎯 Watching files:');
watchFiles.forEach(file => {
  console.log(`   - ${path.basename(file)}`);
});

console.log('Press Ctrl+C to stop watching');
