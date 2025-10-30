# 📱 Build Android APK Locally (No EAS Servers)

This guide shows you how to build your APK directly on your machine using Gradle.

## ✅ Prerequisites

1. **Java JDK 17+** (Required for Android builds)
   - Download: https://www.oracle.com/java/technologies/downloads/#java17
   - Set `JAVA_HOME` environment variable

2. **Android Studio** (Recommended but optional)
   - Download: https://developer.android.com/studio
   - Or install only Android SDK Command Line Tools

3. **Android SDK**
   - API Level 33 or higher
   - Set `ANDROID_HOME` environment variable
   - Example: `C:\Users\YourName\AppData\Local\Android\Sdk`

4. **Node.js & Bun** (Already installed)

---

## 🚀 Step-by-Step Build Process

### **Step 1: Generate Android Native Project**

```bash
cd interface/partner-app

# Option 1: Use npx (works better with Expo)
npx expo prebuild --platform android --clean

# Option 2: Use bunx (Bun's equivalent to npx)
bunx expo prebuild --platform android --clean

# Option 3: Direct path to local expo CLI
bun run node_modules/.bin/expo prebuild --platform android --clean
```

This creates the `android/` folder with all Gradle build files.

---

### **Step 2: Install Android Dependencies**

```bash
cd android

# Install Gradle dependencies
.\gradlew.bat dependencies
```

*(On Windows, use `.\gradlew.bat`. On Mac/Linux, use `./gradlew`)*

---

### **Step 3: Build Debug APK (Faster, for Testing)**

```bash
# From android/ directory
.\gradlew.bat assembleDebug

# Or from project root
cd interface/partner-app
bun exec expo run:android --variant debug
```

**APK Location:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

**APK Size:** ~15-25 MB

---

### **Step 4: Build Release APK (Optimized, Smaller)**

```bash
cd android

# Build release APK
.\gradlew.bat assembleRelease
```

**APK Location:**
```
android/app/build/outputs/apk/release/app-release.apk
```

**APK Size:** ~12-20 MB (with ProGuard/R8 optimization)

**Note:** Release APK requires signing. For testing, use debug APK.

---

### **Step 5: Check APK Size**

**Windows PowerShell:**
```powershell
$file = Get-Item android/app/build/outputs/apk/debug/app-debug.apk
Write-Host "APK Size: $([math]::Round($file.Length / 1MB, 2)) MB"
```

**Windows CMD:**
```cmd
dir android\app\build\outputs\apk\debug\app-debug.apk
```

**Mac/Linux:**
```bash
ls -lh android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🎯 Quick Build Script

Create a file `build-apk.ps1` (Windows) or `build-apk.sh` (Mac/Linux):

### **Windows (`build-apk.ps1`):**
```powershell
Write-Host "🔨 Building Android APK locally..." -ForegroundColor Green

# Generate native project
Write-Host "Step 1: Generating native Android project..."
npx expo prebuild --platform android --clean

# Build debug APK
Write-Host "Step 2: Building debug APK..."
cd android
.\gradlew.bat assembleDebug

# Show APK info
$apkPath = "app\build\outputs\apk\debug\app-debug.apk"
if (Test-Path $apkPath) {
    $size = (Get-Item $apkPath).Length / 1MB
    Write-Host "✅ APK built successfully!" -ForegroundColor Green
    Write-Host "📍 Location: $apkPath" -ForegroundColor Cyan
    Write-Host "📦 Size: $([math]::Round($size, 2)) MB" -ForegroundColor Cyan
} else {
    Write-Host "❌ APK not found!" -ForegroundColor Red
}

cd ..
```

**Run it:**
```powershell
.\build-apk.ps1
```

---

## 🔧 Environment Variables Setup

**Windows (PowerShell):**
```powershell
# Set JAVA_HOME (adjust path to your Java installation)
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', $env:JAVA_HOME, 'User')

# Set ANDROID_HOME (adjust path to your Android SDK)
$env:ANDROID_HOME = "C:\Users\YourName\AppData\Local\Android\Sdk"
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', $env:ANDROID_HOME, 'User')

# Add to PATH
$env:PATH += ";$env:ANDROID_HOME\tools;$env:ANDROID_HOME\platform-tools"
```

**Windows (CMD - Add to System Environment Variables):**
1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Go to "Advanced" → "Environment Variables"
3. Add:
   - `JAVA_HOME` = `C:\Program Files\Java\jdk-17`
   - `ANDROID_HOME` = `C:\Users\YourName\AppData\Local\Android\Sdk`
4. Add to PATH:
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\platform-tools`

---

## 📝 Alternative: Direct Gradle Commands

Once `android/` folder exists:

```bash
cd android

# Clean previous builds
.\gradlew.bat clean

# Build debug APK
.\gradlew.bat assembleDebug

# Build release APK (requires signing)
.\gradlew.bat assembleRelease

# Install APK to connected device
.\gradlew.bat installDebug
```

---

## 🎨 Install APK to Device

1. **Enable USB Debugging** on your Android device
2. **Connect device** via USB
3. **Install APK:**
   ```bash
   cd android
   .\gradlew.bat installDebug
   ```

Or manually:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🚨 Troubleshooting

### **Error: "JAVA_HOME not set"**
```powershell
# Check Java installation
java -version

# Set JAVA_HOME
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
```

### **Error: "ANDROID_HOME not set"**
- Install Android Studio
- Or download Android SDK Command Line Tools
- Set `ANDROID_HOME` environment variable

### **Error: "Gradle build failed"**
```bash
# Clean and rebuild
cd android
.\gradlew.bat clean
.\gradlew.bat assembleDebug --stacktrace
```

### **APK too large?**
- Enable ProGuard/R8 in `android/app/build.gradle`
- Remove unused assets
- Use App Bundle (AAB) instead of APK

---

## ⚡ Fastest Method (One Command)

```bash
cd interface/partner-app
npx expo prebuild --platform android --clean && cd android && .\gradlew.bat assembleDebug && cd ..
```

**APK will be at:** `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📊 Expected Results

| Build Type | Size | Build Time | Use Case |
|------------|------|------------|----------|
| Debug APK | ~15-25 MB | 3-5 min | Testing |
| Release APK | ~12-20 MB | 5-10 min | Distribution |

---

## ✅ Success Checklist

- [ ] Java JDK 17+ installed
- [ ] Android SDK installed
- [ ] Environment variables set (JAVA_HOME, ANDROID_HOME)
- [ ] `android/` folder generated (`expo prebuild`)
- [ ] APK built successfully
- [ ] APK size checked
- [ ] APK installed on device (optional)

**You're ready to build locally! 🎉**

