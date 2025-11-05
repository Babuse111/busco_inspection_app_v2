# Play Store Deployment Guide

## Prerequisites

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Login to Expo
```bash
eas login
```

### 3. Configure Project
```bash
eas build:configure
```

## Building for Production

### 1. Build Android AAB (App Bundle)
```bash
eas build --platform android --profile production
```

### 2. Build Preview APK (for testing)
```bash
eas build --platform android --profile preview
```

## Pre-Deployment Checklist

### App Configuration ✅
- [x] Package name: com.buscor.inspection
- [x] Version code: 1
- [x] Permissions properly configured
- [x] Icons and splash screens updated

### Store Assets Required 📋
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500 JPG/PNG)
- [ ] Screenshots (minimum 2, maximum 8)
- [ ] Short description (80 characters)
- [ ] Full description (4000 characters)
- [ ] Privacy policy URL

### Legal Requirements 📜
- [x] Privacy policy created
- [ ] Terms of service (if required)
- [ ] Content rating questionnaire completed
- [ ] App signing key generated

## Play Console Setup Steps

### 1. Create Play Console Account
- Visit https://play.google.com/console
- Pay one-time $25 registration fee
- Verify developer identity

### 2. Create New App
- Choose "Create app" in Play Console
- Fill in app details:
  - App name: "Buscor Inspection"
  - Default language: English
  - App or game: App
  - Free or paid: Free

### 3. Upload App Bundle
- Go to Production → Releases
- Upload the AAB file from EAS build
- Fill in release notes

### 4. Store Listing
- Copy content from store-listing.md
- Upload screenshots and graphics
- Set content rating
- Add contact details

### 5. App Content
- Complete content rating questionnaire
- Add privacy policy URL
- Set up app access (if applicable)

### 6. Release Management
- Choose release type (Internal testing → Production)
- Set up staged rollout percentages
- Configure update priority

## Testing Process

### 1. Internal Testing
```bash
# Build for internal testing
eas build --platform android --profile preview

# Share APK with team for testing
# Test all features thoroughly
```

### 2. Alpha/Beta Testing
- Upload to Play Console Internal Testing
- Add test users via email addresses
- Gather feedback and fix issues

### 3. Production Release
- Final testing on multiple devices
- Review Play Console warnings
- Submit for review

## App Signing

### Option 1: Google Play App Signing (Recommended)
- Let Google manage your app signing key
- Upload signing key to Play Console
- Google handles key security

### Option 2: Manual Signing
```bash
# Generate upload key
keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload

# Configure in eas.json
{
  "build": {
    "production": {
      "android": {
        "buildType": "aab",
        "credentialsSource": "local"
      }
    }
  }
}
```

## Post-Launch Monitoring

### 1. Monitor Metrics
- Downloads and installs
- User ratings and reviews
- Crash reports in Play Console

### 2. Update Strategy
- Regular bug fixes and improvements
- Version code increment for each release
- Release notes for user communication

### 3. User Feedback
- Respond to user reviews
- Address common complaints
- Implement feature requests

## Common Issues and Solutions

### Build Errors
```bash
# Clear cache and rebuild
expo r -c
eas build --platform android --clear-cache
```

### Permission Issues
- Ensure all permissions are in app.json
- Test on real devices, not emulators
- Check Android target SDK compatibility

### Upload Errors
- Verify AAB file integrity
- Check package name matches Play Console
- Ensure version code is incremented

## Useful Commands

```bash
# Check build status
eas build:list

# Download built artifacts
eas build:download --id [BUILD_ID]

# Submit to Play Store (after setup)
eas submit --platform android

# View project info
eas project:info
```

## Support Resources

- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [Android Developer Guidelines](https://developer.android.com/guide)

---

## Quick Start Commands

```bash
# 1. Build production AAB
eas build --platform android --profile production

# 2. Download the build
eas build:download

# 3. Upload to Play Console manually
# OR use automated submission (after setup):
eas submit --platform android
```