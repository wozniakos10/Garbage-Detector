# EcoSort

AI-powered waste classification mobile app built with React Native and ExecuTorch.

## About

EcoSort uses on-device machine learning to classify waste into 10 categories (plastic, paper, glass, metal, etc.) through your phone camera. The app works completely offline.

**Tech Stack**: Expo 54, React Native 0.81, TypeScript, ExecuTorch ML runtime

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npx expo start

```

## Project Structure

```
app/
  index.tsx              # Main app state machine
components/              # UI components (Home, Camera, Results, History)
hooks/
  useGarbageDetection.ts    # ML inference pipeline
constants/
  wasteClasses.ts        # Waste categories metadata
assets/
  models/model.pte       # mobilenet_v3_large model 
```

## Building Production Apps

### What is EAS?

**EAS (Expo Application Services)** is a cloud build service that compiles your React Native app without needing Android SDK or macOS/Xcode installed locally.

**Benefits:**
- Build iOS apps without a Mac
- No Android SDK setup required
- 30 free builds/month
- CI/CD ready

### Build Android APK

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login (create free account at expo.dev)
eas login

# 3. Configure project (first time only)
eas build:configure

# 4. Build APK for testing
eas build --platform android --profile preview

# 5. Download .apk from link and install on device
```

The build takes ~10-20 minutes in the cloud. Track progress at: https://expo.dev

**Install APK:**
1. Download `.apk` from build link
2. Transfer to Android device
3. Enable "Install from unknown sources" in Settings
4. Open file and install

### Build iOS (Cloud)

```bash
eas build --platform ios --profile preview
```

Requires Apple Developer account (free for development, $99/year for App Store).

### Local Builds (Alternative to EAS)

If you prefer to build locally instead of using EAS cloud service:

**Android:**
```bash
# Requires Android SDK installed
npx expo run:android --variant release
```

**iOS:**
```bash
# Requires macOS with Xcode installed
npx expo run:ios --device --configuration Release
```

For local builds, you need to set up native development environment (Android Studio for Android, Xcode for iOS).

### Build Profiles (`eas.json`)

- **development** - Dev client with hot reload
- **preview** - APK for testing (installable directly)
- **production** - Production build


## ML Model Details

**Runtime**: ExecuTorch (Meta AI framework for on-device ML)
- **Model**: Custom trained `.pte` format (16.8 MB)
- **Input**: 256x256 RGB images
- **Classes**: 10 waste categories
- **Preprocessing**: ImageNet normalization
- **Inference**: 100% offline (no internet required)

### Model Training & Export
The model was trained using the custom codebase available at:
[Garbage-Detector-Model](https://github.com/Kujonick/Garbage-Detector-Model)

This repository contains implementations for:
- Dataset merging and preprocessing
- MobileNet model training
- Exporting models to `.pte` format using ExecuTorch

## Key Features

- Real-time waste classification via camera
- 10 waste categories with recycling tips
- Scan history (up to 20 items)
- Works completely offline
- Polish UI localization

## Development

```bash
npm start              # Dev server
npx expo run android   # Android emulator
npx expo run ios       # iOS simulator
```


## Documentation

- [Expo Docs](https://docs.expo.dev/)
- [EAS Build Guide](https://docs.expo.dev/build/introduction/)
- [ExecuTorch](https://pytorch.org/executorch/)


