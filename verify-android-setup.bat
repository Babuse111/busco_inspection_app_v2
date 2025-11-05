@echo off
echo 🔍 Checking Android Studio Setup for Buscor App...
echo.

echo ✅ Checking ANDROID_HOME...
if defined ANDROID_HOME (
    echo ✓ ANDROID_HOME is set to: %ANDROID_HOME%
) else (
    echo ❌ ANDROID_HOME is not set!
    echo Please set ANDROID_HOME to your Android SDK location
    goto :error
)

echo.
echo ✅ Checking ADB (Android Debug Bridge)...
adb version >nul 2>&1
if %errorlevel%==0 (
    echo ✓ ADB is working!
    adb version | findstr "Android Debug Bridge"
) else (
    echo ❌ ADB not found in PATH!
    echo Please add platform-tools to your PATH
    goto :error
)

echo.
echo ✅ Checking for connected devices...
adb devices
echo.

echo ✅ Checking Java...
java -version >nul 2>&1
if %errorlevel%==0 (
    echo ✓ Java is available!
) else (
    echo ⚠️ Java not found - Android Studio should provide this
)

echo.
echo 🎉 Android Studio setup verification complete!
echo.
echo 🚀 Ready to build Buscor Inspection App!
echo.
echo To build your app, run:
echo   npx expo run:android
echo.
pause
goto :end

:error
echo.
echo ❌ Setup incomplete. Please follow ANDROID_STUDIO_SETUP.md
echo.
pause

:end