# Google Maps Setup Guide

## Android Crash Fix

The Android crash in your map section is caused by missing Google Maps API key configuration. Follow these steps to fix it:

### 1. Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps SDK for Android
   - Places API (optional, for enhanced functionality)
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key

### 2. Configure the API Key

1. Open `android/app/src/main/AndroidManifest.xml`
2. Find this line:
   ```xml
   <meta-data
     android:name="com.google.android.geo.API_KEY"
     android:value="YOUR_GOOGLE_MAPS_API_KEY_HERE"/>
   ```
3. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key

### 3. Restrict the API Key (Recommended)

1. In Google Cloud Console, go to your API key
2. Click "Restrict key"
3. Under "Application restrictions", select "Android apps"
4. Add your app's package name: `com.constantinom.monadero`
5. Add your SHA-1 certificate fingerprint (for debug builds)

### 4. Get SHA-1 Fingerprint (Debug)

Run this command in your project root:
```bash
cd android && ./gradlew signingReport
```

Look for the SHA-1 value under "debug" variant.

### 5. Clean and Rebuild

After adding the API key:
```bash
cd android
./gradlew clean
cd ..
npx expo run:android
```

## Alternative: Use Environment Variables

For better security, you can use environment variables:

1. Create `.env` file in your project root:
   ```
   GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

2. Install react-native-dotenv:
   ```bash
   npm install react-native-dotenv
   ```

3. Update your babel.config.js to include the plugin

4. Reference the key in your code

## Troubleshooting

- **Still crashing?** Check that the API key is valid and has the correct permissions
- **Map not loading?** Verify internet connection and API key restrictions
- **Permission errors?** Ensure location permissions are granted in app settings

## Cost Note

Google Maps API has usage limits and may incur costs for high usage. Monitor your usage in Google Cloud Console.
