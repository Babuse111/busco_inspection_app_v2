# 🏗️ Building Buscor App with Android Studio

## 🎯 **Once Android Studio is Installed**

### **Step 1: Verify Setup**
```bash
# Run verification script
npm run verify-setup

# OR manually check:
adb version
echo $env:ANDROID_HOME
```

### **Step 2: Start Virtual Device**
1. **Open Android Studio**
2. **Tools** → **AVD Manager** 
3. **Start** your virtual device (green play button)
4. **Wait** for device to fully boot up

### **Step 3: Build Development Version**
```bash
# Build and install on device/emulator
npm run android

# This will:
# - Build the React Native app
# - Install on your virtual device
# - Start the app automatically
```

### **Step 4: Build Release APK (for Play Store)**
```bash
# First build the release version
npm run android:build

# Then generate APK file
npm run android:apk

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

### **Step 5: Build AAB (App Bundle - Preferred)**
```bash
# Generate AAB for Play Store
npm run android:bundle

# AAB location:
# android/app/build/outputs/bundle/release/app-release.aab
```

## 📱 **Testing Your App**

### **During Development:**
1. **Hot Reload**: Changes appear instantly
2. **Chrome DevTools**: `j` in terminal for debugger
3. **Shake Device**: Open developer menu
4. **Network Tab**: Monitor API calls

### **Testing Checklist:**
- [ ] Login with test credentials
- [ ] Navigate to Pre-Trip Inspection
- [ ] Check all 31 inspection items
- [ ] Add individual notes to items
- [ ] Test camera functionality
- [ ] Test photo upload to cloud
- [ ] Submit inspection
- [ ] Verify data in Supabase dashboard

## 🚀 **Play Store Preparation**

### **Generate Signed APK/AAB:**

1. **Create Keystore** (one-time setup):
```bash
cd android/app
keytool -genkey -v -keystore buscor-release-key.keystore -alias buscor-key -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configure Signing** in `android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
```

3. **Build Signed Release**:
```bash
npm run android:bundle
```

## 🔧 **Common Commands**

```bash
# Development build
npm run android

# Release build (for testing)
npm run android:build

# Generate APK
npm run android:apk

# Generate AAB (Play Store)
npm run android:bundle

# Clean build
cd android && ./gradlew clean

# Check setup
npm run verify-setup
```

## 📊 **Build Output Files**

### **Development APK:**
- **Location**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Use**: Testing on devices

### **Release APK:**
- **Location**: `android/app/build/outputs/apk/release/app-release.apk`
- **Use**: Distribution, testing, sideloading

### **Release AAB:**
- **Location**: `android/app/build/outputs/bundle/release/app-release.aab`
- **Use**: Google Play Store upload ⭐

## 🎯 **Final Play Store Steps**

1. **Generate AAB**: `npm run android:bundle`
2. **Test Thoroughly**: Install and test all features
3. **Upload to Play Console**: Use the .aab file
4. **Add Store Listing**: Copy from `store-listing.md`
5. **Submit for Review**: 2-3 day approval process

## 🏆 **Success Indicators**

✅ **App builds without errors**  
✅ **Installs on virtual device**  
✅ **All 31 inspection items work**  
✅ **Camera captures and uploads photos**  
✅ **Data syncs to Supabase**  
✅ **Professional UI displays correctly**  
✅ **AAB file generated successfully**  

## 🚨 **Troubleshooting**

### **Build Fails:**
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npm run android
```

### **Device Not Found:**
```bash
# Check devices
adb devices

# Restart ADB
adb kill-server
adb start-server
```

### **Metro Bundle Error:**
```bash
# Clear cache
npx expo start --clear
```

---

## 🎉 **You're Almost There!**

Once Android Studio is set up, you'll be able to:
- ✅ Build the app locally
- ✅ Test on virtual devices
- ✅ Generate Play Store files
- ✅ Full control over deployment

**Your Buscor Inspection App will be live soon!** 🚌📱✨