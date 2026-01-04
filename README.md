# 🎥 Screen Recorder Chrome Extension

> A modern, professional screen recording Chrome extension with Material 3 Expressive design.

![Version](https://img.shields.io/badge/version-1.4.0-blue.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

- 🎬 **Screen Recording** - Record screen, windows, or tabs with high quality
- 🎤 **Audio Support** - Microphone recording with automatic audio merging
- 🪟 **Smart Interface** - Auto-minimizing recorder window with smart stop functionality
- 💾 **Auto-Save** - Automatic download to Downloads folder
- 🎨 **Modern UI** - Material 3 Expressive design with dark mode support
- ♿ **Accessible** - Full ARIA support and keyboard navigation
- ⚡ **Performant** - Optimized recording with multiple format support (MP4/WebM)

## 🚀 Quick Start

### Installation

#### From Chrome Web Store
1. Visit Chrome Web Store (link coming soon)
2. Click "Add to Chrome"
3. Grant the necessary permissions

#### From Source
```bash
git clone https://github.com/paean-ai/chrome-recorder-extension.git
cd chrome-recorder-extension
bun install
bun run build
```

Then load it in Chrome:
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist/` folder

### How to Use

1. Click the Screen Recorder icon in your browser toolbar
2. Click **"Start Recording"** in the popup
3. Select your screen, window, or tab to record
4. The recorder window minimizes automatically
5. Record your content
6. Click the recorder window in your taskbar to stop recording

**Pro Tip**: Recording stops instantly when you focus the recorder window - no need to find the stop button!

## 🛠️ Development

### Prerequisites
- Chrome/Edge browser (latest version)
- Bun 1.0+ or Node.js 16+ (for build tools)
- Git

### Setup
```bash
# Clone the repository
git clone https://github.com/paean-ai/chrome-recorder-extension.git
cd chrome-recorder-extension

# Install dependencies (if using build tools)
bun install

# Start development
bun run dev
```

### Project Structure
```
screen-recorder-extension/
├── manifest.json          # Extension manifest
├── popup.html            # Main popup interface
├── popup.js              # Popup logic
├── recorder.html          # Recorder interface
├── recorder.js           # Recording logic
├── background.js         # Service worker
├── icon.svg             # Extension icon
├── README.md            # This file
├── PRIVACY_POLICY.md    # Privacy policy
├── LICENSE             # MIT License
└── build/              # Build scripts
```

## 🔧 Build & Deployment

### Build Commands
```bash
# Development build with source maps
bun run build:dev

# Production build (minified)
bun run build:prod

# Package for distribution
bun run package

# Clean build artifacts
bun run clean
```

### Manual Loading for Testing
1. Run `bun run build:dev`
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist/` folder

### Package Creation
```bash
# Creates a zip file in the releases/ directory
bun run package
```

## 🧪 Testing

### Manual Testing
1. **Load Extension**: Follow development setup instructions
2. **Basic Recording**: Test screen, window, and tab recording
3. **Audio Testing**: Verify microphone recording works
4. **UI Testing**: Check all buttons and interactions
5. **Accessibility**: Test keyboard navigation and screen readers
6. **Cross-browser**: Test in Chrome and Edge (Chromium-based)

### Test Checklist
- [ ] Extension loads without errors
- [ ] Popup opens and displays correctly
- [ ] Recording starts successfully for all capture types
- [ ] Audio is recorded when permission is granted
- [ ] Recording stops when window is focused
- [ ] Files download correctly to Downloads folder
- [ ] UI responds to dark/light mode changes
- [ ] Keyboard navigation works throughout
- [ ] Extension works in Chrome and Edge
- [ ] No console errors during normal operation

## 🎨 Design System

The extension uses Material 3 Expressive design principles:

### Color Palette
- **Primary**: `#6750A4` (Purple)
- **Surface**: `#FEF7FF` (Light cream)
- **Error**: `#BA1A1A` (Red)
- **Success**: `#146C2E` (Green)

### Typography
- **Font Family**: Roboto, system-ui
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold)

### Spacing
- **Scale**: 4px, 8px, 16px, 24px, 32px
- **Border Radius**: 8px, 12px, 16px, 20px

## 📦 Release Process

### Version Bump
```bash
# Update version in manifest.json and package.json
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

### Release Steps
1. Update version numbers
2. Update CHANGELOG.md
3. Run `npm run build:prod`
4. Test the build thoroughly
5. Create release package: `bun run package`
6. Submit to Chrome Web Store
7. Create a GitHub release with assets

## 🔒 Privacy & Security

### Data Collection
- **No personal data** is collected or transmitted
- **No tracking** or analytics
- **All processing** happens locally on your device
- **Recordings** are saved only to your local Downloads folder

### Permissions Used
- `desktopCapture`: Required for screen recording access
- `downloads`: Required for automatic file saving

See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for detailed privacy information.

## 🐛 Troubleshooting

### Common Issues

#### Extension won't load
- Check Chrome version (requires latest Chrome)
- Ensure all files are present
- Check the Chrome developer console for errors

#### Recording fails to start
- Verify screen recording permissions
- Check if another app is using the camera/microphone
- Restart Chrome and try again

#### Audio not recorded
- Microphone permission must be granted
- Check system audio input settings
- Some systems may not support audio recording

#### Files not downloading
- Check Downloads folder permissions
- Ensure Chrome has file system access
- Try disabling the Auto-Save toggle

### Debug Mode
Enable console logging:
1. Open `chrome://extensions/`
2. Find Screen Recorder
3. Click "Inspect views: background page"
4. Check console for error messages

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/paean-ai/chrome-recorder-extension)
- [Chrome Web Store](https://chrome.google.com/webstore) (coming soon)
- [Report Issues](https://github.com/paean-ai/chrome-recorder-extension/issues)
- [Privacy Policy](PRIVACY_POLICY.md)

## 👥 Maintainers

- **[@paean-ai](https://github.com/paean-ai)** - Development and maintenance

---

**Made with ❤️ by the [Paean AI](https://github.com/paean-ai) team**