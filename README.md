# GarbageDetector

GarbageDetector is a small mobile app that classifies waste types (glass, paper, plastic, mixed). It is built with Expo and React Native.

## Requirements
- Node.js 18+
- npm or yarn
- Expo CLI (bundled with `npx expo`)
- For native builds: Xcode 15+ on macOS for iOS, Android SDK/platform-tools for Android

## Run on your computer (local dev server)
```bash
npm install        # install dependencies
npx expo start     # start the Expo dev server
```
Open the web UI from the terminal link to choose web, Android, or iOS simulators, or scan the QR code with a device.

## Run on Android device
1. Install Expo Go from Google Play.
2. Connect the phone and computer to the same network (or start with a tunnel: `npx expo start --tunnel`).
3. Run `npx expo start` and scan the QR code in Expo Go to load the app.

### Build/install a native Android app (APK/AAB)
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview   # cloud build
```
Download the produced artifact link to your device and install (enable installs from unknown sources if using APK).

## Run on iOS device
1. On macOS, install Xcode 15+ and open it once to finish setup.
2. Install Expo Go from the App Store on your iPhone.
3. Run `npx expo start` and scan the QR code with the Camera app (iOS will open Expo Go and load the project).

### Build/install a native iOS app
Requires macOS with Xcode and an Apple ID.
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios --profile preview
```
Download the `.ipa` from the build link and install via TestFlight or Xcode’s Devices window. For local builds instead of cloud: `npx expo prebuild --platform ios` then open `ios/*.xcworkspace` and run on a connected device with automatic signing enabled.

## Useful commands
```bash
npx expo start -c      # clear cache and start
npx expo run:android   # local Android build & install (requires Android SDK)
npx expo run:ios       # local iOS build & install (requires Xcode)
```

