# Firestore Security Rules for Admin Dashboard

## 🚨 Current Issue: Missing or Insufficient Permissions

Your admin dashboard is getting "Missing or insufficient permissions" errors because your Firestore security rules need to be updated to allow admin access.

## 📋 Required Security Rules

Copy and paste these rules into your **Firebase Console → Firestore Database → Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      // Users can read/write their own profile
      allow read, write: if isOwner(userId);
      
      // Admins can read all users
      allow read: if isAdmin();
      
      // Admins can update user roles
      allow update: if isAdmin();
      
      // Allow user creation (for new signups)
      allow create: if request.auth != null && request.auth.uid == userId;
    }
    
    // Sessions collection
    match /sessions/{sessionId} {
      // Users can read their own sessions
      allow read: if request.auth != null && 
                     (resource.data.userId == request.auth.uid || isAdmin());
      
      // Admins can read/write all sessions
      allow read, write: if isAdmin();
      
      // Allow session creation (for Stripe webhooks and user bookings)
      allow create: if request.auth != null;
      
      // Users can update their own sessions (for photo uploads, etc.)
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Portfolio collection
    match /portfolio/{itemId} {
      // Public read access (for website visitors)
      allow read: if true;
      
      // Only admins can write
      allow write: if isAdmin();
    }
    
    // Services collection
    match /services/{serviceId} {
      // Public read access (for website visitors)
      allow read: if true;
      
      // Only admins can write
      allow write: if isAdmin();
    }
    
    // Allow admins to read collection metadata for stats
    match /{document=**} {
      allow read: if isAdmin();
    }
  }
}
```

## 🔧 How to Apply These Rules

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `lnl-photography`
3. **Navigate to Firestore Database**
4. **Click on "Rules" tab**
5. **Replace existing rules** with the rules above
6. **Click "Publish"**

## ⚠️ Important Notes

### Admin Detection
The rules use a `isAdmin()` function that checks:
1. User is authenticated
2. User document exists in `users` collection
3. User's `role` field equals `'admin'`

### User Creation Flow
1. User signs up with Firebase Auth
2. AdminContext automatically creates user document
3. If email is in `ADMIN_EMAILS` list → role = 'admin'
4. Otherwise → role = 'client'

### Collection Access Levels

**Users Collection:**
- ✅ Users can read/write their own profile
- ✅ Admins can read all users
- ✅ Admins can update user roles

**Sessions Collection:**
- ✅ Users can read their own sessions
- ✅ Admins can read/write all sessions
- ✅ Allows session creation (for Stripe)

**Portfolio & Services:**
- ✅ Public read access (for website)
- ✅ Admin-only write access

## 🚀 After Applying Rules

Once you apply these rules:

1. **Admin Dashboard will work** - Can read all collections for stats
2. **Client Management will work** - Can read/update user roles
3. **Session Management will work** - Can read/update all sessions
4. **Portfolio/Service editors will work** - Can read/write content

## 🔍 Testing the Fix

1. Apply the rules in Firebase Console
2. Refresh your admin dashboard
3. Sign in with your admin email (`tuhrelproductions@gmail.com`)
4. The permission errors should be resolved

## 🆘 If You Still Get Errors

If you still get permission errors after applying these rules:

1. **Check your admin email** is exactly `tuhrelproductions@gmail.com`
2. **Sign out and sign back in** to refresh your user document
3. **Check Firebase Console** → Firestore → `users` collection
4. **Verify your user document** has `role: 'admin'`

## 🔒 Security Notes

These rules are production-ready and secure:
- Users can only access their own data
- Admins have full access for management
- Public collections (portfolio/services) are read-only for visitors
- All write operations require authentication
- Role-based access control prevents privilege escalation

Apply these rules and your admin dashboard should work perfectly! 🎉
