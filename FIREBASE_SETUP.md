# Firebase Setup and Permission Issues

## Issues Identified

Based on the error messages, you're experiencing:

1. **Firebase Storage CORS errors**
2. **Missing or insufficient permissions**
3. **404 errors for cart and profile routes**

## Solutions

### 1. Firebase Security Rules

You need to update your Firebase Security Rules for both Firestore and Storage.

#### Firestore Rules (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Recipes can be read by anyone, written by authenticated users
    match /recipes/{recipeId} {
      allow read: if true; // Anyone can read recipes
      allow write: if request.auth != null; // Only authenticated users can write
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.userId || // Owner can update
         request.auth != null); // Or any authenticated user (for likes, etc.)
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

#### Storage Rules (`storage.rules`)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Recipe images - users can upload to their own folder
    match /recipeImages/{userId}/{allPaths=**} {
      allow read: if true; // Anyone can read recipe images
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Default rule for other files
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2. Environment Variables

Create a `.env.local` file (if not exists) and move your Firebase config there:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC01XSCBk5ug_ebflV8qgXBO5ql7Kx01nY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=aibridge-73844.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=aibridge-73844
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=aibridge-73844.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=663533012416
NEXT_PUBLIC_FIREBASE_APP_ID=1:663533012416:web:332341a048865d512cf425
```

### 3. Update Firebase Configuration

Update your `lib/firebase.ts` to use environment variables:

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}
```

### 4. Deploy Firebase Rules

Run these commands in your terminal:

```bash
# Install Firebase CLI if not installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not done)
firebase init

# Deploy the security rules
firebase deploy --only firestore:rules,storage
```

### 5. CORS Configuration for Firebase Storage

Firebase Storage CORS should be configured automatically, but if issues persist, you can configure it manually:

Create a `cors.json` file:
```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

Then run:
```bash
gsutil cors set cors.json gs://aibridge-73844.appspot.com
```

### 6. Missing Routes

Create the missing routes:

#### `/app/cart/page.tsx`
```tsx
export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Shopping Cart</h1>
      <p>Cart functionality coming soon...</p>
    </div>
  )
}
```

#### `/app/profile/page.tsx`
```tsx
export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Profile</h1>
      <p>Profile functionality coming soon...</p>
    </div>
  )
}
```

### 7. Alternative Upload Method (Fallback)

If Firebase Storage continues to have issues, you can implement a fallback using base64 encoding:

```typescript
// In handleSubmitRecipe, replace the upload section with:
const uploadImageAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Then use it:
const imageUrl = await uploadImageAsBase64(recipeImage)
```

### 8. Testing Authentication

Add this debug component to test authentication:

```tsx
// Add this to your upload page for debugging
useEffect(() => {
  console.log("Auth state:", { user: user?.uid, loading: authLoading })
  if (user) {
    user.getIdToken().then(token => {
      console.log("User token:", token.substring(0, 20) + "...")
    }).catch(err => {
      console.error("Token error:", err)
    })
  }
}, [user, authLoading])
```

## Next Steps

1. Update Firebase Security Rules
2. Deploy the rules using Firebase CLI
3. Create missing route files
4. Test the upload functionality
5. Monitor browser console for any remaining errors

Let me know if you need help with any of these steps!
