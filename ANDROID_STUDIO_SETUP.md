# 🤖 Android Studio Setup for Buscor Inspection App

## 📥 **Step 1: Download Android Studio**

1. **Download**: https://developer.android.com/studio
2. **File**: `android-studio-2024.2.1.12-windows.exe` (or latest)
3. **Size**: ~1GB download
4. **Installation**: Follow the setup wizard

## ⚙️ **Step 2: Android Studio Installation**

### **During Installation:**
1. ✅ **Custom Installation** (recommended)
2. ✅ **Android SDK**
3. ✅ **Android SDK Platform**
4. ✅ **Android Virtual Device**
5. ✅ **Performance (Intel HAXM)** - if available

### **SDK Location:**
- **Default**: `C:\Users\User\AppData\Local\Android\Sdk`
- **Remember this path** - you'll need it!

## 🔧 **Step 3: Configure Environment Variables**

### **Method A: Through System Properties**
1. **Right-click** "This PC" → **Properties**
2. **Advanced System Settings** → **Environment Variables**
3. **System Variables** → **New**:
   - **Variable**: `ANDROID_HOME`
   - **Value**: `C:\Users\User\AppData\Local\Android\Sdk`
4. **Edit PATH** → **Add**:
   - `C:\Users\User\AppData\Local\Android\Sdk\platform-tools`
   - `C:\Users\User\AppData\Local\Android\Sdk\tools`

### **Method B: PowerShell Commands**
```powershell
# Set ANDROID_HOME environment variable
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\User\AppData\Local\Android\Sdk", "User")

# Add to PATH
$path = [Environment]::GetEnvironmentVariable("PATH", "User")
$newPath = $path + ";C:\Users\User\AppData\Local\Android\Sdk\platform-tools;C:\Users\User\AppData\Local\Android\Sdk\tools"
[Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
```

## 📱 **Step 4: Create Virtual Device (AVD)**

### **In Android Studio:**
1. **Tools** → **AVD Manager**
2. **Create Virtual Device**
3. **Choose Device**: Pixel 6 (recommended)
4. **System Image**: Android 14 (API 34) - **Download if needed**
5. **Name**: `Buscor_Test_Device`
6. **Finish**

## ✅ **Step 5: Verify Installation**

### **Test Commands** (in new PowerShell window):
```powershell
# Check Android SDK
adb version

# Check environment variables
echo $env:ANDROID_HOME

# List devices
adb devices
```

## 🚀 **Step 6: Build Buscor App**

### **Once Android Studio is set up:**
```bash
# Navigate to project
cd "C:\Users\User\OneDrive\Documents\bus_inspection_app\busco_inspection_app_v2"

# Start AVD (if not running)
# Use Android Studio AVD Manager to start your virtual device

# Build and run
npx expo run:android
```

## 📋 **Installation Checklist**

- [ ] Android Studio downloaded and installed
- [ ] Android SDK installed (API 34 recommended)
- [ ] ANDROID_HOME environment variable set
- [ ] Platform-tools added to PATH
- [ ] Virtual device created and tested
- [ ] ADB command working
- [ ] Ready to build Buscor app!

## ⏱️ **Expected Timeline**

- **Download**: 10-15 minutes (depending on internet)
- **Installation**: 15-20 minutes
- **Configuration**: 10-15 minutes
- **Testing**: 5-10 minutes
- **Total**: 45-60 minutes

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **"adb not found"**
   - Restart PowerShell after setting environment variables
   - Verify PATH includes platform-tools directory

2. **"ANDROID_HOME not set"**
   - Check environment variable spelling
   - Restart computer if needed

3. **Virtual device won't start**
   - Enable Hyper-V or Intel HAXM
   - Check system requirements

4. **Build fails**
   - Ensure virtual device is running
   - Check project permissions

## 🎯 **Once Complete**

You'll be able to:
- ✅ Build APK files locally
- ✅ Test on virtual devices
- ✅ Generate release builds for Play Store
- ✅ Full control over the build process

## 📞 **Need Help?**

- **Android Studio Docs**: https://developer.android.com/studio/intro
- **Expo + Android Studio**: https://docs.expo.dev/workflow/android-studio-emulator/

---

**Let's get this professional Buscor app built! 🚌📱**