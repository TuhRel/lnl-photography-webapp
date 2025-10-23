# 🔧 Fix Firebase Storage CORS Issue - Step by Step

## 🎯 Problem
Firebase Storage is blocking fetch requests from your web app due to CORS (Cross-Origin Resource Sharing) policy. This prevents downloads from working properly.

## ✅ Solution: Configure Firebase Storage CORS

### **Method 1: Using Google Cloud Console (Easiest)**

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/storage/browser
   - Select your project: `lnl-photography`

2. **Find Your Storage Bucket:**
   - Click on `lnl-photography.firebasestorage.app`
   - Go to "Configuration" tab

3. **Edit CORS Configuration:**
   - Click "Edit CORS configuration"
   - Add this configuration:
   ```json
   [
     {
       "origin": ["*"],
       "method": ["GET", "HEAD"],
       "maxAgeSeconds": 3600
     }
   ]
   ```
   - Click "Save"

### **Method 2: Using Google Cloud SDK (Command Line)**

1. **Install Google Cloud SDK:**
   - Windows: Download from https://cloud.google.com/sdk/docs/install
   - Or use: `choco install gcloudsdk` (if you have Chocolatey)

2. **Authenticate:**
   ```bash
   gcloud auth login
   ```
   - This will open a browser window
   - Login with your Firebase/Google account

3. **Set Project:**
   ```bash
   gcloud config set project lnl-photography
   ```

4. **Apply CORS Configuration:**
   ```bash
   gsutil cors set cors.json gs://lnl-photography.firebasestorage.app
   ```

5. **Verify CORS Configuration:**
   ```bash
   gsutil cors get gs://lnl-photography.firebasestorage.app
   ```

### **CORS Configuration File (cors.json)**

The `cors.json` file in your project root contains:
```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```

**What this does:**
- `"origin": ["*"]` - Allows requests from any domain (including localhost)
- `"method": ["GET", "HEAD"]` - Allows read operations
- `"maxAgeSeconds": 3600` - Caches CORS headers for 1 hour

### **Method 3: Using Firebase CLI**

1. **Install Firebase CLI (if not already installed):**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Storage (if needed):**
   ```bash
   firebase init storage
   ```

4. **Apply CORS using gsutil:**
   - The Firebase CLI uses gsutil behind the scenes
   - Follow Method 2 steps 4-5

## ⚡ Quick Fix (Recommended)

**Use Method 1 (Google Cloud Console) - It's the fastest:**

1. Go to: https://console.cloud.google.com/storage/browser
2. Select: `lnl-photography.firebasestorage.app`
3. Click: "Configuration" → "Edit CORS"
4. Paste:
   ```json
   [{"origin": ["*"], "method": ["GET", "HEAD"], "maxAgeSeconds": 3600}]
   ```
5. Save

**That's it! Downloads will work immediately.**

## 🔒 Production Security (Optional)

For production, you may want to restrict origins:
```json
[
  {
    "origin": ["https://your-domain.com", "http://localhost:5173"],
    "method": ["GET", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```

## ✅ Testing

After applying CORS configuration:
1. Refresh your web app
2. Try "Download All" - should create ZIP file
3. Try individual downloads - should work without new tabs
4. Check browser console - no CORS errors

## 🆘 Troubleshooting

**If CORS still doesn't work:**
1. Wait 1-2 minutes for changes to propagate
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh the page (Ctrl+F5)
4. Check that you applied CORS to the correct bucket
5. Verify configuration with: `gsutil cors get gs://lnl-photography.firebasestorage.app`
